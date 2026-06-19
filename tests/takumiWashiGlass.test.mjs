import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { test } from 'node:test';

const publicAssetNames = [
	'icon-globe.svg',
	'pattern-asanoha.svg',
	'pattern-washi-glass.svg',
	'pattern-washi.svg',
];

test('Takumi washi glass decorative assets are served from public image paths', async () => {
	for (const assetName of publicAssetNames) {
		await access(new URL(`../public/img/takumi-washi-glass/${assetName}`, import.meta.url));
	}
});

test('homepage does not render or ship a bottom wave SVG', async () => {
	const pageSource = await readFile(new URL('../pages/index.vue', import.meta.url), 'utf8');

	await assert.rejects(
		access(new URL('../public/img/takumi-washi-glass/bottom-wave.svg', import.meta.url)),
		'bottom-wave.svg should not be shipped when the hero transition is removed',
	);
	assert.equal(
		pageSource.includes('/img/takumi-washi-glass/bottom-wave.svg') ||
			pageSource.includes('.takumi-hero::after'),
		false,
		'homepage should not render a bottom wave pseudo-element or SVG reference',
	);
});

test('homepage hero content is limited to existing Kuroco homepage fields', async () => {
	const pageSource = await readFile(new URL('../pages/index.vue', import.meta.url), 'utf8');
	const englishLocale = await readFile(new URL('../locales/en.json', import.meta.url), 'utf8');
	const japaneseLocale = await readFile(new URL('../locales/ja.json', import.meta.url), 'utf8');

	for (const expectedSource of [
		'takumi-hero',
		'takumi-hero-card',
		'heroImageStyle',
		'--tk-hero-image',
		"'/img/hero_bg.jpg'",
		'takumi-hero-card__footer',
		'getHomeList().main_title',
		'getHomeList().tagline',
	]) {
		assert.equal(pageSource.includes(expectedSource), true, expectedSource);
	}

	for (const removedHeroSource of [
		'takumi-hero-side-note',
		'takumi-hero-card__eyebrow',
		'takumi-hero-card__kicker',
		'takumi-hero__scroll',
		'heroTitle',
		'heroCopy',
		'tree.png',
		'ink-plum-branch.svg',
		'seal-takumi.svg',
		'washiAssets.seal',
		"t('hero.fallbackTitle')",
		"t('hero.fallbackCopy')",
		"t('hero.eyebrow')",
		"t('hero.sideNote')",
		"t('hero.scroll')",
		'icon-kamon.svg',
		'seal-small.svg',
		'AUTHENTIC JAPANESE CRAFTS',
		'<span>匠</span>',
		'<small>TAKUMI</small>',
		'takumi-hero-card__logo',
		'/img/takumi-logo.webp',
		"logo: '/img/takumi-logo.webp'",
		'washiAssets.logo',
		'/img/takumi-washi-glass/tree.svg',
		'takumi-hero-card__tree',
		'takumi-hero-card__decor',
		'washiAssets',
		'/img/takumi-washi-glass/pattern-asanoha.svg',
		'takumi-hero__asanoha',
	]) {
		assert.equal(pageSource.includes(removedHeroSource), false, removedHeroSource);
	}

	for (const removedLocaleKey of [
		'"eyebrow"',
		'"fallbackTitle"',
		'"fallbackCopy"',
		'"sideNote"',
		'"scroll"',
	]) {
		assert.equal(englishLocale.includes(removedLocaleKey), false, removedLocaleKey);
		assert.equal(japaneseLocale.includes(removedLocaleKey), false, removedLocaleKey);
	}
});

test('announcement bar uses the washi side ornament from public assets', async () => {
	const announcementSource = await readFile(
		new URL('../components/AnnouncementBar.vue', import.meta.url),
		'utf8',
	);

	for (const expectedSource of [
		'announcement-bar::before',
		'/img/takumi-washi-glass/pattern-asanoha.svg',
		'overflow: hidden',
	]) {
		assert.equal(announcementSource.includes(expectedSource), true, expectedSource);
	}
});

