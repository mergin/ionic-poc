/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-angular'],

  rules: {
    // Keep commit types consistent and changelog-friendly
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'test', 'refactor', 'perf', 'build', 'ci', 'chore', 'revert'],
    ],
    'type-case': [2, 'always', 'lower-case'],

    // Scopes reflect the three projects in this monorepo + shared concerns
    'scope-enum': [
      2,
      'always',
      [
        'app', // app/ (Ionic code)
        'mocks', // mocks/ (shared MSW handlers & fixture data)
        'deps', // dependency updates
        'ci', // CI/CD pipeline
        'release', // version bumps / changelogs
        'e2e', // end-to-end tests
        'docs', // project docs and guides
        'weather', // weather feature/domain
        'social', // social-media feature/domain
        'gallery', // image gallery feature/domain
        'i18n', // translations and locale behavior
        'scripts', // automation scripts
        'theme', // app theming/styles
      ],
    ],

    // Allow omitting a scope (e.g. "chore: bump node version")
    'scope-empty': [0],

    // Keep subjects concise and avoid sentence punctuation in summaries
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],

    // Encourage concise commit headers
    'header-max-length': [2, 'always', 100],
  },
};
