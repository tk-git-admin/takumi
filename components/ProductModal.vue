<template>
	<article
		ref="modalElement"
		class="product-modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="product-modal-title"
		tabindex="-1"
		@keydown.esc="closeModal">
		<button
			type="button"
			class="product-modal__close"
			:aria-label="$t('product.close')"
			@click="closeModal">
			<span
				class="product-modal__close-line product-modal__close-line--start"
				aria-hidden="true"></span>
			<span
				class="product-modal__close-line product-modal__close-line--end"
				aria-hidden="true"></span>
		</button>

		<section class="product-modal__gallery" :aria-label="$t('product.images')">
			<Carousel
				v-if="validImages.length"
				id="gallery"
				ref="carouselElement"
				class="product-modal__carousel"
				:items-to-show="1"
				snap-align="start"
				:wrap-around="validImages.length > 1"
				v-model="currentSlide">
				<Slide v-for="(image, index) in validImages" :key="image.url">
					<figure class="product-modal__media">
						<img
							:src="modalImage(image.url).src"
							:srcset="modalImage(image.url).srcset"
							:sizes="modalImage(image.url).sizes"
							:width="modalImage(image.url).width"
							:height="modalImage(image.url).height"
							:alt="getImageAlt(index)"
							:loading="index === 0 ? 'eager' : modalImage(image.url).loading"
							:decoding="modalImage(image.url).decoding" />
					</figure>
				</Slide>
				<template #addons>
					<Navigation v-if="validImages.length > 1" />
				</template>
			</Carousel>

			<div v-if="validImages.length > 1" class="product-modal__thumbs" role="list">
				<div
					v-for="(image, index) in validImages"
					:key="`thumb-${image.url}`"
					role="listitem"
					class="product-modal__thumb-item">
					<button
						type="button"
						class="product-modal__thumb"
						:class="{ 'product-modal__thumb--active': currentSlide === index }"
						:aria-current="currentSlide === index ? 'true' : undefined"
						@click="slideTo(index)">
						<img
							:src="modalThumb(image.url).src"
							:srcset="modalThumb(image.url).srcset"
							:sizes="modalThumb(image.url).sizes"
							:width="modalThumb(image.url).width"
							:height="modalThumb(image.url).height"
							:alt="getImageAlt(index)"
							:loading="modalThumb(image.url).loading"
							:decoding="modalThumb(image.url).decoding" />
					</button>
				</div>
			</div>
		</section>

		<section class="product-modal__summary">
			<header class="product-modal__header">
				<p v-if="item?.brand_name" class="product-modal__brand">
					{{ item.brand_name }}
				</p>
				<h2 id="product-modal-title" class="product-modal__title">
					{{ item?.model_name }}
				</h2>
				<p v-if="item?.highlight" class="product-modal__highlight">
					{{ item.highlight }}
				</p>
			</header>

			<div class="product-modal__details">
				<dl class="product-modal__meta">
					<div v-if="item?.blade_length" class="product-modal__meta-row">
						<dt>{{ $t('product.bladeLength') }}</dt>
						<dd>{{ item.blade_length }}</dd>
					</div>
					<div class="product-modal__meta-row">
						<dt>{{ $t('product.price') }}</dt>
						<dd>
							<span>{{ price }}</span>
							<span v-if="normalizedDiscount > 0" class="discount-percent-text">
								-{{ normalizedDiscount }}%
							</span>
						</dd>
					</div>
				</dl>

				<div
					v-if="item?.description"
					class="product-modal__description"
					v-html="item.description" />
			</div>

			<div class="product-modal__actions">
				<button
					v-if="item?.sold_out?.length > 0"
					type="button"
					class="btn product-modal__cta product-modal__cta--disabled"
					disabled>
					{{ $t('product.soldout') }}
				</button>
				<a
					v-else
					class="btn btn-primary product-modal__cta"
					:href="orderHref"
					target="_blank"
					rel="noopener">
					{{ $t('product.order') }}
				</a>
			</div>
		</section>
	</article>
