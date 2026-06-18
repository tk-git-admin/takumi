<template>
	<NuxtLink class="announcement-bar" :to="to" no-prefetch>
		<span v-if="label" class="announcement-bar__label">{{ label }}</span>
		<span class="announcement-bar__dot" aria-hidden="true"></span>
		<span class="announcement-bar__title">{{ title }}</span>
		<span v-if="actionLabel" class="announcement-bar__action">{{ actionLabel }}</span>
	</NuxtLink>
</template>

<script setup>
defineProps({
	to: {
		type: String,
		required: true,
	},
	label: {
		type: String,
		default: '',
	},
	title: {
		type: String,
		required: true,
	},
	actionLabel: {
		type: String,
		default: '',
	},
});
</script>

<style scoped>
.announcement-bar {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: clamp(0.55rem, 1.4vw, 1rem);
	min-height: 3rem;
	overflow: hidden;
	padding: 0.35rem var(--tk-space-gutter);
	border-bottom: 1px solid rgba(199, 154, 67, 0.38);
	background-color: var(--tk-color-paper);
	background-image: linear-gradient(
			90deg,
			transparent,
			rgb(var(--tk-color-event-red-rgb) / 8%),
			transparent
		),
		url('/img/takumi-washi-glass/pattern-washi.svg');
	background-position: center, center;
	background-repeat: no-repeat, repeat;
	background-size:
		auto,
		720px 720px;
	color: var(--tk-color-ink);
	font-size: clamp(0.86rem, 1vw, 1rem);
	text-decoration: none;
	backdrop-filter: blur(14px) saturate(140%);
	-webkit-backdrop-filter: blur(14px) saturate(140%);
	position: relative;
}

.announcement-bar::before {
	background: url('/img/takumi-washi-glass/pattern-asanoha.svg') left -2.6rem top -3rem / 8.25rem
		8.25rem repeat;
	content: '';
	inset: 0 auto 0 0;
	opacity: 0.46;
	pointer-events: none;
	position: absolute;
	width: min(17rem, 35vw);
	-webkit-mask-image: linear-gradient(90deg, #000 0%, rgba(0, 0, 0, 0.78) 42%, transparent 100%);
	mask-image: linear-gradient(90deg, #000 0%, rgba(0, 0, 0, 0.78) 42%, transparent 100%);
}

.announcement-bar::after {
	background: linear-gradient(
		90deg,
		transparent,
		rgb(var(--tk-color-event-red-rgb) / 80%) 22%,
		rgba(199, 154, 67, 0.9) 50%,
		transparent 82%
	);
	bottom: 0;
	content: '';
	height: 2px;
	left: 0;
	opacity: 0.75;
	position: absolute;
	right: 0;
}

.announcement-bar > * {
	position: relative;
	z-index: 1;
}

.announcement-bar__label {
	color: var(--tk-color-event-red);
	font-weight: 800;
	letter-spacing: 0;
	white-space: nowrap;
}

.announcement-bar__dot {
	background: var(--tk-color-event-gold);
	border-radius: 999px;
	box-shadow: 0 0 0 6px rgba(199, 154, 67, 0.12);
	height: 0.56rem;
	width: 0.56rem;
}

.announcement-bar__title {
	overflow: hidden;
	font-weight: 750;
	letter-spacing: 0;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.announcement-bar__action {
	color: var(--tk-color-brand-brown);
	font-size: 0.9em;
	font-weight: 800;
	text-decoration: underline;
	text-decoration-thickness: 1px;
	text-underline-offset: 0.18rem;
	white-space: nowrap;
}

@media (max-width: 767px) {
	.announcement-bar {
		gap: 0.5rem;
		justify-content: flex-start;
		min-height: 2.75rem;
		font-size: 0.78rem;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.announcement-bar::-webkit-scrollbar {
		display: none;
	}

	.announcement-bar__title {
		max-width: 9rem;
	}
}
</style>
