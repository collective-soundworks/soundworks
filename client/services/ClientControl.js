'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _wavesBasicControllers = require('waves-basic-controllers');

var _wavesBasicControllers2 = _interopRequireDefault(_wavesBasicControllers);

var _events = require('events');

var _coreService = require('../core/Service');

var _coreService2 = _interopRequireDefault(_coreService);

var _coreServiceManager = require('../core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

var SERVICE_ID = 'service:control';

_wavesBasicControllers2['default'].disableStyles();

/* --------------------------------------------------------- */
/* CONTROL UNITS
/* --------------------------------------------------------- */

/** @private */

var _ControlUnit = (function (_EventEmitter) {
  _inherits(_ControlUnit, _EventEmitter);

  function _ControlUnit(control, type, name, label) {
    _classCallCheck(this, _ControlUnit);

    _get(Object.getPrototypeOf(_ControlUnit.prototype), 'constructor', this).call(this);
    this.control = control;
    this.type = type;
    this.name = name;
    this.label = label;
    this.value = undefined;
  }

  /** @private */

  _createClass(_ControlUnit, [{
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

  return _ControlUnit;
})(_events.EventEmitter);

var _NumberUnit = (function (_ControlUnit2) {
  _inherits(_NumberUnit, _ControlUnit2);

  function _NumberUnit(control, name, label, min, max, step, init) {
    _classCallCheck(this, _NumberUnit);

    _get(Object.getPrototypeOf(_NumberUnit.prototype), 'constructor', this).call(this, control, 'number', name, label);
    this.min = min;
    this.max = max;
    this.step = step;
    this.set(init);
  }

  /** @private */

  _createClass(_NumberUnit, [{
    key: 'set',
    value: function set(val) {
      this.value = Math.min(this.max, Math.max(this.min, val));
    }
  }]);

  return _NumberUnit;
})(_ControlUnit);

var _EnumUnit = (function (_ControlUnit3) {
  _inherits(_EnumUnit, _ControlUnit3);

  function _EnumUnit(control, name, label, options, init) {
    _classCallCheck(this, _EnumUnit);

    _get(Object.getPrototypeOf(_EnumUnit.prototype), 'constructor', this).call(this, control, 'enum', name, label);
    this.options = options;
    this.set(init);
  }

  /** @private */

  _createClass(_EnumUnit, [{
    key: 'set',
    value: function set(val) {
      var index = this.options.indexOf(val);

      if (index >= 0) {
        this.index = index;
        this.value = val;
      }
    }
  }]);

  return _EnumUnit;
})(_ControlUnit);

var _InfoUnit = (function (_ControlUnit4) {
  _inherits(_InfoUnit, _ControlUnit4);

  function _InfoUnit(control, name, label, init) {
    _classCallCheck(this, _InfoUnit);

    _get(Object.getPrototypeOf(_InfoUnit.prototype), 'constructor', this).call(this, control, 'info', name, label);
    this.set(init);
  }

  /** @private */

  _createClass(_InfoUnit, [{
    key: 'set',
    value: function set(val) {
      this.value = val;
    }
  }]);

  return _InfoUnit;
})(_ControlUnit);

var _CommandUnit = (function (_ControlUnit5) {
  _inherits(_CommandUnit, _ControlUnit5);

  function _CommandUnit(control, name, label) {
    _classCallCheck(this, _CommandUnit);

    _get(Object.getPrototypeOf(_CommandUnit.prototype), 'constructor', this).call(this, control, 'command', name, label);
  }

  /** @private */

  _createClass(_CommandUnit, [{
    key: 'set',
    value: function set(val) {/* nothing to set here */}
  }]);

  return _CommandUnit;
})(_ControlUnit);

var _LabelUnit = (function (_ControlUnit6) {
  _inherits(_LabelUnit, _ControlUnit6);

  function _LabelUnit(control, name, label) {
    _classCallCheck(this, _LabelUnit);

    _get(Object.getPrototypeOf(_LabelUnit.prototype), 'constructor', this).call(this, control, 'label', name, label);
  }

  /* --------------------------------------------------------- */
  /* GUIs
  /* --------------------------------------------------------- */

  /** @private */

  _createClass(_LabelUnit, [{
    key: 'set',
    value: function set(val) {/* nothing to set here */}
  }]);

  return _LabelUnit;
})(_ControlUnit);

var _NumberGui = (function () {
  function _NumberGui($container, unit, guiOptions) {
    _classCallCheck(this, _NumberGui);

    var label = unit.label;
    var min = unit.min;
    var max = unit.max;
    var step = unit.step;
    var value = unit.value;

    if (guiOptions.type === 'slider') this.controller = new _wavesBasicControllers2['default'].Slider(label, min, max, step, value, guiOptions.unit, guiOptions.size);else this.controller = new _wavesBasicControllers2['default'].NumberBox(label, min, max, step, value);

    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', function (value) {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + unit.name + ':' + value + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      unit.update(value);
    });
  }

  /** @private */

  _createClass(_NumberGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);

  return _NumberGui;
})();

var _EnumGui = (function () {
  function _EnumGui($container, unit, guiOptions) {
    _classCallCheck(this, _EnumGui);

    var label = unit.label;
    var options = unit.options;
    var value = unit.value;

    var ctor = guiOptions.type === 'buttons' ? _wavesBasicControllers2['default'].SelectButtons : _wavesBasicControllers2['default'].SelectList;

    this.controller = new ctor(label, options, value);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', function (value) {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + unit.name + ':' + value + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      unit.update(value);
    });
  }

  /** @private */

  _createClass(_EnumGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);

  return _EnumGui;
})();

