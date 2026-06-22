import { gtmBootstrap, gtmNoscript } from './config/gtm';

const isCloudflarePagesBuild = Boolean(process.env.CF_PAGES_BUILD);
const GTM_ID = process.env.NUXT_PUBLIC_GTM_ID || '';
const siteUrl =
	process.env.NUXT_PUBLIC_SITE_URL || 'https://takumi-international.g.kuroco-front.app/';
const basicAuthPreviewHostnames =
	process.env.NUXT_BASIC_AUTH_PREVIEW_HOSTNAMES || process.env.BASIC_AUTH_PREVIEW_HOSTNAMES || '';
const PREVIEW_HOSTNAMES = basicAuthPreviewHostnames
	? basicAuthPreviewHostnames
			.split(',')
			.map((hostname) => hostname.trim())
			.filter(Boolean)
	: [];

export default defineNuxtConfig({
	compatibilityDate: '2026-06-08',
	app: {
		head: {
			script: [
				...(GTM_ID
					? [
							{
								innerHTML: gtmBootstrap(GTM_ID),
								tagPosition: 'head',
								tagPriority: 'critical',
							},
						]
					: []),
				{ type: 'text/javascript', src: 'https://code.jquery.com/jquery-3.6.1.min.js' },
			],
			noscript: GTM_ID
				? [
						{
							innerHTML: gtmNoscript(GTM_ID),
							tagPosition: 'bodyOpen',
						},
					]
				: [],
		},
	},
	runtimeConfig: {
		basicAuthUsername:
			process.env.NUXT_BASIC_AUTH_USERNAME || process.env.BASIC_AUTH_USERNAME || '',
		basicAuthPassword:
			process.env.NUXT_BASIC_AUTH_PASSWORD || process.env.BASIC_AUTH_PASSWORD || '',
		basicAuthEnabled:
			process.env.NUXT_BASIC_AUTH_ENABLED === 'true' || process.env.BASIC_AUTH_ENABLED === 'true',
		previewHostnames: PREVIEW_HOSTNAMES,
		kurocoBaseUrl: process.env.KUROCO_BASE_URL || 'https://takumi-international.g.kuroco.app',
		kurocoHomeId: process.env.KUROCO_HOME_ID || '3',
		kurocoHomeSlugId: process.env.KUROCO_HOME_SLUG_ID || '3',
		kurocoNewsBlogId: process.env.KUROCO_NEWS_BLOG_ID || '4',
		kurocoProductsId: process.env.KUROCO_PRODUCTS_ID || '6',
		kurocoKnivesId: process.env.KUROCO_KNIVES_ID || '7',
		kurocoFormJpId: process.env.KUROCO_FORM_JP_ID || '3',
		kurocoFormEngId: process.env.KUROCO_FORM_ENG_ID || '1',
		kurocoHomepageToken: process.env.KUROCO_HOMEPAGE_TOKEN || '',
		kurocoNewsToken: process.env.KUROCO_NEWS_TOKEN || '',
		kurocoProductsToken: process.env.KUROCO_PRODUCTS_TOKEN || '',
		kurocoKnivesToken: process.env.KUROCO_KNIVES_TOKEN || '',
		kurocoSeibuContentPath: process.env.KUROCO_SEIBU_CONTENT_PATH || '/rcms-api/3/seibu-content',
		kurocoSeibuWorkshopPath: process.env.KUROCO_SEIBU_WORKSHOP_PATH || '/rcms-api/3/seibu-workshop',
		kurocoSeibuReservationPostPath:
			process.env.KUROCO_SEIBU_RESERVATION_POST_PATH || '/rcms-api/1/seibu',
		kurocoSeibuFormId: process.env.KUROCO_SEIBU_FORM_ID || '',
		kurocoSeibuFormApiId: process.env.KUROCO_SEIBU_FORM_API_ID || '1',
		kurocoSeibuReservationListPath:
			process.env.KUROCO_SEIBU_RESERVATION_LIST_PATH || '/rcms-api/1/seibu-reservations',
		public: {
			siteUrl,
		},
	},
	devtools: { enabled: true },
	nitro: {
		preset: isCloudflarePagesBuild ? 'cloudflare_pages' : 'cloudflare_module',
		cloudflare: {
			deployConfig: true,
			nodeCompat: true,
			wrangler: isCloudflarePagesBuild
				? undefined
				: {
						name: 'takumi',
						preview_urls: true,
						observability: {
							enabled: true,
							logs: {
								enabled: true,
							},
						},
						logpush: true,
					},
		},
	},
	modules: ['@nuxtjs/i18n', '@pinia/nuxt', '@nuxtjs/tailwindcss', 'nuxt-icon'],
	css: ['@/assets/css/tokens.css', '@/assets/css/main.css'],
	i18n: {
		vueI18n: './i18n.config.ts',
		baseUrl: siteUrl,
		// strategy: "prefix",
		strategy: 'prefix_except_default',
		defaultLocale: 'en',
		detectBrowserLanguage: false,
		locales: [
			{
				code: 'en',
				name: 'English',
				iso: 'en-US',
			},
			{
				code: 'ja',
				name: 'Japanese',
			},
		],
	},
	build: {
		transpile: ['vue-toastification'],
	},
	plugins: [{ src: '@/plugins/aos', ssr: false, mode: 'client' }],
});
