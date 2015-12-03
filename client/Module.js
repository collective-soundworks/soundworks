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

var container = window.container || (window.container = document.getElementById('container'));

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

    // set z-index of parallel modules
    var zIndex = modules.length;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = _getIterator(modules), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var mod = _step2.value;

        mod.zIndex = zIndex;
        zIndex--;
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
    key: 'createPromise',
    value: function createPromise() {
      return _Promise.all(this.modules.map(function (mod) {
        return mod.createPromise();
      }));
    }
  }, {
    key: 'launch',
    value: function launch() {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _getIterator(this.modules), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var mod = _step3.value;

          mod.launch();
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }]);

  return Parallel;
})(Promised);

var Module = (function (_Promised3) {
  _inherits(Module, _Promised3);

  /**
   * @param {String} name Name of the module (used as the `id` and CSS class of the `view` DOM element if it exists).
   * @param {Boolean} [createView=true] Indicates whether the module displays a `view` or not.
   * @param {[type]} [color='black'] Background color of the `view` when it exists.
   */

  function Module(name) {
    var createView = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
    var color = arguments.length <= 2 || arguments[2] === undefined ? 'black' : arguments[2];

    _classCallCheck(this, Module);

    // TODO: change to colorClass?
    _get(Object.getPrototypeOf(Module.prototype), 'constructor', this).call(this);

    /**
     * Name of the module.
     * @type {String}
     */
    this.name = name;

    /**
     * View of the module.
     *
     * The view is a DOM element (a full screen `div`) in which the content of the module is displayed.
     * This element is a child of the main container `div#container`, which is the only child of the `body` element.
     * A module may or may not have a view, as indicated by the argument `hasView:Boolean` of the {@link Module#constructor}.
     * When that is the case, the view is created and added to the DOM when the {@link Module#start} method is called, and is removed from the DOM when the {@link Module#done} method is called.
     * @type {DOMElement}
     */
    this.view = null;

    this._ownsView = false;
    this._showsView = false;
    this._isStarted = false;
    this._isDone = false;

    if (createView) {
      var div = document.createElement('div');
      div.setAttribute('id', name);
      div.classList.add(name);
      div.classList.add('module');
      div.classList.add(color);

      this.view = div;
      this._ownsView = true;
    }

    // bind com methods to the instance.
    this.send = this.send.bind(this);
    this.receive = this.receive.bind(this);
    this.removeListener = this.removeListener.bind(this);
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

  _createClass(Module, [{
    key: 'start',
    value: function start() {
      if (!this._isStarted) {
        if (this.view) {
          container.appendChild(this.view);
          this._showsView = true;
        }

        this._isStarted = true;
      }
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
      this._isStarted = false;
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

      if (this.view && this._showsView && this._ownsView) {
        container.removeChild(this.view);
        this._showsView = false;
      }

      if (this.resolvePromised) this.resolvePromised();
    }

    /**
     * Set an arbitrary centered HTML content to the module's `view` (if any).
     * @param {String} htmlContent The HTML content to append to the `view`.
     */
  }, {
    key: 'setCenteredViewContent',
    value: function setCenteredViewContent(htmlContent) {
      if (this.view) {
        if (!this._centeredViewContent) {
          var contentDiv = document.createElement('div');

          contentDiv.classList.add('centered-content');
          this.view.appendChild(contentDiv);

          this._centeredViewContent = contentDiv;
        }

        if (htmlContent) {
          if (htmlContent instanceof HTMLElement) {
            if (this._centeredViewContent.firstChild) {
              this._centeredViewContent.removeChild(this._centeredViewContent.firstChild);
            }

            this._centeredViewContent.appendChild(htmlContent);
          } else {
            // is a string
            this._centeredViewContent.innerHTML = htmlContent;
          }
        }
      }
    }

    /**
     * Removes the centered HTML content (set by {@link Module#setCenteredViewContent}) from the `view`.
     */
  }, {
    key: 'removeCenteredViewContent',
    value: function removeCenteredViewContent() {
      if (this.view && this._centeredViewContent) {
        this.view.removeChild(this._centeredViewContent);
        delete this._centeredViewContent;
      }
    }

    /**
     * `z-index` CSS property of the view
     * @param {Number} value Value of the `z-index`.
     */
  }, {
    key: 'send',

    /**
     * Sends a WebSocket message to the server side socket.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
    value: function send(channel) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      _comm2['default'].send.apply(_comm2['default'], [this.name + ':' + channel].concat(args));
    }
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
    key: 'zIndex',
    set: function set(value) {
      if (this.view) this.view.style.zIndex = value;
    }
  }]);

  return Module;
})(Promised);

exports['default'] = Module;

Module.sequential = function () {
  for (var _len3 = arguments.length, modules = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    modules[_key3] = arguments[_key3];
  }

  return new Sequential(modules);
};

Module.parallel = function () {
  for (var _len4 = arguments.length, modules = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    modules[_key4] = arguments[_key4];
  }

  return new Parallel(modules);
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvTW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUE2QixRQUFROztvQkFDcEIsUUFBUTs7OztBQUV6QixJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQSxBQUFDLENBQUM7Ozs7OztJQUsxRixRQUFRO1lBQVIsUUFBUTs7QUFDRCxXQURQLFFBQVEsR0FDRTswQkFEVixRQUFROztBQUVWLCtCQUZFLFFBQVEsNkNBRUY7Ozs7Ozs7QUFPUixRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztHQUM3Qjs7Ozs7O2VBVkcsUUFBUTs7V0FZQyx5QkFBRzs7O0FBQ2QsYUFBTyxhQUFZLFVBQUMsT0FBTztlQUFLLE1BQUssZUFBZSxHQUFHLE9BQU87T0FBQSxDQUFDLENBQUM7S0FDakU7OztXQUVLLGtCQUFHLEVBRVI7OztTQWxCRyxRQUFROzs7SUF3QlIsVUFBVTtZQUFWLFVBQVU7O0FBQ0gsV0FEUCxVQUFVLENBQ0YsT0FBTyxFQUFFOzBCQURqQixVQUFVOztBQUVaLCtCQUZFLFVBQVUsNkNBRUo7O0FBRVIsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7R0FDeEI7Ozs7OztlQUxHLFVBQVU7O1dBT0QseUJBQUc7QUFDZCxVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDZixVQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7Ozs7Ozs7O2NBRVgsSUFBSTs7QUFDVixjQUFHLEdBQUcsS0FBSyxJQUFJLEVBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQzttQkFBTSxJQUFJLENBQUMsTUFBTSxFQUFFO1dBQUEsQ0FBQyxDQUFDOztBQUVwQyxhQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ1gsaUJBQU8sR0FBRyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7OztBQUxoQywwQ0FBZ0IsSUFBSSxD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LElBQUksRUFBQyxDQUFBO0tBQ3REOzs7Ozs7Ozs7V0FPTSxpQkFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3pCLHdCQUFLLE9BQU8sQ0FBSSxJQUFJLENBQUMsSUFBSSxTQUFJLE9BQU8sRUFBSSxRQUFRLENBQUMsQ0FBQztLQUNuRDs7Ozs7Ozs7O1dBT2Esd0JBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUNoQyx3QkFBSyxjQUFjLENBQUksSUFBSSxDQUFDLElBQUksU0FBSSxPQUFPLEVBQUksUUFBUSxDQUFDLENBQUM7S0FDMUQ7OztTQWxDUyxhQUFDLEtBQUssRUFBRTtBQUNoQixVQUFHLElBQUksQ0FBQyxJQUFJLEVBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztLQUNsQzs7O1NBdkxrQixNQUFNO0dBQVMsUUFBUTs7cUJBQXZCLE1BQU07O0FBeU4zQixNQUFNLENBQUMsVUFBVSxHQUFHLFlBQXFCO3FDQUFULE9BQU87QUFBUCxXQUFPOzs7QUFDckMsU0FBTyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUNoQyxDQUFDOztBQUVGLE1BQU0sQ0FBQyxRQUFRLEdBQUcsWUFBcUI7cUNBQVQsT0FBTztBQUFQLFdBQU87OztBQUNuQyxTQUFPLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQzlCLENBQUMiLCJmaWxlIjoic3JjL2NsaWVudC9Nb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IGNvbW0gZnJvbSAnLi9jb21tJztcblxuY29uc3QgY29udGFpbmVyID0gd2luZG93LmNvbnRhaW5lciB8fCAod2luZG93LmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKSk7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgUHJvbWlzZWQgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIC8qKlxuICAgICAqIFtyZXNvbHZlUHJvbWlzZWQgZGVzY3JpcHRpb25dXG4gICAgICogQHRvZG8gZGVzY3JpcHRpb25cbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnJlc29sdmVQcm9taXNlZCA9IG51bGw7XG4gIH1cblxuICBjcmVhdGVQcm9taXNlKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gdGhpcy5yZXNvbHZlUHJvbWlzZWQgPSByZXNvbHZlKTtcbiAgfVxuXG4gIGxhdW5jaCgpIHtcblxuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgU2VxdWVudGlhbCBleHRlbmRzIFByb21pc2VkIHtcbiAgY29uc3RydWN0b3IobW9kdWxlcykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm1vZHVsZXMgPSBtb2R1bGVzO1xuICB9XG5cbiAgY3JlYXRlUHJvbWlzZSgpIHtcbiAgICBsZXQgbW9kID0gbnVsbDtcbiAgICBsZXQgcHJvbWlzZSA9IG51bGw7XG5cbiAgICBmb3IobGV0IG5leHQgb2YgdGhpcy5tb2R1bGVzKSB7XG4gICAgICBpZihtb2QgIT09IG51bGwpXG4gICAgICAgIHByb21pc2UudGhlbigoKSA9PiBuZXh0LmxhdW5jaCgpKTtcblxuICAgICAgbW9kID0gbmV4dDtcbiAgICAgIHByb21pc2UgPSBtb2QuY3JlYXRlUHJvbWlzZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgbGF1bmNoKCkge1xuICAgIHJldHVybiB0aGlzLm1vZHVsZXNbMF0ubGF1bmNoKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBQYXJhbGxlbCBleHRlbmRzIFByb21pc2VkIHtcbiAgY29uc3RydWN0b3IobW9kdWxlcykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm1vZHVsZXMgPSBtb2R1bGVzO1xuXG4gICAgLy8gc2V0IHotaW5kZXggb2YgcGFyYWxsZWwgbW9kdWxlc1xuICAgIGxldCB6SW5kZXggPSBtb2R1bGVzLmxlbmd0aDtcbiAgICBmb3IobGV0IG1vZCBvZiBtb2R1bGVzKSB7XG4gICAgICBtb2QuekluZGV4ID0gekluZGV4O1xuICAgICAgekluZGV4LS07XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlUHJvbWlzZSgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwodGhpcy5tb2R1bGVzLm1hcCgobW9kKSA9PiBtb2QuY3JlYXRlUHJvbWlzZSgpKSk7XG4gIH1cblxuICBsYXVuY2goKSB7XG4gICAgZm9yKGxldCBtb2Qgb2YgdGhpcy5tb2R1bGVzKVxuICAgICAgbW9kLmxhdW5jaCgpO1xuICB9XG59XG5cbi8qKlxuICogW2NsaWVudF0gQmFzZSBjbGFzcyB1c2VkIHRvIGNyZWF0ZSBhbnkgKlNvdW5kd29ya3MqIG1vZHVsZSBvbiB0aGUgY2xpZW50IHNpZGUuXG4gKlxuICogRWFjaCBtb2R1bGUgc2hvdWxkIGhhdmUgYSB7QGxpbmsgTW9kdWxlI3N0YXJ0fSwgYSB7QGxpbmsgTW9kdWxlI3Jlc2V0fSwgYSB7QGxpbmsgTW9kdWxlI3Jlc3RhcnR9IGFuZCBhIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kcy5cbiAqXG4gKiBUaGUgYmFzZSBjbGFzcyBvcHRpb25hbGx5IGNyZWF0ZXMgYSB2aWV3IChhIGZ1bGxzY3JlZW4gYGRpdmAgYWNjZXNzaWJsZSB0aHJvdWdoIHRoZSB7QGxpbmsgTW9kdWxlLnZpZXd9IGF0dHJpYnV0ZSkuXG4gKiBUaGUgdmlldyBpcyBhZGRlZCB0byB0aGUgRE9NIChhcyBhIGNoaWxkIG9mIHRoZSBgI2NvbnRhaW5lcmAgZWxlbWVudCkgd2hlbiB0aGUgbW9kdWxlIGlzIHN0YXJ0ZWQgKHdpdGggdGhlIHtAbGluayBNb2R1bGUjc3RhcnR9IG1ldGhvZCksIGFuZCByZW1vdmVkIHdoZW4gdGhlIG1vZHVsZSBjYWxscyBpdHMge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2QuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL01vZHVsZS5qc35Nb2R1bGV9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogKipOb3RlOioqIGEgbW9yZSBjb21wbGV0ZSBleGFtcGxlIG9mIGhvdyB0byB3cml0ZSBhIG1vZHVsZSBpcyBpbiB0aGUgW0V4YW1wbGVdKG1hbnVhbC9leGFtcGxlLmh0bWwpIHNlY3Rpb24uXG4gKlxuICogQGV4YW1wbGUgY2xhc3MgTXlNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICogICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAqICAgICAvLyBUaGlzIGV4YW1wbGUgbW9kdWxlOlxuICogICAgIC8vIC0gYWx3YXlzIGhhcyBhIHZpZXdcbiAqICAgICAvLyAtIGhhcyB0aGUgaWQgYW5kIGNsYXNzICdteS1tb2R1bGUtbmFtZSdcbiAqICAgICAvLyAtIGFuZCB1c2VzIHRoZSBiYWNrZ3JvdW5kIGNvbG9yIGRlZmluZWQgaW4gdGhlIGFyZ3VtZW50ICdvcHRpb25zJyAoaWYgYW55KS5cbiAqICAgICBzdXBlcignbXktbW9kdWxlLW5hbWUnLCB0cnVlLCBvcHRpb25zLmNvbG9yIHx8ICdhbGl6YXJpbicpO1xuICpcbiAqICAgICAuLi4gLy8gYW55dGhpbmcgdGhlIGNvbnN0cnVjdG9yIG5lZWRzXG4gKiAgIH1cbiAqXG4gKiAgIHN0YXJ0KCkge1xuICogICAgIHN1cGVyLnN0YXJ0KCk7XG4gKlxuICogICAgIC8vIFdoYXRldmVyIHRoZSBtb2R1bGUgZG9lcyAoY29tbXVuaWNhdGlvbiB3aXRoIHRoZSBzZXJ2ZXIsIGV0Yy4pXG4gKiAgICAgLy8gLi4uXG4gKlxuICogICAgIC8vIENhbGwgdGhlIGBkb25lYCBtZXRob2Qgd2hlbiB0aGUgbW9kdWxlIGhhcyBmaW5pc2hlZCBpdHMgaW5pdGlhbGl6YXRpb25cbiAqICAgICB0aGlzLmRvbmUoKTtcbiAqICAgfVxuICogfVxuICogQHRvZG8gTW92ZSBleGFtcGxlIGluIHRoZSBtYW51YWw/XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vZHVsZSBleHRlbmRzIFByb21pc2VkIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIG1vZHVsZSAodXNlZCBhcyB0aGUgYGlkYCBhbmQgQ1NTIGNsYXNzIG9mIHRoZSBgdmlld2AgRE9NIGVsZW1lbnQgaWYgaXQgZXhpc3RzKS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbY3JlYXRlVmlldz10cnVlXSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgbW9kdWxlIGRpc3BsYXlzIGEgYHZpZXdgIG9yIG5vdC5cbiAgICogQHBhcmFtIHtbdHlwZV19IFtjb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2Agd2hlbiBpdCBleGlzdHMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihuYW1lLCBjcmVhdGVWaWV3ID0gdHJ1ZSwgY29sb3IgPSAnYmxhY2snKSB7IC8vIFRPRE86IGNoYW5nZSB0byBjb2xvckNsYXNzP1xuICAgIHN1cGVyKCk7XG5cbiAgICAvKipcbiAgICAgKiBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuXG4gICAgLyoqXG4gICAgICogVmlldyBvZiB0aGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogVGhlIHZpZXcgaXMgYSBET00gZWxlbWVudCAoYSBmdWxsIHNjcmVlbiBgZGl2YCkgaW4gd2hpY2ggdGhlIGNvbnRlbnQgb2YgdGhlIG1vZHVsZSBpcyBkaXNwbGF5ZWQuXG4gICAgICogVGhpcyBlbGVtZW50IGlzIGEgY2hpbGQgb2YgdGhlIG1haW4gY29udGFpbmVyIGBkaXYjY29udGFpbmVyYCwgd2hpY2ggaXMgdGhlIG9ubHkgY2hpbGQgb2YgdGhlIGBib2R5YCBlbGVtZW50LlxuICAgICAqIEEgbW9kdWxlIG1heSBvciBtYXkgbm90IGhhdmUgYSB2aWV3LCBhcyBpbmRpY2F0ZWQgYnkgdGhlIGFyZ3VtZW50IGBoYXNWaWV3OkJvb2xlYW5gIG9mIHRoZSB7QGxpbmsgTW9kdWxlI2NvbnN0cnVjdG9yfS5cbiAgICAgKiBXaGVuIHRoYXQgaXMgdGhlIGNhc2UsIHRoZSB2aWV3IGlzIGNyZWF0ZWQgYW5kIGFkZGVkIHRvIHRoZSBET00gd2hlbiB0aGUge0BsaW5rIE1vZHVsZSNzdGFydH0gbWV0aG9kIGlzIGNhbGxlZCwgYW5kIGlzIHJlbW92ZWQgZnJvbSB0aGUgRE9NIHdoZW4gdGhlIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kIGlzIGNhbGxlZC5cbiAgICAgKiBAdHlwZSB7RE9NRWxlbWVudH1cbiAgICAgKi9cbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuXG4gICAgdGhpcy5fb3duc1ZpZXcgPSBmYWxzZTtcbiAgICB0aGlzLl9zaG93c1ZpZXcgPSBmYWxzZTtcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9pc0RvbmUgPSBmYWxzZTtcblxuICAgIGlmIChjcmVhdGVWaWV3KSB7XG4gICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuc2V0QXR0cmlidXRlKCdpZCcsIG5hbWUpO1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQobmFtZSk7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnbW9kdWxlJyk7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZChjb2xvcik7XG5cbiAgICAgIHRoaXMudmlldyA9IGRpdjtcbiAgICAgIHRoaXMuX293bnNWaWV3ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBiaW5kIGNvbSBtZXRob2RzIHRvIHRoZSBpbnN0YW5jZS5cbiAgICB0aGlzLnNlbmQgPSB0aGlzLnNlbmQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlY2VpdmUgPSB0aGlzLnJlY2VpdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyID0gdGhpcy5yZW1vdmVMaXN0ZW5lci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSB0aGUgbG9naWMgYW5kIHN0ZXBzIHRoYXQgbGVhZCB0byB0aGUgaW5pdGlhbGl6YXRpb24gb2YgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogRm9yIGluc3RhbmNlLCBpdCB0YWtlcyBjYXJlIG9mIHRoZSBjb21tdW5pY2F0aW9uIHdpdGggdGhlIG1vZHVsZSBvbiB0aGUgc2VydmVyIHNpZGUgYnkgc2VuZGluZyBXZWJTb2NrZXQgbWVzc2FnZXMgYW5kIHNldHRpbmcgdXAgV2ViU29ja2V0IG1lc3NhZ2UgbGlzdGVuZXJzLlxuICAgKlxuICAgKiBBZGRpdGlvbmFsbHksIGlmIHRoZSBtb2R1bGUgaGFzIGEgYHZpZXdgLCB0aGUgYHN0YXJ0YCBtZXRob2QgY3JlYXRlcyB0aGUgY29ycmVzcG9uZGluZyBIVE1MIGVsZW1lbnQgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIERPTeKAmXMgbWFpbiBjb250YWluZXIgZWxlbWVudCAoYGRpdiNjb250YWluZXJgKS5cbiAgICpcbiAgICogKipOb3RlOioqIHRoZSBtZXRob2QgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgd2hlbiBuZWNlc3NhcnksIHlvdSBzaG91bGQgbm90IGNhbGwgaXQgbWFudWFsbHkuXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgaWYoIXRoaXMuX2lzU3RhcnRlZCkge1xuICAgICAgaWYgKHRoaXMudmlldykge1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy52aWV3KTtcbiAgICAgICAgdGhpcy5fc2hvd3NWaWV3ID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5faXNTdGFydGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIG1vZHVsZSB0byB0aGUgc3RhdGUgaXQgaGFkIGJlZm9yZSBjYWxsaW5nIHRoZSB7QGxpbmsgTW9kdWxlI3N0YXJ0fSBtZXRob2QuXG4gICAqXG4gICAqIFRoZSBtZXRob2QgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgd2hlbiBhIGxvc3QgY29ubmVjdGlvbiB3aXRoIHRoZSBzZXJ2ZXIgaXMgcmVzdW1lZCAoZm9yIGluc3RhbmNlIGJlY2F1c2Ugb2YgYSBzZXJ2ZXIgY3Jhc2gpLCBpZiB0aGUgbW9kdWxlIGhhZCBub3QgZmluaXNoZWQgaXRzIGluaXRpYWxpemF0aW9uICgqaS5lLiogaWYgaXQgaGFkIG5vdCBjYWxsZWQgaXRzIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kKS5cbiAgICogSW4gdGhhdCBjYXNlLCB0aGUgbW9kdWxlIGNsZWFucyB3aGF0ZXZlciBpdCB3YXMgZG9pbmcgYW5kIHN0YXJ0cyBhZ2FpbiBmcm9tIHNjcmF0Y2guXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gbmVjZXNzYXJ5LCB5b3Ugc2hvdWxkIG5vdCBjYWxsIGl0IG1hbnVhbGx5LlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnQgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogVGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIGEgbG9zdCBjb25uZWN0aW9uIHdpdGggdGhlIHNlcnZlciBpcyByZXN1bWVkIChmb3IgaW5zdGFuY2UgYmVjYXVzZSBvZiBhIHNlcnZlciBjcmFzaCksIGlmIHRoZSBtb2R1bGUgaGFkIGFscmVhZHkgZmluaXNoZWQgaXRzIGluaXRpYWxpemF0aW9uICgqaS5lLiogaWYgaXQgaGFkIGNhbGxlZCBpdHMge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2QpLlxuICAgKiBUaGUgbWV0aG9kIHNob3VsZCBzZW5kIHRvIHRoZSBzZXJ2ZXIgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogKEluZGVlZCwgaWYgdGhlIHNlcnZlciBjcmFzaGVzLCBpdCB3aWxsIHJlc2V0IGFsbCB0aGUgaW5mb3JtYXRpb24gaXQgaGFzIGFib3V0IGFsbCB0aGUgY2xpZW50cy5cbiAgICogT24gdGhlIGNsaWVudCBzaWRlLCB0aGUgbW9kdWxlcyB0aGF0IGhhZCBmaW5pc2hlZCB0aGVpciBpbml0aWFsaXphdGlvbiBwcm9jZXNzIHNob3VsZCBzZW5kIHRoZWlyIHN0YXRlIHRvIHRoZSBzZXJ2ZXIgc28gdGhhdCBpdCBjYW4gYmUgdXAgdG8gZGF0ZSB3aXRoIHRoZSByZWFsIHN0YXRlIG9mIHRoZSBzY2VuYXJpby4pXG4gICAqXG4gICAqIEZvciBpbnN0YW5jZSwgdGhpcyBtZXRob2QgaW4gdGhlIHtAbGluayBMb2NhdG9yfSBtb2R1bGUgc2VuZHMgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBjbGllbnQgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogKipOb3RlOioqIHRoZSBtZXRob2QgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgd2hlbiBuZWNlc3NhcnksIHlvdSBzaG91bGQgbm90IGNhbGwgaXQgbWFudWFsbHkuXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICB0aGlzLl9pc0RvbmUgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbGF1bmNoKCkge1xuICAgIGlmICh0aGlzLl9pc0RvbmUpIHtcbiAgICAgIHRoaXMucmVzdGFydCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5faXNTdGFydGVkKVxuICAgICAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIGJlIGNhbGxlZCB3aGVuIHRoZSBtb2R1bGUgaGFzIGZpbmlzaGVkIGl0cyBpbml0aWFsaXphdGlvbiAoKmkuZS4qIHdoZW4gdGhlIG1vZHVsZSBoYXMgZG9uZSBpdHMgZHV0eSwgb3Igd2hlbiBpdCBtYXkgcnVuIGluIHRoZSBiYWNrZ3JvdW5kIGZvciB0aGUgcmVzdCBvZiB0aGUgc2NlbmFyaW8gYWZ0ZXIgaXQgZmluaXNoZWQgaXRzIGluaXRpYWxpemF0aW9uIHByb2Nlc3MpLCB0byBhbGxvdyBzdWJzZXF1ZW50IHN0ZXBzIG9mIHRoZSBzY2VuYXJpbyB0byBzdGFydC5cbiAgICpcbiAgICogRm9yIGluc3RhbmNlLCB0aGUge0BsaW5rIExvYWRlcn0gbW9kdWxlIGNhbGxzIGl0cyB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZCB3aGVuIGZpbGVzIGFyZSBsb2FkZWQsIGFuZCB0aGUge0BsaW5rIFN5bmN9IG1vZHVsZSBjYWxscyBpdCB3aGVuIHRoZSBmaXJzdCBzeW5jaHJvbml6YXRpb24gcHJvY2VzcyBpcyBmaW5pc2hlZCAod2hpbGUgdGhlIG1vZHVsZSBrZWVwcyBydW5uaW5nIGluIHRoZSBiYWNrZ3JvdW5kIGFmdGVyd2FyZHMpLlxuICAgKiBBcyBhbiBleGNlcHRpb24sIHRoZSBsYXN0IG1vZHVsZSBvZiB0aGUgc2NlbmFyaW8gKHVzdWFsbHkgdGhlIHtAbGluayBQZXJmb3JtYW5jZX0gbW9kdWxlKSBtYXkgbm90IGNhbGwgaXRzIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kLlxuICAgKlxuICAgKiBJZiB0aGUgbW9kdWxlIGhhcyBhIGB2aWV3YCwgdGhlIGBkb25lYCBtZXRob2QgcmVtb3ZlcyBpdCBmcm9tIHRoZSBET00uXG4gICAqXG4gICAqICoqTm90ZToqKiB5b3Ugc2hvdWxkIG5vdCBvdmVycmlkZSB0aGlzIG1ldGhvZC5cbiAgICovXG4gIGRvbmUoKSB7XG4gICAgdGhpcy5faXNEb25lID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLnZpZXcgJiYgdGhpcy5fc2hvd3NWaWV3ICYmIHRoaXMuX293bnNWaWV3KSB7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy52aWV3KTtcbiAgICAgIHRoaXMuX3Nob3dzVmlldyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlc29sdmVQcm9taXNlZClcbiAgICAgIHRoaXMucmVzb2x2ZVByb21pc2VkKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGFuIGFyYml0cmFyeSBjZW50ZXJlZCBIVE1MIGNvbnRlbnQgdG8gdGhlIG1vZHVsZSdzIGB2aWV3YCAoaWYgYW55KS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGh0bWxDb250ZW50IFRoZSBIVE1MIGNvbnRlbnQgdG8gYXBwZW5kIHRvIHRoZSBgdmlld2AuXG4gICAqL1xuICBzZXRDZW50ZXJlZFZpZXdDb250ZW50KGh0bWxDb250ZW50KSB7XG4gICAgaWYgKHRoaXMudmlldykge1xuICAgICAgaWYgKCF0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50KSB7XG4gICAgICAgIGxldCBjb250ZW50RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgY29udGVudERpdi5jbGFzc0xpc3QuYWRkKCdjZW50ZXJlZC1jb250ZW50Jyk7XG4gICAgICAgIHRoaXMudmlldy5hcHBlbmRDaGlsZChjb250ZW50RGl2KTtcblxuICAgICAgICB0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50ID0gY29udGVudERpdjtcbiAgICAgIH1cblxuICAgICAgaWYgKGh0bWxDb250ZW50KSB7XG4gICAgICAgIGlmIChodG1sQ29udGVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudC5yZW1vdmVDaGlsZCh0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQuYXBwZW5kQ2hpbGQoaHRtbENvbnRlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGlzIGEgc3RyaW5nXG4gICAgICAgICAgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudC5pbm5lckhUTUwgPSBodG1sQ29udGVudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBjZW50ZXJlZCBIVE1MIGNvbnRlbnQgKHNldCBieSB7QGxpbmsgTW9kdWxlI3NldENlbnRlcmVkVmlld0NvbnRlbnR9KSBmcm9tIHRoZSBgdmlld2AuXG4gICAqL1xuICByZW1vdmVDZW50ZXJlZFZpZXdDb250ZW50KCkge1xuICAgIGlmICh0aGlzLnZpZXcgJiYgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudCkge1xuICAgICAgdGhpcy52aWV3LnJlbW92ZUNoaWxkKHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQpO1xuICAgICAgZGVsZXRlIHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGB6LWluZGV4YCBDU1MgcHJvcGVydHkgb2YgdGhlIHZpZXdcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIFZhbHVlIG9mIHRoZSBgei1pbmRleGAuXG4gICAqL1xuICBzZXQgekluZGV4KHZhbHVlKSB7XG4gICAgaWYodGhpcy52aWV3KVxuICAgICAgdGhpcy52aWV3LnN0eWxlLnpJbmRleCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIHNvY2tldC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb21tLnNlbmQoYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YCwgLi4uYXJncylcbiAgfVxuXG4gIHNlbmRWb2xhdGlsZShjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29tbS5zZW5kVm9sYXRpbGUoYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YCwgLi4uYXJncylcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gYSBXZWJTb2NrZXQgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLm5hbWV9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNvbW0ucmVjZWl2ZShgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCBsaXN0ZW5pbmcgdG8gYSBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGNhbmNlbC5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY29tbS5yZW1vdmVMaXN0ZW5lcihgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuTW9kdWxlLnNlcXVlbnRpYWwgPSBmdW5jdGlvbiguLi5tb2R1bGVzKSB7XG4gIHJldHVybiBuZXcgU2VxdWVudGlhbChtb2R1bGVzKTtcbn07XG5cbk1vZHVsZS5wYXJhbGxlbCA9IGZ1bmN0aW9uKC4uLm1vZHVsZXMpIHtcbiAgcmV0dXJuIG5ldyBQYXJhbGxlbChtb2R1bGVzKTtcbn07XG4iXX0=