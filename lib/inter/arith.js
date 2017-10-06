'use strict';

const Op = require('./op');
const Type = require('../symbols/type');

class Arith extends Op {
  constructor(line, token, expr1, expr2) {
    super(line, token, null);
    this.expr1 = expr1;
    this.expr2 = expr2;
    this.type = Type.max(expr1.type, expr2.type);
    if (this.type === null ) {
      this.error('type error');
    }
  }

  gen() {
    return new Arith(this.lexline, this.op, this.expr1.reduce(), this.expr2.reduce());
  }

  toString() {
    return this.expr1.toString() + ' ' + this.op.toString() + ' ' + this.expr2.toString();
  }
}

module.exports = Arith;
