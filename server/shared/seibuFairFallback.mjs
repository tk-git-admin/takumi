export const seibuFairEvent = {
	route: '/seibu-fair',
	title: 'The Art of Japan',
	subtitle: 'Craft & Culture',
	host: 'TAKUMI International x SEIBU TRX',
	intro:
		'A focused showcase of Japanese craft, lifestyle goods, and free cultural workshops at SEIBU TRX.',
	productIntro:
		'Browse selected craft, lifestyle, wellness, and tableware pieces from the participating brands before visiting the Level 2 Event Hall.',
	dates: {
		year: 2026,
		range: 'June 19-30, 2026',
		badge: '6/19-6/30',
	},
	venue: 'TRX SEIBU, Level 2 Event Hall, Kuala Lumpur',
	admission: 'Free admission',
	posterAsset: {
		name: 'SEIBU fair poster',
		src: '/img/seibu-fair/seibu-panora-june-final.jpeg',
	},
	stats: {
		exhibitors: 15,
		products: 50,
		experiences: 4,
	},
	announcement: {
		to: '/seibu-fair',
		label: '19-30 Jun 2026',
		title: 'SEIBU Fair',
		actionLabel: 'View event',
	},
	productAssets: [
		{
			name: 'Kimono Hijab',
			src: '/img/seibu-fair/kimono-hijab.jpg',
			company: 'Takumi International',
		},
		{
			name: 'Pearl Accessories',
			src: '/img/seibu-fair/pearl-accessories.jpg',
			company: 'Uwajima Pearl',
		},
		{
			name: 'JAPONISM Vegan Soap',
			src: '/img/seibu-fair/japonism-vegan-soap.jpg',
			company: 'JAPONISM',
		},
		{
			name: 'SUZUKAZE Cooling Hijab',
			src: '/img/seibu-fair/suzukaze-cooling-hijab.jpg',
			company: 'Fukushin',
		},
		{
			name: 'takefumi slippers',
			src: '/img/seibu-fair/takefumi-slippers.jpeg',
			company: 'LITA',
		},
		{
			name: 'Tantoku Knife',
			src: '/img/seibu-fair/tantoku.jpg',
			company: 'Yoshimune Cutlery',
		},
		{
			name: 'YOSHINO Plate',
			src: '/img/seibu-fair/yoshino-plate-large.jpg',
			company: 'SUI-RYU',
		},
	],
	exhibitors: [
		{
			name: 'Takumi International',
			description:
				'Curates Japanese craft, lifestyle goods, and cultural experiences for visitors in Malaysia.',
		},
		{
			name: '宇和海真珠',
			description:
				'Presents pearl accessories connected to Uwajima coastal craft and refined occasion styling.',
		},
		{
			name: '由宗刃物',
			description:
				'Introduces Japanese cutlery focused on practical kitchen tools and careful finishing.',
		},
		{
			name: 'FITOKIO (TAC & IDCJ Wellness Sdn Bhd)',
			description:
				'Shares wellness-focused lifestyle goods for daily care, balance, and home routines.',
		},
		{
			name: 'YOU&ME DSPH SDN BHD',
			description:
				'Brings selected lifestyle goods for families, gifting, and everyday cultural discovery.',
		},
		{
			name: '株式会社SUI-RYU',
			description:
				'Shows dining and tableware pieces shaped for calm presentation and refined entertaining.',
		},
		{
			name: 'wawawa 和輪笑',
			description:
				'Highlights approachable Japanese lifestyle goods with a warm community-minded point of view.',
		},
		{
			name: 'QLOGO (クロゴ)',
			description:
				'Presents design-led goods and brand expressions that connect Japanese ideas with local audiences.',
		},
		{
			name: '株式会社LITA',
			description:
				'Features comfort and wellness products for relaxed home routines and everyday use.',
		},
		{
			name: '株式会社JAPONISM',
			description:
				'Offers personal-care items that pair Japanese sensibility with gentle daily-use formulations.',
		},
		{
			name: '株式会社クレオ',
			description:
				'Presents curated lifestyle items for visitors exploring Japanese goods and cultural details.',
		},
		{
			name: '株式会社ezu',
			description:
				'Introduces selected Japanese products suited to gifting, display, and daily appreciation.',
		},
		{
			name: '株式会社フクシン',
			description:
				'Shares textile and cooling-wear ideas made for comfort, function, and seasonal styling.',
		},
		{
			name: 'テイラーズ大学',
			description:
				'Joins as an education partner supporting cultural exchange and hands-on event participation.',
		},
	].map((exhibitor, index) => ({
		id: `exhibitor-${index + 1}`,
		...exhibitor,
	})),
	experiences: [
		{
			id: 'yukata',
			name: 'Yukata Dressing',
			label: '',
			time: '13:00-14:00',
			description:
				'Guided yukata dressing with an opportunity for a commemorative photo after styling.',
			sessions: [
				{ id: 'yukata-2026-06-20', date: 'June 20 (Sat)', booked: 9, capacity: 15 },
				{ id: 'yukata-2026-06-21', date: 'June 21 (Sun)', booked: 12, capacity: 15 },
				{ id: 'yukata-2026-06-27', date: 'June 27 (Sat)', booked: 6, capacity: 15 },
				{ id: 'yukata-2026-06-28', date: 'June 28 (Sun)', booked: 14, capacity: 15 },
			],
		},
		{
			id: 'origami',
			name: 'Origami Workshop',
			label: '',
			time: '15:00-16:00',
			description:
				'A hands-on origami class for children and adults. Guests can take completed works home.',
			sessions: [
				{ id: 'origami-2026-06-20', date: 'June 20 (Sat)', booked: 5, capacity: 15 },
				{ id: 'origami-2026-06-21', date: 'June 21 (Sun)', booked: 8, capacity: 15 },
				{ id: 'origami-2026-06-27', date: 'June 27 (Sat)', booked: 11, capacity: 15 },
				{ id: 'origami-2026-06-28', date: 'June 28 (Sun)', booked: 15, capacity: 15 },
			],
		},
		{
			id: 'color',
			name: 'Color Coordination',
			label: '',
			time: '11:00-12:00',
			description: 'A specialist introduces styling ideas inspired by traditional Japanese colors.',
			sessions: [
				{ id: 'color-2026-06-20', date: 'June 20 (Sat)', booked: 7, capacity: 15 },
				{ id: 'color-2026-06-21', date: 'June 21 (Sun)', booked: 13, capacity: 15 },
			],
		},
	],
};

