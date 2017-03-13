'use strict';

const Xtemplate = require('xtemplate');
const debug = require('debug')('egg-view-xtpl:xtpl');
const fs = require('fs-then');
const path = require('path');
const LRU = require('lru-cache');
const copy = require('copy-to');

const INSTANCECACHESYMBOL = Symbol('XTPL#INSTANCECACHE');
const FNCACHESYMBOL = Symbol('XTPL#FNCACHE');
const FILECACHESYMBOL = Symbol('XTPL#FILECACHE');

class XtplEngine {
  get defaultOptions() {
    return {
      catchError: process.env.NODE_ENV !== 'production',
      encoding: 'utf-8',
    };
  }

  get instanceCache() {
    if (!this[INSTANCECACHESYMBOL]) {
      this[INSTANCECACHESYMBOL] = new LRU();
    }
    return this[INSTANCECACHESYMBOL];
  }

  get fileCache() {
    if (!this[FNCACHESYMBOL]) {
      this[FNCACHESYMBOL] = new LRU();
    }
    return this[FNCACHESYMBOL];
  }

  get fnCache() {
    if (!this[FILECACHESYMBOL]) {
      this[FILECACHESYMBOL] = new LRU();
    }
    return this[FILECACHESYMBOL];
  }

  getInstance(config) {
    const self = this;
    const cache = config.cache;
    const pathname = config.name;
    let cached;
    if (cache && (cached = self.instanceCache.peek(pathname))) {
      return cached;
    }
    cached = new Xtemplate(config);
    if (cache) {
      self.instanceCache.set(pathname, cached);
    }
    return cached;
  }

  readFile(pathname, config) {
    const self = this;
    const cache = config.cache;

    let cached;
    if (cache && (cached = self.fileCache.get(pathname))) {
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
          self.fileCache.set(pathname, content);
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

      if (cache && self.fnCache.has(pathname)) {
        return callback(null, self.fnCache.get(pathname));
      }

      self.readFile(pathname, rootConfig)
        .then(tpl => {
          return new Promise((resolve, reject) => {
            try {
              const fn = template.compile(tpl, pathname);
              if (cache) {
                self.fnCache.set(pathname, fn);
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
