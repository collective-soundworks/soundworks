'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

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

    // /**
    //  * Name of the module.
    //  * @type {String}
    //  */
    // this.name = name;

    // /**
    //  * View of the module.
    //  * @type {View}
    //  */
    // this.view = null;

    // /**
    //  * Events to bind to the view. (cf. Backbone's syntax).
    //  * @type {Object}
    //  */
    // this.events = {};

    // /**
    //  * Additionnal options to pass to the view.
    //  * @type {Object}
    //  */
    // this.viewOptions = options.viewOptions || {};

    // /**
    //  * Defines a view constructor to be used in `createView`.
    //  * @type {View}
    //  */
    // this.viewCtor = options.viewCtor || View;

    // /** @private */
    // this._template = null;

    // bind com methods to the instance.
    // this.send = this.send.bind(this);
    // this.receive = this.receive.bind(this);
    // this.removeListener = this.removeListener.bind(this);

    /**
     * For module lifecycle. Is set to true when the module starts and back to false when `done`
     * @type {boolean}
     * @private
     */
    this._isActive = false;

    /**
     * For module lifecycle. Is set to true when done for the first time.
     * Allow to resync with server without restarting the module.
     * @type {boolean}
     * @private
     */
    this._isDone = false;
  }

  // MOVED TO ACTIVITY
  // /**
  //  * Share the defined templates with all `ClientModule` instances.
  //  * @param {Object} defs - An object containing the templates.
  //  * @private
  //  */
  // static setViewTemplateDefinitions(defs) {
  //   ClientModule.prototype.templateDefinitions = defs;
  // }

  // /**
  //  * Share the text content configuration (name and data) with all the `ClientModule` instances
  //  * @param {Object} defs - The text contents of the application.
  //  * @private
  //  */
  // static setViewContentDefinitions(defs) {
  //   ClientModule.prototype.contentDefinitions = defs;
  // }

  // /**
  //  * Sets the container of the views for all `ClientModule` instances.
  //  * @param {Element} $el - The element to use as a container for the module's view.
  //  */
  // static setViewContainer($el) {
  //   ClientModule.prototype.$container = $el;
  // }

  // /**
  //  * Returns the template associated to the current module.
  //  * @returns {Function} - The template related to the `name` of the current module.
  //  */
  // get template() {
  //   const template = this._template || this.templateDefinitions[this.name];
  //   // if (!template)
  //   //   throw new Error(`No template defined for module "${this.name}"`);
  //   return template;
  // }

  // set template(tmpl) {
  //   this._template = tmpl;
  // }

  // /**
  //  * Returns the text associated to the current module.
  //  * @returns {Object} - The text contents related to the `name` of the current module. The returned object is extended with a pointer to the `globals` entry of the defined text contents.
  //  */
  // get content() {
  //   const content = this._content || this.contentDefinitions[this.name];

  //   if (content)
  //     content.globals = this.contentDefinitions.globals;

  //   return content;
  // }

  // set content(obj) {
  //   this._content = obj;
  // }

  // /**
  //  * Create the view of the module according to its attributes.
  //  */
  // createView() {
  //   const options = Object.assign({
  //     id: this.name,
  //     className: 'module'
  //   }, this.viewOptions);

  //   return new this.viewCtor(this.template, this.content, this.events, options);
  // }
  // !MOVED TO ACTIVITY

  /**
   * @todo - doc
   * @private
   */

  _createClass(ClientModule, [{
    key: 'launch',
    value: function launch() {
      // console.log(`${this.name}:launch`, this._isActive, this._isDone);
      if (this._isDone) this.restart();else if (this._isActive) this.reset();else this.start();
    }

    /**
     * Interface method to override in order to initialize module state and optionnaly it's view.
     * The module should return to a default state when this method is called.
     */
  }, {
    key: 'init',
    value: function init() {}
    // console.log(`${this.name}:init`);

    /**
     * Handle the logic and steps that starts the module.
     * Is mainly used to attach listeners to communication with the server or other modules (e.g. motionInput). If the module has a view, it is attach to the DOM.
     *
     * **Note:** the method is called automatically when necessary, you should not call it manually.
     * @abstract
     */

  }, {
    key: 'start',
    value: function start() {
      // console.log(`${this.name}:start`);
      if (this.view) {
        this.view.render();
        this.view.appendTo(this.$container);
      }

      this._isActive = true;
    }

    /**
     * This method should be considered as the opposite of {@link ClientModule#start}, removing listeners from socket or other module (aka motionInput).
     * It is internally called at 2 different moment of the module's lifecycle:
     * - when the module is {@link ClientModule#done}
     * - when the module has to restart because of a socket reconnection during the active state of the module. In this particular case the module is stopped, initialized and started again.
     *
     * **Note:** the method is called automatically when necessary, you should not call it manually.
     * @abstract
     */
  }, {
    key: 'stop',
    value: function stop() {
      // console.log(`${this.name}:stop`);
      if (this.view) {
        this.view.remove();
        this.view = null;
      }

      this._isActive = false;
    }

    /**
     * Should be called when the module has finished its initialization (*i.e.* when the module has done its duty, or when it may run in the background for the rest of the scenario after it finished its initialization process), to allow subsequent steps of the scenario to start.
     *
     * For instance, the {@link Loader} module calls its {@link ClientModule#done} method when files are loaded, and the {@link ClientSync} module calls it when the first synchronization process is finished (while the module keeps running in the background afterwards).
     * As an exception, the last module of the scenario (usually the {@link Performance} module) may not call its {@link Module#done} method.
     *
     * If the module has a `view`, the `done` method removes it from the DOM.
     * The method internally call {@link ClientModule#stop} where socket listeners and so on should be removed.
     *
     * **Note:** you should not override this method.
     */
  }, {
    key: 'done',
    value: function done() {
      // console.log(`${this.name}:done`);
      this.stop();

      if (this.resolvePromised) this.resolvePromised();

      this._isDone = true;
    }

    /**
     * Reset an active module to it's default state.
     *
     * **Note:** the method is called automatically when necessary, you should not call it manually.
     * @abstract
     */
  }, {
    key: 'reset',
    value: function reset() {
      // console.log(`${this.name}:reset`);
      this.stop();
      this.init();
      this.start();
    }

    /**
     * * @todo - This prepare the installation of a server side persistance. Most of the module should override it for now.
     *
     * Restarts a module after it has been considered as `done`.
     * The main objective of this method is to restore the distributed state betweeen the client and the server after a disconnection.
     * The method is called automatically when a lost connection with the server is resumed (because of a server crash) and {@link ClientModule#done} has already been called.
     *
     * If the server crashes, all in memory informations about the shared state of the application are lost. On the client side, the modules that had finished their initialization must resynchronize with the server to restore the global (and distributed) state of the application.
     *
     * **Note:** the method is called automatically when necessary, you should not call it manually.
     * @abstract
     */
  }, {
    key: 'restart',
    value: function restart() {
      // console.log(`${this.name}:restart`);
      this.init();
      this.start();
    }

    /**
     * Display the view of a module if it owns one and is not done.
     * @return {Boolean} - true if the module has a view and is not done, false otherwise.
     * @private
     */
  }, {
    key: 'show',
    value: function show() {
      if (this.view && !this._isDone) {
        if (!this.view.isVisible) this.view.show();

        return true;
      }

      return false;
    }

    /**
     * Display the view of a module if it owns one and is not done.
     * @private
     */
  }, {
    key: 'hide',
    value: function hide() {
      if (this.view && !this._done) this.view.hide();
    }

    // MOVED TO CLIENT ACTIVITY
    // /**
    //  * Sends a WebSocket message to the server side socket.
    //  * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
    //  * @param {...*} args - Arguments of the message (as many as needed, of any type).
    //  */
    // send(channel, ...args) {
    //   comm.send(`${this.name}:${channel}`, ...args)
    // }

    // /**
    //  * Sends a WebSocket message to the server side socket.
    //  * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
    //  * @param {...*} args - Arguments of the message (as many as needed, of any type).
    //  */
    // sendVolatile(channel, ...args) {
    //   comm.sendVolatile(`${this.name}:${channel}`, ...args)
    // }

    // /**
    //  * Listen a WebSocket message from the server.
    //  * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
    //  * @param {...*} callback - The callback to execute when a message is received.
    //  */
    // receive(channel, callback) {
    //   comm.receive(`${this.name}:${channel}`, callback);
    // }

    // /**
    //  * Stop listening to a message from the server.
    //  * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
    //  * @param {...*} callback - The callback to cancel.
    //  */
    // removeListener(channel, callback) {
    //   comm.removeListener(`${this.name}:${channel}`, callback);
    // }
    // !MOVED TO CLIENT ACTIVITY
  }]);

  return ClientModule;
})(Promised);

