<template>
	<main class="seibu-page bg-base-100">
		<section class="py-12">
			<div class="w-container">
				<div class="grid gap-8 lg:grid-cols-2 lg:items-start">
					<div class="flex flex-col gap-5">
						<p class="font-bold text-primary">{{ event.host }}</p>
						<div>
							<template v-if="heroLogo.src">
								<h1 class="sr-only">{{ heroLogo.name || event.title }}</h1>
								<img
									:src="heroLogo.src"
									:alt="heroLogo.name || event.title"
									class="seibu-hero-logo" />
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
								:src="posterAsset.src"
								:alt="posterAsset.name"
								class="seibu-poster rounded-box" />
						</div>
					</figure>
				</div>
			</div>
		</section>

		<section class="bg-neutral py-12">
			<div class="w-container seibu-companies-container">
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
										:src="exhibitor.logoSrc"
										:alt="exhibitor.logoAlt || exhibitor.name"
										class="seibu-exhibitor-logo"
										loading="lazy" />
								</span>
								<span v-else class="seibu-exhibitor-wordmark">
									<strong>{{ exhibitor.fallbackLogoTitle }}</strong>
									<small v-if="exhibitor.fallbackLogoSubtitle">
										{{ exhibitor.fallbackLogoSubtitle }}
									</small>
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
const DEFAULT_HERO_LOGO = {
	name: '',
	src: '',
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
	heroLogo: DEFAULT_HERO_LOGO,
	posterAsset: DEFAULT_POSTER_ASSET,
	productAssets: [],
	exhibitors: [],
	experiences: [],
};
const EMPTY_EXPERIENCE = { id: '', name: '', label: '', time: '', sessions: [] };
const EXHIBITOR_LOGOS_BY_ID = {
	'exhibitor-1': '/img/seibu-fair/logos/takumi.png',
	'exhibitor-2': '/img/seibu-fair/logos/uwakai.png',
	'exhibitor-3': '/img/seibu-fair/logos/yoshimune.png',
	'exhibitor-4': '/img/seibu-fair/logos/fitokio.png',
	'exhibitor-5': '/img/seibu-fair/logos/youme.png',
	'exhibitor-6': '/img/seibu-fair/logos/sui-ryu.png',
	'exhibitor-7': '/img/seibu-fair/logos/wawawa.png',
	'exhibitor-8': '/img/seibu-fair/logos/qlogo.png',
	'exhibitor-9': '/img/seibu-fair/logos/lita.png',
	'exhibitor-10': '/img/seibu-fair/logos/japonism.png',
	'exhibitor-11': '/img/seibu-fair/logos/creo.png',
	'exhibitor-12': '/img/seibu-fair/logos/ezu.png',
	'exhibitor-13': '/img/seibu-fair/logos/fukushin.png',
	'exhibitor-14': '/img/seibu-fair/logos/taylor.png',
};
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
const EXHIBITOR_WORDMARKS_BY_ID = {
	'exhibitor-4': {
		title: 'FITOKIO',
		subtitle: 'TAC & IDCJ Wellness Sdn Bhd',
	},
};
const EXHIBITOR_LOGO_ALIASES = [
	{
		src: '/img/seibu-fair/logos/takumi.png',
		names: ['takumi international', 'タクミインターナショナル'],
	},
	{
		src: '/img/seibu-fair/logos/uwakai.png',
		names: ['uwakai', 'uwajima', '宇和海真珠'],
	},
	{
		src: '/img/seibu-fair/logos/yoshimune.png',
		names: ['yoshimune', 'yoshimune knives', '由宗刃物'],
	},
	{
		src: '/img/seibu-fair/logos/fitokio.png',
		names: ['fitokio', 'tac & idcj', 'wellness'],
	},
	{
		src: '/img/seibu-fair/logos/youme.png',
		names: ['you&me', 'you & me', 'youandme', 'ユーアンドミー'],
	},
	{
		src: '/img/seibu-fair/logos/sui-ryu.png',
		names: ['sui-ryu', 'suiryu', 'sui ryu', 'スイリュウ'],
	},
	{
		src: '/img/seibu-fair/logos/wawawa.png',
		names: ['wawawa', '和輪笑'],
	},
	{
		src: '/img/seibu-fair/logos/qlogo.png',
		names: ['qlogo', 'クロゴ'],
	},
	{
		src: '/img/seibu-fair/logos/lita.png',
		names: ['lita', '株式会社lita'],
	},
	{
		src: '/img/seibu-fair/logos/japonism.png',
		names: ['japonism', '株式会社japonism'],
	},
	{
		src: '/img/seibu-fair/logos/creo.png',
		names: ['creo', 'クレオ'],
	},
	{
		src: '/img/seibu-fair/logos/ezu.png',
		names: ['ezu', '株式会社ezu'],
	},
	{
		src: '/img/seibu-fair/logos/fukushin.png',
		names: ['fukushin', 'フクシン'],
	},
	{
		src: '/img/seibu-fair/logos/taylor.png',
		names: ['taylor', 'テイラーズ大学'],
	},
];

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
const heroLogo = computed(() => {
	const asset = event.value.heroLogo || DEFAULT_HERO_LOGO;
	return {
		name: asset.name || event.value.title,
		src: asset.src || DEFAULT_HERO_LOGO.src,
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
const exhibitorsWithLogos = computed(() =>
	(event.value.exhibitors || []).map((exhibitor) => {
		const logoSrc = resolveExhibitorLogo(exhibitor);
		const displayName = resolveExhibitorDisplayName(exhibitor);
		const fallbackLogo = resolveExhibitorWordmark(exhibitor, displayName);

		return {
			...exhibitor,
			logoSrc,
			logoAlt: asString(exhibitor.logoName) || displayName,
			fallbackLogoTitle: fallbackLogo.title,
			fallbackLogoSubtitle: fallbackLogo.subtitle,
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

function normalizeExhibitorName(value) {
	return String(value || '')
		.trim()
		.toLowerCase()
		.replace(/\s+/g, ' ');
}

function resolveExhibitorDisplayName(exhibitor) {
	return (
		EXHIBITOR_DISPLAY_NAMES_BY_ID[String(exhibitor?.id || '')] ||
		String(exhibitor?.name || '').trim()
	);
}

function splitParentheticalSubtitle(value) {
	const match = String(value || '').match(/^(.+?)\s*\((.+)\)$/);
	if (!match) {
		return {
			title: String(value || '').trim(),
			subtitle: '',
		};
	}

	return {
		title: match[1].trim(),
		subtitle: match[2].trim(),
	};
}

function resolveExhibitorWordmark(exhibitor, displayName) {
	const wordmark = EXHIBITOR_WORDMARKS_BY_ID[String(exhibitor?.id || '')];
	if (wordmark) return wordmark;

	return splitParentheticalSubtitle(displayName);
}

function resolveExhibitorLogo(exhibitor) {
	const cmsLogo = asString(exhibitor?.logoSrc);
	if (cmsLogo) return cmsLogo;

	const logoById = EXHIBITOR_LOGOS_BY_ID[String(exhibitor?.id || '')];
	if (logoById) return logoById;

	const name = normalizeExhibitorName(exhibitor?.name);
	const match = EXHIBITOR_LOGO_ALIASES.find((logo) =>
		logo.names.some((alias) => name.includes(normalizeExhibitorName(alias))),
	);

	return match?.src || '';
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

.seibu-hero-logo {
	display: block;
	width: min(100%, 28rem);
	height: auto;
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

.seibu-companies-container {
	width: min(calc(100% - 6rem), 1538px);
	max-width: 1538px;
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

.seibu-exhibitor-wordmark {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.25rem;
	text-align: center;
	color: var(--tk-color-sumi);
}

.seibu-exhibitor-wordmark strong {
	font-size: clamp(1.5rem, 2vw, 1.9rem);
	line-height: 1.05;
}

.seibu-exhibitor-wordmark small {
	max-width: 14rem;
	font-size: 0.86rem;
	font-weight: 600;
	line-height: 1.25;
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
	.seibu-companies-container {
		width: min(calc(100% - 2rem), 480px);
	}

	.seibu-exhibitor-body {
		min-height: 22rem;
	}

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
