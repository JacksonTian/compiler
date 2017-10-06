'use strict';

const Expr = require('./expr');

class Id extends Expr {
  constructor(line, id, type, offset) {
    super(line, id, type);
    this.offset = offset;
  }
}

module.exports = Id;