var _CommandGui = (function () {
  function _CommandGui($container, unit, guiOptions) {
    _classCallCheck(this, _CommandGui);

    var label = unit.label;

    this.controller = new _wavesBasicControllers2['default'].Buttons('', [label]);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', function () {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + unit.name + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      unit.update();
    });
  }

  /** @private */

  _createClass(_CommandGui, [{
    key: 'set',
    value: function set(val) {/* nothing to set here */}
  }]);

  return _CommandGui;
})();

var _InfoGui = (function () {
  function _InfoGui($container, unit, guiOptions) {
    _classCallCheck(this, _InfoGui);

    var label = unit.label;
    var value = unit.value;

    this.controller = new _wavesBasicControllers2['default'].Info(label, value);
    $container.appendChild(this.controller.render());
    this.controller.onRender();
  }

  /** @private */

  _createClass(_InfoGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);

  return _InfoGui;
})();

var _LabelGui = (function () {
  function _LabelGui($container, unit, guiOptions) {
    _classCallCheck(this, _LabelGui);

    var label = unit.label;

    this.controller = new _wavesBasicControllers2['default'].Title(label);
    $container.appendChild(this.controller.render());
    this.controller.onRender();
  }

  /**
   * Manage the global control `parameters`, `infos`, and `commands` across the whole scenario.
   *
   * The module keeps track of:
   * - `parameters`: values that can be updated by the actions of the clients (*e.g.* the gain of a synth);
   * - `infos`: information about the state of the scenario (*e.g.* number of clients in the performance);
   * - `commands`: can trigger an action (*e.g.* reload the page).
   *
   * If the module is instantiated with the `gui` option set to `true`, it constructs a graphical interface to modify the parameters, view the infos, and trigger the commands.
   * Otherwise (`gui` option set to `false`) the module emits an event when it receives updated values from the server.
   *
   * When the GUI is disabled, the module finishes its initialization immediately after having set up the controls.
   * Otherwise (GUI enabled), the modules remains in its state and never finishes its initialization.
   *
   * When the module a view (`gui` option set to `true`), it requires the SASS partial `_77-checkin.scss`.
   *
   * (See also {@link src/server/ServerControl.js~ServerControl} on the server side.)
   *
   * @example // Example 1: make a client that displays the control GUI
   * const control = new ClientControl();
   *
   * // Initialize the client (indicate the client type)
   * client.init('conductor'); // accessible at the URL /conductor
   *
   * // Start the scenario
   * // For this client type (`'conductor'`), there is only one module
   * client.start(control);
   *
   * @example // Example 2: listen for parameter, infos & commands updates
   * const control = new ClientControl({ gui: false });
   *
   * // Listen for parameter, infos or command updates
   * control.on('update', (name, value) => {
   *   switch(name) {
   *     case 'synth:gain':
   *       console.log(`Update the synth gain to value #{value}.`);
   *       break;
   *     case 'reload':
   *       window.location.reload(true);
   *       break;
   *   }
   * });
   *
   * // Get current value of a parameter or info
   * const currentSynthGainValue = control.event['synth:gain'].value;
   * const currentNumPlayersValue = control.event['numPlayers'].value;
   */

  _createClass(_LabelGui, [{
    key: 'set',
    value: function set(val) {/* nothing to set here */}
  }]);

  return _LabelGui;
})();

