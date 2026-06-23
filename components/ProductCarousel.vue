<script>
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

import { Carousel } from '@fancyapps/ui/dist/carousel/carousel.esm.js';
import '@fancyapps/ui/dist/carousel/carousel.css';

import { Thumbs } from '@fancyapps/ui/dist/carousel/carousel.thumbs.esm.js';
import '@fancyapps/ui/dist/carousel/carousel.thumbs.css';
import { getKurocoImagePreset } from '~/utils/kurocoImage.mjs';

export default {
	props: {
		options: Object,
		item: {
			type: Object,
			required: true,
		},
	},
	mounted() {
		/* eslint-disable no-unused-vars */
		const productCarousel = new Carousel(
			document.getElementById('productCarousel'),
			{
				transition: 'slide',
				preload: 4,
				Navigation: true,
				Dots: false,
				Thumbs: {
					type: 'classic',
					Carousel: {
						dragFree: false,
						slidesPerPage: 'auto',
						Navigation: false,
						axis: 'x',
						breakpoints: {
							'(max-width: 767px)': {
								axis: 'y',
							},
						},
					},
				},
			},
			{ Thumbs },
		);

		Fancybox.bind('[data-fancybox="gallery"]', {
			compact: false,
			idle: false,
			dragToClose: false,
			contentClick: () =>
				window.matchMedia('(max-width: 578px), (max-height: 578px)').matches
					? 'toggleMax'
					: 'toggleCover',

			animated: false,
			showClass: false,
			hideClass: false,

			Hash: false,
			Thumbs: false,

			Toolbar: {
				display: {
					left: [],
					middle: [],
					right: ['close'],
				},
			},

			Carousel: {
				transition: 'fadeFast',
				preload: 3,
			},

			Images: {
				zoom: false,
				Panzoom: {
					panMode: 'mousemove',
					mouseMoveFactor: 1.1,
				},
			},
		});
	},
	computed: {
		validImages() {
			return this.item.image.filter((image) => image && image.url);
		},
	},
	methods: {
		galleryImage(src) {
			return getKurocoImagePreset(src, 'modalImage');
		},
		galleryThumb(src) {
			return getKurocoImagePreset(src, 'modalThumb');
		},
	},
	// Enable to log items data
	// watch: {
	//     item(itemValues) {
	//         if (itemValues) {
	//             console.log('Product Model:', this.item);
	//         }
	//     }
	// }
};
</script>

<template v-if="validImages">
	<div
		id="productContainer"
		class="mb-14 md:max-w-lg gap-2s grid md:grid-cols-custom sm:grid-cols-custom sm2:grid-cols-custom sm3:grid-cols-custom xs:grid-cols-custom xs2:grid-cols-custom md:block">
		<div id="productCarousel" class="f-carousel">
			<div
				v-for="(image, index) in validImages"
				:key="index"
				class="f-carousel__slide"
				:data-thumb-src="galleryThumb(image.url).src"
				data-fancybox="gallery"
				:data-src="galleryImage(image.url).src">
				<img alt="" :data-lazy-src="galleryImage(image.url).src" />
			</div>
		</div>
	</div>
</template>

<style scoped>
/*
#productContainer {
  --product-view-height: 680px;
} */

#productContainer .f-thumbs.is-classic.is-vertical {
	height: var(--product-view-height, 100%);
}

#productContainer {
	margin: 0 !important;
	max-width: 360px;
}
@media (min-width: 768px) {
	.md\:grid-cols-custom {
		grid-template-columns: 410px minmax(0, 1fr);
	}
}

@media (max-width: 767px) {
	#productContainer {
		max-width: 530px;
		max-height: 410px;
	}
	.sm\:grid-cols-custom {
		grid-template-columns: 410px minmax(0, 1fr);
	}
}

@media (max-width: 640px) {
	#productContainer {
		max-width: 450px;
		max-height: 350px;
	}
	.sm2\:grid-cols-custom {
		grid-template-columns: 350px minmax(0, 1fr);
	}
}

@media (max-width: 480px) {
	#productContainer {
		max-width: 400px;
		max-height: 300px;
	}
	.sm3\:grid-cols-custom {
		grid-template-columns: 300px minmax(0, 1fr);
	}
}

@media (max-width: 450px) {
	#productContainer {
		max-width: 350px;
		max-height: 250px;
	}
	.xs\:grid-cols-custom {
		grid-template-columns: 250px minmax(0, 1fr);
	}
}

@media (max-width: 360px) {
	#productContainer {
		max-width: 250px;
		max-height: 150px;
	}
	.xs2\:grid-cols-custom {
		grid-template-columns: 150px minmax(0, 1fr);
	}
}

/*
  Thumbnails
*/

.f-thumbs.is-classic {
	--f-thumb-width: 90px;
	--f-thumb-height: 135px;
	--f-thumb-gap: 0.5rem;
	--f-thumb-opacity: 1;
	--f-thumb-selected-opacity: 0.2;
	--f-button-color: #0d0c22;
	--f-button-hover-color: #ff3520;
	--f-button-bg: rgb(108, 122, 137, 0.4);
	--f-button-hover-bg: #fff;
	--f-button-active-bg: #fff;
}

.f-thumbs.is-classic .f-thumbs__slide__img {
	object-fit: contain;
}

/*
  Main carousel
*/
#productCarousel {
	--f-carousel-spacing: 0;
	--f-button-width: 48px;
	--f-button-height: 48px;
	--f-button-border-radius: 0;
	--f-button-color: #0d0c22;
	--f-button-hover-color: #ff3520;
	--f-button-bg: rgb(108, 122, 137, 0.4);
	--f-button-hover-bg: #fff;
	--f-button-active-bg: #fff;
	--f-button-svg-width: 28px;
	--f-button-svg-height: 28px;
	--f-button-svg-stroke-width: 1;
	--f-button-svg-filter: none;

	height: var(--product-view-height);
}

#productCarousel .f-carousel__slide {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}

#productCarousel .f-carousel__slide img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

#productCarousel .f-carousel__nav {
	opacity: 0;
	transition: opacity 0.15s;
}

@media (hover: hover) {
	#productCarousel:hover .f-carousel__nav {
		opacity: 1;
	}
}

.fancybox__container {
	--fancybox-color: #0d0c22;
	--fancybox-bg: #fff;
	--f-spinner-color-1: rgba(0, 0, 0, 0.1);
	--f-spinner-color-2: rgba(17, 24, 28, 0.8);
}

.fancybox__toolbar,
.fancybox__nav {
	--f-button-width: 60px;
	--f-button-height: 60px;
	--f-button-border-radius: 0;
	--f-button-color: #0d0c22;
	--f-button-hover-color: #ff3520;
	--f-button-bg: rgb(108, 122, 137, 0.4);
	--f-button-hover-bg: #fff;
	--f-button-active-bg: #fff;
	--f-button-svg-width: 32px;
	--f-button-svg-height: 32px;
	--f-button-svg-stroke-width: 1;
	--f-button-svg-filter: none;
}

.fancybox__nav {
	--f-button-next-pos: 0;
	--f-button-prev-pos: 0;
}
</style>
