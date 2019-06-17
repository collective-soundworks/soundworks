'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var http = _interopDefault(require('http'));
var https = _interopDefault(require('https'));
var pem = _interopDefault(require('pem'));
var os = _interopDefault(require('os'));
var chalk = _interopDefault(require('chalk'));
var ejs = _interopDefault(require('ejs'));
var polka = _interopDefault(require('polka'));
var _serveStatic = _interopDefault(require('serve-static'));
var columnify = _interopDefault(require('columnify'));
var compression = _interopDefault(require('compression'));
var uuid = _interopDefault(require('uuidv4'));
var WebSocket = _interopDefault(require('ws'));
var querystring = _interopDefault(require('querystring'));
require('fast-text-encoding');
var root = _interopDefault(require('window-or-global'));

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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
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

var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(idGenerator);

function idGenerator() {
  var i;
  return regeneratorRuntime.wrap(function idGenerator$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          i = 0;

        case 1:

          _context.next = 4;
          return i;

        case 4:
          i++;
          _context.next = 1;
          break;

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

var generateId = idGenerator();
/**
 * Server side representation of a client.
 *
 * @memberof module:soundworks/server
 */

var Client =
/*#__PURE__*/
function () {
  /**
   * @param {String} clientType - Client type of the connected client.
   * @param {Socket} socket - Socket object used to comminuate with the client.
   * @private
   */
  function Client(clientType, socket) {
    _classCallCheck(this, Client);

    /**
     * Client type (specified when initializing the {@link client} object on the client side with {@link client.init}).
     * @name type
       * @type {String}
       * @memberof module:soundworks/server.Client
       * @instance
     */
    this.type = clientType;
    /**
     * Unique session id (ever increasing number)
     * @name id
     * @type {Number}
     * @memberof module:soundworks/server.Client
     * @instance
     */

    this.id = generateId.next().value;
    /**
     * Unique session id (uuidv4).
     * @name uuid
       * @type {String}
       * @memberof module:soundworks/server.Client
       * @instance
     */

    this.uuid = uuid();
    /**
     * @note - remove all that, should be directly related to the services
     * @example
     * // client side
     * const index = this.checkin.getIndex();
     * // server side
     * const index = this.checkin.getIndex(client);
     */

    /**
     * Coordinates of the client, stored as an `[x:Number, y:Number]` array.
     * @name coordinates
       * @type {Array<Number>}
       * @memberof module:soundworks/server.Client
       * @instance
     */

    this.coordinates = null;
    /**
     * Geoposition of the client as returned by `geolocation.getCurrentPosition`
     * @name geoposition
     * @typ {Object}
     * @memberof module:soundworks/server.Client
     * @instance
     */

    this.geoposition = null;
    /**
     * Ticket index of the client.
     * @name index
     * @type {Number}
     * @memberof module:soundworks/server.Client
     * @instance
     */

    this.index = null;
    /**
     * Ticket label of the client.
     * @name label
     * @type {Number}
     * @memberof module:soundworks/server.Client
     * @instance
     */

    this.label = null; // /**
    //  * Used by the activities to associate data to a particular client.
    //  *
    //  * All the data associated with a activity whose `name` is `'activityName'`
    //    * is accessible through the key `activityName`.
    //  * For instance, the {@link src/server/Checkin.js~Checkin} activity keeps
    //    * track of client's checkin index and label in `this.activities.checkin.index`
    //    * and `this.activities.checkin.label`.
    //  * Similarly, a {@link src/server/Performance.js~Performance} activity whose
    //    * name is `'myPerformance'` could report the client's status in
    //    * `this.activities.myPerformance.status`.
    //  *
    //    * @name activities
    //    * @type {Object}
    //    * @memberof module:soundworks/server.Client
    //    * @instance
    //  */
    //   this.activities = {};

    /**
     * Socket used to communicate with the client.
     * @type {Socket}
     * @private
     */

    this.socket = socket;
  }
  /**
   * Returns a lightweight version of the data defining the client.
   * @returns {Object}
   */
  // serialize() {
  //   return {
  //     type: this.type,
  //     uuid: this.uuid,
  //     coordinates: this.coordinates,
  //     index: this.index,
  //     label: this.label,
  //     activities: this.activities,
  //   };
  // }

  /**
   * Destroy the client.
   */


  _createClass(Client, [{
    key: "destroy",
    value: function destroy() {
      this.uuid = null;
      this.id = null;
    }
  }]);

  return Client;
}();

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

var _ctors = {};
var _instances = {};
/**
 * Manager the services and their relations. Acts as a factory to ensure services
 * are instanciated only once.
 */

var serviceManager = {
  /** @private */
  _servicesOptions: {},

  /** @private */
  init: function init() {
    var _this = this;

    this.signals = {};
    this.signals.start = new Signal();
    this.signals.ready = new Signal();
    this._requiredReadySignals = new SignalAll();

    this._requiredReadySignals.addObserver(function () {
      _this.signals.ready.set(true);
    });

    this.ready = new Promise(function (resolve, reject) {
      _this._resolveReadyPromise = resolve;
    });
  },

  /** @private */
  start: function start() {
    var _this2 = this;

    console.log(chalk.yellow("+ required services"));
    console.log(this.getRequiredServices().sort().map(function (s) {
      return "    ".concat(s, " ").concat(chalk.yellow(' starting...'));
    }).join('\n'));
    this.signals.ready.addObserver(function () {
      _this2._resolveReadyPromise();
    });
    this.signals.start.set(true);

    if (this._requiredReadySignals.length === 0) {
      this.signals.ready.set(true);
    }

    return this.ready;
  },

  /**
   * Retrieve a service according to the given id. If the service as not beeen
   * requested yet, it is instanciated.
   * @param {String} id - The id of the registered service
   * @param {Object} options - The options to configure the service. If an
   *  option for the required service has been given using `serviceManager.configure()`
   *  the present object takes precedence.
   */
  require: function require(id) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var ctorId = "service:".concat(id);

    if (!_ctors[ctorId]) {
      throw new Error("Service \"".concat(ctorId, "\" is not defined"));
    }

    var instance = _instances[ctorId];

    if (!instance) {
      instance = new _ctors[ctorId]();
      _instances[ctorId] = instance;

      this._requiredReadySignals.add(instance.signals.ready); // log service readiness


      instance.signals.ready.addObserver(function (state) {
        console.log("    ".concat(ctorId, " ").concat(chalk.green(' ready')));
      });
    } // @todo - let's assume configuration could be passed after 1rst
    //   instanciation, try to review t make it cleaner


    var config = this._servicesOptions[id] || {};
    Object.assign(config, options);
    instance.configure(config);
    return instance;
  },

  /**
   * Configure all required service at once.
   * @param {Object} servicesOptions - Object containing configuration options
   *  for multiple services. The keys must correspond to the `id` of an required
   *  service, values are the corresponding config objects.
   *
   * @example
   * serviceManager.configure({
   *   auth: {
   *     password: '123456'
   *   },
   *   checkin: {
   *     // ...
   *   },
   * });
   */
  configure: function configure(servicesOptions) {
    this._servicesOptions = Object.assign(this._servicesOptions, servicesOptions);
  },

  /**
   * Regiter a new service
   *
   * @param {String} id - The id of the service, in order to retrieve it later.
   * @param {Function} ctor - The constructor of the service.
   */
  register: function register(id, ctor) {
    _ctors[id] = ctor;
  },

  /** @private */
  getRequiredServices: function getRequiredServices() {
    var clientType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var services = [];

    for (var id in _instances) {
      if (clientType !== null) {
        if (_instances[id].clientTypes.has(clientType)) {
          services.push(id);
        }
      } else {
        services.push(id);
      }
    }

    return services;
  },

  /** @private */
  getServiceList: function getServiceList() {
    return Object.keys(_ctors);
  }
};

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

var noop = function noop() {};
/**
 * Simple wrapper with simple pubsub system built on top of `ws` socket.
 * The abstraction actually contains two different socket:
 * - one configured for string (JSON compatible) messages
 * - one configured with `binaryType=arraybuffer` for streaming data more
 *   efficiently.
 * The socket re-emits all "native" ws events.
 *
 * @see https://github.com/websockets/ws
 *
 * @memberof module:soundworks/server
 */

var Socket =
/*#__PURE__*/
function () {
  /** @private */
  function Socket(ws, binaryWs, rooms, sockets) {
    var _this = this;

    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    _classCallCheck(this, Socket);

    /**
     * Reference to the sockets object, is mainly dedicated to allow
     * broadcasting from a given socket instance.
     * @type {module:soundworks/server.sockets}
     * @name sockets
     * @instance
     * @memberof module:soundworks/server.Socket
     * @example
     * socket.sockets.broadcast('my-room', this, 'update-value', 1);
     */
    this.sockets = sockets;
    /**
     * `ws` socket instance configured with `binaryType=blob` (string)
     * @private
     * @type {Object}
     * @name _ws
     * @instance
     * @memberof module:soundworks/server.Socket
     */

    this.ws = ws;
    /**
     * `ws` socket instance configured with `binaryType=arraybuffer` (TypedArray)
     * @private
     * @type {Object}
     * @name _binaryWs
     * @instance
     * @memberof module:soundworks/server.Socket
     */

    this.binaryWs = binaryWs;
    /**
     * `ws` socket instance configured with `binaryType=arraybuffer` (TypedArray)
     * @private
     * @type {Map}
     * @name _rooms
     * @instance
     * @memberof module:soundworks/server.Socket
     */

    this.rooms = rooms;
    /**
     * Configuration object
     * @type {Object}
     * @name _config
     * @instance
     * @memberof module:soundworks/server.Socket
     */

    this.config = _objectSpread({
      pingInterval: 5 * 1000
    }, options);
    this._stringListeners = new Map();
    this._binaryListeners = new Map(); // ----------------------------------------------------------
    // init string socket
    // ----------------------------------------------------------

    this.ws.addEventListener('message', function (e) {
      var _unpackStringMessage = unpackStringMessage(e.data),
          _unpackStringMessage2 = _slicedToArray(_unpackStringMessage, 2),
          channel = _unpackStringMessage2[0],
          args = _unpackStringMessage2[1];

      _this._emit.apply(_this, [false, channel].concat(_toConsumableArray(args)));
    }); // broadcast all `ws` "native" events

    ['close', 'error', 'message', 'open', 'ping', 'pong', 'unexpected-response', 'upgrade'].forEach(function (eventName) {
      _this.ws.addEventListener(eventName, function (e) {
        _this._emit(false, eventName, e.data);
      });
    }); // ----------------------------------------------------------
    // init binary socket
    // ----------------------------------------------------------

    this.binaryWs.addEventListener('message', function (e) {
      var _unpackBinaryMessage = unpackBinaryMessage(e.data),
          _unpackBinaryMessage2 = _slicedToArray(_unpackBinaryMessage, 2),
          channel = _unpackBinaryMessage2[0],
          data = _unpackBinaryMessage2[1];

      _this._emit(true, channel, data);
    }); // broadcast all `ws` "native" events

    ['close', 'error', 'message', 'open', 'ping', 'pong', 'unexpected-response', 'upgrade'].forEach(function (eventName) {
      _this.binaryWs.addEventListener(eventName, function (e) {
        _this._emit(true, eventName, e.data);
      });
    }); // heartbeat system (run only on string socket), adapted from:
    // https://github.com/websockets/ws#how-to-detect-and-close-broken-connections

    this._isAlive = true; // heartbeat system, only on "regular" socket

    this.ws.on('pong', function () {
      _this._isAlive = true;
    });
    this._intervalId = setInterval(function () {
      if (_this._isAlive === false) {
        // emit a 'close' event to go trough all the disconnection pipeline
        _this._emit(false, 'close');

        return; // return this.ws.terminate();
      }

      _this._isAlive = false;

      _this.ws.ping(noop);
    }, this.config.pingInterval);
    this.ws.addListener('error', function (err) {// console.log(this.clientId, err);
    });
  }
  /**
   * @private
   * Called when the string socket closes (aka client reload).
   */


  _createClass(Socket, [{
    key: "terminate",
    value: function terminate() {
      clearInterval(this._intervalId); // clean rooms

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.rooms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              key = _step$value[0],
              room = _step$value[1];

          room["delete"](this);
        } // clear references to sockets and rooms

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

      this.sockets = null;
      this.rooms = null; // clear all listeners

      this._stringListeners.clear();

      this._binaryListeners.clear(); // clear "native" listeners


      [this.binaryWs, this.ws].forEach(function (socket) {
        ['close', 'error', 'message', 'open', 'ping', 'pong', 'unexpected-response', 'upgrade'].forEach(function (eventName) {
          socket.removeAllListeners(eventName);
        });
      }); // clear binarySocket as this is called from the string one.

      this.binaryWs.terminate();
      this.ws.terminate();
    }
    /** @private */

  }, {
    key: "_emit",
    value: function _emit(binary, channel) {
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
    }
    /** @private */

  }, {
    key: "_addListener",
    value: function _addListener(listeners, channel, callback) {
      if (!listeners.has(channel)) {
        listeners.set(channel, new Set());
      }

      var callbacks = listeners.get(channel);
      callbacks.add(callback);
    }
    /** @private */

  }, {
    key: "_removeListener",
    value: function _removeListener(listeners, channel, callback) {
      if (listeners.has(channel)) {
        var callbacks = listeners.get(channel);
        callbacks["delete"](callback);

        if (callbacks.size === 0) {
          listeners["delete"](channel);
        }
      }
    }
    /** @private */

  }, {
    key: "_removeAllListeners",
    value: function _removeAllListeners(listeners, channel) {
      if (listeners.has(channel)) {
        listeners["delete"](channel);
      }
    }
    /**
     * Add the socket to a room
     * @param {String} roomId - Id of the room
     */

  }, {
    key: "addToRoom",
    value: function addToRoom(roomId) {
      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, new Set());
      }

      var room = this.rooms.get(roomId);
      room.add(this);
    }
    /**
     * Remove the socket from a room
     * @param {String} roomId - Id of the room
     */

  }, {
    key: "removeFromRoom",
    value: function removeFromRoom(roomId) {
      if (this.rooms.has(roomId)) {
        var room = this.rooms.get(roomId);
        room["delete"](this);
      }
    }
    /**
     * Sends JSON compatible messages on a given channel
     *
     * @param {String} channel - The channel of the message
     * @param {...*} args - Arguments of the message (as many as needed, of any type)
     */

  }, {
    key: "send",
    value: function send(channel) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var msg = packStringMessage.apply(void 0, [channel].concat(args));
      this.ws.send(msg, function (err) {
        if (err) {
          console.error('error sending msg:', channel, args, err);
        }
      });
    }
    /**
     * Listen JSON compatible messages on a given channel
     *
     * @param {String} channel - Channel of the message
     * @param {...*} callback - Callback to execute when a message is received
     */

  }, {
    key: "addListener",
    value: function addListener(channel, callback) {
      this._addListener(this._stringListeners, channel, callback);
    }
    /**
     * Remove a listener from JSON compatible messages on a given channel
     *
     * @param {String} channel - Channel of the message
     * @param {...*} callback - Callback to cancel
     */

  }, {
    key: "removeListener",
    value: function removeListener(channel, callback) {
      this._removeListener(this._stringListeners, channel, callback);
    }
    /**
     * Remove all listeners from JSON compatible messages on a given channel
     *
     * @param {String} channel - Channel of the message
     */

  }, {
    key: "removeAllListeners",
    value: function removeAllListeners(channel) {
      this._removeAllListeners(this._stringListeners, channel);
    }
    /**
     * Sends binary messages on a given channel
     *
     * @param {String} channel - Channel of the message
     * @param {TypedArray} typedArray - Data to send
     */

  }, {
    key: "sendBinary",
    value: function sendBinary(channel, typedArray) {
      var msg = packBinaryMessage(channel, typedArray);
      this.binaryWs.send(msg, function (err) {
        if (err) {
          console.error('error sending msg:', channel, typedArray);
        }
      });
    }
    /**
     * Listen binary messages on a given channel
     *
     * @param {String} channel - Channel of the message
     * @param {...*} callback - Callback to execute when a message is received
     */

  }, {
    key: "addBinaryListener",
    value: function addBinaryListener(channel, callback) {
      this._addListener(this._binaryListeners, channel, callback);
    }
    /**
     * Remove a listener from binary compatible messages on a given channel
     *
     * @param {String} channel - Channel of the message
     * @param {...*} callback - Callback to cancel
     */

  }, {
    key: "removeBinaryListener",
    value: function removeBinaryListener(channel, callback) {
      this._removeListener(this._binaryListeners, channel, callback);
    }
    /**
     * Remove all listeners from binary compatible messages on a given channel
     *
     * @param {String} channel - Channel of the message
     */

  }, {
    key: "removeAllBinaryListeners",
    value: function removeAllBinaryListeners(channel) {
      this._removeAllListeners(this._binaryListeners, channel);
    }
  }]);

  return Socket;
}();

