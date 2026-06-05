<template>
	<main class="seibu-page">
		<section class="seibu-hero">
			<div class="seibu-shell seibu-hero__grid">
				<div class="seibu-hero__copy">
					<p class="seibu-kicker">{{ event.host }}</p>
					<h1>
						<span>{{ event.title }}</span>
						<strong>{{ event.subtitle }}</strong>
					</h1>
					<p class="seibu-hero__lead">{{ event.intro }}</p>
					<div class="seibu-hero__details">
						<p>{{ event.dates.range }}</p>
						<p>{{ event.venue }}</p>
						<p>{{ event.admission }}</p>
					</div>
				</div>

				<figure class="seibu-hero__poster">
					<img :src="event.productAssets[6].src" :alt="event.productAssets[6].name" />
					<div class="seibu-date-badge">
						<span>{{ event.dates.badge }}</span>
						<small>{{ event.dates.year }}</small>
					</div>
					<figcaption>
						<span>SEIBU TRX · Level 2 Event Hall</span>
						<strong>Free Admission</strong>
					</figcaption>
				</figure>

				<div class="seibu-stats" aria-label="Event highlights">
					<div v-for="stat in heroStats" :key="stat.label">
						<strong>{{ stat.value }}</strong>
						<span>{{ stat.label }}</span>
					</div>
				</div>
			</div>
		</section>

		<section class="seibu-product-strip">
			<div class="seibu-shell">
				<div class="seibu-product-strip__header">
					<p>Featured Products</p>
					<span>{{ event.productIntro }}</span>
				</div>
				<div class="seibu-product-mosaic" aria-label="Featured products">
					<figure
						v-for="asset in event.productAssets"
						:key="asset.src"
						class="seibu-product-mosaic__item">
						<img :src="asset.src" :alt="asset.name" />
						<figcaption>
							<span>{{ asset.name }}</span>
							<small>{{ asset.company }}</small>
							<em>{{ asset.description }}</em>
						</figcaption>
					</figure>
				</div>
			</div>
		</section>

		<section class="seibu-section seibu-section--paper">
			<div class="seibu-shell">
				<div class="seibu-section__header">
					<p>Exhibitors</p>
					<h2>Japanese craft and culture brands</h2>
				</div>
				<div class="seibu-exhibitor-grid">
					<article
						v-for="exhibitor in event.exhibitors"
						:key="exhibitor.id"
						class="seibu-exhibitor-card">
						<span>{{ exhibitor.id.replace('exhibitor-', '').padStart(2, '0') }}</span>
						<h3>{{ exhibitor.name }}</h3>
						<p>{{ exhibitor.description }}</p>
					</article>
				</div>
			</div>
		</section>

		<section class="seibu-section">
			<div class="seibu-shell">
				<div class="seibu-section__header">
					<p>Experiences</p>
					<h2>Free cultural workshops</h2>
				</div>
				<div class="seibu-experience-grid">
					<article
						v-for="experience in event.experiences"
						:key="experience.id"
						class="seibu-experience-card">
						<div>
							<span>{{ experience.label }}</span>
							<h3>{{ experience.name }}</h3>
						</div>
						<p>{{ experience.description }}</p>
						<strong>{{ experience.time }}</strong>
					</article>
				</div>
			</div>
		</section>

		<section class="seibu-section seibu-section--booking">
			<div class="seibu-shell">
				<div class="seibu-section__header">
					<p>Registration</p>
					<h2>Reserve your workshop seat</h2>
				</div>

				<div class="seibu-booking">
					<div class="seibu-tabs" role="tablist" aria-label="Experience type">
						<button
							v-for="experience in event.experiences"
							:key="experience.id"
							type="button"
							:class="{ 'is-active': selectedExperienceId === experience.id }"
							@click="selectedExperienceId = experience.id">
							<span>{{ experience.label }}</span>
							{{ experience.name }}
						</button>
					</div>

					<div class="seibu-sessions">
						<article
							v-for="session in selectedExperience.sessions"
							:key="session.id"
							class="seibu-session-row">
							<div>
								<span>{{ selectedExperience.name }}</span>
								<h3>{{ session.date }}</h3>
								<p>{{ selectedExperience.time }}</p>
							</div>

							<div class="seibu-seat-meter">
								<div class="seibu-seat-meter__label">
									<span>{{ remainingSeats(session.id) }} seats left</span>
									<span>{{ session.capacity }} max</span>
								</div>
								<div class="seibu-seat-meter__track">
									<span :style="{ width: `${seatPercent(session.id)}%` }"></span>
								</div>
							</div>

							<button
								type="button"
								class="seibu-reserve-button"
								:disabled="isSessionFull(session.id)"
								@click="openReservation(session)">
								<Icon
									:name="isSessionFull(session.id) ? 'mdi:close-circle' : 'mdi:calendar-check'" />
								{{ isSessionFull(session.id) ? 'Full' : 'Reserve' }}
							</button>
						</article>
					</div>
				</div>
			</div>
		</section>

		<div
			v-if="activeSession"
			class="seibu-modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby="reservation-title">
			<div class="seibu-modal__panel">
				<button
					type="button"
					class="seibu-modal__close"
					aria-label="Close reservation form"
					@click="closeReservation">
					<Icon name="mdi:close" />
				</button>

				<div v-if="reservationComplete" class="seibu-reservation-success">
					<Icon name="mdi:check-circle" />
					<h2>Reservation complete</h2>
					<p>
						Your seat request for {{ activeSession.date }} has been recorded for this frontend
						preview.
					</p>
					<button type="button" class="seibu-reserve-button" @click="closeReservation">Done</button>
				</div>

				<form v-else class="seibu-form" @submit.prevent="submitReservation">
					<p class="seibu-kicker">{{ selectedExperience.name }}</p>
					<h2 id="reservation-title">Reserve {{ activeSession.date }}</h2>
					<p class="seibu-form__meta">
						{{ selectedExperience.time }} · {{ pendingRemainingSeats }} seats left
					</p>

					<label>
						Name
						<input v-model="registration.name" type="text" maxlength="50" autocomplete="name" />
					</label>
					<label>
						Email
						<input v-model="registration.email" type="email" maxlength="80" autocomplete="email" />
					</label>
					<label>
						Participants
						<input
							v-model.number="registration.participants"
							type="number"
							min="1"
							:max="pendingRemainingSeats" />
					</label>

					<p v-if="formError" class="seibu-form__error">{{ formError }}</p>

					<button type="submit" class="seibu-reserve-button seibu-reserve-button--wide">
						<Icon name="mdi:send" />
						Submit reservation
					</button>
				</form>
			</div>
		</div>
	</main>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { seibuFairEvent } from '~/data/seibuFair.mjs';
