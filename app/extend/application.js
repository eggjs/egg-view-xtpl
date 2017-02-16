'use strict';

const VIEW_ENGINE = Symbol('app#ViewEngine');
const View = require('../../lib/view');
const engine = require('../../lib/engine');

module.exports = {
  get [Symbol.for('egg#view')]() {
    return View;
  },

  get viewEngine() {
    if (!this[VIEW_ENGINE]) {
      this[VIEW_ENGINE] = engine(this);
    }
    return this[VIEW_ENGINE];
  },
};
