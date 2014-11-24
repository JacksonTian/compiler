var Lexer = function () {
  this.input = '';
  this.buffer = '';
  this.last = 1;
  this.current = 0;
  this.tokens = [];
  this.inString = false;
  this.inComment = false;
};
Lexer.prototype.peek = function () {
  var ch = this.input[this.current];
  this.current++;
  return ch;
};

Lexer.prototype.write = function (ch) {
  this.buffer += ch;
};

Lexer.prototype.parse = function (str) {
  this.input += str;
  var tokens = [];
  var lexer = this;
  var keepToken = function () {
    var token = lexer.save();
    if (token) {
      tokens.push(token);
    }
  };
  while (this.current < this.input.length) {
    var ch = this.peek();
    if (ch === '"') {
      lexer.inString = !lexer.inString;
      if (lexer.inString) {
        keepToken();
        lexer.write(ch);
      } else {
        lexer.write(ch);
        keepToken();
      }
      continue;
    }
    if (ch === '\'') {
      if (lexer.inString) {
        lexer.write(ch);
      } else {
        lexer.inString = !lexer.inString;
        if (lexer.inString) {
          keepToken();
          lexer.write(ch);
        } else {
          lexer.write(ch);
          keepToken();
        }
        continue;
      }
    }
    if (!lexer.inString) {
      if (ch === '(' || ch === ')' || ch === '.' || ch === ';' || ch === '[' || ch === ']') {
        keepToken();
        lexer.write(ch);
        keepToken();
      } else if (ch === ' ') {
        // 不用写
        keepToken();
      } else if (ch === '\n') {
        // 不用写
        keepToken();
      } else {
        lexer.write(ch);
      }
    } else {
      lexer.write(ch);
    }
  }
  return tokens;
};

Lexer.prototype.save = function () {
  var token = null;
  if (this.buffer) {
    token = {
      value: this.buffer,
      type: this.getType(this.buffer),
      location: [this.last, this.last + this.buffer.length - 1]
    };
    this.tokens.push(token);
  }
  this.last = this.current + 1;
  this.buffer = '';
  return token;
};

Lexer.prototype.end = function () {
  var token = this.save();
  if (this.inString) {
    throw new Error('字符串未正常结束');
  }
  return token ? [token] : [];
};
var keywords = ['var', 'function', 'return'];
Lexer.prototype.getType = function (str) {
  if (str === '+' || str === '-' || str === '*' || str === '/' || str === '=' || str === '<') {
    return 'oprator';
  }
  if (str === ';') {
    return 'semicolon';
  }
  if (str === '(') {
    return 'parenthesis_start';
  }
  if (str === ')') {
    return 'parenthesis_end';
  }
  if (str === '{') {
    return 'brace_start';
  }
  if (str === '}') {
    return 'brace_end';
  }
  if (str === '.') {
    return 'dot';
  }
  var strExp = /^["'].*["']$/;
  if (strExp.test(str)) {
    return 'string';
  }
  var numExp = /^\d+$/;
  if (numExp.test(str)) {
    return 'number';
  }
  if (keywords.indexOf(str) !== -1) {
    return 'keyword';
  }
  return 'id';
};

Lexer.prototype.getTokens = function () {
  return this.tokens;
};

Lexer.parse = function (script) {
  var lexer = new Lexer();
  lexer.parse(script);
  lexer.end();
  return lexer.tokens;
};

module.exports = Lexer;
