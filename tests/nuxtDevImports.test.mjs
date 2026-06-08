import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { test } from 'node:test';

async function exists(path) {
	try {
		await access(path, constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

test('server-only Kuroco helpers are outside Nuxt top-level utils auto-imports', async () => {
	assert.equal(await exists(new URL('../utils/contactValidation.mjs', import.meta.url)), false);
	assert.equal(await exists(new URL('../utils/kurocoContent.mjs', import.meta.url)), false);
	assert.equal(await exists(new URL('../server/shared/contactValidation.mjs', import.meta.url)), true);
	assert.equal(await exists(new URL('../server/shared/kurocoContent.mjs', import.meta.url)), true);
});

test('server shared helpers do not import app-root data through brittle parent paths', async () => {
	const serverSharedDir = new URL('../server/shared/', import.meta.url);
	const files = await readdir(serverSharedDir);

	for (const file of files.filter((name) => name.endsWith('.mjs'))) {
		const source = await readFile(new URL(file, serverSharedDir), 'utf8');

		assert.equal(source.includes('../../data/'), false, file);
		assert.equal(source.includes('../../shared/'), false, file);
	}
});

test('package import aliases do not override Nuxt package imports', async () => {
	const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

	assert.equal(Object.hasOwn(pkg, 'imports'), false);
});

test('Cloudflare Worker deployment config is versioned with the app', async () => {
	const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
	const nuxtConfig = await readFile(new URL('../nuxt.config.ts', import.meta.url), 'utf8');

	assert.equal(
		pkg.scripts.deploy,
		'npx wrangler@3.114.17 --cwd .output deploy server/index.mjs --site public --name takumi --compatibility-date 2026-06-08',
	);
	assert.match(nuxtConfig, /preset:\s*'cloudflare-module'/);
	assert.match(nuxtConfig, /deployConfig:\s*true/);
	assert.match(nuxtConfig, /nodeCompat:\s*true/);
});
