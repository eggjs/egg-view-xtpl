'use strict';

const request = require('supertest');
const mm = require('egg-mock');

describe('test/view-xtpl.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/view-xtpl-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mm.restore);

  it('should GET /', () => {
    return request(app.callback())
      .get('/')
      .expect('hi, view-xtpl')
      .expect(200);
  });
});
