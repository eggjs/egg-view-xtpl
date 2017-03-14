'use strict';

const Xtemplate = require('xtemplate');
const debug = require('debug')('egg-view-xtpl:xtpl');
const fs = require('mz/fs');
const LRU = require('lru-cache');

const INSTANCE_CACHE = Symbol('XTPL#INSTANCECACHE');
const FN_CACHE = Symbol('XTPL#FNCACHE');
const LOADER = Symbol('XTPL#LOADER');

class XtplEngine {
  constructor() {
    this[INSTANCE_CACHE] = new LRU();
    this[FN_CACHE] = new LRU();
  }

  [LOADER]() {
    const self = this;
    return function loader(tpl, callback) {
      const template = tpl.root;
      const pathName = tpl.name;
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
          const fn = template.compile(content, pathName);
          if (cache) {
            self[FN_CACHE].set(pathName, fn);
          }
          return callback(null, fn);
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
