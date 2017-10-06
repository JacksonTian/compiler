'use strict';

const Type = require('../symbols/type');

const Stmt = require('./stmt');

class Set extends Stmt {
  constructor(line, id, expr) {
    super(line);
    this.id = id;
    this.expr = expr;
    if (!this.check(id.type, expr.type)) {
      this.error('type error');
    }
  }

  check(type1, type2) {
    if (Type.numeric(type1) && Type.numeric(type2) ) {
      return type2;
    } else if (type1 === Type.Bool && type2 === Type.Bool ) {
      return type2;
    }
    return null;
  }

  gen() {
    this.emit(this.id.toString() + ' = ' + this.expr.gen().toString());
  }
}

module.exports = Set;
