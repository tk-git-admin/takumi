export const seibuFairEvent = {
	route: '/seibu-fair',
	title: 'The Art of Japan',
	subtitle: 'Craft & Culture',
	host: 'TAKUMI International x SEIBU TRX',
	intro:
		'A focused showcase of Japanese craft, lifestyle goods, and cultural workshops at SEIBU TRX.',
	dates: {
		year: 2026,
		range: 'June 19-30, 2026',
		badge: '6/19-6/30',
	},
	venue: 'TRX SEIBU, Level 2 Event Hall, Kuala Lumpur',
	admission: 'Free admission',
	stats: {
		exhibitors: 14,
		products: 50,
		experiences: 3,
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
		'Takumi International',
		'宇和海真珠',
		'由宗刃物',
		'FITOKIO (TAC & IDCJ Wellness Sdn Bhd)',
		'YOU&ME DSPH SDN BHD',
		'株式会社SUI-RYU',
		'wawawa 和輪笑',
		'QLOGO (クロゴ)',
		'株式会社LITA',
		'株式会社JAPONISM',
		'株式会社クレオ',
		'株式会社ezu',
		'株式会社フクシン',
		'テイラーズ大学',
	].map((name, index) => ({
		id: `exhibitor-${index + 1}`,
		name,
		description:
			index === 0
				? 'Japanese craft, lifestyle, and cultural products curated for visitors in Malaysia.'
				: 'Dummy company introduction for the SEIBU fair frontend preview.',
	})),
	experiences: [
		{
			id: 'yukata',
			name: 'Yukata Dressing',
			label: '浴衣',
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
			label: '折り紙',
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
			label: 'カラー',
			time: '11:00-12:00',
			description: 'A specialist introduces styling ideas inspired by traditional Japanese colors.',
			sessions: [
				{ id: 'color-2026-06-20', date: 'June 20 (Sat)', booked: 7, capacity: 15 },
				{ id: 'color-2026-06-21', date: 'June 21 (Sun)', booked: 13, capacity: 15 },
			],
		},
	],
};
