define(function(require) {
  'use strict';
  var _ = require('underscore');
  var Firebase = require('firebase');


  function Server(server, api) {
    this._server = server;
    this._api = api;
  }


  _.extend(Server.prototype, {
    getCity: function(id) {
      var ref = new Firebase(this._server + id);
    },
  });


  return Server;
});
