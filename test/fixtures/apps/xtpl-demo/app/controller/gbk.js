'use strict';

module.exports = function* () {
  yield this.render('gbk.xtpl', {
    name: 'ngot',
  }, {
      encoding: 'gbk',
    });
};
