<template>
	<main class="seibu-page bg-base-100">
		<section class="py-12">
			<div class="w-container">
				<div class="grid gap-8 lg:grid-cols-2 lg:items-start">
					<div class="flex flex-col gap-5">
						<p class="font-bold text-primary">{{ event.host }}</p>
						<div>
							<h1 class="text-4xl font-bold text-primary md:text-5xl">
								{{ event.title }}
							</h1>
							<h2 class="mt-2 text-2xl font-bold text-secondary-500">
								{{ event.subtitle }}
							</h2>
						</div>
						<p v-if="event.intro" class="max-w-xl leading-7 text-secondary-500">
							{{ event.intro }}
						</p>

						<div class="flex flex-wrap gap-3">
							<div
								v-for="stat in seibuStats"
								:key="stat.key"
								class="seibu-stat-circle"
								:aria-label="`${event.stats[stat.key]} ${stat.label}`">
								<strong>{{ event.stats[stat.key] }}</strong>
								<span>{{ stat.label }}</span>
							</div>
						</div>

						<div class="overflow-x-auto">
							<table class="table">
								<tbody>
									<tr>
										<th>{{ t('seibuFair.details.date') }}</th>
										<td>{{ event.dates.range }}</td>
									</tr>
									<tr>
										<th>{{ t('seibuFair.details.venue') }}</th>
										<td>{{ event.venue }}</td>
									</tr>
									<tr>
										<th>{{ t('seibuFair.details.admission') }}</th>
										<td>{{ event.admission }}</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div>
							<a :href="heroButtonHref" class="btn btn-primary" @click.prevent="scrollToRegistration">
								{{ heroButtonTitle }}
							</a>
						</div>
					</div>

					<figure class="card border border-base-200 bg-base-100">
						<div class="card-body p-3">
							<img
								:src="posterAsset.src"
								:alt="posterAsset.name"
								class="seibu-poster rounded-box" />
						</div>
					</figure>
				</div>
			</div>
		</section>

		<section class="bg-neutral py-12">
			<div class="w-container">
				<div class="mb-8">
					<h2 class="text-3xl font-bold text-primary">
						{{ event.companiesTitle || t('seibuFair.sections.companies') }}
					</h2>
				</div>

				<div class="seibu-card-grid">
					<article
						v-for="exhibitor in event.exhibitors"
						:key="exhibitor.id"
						class="card border border-base-200 bg-base-100">
						<div class="card-body gap-3">
							<span class="badge badge-primary">{{ exhibitorNumber(exhibitor.id) }}</span>
							<h3 class="card-title text-base">{{ exhibitor.name }}</h3>
							<p v-if="exhibitor.description" class="leading-7 text-secondary-500">
								{{ exhibitor.description }}
							</p>
						</div>
					</article>
				</div>
			</div>
		</section>

		<section v-if="event.productAssets.length" class="py-12">
			<div class="w-container">
				<div class="mb-8">
					<h2 class="text-3xl font-bold text-primary">
						{{ event.featuredProductsTitle || t('seibuFair.sections.products') }}
					</h2>
				</div>

				<div class="seibu-product-grid">
					<article
						v-for="asset in event.productAssets"
						:key="asset.src || asset.name"
						class="card border border-base-200 bg-base-100">
						<figure v-if="asset.src" class="bg-neutral">
							<img :src="asset.src" :alt="asset.name" class="seibu-product-image" />
						</figure>
						<div class="card-body gap-2">
							<h3 class="card-title text-base">{{ asset.name }}</h3>
							<p v-if="asset.company" class="text-sm text-secondary-500">{{ asset.company }}</p>
						</div>
					</article>
				</div>
			</div>
		</section>

		<section id="registration" class="bg-neutral py-12">
			<div class="w-container">
				<div class="mb-8">
					<h2 class="text-3xl font-bold text-primary">
						{{ event.registrationTitle || t('seibuFair.sections.registration') }}
					</h2>
					<p class="mt-3 max-w-2xl leading-7 text-secondary-500">
						{{ event.registrationDescription || t('seibuFair.sections.registrationIntro') }}
					</p>
				</div>

				<div
					v-if="event.experiences.length"
					class="tabs tabs-boxed mb-6"
					role="tablist"
					:aria-label="t('seibuFair.accessibility.experienceType')">
					<button
						v-for="experience in event.experiences"
						:key="experience.id"
						type="button"
						role="tab"
						class="tab"
						:class="{ 'tab-active': selectedExperienceId === experience.id }"
						:aria-selected="selectedExperienceId === experience.id"
						@click="selectedExperienceId = experience.id">
						{{ experienceTabLabel(experience) }}
					</button>
				</div>

				<Transition name="seibu-fade" mode="out-in">
					<article
						v-if="selectedExperience.id"
						:key="selectedExperience.id"
						class="card border border-base-200 bg-base-100">
						<div class="card-body">
							<div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
								<div>
									<div class="flex flex-wrap items-center gap-2">
										<h3 class="card-title">{{ selectedExperience.name }}</h3>
									</div>
									<p
										v-if="selectedExperience.description"
										class="mt-3 leading-7 text-secondary-500">
										{{ selectedExperience.description }}
									</p>
								</div>
								<span v-if="selectedExperience.time" class="badge badge-outline">
									{{ selectedExperience.time }}
								</span>
							</div>

							<div class="mt-4 overflow-x-auto">
								<table class="table">
									<thead>
										<tr>
											<th>{{ t('seibuFair.table.session') }}</th>
											<th>{{ t('seibuFair.table.seats') }}</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="session in selectedExperience.sessions" :key="session.id">
											<td>
												<div class="font-bold">{{ session.date }}</div>
												<div class="text-sm text-secondary-500">
													{{ session.time || selectedExperience.time }}
												</div>
											</td>
											<td>
												<div class="flex min-w-40 flex-col gap-2">
													<span class="text-sm text-secondary-500">
														{{
															t('seibuFair.table.seatsBooked', {
																booked: bookedSeats(session.id),
																capacity: session.capacity,
															})
														}}
													</span>
													<progress
														class="progress progress-primary w-40"
														:value="seatPercent(session.id)"
														max="100"></progress>
												</div>
											</td>
											<td class="text-right">
												<button
													type="button"
													class="btn btn-primary btn-sm"
													:disabled="isSessionFull(session.id)"
													@click="openReservation(selectedExperience, session)">
													{{
														isSessionFull(session.id)
															? t('seibuFair.actions.full')
															: t('seibuFair.actions.reserve')
													}}
												</button>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</article>
				</Transition>
			</div>
		</section>

		<Transition name="seibu-modal">
			<div v-if="activeSession" class="modal modal-open" role="dialog" aria-modal="true">
				<div class="modal-box">
					<button
						type="button"
						class="btn btn-ghost btn-sm btn-circle absolute right-2 top-2"
						:aria-label="t('seibuFair.accessibility.closeReservation')"
						@click="closeReservation">
						<Icon name="mdi:close" />
					</button>

					<div v-if="reservationComplete" class="flex flex-col gap-4">
						<Icon name="mdi:check-circle" class="text-4xl text-primary" />
						<h2 class="text-2xl font-bold">{{ t('seibuFair.reservation.completeTitle') }}</h2>
						<p>
							{{ t('seibuFair.reservation.completeMessage') }}
						</p>
						<div v-if="reservationPreview" class="alert border-base-200 bg-neutral text-sm">
							<Icon name="mdi:information-outline" />
							<span>{{ t('seibuFair.reservation.previewNote') }}</span>
						</div>
						<div v-if="submittedReservation" class="overflow-x-auto">
							<table class="table">
								<tbody>
									<tr>
										<th>{{ t('seibuFair.reservation.summary.experience') }}</th>
										<td>{{ submittedReservation.experienceName }}</td>
									</tr>
									<tr>
										<th>{{ t('seibuFair.reservation.summary.session') }}</th>
										<td>{{ reservationSessionLabel }}</td>
									</tr>
									<tr>
										<th>{{ t('seibuFair.reservation.summary.name') }}</th>
										<td>{{ submittedReservation.name }}</td>
									</tr>
									<tr>
										<th>{{ t('seibuFair.reservation.summary.email') }}</th>
										<td>{{ submittedReservation.email }}</td>
									</tr>
									<tr>
										<th>{{ t('seibuFair.reservation.summary.participants') }}</th>
										<td>{{ submittedReservation.participants }}</td>
									</tr>
									<tr v-if="reservationId">
										<th>{{ t('seibuFair.reservation.summary.reference') }}</th>
										<td>{{ reservationId }}</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="modal-action">
							<button type="button" class="btn btn-primary" @click="closeReservation">
								{{ t('seibuFair.actions.done') }}
							</button>
						</div>
					</div>

					<form v-else class="flex flex-col gap-4" @submit.prevent="submitReservation">
						<div>
							<p class="font-bold text-primary">{{ selectedExperience.name }}</p>
							<h2 id="reservation-title" class="mt-1 text-2xl font-bold">
								{{ t('seibuFair.reservation.reserveTitle', { date: activeSession.date }) }}
							</h2>
							<p class="mt-2 text-sm text-secondary-500">
								{{ activeSession.time || selectedExperience.time }} ·
								{{ t('seibuFair.reservation.remainingSeats', { count: pendingRemainingSeats }) }}
							</p>
						</div>

						<label class="form-control w-full">
							<div class="label">
								<span class="label-text">{{ t('seibuFair.form.name') }}</span>
							</div>
							<input
								v-model="registration.name"
								type="text"
								maxlength="50"
								autocomplete="name"
								class="input input-bordered w-full" />
						</label>

						<label class="form-control w-full">
							<div class="label">
								<span class="label-text">{{ t('seibuFair.form.email') }}</span>
							</div>
							<input
								v-model="registration.email"
								type="email"
								maxlength="80"
								autocomplete="email"
								class="input input-bordered w-full" />
						</label>

						<label class="form-control w-full">
							<div class="label">
								<span class="label-text">{{ t('seibuFair.form.participants') }}</span>
							</div>
							<input
								v-model.number="registration.participants"
								type="number"
								min="1"
								:max="pendingRemainingSeats"
								class="input input-bordered w-full" />
						</label>

						<p v-if="formError" class="text-sm font-bold text-primary">{{ formError }}</p>

						<button type="submit" class="btn btn-primary w-full" :disabled="reservationSubmitting">
							<Icon name="mdi:send" />
							{{
								reservationSubmitting
									? t('seibuFair.actions.submitting')
									: t('seibuFair.actions.submitReservation')
							}}
						</button>
					</form>
				</div>
				<button
					type="button"
					class="modal-backdrop"
					:aria-label="t('seibuFair.accessibility.closeReservation')"
					@click="closeReservation"></button>
			</div>
		</Transition>
	</main>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import {
	createSessionSeatMap,
	getBookedSeats,
	getRemainingSeats,
	getSeatPercent,
	isValidRegistration,
} from '~/utils/seibuReservation.mjs';

