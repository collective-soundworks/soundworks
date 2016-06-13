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

    var _this7 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SharedParams).call(this, SERVICE_ID, true));

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
//# sourceMappingURL=data:application/json;base64,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bnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vKiBDT05UUk9MIFVOSVRTXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfUGFyYW0gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCB0eXBlLCBuYW1lLCBsYWJlbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb250cm9sID0gY29udHJvbDtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMudmFsdWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgX3Byb3BhZ2F0ZShzZW5kVG9TZXJ2ZXIgPSB0cnVlKSB7XG4gICAgdGhpcy5lbWl0KCd1cGRhdGUnLCB0aGlzLnZhbHVlKTsgLy8gY2FsbCBldmVudCBsaXN0ZW5lcnNcblxuICAgIGlmIChzZW5kVG9TZXJ2ZXIpXG4gICAgICB0aGlzLmNvbnRyb2wuc2VuZCgndXBkYXRlJywgdGhpcy5uYW1lLCB0aGlzLnZhbHVlKTsgLy8gc2VuZCB0byBzZXJ2ZXJcblxuICAgIHRoaXMuY29udHJvbC5lbWl0KCd1cGRhdGUnLCB0aGlzLm5hbWUsIHRoaXMudmFsdWUpOyAvLyBjYWxsIGNvbnRyb2wgbGlzdGVuZXJzXG4gIH1cblxuICB1cGRhdGUodmFsLCBzZW5kVG9TZXJ2ZXIgPSB0cnVlKSB7XG4gICAgdGhpcy5zZXQodmFsKTtcbiAgICB0aGlzLl9wcm9wYWdhdGUoc2VuZFRvU2VydmVyKTtcbiAgfVxufVxuXG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0Jvb2xlYW5QYXJhbSBleHRlbmRzIF9QYXJhbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBpbml0KSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2Jvb2xlYW4nLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9FbnVtUGFyYW0gZXh0ZW5kcyBfUGFyYW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgb3B0aW9ucywgaW5pdCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdlbnVtJywgbmFtZSwgbGFiZWwpO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5vcHRpb25zLmluZGV4T2YodmFsKTtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsO1xuICAgIH1cbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9OdW1iZXJQYXJhbSBleHRlbmRzIF9QYXJhbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdudW1iZXInLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5taW4gPSBtaW47XG4gICAgdGhpcy5tYXggPSBtYXg7XG4gICAgdGhpcy5zdGVwID0gc3RlcDtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gTWF0aC5taW4odGhpcy5tYXgsIE1hdGgubWF4KHRoaXMubWluLCB2YWwpKTtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UZXh0UGFyYW0gZXh0ZW5kcyBfUGFyYW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgaW5pdCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICd0ZXh0JywgbmFtZSwgbGFiZWwpO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfVHJpZ2dlclBhcmFtIGV4dGVuZHMgX1BhcmFtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwpIHtcbiAgICBzdXBlcihjb250cm9sLCAndHJpZ2dlcicsIG5hbWUsIGxhYmVsKTtcbiAgfVxuXG4gIHNldCh2YWwpIHsgLyogbm90aGluZyB0byBzZXQgaGVyZSAqLyB9XG59XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzaGFyZWQtcGFyYW1zJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdzaGFyZWQtcGFyYW1zJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgaXMgdXNlZCB0byBtYWludGFpbiBhbmQgdXBkYXRlIGdsb2JhbCBwYXJhbWV0ZXJzIHVzZWQgYW1vbmdcbiAqIGFsbCBjb25uZWN0ZWQgY2xpZW50cy4gRWFjaCBkZWZpbmVkIHBhcmFtZXRlciBjYW4gYmUgb2YgdGhlIGZvbGxvd2luZ1xuICogZGF0YSB0eXBlczpcbiAqIC0gYm9vbGVhblxuICogLSBlbnVtXG4gKiAtIG51bWJlclxuICogLSB0ZXh0XG4gKiAtIHRyaWdnZXJcbiAqXG4gKiBUaGlzIHR5cGUgYW5kIHNwZWNpZmljIGF0dHJpYnV0ZXMgb2YgYW4gcGFyYW1ldGVyIGlzIGNvbmZpZ3VyZWQgc2VydmVyIHNpZGUuXG4gKlxuICogVG8gY3JlYXRlIGEgY29udHJvbCBzdXJmYWNlLCBmb3IgdGhpcyBzZXJ2aWNlLCBhbiBkZWRpY2F0ZWQgc2NlbmU6XG4gKiBbYEJhc2ljU2hhcmVkQ29udHJvbGxlcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5CYXNpY1NoYXJlZENvbnRyb2xsZXJ9LFxuICogaXMgYXZhaWxhYmxlXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlNoYXJlZFBhcmFtc30qX19cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLmNvbnRyb2wgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2Ugc3RhcnRzLCBsaXN0ZW4gZm9yIHBhcmFtZXRlciB1cGRhdGVzXG4gKiB0aGlzLmNvbnRyb2wuYWRkUGFyYW1MaXN0ZW5lcignc3ludGg6Z2FpbicsICh2YWx1ZSkgPT4ge1xuICogICB0aGlzLnN5bnRoLnNldEdhaW4odmFsdWUpO1xuICogfSk7XG4gKlxuICogQHNlZSBbYEJhc2ljU2hhcmVkQ29udHJvbGxlcmAgc2NlbmVde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5CYXNpY1NoYXJlZENvbnRyb2xsZXJ9XG4gKi9cbmNsYXNzIFNoYXJlZFBhcmFtcyBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7IGhhc0d1aTogZmFsc2UgfTtcbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9vbkluaXRSZXNwb25zZSA9IHRoaXMuX29uSW5pdFJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25VcGRhdGVSZXNwb25zZSA9IHRoaXMuX29uVXBkYXRlUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbml0KCkge1xuICAgIC8qKlxuICAgICAqIERpY3Rpb25hcnkgb2YgYWxsIHRoZSBwYXJhbWV0ZXJzIGFuZCBjb21tYW5kcy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5wYXJhbXMgPSB7fTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdpbml0JywgdGhpcy5fb25Jbml0UmVzcG9uc2UpO1xuICAgIHRoaXMucmVjZWl2ZSgndXBkYXRlJywgdGhpcy5fb25VcGRhdGVSZXNwb25zZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgLy8gZG9uJ3QgcmVtb3ZlICd1cGRhdGUnIGxpc3RlbmVyLCBhcyB0aGUgY29udHJvbCBpcyBydW5uaWcgYXMgYSBiYWNrZ3JvdW5kIHByb2Nlc3NcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdpbml0JywgdGhpcy5fb25Jbml0UmVzcG9uc2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkluaXRSZXNwb25zZShjb25maWcpIHtcbiAgICBjb25maWcuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIGNvbnN0IHBhcmFtID0gdGhpcy5fY3JlYXRlUGFyYW0oZW50cnkpO1xuICAgICAgdGhpcy5wYXJhbXNbcGFyYW0ubmFtZV0gPSBwYXJhbTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25VcGRhdGVSZXNwb25zZShuYW1lLCB2YWwpIHtcbiAgICAvLyB1cGRhdGUsIGJ1dCBkb24ndCBzZW5kIGJhY2sgdG8gc2VydmVyXG4gICAgdGhpcy51cGRhdGUobmFtZSwgdmFsLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRQYXJhbXN+cGFyYW1DYWxsYmFja1xuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAtIFVwZGF0ZWQgdmFsdWUgb2YgdGhlIHNoYXJlZCBwYXJhbWV0ZXIuXG4gICAqL1xuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdG8gbGlzdGVuIGEgc3BlY2lmaWMgcGFyYW1ldGVyIGNoYW5nZXMuIFRoZSBsaXN0ZW5lciBpcyBjYWxsZWQgYSBmaXJzdFxuICAgKiB0aW1lIHdoZW4gYWRkZWQgdG8gcmV0cmlldmUgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNoYXJlZFBhcmFtc35wYXJhbUNhbGxiYWNrfSBsaXN0ZW5lciAtIENhbGxiYWNrXG4gICAqICB0aGF0IGhhbmRsZSB0aGUgZXZlbnQuXG4gICAqL1xuICBhZGRQYXJhbUxpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgcGFyYW0gPSB0aGlzLnBhcmFtc1tuYW1lXTtcblxuICAgIGlmIChwYXJhbSkge1xuICAgICAgcGFyYW0uYWRkTGlzdGVuZXIoJ3VwZGF0ZScsIGxpc3RlbmVyKTtcblxuICAgICAgaWYgKHBhcmFtLnR5cGUgIT09ICd0cmlnZ2VyJylcbiAgICAgICAgbGlzdGVuZXIocGFyYW0udmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBwYXJhbSBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyIGZyb20gbGlzdGVuaW5nIGEgc3BlY2lmaWMgcGFyYW1ldGVyIGNoYW5nZXMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRQYXJhbXN+cGFyYW1DYWxsYmFja30gbGlzdGVuZXIgLSBUaGVcbiAgICogIGNhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZVBhcmFtTGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBwYXJhbSA9IHRoaXMucGFyYW1zW25hbWVdO1xuXG4gICAgaWYgKHBhcmFtKSB7XG4gICAgICBwYXJhbS5yZW1vdmVMaXN0ZW5lcigndXBkYXRlJywgbGlzdGVuZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBwYXJhbSBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgdmFsdWUgb2YgYSBnaXZlbiBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHJldHVybnMge01peGVkfSAtIFRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBnZXRWYWx1ZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zW25hbWVdLnZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgdmFsdWUgb2YgYSBwYXJhbWV0ZXIgKHVzZWQgd2hlbiBgb3B0aW9ucy5oYXNHVUk9dHJ1ZWApXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge01peGVkfSB2YWwgLSBOZXcgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbc2VuZFRvU2VydmVyPXRydWVdIC0gRmxhZyB3aGV0aGVyIHRoZSB2YWx1ZSBzaG91bGQgYmVcbiAgICogIHByb3BhZ2F0ZSB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbCwgc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgIGNvbnN0IHBhcmFtID0gdGhpcy5wYXJhbXNbbmFtZV07XG5cbiAgICBpZiAocGFyYW0pIHtcbiAgICAgIHBhcmFtLnVwZGF0ZSh2YWwsIHNlbmRUb1NlcnZlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHNoYXJlZCBwYXJhbWV0ZXIgXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfY3JlYXRlUGFyYW0oaW5pdCkge1xuICAgIGxldCBwYXJhbSA9IG51bGw7XG5cbiAgICBzd2l0Y2ggKGluaXQudHlwZSkge1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIHBhcmFtID0gbmV3IF9Cb29sZWFuUGFyYW0odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2VudW0nOlxuICAgICAgICBwYXJhbSA9IG5ldyBfRW51bVBhcmFtKHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC5vcHRpb25zLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHBhcmFtID0gbmV3IF9OdW1iZXJQYXJhbSh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQubWluLCBpbml0Lm1heCwgaW5pdC5zdGVwLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICBwYXJhbSA9IG5ldyBfVGV4dFBhcmFtKHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd0cmlnZ2VyJzpcbiAgICAgICAgcGFyYW0gPSBuZXcgX1RyaWdnZXJQYXJhbSh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyYW07XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2hhcmVkUGFyYW1zKTtcblxuZXhwb3J0IGRlZmF1bHQgU2hhcmVkUGFyYW1zO1xuIl19