/** @private */

var initializationCache = new Map();
/**
 * Internal base class for services and scenes.
 *
 * @todo - remove all `send`, `addListener`, `removeListener` methods,
 *         use `client.socket` instead.
 *
 * will be more simple to document.
 *
 * @memberof module:soundworks/server
 */

var sockets = {
  /**
   * Store sockets per room. The romm `'*'` store all current connections.
   * @private
   */
  _rooms: new Map(),

  /**
   * Initialize sockets, all sockets are added by default added to two rooms:
   * - to the room corresponding to the client `clientType`
   * - to the '*' that holds all connected sockets
   *
   * @private
   */
  start: function start(httpServer, config, onConnectionCallback) {
    var _this = this;

    var path = 'socket'; // should remove origin
    // init global room

    this._rooms.set('*', new Set());

    this.wss = new WebSocket.Server({
      server: httpServer,
      path: "/".concat(path) // @note - update according to existing config files (aka cosima-apps)

    });
    this.wss.on('connection', function (ws, req) {
      var queryString = querystring.decode(req.url.split('?')[1]);
      var clientType = queryString.clientType,
          key = queryString.key;
      var binary = !!parseInt(queryString.binary);

      if (binary) {
        ws.binaryType = 'arraybuffer';
      }

      if (!initializationCache.has(key)) {
        initializationCache.set(key, {
          ws: ws,
          binary: binary
        });
      } else {
        var cached = initializationCache.get(key);
        initializationCache["delete"](key); // should be in order, but just to be sure

        var stringWs = cached.binary ? ws : cached.ws;
        var binaryWs = cached.binary ? cached.ws : ws;
        var socket = new Socket(stringWs, binaryWs, _this._rooms, _this, config);
        socket.addToRoom('*');
        socket.addToRoom(clientType);
        onConnectionCallback(clientType, socket);
      }
    });
  },

  /** @private */
  _broadcast: function _broadcast(binary, roomIds, excludeSocket, channel) {
    var _this2 = this;

    for (var _len = arguments.length, args = new Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
      args[_key - 4] = arguments[_key];
    }

    var method = binary ? 'sendBinary' : 'send';
    var targets = new Set();

    if (typeof roomsIds === 'string' || Array.isArray(roomIds)) {
      if (typeof roomsIds === 'string') {
        roomIds = [roomIds];
      }

      roomIds.forEach(function (roomId) {
        if (_this2._rooms.has(roomId)) {
          var room = _this2._rooms.get(roomId);

          room.forEach(function (socket) {
            return targets.add(socket);
          });
        }
      });
    } else {
      targets = this._rooms.get('*');
    }

    targets.forEach(function (socket) {
      if (socket.ws.readyState === WebSocket.OPEN) {
        if (excludeSocket !== null) {
          if (socket !== excludeSocket) {
            socket[method].apply(socket, [channel].concat(args));
          }
        } else {
          socket[method].apply(socket, [channel].concat(args));
        }
      }
    });
  },

  /**
   * Add a socket to a room
   *
   * @param {Socket} module:soundworks/server.Socket - Socket to register in the room.
   * @param {String} roomId - Id of the room
   */
  addToRoom: function addToRoom(socket, roomId) {
    socket.addToRoom(roomId);
  },

  /**
   * Remove a socket from a room
   *
   * @param {Socket} module:soundworks/server.Socket - Socket to register in the room.
   * @param {String} [roomId=null] - Id of the room
   */
  removeFromRoom: function removeFromRoom(socket, roomId) {
    socket.removeFromRoom(roomId);
  },

  /**
   * Send a string message to all client of given room(s). If no room
   * not specified, the message is sent to all clients
   *
   * @param {String|Array} roomsIds - Ids of the rooms that must receive
   *  the message. If null the message is sent to all clients
   * @param {module:soundworks/server.Socket} excludeSocket - Optionnal
   *  socket to ignore when broadcasting the message, typically the client
   *  at the origin of the message
   * @param {String} channel - Channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type)
   */
  broadcast: function broadcast(roomIds, excludeSocket, channel) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      args[_key2 - 3] = arguments[_key2];
    }

    this._broadcast.apply(this, [false, roomIds, excludeSocket, channel].concat(args));
  },

  /**
   * Send a binary message (TypedArray) to all client of given room(s). If no room
   * not specified, the message is sent to all clients
   *
   * @param {String|Array} roomsIds - Ids of the rooms that must receive
   *  the message. If null the message is sent to all clients
   * @param {module:soundworks/server.Socket} excludeSocket - Optionnal
   *  socket to ignore when broadcasting the message, typically the client
   *  at the origin of the message
   * @param {String} channel - Channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type)
   */
  broadcastBinary: function broadcastBinary(roomIds, excludeSocket, channel, typedArray) {
    this._broadcast(true, roomIds, excludeSocket, channel, typedArray);
  }
};

