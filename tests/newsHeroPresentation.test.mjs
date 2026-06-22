import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import { getNewsHeroPresentation } from '../utils/newsHeroPresentation.mjs';

test('news hero presentation separates bracket label, headline, and colon description', () => {
	const presentation = getNewsHeroPresentation({
		hero: {
			hero_title:
				'[Update] Takumi International Sdn Bhd Bringing the Art of Japanese Tradition to Malaysia: Takumi International to Host Premium "Japan Fair" at SEIBU, June 2026.',
			hero_subtitle: '',
		},
		news: {
			category: 'News',
		},
	});

	assert.deepEqual(presentation, {
		label: 'Update',
		title: 'Takumi International Sdn Bhd Bringing the Art of Japanese Tradition to Malaysia',
		description: 'Takumi International to Host Premium "Japan Fair" at SEIBU, June 2026.',
	});
});

test('news hero presentation keeps CMS subtitle as the description when provided', () => {
	const presentation = getNewsHeroPresentation({
		hero: {
			hero_title: '[Event] The Art of Japan',
			hero_subtitle: 'Craft, culture, and workshops at SEIBU.',
		},
		news: {
			category: 'Announcement',
		},
	});

	assert.deepEqual(presentation, {
		label: 'Event',
		title: 'The Art of Japan',
		description: 'Craft, culture, and workshops at SEIBU.',
	});
});

test('news detail hero layout reserves fixed-header space and uses tokenized hierarchy styles', async () => {
	const appSource = await readFile(new URL('../app.vue', import.meta.url), 'utf8');
	const pageSource = await readFile(new URL('../pages/news/[slug].vue', import.meta.url), 'utf8');
	const mainCss = await readFile(new URL('../assets/css/main.css', import.meta.url), 'utf8');

	for (const requiredSource of [
		'class="page-hero"',
		'aria-labelledby="page-hero-title"',
		'newsHero.imageStyle',
		'newsHero.label',
		'newsHero.title',
		'newsHero.description',
		'class="page-hero__content"',
		'class="page-hero__eyebrow"',
		'class="page-hero__title"',
		'class="page-hero__description"',
		'--page-hero-image',
	]) {
		assert.equal(pageSource.includes(requiredSource), true, requiredSource);
	}

	for (const requiredSource of [
		'.page-hero {',
		'background-image: var(--page-hero-image);',
		'.page-hero__content {',
		'.page-hero__eyebrow {',
		'.page-hero__title {',
		'.page-hero__description {',
		'padding: clamp(9.25rem, 16vw, 11rem) var(--tk-space-gutter) clamp(4rem, 9vw, 6rem);',
		'width: min(100%, 58rem);',
		'max-width: 100%;',
		"font-family: Montserrat, 'Open Sans', sans-serif;",
		'text-wrap: balance;',
		'var(--tk-color-event-gold)',
		'rgb(var(--tk-color-ink-rgb) / 58%)',
	]) {
		assert.equal(mainCss.includes(requiredSource), true, requiredSource);
	}

	for (const removedSource of [
		'class="news-hero"',
		'news-hero__shade',
		'news-hero__content',
		'news-hero__eyebrow',
		'news-hero__title',
		'news-hero__description',
		'.news-hero',
		'--news-hero-image',
		'class="min-h-96 flex flex-col items-center"',
		'style="background: rgba(0, 0, 0, 0.69); flex-grow: 1"',
		'class="heading-2 pt-12 px-3.5"',
		'class="heading-3 px-3.5"',
		'color: #fff;',
		'background: #772c1a;',
		'max-width: 19ch;',
		'max-width: 12.5ch;',
	]) {
		assert.equal(pageSource.includes(removedSource), false, removedSource);
	}

	for (const removedTypography of ['Cormorant Garamond', 'Noto Serif JP']) {
		assert.equal(appSource.includes(removedTypography), false, removedTypography);
		assert.equal(mainCss.includes(removedTypography), false, removedTypography);
	}
});
