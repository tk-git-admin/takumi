import {
	aggregateReservationParticipants,
	applyReservationAvailability,
	mapSeibuReservationPayload,
	mergeSeibuWorkshopSource,
	normalizeSeibuEventSource,
} from '../shared/seibuFairContent.mjs';
import {
	getKurocoAcceptHeaders,
	getKurocoRuntimeConfig,
	getKurocoStaticTokenHeaders,
	runtimeString,
} from './kurocoConfig';
import { getRequestLocale } from './kurocoFetch';

type SeibuReservationCountMode = 'cached' | 'fresh';

function buildKurocoUrl(
	config: Record<string, unknown>,
	path: string,
	locale = 'en',
	localized = true,
) {
	const baseUrl = runtimeString(config, 'kurocoBaseUrl');
	const url = /^https?:\/\//i.test(path) ? new URL(path) : new URL(path, baseUrl);

	if (localized && locale === 'ja') {
		url.searchParams.set('_lang', 'ja');
	}

	return url.href;
}

async function fetchSeibuFairContent(config: Record<string, unknown>, locale: string) {
	const contentPath = runtimeString(config, 'kurocoSeibuContentPath');

	if (!contentPath) {
		return normalizeSeibuEventSource(null, locale);
	}

	try {
		const response = await $fetch<Record<string, unknown>>(
			buildKurocoUrl(config, contentPath, locale),
			{ headers: getKurocoStaticTokenHeaders(config, 'home') },
		);
		return normalizeSeibuEventSource(response, locale);
	} catch {
		return normalizeSeibuEventSource(null, locale);
	}
}

async function fetchSeibuFairWorkshops(config: Record<string, unknown>, locale: string) {
	const workshopPath = runtimeString(config, 'kurocoSeibuWorkshopPath');

	if (!workshopPath) {
		return null;
	}

	try {
		return await $fetch<Record<string, unknown>>(buildKurocoUrl(config, workshopPath, locale), {
			headers: getKurocoStaticTokenHeaders(config, 'home'),
		});
	} catch {
		return null;
	}
}

export async function fetchSeibuReservationCounts(config: Record<string, unknown>, locale = 'en') {
	const listPath = runtimeString(config, 'kurocoSeibuReservationListPath');

	if (!listPath) {
		return {};
	}

	try {
		const response = await $fetch<Record<string, unknown>>(
			buildKurocoUrl(config, listPath, locale),
			{
				headers: getKurocoAcceptHeaders(),
			},
		);
		return aggregateReservationParticipants(response as any);
	} catch {
		return {};
	}
}

export async function fetchFreshSeibuReservationCounts(
	config: Record<string, unknown>,
	locale = 'en',
) {
	return fetchSeibuReservationCounts(config, locale);
}

const fetchCachedSeibuReservationCounts = defineCachedFunction(
	async (event: Parameters<typeof getRequestLocale>[0], locale = 'en') => {
		const config = getKurocoRuntimeConfig(event);
		return fetchSeibuReservationCounts(config, locale);
	},
	{
		maxAge: 30,
		name: 'seibuReservationCounts',
		getKey: (_event: Parameters<typeof getRequestLocale>[0], locale = 'en') => locale,
	},
);

export async function fetchSeibuFairEvent(
	event: Parameters<typeof getRequestLocale>[0],
	localeOverride?: unknown,
	options: { reservationCounts?: SeibuReservationCountMode } = {},
) {
	const config = getKurocoRuntimeConfig(event);
	const locale = String(localeOverride || getRequestLocale(event))
		.toLowerCase()
		.startsWith('ja')
		? 'ja'
		: 'en';
	const reservationCountPromise =
		options.reservationCounts === 'fresh'
			? fetchFreshSeibuReservationCounts(config, locale)
			: fetchCachedSeibuReservationCounts(event, locale);
	const [content, workshops, reservationCounts] = await Promise.all([
		fetchSeibuFairContent(config, locale),
		fetchSeibuFairWorkshops(config, locale),
		reservationCountPromise,
	]);
	const eventWithWorkshops = mergeSeibuWorkshopSource(content, workshops, locale);

	return applyReservationAvailability(eventWithWorkshops, reservationCounts);
}

export async function submitSeibuReservationToKuroco(
	event: Parameters<typeof getRequestLocale>[0],
	value: Record<string, unknown>,
) {
	const config = getKurocoRuntimeConfig(event);
	const reservationPostPath = runtimeString(config, 'kurocoSeibuReservationPostPath');

	if (!reservationPostPath) {
		return {
			preview: true,
			inquiry_bn_id: `preview-${Date.now()}`,
		};
	}

	const url = buildKurocoUrl(config, reservationPostPath, 'en', false);

	return await $fetch<Record<string, unknown>>(url, {
		method: 'POST',
		headers: getKurocoAcceptHeaders(),
		body: mapSeibuReservationPayload(value),
	});
}
