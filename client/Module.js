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
   * The {@link Module} base class is used to create a *Soundworks* module on the client side.
   * Each module should have a {@link Module#start} and a {@link Module#done} method.
   * The {@link Module#done} method must be called when the module can hand over the control to the subsequent modules (*i.e.* when the module has done its duty, or when it may run in the background for the rest of the scenario after it finished its initialization process).
   * The base class optionally creates a view — a fullscreen `div` accessible through the {@link Module.view} attribute — that is added to the DOM when the module is started and removed when the module calls its {@link Module#done} method.
   * (Specifically, the `view` element is added to the `#container` DOM element.)
   *
   * @example
   * class MyModule extends Module {
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

var Module = (function (_Promised3) {
  _inherits(Module, _Promised3);

  // export default class Module extends Promised {
  /**
   * Creates an instance of the class.
   * @param {String} name Name of the module (used as the `id` and CSS class of the `view` if it exists).
   * @param {Boolean} [createView=true] Indicates whether the module has and displays a `view` or not.
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
   * Handles the logic of the module on the client side.
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
     * Resets the module to the state it had before calling the {@link Module#start} method.
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
     * Restarts the module.
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
    value: function send(channel) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      // console.log(`${this.name}:${channel}`, this);
      _comm2['default'].send.apply(_comm2['default'], [this.name + ':' + channel].concat(args));
    }
  }, {
    key: 'receive',
    value: function receive(channel, callback) {
      // console.log(`${this.name}:${channel}`, this);
      _comm2['default'].receive(this.name + ':' + channel, callback);
    }
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
  for (var _len2 = arguments.length, modules = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    modules[_key2] = arguments[_key2];
  }

  return new Sequential(modules);
};

Module.parallel = function () {
  for (var _len3 = arguments.length, modules = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    modules[_key3] = arguments[_key3];
  }

  return new Parallel(modules);
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvTW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUE2QixRQUFROztvQkFDcEIsUUFBUTs7OztBQUV6QixJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQSxBQUFDLENBQUM7Ozs7OztJQUsxRixRQUFRO1lBQVIsUUFBUTs7QUFDRCxXQURQLFFBQVEsR0FDRTswQkFEVixRQUFROztBQUVWLCtCQUZFLFFBQVEsNkNBRUY7Ozs7Ozs7QUFPUixRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztHQUM3Qjs7Ozs7O2VBVkcsUUFBUTs7V0FZQyx5QkFBRzs7O0FBQ2QsYUFBTyxhQUFZLFVBQUMsT0FBTztlQUFLLE1BQUssZUFBZSxHQUFHLE9BQU87T0FBQSxDQUFDLENBQUM7S0FDakU7OztXQUVLLGtCQUFHLEVBRVI7OztTQWxCRyxRQUFROzs7SUF3QlIsVUFBVTtZQUFWLFVBQVU7O0FBQ0gsV0FEUCxVQUFVLENBQ0YsT0FBTyxFQUFFOzBCQURqQixVQUFVOztBQUVaLCtCQUZFLFVBQVUsNkNBRUo7O0FBRVIsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7R0FDeEI7Ozs7OztlQUxHLFVBQVU7O1dBT0QseUJBQUc7QUFDZCxVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDZixVQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7Ozs7Ozs7O2NBRVgsSUFBSTs7QUFDVixjQUFHLEdBQUcsS0FBSyxJQUFJLEVBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQzttQkFBTSxJQUFJLENBQUMsTUFBTSxFQUFFO1dBQUEsQ0FBQyxDQUFDOztBQUVwQyxhQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ1gsaUJBQU8sR0FBRyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7OztBQUxoQywwQ0FBZ0IsSUFBSSxD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UUFBUSxFQUFFO0FBQ2hDLHdCQUFLLGNBQWMsQ0FBSSxJQUFJLENBQUMsSUFBSSxTQUFJLE9BQU8sRUFBSSxRQUFRLENBQUMsQ0FBQztLQUMxRDs7O1NBakJTLGFBQUMsS0FBSyxFQUFFO0FBQ2hCLFVBQUcsSUFBSSxDQUFDLElBQUksRUFDVixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0tBQ2xDOzs7U0F4S2tCLE1BQU07R0FBUyxRQUFROztxQkFBdkIsTUFBTTs7QUF5TDNCLE1BQU0sQ0FBQyxVQUFVLEdBQUcsWUFBcUI7cUNBQVQsT0FBTztBQUFQLFdBQU87OztBQUNyQyxTQUFPLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQ2hDLENBQUM7O0FBRUYsTUFBTSxDQUFDLFFBQVEsR0FBRyxZQUFxQjtxQ0FBVCxPQUFPO0FBQVAsV0FBTzs7O0FBQ25DLFNBQU8sSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDOUIsQ0FBQyIsImZpbGUiOiJzcmMvY2xpZW50L01vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgY29tbSBmcm9tICcuL2NvbW0nO1xuXG5jb25zdCBjb250YWluZXIgPSB3aW5kb3cuY29udGFpbmVyIHx8ICh3aW5kb3cuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpKTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBQcm9taXNlZCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgLyoqXG4gICAgICogW3Jlc29sdmVQcm9taXNlZCBkZXNjcmlwdGlvbl1cbiAgICAgKiBAdG9kbyBkZXNjcmlwdGlvblxuICAgICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucmVzb2x2ZVByb21pc2VkID0gbnVsbDtcbiAgfVxuXG4gIGNyZWF0ZVByb21pc2UoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB0aGlzLnJlc29sdmVQcm9taXNlZCA9IHJlc29sdmUpO1xuICB9XG5cbiAgbGF1bmNoKCkge1xuXG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBTZXF1ZW50aWFsIGV4dGVuZHMgUHJvbWlzZWQge1xuICBjb25zdHJ1Y3Rvcihtb2R1bGVzKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG4gIH1cblxuICBjcmVhdGVQcm9taXNlKCkge1xuICAgIGxldCBtb2QgPSBudWxsO1xuICAgIGxldCBwcm9taXNlID0gbnVsbDtcblxuICAgIGZvcihsZXQgbmV4dCBvZiB0aGlzLm1vZHVsZXMpIHtcbiAgICAgIGlmKG1vZCAhPT0gbnVsbClcbiAgICAgICAgcHJvbWlzZS50aGVuKCgpID0+IG5leHQubGF1bmNoKCkpO1xuXG4gICAgICBtb2QgPSBuZXh0O1xuICAgICAgcHJvbWlzZSA9IG1vZC5jcmVhdGVQcm9taXNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBsYXVuY2goKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kdWxlc1swXS5sYXVuY2goKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIFBhcmFsbGVsIGV4dGVuZHMgUHJvbWlzZWQge1xuICBjb25zdHJ1Y3Rvcihtb2R1bGVzKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG5cbiAgICAvLyBzZXQgei1pbmRleCBvZiBwYXJhbGxlbCBtb2R1bGVzXG4gICAgbGV0IHpJbmRleCA9IG1vZHVsZXMubGVuZ3RoO1xuICAgIGZvcihsZXQgbW9kIG9mIG1vZHVsZXMpIHtcbiAgICAgIG1vZC56SW5kZXggPSB6SW5kZXg7XG4gICAgICB6SW5kZXgtLTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVQcm9taXNlKCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbCh0aGlzLm1vZHVsZXMubWFwKChtb2QpID0+IG1vZC5jcmVhdGVQcm9taXNlKCkpKTtcbiAgfVxuXG4gIGxhdW5jaCgpIHtcbiAgICBmb3IobGV0IG1vZCBvZiB0aGlzLm1vZHVsZXMpXG4gICAgICBtb2QubGF1bmNoKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUge0BsaW5rIE1vZHVsZX0gYmFzZSBjbGFzcyBpcyB1c2VkIHRvIGNyZWF0ZSBhICpTb3VuZHdvcmtzKiBtb2R1bGUgb24gdGhlIGNsaWVudCBzaWRlLlxuICogRWFjaCBtb2R1bGUgc2hvdWxkIGhhdmUgYSB7QGxpbmsgTW9kdWxlI3N0YXJ0fSBhbmQgYSB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZC5cbiAqIFRoZSB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZCBtdXN0IGJlIGNhbGxlZCB3aGVuIHRoZSBtb2R1bGUgY2FuIGhhbmQgb3ZlciB0aGUgY29udHJvbCB0byB0aGUgc3Vic2VxdWVudCBtb2R1bGVzICgqaS5lLiogd2hlbiB0aGUgbW9kdWxlIGhhcyBkb25lIGl0cyBkdXR5LCBvciB3aGVuIGl0IG1heSBydW4gaW4gdGhlIGJhY2tncm91bmQgZm9yIHRoZSByZXN0IG9mIHRoZSBzY2VuYXJpbyBhZnRlciBpdCBmaW5pc2hlZCBpdHMgaW5pdGlhbGl6YXRpb24gcHJvY2VzcykuXG4gKiBUaGUgYmFzZSBjbGFzcyBvcHRpb25hbGx5IGNyZWF0ZXMgYSB2aWV3IOKAlCBhIGZ1bGxzY3JlZW4gYGRpdmAgYWNjZXNzaWJsZSB0aHJvdWdoIHRoZSB7QGxpbmsgTW9kdWxlLnZpZXd9IGF0dHJpYnV0ZSDigJQgdGhhdCBpcyBhZGRlZCB0byB0aGUgRE9NIHdoZW4gdGhlIG1vZHVsZSBpcyBzdGFydGVkIGFuZCByZW1vdmVkIHdoZW4gdGhlIG1vZHVsZSBjYWxscyBpdHMge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2QuXG4gKiAoU3BlY2lmaWNhbGx5LCB0aGUgYHZpZXdgIGVsZW1lbnQgaXMgYWRkZWQgdG8gdGhlIGAjY29udGFpbmVyYCBET00gZWxlbWVudC4pXG4gKlxuICogQGV4YW1wbGVcbiAqIGNsYXNzIE15TW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAqICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gKiAgICAgLy8gSGVyZSwgTXlNb2R1bGUgd291bGQgYWx3YXlzIGhhdmUgYSB2aWV3LFxuICogICAgIC8vIHdpdGggdGhlIGlkIGFuZCBjbGFzcyAnbXktbW9kdWxlLW5hbWUnLFxuICogICAgIC8vIGFuZCBwb3NzaWJseSB0aGUgYmFja2dyb3VuZCBjb2xvclxuICogICAgIC8vIGRlZmluZWQgYnkgdGhlIGFyZ3VtZW50ICdvcHRpb25zJy5cbiAqICAgICBzdXBlcignbXktbW9kdWxlLW5hbWUnLCB0cnVlLCBvcHRpb25zLmNvbG9yIHx8ICdhbGl6YXJpbicpO1xuICpcbiAqICAgICAuLi4gLy8gYW55dGhpbmcgdGhlIGNvbnN0cnVjdG9yIG5lZWRzXG4gKiAgIH1cbiAqXG4gKiAgIHN0YXJ0KCkge1xuICogICAgIHN1cGVyLnN0YXJ0KCk7XG4gKlxuICogICAgIC4uLiAvLyB3aGF0IHRoZSBtb2R1bGUgaGFzIHRvIGRvXG4gKiAgICAgICAgIC8vIChjb21tdW5pY2F0aW9uIHdpdGggdGhlIHNlcnZlciwgZXRjLilcbiAqXG4gKiAgICAgdGhpcy5kb25lKCk7IC8vIGNhbGwgdGhpcyBtZXRob2Qgd2hlbiB0aGUgbW9kdWxlIGNhblxuICogICAgICAgICAgICAgICAgICAvLyBoYW5kIG92ZXIgdGhlIGNvbnRyb2wgdG8gYSBzdWJzZXF1ZW50IG1vZHVsZVxuICogICB9XG4gKiB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vZHVsZSBleHRlbmRzIFByb21pc2VkIHtcbi8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vZHVsZSBleHRlbmRzIFByb21pc2VkIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBtb2R1bGUgKHVzZWQgYXMgdGhlIGBpZGAgYW5kIENTUyBjbGFzcyBvZiB0aGUgYHZpZXdgIGlmIGl0IGV4aXN0cykuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NyZWF0ZVZpZXc9dHJ1ZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1vZHVsZSBoYXMgYW5kIGRpc3BsYXlzIGEgYHZpZXdgIG9yIG5vdC5cbiAgICogQHBhcmFtIHtbdHlwZV19IFtjb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2Agd2hlbiBpdCBleGlzdHMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihuYW1lLCBjcmVhdGVWaWV3ID0gdHJ1ZSwgY29sb3IgPSAnYmxhY2snKSB7IC8vIFRPRE86IGNoYW5nZSB0byBjb2xvckNsYXNzP1xuICAgIHN1cGVyKCk7XG5cbiAgICAvKipcbiAgICAgKiBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuXG4gICAgLyoqXG4gICAgICogVmlldyBvZiB0aGUgbW9kdWxlLlxuICAgICAqIFRoZSB2aWV3IGlzIGEgRE9NIGVsZW1lbnQgKGEgZnVsbCBzY3JlZW4gYGRpdmApIGluIHdoaWNoIHRoZSBjb250ZW50IG9mIHRoZSBtb2R1bGUgaXMgZGlzcGxheWVkLlxuICAgICAqIFRoaXMgZWxlbWVudCBpcyBhIGNoaWxkIG9mIHRoZSBtYWluIGNvbnRhaW5lciBgZGl2I2NvbnRhaW5lcmAsIHdoaWNoIGlzIHRoZSBvbmx5IGNoaWxkIG9mIHRoZSBgYm9keWAgZWxlbWVudC5cbiAgICAgKiBBIG1vZHVsZSBtYXkgb3IgbWF5IG5vdCBoYXZlIGEgdmlldywgYXMgaW5kaWNhdGVkIGJ5IHRoZSBhcmd1bWVudCBgaGFzVmlldzpCb29sZWFuYCBvZiB0aGUge0BsaW5rIE1vZHVsZSNjb25zdHJ1Y3Rvcn0uXG4gICAgICogV2hlbiB0aGF0IGlzIHRoZSBjYXNlLCB0aGUgdmlldyBpcyBjcmVhdGVkIGFuZCBhZGRlZCB0byB0aGUgRE9NIHdoZW4gdGhlIHtAbGluayBNb2R1bGUjc3RhcnR9IG1ldGhvZCBpcyBjYWxsZWQsIGFuZCBpcyByZW1vdmVkIGZyb20gdGhlIERPTSB3aGVuIHRoZSB7QGxpbmsgTW9kdWxlI2RvbmV9IG1ldGhvZCBpcyBjYWxsZWQuXG4gICAgICogQHR5cGUge0RPTUVsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy52aWV3ID0gbnVsbDtcblxuICAgIHRoaXMuX293bnNWaWV3ID0gZmFsc2U7XG4gICAgdGhpcy5fc2hvd3NWaWV3ID0gZmFsc2U7XG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gICAgdGhpcy5faXNEb25lID0gZmFsc2U7XG5cbiAgICBpZiAoY3JlYXRlVmlldykge1xuICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnaWQnLCBuYW1lKTtcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKG5hbWUpO1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ21vZHVsZScpO1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoY29sb3IpO1xuXG4gICAgICB0aGlzLnZpZXcgPSBkaXY7XG4gICAgICB0aGlzLl9vd25zVmlldyA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gYmluZCBjb20gbWV0aG9kcyB0byB0aGUgaW5zdGFuY2UuXG4gICAgdGhpcy5zZW5kID0gdGhpcy5zZW5kLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWNlaXZlID0gdGhpcy5yZWNlaXZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lciA9IHRoaXMucmVtb3ZlTGlzdGVuZXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGVzIHRoZSBsb2dpYyBvZiB0aGUgbW9kdWxlIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAgICogRm9yIGluc3RhbmNlLCBpdCB0YWtlcyBjYXJlIG9mIHRoZSBjb21tdW5pY2F0aW9uIHdpdGggdGhlIG1vZHVsZSBvbiB0aGUgc2VydmVyIHNpZGUgYnkgc2VuZGluZyBXZWJTb2NrZXQgbWVzc2FnZXMgYW5kIHNldHRpbmcgdXAgV2ViU29ja2V0IG1lc3NhZ2UgbGlzdGVuZXJzLlxuICAgKiBBZGRpdGlvbmFsbHksIGlmIHRoZSBtb2R1bGUgaGFzIGEgYHZpZXdgLCB0aGUgYHN0YXJ0YCBtZXRob2QgY3JlYXRlcyB0aGUgY29ycmVzcG9uZGluZyBIVE1MIGVsZW1lbnQgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIERPTeKAmXMgbWFpbiBjb250YWluZXIgZWxlbWVudCAoYGRpdiNjb250YWluZXJgKS5cbiAgICpcbiAgICogKipOb3RlOioqIHRoZSBtZXRob2QgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgd2hlbiBuZWNlc3NhcnksIHlvdSBzaG91bGQgbm90IGNhbGwgaXQgbWFudWFsbHkuXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgaWYoIXRoaXMuX2lzU3RhcnRlZCkge1xuICAgICAgaWYgKHRoaXMudmlldykge1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy52aWV3KTtcbiAgICAgICAgdGhpcy5fc2hvd3NWaWV3ID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5faXNTdGFydGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBtb2R1bGUgdG8gdGhlIHN0YXRlIGl0IGhhZCBiZWZvcmUgY2FsbGluZyB0aGUge0BsaW5rIE1vZHVsZSNzdGFydH0gbWV0aG9kLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSAoZm9yIGluc3RhbmNlIHRvIHJlc2V0IHRoZSBtb2R1bGUgYWZ0ZXIgYSBzZXJ2ZXIgY3Jhc2ggaWYgdGhlIG1vZHVsZSBoYWQgbm90IGNhbGxlZCBpdHMge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2QgeWV0KSwgeW91IHNob3VsZCBub3QgY2FsbCBpdCBtYW51YWxseS5cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSAoZm9yIGluc3RhbmNlIHRvIHJlc3RhcnQgdGhlIG1vZHVsZSBhZnRlciBhIHNlcnZlciBjcmFzaCBpZiB0aGUgbW9kdWxlIGhhZCBhbHJlYWR5IGNhbGxlZCBpdHMge0BsaW5rIE1vZHVsZSNkb25lfSBtZXRob2QpLCB5b3Ugc2hvdWxkIG5vdCBjYWxsIGl0IG1hbnVhbGx5LlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgdGhpcy5faXNEb25lID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGxhdW5jaCgpIHtcbiAgICBpZiAodGhpcy5faXNEb25lKSB7XG4gICAgICB0aGlzLnJlc3RhcnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuX2lzU3RhcnRlZClcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuXG4gICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBiZSBjYWxsZWQgd2hlbiB0aGUgbW9kdWxlIGNhbiBoYW5kIG92ZXIgdGhlIGNvbnRyb2wgdG8gYSBzdWJzZXF1ZW50IG1vZHVsZSAoZm9yIGluc3RhbmNlIGF0IHRoZSBlbmQgb2YgdGhlIGBzdGFydGAgbWV0aG9kIHlvdSB3cml0ZSkuXG4gICAqIElmIHRoZSBtb2R1bGUgaGFzIGEgYHZpZXdgLCB0aGUgYGRvbmVgIG1ldGhvZCByZW1vdmVzIGl0IGZyb20gdGhlIERPTS5cbiAgICpcbiAgICogKipOb3RlOioqIHlvdSBzaG91bGQgbm90IG92ZXJyaWRlIHRoaXMgbWV0aG9kLlxuICAgKi9cbiAgZG9uZSgpIHtcbiAgICB0aGlzLl9pc0RvbmUgPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMudmlldyAmJiB0aGlzLl9zaG93c1ZpZXcgJiYgdGhpcy5fb3duc1ZpZXcpIHtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLnZpZXcpO1xuICAgICAgdGhpcy5fc2hvd3NWaWV3ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVzb2x2ZVByb21pc2VkKVxuICAgICAgdGhpcy5yZXNvbHZlUHJvbWlzZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgYW4gYXJiaXRyYXJ5IGNlbnRlcmVkIEhUTUwgY29udGVudCB0byB0aGUgbW9kdWxlJ3MgYHZpZXdgLlxuICAgKiBUaGUgbWV0aG9kIHNob3VsZCBiZSBjYWxsZWQgb25seSBpZiB0aGUgbW9kdWxlIGhhcyBhIGB2aWV3YC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGh0bWxDb250ZW50IFRoZSBIVE1MIGNvbnRlbnQgdG8gYXBwZW5kIHRvIHRoZSBgdmlld2AuXG4gICAqL1xuICBzZXRDZW50ZXJlZFZpZXdDb250ZW50KGh0bWxDb250ZW50KSB7XG4gICAgaWYgKHRoaXMudmlldykge1xuICAgICAgaWYgKCF0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50KSB7XG4gICAgICAgIGxldCBjb250ZW50RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgY29udGVudERpdi5jbGFzc0xpc3QuYWRkKCdjZW50ZXJlZC1jb250ZW50Jyk7XG4gICAgICAgIHRoaXMudmlldy5hcHBlbmRDaGlsZChjb250ZW50RGl2KTtcblxuICAgICAgICB0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50ID0gY29udGVudERpdjtcbiAgICAgIH1cblxuICAgICAgaWYgKGh0bWxDb250ZW50KSB7XG4gICAgICAgIGlmIChodG1sQ29udGVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudC5yZW1vdmVDaGlsZCh0aGlzLl9jZW50ZXJlZFZpZXdDb250ZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQuYXBwZW5kQ2hpbGQoaHRtbENvbnRlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGlzIGEgc3RyaW5nXG4gICAgICAgICAgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudC5pbm5lckhUTUwgPSBodG1sQ29udGVudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBjZW50ZXJlZCBIVE1MIGNvbnRlbnQgKHNldCBieSB7QGxpbmsgTW9kdWxlI3NldENlbnRlcmVkVmlld0NvbnRlbnR9KSBmcm9tIHRoZSBgdmlld2AuXG4gICAqL1xuICByZW1vdmVDZW50ZXJlZFZpZXdDb250ZW50KCkge1xuICAgIGlmICh0aGlzLnZpZXcgJiYgdGhpcy5fY2VudGVyZWRWaWV3Q29udGVudCkge1xuICAgICAgdGhpcy52aWV3LnJlbW92ZUNoaWxkKHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQpO1xuICAgICAgZGVsZXRlIHRoaXMuX2NlbnRlcmVkVmlld0NvbnRlbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGB6LWluZGV4YCBDU1MgcHJvcGVydHkgb2YgdGhlIHZpZXdcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIFZhbHVlIG9mIHRoZSBgei1pbmRleGAuXG4gICAqL1xuICBzZXQgekluZGV4KHZhbHVlKSB7XG4gICAgaWYodGhpcy52aWV3KVxuICAgICAgdGhpcy52aWV3LnN0eWxlLnpJbmRleCA9IHZhbHVlO1xuICB9XG5cbiAgc2VuZChjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgLy8gY29uc29sZS5sb2coYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YCwgdGhpcyk7XG4gICAgY29tbS5zZW5kKGAke3RoaXMubmFtZX06JHtjaGFubmVsfWAsIC4uLmFyZ3MpXG4gIH1cblxuICByZWNlaXZlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgLy8gY29uc29sZS5sb2coYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YCwgdGhpcyk7XG4gICAgY29tbS5yZWNlaXZlKGAke3RoaXMubmFtZX06JHtjaGFubmVsfWAsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY29tbS5yZW1vdmVMaXN0ZW5lcihgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuTW9kdWxlLnNlcXVlbnRpYWwgPSBmdW5jdGlvbiguLi5tb2R1bGVzKSB7XG4gIHJldHVybiBuZXcgU2VxdWVudGlhbChtb2R1bGVzKTtcbn07XG5cbk1vZHVsZS5wYXJhbGxlbCA9IGZ1bmN0aW9uKC4uLm1vZHVsZXMpIHtcbiAgcmV0dXJuIG5ldyBQYXJhbGxlbChtb2R1bGVzKTtcbn07XG4iXX0=