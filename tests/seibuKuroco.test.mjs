import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getSeibuFairEvent, seibuFairEvent } from '../data/seibuFair.mjs';
import {
	aggregateReservationParticipants,
	applyReservationAvailability,
	buildAvailabilityMap,
	buildSeibuReservationSummary,
	mapSeibuReservationPayload,
	normalizeSeibuEventSource,
	validateSeibuReservationPayload,
} from '../server/shared/seibuFairContent.mjs';

test('SEIBU Kuroco event_json is parsed into the existing event shape with safe fallback', () => {
	const cmsEvent = {
		...seibuFairEvent,
		title: 'CMS SEIBU Fair',
		experiences: [
			{
				id: 'tea',
				name: 'Tea Workshop',
				label: '茶道',
				time: '10:00-11:00',
				description: 'A guided tea session.',
				sessions: [{ id: 'tea-2026-06-20', date: 'June 20 (Sat)', booked: 1, capacity: 5 }],
			},
		],
	};

	const normalized = normalizeSeibuEventSource({
		details: {
			subject: 'SEIBU Fair',
			event_json: JSON.stringify(cmsEvent),
		},
	});

	assert.equal(normalized.title, 'CMS SEIBU Fair');
	assert.equal(normalized.experiences[0].label, '');
	assert.equal(normalized.experiences[0].sessions[0].capacity, 5);

	cmsEvent.title = 'mutated after parse';
	assert.equal(normalized.title, 'CMS SEIBU Fair');

	const fallback = normalizeSeibuEventSource({ details: { event_json: '{"broken"' } });
	assert.equal(fallback.title, seibuFairEvent.title);
	assert.notEqual(fallback, seibuFairEvent);

	const japaneseFallback = normalizeSeibuEventSource(
		{ details: { event_json: '{"broken"' } },
		'ja',
	);
	assert.equal(japaneseFallback.title, '日本の美');
	assert.equal(japaneseFallback.experiences[0].name, '浴衣着付け');
});

test('SEIBU flat Kuroco content fields are mapped into the event shape', () => {
	const normalized = normalizeSeibuEventSource({
		list: [
			{
				subject: 'CMS SEIBU Fair',
				hero_host: 'CMS Host',
				hero_title: 'CMS Hero Title',
				hero_subheading: 'CMS Craft',
				hero_description: 'CMS intro copy.',
				highlighted_title: ['16', '51', '5'],
				highlighted_sub_heading: ['Companies', 'Exhibits', 'Hands-on events'],
				event_heading: ['Date', 'Venue', 'Admission'],
				event_description: [
					'June 19-30, 2026',
					'CMS Event Hall',
					'Free admission',
				],
				hero_image: {
					url: 'https://cdn.example.test/poster.jpeg',
					desc: 'CMS poster',
				},
				hero_button_link: {
					url: '#registration',
					title: 'CMS reserve',
				},
				companies_title: 'CMS companies',
				company_title: ['Company A', 'Company B'],
				company_description: ['Description A', 'Description B'],
				featured_products_title: 'CMS products',
				product_image: [
					{
						url: 'https://cdn.example.test/product.jpeg',
						desc: 'Product image',
					},
				],
				product_title: ['Product A'],
				product_description: ['Company A'],
				experience_registration_title: 'CMS registration',
				experience_registration_description: 'CMS registration intro.',
			},
		],
	});

	assert.equal(normalized.host, 'CMS Host');
	assert.equal(normalized.title, 'CMS Hero Title');
	assert.equal(normalized.subtitle, 'CMS Craft');
	assert.equal(normalized.intro, 'CMS intro copy.');
	assert.equal(normalized.dates.range, 'June 19-30, 2026');
	assert.equal(normalized.venue, 'CMS Event Hall');
	assert.equal(normalized.admission, 'Free admission');
	assert.equal(normalized.companiesTitle, 'CMS companies');
	assert.equal(normalized.featuredProductsTitle, 'CMS products');
	assert.equal(normalized.registrationTitle, 'CMS registration');
	assert.equal(normalized.registrationDescription, 'CMS registration intro.');
	assert.deepEqual(normalized.heroButton, {
		url: '#registration',
		title: 'CMS reserve',
	});
	assert.equal(normalized.stats.exhibitors, 16);
	assert.equal(normalized.stats.products, 51);
	assert.equal(normalized.stats.experiences, 5);
	assert.deepEqual(normalized.posterAsset, {
		name: 'CMS poster',
		src: 'https://cdn.example.test/poster.jpeg',
	});
	assert.deepEqual(normalized.exhibitors, [
		{ id: 'exhibitor-1', name: 'Company A', description: 'Description A' },
		{ id: 'exhibitor-2', name: 'Company B', description: 'Description B' },
	]);
	assert.deepEqual(normalized.productAssets, [
		{
			id: 'product-1',
			name: 'Product A',
			src: 'https://cdn.example.test/product.jpeg',
			company: 'Company A',
			description: '',
		},
	]);
	assert.equal(normalized.experiences[0].id, 'yukata');
});

