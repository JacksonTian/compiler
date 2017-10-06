'use strict';

const Expr = require('./expr');
const Temp = require('./temp');

class Op extends Expr {
  constructor(line, token, type) {
    super(line, token, type);
  }

  reduce() {
    var x = this.gen();
    var t = new Temp(this.lexline, this.type);
    this.emit(t.toString() + ' = ' + x.toString());
    return t;
  }
}

module.exports = Op;
