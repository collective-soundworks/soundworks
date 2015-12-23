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
    value: function showNext(fromIndex) {
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
     * Defines a view constructor to be used in createDefaultView
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
    key: 'createDefaultView',

    /**
     * Create a default view from module attributes.
     */
    value: function createDefaultView() {
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
          this.view.render();
          this.view.appendTo(this.$container);
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
      if (this.view) {
        this.view.remove();
      }

      // this.init();
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
    // set zIndex(value) {
    //   if (this.view) {
    //     this.view.$el.style.zIndex = value;
    //   }
    // }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50TW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQTZCLFFBQVE7O29CQUNwQixRQUFROzs7OzJCQUNSLGdCQUFnQjs7Ozs7Ozs7SUFLM0IsUUFBUTtZQUFSLFFBQVE7O0FBQ0QsV0FEUCxRQUFRLEdBQ0U7MEJBRFYsUUFBUTs7QUFFViwrQkFGRSxRQUFRLDZDQUVGOzs7Ozs7O0FBT1IsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7R0FDN0I7Ozs7OztlQVZHLFFBQVE7O1dBWUMseUJBQUc7OztBQUNkLGFBQU8sYUFBWSxVQUFDLE9BQU87ZUFBSyxNQUFLLGVBQWUsR0FBRyxPQUFPO09BQUEsQ0FBQyxDQUFDO0tBQ2pFOzs7V0FFSyxrQkFBRyxFQUVSOzs7U0FsQkcsUUFBUTs7O0lBd0JSLFVBQVU7WUFBVixVQUFVOztBQUNILFdBRFAsVUFBVSxDQUNGLE9BQU8sRUFBRTswQkFEakIsVUFBVTs7QUFFWiwrQkFGRSxVQUFVLDZDQUVKOztBQUVSLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0dBQ3hCOzs7Ozs7ZUFMRyxVQUFVOztXQU9ELHlCQUFHO0FBQ2QsVUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2YsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDOzs7Ozs7OztjQUVWLElBQUk7O0FBQ1gsY0FBSSxHQUFHLEtBQUssSUFBSSxFQUNkLE9BQU8sQ0FBQyxJQUFJLENBQUM7bUJBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRTtXQUFBLENBQUMsQ0FBQzs7QUFFcEMsYUFBRyxHQUFHLElBQUksQ0FBQztBQUNYLGlCQUFPLEdBQUcsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDOzs7QUFMaEMsMENBQWlCLElBQUksQ0FBQyxPQUFPLDRHQUFFOztTQU05Qjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7V0FFSyxrQkFBRztBQUNQLGFB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QUN6Qzs7O1NBMUVrQixZQUFZO0dBQVMsUUFBUTs7cUJBQTdCLFlBQVk7O0FBMFRqQyxZQUFZLENBQUMsVUFBVSxHQUFHLFlBQXFCO3FDQUFULE9BQU87QUFBUCxXQUFPOzs7QUFDM0MsU0FBTyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUNoQyxDQUFDOztBQUVGLFlBQVksQ0FBQyxRQUFRLEdBQUcsWUFBcUI7cUNBQVQsT0FBTztBQUFQLFdBQU87OztBQUN6QyxTQUFPLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQzlCLENBQUMiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRNb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IGNvbW0gZnJvbSAnLi9jb21tJztcbmltcG9ydCBWaWV3IGZyb20gJy4vZGlzcGxheS9WaWV3JztcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBQcm9taXNlZCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgLyoqXG4gICAgICogW3Jlc29sdmVQcm9taXNlZCBkZXNjcmlwdGlvbl1cbiAgICAgKiBAdG9kbyBkZXNjcmlwdGlvblxuICAgICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucmVzb2x2ZVByb21pc2VkID0gbnVsbDtcbiAgfVxuXG4gIGNyZWF0ZVByb21pc2UoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB0aGlzLnJlc29sdmVQcm9taXNlZCA9IHJlc29sdmUpO1xuICB9XG5cbiAgbGF1bmNoKCkge1xuXG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBTZXF1ZW50aWFsIGV4dGVuZHMgUHJvbWlzZWQge1xuICBjb25zdHJ1Y3Rvcihtb2R1bGVzKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG4gIH1cblxuICBjcmVhdGVQcm9taXNlKCkge1xuICAgIGxldCBtb2QgPSBudWxsO1xuICAgIGxldCBwcm9taXNlID0gbnVsbDtcblxuICAgIGZvciAobGV0IG5leHQgb2YgdGhpcy5tb2R1bGVzKSB7XG4gICAgICBpZiAobW9kICE9PSBudWxsKVxuICAgICAgICBwcm9taXNlLnRoZW4oKCkgPT4gbmV4dC5sYXVuY2goKSk7XG5cbiAgICAgIG1vZCA9IG5leHQ7XG4gICAgICBwcm9taXNlID0gbW9kLmNyZWF0ZVByb21pc2UoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGxhdW5jaCgpIHtcbiAgICByZXR1cm4gdGhpcy5tb2R1bGVzWzBdLmxhdW5jaCgpO1xuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgUGFyYWxsZWwgZXh0ZW5kcyBQcm9taXNlZCB7XG4gIGNvbnN0cnVjdG9yKG1vZHVsZXMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5tb2R1bGVzID0gbW9kdWxlcztcbiAgfVxuXG4gIHNob3dOZXh0KGZyb21JbmRleCkge1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubW9kdWxlcy5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBtb2QgPSB0aGlzLm1vZHVsZXNbaV07XG4gICAgICBjb25zdCBpc1Zpc2libGUgPSBtb2Quc2hvdygpO1xuICAgICAgaWYgKGlzVmlzaWJsZSkgeyBicmVhazsgfVxuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZVByb21pc2UoKSB7XG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcblxuICAgIHRoaXMubW9kdWxlcy5mb3JFYWNoKChtb2QsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBwcm9taXNlID0gbW9kLmNyZWF0ZVByb21pc2UoKTtcbiAgICAgIC8vIGhpZGUgYWxsIG1vZHVsZXMgZXhjZXB0IHRoZSBmaXJzdCBvbmVcbiAgICAgIG1vZC5oaWRlKCk7XG4gICAgICBwcm9taXNlLnRoZW4oKCkgPT4geyB0aGlzLnNob3dOZXh0KCk7IH0pO1xuICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc2hvd05leHQoKTtcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gIH1cblxuICBsYXVuY2goKSB7XG4gICAgZm9yIChsZXQgbW9kIG9mIHRoaXMubW9kdWxlcylcbiAgICAgIG1vZC5sYXVuY2goKTtcbiAgfVxufVxuXG4vKipcbiAqIFtjbGllbnRdIEJhc2UgY2xhc3MgdXNlZCB0byBjcmVhdGUgYW55ICpTb3VuZHdvcmtzKiBtb2R1bGUgb24gdGhlIGNsaWVudCBzaWRlLlxuICpcbiAqIEVhY2ggbW9kdWxlIHNob3VsZCBoYXZlIGEge0BsaW5rIE1vZHVsZSNzdGFydH0sIGEge0BsaW5rIE1vZHVsZSNyZXNldH0sIGEge0BsaW5rIE1vZHVsZSNyZXN0YXJ0fSBhbmQgYSB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZHMuXG4gKlxuICogVGhlIGJhc2UgY2xhc3Mgb3B0aW9uYWxseSBjcmVhdGVzIGEgdmlldyAoYSBmdWxsc2NyZWVuIGBkaXZgIGFjY2Vzc2libGUgdGhyb3VnaCB0aGUge0BsaW5rIE1vZHVsZS52aWV3fSBhdHRyaWJ1dGUpLlxuICogVGhlIHZpZXcgaXMgYWRkZWQgdG8gdGhlIERPTSAoYXMgYSBjaGlsZCBvZiB0aGUgYCNjb250YWluZXJgIGVsZW1lbnQpIHdoZW4gdGhlIG1vZHVsZSBpcyBzdGFydGVkICh3aXRoIHRoZSB7QGxpbmsgTW9kdWxlI3N0YXJ0fSBtZXRob2QpLCBhbmQgcmVtb3ZlZCB3aGVuIHRoZSBtb2R1bGUgY2FsbHMgaXRzIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9Nb2R1bGUuanN+TW9kdWxlfSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqICoqTm90ZToqKiBhIG1vcmUgY29tcGxldGUgZXhhbXBsZSBvZiBob3cgdG8gd3JpdGUgYSBtb2R1bGUgaXMgaW4gdGhlIFtFeGFtcGxlXShtYW51YWwvZXhhbXBsZS5odG1sKSBzZWN0aW9uLlxuICpcbiAqIEBleGFtcGxlIGNsYXNzIE15TW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAqICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gKiAgICAgLy8gVGhpcyBleGFtcGxlIG1vZHVsZTpcbiAqICAgICAvLyAtIGFsd2F5cyBoYXMgYSB2aWV3XG4gKiAgICAgLy8gLSBoYXMgdGhlIGlkIGFuZCBjbGFzcyAnbXktbW9kdWxlLW5hbWUnXG4gKiAgICAgLy8gLSBhbmQgdXNlcyB0aGUgYmFja2dyb3VuZCBjb2xvciBkZWZpbmVkIGluIHRoZSBhcmd1bWVudCAnb3B0aW9ucycgKGlmIGFueSkuXG4gKiAgICAgc3VwZXIoJ215LW1vZHVsZS1uYW1lJywgdHJ1ZSwgb3B0aW9ucy5jb2xvciB8fCAnYWxpemFyaW4nKTtcbiAqXG4gKiAgICAgLi4uIC8vIGFueXRoaW5nIHRoZSBjb25zdHJ1Y3RvciBuZWVkc1xuICogICB9XG4gKlxuICogICBzdGFydCgpIHtcbiAqICAgICBzdXBlci5zdGFydCgpO1xuICpcbiAqICAgICAvLyBXaGF0ZXZlciB0aGUgbW9kdWxlIGRvZXMgKGNvbW11bmljYXRpb24gd2l0aCB0aGUgc2VydmVyLCBldGMuKVxuICogICAgIC8vIC4uLlxuICpcbiAqICAgICAvLyBDYWxsIHRoZSBgZG9uZWAgbWV0aG9kIHdoZW4gdGhlIG1vZHVsZSBoYXMgZmluaXNoZWQgaXRzIGluaXRpYWxpemF0aW9uXG4gKiAgICAgdGhpcy5kb25lKCk7XG4gKiAgIH1cbiAqIH1cbiAqIEB0b2RvIE1vdmUgZXhhbXBsZSBpbiB0aGUgbWFudWFsP1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRNb2R1bGUgZXh0ZW5kcyBQcm9taXNlZCB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBtb2R1bGUgKHVzZWQgYXMgdGhlIGBpZGAgYW5kIENTUyBjbGFzcyBvZiB0aGUgYHZpZXdgIERPTSBlbGVtZW50IGlmIGl0IGV4aXN0cykuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NyZWF0ZVZpZXc9dHJ1ZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1vZHVsZSBkaXNwbGF5cyBhIGB2aWV3YCBvciBub3QuXG4gICAqIEBwYXJhbSB7W3R5cGVdfSBbY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgIHdoZW4gaXQgZXhpc3RzLlxuICAgKi9cbiAgY29uc3RydWN0b3IobmFtZSwgb3B0aW9ucyA9IHt9KSB7IC8vIFRPRE86IGNoYW5nZSB0byBjb2xvckNsYXNzP1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl9ieXBhc3MgPSBvcHRpb25zLmJ5cGFzcyB8fMKgZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuXG4gICAgLyoqXG4gICAgICogVmlldyBvZiB0aGUgbW9kdWxlLlxuICAgICAqIEB0eXBlIHtWaWV3fVxuICAgICAqL1xuICAgIHRoaXMudmlldyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudHMgdG8gYmluZCB0byB0aGUgdmlldy4gKGNmLiBCYWNrYm9uZSdzIHN5bnRheCkuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQWRkaXRpb25uYWwgb3B0aW9ucyB0byBwYXNzIHRvIHRoZSB2aWV3LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy52aWV3T3B0aW9ucyA9IG9wdGlvbnMudmlld09wdGlvbnMgfHzCoHt9O1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBhIHZpZXcgY29uc3RydWN0b3IgdG8gYmUgdXNlZCBpbiBjcmVhdGVEZWZhdWx0Vmlld1xuICAgICAqIEB0eXBlIHtWaWV3fVxuICAgICAqL1xuICAgIHRoaXMudmlld0N0b3IgPSBvcHRpb25zLnZpZXdDdG9yIHx8IFZpZXc7XG5cbiAgICAvKiogQHByaXZhdGUgKi9cbiAgICB0aGlzLl90ZW1wbGF0ZSA9IG51bGw7XG5cbiAgICAvLyBiaW5kIGNvbSBtZXRob2RzIHRvIHRoZSBpbnN0YW5jZS5cbiAgICB0aGlzLnNlbmQgPSB0aGlzLnNlbmQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlY2VpdmUgPSB0aGlzLnJlY2VpdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyID0gdGhpcy5yZW1vdmVMaXN0ZW5lci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNoYXJlIHRoZSBkZWZpbmVkIHRlbXBsYXRlcyB3aXRoIGFsbCBgQ2xpZW50TW9kdWxlYCBpbnN0YW5jZXMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZzIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHRlbXBsYXRlcy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXRpYyBzZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyhkZWZzKSB7XG4gICAgQ2xpZW50TW9kdWxlLnByb3RvdHlwZS50ZW1wbGF0ZURlZmluaXRpb25zID0gZGVmcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTaGFyZSB0aGUgdGV4dCBjb250ZW50IGNvbmZpZ3VyYXRpb24gKG5hbWUgYW5kIGRhdGEpIHdpdGggYWxsIHRoZSBgQ2xpZW50TW9kdWxlYCBpbnN0YW5jZXNcbiAgICogQHBhcmFtIHtPYmplY3R9IGRlZnMgLSBUaGUgdGV4dCBjb250ZW50cyBvZiB0aGUgYXBwbGljYXRpb24uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGF0aWMgc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyhkZWZzKSB7XG4gICAgQ2xpZW50TW9kdWxlLnByb3RvdHlwZS5jb250ZW50RGVmaW5pdGlvbnMgPSBkZWZzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNvbnRhaW5lciBvZiB0aGUgdmlld3MgZm9yIGFsbCBgQ2xpZW50TW9kdWxlYCBpbnN0YW5jZXMuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsIC0gVGhlIGVsZW1lbnQgdG8gdXNlIGFzIGEgY29udGFpbmVyIGZvciB0aGUgbW9kdWxlJ3Mgdmlldy5cbiAgICovXG4gIHN0YXRpYyBzZXRWaWV3Q29udGFpbmVyKCRlbCkge1xuICAgIENsaWVudE1vZHVsZS5wcm90b3R5cGUuJGNvbnRhaW5lciA9ICRlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0ZW1wbGF0ZSBhc3NvY2lhdGVkIHRvIHRoZSBjdXJyZW50IG1vZHVsZS5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSAtIFRoZSB0ZW1wbGF0ZSByZWxhdGVkIHRvIHRoZSBgbmFtZWAgb2YgdGhlIGN1cnJlbnQgbW9kdWxlLlxuICAgKi9cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy5fdGVtcGxhdGUgfHzCoHRoaXMudGVtcGxhdGVEZWZpbml0aW9uc1t0aGlzLm5hbWVdO1xuICAgIC8vIGlmICghdGVtcGxhdGUpXG4gICAgLy8gICB0aHJvdyBuZXcgRXJyb3IoYE5vIHRlbXBsYXRlIGRlZmluZWQgZm9yIG1vZHVsZSBcIiR7dGhpcy5uYW1lfVwiYCk7XG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG5cbiAgc2V0IHRlbXBsYXRlKHRtcGwpIHtcbiAgICB0aGlzLl90ZW1wbGF0ZSA9IHRtcGw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdGV4dCBhc3NvY2lhdGVkIHRvIHRoZSBjdXJyZW50IG1vZHVsZS5cbiAgICogQHJldHVybnMge09iamVjdH0gLSBUaGUgdGV4dCBjb250ZW50cyByZWxhdGVkIHRvIHRoZSBgbmFtZWAgb2YgdGhlIGN1cnJlbnQgbW9kdWxlLiBUaGUgcmV0dXJuZWQgb2JqZWN0IGlzIGV4dGVuZGVkIHdpdGggYSBwb2ludGVyIHRvIHRoZSBgX2dsb2JhbHNgIGVudHJ5IG9mIHRoZSBkZWZpbmVkIHRleHQgY29udGVudHMuXG4gICAqL1xuICBnZXQgY29udGVudCgpIHtcbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5fY29udGVudCB8fMKgdGhpcy5jb250ZW50RGVmaW5pdGlvbnNbdGhpcy5uYW1lXTtcblxuICAgIGlmIChjb250ZW50KVxuICAgICAgY29udGVudC5fZ2xvYmFscyA9IHRoaXMuY29udGVudERlZmluaXRpb25zLl9nbG9iYWxzO1xuXG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBzZXQgY29udGVudChvYmopIHtcbiAgICB0aGlzLl9jb250ZW50ID0gb2JqO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGRlZmF1bHQgdmlldyBmcm9tIG1vZHVsZSBhdHRyaWJ1dGVzLlxuICAgKi9cbiAgY3JlYXRlRGVmYXVsdFZpZXcoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBpZDogdGhpcy5uYW1lLCBjbGFzc05hbWU6ICdtb2R1bGUnIH0sIHRoaXMudmlld09wdGlvbnMpO1xuICAgIHJldHVybiBuZXcgdGhpcy52aWV3Q3Rvcih0aGlzLnRlbXBsYXRlLCB0aGlzLmNvbnRlbnQsIHRoaXMuZXZlbnRzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbGF1bmNoKCkge1xuICAgIGlmICh0aGlzLl9pc0RvbmUpIHtcbiAgICAgIHRoaXMucmVzdGFydCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5faXNTdGFydGVkKVxuICAgICAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIHRoZSBsb2dpYyBhbmQgc3RlcHMgdGhhdCBsZWFkIHRvIHRoZSBpbml0aWFsaXphdGlvbiBvZiB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBGb3IgaW5zdGFuY2UsIGl0IHRha2VzIGNhcmUgb2YgdGhlIGNvbW11bmljYXRpb24gd2l0aCB0aGUgbW9kdWxlIG9uIHRoZSBzZXJ2ZXIgc2lkZSBieSBzZW5kaW5nIFdlYlNvY2tldCBtZXNzYWdlcyBhbmQgc2V0dGluZyB1cCBXZWJTb2NrZXQgbWVzc2FnZSBsaXN0ZW5lcnMuXG4gICAqXG4gICAqIEFkZGl0aW9uYWxseSwgaWYgdGhlIG1vZHVsZSBoYXMgYSBgdmlld2AsIHRoZSBgc3RhcnRgIG1ldGhvZCBjcmVhdGVzIHRoZSBjb3JyZXNwb25kaW5nIEhUTUwgZWxlbWVudCBhbmQgYXBwZW5kcyBpdCB0byB0aGUgRE9N4oCZcyBtYWluIGNvbnRhaW5lciBlbGVtZW50IChgZGl2I2NvbnRhaW5lcmApLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSwgeW91IHNob3VsZCBub3QgY2FsbCBpdCBtYW51YWxseS5cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBzdGFydCgpIHtcbiAgICAvLyBhbGxvdyB0byBieXBhc3MgYSBtb2R1bGUgZnJvbSBpdHMgb3B0aW9uc1xuICAgIGlmICh0aGlzLl9ieXBhc3MpIHsgdGhpcy5kb25lKCk7IH1cblxuICAgIGlmICghdGhpcy5faXNTdGFydGVkKSB7XG4gICAgICBpZiAodGhpcy52aWV3KSB7XG4gICAgICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICAgICAgdGhpcy52aWV3LmFwcGVuZFRvKHRoaXMuJGNvbnRhaW5lcik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2lzU3RhcnRlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnQgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogVGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIGEgbG9zdCBjb25uZWN0aW9uIHdpdGggdGhlIHNlcnZlciBpcyByZXN1bWVkIChmb3IgaW5zdGFuY2UgYmVjYXVzZSBvZiBhIHNlcnZlciBjcmFzaCksIGlmIHRoZSBtb2R1bGUgaGFkIGFscmVhZHkgZmluaXNoZWQgaXRzIGluaXRpYWxpemF0aW9uICgqaS5lLiogaWYgaXQgaGFkIGNhbGxlZCBpdHMge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2QpLlxuICAgKiBUaGUgbWV0aG9kIHNob3VsZCBzZW5kIHRvIHRoZSBzZXJ2ZXIgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogKEluZGVlZCwgaWYgdGhlIHNlcnZlciBjcmFzaGVzLCBpdCB3aWxsIHJlc2V0IGFsbCB0aGUgaW5mb3JtYXRpb24gaXQgaGFzIGFib3V0IGFsbCB0aGUgY2xpZW50cy5cbiAgICogT24gdGhlIGNsaWVudCBzaWRlLCB0aGUgbW9kdWxlcyB0aGF0IGhhZCBmaW5pc2hlZCB0aGVpciBpbml0aWFsaXphdGlvbiBwcm9jZXNzIHNob3VsZCBzZW5kIHRoZWlyIHN0YXRlIHRvIHRoZSBzZXJ2ZXIgc28gdGhhdCBpdCBjYW4gYmUgdXAgdG8gZGF0ZSB3aXRoIHRoZSByZWFsIHN0YXRlIG9mIHRoZSBzY2VuYXJpby4pXG4gICAqXG4gICAqIEZvciBpbnN0YW5jZSwgdGhpcyBtZXRob2QgaW4gdGhlIHtAbGluayBMb2NhdG9yfSBtb2R1bGUgc2VuZHMgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBjbGllbnQgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogKipOb3RlOioqIHRoZSBtZXRob2QgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgd2hlbiBuZWNlc3NhcnksIHlvdSBzaG91bGQgbm90IGNhbGwgaXQgbWFudWFsbHkuXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICB0aGlzLl9pc0RvbmUgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgbW9kdWxlIHRvIHRoZSBzdGF0ZSBpdCBoYWQgYmVmb3JlIGNhbGxpbmcgdGhlIHtAbGluayBNb2R1bGUjc3RhcnR9IG1ldGhvZC5cbiAgICpcbiAgICogVGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIGEgbG9zdCBjb25uZWN0aW9uIHdpdGggdGhlIHNlcnZlciBpcyByZXN1bWVkIChmb3IgaW5zdGFuY2UgYmVjYXVzZSBvZiBhIHNlcnZlciBjcmFzaCksIGlmIHRoZSBtb2R1bGUgaGFkIG5vdCBmaW5pc2hlZCBpdHMgaW5pdGlhbGl6YXRpb24gKCppLmUuKiBpZiBpdCBoYWQgbm90IGNhbGxlZCBpdHMge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2QpLlxuICAgKiBJbiB0aGF0IGNhc2UsIHRoZSBtb2R1bGUgY2xlYW5zIHdoYXRldmVyIGl0IHdhcyBkb2luZyBhbmQgc3RhcnRzIGFnYWluIGZyb20gc2NyYXRjaC5cbiAgICpcbiAgICogKipOb3RlOioqIHRoZSBtZXRob2QgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgd2hlbiBuZWNlc3NhcnksIHlvdSBzaG91bGQgbm90IGNhbGwgaXQgbWFudWFsbHkuXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgaWYgKHRoaXMudmlldykge1xuICAgICAgdGhpcy52aWV3LnJlbW92ZSgpO1xuICAgIH1cblxuICAgIC8vIHRoaXMuaW5pdCgpO1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBiZSBjYWxsZWQgd2hlbiB0aGUgbW9kdWxlIGhhcyBmaW5pc2hlZCBpdHMgaW5pdGlhbGl6YXRpb24gKCppLmUuKiB3aGVuIHRoZSBtb2R1bGUgaGFzIGRvbmUgaXRzIGR1dHksIG9yIHdoZW4gaXQgbWF5IHJ1biBpbiB0aGUgYmFja2dyb3VuZCBmb3IgdGhlIHJlc3Qgb2YgdGhlIHNjZW5hcmlvIGFmdGVyIGl0IGZpbmlzaGVkIGl0cyBpbml0aWFsaXphdGlvbiBwcm9jZXNzKSwgdG8gYWxsb3cgc3Vic2VxdWVudCBzdGVwcyBvZiB0aGUgc2NlbmFyaW8gdG8gc3RhcnQuXG4gICAqXG4gICAqIEZvciBpbnN0YW5jZSwgdGhlIHtAbGluayBMb2FkZXJ9IG1vZHVsZSBjYWxscyBpdHMge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2Qgd2hlbiBmaWxlcyBhcmUgbG9hZGVkLCBhbmQgdGhlIHtAbGluayBTeW5jfSBtb2R1bGUgY2FsbHMgaXQgd2hlbiB0aGUgZmlyc3Qgc3luY2hyb25pemF0aW9uIHByb2Nlc3MgaXMgZmluaXNoZWQgKHdoaWxlIHRoZSBtb2R1bGUga2VlcHMgcnVubmluZyBpbiB0aGUgYmFja2dyb3VuZCBhZnRlcndhcmRzKS5cbiAgICogQXMgYW4gZXhjZXB0aW9uLCB0aGUgbGFzdCBtb2R1bGUgb2YgdGhlIHNjZW5hcmlvICh1c3VhbGx5IHRoZSB7QGxpbmsgUGVyZm9ybWFuY2V9IG1vZHVsZSkgbWF5IG5vdCBjYWxsIGl0cyB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZC5cbiAgICpcbiAgICogSWYgdGhlIG1vZHVsZSBoYXMgYSBgdmlld2AsIHRoZSBgZG9uZWAgbWV0aG9kIHJlbW92ZXMgaXQgZnJvbSB0aGUgRE9NLlxuICAgKlxuICAgKiAqKk5vdGU6KiogeW91IHNob3VsZCBub3Qgb3ZlcnJpZGUgdGhpcyBtZXRob2QuXG4gICAqL1xuICBkb25lKCkge1xuICAgIHRoaXMuX2lzRG9uZSA9IHRydWU7XG5cbiAgICBpZiAodGhpcy52aWV3KVxuICAgICAgdGhpcy52aWV3LnJlbW92ZSgpO1xuXG4gICAgaWYgKHRoaXMucmVzb2x2ZVByb21pc2VkKVxuICAgICAgdGhpcy5yZXNvbHZlUHJvbWlzZWQoKTtcbiAgfVxuXG4gIC8vIC8qKlxuICAvLyAgKiBTZXQgYW4gYXJiaXRyYXJ5IGNlbnRlcmVkIEhUTUwgY29udGVudCB0byB0aGUgbW9kdWxlJ3MgYHZpZXdgIChpZiBhbnkpLlxuICAvLyAgKiBAcGFyYW0ge1N0cmluZ30gaHRtbENvbnRlbnQgVGhlIEhUTUwgY29udGVudCB0byBhcHBlbmQgdG8gdGhlIGB2aWV3YC5cbiAgLy8gICovXG4gIC8vIHNldENlbnRlcmVkVmlld0NvbnRlbnQoaHRtbENvbnRlbnQpIHtcbiAgLy8gICBpZiAodGhpcy52aWV3KSB7XG4gIC8vICAgICBpZiAoIXRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQpIHtcbiAgLy8gICAgICAgbGV0IGNvbnRlbnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAvLyAgICAgICBjb250ZW50RGl2LmNsYXNzTGlzdC5hZGQoJ2NlbnRlcmVkLWNvbnRlbnQnKTtcbiAgLy8gICAgICAgdGhpcy52aWV3LmFwcGVuZENoaWxkKGNvbnRlbnREaXYpO1xuXG4gIC8vICAgICAgIHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQgPSBjb250ZW50RGl2O1xuICAvLyAgICAgfVxuXG4gIC8vICAgICBpZiAoaHRtbENvbnRlbnQpIHtcbiAgLy8gICAgICAgaWYgKGh0bWxDb250ZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgLy8gICAgICAgICBpZiAodGhpcy5fY2VudGVyZWRWaWV3Q29udGVudC5maXJzdENoaWxkKSB7XG4gIC8vICAgICAgICAgICB0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50LnJlbW92ZUNoaWxkKHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQuZmlyc3RDaGlsZCk7XG4gIC8vICAgICAgICAgfVxuXG4gIC8vICAgICAgICAgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudC5hcHBlbmRDaGlsZChodG1sQ29udGVudCk7XG4gIC8vICAgICAgIH0gZWxzZSB7XG4gIC8vICAgICAgICAgLy8gaXMgYSBzdHJpbmdcbiAgLy8gICAgICAgICB0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50LmlubmVySFRNTCA9IGh0bWxDb250ZW50O1xuICAvLyAgICAgICB9XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy8gLyoqXG4gIC8vICAqIFJlbW92ZXMgdGhlIGNlbnRlcmVkIEhUTUwgY29udGVudCAoc2V0IGJ5IHtAbGluayBNb2R1bGUjc2V0Q2VudGVyZWRWaWV3Q29udGVudH0pIGZyb20gdGhlIGB2aWV3YC5cbiAgLy8gICovXG4gIC8vIHJlbW92ZUNlbnRlcmVkVmlld0NvbnRlbnQoKSB7XG4gIC8vICAgaWYgKHRoaXMudmlldyAmJiB0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50KSB7XG4gIC8vICAgICB0aGlzLnZpZXcucmVtb3ZlQ2hpbGQodGhpcy5fY2VudGVyZWRWaWV3Q29udGVudCk7XG4gIC8vICAgICBkZWxldGUgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudDtcbiAgLy8gICB9XG4gIC8vIH1cblxuICAvKipcbiAgICogYHotaW5kZXhgIENTUyBwcm9wZXJ0eSBvZiB0aGUgdmlldy5cbiAgICogQHRvZG8gLSBwcmVwZW5kIHdvdWxkIGRvIHRoZSB0cmljayA/XG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSBWYWx1ZSBvZiB0aGUgYHotaW5kZXhgLlxuICAgKi9cbiAgLy8gc2V0IHpJbmRleCh2YWx1ZSkge1xuICAvLyAgIGlmICh0aGlzLnZpZXcpIHtcbiAgLy8gICAgIHRoaXMudmlldy4kZWwuc3R5bGUuekluZGV4ID0gdmFsdWU7XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgc2hvdygpIHtcbiAgICBpZiAodGhpcy52aWV3ICYmICF0aGlzLl9pc0RvbmUpIHtcbiAgICAgIGlmICghdGhpcy52aWV3LmlzVmlzaWJsZSkge1xuICAgICAgICB0aGlzLnZpZXcuc2hvdygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBoaWRlKCkge1xuICAgIGlmICh0aGlzLnZpZXcgJiYgIXRoaXMuX2RvbmUpIHsgdGhpcy52aWV3LmhpZGUoKTsgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIHNvY2tldC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb21tLnNlbmQoYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YCwgLi4uYXJncylcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLm5hbWV9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZFZvbGF0aWxlKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb21tLnNlbmRWb2xhdGlsZShgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gLCAuLi5hcmdzKVxuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY29tbS5yZWNlaXZlKGAke3RoaXMubmFtZX06JHtjaGFubmVsfWAsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIGxpc3RlbmluZyB0byBhIG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5uYW1lfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gY2FuY2VsLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb21tLnJlbW92ZUxpc3RlbmVyKGAke3RoaXMubmFtZX06JHtjaGFubmVsfWAsIGNhbGxiYWNrKTtcbiAgfVxufVxuXG5DbGllbnRNb2R1bGUuc2VxdWVudGlhbCA9IGZ1bmN0aW9uKC4uLm1vZHVsZXMpIHtcbiAgcmV0dXJuIG5ldyBTZXF1ZW50aWFsKG1vZHVsZXMpO1xufTtcblxuQ2xpZW50TW9kdWxlLnBhcmFsbGVsID0gZnVuY3Rpb24oLi4ubW9kdWxlcykge1xuICByZXR1cm4gbmV3IFBhcmFsbGVsKG1vZHVsZXMpO1xufTtcbiJdfQ==