'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _Activity = require('./Activity');

var _Activity2 = _interopRequireDefault(_Activity);

var _serviceManager = require('./serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _viewManager = require('./viewManager');

var _viewManager2 = _interopRequireDefault(_viewManager);

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

var _defaultViewContent = require('../config/defaultViewContent');

var _defaultViewContent2 = _interopRequireDefault(_defaultViewContent);

var _defaultViewTemplates = require('../config/defaultViewTemplates');

var _defaultViewTemplates2 = _interopRequireDefault(_defaultViewTemplates);

var _viewport = require('../views/viewport');

var _viewport2 = _interopRequireDefault(_viewport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Client side entry point for a `soundworks` application.
 *
 * This object host general informations about the user, as well as methods
 * to initialize and start the application.
 *
 * @memberof module:soundworks/client
 * @namespace
 *
 * @example
 * import * as soundworks from 'soundworks/client';
 * import MyExperience from './MyExperience';
 *
 * soundworks.client.init('player');
 * const myExperience = new MyExperience();
 * soundworks.client.start();
 */
var client = {
  /**
   * Unique id of the client, generated and retrieved by the server.
   *
   * @type {Number}
   */
  uuid: null,

  /**
   * The type of the client, this can generally be considered as the role of the
   * client in the application. This value is defined as argument of the
   * [`client.init`]{@link module:soundworks/client.client.init} method and
   * defaults to `'player'`.
   *
   * @type {String}
   */
  type: null,

  /**
   * Configuration informations from the server configuration if any.
   *
   * @type {Object}
   * @see {@link module:soundworks/client.SharedConfig}
   */
  config: null,

  /**
   * Array of optionnal parameters passed through the url
   *
   * @type {Array}
   */
  urlParams: null,

  /**
   * Information about the client platform. The properties are set by the
   * [`platform`]{@link module:soundworks/client.Platform} service.
   *
   * @type {Object}
   * @property {String} os - Operating system.
   * @property {Boolean} isMobile - Indicates whether the client is running on a
   *  mobile platform or not.
   * @property {String} audioFileExt - Audio file extension to use, depending on
   *  the platform.
   *
   * @see {@link module:soundworks/client.Platform}
   */
  platform: {
    os: null,
    isMobile: null,
    audioFileExt: ''
  },

  /**
   * Defines whether the user's device is compatible with the application
   * requirements.
   *
   * @type {Boolean}
   * @see {@link module:soundworks/client.Platform}
   */
  compatible: null,

  /**
   * Index (if any) given by a [`placer`]{@link module:soundworks/client.Placer}
   * or [`checkin`]{@link module:soundworks/client.Checkin} service.
   *
   * @type {Number}
   * @see {@link module:soundworks/client.Checkin}
   * @see {@link module:soundworks/client.Placer}
   */
  index: null,

  /**
   * Ticket label (if any) given by a [`placer`]{@link module:soundworks/client.Placer}
   * or [`checkin`]{@link module:soundworks/client.Checkin} service.
   *
   * @type {String}
   * @see {@link module:soundworks/client.Checkin}
   * @see {@link module:soundworks/client.Placer}
   */
  label: null,

  /**
   * Client coordinates (if any) given by a
   * [`locator`]{@link module:soundworks/client.Locator},
   * [`placer`]{@link module:soundworks/client.Placer} or
   * [`checkin`]{@link module:soundworks/client.Checkin} service.
   * (Format: `[x:Number, y:Number]`.)
   *
   * @type {Array<Number>}
   * @see {@link module:soundworks/client.Checkin}
   * @see {@link module:soundworks/client.Locator}
   * @see {@link module:soundworks/client.Placer}
   */
  coordinates: null,

  /**
   * Socket object that handle communications with the server, if any.
   * This object is automatically created if the experience requires any service
   * having a server-side counterpart.
   *
   * @type {module:soundworks/client.socket}
   * @private
   */
  socket: null,

  /**
   * Initialize the application.
   *
   * @param {String} [clientType='player'] - The type of the client, defines the
   *  socket connection namespace. Should match a client type defined server side.
   * @param {Object} [config={}]
   * @param {Object} [config.appContainer='#container'] - A css selector
   *  matching a DOM element where the views should be inserted.
   * @param {Object} [config.socketIO.url=''] - The url where the socket should
   *  connect _(unstable)_.
   * @param {Object} [config.socketIO.transports=['websocket']] - The transport
   *  used to create the url (overrides default socket.io mecanism) _(unstable)_.
   */
  init: function init() {
    var clientType = arguments.length <= 0 || arguments[0] === undefined ? 'player' : arguments[0];
    var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    this.type = clientType;

    // retrieve
    this._parseUrlParams();
    // if socket config given, mix it with defaults
    var socketIO = (0, _assign2.default)({
      url: '',
      transports: ['websocket']
    }, config.socketIO);

    // mix all other config and override with defined socket config
    this.config = (0, _assign2.default)({
      appContainer: '#container'
    }, config, { socketIO: socketIO });

    _serviceManager2.default.init();

    this._initViews();
  },


  /**
   * Start the application.
   */
  start: function start() {
    if (_socket2.default.required) this._initSocket();else _serviceManager2.default.start();
  },


  /**
   * Returns a service configured with the given options.
   * @param {String} id - Identifier of the service.
   * @param {Object} options - Options to configure the service.
   */
  require: function require(id, options) {
    return _serviceManager2.default.require(id, options);
  },


  /**
   * Retrieve an array of optionnal parameters from the url excluding the client type
   * and store it in `this.config.urlParameters`.
   * Parameters can be defined in two ways :
   * - as a regular route (ex: `/player/param1/param2`)
   * - as a hash (ex: `/player#param1-param2`)
   * The parameters are send along with the socket connection
   *
   * @see {@link module:soundworks/client.socket}
   * @private
   * @todo - When handshake implemented, define if these informations should be part of it
   */
  _parseUrlParams: function _parseUrlParams() {
    // let params = null;
    // handle path name first
    var pathname = window.location.pathname;
    // sanitize
    pathname = pathname.replace(/^\//, '') // leading slash
    .replace(new RegExp('^' + this.type + '/?'), '') // clientType
    .replace(/\/$/, ''); // trailing slashe

    if (pathname.length > 0) this.urlParams = pathname.split('/');
    // } else {
    //   let hash = window.location.hash
    //   hash = hash.substr(1); // remove leading '#'
    //   params = hash.split('-'); // how to handle from server side config
    // }
    // this.urlParams = params;
  },


  /**
   * Initialize socket connection and perform handshake with the server.
   * @todo - refactor handshake.
   * @private
   */
  _initSocket: function _initSocket() {
    var _this = this;

    this.socket = _socket2.default.initialize(this.type, this.config.socketIO);
    // send `urlParams` throught handshake to not polute the socket.io api
    // and eventually be able to modify the transport system
    this.socket.send('handshake', { urlParams: this.urlParams });
    // wait for handshake to mark client as `ready`
    this.socket.receive('client:start', function (uuid) {
      // don't handle server restart for now.
      _this.uuid = uuid;
      _serviceManager2.default.start();

      // this.comm.receive('reconnect', () => console.info('reconnect'));
      // this.comm.receive('disconnect', () => {
      //   console.info('disconnect')
      //   serviceManager.reset(); // can relaunch serviceManager on reconnection.
      // });
      // this.comm.receive('error', (err) => console.error(err));
    });
  },


  /**
   * Initialize view templates for all activities.
   * @private
   */
  _initViews: function _initViews() {
    _viewport2.default.init();
    // initialize views with default view content and templates
    this.viewContent = {};
    this.viewTemplates = {};

    var appName = this.config.appName || _defaultViewContent2.default.globals.appName;
    var viewContent = (0, _assign2.default)(_defaultViewContent2.default, { globals: { appName: appName } });

    this.setViewContentDefinitions(viewContent);
    this.setViewTemplateDefinitions(_defaultViewTemplates2.default);
    this.setAppContainer(this.config.appContainer);
  },


  /**
   * Extend or override application view contents with the given object.
   * @param {Object} defs - Content to be used by activities.
   */
  setViewContentDefinitions: function setViewContentDefinitions(defs) {
    this.viewContent = (0, _assign2.default)(this.viewContent, defs);
    _Activity2.default.setViewContentDefinitions(this.viewContent);
  },


  /**
   * Extend or override application view templates with the given object.
   * @param {Object} defs - Templates to be used by activities.
   */
  setViewTemplateDefinitions: function setViewTemplateDefinitions(defs) {
    this.viewTemplates = (0, _assign2.default)(this.viewTemplates, defs);
    _Activity2.default.setViewTemplateDefinitions(this.viewTemplates);
  },


  /**
   * Set the DOM elemnt that will be the container for all views.
   * @private
   * @param {String|Element} el - DOM element (or css selector matching
   *  an existing element) to be used as the container of the application.
   */
  setAppContainer: function setAppContainer(el) {
    var $container = el instanceof Element ? el : document.querySelector(el);
    _viewManager2.default.setViewContainer($container);
  }
};

exports.default = client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsSUFBTSxTQUFTOzs7Ozs7QUFNYixRQUFNLElBTk87Ozs7Ozs7Ozs7QUFnQmIsUUFBTSxJQWhCTzs7Ozs7Ozs7QUF3QmIsVUFBUSxJQXhCSzs7Ozs7OztBQStCWixhQUFXLElBL0JDOzs7Ozs7Ozs7Ozs7Ozs7QUE4Q2IsWUFBVTtBQUNSLFFBQUksSUFESTtBQUVSLGNBQVUsSUFGRjtBQUdSLGtCQUFjO0FBSE4sR0E5Q0c7Ozs7Ozs7OztBQTJEYixjQUFZLElBM0RDOzs7Ozs7Ozs7O0FBcUViLFNBQU8sSUFyRU07Ozs7Ozs7Ozs7QUErRWIsU0FBTyxJQS9FTTs7Ozs7Ozs7Ozs7Ozs7QUE2RmIsZUFBYSxJQTdGQTs7Ozs7Ozs7OztBQXVHYixVQUFRLElBdkdLOzs7Ozs7Ozs7Ozs7Ozs7QUFzSGIsTUF0SGEsa0JBc0g0QjtBQUFBLFFBQXBDLFVBQW9DLHlEQUF2QixRQUF1QjtBQUFBLFFBQWIsTUFBYSx5REFBSixFQUFJOztBQUN2QyxTQUFLLElBQUwsR0FBWSxVQUFaOzs7QUFHQSxTQUFLLGVBQUw7O0FBRUEsUUFBTSxXQUFXLHNCQUFjO0FBQzdCLFdBQUssRUFEd0I7QUFFN0Isa0JBQVksQ0FBQyxXQUFEO0FBRmlCLEtBQWQsRUFHZCxPQUFPLFFBSE8sQ0FBakI7OztBQU1BLFNBQUssTUFBTCxHQUFjLHNCQUFjO0FBQzFCLG9CQUFjO0FBRFksS0FBZCxFQUVYLE1BRlcsRUFFSCxFQUFFLGtCQUFGLEVBRkcsQ0FBZDs7QUFJQSw2QkFBZSxJQUFmOztBQUVBLFNBQUssVUFBTDtBQUNELEdBeklZOzs7Ozs7QUE4SWIsT0E5SWEsbUJBOElMO0FBQ04sUUFBSSxpQkFBTyxRQUFYLEVBQ0UsS0FBSyxXQUFMLEdBREYsS0FHRSx5QkFBZSxLQUFmO0FBQ0gsR0FuSlk7Ozs7Ozs7O0FBMEpiLFNBMUphLG1CQTBKTCxFQTFKSyxFQTBKRCxPQTFKQyxFQTBKUTtBQUNuQixXQUFPLHlCQUFlLE9BQWYsQ0FBdUIsRUFBdkIsRUFBMkIsT0FBM0IsQ0FBUDtBQUNELEdBNUpZOzs7Ozs7Ozs7Ozs7Ozs7QUEwS2IsaUJBMUthLDZCQTBLSzs7O0FBR2hCLFFBQUksV0FBVyxPQUFPLFFBQVAsQ0FBZ0IsUUFBL0I7O0FBRUEsZUFBVyxTQUNSLE9BRFEsQ0FDQSxLQURBLEVBQ08sRUFEUCxDO0FBQUEsS0FFUixPQUZRLENBRUEsSUFBSSxNQUFKLENBQVcsTUFBTSxLQUFLLElBQVgsR0FBa0IsSUFBN0IsQ0FGQSxFQUVvQyxFQUZwQyxDO0FBQUEsS0FHUixPQUhRLENBR0EsS0FIQSxFQUdPLEVBSFAsQ0FBWCxDOztBQUtBLFFBQUksU0FBUyxNQUFULEdBQWtCLENBQXRCLEVBQ0UsS0FBSyxTQUFMLEdBQWlCLFNBQVMsS0FBVCxDQUFlLEdBQWYsQ0FBakI7Ozs7Ozs7QUFPSCxHQTVMWTs7Ozs7Ozs7QUFtTWIsYUFuTWEseUJBbU1DO0FBQUE7O0FBQ1osU0FBSyxNQUFMLEdBQWMsaUJBQU8sVUFBUCxDQUFrQixLQUFLLElBQXZCLEVBQTZCLEtBQUssTUFBTCxDQUFZLFFBQXpDLENBQWQ7OztBQUdBLFNBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsV0FBakIsRUFBOEIsRUFBRSxXQUFXLEtBQUssU0FBbEIsRUFBOUI7O0FBRUEsU0FBSyxNQUFMLENBQVksT0FBWixDQUFvQixjQUFwQixFQUFvQyxVQUFDLElBQUQsRUFBVTs7QUFFNUMsWUFBSyxJQUFMLEdBQVksSUFBWjtBQUNBLCtCQUFlLEtBQWY7Ozs7Ozs7O0FBUUQsS0FYRDtBQVlELEdBck5ZOzs7Ozs7O0FBMk5iLFlBM05hLHdCQTJOQTtBQUNYLHVCQUFTLElBQVQ7O0FBRUEsU0FBSyxXQUFMLEdBQW1CLEVBQW5CO0FBQ0EsU0FBSyxhQUFMLEdBQXFCLEVBQXJCOztBQUVBLFFBQU0sVUFBVSxLQUFLLE1BQUwsQ0FBWSxPQUFaLElBQXVCLDZCQUFtQixPQUFuQixDQUEyQixPQUFsRTtBQUNBLFFBQU0sY0FBYyxvREFBa0MsRUFBRSxTQUFTLEVBQUUsZ0JBQUYsRUFBWCxFQUFsQyxDQUFwQjs7QUFFQSxTQUFLLHlCQUFMLENBQStCLFdBQS9CO0FBQ0EsU0FBSywwQkFBTDtBQUNBLFNBQUssZUFBTCxDQUFxQixLQUFLLE1BQUwsQ0FBWSxZQUFqQztBQUNELEdBdk9ZOzs7Ozs7O0FBNk9iLDJCQTdPYSxxQ0E2T2EsSUE3T2IsRUE2T21CO0FBQzlCLFNBQUssV0FBTCxHQUFtQixzQkFBYyxLQUFLLFdBQW5CLEVBQWdDLElBQWhDLENBQW5CO0FBQ0EsdUJBQVMseUJBQVQsQ0FBbUMsS0FBSyxXQUF4QztBQUNELEdBaFBZOzs7Ozs7O0FBc1BiLDRCQXRQYSxzQ0FzUGMsSUF0UGQsRUFzUG9CO0FBQy9CLFNBQUssYUFBTCxHQUFxQixzQkFBYyxLQUFLLGFBQW5CLEVBQWtDLElBQWxDLENBQXJCO0FBQ0EsdUJBQVMsMEJBQVQsQ0FBb0MsS0FBSyxhQUF6QztBQUNELEdBelBZOzs7Ozs7Ozs7QUFpUWIsaUJBalFhLDJCQWlRRyxFQWpRSCxFQWlRTztBQUNsQixRQUFNLGFBQWEsY0FBYyxPQUFkLEdBQXdCLEVBQXhCLEdBQTZCLFNBQVMsYUFBVCxDQUF1QixFQUF2QixDQUFoRDtBQUNBLDBCQUFZLGdCQUFaLENBQTZCLFVBQTdCO0FBQ0Q7QUFwUVksQ0FBZjs7a0JBd1FlLE0iLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5pbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi9BY3Rpdml0eSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgdmlld01hbmFnZXIgZnJvbSAnLi92aWV3TWFuYWdlcic7XG5pbXBvcnQgc29ja2V0IGZyb20gJy4vc29ja2V0JztcbmltcG9ydCBkZWZhdWx0Vmlld0NvbnRlbnQgZnJvbSAnLi4vY29uZmlnL2RlZmF1bHRWaWV3Q29udGVudCc7XG5pbXBvcnQgZGVmYXVsdFZpZXdUZW1wbGF0ZXMgZnJvbSAnLi4vY29uZmlnL2RlZmF1bHRWaWV3VGVtcGxhdGVzJztcbmltcG9ydCB2aWV3cG9ydCBmcm9tICcuLi92aWV3cy92aWV3cG9ydCc7XG5cbi8qKlxuICogQ2xpZW50IHNpZGUgZW50cnkgcG9pbnQgZm9yIGEgYHNvdW5kd29ya3NgIGFwcGxpY2F0aW9uLlxuICpcbiAqIFRoaXMgb2JqZWN0IGhvc3QgZ2VuZXJhbCBpbmZvcm1hdGlvbnMgYWJvdXQgdGhlIHVzZXIsIGFzIHdlbGwgYXMgbWV0aG9kc1xuICogdG8gaW5pdGlhbGl6ZSBhbmQgc3RhcnQgdGhlIGFwcGxpY2F0aW9uLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBuYW1lc3BhY2VcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG4gKiBpbXBvcnQgTXlFeHBlcmllbmNlIGZyb20gJy4vTXlFeHBlcmllbmNlJztcbiAqXG4gKiBzb3VuZHdvcmtzLmNsaWVudC5pbml0KCdwbGF5ZXInKTtcbiAqIGNvbnN0IG15RXhwZXJpZW5jZSA9IG5ldyBNeUV4cGVyaWVuY2UoKTtcbiAqIHNvdW5kd29ya3MuY2xpZW50LnN0YXJ0KCk7XG4gKi9cbmNvbnN0IGNsaWVudCA9IHtcbiAgLyoqXG4gICAqIFVuaXF1ZSBpZCBvZiB0aGUgY2xpZW50LCBnZW5lcmF0ZWQgYW5kIHJldHJpZXZlZCBieSB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgdXVpZDogbnVsbCxcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgdGhlIGNsaWVudCwgdGhpcyBjYW4gZ2VuZXJhbGx5IGJlIGNvbnNpZGVyZWQgYXMgdGhlIHJvbGUgb2YgdGhlXG4gICAqIGNsaWVudCBpbiB0aGUgYXBwbGljYXRpb24uIFRoaXMgdmFsdWUgaXMgZGVmaW5lZCBhcyBhcmd1bWVudCBvZiB0aGVcbiAgICogW2BjbGllbnQuaW5pdGBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5jbGllbnQuaW5pdH0gbWV0aG9kIGFuZFxuICAgKiBkZWZhdWx0cyB0byBgJ3BsYXllcidgLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgdHlwZTogbnVsbCxcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbnMgZnJvbSB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gaWYgYW55LlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkQ29uZmlnfVxuICAgKi9cbiAgY29uZmlnOiBudWxsLFxuXG4gIC8qKlxuICAgKiBBcnJheSBvZiBvcHRpb25uYWwgcGFyYW1ldGVycyBwYXNzZWQgdGhyb3VnaCB0aGUgdXJsXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG4gICB1cmxQYXJhbXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluZm9ybWF0aW9uIGFib3V0IHRoZSBjbGllbnQgcGxhdGZvcm0uIFRoZSBwcm9wZXJ0aWVzIGFyZSBzZXQgYnkgdGhlXG4gICAqIFtgcGxhdGZvcm1gXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm19IHNlcnZpY2UuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvcyAtIE9wZXJhdGluZyBzeXN0ZW0uXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNNb2JpbGUgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgY2xpZW50IGlzIHJ1bm5pbmcgb24gYVxuICAgKiAgbW9iaWxlIHBsYXRmb3JtIG9yIG5vdC5cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGF1ZGlvRmlsZUV4dCAtIEF1ZGlvIGZpbGUgZXh0ZW5zaW9uIHRvIHVzZSwgZGVwZW5kaW5nIG9uXG4gICAqICB0aGUgcGxhdGZvcm0uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX1cbiAgICovXG4gIHBsYXRmb3JtOiB7XG4gICAgb3M6IG51bGwsXG4gICAgaXNNb2JpbGU6IG51bGwsXG4gICAgYXVkaW9GaWxlRXh0OiAnJyxcbiAgfSxcblxuICAvKipcbiAgICogRGVmaW5lcyB3aGV0aGVyIHRoZSB1c2VyJ3MgZGV2aWNlIGlzIGNvbXBhdGlibGUgd2l0aCB0aGUgYXBwbGljYXRpb25cbiAgICogcmVxdWlyZW1lbnRzLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfVxuICAgKi9cbiAgY29tcGF0aWJsZTogbnVsbCxcblxuICAvKipcbiAgICogSW5kZXggKGlmIGFueSkgZ2l2ZW4gYnkgYSBbYHBsYWNlcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqIG9yIFtgY2hlY2tpbmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSBzZXJ2aWNlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICovXG4gIGluZGV4OiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaWNrZXQgbGFiZWwgKGlmIGFueSkgZ2l2ZW4gYnkgYSBbYHBsYWNlcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqIG9yIFtgY2hlY2tpbmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSBzZXJ2aWNlLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICovXG4gIGxhYmVsOiBudWxsLFxuXG4gIC8qKlxuICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgKGlmIGFueSkgZ2l2ZW4gYnkgYVxuICAgKiBbYGxvY2F0b3JgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn0sXG4gICAqIFtgcGxhY2VyYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn0gb3JcbiAgICogW2BjaGVja2luYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59IHNlcnZpY2UuXG4gICAqIChGb3JtYXQ6IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAuKVxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXk8TnVtYmVyPn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Mb2NhdG9yfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICAgKi9cbiAgY29vcmRpbmF0ZXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIFNvY2tldCBvYmplY3QgdGhhdCBoYW5kbGUgY29tbXVuaWNhdGlvbnMgd2l0aCB0aGUgc2VydmVyLCBpZiBhbnkuXG4gICAqIFRoaXMgb2JqZWN0IGlzIGF1dG9tYXRpY2FsbHkgY3JlYXRlZCBpZiB0aGUgZXhwZXJpZW5jZSByZXF1aXJlcyBhbnkgc2VydmljZVxuICAgKiBoYXZpbmcgYSBzZXJ2ZXItc2lkZSBjb3VudGVycGFydC5cbiAgICpcbiAgICogQHR5cGUge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5zb2NrZXR9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzb2NrZXQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2NsaWVudFR5cGU9J3BsYXllciddIC0gVGhlIHR5cGUgb2YgdGhlIGNsaWVudCwgZGVmaW5lcyB0aGVcbiAgICogIHNvY2tldCBjb25uZWN0aW9uIG5hbWVzcGFjZS4gU2hvdWxkIG1hdGNoIGEgY2xpZW50IHR5cGUgZGVmaW5lZCBzZXJ2ZXIgc2lkZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWc9e31dXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLmFwcENvbnRhaW5lcj0nI2NvbnRhaW5lciddIC0gQSBjc3Mgc2VsZWN0b3JcbiAgICogIG1hdGNoaW5nIGEgRE9NIGVsZW1lbnQgd2hlcmUgdGhlIHZpZXdzIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuc29ja2V0SU8udXJsPScnXSAtIFRoZSB1cmwgd2hlcmUgdGhlIHNvY2tldCBzaG91bGRcbiAgICogIGNvbm5lY3QgXyh1bnN0YWJsZSlfLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy5zb2NrZXRJTy50cmFuc3BvcnRzPVsnd2Vic29ja2V0J11dIC0gVGhlIHRyYW5zcG9ydFxuICAgKiAgdXNlZCB0byBjcmVhdGUgdGhlIHVybCAob3ZlcnJpZGVzIGRlZmF1bHQgc29ja2V0LmlvIG1lY2FuaXNtKSBfKHVuc3RhYmxlKV8uXG4gICAqL1xuICBpbml0KGNsaWVudFR5cGUgPSAncGxheWVyJywgY29uZmlnID0ge30pIHtcbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG4gICAgLy8gcmV0cmlldmVcbiAgICB0aGlzLl9wYXJzZVVybFBhcmFtcygpO1xuICAgIC8vIGlmIHNvY2tldCBjb25maWcgZ2l2ZW4sIG1peCBpdCB3aXRoIGRlZmF1bHRzXG4gICAgY29uc3Qgc29ja2V0SU8gPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHVybDogJycsXG4gICAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddXG4gICAgfSwgY29uZmlnLnNvY2tldElPKTtcblxuICAgIC8vIG1peCBhbGwgb3RoZXIgY29uZmlnIGFuZCBvdmVycmlkZSB3aXRoIGRlZmluZWQgc29ja2V0IGNvbmZpZ1xuICAgIHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBhcHBDb250YWluZXI6ICcjY29udGFpbmVyJyxcbiAgICB9LCBjb25maWcsIHsgc29ja2V0SU8gfSk7XG5cbiAgICBzZXJ2aWNlTWFuYWdlci5pbml0KCk7XG5cbiAgICB0aGlzLl9pbml0Vmlld3MoKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgaWYgKHNvY2tldC5yZXF1aXJlZClcbiAgICAgIHRoaXMuX2luaXRTb2NrZXQoKTtcbiAgICBlbHNlXG4gICAgICBzZXJ2aWNlTWFuYWdlci5zdGFydCgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2VydmljZSBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIElkZW50aWZpZXIgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhbiBhcnJheSBvZiBvcHRpb25uYWwgcGFyYW1ldGVycyBmcm9tIHRoZSB1cmwgZXhjbHVkaW5nIHRoZSBjbGllbnQgdHlwZVxuICAgKiBhbmQgc3RvcmUgaXQgaW4gYHRoaXMuY29uZmlnLnVybFBhcmFtZXRlcnNgLlxuICAgKiBQYXJhbWV0ZXJzIGNhbiBiZSBkZWZpbmVkIGluIHR3byB3YXlzIDpcbiAgICogLSBhcyBhIHJlZ3VsYXIgcm91dGUgKGV4OiBgL3BsYXllci9wYXJhbTEvcGFyYW0yYClcbiAgICogLSBhcyBhIGhhc2ggKGV4OiBgL3BsYXllciNwYXJhbTEtcGFyYW0yYClcbiAgICogVGhlIHBhcmFtZXRlcnMgYXJlIHNlbmQgYWxvbmcgd2l0aCB0aGUgc29ja2V0IGNvbm5lY3Rpb25cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LnNvY2tldH1cbiAgICogQHByaXZhdGVcbiAgICogQHRvZG8gLSBXaGVuIGhhbmRzaGFrZSBpbXBsZW1lbnRlZCwgZGVmaW5lIGlmIHRoZXNlIGluZm9ybWF0aW9ucyBzaG91bGQgYmUgcGFydCBvZiBpdFxuICAgKi9cbiAgX3BhcnNlVXJsUGFyYW1zKCkge1xuICAgIC8vIGxldCBwYXJhbXMgPSBudWxsO1xuICAgIC8vIGhhbmRsZSBwYXRoIG5hbWUgZmlyc3RcbiAgICBsZXQgcGF0aG5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgLy8gc2FuaXRpemVcbiAgICBwYXRobmFtZSA9IHBhdGhuYW1lXG4gICAgICAucmVwbGFjZSgvXlxcLy8sICcnKSAvLyBsZWFkaW5nIHNsYXNoXG4gICAgICAucmVwbGFjZShuZXcgUmVnRXhwKCdeJyArIHRoaXMudHlwZSArICcvPycpLCAnJykgLy8gY2xpZW50VHlwZVxuICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJyk7IC8vIHRyYWlsaW5nIHNsYXNoZVxuXG4gICAgaWYgKHBhdGhuYW1lLmxlbmd0aCA+IDApXG4gICAgICB0aGlzLnVybFBhcmFtcyA9IHBhdGhuYW1lLnNwbGl0KCcvJyk7XG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgIGxldCBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2hcbiAgICAvLyAgIGhhc2ggPSBoYXNoLnN1YnN0cigxKTsgLy8gcmVtb3ZlIGxlYWRpbmcgJyMnXG4gICAgLy8gICBwYXJhbXMgPSBoYXNoLnNwbGl0KCctJyk7IC8vIGhvdyB0byBoYW5kbGUgZnJvbSBzZXJ2ZXIgc2lkZSBjb25maWdcbiAgICAvLyB9XG4gICAgLy8gdGhpcy51cmxQYXJhbXMgPSBwYXJhbXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgc29ja2V0IGNvbm5lY3Rpb24gYW5kIHBlcmZvcm0gaGFuZHNoYWtlIHdpdGggdGhlIHNlcnZlci5cbiAgICogQHRvZG8gLSByZWZhY3RvciBoYW5kc2hha2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdFNvY2tldCgpIHtcbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldC5pbml0aWFsaXplKHRoaXMudHlwZSwgdGhpcy5jb25maWcuc29ja2V0SU8pO1xuICAgIC8vIHNlbmQgYHVybFBhcmFtc2AgdGhyb3VnaHQgaGFuZHNoYWtlIHRvIG5vdCBwb2x1dGUgdGhlIHNvY2tldC5pbyBhcGlcbiAgICAvLyBhbmQgZXZlbnR1YWxseSBiZSBhYmxlIHRvIG1vZGlmeSB0aGUgdHJhbnNwb3J0IHN5c3RlbVxuICAgIHRoaXMuc29ja2V0LnNlbmQoJ2hhbmRzaGFrZScsIHsgdXJsUGFyYW1zOiB0aGlzLnVybFBhcmFtcyB9KTtcbiAgICAvLyB3YWl0IGZvciBoYW5kc2hha2UgdG8gbWFyayBjbGllbnQgYXMgYHJlYWR5YFxuICAgIHRoaXMuc29ja2V0LnJlY2VpdmUoJ2NsaWVudDpzdGFydCcsICh1dWlkKSA9PiB7XG4gICAgICAvLyBkb24ndCBoYW5kbGUgc2VydmVyIHJlc3RhcnQgZm9yIG5vdy5cbiAgICAgIHRoaXMudXVpZCA9IHV1aWQ7XG4gICAgICBzZXJ2aWNlTWFuYWdlci5zdGFydCgpO1xuXG4gICAgICAvLyB0aGlzLmNvbW0ucmVjZWl2ZSgncmVjb25uZWN0JywgKCkgPT4gY29uc29sZS5pbmZvKCdyZWNvbm5lY3QnKSk7XG4gICAgICAvLyB0aGlzLmNvbW0ucmVjZWl2ZSgnZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgIC8vICAgY29uc29sZS5pbmZvKCdkaXNjb25uZWN0JylcbiAgICAgIC8vICAgc2VydmljZU1hbmFnZXIucmVzZXQoKTsgLy8gY2FuIHJlbGF1bmNoIHNlcnZpY2VNYW5hZ2VyIG9uIHJlY29ubmVjdGlvbi5cbiAgICAgIC8vIH0pO1xuICAgICAgLy8gdGhpcy5jb21tLnJlY2VpdmUoJ2Vycm9yJywgKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIpKTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB2aWV3IHRlbXBsYXRlcyBmb3IgYWxsIGFjdGl2aXRpZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdFZpZXdzKCkge1xuICAgIHZpZXdwb3J0LmluaXQoKTtcbiAgICAvLyBpbml0aWFsaXplIHZpZXdzIHdpdGggZGVmYXVsdCB2aWV3IGNvbnRlbnQgYW5kIHRlbXBsYXRlc1xuICAgIHRoaXMudmlld0NvbnRlbnQgPSB7fTtcbiAgICB0aGlzLnZpZXdUZW1wbGF0ZXMgPSB7fTtcblxuICAgIGNvbnN0IGFwcE5hbWUgPSB0aGlzLmNvbmZpZy5hcHBOYW1lIHx8wqBkZWZhdWx0Vmlld0NvbnRlbnQuZ2xvYmFscy5hcHBOYW1lO1xuICAgIGNvbnN0IHZpZXdDb250ZW50ID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0Vmlld0NvbnRlbnQsIHsgZ2xvYmFsczogeyBhcHBOYW1lIH0gfSk7XG5cbiAgICB0aGlzLnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnModmlld0NvbnRlbnQpO1xuICAgIHRoaXMuc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmYXVsdFZpZXdUZW1wbGF0ZXMpO1xuICAgIHRoaXMuc2V0QXBwQ29udGFpbmVyKHRoaXMuY29uZmlnLmFwcENvbnRhaW5lcik7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCBvciBvdmVycmlkZSBhcHBsaWNhdGlvbiB2aWV3IGNvbnRlbnRzIHdpdGggdGhlIGdpdmVuIG9iamVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRlZnMgLSBDb250ZW50IHRvIGJlIHVzZWQgYnkgYWN0aXZpdGllcy5cbiAgICovXG4gIHNldFZpZXdDb250ZW50RGVmaW5pdGlvbnMoZGVmcykge1xuICAgIHRoaXMudmlld0NvbnRlbnQgPSBPYmplY3QuYXNzaWduKHRoaXMudmlld0NvbnRlbnQsIGRlZnMpO1xuICAgIEFjdGl2aXR5LnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnModGhpcy52aWV3Q29udGVudCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCBvciBvdmVycmlkZSBhcHBsaWNhdGlvbiB2aWV3IHRlbXBsYXRlcyB3aXRoIHRoZSBnaXZlbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZzIC0gVGVtcGxhdGVzIHRvIGJlIHVzZWQgYnkgYWN0aXZpdGllcy5cbiAgICovXG4gIHNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZnMpIHtcbiAgICB0aGlzLnZpZXdUZW1wbGF0ZXMgPSBPYmplY3QuYXNzaWduKHRoaXMudmlld1RlbXBsYXRlcywgZGVmcyk7XG4gICAgQWN0aXZpdHkuc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnModGhpcy52aWV3VGVtcGxhdGVzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0IHRoZSBET00gZWxlbW50IHRoYXQgd2lsbCBiZSB0aGUgY29udGFpbmVyIGZvciBhbGwgdmlld3MuXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR9IGVsIC0gRE9NIGVsZW1lbnQgKG9yIGNzcyBzZWxlY3RvciBtYXRjaGluZ1xuICAgKiAgYW4gZXhpc3RpbmcgZWxlbWVudCkgdG8gYmUgdXNlZCBhcyB0aGUgY29udGFpbmVyIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICovXG4gIHNldEFwcENvbnRhaW5lcihlbCkge1xuICAgIGNvbnN0ICRjb250YWluZXIgPSBlbCBpbnN0YW5jZW9mIEVsZW1lbnQgPyBlbCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgIHZpZXdNYW5hZ2VyLnNldFZpZXdDb250YWluZXIoJGNvbnRhaW5lcik7XG4gIH0sXG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsaWVudDtcbiJdfQ==