import {
	aggregateReservationParticipants,
	applyReservationAvailability,
	mapSeibuReservationPayload,
	mergeSeibuWorkshopSource,
	normalizeSeibuEventSource,
} from '../shared/seibuFairContent.mjs';
import { getRequestLocale } from './kurocoFetch';

function runtimeString(config: Record<string, unknown>, key: string) {
	const value = config[key];
	return typeof value === 'string' ? value.trim() : String(value || '').trim();
}

function getKurocoHeaders(config: Record<string, unknown>) {
	const token = runtimeString(config, 'kurocoApiAccessToken');
	const headers: Record<string, string> = { accept: '*/*' };

	if (token) {
		headers['X-RCMS-API-ACCESS-TOKEN'] = token;
	}

	return headers;
}

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
			{ headers: getKurocoHeaders(config) },
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
			headers: getKurocoHeaders(config),
		});
	} catch {
		return null;
	}
}

export async function fetchSeibuReservationCounts(
	config: Record<string, unknown>,
	locale = 'en',
) {
	const listPath = runtimeString(config, 'kurocoSeibuReservationListPath');

	if (!listPath) {
		return {};
	}

	try {
		const response = await $fetch<Record<string, unknown>>(buildKurocoUrl(config, listPath, locale), {
			headers: getKurocoHeaders(config),
		});
		return aggregateReservationParticipants(response);
	} catch {
		return {};
	}
}

export async function fetchSeibuFairEvent(
	event: Parameters<typeof getRequestLocale>[0],
	localeOverride?: unknown,
) {
	const config = useRuntimeConfig();
	const locale = String(localeOverride || getRequestLocale(event)).toLowerCase().startsWith('ja')
		? 'ja'
		: 'en';
	const [content, workshops, reservationCounts] = await Promise.all([
		fetchSeibuFairContent(config, locale),
		fetchSeibuFairWorkshops(config, locale),
		fetchSeibuReservationCounts(config, locale),
	]);
	const eventWithWorkshops = mergeSeibuWorkshopSource(content, workshops, locale);

	return applyReservationAvailability(eventWithWorkshops, reservationCounts);
}

export async function submitSeibuReservationToKuroco(value: Record<string, unknown>) {
	const config = useRuntimeConfig();
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
		headers: getKurocoHeaders(config),
		body: mapSeibuReservationPayload(value),
	});
}
