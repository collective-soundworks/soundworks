import debug from 'debug';
import 'fast-text-encoding';
import root from 'window-or-global';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var encoder = new root.TextEncoder('utf-8');
var decoder = new root.TextDecoder('utf-8');
var types = ['Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'BigInt64Array', 'BigUint64Array']; // @todo - probably some room for optimizations

/** private */

function packBinaryMessage(channel, data) {
  var channelBuffer = encoder.encode(channel);
  var channelSize = channelBuffer.byteLength;
  var startOffset = Math.ceil((channelSize + 3) / data.BYTES_PER_ELEMENT) * data.BYTES_PER_ELEMENT;
  var bufferSize = startOffset + data.byteLength;
  var typeName = data.constructor.name;
  var typeIndex = types.indexOf(typeName);

  if (typeIndex === -1) {
    throw new Error("Invalid TypedArray type: ".concat(typeName));
  }

  var view = new Uint8Array(bufferSize);
  view[0] = channelSize;
  view[1] = typeIndex;
  view[2] = startOffset;
  view.set(channelBuffer, 3, channelSize);
  view.set(new Uint8Array(data.buffer), startOffset, data.byteLength);
  return view.buffer;
}
/** private */

function unpackBinaryMessage(buffer
/* arraybuffer */
) {
  var infos = new Uint8Array(buffer, 0, 3);
  var channelSize = infos[0];
  var typeIndex = infos[1];
  var startOffset = infos[2]; // need to slice as the library recreates a UInt8Array from the whole buffer
  // @todo - see if this could be avoided (probably needs a pull request)

  var channelBuffer = new Uint8Array(buffer.slice(3, 3 + channelSize));
  var channel = decoder.decode(channelBuffer);
  var type = types[typeIndex]; // slice (copy) the underlying ArrayBuffer to create a clean TypedArray

  var data = new root[type](buffer.slice(startOffset));
  return [channel, data];
}
/** private */

function packStringMessage(channel) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return JSON.stringify([channel, args]);
}
/** private */

function unpackStringMessage(data) {
  return JSON.parse(data);
}

var log = debug('soundworks:socket'); // close
//   Fired when a connection with a websocket is closed.
//   Also available via the onclose property
// error
//   Fired when a connection with a websocket has been closed because of an error, such as whensome data couldn't be sent.
//   Also available via the onerror property.
// message
//   Fired when data is received through a websocket.
//   Also available via the onmessage property.
// open
//   Fired when a connection with a websocket is opened.
//   Also available via the onopen property.
// @todo - use isomorphic ws ? (does seems like a perfect idea)

/**
 * Simple wrapper with simple pubsub system built on top of `ws` socket.
 * The abstraction actually open two different socket:
 * - one configured for string (JSON compatible) messages
 * - one configured with `binaryType=arraybuffer` for streaming data more
 *   efficiently.
 * The sockets also re-emits all "native" ws events.
 *
 * @see https://github.com/websockets/ws
 *
 * @memberof module:soundworks/client
 */

