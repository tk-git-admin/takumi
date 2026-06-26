<template>
	<main class="seibu-page bg-base-100">
		<section class="py-12">
			<div class="w-container seibu-page-container">
				<div class="grid gap-8 lg:grid-cols-2 lg:items-start">
					<div class="flex flex-col gap-5">
						<p class="font-bold text-primary">{{ event.host }}</p>
						<div>
							<template v-if="heroLogo.src">
								<h1 class="sr-only">{{ heroLogo.name || event.title }}</h1>
								<img
									:src="heroLogoImage.src"
									:srcset="heroLogoImage.srcset"
									:sizes="heroLogoImage.sizes"
									:width="heroLogoImage.width"
									:alt="heroLogo.name || event.title"
									class="seibu-hero-logo"
									:loading="heroLogoImage.loading"
									:decoding="heroLogoImage.decoding" />
							</template>
							<template v-else>
								<h1 class="text-4xl font-bold text-primary md:text-5xl">
									{{ event.title }}
								</h1>
								<h2 class="mt-2 text-2xl font-bold text-secondary-500">
									{{ event.subtitle }}
								</h2>
							</template>
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
							<a
								:href="heroButtonHref"
								class="btn btn-primary"
								@click.prevent="scrollToRegistration">
								{{ heroButtonTitle }}
							</a>
						</div>
					</div>

					<figure class="card border border-base-200 bg-base-100">
						<div class="card-body p-3">
							<img
								:src="posterImage.src"
								:srcset="posterImage.srcset"
								:sizes="posterImage.sizes"
								:width="posterImage.width"
								:alt="posterAsset.name"
								class="seibu-poster rounded-box"
								:loading="posterImage.loading"
								:decoding="posterImage.decoding" />
						</div>
					</figure>
				</div>
			</div>
		</section>

		<section class="bg-neutral py-12">
			<div class="w-container seibu-page-container seibu-companies-container">
				<div class="mb-8">
					<h2 class="text-3xl font-bold text-primary">
						{{ event.companiesTitle || t('seibuFair.sections.companies') }}
					</h2>
				</div>

				<div class="seibu-card-grid">
					<article
						v-for="exhibitor in exhibitorsWithLogos"
						:key="exhibitor.id"
						class="card border border-base-200 bg-base-100 seibu-exhibitor-card">
						<div class="card-body seibu-exhibitor-body">
							<div class="seibu-exhibitor-logo-panel seibu-exhibitor-brand">
								<span v-if="exhibitor.logoSrc" class="seibu-exhibitor-logo-frame">
									<img
										:src="exhibitor.kurocoImage.src"
										:srcset="exhibitor.kurocoImage.srcset"
										:sizes="exhibitor.kurocoImage.sizes"
										:width="exhibitor.kurocoImage.width"
										:alt="exhibitor.logoAlt || exhibitor.name"
										class="seibu-exhibitor-logo"
										:loading="exhibitor.kurocoImage.loading"
										:decoding="exhibitor.kurocoImage.decoding" />
								</span>
								<span v-else class="seibu-exhibitor-initials" aria-hidden="true">
									{{ exhibitor.logoInitials }}
								</span>
							</div>
							<div class="seibu-exhibitor-divider" aria-hidden="true"></div>
							<div class="seibu-exhibitor-copy">
								<h3 class="card-title text-base seibu-exhibitor-title">
									{{ exhibitor.exhibitorTitleFallback }}
								</h3>
								<p v-if="exhibitor.description" class="leading-7 text-secondary-500">
									{{ exhibitor.description }}
								</p>
							</div>
						</div>
					</article>
				</div>
			</div>
		</section>

		<section v-if="productAssets.length" class="py-12">
			<div class="w-container seibu-page-container">
				<div class="mb-8">
					<h2 class="text-3xl font-bold text-primary">
						{{ event.featuredProductsTitle || t('seibuFair.sections.products') }}
					</h2>
				</div>

				<div class="seibu-product-grid">
					<article
						v-for="asset in productAssets"
						:key="asset.src || asset.name"
						class="card border border-base-200 bg-base-100">
						<figure v-if="asset.src" class="bg-neutral">
							<img
								:src="asset.kurocoImage.src"
								:srcset="asset.kurocoImage.srcset"
								:sizes="asset.kurocoImage.sizes"
								:width="asset.kurocoImage.width"
								:alt="asset.name"
								class="seibu-product-image"
								:loading="asset.kurocoImage.loading"
								:decoding="asset.kurocoImage.decoding" />
						</figure>
						<div class="card-body gap-2">
							<h3 class="card-title text-base">{{ asset.name }}</h3>
							<p v-if="asset.company" class="text-sm text-secondary-500">{{ asset.company }}</p>
						</div>
					</article>
				</div>
			</div>
		</section>

		<section id="registration" class="bg-neutral py-12 seibu-registration-section">
			<div class="w-container seibu-page-container seibu-registration-container">
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
					class="seibu-experience-tabs"
					role="group"
					:aria-label="t('seibuFair.accessibility.experienceType')">
					<button
						v-for="experience in event.experiences"
						:key="experience.id"
						type="button"
						class="seibu-experience-tab"
						:class="{ 'seibu-experience-tab--active': selectedExperienceId === experience.id }"
						:aria-pressed="selectedExperienceId === experience.id"
						@click="selectedExperienceId = experience.id">
						{{ experienceTabLabel(experience) }}
					</button>
				</div>

				<Transition name="seibu-fade" mode="out-in">
					<article
						v-if="selectedExperience.id"
						:key="selectedExperience.id"
						class="seibu-registration-panel border border-base-200 bg-base-100">
						<div class="seibu-registration-panel__header">
							<div class="seibu-registration-panel__copy">
								<h3 class="seibu-registration-title">{{ selectedExperience.name }}</h3>
								<p
									v-if="selectedExperience.description"
									class="seibu-registration-description text-secondary-500">
									{{ selectedExperience.description }}
								</p>
							</div>
							<span v-if="selectedExperience.time" class="seibu-time-chip">
								{{ selectedExperience.time }}
							</span>
						</div>

						<div class="seibu-session-list" role="list">
							<article
								v-for="session in orderedSessions.upcoming"
								:key="session.id"
								:ref="el => setSessionRef(el, session.id)"
								class="seibu-session-option"
								:class="{ 'seibu-session-option--full': isSessionFull(session.id) }"
								:style="{ '--seibu-session-fill': `${seatPercent(session.id)}%` }"
								role="listitem">
								<div class="seibu-session-main">
									<div class="seibu-session-date">{{ session.date }}</div>
									<div class="seibu-session-time">
										{{ sessionTimeLabel(session) }}
									</div>
								</div>
								<div class="seibu-session-availability">
									<div class="seibu-session-availability__labels">
										<span
											class="seibu-session-status"
											:class="{ 'seibu-session-status--full': isSessionFull(session.id) }">
											{{ sessionSeatStatus(session) }}
										</span>
										<span class="seibu-session-booked">
											{{ sessionBookedLabel(session) }}
										</span>
									</div>
									<div
										class="seibu-session-meter"
										role="progressbar"
										:aria-label="sessionAvailabilityLabel(session)"
										:aria-valuemin="0"
										:aria-valuemax="session.capacity"
										:aria-valuenow="bookedSeats(session.id)">
										<span class="seibu-session-meter__fill"></span>
									</div>
								</div>
								<button
									v-if="!isSessionFull(session.id)"
									type="button"
									class="btn seibu-session-reserve"
									:aria-label="reserveSessionLabel(session)"
									@click="openReservation(selectedExperience, session)">
									{{ t('seibuFair.actions.reserve') }}
								</button>
								<span v-else class="seibu-session-full" aria-disabled="true">
									{{ t('seibuFair.actions.full') }}
								</span>
							</article>

							<div
								v-if="orderedSessions.past.length"
								class="seibu-past-divider"
								role="separator">
								<span>{{ t('seibuFair.sections.pastSessions') }}</span>
							</div>

							<article
								v-for="session in orderedSessions.past"
								:key="session.id"
								class="seibu-session-option seibu-session-option--past"
								:style="{ '--seibu-session-fill': `${seatPercent(session.id)}%` }"
								role="listitem">
								<div class="seibu-session-main">
									<div class="seibu-session-date">{{ session.date }}</div>
									<div class="seibu-session-time">
										{{ sessionTimeLabel(session) }}
									</div>
								</div>
								<div class="seibu-session-availability">
									<div class="seibu-session-availability__labels">
										<span class="seibu-session-status">
											{{ sessionSeatStatus(session) }}
										</span>
										<span class="seibu-session-booked">
											{{ sessionBookedLabel(session) }}
										</span>
									</div>
									<div
										class="seibu-session-meter"
										role="progressbar"
										:aria-label="sessionAvailabilityLabel(session)"
										:aria-valuemin="0"
										:aria-valuemax="session.capacity"
										:aria-valuenow="bookedSeats(session.id)">
										<span class="seibu-session-meter__fill"></span>
									</div>
								</div>
								<span class="seibu-session-past" aria-disabled="true">
									{{ t('seibuFair.actions.past') }}
								</span>
							</article>
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

						<button
							type="submit"
							class="btn w-full"
							:class="{
								'btn-primary': cooldownSeconds === 0,
								'seibu-btn-submitting-state': reservationSubmitting,
								'seibu-btn-cooldown': cooldownSeconds > 0,
							}"
							:disabled="reservationSubmitting || cooldownSeconds > 0"
							:aria-busy="reservationSubmitting">
							<Icon
								:name="reservationSubmitting ? 'mdi:loading' : cooldownSeconds > 0 ? 'mdi:clock-outline' : 'mdi:send'"
								:class="{ 'seibu-spin': reservationSubmitting }" />
							{{
								reservationSubmitting
									? t('seibuFair.actions.submitting')
									: cooldownSeconds > 0
										? t('seibuFair.actions.retryIn', { seconds: cooldownSeconds })
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
import { computed, nextTick, onUnmounted, reactive, ref, watch } from 'vue';
import {
	createSessionSeatMap,
	getBookedSeats,
	getRemainingSeats,
	getSeatPercent,
	isValidRegistration,
} from '~/utils/seibuReservation.mjs';
import { resolveSeibuExhibitorInitials } from '~/utils/seibuExhibitorPresentation.mjs';
import { getKurocoImagePreset } from '~/utils/kurocoImage.mjs';

const DEFAULT_POSTER_ASSET = {
	name: '',
	src: '/img/seibu-fair/seibu-panora-june-final.jpeg',
};
const DEFAULT_HERO_LOGO = {
	name: '',
	src: '',
};
const SEIBU_SOCIAL_IMAGE = '/img/seibu-fair/seibu-social-preview.jpg';
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
	heroLogo: DEFAULT_HERO_LOGO,
	posterAsset: DEFAULT_POSTER_ASSET,
	productAssets: [],
	exhibitors: [],
	experiences: [],
};
const EMPTY_EXPERIENCE = { id: '', name: '', label: '', time: '', sessions: [] };
const EXHIBITOR_DISPLAY_NAMES_BY_ID = {
	'exhibitor-1': 'Takumi International',
	'exhibitor-2': 'UWAKAI PEARL',
	'exhibitor-3': 'Yoshimune Knives',
	'exhibitor-4': 'FITOKIO (TAC & IDCJ Wellness Sdn Bhd)',
	'exhibitor-5': 'You&Me',
	'exhibitor-6': 'SUI-RYU',
	'exhibitor-7': 'Wawawa',
	'exhibitor-8': 'QLOGO',
	'exhibitor-9': 'LITA',
	'exhibitor-10': 'JAPONISM',
	'exhibitor-11': 'Creo Co., Ltd.',
	'exhibitor-12': 'ezu',
	'exhibitor-13': 'Fukushin Co., Ltd.',
	'exhibitor-14': "Taylor's University",
};

const { locale, t } = useI18n();
const { data: seibuEvent } = await useFetch('/api/content/seibu-fair', {
	key: 'seibu-fair',
	query: computed(() => ({ lang: locale.value })),
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
const sessionRefs = ref({});
const formError = ref('');
const reservationComplete = ref(false);
const reservationSubmitting = ref(false);
const cooldownSeconds = ref(0);
let cooldownTimer = null;

function startCooldown(seconds = 15) {
	cooldownSeconds.value = seconds;
	cooldownTimer = setInterval(() => {
		cooldownSeconds.value--;
		if (cooldownSeconds.value <= 0) {
			clearInterval(cooldownTimer);
			cooldownTimer = null;
		}
	}, 1000);
}

onUnmounted(() => {
	if (cooldownTimer) clearInterval(cooldownTimer);
});
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
const heroLogo = computed(() => {
	const asset = event.value.heroLogo || DEFAULT_HERO_LOGO;
	return {
		name: asset.name || event.value.title,
		src: asset.src || DEFAULT_HERO_LOGO.src,
	};
});
const posterImage = computed(() => getKurocoImagePreset(posterAsset.value.src, 'seibuPoster'));
const heroLogoImage = computed(() => getKurocoImagePreset(heroLogo.value.src, 'seibuLogo'));
const heroButtonHref = computed(() => event.value.heroButton?.url || '#registration');
const heroButtonTitle = computed(
	() => event.value.heroButton?.title || t('seibuFair.actions.reserveSeat'),
);
const productAssets = computed(() =>
	(event.value.productAssets || []).map((asset) => ({
		...asset,
		kurocoImage: getKurocoImagePreset(asset.src, 'seibuProduct'),
	})),
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

const orderedSessions = computed(() => {
	const sessions = selectedExperience.value.sessions || [];
	const upcoming = sessions.filter((s) => !isSessionPast(s));
	const past = sessions.filter((s) => isSessionPast(s));
	return { upcoming, past };
});

watch(selectedExperience, () => {
	sessionRefs.value = {};
	nextTick(scrollToNextSession);
});

const exhibitorsWithLogos = computed(() =>
	(event.value.exhibitors || []).map((exhibitor) => {
		const logoSrc = resolveExhibitorLogo(exhibitor);
		const displayName = resolveExhibitorDisplayName(exhibitor);

		return {
			...exhibitor,
			logoSrc,
			logoAlt: asString(exhibitor.logoName) || displayName,
			kurocoImage: getKurocoImagePreset(logoSrc, 'seibuExhibitorLogo'),
			logoInitials: resolveSeibuExhibitorInitials(displayName),
			exhibitorTitleFallback: displayName,
		};
	}),
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

function experienceTabLabel(experience) {
	const labels = {
		yukata: t('seibuFair.tabs.yukata'),
		origami: t('seibuFair.tabs.origami'),
		color: t('seibuFair.tabs.color'),
	};

	return labels[experience.id] || experience.name;
}

function asString(value) {
	if (typeof value === 'string') return value.trim();
	if (typeof value === 'number') return String(value);
	return '';
}

function resolveExhibitorDisplayName(exhibitor) {
	return (
		EXHIBITOR_DISPLAY_NAMES_BY_ID[String(exhibitor?.id || '')] ||
		String(exhibitor?.name || '').trim()
	);
}

function resolveExhibitorLogo(exhibitor) {
	return asString(exhibitor?.logoSrc);
}

function isSessionPast(session) {
	const match = String(session.id || '').match(/(\d{4}-\d{2}-\d{2})$/);
	if (!match) return false;
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return new Date(match[1]) < today;
}

function setSessionRef(el, sessionId) {
	if (el) sessionRefs.value[sessionId] = el;
}

function scrollToNextSession() {
	const firstUpcoming = orderedSessions.value.upcoming[0];
	const target = firstUpcoming
		? sessionRefs.value[firstUpcoming.id]
		: Object.values(sessionRefs.value)[0];
	if (target) {
		target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	}
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

function sessionTimeLabel(session) {
	return session.time || selectedExperience.value.time;
}

function sessionBookedLabel(session) {
	return t('seibuFair.table.seatsBooked', {
		booked: bookedSeats(session.id),
		capacity: session.capacity,
	});
}

function sessionSeatStatus(session) {
	if (isSessionFull(session.id)) return t('seibuFair.actions.full');

	return t('seibuFair.reservation.remainingSeats', {
		count: remainingSeats(session.id),
	});
}

function sessionAvailabilityLabel(session) {
	return [sessionSeatStatus(session), sessionBookedLabel(session)].filter(Boolean).join(' ');
}

function reserveSessionLabel(session) {
	return [t('seibuFair.actions.reserve'), session.date, sessionTimeLabel(session)]
		.filter(Boolean)
		.join(' ');
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
	const status = error?.status || error?.statusCode || error?.data?.statusCode;
	if (status === 429) {
		startCooldown(15);
		return t('seibuFair.errors.tooManyRequests');
	}
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
	ogImage: SEIBU_SOCIAL_IMAGE,
	ogImageWidth: '1200',
	ogImageHeight: '630',
	twitterCard: 'summary_large_image',
	twitterImage: SEIBU_SOCIAL_IMAGE,
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

.seibu-hero-logo {
	display: block;
	width: min(100%, 28rem);
	height: auto;
}

.seibu-page-container {
	width: min(calc(100% - 2rem), 1280px);
	max-width: 1280px;
	min-width: 0;
}

.seibu-registration-container {
	width: min(calc(100% - 2rem), 1280px);
	max-width: 1280px;
	min-width: 0;
}

.seibu-registration-section {
	position: relative;
	scroll-margin-top: 5.5rem;
	background: linear-gradient(
			135deg,
			rgb(var(--tk-color-brand-brown-rgb) / 5%) 0 1px,
			transparent 1px 16px
		),
		linear-gradient(180deg, #fbfaf7 0%, #f3f5f1 100%);
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
	background: var(--tk-color-event-red);
	color: var(--tk-color-white);
	box-shadow: 0 0.75rem 1.5rem rgb(var(--tk-color-event-red-rgb) / 18%);
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

.seibu-experience-tabs {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(8.75rem, 100%), 1fr));
	width: 100%;
	max-width: 100%;
	gap: 0.45rem;
	margin-bottom: clamp(1rem, 2.2vw, 1.5rem);
	padding: 0.35rem;
	border: 1px solid rgb(var(--tk-color-ink-rgb) / 8%);
	border-radius: 0.5rem;
	background: rgb(var(--tk-color-white-rgb) / 74%);
	box-shadow: inset 0 1px 0 rgb(var(--tk-color-white-rgb) / 82%);
}

.seibu-experience-tab {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 0;
	min-height: 2.85rem;
	padding: 0.65rem 0.9rem;
	border: 1px solid transparent;
	border-radius: 0.42rem;
	background: transparent;
	color: var(--tk-color-ink);
	font-weight: 800;
	line-height: 1.25;
	text-align: center;
	text-wrap: balance;
	cursor: pointer;
	transition:
		transform 180ms ease,
		box-shadow 180ms ease,
		background-color 180ms ease,
		border-color 180ms ease,
		color 180ms ease;
}

.seibu-experience-tab--active {
	border-color: rgb(var(--tk-color-brand-brown-rgb) / 86%);
	background: var(--tk-color-brand-brown);
	color: var(--tk-color-white);
	box-shadow: 0 0.7rem 1.25rem rgb(var(--tk-color-brand-brown-rgb) / 18%);
}

.seibu-experience-tab:focus-visible,
.seibu-session-reserve:focus-visible {
	outline: 3px solid rgb(var(--tk-color-event-gold-rgb) / 72%);
	outline-offset: 3px;
}

@media (hover: hover) {
	.seibu-experience-tab:hover {
		border-color: rgb(var(--tk-color-brand-brown-rgb) / 28%);
		background: rgb(var(--tk-color-brand-brown-rgb) / 6%);
		transform: translateY(-1px);
	}

	.seibu-experience-tab--active:hover {
		background: var(--tk-color-brand-brown);
		color: var(--tk-color-white);
	}
}

.seibu-registration-panel {
	overflow: hidden;
	padding: clamp(1.25rem, 3vw, 2rem);
	border-radius: 0.5rem;
	background: linear-gradient(
			180deg,
			rgb(var(--tk-color-white-rgb) / 96%),
			rgb(var(--tk-color-white-rgb) / 91%)
		),
		var(--tk-color-white);
	box-shadow: 0 1.25rem 3rem rgb(var(--tk-color-ink-rgb) / 7%);
}

.seibu-registration-panel__header {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: start;
	gap: clamp(1rem, 2vw, 1.5rem);
}

.seibu-registration-panel__copy {
	min-width: 0;
}

.seibu-registration-title {
	margin: 0;
	color: var(--tk-color-sumi);
	font-size: clamp(1.35rem, 2vw, 1.9rem);
	font-weight: 800;
	line-height: 1.2;
}

.seibu-registration-description {
	max-width: 54rem;
	margin-top: 0.95rem;
	font-size: clamp(1rem, 1.25vw, 1.12rem);
	line-height: 1.75;
}

.seibu-time-chip {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 2.25rem;
	padding: 0 0.95rem;
	border: 1px solid rgb(var(--tk-color-ink-rgb) / 18%);
	border-radius: 9999px;
	background: rgb(var(--tk-color-brand-brown-rgb) / 5%);
	color: var(--tk-color-sumi);
	font-size: 0.95rem;
	font-weight: 700;
	line-height: 1;
	white-space: nowrap;
}

.seibu-session-list {
	display: grid;
	gap: clamp(0.75rem, 1.6vw, 1rem);
	margin-top: clamp(1.4rem, 2.6vw, 2rem);
}

.seibu-session-option {
	--seibu-session-accent: var(--tk-color-brand-brown);
	position: relative;
	display: grid;
	grid-template-columns: minmax(9rem, 0.78fr) minmax(13rem, 1fr) auto;
	align-items: center;
	gap: clamp(1rem, 2.2vw, 1.5rem);
	padding: clamp(1rem, 2vw, 1.2rem) clamp(1rem, 2.2vw, 1.35rem);
	border: 1px solid rgb(var(--tk-color-ink-rgb) / 10%);
	border-radius: 0.5rem;
	background: linear-gradient(90deg, rgb(var(--tk-color-brand-brown-rgb) / 4%), transparent 44%),
		rgb(var(--tk-color-white-rgb) / 86%);
	box-shadow: 0 0.55rem 1.3rem rgb(var(--tk-color-ink-rgb) / 4%);
	transition:
		transform 180ms ease,
		box-shadow 180ms ease,
		border-color 180ms ease,
		background-color 180ms ease;
}

.seibu-session-option::before {
	position: absolute;
	inset-block: 0.85rem;
	inset-inline-start: 0;
	width: 0.2rem;
	border-radius: 999px;
	background: var(--seibu-session-accent);
	content: '';
}

.seibu-session-option--full {
	--seibu-session-accent: var(--tk-color-muted);
	background: rgb(var(--tk-color-ink-rgb) / 2.5%);
}

.seibu-session-option--past {
	--seibu-session-accent: var(--tk-color-muted);
	opacity: 0.45;
	pointer-events: none;
}

.seibu-past-divider {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin-block: 0.25rem;
	color: var(--tk-color-muted);
	font-size: 0.8rem;
	font-weight: 700;
	letter-spacing: 0.06em;
	text-transform: uppercase;
}

.seibu-past-divider::before,
.seibu-past-divider::after {
	flex: 1;
	height: 1px;
	background: rgb(var(--tk-color-ink-rgb) / 10%);
	content: '';
}

@media (hover: hover) {
	.seibu-session-option:hover {
		border-color: rgb(var(--tk-color-brand-brown-rgb) / 24%);
		box-shadow: 0 1rem 2rem rgb(var(--tk-color-ink-rgb) / 7%);
		transform: translateY(-1px);
	}
}

.seibu-session-main,
.seibu-session-availability {
	min-width: 0;
}

.seibu-session-date {
	color: var(--tk-color-sumi);
	font-weight: 800;
	line-height: 1.35;
}

.seibu-session-time {
	margin-top: 0.25rem;
	color: var(--tk-color-muted);
	font-size: 0.95rem;
	font-weight: 600;
	line-height: 1.45;
}

.seibu-session-availability {
	display: grid;
	gap: 0.65rem;
}

.seibu-session-availability__labels {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
}

.seibu-session-status {
	display: inline-flex;
	align-items: center;
	min-height: 1.65rem;
	padding: 0.2rem 0.6rem;
	border: 1px solid rgb(var(--tk-color-brand-brown-rgb) / 18%);
	border-radius: 999px;
	background: rgb(var(--tk-color-brand-brown-rgb) / 8%);
	color: var(--tk-color-brand-brown);
	font-size: 0.78rem;
	font-weight: 900;
	line-height: 1;
	white-space: nowrap;
}

.seibu-session-status--full {
	border-color: rgb(var(--tk-color-ink-rgb) / 16%);
	background: var(--tk-color-sumi);
	color: var(--tk-color-white);
}

.seibu-session-booked {
	color: var(--tk-color-ink);
	font-size: 0.9rem;
	font-weight: 700;
	line-height: 1.3;
	text-align: end;
}

.seibu-session-meter {
	position: relative;
	overflow: hidden;
	width: 100%;
	height: 0.65rem;
	border-radius: 999px;
	background: rgb(var(--tk-color-ink-rgb) / 14%);
}

.seibu-session-meter__fill {
	position: absolute;
	inset-block: 0;
	inset-inline-start: 0;
	width: var(--seibu-session-fill, 0%);
	border-radius: inherit;
	background: var(--seibu-session-accent);
	transition: width 260ms ease;
}

.seibu-session-reserve {
	min-height: 2.75rem;
	min-width: 7.1rem;
	border: 1px solid rgb(var(--tk-color-brand-brown-rgb) / 86%);
	border-radius: 0.42rem;
	background: var(--tk-color-brand-brown);
	color: var(--tk-color-white);
	font-weight: 900;
	justify-self: end;
	white-space: nowrap;
	box-shadow: 0 0.65rem 1.25rem rgb(var(--tk-color-brand-brown-rgb) / 18%);
}

.seibu-session-reserve:hover {
	border-color: var(--tk-color-sumi);
	background: var(--tk-color-sumi);
	color: var(--tk-color-white);
}

.seibu-session-full,
.seibu-session-past {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 2.75rem;
	min-width: 7.1rem;
	padding: 0 1rem;
	border: 1px solid rgb(var(--tk-color-ink-rgb) / 18%);
	border-radius: 0.42rem;
	background: var(--tk-color-sumi);
	color: var(--tk-color-white);
	font-weight: 900;
	justify-self: end;
	line-height: 1;
	white-space: nowrap;
}

@keyframes seibu-spin {
	to { transform: rotate(360deg); }
}

.seibu-spin {
	animation: seibu-spin 0.75s linear infinite;
}

.seibu-btn-submitting-state {
	opacity: 0.75;
}

.seibu-btn-cooldown {
	border: 2px solid rgb(var(--tk-color-brand-brown-rgb) / 40%);
	background: transparent;
	color: var(--tk-color-muted);
	cursor: not-allowed;
	font-variant-numeric: tabular-nums;
}

.seibu-page :deep(.btn),
.seibu-page :deep(.card) {
	transition:
		transform 180ms ease,
		box-shadow 180ms ease,
		background-color 180ms ease,
		border-color 180ms ease,
		opacity 180ms ease;
}

.seibu-page :deep(.btn:hover:not(:disabled)) {
	transform: translateY(-1px);
}

.seibu-exhibitor-card {
	overflow: hidden;
	border-radius: 0.5rem;
	box-shadow: 0 1rem 2.25rem rgb(var(--tk-color-ink-rgb) / 5%);
}

.seibu-exhibitor-card:hover {
	border-color: rgb(var(--tk-color-brand-brown-rgb) / 22%);
	box-shadow: 0 1.35rem 2.75rem rgb(var(--tk-color-ink-rgb) / 8%);
}

.seibu-exhibitor-body {
	min-height: 25.25rem;
	padding: clamp(1.45rem, 2vw, 1.9rem);
}

.seibu-exhibitor-logo-panel {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	min-height: 7.4rem;
	padding: 1rem 1.2rem;
	border: 1px solid rgb(var(--tk-color-ink-rgb) / 10%);
	border-radius: 0.5rem;
	background: rgb(var(--tk-color-ink-rgb) / 1.5%);
}

.seibu-exhibitor-logo-frame {
	display: flex;
	align-items: center;
	justify-content: center;
	width: min(15rem, 100%);
	min-height: 4.1rem;
}

.seibu-exhibitor-logo {
	display: block;
	width: auto;
	max-width: 100%;
	max-height: 4.35rem;
	object-fit: contain;
	object-position: center;
}

.seibu-exhibitor-initials {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 4.5rem;
	height: 3.25rem;
	padding: 0 0.95rem;
	border: 1px solid rgb(var(--tk-color-brand-brown-rgb) / 22%);
	border-radius: 0.375rem;
	background: rgb(var(--tk-color-brand-brown-rgb) / 6%);
	color: var(--tk-color-brand-brown);
	font-size: clamp(1.15rem, 1.7vw, 1.45rem);
	font-weight: 800;
	letter-spacing: 0;
	line-height: 1;
}

.seibu-exhibitor-divider {
	width: 100%;
	height: 1px;
	margin: clamp(1.45rem, 2vw, 1.9rem) 0 1.35rem;
	background: rgb(var(--tk-color-brand-brown-rgb) / 12%);
}

.seibu-exhibitor-copy {
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 0.85rem;
}

.seibu-exhibitor-title {
	margin: 0;
	color: var(--tk-color-sumi);
	font-size: clamp(1rem, 1.35vw, 1.2rem);
	line-height: 1.35;
}

.seibu-exhibitor-copy p {
	font-size: clamp(0.94rem, 1.15vw, 1.04rem);
	line-height: 1.75;
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

.seibu-card-grid {
	gap: clamp(1.25rem, 2vw, 1.75rem);
	align-items: stretch;
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
	.seibu-registration-panel__header,
	.seibu-session-option {
		grid-template-columns: 1fr;
	}

	.seibu-time-chip {
		justify-self: start;
	}

	.seibu-session-reserve,
	.seibu-session-full {
		width: 100%;
		justify-self: stretch;
	}

	.seibu-exhibitor-body {
		min-height: 22rem;
	}

	.seibu-card-grid,
	.seibu-product-grid {
		grid-template-columns: 1fr;
	}
}

@media screen and (max-width: 420px) {
	.seibu-session-availability__labels {
		align-items: flex-start;
		flex-direction: column;
		gap: 0.45rem;
	}

	.seibu-session-booked {
		text-align: start;
	}
}

@media (prefers-reduced-motion: reduce) {
	.seibu-page :deep(.btn),
	.seibu-page :deep(.card),
	.seibu-experience-tab,
	.seibu-session-option,
	.seibu-session-meter__fill,
	.seibu-fade-enter-active,
	.seibu-fade-leave-active,
	.seibu-modal-enter-active,
	.seibu-modal-leave-active,
	.seibu-modal-enter-active :deep(.modal-box),
	.seibu-modal-leave-active :deep(.modal-box) {
		transition: none;
	}

	.seibu-page :deep(.btn:hover:not(:disabled)),
	.seibu-experience-tab:hover,
	.seibu-session-option:hover,
	.seibu-fade-enter-from,
	.seibu-fade-leave-to,
	.seibu-modal-enter-from :deep(.modal-box),
	.seibu-modal-leave-to :deep(.modal-box) {
		transform: none;
	}
}
</style>
