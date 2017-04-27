'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

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

var _EventEmitter2 = require('../../utils/EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* --------------------------------------------------------- */
/* CONTROL UNITS
/* --------------------------------------------------------- */

/** @private */
var _Param = function (_EventEmitter) {
  (0, _inherits3.default)(_Param, _EventEmitter);

  function _Param(parent, type, name, label) {
    (0, _classCallCheck3.default)(this, _Param);

    var _this = (0, _possibleConstructorReturn3.default)(this, (_Param.__proto__ || (0, _getPrototypeOf2.default)(_Param)).call(this));

    _this.parent = parent;
    _this.type = type;
    _this.name = name;
    _this.label = label;
    _this.value = undefined;

    /**
     * Events
     * @name _events
     * @type {Map<String, Set>}
     * @instanceof Process
     * @private
     */
    _this._events = new _map2.default();
    return _this;
  }

  (0, _createClass3.default)(_Param, [{
    key: 'set',
    value: function set(val) {
      this.value = value;
    }
  }, {
    key: '_propagate',
    value: function _propagate() {
      var sendToServer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this.emit('update', this.value); // call event listeners

      if (sendToServer) this.parent.send('update', this.name, this.value); // send to server

      this.parent.emit('update', this.name, this.value); // call parent listeners
    }
  }, {
    key: 'update',
    value: function update(val) {
      var sendToServer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this.set(val);
      this._propagate(sendToServer);
    }

    /**
     * Add a callback to a named event
     * @param {String} channel - Name of the event.
     * @param {Function} callback - Callback executed when the event is emitted.
     */

  }, {
    key: 'addListener',
    value: function addListener(channel, callback) {
      if (!this._events.has(channel)) this._events.set(channel, new _set2.default());

      var stack = this._events.get(channel);
      stack.push(callback);
    }

    /**
     * Remove a callback from a named event
     * @param {String} channel - Name of the event.
     * @param {Function} callback - Callback to remove.
     */

  }, {
    key: 'removeListener',
    value: function removeListener(channel, callback) {
      var stack = this._events.get(channel);
      stack.delete(callback);
    }

    /**
     * Emit a named event
     * @param {String} channel - Name of the event.
     * @param {...Mixed} args - Arguments to pass to the callback.
     */

  }, {
    key: 'emit',
    value: function emit(channel) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var stack = this._events.get(channel);
      stach.forEach(function (callback) {
        return callback.apply(undefined, args);
      });
    }
  }]);
  return _Param;
}(_EventEmitter3.default);

/** @private */


var _BooleanParam = function (_Param2) {
  (0, _inherits3.default)(_BooleanParam, _Param2);

  function _BooleanParam(parent, name, label, init) {
    (0, _classCallCheck3.default)(this, _BooleanParam);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (_BooleanParam.__proto__ || (0, _getPrototypeOf2.default)(_BooleanParam)).call(this, parent, 'boolean', name, label));

    _this2.set(init);
    return _this2;
  }

  (0, _createClass3.default)(_BooleanParam, [{
    key: 'set',
    value: function set(val) {
      this.value = val;
    }
  }]);
  return _BooleanParam;
}(_Param);

/** @private */


var _EnumParam = function (_Param3) {
  (0, _inherits3.default)(_EnumParam, _Param3);

  function _EnumParam(parent, name, label, options, init) {
    (0, _classCallCheck3.default)(this, _EnumParam);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (_EnumParam.__proto__ || (0, _getPrototypeOf2.default)(_EnumParam)).call(this, parent, 'enum', name, label));

    _this3.options = options;
    _this3.set(init);
    return _this3;
  }

  (0, _createClass3.default)(_EnumParam, [{
    key: 'set',
    value: function set(val) {
      var index = this.options.indexOf(val);

      if (index >= 0) {
        this.index = index;
        this.value = val;
      }
    }
  }]);
  return _EnumParam;
}(_Param);

/** @private */


var _NumberParam = function (_Param4) {
  (0, _inherits3.default)(_NumberParam, _Param4);

  function _NumberParam(parent, name, label, min, max, step, init) {
    (0, _classCallCheck3.default)(this, _NumberParam);

    var _this4 = (0, _possibleConstructorReturn3.default)(this, (_NumberParam.__proto__ || (0, _getPrototypeOf2.default)(_NumberParam)).call(this, parent, 'number', name, label));

    _this4.min = min;
    _this4.max = max;
    _this4.step = step;
    _this4.set(init);
    return _this4;
  }

  (0, _createClass3.default)(_NumberParam, [{
    key: 'set',
    value: function set(val) {
      this.value = Math.min(this.max, Math.max(this.min, val));
    }
  }]);
  return _NumberParam;
}(_Param);

/** @private */


var _TextParam = function (_Param5) {
  (0, _inherits3.default)(_TextParam, _Param5);

  function _TextParam(parent, name, label, init) {
    (0, _classCallCheck3.default)(this, _TextParam);

    var _this5 = (0, _possibleConstructorReturn3.default)(this, (_TextParam.__proto__ || (0, _getPrototypeOf2.default)(_TextParam)).call(this, parent, 'text', name, label));

    _this5.set(init);
    return _this5;
  }

  (0, _createClass3.default)(_TextParam, [{
    key: 'set',
    value: function set(val) {
      this.value = val;
    }
  }]);
  return _TextParam;
}(_Param);

/** @private */


