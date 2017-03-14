'use strict';

const XTPLSYMBOL = Symbol('app#xtpl');
const engine = require('../../lib/engine');

module.exports = {

  /**
   * xtpl instance
   * @member {xtpl} Application#xtpl
   */
  get xtpl() {
    if (!this[XTPLSYMBOL]) {
      this[XTPLSYMBOL] = engine(this);
    }
    return this[XTPLSYMBOL];
  },
};