</template>

<script setup>
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Navigation, Slide } from 'vue3-carousel';
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getKurocoImagePreset } from '~/utils/kurocoImage.mjs';

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
	price: {
		type: String,
		default: '',
	},
	discount: {
		type: String,
		default: '',
	},
});

const emit = defineEmits(['close-modal']);
const { t } = useI18n();
const currentSlide = ref(0);
const modalElement = ref(null);
const carouselElement = ref(null);
let carouselRefreshTimer;

const validImages = computed(() =>
	Array.isArray(props.item?.image) ? props.item.image.filter((image) => image?.url) : [],
);

const productImageAlt = computed(() =>
	[props.item?.brand_name, props.item?.model_name, props.item?.blade_length]
		.filter(Boolean)
		.join(' '),
);

const normalizedDiscount = computed(() => {
	const parsedDiscount = Number.parseInt(props.discount, 10);

	return Number.isFinite(parsedDiscount) ? parsedDiscount : 0;
});

const orderHref = computed(() => {
	const productName = [props.item?.brand_name, props.item?.model_name].filter(Boolean).join(' ');
	const message = encodeURIComponent(t('product.orderMessage', { name: productName }).trim());

	return `https://wa.me/+60183875096?text=${message}`;
});

function getImageAlt(index) {
	const baseAlt = productImageAlt.value || props.item?.model_name || t('product.image');

	return validImages.value.length > 1 ? `${baseAlt} ${index + 1}` : baseAlt;
}

function modalImage(src) {
	return getKurocoImagePreset(src, 'modalImage');
}

function modalThumb(src) {
	return getKurocoImagePreset(src, 'modalThumb');
}

function slideTo(index) {
	currentSlide.value = index;
}

function closeModal() {
	emit('close-modal');
}

function updateCarouselGeometry() {
	carouselElement.value?.updateSlideWidth?.();
	carouselElement.value?.updateSlidesData?.();
}

function refreshCarouselGeometry() {
	nextTick(() => {
		window.requestAnimationFrame(updateCarouselGeometry);
		carouselRefreshTimer = window.setTimeout(updateCarouselGeometry, 280);
	});
}

onMounted(() => {
	modalElement.value?.focus();
	refreshCarouselGeometry();
});

onBeforeUnmount(() => {
	if (carouselRefreshTimer) {
		window.clearTimeout(carouselRefreshTimer);
	}
});
</script>

<style scoped>
.product-modal {
	animation: productModalIn 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
	background: var(--tk-color-paper);
	border: 1px solid rgb(var(--tk-color-ink-rgb) / 10%);
	border-radius: 8px;
	box-shadow: 0 1.75rem 4.5rem rgb(var(--tk-color-ink-rgb) / 28%);
	display: grid;
	gap: clamp(1rem, 2.2vw, 1.75rem);
	grid-template-columns: minmax(0, 1.08fr) minmax(20rem, 0.92fr);
	grid-template-rows: minmax(0, 1fr);
	height: min(92svh, 54rem);
	inset: 50% auto auto 50%;
	max-height: min(92svh, 54rem);
	outline: none;
	overflow: hidden;
	padding: clamp(0.75rem, 1.8vw, 1.25rem);
	position: fixed;
	transform: translate3d(-50%, -50%, 0);
	width: min(calc(100vw - (var(--tk-space-gutter) * 2)), 76rem);
	z-index: 9999;
}

.product-modal__close {
	align-items: center;
	background: rgb(var(--tk-color-white-rgb) / 92%);
	border: 1px solid rgb(var(--tk-color-brand-brown-rgb) / 18%);
	border-radius: 999px;
	box-shadow: 0 0.75rem 1.75rem rgb(var(--tk-color-ink-rgb) / 14%);
	color: var(--tk-color-brand-brown);
	cursor: pointer;
	display: grid;
	height: clamp(2.5rem, 4vw, 3rem);
	inset-block-start: clamp(0.75rem, 1.8vw, 1.25rem);
	inset-inline-end: clamp(0.75rem, 1.8vw, 1.25rem);
	justify-items: center;
	padding: 0;
	position: absolute;
	transition:
		background-color 180ms ease,
		border-color 180ms ease,
		box-shadow 180ms ease,
		color 180ms ease,
		transform 180ms ease;
	width: clamp(2.5rem, 4vw, 3rem);
	z-index: 4;
}