var cacheDir = path.join(process.cwd(), '.soundworks');

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

function getFilename(serviceId) {
  var filename = serviceId.replace(':', '_');
  return path.join(cacheDir, filename);
}

var cache = {
  write: function write(serviceId, key, value) {
    // const storePath
    var filename = getFilename(serviceId);

    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, JSON.stringify({}));
    }

    var store = JSON.parse(fs.readFileSync(filename));
    store[key] = value;
    fs.writeFileSync(filename, JSON.stringify(store));
  },
  read: function read(serviceId, key) {
    var filename = getFilename(serviceId);

    if (fs.existsSync(filename)) {
      var store = JSON.parse(fs.readFileSync(filename));
      return store[key];
    } else {
      return null;
    }
  }
};

/**
 * Server side entry point for a `soundworks` application.
 *
 * This object hosts configuration informations, as well as methods to
 * initialize and start the application. It is also responsible for creating
 * the static file (http) server as well as the socket server.
 *
 * @memberof module:soundworks/server
 * @namespace
 *
 * @example
 * import * as soundworks from 'soundworks/server';
 * import MyExperience from './MyExperience';
 *
 * soundworks.server.init(config);
 * const myExperience = new MyExperience();
 * soundworks.server.start();
 */

var server = {
  /**
   * Configuration informations, all config objects passed to the
   * [`server.init`]{@link module:soundworks/server.server.init} are merged
   * into this object.
   * @type {module:soundworks/server.server~serverConfig}
   */
  config: {},

  /**
   * wrapper around `ws` server
   * @type {module:soundworks/server.sockets}
   * @default module:soundworks/server.sockets
   */
  sockets: sockets,

  /**
   * polka instance, can allow to expose additionnal routes (e.g. REST API).
   */
  router: null,

  /**
   * http(s) server instance.
   */
  httpServer: null,

  /**
   * key and certificates (may be generated and self-signed) for https server.
   */
  httpsInfos: null,

  /**
   * Mapping between a `clientType` and its related activities.
   * @private
   */
  _clientTypeActivitiesMap: {},

  /**
   * Required activities that must be started.
   * @private
   */
  _activities: new Set(),

  /**
   * Optionnal routing defined for each client.
   * @private
   * @type {Object}
   */
  _routes: {},

  /**
   * Default for the module:soundworks/server.server~clientConfigDefinition
   * @private
   */
  _clientConfigFunction: function _clientConfigFunction(clientType, serverConfig, httpRequest) {
    return {
      clientType: clientType
    };
  },

  /**
   * Register a route for a given `clientType`, allow to define a more complex
   * routing (additionnal route parameters) for a given type of client.
   * @param {String} clientType - Type of the client.
   * @param {String|RegExp} route - Template of the route that should be append.
   *  to the client type
   *
   * @note: used by Orbe?
   *
   * @example
   * ```
   * // allow `conductor` clients to connect to `http://site.com/conductor/1`
   * server.registerRoute('conductor', '/:param')
   * ```
   */
  defineRoute: function defineRoute(clientType, route) {
    this._routes[clientType] = route;
  },

  /**
   * Function used by activities to register themselves as active activities
   * @param {Activity} activity - Activity to be registered.
   * @private
   */
  setActivity: function setActivity(activity) {
    this._activities.add(activity);
  },

  /**
   * Initialize the server with the given configuration.
   * At the end of the init step the express router is available.
   *
   * @param {module:soundworks/server.server~serverConfig} config -
   *  Configuration of the application.
   */
  init: function init(config, clientConfigFunction) {
    this.config = config;
    this._clientConfigFunction = clientConfigFunction; // instanciate and configure polka
    // this allows to hook middleware and routes (e.g. cors) in the express
    // instance between `server.init` and `server.start`

    this.router = polka(); // compression (must be set before static)

    this.router.use(compression());
    return Promise.resolve();
  },

  /** @private */
  serveStatic: function serveStatic() {
    // public static folder
    var _this$config = this.config,
        publicDirectory = _this$config.publicDirectory,
        serveStaticOptions = _this$config.serveStaticOptions;
    this.router.use(_serveStatic(publicDirectory, serveStaticOptions));
    return Promise.resolve();
  },

  /** @private */
  initActivities: function initActivities() {
    var _this = this;

    // map activities to their respective client type(s) and start them all
    this._activities.forEach(function (activity) {
      activity.clientTypes.forEach(function (clientType) {
        if (!_this._clientTypeActivitiesMap[clientType]) {
          _this._clientTypeActivitiesMap[clientType] = new Set();
        }

        _this._clientTypeActivitiesMap[clientType].add(activity);
      });
    });

    return Promise.resolve();
  },

  /** @private */
  createHttpServer: function createHttpServer() {
    var _this2 = this;

    // start http server
    var useHttps = this.config.useHttps || false;
    return Promise.resolve().then(function () {
      // create http server
      if (!useHttps) {
        var httpServer = http.createServer();
        return Promise.resolve(httpServer);
      } else {
        var httpsInfos = _this2.config.httpsInfos;

        if (httpsInfos.key && httpsInfos.cert) {
          // use given certificate
          try {
            var key = fs.readFileSync(httpsInfos.key);
            var cert = fs.readFileSync(httpsInfos.cert);
            _this2.httpsInfos = {
              key: key,
              cert: cert
            };

            var _httpsServer = https.createServer(_this2.httpsInfos);
          } catch (err) {
            console.error("Invalid certificate files, please check your:\n- key file: ".concat(httpsInfos.key, "\n- cert file: ").concat(httpsInfos.cert, "\n              "));
            throw err;
          }

          return Promise.resolve(httpsServer);
        } else {
          return new Promise(function (resolve, reject) {
            var key = cache.read('server', 'httpsKey');
            var cert = cache.read('server', 'httpsCert');

            if (key !== null && cert !== null) {
              _this2.httpsInfos = {
                key: key,
                cert: cert
              };

              var _httpsServer2 = https.createServer(_this2.httpsInfos);

              resolve(_httpsServer2);
            } else {
              // generate certificate on the fly (for development purposes)
              pem.createCertificate({
                days: 1,
                selfSigned: true
              }, function (err, keys) {
                if (err) {
                  return console.error(err.stack);
                }

                _this2.httpsInfos = {
                  key: keys.serviceKey,
                  cert: keys.certificate
                };
                cache.write('server', 'httpsKey', _this2.httpsInfos.key);
                cache.write('server', 'httpsCert', _this2.httpsInfos.cert);
                var httpsServer = https.createServer(_this2.httpsInfos);
                resolve(httpsServer);
              });
            }
          });
        }
      }
    }).then(function (httpServer) {
      _this2.httpServer = httpServer;
      _this2.router.server = httpServer;
      return Promise.resolve();
    });
  },
  initRouting: function initRouting() {
    // init routing for each client type
    console.log(chalk.yellow("+ available clients:"));
    var routes = []; // open all routes except default

    for (var clientType in this._clientTypeActivitiesMap) {
      if (clientType !== this.config.defaultClient) {
        var route = this._openClientRoute(clientType, this.router);

        routes.push({
          clientType: "[".concat(clientType, "]"),
          route: chalk.green(route)
        });
      }
    } // open default route last


    for (var _clientType in this._clientTypeActivitiesMap) {
      if (_clientType === this.config.defaultClient) {
        var _route = this._openClientRoute(_clientType, this.router);

        routes.unshift({
          clientType: "[".concat(_clientType, "]"),
          route: chalk.green(_route)
        });
      }
    }

    console.log(columnify(routes, {
      showHeaders: false,
      config: {
        clientType: {
          align: 'right'
        }
      }
    }));
    return Promise.resolve();
  },

  /** @private */
  startSocketServer: function startSocketServer() {
    var _this3 = this;

    sockets.start(this.httpServer, this.config.websockets, function (clientType, socket) {
      _this3._onSocketConnection(clientType, socket);
    });
    return Promise.resolve();
  },

  /** @private */
  listen: function listen() {
    var _this4 = this;

    var promise = new Promise(function (resolve, reject) {
      var port = _this4.config.port;
      var useHttps = _this4.config.useHttps || false;
      var protocol = useHttps ? 'https' : 'http';
      var ifaces = os.networkInterfaces();

      _this4.router.listen(port, function () {
        // log infos
        console.log(chalk.yellow("+ ".concat(protocol, " server listening on:")));
        Object.keys(ifaces).forEach(function (dev) {
          ifaces[dev].forEach(function (details) {
            if (details.family === 'IPv4') {
              console.log("    ".concat(protocol, "://").concat(details.address, ":").concat(chalk.green(port)));
            }
          });
        });
        resolve();
      });
    });
    return promise;
  },

  /**
   * Open the route for the given client.
   * @private
   */
  _openClientRoute: function _openClientRoute(clientType, router) {
    var _this5 = this;

    var route = '/';

    if (clientType !== this.config.defaultClient) {
      route += "".concat(clientType);
    }

    if (this._routes[clientType]) {
      route += this._routes[clientType];
    } // define template filename: `${clientType}.ejs` or `default.ejs`


    var templateDirectory = this.config.templateDirectory;
    var clientTmpl = path.join(templateDirectory, "".concat(clientType, ".ejs"));
    var defaultTmpl = path.join(templateDirectory, "default.ejs"); // all this can append later

    fs.stat(clientTmpl, function (err, stats) {
      var template;

      if (err || !stats.isFile()) {
        template = defaultTmpl;
      } else {
        template = clientTmpl;
      }

      var tmplString = fs.readFileSync(template, {
        encoding: 'utf8'
      });
      var tmpl = ejs.compile(tmplString); // http request

      router.get(route, function (req, res) {
        var data = _this5._clientConfigFunction(clientType, _this5.config, req);

        var appIndex = tmpl({
          data: data
        });
        res.end(appIndex);
      });
    }); // return route infos for logging on server start

    return route;
  },

  /**
   * Socket connection callback.
   * @private
   */
  _onSocketConnection: function _onSocketConnection(clientType, socket) {
    var _this6 = this;

    var client = new Client(clientType, socket);
    var activities = this._clientTypeActivitiesMap[clientType];
    socket.addListener('close', function () {
      // clean sockets
      socket.terminate(); // remove client from activities

      activities.forEach(function (activity) {
        if (activity instanceof Experience) {
          // maybe the client go through the whole connect lifecycle
          if (activity.clients.has(client)) {
            activity.disconnect(client);
          }
        } else {
          activity.disconnect(client);
        }
      }); // destroy client

      client.destroy();
    }); // check coherence between client-side and server-side service requirements

    var serverRequiredServices = serviceManager.getRequiredServices(clientType);
    var serverServicesList = serviceManager.getServiceList();
    socket.addListener('s:client:handshake', function (data) {
      // in development, if service required client-side but not server-side,
      // complain properly client-side.
      if (_this6.config.env !== 'production') {
        var clientRequiredServices = data.requiredServices || [];
        var missingServices = [];
        clientRequiredServices.forEach(function (serviceId) {
          if ( // check that it's not a client-side only servive
          serverServicesList.indexOf(serviceId) !== -1 && serverRequiredServices.indexOf(serviceId) === -1) {
            missingServices.push(serviceId);
          }
        });

        if (missingServices.length > 0) {
          var err = {
            type: 'services',
            payload: missingServices
          };
          socket.send('s:client:error', err);
          return;
        }
      }

      activities.forEach(function (activity) {
        return activity.connect(client);
      });
      var id = client.id,
          uuid = client.uuid;
      socket.send('s:client:start', {
        id: id,
        uuid: uuid
      });
    });
  }
};

