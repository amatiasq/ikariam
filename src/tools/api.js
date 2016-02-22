define(function(require) {
  'use strict';
  var _ = require('underscore');


  function API(ajax, prefix, options) {
    this._ajax = ajax;
    this._prefix = prefix;
    this._options = options;
  }


  API.prototype = {
    constructor: API,

    prefix: function(value) {
      return new API(this._ajax, this._prefix + value, this._options);
    },

    configure: function(options) {
      return new API(this._ajax, this._prefix, merge(this._options, options));
    },


    get: function(url, params, options) {
      return this.call('GET', url, null, merge(options, { params: params }));
    },

    post: function(url, data, options) {
      return this.call('POST', url, data, options);
    },

    put: function(url, data, options) {
      return this.call('PUT', url, data, options);
    },

    delete: function(url, data, options) {
      return this.call('DELETE', url, data, options);
    },


    call: function(method, url, data, options) {
      if (typeof url === 'object') {
        options = data;
        data = url;
        url = null;
      }

      var settings = merge(this._options, options);
      var config = _.extend(_.omit(settings, 'getRequest'), {
        url: this._prefix + (url || ''),
        method: method,
        data: data,
      });

      return this._ajax(config).then(settings.getRequest ? null : getData);
    },
  };


  return API;


  function merge(a, b) {
    var config = _.extend({}, a, b);
    config.params = _.extend({}, a && a.params, b && b.params);
    return config;
  }

  function getData(item) {
    return item.data;
  }
});
