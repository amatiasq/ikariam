define(function(require) {
  'use strict';
  require('angularfire');
  require('angular-router');
  require('ui.bootstrap');
  require('angular-loading-bar');
  var angular = require('angular');

  return angular.module('ikariam', [
    'firebase',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
  ]);
});
