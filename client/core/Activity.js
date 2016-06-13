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
 * Internal base class for services and scenes. Basically a process with view
 * and optionnal network abilities.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Process
 */

var Activity = function (_Process) {
  (0, _inherits3.default)(Activity, _Process);

  /**
   * @param {String} id - Id of the activity.
   * @param {Boolean} hasNetwork - Define if the activity needs a socket
   *  connection or not.
   */

  function Activity(id) {
    var hasNetwork = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
    (0, _classCallCheck3.default)(this, Activity);


    /**
     * If `true`, defines if the activity has already started once.
     * @type {Boolean}
     * @name hasStarted
     * @instance
     * @memberof module:soundworks/client.Activity
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Activity).call(this, id));

    _this.hasStarted = false;

    // register as a networked service
    if (hasNetwork) {
      _this.hasNetwork = true;
      _socket2.default.required = true;
    }

    /**
     * View of the activity.
     * @type {module:soundworks/client.View}
     * @name view
     * @instance
     * @memberof module:soundworks/client.Activity
     */
    _this.view = null;

    /**
     * Events to bind to the view. (mimic the Backbone's syntax).
     * @type {Object}
     * @name viewEvents
     * @instance
     * @memberof module:soundworks/client.Activity
     * @example
     * this.viewEvents = {
     *   "touchstart .button": (e) => {
     *     // do somthing
     *   },
     *   // etc...
     * };
     */
    _this.viewEvents = {};

    /**
     * Additionnal options to pass to the view.
     * @type {Object}
     * @name viewOptions
     * @instance
     * @memberof module:soundworks/client.Activity
     */
    _this.viewOptions = {};

    /**
     * View constructor to be used in
     * [`Activity#createView`]{@link module:soundworks/client.Activity#createView}.
     * @type {module:soundworks/client.View}
     * @default module:soundworks/client.View
     * @name viewCtor
     * @instance
     * @memberof module:soundworks/client.Activity
     */
    _this.viewCtor = _View2.default;

    /**
     * Options of the activity.
     * @type {Object}
     * @name options
     * @instance
     * @memberof module:soundworks/client.Activity
     */
    _this.options = { viewPriority: 0 };

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
     * Configure the activity with the given options.
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
     * Create the view of the activity according to its `viewCtor`, `viewTemplate`,
     * `viewContent`, `viewEvents` and `viewOptions` attributes.
     */
    value: function createView() {
      var options = (0, _assign2.default)({
        id: this.id.replace(/\:/g, '-'),
        className: 'activity',
        priority: this.options.viewPriority
      }, this.viewOptions);

      return new this.viewCtor(this.viewTemplate, this.viewContent, this.viewEvents, options);
    }

    /**
     * Request the view manager to display the view. The call of this method
     * doesn't guarantee a synchronized rendering or any rendering at all as the
     * view manager decides which view to display based on their priority.
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
     * Hide the view of the activity if it owns one.
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
     * Send a web socket message to the server on a given channel.
     * @param {String} channel - The channel of the message (is automatically
     *  namespaced with the activity's id: `${this.id}:channel`).
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
     * Send a web socket message to the server on a given channel.
     * @param {String} channel - The channel of the message (is automatically
     *  namespaced with the activity's id: `${this.id}:channel`).
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
     * Listen to web socket messages from the server on a given channel.
     * @param {String} channel - The channel of the message (is automatically
     *  namespaced with the activity's id: `${this.id}:channel`).
     * @param {Function} callback - The callback to execute when a message is received.
     */

  }, {
    key: 'receive',
    value: function receive(channel, callback) {
      _socket2.default.receive(this.id + ':' + channel, callback);
    }

    /**
     * Stop listening for messages from the server on a given channel.
     * @param {String} channel - The channel of the message (is automatically
     *  namespaced with the activity's id: `${this.id}:channel`).
     * @param {Function} callback - The callback to remove from the stack.
     */

  }, {
    key: 'removeListener',
    value: function removeListener(channel, callback) {
      _socket2.default.removeListener(this.id + ':' + channel, callback);
    }
  }, {
    key: 'viewTemplate',


    /**
     * The template related to the `id` of the activity.
     * @type {String}
     * @see {@link module:soundworks/client.defaultViewTemplates}
     */
    get: function get() {
      var viewTemplate = this._viewTemplate || this.viewTemplateDefinitions[this.id] || this._defaultViewTemplate;

      return viewTemplate;
    },
    set: function set(tmpl) {
      this._viewTemplate = tmpl;
    }

    /**
     * The view contents related to the `id` of the activity. The object is
     * extended with a pointer to the `globals` entry of the defined view contents.
     * @type {Object}
     * @see {@link module:soundworks/client.defaultViewContent}
     */

  }, {
    key: 'viewContent',
    get: function get() {
      var viewContent = this._viewContent || this.viewContentDefinitions[this.id] || this._defaultViewContent;

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

Activity.prototype.viewTemplateDefinitions = {};
Activity.prototype.viewContentDefinitions = {};

exports.default = Activity;
//# sourceMappingURL=data:application/json;base64,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Q2pCLFVBQU0sZUFBZSxLQUFLLGFBQUwsSUFDbkIsS0FBSyx1QkFBTCxDQUE2QixLQUFLLEVBQWxDLENBRG1CLElBRW5CLEtBQUssb0JBRlA7O0FBSUEsYUFBTyxZQUFQO0FBQ0QsSztzQkFFZ0IsSSxFQUFNO0FBQ3JCLFdBQUssYUFBTCxHQUFxQixJQUFyQjtBQUNEOzs7Ozs7Ozs7Ozt3QkFRaUI7QUFDaEIsVUFBTSxjQUFjLEtBQUssWUFBTCxJQUNsQixLQUFLLHNCQUFMLENBQTRCLEtBQUssRUFBakMsQ0FEa0IsSUFFbEIsS0FBSyxtQkFGUDs7QUFJQSxVQUFJLFdBQUosRUFDRSxZQUFZLE9BQVosR0FBc0IsS0FBSyxzQkFBTCxDQUE0QixPQUFsRDs7QUFFRixhQUFPLFdBQVA7QUFDRCxLO3NCQUVlLEcsRUFBSztBQUNuQixXQUFLLFlBQUwsR0FBb0IsR0FBcEI7QUFDRDs7OytDQWxEaUMsSSxFQUFNO0FBQ3RDLGVBQVMsU0FBVCxDQUFtQix1QkFBbkIsR0FBNkMsSUFBN0M7QUFDRDs7Ozs7Ozs7Ozs7OENBUWdDLEksRUFBTTtBQUNyQyxlQUFTLFNBQVQsQ0FBbUIsc0JBQW5CLEdBQTRDLElBQTVDO0FBQ0Q7Ozs7O0FBb0hILFNBQVMsU0FBVCxDQUFtQix1QkFBbkIsR0FBNkMsRUFBN0M7QUFDQSxTQUFTLFNBQVQsQ0FBbUIsc0JBQW5CLEdBQTRDLEVBQTVDOztrQkFFZSxRIiwiZmlsZSI6IkFjdGl2aXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb2Nlc3MgZnJvbSAnLi9Qcm9jZXNzJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi9TaWduYWwnO1xuaW1wb3J0IFNpZ25hbEFsbCBmcm9tICcuL1NpZ25hbEFsbCc7XG5pbXBvcnQgc29ja2V0IGZyb20gJy4vc29ja2V0JztcbmltcG9ydCBWaWV3IGZyb20gJy4uL3ZpZXdzL1ZpZXcnO1xuaW1wb3J0IHZpZXdNYW5hZ2VyIGZyb20gJy4vdmlld01hbmFnZXInO1xuXG5cbi8qKlxuICogSW50ZXJuYWwgYmFzZSBjbGFzcyBmb3Igc2VydmljZXMgYW5kIHNjZW5lcy4gQmFzaWNhbGx5IGEgcHJvY2VzcyB3aXRoIHZpZXdcbiAqIGFuZCBvcHRpb25uYWwgbmV0d29yayBhYmlsaXRpZXMuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4dGVuZHMgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlByb2Nlc3NcbiAqL1xuY2xhc3MgQWN0aXZpdHkgZXh0ZW5kcyBQcm9jZXNzIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIElkIG9mIHRoZSBhY3Rpdml0eS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBoYXNOZXR3b3JrIC0gRGVmaW5lIGlmIHRoZSBhY3Rpdml0eSBuZWVkcyBhIHNvY2tldFxuICAgKiAgY29ubmVjdGlvbiBvciBub3QuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpZCwgaGFzTmV0d29yayA9IHRydWUpIHtcbiAgICBzdXBlcihpZCk7XG5cbiAgICAvKipcbiAgICAgKiBJZiBgdHJ1ZWAsIGRlZmluZXMgaWYgdGhlIGFjdGl2aXR5IGhhcyBhbHJlYWR5IHN0YXJ0ZWQgb25jZS5cbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAbmFtZSBoYXNTdGFydGVkXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BY3Rpdml0eVxuICAgICAqL1xuICAgIHRoaXMuaGFzU3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgLy8gcmVnaXN0ZXIgYXMgYSBuZXR3b3JrZWQgc2VydmljZVxuICAgIGlmIChoYXNOZXR3b3JrKSB7XG4gICAgICB0aGlzLmhhc05ldHdvcmsgPSB0cnVlO1xuICAgICAgc29ja2V0LnJlcXVpcmVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaWV3IG9mIHRoZSBhY3Rpdml0eS5cbiAgICAgKiBAdHlwZSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXd9XG4gICAgICogQG5hbWUgdmlld1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHlcbiAgICAgKi9cbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnRzIHRvIGJpbmQgdG8gdGhlIHZpZXcuIChtaW1pYyB0aGUgQmFja2JvbmUncyBzeW50YXgpLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgdmlld0V2ZW50c1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHlcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHRoaXMudmlld0V2ZW50cyA9IHtcbiAgICAgKiAgIFwidG91Y2hzdGFydCAuYnV0dG9uXCI6IChlKSA9PiB7XG4gICAgICogICAgIC8vIGRvIHNvbXRoaW5nXG4gICAgICogICB9LFxuICAgICAqICAgLy8gZXRjLi4uXG4gICAgICogfTtcbiAgICAgKi9cbiAgICB0aGlzLnZpZXdFdmVudHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFkZGl0aW9ubmFsIG9wdGlvbnMgdG8gcGFzcyB0byB0aGUgdmlldy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIHZpZXdPcHRpb25zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BY3Rpdml0eVxuICAgICAqL1xuICAgIHRoaXMudmlld09wdGlvbnMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFZpZXcgY29uc3RydWN0b3IgdG8gYmUgdXNlZCBpblxuICAgICAqIFtgQWN0aXZpdHkjY3JlYXRlVmlld2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BY3Rpdml0eSNjcmVhdGVWaWV3fS5cbiAgICAgKiBAdHlwZSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXd9XG4gICAgICogQGRlZmF1bHQgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAgICAgKiBAbmFtZSB2aWV3Q3RvclxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHlcbiAgICAgKi9cbiAgICB0aGlzLnZpZXdDdG9yID0gVmlldztcblxuICAgIC8qKlxuICAgICAqIE9wdGlvbnMgb2YgdGhlIGFjdGl2aXR5LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgb3B0aW9uc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHlcbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSB7IHZpZXdQcmlvcml0eTogMCB9O1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lIHdoaWNoIHNpZ25hbCB0aGUgYEFjdGl2aXR5YCByZXF1aXJlcyB0byBzdGFydC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucmVxdWlyZWRTaWduYWxzID0gbmV3IFNpZ25hbEFsbCgpO1xuXG4gICAgdGhpcy5zZW5kID0gdGhpcy5zZW5kLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zZW5kVm9sYXRpbGUgPSB0aGlzLnNlbmRWb2xhdGlsZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVjZWl2ZSA9IHRoaXMucmVjZWl2ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIgPSB0aGlzLnJlbW92ZUxpc3RlbmVyLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBiZSBpbXBsZW1lbnRlZCBpbiBjaGlsZCBjbGFzc2VzLlxuICAgKiBEZWZpbmUgd2hhdCB0byBkbyB3aGVuIGEgc2VydmljZSBpcyByZXF1aXJlZCBieSBhbiBgQWN0aXZpdHlgLlxuICAgKi9cbiAgcmVxdWlyZSgpIHt9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSB0aGUgYWN0aXZpdHkgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNoYXJlIHRoZSBkZWZpbmVkIHZpZXcgdGVtcGxhdGVzIHdpdGggYWxsIGBBY3Rpdml0eWAgaW5zdGFuY2VzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmcyAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSB2aWV3IHRlbXBsYXRlcy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXRpYyBzZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyhkZWZzKSB7XG4gICAgQWN0aXZpdHkucHJvdG90eXBlLnZpZXdUZW1wbGF0ZURlZmluaXRpb25zID0gZGVmcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTaGFyZSB0aGUgdmlldyBjb250ZW50IGNvbmZpZ3VyYXRpb24gKG5hbWUgYW5kIGRhdGEpIHdpdGggYWxsIHRoZVxuICAgKiBgQWN0aXZpdHlgIGluc3RhbmNlc1xuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmcyAtIFRoZSB2aWV3IGNvbnRlbnRzIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXRpYyBzZXRWaWV3Q29udGVudERlZmluaXRpb25zKGRlZnMpIHtcbiAgICBBY3Rpdml0eS5wcm90b3R5cGUudmlld0NvbnRlbnREZWZpbml0aW9ucyA9IGRlZnM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHRlbXBsYXRlIHJlbGF0ZWQgdG8gdGhlIGBpZGAgb2YgdGhlIGFjdGl2aXR5LlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuZGVmYXVsdFZpZXdUZW1wbGF0ZXN9XG4gICAqL1xuICBnZXQgdmlld1RlbXBsYXRlKCkge1xuICAgIGNvbnN0IHZpZXdUZW1wbGF0ZSA9IHRoaXMuX3ZpZXdUZW1wbGF0ZSB8fMKgXG4gICAgICB0aGlzLnZpZXdUZW1wbGF0ZURlZmluaXRpb25zW3RoaXMuaWRdIHx8XG4gICAgICB0aGlzLl9kZWZhdWx0Vmlld1RlbXBsYXRlO1xuXG4gICAgcmV0dXJuIHZpZXdUZW1wbGF0ZTtcbiAgfVxuXG4gIHNldCB2aWV3VGVtcGxhdGUodG1wbCkge1xuICAgIHRoaXMuX3ZpZXdUZW1wbGF0ZSA9IHRtcGw7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHZpZXcgY29udGVudHMgcmVsYXRlZCB0byB0aGUgYGlkYCBvZiB0aGUgYWN0aXZpdHkuIFRoZSBvYmplY3QgaXNcbiAgICogZXh0ZW5kZWQgd2l0aCBhIHBvaW50ZXIgdG8gdGhlIGBnbG9iYWxzYCBlbnRyeSBvZiB0aGUgZGVmaW5lZCB2aWV3IGNvbnRlbnRzLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuZGVmYXVsdFZpZXdDb250ZW50fVxuICAgKi9cbiAgZ2V0IHZpZXdDb250ZW50KCkge1xuICAgIGNvbnN0IHZpZXdDb250ZW50ID0gdGhpcy5fdmlld0NvbnRlbnQgfHzCoFxuICAgICAgdGhpcy52aWV3Q29udGVudERlZmluaXRpb25zW3RoaXMuaWRdIHx8XG4gICAgICB0aGlzLl9kZWZhdWx0Vmlld0NvbnRlbnQ7XG5cbiAgICBpZiAodmlld0NvbnRlbnQpXG4gICAgICB2aWV3Q29udGVudC5nbG9iYWxzID0gdGhpcy52aWV3Q29udGVudERlZmluaXRpb25zLmdsb2JhbHM7XG5cbiAgICByZXR1cm4gdmlld0NvbnRlbnQ7XG4gIH1cblxuICBzZXQgdmlld0NvbnRlbnQob2JqKSB7XG4gICAgdGhpcy5fdmlld0NvbnRlbnQgPSBvYmo7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSB2aWV3IG9mIHRoZSBhY3Rpdml0eSBhY2NvcmRpbmcgdG8gaXRzIGB2aWV3Q3RvcmAsIGB2aWV3VGVtcGxhdGVgLFxuICAgKiBgdmlld0NvbnRlbnRgLCBgdmlld0V2ZW50c2AgYW5kIGB2aWV3T3B0aW9uc2AgYXR0cmlidXRlcy5cbiAgICovXG4gIGNyZWF0ZVZpZXcoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgaWQ6IHRoaXMuaWQucmVwbGFjZSgvXFw6L2csICctJyksXG4gICAgICBjbGFzc05hbWU6ICdhY3Rpdml0eScsXG4gICAgICBwcmlvcml0eTogdGhpcy5vcHRpb25zLnZpZXdQcmlvcml0eSxcbiAgICB9LCB0aGlzLnZpZXdPcHRpb25zKTtcblxuICAgIHJldHVybiBuZXcgdGhpcy52aWV3Q3Rvcih0aGlzLnZpZXdUZW1wbGF0ZSwgdGhpcy52aWV3Q29udGVudCwgdGhpcy52aWV3RXZlbnRzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IHRoZSB2aWV3IG1hbmFnZXIgdG8gZGlzcGxheSB0aGUgdmlldy4gVGhlIGNhbGwgb2YgdGhpcyBtZXRob2RcbiAgICogZG9lc24ndCBndWFyYW50ZWUgYSBzeW5jaHJvbml6ZWQgcmVuZGVyaW5nIG9yIGFueSByZW5kZXJpbmcgYXQgYWxsIGFzIHRoZVxuICAgKiB2aWV3IG1hbmFnZXIgZGVjaWRlcyB3aGljaCB2aWV3IHRvIGRpc3BsYXkgYmFzZWQgb24gdGhlaXIgcHJpb3JpdHkuXG4gICAqL1xuICBzaG93KCkge1xuICAgIGlmICghdGhpcy52aWV3KSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICAgIHZpZXdNYW5hZ2VyLnJlZ2lzdGVyKHRoaXMudmlldyk7XG4gIH1cblxuICAvKipcbiAgICogSGlkZSB0aGUgdmlldyBvZiB0aGUgYWN0aXZpdHkgaWYgaXQgb3ducyBvbmUuXG4gICAqL1xuICBoaWRlKCkge1xuICAgIGlmICghdGhpcy52aWV3KSB7IHJldHVybjsgfVxuXG4gICAgdmlld01hbmFnZXIucmVtb3ZlKHRoaXMudmlldyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIHdlYiBzb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyIG9uIGEgZ2l2ZW4gY2hhbm5lbC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseVxuICAgKiAgbmFtZXNwYWNlZCB3aXRoIHRoZSBhY3Rpdml0eSdzIGlkOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIHNvY2tldC5zZW5kKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgd2ViIHNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgb24gYSBnaXZlbiBjaGFubmVsLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5XG4gICAqICBuYW1lc3BhY2VkIHdpdGggdGhlIGFjdGl2aXR5J3MgaWQ6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZFZvbGF0aWxlKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBzb2NrZXQuc2VuZFZvbGF0aWxlKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gdG8gd2ViIHNvY2tldCBtZXNzYWdlcyBmcm9tIHRoZSBzZXJ2ZXIgb24gYSBnaXZlbiBjaGFubmVsLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5XG4gICAqICBuYW1lc3BhY2VkIHdpdGggdGhlIGFjdGl2aXR5J3MgaWQ6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBzb2NrZXQucmVjZWl2ZShgJHt0aGlzLmlkfToke2NoYW5uZWx9YCwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgbGlzdGVuaW5nIGZvciBtZXNzYWdlcyBmcm9tIHRoZSBzZXJ2ZXIgb24gYSBnaXZlbiBjaGFubmVsLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5XG4gICAqICBuYW1lc3BhY2VkIHdpdGggdGhlIGFjdGl2aXR5J3MgaWQ6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gcmVtb3ZlIGZyb20gdGhlIHN0YWNrLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBzb2NrZXQucmVtb3ZlTGlzdGVuZXIoYCR7dGhpcy5pZH06JHtjaGFubmVsfWAsIGNhbGxiYWNrKTtcbiAgfVxufVxuXG5BY3Rpdml0eS5wcm90b3R5cGUudmlld1RlbXBsYXRlRGVmaW5pdGlvbnMgPSB7fTtcbkFjdGl2aXR5LnByb3RvdHlwZS52aWV3Q29udGVudERlZmluaXRpb25zID0ge307XG5cbmV4cG9ydCBkZWZhdWx0IEFjdGl2aXR5O1xuIl19