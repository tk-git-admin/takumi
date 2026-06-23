<template>
	<section
		v-if="heroImageUrl"
		class="page-hero"
		:style="newsHero.imageStyle"
		aria-labelledby="page-hero-title">
		<div class="page-hero__shade">
			<div class="page-hero__content">
				<p v-if="newsHero.label" class="page-hero__eyebrow">
					{{ newsHero.label }}
				</p>
				<h1 v-if="newsHero.title" id="page-hero-title" class="page-hero__title">
					{{ newsHero.title }}
				</h1>
				<p v-if="newsHero.description" class="page-hero__description">
					{{ newsHero.description }}
				</p>
			</div>
		</div>
	</section>
	<div v-else class="page-hero-spacer"></div>
	<!--A little top spacing if there's no hero banner-->
	<div
		class="rich-text-block w-richtext w-72 md:w-10/12 m-auto mb-20 newsblog-article w-container"
		v-html="content.news.article" />
</template>

<style scoped>
.newsblog-article {
	display: flex;
	flex-direction: column;
	align-items: left;
	background: none;
	margin-top: 20px !important;
}

.newsblog-article :deep(*) {
	color: #333;
	font-family: 'Open Sans', sans-serif;
}

.newsblog-article :deep(h1),
.newsblog-article :deep(h2),
.newsblog-article :deep(h3) {
	font-weight: bold;
	text-transform: uppercase;
}

.newsblog-article :deep(h1) {
	font-size: 24px;
}

.newsblog-article :deep(p) {
	padding: 0 10px;
	margin-bottom: 10px;
}

.newsblog-article :deep(ol),
.newsblog-article :deep(ul) {
	padding-left: 40px;
}

.newsblog-article :deep(li) {
	margin-bottom: 10px;
}

.newsblog-article :deep(ol > li::marker) {
	font-weight: bold;
}

.newsblog-article :deep(.image-style-align-center) {
	margin: auto;
	padding: 10px;
}

.newsblog-article :deep(.c-heading-lv2),
.newsblog-article :deep(.heading-lv3) {
	background: var(--tk-color-brand-brown);
	color: var(--tk-color-white) !important;
	margin: 5px 0 10px;
	padding: 3px 10px;
	text-align: left;
}

.newsblog-article :deep(.c-heading-lv2 *),
.newsblog-article :deep(.heading-lv3 *) {
	color: var(--tk-color-white) !important;
}

.newsblog-article :deep(.heading-lv3 strong) {
	color: var(--tk-color-white) !important;
}

.list-decimal {
	list-style-type: decimal;
}

.item-list {
	font-size: 17px;
	font-weight: 300;
}

.c-list-unstyle {
	list-style: none;
	padding-left: 0px !important;
}

.list-disc {
	list-style-type: disc;
}

@media only screen and (max-width: 768px) {
	.newsblog-article {
		font-size: 14px;
	}
}
</style>

<script setup>
import { useI18n } from 'vue-i18n';
import { getNewsHeroPresentation } from '~/utils/newsHeroPresentation.mjs';
import { getKurocoImagePreset } from '~/utils/kurocoImage.mjs';

const { locale, t } = useI18n();

const route = useRoute();
const slug = String(route.params.slug || '');
const { data } = await useFetch(`/api/content/news/${slug}`, {
	query: { lang: locale.value },
	key: `news-detail-${locale.value}-${slug}`,
});

if (!data.value?.details) {
	throw createError({
		statusCode: 404,
		statusMessage: 'News not found',
	});
}

const content = data.value.details;
const heroImage = computed(() =>
	getKurocoImagePreset(content.hero?.hero_image?.url || '', 'heroImage'),
);
const heroImageUrl = computed(() => heroImage.value.src);
const newsHeroPresentation = getNewsHeroPresentation(content);
const newsHero = computed(() => ({
	...newsHeroPresentation,
	imageStyle: {
		'--page-hero-image': `url(${heroImageUrl.value})`,
	},
}));

useSeoMeta({
	title: t('seo.title'),
	ogTitle: t('seo.ogTitle'),
	description: t('seo.description'),
	ogDescription: t('seo.ogDescription'),
	ogImage: '/img/takumi-ogp.png',
	twitterCard: t('seo.twitterCard'),
});
</script>
