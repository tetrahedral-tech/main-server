const baseConfig = {
	root: true,
	globals: {
		BigInt: true
	},
	env: {
		es2017: true,
		node: true
	},
	extends: ['airbnb-base', 'prettier', 'plugin:svelte/recommended', 'plugin:svelte/prettier'],
	plugins: [],
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module'
	},
	rules: {
		'no-underscore-dangle': 'off',
		'no-empty': [
			'error',
			{
				allowEmptyCatch: true
			}
		],
		curly: ['error', 'multi'],
		'max-len': [
			'error',
			{
				code: 120
			}
		],
		'no-unused-expressions': [
			'error',
			{
				allowTernary: true,
				allowShortCircuit: true
			}
		],
		'no-console': 'off',
		'no-plusplus': 'off',
		'consistent-return': 'off',
		'arrow-parens': 'off',
		'object-curly-spacing': ['error', 'always'],
		'no-tabs': 'off',
		indent: ['error', 'tab'],
		'operator-linebreak': ['error', 'before'],
		'comma-dangle': ['error', 'never']
	}
};

const importOff = Object.keys(require('eslint-plugin-import').rules).reduce((acc, rule) => {
	acc[`import/${rule}`] = 'off';
	return acc;
}, {});

module.exports = {
	...baseConfig,
	rules: {
		...importOff,
		...baseConfig.rules
	}
};
