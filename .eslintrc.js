module.exports = {
  extends: ["next/core-web-vitals", "@typescript-eslint/recommended", "plugin:accessibility/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "accessibility"],
  rules: {
    // Performance rules
    "react-hooks/exhaustive-deps": "error",
    "react/no-unstable-nested-components": "error",

    // TypeScript rules
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/prefer-const": "error",

    // Accessibility rules
    "accessibility/alt-text": "error",
    "accessibility/anchor-has-content": "error",
    "accessibility/aria-props": "error",
    "accessibility/aria-proptypes": "error",
    "accessibility/aria-unsupported-elements": "error",
    "accessibility/role-has-required-aria-props": "error",
    "accessibility/role-supports-aria-props": "error",

    // Security rules
    "react/no-danger": "warn",
    "react/jsx-no-target-blank": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
}
