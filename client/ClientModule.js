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
     * @type {BaseView}
     */
    this.view = null;

    /**
     * Events to bind to the view. (cf. Backbone's syntax)
     * @type {Object}
     */
    this.events = {};

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
    key: 'createDefaultView',

    /**
     * Create a default view from module attributes.
     */
    value: function createDefaultView() {
      return new _displayView2['default'](this.template, this.content, this.events, {
        id: this.name,
        className: 'module'
      });
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

      if (!this._isStarted) {
        if (this.view) {
          this.$container.appendChild(this.view.render());
        }

        this._isStarted = true;
      }
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

      if (this.view) this.view.remove();

      if (this.resolvePromised) this.resolvePromised();
    }

    // /**
    //  * Set an arbitrary centered HTML content to the module's `view` (if any).
    //  * @param {String} htmlContent The HTML content to append to the `view`.
    //  */
    // setCenteredViewContent(htmlContent) {
    //   if (this.view) {
    //     if (!this._centeredViewContent) {
    //       let contentDiv = document.createElement('div');

    //       contentDiv.classList.add('centered-content');
    //       this.view.appendChild(contentDiv);

    //       this._centeredViewContent = contentDiv;
    //     }

    //     if (htmlContent) {
    //       if (htmlContent instanceof HTMLElement) {
    //         if (this._centeredViewContent.firstChild) {
    //           this._centeredViewContent.removeChild(this._centeredViewContent.firstChild);
    //         }

    //         this._centeredViewContent.appendChild(htmlContent);
    //       } else {
    //         // is a string
    //         this._centeredViewContent.innerHTML = htmlContent;
    //       }
    //     }
    //   }
    // }

    // /**
    //  * Removes the centered HTML content (set by {@link Module#setCenteredViewContent}) from the `view`.
    //  */
    // removeCenteredViewContent() {
    //   if (this.view && this._centeredViewContent) {
    //     this.view.removeChild(this._centeredViewContent);
    //     delete this._centeredViewContent;
    //   }
    // }

    /**
     * `z-index` CSS property of the view.
     * @todo - prepend would do the trick ?
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
      if (!template) throw new Error('No template defined for module "' + this.name + '"');

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
      var texts = this._content || this.contentDefinitions[this.name];
      if (!texts) throw new Error('No text contents defined for module "' + this.name + '"');

      texts._globals = this.contentDefinitions._globals;
      return texts;
    },
    set: function set(obj) {
      this._content = obj;
    }
  }, {
    key: 'zIndex',
    set: function set(value) {
      if (this.view) {
        this.view.$el.style.zIndex = value;
      }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50TW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUE2QixRQUFROztvQkFDcEIsUUFBUTs7OzsyQkFDUixnQkFBZ0I7Ozs7Ozs7O0lBSzNCLFFBQVE7WUFBUixRQUFROztBQUNELFdBRFAsUUFBUSxHQUNFOzBCQURWLFFBQVE7O0FBRVYsK0JBRkUsUUFBUSw2Q0FFRjs7Ozs7OztBQU9SLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0dBQzdCOzs7Ozs7ZUFWRyxRQUFROztXQVlDLHlCQUFHOzs7QUFDZCxhQUFPLGFBQVksVUFBQyxPQUFPO2VBQUssTUFBSyxlQUFlLEdBQUcsT0FBTztPQUFBLENBQUMsQ0FBQztLQUNqRTs7O1dBRUssa0JBQUcsRUFFUjs7O1NBbEJHLFFBQVE7OztJQXdCUixVQUFVO1lBQVYsVUFBVTs7QUFDSCxXQURQLFVBQVUsQ0FDRixPQUFPLEVBQUU7MEJBRGpCLFVBQVU7O0FBRVosK0JBRkUsVUFBVSw2Q0FFSjs7QUFFUixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztHQUN4Qjs7Ozs7O2VBTEcsVUFBVTs7V0FPRCx5QkFBRztBQUNkLFVBQUksR0FBRyxHQUFHLElBQUksQ0FBQztBQUNmLFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQzs7Ozs7Ozs7Y0FFWCxJQUFJOztBQUNWLGNBQUcsR0FBRyxLQUFLLElBQUksRUFDYixPQUFPLENBQUMsSUFBSSxDQUFDO21CQUFNLElBQUksQ0FBQyxNQUFNLEVBQUU7V0FBQSxDQUFDLENBQUM7O0FBRXBDLGFBQUcsR0FBRyxJQUFJLENBQUM7QUFDWCxpQkFBTyxHQUFHLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7O0FBTGhDLDBDQUFnQixJQUFJLENBQUMsT0FBTyw0R0FBRTs7U0FNN0I7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1dBRUssa0JBQUc7QUFDUCxhQUFP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QUFTLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0tBQ2xEOzs7Ozs7OztXQU1zQiwwQkFBQyxHQUFHLEVBQUU7QUFDM0Isa0JBQVksQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztLQUN6Qzs7O1NBOURrQixZQUFZO0dBQVMsUUFBUTs7cUJBQTdCLFlBQVk7O0FBMlJqQyxZQUFZLENBQUMsVUFBVSxHQUFHLFlBQXFCO3FDQUFULE9BQU87QUFBUCxXQUFPOzs7QUFDM0MsU0FBTyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUNoQyxDQUFDOztBQUVGLFlBQVksQ0FBQyxRQUFRLEdBQUcsWUFBcUI7cUNBQVQsT0FBTztBQUFQLFdBQU87OztBQUN6QyxTQUFPLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQzlCLENBQUMiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRNb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IGNvbW0gZnJvbSAnLi9jb21tJztcbmltcG9ydCBWaWV3IGZyb20gJy4vZGlzcGxheS9WaWV3JztcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBQcm9taXNlZCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgLyoqXG4gICAgICogW3Jlc29sdmVQcm9taXNlZCBkZXNjcmlwdGlvbl1cbiAgICAgKiBAdG9kbyBkZXNjcmlwdGlvblxuICAgICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucmVzb2x2ZVByb21pc2VkID0gbnVsbDtcbiAgfVxuXG4gIGNyZWF0ZVByb21pc2UoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB0aGlzLnJlc29sdmVQcm9taXNlZCA9IHJlc29sdmUpO1xuICB9XG5cbiAgbGF1bmNoKCkge1xuXG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBTZXF1ZW50aWFsIGV4dGVuZHMgUHJvbWlzZWQge1xuICBjb25zdHJ1Y3Rvcihtb2R1bGVzKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG4gIH1cblxuICBjcmVhdGVQcm9taXNlKCkge1xuICAgIGxldCBtb2QgPSBudWxsO1xuICAgIGxldCBwcm9taXNlID0gbnVsbDtcblxuICAgIGZvcihsZXQgbmV4dCBvZiB0aGlzLm1vZHVsZXMpIHtcbiAgICAgIGlmKG1vZCAhPT0gbnVsbClcbiAgICAgICAgcHJvbWlzZS50aGVuKCgpID0+IG5leHQubGF1bmNoKCkpO1xuXG4gICAgICBtb2QgPSBuZXh0O1xuICAgICAgcHJvbWlzZSA9IG1vZC5jcmVhdGVQcm9taXNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBsYXVuY2goKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kdWxlc1swXS5sYXVuY2goKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIFBhcmFsbGVsIGV4dGVuZHMgUHJvbWlzZWQge1xuICBjb25zdHJ1Y3Rvcihtb2R1bGVzKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG5cbiAgICAvLyBzZXQgei1pbmRleCBvZiBwYXJhbGxlbCBtb2R1bGVzXG4gICAgbGV0IHpJbmRleCA9IG1vZHVsZXMubGVuZ3RoO1xuICAgIGZvcihsZXQgbW9kIG9mIG1vZHVsZXMpIHtcbiAgICAgIG1vZC56SW5kZXggPSB6SW5kZXg7XG4gICAgICB6SW5kZXgtLTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVQcm9taXNlKCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbCh0aGlzLm1vZHVsZXMubWFwKChtb2QpID0+IG1vZC5jcmVhdGVQcm9taXNlKCkpKTtcbiAgfVxuXG4gIGxhdW5jaCgpIHtcbiAgICBmb3IobGV0IG1vZCBvZiB0aGlzLm1vZHVsZXMpXG4gICAgICBtb2QubGF1bmNoKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBbY2xpZW50XSBCYXNlIGNsYXNzIHVzZWQgdG8gY3JlYXRlIGFueSAqU291bmR3b3JrcyogbW9kdWxlIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAqXG4gKiBFYWNoIG1vZHVsZSBzaG91bGQgaGF2ZSBhIHtAbGluayBNb2R1bGUjc3RhcnR9LCBhIHtAbGluayBNb2R1bGUjcmVzZXR9LCBhIHtAbGluayBNb2R1bGUjcmVzdGFydH0gYW5kIGEge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2RzLlxuICpcbiAqIFRoZSBiYXNlIGNsYXNzIG9wdGlvbmFsbHkgY3JlYXRlcyBhIHZpZXcgKGEgZnVsbHNjcmVlbiBgZGl2YCBhY2Nlc3NpYmxlIHRocm91Z2ggdGhlIHtAbGluayBNb2R1bGUudmlld30gYXR0cmlidXRlKS5cbiAqIFRoZSB2aWV3IGlzIGFkZGVkIHRvIHRoZSBET00gKGFzIGEgY2hpbGQgb2YgdGhlIGAjY29udGFpbmVyYCBlbGVtZW50KSB3aGVuIHRoZSBtb2R1bGUgaXMgc3RhcnRlZCAod2l0aCB0aGUge0BsaW5rIE1vZHVsZSNzdGFydH0gbWV0aG9kKSwgYW5kIHJlbW92ZWQgd2hlbiB0aGUgbW9kdWxlIGNhbGxzIGl0cyB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvTW9kdWxlLmpzfk1vZHVsZX0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiAqKk5vdGU6KiogYSBtb3JlIGNvbXBsZXRlIGV4YW1wbGUgb2YgaG93IHRvIHdyaXRlIGEgbW9kdWxlIGlzIGluIHRoZSBbRXhhbXBsZV0obWFudWFsL2V4YW1wbGUuaHRtbCkgc2VjdGlvbi5cbiAqXG4gKiBAZXhhbXBsZSBjbGFzcyBNeU1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gKiAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICogICAgIC8vIFRoaXMgZXhhbXBsZSBtb2R1bGU6XG4gKiAgICAgLy8gLSBhbHdheXMgaGFzIGEgdmlld1xuICogICAgIC8vIC0gaGFzIHRoZSBpZCBhbmQgY2xhc3MgJ215LW1vZHVsZS1uYW1lJ1xuICogICAgIC8vIC0gYW5kIHVzZXMgdGhlIGJhY2tncm91bmQgY29sb3IgZGVmaW5lZCBpbiB0aGUgYXJndW1lbnQgJ29wdGlvbnMnIChpZiBhbnkpLlxuICogICAgIHN1cGVyKCdteS1tb2R1bGUtbmFtZScsIHRydWUsIG9wdGlvbnMuY29sb3IgfHwgJ2FsaXphcmluJyk7XG4gKlxuICogICAgIC4uLiAvLyBhbnl0aGluZyB0aGUgY29uc3RydWN0b3IgbmVlZHNcbiAqICAgfVxuICpcbiAqICAgc3RhcnQoKSB7XG4gKiAgICAgc3VwZXIuc3RhcnQoKTtcbiAqXG4gKiAgICAgLy8gV2hhdGV2ZXIgdGhlIG1vZHVsZSBkb2VzIChjb21tdW5pY2F0aW9uIHdpdGggdGhlIHNlcnZlciwgZXRjLilcbiAqICAgICAvLyAuLi5cbiAqXG4gKiAgICAgLy8gQ2FsbCB0aGUgYGRvbmVgIG1ldGhvZCB3aGVuIHRoZSBtb2R1bGUgaGFzIGZpbmlzaGVkIGl0cyBpbml0aWFsaXphdGlvblxuICogICAgIHRoaXMuZG9uZSgpO1xuICogICB9XG4gKiB9XG4gKiBAdG9kbyBNb3ZlIGV4YW1wbGUgaW4gdGhlIG1hbnVhbD9cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50TW9kdWxlIGV4dGVuZHMgUHJvbWlzZWQge1xuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgbW9kdWxlICh1c2VkIGFzIHRoZSBgaWRgIGFuZCBDU1MgY2xhc3Mgb2YgdGhlIGB2aWV3YCBET00gZWxlbWVudCBpZiBpdCBleGlzdHMpLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjcmVhdGVWaWV3PXRydWVdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgZGlzcGxheXMgYSBgdmlld2Agb3Igbm90LlxuICAgKiBAcGFyYW0ge1t0eXBlXX0gW2NvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YCB3aGVuIGl0IGV4aXN0cy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG5hbWUsIG9wdGlvbnMgPSB7fSkgeyAvLyBUT0RPOiBjaGFuZ2UgdG8gY29sb3JDbGFzcz9cbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fYnlwYXNzID0gb3B0aW9ucy5ieXBhc3MgfHzCoGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcblxuICAgIC8qKlxuICAgICAqIFZpZXcgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7QmFzZVZpZXd9XG4gICAgICovXG4gICAgdGhpcy52aWV3ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50cyB0byBiaW5kIHRvIHRoZSB2aWV3LiAoY2YuIEJhY2tib25lJ3Mgc3ludGF4KVxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcblxuICAgIC8qKiBAcHJpdmF0ZSAqL1xuICAgIHRoaXMuX3RlbXBsYXRlID0gbnVsbDtcblxuICAgIC8vIGJpbmQgY29tIG1ldGhvZHMgdG8gdGhlIGluc3RhbmNlLlxuICAgIHRoaXMuc2VuZCA9IHRoaXMuc2VuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVjZWl2ZSA9IHRoaXMucmVjZWl2ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIgPSB0aGlzLnJlbW92ZUxpc3RlbmVyLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU2hhcmUgdGhlIGRlZmluZWQgdGVtcGxhdGVzIHdpdGggYWxsIGBDbGllbnRNb2R1bGVgIGluc3RhbmNlcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRlZnMgLSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgdGVtcGxhdGVzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhdGljIHNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZnMpIHtcbiAgICBDbGllbnRNb2R1bGUucHJvdG90eXBlLnRlbXBsYXRlRGVmaW5pdGlvbnMgPSBkZWZzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNoYXJlIHRoZSB0ZXh0IGNvbnRlbnQgY29uZmlndXJhdGlvbiAobmFtZSBhbmQgZGF0YSkgd2l0aCBhbGwgdGhlIGBDbGllbnRNb2R1bGVgIGluc3RhbmNlc1xuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmcyAtIFRoZSB0ZXh0IGNvbnRlbnRzIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXRpYyBzZXRWaWV3Q29udGVudERlZmluaXRpb25zKGRlZnMpIHtcbiAgICBDbGllbnRNb2R1bGUucHJvdG90eXBlLmNvbnRlbnREZWZpbml0aW9ucyA9IGRlZnM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgY29udGFpbmVyIG9mIHRoZSB2aWV3cyBmb3IgYWxsIGBDbGllbnRNb2R1bGVgIGluc3RhbmNlcy5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgZWxlbWVudCB0byB1c2UgYXMgYSBjb250YWluZXIgZm9yIHRoZSBtb2R1bGUncyB2aWV3LlxuICAgKi9cbiAgc3RhdGljIHNldFZpZXdDb250YWluZXIoJGVsKSB7XG4gICAgQ2xpZW50TW9kdWxlLnByb3RvdHlwZS4kY29udGFpbmVyID0gJGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRlbXBsYXRlIGFzc29jaWF0ZWQgdG8gdGhlIGN1cnJlbnQgbW9kdWxlLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IC0gVGhlIHRlbXBsYXRlIHJlbGF0ZWQgdG8gdGhlIGBuYW1lYCBvZiB0aGUgY3VycmVudCBtb2R1bGUuXG4gICAqL1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLl90ZW1wbGF0ZSB8fMKgdGhpcy50ZW1wbGF0ZURlZmluaXRpb25zW3RoaXMubmFtZV07XG4gICAgaWYgKCF0ZW1wbGF0ZSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gdGVtcGxhdGUgZGVmaW5lZCBmb3IgbW9kdWxlIFwiJHt0aGlzLm5hbWV9XCJgKTtcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfVxuXG4gIHNldCB0ZW1wbGF0ZSh0bXBsKSB7XG4gICAgdGhpcy5fdGVtcGxhdGUgPSB0bXBsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRleHQgYXNzb2NpYXRlZCB0byB0aGUgY3VycmVudCBtb2R1bGUuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IC0gVGhlIHRleHQgY29udGVudHMgcmVsYXRlZCB0byB0aGUgYG5hbWVgIG9mIHRoZSBjdXJyZW50IG1vZHVsZS4gVGhlIHJldHVybmVkIG9iamVjdCBpcyBleHRlbmRlZCB3aXRoIGEgcG9pbnRlciB0byB0aGUgYF9nbG9iYWxzYCBlbnRyeSBvZiB0aGUgZGVmaW5lZCB0ZXh0IGNvbnRlbnRzLlxuICAgKi9cbiAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgY29uc3QgdGV4dHMgPSB0aGlzLl9jb250ZW50IHx8wqB0aGlzLmNvbnRlbnREZWZpbml0aW9uc1t0aGlzLm5hbWVdO1xuICAgIGlmICghdGV4dHMpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHRleHQgY29udGVudHMgZGVmaW5lZCBmb3IgbW9kdWxlIFwiJHt0aGlzLm5hbWV9XCJgKTtcblxuICAgIHRleHRzLl9nbG9iYWxzID0gdGhpcy5jb250ZW50RGVmaW5pdGlvbnMuX2dsb2JhbHM7XG4gICAgcmV0dXJuIHRleHRzO1xuICB9XG5cbiAgc2V0IGNvbnRlbnQob2JqKSB7XG4gICAgdGhpcy5fY29udGVudCA9IG9iajtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBkZWZhdWx0IHZpZXcgZnJvbSBtb2R1bGUgYXR0cmlidXRlcy5cbiAgICovXG4gIGNyZWF0ZURlZmF1bHRWaWV3KCkge1xuICAgIHJldHVybiBuZXcgVmlldyh0aGlzLnRlbXBsYXRlLCB0aGlzLmNvbnRlbnQsIHRoaXMuZXZlbnRzLCB7XG4gICAgICBpZDogdGhpcy5uYW1lLFxuICAgICAgY2xhc3NOYW1lOiAnbW9kdWxlJyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbGF1bmNoKCkge1xuICAgIGlmICh0aGlzLl9pc0RvbmUpIHtcbiAgICAgIHRoaXMucmVzdGFydCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5faXNTdGFydGVkKVxuICAgICAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIHRoZSBsb2dpYyBhbmQgc3RlcHMgdGhhdCBsZWFkIHRvIHRoZSBpbml0aWFsaXphdGlvbiBvZiB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBGb3IgaW5zdGFuY2UsIGl0IHRha2VzIGNhcmUgb2YgdGhlIGNvbW11bmljYXRpb24gd2l0aCB0aGUgbW9kdWxlIG9uIHRoZSBzZXJ2ZXIgc2lkZSBieSBzZW5kaW5nIFdlYlNvY2tldCBtZXNzYWdlcyBhbmQgc2V0dGluZyB1cCBXZWJTb2NrZXQgbWVzc2FnZSBsaXN0ZW5lcnMuXG4gICAqXG4gICAqIEFkZGl0aW9uYWxseSwgaWYgdGhlIG1vZHVsZSBoYXMgYSBgdmlld2AsIHRoZSBgc3RhcnRgIG1ldGhvZCBjcmVhdGVzIHRoZSBjb3JyZXNwb25kaW5nIEhUTUwgZWxlbWVudCBhbmQgYXBwZW5kcyBpdCB0byB0aGUgRE9N4oCZcyBtYWluIGNvbnRhaW5lciBlbGVtZW50IChgZGl2I2NvbnRhaW5lcmApLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSwgeW91IHNob3VsZCBub3QgY2FsbCBpdCBtYW51YWxseS5cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBzdGFydCgpIHtcbiAgICAvLyBhbGxvdyB0byBieXBhc3MgYSBtb2R1bGUgZnJvbSBpdHMgb3B0aW9uc1xuICAgIGlmICh0aGlzLl9ieXBhc3MpIHsgdGhpcy5kb25lKCk7IH1cblxuICAgIGlmICghdGhpcy5faXNTdGFydGVkKSB7XG4gICAgICBpZiAodGhpcy52aWV3KSB7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnZpZXcucmVuZGVyKCkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9pc1N0YXJ0ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIFRoZSBtZXRob2QgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgd2hlbiBhIGxvc3QgY29ubmVjdGlvbiB3aXRoIHRoZSBzZXJ2ZXIgaXMgcmVzdW1lZCAoZm9yIGluc3RhbmNlIGJlY2F1c2Ugb2YgYSBzZXJ2ZXIgY3Jhc2gpLCBpZiB0aGUgbW9kdWxlIGhhZCBhbHJlYWR5IGZpbmlzaGVkIGl0cyBpbml0aWFsaXphdGlvbiAoKmkuZS4qIGlmIGl0IGhhZCBjYWxsZWQgaXRzIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kKS5cbiAgICogVGhlIG1ldGhvZCBzaG91bGQgc2VuZCB0byB0aGUgc2VydmVyIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIChJbmRlZWQsIGlmIHRoZSBzZXJ2ZXIgY3Jhc2hlcywgaXQgd2lsbCByZXNldCBhbGwgdGhlIGluZm9ybWF0aW9uIGl0IGhhcyBhYm91dCBhbGwgdGhlIGNsaWVudHMuXG4gICAqIE9uIHRoZSBjbGllbnQgc2lkZSwgdGhlIG1vZHVsZXMgdGhhdCBoYWQgZmluaXNoZWQgdGhlaXIgaW5pdGlhbGl6YXRpb24gcHJvY2VzcyBzaG91bGQgc2VuZCB0aGVpciBzdGF0ZSB0byB0aGUgc2VydmVyIHNvIHRoYXQgaXQgY2FuIGJlIHVwIHRvIGRhdGUgd2l0aCB0aGUgcmVhbCBzdGF0ZSBvZiB0aGUgc2NlbmFyaW8uKVxuICAgKlxuICAgKiBGb3IgaW5zdGFuY2UsIHRoaXMgbWV0aG9kIGluIHRoZSB7QGxpbmsgTG9jYXRvcn0gbW9kdWxlIHNlbmRzIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgY2xpZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gbmVjZXNzYXJ5LCB5b3Ugc2hvdWxkIG5vdCBjYWxsIGl0IG1hbnVhbGx5LlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgdGhpcy5faXNEb25lID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIG1vZHVsZSB0byB0aGUgc3RhdGUgaXQgaGFkIGJlZm9yZSBjYWxsaW5nIHRoZSB7QGxpbmsgTW9kdWxlI3N0YXJ0fSBtZXRob2QuXG4gICAqXG4gICAqIFRoZSBtZXRob2QgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgd2hlbiBhIGxvc3QgY29ubmVjdGlvbiB3aXRoIHRoZSBzZXJ2ZXIgaXMgcmVzdW1lZCAoZm9yIGluc3RhbmNlIGJlY2F1c2Ugb2YgYSBzZXJ2ZXIgY3Jhc2gpLCBpZiB0aGUgbW9kdWxlIGhhZCBub3QgZmluaXNoZWQgaXRzIGluaXRpYWxpemF0aW9uICgqaS5lLiogaWYgaXQgaGFkIG5vdCBjYWxsZWQgaXRzIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kKS5cbiAgICogSW4gdGhhdCBjYXNlLCB0aGUgbW9kdWxlIGNsZWFucyB3aGF0ZXZlciBpdCB3YXMgZG9pbmcgYW5kIHN0YXJ0cyBhZ2FpbiBmcm9tIHNjcmF0Y2guXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gbmVjZXNzYXJ5LCB5b3Ugc2hvdWxkIG5vdCBjYWxsIGl0IG1hbnVhbGx5LlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBiZSBjYWxsZWQgd2hlbiB0aGUgbW9kdWxlIGhhcyBmaW5pc2hlZCBpdHMgaW5pdGlhbGl6YXRpb24gKCppLmUuKiB3aGVuIHRoZSBtb2R1bGUgaGFzIGRvbmUgaXRzIGR1dHksIG9yIHdoZW4gaXQgbWF5IHJ1biBpbiB0aGUgYmFja2dyb3VuZCBmb3IgdGhlIHJlc3Qgb2YgdGhlIHNjZW5hcmlvIGFmdGVyIGl0IGZpbmlzaGVkIGl0cyBpbml0aWFsaXphdGlvbiBwcm9jZXNzKSwgdG8gYWxsb3cgc3Vic2VxdWVudCBzdGVwcyBvZiB0aGUgc2NlbmFyaW8gdG8gc3RhcnQuXG4gICAqXG4gICAqIEZvciBpbnN0YW5jZSwgdGhlIHtAbGluayBMb2FkZXJ9IG1vZHVsZSBjYWxscyBpdHMge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2Qgd2hlbiBmaWxlcyBhcmUgbG9hZGVkLCBhbmQgdGhlIHtAbGluayBTeW5jfSBtb2R1bGUgY2FsbHMgaXQgd2hlbiB0aGUgZmlyc3Qgc3luY2hyb25pemF0aW9uIHByb2Nlc3MgaXMgZmluaXNoZWQgKHdoaWxlIHRoZSBtb2R1bGUga2VlcHMgcnVubmluZyBpbiB0aGUgYmFja2dyb3VuZCBhZnRlcndhcmRzKS5cbiAgICogQXMgYW4gZXhjZXB0aW9uLCB0aGUgbGFzdCBtb2R1bGUgb2YgdGhlIHNjZW5hcmlvICh1c3VhbGx5IHRoZSB7QGxpbmsgUGVyZm9ybWFuY2V9IG1vZHVsZSkgbWF5IG5vdCBjYWxsIGl0cyB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZC5cbiAgICpcbiAgICogSWYgdGhlIG1vZHVsZSBoYXMgYSBgdmlld2AsIHRoZSBgZG9uZWAgbWV0aG9kIHJlbW92ZXMgaXQgZnJvbSB0aGUgRE9NLlxuICAgKlxuICAgKiAqKk5vdGU6KiogeW91IHNob3VsZCBub3Qgb3ZlcnJpZGUgdGhpcyBtZXRob2QuXG4gICAqL1xuICBkb25lKCkge1xuICAgIHRoaXMuX2lzRG9uZSA9IHRydWU7XG5cbiAgICBpZiAodGhpcy52aWV3KVxuICAgICAgdGhpcy52aWV3LnJlbW92ZSgpO1xuXG4gICAgaWYgKHRoaXMucmVzb2x2ZVByb21pc2VkKVxuICAgICAgdGhpcy5yZXNvbHZlUHJvbWlzZWQoKTtcbiAgfVxuXG4gIC8vIC8qKlxuICAvLyAgKiBTZXQgYW4gYXJiaXRyYXJ5IGNlbnRlcmVkIEhUTUwgY29udGVudCB0byB0aGUgbW9kdWxlJ3MgYHZpZXdgIChpZiBhbnkpLlxuICAvLyAgKiBAcGFyYW0ge1N0cmluZ30gaHRtbENvbnRlbnQgVGhlIEhUTUwgY29udGVudCB0byBhcHBlbmQgdG8gdGhlIGB2aWV3YC5cbiAgLy8gICovXG4gIC8vIHNldENlbnRlcmVkVmlld0NvbnRlbnQoaHRtbENvbnRlbnQpIHtcbiAgLy8gICBpZiAodGhpcy52aWV3KSB7XG4gIC8vICAgICBpZiAoIXRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQpIHtcbiAgLy8gICAgICAgbGV0IGNvbnRlbnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAvLyAgICAgICBjb250ZW50RGl2LmNsYXNzTGlzdC5hZGQoJ2NlbnRlcmVkLWNvbnRlbnQnKTtcbiAgLy8gICAgICAgdGhpcy52aWV3LmFwcGVuZENoaWxkKGNvbnRlbnREaXYpO1xuXG4gIC8vICAgICAgIHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQgPSBjb250ZW50RGl2O1xuICAvLyAgICAgfVxuXG4gIC8vICAgICBpZiAoaHRtbENvbnRlbnQpIHtcbiAgLy8gICAgICAgaWYgKGh0bWxDb250ZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgLy8gICAgICAgICBpZiAodGhpcy5fY2VudGVyZWRWaWV3Q29udGVudC5maXJzdENoaWxkKSB7XG4gIC8vICAgICAgICAgICB0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50LnJlbW92ZUNoaWxkKHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQuZmlyc3RDaGlsZCk7XG4gIC8vICAgICAgICAgfVxuXG4gIC8vICAgICAgICAgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudC5hcHBlbmRDaGlsZChodG1sQ29udGVudCk7XG4gIC8vICAgICAgIH0gZWxzZSB7XG4gIC8vICAgICAgICAgLy8gaXMgYSBzdHJpbmdcbiAgLy8gICAgICAgICB0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50LmlubmVySFRNTCA9IGh0bWxDb250ZW50O1xuICAvLyAgICAgICB9XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy8gLyoqXG4gIC8vICAqIFJlbW92ZXMgdGhlIGNlbnRlcmVkIEhUTUwgY29udGVudCAoc2V0IGJ5IHtAbGluayBNb2R1bGUjc2V0Q2VudGVyZWRWaWV3Q29udGVudH0pIGZyb20gdGhlIGB2aWV3YC5cbiAgLy8gICovXG4gIC8vIHJlbW92ZUNlbnRlcmVkVmlld0NvbnRlbnQoKSB7XG4gIC8vICAgaWYgKHRoaXMudmlldyAmJiB0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50KSB7XG4gIC8vICAgICB0aGlzLnZpZXcucmVtb3ZlQ2hpbGQodGhpcy5fY2VudGVyZWRWaWV3Q29udGVudCk7XG4gIC8vICAgICBkZWxldGUgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudDtcbiAgLy8gICB9XG4gIC8vIH1cblxuICAvKipcbiAgICogYHotaW5kZXhgIENTUyBwcm9wZXJ0eSBvZiB0aGUgdmlldy5cbiAgICogQHRvZG8gLSBwcmVwZW5kIHdvdWxkIGRvIHRoZSB0cmljayA/XG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSBWYWx1ZSBvZiB0aGUgYHotaW5kZXhgLlxuICAgKi9cbiAgc2V0IHpJbmRleCh2YWx1ZSkge1xuICAgIGlmICh0aGlzLnZpZXcpIHtcbiAgICAgIHRoaXMudmlldy4kZWwuc3R5bGUuekluZGV4ID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIHNvY2tldC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb21tLnNlbmQoYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YCwgLi4uYXJncylcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLm5hbWV9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZFZvbGF0aWxlKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb21tLnNlbmRWb2xhdGlsZShgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gLCAuLi5hcmdzKVxuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY29tbS5yZWNlaXZlKGAke3RoaXMubmFtZX06JHtjaGFubmVsfWAsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIGxpc3RlbmluZyB0byBhIG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5uYW1lfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gY2FuY2VsLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb21tLnJlbW92ZUxpc3RlbmVyKGAke3RoaXMubmFtZX06JHtjaGFubmVsfWAsIGNhbGxiYWNrKTtcbiAgfVxufVxuXG5DbGllbnRNb2R1bGUuc2VxdWVudGlhbCA9IGZ1bmN0aW9uKC4uLm1vZHVsZXMpIHtcbiAgcmV0dXJuIG5ldyBTZXF1ZW50aWFsKG1vZHVsZXMpO1xufTtcblxuQ2xpZW50TW9kdWxlLnBhcmFsbGVsID0gZnVuY3Rpb24oLi4ubW9kdWxlcykge1xuICByZXR1cm4gbmV3IFBhcmFsbGVsKG1vZHVsZXMpO1xufTtcbiJdfQ==