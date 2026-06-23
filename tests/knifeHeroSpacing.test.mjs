import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('knife hero uses the shared full-height plain page hero contract', async () => {
	const tokensSource = await readFile(new URL('../assets/css/tokens.css', import.meta.url), 'utf8');
	const pageSource = await readFile(new URL('../pages/knives.vue', import.meta.url), 'utf8');
	const mainCss = await readFile(new URL('../assets/css/main.css', import.meta.url), 'utf8');

	for (const token of [
		'--tk-nav-announcement-height: 3rem;',
		'--tk-nav-row-height: 5rem;',
		'--tk-fixed-header-height: calc(var(--tk-nav-announcement-height) + var(--tk-nav-row-height));',
		'--tk-page-hero-top-clearance: calc(var(--tk-fixed-header-height) + clamp(1rem, 2.5vw, 1.75rem));',
	]) {
		assert.equal(tokensSource.includes(token), true, token);
	}

	assert.equal(pageSource.includes('class="main-section top no-hero wf-section mt-20"'), false);
	assert.equal(pageSource.includes('class="main-section top no-hero wf-section knife-page"'), true);
	assert.equal(pageSource.includes('class="page-hero page-hero--plain"'), true);
	assert.equal(pageSource.includes('page-hero--compact'), false);
	assert.equal(pageSource.includes(':style="knivesHeroStyle"'), true);
	assert.equal(pageSource.includes("'--page-hero-image': `url(${images.bannerTop})`"), true);
	assert.equal(pageSource.includes('aria-labelledby="knives-hero-title"'), true);
	assert.equal(pageSource.includes('class="page-hero__title"'), true);
	assert.equal(pageSource.includes('class="page-hero__description"'), true);
	assert.equal(pageSource.includes('class="page-hero__eyebrow"'), false);
	assert.equal(mainCss.includes('min-height: max(34rem, 72svh);'), true);
	assert.equal(mainCss.includes('.page-hero--compact'), false);
	assert.equal(mainCss.includes('min-height: clamp(15.5rem, 24vw, 18rem);'), false);
	assert.equal(mainCss.includes('.page-hero--plain .page-hero__content::before'), true);
});

test('knife hero centers mobile copy without horizontal overflow or an orphan marker', async () => {
	const pageSource = await readFile(new URL('../pages/knives.vue', import.meta.url), 'utf8');
	const mainCss = await readFile(new URL('../assets/css/main.css', import.meta.url), 'utf8');

	for (const expectedSource of [
		'text-align: center;',
		'width: min(100%, 58rem);',
		'text-wrap: balance;',
		'background: linear-gradient(180deg, rgb(0 0 0 / 52%), rgb(0 0 0 / 64%));',
		'.page-hero--plain .page-hero__content::before {\n\tdisplay: none;\n}',
	]) {
		assert.equal(mainCss.includes(expectedSource), true, expectedSource);
	}

	for (const removedSource of [
		'class="top__banner"',
		'class="heading__h1"',
		'class="heading__h2"',
		'.top__banner',
		'.heading__h2',
		'rgb(var(--tk-color-brand-brown-rgb) / 30%)',
	]) {
		assert.equal(pageSource.includes(removedSource), false, removedSource);
		assert.equal(mainCss.includes(removedSource), false, removedSource);
	}
});

test('knife product cards use a compact responsive grid instead of fixed flex spacing', async () => {
	const pageSource = await readFile(new URL('../pages/knives.vue', import.meta.url), 'utf8');

	for (const expectedSource of [
		'class="w-container knife-products-container mb-20"',
		'class="knife-products-grid"',
		'class="knife-product-card"',
		'class="knife-product-card__image"',
		'class="knife-product-card__content"',
		'class="knife-product-card__model"',
		'display: grid;',
		'grid-template-columns: repeat(4, minmax(0, 1fr));',
		'gap: clamp(0.75rem, 1.6vw, 1.25rem);',
		'width: min(calc(100% - 2rem), var(--tk-content-max));',
		'aspect-ratio: 1 / 1;',
		'grid-template-columns: repeat(3, minmax(0, 1fr));',
		'@media only screen and (max-width: 640px)',
		'grid-template-columns: repeat(2, minmax(0, 1fr));',
		'grid-template-columns: 1fr;',
	]) {
		assert.equal(pageSource.includes(expectedSource), true, expectedSource);
	}

	for (const removedSource of [
		'class="flex-wrapper"',
		'class="box product"',
		'class="box-image"',
		'class="product__content"',
		'class="product_brand_name"',
		'.flex-wrapper',
		'flex-basis: calc(25% - 20px);',
		'flex-basis: calc(50% - 10px);',
		'min-height: 60px;',
	]) {
		assert.equal(pageSource.includes(removedSource), false, removedSource);
	}
});

