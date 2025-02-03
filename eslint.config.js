import eslint from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tseslintParser from '@typescript-eslint/parser'

export default [
	eslint.configs.recommended,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tseslintParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module'
			},
			globals: {
				document: 'readonly',
				window: 'readonly',
				HTMLElement: 'readonly',
				test: 'readonly',
				expect: 'readonly',
			}
		},
		plugins: {
			'@typescript-eslint': tseslint
		},
		rules: {
			'semi': ['error', 'never'],
			'@typescript-eslint/no-unused-vars': 'off',
			'no-unused-vars': 'off'
		},
	}
]