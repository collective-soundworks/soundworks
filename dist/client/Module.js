'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var EventEmitter = require('events').EventEmitter;
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
})(EventEmitter);

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
   * The {@link ClientModule} base class is used to create a *Soundworks* module on the client side.
   * Each module should have a {@link ClientModule#start} and a {@link ClientModule#done} method.
   * The {@link ClientModule#done} method must be called when the module can hand over the control to the subsequent modules (*i.e.* when the module has done its duty, or when it may run in the background for the rest of the scenario after it finished its initialization process).
   * The base class optionally creates a view — a fullscreen `div` accessible through the {@link ClientModule.view} attribute — that is added to the DOM when the module is started and removed when the module calls its {@link ClientModule#done} method.
   * (Specifically, the `view` element is added to the `#container` DOM element.)
   *
   * @example
   * class MyModule extends ClientModule {
   *   constructor(options = {}) {
   *     // Here, MyModule would always have a view,
   *     // with the id and class 'my-module-name',
   *     // and possibly the background color
   *     // defined by the argument 'options'.
   *     super('my-module-name', true, options.color || 'alizarin');
   *
   *     ... // anything the constructor needs
   *   }
   *
   *   start() {
   *     super.start();
   *
   *     ... // what the module has to do
   *         // (communication with the server, etc.)
   *
   *     this.done(); // call this method when the module can
   *                  // hand over the control to a subsequent module
   *   }
   * }
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

  // export default class ClientModule extends Promised {
  /**
   * Creates an instance of the class.
   * @param {String} name Name of the module (used as the `id` and CSS class of the `view` if it exists).
   * @param {Boolean} [createView=true] Indicates whether the module has and displays a `view` or not.
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
     * The view is a DOM element (a full screen `div`) in which the content of the module is displayed.
     * This element is a child of the main container `div#container`, which is the only child of the `body` element.
     * A module may or may not have a view, as indicated by the argument `hasView:Boolean` of the {@link ClientModule#constructor}.
     * When that is the case, the view is created and added to the DOM when the {@link ClientModule#start} method is called, and is removed from the DOM when the {@link ClientModule#done} method is called.
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
  }

  /**
   * Handles the logic of the module on the client side.
   * For instance, it takes care of the communication with the module on the server side by sending WebSocket messages and setting up WebSocket message listeners.
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
     * Resets the module to the state it had before calling the {@link ClientModule#start} method.
     *
     * **Note:** the method is called automatically when necessary (for instance to reset the module after a server crash if the module had not called its {@link ClientModule#done} method yet), you should not call it manually.
     * @abstract
     */
  }, {
    key: 'reset',
    value: function reset() {
      this._isStarted = false;
    }

    /**
     * Restarts the module.
     *
     * **Note:** the method is called automatically when necessary (for instance to restart the module after a server crash if the module had already called its {@link ClientModule#done} method), you should not call it manually.
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
     * Should be called when the module can hand over the control to a subsequent module (for instance at the end of the `start` method you write).
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
     * Set an arbitrary centered HTML content to the module's `view`.
     * The method should be called only if the module has a `view`.
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
     * Removes the centered HTML content (set by {@link ClientModule#setCenteredViewContent}) from the `view`.
     */
  }, {
    key: 'removeCenteredViewContent',
    value: function removeCenteredViewContent() {
      if (this.view && this._centeredViewContent) {
        this.view.removeChild(this._centeredViewContent);
        delete this._centeredViewContent;
      }
    }
  }, {
    key: 'zIndex',
    set: function set(value) {
      if (this.view) this.view.style.zIndex = value;
    }
  }]);

  return ClientModule;
})(Promised);

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

