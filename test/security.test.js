'use strict';

const mm = require('egg-mock');
const cheerio = require('cheerio');
const assert = require('assert');

describe('test/view/security.test.js', () => {
  let app;

  before(() => {
    app = mm.app({
      baseDir: 'apps/xtpl-security',
    });

    return app.ready();
  });
  after(() => app.close());

  afterEach(mm.restore);

  it('should inject csrf hidden field in form', function* () {
    const result = yield app.httpRequest()
      .get('/form_csrf')
      .expect(200);

    const $ = cheerio.load(result.text);
    assert($('#form1 input').length === 2);
    assert($('#form1 [name=_csrf]').attr('name') === '_csrf');
    assert($('#form1 [name=_csrf]').val().length > 1);
    assert($('#form2 input').length === 1);
    assert($('#form2 input').attr('data-a') === 'a');
    assert($('#form2 input').val().length > 1);
  });

  it('should inject nonce attribute to script tag', function* () {
    const result = yield app.httpRequest()
      .get('/nonce')
      .expect(200);

    const $ = cheerio.load(result.text);
    const expectedNonce = $('#input1').val();
    assert($('#script1').attr('nonce') === expectedNonce);
    assert($('#script2').attr('nonce') === expectedNonce);
    assert($('#script3').attr('nonce') === expectedNonce);
  });

});
