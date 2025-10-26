// Chemical Formula Registry
// Central registry of all chemical formulas used in planet compositions
// Each formula has a unique, visually distinct color

const formulaRegistry = {
	// Pure Elements - Metals
	Fe: {
		name: 'Iron',
		color: '#D32F2F', // Deep red
		category: 'metal',
	},
	Ni: {
		name: 'Nickel',
		color: '#C0C0C0', // Silver
		category: 'metal',
	},
	Al: {
		name: 'Aluminum',
		color: '#90A4AE', // Blue-gray
		category: 'metal',
	},
	Ca: {
		name: 'Calcium',
		color: '#F5F5F5', // Off-white
		category: 'metal',
	},
	Mg: {
		name: 'Magnesium',
		color: '#BDBDBD', // Medium gray
		category: 'metal',
	},

	// Pure Elements - Non-metals
	Si: {
		name: 'Silicon',
		color: '#616161', // Dark gray
		category: 'metalloid',
	},
	O: {
		name: 'Oxygen',
		color: '#42A5F5', // Sky blue
		category: 'non-metal',
	},
	S: {
		name: 'Sulfur',
		color: '#FFEB3B', // Bright yellow
		category: 'non-metal',
	},
	C: {
		name: 'Carbon',
		color: '#212121', // Almost black
		category: 'non-metal',
	},
	N: {
		name: 'Nitrogen',
		color: '#64B5F6', // Light blue
		category: 'non-metal',
	},
	H: {
		name: 'Hydrogen',
		color: '#E3F2FD', // Very light blue
		category: 'non-metal',
	},

	// Noble Gases
	He: {
		name: 'Helium',
		color: '#FFF59D', // Light yellow
		category: 'noble-gas',
	},

	// Simple Oxides
	SiO2: {
		name: 'Silicon Dioxide (Quartz/Sand)',
		color: '#F4A460', // Sandy brown
		category: 'oxide',
	},
	MgO: {
		name: 'Magnesium Oxide',
		color: '#ECEFF1', // Very light gray
		category: 'oxide',
	},
	FeO: {
		name: 'Iron(II) Oxide',
		color: '#6D4C41', // Dark brown
		category: 'oxide',
	},
	Fe2O3: {
		name: 'Iron(III) Oxide (Rust/Hematite)',
		color: '#E64A19', // Red-orange (Mars)
		category: 'oxide',
	},
	CaO: {
		name: 'Calcium Oxide',
		color: '#FAFAFA', // Near white
		category: 'oxide',
	},
	Al2O3: {
		name: 'Aluminum Oxide (Alumina)',
		color: '#CFD8DC', // Light blue-gray
		category: 'oxide',
	},

	// Water and Ices
	H2O: {
		name: 'Water/Ice',
		color: '#2196F3', // Blue
		category: 'ice',
	},

	// Hydrogen Compounds
	H2: {
		name: 'Molecular Hydrogen',
		color: '#BBDEFB', // Light blue
		category: 'gas',
	},
	CH4: {
		name: 'Methane',
		color: '#FF9800', // Orange
		category: 'gas',
	},
	NH3: {
		name: 'Ammonia',
		color: '#66BB6A', // Green
		category: 'gas',
	},

	// Other Ices
	N2: {
		name: 'Nitrogen Ice',
		color: '#81D4FA', // Light cyan
		category: 'ice',
	},
	CO: {
		name: 'Carbon Monoxide Ice',
		color: '#78909C', // Blue-gray
		category: 'ice',
	},

	// Sulfides
	FeS: {
		name: 'Iron Sulfide',
		color: '#8D6E63', // Brown
		category: 'sulfide',
	},

	// Complex Silicates
	'Mg1.5Fe0.5SiO4': {
		name: 'Olivine',
		color: '#7CB342', // Olive green
		category: 'silicate',
	},
	'Mg0.7Fe0.3SiO3': {
		name: 'Pyroxene',
		color: '#9CCC65', // Light green
		category: 'silicate',
	},
	'MgFe0.5SiO4': {
		name: 'Silicate Minerals',
		color: '#AED581', // Light lime green
		category: 'silicate',
	},
	Mg3Al2Si3O12: {
		name: 'Garnet',
		color: '#C62828', // Deep red
		category: 'silicate',
	},

	// Mixed/Complex Materials
	'S0.5O0.5': {
		name: 'Sulfur and Oxygen Mix',
		color: '#FDD835', // Bright yellow
		category: 'mixture',
	},
	'C0.5N0.5': {
		name: 'Carbon-Nitrogen Volatiles',
		color: '#546E7A', // Blue-gray
		category: 'mixture',
	},
	'H2.5O0.5N0.5': {
		name: 'Water/Ammonia Ice Mix',
		color: '#4FC3F7', // Cyan
		category: 'mixture',
	},
	FeSiO2: {
		name: 'Iron and Rock Mix',
		color: '#A1887F', // Warm gray
		category: 'mixture',
	},
	'SiO2Fe0.5Mg0.5': {
		name: 'Silicates and Metals',
		color: '#BCAAA4', // Light brown
		category: 'mixture',
	},
	'SiO2Mg0.3Fe0.3': {
		name: 'Rock and Silicates',
		color: '#D7CCC8', // Very light brown
		category: 'mixture',
	},

	// Additional Silicates and Complex Minerals
	Mg2SiO4: {
		name: 'Forsterite (Magnesium Silicate)',
		color: '#C5E1A5', // Light green
		category: 'silicate',
	},
	CaAl2Si2O8: {
		name: 'Anorthite (Plagioclase Feldspar)',
		color: '#EEEEEE', // Very light gray
		category: 'silicate',
	},
	'Ca(Mg,Fe)Si2O6': {
		name: 'Augite (Clinopyroxene)',
		color: '#558B2F', // Dark green
		category: 'silicate',
	},
	'(Mg,Fe)SiO3': {
		name: 'Pyroxene (variable composition)',
		color: '#8BC34A', // Light green
		category: 'silicate',
	},
	'(Mg,Fe)2SiO4': {
		name: 'Olivine (variable composition)',
		color: '#689F38', // Medium green
		category: 'silicate',
	},
	'(Mg,Fe,Ca)SiO3': {
		name: 'Orthopyroxene/Clinopyroxene',
		color: '#9CCC65', // Light lime
		category: 'silicate',
	},

	// Hydrated Minerals
	'Mg3Si4O10(OH)2': {
		name: 'Talc/Phyllosilicate (Clay)',
		color: '#D4E157', // Lime yellow
		category: 'silicate',
	},
	'Mg3Si2O5(OH)4': {
		name: 'Serpentine (Hydrated Silicate)',
		color: '#C0CA33', // Yellow-green
		category: 'silicate',
	},
	'Na0.3Fe2(Si4O10)(OH)2': {
		name: 'Nontronite (Iron-rich Clay)',
		color: '#827717', // Dark olive
		category: 'silicate',
	},

	// Carbonates and Salts
	Na2CO3: {
		name: 'Sodium Carbonate',
		color: '#F5F5F5', // White
		category: 'carbonate',
	},
	NaCl: {
		name: 'Sodium Chloride (Salt)',
		color: '#FAFAFA', // Off-white
		category: 'salt',
	},
	'NaCl·H2O': {
		name: 'Salt Brine',
		color: '#E0F2F1', // Light teal
		category: 'salt',
	},
	Na2SO4: {
		name: 'Sodium Sulfate',
		color: '#E8F5E9', // Very light green
		category: 'salt',
	},
	MgSO4: {
		name: 'Magnesium Sulfate (Epsom Salt)',
		color: '#F1F8E9', // Light yellow-green
		category: 'salt',
	},
	NH4Cl: {
		name: 'Ammonium Chloride',
		color: '#F9FBE7', // Very light yellow
		category: 'salt',
	},

	// Titanium Compounds
	FeTiO3: {
		name: 'Ilmenite (Iron Titanium Oxide)',
		color: '#424242', // Dark gray
		category: 'oxide',
	},
	TiO2: {
		name: 'Titanium Dioxide',
		color: '#FAFAFA', // White
		category: 'oxide',
	},

	// Iron Oxides
	Fe3O4: {
		name: 'Magnetite (Iron Oxide)',
		color: '#1C1C1C', // Very dark gray
		category: 'oxide',
	},

	// Sulfur Dioxide
	SO2: {
		name: 'Sulfur Dioxide',
		color: '#FFF176', // Light yellow
		category: 'gas',
	},

	// Ethane and Hydrocarbons
	C2H6: {
		name: 'Ethane',
		color: '#FFB74D', // Light orange
		category: 'hydrocarbon',
	},

	// Organic Compounds
	C10H10N2O2: {
		name: 'Tholins (Organic Compounds)',
		color: '#8D6E63', // Reddish-brown
		category: 'organic',
	},
	CHON: {
		name: 'Organic CHON Compounds',
		color: '#6D4C41', // Dark brown
		category: 'organic',
	},

	// Ammonia Hydrates
	'NH3·H2O': {
		name: 'Ammonia Hydrate',
		color: '#80DEEA', // Light cyan
		category: 'ice',
	},

	// Mixed Formulas
	CON2: {
		name: 'Carbon Monoxide-Nitrogen Mix',
		color: '#90CAF9', // Light blue
		category: 'mixture',
	},
	'CH4·CO2': {
		name: 'Methane-CO2 Volatile Mix',
		color: '#FFCC80', // Light orange
		category: 'mixture',
	},
	'SiO2·H2O': {
		name: 'Hydrated Silica',
		color: '#B0BEC5', // Blue-gray
		category: 'mixture',
	},
	'FeO+TiO2+SiO2': {
		name: 'Regolith Oxides Mix',
		color: '#757575', // Gray
		category: 'mixture',
	},
	H2OMg2SiO4: {
		name: 'Ice-Rock Mix',
		color: '#B3E5FC', // Very light blue
		category: 'mixture',
	},
	FeMgSiO4: {
		name: 'Iron-Magnesium Silicate',
		color: '#A5D6A7', // Light green
		category: 'silicate',
	},
	SiO2FeO: {
		name: 'Silica-Iron Oxide Mix',
		color: '#CFD8DC', // Light blue-gray
		category: 'mixture',
	},
	FeSiO3FeS: {
		name: 'Iron Silicate-Sulfide Mix',
		color: '#8D6E63', // Brown
		category: 'mixture',
	},

	// Metallic Alloys
	FeNi: {
		name: 'Iron-Nickel Alloy',
		color: '#9E9E9E', // Gray
		category: 'metal',
	},

	// Catch-all for unknown/other compounds
	'': {
		name: 'Unknown/Other',
		color: '#9E9E9E', // Gray
		category: 'other',
	},
};

