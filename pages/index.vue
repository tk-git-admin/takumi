<template>
	<div>
		<!-- Hero Section -->
		<div
			class="hero min-h-screen bg-cover bg-center flex sm:justify-end sm:items-end"
			style="background-image: url('/img/hero_bg.jpg')">
			<div
				class="hero-content card bg-[rgba(39,34,34,0.57)] max-w-md p-4 text-center mr-5 ml-5 sm:mb-12 sm:mr-24">
				<h1 class="text-4xl font-bold text-base-100">
					{{ getHomeList().main_title }}
				</h1>
				<p class="py-6 text-base-100">
					{{ getHomeList().tagline }}
				</p>
				<button @click="doHeroAction()" class="btn btn-primary">
					{{ $t('hero.button') }}
				</button>
			</div>
		</div>

		<!-- Features Section -->
		<div id="features" class="py-12 bg-base-100">
			<div class="w-container mx-16">
				<div class="flex flex-col items-center w-full py-3">
					<h1 class="text-4xl font-bold text-center">
						{{ getHomeList().intro.intro_title }}
					</h1>
					<p class="py-6">{{ getHomeList().intro.intro_subtitle }}</p>
				</div>

				<div class="flex flex-col items-center w-full lg:flex-row">
					<div class="grid flex-grow h-70 lg:w-96 card">
						<div class="card-body">
							<figure><img src="/img/features1.png" alt="Image" /></figure>
							<h2 class="card-title justify-center text-primary">
								{{ getHomeList().features[0].feature_title }}
							</h2>
							<p class="text-center">{{ getHomeList().features[0].feature_desc }}</p>
						</div>
					</div>
					<div class="divider lg:divider-horizontal"></div>
					<div class="grid flex-grow h-70 lg:w-96 card">
						<div class="card-body">
							<figure><img src="/img/features2.png " alt="Image" /></figure>
							<h2 class="card-title justify-center text-primary">
								{{ getHomeList().features[1].feature_title }}
							</h2>
							<p class="text-center">{{ getHomeList().features[1].feature_desc }}</p>
						</div>
					</div>
					<div class="divider lg:divider-horizontal"></div>
					<div class="grid flex-grow h-70 lg:w-96 card">
						<div class="card-body">
							<figure><img src="/img/features3.png" alt="Image" /></figure>
							<h2 class="card-title justify-center text-primary">
								{{ getHomeList().features[2].feature_title }}
							</h2>
							<p class="text-center">{{ getHomeList().features[2].feature_desc }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- News Section -->
		<div class="py-12 bg-neutral">
			<div class="w-container">
				<h1 class="text-4xl font-bold text-center">
					{{ $t('news.title') }}
				</h1>
				<div
					class="mt-10 flex flex-col lg:flex-row gap-10 items-start items-center lg:items-stretch lg:justify-center md:my-16">
					<!-- News Cards -->
					<div
						v-for="(item, index) in getNewsList().slice(0, 3)"
						class="card w-11/12 sm:w-96 bg-base-200 border border-base-200 flex flex-grow">
						<!-- Card -->
						<NuxtLink :to="localePath({ path: `news/${item.slug}/` })" no-prefetch>
							<!-- Image -->
							<div class="flex flex-col bg-base-200 rounded-box max-w-xl">
								<figure class="w-full h-48 overflow-hidden bg-base-100">
									<img
										v-if="item.thumbnail.url"
										:src="item.thumbnail.url"
										alt="Image"
										class="w-full h-full object-cover" />
									<img
										v-else
										src="/img/takumi-ogp.png"
										alt="Default Image"
										class="w-full h-full object-cover" />
								</figure>
								<!-- item.hero.hero_image.url -->
								<!-- <div class="bg-[url('{/backgrounds/forest.jpg}')] bg-center rounded-t-box w-full h-72"></div> -->

								<!-- Body-->
								<div class="flex flex-col gap-6 p-6">
									<h3 class="text-primary font-medium">{{ item.news.category }}</h3>

									<div class="link link-hover text-xl font-bold">{{ item.news.headline }}</div>

									<span>
										{{ item.news.intro }}
									</span>

									<div class="flex gap-2 justify-between items-center">
										<a class="btn btn-ghost">
											<!-- <img alt="Profile" src="/avatar.png" class="w-8 rounded-full" /> -->

											<!-- <span class="font-medium text-sm">User Name</span> -->
										</a>

										<!-- <span class="text-sm">{{ item.ymd }}</span> -->
									</div>
								</div>
							</div>
						</NuxtLink>
					</div>
				</div>
				<div
					class="mt-10 flex flex-col lg:flex-row gap-10 items-start items-center lg:justify-end md:my-16">
					<NuxtLink :to="localePath({ path: `newslist` })" no-prefetch>
						<button class="btn btn-primary">{{ $t('news.more') }}</button>
					</NuxtLink>
				</div>
			</div>
		</div>

		<!-- Info Section -->
		<div class="py-12 bg-neutral">
			<div class="w-container md:mx-16">
				<div class="flex flex-col items-start w-full lg:flex-row gap-12">
					<div class="grid flex-grow h-70 lg:w-32 card">
						<h1 class="text-4xl font-bold text-primary">
							{{ getHomeList().info.info_subtitle }}
						</h1>
						<p class="py-6">{{ getHomeList().info.info_desc }}</p>
						<div v-for="(item, index) in getHomeList().services">
							<div class="collapse collapse-arrow bg-base-200 my-1">
								<input type="radio" name="my-accordion-2" />
								<div class="collapse-title text-xl font-medium">
									{{ item.service_feature_title }}
								</div>
								<div class="collapse-content">
									<p>{{ item.service_feature_desc }}</p>
								</div>
							</div>
						</div>
					</div>
					<div class="grid flex-grow h-70 lg:w-32">
						<figure><img src="/img/malaysia-japan-flag.jpg " alt="Image" /></figure>
					</div>
				</div>
			</div>
		</div>

		<!-- Corporate Section -->
		<div class="py-12">
			<div class="w-container">
				<div class="flex flex-col items-center w-full py-3">
					<h1 class="text-4xl font-bold text-center">
						{{ $t('corporate.title') }}
					</h1>
				</div>
				<!-- Content -->
				<div class="flex flex-col lg:flex-row justify-between gap-12">
					<div class="flex">
						<!-- Corporate Details -->
						<table class="table">
							<tbody>
								<tr>
									<td class="p-0">{{ $t('corporate.name') }}</td>
									<td>{{ getHomeList().company.company_name }}</td>
								</tr>
								<tr>
									<td class="p-0">{{ $t('corporate.address') }}</td>
									<td>{{ getHomeList().location.address }}</td>
								</tr>
								<tr>
									<td class="p-0">{{ $t('corporate.manager') }}</td>
									<td class="max-w-24">
										{{ getHomeList().company.managing_director }}
									</td>
								</tr>
								<tr>
									<td class="p-0">{{ $t('corporate.phone') }}</td>
									<td>{{ getHomeList().contact.phone_num }}</td>
								</tr>
								<tr>
									<td class="p-0">{{ $t('corporate.registration') }}</td>
									<td>{{ getHomeList().company.reg_no }}</td>
								</tr>
								<tr>
									<td class="p-0">{{ $t('corporate.establishment') }}</td>
									<td>{{ getHomeList().company.established_date }}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<!-- Image -->
					<div class="flex">
						<iframe
							data-v-ff1ba62e=""
							src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d127485.63010763747!2d101.574479!3d3.114296!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4f676dff0665%3A0x4b0ff9bb2ce971dc!2sTakumi%20International%20Sdn%20Bhd!5e0!3m2!1sen!2smy!4v1690857574524!5m2!1sen!2smy"
							height="400"
							allowfullscreen="allowfullscreen"
							loading="lazy"
							referrerpolicy="no-referrer-when-downgrade"
							style="border: 0px"
							bg-center
							rounded-t-box
							class="takumi-map"></iframe>
					</div>
				</div>
			</div>
		</div>

		<!-- Contact Section -->
		<div class="py-12 bg-neutral" id="contact">
			<div class="w-container">
				<div class="flex flex-col items-center w-full py-3">
					<h1 class="text-4xl font-bold text-center">
						{{ $t('contact.title') }}
					</h1>
				</div>
				<!-- Contact Form -->
				<div class="flex flex-col items-center w-full">
					<label class="form-control w-full lg:max-w-lg">
						<div class="label">
							<span class="label-text"
								>{{ $t('contact.namePrompt') }}<span style="color: red"> *</span></span
							>
						</div>
						<input
							v-model="contact.name"
							type="text"
							:placeholder="$t('contact.nameHint')"
							class="input input-bordered max-w-full"
							:maxlength="inputLimit.name" />
						<div class="label">
							<span class="label-text-alt" style="color: red">{{
								getInputValidationMessage(locale, contact.name)
							}}</span>
							<span class="label-text-alt">{{ contact.name.length }}/{{ inputLimit.name }}</span>
						</div>
					</label>
					<label class="form-control w-full lg:max-w-lg">
						<div class="label">
							<span class="label-text"
								>{{ $t('contact.emailPrompt') }}<span style="color: red"> *</span></span
							>
						</div>
						<input
							v-model="contact.email"
							type="text"
							placeholder="email@address.com"
							class="input input-bordered"
							:maxlength="inputLimit.email" />
						<div class="label">
							<span class="label-text-alt" style="color: red">{{
								getInputValidationMessage(locale, contact.email, true)
							}}</span>
							<span class="label-text-alt">{{ contact.email.length }}/{{ inputLimit.email }}</span>
						</div>
					</label>
					<label class="form-control w-full lg:max-w-lg">
						<div class="label">
							<span class="label-text"
								>{{ $t('contact.messagePrompt') }}<span style="color: red"> *</span></span
							>
						</div>
						<textarea
							v-model="contact.message"
							class="textarea textarea-bordered h-96"
							:maxlength="inputLimit.message"
							:placeholder="$t('contact.messageHint')"></textarea>
						<div class="label">
							<span class="label-text-alt" style="color: red">{{
								getInputValidationMessage(locale, contact.message)
							}}</span>
							<span class="label-text-alt"
								>{{ contact.message.length }}/{{ inputLimit.message }}</span
							>
						</div>
					</label>
					<button @click="sendMessage(locale)" class="btn btn-primary w-56">
						{{ $t('contact.sendButton') }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.takumi-map {
	width: 600px;
}
@media only screen and (max-width: 1024px) {
	.takumi-map {
		width: 100%;
	}
}
</style>

<script>
import { useToast } from 'vue-toastification';
const toast = useToast();
export default {
	data() {
		return {
			contact: {
				name: '',
				email: '',
				message: '',
			},
			inputLimit: {
				name: 50,
				email: 50,
				message: 500,
			},
			inputValidationMsg: {
				en: {
					required: '', //Left it empty because required is already expressed with *
					email: 'Wrong email format. Example ******@example.jp',
				},
				ja: {
					required: '', //Left it empty because required is already expressed with *
					email: 'メールアドレスのフォーマットが正しくありません。 例：******@example.jp',
				},
			},
		};
	},
	methods: {
		async sendMessage(locale) {
			//Validate Fields
			if (this.isFieldEmpty()) {
				toast.error(this.$t('contact.form.empty'), {
					position: 'top-center',
					timeout: 5000,
					closeOnClick: true,
					pauseOnFocusLoss: true,
					pauseOnHover: true,
					draggable: true,
					draggablePercent: 0.6,
					showCloseButtonOnHover: false,
					hideProgressBar: true,
					closeButton: 'button',
					icon: true,
					rtl: false,
				});
				return;
			}
			// Validate email
			if (!this.isValidEmail(this.contact.email)) {
				toast.error(this.$t('contact.form.email'), {
					position: 'top-center',
					timeout: 5000,
					closeOnClick: true,
					pauseOnFocusLoss: true,
					pauseOnHover: true,
					draggable: true,
					draggablePercent: 0.6,
					showCloseButtonOnHover: false,
					hideProgressBar: true,
					closeButton: 'button',
					icon: true,
					rtl: false,
				});
				return;
			}

			try {
				await $fetch('/api/contact', {
					method: 'POST',
					body: {
						name: this.contact.name,
						email: this.contact.email,
						message: this.contact.message,
						locale,
					},
				});

				toast.success(this.$t('contact.form.success'), {
					position: 'top-center',
					timeout: 5000,
					closeOnClick: true,
					pauseOnFocusLoss: true,
					pauseOnHover: true,
					draggable: true,
					draggablePercent: 0.6,
					showCloseButtonOnHover: false,
					hideProgressBar: true,
					closeButton: 'button',
					icon: true,
					rtl: false,
				});
			} catch (error) {
				this.showContactFormErrorMessage();
				// console.error('Error sending message:', error);
			}
		},
		isValidEmail(email) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(email);
		},
		isFieldEmpty() {
			return this.contact.name === '' || this.contact.message === '' || this.contact.email === '';
		},
		getInputValidationMessage(locale, word, isEmail = false) {
			if (word === '')
				return locale === 'en'
					? this.inputValidationMsg.en.required
					: this.inputValidationMsg.ja.required;
			if (isEmail && !this.isValidEmail(word))
				return locale === 'en'
					? this.inputValidationMsg.en.email
					: this.inputValidationMsg.ja.email;
			return '';
		},
		showContactFormErrorMessage() {
			toast.error(this.$t('contact.form.error'), {
				position: 'top-center',
				timeout: 5000,
				closeOnClick: true,
				pauseOnFocusLoss: true,
				pauseOnHover: true,
				draggable: true,
				draggablePercent: 0.6,
				showCloseButtonOnHover: false,
				hideProgressBar: true,
				closeButton: 'button',
				icon: true,
				rtl: false,
			});
		},
	},
};
</script>

<script setup>
import { useNews } from '~/store/news';
import { useHome } from '~/store/home';
import { useI18n } from 'vue-i18n';
const { locale, t } = useI18n();
const newsList = useNews();
const homeList = useHome();
const router = useRouter();

function getHomeList() {
	return homeList.getList(locale.value);
}

function getNewsList() {
	return newsList.getNews(locale.value);
}

function doHeroAction() {
	router.push({ hash: '#features' });
}

useSeoMeta({
	title: t('seo.title'),
	ogTitle: t('seo.ogTitle'),
	description: t('seo.description'),
	ogDescription: t('seo.ogDescription'),
	ogImage: '/img/takumi-ogp.png',
	twitterCard: t('seo.twitterCard'),
});
</script>
