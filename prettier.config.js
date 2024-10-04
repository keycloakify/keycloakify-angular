/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
    printWidth: 90,
    singleQuote: true,
    trailingComma: 'none',
    tabWidth: 4,
    useTabs: false,
    semi: true,
    bracketSpacing: true,
    arrowParens: 'avoid',
    singleAttributePerLine: true,
    overrides: [
        {
            files: '*.component.ts',
            options: {
                printWidth: 150
            }
        },
        {
            files: '*.html',
            options: {
                parser: 'angular',
                printWidth: 150
            }
        }
    ]
};

export default config;
