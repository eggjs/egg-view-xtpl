'use strict';

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
    const config = Object.assign({}, this.config, viewOptions, { filename });
    debug('filename:', filename);
    return engine.render(filename, locals, config);
  }

  renderString(str, locals, viewOptions) {
    const config = Object.assign({}, this.config, viewOptions, { cache: null });
    return engine.renderString(str, locals, config);
  }
}

module.exports = XTPLView;
