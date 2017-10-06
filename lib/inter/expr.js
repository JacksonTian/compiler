'use strict';

const Node = require('./node');

class Expr extends Node {
  constructor(line, token, type) {
    super(line);
    this.op = token;
    this.type = type;
  }

  gen() {
    return this;
  }

  reduce() {
    return this;
  }

  jumping(t, f) {
    this.emitjumps(this.toString(), t, f);
  }

  emitjumps(test, t, f) {
    if (t !== 0 && f !== 0 ) {
      this.emit('if ' + test + ' goto L' + t);
      this.emit('goto L' + f);
    } else if (t !== 0) {
      this.emit('if ' + test + ' goto L' + t);
    } else if (f !== 0) {
      this.emit('iffalse ' + test + ' goto L' + f);
    }
  }

  toString() {
    return this.op.toString();
  }
}

module.exports = Expr;
