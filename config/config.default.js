'use strict';

module.exports = () => {
  const config = {};

  /**
   * xtpl default config
   * @member Config#xtpl
   * @property {Boolean} cache - whether or not to cache the render result.
   * @property {String} loadpath - the path to load view files.default to `true` except `false` at local env.
   */
  config.xtpl = {
    cache: true,
    catchError: process.env.NODE_ENV !== 'production',
    encoding: 'utf-8',
  };

  return config;
};
