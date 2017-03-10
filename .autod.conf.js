'use strict';

module.exports = {
  write: true,
  prefix: '^',
  test: [
    'test',
  ],
  devdep: [
    'egg',
    'egg-ci',
    'egg-bin',
    'egg-view',
    'autod',
    'eslint',
    'eslint-config-egg',
    'supertest',
    'webstorm-disable-index',
  ],
  exclude: [
    './test/fixtures',
    './docs',
    './coverage',
  ],
  registry: 'https://r.cnpmjs.org',
};
