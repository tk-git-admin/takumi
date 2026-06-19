<template>
	<footer class="takumi-footer">
		<div class="takumi-footer__inner">
			<section class="takumi-footer__brand" :aria-label="t('footer.brandLabel')">
				<NuxtLink class="takumi-footer__logo" :to="getLocalizedLink('/', locale)" no-prefetch>
					<img :src="logoSrc" :alt="logoAlt" />
				</NuxtLink>
				<p class="takumi-footer__kicker">{{ t('footer.kicker') }}</p>
				<p class="takumi-footer__description">{{ t('footer.description') }}</p>
			</section>

			<nav class="takumi-footer__nav" :aria-label="t('footer.navLabel')">
				<p class="takumi-footer__heading">{{ t('footer.navLabel') }}</p>
				<ul class="takumi-footer__link-list">
					<li v-for="link in footerLinks" :key="link.labelKey">
						<a
							v-if="isHashLink(link.path)"
							class="takumi-footer__link"
							:href="getLocalizedLink(link.path, locale)">
							{{ t(link.labelKey) }}
						</a>
						<NuxtLink v-else class="takumi-footer__link" :to="getLocalizedLink(link.path, locale)">
							{{ t(link.labelKey) }}
						</NuxtLink>
					</li>
				</ul>
			</nav>

			<section class="takumi-footer__connect" :aria-label="t('footer.socialLabel')">
				<p class="takumi-footer__heading">{{ t('footer.socialLabel') }}</p>
				<div class="takumi-footer__social-list">
					<a
						v-for="social in socialLinks"
						:key="social.label"
						class="takumi-footer__social-link"
						:href="social.href"
						target="_blank"
						rel="noopener noreferrer"
						:aria-label="social.label">
						<img :src="social.icon" alt="" aria-hidden="true" />
					</a>
				</div>
			</section>
		</div>

		<div class="takumi-footer__bottom">
			<p>{{ t('footer.copyright', { year: currentYear }) }}</p>
			<p>{{ t('footer.region') }}</p>
		</div>
	</footer>
</template>

<script setup>
import { getLocalizedLink, isHashLink } from '~/utils/navigation.mjs';

const { locale, t } = useI18n();

const logoSrc = '/img/takumi-logo-white.webp';
const logoAlt = 'Takumi International';
const currentYear = new Date().getFullYear();

const footerLinks = [
	{ labelKey: 'links.home', path: '/' },
	{ labelKey: 'links.halal', path: '/news/about-halal-product/' },
	{ labelKey: 'links.news', path: '/newslist/' },
	{ labelKey: 'links.knives', path: '/knives/' },
	{ labelKey: 'links.contact', path: '/#contact' },
];

const socialLinks = [
	{
		label: 'LinkedIn',
		href: 'https://www.linkedin.com/company/takumi-international/',
		icon: '/img/linkedin.png',
	},
	{
		label: 'Shopee',
		href: 'https://shopee.com.my/takumi.store/',
		icon: '/img/shopee.png',
	},
	{
		label: 'TikTok',
		href: 'https://www.tiktok.com/@takumi.intl',
		icon: '/img/tiktok.svg',
	},
];
</script>

<style scoped>
.takumi-footer {
	background:
		linear-gradient(135deg, rgb(var(--tk-color-ink-rgb) / 96%), rgb(23 26 26 / 98%)),
		url('/img/takumi-washi-glass/pattern-washi.svg') center / 760px 760px repeat;
	border-top: 1px solid rgb(var(--tk-color-brand-brown-rgb) / 22%);
	color: rgb(var(--tk-color-white-rgb) / 82%);
	margin-top: clamp(3rem, 7vw, 6rem);
	padding: clamp(3rem, 6vw, 5.5rem) var(--tk-space-gutter) clamp(1.1rem, 2vw, 1.5rem);
	position: relative;
}

.takumi-footer::before {
	background: linear-gradient(
		90deg,
		var(--tk-color-brand-brown),
		var(--tk-color-event-gold),
		var(--tk-color-moss)
	);
	content: '';
	height: 0.22rem;
	inset: 0 0 auto;
	position: absolute;
}

.takumi-footer__inner,
.takumi-footer__bottom {
	margin-inline: auto;
	width: min(100%, var(--tk-content-max));
}

