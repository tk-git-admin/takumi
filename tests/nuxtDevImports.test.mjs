import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { test } from 'node:test';

async function exists(path) {
	try {
		await access(path, constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

test('server-only Kuroco helpers are outside Nuxt top-level utils auto-imports', async () => {
	assert.equal(await exists(new URL('../utils/contactValidation.mjs', import.meta.url)), false);
	assert.equal(await exists(new URL('../utils/kurocoContent.mjs', import.meta.url)), false);
	assert.equal(await exists(new URL('../server/shared/contactValidation.mjs', import.meta.url)), true);
	assert.equal(await exists(new URL('../server/shared/kurocoContent.mjs', import.meta.url)), true);
});
