<template>
	<div
		v-if="content.hero.hero_image && content.hero.hero_image.url"
		class="min-h-96 flex flex-col items-center"
		:style="{ backgroundImage: `url(${content.hero.hero_image.url})`, backgroundSize: 'cover' }">
		<div
			class="flex flex-col justify-center items-center w-full text-center"
			style="background: rgba(0, 0, 0, 0.69); flex-grow: 1">
			<div class="max-w-full">
				<h1 v-if="content.hero.hero_title" id="services" class="heading-2 pt-12 px-3.5">
					{{ content.hero.hero_title }}
				</h1>
				<h2 v-if="content.hero.hero_subtitle" class="heading-3 px-3.5">
					{{ content.hero.hero_subtitle }}
				</h2>
			</div>
		</div>
	</div>
	<div v-else class="mt-20"></div>
	<!--A little top spacing if there's no hero banner-->
	<div
		class="rich-text-block w-richtext w-72 md:w-10/12 m-auto mb-20 newsblog-article w-container"
		v-html="content.news.article" />
</template>

<style scoped>
.heading-2 {
	font-family: Montserrat;
	color: #fff;
	text-align: center;
	text-transform: uppercase;
	font-size: 24px;
}

.heading-3 {
	font-family: Montserrat;
	color: #fff;
	text-transform: uppercase;
	font-weight: 600;
	margin-top: 0;
	line-height: 30px;
}

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
	background: #772c1a;
	color: #fff !important;
	margin: 5px 0 10px;
	padding: 3px 10px;
	text-align: left;
}

.newsblog-article :deep(.c-heading-lv2 *),
.newsblog-article :deep(.heading-lv3 *) {
	color: #fff !important;
}

.newsblog-article :deep(.heading-lv3 strong) {
	color: #fff !important;
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

useSeoMeta({
	title: t('seo.title'),
	ogTitle: t('seo.ogTitle'),
	description: t('seo.description'),
	ogDescription: t('seo.ogDescription'),
	ogImage: '/img/takumi-ogp.png',
	twitterCard: t('seo.twitterCard'),
});
</script>
