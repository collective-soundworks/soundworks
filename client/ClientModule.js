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

var ClientModule = (function (_Promised3) {
  _inherits(ClientModule, _Promised3);

  /**
   * @param {String} name Name of the module (used as the `id` and CSS class of the `view` DOM element if it exists).
   * @param {Boolean} [createView=true] Indicates whether the module displays a `view` or not.
   * @param {[type]} [color='black'] Background color of the `view` when it exists.
   */

  function ClientModule(name) {
    var createView = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
    var color = arguments.length <= 2 || arguments[2] === undefined ? 'black' : arguments[2];

    _classCallCheck(this, ClientModule);

    // TODO: change to colorClass?
    _get(Object.getPrototypeOf(ClientModule.prototype), 'constructor', this).call(this);

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

  _createClass(ClientModule, [{
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

  return ClientModule;
})(Promised);

exports['default'] = ClientModule;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFBNkIsUUFBUTs7b0JBQ3BCLFFBQVE7Ozs7QUFFekIsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsS0FBSyxNQUFNLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUEsQUFBQyxDQUFDOzs7Ozs7SUFLMUYsUUFBUTtZQUFSLFFBQVE7O0FBQ0QsV0FEUCxRQUFRLEdBQ0U7MEJBRFYsUUFBUTs7QUFFViwrQkFGRSxRQUFRLDZDQUVGOzs7Ozs7O0FBT1IsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7R0FDN0I7Ozs7OztlQVZHLFFBQVE7O1dBWUMseUJBQUc7OztBQUNkLGFBQU8sYUFBWSxVQUFDLE9BQU87ZUFBSyxNQUFLLGVBQWUsR0FBRyxPQUFPO09BQUEsQ0FBQyxDQUFDO0tBQ2pFOzs7V0FFSyxrQkFBRyxFQUVSOzs7U0FsQkcsUUFBUTs7O0lBd0JSLFVBQVU7WUFBVixVQUFVOztBQUNILFdBRFAsVUFBVSxDQUNGLE9BQU8sRUFBRTswQkFEakIsVUFBVTs7QUFFWiwrQkFGRSxVQUFVLDZDQUVKOztBQUVSLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0dBQ3hCOzs7Ozs7ZUFMRyxVQUFVOztXQU9ELHlCQUFHO0FBQ2QsVUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2YsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDOzs7Ozs7OztjQUVYLElBQUk7O0FBQ1YsY0FBRyxHQUFHLEtBQUssSUFBSSxFQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUM7bUJBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRTtXQUFBLENBQUMsQ0FBQzs7QUFFcEMsYUFBRyxHQUFHLElBQUksQ0FBQztBQUNYLGlCQUFPLEdBQUcsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDOzs7QUFMaEMsMENBQWdC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LE9BQU8sU0FBTyxJQUFJLEVBQUMsQ0FBQTtLQUN0RDs7Ozs7Ozs7O1dBT00saUJBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN6Qix3QkFBSyxPQUFPLENBQUksSUFBSSxDQUFDLElBQUksU0FBSSxPQUFPLEVBQUksUUFBUSxDQUFDLENBQUM7S0FDbkQ7Ozs7Ozs7OztXQU9hLHdCQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDaEMsd0JBQUssY0FBYyxDQUFJLElBQUksQ0FBQyxJQUFJLFNBQUksT0FBTyxFQUFJLFFBQVEsQ0FBQyxDQUFDO0tBQzFEOzs7U0FsQ1MsYUFBQyxLQUFLLEVBQUU7QUFDaEIsVUFBRyxJQUFJLENBQUMsSUFBSSxFQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7S0FDbEM7OztTQXZMa0IsWUFBWTtHQUFTLFFBQVE7O3FCQUE3QixZQUFZOztBQXlOakMsTUFBTSxDQUFDLFVBQVUsR0FBRyxZQUFxQjtxQ0FBVCxPQUFPO0FBQVAsV0FBTzs7O0FBQ3JDLFNBQU8sSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDaEMsQ0FBQzs7QUFFRixNQUFNLENBQUMsUUFBUSxHQUFHLFlBQXFCO3FDQUFULE9BQU87QUFBUCxXQUFPOzs7QUFDbkMsU0FBTyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUM5QixDQUFDIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgY29tbSBmcm9tICcuL2NvbW0nO1xuXG5jb25zdCBjb250YWluZXIgPSB3aW5kb3cuY29udGFpbmVyIHx8ICh3aW5kb3cuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpKTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBQcm9taXNlZCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgLyoqXG4gICAgICogW3Jlc29sdmVQcm9taXNlZCBkZXNjcmlwdGlvbl1cbiAgICAgKiBAdG9kbyBkZXNjcmlwdGlvblxuICAgICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucmVzb2x2ZVByb21pc2VkID0gbnVsbDtcbiAgfVxuXG4gIGNyZWF0ZVByb21pc2UoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB0aGlzLnJlc29sdmVQcm9taXNlZCA9IHJlc29sdmUpO1xuICB9XG5cbiAgbGF1bmNoKCkge1xuXG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBTZXF1ZW50aWFsIGV4dGVuZHMgUHJvbWlzZWQge1xuICBjb25zdHJ1Y3Rvcihtb2R1bGVzKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG4gIH1cblxuICBjcmVhdGVQcm9taXNlKCkge1xuICAgIGxldCBtb2QgPSBudWxsO1xuICAgIGxldCBwcm9taXNlID0gbnVsbDtcblxuICAgIGZvcihsZXQgbmV4dCBvZiB0aGlzLm1vZHVsZXMpIHtcbiAgICAgIGlmKG1vZCAhPT0gbnVsbClcbiAgICAgICAgcHJvbWlzZS50aGVuKCgpID0+IG5leHQubGF1bmNoKCkpO1xuXG4gICAgICBtb2QgPSBuZXh0O1xuICAgICAgcHJvbWlzZSA9IG1vZC5jcmVhdGVQcm9taXNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBsYXVuY2goKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kdWxlc1swXS5sYXVuY2goKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIFBhcmFsbGVsIGV4dGVuZHMgUHJvbWlzZWQge1xuICBjb25zdHJ1Y3Rvcihtb2R1bGVzKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG5cbiAgICAvLyBzZXQgei1pbmRleCBvZiBwYXJhbGxlbCBtb2R1bGVzXG4gICAgbGV0IHpJbmRleCA9IG1vZHVsZXMubGVuZ3RoO1xuICAgIGZvcihsZXQgbW9kIG9mIG1vZHVsZXMpIHtcbiAgICAgIG1vZC56SW5kZXggPSB6SW5kZXg7XG4gICAgICB6SW5kZXgtLTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVQcm9taXNlKCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbCh0aGlzLm1vZHVsZXMubWFwKChtb2QpID0+IG1vZC5jcmVhdGVQcm9taXNlKCkpKTtcbiAgfVxuXG4gIGxhdW5jaCgpIHtcbiAgICBmb3IobGV0IG1vZCBvZiB0aGlzLm1vZHVsZXMpXG4gICAgICBtb2QubGF1bmNoKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBbY2xpZW50XSBCYXNlIGNsYXNzIHVzZWQgdG8gY3JlYXRlIGFueSAqU291bmR3b3JrcyogbW9kdWxlIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAqXG4gKiBFYWNoIG1vZHVsZSBzaG91bGQgaGF2ZSBhIHtAbGluayBNb2R1bGUjc3RhcnR9LCBhIHtAbGluayBNb2R1bGUjcmVzZXR9LCBhIHtAbGluayBNb2R1bGUjcmVzdGFydH0gYW5kIGEge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2RzLlxuICpcbiAqIFRoZSBiYXNlIGNsYXNzIG9wdGlvbmFsbHkgY3JlYXRlcyBhIHZpZXcgKGEgZnVsbHNjcmVlbiBgZGl2YCBhY2Nlc3NpYmxlIHRocm91Z2ggdGhlIHtAbGluayBNb2R1bGUudmlld30gYXR0cmlidXRlKS5cbiAqIFRoZSB2aWV3IGlzIGFkZGVkIHRvIHRoZSBET00gKGFzIGEgY2hpbGQgb2YgdGhlIGAjY29udGFpbmVyYCBlbGVtZW50KSB3aGVuIHRoZSBtb2R1bGUgaXMgc3RhcnRlZCAod2l0aCB0aGUge0BsaW5rIE1vZHVsZSNzdGFydH0gbWV0aG9kKSwgYW5kIHJlbW92ZWQgd2hlbiB0aGUgbW9kdWxlIGNhbGxzIGl0cyB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvTW9kdWxlLmpzfk1vZHVsZX0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiAqKk5vdGU6KiogYSBtb3JlIGNvbXBsZXRlIGV4YW1wbGUgb2YgaG93IHRvIHdyaXRlIGEgbW9kdWxlIGlzIGluIHRoZSBbRXhhbXBsZV0obWFudWFsL2V4YW1wbGUuaHRtbCkgc2VjdGlvbi5cbiAqXG4gKiBAZXhhbXBsZSBjbGFzcyBNeU1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gKiAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICogICAgIC8vIFRoaXMgZXhhbXBsZSBtb2R1bGU6XG4gKiAgICAgLy8gLSBhbHdheXMgaGFzIGEgdmlld1xuICogICAgIC8vIC0gaGFzIHRoZSBpZCBhbmQgY2xhc3MgJ215LW1vZHVsZS1uYW1lJ1xuICogICAgIC8vIC0gYW5kIHVzZXMgdGhlIGJhY2tncm91bmQgY29sb3IgZGVmaW5lZCBpbiB0aGUgYXJndW1lbnQgJ29wdGlvbnMnIChpZiBhbnkpLlxuICogICAgIHN1cGVyKCdteS1tb2R1bGUtbmFtZScsIHRydWUsIG9wdGlvbnMuY29sb3IgfHwgJ2FsaXphcmluJyk7XG4gKlxuICogICAgIC4uLiAvLyBhbnl0aGluZyB0aGUgY29uc3RydWN0b3IgbmVlZHNcbiAqICAgfVxuICpcbiAqICAgc3RhcnQoKSB7XG4gKiAgICAgc3VwZXIuc3RhcnQoKTtcbiAqXG4gKiAgICAgLy8gV2hhdGV2ZXIgdGhlIG1vZHVsZSBkb2VzIChjb21tdW5pY2F0aW9uIHdpdGggdGhlIHNlcnZlciwgZXRjLilcbiAqICAgICAvLyAuLi5cbiAqXG4gKiAgICAgLy8gQ2FsbCB0aGUgYGRvbmVgIG1ldGhvZCB3aGVuIHRoZSBtb2R1bGUgaGFzIGZpbmlzaGVkIGl0cyBpbml0aWFsaXphdGlvblxuICogICAgIHRoaXMuZG9uZSgpO1xuICogICB9XG4gKiB9XG4gKiBAdG9kbyBNb3ZlIGV4YW1wbGUgaW4gdGhlIG1hbnVhbD9cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50TW9kdWxlIGV4dGVuZHMgUHJvbWlzZWQge1xuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgbW9kdWxlICh1c2VkIGFzIHRoZSBgaWRgIGFuZCBDU1MgY2xhc3Mgb2YgdGhlIGB2aWV3YCBET00gZWxlbWVudCBpZiBpdCBleGlzdHMpLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjcmVhdGVWaWV3PXRydWVdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgZGlzcGxheXMgYSBgdmlld2Agb3Igbm90LlxuICAgKiBAcGFyYW0ge1t0eXBlXX0gW2NvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YCB3aGVuIGl0IGV4aXN0cy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG5hbWUsIGNyZWF0ZVZpZXcgPSB0cnVlLCBjb2xvciA9ICdibGFjaycpIHsgLy8gVE9ETzogY2hhbmdlIHRvIGNvbG9yQ2xhc3M/XG4gICAgc3VwZXIoKTtcblxuICAgIC8qKlxuICAgICAqIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG5cbiAgICAvKipcbiAgICAgKiBWaWV3IG9mIHRoZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBUaGUgdmlldyBpcyBhIERPTSBlbGVtZW50IChhIGZ1bGwgc2NyZWVuIGBkaXZgKSBpbiB3aGljaCB0aGUgY29udGVudCBvZiB0aGUgbW9kdWxlIGlzIGRpc3BsYXllZC5cbiAgICAgKiBUaGlzIGVsZW1lbnQgaXMgYSBjaGlsZCBvZiB0aGUgbWFpbiBjb250YWluZXIgYGRpdiNjb250YWluZXJgLCB3aGljaCBpcyB0aGUgb25seSBjaGlsZCBvZiB0aGUgYGJvZHlgIGVsZW1lbnQuXG4gICAgICogQSBtb2R1bGUgbWF5IG9yIG1heSBub3QgaGF2ZSBhIHZpZXcsIGFzIGluZGljYXRlZCBieSB0aGUgYXJndW1lbnQgYGhhc1ZpZXc6Qm9vbGVhbmAgb2YgdGhlIHtAbGluayBNb2R1bGUjY29uc3RydWN0b3J9LlxuICAgICAqIFdoZW4gdGhhdCBpcyB0aGUgY2FzZSwgdGhlIHZpZXcgaXMgY3JlYXRlZCBhbmQgYWRkZWQgdG8gdGhlIERPTSB3aGVuIHRoZSB7QGxpbmsgTW9kdWxlI3N0YXJ0fSBtZXRob2QgaXMgY2FsbGVkLCBhbmQgaXMgcmVtb3ZlZCBmcm9tIHRoZSBET00gd2hlbiB0aGUge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2QgaXMgY2FsbGVkLlxuICAgICAqIEB0eXBlIHtET01FbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMudmlldyA9IG51bGw7XG5cbiAgICB0aGlzLl9vd25zVmlldyA9IGZhbHNlO1xuICAgIHRoaXMuX3Nob3dzVmlldyA9IGZhbHNlO1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2lzRG9uZSA9IGZhbHNlO1xuXG4gICAgaWYgKGNyZWF0ZVZpZXcpIHtcbiAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2lkJywgbmFtZSk7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdtb2R1bGUnKTtcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKGNvbG9yKTtcblxuICAgICAgdGhpcy52aWV3ID0gZGl2O1xuICAgICAgdGhpcy5fb3duc1ZpZXcgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIGJpbmQgY29tIG1ldGhvZHMgdG8gdGhlIGluc3RhbmNlLlxuICAgIHRoaXMuc2VuZCA9IHRoaXMuc2VuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVjZWl2ZSA9IHRoaXMucmVjZWl2ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIgPSB0aGlzLnJlbW92ZUxpc3RlbmVyLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIHRoZSBsb2dpYyBhbmQgc3RlcHMgdGhhdCBsZWFkIHRvIHRoZSBpbml0aWFsaXphdGlvbiBvZiB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBGb3IgaW5zdGFuY2UsIGl0IHRha2VzIGNhcmUgb2YgdGhlIGNvbW11bmljYXRpb24gd2l0aCB0aGUgbW9kdWxlIG9uIHRoZSBzZXJ2ZXIgc2lkZSBieSBzZW5kaW5nIFdlYlNvY2tldCBtZXNzYWdlcyBhbmQgc2V0dGluZyB1cCBXZWJTb2NrZXQgbWVzc2FnZSBsaXN0ZW5lcnMuXG4gICAqXG4gICAqIEFkZGl0aW9uYWxseSwgaWYgdGhlIG1vZHVsZSBoYXMgYSBgdmlld2AsIHRoZSBgc3RhcnRgIG1ldGhvZCBjcmVhdGVzIHRoZSBjb3JyZXNwb25kaW5nIEhUTUwgZWxlbWVudCBhbmQgYXBwZW5kcyBpdCB0byB0aGUgRE9N4oCZcyBtYWluIGNvbnRhaW5lciBlbGVtZW50IChgZGl2I2NvbnRhaW5lcmApLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSwgeW91IHNob3VsZCBub3QgY2FsbCBpdCBtYW51YWxseS5cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBpZighdGhpcy5faXNTdGFydGVkKSB7XG4gICAgICBpZiAodGhpcy52aWV3KSB7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnZpZXcpO1xuICAgICAgICB0aGlzLl9zaG93c1ZpZXcgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9pc1N0YXJ0ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgbW9kdWxlIHRvIHRoZSBzdGF0ZSBpdCBoYWQgYmVmb3JlIGNhbGxpbmcgdGhlIHtAbGluayBNb2R1bGUjc3RhcnR9IG1ldGhvZC5cbiAgICpcbiAgICogVGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIGEgbG9zdCBjb25uZWN0aW9uIHdpdGggdGhlIHNlcnZlciBpcyByZXN1bWVkIChmb3IgaW5zdGFuY2UgYmVjYXVzZSBvZiBhIHNlcnZlciBjcmFzaCksIGlmIHRoZSBtb2R1bGUgaGFkIG5vdCBmaW5pc2hlZCBpdHMgaW5pdGlhbGl6YXRpb24gKCppLmUuKiBpZiBpdCBoYWQgbm90IGNhbGxlZCBpdHMge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2QpLlxuICAgKiBJbiB0aGF0IGNhc2UsIHRoZSBtb2R1bGUgY2xlYW5zIHdoYXRldmVyIGl0IHdhcyBkb2luZyBhbmQgc3RhcnRzIGFnYWluIGZyb20gc2NyYXRjaC5cbiAgICpcbiAgICogKipOb3RlOioqIHRoZSBtZXRob2QgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgd2hlbiBuZWNlc3NhcnksIHlvdSBzaG91bGQgbm90IGNhbGwgaXQgbWFudWFsbHkuXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydCB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBUaGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gYSBsb3N0IGNvbm5lY3Rpb24gd2l0aCB0aGUgc2VydmVyIGlzIHJlc3VtZWQgKGZvciBpbnN0YW5jZSBiZWNhdXNlIG9mIGEgc2VydmVyIGNyYXNoKSwgaWYgdGhlIG1vZHVsZSBoYWQgYWxyZWFkeSBmaW5pc2hlZCBpdHMgaW5pdGlhbGl6YXRpb24gKCppLmUuKiBpZiBpdCBoYWQgY2FsbGVkIGl0cyB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZCkuXG4gICAqIFRoZSBtZXRob2Qgc2hvdWxkIHNlbmQgdG8gdGhlIHNlcnZlciB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiAoSW5kZWVkLCBpZiB0aGUgc2VydmVyIGNyYXNoZXMsIGl0IHdpbGwgcmVzZXQgYWxsIHRoZSBpbmZvcm1hdGlvbiBpdCBoYXMgYWJvdXQgYWxsIHRoZSBjbGllbnRzLlxuICAgKiBPbiB0aGUgY2xpZW50IHNpZGUsIHRoZSBtb2R1bGVzIHRoYXQgaGFkIGZpbmlzaGVkIHRoZWlyIGluaXRpYWxpemF0aW9uIHByb2Nlc3Mgc2hvdWxkIHNlbmQgdGhlaXIgc3RhdGUgdG8gdGhlIHNlcnZlciBzbyB0aGF0IGl0IGNhbiBiZSB1cCB0byBkYXRlIHdpdGggdGhlIHJlYWwgc3RhdGUgb2YgdGhlIHNjZW5hcmlvLilcbiAgICpcbiAgICogRm9yIGluc3RhbmNlLCB0aGlzIG1ldGhvZCBpbiB0aGUge0BsaW5rIExvY2F0b3J9IG1vZHVsZSBzZW5kcyB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIGNsaWVudCB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSwgeW91IHNob3VsZCBub3QgY2FsbCBpdCBtYW51YWxseS5cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHRoaXMuX2lzRG9uZSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBsYXVuY2goKSB7XG4gICAgaWYgKHRoaXMuX2lzRG9uZSkge1xuICAgICAgdGhpcy5yZXN0YXJ0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLl9pc1N0YXJ0ZWQpXG4gICAgICAgIHRoaXMucmVzZXQoKTtcblxuICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgYmUgY2FsbGVkIHdoZW4gdGhlIG1vZHVsZSBoYXMgZmluaXNoZWQgaXRzIGluaXRpYWxpemF0aW9uICgqaS5lLiogd2hlbiB0aGUgbW9kdWxlIGhhcyBkb25lIGl0cyBkdXR5LCBvciB3aGVuIGl0IG1heSBydW4gaW4gdGhlIGJhY2tncm91bmQgZm9yIHRoZSByZXN0IG9mIHRoZSBzY2VuYXJpbyBhZnRlciBpdCBmaW5pc2hlZCBpdHMgaW5pdGlhbGl6YXRpb24gcHJvY2VzcyksIHRvIGFsbG93IHN1YnNlcXVlbnQgc3RlcHMgb2YgdGhlIHNjZW5hcmlvIHRvIHN0YXJ0LlxuICAgKlxuICAgKiBGb3IgaW5zdGFuY2UsIHRoZSB7QGxpbmsgTG9hZGVyfSBtb2R1bGUgY2FsbHMgaXRzIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kIHdoZW4gZmlsZXMgYXJlIGxvYWRlZCwgYW5kIHRoZSB7QGxpbmsgU3luY30gbW9kdWxlIGNhbGxzIGl0IHdoZW4gdGhlIGZpcnN0IHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIGlzIGZpbmlzaGVkICh3aGlsZSB0aGUgbW9kdWxlIGtlZXBzIHJ1bm5pbmcgaW4gdGhlIGJhY2tncm91bmQgYWZ0ZXJ3YXJkcykuXG4gICAqIEFzIGFuIGV4Y2VwdGlvbiwgdGhlIGxhc3QgbW9kdWxlIG9mIHRoZSBzY2VuYXJpbyAodXN1YWxseSB0aGUge0BsaW5rIFBlcmZvcm1hbmNlfSBtb2R1bGUpIG1heSBub3QgY2FsbCBpdHMge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2QuXG4gICAqXG4gICAqIElmIHRoZSBtb2R1bGUgaGFzIGEgYHZpZXdgLCB0aGUgYGRvbmVgIG1ldGhvZCByZW1vdmVzIGl0IGZyb20gdGhlIERPTS5cbiAgICpcbiAgICogKipOb3RlOioqIHlvdSBzaG91bGQgbm90IG92ZXJyaWRlIHRoaXMgbWV0aG9kLlxuICAgKi9cbiAgZG9uZSgpIHtcbiAgICB0aGlzLl9pc0RvbmUgPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMudmlldyAmJiB0aGlzLl9zaG93c1ZpZXcgJiYgdGhpcy5fb3duc1ZpZXcpIHtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLnZpZXcpO1xuICAgICAgdGhpcy5fc2hvd3NWaWV3ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVzb2x2ZVByb21pc2VkKVxuICAgICAgdGhpcy5yZXNvbHZlUHJvbWlzZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgYW4gYXJiaXRyYXJ5IGNlbnRlcmVkIEhUTUwgY29udGVudCB0byB0aGUgbW9kdWxlJ3MgYHZpZXdgIChpZiBhbnkpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaHRtbENvbnRlbnQgVGhlIEhUTUwgY29udGVudCB0byBhcHBlbmQgdG8gdGhlIGB2aWV3YC5cbiAgICovXG4gIHNldENlbnRlcmVkVmlld0NvbnRlbnQoaHRtbENvbnRlbnQpIHtcbiAgICBpZiAodGhpcy52aWV3KSB7XG4gICAgICBpZiAoIXRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQpIHtcbiAgICAgICAgbGV0IGNvbnRlbnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICBjb250ZW50RGl2LmNsYXNzTGlzdC5hZGQoJ2NlbnRlcmVkLWNvbnRlbnQnKTtcbiAgICAgICAgdGhpcy52aWV3LmFwcGVuZENoaWxkKGNvbnRlbnREaXYpO1xuXG4gICAgICAgIHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQgPSBjb250ZW50RGl2O1xuICAgICAgfVxuXG4gICAgICBpZiAoaHRtbENvbnRlbnQpIHtcbiAgICAgICAgaWYgKGh0bWxDb250ZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICBpZiAodGhpcy5fY2VudGVyZWRWaWV3Q29udGVudC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICB0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50LnJlbW92ZUNoaWxkKHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudC5hcHBlbmRDaGlsZChodG1sQ29udGVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gaXMgYSBzdHJpbmdcbiAgICAgICAgICB0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50LmlubmVySFRNTCA9IGh0bWxDb250ZW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGNlbnRlcmVkIEhUTUwgY29udGVudCAoc2V0IGJ5IHtAbGluayBNb2R1bGUjc2V0Q2VudGVyZWRWaWV3Q29udGVudH0pIGZyb20gdGhlIGB2aWV3YC5cbiAgICovXG4gIHJlbW92ZUNlbnRlcmVkVmlld0NvbnRlbnQoKSB7XG4gICAgaWYgKHRoaXMudmlldyAmJiB0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50KSB7XG4gICAgICB0aGlzLnZpZXcucmVtb3ZlQ2hpbGQodGhpcy5fY2VudGVyZWRWaWV3Q29udGVudCk7XG4gICAgICBkZWxldGUgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogYHotaW5kZXhgIENTUyBwcm9wZXJ0eSBvZiB0aGUgdmlld1xuICAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgVmFsdWUgb2YgdGhlIGB6LWluZGV4YC5cbiAgICovXG4gIHNldCB6SW5kZXgodmFsdWUpIHtcbiAgICBpZih0aGlzLnZpZXcpXG4gICAgICB0aGlzLnZpZXcuc3R5bGUuekluZGV4ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyIHNpZGUgc29ja2V0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5uYW1lfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbW0uc2VuZChgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gLCAuLi5hcmdzKVxuICB9XG5cbiAgc2VuZFZvbGF0aWxlKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb21tLnNlbmRWb2xhdGlsZShgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gLCAuLi5hcmdzKVxuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY29tbS5yZWNlaXZlKGAke3RoaXMubmFtZX06JHtjaGFubmVsfWAsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIGxpc3RlbmluZyB0byBhIG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5uYW1lfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gY2FuY2VsLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb21tLnJlbW92ZUxpc3RlbmVyKGAke3RoaXMubmFtZX06JHtjaGFubmVsfWAsIGNhbGxiYWNrKTtcbiAgfVxufVxuXG5Nb2R1bGUuc2VxdWVudGlhbCA9IGZ1bmN0aW9uKC4uLm1vZHVsZXMpIHtcbiAgcmV0dXJuIG5ldyBTZXF1ZW50aWFsKG1vZHVsZXMpO1xufTtcblxuTW9kdWxlLnBhcmFsbGVsID0gZnVuY3Rpb24oLi4ubW9kdWxlcykge1xuICByZXR1cm4gbmV3IFBhcmFsbGVsKG1vZHVsZXMpO1xufTtcbiJdfQ==