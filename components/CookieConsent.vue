<template>
	<section v-if="!hidden" class="cookie-consent" :aria-label="t('cookieConsent.label')">
		<div class="cookie-consent__body">
			<p class="cookie-consent__title">{{ t('cookieConsent.title') }}</p>
			<p class="cookie-consent__message">{{ t('cookieConsent.message') }}</p>
		</div>
		<div class="cookie-consent__actions">
			<button type="button" class="cookie-consent__button" @click="declineCookies">
				{{ t('cookieConsent.decline') }}
			</button>
			<button
				type="button"
				class="cookie-consent__button cookie-consent__button--primary"
				@click="acceptCookies">
				{{ t('cookieConsent.accept') }}
			</button>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { grantConsent, revokeConsent } = useConsentMode();
const STORAGE_KEY = 'cookie-consent';
const hidden = ref(true);

function acceptCookies() {
	localStorage.setItem(STORAGE_KEY, 'accepted');
	grantConsent();
	hidden.value = true;
}

function declineCookies() {
	localStorage.setItem(STORAGE_KEY, 'declined');
	revokeConsent();
	hidden.value = true;
}

onMounted(() => {
	const decision = localStorage.getItem(STORAGE_KEY);
	if (decision === 'accepted') grantConsent();
	hidden.value = decision !== null;
});
</script>

<style scoped>
.cookie-consent {
	align-items: center;
	background:
		linear-gradient(135deg, rgb(var(--tk-color-white-rgb) / 96%), rgb(251 251 248 / 98%)),
		url('/img/takumi-washi-glass/pattern-washi.svg') center / 520px 520px repeat;
	border: 1px solid rgb(var(--tk-color-brand-brown-rgb) / 18%);
	border-radius: 0.5rem;
	box-shadow: 0 1rem 3rem rgb(var(--tk-color-ink-rgb) / 18%);
	color: var(--tk-color-ink);
	display: grid;
	gap: 1rem;
	grid-template-columns: minmax(0, 1fr) auto;
	inset: auto var(--tk-space-gutter) var(--tk-space-gutter);
	margin-inline: auto;
	max-width: 58rem;
	padding: clamp(1rem, 2vw, 1.25rem);
	position: fixed;
	z-index: 80;
}

.cookie-consent__body {
	min-width: 0;
}

.cookie-consent__title {
	color: var(--tk-color-brand-brown);
	font-size: 0.9rem;
	font-weight: 800;
	letter-spacing: 0;
	line-height: 1.25;
	margin: 0 0 0.35rem;
}

.cookie-consent__message {
	color: var(--tk-color-muted);
	font-size: 0.92rem;
	line-height: 1.55;
	margin: 0;
	text-wrap: pretty;
}

.cookie-consent__actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.6rem;
	justify-content: flex-end;
}

.cookie-consent__button {
	align-items: center;
	background: var(--tk-color-white);
	border: 1px solid rgb(var(--tk-color-brand-brown-rgb) / 22%);
	border-radius: 0.45rem;
	color: var(--tk-color-brand-brown);
	cursor: pointer;
	display: inline-flex;
	font-size: 0.9rem;
	font-weight: 760;
	justify-content: center;
	letter-spacing: 0;
	line-height: 1.2;
	min-height: 2.5rem;
	padding: 0.68rem 1rem;
	transition:
		background 0.2s ease,
		border-color 0.2s ease,
		color 0.2s ease,
		transform 0.2s ease;
	white-space: nowrap;
}

.cookie-consent__button:hover {
	background: rgb(var(--tk-color-brand-brown-rgb) / 7%);
	border-color: rgb(var(--tk-color-brand-brown-rgb) / 34%);
	transform: translateY(-1px);
}

.cookie-consent__button:focus-visible {
	outline: 3px solid rgb(var(--tk-color-event-gold-rgb) / 72%);
	outline-offset: 3px;
}

.cookie-consent__button--primary {
	background: var(--tk-color-brand-brown);
	border-color: var(--tk-color-brand-brown);
	color: var(--tk-color-white);
}

.cookie-consent__button--primary:hover {
	background: var(--tk-color-ink);
	border-color: var(--tk-color-ink);
	color: var(--tk-color-white);
}

@media (max-width: 767px) {
	.cookie-consent {
		align-items: stretch;
		grid-template-columns: 1fr;
		inset: auto 1rem 1rem;
	}

	.cookie-consent__actions {
		justify-content: stretch;
	}

	.cookie-consent__button {
		flex: 1 1 10rem;
	}
}
</style>
