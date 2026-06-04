import { Ref, ref } from 'vue';
import { defineStore } from 'pinia';

enum LANG {
	EN = 'en',
	JA = 'ja',
}

interface Knives {
	en_list: [];
	ja_list: [];
	myRef: Ref<string>;
}

export const useKnives = defineStore('knives', {
	state: (): Knives => ({
		en_list: [],
		ja_list: [],
		myRef: ref('knivesList'),
	}),
	actions: {
		getList(lang: string) {
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
