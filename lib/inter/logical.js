'use strict';

const Expr = require('./expr');
const Type = require('../symbols/type');
const Temp = require('./temp');

class Logical extends Expr {
  constructor(line, token, expr1, expr2) {
    super(line, token, null);
    this.expr1 = expr1;
    this.expr2 = expr2;
    this.type = this.check(expr1.type, expr2.type);
    if (!this.type) {
      this.error('type error');
    }
  }

  check(type1, type2) {
    if (type1 === Type.Bool && type2 === Type.Bool ) {
      return Type.Bool;
    }
    return null;
  }

  gen() {
    var f = this.newlabel();
    var a = this.newlabel();
    var temp = new Temp(this.lexline, this.type);
    this.jumping(0,f);
    this.emit(temp.toString() + ' = true');
    this.emit('goto L' + a);
    this.emitlabel(f);
    this.emit(temp.toString() + ' = false');
    this.emitlabel(a);
    return temp;
  }

  toString() {
    return this.expr1.toString() + ' ' + this.op.toString() + ' ' + this.expr2.toString();
  }
}

module.exports = Logical;
