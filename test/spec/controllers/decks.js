'use strict';

describe('Controller: DecksCtrl', function () {

  // load the controller's module
  beforeEach(module('ser322finalApp'));

  var DecksCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DecksCtrl = $controller('DecksCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DecksCtrl.awesomeThings.length).toBe(3);
  });
});
