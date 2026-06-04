module.exports = {
	plugins: [require('daisyui')],
	darkMode: 'media',
	theme: {
		colors: {
			transparent: 'transparent',
		},
		extend: {
			fontFamily: {
				montserrat: ['Montserrat'],
				'Open Sans': ['OpenSans'],
			},
		},
	},

	daisyui: {
		themes: [
			{
				light: {
					primary: '#772c1a',
					secondary: '#333',
					accent: '#3d4451',
					neutral: '#f5f7fa',
					'base-100': '#ffffff',
					'base-300': '#465356',
				},
			},
		],
	},
};
