'use strict';

angular.module('ser322finalApp')
  .service('selected', function () {
    this.deck = null;

    this.setDeck = function(deck) {
      this.deck = deck;
    };

    this.getDeck = function() {
      return this.deck;
    };
  });
