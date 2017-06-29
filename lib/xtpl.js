'use strict';

const Xtemplate = require('xtemplate');
const path = require('path');
const debug = require('debug')('egg-view-xtpl:xtpl');
const fs = require('mz/fs');
const LRU = require('lru-cache');

const INSTANCE_CACHE = Symbol('XTPL#INSTANCECACHE');
const FN_CACHE = Symbol('XTPL#FNCACHE');
const LOADER = Symbol('XTPL#LOADER');

class XtplEngine {
  constructor(app) {
    this.app = app;
    this[INSTANCE_CACHE] = new LRU();
    this[FN_CACHE] = new LRU();
  }

  [LOADER]() {
    const self = this;
    return function loader(tpl, callback) {
      let pathName;
      if (!tpl.parent) {
        pathName = tpl.name = tpl.originalName;
      } else {
        const parentPath = tpl.parent.name;
        const originalName = tpl.originalName;
        pathName = path.join(path.dirname(parentPath), originalName);
        tpl.name = pathName;
      }

      const template = tpl.root;
      const rootConfig = template.config;
      const cache = rootConfig.cache;
      let cached;
      if (cache && (cached = self[FN_CACHE].peek(pathName))) {
        return callback(null, cached);
      }
      fs.readFile(pathName)
        .then(content => {
          if (Buffer.isEncoding(rootConfig.encoding)) {
            content = content.toString(rootConfig.encoding);
          } else {
            content = require('iconv-lite').decode(content, rootConfig.encoding);
          }

          const config = self.app.config.security;

          // auto inject `_csrf` attr to form field, rely on `app.injectCsrf` provided by `security` plugin
          if (!(config.csrf === false || config.csrf.enable === false)) {
            content = self.app.injectCsrf(content);
          }

          // auto inject `nonce` attr to script tag, rely on `app.injectNonce` provided by `security` plugin
          if (!(config.csp === false || config.csp.enable === false)) {
            content = self.app.injectNonce(content);
          }

          const fn = template.compile(content, pathName);
          if (cache) {
            self[FN_CACHE].set(pathName, fn);
          }
          callback(null, fn);
        })
        .catch(callback);
    };
  }

  * render(pathName, data, options) {
    debug('options:', options);

    let fn;
    const cfg = {
      name: pathName,
      loader: { load: this[LOADER]() },
      strict: options.strict,
      catchError: options.catchError,
      cache: options.cache,
      encoding: options.encoding,
    };

    if (!options.cache || !(fn = this[INSTANCE_CACHE].peek(pathName))) {
      debug('create new Xtemplate instance!');
      fn = new Xtemplate(cfg);
      this[INSTANCE_CACHE].set(pathName, fn);
    }

    return yield callback => {
      fn.render(data, { commands: options.commands }, callback);
    };
  }

  * renderString(str, data, options) {
    debug('options:', options);

    const fn = new Xtemplate(str);
    return yield callback => {
      fn.render(data, { commands: options.commands }, callback);
    };
  }
}

module.exports = XtplEngine;
