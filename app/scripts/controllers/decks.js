'use strict';

angular.module('ser322finalApp')
  .controller('DecksCtrl', function ($scope, $http) {

    function ColorCombo(name, colors) {
      this.name = name;
      this.colors = colors;
    }
    $scope.refreshDecks = function() {
      $http.get('http://localhost:8080/api/decks').then((res) => {
        $scope.decks = res.data;
        console.log($scope.decks);
      })
    };
    $scope.refreshDecks();

    let white = '../../images/white.jpg';
    let red = '../../images/red.jpg';
    let blue = '../../images/blue.jpg';
    let green = '../../images/green.jpg';
    let black = '../../images/black.jpg';

    $scope.deck = {
      'archetype': null,
      'colorCombo': null,
      'format': null,
      'name': null
    };

    $scope.archetypes = {
      'Control': [
        'MUC',
        'Aggro-Control',
        'Land Destruction',
        'Discard'
      ],
      'Aggro': [
        'Sligh',
        'Red-Deck Wins'
      ],
      'Combo': [
        'Storm',
        'Infinite Combo'
      ]
    };
    $scope.formats = [
      'Standard',
      'Booster Draft',
      'Sealed Deck',
      'Modern',
      'Commander',
      'Legacy',
      'Vintage',
      'Block',
      'Pauper'
    ];
    $scope.colorCombos = [
      new ColorCombo('White', [white]),
      new ColorCombo('Red', [red]),
      new ColorCombo('Green', [green]),
      new ColorCombo('Blue', [blue]),
      new ColorCombo('Black', [black]),
      new ColorCombo('Selesnya', [white, green]),
      new ColorCombo('Orzhov', [white, black]),
      new ColorCombo('Boros', [white, red]),
      new ColorCombo('Azorius', [white, blue]),
      new ColorCombo('Dimir', [blue, black]),
      new ColorCombo('Rakdos', [black, red]),
      new ColorCombo('Golgari', [black, green]),
      new ColorCombo('Izzet', [blue, red]),
      new ColorCombo('Simic', [blue, green]),
      new ColorCombo('Gruul', [red, green]),
      new ColorCombo('Naya', [white, red, green]),
      new ColorCombo('Esper', [white, blue, black]),
      new ColorCombo('Grixis', [blue, black, red]),
      new ColorCombo('Jund', [black, red, green]),
      new ColorCombo('Bant', [white, blue, green]),
      new ColorCombo('Abzan', [white, black, green]),
      new ColorCombo('Temur', [blue, red, green]),
      new ColorCombo('Jeskai', [white, blue, red]),
      new ColorCombo('Mardu', [white, black, red]),
      new ColorCombo('Sultai', [blue, black, green]),
      new ColorCombo('Glint', [blue, black, red, green]),
      new ColorCombo('Dune', [white, black, red, green]),
      new ColorCombo('Ink', [white, blue, red, green]),
      new ColorCombo('Witch', [white, blue, black, green]),
      new ColorCombo('Yore', [white, blue, black, red]),
      new ColorCombo('Five Color', [white, blue, black, red, green])
    ];

    $scope.clearForm = function() {
      $scope.deck = null;
    };

    $scope.saveDeck = function(deck) {
      let saveDeckRequest = $http({
        method: 'post',
        url: 'http://localhost:8080/api/decks/save',
        data: deck
      });
      saveDeckRequest.then(function(res) {
        $scope.clearForm();
        $scope.refreshDecks();
      }).catch(function(res) {
        console.log(res.status);
      });
    };
  });
