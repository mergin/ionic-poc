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
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false,
          allowTypedFunctionExpressions: true,
          allowedNames: [
            'ngOnChanges',
            'ngOnInit',
            'ngDoCheck',
            'ngAfterContentInit',
            'ngAfterContentChecked',
            'ngAfterViewInit',
            'ngAfterViewChecked',
            'ngOnDestroy',
          ],
        },
      ],
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignore: [0, 1, -1],
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
          ignoreDefaultValues: true,
          enforceConst: true,
          detectObjects: false,
        },
      ],
      'jsdoc/require-jsdoc': [
        'warn',
        {
          contexts: [
            'FunctionDeclaration',
            'MethodDefinition',
            'TSInterfaceDeclaration',
            'TSTypeAliasDeclaration',
          ],
          publicOnly: false,
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
          },
        },
      ],
      'jsdoc/require-param': 'warn',
      'jsdoc/require-returns': [
        'warn',
        {
          forceRequireReturn: false,
        },
      ],
      'jsdoc/no-types': 'warn',
    },
  },
  {
    files: ['src/app/**/*.ts'],
    ignores: ['src/app/**/*.spec.ts', 'src/app/**/*.render.spec.ts', 'src/app/**/models/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector: "CallExpression[callee.property.name='subscribe']",
          message:
            'Prefer reactive composition with signals/observables in components instead of imperative subscribe calls.',
        },
        {
          selector: "CallExpression[callee.name='toSignal']",
          message:
            'For component HTTP-backed resources, prefer rxResource instead of toSignal/manual loading state wiring.',
        },
        {
          selector: 'TSInterfaceDeclaration',
          message:
            'Declare custom interfaces in the feature local models folder and export them through the models barrel.',
        },
        {
          selector: 'TSTypeAliasDeclaration',
          message:
            'Declare custom type aliases in the feature local models folder and export them through the models barrel.',
        },
      ],
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
