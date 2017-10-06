'use strict';

const Stmt = require('./stmt');
const Type = require('../symbols/type');

class If extends Stmt {
  constructor(line, expr, stmt) {
    super(line);
    this.expr = expr;
    this.stmt = stmt;

    if (expr.type !== Type.Bool ) {
      expr.error('boolean required in if');
    }
  }

  gen(b, a) {
    var label = this.newlabel(); // label for the code for stmt
    this.expr.jumping(0, a);     // fall through on true, goto a on false
    this.emitlabel(label);
    this.stmt.gen(label, a);
  }
}

module.exports = If;