var _TriggerParam = function (_Param6) {
  (0, _inherits3.default)(_TriggerParam, _Param6);

  function _TriggerParam(parent, name, label) {
    (0, _classCallCheck3.default)(this, _TriggerParam);
    return (0, _possibleConstructorReturn3.default)(this, (_TriggerParam.__proto__ || (0, _getPrototypeOf2.default)(_TriggerParam)).call(this, parent, 'trigger', name, label));
  }

  (0, _createClass3.default)(_TriggerParam, [{
    key: 'set',
    value: function set(val) {/* nothing to set here */}
  }]);
  return _TriggerParam;
}(_Param);

var SERVICE_ID = 'service:shared-params';

/**
 * Interface for the client `'shared-params'` service.
 *
 * The `shared-params` service is used to maintain and update global parameters
 * used among all connected clients. Each defined parameter can be of the
 * following data types:
 * - boolean
 * - enum
 * - number
 * - text
 * - trigger
 *
 * The parameters are configured in the server side counterpart of the service.
 *
 * To create a control surface from the parameters definitions, a dedicated scene
 * [`BasicSharedController`]{@link module:soundworks/client.BasicSharedController}
 * is available.
 *
 * __*The service must be used along with its
 * [server-side counterpart]{@link module:soundworks/server.SharedParams}*__
 *
 * _<span class="warning">__WARNING__</span> This class should never be
 * instanciated manually_
 *
 * @memberof module:soundworks/client
 *
 * @example
 * // inside the experience constructor
 * this.sharedParams = this.require('shared-params');
 * // when the experience starts, listen for parameter updates
 * this.sharedParams.addParamListener('synth:gain', (value) => {
 *   this.synth.setGain(value);
 * });
 *
 * @see [`BasicSharedController` scene]{@link module:soundworks/client.BasicSharedController}
 */

var SharedParams = function (_Service) {
  (0, _inherits3.default)(SharedParams, _Service);

  function SharedParams() {
    (0, _classCallCheck3.default)(this, SharedParams);

    var _this7 = (0, _possibleConstructorReturn3.default)(this, (SharedParams.__proto__ || (0, _getPrototypeOf2.default)(SharedParams)).call(this, SERVICE_ID, true));

    var defaults = {};
    _this7.configure(defaults);

    /**
     * Dictionary of all the parameters and commands.
     * @type {Object}
     * @name params
     * @instance
     * @memberof module:soundworks/client.SharedParams
     *
     * @private
     */
    _this7.params = {};

    _this7._onInitResponse = _this7._onInitResponse.bind(_this7);
    _this7._onUpdateResponse = _this7._onUpdateResponse.bind(_this7);
    return _this7;
  }

  /** @private */


  (0, _createClass3.default)(SharedParams, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(SharedParams.prototype.__proto__ || (0, _getPrototypeOf2.default)(SharedParams.prototype), 'start', this).call(this);

      this.send('request');

      this.receive('init', this._onInitResponse);
      this.receive('update', this._onUpdateResponse);
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)(SharedParams.prototype.__proto__ || (0, _getPrototypeOf2.default)(SharedParams.prototype), 'stop', this).call(this);
      // don't remove 'update' listener, as the control is runnig as a background process
      this.removeListener('init', this._onInitResponse);
    }

    /** @private */

  }, {
    key: '_onInitResponse',
    value: function _onInitResponse(config) {
      var _this8 = this;

      config.forEach(function (entry) {
        var param = _this8._createParam(entry);
        _this8.params[param.name] = param;
      });

      this.ready();
    }

    /** @private */

  }, {
    key: '_onUpdateResponse',
    value: function _onUpdateResponse(name, val) {
      // update, but don't send back to server
      this.update(name, val, false);
    }

    /** @private */

  }, {
    key: '_createParam',
    value: function _createParam(init) {
      var param = null;

      switch (init.type) {
        case 'boolean':
          param = new _BooleanParam(this, init.name, init.label, init.value);
          break;

        case 'enum':
          param = new _EnumParam(this, init.name, init.label, init.options, init.value);
          break;

        case 'number':
          param = new _NumberParam(this, init.name, init.label, init.min, init.max, init.step, init.value);
          break;

        case 'text':
          param = new _TextParam(this, init.name, init.label, init.value);
          break;

        case 'trigger':
          param = new _TriggerParam(this, init.name, init.label);
          break;
      }

      return param;
    }

    /**
     * @callback module:soundworks/client.SharedParams~paramCallback
     * @param {Mixed} value - Updated value of the shared parameter.
     */

    /**
     * Add a listener to listen a specific parameter changes. The listener is
     * executed immediately when added with the parameter current value.
     *
     * @param {String} name - Name of the parameter.
     * @param {module:soundworks/client.SharedParams~paramCallback} listener -
     *  Listener to add.
     */

  }, {
    key: 'addParamListener',
    value: function addParamListener(name, listener) {
      var param = this.params[name];

      if (param) {
        param.addListener('update', listener);

        if (param.type !== 'trigger') listener(param.value);
      } else {
        console.log('unknown param "' + name + '"');
      }
    }

    /**
     * Remove a listener from listening a specific parameter changes.
     *
     * @param {String} name - Name of the parameter.
     * @param {module:soundworks/client.SharedParams~paramCallback} listener -
     *  Listener to remove.
     */

  }, {
    key: 'removeParamListener',
    value: function removeParamListener(name, listener) {
      var param = this.params[name];

      if (param) param.removeListener('update', listener);else console.log('unknown param "' + name + '"');
    }

    /**
     * Get the value of a given parameter.
     *
     * @param {String} name - Name of the parameter.
     * @returns {Mixed} - Current value of the parameter.
     */

  }, {
    key: 'getValue',
    value: function getValue(name) {
      return this.params[name].value;
    }

    /**
     * Update the value of a parameter (used when `options.hasGUI=true`)
     *
     * @param {String} name - Name of the parameter.
     * @param {Mixed} val - New value of the parameter.
     * @param {Boolean} [sendToServer=true] - Flag whether the value should be
     *  propagated to the server.
     */

  }, {
    key: 'update',
    value: function update(name, val) {
      var sendToServer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var param = this.params[name];

      if (param) param.update(val, sendToServer);else console.log('unknown shared parameter "' + name + '"');
    }
  }]);
  return SharedParams;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, SharedParams);