const DEFAULT_POSTER_ASSET = {
	name: '',
	src: '/img/seibu-fair/seibu-panora-june-final.jpeg',
};
const EMPTY_SEIBU_EVENT = {
	route: '/seibu-fair',
	title: '',
	subtitle: '',
	host: '',
	intro: '',
	productIntro: '',
	companiesTitle: '',
	featuredProductsTitle: '',
	registrationTitle: '',
	registrationDescription: '',
	dates: { year: '', range: '', badge: '' },
	venue: '',
	admission: '',
	stats: { exhibitors: 0, products: 0, experiences: 0 },
	heroButton: { url: '#registration', title: '' },
	announcement: { to: '/seibu-fair', label: '', title: '', actionLabel: '' },
	posterAsset: DEFAULT_POSTER_ASSET,
	productAssets: [],
	exhibitors: [],
	experiences: [],
};
const EMPTY_EXPERIENCE = { id: '', name: '', label: '', time: '', sessions: [] };

const { locale, t } = useI18n();
const { data: seibuEvent } = await useFetch('/api/content/seibu-fair', {
	query: { lang: locale.value },
	key: `seibu-fair-${locale.value}`,
});

const emptySeibuEvent = computed(() => ({
	...EMPTY_SEIBU_EVENT,
	title: t('seibuFair.announcement.title'),
	announcement: {
		...EMPTY_SEIBU_EVENT.announcement,
		title: t('seibuFair.announcement.title'),
		actionLabel: t('seibuFair.announcement.actionLabel'),
	},
	posterAsset: {
		...DEFAULT_POSTER_ASSET,
		name: t('seibuFair.posterAlt'),
	},
}));
const event = computed(() => seibuEvent.value || emptySeibuEvent.value);
const selectedExperienceId = ref('');
const activeSession = ref(null);
const formError = ref('');
const reservationComplete = ref(false);
const reservationSubmitting = ref(false);
const reservationId = ref('');
const reservationPreview = ref(false);
const submittedReservation = ref(null);
const seatMap = ref({});
const registration = reactive({
	name: '',
	email: '',
	participants: 1,
});

