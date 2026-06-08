import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { test } from 'node:test';

import { getSeibuFairEvent, seibuFairEvent } from '../data/seibuFair.mjs';
import {
	canReserveParticipants,
	createSessionSeatMap,
	getBookedSeats,
	getRemainingSeats,
	isValidRegistration,
} from '../utils/seibuReservation.mjs';

test('SEIBU fair event data uses the approved frontend scope', () => {
	assert.equal(seibuFairEvent.route, '/seibu-fair');
	assert.equal(seibuFairEvent.dates.year, 2026);
	assert.equal(
		seibuFairEvent.posterAsset.src,
		'/img/seibu-fair/seibu-panora-june-final.jpeg',
	);
	assert.equal(seibuFairEvent.stats.exhibitors, 15);
	assert.equal(seibuFairEvent.stats.products, 50);
	assert.equal(seibuFairEvent.stats.experiences, 4);
	assert.equal(seibuFairEvent.productAssets.length, 7);
});

test('SEIBU fair first view highlights approved key stats', async () => {
	const pageSource = await readFile(new URL('../pages/seibu-fair.vue', import.meta.url), 'utf8');
	const englishLocale = await readFile(new URL('../locales/en.json', import.meta.url), 'utf8');
	const japaneseLocale = await readFile(new URL('../locales/ja.json', import.meta.url), 'utf8');

	assert.match(pageSource, /stat in seibuStats/);
	assert.match(pageSource, /seibu-stat-circle/);
	assert.match(pageSource, /event\.stats\[stat\.key\]/);
	assert.match(englishLocale, /"companies": "Companies"/);
	assert.match(englishLocale, /"exhibits": "Exhibits"/);
	assert.match(englishLocale, /"handsOnEvents": "Hands-on events"/);
	assert.match(japaneseLocale, /"companies": "出展企業"/);
	assert.match(japaneseLocale, /"exhibits": "出品数"/);
	assert.match(japaneseLocale, /"handsOnEvents": "体験イベント"/);
});

test('SEIBU fair company descriptions render while product data stays minimal', async () => {
	const serialized = JSON.stringify(seibuFairEvent).toLowerCase();

	assert.equal(serialized.includes('dummy'), false);
	assert.equal(serialized.includes('sample'), false);
	assert.equal(serialized.includes('サンプル'), false);
	assert.equal(
		seibuFairEvent.exhibitors.every((exhibitor) => exhibitor.description?.length > 24),
		true,
	);
	assert.equal(seibuFairEvent.productAssets.every((asset) => !asset.description), true);

	const pageSource = await readFile(new URL('../pages/seibu-fair.vue', import.meta.url), 'utf8');
	assert.equal(pageSource.includes('asset.description'), false);
	assert.equal(pageSource.includes('exhibitor.description'), true);
});

