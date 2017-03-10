'use strict';

module.exports = function* () {
  yield this.render('home.xtpl', {
    name: 'ngot',
  });
};
