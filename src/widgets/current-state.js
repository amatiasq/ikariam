define(function(require) {
  'use strict';
  var module = require('app-module');

  module.directive('amqCurrentState', function($rootScope) {
    return {
      restrict: 'A',
      link: link,
    };


    function link(scope, element, attr) {
      var prefix = attr.amqCurrentState || '';
      var classes = [];

      $rootScope.$on('$stateChangeSuccess', function(event, state) {
        updateElement(state.name.split('.'));
      });

      function updateElement(values) {
        var newClasses = values.map(function(value) {
          return prefix + value;
        });

        classes.forEach(element.removeClass.bind(element));
        newClasses.forEach(element.addClass.bind(element));
        classes = newClasses;
      }
    }
  });
});
