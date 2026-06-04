import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
	mapContactPayload,
	selectContactFormId,
	validateContactPayload,
} from '../server/shared/contactValidation.mjs';

test('contact validation trims accepted payloads and preserves app-level fields', () => {
	const result = validateContactPayload({
		name: '  Takumi Guest  ',
		email: '  guest@example.com  ',
		message: '  I would like to know more.  ',
		locale: 'ja',
	});

	assert.equal(result.valid, true);
	assert.deepEqual(result.value, {
		name: 'Takumi Guest',
		email: 'guest@example.com',
		message: 'I would like to know more.',
		locale: 'ja',
	});
	assert.deepEqual(result.errors, {});
});

test('contact validation returns structured errors without leaking CMS fields', () => {
	const result = validateContactPayload({
		name: '',
		email: 'bad-email',
		message: '',
		locale: 'ms',
	});

	assert.equal(result.valid, false);
	assert.equal(result.value, null);
	assert.deepEqual(result.errors, {
		name: 'required',
		email: 'format',
		message: 'required',
		locale: 'unsupported',
	});
});

test('contact mapper converts app payloads into Kuroco inquiry payloads', () => {
	const value = {
		name: 'Takumi Guest',
		email: 'guest@example.com',
		message: 'I would like to know more.',
		locale: 'en',
	};

	assert.deepEqual(mapContactPayload(value), {
		name: 'Takumi Guest',
		from_mail: 'guest@example.com',
		ext_01: 'Takumi Message',
		body: 'I would like to know more.',
	});
	assert.equal(selectContactFormId({ formEngId: '1', formJpId: '3' }, 'en'), '1');
	assert.equal(selectContactFormId({ formEngId: '1', formJpId: '3' }, 'ja'), '3');
});
