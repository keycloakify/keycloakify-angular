// @ts-check
import eslint from '@eslint/js';
import angular from 'angular-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
    {
        ignores: ['src/bin/**/*'],
        files: ['**/*.ts'],
        plugins: {
            prettier: eslintPluginPrettier,
            'unused-imports': unusedImports,
            '@typescript-eslint': tseslint.plugin
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: true
            }
        },
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommended,
            tseslint.configs.stylistic,
            angular.configs.tsRecommended
        ],
        processor: angular.processInlineTemplates,
        rules: {
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    disallowTypeAnnotations: true,
                    fixStyle: 'inline-type-imports',
                    prefer: 'type-imports'
                }
            ],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true
                }
            ],
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/consistent-indexed-object-style': 'off',
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'kc',
                    style: 'camelCase'
                }
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'kc',
                    style: 'kebab-case'
                }
            ],
            '@angular-eslint/no-output-rename': 'off',
            '@angular-eslint/no-input-rename': 'off',
            ...eslintConfigPrettier.rules,
            'prettier/prettier': ['error']
        }
    },
    {
        files: ['**/*.html'],
        plugins: {
            prettier: eslintPluginPrettier
        },
        extends: [angular.configs.templateRecommended],
        rules: {
            ...eslintConfigPrettier.rules,
            'prettier/prettier': ['error', { parser: 'angular' }]
        }
    }
);
