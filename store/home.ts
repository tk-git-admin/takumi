import { ref } from 'vue';
import type { Ref } from 'vue';
import { defineStore } from 'pinia';

enum LANG {
	EN = 'en',
	JA = 'ja',
}

interface Home {
	en: Record<string, any>;
	ja: Record<string, any>;
	myRef: Ref<string>;
}

export const useHome = defineStore('home', {
	state: (): Home => ({
		en: {},
		ja: {},
		myRef: ref('homeList'),
	}),
	actions: {
		getList(lang: string): Record<string, any> {
			let selectedLang = {};
			switch (lang) {
				case LANG.EN:
					selectedLang = this.en;
					break;
				case LANG.JA:
					selectedLang = this.ja;
					break;
			}
			return selectedLang;
		},
	},
});
