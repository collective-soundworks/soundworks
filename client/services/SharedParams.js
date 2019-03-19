'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZFBhcmFtcy5qcyJdLCJuYW1lcyI6WyJfUGFyYW0iLCJwYXJlbnQiLCJ0eXBlIiwibmFtZSIsImxhYmVsIiwidmFsdWUiLCJ1bmRlZmluZWQiLCJ2YWwiLCJzZW5kVG9TZXJ2ZXIiLCJlbWl0Iiwic2VuZCIsInNldCIsIl9wcm9wYWdhdGUiLCJFdmVudEVtaXR0ZXIiLCJfQm9vbGVhblBhcmFtIiwiaW5pdCIsIl9FbnVtUGFyYW0iLCJvcHRpb25zIiwiaW5kZXgiLCJpbmRleE9mIiwiX051bWJlclBhcmFtIiwibWluIiwibWF4Iiwic3RlcCIsIk1hdGgiLCJfVGV4dFBhcmFtIiwiX1RyaWdnZXJQYXJhbSIsIlNFUlZJQ0VfSUQiLCJTaGFyZWRQYXJhbXMiLCJkZWZhdWx0cyIsImNvbmZpZ3VyZSIsInBhcmFtcyIsIl9vbkluaXRSZXNwb25zZSIsImJpbmQiLCJfb25VcGRhdGVSZXNwb25zZSIsInJlY2VpdmUiLCJyZW1vdmVMaXN0ZW5lciIsImNvbmZpZyIsImZvckVhY2giLCJlbnRyeSIsInBhcmFtIiwiX2NyZWF0ZVBhcmFtIiwicmVhZHkiLCJ1cGRhdGUiLCJsaXN0ZW5lciIsImFkZExpc3RlbmVyIiwiY29uc29sZSIsImxvZyIsIlNlcnZpY2UiLCJzZXJ2aWNlTWFuYWdlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBO0FBQ0E7OztBQUdBO0lBQ01BLE07OztBQUNKLGtCQUFZQyxNQUFaLEVBQW9CQyxJQUFwQixFQUEwQkMsSUFBMUIsRUFBZ0NDLEtBQWhDLEVBQXVDO0FBQUE7O0FBQUE7O0FBRXJDLFVBQUtILE1BQUwsR0FBY0EsTUFBZDtBQUNBLFVBQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLFVBQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLFVBQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUNBLFVBQUtDLEtBQUwsR0FBYUMsU0FBYjtB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dXJjZXNDb250ZW50IjpbImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnLi4vLi4vdXRpbHMvRXZlbnRFbWl0dGVyJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vKiBDT05UUk9MIFVOSVRTXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfUGFyYW0gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHR5cGUsIG5hbWUsIGxhYmVsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMudmFsdWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgX3Byb3BhZ2F0ZShzZW5kVG9TZXJ2ZXIgPSB0cnVlKSB7XG4gICAgdGhpcy5lbWl0KCd1cGRhdGUnLCB0aGlzLnZhbHVlKTsgLy8gY2FsbCBldmVudCBsaXN0ZW5lcnNcblxuICAgIGlmIChzZW5kVG9TZXJ2ZXIpXG4gICAgICB0aGlzLnBhcmVudC5zZW5kKCd1cGRhdGUnLCB0aGlzLm5hbWUsIHRoaXMudmFsdWUpOyAvLyBzZW5kIHRvIHNlcnZlclxuXG4gICAgdGhpcy5wYXJlbnQuZW1pdCgndXBkYXRlJywgdGhpcy5uYW1lLCB0aGlzLnZhbHVlKTsgLy8gY2FsbCBwYXJlbnQgbGlzdGVuZXJzXG4gIH1cblxuICB1cGRhdGUodmFsLCBzZW5kVG9TZXJ2ZXIgPSB0cnVlKSB7XG4gICAgdGhpcy5zZXQodmFsKTtcbiAgICB0aGlzLl9wcm9wYWdhdGUoc2VuZFRvU2VydmVyKTtcbiAgfVxufVxuXG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0Jvb2xlYW5QYXJhbSBleHRlbmRzIF9QYXJhbSB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgbmFtZSwgbGFiZWwsIGluaXQpIHtcbiAgICBzdXBlcihwYXJlbnQsICdib29sZWFuJywgbmFtZSwgbGFiZWwpO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfRW51bVBhcmFtIGV4dGVuZHMgX1BhcmFtIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBuYW1lLCBsYWJlbCwgb3B0aW9ucywgaW5pdCkge1xuICAgIHN1cGVyKHBhcmVudCwgJ2VudW0nLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLm9wdGlvbnMuaW5kZXhPZih2YWwpO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gICAgfVxuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX051bWJlclBhcmFtIGV4dGVuZHMgX1BhcmFtIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIGluaXQpIHtcbiAgICBzdXBlcihwYXJlbnQsICdudW1iZXInLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5taW4gPSBtaW47XG4gICAgdGhpcy5tYXggPSBtYXg7XG4gICAgdGhpcy5zdGVwID0gc3RlcDtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gTWF0aC5taW4odGhpcy5tYXgsIE1hdGgubWF4KHRoaXMubWluLCB2YWwpKTtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UZXh0UGFyYW0gZXh0ZW5kcyBfUGFyYW0ge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIG5hbWUsIGxhYmVsLCBpbml0KSB7XG4gICAgc3VwZXIocGFyZW50LCAndGV4dCcsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RyaWdnZXJQYXJhbSBleHRlbmRzIF9QYXJhbSB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgbmFtZSwgbGFiZWwpIHtcbiAgICBzdXBlcihwYXJlbnQsICd0cmlnZ2VyJywgbmFtZSwgbGFiZWwpO1xuICB9XG5cbiAgc2V0KHZhbCkgeyAvKiBub3RoaW5nIHRvIHNldCBoZXJlICovIH1cbn1cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnNoYXJlZC1wYXJhbXMnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ3NoYXJlZC1wYXJhbXMnYCBzZXJ2aWNlLlxuICpcbiAqIFRoZSBgc2hhcmVkLXBhcmFtc2Agc2VydmljZSBpcyB1c2VkIHRvIG1haW50YWluIGFuZCB1cGRhdGUgZ2xvYmFsIHBhcmFtZXRlcnNcbiAqIHVzZWQgYW1vbmcgYWxsIGNvbm5lY3RlZCBjbGllbnRzLiBFYWNoIGRlZmluZWQgcGFyYW1ldGVyIGNhbiBiZSBvZiB0aGVcbiAqIGZvbGxvd2luZyBkYXRhIHR5cGVzOlxuICogLSBib29sZWFuXG4gKiAtIGVudW1cbiAqIC0gbnVtYmVyXG4gKiAtIHRleHRcbiAqIC0gdHJpZ2dlclxuICpcbiAqIFRoZSBwYXJhbWV0ZXJzIGFyZSBjb25maWd1cmVkIGluIHRoZSBzZXJ2ZXIgc2lkZSBjb3VudGVycGFydCBvZiB0aGUgc2VydmljZS5cbiAqXG4gKiBUbyBjcmVhdGUgYSBjb250cm9sIHN1cmZhY2UgZnJvbSB0aGUgcGFyYW1ldGVycyBkZWZpbml0aW9ucywgYSBkZWRpY2F0ZWQgc2NlbmVcbiAqIFtgQmFzaWNTaGFyZWRDb250cm9sbGVyYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkJhc2ljU2hhcmVkQ29udHJvbGxlcn1cbiAqIGlzIGF2YWlsYWJsZS5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgYWxvbmcgd2l0aCBpdHNcbiAqIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlNoYXJlZFBhcmFtc30qX19cbiAqXG4gKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlXG4gKiBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc2hhcmVkUGFyYW1zID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtcGFyYW1zJyk7XG4gKiAvLyB3aGVuIHRoZSBleHBlcmllbmNlIHN0YXJ0cywgbGlzdGVuIGZvciBwYXJhbWV0ZXIgdXBkYXRlc1xuICogdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignc3ludGg6Z2FpbicsICh2YWx1ZSkgPT4ge1xuICogICB0aGlzLnN5bnRoLnNldEdhaW4odmFsdWUpO1xuICogfSk7XG4gKlxuICogQHNlZSBbYEJhc2ljU2hhcmVkQ29udHJvbGxlcmAgc2NlbmVde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5CYXNpY1NoYXJlZENvbnRyb2xsZXJ9XG4gKi9cbmNsYXNzIFNoYXJlZFBhcmFtcyBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge307XG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgLyoqXG4gICAgICogRGljdGlvbmFyeSBvZiBhbGwgdGhlIHBhcmFtZXRlcnMgYW5kIGNvbW1hbmRzLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgcGFyYW1zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRQYXJhbXNcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5wYXJhbXMgPSB7fTtcblxuICAgIHRoaXMuX29uSW5pdFJlc3BvbnNlID0gdGhpcy5fb25Jbml0UmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblVwZGF0ZVJlc3BvbnNlID0gdGhpcy5fb25VcGRhdGVSZXNwb25zZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnaW5pdCcsIHRoaXMuX29uSW5pdFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3VwZGF0ZScsIHRoaXMuX29uVXBkYXRlUmVzcG9uc2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICAgIC8vIGRvbid0IHJlbW92ZSAndXBkYXRlJyBsaXN0ZW5lciwgYXMgdGhlIGNvbnRyb2wgaXMgcnVubmlnIGFzIGEgYmFja2dyb3VuZCBwcm9jZXNzXG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignaW5pdCcsIHRoaXMuX29uSW5pdFJlc3BvbnNlKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Jbml0UmVzcG9uc2UoY29uZmlnKSB7XG4gICAgY29uZmlnLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBjb25zdCBwYXJhbSA9IHRoaXMuX2NyZWF0ZVBhcmFtKGVudHJ5KTtcbiAgICAgIHRoaXMucGFyYW1zW3BhcmFtLm5hbWVdID0gcGFyYW07XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uVXBkYXRlUmVzcG9uc2UobmFtZSwgdmFsKSB7XG4gICAgLy8gdXBkYXRlLCBidXQgZG9uJ3Qgc2VuZCBiYWNrIHRvIHNlcnZlclxuICAgIHRoaXMudXBkYXRlKG5hbWUsIHZhbCwgZmFsc2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9jcmVhdGVQYXJhbShpbml0KSB7XG4gICAgbGV0IHBhcmFtID0gbnVsbDtcblxuICAgIHN3aXRjaCAoaW5pdC50eXBlKSB7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgcGFyYW0gPSBuZXcgX0Jvb2xlYW5QYXJhbSh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZW51bSc6XG4gICAgICAgIHBhcmFtID0gbmV3IF9FbnVtUGFyYW0odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0Lm9wdGlvbnMsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcGFyYW0gPSBuZXcgX051bWJlclBhcmFtKHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC5taW4sIGluaXQubWF4LCBpbml0LnN0ZXAsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgIHBhcmFtID0gbmV3IF9UZXh0UGFyYW0odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3RyaWdnZXInOlxuICAgICAgICBwYXJhbSA9IG5ldyBfVHJpZ2dlclBhcmFtKHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJhbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNoYXJlZFBhcmFtc35wYXJhbUNhbGxiYWNrXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIC0gVXBkYXRlZCB2YWx1ZSBvZiB0aGUgc2hhcmVkIHBhcmFtZXRlci5cbiAgICovXG5cbiAgLyoqXG4gICAqIEFkZCBhIGxpc3RlbmVyIHRvIGxpc3RlbiBhIHNwZWNpZmljIHBhcmFtZXRlciBjaGFuZ2VzLiBUaGUgbGlzdGVuZXIgaXNcbiAgICogZXhlY3V0ZWQgaW1tZWRpYXRlbHkgd2hlbiBhZGRlZCB3aXRoIHRoZSBwYXJhbWV0ZXIgY3VycmVudCB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNoYXJlZFBhcmFtc35wYXJhbUNhbGxiYWNrfSBsaXN0ZW5lciAtXG4gICAqICBMaXN0ZW5lciB0byBhZGQuXG4gICAqL1xuICBhZGRQYXJhbUxpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgcGFyYW0gPSB0aGlzLnBhcmFtc1tuYW1lXTtcblxuICAgIGlmIChwYXJhbSkge1xuICAgICAgcGFyYW0uYWRkTGlzdGVuZXIoJ3VwZGF0ZScsIGxpc3RlbmVyKTtcblxuICAgICAgaWYgKHBhcmFtLnR5cGUgIT09ICd0cmlnZ2VyJylcbiAgICAgICAgbGlzdGVuZXIocGFyYW0udmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBwYXJhbSBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyIGZyb20gbGlzdGVuaW5nIGEgc3BlY2lmaWMgcGFyYW1ldGVyIGNoYW5nZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRQYXJhbXN+cGFyYW1DYWxsYmFja30gbGlzdGVuZXIgLVxuICAgKiAgTGlzdGVuZXIgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlUGFyYW1MaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IHBhcmFtID0gdGhpcy5wYXJhbXNbbmFtZV07XG5cbiAgICBpZiAocGFyYW0pXG4gICAgICBwYXJhbS5yZW1vdmVMaXN0ZW5lcigndXBkYXRlJywgbGlzdGVuZXIpO1xuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHBhcmFtIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHZhbHVlIG9mIGEgZ2l2ZW4gcGFyYW1ldGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHJldHVybnMge01peGVkfSAtIEN1cnJlbnQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIGdldFZhbHVlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXNbbmFtZV0udmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSB2YWx1ZSBvZiBhIHBhcmFtZXRlciAodXNlZCB3aGVuIGBvcHRpb25zLmhhc0dVST10cnVlYClcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbCAtIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtzZW5kVG9TZXJ2ZXI9dHJ1ZV0gLSBGbGFnIHdoZXRoZXIgdGhlIHZhbHVlIHNob3VsZCBiZVxuICAgKiAgcHJvcGFnYXRlZCB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbCwgc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgIGNvbnN0IHBhcmFtID0gdGhpcy5wYXJhbXNbbmFtZV07XG5cbiAgICBpZiAocGFyYW0pXG4gICAgICBwYXJhbS51cGRhdGUodmFsLCBzZW5kVG9TZXJ2ZXIpO1xuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHNoYXJlZCBwYXJhbWV0ZXIgXCInICsgbmFtZSArICdcIicpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNoYXJlZFBhcmFtcyk7XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXJlZFBhcmFtcztcbiJdfQ==