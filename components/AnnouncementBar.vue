<template>
	<NuxtLink class="announcement-bar" :to="to" no-prefetch>
		<span v-if="label" class="announcement-bar__label">{{ label }}</span>
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
	gap: 0.65rem;
	min-height: 2.35rem;
	padding: 0.35rem var(--tk-space-gutter);
	border-bottom: 1px solid rgba(181, 35, 34, 0.28);
	background: var(--tk-color-paper);
	color: var(--tk-color-ink);
	font-size: 0.86rem;
	text-decoration: none;
}

.announcement-bar__label {
	color: var(--tk-color-event-red);
	font-weight: 800;
	white-space: nowrap;
}

.announcement-bar__title {
	overflow: hidden;
	font-weight: 700;
	letter-spacing: 0;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.announcement-bar__action {
	color: var(--tk-color-brand-brown);
	font-size: 0.78rem;
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
		min-height: 2.2rem;
		font-size: 0.78rem;
	}

	.announcement-bar__action {
		font-size: 0.72rem;
	}
}
</style>
