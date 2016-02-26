define(function(require) {
  'use strict';
  var Firebase = require('firebase');
  var module = require('app-module');
  var config = require('config');


  module.factory('Building', function($firebaseObject) {
    var Building = $firebaseObject.$extend({

      canUpgrade: function() {
        return this.level < 32;
      },

      canDowngrade: function() {
        return this.type !== 'townHall' || this.level > 1;
      },

      upgrade: function() {
        this.level++;
        return this.$save();
      },

      downgrade: function() {
        if (this.level === 1)
          return this.destroy();

        this.level--;
        return this.$save();
      },

      destroy: function() {
        new Firebase(config.server + this.ref).remove();
        this.$remove();
      },
    });

    return function(id) {
      var ref = new Firebase(config.server).child('buildings').child(id);
      return new Building(ref);
    };
  });
});
