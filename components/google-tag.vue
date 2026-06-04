<template>
	<Head>
		<Meta name="google-site-verification" />
	</Head>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const setGoogleTag = () => {
	window.dataLayer = window.dataLayer || [];

	if (process.client) {
		function gtag() {
			dataLayer.push(arguments);
		}

		gtag('js', new Date());
		gtag('config', 'G-NZ2CXEVGS7');
	}
};

useHead({
	script: [
		{
			src: 'https://www.googletagmanager.com/gtag/js?id=G-NZ2CXEVGS7',
			type: 'text/javascript',
			async: true,
		},
	],
});

onMounted(() => {
	setGoogleTag();
});
</script>
