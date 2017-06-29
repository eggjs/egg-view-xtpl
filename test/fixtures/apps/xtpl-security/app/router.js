'use strict';

module.exports = app => {
  app.get('/form_csrf', function* () {
    yield this.render('form_csrf.xtpl');
  });

  app.get('/nonce', function* () {
    yield this.render('nonce.xtpl');
  });
};
