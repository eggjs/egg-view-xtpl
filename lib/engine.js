'use strict';

const XtplEngine = require('./xtpl');

module.exports = app => {
  const coreLogger = app.loggers.coreLogger;

  const viewPaths = app.config.view.root;
  coreLogger.info('[egg-view-xtpl] loading templates from %j', viewPaths);

  return new XtplEngine(app);
};
