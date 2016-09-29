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

var _events = require('events');

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

  function _Param(control, type, name, label) {
    (0, _classCallCheck3.default)(this, _Param);

    var _this = (0, _possibleConstructorReturn3.default)(this, (_Param.__proto__ || (0, _getPrototypeOf2.default)(_Param)).call(this));

    _this.control = control;
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
      var sendToServer = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this.emit('update', this.value); // call event listeners

      if (sendToServer) this.control.send('update', this.name, this.value); // send to server

      this.control.emit('update', this.name, this.value); // call control listeners
    }
  }, {
    key: 'update',
    value: function update(val) {
      var sendToServer = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      this.set(val);
      this._propagate(sendToServer);
    }
  }]);
  return _Param;
}(_events.EventEmitter);

/** @private */


var _BooleanParam = function (_Param2) {
  (0, _inherits3.default)(_BooleanParam, _Param2);

  function _BooleanParam(control, name, label, init) {
    (0, _classCallCheck3.default)(this, _BooleanParam);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (_BooleanParam.__proto__ || (0, _getPrototypeOf2.default)(_BooleanParam)).call(this, control, 'boolean', name, label));

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

  function _EnumParam(control, name, label, options, init) {
    (0, _classCallCheck3.default)(this, _EnumParam);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (_EnumParam.__proto__ || (0, _getPrototypeOf2.default)(_EnumParam)).call(this, control, 'enum', name, label));

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

  function _NumberParam(control, name, label, min, max, step, init) {
    (0, _classCallCheck3.default)(this, _NumberParam);

    var _this4 = (0, _possibleConstructorReturn3.default)(this, (_NumberParam.__proto__ || (0, _getPrototypeOf2.default)(_NumberParam)).call(this, control, 'number', name, label));

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

  function _TextParam(control, name, label, init) {
    (0, _classCallCheck3.default)(this, _TextParam);

    var _this5 = (0, _possibleConstructorReturn3.default)(this, (_TextParam.__proto__ || (0, _getPrototypeOf2.default)(_TextParam)).call(this, control, 'text', name, label));

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

  function _TriggerParam(control, name, label) {
    (0, _classCallCheck3.default)(this, _TriggerParam);
    return (0, _possibleConstructorReturn3.default)(this, (_TriggerParam.__proto__ || (0, _getPrototypeOf2.default)(_TriggerParam)).call(this, control, 'trigger', name, label));
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
 * This service is used to maintain and update global parameters used among
 * all connected clients. Each defined parameter can be of the following
 * data types:
 * - boolean
 * - enum
 * - number
 * - text
 * - trigger
 *
 * This type and specific attributes of an parameter is configured server side.
 *
 * To create a control surface, for this service, an dedicated scene:
 * [`BasicSharedController`]{@link module:soundworks/client.BasicSharedController},
 * is available
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.SharedParams}*__
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.control = this.require('shared-params');
 * // when the experience starts, listen for parameter updates
 * this.control.addParamListener('synth:gain', (value) => {
 *   this.synth.setGain(value);
 * });
 *
 * @see [`BasicSharedController` scene]{@link module:soundworks/client.BasicSharedController}
 */

var SharedParams = function (_Service) {
  (0, _inherits3.default)(SharedParams, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function SharedParams() {
    (0, _classCallCheck3.default)(this, SharedParams);

    var _this7 = (0, _possibleConstructorReturn3.default)(this, (SharedParams.__proto__ || (0, _getPrototypeOf2.default)(SharedParams)).call(this, SERVICE_ID, true));

    var defaults = { hasGui: false };
    _this7.configure(defaults);

    _this7._onInitResponse = _this7._onInitResponse.bind(_this7);
    _this7._onUpdateResponse = _this7._onUpdateResponse.bind(_this7);
    return _this7;
  }

  /** @private */


  (0, _createClass3.default)(SharedParams, [{
    key: 'init',
    value: function init() {
      /**
       * Dictionary of all the parameters and commands.
       * @type {Object}
       * @private
       */
      this.params = {};
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)(SharedParams.prototype.__proto__ || (0, _getPrototypeOf2.default)(SharedParams.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

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

    /**
     * @callback module:soundworks/client.SharedParams~paramCallback
     * @param {Mixed} value - Updated value of the shared parameter.
     */
    /**
     * Add a listener to listen a specific parameter changes. The listener is called a first
     * time when added to retrieve the current value of the parameter.
     * @param {String} name - Name of the parameter.
     * @param {module:soundworks/client.SharedParams~paramCallback} listener - Callback
     *  that handle the event.
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
     * @param {String} name - Name of the parameter.
     * @param {module:soundworks/client.SharedParams~paramCallback} listener - The
     *  callback to remove.
     */

  }, {
    key: 'removeParamListener',
    value: function removeParamListener(name, listener) {
      var param = this.params[name];

      if (param) {
        param.removeListener('update', listener);
      } else {
        console.log('unknown param "' + name + '"');
      }
    }

    /**
     * Get the value of a given parameter.
     * @param {String} name - The name of the parameter.
     * @returns {Mixed} - The current value of the parameter.
     */

  }, {
    key: 'getValue',
    value: function getValue(name) {
      return this.params[name].value;
    }

    /**
     * Update the value of a parameter (used when `options.hasGUI=true`)
     * @private
     * @param {String} name - Name of the parameter.
     * @param {Mixed} val - New value of the parameter.
     * @param {Boolean} [sendToServer=true] - Flag whether the value should be
     *  propagate to the server.
     */

  }, {
    key: 'update',
    value: function update(name, val) {
      var sendToServer = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      var param = this.params[name];

      if (param) {
        param.update(val, sendToServer);
      } else {
        console.log('unknown shared parameter "' + name + '"');
      }
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
  }]);
  return SharedParams;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, SharedParams);

exports.default = SharedParams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZFBhcmFtcy5qcyJdLCJuYW1lcyI6WyJfUGFyYW0iLCJjb250cm9sIiwidHlwZSIsIm5hbWUiLCJsYWJlbCIsInZhbHVlIiwidW5kZWZpbmVkIiwidmFsIiwic2VuZFRvU2VydmVyIiwiZW1pdCIsInNlbmQiLCJzZXQiLCJfcHJvcGFnYXRlIiwiX0Jvb2xlYW5QYXJhbSIsImluaXQiLCJfRW51bVBhcmFtIiwib3B0aW9ucyIsImluZGV4IiwiaW5kZXhPZiIsIl9OdW1iZXJQYXJhbSIsIm1pbiIsIm1heCIsInN0ZXAiLCJNYXRoIiwiX1RleHRQYXJhbSIsIl9UcmlnZ2VyUGFyYW0iLCJTRVJWSUNFX0lEIiwiU2hhcmVkUGFyYW1zIiwiZGVmYXVsdHMiLCJoYXNHdWkiLCJjb25maWd1cmUiLCJfb25Jbml0UmVzcG9uc2UiLCJiaW5kIiwiX29uVXBkYXRlUmVzcG9uc2UiLCJwYXJhbXMiLCJoYXNTdGFydGVkIiwicmVjZWl2ZSIsInJlbW92ZUxpc3RlbmVyIiwiY29uZmlnIiwiZm9yRWFjaCIsImVudHJ5IiwicGFyYW0iLCJfY3JlYXRlUGFyYW0iLCJyZWFkeSIsInVwZGF0ZSIsImxpc3RlbmVyIiwiYWRkTGlzdGVuZXIiLCJjb25zb2xlIiwibG9nIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBO0FBQ0E7OztBQUdBO0lBQ01BLE07OztBQUNKLGtCQUFZQyxPQUFaLEVBQXFCQyxJQUFyQixFQUEyQkMsSUFBM0IsRUFBaUNDLEtBQWpDLEVBQXdDO0FBQUE7O0FBQUE7O0FBRXRDLFVBQUtILE9BQUwsR0FBZUEsT0FBZjtBQUNBLFVBQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLFVBQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLFVBQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUNBLFVBQUtDLEtBQUwsR0FBYUMsU0FBYjtBQU5zQztBQU92Qzs7Ozt3QkFFR0Ms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d0J2QixVQUF4QixFQUFvQ0MsWUFBcEM7O2tCQUVlQSxZIiwiZmlsZSI6IlNoYXJlZFBhcmFtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLyogQ09OVFJPTCBVTklUU1xuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1BhcmFtIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgdHlwZSwgbmFtZSwgbGFiZWwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY29udHJvbCA9IGNvbnRyb2w7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIF9wcm9wYWdhdGUoc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgIHRoaXMuZW1pdCgndXBkYXRlJywgdGhpcy52YWx1ZSk7IC8vIGNhbGwgZXZlbnQgbGlzdGVuZXJzXG5cbiAgICBpZiAoc2VuZFRvU2VydmVyKVxuICAgICAgdGhpcy5jb250cm9sLnNlbmQoJ3VwZGF0ZScsIHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7IC8vIHNlbmQgdG8gc2VydmVyXG5cbiAgICB0aGlzLmNvbnRyb2wuZW1pdCgndXBkYXRlJywgdGhpcy5uYW1lLCB0aGlzLnZhbHVlKTsgLy8gY2FsbCBjb250cm9sIGxpc3RlbmVyc1xuICB9XG5cbiAgdXBkYXRlKHZhbCwgc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgIHRoaXMuc2V0KHZhbCk7XG4gICAgdGhpcy5fcHJvcGFnYXRlKHNlbmRUb1NlcnZlcik7XG4gIH1cbn1cblxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9Cb29sZWFuUGFyYW0gZXh0ZW5kcyBfUGFyYW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgaW5pdCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdib29sZWFuJywgbmFtZSwgbGFiZWwpO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfRW51bVBhcmFtIGV4dGVuZHMgX1BhcmFtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIG9wdGlvbnMsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAnZW51bScsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIGxldCBpbmRleCA9IHRoaXMub3B0aW9ucy5pbmRleE9mKHZhbCk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfTnVtYmVyUGFyYW0gZXh0ZW5kcyBfUGFyYW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAnbnVtYmVyJywgbmFtZSwgbGFiZWwpO1xuICAgIHRoaXMubWluID0gbWluO1xuICAgIHRoaXMubWF4ID0gbWF4O1xuICAgIHRoaXMuc3RlcCA9IHN0ZXA7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IE1hdGgubWluKHRoaXMubWF4LCBNYXRoLm1heCh0aGlzLm1pbiwgdmFsKSk7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfVGV4dFBhcmFtIGV4dGVuZHMgX1BhcmFtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAndGV4dCcsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RyaWdnZXJQYXJhbSBleHRlbmRzIF9QYXJhbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3RyaWdnZXInLCBuYW1lLCBsYWJlbCk7XG4gIH1cblxuICBzZXQodmFsKSB7IC8qIG5vdGhpbmcgdG8gc2V0IGhlcmUgKi8gfVxufVxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLXBhcmFtcyc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnc2hhcmVkLXBhcmFtcydgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGlzIHVzZWQgdG8gbWFpbnRhaW4gYW5kIHVwZGF0ZSBnbG9iYWwgcGFyYW1ldGVycyB1c2VkIGFtb25nXG4gKiBhbGwgY29ubmVjdGVkIGNsaWVudHMuIEVhY2ggZGVmaW5lZCBwYXJhbWV0ZXIgY2FuIGJlIG9mIHRoZSBmb2xsb3dpbmdcbiAqIGRhdGEgdHlwZXM6XG4gKiAtIGJvb2xlYW5cbiAqIC0gZW51bVxuICogLSBudW1iZXJcbiAqIC0gdGV4dFxuICogLSB0cmlnZ2VyXG4gKlxuICogVGhpcyB0eXBlIGFuZCBzcGVjaWZpYyBhdHRyaWJ1dGVzIG9mIGFuIHBhcmFtZXRlciBpcyBjb25maWd1cmVkIHNlcnZlciBzaWRlLlxuICpcbiAqIFRvIGNyZWF0ZSBhIGNvbnRyb2wgc3VyZmFjZSwgZm9yIHRoaXMgc2VydmljZSwgYW4gZGVkaWNhdGVkIHNjZW5lOlxuICogW2BCYXNpY1NoYXJlZENvbnRyb2xsZXJgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQmFzaWNTaGFyZWRDb250cm9sbGVyfSxcbiAqIGlzIGF2YWlsYWJsZVxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5TaGFyZWRQYXJhbXN9Kl9fXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5jb250cm9sID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtcGFyYW1zJyk7XG4gKiAvLyB3aGVuIHRoZSBleHBlcmllbmNlIHN0YXJ0cywgbGlzdGVuIGZvciBwYXJhbWV0ZXIgdXBkYXRlc1xuICogdGhpcy5jb250cm9sLmFkZFBhcmFtTGlzdGVuZXIoJ3N5bnRoOmdhaW4nLCAodmFsdWUpID0+IHtcbiAqICAgdGhpcy5zeW50aC5zZXRHYWluKHZhbHVlKTtcbiAqIH0pO1xuICpcbiAqIEBzZWUgW2BCYXNpY1NoYXJlZENvbnRyb2xsZXJgIHNjZW5lXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQmFzaWNTaGFyZWRDb250cm9sbGVyfVxuICovXG5jbGFzcyBTaGFyZWRQYXJhbXMgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0geyBoYXNHdWk6IGZhbHNlIH07XG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fb25Jbml0UmVzcG9uc2UgPSB0aGlzLl9vbkluaXRSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uVXBkYXRlUmVzcG9uc2UgPSB0aGlzLl9vblVwZGF0ZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBEaWN0aW9uYXJ5IG9mIGFsbCB0aGUgcGFyYW1ldGVycyBhbmQgY29tbWFuZHMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucGFyYW1zID0ge307XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnaW5pdCcsIHRoaXMuX29uSW5pdFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3VwZGF0ZScsIHRoaXMuX29uVXBkYXRlUmVzcG9uc2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICAgIC8vIGRvbid0IHJlbW92ZSAndXBkYXRlJyBsaXN0ZW5lciwgYXMgdGhlIGNvbnRyb2wgaXMgcnVubmlnIGFzIGEgYmFja2dyb3VuZCBwcm9jZXNzXG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignaW5pdCcsIHRoaXMuX29uSW5pdFJlc3BvbnNlKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Jbml0UmVzcG9uc2UoY29uZmlnKSB7XG4gICAgY29uZmlnLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBjb25zdCBwYXJhbSA9IHRoaXMuX2NyZWF0ZVBhcmFtKGVudHJ5KTtcbiAgICAgIHRoaXMucGFyYW1zW3BhcmFtLm5hbWVdID0gcGFyYW07XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uVXBkYXRlUmVzcG9uc2UobmFtZSwgdmFsKSB7XG4gICAgLy8gdXBkYXRlLCBidXQgZG9uJ3Qgc2VuZCBiYWNrIHRvIHNlcnZlclxuICAgIHRoaXMudXBkYXRlKG5hbWUsIHZhbCwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkUGFyYW1zfnBhcmFtQ2FsbGJhY2tcbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgLSBVcGRhdGVkIHZhbHVlIG9mIHRoZSBzaGFyZWQgcGFyYW1ldGVyLlxuICAgKi9cbiAgLyoqXG4gICAqIEFkZCBhIGxpc3RlbmVyIHRvIGxpc3RlbiBhIHNwZWNpZmljIHBhcmFtZXRlciBjaGFuZ2VzLiBUaGUgbGlzdGVuZXIgaXMgY2FsbGVkIGEgZmlyc3RcbiAgICogdGltZSB3aGVuIGFkZGVkIHRvIHJldHJpZXZlIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRQYXJhbXN+cGFyYW1DYWxsYmFja30gbGlzdGVuZXIgLSBDYWxsYmFja1xuICAgKiAgdGhhdCBoYW5kbGUgdGhlIGV2ZW50LlxuICAgKi9cbiAgYWRkUGFyYW1MaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IHBhcmFtID0gdGhpcy5wYXJhbXNbbmFtZV07XG5cbiAgICBpZiAocGFyYW0pIHtcbiAgICAgIHBhcmFtLmFkZExpc3RlbmVyKCd1cGRhdGUnLCBsaXN0ZW5lcik7XG5cbiAgICAgIGlmIChwYXJhbS50eXBlICE9PSAndHJpZ2dlcicpXG4gICAgICAgIGxpc3RlbmVyKHBhcmFtLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gcGFyYW0gXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBsaXN0ZW5lciBmcm9tIGxpc3RlbmluZyBhIHNwZWNpZmljIHBhcmFtZXRlciBjaGFuZ2VzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkUGFyYW1zfnBhcmFtQ2FsbGJhY2t9IGxpc3RlbmVyIC0gVGhlXG4gICAqICBjYWxsYmFjayB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVQYXJhbUxpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgcGFyYW0gPSB0aGlzLnBhcmFtc1tuYW1lXTtcblxuICAgIGlmIChwYXJhbSkge1xuICAgICAgcGFyYW0ucmVtb3ZlTGlzdGVuZXIoJ3VwZGF0ZScsIGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gcGFyYW0gXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHZhbHVlIG9mIGEgZ2l2ZW4gcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEByZXR1cm5zIHtNaXhlZH0gLSBUaGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgZ2V0VmFsdWUobmFtZSkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtc1tuYW1lXS52YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIHZhbHVlIG9mIGEgcGFyYW1ldGVyICh1c2VkIHdoZW4gYG9wdGlvbnMuaGFzR1VJPXRydWVgKVxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsIC0gTmV3IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3NlbmRUb1NlcnZlcj10cnVlXSAtIEZsYWcgd2hldGhlciB0aGUgdmFsdWUgc2hvdWxkIGJlXG4gICAqICBwcm9wYWdhdGUgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHVwZGF0ZShuYW1lLCB2YWwsIHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICBjb25zdCBwYXJhbSA9IHRoaXMucGFyYW1zW25hbWVdO1xuXG4gICAgaWYgKHBhcmFtKSB7XG4gICAgICBwYXJhbS51cGRhdGUodmFsLCBzZW5kVG9TZXJ2ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBzaGFyZWQgcGFyYW1ldGVyIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2NyZWF0ZVBhcmFtKGluaXQpIHtcbiAgICBsZXQgcGFyYW0gPSBudWxsO1xuXG4gICAgc3dpdGNoIChpbml0LnR5cGUpIHtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICBwYXJhbSA9IG5ldyBfQm9vbGVhblBhcmFtKHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdlbnVtJzpcbiAgICAgICAgcGFyYW0gPSBuZXcgX0VudW1QYXJhbSh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQub3B0aW9ucywgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBwYXJhbSA9IG5ldyBfTnVtYmVyUGFyYW0odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0Lm1pbiwgaW5pdC5tYXgsIGluaXQuc3RlcCwgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgcGFyYW0gPSBuZXcgX1RleHRQYXJhbSh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAndHJpZ2dlcic6XG4gICAgICAgIHBhcmFtID0gbmV3IF9UcmlnZ2VyUGFyYW0odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmFtO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNoYXJlZFBhcmFtcyk7XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXJlZFBhcmFtcztcbiJdfQ==