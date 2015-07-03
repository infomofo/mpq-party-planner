'use strict';

/**
 * @ngdoc function
 * @name mpqPartyPlannerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mpqPartyPlannerApp
 */
angular.module('mpqPartyPlannerApp')
  .controller('MainCtrl', function ($scope, $http) {

    $scope.mpqModel = {
      characters: []
    };

    $http.get('data/characters.json').success(function(data) {
      $scope.mpqModel.characters = data;
    });
  });
