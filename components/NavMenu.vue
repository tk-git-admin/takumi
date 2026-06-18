<template>
	<header class="takumi-nav-shell">
		<AnnouncementBar
			v-if="showSeibuAnnouncement"
			:to="getLink(seibuFairAnnouncement.to)"
			:label="seibuFairAnnouncement.label"
			:title="seibuFairAnnouncement.title"
			:action-label="seibuFairAnnouncement.actionLabel" />
		<div class="takumi-nav-frame">
			<nav class="takumi-nav-surface" aria-label="Primary navigation">
				<div class="takumi-nav-logo-wrap">
					<NuxtLink class="takumi-nav-logo" :to="getLink(links.home)" no-prefetch>
						<img :src="logoSrc" :alt="logoAlt" />
					</NuxtLink>
				</div>

				<ul class="takumi-nav-links">
					<NuxtLink
						class="takumi-nav-link"
						:class="getTextColor(links.home)"
						:aria-current="isActiveLink(links.home) ? 'page' : undefined"
						active-class=""
						exact-active-class=""
						aria-current-value=""
						:to="getLink(links.home)">
						{{ t('links.home') }}
					</NuxtLink>
					<NuxtLink
						class="takumi-nav-link"
						:class="getTextColor(links.halal)"
						:aria-current="isActiveLink(links.halal) ? 'page' : undefined"
						active-class=""
						exact-active-class=""
						aria-current-value=""
						:to="getLink(links.halal)">
						{{ t('links.halal') }}
					</NuxtLink>
					<NuxtLink
						class="takumi-nav-link"
						:class="getTextColor(links.news)"
						:aria-current="isActiveLink(links.news) ? 'page' : undefined"
						active-class=""
						exact-active-class=""
						aria-current-value=""
						:to="getLink(links.news)">
						{{ t('links.news') }}
					</NuxtLink>
					<NuxtLink
						class="takumi-nav-link"
						:class="getTextColor(links.knives)"
						:aria-current="isActiveLink(links.knives) ? 'page' : undefined"
						active-class=""
						exact-active-class=""
						aria-current-value=""
						:to="getLink(links.knives)">
						{{ t('links.knives') }}
					</NuxtLink>
					<a
						class="takumi-nav-link"
						:class="getTextColor(links.contact)"
						:aria-current="isActiveLink(links.contact) ? 'page' : undefined"
						:href="getLink(links.contact)">
						{{ t('links.contact') }}
					</a>
				</ul>

				<div class="takumi-nav-actions">
					<button
						type="button"
						@click="toggleLanguage"
						class="takumi-language-switch"
						:aria-label="t('links.language')">
						<span class="takumi-language-switch__icon" aria-hidden="true">
							<img :src="globeIconSrc" alt="" width="24" height="24" />
						</span>
						<span class="takumi-language-switch__label">
							<span
								class="takumi-language-switch__option"
								:class="{ 'takumi-language-switch__option--active': locale === 'en' }">
								EN
							</span>
							<span class="takumi-language-switch__divider" aria-hidden="true"></span>
							<span
								class="takumi-language-switch__option"
								:class="{ 'takumi-language-switch__option--active': locale === 'ja' }">
								日本語
							</span>
						</span>
					</button>
					<div
						class="dropdown dropdown-end lg:hidden"
						:class="{ 'dropdown-open': isMobileMenuOpen }"
						@keydown.esc.stop.prevent="closeMobileMenu">
						<button
							type="button"
							tabindex="0"
							class="takumi-menu-button btn btn-ghost btn-circle"
							:aria-expanded="isMobileMenuOpen"
							aria-controls="takumi-mobile-menu"
							:aria-label="t('links.menu')"
							@click.stop="toggleMobileMenu">
							<Icon :name="isMobileMenuOpen ? 'mdi:close' : 'mdi:menu'" class="text-2xl" />
						</button>
						<ul
							v-show="isMobileMenuOpen"
							id="takumi-mobile-menu"
							tabindex="-1"
							class="menu dropdown-content takumi-mobile-menu z-40 mt-3 w-56 p-2"
							@click.stop>
							<li>
								<NuxtLink
									:class="getTextColor(links.home)"
									active-class=""
									exact-active-class=""
									aria-current-value=""
									:to="getLink(links.home)"
									@click="closeMobileMenu">
									{{ t('links.home') }}
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									:class="getTextColor(links.halal)"
									active-class=""
									exact-active-class=""
									aria-current-value=""
									:to="getLink(links.halal)"
									@click="closeMobileMenu">
									{{ t('links.halal') }}
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									:class="getTextColor(links.news)"
									active-class=""
									exact-active-class=""
									aria-current-value=""
									:to="getLink(links.news)"
									@click="closeMobileMenu">
									{{ t('links.news') }}
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									:class="getTextColor(links.knives)"
									active-class=""
									exact-active-class=""
									aria-current-value=""
									:to="getLink(links.knives)"
									@click="closeMobileMenu">
									{{ t('links.knives') }}
								</NuxtLink>
							</li>
							<li>
								<a
									:class="getTextColor(links.contact)"
									:aria-current="isActiveLink(links.contact) ? 'page' : undefined"
									:href="getLink(links.contact)"
									@click="closeMobileMenu">
									{{ t('links.contact') }}
								</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</div>
	</header>
