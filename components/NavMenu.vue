<template>
	<header class="fixed top-0 w-full z-30 bg-base-100 transition-all">
		<AnnouncementBar
			v-if="isHomePage"
			:to="getLink(seibuFairAnnouncement.to)"
			:label="seibuFairAnnouncement.label"
			:title="seibuFairAnnouncement.title"
			:action-label="seibuFairAnnouncement.actionLabel" />
		<div class="w-container">
			<nav class="mx-auto flex items-center justify-between gap-4 py-3 sm:py-4">
				<div class="flex items-center">
					<NuxtLink :to="localePath({ path: `/` })" no-prefetch>
						<img :src="logoSrc" :alt="logoAlt" class="navbar-logo h-8 w-auto" />
					</NuxtLink>
				</div>
				<ul class="hidden lg:flex text-secondary-500 items-center">
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
				<div class="font-medium flex items-center gap-2">
					<button
						@click="toggleLanguage"
						class="font-medium tracking-wide py-2 px-5 sm:px-8 border border-orange-500 text-primary bg-base-100 outline-none rounded-l-full rounded-r-full capitalize hover:bg-primary hover:text-base-100 transition-all hover:shadow-orange">
						{{ $t('links.language') }}
					</button>
					<div class="dropdown dropdown-end lg:hidden">
						<button
							type="button"
							tabindex="0"
							class="btn btn-ghost btn-circle"
							:aria-label="$t('links.menu')">
							<Icon name="mdi:menu" class="text-2xl" />
						</button>
						<ul
							tabindex="0"
							class="menu dropdown-content z-40 mt-3 w-56 rounded-box border border-base-200 bg-base-100 p-2 text-secondary-500 shadow">
							<li>
								<NuxtLink :class="getTextColor(links.home)" :to="getLink(links.home)">
									{{ $t('links.home') }}
								</NuxtLink>
							</li>
							<li>
								<NuxtLink :class="getTextColor(links.halal)" :to="getLink(links.halal)">
									{{ $t('links.halal') }}
								</NuxtLink>
							</li>
							<li>
								<NuxtLink :class="getTextColor(links.news)" :to="getLink(links.news)">
									{{ $t('links.news') }}
								</NuxtLink>
							</li>
							<li>
								<NuxtLink :class="getTextColor(links.knives)" :to="getLink(links.knives)">
									{{ $t('links.knives') }}
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									:class="getTextColor(links.contact)"
									:to="localePath({ path: `/`, hash: `#contact` })">
									{{ $t('links.contact') }}
								</NuxtLink>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</div>
	</header>
</template>

<script setup>
const router = useRouter();
const { t } = useI18n();
const logoSrc = '/img/takumi-logo.webp';
const logoAlt = 'Logo';
const currentRoute = router.currentRoute;
const SEIBU_FAIR_ROUTE = '/seibu-fair';
const seibuFairAnnouncement = computed(() => ({
	to: SEIBU_FAIR_ROUTE,
	label: t('seibuFair.announcement.label'),
	title: t('seibuFair.announcement.title'),
	actionLabel: t('seibuFair.announcement.actionLabel'),
}));
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

	function getTextColor(path) {
	return path === currentRoute.value.fullPath ? 'text-primary' : 'text-secondary-500';
}
</script>
