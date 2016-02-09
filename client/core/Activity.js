'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Process2 = require('./Process');

var _Process3 = _interopRequireDefault(_Process2);

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

var Activity = (function (_Process) {
  _inherits(Activity, _Process);

  function Activity(id) {
    var hasNetwork = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    _classCallCheck(this, Activity);

    _get(Object.getPrototypeOf(Activity.prototype), 'constructor', this).call(this, id);

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
     * Options of the process.
     * @type {Object}
     */
    this.options = {};
    this.configure({ viewPriority: 0 });

    /**
     * Define which signal the `Activity` requires to start.
     * @private
     */
    this.requiredSignals = new _SignalAll2['default']();

    this.send = this.send.bind(this);
    this.sendVolatile = this.sendVolatile.bind(this);
    this.receive = this.receive.bind(this);
    this.removeListener = this.removeListener.bind(this);
  }

  /**
   * Interface method to be implemented in child classes.
   * Define what to do when a service is required by an `Activity`.
   */

  _createClass(Activity, [{
    key: 'require',
    value: function require() {}

    /**
     * Configure the process with the given options.
     * @param {Object} options
     */
  }, {
    key: 'configure',
    value: function configure(options) {
      _Object$assign(this.options, options);
    }

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
})(_Process3['default']);

exports['default'] = Activity;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9BY3Rpdml0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7d0JBQW9CLFdBQVc7Ozs7c0JBQ1osVUFBVTs7Ozt5QkFDUCxhQUFhOzs7O3NCQUNoQixVQUFVOzs7OzJCQUNaLGlCQUFpQjs7OzsyQkFDVixlQUFlOzs7Ozs7OztJQU9sQixRQUFRO1lBQVIsUUFBUTs7QUFDaEIsV0FEUSxRQUFRLENBQ2YsRUFBRSxFQUFxQjtRQUFuQixVQUFVLHlEQUFHLElBQUk7OzBCQURkLFFBQVE7O0FBRXpCLCtCQUZpQixRQUFRLDZDQUVuQixFQUFFLEVBQUU7Ozs7OztBQU1WLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDOzs7OztBQUt4QixRQUFJLFVBQVUsRUFDWixvQkFBTyxRQUFRLEdBQUcsSUFBSSxDQUFDOzs7Ozs7QUFNekIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Ozs7OztBQU1qQixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBTWpCLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNdEIsUUFBSSxDQUFDLFFBQVEsMkJBQU8sQ0FBQzs7Ozs7O0FBTXJCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOzs7Ozs7QUFNckIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7QUFNcEMsUUFBSSxDQUFDLGVBQWUsR0FBRyw0QkFBZSxDQUFDOztBQUV2QyxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakQsUUFB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SUFBSSxFQUFFO0FBQ3RDLGNBQVEsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0tBQy9DOzs7Ozs7Ozs7V0FPK0IsbUNBQUMsSUFBSSxFQUFFO0FBQ3JDLGNBQVEsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0tBQzlDOzs7U0EvRmtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6InNyYy9jbGllbnQvY29yZS9BY3Rpdml0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9jZXNzIGZyb20gJy4vUHJvY2Vzcyc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi9TaWduYWxBbGwnO1xuaW1wb3J0IHNvY2tldCBmcm9tICcuL3NvY2tldCc7XG5pbXBvcnQgVmlldyBmcm9tICcuLi9kaXNwbGF5L1ZpZXcnO1xuaW1wb3J0IHZpZXdNYW5hZ2VyIGZyb20gJy4vdmlld01hbmFnZXInO1xuXG5cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBzZXJ2aWNlcyBhbmQgc2NlbmVzLiBCYXNpY2FsbHkgYSBwcm9jZXNzIHdpdGggdmlldyBhbmQgb3B0aW9ubmFsIG5ldHdvcmsgYWJpbGl0aWVzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY3Rpdml0eSBleHRlbmRzIFByb2Nlc3Mge1xuICBjb25zdHJ1Y3RvcihpZCwgaGFzTmV0d29yayA9IHRydWUpIHtcbiAgICBzdXBlcihpZCk7XG5cbiAgICAvKipcbiAgICAgKiBJZiBgdHJ1ZWAsIGRlZmluZSBpZiB0aGUgcHJvY2VzcyBoYXMgYmVlbiBzdGFydGVkIG9uY2UuXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5oYXNTdGFydGVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBhcyBhIG5ldHdvcmtlZCBzZXJ2aWNlLlxuICAgICAqL1xuICAgIGlmIChoYXNOZXR3b3JrKVxuICAgICAgc29ja2V0LnJlcXVpcmVkID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIFZpZXcgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7Vmlld31cbiAgICAgKi9cbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnRzIHRvIGJpbmQgdG8gdGhlIHZpZXcuIChjZi4gQmFja2JvbmUncyBzeW50YXgpLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFkZGl0aW9ubmFsIG9wdGlvbnMgdG8gcGFzcyB0byB0aGUgdmlldy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMudmlld09wdGlvbnMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgYSB2aWV3IGNvbnN0cnVjdG9yIHRvIGJlIHVzZWQgaW4gYGNyZWF0ZVZpZXdgLlxuICAgICAqIEB0eXBlIHtWaWV3fVxuICAgICAqL1xuICAgIHRoaXMudmlld0N0b3IgPSBWaWV3O1xuXG4gICAgLyoqXG4gICAgICogVGhlIHRlbXBsYXRlIG9mIHRoZSB2aWV3ICh1c2UgYGxvZGFzaC50ZW1wbGF0ZWAgc3ludGF4KS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMudGVtcGxhdGUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ucyBvZiB0aGUgcHJvY2Vzcy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgIHRoaXMuY29uZmlndXJlKHsgdmlld1ByaW9yaXR5OiAwIH0pO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lIHdoaWNoIHNpZ25hbCB0aGUgYEFjdGl2aXR5YCByZXF1aXJlcyB0byBzdGFydC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucmVxdWlyZWRTaWduYWxzID0gbmV3IFNpZ25hbEFsbCgpO1xuXG4gICAgdGhpcy5zZW5kID0gdGhpcy5zZW5kLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zZW5kVm9sYXRpbGUgPSB0aGlzLnNlbmRWb2xhdGlsZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVjZWl2ZSA9IHRoaXMucmVjZWl2ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIgPSB0aGlzLnJlbW92ZUxpc3RlbmVyLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBiZSBpbXBsZW1lbnRlZCBpbiBjaGlsZCBjbGFzc2VzLlxuICAgKiBEZWZpbmUgd2hhdCB0byBkbyB3aGVuIGEgc2VydmljZSBpcyByZXF1aXJlZCBieSBhbiBgQWN0aXZpdHlgLlxuICAgKi9cbiAgcmVxdWlyZSgpIHt9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSB0aGUgcHJvY2VzcyB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2hhcmUgdGhlIGRlZmluZWQgdGVtcGxhdGVzIHdpdGggYWxsIGBBY3Rpdml0eWAgaW5zdGFuY2VzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmcyAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSB0ZW1wbGF0ZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGF0aWMgc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmcykge1xuICAgIEFjdGl2aXR5LnByb3RvdHlwZS50ZW1wbGF0ZURlZmluaXRpb25zID0gZGVmcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTaGFyZSB0aGUgdGV4dCBjb250ZW50IGNvbmZpZ3VyYXRpb24gKG5hbWUgYW5kIGRhdGEpIHdpdGggYWxsIHRoZSBgQWN0aXZpdHlgIGluc3RhbmNlc1xuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmcyAtIFRoZSB0ZXh0IGNvbnRlbnRzIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXRpYyBzZXRWaWV3Q29udGVudERlZmluaXRpb25zKGRlZnMpIHtcbiAgICBBY3Rpdml0eS5wcm90b3R5cGUuY29udGVudERlZmluaXRpb25zID0gZGVmcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0ZW1wbGF0ZSBhc3NvY2lhdGVkIHRvIHRoZSBjdXJyZW50IG1vZHVsZS5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSAtIFRoZSB0ZW1wbGF0ZSByZWxhdGVkIHRvIHRoZSBgbmFtZWAgb2YgdGhlIGN1cnJlbnQgbW9kdWxlLlxuICAgKi9cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy5fdGVtcGxhdGUgfHzCoHRoaXMudGVtcGxhdGVEZWZpbml0aW9uc1t0aGlzLmlkXTtcbiAgICAvLyBpZiAoIXRlbXBsYXRlKVxuICAgIC8vICAgdGhyb3cgbmV3IEVycm9yKGBObyB0ZW1wbGF0ZSBkZWZpbmVkIGZvciBtb2R1bGUgXCIke3RoaXMuaWR9XCJgKTtcbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH1cblxuICBzZXQgdGVtcGxhdGUodG1wbCkge1xuICAgIHRoaXMuX3RlbXBsYXRlID0gdG1wbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0ZXh0IGFzc29jaWF0ZWQgdG8gdGhlIGN1cnJlbnQgbW9kdWxlLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSAtIFRoZSB0ZXh0IGNvbnRlbnRzIHJlbGF0ZWQgdG8gdGhlIGBuYW1lYCBvZiB0aGUgY3VycmVudCBtb2R1bGUuIFRoZSByZXR1cm5lZCBvYmplY3QgaXMgZXh0ZW5kZWQgd2l0aCBhIHBvaW50ZXIgdG8gdGhlIGBnbG9iYWxzYCBlbnRyeSBvZiB0aGUgZGVmaW5lZCB0ZXh0IGNvbnRlbnRzLlxuICAgKi9cbiAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuX2NvbnRlbnQgfHzCoHRoaXMuY29udGVudERlZmluaXRpb25zW3RoaXMuaWRdO1xuXG4gICAgaWYgKGNvbnRlbnQpXG4gICAgICBjb250ZW50Lmdsb2JhbHMgPSB0aGlzLmNvbnRlbnREZWZpbml0aW9ucy5nbG9iYWxzO1xuXG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBzZXQgY29udGVudChvYmopIHtcbiAgICB0aGlzLl9jb250ZW50ID0gb2JqO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgdmlldyBvZiB0aGUgbW9kdWxlIGFjY29yZGluZyB0byBpdHMgYXR0cmlidXRlcy5cbiAgICovXG4gIGNyZWF0ZVZpZXcoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICBjbGFzc05hbWU6ICdtb2R1bGUnLFxuICAgICAgcHJpb3JpdHk6IHRoaXMub3B0aW9ucy52aWV3UHJpb3JpdHksXG4gICAgfSwgdGhpcy52aWV3T3B0aW9ucyk7XG5cbiAgICByZXR1cm4gbmV3IHRoaXMudmlld0N0b3IodGhpcy50ZW1wbGF0ZSwgdGhpcy5jb250ZW50LCB0aGlzLmV2ZW50cywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGxheSB0aGUgdmlldyBvZiBhIG1vZHVsZSBpZiBpdCBvd25zIG9uZS5cbiAgICovXG4gIHNob3coKSB7XG4gICAgaWYgKCF0aGlzLnZpZXcpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gICAgdmlld01hbmFnZXIucmVnaXN0ZXIodGhpcy52aWV3KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlIHRoZSB2aWV3IG9mIGFuIGFjdGl2aXR5IGlmIGl0IG93bnMgb25lLlxuICAgKi9cbiAgaGlkZSgpIHtcbiAgICBpZiAoIXRoaXMudmlldykgeyByZXR1cm47IH1cblxuICAgIHZpZXdNYW5hZ2VyLnJlbW92ZSh0aGlzLnZpZXcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIHNvY2tldC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgc29ja2V0LnNlbmQoYCR7dGhpcy5pZH06JHtjaGFubmVsfWAsIC4uLmFyZ3MpXG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyIHNpZGUgc29ja2V0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kVm9sYXRpbGUoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIHNvY2tldC5zZW5kVm9sYXRpbGUoYCR7dGhpcy5pZH06JHtjaGFubmVsfWAsIC4uLmFyZ3MpXG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgc29ja2V0LnJlY2VpdmUoYCR7dGhpcy5pZH06JHtjaGFubmVsfWAsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIGxpc3RlbmluZyB0byBhIG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGNhbmNlbC5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCBjYWxsYmFjayk7XG4gIH1cbn1cbiJdfQ==