</template>

<script setup>
import { shouldShowSeibuAnnouncement } from '~/utils/seibuAnnouncementVisibility.mjs';
import { getLocalizedLink, toggleLocalePrefix } from '~/utils/navigation.mjs';

const router = useRouter();
const { locale, t } = useI18n();
const logoSrc = '/img/takumi-logo.webp';
const logoAlt = 'Takumi International';
const globeIconSrc = '/img/takumi-washi-glass/icon-globe.svg';
const currentRoute = router.currentRoute;
const browserHash = ref('');
const isNavigationHydrated = ref(false);
const isMobileMenuOpen = ref(false);
const SEIBU_FAIR_ROUTE = '/seibu-fair';
const seibuFairAnnouncement = computed(() => ({
	to: SEIBU_FAIR_ROUTE,
	label: t('seibuFair.announcement.label'),
	title: t('seibuFair.announcement.title'),
	actionLabel: t('seibuFair.announcement.actionLabel'),
}));
const showSeibuAnnouncement = computed(() => shouldShowSeibuAnnouncement(currentRoute.value.path));

const links = {
	home: `/`,
	halal: '/news/about-halal-product/',
	knives: '/knives/',
	news: '/newslist/',
	contact: '/#contact',
};
function syncBrowserHash() {
	if (typeof window === 'undefined') return;
	browserHash.value = window.location.hash;
}

onMounted(() => {
	syncBrowserHash();
	isNavigationHydrated.value = true;
	window.addEventListener('hashchange', syncBrowserHash);
	window.addEventListener('click', closeMobileMenu);
});

onBeforeUnmount(() => {
	window.removeEventListener('hashchange', syncBrowserHash);
	window.removeEventListener('click', closeMobileMenu);
});

watch(
	() => currentRoute.value.fullPath,
	() => {
		syncBrowserHash();
		closeMobileMenu();
	},
	{ flush: 'post' },
);

function toggleMobileMenu() {
	isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu() {
	isMobileMenuOpen.value = false;
}

function toggleLanguage() {
	closeMobileMenu();
	router.replace(toggleLocalePrefix(currentRoute.value.fullPath));
}

function getLink(baseLink) {
	return getLocalizedLink(baseLink, locale.value);
}

function normalizeRoutePath(path) {
	const cleanPath = String(path || '/')
		.split('#')[0]
		.split('?')[0];
	if (cleanPath === '/') return cleanPath;
	return cleanPath.replace(/\/$/, '');
}

function getCurrentHash() {
	if (!isNavigationHydrated.value) return '';
	return currentRoute.value.hash || browserHash.value;
}

function isActiveLink(path) {
	const target = getLink(path);
	const currentHash = getCurrentHash();

	if (currentHash && !target.includes('#')) {
		return false;
	}

	if (target.includes('#')) {
		const [targetPath, targetHash] = target.split('#');
		return (
			normalizeRoutePath(targetPath) === normalizeRoutePath(currentRoute.value.path) &&
			`#${targetHash}` === currentHash
		);
	}

	return normalizeRoutePath(target) === normalizeRoutePath(currentRoute.value.path);
}

function getTextColor(path) {
	return isActiveLink(path) ? 'text-primary' : 'text-secondary-500';
}
</script>

<style scoped>
.takumi-nav-shell {
	background: var(--tk-color-paper);
	border-bottom: 1px solid rgb(var(--tk-color-brand-brown-rgb) / 12%);
	box-shadow: 0 12px 30px rgb(var(--tk-color-ink-rgb) / 6%);
	inset: 0 0 auto;
	position: fixed;
	transition: all 0.24s ease;
	width: 100%;
	z-index: 30;
}

.takumi-nav-frame {
	margin: 0;
	width: 100%;
}

.takumi-nav-surface {
	align-items: center;
	background: transparent;
	border: 0;
	border-radius: 0;
	box-shadow: none;
	display: grid;
	gap: clamp(0.8rem, 2.2vw, 2.1rem);
	grid-template-columns: minmax(120px, 190px) 1fr minmax(140px, 205px);
	margin: 0 auto;
	min-height: clamp(4.35rem, 5.6vw, 5.4rem);
	padding-inline: clamp(1rem, 2.35vw, 2.85rem);
	width: min(calc(100% - calc(var(--tk-space-gutter) * 2)), 88rem);
}

.takumi-nav-logo-wrap {
	align-items: center;
	display: flex;
}

.takumi-nav-logo {
	align-items: center;
	color: var(--tk-color-brand-brown);
	display: inline-flex;
	width: 142px;
}

.takumi-nav-logo img {
	display: block;
	height: auto;
	width: 100%;
}

.takumi-nav-links {
	align-items: center;
	display: flex;
	gap: clamp(1rem, 2.4vw, 2.7rem);
	justify-content: center;
	margin: 0;
	padding: 0;
}

.takumi-nav-link {
	align-items: center;
	color: var(--tk-color-ink);
	display: inline-flex;
	font-size: clamp(0.96rem, 1vw, 1.08rem);
	font-weight: 640;
	justify-content: center;
	letter-spacing: 0;
	min-height: 2.75rem;
	position: relative;
	text-decoration: none;
	transition:
		color 0.24s ease,
		transform 0.24s ease;
}

.takumi-nav-link::after {
	background: var(--tk-color-event-red);
	border-radius: 999px;
	bottom: 0.28rem;
	content: '';
	height: 2px;
	left: 50%;
	position: absolute;
	transform: translateX(-50%) scaleX(0);
	transform-origin: center;
	transition: transform 0.24s ease;
	width: 2.4rem;
}

.takumi-nav-link:hover,
.takumi-nav-link.text-primary,
.takumi-nav-link[aria-current='page'] {
	color: var(--tk-color-brand-brown);
}

.takumi-nav-link:hover::after,
.takumi-nav-link.text-primary::after,
.takumi-nav-link[aria-current='page']::after {
	transform: translateX(-50%) scaleX(1);
}

.takumi-nav-actions {
	align-items: center;
	display: flex;
	gap: 0.6rem;
	justify-content: flex-end;
}

.takumi-language-switch {
	align-items: center;
	background: rgb(var(--tk-color-brand-brown-rgb) / 5%);
	border: 1px solid rgb(var(--tk-color-brand-brown-rgb) / 14%);
	border-radius: 999px;
	box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.38);
	color: var(--tk-color-brand-brown);
	display: inline-flex;
	gap: 0.72rem;
	min-height: 2.9rem;
	padding: 0.54rem 0.78rem;
	text-decoration: none;
	transition:
		background 0.24s ease,
		border-color 0.24s ease,
		transform 0.24s ease;
}