import {
	createSessionSeatMap,
	getRemainingSeats,
	getSeatPercent,
	isValidRegistration,
	reserveParticipants,
} from '~/utils/seibuReservation.mjs';

const event = seibuFairEvent;
const selectedExperienceId = ref(event.experiences[0].id);
const activeSession = ref(null);
const formError = ref('');
const reservationComplete = ref(false);
const seatMap = reactive(createSessionSeatMap(event.experiences));
const registration = reactive({
	name: '',
	email: '',
	participants: 1,
});

const heroStats = computed(() => [
	{ label: 'Exhibitors', value: event.stats.exhibitors },
	{ label: 'Products', value: event.stats.products },
	{ label: 'Experiences', value: event.stats.experiences },
]);

const selectedExperience = computed(
	() =>
		event.experiences.find((experience) => experience.id === selectedExperienceId.value) ||
		event.experiences[0],
);

const pendingRemainingSeats = computed(() => {
	if (!activeSession.value) return 0;
	return remainingSeats(activeSession.value.id);
});

function remainingSeats(sessionId) {
	return getRemainingSeats(seatMap, sessionId);
}

function seatPercent(sessionId) {
	return getSeatPercent(seatMap, sessionId);
}

function isSessionFull(sessionId) {
	return remainingSeats(sessionId) === 0;
}

function openReservation(session) {
	activeSession.value = session;
	formError.value = '';
	reservationComplete.value = false;
	registration.name = '';
	registration.email = '';
	registration.participants = 1;
}

function closeReservation() {
	activeSession.value = null;
	formError.value = '';
	reservationComplete.value = false;
}

