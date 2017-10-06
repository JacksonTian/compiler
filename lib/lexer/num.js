'use strict';

const Token = require('./token');
const Tag = require('./tag');

class Num extends Token {
  constructor(value) {
    super(Tag.NUM);
    this.value = value;
  }

  toString() {
    return '' + this.value;
  }
}

module.exports = Num;