test('SEIBU workshop Kuroco fields are mapped into registration experiences', () => {
	const normalized = normalizeSeibuEventSource({
		list: [
			{
				topics_id: 52,
				subject: 'Origami',
				slug: 'origami',
				workshop_heading: 'Origami Workshop',
				workshop_description:
					'A hands-on origami class for children and adults.',
				session_time: '15:00-16:00',
				session_booking: '15',
				session_date: [
					'June 20 (Sat)',
					'June 21 (Sun)',
					'June 27 (Sat)',
					'June 28 (Sun)',
				],
			},
			{
				topics_id: 53,
				subject: 'Color Coordination',
				slug: 'color-coordination',
				workshop_heading: 'Color Coordination',
				workshop_description:
					'A specialist introduces styling ideas inspired by traditional Japanese colors.',
				session_time: '11:00-12:00',
				session_booking: '15',
				session_date: ['June 20 (Sat)', 'June 21 (Sun)'],
			},
		],
	});

	assert.equal(normalized.experiences.length, 2);
	assert.deepEqual(normalized.experiences[0], {
		id: 'origami',
		name: 'Origami Workshop',
		label: 'Origami',
		time: '15:00-16:00',
		duration: '',
		description: 'A hands-on origami class for children and adults.',
		sessions: [
			{
				id: 'origami-2026-06-20',
				date: 'June 20 (Sat)',
				time: '15:00-16:00',
				booked: 0,
				capacity: 15,
			},
			{
				id: 'origami-2026-06-21',
				date: 'June 21 (Sun)',
				time: '15:00-16:00',
				booked: 0,
				capacity: 15,
			},
			{
				id: 'origami-2026-06-27',
				date: 'June 27 (Sat)',
				time: '15:00-16:00',
				booked: 0,
				capacity: 15,
			},
			{
				id: 'origami-2026-06-28',
				date: 'June 28 (Sun)',
				time: '15:00-16:00',
				booked: 0,
				capacity: 15,
			},
		],
	});
	assert.equal(normalized.experiences[1].id, 'color-coordination');
	assert.equal(normalized.experiences[1].sessions[0].id, 'color-coordination-2026-06-20');
	assert.equal(normalized.stats.experiences, 2);
});

test('SEIBU workshop Japanese dates keep stable session ids', () => {
	const normalized = normalizeSeibuEventSource(
		{
			list: [
				{
					topics_id: 54,
					subject: '茶道',
					slug: 'tea-ceremony',
					workshop_heading: '茶道体験',
					workshop_description: 'お茶の所作を体験できます。',
					session_time: '10:00-11:00',
					session_booking: '8',
					session_date: ['6月29日(月)'],
				},
			],
		},
		'ja',
	);

	assert.equal(normalized.experiences[0].id, 'tea-ceremony');
	assert.equal(normalized.experiences[0].name, '茶道体験');
	assert.equal(normalized.experiences[0].label, '茶道');
	assert.equal(normalized.experiences[0].sessions[0].id, 'tea-ceremony-2026-06-29');
	assert.equal(normalized.experiences[0].sessions[0].date, '6月29日(月)');
	assert.equal(normalized.experiences[0].sessions[0].capacity, 8);
});