test('announcement bar centers text on mobile and tablet', async () => {
	const announcementSource = await readFile(
		new URL('../components/AnnouncementBar.vue', import.meta.url),
		'utf8',
	);
	const tabletRule =
		announcementSource.match(/@media \(max-width: 1023px\)\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const mobileRule =
		announcementSource.match(/@media \(max-width: 767px\)\s*\{[\s\S]*?\n\}/)?.[0] ?? '';

	assert.equal(
		tabletRule.includes('justify-content: center;') && tabletRule.includes('text-align: center;'),
		true,
		'announcement content should stay centered across tablet widths',
	);
	assert.equal(
		mobileRule.includes('justify-content: flex-start;') ||
			mobileRule.includes('overflow-x: auto;') ||
			mobileRule.includes('scrollbar-width: none;'),
		false,
		'mobile announcement should not fall back to left-aligned horizontal scrolling',
	);
});

test('homepage hero CSS keeps the first viewport composed on desktop and mobile', async () => {
	const pageSource = await readFile(new URL('../pages/index.vue', import.meta.url), 'utf8');
	const invalidTokenAlphaPattern = /rgba\(var\(--tk-color-[^)]+-rgb\),\s*[\d.]+\)/;
	const heroRule = pageSource.match(/\.takumi-hero\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const heroMediaRule = pageSource.match(/\.takumi-hero__media\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const heroShadeRule = pageSource.match(/\.takumi-hero::before\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const heroPatternRule = pageSource.match(/\.takumi-hero__asanoha\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const heroWaveRule = pageSource.match(/\.takumi-hero::after\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const heroInnerRule = pageSource.match(/\.takumi-hero__inner\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const heroCardRule = pageSource.match(/\.takumi-hero-card\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const heroCardSurfaceRule =
		pageSource.match(/\.takumi-hero-card::before\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const heroFooterRule = pageSource.match(/\.takumi-hero-card__footer\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const heroDecorRule = pageSource.match(/\.takumi-hero-card__decor\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const heroTreeRule = pageSource.match(/\.takumi-hero-card__tree\s*\{[\s\S]*?\n\}/)?.[0] ?? '';

	assert.equal(
		pageSource.includes('font-size: clamp(2.75rem, 4.1vw, 4.4rem);'),
		true,
		'desktop hero title scale should fit the narrower right-side reference panel',
	);
	assert.equal(
		pageSource.includes('max-width: 18ch;'),
		true,
		'desktop hero title measure should allow Discover Authentic to stay together',
	);
	assert.equal(
		heroInnerRule.includes('display: grid;') &&
			heroInnerRule.includes('grid-template-columns: minmax(18rem, 1fr) minmax(34rem, 42rem);') &&
			heroInnerRule.includes('justify-items: end;'),
		true,
		'hero should reserve a visible photo field and align the card to the right on desktop',
	);
	assert.equal(
		heroInnerRule.includes('width: min(calc(100% - calc(var(--tk-space-gutter) * 2)), 88rem);'),
		true,
		'hero content should be wide enough for the photo/card composition',
	);
	assert.equal(
		heroCardRule.includes('grid-column: 2;') &&
			heroCardRule.includes("grid-template-areas: 'title' 'mark' 'copy' 'footer';") &&
			heroCardRule.includes('grid-template-columns: 1fr;') &&
			heroCardRule.includes('justify-self: end;') &&
			heroCardRule.includes('width: min(100%, 42rem);'),
		true,
		'hero card should be a simple right-side overlay panel without a decoration column',
	);
	assert.equal(
		heroCardRule.includes('--tk-hero-corner-cut: clamp(3.8rem, 6vw, 5.2rem);'),
		true,
		'hero card should expose a stable top-right cut size for the smaller panel',
	);
	assert.equal(
		heroCardRule.includes('min-height: clamp(27rem, 52vh, 34.5rem);'),
		true,
		'hero card should be shorter than the previous near-viewport paper sheet',
	);
	assert.equal(
		heroCardRule.includes(
			'padding: clamp(3.25rem, 5.2vw, 4.4rem) clamp(2rem, 4vw, 3.6rem) clamp(2rem, 3.6vw, 3rem);',
		),
		true,
		'hero card content should sit inside the smaller reference panel',
	);
	assert.equal(
		heroRule.includes('background-image: var(--tk-hero-image);') &&
			heroRule.includes('background-position: center;') &&
			heroRule.includes('background-size: cover;'),
		true,
		'hero parent should own the Fuji/woman background image instead of a helper media div',
	);
	assert.equal(
		pageSource.includes('class="takumi-hero__media"') || heroMediaRule.includes('background-image'),
		false,
		'hero should not depend on a child media div for the first-viewport image',
	);
	assert.equal(
		invalidTokenAlphaPattern.test(pageSource),
		false,
		'homepage first-viewport CSS should use valid rgb(var(...) / alpha) token syntax',
	);
	assert.equal(
		heroShadeRule.includes('rgb(var(--tk-color-ink-rgb) / 18%)') &&
			heroShadeRule.includes('rgb(var(--tk-color-ink-rgb) / 4%)') &&
			heroShadeRule.includes('rgb(var(--tk-color-brand-brown-rgb) / 8%)'),
		true,
		'hero shade should render with valid, light opacity instead of globally dimming the photo',
	);
	assert.equal(
		heroPatternRule === '' && heroWaveRule === '',
		true,
		'hero should render without bottom wave or competing asanoha pattern layers',
	);
	assert.equal(
		heroCardRule.includes('rgba(255, 255, 255, 0.18)') &&
			heroCardRule.includes('rgba(255, 255, 255, 0.035)') &&
			heroCardRule.includes("url('/img/takumi-washi-glass/pattern-washi-glass.svg')") &&
			heroCardRule.includes('background-blend-mode: normal, soft-light, soft-light;'),
		true,
		'hero card parent should own the translucent glass layers',
	);
	assert.equal(
		heroCardRule.includes('0 30px 84px rgb(var(--tk-color-ink-rgb) / 18%)'),
		true,
		'hero card parent glass shadow should use valid rgb token alpha syntax',
	);
	assert.equal(
		heroCardSurfaceRule.includes('background-blend-mode: screen'),
		false,
		'hero card should not use screen blending because it reads as opaque white paper',
	);
	assert.equal(
		heroCardSurfaceRule.includes("url('/img/takumi-washi-glass/pattern-washi-glass.svg')") ||
			heroCardSurfaceRule.includes('backdrop-filter:'),
		false,
		'hero card pseudo-element should not own the primary glass surface',
	);
	assert.equal(
		heroCardRule.includes('backdrop-filter: blur(18px) saturate(160%) contrast(102%);'),
		true,
		'hero card parent should use visible frosted-glass blur without smearing the photo into smoke',
	);
	assert.equal(
		heroCardRule.includes('outline:') || heroCardRule.includes('outline-offset:'),
		false,
		'hero card should avoid an inset outline because it creates a double vertical seam through the glass',
	);
	assert.equal(
		heroTreeRule === '' && heroDecorRule === '',
		true,
		'hero should remove the tree decoration entirely instead of trying to layer it above the glass',
	);
	assert.equal(
		heroFooterRule.includes('align-items: flex-end;') &&
			heroFooterRule.includes('display: flex;') &&
			heroFooterRule.includes('grid-area: footer;') &&
			heroFooterRule.includes('justify-content: flex-start;') &&
			heroFooterRule.includes('margin-top: clamp(1.6rem, 3vw, 2.45rem);'),
		true,
		'hero card footer should own only the CTA below the copy',
	);
	assert.equal(
		pageSource.includes('@media (max-width: 980px)') &&
			pageSource.includes('grid-template-columns: 1fr;') &&
			pageSource.includes('justify-items: stretch;') &&
			pageSource.includes('grid-column: 1;') &&
			pageSource.includes('padding-block: clamp(9rem, 38vw, 10rem) 4.6rem;'),
		true,
		'mobile and tablet layouts should collapse below the fixed nav to one readable hero card',
	);
	assert.equal(pageSource.includes('.takumi-hero__scroll'), false);
});

test('homepage hero card uses the reference top-right folded corner spec', async () => {
	const pageSource = await readFile(new URL('../pages/index.vue', import.meta.url), 'utf8');
	const heroCardRule = pageSource.match(/\.takumi-hero-card\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const heroCardTopTabRule =
		pageSource.match(/\.takumi-hero-card::after\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const heroFoldRule = pageSource.match(/\.takumi-hero-card__fold\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const heroBottomTabRule =
		pageSource.match(/\.takumi-hero-card__backing-tab--bottom\s*\{[\s\S]*?\n\}/)?.[0] ?? '';

	for (const expectedSource of [
		'takumi-hero-card__backing-tab takumi-hero-card__backing-tab--bottom',
	]) {
		assert.equal(pageSource.includes(expectedSource), true, expectedSource);
	}

	for (const expectedCornerPoint of [
		'clip-path: polygon(',
		'var(--tk-hero-corner-radius) 0',
		'calc(100% - var(--tk-hero-corner-cut)) 0',
		'100% var(--tk-hero-corner-cut)',
		'100% calc(100% - var(--tk-hero-corner-radius))',
		'calc(100% - var(--tk-hero-corner-radius)) 100%',
		'var(--tk-hero-corner-radius) 100%',
		'0 calc(100% - var(--tk-hero-corner-radius))',
		'0 var(--tk-hero-corner-radius)',
	]) {
		assert.equal(
			heroCardRule.includes(expectedCornerPoint),
			true,
			`card parent surface should include ${expectedCornerPoint}`,
		);
	}
	assert.equal(
		heroCardTopTabRule.includes('right: -1.2rem;') &&
			heroCardTopTabRule.includes('top: clamp(2.35rem, 5vw, 3.65rem);') &&
			heroCardTopTabRule.includes('clip-path: polygon(0 0, 100% 0, 100% 100%, 28% 100%);'),
		true,
		'top-right backing tab should sit behind the diagonal cut',
	);
	assert.equal(
		heroFoldRule.includes('clip-path: polygon(0 0, 100% 100%, 100% 0);') &&
			heroFoldRule.includes('width: var(--tk-hero-corner-cut);'),
		true,
		'top-right fold should align exactly to the corner cut token',
	);
	assert.equal(
		heroBottomTabRule.includes('bottom: -1rem;') &&
			heroBottomTabRule.includes('clip-path: polygon(0 0, 100% 100%, 0 100%);'),
		true,
		'bottom-left backing tab should mirror the reference gold paper tab',
	);
});

test('global nav uses token-colored shell while preserving routes and mobile menu', async () => {
	const navSource = await readFile(new URL('../components/NavMenu.vue', import.meta.url), 'utf8');
	const invalidTokenAlphaPattern = /rgba\(var\(--tk-color-[^)]+-rgb\),\s*[\d.]+\)/;
	const navShellRule = navSource.match(/\.takumi-nav-shell\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const navFrameRule = navSource.match(/\.takumi-nav-frame\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const navSurfaceRule = navSource.match(/\.takumi-nav-surface\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const languageSwitchRule =
		navSource.match(/\.takumi-language-switch\s*\{[\s\S]*?\n\}/)?.[0] ?? '';

	for (const expectedSource of [
		'takumi-nav-shell',
		'takumi-nav-surface',
		'takumi-language-switch',
		'/img/takumi-logo.webp',
		'/img/takumi-washi-glass/icon-globe.svg',
		'<AnnouncementBar',
		"t('seibuFair.announcement.label')",
		"t('links.home')",
		"t('links.halal')",
		"t('links.news')",
		"t('links.knives')",
		"t('links.contact')",
		'mdi:menu',
		'mdi:close',
		'toggleLanguage',
		'isMobileMenuOpen',
		'toggleMobileMenu',
		'closeMobileMenu',
		':aria-expanded="isMobileMenuOpen"',
		'v-show="isMobileMenuOpen"',
		'@click="closeMobileMenu"',
		'getTextColor(links.home)',
		'browserHash',
		'isNavigationHydrated',
		'window.location.hash',
		'getCurrentHash',
		'const [targetPath, targetHash]',
		"currentHash && !target.includes('#')",
		"target.includes('#')",
		'`#${targetHash}` === currentHash',
		'active-class=""',
		'exact-active-class=""',
		'aria-current-value=""',
	]) {
		assert.equal(navSource.includes(expectedSource), true, expectedSource);
	}

	assert.equal(navSource.includes('fixed lg:hidden bottom-0'), false);
	assert.equal(navSource.includes("'/products/'"), false);
	assert.equal(
		navSource.includes('takumi-nav-glass'),
		false,
		'nav class names should not describe the token-colored surface as glass',
	);
	assert.equal(
		navShellRule.includes('background: var(--tk-color-paper);') &&
			navShellRule.includes(
				'border-bottom: 1px solid rgb(var(--tk-color-brand-brown-rgb) / 12%);',
			) &&
			navShellRule.includes('0 12px 30px rgb(var(--tk-color-ink-rgb) / 6%)') &&
			navFrameRule.includes('margin: 0;') &&
			navFrameRule.includes('width: 100%;'),
		true,
		'nav shell should merge with the announcement as one full-width header band',
	);
	assert.equal(
		invalidTokenAlphaPattern.test(navSource),
		false,
		'nav first-viewport CSS should use valid rgb(var(...) / alpha) token syntax',
	);
	assert.equal(
		navSurfaceRule.includes('linear-gradient(135deg') ||
			navSurfaceRule.includes('linear-gradient(118deg') ||
			navSurfaceRule.includes("url('/img/takumi-washi-glass/pattern-washi-glass.svg')") ||
			navSurfaceRule.includes('background-blend-mode:'),
		false,
		'nav glass should not use angled gradient/texture blending because it creates visible vertical bands',
	);
	assert.equal(
		navSurfaceRule.includes('background: transparent;') &&
			navSurfaceRule.includes('border: 0;') &&
			navSurfaceRule.includes('border-radius: 0;') &&
			navSurfaceRule.includes('box-shadow: none;') &&
			navSurfaceRule.includes('margin: 0 auto;') &&
			navSurfaceRule.includes('padding: 16px 0;') &&
			navSurfaceRule.includes('width: min(calc(100% - calc(var(--tk-space-gutter) * 2)), 88rem);'),
		true,
		'nav surface should be a content row inside the full-width shell, not a floating rounded card',
	);
	assert.equal(
		navSurfaceRule.includes('min-height:'),
		false,
		'nav row spacing should come from padding, not min-height',
	);
	assert.equal(
		!navSurfaceRule.includes('backdrop-filter:') &&
			!navSurfaceRule.includes('-webkit-backdrop-filter:') &&
			!languageSwitchRule.includes('backdrop-filter:') &&
			!navSource.includes('@supports not ((backdrop-filter:'),
		true,
		'nav should not use glassmorphism or a glass fallback block',
	);
	assert.match(
		navSource,
		/\.takumi-nav-logo img\s*\{[\s\S]*?height:\s*48px;[\s\S]*?width:\s*auto;/,
	);
});

test('homepage keeps one h1 and standardizes secondary section heading typography', async () => {
	const pageSource = await readFile(new URL('../pages/index.vue', import.meta.url), 'utf8');
	const headingRule = pageSource.match(/\.takumi-section-heading\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
	const h1Matches = pageSource.match(/<h1\b/g) ?? [];

	assert.equal(h1Matches.length, 1, 'homepage should expose a single h1');
	assert.match(
		pageSource,
		/<h1 id="home-hero-title" class="takumi-hero-card__title">[\s\S]*?getHomeList\(\)\.main_title[\s\S]*?<\/h1>/,
	);
	for (const expectedSource of [
		'<h2 class="takumi-section-heading">',
		'<h2 class="takumi-section-heading takumi-section-heading--left">',
		'{{ getHomeList().intro.intro_title }}',
		"{{ $t('news.title') }}",
		'{{ getHomeList().info.info_subtitle }}',
		"{{ $t('corporate.title') }}",
		"{{ $t('contact.title') }}",
	]) {
		assert.equal(pageSource.includes(expectedSource), true, expectedSource);
	}
	assert.equal(
		headingRule.includes('font-size: clamp(2.35rem, 9vw, 4rem);') &&
			headingRule.includes('font-weight: 800;') &&
			headingRule.includes('line-height: 1.05;') &&
			headingRule.includes('text-transform: none;'),
		true,
		'secondary homepage headings should share size, weight, line-height, and capitalization rules',
	);
});

test('global nav contact links keep native hash navigation across pages', async () => {
	const navSource = await readFile(new URL('../components/NavMenu.vue', import.meta.url), 'utf8');

	assert.equal(navSource.includes(':href="getLink(links.contact)"'), true);
	assert.equal(
		navSource.includes('@click.prevent="goToContact"'),
		false,
		'contact links must not suppress the native /#contact anchor jump',
	);
	assert.equal(
		navSource.includes('router.push(getLink(links.contact))'),
		false,
		'contact navigation should not depend on router.push hash scrolling',
	);
	assert.equal(
		navSource.includes('function goToContact()'),
		false,
		'manual contact routing should be removed when native anchor navigation is used',
	);
});

test('homepage contact anchor clears the fixed header after hash navigation', async () => {
	const pageSource = await readFile(new URL('../pages/index.vue', import.meta.url), 'utf8');

	assert.equal(pageSource.includes('class="home-contact-section py-12 bg-neutral"'), true);
	assert.match(
		pageSource,
		/\.home-contact-section\s*\{[\s\S]*?scroll-margin-top:\s*calc\(var\(--tk-fixed-header-height\) \+ 1rem\);/,
	);
});
