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

var _View = require('../display/View');

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
//# sourceMappingURL=data:application/json;base64,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QixLQUFLLEVBQUwsU0FBVyxPQUFwQyxFQUErQyxRQUEvQyxFQURnQzs7Ozs7Ozs7Ozt3QkE1Rm5CO0FBQ2IsVUFBTSxXQUFXLEtBQUssU0FBTCxJQUFrQixLQUFLLG1CQUFMLENBQXlCLEtBQUssRUFBTCxDQUEzQzs7O0FBREosYUFJTixRQUFQLENBSmE7O3NCQU9GLE1BQU07QUFDakIsV0FBSyxTQUFMLEdBQWlCLElBQWpCLENBRGlCOzs7Ozs7Ozs7O3dCQVFMO0FBQ1osVUFBTSxVQUFVLEtBQUssUUFBTCxJQUFpQixLQUFLLGtCQUFMLENBQXdCLEtBQUssRUFBTCxDQUF6QyxDQURKOztBQUdaLFVBQUksT0FBSixFQUNFLFFBQVEsT0FBUixHQUFrQixLQUFLLGtCQUFMLENBQXdCLE9BQXhCLENBRHBCOztBQUdBLGFBQU8sT0FBUCxDQU5ZOztzQkFTRixLQUFLO0FBQ2YsV0FBSyxRQUFMLEdBQWdCLEdBQWhCLENBRGU7Ozs7K0NBekNpQixNQUFNO0FBQ3RDLGVBQVMsU0FBVCxDQUFtQixtQkFBbkIsR0FBeUMsSUFBekMsQ0FEc0M7Ozs7Ozs7Ozs7OzhDQVNQLE1BQU07QUFDckMsZUFBUyxTQUFULENBQW1CLGtCQUFuQixHQUF3QyxJQUF4QyxDQURxQzs7O1NBL0ZwQiIsImZpbGUiOiJBY3Rpdml0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9jZXNzIGZyb20gJy4vUHJvY2Vzcyc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi9TaWduYWxBbGwnO1xuaW1wb3J0IHNvY2tldCBmcm9tICcuL3NvY2tldCc7XG5pbXBvcnQgVmlldyBmcm9tICcuLi9kaXNwbGF5L1ZpZXcnO1xuaW1wb3J0IHZpZXdNYW5hZ2VyIGZyb20gJy4vdmlld01hbmFnZXInO1xuXG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3Igc2VydmljZXMgYW5kIHNjZW5lcy4gQmFzaWNhbGx5IGEgcHJvY2VzcyB3aXRoIHZpZXcgYW5kIG9wdGlvbm5hbCBuZXR3b3JrIGFiaWxpdGllcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWN0aXZpdHkgZXh0ZW5kcyBQcm9jZXNzIHtcbiAgY29uc3RydWN0b3IoaWQsIGhhc05ldHdvcmsgPSB0cnVlKSB7XG4gICAgc3VwZXIoaWQpO1xuXG4gICAgLyoqXG4gICAgICogSWYgYHRydWVgLCBkZWZpbmUgaWYgdGhlIHByb2Nlc3MgaGFzIGJlZW4gc3RhcnRlZCBvbmNlLlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuaGFzU3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgYXMgYSBuZXR3b3JrZWQgc2VydmljZS5cbiAgICAgKi9cbiAgICBpZiAoaGFzTmV0d29yaykge1xuICAgICAgdGhpcy5oYXNOZXR3b3JrID0gdHJ1ZTtcbiAgICAgIHNvY2tldC5yZXF1aXJlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlldyBvZiB0aGUgbW9kdWxlLlxuICAgICAqIEB0eXBlIHtWaWV3fVxuICAgICAqL1xuICAgIHRoaXMudmlldyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudHMgdG8gYmluZCB0byB0aGUgdmlldy4gKGNmLiBCYWNrYm9uZSdzIHN5bnRheCkuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQWRkaXRpb25uYWwgb3B0aW9ucyB0byBwYXNzIHRvIHRoZSB2aWV3LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy52aWV3T3B0aW9ucyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBhIHZpZXcgY29uc3RydWN0b3IgdG8gYmUgdXNlZCBpbiBgY3JlYXRlVmlld2AuXG4gICAgICogQHR5cGUge1ZpZXd9XG4gICAgICovXG4gICAgdGhpcy52aWV3Q3RvciA9IFZpZXc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdGVtcGxhdGUgb2YgdGhlIHZpZXcgKHVzZSBgbG9kYXNoLnRlbXBsYXRlYCBzeW50YXgpLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy50ZW1wbGF0ZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25zIG9mIHRoZSBwcm9jZXNzLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgdGhpcy5jb25maWd1cmUoeyB2aWV3UHJpb3JpdHk6IDAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmUgd2hpY2ggc2lnbmFsIHRoZSBgQWN0aXZpdHlgIHJlcXVpcmVzIHRvIHN0YXJ0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMgPSBuZXcgU2lnbmFsQWxsKCk7XG5cbiAgICB0aGlzLnNlbmQgPSB0aGlzLnNlbmQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNlbmRWb2xhdGlsZSA9IHRoaXMuc2VuZFZvbGF0aWxlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWNlaXZlID0gdGhpcy5yZWNlaXZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lciA9IHRoaXMucmVtb3ZlTGlzdGVuZXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIGJlIGltcGxlbWVudGVkIGluIGNoaWxkIGNsYXNzZXMuXG4gICAqIERlZmluZSB3aGF0IHRvIGRvIHdoZW4gYSBzZXJ2aWNlIGlzIHJlcXVpcmVkIGJ5IGFuIGBBY3Rpdml0eWAuXG4gICAqL1xuICByZXF1aXJlKCkge31cblxuICAvKipcbiAgICogQ29uZmlndXJlIHRoZSBwcm9jZXNzIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaGFyZSB0aGUgZGVmaW5lZCB0ZW1wbGF0ZXMgd2l0aCBhbGwgYEFjdGl2aXR5YCBpbnN0YW5jZXMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZzIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHRlbXBsYXRlcy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXRpYyBzZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyhkZWZzKSB7XG4gICAgQWN0aXZpdHkucHJvdG90eXBlLnRlbXBsYXRlRGVmaW5pdGlvbnMgPSBkZWZzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNoYXJlIHRoZSB0ZXh0IGNvbnRlbnQgY29uZmlndXJhdGlvbiAobmFtZSBhbmQgZGF0YSkgd2l0aCBhbGwgdGhlIGBBY3Rpdml0eWAgaW5zdGFuY2VzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZzIC0gVGhlIHRleHQgY29udGVudHMgb2YgdGhlIGFwcGxpY2F0aW9uLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhdGljIHNldFZpZXdDb250ZW50RGVmaW5pdGlvbnMoZGVmcykge1xuICAgIEFjdGl2aXR5LnByb3RvdHlwZS5jb250ZW50RGVmaW5pdGlvbnMgPSBkZWZzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRlbXBsYXRlIGFzc29jaWF0ZWQgdG8gdGhlIGN1cnJlbnQgbW9kdWxlLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IC0gVGhlIHRlbXBsYXRlIHJlbGF0ZWQgdG8gdGhlIGBuYW1lYCBvZiB0aGUgY3VycmVudCBtb2R1bGUuXG4gICAqL1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLl90ZW1wbGF0ZSB8fMKgdGhpcy50ZW1wbGF0ZURlZmluaXRpb25zW3RoaXMuaWRdO1xuICAgIC8vIGlmICghdGVtcGxhdGUpXG4gICAgLy8gICB0aHJvdyBuZXcgRXJyb3IoYE5vIHRlbXBsYXRlIGRlZmluZWQgZm9yIG1vZHVsZSBcIiR7dGhpcy5pZH1cImApO1xuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfVxuXG4gIHNldCB0ZW1wbGF0ZSh0bXBsKSB7XG4gICAgdGhpcy5fdGVtcGxhdGUgPSB0bXBsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRleHQgYXNzb2NpYXRlZCB0byB0aGUgY3VycmVudCBtb2R1bGUuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IC0gVGhlIHRleHQgY29udGVudHMgcmVsYXRlZCB0byB0aGUgYG5hbWVgIG9mIHRoZSBjdXJyZW50IG1vZHVsZS4gVGhlIHJldHVybmVkIG9iamVjdCBpcyBleHRlbmRlZCB3aXRoIGEgcG9pbnRlciB0byB0aGUgYGdsb2JhbHNgIGVudHJ5IG9mIHRoZSBkZWZpbmVkIHRleHQgY29udGVudHMuXG4gICAqL1xuICBnZXQgY29udGVudCgpIHtcbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5fY29udGVudCB8fMKgdGhpcy5jb250ZW50RGVmaW5pdGlvbnNbdGhpcy5pZF07XG5cbiAgICBpZiAoY29udGVudClcbiAgICAgIGNvbnRlbnQuZ2xvYmFscyA9IHRoaXMuY29udGVudERlZmluaXRpb25zLmdsb2JhbHM7XG5cbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIHNldCBjb250ZW50KG9iaikge1xuICAgIHRoaXMuX2NvbnRlbnQgPSBvYmo7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSB2aWV3IG9mIHRoZSBtb2R1bGUgYWNjb3JkaW5nIHRvIGl0cyBhdHRyaWJ1dGVzLlxuICAgKi9cbiAgY3JlYXRlVmlldygpIHtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBpZDogdGhpcy5pZCxcbiAgICAgIGNsYXNzTmFtZTogJ2FjdGl2aXR5JyxcbiAgICAgIHByaW9yaXR5OiB0aGlzLm9wdGlvbnMudmlld1ByaW9yaXR5LFxuICAgIH0sIHRoaXMudmlld09wdGlvbnMpO1xuXG4gICAgcmV0dXJuIG5ldyB0aGlzLnZpZXdDdG9yKHRoaXMudGVtcGxhdGUsIHRoaXMuY29udGVudCwgdGhpcy5ldmVudHMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgdGhlIHZpZXcgb2YgYSBtb2R1bGUgaWYgaXQgb3ducyBvbmUuXG4gICAqL1xuICBzaG93KCkge1xuICAgIGlmICghdGhpcy52aWV3KSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICAgIHZpZXdNYW5hZ2VyLnJlZ2lzdGVyKHRoaXMudmlldyk7XG4gIH1cblxuICAvKipcbiAgICogSGlkZSB0aGUgdmlldyBvZiBhbiBhY3Rpdml0eSBpZiBpdCBvd25zIG9uZS5cbiAgICovXG4gIGhpZGUoKSB7XG4gICAgaWYgKCF0aGlzLnZpZXcpIHsgcmV0dXJuOyB9XG5cbiAgICB2aWV3TWFuYWdlci5yZW1vdmUodGhpcy52aWV3KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIHNvY2tldC5zZW5kKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCAuLi5hcmdzKVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIHNvY2tldC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZFZvbGF0aWxlKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBzb2NrZXQuc2VuZFZvbGF0aWxlKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCAuLi5hcmdzKVxuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIHNvY2tldC5yZWNlaXZlKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCBsaXN0ZW5pbmcgdG8gYSBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBjYW5jZWwuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcihgJHt0aGlzLmlkfToke2NoYW5uZWx9YCwgY2FsbGJhY2spO1xuICB9XG59XG4iXX0=