import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import importX from 'eslint-plugin-import-x'
import boundaries from 'eslint-plugin-boundaries'
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'

const fsdLayers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']

export default tseslint.config(
  { ignores: ['dist', 'src/app/routeTree.gen.ts', 'public/mockServiceWorker.js'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import-x': importX,
      boundaries,
      prettier,
    },
    settings: {
      'import-x/resolver': {
        typescript: true,
      },
      'boundaries/root-path': 'src',
      'boundaries/elements': [
        { type: 'app', pattern: 'app/*' },
        { type: 'pages', pattern: 'pages/*', capture: ['slice'] },
        { type: 'widgets', pattern: 'widgets/*', capture: ['slice'] },
        { type: 'features', pattern: 'features/*', capture: ['slice'] },
        { type: 'entities', pattern: 'entities/*', capture: ['slice'] },
        { type: 'shared', pattern: 'shared/*' },
        { type: 'mocks', pattern: 'mocks/*' },
        { type: 'routes', pattern: 'routes/*' },
      ],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'prettier/prettier': 'warn',

      'import-x/no-cycle': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never',
          alphabetize: { order: 'asc' },
        },
      ],

      // Feature-Sliced Design layer isolation:
      // higher layers may import lower layers, never the other way round.
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            { from: 'app', allow: fsdLayers },
            { from: 'routes', allow: fsdLayers },
            { from: 'pages', allow: ['widgets', 'features', 'entities', 'shared'] },
            { from: 'widgets', allow: ['features', 'entities', 'shared'] },
            { from: 'features', allow: ['entities', 'shared'] },
            { from: 'entities', allow: ['shared'] },
            { from: 'shared', allow: ['shared'] },
            { from: 'mocks', allow: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'] },
          ],
        },
      ],
      // Cross-slice imports must go through the slice's public API (index.ts).
      'boundaries/entry-point': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              target: ['pages', 'widgets', 'features', 'entities'],
              allow: 'index.ts',
            },
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
)
