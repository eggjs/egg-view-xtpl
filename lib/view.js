'use strict';

const path = require('path');
const assert = require('assert');

class XTPLView {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
    this._config = ctx.app.config.view;
  }

  render(name, locals) {
    assert(name, 'view name must be supplied!');
    assert(locals, 'locals must be supplied!');
    if (!name.endsWith('.xtpl')) {
      name = path.join(this._config.loadpath, name + '.xtpl');
    }
    return this.app.viewEngine.render(name, locals, this._config);
  }

  renderString(str, locals) {
    assert(str, 'view string must be supplied!');
    assert(locals, 'locals must be supplied!');
    return this.app.viewEngine.renderString(str, locals, this._config);
  }
}

module.exports = XTPLView;
