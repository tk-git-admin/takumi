const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://takumi-international.g.kuroco-front.app/';

export default defineNuxtConfig({
	app: {
		head: {
			script: [{ type: 'text/javascript', src: 'https://code.jquery.com/jquery-3.6.1.min.js' }],
		},
	},
	runtimeConfig: {
		kurocoBaseUrl: process.env.KUROCO_BASE_URL || 'https://takumi-international.g.kuroco.app',
		kurocoHomeId: process.env.KUROCO_HOME_ID || '3',
		kurocoHomeSlugId: process.env.KUROCO_HOME_SLUG_ID || '3',
		kurocoNewsBlogId: process.env.KUROCO_NEWS_BLOG_ID || '4',
		kurocoProductsId: process.env.KUROCO_PRODUCTS_ID || '6',
		kurocoKnivesId: process.env.KUROCO_KNIVES_ID || '7',
		kurocoFormJpId: process.env.KUROCO_FORM_JP_ID || '3',
		kurocoFormEngId: process.env.KUROCO_FORM_ENG_ID || '1',
		kurocoApiAccessToken: process.env.KUROCO_API_ACCESS_TOKEN || '',
		kurocoSeibuContentPath:
			process.env.KUROCO_SEIBU_CONTENT_PATH || '/rcms-api/3/seibu-content',
		kurocoSeibuWorkshopPath:
			process.env.KUROCO_SEIBU_WORKSHOP_PATH || '/rcms-api/3/seibu-workshop',
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
		preset: 'cloudflare-module',
		cloudflare: {
			deployConfig: true,
			nodeCompat: true,
		},
	},
	modules: ['@nuxtjs/i18n', '@pinia/nuxt', '@nuxtjs/tailwindcss', 'nuxt-icon'],
	css: ['@/assets/css/tokens.css', '@/assets/css/main.css'],
	i18n: {
		vueI18n: './i18n.config.ts',
		baseUrl: siteUrl,
		precompile: { strictMessage: false },
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