var socket = {
  /**
   * WebSocket instance (string protocol - binaryType = 'string').
   */
  ws: null,
  _stringListeners: new Map(),
  _binaryListeners: new Map(),

  /**
   * Initialize a websocket connection with the server
   * @param {String} clientType - `client.type` {@link client}
   * @param {Object} options - Options of the socket
   * @param {Array<String>} options.path - Defines where socket should find the `socket.io` file
   */
  init: function init(clientType, options) {
    var _this = this;

    // unique key that allows to associate the two sockets to the same client.
    // note: the key is only used to pair to two sockets, so its usage is very
    // limited in time therefore a random number should hopefully be sufficient.
    var key = (Math.random() + '').replace(/^0./, '');
    /**
     * Configuration object
     * @type {Object}
     * @name config
     * @instance
     * @memberof module:soundworks/client.socket
     */

    this.config = options; // open web sockets

    var path = this.config.path;
    var protocol = window.location.protocol.replace(/^http?/, 'ws');
    var _window$location = window.location,
        hostname = _window$location.hostname,
        port = _window$location.port;
    var url = "".concat(protocol, "//").concat(hostname, ":").concat(port, "/").concat(path);
    var queryParams = "clientType=".concat(clientType, "&key=").concat(key); // ----------------------------------------------------------
    // init string socket
    // ----------------------------------------------------------

    var stringSocketUrl = "".concat(url, "?binary=0&").concat(queryParams);
    this.ws = new WebSocket(stringSocketUrl);
    log("string socket initialized - url: ".concat(stringSocketUrl));
    var stringSocketPromise = new Promise(function (resolve, reject) {
      _this.ws.addEventListener('open', resolve);
    }); // parse incoming messages for pubsub

    this.ws.addEventListener('message', function (e) {
      var _unpackStringMessage = unpackStringMessage(e.data),
          _unpackStringMessage2 = _slicedToArray(_unpackStringMessage, 2),
          channel = _unpackStringMessage2[0],
          args = _unpackStringMessage2[1];

      _this._emit.apply(_this, [false, channel].concat(_toConsumableArray(args)));
    }); // broadcast all `WebSocket` native events

    ['open', 'close', 'error', 'upgrade', 'message'].forEach(function (eventName) {
      _this.ws.addEventListener(eventName, function (e) {
        _this._emit(false, eventName, e.data);
      });
    }); // ----------------------------------------------------------
    // init binary socket
    // ----------------------------------------------------------

    var binarySocketUrl = "".concat(url, "?binary=1&").concat(queryParams);
    this.binaryWs = new WebSocket(binarySocketUrl);
    this.binaryWs.binaryType = 'arraybuffer';
    log("binary socket initialized - url: ".concat(binarySocketUrl));
    var binarySocketPromise = new Promise(function (resolve, reject) {
      _this.binaryWs.addEventListener('open', resolve);
    }); // parse incoming messages for pubsub

    this.binaryWs.addEventListener('message', function (e) {
      var _unpackBinaryMessage = unpackBinaryMessage(e.data),
          _unpackBinaryMessage2 = _slicedToArray(_unpackBinaryMessage, 2),
          channel = _unpackBinaryMessage2[0],
          data = _unpackBinaryMessage2[1];

      _this._emit(true, channel, data);
    }); // broadcast all `WebSocket` native events

    ['open', 'close', 'error', 'upgrade', 'message'].forEach(function (eventName) {
      _this.binaryWs.addEventListener(eventName, function (e) {
        _this._emit(true, eventName, e.data);
      });
    }); // wait for both socket to be opened

    return Promise.all([stringSocketPromise, binarySocketPromise]);
  },

  /** @private */
  _emit: function _emit(binary, channel) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var listeners = binary ? this._binaryListeners : this._stringListeners;

    if (listeners.has(channel)) {
      var callbacks = listeners.get(channel);
      callbacks.forEach(function (callback) {
        return callback.apply(void 0, args);
      });
    }
  },

  /** @private */
  _addListener: function _addListener(listeners, channel, callback) {
    if (!listeners.has(channel)) {
      listeners.set(channel, new Set());
    }

    var callbacks = listeners.get(channel);
    callbacks.add(callback);
  },

  /** @private */
  _removeListener: function _removeListener(listeners, channel, callback) {
    if (listeners.has(channel)) {
      var callbacks = listeners.get(channel);
      callbacks["delete"](callback);

      if (callbacks.size === 0) {
        listeners["delete"](channel);
      }
    }
  },

  /** @private */
  _removeAllListeners: function _removeAllListeners(listeners, channel) {
    if (listeners.has(channel)) {
      listeners["delete"](channel);
    }
  },

  /**
   * Send JSON compatible messages on a given channel
   *
   * @param {String} channel - The channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type)
   */
  send: function send(channel) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var msg = packStringMessage.apply(void 0, [channel].concat(args));
    this.ws.send(msg);
  },

  /**
   * Listen JSON compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to execute when a message is received
   */
  addListener: function addListener(channel, callback) {
    this._addListener(this._stringListeners, channel, callback);
  },

  /**
   * Remove a listener from JSON compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to remove
   */
  removeListener: function removeListener(channel, callback) {
    this._removeListener(this._stringListeners, channel, callback);
  },

  /**
   * Remove all listeners from JSON compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   */
  removeAllListeners: function removeAllListeners(channel) {
    this._removeAllListeners(this._stringListeners, channel);
  },

  /**
   * Send binary messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {TypedArray} typedArray - Data to send
   */
  sendBinary: function sendBinary(channel, typedArray) {
    var msg = packBinaryMessage(channel, typedArray);
    this.binaryWs.send(msg);
  },

  /**
   * Listen binary messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to execute when a message is received
   */
  addBinaryListener: function addBinaryListener(channel, callback) {
    this._addListener(this._binaryListeners, channel, callback);
  },

  /**
   * Remove a listener from binary compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to cancel
   */
  removeBinaryListener: function removeBinaryListener(channel, callback) {
    this._removeListener(this._binaryListeners, channel, callback);
  },

  /**
   * Remove all listeners from binary compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   */
  removeAllBinaryListeners: function removeAllBinaryListeners(channel) {
    this._removeAllListeners(this._binaryListeners, channel);
  }
};

