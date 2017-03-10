'use strict';

module.exports = function* () {
  yield this.render('error-not-exists.xtpl', {
    name: 'ngot',
  });
};
