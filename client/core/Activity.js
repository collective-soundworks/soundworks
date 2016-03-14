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
 * Base class for services and scenes. Basically a process with view
 * and optionnal network abilities.
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
     * View of the activity.
     * @type {View}
     */
    _this.view = null;

    /**
     * Events to bind to the view. (cf. Backbone's syntax).
     * @type {Object}
     */
    _this.viewEvents = {};

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
     * The view template of the view (use `lodash.template` syntax).
     * @type {String}
     */
    _this.viewTemplate = null;

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
     * Share the defined view templates with all `Activity` instances.
     * @param {Object} defs - An object containing the view templates.
     * @private
     */

  }, {
    key: 'createView',


    /**
     * Create the view of the activity according to its attributes.
     */
    value: function createView() {
      var options = (0, _assign2.default)({
        id: this.id,
        className: 'activity',
        priority: this.options.viewPriority
      }, this.viewOptions);

      return new this.viewCtor(this.viewTemplate, this.viewContent, this.viewEvents, options);
    }

    /**
     * Display the view of a activity if it owns one.
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
     * @param {String} channel - The channel of the message (is automatically
     *  namespaced with the activity's name: `${this.id}:channel`).
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
     * @param {String} channel - The channel of the message (is automatically
     *  namespaced with the activity's name: `${this.id}:channel`).
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
     * @param {String} channel - The channel of the message (is automatically
     *  namespaced with the activity's name: `${this.id}:channel`).
     * @param {...*} callback - The callback to execute when a message is received.
     */

  }, {
    key: 'receive',
    value: function receive(channel, callback) {
      _socket2.default.receive(this.id + ':' + channel, callback);
    }

    /**
     * Stop listening to a message from the server.
     * @param {String} channel - The channel of the message (is automatically
     *  namespaced with the activity's name: `${this.id}:channel`).
     * @param {...*} callback - The callback to cancel.
     */

  }, {
    key: 'removeListener',
    value: function removeListener(channel, callback) {
      _socket2.default.removeListener(this.id + ':' + channel, callback);
    }
  }, {
    key: 'viewTemplate',


    /**
     * Returns the view template associated to the current activity.
     * @returns {Function} - The view template related to the `name` of the current activity.
     */
    get: function get() {
      var viewTemplate = this._viewTemplate || this.viewTemplateDefinitions[this.id];
      // if (!viewTemplate)
      //   throw new Error(`No view template defined for activity "${this.id}"`);
      return viewTemplate;
    },
    set: function set(tmpl) {
      this._viewTemplate = tmpl;
    }

    /**
     * Returns the text associated to the current activity.
     * @returns {Object} - The view contents related to the `name` of the current
     *  activity. The returned object is extended with a pointer to the `globals`
     *  entry of the defined view contents.
     */

  }, {
    key: 'viewContent',
    get: function get() {
      var viewContent = this._viewContent || this.viewContentDefinitions[this.id];

      if (viewContent) viewContent.globals = this.viewContentDefinitions.globals;

      return viewContent;
    },
    set: function set(obj) {
      this._viewContent = obj;
    }
  }], [{
    key: 'setViewTemplateDefinitions',
    value: function setViewTemplateDefinitions(defs) {
      Activity.prototype.viewTemplateDefinitions = defs;
    }

    /**
     * Share the view content configuration (name and data) with all the
     * `Activity` instances
     * @param {Object} defs - The view contents of the application.
     * @private
     */

  }, {
    key: 'setViewContentDefinitions',
    value: function setViewContentDefinitions(defs) {
      Activity.prototype.viewContentDefinitions = defs;
    }
  }]);
  return Activity;
}(_Process3.default);

