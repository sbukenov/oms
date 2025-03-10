const { readFileSync } = require('fs');
const { resolve } = require('path');

module.exports = function (api) {
    api.cache(false);
    const { version, name } = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), { encoding: 'utf-8' }));
    return {
        presets: ['@babel/preset-typescript', '@babel/preset-react'],
        plugins: [
            [
                'transform-define',
                {
                    PACKAGE_VERSION: version,
                    PACKAGE_NAME: name,
                },
            ],
            [
                'module-resolver',
                {
                    root: [resolve('./')],
                    alias: {
                        '~': './src',
                    },
                },
            ],
            '@quickbaseoss/babel-plugin-styled-components-css-namespace',
        ],
        ignore: [
            '**/__tests__/**',
            '**/__snapshots__/**',
            'src/**/*.spec.tsx',
            'src/**/*.test.tsx',
            'src/**/*.spec.ts',
            'src/**/*.test.ts',
            'src/**/*.d.ts',
        ],
    };
};
