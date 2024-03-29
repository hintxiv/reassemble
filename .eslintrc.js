// Ganked this almost entirely from https://github.com/xivanalysis/xivanalysis/blob/master/.eslintrc.js
// Thanks ackwell :)

module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:import/errors',
        'plugin:import/typescript',
    ],

    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'react',
        'react-hooks',
        'import',
    ],

    settings: {
        react: { version: 'detect' },
        'import/resolver': {
            typescript: { alwaysTryTypes: true },
        },
    },

    env: {
        browser: true,
        commonjs: true,
        es6: true,
    },

    globals: {
        // process.env injected by webpack
        process: true,
    },

    rules: {
        // Disabled recommended rules
        'default-case': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',

        // Primary shared rules
        'array-bracket-spacing': 'warn',
        '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
        '@typescript-eslint/ban-types': ['error', {
            extendDefaults: true,
            types: {
                // Disable object type bans, they're pretty heavily used upstream.
                Object: false,
                '{}': false,
                object: false,
            },
        }],
        'block-spacing': 'warn',
        'brace-style': ['error', '1tbs', { allowSingleLine: true }],
        'comma-dangle': ['error', 'always-multiline'],
        'comma-spacing': 'warn',
        'comma-style': 'warn',
        'computed-property-spacing': 'warn',
        'curly': ['error', 'all'],
        'dot-notation': 'error',
        'eol-last': 'error',
        'eqeqeq': ['error', 'smart'],
        'func-call-spacing': 'warn',
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        'indent': ['error', 4],
        'jsx-quotes': 'error',
        'key-spacing': ['warn', { mode: 'minimum' }],
        'keyword-spacing': 'warn',
        'linebreak-style': ['error', 'unix'],
        'newline-per-chained-call': ['warn', { ignoreChainWithDepth: 3 }],
        'new-parens': 'error',
        'no-alert': 'error',
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'no-duplicate-imports': 'error',
        'no-else-return': ['error', { allowElseIf: false }],
        'no-implicit-globals': 'error',
        'no-lonely-if': 'error',
        '@typescript-eslint/no-magic-numbers': ['warn', {
            ignoreArrayIndexes: true,
            ignoreDefaultValues: true,
            ignoreEnums: true,
            ignoreReadonlyClassProperties: true,
            ignore: [
                -1,
                0,
                1,
                2,
                100,
                1000,
            ],
        }],
        'no-multiple-empty-lines': ['warn', { max: 1, maxBOF: 0, maxEOF: 1 }],
        'no-return-await': 'error',
        'no-trailing-spaces': 'error',
        'no-unneeded-ternary': 'error',
        '@typescript-eslint/no-unused-vars': ['error', {
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
        }],
        'no-useless-rename': 'error',
        'no-var': 'error',
        'no-whitespace-before-property': 'warn',
        'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
        'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
        'prefer-const': 'warn',
        'prefer-spread': 'error',
        'semi': ['error', 'never'],
        'space-before-blocks': 'warn',
        'space-in-parens': 'warn',
        'template-curly-spacing': ['warn', 'never'],
        '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
        'yoda': ['error', 'never', { exceptRange: true }],

        // Imports
        'import/first': 'error',
        'import/order': ['error', {
            groups: [
                // Pull non-relative imports above relative
                ['builtin', 'external', 'internal', 'unknown', 'index', 'object'],
            ],
            'newlines-between': 'never',
            alphabetize: { order: 'asc', caseInsensitive: true },
        }],

        // React-specific rules
        'react/display-name': 'off',
        'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
        'react/no-children-prop': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
    },

    overrides: [
        // TypeScript files
        {
            files: ['**/*.ts?(x)'],
            rules: {
                // TypeScript provides this as part of its type system, much better than lint can.
                'no-undef': 'off',
            },
        },
        // Data / job / math files
        {
            files: ['src/data/**/*.ts?(x)', 'src/simulator/entity/player/jobs/*.ts?(x)', 'src/math/**/*.ts?(x)'],
            rules: {
                // Data (and math functions) inherently contain a lot of magic numbers
                // Be gentle with job logic too... For now
                '@typescript-eslint/no-magic-numbers': 'off',
            },
        },
    ],
}
