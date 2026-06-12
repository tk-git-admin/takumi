import {
	applyReservationAvailability,
	buildSeibuReservationSummary,
	buildAvailabilityMap,
	extractKurocoReservationId,
	validateSeibuReservationPayload,
} from '../../shared/seibuFairContent.mjs';
import { fetchSeibuFairEvent, submitSeibuReservationToKuroco } from '../../utils/seibuFairFetch';

function asString(value: unknown) {
	return typeof value === 'string' ? value.trim() : '';
}

function resolveErrorStatus(error: unknown) {
	const record = error as {
		response?: { status?: number };
		status?: number;
		statusCode?: number;
	};
	const status = Number(record?.response?.status || record?.status || record?.statusCode || 500);
	return Number.isFinite(status) && status >= 400 ? status : 500;
}

function resolveKurocoErrorMessage(error: unknown, fallback: string) {
	if (!error || typeof error !== 'object') return fallback;

	const record = error as {
		data?: { messages?: unknown; message?: unknown; statusMessage?: unknown; errors?: unknown };
		message?: unknown;
		statusMessage?: unknown;
	};

	if (Array.isArray(record.data?.messages)) {
		for (const item of record.data.messages) {
			const text = asString(item);
			if (text) return text;
		}
	}

	return (
		asString(record.data?.message) ||
		asString(record.data?.statusMessage) ||
		asString(record.statusMessage) ||
		asString(record.message) ||
		fallback
	);
}

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const currentEvent = await fetchSeibuFairEvent(event, body.locale);
	const validation = validateSeibuReservationPayload(body, currentEvent);

	if (!validation.valid || !validation.value) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid SEIBU reservation payload',
			data: { errors: validation.errors },
		});
	}

	try {
		const response = await submitSeibuReservationToKuroco(validation.value);
		const updatedEvent = applyReservationAvailability(currentEvent, {
			[validation.value.sessionId]: validation.value.participants,
		});

		return {
			success: true,
			reservationId: extractKurocoReservationId(response),
			preview: Boolean(response?.preview),
			reservation: buildSeibuReservationSummary(validation.value),
			availability: buildAvailabilityMap(updatedEvent),
		};
	} catch (error) {
		throw createError({
			statusCode: resolveErrorStatus(error),
			statusMessage: resolveKurocoErrorMessage(
				error,
				'Failed to submit SEIBU reservation.',
			),
		});
	}
});