exports['default'] = ClientModule;

ClientModule.sequential = function () {
  for (var _len = arguments.length, modules = Array(_len), _key = 0; _key < _len; _key++) {
    modules[_key] = arguments[_key];
  }

  return new Sequential(modules);
};

ClientModule.parallel = function () {
  for (var _len2 = arguments.length, modules = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    modules[_key2] = arguments[_key2];
  }

  return new Parallel(modules);
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50TW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUE2QixRQUFROztvQkFDcEIsUUFBUTs7OzsyQkFDUixnQkFBZ0I7Ozs7Ozs7O0lBSzNCLFFBQVE7WUFBUixRQUFROztBQUNELFdBRFAsUUFBUSxHQUNFOzBCQURWLFFBQVE7O0FBRVYsK0JBRkUsUUFBUSw2Q0FFRjs7Ozs7OztBQU9SLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0dBQzdCOzs7Ozs7ZUFWRyxRQUFROztXQVlDLHlCQUFHOzs7QUFDZCxhQUFPLGFBQVksVUFBQyxPQUFPO2VBQUssTUFBSyxlQUFlLEdBQUcsT0FBTztPQUFBLENBQUMsQ0FBQztLQUNqRTs7O1dBRUssa0JBQUcsRUFFUjs7O1NBbEJHLFFBQVE7OztJQXdCUixVQUFVO1lBQVYsVUFBVTs7QUFDSCxXQURQLFVBQVUsQ0FDRixPQUFPLEVBQUU7MEJBRGpCLFVBQVU7O0FBRVosK0JBRkUsVUFBVSw2Q0FFSjs7QUFFUixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztHQUN4Qjs7Ozs7O2VBTEcsVUFBVTs7V0FPRCx5QkFBRztBQUNkLFVBQUksR0FBRyxHQUFHLElBQUksQ0FBQztBQUNmLFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQzs7Ozs7Ozs7Y0FFVixJQUFJOztBQUNYLGNBQUksR0FBRyxLQUFLLElBQUksRUFDZCxPQUFPLENBQUMsSUFBSSxDQUFDO21CQUFNLElBQUksQ0FBQyxNQUFNLEVBQUU7V0FBQSxDQUFDLENBQUM7O0FBRXBDLGFBQUcsR0FBRyxJQUFJLENBQUM7QUFDWCxpQkFBTyxHQUFHLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7O0FBTGhDLDBDQUFpQixJQUFJLENBQUMsT0FBTyw0R0FBRTs7U0FNOUI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1dBRUssa0JBQUc7QUFDUCxhQUFP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Ozs7Ozs7Ozs7U0E1UWtCLFlBQVk7R0FBUyxRQUFROztxQkFBN0IsWUFBWTs7QUFxVGpDLFlBQVksQ0FBQyxVQUFVLEdBQUcsWUFBcUI7b0NBQVQsT0FBTztBQUFQLFdBQU87OztBQUMzQyxTQUFPLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQ2hDLENBQUM7O0FBRUYsWUFBWSxDQUFDLFFBQVEsR0FBRyxZQUFxQjtxQ0FBVCxPQUFPO0FBQVAsV0FBTzs7O0FBQ3pDLFNBQU8sSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDOUIsQ0FBQyIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudE1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgY29tbSBmcm9tICcuL2NvbW0nO1xuaW1wb3J0IFZpZXcgZnJvbSAnLi9kaXNwbGF5L1ZpZXcnO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIFByb21pc2VkIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvKipcbiAgICAgKiBbcmVzb2x2ZVByb21pc2VkIGRlc2NyaXB0aW9uXVxuICAgICAqIEB0b2RvIGRlc2NyaXB0aW9uXG4gICAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5yZXNvbHZlUHJvbWlzZWQgPSBudWxsO1xuICB9XG5cbiAgY3JlYXRlUHJvbWlzZSgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHRoaXMucmVzb2x2ZVByb21pc2VkID0gcmVzb2x2ZSk7XG4gIH1cblxuICBsYXVuY2goKSB7XG5cbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIFNlcXVlbnRpYWwgZXh0ZW5kcyBQcm9taXNlZCB7XG4gIGNvbnN0cnVjdG9yKG1vZHVsZXMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5tb2R1bGVzID0gbW9kdWxlcztcbiAgfVxuXG4gIGNyZWF0ZVByb21pc2UoKSB7XG4gICAgbGV0IG1vZCA9IG51bGw7XG4gICAgbGV0IHByb21pc2UgPSBudWxsO1xuXG4gICAgZm9yIChsZXQgbmV4dCBvZiB0aGlzLm1vZHVsZXMpIHtcbiAgICAgIGlmIChtb2QgIT09IG51bGwpXG4gICAgICAgIHByb21pc2UudGhlbigoKSA9PiBuZXh0LmxhdW5jaCgpKTtcblxuICAgICAgbW9kID0gbmV4dDtcbiAgICAgIHByb21pc2UgPSBtb2QuY3JlYXRlUHJvbWlzZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgbGF1bmNoKCkge1xuICAgIHJldHVybiB0aGlzLm1vZHVsZXNbMF0ubGF1bmNoKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBQYXJhbGxlbCBleHRlbmRzIFByb21pc2VkIHtcbiAgY29uc3RydWN0b3IobW9kdWxlcykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm1vZHVsZXMgPSBtb2R1bGVzO1xuICB9XG5cbiAgc2hvd05leHQoKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5tb2R1bGVzLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG1vZCA9IHRoaXMubW9kdWxlc1tpXTtcbiAgICAgIGNvbnN0IGlzVmlzaWJsZSA9IG1vZC5zaG93KCk7XG4gICAgICBpZiAoaXNWaXNpYmxlKSB7IGJyZWFrOyB9XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlUHJvbWlzZSgpIHtcbiAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuXG4gICAgdGhpcy5tb2R1bGVzLmZvckVhY2goKG1vZCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHByb21pc2UgPSBtb2QuY3JlYXRlUHJvbWlzZSgpO1xuICAgICAgLy8gaGlkZSBhbGwgbW9kdWxlcyBleGNlcHQgdGhlIGZpcnN0IG9uZVxuICAgICAgbW9kLmhpZGUoKTtcbiAgICAgIHByb21pc2UudGhlbigoKSA9PiB7IHRoaXMuc2hvd05leHQoKTsgfSk7XG4gICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zaG93TmV4dCgpO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgfVxuXG4gIGxhdW5jaCgpIHtcbiAgICBmb3IgKGxldCBtb2Qgb2YgdGhpcy5tb2R1bGVzKVxuICAgICAgbW9kLmxhdW5jaCgpO1xuICB9XG59XG5cbi8qKlxuICogW2NsaWVudF0gQmFzZSBjbGFzcyB1c2VkIHRvIGNyZWF0ZSBhbnkgKlNvdW5kd29ya3MqIG1vZHVsZSBvbiB0aGUgY2xpZW50IHNpZGUuXG4gKlxuICogRWFjaCBtb2R1bGUgc2hvdWxkIGhhdmUgYSB7QGxpbmsgTW9kdWxlI3N0YXJ0fSwgYSB7QGxpbmsgTW9kdWxlI3Jlc2V0fSwgYSB7QGxpbmsgTW9kdWxlI3Jlc3RhcnR9IGFuZCBhIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kcy5cbiAqXG4gKiBUaGUgYmFzZSBjbGFzcyBvcHRpb25hbGx5IGNyZWF0ZXMgYSB2aWV3IChhIGZ1bGxzY3JlZW4gYGRpdmAgYWNjZXNzaWJsZSB0aHJvdWdoIHRoZSB7QGxpbmsgTW9kdWxlLnZpZXd9IGF0dHJpYnV0ZSkuXG4gKiBUaGUgdmlldyBpcyBhZGRlZCB0byB0aGUgRE9NIChhcyBhIGNoaWxkIG9mIHRoZSBgI2NvbnRhaW5lcmAgZWxlbWVudCkgd2hlbiB0aGUgbW9kdWxlIGlzIHN0YXJ0ZWQgKHdpdGggdGhlIHtAbGluayBNb2R1bGUjc3RhcnR9IG1ldGhvZCksIGFuZCByZW1vdmVkIHdoZW4gdGhlIG1vZHVsZSBjYWxscyBpdHMge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2QuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL01vZHVsZS5qc35Nb2R1bGV9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogKipOb3RlOioqIGEgbW9yZSBjb21wbGV0ZSBleGFtcGxlIG9mIGhvdyB0byB3cml0ZSBhIG1vZHVsZSBpcyBpbiB0aGUgW0V4YW1wbGVdKG1hbnVhbC9leGFtcGxlLmh0bWwpIHNlY3Rpb24uXG4gKlxuICogQGV4YW1wbGUgY2xhc3MgTXlNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICogICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAqICAgICAvLyBUaGlzIGV4YW1wbGUgbW9kdWxlOlxuICogICAgIC8vIC0gYWx3YXlzIGhhcyBhIHZpZXdcbiAqICAgICAvLyAtIGhhcyB0aGUgaWQgYW5kIGNsYXNzICdteS1tb2R1bGUtbmFtZSdcbiAqICAgICAvLyAtIGFuZCB1c2VzIHRoZSBiYWNrZ3JvdW5kIGNvbG9yIGRlZmluZWQgaW4gdGhlIGFyZ3VtZW50ICdvcHRpb25zJyAoaWYgYW55KS5cbiAqICAgICBzdXBlcignbXktbW9kdWxlLW5hbWUnLCB0cnVlLCBvcHRpb25zLmNvbG9yIHx8ICdhbGl6YXJpbicpO1xuICpcbiAqICAgICAuLi4gLy8gYW55dGhpbmcgdGhlIGNvbnN0cnVjdG9yIG5lZWRzXG4gKiAgIH1cbiAqXG4gKiAgIHN0YXJ0KCkge1xuICogICAgIHN1cGVyLnN0YXJ0KCk7XG4gKlxuICogICAgIC8vIFdoYXRldmVyIHRoZSBtb2R1bGUgZG9lcyAoY29tbXVuaWNhdGlvbiB3aXRoIHRoZSBzZXJ2ZXIsIGV0Yy4pXG4gKiAgICAgLy8gLi4uXG4gKlxuICogICAgIC8vIENhbGwgdGhlIGBkb25lYCBtZXRob2Qgd2hlbiB0aGUgbW9kdWxlIGhhcyBmaW5pc2hlZCBpdHMgaW5pdGlhbGl6YXRpb25cbiAqICAgICB0aGlzLmRvbmUoKTtcbiAqICAgfVxuICogfVxuICogQHRvZG8gTW92ZSBleGFtcGxlIGluIHRoZSBtYW51YWw/XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudE1vZHVsZSBleHRlbmRzIFByb21pc2VkIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIG1vZHVsZSAodXNlZCBhcyB0aGUgYGlkYCBhbmQgQ1NTIGNsYXNzIG9mIHRoZSBgdmlld2AgRE9NIGVsZW1lbnQgaWYgaXQgZXhpc3RzKS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbY3JlYXRlVmlldz10cnVlXSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgbW9kdWxlIGRpc3BsYXlzIGEgYHZpZXdgIG9yIG5vdC5cbiAgICogQHBhcmFtIHtbdHlwZV19IFtjb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2Agd2hlbiBpdCBleGlzdHMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihuYW1lLCBvcHRpb25zID0ge30pIHsgLy8gVE9ETzogY2hhbmdlIHRvIGNvbG9yQ2xhc3M/XG4gICAgc3VwZXIoKTtcblxuICAgIC8vIC8qKlxuICAgIC8vICAqIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICAvLyAgKiBAdHlwZSB7U3RyaW5nfVxuICAgIC8vICAqL1xuICAgIC8vIHRoaXMubmFtZSA9IG5hbWU7XG5cbiAgICAvLyAvKipcbiAgICAvLyAgKiBWaWV3IG9mIHRoZSBtb2R1bGUuXG4gICAgLy8gICogQHR5cGUge1ZpZXd9XG4gICAgLy8gICovXG4gICAgLy8gdGhpcy52aWV3ID0gbnVsbDtcblxuICAgIC8vIC8qKlxuICAgIC8vICAqIEV2ZW50cyB0byBiaW5kIHRvIHRoZSB2aWV3LiAoY2YuIEJhY2tib25lJ3Mgc3ludGF4KS5cbiAgICAvLyAgKiBAdHlwZSB7T2JqZWN0fVxuICAgIC8vICAqL1xuICAgIC8vIHRoaXMuZXZlbnRzID0ge307XG5cbiAgICAvLyAvKipcbiAgICAvLyAgKiBBZGRpdGlvbm5hbCBvcHRpb25zIHRvIHBhc3MgdG8gdGhlIHZpZXcuXG4gICAgLy8gICogQHR5cGUge09iamVjdH1cbiAgICAvLyAgKi9cbiAgICAvLyB0aGlzLnZpZXdPcHRpb25zID0gb3B0aW9ucy52aWV3T3B0aW9ucyB8fMKge307XG5cbiAgICAvLyAvKipcbiAgICAvLyAgKiBEZWZpbmVzIGEgdmlldyBjb25zdHJ1Y3RvciB0byBiZSB1c2VkIGluIGBjcmVhdGVWaWV3YC5cbiAgICAvLyAgKiBAdHlwZSB7Vmlld31cbiAgICAvLyAgKi9cbiAgICAvLyB0aGlzLnZpZXdDdG9yID0gb3B0aW9ucy52aWV3Q3RvciB8fCBWaWV3O1xuXG4gICAgLy8gLyoqIEBwcml2YXRlICovXG4gICAgLy8gdGhpcy5fdGVtcGxhdGUgPSBudWxsO1xuXG4gICAgLy8gYmluZCBjb20gbWV0aG9kcyB0byB0aGUgaW5zdGFuY2UuXG4gICAgLy8gdGhpcy5zZW5kID0gdGhpcy5zZW5kLmJpbmQodGhpcyk7XG4gICAgLy8gdGhpcy5yZWNlaXZlID0gdGhpcy5yZWNlaXZlLmJpbmQodGhpcyk7XG4gICAgLy8gdGhpcy5yZW1vdmVMaXN0ZW5lciA9IHRoaXMucmVtb3ZlTGlzdGVuZXIuYmluZCh0aGlzKTtcblxuICAgIC8qKlxuICAgICAqIEZvciBtb2R1bGUgbGlmZWN5Y2xlLiBJcyBzZXQgdG8gdHJ1ZSB3aGVuIHRoZSBtb2R1bGUgc3RhcnRzIGFuZCBiYWNrIHRvIGZhbHNlIHdoZW4gYGRvbmVgXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9pc0FjdGl2ZSA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogRm9yIG1vZHVsZSBsaWZlY3ljbGUuIElzIHNldCB0byB0cnVlIHdoZW4gZG9uZSBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gICAgICogQWxsb3cgdG8gcmVzeW5jIHdpdGggc2VydmVyIHdpdGhvdXQgcmVzdGFydGluZyB0aGUgbW9kdWxlLlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5faXNEb25lID0gZmFsc2U7XG4gIH1cblxuICAvLyBNT1ZFRCBUTyBBQ1RJVklUWVxuICAvLyAvKipcbiAgLy8gICogU2hhcmUgdGhlIGRlZmluZWQgdGVtcGxhdGVzIHdpdGggYWxsIGBDbGllbnRNb2R1bGVgIGluc3RhbmNlcy5cbiAgLy8gICogQHBhcmFtIHtPYmplY3R9IGRlZnMgLSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgdGVtcGxhdGVzLlxuICAvLyAgKiBAcHJpdmF0ZVxuICAvLyAgKi9cbiAgLy8gc3RhdGljIHNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZnMpIHtcbiAgLy8gICBDbGllbnRNb2R1bGUucHJvdG90eXBlLnRlbXBsYXRlRGVmaW5pdGlvbnMgPSBkZWZzO1xuICAvLyB9XG5cbiAgLy8gLyoqXG4gIC8vICAqIFNoYXJlIHRoZSB0ZXh0IGNvbnRlbnQgY29uZmlndXJhdGlvbiAobmFtZSBhbmQgZGF0YSkgd2l0aCBhbGwgdGhlIGBDbGllbnRNb2R1bGVgIGluc3RhbmNlc1xuICAvLyAgKiBAcGFyYW0ge09iamVjdH0gZGVmcyAtIFRoZSB0ZXh0IGNvbnRlbnRzIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgLy8gICogQHByaXZhdGVcbiAgLy8gICovXG4gIC8vIHN0YXRpYyBzZXRWaWV3Q29udGVudERlZmluaXRpb25zKGRlZnMpIHtcbiAgLy8gICBDbGllbnRNb2R1bGUucHJvdG90eXBlLmNvbnRlbnREZWZpbml0aW9ucyA9IGRlZnM7XG4gIC8vIH1cblxuICAvLyAvKipcbiAgLy8gICogU2V0cyB0aGUgY29udGFpbmVyIG9mIHRoZSB2aWV3cyBmb3IgYWxsIGBDbGllbnRNb2R1bGVgIGluc3RhbmNlcy5cbiAgLy8gICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgZWxlbWVudCB0byB1c2UgYXMgYSBjb250YWluZXIgZm9yIHRoZSBtb2R1bGUncyB2aWV3LlxuICAvLyAgKi9cbiAgLy8gc3RhdGljIHNldFZpZXdDb250YWluZXIoJGVsKSB7XG4gIC8vICAgQ2xpZW50TW9kdWxlLnByb3RvdHlwZS4kY29udGFpbmVyID0gJGVsO1xuICAvLyB9XG5cbiAgLy8gLyoqXG4gIC8vICAqIFJldHVybnMgdGhlIHRlbXBsYXRlIGFzc29jaWF0ZWQgdG8gdGhlIGN1cnJlbnQgbW9kdWxlLlxuICAvLyAgKiBAcmV0dXJucyB7RnVuY3Rpb259IC0gVGhlIHRlbXBsYXRlIHJlbGF0ZWQgdG8gdGhlIGBuYW1lYCBvZiB0aGUgY3VycmVudCBtb2R1bGUuXG4gIC8vICAqL1xuICAvLyBnZXQgdGVtcGxhdGUoKSB7XG4gIC8vICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLl90ZW1wbGF0ZSB8fMKgdGhpcy50ZW1wbGF0ZURlZmluaXRpb25zW3RoaXMubmFtZV07XG4gIC8vICAgLy8gaWYgKCF0ZW1wbGF0ZSlcbiAgLy8gICAvLyAgIHRocm93IG5ldyBFcnJvcihgTm8gdGVtcGxhdGUgZGVmaW5lZCBmb3IgbW9kdWxlIFwiJHt0aGlzLm5hbWV9XCJgKTtcbiAgLy8gICByZXR1cm4gdGVtcGxhdGU7XG4gIC8vIH1cblxuICAvLyBzZXQgdGVtcGxhdGUodG1wbCkge1xuICAvLyAgIHRoaXMuX3RlbXBsYXRlID0gdG1wbDtcbiAgLy8gfVxuXG4gIC8vIC8qKlxuICAvLyAgKiBSZXR1cm5zIHRoZSB0ZXh0IGFzc29jaWF0ZWQgdG8gdGhlIGN1cnJlbnQgbW9kdWxlLlxuICAvLyAgKiBAcmV0dXJucyB7T2JqZWN0fSAtIFRoZSB0ZXh0IGNvbnRlbnRzIHJlbGF0ZWQgdG8gdGhlIGBuYW1lYCBvZiB0aGUgY3VycmVudCBtb2R1bGUuIFRoZSByZXR1cm5lZCBvYmplY3QgaXMgZXh0ZW5kZWQgd2l0aCBhIHBvaW50ZXIgdG8gdGhlIGBnbG9iYWxzYCBlbnRyeSBvZiB0aGUgZGVmaW5lZCB0ZXh0IGNvbnRlbnRzLlxuICAvLyAgKi9cbiAgLy8gZ2V0IGNvbnRlbnQoKSB7XG4gIC8vICAgY29uc3QgY29udGVudCA9IHRoaXMuX2NvbnRlbnQgfHzCoHRoaXMuY29udGVudERlZmluaXRpb25zW3RoaXMubmFtZV07XG5cbiAgLy8gICBpZiAoY29udGVudClcbiAgLy8gICAgIGNvbnRlbnQuZ2xvYmFscyA9IHRoaXMuY29udGVudERlZmluaXRpb25zLmdsb2JhbHM7XG5cbiAgLy8gICByZXR1cm4gY29udGVudDtcbiAgLy8gfVxuXG4gIC8vIHNldCBjb250ZW50KG9iaikge1xuICAvLyAgIHRoaXMuX2NvbnRlbnQgPSBvYmo7XG4gIC8vIH1cblxuICAvLyAvKipcbiAgLy8gICogQ3JlYXRlIHRoZSB2aWV3IG9mIHRoZSBtb2R1bGUgYWNjb3JkaW5nIHRvIGl0cyBhdHRyaWJ1dGVzLlxuICAvLyAgKi9cbiAgLy8gY3JlYXRlVmlldygpIHtcbiAgLy8gICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gIC8vICAgICBpZDogdGhpcy5uYW1lLFxuICAvLyAgICAgY2xhc3NOYW1lOiAnbW9kdWxlJ1xuICAvLyAgIH0sIHRoaXMudmlld09wdGlvbnMpO1xuXG4gIC8vICAgcmV0dXJuIG5ldyB0aGlzLnZpZXdDdG9yKHRoaXMudGVtcGxhdGUsIHRoaXMuY29udGVudCwgdGhpcy5ldmVudHMsIG9wdGlvbnMpO1xuICAvLyB9XG4gIC8vICFNT1ZFRCBUTyBBQ1RJVklUWVxuXG4gIC8qKlxuICAgKiBAdG9kbyAtIGRvY1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbGF1bmNoKCkge1xuICAgIC8vIGNvbnNvbGUubG9nKGAke3RoaXMubmFtZX06bGF1bmNoYCwgdGhpcy5faXNBY3RpdmUsIHRoaXMuX2lzRG9uZSk7XG4gICAgaWYgKHRoaXMuX2lzRG9uZSlcbiAgICAgIHRoaXMucmVzdGFydCgpO1xuICAgIGVsc2UgaWYgKHRoaXMuX2lzQWN0aXZlKVxuICAgICAgdGhpcy5yZXNldCgpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuc3RhcnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIG92ZXJyaWRlIGluIG9yZGVyIHRvIGluaXRpYWxpemUgbW9kdWxlIHN0YXRlIGFuZCBvcHRpb25uYWx5IGl0J3Mgdmlldy5cbiAgICogVGhlIG1vZHVsZSBzaG91bGQgcmV0dXJuIHRvIGEgZGVmYXVsdCBzdGF0ZSB3aGVuIHRoaXMgbWV0aG9kIGlzIGNhbGxlZC5cbiAgICovXG4gIGluaXQoKSB7XG4gICAgLy8gY29uc29sZS5sb2coYCR7dGhpcy5uYW1lfTppbml0YCk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIHRoZSBsb2dpYyBhbmQgc3RlcHMgdGhhdCBzdGFydHMgdGhlIG1vZHVsZS5cbiAgICogSXMgbWFpbmx5IHVzZWQgdG8gYXR0YWNoIGxpc3RlbmVycyB0byBjb21tdW5pY2F0aW9uIHdpdGggdGhlIHNlcnZlciBvciBvdGhlciBtb2R1bGVzIChlLmcuIG1vdGlvbklucHV0KS4gSWYgdGhlIG1vZHVsZSBoYXMgYSB2aWV3LCBpdCBpcyBhdHRhY2ggdG8gdGhlIERPTS5cbiAgICpcbiAgICogKipOb3RlOioqIHRoZSBtZXRob2QgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgd2hlbiBuZWNlc3NhcnksIHlvdSBzaG91bGQgbm90IGNhbGwgaXQgbWFudWFsbHkuXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgLy8gY29uc29sZS5sb2coYCR7dGhpcy5uYW1lfTpzdGFydGApO1xuICAgIGlmICh0aGlzLnZpZXcpIHtcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICAgIHRoaXMudmlldy5hcHBlbmRUbyh0aGlzLiRjb250YWluZXIpO1xuICAgIH1cblxuICAgIHRoaXMuX2lzQWN0aXZlID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgY29uc2lkZXJlZCBhcyB0aGUgb3Bwb3NpdGUgb2Yge0BsaW5rIENsaWVudE1vZHVsZSNzdGFydH0sIHJlbW92aW5nIGxpc3RlbmVycyBmcm9tIHNvY2tldCBvciBvdGhlciBtb2R1bGUgKGFrYSBtb3Rpb25JbnB1dCkuXG4gICAqIEl0IGlzIGludGVybmFsbHkgY2FsbGVkIGF0IDIgZGlmZmVyZW50IG1vbWVudCBvZiB0aGUgbW9kdWxlJ3MgbGlmZWN5Y2xlOlxuICAgKiAtIHdoZW4gdGhlIG1vZHVsZSBpcyB7QGxpbmsgQ2xpZW50TW9kdWxlI2RvbmV9XG4gICAqIC0gd2hlbiB0aGUgbW9kdWxlIGhhcyB0byByZXN0YXJ0IGJlY2F1c2Ugb2YgYSBzb2NrZXQgcmVjb25uZWN0aW9uIGR1cmluZyB0aGUgYWN0aXZlIHN0YXRlIG9mIHRoZSBtb2R1bGUuIEluIHRoaXMgcGFydGljdWxhciBjYXNlIHRoZSBtb2R1bGUgaXMgc3RvcHBlZCwgaW5pdGlhbGl6ZWQgYW5kIHN0YXJ0ZWQgYWdhaW4uXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gbmVjZXNzYXJ5LCB5b3Ugc2hvdWxkIG5vdCBjYWxsIGl0IG1hbnVhbGx5LlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHN0b3AoKSB7XG4gICAgLy8gY29uc29sZS5sb2coYCR7dGhpcy5uYW1lfTpzdG9wYCk7XG4gICAgaWYgKHRoaXMudmlldykge1xuICAgICAgdGhpcy52aWV3LnJlbW92ZSgpO1xuICAgICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLl9pc0FjdGl2ZSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBiZSBjYWxsZWQgd2hlbiB0aGUgbW9kdWxlIGhhcyBmaW5pc2hlZCBpdHMgaW5pdGlhbGl6YXRpb24gKCppLmUuKiB3aGVuIHRoZSBtb2R1bGUgaGFzIGRvbmUgaXRzIGR1dHksIG9yIHdoZW4gaXQgbWF5IHJ1biBpbiB0aGUgYmFja2dyb3VuZCBmb3IgdGhlIHJlc3Qgb2YgdGhlIHNjZW5hcmlvIGFmdGVyIGl0IGZpbmlzaGVkIGl0cyBpbml0aWFsaXphdGlvbiBwcm9jZXNzKSwgdG8gYWxsb3cgc3Vic2VxdWVudCBzdGVwcyBvZiB0aGUgc2NlbmFyaW8gdG8gc3RhcnQuXG4gICAqXG4gICAqIEZvciBpbnN0YW5jZSwgdGhlIHtAbGluayBMb2FkZXJ9IG1vZHVsZSBjYWxscyBpdHMge0BsaW5rIENsaWVudE1vZHVsZSNkb25lfSBtZXRob2Qgd2hlbiBmaWxlcyBhcmUgbG9hZGVkLCBhbmQgdGhlIHtAbGluayBDbGllbnRTeW5jfSBtb2R1bGUgY2FsbHMgaXQgd2hlbiB0aGUgZmlyc3Qgc3luY2hyb25pemF0aW9uIHByb2Nlc3MgaXMgZmluaXNoZWQgKHdoaWxlIHRoZSBtb2R1bGUga2VlcHMgcnVubmluZyBpbiB0aGUgYmFja2dyb3VuZCBhZnRlcndhcmRzKS5cbiAgICogQXMgYW4gZXhjZXB0aW9uLCB0aGUgbGFzdCBtb2R1bGUgb2YgdGhlIHNjZW5hcmlvICh1c3VhbGx5IHRoZSB7QGxpbmsgUGVyZm9ybWFuY2V9IG1vZHVsZSkgbWF5IG5vdCBjYWxsIGl0cyB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZC5cbiAgICpcbiAgICogSWYgdGhlIG1vZHVsZSBoYXMgYSBgdmlld2AsIHRoZSBgZG9uZWAgbWV0aG9kIHJlbW92ZXMgaXQgZnJvbSB0aGUgRE9NLlxuICAgKiBUaGUgbWV0aG9kIGludGVybmFsbHkgY2FsbCB7QGxpbmsgQ2xpZW50TW9kdWxlI3N0b3B9IHdoZXJlIHNvY2tldCBsaXN0ZW5lcnMgYW5kIHNvIG9uIHNob3VsZCBiZSByZW1vdmVkLlxuICAgKlxuICAgKiAqKk5vdGU6KiogeW91IHNob3VsZCBub3Qgb3ZlcnJpZGUgdGhpcyBtZXRob2QuXG4gICAqL1xuICBkb25lKCkge1xuICAgIC8vIGNvbnNvbGUubG9nKGAke3RoaXMubmFtZX06ZG9uZWApO1xuICAgIHRoaXMuc3RvcCgpO1xuXG4gICAgaWYgKHRoaXMucmVzb2x2ZVByb21pc2VkKVxuICAgICAgdGhpcy5yZXNvbHZlUHJvbWlzZWQoKTtcblxuICAgIHRoaXMuX2lzRG9uZSA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgYW4gYWN0aXZlIG1vZHVsZSB0byBpdCdzIGRlZmF1bHQgc3RhdGUuXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gbmVjZXNzYXJ5LCB5b3Ugc2hvdWxkIG5vdCBjYWxsIGl0IG1hbnVhbGx5LlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIC8vIGNvbnNvbGUubG9nKGAke3RoaXMubmFtZX06cmVzZXRgKTtcbiAgICB0aGlzLnN0b3AoKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgICB0aGlzLnN0YXJ0KCk7XG4gIH1cblxuICAvKipcbiAgICogKiBAdG9kbyAtIFRoaXMgcHJlcGFyZSB0aGUgaW5zdGFsbGF0aW9uIG9mIGEgc2VydmVyIHNpZGUgcGVyc2lzdGFuY2UuIE1vc3Qgb2YgdGhlIG1vZHVsZSBzaG91bGQgb3ZlcnJpZGUgaXQgZm9yIG5vdy5cbiAgICpcbiAgICogUmVzdGFydHMgYSBtb2R1bGUgYWZ0ZXIgaXQgaGFzIGJlZW4gY29uc2lkZXJlZCBhcyBgZG9uZWAuXG4gICAqIFRoZSBtYWluIG9iamVjdGl2ZSBvZiB0aGlzIG1ldGhvZCBpcyB0byByZXN0b3JlIHRoZSBkaXN0cmlidXRlZCBzdGF0ZSBiZXR3ZWVlbiB0aGUgY2xpZW50IGFuZCB0aGUgc2VydmVyIGFmdGVyIGEgZGlzY29ubmVjdGlvbi5cbiAgICogVGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIGEgbG9zdCBjb25uZWN0aW9uIHdpdGggdGhlIHNlcnZlciBpcyByZXN1bWVkIChiZWNhdXNlIG9mIGEgc2VydmVyIGNyYXNoKSBhbmQge0BsaW5rIENsaWVudE1vZHVsZSNkb25lfSBoYXMgYWxyZWFkeSBiZWVuIGNhbGxlZC5cbiAgICpcbiAgICogSWYgdGhlIHNlcnZlciBjcmFzaGVzLCBhbGwgaW4gbWVtb3J5IGluZm9ybWF0aW9ucyBhYm91dCB0aGUgc2hhcmVkIHN0YXRlIG9mIHRoZSBhcHBsaWNhdGlvbiBhcmUgbG9zdC4gT24gdGhlIGNsaWVudCBzaWRlLCB0aGUgbW9kdWxlcyB0aGF0IGhhZCBmaW5pc2hlZCB0aGVpciBpbml0aWFsaXphdGlvbiBtdXN0IHJlc3luY2hyb25pemUgd2l0aCB0aGUgc2VydmVyIHRvIHJlc3RvcmUgdGhlIGdsb2JhbCAoYW5kIGRpc3RyaWJ1dGVkKSBzdGF0ZSBvZiB0aGUgYXBwbGljYXRpb24uXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gbmVjZXNzYXJ5LCB5b3Ugc2hvdWxkIG5vdCBjYWxsIGl0IG1hbnVhbGx5LlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgLy8gY29uc29sZS5sb2coYCR7dGhpcy5uYW1lfTpyZXN0YXJ0YCk7XG4gICAgdGhpcy5pbml0KCk7XG4gICAgdGhpcy5zdGFydCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgdGhlIHZpZXcgb2YgYSBtb2R1bGUgaWYgaXQgb3ducyBvbmUgYW5kIGlzIG5vdCBkb25lLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSAtIHRydWUgaWYgdGhlIG1vZHVsZSBoYXMgYSB2aWV3IGFuZCBpcyBub3QgZG9uZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2hvdygpIHtcbiAgICBpZiAodGhpcy52aWV3ICYmICF0aGlzLl9pc0RvbmUpIHtcbiAgICAgIGlmICghdGhpcy52aWV3LmlzVmlzaWJsZSlcbiAgICAgICAgdGhpcy52aWV3LnNob3coKTtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgdGhlIHZpZXcgb2YgYSBtb2R1bGUgaWYgaXQgb3ducyBvbmUgYW5kIGlzIG5vdCBkb25lLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaGlkZSgpIHtcbiAgICBpZiAodGhpcy52aWV3ICYmICF0aGlzLl9kb25lKVxuICAgICAgdGhpcy52aWV3LmhpZGUoKTtcbiAgfVxuXG4gIC8vIE1PVkVEIFRPIENMSUVOVCBBQ1RJVklUWVxuICAvLyAvKipcbiAgLy8gICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyIHNpZGUgc29ja2V0LlxuICAvLyAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5uYW1lfTpjaGFubmVsYCkuXG4gIC8vICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgLy8gICovXG4gIC8vIHNlbmQoY2hhbm5lbCwgLi4uYXJncykge1xuICAvLyAgIGNvbW0uc2VuZChgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gLCAuLi5hcmdzKVxuICAvLyB9XG5cbiAgLy8gLyoqXG4gIC8vICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIHNvY2tldC5cbiAgLy8gICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAvLyAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gIC8vICAqL1xuICAvLyBzZW5kVm9sYXRpbGUoY2hhbm5lbCwgLi4uYXJncykge1xuICAvLyAgIGNvbW0uc2VuZFZvbGF0aWxlKGAke3RoaXMubmFtZX06JHtjaGFubmVsfWAsIC4uLmFyZ3MpXG4gIC8vIH1cblxuICAvLyAvKipcbiAgLy8gICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAvLyAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5uYW1lfTpjaGFubmVsYCkuXG4gIC8vICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgLy8gICovXG4gIC8vIHJlY2VpdmUoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgLy8gICBjb21tLnJlY2VpdmUoYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YCwgY2FsbGJhY2spO1xuICAvLyB9XG5cbiAgLy8gLyoqXG4gIC8vICAqIFN0b3AgbGlzdGVuaW5nIHRvIGEgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gIC8vICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLm5hbWV9OmNoYW5uZWxgKS5cbiAgLy8gICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBjYW5jZWwuXG4gIC8vICAqL1xuICAvLyByZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAvLyAgIGNvbW0ucmVtb3ZlTGlzdGVuZXIoYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YCwgY2FsbGJhY2spO1xuICAvLyB9XG4gIC8vICFNT1ZFRCBUTyBDTElFTlQgQUNUSVZJVFlcbn1cblxuQ2xpZW50TW9kdWxlLnNlcXVlbnRpYWwgPSBmdW5jdGlvbiguLi5tb2R1bGVzKSB7XG4gIHJldHVybiBuZXcgU2VxdWVudGlhbChtb2R1bGVzKTtcbn07XG5cbkNsaWVudE1vZHVsZS5wYXJhbGxlbCA9IGZ1bmN0aW9uKC4uLm1vZHVsZXMpIHtcbiAgcmV0dXJuIG5ldyBQYXJhbGxlbChtb2R1bGVzKTtcbn07XG4iXX0=