.takumi-language-switch:hover {
	background: rgb(var(--tk-color-brand-brown-rgb) / 9%);
	border-color: rgb(var(--tk-color-brand-brown-rgb) / 24%);
	transform: translateY(-1px);
}

.takumi-language-switch__icon {
	background: rgb(var(--tk-color-brand-brown-rgb) / 7%);
	border-radius: 999px;
	display: grid;
	height: 2.15rem;
	place-items: center;
	width: 2.15rem;
}

.takumi-language-switch__label {
	align-items: center;
	display: inline-flex;
	gap: 0.62rem;
	letter-spacing: 0;
	white-space: nowrap;
}

.takumi-language-switch__option {
	color: rgb(var(--tk-color-brand-brown-rgb) / 42%);
	font-weight: 640;
	transition: color 0.24s ease;
}

.takumi-language-switch__option--active {
	color: var(--tk-color-brand-brown);
}

.takumi-language-switch:hover
	.takumi-language-switch__option:not(.takumi-language-switch__option--active) {
	color: rgb(var(--tk-color-brand-brown-rgb) / 58%);
}

.takumi-language-switch__divider {
	background: rgb(var(--tk-color-brand-brown-rgb) / 22%);
	height: 1rem;
	width: 1px;
}

.takumi-menu-button {
	color: var(--tk-color-brand-brown);
	transition:
		background 0.2s ease,
		color 0.2s ease,
		transform 0.2s ease;
}

.takumi-menu-button[aria-expanded='true'] {
	background: rgb(var(--tk-color-brand-brown-rgb) / 8%);
	transform: rotate(90deg);
}

.takumi-mobile-menu {
	background:
		linear-gradient(120deg, rgba(255, 255, 255, 0.95), rgba(251, 251, 248, 0.9)),
		url('/img/takumi-washi-glass/pattern-washi.svg') center / 720px 720px repeat;
	border: 1px solid rgb(var(--tk-color-brand-brown-rgb) / 14%);
	border-radius: 1rem;
	box-shadow: 0 18px 44px rgb(var(--tk-color-ink-rgb) / 16%);
	color: var(--tk-color-ink);
}

@media (max-width: 1023px) {
	.takumi-nav-surface {
		gap: 1rem;
		grid-template-columns: 1fr auto;
		min-height: 4.75rem;
	}

	.takumi-nav-links {
		display: none;
	}

	.takumi-nav-logo {
		width: 138px;
	}

	.takumi-language-switch__divider,
	.takumi-language-switch__option:not(.takumi-language-switch__option--active) {
		display: none;
	}
}

@media (max-width: 620px) {
	.takumi-nav-frame {
		margin: 0;
		width: 100%;
	}

	.takumi-nav-surface {
		border-radius: 0;
		padding-inline: 1rem;
		width: 100%;
	}

	.takumi-language-switch {
		min-height: 2.85rem;
		padding: 0.52rem;
	}

	.takumi-language-switch__icon {
		height: 1.95rem;
		width: 1.95rem;
	}
}
</style>
