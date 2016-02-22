define(function(require) {
  'use strict';
  var _ = require('underscore');
  var guid = require('tools/guid');


  return {
    syncMethods: syncMethods,
    executeOnce: executeOnce,
    syncVersion: syncVersion,
    storeLast: storeLast,
    lastCall: lastCall,
    debounce: debounce,
  };


  function debounce(fn) {
    var promise = null;
    return _.extend(wrapperDebounce, fn);

    function wrapperDebounce() {
      if (!promise) {
        promise = fn.apply(this, arguments).finally(function() {
          promise = null;
        });
      }
      return promise;
    }
  }


  function lastCall(fn) {
    var lastID;
    return wrapperLastCall;

    function wrapperLastCall() {
      var id = guid();
      lastID = id;

      return fn.apply(this, arguments).then(function(value) {
        if (id !== lastID)
          throw new Error('Obsolete response');
        return value;
      });
    }
  }


  function executeOnce(fn) {
    var promise;
    _.extend(wrapperExecuteOnce, fn, { reset: reset });
    return wrapperExecuteOnce;

    function reset() {
      promise = null;
    }

    function wrapperExecuteOnce() {
      if (!promise)
        promise = fn.apply(this, arguments);
      return promise;
    }
  }


  function storeLast(fn) {
    var value;
    _.extend(wrapperStoreLast, fn, { getLastValue: getLastValue });
    return wrapperStoreLast;

    function getLastValue() {
      return value;
    }

    function wrapperStoreLast() {
      return fn.apply(this, arguments).then(function(result) {
        value = result;
        return result;
      });
    }
  }

  function syncVersion(fn) {
    var hasExecuted = false;
    var value;
    return _.extend(getValue, fn, {
      reset: reset,
      setValue: setValue,
      async: wrapperSyncVersion,
    });

    function setValue(val) {
      if (this.emitChange)
        this.emitChange();

      hasExecuted = true;
      value = val;
      return value;
    }

    function getValue() {
      if (!hasExecuted)
        wrapperSyncVersion.apply(this, arguments);
      return value;
    }

    function reset() {
      hasExecuted = false;
      value = null;
    }

    function wrapperSyncVersion() {
      hasExecuted = true;
      return fn.apply(this, arguments).then(setValue.bind(this));
    }
  }

  function syncMethods(object, methods) {
    onChangeEvent(object);

    return methods.forEach(function(method) {
      var original = object[method];
      var replacement = syncVersion(original);
      object[method] = replacement.async;
      object[method + 'Sync'] = replacement;
      object[method].setValue = replacement.setValue;
      object[method].reset = replacement.reset;
      object[method].restore = restore;

      function restore() {
        object[method] = original;
      }
    });
  }

  function onChangeEvent(object) {
    var listeners = [];
    var timer = null;

    _.extend(object, {
      emitChange: schedule,
      onChange: listen,
    });


    function schedule() {
      if (timer === null)
        timer = setTimeout(fire, 0);
    }

    function fire() {
      timer = null;
      listeners.forEach(function(handler) {
        handler(object);
      });
    }

    function listen(handler) {
      if (listeners.indexOf(handler) !== -1)
        return;

      listeners.push(handler);
      schedule();
    }
  }
});
