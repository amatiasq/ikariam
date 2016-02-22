define(function(require) {
  'use strict';
  var Firebase = require('firebase');
  var module = require('app-module');
  var config = require('config');


  module.factory('Player', function($firebaseObject) {
    var Player = $firebaseObject.$extend({});

    return function(id) {
      var ref = new Firebase(config.server).child('players').child(id);
      return new Player(ref);
    };
  });
});