exports.default = Activity;
//# sourceMappingURL=data:application/json;base64,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LGNBQVAsQ0FBeUIsS0FBSyxFQUFMLFNBQVcsT0FBcEMsRUFBK0MsUUFBL0MsRUFEZ0M7Ozs7Ozs7Ozs7d0JBbEdmO0FBQ2pCLFVBQU0sZUFBZSxLQUFLLGFBQUwsSUFBc0IsS0FBSyx1QkFBTCxDQUE2QixLQUFLLEVBQUwsQ0FBbkQ7OztBQURKLGFBSVYsWUFBUCxDQUppQjs7c0JBT0YsTUFBTTtBQUNyQixXQUFLLGFBQUwsR0FBcUIsSUFBckIsQ0FEcUI7Ozs7Ozs7Ozs7Ozt3QkFVTDtBQUNoQixVQUFNLGNBQWMsS0FBSyxZQUFMLElBQXFCLEtBQUssc0JBQUwsQ0FBNEIsS0FBSyxFQUFMLENBQWpELENBREo7O0FBR2hCLFVBQUksV0FBSixFQUNFLFlBQVksT0FBWixHQUFzQixLQUFLLHNCQUFMLENBQTRCLE9BQTVCLENBRHhCOztBQUdBLGFBQU8sV0FBUCxDQU5nQjs7c0JBU0YsS0FBSztBQUNuQixXQUFLLFlBQUwsR0FBb0IsR0FBcEIsQ0FEbUI7Ozs7K0NBNUNhLE1BQU07QUFDdEMsZUFBUyxTQUFULENBQW1CLHVCQUFuQixHQUE2QyxJQUE3QyxDQURzQzs7Ozs7Ozs7Ozs7OzhDQVVQLE1BQU07QUFDckMsZUFBUyxTQUFULENBQW1CLHNCQUFuQixHQUE0QyxJQUE1QyxDQURxQzs7O1NBaEdwQiIsImZpbGUiOiJBY3Rpdml0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9jZXNzIGZyb20gJy4vUHJvY2Vzcyc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi9TaWduYWxBbGwnO1xuaW1wb3J0IHNvY2tldCBmcm9tICcuL3NvY2tldCc7XG5pbXBvcnQgVmlldyBmcm9tICcuLi92aWV3cy9WaWV3JztcbmltcG9ydCB2aWV3TWFuYWdlciBmcm9tICcuL3ZpZXdNYW5hZ2VyJztcblxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHNlcnZpY2VzIGFuZCBzY2VuZXMuIEJhc2ljYWxseSBhIHByb2Nlc3Mgd2l0aCB2aWV3XG4gKiBhbmQgb3B0aW9ubmFsIG5ldHdvcmsgYWJpbGl0aWVzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY3Rpdml0eSBleHRlbmRzIFByb2Nlc3Mge1xuICBjb25zdHJ1Y3RvcihpZCwgaGFzTmV0d29yayA9IHRydWUpIHtcbiAgICBzdXBlcihpZCk7XG5cbiAgICAvKipcbiAgICAgKiBJZiBgdHJ1ZWAsIGRlZmluZSBpZiB0aGUgcHJvY2VzcyBoYXMgYmVlbiBzdGFydGVkIG9uY2UuXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5oYXNTdGFydGVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBhcyBhIG5ldHdvcmtlZCBzZXJ2aWNlLlxuICAgICAqL1xuICAgIGlmIChoYXNOZXR3b3JrKSB7XG4gICAgICB0aGlzLmhhc05ldHdvcmsgPSB0cnVlO1xuICAgICAgc29ja2V0LnJlcXVpcmVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaWV3IG9mIHRoZSBhY3Rpdml0eS5cbiAgICAgKiBAdHlwZSB7Vmlld31cbiAgICAgKi9cbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnRzIHRvIGJpbmQgdG8gdGhlIHZpZXcuIChjZi4gQmFja2JvbmUncyBzeW50YXgpLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy52aWV3RXZlbnRzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBZGRpdGlvbm5hbCBvcHRpb25zIHRvIHBhc3MgdG8gdGhlIHZpZXcuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnZpZXdPcHRpb25zID0ge307XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGEgdmlldyBjb25zdHJ1Y3RvciB0byBiZSB1c2VkIGluIGBjcmVhdGVWaWV3YC5cbiAgICAgKiBAdHlwZSB7Vmlld31cbiAgICAgKi9cbiAgICB0aGlzLnZpZXdDdG9yID0gVmlldztcblxuICAgIC8qKlxuICAgICAqIFRoZSB2aWV3IHRlbXBsYXRlIG9mIHRoZSB2aWV3ICh1c2UgYGxvZGFzaC50ZW1wbGF0ZWAgc3ludGF4KS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMudmlld1RlbXBsYXRlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE9wdGlvbnMgb2YgdGhlIHByb2Nlc3MuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB0aGlzLmNvbmZpZ3VyZSh7IHZpZXdQcmlvcml0eTogMCB9KTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZSB3aGljaCBzaWduYWwgdGhlIGBBY3Rpdml0eWAgcmVxdWlyZXMgdG8gc3RhcnQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscyA9IG5ldyBTaWduYWxBbGwoKTtcblxuICAgIHRoaXMuc2VuZCA9IHRoaXMuc2VuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2VuZFZvbGF0aWxlID0gdGhpcy5zZW5kVm9sYXRpbGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlY2VpdmUgPSB0aGlzLnJlY2VpdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyID0gdGhpcy5yZW1vdmVMaXN0ZW5lci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gYmUgaW1wbGVtZW50ZWQgaW4gY2hpbGQgY2xhc3Nlcy5cbiAgICogRGVmaW5lIHdoYXQgdG8gZG8gd2hlbiBhIHNlcnZpY2UgaXMgcmVxdWlyZWQgYnkgYW4gYEFjdGl2aXR5YC5cbiAgICovXG4gIHJlcXVpcmUoKSB7fVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgdGhlIHByb2Nlc3Mgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNoYXJlIHRoZSBkZWZpbmVkIHZpZXcgdGVtcGxhdGVzIHdpdGggYWxsIGBBY3Rpdml0eWAgaW5zdGFuY2VzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmcyAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSB2aWV3IHRlbXBsYXRlcy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXRpYyBzZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyhkZWZzKSB7XG4gICAgQWN0aXZpdHkucHJvdG90eXBlLnZpZXdUZW1wbGF0ZURlZmluaXRpb25zID0gZGVmcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTaGFyZSB0aGUgdmlldyBjb250ZW50IGNvbmZpZ3VyYXRpb24gKG5hbWUgYW5kIGRhdGEpIHdpdGggYWxsIHRoZVxuICAgKiBgQWN0aXZpdHlgIGluc3RhbmNlc1xuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmcyAtIFRoZSB2aWV3IGNvbnRlbnRzIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXRpYyBzZXRWaWV3Q29udGVudERlZmluaXRpb25zKGRlZnMpIHtcbiAgICBBY3Rpdml0eS5wcm90b3R5cGUudmlld0NvbnRlbnREZWZpbml0aW9ucyA9IGRlZnM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmlldyB0ZW1wbGF0ZSBhc3NvY2lhdGVkIHRvIHRoZSBjdXJyZW50IGFjdGl2aXR5LlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IC0gVGhlIHZpZXcgdGVtcGxhdGUgcmVsYXRlZCB0byB0aGUgYG5hbWVgIG9mIHRoZSBjdXJyZW50IGFjdGl2aXR5LlxuICAgKi9cbiAgZ2V0IHZpZXdUZW1wbGF0ZSgpIHtcbiAgICBjb25zdCB2aWV3VGVtcGxhdGUgPSB0aGlzLl92aWV3VGVtcGxhdGUgfHzCoHRoaXMudmlld1RlbXBsYXRlRGVmaW5pdGlvbnNbdGhpcy5pZF07XG4gICAgLy8gaWYgKCF2aWV3VGVtcGxhdGUpXG4gICAgLy8gICB0aHJvdyBuZXcgRXJyb3IoYE5vIHZpZXcgdGVtcGxhdGUgZGVmaW5lZCBmb3IgYWN0aXZpdHkgXCIke3RoaXMuaWR9XCJgKTtcbiAgICByZXR1cm4gdmlld1RlbXBsYXRlO1xuICB9XG5cbiAgc2V0IHZpZXdUZW1wbGF0ZSh0bXBsKSB7XG4gICAgdGhpcy5fdmlld1RlbXBsYXRlID0gdG1wbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0ZXh0IGFzc29jaWF0ZWQgdG8gdGhlIGN1cnJlbnQgYWN0aXZpdHkuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IC0gVGhlIHZpZXcgY29udGVudHMgcmVsYXRlZCB0byB0aGUgYG5hbWVgIG9mIHRoZSBjdXJyZW50XG4gICAqICBhY3Rpdml0eS4gVGhlIHJldHVybmVkIG9iamVjdCBpcyBleHRlbmRlZCB3aXRoIGEgcG9pbnRlciB0byB0aGUgYGdsb2JhbHNgXG4gICAqICBlbnRyeSBvZiB0aGUgZGVmaW5lZCB2aWV3IGNvbnRlbnRzLlxuICAgKi9cbiAgZ2V0IHZpZXdDb250ZW50KCkge1xuICAgIGNvbnN0IHZpZXdDb250ZW50ID0gdGhpcy5fdmlld0NvbnRlbnQgfHzCoHRoaXMudmlld0NvbnRlbnREZWZpbml0aW9uc1t0aGlzLmlkXTtcblxuICAgIGlmICh2aWV3Q29udGVudClcbiAgICAgIHZpZXdDb250ZW50Lmdsb2JhbHMgPSB0aGlzLnZpZXdDb250ZW50RGVmaW5pdGlvbnMuZ2xvYmFscztcblxuICAgIHJldHVybiB2aWV3Q29udGVudDtcbiAgfVxuXG4gIHNldCB2aWV3Q29udGVudChvYmopIHtcbiAgICB0aGlzLl92aWV3Q29udGVudCA9IG9iajtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIHZpZXcgb2YgdGhlIGFjdGl2aXR5IGFjY29yZGluZyB0byBpdHMgYXR0cmlidXRlcy5cbiAgICovXG4gIGNyZWF0ZVZpZXcoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICBjbGFzc05hbWU6ICdhY3Rpdml0eScsXG4gICAgICBwcmlvcml0eTogdGhpcy5vcHRpb25zLnZpZXdQcmlvcml0eSxcbiAgICB9LCB0aGlzLnZpZXdPcHRpb25zKTtcblxuICAgIHJldHVybiBuZXcgdGhpcy52aWV3Q3Rvcih0aGlzLnZpZXdUZW1wbGF0ZSwgdGhpcy52aWV3Q29udGVudCwgdGhpcy52aWV3RXZlbnRzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5IHRoZSB2aWV3IG9mIGEgYWN0aXZpdHkgaWYgaXQgb3ducyBvbmUuXG4gICAqL1xuICBzaG93KCkge1xuICAgIGlmICghdGhpcy52aWV3KSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICAgIHZpZXdNYW5hZ2VyLnJlZ2lzdGVyKHRoaXMudmlldyk7XG4gIH1cblxuICAvKipcbiAgICogSGlkZSB0aGUgdmlldyBvZiBhbiBhY3Rpdml0eSBpZiBpdCBvd25zIG9uZS5cbiAgICovXG4gIGhpZGUoKSB7XG4gICAgaWYgKCF0aGlzLnZpZXcpIHsgcmV0dXJuOyB9XG5cbiAgICB2aWV3TWFuYWdlci5yZW1vdmUodGhpcy52aWV3KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHlcbiAgICogIG5hbWVzcGFjZWQgd2l0aCB0aGUgYWN0aXZpdHkncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIHNvY2tldC5zZW5kKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHlcbiAgICogIG5hbWVzcGFjZWQgd2l0aCB0aGUgYWN0aXZpdHkncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmRWb2xhdGlsZShjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgc29ja2V0LnNlbmRWb2xhdGlsZShgJHt0aGlzLmlkfToke2NoYW5uZWx9YCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5XG4gICAqICBuYW1lc3BhY2VkIHdpdGggdGhlIGFjdGl2aXR5J3MgbmFtZTogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgc29ja2V0LnJlY2VpdmUoYCR7dGhpcy5pZH06JHtjaGFubmVsfWAsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIGxpc3RlbmluZyB0byBhIG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5XG4gICAqICBuYW1lc3BhY2VkIHdpdGggdGhlIGFjdGl2aXR5J3MgbmFtZTogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGNhbmNlbC5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCBjYWxsYmFjayk7XG4gIH1cbn1cbiJdfQ==