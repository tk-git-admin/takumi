import {
	buildKurocoContentUrl,
	findNewsBySlug,
	isValidSlug,
	normalizeDetailsResponse,
	normalizeListResponse,
	normalizeLocale,
} from '../shared/kurocoContent.mjs';

type ContentType = 'home' | 'news' | 'products' | 'knives';

function getKurocoConfig() {
	const config = useRuntimeConfig();

	return {
		baseUrl: String(config.kurocoBaseUrl),
		apiIds: {
			homeId: String(config.kurocoHomeId),
			homeSlugId: String(config.kurocoHomeSlugId),
			newsBlogId: String(config.kurocoNewsBlogId),
			productsId: String(config.kurocoProductsId),
			knivesId: String(config.kurocoKnivesId),
		},
	};
}

export function getRequestLocale(event: Parameters<typeof getQuery>[0]) {
	try {
		return normalizeLocale(getQuery(event).lang);
	} catch (error) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Unsupported locale',
		});
	}
}

async function fetchKurocoContent(event: Parameters<typeof getQuery>[0], contentType: ContentType) {
	const url = buildKurocoContentUrl(getKurocoConfig(), contentType, getRequestLocale(event));
	return await $fetch<Record<string, unknown>>(url);
}

export async function fetchKurocoDetails(event: Parameters<typeof getQuery>[0], contentType: ContentType) {
	return normalizeDetailsResponse(await fetchKurocoContent(event, contentType));
}

export async function fetchKurocoList(event: Parameters<typeof getQuery>[0], contentType: ContentType) {
	return normalizeListResponse(await fetchKurocoContent(event, contentType));
}

export async function fetchKurocoNewsDetails(
	event: Parameters<typeof getQuery>[0],
	slug: string,
) {
	if (!isValidSlug(slug)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid news slug',
		});
	}

	const news = await fetchKurocoList(event, 'news');
	return findNewsBySlug(news.list, slug);
}