var ClientControl = (function (_Service) {
  _inherits(ClientControl, _Service);

  /**
   * @emits {'update'} when the server sends an update. The callback function takes `name:String` and `value:*` as arguments, where `name` is the name of the parameter / info / command, and `value` its new value.
   */

  function ClientControl() {
    _classCallCheck(this, ClientControl);

    _get(Object.getPrototypeOf(ClientControl.prototype), 'constructor', this).call(this, SERVICE_ID, true);

    /**
     * @param {Object} [options={}] Options.
     * @param {Boolean} [options.hasGui=true] - Indicates whether to create the graphical user interface to control the parameters or not.
     */
    var defaults = { hasGui: false };
    this.configure(defaults);

    /** @private */
    this._guiOptions = {};

    this._onInitResponse = this._onInitResponse.bind(this);
    this._onUpdateResponse = this._onUpdateResponse.bind(this);
  }

  _createClass(ClientControl, [{
    key: 'init',
    value: function init() {
      /**
       * Dictionary of all the parameters and commands.
       * @type {Object}
       */
      this.units = {};

      if (this.options.hasGui) this.view = this.createView();
    }

    /** @private */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientControl.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.send('request');

      this.receive('init', this._onInitResponse);
      this.receive('update', this._onUpdateResponse);

      // this.show();
    }

    /** @private */
  }, {
    key: 'stop',
    value: function stop() {
      _get(Object.getPrototypeOf(ClientControl.prototype), 'stop', this).call(this);
      // don't remove 'update' listener, as the control is runnig as a background process
      this.removeListener('init', this._onInitResponse);
    }
  }, {
    key: '_onInitResponse',
    value: function _onInitResponse(config) {
      var _this = this;

      this.show();

      config.forEach(function (entry) {
        var unit = _this._createControlUnit(entry);
        _this.units[unit.name] = unit;

        if (_this.view) _this._createGui(_this.view, unit);
      });

      if (!this.options.hasGui) this.ready();
    }
  }, {
    key: '_onUpdateResponse',
    value: function _onUpdateResponse(name, val) {
      // update, but don't send back to server
      this.update(name, val, false);
    }

    /**
     * Adds a listener to a specific event (i.e. parameter, info or command).
     * @param {String} name Name of the event.
     * @param {Function} listener Listener callback.
     */
  }, {
    key: 'addUnitListener',
    value: function addUnitListener(name, listener) {
      var unit = this.units[name];

      if (unit) {
        unit.addListener('update', listener);

        if (unit.type !== 'command') listener(unit.value);
      } else {
        console.log('unknown unit "' + name + '"');
      }
    }

    /**
     * Removes a listener from a specific event (i.e. parameter, info or command).
     * @param {String} name Name of the event.
     * @param {Function} listener Listener callback.
     */
  }, {
    key: 'removeUnitListener',
    value: function removeUnitListener(name, listener) {
      var unit = this.units[name];

      if (unit) {
        unit.removeListener('update', listener);
      } else {
        console.log('unknown unit "' + name + '"');
      }
    }

    /**
     * Get the value of a given parameter.
     * @param {String} name - The name of the parameter.
     * @returns {Mixed} - The related value.
     */
  }, {
    key: 'getValue',
    value: function getValue(name) {
      return this.units[name].value;
    }

    /**
     * Updates the value of a parameter.
     * @param {String} name - Name of the parameter to update.
     * @param {(String|Number|Boolean)} val - New value of the parameter.
     * @param {Boolean} [sendToServer=true] - Flag whether the value is sent to the server.
     */
  }, {
    key: 'update',
    value: function update(name, val) {
      var sendToServer = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      var unit = this.units[name];

      if (unit) {
        unit.update(val, sendToServer);
      } else {
        console.log('unknown control unit "' + name + '"');
      }
    }
  }, {
    key: '_createControlUnit',
    value: function _createControlUnit(init) {
      var unit = null;

      switch (init.type) {
        case 'number':
          unit = new _NumberUnit(this, init.name, init.label, init.min, init.max, init.step, init.value);
          break;

        case 'enum':
          unit = new _EnumUnit(this, init.name, init.label, init.options, init.value);
          break;

        case 'info':
          unit = new _InfoUnit(this, init.name, init.label, init.value);
          break;

        case 'command':
          unit = new _CommandUnit(this, init.name, init.label);
          break;

        case 'label':
          unit = new _LabelUnit(this, init.name, init.label);
          break;
      }

      return unit;
    }

    /**
     * Configure the GUI for a specific control unit (e.g. if it should appear or not,
     * which type of GUI to use).
     * @param {String} name - The name of the `unit` to configure.
     * @param {Object} options - The options to apply to configure the given `unit`.
     * @param {String} options.type - The type of GUI to use.
     * @param {Boolean} [options.show=true] - Show the GUI for this `unit` or not.
     * @param {Boolean} [options.confirm=false] - Ask for confirmation when the value changes.
     */
  }, {
    key: 'setGuiOptions',
    value: function setGuiOptions(name, options) {
      this._guiOptions[name] = options;
    }
  }, {
    key: '_createGui',
    value: function _createGui(view, unit) {
      var config = _Object$assign({
        show: true,
        confirm: false
      }, this._guiOptions[unit.name]);

      if (config.show === false) return null;

      var gui = null;
      var $container = this.view.$el;

      switch (unit.type) {
        case 'number':
          gui = new _NumberGui($container, unit, config); // `NumberBox` or `Slider`
          break;
        case 'enum':
          gui = new _EnumGui($container, unit, config); // `SelectList` or `SelectButtons`
          break;
        case 'command':
          gui = new _CommandGui($container, unit, config); // `Button`
          break;
        case 'info':
          gui = new _InfoGui($container, unit, config); // `Info`
          break;
        case 'label':
          gui = new _LabelGui($container, unit, config);
          break;
        // case 'toggle'
      }

      unit.addListener('update', function (val) {
        return gui.set(val);
      });

      return gui;
    }
  }]);

  return ClientControl;
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, ClientControl);

