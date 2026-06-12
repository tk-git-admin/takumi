<template>
	<div>
		<div class="main-section top no-hero wf-section mt-20">
			<div class="top__banner" :style="{ backgroundImage: `url(${images.bannerTop})` }">
				<h1 class="heading__h1">
					{{ $t('knivesBanner.title') }}
				</h1>
				<h2 class="heading__h2">
					{{ $t('knivesBanner.detail') }}
				</h2>
			</div>
			<div class="w-container mb-20">
				<div class="flex-wrapper">
					<div
						v-for="(item, index) in getKnivesList()"
						:key="index"
						class="box product"
						@click="
							showModal(
								formatPrice(item.selling_price),
								calculateDiscount(item.selling_price, item.retail_price),
								item,
							)
						">
						<div
							v-if="item.image[0]"
							class="box-image"
							@mouseover="showPreview(index)"
							@mouseleave="showPreview(index, false)">
							<div>
								<img :src="item.displayImage" style="display: block; width: 100%" />
							</div>
							<button
								v-if="item.isPreview"
								class="btn btn-primary box-image-btn"
								@click="
									showModal(
										formatPrice(item.selling_price),
										calculateDiscount(item.selling_price, item.retail_price),
										item,
									)
								">
								{{ $t('product.view') }}
							</button>
						</div>
						<div v-if="item.label.label || item.sold_out.length > 0" class="product__tag">
							<span v-if="item.sold_out.length > 0">Sold Out</span>
							<span v-else>{{ item.label.label }}</span>
						</div>

						<div class="product__content">
							<h2>{{ item.brand_name }}</h2>
							<h2 class="product_brand_name">{{ item.model_name }} {{ item.blade_length }}</h2>
							<div class="product-desc">
								<p v-if="item.color_options">Color: {{ item.color_options }}</p>
								<p class="price">
									{{ formatPrice(item.selling_price) }}
									<span v-if="item.selling_price < item.retail_price" class="discount-percent-text">
										{{ calculateDiscount(item.selling_price, item.retail_price) }}% off
									</span>
								</p>
								<p v-if="item.selling_price < item.retail_price" class="retail-price">
									{{ formatPrice(item.retail_price) }}
								</p>
								<a target="_blank" :href="item.more_info_link.url">{{
									item.more_info_link.title
								}}</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="isShowModal" @click="hideModal()" class="carousel-overlay"></div>
		<ProductModal
			v-if="isShowModal"
			:price="price"
			:discount="discount"
			:item="modalItem"
			@close-modal="isShowModal = false" />
	</div>
</template>

<script>
import ProductModal from '~/components/ProductModal.vue';
import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ProductModal,
	},
	data() {
		return {
			content: null,
			showFooter: false,
			imageUrl: {},
			onHoverId: null,
			isShowModal: false,
			price: '',
			discount: '',
			modalItem: {},
			topBanner: {
				title: 'Yoshimune Japanese Knives',
				desc: 'The trusted place to buy high quality Japanese kitchen knives in Malaysia',
			},
		};
	},
	methods: {
		formatPrice(price) {
			return `RM${this.formatNumber(price)}`;
		},
		calculateDiscount(sellingPrice, retailPrice) {
			if (parseFloat(sellingPrice) < parseFloat(retailPrice)) {
				const discountPercentage = (((retailPrice - sellingPrice) / retailPrice) * 100).toFixed(0);
				return `${discountPercentage}`;
			}
			return '';
		},
		showModal(price, discount, item) {
			this.isShowModal = true;
			this.price = price;
			this.discount = discount;
			this.modalItem = item;
		},
		hideModal() {
			this.isShowModal = false;
		},
	},
});
</script>

<script setup>
import { useKnives } from '~/store/knives';
import { useI18n } from 'vue-i18n';
const { locale, t } = useI18n();

const images = {
	bannerTop: '/img/knives_banner.png',
	gShockBanner: '/img/g-shock_banner.png',
};
// const props = defineProps(['images']);

