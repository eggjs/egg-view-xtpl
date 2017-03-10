'use strict';

module.exports = function* () {
  try {
    this.body = yield this.renderString('foo {{ name }', {
      name: 'ngot',
    });
    
  } catch (e) {
    if (e.message.indexOf('XTemplate error in file: xtemplate') === 0) this.body = 'xtemplate error';
  }
};