watch(
	event,
	(nextEvent) => {
		const experiences = nextEvent.experiences || [];
		if (!experiences.some((experience) => experience.id === selectedExperienceId.value)) {
			selectedExperienceId.value = experiences[0]?.id || '';
		}
		seatMap.value = createSessionSeatMap(experiences);
	},
	{ immediate: true },
);

const posterAsset = computed(() => {
	const asset = event.value.posterAsset || DEFAULT_POSTER_ASSET;
	return {
		name: asset.name || t('seibuFair.posterAlt'),
		src: asset.src || DEFAULT_POSTER_ASSET.src,
	};
});
const heroButtonHref = computed(() => event.value.heroButton?.url || '#registration');
const heroButtonTitle = computed(
	() => event.value.heroButton?.title || t('seibuFair.actions.reserveSeat'),
);

const seibuStats = computed(() => [
	{ key: 'exhibitors', label: t('seibuFair.stats.companies') },
	{ key: 'products', label: t('seibuFair.stats.exhibits') },
	{ key: 'experiences', label: t('seibuFair.stats.handsOnEvents') },
]);

const selectedExperience = computed(
	() =>
		event.value.experiences.find((experience) => experience.id === selectedExperienceId.value) ||
		event.value.experiences[0] ||
		EMPTY_EXPERIENCE,
);

