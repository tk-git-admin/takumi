import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
	buildKurocoContentUrl,
	findNewsBySlug,
	isValidSlug,
	normalizeDetailsResponse,
	normalizeListResponse,
	normalizeLocale,
} from '../server/shared/kurocoContent.mjs';

const apiConfig = {
	baseUrl: 'https://cms.example.test/base/',
	apiIds: {
		homeId: '3',
		homeSlugId: '9',
		newsBlogId: '4',
		productsId: '6',
		knivesId: '7',
	},
};

test('Kuroco content URLs use configured ids and preserve locale rules', () => {
	assert.equal(
		buildKurocoContentUrl(apiConfig, 'home', 'en'),
		'https://cms.example.test/rcms-api/3/home/9',
	);
	assert.equal(
		buildKurocoContentUrl(apiConfig, 'home', 'ja'),
		'https://cms.example.test/rcms-api/3/home/9?_lang=ja',
	);
	assert.equal(
		buildKurocoContentUrl(apiConfig, 'news', 'ja'),
		'https://cms.example.test/rcms-api/4/newsblog?_lang=ja',
	);
	assert.equal(
		buildKurocoContentUrl(apiConfig, 'knives', 'en'),
		'https://cms.example.test/rcms-api/7/knives',
	);
});

test('locale and slug helpers reject unsupported input before server fetches CMS', () => {
	assert.equal(normalizeLocale('en'), 'en');
	assert.equal(normalizeLocale('ja'), 'ja');
	assert.equal(normalizeLocale(undefined), 'en');
	assert.throws(() => normalizeLocale('ms'), /Unsupported locale/);

	assert.equal(isValidSlug('about-halal-product'), true);
	assert.equal(isValidSlug('news_2026'), true);
	assert.equal(isValidSlug('../secret'), false);
	assert.equal(isValidSlug('bad/slug'), false);
	assert.equal(isValidSlug(''), false);
});

test('Kuroco response normalizers keep app-owned list and details shapes stable', () => {
	const pageInfo = { totalCnt: 2 };
	const listResponse = normalizeListResponse({
		list: [{ slug: 'first' }, { slug: 'second' }],
		pageInfo,
	});
	assert.deepEqual(listResponse, {
		list: [{ slug: 'first' }, { slug: 'second' }],
		pageInfo,
	});
	assert.deepEqual(normalizeListResponse({}), { list: [], pageInfo: null });

	const details = { main_title: 'Takumi' };
	assert.deepEqual(normalizeDetailsResponse({ details }), { details, pageInfo: null });
	assert.deepEqual(normalizeDetailsResponse({}), { details: null, pageInfo: null });
});

test('news detail lookup returns a stable details response by slug', () => {
	const list = [
		{ slug: 'about-halal-product', news: { headline: 'Halal' } },
		{ slug: 'seibu-fair', news: { headline: 'SEIBU Fair' } },
	];

	assert.deepEqual(findNewsBySlug(list, 'seibu-fair'), {
		details: { slug: 'seibu-fair', news: { headline: 'SEIBU Fair' } },
		pageInfo: null,
	});
	assert.deepEqual(findNewsBySlug(list, 'missing'), { details: null, pageInfo: null });
});

test('news detail hero title prefers Kuroco native subject over custom hero title', () => {
	const list = [
		{
			slug: 'fair_2026',
			subject: '[Update] Takumi International Sdn Bhd Bringing the Art of Japanese Tradition',
			hero: {
				hero_title: 'Takumi International Sdn Bhd Bringing the Art of Japanese Tradition',
				hero_subtitle: '',
			},
		},
	];

	assert.deepEqual(findNewsBySlug(list, 'fair_2026'), {
		details: {
			slug: 'fair_2026',
			subject: '[Update] Takumi International Sdn Bhd Bringing the Art of Japanese Tradition',
			hero: {
				hero_title: '[Update] Takumi International Sdn Bhd Bringing the Art of Japanese Tradition',
				hero_subtitle: '',
			},
		},
		pageInfo: null,
	});
});

test('news detail hero title decodes HTML entities from Kuroco native subject', () => {
	const list = [
		{
			slug: 'fair_2026',
			subject: '[Update] Takumi International to Host Premium &quot;Japan Fair&quot; at SEIBU',
			hero: {
				hero_title: 'Takumi International to Host Premium "Japan Fair" at SEIBU',
			},
		},
	];

	assert.equal(
		findNewsBySlug(list, 'fair_2026').details.hero.hero_title,
		'[Update] Takumi International to Host Premium "Japan Fair" at SEIBU',
	);
});
