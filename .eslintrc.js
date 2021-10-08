/* eslint-env node */

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "prefer-template": "error",
    "no-trailing-spaces": "error",
    "prefer-const": ["error", {
      destructuring: "all",
      ignoreReadBeforeAssign: true,
    }],
    "@typescript-eslint/member-delimiter-style": "error",
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/semi": "error",
    "quote-props": ["error", "consistent-as-needed"],
    "@typescript-eslint/quotes": ["error", "double"],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/comma-dangle": ["error", {
      arrays: "always-multiline",
      objects: "always-multiline",
      imports: "never",
      exports: "never",
      functions: "never",
    }],
  },
};