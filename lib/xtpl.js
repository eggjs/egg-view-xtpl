'use strict';

const Xtemplate = require('xtemplate');
const debug = require('debug')('egg-view-xtpl:xtpl');
const fs = require('fs-then');
const path = require('path');
const LRU = require('lru-cache');
const copy = require('copy-to');

const INSTANCECACHESYMBOL = Symbol.for('XTPL#INSTANCECACHE');
const FNCACHESYMBOL = Symbol.for('XTPL#FNCACHE');
const FILECACHESYMBOL = Symbol.for('XTPL#FILECACHE');

class XtplEngine {
  constructor() {
    this[INSTANCECACHESYMBOL] = new LRU();
    this[FNCACHESYMBOL] = new LRU();
    this[FILECACHESYMBOL] = new LRU();
  }

  get defaultOptions() {
    return {
      catchError: process.env.NODE_ENV !== 'production',
      encoding: 'utf-8',
    };
  }

  getInstance(config) {
    const cache = config.cache;
    const pathname = config.name;
    let cached;
    if (cache && (cached = this[INSTANCECACHESYMBOL].peek(pathname))) {
      return cached;
    }
    cached = new Xtemplate(config);
    if (cache) {
      this[INSTANCECACHESYMBOL].set(pathname, cached);
    }
    return cached;
  }

  readFile(pathname, config) {
    const self = this;
    const cache = config.cache;

    let cached;
    if (cache && (cached = self[FILECACHESYMBOL].get(pathname))) {
      return Promise.resolve(cached);
    }

    return fs.readFile(pathname)
      .then(content => {
        if (Buffer.isEncoding(config.encoding)) {
          content = content.toString(config.encoding);
        } else {
          content = require('iconv-lite').decode(content, config.encoding);
        }
        if (cache) {
          self[FILECACHESYMBOL].set(pathname, content);
        }
        return content;
      });
  }

  render(pathname, data, options) {
    const self = this;
    copy(self.defaultOptions).to(options);
    pathname = path.normalize(pathname);

    function load(tpl, callback) {
      const template = tpl.root;
      const pathname = tpl.name;
      const rootConfig = template.config;
      const cache = rootConfig.cache;
      debug('rootConfig:', rootConfig);

      if (cache && self[FNCACHESYMBOL].has(pathname)) {
        return callback(null, self[FNCACHESYMBOL].get(pathname));
      }

      self.readFile(pathname, rootConfig)
        .then(tpl => {
          return new Promise((resolve, reject) => {
            try {
              const fn = template.compile(tpl, pathname);
              if (cache) {
                self[FNCACHESYMBOL].set(pathname, fn);
              }
              resolve(fn);
            } catch (e) {
              reject(e);
            }
          });
        })
        .then(r => callback(null, r), callback);
    }

    return new Promise((resolve, reject) => {
      const instance = this.getInstance({
        name: pathname,
        loader: { load },
        strict: options.strict,
        catchError: options.catchError,
        cache: options.cache,
        encoding: options.encoding,
      });

      instance.render(data, { commands: options.commands }, renderTpl);
      function renderTpl(err, content) {
        debug('render done!');
        if (err) {
          reject(err);
        } else {
          resolve(content);
        }
      }
    });
  }

  renderString(str, data, options) {
    copy(this.defaultOptions).to(options);
    return new Promise((resolve, reject) => {
      const fn = new Xtemplate(str);
      fn.render(data, { commands: options.commands }, renderTpl);
      function renderTpl(err, content) {
        if (err) {
          reject(err);
        } else {
          resolve(content);
        }
      }
    });
  }
}

module.exports = XtplEngine;
