// Import formula registry for colors
// To use:
import { getFormulaColor } from './formula-registry.js?v=1';

const planetCompositions = [
	{
		name: 'Mercury',
		layers: {
			surface: [
				{
					compound: 'Silicon dioxide (SiO2)',
					percent: 40,
					formula: 'SiO2',
				},
				{
					compound: 'Magnesium oxide (MgO)',
					percent: 25,
					formula: 'MgO',
				},
				{
					compound: 'Iron oxide (FeO)',
					percent: 15,
					formula: 'FeO',
				},
				{
					compound: 'Sulfur compounds',
					percent: 10,
					formula: 'S',
				},
				{
					compound: 'Others',
					percent: 10,
					formula: '',
				},
			],
			mantle: [
				{
					compound: 'Silicate minerals (olivine, pyroxene)',
					percent: 80,
					formula: 'Mg1.5Fe0.5SiO4',
				},
				{
					compound: 'Sulfur',
					percent: 10,
					formula: 'S',
				},
				{
					compound: 'Iron sulfide',
					percent: 10,
					formula: 'FeS',
				},
			],
			core: [
				{
					compound: 'Iron (Fe)',
					percent: 70,
					formula: 'Fe',
				},
				{
					compound: 'Nickel (Ni)',
					percent: 30,
					formula: 'Ni',
				},
			],
		},
	},
	{
		name: 'Venus',
		layers: {
			surface: [
				{
					compound: 'Silicon dioxide (SiO2)',
					percent: 45,
					formula: 'SiO2',
				},
				{
					compound: 'Magnesium oxide (MgO)',
					percent: 25,
					formula: 'MgO',
				},
				{
					compound: 'Iron oxide (FeO)',
					percent: 15,
					formula: 'FeO',
				},
				{
					compound: 'Calcium oxide (CaO)',
					percent: 10,
					formula: 'CaO',
				},
				{
					compound: 'Aluminum oxide (Al2O3)',
					percent: 5,
					formula: 'Al2O3',
				},
			],
			mantle: [
				{
					compound: 'Silicates (olivine, pyroxene)',
					percent: 80,
					formula: 'Mg1.5Fe0.5SiO4',
				},
				{
					compound: 'Iron-bearing minerals',
					percent: 15,
					formula: 'FeO',
				},
				{
					compound: 'Sulfur',
					percent: 5,
					formula: 'S',
				},
			],
			core: [
				{
					compound: 'Iron (Fe)',
					percent: 85,
					formula: 'Fe',
				},
				{
					compound: 'Nickel (Ni)',
					percent: 15,
					formula: 'Ni',
				},
			],
		},
	},
	{
		name: 'Earth',
		layers: {
			surface: [
				{
					compound: 'Oxygen (O)',
					percent: 46.6,
					formula: 'O',
				},
				{
					compound: 'Silicon (Si)',
					percent: 27.7,
					formula: 'Si',
				},
				{
					compound: 'Aluminum (Al)',
					percent: 8.1,
					formula: 'Al',
				},
				{
					compound: 'Iron (Fe)',
					percent: 5,
					formula: 'Fe',
				},
				{
					compound: 'Calcium (Ca)',
					percent: 3.6,
					formula: 'Ca',
				},
			],
			mantle: [
				{
					compound: 'Olivine (Mg,Fe)2SiO4',
					percent: 44,
					formula: 'Mg1.5Fe0.5SiO4',
				},
				{
					compound: 'Pyroxene (Mg,Fe)SiO3',
					percent: 38,
					formula: 'Mg0.7Fe0.3SiO3',
				},
				{
					compound: 'Garnet',
					percent: 8,
					formula: 'Mg3Al2Si3O12',
				},
				{
					compound: 'Oxides',
					percent: 10,
					formula: 'FeO',
				},
			],
			core: [
				{
					compound: 'Iron (Fe)',
					percent: 85,
					formula: 'Fe',
				},
				{
					compound: 'Nickel (Ni)',
					percent: 5,
					formula: 'Ni',
				},
				{
					compound: 'Sulfur and oxygen',
					percent: 10,
					formula: 'S0.5O0.5',
				},
			],
		},
	},
	{
		name: 'Mars',
		layers: {
			surface: [
				{
					compound: 'Iron oxide (Fe2O3)',
					percent: 20,
					formula: 'Fe2O3',
				},
				{
					compound: 'Silicon dioxide (SiO2)',
					percent: 45,
					formula: 'SiO2',
				},
				{
					compound: 'Magnesium oxide (MgO)',
					percent: 15,
					formula: 'MgO',
				},
				{
					compound: 'Aluminum oxide (Al2O3)',
					percent: 10,
					formula: 'Al2O3',
				},
				{
					compound: 'Calcium oxide (CaO)',
					percent: 10,
					formula: 'CaO',
				},
			],
			mantle: [
				{
					compound: 'Silicate minerals',
					percent: 85,
					formula: 'MgFe0.5SiO4',
				},
				{
					compound: 'Iron-bearing minerals',
					percent: 15,
					formula: 'FeO',
				},
			],
			core: [
				{
					compound: 'Iron (Fe)',
					percent: 65,
					formula: 'Fe',
				},
				{
					compound: 'Sulfur (S)',
					percent: 20,
					formula: 'S',
				},
				{
					compound: 'Nickel (Ni)',
					percent: 15,
					formula: 'Ni',
				},
			],
		},
	},
	{
		name: 'Jupiter',
		layers: {
			surface: [
				{
					compound: 'Molecular hydrogen (H2)',
					percent: 89,
					formula: 'H2',
				},
				{
					compound: 'Helium (He)',
					percent: 10,
					formula: 'He',
				},
				{
					compound: 'Methane (CH4)',
					percent: 0.3,
					formula: 'CH4',
				},
				{
					compound: 'Ammonia (NH3)',
					percent: 0.02,
					formula: 'NH3',
				},
			],
			intermediate: [
				{
					compound: 'Metallic hydrogen',
					percent: 80,
					formula: 'H',
				},
				{
					compound: 'Helium',
					percent: 14,
					formula: 'He',
				},
				{
					compound: 'Other volatiles',
					percent: 6,
					formula: 'C0.5N0.5',
				},
			],
			core: [
				{
					compound: 'Iron and rock',
					percent: 50,
					formula: 'FeSiO2',
				},
				{
					compound: 'Water/Ammonia ices',
					percent: 50,
					formula: 'H2.5O0.5N0.5',
				},
			],
		},
	},
	{
		name: 'Saturn',
		layers: {
			surface: [
				{
					compound: 'Hydrogen (H2)',
					percent: 96,
					formula: 'H2',
				},
				{
					compound: 'Helium (He)',
					percent: 3,
					formula: 'He',
				},
				{
					compound: 'Methane (CH4)',
					percent: 0.4,
					formula: 'CH4',
				},
				{
					compound: 'Ammonia (NH3)',
					percent: 0.1,
					formula: 'NH3',
				},
			],
			intermediate: [
				{
					compound: 'Liquid metallic hydrogen',
					percent: 65,
					formula: 'H',
				},
				{
					compound: 'Helium',
					percent: 30,
					formula: 'He',
				},
				{
					compound: 'Other volatiles',
					percent: 5,
					formula: 'C0.5N0.5',
				},
			],
			core: [
				{
					compound: 'Rocky/iron materials',
					percent: 60,
					formula: 'FeSiO2',
				},
				{
					compound: 'Ices (H2O, NH3)',
					percent: 40,
					formula: 'H2.5O0.5N0.5',
				},
			],
		},
	},
	{
		name: 'Uranus',
		layers: {
			surface: [
				{
					compound: 'Hydrogen (H2)',
					percent: 82,
					formula: 'H2',
				},
				{
					compound: 'Helium (He)',
					percent: 15,
					formula: 'He',
				},
				{
					compound: 'Methane (CH4)',
					percent: 2,
					formula: 'CH4',
				},
			],
			intermediate: [
				{
					compound: 'Water (H2O)',
					percent: 60,
					formula: 'H2O',
				},
				{
					compound: 'Ammonia (NH3)',
					percent: 25,
					formula: 'NH3',
				},
				{
					compound: 'Methane (CH4)',
					percent: 15,
					formula: 'CH4',
				},
			],
			core: [
				{
					compound: 'Silicates and metals',
					percent: 100,
					formula: 'SiO2Fe0.5Mg0.5',
				},
			],
		},
	},
	{
		name: 'Neptune',
		layers: {
			surface: [
				{
					compound: 'Hydrogen (H2)',
					percent: 80,
					formula: 'H2',
				},
				{
					compound: 'Helium (He)',
					percent: 19,
					formula: 'He',
				},
				{
					compound: 'Methane (CH4)',
					percent: 1,
					formula: 'CH4',
				},
			],
			intermediate: [
				{
					compound: 'Water (H2O)',
					percent: 65,
					formula: 'H2O',
				},
				{
					compound: 'Ammonia (NH3)',
					percent: 25,
					formula: 'NH3',
				},
				{
					compound: 'Methane (CH4)',
					percent: 10,
					formula: 'CH4',
				},
			],
			core: [
				{
					compound: 'Rocky/metal materials',
					percent: 100,
					formula: 'SiO2Fe0.5Mg0.5',
				},
			],
		},
	},
	{
		name: 'Pluto',
		layers: {
			surface: [
				{
					compound: 'Nitrogen ice (N2)',
					percent: 50,
					formula: 'N2',
				},
				{
					compound: 'Methane ice (CH4)',
					percent: 30,
					formula: 'CH4',
				},
				{
					compound: 'Carbon monoxide ice (CO)',
					percent: 20,
					formula: 'CO',
				},
			],
			mantle: [
				{
					compound: 'Water ice (H2O)',
					percent: 100,
					formula: 'H2O',
				},
			],
			core: [
				{
					compound: 'Rock and silicates',
					percent: 100,
					formula: 'SiO2Mg0.3Fe0.3',
				},
			],
		},
	},
	{
		name: 'Ceres',
		layers: {
			surface: [
				{
					compound: 'Hydrated minerals (e.g., clays)',
					percent: 40,
					formula: 'Mg3Si4O10(OH)2',
				},
				{
					compound: 'Water ice (H2O)',
					percent: 30,
					formula: 'H2O',
				},
				{
					compound: 'Carbonates (Na2CO3, NH4Cl)',
					percent: 20,
					formula: 'Na2CO3',
				},
				{
					compound: 'Organic materials (C-H-O-N-S compounds)',
					percent: 10,
					formula: 'CHON',
				},
			],
			mantle: [
				{
					compound: 'Hydrated silicates (phyllosilicates)',
					percent: 60,
					formula: 'Mg3Si4O10(OH)2',
				},
				{
					compound: 'Salts and brines',
					percent: 25,
					formula: 'NaCl·H2O',
				},
				{
					compound: 'Water ice',
					percent: 15,
					formula: 'H2O',
				},
			],
			core: [
				{
					compound: 'Rock and silicates',
					percent: 70,
					formula: 'SiO2Fe0.3Mg0.3',
				},
				{
					compound: 'Iron sulfide',
					percent: 20,
					formula: 'FeS',
				},
				{
					compound: 'Porous hydrated minerals',
					percent: 10,
					formula: 'Mg3Si2O5(OH)4',
				},
			],
		},
	},
	{
		name: 'Haumea',
		layers: {
			surface: [
				{
					compound: 'Water ice (crystalline)',
					percent: 90,
					formula: 'H2O',
				},
				{
					compound: 'Organic compounds (tholins)',
					percent: 10,
					formula: 'C10H10N2O2',
				},
			],
			mantle: [
				{
					compound: 'Water ice (high-pressure phase)',
					percent: 80,
					formula: 'H2O',
				},
				{
					compound: 'Ammonia-rich ices',
					percent: 20,
					formula: 'NH3·H2O',
				},
			],
			core: [
				{
					compound: 'Silicates (hydrated, serpentinized rock)',
					percent: 85,
					formula: 'Mg3Si2O5(OH)4',
				},
				{
					compound: 'Metallics (iron/nickel)',
					percent: 15,
					formula: 'FeNi',
				},
			],
		},
	},
	{
		name: 'Eris',
		layers: {
			surface: [
				{
					compound: 'Methane ice (CH4)',
					percent: 60,
					formula: 'CH4',
				},
				{
					compound: 'Nitrogen ice (N2)',
					percent: 30,
					formula: 'N2',
				},
				{
					compound: 'Carbon monoxide (CO) traces',
					percent: 10,
					formula: 'CO',
				},
			],
			mantle: [
				{
					compound: 'Water ice (H2O)',
					percent: 90,
					formula: 'H2O',
				},
				{
					compound: 'Volatile ices (CO, N2)',
					percent: 10,
					formula: 'CON2',
				},
			],
			core: [
				{
					compound: 'Silicate rock',
					percent: 85,
					formula: 'SiO2Mg0.3Fe0.3',
				},
				{
					compound: 'Metallic elements (iron, nickel)',
					percent: 15,
					formula: 'FeNi',
				},
			],
		},
	},
];

