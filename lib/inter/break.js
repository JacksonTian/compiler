'use strict';

const Stmt = require('./stmt');

class Break extends Stmt {
  constructor(line) {
    super(line);
    if (Stmt.Enclosing === Stmt.Null) {
      this.error('unenclosed break');
    }
    this.stmt = Stmt.Enclosing;
  }

  gen(b, a) {
    this.emit('goto L' + this.stmt.after);
  }
}

module.exports = Break;
