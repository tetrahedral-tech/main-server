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
				accent: colors.purple[500],
				section: {
					100: `${colors.gray[500]}3c`, // container gray
					200: `${colors.gray[950]}66`, // sidebar gray
					300: `${colors.gray[950]}99` // main section gray
				}
			},
			borderColor: {
				light: `${colors.gray[500]}33`,
				heavy: `${colors.gray[500]}66`,
				selected: `${colors.gray[400]}cc`,
				suggested: `${colors.gray[500]}cc`
			}
		}
	},
	plugins: []
};
