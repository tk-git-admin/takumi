const SEIBU_FAIR_PATH = '/seibu-fair';
const JAPANESE_SEIBU_FAIR_PATH = `/ja${SEIBU_FAIR_PATH}`;

function normalizePath(path = '/') {
	const value = String(path || '/').split(/[?#]/)[0] || '/';
	return value.length > 1 ? value.replace(/\/+$/, '') : value;
}

export function shouldShowSeibuAnnouncement(path = '/') {
	const normalizedPath = normalizePath(path);

	return normalizedPath !== SEIBU_FAIR_PATH && normalizedPath !== JAPANESE_SEIBU_FAIR_PATH;
}
