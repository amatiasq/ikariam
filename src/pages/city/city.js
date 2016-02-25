define(function(require) {
  'use strict';
  var _ = require('underscore');
  var Firebase = require('firebase');
  var config = require('config');
  var locations = [
    { type: 'land' },
    { type: 'shore' },
    { type: 'shore' },
    { type: 'land' },
    { type: 'land' },
    { type: 'land' },
    { type: 'land' },
    { type: 'land' },
    { type: 'land' },
    { type: 'land' },
    { type: 'land' },
    { type: 'land' },
    { type: 'land' },
    { type: 'locked' },
    { type: 'wall' },
    { type: 'land' },
    { type: 'land' },
    { type: 'sea' },
    { type: 'land' },
  ];

/*
<div class="position0 building townHall level10">
<div class="position1 building constructionSite animated">
<div class="position2 building shipyard level2">
<div class="position3 building forester level1">
<div class="position4 building palace level2">
<div class="position5 building barracks level6">
<div class="position6 building embassy level2">
<div class="position7 building safehouse level2">
<div class="position8 building warehouse level4">
<div class="position9 building academy level7">
<div class="position10 building buildingGround land">
<div class="position11 building tavern level5">
<div class="position12 building carpentering level7">
<div class="lockedPosition position13" title="¡Para construir aquí tenés que investigar &quot;Burocracia&quot;!">
<div class="position14 building wall level3">
<div class="position15 building buildingGround land">
<div class="position16 building branchOffice level5">
<div class="position17 building pirateFortress level1">
<div class="position18 building winegrower level1">
*/

  function Controller($scope, city, owner, buildings, buildingTypes) {
    'ngInject';
    _.extend($scope, {
      build: build,
      owner: owner,
      city: city,
      buildings: buildings,
      buildingTypes: buildingTypes,
      locations: locations,
      model: {},
    });

    function build(location) {
      var type = $scope.model.newBuilding;
      $scope.model.newBuilding = null;
      city.build(location, type);
    }
  }


  var resolve = {
    city: function($stateParams, City) {
      'ngInject';
      return new City($stateParams.id);
      // return server.getCity($stateParams.id);
    },

    owner: function(city) {
      'ngInject';
      return city.getOwner();
    },

    buildings: function(city) {
      'ngInject';
      return city.getBuildings();
    },

    buildingTypes: function($firebaseArray) {
      var ref = new Firebase(config.server + '/building-types');
      return $firebaseArray(ref);
    },
  };


  return {
    template: require('text!./city.html'),
    controller: Controller,
    resolve: resolve,
  };
});
