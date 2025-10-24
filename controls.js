// Control panel logic and event handlers
// This module handles all UI controls for the solar system visualization

export class Controls {
	constructor(config) {
		// Store REFERENCE to simulation state (not a copy)
		this.state = config.state;
		this.callbacks = config.callbacks;

		// Get DOM elements
		this.elements = {
			showOrbitsCheckbox: document.getElementById("showOrbits"),
			showLabelsCheckbox: document.getElementById("showLabels"),
			showCompoundNamesCheckbox: document.getElementById("showCompoundNames"),
			pausePlayButton: document.getElementById("pausePlay"),
			fontSizeSlider: document.getElementById("fontSizeSlider"),
			timeSpeedValue: document.getElementById("timeSpeedValue"),
			inclinationValue: document.getElementById("inclinationValue"),
			rotationValue: document.getElementById("rotationValue"),
			scaleValue: document.getElementById("scaleValue"),
			fontSizeValue: document.getElementById("fontSizeValue"),
			orbitScaleText: document.getElementById("orbitScaleText"),
			planetScaleText: document.getElementById("planetScaleText"),
			canvas: document.getElementById("myCanvas"),
			menuToggle: document.getElementById("menuToggle"),
			controlsPanel: document.querySelector(".controls"),
		};

		// Virtual slider values for smooth scrolling
		this.virtualZoomSlider = 50; // 0-100
		this.virtualTimeSlider = 55; // 0-100, 55 ≈ 1.0x

		// Initialize event listeners
		this.initEventListeners();
	}

	initEventListeners() {
		// Checkbox controls
		this.elements.showOrbitsCheckbox.addEventListener("change", () => {
			this.state.showOrbits = this.elements.showOrbitsCheckbox.checked;
			this.callbacks.drawOrbits();
		});

		this.elements.showLabelsCheckbox.addEventListener("change", () => {
			this.state.showLabels = this.elements.showLabelsCheckbox.checked;
			this.callbacks.updatePlanets();
		});

		this.elements.showCompoundNamesCheckbox.addEventListener("change", () => {
			this.state.showCompoundNames =
				this.elements.showCompoundNamesCheckbox.checked;
			this.callbacks.updatePlanets();
		});

		// Font size slider
		this.elements.fontSizeSlider.addEventListener("input", () => {
			this.state.labelFontSize = parseInt(this.elements.fontSizeSlider.value);
			this.elements.fontSizeValue.textContent = this.state.labelFontSize + "px";
			this.callbacks.updatePlanets();
		});

		// Pause/Play button
		this.elements.pausePlayButton.addEventListener("click", () => {
			this.togglePause();
		});

		// Keyboard controls
		document.addEventListener("keydown", (event) => {
			if (event.code === "Space" || event.key === " ") {
				event.preventDefault();
				this.togglePause();
			}
		});

		// Mouse wheel zoom and time speed control
		this.elements.canvas.addEventListener("wheel", (event) => {
			this.handleWheel(event);
		});

		// Mobile menu toggle
		this.elements.menuToggle.addEventListener("click", () => {
			this.elements.controlsPanel.classList.toggle("open");
			this.elements.menuToggle.classList.toggle("active");
		});

		// Close menu when clicking outside on mobile
		document.addEventListener("click", (e) => {
			if (window.innerWidth <= 768) {
				if (
					!this.elements.controlsPanel.contains(e.target) &&
					!this.elements.menuToggle.contains(e.target)
				) {
					this.elements.controlsPanel.classList.remove("open");
					this.elements.menuToggle.classList.remove("active");
				}
			}
		});
	}

	togglePause() {
		this.state.isPaused = !this.state.isPaused;
		this.elements.pausePlayButton.textContent = this.state.isPaused
			? "Play"
			: "Pause";
	}

	handleWheel(event) {
		event.preventDefault();

		// Check if scrolling horizontally (shift key + wheel, or horizontal trackpad scroll)
		const isHorizontal =
			event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);

