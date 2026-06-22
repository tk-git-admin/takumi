import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';

import { test } from 'node:test';

async function exists(path) {
	try {
		await access(new URL(path, import.meta.url), constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

async function readProjectFile(path) {
	return readFile(new URL(path, import.meta.url), 'utf8');
}

test('GTM head config is environment-gated and places Consent Mode before the loader', async () => {
	assert.equal(await exists('../config/gtm.ts'), true, 'config/gtm.ts should define GTM snippets');

	const nuxtConfig = await readProjectFile('../nuxt.config.ts');
	const gtmConfig = await readProjectFile('../config/gtm.ts');

	assert.match(
		nuxtConfig,
		/import\s+\{\s*gtmBootstrap,\s*gtmNoscript\s*\}\s+from ['"]\.\/config\/gtm['"]/,
	);
	assert.match(nuxtConfig, /const GTM_ID = process\.env\.NUXT_PUBLIC_GTM_ID \|\| ['"]{2}/);
	assert.match(nuxtConfig, /innerHTML:\s*gtmBootstrap\(GTM_ID\)/);
	assert.match(nuxtConfig, /tagPriority:\s*['"]critical['"]/);
	assert.match(nuxtConfig, /innerHTML:\s*gtmNoscript\(GTM_ID\)/);
	assert.match(nuxtConfig, /tagPosition:\s*['"]bodyOpen['"]/);

	assert.match(gtmConfig, /export function gtmBootstrap\(gtmId: string\): string/);
	assert.match(gtmConfig, /export function gtmNoscript\(gtmId: string\): string/);
	assert.match(gtmConfig, /gtag\(['"]consent['"],\s*['"]default['"]/);
	assert.match(gtmConfig, /ad_storage:\s*['"]denied['"]/);
	assert.match(gtmConfig, /ad_user_data:\s*['"]denied['"]/);
	assert.match(gtmConfig, /ad_personalization:\s*['"]denied['"]/);
	assert.match(gtmConfig, /analytics_storage:\s*['"]denied['"]/);
	assert.match(gtmConfig, /wait_for_update:\s*500/);
	assert.match(gtmConfig, /https:\/\/www\.googletagmanager\.com\/gtm\.js\?id=/);
	assert.match(gtmConfig, /https:\/\/www\.googletagmanager\.com\/ns\.html\?id=\$\{gtmId\}/);

	assert.ok(
		gtmConfig.indexOf("gtag('consent', 'default'") < gtmConfig.indexOf('gtm.js?id='),
		'Consent Mode defaults must be pushed before gtm.js loads',
	);
});

test('cookie consent UI grants GTM consent only after opt-in and remembers decisions', async () => {
	assert.equal(
		await exists('../composables/useConsentMode.ts'),
		true,
		'composables/useConsentMode.ts should own runtime consent updates',
	);
	assert.equal(
		await exists('../components/CookieConsent.vue'),
		true,
		'components/CookieConsent.vue should expose the consent UI',
	);

	const appVue = await readProjectFile('../app.vue');
	const composable = await readProjectFile('../composables/useConsentMode.ts');
	const component = await readProjectFile('../components/CookieConsent.vue');
	const en = await readProjectFile('../locales/en.json');
	const ja = await readProjectFile('../locales/ja.json');

	assert.match(appVue, /<CookieConsent\s*\/>/);
	assert.match(composable, /window\.gtag\(['"]consent['"],\s*['"]update['"]/);
	assert.match(composable, /ad_storage:\s*value/);
	assert.match(composable, /ad_user_data:\s*value/);
	assert.match(composable, /ad_personalization:\s*value/);
	assert.match(composable, /analytics_storage:\s*value/);
	assert.match(component, /const STORAGE_KEY = ['"]cookie-consent['"]/);
	assert.match(component, /localStorage\.setItem\(STORAGE_KEY,\s*['"]accepted['"]\)/);
	assert.match(component, /localStorage\.setItem\(STORAGE_KEY,\s*['"]declined['"]\)/);
	assert.match(component, /if \(decision === ['"]accepted['"]\) grantConsent\(\)/);
	assert.match(en, /"cookieConsent"\s*:/);
	assert.match(ja, /"cookieConsent"\s*:/);
});

test('direct GA4 tag is removed so GTM is the single analytics container pattern', async () => {
	const appVue = await readProjectFile('../app.vue');

	assert.doesNotMatch(appVue, /<google-tag\s*\/>/);
	assert.equal(
		await exists('../components/google-tag.vue'),
		false,
		'old direct GA4 component should be removed',
	);
});

test('GTM build variable is documented with the marketing container ID', async () => {
	const envExample = await readProjectFile('../.env.example');
	const readme = await readProjectFile('../README.md');

	assert.match(envExample, /^NUXT_PUBLIC_GTM_ID=GTM-NJP9WCVD$/m);
	assert.match(envExample, /build/i);
	assert.match(readme, /NUXT_PUBLIC_GTM_ID/);
	assert.match(readme, /GTM-NJP9WCVD/);
});
