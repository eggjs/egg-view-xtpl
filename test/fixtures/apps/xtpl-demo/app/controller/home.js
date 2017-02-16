'use strict';

module.exports = function* () {
  yield this.render('home', {
    name: 'ngot',
  });
};
