# Knife Hero Spacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the knives page hero text clear of the fixed navigation and center the mobile hero copy.

**Architecture:** Add shared fixed-header and page-hero spacing tokens in `assets/css/tokens.css`, then update only `pages/knives.vue` to consume those tokens. Add one source-level regression test so the page does not fall back to the old `mt-20` spacing or left-aligned mobile text.

**Tech Stack:** Nuxt 3.16.2, Vue 3.5.13, scoped Vue CSS, Node `node:test`.

---

### Task 1: Knife Hero Spacing Contract

**Files:**

- Create: `tests/knifeHeroSpacing.test.mjs`
- Modify: `assets/css/tokens.css`
- Modify: `pages/knives.vue`

- [x] **Step 1: Write the failing test**

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('knife hero reserves fixed-nav space with shared page hero tokens', async () => {
	const tokensSource = await readFile(new URL('../assets/css/tokens.css', import.meta.url), 'utf8');
	const pageSource = await readFile(new URL('../pages/knives.vue', import.meta.url), 'utf8');

	for (const token of [
		'--tk-nav-announcement-height: 3rem;',
		'--tk-nav-row-height: clamp(4.35rem, 5.6vw, 5.4rem);',
		'--tk-fixed-header-height: calc(var(--tk-nav-announcement-height) + var(--tk-nav-row-height));',
		'--tk-page-hero-top-clearance: calc(var(--tk-fixed-header-height) + clamp(1rem, 2.5vw, 1.75rem));',
	]) {
		assert.equal(tokensSource.includes(token), true, token);
	}

	assert.equal(pageSource.includes('class="main-section top no-hero wf-section mt-20"'), false);
	assert.equal(pageSource.includes('class="main-section top no-hero wf-section knife-page"'), true);
	assert.equal(pageSource.includes('padding: var(--tk-page-hero-top-clearance)'), true);
	assert.equal(pageSource.includes('min-height: clamp(15.5rem, 24vw, 18rem);'), true);
});

test('knife hero centers compact mobile copy without horizontal overflow', async () => {
	const pageSource = await readFile(new URL('../pages/knives.vue', import.meta.url), 'utf8');

	for (const expectedSource of [
		'text-align: center;',
		'width: min(calc(100% - calc(var(--tk-space-gutter) * 2)), var(--tk-content-max));',
		'text-wrap: balance;',
		'padding-inline: var(--tk-space-gutter);',
		'padding-block: var(--tk-page-hero-top-clearance) clamp(2.75rem, 7vw, 4rem);',
		'font-size: clamp(1.85rem, 8vw, 2.35rem);',
	]) {
		assert.equal(pageSource.includes(expectedSource), true, expectedSource);
	}
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/knifeHeroSpacing.test.mjs`

Expected: FAIL because the shared spacing tokens do not exist yet and `pages/knives.vue` still uses `mt-20`.

- [x] **Step 3: Add minimal implementation**

Add fixed-header/page-hero tokens to `assets/css/tokens.css`. In `pages/knives.vue`, replace `mt-20` with a page-specific class, make `.top__banner` use the shared top clearance token, add centered text styles, and tune the mobile media block.

- [x] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/knifeHeroSpacing.test.mjs`

Expected: PASS.

- [x] **Step 5: Verify browser and build**

Run:

```bash
npm test
npm run build
npx prettier assets/css/tokens.css pages/knives.vue tests/knifeHeroSpacing.test.mjs --check
```

Then open the knives page in the in-app browser at desktop and mobile widths and verify the hero title is not covered by the fixed nav.