.takumi-footer__inner {
	align-items: start;
	display: grid;
	gap: clamp(2rem, 5vw, 4.5rem);
	grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.95fr) minmax(13rem, 0.65fr);
}

.takumi-footer__brand,
.takumi-footer__nav,
.takumi-footer__connect {
	min-width: 0;
}

.takumi-footer__logo {
	display: inline-flex;
}

.takumi-footer__logo img {
	display: block;
	height: 48px;
	width: auto;
}

.takumi-footer__kicker {
	color: rgb(var(--tk-color-white-rgb) / 58%);
	font-size: 0.78rem;
	font-weight: 760;
	letter-spacing: 0.12em;
	line-height: 1.35;
	margin: clamp(1.3rem, 2.8vw, 2rem) 0 0;
	text-transform: uppercase;
}

.takumi-footer__description {
	color: rgb(var(--tk-color-white-rgb) / 82%);
	font-size: clamp(1rem, 1.45vw, 1.18rem);
	font-weight: 520;
	letter-spacing: 0;
	line-height: 1.75;
	margin: 0.75rem 0 0;
	max-width: 35rem;
	text-wrap: pretty;
}

.takumi-footer__heading {
	color: var(--tk-color-white);
	font-size: 0.82rem;
	font-weight: 780;
	letter-spacing: 0.1em;
	line-height: 1.3;
	margin: 0 0 1rem;
	text-transform: uppercase;
}

.takumi-footer__link-list {
	display: grid;
	gap: 0.7rem;
	list-style: none;
	margin: 0;
	padding: 0;
}

.takumi-footer__link {
	align-items: center;
	color: rgb(var(--tk-color-white-rgb) / 76%);
	display: inline-flex;
	font-weight: 650;
	letter-spacing: 0;
	min-height: 2.75rem;
	text-decoration: none;
	transition:
		color 0.2s ease,
		transform 0.2s ease;
}

.takumi-footer__link:hover {
	color: var(--tk-color-white);
	transform: translateX(0.18rem);
}

.takumi-footer__social-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.72rem;
}

.takumi-footer__social-link {
	align-items: center;
	background: rgb(var(--tk-color-white-rgb) / 92%);
	border: 1px solid rgb(var(--tk-color-white-rgb) / 16%);
	border-radius: 999px;
	box-shadow: 0 0.85rem 2rem rgb(0 0 0 / 16%);
	display: inline-flex;
	height: 2.9rem;
	justify-content: center;
	transition:
		background 0.2s ease,
		border-color 0.2s ease,
		transform 0.2s ease;
	width: 2.9rem;
}

.takumi-footer__social-link:hover {
	background: var(--tk-color-white);
	border-color: rgb(var(--tk-color-event-gold-rgb) / 72%);
	transform: translateY(-0.12rem);
}

.takumi-footer__social-link img {
	display: block;
	height: 1.42rem;
	object-fit: contain;
	width: 1.42rem;
}

.takumi-footer__bottom {
	align-items: center;
	border-top: 1px solid rgb(var(--tk-color-white-rgb) / 12%);
	color: rgb(var(--tk-color-white-rgb) / 58%);
	display: flex;
	flex-wrap: wrap;
	font-size: 0.9rem;
	gap: 0.75rem 1.5rem;
	justify-content: space-between;
	margin-top: clamp(2.4rem, 5vw, 4rem);
	padding-top: 1.2rem;
}

.takumi-footer__bottom p {
	margin: 0;
}

@media (max-width: 900px) {
	.takumi-footer__inner {
		grid-template-columns: minmax(0, 1.15fr) minmax(13rem, 0.85fr);
	}

	.takumi-footer__brand {
		grid-column: 1 / -1;
	}
}

@media (max-width: 760px) {
	.takumi-footer {
		margin-top: clamp(2.5rem, 10vw, 4rem);
		padding-bottom: 5.25rem;
	}

	.takumi-footer__inner {
		gap: 2rem;
		grid-template-columns: 1fr;
	}

	.takumi-footer__bottom {
		align-items: flex-start;
		flex-direction: column;
	}
}

@media (prefers-reduced-motion: reduce) {
	.takumi-footer__link,
	.takumi-footer__social-link {
		transition: none;
	}
}
</style>
