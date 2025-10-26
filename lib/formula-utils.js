// Helper function to format chemical formulas with subscript Unicode characters
export function formatFormulaWithSubscripts(formula) {
	if (!formula) return '';

	// Map of regular numbers to Unicode subscript characters
	const subscriptMap = {
		0: '₀',
		1: '₁',
		2: '₂',
		3: '₃',
		4: '₄',
		5: '₅',
		6: '₆',
		7: '₇',
		8: '₈',
		9: '₉',
	};

	// Replace numbers that come after letters with subscripts
	// Match: letter(s) followed by number(s) with optional decimal
	return formula.replace(/([A-Za-z])(\d+\.?\d*)/g, (match, letter, number) => {
		const subscriptNumber = number
			.split('')
			.map((char) => subscriptMap[char] || char)
			.join('');
		return letter + subscriptNumber;
	});
}
