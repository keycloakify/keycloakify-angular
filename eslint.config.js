// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import { fixupPluginRules } from '@eslint/compat';
import { configs, rules } from 'eslint-plugin-storybook';
import prettier from 'eslint-plugin-prettier';

const storybook = fixupPluginRules({
  rules,
  configs,
  meta: { name: 'stroybook', version: '0.8.0' },
});

export default tseslint.config(
  {
    files: ['*.stories.@(ts|tsx|js|jsx|mjs|cjs)', '*.story.@(ts|tsx|js|jsx|mjs|cjs)'],
    plugins: {
      storybook,
      prettier,
    },
    rules: {
      'import/no-anonymous-default-export': 'off',
      'storybook/await-interactions': 'error',
      'storybook/context-in-play-function': 'error',
      'storybook/default-exports': 'error',
      'storybook/hierarchy-separator': 'warn',
      'storybook/no-redundant-story-name': 'warn',
      'storybook/prefer-pascal-case': 'warn',
      'storybook/story-exports': 'error',
      'storybook/use-storybook-expect': 'error',
      'storybook/use-storybook-testing-library': 'error',
      'prettier/prettier': ['error', {}],
    },
  },
  {
    files: ['.storybook/main.@(js|cjs|mjs|ts)'],
    plugins: {
      storybook,
      prettier,
    },
    rules: {
      'storybook/no-uninstalled-addons': 'error',
      'prettier/prettier': [
        'error',
        {},
        {
          usePrettierrc: true,
        },
      ],
    },
  },
  {
    files: ['**/*.ts'],
    plugins: {
      prettier,
    },
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...tseslint.configs.stylistic, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'kc',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'kc',
          style: 'kebab-case',
        },
      ],
      'prettier/prettier': [
        'error',
        {},
        {
          usePrettierrc: true,
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      prettier,
    },
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/label-has-associated-control': 'off',
      '@angular-eslint/template/no-autofocus': 'off',
      'prettier/prettier': [
        'error',
        { parser: 'angular' },
        {
          usePrettierrc: true,
        },
      ],
    },
  },
);
