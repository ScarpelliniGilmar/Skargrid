import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        console: "readonly",
        process: "readonly",
        // Variáveis globais das features (definidas no build)
        PaginationFeature: "readonly",
        FilterFeature: "readonly",
        SelectFilterFeature: "readonly",
        InputFilterFeature: "readonly",
        VirtualizationFeature: "readonly",
        SortFeature: "readonly",
        SelectionFeature: "readonly",
        SearchFeature: "readonly",
        TableHeaderFeature: "readonly",
        Skargrid: "readonly",
        initColumnConfig: "readonly"
      },
      ecmaVersion: 2022,
      sourceType: "module"
    },
    rules: {
      ...js.configs.recommended.rules,
      // Regras personalizadas para SkarGrid
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-console": "off", // Permitir console.log em desenvolvimento
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "semi": ["error", "always"],
      "quotes": ["error", "single"],
      "indent": ["error", 2],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"]
    }
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.browser
      }
    },
    rules: {
      "no-console": "off", // Permitir console.log nos testes
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^skargrid$" }]
    }
  }
];
