<template>
	<div>
		<section class="takumi-hero" :style="heroImageStyle" aria-labelledby="home-hero-title">
			<div class="takumi-hero__inner">
				<article class="takumi-hero-card">
					<span
						class="takumi-hero-card__backing-tab takumi-hero-card__backing-tab--bottom"
						aria-hidden="true"></span>
					<span class="takumi-hero-card__fold" aria-hidden="true"></span>
					<h1 id="home-hero-title" class="takumi-hero-card__title">
						{{ getHomeList().main_title }}
					</h1>
					<hr class="takumi-hero-card__mark" />
					<p class="takumi-hero-card__copy">
						{{ getHomeList().tagline }}
					</p>
					<div class="takumi-hero-card__footer">
						<button type="button" class="takumi-hero-card__button" @click="doHeroAction">
							{{ t('hero.button') }}
							<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path
									d="M5 12h13m-5-5 5 5-5 5"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round" />
							</svg>
						</button>
					</div>
				</article>
			</div>
		</section>

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
							<figure><img :src="'/img/features1.png'" alt="Image" /></figure>
							<h2 class="card-title justify-center text-primary">
								{{ getHomeList().features[0].feature_title }}
							</h2>
							<p class="text-center">{{ getHomeList().features[0].feature_desc }}</p>
						</div>
					</div>
					<div class="divider lg:divider-horizontal"></div>
					<div class="grid flex-grow h-70 lg:w-96 card">
						<div class="card-body">
							<figure><img :src="'/img/features2.png'" alt="Image" /></figure>
							<h2 class="card-title justify-center text-primary">
								{{ getHomeList().features[1].feature_title }}
							</h2>
							<p class="text-center">{{ getHomeList().features[1].feature_desc }}</p>
						</div>
					</div>
					<div class="divider lg:divider-horizontal"></div>
					<div class="grid flex-grow h-70 lg:w-96 card">
						<div class="card-body">
							<figure><img :src="'/img/features3.png'" alt="Image" /></figure>
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
		<div class="takumi-news-section bg-neutral">
			<div class="takumi-news-section__inner">
				<h1 class="takumi-news-section__title">
					{{ $t('news.title') }}
				</h1>
				<div class="takumi-news-section__grid">
					<NewsCard
						v-for="(item, index) in getNewsList().slice(0, 3)"
						:key="item.slug || index"
						:item="item"
						:to="localePath({ path: `news/${item.slug}/` })" />
				</div>
				<div class="takumi-news-section__actions">
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
						<figure><img :src="'/img/malaysia-japan-flag.jpg'" alt="Image" /></figure>
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
		<div class="home-contact-section py-12 bg-neutral" id="contact">
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
.home-contact-section {
	scroll-margin-top: calc(var(--tk-fixed-header-height) + 1rem);
}

.takumi-hero {
	background-color: var(--tk-color-sumi);
	background-image: var(--tk-hero-image);
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	height: 100svh;
	isolation: isolate;
	min-height: 100svh;
	overflow: hidden;
	padding-top: 0;
	position: relative;
}

.takumi-hero::before {
	background: linear-gradient(
			90deg,
			rgb(var(--tk-color-ink-rgb) / 18%),
			rgb(var(--tk-color-ink-rgb) / 4%) 45%,
			rgb(var(--tk-color-brand-brown-rgb) / 8%) 75%,
			rgba(255, 246, 228, 0.14)
		),
		linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgb(var(--tk-color-ink-rgb) / 10%));
	content: '';
	inset: 0;
	pointer-events: none;
	position: absolute;
	z-index: -3;
}

.takumi-hero__inner {
	align-items: center;
	box-sizing: border-box;
	display: grid;
	gap: clamp(2rem, 5vw, 5rem);
	grid-template-columns: minmax(18rem, 1fr) minmax(34rem, 42rem);
	justify-items: end;
	margin-inline: auto;
	min-height: 100svh;
	padding-block: clamp(9.5rem, 20vh, 13.5rem) clamp(4rem, 8vh, 6rem);
	position: relative;
	width: min(calc(100% - calc(var(--tk-space-gutter) * 2)), 88rem);
	z-index: 5;
}

