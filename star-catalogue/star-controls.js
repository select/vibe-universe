export class StarControls {
	constructor(config) {
		this.state = config.state;
		this.callbacks = config.callbacks;

		this.setupControls();
		this.setupMobileMenu();
		this.updateDisplays();
	}

	setupControls() {
		// Distance slider
		const distanceSlider = document.getElementById('distanceSlider');
		const distanceSliderValue = document.getElementById('distanceSliderValue');

		if (distanceSlider) {
			distanceSlider.value = this.state.maxDistance;
			distanceSliderValue.textContent = `${this.state.maxDistance} ly`;

			distanceSlider.addEventListener('input', (e) => {
				this.state.maxDistance = parseFloat(e.target.value);
				distanceSliderValue.textContent = `${this.state.maxDistance} ly`;
				this.updateDisplays();
				this.callbacks.drawStars();
			});
		}
	}

	setupMobileMenu() {
		const menuToggle = document.getElementById('menuToggle');
		const controls = document.querySelector('.controls');

		if (menuToggle && controls) {
			menuToggle.addEventListener('click', () => {
				controls.classList.toggle('open');
				menuToggle.classList.toggle('active');
			});
		}
	}

	updateDisplays() {
		// Update all display values
		const starCountValue = document.getElementById('starCountValue');
		const maxDistanceValue = document.getElementById('maxDistanceValue');
		const inclinationValue = document.getElementById('inclinationValue');
		const rotationValue = document.getElementById('rotationValue');

		if (maxDistanceValue) {
			maxDistanceValue.textContent = `${this.state.maxDistance} ly`;
		}

		if (inclinationValue) {
			inclinationValue.textContent = `${Math.round(this.state.inclination)}°`;
		}

		if (rotationValue) {
			rotationValue.textContent = `${Math.round(this.state.rotation)}°`;
		}
	}
}
