'use strict';

/**
 * @ngdoc function
 * @name mpqPartyPlannerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mpqPartyPlannerApp
 */
angular.module('mpqPartyPlannerApp')
  .controller('MainCtrl', function ($scope, $http, $location) {

    var selection = $location.search().selection;
    console.debug(selection);

    $scope.mpqModel = {
      characters: [],
      selectedCharacters: []
    };

    $http.get('data/characters.json').success(function (data) {
      $scope.mpqModel.characters = data;
    });

    $scope.select = function (character) {
      console.log(angular.toJson(character));
      var idx = $scope.mpqModel.selectedCharacters.indexOf(character);
      if (idx > -1) $scope.mpqModel.selectedCharacters.splice(idx, 1);
      else {
        if ($scope.mpqModel.selectedCharacters.length < 3) {
          $scope.mpqModel.selectedCharacters.push(character);
        }
      }
      var searchArray = _.map($scope.mpqModel.selectedCharacters, function(character) {
        return character.name.concat(",",character.stars);
      });
      $location.search({'selection': searchArray});

    };

    $scope.isSelectedCharacter = function (character) {
      return $scope.mpqModel.selectedCharacters.indexOf(character) > -1;
    };

  });