.takumi-hero-card {
	--tk-hero-corner-cut: clamp(3.8rem, 6vw, 5.2rem);
	--tk-hero-corner-radius: clamp(1.15rem, 1.8vw, 1.8rem);
	background:
		linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.18),
			rgba(255, 255, 255, 0.08) 42%,
			rgba(255, 255, 255, 0.035)
		),
		linear-gradient(
			118deg,
			rgba(255, 246, 228, 0.18),
			rgba(251, 251, 248, 0.055) 40%,
			rgba(199, 154, 67, 0.035)
		),
		url('/img/takumi-washi-glass/pattern-washi-glass.svg') center / 720px 720px repeat;
	background-blend-mode: normal, soft-light, soft-light;
	border: 1px solid rgba(255, 255, 255, 0.28);
	border-radius: var(--tk-hero-corner-radius);
	box-shadow:
		0 30px 84px rgb(var(--tk-color-ink-rgb) / 18%),
		inset 0 1px 0 rgba(255, 255, 255, 0.42),
		inset 0 -18px 54px rgba(255, 255, 255, 0.06),
		inset 0 28px 82px rgba(255, 255, 255, 0.12);
	clip-path: polygon(
		var(--tk-hero-corner-radius) 0,
		calc(100% - var(--tk-hero-corner-cut)) 0,
		100% var(--tk-hero-corner-cut),
		100% calc(100% - var(--tk-hero-corner-radius)),
		calc(100% - var(--tk-hero-corner-radius)) 100%,
		var(--tk-hero-corner-radius) 100%,
		0 calc(100% - var(--tk-hero-corner-radius)),
		0 var(--tk-hero-corner-radius)
	);
	color: var(--tk-color-ink);
	display: grid;
	grid-column: 2;
	grid-template-areas: 'title' 'mark' 'copy' 'footer';
	grid-template-columns: 1fr;
	justify-self: end;
	margin-inline: 0;
	min-height: clamp(27rem, 52vh, 34.5rem);
	overflow: visible;
	padding: clamp(3.25rem, 5.2vw, 4.4rem) clamp(2rem, 4vw, 3.6rem) clamp(2rem, 3.6vw, 3rem);
	position: relative;
	width: min(100%, 42rem);
	backdrop-filter: blur(18px) saturate(160%) contrast(102%);
	-webkit-backdrop-filter: blur(18px) saturate(160%) contrast(102%);
}

.takumi-hero-card::before {
	background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.22),
			rgba(255, 255, 255, 0.08) 34%,
			transparent 68%
		),
		linear-gradient(180deg, rgba(255, 255, 255, 0.14), transparent 54%);
	content: '';
	inset: 0;
	pointer-events: none;
	position: absolute;
	z-index: 0;
}

.takumi-hero-card::after {
	background: rgba(199, 154, 67, 0.28);
	box-shadow: 0 16px 32px rgb(var(--tk-color-brand-brown-rgb) / 18%);
	clip-path: polygon(0 0, 100% 0, 100% 100%, 28% 100%);
	content: '';
	height: clamp(4.7rem, 8vw, 6.2rem);
	pointer-events: none;
	position: absolute;
	right: -1.2rem;
	top: clamp(2.35rem, 5vw, 3.65rem);
	width: clamp(4.3rem, 7vw, 5.5rem);
	z-index: -1;
}

.takumi-hero-card__backing-tab {
	background: rgba(199, 154, 67, 0.24);
	box-shadow: 0 12px 26px rgb(var(--tk-color-brand-brown-rgb) / 15%);
	pointer-events: none;
	position: absolute;
	z-index: -1;
}

.takumi-hero-card__backing-tab--bottom {
	bottom: -1rem;
	clip-path: polygon(0 0, 100% 100%, 0 100%);
	height: clamp(4.2rem, 7vw, 5.45rem);
	left: -0.95rem;
	width: clamp(4.2rem, 7vw, 5.45rem);
}

.takumi-hero-card__fold {
	background:
		linear-gradient(225deg, rgba(238, 214, 167, 0.36) 0 49%, rgba(255, 255, 255, 0.16) 50%),
		url('/img/takumi-washi-glass/pattern-washi.svg') center / 720px 720px repeat;
	border-right: 1px solid rgba(199, 154, 67, 0.62);
	border-top: 1px solid rgba(199, 154, 67, 0.62);
	clip-path: polygon(0 0, 100% 100%, 100% 0);
	filter: drop-shadow(-0.25rem 0.32rem 0.18rem rgb(var(--tk-color-brand-brown-rgb) / 8%));
	height: var(--tk-hero-corner-cut);
	pointer-events: none;
	position: absolute;
	right: 0;
	top: 0;
	width: var(--tk-hero-corner-cut);
	z-index: 3;
}

.takumi-hero-card__title {
	color: var(--tk-color-ink);
	font-family: 'Cormorant Garamond', 'Noto Serif JP', Georgia, serif;
	font-size: clamp(2.75rem, 4.1vw, 4.4rem);
	grid-area: title;
	letter-spacing: 0;
	line-height: 0.96;
	margin: 0;
	max-width: 18ch;
}

.takumi-hero-card__mark {
	background: var(--tk-color-event-gold);
	border: 0;
	grid-area: mark;
	height: 2px;
	margin: clamp(1.5rem, 2.8vw, 2.2rem) 0 clamp(1.35rem, 2.5vw, 1.9rem);
	width: 3.9rem;
}

.takumi-hero-card__copy {
	color: rgb(var(--tk-color-ink-rgb) / 82%);
	font-size: clamp(1rem, 1.2vw, 1.14rem);
	grid-area: copy;
	line-height: 1.68;
	margin: 0;
	max-width: 29rem;
}

.takumi-hero-card__footer {
	align-items: flex-end;
	display: flex;
	gap: clamp(1rem, 2vw, 2rem);
	grid-area: footer;
	justify-content: flex-start;
	margin-top: clamp(1.6rem, 3vw, 2.45rem);
	position: relative;
	z-index: 3;
}