/**
 * Internal base class for services and scenes.
 *
 * @memberof module:soundworks/server
 */

var Activity =
/*#__PURE__*/
function () {
  /**
   * Creates an instance of the class.
   * @param {String} id - Id of the activity.
   */
  function Activity(id) {
    var _this = this;

    _classCallCheck(this, Activity);

    if (id === undefined) {
      throw new Error("Undefined id for activty ".concat(this.constructor.name));
    }
    /**
     * The id of the activity. This value must match a client side
     * {@link src/client/core/Activity.js~Activity} id in order to create
     * a namespaced socket channel between the activity and its client side peer.
     * @type {String}
     * @name id
     * @instance
     * @memberof module:soundworks/server.Activity
     */


    this.id = id;
    /**
     * Options of the activity. These values should be updated with the
     * `this.configure` method.
     * @type {Object}
     * @name options
     * @instance
     * @memberof module:soundworks/server.Activity
     */

    this.options = {};
    /**
     * The client types on which the activity should be mapped.
     * @type {Set}
     * @name clientTypes
     * @instance
     * @memberof module:soundworks/server.Activity
     */

    this.clientTypes = new Set();
    /**
     * List of the activities the current activity needs in order to work.
     * @type {Set}
     * @private
     */

    this._requiredActivities = new Set(); // register as instanciated to the server

    server.setActivity(this);
    this._requiredStartSignals = new SignalAll();

    this._requiredStartSignals.addObserver(function () {
      return _this.start();
    }); // wait for serviceManager.start


    this._requiredStartSignals.add(serviceManager.signals.start);
  }
  /**
   * Add client type that should be mapped to this activity.
   * @private
   * @param {String|Array} val - The client type(s) on which the activity
   *  should be mapped
   */


  _createClass(Activity, [{
    key: "_addClientTypes",
    value: function _addClientTypes(type) {
      var _this2 = this;

      if (arguments.length === 1) {
        if (typeof type === 'string') type = [type];
      } else {
        type = Array.from(arguments);
      } // add client types to current activity


      type.forEach(function (clientType) {
        _this2.clientTypes.add(clientType);
      }); // propagate value to required activities

      this._requiredActivities.forEach(function (activity) {
        activity._addClientTypes(type);
      });
    }
    /**
     * Configure the activity.
     * @param {Object} options
     */

  }, {
    key: "configure",
    value: function configure(options) {
      Object.assign(this.options, options);
    }
    /**
     * Retrieve a service. The required service is added to the `_requiredActivities`.
     * @param {String} id - The id of the service.
     * @param {Object} options - Some options to configure the service.
     */
    // make abstract, should be implemented by child classes (Scene and Service)

  }, {
    key: "require",
    value: function require(id, options) {
      var instance = serviceManager.require(id, options);

      this._requiredActivities.add(instance);

      this._requiredStartSignals.add(instance.signals.ready);

      instance._addClientTypes(this.clientTypes);

      return instance;
    }
    /**
     * Interface method to be implemented by activities. As part of an activity
     * lifecycle, the method should define the behavior of the activity when started
     * (e.g. binding listeners). When this method is called, all configuration options
     * should be defined.
     * The method is automatically called by the server on startup.
     */

  }, {
    key: "start",
    value: function start() {}
    /**
     * Called when the `client` connects to the server. This method should handle
     * the particular logic of the activity on the server side according to the
     * connected client (e.g. adding socket listeners).
     * @param {module:soundworks/server.Client} client
     */

  }, {
    key: "connect",
    value: function connect(client) {}
    /**
     * Called when the client `client` disconnects from the server. This method
     * should handle the particular logic of the activity on the server side when
     * a client disconnect (e.g. removing socket listeners).
     * @param {module:soundworks/server.Client} client
     */

  }, {
    key: "disconnect",
    value: function disconnect(client) {}
  }]);

  return Activity;
}();

