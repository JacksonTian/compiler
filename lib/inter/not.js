'use strict';

const Logical = require('./logical');

class Not extends Logical {
  constructor(line, token, expr) {
    super(line, token, expr, expr);
  }

  jumping(t, f) {
    this.expr2.jumping(f, t);
  }

  toString() {
    return this.op.toString() + ' ' + this.expr2.toString();
  }
}

module.exports = Not;
