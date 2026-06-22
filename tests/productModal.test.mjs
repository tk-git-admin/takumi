import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('product modal uses a semantic responsive dialog with localized controls', async () => {
	const source = await readFile(new URL('../components/ProductModal.vue', import.meta.url), 'utf8');
	const enLocale = await readFile(new URL('../locales/en.json', import.meta.url), 'utf8');
	const jaLocale = await readFile(new URL('../locales/ja.json', import.meta.url), 'utf8');

	for (const expectedSource of [
		'<script setup>',
		'class="product-modal"',
		'role="dialog"',
		'aria-modal="true"',
		'aria-labelledby="product-modal-title"',
		'class="product-modal__close"',
		'type="button"',
		':aria-label="$t(\'product.close\')"',
		':aria-label="$t(\'product.images\')"',
		'class="product-modal__gallery"',
		'class="product-modal__summary"',
		'id="product-modal-title"',
		'class="product-modal__highlight"',
		'class="product-modal__meta"',
		'class="product-modal__description"',
		'class="btn btn-primary product-modal__cta"',
		"{{ $t('product.order') }}",
		"{{ $t('product.soldout') }}",
		'const validImages = computed(() =>',
		'const orderHref = computed(() =>',
		'const productImageAlt = computed(() =>',
		"t('product.orderMessage', { name: productName })",
	]) {
		assert.equal(source.includes(expectedSource), true, expectedSource);
	}

	for (const forbiddenSource of [
		'export default defineComponent',
		'class="carousel-container"',
		'class="carousel-slider"',
		'class="carousel-desc"',
		'class="btn__cta"',
		'class="close"',
		'class="close-img"',
		'/img/close-icon.svg',
		'ORDER</a',
		'SOLD OUT</span>',
		'Hi,I would like to order',
		'Hi, I would like to order',
		'alt="\'Image \' + (index + 1)"',
		'background-color: white;',
		'background-color: #772c1a;',
		'color: red;',
		'border: 5px solid #772c1a;',
	]) {
		assert.equal(source.includes(forbiddenSource), false, forbiddenSource);
	}

	for (const localeSource of [enLocale, jaLocale]) {
		assert.equal(localeSource.includes('"close"'), true, 'localized product close label');
		assert.equal(localeSource.includes('"images"'), true, 'localized product gallery label');
		assert.equal(localeSource.includes('"orderMessage"'), true, 'localized order message');
	}
});

test('product modal controls use Takumi tokens, accessible spacing, and reduced-motion support', async () => {
	const source = await readFile(new URL('../components/ProductModal.vue', import.meta.url), 'utf8');
	const pageSource = await readFile(new URL('../pages/knives.vue', import.meta.url), 'utf8');

	for (const expectedSource of [
		'width: min(calc(100vw - (var(--tk-space-gutter) * 2)), 76rem);',
		'height: min(92svh, 54rem);',
		'padding: clamp(0.75rem, 1.8vw, 1.25rem);',
		'inset-block-start: clamp(0.75rem, 1.8vw, 1.25rem);',
		'inset-inline-end: clamp(0.75rem, 1.8vw, 1.25rem);',
		'background: rgb(var(--tk-color-brand-brown-rgb) / 92%);',
		'color: var(--tk-color-white);',
		':deep(.carousel__prev),',
		':deep(.carousel__next) {',
		'transition:',
		'@keyframes productModalIn',
		'@media (prefers-reduced-motion: reduce)',
		'@media only screen and (max-width: 768px)',
		'grid-template-columns: 1fr;',
		'max-height: min(92svh, 54rem);',
	]) {
		assert.equal(source.includes(expectedSource), true, expectedSource);
	}

	for (const expectedSource of [
		'background-color: rgb(var(--tk-color-ink-rgb) / 62%);',
		'backdrop-filter: blur(8px);',
		'transition: opacity 220ms ease;',
	]) {
		assert.equal(pageSource.includes(expectedSource), true, expectedSource);
	}

	for (const forbiddenSource of [
		'background-color: rgba(0, 0, 0, 0.5);',
		'/* Adjust as needed */',
		'/* Adjust the background color and opacity */',
	]) {
		assert.equal(pageSource.includes(forbiddenSource), false, forbiddenSource);
	}
});

