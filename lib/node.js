'use strict';

var Node = function () {
  this.lexline = Lexer.line;
};

Node.prototype.lexline = 0;

Node.prototype.error = function (str) {
  throw new Error("near line " + this.lexline + ": " + str);
};

Node.labels = 0;
Node.prototype.newlabel = function () {
  return ++Node.labels;
};

Node.prototype.emitlabel = function (i) {
  process.stdout.write("L" + i + ":");
};

Node.prototype.emit = function (str) {
  console.log("\t" + str);
};

module.exports = Node;
