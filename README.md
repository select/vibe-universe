# Vibe Universe

An interactive solar system visualization with planetary data and chemical composition tools.

This is my spare time vibe coding project. Don't expect realistiv pyhsics or anything. It's just for fun and learning.

If you like to imporve this project, feel free to create a pull request.

## Repository

Live demo: [select.github.io/universe](https://select.github.io/universe)


## Datasets
- https://exoplanet.eu/catalog/#downloads-section
- https://www.projectrho.com/public_html/starmaps/catalogues.php
- https://astronexus.com/projects/hyg


## Features

### Interactive Solar System (`index.html`)

- Real-time visualization of planets orbiting the sun
- Accurate orbital periods and distances (scaled for visualization)
- Interactive controls for:
  - Time speed adjustment
  - Planet size scaling
  - Orbit visibility toggles
  - Orbital inclinations
- Pan and zoom capabilities
- Moon orbits for planets with satellites
- Scale indicators showing relative distances

### Planet Composition Tool (`planet-composition.js`)

- Calculate and visualize planetary compositions
- Chemical formula registry with unique color coding
- Support for various minerals and compounds:
  - Metals (Fe, Ni, Al, Ca, Mg, etc.)
  - Silicates (SiO₂, MgSiO₃, FeSiO₃, etc.)
  - Oxides (FeO, MgO, Al₂O₃, etc.)
  - Sulfides (FeS, etc.)
  - Water ice (H₂O)
  - And many more compounds

### Utility Pages

#### Formula Color Registry (`view-formula-colors.html`)

Browse all available chemical formulas and their assigned colors, organized by category:

- Metals
- Silicates
- Oxides
- Sulfides
- Carbonates
- Ice compounds
- Atmospheric gases

#### Planet Composition Examples (`example-planet-composition.html`)

Interactive examples and documentation for using the planet composition API.

## Project Structure

```
vibe-universe/
├── index.html                      # Main solar system visualization
├── planets-data.js                 # Planetary orbital data
├── planet-composition.js           # Composition calculation and visualization
├── formula-registry.js             # Chemical formula color mappings
├── view-formula-colors.html        # Formula color reference
├── example-planet-composition.html # Usage examples
└── lib/
    ├── paper-full.js              # Paper.js graphics library
    ├── svg-export.js              # SVG export functionality
    └── formula-utils.js           # Chemical formula utilities
```

## Technology Stack

- **Paper.js**: Vector graphics scripting framework
- **Vanilla JavaScript**: No framework dependencies for core functionality
- **HTML5 Canvas**: Hardware-accelerated rendering

## License

See [LICENSE](LICENSE) file for details.
