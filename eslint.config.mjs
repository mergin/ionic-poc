import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import css from '@eslint/css';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/*.{ts,mts,cts}'],
    extends: tseslint.configs.recommended,
    plugins: { jsdoc: jsdocPlugin },
    rules: {
      'jsdoc/require-jsdoc': [
        'warn',
        {
          contexts: ['FunctionDeclaration', 'MethodDefinition'],
          publicOnly: false,
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
          },
        },
      ],
      'jsdoc/require-param': 'warn',
      'jsdoc/require-returns': 'warn',
      'jsdoc/no-types': 'warn',
    },
  },

  // JSONC files — JSON with comments (tsconfigs, VS Code config, *.jsonc)
  {
    files: ['**/tsconfig*.json', '**/.vscode/*.json', '**/*.jsonc'],
    plugins: { json },
    language: 'json/jsonc',
    extends: ['json/recommended'],
  },

  // JSON files — strict JSON (no comments); tsconfigs and VS Code files excluded above
  {
    files: ['**/*.json'],
    ignores: ['**/tsconfig*.json', '**/.vscode/*.json', '**/*.jsonc'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },

  // CSS files configuration
  { files: ['**/*.css'], plugins: { css }, language: 'css/css', extends: ['css/recommended'] },

  // HTML template files configuration (@angular-eslint v20 flat config)
  {
    files: ['**/*.html'],
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
    },
    languageOptions: {
      parser: angularTemplateParser,
    },
    rules: {
      ...angularTemplatePlugin.configs.recommended.rules,
      ...angularTemplatePlugin.configs.accessibility.rules,
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
      '@angular-eslint/template/prefer-ngsrc': 'warn',
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/cyclomatic-complexity': [
        'error',
        {
          maxComplexity: 10,
        },
      ],
      '@angular-eslint/template/eqeqeq': 'error',
    },
  },
  eslintConfigPrettier,
]);
