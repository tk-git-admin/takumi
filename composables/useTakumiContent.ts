import { useHome } from '~/store/home';
import { useKnives } from '~/store/knives';
import { useNews } from '~/store/news';
import { useProducts } from '~/store/products';

type LocaleCode = 'en' | 'ja';

type DetailsResponse = {
	details: Record<string, any> | null;
};

type ListResponse = {
	list: Array<Record<string, any>>;
};

const locales: LocaleCode[] = ['en', 'ja'];

function contentQuery(locale: LocaleCode) {
	return { lang: locale };
}

export async function useTakumiContent() {
	const homeStore = useHome();
	const newsStore = useNews();
	const productsStore = useProducts();
	const knivesStore = useKnives();

	const { data, error } = await useAsyncData('takumi-content', async () => {
		const [homeEn, homeJa, newsEn, newsJa, productsEn, productsJa, knivesEn, knivesJa] =
			await Promise.all([
				$fetch<DetailsResponse>('/api/content/home', { query: contentQuery('en') }),
				$fetch<DetailsResponse>('/api/content/home', { query: contentQuery('ja') }),
				$fetch<ListResponse>('/api/content/news', { query: contentQuery('en') }),
				$fetch<ListResponse>('/api/content/news', { query: contentQuery('ja') }),
				$fetch<ListResponse>('/api/content/products', { query: contentQuery('en') }),
				$fetch<ListResponse>('/api/content/products', { query: contentQuery('ja') }),
				$fetch<ListResponse>('/api/content/knives', { query: contentQuery('en') }),
				$fetch<ListResponse>('/api/content/knives', { query: contentQuery('ja') }),
			]);

		return {
			home: { en: homeEn.details || {}, ja: homeJa.details || {} },
			news: { en: newsEn.list || [], ja: newsJa.list || [] },
			products: { en: productsEn.list || [], ja: productsJa.list || [] },
			knives: { en: knivesEn.list || [], ja: knivesJa.list || [] },
		};
	});

	if (error.value) {
		throw createError({
			statusCode: 502,
			statusMessage: 'Unable to load Takumi CMS content',
		});
	}

	const content = data.value;
	for (const locale of locales) {
		homeStore[locale] = content?.home[locale] || {};
	}
	newsStore.en_list = content?.news.en || [];
	newsStore.ja_list = content?.news.ja || [];
	productsStore.en_list = content?.products.en || [];
	productsStore.ja_list = content?.products.ja || [];
	knivesStore.en_list = content?.knives.en || [];
	knivesStore.ja_list = content?.knives.ja || [];

	return { data, error };
}
