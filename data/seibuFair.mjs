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
			description: 'Kimono-inspired styling for modest fashion and everyday occasion wear.',
		},
		{
			name: 'Pearl Accessories',
			src: '/img/seibu-fair/pearl-accessories.jpg',
			company: 'Uwajima Pearl',
			description: 'Refined pearl accessories selected for gifting, formal styling, and daily use.',
		},
		{
			name: 'JAPONISM Vegan Soap',
			src: '/img/seibu-fair/japonism-vegan-soap.jpg',
			company: 'JAPONISM',
			description: 'Plant-based personal care with Japanese-inspired fragrance and packaging.',
		},
		{
			name: 'SUZUKAZE Cooling Hijab',
			src: '/img/seibu-fair/suzukaze-cooling-hijab.jpg',
			company: 'Fukushin',
			description: 'Cooling textile styling designed for warm Malaysian weather.',
		},
		{
			name: 'takefumi slippers',
			src: '/img/seibu-fair/takefumi-slippers.jpeg',
			company: 'LITA',
			description: 'Comfort-focused slippers inspired by bamboo texture and home wellness.',
		},
		{
			name: 'Tantoku Knife',
			src: '/img/seibu-fair/tantoku.jpg',
			company: 'Yoshimune Cutlery',
			description: 'A compact Japanese kitchen knife for precise everyday preparation.',
		},
		{
			name: 'YOSHINO Plate',
			src: '/img/seibu-fair/yoshino-plate-large.jpg',
			company: 'SUI-RYU',
			description: 'Large ceramic serving ware with a quiet, refined craft finish.',
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
				'Presents pearl accessories connected to Uwajima coastal craft and elegant occasion styling.',
		},
		{
			name: '由宗刃物',
			description:
				'Introduces Japanese cutlery with a focus on practical kitchen tools and careful finishing.',
		},
		{
			name: 'FITOKIO (TAC & IDCJ Wellness Sdn Bhd)',
			description:
				'Shares wellness-focused lifestyle ideas for visitors interested in care, balance, and daily routines.',
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
				'Features comfort and wellness products including takefumi slippers for relaxed home routines.',
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
				'Introduces selected Japanese products suited to gifting, display, and everyday appreciation.',
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