// List of all unique formulas used in the system
const allFormulas = [
	// Pure Elements - Metals
	'Fe',
	'Ni',
	'Al',
	'Ca',
	'Mg',
	// Pure Elements - Non-metals
	'Si',
	'O',
	'S',
	'C',
	'N',
	'H',
	// Noble Gases
	'He',
	// Simple Oxides
	'SiO2',
	'MgO',
	'FeO',
	'Fe2O3',
	'CaO',
	'Al2O3',
	'TiO2',
	'Fe3O4',
	// Water and Ices
	'H2O',
	// Hydrogen Compounds
	'H2',
	'CH4',
	'NH3',
	// Other Ices
	'N2',
	'CO',
	'CO2',
	'SO2',
	// Sulfides
	'FeS',
	// Complex Silicates
	'Mg1.5Fe0.5SiO4',
	'Mg0.7Fe0.3SiO3',
	'MgFe0.5SiO4',
	'Mg3Al2Si3O12',
	'Mg2SiO4',
	'MgSiO3',
	'FeMgSiO4',
	'(Mg,Fe)2SiO4',
	'(Mg,Fe)SiO3',
	'(Mg,Fe,Ca)SiO3',
	'CaAl2Si2O8',
	'Ca(Mg,Fe)Si2O6',
	// Hydrated Minerals
	'Mg3Si4O10(OH)2',
	'Mg3Si2O5(OH)4',
	'Na0.3Fe2(Si4O10)(OH)2',
	// Carbonates and Salts
	'Na2CO3',
	'NaCl',
	'NaCl·H2O',
	'Na2SO4',
	'MgSO4',
	'NH4Cl',
	// Titanium Compounds
	'FeTiO3',
	// Hydrocarbons
	'C2H6',
	// Organic Compounds
	'C10H10N2O2',
	'CHON',
	// Ammonia Hydrates
	'NH3·H2O',
	// Mixed/Complex Materials
	'S0.5O0.5',
	'C0.5N0.5',
	'H2.5O0.5N0.5',
	'FeSiO2',
	'FeSiO3',
	'SiO2Fe0.5Mg0.5',
	'SiO2Mg0.3Fe0.3',
	'SiO2Fe0.3Mg0.3',
	'CON2',
	'CH4·CO2',
	'SiO2·H2O',
	'FeO+TiO2+SiO2',
	'H2OMg2SiO4',
	'SiO2FeO',
	'FeSiO3FeS',
	// Metallic Alloys
	'FeNi',
	// Unknown
	'',
];

