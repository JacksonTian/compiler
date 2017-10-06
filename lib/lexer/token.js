'use strict';

class Token {
  constructor(tag) {
    this.tag = tag;
  }

  toString() {
    return '' + this.tag;
  }
}

module.exports = Token;
