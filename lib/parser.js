var Env = require('./env');
var Tag = require('./tag');
var Seq = require('./seq');
var Id = require('./id');
var Constant = require('./constant');
var Type = require('./type');
var Stmt = require('./stmt');
var Set = require('./set');
var Arith = require('./arith');
var Unary = require('./unary');
var Word = require('./word');

var Parser = function (lex) {
  this.lex = lex;
  this.top = null;
  this.look = null;
  this.used = 0;
  this.move();
};

Parser.prototype.move = function () {
  this.look = this.lex.scan();
};

Parser.prototype.program = function (source) {
  var stmt = this.block();
  var begin = stmt.newlabel();
  var after = stmt.newlabel();
  stmt.emitlabel(begin);
  stmt.gen(begin, after);
  stmt.emitlabel(after);
};

Parser.prototype.block = function () {  // block -> { decls stmts }
  this.match('{');
  var savedEnv = this.top;
  this.top = new Env(this.top);
  this.decls();
  var s = this.stmts();
  this.match('}');
  this.top = savedEnv;
  return s;
};

Parser.prototype.match = function (token) {
  if (this.look.tag === token) {
    this.move();
  } else {
    this.error("syntax error");
  }
};

Parser.prototype.decls = function () {
  while (this.look.tag === Tag.BASIC) {   // D -> type ID ;
    var p = this.type();
    var tok = this.look;
    this.match(Tag.ID);
    this.match(';');
    var id = new Id(tok, p, this.used);
    this.top.put(tok, id);
    this.used = this.used + p.width;
  }
};

Parser.prototype.stmts = function () {
  if (this.look.tag === '}' ) {
    return Stmt.Null;
  } else {
    return new Seq(this.stmt(), this.stmts());
  }
};

Parser.prototype.stmt = function () {
  var x;
  var s, s1, s2;
  var savedStmt; // save enclosing loop for breaks

  switch (this.look.tag) {

  case ';':
    this.move();
    return Stmt.Null;

  case Tag.IF:
    this.match(Tag.IF);
    this.match('(');
    x = bool();
    this.match(')');
     s1 = stmt();
     if( look.tag != Tag.ELSE ) return new If(x, s1);
     match(Tag.ELSE);
     s2 = stmt();
     return new Else(x, s1, s2);

  case Tag.WHILE:
     var whilenode = new While();
     savedStmt = Stmt.Enclosing; Stmt.Enclosing = whilenode;
     match(Tag.WHILE); match('('); x = bool(); match(')');
     s1 = stmt();
     whilenode.init(x, s1);
     Stmt.Enclosing = savedStmt;  // reset Stmt.Enclosing
     return whilenode;

  case Tag.DO:
     var donode = new Do();
     savedStmt = Stmt.Enclosing; Stmt.Enclosing = donode;
     match(Tag.DO);
     s1 = stmt();
     match(Tag.WHILE); match('('); x = bool(); match(')'); match(';');
     donode.init(s1, x);
     Stmt.Enclosing = savedStmt;  // reset Stmt.Enclosing
     return donode;

  case Tag.BREAK:
     match(Tag.BREAK); match(';');
     return new Break();

  case '{':
     return this.block();

  default:
     return this.assign();
  }
};

Parser.prototype.assign = function () {
  var stmt;
  var t = this.look;
  this.match(Tag.ID);
  var id = this.top.get(t);
  if (!id) {
    this.error(t.toString() + " undeclared");
  }

  if (this.look.tag === '=' ) {       // S -> id = E ;
    this.move();
    stmt = new Set(id, this.bool());
  } else {                        // S -> L = E ;
    var x = this.offset(id);
    this.match('=');
    stmt = new SetElem(x, this.bool());
  }
  this.match(';');
  return stmt;
};

Parser.prototype.error = function (str) {
  var err = new Error();
  err.message = "near line " + this.lex.line + ":\n" + this.lex.stream.getLines() + "\n" + str;
  throw err;
};

Parser.prototype.type = function () {
  var p = this.look;            // expect look.tag == Tag.BASIC
  this.match(Tag.BASIC);
  if (this.look.tag !== '[') {
    return p; // T -> basic
  } else {
    return this.dims(p); // return array type
  }
};

Parser.prototype.bool = function () {
  var x = this.join();
  while (this.look.tag === Tag.OR) {
    var tok = this.look;
    this.move();
    x = new Or(tok, x, this.join());
  }
  return x;
};

Parser.prototype.join = function () {
  var x = this.equality();
  while (this.look.tag === Tag.AND) {
    var tok = this.look;
    this.move();
    x = new And(tok, x, this.equality());
  }
  return x;
};

Parser.prototype.equality = function () {
  var x = this.rel();
  while (this.look.tag === Tag.EQ || this.look.tag === Tag.NE ) {
    var tok = this.look;
    this.move();
    x = new Rel(tok, x, this.rel());
  }
  return x;
};

Parser.prototype.rel = function () {
  var x = this.expr();
  switch (this.look.tag) {
  case '<':
  case Tag.LE:
  case Tag.GE:
  case '>':
    var tok = this.look;
    this.move();
    return new Rel(tok, x, this.expr());
  default:
    return x;
  }
};

Parser.prototype.expr = function () {
  var x = this.term();
  while (this.look.tag === '+' || this.look.tag === '-' ) {
    var tok = this.look;
    this.move();
    x = new Arith(tok, x, this.term());
  }
  return x;
};

Parser.prototype.term = function () {
  var x = this.unary();
  while(this.look.tag === '*' || this.look.tag === '/' ) {
    var tok = this.look;
    this.move();
    x = new Arith(tok, x, this.unary());
  }
  return x;
};

Parser.prototype.unary = function () {
  if (this.look.tag === '-' ) {
    this.move();
    return new Unary(Word.minus, this.unary());
  } else if (this.look.tag === '!') {
    var tok = look;
    this.move();
    return new Not(tok, this.unary());
  } else {
    return this.factor();
  }
};

Parser.prototype.factor = function () {
  var x = null;
  switch (this.look.tag ) {
  case '(':
    this.move();
    x = this.bool();
    this.match(')');
    return x;
  case Tag.NUM:
    x = new Constant(this.look, Type.Int);
    this.move();
    return x;
  case Tag.REAL:
    x = new Constant(this.look, Type.Float);
    this.move();
    return x;
  case Tag.TRUE:
    x = Constant.True;
    this.move();
    return x;
  case Tag.FALSE:
    x = Constant.False;
    this.move();
    return x;
  default:
    this.error("syntax error");
    return x;
  case Tag.ID:
    var s = this.look.toString();
    var id = this.top.get(this.look);
    if (!id) {
      this.error(this.look.toString() + " undeclared");
    }
    this.move();
    if (this.look.tag != '[' ) {
      return id;
    } else {
      return this.offset(id);
    }
  }
};

module.exports = Parser;
