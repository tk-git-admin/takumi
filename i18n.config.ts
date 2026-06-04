import enText from './locales/en.json';
import jaText from './locales/ja.json';

export default defineI18nConfig(() => ({
	legacy: false,
	globalInjection: true,
	locale: 'ja',
	messages: {
		en: enText,
		ja: jaText,
	},
}));
