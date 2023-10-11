/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Jetbrains Mono"', 'monospace']
			},
			colors: {
				accent: colors.purple[500]
			}
		}
	},
	plugins: []
};