// Moon compositions data
const moonCompositions = [
	// --- EARTH MOON ---
	{
		name: 'Moon',
		layers: {
			surface: [
				{
					compound: 'Anorthosite (plagioclase feldspar)',
					percent: 45,
					formula: 'CaAl2Si2O8',
				},
				{
					compound: 'Basalt (mare regions)',
					percent: 35,
					formula: 'Ca(Mg,Fe)Si2O6',
				},
				{
					compound: 'Pyroxene minerals',
					percent: 10,
					formula: '(Mg,Fe)SiO3',
				},
				{
					compound: 'Olivine',
					percent: 5,
					formula: '(Mg,Fe)2SiO4',
				},
				{
					compound: 'Regolith fines and oxides',
					percent: 5,
					formula: 'FeO+TiO2+SiO2',
				},
			],
			mantle: [
				{
					compound: 'Olivine (dominant)',
					percent: 50,
					formula: '(Mg,Fe)2SiO4',
				},
				{
					compound: 'Orthopyroxene and clinopyroxene',
					percent: 30,
					formula: '(Mg,Fe,Ca)SiO3',
				},
				{
					compound: 'Ilmenite (FeTiO3) and Chromite',
					percent: 10,
					formula: 'FeTiO3',
				},
				{
					compound: 'Garnet and spinel phases',
					percent: 10,
					formula: 'Mg3Al2Si3O12',
				},
			],
			core: [
				{
					compound: 'Metallic iron (Fe)',
					percent: 80,
					formula: 'Fe',
				},
				{
					compound: 'Nickel (Ni)',
					percent: 10,
					formula: 'Ni',
				},
				{
					compound: 'Sulfur (S) and light elements',
					percent: 10,
					formula: 'FeS',
				},
			],
		},
	},

	// --- MARS MOONS ---
	{
		name: 'Phobos',
		layers: {
			surface: [
				{
					compound: 'Phyllosilicates (nontronite, montmorillonite)',
					percent: 35,
					formula: 'Na0.3Fe2(Si4O10)(OH)2',
				},
				{
					compound: 'Carbonaceous material (organic C compounds)',
					percent: 25,
					formula: 'C',
				},
				{
					compound: 'Silicates (feldspar, pyroxene)',
					percent: 25,
					formula: 'CaAl2Si2O8',
				},
				{
					compound: 'Iron oxides (magnetite, hematite)',
					percent: 10,
					formula: 'Fe3O4',
				},
				{
					compound: 'Sulfide traces (FeS, troilite)',
					percent: 5,
					formula: 'FeS',
				},
			],
			mantle: [
				{
					compound: 'Silicate rubble and porous rock',
					percent: 60,
					formula: 'MgFeSiO4',
				},
				{
					compound: 'Water ice inclusions (possible)',
					percent: 25,
					formula: 'H2O',
				},
				{
					compound: 'Carbonaceous chondrite-like material',
					percent: 15,
					formula: 'C',
				},
			],
			core: [
				{
					compound: 'Rock/iron-sulfide mix',
					percent: 70,
					formula: 'FeSiO3FeS',
				},
				{
					compound: 'Porous silicates',
					percent: 30,
					formula: 'Mg2SiO4',
				},
			],
		},
	},
	{
		name: 'Deimos',
		layers: {
			surface: [
				{
					compound: 'Carbonaceous chondrite-like rock',
					percent: 40,
					formula: 'C',
				},
				{
					compound: 'Phyllosilicates and hydrated minerals',
					percent: 35,
					formula: 'Mg3Si4O10(OH)2',
				},
				{
					compound: 'Silicates (olivine, pyroxene)',
					percent: 15,
					formula: 'MgFeSiO4',
				},
				{
					compound: 'Iron oxides',
					percent: 10,
					formula: 'Fe2O3',
				},
			],
			mantle: [
				{
					compound: 'Porous silicate rock',
					percent: 70,
					formula: 'Mg2SiO4',
				},
				{
					compound: 'Water ice (possible traces)',
					percent: 20,
					formula: 'H2O',
				},
				{
					compound: 'Carbonaceous material',
					percent: 10,
					formula: 'C',
				},
			],
			core: [
				{
					compound: 'Mixed rock and iron',
					percent: 100,
					formula: 'FeMgSiO4',
				},
			],
		},
	},

	// --- JUPITER MOONS ---
	{
		name: 'Io',
		layers: {
			surface: [
				{ compound: 'Sulfur (S)', percent: 40, formula: 'S' },
				{ compound: 'Sulfur dioxide (SO2)', percent: 30, formula: 'SO2' },
				{ compound: 'Silicate rocks', percent: 25, formula: 'MgFeSiO4' },
				{ compound: 'Iron oxides', percent: 5, formula: 'FeO' },
			],
			mantle: [
				{
					compound: 'Silicate rock (ultramafic)',
					percent: 70,
					formula: 'Mg2SiO4',
				},
				{ compound: 'Iron and sulfur compounds', percent: 30, formula: 'FeS' },
			],
			core: [
				{ compound: 'Iron (Fe)', percent: 90, formula: 'Fe' },
				{ compound: 'Nickel (Ni)', percent: 10, formula: 'Ni' },
			],
		},
	},
	{
		name: 'Europa',
		layers: {
			surface: [
				{ compound: 'Water ice (H2O)', percent: 95, formula: 'H2O' },
				{ compound: 'Salts (Na, Mg sulfates)', percent: 5, formula: 'Na2SO4' },
			],
			mantle: [
				{ compound: 'Liquid water ocean', percent: 70, formula: 'H2O' },
				{ compound: 'Dissolved salts', percent: 10, formula: 'MgSO4' },
				{
					compound: 'Hydrated silicates',
					percent: 20,
					formula: 'Mg3Si4O10(OH)2',
				},
			],
			core: [
				{ compound: 'Silicate rock', percent: 60, formula: 'SiO2Mg0.3Fe0.3' },
				{ compound: 'Metallic iron and nickel', percent: 40, formula: 'FeNi' },
			],
		},
	},
	{
		name: 'Ganymede',
		layers: {
			surface: [
				{ compound: 'Water ice (H2O)', percent: 50, formula: 'H2O' },
				{ compound: 'Silicates and dust', percent: 40, formula: 'MgSiO3' },
				{ compound: 'Carbon dioxide ice (CO2)', percent: 10, formula: 'CO2' },
			],
			mantle: [
				{ compound: 'Water ocean layers', percent: 40, formula: 'H2O' },
				{ compound: 'Ammonia hydrate', percent: 20, formula: 'NH3·H2O' },
				{ compound: 'Silicate minerals', percent: 40, formula: 'Mg2SiO4' },
			],
			core: [
				{ compound: 'Iron (Fe)', percent: 80, formula: 'Fe' },
				{ compound: 'Nickel (Ni)', percent: 20, formula: 'Ni' },
			],
		},
	},
	{
		name: 'Callisto',
		layers: {
			surface: [
				{ compound: 'Water ice (H2O)', percent: 60, formula: 'H2O' },
				{ compound: 'Carbon dioxide (CO2)', percent: 10, formula: 'CO2' },
				{ compound: 'Silicate rock', percent: 30, formula: 'MgSiO3' },
			],
			mantle: [
				{ compound: 'Mixed rock and ice', percent: 80, formula: 'H2OMg2SiO4' },
				{ compound: 'Ammonia ices', percent: 20, formula: 'NH3·H2O' },
			],
			core: [
				{
					compound: 'Silicate and iron mix',
					percent: 100,
					formula: 'FeMgSiO4',
				},
			],
		},
	},

	// --- SATURN MOONS ---
	{
		name: 'Titan',
		layers: {
			surface: [
				{ compound: 'Nitrogen (N2)', percent: 95, formula: 'N2' },
				{ compound: 'Methane (CH4)', percent: 4, formula: 'CH4' },
				{
					compound: 'Hydrocarbons (C2H6, others)',
					percent: 1,
					formula: 'C2H6',
				},
			],
			mantle: [
				{ compound: 'Water ice (H2O)', percent: 60, formula: 'H2O' },
				{ compound: 'Ammonia-water mix', percent: 25, formula: 'NH3·H2O' },
				{
					compound: 'Hydrated silicates',
					percent: 15,
					formula: 'Mg3Si4O10(OH)2',
				},
			],
			core: [
				{
					compound: 'Rocky core (silicates, iron)',
					percent: 100,
					formula: 'FeSiO3',
				},
			],
		},
	},
	{
		name: 'Enceladus',
		layers: {
			surface: [
				{ compound: 'Water ice (H2O)', percent: 90, formula: 'H2O' },
				{ compound: 'Salts (NaCl, NaHCO3)', percent: 5, formula: 'NaCl' },
				{ compound: 'Silicate dust', percent: 5, formula: 'SiO2' },
			],
			mantle: [
				{ compound: 'Liquid water ocean', percent: 70, formula: 'H2O' },
				{ compound: 'Ammonia hydrates', percent: 20, formula: 'NH3·H2O' },
				{ compound: 'Rock particles', percent: 10, formula: 'SiO2FeO' },
			],
			core: [
				{ compound: 'Silicates', percent: 80, formula: 'MgFeSiO4' },
				{ compound: 'Iron and sulfur', percent: 20, formula: 'FeS' },
			],
		},
	},
	{
		name: 'Rhea',
		layers: {
			surface: [
				{ compound: 'Water ice', percent: 70, formula: 'H2O' },
				{ compound: 'Ammonia ice', percent: 20, formula: 'NH3' },
				{ compound: 'Carbon dioxide ice', percent: 10, formula: 'CO2' },
			],
			core: [
				{ compound: 'Silicates', percent: 65, formula: 'MgSiO3' },
				{ compound: 'Iron oxides', percent: 35, formula: 'FeO' },
			],
		},
	},
	{
		name: 'Iapetus',
		layers: {
			surface: [
				{ compound: 'Water ice', percent: 80, formula: 'H2O' },
				{ compound: 'Dark carbonaceous materials', percent: 20, formula: 'C' },
			],
			core: [{ compound: 'Silicate rock', percent: 100, formula: 'MgSiO3' }],
		},
	},
	{
		name: 'Mimas',
		layers: {
			surface: [
				{ compound: 'Water ice', percent: 90, formula: 'H2O' },
				{ compound: 'Rocky silicates', percent: 10, formula: 'SiO2' },
			],
			core: [{ compound: 'Silicate and iron', percent: 100, formula: 'FeSiO3' }],
		},
	},

	// --- URANUS MOONS ---
	{
		name: 'Titania',
		layers: {
			surface: [
				{ compound: 'Water ice (H2O)', percent: 80, formula: 'H2O' },
				{ compound: 'Carbon dioxide ice (CO2)', percent: 10, formula: 'CO2' },
				{ compound: 'Organic compounds', percent: 10, formula: 'C' },
			],
			mantle: [
				{ compound: 'Water ice', percent: 60, formula: 'H2O' },
				{ compound: 'Silicates', percent: 40, formula: 'MgSiO3' },
			],
			core: [
				{
					compound: 'Silicate rock',
					percent: 85,
					formula: 'SiO2Fe0.3Mg0.3',
				},
				{
					compound: 'Metallic iron, nickel',
					percent: 15,
					formula: 'FeNi',
				},
			],
		},
	},
	{
		name: 'Oberon',
		layers: {
			surface: [
				{ compound: 'Water ice', percent: 75, formula: 'H2O' },
				{ compound: 'Carbon dioxide ice', percent: 15, formula: 'CO2' },
				{ compound: 'Organic compounds', percent: 10, formula: 'C' },
			],
			mantle: [
				{ compound: 'Water ice', percent: 55, formula: 'H2O' },
				{ compound: 'Silicates', percent: 45, formula: 'MgSiO3' },
			],
			core: [
				{
					compound: 'Silicate rock',
					percent: 85,
					formula: 'SiO2Fe0.3Mg0.3',
				},
				{
					compound: 'Metallic iron, nickel',
					percent: 15,
					formula: 'FeNi',
				},
			],
		},
	},
	{
		name: 'Ariel',
		layers: {
			surface: [
				{ compound: 'Water ice', percent: 85, formula: 'H2O' },
				{ compound: 'Carbon dioxide ice', percent: 10, formula: 'CO2' },
				{ compound: 'Ammonia ice', percent: 5, formula: 'NH3' },
			],
			mantle: [
				{ compound: 'Water ice', percent: 70, formula: 'H2O' },
				{ compound: 'Silicates', percent: 30, formula: 'MgSiO3' },
			],
			core: [
				{
					compound: 'Silicate rock',
					percent: 85,
					formula: 'SiO2Fe0.3Mg0.3',
				},
				{ compound: 'Metallic core', percent: 15, formula: 'FeNi' },
			],
		},
	},
	{
		name: 'Umbriel',
		layers: {
			surface: [
				{ compound: 'Water ice', percent: 80, formula: 'H2O' },
				{ compound: 'Carbon dioxide ice', percent: 15, formula: 'CO2' },
				{ compound: 'Organics', percent: 5, formula: 'C' },
			],
			mantle: [
				{ compound: 'Water ice', percent: 60, formula: 'H2O' },
				{ compound: 'Silicates', percent: 40, formula: 'MgSiO3' },
			],
			core: [
				{
					compound: 'Silicate rock',
					percent: 85,
					formula: 'SiO2Fe0.3Mg0.3',
				},
				{
					compound: 'Metallic iron, nickel',
					percent: 15,
					formula: 'FeNi',
				},
			],
		},
	},
	{
		name: 'Miranda',
		layers: {
			surface: [
				{ compound: 'Water ice', percent: 90, formula: 'H2O' },
				{ compound: 'Carbon dioxide ice', percent: 5, formula: 'CO2' },
				{ compound: 'Other volatiles', percent: 5, formula: 'CH4' },
			],
			mantle: [
				{ compound: 'Water ice', percent: 70, formula: 'H2O' },
				{ compound: 'Silicates', percent: 30, formula: 'MgSiO3' },
			],
			core: [
				{
					compound: 'Silicate rock',
					percent: 85,
					formula: 'SiO2Fe0.3Mg0.3',
				},
				{
					compound: 'Metallic iron, nickel',
					percent: 15,
					formula: 'FeNi',
				},
			],
		},
	},

	// --- NEPTUNE MOONS ---
	{
		name: 'Triton',
		layers: {
			surface: [
				{ compound: 'Nitrogen ice (N2)', percent: 55, formula: 'N2' },
				{ compound: 'Water ice (H2O)', percent: 25, formula: 'H2O' },
				{ compound: 'Carbon dioxide (CO2)', percent: 10, formula: 'CO2' },
				{ compound: 'Methane (CH4)', percent: 10, formula: 'CH4' },
				{ compound: 'Carbon monoxide (CO)', percent: 0.05, formula: 'CO' },
			],
			mantle: [
				{
					compound: 'Rocky material and ice',
					percent: 60,
					formula: 'SiO2·H2O',
				},
				{ compound: 'Ammonia ice', percent: 20, formula: 'NH3·H2O' },
				{ compound: 'Volatile compounds', percent: 20, formula: 'CH4·CO2' },
			],
			core: [{ compound: 'Rock and metal', percent: 100, formula: 'FeSiO3' }],
		},
	},
	{
		name: 'Proteus',
		layers: {
			surface: [
				{ compound: 'Water ice', percent: 70, formula: 'H2O' },
				{ compound: 'Dark carbonaceous material', percent: 30, formula: 'C' },
			],
			core: [{ compound: 'Rocky silicate', percent: 100, formula: 'MgSiO3' }],
		},
	},

	// --- PLUTO MOONS ---
	{
		name: 'Charon',
		layers: {
			surface: [
				{ compound: 'Water ice (H2O)', percent: 90, formula: 'H2O' },
				{
					compound: 'Ammonia hydrates (NH3·H2O)',
					percent: 5,
					formula: 'NH3·H2O',
				},
				{ compound: 'Carbon dioxide ice (CO2)', percent: 3, formula: 'CO2' },
				{
					compound: 'Ammonium salts (NH4Cl/NH4HCO3)',
					percent: 2,
					formula: 'NH4Cl',
				},
			],
			mantle: [
				{ compound: 'Water ice (mixed phase)', percent: 70, formula: 'H2O' },
				{ compound: 'Rock/silicate material', percent: 30, formula: 'MgSiO3' },
			],
			core: [
				{ compound: 'Silicate rock', percent: 85, formula: 'SiO2Fe0.3Mg0.3' },
				{ compound: 'Metallic iron, nickel', percent: 15, formula: 'FeNi' },
			],
		},
	},
	{
		name: 'Nix',
		layers: {
			surface: [
				{ compound: 'Water ice (H2O)', percent: 85, formula: 'H2O' },
				{
					compound: 'Ammonia-rich ices (NH3·H2O)',
					percent: 10,
					formula: 'NH3·H2O',
				},
				{
					compound: 'Reddish carbon compounds (tholin-like organics)',
					percent: 5,
					formula: 'C10H10N2O2',
				},
			],
			mantle: [
				{ compound: 'Water ice', percent: 70, formula: 'H2O' },
				{ compound: 'Silicate material', percent: 30, formula: 'MgSiO3' },
			],
			core: [
				{ compound: 'Rocky silicate', percent: 90, formula: 'SiO2Mg0.3Fe0.3' },
				{ compound: 'Trace metallics (FeNi)', percent: 10, formula: 'FeNi' },
			],
		},
	},
	{
		name: 'Hydra',
		layers: {
			surface: [
				{ compound: 'Water ice (H2O)', percent: 90, formula: 'H2O' },
				{
					compound: 'Reddish carbon compounds (tholins)',
					percent: 7,
					formula: 'C10H10N2O2',
				},
				{ compound: 'Ammonia hydrates', percent: 3, formula: 'NH3·H2O' },
			],
			mantle: [
				{ compound: 'Water ice (crystalline)', percent: 80, formula: 'H2O' },
				{ compound: 'Silicate minerals', percent: 20, formula: 'MgSiO3' },
			],
			core: [
				{
					compound: 'Rocky/silicate mix',
					percent: 90,
					formula: 'SiO2Fe0.3Mg0.3',
				},
				{ compound: 'Trace metal content', percent: 10, formula: 'FeNi' },
			],
		},
	},
	{
		name: 'Kerberos',
		layers: {
			surface: [
				{ compound: 'Water ice', percent: 85, formula: 'H2O' },
				{ compound: 'Dark carbonaceous material', percent: 10, formula: 'C' },
				{ compound: 'Trace ammonia ice', percent: 5, formula: 'NH3' },
			],
			mantle: [
				{ compound: 'Water ice', percent: 70, formula: 'H2O' },
				{ compound: 'Silicate minerals', percent: 30, formula: 'MgSiO3' },
			],
			core: [
				{
					compound: 'Silicate rock and metal',
					percent: 100,
					formula: 'SiO2Fe0.3Mg0.3',
				},
			],
		},
	},
	{
		name: 'Styx',
		layers: {
			surface: [
				{ compound: 'Water ice', percent: 80, formula: 'H2O' },
				{ compound: 'Organic tholins', percent: 15, formula: 'C10H10N2O2' },
				{ compound: 'Trace ammonia', percent: 5, formula: 'NH3' },
			],
			mantle: [
				{ compound: 'Water ice', percent: 75, formula: 'H2O' },
				{ compound: 'Silicate dust', percent: 25, formula: 'MgSiO3' },
			],
			core: [
				{ compound: 'Silicate rock', percent: 90, formula: 'SiO2Mg0.3Fe0.3' },
				{ compound: 'Minor metallic inclusions', percent: 10, formula: 'FeNi' },
			],
		},
	},

	// --- ERIS MOON ---
	{
		name: 'Dysnomia',
		layers: {
			surface: [
				{
					compound: 'Dark carbonaceous material',
					percent: 70,
					formula: 'C',
				},
				{
					compound: 'Ice frosts (H2O, CH4, N2 traces)',
					percent: 30,
					formula: 'H2O',
				},
			],
			mantle: [
				{
					compound: 'Predominantly water ice',
					percent: 80,
					formula: 'H2O',
				},
				{
					compound: 'Volatile ices (methane, nitrogen)',
					percent: 20,
					formula: 'CH4',
				},
			],
			core: [
				{
					compound: 'Silicate rock',
					percent: 85,
					formula: 'SiO2Mg0.3Fe0.3',
				},
				{
					compound: 'Metallic elements (iron, nickel)',
					percent: 15,
					formula: 'FeNi',
				},
			],
		},
	},
];

