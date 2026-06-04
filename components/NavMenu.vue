<template>
	<header class="fixed top-0 w-full z-30 bg-base-100 transition-all">
		<AnnouncementBar
			v-if="isHomePage"
			:to="getLink(seibuFairAnnouncement.to)"
			:label="seibuFairAnnouncement.label"
			:title="seibuFairAnnouncement.title"
			:action-label="seibuFairAnnouncement.actionLabel" />
		<div class="w-container">
			<nav class="mx-auto grid grid-flow-col py-3 sm:py-4">
				<div class="col-start-1 col-end-2 flex items-center">
					<NuxtLink :to="localePath({ path: `/` })" no-prefetch>
						<img :src="logoSrc" :alt="logoAlt" class="navbar-logo h-8 w-auto" />
					</NuxtLink>
				</div>
				<ul class="hidden lg:flex col-start-4 col-end-8 text-secondary-500 items-center">
					<NuxtLink
						class="px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative hover:text-primary"
						:class="getTextColor(links.home)"
						:to="getLink(links.home)">
						{{ $t('links.home') }}
					</NuxtLink>
					<NuxtLink
						class="px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative hover:text-primary"
						:class="getTextColor(links.halal)"
						:to="getLink(links.halal)">
						{{ $t('links.halal') }}
					</NuxtLink>
					<NuxtLink
						class="px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative hover:text-primary"
						:class="getTextColor(links.news)"
						:to="getLink(links.news)">
						{{ $t('links.news') }}
					</NuxtLink>
					<NuxtLink
						class="px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative hover:text-primary"
						:class="getTextColor(links.knives)"
						:to="getLink(links.knives)">
						{{ $t('links.knives') }}
					</NuxtLink>
					<NuxtLink
						class="px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative hover:text-primary"
						:class="getTextColor(links.contact)"
						:to="localePath({ path: `/`, hash: `#contact` })">
						{{ $t('links.contact') }}
					</NuxtLink>
				</ul>
				<div class="col-start-10 col-end-12 font-medium flex justify-end items-center">
					<button
						@click="toggleLanguage"
						class="font-medium tracking-wide py-2 px-5 sm:px-8 border border-orange-500 text-primary bg-base-100 outline-none rounded-l-full rounded-r-full capitalize hover:bg-primary hover:text-base-100 transition-all hover:shadow-orange">
						{{ $t('links.language') }}
					</button>
				</div>
			</nav>
		</div>
	</header>
	<nav class="fixed lg:hidden bottom-0 left-0 right-0 z-20 shadow-t">
		<div class="bg-base-100 sm:px-3">
			<ul class="flex w-full justify-between items-center text-secondary-500">
				<NuxtLink
					class="mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all border-transparent"
					:to="getLink(links.halal)">
					<Icon name="mdi:religion-islamic" :color="getIconColor(links.halal)" />
					{{ $t('links.halal') }}
				</NuxtLink>
				<NuxtLink
					class="mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all border-transparent"
					:to="getLink(links.news)">
					<Icon name="bxs:news" :color="getIconColor(links.news)" />
					{{ $t('links.news') }}
				</NuxtLink>
				<NuxtLink
					class="mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all border-transparent"
					:to="getLink(links.knives)">
					<Icon name="ph:knife-bold" :color="getIconColor(links.knives)" />
					{{ $t('links.knives') }}
				</NuxtLink>
				<NuxtLink
					class="mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all border-transparent"
					:to="localePath({ path: `/`, hash: `#contact` })">
					<Icon name="mdi:contact" :color="getIconColor(links.contact)" />
					{{ $t('links.contact') }}
				</NuxtLink>
			</ul>
		</div>
	</nav>
</template>

<script setup>
import VueScrollTo from 'vue-scrollto';
import { seibuFairEvent } from '~/data/seibuFair.mjs';

const router = useRouter();
const logoSrc = '/img/takumi-logo.webp';
const logoAlt = 'Logo';
const logoLink = '#top';
const currentRoute = router.currentRoute;
const seibuFairAnnouncement = seibuFairEvent.announcement;
const isHomePage = computed(() => ['/', '/ja', '/ja/'].includes(currentRoute.value.path));

const links = {
	home: `/`,
	halal: '/news/about-halal-product/',
	watches: '/products/',
	knives: '/knives/',
	news: '/newslist/',
	contact: '/#contact',
};

function toggleLanguage(lang = null) {
	router.replace(`${processPath(currentRoute.value.path, '/ja')}`);
}

function getLink(baseLink) {
	let finalLink = baseLink;
	if (isLangPrefixFound(currentRoute.value.path, '/ja')) {
		finalLink = '/ja' + baseLink;
	}
	return finalLink;
}

function isLangPrefixFound(path, langPrefix) {
	return path.indexOf(langPrefix) !== -1;
}

function processPath(path, langPrefix) {
	const index = path.indexOf(langPrefix);
	// If the langPrefix is found, remove it; otherwise, add it
	if (isLangPrefixFound(path, langPrefix)) {
		return path.slice(0, index) + path.slice(index + langPrefix.length);
	} else {
		// If the langPrefix is not found, add it
		return langPrefix + path;
	}
}

function getIconColor(path) {
	return path === currentRoute.value.fullPath ? 'primary' : 'black';
}

function getTextColor(path) {
	return path === currentRoute.value.fullPath ? 'text-primary' : 'text-secondary-500';
}
</script>
