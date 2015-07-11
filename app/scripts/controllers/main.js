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
      teamActiveColors: [],
      sortPredicate: 'rank'
    };

    $scope.colors = ['yellow', 'red', 'blue', 'purple', 'green', 'black'];

    var searchName = function(character) {
      if (angular.isDefined(character.name)) {
        return character.name.concat(",", character.stars);
      } else {
        return '';
      }
    };

    var teamActiveAbilities = function() {
      var abilities = _.flatten(_.map($scope.mpqModel.selectedCharacters, function(character) {
        return character.abilities;
      }));
      return _.groupBy(_.filter(abilities, function(ability) {
        return ability.cost !== 0;
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

    $scope.isCandidate = function(character) {
      if ($scope.mpqModel.selectedCharacters.indexOf(character) !== -1 || $scope.mpqModel.selectedCharacters.length > 2) {
        return false;
      } else {
        var charColors = _.map(_.filter(character.abilities, function(ability) {
          return ability.cost !== 0;
        }), function(ability) {
            return ability.color.toLowerCase();
          });
        var combinedColors = _.union(charColors, $scope.mpqModel.teamActiveColors);
        if (combinedColors.length >= 6) {
          return true;
        } else if ($scope.mpqModel.selectedCharacters.length < 2 ) {
          var candidate = _.every(character.abilities, function (ability) {
            // return true if this ability does contribute to the team's active colors
            var eligibility = (ability.cost === 0 || $scope.mpqModel.teamActiveColors.indexOf(ability.color.toLowerCase()) === -1);
            return eligibility;
          });
          return candidate;
        } else {
          return false;
        }
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
      if (idx > -1) {
        $scope.mpqModel.selectedCharacters.splice(idx, 1);
      }
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

    $scope.clearSelection = function() {
      $scope.mpqModel.selectedCharacters = [];
      $location.search('selection', null);
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
          return compare;
        });
      }
    };

    var tileImage = {
      yellow: 'images/YellowTile.png',
      red: 'images/RedTile.png',
      blue: 'images/BlueTile.png',
      purple: 'images/PurpleTile.png',
      green: 'images/GreenTile.png',
      black: 'images/BlackTile.png'
    };
    $scope.getTileImage = function(color) {
      return tileImage[color];
    };

    var flagImage = {
      yellow: 'images/YellowFlag.png',
      red: 'images/RedFlag.png',
      blue: 'images/BlueFlag.png',
      purple: 'images/PurpleFlag.png',
      green: 'images/GreenFlag.png',
      black: 'images/BlackFlag.png'
    };
    $scope.getFlagImage = function(color) {
      return flagImage[color];
    };
  });
