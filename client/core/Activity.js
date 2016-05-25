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
     * If `true`, define if the activity has already been started once.
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
     * doesn't garantee a synchronized rendering of the view as the view manager
     * decide which view to display based on their priority.
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
     * Sends a WebSocket message to the server side socket.
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
     * Sends a WebSocket message to the server side socket.
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
     * Listen a WebSocket message from the server.
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
     * Stop listening to a message from the server.
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
      var viewTemplate = this._viewTemplate || this.viewTemplateDefinitions[this.id];
      // if (!viewTemplate)
      //   throw new Error(`No view template defined for activity "${this.id}"`);
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
//# sourceMappingURL=data:application/json;base64,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Q2pCLFVBQU0sZUFBZSxLQUFLLGFBQUwsSUFBc0IsS0FBSyx1QkFBTCxDQUE2QixLQUFLLEVBQWxDLENBQTNDOzs7QUFHQSxhQUFPLFlBQVA7QUFDRCxLO3NCQUVnQixJLEVBQU07QUFDckIsV0FBSyxhQUFMLEdBQXFCLElBQXJCO0FBQ0Q7Ozs7Ozs7Ozs7O3dCQVFpQjtBQUNoQixVQUFNLGNBQWMsS0FBSyxZQUFMLElBQXFCLEtBQUssc0JBQUwsQ0FBNEIsS0FBSyxFQUFqQyxDQUF6Qzs7QUFFQSxVQUFJLFdBQUosRUFDRSxZQUFZLE9BQVosR0FBc0IsS0FBSyxzQkFBTCxDQUE0QixPQUFsRDs7QUFFRixhQUFPLFdBQVA7QUFDRCxLO3NCQUVlLEcsRUFBSztBQUNuQixXQUFLLFlBQUwsR0FBb0IsR0FBcEI7QUFDRDs7OytDQS9DaUMsSSxFQUFNO0FBQ3RDLGVBQVMsU0FBVCxDQUFtQix1QkFBbkIsR0FBNkMsSUFBN0M7QUFDRDs7Ozs7Ozs7Ozs7OENBUWdDLEksRUFBTTtBQUNyQyxlQUFTLFNBQVQsQ0FBbUIsc0JBQW5CLEdBQTRDLElBQTVDO0FBQ0Q7Ozs7O2tCQWlIWSxRIiwiZmlsZSI6IkFjdGl2aXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb2Nlc3MgZnJvbSAnLi9Qcm9jZXNzJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi9TaWduYWwnO1xuaW1wb3J0IFNpZ25hbEFsbCBmcm9tICcuL1NpZ25hbEFsbCc7XG5pbXBvcnQgc29ja2V0IGZyb20gJy4vc29ja2V0JztcbmltcG9ydCBWaWV3IGZyb20gJy4uL3ZpZXdzL1ZpZXcnO1xuaW1wb3J0IHZpZXdNYW5hZ2VyIGZyb20gJy4vdmlld01hbmFnZXInO1xuXG5cbi8qKlxuICogSW50ZXJuYWwgYmFzZSBjbGFzcyBmb3Igc2VydmljZXMgYW5kIHNjZW5lcy4gQmFzaWNhbGx5IGEgcHJvY2VzcyB3aXRoIHZpZXdcbiAqIGFuZCBvcHRpb25uYWwgbmV0d29yayBhYmlsaXRpZXMuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4dGVuZHMgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlByb2Nlc3NcbiAqL1xuY2xhc3MgQWN0aXZpdHkgZXh0ZW5kcyBQcm9jZXNzIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIElkIG9mIHRoZSBhY3Rpdml0eS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBoYXNOZXR3b3JrIC0gRGVmaW5lIGlmIHRoZSBhY3Rpdml0eSBuZWVkcyBhIHNvY2tldFxuICAgKiAgY29ubmVjdGlvbiBvciBub3QuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpZCwgaGFzTmV0d29yayA9IHRydWUpIHtcbiAgICBzdXBlcihpZCk7XG5cbiAgICAvKipcbiAgICAgKiBJZiBgdHJ1ZWAsIGRlZmluZSBpZiB0aGUgYWN0aXZpdHkgaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkIG9uY2UuXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG5hbWUgaGFzU3RhcnRlZFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHlcbiAgICAgKi9cbiAgICB0aGlzLmhhc1N0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIC8vIHJlZ2lzdGVyIGFzIGEgbmV0d29ya2VkIHNlcnZpY2VcbiAgICBpZiAoaGFzTmV0d29yaykge1xuICAgICAgdGhpcy5oYXNOZXR3b3JrID0gdHJ1ZTtcbiAgICAgIHNvY2tldC5yZXF1aXJlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlldyBvZiB0aGUgYWN0aXZpdHkuXG4gICAgICogQHR5cGUge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3fVxuICAgICAqIEBuYW1lIHZpZXdcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFjdGl2aXR5XG4gICAgICovXG4gICAgdGhpcy52aWV3ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50cyB0byBiaW5kIHRvIHRoZSB2aWV3LiAobWltaWMgdGhlIEJhY2tib25lJ3Mgc3ludGF4KS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIHZpZXdFdmVudHNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFjdGl2aXR5XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB0aGlzLnZpZXdFdmVudHMgPSB7XG4gICAgICogICBcInRvdWNoc3RhcnQgLmJ1dHRvblwiOiAoZSkgPT4ge1xuICAgICAqICAgICAvLyBkbyBzb210aGluZ1xuICAgICAqICAgfSxcbiAgICAgKiAgIC8vIGV0Yy4uLlxuICAgICAqIH07XG4gICAgICovXG4gICAgdGhpcy52aWV3RXZlbnRzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBZGRpdGlvbm5hbCBvcHRpb25zIHRvIHBhc3MgdG8gdGhlIHZpZXcuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAbmFtZSB2aWV3T3B0aW9uc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHlcbiAgICAgKi9cbiAgICB0aGlzLnZpZXdPcHRpb25zID0ge307XG5cbiAgICAvKipcbiAgICAgKiBWaWV3IGNvbnN0cnVjdG9yIHRvIGJlIHVzZWQgaW5cbiAgICAgKiBbYEFjdGl2aXR5I2NyZWF0ZVZpZXdgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHkjY3JlYXRlVmlld30uXG4gICAgICogQHR5cGUge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3fVxuICAgICAqIEBkZWZhdWx0IG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICogQG5hbWUgdmlld0N0b3JcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFjdGl2aXR5XG4gICAgICovXG4gICAgdGhpcy52aWV3Q3RvciA9IFZpZXc7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25zIG9mIHRoZSBhY3Rpdml0eS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIG9wdGlvbnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFjdGl2aXR5XG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0geyB2aWV3UHJpb3JpdHk6IDAgfTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZSB3aGljaCBzaWduYWwgdGhlIGBBY3Rpdml0eWAgcmVxdWlyZXMgdG8gc3RhcnQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscyA9IG5ldyBTaWduYWxBbGwoKTtcblxuICAgIHRoaXMuc2VuZCA9IHRoaXMuc2VuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2VuZFZvbGF0aWxlID0gdGhpcy5zZW5kVm9sYXRpbGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlY2VpdmUgPSB0aGlzLnJlY2VpdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyID0gdGhpcy5yZW1vdmVMaXN0ZW5lci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gYmUgaW1wbGVtZW50ZWQgaW4gY2hpbGQgY2xhc3Nlcy5cbiAgICogRGVmaW5lIHdoYXQgdG8gZG8gd2hlbiBhIHNlcnZpY2UgaXMgcmVxdWlyZWQgYnkgYW4gYEFjdGl2aXR5YC5cbiAgICovXG4gIHJlcXVpcmUoKSB7fVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgdGhlIGFjdGl2aXR5IHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaGFyZSB0aGUgZGVmaW5lZCB2aWV3IHRlbXBsYXRlcyB3aXRoIGFsbCBgQWN0aXZpdHlgIGluc3RhbmNlcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRlZnMgLSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgdmlldyB0ZW1wbGF0ZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGF0aWMgc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmcykge1xuICAgIEFjdGl2aXR5LnByb3RvdHlwZS52aWV3VGVtcGxhdGVEZWZpbml0aW9ucyA9IGRlZnM7XG4gIH1cblxuICAvKipcbiAgICogU2hhcmUgdGhlIHZpZXcgY29udGVudCBjb25maWd1cmF0aW9uIChuYW1lIGFuZCBkYXRhKSB3aXRoIGFsbCB0aGVcbiAgICogYEFjdGl2aXR5YCBpbnN0YW5jZXNcbiAgICogQHBhcmFtIHtPYmplY3R9IGRlZnMgLSBUaGUgdmlldyBjb250ZW50cyBvZiB0aGUgYXBwbGljYXRpb24uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGF0aWMgc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyhkZWZzKSB7XG4gICAgQWN0aXZpdHkucHJvdG90eXBlLnZpZXdDb250ZW50RGVmaW5pdGlvbnMgPSBkZWZzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0ZW1wbGF0ZSByZWxhdGVkIHRvIHRoZSBgaWRgIG9mIHRoZSBhY3Rpdml0eS5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmRlZmF1bHRWaWV3VGVtcGxhdGVzfVxuICAgKi9cbiAgZ2V0IHZpZXdUZW1wbGF0ZSgpIHtcbiAgICBjb25zdCB2aWV3VGVtcGxhdGUgPSB0aGlzLl92aWV3VGVtcGxhdGUgfHzCoHRoaXMudmlld1RlbXBsYXRlRGVmaW5pdGlvbnNbdGhpcy5pZF07XG4gICAgLy8gaWYgKCF2aWV3VGVtcGxhdGUpXG4gICAgLy8gICB0aHJvdyBuZXcgRXJyb3IoYE5vIHZpZXcgdGVtcGxhdGUgZGVmaW5lZCBmb3IgYWN0aXZpdHkgXCIke3RoaXMuaWR9XCJgKTtcbiAgICByZXR1cm4gdmlld1RlbXBsYXRlO1xuICB9XG5cbiAgc2V0IHZpZXdUZW1wbGF0ZSh0bXBsKSB7XG4gICAgdGhpcy5fdmlld1RlbXBsYXRlID0gdG1wbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdmlldyBjb250ZW50cyByZWxhdGVkIHRvIHRoZSBgaWRgIG9mIHRoZSBhY3Rpdml0eS4gVGhlIG9iamVjdCBpc1xuICAgKiBleHRlbmRlZCB3aXRoIGEgcG9pbnRlciB0byB0aGUgYGdsb2JhbHNgIGVudHJ5IG9mIHRoZSBkZWZpbmVkIHZpZXcgY29udGVudHMuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5kZWZhdWx0Vmlld0NvbnRlbnR9XG4gICAqL1xuICBnZXQgdmlld0NvbnRlbnQoKSB7XG4gICAgY29uc3Qgdmlld0NvbnRlbnQgPSB0aGlzLl92aWV3Q29udGVudCB8fMKgdGhpcy52aWV3Q29udGVudERlZmluaXRpb25zW3RoaXMuaWRdO1xuXG4gICAgaWYgKHZpZXdDb250ZW50KVxuICAgICAgdmlld0NvbnRlbnQuZ2xvYmFscyA9IHRoaXMudmlld0NvbnRlbnREZWZpbml0aW9ucy5nbG9iYWxzO1xuXG4gICAgcmV0dXJuIHZpZXdDb250ZW50O1xuICB9XG5cbiAgc2V0IHZpZXdDb250ZW50KG9iaikge1xuICAgIHRoaXMuX3ZpZXdDb250ZW50ID0gb2JqO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgdmlldyBvZiB0aGUgYWN0aXZpdHkgYWNjb3JkaW5nIHRvIGl0cyBgdmlld0N0b3JgLCBgdmlld1RlbXBsYXRlYCxcbiAgICogYHZpZXdDb250ZW50YCwgYHZpZXdFdmVudHNgIGFuZCBgdmlld09wdGlvbnNgIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBjcmVhdGVWaWV3KCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGlkOiB0aGlzLmlkLnJlcGxhY2UoL1xcOi9nLCAnLScpLFxuICAgICAgY2xhc3NOYW1lOiAnYWN0aXZpdHknLFxuICAgICAgcHJpb3JpdHk6IHRoaXMub3B0aW9ucy52aWV3UHJpb3JpdHksXG4gICAgfSwgdGhpcy52aWV3T3B0aW9ucyk7XG5cbiAgICByZXR1cm4gbmV3IHRoaXMudmlld0N0b3IodGhpcy52aWV3VGVtcGxhdGUsIHRoaXMudmlld0NvbnRlbnQsIHRoaXMudmlld0V2ZW50cywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCB0aGUgdmlldyBtYW5hZ2VyIHRvIGRpc3BsYXkgdGhlIHZpZXcuIFRoZSBjYWxsIG9mIHRoaXMgbWV0aG9kXG4gICAqIGRvZXNuJ3QgZ2FyYW50ZWUgYSBzeW5jaHJvbml6ZWQgcmVuZGVyaW5nIG9mIHRoZSB2aWV3IGFzIHRoZSB2aWV3IG1hbmFnZXJcbiAgICogZGVjaWRlIHdoaWNoIHZpZXcgdG8gZGlzcGxheSBiYXNlZCBvbiB0aGVpciBwcmlvcml0eS5cbiAgICovXG4gIHNob3coKSB7XG4gICAgaWYgKCF0aGlzLnZpZXcpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gICAgdmlld01hbmFnZXIucmVnaXN0ZXIodGhpcy52aWV3KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlIHRoZSB2aWV3IG9mIHRoZSBhY3Rpdml0eSBpZiBpdCBvd25zIG9uZS5cbiAgICovXG4gIGhpZGUoKSB7XG4gICAgaWYgKCF0aGlzLnZpZXcpIHsgcmV0dXJuOyB9XG5cbiAgICB2aWV3TWFuYWdlci5yZW1vdmUodGhpcy52aWV3KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHlcbiAgICogIG5hbWVzcGFjZWQgd2l0aCB0aGUgYWN0aXZpdHkncyBpZDogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBzb2NrZXQuc2VuZChgJHt0aGlzLmlkfToke2NoYW5uZWx9YCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyIHNpZGUgc29ja2V0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5XG4gICAqICBuYW1lc3BhY2VkIHdpdGggdGhlIGFjdGl2aXR5J3MgaWQ6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZFZvbGF0aWxlKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBzb2NrZXQuc2VuZFZvbGF0aWxlKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gYSBXZWJTb2NrZXQgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHlcbiAgICogIG5hbWVzcGFjZWQgd2l0aCB0aGUgYWN0aXZpdHkncyBpZDogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIHNvY2tldC5yZWNlaXZlKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCBsaXN0ZW5pbmcgdG8gYSBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseVxuICAgKiAgbmFtZXNwYWNlZCB3aXRoIHRoZSBhY3Rpdml0eSdzIGlkOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIHJlbW92ZSBmcm9tIHRoZSBzdGFjay5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWN0aXZpdHk7XG4iXX0=