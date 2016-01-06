'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _comm = require('./comm');

var _comm2 = _interopRequireDefault(_comm);

var _displayView = require('./display/View');

var _displayView2 = _interopRequireDefault(_displayView);

/**
 * @private
 */

var Promised = (function (_EventEmitter) {
  _inherits(Promised, _EventEmitter);

  function Promised() {
    _classCallCheck(this, Promised);

    _get(Object.getPrototypeOf(Promised.prototype), 'constructor', this).call(this);
    /**
     * [resolvePromised description]
     * @todo description
     * @type {function}
     * @private
     */
    this.resolvePromised = null;
  }

  /**
   * @private
   */

  _createClass(Promised, [{
    key: 'createPromise',
    value: function createPromise() {
      var _this = this;

      return new _Promise(function (resolve) {
        return _this.resolvePromised = resolve;
      });
    }
  }, {
    key: 'launch',
    value: function launch() {}
  }]);

  return Promised;
})(_events.EventEmitter);

var Sequential = (function (_Promised) {
  _inherits(Sequential, _Promised);

  function Sequential(modules) {
    _classCallCheck(this, Sequential);

    _get(Object.getPrototypeOf(Sequential.prototype), 'constructor', this).call(this);

    this.modules = modules;
  }

  /**
   * @private
   */

  _createClass(Sequential, [{
    key: 'createPromise',
    value: function createPromise() {
      var mod = null;
      var promise = null;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function () {
          var next = _step.value;

          if (mod !== null) promise.then(function () {
            return next.launch();
          });

          mod = next;
          promise = mod.createPromise();
        };

        for (var _iterator = _getIterator(this.modules), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return promise;
    }
  }, {
    key: 'launch',
    value: function launch() {
      return this.modules[0].launch();
    }
  }]);

  return Sequential;
})(Promised);

var Parallel = (function (_Promised2) {
  _inherits(Parallel, _Promised2);

  function Parallel(modules) {
    _classCallCheck(this, Parallel);

    _get(Object.getPrototypeOf(Parallel.prototype), 'constructor', this).call(this);

    this.modules = modules;
  }

  /**
   * [client] Base class used to create any *Soundworks* module on the client side.
   *
   * Each module should have a {@link Module#start}, a {@link Module#reset}, a {@link Module#restart} and a {@link Module#done} methods.
   *
   * The base class optionally creates a view (a fullscreen `div` accessible through the {@link Module.view} attribute).
   * The view is added to the DOM (as a child of the `#container` element) when the module is started (with the {@link Module#start} method), and removed when the module calls its {@link Module#done} method.
   *
   * (See also {@link src/server/Module.js~Module} on the server side.)
   *
   * **Note:** a more complete example of how to write a module is in the [Example](manual/example.html) section.
   *
   * @example class MyModule extends Module {
   *   constructor(options = {}) {
   *     // This example module:
   *     // - always has a view
   *     // - has the id and class 'my-module-name'
   *     // - and uses the background color defined in the argument 'options' (if any).
   *     super('my-module-name', true, options.color || 'alizarin');
   *
   *     ... // anything the constructor needs
   *   }
   *
   *   start() {
   *     super.start();
   *
   *     // Whatever the module does (communication with the server, etc.)
   *     // ...
   *
   *     // Call the `done` method when the module has finished its initialization
   *     this.done();
   *   }
   * }
   * @todo Move example in the manual?
   */

  _createClass(Parallel, [{
    key: 'showNext',
    value: function showNext() {
      var length = this.modules.length;

      for (var i = 0; i < length; i++) {
        var mod = this.modules[i];
        var isVisible = mod.show();
        if (isVisible) {
          break;
        }
      }
    }
  }, {
    key: 'createPromise',
    value: function createPromise() {
      var _this2 = this;

      var promises = [];

      this.modules.forEach(function (mod, index) {
        var promise = mod.createPromise();
        // hide all modules except the first one
        mod.hide();
        promise.then(function () {
          _this2.showNext();
        });
        promises.push(promise);
      });

      this.showNext();

      return _Promise.all(promises);
    }
  }, {
    key: 'launch',
    value: function launch() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _getIterator(this.modules), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var mod = _step2.value;

          mod.launch();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);

  return Parallel;
})(Promised);

var ClientModule = (function (_Promised3) {
  _inherits(ClientModule, _Promised3);

  /**
   * @param {String} name Name of the module (used as the `id` and CSS class of the `view` DOM element if it exists).
   * @param {Boolean} [createView=true] Indicates whether the module displays a `view` or not.
   * @param {[type]} [color='black'] Background color of the `view` when it exists.
   */

  function ClientModule(name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, ClientModule);

    // TODO: change to colorClass?
    _get(Object.getPrototypeOf(ClientModule.prototype), 'constructor', this).call(this);

    this._bypass = options.bypass || false;

    /**
     * Name of the module.
     * @type {String}
     */
    this.name = name;

    /**
     * View of the module.
     * @type {View}
     */
    this.view = null;

    /**
     * Events to bind to the view. (cf. Backbone's syntax).
     * @type {Object}
     */
    this.events = {};

    /**
     * Additionnal options to pass to the view.
     * @type {Object}
     */
    this.viewOptions = options.viewOptions || {};

    /**
     * Defines a view constructor to be used in createView
     * @type {View}
     */
    this.viewCtor = options.viewCtor || _displayView2['default'];

    /** @private */
    this._template = null;

    // bind com methods to the instance.
    this.send = this.send.bind(this);
    this.receive = this.receive.bind(this);
    this.removeListener = this.removeListener.bind(this);
  }

  /**
   * Share the defined templates with all `ClientModule` instances.
   * @param {Object} defs - An object containing the templates.
   * @private
   */

  _createClass(ClientModule, [{
    key: 'createView',

    /**
     * Create a default view from module attributes.
     */
    value: function createView() {
      var options = _Object$assign({ id: this.name, className: 'module' }, this.viewOptions);
      return new this.viewCtor(this.template, this.content, this.events, options);
    }

    /**
     * @private
     */
  }, {
    key: 'launch',
    value: function launch() {
      if (this._isDone) {
        this.restart();
      } else {
        if (this._isStarted) this.reset();

        this.start();
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      var reInit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
    }

    /**
     * Handle the logic and steps that lead to the initialization of the module.
     *
     * For instance, it takes care of the communication with the module on the server side by sending WebSocket messages and setting up WebSocket message listeners.
     *
     * Additionally, if the module has a `view`, the `start` method creates the corresponding HTML element and appends it to the DOM’s main container element (`div#container`).
     *
     * **Note:** the method is called automatically when necessary, you should not call it manually.
     * @abstract
     */
  }, {
    key: 'start',
    value: function start() {
      // allow to bypass a module from its options
      if (this._bypass) {
        this.done();
      }

      // if (!this._isStarted) { // @todo - confirm this is not needed
      if (this.view) {
        this.view.render();
        this.view.appendTo(this.$container);
      }

      this._isStarted = true;
      // }
    }

    /**
     * Restart the module.
     *
     * The method is called automatically when a lost connection with the server is resumed (for instance because of a server crash), if the module had already finished its initialization (*i.e.* if it had called its {@link Module#done} method).
     * The method should send to the server the current state of the module.
     *
     * (Indeed, if the server crashes, it will reset all the information it has about all the clients.
     * On the client side, the modules that had finished their initialization process should send their state to the server so that it can be up to date with the real state of the scenario.)
     *
     * For instance, this method in the {@link Locator} module sends the coordinates of the client to the server.
     *
     * **Note:** the method is called automatically when necessary, you should not call it manually.
     * @abstract
     */
  }, {
    key: 'restart',
    value: function restart() {
      this._isDone = false;
    }

    /**
     * Reset the module to the state it had before calling the {@link Module#start} method.
     *
     * The method is called automatically when a lost connection with the server is resumed (for instance because of a server crash), if the module had not finished its initialization (*i.e.* if it had not called its {@link Module#done} method).
     * In that case, the module cleans whatever it was doing and starts again from scratch.
     *
     * **Note:** the method is called automatically when necessary, you should not call it manually.
     * @abstract
     */
  }, {
    key: 'reset',
    value: function reset() {
      if (this.view) {
        this.view.remove();
      }

      this._isStarted = false;
    }

    /**
     * Should be called when the module has finished its initialization (*i.e.* when the module has done its duty, or when it may run in the background for the rest of the scenario after it finished its initialization process), to allow subsequent steps of the scenario to start.
     *
     * For instance, the {@link Loader} module calls its {@link Module#done} method when files are loaded, and the {@link Sync} module calls it when the first synchronization process is finished (while the module keeps running in the background afterwards).
     * As an exception, the last module of the scenario (usually the {@link Performance} module) may not call its {@link Module#done} method.
     *
     * If the module has a `view`, the `done` method removes it from the DOM.
     *
     * **Note:** you should not override this method.
     */
  }, {
    key: 'done',
    value: function done() {
      this._isDone = true;

      this.reset();

      if (this.resolvePromised) this.resolvePromised();
    }

    /**
     * @private
     * @todo - doc
     */
  }, {
    key: 'show',
    value: function show() {
      if (this.view && !this._isDone) {
        if (!this.view.isVisible) {
          this.view.show();
        }

        return true;
      }

      return false;
    }

    /**
     * @private
     * @todo - doc
     */
  }, {
    key: 'hide',
    value: function hide() {
      if (this.view && !this._done) {
        this.view.hide();
      }
    }

    /**
     * Sends a WebSocket message to the server side socket.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
  }, {
    key: 'send',
    value: function send(channel) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      _comm2['default'].send.apply(_comm2['default'], [this.name + ':' + channel].concat(args));
    }

    /**
     * Sends a WebSocket message to the server side socket.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
  }, {
    key: 'sendVolatile',
    value: function sendVolatile(channel) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      _comm2['default'].sendVolatile.apply(_comm2['default'], [this.name + ':' + channel].concat(args));
    }

    /**
     * Listen a WebSocket message from the server.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
     * @param {...*} callback - The callback to execute when a message is received.
     */
  }, {
    key: 'receive',
    value: function receive(channel, callback) {
      _comm2['default'].receive(this.name + ':' + channel, callback);
    }

    /**
     * Stop listening to a message from the server.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
     * @param {...*} callback - The callback to cancel.
     */
  }, {
    key: 'removeListener',
    value: function removeListener(channel, callback) {
      _comm2['default'].removeListener(this.name + ':' + channel, callback);
    }
  }, {
    key: 'template',

    /**
     * Returns the template associated to the current module.
     * @returns {Function} - The template related to the `name` of the current module.
     */
    get: function get() {
      var template = this._template || this.templateDefinitions[this.name];
      // if (!template)
      //   throw new Error(`No template defined for module "${this.name}"`);
      return template;
    },
    set: function set(tmpl) {
      this._template = tmpl;
    }

    /**
     * Returns the text associated to the current module.
     * @returns {Object} - The text contents related to the `name` of the current module. The returned object is extended with a pointer to the `_globals` entry of the defined text contents.
     */
  }, {
    key: 'content',
    get: function get() {
      var content = this._content || this.contentDefinitions[this.name];

      if (content) content._globals = this.contentDefinitions._globals;

      return content;
    },
    set: function set(obj) {
      this._content = obj;
    }
  }], [{
    key: 'setViewTemplateDefinitions',
    value: function setViewTemplateDefinitions(defs) {
      ClientModule.prototype.templateDefinitions = defs;
    }

    /**
     * Share the text content configuration (name and data) with all the `ClientModule` instances
     * @param {Object} defs - The text contents of the application.
     * @private
     */
  }, {
    key: 'setViewContentDefinitions',
    value: function setViewContentDefinitions(defs) {
      ClientModule.prototype.contentDefinitions = defs;
    }

    /**
     * Sets the container of the views for all `ClientModule` instances.
     * @param {Element} $el - The element to use as a container for the module's view.
     */
  }, {
    key: 'setViewContainer',
    value: function setViewContainer($el) {
      ClientModule.prototype.$container = $el;
    }
  }]);

  return ClientModule;
})(Promised);

exports['default'] = ClientModule;

ClientModule.sequential = function () {
  for (var _len3 = arguments.length, modules = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    modules[_key3] = arguments[_key3];
  }

  return new Sequential(modules);
};

ClientModule.parallel = function () {
  for (var _len4 = arguments.length, modules = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    modules[_key4] = arguments[_key4];
  }

  return new Parallel(modules);
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50TW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQTZCLFFBQVE7O29CQUNwQixRQUFROzs7OzJCQUNSLGdCQUFnQjs7Ozs7Ozs7SUFLM0IsUUFBUTtZQUFSLFFBQVE7O0FBQ0QsV0FEUCxRQUFRLEdBQ0U7MEJBRFYsUUFBUTs7QUFFViwrQkFGRSxRQUFRLDZDQUVGOzs7Ozs7O0FBT1IsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7R0FDN0I7Ozs7OztlQVZHLFFBQVE7O1dBWUMseUJBQUc7OztBQUNkLGFBQU8sYUFBWSxVQUFDLE9BQU87ZUFBSyxNQUFLLGVBQWUsR0FBRyxPQUFPO09BQUEsQ0FBQyxDQUFDO0tBQ2pFOzs7V0FFSyxrQkFBRyxFQUVSOzs7U0FsQkcsUUFBUTs7O0lBd0JSLFVBQVU7WUFBVixVQUFVOztBQUNILFdBRFAsVUFBVSxDQUNGLE9BQU8sRUFBRTswQkFEakIsVUFBVTs7QUFFWiwrQkFGRSxVQUFVLDZDQUVKOztBQUVSLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0dBQ3hCOzs7Ozs7ZUFMRyxVQUFVOztXQU9ELHlCQUFHO0FBQ2QsVUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2YsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDOzs7Ozs7OztjQUVWLElBQUk7O0FBQ1gsY0FBSSxHQUFHLEtBQUssSUFBSSxFQUNkLE9BQU8sQ0FBQyxJQUFJLENBQUM7bUJBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRTtXQUFBLENBQUMsQ0FBQzs7QUFFcEMsYUFBRyxHQUFHLElBQUksQ0FBQztBQUNYLGlCQUFPLEdBQUcsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDOzs7QUFMaEMsMENBQWlCLElBQUksQ0FBQyxPQUFPLDRHQUFFOztTQU05Qjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7V0FFSyxrQkFBRztBQUNQLGFB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QUFQLFdBQU87OztBQUMzQyxTQUFPLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQ2hDLENBQUM7O0FBRUYsWUFBWSxDQUFDLFFBQVEsR0FBRyxZQUFxQjtxQ0FBVCxPQUFPO0FBQVAsV0FBTzs7O0FBQ3pDLFNBQU8sSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDOUIsQ0FBQyIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudE1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgY29tbSBmcm9tICcuL2NvbW0nO1xuaW1wb3J0IFZpZXcgZnJvbSAnLi9kaXNwbGF5L1ZpZXcnO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIFByb21pc2VkIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvKipcbiAgICAgKiBbcmVzb2x2ZVByb21pc2VkIGRlc2NyaXB0aW9uXVxuICAgICAqIEB0b2RvIGRlc2NyaXB0aW9uXG4gICAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5yZXNvbHZlUHJvbWlzZWQgPSBudWxsO1xuICB9XG5cbiAgY3JlYXRlUHJvbWlzZSgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHRoaXMucmVzb2x2ZVByb21pc2VkID0gcmVzb2x2ZSk7XG4gIH1cblxuICBsYXVuY2goKSB7XG5cbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIFNlcXVlbnRpYWwgZXh0ZW5kcyBQcm9taXNlZCB7XG4gIGNvbnN0cnVjdG9yKG1vZHVsZXMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5tb2R1bGVzID0gbW9kdWxlcztcbiAgfVxuXG4gIGNyZWF0ZVByb21pc2UoKSB7XG4gICAgbGV0IG1vZCA9IG51bGw7XG4gICAgbGV0IHByb21pc2UgPSBudWxsO1xuXG4gICAgZm9yIChsZXQgbmV4dCBvZiB0aGlzLm1vZHVsZXMpIHtcbiAgICAgIGlmIChtb2QgIT09IG51bGwpXG4gICAgICAgIHByb21pc2UudGhlbigoKSA9PiBuZXh0LmxhdW5jaCgpKTtcblxuICAgICAgbW9kID0gbmV4dDtcbiAgICAgIHByb21pc2UgPSBtb2QuY3JlYXRlUHJvbWlzZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgbGF1bmNoKCkge1xuICAgIHJldHVybiB0aGlzLm1vZHVsZXNbMF0ubGF1bmNoKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBQYXJhbGxlbCBleHRlbmRzIFByb21pc2VkIHtcbiAgY29uc3RydWN0b3IobW9kdWxlcykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm1vZHVsZXMgPSBtb2R1bGVzO1xuICB9XG5cbiAgc2hvd05leHQoKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5tb2R1bGVzLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG1vZCA9IHRoaXMubW9kdWxlc1tpXTtcbiAgICAgIGNvbnN0IGlzVmlzaWJsZSA9IG1vZC5zaG93KCk7XG4gICAgICBpZiAoaXNWaXNpYmxlKSB7IGJyZWFrOyB9XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlUHJvbWlzZSgpIHtcbiAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuXG4gICAgdGhpcy5tb2R1bGVzLmZvckVhY2goKG1vZCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHByb21pc2UgPSBtb2QuY3JlYXRlUHJvbWlzZSgpO1xuICAgICAgLy8gaGlkZSBhbGwgbW9kdWxlcyBleGNlcHQgdGhlIGZpcnN0IG9uZVxuICAgICAgbW9kLmhpZGUoKTtcbiAgICAgIHByb21pc2UudGhlbigoKSA9PiB7IHRoaXMuc2hvd05leHQoKTsgfSk7XG4gICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zaG93TmV4dCgpO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgfVxuXG4gIGxhdW5jaCgpIHtcbiAgICBmb3IgKGxldCBtb2Qgb2YgdGhpcy5tb2R1bGVzKVxuICAgICAgbW9kLmxhdW5jaCgpO1xuICB9XG59XG5cbi8qKlxuICogW2NsaWVudF0gQmFzZSBjbGFzcyB1c2VkIHRvIGNyZWF0ZSBhbnkgKlNvdW5kd29ya3MqIG1vZHVsZSBvbiB0aGUgY2xpZW50IHNpZGUuXG4gKlxuICogRWFjaCBtb2R1bGUgc2hvdWxkIGhhdmUgYSB7QGxpbmsgTW9kdWxlI3N0YXJ0fSwgYSB7QGxpbmsgTW9kdWxlI3Jlc2V0fSwgYSB7QGxpbmsgTW9kdWxlI3Jlc3RhcnR9IGFuZCBhIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kcy5cbiAqXG4gKiBUaGUgYmFzZSBjbGFzcyBvcHRpb25hbGx5IGNyZWF0ZXMgYSB2aWV3IChhIGZ1bGxzY3JlZW4gYGRpdmAgYWNjZXNzaWJsZSB0aHJvdWdoIHRoZSB7QGxpbmsgTW9kdWxlLnZpZXd9IGF0dHJpYnV0ZSkuXG4gKiBUaGUgdmlldyBpcyBhZGRlZCB0byB0aGUgRE9NIChhcyBhIGNoaWxkIG9mIHRoZSBgI2NvbnRhaW5lcmAgZWxlbWVudCkgd2hlbiB0aGUgbW9kdWxlIGlzIHN0YXJ0ZWQgKHdpdGggdGhlIHtAbGluayBNb2R1bGUjc3RhcnR9IG1ldGhvZCksIGFuZCByZW1vdmVkIHdoZW4gdGhlIG1vZHVsZSBjYWxscyBpdHMge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2QuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL01vZHVsZS5qc35Nb2R1bGV9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogKipOb3RlOioqIGEgbW9yZSBjb21wbGV0ZSBleGFtcGxlIG9mIGhvdyB0byB3cml0ZSBhIG1vZHVsZSBpcyBpbiB0aGUgW0V4YW1wbGVdKG1hbnVhbC9leGFtcGxlLmh0bWwpIHNlY3Rpb24uXG4gKlxuICogQGV4YW1wbGUgY2xhc3MgTXlNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICogICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAqICAgICAvLyBUaGlzIGV4YW1wbGUgbW9kdWxlOlxuICogICAgIC8vIC0gYWx3YXlzIGhhcyBhIHZpZXdcbiAqICAgICAvLyAtIGhhcyB0aGUgaWQgYW5kIGNsYXNzICdteS1tb2R1bGUtbmFtZSdcbiAqICAgICAvLyAtIGFuZCB1c2VzIHRoZSBiYWNrZ3JvdW5kIGNvbG9yIGRlZmluZWQgaW4gdGhlIGFyZ3VtZW50ICdvcHRpb25zJyAoaWYgYW55KS5cbiAqICAgICBzdXBlcignbXktbW9kdWxlLW5hbWUnLCB0cnVlLCBvcHRpb25zLmNvbG9yIHx8ICdhbGl6YXJpbicpO1xuICpcbiAqICAgICAuLi4gLy8gYW55dGhpbmcgdGhlIGNvbnN0cnVjdG9yIG5lZWRzXG4gKiAgIH1cbiAqXG4gKiAgIHN0YXJ0KCkge1xuICogICAgIHN1cGVyLnN0YXJ0KCk7XG4gKlxuICogICAgIC8vIFdoYXRldmVyIHRoZSBtb2R1bGUgZG9lcyAoY29tbXVuaWNhdGlvbiB3aXRoIHRoZSBzZXJ2ZXIsIGV0Yy4pXG4gKiAgICAgLy8gLi4uXG4gKlxuICogICAgIC8vIENhbGwgdGhlIGBkb25lYCBtZXRob2Qgd2hlbiB0aGUgbW9kdWxlIGhhcyBmaW5pc2hlZCBpdHMgaW5pdGlhbGl6YXRpb25cbiAqICAgICB0aGlzLmRvbmUoKTtcbiAqICAgfVxuICogfVxuICogQHRvZG8gTW92ZSBleGFtcGxlIGluIHRoZSBtYW51YWw/XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudE1vZHVsZSBleHRlbmRzIFByb21pc2VkIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIG1vZHVsZSAodXNlZCBhcyB0aGUgYGlkYCBhbmQgQ1NTIGNsYXNzIG9mIHRoZSBgdmlld2AgRE9NIGVsZW1lbnQgaWYgaXQgZXhpc3RzKS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbY3JlYXRlVmlldz10cnVlXSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgbW9kdWxlIGRpc3BsYXlzIGEgYHZpZXdgIG9yIG5vdC5cbiAgICogQHBhcmFtIHtbdHlwZV19IFtjb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2Agd2hlbiBpdCBleGlzdHMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihuYW1lLCBvcHRpb25zID0ge30pIHsgLy8gVE9ETzogY2hhbmdlIHRvIGNvbG9yQ2xhc3M/XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX2J5cGFzcyA9IG9wdGlvbnMuYnlwYXNzIHx8wqBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG5cbiAgICAvKipcbiAgICAgKiBWaWV3IG9mIHRoZSBtb2R1bGUuXG4gICAgICogQHR5cGUge1ZpZXd9XG4gICAgICovXG4gICAgdGhpcy52aWV3ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50cyB0byBiaW5kIHRvIHRoZSB2aWV3LiAoY2YuIEJhY2tib25lJ3Mgc3ludGF4KS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnRzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBZGRpdGlvbm5hbCBvcHRpb25zIHRvIHBhc3MgdG8gdGhlIHZpZXcuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnZpZXdPcHRpb25zID0gb3B0aW9ucy52aWV3T3B0aW9ucyB8fMKge307XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGEgdmlldyBjb25zdHJ1Y3RvciB0byBiZSB1c2VkIGluIGNyZWF0ZVZpZXdcbiAgICAgKiBAdHlwZSB7Vmlld31cbiAgICAgKi9cbiAgICB0aGlzLnZpZXdDdG9yID0gb3B0aW9ucy52aWV3Q3RvciB8fCBWaWV3O1xuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgdGhpcy5fdGVtcGxhdGUgPSBudWxsO1xuXG4gICAgLy8gYmluZCBjb20gbWV0aG9kcyB0byB0aGUgaW5zdGFuY2UuXG4gICAgdGhpcy5zZW5kID0gdGhpcy5zZW5kLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWNlaXZlID0gdGhpcy5yZWNlaXZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lciA9IHRoaXMucmVtb3ZlTGlzdGVuZXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaGFyZSB0aGUgZGVmaW5lZCB0ZW1wbGF0ZXMgd2l0aCBhbGwgYENsaWVudE1vZHVsZWAgaW5zdGFuY2VzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmcyAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSB0ZW1wbGF0ZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGF0aWMgc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmcykge1xuICAgIENsaWVudE1vZHVsZS5wcm90b3R5cGUudGVtcGxhdGVEZWZpbml0aW9ucyA9IGRlZnM7XG4gIH1cblxuICAvKipcbiAgICogU2hhcmUgdGhlIHRleHQgY29udGVudCBjb25maWd1cmF0aW9uIChuYW1lIGFuZCBkYXRhKSB3aXRoIGFsbCB0aGUgYENsaWVudE1vZHVsZWAgaW5zdGFuY2VzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZzIC0gVGhlIHRleHQgY29udGVudHMgb2YgdGhlIGFwcGxpY2F0aW9uLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhdGljIHNldFZpZXdDb250ZW50RGVmaW5pdGlvbnMoZGVmcykge1xuICAgIENsaWVudE1vZHVsZS5wcm90b3R5cGUuY29udGVudERlZmluaXRpb25zID0gZGVmcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjb250YWluZXIgb2YgdGhlIHZpZXdzIGZvciBhbGwgYENsaWVudE1vZHVsZWAgaW5zdGFuY2VzLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBlbGVtZW50IHRvIHVzZSBhcyBhIGNvbnRhaW5lciBmb3IgdGhlIG1vZHVsZSdzIHZpZXcuXG4gICAqL1xuICBzdGF0aWMgc2V0Vmlld0NvbnRhaW5lcigkZWwpIHtcbiAgICBDbGllbnRNb2R1bGUucHJvdG90eXBlLiRjb250YWluZXIgPSAkZWw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdGVtcGxhdGUgYXNzb2NpYXRlZCB0byB0aGUgY3VycmVudCBtb2R1bGUuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gLSBUaGUgdGVtcGxhdGUgcmVsYXRlZCB0byB0aGUgYG5hbWVgIG9mIHRoZSBjdXJyZW50IG1vZHVsZS5cbiAgICovXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMuX3RlbXBsYXRlIHx8wqB0aGlzLnRlbXBsYXRlRGVmaW5pdGlvbnNbdGhpcy5uYW1lXTtcbiAgICAvLyBpZiAoIXRlbXBsYXRlKVxuICAgIC8vICAgdGhyb3cgbmV3IEVycm9yKGBObyB0ZW1wbGF0ZSBkZWZpbmVkIGZvciBtb2R1bGUgXCIke3RoaXMubmFtZX1cImApO1xuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfVxuXG4gIHNldCB0ZW1wbGF0ZSh0bXBsKSB7XG4gICAgdGhpcy5fdGVtcGxhdGUgPSB0bXBsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRleHQgYXNzb2NpYXRlZCB0byB0aGUgY3VycmVudCBtb2R1bGUuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IC0gVGhlIHRleHQgY29udGVudHMgcmVsYXRlZCB0byB0aGUgYG5hbWVgIG9mIHRoZSBjdXJyZW50IG1vZHVsZS4gVGhlIHJldHVybmVkIG9iamVjdCBpcyBleHRlbmRlZCB3aXRoIGEgcG9pbnRlciB0byB0aGUgYF9nbG9iYWxzYCBlbnRyeSBvZiB0aGUgZGVmaW5lZCB0ZXh0IGNvbnRlbnRzLlxuICAgKi9cbiAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuX2NvbnRlbnQgfHzCoHRoaXMuY29udGVudERlZmluaXRpb25zW3RoaXMubmFtZV07XG5cbiAgICBpZiAoY29udGVudClcbiAgICAgIGNvbnRlbnQuX2dsb2JhbHMgPSB0aGlzLmNvbnRlbnREZWZpbml0aW9ucy5fZ2xvYmFscztcblxuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgc2V0IGNvbnRlbnQob2JqKSB7XG4gICAgdGhpcy5fY29udGVudCA9IG9iajtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBkZWZhdWx0IHZpZXcgZnJvbSBtb2R1bGUgYXR0cmlidXRlcy5cbiAgICovXG4gIGNyZWF0ZVZpZXcoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBpZDogdGhpcy5uYW1lLCBjbGFzc05hbWU6ICdtb2R1bGUnIH0sIHRoaXMudmlld09wdGlvbnMpO1xuICAgIHJldHVybiBuZXcgdGhpcy52aWV3Q3Rvcih0aGlzLnRlbXBsYXRlLCB0aGlzLmNvbnRlbnQsIHRoaXMuZXZlbnRzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbGF1bmNoKCkge1xuICAgIGlmICh0aGlzLl9pc0RvbmUpIHtcbiAgICAgIHRoaXMucmVzdGFydCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5faXNTdGFydGVkKVxuICAgICAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICByZXNldChyZUluaXQgPSBmYWxzZSkge1xuXG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIHRoZSBsb2dpYyBhbmQgc3RlcHMgdGhhdCBsZWFkIHRvIHRoZSBpbml0aWFsaXphdGlvbiBvZiB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBGb3IgaW5zdGFuY2UsIGl0IHRha2VzIGNhcmUgb2YgdGhlIGNvbW11bmljYXRpb24gd2l0aCB0aGUgbW9kdWxlIG9uIHRoZSBzZXJ2ZXIgc2lkZSBieSBzZW5kaW5nIFdlYlNvY2tldCBtZXNzYWdlcyBhbmQgc2V0dGluZyB1cCBXZWJTb2NrZXQgbWVzc2FnZSBsaXN0ZW5lcnMuXG4gICAqXG4gICAqIEFkZGl0aW9uYWxseSwgaWYgdGhlIG1vZHVsZSBoYXMgYSBgdmlld2AsIHRoZSBgc3RhcnRgIG1ldGhvZCBjcmVhdGVzIHRoZSBjb3JyZXNwb25kaW5nIEhUTUwgZWxlbWVudCBhbmQgYXBwZW5kcyBpdCB0byB0aGUgRE9N4oCZcyBtYWluIGNvbnRhaW5lciBlbGVtZW50IChgZGl2I2NvbnRhaW5lcmApLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSwgeW91IHNob3VsZCBub3QgY2FsbCBpdCBtYW51YWxseS5cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBzdGFydCgpIHtcbiAgICAvLyBhbGxvdyB0byBieXBhc3MgYSBtb2R1bGUgZnJvbSBpdHMgb3B0aW9uc1xuICAgIGlmICh0aGlzLl9ieXBhc3MpIHsgdGhpcy5kb25lKCk7IH1cblxuICAgIC8vIGlmICghdGhpcy5faXNTdGFydGVkKSB7IC8vIEB0b2RvIC0gY29uZmlybSB0aGlzIGlzIG5vdCBuZWVkZWRcbiAgICBpZiAodGhpcy52aWV3KSB7XG4gICAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gICAgICB0aGlzLnZpZXcuYXBwZW5kVG8odGhpcy4kY29udGFpbmVyKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSB0cnVlO1xuICAgIC8vIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIFRoZSBtZXRob2QgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgd2hlbiBhIGxvc3QgY29ubmVjdGlvbiB3aXRoIHRoZSBzZXJ2ZXIgaXMgcmVzdW1lZCAoZm9yIGluc3RhbmNlIGJlY2F1c2Ugb2YgYSBzZXJ2ZXIgY3Jhc2gpLCBpZiB0aGUgbW9kdWxlIGhhZCBhbHJlYWR5IGZpbmlzaGVkIGl0cyBpbml0aWFsaXphdGlvbiAoKmkuZS4qIGlmIGl0IGhhZCBjYWxsZWQgaXRzIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kKS5cbiAgICogVGhlIG1ldGhvZCBzaG91bGQgc2VuZCB0byB0aGUgc2VydmVyIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIChJbmRlZWQsIGlmIHRoZSBzZXJ2ZXIgY3Jhc2hlcywgaXQgd2lsbCByZXNldCBhbGwgdGhlIGluZm9ybWF0aW9uIGl0IGhhcyBhYm91dCBhbGwgdGhlIGNsaWVudHMuXG4gICAqIE9uIHRoZSBjbGllbnQgc2lkZSwgdGhlIG1vZHVsZXMgdGhhdCBoYWQgZmluaXNoZWQgdGhlaXIgaW5pdGlhbGl6YXRpb24gcHJvY2VzcyBzaG91bGQgc2VuZCB0aGVpciBzdGF0ZSB0byB0aGUgc2VydmVyIHNvIHRoYXQgaXQgY2FuIGJlIHVwIHRvIGRhdGUgd2l0aCB0aGUgcmVhbCBzdGF0ZSBvZiB0aGUgc2NlbmFyaW8uKVxuICAgKlxuICAgKiBGb3IgaW5zdGFuY2UsIHRoaXMgbWV0aG9kIGluIHRoZSB7QGxpbmsgTG9jYXRvcn0gbW9kdWxlIHNlbmRzIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgY2xpZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gbmVjZXNzYXJ5LCB5b3Ugc2hvdWxkIG5vdCBjYWxsIGl0IG1hbnVhbGx5LlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgdGhpcy5faXNEb25lID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIG1vZHVsZSB0byB0aGUgc3RhdGUgaXQgaGFkIGJlZm9yZSBjYWxsaW5nIHRoZSB7QGxpbmsgTW9kdWxlI3N0YXJ0fSBtZXRob2QuXG4gICAqXG4gICAqIFRoZSBtZXRob2QgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgd2hlbiBhIGxvc3QgY29ubmVjdGlvbiB3aXRoIHRoZSBzZXJ2ZXIgaXMgcmVzdW1lZCAoZm9yIGluc3RhbmNlIGJlY2F1c2Ugb2YgYSBzZXJ2ZXIgY3Jhc2gpLCBpZiB0aGUgbW9kdWxlIGhhZCBub3QgZmluaXNoZWQgaXRzIGluaXRpYWxpemF0aW9uICgqaS5lLiogaWYgaXQgaGFkIG5vdCBjYWxsZWQgaXRzIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kKS5cbiAgICogSW4gdGhhdCBjYXNlLCB0aGUgbW9kdWxlIGNsZWFucyB3aGF0ZXZlciBpdCB3YXMgZG9pbmcgYW5kIHN0YXJ0cyBhZ2FpbiBmcm9tIHNjcmF0Y2guXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gbmVjZXNzYXJ5LCB5b3Ugc2hvdWxkIG5vdCBjYWxsIGl0IG1hbnVhbGx5LlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIGlmICh0aGlzLnZpZXcpIHtcbiAgICAgIHRoaXMudmlldy5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgYmUgY2FsbGVkIHdoZW4gdGhlIG1vZHVsZSBoYXMgZmluaXNoZWQgaXRzIGluaXRpYWxpemF0aW9uICgqaS5lLiogd2hlbiB0aGUgbW9kdWxlIGhhcyBkb25lIGl0cyBkdXR5LCBvciB3aGVuIGl0IG1heSBydW4gaW4gdGhlIGJhY2tncm91bmQgZm9yIHRoZSByZXN0IG9mIHRoZSBzY2VuYXJpbyBhZnRlciBpdCBmaW5pc2hlZCBpdHMgaW5pdGlhbGl6YXRpb24gcHJvY2VzcyksIHRvIGFsbG93IHN1YnNlcXVlbnQgc3RlcHMgb2YgdGhlIHNjZW5hcmlvIHRvIHN0YXJ0LlxuICAgKlxuICAgKiBGb3IgaW5zdGFuY2UsIHRoZSB7QGxpbmsgTG9hZGVyfSBtb2R1bGUgY2FsbHMgaXRzIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kIHdoZW4gZmlsZXMgYXJlIGxvYWRlZCwgYW5kIHRoZSB7QGxpbmsgU3luY30gbW9kdWxlIGNhbGxzIGl0IHdoZW4gdGhlIGZpcnN0IHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIGlzIGZpbmlzaGVkICh3aGlsZSB0aGUgbW9kdWxlIGtlZXBzIHJ1bm5pbmcgaW4gdGhlIGJhY2tncm91bmQgYWZ0ZXJ3YXJkcykuXG4gICAqIEFzIGFuIGV4Y2VwdGlvbiwgdGhlIGxhc3QgbW9kdWxlIG9mIHRoZSBzY2VuYXJpbyAodXN1YWxseSB0aGUge0BsaW5rIFBlcmZvcm1hbmNlfSBtb2R1bGUpIG1heSBub3QgY2FsbCBpdHMge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2QuXG4gICAqXG4gICAqIElmIHRoZSBtb2R1bGUgaGFzIGEgYHZpZXdgLCB0aGUgYGRvbmVgIG1ldGhvZCByZW1vdmVzIGl0IGZyb20gdGhlIERPTS5cbiAgICpcbiAgICogKipOb3RlOioqIHlvdSBzaG91bGQgbm90IG92ZXJyaWRlIHRoaXMgbWV0aG9kLlxuICAgKi9cbiAgZG9uZSgpIHtcbiAgICB0aGlzLl9pc0RvbmUgPSB0cnVlO1xuXG4gICAgdGhpcy5yZXNldCgpO1xuXG4gICAgaWYgKHRoaXMucmVzb2x2ZVByb21pc2VkKVxuICAgICAgdGhpcy5yZXNvbHZlUHJvbWlzZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdG9kbyAtIGRvY1xuICAgKi9cbiAgc2hvdygpIHtcbiAgICBpZiAodGhpcy52aWV3ICYmICF0aGlzLl9pc0RvbmUpIHtcbiAgICAgIGlmICghdGhpcy52aWV3LmlzVmlzaWJsZSkge1xuICAgICAgICB0aGlzLnZpZXcuc2hvdygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHRvZG8gLSBkb2NcbiAgICovXG4gIGhpZGUoKSB7XG4gICAgaWYgKHRoaXMudmlldyAmJiAhdGhpcy5fZG9uZSkgeyB0aGlzLnZpZXcuaGlkZSgpOyB9XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyIHNpZGUgc29ja2V0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5uYW1lfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbW0uc2VuZChgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gLCAuLi5hcmdzKVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIHNvY2tldC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kVm9sYXRpbGUoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbW0uc2VuZFZvbGF0aWxlKGAke3RoaXMubmFtZX06JHtjaGFubmVsfWAsIC4uLmFyZ3MpXG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5uYW1lfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb21tLnJlY2VpdmUoYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YCwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgbGlzdGVuaW5nIHRvIGEgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLm5hbWV9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBjYW5jZWwuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNvbW0ucmVtb3ZlTGlzdGVuZXIoYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YCwgY2FsbGJhY2spO1xuICB9XG59XG5cbkNsaWVudE1vZHVsZS5zZXF1ZW50aWFsID0gZnVuY3Rpb24oLi4ubW9kdWxlcykge1xuICByZXR1cm4gbmV3IFNlcXVlbnRpYWwobW9kdWxlcyk7XG59O1xuXG5DbGllbnRNb2R1bGUucGFyYWxsZWwgPSBmdW5jdGlvbiguLi5tb2R1bGVzKSB7XG4gIHJldHVybiBuZXcgUGFyYWxsZWwobW9kdWxlcyk7XG59O1xuIl19