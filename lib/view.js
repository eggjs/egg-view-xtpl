'use strict';

const path = require('path');
const assert = require('assert');
const engine = require('./engine')();
const debug = require('debug')('egg-view-xtpl:view');

class XTPLView {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
    this.config = ctx.app.config.xtpl;
    debug('this.config:', this.config);
  }

  render(filename, locals, viewOptions) {
    assert(filename, 'view filename must be supplied!');
    assert(locals, 'locals must be supplied!');
    const config = Object.assign({}, this.config, viewOptions, { filename });
    if (!filename.endsWith('.xtpl')) {
      filename = path.join(this.config.loadpath, filename + '.xtpl');
    }
    return engine.render(filename, locals, config);
  }

  renderString(str, locals, viewOptions) {
    assert(str, 'view string must be supplied!');
    assert(locals, 'locals must be supplied!');
    const config = Object.assign({}, this.config, viewOptions, { cache: null });
    return engine.renderString(str, locals, config);
  }
}

module.exports = XTPLView;
