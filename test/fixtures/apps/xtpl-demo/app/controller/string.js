'use strict';

module.exports = function* () {
  this.body = yield this.renderString('foo {{ name }}', {
    name: 'ngot',
  }, {
      viewEngine: 'xtpl',
    });
};
