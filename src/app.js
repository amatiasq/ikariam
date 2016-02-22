define(function(require) {
  'use strict';
  require('models/city');
  require('widgets/current-state');
  var _ = require('underscore');
  var angular = require('angular');
  var module = require('app-module');


  module.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    // route('main', '/', equire('./pages/main/main'));
    route('city', '/city/:id', require('pages/city/city'));

    function route(id, url, config) {
      $stateProvider.state(id, _.extend({}, config, { url: url }));
    }
  });


  module.config(function($locationProvider, $httpProvider, cfpLoadingBarProvider) {
    $locationProvider.html5Mode(true);
    $httpProvider.defaults.withCredentials = true;
    cfpLoadingBarProvider.includeSpinner = false;
    // disable IE ajax request caching
    var headers = $httpProvider.defaults.headers;
    headers.get = headers.get || {};
    headers.get['If-Modified-Since'] = 'Sat, 01 Jan 2000 00:00:00 GMT';
  });


  module.run(function($q, $rootScope) {
    // we replace native promise with angular promise which will fire $scope.$apply
    window.Promise = $q;
    window.Promise.resolve = $q.when;

    $rootScope.$on('$stateChangeSuccess', function() {
      document.body.scrollTop = 0;
      // IE & Firefox
      document.documentElement.scrollTop = 0;
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      // This is to prevent uglify to remove this lines
      var console = window.console;
      console.error('Error transitioning from', fromState.name, 'to', toState.name);
      console.error(error.status ? formatRequest(error) : error.message);
    });

    function formatRequest(request) {
      return request.config.method + ' ' + request.config.url + ' (' + request.status + ')';
    }
  });


  angular.bootstrap(document, [ module.name ]);
});
