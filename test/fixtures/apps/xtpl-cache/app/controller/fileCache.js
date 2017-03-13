'use strict';

module.exports = function* () {
  yield this.render('home.xtpl', {
    name: 'ngot',
  });
  this.app.xtpl.fnCache.reset();
};
