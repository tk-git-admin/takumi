import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('news cards share one tokenized mobile-optimized component', async () => {
	const homeSource = await readFile(new URL('../pages/index.vue', import.meta.url), 'utf8');
	const listSource = await readFile(new URL('../pages/newslist.vue', import.meta.url), 'utf8');
	const cardSource = await readFile(new URL('../components/NewsCard.vue', import.meta.url), 'utf8');

	assert.equal(homeSource.includes('<NewsCard'), true);
	assert.equal(listSource.includes('<NewsCard'), true);
	assert.equal(homeSource.includes('w-11/12 sm:w-96 bg-base-200'), false);
	assert.equal(listSource.includes('w-80 xs:w-96'), false);
	assert.equal(listSource.includes('news-list-section__stack'), false);

	for (const expectedListSource of [
		'class="news-list-section__grid"',
		'padding: clamp(9.5rem, 20vh, 13.5rem) 0 var(--tk-space-section);',
		'width: min(calc(100% - calc(var(--tk-space-gutter) * 2)), var(--tk-content-max));',
		'grid-template-columns: repeat(3, minmax(0, 1fr));',
	]) {
		assert.equal(listSource.includes(expectedListSource), true, expectedListSource);
	}

	for (const expectedSource of [
		'class="news-card"',
		'.news-card__image',
		'.news-card__category',
		'.news-card__title',
		'.news-card__intro',
		'var(--tk-color-paper)',
		'rgb(var(--tk-color-brand-brown-rgb) / 12%)',
		'rgb(var(--tk-color-ink-rgb) / 8%)',
		'padding: clamp(1rem, 4vw, 1.35rem);',
		'aspect-ratio: 16 / 10;',
	]) {
		assert.equal(cardSource.includes(expectedSource), true, expectedSource);
	}
});
