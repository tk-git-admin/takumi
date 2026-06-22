import {
	buildKurocoContentUrl,
	findNewsBySlug,
	isValidSlug,
	normalizeDetailsResponse,
	normalizeListResponse,
	normalizeLocale,
} from '../shared/kurocoContent.mjs';
import {
	getKurocoApiConfig,
	getKurocoRuntimeConfig,
	getKurocoStaticTokenHeaders,
	type KurocoContentType,
} from './kurocoConfig';

export function getRequestLocale(event: Parameters<typeof getQuery>[0]) {
	try {
		const queryLocale = getQuery(event).lang;
		const locale = Array.isArray(queryLocale) ? queryLocale[0] : queryLocale;

		return normalizeLocale(typeof locale === 'string' ? locale : undefined);
	} catch (error) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Unsupported locale',
		});
	}
}

async function fetchKurocoContent(
	event: Parameters<typeof getQuery>[0],
	contentType: KurocoContentType,
) {
	const config = getKurocoRuntimeConfig(event);
	const url = buildKurocoContentUrl(
		getKurocoApiConfig(config),
		contentType,
		getRequestLocale(event),
	);
	return await $fetch<Record<string, unknown>>(url, {
		headers: getKurocoStaticTokenHeaders(config, contentType),
	});
}

export async function fetchKurocoDetails(
	event: Parameters<typeof getQuery>[0],
	contentType: KurocoContentType,
) {
	return normalizeDetailsResponse(await fetchKurocoContent(event, contentType));
}

export async function fetchKurocoList(
	event: Parameters<typeof getQuery>[0],
	contentType: KurocoContentType,
) {
	return normalizeListResponse(await fetchKurocoContent(event, contentType));
}

export async function fetchKurocoNewsDetails(event: Parameters<typeof getQuery>[0], slug: string) {
	if (!isValidSlug(slug)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid news slug',
		});
	}

	const news = await fetchKurocoList(event, 'news');
	return findNewsBySlug(news.list, slug);
}
