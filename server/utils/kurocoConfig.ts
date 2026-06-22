import type { H3Event } from 'h3';

export type KurocoContentType = 'home' | 'news' | 'products' | 'knives';

type KurocoRuntimeConfig = Record<string, unknown>;
type CloudflareEventContext = {
	_platform?: {
		cloudflare?: {
			env?: Record<string, unknown>;
		};
	};
	cloudflare?: {
		env?: Record<string, unknown>;
	};
};

const KUROCO_TOKEN_CONFIG_KEYS: Record<KurocoContentType, string> = {
	home: 'kurocoHomepageToken',
	news: 'kurocoNewsToken',
	products: 'kurocoProductsToken',
	knives: 'kurocoKnivesToken',
};

function cloudflareEnv(event: H3Event) {
	const context = event.context as CloudflareEventContext;

	return context.cloudflare?.env ?? context._platform?.cloudflare?.env ?? {};
}

export function runtimeString(config: KurocoRuntimeConfig, key: string) {
	const value = config[key];
	return typeof value === 'string' ? value.trim() : String(value || '').trim();
}

function envString(env: Record<string, unknown>, key: string) {
	const value = env[key];
	return typeof value === 'string' ? value.trim() : String(value || '').trim();
}

function readRuntimeConfigValue(
	runtimeConfig: KurocoRuntimeConfig,
	cfEnv: Record<string, unknown>,
	configKey: string,
	envKey: string,
	fallback = '',
) {
	return envString(cfEnv, envKey) || runtimeString(runtimeConfig, configKey) || fallback;
}

export function getKurocoRuntimeConfig(event: H3Event) {
	const runtimeConfig = useRuntimeConfig(event);
	const cfEnv = cloudflareEnv(event);

	return {
		kurocoBaseUrl: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoBaseUrl',
			'KUROCO_BASE_URL',
			'https://takumi-international.g.kuroco.app',
		),
		kurocoHomeId: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoHomeId',
			'KUROCO_HOME_ID',
			'3',
		),
		kurocoHomeSlugId: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoHomeSlugId',
			'KUROCO_HOME_SLUG_ID',
			'3',
		),
		kurocoNewsBlogId: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoNewsBlogId',
			'KUROCO_NEWS_BLOG_ID',
			'4',
		),
		kurocoProductsId: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoProductsId',
			'KUROCO_PRODUCTS_ID',
			'6',
		),
		kurocoKnivesId: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoKnivesId',
			'KUROCO_KNIVES_ID',
			'7',
		),
		kurocoFormJpId: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoFormJpId',
			'KUROCO_FORM_JP_ID',
			'3',
		),
		kurocoFormEngId: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoFormEngId',
			'KUROCO_FORM_ENG_ID',
			'1',
		),
		kurocoHomepageToken: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoHomepageToken',
			'KUROCO_HOMEPAGE_TOKEN',
		),
		kurocoNewsToken: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoNewsToken',
			'KUROCO_NEWS_TOKEN',
		),
		kurocoProductsToken: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoProductsToken',
			'KUROCO_PRODUCTS_TOKEN',
		),
		kurocoKnivesToken: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoKnivesToken',
			'KUROCO_KNIVES_TOKEN',
		),
		kurocoSeibuContentPath: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoSeibuContentPath',
			'KUROCO_SEIBU_CONTENT_PATH',
			'/rcms-api/3/seibu-content',
		),
		kurocoSeibuWorkshopPath: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoSeibuWorkshopPath',
			'KUROCO_SEIBU_WORKSHOP_PATH',
			'/rcms-api/3/seibu-workshop',
		),
		kurocoSeibuReservationPostPath: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoSeibuReservationPostPath',
			'KUROCO_SEIBU_RESERVATION_POST_PATH',
			'/rcms-api/1/seibu',
		),
		kurocoSeibuFormId: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoSeibuFormId',
			'KUROCO_SEIBU_FORM_ID',
		),
		kurocoSeibuFormApiId: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoSeibuFormApiId',
			'KUROCO_SEIBU_FORM_API_ID',
			'1',
		),
		kurocoSeibuReservationListPath: readRuntimeConfigValue(
			runtimeConfig,
			cfEnv,
			'kurocoSeibuReservationListPath',
			'KUROCO_SEIBU_RESERVATION_LIST_PATH',
			'/rcms-api/1/seibu-reservations',
		),
	};
}

export function getKurocoApiConfig(config: KurocoRuntimeConfig) {
	return {
		baseUrl: runtimeString(config, 'kurocoBaseUrl'),
		apiIds: {
			homeId: runtimeString(config, 'kurocoHomeId'),
			homeSlugId: runtimeString(config, 'kurocoHomeSlugId'),
			newsBlogId: runtimeString(config, 'kurocoNewsBlogId'),
			productsId: runtimeString(config, 'kurocoProductsId'),
			knivesId: runtimeString(config, 'kurocoKnivesId'),
		},
	};
}

export function getKurocoAcceptHeaders() {
	return { accept: '*/*' };
}

export function getKurocoStaticTokenHeaders(
	config: KurocoRuntimeConfig,
	contentType: KurocoContentType,
) {
	const token = runtimeString(config, KUROCO_TOKEN_CONFIG_KEYS[contentType]);
	const headers: Record<string, string> = getKurocoAcceptHeaders();

	if (token) {
		headers['X-RCMS-API-ACCESS-TOKEN'] = token;
	}

	return headers;
}
