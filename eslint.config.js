import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname
});

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
      parser: tsParser,
      globals: {
        React: "readonly"
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react": reactPlugin,
      "react-hooks": reactHooksPlugin,
      "import": importPlugin
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
          moduleDirectory: ["node_modules", "src"]
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"]
        }
      }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-duplicate-imports": "off",
      "import/no-duplicates": "off",
      "no-undef": "error",
      "no-unused-vars": "off",
      "import/no-unresolved": [
        "error",
        { "ignore": ["^geist/"] }
      ],
      "react/prop-types": "off",
      "@next/next/no-img-element": "off",
      "import/named": "error",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "prefer-const": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "import/no-named-as-default-member": "error",
      "react/no-unknown-property": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    }
  },
  // Remove reference to .eslintrc.cjs
];
