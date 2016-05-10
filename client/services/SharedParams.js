'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _wavesBasicControllers = require('waves-basic-controllers');

var basicControllers = _interopRequireWildcard(_wavesBasicControllers);

var _events = require('events');

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

basicControllers.disableStyles();

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

/* --------------------------------------------------------- */
/* GUIs
/* --------------------------------------------------------- */

/** @private */


var _BooleanGui = function () {
  function _BooleanGui($container, param, guiOptions) {
    (0, _classCallCheck3.default)(this, _BooleanGui);
    var label = param.label;
    var value = param.value;


    this.controller = new basicControllers.Toggle(label, value);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', function (value) {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + param.name + ':' + value + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      param.update(value);
    });
  }

  (0, _createClass3.default)(_BooleanGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);
  return _BooleanGui;
}();

/** @private */


var _EnumGui = function () {
  function _EnumGui($container, param, guiOptions) {
    (0, _classCallCheck3.default)(this, _EnumGui);
    var label = param.label;
    var options = param.options;
    var value = param.value;


    var ctor = guiOptions.type === 'buttons' ? basicControllers.SelectButtons : basicControllers.SelectList;

    this.controller = new ctor(label, options, value);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', function (value) {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + param.name + ':' + value + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      param.update(value);
    });
  }

  (0, _createClass3.default)(_EnumGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);
  return _EnumGui;
}();

/** @private */


var _NumberGui = function () {
  function _NumberGui($container, param, guiOptions) {
    (0, _classCallCheck3.default)(this, _NumberGui);
    var label = param.label;
    var min = param.min;
    var max = param.max;
    var step = param.step;
    var value = param.value;


    if (guiOptions.type === 'slider') this.controller = new basicControllers.Slider(label, min, max, step, value, guiOptions.param, guiOptions.size);else this.controller = new basicControllers.NumberBox(label, min, max, step, value);

    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', function (value) {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + param.name + ':' + value + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      param.update(value);
    });
  }

  (0, _createClass3.default)(_NumberGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);
  return _NumberGui;
}();

/** @private */


var _TextGui = function () {
  function _TextGui($container, param, guiOptions) {
    (0, _classCallCheck3.default)(this, _TextGui);
    var label = param.label;
    var value = param.value;


    this.controller = new basicControllers.Text(label, value, guiOptions.readOnly);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    if (!guiOptions.readOnly) {
      this.controller.on('change', function () {
        if (guiOptions.confirm) {
          var msg = 'Are you sure you want to propagate "' + param.name + '"';
          if (!window.confirm(msg)) {
            return;
          }
        }

        param.update();
      });
    }
  }

  (0, _createClass3.default)(_TextGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);
  return _TextGui;
}();

/** @private */


