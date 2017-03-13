'use strict';

module.exports = function* () {
  try {
    yield this.render('tplError.xtpl', {
      name: 'ngot',
    });
  } catch (e) {
    if (e.message.indexOf('XTemplate error in file:') === 0) 
      this.body = 'xtemplate error';
  }
};
