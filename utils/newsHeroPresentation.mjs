function normalizeDisplayText(value) {
	return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function extractLeadingLabel(value) {
	const text = normalizeDisplayText(value);
	const match = text.match(/^\[([^[\]]+)]\s*(.*)$/);

	if (!match) {
		return { label: '', text };
	}

	return {
		label: normalizeDisplayText(match[1]),
		text: normalizeDisplayText(match[2]),
	};
}

function splitTitleAndDescription(value) {
	const text = normalizeDisplayText(value);
	const separatorIndex = text.search(/[:：]/);

	if (separatorIndex < 0) {
		return { title: text, description: '' };
	}

	return {
		title: normalizeDisplayText(text.slice(0, separatorIndex)),
		description: normalizeDisplayText(text.slice(separatorIndex + 1)),
	};
}

export function getNewsHeroPresentation(content = {}) {
	const hero = content?.hero || {};
	const news = content?.news || {};
	const rawTitle = normalizeDisplayText(hero.hero_title || news.headline || content.subject);
	const rawSubtitle = normalizeDisplayText(hero.hero_subtitle);
	const category = normalizeDisplayText(news.category);
	const { label: titleLabel, text: titleWithoutLabel } = extractLeadingLabel(rawTitle);
	const splitTitle = splitTitleAndDescription(titleWithoutLabel);

	return {
		label: titleLabel || category,
		title: splitTitle.title,
		description: rawSubtitle || splitTitle.description,
	};
}
