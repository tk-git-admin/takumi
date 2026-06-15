const SUPPORTED_LOCALES = new Set(['en', 'ja']);
const ARTICLE_HEADING_CLASS_PATTERN = /\b(?:c-heading-lv2|heading-lv3)\b/;
const ARTICLE_HEADING_MARKER_PATTERN =
	/^((?:(?:\s|&nbsp;|&#160;)*<(?:b|strong|span)\b[^>]*>)*(?:\s|&nbsp;|&#160;)*)[■●•・]\s*/i;
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

function asString(value) {
	return typeof value === 'string' ? value.trim() : '';
}

function decodeHtmlEntities(value) {
	return value.replace(/&(#\d+|#x[\da-f]+|quot|amp|lt|gt|apos);/gi, (match, entity) => {
		const normalized = entity.toLowerCase();
		if (normalized === 'quot') return '"';
		if (normalized === 'amp') return '&';
		if (normalized === 'lt') return '<';
		if (normalized === 'gt') return '>';
		if (normalized === 'apos') return "'";

		const codePoint = normalized.startsWith('#x')
			? Number.parseInt(normalized.slice(2), 16)
			: Number.parseInt(normalized.slice(1), 10);

		return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
	});
}

function stripArticleHeadingMarker(content) {
	return content.replace(ARTICLE_HEADING_MARKER_PATTERN, '$1');
}

function normalizeArticleHeadingMarkers(article) {
	if (typeof article !== 'string' || !article) {
		return article;
	}

	return article.replace(
		/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi,
		(match, level, attributes, content) => {
			if (!ARTICLE_HEADING_CLASS_PATTERN.test(attributes)) {
				return match;
			}

			return `<h${level}${attributes}>${stripArticleHeadingMarker(content)}</h${level}>`;
		},
	);
}

function normalizeNewsArticle(details) {
	const article = details?.news?.article;
	const normalizedArticle = normalizeArticleHeadingMarkers(article);

	if (normalizedArticle === article) {
		return details;
	}

	return {
		...details,
		news: {
			...details.news,
			article: normalizedArticle,
		},
	};
}

function preferNativeTitleForHero(details) {
	if (!details || typeof details !== 'object' || Array.isArray(details)) {
		return details || null;
	}

	const detailsWithArticle = normalizeNewsArticle(details);
	const nativeTitle = decodeHtmlEntities(asString(details.subject));
	if (!nativeTitle) {
		return detailsWithArticle;
	}

	const hero = detailsWithArticle.hero;
	if (!hero || typeof hero !== 'object' || Array.isArray(hero)) {
		return detailsWithArticle;
	}

	return {
		...detailsWithArticle,
		hero: {
			...hero,
			hero_title: nativeTitle,
		},
	};
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
		details: preferNativeTitleForHero(response.details),
		pageInfo: response.pageInfo || null,
	};
}

export function findNewsBySlug(list, slug) {
	const details = Array.isArray(list)
		? list.find((item) => String(item?.slug || '') === String(slug))
		: null;

	return {
		details: preferNativeTitleForHero(details),
		pageInfo: null,
	};
}
