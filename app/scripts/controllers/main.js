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

    $scope.mpqModel = {
      characters: [],
      selectedCharacters: [],
      teamActiveAbilities: {},
      teamActiveColors: []
    };

    $scope.colors = ['yellow', 'red', 'blue', 'purple', 'green', 'black']

    var searchName = function(character) {
      return character.name.concat(",",character.stars);
    };

    var teamActiveAbilities = function() {
      var abilities = _.flatten(_.map($scope.mpqModel.selectedCharacters, function(character) {
        return character.abilities;
      }));
      return _.groupBy(_.filter(abilities, function(ability) {
        return ability.cost > 0;
      }), function(ability) {
        return ability.color.toLowerCase();
      });
    };

    var setState = function() {
      $scope.mpqModel.teamActiveAbilities = teamActiveAbilities();
      $scope.mpqModel.teamActiveColors = _.keys($scope.mpqModel.teamActiveAbilities);
    };

    $scope.isActive = function(color) {
      var active = $scope.mpqModel.teamActiveColors.indexOf(color.toLowerCase()) !== -1;
      return active;
    };

    $scope.isIneligible = function(character) {
      if ($scope.mpqModel.selectedCharacters.indexOf(character) !== -1) {
        return false;
      } else {
        var eligible = _.every(character.abilities, function (ability) {
          // return true if this ability does not contribute to the team's active colors
          var eligibility = (ability.cost === 0 || $scope.mpqModel.teamActiveColors.indexOf(ability.color.toLowerCase()) !== -1);
          return eligibility;
        });
        return eligible;
      }
    };

    $http.get('data/characters.json').success(function (data) {
      $scope.mpqModel.characters = data;

      var selection = $location.search().selection || [];
      $scope.mpqModel.selectedCharacters = _.filter($scope.mpqModel.characters, function(character) {

        var search = searchName(character);
        if (character.name !== '' && selection.indexOf(search) !== -1) {
          return true;
        } else {
          return false;
        }
      });

      setState();
    });

    $scope.select = function (character) {
      var idx = $scope.mpqModel.selectedCharacters.indexOf(character);
      if (idx > -1) $scope.mpqModel.selectedCharacters.splice(idx, 1);
      else {
        if ($scope.mpqModel.selectedCharacters.length < 3) {
          $scope.mpqModel.selectedCharacters.push(character);
        }
      }
      var searchArray = _.map($scope.mpqModel.selectedCharacters, function(character) {
        return searchName(character);
      });
      $location.search({'selection': searchArray});
      setState();
    };

    $scope.isSelectedCharacter = function (character) {
      return $scope.mpqModel.selectedCharacters.indexOf(character) > -1;
    };

    $scope.isSelectedCharacterName = function (character) {
      if ($scope.mpqModel.selectedCharacters.indexOf(character) !== -1) {
        return false;
      } else {
        return !_.every($scope.mpqModel.selectedCharacters, function (selectedCharacter) {
          var compare = selectedCharacter.name !== character.name;
          console.log(character.name.concat(' ', selectedCharacter.name, ' ', compare));
          return compare;
        });
      }
    };

  });
