'use strict';

class Env {
  constructor(prev) {
    this.prev = prev;
    this.map = new Map();
  }

  put(token, id) {
    this.map.set(token, id);
  }

  get(token) {
    for (var env = this; env !== null; env = env.prev) {
      var found = env.map.get(token);
      if (found) {
        return found;
      }
    }

    return null;
  }
}

module.exports = Env;
