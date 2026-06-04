import {
	mapContactPayload,
	selectContactFormId,
	validateContactPayload,
} from '../../utils/contactValidation.mjs';

export default defineEventHandler(async (event) => {
	const validation = validateContactPayload(await readBody(event));

	if (!validation.valid || !validation.value) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid contact payload',
			data: { errors: validation.errors },
		});
	}

	const config = useRuntimeConfig();
	const formId = selectContactFormId(
		{
			formEngId: String(config.kurocoFormEngId),
			formJpId: String(config.kurocoFormJpId),
		},
		validation.value.locale,
	);
	const url = new URL(`/rcms-api/1/inquiry/${formId}`, String(config.kurocoBaseUrl));

	await $fetch(url.href, {
		method: 'POST',
		body: mapContactPayload(validation.value),
	});

	return { success: true };
});
