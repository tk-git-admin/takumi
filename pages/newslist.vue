<template>
	<section class="news-list-section bg-neutral">
		<div class="news-list-section__inner">
			<h1 class="news-list-section__title">
				{{ $t('news.title') }}
			</h1>

			<div class="news-list-section__grid">
				<NewsCard
					v-for="(item, index) in getNewsList()"
					:key="item.slug || index"
					:item="item"
					:to="localePath({ path: `../news/${item.slug}/` })"
					variant="list" />
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
import { useNews } from '~/store/news';
import { useI18n } from 'vue-i18n';
const { locale, t } = useI18n();
const newsList = useNews();

function localePath(location: { path: string }) {
	const path = location.path.replace(/^\.\.\//, '/').replace(/^([^/])/, '/$1');
	return locale.value === 'ja' ? `/ja${path}` : path;
}

function getNewsList() {
	return newsList.getNews(locale.value);
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
.news-list-section {
	padding: clamp(9.5rem, 20vh, 13.5rem) 0 var(--tk-space-section);
}

.news-list-section__inner {
	width: min(calc(100% - calc(var(--tk-space-gutter) * 2)), var(--tk-content-max));
	margin: 0 auto;
}

.news-list-section__title {
	margin: 0;
	color: var(--tk-color-sumi);
	font-size: clamp(2.35rem, 10vw, 4rem);
	font-weight: 800;
	line-height: 1.05;
	text-align: center;
}

.news-list-section__grid {
	display: grid;
	gap: clamp(1rem, 4vw, 1.5rem);
	margin-top: clamp(2rem, 8vw, 3.5rem);
}

@media (min-width: 768px) {
	.news-list-section__grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (min-width: 1024px) {
	.news-list-section__grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}

@media (max-width: 620px) {
	.news-list-section {
		padding-block: clamp(9rem, 38vw, 10rem) var(--tk-space-section);
	}
}
</style>