exports['default'] = ClientControl;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50Q29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7cUNBQTZCLHlCQUF5Qjs7OztzQkFDekIsUUFBUTs7MkJBQ2pCLGlCQUFpQjs7OztrQ0FDVix3QkFBd0I7Ozs7QUFFbkQsSUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUM7O0FBRXJDLG1DQUFpQixhQUFhLEVBQUUsQ0FBQzs7Ozs7Ozs7SUFPM0IsWUFBWTtZQUFaLFlBQVk7O0FBQ0wsV0FEUCxZQUFZLENBQ0osT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFOzBCQURwQyxZQUFZOztBQUVkLCtCQUZFLFlBQVksNkNBRU47QUFDUixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixRQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztHQUN4Qjs7OztlQVJHLFlBQVk7O1dBVWIsYUFBQyxHQUFHLEVBQUU7QUFDUCxVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjs7O1dBRVMsc0JBQXNCO1VBQXJCLFlBQVkseURBQUcsSUFBSTs7QUFDNUIsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVoQyxVQUFJLFlBQVksRUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXJELFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFL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QUFHLEdBQUcsSUFBSSxXQUFXLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNoRCxnQkFBTTtBQUFBLEFBQ1IsYUFBSyxNQUFNO0FBQ1QsYUFBRyxHQUFHLElBQUksUUFBUSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDN0MsZ0JBQU07QUFBQSxBQUNSLGFBQUssT0FBTztBQUNWLGFBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLGdCQUFNO0FBQUE7T0FFVDs7QUFFRCxVQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxVQUFDLEdBQUc7ZUFBSyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztPQUFBLENBQUMsQ0FBQzs7QUFFbEQsYUFBTyxHQUFHLENBQUM7S0FDWjs7O1NBOU1HLGFBQWE7OztBQWlObkIsZ0NBQWUsUUFBUSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQzs7cUJBRXBDLGFBQWEiLCJmaWxlIjoic3JjL2NsaWVudC9zZXJ2aWNlcy9DbGllbnRDb250cm9sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJhc2ljQ29udHJvbGxlcnMgZnJvbSAnd2F2ZXMtYmFzaWMtY29udHJvbGxlcnMnO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpjb250cm9sJztcblxuYmFzaWNDb250cm9sbGVycy5kaXNhYmxlU3R5bGVzKCk7XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLyogQ09OVFJPTCBVTklUU1xuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0NvbnRyb2xVbml0IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgdHlwZSwgbmFtZSwgbGFiZWwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY29udHJvbCA9IGNvbnRyb2w7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIF9wcm9wYWdhdGUoc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgIHRoaXMuZW1pdCgndXBkYXRlJywgdGhpcy52YWx1ZSk7IC8vIGNhbGwgZXZlbnQgbGlzdGVuZXJzXG5cbiAgICBpZiAoc2VuZFRvU2VydmVyKVxuICAgICAgdGhpcy5jb250cm9sLnNlbmQoJ3VwZGF0ZScsIHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7IC8vIHNlbmQgdG8gc2VydmVyXG5cbiAgICB0aGlzLmNvbnRyb2wuZW1pdCgndXBkYXRlJywgdGhpcy5uYW1lLCB0aGlzLnZhbHVlKTsgLy8gY2FsbCBjb250cm9sIGxpc3RlbmVyc1xuICB9XG5cbiAgdXBkYXRlKHZhbCwgc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgIHRoaXMuc2V0KHZhbCk7XG4gICAgdGhpcy5fcHJvcGFnYXRlKHNlbmRUb1NlcnZlcik7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfTnVtYmVyVW5pdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdudW1iZXInLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5taW4gPSBtaW47XG4gICAgdGhpcy5tYXggPSBtYXg7XG4gICAgdGhpcy5zdGVwID0gc3RlcDtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gTWF0aC5taW4odGhpcy5tYXgsIE1hdGgubWF4KHRoaXMubWluLCB2YWwpKTtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9FbnVtVW5pdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0KSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2VudW0nLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLm9wdGlvbnMuaW5kZXhPZih2YWwpO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gICAgfVxuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0luZm9Vbml0IGV4dGVuZHMgX0NvbnRyb2xVbml0IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAnaW5mbycsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0NvbW1hbmRVbml0IGV4dGVuZHMgX0NvbnRyb2xVbml0IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwpIHtcbiAgICBzdXBlcihjb250cm9sLCAnY29tbWFuZCcsIG5hbWUsIGxhYmVsKTtcbiAgfVxuXG4gIHNldCh2YWwpIHsgLyogbm90aGluZyB0byBzZXQgaGVyZSAqLyB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0xhYmVsVW5pdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2xhYmVsJywgbmFtZSwgbGFiZWwpO1xuICB9XG5cbiAgc2V0KHZhbCkgeyAvKiBub3RoaW5nIHRvIHNldCBoZXJlICovIH1cbn1cblxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8qIEdVSXNcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9OdW1iZXJHdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCB1bml0LCBndWlPcHRpb25zKSB7XG4gICAgY29uc3QgeyBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIHZhbHVlIH0gPSB1bml0O1xuXG4gICAgaWYgKGd1aU9wdGlvbnMudHlwZSA9PT0gJ3NsaWRlcicpXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgYmFzaWNDb250cm9sbGVycy5TbGlkZXIobGFiZWwsIG1pbiwgbWF4LCBzdGVwLCB2YWx1ZSwgZ3VpT3B0aW9ucy51bml0LCBndWlPcHRpb25zLnNpemUpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBiYXNpY0NvbnRyb2xsZXJzLk51bWJlckJveChsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIHZhbHVlKTtcblxuICAgICRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLnJlbmRlcigpKTtcbiAgICB0aGlzLmNvbnRyb2xsZXIub25SZW5kZXIoKTtcblxuICAgIHRoaXMuY29udHJvbGxlci5vbignY2hhbmdlJywgKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoZ3VpT3B0aW9ucy5jb25maXJtKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIFwiJHt1bml0Lm5hbWV9OiR7dmFsdWV9XCJgO1xuICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICB9XG5cbiAgICAgIHVuaXQudXBkYXRlKHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfRW51bUd1aSB7XG4gIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIHVuaXQsIGd1aU9wdGlvbnMpIHtcbiAgICBjb25zdCB7IGxhYmVsLCBvcHRpb25zLCB2YWx1ZSB9ID0gdW5pdDtcblxuICAgIGNvbnN0IGN0b3IgPSBndWlPcHRpb25zLnR5cGUgPT09ICdidXR0b25zJyA/XG4gICAgICBiYXNpY0NvbnRyb2xsZXJzLlNlbGVjdEJ1dHRvbnMgOiBiYXNpY0NvbnRyb2xsZXJzLlNlbGVjdExpc3RcblxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBjdG9yKGxhYmVsLCBvcHRpb25zLCB2YWx1ZSk7XG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAodmFsdWUpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3VuaXQubmFtZX06JHt2YWx1ZX1cImA7XG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgIH1cblxuICAgICAgdW5pdC51cGRhdGUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9Db21tYW5kR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgdW5pdCwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwgfSA9IHVuaXQ7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgYmFzaWNDb250cm9sbGVycy5CdXR0b25zKCcnLCBbbGFiZWxdKTtcbiAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5yZW5kZXIoKSk7XG4gICAgdGhpcy5jb250cm9sbGVyLm9uUmVuZGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3VuaXQubmFtZX1cImA7XG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgIH1cblxuICAgICAgdW5pdC51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldCh2YWwpIHsgLyogbm90aGluZyB0byBzZXQgaGVyZSAqLyB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0luZm9HdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCB1bml0LCBndWlPcHRpb25zKSB7XG4gICAgY29uc3QgeyBsYWJlbCwgdmFsdWUgfSA9IHVuaXQ7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgYmFzaWNDb250cm9sbGVycy5JbmZvKGxhYmVsLCB2YWx1ZSk7XG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9MYWJlbEd1aSB7XG4gIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIHVuaXQsIGd1aU9wdGlvbnMpIHtcbiAgICBjb25zdCB7IGxhYmVsIH0gPSB1bml0O1xuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuVGl0bGUobGFiZWwpO1xuICAgICRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLnJlbmRlcigpKTtcbiAgICB0aGlzLmNvbnRyb2xsZXIub25SZW5kZXIoKTtcbiAgfVxuXG4gIHNldCh2YWwpIHsgLyogbm90aGluZyB0byBzZXQgaGVyZSAqLyB9XG59XG5cbi8qKlxuICogTWFuYWdlIHRoZSBnbG9iYWwgY29udHJvbCBgcGFyYW1ldGVyc2AsIGBpbmZvc2AsIGFuZCBgY29tbWFuZHNgIGFjcm9zcyB0aGUgd2hvbGUgc2NlbmFyaW8uXG4gKlxuICogVGhlIG1vZHVsZSBrZWVwcyB0cmFjayBvZjpcbiAqIC0gYHBhcmFtZXRlcnNgOiB2YWx1ZXMgdGhhdCBjYW4gYmUgdXBkYXRlZCBieSB0aGUgYWN0aW9ucyBvZiB0aGUgY2xpZW50cyAoKmUuZy4qIHRoZSBnYWluIG9mIGEgc3ludGgpO1xuICogLSBgaW5mb3NgOiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc3RhdGUgb2YgdGhlIHNjZW5hcmlvICgqZS5nLiogbnVtYmVyIG9mIGNsaWVudHMgaW4gdGhlIHBlcmZvcm1hbmNlKTtcbiAqIC0gYGNvbW1hbmRzYDogY2FuIHRyaWdnZXIgYW4gYWN0aW9uICgqZS5nLiogcmVsb2FkIHRoZSBwYWdlKS5cbiAqXG4gKiBJZiB0aGUgbW9kdWxlIGlzIGluc3RhbnRpYXRlZCB3aXRoIHRoZSBgZ3VpYCBvcHRpb24gc2V0IHRvIGB0cnVlYCwgaXQgY29uc3RydWN0cyBhIGdyYXBoaWNhbCBpbnRlcmZhY2UgdG8gbW9kaWZ5IHRoZSBwYXJhbWV0ZXJzLCB2aWV3IHRoZSBpbmZvcywgYW5kIHRyaWdnZXIgdGhlIGNvbW1hbmRzLlxuICogT3RoZXJ3aXNlIChgZ3VpYCBvcHRpb24gc2V0IHRvIGBmYWxzZWApIHRoZSBtb2R1bGUgZW1pdHMgYW4gZXZlbnQgd2hlbiBpdCByZWNlaXZlcyB1cGRhdGVkIHZhbHVlcyBmcm9tIHRoZSBzZXJ2ZXIuXG4gKlxuICogV2hlbiB0aGUgR1VJIGlzIGRpc2FibGVkLCB0aGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBpbW1lZGlhdGVseSBhZnRlciBoYXZpbmcgc2V0IHVwIHRoZSBjb250cm9scy5cbiAqIE90aGVyd2lzZSAoR1VJIGVuYWJsZWQpLCB0aGUgbW9kdWxlcyByZW1haW5zIGluIGl0cyBzdGF0ZSBhbmQgbmV2ZXIgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uLlxuICpcbiAqIFdoZW4gdGhlIG1vZHVsZSBhIHZpZXcgKGBndWlgIG9wdGlvbiBzZXQgdG8gYHRydWVgKSwgaXQgcmVxdWlyZXMgdGhlIFNBU1MgcGFydGlhbCBgXzc3LWNoZWNraW4uc2Nzc2AuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlckNvbnRyb2wuanN+U2VydmVyQ29udHJvbH0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSAvLyBFeGFtcGxlIDE6IG1ha2UgYSBjbGllbnQgdGhhdCBkaXNwbGF5cyB0aGUgY29udHJvbCBHVUlcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgQ2xpZW50Q29udHJvbCgpO1xuICpcbiAqIC8vIEluaXRpYWxpemUgdGhlIGNsaWVudCAoaW5kaWNhdGUgdGhlIGNsaWVudCB0eXBlKVxuICogY2xpZW50LmluaXQoJ2NvbmR1Y3RvcicpOyAvLyBhY2Nlc3NpYmxlIGF0IHRoZSBVUkwgL2NvbmR1Y3RvclxuICpcbiAqIC8vIFN0YXJ0IHRoZSBzY2VuYXJpb1xuICogLy8gRm9yIHRoaXMgY2xpZW50IHR5cGUgKGAnY29uZHVjdG9yJ2ApLCB0aGVyZSBpcyBvbmx5IG9uZSBtb2R1bGVcbiAqIGNsaWVudC5zdGFydChjb250cm9sKTtcbiAqXG4gKiBAZXhhbXBsZSAvLyBFeGFtcGxlIDI6IGxpc3RlbiBmb3IgcGFyYW1ldGVyLCBpbmZvcyAmIGNvbW1hbmRzIHVwZGF0ZXNcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgQ2xpZW50Q29udHJvbCh7IGd1aTogZmFsc2UgfSk7XG4gKlxuICogLy8gTGlzdGVuIGZvciBwYXJhbWV0ZXIsIGluZm9zIG9yIGNvbW1hbmQgdXBkYXRlc1xuICogY29udHJvbC5vbigndXBkYXRlJywgKG5hbWUsIHZhbHVlKSA9PiB7XG4gKiAgIHN3aXRjaChuYW1lKSB7XG4gKiAgICAgY2FzZSAnc3ludGg6Z2Fpbic6XG4gKiAgICAgICBjb25zb2xlLmxvZyhgVXBkYXRlIHRoZSBzeW50aCBnYWluIHRvIHZhbHVlICN7dmFsdWV9LmApO1xuICogICAgICAgYnJlYWs7XG4gKiAgICAgY2FzZSAncmVsb2FkJzpcbiAqICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XG4gKiAgICAgICBicmVhaztcbiAqICAgfVxuICogfSk7XG4gKlxuICogLy8gR2V0IGN1cnJlbnQgdmFsdWUgb2YgYSBwYXJhbWV0ZXIgb3IgaW5mb1xuICogY29uc3QgY3VycmVudFN5bnRoR2FpblZhbHVlID0gY29udHJvbC5ldmVudFsnc3ludGg6Z2FpbiddLnZhbHVlO1xuICogY29uc3QgY3VycmVudE51bVBsYXllcnNWYWx1ZSA9IGNvbnRyb2wuZXZlbnRbJ251bVBsYXllcnMnXS52YWx1ZTtcbiAqL1xuY2xhc3MgQ2xpZW50Q29udHJvbCBleHRlbmRzIFNlcnZpY2Uge1xuICAvKipcbiAgICogQGVtaXRzIHsndXBkYXRlJ30gd2hlbiB0aGUgc2VydmVyIHNlbmRzIGFuIHVwZGF0ZS4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRha2VzIGBuYW1lOlN0cmluZ2AgYW5kIGB2YWx1ZToqYCBhcyBhcmd1bWVudHMsIHdoZXJlIGBuYW1lYCBpcyB0aGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyIC8gaW5mbyAvIGNvbW1hbmQsIGFuZCBgdmFsdWVgIGl0cyBuZXcgdmFsdWUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmhhc0d1aT10cnVlXSAtIEluZGljYXRlcyB3aGV0aGVyIHRvIGNyZWF0ZSB0aGUgZ3JhcGhpY2FsIHVzZXIgaW50ZXJmYWNlIHRvIGNvbnRyb2wgdGhlIHBhcmFtZXRlcnMgb3Igbm90LlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0geyBoYXNHdWk6IGZhbHNlIH07XG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgdGhpcy5fZ3VpT3B0aW9ucyA9IHt9O1xuXG4gICAgdGhpcy5fb25Jbml0UmVzcG9uc2UgPSB0aGlzLl9vbkluaXRSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uVXBkYXRlUmVzcG9uc2UgPSB0aGlzLl9vblVwZGF0ZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIC8qKlxuICAgICAqIERpY3Rpb25hcnkgb2YgYWxsIHRoZSBwYXJhbWV0ZXJzIGFuZCBjb21tYW5kcy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMudW5pdHMgPSB7fTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaGFzR3VpKVxuICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnaW5pdCcsIHRoaXMuX29uSW5pdFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3VwZGF0ZScsIHRoaXMuX29uVXBkYXRlUmVzcG9uc2UpO1xuXG4gICAgLy8gdGhpcy5zaG93KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgLy8gZG9uJ3QgcmVtb3ZlICd1cGRhdGUnIGxpc3RlbmVyLCBhcyB0aGUgY29udHJvbCBpcyBydW5uaWcgYXMgYSBiYWNrZ3JvdW5kIHByb2Nlc3NcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdpbml0JywgdGhpcy5fb25Jbml0UmVzcG9uc2UpO1xuICB9XG5cbiAgX29uSW5pdFJlc3BvbnNlKGNvbmZpZykge1xuICAgIHRoaXMuc2hvdygpO1xuXG4gICAgY29uZmlnLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBjb25zdCB1bml0ID0gdGhpcy5fY3JlYXRlQ29udHJvbFVuaXQoZW50cnkpO1xuICAgICAgdGhpcy51bml0c1t1bml0Lm5hbWVdID0gdW5pdDtcblxuICAgICAgaWYgKHRoaXMudmlldylcbiAgICAgICAgdGhpcy5fY3JlYXRlR3VpKHRoaXMudmlldywgdW5pdCk7XG4gICAgfSk7XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5oYXNHdWkpXG4gICAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICBfb25VcGRhdGVSZXNwb25zZShuYW1lLCB2YWwpIHtcbiAgICAvLyB1cGRhdGUsIGJ1dCBkb24ndCBzZW5kIGJhY2sgdG8gc2VydmVyXG4gICAgdGhpcy51cGRhdGUobmFtZSwgdmFsLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGxpc3RlbmVyIHRvIGEgc3BlY2lmaWMgZXZlbnQgKGkuZS4gcGFyYW1ldGVyLCBpbmZvIG9yIGNvbW1hbmQpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTGlzdGVuZXIgY2FsbGJhY2suXG4gICAqL1xuICBhZGRVbml0TGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCB1bml0ID0gdGhpcy51bml0c1tuYW1lXTtcblxuICAgIGlmICh1bml0KSB7XG4gICAgICB1bml0LmFkZExpc3RlbmVyKCd1cGRhdGUnLCBsaXN0ZW5lcik7XG5cbiAgICAgIGlmICh1bml0LnR5cGUgIT09ICdjb21tYW5kJylcbiAgICAgICAgbGlzdGVuZXIodW5pdC52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHVuaXQgXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnJvbSBhIHNwZWNpZmljIGV2ZW50IChpLmUuIHBhcmFtZXRlciwgaW5mbyBvciBjb21tYW5kKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIExpc3RlbmVyIGNhbGxiYWNrLlxuICAgKi9cbiAgcmVtb3ZlVW5pdExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgdW5pdCA9IHRoaXMudW5pdHNbbmFtZV07XG5cbiAgICBpZiAodW5pdCkge1xuICAgICAgdW5pdC5yZW1vdmVMaXN0ZW5lcigndXBkYXRlJywgbGlzdGVuZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biB1bml0IFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSB2YWx1ZSBvZiBhIGdpdmVuIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcmV0dXJucyB7TWl4ZWR9IC0gVGhlIHJlbGF0ZWQgdmFsdWUuXG4gICAqL1xuICBnZXRWYWx1ZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMudW5pdHNbbmFtZV0udmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgYSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHsoU3RyaW5nfE51bWJlcnxCb29sZWFuKX0gdmFsIC0gTmV3IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3NlbmRUb1NlcnZlcj10cnVlXSAtIEZsYWcgd2hldGhlciB0aGUgdmFsdWUgaXMgc2VudCB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbCwgc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgIGNvbnN0IHVuaXQgPSB0aGlzLnVuaXRzW25hbWVdO1xuXG4gICAgaWYgKHVuaXQpIHtcbiAgICAgIHVuaXQudXBkYXRlKHZhbCwgc2VuZFRvU2VydmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gY29udHJvbCB1bml0IFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICBfY3JlYXRlQ29udHJvbFVuaXQoaW5pdCkge1xuICAgIGxldCB1bml0ID0gbnVsbDtcblxuICAgIHN3aXRjaCAoaW5pdC50eXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICB1bml0ID0gbmV3IF9OdW1iZXJVbml0KHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC5taW4sIGluaXQubWF4LCBpbml0LnN0ZXAsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZW51bSc6XG4gICAgICAgIHVuaXQgPSBuZXcgX0VudW1Vbml0KHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC5vcHRpb25zLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2luZm8nOlxuICAgICAgICB1bml0ID0gbmV3IF9JbmZvVW5pdCh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnY29tbWFuZCc6XG4gICAgICAgIHVuaXQgPSBuZXcgX0NvbW1hbmRVbml0KHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdsYWJlbCc6XG4gICAgICAgIHVuaXQgPSBuZXcgX0xhYmVsVW5pdCh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gdW5pdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgdGhlIEdVSSBmb3IgYSBzcGVjaWZpYyBjb250cm9sIHVuaXQgKGUuZy4gaWYgaXQgc2hvdWxkIGFwcGVhciBvciBub3QsXG4gICAqIHdoaWNoIHR5cGUgb2YgR1VJIHRvIHVzZSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGB1bml0YCB0byBjb25maWd1cmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gYXBwbHkgdG8gY29uZmlndXJlIHRoZSBnaXZlbiBgdW5pdGAuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnR5cGUgLSBUaGUgdHlwZSBvZiBHVUkgdG8gdXNlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNob3c9dHJ1ZV0gLSBTaG93IHRoZSBHVUkgZm9yIHRoaXMgYHVuaXRgIG9yIG5vdC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5jb25maXJtPWZhbHNlXSAtIEFzayBmb3IgY29uZmlybWF0aW9uIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAqL1xuICBzZXRHdWlPcHRpb25zKG5hbWUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLl9ndWlPcHRpb25zW25hbWVdID0gb3B0aW9ucztcbiAgfVxuXG4gIF9jcmVhdGVHdWkodmlldywgdW5pdCkge1xuICAgIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIGNvbmZpcm06IGZhbHNlLFxuICAgIH0sIHRoaXMuX2d1aU9wdGlvbnNbdW5pdC5uYW1lXSk7XG5cbiAgICBpZiAoY29uZmlnLnNob3cgPT09IGZhbHNlKSByZXR1cm4gbnVsbDtcblxuICAgIGxldCBndWkgPSBudWxsO1xuICAgIGNvbnN0ICRjb250YWluZXIgPSB0aGlzLnZpZXcuJGVsO1xuXG4gICAgc3dpdGNoICh1bml0LnR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGd1aSA9IG5ldyBfTnVtYmVyR3VpKCRjb250YWluZXIsIHVuaXQsIGNvbmZpZyk7IC8vIGBOdW1iZXJCb3hgIG9yIGBTbGlkZXJgXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZW51bSc6XG4gICAgICAgIGd1aSA9IG5ldyBfRW51bUd1aSgkY29udGFpbmVyLCB1bml0LCBjb25maWcpOyAvLyBgU2VsZWN0TGlzdGAgb3IgYFNlbGVjdEJ1dHRvbnNgXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29tbWFuZCc6XG4gICAgICAgIGd1aSA9IG5ldyBfQ29tbWFuZEd1aSgkY29udGFpbmVyLCB1bml0LCBjb25maWcpOyAvLyBgQnV0dG9uYFxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2luZm8nOlxuICAgICAgICBndWkgPSBuZXcgX0luZm9HdWkoJGNvbnRhaW5lciwgdW5pdCwgY29uZmlnKTsgLy8gYEluZm9gXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGFiZWwnOlxuICAgICAgICBndWkgPSBuZXcgX0xhYmVsR3VpKCRjb250YWluZXIsIHVuaXQsIGNvbmZpZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gY2FzZSAndG9nZ2xlJ1xuICAgIH1cblxuICAgIHVuaXQuYWRkTGlzdGVuZXIoJ3VwZGF0ZScsICh2YWwpID0+IGd1aS5zZXQodmFsKSk7XG5cbiAgICByZXR1cm4gZ3VpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIENsaWVudENvbnRyb2wpO1xuXG5leHBvcnQgZGVmYXVsdCBDbGllbnRDb250cm9sO1xuIl19