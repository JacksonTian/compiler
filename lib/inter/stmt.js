'use strict';

const Node = require('./node');

class Stmt extends Node {
  constructor(line) {
    super(line);
    this.after = 0;
  }

  gen(b, a) {

  }
}

Stmt.Null = new Stmt(0);

Stmt.Enclosing = Stmt.Null;

module.exports = Stmt;