		if (isHorizontal) {
			this.handleTimeSpeedScroll(event);
		} else {
			this.handleZoomScroll(event);
		}
	}

	handleTimeSpeedScroll(event) {
		const timeSpeedAdjust = 0.5;
		const delta = event.deltaX !== 0 ? event.deltaX : event.deltaY;

		if (delta < 0) {
			// Scroll left = slow down time
			this.virtualTimeSlider = Math.max(
				0,
				this.virtualTimeSlider - timeSpeedAdjust,
			);
		} else {
			// Scroll right = speed up time
			this.virtualTimeSlider = Math.min(
				100,
				this.virtualTimeSlider + timeSpeedAdjust,
			);
		}

		// Convert to logarithmic scale: range from very slow to fast
		// Center around 55 = 1.0x
		// Formula: timeSpeed = 10^((value - 55) / 30)
		// This gives: 0=0.001x, 55=1.0x, 100=31.6x (very fine control at slower speeds)
		this.state.timeSpeed = Math.pow(10, (this.virtualTimeSlider - 55) / 30);

		// Calculate real-world time scale
		const framesPerSecond = 60;
		const simulationDaysPerRealSecond =
			framesPerSecond * this.state.timeSpeed * 0.5;
		const earthPeriodDays = 365;
		const earthPeriodRealSeconds = 365 * 24 * 60 * 60; // 31,536,000 seconds
		const simulationSecondsForEarthOrbit =
			earthPeriodDays / simulationDaysPerRealSecond;
		const realTimeMultiplier =
			earthPeriodRealSeconds / simulationSecondsForEarthOrbit;

		// Format display
		let displayText;
		if (realTimeMultiplier >= 1000000) {
			displayText = (realTimeMultiplier / 1000000).toFixed(1) + "M×";
		} else if (realTimeMultiplier >= 1000) {
			displayText = (realTimeMultiplier / 1000).toFixed(1) + "K×";
		} else {
			displayText = realTimeMultiplier.toFixed(0) + "×";
		}

		// Update display
		this.elements.timeSpeedValue.textContent = displayText;
	}

	handleZoomScroll(event) {
		const zoomSpeed = 0.5;
		const previousScale = this.state.scale;

		if (event.deltaY < 0) {
			// Scroll up = zoom in (decrease slider value)
			this.virtualZoomSlider = Math.max(0, this.virtualZoomSlider - zoomSpeed);
		} else {
			// Scroll down = zoom out (increase slider value)
			this.virtualZoomSlider = Math.min(
				100,
				this.virtualZoomSlider + zoomSpeed,
			);
		}

		// Update scale
		this.state.scale = Math.pow(10, (50 - this.virtualZoomSlider) / 25);
		this.elements.scaleValue.textContent = this.state.scale.toFixed(2) + "x";
		this.updateScaleIndicators();

		// Auto-exit moon view ONLY when zooming out (not in) and crossing below 0.5
		if (
			this.state.viewMode === "planet-moons" &&
			this.state.scale < 0.5 &&
			this.state.scale < previousScale
		) {
			this.callbacks.transitionToSolarSystem();
		}

		this.callbacks.drawOrbits();
		this.callbacks.updatePlanets();
	}

	// Helper function to format distance
	formatDistance(distanceKm) {
		if (distanceKm >= 1000000000) {
			return (distanceKm / 1000000000).toFixed(1) + " billion km";
		} else if (distanceKm >= 1000000) {
			return (distanceKm / 1000000).toFixed(1) + " million km";
		} else if (distanceKm >= 1000) {
			return (distanceKm / 1000).toFixed(0) + " thousand km";
		} else {
			return distanceKm.toFixed(0) + " km";
		}
	}

	// Update orbital distance scale indicator
	updateOrbitScaleIndicator() {
		const scaleLineWidth = 100; // pixels
		const auToKm = 149600000; // 1 AU in km
		const distanceUnitsPerAU = 100; // simulation units per AU

		const distanceKm =
			(scaleLineWidth / (distanceUnitsPerAU * this.state.scale)) * auToKm;

		this.elements.orbitScaleText.textContent = this.formatDistance(distanceKm);
	}

	// Update planet/moon size scale indicator
	updatePlanetScaleIndicator() {
		const scaleLineWidth = 100; // pixels
		const earthDiameterKm = 12756;
		const earthSizePixels = 5;
		const kmPerPixel =
			earthDiameterKm / (earthSizePixels * 2 * this.state.scale);
		const distanceKm = scaleLineWidth * kmPerPixel;

		this.elements.planetScaleText.textContent = this.formatDistance(distanceKm);
	}

	// Update both scale indicators
	updateScaleIndicators() {
		this.updateOrbitScaleIndicator();
		this.updatePlanetScaleIndicator();
	}

	// Update control displays
	updateDisplays() {
		this.elements.inclinationValue.textContent =
			Math.round(this.state.inclination) + "°";
		this.elements.rotationValue.textContent =
			Math.round(this.state.rotation) + "°";
	}
}
