define(function(require) {
  'use strict';
  var _ = require('underscore');
  var Firebase = require('firebase');
  var module = require('app-module');
  var config = require('config');


  module.run(function($templateCache) {
    $templateCache.put('create-building-popup', require('text!./create-building-popup.html'));
    $templateCache.put('edit-building-popup', require('text!./edit-building-popup.html'));
  });


  function Controller($scope, city, owner, buildings, buildingTypes, locations) {
    'ngInject';
    _.extend($scope, {
      getValidBuildings: getValidBuildings,
      getPhase: getPhase,
      build: build,
      owner: owner,
      city: city,
      buildings: buildings,
      buildingTypes: buildingTypes,
      locations: locations,
      model: {},
    });

    function getPhase() {
      if (!buildings[0])
        return 1;

      var level = buildings[0].level;
      if (level < 5) return 1;
      if (level < 10) return 2;
      if (level < 15) return 3;
      if (level < 20) return 4;
      return 5;
    }

    function build(index, type) {
      city.build(index, type);
    }

    function getValidBuildings(location) {
      return buildingTypes.filter(function(entry) {
        return entry.buildOn.indexOf(location.type) !== -1;
      });
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

    locations: function($firebaseArray) {
      var ref = new Firebase(config.server + '/locations');
      return $firebaseArray(ref);
    },
  };


  return {
    template: require('text!./city.html'),
    controller: Controller,
    resolve: resolve,
  };
});
