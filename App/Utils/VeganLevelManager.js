'use strict';

var AsyncStorage = require('react-native').AsyncStorage;

class VeganLevelManager {
  constructor() {
    this.veganLevel = 4; // Need a default to start with.
    this.handlers = [];
    AsyncStorage.getItem('vegan_level').then((veganLevel) => {
      if (veganLevel) this.veganLevel = Number(veganLevel);
    });
  }

  set(veganLevel) {
    this.veganLevel = veganLevel;
    this.handlers.forEach((handler) => handler(veganLevel));
    AsyncStorage.setItem('vegan_level', veganLevel.toString());
  }
}

module.exports = new VeganLevelManager();