// import serviceManager from './serviceManager';
// import viewport from '../views/viewport';

/**
 * Client side entry point for a `soundworks` application.
 *
 * This object hosts general informations about the user, as well as methods
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
   * The type of the client, this can generally be considered as the role of the
   * client in the application. This value is defined in the
   * [`client.init`]{@link module:soundworks/server.server~serverConfig} object
   * and defaults to `'player'`.
   *
   * @type {String}
   */
  type: null,

  /**
   * Unique session id of the client (number), generated and retrieved by the server.
   *
   * @type {Number}
   */
  id: null,

  /**
   * Unique session id of the client (uuidv4), generated and retrieved by the server.
   *
   * @type {String}
   */
  uuid: null,

  /**
   * Socket object that handle communications with the server, if any.
   * This object is automatically created if the experience requires any service
   * having a server-side counterpart.
   *
   * @type {module:soundworks/client.socket}
   * @private
   */
  socket: socket,

  /**
   * @note - remove all that, should be directly related to the services
   * @example
   * // client side
   * const index = this.checkin.getIndex();
   * // server side
   * const index = this.checkin.getIndex(client);
   *
   * // for plaform
   * const isCcompatible = this.platform.isCompatible
   */

  /**
   * Configuration informations from the server configuration if any.
   *
   * @type {Object}
   * @see {@link module:soundworks/client.client~init}
   * @see {@link module:soundworks/client.SharedConfig}
   */
  // config: {},

  /**
   * Array of optionnal parameters passed through the url
   *
   * @type {Array}
   */
  // urlParams: null,

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
   * @property {String} interaction - Type of interaction allowed by the
   *  viewport, `touch` or `mouse`
   *
   * @see {@link module:soundworks/client.Platform}
   */
  platform: {
    os: null,
    isMobile: null,
    audioFileExt: '',
    interaction: null
  },

  /**
   * Defines whether the user's device is compatible with the application
   * requirements.
   *
   * @type {Boolean}
   * @see {@link module:soundworks/client.Platform}
   */
  compatible: null
  /**
   * Index (if any) given by a [`placer`]{@link module:soundworks/client.Placer}
   * or [`checkin`]{@link module:soundworks/client.Checkin} service.
   *
   * @type {Number}
   * @see {@link module:soundworks/client.Checkin}
   * @see {@link module:soundworks/client.Placer}
   */
  // index: null,

  /**
   * Ticket label (if any) given by a [`placer`]{@link module:soundworks/client.Placer}
   * or [`checkin`]{@link module:soundworks/client.Checkin} service.
   *
   * @type {String}
   * @see {@link module:soundworks/client.Checkin}
   * @see {@link module:soundworks/client.Placer}
   */
  // label: null,

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
   * @see {@link module:soundworks/client.Geolocation}
   */
  // coordinates: null,

  /**
   * Full `geoposition` object as returned by `navigator.geolocation`, when
   * using the `geolocation` service.
   *
   * @type {Object}
   * @see {@link module:soundworks/client.Geolocation}
   */
  // geoposition: null,

  /**
   * Initialize the application.
   *
   * @param {String} [clientType='player'] - The type of the client, defines the
   *  socket connection namespace. Should match a client type defined server side.
   * @param {Object} [config={}]
   * @param {Object} [config.appContainer='#container'] - A css selector
   *  matching a DOM element where the views should be inserted.
   * @param {Object} [config.websockets.url=''] - The url where the socket should
   *  connect _(unstable)_.
   * @param {Object} [config.websockets.transports=['websocket']] - The transport
   *  used to create the url (overrides default socket.io mecanism) _(unstable)_.
   */
  // init(clientType = 'player', config = {}) {
  // },

  /**
   * Register a function to be executed when a service is instanciated.
   *
   * @param {serviceManager~serviceInstanciationHook} func - Function to
   *  register has a hook to be execute when a service is created.
   */

  /**
   * @callback serviceManager~serviceInstanciationHook
   * @param {String} id - id of the instanciated service.
   * @param {Service} instance - instance of the service.
   */
  // setServiceInstanciationHook(func) {
  //   serviceManager.setServiceInstanciationHook(func);
  // },

  /**
   * Start the application.
   */
  // async start() {
  //   try {
  //     await this._initSocket();
  //     serviceManager.start();
  //   } catch(err) {
  //     console.error(err);
  //   }
  // },
  // *
  //  * Returns a service configured with the given options.
  //  * @param {String} id - Identifier of the service.
  //  * @param {Object} options - Options to configure the service.
  // require(id, options) {
  //   return serviceManager.require(id, options);
  // },

};

