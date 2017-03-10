'use strict';

module.exports = app => {
  app.view.use('xtpl', require('./lib/view'));
};
