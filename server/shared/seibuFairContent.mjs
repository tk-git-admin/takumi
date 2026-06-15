import { getSeibuFairEvent, seibuFairEvent } from './seibuFairFallback.mjs';
import { normalizeLocale } from './kurocoContent.mjs';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const JAPANESE_SCRIPT_PATTERN = /[ぁ-んァ-ン一-龯]/;
const SOURCE_PAGE = '/seibu-fair';
const SEIBU_EVENT_YEAR = Number(seibuFairEvent?.dates?.year) || 2026;
const ENGLISH_MONTHS = new Map(
	[
		'january',
		'february',
		'march',
		'april',
		'may',
		'june',
		'july',
		'august',
		'september',
		'october',
		'november',
		'december',
	].map((month, index) => [month, index + 1]),
);
const FIELD_LIMITS = {
	name: 80,
	email: 120,
	participants: 99,
};

function clone(value) {
	return JSON.parse(JSON.stringify(value));
}

function isRecord(value) {
	return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asString(value) {
	if (typeof value === 'string') return value.trim();
	if (typeof value === 'number') return String(value);
	if (isRecord(value)) {
		return asString(value.value) || asString(value.label) || asString(value.key);
	}
	return '';
}

function asInteger(value, fallback = 0) {
	const number = Number(asString(value) || value);
	if (!Number.isInteger(number)) return fallback;
	return number;
}

function readField(record, key) {
	return isRecord(record) ? record[key] : undefined;
}

function parseEventJson(value) {
	if (isRecord(value)) return value;

	const text = asString(value);
	if (!text) return null;

	try {
		const parsed = JSON.parse(text);
		return isRecord(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

function readEventJson(source) {
	const candidates = [
		readField(source, 'details'),
		Array.isArray(readField(source, 'list')) ? readField(source, 'list')[0] : null,
		source,
	].filter(Boolean);

	for (const candidate of candidates) {
		const parsed =
			parseEventJson(readField(candidate, 'event_json')) ||
			parseEventJson(readField(candidate, 'eventJson')) ||
			parseEventJson(readField(candidate, 'ext_event_json'));

		if (parsed) return parsed;
	}

	return null;
}

function asList(value) {
	if (Array.isArray(value)) return value;

	const text = asString(value);
	if (!text) return [];

	return text
		.split(/\r?\n/)
		.map((item) => item.trim())
		.filter(Boolean);
}

function asOptionalInteger(value) {
	const text = asString(value);
	if (!text) return null;

	const number = Number(text);
	return Number.isInteger(number) ? number : null;
}

function readImageSource(value) {
	if (isRecord(value)) {
		return (
			asString(value.url) || asString(value.url_org) || asString(value.src) || asString(value.path)
		);
	}

	return asString(value);
}

function readImageName(value) {
	if (!isRecord(value)) return '';
	return asString(value.desc) || asString(value.name) || asString(value.title);
}

function readLink(value) {
	const source = parseEventJson(value) || (isRecord(value) ? value : {});

	return {
		url: asString(source.url),
		title: asString(source.title),
	};
}

function hasFlatSeibuFields(candidate) {
	return Boolean(
		asString(readField(candidate, 'hero_title')) ||
			asString(readField(candidate, 'hero_host')) ||
			asList(readField(candidate, 'company_title')).length ||
			asList(readField(candidate, 'product_title')).length ||
			readImageSource(readField(candidate, 'hero_logo')) ||
			readImageSource(readField(candidate, 'hero_image')),
	);
}

function readFlatSeibuItem(source) {
	const list = readField(source, 'list');
	const candidates = [
		readField(source, 'details'),
		Array.isArray(list) ? list[0] : null,
		source,
	].filter(isRecord);

	return candidates.find(hasFlatSeibuFields) || null;
}

function readFlatStats(values, labels) {
	const stats = {};

	values.forEach((value, index) => {
		const number = asOptionalInteger(value);
		if (number === null) return;

		const label = asString(labels[index]).toLowerCase();
		if (label.includes('compan')) {
			stats.exhibitors = number;
		} else if (label.includes('exhibit') || label.includes('product')) {
			stats.products = number;
		} else if (
			label.includes('hand') ||
			label.includes('event') ||
			label.includes('experience') ||
			label.includes('workshop')
		) {
			stats.experiences = number;
		}
	});

	if (stats.exhibitors === undefined && values.length > 0) {
		const number = asOptionalInteger(values[0]);
		if (number !== null) stats.exhibitors = number;
	}
	if (stats.products === undefined && values.length > 1) {
		const number = asOptionalInteger(values[1]);
		if (number !== null) stats.products = number;
	}
	if (stats.experiences === undefined && values.length > 2) {
		const number = asOptionalInteger(values[2]);
		if (number !== null) stats.experiences = number;
	}

	return stats;
}

function readFlatEventDetails(headings, descriptions) {
	const details = {};

	descriptions.forEach((value, index) => {
		const description = asString(value);
		if (!description) return;

		const heading = asString(headings[index]).toLowerCase();
		if (heading.includes('date')) {
			details.date = description;
		} else if (heading.includes('venue') || heading.includes('place')) {
			details.venue = description;
		} else if (heading.includes('admission') || heading.includes('fee')) {
			details.admission = description;
		}
	});

	if (!details.date && descriptions.length > 0) details.date = asString(descriptions[0]);
	if (!details.venue && descriptions.length > 1) details.venue = asString(descriptions[1]);
	if (!details.admission && descriptions.length > 2) {
		details.admission = asString(descriptions[2]);
	}

	return details;
}

function mapFlatExhibitors(item) {
	const names = asList(readField(item, 'company_title'));
	const descriptions = asList(readField(item, 'company_description'));
	const logos = asList(readField(item, 'company_logo'));
	const length = Math.max(names.length, descriptions.length, logos.length);

	return Array.from({ length }, (_, index) => {
		const logo = logos[index];

		return {
			id: `exhibitor-${index + 1}`,
			name: asString(names[index]),
			description: asString(descriptions[index]),
			logoName: readImageName(logo),
			logoSrc: readImageSource(logo),
		};
	}).filter((exhibitor) => exhibitor.name || exhibitor.description || exhibitor.logoSrc);
}

function mapFlatProducts(item) {
	const names = asList(readField(item, 'product_title'));
	const images = asList(readField(item, 'product_image'));
	const companies = asList(readField(item, 'product_description'));
	const length = Math.max(names.length, images.length, companies.length);

	return Array.from({ length }, (_, index) => ({
		id: `product-${index + 1}`,
		name: asString(names[index]),
		src: readImageSource(images[index]),
		company: asString(companies[index]),
		description: '',
	})).filter((asset) => asset.name || asset.src || asset.company);
}

function slugifyId(value, fallback) {
	const text = asString(value)
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	return text || fallback;
}

function padTwo(value) {
	return String(value).padStart(2, '0');
}

function parseSessionDateParts(value) {
	const text = asString(value);
	const japanese = text.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
	if (japanese) {
		return {
			month: Number(japanese[1]),
			day: Number(japanese[2]),
		};
	}

	const english = text.match(/([A-Za-z]+)\s+(\d{1,2})/);
	if (!english) return null;

	const month = ENGLISH_MONTHS.get(english[1].toLowerCase());
	if (!month) return null;

	return {
		month,
		day: Number(english[2]),
	};
}

function buildSessionId(experienceId, date, index) {
	const parts = parseSessionDateParts(date);
	if (!parts) return `${experienceId}-session-${index + 1}`;

	return `${experienceId}-${SEIBU_EVENT_YEAR}-${padTwo(parts.month)}-${padTwo(parts.day)}`;
}

function hasWorkshopFields(item) {
	return Boolean(
		asString(readField(item, 'workshop_heading')) ||
			asString(readField(item, 'workshop_description')) ||
			asString(readField(item, 'session_time')) ||
			asString(readField(item, 'session_booking')) ||
			asList(readField(item, 'session_date')).length,
	);
}

function readWorkshopItems(source) {
	const list = readField(source, 'list');
	if (Array.isArray(list)) return list.filter((item) => isRecord(item) && hasWorkshopFields(item));

	return [readField(source, 'details'), source].filter(
		(item) => isRecord(item) && hasWorkshopFields(item),
	);
}

function mapWorkshopExperiences(source) {
	return readWorkshopItems(source)
		.map((item, index) => {
			const fallbackId = `workshop-${asString(readField(item, 'topics_id')) || index + 1}`;
			const id = slugifyId(
				readField(item, 'slug') ||
					readField(item, 'subject') ||
					readField(item, 'workshop_heading'),
				fallbackId,
			);
			const time = asString(readField(item, 'session_time'));
			const capacity = Math.max(0, asInteger(readField(item, 'session_booking'), 0));
			const sessions = asList(readField(item, 'session_date'))
				.map((date, sessionIndex) => {
					const label = asString(date);
					if (!label) return null;

					return {
						id: buildSessionId(id, label, sessionIndex),
						date: label,
						time,
						booked: 0,
						capacity,
					};
				})
				.filter(Boolean);

			return {
				id,
				name: asString(readField(item, 'workshop_heading')) || asString(readField(item, 'subject')),
				label: asString(readField(item, 'subject')),
				time,
				duration: '',
				description: asString(readField(item, 'workshop_description')),
				sessions,
			};
		})
		.filter((experience) => experience.id && experience.name && experience.sessions.length);
}

function readFlatSeibuEvent(source) {
	const item = readFlatSeibuItem(source);
	if (!item) return null;

	const eventDetails = readFlatEventDetails(
		asList(readField(item, 'event_heading')),
		asList(readField(item, 'event_description')),
	);
	const heroLogo = readField(item, 'hero_logo');
	const heroImage = readField(item, 'hero_image');
	const heroButton = readLink(readField(item, 'hero_button_link'));

	return {
		route: '/seibu-fair',
		title: asString(readField(item, 'hero_title')) || asString(readField(item, 'subject')),
		subtitle: asString(readField(item, 'hero_subheading')),
		host: asString(readField(item, 'hero_host')),
		intro: asString(readField(item, 'hero_description')),
		heroLogo: {
			name:
				readImageName(heroLogo) ||
				asString(readField(item, 'hero_title')) ||
				asString(readField(item, 'subject')),
			src: readImageSource(heroLogo),
		},
		companiesTitle: asString(readField(item, 'companies_title')),
		featuredProductsTitle: asString(readField(item, 'featured_products_title')),
		registrationTitle: asString(readField(item, 'experience_registration_title')),
		registrationDescription: asString(readField(item, 'experience_registration_description')),
		dates: {
			range: eventDetails.date,
		},
		venue: eventDetails.venue,
		admission: eventDetails.admission,
		stats: readFlatStats(
			asList(readField(item, 'highlighted_title')),
			asList(readField(item, 'highlighted_sub_heading')),
		),
		heroButton,
		posterAsset: {
			name:
				readImageName(heroImage) ||
				asString(readField(item, 'hero_title')) ||
				asString(readField(item, 'subject')),
			src: readImageSource(heroImage),
		},
		productAssets: mapFlatProducts(item),
		exhibitors: mapFlatExhibitors(item),
	};
}

function normalizeProductAssets(value, fallback) {
	const list = Array.isArray(value) ? value : fallback;
	return list
		.map((asset, index) => ({
			id: asString(asset?.id) || `product-${index + 1}`,
			name: asString(asset?.name),
			src: asString(asset?.src),
			company: asString(asset?.company),
			description: asString(asset?.description),
		}))
		.filter((asset) => asset.name || asset.src || asset.description);
}

function normalizeImageAsset(value, fallback = {}) {
	const source = isRecord(value) ? value : {};

	return {
		name: asString(source.name) || asString(fallback.name),
		src: asString(source.src) || asString(fallback.src),
	};
}

function normalizeExhibitors(value, fallback) {
	const list = Array.isArray(value) ? value : fallback;
	return list
		.map((exhibitor, index) => ({
			id: asString(exhibitor?.id) || `exhibitor-${index + 1}`,
			name: asString(exhibitor?.name),
			description: asString(exhibitor?.description),
			logoName: asString(exhibitor?.logoName),
			logoSrc: asString(exhibitor?.logoSrc),
		}))
		.filter((exhibitor) => exhibitor.name || exhibitor.description || exhibitor.logoSrc);
}

function normalizeSessions(value, fallback) {
	const list = Array.isArray(value) ? value : fallback;
	return list
		.map((session) => {
			const id = asString(session?.id);
			if (!id) return null;

			return {
				id,
				date: asString(session?.date),
				time: asString(session?.time),
				booked: Math.max(0, asInteger(session?.booked, 0)),
				capacity: Math.max(0, asInteger(session?.capacity, 0)),
			};
		})
		.filter(Boolean);
}

function resolveContentLocale(locale = 'en') {
	return String(locale).toLowerCase().startsWith('ja') ? 'ja' : 'en';
}

function normalizeExperienceLabel(value, locale = 'en') {
	const label = asString(value);
	if (resolveContentLocale(locale) === 'ja') return label;
	return JAPANESE_SCRIPT_PATTERN.test(label) ? '' : label;
}

function normalizeExperiences(value, fallback, locale = 'en') {
	const list = Array.isArray(value) ? value : fallback;
	return list
		.map((experience) => {
			const id = asString(experience?.id);
			if (!id) return null;

			return {
				id,
				name: asString(experience?.name),
				label: normalizeExperienceLabel(experience?.label, locale),
				time: asString(experience?.time),
				duration: asString(experience?.duration),
				description: asString(experience?.description),
				sessions: normalizeSessions(experience?.sessions, []),
			};
		})
		.filter(Boolean);
}

export function normalizeSeibuEvent(event = seibuFairEvent, locale = 'en') {
	const fallback = clone(getSeibuFairEvent(locale));
	const source = isRecord(event) ? event : {};

	const productAssets = normalizeProductAssets(source.productAssets, fallback.productAssets);
	const exhibitors = normalizeExhibitors(source.exhibitors, fallback.exhibitors);
	const experiences = normalizeExperiences(source.experiences, fallback.experiences, locale);

	return {
		...fallback,
		...clone(source),
		route: asString(source.route) || fallback.route,
		title: asString(source.title) || fallback.title,
		subtitle: asString(source.subtitle) || fallback.subtitle,
		host: asString(source.host) || fallback.host,
		intro: asString(source.intro) || fallback.intro,
		productIntro: asString(source.productIntro) || fallback.productIntro,
		companiesTitle: asString(source.companiesTitle) || asString(fallback.companiesTitle),
		featuredProductsTitle:
			asString(source.featuredProductsTitle) || asString(fallback.featuredProductsTitle),
		registrationTitle: asString(source.registrationTitle) || asString(fallback.registrationTitle),
		registrationDescription:
			asString(source.registrationDescription) || asString(fallback.registrationDescription),
		heroButton: {
			url: asString(source.heroButton?.url) || asString(fallback.heroButton?.url),
			title: asString(source.heroButton?.title) || asString(fallback.heroButton?.title),
		},
		dates: {
			...fallback.dates,
			...(isRecord(source.dates) ? clone(source.dates) : {}),
		},
		venue: asString(source.venue) || fallback.venue,
		admission: asString(source.admission) || fallback.admission,
		stats: {
			...fallback.stats,
			...(isRecord(source.stats) ? clone(source.stats) : {}),
			exhibitors: Math.max(0, asInteger(source.stats?.exhibitors, exhibitors.length)),
			products: Math.max(0, asInteger(source.stats?.products, fallback.stats.products)),
			experiences: Math.max(0, asInteger(source.stats?.experiences, experiences.length)),
		},
		announcement: {
			...fallback.announcement,
			...(isRecord(source.announcement) ? clone(source.announcement) : {}),
		},
		heroLogo: normalizeImageAsset(source.heroLogo, fallback.heroLogo),
		posterAsset: normalizeImageAsset(source.posterAsset, fallback.posterAsset),
		productAssets: productAssets.length ? productAssets : fallback.productAssets,
		exhibitors: exhibitors.length ? exhibitors : fallback.exhibitors,
		experiences: experiences.length ? experiences : fallback.experiences,
	};
}

export function normalizeSeibuEventSource(source, locale = 'en') {
	const eventJson = readEventJson(source);
	if (eventJson) return normalizeSeibuEvent(eventJson, locale);

	const flatEvent = readFlatSeibuEvent(source);
	const workshopExperiences = mapWorkshopExperiences(source);
	if (flatEvent || workshopExperiences.length) {
		return normalizeSeibuEvent(
			{
				...(flatEvent || {}),
				...(workshopExperiences.length ? { experiences: workshopExperiences } : {}),
			},
			locale,
		);
	}

	return normalizeSeibuEvent(getSeibuFairEvent(locale), locale);
}

export function mergeSeibuWorkshopSource(event = seibuFairEvent, source, locale = 'en') {
	const workshopExperiences = mapWorkshopExperiences(source);
	if (!workshopExperiences.length) return normalizeSeibuEvent(event, locale);

	return normalizeSeibuEvent(
		{
			...normalizeSeibuEvent(event, locale),
			experiences: workshopExperiences,
		},
		locale,
	);
}

export function aggregateReservationParticipants(reservations = []) {
	const list = Array.isArray(reservations)
		? reservations
		: Array.isArray(reservations?.list)
			? reservations.list
			: [];

	return list.reduce((counts, item) => {
		const sessionId = asString(readField(item, 'ext_03') || readField(item, 'session_id'));
		const participants = asInteger(readField(item, 'ext_06') || readField(item, 'participants'), 0);

		if (sessionId && participants > 0) {
			counts[sessionId] = (counts[sessionId] || 0) + participants;
		}

		return counts;
	}, {});
}

export function buildAvailabilityMap(event) {
	const normalized = normalizeSeibuEvent(event);
	const availability = {};

	for (const experience of normalized.experiences) {
		for (const session of experience.sessions) {
			const capacity = Math.max(0, asInteger(session.capacity, 0));
			const booked = Math.max(0, asInteger(session.booked, 0));
			const remaining = Math.max(0, capacity - booked);

			availability[session.id] = {
				booked,
				capacity,
				remaining,
				percent: capacity > 0 ? Math.min(100, Math.round((booked / capacity) * 100)) : 0,
			};
		}
	}

	return availability;
}

export function applyReservationAvailability(event, reservationCounts = {}) {
	const normalized = normalizeSeibuEvent(event);

	normalized.experiences = normalized.experiences.map((experience) => ({
		...experience,
		sessions: experience.sessions.map((session) => ({
			...session,
			booked:
				Math.max(0, asInteger(session.booked, 0)) +
				Math.max(0, asInteger(reservationCounts[session.id], 0)),
		})),
	}));
	normalized.availability = buildAvailabilityMap(normalized);

	return normalized;
}

export function findSeibuSession(event, experienceId, sessionId) {
	const normalized = normalizeSeibuEvent(event);
	const experience = normalized.experiences.find((item) => item.id === asString(experienceId));

	if (!experience) return null;

	const session = experience.sessions.find((item) => item.id === asString(sessionId));
	if (!session) return null;

	return { experience, session };
}

export function validateSeibuReservationPayload(payload = {}, event = seibuFairEvent) {
	const errors = {};
	const name = asString(payload.name);
	const email = asString(payload.email);
	const experienceId = asString(payload.experienceId);
	const sessionId = asString(payload.sessionId);
	const participants = Number(payload.participants);
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

	if (!experienceId) errors.experienceId = 'required';
	if (!sessionId) errors.sessionId = 'required';

	const selection = findSeibuSession(event, experienceId, sessionId);
	if (experienceId && sessionId && !selection) {
		errors.sessionId = 'invalid';
	}

	if (!Number.isInteger(participants) || participants < 1) {
		errors.participants = 'invalid';
	} else if (participants > FIELD_LIMITS.participants) {
		errors.participants = 'maxLength';
	} else if (selection) {
		const remaining = Math.max(0, selection.session.capacity - selection.session.booked);
		if (participants > remaining) errors.participants = 'unavailable';
	}

	const valid = Object.keys(errors).length === 0;
	return {
		valid,
		errors,
		value: valid
			? {
					name,
					email,
					participants,
					locale,
					experienceId,
					experienceName: selection.experience.name,
					sessionId,
					sessionDate: selection.session.date,
					sessionTime: selection.session.time || selection.experience.time,
					sourcePage: SOURCE_PAGE,
				}
			: null,
	};
}

export function mapSeibuReservationPayload(value) {
	const sessionTime = asString(value.sessionTime);
	const sessionLabel = [value.sessionDate, sessionTime].filter(Boolean).join(' ');
	const isJapanese = asString(value.locale) === 'ja';
	const body = isJapanese
		? `西武フェア予約: ${value.experienceName} ${sessionLabel} ${value.participants}名。`
		: `SEIBU Fair reservation: ${value.experienceName} on ${sessionLabel} for ${value.participants} participant(s).`;

	return {
		name: value.name,
		email: value.email,
		body,
		ext_01: value.experienceId,
		ext_02: value.experienceName,
		ext_03: value.sessionId,
		ext_04: value.sessionDate,
		ext_05: sessionTime,
		ext_06: String(value.participants),
	};
}

export function buildSeibuReservationSummary(value = {}) {
	return {
		name: asString(value.name),
		email: asString(value.email),
		participants: Math.max(0, asInteger(value.participants, 0)),
		experienceName: asString(value.experienceName),
		sessionDate: asString(value.sessionDate),
		sessionTime: asString(value.sessionTime),
	};
}

export function extractKurocoReservationId(response = {}) {
	const candidates = [
		readField(response, 'inquiry_bn_id'),
		readField(response, 'id'),
		readField(response, 'answer_id'),
		readField(readField(response, 'data'), 'inquiry_bn_id'),
		readField(readField(response, 'details'), 'inquiry_bn_id'),
	];

	for (const candidate of candidates) {
		const value = asString(candidate);
		if (value) return value;
	}

	return null;
}
