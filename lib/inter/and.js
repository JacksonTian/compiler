'use strict';

const Logical = require('./logical');

class And extends Logical {
  constructor(line, token, expr1, expr2) {
    super(line, token, expr1, expr2);
  }

  jumping(t, f) {
    var label = (f !== 0 ? f : this.newlabel());
    this.expr1.jumping(0, label);
    this.expr2.jumping(t,f);
    if (f === 0) {
      this.emitlabel(label);
    }
  }
}

module.exports = And;