.takumi-hero-card__button {
	align-items: center;
	background: linear-gradient(135deg, var(--tk-color-event-red), var(--tk-color-brand-brown));
	border: 1px solid rgba(255, 255, 255, 0.28);
	border-radius: 999px;
	box-shadow:
		0 17px 38px rgb(var(--tk-color-brand-brown-rgb) / 30%),
		inset 0 1px 0 rgba(255, 255, 255, 0.24);
	color: var(--tk-color-white);
	display: inline-flex;
	font-size: clamp(0.95rem, 1vw, 1.08rem);
	font-weight: 850;
	gap: 0.75rem;
	justify-content: center;
	margin-top: 0;
	min-height: clamp(3.15rem, 4vw, 3.7rem);
	min-width: clamp(12rem, 14vw, 14.2rem);
	padding: 0 1.9rem 0 2.15rem;
	position: relative;
	text-decoration: none;
	transition:
		box-shadow 0.24s ease,
		filter 0.24s ease,
		transform 0.24s ease;
	z-index: 1;
}

.takumi-hero-card__button:hover {
	box-shadow:
		0 22px 46px rgb(var(--tk-color-brand-brown-rgb) / 38%),
		inset 0 1px 0 rgba(255, 255, 255, 0.28);
	filter: saturate(1.08);
	transform: translateY(-2px);
}

.takumi-hero-card__button:focus-visible {
	outline: 3px solid rgba(199, 154, 67, 0.72);
	outline-offset: 3px;
}

.takumi-hero-card__button svg {
	height: 1.1rem;
	width: 1.1rem;
}

.takumi-hero-card__title,
.takumi-hero-card__mark,
.takumi-hero-card__copy,
.takumi-hero-card__footer {
	position: relative;
	z-index: 2;
}

.takumi-map {
	width: 600px;
}

.takumi-news-section {
	padding: var(--tk-space-section) 0;
}

.takumi-news-section__inner {
	width: min(calc(100% - 1.5rem), var(--tk-content-max));
	margin: 0 auto;
}

.takumi-news-section__title {
	margin: 0;
	color: var(--tk-color-sumi);
	font-size: clamp(2.35rem, 9vw, 4rem);
	font-weight: 800;
	line-height: 1.05;
	text-align: center;
}

.takumi-news-section__grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: clamp(1rem, 4vw, 1.5rem);
	margin-top: clamp(2rem, 8vw, 3.5rem);
}

.takumi-news-section__actions {
	display: flex;
	justify-content: center;
	margin-top: clamp(1.5rem, 5vw, 2.5rem);
}

@media (min-width: 768px) {
	.takumi-news-section__grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (min-width: 1024px) {
	.takumi-news-section__grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.takumi-news-section__actions {
		justify-content: flex-end;
	}
}

@media (max-width: 980px) {
	.takumi-hero__inner {
		grid-template-columns: 1fr;
		justify-items: stretch;
		min-height: auto;
		padding-block: clamp(8.5rem, 24vw, 10.5rem) 5rem;
		width: min(calc(100% - 2rem), 46rem);
	}

	.takumi-hero-card {
		--tk-hero-corner-cut: 4.6rem;
		grid-column: 1;
		grid-template-columns: 1fr;
		justify-self: stretch;
		min-height: auto;
		padding: 4.8rem clamp(1.6rem, 5vw, 3rem) 3rem;
		width: 100%;
	}
}

@media (max-width: 620px) {
	.takumi-hero {
		height: auto;
		min-height: 100svh;
	}

	.takumi-hero__inner {
		align-items: flex-start;
		padding-block: clamp(9rem, 38vw, 10rem) 4.6rem;
	}

	.takumi-hero-card {
		--tk-hero-corner-cut: 3.8rem;
		--tk-hero-corner-radius: 1.15rem;
		grid-template-areas:
			'title'
			'mark'
			'copy'
			'footer';
		grid-template-columns: 1fr;
		padding: 3.8rem 1.35rem 2rem;
	}

	.takumi-hero-card::before {
		border-radius: var(--tk-hero-corner-radius);
	}

	.takumi-hero-card::after,
	.takumi-hero-card__backing-tab--bottom {
		display: none;
	}

	.takumi-hero-card__fold {
		height: 3.8rem;
		width: 3.8rem;
	}

	.takumi-hero-card__title {
		font-size: clamp(2.35rem, 12vw, 3.35rem);
		max-width: 10.8ch;
	}

	.takumi-hero-card__copy {
		font-size: 0.98rem;
		max-width: none;
	}

	.takumi-hero-card__button {
		min-width: 0;
		width: 100%;
	}
}

@supports not ((backdrop-filter: blur(1rem)) or (-webkit-backdrop-filter: blur(1rem))) {
	.takumi-hero-card {
		background: rgba(251, 251, 248, 0.96);
	}
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
const heroImageSrc = '/img/hero_bg.jpg';
const heroImageStyle = computed(() => ({
	'--tk-hero-image': `url(${heroImageSrc})`,
}));

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
