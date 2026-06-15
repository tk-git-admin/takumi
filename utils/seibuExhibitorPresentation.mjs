const INITIALS_IGNORED_WORDS = new Set([
	'and',
	'co',
	'company',
	'corp',
	'corporation',
	'inc',
	'ltd',
	'sdn',
	'bhd',
	'the',
]);

function asString(value) {
	if (typeof value === 'string') return value.trim();
	if (typeof value === 'number') return String(value);
	return '';
}

export function resolveSeibuExhibitorInitials(displayName) {
	const nameWithoutParenthetical = asString(displayName).replace(/\s*\([^)]*\)\s*/g, ' ');
	const words = nameWithoutParenthetical.match(/[A-Za-z0-9]+/g) || [];
	const meaningfulWords = words.filter((word) => !INITIALS_IGNORED_WORDS.has(word.toLowerCase()));
	const initialsSource = meaningfulWords.length ? meaningfulWords : words;
	const limit = initialsSource.length > 1 ? 2 : 1;
	const initials = initialsSource
		.slice(0, limit)
		.map((word) => word[0])
		.join('')
		.toUpperCase();

	return initials || '?';
}