const seibuFairJapaneseProductCopy = [
	{ name: '着物ヒジャブ', company: 'タクミインターナショナル' },
	{ name: '真珠アクセサリー', company: '宇和海真珠' },
	{ name: 'ジャポニズム ヴィーガン石鹸', company: 'ジャポニズム' },
	{ name: 'スズカゼ クーリングヒジャブ', company: 'フクシン' },
	{ name: 'テイクフミ スリッパ', company: 'リタ' },
	{ name: '短刀包丁', company: '由宗刃物' },
	{ name: 'ヨシノ プレート', company: 'スイリュウ' },
];

const seibuFairJapaneseExhibitorCopy = [
	{
		name: 'タクミインターナショナル',
		description: '日本の工芸品、生活雑貨、文化体験をマレーシアの来場者へ紹介します。',
	},
	{
		name: '宇和海真珠',
		description: '宇和島の海辺のものづくりにゆかりのある真珠アクセサリーを紹介します。',
	},
	{
		name: '由宗刃物',
		description: '日々の調理で使いやすい刃物と、丁寧な仕上げの台所道具を紹介します。',
	},
	{
		name: 'フィトキオ',
		description: '毎日のケア、整える時間、住まいの過ごし方に寄り添う商品を紹介します。',
	},
	{
		name: 'ユーアンドミー',
		description: '家族、贈り物、日常の発見に向いた生活雑貨を選んで紹介します。',
	},
	{
		name: '株式会社スイリュウ',
		description: '落ち着いた食卓づくりと上品なおもてなしに合う器や食卓用品を紹介します。',
	},
	{
		name: '和輪笑',
		description: '親しみやすく、地域の交流にもつながる日本の生活雑貨を紹介します。',
	},
	{
		name: 'クロゴ',
		description: '日本らしい発想を現地の来場者へ届ける、デザイン性のある商品を紹介します。',
	},
	{
		name: '株式会社リタ',
		description: '住まいでのくつろぎと毎日の健康感に寄り添う快適な商品を紹介します。',
	},
	{
		name: '株式会社ジャポニズム',
		description: '日本らしい感性とやさしい使い心地を合わせた日用品を紹介します。',
	},
	{
		name: '株式会社クレオ',
		description: '日本の商品や文化の細やかさに触れられる生活雑貨を選んで紹介します。',
	},
	{
		name: '株式会社エズ',
		description: '贈り物、飾り、日常使いに向いた選りすぐりの商品を紹介します。',
	},
	{
		name: '株式会社フクシン',
		description: '快適さ、機能性、季節の装いを意識した繊維商品を紹介します。',
	},
	{
		name: 'テイラーズ大学',
		description: '文化交流と体験型イベントを支える教育連携先として参加します。',
	},
];

