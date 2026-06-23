<template>
	<div>
		<div class="main-section top no-hero wf-section knife-page">
			<section
				class="page-hero page-hero--plain"
				:style="knivesHeroStyle"
				aria-labelledby="knives-hero-title">
				<div class="page-hero__shade">
					<div class="page-hero__content">
						<h1 id="knives-hero-title" class="page-hero__title">
							{{ $t('knivesBanner.title') }}
						</h1>
						<p class="page-hero__description">
							{{ $t('knivesBanner.detail') }}
						</p>
					</div>
				</div>
			</section>
			<div class="w-container knife-products-container mb-20">
				<div class="knife-products-grid">
					<div
						v-for="(item, index) in getKnivesList()"
						:key="index"
						class="knife-product-card"
						role="button"
						tabindex="0"
						:aria-label="`${$t('product.view')}: ${item.brand_name} ${item.model_name} ${
							item.blade_length
						}`"
						@click="openKnifeModal(item)"
						@keydown.enter.prevent="openKnifeModal(item)"
						@keydown.space.prevent="openKnifeModal(item)">
						<div v-if="item.image[0]?.url" class="knife-product-card__image">
							<img
								class="knife-product-card__image-layer knife-product-card__image-layer--primary"
								:src="knifeCardImage(item.image[0].url).src"
								:srcset="knifeCardImage(item.image[0].url).srcset"
								:sizes="knifeCardImage(item.image[0].url).sizes"
								:width="knifeCardImage(item.image[0].url).width"
								:height="knifeCardImage(item.image[0].url).height"
								:loading="knifeCardImage(item.image[0].url).loading"
								:decoding="knifeCardImage(item.image[0].url).decoding"
								:alt="`${item.brand_name} ${item.model_name} ${item.blade_length}`" />
							<img
								v-if="item.image[1]?.url"
								class="knife-product-card__image-layer knife-product-card__image-layer--secondary"
								:src="knifeCardImage(item.image[1].url).src"
								:srcset="knifeCardImage(item.image[1].url).srcset"
								:sizes="knifeCardImage(item.image[1].url).sizes"
								:width="knifeCardImage(item.image[1].url).width"
								:height="knifeCardImage(item.image[1].url).height"
								alt=""
								aria-hidden="true"
								:loading="knifeCardImage(item.image[1].url).loading"
								:decoding="knifeCardImage(item.image[1].url).decoding" />
							<span class="knife-product-card__image-shade" aria-hidden="true"></span>
							<button
								type="button"
								class="btn btn-primary knife-product-card__hover-action"
								@click.stop="openKnifeModal(item)">
								{{ $t('product.view') }}
							</button>
						</div>
						<div
							v-if="item.label.label || item.sold_out.length > 0"
							class="knife-product-card__tag">
							<span v-if="item.sold_out.length > 0">{{ $t('product.soldout') }}</span>
							<span v-else>{{ item.label.label }}</span>
						</div>

						<div class="knife-product-card__content">
							<div class="knife-product-card__title">
								<h2 class="knife-product-card__brand">{{ item.brand_name }}</h2>
								<h2 class="knife-product-card__model">
									{{ item.model_name }} {{ item.blade_length }}
								</h2>
							</div>
							<div class="knife-product-card__meta">
								<p v-if="item.color_options" class="knife-product-card__attribute">
									{{ item.color_options }}
								</p>
								<p class="knife-product-card__price price">
									<span>{{ formatPrice(item.selling_price) }}</span>
									<span v-if="item.selling_price < item.retail_price" class="discount-percent-text">
										-{{ calculateDiscount(item.selling_price, item.retail_price) }}%
									</span>
								</p>
								<p v-if="item.selling_price < item.retail_price" class="retail-price">
									{{ formatPrice(item.retail_price) }}
								</p>
								<a
									v-if="item.more_info_link?.url"
									class="knife-product-card__link"
									target="_blank"
									rel="noopener"
									:href="item.more_info_link.url"
									@click.stop>
									{{ item.more_info_link.title }}
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<Transition name="product-modal-fade">
			<div v-if="isShowModal" @click="hideModal()" class="carousel-overlay"></div>
		</Transition>
		<Transition name="product-modal-shell">
			<ProductModal
				v-if="isShowModal"
				:price="price"
				:discount="discount"
				:item="modalItem"
				@close-modal="isShowModal = false" />
		</Transition>
	</div>
</template>

<script setup>
import ProductModal from '~/components/ProductModal.vue';
import { useKnives } from '~/store/knives';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getKurocoImagePreset } from '~/utils/kurocoImage.mjs';

const { locale, t } = useI18n();
const isShowModal = ref(false);
const price = ref('');
const discount = ref('');
const modalItem = ref({});

const images = {
	bannerTop: '/img/knives_banner.png',
	gShockBanner: '/img/g-shock_banner.png',
};
const knivesHeroStyle = {
	'--page-hero-image': `url(${images.bannerTop})`,
};
// const props = defineProps(['images']);

const knivesList = useKnives();
function getKnivesList() {
	// console.log(knivesList.getList(locale.value))
	return knivesList.getList(locale.value);
}

function knifeCardImage(src) {
	return getKurocoImagePreset(src, 'knifeCard');
}

function formatPrice(price) {
	return `RM${formatNumber(price)}`;
}

function calculateDiscount(sellingPrice, retailPrice) {
	if (parseFloat(sellingPrice) < parseFloat(retailPrice)) {
		const discountPercentage = (((retailPrice - sellingPrice) / retailPrice) * 100).toFixed(0);
		return `${discountPercentage}`;
	}
	return '';
}

function formatNumber(number) {
	return parseFloat(number).toFixed(2);
}

function showModal(priceValue, discountValue, item) {
	isShowModal.value = true;
	price.value = priceValue;
	discount.value = discountValue;
	modalItem.value = item;
}

function hideModal() {
	isShowModal.value = false;
}

function openKnifeModal(item) {
	showModal(
		formatPrice(item.selling_price),
		calculateDiscount(item.selling_price, item.retail_price),
		item,
	);
}

useSeoMeta({
	title: t('seo.title'),
	ogTitle: t('seo.ogTitle'),
	description: t('seo.description'),
	ogDescription: t('seo.ogDescription'),
	ogImage: '/img/takumi-ogp.png',
	twitterCard: t('seo.twitterCard'),
});
</script>

<style scoped>
.knife-products-container {
	margin-top: clamp(1rem, 3vw, 2rem);
	max-width: var(--tk-content-max);
	width: min(calc(100% - 2rem), var(--tk-content-max));
}

.knife-products-grid {
	align-items: stretch;
	display: grid;
	gap: clamp(0.75rem, 1.6vw, 1.25rem);
	grid-template-columns: repeat(4, minmax(0, 1fr));
	width: 100%;
}

.knife-product-card {
	background: linear-gradient(180deg, rgb(var(--tk-color-white-rgb) / 92%), var(--tk-color-paper)),
		var(--tk-color-paper);
	border: 1px solid rgb(var(--tk-color-ink-rgb) / 11%);
	border-radius: 8px;
	box-shadow:
		0 0.65rem 1.6rem rgb(var(--tk-color-ink-rgb) / 8%),
		0 0.08rem 0 rgb(var(--tk-color-white-rgb) / 80%) inset;
	cursor: pointer;
	display: grid;
	grid-template-rows: auto 1fr;
	isolation: isolate;
	min-width: 0;
	overflow: hidden;
	position: relative;
	transition:
		background-color 220ms ease,
		border-color 220ms ease,
		box-shadow 260ms ease,
		transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.knife-product-card:hover,
.knife-product-card:focus-visible {
	border-color: rgb(var(--tk-color-brand-brown-rgb) / 32%);
	box-shadow:
		0 1.2rem 2.8rem rgb(var(--tk-color-ink-rgb) / 15%),
		0 0 0 1px rgb(var(--tk-color-event-gold-rgb) / 18%) inset;
	transform: translate3d(0, -6px, 0);
}

.knife-product-card:focus-visible {
	outline: 3px solid rgb(var(--tk-color-event-gold-rgb) / 70%);
	outline-offset: 3px;
}

.knife-product-card__image {
	aspect-ratio: 1 / 1;
	background: linear-gradient(
			135deg,
			rgb(var(--tk-color-ink-rgb) / 94%),
			rgb(var(--tk-color-ink-rgb) / 72%)
		),
		var(--tk-color-sumi);
	overflow: hidden;
	position: relative;
}

.knife-product-card__image::after {
	background: linear-gradient(
		120deg,
		transparent 0%,
		rgb(var(--tk-color-white-rgb) / 0%) 38%,
		rgb(var(--tk-color-white-rgb) / 28%) 50%,
		rgb(var(--tk-color-white-rgb) / 0%) 62%,
		transparent 100%
	);
	content: '';
	inset: 0;
	opacity: 0;
	position: absolute;
	transform: translate3d(-40%, 0, 0);
	transition:
		opacity 260ms ease,
		transform 650ms cubic-bezier(0.2, 0.8, 0.2, 1);
	z-index: 2;
}

.knife-product-card__image-layer {
	display: block;
	height: 100%;
	object-fit: cover;
	position: absolute;
	inset: 0;
	transition:
		opacity 280ms ease,
		transform 520ms cubic-bezier(0.2, 0.8, 0.2, 1);
	width: 100%;
}

.knife-product-card__image-layer--primary {
	z-index: 0;
}

.knife-product-card__image-layer--secondary {
	opacity: 0;
	z-index: 1;
}

.knife-product-card__image-shade {
	background: linear-gradient(
		180deg,
		rgb(var(--tk-color-ink-rgb) / 0%) 34%,
		rgb(var(--tk-color-ink-rgb) / 48%) 100%
	);
	inset: 0;
	opacity: 0;
	position: absolute;
	transition: opacity 260ms ease;
	z-index: 1;
}

.knife-product-card__hover-action {
	box-shadow: 0 0.8rem 1.4rem rgb(var(--tk-color-ink-rgb) / 26%);
	inset: 50% auto auto 50%;
	left: 50%;
	opacity: 0;
	position: absolute;
	transform: translate3d(-50%, -50%, 0) scale(0.96);
	transition:
		opacity 220ms ease,
		transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
	white-space: nowrap;
	z-index: 3;
}

.knife-product-card__content {
	display: grid;
	gap: clamp(0.55rem, 1.1vw, 0.8rem);
	grid-template-rows: auto auto;
	padding: clamp(0.85rem, 1.35vw, 1.1rem);
}

.knife-product-card__title {
	display: grid;
	gap: 0.2rem;
}

.knife-product-card__brand {
	color: var(--tk-color-muted) !important;
	font-size: clamp(0.72rem, 0.9vw, 0.82rem);
	font-weight: 700;
	line-height: 1.15;
	margin: 0 !important;
	text-align: left;
}

.knife-product-card__model {
	color: var(--tk-color-sumi) !important;
	font-size: clamp(0.98rem, 1.25vw, 1.1rem);
	font-weight: 700;
	line-height: 1.2;
	margin: 0 !important;
	text-align: left;
	text-wrap: balance;
}

.knife-product-card__meta {
	align-content: start;
	color: var(--tk-color-muted);
	display: grid;
	font-size: clamp(0.78rem, 1vw, 0.92rem);
	gap: 0.42rem;
	line-height: 1.35;
	padding-top: clamp(0.15rem, 0.6vw, 0.35rem);
}

.knife-product-card__meta p,
.knife-product-card__meta a {
	color: inherit;
	display: block;
	margin: 0;
}

.knife-product-card__attribute {
	background: transparent;
	border: 0;
	color: var(--tk-color-muted);
	font-size: clamp(0.72rem, 0.9vw, 0.82rem);
	justify-self: start;
	max-width: 100%;
	overflow: hidden;
	padding: 0.18rem 0;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.knife-product-card__price {
	align-items: baseline;
	border-top: 1px solid rgb(var(--tk-color-ink-rgb) / 9%);
	color: var(--tk-color-sumi) !important;
	display: flex !important;
	font-size: clamp(1.02rem, 1.35vw, 1.18rem);
	flex-wrap: wrap;
	font-weight: 800;
	gap: 0.4rem;
	line-height: 1.1;
	margin: 0 !important;
	padding-top: clamp(0.48rem, 1vw, 0.65rem);
	text-align: left;
}

.retail-price {
	color: rgb(var(--tk-color-ink-rgb) / 55%);
	text-decoration: line-through;
	text-decoration-thickness: auto;
}

.discount-percent-text {
	background: rgb(var(--tk-color-event-red-rgb) / 8%);
	border-radius: 999px;
	color: var(--tk-color-event-red);
	display: inline-flex;
	font-weight: bold;
	line-height: 1;
	padding: 0.24rem 0.42rem;
}

.knife-product-card__link {
	color: var(--tk-color-brand-brown) !important;
	font-weight: 700;
	text-decoration: underline;
	text-decoration-color: rgb(var(--tk-color-brand-brown-rgb) / 28%);
	text-underline-offset: 0.18em;
}

.knife-product-card__tag {
	-webkit-backdrop-filter: blur(14px);
	backdrop-filter: blur(14px);
	background: rgb(var(--tk-color-white-rgb) / 84%);
	border: 1px solid rgb(var(--tk-color-white-rgb) / 64%);
	border-radius: 999px;
	box-shadow: 0 0.6rem 1.2rem rgb(var(--tk-color-ink-rgb) / 14%);
	color: var(--tk-color-ink);
	font-size: clamp(0.7rem, 0.92vw, 0.82rem);
	font-weight: 800;
	left: 0.7rem;
	line-height: 1;
	padding: 0.45rem 0.6rem;
	position: absolute;
	top: 0.7rem;
	width: fit-content;
	z-index: 4;
}

@media (hover: hover) {
	.knife-product-card:hover .knife-product-card__image::after {
		opacity: 1;
		transform: translate3d(38%, 0, 0);
	}

	.knife-product-card:hover .knife-product-card__image-layer,
	.knife-product-card:focus-visible .knife-product-card__image-layer {
		transform: scale(1.045);
	}

	.knife-product-card:hover .knife-product-card__image-layer--secondary,
	.knife-product-card:focus-visible .knife-product-card__image-layer--secondary {
		opacity: 1;
	}

	.knife-product-card:hover .knife-product-card__image-shade,
	.knife-product-card:focus-visible .knife-product-card__image-shade {
		opacity: 1;
	}

	.knife-product-card:hover .knife-product-card__hover-action,
	.knife-product-card:focus-visible .knife-product-card__hover-action,
	.knife-product-card:focus-within .knife-product-card__hover-action {
		opacity: 1;
		transform: translate3d(-50%, -50%, 0) scale(1);
	}
}

@media (prefers-reduced-motion: reduce) {
	.knife-product-card,
	.knife-product-card::before,
	.knife-product-card__image::after,
	.knife-product-card__image-layer,
	.knife-product-card__image-shade,
	.knife-product-card__hover-action {
		transition-duration: 1ms;
	}

	.knife-product-card:hover,
	.knife-product-card:focus-visible,
	.knife-product-card:hover .knife-product-card__image-layer,
	.knife-product-card:focus-visible .knife-product-card__image-layer {
		transform: none;
	}
}

@media only screen and (max-width: 1120px) {
	.knife-products-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}

@media only screen and (max-width: 640px) {
	.knife-products-container {
		width: min(calc(100% - 1.5rem), var(--tk-content-max));
	}

	.knife-products-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.knife-product-card__content {
		padding: 0.75rem;
	}
}

@media only screen and (max-width: 340px) {
	.knife-products-grid {
		grid-template-columns: 1fr;
	}

	.knife-products-container {
		width: min(calc(100% - 1rem), var(--tk-content-max));
	}
}

.carousel-overlay {
	-webkit-backdrop-filter: blur(8px);
	backdrop-filter: blur(8px);
	background-color: rgb(var(--tk-color-ink-rgb) / 62%);
	position: fixed;
	inset: 0;
	width: 100%;
	height: 100%;
	z-index: 9998;
	transition: opacity 220ms ease;
}

.product-modal-fade-enter-active,
.product-modal-fade-leave-active,
.product-modal-shell-enter-active,
.product-modal-shell-leave-active {
	transition:
		opacity 220ms ease,
		transform 220ms ease;
}

.product-modal-fade-enter-from,
.product-modal-fade-leave-to {
	opacity: 0;
}

.product-modal-shell-enter-from,
.product-modal-shell-leave-to {
	opacity: 0;
	transform: translate3d(-50%, -50%, 0) translateY(0.75rem) scale(0.985);
}

@media (prefers-reduced-motion: reduce) {
	.carousel-overlay,
	.product-modal-fade-enter-active,
	.product-modal-fade-leave-active,
	.product-modal-shell-enter-active,
	.product-modal-shell-leave-active {
		transition: none;
	}

	.product-modal-shell-enter-from,
	.product-modal-shell-leave-to {
		transform: translate3d(-50%, -50%, 0);
	}
}
</style>
