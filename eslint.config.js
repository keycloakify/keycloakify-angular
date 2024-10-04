// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
    {
        files: ['src/**/*.ts'],
        plugins: {
            prettier: eslintPluginPrettier,
            'unused-imports': unusedImports
        },
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.stylistic,
            ...angular.configs.tsRecommended
        ],
        processor: angular.processInlineTemplates,
        rules: {
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-namespace': 'off',
            'no-duplicate-imports': 'error',
            'no-unused-private-class-members': 'error',
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
            ...eslintConfigPrettier.rules,
            'prettier/prettier': [
                'error',
                {},
                {
                    usePrettierrc: true
                }
            ]
        }
    },
    {
        files: ['src/**/*.html'],
        plugins: {
            prettier: eslintPluginPrettier
        },
        extends: [...angular.configs.templateRecommended],
        rules: {
            '@angular-eslint/template/interactive-supports-focus': 'off',
            '@angular-eslint/template/click-events-have-key-events': 'off',
            '@angular-eslint/template/label-has-associated-control': 'off',
            '@angular-eslint/template/no-autofocus': 'off',
            '@angular-eslint/template/no-call-expression': 'off',
            '@angular-eslint/template/prefer-control-flow': 'warn',
            '@angular-eslint/template/alt-text': 'error',
            '@angular-eslint/template/attributes-order': 'error',
            '@angular-eslint/template/banana-in-box': 'error',
            '@angular-eslint/template/button-has-type': 'off',
            '@angular-eslint/template/conditional-complexity': [
                'error',
                {
                    maxComplexity: 10
                }
            ],
            '@angular-eslint/template/cyclomatic-complexity': 'error',
            '@angular-eslint/template/elements-content': 'error',
            '@angular-eslint/template/eqeqeq': 'error',
            '@angular-eslint/template/i18n': 'off',
            '@angular-eslint/template/no-distracting-elements': 'error',
            '@angular-eslint/template/no-duplicate-attributes': 'error',
            '@angular-eslint/template/no-inline-styles': 'off',
            '@angular-eslint/template/no-interpolation-in-attributes': 'error',
            '@angular-eslint/template/no-negated-async': 'error',
            '@angular-eslint/template/no-positive-tabindex': 'off',
            '@angular-eslint/template/prefer-ngsrc': 'off',
            '@angular-eslint/template/prefer-self-closing-tags': 'error',
            '@angular-eslint/template/role-has-required-aria': 'off',
            '@angular-eslint/template/table-scope': 'error',
            '@angular-eslint/template/use-track-by-function': 'off',
            '@angular-eslint/template/valid-aria': 'error',
            ...eslintConfigPrettier.rules,
            'prettier/prettier': [
                'error',
                { parser: 'angular' },
                {
                    usePrettierrc: true
                }
            ]
        }
    }
);