/**
 *
 *
 */
var Signal =
/*#__PURE__*/
function () {
  function Signal() {
    _classCallCheck(this, Signal);

    this._state = false;
    this._observers = new Set();
  }

  _createClass(Signal, [{
    key: "set",
    value: function set(value) {
      if (value !== this._state) {
        this._state = value;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this._observers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var observer = _step.value;
            observer(value);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }
  }, {
    key: "get",
    value: function get() {
      return this._state;
    }
  }, {
    key: "addObserver",
    value: function addObserver(observer) {
      this._observers.add(observer);
    }
  }, {
    key: "removeObserver",
    value: function removeObserver(observer) {
      this._observers["delete"](observer);
    }
  }]);

  return Signal;
}();

/**
 * Compound signal that is `true` when all signals it depends on are `true`.
 * Dependencies are added through the `add` method.
 * @private
 */

var SignalAll =
/*#__PURE__*/
function (_Signal) {
  _inherits(SignalAll, _Signal);

  function SignalAll() {
    var _this;

    _classCallCheck(this, SignalAll);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SignalAll).call(this));
    _this._dependencies = new Set();
    return _this;
  }

  _createClass(SignalAll, [{
    key: "add",
    value: function add(signal) {
      var _this2 = this;

      this._dependencies.add(signal);

      signal.addObserver(function () {
        var value = true;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _this2._dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _signal = _step.value;
            value = value && _signal.get();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        _get(_getPrototypeOf(SignalAll.prototype), "set", _this2).call(_this2, value);
      });
    }
  }, {
    key: "set",
    value: function set(value) {
      /* noop */
    }
  }, {
    key: "length",
    get: function get() {
      return this._dependencies.size;
    }
  }]);

  return SignalAll;
}(Signal);

var log$1 = debug('soundworks:serviceManager');
/**
 * Factory and initialisation manager for the services.
 * Lazy instanciate an instance of the given type and retrieve it on each call.
 */

