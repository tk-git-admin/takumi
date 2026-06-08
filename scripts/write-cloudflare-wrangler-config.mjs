import { access, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULT_OUTPUT_DIR = '.output';

async function exists(path) {
	try {
		await access(path, constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

export async function writeWranglerConfig(outputDir = DEFAULT_OUTPUT_DIR) {
	const resolvedOutputDir = resolve(outputDir);
	const requiredPaths = [
		join(resolvedOutputDir, 'server/index.mjs'),
		join(resolvedOutputDir, 'public'),
	];
	const missingPaths = [];

	for (const path of requiredPaths) {
		if (!(await exists(path))) {
			missingPaths.push(path);
		}
	}

	if (missingPaths.length > 0) {
		throw new Error(`Cannot write Cloudflare Wrangler config. Missing: ${missingPaths.join(', ')}`);
	}

	const config = [
		'name = "takumi"',
		'main = "server/index.mjs"',
		'compatibility_date = "2026-06-08"',
		'',
		'[site]',
		'bucket = "public"',
		'',
	].join('\n');
	const configPath = join(resolvedOutputDir, 'wrangler.toml');

	await writeFile(configPath, config);

	return configPath;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	try {
		await writeWranglerConfig(process.argv[2] || DEFAULT_OUTPUT_DIR);
	} catch (error) {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	}
}
