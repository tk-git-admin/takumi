<template>
	<div class="carousel-container">
		<div class="carousel-slider">
			<Carousel id="gallery" :items-to-show="1" :wrap-around="false" v-model="currentSlide">
				<Slide v-for="(image, index) in item.image" :key="index">
					<div class="carousel__item">
						<img :src="image.url" :alt="'Image ' + (index + 1)" />
					</div>
				</Slide>
				<template #addons>
					<Navigation />
				</template>
			</Carousel>

			<Carousel
				id="thumbnails"
				:items-to-show="4"
				:wrap-around="true"
				v-model="currentSlide"
				ref="carousel">
				<Slide v-for="(image, index) in item.image" :key="index">
					<div class="carousel__item" @click="slideTo(index)">
						<img :src="image.url" :alt="'Image ' + (index + 1)" />
					</div>
				</Slide>
			</Carousel>
		</div>
		<div class="carousel-desc">
			<div class="product__detail">
				<div class="product-title">
					<h2>{{ item?.model_name }}</h2>
					<p v-if="item.highlight" class="product__highlight">
						{{ item?.highlight }}
					</p>
				</div>
				<div class="purchase-detail">
					<div v-if="item.description" v-html="item?.description" />
					<label>Blade Length: {{ item?.blade_length }}</label>
					<label class="purchase-detail-row">
						Price: {{ price }}
						<span v-if="discount > 0" class="discount-percent-text"> {{ discount }}% off </span>
					</label>
				</div>
			</div>

			<span v-if="item?.sold_out?.length > 0" class="btn__cta disable">SOLD OUT</span>
			<a
				v-else
				class="btn__cta"
				:href="
					'https://wa.me/+60183875096?text=Hi,I would like to order ' +
					item.brand_name +
					' ' +
					item.model_name
				"
				>ORDER</a
			>
			<div class="close" @click="$emit('close-modal')">
				<img class="close-img" src="/img/close-icon.svg" alt="" />
			</div>
		</div>
	</div>
</template>

<script>
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
export default defineComponent({
	components: {
		Carousel,
		Slide,
		Navigation,
	},

	props: {
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
	},
	name: 'Gallery',
	data: () => ({
		currentSlide: 0,
	}),
	methods: {
		slideTo(val) {
			this.currentSlide = val;
		},
	},
	computed: {
		isRenderFancyBox() {
			return (
				this.item !== null && typeof this.item === 'object' && Object.keys(this.item).length > 0
			);
		},
	},
	mounted() {
		// Log all the details when the component is mounted
		// console.log('Price:', this.price);
		// console.log('Discount:', this.discount);
		// console.log('Modal Item:', this.item.image);
	},
});
</script>
<style scoped>
.carousel-container {
	display: flex;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 9999;
	background-color: white;
	justify-content: center;
	width: 80%;
	max-width: 940px;
	border-radius: 20px;
}

.carousel-slider {
	max-width: 50%;
	padding: 30px;
	min-width: 50%;
}

.carousel-desc {
	padding: 30px;
	min-width: 50%;
}

.carousel {
	width: 100%;
}

.carousel__slide img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

label {
	display: inline;
}

select {
	padding: 5px 10px;
	border: 1px solid;
}

.flex__column {
	flex-basis: calc(50% - 10px);
	flex-direction: column;
	text-align: left;
}

.modal-overlay {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	background-color: #000000da;
	z-index: 20;
}

.modal {
	text-align: center;
	background-color: white;
	width: 800px;
	margin-top: 50px;
	border-radius: 10px;
	height: 80%;
}

.close {
	position: absolute;
	top: 0;
	right: 0;
	cursor: pointer;
}

.close-img {
	width: 35px;
}

.btn__cta {
	display: block;
	border-radius: 5px;
	background-color: #772c1a;
	padding: 10px 30px;
	text-align: center;
	color: #fff !important;
	transition: transform 0.3s;
	font-weight: 700;
	text-decoration: none;
	width: 150px;
	margin: 10px 0;
}

.btn__cta:hover {
	opacity: 0.9;
}

.btn__cta:focus {
	transform: scale(0.9);
}

.image-gallery {
	display: flex;
	justify-content: center;
	max-height: 250px;
}

img {
	width: 100%;
}

.discount-percent-text {
	color: red;
	font-weight: bold;
	font-size: 1rem;
	padding: 0 8px;
}
.product-title h2 {
	font-size: 1.3rem;
	margin: 0 0 10px;
	text-align: left;
	line-height: normal;
}

.purchase-detail {
	display: flex;
	flex-direction: column;
	font-size: 1rem;
}

.disable {
	cursor: no-drop;
	color: #772c1a !important;
	background-color: #ddd;
}

.product__highlight {
	background: #183d3d;
	width: fit-content;
	padding: 5px 10px;
	color: white;
	font-weight: 600;
	margin-bottom: 10px;
}

.product__detail {
	height: 440px;
	overflow-y: auto;
	padding: 0 10px;
}

#thumbnails .carousel__slide--active .carousel__item {
	border: 5px solid #772c1a;
}

@media only screen and (max-width: 768px) {
	.carousel-desc {
		padding: 30px;
		min-width: 50%;
	}

	.carousel-slider {
		padding: 40px 30px 0px 30px;
	}

	.carousel-desc {
		padding: 0px 30px 30px 30px;
	}

	.carousel-slider {
		max-width: 100%;
	}

	.carousel-container {
		flex-direction: column;
		padding: 0 5px;
	}
	.modal {
		width: calc(100% - 10px);
		height: calc(100% - 10px);
		margin-top: 5px;
	}

	.product-title h2 {
		font-size: 1.2rem;
	}

	.purchase-detail {
		font-size: 0.9rem;
	}

	.btn__cta {
		width: 100%;
	}

	.product__detail {
		max-height: 200px;
	}

	.image-gallery {
		max-height: none;
	}

	.close {
		margin: 11px 0 0 -36px;
	}

	.flex__column {
		flex-basis: calc(100% - 10px);
	}
}
</style>
