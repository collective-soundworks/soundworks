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

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_Param).call(this));

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

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_BooleanParam).call(this, control, 'boolean', name, label));

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

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_EnumParam).call(this, control, 'enum', name, label));

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

    var _this4 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_NumberParam).call(this, control, 'number', name, label));

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

    var _this5 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_TextParam).call(this, control, 'text', name, label));

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
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_TriggerParam).call(this, control, 'trigger', name, label));
  }

  (0, _createClass3.default)(_TriggerParam, [{
    key: 'set',
    value: function set(val) {/* nothing to set here */}
  }]);
  return _TriggerParam;
}(_Param);

var SERVICE_ID = 'service:shared-params';

/**
 * Interface of the client `'shared-params'` service.
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
 * The service is espacially usefull if a special client is defined with the
 * `hasGUI` option set to true, allowing to create a special client aimed at
 * controlling the different parameters of the experience.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.SharedParams}*__
 *
 * @param {Object} options
 * @param {Boolean} [options.hasGui=true] - Defines whether the service should display
 *  a GUI. If set to `true`, the service never set its `ready` signal to true and
 *  the client application stay in this state forever. The option should then be
 *  used create special clients (sometimes called `conductor`) aimed at
 *  controlling application parameters in real time.
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.control = this.require('shared-params');
 * // when the experience starts, listen for parameter updates
 * this.control.addParamListener('synth:gain', (value) => {
 *   this.synth.setGain(value);
 * });
 */

