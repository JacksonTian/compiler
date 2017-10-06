'use strict';

const Stmt = require('./stmt');
const Type = require('../symbols/type');

class While extends Stmt {
  constructor(line) {
    super(line);
    this.expr = null;
    this.stmt = null;
  }

  init(expr, stmt) {
    this.expr = expr;
    this.stmt = stmt;
    if (expr.type !== Type.Bool) {
      expr.error('boolean required in while');
    }
  }

  gen(b, a) {
    this.after = a;                // save label a
    this.expr.jumping(0, a);
    var label = this.newlabel();   // label for stmt
    this.emitlabel(label);
    this.stmt.gen(label, b);
    this.emit('goto L' + b);
  }
}

module.exports = While;
