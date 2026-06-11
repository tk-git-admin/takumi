import { ref } from 'vue';
import type { Ref } from 'vue';
import { defineStore } from 'pinia';

enum LANG {
	EN = 'en',
	JA = 'ja',
}

interface Knives {
	en_list: Array<Record<string, any>>;
	ja_list: Array<Record<string, any>>;
	myRef: Ref<string>;
}

export const useKnives = defineStore('knives', {
	state: (): Knives => ({
		en_list: [],
		ja_list: [],
		myRef: ref('knivesList'),
	}),
	actions: {
		getList(lang: string): Array<Record<string, any>> {
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
