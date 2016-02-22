define(function(require) {
  'use strict';
  var _ = require('underscore');
  var Firebase = require('firebase');
  var config = require('config');


  function Controller($scope, city, owner, buildings, buildingTypes) {
    'ngInject';
    _.extend($scope, {
      build: build,
      owner: owner,
      city: city,
      buildings: buildings,
      buildingTypes: buildingTypes,
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
