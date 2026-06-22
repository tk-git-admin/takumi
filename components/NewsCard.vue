<template>
	<NuxtLink :to="to" class="news-card" no-prefetch>
		<figure class="news-card__media">
			<img :src="thumbnailUrl" :alt="imageAlt" class="news-card__image" loading="lazy" />
		</figure>

		<div class="news-card__body">
			<div class="news-card__meta">
				<span v-if="category" class="news-card__category">{{ category }}</span>
				<span v-if="item.ymd" class="news-card__date">{{ item.ymd }}</span>
			</div>

			<h2 class="news-card__title">{{ headline }}</h2>
			<p v-if="intro" class="news-card__intro">{{ intro }}</p>
		</div>
	</NuxtLink>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		item: Record<string, any>;
		to: string;
		variant?: 'default' | 'list';
	}>(),
	{
		variant: 'default',
	},
);

const fallbackImage = '/img/takumi-ogp.png';

const category = computed(() => props.item?.news?.category || '');
const headline = computed(() => props.item?.news?.headline || '');
const intro = computed(() => props.item?.news?.intro || '');
const thumbnailUrl = computed(() => props.item?.thumbnail?.url || fallbackImage);
const imageAlt = computed(
	() => props.item?.thumbnail?.desc || props.item?.news?.headline || 'Takumi news',
);
</script>

<style scoped>
.news-card {
	position: relative;
	display: grid;
	grid-template-rows: auto 1fr;
	width: 100%;
	overflow: hidden;
	text-decoration: none;
	color: var(--tk-color-ink);
	background: var(--tk-color-paper);
	border: 1px solid rgb(var(--tk-color-brand-brown-rgb) / 12%);
	border-radius: 0.5rem;
	box-shadow: 0 1rem 2.25rem rgb(var(--tk-color-ink-rgb) / 8%);
	transition:
		transform 180ms ease,
		border-color 180ms ease,
		box-shadow 180ms ease;
}

.news-card:focus-visible {
	outline: 3px solid rgb(var(--tk-color-event-gold-rgb) / 70%);
	outline-offset: 4px;
}

.news-card:hover {
	transform: translateY(-2px);
	border-color: rgb(var(--tk-color-brand-brown-rgb) / 24%);
	box-shadow: 0 1.25rem 2.75rem rgb(var(--tk-color-ink-rgb) / 12%);
}

.news-card__media {
	position: relative;
	overflow: hidden;
	aspect-ratio: 16 / 10;
	background: linear-gradient(135deg, rgb(var(--tk-color-brand-brown-rgb) / 6%), transparent 42%),
		var(--tk-color-white);
}

.news-card__image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 260ms ease;
}

.news-card:hover .news-card__image {
	transform: scale(1.035);
}

.news-card__body {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: clamp(1rem, 4vw, 1.35rem);
}

.news-card__meta {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.5rem;
}

.news-card__category {
	width: fit-content;
	border: 1px solid rgb(var(--tk-color-brand-brown-rgb) / 16%);
	border-radius: 999px;
	padding: 0.25rem 0.65rem;
	background: rgb(var(--tk-color-brand-brown-rgb) / 7%);
	color: var(--tk-color-brand-brown);
	font-size: 0.78rem;
	font-weight: 700;
	line-height: 1;
}

.news-card__date {
	color: var(--tk-color-muted);
	font-size: 0.8rem;
	line-height: 1.2;
}

.news-card__title {
	margin: 0;
	color: var(--tk-color-sumi);
	font-size: clamp(1.18rem, 4.5vw, 1.45rem);
	font-weight: 800;
	line-height: 1.22;
	text-wrap: balance;
}

.news-card__intro {
	margin: 0;
	color: rgb(var(--tk-color-ink-rgb) / 76%);
	font-size: 0.98rem;
	line-height: 1.65;
}

@media (min-width: 1024px) {
	.news-card {
		height: 100%;
	}
}

@media (prefers-reduced-motion: reduce) {
	.news-card,
	.news-card__image {
		transition: none;
	}

	.news-card:hover,
	.news-card:hover .news-card__image {
		transform: none;
	}
}
</style>