var serviceManager = {
  /** @private */
  _serviceInstanciationHook: null,

  /** @private */
  _instances: {},

  /** @private */
  _ctors: {},

  /** @private */
  _observers: new Set(),

  /** @ */
  servicesStatus: {},

  /**
   * Initialize the manager.
   * @private
   */
  init: function init() {
    var _this = this;

    log$1('init');
    this._requiredReadySignals = new SignalAll();

    this._requiredReadySignals.addObserver(function () {
      return _this._ready();
    });

    this.signals = {};
    this.signals.start = new Signal();
    this.signals.ready = new Signal();
    this.ready = new Promise(function (resolve, reject) {
      _this._resolveReadyPromise = resolve;
    });
  },

  /**
   * Sends the signal required by all services to start.
   * @private
   */
  start: function start() {
    this.signals.start.set(true);

    if (!this._requiredReadySignals.length) {
      this._resolveReadyPromise();
    }

    return this.ready;
  },

  /**
   * Mark the services as ready. This signal is observed by {@link Experience}
   * instances and trigger their `start`.
   * @private
   */
  _ready: function _ready() {
    console.log('serviceManager:ready');

    this._resolveReadyPromise();

    this.signals.ready.set(true);
  },

  /**
   * Returns an instance of a service with options to be applied to its constructor.
   * @param {String} id - The id of the service.
   * @param {Object} options - Options to pass to the service constructor.
   */
  require: function require(id) {
    var _this2 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!this._ctors[id]) {
      throw new Error("Service \"".concat(id, "\" is not defined"));
    }

    if (!this._instances[id]) {
      // throw an error if manager already started
      if (this.signals.start.get() === true) {
        throw new Error("Service \"".concat(id, "\" required after serviceManager start"));
      }

      var _instance = new this._ctors[id](); // add the instance ready signal as required for the manager


      this._requiredReadySignals.add(_instance.signals.ready); // handle service statuses for views


      this.servicesStatus[id] = 'idle';

      var onServiceStart = function onServiceStart() {
        _this2.servicesStatus[id] = 'started';

        _this2._emitChange();
      };

      var onServiceReady = function onServiceReady() {
        _this2.servicesStatus[id] = 'ready';

        _this2._emitChange();

        _instance.signals.start.removeObserver(onServiceStart);

        _instance.signals.ready.removeObserver(onServiceReady);
      };

      _instance.signals.start.addObserver(onServiceStart);

      _instance.signals.ready.addObserver(onServiceReady); // trigger updates for params update too


      _instance.params.addListener(function () {
        _this2._emitChange();
      }); // store instance


      this._instances[id] = _instance;
    }

    var instance = this._instances[id];
    instance.configure(options);
    return instance;
  },

  /**
   * Register a service with a given id.
   * @param {String} id - The id of the service.
   * @param {Function} ctor - The constructor of the service.
   */
  register: function register(id, ctor) {
    this._ctors[id] = ctor;
  },
  get: function get(id) {
    if (this._instances[id]) {
      return this._instances[id];
    } else {
      throw new Error("Cannot get service ".concat(id, ", does not exists"));
    }
  },
  // @note - mimic state Manager API so we can change this later
  _emitChange: function _emitChange() {
    this._observers.forEach(function (observer) {
      return observer();
    });
  },
  observe: function observe(observer) {
    var _this3 = this;

    this._observers.add(observer);

    return function () {
      _this3._observers["delete"](observer);
    };
  },
  getValues: function getValues() {
    return Object.assign({}, this.servicesStatus);
  }
};

/**
 * Internal base class for services and scenes. Basically a process with view
 * and network abilities.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Process
 */

var Activity =
/*#__PURE__*/
function () {
  /**
   * @param {String} id - Id of the activity.
   */
  function Activity(id) {
    _classCallCheck(this, Activity);

    if (id === undefined) {
      throw new Error("Undefined id for activty ".concat(this.constructor.name));
    }
    /**
     * Name of the process.
     * @name id
     * @type {String}
     * @instanceof Process
     */


    this.id = id;
    /**
     * Options of the activity.
     * @type {Object}
     * @name options
     * @instance
     * @memberof module:soundworks/client.Activity
     */

    this.options = {};
    /**
     * Signals defining the process state.
     * @name signal
     * @type {Object}
     * @instanceof Process
     */

    this.signals = {};
    this.signals.start = new Signal();
    /**
     * List of signals that must be set to `true` before the Activity can start.
     * @private
     */

    this.requiredStartSignals = new SignalAll();
  }
  /**
   * Configure the activity with the given options.
   * @param {Object} options
   */


  _createClass(Activity, [{
    key: "configure",
    value: function configure(options) {
      Object.assign(this.options, options);
    }
  }, {
    key: "start",
    value: function start() {
      this.signals.start.set(true);
    }
  }]);

  return Activity;
}();

/**
 * Base class to be extended in order to create the client-side of a custom
 * experience.
 *
 * The user defined `Experience` is the main component of a soundworks application.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Activity
 */

var Experience =
/*#__PURE__*/
function (_Activity) {
  _inherits(Experience, _Activity);

  function Experience() {
    _classCallCheck(this, Experience);

    return _possibleConstructorReturn(this, _getPrototypeOf(Experience).call(this, 'experience'));
  }
  /**
   * Start the experience. This lifecycle method is called when all the
   * required services are `ready` and thus the experience can begin with all
   * the necessary informations and services ready to be consumed.
   */


  _createClass(Experience, [{
    key: "start",
    value: function start() {
      _get(_getPrototypeOf(Experience.prototype), "start", this).call(this);

      client.socket.send('s:exp:enter'); // this.client.socket.send('enter');
    }
  }]);

  return Experience;
}(Activity);

var log$2 = debug('soundworks:services');
/**
 * Base class to be extended in order to create a new service.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Activity
 */

