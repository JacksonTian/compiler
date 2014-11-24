var Parser = function (tokens) {
  this.tokens = tokens;
};

Parser.prototype.parse = function () {
  var exps = this.split(this.tokens);
  var parser = this;
  var childs = exps.map(function (exp) {
    return parser.parseExp(exp);
  });
  return childs;
};

Parser.prototype.split = function () {
  var expressions = [];
  var exp = [];
  for (var i = 0; i < this.tokens.length; i++) {
    var token = this.tokens[i];
    exp.push(token);
    if (token.type === 'semicolon') {
      expressions.push(exp);
      exp = [];
    }
  }
  // handle the reset
  if (exp.length) {
    expressions.push(exp);
  }
  return expressions;
};

Parser.prototype.parseExp = function (exp) {
  var root = {
    child: []
  };

  var ref = root;

  for (var i = 0; i < exp.length; i++) {
    var token = exp[i];
    if (token.type === 'oprator') {
      var tree = {
        token: token,
        child: []
      };
      // 向左还是向右
      if (token.value === '*' || token.value === '/') {
        ref.child.push(tree);
        ref = tree;
      } else {
        tree.child.push(ref);
        ref = tree;
      }
    } else {
      ref.child.push(token);
    }
  }
  return root;
};

module.exports = Parser;
