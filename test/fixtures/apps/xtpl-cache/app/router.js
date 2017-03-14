'use strict';

module.exports = app => {
  app.get('/fnCache', app.controller.fnCache);
};
