import globals from 'globals'
import eslint from '@eslint/js'
import recommended from 'eslint-plugin-react/configs/recommended.js'
import tseslint from 'typescript-eslint'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import { fixupPluginRules } from '@eslint/compat'

export default tseslint.config({
  files: ['**/*.{ts,tsx}'],
  extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
  ignores: ['node_modules/*', 'build/*'],
  ...recommended,
  languageOptions: {
    ...recommended.languageOptions,
    globals: {
      ...globals.browser
    }
  },
  plugins: {
    ...recommended.plugins,
    'react-hooks': fixupPluginRules(eslintPluginReactHooks),
    reactRefresh
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    'react/jsx-key': 1,
    '@typescript-eslint/no-empty-function': 1,
    'reactRefresh/only-export-components': 1,
    ...eslintPluginReactHooks.configs.recommended.rules,
    'react-hooks/exhaustive-deps': 0
  }
})
