/* eslint max-nested-callbacks:[2,5] */
define(function(require) {
  'use strict';
  var _ = require('underscore');
  var Firebase = require('firebase');
  var module = require('app-module');
  var config = require('config');
  require('./player');
  require('./building');


  module.factory('City', function($q, $firebaseObject, Player, Building) {
    var City = $firebaseObject.$extend({

      getBuildings: function() {
        var ref = this.$$conf.ref.child('buildings');
        var list = {};

        for (var i = 0; i < 5; i++)
          list[i] = null;

        ref.on('child_added', function(snapshot) {
          console.log('CHILD_ADDED', snapshot.key(), snapshot.val());
          list[snapshot.key()] = new Building(snapshot.val());
        });
        ref.on('child_removed', function(snapshot) {
          console.log('CHILD_REMOVED', snapshot.key(), snapshot.val());
          list[snapshot.key()] = null;
        });

        return list;
      },

      getOwner: function() {
        var ref = this.$$conf.ref;
        return $q(function(resolve) {
          ref.on('value', function(snapshot) {
            var value = snapshot.val();
            resolve(new Player(value.owner));
          });
        });
      },

      build: function(location, type) {
        var model = {
          type: type.$id,
          label: type.name,
          level: 1,
        };
        var building = new Firebase(config.server + '/buildings').push(model);
        this.$$conf.ref.child('buildings').child(location).set(building.key());
        building.child('ref').set('/city/' + this.$id + '/buildings/' + location);
      },
    });

    return function(id) {
      var ref = new Firebase(config.server).child('city').child(id);
      return new City(ref);
    };
  });
});
