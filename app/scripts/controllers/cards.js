'use strict';

angular.module('ser322finalApp')
  .controller('CardsCtrl', function ($scope, $http, selected) {
    $scope.card = {
      name: '',
    };

    $scope.deck = selected.getDeck();

    $scope.searchByName = function(cardName) {
      let url = 'http://localhost:8080/api/cards';
      let urlConfig = {
        url: url,
        method: 'GET',
        params: {
          attribute: 'name',
          value: null,
          deckid: selected.getDeck().id
        }
      };
      console.log(selected.getDeck());
      if (cardName) {
        urlConfig.params.value = cardName;
      }
      $http(urlConfig).then(function(res) {
        $scope.cardResults = res.data;

        $scope.cardResults.forEach(function(card) {
          console.log(card);
          if (!card.quantity) {
            card.newQuantity = 0;
          } else {
            card.newQuantity = card.quantity;
          }
        });
      });
    };

    $scope.addCards = function(card, quantity) {
      let config = {
        url: 'http://localhost:8080/api/decks/addcards',
        method: 'post',
        data: {
          cardID: card.id,
          deckID: selected.getDeck().id,
          quantity: quantity
        }
      };
    console.log(config);
      $http(config).then(function() {
        $scope.cardResults.forEach(function(card) {
          if (card.id === config.data.cardID) {
            card.quantity = quantity;
          }
        });
      });
    };

    $scope.removeCards = function(card) {
      let config = {
        url: 'http://localhost:8080/api/decks/removecards',
        method: 'post',
        data: {
          deckID: selected.getDeck().id,
          cardID: card.id
        }
      };
      $http(config).then(function() {
        $scope.cardResults.forEach(function(card) {
          if (card.id === config.data.cardID) {
            card.newQuantity = 0;
            card.quantity = 0;
          }
        });
      });
    }

  });