exports.default = SharedParams;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZFBhcmFtcy5qcyJdLCJuYW1lcyI6WyJfUGFyYW0iLCJwYXJlbnQiLCJ0eXBlIiwibmFtZSIsImxhYmVsIiwidmFsdWUiLCJ1bmRlZmluZWQiLCJfZXZlbnRzIiwidmFsIiwic2VuZFRvU2VydmVyIiwiZW1pdCIsInNlbmQiLCJzZXQiLCJfcHJvcGFnYXRlIiwiY2hhbm5lbCIsImNhbGxiYWNrIiwiaGFzIiwic3RhY2siLCJnZXQiLCJwdXNoIiwiZGVsZXRlIiwiYXJncyIsInN0YWNoIiwiZm9yRWFjaCIsIl9Cb29sZWFuUGFyYW0iLCJpbml0IiwiX0VudW1QYXJhbSIsIm9wdGlvbnMiLCJpbmRleCIsImluZGV4T2YiLCJfTnVtYmVyUGFyYW0iLCJtaW4iLCJtYXgiLCJzdGVwIiwiTWF0aCIsIl9UZXh0UGFyYW0iLCJfVHJpZ2dlclBhcmFtIiwiU0VSVklDRV9JRCIsIlNoYXJlZFBhcmFtcyIsImRlZmF1bHRzIiwiY29uZmlndXJlIiwicGFyYW1zIiwiX29uSW5pdFJlc3BvbnNlIiwiYmluZCIsIl9vblVwZGF0ZVJlc3BvbnNlIiwicmVjZWl2ZSIsInJlbW92ZUxpc3RlbmVyIiwiY29uZmlnIiwiZW50cnkiLCJwYXJhbSIsIl9jcmVhdGVQYXJhbSIsInJlYWR5IiwidXBkYXRlIiwibGlzdGVuZXIiLCJhZGRMaXN0ZW5lciIsImNvbnNvbGUiLCJsb2ciLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBO0FBQ0E7OztBQUdBO0lBQ01BLE07OztBQUNKLGtCQUFZQyxNQUFaLEVBQW9CQyxJQUFwQixFQUEwQkMsSUFBMUIsRUFBZ0NDLEtBQWhDLEVBQXVDO0FBQUE7O0FBQUE7O0FBRXJDLFVBQUtILE1BQUwsR0FBY0EsTUFBZDtBQUNBLFVBQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLFVBQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLFVBQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUNBLFVBQUtDLEtBQUwsR0FBYUMsU0FBYjs7QUFFQTs7Ozs7OztBQU9BLFVBQUtDLE9BQUwsR0FBZSxtQkFBZjtBQWZxQztBQWdCdEM7Ozs7d0JBRUdDLEcsRUFBSztBQUNQLFdBQUtILEtBQUwsR0FBYUEsS0FBYjtBQUNEOzs7aUNBRStCO0FBQUEsVUFBckJJLFlBQXFCLHVFQUFOLElBQU07O0FBQzlCLFdBQUtDLElBQUwsQ0FBVSxRQUFWLEVBQW9CLEtBQUtMLEtBQXpCLEVBRDhCLENBQ0c7O0FBRWpDLFVBQUlJLFlBQUosRUFDRSxLQUFLUixNQUFMLENBQVlVLElBQVosQ0FBaUIsUUFBakIsRUFBMkIsS0FBS1IsSUFBaEMsRUFBc0MsS0FBS0UsS0FBM0MsRUFKNEIsQ0FJdUI7O0FBRXJELFdBQUtKLE1BQUwsQ0FBWVMsSUFBWixDQUFpQixRQUFqQixFQUEyQixLQUFLUCxJQUFoQyxFQUFzQyxLQUFLRSxLQUEzQyxFQU44QixDQU1xQjtBQUNwRDs7OzJCQUVNRyxHLEVBQTBCO0FBQUEsVUFBckJDLFlBQXFCLHVFQUFOLElBQU07O0FBQy9CLFdBQUtHLEdBQUwsQ0FBU0osR0FBVDtBQUNBLFdBQUtLLFVBQUwsQ0FBZ0JKLFlBQWhCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O2dDQUtZSyxPLEVBQVNDLFEsRUFBVTtBQUM3QixVQUFJLENBQUMsS0FBS1IsT0FBTCxDQUFhUyxHQUFiLENBQWlCRixPQUFqQixDQUFMLEVBQ0UsS0FBS1AsT0FBTCxDQUFhSyxHQUFiLENBQWlCRSxPQUFqQixFQUEwQixtQkFBMUI7O0FBRUYsVUFBTUcsUUFBUSxLQUFLVixPQUFMLENBQWFXLEdBQWIsQ0FBaUJKLE9BQWpCLENBQWQ7QUFDQUcsWUFBTUUsSUFBTixDQUFXSixRQUFYO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O21DQUtlRCxPLEVBQVNDLFEsRUFBVTtBQUNoQyxVQUFNRSxRQUFRLEtBQUtWLE9BQUwsQ0FBYVcsR0FBYixDQUFpQkosT0FBakIsQ0FBZDtBQUNBRyxZQUFNRyxNQUFOLENBQWFMLFFBQWI7QUFDRDs7QUFFRDs7Ozs7Ozs7eUJBS0tELE8sRUFBa0I7QUFBQSx3Q0FBTk8sSUFBTTtBQUFOQSxZQUFNO0FBQUE7O0FBQ3JCLFVBQU1KLFFBQVEsS0FBS1YsT0FBTCxDQUFhVyxHQUFiLENBQWlCSixPQUFqQixDQUFkO0FBQ0FRLFlBQU1DLE9BQU4sQ0FBYyxVQUFDUixRQUFEO0FBQUEsZUFBY0EsMEJBQVlNLElBQVosQ0FBZDtBQUFBLE9BQWQ7QUFDRDs7Ozs7QUFJSDs7O0lBQ01HLGE7OztBQUNKLHlCQUFZdkIsTUFBWixFQUFvQkUsSUFBcEIsRUFBMEJDLEtBQTFCLEVBQWlDcUIsSUFBakMsRUFBdUM7QUFBQTs7QUFBQSxxSkFDL0J4QixNQUQrQixFQUN2QixTQUR1QixFQUNaRSxJQURZLEVBQ05DLEtBRE07O0FBRXJDLFdBQUtRLEdBQUwsQ0FBU2EsSUFBVDtBQUZxQztBQUd0Qzs7Ozt3QkFFR2pCLEcsRUFBSztBQUNQLFdBQUtILEtBQUwsR0FBYUcsR0FBYjtBQUNEOzs7RUFSeUJSLE07O0FBVzVCOzs7SUFDTTBCLFU7OztBQUNKLHNCQUFZekIsTUFBWixFQUFvQkUsSUFBcEIsRUFBMEJDLEtBQTFCLEVBQWlDdUIsT0FBakMsRUFBMENGLElBQTFDLEVBQWdEO0FBQUE7O0FBQUEsK0lBQ3hDeEIsTUFEd0MsRUFDaEMsTUFEZ0MsRUFDeEJFLElBRHdCLEVBQ2xCQyxLQURrQjs7QUFFOUMsV0FBS3VCLE9BQUwsR0FBZUEsT0FBZjtBQUNBLFdBQUtmLEdBQUwsQ0FBU2EsSUFBVDtBQUg4QztBQUkvQzs7Ozt3QkFFR2pCLEcsRUFBSztBQUNQLFVBQUlvQixRQUFRLEtBQUtELE9BQUwsQ0FBYUUsT0FBYixDQUFxQnJCLEdBQXJCLENBQVo7O0FBRUEsVUFBSW9CLFNBQVMsQ0FBYixFQUFnQjtBQUNkLGFBQUtBLEtBQUwsR0FBYUEsS0FBYjtBQUNBLGFBQUt2QixLQUFMLEdBQWFHLEdBQWI7QUFDRDtBQUNGOzs7RUFkc0JSLE07O0FBaUJ6Qjs7O0lBQ004QixZOzs7QUFDSix3QkFBWTdCLE1BQVosRUFBb0JFLElBQXBCLEVBQTBCQyxLQUExQixFQUFpQzJCLEdBQWpDLEVBQXNDQyxHQUF0QyxFQUEyQ0MsSUFBM0MsRUFBaURSLElBQWpELEVBQXVEO0FBQUE7O0FBQUEsbUpBQy9DeEIsTUFEK0MsRUFDdkMsUUFEdUMsRUFDN0JFLElBRDZCLEVBQ3ZCQyxLQUR1Qjs7QUFFckQsV0FBSzJCLEdBQUwsR0FBV0EsR0FBWDtBQUNBLFdBQUtDLEdBQUwsR0FBV0EsR0FBWDtBQUNBLFdBQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLFdBQUtyQixHQUFMLENBQVNhLElBQVQ7QUFMcUQ7QUFNdEQ7Ozs7d0JBRUdqQixHLEVBQUs7QUFDUCxXQUFLSCxLQUFMLEdBQWE2QixLQUFLSCxHQUFMLENBQVMsS0FBS0MsR0FBZCxFQUFtQkUsS0FBS0YsR0FBTCxDQUFTLEtBQUtELEdBQWQsRUFBbUJ2QixHQUFuQixDQUFuQixDQUFiO0FBQ0Q7OztFQVh3QlIsTTs7QUFjM0I7OztJQUNNbUMsVTs7O0FBQ0osc0JBQVlsQyxNQUFaLEVBQW9CRSxJQUFwQixFQUEwQkMsS0FBMUIsRUFBaUNxQixJQUFqQyxFQUF1QztBQUFBOztBQUFBLCtJQUMvQnhCLE1BRCtCLEVBQ3ZCLE1BRHVCLEVBQ2ZFLElBRGUsRUFDVEMsS0FEUzs7QUFFckMsV0FBS1EsR0FBTCxDQUFTYSxJQUFUO0FBRnFDO0FBR3RDOzs7O3dCQUVHakIsRyxFQUFLO0FBQ1AsV0FBS0gsS0FBTCxHQUFhRyxHQUFiO0FBQ0Q7OztFQVJzQlIsTTs7QUFXekI7OztJQUNNb0MsYTs7O0FBQ0oseUJBQVluQyxNQUFaLEVBQW9CRSxJQUFwQixFQUEwQkMsS0FBMUIsRUFBaUM7QUFBQTtBQUFBLCtJQUN6QkgsTUFEeUIsRUFDakIsU0FEaUIsRUFDTkUsSUFETSxFQUNBQyxLQURBO0FBRWhDOzs7O3dCQUVHSSxHLEVBQUssQ0FBRSx5QkFBMkI7OztFQUxaUixNOztBQVE1QixJQUFNcUMsYUFBYSx1QkFBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFvQ01DLFk7OztBQUNKLDBCQUFjO0FBQUE7O0FBQUEsbUpBQ05ELFVBRE0sRUFDTSxJQUROOztBQUdaLFFBQU1FLFdBQVcsRUFBakI7QUFDQSxXQUFLQyxTQUFMLENBQWVELFFBQWY7O0FBRUE7Ozs7Ozs7OztBQVNBLFdBQUtFLE1BQUwsR0FBYyxFQUFkOztBQUVBLFdBQUtDLGVBQUwsR0FBdUIsT0FBS0EsZUFBTCxDQUFxQkMsSUFBckIsUUFBdkI7QUFDQSxXQUFLQyxpQkFBTCxHQUF5QixPQUFLQSxpQkFBTCxDQUF1QkQsSUFBdkIsUUFBekI7QUFsQlk7QUFtQmI7O0FBRUQ7Ozs7OzRCQUNRO0FBQ047O0FBRUEsV0FBS2hDLElBQUwsQ0FBVSxTQUFWOztBQUVBLFdBQUtrQyxPQUFMLENBQWEsTUFBYixFQUFxQixLQUFLSCxlQUExQjtBQUNBLFdBQUtHLE9BQUwsQ0FBYSxRQUFiLEVBQXVCLEtBQUtELGlCQUE1QjtBQUNEOztBQUVEOzs7OzJCQUNPO0FBQ0w7QUFDQTtBQUNBLFdBQUtFLGNBQUwsQ0FBb0IsTUFBcEIsRUFBNEIsS0FBS0osZUFBakM7QUFDRDs7QUFFRDs7OztvQ0FDZ0JLLE0sRUFBUTtBQUFBOztBQUN0QkEsYUFBT3hCLE9BQVAsQ0FBZSxVQUFDeUIsS0FBRCxFQUFXO0FBQ3hCLFlBQU1DLFFBQVEsT0FBS0MsWUFBTCxDQUFrQkYsS0FBbEIsQ0FBZDtBQUNBLGVBQUtQLE1BQUwsQ0FBWVEsTUFBTTlDLElBQWxCLElBQTBCOEMsS0FBMUI7QUFDRCxPQUhEOztBQUtBLFdBQUtFLEtBQUw7QUFDRDs7QUFFRDs7OztzQ0FDa0JoRCxJLEVBQU1LLEcsRUFBSztBQUMzQjtBQUNBLFdBQUs0QyxNQUFMLENBQVlqRCxJQUFaLEVBQWtCSyxHQUFsQixFQUF1QixLQUF2QjtBQUNEOztBQUVEOzs7O2lDQUNhaUIsSSxFQUFNO0FBQ2pCLFVBQUl3QixRQUFRLElBQVo7O0FBRUEsY0FBUXhCLEtBQUt2QixJQUFiO0FBQ0UsYUFBSyxTQUFMO0FBQ0UrQyxrQkFBUSxJQUFJekIsYUFBSixDQUFrQixJQUFsQixFQUF3QkMsS0FBS3RCLElBQTdCLEVBQW1Dc0IsS0FBS3JCLEtBQXhDLEVBQStDcUIsS0FBS3BCLEtBQXBELENBQVI7QUFDQTs7QUFFRixhQUFLLE1BQUw7QUFDRTRDLGtCQUFRLElBQUl2QixVQUFKLENBQWUsSUFBZixFQUFxQkQsS0FBS3RCLElBQTFCLEVBQWdDc0IsS0FBS3JCLEtBQXJDLEVBQTRDcUIsS0FBS0UsT0FBakQsRUFBMERGLEtBQUtwQixLQUEvRCxDQUFSO0FBQ0E7O0FBRUYsYUFBSyxRQUFMO0FBQ0U0QyxrQkFBUSxJQUFJbkIsWUFBSixDQUFpQixJQUFqQixFQUF1QkwsS0FBS3RCLElBQTVCLEVBQWtDc0IsS0FBS3JCLEtBQXZDLEVBQThDcUIsS0FBS00sR0FBbkQsRUFBd0ROLEtBQUtPLEdBQTdELEVBQWtFUCxLQUFLUSxJQUF2RSxFQUE2RVIsS0FBS3BCLEtBQWxGLENBQVI7QUFDQTs7QUFFRixhQUFLLE1BQUw7QUFDRTRDLGtCQUFRLElBQUlkLFVBQUosQ0FBZSxJQUFmLEVBQXFCVixLQUFLdEIsSUFBMUIsRUFBZ0NzQixLQUFLckIsS0FBckMsRUFBNENxQixLQUFLcEIsS0FBakQsQ0FBUjtBQUNBOztBQUVGLGFBQUssU0FBTDtBQUNFNEMsa0JBQVEsSUFBSWIsYUFBSixDQUFrQixJQUFsQixFQUF3QlgsS0FBS3RCLElBQTdCLEVBQW1Dc0IsS0FBS3JCLEtBQXhDLENBQVI7QUFDQTtBQW5CSjs7QUFzQkEsYUFBTzZDLEtBQVA7QUFDRDs7QUFFRDs7Ozs7QUFLQTs7Ozs7Ozs7Ozs7cUNBUWlCOUMsSSxFQUFNa0QsUSxFQUFVO0FBQy9CLFVBQU1KLFFBQVEsS0FBS1IsTUFBTCxDQUFZdEMsSUFBWixDQUFkOztBQUVBLFVBQUk4QyxLQUFKLEVBQVc7QUFDVEEsY0FBTUssV0FBTixDQUFrQixRQUFsQixFQUE0QkQsUUFBNUI7O0FBRUEsWUFBSUosTUFBTS9DLElBQU4sS0FBZSxTQUFuQixFQUNFbUQsU0FBU0osTUFBTTVDLEtBQWY7QUFDSCxPQUxELE1BS087QUFDTGtELGdCQUFRQyxHQUFSLENBQVksb0JBQW9CckQsSUFBcEIsR0FBMkIsR0FBdkM7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7O3dDQU9vQkEsSSxFQUFNa0QsUSxFQUFVO0FBQ2xDLFVBQU1KLFFBQVEsS0FBS1IsTUFBTCxDQUFZdEMsSUFBWixDQUFkOztBQUVBLFVBQUk4QyxLQUFKLEVBQ0VBLE1BQU1ILGNBQU4sQ0FBcUIsUUFBckIsRUFBK0JPLFFBQS9CLEVBREYsS0FHRUUsUUFBUUMsR0FBUixDQUFZLG9CQUFvQnJELElBQXBCLEdBQTJCLEdBQXZDO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs2QkFNU0EsSSxFQUFNO0FBQ2IsYUFBTyxLQUFLc0MsTUFBTCxDQUFZdEMsSUFBWixFQUFrQkUsS0FBekI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7MkJBUU9GLEksRUFBTUssRyxFQUEwQjtBQUFBLFVBQXJCQyxZQUFxQix1RUFBTixJQUFNOztBQUNyQyxVQUFNd0MsUUFBUSxLQUFLUixNQUFMLENBQVl0QyxJQUFaLENBQWQ7O0FBRUEsVUFBSThDLEtBQUosRUFDRUEsTUFBTUcsTUFBTixDQUFhNUMsR0FBYixFQUFrQkMsWUFBbEIsRUFERixLQUdFOEMsUUFBUUMsR0FBUixDQUFZLCtCQUErQnJELElBQS9CLEdBQXNDLEdBQWxEO0FBQ0g7Ozs7O0FBR0gseUJBQWVzRCxRQUFmLENBQXdCcEIsVUFBeEIsRUFBb0NDLFlBQXBDOztrQkFFZUEsWSIsImZpbGUiOiJTaGFyZWRQYXJhbXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJy4uLy4uL3V0aWxzL0V2ZW50RW1pdHRlcic7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLyogQ09OVFJPTCBVTklUU1xuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1BhcmFtIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCB0eXBlLCBuYW1lLCBsYWJlbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnRzXG4gICAgICogQG5hbWUgX2V2ZW50c1xuICAgICAqIEB0eXBlIHtNYXA8U3RyaW5nLCBTZXQ+fVxuICAgICAqIEBpbnN0YW5jZW9mIFByb2Nlc3NcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2V2ZW50cyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICBfcHJvcGFnYXRlKHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICB0aGlzLmVtaXQoJ3VwZGF0ZScsIHRoaXMudmFsdWUpOyAvLyBjYWxsIGV2ZW50IGxpc3RlbmVyc1xuXG4gICAgaWYgKHNlbmRUb1NlcnZlcilcbiAgICAgIHRoaXMucGFyZW50LnNlbmQoJ3VwZGF0ZScsIHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7IC8vIHNlbmQgdG8gc2VydmVyXG5cbiAgICB0aGlzLnBhcmVudC5lbWl0KCd1cGRhdGUnLCB0aGlzLm5hbWUsIHRoaXMudmFsdWUpOyAvLyBjYWxsIHBhcmVudCBsaXN0ZW5lcnNcbiAgfVxuXG4gIHVwZGF0ZSh2YWwsIHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICB0aGlzLnNldCh2YWwpO1xuICAgIHRoaXMuX3Byb3BhZ2F0ZShzZW5kVG9TZXJ2ZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNhbGxiYWNrIHRvIGEgbmFtZWQgZXZlbnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBOYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayBleGVjdXRlZCB3aGVuIHRoZSBldmVudCBpcyBlbWl0dGVkLlxuICAgKi9cbiAgYWRkTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5oYXMoY2hhbm5lbCkpXG4gICAgICB0aGlzLl9ldmVudHMuc2V0KGNoYW5uZWwsIG5ldyBTZXQoKSk7XG5cbiAgICBjb25zdCBzdGFjayA9IHRoaXMuX2V2ZW50cy5nZXQoY2hhbm5lbCk7XG4gICAgc3RhY2sucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgY2FsbGJhY2sgZnJvbSBhIG5hbWVkIGV2ZW50XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gTmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBzdGFjayA9IHRoaXMuX2V2ZW50cy5nZXQoY2hhbm5lbCk7XG4gICAgc3RhY2suZGVsZXRlKGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0IGEgbmFtZWQgZXZlbnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBOYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHsuLi5NaXhlZH0gYXJncyAtIEFyZ3VtZW50cyB0byBwYXNzIHRvIHRoZSBjYWxsYmFjay5cbiAgICovXG4gIGVtaXQoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbnN0IHN0YWNrID0gdGhpcy5fZXZlbnRzLmdldChjaGFubmVsKTtcbiAgICBzdGFjaC5mb3JFYWNoKChjYWxsYmFjaykgPT4gY2FsbGJhY2soLi4uYXJncykpO1xuICB9XG59XG5cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQm9vbGVhblBhcmFtIGV4dGVuZHMgX1BhcmFtIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBuYW1lLCBsYWJlbCwgaW5pdCkge1xuICAgIHN1cGVyKHBhcmVudCwgJ2Jvb2xlYW4nLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9FbnVtUGFyYW0gZXh0ZW5kcyBfUGFyYW0ge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0KSB7XG4gICAgc3VwZXIocGFyZW50LCAnZW51bScsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIGxldCBpbmRleCA9IHRoaXMub3B0aW9ucy5pbmRleE9mKHZhbCk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfTnVtYmVyUGFyYW0gZXh0ZW5kcyBfUGFyYW0ge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCkge1xuICAgIHN1cGVyKHBhcmVudCwgJ251bWJlcicsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLm1pbiA9IG1pbjtcbiAgICB0aGlzLm1heCA9IG1heDtcbiAgICB0aGlzLnN0ZXAgPSBzdGVwO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSBNYXRoLm1pbih0aGlzLm1heCwgTWF0aC5tYXgodGhpcy5taW4sIHZhbCkpO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RleHRQYXJhbSBleHRlbmRzIF9QYXJhbSB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgbmFtZSwgbGFiZWwsIGluaXQpIHtcbiAgICBzdXBlcihwYXJlbnQsICd0ZXh0JywgbmFtZSwgbGFiZWwpO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfVHJpZ2dlclBhcmFtIGV4dGVuZHMgX1BhcmFtIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBuYW1lLCBsYWJlbCkge1xuICAgIHN1cGVyKHBhcmVudCwgJ3RyaWdnZXInLCBuYW1lLCBsYWJlbCk7XG4gIH1cblxuICBzZXQodmFsKSB7IC8qIG5vdGhpbmcgdG8gc2V0IGhlcmUgKi8gfVxufVxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLXBhcmFtcyc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnc2hhcmVkLXBhcmFtcydgIHNlcnZpY2UuXG4gKlxuICogVGhlIGBzaGFyZWQtcGFyYW1zYCBzZXJ2aWNlIGlzIHVzZWQgdG8gbWFpbnRhaW4gYW5kIHVwZGF0ZSBnbG9iYWwgcGFyYW1ldGVyc1xuICogdXNlZCBhbW9uZyBhbGwgY29ubmVjdGVkIGNsaWVudHMuIEVhY2ggZGVmaW5lZCBwYXJhbWV0ZXIgY2FuIGJlIG9mIHRoZVxuICogZm9sbG93aW5nIGRhdGEgdHlwZXM6XG4gKiAtIGJvb2xlYW5cbiAqIC0gZW51bVxuICogLSBudW1iZXJcbiAqIC0gdGV4dFxuICogLSB0cmlnZ2VyXG4gKlxuICogVGhlIHBhcmFtZXRlcnMgYXJlIGNvbmZpZ3VyZWQgaW4gdGhlIHNlcnZlciBzaWRlIGNvdW50ZXJwYXJ0IG9mIHRoZSBzZXJ2aWNlLlxuICpcbiAqIFRvIGNyZWF0ZSBhIGNvbnRyb2wgc3VyZmFjZSBmcm9tIHRoZSBwYXJhbWV0ZXJzIGRlZmluaXRpb25zLCBhIGRlZGljYXRlZCBzY2VuZVxuICogW2BCYXNpY1NoYXJlZENvbnRyb2xsZXJgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQmFzaWNTaGFyZWRDb250cm9sbGVyfVxuICogaXMgYXZhaWxhYmxlLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCBhbG9uZyB3aXRoIGl0c1xuICogW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuU2hhcmVkUGFyYW1zfSpfX1xuICpcbiAqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmVcbiAqIGluc3RhbmNpYXRlZCBtYW51YWxseV9cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5zaGFyZWRQYXJhbXMgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2Ugc3RhcnRzLCBsaXN0ZW4gZm9yIHBhcmFtZXRlciB1cGRhdGVzXG4gKiB0aGlzLnNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdzeW50aDpnYWluJywgKHZhbHVlKSA9PiB7XG4gKiAgIHRoaXMuc3ludGguc2V0R2Fpbih2YWx1ZSk7XG4gKiB9KTtcbiAqXG4gKiBAc2VlIFtgQmFzaWNTaGFyZWRDb250cm9sbGVyYCBzY2VuZV17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkJhc2ljU2hhcmVkQ29udHJvbGxlcn1cbiAqL1xuY2xhc3MgU2hhcmVkUGFyYW1zIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICAvKipcbiAgICAgKiBEaWN0aW9uYXJ5IG9mIGFsbCB0aGUgcGFyYW1ldGVycyBhbmQgY29tbWFuZHMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAbmFtZSBwYXJhbXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNoYXJlZFBhcmFtc1xuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnBhcmFtcyA9IHt9O1xuXG4gICAgdGhpcy5fb25Jbml0UmVzcG9uc2UgPSB0aGlzLl9vbkluaXRSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uVXBkYXRlUmVzcG9uc2UgPSB0aGlzLl9vblVwZGF0ZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdpbml0JywgdGhpcy5fb25Jbml0UmVzcG9uc2UpO1xuICAgIHRoaXMucmVjZWl2ZSgndXBkYXRlJywgdGhpcy5fb25VcGRhdGVSZXNwb25zZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgLy8gZG9uJ3QgcmVtb3ZlICd1cGRhdGUnIGxpc3RlbmVyLCBhcyB0aGUgY29udHJvbCBpcyBydW5uaWcgYXMgYSBiYWNrZ3JvdW5kIHByb2Nlc3NcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdpbml0JywgdGhpcy5fb25Jbml0UmVzcG9uc2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkluaXRSZXNwb25zZShjb25maWcpIHtcbiAgICBjb25maWcuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIGNvbnN0IHBhcmFtID0gdGhpcy5fY3JlYXRlUGFyYW0oZW50cnkpO1xuICAgICAgdGhpcy5wYXJhbXNbcGFyYW0ubmFtZV0gPSBwYXJhbTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25VcGRhdGVSZXNwb25zZShuYW1lLCB2YWwpIHtcbiAgICAvLyB1cGRhdGUsIGJ1dCBkb24ndCBzZW5kIGJhY2sgdG8gc2VydmVyXG4gICAgdGhpcy51cGRhdGUobmFtZSwgdmFsLCBmYWxzZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2NyZWF0ZVBhcmFtKGluaXQpIHtcbiAgICBsZXQgcGFyYW0gPSBudWxsO1xuXG4gICAgc3dpdGNoIChpbml0LnR5cGUpIHtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICBwYXJhbSA9IG5ldyBfQm9vbGVhblBhcmFtKHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdlbnVtJzpcbiAgICAgICAgcGFyYW0gPSBuZXcgX0VudW1QYXJhbSh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQub3B0aW9ucywgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBwYXJhbSA9IG5ldyBfTnVtYmVyUGFyYW0odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0Lm1pbiwgaW5pdC5tYXgsIGluaXQuc3RlcCwgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgcGFyYW0gPSBuZXcgX1RleHRQYXJhbSh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAndHJpZ2dlcic6XG4gICAgICAgIHBhcmFtID0gbmV3IF9UcmlnZ2VyUGFyYW0odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmFtO1xuICB9XG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkUGFyYW1zfnBhcmFtQ2FsbGJhY2tcbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgLSBVcGRhdGVkIHZhbHVlIG9mIHRoZSBzaGFyZWQgcGFyYW1ldGVyLlxuICAgKi9cblxuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdG8gbGlzdGVuIGEgc3BlY2lmaWMgcGFyYW1ldGVyIGNoYW5nZXMuIFRoZSBsaXN0ZW5lciBpc1xuICAgKiBleGVjdXRlZCBpbW1lZGlhdGVseSB3aGVuIGFkZGVkIHdpdGggdGhlIHBhcmFtZXRlciBjdXJyZW50IHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkUGFyYW1zfnBhcmFtQ2FsbGJhY2t9IGxpc3RlbmVyIC1cbiAgICogIExpc3RlbmVyIHRvIGFkZC5cbiAgICovXG4gIGFkZFBhcmFtTGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBwYXJhbSA9IHRoaXMucGFyYW1zW25hbWVdO1xuXG4gICAgaWYgKHBhcmFtKSB7XG4gICAgICBwYXJhbS5hZGRMaXN0ZW5lcigndXBkYXRlJywgbGlzdGVuZXIpO1xuXG4gICAgICBpZiAocGFyYW0udHlwZSAhPT0gJ3RyaWdnZXInKVxuICAgICAgICBsaXN0ZW5lcihwYXJhbS52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHBhcmFtIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGlzdGVuZXIgZnJvbSBsaXN0ZW5pbmcgYSBzcGVjaWZpYyBwYXJhbWV0ZXIgY2hhbmdlcy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNoYXJlZFBhcmFtc35wYXJhbUNhbGxiYWNrfSBsaXN0ZW5lciAtXG4gICAqICBMaXN0ZW5lciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVQYXJhbUxpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgcGFyYW0gPSB0aGlzLnBhcmFtc1tuYW1lXTtcblxuICAgIGlmIChwYXJhbSlcbiAgICAgIHBhcmFtLnJlbW92ZUxpc3RlbmVyKCd1cGRhdGUnLCBsaXN0ZW5lcik7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gcGFyYW0gXCInICsgbmFtZSArICdcIicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgdmFsdWUgb2YgYSBnaXZlbiBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcmV0dXJucyB7TWl4ZWR9IC0gQ3VycmVudCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgZ2V0VmFsdWUobmFtZSkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtc1tuYW1lXS52YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIHZhbHVlIG9mIGEgcGFyYW1ldGVyICh1c2VkIHdoZW4gYG9wdGlvbnMuaGFzR1VJPXRydWVgKVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsIC0gTmV3IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3NlbmRUb1NlcnZlcj10cnVlXSAtIEZsYWcgd2hldGhlciB0aGUgdmFsdWUgc2hvdWxkIGJlXG4gICAqICBwcm9wYWdhdGVkIHRvIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICB1cGRhdGUobmFtZSwgdmFsLCBzZW5kVG9TZXJ2ZXIgPSB0cnVlKSB7XG4gICAgY29uc3QgcGFyYW0gPSB0aGlzLnBhcmFtc1tuYW1lXTtcblxuICAgIGlmIChwYXJhbSlcbiAgICAgIHBhcmFtLnVwZGF0ZSh2YWwsIHNlbmRUb1NlcnZlcik7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gc2hhcmVkIHBhcmFtZXRlciBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2hhcmVkUGFyYW1zKTtcblxuZXhwb3J0IGRlZmF1bHQgU2hhcmVkUGFyYW1zO1xuIl19