'use strict';

const Type = require('../symbols/type');
const Array = require('../symbols/array');

const Logical = require('./logical');

class Rel extends Logical {
  constructor(line, token, expr1, expr2) {
    super(line, token, expr1, expr2);
  }

  check(type1, type2) {
    if (type1 instanceof Array || type2 instanceof Array) {
      return null;
    } else if ( type1 === type2 ) {
      return Type.Bool;
    }
    return null;
  }

  jumping(t, f) {
    var a = this.expr1.reduce();
    var b = this.expr2.reduce();
    var test = a.toString() + ' ' + this.op.toString() + ' ' + b.toString();
    this.emitjumps(test, t, f);
  }
}

module.exports = Rel;