test('SEIBU fair product assets are available in the public image folder', async () => {
	await access(new URL(`../public${seibuFairEvent.posterAsset.src}`, import.meta.url));

	for (const asset of seibuFairEvent.productAssets) {
		assert.match(asset.src, /^\/img\/seibu-fair\//);
		await access(new URL(`../public${asset.src}`, import.meta.url));
	}
});

test('registration validation requires name, valid email, and available seats', () => {
	const seatMap = createSessionSeatMap(seibuFairEvent.experiences);
	const sessionId = seibuFairEvent.experiences[0].sessions[0].id;
	const remainingSeats = getRemainingSeats(seatMap, sessionId);

	assert.equal(
		isValidRegistration({ name: '', email: 'guest@example.com', participants: 1 }, remainingSeats),
		false,
	);
	assert.equal(
		isValidRegistration({ name: 'Guest', email: 'bad-email', participants: 1 }, remainingSeats),
		false,
	);
	assert.equal(
		isValidRegistration(
			{ name: 'Guest', email: 'guest@example.com', participants: 0 },
			remainingSeats,
		),
		false,
	);
	assert.equal(
		isValidRegistration(
			{ name: 'Guest', email: 'guest@example.com', participants: remainingSeats + 1 },
			remainingSeats,
		),
		false,
	);
	assert.equal(
		isValidRegistration(
			{ name: 'Guest', email: 'guest@example.com', participants: 2 },
			remainingSeats,
		),
		true,
	);
});

test('seat helpers calculate remaining seats and block full sessions', () => {
	const seatMap = createSessionSeatMap(seibuFairEvent.experiences);
	const fullSessionId = 'origami-2026-06-28';
	const openSessionId = 'yukata-2026-06-20';

	assert.equal(getBookedSeats(seatMap, fullSessionId), 15);
	assert.equal(getRemainingSeats(seatMap, fullSessionId), 0);
	assert.equal(canReserveParticipants(seatMap, fullSessionId, 1), false);
	assert.equal(getBookedSeats(seatMap, openSessionId), 9);
	assert.equal(canReserveParticipants(seatMap, openSessionId, 2), true);
});

test('announcement component remains reusable and nav localizes campaign copy', async () => {
	assert.equal(seibuFairEvent.announcement.to, seibuFairEvent.route);
	assert.equal(Object.values(seibuFairEvent.announcement).includes(seibuFairEvent.venue), false);

	const componentSource = await readFile(
		new URL('../components/AnnouncementBar.vue', import.meta.url),
		'utf8',
	);
	assert.equal(componentSource.includes('seibuFairEvent'), false);
	assert.equal(componentSource.includes('~/data/seibuFair'), false);
	assert.equal(componentSource.includes('linear-gradient'), false);
	assert.equal(componentSource.includes('mdi:arrow-right'), false);
	assert.equal(componentSource.includes('announcement-bar__meta'), false);

	const navSource = await readFile(new URL('../components/NavMenu.vue', import.meta.url), 'utf8');
	assert.equal(navSource.includes("t('seibuFair.announcement.label')"), true);
	assert.equal(navSource.includes("t('seibuFair.announcement.title')"), true);
	assert.equal(navSource.includes("t('seibuFair.announcement.actionLabel')"), true);
	assert.equal(navSource.includes('~/data/seibuFair'), false);
});

test('SEIBU announcement is gated to homepage routes in the nav', async () => {
	const navSource = await readFile(new URL('../components/NavMenu.vue', import.meta.url), 'utf8');

	assert.equal(navSource.includes('v-if="isHomePage"'), true);
	assert.equal(navSource.includes("['/', '/ja', '/ja/']"), true);
	assert.match(navSource, /<AnnouncementBar/);
});

test('mobile nav uses hamburger menu instead of fixed bottom tabs', async () => {
	const navSource = await readFile(new URL('../components/NavMenu.vue', import.meta.url), 'utf8');

	assert.equal(navSource.includes('fixed lg:hidden bottom-0'), false);
	assert.equal(navSource.includes('shadow-t'), false);
	assert.equal(navSource.includes('mdi:menu'), true);
	assert.equal(navSource.includes('dropdown'), true);
	assert.equal(navSource.includes("t('links.home')"), true);
});

test('SEIBU event page uses existing design-system buttons and internal APIs', async () => {
	const pageSource = await readFile(new URL('../pages/seibu-fair.vue', import.meta.url), 'utf8');
	const nuxtConfigSource = await readFile(new URL('../nuxt.config.ts', import.meta.url), 'utf8');

	assert.equal(pageSource.includes('Dummy product information'), false);
	assert.equal(pageSource.includes('seibu-reserve-button'), false);
	assert.equal(pageSource.includes('class="btn btn-primary'), true);
	assert.equal(pageSource.includes('@click.prevent="scrollToRegistration"'), true);
	assert.equal(pageSource.includes("scrollIntoView"), true);
	assert.equal(pageSource.includes('class="tabs tabs-boxed'), true);
	assert.equal(pageSource.includes('role="tablist"'), true);
	assert.equal(pageSource.includes('tab-active'), true);
	assert.equal(pageSource.includes('selectedExperience.label'), false);
	assert.equal(pageSource.includes("t('seibuFair.table.seatsBooked'"), true);
	assert.equal(pageSource.includes('bookedSeats(session.id)'), true);
	assert.equal(pageSource.includes("t('seibuFair.table.seatsLeft'"), false);
	assert.equal(pageSource.includes("t('seibuFair.actions.full')"), true);
	assert.equal(pageSource.includes('name="seibu-fade"'), true);
	assert.equal(pageSource.includes('name="seibu-modal"'), true);
	assert.equal(pageSource.includes('prefers-reduced-motion'), true);
	assert.equal(pageSource.includes('submittedReservation'), true);
	assert.equal(pageSource.includes("t('seibuFair.reservation.summary.participants')"), true);
	assert.equal(pageSource.includes("t('seibuFair.reservation.previewNote')"), true);
	assert.equal(pageSource.includes("t('seibuFair.sections.registration')"), true);
	assert.equal(pageSource.includes("t('seibuFair.actions.reserveSeat')"), true);
	assert.equal(pageSource.includes("t('seibuFair.form.name')"), true);
	assert.equal(pageSource.includes('seibu-product-mosaic'), false);
	assert.equal(pageSource.includes('~/data/seibuFair'), false);
	assert.equal(pageSource.includes('/api/content/seibu-fair'), true);
	assert.equal(pageSource.includes('/api/seibu-fair/reservations'), true);
	assert.equal(nuxtConfigSource.includes('/rcms-api/1/seibu-reservations'), true);
});

test('SEIBU UI copy exists in English and Japanese locale files', async () => {
	const en = JSON.parse(await readFile(new URL('../locales/en.json', import.meta.url), 'utf8'));
	const ja = JSON.parse(await readFile(new URL('../locales/ja.json', import.meta.url), 'utf8'));

	assert.equal(en.seibuFair.announcement.actionLabel, 'View event');
	assert.equal(ja.seibuFair.announcement.actionLabel, 'イベントを見る');
	assert.equal(en.seibuFair.posterAlt, 'SEIBU fair poster');
	assert.equal(ja.seibuFair.posterAlt, '西武フェアポスター');
	assert.equal(en.seibuFair.sections.registration, 'Experience & Registration');
	assert.equal(ja.seibuFair.sections.registration, '体験イベント・予約');
	assert.equal(en.seibuFair.table.seatsBooked, '{booked} / {capacity} seats booked');
	assert.equal(ja.seibuFair.table.seatsBooked, '{booked}／{capacity}名予約済み');
	assert.equal(en.seibuFair.reservation.previewNote.includes('Kuroco'), true);
	assert.equal(ja.seibuFair.reservation.summary.participants, '参加人数');
	assert.equal(en.seibuFair.actions.reserve, 'Reserve');
	assert.equal(ja.seibuFair.actions.reserve, '予約する');
	assert.equal(en.seibuFair.actions.full, 'Full');
	assert.equal(ja.seibuFair.actions.full, '満員');
	assert.equal(en.seibuFair.form.name, 'Name');
	assert.equal(ja.seibuFair.form.name, 'お名前');
});

test('SEIBU locale action labels do not mix English and Japanese', async () => {
	const en = JSON.parse(await readFile(new URL('../locales/en.json', import.meta.url), 'utf8'));
	const ja = JSON.parse(await readFile(new URL('../locales/ja.json', import.meta.url), 'utf8'));

	assert.doesNotMatch(JSON.stringify(en.seibuFair.actions), /[ぁ-んァ-ン一-龯]/);
	assert.doesNotMatch(JSON.stringify(ja.seibuFair.actions), /\b(Full|Reserve|Submit|Done)\b/);
});

test('Japanese SEIBU copy avoids mixed English UI text', async () => {
	const ja = JSON.parse(await readFile(new URL('../locales/ja.json', import.meta.url), 'utf8'));
	const event = getSeibuFairEvent('ja');
	const visibleCopy = JSON.stringify({
		title: event.title,
		subtitle: event.subtitle,
		host: event.host,
		intro: event.intro,
		productIntro: event.productIntro,
		dates: event.dates,
		venue: event.venue,
		admission: event.admission,
		posterName: event.posterAsset.name,
		announcement: event.announcement,
		productAssets: event.productAssets.map(({ name, company }) => ({ name, company })),
		exhibitors: event.exhibitors.map(({ name, description }) => ({ name, description })),
		experiences: event.experiences.map(({ name, label, description, sessions }) => ({
			name,
			label,
			description,
			sessions: sessions.map(({ date }) => ({ date })),
		})),
	});

	assert.equal(ja.seibuFair.announcement.title, '西武フェア');
	assert.equal(ja.seibuFair.posterAlt, '西武フェアポスター');
	assert.equal(ja.seibuFair.actions.full, '満員');
	assert.doesNotMatch(
		visibleCopy,
		/\b(SEIBU|Full|Level|Event|Hall|Workshop|Yukata|Origami|Color|Dressing|International|Fair|Craft|Culture|Free|Japan|Japanese|Takumi|JAPONISM|SUI-RYU|FITOKIO|YOU&ME|QLOGO|LITA|Fukushin|Yoshimune|Uwajima|Pearl|Kimono|Hijab|Vegan|Soap|Plate|Knife|slippers|TRX)\b/,
	);
});

test('SEIBU fallback event content resolves by locale', () => {
	const english = getSeibuFairEvent('en');
	const japanese = getSeibuFairEvent('ja');

	assert.equal(english.title, 'The Art of Japan');
	assert.equal(english.experiences[0].label, '');
	assert.equal(japanese.title, '日本の美');
	assert.equal(japanese.announcement.title, '西武フェア');
	assert.equal(japanese.dates.range, '2026年6月19日〜30日');
	assert.equal(japanese.admission, '入場無料');
	assert.equal(japanese.experiences[0].name, '浴衣着付け');
	assert.equal(japanese.experiences[0].label, '浴衣');
	assert.equal(japanese.experiences[0].sessions[0].date, '6月20日(土)');
	assert.notEqual(japanese, seibuFairEvent);
});

test('SEIBU fair uses internal Nuxt API routes for Kuroco content and reservations', async () => {
	const contentRoute = await readFile(
		new URL('../server/api/content/seibu-fair.get.ts', import.meta.url),
		'utf8',
	);
	const reservationRoute = await readFile(
		new URL('../server/api/seibu-fair/reservations.post.ts', import.meta.url),
		'utf8',
	);
	const fetchUtility = await readFile(
		new URL('../server/utils/seibuFairFetch.ts', import.meta.url),
		'utf8',
	);
	const nuxtConfig = await readFile(new URL('../nuxt.config.ts', import.meta.url), 'utf8');

	assert.match(contentRoute, /fetchSeibuFairEvent/);
	assert.match(reservationRoute, /validateSeibuReservationPayload/);
	assert.match(reservationRoute, /submitSeibuReservationToKuroco/);
	assert.match(reservationRoute, /readBody\(event\)/);
	assert.match(reservationRoute, /fetchSeibuFairEvent\(event, body\.locale\)/);
	assert.match(fetchUtility, /mergeSeibuWorkshopSource/);
	assert.match(fetchUtility, /kurocoSeibuWorkshopPath/);
	assert.match(fetchUtility, /mapSeibuReservationPayload/);
	assert.match(fetchUtility, /kurocoSeibuReservationPostPath/);
	assert.doesNotMatch(fetchUtility, /\/inquiry\//);
	assert.match(nuxtConfig, /KUROCO_SEIBU_WORKSHOP_PATH/);
	assert.match(nuxtConfig, /\/rcms-api\/3\/seibu-workshop/);
	assert.match(nuxtConfig, /KUROCO_SEIBU_RESERVATION_POST_PATH/);
	assert.match(nuxtConfig, /\/rcms-api\/1\/seibu/);
});
