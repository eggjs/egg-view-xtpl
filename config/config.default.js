'use strict';

const path = require('path');

module.exports = appInfo => {
  const config = {};

  /**
   * xtpl default config
   * @member Config#xtpl
   * @property {Boolean} cache - whether or not to cache the render result.
   * @property {String} loadpath - the path to load view files.default to `true` except `false` at local env.
   */
  config.view = {
    cache: true,
    loadpath: path.join(appInfo.baseDir, 'app', 'view'),
  };

  return config;
};
