'use strict';

const Logical = require('./logical');

class Or extends Logical {
  constructor(line, token, expr1, expr2) {
    super(line, token, expr1, expr2);
  }

  jumping(t, f) {
    var label = (t !== 0 ? t : this.newlabel());
    this.expr1.jumping(label, 0);
    this.expr2.jumping(t, f);
    if (t === 0) {
      this.emitlabel(label);
    }
  }
}

module.exports = Or;