// Combine planet and moon compositions into one array
const celestialBodyCompositions = [...planetCompositions, ...moonCompositions];

// Helper function to calculate total elemental composition for a planet
function getPlanetElements(planetName, layerWeights = null) {
	const planet = planetCompositions.find((p) => p.name === planetName);
	if (!planet) return null;

	// Return null if no layer weights provided
	if (!layerWeights) return null;

	const weights = layerWeights;
	const totalElements = {};

	// Iterate through each layer
	for (const [layerName, compounds] of Object.entries(planet.layers)) {
		const layerWeight = weights[layerName] || 0;

		// Process each compound in the layer
		compounds.forEach(({ percent, formula }) => {
			const compoundFraction = (percent / 100) * layerWeight;

			// Parse formula inline
			if (formula) {
				const elements = {};
				const pattern = /([A-Z][a-z]?)(\d*\.?\d*)/g;
				let match;
				while ((match = pattern.exec(formula)) !== null) {
					const element = match[1];
					const count = match[2] ? parseFloat(match[2]) : 1;
					elements[element] = count;
				}

				// Add elements to total
				for (const [element, count] of Object.entries(elements)) {
					if (!totalElements[element]) {
						totalElements[element] = 0;
					}
					totalElements[element] += count * compoundFraction;
				}
			}
		});
	}

	return totalElements;
}

