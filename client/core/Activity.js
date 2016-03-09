'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Process2 = require('./Process');

var _Process3 = _interopRequireDefault(_Process2);

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _SignalAll = require('./SignalAll');

var _SignalAll2 = _interopRequireDefault(_SignalAll);

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

var _View = require('../views/View');

var _View2 = _interopRequireDefault(_View);

var _viewManager = require('./viewManager');

var _viewManager2 = _interopRequireDefault(_viewManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base class for services and scenes. Basically a process with view and optionnal network abilities.
 */

var Activity = function (_Process) {
  (0, _inherits3.default)(Activity, _Process);

  function Activity(id) {
    var hasNetwork = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
    (0, _classCallCheck3.default)(this, Activity);


    /**
     * If `true`, define if the process has been started once.
     * @type {Boolean}
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Activity).call(this, id));

    _this.hasStarted = false;

    /**
     * Register as a networked service.
     */
    if (hasNetwork) {
      _this.hasNetwork = true;
      _socket2.default.required = true;
    }

    /**
     * View of the module.
     * @type {View}
     */
    _this.view = null;

    /**
     * Events to bind to the view. (cf. Backbone's syntax).
     * @type {Object}
     */
    _this.events = {};

    /**
     * Additionnal options to pass to the view.
     * @type {Object}
     */
    _this.viewOptions = {};

    /**
     * Defines a view constructor to be used in `createView`.
     * @type {View}
     */
    _this.viewCtor = _View2.default;

    /**
     * The template of the view (use `lodash.template` syntax).
     * @type {String}
     */
    _this.template = null;

    /**
     * Options of the process.
     * @type {Object}
     */
    _this.options = {};
    _this.configure({ viewPriority: 0 });

    /**
     * Define which signal the `Activity` requires to start.
     * @private
     */
    _this.requiredSignals = new _SignalAll2.default();

    _this.send = _this.send.bind(_this);
    _this.sendVolatile = _this.sendVolatile.bind(_this);
    _this.receive = _this.receive.bind(_this);
    _this.removeListener = _this.removeListener.bind(_this);
    return _this;
  }

  /**
   * Interface method to be implemented in child classes.
   * Define what to do when a service is required by an `Activity`.
   */


  (0, _createClass3.default)(Activity, [{
    key: 'require',
    value: function require() {}

    /**
     * Configure the process with the given options.
     * @param {Object} options
     */

  }, {
    key: 'configure',
    value: function configure(options) {
      (0, _assign2.default)(this.options, options);
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
      var options = (0, _assign2.default)({
        id: this.id,
        className: 'activity',
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
      _viewManager2.default.register(this.view);
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

      _viewManager2.default.remove(this.view);
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

      _socket2.default.send.apply(_socket2.default, [this.id + ':' + channel].concat(args));
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

      _socket2.default.sendVolatile.apply(_socket2.default, [this.id + ':' + channel].concat(args));
    }

    /**
     * Listen a WebSocket message from the server.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} callback - The callback to execute when a message is received.
     */

  }, {
    key: 'receive',
    value: function receive(channel, callback) {
      _socket2.default.receive(this.id + ':' + channel, callback);
    }

    /**
     * Stop listening to a message from the server.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} callback - The callback to cancel.
     */

  }, {
    key: 'removeListener',
    value: function removeListener(channel, callback) {
      _socket2.default.removeListener(this.id + ':' + channel, callback);
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
}(_Process3.default);

exports.default = Activity;
//# sourceMappingURL=data:application/json;base64,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QixLQUFLLEVBQUwsU0FBVyxPQUFwQyxFQUErQyxRQUEvQyxFQURnQzs7Ozs7Ozs7Ozt3QkE1Rm5CO0FBQ2IsVUFBTSxXQUFXLEtBQUssU0FBTCxJQUFrQixLQUFLLG1CQUFMLENBQXlCLEtBQUssRUFBTCxDQUEzQzs7O0FBREosYUFJTixRQUFQLENBSmE7O3NCQU9GLE1BQU07QUFDakIsV0FBSyxTQUFMLEdBQWlCLElBQWpCLENBRGlCOzs7Ozs7Ozs7O3dCQVFMO0FBQ1osVUFBTSxVQUFVLEtBQUssUUFBTCxJQUFpQixLQUFLLGtCQUFMLENBQXdCLEtBQUssRUFBTCxDQUF6QyxDQURKOztBQUdaLFVBQUksT0FBSixFQUNFLFFBQVEsT0FBUixHQUFrQixLQUFLLGtCQUFMLENBQXdCLE9BQXhCLENBRHBCOztBQUdBLGFBQU8sT0FBUCxDQU5ZOztzQkFTRixLQUFLO0FBQ2YsV0FBSyxRQUFMLEdBQWdCLEdBQWhCLENBRGU7Ozs7K0NBekNpQixNQUFNO0FBQ3RDLGVBQVMsU0FBVCxDQUFtQixtQkFBbkIsR0FBeUMsSUFBekMsQ0FEc0M7Ozs7Ozs7Ozs7OzhDQVNQLE1BQU07QUFDckMsZUFBUyxTQUFULENBQW1CLGtCQUFuQixHQUF3QyxJQUF4QyxDQURxQzs7O1NBL0ZwQiIsImZpbGUiOiJBY3Rpdml0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9jZXNzIGZyb20gJy4vUHJvY2Vzcyc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi9TaWduYWxBbGwnO1xuaW1wb3J0IHNvY2tldCBmcm9tICcuL3NvY2tldCc7XG5pbXBvcnQgVmlldyBmcm9tICcuLi92aWV3cy9WaWV3JztcbmltcG9ydCB2aWV3TWFuYWdlciBmcm9tICcuL3ZpZXdNYW5hZ2VyJztcblxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHNlcnZpY2VzIGFuZCBzY2VuZXMuIEJhc2ljYWxseSBhIHByb2Nlc3Mgd2l0aCB2aWV3IGFuZCBvcHRpb25uYWwgbmV0d29yayBhYmlsaXRpZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjdGl2aXR5IGV4dGVuZHMgUHJvY2VzcyB7XG4gIGNvbnN0cnVjdG9yKGlkLCBoYXNOZXR3b3JrID0gdHJ1ZSkge1xuICAgIHN1cGVyKGlkKTtcblxuICAgIC8qKlxuICAgICAqIElmIGB0cnVlYCwgZGVmaW5lIGlmIHRoZSBwcm9jZXNzIGhhcyBiZWVuIHN0YXJ0ZWQgb25jZS5cbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLmhhc1N0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGFzIGEgbmV0d29ya2VkIHNlcnZpY2UuXG4gICAgICovXG4gICAgaWYgKGhhc05ldHdvcmspIHtcbiAgICAgIHRoaXMuaGFzTmV0d29yayA9IHRydWU7XG4gICAgICBzb2NrZXQucmVxdWlyZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpZXcgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7Vmlld31cbiAgICAgKi9cbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnRzIHRvIGJpbmQgdG8gdGhlIHZpZXcuIChjZi4gQmFja2JvbmUncyBzeW50YXgpLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFkZGl0aW9ubmFsIG9wdGlvbnMgdG8gcGFzcyB0byB0aGUgdmlldy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMudmlld09wdGlvbnMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgYSB2aWV3IGNvbnN0cnVjdG9yIHRvIGJlIHVzZWQgaW4gYGNyZWF0ZVZpZXdgLlxuICAgICAqIEB0eXBlIHtWaWV3fVxuICAgICAqL1xuICAgIHRoaXMudmlld0N0b3IgPSBWaWV3O1xuXG4gICAgLyoqXG4gICAgICogVGhlIHRlbXBsYXRlIG9mIHRoZSB2aWV3ICh1c2UgYGxvZGFzaC50ZW1wbGF0ZWAgc3ludGF4KS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMudGVtcGxhdGUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ucyBvZiB0aGUgcHJvY2Vzcy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgIHRoaXMuY29uZmlndXJlKHsgdmlld1ByaW9yaXR5OiAwIH0pO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lIHdoaWNoIHNpZ25hbCB0aGUgYEFjdGl2aXR5YCByZXF1aXJlcyB0byBzdGFydC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucmVxdWlyZWRTaWduYWxzID0gbmV3IFNpZ25hbEFsbCgpO1xuXG4gICAgdGhpcy5zZW5kID0gdGhpcy5zZW5kLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zZW5kVm9sYXRpbGUgPSB0aGlzLnNlbmRWb2xhdGlsZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVjZWl2ZSA9IHRoaXMucmVjZWl2ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIgPSB0aGlzLnJlbW92ZUxpc3RlbmVyLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBiZSBpbXBsZW1lbnRlZCBpbiBjaGlsZCBjbGFzc2VzLlxuICAgKiBEZWZpbmUgd2hhdCB0byBkbyB3aGVuIGEgc2VydmljZSBpcyByZXF1aXJlZCBieSBhbiBgQWN0aXZpdHlgLlxuICAgKi9cbiAgcmVxdWlyZSgpIHt9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSB0aGUgcHJvY2VzcyB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2hhcmUgdGhlIGRlZmluZWQgdGVtcGxhdGVzIHdpdGggYWxsIGBBY3Rpdml0eWAgaW5zdGFuY2VzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmcyAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSB0ZW1wbGF0ZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGF0aWMgc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmcykge1xuICAgIEFjdGl2aXR5LnByb3RvdHlwZS50ZW1wbGF0ZURlZmluaXRpb25zID0gZGVmcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTaGFyZSB0aGUgdGV4dCBjb250ZW50IGNvbmZpZ3VyYXRpb24gKG5hbWUgYW5kIGRhdGEpIHdpdGggYWxsIHRoZSBgQWN0aXZpdHlgIGluc3RhbmNlc1xuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmcyAtIFRoZSB0ZXh0IGNvbnRlbnRzIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXRpYyBzZXRWaWV3Q29udGVudERlZmluaXRpb25zKGRlZnMpIHtcbiAgICBBY3Rpdml0eS5wcm90b3R5cGUuY29udGVudERlZmluaXRpb25zID0gZGVmcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0ZW1wbGF0ZSBhc3NvY2lhdGVkIHRvIHRoZSBjdXJyZW50IG1vZHVsZS5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSAtIFRoZSB0ZW1wbGF0ZSByZWxhdGVkIHRvIHRoZSBgbmFtZWAgb2YgdGhlIGN1cnJlbnQgbW9kdWxlLlxuICAgKi9cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy5fdGVtcGxhdGUgfHzCoHRoaXMudGVtcGxhdGVEZWZpbml0aW9uc1t0aGlzLmlkXTtcbiAgICAvLyBpZiAoIXRlbXBsYXRlKVxuICAgIC8vICAgdGhyb3cgbmV3IEVycm9yKGBObyB0ZW1wbGF0ZSBkZWZpbmVkIGZvciBtb2R1bGUgXCIke3RoaXMuaWR9XCJgKTtcbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH1cblxuICBzZXQgdGVtcGxhdGUodG1wbCkge1xuICAgIHRoaXMuX3RlbXBsYXRlID0gdG1wbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0ZXh0IGFzc29jaWF0ZWQgdG8gdGhlIGN1cnJlbnQgbW9kdWxlLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSAtIFRoZSB0ZXh0IGNvbnRlbnRzIHJlbGF0ZWQgdG8gdGhlIGBuYW1lYCBvZiB0aGUgY3VycmVudCBtb2R1bGUuIFRoZSByZXR1cm5lZCBvYmplY3QgaXMgZXh0ZW5kZWQgd2l0aCBhIHBvaW50ZXIgdG8gdGhlIGBnbG9iYWxzYCBlbnRyeSBvZiB0aGUgZGVmaW5lZCB0ZXh0IGNvbnRlbnRzLlxuICAgKi9cbiAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuX2NvbnRlbnQgfHzCoHRoaXMuY29udGVudERlZmluaXRpb25zW3RoaXMuaWRdO1xuXG4gICAgaWYgKGNvbnRlbnQpXG4gICAgICBjb250ZW50Lmdsb2JhbHMgPSB0aGlzLmNvbnRlbnREZWZpbml0aW9ucy5nbG9iYWxzO1xuXG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBzZXQgY29udGVudChvYmopIHtcbiAgICB0aGlzLl9jb250ZW50ID0gb2JqO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgdmlldyBvZiB0aGUgbW9kdWxlIGFjY29yZGluZyB0byBpdHMgYXR0cmlidXRlcy5cbiAgICovXG4gIGNyZWF0ZVZpZXcoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICBjbGFzc05hbWU6ICdhY3Rpdml0eScsXG4gICAgICBwcmlvcml0eTogdGhpcy5vcHRpb25zLnZpZXdQcmlvcml0eSxcbiAgICB9LCB0aGlzLnZpZXdPcHRpb25zKTtcblxuICAgIHJldHVybiBuZXcgdGhpcy52aWV3Q3Rvcih0aGlzLnRlbXBsYXRlLCB0aGlzLmNvbnRlbnQsIHRoaXMuZXZlbnRzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5IHRoZSB2aWV3IG9mIGEgbW9kdWxlIGlmIGl0IG93bnMgb25lLlxuICAgKi9cbiAgc2hvdygpIHtcbiAgICBpZiAoIXRoaXMudmlldykgeyByZXR1cm47IH1cblxuICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICB2aWV3TWFuYWdlci5yZWdpc3Rlcih0aGlzLnZpZXcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGUgdGhlIHZpZXcgb2YgYW4gYWN0aXZpdHkgaWYgaXQgb3ducyBvbmUuXG4gICAqL1xuICBoaWRlKCkge1xuICAgIGlmICghdGhpcy52aWV3KSB7IHJldHVybjsgfVxuXG4gICAgdmlld01hbmFnZXIucmVtb3ZlKHRoaXMudmlldyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyIHNpZGUgc29ja2V0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBzb2NrZXQuc2VuZChgJHt0aGlzLmlkfToke2NoYW5uZWx9YCwgLi4uYXJncylcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmRWb2xhdGlsZShjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgc29ja2V0LnNlbmRWb2xhdGlsZShgJHt0aGlzLmlkfToke2NoYW5uZWx9YCwgLi4uYXJncylcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gYSBXZWJTb2NrZXQgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBzb2NrZXQucmVjZWl2ZShgJHt0aGlzLmlkfToke2NoYW5uZWx9YCwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgbGlzdGVuaW5nIHRvIGEgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gY2FuY2VsLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBzb2NrZXQucmVtb3ZlTGlzdGVuZXIoYCR7dGhpcy5pZH06JHtjaGFubmVsfWAsIGNhbGxiYWNrKTtcbiAgfVxufVxuIl19