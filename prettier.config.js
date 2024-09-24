/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
 const config = {
  printWidth: 120,
  singleQuote: true,
  trailingComma: "all",
  tabWidth: 2,
  useTabs: false,
  semi: true,
  bracketSpacing: true,
  arrowParens: "always",
  singleAttributePerLine: true,
  overrides: [
    {
      files: "*.html",
      options: {
        parser: "angular"
      }
    }
  ]
};

export default config;