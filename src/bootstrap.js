window.DEBUG = true;

window.requirejs.config({
  paths: {
    text: '../bower_components/text/text',
    underscore: '../bower_components/underscore/underscore',
    moment: '../bower_components/moment/moment',
    firebase: '../bower_components/firebase/firebase-debug',
    angularfire: '../bower_components/angularfire/dist/angularfire',
    angular: '../bower_components/angular/angular',
    'angular-router': '../bower_components/angular-ui-router/release/angular-ui-router',
    'ui.bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls',
    'angular-loading-bar': '../bower_components/angular-loading-bar/build/loading-bar',
    'app-module': './module',
  },

  shim: {
    moment: { exports: 'moment' },
    firebase: { exports: 'Firebase' },
    angular: { exports: 'angular' },
    'angular-router': [ 'angular' ],
    'ui.bootstrap': [ 'angular' ],
    'angular-loading-bar': [ 'ui.bootstrap' ],
    angularfire: [ 'firebase', 'angular' ],
  },
})([ 'app' ]);
