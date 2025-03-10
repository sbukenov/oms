/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('../../jest/jest.base.config');
module.exports = {
    ...baseConfig,
    globals: {
        PACKAGE_NAME: '',
        PACKAGE_VERSION: '',
    },
};
