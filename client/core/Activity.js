'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _SignalAll = require('./SignalAll');

var _SignalAll2 = _interopRequireDefault(_SignalAll);

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

var _displayView = require('../display/View');

var _displayView2 = _interopRequireDefault(_displayView);

var _viewManager = require('./viewManager');

var _viewManager2 = _interopRequireDefault(_viewManager);

/**
 * Base class for services and scenes. Basically a process with view and optionnal network abilities.
 */

var Activity = (function () {
  function Activity(id) {
    var hasNetwork = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    _classCallCheck(this, Activity);

    /**
     * Name of the module.
     * @type {String}
     */
    this.id = id;

    /**
     * If `true`, define if the process has been started once.
     * @type {Boolean}
     */
    this.hasStarted = false;

    /**
     * Register as a networked service.
     */
    if (hasNetwork) _socket2['default'].required = true;

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
    this.viewOptions = {};

    /**
     * Defines a view constructor to be used in `createView`.
     * @type {View}
     */
    this.viewCtor = _displayView2['default'];

    /**
     * The template of the view (use `lodash.template` syntax).
     * @type {String}
     */
    this.template = null;

    /**
     * Signals defining the process state.
     * @type {Object}
     */
    this.signals = {};
    this.signals.active = new _Signal2['default']();

    /**
     * Options of the process.
     * @type {Object}
     */
    this.options = {};
    this.configure({ viewPriority: 0 });

    this.send = this.send.bind(this);
    this.sendVolatile = this.sendVolatile.bind(this);
    this.receive = this.receive.bind(this);
    this.removeListener = this.removeListener.bind(this);
  }

  /**
   * Configure the process with the given options.
   * @param {Object} options
   */

  _createClass(Activity, [{
    key: 'configure',
    value: function configure(options) {
      _Object$assign(this.options, options);
    }

    /**
     * Interface method to define which signal must be listened in order to start the activity
     */
  }, {
    key: 'require',
    value: function require() {}

    /**
     * Share the defined templates with all `Activity` instances.
     * @param {Object} defs - An object containing the templates.
     * @private
     */
  }, {
    key: 'createView',

    /**
     * Create the view of the module according to its attributes.
     */
    value: function createView() {
      var options = _Object$assign({
        id: this.id,
        className: 'module',
        priority: this.options.viewPriority
      }, this.viewOptions);

      return new this.viewCtor(this.template, this.content, this.events, options);
    }

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
      this.signals.active.set(true);
    }

    /**
     * This method should be considered as the opposite of {@link Activity#start}, removing listeners from socket or other module (aka motionInput).
     * It is internally called at 2 different moment of the module's lifecycle:
     * - when the module is {@link Activity#done}
     * - when the module has to restart because of a socket reconnection during the active state of the module. In this particular case the module is stopped, initialized and started again.
     *
     * **Note:** the method is called automatically when necessary, you should not call it manually.
     * @abstract
     */
  }, {
    key: 'stop',
    value: function stop() {
      this.signals.active.set(false);
    }

    /**
     * Display the view of a module if it owns one.
     */
  }, {
    key: 'show',
    value: function show() {
      if (!this.view) {
        return;
      }

      this.view.render();
      _viewManager2['default'].register(this.view);
    }

    /**
     * Hide the view of an activity if it owns one.
     */
  }, {
    key: 'hide',
    value: function hide() {
      if (!this.view) {
        return;
      }

      _viewManager2['default'].remove(this.view);
    }

    /**
     * Sends a WebSocket message to the server side socket.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
  }, {
    key: 'send',
    value: function send(channel) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      _socket2['default'].send.apply(_socket2['default'], [this.id + ':' + channel].concat(args));
    }

    /**
     * Sends a WebSocket message to the server side socket.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
  }, {
    key: 'sendVolatile',
    value: function sendVolatile(channel) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      _socket2['default'].sendVolatile.apply(_socket2['default'], [this.id + ':' + channel].concat(args));
    }

    /**
     * Listen a WebSocket message from the server.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} callback - The callback to execute when a message is received.
     */
  }, {
    key: 'receive',
    value: function receive(channel, callback) {
      _socket2['default'].receive(this.id + ':' + channel, callback);
    }

    /**
     * Stop listening to a message from the server.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} callback - The callback to cancel.
     */
  }, {
    key: 'removeListener',
    value: function removeListener(channel, callback) {
      _socket2['default'].removeListener(this.id + ':' + channel, callback);
    }
  }, {
    key: 'template',

    /**
     * Returns the template associated to the current module.
     * @returns {Function} - The template related to the `name` of the current module.
     */
    get: function get() {
      var template = this._template || this.templateDefinitions[this.id];
      // if (!template)
      //   throw new Error(`No template defined for module "${this.id}"`);
      return template;
    },
    set: function set(tmpl) {
      this._template = tmpl;
    }

    /**
     * Returns the text associated to the current module.
     * @returns {Object} - The text contents related to the `name` of the current module. The returned object is extended with a pointer to the `globals` entry of the defined text contents.
     */
  }, {
    key: 'content',
    get: function get() {
      var content = this._content || this.contentDefinitions[this.id];

      if (content) content.globals = this.contentDefinitions.globals;

      return content;
    },
    set: function set(obj) {
      this._content = obj;
    }
  }], [{
    key: 'setViewTemplateDefinitions',
    value: function setViewTemplateDefinitions(defs) {
      Activity.prototype.templateDefinitions = defs;
    }

    /**
     * Share the text content configuration (name and data) with all the `Activity` instances
     * @param {Object} defs - The text contents of the application.
     * @private
     */
  }, {
    key: 'setViewContentDefinitions',
    value: function setViewContentDefinitions(defs) {
      Activity.prototype.contentDefinitions = defs;
    }
  }]);

  return Activity;
})();

