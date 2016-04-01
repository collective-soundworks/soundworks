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
//# sourceMappingURL=data:application/json;base64,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Ozs7bUNBVVosU0FBUyxVQUFVO0FBQ2hDLHVCQUFPLGNBQVAsQ0FBeUIsS0FBSyxFQUFMLFNBQVcsT0FBcEMsRUFBK0MsUUFBL0MsRUFEZ0M7Ozs7Ozs7Ozs7O3dCQXJHZjtBQUNqQixVQUFNLGVBQWUsS0FBSyxhQUFMLElBQXNCLEtBQUssdUJBQUwsQ0FBNkIsS0FBSyxFQUFMLENBQW5EOzs7QUFESixhQUlWLFlBQVAsQ0FKaUI7O3NCQU9GLE1BQU07QUFDckIsV0FBSyxhQUFMLEdBQXFCLElBQXJCLENBRHFCOzs7Ozs7Ozs7Ozs7d0JBVUw7QUFDaEIsVUFBTSxjQUFjLEtBQUssWUFBTCxJQUFxQixLQUFLLHNCQUFMLENBQTRCLEtBQUssRUFBTCxDQUFqRCxDQURKOztBQUdoQixVQUFJLFdBQUosRUFDRSxZQUFZLE9BQVosR0FBc0IsS0FBSyxzQkFBTCxDQUE0QixPQUE1QixDQUR4Qjs7QUFHQSxhQUFPLFdBQVAsQ0FOZ0I7O3NCQVNGLEtBQUs7QUFDbkIsV0FBSyxZQUFMLEdBQW9CLEdBQXBCLENBRG1COzs7OytDQTdDYSxNQUFNO0FBQ3RDLGVBQVMsU0FBVCxDQUFtQix1QkFBbkIsR0FBNkMsSUFBN0MsQ0FEc0M7Ozs7Ozs7Ozs7Ozs4Q0FVUCxNQUFNO0FBQ3JDLGVBQVMsU0FBVCxDQUFtQixzQkFBbkIsR0FBNEMsSUFBNUMsQ0FEcUM7OztTQXhIbkM7OztrQkEyT1MiLCJmaWxlIjoiQWN0aXZpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvY2VzcyBmcm9tICcuL1Byb2Nlc3MnO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5pbXBvcnQgU2lnbmFsQWxsIGZyb20gJy4vU2lnbmFsQWxsJztcbmltcG9ydCBzb2NrZXQgZnJvbSAnLi9zb2NrZXQnO1xuaW1wb3J0IFZpZXcgZnJvbSAnLi4vdmlld3MvVmlldyc7XG5pbXBvcnQgdmlld01hbmFnZXIgZnJvbSAnLi92aWV3TWFuYWdlcic7XG5cblxuLyoqXG4gKiBJbnRlcm5hbCBiYXNlIGNsYXNzIGZvciBzZXJ2aWNlcyBhbmQgc2NlbmVzLiBCYXNpY2FsbHkgYSBwcm9jZXNzIHdpdGggdmlld1xuICogYW5kIG9wdGlvbm5hbCBuZXR3b3JrIGFiaWxpdGllcy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXh0ZW5kcyBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUHJvY2Vzc1xuICovXG5jbGFzcyBBY3Rpdml0eSBleHRlbmRzIFByb2Nlc3Mge1xuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gSWQgb2YgdGhlIGFjdGl2aXR5LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGhhc05ldHdvcmsgLSBEZWZpbmUgaWYgdGhlIGFjdGl2aXR5IG5lZWRzIGEgc29ja2V0XG4gICAqICBjb25uZWN0aW9uIG9yIG5vdC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGlkLCBoYXNOZXR3b3JrID0gdHJ1ZSkge1xuICAgIHN1cGVyKGlkKTtcblxuICAgIC8qKlxuICAgICAqIElmIGB0cnVlYCwgZGVmaW5lIGlmIHRoZSBhY3Rpdml0eSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQgb25jZS5cbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAbmFtZSBoYXNTdGFydGVkXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BY3Rpdml0eVxuICAgICAqL1xuICAgIHRoaXMuaGFzU3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgLy8gcmVnaXN0ZXIgYXMgYSBuZXR3b3JrZWQgc2VydmljZVxuICAgIGlmIChoYXNOZXR3b3JrKSB7XG4gICAgICB0aGlzLmhhc05ldHdvcmsgPSB0cnVlO1xuICAgICAgc29ja2V0LnJlcXVpcmVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaWV3IG9mIHRoZSBhY3Rpdml0eS5cbiAgICAgKiBAdHlwZSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXd9XG4gICAgICogQG5hbWUgdmlld1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHlcbiAgICAgKi9cbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnRzIHRvIGJpbmQgdG8gdGhlIHZpZXcuIChtaW1pYyB0aGUgQmFja2JvbmUncyBzeW50YXgpLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgdmlld0V2ZW50c1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHlcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHRoaXMudmlld0V2ZW50cyA9IHtcbiAgICAgKiAgIFwidG91Y2hzdGFydCAuYnV0dG9uXCI6IChlKSA9PiB7XG4gICAgICogICAgIC8vIGRvIHNvbXRoaW5nXG4gICAgICogICB9LFxuICAgICAqICAgLy8gZXRjLi4uXG4gICAgICogfTtcbiAgICAgKi9cbiAgICB0aGlzLnZpZXdFdmVudHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFkZGl0aW9ubmFsIG9wdGlvbnMgdG8gcGFzcyB0byB0aGUgdmlldy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIHZpZXdPcHRpb25zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BY3Rpdml0eVxuICAgICAqL1xuICAgIHRoaXMudmlld09wdGlvbnMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFZpZXcgY29uc3RydWN0b3IgdG8gYmUgdXNlZCBpblxuICAgICAqIFtgQWN0aXZpdHkjY3JlYXRlVmlld2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BY3Rpdml0eSNjcmVhdGVWaWV3fS5cbiAgICAgKiBAdHlwZSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXd9XG4gICAgICogQGRlZmF1bHQgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAgICAgKiBAbmFtZSB2aWV3Q3RvclxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHlcbiAgICAgKi9cbiAgICB0aGlzLnZpZXdDdG9yID0gVmlldztcblxuICAgIC8qKlxuICAgICAqIE9wdGlvbnMgb2YgdGhlIGFjdGl2aXR5LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgb3B0aW9uc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHlcbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB0aGlzLmNvbmZpZ3VyZSh7IHZpZXdQcmlvcml0eTogMCB9KTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZSB3aGljaCBzaWduYWwgdGhlIGBBY3Rpdml0eWAgcmVxdWlyZXMgdG8gc3RhcnQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscyA9IG5ldyBTaWduYWxBbGwoKTtcblxuICAgIHRoaXMuc2VuZCA9IHRoaXMuc2VuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2VuZFZvbGF0aWxlID0gdGhpcy5zZW5kVm9sYXRpbGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlY2VpdmUgPSB0aGlzLnJlY2VpdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyID0gdGhpcy5yZW1vdmVMaXN0ZW5lci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gYmUgaW1wbGVtZW50ZWQgaW4gY2hpbGQgY2xhc3Nlcy5cbiAgICogRGVmaW5lIHdoYXQgdG8gZG8gd2hlbiBhIHNlcnZpY2UgaXMgcmVxdWlyZWQgYnkgYW4gYEFjdGl2aXR5YC5cbiAgICovXG4gIHJlcXVpcmUoKSB7fVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgdGhlIGFjdGl2aXR5IHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaGFyZSB0aGUgZGVmaW5lZCB2aWV3IHRlbXBsYXRlcyB3aXRoIGFsbCBgQWN0aXZpdHlgIGluc3RhbmNlcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRlZnMgLSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgdmlldyB0ZW1wbGF0ZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGF0aWMgc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmcykge1xuICAgIEFjdGl2aXR5LnByb3RvdHlwZS52aWV3VGVtcGxhdGVEZWZpbml0aW9ucyA9IGRlZnM7XG4gIH1cblxuICAvKipcbiAgICogU2hhcmUgdGhlIHZpZXcgY29udGVudCBjb25maWd1cmF0aW9uIChuYW1lIGFuZCBkYXRhKSB3aXRoIGFsbCB0aGVcbiAgICogYEFjdGl2aXR5YCBpbnN0YW5jZXNcbiAgICogQHBhcmFtIHtPYmplY3R9IGRlZnMgLSBUaGUgdmlldyBjb250ZW50cyBvZiB0aGUgYXBwbGljYXRpb24uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGF0aWMgc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyhkZWZzKSB7XG4gICAgQWN0aXZpdHkucHJvdG90eXBlLnZpZXdDb250ZW50RGVmaW5pdGlvbnMgPSBkZWZzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0ZW1wbGF0ZSByZWxhdGVkIHRvIHRoZSBgaWRgIG9mIHRoZSBhY3Rpdml0eS5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmRlZmF1bHRWaWV3VGVtcGxhdGVzfVxuICAgKi9cbiAgZ2V0IHZpZXdUZW1wbGF0ZSgpIHtcbiAgICBjb25zdCB2aWV3VGVtcGxhdGUgPSB0aGlzLl92aWV3VGVtcGxhdGUgfHzCoHRoaXMudmlld1RlbXBsYXRlRGVmaW5pdGlvbnNbdGhpcy5pZF07XG4gICAgLy8gaWYgKCF2aWV3VGVtcGxhdGUpXG4gICAgLy8gICB0aHJvdyBuZXcgRXJyb3IoYE5vIHZpZXcgdGVtcGxhdGUgZGVmaW5lZCBmb3IgYWN0aXZpdHkgXCIke3RoaXMuaWR9XCJgKTtcbiAgICByZXR1cm4gdmlld1RlbXBsYXRlO1xuICB9XG5cbiAgc2V0IHZpZXdUZW1wbGF0ZSh0bXBsKSB7XG4gICAgdGhpcy5fdmlld1RlbXBsYXRlID0gdG1wbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdmlldyBjb250ZW50cyByZWxhdGVkIHRvIHRoZSBgaWRgIG9mIHRoZSBhY3Rpdml0eS4gVGhlIG9iamVjdCBpc1xuICAgKiBleHRlbmRlZCB3aXRoIGEgcG9pbnRlciB0byB0aGUgYGdsb2JhbHNgIGVudHJ5IG9mIHRoZSBkZWZpbmVkIHZpZXcgY29udGVudHMuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5kZWZhdWx0Vmlld0NvbnRlbnR9XG4gICAqL1xuICBnZXQgdmlld0NvbnRlbnQoKSB7XG4gICAgY29uc3Qgdmlld0NvbnRlbnQgPSB0aGlzLl92aWV3Q29udGVudCB8fMKgdGhpcy52aWV3Q29udGVudERlZmluaXRpb25zW3RoaXMuaWRdO1xuXG4gICAgaWYgKHZpZXdDb250ZW50KVxuICAgICAgdmlld0NvbnRlbnQuZ2xvYmFscyA9IHRoaXMudmlld0NvbnRlbnREZWZpbml0aW9ucy5nbG9iYWxzO1xuXG4gICAgcmV0dXJuIHZpZXdDb250ZW50O1xuICB9XG5cbiAgc2V0IHZpZXdDb250ZW50KG9iaikge1xuICAgIHRoaXMuX3ZpZXdDb250ZW50ID0gb2JqO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgdmlldyBvZiB0aGUgYWN0aXZpdHkgYWNjb3JkaW5nIHRvIGl0cyBgdmlld0N0b3JgLCBgdmlld1RlbXBsYXRlYCxcbiAgICogYHZpZXdDb250ZW50YCwgYHZpZXdFdmVudHNgIGFuZCBgdmlld09wdGlvbnNgIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBjcmVhdGVWaWV3KCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGlkOiB0aGlzLmlkLnJlcGxhY2UoL1xcOi9nLCAnLScpLFxuICAgICAgY2xhc3NOYW1lOiAnYWN0aXZpdHknLFxuICAgICAgcHJpb3JpdHk6IHRoaXMub3B0aW9ucy52aWV3UHJpb3JpdHksXG4gICAgfSwgdGhpcy52aWV3T3B0aW9ucyk7XG5cbiAgICByZXR1cm4gbmV3IHRoaXMudmlld0N0b3IodGhpcy52aWV3VGVtcGxhdGUsIHRoaXMudmlld0NvbnRlbnQsIHRoaXMudmlld0V2ZW50cywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCB0aGUgdmlldyBtYW5hZ2VyIHRvIGRpc3BsYXkgdGhlIHZpZXcuIFRoZSBjYWxsIG9mIHRoaXMgbWV0aG9kXG4gICAqIGRvZXNuJ3QgZ2FyYW50ZWUgYSBzeW5jaHJvbml6ZWQgcmVuZGVyaW5nIG9mIHRoZSB2aWV3IGFzIHRoZSB2aWV3IG1hbmFnZXJcbiAgICogZGVjaWRlIHdoaWNoIHZpZXcgdG8gZGlzcGxheSBiYXNlZCBvbiB0aGVpciBwcmlvcml0eS5cbiAgICovXG4gIHNob3coKSB7XG4gICAgaWYgKCF0aGlzLnZpZXcpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gICAgdmlld01hbmFnZXIucmVnaXN0ZXIodGhpcy52aWV3KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlIHRoZSB2aWV3IG9mIHRoZSBhY3Rpdml0eSBpZiBpdCBvd25zIG9uZS5cbiAgICovXG4gIGhpZGUoKSB7XG4gICAgaWYgKCF0aGlzLnZpZXcpIHsgcmV0dXJuOyB9XG5cbiAgICB2aWV3TWFuYWdlci5yZW1vdmUodGhpcy52aWV3KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHlcbiAgICogIG5hbWVzcGFjZWQgd2l0aCB0aGUgYWN0aXZpdHkncyBpZDogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBzb2NrZXQuc2VuZChgJHt0aGlzLmlkfToke2NoYW5uZWx9YCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyIHNpZGUgc29ja2V0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5XG4gICAqICBuYW1lc3BhY2VkIHdpdGggdGhlIGFjdGl2aXR5J3MgaWQ6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZFZvbGF0aWxlKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBzb2NrZXQuc2VuZFZvbGF0aWxlKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gYSBXZWJTb2NrZXQgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHlcbiAgICogIG5hbWVzcGFjZWQgd2l0aCB0aGUgYWN0aXZpdHkncyBpZDogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIHNvY2tldC5yZWNlaXZlKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCBsaXN0ZW5pbmcgdG8gYSBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseVxuICAgKiAgbmFtZXNwYWNlZCB3aXRoIHRoZSBhY3Rpdml0eSdzIGlkOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIHJlbW92ZSBmcm9tIHRoZSBzdGFjay5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWN0aXZpdHk7XG5cbiJdfQ==