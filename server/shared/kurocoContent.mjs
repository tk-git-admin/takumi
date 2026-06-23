const SUPPORTED_LOCALES = new Set(['en', 'ja']);
const KUROCO_IMAGE_HOST_SUFFIX = '.g.kuroco-img.app';
const ARTICLE_IMAGE_PRESET = {
	width: 1200,
	widths: [640, 960, 1200],
	sizes: '(min-width: 1024px) 960px, 100vw',
	quality: 75,
	loading: 'lazy',
};
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

function normalizeUrlSource(src) {
	return asString(src).replace(/&amp;/g, '&');
}

function isKurocoImageUrl(src) {
	const source = normalizeUrlSource(src);
	if (!source) return false;

	try {
		return new URL(source).hostname.endsWith(KUROCO_IMAGE_HOST_SUFFIX);
	} catch {
		return false;
	}
}

function setImageParam(url, name, value) {
	if (value === undefined || value === null || value === '') return;

	const number = Number(value);
	if (Number.isFinite(number) && number > 0) {
		url.searchParams.set(name, String(Math.round(number)));
		return;
	}

	url.searchParams.set(name, String(value));
}

function withKurocoImageParams(src, modifiers = {}) {
	const source = normalizeUrlSource(src);
	if (!isKurocoImageUrl(source)) return asString(src);

	const url = new URL(source);
	setImageParam(url, 'width', modifiers.width);
	setImageParam(url, 'quality', modifiers.quality);

	return url.toString();
}

function getKurocoImageSrcset(src, preset) {
	if (!isKurocoImageUrl(src)) return '';

	return preset.widths
		.map((width) => `${withKurocoImageParams(src, { width, quality: preset.quality })} ${width}w`)
		.join(', ');
}

function escapeHtmlAttribute(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function readImgAttribute(tag, name) {
	const pattern = new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i');
	const match = tag.match(pattern);

	return match ? match[1] || match[2] || match[3] || '' : '';
}

function setImgAttribute(tag, name, value) {
	if (value === undefined || value === null || value === '') return tag;

	const nextAttribute = ` ${name}="${escapeHtmlAttribute(value)}"`;
	const pattern = new RegExp(`\\s${name}\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]+)`, 'i');

	if (pattern.test(tag)) {
		return tag.replace(pattern, nextAttribute);
	}

	return tag.replace(/\s*\/?>$/, (ending) => `${nextAttribute}${ending}`);
}

function optimizeKurocoHtmlImages(html, preset = ARTICLE_IMAGE_PRESET) {
	if (typeof html !== 'string' || !html) return html;

	return html.replace(/<img\b[^>]*>/gi, (tag) => {
		const src = readImgAttribute(tag, 'src');
		if (!isKurocoImageUrl(src)) return tag;

		let nextTag = setImgAttribute(
			tag,
			'src',
			withKurocoImageParams(src, { width: preset.width, quality: preset.quality }),
		);
		nextTag = setImgAttribute(nextTag, 'srcset', getKurocoImageSrcset(src, preset));
		nextTag = setImgAttribute(nextTag, 'sizes', preset.sizes);
		nextTag = setImgAttribute(nextTag, 'width', preset.width);
		nextTag = setImgAttribute(nextTag, 'loading', preset.loading);
		nextTag = setImgAttribute(nextTag, 'decoding', 'async');

		return nextTag;
	});
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
	const normalizedArticle = optimizeKurocoHtmlImages(
		normalizeArticleHeadingMarkers(article),
		ARTICLE_IMAGE_PRESET,
	);

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
