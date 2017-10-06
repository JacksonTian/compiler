'use strict';

const Type = require('../symbols/type');

const Stmt = require('./stmt');

class Do extends Stmt {
  constructor(line) {
    super(line);
    this.expr = null;
    this.stmt = null;
  }

  init(stmt, expr) {
    this.expr = expr;
    this.stmt = stmt;
    if (expr.type !== Type.Bool) {
      expr.error('boolean required in do');
    }
  }

  gen(b, a) {
    this.after = a;
    var label = this.newlabel();   // label for expr
    this.stmt.gen(b,label);
    this.emitlabel(label);
    this.expr.jumping(b,0);
  }
}

module.exports = Do;
