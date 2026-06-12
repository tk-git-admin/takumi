import { ref } from 'vue';
import type { Ref } from 'vue';
import { defineStore } from 'pinia';

enum LANG {
	EN = 'en',
	JA = 'ja',
}

interface Products {
	en_list: Array<Record<string, any>>;
	ja_list: Array<Record<string, any>>;
	myRef: Ref<string>;
}

export const useProducts = defineStore('products', {
	state: (): Products => ({
		en_list: [],
		ja_list: [],
		myRef: ref('productsList'),
	}),
	actions: {
		getProducts(lang: string): Array<Record<string, any>> {
			let selectedLang: Array<Record<string, any>> = [];
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
