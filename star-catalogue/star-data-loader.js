// Load star data from the CSV file
export async function loadStarData() {
	try {
		const response = await fetch('./star-catalogue/hygdata_v42.csv.gz');
		if (!response.ok) {
			throw new Error(`Failed to fetch star data: ${response.statusText}`);
		}

		// Get the compressed data
		const compressedData = await response.arrayBuffer();

		// Decompress using the browser's DecompressionStream API
		const ds = new DecompressionStream('gzip');
		const decompressedStream = new Response(
			new Blob([compressedData]).stream().pipeThrough(ds),
		);
		const text = await decompressedStream.text();

		// Parse CSV
		const lines = text.split('\n');
		const headersRaw = parseCsvLine(lines[0]);
		// Remove quotes from header names
		const headers = headersRaw.map((h) => h.replace(/^"|"$/g, ''));

		const stars = [];
		for (let i = 1; i < lines.length; i++) {
			if (!lines[i].trim()) continue;

			const values = parseCsvLine(lines[i]);
			const star = {};

			headers.forEach((header, index) => {
				const value = values[index] || '';
				// Remove quotes from string values
				star[header] = value.replace(/^"|"$/g, '');
			});

			// Parse numeric fields
			star.x = parseFloat(star.x) || 0;
			star.y = parseFloat(star.y) || 0;
			star.z = parseFloat(star.z) || 0;
			star.dist = parseFloat(star.dist) || 0;
			star.mag = parseFloat(star.mag) || 0;
			star.absmag = parseFloat(star.absmag) || 0;
			star.ra = parseFloat(star.ra) || 0;
			star.dec = parseFloat(star.dec) || 0;
			star.lum = parseFloat(star.lum) || 0;
			star.ci = parseFloat(star.ci) || 0;

			stars.push(star);
		}

		console.log(`Loaded ${stars.length} stars from catalog`);
		return stars;
	} catch (error) {
		console.error('Error loading star data:', error);
		return [];
	}
}

// Parse a CSV line, handling quoted fields
function parseCsvLine(line) {
	const result = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];

		if (char === '"') {
			inQuotes = !inQuotes;
			current += char;
		} else if (char === ',' && !inQuotes) {
			result.push(current);
			current = '';
		} else {
			current += char;
		}
	}

	result.push(current); // Add the last field
	return result;
}
