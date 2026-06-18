const JA_PREFIX = '/ja';

export function normalizeInternalPath(path = '/') {
	const cleanPath = String(path || '/').trim() || '/';
	return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
}

export function hasLocalePrefix(path = '/', localePrefix = JA_PREFIX) {
	const cleanPath = normalizeInternalPath(path);
	return (
		cleanPath === localePrefix ||
		cleanPath.startsWith(`${localePrefix}/`) ||
		cleanPath.startsWith(`${localePrefix}?`) ||
		cleanPath.startsWith(`${localePrefix}#`)
	);
}

export function getLocalizedLink(path = '/', locale = 'en') {
	const cleanPath = normalizeInternalPath(path);

	if (locale === 'ja' && !hasLocalePrefix(cleanPath)) {
		return `${JA_PREFIX}${cleanPath}`;
	}

	return cleanPath;
}

export function isHashLink(path = '/') {
	return normalizeInternalPath(path).includes('#');
}

export function toggleLocalePrefix(path = '/', localePrefix = JA_PREFIX) {
	const cleanPath = normalizeInternalPath(path);

	if (hasLocalePrefix(cleanPath, localePrefix)) {
		if (cleanPath === localePrefix) return '/';
		return cleanPath.slice(localePrefix.length) || '/';
	}

	return `${localePrefix}${cleanPath}`;
}
