import { celestialBodyCompositions } from "../planet-composition.js";
import { getFormulaColor } from "../formula-registry.js";
import { formatFormulaWithSubscripts } from "./formula-utils.js";
import { planetsData, sunData } from "../planets-data.js";
import { Controls } from "../controls.js";

export function initUniverse() {
	paper.setup(document.getElementById("myCanvas"));
	const center = paper.view.center;

	// Simulation state - using object for shared state with Controls
	const simulationState = {
		timeSpeed: 1.0,
		inclination: 60, // degrees (-90 to 90)
		rotation: 0, // degrees (0 to 360) - view angle rotation around Y axis
		scale: 1.0,
		showOrbits: true,
		showLabels: true,
		showCompoundNames: false, // Show compound names instead of formulas in composition diagram
		isPaused: false,
		labelFontSize: 12, // Default font size for planet labels
		viewMode: "solar-system", // 'solar-system' or 'planet-moons'
		centerBody: null, // The celestial body at the center (null = sun)
		centerBodyTarget: null, // Target body to transition to
		centerTransitionProgress: 0, // 0-1 transition progress to new center
		centerOffset: null, // Current center offset in 3D space (null = sun at origin)
	};

	let time = 0;
	const minOrbitRadiusForLabel = 70; // Minimum orbit radius (in pixels) to show labels and enable interactions

	// Central state for all celestial bodies (visibility, opacity, center status)
	const celestialBodyStates = new Map(); // key: body.name -> { body, parentBody, isCenter, isCenterTarget, visible, targetVisible, opacity, targetOpacity }

	// Initialize body states for all planets and moons
	function initializeBodyStates() {
		// Sun
		celestialBodyStates.set("Sun", {
			body: null, // null represents the sun
			parentBody: null,
			isCenter: true, // Sun starts as center
			isCenterTarget: false,
			visible: true,
			targetVisible: true,
			opacity: 1.0,
			targetOpacity: 1.0,
			orbitVisible: false, // Sun has no orbit
			targetOrbitVisible: false,
			orbitOpacity: 0.0,
			targetOrbitOpacity: 0.0,
			type: "sun",
		});

		// Planets
		planetsData.forEach((planet) => {
			celestialBodyStates.set(planet.name, {
				body: planet,
				parentBody: null,
				isCenter: false,
				isCenterTarget: false,
				visible: true,
				targetVisible: true,
				opacity: 1.0,
				targetOpacity: 1.0,
				orbitVisible: true, // Planet orbits visible initially
				targetOrbitVisible: true,
				orbitOpacity: 1.0,
				targetOrbitOpacity: 1.0,
				type: "planet",
			});

			// Moons
			if (planet.moons) {
				planet.moons.forEach((moon) => {
					celestialBodyStates.set(moon.name, {
						body: moon,
						parentBody: planet,
						isCenter: false,
						isCenterTarget: false,
						visible: false, // Moons start invisible
						targetVisible: false,
						opacity: 0.0,
						targetOpacity: 0.0,
						orbitVisible: false, // Moon orbits start invisible
						targetOrbitVisible: false,
						orbitOpacity: 0.0,
						targetOrbitOpacity: 0.0,
						type: "moon",
					});
				});
			}
		});
	}

	// Groups for organized rendering
	let axisGroup = new paper.Group();
	let orbitGroup = new paper.Group();
	let planetGroup = new paper.Group();
	let labelGroup = new paper.Group();
	let moonGroup = new paper.Group();
	let clickAreaGroup = new paper.Group();

	// Calculate 3D position of a celestial body at current time (with scale applied)
	function getCelestialBody3DPosition(body, parentBody = null) {
		// Calculate orbital angle based on time and period
		const currentAngle = body.angle + (time / body.period) * Math.PI * 2;

		// Calculate 3D position in orbit (apply scale here)
		const scaledDistance = body.distance * simulationState.scale;
		const x = Math.cos(currentAngle) * scaledDistance;
		const z = Math.sin(currentAngle) * scaledDistance;

		// Apply orbital inclination (rotate around x-axis)
		const incRad = (body.orbitalInclination * Math.PI) / 180;
		const y = z * Math.sin(incRad);
		const zInclined = z * Math.cos(incRad);

		// If this body has a parent (e.g., moon orbiting planet), add parent's position
		if (parentBody) {
			const parentPos = getCelestialBody3DPosition(parentBody);
			return {
				x: x + parentPos.x,
				y: y + parentPos.y,
				z: zInclined + parentPos.z,
			};
		}

		return { x: x, y: y, z: zInclined };
	}

	// Convert 3D orbital position to 2D screen coordinates
	function project3DTo2D(
		x,
		y,
		z,
		inclination,
		rotation = 0,
		centerOffset = null,
	) {
		// Apply center offset if provided (subtract center body's position)
		let adjustedX = x;
		let adjustedY = y;
		let adjustedZ = z;

		if (centerOffset) {
			adjustedX -= centerOffset.x;
			adjustedY -= centerOffset.y;
			adjustedZ -= centerOffset.z;
		}

		// First apply rotation around Y axis
		const rotRad = (rotation * Math.PI) / 180;
		const xRot = adjustedX * Math.cos(rotRad) + adjustedZ * Math.sin(rotRad);
		const zRot = -adjustedX * Math.sin(rotRad) + adjustedZ * Math.cos(rotRad);

		// Then apply inclination (rotation around X axis)
		const incRad = (inclination * Math.PI) / 180;
		const screenX = xRot;
		const screenY = adjustedY * Math.cos(incRad) - zRot * Math.sin(incRad);
		return new paper.Point(screenX, screenY);
	}

	// Update current center offset in simulationState (3D position of center body)
	function updateCenterOffset() {
		if (!simulationState.centerBody && !simulationState.centerBodyTarget) {
			simulationState.centerOffset = null; // Sun is at origin, no offset
			return;
		}

		// Calculate offset based on transition progress
		let currentOffset = { x: 0, y: 0, z: 0 };
		let targetOffset = { x: 0, y: 0, z: 0 };

		// Get current center body position
		if (simulationState.centerBody) {
			currentOffset = getCelestialBody3DPosition(
				simulationState.centerBody.body,
				simulationState.centerBody.parentBody,
			);
		}

		// Get target center body position
		if (simulationState.centerBodyTarget) {
			targetOffset = getCelestialBody3DPosition(
				simulationState.centerBodyTarget.body,
				simulationState.centerBodyTarget.parentBody,
			);
		}

		// Interpolate between current and target
		const progress = simulationState.centerTransitionProgress;
		simulationState.centerOffset = {
			x: currentOffset.x * (1 - progress) + targetOffset.x * progress,
			y: currentOffset.y * (1 - progress) + targetOffset.y * progress,
			z: currentOffset.z * (1 - progress) + targetOffset.z * progress,
		};
	}

	// Update body states based on current center (visibility, opacity, fade transitions)
	function updateBodyStates() {
		// Determine which body should be centered
		let centerBodyName = "Sun";
		let centerBodyType = "sun";

		if (simulationState.centerBodyTarget) {
			// Transitioning to new center
			if (simulationState.centerBodyTarget.body) {
				centerBodyName = simulationState.centerBodyTarget.body.name;
				centerBodyType =
					celestialBodyStates.get(centerBodyName)?.type || "planet";
			} else {
				centerBodyName = "Sun";
				centerBodyType = "sun";
			}
		} else if (simulationState.centerBody) {
			// Already at center
			if (simulationState.centerBody.body) {
				centerBodyName = simulationState.centerBody.body.name;
				centerBodyType =
					celestialBodyStates.get(centerBodyName)?.type || "planet";
			}
		}

		// Update target visibility and opacity for all bodies
		celestialBodyStates.forEach((state, name) => {
			// Update center flags
			state.isCenterTarget = name === centerBodyName;

			if (
				simulationState.centerTransitionProgress === 0 &&
				!simulationState.centerBodyTarget
			) {
				state.isCenter = state.isCenterTarget;
			}

			// Determine target visibility and opacity based on mode
			if (centerBodyType === "sun") {
				// Sun-centered mode: show sun and planets, hide moons
				if (state.type === "sun") {
					state.targetVisible = true;
					state.targetOpacity = 1.0;
					state.targetOrbitVisible = false;
					state.targetOrbitOpacity = 0.0;
				} else if (state.type === "planet") {
					state.targetVisible = true;
					state.targetOpacity = 1.0;
					state.targetOrbitVisible = true;
					state.targetOrbitOpacity = 1.0;
				} else if (state.type === "moon") {
					state.targetVisible = false;
					state.targetOpacity = 0.0;
					state.targetOrbitVisible = false;
					state.targetOrbitOpacity = 0.0;
				}
			} else if (centerBodyType === "planet") {
				// Planet-centered mode: show centered planet and its moons, hide others
				if (name === centerBodyName) {
					// The centered planet
					state.targetVisible = true;
					state.targetOpacity = 1.0;
					state.targetOrbitVisible = false; // Hide planet's orbit (it's at center)
					state.targetOrbitOpacity = 0.0;
				} else if (state.type === "sun") {
					// Hide sun
					state.targetVisible = false;
					state.targetOpacity = 0.0;
					state.targetOrbitVisible = false;
					state.targetOrbitOpacity = 0.0;
				} else if (state.type === "planet") {
					// Hide other planets
					state.targetVisible = false;
					state.targetOpacity = 0.0;
					state.targetOrbitVisible = false;
					state.targetOrbitOpacity = 0.0;
				} else if (state.type === "moon") {
					// Show only moons of the centered planet
					if (state.parentBody && state.parentBody.name === centerBodyName) {
						state.targetVisible = true;
						state.targetOpacity = 1.0;
						state.targetOrbitVisible = true; // Show moon orbits
						state.targetOrbitOpacity = 1.0;
					} else {
						state.targetVisible = false;
						state.targetOpacity = 0.0;
						state.targetOrbitVisible = false;
						state.targetOrbitOpacity = 0.0;
					}
				}
			} else if (centerBodyType === "moon") {
				// Moon-centered mode: show centered moon and sibling moons, hide everything else
				const centerState = celestialBodyStates.get(centerBodyName);
				const centerParentName = centerState?.parentBody?.name;

				if (name === centerBodyName) {
					// The centered moon
					state.targetVisible = true;
					state.targetOpacity = 1.0;
					state.targetOrbitVisible = false; // Hide centered moon's orbit
					state.targetOrbitOpacity = 0.0;
				} else if (state.type === "sun") {
					// Hide sun
					state.targetVisible = false;
					state.targetOpacity = 0.0;
					state.targetOrbitVisible = false;
					state.targetOrbitOpacity = 0.0;
					state.targetOrbitVisible = false;
					state.targetOrbitOpacity = 0.0;
				} else if (state.type === "planet") {
					// Show parent planet dimmed, hide others
					if (name === centerParentName) {
						state.targetVisible = true;
						state.targetOpacity = 0.3;
						state.targetOrbitVisible = false; // Hide parent planet orbit
						state.targetOrbitOpacity = 0.0;
					} else {
						state.targetVisible = false;
						state.targetOpacity = 0.0;
						state.targetOrbitVisible = false;
						state.targetOrbitOpacity = 0.0;
					}
				} else if (state.type === "moon") {
					// Show sibling moons (same parent), hide others
					if (state.parentBody && state.parentBody.name === centerParentName) {
						state.targetVisible = true;
						state.targetOpacity = 1.0;
					} else {
						state.targetVisible = false;
						state.targetOpacity = 0.0;
						state.targetOrbitVisible = false;
						state.targetOrbitOpacity = 0.0;
					}
				}
			}
		});

		// Animate opacity transitions (smooth fade in/out)
		const fadeSpeed = 0.05; // Opacity change per frame
		let anyChanging = false;

		celestialBodyStates.forEach((state) => {
			// Fade body opacity toward target
			if (state.opacity < state.targetOpacity) {
				state.opacity = Math.min(
					state.targetOpacity,
					state.opacity + fadeSpeed,
				);
				anyChanging = true;
			} else if (state.opacity > state.targetOpacity) {
				state.opacity = Math.max(
					state.targetOpacity,
					state.opacity - fadeSpeed,
				);
				anyChanging = true;
			}

			// Fade orbit opacity toward target
			if (state.orbitOpacity < state.targetOrbitOpacity) {
				state.orbitOpacity = Math.min(
					state.targetOrbitOpacity,
					state.orbitOpacity + fadeSpeed,
				);
				anyChanging = true;
			} else if (state.orbitOpacity > state.targetOrbitOpacity) {
				state.orbitOpacity = Math.max(
					state.targetOrbitOpacity,
					state.orbitOpacity - fadeSpeed,
				);
				anyChanging = true;
			}

			// Update visibility (becomes invisible when opacity reaches 0)
			if (state.opacity <= 0) {
				state.visible = false;
			} else {
				state.visible = true;
			}

			// Update orbit visibility
			if (state.orbitOpacity <= 0) {
				state.orbitVisible = false;
			} else {
				state.orbitVisible = true;
			}
		});

		return anyChanging;
	}

	// Set a new center body with smooth transition
	function setCenterBody(body, parentBody = null) {
		// If clicking on current center, do nothing
		if (
			simulationState.centerBody &&
			simulationState.centerBody.body === body
		) {
			return;
		}

		// If clicking sun when already on sun, do nothing
		if (!body && !simulationState.centerBody) {
			return;
		}

		// Store the target
		simulationState.centerBodyTarget = body
			? {
					body: body,
					parentBody: parentBody,
				}
			: null;
		simulationState.centerTransitionProgress = 0;

		// Animate transition
		const steps = 25;
		const stepDuration = 20;
		let step = 0;

		const interval = setInterval(() => {
			step++;
			const progress = step / steps;

			// Ease out cubic
			const eased = 1 - Math.pow(1 - progress, 3);
			simulationState.centerTransitionProgress = eased;

			if (step >= steps) {
				clearInterval(interval);
				// Transition complete - make target the new center
				simulationState.centerBody = simulationState.centerBodyTarget;
				simulationState.centerBodyTarget = null;
				simulationState.centerTransitionProgress = 0;
			}
		}, stepDuration);
	}

	// Draw XYZ axis lines at screen center (fixed position and size)
	function drawAxisLines() {
		axisGroup.removeChildren();

		// Fixed axis length (never scales)
		const axisLength = 50;

		// X-axis (Red) - extends along the X direction
		const xEnd3D = { x: axisLength, y: 0, z: 0 };
		const xEndPos = project3DTo2D(
			xEnd3D.x,
			xEnd3D.y,
			xEnd3D.z,
			simulationState.inclination,
			simulationState.rotation,
			null, // No center offset - always at screen center
		);
		const xLine = new paper.Path.Line(center, center.add(xEndPos));
		xLine.strokeColor = "#FF4444"; // Red
		xLine.strokeWidth = 1; // Thinner
		xLine.opacity = 0.7;
		axisGroup.addChild(xLine);

		// Y-axis (Green) - extends along the Z direction
		const yEnd3D = { x: 0, y: 0, z: axisLength };
		const yEndPos = project3DTo2D(
			yEnd3D.x,
			yEnd3D.y,
			yEnd3D.z,
			simulationState.inclination,
			simulationState.rotation,
			null, // No center offset - always at screen center
		);
		const yLine = new paper.Path.Line(center, center.add(yEndPos));
		yLine.strokeColor = "#44FF44"; // Green
		yLine.strokeWidth = 1; // Thinner
		yLine.opacity = 0.7;
		axisGroup.addChild(yLine);

		// Z-axis (Blue) - extends along the Y direction (up)
		const zEnd3D = { x: 0, y: axisLength, z: 0 };
		const zEndPos = project3DTo2D(
			zEnd3D.x,
			zEnd3D.y,
			zEnd3D.z,
			simulationState.inclination,
			simulationState.rotation,
			null, // No center offset - always at screen center
		);
		const zLine = new paper.Path.Line(center, center.add(zEndPos));
		zLine.strokeColor = "#4444FF"; // Blue
		zLine.strokeWidth = 1; // Thinner
		zLine.opacity = 0.7;
		axisGroup.addChild(zLine);

		// X label (Red) - positioned 5px beyond the tip
		const xLabelOffset = xEndPos.normalize(xEndPos.length + 5);
		const xLabel = new paper.PointText(center.add(xLabelOffset));
		xLabel.content = "X";
		xLabel.fillColor = "#FF4444";
		xLabel.fontSize = simulationState.labelFontSize * 0.7;
		xLabel.fontFamily = "monospace";
		xLabel.fontWeight = "bold";
		xLabel.justification = "center";
		xLabel.opacity = 0.7;
		axisGroup.addChild(xLabel);

		// Y label (Green) - positioned 5px beyond the tip
		const yLabelOffset = yEndPos.normalize(yEndPos.length + 5);
		const yLabel = new paper.PointText(center.add(yLabelOffset));
		yLabel.content = "Y";
		yLabel.fillColor = "#44FF44";
		yLabel.fontSize = simulationState.labelFontSize * 0.7;
		yLabel.fontFamily = "monospace";
		yLabel.fontWeight = "bold";
		yLabel.justification = "center";
		yLabel.opacity = 0.7;
		axisGroup.addChild(yLabel);

		// Z label (Blue) - positioned 5px beyond the tip
		const zLabelOffset = zEndPos.normalize(zEndPos.length + 5);
		const zLabel = new paper.PointText(center.add(zLabelOffset));
		zLabel.content = "Z";
		zLabel.fillColor = "#4444FF";
		zLabel.fontSize = simulationState.labelFontSize * 0.7;
		zLabel.fontFamily = "monospace";
		zLabel.fontWeight = "bold";
		zLabel.justification = "center";
		zLabel.opacity = 0.7;
		axisGroup.addChild(zLabel);
	}

	// Draw orbits
	function drawOrbits() {
		orbitGroup.removeChildren();

		if (!simulationState.showOrbits) return;

		// Draw planet orbits
		planetsData.forEach((planet) => {
			// Check if planet's orbit should be visible
			const planetState = celestialBodyStates.get(planet.name);
			if (!planetState || !planetState.orbitVisible) {
				return; // Skip invisible orbits
			}

			// Draw planet orbit using unified function
			drawOrbitPath({
				distance: planet.distance,
				scale: simulationState.scale,
				color: planet.color,
				orbitalInclination: planet.orbitalInclination,
				segments: 100,
				strokeWidth: 1,
				alpha: 0.2 * planetState.orbitOpacity, // Apply orbit opacity
				group: orbitGroup,
			});
		});
	}

	// Draw label with angled connector line for celestial body
	function drawLabel(config) {
		const {
			position, // paper.Point - center position of body
			startRadius, // number - radius where label line starts (click circle radius)
			name, // string - label text
			isScaledDown = false, // boolean - whether body is scaled down
			bodyType, // string - "planet" or "moon"
			opacity = 1, // number - opacity
			targetGroup, // paper.Group - group to add label to (labelGroup or moonGroup)
			currentLayer = null, // string - current layer being displayed (e.g., "surface")
			hoverGroupId = null, // string - hover group ID for this body
		} = config;

		// Generate label suffix based on scaling
		const labelSuffix = isScaledDown ? " (-10x)" : "";

		// Line segment lengths (smaller for moons)
		const segment1Length = bodyType === "planet" ? 10 : 5;
		const segment2Length = bodyType === "planet" ? 15 : 10;
		const angle60 = (-60 * Math.PI) / 180;

		// Start at click circle border on the lower-right
		const startPoint = position.add(
			new paper.Point(
				Math.cos(angle60) * startRadius,
				Math.sin(angle60) * startRadius,
			),
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
		connectorLine.strokeWidth = bodyType === "planet" ? 0.5 : 0.3;
		connectorLine.opacity = opacity;
		connectorLine.add(startPoint);
		connectorLine.add(segment1End);
		connectorLine.add(segment2End);
		targetGroup.addChild(connectorLine);

		// Draw the label text
		const labelOffset =
			bodyType === "planet" ? new paper.Point(5, 3) : new paper.Point(3, 2);
		const label = new paper.PointText(segment2End.add(labelOffset));
		label.content = name + labelSuffix;
		label.fillColor = "white";
		label.fontSize =
			bodyType === "planet"
				? simulationState.labelFontSize
				: simulationState.labelFontSize * 0.8;
		label.fontFamily = "monospace";
		label.justification = "left";
		label.opacity = opacity;
		targetGroup.addChild(label);

		// Add moon count indicator for planets (if they have moons)
		if (bodyType === "planet") {
			// Find planet data to get moon count from planetsData array
			const planetData = planetsData.find((p) => p.name === name);
			const moonCount = planetData?.moons?.length || 0;

			if (moonCount > 0) {
				// Calculate position: 2 spaces after the planet name
				const labelBounds = label.bounds;
				const moonLabelPos = new paper.Point(
					labelBounds.right + 10,
					segment2End.add(labelOffset).y,
				);

				const moonLabel = new paper.PointText(moonLabelPos);
				moonLabel.content = moonCount + " ⏾";
				moonLabel.fillColor = new paper.Color(0.5, 0.5, 0.5); // Gray color
				moonLabel.fontSize = simulationState.labelFontSize * 0.8;
				moonLabel.fontFamily = "monospace";
				moonLabel.justification = "left";
				moonLabel.opacity = opacity;
				targetGroup.addChild(moonLabel);
			}
		}

		// Draw layer indicator symbol next to name if layer is specified and data is available
		if (currentLayer && ["planet", "moon"].includes(bodyType)) {
			// Check if composition data exists for this body
			const hasCompositionData = celestialBodyCompositions.find(
				(cb) => cb.name === name,
			);

			if (hasCompositionData) {
				// Map layer names to symbols: ⬤⨀⦾⦿⚬
				const layerSymbols = {
					surface: "⬤",
					mantle: "⨀",
					intermediate: "⦾",
					core: "⦿",
					default: "⚬",
				};

				const symbol = layerSymbols[currentLayer] || layerSymbols.default;

				// Position below and slightly right of the label text
				const layerOffset = new paper.Point(
					10,
					simulationState.labelFontSize + 5,
				);
				const layerPos = segment2End.add(labelOffset).add(layerOffset);

				// Draw symbol and layer name combined
				const layerText = new paper.PointText(layerPos);
				const layerName =
					currentLayer.charAt(0).toUpperCase() + currentLayer.slice(1);
				layerText.content = symbol + " " + layerName;
				layerText.fillColor = "#999999";
				layerText.fontSize = simulationState.labelFontSize * 0.8;
				layerText.fontFamily = "monospace";
				layerText.justification = "left";
				layerText.opacity = opacity;

				// Make layer text clickable
				layerText.data = {
					isLayerIndicator: true,
					bodyName: name,
					hoverGroupId: hoverGroupId,
				};

				// Add to clickAreaGroup so it's drawn on top and clickable
				clickAreaGroup.addChild(layerText);
			}
		}
	}

	// Helper function to calculate orbital position (deprecated - use getCelestialBody3DPosition + project3DTo2D)
	function calculateOrbitalPosition(body, parentBody = null) {
		// Get 3D position
		const pos3D = getCelestialBody3DPosition(body, parentBody);

		// Project to 2D
		const screenPos = project3DTo2D(
			pos3D.x,
			pos3D.y,
			pos3D.z,
			simulationState.inclination,
			simulationState.rotation,
			simulationState.centerOffset,
		);

		// Calculate scaled distance
		const scaledDistance = body.distance * simulationState.scale;

		return {
			screenPos: screenPos, // paper.Point - 2D projected position
			scaledDistance: scaledDistance, // number - scaled distance
		};
	}

	// Helper function to draw an orbit path
	function drawOrbitPath(config) {
		const {
			distance, // number - orbit radius in original units
			color, // string - orbit color
			orbitalInclination, // number - inclination in degrees
			parentBody3DPos = null, // object - 3D position of parent body (for moon orbits)
			segments = 100, // number - number of segments for the path
			strokeWidth = 1, // number - orbit stroke width
			alpha = 0.2, // number - orbit opacity
			group, // paper.Group - group to add orbit to
		} = config;

		const orbitRadiusOnScreen = distance * simulationState.scale;

		// Hide orbits larger than the screen
		const maxVisibleRadius =
			Math.min(paper.view.size.width, paper.view.size.height) / 2;
		if (orbitRadiusOnScreen > maxVisibleRadius) {
			return;
		}

		const orbitPath = new paper.Path();
		const orbitColor = new paper.Color(color);
		orbitColor.alpha = alpha;
		orbitPath.strokeColor = orbitColor;
		orbitPath.strokeWidth = strokeWidth;

		// Draw orbit segments
		for (let i = 0; i <= segments; i++) {
			const orbitAngle = (i / segments) * Math.PI * 2;
			// Apply scale to orbit distance
			const scaledDistance = distance * simulationState.scale;
			const x = Math.cos(orbitAngle) * scaledDistance;
			const z = Math.sin(orbitAngle) * scaledDistance;

			// Apply orbital inclination (rotate around x-axis)
			const incRad = (orbitalInclination * Math.PI) / 180;
			const y = z * Math.sin(incRad);
			const zInclined = z * Math.cos(incRad);

			// Add parent body position if this is a moon orbit
			let worldX = x;
			let worldY = y;
			let worldZ = zInclined;
			if (parentBody3DPos) {
				worldX += parentBody3DPos.x;
				worldY += parentBody3DPos.y;
				worldZ += parentBody3DPos.z;
			}

			const screenPos = project3DTo2D(
				worldX,
				worldY,
				worldZ,
				simulationState.inclination,
				simulationState.rotation,
				simulationState.centerOffset,
			);
			orbitPath.add(center.add(screenPos));
		}

		orbitPath.closed = true;
		group.addChild(orbitPath);
	}

	// Draw a celestial body (planet or moon) with click area and optional label
	function drawCelestialBody(config) {
		const {
			position, // paper.Point - screen position
			size, // number - actual size in pixels
			color, // string - fill color
			name, // string - display name
			bodyType, // string - "planet" or "moon"
			bodyIndex, // number - planet index (for planets)
			moonName, // string - moon name (for moons)
			orbitRadius, // number - orbit radius on screen (for label visibility check)
			opacity = 1, // number - opacity (for fade effects)
			showLabel = true, // boolean - whether to show label
			isScaledDown = false, // boolean - whether body is scaled down
			strokeWidth = 0.5, // number - border stroke width
		} = config;

		// Draw the body
		const bodyCircle = new paper.Path.Circle(position, size);
		bodyCircle.fillColor = color;
		bodyCircle.strokeColor = "white";
		bodyCircle.strokeWidth = strokeWidth;
		bodyCircle.opacity = opacity;

		// Create unique hover group ID for this body
		const hoverGroupId = `${bodyType}_${name}_hover`;

		bodyCircle.data = {
			type: bodyType,
			planetIndex: bodyIndex,
			moonName: moonName,
			bodyName: name,
			isBody: true,
			hoverGroupId: hoverGroupId,
		};

		if (bodyType === "planet") {
			planetGroup.addChild(bodyCircle);
		} else {
			moonGroup.addChild(bodyCircle);
		}

		// Add clickable circle around body
		// Make it 20px larger than body, or minimum 20px radius (40px diameter)
		const baseClickRadius = Math.max(size + 10, 20);

		// Check if this body is currently hovered/animating
		const hoverState = bodyHoverStates.get(name);
		let clickRadius = baseClickRadius;
		if (hoverState) {
			// Use the animated radius from hover state
			clickRadius = hoverState.radius;
		}

		const clickCircle = new paper.Path.Circle(position, clickRadius);
		clickCircle.strokeColor = null; // Hide stroke
		// Use transparent fill with alpha 0.01 for hover detection
		clickCircle.fillColor = new paper.Color(1, 1, 1, 0.01);
		clickCircle.opacity = opacity;
		clickCircle.data = {
			type: bodyType,
			planetIndex: bodyIndex,
			moonName: moonName,
			bodyName: name,
			isClickArea: true,
			originalRadius: baseClickRadius,
			orbitRadius: orbitRadius, // Store orbit radius to check label visibility
			hoverGroupId: hoverGroupId,
		};
		clickAreaGroup.addChild(clickCircle);

		// Draw composition diagram if hover state indicates it should be shown
		if (hoverState && hoverState.showComposition) {
			drawCompositionDiagram(clickCircle, name);
		}

		// Draw label if enabled and orbit is large enough
		if (showLabel && orbitRadius >= minOrbitRadiusForLabel) {
			const targetGroup = bodyType === "planet" ? labelGroup : moonGroup;

			// Check if this body is currently hovered/animating
			const hoverState = bodyHoverStates.get(name);
			let currentLabelRadius = clickRadius;

			if (hoverState) {
				// Use the animated radius from hover state
				currentLabelRadius = hoverState.radius;
			}

			// Hide label if another body is being hovered
			const isAnyBodyHovered = bodyHoverStates.size > 0;
			const isThisBodyHovered = hoverState !== undefined;
			const shouldHideLabel = isAnyBodyHovered && !isThisBodyHovered;

			// Get current layer for this body
			const currentLayer = hoverState?.currentLayer || "surface";

			if (!shouldHideLabel) {
				drawLabel({
					position: position,
					startRadius: currentLabelRadius,
					name: name,
					isScaledDown: isScaledDown,
					bodyType: bodyType,
					opacity: opacity,
					targetGroup: targetGroup,
					hoverGroupId: hoverGroupId,
					currentLayer: isThisBodyHovered ? currentLayer : null, // Only show when hovered
				});
			}
		}
	}

	// Update planet positions
	function updatePlanets() {
		planetGroup.removeChildren();
		labelGroup.removeChildren();
		moonGroup.removeChildren();
		clickAreaGroup.removeChildren();

		// Draw sun if visible
		const sunState = celestialBodyStates.get("Sun");
		if (sunState && sunState.visible) {
			// Sun is at origin in 3D space
			const sunPos3D = { x: 0, y: 0, z: 0 };
			const sunScreenPos = project3DTo2D(
				sunPos3D.x,
				sunPos3D.y,
				sunPos3D.z,
				simulationState.inclination,
				simulationState.rotation,
				simulationState.centerOffset,
			);

			const sunPos = center.add(sunScreenPos);
			const minSunSize = 3;
			const scaledSunSize = Math.max(
				sunData.size * simulationState.scale,
				minSunSize,
			);
			const sun = new paper.Path.Circle(sunPos, scaledSunSize);
			sun.fillColor = sunData.color;
			sun.strokeColor = sunData.strokeColor;
			sun.strokeWidth = 2;
			sun.opacity = sunState.opacity;
			planetGroup.addChild(sun);
		}

		planetsData.forEach((planet, planetIndex) => {
			// Check if planet is visible
			const planetState = celestialBodyStates.get(planet.name);
			if (!planetState || !planetState.visible) {
				return; // Skip invisible planets
			}

			// Calculate orbital position using new system
			const orbitalData = calculateOrbitalPosition(planet);
			const planetPos = center.add(orbitalData.screenPos);

			// Calculate orbit radius on screen
			const orbitRadiusOnScreen = orbitalData.scaledDistance;

			// Draw planet with scaled size (scales down with zoom out, but has minimum)
			const minSize = 2; // Minimum planet size in pixels
			let effectiveSize = planet.size;
			let isScaledDown = false;

			// Check if this is the centered body in a moon view (reuse planetState from above)
			if (planetState.isCenter && planet.moons && planet.moons.length > 0) {
				// Find the smallest moon orbit
				const smallestMoonOrbit = Math.min(
					...planet.moons.map((m) => m.distance * simulationState.scale),
				);
				const currentPlanetSize = planet.size * simulationState.scale;

				// If planet is larger than smallest moon orbit, scale it down 10x
				if (currentPlanetSize > smallestMoonOrbit) {
					effectiveSize = planet.size / 10;
					isScaledDown = true;
				}
			}

			const scaledSize = Math.max(
				effectiveSize * simulationState.scale,
				minSize,
			);

			// Draw the planet using the unified function
			drawCelestialBody({
				position: planetPos,
				size: scaledSize,
				color: planet.color,
				name: planet.name,
				bodyType: "planet",
				bodyIndex: planetIndex,
				orbitRadius: orbitRadiusOnScreen,
				opacity: planetState.opacity,
				showLabel: simulationState.showLabels,
				isScaledDown: isScaledDown,
				strokeWidth: 0.5,
			});
		});

		// Render moons for all planets
		planetsData.forEach((planet) => {
			if (planet.moons && planet.moons.length > 0) {
				renderMoons(planet);
			}
		});
	}

	// Render moons around a planet
	function renderMoons(planet) {
		if (!planet.moons || planet.moons.length === 0) return;

		// Get planet's 3D position
		const planet3DPos = getCelestialBody3DPosition(planet);

		planet.moons.forEach((moon) => {
			// Check if moon is visible first
			const moonState = celestialBodyStates.get(moon.name);
			if (!moonState || !moonState.visible) {
				return; // Skip invisible moons
			}

			// Calculate moon orbital position (includes parent planet position)
			const orbitalData = calculateOrbitalPosition(moon, planet);
			const moonPos = center.add(orbitalData.screenPos);

			// Calculate orbit radius on screen for this moon
			const moonOrbitRadiusOnScreen = orbitalData.scaledDistance;

			// Draw moon orbit if visible
			if (simulationState.showOrbits && moonState.orbitVisible) {
				drawOrbitPath({
					distance: moon.distance,
					scale: simulationState.scale,
					color: moon.color,
					orbitalInclination: moon.orbitalInclination,
					parentBody3DPos: planet3DPos,
					segments: 50,
					strokeWidth: 0.5,
					alpha: 0.4 * moonState.orbitOpacity, // Apply orbit opacity
					group: moonGroup,
				});
			}

			// Draw moon with scaled size (with minimum)
			const minMoonSize = 1.5;
			const scaledMoonSize = Math.max(
				moon.size * simulationState.scale,
				minMoonSize,
			);

			// Draw the moon using the unified function
			drawCelestialBody({
				position: moonPos,
				size: scaledMoonSize,
				color: moon.color,
				name: moon.name,
				bodyType: "moon",
				moonName: moon.name,
				orbitRadius: moonOrbitRadiusOnScreen,
				opacity: moonState.opacity,
				showLabel: simulationState.showLabels,
				isScaledDown: false,
				strokeWidth: 0.3,
			});
		});
	}

	// Animation loop
	function animate() {
		// Update body states (visibility, opacity, fade transitions)
		const statesChanging = updateBodyStates();

		// Update center offset based on current/target center bodies
		updateCenterOffset();

		// Pause rotation when hovering over any celestial body
		const isHovering = hoveredClickArea !== null;

		// Redraw if: time advancing, hovering, animations active, or states changing
		const shouldUpdate = !simulationState.isPaused && !isHovering;
		const needsRedraw =
			isHovering || bodyHoverStates.size > 0 || statesChanging;

		if (shouldUpdate) {
			time += simulationState.timeSpeed * 0.5;
			drawOrbits();
			updatePlanets();
		} else if (needsRedraw) {
			// Update when hovering, animations active, or states changing
			drawOrbits();
			updatePlanets();
		}
	}

	// Initialize
	function init() {
		time = 0;
		initializeBodyStates(); // Initialize celestial body states
		drawAxisLines();
		drawOrbits();
		updatePlanets();
		controlsInstance.updateScaleIndicators();
	}

	// Set up animation frame
	paper.view.onFrame = function () {
		animate();
	};

	// Initialize SVG export with 'd' key
	SvgExport.initSvgExport(paper.project);

	// Initialize Controls with shared state object
	const controlsInstance = new Controls({
		state: simulationState, // Pass the object reference, not copies
		callbacks: {
			drawOrbits,
			updatePlanets,
			setCenterBody,
		},
	});

	// Animate radius change with smooth transition (state-based)
	function animateRadius(circle, targetRadius, duration = 500) {
		const bodyName = circle.data.bodyName;
		if (!bodyName) return;

		const originalRadius = circle.data.originalRadius;
		const startRadius = circle.bounds.width / 2;

		// Cancel any existing animation for this body
		const existingState = bodyHoverStates.get(bodyName);
		if (existingState && existingState.animationId) {
			cancelAnimationFrame(existingState.animationId);
		}

		const startTime = Date.now();
		const isExpanding = targetRadius > originalRadius;

		function step() {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Ease out cubic for smooth deceleration
			const eased = 1 - Math.pow(1 - progress, 3);
			const currentRadius = startRadius + (targetRadius - startRadius) * eased;

			// Update global hover state (preserve existing properties)
			if (bodyName) {
				const isExpanding = targetRadius > originalRadius;
				const existingState = bodyHoverStates.get(bodyName) || {};
				bodyHoverStates.set(bodyName, {
					...existingState, // Preserve existing properties like compositionAnimStarted
					progress: isExpanding ? eased : 1 - eased,
					radius: currentRadius,
					originalRadius: originalRadius,
					currentLayer: existingState.currentLayer || "surface", // Default to surface layer
				});
			}

			if (progress < 1) {
				bodyHoverStates.get(bodyName).animationId = requestAnimationFrame(step);
			} else {
				// Animation complete
				if (isExpanding) {
					// Mark that composition should be shown
					const currentState = bodyHoverStates.get(bodyName);
					if (currentState) {
						currentState.showComposition = true;
						currentState.animationId = null;
					}
				} else {
					// Clean up hover state if contracting back to original
					bodyHoverStates.delete(bodyName);
					// Force one final redraw to restore all labels
					updatePlanets();
				}
			}
		}

		step();
	}

	// Draw composition pie chart around click circle
	function drawCompositionDiagram(clickCircle, bodyName) {
		// Find celestial body data
		const planetData = celestialBodyCompositions.find(
			(p) => p.name === bodyName,
		);
		if (!planetData) {
			return; // Don't draw if no data
		}

		// Get current layer from hover state
		const hoverState = bodyHoverStates.get(bodyName);
		const currentLayer = hoverState?.currentLayer || "surface";

		// Get the layer composition
		const layerData = planetData.layers[currentLayer];
		if (!layerData || layerData.length === 0) return;

		// Calculate radius - 5px outside the click circle
		const centerPos = clickCircle.position;
		const innerRadius = clickCircle.bounds.width / 2;
		const strokeWidth = 5;

		// Draw large background rectangle for hover area
		const backgroundRect = new paper.Path.Rectangle({
			center: {
				x: centerPos.x + innerRadius * 1.5,
				y: centerPos.y,
			},
			size: [innerRadius * 3, innerRadius * 3],
		});
		// backgroundRect.strokeColor = new paper.Color(1, 0, 0, 0.1); // Red border, almost invisible
		// backgroundRect.strokeWidth = 2;
		backgroundRect.fillColor = new paper.Color(0, 0, 0, 0.01); // Almost transparent fill for hover detection
		backgroundRect.data = {
			type: clickCircle.data.type,
			planetIndex: clickCircle.data.planetIndex,
			moonName: clickCircle.data.moonName,
			bodyName: bodyName,
			isClickArea: true,
			isCompositionBackground: true, // Mark as composition background
			originalRadius: clickCircle.data.originalRadius,
			orbitRadius: clickCircle.data.orbitRadius,
			hoverGroupId: clickCircle.data.hoverGroupId,
		};
		clickAreaGroup.addChild(backgroundRect);

		// Calculate segment boundaries for colors
		let currentAngle = -Math.PI / 2; // Start at top (12 o'clock)
		const segments = [];

		layerData.forEach((compound) => {
			const color = getFormulaColor(compound.formula);
			const arcAngle = (compound.percent / 100) * Math.PI * 2;

			segments.push({
				startAngle: currentAngle,
				endAngle: currentAngle + arcAngle,
				color: color,
			});

			currentAngle += arcAngle;
		});

		// Get or start animation progress
		// (hoverState already declared above when getting currentLayer)
		let drawProgress = 1.0; // Default to full circle

		if (hoverState) {
			if (hoverState.compositionAnimProgress !== undefined) {
				// Animation in progress or complete
				drawProgress = hoverState.compositionAnimProgress;
			} else if (!hoverState.compositionAnimStarted) {
				// Start the composition animation only once
				hoverState.compositionAnimStarted = true;
				hoverState.compositionAnimProgress = 0;
				startCompositionAnimation(bodyName);
				drawProgress = 0;
			}
		}

		const startAngle = -Math.PI / 2; // 12 o'clock
		const endAngle = startAngle + Math.PI * 2; // Full circle
		const currentDrawAngle =
			startAngle + (endAngle - startAngle) * drawProgress;

		// Draw each color segment up to current angle
		segments.forEach((seg) => {
			if (currentDrawAngle > seg.startAngle) {
				const segStartAngle = seg.startAngle;
				const segEndAngle = Math.min(seg.endAngle, currentDrawAngle);

				// Create path for this colored segment
				const segPath = new paper.Path();
				segPath.strokeColor = seg.color;
				segPath.strokeWidth = strokeWidth;
				segPath.strokeCap = "round";

				// Add hover group ID so it's part of the same hover group
				segPath.data = {
					hoverGroupId: clickCircle.data.hoverGroupId,
				};

				const segSteps = 30;
				for (let i = 0; i <= segSteps; i++) {
					const angle =
						segStartAngle + ((segEndAngle - segStartAngle) * i) / segSteps;
					const x = centerPos.x + Math.cos(angle) * innerRadius;
					const y = centerPos.y + Math.sin(angle) * innerRadius;
					segPath.add(new paper.Point(x, y));
				}

				clickAreaGroup.addChild(segPath);
			}
		});

		// Draw formula labels around the circle if animation is complete or near complete
		if (drawProgress > 0.8) {
			segments.forEach((seg) => {
				// Only draw labels for segments that have been drawn
				if (currentDrawAngle > seg.startAngle) {
					// Calculate middle angle of this segment
					const segMidAngle = (seg.startAngle + seg.endAngle) / 2;

					// Position label outside the circle (15px beyond the click circle)
					const labelRadius = innerRadius + simulationState.labelFontSize + 5;
					const labelX = centerPos.x + Math.cos(segMidAngle) * labelRadius;
					const labelY = centerPos.y + Math.sin(segMidAngle) * labelRadius;

					// Find the compound data for this segment
					const segmentIndex = segments.indexOf(seg);
					const compound = layerData[segmentIndex];

					if (compound && (compound.formula || compound.compound)) {
						const formulaLabel = new paper.PointText(
							new paper.Point(labelX, labelY),
						);
						// Use compound name if option is enabled, otherwise use formula
						formulaLabel.content = simulationState.showCompoundNames
							? compound.compound
							: formatFormulaWithSubscripts(compound.formula);
						formulaLabel.fillColor = seg.color;
						formulaLabel.fontSize = simulationState.labelFontSize * 0.8;
						formulaLabel.fontFamily = "monospace";
						formulaLabel.justification = "center";
						formulaLabel.opacity = Math.min(drawProgress, 1);

						// Add hover group ID so it's part of the same hover group
						formulaLabel.data = {
							hoverGroupId: clickCircle.data.hoverGroupId,
						};

						// Add slight background for readability
						const labelBounds = formulaLabel.bounds;
						const background = new paper.Path.Rectangle(labelBounds.expand(2));
						background.fillColor = new paper.Color(0, 0, 0, 0.5);

						// Add hover group ID to background as well
						background.data = {
							hoverGroupId: clickCircle.data.hoverGroupId,
						};
						clickAreaGroup.addChild(background);
						clickAreaGroup.addChild(formulaLabel);
					}
				}
			});
		}
	}

	// Start composition animation for a body
	function startCompositionAnimation(bodyName) {
		const animDuration = 1000;
		const startTime = Date.now();

		function animateStep() {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / animDuration, 1);

			// Ease out cubic
			const eased = 1 - Math.pow(1 - progress, 3);

			const hoverState = bodyHoverStates.get(bodyName);
			if (hoverState) {
				hoverState.compositionAnimProgress = eased;
			}

			if (progress < 1) {
				requestAnimationFrame(animateStep);
			}
		}

		animateStep();
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

	// Snap points for simulationState.inclination and simulationState.rotation
	const inclinationSnapPoints = [-60, -45, -30, 0, 30, 45, 60];
	const rotationSnapPoints = [0, 45, 90, 135, 180, 225, 270, 315];

	// Get canvas element for drag controls
	const canvas = document.getElementById("myCanvas");

	// Drag to change simulationState.inclination and simulationState.rotation, and click detection
	let isDragging = false;
	let dragStartX = 0;
	let dragStartY = 0;
	let dragStartInclination = 0;
	let dragStartRotation = 0;
	let dragMoved = false;
	let hoveredClickArea = null;

	// Global hover state tracking - stores hover animation progress for each body
	const bodyHoverStates = new Map(); // bodyName -> { progress: 0-1, radius: number }

	// Helper function to get coordinates from mouse or touch event
	function getEventCoordinates(event) {
		// For touch events, use touches during move/start, changedTouches for end
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

	// Handle start of drag (mouse or touch)
	function handleDragStart(event) {
		const coords = getEventCoordinates(event);
		isDragging = true;
		dragStartX = coords.clientX;
		dragStartY = coords.clientY;
		dragStartInclination = simulationState.inclination;
		dragStartRotation = simulationState.rotation;
		dragMoved = false;
	}

	canvas.addEventListener("mousedown", (event) => {
		handleDragStart(event);
	});

	canvas.addEventListener(
		"touchstart",
		(event) => {
			event.preventDefault(); // Prevent default touch behavior (scrolling, zooming)
			handleDragStart(event);
		},
		{ passive: false },
	);

	// Handle move events (mouse or touch)
	function handleMove(event) {
		const coords = getEventCoordinates(event);
		const rect = canvas.getBoundingClientRect();
		const x = coords.clientX - rect.left;
		const y = coords.clientY - rect.top;
		const mousePoint = new paper.Point(x, y);

		// Check for hover over click areas or celestial bodies
		const hitResult = paper.project.hitTest(mousePoint, {
			fill: true,
			stroke: true,
			tolerance: 5,
		});

		let foundClickArea = null;

		// If we hit something, find the associated click area
		if (hitResult && hitResult.item) {
			if (hitResult.item.data?.isClickArea) {
				// Directly hit the click area
				foundClickArea = hitResult.item;
			} else if (hitResult.item.data?.isBody) {
				// Hit a celestial body, find its click area by searching for matching one
				const bodyType = hitResult.item.data.type;

				// Search through click area group for matching body
				clickAreaGroup.children.forEach((child) => {
					if (child.data?.isClickArea && child.data?.type === bodyType) {
						// Check if positions match (within tolerance)
						const distance = child.position.getDistance(
							hitResult.item.position,
						);
						if (distance < 5) {
							foundClickArea = child;
						}
					}
				});
			} else if (hitResult.item.data?.hoverGroupId) {
				// Hit a composition element (segment, label, or background)
				// Find the click area with the same hoverGroupId
				const targetGroupId = hitResult.item.data.hoverGroupId;
				clickAreaGroup.children.forEach((child) => {
					if (
						child.data?.hoverGroupId === targetGroupId &&
						child.data?.isClickArea
					) {
						foundClickArea = child;
					}
				});
			}
		}

		// Check if we're still hovering over the same hover group (click circle, body, or background rect)
		const isSameHoverGroup =
			hoveredClickArea &&
			foundClickArea &&
			hoveredClickArea.data?.hoverGroupId &&
			foundClickArea.data?.hoverGroupId &&
			hoveredClickArea.data.hoverGroupId === foundClickArea.data.hoverGroupId;

		// Reset previous hover state with animation (only if moving to different hover group)
		if (
			hoveredClickArea &&
			hoveredClickArea !== foundClickArea &&
			!isSameHoverGroup
		) {
			if (hoveredClickArea.data?.originalRadius) {
				// Animate back to original size
				animateRadius(hoveredClickArea, hoveredClickArea.data.originalRadius);
			}

			// Clear the hover state for this body (hides composition)
			if (hoveredClickArea.data?.bodyName) {
				bodyHoverStates.delete(hoveredClickArea.data.bodyName);
			}

			hoveredClickArea = null;
		}

		// Apply hover effect to new item with animation (only if different hover group)
		if (
			foundClickArea &&
			foundClickArea !== hoveredClickArea &&
			!isSameHoverGroup
		) {
			// Only animate if label is visible
			const orbitRadius = foundClickArea.data.orbitRadius || 0;
			const hasVisibleLabel = orbitRadius >= minOrbitRadiusForLabel;

			if (hasVisibleLabel) {
				// Store original radius if not already stored
				if (!foundClickArea.data.originalRadius) {
					foundClickArea.data.originalRadius = foundClickArea.bounds.width / 2;
				}

				hoveredClickArea = foundClickArea;

				// Animate to 200% size (100% larger)
				const targetRadius = foundClickArea.data.originalRadius * 2;
				animateRadius(foundClickArea, targetRadius);

				canvas.style.cursor = "pointer";
			}
		} else if (isSameHoverGroup && foundClickArea) {
			// Update reference when moving within same hover group (e.g., from click circle to background rect)
			hoveredClickArea = foundClickArea;
		} else if (!foundClickArea) {
			canvas.style.cursor = isDragging ? "grabbing" : "grab";
		}

		if (!isDragging) return;

		// Calculate simulationState.inclination and simulationState.rotation changes based on mouse/touch movement
		const deltaX = coords.clientX - dragStartX;
		const deltaY = coords.clientY - dragStartY;

		// Mark as dragged if moved more than 5 pixels
		if (Math.abs(deltaY) > 5 || Math.abs(deltaX) > 5) {
			dragMoved = true;
		}

		// Vertical drag: adjust inclination (-90 to 90 degrees)
		const inclinationChange = deltaY * 0.2; // Sensitivity factor (positive = drag down increases)
		let newInclination = Math.max(
			-90,
			Math.min(90, dragStartInclination + inclinationChange),
		);
		// Apply snapping (this updates simulationState directly)
		simulationState.inclination = snapAngle(
			newInclination,
			inclinationSnapPoints,
		);

		// Horizontal drag: adjust rotation (0 to 360 degrees, wrapping)
		const rotationChange = -deltaX * 0.2; // Sensitivity factor (negative = drag right rotates clockwise)
		let newRotation = (dragStartRotation + rotationChange + 360) % 360;
		// Apply snapping (handle wraparound at 360/0)
		simulationState.rotation = snapAngle(newRotation, rotationSnapPoints);
		// Also check snap to 360 (same as 0)
		if (Math.abs(newRotation - 360) <= 5) {
			simulationState.rotation = 0;
		}

		// Update display
		controlsInstance.updateDisplays();

		drawAxisLines();
		drawOrbits();
		updatePlanets();
	}

	canvas.addEventListener("mousemove", (event) => {
		handleMove(event);
	});

	canvas.addEventListener(
		"touchmove",
		(event) => {
			event.preventDefault(); // Prevent scrolling while dragging
			handleMove(event);
		},
		{ passive: false },
	);

	// Handle end of drag (mouse or touch)
	function handleDragEnd(event) {
		if (!dragMoved && isDragging) {
			// This was a click/tap, not a drag - check for celestial body click
			handleCanvasClick(event);
		}
		isDragging = false;
	}

	canvas.addEventListener("mouseup", (event) => {
		handleDragEnd(event);
	});

	canvas.addEventListener("touchend", (event) => {
		handleDragEnd(event);
	});

	canvas.addEventListener("mouseleave", () => {
		isDragging = false;
	});

	canvas.addEventListener("touchcancel", () => {
		isDragging = false;
	});

	// Handle canvas click for celestial body selection
	function handleCanvasClick(event) {
		const coords = getEventCoordinates(event);
		const rect = canvas.getBoundingClientRect();
		const x = coords.clientX - rect.left;
		const y = coords.clientY - rect.top;
		const clickPoint = new paper.Point(x, y);

		// Hit test to find clicked celestial body or click area
		const hitResult = paper.project.hitTest(clickPoint, {
			fill: true,
			stroke: true,
			tolerance: 5,
		});

		// Check if clicked on layer indicator text
		if (
			hitResult &&
			hitResult.item.data &&
			hitResult.item.data.isLayerIndicator
		) {
			const bodyName = hitResult.item.data.bodyName;
			cycleLayer(bodyName);
			return;
		}

		if (
			hitResult &&
			hitResult.item.data &&
			["planet", "moon"].includes(hitResult.item.data.type)
		) {
			const bodyType = hitResult.item.data.type;

			// Center the clicked body (works for both click circles and body circles)
			if (bodyType === "planet") {
				const planetIndex = hitResult.item.data.planetIndex;
				const planet = planetsData[planetIndex];
				setCenterBody(planet, null);
			} else if (bodyType === "moon") {
				// Find the moon and its parent planet
				const moonName = hitResult.item.data.moonName;
				let foundMoon = null;
				let parentPlanet = null;

				planetsData.forEach((planet) => {
					if (planet.moons) {
						const moon = planet.moons.find((m) => m.name === moonName);
						if (moon) {
							foundMoon = moon;
							parentPlanet = planet;
						}
					}
				});

				if (foundMoon && parentPlanet) {
					setCenterBody(foundMoon, parentPlanet);
				}
			}
		} else {
			// Click on empty space - return to sun center
			if (simulationState.centerBody) {
				setCenterBody(null, null);
			}
		}
	}

	// Cycle through available layers for a celestial body
	function cycleLayer(bodyName) {
		const hoverState = bodyHoverStates.get(bodyName);
		if (!hoverState) return;

		// Get celestial body composition data to find available layers
		const planetData = celestialBodyCompositions.find(
			(p) => p.name === bodyName,
		);
		if (!planetData) return;

		const availableLayers = Object.keys(planetData.layers);
		const currentLayer = hoverState.currentLayer || "surface";
		const currentIndex = availableLayers.indexOf(currentLayer);
		const nextIndex = (currentIndex + 1) % availableLayers.length;
		const nextLayer = availableLayers[nextIndex];

		// Update layer and reset composition animation
		hoverState.currentLayer = nextLayer;
		hoverState.compositionAnimStarted = false;
		hoverState.compositionAnimProgress = undefined;
		delete hoverState.showComposition;

		// Trigger re-expansion to restart composition animation
		hoverState.showComposition = true;

		// Force redraw
		updatePlanets();
	}

	// Start the simulation
	init();
}