const pendingRemainingSeats = computed(() => {
	if (!activeSession.value) return 0;
	return remainingSeats(activeSession.value.id);
});

const reservationSessionLabel = computed(() => {
	if (!submittedReservation.value) return '';
	return [submittedReservation.value.sessionDate, submittedReservation.value.sessionTime]
		.filter(Boolean)
		.join(' ');
});

function exhibitorNumber(id) {
	const number = String(id || '').replace('exhibitor-', '');
	return number.padStart(2, '0');
}

function experienceTabLabel(experience) {
	const labels = {
		yukata: t('seibuFair.tabs.yukata'),
		origami: t('seibuFair.tabs.origami'),
		color: t('seibuFair.tabs.color'),
	};

	return labels[experience.id] || experience.name;
}

function scrollToRegistration() {
	const target = document.getElementById('registration');
	if (!target) return;

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	target.scrollIntoView({
		behavior: prefersReducedMotion ? 'auto' : 'smooth',
		block: 'start',
	});
}

function remainingSeats(sessionId) {
	return getRemainingSeats(seatMap.value, sessionId);
}

function bookedSeats(sessionId) {
	return getBookedSeats(seatMap.value, sessionId);
}

function seatPercent(sessionId) {
	return getSeatPercent(seatMap.value, sessionId);
}

function isSessionFull(sessionId) {
	return remainingSeats(sessionId) === 0;
}

function openReservation(experience, session) {
	selectedExperienceId.value = experience.id;
	activeSession.value = session;
	formError.value = '';
	reservationComplete.value = false;
	reservationId.value = '';
	reservationPreview.value = false;
	submittedReservation.value = null;
	registration.name = '';
	registration.email = '';
	registration.participants = 1;
}

function closeReservation() {
	activeSession.value = null;
	formError.value = '';
	reservationComplete.value = false;
	reservationId.value = '';
	reservationPreview.value = false;
	submittedReservation.value = null;
}

function applyAvailability(availability = {}) {
	const nextSeatMap = { ...seatMap.value };

	for (const [sessionId, seats] of Object.entries(availability)) {
		if (!nextSeatMap[sessionId]) continue;

		nextSeatMap[sessionId] = {
			booked: Number(seats.booked ?? nextSeatMap[sessionId].booked),
			capacity: Number(seats.capacity ?? nextSeatMap[sessionId].capacity),
		};
	}

	seatMap.value = nextSeatMap;
}

function resolveReservationError(error) {
	return (
		error?.data?.statusMessage ||
		error?.data?.message ||
		error?.statusMessage ||
		error?.message ||
		'Reservation could not be submitted. Please try again.'
	);
}

async function submitReservation() {
	if (!activeSession.value) return;
	if (reservationSubmitting.value) return;
	if (!isValidRegistration(registration, pendingRemainingSeats.value)) {
		formError.value = t('seibuFair.errors.registration');
		return;
	}

	reservationSubmitting.value = true;

	try {
		const response = await $fetch('/api/seibu-fair/reservations', {
			method: 'POST',
			body: {
				name: registration.name,
				email: registration.email,
				participants: registration.participants,
				experienceId: selectedExperience.value.id,
				sessionId: activeSession.value.id,
				locale: locale.value,
			},
		});

		if (response?.availability) {
			applyAvailability(response.availability);
		}

		reservationId.value = response?.reservationId || '';
		reservationPreview.value = Boolean(response?.preview);
		submittedReservation.value = response?.reservation || {
			name: String(registration.name || '').trim(),
			email: String(registration.email || '').trim(),
			participants: Number(registration.participants),
			experienceName: selectedExperience.value.name,
			sessionDate: activeSession.value.date,
			sessionTime: activeSession.value.time || selectedExperience.value.time,
		};
		reservationComplete.value = true;
		formError.value = '';
	} catch (error) {
		formError.value = resolveReservationError(error);
	} finally {
		reservationSubmitting.value = false;
	}
}

