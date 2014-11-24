var Env = function (prev) {
  this.prev = prev;
  this.map = new Map();
};

Env.prototype.put = function (token, id) {
  this.map.set(token, id);
};

Env.prototype.get = function (token) {
  for (var env = this; env != null; env = env.prev) {
    var found = env.map.get(token);
    if (found) {
      return found;
    }
  }
  return null;
};

module.exports = Env;
