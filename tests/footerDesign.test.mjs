import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('global footer uses Takumi design-system layout and accessible navigation', async () => {
	const footerSource = await readFile(new URL('../components/Footer.vue', import.meta.url), 'utf8');

	assert.equal(footerSource.includes('class="footer items-center'), false);
	assert.equal(footerSource.includes('bg-base-300'), false);
	assert.equal(footerSource.includes('takumi-footer'), true);
	assert.equal(footerSource.includes('takumi-footer__inner'), true);
	assert.equal(footerSource.includes(':aria-label="t(\'footer.navLabel\')"'), true);
	assert.equal(footerSource.includes("t('footer.description')"), true);
	assert.equal(footerSource.includes("t('footer.navLabel')"), true);
	assert.equal(footerSource.includes("t('footer.socialLabel')"), true);
	assert.equal(footerSource.includes("t('footer.copyright'"), true);
	assert.equal(footerSource.includes("t('footer.contactCta')"), false);
	assert.equal(footerSource.includes('takumi-footer__contact'), false);
	assert.equal(footerSource.includes('useLocalePath'), false);
	assert.equal(
		footerSource.includes("import { getLocalizedLink, isHashLink } from '~/utils/navigation.mjs';"),
		true,
	);
	assert.equal(footerSource.includes(':href="getLocalizedLink(link.path, locale)"'), true);
	assert.equal(footerSource.includes('v-if="isHashLink(link.path)"'), true);
	assert.equal(footerSource.includes('v-else'), true);
	assert.equal(footerSource.includes('rel="noopener noreferrer"'), true);
	assert.equal(footerSource.includes('target="_blank"'), true);
	assert.equal(footerSource.includes('var(--tk-color-brand-brown-rgb)'), true);
	assert.equal(footerSource.includes('var(--tk-color-ink-rgb)'), true);
	assert.equal(footerSource.includes('var(--tk-content-max)'), true);
	assert.equal(footerSource.includes("url('/img/takumi-washi-glass/pattern-washi.svg')"), true);
	assert.match(
		footerSource,
		/\.takumi-footer__inner\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1\.2fr\) minmax\(0, 0\.95fr\) minmax\(13rem, 0\.65fr\);/,
	);
	assert.match(
		footerSource,
		/\.takumi-footer__logo img\s*\{[\s\S]*?height:\s*48px;[\s\S]*?width:\s*auto;/,
	);
	assert.match(footerSource, /\.takumi-footer__link\s*\{[\s\S]*?min-height:\s*2\.75rem;/);
	assert.match(
		footerSource,
		/@media \(max-width: 760px\)\s*\{[\s\S]*?\.takumi-footer__inner\s*\{[\s\S]*?grid-template-columns:\s*1fr;/,
	);
});

test('footer localized copy exists in English and Japanese', async () => {
	const en = JSON.parse(await readFile(new URL('../locales/en.json', import.meta.url), 'utf8'));
	const ja = JSON.parse(await readFile(new URL('../locales/ja.json', import.meta.url), 'utf8'));

	for (const locale of [en, ja]) {
		assert.equal(typeof locale.footer.description, 'string');
		assert.equal(typeof locale.footer.navLabel, 'string');
		assert.equal(typeof locale.footer.socialLabel, 'string');
		assert.equal(typeof locale.footer.copyright, 'string');
		assert.equal(Object.hasOwn(locale.footer, 'contactCta'), false);
		assert.equal(locale.footer.description.length > 20, true);
		assert.equal(locale.footer.navLabel.length > 4, true);
		assert.equal(locale.footer.socialLabel.length > 4, true);
		assert.equal(locale.footer.copyright.includes('{year}'), true);
	}
});