.product-modal__close:hover,
.product-modal__close:focus-visible {
	background: var(--tk-color-brand-brown);
	border-color: rgb(var(--tk-color-event-gold-rgb) / 46%);
	box-shadow: 0 1rem 2rem rgb(var(--tk-color-ink-rgb) / 18%);
	color: var(--tk-color-white);
}

.product-modal__close:focus-visible {
	outline: 3px solid rgb(var(--tk-color-event-gold-rgb) / 72%);
	outline-offset: 3px;
}

.product-modal__close-line {
	background: currentColor;
	border-radius: 999px;
	display: block;
	grid-area: 1 / 1;
	height: 2px;
	width: 1.12rem;
}

.product-modal__close-line--start {
	transform: rotate(45deg);
}

.product-modal__close-line--end {
	transform: rotate(-45deg);
}

.product-modal__gallery {
	display: grid;
	gap: clamp(0.75rem, 1.6vw, 1rem);
	grid-template-rows: minmax(0, 1fr) auto;
	min-height: 0;
	min-width: 0;
	overflow: hidden;
}

.product-modal__carousel,
.product-modal__thumbs {
	min-width: 0;
}

.product-modal__carousel {
	height: 100%;
	min-height: 0;
	overflow: hidden;
}

.product-modal__carousel :deep(.carousel__viewport),
.product-modal__carousel :deep(.carousel__track),
.product-modal__carousel :deep(.carousel__slide) {
	height: 100%;
}

.product-modal__thumbs {
	display: grid;
	gap: clamp(0.35rem, 0.9vw, 0.55rem);
	grid-template-columns: repeat(auto-fit, minmax(clamp(4.5rem, 9vw, 7rem), 1fr));
	max-height: clamp(6.5rem, 24vh, 12rem);
	overflow-y: auto;
	padding-inline-end: 0.15rem;
	scrollbar-gutter: stable;
}

.product-modal__thumb-item {
	min-width: 0;
}

.product-modal__media {
	aspect-ratio: 4 / 3;
	background: var(--tk-color-sumi);
	height: 100%;
	margin: 0;
	max-height: 100%;
	overflow: hidden;
	width: 100%;
}

.product-modal__media img,
.product-modal__thumb img {
	display: block;
	height: 100%;
	object-fit: contain;
	width: 100%;
}

.product-modal__thumb {
	aspect-ratio: 4 / 3;
	background: var(--tk-color-sumi);
	border: 2px solid transparent;
	cursor: pointer;
	display: block;
	opacity: 0.72;
	overflow: hidden;
	padding: 0;
	transition:
		border-color 180ms ease,
		opacity 180ms ease,
		transform 180ms ease;
	width: 100%;
}

.product-modal__thumb:focus-visible,
.product-modal__thumb--active {
	border-color: var(--tk-color-brand-brown);
	opacity: 1;
}

.product-modal__thumb:focus-visible {
	outline: 3px solid rgb(var(--tk-color-event-gold-rgb) / 72%);
	outline-offset: 3px;
}

:deep(.carousel__prev),
:deep(.carousel__next) {
	background: rgb(var(--tk-color-brand-brown-rgb) / 92%);
	border: 1px solid rgb(var(--tk-color-white-rgb) / 42%);
	border-radius: 999px;
	box-shadow: 0 0.85rem 1.8rem rgb(var(--tk-color-ink-rgb) / 26%);
	color: var(--tk-color-white);
	height: clamp(2.75rem, 4vw, 3.25rem);
	transition:
		background-color 180ms ease,
		border-color 180ms ease,
		box-shadow 180ms ease,
		color 180ms ease,
		transform 180ms ease;
	width: clamp(2.75rem, 4vw, 3.25rem);
}

