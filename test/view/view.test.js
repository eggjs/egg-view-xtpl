'use strict';

const request = require('supertest');
const mm = require('egg-mock');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

describe('test/view/view.test.js', () => {
  const demoViewPath = 'test/fixtures/apps/xtpl-demo/app/view';
  const cacheViewPath = 'test/fixtures/apps/xtpl-cache/app/view';
  const demoTmpFile = path.join(demoViewPath, 'home.xtpl');
  const cacheTmpFile = path.join(cacheViewPath, 'home.xtpl');

  let app;
  let cacheApp;

  const sourceHTML = '<p>This is header</p>\n<hr>\n\n<h1>\n  Hi, ngot\n</h1>\n<p>\n  My page\n</p>\n<hr>\n<p>This is footer</p>\n\n';
  const CHANGE_TEMP = 'TEMPLATE CHANGED.\n';

  const cpFile = () => {
    fs.writeFileSync(demoTmpFile, fs.readFileSync(path.join(demoViewPath, 'home.default.xtpl')));
    fs.writeFileSync(cacheTmpFile, fs.readFileSync(path.join(cacheViewPath, 'home.default.xtpl')));
  };

  const delFiles = () => {
    fs.unlinkSync(demoTmpFile);
    fs.unlinkSync(cacheTmpFile);
  };

  before(function* () {
    app = mm.app({
      baseDir: 'apps/xtpl-demo',
      plugin: 'view',
    });
    cacheApp = mm.app({
      baseDir: 'apps/xtpl-cache',
      plugin: 'view',
    });

    cpFile();
    yield [ app.ready(), cacheApp.ready() ];
  });

  after(delFiles);

  afterEach(mm.restore);

  it('should render tpl with include work', done => {
    request(app.callback())
      .get('/')
      .expect('content-type', 'text/html; charset=utf-8')
      .expect(sourceHTML)
      .expect(200, done);
  });

  it('should render string', done => {
    request(app.callback())
      .get('/str')
      .expect('content-type', 'text/plain; charset=utf-8')
      .expect('foo ngot')
      .expect(200, done);
  });

  it('should render string', done => {
    request(app.callback())
      .get('/strHtml')
      .expect('content-type', 'text/html; charset=utf-8')
      .expect('<foo ngot')
      .expect(200, done);
  });

  it('should throw error when render wrong string', done => {
    request(app.callback())
      .get('/strError')
      .expect('content-type', 'text/plain; charset=utf-8')
      .expect('xtemplate error')
      .expect(200, done);
  });

  it('should throw error when view not exists', done => {
    // ignore error log
    mm(app.logger, 'error', () => { });
    request(app.callback())
      .get('/error')
      .expect(/no such file or directory/)
      .expect(404, done);
  });

  it('should view will change if file was changed and without cache config', done => {
    request(app.callback())
      .get('/')
      .expect('content-type', 'text/html; charset=utf-8')
      .expect(sourceHTML)
      .expect(200)
      .end(err => {
        assert(!err);
        fs.writeFile(demoTmpFile, CHANGE_TEMP, err2 => {
          assert(!err2);
          setTimeout(() => {
            request(app.callback())
              .get('/')
              .expect(200)
              .expect(CHANGE_TEMP, done);
          }, 500);
        });
      });
  });

  it('should cache view if file was changed and with cache config when render', done => {
    request(cacheApp.callback())
      .get('/cache')
      .expect('content-type', 'text/html; charset=utf-8')
      .expect(sourceHTML)
      .expect(200)
      .end(err => {
        assert(!err);
        fs.writeFile(cacheTmpFile, CHANGE_TEMP, err2 => {
          assert(!err2);
          setTimeout(() => {
            request(cacheApp.callback())
              .get('/cache')
              .expect(200)
              .expect(sourceHTML, done);
          }, 500);
        });
      });
  });

  it('should cache view if file was changed and with cache config when renderString', done => {
    request(cacheApp.callback())
      .get('/cacheString')
      .expect('content-type', 'text/plain; charset=utf-8')
      .expect('foo ngot')
      .expect(200)
      .end(err => {
        assert(!err);
        request(cacheApp.callback())
          .get('/cacheString')
          .expect('content-type', 'text/plain; charset=utf-8')
          .expect(200)
          .expect('foo ngot', done);
      });
  });
});
