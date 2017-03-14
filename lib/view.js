'use strict';

const debug = require('debug')('egg-view-xtpl:view');

class XTPLView {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
    this.config = ctx.app.config.xtpl;
    debug('this.config:', this.config);
  }

  * render(filename, locals, viewOptions) {
    const config = Object.assign({}, this.config, viewOptions, { filename });
    debug('render filename:', filename);
    return yield this.app.xtpl.render(filename, locals, config);
  }

  * renderString(str, locals, viewOptions) {
    const config = Object.assign({}, this.config, viewOptions);
    return yield this.app.xtpl.renderString(str, locals, config);
  }
}

module.exports = XTPLView;
