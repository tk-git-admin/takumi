import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

function extractThemeColor(source, key) {
	const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const match = source.match(
		new RegExp(`['"]?${escapedKey}['"]?:\\s*['"](?<value>#[0-9a-fA-F]{6})['"]`),
	);
	return match?.groups?.value;
}

function hexToRgb(hex) {
	const value = hex.replace('#', '');

	return [
		Number.parseInt(value.slice(0, 2), 16),
		Number.parseInt(value.slice(2, 4), 16),
		Number.parseInt(value.slice(4, 6), 16),
	];
}

function getRelativeLuminance([red, green, blue]) {
	const channels = [red, green, blue].map((channel) => {
		const normalized = channel / 255;

		return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
	});

	return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function getContrastRatio(firstHex, secondHex) {
	const firstLuminance = getRelativeLuminance(hexToRgb(firstHex));
	const secondLuminance = getRelativeLuminance(hexToRgb(secondHex));
	const lighter = Math.max(firstLuminance, secondLuminance);
	const darker = Math.min(firstLuminance, secondLuminance);

	return (lighter + 0.05) / (darker + 0.05);
}

test('primary button theme defines readable text contrast', async () => {
	const tailwindSource = await readFile(new URL('../tailwind.config.ts', import.meta.url), 'utf8');
	const primary = extractThemeColor(tailwindSource, 'primary');
	const primaryContent = extractThemeColor(tailwindSource, 'primary-content');

	assert.equal(primary, '#772c1a');
	assert.equal(primaryContent, '#ffffff');
	assert.ok(
		getContrastRatio(primary, primaryContent) >= 4.5,
		'primary-content must meet WCAG AA contrast against primary',
	);
});

test('global btn-primary styles provide modern interactive states', async () => {
	const mainCss = await readFile(new URL('../assets/css/main.css', import.meta.url), 'utf8');

	for (const expectedSource of [
		'--tk-button-primary-bg: var(--tk-color-brand-brown);',
		'--tk-button-primary-bg-hover: color-mix(',
		'var(--tk-color-brand-brown) 88%',
		'--tk-button-primary-bg-active: color-mix(',
		'var(--tk-color-brand-brown) 76%',
		'--tk-button-primary-text: var(--tk-color-white);',
		'.btn-primary {',
		'color: var(--tk-button-primary-text);',
		'box-shadow: 0 0.75rem 1.6rem rgb(var(--tk-color-brand-brown-rgb) / 18%);',
		'.btn-primary:hover:not(:disabled),',
		'.btn-primary:focus-visible {',
		'outline: 3px solid rgb(var(--tk-color-event-gold-rgb) / 72%);',
		'.btn-primary:active:not(:disabled) {',
		'.btn-primary:disabled,',
	]) {
		assert.equal(mainCss.includes(expectedSource), true, expectedSource);
	}

	for (const removedSource of ['#5f2314', '#4d1d11']) {
		assert.equal(mainCss.includes(removedSource), false, removedSource);
	}
});
