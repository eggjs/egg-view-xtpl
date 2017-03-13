'use strict';

const XTPL = Symbol('app#XTPL');
const ENGINE = require('../../lib/engine');

module.exports = {

  /**
   * xtpl environment
   * @member {XTPLEnvironment} Application#xtpl
   */
  get xtpl() {
    if (!this[XTPL]) {
      this[XTPL] = ENGINE(this);
    }
    return this[XTPL];
  },
};
