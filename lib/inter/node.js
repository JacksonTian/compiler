'use strict';

class Node {
  constructor(line) {
    if (typeof line !== 'number') {
      throw new TypeError();
    }

    this.lexline = line;
  }

  error(str) {
    throw new Error('near line ' + this.lexline + ': ' + str);
  }

  newlabel() {
    return ++Node.labels;
  }

  emitlabel(i) {
    process.stdout.write('L' + i + ':');
  }

  emit(str) {
    console.log('\t' + str);
  }
}

Node.labels = 0;

module.exports = Node;
