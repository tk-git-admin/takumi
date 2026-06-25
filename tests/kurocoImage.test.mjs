import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import {
	KUROCO_IMAGE_PRESETS,
	getKurocoImagePreset,
	optimizeKurocoHtmlImages,
	withKurocoImageParams,
} from '../utils/kurocoImage.mjs';

const kurocoImageUrl = 'https://takumi-international.g.kuroco-img.app/files/topics/54_ext_3_0.png';
const relativeKurocoImageUrl = '/v=1781170752/files/topics/54_ext_13_0.png';

test('Kuroco image helper adds width and quality while preserving existing parameters', () => {
	assert.equal(
		withKurocoImageParams(`${kurocoImageUrl}?v=1781486915&width=240`, {
			width: 640,
			quality: 75,
		}),
		`${kurocoImageUrl}?v=1781486915&width=640&quality=75`,
	);
});

test('Kuroco image helper can request a compressed output format for raster CMS images', () => {
	assert.equal(
		withKurocoImageParams(relativeKurocoImageUrl, {
			width: 640,
			format: 'jpg',
			quality: 75,
		}),
		`${relativeKurocoImageUrl}?width=640&format=jpg&quality=75`,
	);

	const poster = getKurocoImagePreset(relativeKurocoImageUrl, 'seibuPoster');

	assert.equal(poster.src, `${relativeKurocoImageUrl}?width=1200&format=jpg&quality=75`);
	assert.match(poster.srcset, /width=640&format=jpg&quality=75 640w/);
	assert.match(poster.srcset, /width=1200&format=jpg&quality=75 1200w/);
});

test('Kuroco image helper optimizes root-relative Kuroco topic paths', () => {
	assert.equal(
		withKurocoImageParams(relativeKurocoImageUrl, { width: 640, quality: 75 }),
		`${relativeKurocoImageUrl}?width=640&quality=75`,
	);

	const image = getKurocoImagePreset(relativeKurocoImageUrl, 'newsCard');

	assert.equal(image.src, `${relativeKurocoImageUrl}?width=640&quality=75`);
	assert.match(
		image.srcset,
		/\/v=1781170752\/files\/topics\/54_ext_13_0\.png\?width=320&quality=75 320w/,
	);
});

test('Kuroco image helper leaves non-Kuroco, empty, and relative URLs unchanged', () => {
	for (const source of [
		'/img/takumi-ogp.png',
		'https://cdn.example.test/product.jpeg',
		'',
		'not a url',
	]) {
		assert.equal(withKurocoImageParams(source, { width: 640, quality: 75 }), source);
	}
});

test('Kuroco image presets expose responsive srcset and sizes without rewriting fallbacks', () => {
	const newsCard = getKurocoImagePreset(kurocoImageUrl, 'newsCard');

	assert.equal(newsCard.src, `${kurocoImageUrl}?width=640&quality=75`);
	assert.equal(newsCard.width, 640);
	assert.equal(newsCard.height, 400);
	assert.equal(newsCard.loading, 'lazy');
	assert.match(newsCard.sizes, /min-width: 1024px/);
	assert.match(newsCard.srcset, /width=320&quality=75 320w/);
	assert.match(newsCard.srcset, /width=640&quality=75 640w/);

	const fallback = getKurocoImagePreset('/img/takumi-ogp.png', 'newsCard');
	assert.equal(fallback.src, '/img/takumi-ogp.png');
	assert.equal(fallback.srcset, undefined);
});

test('Kuroco HTML image optimizer rewrites rich-text image src and adds lazy metadata', () => {
	const html = `<p>Intro</p><img src="${kurocoImageUrl}?foo=bar" alt="CMS image"><img src="/img/local.jpg">`;
	const optimized = optimizeKurocoHtmlImages(html, KUROCO_IMAGE_PRESETS.articleImage);

	assert.match(
		optimized,
		/src="https:\/\/takumi-international\.g\.kuroco-img\.app\/files\/topics\/54_ext_3_0\.png\?foo=bar&amp;width=1200&amp;quality=75"/,
	);
	assert.match(
		optimized,
		/srcset="[^"]*width=640&amp;quality=75 640w[^"]*width=1200&amp;quality=75 1200w"/,
	);
	assert.match(optimized, /sizes="\(min-width: 1024px\) 960px, 100vw"/);
	assert.match(optimized, /loading="lazy"/);
	assert.match(optimized, /decoding="async"/);
	assert.match(optimized, /<img src="\/img\/local\.jpg">/);
});

test('Kuroco image optimization is wired into current render points and content loading', async () => {
	const files = {
		newsCard: await readFile(new URL('../components/NewsCard.vue', import.meta.url), 'utf8'),
		productModal: await readFile(
			new URL('../components/ProductModal.vue', import.meta.url),
			'utf8',
		),
		productsPage: await readFile(new URL('../pages/products.vue', import.meta.url), 'utf8'),
		knivesPage: await readFile(new URL('../pages/knives.vue', import.meta.url), 'utf8'),
		newsDetail: await readFile(new URL('../pages/news/[slug].vue', import.meta.url), 'utf8'),
		seibuFair: await readFile(new URL('../pages/seibu-fair.vue', import.meta.url), 'utf8'),
		contentLoader: await readFile(
			new URL('../composables/useTakumiContent.ts', import.meta.url),
			'utf8',
		),
		kurocoContent: await readFile(
			new URL('../server/shared/kurocoContent.mjs', import.meta.url),
			'utf8',
		),
	};

	const imageFiles = {
		newsCard: files.newsCard,
		productModal: files.productModal,
		productsPage: files.productsPage,
		knivesPage: files.knivesPage,
		newsDetail: files.newsDetail,
		seibuFair: files.seibuFair,
	};

	for (const [name, source] of Object.entries(imageFiles)) {
		assert.equal(source.includes('kurocoImage'), true, `${name} should use Kuroco image helpers`);
	}

	for (const forbidden of [
		':src="item.image.url"',
		':src="item.image[0].url"',
		':src="item.image[1].url"',
		':src="image.url"',
		':src="thumbnailUrl"',
		':src="asset.src"',
		':src="posterAsset.src"',
		':src="heroLogo.src"',
		':src="exhibitor.logoSrc"',
	]) {
		for (const [name, source] of Object.entries(imageFiles)) {
			assert.equal(source.includes(forbidden), false, `${name} should not contain ${forbidden}`);
		}
	}

	for (const expectedSource of [
		'getContentTypesForRoute',
		'contentTypes.includes',
		'locale.value',
		'watch(data',
	]) {
		assert.equal(files.contentLoader.includes(expectedSource), true, expectedSource);
	}

	assert.equal(files.contentLoader.includes('homeEn, homeJa'), false);
	assert.equal(files.contentLoader.includes("contentQuery('ja')"), false);
	assert.equal(files.kurocoContent.includes('optimizeKurocoHtmlImages'), true);
});