test('SEIBU reservation submissions aggregate by session and update availability', () => {
	const sessionId = 'yukata-2026-06-20';
	const reservationCounts = aggregateReservationParticipants({
		list: [
			{ ext_03: sessionId, ext_06: '2' },
			{ ext_03: { value: sessionId }, ext_06: { value: '3' } },
			{ ext_03: sessionId, ext_06: 'invalid' },
			{ ext_03: 'missing-session', ext_06: '1' },
		],
	});
	const event = applyReservationAvailability(seibuFairEvent, reservationCounts);
	const availability = buildAvailabilityMap(event);

	assert.equal(reservationCounts[sessionId], 5);
	assert.equal(availability[sessionId].booked, 14);
	assert.equal(availability[sessionId].remaining, 1);
	assert.equal(availability[sessionId].capacity, 15);
	assert.equal(availability['origami-2026-06-28'].remaining, 0);
});

test('SEIBU live reservation list response only counts numeric submitted participants', () => {
	const reservationCounts = aggregateReservationParticipants({
		list: [
			{
				inquiry_bn_id: 70,
				ext_03: 'yukata-2026-06-20',
				ext_06: '4',
			},
			{
				inquiry_bn_id: 69,
				ext_03: 'yukata-2026-06-20',
				ext_06: 'string',
			},
			{
				inquiry_bn_id: 68,
				ext_03: 'string',
				ext_06: 'string',
			},
		],
	});

	assert.equal(reservationCounts['yukata-2026-06-20'], 4);
	assert.equal(reservationCounts.string, undefined);
});

test('SEIBU reservation validation and Kuroco payload mapping are explicit', () => {
	const event = applyReservationAvailability(seibuFairEvent, {});
	const validation = validateSeibuReservationPayload(
		{
			name: ' Guest Name ',
			email: 'guest@example.com',
			participants: '2',
			experienceId: 'yukata',
			sessionId: 'yukata-2026-06-20',
			locale: 'en',
		},
		event,
	);

	assert.equal(validation.valid, true);
	assert.deepEqual(validation.errors, {});
	assert.equal(validation.value.name, 'Guest Name');
	assert.equal(validation.value.experienceName, 'Yukata Dressing');
	assert.equal(validation.value.sessionDate, 'June 20 (Sat)');
	assert.equal(validation.value.sessionTime, '13:00-14:00');

	assert.deepEqual(mapSeibuReservationPayload(validation.value), {
		name: 'Guest Name',
		email: 'guest@example.com',
		body: 'SEIBU Fair reservation: Yukata Dressing on June 20 (Sat) 13:00-14:00 for 2 participant(s).',
		ext_01: 'yukata',
		ext_02: 'Yukata Dressing',
		ext_03: 'yukata-2026-06-20',
		ext_04: 'June 20 (Sat)',
		ext_05: '13:00-14:00',
		ext_06: '2',
	});

	const japaneseEvent = applyReservationAvailability(getSeibuFairEvent('ja'), {});
	const japaneseValidation = validateSeibuReservationPayload(
		{
			name: 'Guest Name',
			email: 'guest@example.com',
			participants: '2',
			experienceId: 'yukata',
			sessionId: 'yukata-2026-06-20',
			locale: 'ja',
		},
		japaneseEvent,
	);

	assert.equal(japaneseValidation.valid, true);
	assert.equal(japaneseValidation.value.experienceName, '浴衣着付け');
	assert.equal(japaneseValidation.value.sessionDate, '6月20日(土)');
	assert.deepEqual(buildSeibuReservationSummary(japaneseValidation.value), {
		name: 'Guest Name',
		email: 'guest@example.com',
		participants: 2,
		experienceName: '浴衣着付け',
		sessionDate: '6月20日(土)',
		sessionTime: '13:00-14:00',
	});
	assert.equal(
		mapSeibuReservationPayload(japaneseValidation.value).body,
		'西武フェア予約: 浴衣着付け 6月20日(土) 13:00-14:00 2名。',
	);

	const unavailable = validateSeibuReservationPayload(
		{
			name: 'Guest Name',
			email: 'guest@example.com',
			participants: '99',
			experienceId: 'yukata',
			sessionId: 'yukata-2026-06-20',
			locale: 'en',
		},
		event,
	);

	assert.equal(unavailable.valid, false);
	assert.equal(unavailable.errors.participants, 'unavailable');
});
