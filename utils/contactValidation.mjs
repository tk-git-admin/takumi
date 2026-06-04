import { normalizeLocale } from './kurocoContent.mjs';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_LIMITS = {
	name: 50,
	email: 50,
	message: 500,
};

export function validateContactPayload(payload = {}) {
	const errors = {};
	const name = String(payload.name || '').trim();
	const email = String(payload.email || '').trim();
	const message = String(payload.message || '').trim();
	let locale = 'en';

	try {
		locale = normalizeLocale(payload.locale);
	} catch {
		errors.locale = 'unsupported';
	}

	if (!name) errors.name = 'required';
	else if (name.length > FIELD_LIMITS.name) errors.name = 'maxLength';

	if (!email) errors.email = 'required';
	else if (email.length > FIELD_LIMITS.email) errors.email = 'maxLength';
	else if (!EMAIL_PATTERN.test(email)) errors.email = 'format';

	if (!message) errors.message = 'required';
	else if (message.length > FIELD_LIMITS.message) errors.message = 'maxLength';

	const valid = Object.keys(errors).length === 0;
	return {
		valid,
		errors,
		value: valid ? { name, email, message, locale } : null,
	};
}

export function mapContactPayload(value) {
	return {
		name: value.name,
		from_mail: value.email,
		ext_01: 'Takumi Message',
		body: value.message,
	};
}

export function selectContactFormId(apiIds, locale) {
	return normalizeLocale(locale) === 'en' ? apiIds.formEngId : apiIds.formJpId;
}