/**
 * Base class used to build a experience on the server side.
 *
 * Along with the classic {@link src/server/core/Activity#connect} and
 * {@link src/server/core/Activity#disconnect} methods, the base class has two
 * additional methods:
 * - {@link Experience#enter}: called when the client enters the `Experience`
 * (*i.e.* when the {@link src/client/scene/Experience.js~Experience} on the
 * client side calls its {@link src/client/scene/Experience.js~Experience#start} method);
 * - {@link Experience#exit}: called when the client leaves the `Experience`
 * (*i.e.* when the {@link src/client/scene/Experience.js~Experience} on the
 * client side calls its {@link src/client/scene/Experience.js~Experience#done}
 * method, or if the client disconnected from the server).
 *
 * The base class also keeps track of the clients who are currently in the
 * performance (*i.e.* who entered but not exited yet) in the array `this.clients`.
 *
 * (See also {@link src/client/scene/Experience.js~Experience} on the client side.)
 *
 * @memberof module:soundworks/server
 */

var Experience =
/*#__PURE__*/
function (_Activity) {
  _inherits(Experience, _Activity);

  function Experience(clientTypes) {
    var _this;

    _classCallCheck(this, Experience);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Experience).call(this, 'experience'));
    /**
     * List of the clients who are currently in the performance.
     * @type {Client[]}
     */

    _this.clients = new Set();

    _this._addClientTypes(clientTypes);

    return _this;
  }
  /**
   * Called when the client connects to the server.
   * @param {Client} client Connected client.
   */


  _createClass(Experience, [{
    key: "connect",
    value: function connect(client) {
      var _this2 = this;

      _get(_getPrototypeOf(Experience.prototype), "connect", this).call(this, client); // listen for the `'enter' socket message from the client, the message is
      // sent when the client `enters` the Experience client side, i.e. when all
      // required services are ready


      return new Promise(function (resolve, reject) {
        client.socket.addListener('s:exp:enter', function () {
          _this2.clients.add(client);

          resolve();
        });
      });
    }
    /**
     * Called when the client disconnects from the server.
     * @param {Client} client Disconnected client.
     */

  }, {
    key: "disconnect",
    value: function disconnect(client) {
      _get(_getPrototypeOf(Experience.prototype), "disconnect", this).call(this, client); // check is made in server before calling disconnect


      this.clients["delete"](client);
      return Promise.resolve();
    }
  }]);

  return Experience;
}(Activity);