// Helper function to compare elemental composition between two planets
function compareElementalComposition(planet1Name, planet2Name) {
	const elements1 = getPlanetElements(planet1Name);
	const elements2 = getPlanetElements(planet2Name);

	if (!elements1 || !elements2) return null;

	// Get all unique elements
	const allElements = new Set([
		...Object.keys(elements1),
		...Object.keys(elements2),
	]);

	const comparison = {};
	allElements.forEach((element) => {
		comparison[element] = {
			[planet1Name]: elements1[element] || 0,
			[planet2Name]: elements2[element] || 0,
			difference: (elements1[element] || 0) - (elements2[element] || 0),
		};
	});

	return comparison;
}

// Helper function to find planets rich in a specific element
function findPlanetsWithElement(
	elementSymbol,
	threshold = 0.1,
	layerWeights = null,
) {
	// Default layer weights if not provided
	const defaultWeights = {
		surface: 0.2,
		mantle: 0.5,
		core: 0.3,
		intermediate: 0.4,
	};

	const weights = layerWeights || defaultWeights;

	return planetCompositions
		.map((planet) => {
			const elements = getPlanetElements(planet.name, weights);
			if (!elements) return { name: planet.name, amount: 0 };
			return {
				name: planet.name,
				amount: elements[elementSymbol] || 0,
			};
		})
		.filter(({ amount }) => amount >= threshold)
		.sort((a, b) => b.amount - a.amount);
}

// Helper function to enrich planet data with colors
function enrichPlanetWithColors(planetName) {
	const planet = planetCompositions.find((p) => p.name === planetName);
	if (!planet) return null;

	const enrichedPlanet = JSON.parse(JSON.stringify(planet)); // Deep clone

	// Add colors to each compound
	for (const [_, compounds] of Object.entries(enrichedPlanet.layers)) {
		compounds.forEach((compound) => {
			compound.color = getFormulaColor(compound.formula);
		});
	}

	return enrichedPlanet;
}

// ES6 module exports
// Usage examples:
// getPlanetElements("Mars", layerWeights);  // Returns elemental composition
// compareElementalComposition("Earth", "Mars");  // Compare two planets
// findPlanetsWithElement("Fe", 0.1);  // Find planets with >= 10% iron
// enrichPlanetWithColors("Mars");  // Adds color field to each compound
// celestialBodyCompositions includes both planets and moons
export {
	planetCompositions,
	moonCompositions,
	celestialBodyCompositions,
	getPlanetElements,
	compareElementalComposition,
	findPlanetsWithElement,
	enrichPlanetWithColors,
};