exports['default'] = Activity;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9BY3Rpdml0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt5QkFDUCxhQUFhOzs7O3NCQUNoQixVQUFVOzs7OzJCQUNaLGlCQUFpQjs7OzsyQkFDVixlQUFlOzs7Ozs7OztJQU9sQixRQUFRO0FBQ2hCLFdBRFEsUUFBUSxDQUNmLEVBQUUsRUFBcUI7UUFBbkIsVUFBVSx5REFBRyxJQUFJOzswQkFEZCxRQUFROzs7Ozs7QUFPekIsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7Ozs7OztBQU1iLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDOzs7OztBQUt4QixRQUFJLFVBQVUsRUFDWixvQkFBTyxRQUFRLEdBQUcsSUFBSSxDQUFDOzs7Ozs7QUFNekIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Ozs7OztBQU1qQixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBTWpCLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNdEIsUUFBSSxDQUFDLFFBQVEsMkJBQU8sQ0FBQzs7Ozs7O0FBTXJCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOzs7Ozs7QUFNckIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcseUJBQVksQ0FBQzs7Ozs7O0FBTW5DLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFcEMsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQyxRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElB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QUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVsRSxVQUFJLE9BQU8sRUFDVCxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUM7O0FBRXBELGFBQU8sT0FBTyxDQUFDO0tBQ2hCO1NBRVUsYUFBQyxHQUFHLEVBQUU7QUFDZixVQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztLQUNyQjs7O1dBM0NnQyxvQ0FBQyxJQUFJLEVBQUU7QUFDdEMsY0FBUSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7S0FDL0M7Ozs7Ozs7OztXQU8rQixtQ0FBQyxJQUFJLEVBQUU7QUFDckMsY0FBUSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7S0FDOUM7OztTQXBHa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoic3JjL2NsaWVudC9jb3JlL0FjdGl2aXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5pbXBvcnQgU2lnbmFsQWxsIGZyb20gJy4vU2lnbmFsQWxsJztcbmltcG9ydCBzb2NrZXQgZnJvbSAnLi9zb2NrZXQnO1xuaW1wb3J0IFZpZXcgZnJvbSAnLi4vZGlzcGxheS9WaWV3JztcbmltcG9ydCB2aWV3TWFuYWdlciBmcm9tICcuL3ZpZXdNYW5hZ2VyJztcblxuXG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3Igc2VydmljZXMgYW5kIHNjZW5lcy4gQmFzaWNhbGx5IGEgcHJvY2VzcyB3aXRoIHZpZXcgYW5kIG9wdGlvbm5hbCBuZXR3b3JrIGFiaWxpdGllcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcihpZCwgaGFzTmV0d29yayA9IHRydWUpIHtcblxuICAgIC8qKlxuICAgICAqIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuaWQgPSBpZDtcblxuICAgIC8qKlxuICAgICAqIElmIGB0cnVlYCwgZGVmaW5lIGlmIHRoZSBwcm9jZXNzIGhhcyBiZWVuIHN0YXJ0ZWQgb25jZS5cbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLmhhc1N0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGFzIGEgbmV0d29ya2VkIHNlcnZpY2UuXG4gICAgICovXG4gICAgaWYgKGhhc05ldHdvcmspXG4gICAgICBzb2NrZXQucmVxdWlyZWQgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogVmlldyBvZiB0aGUgbW9kdWxlLlxuICAgICAqIEB0eXBlIHtWaWV3fVxuICAgICAqL1xuICAgIHRoaXMudmlldyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudHMgdG8gYmluZCB0byB0aGUgdmlldy4gKGNmLiBCYWNrYm9uZSdzIHN5bnRheCkuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQWRkaXRpb25uYWwgb3B0aW9ucyB0byBwYXNzIHRvIHRoZSB2aWV3LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy52aWV3T3B0aW9ucyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBhIHZpZXcgY29uc3RydWN0b3IgdG8gYmUgdXNlZCBpbiBgY3JlYXRlVmlld2AuXG4gICAgICogQHR5cGUge1ZpZXd9XG4gICAgICovXG4gICAgdGhpcy52aWV3Q3RvciA9IFZpZXc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdGVtcGxhdGUgb2YgdGhlIHZpZXcgKHVzZSBgbG9kYXNoLnRlbXBsYXRlYCBzeW50YXgpLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy50ZW1wbGF0ZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBTaWduYWxzIGRlZmluaW5nIHRoZSBwcm9jZXNzIHN0YXRlLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5zaWduYWxzID0ge307XG4gICAgdGhpcy5zaWduYWxzLmFjdGl2ZSA9IG5ldyBTaWduYWwoKTtcblxuICAgIC8qKlxuICAgICAqIE9wdGlvbnMgb2YgdGhlIHByb2Nlc3MuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB0aGlzLmNvbmZpZ3VyZSh7IHZpZXdQcmlvcml0eTogMCB9KTtcblxuICAgIHRoaXMuc2VuZCA9IHRoaXMuc2VuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2VuZFZvbGF0aWxlID0gdGhpcy5zZW5kVm9sYXRpbGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlY2VpdmUgPSB0aGlzLnJlY2VpdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyID0gdGhpcy5yZW1vdmVMaXN0ZW5lci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSB0aGUgcHJvY2VzcyB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBkZWZpbmUgd2hpY2ggc2lnbmFsIG11c3QgYmUgbGlzdGVuZWQgaW4gb3JkZXIgdG8gc3RhcnQgdGhlIGFjdGl2aXR5XG4gICAqL1xuICByZXF1aXJlKCkge31cblxuICAvKipcbiAgICogU2hhcmUgdGhlIGRlZmluZWQgdGVtcGxhdGVzIHdpdGggYWxsIGBBY3Rpdml0eWAgaW5zdGFuY2VzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmcyAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSB0ZW1wbGF0ZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGF0aWMgc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmcykge1xuICAgIEFjdGl2aXR5LnByb3RvdHlwZS50ZW1wbGF0ZURlZmluaXRpb25zID0gZGVmcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTaGFyZSB0aGUgdGV4dCBjb250ZW50IGNvbmZpZ3VyYXRpb24gKG5hbWUgYW5kIGRhdGEpIHdpdGggYWxsIHRoZSBgQWN0aXZpdHlgIGluc3RhbmNlc1xuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmcyAtIFRoZSB0ZXh0IGNvbnRlbnRzIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXRpYyBzZXRWaWV3Q29udGVudERlZmluaXRpb25zKGRlZnMpIHtcbiAgICBBY3Rpdml0eS5wcm90b3R5cGUuY29udGVudERlZmluaXRpb25zID0gZGVmcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0ZW1wbGF0ZSBhc3NvY2lhdGVkIHRvIHRoZSBjdXJyZW50IG1vZHVsZS5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSAtIFRoZSB0ZW1wbGF0ZSByZWxhdGVkIHRvIHRoZSBgbmFtZWAgb2YgdGhlIGN1cnJlbnQgbW9kdWxlLlxuICAgKi9cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy5fdGVtcGxhdGUgfHzCoHRoaXMudGVtcGxhdGVEZWZpbml0aW9uc1t0aGlzLmlkXTtcbiAgICAvLyBpZiAoIXRlbXBsYXRlKVxuICAgIC8vICAgdGhyb3cgbmV3IEVycm9yKGBObyB0ZW1wbGF0ZSBkZWZpbmVkIGZvciBtb2R1bGUgXCIke3RoaXMuaWR9XCJgKTtcbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH1cblxuICBzZXQgdGVtcGxhdGUodG1wbCkge1xuICAgIHRoaXMuX3RlbXBsYXRlID0gdG1wbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0ZXh0IGFzc29jaWF0ZWQgdG8gdGhlIGN1cnJlbnQgbW9kdWxlLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSAtIFRoZSB0ZXh0IGNvbnRlbnRzIHJlbGF0ZWQgdG8gdGhlIGBuYW1lYCBvZiB0aGUgY3VycmVudCBtb2R1bGUuIFRoZSByZXR1cm5lZCBvYmplY3QgaXMgZXh0ZW5kZWQgd2l0aCBhIHBvaW50ZXIgdG8gdGhlIGBnbG9iYWxzYCBlbnRyeSBvZiB0aGUgZGVmaW5lZCB0ZXh0IGNvbnRlbnRzLlxuICAgKi9cbiAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuX2NvbnRlbnQgfHzCoHRoaXMuY29udGVudERlZmluaXRpb25zW3RoaXMuaWRdO1xuXG4gICAgaWYgKGNvbnRlbnQpXG4gICAgICBjb250ZW50Lmdsb2JhbHMgPSB0aGlzLmNvbnRlbnREZWZpbml0aW9ucy5nbG9iYWxzO1xuXG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBzZXQgY29udGVudChvYmopIHtcbiAgICB0aGlzLl9jb250ZW50ID0gb2JqO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgdmlldyBvZiB0aGUgbW9kdWxlIGFjY29yZGluZyB0byBpdHMgYXR0cmlidXRlcy5cbiAgICovXG4gIGNyZWF0ZVZpZXcoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICBjbGFzc05hbWU6ICdtb2R1bGUnLFxuICAgICAgcHJpb3JpdHk6IHRoaXMub3B0aW9ucy52aWV3UHJpb3JpdHksXG4gICAgfSwgdGhpcy52aWV3T3B0aW9ucyk7XG5cbiAgICByZXR1cm4gbmV3IHRoaXMudmlld0N0b3IodGhpcy50ZW1wbGF0ZSwgdGhpcy5jb250ZW50LCB0aGlzLmV2ZW50cywgb3B0aW9ucyk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBIYW5kbGUgdGhlIGxvZ2ljIGFuZCBzdGVwcyB0aGF0IHN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBJcyBtYWlubHkgdXNlZCB0byBhdHRhY2ggbGlzdGVuZXJzIHRvIGNvbW11bmljYXRpb24gd2l0aCB0aGUgc2VydmVyIG9yIG90aGVyIG1vZHVsZXMgKGUuZy4gbW90aW9uSW5wdXQpLiBJZiB0aGUgbW9kdWxlIGhhcyBhIHZpZXcsIGl0IGlzIGF0dGFjaCB0byB0aGUgRE9NLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSwgeW91IHNob3VsZCBub3QgY2FsbCBpdCBtYW51YWxseS5cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBzdGFydCgpIHtcbiAgICB0aGlzLnNpZ25hbHMuYWN0aXZlLnNldCh0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgY29uc2lkZXJlZCBhcyB0aGUgb3Bwb3NpdGUgb2Yge0BsaW5rIEFjdGl2aXR5I3N0YXJ0fSwgcmVtb3ZpbmcgbGlzdGVuZXJzIGZyb20gc29ja2V0IG9yIG90aGVyIG1vZHVsZSAoYWthIG1vdGlvbklucHV0KS5cbiAgICogSXQgaXMgaW50ZXJuYWxseSBjYWxsZWQgYXQgMiBkaWZmZXJlbnQgbW9tZW50IG9mIHRoZSBtb2R1bGUncyBsaWZlY3ljbGU6XG4gICAqIC0gd2hlbiB0aGUgbW9kdWxlIGlzIHtAbGluayBBY3Rpdml0eSNkb25lfVxuICAgKiAtIHdoZW4gdGhlIG1vZHVsZSBoYXMgdG8gcmVzdGFydCBiZWNhdXNlIG9mIGEgc29ja2V0IHJlY29ubmVjdGlvbiBkdXJpbmcgdGhlIGFjdGl2ZSBzdGF0ZSBvZiB0aGUgbW9kdWxlLiBJbiB0aGlzIHBhcnRpY3VsYXIgY2FzZSB0aGUgbW9kdWxlIGlzIHN0b3BwZWQsIGluaXRpYWxpemVkIGFuZCBzdGFydGVkIGFnYWluLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSwgeW91IHNob3VsZCBub3QgY2FsbCBpdCBtYW51YWxseS5cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuc2lnbmFscy5hY3RpdmUuc2V0KGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5IHRoZSB2aWV3IG9mIGEgbW9kdWxlIGlmIGl0IG93bnMgb25lLlxuICAgKi9cbiAgc2hvdygpIHtcbiAgICBpZiAoIXRoaXMudmlldykgeyByZXR1cm47IH1cblxuICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICB2aWV3TWFuYWdlci5yZWdpc3Rlcih0aGlzLnZpZXcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGUgdGhlIHZpZXcgb2YgYW4gYWN0aXZpdHkgaWYgaXQgb3ducyBvbmUuXG4gICAqL1xuICBoaWRlKCkge1xuICAgIGlmICghdGhpcy52aWV3KSB7IHJldHVybjsgfVxuXG4gICAgdmlld01hbmFnZXIucmVtb3ZlKHRoaXMudmlldyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyIHNpZGUgc29ja2V0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBzb2NrZXQuc2VuZChgJHt0aGlzLmlkfToke2NoYW5uZWx9YCwgLi4uYXJncylcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmRWb2xhdGlsZShjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgc29ja2V0LnNlbmRWb2xhdGlsZShgJHt0aGlzLmlkfToke2NoYW5uZWx9YCwgLi4uYXJncylcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gYSBXZWJTb2NrZXQgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBzb2NrZXQucmVjZWl2ZShgJHt0aGlzLmlkfToke2NoYW5uZWx9YCwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgbGlzdGVuaW5nIHRvIGEgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gY2FuY2VsLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBzb2NrZXQucmVtb3ZlTGlzdGVuZXIoYCR7dGhpcy5pZH06JHtjaGFubmVsfWAsIGNhbGxiYWNrKTtcbiAgfVxufVxuIl19