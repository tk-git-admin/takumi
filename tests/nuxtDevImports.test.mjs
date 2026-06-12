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

async function collectVueFiles(directoryUrl) {
	const entries = await readdir(directoryUrl, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const entryUrl = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directoryUrl);

		if (entry.isDirectory()) {
			files.push(...(await collectVueFiles(entryUrl)));
		} else if (entry.name.endsWith('.vue')) {
			files.push(entryUrl);
		}
	}

	return files;
}

function lineNumber(source, index) {
	return source.slice(0, index).split('\n').length;
}

function relativeFromProjectRoot(fileUrl) {
	const projectRoot = new URL('../', import.meta.url).pathname;
	return decodeURIComponent(fileUrl.pathname.replace(projectRoot, ''));
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

test('public image URLs use bound src attributes to avoid Nuxt dev virtual public imports', async () => {
	const vueFileRoots = [
		new URL('../pages/', import.meta.url),
		new URL('../components/', import.meta.url),
		new URL('../layouts/', import.meta.url),
	];
	const vueFiles = [];

	for (const root of vueFileRoots) {
		if (await exists(root)) {
			vueFiles.push(...(await collectVueFiles(root)));
		}
	}

	const appVue = new URL('../app.vue', import.meta.url);
	if (await exists(appVue)) {
		vueFiles.push(appVue);
	}

	const staticPublicImagePattern = /<img\b[^>]*(?:^|\s)src=["']\/img\/[^"']*["'][^>]*>/g;
	const violations = [];

	for (const fileUrl of vueFiles) {
		const source = await readFile(fileUrl, 'utf8');

		for (const match of source.matchAll(staticPublicImagePattern)) {
			violations.push(
				`${relativeFromProjectRoot(fileUrl)}:${lineNumber(source, match.index)} ${match[0]
					.replace(/\s+/g, ' ')
					.trim()}`,
			);
		}
	}

	assert.deepEqual(violations, []);
});

test('Cloudflare Worker deployment uses Nitro generated Wrangler config', async () => {
	const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
	const nuxtConfig = await readFile(new URL('../nuxt.config.ts', import.meta.url), 'utf8');
	const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
	const mainWorkflow = await readFile(
		new URL('../.github/workflows/deploy-main.yml', import.meta.url),
		'utf8',
	);
	const stagingWorkflow = await readFile(
		new URL('../.github/workflows/deploy-staging.yml', import.meta.url),
		'utf8',
	);

	assert.equal(Object.hasOwn(pkg.scripts, 'postbuild'), false);
	assert.equal(pkg.scripts.deploy, 'npx wrangler --cwd .output deploy');
	assert.equal(Object.hasOwn(pkg.scripts, 'deploy:preview'), false);
	assert.match(readme, /Root directory:\s*\/$/m);
	assert.match(readme, /Build command:\s*npm run build$/m);
	assert.match(readme, /Deploy command:\s*npx wrangler --cwd \.output deploy$/m);
	assert.match(readme, /Version command:\s*npx wrangler versions upload$/m);
	assert.match(readme, /`test-takumi\.bridge-asia\.workers\.dev`/);
	assert.match(readme, /branch preview alias for the `takumi` Worker/);
	assert.match(readme, /Wrangler 4\.21\.0\+ is required/);
	assert.equal(pkg.devDependencies.wrangler, '4.24.0');
	assert.match(pkg.volta.node, /^20\./);
	assert.match(mainWorkflow, /node-version:\s*'20\./);
	assert.match(stagingWorkflow, /node-version:\s*'20\./);
	assert.equal(await exists(new URL('../wrangler.jsonc', import.meta.url)), false);
	assert.equal(
		await exists(new URL('../scripts/deploy-cloudflare-worker.mjs', import.meta.url)),
		false,
	);
	assert.equal(
		await exists(new URL('../scripts/write-cloudflare-wrangler-config.mjs', import.meta.url)),
		false,
	);
	assert.match(nuxtConfig, /compatibilityDate:\s*'2026-06-08'/);
	assert.match(nuxtConfig, /preset:\s*'cloudflare_module'/);
	assert.match(nuxtConfig, /deployConfig:\s*true/);
	assert.match(nuxtConfig, /nodeCompat:\s*true/);
	assert.match(nuxtConfig, /wrangler:\s*\{/);
	assert.match(nuxtConfig, /name:\s*'takumi'/);
	assert.doesNotMatch(nuxtConfig, /WORKERS_CI_BRANCH/);
	assert.doesNotMatch(nuxtConfig, /name:\s*'test-takumi'/);
	assert.match(nuxtConfig, /preview_urls:\s*true/);
	assert.match(nuxtConfig, /logpush:\s*true/);
	assert.match(nuxtConfig, /observability:\s*\{/);
	assert.doesNotMatch(nuxtConfig, /env:\s*\{/);
});

test('Basic Auth environment documentation uses server-only Cloudflare variables', async () => {
	const envExample = await readFile(new URL('../.env.example', import.meta.url), 'utf8');

	assert.match(envExample, /^NUXT_BASIC_AUTH_USERNAME=/m);
	assert.match(envExample, /^NUXT_BASIC_AUTH_PASSWORD=/m);
	assert.match(envExample, /^NUXT_BASIC_AUTH_ENABLED=false/m);
	assert.match(envExample, /^NUXT_BASIC_AUTH_PREVIEW_HOSTNAMES=/m);
	assert.doesNotMatch(envExample, /^NUXT_PUBLIC_BASIC_AUTH_/m);
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
