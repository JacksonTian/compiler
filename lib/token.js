var Token = function (tag) {
  this.tag = tag;
};

Token.prototype.toString = function () {
  return '' + this.tag;
};

module.exports = Token;
