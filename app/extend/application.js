'use strict';

const XTPL = Symbol('app#xtpl');
const engine = require('../../lib/engine');

module.exports = {

  /**
   * xtpl instance
   * @member {xtpl} Application#xtpl
   */
  get xtpl() {
    if (!this[XTPL]) {
      this[XTPL] = engine(this);
    }
    return this[XTPL];
  },
};
