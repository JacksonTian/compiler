'use strict';

const Word = require('../lexer/word');
const Tag = require('../lexer/tag');

class Type extends Word {
  constructor(name, tag, width) {
    super(name, tag);
    this.width = width;
  }

  static numeric(type) {
    return (type === Type.Char || type === Type.Int || type === Type.Float);
  }

  static max(type1, type2) {
    if (!Type.numeric(type1) || !Type.numeric(type2)) {
      return null;
    } else if (type1 === Type.Float || type2 === Type.Float) {
      return Type.Float;
    } else if (type1 === Type.Int || type2 === Type.Int) {
      return Type.Int;
    }
    return Type.Char;
  }
}

Type.Int = new Type('int', Tag.BASIC, 4);
Type.Float = new Type('float', Tag.BASIC, 8);
Type.Char = new Type('char', Tag.BASIC, 1);
Type.Bool = new Type('bool', Tag.BASIC, 1);

module.exports = Type;