const seibuFairJapaneseExperienceCopy = {
	yukata: {
		name: '浴衣着付け',
		label: '浴衣',
		description: '浴衣の着付けを体験し、着付け後に記念撮影も楽しめます。',
		sessions: {
			'yukata-2026-06-20': { date: '6月20日(土)' },
			'yukata-2026-06-21': { date: '6月21日(日)' },
			'yukata-2026-06-27': { date: '6月27日(土)' },
			'yukata-2026-06-28': { date: '6月28日(日)' },
		},
	},
	origami: {
		name: '折り紙ワークショップ',
		label: '折り紙',
		description: 'お子様から大人まで参加できる折り紙体験です。完成した作品はお持ち帰りいただけます。',
		sessions: {
			'origami-2026-06-20': { date: '6月20日(土)' },
			'origami-2026-06-21': { date: '6月21日(日)' },
			'origami-2026-06-27': { date: '6月27日(土)' },
			'origami-2026-06-28': { date: '6月28日(日)' },
		},
	},
	color: {
		name: 'カラーコーディネート',
		label: 'カラー',
		description: '日本の伝統色に着想を得たスタイリングの考え方を専門スタッフが紹介します。',
		sessions: {
			'color-2026-06-20': { date: '6月20日(土)' },
			'color-2026-06-21': { date: '6月21日(日)' },
		},
	},
};

function clone(value) {
	return JSON.parse(JSON.stringify(value));
}

function resolveLocale(locale = 'en') {
	return String(locale).toLowerCase().startsWith('ja') ? 'ja' : 'en';
}

export function getSeibuFairEvent(locale = 'en') {
	const event = clone(seibuFairEvent);

	if (resolveLocale(locale) !== 'ja') {
		return event;
	}

	return {
		...event,
		title: '日本の美',
		subtitle: '工芸と文化',
		host: 'タクミインターナショナル × 西武トラックス',
		intro:
			'西武トラックスで日本の工芸、ライフスタイル商品、無料の文化体験を紹介します。',
		productIntro:
			'2階イベントホールで展示される工芸品、ライフスタイル、ウェルネス、テーブルウェア商品をご覧ください。',
		dates: {
			...event.dates,
			range: '2026年6月19日〜30日',
			badge: '6/19〜6/30',
		},
		venue: 'クアラルンプール 西武トラックス 2階イベントホール',
		admission: '入場無料',
		posterAsset: {
			...event.posterAsset,
			name: '西武フェアポスター',
		},
		announcement: {
			...event.announcement,
			label: '2026年6月19日〜30日',
			title: '西武フェア',
			actionLabel: 'イベントを見る',
		},
		productAssets: event.productAssets.map((asset, index) => ({
			...asset,
			...(seibuFairJapaneseProductCopy[index] || {}),
		})),
		exhibitors: event.exhibitors.map((exhibitor, index) => ({
			...exhibitor,
			...(seibuFairJapaneseExhibitorCopy[index] || {}),
		})),
		experiences: event.experiences.map((experience) => {
			const copy = seibuFairJapaneseExperienceCopy[experience.id] || {};
			const sessions = copy.sessions || {};

			return {
				...experience,
				...copy,
				sessions: experience.sessions.map((session) => ({
					...session,
					...(sessions[session.id] || {}),
				})),
			};
		}),
	};
}
