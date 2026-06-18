# Consistent News Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace duplicated old news-card markup with one modern, mobile-optimized card component used by both the homepage and news-list page.

**Architecture:** Create `components/NewsCard.vue` as the single presentation boundary for news summaries. Keep page files responsible only for layout and route generation, while the component owns image fallback, typography, spacing, and tokenized visual styling.

**Tech Stack:** Nuxt 3, Vue 3 single-file components, Tailwind utility layout, scoped CSS using existing Takumi design tokens, Node test runner.

---

### Task 1: Add Consistency Regression Test

**Files:**

- Create: `tests/newsCards.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('news cards share one tokenized mobile-optimized component', async () => {
	const homeSource = await readFile(new URL('../pages/index.vue', import.meta.url), 'utf8');
	const listSource = await readFile(new URL('../pages/newslist.vue', import.meta.url), 'utf8');
	const cardSource = await readFile(new URL('../components/NewsCard.vue', import.meta.url), 'utf8');

	assert.equal(homeSource.includes('<NewsCard'), true);
	assert.equal(listSource.includes('<NewsCard'), true);
	assert.equal(homeSource.includes('w-11/12 sm:w-96 bg-base-200'), false);
	assert.equal(listSource.includes('w-80 xs:w-96'), false);

	for (const expectedSource of [
		'class="news-card"',
		'.news-card__image',
		'.news-card__category',
		'.news-card__title',
		'.news-card__intro',
		'var(--tk-color-paper)',
		'rgb(var(--tk-color-brand-brown-rgb) / 12%)',
		'rgb(var(--tk-color-ink-rgb) / 8%)',
		'padding: clamp(1rem, 4vw, 1.35rem);',
		'aspect-ratio: 16 / 10;',
	]) {
		assert.equal(cardSource.includes(expectedSource), true, expectedSource);
	}
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/newsCards.test.mjs`

Expected: FAIL because `components/NewsCard.vue` does not exist yet.

### Task 2: Create Shared News Card

**Files:**

- Create: `components/NewsCard.vue`

- [ ] **Step 1: Implement the component**

Create a Nuxt link card with one image, category, title, intro, and subtle tokenized styling. Use `'/img/takumi-ogp.png'` as a bound fallback image source.

- [ ] **Step 2: Run the focused test**

Run: `npm test -- tests/newsCards.test.mjs`

Expected: still FAIL until pages use `<NewsCard>`.

### Task 3: Replace Duplicated Page Markup

**Files:**

- Modify: `pages/index.vue`
- Modify: `pages/newslist.vue`

- [ ] **Step 1: Replace homepage card markup**

Use `<NewsCard :item="item" :to="localePath({ path: \`news/${item.slug}/\` })" />`inside the existing`v-for`.

- [ ] **Step 2: Replace news-list card markup**

Use `<NewsCard :item="item" :to="localePath({ path: \`../news/${item.slug}/\` })" variant="list" />`inside the existing`v-for`.

- [ ] **Step 3: Run focused and full tests**

Run: `npm test -- tests/newsCards.test.mjs`

Expected: PASS.

Run: `npm test`

Expected: PASS.

### Task 4: Verify Responsive UI

**Files:**

- Verify: local Nuxt page in browser

- [ ] **Step 1: Start dev server**

Run: `npm run dev -- --host 127.0.0.1`

- [ ] **Step 2: Inspect mobile and desktop**

Open `/newslist/` and `/` at a mobile viewport and confirm the cards use near-full mobile width, consistent image ratios, modern tokenized surfaces, and no old fixed-width grey card layout.