function submitReservation() {
	if (!activeSession.value) return;
	if (!isValidRegistration(registration, pendingRemainingSeats.value)) {
		formError.value =
			'Please enter your name, a valid email, and a participant count within the remaining seats.';
		return;
	}
	if (!reserveParticipants(seatMap, activeSession.value.id, registration.participants)) {
		formError.value = 'This session no longer has enough seats.';
		return;
	}
	reservationComplete.value = true;
	formError.value = '';
}

useSeoMeta({
	title: `${event.title} — ${event.subtitle} | Takumi International`,
	ogTitle: `${event.title} — ${event.subtitle}`,
	description: `${event.host} presents a SEIBU TRX fair for Japanese craft, culture, products, and free workshops.`,
	ogDescription: `${event.host} presents a SEIBU TRX fair for Japanese craft, culture, products, and free workshops.`,
	ogImage: event.productAssets[0].src,
	twitterCard: 'summary_large_image',
});
</script>

<style scoped>
.seibu-page {
	overflow-x: hidden;
	padding-top: 4.15rem;
	background: #fbfbf8;
	color: var(--tk-color-ink);
	font-family: Montserrat, 'Open Sans', sans-serif;
}

.seibu-shell {
	width: min(calc(100% - (var(--tk-space-gutter) * 2)), var(--tk-content-max));
	margin: 0 auto;
}

.seibu-hero {
	position: relative;
	display: flex;
	align-items: center;
	min-height: calc(100svh - 4.15rem);
	padding: clamp(4rem, 7vw, 6.5rem) 0;
	background: linear-gradient(90deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.78)),
		linear-gradient(135deg, rgba(181, 35, 34, 0.08), rgba(35, 58, 94, 0.1));
}