useSeoMeta({
	title: () => `${event.value.title} — ${event.value.subtitle} | Takumi International`,
	ogTitle: () => `${event.value.title} — ${event.value.subtitle}`,
	description: () => t('seibuFair.seo.description', { host: event.value.host }),
	ogDescription: () => t('seibuFair.seo.description', { host: event.value.host }),
	ogImage: () => posterAsset.value.src,
	twitterCard: 'summary_large_image',
});
</script>

<style scoped>
.seibu-page {
	padding-top: 4.15rem;
}

.seibu-poster {
	width: 100%;
	max-height: 48rem;
	object-fit: contain;
}

.seibu-stat-circle {
	aspect-ratio: 1 / 1;
	width: clamp(6rem, 24vw, 8.5rem);
	border-radius: 9999px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.15rem;
	background: #c81f32;
	color: #fff;
	box-shadow: 0 0.75rem 1.5rem rgb(200 31 50 / 18%);
	text-align: center;
}

.seibu-stat-circle strong {
	font-size: clamp(1.9rem, 7vw, 3rem);
	line-height: 1;
}

.seibu-stat-circle span {
	max-width: 6.25rem;
	font-size: clamp(0.72rem, 2.8vw, 0.9rem);
	font-weight: 700;
	line-height: 1.15;
}

.seibu-page :deep(.card),
.seibu-page :deep(.card-body),
.seibu-page :deep(.overflow-x-auto) {
	min-width: 0;
}

.seibu-page :deep(.btn),
.seibu-page :deep(.tab),
.seibu-page :deep(.card) {
	transition:
		transform 180ms ease,
		box-shadow 180ms ease,
		background-color 180ms ease,
		border-color 180ms ease,
		opacity 180ms ease;
}

.seibu-page :deep(.btn:hover:not(:disabled)),
.seibu-page :deep(.tab:hover) {
	transform: translateY(-1px);
}

.seibu-fade-enter-active,
.seibu-fade-leave-active {
	transition:
		opacity 180ms ease,
		transform 180ms ease;
}

.seibu-fade-enter-from,
.seibu-fade-leave-to {
	opacity: 0;
	transform: translateY(0.5rem);
}

.seibu-modal-enter-active,
.seibu-modal-leave-active {
	transition: opacity 180ms ease;
}

.seibu-modal-enter-active :deep(.modal-box),
.seibu-modal-leave-active :deep(.modal-box) {
	transition:
		opacity 180ms ease,
		transform 180ms ease;
}

.seibu-modal-enter-from,
.seibu-modal-leave-to {
	opacity: 0;
}

.seibu-modal-enter-from :deep(.modal-box),
.seibu-modal-leave-to :deep(.modal-box) {
	opacity: 0;
	transform: translateY(0.75rem) scale(0.98);
}

.seibu-card-grid,
.seibu-product-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 1rem;
}

.seibu-product-image {
	aspect-ratio: 4 / 3;
	width: 100%;
	object-fit: cover;
}

@media screen and (max-width: 991px) {
	.seibu-card-grid,
	.seibu-product-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media screen and (max-width: 767px) {
	.seibu-card-grid,
	.seibu-product-grid {
		grid-template-columns: 1fr;
	}
}

@media (prefers-reduced-motion: reduce) {
	.seibu-page :deep(.btn),
	.seibu-page :deep(.tab),
	.seibu-page :deep(.card),
	.seibu-fade-enter-active,
	.seibu-fade-leave-active,
	.seibu-modal-enter-active,
	.seibu-modal-leave-active,
	.seibu-modal-enter-active :deep(.modal-box),
	.seibu-modal-leave-active :deep(.modal-box) {
		transition: none;
	}

	.seibu-page :deep(.btn:hover:not(:disabled)),
	.seibu-page :deep(.tab:hover),
	.seibu-fade-enter-from,
	.seibu-fade-leave-to,
	.seibu-modal-enter-from :deep(.modal-box),
	.seibu-modal-leave-to :deep(.modal-box) {
		transform: none;
	}
}
</style>