module.exports = ClientModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvTW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUFFYixJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDO0FBQ3BELElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLEtBQUssTUFBTSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFBLEFBQUMsQ0FBQzs7Ozs7O0lBSzFGLFFBQVE7WUFBUixRQUFROztBQUNELFdBRFAsUUFBUSxHQUNFOzBCQURWLFFBQVE7O0FBRVYsK0JBRkUsUUFBUSw2Q0FFRjs7Ozs7OztBQU9SLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0dBQzdCOzs7Ozs7ZUFWRyxRQUFROztXQVlDLHlCQUFHOzs7QUFDZCxhQUFPLGFBQVksVUFBQyxPQUFPO2VBQUssTUFBSyxlQUFlLEdBQUcsT0FBTztPQUFBLENBQUMsQ0FBQztLQUNqRTs7O1dBRUssa0JBQUcsRUFFUjs7O1NBbEJHLFFBQVE7R0FBUyxZQUFZOztJQXdCN0IsVUFBVTtZQUFWLFVBQVU7O0FBQ0gsV0FEUCxVQUFVLENBQ0YsT0FBTyxFQUFFOzBCQURqQixVQUFVOztBQUVaLCtCQUZFLFVBQVUsNkNBRUo7O0FBRVIsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7R0FDeEI7Ozs7OztlQUxHLFVBQVU7O1dBT0QseUJBQUc7QUFDZCxVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDZixVQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7Ozs7Ozs7O2NBRVgsSUFBSTs7QUFDVixjQUFHLEdBQUcsS0FBSyxJQUFJLEVBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQzttQkFBTSxJQUFJLENBQUMsTUFBTSxFQUFFO1dBQUEsQ0FBQyxDQUFDOztBQUVwQyxhQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ1gsaUJBQU8sR0FBRyxH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Iid1c2Ugc3RyaWN0JztcblxuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xuY29uc3QgY29udGFpbmVyID0gd2luZG93LmNvbnRhaW5lciB8fCAod2luZG93LmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKSk7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgUHJvbWlzZWQgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIC8qKlxuICAgICAqIFtyZXNvbHZlUHJvbWlzZWQgZGVzY3JpcHRpb25dXG4gICAgICogQHRvZG8gZGVzY3JpcHRpb25cbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnJlc29sdmVQcm9taXNlZCA9IG51bGw7XG4gIH1cblxuICBjcmVhdGVQcm9taXNlKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gdGhpcy5yZXNvbHZlUHJvbWlzZWQgPSByZXNvbHZlKTtcbiAgfVxuXG4gIGxhdW5jaCgpIHtcblxuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgU2VxdWVudGlhbCBleHRlbmRzIFByb21pc2VkIHtcbiAgY29uc3RydWN0b3IobW9kdWxlcykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm1vZHVsZXMgPSBtb2R1bGVzO1xuICB9XG5cbiAgY3JlYXRlUHJvbWlzZSgpIHtcbiAgICBsZXQgbW9kID0gbnVsbDtcbiAgICBsZXQgcHJvbWlzZSA9IG51bGw7XG5cbiAgICBmb3IobGV0IG5leHQgb2YgdGhpcy5tb2R1bGVzKSB7XG4gICAgICBpZihtb2QgIT09IG51bGwpXG4gICAgICAgIHByb21pc2UudGhlbigoKSA9PiBuZXh0LmxhdW5jaCgpKTtcblxuICAgICAgbW9kID0gbmV4dDtcbiAgICAgIHByb21pc2UgPSBtb2QuY3JlYXRlUHJvbWlzZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgbGF1bmNoKCkge1xuICAgIHJldHVybiB0aGlzLm1vZHVsZXNbMF0ubGF1bmNoKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBQYXJhbGxlbCBleHRlbmRzIFByb21pc2VkIHtcbiAgY29uc3RydWN0b3IobW9kdWxlcykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm1vZHVsZXMgPSBtb2R1bGVzO1xuXG4gICAgLy8gc2V0IHotaW5kZXggb2YgcGFyYWxsZWwgbW9kdWxlc1xuICAgIGxldCB6SW5kZXggPSBtb2R1bGVzLmxlbmd0aDtcbiAgICBmb3IobGV0IG1vZCBvZiBtb2R1bGVzKSB7XG4gICAgICBtb2QuekluZGV4ID0gekluZGV4O1xuICAgICAgekluZGV4LS07XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlUHJvbWlzZSgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwodGhpcy5tb2R1bGVzLm1hcCgobW9kKSA9PiBtb2QuY3JlYXRlUHJvbWlzZSgpKSk7XG4gIH1cblxuICBsYXVuY2goKSB7XG4gICAgZm9yKGxldCBtb2Qgb2YgdGhpcy5tb2R1bGVzKVxuICAgICAgbW9kLmxhdW5jaCgpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIHtAbGluayBDbGllbnRNb2R1bGV9IGJhc2UgY2xhc3MgaXMgdXNlZCB0byBjcmVhdGUgYSAqU291bmR3b3JrcyogbW9kdWxlIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAqIEVhY2ggbW9kdWxlIHNob3VsZCBoYXZlIGEge0BsaW5rIENsaWVudE1vZHVsZSNzdGFydH0gYW5kIGEge0BsaW5rIENsaWVudE1vZHVsZSNkb25lfSBtZXRob2QuXG4gKiBUaGUge0BsaW5rIENsaWVudE1vZHVsZSNkb25lfSBtZXRob2QgbXVzdCBiZSBjYWxsZWQgd2hlbiB0aGUgbW9kdWxlIGNhbiBoYW5kIG92ZXIgdGhlIGNvbnRyb2wgdG8gdGhlIHN1YnNlcXVlbnQgbW9kdWxlcyAoKmkuZS4qIHdoZW4gdGhlIG1vZHVsZSBoYXMgZG9uZSBpdHMgZHV0eSwgb3Igd2hlbiBpdCBtYXkgcnVuIGluIHRoZSBiYWNrZ3JvdW5kIGZvciB0aGUgcmVzdCBvZiB0aGUgc2NlbmFyaW8gYWZ0ZXIgaXQgZmluaXNoZWQgaXRzIGluaXRpYWxpemF0aW9uIHByb2Nlc3MpLlxuICogVGhlIGJhc2UgY2xhc3Mgb3B0aW9uYWxseSBjcmVhdGVzIGEgdmlldyDigJQgYSBmdWxsc2NyZWVuIGBkaXZgIGFjY2Vzc2libGUgdGhyb3VnaCB0aGUge0BsaW5rIENsaWVudE1vZHVsZS52aWV3fSBhdHRyaWJ1dGUg4oCUIHRoYXQgaXMgYWRkZWQgdG8gdGhlIERPTSB3aGVuIHRoZSBtb2R1bGUgaXMgc3RhcnRlZCBhbmQgcmVtb3ZlZCB3aGVuIHRoZSBtb2R1bGUgY2FsbHMgaXRzIHtAbGluayBDbGllbnRNb2R1bGUjZG9uZX0gbWV0aG9kLlxuICogKFNwZWNpZmljYWxseSwgdGhlIGB2aWV3YCBlbGVtZW50IGlzIGFkZGVkIHRvIHRoZSBgI2NvbnRhaW5lcmAgRE9NIGVsZW1lbnQuKVxuICpcbiAqIEBleGFtcGxlXG4gKiBjbGFzcyBNeU1vZHVsZSBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gKiAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICogICAgIC8vIEhlcmUsIE15TW9kdWxlIHdvdWxkIGFsd2F5cyBoYXZlIGEgdmlldyxcbiAqICAgICAvLyB3aXRoIHRoZSBpZCBhbmQgY2xhc3MgJ215LW1vZHVsZS1uYW1lJyxcbiAqICAgICAvLyBhbmQgcG9zc2libHkgdGhlIGJhY2tncm91bmQgY29sb3JcbiAqICAgICAvLyBkZWZpbmVkIGJ5IHRoZSBhcmd1bWVudCAnb3B0aW9ucycuXG4gKiAgICAgc3VwZXIoJ215LW1vZHVsZS1uYW1lJywgdHJ1ZSwgb3B0aW9ucy5jb2xvciB8fCAnYWxpemFyaW4nKTtcbiAqXG4gKiAgICAgLi4uIC8vIGFueXRoaW5nIHRoZSBjb25zdHJ1Y3RvciBuZWVkc1xuICogICB9XG4gKlxuICogICBzdGFydCgpIHtcbiAqICAgICBzdXBlci5zdGFydCgpO1xuICpcbiAqICAgICAuLi4gLy8gd2hhdCB0aGUgbW9kdWxlIGhhcyB0byBkb1xuICogICAgICAgICAvLyAoY29tbXVuaWNhdGlvbiB3aXRoIHRoZSBzZXJ2ZXIsIGV0Yy4pXG4gKlxuICogICAgIHRoaXMuZG9uZSgpOyAvLyBjYWxsIHRoaXMgbWV0aG9kIHdoZW4gdGhlIG1vZHVsZSBjYW5cbiAqICAgICAgICAgICAgICAgICAgLy8gaGFuZCBvdmVyIHRoZSBjb250cm9sIHRvIGEgc3Vic2VxdWVudCBtb2R1bGVcbiAqICAgfVxuICogfVxuICovXG5jbGFzcyBDbGllbnRNb2R1bGUgZXh0ZW5kcyBQcm9taXNlZCB7XG4vLyBleHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRNb2R1bGUgZXh0ZW5kcyBQcm9taXNlZCB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgbW9kdWxlICh1c2VkIGFzIHRoZSBgaWRgIGFuZCBDU1MgY2xhc3Mgb2YgdGhlIGB2aWV3YCBpZiBpdCBleGlzdHMpLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjcmVhdGVWaWV3PXRydWVdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgaGFzIGFuZCBkaXNwbGF5cyBhIGB2aWV3YCBvciBub3QuXG4gICAqIEBwYXJhbSB7W3R5cGVdfSBbY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgIHdoZW4gaXQgZXhpc3RzLlxuICAgKi9cbiAgY29uc3RydWN0b3IobmFtZSwgY3JlYXRlVmlldyA9IHRydWUsIGNvbG9yID0gJ2JsYWNrJykgeyAvLyBUT0RPOiBjaGFuZ2UgdG8gY29sb3JDbGFzcz9cbiAgICBzdXBlcigpO1xuXG4gICAgLyoqXG4gICAgICogTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcblxuICAgIC8qKlxuICAgICAqIFZpZXcgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBUaGUgdmlldyBpcyBhIERPTSBlbGVtZW50IChhIGZ1bGwgc2NyZWVuIGBkaXZgKSBpbiB3aGljaCB0aGUgY29udGVudCBvZiB0aGUgbW9kdWxlIGlzIGRpc3BsYXllZC5cbiAgICAgKiBUaGlzIGVsZW1lbnQgaXMgYSBjaGlsZCBvZiB0aGUgbWFpbiBjb250YWluZXIgYGRpdiNjb250YWluZXJgLCB3aGljaCBpcyB0aGUgb25seSBjaGlsZCBvZiB0aGUgYGJvZHlgIGVsZW1lbnQuXG4gICAgICogQSBtb2R1bGUgbWF5IG9yIG1heSBub3QgaGF2ZSBhIHZpZXcsIGFzIGluZGljYXRlZCBieSB0aGUgYXJndW1lbnQgYGhhc1ZpZXc6Qm9vbGVhbmAgb2YgdGhlIHtAbGluayBDbGllbnRNb2R1bGUjY29uc3RydWN0b3J9LlxuICAgICAqIFdoZW4gdGhhdCBpcyB0aGUgY2FzZSwgdGhlIHZpZXcgaXMgY3JlYXRlZCBhbmQgYWRkZWQgdG8gdGhlIERPTSB3aGVuIHRoZSB7QGxpbmsgQ2xpZW50TW9kdWxlI3N0YXJ0fSBtZXRob2QgaXMgY2FsbGVkLCBhbmQgaXMgcmVtb3ZlZCBmcm9tIHRoZSBET00gd2hlbiB0aGUge0BsaW5rIENsaWVudE1vZHVsZSNkb25lfSBtZXRob2QgaXMgY2FsbGVkLlxuICAgICAqIEB0eXBlIHtET01FbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMudmlldyA9IG51bGw7XG5cbiAgICB0aGlzLl9vd25zVmlldyA9IGZhbHNlO1xuICAgIHRoaXMuX3Nob3dzVmlldyA9IGZhbHNlO1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2lzRG9uZSA9IGZhbHNlO1xuXG4gICAgaWYgKGNyZWF0ZVZpZXcpIHtcbiAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2lkJywgbmFtZSk7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdtb2R1bGUnKTtcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKGNvbG9yKTtcblxuICAgICAgdGhpcy52aWV3ID0gZGl2O1xuICAgICAgdGhpcy5fb3duc1ZpZXcgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGVzIHRoZSBsb2dpYyBvZiB0aGUgbW9kdWxlIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAgICogRm9yIGluc3RhbmNlLCBpdCB0YWtlcyBjYXJlIG9mIHRoZSBjb21tdW5pY2F0aW9uIHdpdGggdGhlIG1vZHVsZSBvbiB0aGUgc2VydmVyIHNpZGUgYnkgc2VuZGluZyBXZWJTb2NrZXQgbWVzc2FnZXMgYW5kIHNldHRpbmcgdXAgV2ViU29ja2V0IG1lc3NhZ2UgbGlzdGVuZXJzLlxuICAgKiBBZGRpdGlvbmFsbHksIGlmIHRoZSBtb2R1bGUgaGFzIGEgYHZpZXdgLCB0aGUgYHN0YXJ0YCBtZXRob2QgY3JlYXRlcyB0aGUgY29ycmVzcG9uZGluZyBIVE1MIGVsZW1lbnQgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIERPTeKAmXMgbWFpbiBjb250YWluZXIgZWxlbWVudCAoYGRpdiNjb250YWluZXJgKS5cbiAgICpcbiAgICogKipOb3RlOioqIHRoZSBtZXRob2QgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgd2hlbiBuZWNlc3NhcnksIHlvdSBzaG91bGQgbm90IGNhbGwgaXQgbWFudWFsbHkuXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgaWYoIXRoaXMuX2lzU3RhcnRlZCkge1xuICAgICAgaWYgKHRoaXMudmlldykge1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy52aWV3KTtcbiAgICAgICAgdGhpcy5fc2hvd3NWaWV3ID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5faXNTdGFydGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBtb2R1bGUgdG8gdGhlIHN0YXRlIGl0IGhhZCBiZWZvcmUgY2FsbGluZyB0aGUge0BsaW5rIENsaWVudE1vZHVsZSNzdGFydH0gbWV0aG9kLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSAoZm9yIGluc3RhbmNlIHRvIHJlc2V0IHRoZSBtb2R1bGUgYWZ0ZXIgYSBzZXJ2ZXIgY3Jhc2ggaWYgdGhlIG1vZHVsZSBoYWQgbm90IGNhbGxlZCBpdHMge0BsaW5rIENsaWVudE1vZHVsZSNkb25lfSBtZXRob2QgeWV0KSwgeW91IHNob3VsZCBub3QgY2FsbCBpdCBtYW51YWxseS5cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSAoZm9yIGluc3RhbmNlIHRvIHJlc3RhcnQgdGhlIG1vZHVsZSBhZnRlciBhIHNlcnZlciBjcmFzaCBpZiB0aGUgbW9kdWxlIGhhZCBhbHJlYWR5IGNhbGxlZCBpdHMge0BsaW5rIENsaWVudE1vZHVsZSNkb25lfSBtZXRob2QpLCB5b3Ugc2hvdWxkIG5vdCBjYWxsIGl0IG1hbnVhbGx5LlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgdGhpcy5faXNEb25lID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGxhdW5jaCgpIHtcbiAgICBpZiAodGhpcy5faXNEb25lKSB7XG4gICAgICB0aGlzLnJlc3RhcnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuX2lzU3RhcnRlZClcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuXG4gICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBiZSBjYWxsZWQgd2hlbiB0aGUgbW9kdWxlIGNhbiBoYW5kIG92ZXIgdGhlIGNvbnRyb2wgdG8gYSBzdWJzZXF1ZW50IG1vZHVsZSAoZm9yIGluc3RhbmNlIGF0IHRoZSBlbmQgb2YgdGhlIGBzdGFydGAgbWV0aG9kIHlvdSB3cml0ZSkuXG4gICAqIElmIHRoZSBtb2R1bGUgaGFzIGEgYHZpZXdgLCB0aGUgYGRvbmVgIG1ldGhvZCByZW1vdmVzIGl0IGZyb20gdGhlIERPTS5cbiAgICpcbiAgICogKipOb3RlOioqIHlvdSBzaG91bGQgbm90IG92ZXJyaWRlIHRoaXMgbWV0aG9kLlxuICAgKi9cbiAgZG9uZSgpIHtcbiAgICB0aGlzLl9pc0RvbmUgPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMudmlldyAmJiB0aGlzLl9zaG93c1ZpZXcgJiYgdGhpcy5fb3duc1ZpZXcpIHtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLnZpZXcpO1xuICAgICAgdGhpcy5fc2hvd3NWaWV3ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVzb2x2ZVByb21pc2VkKVxuICAgICAgdGhpcy5yZXNvbHZlUHJvbWlzZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgYW4gYXJiaXRyYXJ5IGNlbnRlcmVkIEhUTUwgY29udGVudCB0byB0aGUgbW9kdWxlJ3MgYHZpZXdgLlxuICAgKiBUaGUgbWV0aG9kIHNob3VsZCBiZSBjYWxsZWQgb25seSBpZiB0aGUgbW9kdWxlIGhhcyBhIGB2aWV3YC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGh0bWxDb250ZW50IFRoZSBIVE1MIGNvbnRlbnQgdG8gYXBwZW5kIHRvIHRoZSBgdmlld2AuXG4gICAqL1xuICBzZXRDZW50ZXJlZFZpZXdDb250ZW50KGh0bWxDb250ZW50KSB7XG4gICAgaWYgKHRoaXMudmlldykge1xuICAgICAgaWYgKCF0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50KSB7XG4gICAgICAgIGxldCBjb250ZW50RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgY29udGVudERpdi5jbGFzc0xpc3QuYWRkKCdjZW50ZXJlZC1jb250ZW50Jyk7XG4gICAgICAgIHRoaXMudmlldy5hcHBlbmRDaGlsZChjb250ZW50RGl2KTtcblxuICAgICAgICB0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50ID0gY29udGVudERpdjtcbiAgICAgIH1cblxuICAgICAgaWYgKGh0bWxDb250ZW50KSB7XG4gICAgICAgIGlmIChodG1sQ29udGVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudC5yZW1vdmVDaGlsZCh0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQuYXBwZW5kQ2hpbGQoaHRtbENvbnRlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGlzIGEgc3RyaW5nXG4gICAgICAgICAgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudC5pbm5lckhUTUwgPSBodG1sQ29udGVudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBjZW50ZXJlZCBIVE1MIGNvbnRlbnQgKHNldCBieSB7QGxpbmsgQ2xpZW50TW9kdWxlI3NldENlbnRlcmVkVmlld0NvbnRlbnR9KSBmcm9tIHRoZSBgdmlld2AuXG4gICAqL1xuICByZW1vdmVDZW50ZXJlZFZpZXdDb250ZW50KCkge1xuICAgIGlmICh0aGlzLnZpZXcgJiYgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudCkge1xuICAgICAgdGhpcy52aWV3LnJlbW92ZUNoaWxkKHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQpO1xuICAgICAgZGVsZXRlIHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQ7XG4gICAgfVxuICB9XG5cbiAgc2V0IHpJbmRleCh2YWx1ZSkge1xuICAgIGlmKHRoaXMudmlldylcbiAgICAgIHRoaXMudmlldy5zdHlsZS56SW5kZXggPSB2YWx1ZTtcbiAgfVxufVxuXG5DbGllbnRNb2R1bGUuc2VxdWVudGlhbCA9IGZ1bmN0aW9uKC4uLm1vZHVsZXMpIHtcbiAgcmV0dXJuIG5ldyBTZXF1ZW50aWFsKG1vZHVsZXMpO1xufTtcblxuQ2xpZW50TW9kdWxlLnBhcmFsbGVsID0gZnVuY3Rpb24oLi4ubW9kdWxlcykge1xuICByZXR1cm4gbmV3IFBhcmFsbGVsKG1vZHVsZXMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbGllbnRNb2R1bGU7XG4iXX0=