.seibu-hero::before {
	position: absolute;
	inset: 0;
	background: linear-gradient(90deg, rgba(21, 19, 19, 0.08) 1px, transparent 1px),
		linear-gradient(0deg, rgba(21, 19, 19, 0.06) 1px, transparent 1px);
	background-size: 44px 44px;
	content: '';
	mask-image: linear-gradient(90deg, transparent, #000 15%, #000 75%, transparent);
	pointer-events: none;
}

.seibu-hero__grid {
	position: relative;
	display: grid;
	grid-template-columns: minmax(0, 0.95fr) minmax(22rem, 0.78fr);
	align-items: center;
	gap: clamp(2.5rem, 6vw, 6rem);
}

.seibu-hero__copy {
	display: grid;
	gap: clamp(1.15rem, 2vw, 1.7rem);
	max-width: 46rem;
}

.seibu-kicker {
	margin: 0;
	color: var(--tk-color-event-red);
	font-size: 0.78rem;
	font-weight: 800;
	letter-spacing: 0.08em;
	text-transform: uppercase;
}

.seibu-hero h1,
.seibu-section__header h2,
.seibu-modal h2 {
	margin: 0;
	letter-spacing: 0;
}

.seibu-hero h1 {
	max-width: 48rem;
	font-size: clamp(3.15rem, 7.6vw, 6.75rem);
	font-weight: 900;
	line-height: 0.92;
}

.seibu-hero h1 span {
	display: block;
	color: var(--tk-color-ink);
}

.seibu-hero h1 strong {
	display: block;
	color: var(--tk-color-event-red);
	font: inherit;
}

.seibu-hero__lead {
	max-width: 36rem;
	margin: 0;
	color: var(--tk-color-muted);
	font-size: clamp(1rem, 1.6vw, 1.2rem);
	font-weight: 600;
	line-height: 1.7;
}

.seibu-hero__details {
	display: grid;
	gap: 0.55rem;
	max-width: 38rem;
	border-left: 4px solid var(--tk-color-event-gold);
	padding-left: 1rem;
	color: var(--tk-color-muted);
	font-weight: 700;
}

.seibu-hero__details p {
	margin: 0;
}

.seibu-date-badge {
	position: absolute;
	top: clamp(1rem, 3vw, 1.75rem);
	left: clamp(1rem, 3vw, 1.75rem);
	display: inline-flex;
	flex: 0 0 auto;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 7rem;
	height: 7rem;
	border: 0.35rem solid #fff;
	border-radius: 50%;
	background: var(--tk-color-event-red);
	box-shadow: 0 1.25rem 3rem rgba(21, 19, 19, 0.28);
	color: #fff;
	text-align: center;
	z-index: 2;
}

.seibu-date-badge span {
	font-size: 1.1rem;
	font-weight: 900;
	line-height: 1;
}

.seibu-date-badge small {
	margin-top: 0.35rem;
	font-size: 0.8rem;
	font-weight: 800;
}

.seibu-stats {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	grid-column: 1 / -1;
	gap: 0;
	width: min(100%, 52rem);
	border: 1px solid rgba(21, 19, 19, 0.14);
	background: rgba(255, 255, 255, 0.72);
	backdrop-filter: blur(10px);
}

.seibu-stats div {
	padding: 1.05rem 1.2rem;
}

.seibu-stats div + div {
	border-left: 1px solid rgba(21, 19, 19, 0.14);
}

.seibu-stats strong,
.seibu-stats span {
	display: block;
}

.seibu-stats strong {
	color: var(--tk-color-event-red);
	font-size: clamp(1.7rem, 3vw, 2.3rem);
	line-height: 1;
}

.seibu-stats span {
	margin-top: 0.4rem;
	color: var(--tk-color-muted);
	font-size: 0.78rem;
	font-weight: 800;
	text-transform: uppercase;
}

.seibu-hero__poster {
	position: relative;
	min-height: clamp(30rem, 56vw, 42rem);
	margin: 0;
	border: 1px solid rgba(21, 19, 19, 0.16);
	background: var(--tk-color-sumi);
	box-shadow: 0 2rem 5rem rgba(21, 19, 19, 0.2);
}

.seibu-hero__poster::after {
	position: absolute;
	inset: 1rem;
	border: 1px solid rgba(255, 255, 255, 0.45);
	content: '';
	pointer-events: none;
}

.seibu-hero__poster img {
	width: 100%;
	height: 100%;
	min-height: inherit;
	object-fit: cover;
}

.seibu-hero__poster figcaption {
	position: absolute;
	right: 1.75rem;
	bottom: 1.75rem;
	display: grid;
	gap: 0.25rem;
	width: min(70%, 18rem);
	padding: 1rem 1.1rem;
	background: rgba(255, 255, 255, 0.92);
	color: var(--tk-color-ink);
}

.seibu-hero__poster figcaption span {
	color: var(--tk-color-muted);
	font-size: 0.75rem;
	font-weight: 800;
	text-transform: uppercase;
}

.seibu-hero__poster figcaption strong {
	color: var(--tk-color-event-red);
	font-size: 1.1rem;
}

.seibu-product-strip {
	padding: clamp(2.5rem, 5vw, 4rem) 0;
	background: var(--tk-color-sumi);
	color: #fff;
}

.seibu-product-strip__header {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 1.25rem;
}

.seibu-product-strip__header p {
	margin: 0;
	color: var(--tk-color-event-gold);
	font-weight: 900;
	letter-spacing: 0.1em;
	text-transform: uppercase;
}

.seibu-product-strip__header span {
	max-width: 40rem;
	color: rgba(255, 255, 255, 0.64);
	font-size: 0.88rem;
	font-weight: 700;
	line-height: 1.6;
	text-align: right;
}

.seibu-product-mosaic {
	display: grid;
	grid-template-columns: repeat(7, minmax(0, 1fr));
	gap: 0.65rem;
}

.seibu-product-mosaic__item {
	position: relative;
	overflow: hidden;
	aspect-ratio: 4 / 5;
	min-height: 0;
	margin: 0;
	border: 1px solid rgba(255, 255, 255, 0.18);
	background: rgba(255, 255, 255, 0.08);
}

.seibu-product-mosaic__item img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 300ms ease;
}

.seibu-product-mosaic__item:hover img {
	transform: scale(1.04);
}

.seibu-product-mosaic__item figcaption {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
	display: grid;
	gap: 0.15rem;
	min-height: 7.5rem;
	padding: 0.75rem;
	background: linear-gradient(0deg, rgba(21, 19, 19, 0.88), rgba(21, 19, 19, 0.46));
	color: #fff;
}

.seibu-product-mosaic__item span,
.seibu-product-mosaic__item small,
.seibu-product-mosaic__item em {
	overflow-wrap: anywhere;
	line-height: 1.2;
}

.seibu-product-mosaic__item span {
	font-size: 0.82rem;
	font-weight: 800;
}

