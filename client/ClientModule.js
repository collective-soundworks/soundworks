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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50TW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQTZCLFFBQVE7O29CQUNwQixRQUFROzs7OzJCQUNSLGdCQUFnQjs7Ozs7Ozs7SUFLM0IsUUFBUTtZQUFSLFFBQVE7O0FBQ0QsV0FEUCxRQUFRLEdBQ0U7MEJBRFYsUUFBUTs7QUFFViwrQkFGRSxRQUFRLDZDQUVGOzs7Ozs7O0FBT1IsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7R0FDN0I7Ozs7OztlQVZHLFFBQVE7O1dBWUMseUJBQUc7OztBQUNkLGFBQU8sYUFBWSxVQUFDLE9BQU87ZUFBSyxNQUFLLGVBQWUsR0FBRyxPQUFPO09BQUEsQ0FBQyxDQUFDO0tBQ2pFOzs7V0FFSyxrQkFBRyxFQUVSOzs7U0FsQkcsUUFBUTs7O0lBd0JSLFVBQVU7WUFBVixVQUFVOztBQUNILFdBRFAsVUFBVSxDQUNGLE9BQU8sRUFBRTswQkFEakIsVUFBVTs7QUFFWiwrQkFGRSxVQUFVLDZDQUVKOztBQUVSLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0dBQ3hCOzs7Ozs7ZUFMRyxVQUFVOztXQU9ELHlCQUFHO0FBQ2QsVUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2YsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDOzs7Ozs7OztjQUVYLElBQUk7O0FBQ1YsY0FBRyxHQUFHLEtBQUssSUFBSSxFQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUM7bUJBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRTtXQUFBLENBQUMsQ0FBQzs7QUFFcEMsYUFBRyxHQUFHLElBQUksQ0FBQztBQUNYLGlCQUFPLEdBQUcsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDOzs7QUFMaEMsMENBQWdCLElBQUksQ0FBQyxPQUFPLDRHQUFFOztTQU03Qjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7V0FFSyxrQkFBRztBQUNQLGFB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V0F0TWdDLG9DQUFDLElBQUksRUFBRTtBQUN0QyxrQkFBWSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7S0FDbkQ7Ozs7Ozs7OztXQU8rQixtQ0FBQyxJQUFJLEVBQUU7QUFDckMsa0JBQVksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0tBQ2xEOzs7Ozs7OztXQU1zQiwwQkFBQyxHQUFHLEVBQUU7QUFDM0Isa0JBQVksQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztLQUN6Qzs7O1NBMUVrQixZQUFZO0dBQVMsUUFBUTs7cUJBQTdCLFlBQVk7O0FBb1NqQyxZQUFZLENBQUMsVUFBVSxHQUFHLFlBQXFCO3FDQUFULE9BQU87QUFBUCxXQUFPOzs7QUFDM0MsU0FBTyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUNoQyxDQUFDOztBQUVGLFlBQVksQ0FBQyxRQUFRLEdBQUcsWUFBcUI7cUNBQVQsT0FBTztBQUFQLFdBQU87OztBQUN6QyxTQUFPLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQzlCLENBQUMiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRNb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IGNvbW0gZnJvbSAnLi9jb21tJztcbmltcG9ydCBWaWV3IGZyb20gJy4vZGlzcGxheS9WaWV3JztcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBQcm9taXNlZCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgLyoqXG4gICAgICogW3Jlc29sdmVQcm9taXNlZCBkZXNjcmlwdGlvbl1cbiAgICAgKiBAdG9kbyBkZXNjcmlwdGlvblxuICAgICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucmVzb2x2ZVByb21pc2VkID0gbnVsbDtcbiAgfVxuXG4gIGNyZWF0ZVByb21pc2UoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB0aGlzLnJlc29sdmVQcm9taXNlZCA9IHJlc29sdmUpO1xuICB9XG5cbiAgbGF1bmNoKCkge1xuXG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBTZXF1ZW50aWFsIGV4dGVuZHMgUHJvbWlzZWQge1xuICBjb25zdHJ1Y3Rvcihtb2R1bGVzKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG4gIH1cblxuICBjcmVhdGVQcm9taXNlKCkge1xuICAgIGxldCBtb2QgPSBudWxsO1xuICAgIGxldCBwcm9taXNlID0gbnVsbDtcblxuICAgIGZvcihsZXQgbmV4dCBvZiB0aGlzLm1vZHVsZXMpIHtcbiAgICAgIGlmKG1vZCAhPT0gbnVsbClcbiAgICAgICAgcHJvbWlzZS50aGVuKCgpID0+IG5leHQubGF1bmNoKCkpO1xuXG4gICAgICBtb2QgPSBuZXh0O1xuICAgICAgcHJvbWlzZSA9IG1vZC5jcmVhdGVQcm9taXNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBsYXVuY2goKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kdWxlc1swXS5sYXVuY2goKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIFBhcmFsbGVsIGV4dGVuZHMgUHJvbWlzZWQge1xuICBjb25zdHJ1Y3Rvcihtb2R1bGVzKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG5cbiAgICAvLyBzZXQgei1pbmRleCBvZiBwYXJhbGxlbCBtb2R1bGVzXG4gICAgbGV0IHpJbmRleCA9IG1vZHVsZXMubGVuZ3RoO1xuICAgIGZvcihsZXQgbW9kIG9mIG1vZHVsZXMpIHtcbiAgICAgIG1vZC56SW5kZXggPSB6SW5kZXg7XG4gICAgICB6SW5kZXgtLTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVQcm9taXNlKCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbCh0aGlzLm1vZHVsZXMubWFwKChtb2QpID0+IG1vZC5jcmVhdGVQcm9taXNlKCkpKTtcbiAgfVxuXG4gIGxhdW5jaCgpIHtcbiAgICBmb3IobGV0IG1vZCBvZiB0aGlzLm1vZHVsZXMpXG4gICAgICBtb2QubGF1bmNoKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBbY2xpZW50XSBCYXNlIGNsYXNzIHVzZWQgdG8gY3JlYXRlIGFueSAqU291bmR3b3JrcyogbW9kdWxlIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAqXG4gKiBFYWNoIG1vZHVsZSBzaG91bGQgaGF2ZSBhIHtAbGluayBNb2R1bGUjc3RhcnR9LCBhIHtAbGluayBNb2R1bGUjcmVzZXR9LCBhIHtAbGluayBNb2R1bGUjcmVzdGFydH0gYW5kIGEge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2RzLlxuICpcbiAqIFRoZSBiYXNlIGNsYXNzIG9wdGlvbmFsbHkgY3JlYXRlcyBhIHZpZXcgKGEgZnVsbHNjcmVlbiBgZGl2YCBhY2Nlc3NpYmxlIHRocm91Z2ggdGhlIHtAbGluayBNb2R1bGUudmlld30gYXR0cmlidXRlKS5cbiAqIFRoZSB2aWV3IGlzIGFkZGVkIHRvIHRoZSBET00gKGFzIGEgY2hpbGQgb2YgdGhlIGAjY29udGFpbmVyYCBlbGVtZW50KSB3aGVuIHRoZSBtb2R1bGUgaXMgc3RhcnRlZCAod2l0aCB0aGUge0BsaW5rIE1vZHVsZSNzdGFydH0gbWV0aG9kKSwgYW5kIHJlbW92ZWQgd2hlbiB0aGUgbW9kdWxlIGNhbGxzIGl0cyB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvTW9kdWxlLmpzfk1vZHVsZX0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiAqKk5vdGU6KiogYSBtb3JlIGNvbXBsZXRlIGV4YW1wbGUgb2YgaG93IHRvIHdyaXRlIGEgbW9kdWxlIGlzIGluIHRoZSBbRXhhbXBsZV0obWFudWFsL2V4YW1wbGUuaHRtbCkgc2VjdGlvbi5cbiAqXG4gKiBAZXhhbXBsZSBjbGFzcyBNeU1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gKiAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICogICAgIC8vIFRoaXMgZXhhbXBsZSBtb2R1bGU6XG4gKiAgICAgLy8gLSBhbHdheXMgaGFzIGEgdmlld1xuICogICAgIC8vIC0gaGFzIHRoZSBpZCBhbmQgY2xhc3MgJ215LW1vZHVsZS1uYW1lJ1xuICogICAgIC8vIC0gYW5kIHVzZXMgdGhlIGJhY2tncm91bmQgY29sb3IgZGVmaW5lZCBpbiB0aGUgYXJndW1lbnQgJ29wdGlvbnMnIChpZiBhbnkpLlxuICogICAgIHN1cGVyKCdteS1tb2R1bGUtbmFtZScsIHRydWUsIG9wdGlvbnMuY29sb3IgfHwgJ2FsaXphcmluJyk7XG4gKlxuICogICAgIC4uLiAvLyBhbnl0aGluZyB0aGUgY29uc3RydWN0b3IgbmVlZHNcbiAqICAgfVxuICpcbiAqICAgc3RhcnQoKSB7XG4gKiAgICAgc3VwZXIuc3RhcnQoKTtcbiAqXG4gKiAgICAgLy8gV2hhdGV2ZXIgdGhlIG1vZHVsZSBkb2VzIChjb21tdW5pY2F0aW9uIHdpdGggdGhlIHNlcnZlciwgZXRjLilcbiAqICAgICAvLyAuLi5cbiAqXG4gKiAgICAgLy8gQ2FsbCB0aGUgYGRvbmVgIG1ldGhvZCB3aGVuIHRoZSBtb2R1bGUgaGFzIGZpbmlzaGVkIGl0cyBpbml0aWFsaXphdGlvblxuICogICAgIHRoaXMuZG9uZSgpO1xuICogICB9XG4gKiB9XG4gKiBAdG9kbyBNb3ZlIGV4YW1wbGUgaW4gdGhlIG1hbnVhbD9cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50TW9kdWxlIGV4dGVuZHMgUHJvbWlzZWQge1xuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgbW9kdWxlICh1c2VkIGFzIHRoZSBgaWRgIGFuZCBDU1MgY2xhc3Mgb2YgdGhlIGB2aWV3YCBET00gZWxlbWVudCBpZiBpdCBleGlzdHMpLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjcmVhdGVWaWV3PXRydWVdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgZGlzcGxheXMgYSBgdmlld2Agb3Igbm90LlxuICAgKiBAcGFyYW0ge1t0eXBlXX0gW2NvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YCB3aGVuIGl0IGV4aXN0cy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG5hbWUsIG9wdGlvbnMgPSB7fSkgeyAvLyBUT0RPOiBjaGFuZ2UgdG8gY29sb3JDbGFzcz9cbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fYnlwYXNzID0gb3B0aW9ucy5ieXBhc3MgfHzCoGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcblxuICAgIC8qKlxuICAgICAqIFZpZXcgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7Vmlld31cbiAgICAgKi9cbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnRzIHRvIGJpbmQgdG8gdGhlIHZpZXcuIChjZi4gQmFja2JvbmUncyBzeW50YXgpLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFkZGl0aW9ubmFsIG9wdGlvbnMgdG8gcGFzcyB0byB0aGUgdmlldy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMudmlld09wdGlvbnMgPSBvcHRpb25zLnZpZXdPcHRpb25zIHx8wqB7fTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgYSB2aWV3IGNvbnN0cnVjdG9yIHRvIGJlIHVzZWQgaW4gY3JlYXRlRGVmYXVsdFZpZXdcbiAgICAgKiBAdHlwZSB7Vmlld31cbiAgICAgKi9cbiAgICB0aGlzLnZpZXdDdG9yID0gb3B0aW9ucy52aWV3Q3RvciB8fCBWaWV3O1xuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgdGhpcy5fdGVtcGxhdGUgPSBudWxsO1xuXG4gICAgLy8gYmluZCBjb20gbWV0aG9kcyB0byB0aGUgaW5zdGFuY2UuXG4gICAgdGhpcy5zZW5kID0gdGhpcy5zZW5kLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWNlaXZlID0gdGhpcy5yZWNlaXZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lciA9IHRoaXMucmVtb3ZlTGlzdGVuZXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaGFyZSB0aGUgZGVmaW5lZCB0ZW1wbGF0ZXMgd2l0aCBhbGwgYENsaWVudE1vZHVsZWAgaW5zdGFuY2VzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmcyAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSB0ZW1wbGF0ZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGF0aWMgc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmcykge1xuICAgIENsaWVudE1vZHVsZS5wcm90b3R5cGUudGVtcGxhdGVEZWZpbml0aW9ucyA9IGRlZnM7XG4gIH1cblxuICAvKipcbiAgICogU2hhcmUgdGhlIHRleHQgY29udGVudCBjb25maWd1cmF0aW9uIChuYW1lIGFuZCBkYXRhKSB3aXRoIGFsbCB0aGUgYENsaWVudE1vZHVsZWAgaW5zdGFuY2VzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZzIC0gVGhlIHRleHQgY29udGVudHMgb2YgdGhlIGFwcGxpY2F0aW9uLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhdGljIHNldFZpZXdDb250ZW50RGVmaW5pdGlvbnMoZGVmcykge1xuICAgIENsaWVudE1vZHVsZS5wcm90b3R5cGUuY29udGVudERlZmluaXRpb25zID0gZGVmcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjb250YWluZXIgb2YgdGhlIHZpZXdzIGZvciBhbGwgYENsaWVudE1vZHVsZWAgaW5zdGFuY2VzLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBlbGVtZW50IHRvIHVzZSBhcyBhIGNvbnRhaW5lciBmb3IgdGhlIG1vZHVsZSdzIHZpZXcuXG4gICAqL1xuICBzdGF0aWMgc2V0Vmlld0NvbnRhaW5lcigkZWwpIHtcbiAgICBDbGllbnRNb2R1bGUucHJvdG90eXBlLiRjb250YWluZXIgPSAkZWw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdGVtcGxhdGUgYXNzb2NpYXRlZCB0byB0aGUgY3VycmVudCBtb2R1bGUuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gLSBUaGUgdGVtcGxhdGUgcmVsYXRlZCB0byB0aGUgYG5hbWVgIG9mIHRoZSBjdXJyZW50IG1vZHVsZS5cbiAgICovXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMuX3RlbXBsYXRlIHx8wqB0aGlzLnRlbXBsYXRlRGVmaW5pdGlvbnNbdGhpcy5uYW1lXTtcbiAgICAvLyBpZiAoIXRlbXBsYXRlKVxuICAgIC8vICAgdGhyb3cgbmV3IEVycm9yKGBObyB0ZW1wbGF0ZSBkZWZpbmVkIGZvciBtb2R1bGUgXCIke3RoaXMubmFtZX1cImApO1xuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfVxuXG4gIHNldCB0ZW1wbGF0ZSh0bXBsKSB7XG4gICAgdGhpcy5fdGVtcGxhdGUgPSB0bXBsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRleHQgYXNzb2NpYXRlZCB0byB0aGUgY3VycmVudCBtb2R1bGUuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IC0gVGhlIHRleHQgY29udGVudHMgcmVsYXRlZCB0byB0aGUgYG5hbWVgIG9mIHRoZSBjdXJyZW50IG1vZHVsZS4gVGhlIHJldHVybmVkIG9iamVjdCBpcyBleHRlbmRlZCB3aXRoIGEgcG9pbnRlciB0byB0aGUgYF9nbG9iYWxzYCBlbnRyeSBvZiB0aGUgZGVmaW5lZCB0ZXh0IGNvbnRlbnRzLlxuICAgKi9cbiAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgY29uc3QgdGV4dHMgPSB0aGlzLl9jb250ZW50IHx8wqB0aGlzLmNvbnRlbnREZWZpbml0aW9uc1t0aGlzLm5hbWVdO1xuICAgIGlmICghdGV4dHMpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHRleHQgY29udGVudHMgZGVmaW5lZCBmb3IgbW9kdWxlIFwiJHt0aGlzLm5hbWV9XCJgKTtcblxuICAgIHRleHRzLl9nbG9iYWxzID0gdGhpcy5jb250ZW50RGVmaW5pdGlvbnMuX2dsb2JhbHM7XG4gICAgcmV0dXJuIHRleHRzO1xuICB9XG5cbiAgc2V0IGNvbnRlbnQob2JqKSB7XG4gICAgdGhpcy5fY29udGVudCA9IG9iajtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBkZWZhdWx0IHZpZXcgZnJvbSBtb2R1bGUgYXR0cmlidXRlcy5cbiAgICovXG4gIGNyZWF0ZURlZmF1bHRWaWV3KCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgaWQ6IHRoaXMubmFtZSwgY2xhc3NOYW1lOiAnbW9kdWxlJyB9LCB0aGlzLnZpZXdPcHRpb25zKTtcbiAgICByZXR1cm4gbmV3IHRoaXMudmlld0N0b3IodGhpcy50ZW1wbGF0ZSwgdGhpcy5jb250ZW50LCB0aGlzLmV2ZW50cywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGxhdW5jaCgpIHtcbiAgICBpZiAodGhpcy5faXNEb25lKSB7XG4gICAgICB0aGlzLnJlc3RhcnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuX2lzU3RhcnRlZClcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuXG4gICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSB0aGUgbG9naWMgYW5kIHN0ZXBzIHRoYXQgbGVhZCB0byB0aGUgaW5pdGlhbGl6YXRpb24gb2YgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogRm9yIGluc3RhbmNlLCBpdCB0YWtlcyBjYXJlIG9mIHRoZSBjb21tdW5pY2F0aW9uIHdpdGggdGhlIG1vZHVsZSBvbiB0aGUgc2VydmVyIHNpZGUgYnkgc2VuZGluZyBXZWJTb2NrZXQgbWVzc2FnZXMgYW5kIHNldHRpbmcgdXAgV2ViU29ja2V0IG1lc3NhZ2UgbGlzdGVuZXJzLlxuICAgKlxuICAgKiBBZGRpdGlvbmFsbHksIGlmIHRoZSBtb2R1bGUgaGFzIGEgYHZpZXdgLCB0aGUgYHN0YXJ0YCBtZXRob2QgY3JlYXRlcyB0aGUgY29ycmVzcG9uZGluZyBIVE1MIGVsZW1lbnQgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIERPTeKAmXMgbWFpbiBjb250YWluZXIgZWxlbWVudCAoYGRpdiNjb250YWluZXJgKS5cbiAgICpcbiAgICogKipOb3RlOioqIHRoZSBtZXRob2QgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgd2hlbiBuZWNlc3NhcnksIHlvdSBzaG91bGQgbm90IGNhbGwgaXQgbWFudWFsbHkuXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgLy8gYWxsb3cgdG8gYnlwYXNzIGEgbW9kdWxlIGZyb20gaXRzIG9wdGlvbnNcbiAgICBpZiAodGhpcy5fYnlwYXNzKSB7IHRoaXMuZG9uZSgpOyB9XG5cbiAgICBpZiAoIXRoaXMuX2lzU3RhcnRlZCkge1xuICAgICAgaWYgKHRoaXMudmlldykge1xuICAgICAgICB0aGlzLiRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy52aWV3LnJlbmRlcigpKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5faXNTdGFydGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydCB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBUaGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gYSBsb3N0IGNvbm5lY3Rpb24gd2l0aCB0aGUgc2VydmVyIGlzIHJlc3VtZWQgKGZvciBpbnN0YW5jZSBiZWNhdXNlIG9mIGEgc2VydmVyIGNyYXNoKSwgaWYgdGhlIG1vZHVsZSBoYWQgYWxyZWFkeSBmaW5pc2hlZCBpdHMgaW5pdGlhbGl6YXRpb24gKCppLmUuKiBpZiBpdCBoYWQgY2FsbGVkIGl0cyB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZCkuXG4gICAqIFRoZSBtZXRob2Qgc2hvdWxkIHNlbmQgdG8gdGhlIHNlcnZlciB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiAoSW5kZWVkLCBpZiB0aGUgc2VydmVyIGNyYXNoZXMsIGl0IHdpbGwgcmVzZXQgYWxsIHRoZSBpbmZvcm1hdGlvbiBpdCBoYXMgYWJvdXQgYWxsIHRoZSBjbGllbnRzLlxuICAgKiBPbiB0aGUgY2xpZW50IHNpZGUsIHRoZSBtb2R1bGVzIHRoYXQgaGFkIGZpbmlzaGVkIHRoZWlyIGluaXRpYWxpemF0aW9uIHByb2Nlc3Mgc2hvdWxkIHNlbmQgdGhlaXIgc3RhdGUgdG8gdGhlIHNlcnZlciBzbyB0aGF0IGl0IGNhbiBiZSB1cCB0byBkYXRlIHdpdGggdGhlIHJlYWwgc3RhdGUgb2YgdGhlIHNjZW5hcmlvLilcbiAgICpcbiAgICogRm9yIGluc3RhbmNlLCB0aGlzIG1ldGhvZCBpbiB0aGUge0BsaW5rIExvY2F0b3J9IG1vZHVsZSBzZW5kcyB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIGNsaWVudCB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSwgeW91IHNob3VsZCBub3QgY2FsbCBpdCBtYW51YWxseS5cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHRoaXMuX2lzRG9uZSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBtb2R1bGUgdG8gdGhlIHN0YXRlIGl0IGhhZCBiZWZvcmUgY2FsbGluZyB0aGUge0BsaW5rIE1vZHVsZSNzdGFydH0gbWV0aG9kLlxuICAgKlxuICAgKiBUaGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gYSBsb3N0IGNvbm5lY3Rpb24gd2l0aCB0aGUgc2VydmVyIGlzIHJlc3VtZWQgKGZvciBpbnN0YW5jZSBiZWNhdXNlIG9mIGEgc2VydmVyIGNyYXNoKSwgaWYgdGhlIG1vZHVsZSBoYWQgbm90IGZpbmlzaGVkIGl0cyBpbml0aWFsaXphdGlvbiAoKmkuZS4qIGlmIGl0IGhhZCBub3QgY2FsbGVkIGl0cyB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZCkuXG4gICAqIEluIHRoYXQgY2FzZSwgdGhlIG1vZHVsZSBjbGVhbnMgd2hhdGV2ZXIgaXQgd2FzIGRvaW5nIGFuZCBzdGFydHMgYWdhaW4gZnJvbSBzY3JhdGNoLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSwgeW91IHNob3VsZCBub3QgY2FsbCBpdCBtYW51YWxseS5cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgYmUgY2FsbGVkIHdoZW4gdGhlIG1vZHVsZSBoYXMgZmluaXNoZWQgaXRzIGluaXRpYWxpemF0aW9uICgqaS5lLiogd2hlbiB0aGUgbW9kdWxlIGhhcyBkb25lIGl0cyBkdXR5LCBvciB3aGVuIGl0IG1heSBydW4gaW4gdGhlIGJhY2tncm91bmQgZm9yIHRoZSByZXN0IG9mIHRoZSBzY2VuYXJpbyBhZnRlciBpdCBmaW5pc2hlZCBpdHMgaW5pdGlhbGl6YXRpb24gcHJvY2VzcyksIHRvIGFsbG93IHN1YnNlcXVlbnQgc3RlcHMgb2YgdGhlIHNjZW5hcmlvIHRvIHN0YXJ0LlxuICAgKlxuICAgKiBGb3IgaW5zdGFuY2UsIHRoZSB7QGxpbmsgTG9hZGVyfSBtb2R1bGUgY2FsbHMgaXRzIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kIHdoZW4gZmlsZXMgYXJlIGxvYWRlZCwgYW5kIHRoZSB7QGxpbmsgU3luY30gbW9kdWxlIGNhbGxzIGl0IHdoZW4gdGhlIGZpcnN0IHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIGlzIGZpbmlzaGVkICh3aGlsZSB0aGUgbW9kdWxlIGtlZXBzIHJ1bm5pbmcgaW4gdGhlIGJhY2tncm91bmQgYWZ0ZXJ3YXJkcykuXG4gICAqIEFzIGFuIGV4Y2VwdGlvbiwgdGhlIGxhc3QgbW9kdWxlIG9mIHRoZSBzY2VuYXJpbyAodXN1YWxseSB0aGUge0BsaW5rIFBlcmZvcm1hbmNlfSBtb2R1bGUpIG1heSBub3QgY2FsbCBpdHMge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2QuXG4gICAqXG4gICAqIElmIHRoZSBtb2R1bGUgaGFzIGEgYHZpZXdgLCB0aGUgYGRvbmVgIG1ldGhvZCByZW1vdmVzIGl0IGZyb20gdGhlIERPTS5cbiAgICpcbiAgICogKipOb3RlOioqIHlvdSBzaG91bGQgbm90IG92ZXJyaWRlIHRoaXMgbWV0aG9kLlxuICAgKi9cbiAgZG9uZSgpIHtcbiAgICB0aGlzLl9pc0RvbmUgPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMudmlldylcbiAgICAgIHRoaXMudmlldy5yZW1vdmUoKTtcblxuICAgIGlmICh0aGlzLnJlc29sdmVQcm9taXNlZClcbiAgICAgIHRoaXMucmVzb2x2ZVByb21pc2VkKCk7XG4gIH1cblxuICAvLyAvKipcbiAgLy8gICogU2V0IGFuIGFyYml0cmFyeSBjZW50ZXJlZCBIVE1MIGNvbnRlbnQgdG8gdGhlIG1vZHVsZSdzIGB2aWV3YCAoaWYgYW55KS5cbiAgLy8gICogQHBhcmFtIHtTdHJpbmd9IGh0bWxDb250ZW50IFRoZSBIVE1MIGNvbnRlbnQgdG8gYXBwZW5kIHRvIHRoZSBgdmlld2AuXG4gIC8vICAqL1xuICAvLyBzZXRDZW50ZXJlZFZpZXdDb250ZW50KGh0bWxDb250ZW50KSB7XG4gIC8vICAgaWYgKHRoaXMudmlldykge1xuICAvLyAgICAgaWYgKCF0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50KSB7XG4gIC8vICAgICAgIGxldCBjb250ZW50RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgLy8gICAgICAgY29udGVudERpdi5jbGFzc0xpc3QuYWRkKCdjZW50ZXJlZC1jb250ZW50Jyk7XG4gIC8vICAgICAgIHRoaXMudmlldy5hcHBlbmRDaGlsZChjb250ZW50RGl2KTtcblxuICAvLyAgICAgICB0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50ID0gY29udGVudERpdjtcbiAgLy8gICAgIH1cblxuICAvLyAgICAgaWYgKGh0bWxDb250ZW50KSB7XG4gIC8vICAgICAgIGlmIChodG1sQ29udGVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gIC8vICAgICAgICAgaWYgKHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQuZmlyc3RDaGlsZCkge1xuICAvLyAgICAgICAgICAgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudC5yZW1vdmVDaGlsZCh0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50LmZpcnN0Q2hpbGQpO1xuICAvLyAgICAgICAgIH1cblxuICAvLyAgICAgICAgIHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQuYXBwZW5kQ2hpbGQoaHRtbENvbnRlbnQpO1xuICAvLyAgICAgICB9IGVsc2Uge1xuICAvLyAgICAgICAgIC8vIGlzIGEgc3RyaW5nXG4gIC8vICAgICAgICAgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudC5pbm5lckhUTUwgPSBodG1sQ29udGVudDtcbiAgLy8gICAgICAgfVxuICAvLyAgICAgfVxuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8vIC8qKlxuICAvLyAgKiBSZW1vdmVzIHRoZSBjZW50ZXJlZCBIVE1MIGNvbnRlbnQgKHNldCBieSB7QGxpbmsgTW9kdWxlI3NldENlbnRlcmVkVmlld0NvbnRlbnR9KSBmcm9tIHRoZSBgdmlld2AuXG4gIC8vICAqL1xuICAvLyByZW1vdmVDZW50ZXJlZFZpZXdDb250ZW50KCkge1xuICAvLyAgIGlmICh0aGlzLnZpZXcgJiYgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudCkge1xuICAvLyAgICAgdGhpcy52aWV3LnJlbW92ZUNoaWxkKHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQpO1xuICAvLyAgICAgZGVsZXRlIHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQ7XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLyoqXG4gICAqIGB6LWluZGV4YCBDU1MgcHJvcGVydHkgb2YgdGhlIHZpZXcuXG4gICAqIEB0b2RvIC0gcHJlcGVuZCB3b3VsZCBkbyB0aGUgdHJpY2sgP1xuICAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgVmFsdWUgb2YgdGhlIGB6LWluZGV4YC5cbiAgICovXG4gIHNldCB6SW5kZXgodmFsdWUpIHtcbiAgICBpZiAodGhpcy52aWV3KSB7XG4gICAgICB0aGlzLnZpZXcuJGVsLnN0eWxlLnpJbmRleCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLm5hbWV9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29tbS5zZW5kKGAke3RoaXMubmFtZX06JHtjaGFubmVsfWAsIC4uLmFyZ3MpXG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyIHNpZGUgc29ja2V0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5uYW1lfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmRWb2xhdGlsZShjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29tbS5zZW5kVm9sYXRpbGUoYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YCwgLi4uYXJncylcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gYSBXZWJTb2NrZXQgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLm5hbWV9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNvbW0ucmVjZWl2ZShgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCBsaXN0ZW5pbmcgdG8gYSBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGNhbmNlbC5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY29tbS5yZW1vdmVMaXN0ZW5lcihgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuQ2xpZW50TW9kdWxlLnNlcXVlbnRpYWwgPSBmdW5jdGlvbiguLi5tb2R1bGVzKSB7XG4gIHJldHVybiBuZXcgU2VxdWVudGlhbChtb2R1bGVzKTtcbn07XG5cbkNsaWVudE1vZHVsZS5wYXJhbGxlbCA9IGZ1bmN0aW9uKC4uLm1vZHVsZXMpIHtcbiAgcmV0dXJuIG5ldyBQYXJhbGxlbChtb2R1bGVzKTtcbn07XG4iXX0=