'use strict';

module.exports = app => {
  app.get('/', app.controller.home);
  app.get('/noExt', app.controller.noExt);
  app.get('/str', app.controller.string);
  app.get('/strHtml', app.controller.stringHtml);
  app.get('/error', app.controller.error);
  app.get('/strError', app.controller.strError);
};
