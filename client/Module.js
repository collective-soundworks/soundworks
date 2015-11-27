'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

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
   * [client] Base class used to create a *Soundworks* module on the client side.
   *
   * Each module should have a {@link Module#start} and a {@link Module#done} method.
   * The {@link Module#done} method must be called when the module has finished its initialization (*i.e.* when the module has done its duty, or when it may run in the background for the rest of the scenario after it finished its initialization process), to hand over the control to the subsequent modules
   *
   * The base class optionally creates a view (a fullscreen `div` accessible through the {@link Module.view} attribute). The view is added to the DOM (as a child of the `#container` element) when the module is started (with the {@link Module#start} method, and removed when the module calls its {@link Module#done} method.
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
  }

  /**
   * Handle the logic of the module.
   *
   * For instance, it takes care of the communication with the module on the server side by sending WebSocket messages and setting up WebSocket message listeners.
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
     * **Note:** the method is called automatically when necessary (for instance to reset the module after a server crash if the module had not called its {@link Module#done} method yet), you should not call it manually.
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
     * **Note:** the method is called automatically when necessary (for instance to restart the module after a server crash if the module had already called its {@link Module#done} method), you should not call it manually.
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
    key: 'zIndex',
    set: function set(value) {
      if (this.view) this.view.style.zIndex = value;
    }
  }]);

  return Module;
})(Promised);

exports['default'] = Module;

Module.sequential = function () {
  for (var _len = arguments.length, modules = Array(_len), _key = 0; _key < _len; _key++) {
    modules[_key] = arguments[_key];
  }

  return new Sequential(modules);
};

Module.parallel = function () {
  for (var _len2 = arguments.length, modules = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    modules[_key2] = arguments[_key2];
  }

  return new Parallel(modules);
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUMsVUFBVSxFQUFFO0FBQ3hDLGtCQUFJLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUM3RTs7QUFFRCxnQkFBSSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztXQUNwRCxNQUFNOztBQUVMLGdCQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQztXQUNuRDtTQUNGO09BQ0Y7S0FDRjs7Ozs7OztXQUt3QixxQ0FBRztBQUMxQixVQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFO0FBQzFDLFlBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ2pELGVBQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDO09BQ2xDO0tBQ0Y7Ozs7Ozs7O1NBTVMsYUFBQyxLQUFLLEVBQUU7QUFDaEIsVUFBRyxJQUFJLENBQUMsSUFBSSxFQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7S0FDbEM7OztTQWxLa0IsTUFBTTtHQUFTLFFBQVE7O3FCQUF2QixNQUFNOztBQXFLM0IsTUFBTSxDQUFDLFVBQVUsR0FBRyxZQUFxQjtvQ0FBVCxPQUFPO0FBQVAsV0FBTzs7O0FBQ3JDLFNBQU8sSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDaEMsQ0FBQzs7QUFFRixNQUFNLENBQUMsUUFBUSxHQUFHLFlBQXFCO3FDQUFULE9BQU87QUFBUCxXQUFPOzs7QUFDbkMsU0FBTyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUM5QixDQUFDIiwiZmlsZSI6InNyYy9jbGllbnQvTW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmNvbnN0IGNvbnRhaW5lciA9IHdpbmRvdy5jb250YWluZXIgfHwgKHdpbmRvdy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJykpO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIFByb21pc2VkIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvKipcbiAgICAgKiBbcmVzb2x2ZVByb21pc2VkIGRlc2NyaXB0aW9uXVxuICAgICAqIEB0b2RvIGRlc2NyaXB0aW9uXG4gICAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5yZXNvbHZlUHJvbWlzZWQgPSBudWxsO1xuICB9XG5cbiAgY3JlYXRlUHJvbWlzZSgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHRoaXMucmVzb2x2ZVByb21pc2VkID0gcmVzb2x2ZSk7XG4gIH1cblxuICBsYXVuY2goKSB7XG5cbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIFNlcXVlbnRpYWwgZXh0ZW5kcyBQcm9taXNlZCB7XG4gIGNvbnN0cnVjdG9yKG1vZHVsZXMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5tb2R1bGVzID0gbW9kdWxlcztcbiAgfVxuXG4gIGNyZWF0ZVByb21pc2UoKSB7XG4gICAgbGV0IG1vZCA9IG51bGw7XG4gICAgbGV0IHByb21pc2UgPSBudWxsO1xuXG4gICAgZm9yKGxldCBuZXh0IG9mIHRoaXMubW9kdWxlcykge1xuICAgICAgaWYobW9kICE9PSBudWxsKVxuICAgICAgICBwcm9taXNlLnRoZW4oKCkgPT4gbmV4dC5sYXVuY2goKSk7XG5cbiAgICAgIG1vZCA9IG5leHQ7XG4gICAgICBwcm9taXNlID0gbW9kLmNyZWF0ZVByb21pc2UoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGxhdW5jaCgpIHtcbiAgICByZXR1cm4gdGhpcy5tb2R1bGVzWzBdLmxhdW5jaCgpO1xuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgUGFyYWxsZWwgZXh0ZW5kcyBQcm9taXNlZCB7XG4gIGNvbnN0cnVjdG9yKG1vZHVsZXMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5tb2R1bGVzID0gbW9kdWxlcztcblxuICAgIC8vIHNldCB6LWluZGV4IG9mIHBhcmFsbGVsIG1vZHVsZXNcbiAgICBsZXQgekluZGV4ID0gbW9kdWxlcy5sZW5ndGg7XG4gICAgZm9yKGxldCBtb2Qgb2YgbW9kdWxlcykge1xuICAgICAgbW9kLnpJbmRleCA9IHpJbmRleDtcbiAgICAgIHpJbmRleC0tO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZVByb21pc2UoKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHRoaXMubW9kdWxlcy5tYXAoKG1vZCkgPT4gbW9kLmNyZWF0ZVByb21pc2UoKSkpO1xuICB9XG5cbiAgbGF1bmNoKCkge1xuICAgIGZvcihsZXQgbW9kIG9mIHRoaXMubW9kdWxlcylcbiAgICAgIG1vZC5sYXVuY2goKTtcbiAgfVxufVxuXG4vKipcbiAqIFtjbGllbnRdIEJhc2UgY2xhc3MgdXNlZCB0byBjcmVhdGUgYSAqU291bmR3b3JrcyogbW9kdWxlIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAqXG4gKiBFYWNoIG1vZHVsZSBzaG91bGQgaGF2ZSBhIHtAbGluayBNb2R1bGUjc3RhcnR9IGFuZCBhIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kLlxuICogVGhlIHtAbGluayBNb2R1bGUjZG9uZX0gbWV0aG9kIG11c3QgYmUgY2FsbGVkIHdoZW4gdGhlIG1vZHVsZSBoYXMgZmluaXNoZWQgaXRzIGluaXRpYWxpemF0aW9uICgqaS5lLiogd2hlbiB0aGUgbW9kdWxlIGhhcyBkb25lIGl0cyBkdXR5LCBvciB3aGVuIGl0IG1heSBydW4gaW4gdGhlIGJhY2tncm91bmQgZm9yIHRoZSByZXN0IG9mIHRoZSBzY2VuYXJpbyBhZnRlciBpdCBmaW5pc2hlZCBpdHMgaW5pdGlhbGl6YXRpb24gcHJvY2VzcyksIHRvIGhhbmQgb3ZlciB0aGUgY29udHJvbCB0byB0aGUgc3Vic2VxdWVudCBtb2R1bGVzXG4gKlxuICogVGhlIGJhc2UgY2xhc3Mgb3B0aW9uYWxseSBjcmVhdGVzIGEgdmlldyAoYSBmdWxsc2NyZWVuIGBkaXZgIGFjY2Vzc2libGUgdGhyb3VnaCB0aGUge0BsaW5rIE1vZHVsZS52aWV3fSBhdHRyaWJ1dGUpLiBUaGUgdmlldyBpcyBhZGRlZCB0byB0aGUgRE9NIChhcyBhIGNoaWxkIG9mIHRoZSBgI2NvbnRhaW5lcmAgZWxlbWVudCkgd2hlbiB0aGUgbW9kdWxlIGlzIHN0YXJ0ZWQgKHdpdGggdGhlIHtAbGluayBNb2R1bGUjc3RhcnR9IG1ldGhvZCwgYW5kIHJlbW92ZWQgd2hlbiB0aGUgbW9kdWxlIGNhbGxzIGl0cyB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZC5cbiAqXG4gKiBAZXhhbXBsZSBjbGFzcyBNeU1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gKiAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICogICAgIC8vIFRoaXMgZXhhbXBsZSBtb2R1bGU6XG4gKiAgICAgLy8gLSBhbHdheXMgaGFzIGEgdmlld1xuICogICAgIC8vIC0gaGFzIHRoZSBpZCBhbmQgY2xhc3MgJ215LW1vZHVsZS1uYW1lJ1xuICogICAgIC8vIC0gYW5kIHVzZXMgdGhlIGJhY2tncm91bmQgY29sb3IgZGVmaW5lZCBpbiB0aGUgYXJndW1lbnQgJ29wdGlvbnMnIChpZiBhbnkpLlxuICogICAgIHN1cGVyKCdteS1tb2R1bGUtbmFtZScsIHRydWUsIG9wdGlvbnMuY29sb3IgfHwgJ2FsaXphcmluJyk7XG4gKlxuICogICAgIC4uLiAvLyBhbnl0aGluZyB0aGUgY29uc3RydWN0b3IgbmVlZHNcbiAqICAgfVxuICpcbiAqICAgc3RhcnQoKSB7XG4gKiAgICAgc3VwZXIuc3RhcnQoKTtcbiAqXG4gKiAgICAgLy8gV2hhdGV2ZXIgdGhlIG1vZHVsZSBkb2VzIChjb21tdW5pY2F0aW9uIHdpdGggdGhlIHNlcnZlciwgZXRjLilcbiAqICAgICAvLyAuLi5cbiAqXG4gKiAgICAgLy8gQ2FsbCB0aGUgYGRvbmVgIG1ldGhvZCB3aGVuIHRoZSBtb2R1bGUgaGFzIGZpbmlzaGVkIGl0cyBpbml0aWFsaXphdGlvblxuICogICAgIHRoaXMuZG9uZSgpO1xuICogICB9XG4gKiB9XG4gKiBAdG9kbyBNb3ZlIGV4YW1wbGUgaW4gdGhlIG1hbnVhbD9cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kdWxlIGV4dGVuZHMgUHJvbWlzZWQge1xuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgbW9kdWxlICh1c2VkIGFzIHRoZSBgaWRgIGFuZCBDU1MgY2xhc3Mgb2YgdGhlIGB2aWV3YCBET00gZWxlbWVudCBpZiBpdCBleGlzdHMpLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjcmVhdGVWaWV3PXRydWVdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgZGlzcGxheXMgYSBgdmlld2Agb3Igbm90LlxuICAgKiBAcGFyYW0ge1t0eXBlXX0gW2NvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YCB3aGVuIGl0IGV4aXN0cy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG5hbWUsIGNyZWF0ZVZpZXcgPSB0cnVlLCBjb2xvciA9ICdibGFjaycpIHsgLy8gVE9ETzogY2hhbmdlIHRvIGNvbG9yQ2xhc3M/XG4gICAgc3VwZXIoKTtcblxuICAgIC8qKlxuICAgICAqIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG5cbiAgICAvKipcbiAgICAgKiBWaWV3IG9mIHRoZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBUaGUgdmlldyBpcyBhIERPTSBlbGVtZW50IChhIGZ1bGwgc2NyZWVuIGBkaXZgKSBpbiB3aGljaCB0aGUgY29udGVudCBvZiB0aGUgbW9kdWxlIGlzIGRpc3BsYXllZC5cbiAgICAgKiBUaGlzIGVsZW1lbnQgaXMgYSBjaGlsZCBvZiB0aGUgbWFpbiBjb250YWluZXIgYGRpdiNjb250YWluZXJgLCB3aGljaCBpcyB0aGUgb25seSBjaGlsZCBvZiB0aGUgYGJvZHlgIGVsZW1lbnQuXG4gICAgICogQSBtb2R1bGUgbWF5IG9yIG1heSBub3QgaGF2ZSBhIHZpZXcsIGFzIGluZGljYXRlZCBieSB0aGUgYXJndW1lbnQgYGhhc1ZpZXc6Qm9vbGVhbmAgb2YgdGhlIHtAbGluayBNb2R1bGUjY29uc3RydWN0b3J9LlxuICAgICAqIFdoZW4gdGhhdCBpcyB0aGUgY2FzZSwgdGhlIHZpZXcgaXMgY3JlYXRlZCBhbmQgYWRkZWQgdG8gdGhlIERPTSB3aGVuIHRoZSB7QGxpbmsgTW9kdWxlI3N0YXJ0fSBtZXRob2QgaXMgY2FsbGVkLCBhbmQgaXMgcmVtb3ZlZCBmcm9tIHRoZSBET00gd2hlbiB0aGUge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2QgaXMgY2FsbGVkLlxuICAgICAqIEB0eXBlIHtET01FbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMudmlldyA9IG51bGw7XG5cbiAgICB0aGlzLl9vd25zVmlldyA9IGZhbHNlO1xuICAgIHRoaXMuX3Nob3dzVmlldyA9IGZhbHNlO1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2lzRG9uZSA9IGZhbHNlO1xuXG4gICAgaWYgKGNyZWF0ZVZpZXcpIHtcbiAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2lkJywgbmFtZSk7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdtb2R1bGUnKTtcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKGNvbG9yKTtcblxuICAgICAgdGhpcy52aWV3ID0gZGl2O1xuICAgICAgdGhpcy5fb3duc1ZpZXcgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgdGhlIGxvZ2ljIG9mIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEZvciBpbnN0YW5jZSwgaXQgdGFrZXMgY2FyZSBvZiB0aGUgY29tbXVuaWNhdGlvbiB3aXRoIHRoZSBtb2R1bGUgb24gdGhlIHNlcnZlciBzaWRlIGJ5IHNlbmRpbmcgV2ViU29ja2V0IG1lc3NhZ2VzIGFuZCBzZXR0aW5nIHVwIFdlYlNvY2tldCBtZXNzYWdlIGxpc3RlbmVycy5cbiAgICogQWRkaXRpb25hbGx5LCBpZiB0aGUgbW9kdWxlIGhhcyBhIGB2aWV3YCwgdGhlIGBzdGFydGAgbWV0aG9kIGNyZWF0ZXMgdGhlIGNvcnJlc3BvbmRpbmcgSFRNTCBlbGVtZW50IGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBET03igJlzIG1haW4gY29udGFpbmVyIGVsZW1lbnQgKGBkaXYjY29udGFpbmVyYCkuXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gbmVjZXNzYXJ5LCB5b3Ugc2hvdWxkIG5vdCBjYWxsIGl0IG1hbnVhbGx5LlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIGlmKCF0aGlzLl9pc1N0YXJ0ZWQpIHtcbiAgICAgIGlmICh0aGlzLnZpZXcpIHtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMudmlldyk7XG4gICAgICAgIHRoaXMuX3Nob3dzVmlldyA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2lzU3RhcnRlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBtb2R1bGUgdG8gdGhlIHN0YXRlIGl0IGhhZCBiZWZvcmUgY2FsbGluZyB0aGUge0BsaW5rIE1vZHVsZSNzdGFydH0gbWV0aG9kLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSAoZm9yIGluc3RhbmNlIHRvIHJlc2V0IHRoZSBtb2R1bGUgYWZ0ZXIgYSBzZXJ2ZXIgY3Jhc2ggaWYgdGhlIG1vZHVsZSBoYWQgbm90IGNhbGxlZCBpdHMge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2QgeWV0KSwgeW91IHNob3VsZCBub3QgY2FsbCBpdCBtYW51YWxseS5cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gbmVjZXNzYXJ5IChmb3IgaW5zdGFuY2UgdG8gcmVzdGFydCB0aGUgbW9kdWxlIGFmdGVyIGEgc2VydmVyIGNyYXNoIGlmIHRoZSBtb2R1bGUgaGFkIGFscmVhZHkgY2FsbGVkIGl0cyB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZCksIHlvdSBzaG91bGQgbm90IGNhbGwgaXQgbWFudWFsbHkuXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICB0aGlzLl9pc0RvbmUgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbGF1bmNoKCkge1xuICAgIGlmICh0aGlzLl9pc0RvbmUpIHtcbiAgICAgIHRoaXMucmVzdGFydCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5faXNTdGFydGVkKVxuICAgICAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIGJlIGNhbGxlZCB3aGVuIHRoZSBtb2R1bGUgY2FuIGhhbmQgb3ZlciB0aGUgY29udHJvbCB0byBhIHN1YnNlcXVlbnQgbW9kdWxlIChmb3IgaW5zdGFuY2UgYXQgdGhlIGVuZCBvZiB0aGUgYHN0YXJ0YCBtZXRob2QgeW91IHdyaXRlKS5cbiAgICogSWYgdGhlIG1vZHVsZSBoYXMgYSBgdmlld2AsIHRoZSBgZG9uZWAgbWV0aG9kIHJlbW92ZXMgaXQgZnJvbSB0aGUgRE9NLlxuICAgKlxuICAgKiAqKk5vdGU6KiogeW91IHNob3VsZCBub3Qgb3ZlcnJpZGUgdGhpcyBtZXRob2QuXG4gICAqL1xuICBkb25lKCkge1xuICAgIHRoaXMuX2lzRG9uZSA9IHRydWU7XG5cbiAgICBpZiAodGhpcy52aWV3ICYmIHRoaXMuX3Nob3dzVmlldyAmJiB0aGlzLl9vd25zVmlldykge1xuICAgICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKHRoaXMudmlldyk7XG4gICAgICB0aGlzLl9zaG93c1ZpZXcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZXNvbHZlUHJvbWlzZWQpXG4gICAgICB0aGlzLnJlc29sdmVQcm9taXNlZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBhbiBhcmJpdHJhcnkgY2VudGVyZWQgSFRNTCBjb250ZW50IHRvIHRoZSBtb2R1bGUncyBgdmlld2AgKGlmIGFueSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBodG1sQ29udGVudCBUaGUgSFRNTCBjb250ZW50IHRvIGFwcGVuZCB0byB0aGUgYHZpZXdgLlxuICAgKi9cbiAgc2V0Q2VudGVyZWRWaWV3Q29udGVudChodG1sQ29udGVudCkge1xuICAgIGlmICh0aGlzLnZpZXcpIHtcbiAgICAgIGlmICghdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudCkge1xuICAgICAgICBsZXQgY29udGVudERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgIGNvbnRlbnREaXYuY2xhc3NMaXN0LmFkZCgnY2VudGVyZWQtY29udGVudCcpO1xuICAgICAgICB0aGlzLnZpZXcuYXBwZW5kQ2hpbGQoY29udGVudERpdik7XG5cbiAgICAgICAgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudCA9IGNvbnRlbnREaXY7XG4gICAgICB9XG5cbiAgICAgIGlmIChodG1sQ29udGVudCkge1xuICAgICAgICBpZiAoaHRtbENvbnRlbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgIGlmICh0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQucmVtb3ZlQ2hpbGQodGhpcy5fY2VudGVyZWRWaWV3Q29udGVudC5maXJzdENoaWxkKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50LmFwcGVuZENoaWxkKGh0bWxDb250ZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBpcyBhIHN0cmluZ1xuICAgICAgICAgIHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQuaW5uZXJIVE1MID0gaHRtbENvbnRlbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgY2VudGVyZWQgSFRNTCBjb250ZW50IChzZXQgYnkge0BsaW5rIE1vZHVsZSNzZXRDZW50ZXJlZFZpZXdDb250ZW50fSkgZnJvbSB0aGUgYHZpZXdgLlxuICAgKi9cbiAgcmVtb3ZlQ2VudGVyZWRWaWV3Q29udGVudCgpIHtcbiAgICBpZiAodGhpcy52aWV3ICYmIHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQpIHtcbiAgICAgIHRoaXMudmlldy5yZW1vdmVDaGlsZCh0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50KTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBgei1pbmRleGAgQ1NTIHByb3BlcnR5IG9mIHRoZSB2aWV3XG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSBWYWx1ZSBvZiB0aGUgYHotaW5kZXhgLlxuICAgKi9cbiAgc2V0IHpJbmRleCh2YWx1ZSkge1xuICAgIGlmKHRoaXMudmlldylcbiAgICAgIHRoaXMudmlldy5zdHlsZS56SW5kZXggPSB2YWx1ZTtcbiAgfVxufVxuXG5Nb2R1bGUuc2VxdWVudGlhbCA9IGZ1bmN0aW9uKC4uLm1vZHVsZXMpIHtcbiAgcmV0dXJuIG5ldyBTZXF1ZW50aWFsKG1vZHVsZXMpO1xufTtcblxuTW9kdWxlLnBhcmFsbGVsID0gZnVuY3Rpb24oLi4ubW9kdWxlcykge1xuICByZXR1cm4gbmV3IFBhcmFsbGVsKG1vZHVsZXMpO1xufTtcbiJdfQ==