const knivesList = useKnives();
function getKnivesList() {
	// console.log(knivesList.getList(locale.value))
	return knivesList.getList(locale.value);
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

function initKnivesProp() {
	getKnivesList()?.forEach((item, index) => {
		item.displayImage = item.image[0].url;
		item.isPreview = false;
	});
}
function showPreview(index, isShow = true) {
	const item = getKnivesList()[index];
	item.isPreview = isShow;
	item.displayImage = isShow ? item.image[1].url : item.image[0].url;
}

initKnivesProp();

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
.flex__container {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
	padding: 30px 0;
	align-items: center;
}

.flex-container > div {
	flex-basis: calc(25% - 20px);
}

.flex__item {
	text-align: center;
}

.banner__text {
	text-align: center;
}

.back {
	cursor: pointer;
}

.flex-wrapper {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	gap: 20px;
}

.box {
	flex-basis: calc(25% - 20px);
	display: flex;
	flex-direction: column;
	position: relative;
	background: #eeeded;
	cursor: pointer;
}

.box-image {
	width: 100%;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.box-image-btn {
	position: absolute;
	margin: auto;
}

.product h2 {
	line-height: 20px;
	font-size: 1rem;
	text-align: left;
}

.product h2,
.price {
	margin: 0 !important;
	color: #393646 !important;
	font-size: 1rem;
	font-weight: bold;
}

.product p,
.product a {
	display: block;
	color: #4f4557;
	margin: 0;
}

.retail-price {
	text-decoration: line-through;
	text-decoration-thickness: auto;
}

.product__cta {
	display: flex;
	justify-content: center;
}

.product-desc {
	margin: 20px 0;
}

.discount-percent-text {
	color: red;
	font-weight: bold;
	font-size: 1rem;
	padding: 0 8px;
}

.product__content {
	padding: 10px;
}

.product__tag {
	box-shadow:
		rgba(60, 64, 67, 0.3) 0 1px 2px 0,
		rgba(60, 64, 67, 0.15) 0 1px 3px 1px;
	position: absolute;
	padding: 5px;
	width: fit-content;
	background-color: rgb(240, 248, 255, 0.5);
	margin-top: 5px;
	margin-left: 5px;
}

.product__tag > p {
	text-align: center;
	padding: 0 3px;
	font-weight: 600;
}

.top__banner {
	width: 100%;
	object-fit: cover;
	object-position: 50% 20%;
	overflow: hidden;
	background-size: cover;
	height: 130px;
	margin-bottom: 30px;
	display: flex;
	justify-content: center;
	flex-direction: column;
}

.top__banner > h1,
.top__banner > h2 {
	text-transform: none;
	margin: 0;
	max-width: 1280px;
	margin: 0 auto;
}

.top__banner > h1 {
	font-weight: 600;
	font-size: 1.8rem;
	line-height: normal;
}

.bottom__banner {
	object-fit: cover;
	object-position: 50% 20%;
	overflow: hidden;
	background-size: cover;
	height: 130px;
	background-color: #f8f6f1;
}

.product_brand_name {
	min-height: 60px;
}

.heading__h2 {
	line-height: 22px;
}

@media only screen and (max-width: 576px) {
	.flex-wrapper {
		gap: 5px;
		justify-content: center;
	}

	.box {
		flex-basis: calc(50% - 10px);
	}

	.bottom__banner {
		height: 210px;
	}

	.flex__item {
		flex-basis: calc(50% - 10px);
		flex-grow: 1;
	}

	.flex__item:nth-child(1) {
		order: 1;
	}

	.flex__item:nth-child(2) {
		order: 3;
	}

	.flex__item:nth-child(3) {
		order: 2;
	}

	.top__banner > h1 {
		font-size: 1.6rem;
	}
}

.banner__icon {
	margin-bottom: 5px;
}

.carousel-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 9998; /* Adjust as needed */
	background-color: rgba(0, 0, 0, 0.5); /* Adjust the background color and opacity */
}
</style>
