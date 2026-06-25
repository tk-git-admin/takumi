const KUROCO_IMAGE_HOST_SUFFIX = '.g.kuroco-img.app';
const KUROCO_TOPIC_PATH_PATTERN = /^\/(?:v=[^/]+\/)?files\/topics\/[^?#]+/;
const RELATIVE_KUROCO_URL_BASE = 'https://kuroco-image.local';
const DEFAULT_QUALITY = 75;

export const KUROCO_IMAGE_PRESETS = {
	newsCard: {
		width: 640,
		height: 400,
		widths: [320, 480, 640, 800],
		sizes: '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw',
		quality: DEFAULT_QUALITY,
		loading: 'lazy',
	},
	productCard: {
		width: 640,
		widths: [320, 480, 640, 800],
		sizes: '(min-width: 1024px) 25vw, (min-width: 576px) 50vw, 50vw',
		quality: DEFAULT_QUALITY,
		loading: 'lazy',
	},
	knifeCard: {
		width: 640,
		height: 640,
		widths: [320, 480, 640, 800],
		sizes: '(min-width: 1120px) 25vw, (min-width: 640px) 33vw, 50vw',
		quality: DEFAULT_QUALITY,
		loading: 'lazy',
	},
	modalImage: {
		width: 1200,
		height: 900,
		widths: [640, 900, 1200, 1600],
		sizes: '(min-width: 768px) 55vw, 100vw',
		quality: DEFAULT_QUALITY,
		loading: 'lazy',
	},
	modalThumb: {
		width: 240,
		height: 180,
		widths: [160, 240, 320],
		sizes: '112px',
		quality: DEFAULT_QUALITY,
		loading: 'lazy',
	},
	heroImage: {
		width: 1600,
		widths: [960, 1200, 1600],
		sizes: '100vw',
		quality: DEFAULT_QUALITY,
		loading: 'eager',
	},
	articleImage: {
		width: 1200,
		widths: [640, 960, 1200],
		sizes: '(min-width: 1024px) 960px, 100vw',
		quality: DEFAULT_QUALITY,
		loading: 'lazy',
	},
	seibuPoster: {
		width: 1200,
		widths: [640, 960, 1200],
		sizes: '(min-width: 1024px) 50vw, 100vw',
		format: 'jpg',
		quality: DEFAULT_QUALITY,
		loading: 'eager',
	},
	seibuLogo: {
		width: 640,
		widths: [320, 480, 640],
		sizes: '(min-width: 768px) 28rem, 100vw',
		quality: DEFAULT_QUALITY,
		loading: 'eager',
	},
	seibuExhibitorLogo: {
		width: 480,
		widths: [240, 320, 480],
		sizes: '224px',
		quality: DEFAULT_QUALITY,
		loading: 'lazy',
	},
	seibuProduct: {
		width: 640,
		widths: [320, 480, 640, 800],
		sizes: '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw',
		format: 'jpg',
		quality: DEFAULT_QUALITY,
		loading: 'lazy',
	},
};

function asString(value) {
	return typeof value === 'string' ? value.trim() : '';
}

function normalizePreset(preset = {}) {
	if (typeof preset === 'string') {
		return KUROCO_IMAGE_PRESETS[preset] || {};
	}

	return preset || {};
}

function normalizeUrlSource(src) {
	return asString(src).replace(/&amp;/g, '&');
}

function isRelativeKurocoImagePath(src) {
	return KUROCO_TOPIC_PATH_PATTERN.test(src);
}

export function isKurocoImageUrl(src) {
	const source = normalizeUrlSource(src);
	if (!source) return false;
	if (isRelativeKurocoImagePath(source)) return true;

	try {
		const url = new URL(source);
		return url.hostname.endsWith(KUROCO_IMAGE_HOST_SUFFIX);
	} catch {
		return false;
	}
}

function setParam(url, name, value) {
	if (value === undefined || value === null || value === '') return;

	const number = Number(value);
	if (Number.isFinite(number) && number > 0) {
		url.searchParams.set(name, String(Math.round(number)));
		return;
	}

	url.searchParams.set(name, String(value));
}

function createKurocoUrl(source) {
	if (isRelativeKurocoImagePath(source)) {
		return {
			url: new URL(source, RELATIVE_KUROCO_URL_BASE),
			isRelative: true,
		};
	}

	try {
		const url = new URL(source);
		if (!url.hostname.endsWith(KUROCO_IMAGE_HOST_SUFFIX)) return null;

		return { url, isRelative: false };
	} catch {
		return null;
	}
}

function stringifyKurocoUrl({ url, isRelative }) {
	if (!isRelative) return url.toString();

	return `${url.pathname}${url.search}${url.hash}`;
}

export function withKurocoImageParams(src, modifiers = {}) {
	const source = normalizeUrlSource(src);
	const kurocoUrl = createKurocoUrl(source);
	if (!kurocoUrl) return asString(src);

	const { url } = kurocoUrl;
	setParam(url, 'width', modifiers.width);
	setParam(url, 'height', modifiers.height);
	setParam(url, 'format', modifiers.format);
	setParam(url, 'quality', modifiers.quality);

	return stringifyKurocoUrl(kurocoUrl);
}

function uniqueWidths(widths = []) {
	return [...new Set(widths.map((width) => Number(width)).filter((width) => width > 0))]
		.map((width) => Math.round(width))
		.sort((a, b) => a - b);
}

export function getKurocoImageSrcset(src, preset = {}) {
	const source = normalizeUrlSource(src);
	const config = normalizePreset(preset);
	const widths = uniqueWidths(config.widths);

	if (!isKurocoImageUrl(source) || widths.length === 0) return undefined;

	const quality = config.quality ?? DEFAULT_QUALITY;

	return widths
		.map(
			(width) =>
				`${withKurocoImageParams(source, { width, format: config.format, quality })} ${width}w`,
		)
		.join(', ');
}

export function getKurocoImagePreset(src, preset = {}) {
	const config = normalizePreset(preset);
	const source = asString(src);
	const quality = config.quality ?? DEFAULT_QUALITY;

	return {
		src: withKurocoImageParams(source, {
			width: config.width,
			height: config.heightParam,
			format: config.format,
			quality,
		}),
		srcset: getKurocoImageSrcset(source, config),
		sizes: config.sizes,
		width: config.width,
		height: config.height,
		loading: config.loading || 'lazy',
		decoding: 'async',
	};
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

export function optimizeKurocoHtmlImages(html, preset = KUROCO_IMAGE_PRESETS.articleImage) {
	if (typeof html !== 'string' || !html) return html;

	return html.replace(/<img\b[^>]*>/gi, (tag) => {
		const src = readImgAttribute(tag, 'src');
		if (!isKurocoImageUrl(src)) return tag;

		const image = getKurocoImagePreset(src, preset);
		let nextTag = setImgAttribute(tag, 'src', image.src);
		nextTag = setImgAttribute(nextTag, 'srcset', image.srcset);
		nextTag = setImgAttribute(nextTag, 'sizes', image.sizes);
		nextTag = setImgAttribute(nextTag, 'width', image.width);
		nextTag = setImgAttribute(nextTag, 'height', image.height);
		nextTag = setImgAttribute(nextTag, 'loading', image.loading);
		nextTag = setImgAttribute(nextTag, 'decoding', image.decoding);

		return nextTag;
	});
}