var _TriggerGui = function () {
  function _TriggerGui($container, param, guiOptions) {
    (0, _classCallCheck3.default)(this, _TriggerGui);
    var label = param.label;


    this.controller = new basicControllers.Buttons('', [label]);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', function () {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + param.name + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      param.update();
    });
  }

  (0, _createClass3.default)(_TriggerGui, [{
    key: 'set',
    value: function set(val) {/* nothing to set here */}
  }]);
  return _TriggerGui;
}();

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
    _this7._guiOptions = {};

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

      if (this.options.hasGui) this.view = this.createView();
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

      this.show();

      config.forEach(function (entry) {
        var param = _this8._createParam(entry);
        _this8.params[param.name] = param;

        if (_this8.view) _this8._createGui(_this8.view, param);
      });

      if (!this.options.hasGui) this.ready();
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

    /**
     * Configure the GUI for a given parameter, this method only makes sens if
     * `options.hasGUI=true`.
     * @param {String} name - Name of the parameter to configure.
     * @param {Object} options - Options to configure the parameter GUI.
     * @param {String} options.type - Type of GUI to use. Each type of parameter can
     *  used with different GUI according to their type and comes with acceptable
     *  default values.
     * @param {Boolean} [options.show=true] - Display or not the GUI for this parameter.
     * @param {Boolean} [options.confirm=false] - Ask for confirmation when the value changes.
     */

  }, {
    key: 'setGuiOptions',
    value: function setGuiOptions(name, options) {
      this._guiOptions[name] = options;
    }

    /** @private */

  }, {
    key: '_createGui',
    value: function _createGui(view, param) {
      var config = (0, _assign2.default)({
        show: true,
        confirm: false
      }, this._guiOptions[param.name]);

      if (config.show === false) return null;

      var gui = null;
      var $container = this.view.$el;

      switch (param.type) {
        case 'boolean':
          gui = new _BooleanGui($container, param, config); // `Toggle`
          break;
        case 'enum':
          gui = new _EnumGui($container, param, config); // `SelectList` or `SelectButtons`
          break;
        case 'number':
          gui = new _NumberGui($container, param, config); // `NumberBox` or `Slider`
          break;
        case 'text':
          gui = new _TextGui($container, param, config); // `Text`
          break;
        case 'trigger':
          gui = new _TriggerGui($container, param, config);
          break;
      }

      param.addListener('update', function (val) {
        return gui.set(val);
      });

      return gui;
    }
  }]);
  return SharedParams;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, SharedParams);

