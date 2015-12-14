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

    // // set z-index of parallel modules
    // let zIndex = modules.length;
    // for(let mod of modules) {
    //   mod.zIndex = zIndex;
    //   zIndex--;
    // }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50TW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQTZCLFFBQVE7O29CQUNwQixRQUFROzs7OzJCQUNSLGdCQUFnQjs7Ozs7Ozs7SUFLM0IsUUFBUTtZQUFSLFFBQVE7O0FBQ0QsV0FEUCxRQUFRLEdBQ0U7MEJBRFYsUUFBUTs7QUFFViwrQkFGRSxRQUFRLDZDQUVGOzs7Ozs7O0FBT1IsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7R0FDN0I7Ozs7OztlQVZHLFFBQVE7O1dBWUMseUJBQUc7OztBQUNkLGFBQU8sYUFBWSxVQUFDLE9BQU87ZUFBSyxNQUFLLGVBQWUsR0FBRyxPQUFPO09BQUEsQ0FBQyxDQUFDO0tBQ2pFOzs7V0FFSyxrQkFBRyxFQUVSOzs7U0FsQkcsUUFBUTs7O0lBd0JSLFVBQVU7WUFBVixVQUFVOztBQUNILFdBRFAsVUFBVSxDQUNGLE9BQU8sRUFBRTswQkFEakIsVUFBVTs7QUFFWiwrQkFGRSxVQUFVLDZDQUVKOztBQUVSLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0dBQ3hCOzs7Ozs7ZUFMRyxVQUFVOztXQU9ELHlCQUFHO0FBQ2QsVUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2YsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDOzs7Ozs7OztjQUVWLElBQUk7O0FBQ1gsY0FBSSxHQUFHLEtBQUssSUFBSSxFQUNkLE9BQU8sQ0FBQyxJQUFJLENBQUM7bUJBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRTtXQUFBLENBQUMsQ0FBQzs7QUFFcEMsYUFBRyxHQUFHLElBQUksQ0FBQztBQUNYLGlCQUFPLEdBQUcsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDOzs7QUFMaEMsMENBQWlCLElBQUksQ0FBQyxPQUFPLDRHQUFFOztTQU05Qjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7V0FFSyxrQkFBRztBQUNQLGFB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bUIsR0FBRyxJQUFJLENBQUM7S0FDbkQ7Ozs7Ozs7OztXQU8rQixtQ0FBQyxJQUFJLEVBQUU7QUFDckMsa0JBQVksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0tBQ2xEOzs7Ozs7OztXQU1zQiwwQkFBQyxHQUFHLEVBQUU7QUFDM0Isa0JBQVksQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztLQUN6Qzs7O1NBMUVrQixZQUFZO0dBQVMsUUFBUTs7cUJBQTdCLFlBQVk7O0FBMFRqQyxZQUFZLENBQUMsVUFBVSxHQUFHLFlBQXFCO3FDQUFULE9BQU87QUFBUCxXQUFPOzs7QUFDM0MsU0FBTyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUNoQyxDQUFDOztBQUVGLFlBQVksQ0FBQyxRQUFRLEdBQUcsWUFBcUI7cUNBQVQsT0FBTztBQUFQLFdBQU87OztBQUN6QyxTQUFPLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQzlCLENBQUMiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRNb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IGNvbW0gZnJvbSAnLi9jb21tJztcbmltcG9ydCBWaWV3IGZyb20gJy4vZGlzcGxheS9WaWV3JztcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBQcm9taXNlZCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgLyoqXG4gICAgICogW3Jlc29sdmVQcm9taXNlZCBkZXNjcmlwdGlvbl1cbiAgICAgKiBAdG9kbyBkZXNjcmlwdGlvblxuICAgICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucmVzb2x2ZVByb21pc2VkID0gbnVsbDtcbiAgfVxuXG4gIGNyZWF0ZVByb21pc2UoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB0aGlzLnJlc29sdmVQcm9taXNlZCA9IHJlc29sdmUpO1xuICB9XG5cbiAgbGF1bmNoKCkge1xuXG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBTZXF1ZW50aWFsIGV4dGVuZHMgUHJvbWlzZWQge1xuICBjb25zdHJ1Y3Rvcihtb2R1bGVzKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG4gIH1cblxuICBjcmVhdGVQcm9taXNlKCkge1xuICAgIGxldCBtb2QgPSBudWxsO1xuICAgIGxldCBwcm9taXNlID0gbnVsbDtcblxuICAgIGZvciAobGV0IG5leHQgb2YgdGhpcy5tb2R1bGVzKSB7XG4gICAgICBpZiAobW9kICE9PSBudWxsKVxuICAgICAgICBwcm9taXNlLnRoZW4oKCkgPT4gbmV4dC5sYXVuY2goKSk7XG5cbiAgICAgIG1vZCA9IG5leHQ7XG4gICAgICBwcm9taXNlID0gbW9kLmNyZWF0ZVByb21pc2UoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGxhdW5jaCgpIHtcbiAgICByZXR1cm4gdGhpcy5tb2R1bGVzWzBdLmxhdW5jaCgpO1xuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgUGFyYWxsZWwgZXh0ZW5kcyBQcm9taXNlZCB7XG4gIGNvbnN0cnVjdG9yKG1vZHVsZXMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5tb2R1bGVzID0gbW9kdWxlcztcblxuICAgIC8vIC8vIHNldCB6LWluZGV4IG9mIHBhcmFsbGVsIG1vZHVsZXNcbiAgICAvLyBsZXQgekluZGV4ID0gbW9kdWxlcy5sZW5ndGg7XG4gICAgLy8gZm9yKGxldCBtb2Qgb2YgbW9kdWxlcykge1xuICAgIC8vICAgbW9kLnpJbmRleCA9IHpJbmRleDtcbiAgICAvLyAgIHpJbmRleC0tO1xuICAgIC8vIH1cbiAgfVxuXG4gIHNob3dOZXh0KGZyb21JbmRleCkge1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubW9kdWxlcy5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBtb2QgPSB0aGlzLm1vZHVsZXNbaV07XG4gICAgICBjb25zdCBpc1Zpc2libGUgPSBtb2Quc2hvdygpO1xuICAgICAgaWYgKGlzVmlzaWJsZSkgeyBicmVhazsgfVxuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZVByb21pc2UoKSB7XG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcblxuICAgIHRoaXMubW9kdWxlcy5mb3JFYWNoKChtb2QsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBwcm9taXNlID0gbW9kLmNyZWF0ZVByb21pc2UoKTtcbiAgICAgIC8vIGhpZGUgYWxsIG1vZHVsZXMgZXhjZXB0IHRoZSBmaXJzdCBvbmVcbiAgICAgIG1vZC5oaWRlKCk7XG4gICAgICBwcm9taXNlLnRoZW4oKCkgPT4geyB0aGlzLnNob3dOZXh0KCk7IH0pO1xuICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc2hvd05leHQoKTtcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gIH1cblxuICBsYXVuY2goKSB7XG4gICAgZm9yKGxldCBtb2Qgb2YgdGhpcy5tb2R1bGVzKVxuICAgICAgbW9kLmxhdW5jaCgpO1xuICB9XG59XG5cbi8qKlxuICogW2NsaWVudF0gQmFzZSBjbGFzcyB1c2VkIHRvIGNyZWF0ZSBhbnkgKlNvdW5kd29ya3MqIG1vZHVsZSBvbiB0aGUgY2xpZW50IHNpZGUuXG4gKlxuICogRWFjaCBtb2R1bGUgc2hvdWxkIGhhdmUgYSB7QGxpbmsgTW9kdWxlI3N0YXJ0fSwgYSB7QGxpbmsgTW9kdWxlI3Jlc2V0fSwgYSB7QGxpbmsgTW9kdWxlI3Jlc3RhcnR9IGFuZCBhIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kcy5cbiAqXG4gKiBUaGUgYmFzZSBjbGFzcyBvcHRpb25hbGx5IGNyZWF0ZXMgYSB2aWV3IChhIGZ1bGxzY3JlZW4gYGRpdmAgYWNjZXNzaWJsZSB0aHJvdWdoIHRoZSB7QGxpbmsgTW9kdWxlLnZpZXd9IGF0dHJpYnV0ZSkuXG4gKiBUaGUgdmlldyBpcyBhZGRlZCB0byB0aGUgRE9NIChhcyBhIGNoaWxkIG9mIHRoZSBgI2NvbnRhaW5lcmAgZWxlbWVudCkgd2hlbiB0aGUgbW9kdWxlIGlzIHN0YXJ0ZWQgKHdpdGggdGhlIHtAbGluayBNb2R1bGUjc3RhcnR9IG1ldGhvZCksIGFuZCByZW1vdmVkIHdoZW4gdGhlIG1vZHVsZSBjYWxscyBpdHMge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2QuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL01vZHVsZS5qc35Nb2R1bGV9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogKipOb3RlOioqIGEgbW9yZSBjb21wbGV0ZSBleGFtcGxlIG9mIGhvdyB0byB3cml0ZSBhIG1vZHVsZSBpcyBpbiB0aGUgW0V4YW1wbGVdKG1hbnVhbC9leGFtcGxlLmh0bWwpIHNlY3Rpb24uXG4gKlxuICogQGV4YW1wbGUgY2xhc3MgTXlNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICogICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAqICAgICAvLyBUaGlzIGV4YW1wbGUgbW9kdWxlOlxuICogICAgIC8vIC0gYWx3YXlzIGhhcyBhIHZpZXdcbiAqICAgICAvLyAtIGhhcyB0aGUgaWQgYW5kIGNsYXNzICdteS1tb2R1bGUtbmFtZSdcbiAqICAgICAvLyAtIGFuZCB1c2VzIHRoZSBiYWNrZ3JvdW5kIGNvbG9yIGRlZmluZWQgaW4gdGhlIGFyZ3VtZW50ICdvcHRpb25zJyAoaWYgYW55KS5cbiAqICAgICBzdXBlcignbXktbW9kdWxlLW5hbWUnLCB0cnVlLCBvcHRpb25zLmNvbG9yIHx8ICdhbGl6YXJpbicpO1xuICpcbiAqICAgICAuLi4gLy8gYW55dGhpbmcgdGhlIGNvbnN0cnVjdG9yIG5lZWRzXG4gKiAgIH1cbiAqXG4gKiAgIHN0YXJ0KCkge1xuICogICAgIHN1cGVyLnN0YXJ0KCk7XG4gKlxuICogICAgIC8vIFdoYXRldmVyIHRoZSBtb2R1bGUgZG9lcyAoY29tbXVuaWNhdGlvbiB3aXRoIHRoZSBzZXJ2ZXIsIGV0Yy4pXG4gKiAgICAgLy8gLi4uXG4gKlxuICogICAgIC8vIENhbGwgdGhlIGBkb25lYCBtZXRob2Qgd2hlbiB0aGUgbW9kdWxlIGhhcyBmaW5pc2hlZCBpdHMgaW5pdGlhbGl6YXRpb25cbiAqICAgICB0aGlzLmRvbmUoKTtcbiAqICAgfVxuICogfVxuICogQHRvZG8gTW92ZSBleGFtcGxlIGluIHRoZSBtYW51YWw/XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudE1vZHVsZSBleHRlbmRzIFByb21pc2VkIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIG1vZHVsZSAodXNlZCBhcyB0aGUgYGlkYCBhbmQgQ1NTIGNsYXNzIG9mIHRoZSBgdmlld2AgRE9NIGVsZW1lbnQgaWYgaXQgZXhpc3RzKS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbY3JlYXRlVmlldz10cnVlXSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgbW9kdWxlIGRpc3BsYXlzIGEgYHZpZXdgIG9yIG5vdC5cbiAgICogQHBhcmFtIHtbdHlwZV19IFtjb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2Agd2hlbiBpdCBleGlzdHMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihuYW1lLCBvcHRpb25zID0ge30pIHsgLy8gVE9ETzogY2hhbmdlIHRvIGNvbG9yQ2xhc3M/XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX2J5cGFzcyA9IG9wdGlvbnMuYnlwYXNzIHx8wqBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG5cbiAgICAvKipcbiAgICAgKiBWaWV3IG9mIHRoZSBtb2R1bGUuXG4gICAgICogQHR5cGUge1ZpZXd9XG4gICAgICovXG4gICAgdGhpcy52aWV3ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50cyB0byBiaW5kIHRvIHRoZSB2aWV3LiAoY2YuIEJhY2tib25lJ3Mgc3ludGF4KS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnRzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBZGRpdGlvbm5hbCBvcHRpb25zIHRvIHBhc3MgdG8gdGhlIHZpZXcuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnZpZXdPcHRpb25zID0gb3B0aW9ucy52aWV3T3B0aW9ucyB8fMKge307XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGEgdmlldyBjb25zdHJ1Y3RvciB0byBiZSB1c2VkIGluIGNyZWF0ZURlZmF1bHRWaWV3XG4gICAgICogQHR5cGUge1ZpZXd9XG4gICAgICovXG4gICAgdGhpcy52aWV3Q3RvciA9IG9wdGlvbnMudmlld0N0b3IgfHwgVmlldztcblxuICAgIC8qKiBAcHJpdmF0ZSAqL1xuICAgIHRoaXMuX3RlbXBsYXRlID0gbnVsbDtcblxuICAgIC8vIGJpbmQgY29tIG1ldGhvZHMgdG8gdGhlIGluc3RhbmNlLlxuICAgIHRoaXMuc2VuZCA9IHRoaXMuc2VuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVjZWl2ZSA9IHRoaXMucmVjZWl2ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIgPSB0aGlzLnJlbW92ZUxpc3RlbmVyLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU2hhcmUgdGhlIGRlZmluZWQgdGVtcGxhdGVzIHdpdGggYWxsIGBDbGllbnRNb2R1bGVgIGluc3RhbmNlcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRlZnMgLSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgdGVtcGxhdGVzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhdGljIHNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZnMpIHtcbiAgICBDbGllbnRNb2R1bGUucHJvdG90eXBlLnRlbXBsYXRlRGVmaW5pdGlvbnMgPSBkZWZzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNoYXJlIHRoZSB0ZXh0IGNvbnRlbnQgY29uZmlndXJhdGlvbiAobmFtZSBhbmQgZGF0YSkgd2l0aCBhbGwgdGhlIGBDbGllbnRNb2R1bGVgIGluc3RhbmNlc1xuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmcyAtIFRoZSB0ZXh0IGNvbnRlbnRzIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXRpYyBzZXRWaWV3Q29udGVudERlZmluaXRpb25zKGRlZnMpIHtcbiAgICBDbGllbnRNb2R1bGUucHJvdG90eXBlLmNvbnRlbnREZWZpbml0aW9ucyA9IGRlZnM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgY29udGFpbmVyIG9mIHRoZSB2aWV3cyBmb3IgYWxsIGBDbGllbnRNb2R1bGVgIGluc3RhbmNlcy5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgZWxlbWVudCB0byB1c2UgYXMgYSBjb250YWluZXIgZm9yIHRoZSBtb2R1bGUncyB2aWV3LlxuICAgKi9cbiAgc3RhdGljIHNldFZpZXdDb250YWluZXIoJGVsKSB7XG4gICAgQ2xpZW50TW9kdWxlLnByb3RvdHlwZS4kY29udGFpbmVyID0gJGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRlbXBsYXRlIGFzc29jaWF0ZWQgdG8gdGhlIGN1cnJlbnQgbW9kdWxlLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IC0gVGhlIHRlbXBsYXRlIHJlbGF0ZWQgdG8gdGhlIGBuYW1lYCBvZiB0aGUgY3VycmVudCBtb2R1bGUuXG4gICAqL1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLl90ZW1wbGF0ZSB8fMKgdGhpcy50ZW1wbGF0ZURlZmluaXRpb25zW3RoaXMubmFtZV07XG4gICAgLy8gaWYgKCF0ZW1wbGF0ZSlcbiAgICAvLyAgIHRocm93IG5ldyBFcnJvcihgTm8gdGVtcGxhdGUgZGVmaW5lZCBmb3IgbW9kdWxlIFwiJHt0aGlzLm5hbWV9XCJgKTtcbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH1cblxuICBzZXQgdGVtcGxhdGUodG1wbCkge1xuICAgIHRoaXMuX3RlbXBsYXRlID0gdG1wbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0ZXh0IGFzc29jaWF0ZWQgdG8gdGhlIGN1cnJlbnQgbW9kdWxlLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSAtIFRoZSB0ZXh0IGNvbnRlbnRzIHJlbGF0ZWQgdG8gdGhlIGBuYW1lYCBvZiB0aGUgY3VycmVudCBtb2R1bGUuIFRoZSByZXR1cm5lZCBvYmplY3QgaXMgZXh0ZW5kZWQgd2l0aCBhIHBvaW50ZXIgdG8gdGhlIGBfZ2xvYmFsc2AgZW50cnkgb2YgdGhlIGRlZmluZWQgdGV4dCBjb250ZW50cy5cbiAgICovXG4gIGdldCBjb250ZW50KCkge1xuICAgIGNvbnN0IHRleHRzID0gdGhpcy5fY29udGVudCB8fMKgdGhpcy5jb250ZW50RGVmaW5pdGlvbnNbdGhpcy5uYW1lXTtcbiAgICBpZiAoIXRleHRzKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyB0ZXh0IGNvbnRlbnRzIGRlZmluZWQgZm9yIG1vZHVsZSBcIiR7dGhpcy5uYW1lfVwiYCk7XG5cbiAgICB0ZXh0cy5fZ2xvYmFscyA9IHRoaXMuY29udGVudERlZmluaXRpb25zLl9nbG9iYWxzO1xuICAgIHJldHVybiB0ZXh0cztcbiAgfVxuXG4gIHNldCBjb250ZW50KG9iaikge1xuICAgIHRoaXMuX2NvbnRlbnQgPSBvYmo7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZGVmYXVsdCB2aWV3IGZyb20gbW9kdWxlIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBjcmVhdGVEZWZhdWx0VmlldygpIHtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGlkOiB0aGlzLm5hbWUsIGNsYXNzTmFtZTogJ21vZHVsZScgfSwgdGhpcy52aWV3T3B0aW9ucyk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLnZpZXdDdG9yKHRoaXMudGVtcGxhdGUsIHRoaXMuY29udGVudCwgdGhpcy5ldmVudHMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBsYXVuY2goKSB7XG4gICAgaWYgKHRoaXMuX2lzRG9uZSkge1xuICAgICAgdGhpcy5yZXN0YXJ0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLl9pc1N0YXJ0ZWQpXG4gICAgICAgIHRoaXMucmVzZXQoKTtcblxuICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgdGhlIGxvZ2ljIGFuZCBzdGVwcyB0aGF0IGxlYWQgdG8gdGhlIGluaXRpYWxpemF0aW9uIG9mIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEZvciBpbnN0YW5jZSwgaXQgdGFrZXMgY2FyZSBvZiB0aGUgY29tbXVuaWNhdGlvbiB3aXRoIHRoZSBtb2R1bGUgb24gdGhlIHNlcnZlciBzaWRlIGJ5IHNlbmRpbmcgV2ViU29ja2V0IG1lc3NhZ2VzIGFuZCBzZXR0aW5nIHVwIFdlYlNvY2tldCBtZXNzYWdlIGxpc3RlbmVycy5cbiAgICpcbiAgICogQWRkaXRpb25hbGx5LCBpZiB0aGUgbW9kdWxlIGhhcyBhIGB2aWV3YCwgdGhlIGBzdGFydGAgbWV0aG9kIGNyZWF0ZXMgdGhlIGNvcnJlc3BvbmRpbmcgSFRNTCBlbGVtZW50IGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBET03igJlzIG1haW4gY29udGFpbmVyIGVsZW1lbnQgKGBkaXYjY29udGFpbmVyYCkuXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gbmVjZXNzYXJ5LCB5b3Ugc2hvdWxkIG5vdCBjYWxsIGl0IG1hbnVhbGx5LlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIC8vIGFsbG93IHRvIGJ5cGFzcyBhIG1vZHVsZSBmcm9tIGl0cyBvcHRpb25zXG4gICAgaWYgKHRoaXMuX2J5cGFzcykgeyB0aGlzLmRvbmUoKTsgfVxuXG4gICAgaWYgKCF0aGlzLl9pc1N0YXJ0ZWQpIHtcbiAgICAgIGlmICh0aGlzLnZpZXcpIHtcbiAgICAgICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICAgICAgICB0aGlzLnZpZXcuYXBwZW5kVG8odGhpcy4kY29udGFpbmVyKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5faXNTdGFydGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydCB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBUaGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gYSBsb3N0IGNvbm5lY3Rpb24gd2l0aCB0aGUgc2VydmVyIGlzIHJlc3VtZWQgKGZvciBpbnN0YW5jZSBiZWNhdXNlIG9mIGEgc2VydmVyIGNyYXNoKSwgaWYgdGhlIG1vZHVsZSBoYWQgYWxyZWFkeSBmaW5pc2hlZCBpdHMgaW5pdGlhbGl6YXRpb24gKCppLmUuKiBpZiBpdCBoYWQgY2FsbGVkIGl0cyB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZCkuXG4gICAqIFRoZSBtZXRob2Qgc2hvdWxkIHNlbmQgdG8gdGhlIHNlcnZlciB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiAoSW5kZWVkLCBpZiB0aGUgc2VydmVyIGNyYXNoZXMsIGl0IHdpbGwgcmVzZXQgYWxsIHRoZSBpbmZvcm1hdGlvbiBpdCBoYXMgYWJvdXQgYWxsIHRoZSBjbGllbnRzLlxuICAgKiBPbiB0aGUgY2xpZW50IHNpZGUsIHRoZSBtb2R1bGVzIHRoYXQgaGFkIGZpbmlzaGVkIHRoZWlyIGluaXRpYWxpemF0aW9uIHByb2Nlc3Mgc2hvdWxkIHNlbmQgdGhlaXIgc3RhdGUgdG8gdGhlIHNlcnZlciBzbyB0aGF0IGl0IGNhbiBiZSB1cCB0byBkYXRlIHdpdGggdGhlIHJlYWwgc3RhdGUgb2YgdGhlIHNjZW5hcmlvLilcbiAgICpcbiAgICogRm9yIGluc3RhbmNlLCB0aGlzIG1ldGhvZCBpbiB0aGUge0BsaW5rIExvY2F0b3J9IG1vZHVsZSBzZW5kcyB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIGNsaWVudCB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSwgeW91IHNob3VsZCBub3QgY2FsbCBpdCBtYW51YWxseS5cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHRoaXMuX2lzRG9uZSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBtb2R1bGUgdG8gdGhlIHN0YXRlIGl0IGhhZCBiZWZvcmUgY2FsbGluZyB0aGUge0BsaW5rIE1vZHVsZSNzdGFydH0gbWV0aG9kLlxuICAgKlxuICAgKiBUaGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gYSBsb3N0IGNvbm5lY3Rpb24gd2l0aCB0aGUgc2VydmVyIGlzIHJlc3VtZWQgKGZvciBpbnN0YW5jZSBiZWNhdXNlIG9mIGEgc2VydmVyIGNyYXNoKSwgaWYgdGhlIG1vZHVsZSBoYWQgbm90IGZpbmlzaGVkIGl0cyBpbml0aWFsaXphdGlvbiAoKmkuZS4qIGlmIGl0IGhhZCBub3QgY2FsbGVkIGl0cyB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZCkuXG4gICAqIEluIHRoYXQgY2FzZSwgdGhlIG1vZHVsZSBjbGVhbnMgd2hhdGV2ZXIgaXQgd2FzIGRvaW5nIGFuZCBzdGFydHMgYWdhaW4gZnJvbSBzY3JhdGNoLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSwgeW91IHNob3VsZCBub3QgY2FsbCBpdCBtYW51YWxseS5cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICByZXNldCgpIHtcbiAgICBpZiAodGhpcy52aWV3KSB7XG4gICAgICB0aGlzLnZpZXcucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgLy8gdGhpcy5pbml0KCk7XG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIGJlIGNhbGxlZCB3aGVuIHRoZSBtb2R1bGUgaGFzIGZpbmlzaGVkIGl0cyBpbml0aWFsaXphdGlvbiAoKmkuZS4qIHdoZW4gdGhlIG1vZHVsZSBoYXMgZG9uZSBpdHMgZHV0eSwgb3Igd2hlbiBpdCBtYXkgcnVuIGluIHRoZSBiYWNrZ3JvdW5kIGZvciB0aGUgcmVzdCBvZiB0aGUgc2NlbmFyaW8gYWZ0ZXIgaXQgZmluaXNoZWQgaXRzIGluaXRpYWxpemF0aW9uIHByb2Nlc3MpLCB0byBhbGxvdyBzdWJzZXF1ZW50IHN0ZXBzIG9mIHRoZSBzY2VuYXJpbyB0byBzdGFydC5cbiAgICpcbiAgICogRm9yIGluc3RhbmNlLCB0aGUge0BsaW5rIExvYWRlcn0gbW9kdWxlIGNhbGxzIGl0cyB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZCB3aGVuIGZpbGVzIGFyZSBsb2FkZWQsIGFuZCB0aGUge0BsaW5rIFN5bmN9IG1vZHVsZSBjYWxscyBpdCB3aGVuIHRoZSBmaXJzdCBzeW5jaHJvbml6YXRpb24gcHJvY2VzcyBpcyBmaW5pc2hlZCAod2hpbGUgdGhlIG1vZHVsZSBrZWVwcyBydW5uaW5nIGluIHRoZSBiYWNrZ3JvdW5kIGFmdGVyd2FyZHMpLlxuICAgKiBBcyBhbiBleGNlcHRpb24sIHRoZSBsYXN0IG1vZHVsZSBvZiB0aGUgc2NlbmFyaW8gKHVzdWFsbHkgdGhlIHtAbGluayBQZXJmb3JtYW5jZX0gbW9kdWxlKSBtYXkgbm90IGNhbGwgaXRzIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kLlxuICAgKlxuICAgKiBJZiB0aGUgbW9kdWxlIGhhcyBhIGB2aWV3YCwgdGhlIGBkb25lYCBtZXRob2QgcmVtb3ZlcyBpdCBmcm9tIHRoZSBET00uXG4gICAqXG4gICAqICoqTm90ZToqKiB5b3Ugc2hvdWxkIG5vdCBvdmVycmlkZSB0aGlzIG1ldGhvZC5cbiAgICovXG4gIGRvbmUoKSB7XG4gICAgdGhpcy5faXNEb25lID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLnZpZXcpXG4gICAgICB0aGlzLnZpZXcucmVtb3ZlKCk7XG5cbiAgICBpZiAodGhpcy5yZXNvbHZlUHJvbWlzZWQpXG4gICAgICB0aGlzLnJlc29sdmVQcm9taXNlZCgpO1xuICB9XG5cbiAgLy8gLyoqXG4gIC8vICAqIFNldCBhbiBhcmJpdHJhcnkgY2VudGVyZWQgSFRNTCBjb250ZW50IHRvIHRoZSBtb2R1bGUncyBgdmlld2AgKGlmIGFueSkuXG4gIC8vICAqIEBwYXJhbSB7U3RyaW5nfSBodG1sQ29udGVudCBUaGUgSFRNTCBjb250ZW50IHRvIGFwcGVuZCB0byB0aGUgYHZpZXdgLlxuICAvLyAgKi9cbiAgLy8gc2V0Q2VudGVyZWRWaWV3Q29udGVudChodG1sQ29udGVudCkge1xuICAvLyAgIGlmICh0aGlzLnZpZXcpIHtcbiAgLy8gICAgIGlmICghdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudCkge1xuICAvLyAgICAgICBsZXQgY29udGVudERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gIC8vICAgICAgIGNvbnRlbnREaXYuY2xhc3NMaXN0LmFkZCgnY2VudGVyZWQtY29udGVudCcpO1xuICAvLyAgICAgICB0aGlzLnZpZXcuYXBwZW5kQ2hpbGQoY29udGVudERpdik7XG5cbiAgLy8gICAgICAgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudCA9IGNvbnRlbnREaXY7XG4gIC8vICAgICB9XG5cbiAgLy8gICAgIGlmIChodG1sQ29udGVudCkge1xuICAvLyAgICAgICBpZiAoaHRtbENvbnRlbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAvLyAgICAgICAgIGlmICh0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50LmZpcnN0Q2hpbGQpIHtcbiAgLy8gICAgICAgICAgIHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQucmVtb3ZlQ2hpbGQodGhpcy5fY2VudGVyZWRWaWV3Q29udGVudC5maXJzdENoaWxkKTtcbiAgLy8gICAgICAgICB9XG5cbiAgLy8gICAgICAgICB0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50LmFwcGVuZENoaWxkKGh0bWxDb250ZW50KTtcbiAgLy8gICAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgICAvLyBpcyBhIHN0cmluZ1xuICAvLyAgICAgICAgIHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQuaW5uZXJIVE1MID0gaHRtbENvbnRlbnQ7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH1cbiAgLy8gICB9XG4gIC8vIH1cblxuICAvLyAvKipcbiAgLy8gICogUmVtb3ZlcyB0aGUgY2VudGVyZWQgSFRNTCBjb250ZW50IChzZXQgYnkge0BsaW5rIE1vZHVsZSNzZXRDZW50ZXJlZFZpZXdDb250ZW50fSkgZnJvbSB0aGUgYHZpZXdgLlxuICAvLyAgKi9cbiAgLy8gcmVtb3ZlQ2VudGVyZWRWaWV3Q29udGVudCgpIHtcbiAgLy8gICBpZiAodGhpcy52aWV3ICYmIHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQpIHtcbiAgLy8gICAgIHRoaXMudmlldy5yZW1vdmVDaGlsZCh0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50KTtcbiAgLy8gICAgIGRlbGV0ZSB0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50O1xuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8qKlxuICAgKiBgei1pbmRleGAgQ1NTIHByb3BlcnR5IG9mIHRoZSB2aWV3LlxuICAgKiBAdG9kbyAtIHByZXBlbmQgd291bGQgZG8gdGhlIHRyaWNrID9cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIFZhbHVlIG9mIHRoZSBgei1pbmRleGAuXG4gICAqL1xuICBzZXQgekluZGV4KHZhbHVlKSB7XG4gICAgaWYgKHRoaXMudmlldykge1xuICAgICAgdGhpcy52aWV3LiRlbC5zdHlsZS56SW5kZXggPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBzaG93KCkge1xuICAgIGlmICh0aGlzLnZpZXcgJiYgIXRoaXMuX2lzRG9uZSkge1xuICAgICAgaWYgKCF0aGlzLnZpZXcuaXNWaXNpYmxlKSB7XG4gICAgICAgIHRoaXMudmlldy5zaG93KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgaWYgKHRoaXMudmlldyAmJiAhdGhpcy5fZG9uZSkgeyB0aGlzLnZpZXcuaGlkZSgpOyB9XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyIHNpZGUgc29ja2V0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5uYW1lfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbW0uc2VuZChgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gLCAuLi5hcmdzKVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIHNvY2tldC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kVm9sYXRpbGUoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbW0uc2VuZFZvbGF0aWxlKGAke3RoaXMubmFtZX06JHtjaGFubmVsfWAsIC4uLmFyZ3MpXG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5uYW1lfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb21tLnJlY2VpdmUoYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YCwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgbGlzdGVuaW5nIHRvIGEgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLm5hbWV9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBjYW5jZWwuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNvbW0ucmVtb3ZlTGlzdGVuZXIoYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YCwgY2FsbGJhY2spO1xuICB9XG59XG5cbkNsaWVudE1vZHVsZS5zZXF1ZW50aWFsID0gZnVuY3Rpb24oLi4ubW9kdWxlcykge1xuICByZXR1cm4gbmV3IFNlcXVlbnRpYWwobW9kdWxlcyk7XG59O1xuXG5DbGllbnRNb2R1bGUucGFyYWxsZWwgPSBmdW5jdGlvbiguLi5tb2R1bGVzKSB7XG4gIHJldHVybiBuZXcgUGFyYWxsZWwobW9kdWxlcyk7XG59O1xuIl19