// Generate a unique color using golden ratio method for visual distinction
function generateDistinctColor(
	index,
	total,
	saturation = 0.7,
	lightness = 0.6,
) {
	const goldenRatio = 0.618033988749895;
	const hue = (index * goldenRatio) % 1.0;
	return hslToHex(hue, saturation, lightness);
}

// Convert HSL to HEX
function hslToHex(h, s, l) {
	let r, g, b;

	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p, q, t) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	const toHex = (x) => {
		const hex = Math.round(x * 255).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// Generate color palette with maximum visual distinction
function generateColorPalette() {
	const uniqueFormulas = [...new Set(allFormulas)].filter((f) => f !== '');
	const total = uniqueFormulas.length;

	const colorMap = {};
	uniqueFormulas.forEach((formula, index) => {
		// Use different saturation/lightness for different categories
		let saturation = 0.7;
		let lightness = 0.55;

		// Adjust for specific types
		if (
			formula.includes('H2O') ||
			formula.includes('N2') ||
			formula.includes('CO')
		) {
			// Ices - cooler, more saturated
			saturation = 0.65;
			lightness = 0.6;
		} else if (formula === 'H2' || formula === 'He') {
			// Gases - lighter
			lightness = 0.75;
			saturation = 0.5;
		} else if (formula === 'Fe' || formula === 'Ni' || formula.includes('Fe')) {
			// Metals/iron compounds - warmer
			saturation = 0.6;
			lightness = 0.45;
		}

		colorMap[formula] = generateDistinctColor(
			index,
			total,
			saturation,
			lightness,
		);
	});

	return colorMap;
}

// Generate and display unique colors for all formulas
const generatedColors = generateColorPalette();

// Helper function to get color for a formula
function getFormulaColor(formula) {
	if (formulaRegistry[formula]) {
		return formulaRegistry[formula].color;
	}
	// Use generated color as fallback
	if (generatedColors[formula]) {
		return generatedColors[formula];
	}
	// Default gray for unknown formulas
	return '#9E9E9E';
}

// Helper function to get formula info
function getFormulaInfo(formula) {
	return (
		formulaRegistry[formula] || {
			name: formula || 'Unknown',
			color: generatedColors[formula] || '#9E9E9E',
			category: 'unknown',
		}
	);
}

// Helper function to get all formulas by category
function getFormulasByCategory(category) {
	return Object.entries(formulaRegistry)
		.filter(([_, info]) => info.category === category)
		.map(([formula, info]) => ({ formula, ...info }));
}

// Helper function to list all categories
function getAllCategories() {
	const categories = new Set();
	Object.values(formulaRegistry).forEach((info) => {
		categories.add(info.category);
	});
	return Array.from(categories).sort();
}

// Helper function to get all unique formulas with colors
function getAllFormulasWithColors() {
	const result = {};
	const uniqueFormulas = [...new Set(allFormulas)].filter((f) => f !== '');

	uniqueFormulas.forEach((formula) => {
		result[formula] = {
			...getFormulaInfo(formula),
			generatedColor: generatedColors[formula],
		};
	});

	return result;
}

// Export for use in other modules (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		formulaRegistry,
		generatedColors,
		getFormulaColor,
		getFormulaInfo,
		getFormulasByCategory,
		getAllCategories,
		getAllFormulasWithColors,
	};
}

// ES6 module exports
// Usage examples:
// getFormulaColor("H2O");  // Returns: "#2196F3"
// getFormulaInfo("Fe2O3");  // Returns: {name: "Iron(III) Oxide...", color: "#E64A19", category: "oxide"}
// getFormulasByCategory("gas");  // Returns all gas formulas
// getAllCategories();  // Returns: ["gas", "ice", "metal", ...]
export {
	formulaRegistry,
	generatedColors,
	getFormulaColor,
	getFormulaInfo,
	getFormulasByCategory,
	getAllCategories,
	getAllFormulasWithColors,
};
