/**
 *
 * create by guorg
 *
 * @flow
 */
const create = require('@lugia/lugia-package-models').default;
const {join} = require('path');
create({importModules: [], projectPath: join(__dirname, '../')})

