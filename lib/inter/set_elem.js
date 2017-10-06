'use strict';

const Type = require('../symbols/type');
const Array = require('../symbols/array');

const Stmt = require('./stmt');

class SetElem extends Stmt {
  constructor(line, access, expr) {
    super(line);
    this.array = access.array;
    this.index = access.index;
    this.expr = expr;
    if (!this.check(access.type, expr.type)) {
      this.error('type error');
    }
  }

  check(type1, type2) {
    if ( type1 instanceof Array || type2 instanceof Array ) {
      return null;
    } else if (type1 === type2) {
      return type2;
    } else if (Type.numeric(type1) && Type.numeric(type2) ) {
      return type2;
    }
    return null;
  }

  gen(b, a) {
    var s1 = this.index.reduce().toString();
    var s2 = this.expr.reduce().toString();
    this.emit(this.array.toString() + ' [ ' + s1 + ' ] = ' + s2);
  }
}

module.exports = SetElem;
