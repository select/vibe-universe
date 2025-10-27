import { StarControls } from './star-controls.js?v=1';
// Helper function to get coordinates from mouse or touch event
function getEventCoordinates(event) {
	if (event.touches && event.touches.length > 0) {
		return {
			clientX: event.touches[0].clientX,
			clientY: event.touches[0].clientY,
		};
	} else if (event.changedTouches && event.changedTouches.length > 0) {
		return {
			clientX: event.changedTouches[0].clientX,
			clientY: event.changedTouches[0].clientY,
		};
	}
	return {
		clientX: event.clientX,
		clientY: event.clientY,
	};
}

// Calculate distance between two touch points for pinch gesture
function getTouchDistance(touch1, touch2) {
	const dx = touch1.clientX - touch2.clientX;
	const dy = touch1.clientY - touch2.clientY;
	return Math.sqrt(dx * dx + dy * dy);
}

// Snap angle to nearest snap point
function snapAngle(angle, snapPoints, threshold = 2) {
	for (let snapPoint of snapPoints) {
		if (Math.abs(angle - snapPoint) <= threshold) {
			return snapPoint;
		}
	}
	return angle;
}

export function initStarMap(allStars) {
	const canvas = document.getElementById('myCanvas');

	// Resize canvas to fill the visible screen
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	paper.setup(canvas);
	paper.settings.handleSize = 0;

	const center = paper.view.center;

	// Visualization state
	const state = {
		maxDistance: 15, // light years
		inclination: 60, // degrees
		rotation: 0, // degrees
		scale: 10, // pixels per light year
		isAutoRotating: true, // auto-rotation state
	};

	// Drag control variables
	let isDragging = false;
	let dragStartX = 0;
	let dragStartY = 0;
	let dragStartInclination = 0;
	let dragStartRotation = 0;
	let dragMoved = false;

	// Pinch zoom variables
	let isPinching = false;
	let lastPinchDistance = 0;

	// Auto-rotation variables
	let lastFrameTime = Date.now();
	const ROTATION_SPEED = 5; // degrees per second

	// Hover state variables
	let hoveredStar = null;
	const starHoverStates = new Map(); // starId -> { progress, radius, showLabel, animationId }
	let visibleStars = []; // Store visible stars for hover detection

	// Snap points
	const inclinationSnapPoints = [-60, -45, -30, 0, 30, 45, 60];
	const rotationSnapPoints = [0, 45, 90, 135, 180, 225, 270, 315];

	// Paper.js groups
	let axisGroup = new paper.Group();
	let starGroup = new paper.Group();

	// Convert parsecs to light years (1 parsec = 3.26156 light years)
	const PARSECS_TO_LY = 3.26156;

	// Convert 3D position to 2D screen coordinates with rotation and inclination
	function project3DTo2D(x, y, z, inclination, rotation) {
		// First apply rotation around Y axis (vertical axis)
		const rotRad = (rotation * Math.PI) / 180;
		const xRot = x * Math.cos(rotRad) + z * Math.sin(rotRad);
		const zRot = -x * Math.sin(rotRad) + z * Math.cos(rotRad);

		// Then apply inclination (rotation around X axis)
		const incRad = (inclination * Math.PI) / 180;
		const screenX = xRot;
		const screenY = y * Math.cos(incRad) - zRot * Math.sin(incRad);

		return new paper.Point(screenX, screenY);
	}

	// Draw XYZ axis indicators
	function drawAxisLines() {
		axisGroup.removeChildren();

		const axisLength = 50;

		// X-axis (Red)
		const xEnd3D = { x: axisLength, y: 0, z: 0 };
		const xEndPos = project3DTo2D(
			xEnd3D.x,
			xEnd3D.y,
			xEnd3D.z,
			state.inclination,
			state.rotation,
		);
		const xLine = new paper.Path.Line(center, center.add(xEndPos));
		xLine.strokeColor = '#FF4444';
		xLine.strokeWidth = 1;
		xLine.opacity = 0.7;
		axisGroup.addChild(xLine);

		// Y-axis (Green) - note: in the data, Z is up
		const yEnd3D = { x: 0, y: 0, z: axisLength };
		const yEndPos = project3DTo2D(
			yEnd3D.x,
			yEnd3D.y,
			yEnd3D.z,
			state.inclination,
			state.rotation,
		);
		const yLine = new paper.Path.Line(center, center.add(yEndPos));
		yLine.strokeColor = '#44FF44';
		yLine.strokeWidth = 1;
		yLine.opacity = 0.7;
		axisGroup.addChild(yLine);

		// Z-axis (Blue) - Y in data
		const zEnd3D = { x: 0, y: axisLength, z: 0 };
		const zEndPos = project3DTo2D(
			zEnd3D.x,
			zEnd3D.y,
			zEnd3D.z,
			state.inclination,
			state.rotation,
		);
		const zLine = new paper.Path.Line(center, center.add(zEndPos));
		zLine.strokeColor = '#4444FF';
		zLine.strokeWidth = 1;
		zLine.opacity = 0.7;
		axisGroup.addChild(zLine);

		// Add axis labels
		const xLabelOffset = xEndPos.normalize(xEndPos.length + 10);
		const xLabel = new paper.PointText(center.add(xLabelOffset));
		xLabel.content = 'X';
		xLabel.fillColor = '#FF4444';
		xLabel.fontSize = 10;
		xLabel.fontFamily = 'monospace';
		xLabel.fontWeight = 'bold';
		xLabel.justification = 'center';
		xLabel.opacity = 0.7;
		axisGroup.addChild(xLabel);

		const yLabelOffset = yEndPos.normalize(yEndPos.length + 10);
		const yLabel = new paper.PointText(center.add(yLabelOffset));
		yLabel.content = 'Y';
		yLabel.fillColor = '#44FF44';
		yLabel.fontSize = 10;
		yLabel.fontFamily = 'monospace';
		yLabel.fontWeight = 'bold';
		yLabel.justification = 'center';
		yLabel.opacity = 0.7;
		axisGroup.addChild(yLabel);

		const zLabelOffset = zEndPos.normalize(zEndPos.length + 10);
		const zLabel = new paper.PointText(center.add(zLabelOffset));
		zLabel.content = 'Z';
		zLabel.fillColor = '#4444FF';
		zLabel.fontSize = 10;
		zLabel.fontFamily = 'monospace';
		zLabel.fontWeight = 'bold';
		zLabel.justification = 'center';
		zLabel.opacity = 0.7;
		axisGroup.addChild(zLabel);
	}

	// Calculate star color based on apparent magnitude and color index
	function getStarColor(mag, colorIndex) {
		// Color index (B-V): negative = blue, zero = white, positive = red
		let r, g, b;

		if (colorIndex < 0) {
			// Blue stars
			r = 0.6 + colorIndex * 0.5;
			g = 0.7 + colorIndex * 0.3;
			b = 1.0;
		} else if (colorIndex < 0.5) {
			// White stars
			const t = colorIndex / 0.5;
			r = 0.9 + t * 0.1;
			g = 0.9 - t * 0.1;
			b = 1.0 - t * 0.3;
		} else {
			// Red/Orange stars
			const t = Math.min((colorIndex - 0.5) / 1.0, 1);
			r = 1.0;
			g = 0.8 - t * 0.5;
			b = 0.7 - t * 0.6;
		}

		return new paper.Color(r, g, b);
	}

	// Calculate star size based on apparent magnitude (brighter = larger)
	function getStarSize(mag) {
		// Magnitude scale is inverted (lower number = brighter)
		// Sun has mag = -26.7, faintest visible stars ~6
		// Scale size exponentially based on magnitude
		const minSize = 0.5;
		const maxSize = 3;

		// Normalize magnitude to a 0-1 range (brighter = higher value)
		// Typical range: -1 (very bright) to 6 (faint)
		const normalized = Math.max(0, Math.min(1, (6 - mag) / 7));

		return minSize + normalized * (maxSize - minSize);
	}

	// Auto-rotation animation loop
	function animateRotation() {
		if (state.isAutoRotating && !isDragging && !isPinching && !hoveredStar) {
			const currentTime = Date.now();
			const deltaTime = (currentTime - lastFrameTime) / 1000; // Convert to seconds
			lastFrameTime = currentTime;

			// Update rotation without snap points
			state.rotation = (state.rotation + ROTATION_SPEED * deltaTime) % 360;

			drawAxisLines();
			drawStars();
			controlsInstance.updateDisplays();
		} else if (hoveredStar || starHoverStates.size > 0) {
			// Redraw when hovering to show animations
			drawAxisLines();
			drawStars();
			controlsInstance.updateDisplays();
		}

		// Continue animation loop
		requestAnimationFrame(animateRotation);
	}

	// Toggle auto-rotation
	function toggleAutoRotation() {
		state.isAutoRotating = !state.isAutoRotating;
		if (state.isAutoRotating) {
			lastFrameTime = Date.now();
		}
		return state.isAutoRotating;
	}

	// Animate radius change with smooth transition
	function animateStarRadius(starId, starSize, targetRadius, duration = 500) {
		const existingState = starHoverStates.get(starId);

		// If already animating, don't restart
		if (existingState && existingState.animationId) {
			return;
		}

		const startRadius = existingState ? existingState.radius : starSize;
		const startTime = Date.now();
		const isExpanding = targetRadius > startRadius;

		function step() {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Ease out cubic for smooth deceleration
			const eased = 1 - Math.pow(1 - progress, 3);
			const currentRadius = startRadius + (targetRadius - startRadius) * eased;

			// Update hover state
			const currentState = starHoverStates.get(starId) || {};
			starHoverStates.set(starId, {
				...currentState,
				progress: eased,
				radius: currentRadius,
				showLabel: progress >= 1 && isExpanding,
				animationId: progress < 1 ? requestAnimationFrame(step) : null,
				isAnimating: progress < 1,
				targetRadius: targetRadius,
				starSize: starSize,
			});

			if (progress >= 1) {
				// Animation complete
				const state = starHoverStates.get(starId);
				if (state) {
					state.isAnimating = false;
					state.animationId = null;

					// If this was an expansion and marked for contraction, start contracting
					if (isExpanding && state.shouldContractAfter) {
						state.shouldContractAfter = false;
						// Start contraction animation
						setTimeout(() => {
							const currentState = starHoverStates.get(starId);
							if (currentState) {
								animateStarRadius(starId, currentState.radius, starSize);
								if (hoveredStar === starId) {
									hoveredStar = null;
									canvas.style.cursor = 'grab';
								}
							}
						}, 3000); // 3 second delay
					}

					// If this was a contraction, clean up
					if (!isExpanding) {
						starHoverStates.delete(starId);
					}
				}
			}
		}

		step();
	}

	// Draw label with connector line for a star
	function drawStarLabel(position, radius, name, distance, luminosity) {
		// Line segment lengths
		const segment1Length = 15;
		const segment2Length = 20;
		const angle60 = (-60 * Math.PI) / 180;

		// Start at circle border on the lower-right
		const startPoint = position.add(
			new paper.Point(Math.cos(angle60) * radius, Math.sin(angle60) * radius),
		);

		// First segment: angled at -60°
		const segment1End = startPoint.add(
			new paper.Point(
				Math.cos(angle60) * segment1Length,
				Math.sin(angle60) * segment1Length,
			),
		);

		// Second segment: horizontal to the right
		const segment2End = segment1End.add(new paper.Point(segment2Length, 0));

		// Draw the connector line
		const connectorLine = new paper.Path();
		connectorLine.strokeColor = new paper.Color(0.6, 0.6, 0.6);
		connectorLine.strokeWidth = 0.5;
		connectorLine.add(startPoint);
		connectorLine.add(segment1End);
		connectorLine.add(segment2End);
		starGroup.addChild(connectorLine);

		// Draw the main label text (star name)
		const labelOffset = new paper.Point(5, 3);
		const label = new paper.PointText(segment2End.add(labelOffset));
		label.content = name;
		label.fillColor = 'white';
		label.fontSize = 11;
		label.fontFamily = 'monospace';
		label.justification = 'left';
		starGroup.addChild(label);

		// Draw distance below the name
		const distanceOffset = new paper.Point(5, 3 + 12); // 12px below name
		const distanceLabel = new paper.PointText(segment2End.add(distanceOffset));
		distanceLabel.content = `${distance.toFixed(2)} ly`;
		distanceLabel.fillColor = new paper.Color(0.7, 0.7, 0.7); // Slightly dimmed
		distanceLabel.fontSize = 9;
		distanceLabel.fontFamily = 'monospace';
		distanceLabel.justification = 'left';
		starGroup.addChild(distanceLabel);

		// Draw luminosity below the distance
		const lumOffset = new paper.Point(5, 3 + 12 + 11); // 11px below distance
		const lumLabel = new paper.PointText(segment2End.add(lumOffset));
		// Format luminosity: show scientific notation if very large/small
		let lumText;
		if (luminosity >= 100 || luminosity <= 0.01) {
			lumText = `${luminosity.toExponential(2)}☉`;
		} else {
			lumText = `${luminosity.toFixed(2)}☉`;
		}
		lumLabel.content = lumText;
		lumLabel.fillColor = new paper.Color(0.7, 0.7, 0.7); // Slightly dimmed
		lumLabel.fontSize = 9;
		lumLabel.fontFamily = 'monospace';
		lumLabel.justification = 'left';
		starGroup.addChild(lumLabel);
	}

	// Draw all stars
	function drawStars() {
		starGroup.removeChildren();

		// Filter stars by distance and update global visibleStars
		visibleStars = allStars.filter(
			(star) => star.dist > 0 && star.dist <= state.maxDistance,
		);

		// Update star count display
		document.getElementById('starCountValue').textContent = visibleStars.length;

		visibleStars.forEach((star, index) => {
			// Convert parsecs to light years and apply scale
			const x = star.x * PARSECS_TO_LY * state.scale;
			const y = star.y * PARSECS_TO_LY * state.scale;
			const z = star.z * PARSECS_TO_LY * state.scale;

			// Project to 2D
			const screenPos = project3DTo2D(x, y, z, state.inclination, state.rotation);
			const position = center.add(screenPos);

			// Calculate star appearance
			const size = getStarSize(star.mag);
			const color = getStarColor(star.mag, star.ci);

			// Check if star has a name (proper or bf)
			const hasName =
				(star.proper && star.proper.trim()) || (star.bf && star.bf.trim());
			const starName = star.proper && star.proper.trim() ? star.proper : star.bf;
			const starId = `star_${index}`;

			// Check hover state for this star
			const hoverState = starHoverStates.get(starId);
			let currentRadius = size;
			let shouldDrawLabel = false;

			if (hoverState) {
				currentRadius = hoverState.radius;
				shouldDrawLabel = hoverState.showLabel;
			}

			// Draw hover circle if star has a name and is being hovered
			if (hasName && hoverState) {
				const hoverCircle = new paper.Path.Circle(position, currentRadius);
				hoverCircle.strokeColor = 'white';
				hoverCircle.strokeWidth = 1;
				hoverCircle.fillColor = new paper.Color(1, 1, 1, 0.02); // Almost invisible
				hoverCircle.data = {
					star: star,
					starId: starId,
					isHoverCircle: true,
				};
				starGroup.addChild(hoverCircle);
			}

			// Draw the star
			const starCircle = new paper.Path.Circle(position, size);
			starCircle.fillColor = color;
			starCircle.strokeColor = color;
			starCircle.strokeWidth = 0.5;

			// Add glow effect for brighter stars
			if (star.mag < 2) {
				const glow = new paper.Path.Circle(position, size * 2);
				glow.fillColor = new paper.Color(color.red, color.green, color.blue, 0.2);
				starGroup.addChild(glow);
			}

			starGroup.addChild(starCircle);

			// Store star data for hover/click interactions
			starCircle.data = {
				star: star,
				starId: starId,
				hasName: hasName,
				starSize: size,
			};

			// Draw label if animation is complete
			if (shouldDrawLabel && hasName) {
				drawStarLabel(position, currentRadius, starName, star.dist, star.lum);
			}
		});

		// Update info text
		const infoDiv = document.getElementById('starInfoContent');
		infoDiv.innerHTML = `
			<strong>Visible Stars:</strong> ${visibleStars.length}<br>
			<strong>Max Distance:</strong> ${state.maxDistance} ly<br>
			<strong>Total Stars:</strong> ${allStars.length}
		`;
	}

	// Handle drag start
	function handleDragStart(event) {
		// Check if this is a two-finger pinch gesture
		if (event.touches && event.touches.length === 2) {
			isPinching = true;
			lastPinchDistance = getTouchDistance(event.touches[0], event.touches[1]);
			isDragging = false;
			return;
		}

		isPinching = false;
		const coords = getEventCoordinates(event);
		isDragging = true;
		dragStartX = coords.clientX;
		dragStartY = coords.clientY;
		dragStartInclination = state.inclination;
		dragStartRotation = state.rotation;
		dragMoved = false;
	}

	// Handle drag move
	function handleMove(event) {
		const coords = getEventCoordinates(event);

		// Handle hover detection when not dragging
		if (!isDragging && !isPinching) {
			const rect = canvas.getBoundingClientRect();
			const x = coords.clientX - rect.left;
			const y = coords.clientY - rect.top;
			const mousePoint = new paper.Point(x, y);

			// Check for hover over stars
			const hitResult = paper.project.hitTest(mousePoint, {
				fill: true,
				stroke: true,
				tolerance: 5,
			});

			let foundStar = null;

			if (hitResult && hitResult.item && hitResult.item.data) {
				const itemData = hitResult.item.data;
				// Check if we hit a star with a name or its hover circle
				if (itemData.hasName || itemData.isHoverCircle) {
					foundStar = itemData;
				}
			}

			// Handle hover state changes
			if (foundStar && foundStar.starId !== hoveredStar) {
				// Reset previous hover only if expansion animation is complete
				if (hoveredStar) {
					const prevHoverState = starHoverStates.get(hoveredStar);
					if (prevHoverState && !prevHoverState.isAnimating) {
						// Find the star size from the previous hover
						let prevStarSize = prevHoverState.starSize || 2;
						animateStarRadius(hoveredStar, prevHoverState.radius, prevStarSize);
					}
				}

				// Start new hover
				hoveredStar = foundStar.starId;
				const targetRadius = foundStar.starSize * 10; // 10x larger
				animateStarRadius(foundStar.starId, foundStar.starSize, targetRadius);
				canvas.style.cursor = 'pointer';
			} else if (!foundStar && hoveredStar) {
				// Mouse left all stars, schedule contraction only if expansion is complete
				const prevHoverState = starHoverStates.get(hoveredStar);
				if (prevHoverState && !prevHoverState.isAnimating) {
					let prevStarSize = prevHoverState.starSize || 2;
					animateStarRadius(hoveredStar, prevHoverState.radius, prevStarSize);
					hoveredStar = null;
					canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
				} else if (prevHoverState && prevHoverState.isAnimating) {
					// Mark for later contraction once animation completes
					prevHoverState.shouldContractAfter = true;
				}
			}
		}

		// Handle pinch zoom
		if (isPinching && event.touches && event.touches.length === 2) {
			const currentDistance = getTouchDistance(event.touches[0], event.touches[1]);
			const deltaDistance = currentDistance - lastPinchDistance;

			// Adjust scale
			const zoomSensitivity = 0.01;
			const zoomDelta = deltaDistance * zoomSensitivity;
			state.scale = Math.max(1, Math.min(50, state.scale + zoomDelta));

			lastPinchDistance = currentDistance;
			drawAxisLines();
			drawStars();
			controlsInstance.updateDisplays();
			return;
		}

		if (!isDragging) return;

		const deltaX = coords.clientX - dragStartX;
		const deltaY = coords.clientY - dragStartY;

		// Mark as dragged if moved more than 5 pixels
		if (Math.abs(deltaY) > 5 || Math.abs(deltaX) > 5) {
			dragMoved = true;
		}

		// Vertical drag: adjust inclination
		const inclinationChange = deltaY * 0.2;
		let newInclination = Math.max(
			-90,
			Math.min(90, dragStartInclination + inclinationChange),
		);
		state.inclination = snapAngle(newInclination, inclinationSnapPoints);

		// Horizontal drag: adjust rotation
		const rotationChange = -deltaX * 0.2;
		let newRotation = (dragStartRotation + rotationChange + 360) % 360;
		state.rotation = snapAngle(newRotation, rotationSnapPoints);

		if (Math.abs(newRotation - 360) <= 5) {
			state.rotation = 0;
		}

		drawAxisLines();
		drawStars();
		controlsInstance.updateDisplays();
	}

	// Handle drag end
	function handleDragEnd(event) {
		isDragging = false;
		isPinching = false;
		lastPinchDistance = 0;
	}

	// Set up event listeners
	canvas.addEventListener('mousedown', (event) => {
		handleDragStart(event);
	});

	canvas.addEventListener(
		'touchstart',
		(event) => {
			event.preventDefault();
			handleDragStart(event);
		},
		{ passive: false },
	);

	canvas.addEventListener('mousemove', (event) => {
		handleMove(event);
	});

	canvas.addEventListener(
		'touchmove',
		(event) => {
			event.preventDefault();
			handleMove(event);
		},
		{ passive: false },
	);

	canvas.addEventListener('mouseup', (event) => {
		handleDragEnd(event);
	});

	canvas.addEventListener(
		'touchend',
		(event) => {
			event.preventDefault();
			handleDragEnd(event);
		},
		{ passive: false },
	);

	canvas.addEventListener('mouseleave', () => {
		isDragging = false;
	});

	canvas.addEventListener('touchcancel', () => {
		isDragging = false;
		isPinching = false;
		lastPinchDistance = 0;
	});

	// Handle spacebar to toggle auto-rotation
	document.addEventListener('keydown', (event) => {
		if (event.code === 'Space' || event.key === ' ') {
			event.preventDefault(); // Prevent page scroll
			const isRotating = toggleAutoRotation();

			// Update button text
			const autoRotateButton = document.getElementById('autoRotateToggle');
			if (autoRotateButton) {
				autoRotateButton.textContent = isRotating
					? '⏸️ Pause Auto-Rotation'
					: '▶️ Start Auto-Rotation';
			}
		}
	});

	// Initialize controls
	const controlsInstance = new StarControls({
		state: state,
		callbacks: {
			drawAxisLines: drawAxisLines,
			drawStars: drawStars,
		},
	});

	// Initial draw
	drawAxisLines();
	drawStars();

	// Start animation loop
	animateRotation();

	// Return toggle function for external control
	return {
		toggleAutoRotation: toggleAutoRotation,
	};
}
