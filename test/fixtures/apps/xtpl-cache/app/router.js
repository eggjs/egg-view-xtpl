'use strict';

module.exports = function(app) {
  app.get('/cache', app.controller.cache);
  app.get('/cacheString', app.controller.cacheString);
};