var Service =
/*#__PURE__*/
function (_Activity) {
  _inherits(Service, _Activity);

  /**
   * @param {String} id - The id of the service (should be prefixed with `'service:'`).
   */
  function Service(id) {
    var _this;

    _classCallCheck(this, Service);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Service).call(this, id));

    _this.requiredStartSignals.addObserver(function (value) {
      return _this.start();
    });

    _this.requiredStartSignals.add(serviceManager.signals.start);
    /**
     * Is set to `true` when a signal is ready to be consumed.
     * @type {Signal}
     */


    _this.signals.ready = new Signal(); // // add the serviceManager bootstart signal to the required signals
    // this.waitFor();

    _this.ready = _this.ready.bind(_assertThisInitialized(_this));
    return _this;
  }
  /**
   * Allow to require another service as a dependencies. When a service is
   * dependent from another service its `start` method is delayed until all
   * its dependencies are themselves `ready`.
   * @param {String} id - id of the service to require.
   * @param {Object} options - configuration object to be passed to the service.
   */
  // require(id, options) {
  //   const service = serviceManager.require(id, options);
  //   const signal = service.signals.ready;
  //   if (signal)
  //     this.waitFor(signal);
  //   else
  //     throw new Error(`signal "ready" doesn't exist on service :`, service);
  //   return service;
  // }

  /**
   * Method to call in the service lifecycle when it should be considered as
   * `ready` and thus allows all its dependent activities to start themselves.
   */


  _createClass(Service, [{
    key: "ready",
    value: function ready() {
      log$2("\"".concat(this.id, "\" ready")); // this.stop();

      this.signals.ready.set(true);
    }
    /** @inheritdoc */

  }, {
    key: "start",
    value: function start() {
      log$2("\"".concat(this.id, "\" started"));

      _get(_getPrototypeOf(Service.prototype), "start", this).call(this);
    }
    /** @inheritdoc */
    // stop() {
    //   log(`"${this.id}" stopped`);
    //   super.stop();
    // }

  }]);

  return Service;
}(Activity);

/**
 * client-side part of *soundworks*
 *
 * @module @soundworks/core/client
 *
 * @example
 * import soundworks from '@soundworks/core/client';
 */

var soundworks = {
  // expose base classes for service plugins and application code
  Experience: Experience,
  Service: Service,
  // soundworks instance
  // @todo - allow multiple instances (for client-side and thus for consistency)
  config: {},
  client: client,
  serviceManager: serviceManager,
  // stateManager,
  init: function () {
    var _init = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(config) {
      var websockets;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if ('clientType' in config) {
                _context.next = 2;
                break;
              }

              throw new Error('soundworks.init config object "must" define a `clientType`');

            case 2:
              // init sockets
              this.client.type = config.clientType; // @todo - review that to adapt to ws options

              websockets = Object.assign({
                url: '',
                path: 'socket' // pingInterval: 5 * 1000,

              }, config.websockets); // mix all other config and override with defined socket config

              this.config = Object.assign({}, config, {
                websockets: websockets
              });
              this.serviceManager.init();
              _context.next = 8;
              return this.client.socket.init(this.client.type, this.config.websockets);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function init(_x) {
      return _init.apply(this, arguments);
    }

    return init;
  }(),
  start: function () {
    var _start = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var _this = this;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this._ready = new Promise(function (resolve, reject) {
                var payload = {};

                if (_this.config.env !== 'production') {
                  Object.assign(payload, {
                    requiredServices: Object.keys(_this.serviceManager.getValues())
                  });
                } // wait for handshake response to mark client as `ready`


                _this.client.socket.addListener('s:client:start', function (_ref) {
                  var id = _ref.id,
                      uuid = _ref.uuid;
                  _this.client.id = id;
                  _this.client.uuid = uuid; // everything is ready start service manager

                  _this.serviceManager.start().then(function () {
                    return resolve();
                  });
                });

                _this.client.socket.addListener('s:client:error', function (err) {
                  switch (err.type) {
                    case 'services':
                      // can only append if env !== 'production'
                      var msg = "\"".concat(err.data.join(', '), "\" required client-side but not server-side");
                      throw new Error(msg);
                      break;
                  }

                  reject();
                });

                _this.client.socket.send('s:client:handshake', payload);
              });
              return _context2.abrupt("return", this._ready);

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function start() {
      return _start.apply(this, arguments);
    }

    return start;
  }(),
  registerService: function registerService(serviceFactory) {
    var ctor = serviceFactory(this);
    this.serviceManager.register(serviceFactory.id, ctor);
  }
};

export default soundworks;
