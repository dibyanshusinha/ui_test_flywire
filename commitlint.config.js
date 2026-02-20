export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed commit types
    'type-enum': [
      2,
      'always',
      [
        'feat',     // new user-facing feature
        'fix',      // bug fix
        'docs',     // documentation only
        'style',    // formatting, whitespace — no logic change
        'refactor', // code restructure, no feature or fix
        'test',     // adding or updating tests
        'chore',    // deps, config, tooling, CI
        'perf',     // performance improvement
        'ci',       // CI/CD pipeline changes
        'revert',   // reverting a previous commit
      ],
    ],
    // Subject must not start with an uppercase letter or sentence case
    'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
    // Keep subject under 100 characters
    'subject-max-length': [2, 'always', 100],
    // Do not end the subject with a period
    'subject-full-stop': [2, 'never', '.'],
    // Body lines must not exceed 100 characters
    'body-max-line-length': [2, 'always', 100],
  },
};
