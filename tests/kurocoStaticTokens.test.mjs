import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readProjectFile(path) {
	try {
		return await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
	} catch (error) {
		if (error?.code === 'ENOENT') {
			return '';
		}
		throw error;
	}
}

function sourceFrom(source, marker) {
	const index = source.indexOf(marker);
	return index === -1 ? '' : source.slice(index);
}

test('Kuroco static tokens are declared as server-only runtime config values', async () => {
	const nuxtConfig = await readProjectFile('nuxt.config.ts');
	const publicRuntimeConfig = nuxtConfig.match(/public:\s*\{[\s\S]*?\n\s*\},\n\s*\},/)?.[0] ?? '';

	for (const [configKey, envName] of [
		['kurocoHomepageToken', 'KUROCO_HOMEPAGE_TOKEN'],
		['kurocoNewsToken', 'KUROCO_NEWS_TOKEN'],
		['kurocoProductsToken', 'KUROCO_PRODUCTS_TOKEN'],
		['kurocoKnivesToken', 'KUROCO_KNIVES_TOKEN'],
	]) {
		assert.match(
			nuxtConfig,
			new RegExp(`${configKey}:\\s*process\\.env\\.${envName}\\s*\\|\\|\\s*['"]{2}`),
			`${envName} should be read into private runtimeConfig.${configKey}`,
		);
		assert.doesNotMatch(publicRuntimeConfig, new RegExp(envName));
		assert.doesNotMatch(publicRuntimeConfig, new RegExp(configKey));
	}

	assert.doesNotMatch(
		nuxtConfig,
		/(?:NEXT_PUBLIC|VITE|NUXT_PUBLIC)_KUROCO_(?:HOMEPAGE|NEWS|PRODUCTS|KNIVES)_TOKEN/,
	);
});

test('Kuroco runtime helper maps static tokens to the correct read-only API groups', async () => {
	const helper = await readProjectFile('server/utils/kurocoConfig.ts');

	for (const expected of [
		'export type KurocoContentType =',
		"home: 'kurocoHomepageToken'",
		"news: 'kurocoNewsToken'",
		"products: 'kurocoProductsToken'",
		"knives: 'kurocoKnivesToken'",
		"'KUROCO_HOMEPAGE_TOKEN'",
		"'KUROCO_NEWS_TOKEN'",
		"'KUROCO_PRODUCTS_TOKEN'",
		"'KUROCO_KNIVES_TOKEN'",
		"headers['X-RCMS-API-ACCESS-TOKEN'] = token",
	]) {
		assert.equal(helper.includes(expected), true, expected);
	}
});

test('Kuroco read requests use grouped static tokens and form submissions do not', async () => {
	const contentFetch = await readProjectFile('server/utils/kurocoFetch.ts');
	const seibuFetch = await readProjectFile('server/utils/seibuFairFetch.ts');
	const seibuReservationCounts = sourceFrom(
		seibuFetch,
		'export async function fetchSeibuReservationCounts',
	);
	const seibuSubmit = sourceFrom(
		seibuFetch,
		'export async function submitSeibuReservationToKuroco',
	);

	assert.match(contentFetch, /getKurocoStaticTokenHeaders\(config,\s*contentType\)/);
	assert.doesNotMatch(contentFetch, /kurocoApiAccessToken|KUROCO_API_ACCESS_TOKEN/);

	assert.match(seibuFetch, /getKurocoStaticTokenHeaders\(config,\s*'home'\)/);
	assert.match(seibuReservationCounts, /headers:\s*getKurocoAcceptHeaders\(\)/);
	assert.match(seibuSubmit, /headers:\s*getKurocoAcceptHeaders\(\)/);
	assert.doesNotMatch(seibuReservationCounts, /getKurocoStaticTokenHeaders/);
	assert.doesNotMatch(
		seibuSubmit,
		/getKurocoStaticTokenHeaders|kurocoHomepageToken|KUROCO_HOMEPAGE_TOKEN/,
	);
});

test('homepage SSR content loader preserves request context for internal Kuroco routes', async () => {
	const composable = await readProjectFile('composables/useTakumiContent.ts');

	assert.match(composable, /const\s+requestFetch\s*=\s*useRequestFetch\(\)/);
	assert.doesNotMatch(composable, /\$fetch<[^>]+>\(['"]\/api\/content\//);

	for (const route of [
		'/api/content/home',
		'/api/content/news',
		'/api/content/products',
		'/api/content/knives',
	]) {
		assert.match(
			composable,
			new RegExp(`requestFetch<[^>]+>\\(['"]${route.replaceAll('/', '\\/')}['"]`),
			`${route} should use the request-bound fetch during SSR`,
		);
	}
});

test('Kuroco token examples are empty and local secret files stay ignored', async () => {
	const envExample = await readProjectFile('.env.example');
	const gitignore = await readProjectFile('.gitignore');

	for (const envName of [
		'KUROCO_HOMEPAGE_TOKEN',
		'KUROCO_NEWS_TOKEN',
		'KUROCO_PRODUCTS_TOKEN',
		'KUROCO_KNIVES_TOKEN',
	]) {
		assert.match(envExample, new RegExp(`^${envName}=$`, 'm'));
	}

	assert.doesNotMatch(envExample, /^(?:NEXT_PUBLIC|VITE|NUXT_PUBLIC)_KUROCO_/m);
	assert.match(gitignore, /^\.env\.\*$/m);
	assert.match(gitignore, /^!\.env\.example$/m);
	assert.match(gitignore, /^\.dev\.vars$/m);
	assert.match(gitignore, /^\.dev\.vars\.\*$/m);
});
