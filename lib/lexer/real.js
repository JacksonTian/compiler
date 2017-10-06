'use strict';

const Token = require('./token');
const Tag = require('./tag');

class Real extends Token {
  constructor(value) {
    super(Tag.REAL);
    this.value = value;
  }

  toString() {
    return '' + this.value;
  }
}

module.exports = Real;