:deep(.carousel__prev:focus-visible),
:deep(.carousel__next:focus-visible) {
	background: var(--tk-color-brand-brown);
	border-color: rgb(var(--tk-color-event-gold-rgb) / 58%);
	box-shadow: 0 1rem 2.1rem rgb(var(--tk-color-ink-rgb) / 32%);
	color: var(--tk-color-white);
}

:deep(.carousel__prev:focus-visible),
:deep(.carousel__next:focus-visible) {
	outline: 3px solid rgb(var(--tk-color-event-gold-rgb) / 72%);
	outline-offset: 3px;
}

:deep(.carousel__icon) {
	fill: currentColor;
}

.product-modal__summary {
	display: grid;
	gap: clamp(1rem, 2vw, 1.35rem);
	grid-template-rows: auto minmax(0, 1fr) auto;
	min-height: 0;
	overflow: hidden;
	padding: clamp(0.35rem, 1vw, 0.65rem) clamp(0.45rem, 1.4vw, 0.9rem) clamp(0.35rem, 1vw, 0.65rem) 0;
}

.product-modal__header {
	display: grid;
	gap: clamp(0.35rem, 0.9vw, 0.6rem);
	padding-inline-end: clamp(3rem, 5vw, 3.75rem);
}

.product-modal__brand {
	color: var(--tk-color-muted);
	font-size: clamp(0.72rem, 0.9vw, 0.82rem);
	font-weight: 700;
	line-height: 1.1;
	margin: 0;
}

.product-modal__title {
	color: var(--tk-color-ink);
	font-size: clamp(1.65rem, 2.7vw, 2.25rem);
	font-weight: 700;
	letter-spacing: 0;
	line-height: 1.05;
	margin: 0;
	text-wrap: balance;
}

.product-modal__highlight {
	background: var(--tk-color-rice);
	border: 1px solid var(--tk-color-border);
	color: var(--tk-color-moss);
	font-size: clamp(0.78rem, 1vw, 0.9rem);
	font-weight: 700;
	justify-self: start;
	line-height: 1.15;
	margin: 0;
	max-width: 100%;
	padding: 0.42rem 0.62rem;
	text-wrap: balance;
}

.product-modal__details {
	display: grid;
	gap: clamp(0.9rem, 1.8vw, 1.25rem);
	min-height: 0;
	overflow-y: auto;
	overscroll-behavior: contain;
	padding-inline-end: clamp(0.35rem, 1vw, 0.65rem);
	scrollbar-gutter: stable;
}

.product-modal__meta {
	border-block: 1px solid rgb(var(--tk-color-ink-rgb) / 10%);
	display: grid;
	gap: 0;
	margin: 0;
	padding-block: 0.25rem;
}

.product-modal__meta-row {
	align-items: baseline;
	display: grid;
	gap: 0.75rem;
	grid-template-columns: minmax(6rem, 0.42fr) minmax(0, 1fr);
	padding-block: 0.55rem;
}

.product-modal__meta dt {
	color: var(--tk-color-muted);
	font-size: 0.78rem;
	font-weight: 700;
	line-height: 1.25;
	margin: 0;
}

.product-modal__meta dd {
	color: var(--tk-color-ink);
	font-size: clamp(0.9rem, 1.15vw, 1rem);
	font-weight: 700;
	line-height: 1.25;
	margin: 0;
}

.product-modal__description {
	color: var(--tk-color-ink);
	font-size: clamp(0.95rem, 1.15vw, 1.04rem);
	line-height: 1.62;
}

.product-modal__description :deep(h2),
.product-modal__description :deep(h3),
.product-modal__description :deep(strong) {
	color: var(--tk-color-ink);
	font-weight: 700;
}

