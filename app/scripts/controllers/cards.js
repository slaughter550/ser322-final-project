'use strict';

angular.module('ser322finalApp')
  .controller('CardsCtrl', function ($scope, $http, selected) {
    $scope.card = {
      name: '',
    };

    $scope.deck = selected.getDeck();

    $scope.searchByName = function (cardName) {
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
      $http(urlConfig).then(function (res) {
        $scope.cardResults = res.data;

        $scope.cardResults.forEach(function (card) {
          console.log(card);
          if (card.deckID === selected.getDeck().id) {
            card.newQuantity = card.quantity;
          } else {
            card.quantity = 0;
            card.newQuantity = 0;
          }
        });
      });
    };

    $scope.addCards = function (card, quantity) {
      if (!quantity) {
        return;
      }
      let config = {
        url: 'http://localhost:8080/api/decks/addcards',
        method: 'post',
        data: {
          cardID: card.id,
          deckID: selected.getDeck().id,
          quantity: quantity
        }
      };
      $http(config).then(function () {
        $scope.cardResults.forEach(function (card) {
          if (card.id === config.data.cardID && card.deckID === config.data.deckID) {
            card.quantity = quantity;
          } else {
            card.quantity = 0;
          }
        });
      });
    };

    $scope.removeCards = function (card) {
      let config = {
        url: 'http://localhost:8080/api/decks/removecards',
        method: 'post',
        data: {
          deckID: selected.getDeck().id,
          cardID: card.id
        }
      };
      $http(config).then(function () {
        $scope.cardResults.forEach(function (card) {
          if (card.id === config.data.cardID && card.deckID === selected.getDeck().id) {
            card.newQuantity = 0;
            card.quantity = 0;
          }
        });
      });
    };

  });