.seibu-product-mosaic__item small {
	color: rgba(255, 255, 255, 0.76);
	font-size: 0.72rem;
}

.seibu-product-mosaic__item em {
	display: -webkit-box;
	overflow: hidden;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	color: rgba(255, 255, 255, 0.86);
	font-size: 0.7rem;
	font-style: normal;
}

.seibu-section {
	padding: var(--tk-space-section) 0;
	background: #fbfbf8;
}

.seibu-section--paper {
	background: var(--tk-color-rice);
}

.seibu-section--booking {
	background: var(--tk-color-sumi);
	color: #fff;
}

.seibu-section__header {
	display: grid;
	gap: 0.45rem;
	max-width: 42rem;
	margin-bottom: clamp(2rem, 5vw, 3.25rem);
}

.seibu-section__header p {
	margin: 0;
	color: var(--tk-color-event-gold);
	font-size: 0.78rem;
	font-weight: 900;
	letter-spacing: 0.12em;
	text-transform: uppercase;
}

.seibu-section__header h2 {
	font-size: clamp(2rem, 4vw, 3.6rem);
	font-weight: 900;
	line-height: 1.05;
}

.seibu-exhibitor-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 1rem;
}

.seibu-exhibitor-card,
.seibu-experience-card {
	border: 1px solid var(--tk-color-border);
	background: rgba(255, 255, 255, 0.86);
}

.seibu-exhibitor-card {
	display: grid;
	gap: 0.75rem;
	min-height: 13rem;
	padding: 1.2rem;
	box-shadow: 0 1rem 2rem rgba(21, 19, 19, 0.04);
}

.seibu-exhibitor-card span {
	color: var(--tk-color-event-red);
	font-size: 0.78rem;
	font-weight: 900;
}

.seibu-exhibitor-card h3,
.seibu-experience-card h3,
.seibu-session-row h3 {
	margin: 0;
	color: var(--tk-color-ink);
	font-size: 1.05rem;
	font-weight: 900;
	letter-spacing: 0;
	line-height: 1.25;
}

.seibu-exhibitor-card p,
.seibu-experience-card p,
.seibu-session-row p {
	margin: 0;
	color: var(--tk-color-muted);
	line-height: 1.65;
}

.seibu-experience-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1rem;
}

.seibu-experience-card {
	display: grid;
	gap: 1rem;
	padding: 1.35rem;
	box-shadow: 0 1rem 2rem rgba(21, 19, 19, 0.04);
}

.seibu-experience-card span {
	display: inline-flex;
	width: max-content;
	margin-bottom: 0.75rem;
	padding: 0.25rem 0.55rem;
	background: var(--tk-color-event-red);
	color: #fff;
	font-size: 0.74rem;
	font-weight: 900;
}

.seibu-experience-card strong {
	color: var(--tk-color-brand-brown);
	font-size: 0.95rem;
}

.seibu-booking {
	display: grid;
	gap: 1.5rem;
}

.seibu-tabs {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 0.75rem;
}

.seibu-tabs button {
	display: grid;
	gap: 0.35rem;
	border: 1px solid rgba(255, 255, 255, 0.18);
	background: rgba(255, 255, 255, 0.08);
	padding: 1rem;
	color: #fff;
	font-weight: 800;
	text-align: left;
	transition:
		background 180ms ease,
		border-color 180ms ease;
}

.seibu-tabs button span {
	color: var(--tk-color-event-gold);
	font-size: 0.74rem;
}

.seibu-tabs button.is-active {
	border-color: var(--tk-color-event-gold);
	background: rgba(199, 154, 67, 0.2);
}

.seibu-sessions {
	display: grid;
	gap: 0.8rem;
}

.seibu-session-row {
	display: grid;
	grid-template-columns: minmax(12rem, 1fr) minmax(12rem, 0.9fr) auto;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	border: 1px solid rgba(255, 255, 255, 0.16);
	background: rgba(255, 255, 255, 0.08);
}

.seibu-session-row span {
	color: var(--tk-color-event-gold);
	font-size: 0.78rem;
	font-weight: 800;
}

.seibu-session-row h3,
.seibu-session-row p {
	color: #fff;
}

.seibu-session-row p {
	color: rgba(255, 255, 255, 0.72);
}

.seibu-seat-meter {
	display: grid;
	gap: 0.45rem;
}