.product-modal__description :deep(h2),
.product-modal__description :deep(h3) {
	font-size: clamp(1.05rem, 1.45vw, 1.18rem);
	line-height: 1.25;
	margin: 0 0 0.65rem;
}

.product-modal__description :deep(p) {
	margin: 0 0 0.8rem;
}

.product-modal__description :deep(ul),
.product-modal__description :deep(ol) {
	margin: 0 0 0.9rem;
	padding-inline-start: 1.1rem;
}

.product-modal__description :deep(li + li) {
	margin-top: 0.4rem;
}

.discount-percent-text {
	background: rgb(var(--tk-color-event-red-rgb) / 8%);
	border-radius: 999px;
	color: var(--tk-color-event-red);
	display: inline-flex;
	font-size: 0.76rem;
	font-weight: 700;
	line-height: 1;
	margin-inline-start: 0.45rem;
	padding: 0.28rem 0.42rem;
}

.product-modal__actions {
	border-top: 1px solid rgb(var(--tk-color-ink-rgb) / 10%);
	padding-top: clamp(0.8rem, 1.6vw, 1.05rem);
}

.product-modal__cta {
	min-height: 3.15rem;
	width: min(100%, 18rem);
}

.product-modal__cta--disabled {
	background: var(--tk-color-border);
	border-color: rgb(var(--tk-color-ink-rgb) / 10%);
	color: var(--tk-color-muted);
	cursor: not-allowed;
	font-weight: 700;
}

@keyframes productModalIn {
	from {
		opacity: 0;
		transform: translate3d(-50%, -50%, 0) translateY(0.75rem) scale(0.985);
	}

	to {
		opacity: 1;
		transform: translate3d(-50%, -50%, 0) scale(1);
	}
}

@media only screen and (max-width: 768px) {
	.product-modal {
		gap: 1rem;
		grid-template-columns: 1fr;
		grid-template-rows: auto auto;
		height: auto;
		max-height: calc(100svh - 1rem);
		overflow-y: auto;
		padding: clamp(0.75rem, 3vw, 1rem);
		width: min(calc(100vw - 1rem), 42rem);
	}

	.product-modal__media {
		aspect-ratio: 4 / 3;
		height: auto;
		max-height: none;
	}

	.product-modal__carousel,
	.product-modal__carousel :deep(.carousel__viewport),
	.product-modal__carousel :deep(.carousel__track),
	.product-modal__carousel :deep(.carousel__slide) {
		height: auto;
	}

	.product-modal__summary {
		grid-template-rows: auto auto auto;
		padding: 0;
	}

	.product-modal__details {
		overflow: visible;
		padding-inline-end: 0;
	}

	.product-modal__header {
		padding-inline-end: clamp(3rem, 11vw, 3.5rem);
	}

	.product-modal__meta-row {
		grid-template-columns: 1fr;
		gap: 0.25rem;
	}

	.product-modal__cta {
		width: 100%;
	}
}

@media (hover: hover) and (pointer: fine) {
	.product-modal__thumb:hover {
		opacity: 1;
	}

	:deep(.carousel__prev:hover),
	:deep(.carousel__next:hover) {
		background: var(--tk-color-brand-brown);
		border-color: rgb(var(--tk-color-event-gold-rgb) / 58%);
		box-shadow: 0 1rem 2.1rem rgb(var(--tk-color-ink-rgb) / 32%);
		color: var(--tk-color-white);
	}
}

@media (prefers-reduced-motion: reduce) {
	.product-modal {
		animation: none;
	}

	.product-modal__close,
	.product-modal__thumb,
	:deep(.carousel__prev),
	:deep(.carousel__next) {
		transition: none;
	}

	.product-modal__close:hover,
	.product-modal__close:focus-visible,
	.product-modal__thumb:hover,
	.product-modal__thumb:focus-visible,
	.product-modal__thumb--active,
	:deep(.carousel__prev:hover),
	:deep(.carousel__next:hover),
	:deep(.carousel__prev:focus-visible),
	:deep(.carousel__next:focus-visible) {
		transform: none;
	}
}
</style>
