/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Jetbrains Mono"', 'monospace']
			},
			colors: {
				'accent':'' // @TODO put an accent color later
			}
		}
	},
	plugins: []
};