test('product modal gallery preserves control alignment and uncropped product imagery', async () => {
	const source = await readFile(new URL('../components/ProductModal.vue', import.meta.url), 'utf8');

	for (const expectedSource of [
		'ref="carouselElement"',
		'snap-align="start"',
		'<div v-if="validImages.length > 1" class="product-modal__thumbs" role="list">',
		'class="product-modal__thumb-item"',
		'.product-modal__gallery {\n\tdisplay: grid;\n\tgap: clamp(0.75rem, 1.6vw, 1rem);',
		'grid-template-rows: minmax(0, 1fr) auto;',
		'.product-modal__media {\n\taspect-ratio: 4 / 3;',
		'grid-template-columns: repeat(auto-fit, minmax(clamp(4.5rem, 9vw, 7rem), 1fr));',
		'.product-modal__thumb {\n\taspect-ratio: 4 / 3;',
		'object-fit: contain;',
		'carouselElement.value?.updateSlideWidth?.();',
		'window.setTimeout(updateCarouselGeometry, 280);',
	]) {
		assert.equal(source.includes(expectedSource), true, expectedSource);
	}

	for (const forbiddenSource of [
		'object-fit: cover;',
		'id="thumbnails"',
		'grid-template-rows: minmax(0, auto) auto;',
		'transform: translate3d(0, -1px, 0);',
		'transform: translate3d(0, -2px, 0);',
		'transition:\n\ttransition:',
	]) {
		assert.equal(source.includes(forbiddenSource), false, forbiddenSource);
	}
});

test('product modal keeps long descriptions scrollable while preserving thumbnail access', async () => {
	const source = await readFile(new URL('../components/ProductModal.vue', import.meta.url), 'utf8');

	for (const expectedSource of [
		'.product-modal__gallery {\n\tdisplay: grid;',
		'min-height: 0;',
		'overflow: hidden;',
		'.product-modal__carousel {\n\theight: 100%;',
		'.product-modal__thumbs {\n\tdisplay: grid;',
		'max-height: clamp(6.5rem, 24vh, 12rem);',
		'overflow-y: auto;',
		'.product-modal__summary {\n\tdisplay: grid;',
		'overflow: hidden;',
		'.product-modal__details {\n\tdisplay: grid;',
		'overflow-y: auto;',
		'overscroll-behavior: contain;',
		'scrollbar-gutter: stable;',
		'grid-template-rows: auto auto;',
		'.product-modal__carousel,\n\t.product-modal__carousel :deep(.carousel__viewport),',
		'height: auto;',
	]) {
		assert.equal(source.includes(expectedSource), true, expectedSource);
	}

	for (const forbiddenSource of [
		'.product-modal__details {\n\tdisplay: grid;\n\tgap: clamp(0.9rem, 1.8vw, 1.25rem);\n\tmin-height: 0;\n\toverflow: auto;',
	]) {
		assert.equal(source.includes(forbiddenSource), false, forbiddenSource);
	}
});

test('product modal header hierarchy keeps title dominant and highlight secondary', async () => {
	const source = await readFile(new URL('../components/ProductModal.vue', import.meta.url), 'utf8');

	for (const expectedSource of [
		'.product-modal__header {\n\tdisplay: grid;',
		'gap: clamp(0.35rem, 0.9vw, 0.6rem);',
		'.product-modal__brand {\n\tcolor: var(--tk-color-muted);',
		'font-size: clamp(0.72rem, 0.9vw, 0.82rem);',
		'.product-modal__title {\n\tcolor: var(--tk-color-ink);',
		'font-size: clamp(1.65rem, 2.7vw, 2.25rem);',
		'.product-modal__highlight {\n\tbackground: var(--tk-color-rice);',
		'border: 1px solid var(--tk-color-border);',
		'color: var(--tk-color-moss);',
		'font-size: clamp(0.78rem, 1vw, 0.9rem);',
	]) {
		assert.equal(source.includes(expectedSource), true, expectedSource);
	}

	for (const forbiddenSource of [
		'.product-modal__highlight {\n\tbackground: var(--tk-color-moss);',
		'font-size: clamp(0.92rem, 1.35vw, 1.08rem);',
		'padding: 0.68rem 0.85rem;',
		'font-size: clamp(1.75rem, 3.2vw, 2.65rem);',
	]) {
		assert.equal(source.includes(forbiddenSource), false, forbiddenSource);
	}
});
