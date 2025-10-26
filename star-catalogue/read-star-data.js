#!/usr/bin/env node

import { createReadStream } from 'fs';
import { createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { createInterface } from 'readline';

const STARS_FILE = './hygdata_v42.csv.gz';
const MAX_ENTRIES = 100;

async function readStarData() {
	try {
		const gunzip = createGunzip();
		const fileStream = createReadStream(STARS_FILE);

		const rl = createInterface({
			input: fileStream.pipe(gunzip),
			crlfDelay: Infinity,
		});

		let lineCount = 0;
		let headers = null;

		console.log('Reading first 100 stars from hygdata_v42.csv.gz\n');
		console.log('='.repeat(80));

		for await (const line of rl) {
			if (lineCount === 0) {
				// First line is headers
				headers = line.split(',');
				console.log(`\nHeaders: ${headers.join(', ')}\n`);
				console.log('='.repeat(80));
			} else if (lineCount <= MAX_ENTRIES) {
				// Parse CSV line
				const values = line.split(',');
				const star = {};

				headers.forEach((header, index) => {
					star[header] = values[index] || '';
				});

				console.log(`\nStar #${lineCount}:`);
				console.log(JSON.stringify(star, null, 2));
				console.log('-'.repeat(80));
			} else {
				// We've read enough entries
				break;
			}

			lineCount++;
		}

		console.log(`\nTotal stars read: ${lineCount - 1}`);
		console.log('='.repeat(80));
	} catch (error) {
		console.error('Error reading star data:', error);
		process.exit(1);
	}
}

readStarData();
