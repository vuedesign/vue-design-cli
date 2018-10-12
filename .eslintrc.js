// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    env: {
        browser: true
    },
    extends: [
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        'standard'
    ],
    "overrides": [
        {
            "files": ["*.js","*.json"],
            "rules": {
                "no-unused-expressions": "off"
            }
        }
    ],
    // add your custom rules here
    rules: {
        'no-useless-constructor': 'off',
        'semi': ['error', 'always'],
        'indent': ['error', 4],
        'space-before-function-paren': ['error', 'never'],
        // allow async-await
        'generator-star-spacing': 'off',
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
}