var SharedParams = function (_Service) {
  (0, _inherits3.default)(SharedParams, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function SharedParams() {
    (0, _classCallCheck3.default)(this, SharedParams);

    var _this7 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SharedParams).call(this, SERVICE_ID, true));

    var defaults = { hasGui: false };
    _this7.configure(defaults);

    /** @private */
    // this._guiOptions = {};

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

      // if (this.options.hasGui)
      //   this.view = this.createView();
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(SharedParams.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.send('request');

      this.receive('init', this._onInitResponse);
      this.receive('update', this._onUpdateResponse);
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(SharedParams.prototype), 'stop', this).call(this);
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
//# sourceMappingURL=data:application/json;base64,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InNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLyogQ09OVFJPTCBVTklUU1xuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1BhcmFtIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgdHlwZSwgbmFtZSwgbGFiZWwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY29udHJvbCA9IGNvbnRyb2w7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIF9wcm9wYWdhdGUoc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgIHRoaXMuZW1pdCgndXBkYXRlJywgdGhpcy52YWx1ZSk7IC8vIGNhbGwgZXZlbnQgbGlzdGVuZXJzXG5cbiAgICBpZiAoc2VuZFRvU2VydmVyKVxuICAgICAgdGhpcy5jb250cm9sLnNlbmQoJ3VwZGF0ZScsIHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7IC8vIHNlbmQgdG8gc2VydmVyXG5cbiAgICB0aGlzLmNvbnRyb2wuZW1pdCgndXBkYXRlJywgdGhpcy5uYW1lLCB0aGlzLnZhbHVlKTsgLy8gY2FsbCBjb250cm9sIGxpc3RlbmVyc1xuICB9XG5cbiAgdXBkYXRlKHZhbCwgc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgIHRoaXMuc2V0KHZhbCk7XG4gICAgdGhpcy5fcHJvcGFnYXRlKHNlbmRUb1NlcnZlcik7XG4gIH1cbn1cblxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9Cb29sZWFuUGFyYW0gZXh0ZW5kcyBfUGFyYW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgaW5pdCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdib29sZWFuJywgbmFtZSwgbGFiZWwpO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfRW51bVBhcmFtIGV4dGVuZHMgX1BhcmFtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIG9wdGlvbnMsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAnZW51bScsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIGxldCBpbmRleCA9IHRoaXMub3B0aW9ucy5pbmRleE9mKHZhbCk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfTnVtYmVyUGFyYW0gZXh0ZW5kcyBfUGFyYW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAnbnVtYmVyJywgbmFtZSwgbGFiZWwpO1xuICAgIHRoaXMubWluID0gbWluO1xuICAgIHRoaXMubWF4ID0gbWF4O1xuICAgIHRoaXMuc3RlcCA9IHN0ZXA7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IE1hdGgubWluKHRoaXMubWF4LCBNYXRoLm1heCh0aGlzLm1pbiwgdmFsKSk7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfVGV4dFBhcmFtIGV4dGVuZHMgX1BhcmFtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAndGV4dCcsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RyaWdnZXJQYXJhbSBleHRlbmRzIF9QYXJhbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3RyaWdnZXInLCBuYW1lLCBsYWJlbCk7XG4gIH1cblxuICBzZXQodmFsKSB7IC8qIG5vdGhpbmcgdG8gc2V0IGhlcmUgKi8gfVxufVxuXG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnNoYXJlZC1wYXJhbXMnO1xuXG4vKipcbiAqIEludGVyZmFjZSBvZiB0aGUgY2xpZW50IGAnc2hhcmVkLXBhcmFtcydgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGlzIHVzZWQgdG8gbWFpbnRhaW4gYW5kIHVwZGF0ZSBnbG9iYWwgcGFyYW1ldGVycyB1c2VkIGFtb25nXG4gKiBhbGwgY29ubmVjdGVkIGNsaWVudHMuIEVhY2ggZGVmaW5lZCBwYXJhbWV0ZXIgY2FuIGJlIG9mIHRoZSBmb2xsb3dpbmdcbiAqIGRhdGEgdHlwZXM6XG4gKiAtIGJvb2xlYW5cbiAqIC0gZW51bVxuICogLSBudW1iZXJcbiAqIC0gdGV4dFxuICogLSB0cmlnZ2VyXG4gKlxuICogVGhpcyB0eXBlIGFuZCBzcGVjaWZpYyBhdHRyaWJ1dGVzIG9mIGFuIHBhcmFtZXRlciBpcyBjb25maWd1cmVkIHNlcnZlciBzaWRlLlxuICogVGhlIHNlcnZpY2UgaXMgZXNwYWNpYWxseSB1c2VmdWxsIGlmIGEgc3BlY2lhbCBjbGllbnQgaXMgZGVmaW5lZCB3aXRoIHRoZVxuICogYGhhc0dVSWAgb3B0aW9uIHNldCB0byB0cnVlLCBhbGxvd2luZyB0byBjcmVhdGUgYSBzcGVjaWFsIGNsaWVudCBhaW1lZCBhdFxuICogY29udHJvbGxpbmcgdGhlIGRpZmZlcmVudCBwYXJhbWV0ZXJzIG9mIHRoZSBleHBlcmllbmNlLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5TaGFyZWRQYXJhbXN9Kl9fXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuaGFzR3VpPXRydWVdIC0gRGVmaW5lcyB3aGV0aGVyIHRoZSBzZXJ2aWNlIHNob3VsZCBkaXNwbGF5XG4gKiAgYSBHVUkuIElmIHNldCB0byBgdHJ1ZWAsIHRoZSBzZXJ2aWNlIG5ldmVyIHNldCBpdHMgYHJlYWR5YCBzaWduYWwgdG8gdHJ1ZSBhbmRcbiAqICB0aGUgY2xpZW50IGFwcGxpY2F0aW9uIHN0YXkgaW4gdGhpcyBzdGF0ZSBmb3JldmVyLiBUaGUgb3B0aW9uIHNob3VsZCB0aGVuIGJlXG4gKiAgdXNlZCBjcmVhdGUgc3BlY2lhbCBjbGllbnRzIChzb21ldGltZXMgY2FsbGVkIGBjb25kdWN0b3JgKSBhaW1lZCBhdFxuICogIGNvbnRyb2xsaW5nIGFwcGxpY2F0aW9uIHBhcmFtZXRlcnMgaW4gcmVhbCB0aW1lLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuY29udHJvbCA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLXBhcmFtcycpO1xuICogLy8gd2hlbiB0aGUgZXhwZXJpZW5jZSBzdGFydHMsIGxpc3RlbiBmb3IgcGFyYW1ldGVyIHVwZGF0ZXNcbiAqIHRoaXMuY29udHJvbC5hZGRQYXJhbUxpc3RlbmVyKCdzeW50aDpnYWluJywgKHZhbHVlKSA9PiB7XG4gKiAgIHRoaXMuc3ludGguc2V0R2Fpbih2YWx1ZSk7XG4gKiB9KTtcbiAqL1xuY2xhc3MgU2hhcmVkUGFyYW1zIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHsgaGFzR3VpOiBmYWxzZSB9O1xuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIC8qKiBAcHJpdmF0ZSAqL1xuICAgIC8vIHRoaXMuX2d1aU9wdGlvbnMgPSB7fTtcblxuICAgIHRoaXMuX29uSW5pdFJlc3BvbnNlID0gdGhpcy5fb25Jbml0UmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblVwZGF0ZVJlc3BvbnNlID0gdGhpcy5fb25VcGRhdGVSZXNwb25zZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGluaXQoKSB7XG4gICAgLyoqXG4gICAgICogRGljdGlvbmFyeSBvZiBhbGwgdGhlIHBhcmFtZXRlcnMgYW5kIGNvbW1hbmRzLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnBhcmFtcyA9IHt9O1xuXG4gICAgLy8gaWYgKHRoaXMub3B0aW9ucy5oYXNHdWkpXG4gICAgLy8gICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdpbml0JywgdGhpcy5fb25Jbml0UmVzcG9uc2UpO1xuICAgIHRoaXMucmVjZWl2ZSgndXBkYXRlJywgdGhpcy5fb25VcGRhdGVSZXNwb25zZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgLy8gZG9uJ3QgcmVtb3ZlICd1cGRhdGUnIGxpc3RlbmVyLCBhcyB0aGUgY29udHJvbCBpcyBydW5uaWcgYXMgYSBiYWNrZ3JvdW5kIHByb2Nlc3NcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdpbml0JywgdGhpcy5fb25Jbml0UmVzcG9uc2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkluaXRSZXNwb25zZShjb25maWcpIHtcbiAgICBjb25maWcuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIGNvbnN0IHBhcmFtID0gdGhpcy5fY3JlYXRlUGFyYW0oZW50cnkpO1xuICAgICAgdGhpcy5wYXJhbXNbcGFyYW0ubmFtZV0gPSBwYXJhbTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25VcGRhdGVSZXNwb25zZShuYW1lLCB2YWwpIHtcbiAgICAvLyB1cGRhdGUsIGJ1dCBkb24ndCBzZW5kIGJhY2sgdG8gc2VydmVyXG4gICAgdGhpcy51cGRhdGUobmFtZSwgdmFsLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRQYXJhbXN+cGFyYW1DYWxsYmFja1xuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAtIFVwZGF0ZWQgdmFsdWUgb2YgdGhlIHNoYXJlZCBwYXJhbWV0ZXIuXG4gICAqL1xuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdG8gbGlzdGVuIGEgc3BlY2lmaWMgcGFyYW1ldGVyIGNoYW5nZXMuIFRoZSBsaXN0ZW5lciBpcyBjYWxsZWQgYSBmaXJzdFxuICAgKiB0aW1lIHdoZW4gYWRkZWQgdG8gcmV0cmlldmUgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNoYXJlZFBhcmFtc35wYXJhbUNhbGxiYWNrfSBsaXN0ZW5lciAtIENhbGxiYWNrXG4gICAqICB0aGF0IGhhbmRsZSB0aGUgZXZlbnQuXG4gICAqL1xuICBhZGRQYXJhbUxpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgcGFyYW0gPSB0aGlzLnBhcmFtc1tuYW1lXTtcblxuICAgIGlmIChwYXJhbSkge1xuICAgICAgcGFyYW0uYWRkTGlzdGVuZXIoJ3VwZGF0ZScsIGxpc3RlbmVyKTtcblxuICAgICAgaWYgKHBhcmFtLnR5cGUgIT09ICd0cmlnZ2VyJylcbiAgICAgICAgbGlzdGVuZXIocGFyYW0udmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBwYXJhbSBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyIGZyb20gbGlzdGVuaW5nIGEgc3BlY2lmaWMgcGFyYW1ldGVyIGNoYW5nZXMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRQYXJhbXN+cGFyYW1DYWxsYmFja30gbGlzdGVuZXIgLSBUaGVcbiAgICogIGNhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZVBhcmFtTGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBwYXJhbSA9IHRoaXMucGFyYW1zW25hbWVdO1xuXG4gICAgaWYgKHBhcmFtKSB7XG4gICAgICBwYXJhbS5yZW1vdmVMaXN0ZW5lcigndXBkYXRlJywgbGlzdGVuZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBwYXJhbSBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgdmFsdWUgb2YgYSBnaXZlbiBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHJldHVybnMge01peGVkfSAtIFRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBnZXRWYWx1ZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zW25hbWVdLnZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgdmFsdWUgb2YgYSBwYXJhbWV0ZXIgKHVzZWQgd2hlbiBgb3B0aW9ucy5oYXNHVUk9dHJ1ZWApXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge01peGVkfSB2YWwgLSBOZXcgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbc2VuZFRvU2VydmVyPXRydWVdIC0gRmxhZyB3aGV0aGVyIHRoZSB2YWx1ZSBzaG91bGQgYmVcbiAgICogIHByb3BhZ2F0ZSB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbCwgc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgIGNvbnN0IHBhcmFtID0gdGhpcy5wYXJhbXNbbmFtZV07XG5cbiAgICBpZiAocGFyYW0pIHtcbiAgICAgIHBhcmFtLnVwZGF0ZSh2YWwsIHNlbmRUb1NlcnZlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHNoYXJlZCBwYXJhbWV0ZXIgXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfY3JlYXRlUGFyYW0oaW5pdCkge1xuICAgIGxldCBwYXJhbSA9IG51bGw7XG5cbiAgICBzd2l0Y2ggKGluaXQudHlwZSkge1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIHBhcmFtID0gbmV3IF9Cb29sZWFuUGFyYW0odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2VudW0nOlxuICAgICAgICBwYXJhbSA9IG5ldyBfRW51bVBhcmFtKHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC5vcHRpb25zLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHBhcmFtID0gbmV3IF9OdW1iZXJQYXJhbSh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQubWluLCBpbml0Lm1heCwgaW5pdC5zdGVwLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICBwYXJhbSA9IG5ldyBfVGV4dFBhcmFtKHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd0cmlnZ2VyJzpcbiAgICAgICAgcGFyYW0gPSBuZXcgX1RyaWdnZXJQYXJhbSh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyYW07XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2hhcmVkUGFyYW1zKTtcblxuZXhwb3J0IGRlZmF1bHQgU2hhcmVkUGFyYW1zO1xuIl19