const SUPPORTED_LOCALES = new Set(['en', 'ja']);
const CONTENT_PATHS = {
	home: ({ homeId, homeSlugId }) => `/rcms-api/${homeId}/home/${homeSlugId}`,
	news: ({ newsBlogId }) => `/rcms-api/${newsBlogId}/newsblog`,
	products: ({ productsId }) => `/rcms-api/${productsId}/products`,
	knives: ({ knivesId }) => `/rcms-api/${knivesId}/knives`,
};

export function normalizeLocale(locale = 'en') {
	const value = String(locale || 'en');
	if (!SUPPORTED_LOCALES.has(value)) {
		throw new Error(`Unsupported locale: ${value}`);
	}
	return value;
}

export function isValidSlug(slug) {
	return /^[A-Za-z0-9_-]+$/.test(String(slug || ''));
}

export function buildKurocoContentUrl(config, contentType, locale = 'en') {
	const pathBuilder = CONTENT_PATHS[contentType];
	if (!pathBuilder) {
		throw new Error(`Unsupported content type: ${contentType}`);
	}

	const url = new URL(pathBuilder(config.apiIds), config.baseUrl);
	if (normalizeLocale(locale) === 'ja') {
		url.searchParams.set('_lang', 'ja');
	}
	return url.href;
}

export function normalizeListResponse(response = {}) {
	return {
		list: Array.isArray(response.list) ? response.list : [],
		pageInfo: response.pageInfo || null,
	};
}

export function normalizeDetailsResponse(response = {}) {
	return {
		details: response.details || null,
		pageInfo: response.pageInfo || null,
	};
}

export function findNewsBySlug(list, slug) {
	const details = Array.isArray(list)
		? list.find((item) => String(item?.slug || '') === String(slug))
		: null;

	return {
		details: details || null,
		pageInfo: null,
	};
}
