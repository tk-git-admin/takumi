import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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
	assert.equal(
		await exists(new URL('../server/shared/contactValidation.mjs', import.meta.url)),
		true,
	);
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
	const wranglerConfig = JSON.parse(
		await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8'),
	);

	assert.equal(pkg.scripts.postbuild, 'node scripts/write-cloudflare-wrangler-config.mjs');
	assert.equal(pkg.scripts.deploy, 'npx wrangler@3.114.17 deploy');
	assert.equal(pkg.scripts['deploy:preview'], 'npx wrangler@3.114.17 versions upload');
	assert.equal(pkg.devDependencies.wrangler, '3.114.17');
	assert.equal(wranglerConfig.name, 'takumi');
	assert.equal(wranglerConfig.main, './.output/server/index.mjs');
	assert.deepEqual(wranglerConfig.compatibility_flags, ['nodejs_compat', 'no_nodejs_compat_v2']);
	assert.equal(wranglerConfig.preview_urls, true);
	assert.deepEqual(wranglerConfig.assets, {
		binding: 'ASSETS',
		directory: './.output/public',
	});
	assert.match(nuxtConfig, /compatibilityDate:\s*'2026-06-08'/);
	assert.match(nuxtConfig, /preset:\s*'cloudflare_module'/);
	assert.match(nuxtConfig, /deployConfig:\s*true/);
	assert.match(nuxtConfig, /nodeCompat:\s*true/);
});

test('Basic Auth middleware follows the Cloudflare Worker runtime-env pattern', async () => {
	const nuxtConfig = await readFile(new URL('../nuxt.config.ts', import.meta.url), 'utf8');
	const middleware = await readFile(
		new URL('../middleware/basic-auth.global.ts', import.meta.url),
		'utf8',
	);

	assert.match(nuxtConfig, /basicAuthUsername:/);
	assert.match(nuxtConfig, /basicAuthPassword:/);
	assert.match(nuxtConfig, /basicAuthEnabled:/);
	assert.match(nuxtConfig, /previewHostnames:/);
	assert.doesNotMatch(nuxtConfig, /public:\s*\{[^}]*basicAuth/s);

	assert.match(middleware, /import\.meta\.server/);
	assert.match(middleware, /useRequestEvent\(\)/);
	assert.match(middleware, /event\.context/);
	assert.match(middleware, /cloudflare\?\.\env/);
	assert.match(middleware, /NUXT_BASIC_AUTH_USERNAME/);
	assert.match(middleware, /NUXT_BASIC_AUTH_PASSWORD/);
	assert.match(middleware, /NUXT_BASIC_AUTH_ENABLED/);
	assert.match(middleware, /BASIC_AUTH_USERNAME/);
	assert.match(middleware, /BASIC_AUTH_PASSWORD/);
	assert.match(middleware, /BASIC_AUTH_ENABLED/);
	assert.match(middleware, /getRequestHeader\(event,\s*['"]x-forwarded-host['"]\)/);
	assert.match(middleware, /WWW-Authenticate/);
	assert.match(middleware, /Basic realm="Protected"/);
});

test('Basic Auth environment documentation uses server-only Cloudflare variables', async () => {
	const envExample = await readFile(new URL('../.env.example', import.meta.url), 'utf8');

	assert.match(envExample, /^NUXT_BASIC_AUTH_USERNAME=/m);
	assert.match(envExample, /^NUXT_BASIC_AUTH_PASSWORD=/m);
	assert.match(envExample, /^NUXT_BASIC_AUTH_ENABLED=false/m);
	assert.match(envExample, /^NUXT_BASIC_AUTH_PREVIEW_HOSTNAMES=/m);
	assert.doesNotMatch(envExample, /^NUXT_PUBLIC_BASIC_AUTH_/m);
});

test('postbuild writes Wrangler config for Cloudflare dashboard deploy command', async () => {
	const { writeWranglerConfig } = await import(
		new URL('../scripts/write-cloudflare-wrangler-config.mjs', import.meta.url)
	);
	const outputDir = await mkdtemp(join(tmpdir(), 'takumi-wrangler-'));

	try {
		await mkdir(join(outputDir, 'server'), { recursive: true });
		await mkdir(join(outputDir, 'public'), { recursive: true });
		await writeFile(join(outputDir, 'server/index.mjs'), '');

		await writeWranglerConfig(outputDir);

		const config = await readFile(join(outputDir, 'wrangler.toml'), 'utf8');
		assert.match(config, /name = "takumi"/);
		assert.match(config, /main = "server\/index\.mjs"/);
		assert.match(config, /compatibility_flags = \["nodejs_compat", "no_nodejs_compat_v2"\]/);
		assert.match(config, /preview_urls = true/);
		assert.match(config, /\[assets\]\nbinding = "ASSETS"\ndirectory = "public"/);
		assert.doesNotMatch(config, /\[site\]/);
	} finally {
		await rm(outputDir, { recursive: true, force: true });
	}
});