exports.default = SharedParams;
//# sourceMappingURL=data:application/json;base64,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QTJCLEtBQTNCLEVBQWtDLE1BQWxDLENBQU47QUFERjtBQVBGLGFBVU8sTUFBTDtBQUNFLGdCQUFNLElBQUksUUFBSixDQUFhLFVBQWIsRUFBeUIsS0FBekIsRUFBZ0MsTUFBaEMsQ0FBTjtBQURGO0FBVkYsYUFhTyxTQUFMO0FBQ0UsZ0JBQU0sSUFBSSxXQUFKLENBQWdCLFVBQWhCLEVBQTRCLEtBQTVCLEVBQW1DLE1BQW5DLENBQU4sQ0FERjtBQUVFLGdCQUZGO0FBYkYsT0FYc0I7O0FBNkJ0QixZQUFNLFdBQU4sQ0FBa0IsUUFBbEIsRUFBNEIsVUFBQyxHQUFEO2VBQVMsSUFBSSxHQUFKLENBQVEsR0FBUjtPQUFULENBQTVCLENBN0JzQjs7QUErQnRCLGFBQU8sR0FBUCxDQS9Cc0I7OztTQXRMcEI7OztBQXlOTix5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLFlBQXBDOztrQkFFZSIsImZpbGUiOiJTaGFyZWRQYXJhbXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBiYXNpY0NvbnRyb2xsZXJzIGZyb20gJ3dhdmVzLWJhc2ljLWNvbnRyb2xsZXJzJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5cbmJhc2ljQ29udHJvbGxlcnMuZGlzYWJsZVN0eWxlcygpO1xuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8qIENPTlRST0wgVU5JVFNcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9QYXJhbSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIHR5cGUsIG5hbWUsIGxhYmVsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmNvbnRyb2wgPSBjb250cm9sO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgdGhpcy52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICBfcHJvcGFnYXRlKHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICB0aGlzLmVtaXQoJ3VwZGF0ZScsIHRoaXMudmFsdWUpOyAvLyBjYWxsIGV2ZW50IGxpc3RlbmVyc1xuXG4gICAgaWYgKHNlbmRUb1NlcnZlcilcbiAgICAgIHRoaXMuY29udHJvbC5zZW5kKCd1cGRhdGUnLCB0aGlzLm5hbWUsIHRoaXMudmFsdWUpOyAvLyBzZW5kIHRvIHNlcnZlclxuXG4gICAgdGhpcy5jb250cm9sLmVtaXQoJ3VwZGF0ZScsIHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7IC8vIGNhbGwgY29udHJvbCBsaXN0ZW5lcnNcbiAgfVxuXG4gIHVwZGF0ZSh2YWwsIHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICB0aGlzLnNldCh2YWwpO1xuICAgIHRoaXMuX3Byb3BhZ2F0ZShzZW5kVG9TZXJ2ZXIpO1xuICB9XG59XG5cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQm9vbGVhblBhcmFtIGV4dGVuZHMgX1BhcmFtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAnYm9vbGVhbicsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0VudW1QYXJhbSBleHRlbmRzIF9QYXJhbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0KSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2VudW0nLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLm9wdGlvbnMuaW5kZXhPZih2YWwpO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gICAgfVxuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX051bWJlclBhcmFtIGV4dGVuZHMgX1BhcmFtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0KSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ251bWJlcicsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLm1pbiA9IG1pbjtcbiAgICB0aGlzLm1heCA9IG1heDtcbiAgICB0aGlzLnN0ZXAgPSBzdGVwO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSBNYXRoLm1pbih0aGlzLm1heCwgTWF0aC5tYXgodGhpcy5taW4sIHZhbCkpO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RleHRQYXJhbSBleHRlbmRzIF9QYXJhbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBpbml0KSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3RleHQnLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UcmlnZ2VyUGFyYW0gZXh0ZW5kcyBfUGFyYW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICd0cmlnZ2VyJywgbmFtZSwgbGFiZWwpO1xuICB9XG5cbiAgc2V0KHZhbCkgeyAvKiBub3RoaW5nIHRvIHNldCBoZXJlICovIH1cbn1cblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vKiBHVUlzXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQm9vbGVhbkd1aSB7XG4gIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIHBhcmFtLCBndWlPcHRpb25zKSB7XG4gICAgY29uc3QgeyBsYWJlbCwgdmFsdWUgfSA9IHBhcmFtO1xuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuVG9nZ2xlKGxhYmVsLCB2YWx1ZSk7XG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAodmFsdWUpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3BhcmFtLm5hbWV9OiR7dmFsdWV9XCJgO1xuICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICB9XG5cbiAgICAgIHBhcmFtLnVwZGF0ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0VudW1HdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCBwYXJhbSwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIG9wdGlvbnMsIHZhbHVlIH0gPSBwYXJhbTtcblxuICAgIGNvbnN0IGN0b3IgPSBndWlPcHRpb25zLnR5cGUgPT09ICdidXR0b25zJyA/XG4gICAgICBiYXNpY0NvbnRyb2xsZXJzLlNlbGVjdEJ1dHRvbnMgOiBiYXNpY0NvbnRyb2xsZXJzLlNlbGVjdExpc3RcblxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBjdG9yKGxhYmVsLCBvcHRpb25zLCB2YWx1ZSk7XG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAodmFsdWUpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3BhcmFtLm5hbWV9OiR7dmFsdWV9XCJgO1xuICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICB9XG5cbiAgICAgIHBhcmFtLnVwZGF0ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX051bWJlckd1aSB7XG4gIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIHBhcmFtLCBndWlPcHRpb25zKSB7XG4gICAgY29uc3QgeyBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIHZhbHVlIH0gPSBwYXJhbTtcblxuICAgIGlmIChndWlPcHRpb25zLnR5cGUgPT09ICdzbGlkZXInKVxuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuU2xpZGVyKGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdmFsdWUsIGd1aU9wdGlvbnMucGFyYW0sIGd1aU9wdGlvbnMuc2l6ZSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuTnVtYmVyQm94KGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdmFsdWUpO1xuXG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAodmFsdWUpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3BhcmFtLm5hbWV9OiR7dmFsdWV9XCJgO1xuICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICB9XG5cbiAgICAgIHBhcmFtLnVwZGF0ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RleHRHdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCBwYXJhbSwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIHZhbHVlIH0gPSBwYXJhbTtcblxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBiYXNpY0NvbnRyb2xsZXJzLlRleHQobGFiZWwsIHZhbHVlLCBndWlPcHRpb25zLnJlYWRPbmx5KTtcbiAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5yZW5kZXIoKSk7XG4gICAgdGhpcy5jb250cm9sbGVyLm9uUmVuZGVyKCk7XG5cbiAgICBpZiAoIWd1aU9wdGlvbnMucmVhZE9ubHkpIHtcbiAgICAgIHRoaXMuY29udHJvbGxlci5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgICBpZiAoZ3VpT3B0aW9ucy5jb25maXJtKSB7XG4gICAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3BhcmFtLm5hbWV9XCJgO1xuICAgICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgICAgfVxuXG4gICAgICAgIHBhcmFtLnVwZGF0ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UcmlnZ2VyR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgcGFyYW0sIGd1aU9wdGlvbnMpIHtcbiAgICBjb25zdCB7IGxhYmVsIH0gPSBwYXJhbTtcblxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBiYXNpY0NvbnRyb2xsZXJzLkJ1dHRvbnMoJycsIFtsYWJlbF0pO1xuICAgICRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLnJlbmRlcigpKTtcbiAgICB0aGlzLmNvbnRyb2xsZXIub25SZW5kZXIoKTtcblxuICAgIHRoaXMuY29udHJvbGxlci5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7cGFyYW0ubmFtZX1cImA7XG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgIH1cblxuICAgICAgcGFyYW0udXBkYXRlKCk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsKSB7IC8qIG5vdGhpbmcgdG8gc2V0IGhlcmUgKi8gfVxufVxuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzaGFyZWQtcGFyYW1zJztcblxuLyoqXG4gKiBJbnRlcmZhY2Ugb2YgdGhlIGNsaWVudCBgJ3NoYXJlZC1wYXJhbXMnYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBpcyB1c2VkIHRvIG1haW50YWluIGFuZCB1cGRhdGUgZ2xvYmFsIHBhcmFtZXRlcnMgdXNlZCBhbW9uZ1xuICogYWxsIGNvbm5lY3RlZCBjbGllbnRzLiBFYWNoIGRlZmluZWQgcGFyYW1ldGVyIGNhbiBiZSBvZiB0aGUgZm9sbG93aW5nXG4gKiBkYXRhIHR5cGVzOlxuICogLSBib29sZWFuXG4gKiAtIGVudW1cbiAqIC0gbnVtYmVyXG4gKiAtIHRleHRcbiAqIC0gdHJpZ2dlclxuICpcbiAqIFRoaXMgdHlwZSBhbmQgc3BlY2lmaWMgYXR0cmlidXRlcyBvZiBhbiBwYXJhbWV0ZXIgaXMgY29uZmlndXJlZCBzZXJ2ZXIgc2lkZS5cbiAqIFRoZSBzZXJ2aWNlIGlzIGVzcGFjaWFsbHkgdXNlZnVsbCBpZiBhIHNwZWNpYWwgY2xpZW50IGlzIGRlZmluZWQgd2l0aCB0aGVcbiAqIGBoYXNHVUlgIG9wdGlvbiBzZXQgdG8gdHJ1ZSwgYWxsb3dpbmcgdG8gY3JlYXRlIGEgc3BlY2lhbCBjbGllbnQgYWltZWQgYXRcbiAqIGNvbnRyb2xsaW5nIHRoZSBkaWZmZXJlbnQgcGFyYW1ldGVycyBvZiB0aGUgZXhwZXJpZW5jZS5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuU2hhcmVkUGFyYW1zfSpfX1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmhhc0d1aT10cnVlXSAtIERlZmluZXMgd2hldGhlciB0aGUgc2VydmljZSBzaG91bGQgZGlzcGxheVxuICogIGEgR1VJLiBJZiBzZXQgdG8gYHRydWVgLCB0aGUgc2VydmljZSBuZXZlciBzZXQgaXRzIGByZWFkeWAgc2lnbmFsIHRvIHRydWUgYW5kXG4gKiAgdGhlIGNsaWVudCBhcHBsaWNhdGlvbiBzdGF5IGluIHRoaXMgc3RhdGUgZm9yZXZlci4gVGhlIG9wdGlvbiBzaG91bGQgdGhlbiBiZVxuICogIHVzZWQgY3JlYXRlIHNwZWNpYWwgY2xpZW50cyAoc29tZXRpbWVzIGNhbGxlZCBgY29uZHVjdG9yYCkgYWltZWQgYXRcbiAqICBjb250cm9sbGluZyBhcHBsaWNhdGlvbiBwYXJhbWV0ZXJzIGluIHJlYWwgdGltZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLmNvbnRyb2wgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2Ugc3RhcnRzLCBsaXN0ZW4gZm9yIHBhcmFtZXRlciB1cGRhdGVzXG4gKiB0aGlzLmNvbnRyb2wuYWRkUGFyYW1MaXN0ZW5lcignc3ludGg6Z2FpbicsICh2YWx1ZSkgPT4ge1xuICogICB0aGlzLnN5bnRoLnNldEdhaW4odmFsdWUpO1xuICogfSk7XG4gKi9cbmNsYXNzIFNoYXJlZFBhcmFtcyBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7IGhhc0d1aTogZmFsc2UgfTtcbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICAvKiogQHByaXZhdGUgKi9cbiAgICB0aGlzLl9ndWlPcHRpb25zID0ge307XG5cbiAgICB0aGlzLl9vbkluaXRSZXNwb25zZSA9IHRoaXMuX29uSW5pdFJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25VcGRhdGVSZXNwb25zZSA9IHRoaXMuX29uVXBkYXRlUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbml0KCkge1xuICAgIC8qKlxuICAgICAqIERpY3Rpb25hcnkgb2YgYWxsIHRoZSBwYXJhbWV0ZXJzIGFuZCBjb21tYW5kcy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5wYXJhbXMgPSB7fTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaGFzR3VpKVxuICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnaW5pdCcsIHRoaXMuX29uSW5pdFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3VwZGF0ZScsIHRoaXMuX29uVXBkYXRlUmVzcG9uc2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICAgIC8vIGRvbid0IHJlbW92ZSAndXBkYXRlJyBsaXN0ZW5lciwgYXMgdGhlIGNvbnRyb2wgaXMgcnVubmlnIGFzIGEgYmFja2dyb3VuZCBwcm9jZXNzXG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignaW5pdCcsIHRoaXMuX29uSW5pdFJlc3BvbnNlKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Jbml0UmVzcG9uc2UoY29uZmlnKSB7XG4gICAgdGhpcy5zaG93KCk7XG5cbiAgICBjb25maWcuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIGNvbnN0IHBhcmFtID0gdGhpcy5fY3JlYXRlUGFyYW0oZW50cnkpO1xuICAgICAgdGhpcy5wYXJhbXNbcGFyYW0ubmFtZV0gPSBwYXJhbTtcblxuICAgICAgaWYgKHRoaXMudmlldylcbiAgICAgICAgdGhpcy5fY3JlYXRlR3VpKHRoaXMudmlldywgcGFyYW0pO1xuICAgIH0pO1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuaGFzR3VpKVxuICAgICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblVwZGF0ZVJlc3BvbnNlKG5hbWUsIHZhbCkge1xuICAgIC8vIHVwZGF0ZSwgYnV0IGRvbid0IHNlbmQgYmFjayB0byBzZXJ2ZXJcbiAgICB0aGlzLnVwZGF0ZShuYW1lLCB2YWwsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNoYXJlZFBhcmFtc35wYXJhbUNhbGxiYWNrXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIC0gVXBkYXRlZCB2YWx1ZSBvZiB0aGUgc2hhcmVkIHBhcmFtZXRlci5cbiAgICovXG4gIC8qKlxuICAgKiBBZGQgYSBsaXN0ZW5lciB0byBsaXN0ZW4gYSBzcGVjaWZpYyBwYXJhbWV0ZXIgY2hhbmdlcy4gVGhlIGxpc3RlbmVyIGlzIGNhbGxlZCBhIGZpcnN0XG4gICAqIHRpbWUgd2hlbiBhZGRlZCB0byByZXRyaWV2ZSB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkUGFyYW1zfnBhcmFtQ2FsbGJhY2t9IGxpc3RlbmVyIC0gQ2FsbGJhY2tcbiAgICogIHRoYXQgaGFuZGxlIHRoZSBldmVudC5cbiAgICovXG4gIGFkZFBhcmFtTGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBwYXJhbSA9IHRoaXMucGFyYW1zW25hbWVdO1xuXG4gICAgaWYgKHBhcmFtKSB7XG4gICAgICBwYXJhbS5hZGRMaXN0ZW5lcigndXBkYXRlJywgbGlzdGVuZXIpO1xuXG4gICAgICBpZiAocGFyYW0udHlwZSAhPT0gJ3RyaWdnZXInKVxuICAgICAgICBsaXN0ZW5lcihwYXJhbS52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHBhcmFtIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGlzdGVuZXIgZnJvbSBsaXN0ZW5pbmcgYSBzcGVjaWZpYyBwYXJhbWV0ZXIgY2hhbmdlcy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNoYXJlZFBhcmFtc35wYXJhbUNhbGxiYWNrfSBsaXN0ZW5lciAtIFRoZVxuICAgKiAgY2FsbGJhY2sgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlUGFyYW1MaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IHBhcmFtID0gdGhpcy5wYXJhbXNbbmFtZV07XG5cbiAgICBpZiAocGFyYW0pIHtcbiAgICAgIHBhcmFtLnJlbW92ZUxpc3RlbmVyKCd1cGRhdGUnLCBsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHBhcmFtIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSB2YWx1ZSBvZiBhIGdpdmVuIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcmV0dXJucyB7TWl4ZWR9IC0gVGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIGdldFZhbHVlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXNbbmFtZV0udmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSB2YWx1ZSBvZiBhIHBhcmFtZXRlciAodXNlZCB3aGVuIGBvcHRpb25zLmhhc0dVST10cnVlYClcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbCAtIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtzZW5kVG9TZXJ2ZXI9dHJ1ZV0gLSBGbGFnIHdoZXRoZXIgdGhlIHZhbHVlIHNob3VsZCBiZVxuICAgKiAgcHJvcGFnYXRlIHRvIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICB1cGRhdGUobmFtZSwgdmFsLCBzZW5kVG9TZXJ2ZXIgPSB0cnVlKSB7XG4gICAgY29uc3QgcGFyYW0gPSB0aGlzLnBhcmFtc1tuYW1lXTtcblxuICAgIGlmIChwYXJhbSkge1xuICAgICAgcGFyYW0udXBkYXRlKHZhbCwgc2VuZFRvU2VydmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gc2hhcmVkIHBhcmFtZXRlciBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9jcmVhdGVQYXJhbShpbml0KSB7XG4gICAgbGV0IHBhcmFtID0gbnVsbDtcblxuICAgIHN3aXRjaCAoaW5pdC50eXBlKSB7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgcGFyYW0gPSBuZXcgX0Jvb2xlYW5QYXJhbSh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZW51bSc6XG4gICAgICAgIHBhcmFtID0gbmV3IF9FbnVtUGFyYW0odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0Lm9wdGlvbnMsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcGFyYW0gPSBuZXcgX051bWJlclBhcmFtKHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC5taW4sIGluaXQubWF4LCBpbml0LnN0ZXAsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgIHBhcmFtID0gbmV3IF9UZXh0UGFyYW0odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3RyaWdnZXInOlxuICAgICAgICBwYXJhbSA9IG5ldyBfVHJpZ2dlclBhcmFtKHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJhbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgdGhlIEdVSSBmb3IgYSBnaXZlbiBwYXJhbWV0ZXIsIHRoaXMgbWV0aG9kIG9ubHkgbWFrZXMgc2VucyBpZlxuICAgKiBgb3B0aW9ucy5oYXNHVUk9dHJ1ZWAuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRvIGNvbmZpZ3VyZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgcGFyYW1ldGVyIEdVSS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMudHlwZSAtIFR5cGUgb2YgR1VJIHRvIHVzZS4gRWFjaCB0eXBlIG9mIHBhcmFtZXRlciBjYW5cbiAgICogIHVzZWQgd2l0aCBkaWZmZXJlbnQgR1VJIGFjY29yZGluZyB0byB0aGVpciB0eXBlIGFuZCBjb21lcyB3aXRoIGFjY2VwdGFibGVcbiAgICogIGRlZmF1bHQgdmFsdWVzLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNob3c9dHJ1ZV0gLSBEaXNwbGF5IG9yIG5vdCB0aGUgR1VJIGZvciB0aGlzIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5jb25maXJtPWZhbHNlXSAtIEFzayBmb3IgY29uZmlybWF0aW9uIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAqL1xuICBzZXRHdWlPcHRpb25zKG5hbWUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLl9ndWlPcHRpb25zW25hbWVdID0gb3B0aW9ucztcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfY3JlYXRlR3VpKHZpZXcsIHBhcmFtKSB7XG4gICAgY29uc3QgY29uZmlnID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgY29uZmlybTogZmFsc2UsXG4gICAgfSwgdGhpcy5fZ3VpT3B0aW9uc1twYXJhbS5uYW1lXSk7XG5cbiAgICBpZiAoY29uZmlnLnNob3cgPT09IGZhbHNlKSByZXR1cm4gbnVsbDtcblxuICAgIGxldCBndWkgPSBudWxsO1xuICAgIGNvbnN0ICRjb250YWluZXIgPSB0aGlzLnZpZXcuJGVsO1xuXG4gICAgc3dpdGNoIChwYXJhbS50eXBlKSB7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgZ3VpID0gbmV3IF9Cb29sZWFuR3VpKCRjb250YWluZXIsIHBhcmFtLCBjb25maWcpOyAvLyBgVG9nZ2xlYFxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2VudW0nOlxuICAgICAgICBndWkgPSBuZXcgX0VudW1HdWkoJGNvbnRhaW5lciwgcGFyYW0sIGNvbmZpZyk7IC8vIGBTZWxlY3RMaXN0YCBvciBgU2VsZWN0QnV0dG9uc2BcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBndWkgPSBuZXcgX051bWJlckd1aSgkY29udGFpbmVyLCBwYXJhbSwgY29uZmlnKTsgLy8gYE51bWJlckJveGAgb3IgYFNsaWRlcmBcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgZ3VpID0gbmV3IF9UZXh0R3VpKCRjb250YWluZXIsIHBhcmFtLCBjb25maWcpOyAvLyBgVGV4dGBcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0cmlnZ2VyJzpcbiAgICAgICAgZ3VpID0gbmV3IF9UcmlnZ2VyR3VpKCRjb250YWluZXIsIHBhcmFtLCBjb25maWcpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBwYXJhbS5hZGRMaXN0ZW5lcigndXBkYXRlJywgKHZhbCkgPT4gZ3VpLnNldCh2YWwpKTtcblxuICAgIHJldHVybiBndWk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2hhcmVkUGFyYW1zKTtcblxuZXhwb3J0IGRlZmF1bHQgU2hhcmVkUGFyYW1zO1xuIl19