/**
 * Base class to be extended in order to create a new service.
 *
 * @memberof module:soundworks/server
 * @extends module:soundworks/server.Activity
 */

var Service =
/*#__PURE__*/
function (_Activity) {
  _inherits(Service, _Activity);

  function Service() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Service);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Service)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.signals = {};
    _this.signals.ready = new Signal();
    return _this;
  }

  _createClass(Service, [{
    key: "ready",
    value: function ready() {
      this.signals.ready.set(true);
    }
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
  server: server,
  serviceManager: serviceManager,

  /**
   *
   * server config:
   *
   * @param {String} [options.defaultClient='player'] - Client that can access
   *   the application at its root url.
   * @param {String} [options.publicDirectory='public'] - The public directory
   *   to expose, for serving static assets.
   * @param {String} [options.port=8000] - Port on which the http(s) server will
   *   listen
   * @param {Object} [options.serveStaticOptions={}] - TBD
   * @param {Boolean} [options.useHttps=false] - Define wheter to use or not an
   *   an https server.
   * @param {Object} [options.httpsInfos=null] - if `useHttps` is `true`, object
   *   that give the path to `cert` and `key` files (`{ cert, key }`). If `null`
   *   an auto generated certificate will be generated, be aware that browsers
   *   will consider the application as not safe in the case.
   * @param {Object} [options.websocket={}] - TBD
   * @param {String} [options.env='development']
   * @param {String} [options.templateDirectory='src/server/tmpl'] - Folder in
   *   which the server will look for the `index.html` template.
   *
   * @param {Function} clientConfigFunction -
   */
  init: function () {
    var _init = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(config, clientConfigFunction) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // must be done this way to keep the instance shared
              this.config = config;

              if (this.config.port === undefined) {
                this.config.port = 8000;
              }

              if (this.config.publicDirectory === undefined) {
                this.config.publicDirectory = path.join(process.cwd(), 'public');
              }

              if (this.config.serveStaticOptions === undefined) {
                this.config.serveStaticOptions = {};
              }

              if (this.config.templateDirectory === undefined) {
                this.config.templateDirectory = path.join(process.cwd(), 'src', 'server', 'tmpl');
              }

              if (this.config.defaultClient === undefined) {
                this.config.defaultClient = 'player';
              }

              if (this.config.websockets === undefined) {
                this.config.websockets = {};
              }

              serviceManager.init();
              _context.next = 10;
              return server.init(config, clientConfigFunction);

            case 10:
              return _context.abrupt("return", Promise.resolve());

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function init(_x, _x2) {
      return _init.apply(this, arguments);
    }

    return init;
  }(),
  start: function () {
    var _start = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return server.serveStatic();

            case 2:
              _context2.next = 4;
              return server.initActivities();

            case 4:
              _context2.next = 6;
              return server.createHttpServer();

            case 6:
              _context2.next = 8;
              return server.initRouting();

            case 8:
              _context2.next = 10;
              return server.startSocketServer();

            case 10:
              _context2.next = 12;
              return serviceManager.start();

            case 12:
              _context2.next = 14;
              return server.listen();

            case 14:
              return _context2.abrupt("return", Promise.resolve());

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
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

module.exports = soundworks;