test('knife product cards use mapped Kuroco fields with CSS-driven hover motion', async () => {
	const pageSource = await readFile(new URL('../pages/knives.vue', import.meta.url), 'utf8');

	for (const expectedSource of [
		':src="knifeCardImage(item.image[0].url).src"',
		':srcset="knifeCardImage(item.image[0].url).srcset"',
		':sizes="knifeCardImage(item.image[0].url).sizes"',
		'v-if="item.image[1]?.url"',
		':src="knifeCardImage(item.image[1].url).src"',
		':loading="knifeCardImage(item.image[1].url).loading"',
		"getKurocoImagePreset(src, 'knifeCard')",
		"{{ $t('product.view') }}",
		"{{ $t('product.soldout') }}",
		'.knife-product-card__image-layer--secondary',
		'.knife-product-card__hover-action',
		'type="button"',
		'class="btn btn-primary knife-product-card__hover-action"',
		'@click.stop="openKnifeModal(item)"',
		'const isShowModal = ref(false);',
		'function openKnifeModal(item) {',
		'inset: 50% auto auto 50%;',
		'transform: translate3d(-50%, -50%, 0) scale(0.96);',
		'transform: translate3d(-50%, -50%, 0) scale(1);',
		'@media (prefers-reduced-motion: reduce)',
		'transition-duration: 1ms;',
		'transform: translate3d(0, -6px, 0);',
	]) {
		assert.equal(pageSource.includes(expectedSource), true, expectedSource);
	}

	for (const removedSource of [
		'@mouseover="showPreview(index)"',
		'@mouseleave="showPreview(index, false)"',
		'item.displayImage',
		'item.isPreview',
		'function showPreview',
		'function initKnivesProp',
		'<span v-if="item.sold_out.length > 0">Sold Out</span>',
		'<span class="btn btn-primary knife-product-card__hover-action">',
		'bottom: clamp(0.75rem, 2.2vw, 1rem);',
		'calc(-50% + 0.75rem)',
		'pointer-events: none;',
		'export default defineComponent',
	]) {
		assert.equal(pageSource.includes(removedSource), false, removedSource);
	}
});

test('knife product cards separate brand, model, option, and price hierarchy', async () => {
	const pageSource = await readFile(new URL('../pages/knives.vue', import.meta.url), 'utf8');

	for (const expectedSource of [
		'grid-template-rows: auto auto;',
		'gap: clamp(0.55rem, 1.1vw, 0.8rem);',
		'.knife-product-card__brand {\n\tcolor: var(--tk-color-muted) !important;',
		'font-size: clamp(0.72rem, 0.9vw, 0.82rem);',
		'.knife-product-card__model {\n\tcolor: var(--tk-color-sumi) !important;',
		'font-size: clamp(0.98rem, 1.25vw, 1.1rem);',
		'.knife-product-card__meta {\n\talign-content: start;',
		'padding-top: clamp(0.15rem, 0.6vw, 0.35rem);',
		'.knife-product-card__attribute {\n\tbackground: transparent;',
		'padding: 0.18rem 0;',
		'.knife-product-card__price {\n\talign-items: baseline;',
		'border-top: 1px solid rgb(var(--tk-color-ink-rgb) / 9%);',
		'font-size: clamp(1.02rem, 1.35vw, 1.18rem);',
	]) {
		assert.equal(pageSource.includes(expectedSource), true, expectedSource);
	}

	for (const removedSource of [
		'.knife-product-card__brand,\n.knife-product-card__model,\n.price',
		'align-content: end;',
		'padding: 0.3rem 0.55rem;',
		'font-weight: 850;',
		'font-weight: 900;',
	]) {
		assert.equal(pageSource.includes(removedSource), false, removedSource);
	}
});
