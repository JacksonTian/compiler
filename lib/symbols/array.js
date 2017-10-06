'use strict';

const Type = require('./type');
const Tag = require('../lexer/tag');

class Array extends Type {
  constructor(size, type) {
    super('[]', Tag.INDEX, size * type.width);
    this.size = size;
    this.of = type;
  }

  toString() {
    return '[' + this.size + '] ' + this.of.toString();
  }
}

module.exports = Array;
