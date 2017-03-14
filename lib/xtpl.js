'use strict';

const Xtemplate = require('xtemplate');
const debug = require('debug')('egg-view-xtpl:xtpl');
const fs = require('mz/fs');
const LRU = require('lru-cache');
const copy = require('copy-to');

const INSTANCECACHESYMBOL = Symbol('XTPL#INSTANCECACHE');
const FNCACHESYMBOL = Symbol('XTPL#FNCACHE');
const LOADERSYMBOL = Symbol('XTPL#LOADER');

const defaultOptions = {
  catchError: process.env.NODE_ENV !== 'production',
  encoding: 'utf-8',
};

class XtplEngine {
  constructor() {
    this[INSTANCECACHESYMBOL] = new LRU();
    this[FNCACHESYMBOL] = new LRU();
  }

  [LOADERSYMBOL]() {
    const self = this;
    return function loader(tpl, callback) {
      const template = tpl.root;
      const pathname = tpl.name;
      const rootConfig = template.config;
      const cache = rootConfig.cache;

      if (cache && self[FNCACHESYMBOL].has(pathname)) {
        return callback(null, self[FNCACHESYMBOL].get(pathname));
      }

      fs.readFile(pathname)
        .then(content => {
          if (Buffer.isEncoding(rootConfig.encoding)) {
            content = content.toString(rootConfig.encoding);
          } else {
            content = require('iconv-lite').decode(content, rootConfig.encoding);
          }
          const fn = template.compile(content, pathname);
          if (cache) {
            self[FNCACHESYMBOL].set(pathname, fn);
          }
          return callback(null, fn);
        })
        .catch(callback);
    };
  }

  * render(pathname, data, options) {
    copy(defaultOptions).to(options);
    debug('options:', options);
    let fn;
    const cfg = {
      name: pathname,
      loader: { load: this[LOADERSYMBOL]() },
      strict: options.strict,
      catchError: options.catchError,
      cache: options.cache,
      encoding: options.encoding,
    };

    if (!options.cache || !(fn = this[INSTANCECACHESYMBOL].peek(pathname))) {
      debug('create new Xtemplate instance!');
      fn = new Xtemplate(cfg);
      this[INSTANCECACHESYMBOL].set(pathname, fn);
    }

    return yield callback => {
      fn.render(data, { commands: options.commands }, callback);
    };
  }

  * renderString(str, data, options) {
    copy(defaultOptions).to(options);
    debug('options:', options);

    const fn = new Xtemplate(str);
    return yield callback => {
      fn.render(data, { commands: options.commands }, callback);
    };
  }
}

module.exports = XtplEngine;
