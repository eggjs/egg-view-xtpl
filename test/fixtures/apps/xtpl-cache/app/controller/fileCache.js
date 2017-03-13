'use strict';

const FNCACHESYMBOL = Symbol.for('XTPL#FNCACHE');

module.exports = function* () {
  yield this.render('home.xtpl', {
    name: 'ngot',
  });

  this.app.xtpl[FNCACHESYMBOL].reset();
};
