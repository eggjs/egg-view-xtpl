'use strict';

module.exports = app => {
  app.get('/fileCache', app.controller.fileCache);
  app.get('/fnCache', app.controller.fnCache);
};
