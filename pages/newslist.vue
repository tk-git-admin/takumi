<template>
	<!-- News Section -->
	<div class="py-12 bg-neutral"></div>
	<div class="py-12 bg-neutral">
		<h1 class="text-4xl font-bold text-center">
			{{ $t('news.title') }}
		</h1>

		<div class="mt-10 flex flex-col gap-10 items-start items-center lg:justify-center md:m-16">
			<!-- News Cards -->
			<div class="w-container flex flex-col items-center">
				<div
					v-for="(item, index) in getNewsList()"
					class="card bg-base-100 border border-base-200 flex card w-80 xs:w-96 md:w-full my-3">
					<!-- Card -->
					<NuxtLink :to="localePath({ path: `../news/${item.slug}/` })" no-prefetch>
						<div class="flex flex-col bg-base-200 rounded-box">
							<!-- Body-->
							<div class="flex flex-col lg:flex-row">
								<img
									v-if="item.thumbnail.url"
									:src="item.thumbnail.url"
									alt="Thumbnail"
									class="lg:max-w-64 object-cover bg-base-100" />
								<img
									v-else
									src="/img/takumi-ogp.png"
									alt="Default Image"
									class="lg:max-w-64 object-cover bg-base-100" />
								<div class="flex flex-col p-3">
									<h3 class="text-primary font-medium">{{ item.news.category }}</h3>
									<a class="link link-hover text-xl font-bold">{{ item.news.headline }}</a>
									<span>
										{{ item.news.intro }}
									</span>
								</div>
							</div>
						</div>
					</NuxtLink>
				</div>
			</div>
		</div>
	</div>
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
