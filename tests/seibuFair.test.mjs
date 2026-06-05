import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { test } from 'node:test';

import { seibuFairEvent } from '../data/seibuFair.mjs';
import {
	canReserveParticipants,
	createSessionSeatMap,
	getRemainingSeats,
	isValidRegistration,
} from '../utils/seibuReservation.mjs';

test('SEIBU fair event data uses the approved frontend scope', () => {
	assert.equal(seibuFairEvent.route, '/seibu-fair');
	assert.equal(seibuFairEvent.dates.year, 2026);
	assert.equal(seibuFairEvent.stats.exhibitors, seibuFairEvent.exhibitors.length);
	assert.equal(seibuFairEvent.stats.exhibitors, 14);
	assert.equal(seibuFairEvent.stats.products, 50);
	assert.equal(seibuFairEvent.stats.experiences, seibuFairEvent.experiences.length);
	assert.equal(seibuFairEvent.stats.experiences, 3);
	assert.equal(seibuFairEvent.productAssets.length, 7);
});

test('SEIBU fair event data has production copy instead of placeholder text', () => {
	const serialized = JSON.stringify(seibuFairEvent).toLowerCase();

	assert.equal(serialized.includes('dummy'), false);
	assert.equal(serialized.includes('sample'), false);
	assert.equal(serialized.includes('サンプル'), false);
	assert.equal(typeof seibuFairEvent.productIntro, 'string');
	assert.ok(seibuFairEvent.productIntro.length > 40);
	assert.equal(seibuFairEvent.exhibitors.every((exhibitor) => exhibitor.description.length > 40), true);
	assert.equal(
		seibuFairEvent.productAssets.every((asset) => asset.description && asset.description.length > 24),
		true,
	);
});

test('SEIBU fair product assets are available in the public image folder', async () => {
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

	assert.equal(getRemainingSeats(seatMap, fullSessionId), 0);
	assert.equal(canReserveParticipants(seatMap, fullSessionId, 1), false);
	assert.equal(canReserveParticipants(seatMap, openSessionId, 2), true);
});

test('announcement component remains reusable and event data supplies the campaign copy', async () => {
	assert.equal(seibuFairEvent.announcement.to, seibuFairEvent.route);
	assert.equal(seibuFairEvent.announcement.label, '19-30 Jun 2026');
	assert.equal(seibuFairEvent.announcement.title, 'SEIBU Fair');
	assert.equal(seibuFairEvent.announcement.actionLabel, 'View event');
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
});

test('SEIBU announcement is gated to homepage routes in the nav', async () => {
	const navSource = await readFile(new URL('../components/NavMenu.vue', import.meta.url), 'utf8');

	assert.equal(navSource.includes('v-if="isHomePage"'), true);
	assert.equal(navSource.includes("['/', '/ja', '/ja/']"), true);
	assert.match(navSource, /<AnnouncementBar/);
});

test('SEIBU event page uses event data for product section copy', async () => {
	const pageSource = await readFile(new URL('../pages/seibu-fair.vue', import.meta.url), 'utf8');

	assert.equal(pageSource.includes('Dummy product information'), false);
	assert.equal(pageSource.includes('event.productIntro'), true);
	assert.equal(pageSource.includes('asset.description'), true);
});
