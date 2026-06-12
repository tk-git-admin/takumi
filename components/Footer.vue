<template>
	<footer class="footer items-center p-4 bg-base-300 text-neutral-content pb-16 md:pb-4">
		<aside class="items-center grid-flow-col">
			<NuxtLink :to="localePath({ path: `/` })" no-prefetch>
				<img :src="logoSrc" :alt="logoAlt" class="w-24" />
			</NuxtLink>
			<!-- <p>Copyright © 2024 - All right reserved</p> -->
		</aside>
		<nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
			<a href="https://www.linkedin.com/company/takumi-international/" target="_blank"
				><img :src="linkedinSrc" :alt="linkedinAlt" class="w-10"
			/></a>
			<a href="https://shopee.com.my/takumi.store/" target="_blank"
				><img :src="shopeeSrc" :alt="shopeeAlt" class="w-10"
			/></a>
			<a href="https://www.tiktok.com/@takumi.intl" target="_blank"
				><img :src="tiktok" alt="tiktok logo" class="w-10"
			/></a>
		</nav>
	</footer>
</template>

<script setup>
const logoSrc = '/img/takumi-logo-white.webp';
const logoAlt = 'Logo';
const linkedinSrc = '/img/linkedin.png';
const linkedinAlt = 'linkedin';
const shopeeSrc = '/img/shopee.png';
const shopeeAlt = 'shopee';
const tiktok = '/img/tiktok.svg';
</script>
