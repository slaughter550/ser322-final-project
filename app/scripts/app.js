'use strict';

angular
  .module('ser322finalApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ngMaterial'
  ])
  .config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('cards', {
      url: '/',
      templateUrl: '/views/cards.html',
      controller: 'CardsCtrl'
    })

    .state('decks', {
      url: '/decks',
      templateUrl: '/views/decks.html',
      controller: 'DecksCtrl'
    });
  });
