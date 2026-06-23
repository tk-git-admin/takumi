<template>
	<div>
		<div class="main-section top no-hero wf-section mt-20">
			<div class="top__banner" :style="{ backgroundImage: `url(${images.bannerTop})` }">
				<div class="banner-col-wrapper">
					<div class="top__banner-col-1">
						<h1 class="heading__h1">
							{{ $t('topBanner.title') }}
						</h1>
						<h2 class="heading__h2">
							{{ $t('topBanner.detail1') }}
						</h2>
						<h2 class="heading__h2">
							{{ $t('topBanner.detail2') }}
						</h2>
					</div>
					<div class="top__banner-col-2">
						<img :src="images.gShockBanner" />
					</div>
				</div>
			</div>
			<div class="w-container mb-20">
				<div class="flex-wrapper">
					<div v-for="(item, index) in getProductsList()" :key="index" class="box product">
						<div v-if="item.label.label || item.sold_out.length > 0" class="product__tag">
							<span v-if="item.sold_out.length > 0">Sold Out</span>
							<span v-else>{{ item.label.label }}</span>
						</div>
						<div class="product__content">
							<img
								v-if="item.image?.url"
								class="box-image"
								:src="productImage(item.image.url).src"
								:srcset="productImage(item.image.url).srcset"
								:sizes="productImage(item.image.url).sizes"
								:width="productImage(item.image.url).width"
								:alt="item.model_name"
								:loading="productImage(item.image.url).loading"
								:decoding="productImage(item.image.url).decoding" />
							<h2>{{ item.brand_name }}</h2>
							<h2>{{ item.model_name }}</h2>
							<div class="product-desc">
								<p v-if="item.color_options">Color: {{ item.color_options }}</p>
								<p class="price">
									{{ formatPrice(item.selling_price) }}
									<span
										v-if="formatPrice(item.selling_price) < formatPrice(item.retail_price)"
										class="discount-percent-text">
										{{ calculateDiscount(item.selling_price, item.retail_price) }}% off
									</span>
								</p>
								<p class="retail-price">
									{{ formatPrice(item.retail_price) }}
								</p>
								<a target="_blank" :href="item.more_info_link.url">{{
									item.more_info_link.title
								}}</a>
							</div>
						</div>
						<div class="product__cta">
							<span v-if="item.sold_out.length > 0" class="btn__cta disable">{{
								$t('product.soldout')
							}}</span>
							<a
								v-else
								:href="
									'https://wa.me/+601116883273?text=Hi,I would like to order ' +
									item.brand_name +
									' ' +
									item.model_name
								"
								class="btn__cta"
								>{{ $t('product.order') }}</a
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
<script lang="ts" setup>
import { useProducts } from '~/store/products';
import { useI18n } from 'vue-i18n';
import { getKurocoImagePreset } from '~/utils/kurocoImage.mjs';
const { locale, t } = useI18n();

const images = {
	bannerTop: '/img/knives_banner.png',
	gShockBanner: '/img/g-shock_banner.png',
};
// const props = defineProps(['images']);

const productsList = useProducts();
function getProductsList() {
	return productsList.getProducts(locale.value);
}

function productImage(src: string) {
	return getKurocoImagePreset(src, 'productCard');
}

function formatPrice(price: string | number) {
	return `RM${formatNumber(price)}`;
}

function calculateDiscount(sellingPrice: string | number, retailPrice: string | number) {
	const selling = Number.parseFloat(String(sellingPrice));
	const retail = Number.parseFloat(String(retailPrice));

	if (selling < retail && retail > 0) {
		const discountPercentage = (((retail - selling) / retail) * 100).toFixed(0);
		return `${discountPercentage}`;
	}
	return '';
}

function formatNumber(number: string | number) {
	return Number.parseFloat(String(number)).toFixed(2);
}
useSeoMeta({
	title: t('seo.title'),
	ogTitle: t('seo.ogTitle'),
	description: t('seo.description'),
	ogDescription: t('seo.ogDescription'),
	ogImage: '/img/takumi-ogp.png',
	twitterCard: t('seo.twitterCard') as 'summary' | 'summary_large_image' | 'app' | 'player',
});
</script>

<style scoped>
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
	padding: 15px;
	background: #eeeded;
}

.box-image {
	width: 100%;
	object-fit: cover;
	object-position: 50% 20%;
	padding: 10px;
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

.btn__cta {
	position: absolute;
	bottom: 20px;
	border-radius: 4px;
	background-color: #772c1a;
	padding: 10px 0;
	text-align: center;
	color: #fff !important;
	transition: transform 0.3s;
	font-family: 'Varela Round', sans-serif;
	font-size: 0.9rem;
	font-weight: 700;
	text-decoration: none;
	width: 85%;
}

.btn__cta:hover {
	opacity: 0.9;
}

.btn__cta:focus {
	transform: scale(0.9);
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
	margin: 40px 0;
}

.product__tag {
	box-shadow:
		rgba(60, 64, 67, 0.3) 0 1px 2px 0,
		rgba(60, 64, 67, 0.15) 0 1px 3px 1px;
	position: absolute;
	padding: 5px;
	width: fit-content;
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
	flex-wrap: wrap-reverse;
}

.top__banner-col-1 {
	flex-basis: 80%;
	margin: auto;
}
.banner-col-wrapper {
	max-width: 1280px;
	min-width: 1280px;
	display: flex;
	margin: 0 auto;
}

.top__banner-col-2 {
	flex-grow: 1;
	margin: auto;
	justify-content: flex-end;
	display: flex;
}

.top__banner-col-2 > img {
	width: 150px;
}

.top__banner > h1,
.top__banner > h2 {
	text-transform: none;
	margin: 0;
}

.top__banner > h1 {
	font-weight: 600;
	font-size: 1.8rem;
	line-height: normal;
	margin-bottom: 5px;
}

.heading__h2 {
	line-height: 22px;
}

h1 {
	font-weight: 600;
	line-height: normal;
}

.disable {
	cursor: no-drop;
	color: #772c1a !important;
	background-color: #ddd;
}

@media only screen and (max-width: 1280px) {
	.banner-col-wrapper {
		max-width: 80%;
		min-width: 0px;
	}
}

@media only screen and (max-width: 768px) {
	.top__banner {
		height: 150px;
	}

	.top__banner-col-2 {
		display: none;
	}

	.top__banner > h1 {
		font-size: 1.6rem;
	}

	.top__banner-col-1,
	.top__banner-col-2 {
		flex-basis: 100%;
	}
}

@media only screen and (max-width: 576px) {
	.flex-wrapper {
		gap: 5px;
		justify-content: center;
	}

	.box {
		flex-basis: calc(50% - 10px);
		padding: 10px;
	}

	.btn__cta {
		width: 95%;
	}
}
</style>