.seibu-seat-meter__label {
	display: flex;
	justify-content: space-between;
	gap: 1rem;
	color: rgba(255, 255, 255, 0.8);
	font-size: 0.78rem;
}

.seibu-seat-meter__track {
	overflow: hidden;
	height: 0.55rem;
	background: rgba(255, 255, 255, 0.18);
}

.seibu-seat-meter__track span {
	display: block;
	height: 100%;
	background: var(--tk-color-event-gold);
	transition: width 200ms ease;
}

.seibu-reserve-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.45rem;
	min-height: 2.75rem;
	border: 0;
	background: var(--tk-color-event-red);
	padding: 0.7rem 1rem;
	color: #fff;
	font-weight: 900;
	transition:
		background 180ms ease,
		opacity 180ms ease;
}

.seibu-reserve-button:hover:not(:disabled) {
	background: var(--tk-color-brand-brown);
}

.seibu-reserve-button:disabled {
	cursor: not-allowed;
	opacity: 0.45;
}

.seibu-reserve-button--wide {
	width: 100%;
}

.seibu-modal {
	position: fixed;
	inset: 0;
	z-index: 50;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	background: rgba(21, 19, 19, 0.72);
}

.seibu-modal__panel {
	position: relative;
	width: min(100%, 32rem);
	max-height: calc(100svh - 2rem);
	overflow: auto;
	background: var(--tk-color-paper);
	padding: clamp(1.5rem, 4vw, 2rem);
	color: var(--tk-color-ink);
}

.seibu-modal__close {
	position: absolute;
	top: 0.75rem;
	right: 0.75rem;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2.25rem;
	height: 2.25rem;
	border: 1px solid var(--tk-color-border);
	background: #fff;
	color: var(--tk-color-ink);
}

.seibu-form,
.seibu-reservation-success {
	display: grid;
	gap: 1rem;
}

.seibu-form {
	padding-top: 1rem;
}

.seibu-form__meta {
	margin: 0;
	color: var(--tk-color-muted);
	font-weight: 700;
}

.seibu-form label {
	display: grid;
	gap: 0.4rem;
	color: var(--tk-color-muted);
	font-size: 0.82rem;
	font-weight: 800;
}

.seibu-form input {
	width: 100%;
	border: 1px solid var(--tk-color-border);
	background: #fff;
	padding: 0.85rem 0.9rem;
	color: var(--tk-color-ink);
	font: inherit;
}

.seibu-form__error {
	margin: 0;
	color: var(--tk-color-event-red);
	font-size: 0.85rem;
	font-weight: 800;
	line-height: 1.5;
}

.seibu-reservation-success {
	justify-items: start;
	padding-top: 1rem;
}

.seibu-reservation-success svg {
	color: var(--tk-color-moss);
	font-size: 2.5rem;
}

.seibu-reservation-success p {
	margin: 0;
	color: var(--tk-color-muted);
	line-height: 1.7;
}

@media (max-width: 1024px) {
	.seibu-hero__grid {
		grid-template-columns: 1fr;
	}

	.seibu-product-mosaic {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.seibu-exhibitor-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 767px) {
	.seibu-page {
		padding-top: 4rem;
	}

	.seibu-hero {
		min-height: auto;
		padding-top: 3rem;
	}

	.seibu-hero__details {
		padding-left: 0.85rem;
	}

	.seibu-date-badge {
		width: 5.75rem;
		height: 5.75rem;
	}

	.seibu-stats,
	.seibu-tabs,
	.seibu-experience-grid,
	.seibu-exhibitor-grid {
		grid-template-columns: 1fr;
	}

	.seibu-stats div + div {
		border-top: 1px solid rgba(21, 19, 19, 0.14);
		border-left: 0;
	}

	.seibu-product-mosaic {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.seibu-product-strip__header {
		align-items: flex-start;
		flex-direction: column;
	}

	.seibu-product-strip__header span {
		text-align: left;
	}

	.seibu-hero__poster {
		min-height: 17rem;
	}

	.seibu-hero__poster figcaption {
		right: 1rem;
		bottom: 1rem;
		left: 1rem;
		width: auto;
	}

	.seibu-session-row {
		grid-template-columns: 1fr;
	}

	.seibu-reserve-button {
		width: 100%;
	}
}
</style>
