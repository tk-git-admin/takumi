import { useHome } from '~/store/home';
import { useKnives } from '~/store/knives';
import { useNews } from '~/store/news';
import { useProducts } from '~/store/products';
import { watch } from 'vue';

type LocaleCode = 'en' | 'ja';
type KurocoContentGroup = 'home' | 'news' | 'products' | 'knives';

type DetailsResponse = {
	details: Record<string, any> | null;
};

type ListResponse = {
	list: Array<Record<string, any>>;
};

function contentQuery(locale: LocaleCode) {
	return { lang: locale };
}

function normalizeLocaleCode(locale: string): LocaleCode {
	return locale === 'ja' ? 'ja' : 'en';
}

function normalizeRoutePath(path: string) {
	const cleanPath =
		String(path || '/')
			.split('#')[0]
			.split('?')[0]
			.replace(/^\/ja(?=\/|$)/, '') || '/';

	if (cleanPath === '/') return cleanPath;
	return cleanPath.replace(/\/$/, '');
}

export function getContentTypesForRoute(path: string): KurocoContentGroup[] {
	const routePath = normalizeRoutePath(path);

	if (routePath === '/') return ['home', 'news'];
	if (routePath === '/newslist') return ['news'];
	if (routePath === '/products') return ['products'];
	if (routePath === '/knives') return ['knives'];

	return [];
}

export async function useTakumiContent() {
	const homeStore = useHome();
	const newsStore = useNews();
	const productsStore = useProducts();
	const knivesStore = useKnives();
	const requestFetch = useRequestFetch();
	const route = useRoute();
	const { locale } = useI18n();

	const { data, error } = await useAsyncData(
		'takumi-content',
		async () => {
			const currentLocale = normalizeLocaleCode(locale.value);
			const contentTypes = getContentTypesForRoute(route.path);
			const result = {
				locale: currentLocale,
				home: null as Record<string, any> | null,
				news: [] as Array<Record<string, any>>,
				products: [] as Array<Record<string, any>>,
				knives: [] as Array<Record<string, any>>,
			};

			await Promise.all([
				contentTypes.includes('home')
					? requestFetch<DetailsResponse>('/api/content/home', {
							query: contentQuery(currentLocale),
						}).then((response) => {
							result.home = response.details || {};
						})
					: Promise.resolve(),
				contentTypes.includes('news')
					? requestFetch<ListResponse>('/api/content/news', {
							query: contentQuery(currentLocale),
						}).then((response) => {
							result.news = response.list || [];
						})
					: Promise.resolve(),
				contentTypes.includes('products')
					? requestFetch<ListResponse>('/api/content/products', {
							query: contentQuery(currentLocale),
						}).then((response) => {
							result.products = response.list || [];
						})
					: Promise.resolve(),
				contentTypes.includes('knives')
					? requestFetch<ListResponse>('/api/content/knives', {
							query: contentQuery(currentLocale),
						}).then((response) => {
							result.knives = response.list || [];
						})
					: Promise.resolve(),
			]);

			return result;
		},
		{
			watch: [() => route.path, () => locale.value],
		},
	);

	if (error.value) {
		throw createError({
			statusCode: 502,
			statusMessage: 'Unable to load Takumi CMS content',
		});
	}

	function applyContent(content: typeof data.value) {
		if (!content) return;

		const contentLocale = normalizeLocaleCode(content.locale);
		if (content.home) {
			homeStore[contentLocale] = content.home;
		}
		if (content.news.length) {
			newsStore[contentLocale === 'ja' ? 'ja_list' : 'en_list'] = content.news;
		}
		if (content.products.length) {
			productsStore[contentLocale === 'ja' ? 'ja_list' : 'en_list'] = content.products;
		}
		if (content.knives.length) {
			knivesStore[contentLocale === 'ja' ? 'ja_list' : 'en_list'] = content.knives;
		}
	}

	applyContent(data.value);
	watch(data, applyContent);

	return { data, error };
}
