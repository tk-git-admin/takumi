import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getLocalizedLink, isHashLink, toggleLocalePrefix } from '../utils/navigation.mjs';

test('localized links preserve native contact hashes', () => {
	assert.equal(getLocalizedLink('/#contact', 'en'), '/#contact');
	assert.equal(getLocalizedLink('/#contact', 'ja'), '/ja/#contact');
	assert.equal(getLocalizedLink('/ja/#contact', 'ja'), '/ja/#contact');
});

test('localized links normalize relative internal paths', () => {
	assert.equal(getLocalizedLink('newslist/', 'en'), '/newslist/');
	assert.equal(getLocalizedLink('newslist/', 'ja'), '/ja/newslist/');
	assert.equal(getLocalizedLink('/ja/newslist/', 'en'), '/ja/newslist/');
});

test('hash-link detection separates anchor links from routed pages', () => {
	assert.equal(isHashLink('/#contact'), true);
	assert.equal(isHashLink('/ja/#contact'), true);
	assert.equal(isHashLink('/newslist/'), false);
});

test('locale prefix toggling preserves hash and query fragments', () => {
	assert.equal(toggleLocalePrefix('/#contact'), '/ja/#contact');
	assert.equal(toggleLocalePrefix('/ja/#contact'), '/#contact');
	assert.equal(toggleLocalePrefix('/newslist/?page=1#latest'), '/ja/newslist/?page=1#latest');
});
