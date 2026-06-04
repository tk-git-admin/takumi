import { Ref, ref } from 'vue';
import { defineStore } from 'pinia';

enum LANG {
	EN = 'en',
	JA = 'ja',
}

interface Products {
	en_list: [];
	ja_list: [];
	myRef: Ref<string>;
}

export const useProducts = defineStore('products', {
	state: (): Products => ({
		en_list: [],
		ja_list: [],
		myRef: ref('productsList'),
	}),
	actions: {
		getProducts(lang: string) {
			let selectedLang;
			switch (lang) {
				case LANG.EN:
					selectedLang = this.en_list;
					break;
				case LANG.JA:
					selectedLang = this.ja_list;
					break;
			}
			return selectedLang;
		},
	},
});
