'use strict';

const Xtemplate = require('xtemplate');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const LRU = require('lru-cache');
const copy = require('copy-to');
const iconv = require('iconv-lite');

const instanceCache = new LRU();
const fnCache = new LRU();
const fileCache = new LRU();

const defaultOptions = {
  catchError: process.env.NODE_ENV !== 'production',
  encoding: 'utf-8',
};

module.exports = () => {
  const loader = {
    load(tpl, callback) {
      const template = tpl.root;
      const pathname = tpl.name;
      const rootConfig = template.config;
      const cache = rootConfig.cache;
      if (cache && fnCache.has(pathname)) {
        return callback(0, fnCache.get(pathname));
      }
      readFile(pathname, rootConfig, (error, tpl) => {
        if (error) {
          callback(error);
        } else {
          compile(template, tpl, pathname, (err, fn) => {
            if (err) {
              callback(err);
            } else {
              if (cache) {
                fnCache.set(pathname, fn);
              }
              callback(null, fn);
            }
          });
        }
      });
    },
  };

  function readFile(pathname, config, callback) {
    const cache = config.cache;
    let cached;
    if (cache && (cached = fileCache.get(pathname))) {
      return callback(null, cached);
    }
    const encoding = config.encoding;

    fs.readFile(pathname, (error, content) => {
      if (error) {
        callback(error);
      } else {
        if (Buffer.isEncoding(encoding)) {
          content = content.toString(encoding);
        } else {
          content = iconv.decode(content, encoding);
        }
        if (cache) {
          fileCache[pathname] = content;
        }
        callback(undefined, content);
      }
    });
  }

  function compile(root, tpl, pathname, callback) {
    let fn;
    try {
      fn = root.compile(tpl, pathname);
    } catch (e) {
      return callback(e);
    }
    callback(null, fn);
  }

  function getInstance(config) {
    const cache = config.cache;
    const pathname = config.name;
    let cached;
    if (cache && (cached = instanceCache.peek(pathname))) {
      return cached;
    }
    const instance = new Xtemplate(config);
    if (cache) {
      instanceCache.set(pathname, instance);
    }
    return instance;
  }

  const engine = { Xtemplate };

  engine.render = function render(pathname, data, options) {
    copy(defaultOptions).to(options);
    pathname = path.normalize(pathname);
    return new Promise((resolve, reject) => {
      const instance = getInstance({
        name: pathname,
        loader,
        strict: options.strict,
        catchError: options.catchError,
        cache: options.cache,
        encoding: options.encoding,
      });

      instance.render(data, { commands: options.commands }, (error, content) => {
        if (error) {
          reject(error);
        } else {
          resolve(content);
        }
      });
    });
  };

  engine.renderString = function renderString(str, data, options) {
    copy(defaultOptions).to(options);
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('md5').update(str).digest('hex');
      let fn;
      if ((fn = fnCache.peek(hash))) {
        fn.render(data, options.commands, renderTpl);
      } else {
        fn = new Xtemplate(str);
        fnCache.set(hash, fn);
        fn.render(data, options.commands, renderTpl);
      }

      function renderTpl(err, content) {
        if (err) {
          reject(err);
        } else {
          resolve(content);
        }
      }
    });
  };

  engine.cleanCache = function cleanCache() {

  };

  return engine;
};
