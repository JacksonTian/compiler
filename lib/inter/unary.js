'use strict';

const Op = require('./op');
const Type = require('../symbols/type');

class Unary extends Op {
  constructor(line, token, expr) {
    super(line, token, null);
    this.expr = expr;
    this.type = Type.max(Type.Int, expr.type);
    if (!this.type) {
      this.error('type error');
    }
  }

  gen() {
    return new Unary(this.lexline, this.op, this.expr.reduce());
  }

  toString() {
    return this.op.toString() + ' ' + this.expr.toString();
  }
}

module.exports = Unary;
