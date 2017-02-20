'use strict';

angular.module('ser322finalApp')
  .controller('CardsCtrl', function ($scope, $http) {
    $scope.card = {
      name: '',
    };


    $scope.searchByName = function(cardName) {
      $http.get('http://localhost:8080/api/cards/name/' + cardName).then(function(res) {
        $scope.cardResults = res.data;
      });
    }

  });
