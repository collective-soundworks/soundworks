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

var _BooleanUnit = (function (_ControlUnit2) {
  _inherits(_BooleanUnit, _ControlUnit2);

  function _BooleanUnit(control, name, label, init) {
    _classCallCheck(this, _BooleanUnit);

    _get(Object.getPrototypeOf(_BooleanUnit.prototype), 'constructor', this).call(this, control, 'boolean', name, label);
    this.set(init);
  }

  /** @private */

  _createClass(_BooleanUnit, [{
    key: 'set',
    value: function set(val) {
      this.value = val;
    }
  }]);

  return _BooleanUnit;
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

var _NumberUnit = (function (_ControlUnit4) {
  _inherits(_NumberUnit, _ControlUnit4);

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

var _TextUnit = (function (_ControlUnit5) {
  _inherits(_TextUnit, _ControlUnit5);

  function _TextUnit(control, name, label, init) {
    _classCallCheck(this, _TextUnit);

    _get(Object.getPrototypeOf(_TextUnit.prototype), 'constructor', this).call(this, control, 'text', name, label);
    this.set(init);
  }

  /** @private */

  _createClass(_TextUnit, [{
    key: 'set',
    value: function set(val) {
      this.value = val;
    }
  }]);

  return _TextUnit;
})(_ControlUnit);

var _TriggerUnit = (function (_ControlUnit6) {
  _inherits(_TriggerUnit, _ControlUnit6);

  function _TriggerUnit(control, name, label) {
    _classCallCheck(this, _TriggerUnit);

    _get(Object.getPrototypeOf(_TriggerUnit.prototype), 'constructor', this).call(this, control, 'trigger', name, label);
  }

  /* --------------------------------------------------------- */
  /* GUIs
  /* --------------------------------------------------------- */

  /** @private */

  _createClass(_TriggerUnit, [{
    key: 'set',
    value: function set(val) {/* nothing to set here */}
  }]);

  return _TriggerUnit;
})(_ControlUnit);

var _BooleanGui = (function () {
  function _BooleanGui($container, unit, guiOptions) {
    _classCallCheck(this, _BooleanGui);

    var label = unit.label;
    var value = unit.value;

    this.controller = new _wavesBasicControllers2['default'].Toggle(label, value);
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

  _createClass(_BooleanGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);

  return _BooleanGui;
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

var _TextGui = (function () {
  function _TextGui($container, unit, guiOptions) {
    _classCallCheck(this, _TextGui);

    var label = unit.label;
    var value = unit.value;

    this.controller = new _wavesBasicControllers2['default'].Text(label, value, guiOptions.readOnly);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    if (!guiOptions.readOnly) {
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
  }

  /** @private */

  _createClass(_TextGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);

  return _TextGui;
})();

var _TriggerGui = (function () {
  function _TriggerGui($container, unit, guiOptions) {
    _classCallCheck(this, _TriggerGui);

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

  _createClass(_TriggerGui, [{
    key: 'set',
    value: function set(val) {/* nothing to set here */}
  }]);

  return _TriggerGui;
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
      console.log(init);
      var unit = null;

      switch (init.type) {
        case 'boolean':
          unit = new _BooleanUnit(this, init.name, init.label, init.value);
          break;

        case 'enum':
          unit = new _EnumUnit(this, init.name, init.label, init.options, init.value);
          break;

        case 'number':
          unit = new _NumberUnit(this, init.name, init.label, init.min, init.max, init.step, init.value);
          break;

        case 'text':
          unit = new _TextUnit(this, init.name, init.label, init.value);
          break;

        case 'trigger':
          unit = new _TriggerUnit(this, init.name, init.label);
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
        case 'boolean':
          gui = new _BooleanGui($container, unit, config); // `Toggle`
          break;
        case 'enum':
          gui = new _EnumGui($container, unit, config); // `SelectList` or `SelectButtons`
          break;
        case 'number':
          gui = new _NumberGui($container, unit, config); // `NumberBox` or `Slider`
          break;
        case 'text':
          gui = new _TextGui($container, unit, config); // `Text`
          break;
        case 'trigger':
          gui = new _TriggerGui($container, unit, config);
          break;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50Q29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7cUNBQTZCLHlCQUF5Qjs7OztzQkFDekIsUUFBUTs7MkJBQ2pCLGlCQUFpQjs7OztrQ0FDVix3QkFBd0I7Ozs7QUFFbkQsSUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUM7O0FBRXJDLG1DQUFpQixhQUFhLEVBQUUsQ0FBQzs7Ozs7Ozs7SUFPM0IsWUFBWTtZQUFaLFlBQVk7O0FBQ0wsV0FEUCxZQUFZLENBQ0osT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFOzBCQURwQyxZQUFZOztBQUVkLCtCQUZFLFlBQVksNkNBRU47QUFDUixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixRQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztHQUN4Qjs7OztlQVJHLFlBQVk7O1dBVWIsYUFBQyxHQUFHLEVBQUU7QUFDUCxVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjs7O1dBRVMsc0JBQXNCO1VBQXJCLFlBQVkseURBQUcsSUFBSTs7QUFDNUIsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVoQyxVQUFJLFlBQVksRUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXJELFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFL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QUEsQUFDUixhQUFLLE1BQU07QUFDVCxhQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM3QyxnQkFBTTtBQUFBLEFBQ1IsYUFBSyxTQUFTO0FBQ1osYUFBRyxHQUFHLElBQUksV0FBVyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDaEQsZ0JBQU07QUFBQSxPQUNUOztBQUVELFVBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFVBQUMsR0FBRztlQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO09BQUEsQ0FBQyxDQUFDOztBQUVsRCxhQUFPLEdBQUcsQ0FBQztLQUNaOzs7U0E5TUcsYUFBYTs7O0FBaU5uQixnQ0FBZSxRQUFRLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDOztxQkFFcEMsYUFBYSIsImZpbGUiOiJzcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudENvbnRyb2wuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmFzaWNDb250cm9sbGVycyBmcm9tICd3YXZlcy1iYXNpYy1jb250cm9sbGVycyc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmNvbnRyb2wnO1xuXG5iYXNpY0NvbnRyb2xsZXJzLmRpc2FibGVTdHlsZXMoKTtcblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vKiBDT05UUk9MIFVOSVRTXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQ29udHJvbFVuaXQgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCB0eXBlLCBuYW1lLCBsYWJlbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb250cm9sID0gY29udHJvbDtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMudmFsdWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgX3Byb3BhZ2F0ZShzZW5kVG9TZXJ2ZXIgPSB0cnVlKSB7XG4gICAgdGhpcy5lbWl0KCd1cGRhdGUnLCB0aGlzLnZhbHVlKTsgLy8gY2FsbCBldmVudCBsaXN0ZW5lcnNcblxuICAgIGlmIChzZW5kVG9TZXJ2ZXIpXG4gICAgICB0aGlzLmNvbnRyb2wuc2VuZCgndXBkYXRlJywgdGhpcy5uYW1lLCB0aGlzLnZhbHVlKTsgLy8gc2VuZCB0byBzZXJ2ZXJcblxuICAgIHRoaXMuY29udHJvbC5lbWl0KCd1cGRhdGUnLCB0aGlzLm5hbWUsIHRoaXMudmFsdWUpOyAvLyBjYWxsIGNvbnRyb2wgbGlzdGVuZXJzXG4gIH1cblxuICB1cGRhdGUodmFsLCBzZW5kVG9TZXJ2ZXIgPSB0cnVlKSB7XG4gICAgdGhpcy5zZXQodmFsKTtcbiAgICB0aGlzLl9wcm9wYWdhdGUoc2VuZFRvU2VydmVyKTtcbiAgfVxufVxuXG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0Jvb2xlYW5Vbml0IGV4dGVuZHMgX0NvbnRyb2xVbml0IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAnYm9vbGVhbicsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0VudW1Vbml0IGV4dGVuZHMgX0NvbnRyb2xVbml0IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIG9wdGlvbnMsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAnZW51bScsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIGxldCBpbmRleCA9IHRoaXMub3B0aW9ucy5pbmRleE9mKHZhbCk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfTnVtYmVyVW5pdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdudW1iZXInLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5taW4gPSBtaW47XG4gICAgdGhpcy5tYXggPSBtYXg7XG4gICAgdGhpcy5zdGVwID0gc3RlcDtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gTWF0aC5taW4odGhpcy5tYXgsIE1hdGgubWF4KHRoaXMubWluLCB2YWwpKTtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UZXh0VW5pdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBpbml0KSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3RleHQnLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UcmlnZ2VyVW5pdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3RyaWdnZXInLCBuYW1lLCBsYWJlbCk7XG4gIH1cblxuICBzZXQodmFsKSB7IC8qIG5vdGhpbmcgdG8gc2V0IGhlcmUgKi8gfVxufVxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8qIEdVSXNcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9Cb29sZWFuR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgdW5pdCwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIHZhbHVlIH0gPSB1bml0O1xuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuVG9nZ2xlKGxhYmVsLCB2YWx1ZSk7XG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAodmFsdWUpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3VuaXQubmFtZX06JHt2YWx1ZX1cImA7XG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgIH1cblxuICAgICAgdW5pdC51cGRhdGUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9FbnVtR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgdW5pdCwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIG9wdGlvbnMsIHZhbHVlIH0gPSB1bml0O1xuXG4gICAgY29uc3QgY3RvciA9IGd1aU9wdGlvbnMudHlwZSA9PT0gJ2J1dHRvbnMnID9cbiAgICAgIGJhc2ljQ29udHJvbGxlcnMuU2VsZWN0QnV0dG9ucyA6IGJhc2ljQ29udHJvbGxlcnMuU2VsZWN0TGlzdFxuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGN0b3IobGFiZWwsIG9wdGlvbnMsIHZhbHVlKTtcbiAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5yZW5kZXIoKSk7XG4gICAgdGhpcy5jb250cm9sbGVyLm9uUmVuZGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIub24oJ2NoYW5nZScsICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7dW5pdC5uYW1lfToke3ZhbHVlfVwiYDtcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtc2cpKSB7IHJldHVybjsgfVxuICAgICAgfVxuXG4gICAgICB1bml0LnVwZGF0ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX051bWJlckd1aSB7XG4gIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIHVuaXQsIGd1aU9wdGlvbnMpIHtcbiAgICBjb25zdCB7IGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdmFsdWUgfSA9IHVuaXQ7XG5cbiAgICBpZiAoZ3VpT3B0aW9ucy50eXBlID09PSAnc2xpZGVyJylcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBiYXNpY0NvbnRyb2xsZXJzLlNsaWRlcihsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIHZhbHVlLCBndWlPcHRpb25zLnVuaXQsIGd1aU9wdGlvbnMuc2l6ZSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuTnVtYmVyQm94KGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdmFsdWUpO1xuXG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAodmFsdWUpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3VuaXQubmFtZX06JHt2YWx1ZX1cImA7XG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgIH1cblxuICAgICAgdW5pdC51cGRhdGUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UZXh0R3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgdW5pdCwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIHZhbHVlIH0gPSB1bml0O1xuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuVGV4dChsYWJlbCwgdmFsdWUsIGd1aU9wdGlvbnMucmVhZE9ubHkpO1xuICAgICRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLnJlbmRlcigpKTtcbiAgICB0aGlzLmNvbnRyb2xsZXIub25SZW5kZXIoKTtcblxuICAgIGlmICghZ3VpT3B0aW9ucy5yZWFkT25seSkge1xuICAgICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7dW5pdC5uYW1lfVwiYDtcbiAgICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICAgIH1cblxuICAgICAgICB1bml0LnVwZGF0ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UcmlnZ2VyR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgdW5pdCwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwgfSA9IHVuaXQ7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgYmFzaWNDb250cm9sbGVycy5CdXR0b25zKCcnLCBbbGFiZWxdKTtcbiAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5yZW5kZXIoKSk7XG4gICAgdGhpcy5jb250cm9sbGVyLm9uUmVuZGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3VuaXQubmFtZX1cImA7XG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgIH1cblxuICAgICAgdW5pdC51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldCh2YWwpIHsgLyogbm90aGluZyB0byBzZXQgaGVyZSAqLyB9XG59XG5cbi8qKlxuICogTWFuYWdlIHRoZSBnbG9iYWwgY29udHJvbCBgcGFyYW1ldGVyc2AsIGBpbmZvc2AsIGFuZCBgY29tbWFuZHNgIGFjcm9zcyB0aGUgd2hvbGUgc2NlbmFyaW8uXG4gKlxuICogVGhlIG1vZHVsZSBrZWVwcyB0cmFjayBvZjpcbiAqIC0gYHBhcmFtZXRlcnNgOiB2YWx1ZXMgdGhhdCBjYW4gYmUgdXBkYXRlZCBieSB0aGUgYWN0aW9ucyBvZiB0aGUgY2xpZW50cyAoKmUuZy4qIHRoZSBnYWluIG9mIGEgc3ludGgpO1xuICogLSBgaW5mb3NgOiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc3RhdGUgb2YgdGhlIHNjZW5hcmlvICgqZS5nLiogbnVtYmVyIG9mIGNsaWVudHMgaW4gdGhlIHBlcmZvcm1hbmNlKTtcbiAqIC0gYGNvbW1hbmRzYDogY2FuIHRyaWdnZXIgYW4gYWN0aW9uICgqZS5nLiogcmVsb2FkIHRoZSBwYWdlKS5cbiAqXG4gKiBJZiB0aGUgbW9kdWxlIGlzIGluc3RhbnRpYXRlZCB3aXRoIHRoZSBgZ3VpYCBvcHRpb24gc2V0IHRvIGB0cnVlYCwgaXQgY29uc3RydWN0cyBhIGdyYXBoaWNhbCBpbnRlcmZhY2UgdG8gbW9kaWZ5IHRoZSBwYXJhbWV0ZXJzLCB2aWV3IHRoZSBpbmZvcywgYW5kIHRyaWdnZXIgdGhlIGNvbW1hbmRzLlxuICogT3RoZXJ3aXNlIChgZ3VpYCBvcHRpb24gc2V0IHRvIGBmYWxzZWApIHRoZSBtb2R1bGUgZW1pdHMgYW4gZXZlbnQgd2hlbiBpdCByZWNlaXZlcyB1cGRhdGVkIHZhbHVlcyBmcm9tIHRoZSBzZXJ2ZXIuXG4gKlxuICogV2hlbiB0aGUgR1VJIGlzIGRpc2FibGVkLCB0aGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBpbW1lZGlhdGVseSBhZnRlciBoYXZpbmcgc2V0IHVwIHRoZSBjb250cm9scy5cbiAqIE90aGVyd2lzZSAoR1VJIGVuYWJsZWQpLCB0aGUgbW9kdWxlcyByZW1haW5zIGluIGl0cyBzdGF0ZSBhbmQgbmV2ZXIgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uLlxuICpcbiAqIFdoZW4gdGhlIG1vZHVsZSBhIHZpZXcgKGBndWlgIG9wdGlvbiBzZXQgdG8gYHRydWVgKSwgaXQgcmVxdWlyZXMgdGhlIFNBU1MgcGFydGlhbCBgXzc3LWNoZWNraW4uc2Nzc2AuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlckNvbnRyb2wuanN+U2VydmVyQ29udHJvbH0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSAvLyBFeGFtcGxlIDE6IG1ha2UgYSBjbGllbnQgdGhhdCBkaXNwbGF5cyB0aGUgY29udHJvbCBHVUlcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgQ2xpZW50Q29udHJvbCgpO1xuICpcbiAqIC8vIEluaXRpYWxpemUgdGhlIGNsaWVudCAoaW5kaWNhdGUgdGhlIGNsaWVudCB0eXBlKVxuICogY2xpZW50LmluaXQoJ2NvbmR1Y3RvcicpOyAvLyBhY2Nlc3NpYmxlIGF0IHRoZSBVUkwgL2NvbmR1Y3RvclxuICpcbiAqIC8vIFN0YXJ0IHRoZSBzY2VuYXJpb1xuICogLy8gRm9yIHRoaXMgY2xpZW50IHR5cGUgKGAnY29uZHVjdG9yJ2ApLCB0aGVyZSBpcyBvbmx5IG9uZSBtb2R1bGVcbiAqIGNsaWVudC5zdGFydChjb250cm9sKTtcbiAqXG4gKiBAZXhhbXBsZSAvLyBFeGFtcGxlIDI6IGxpc3RlbiBmb3IgcGFyYW1ldGVyLCBpbmZvcyAmIGNvbW1hbmRzIHVwZGF0ZXNcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgQ2xpZW50Q29udHJvbCh7IGd1aTogZmFsc2UgfSk7XG4gKlxuICogLy8gTGlzdGVuIGZvciBwYXJhbWV0ZXIsIGluZm9zIG9yIGNvbW1hbmQgdXBkYXRlc1xuICogY29udHJvbC5vbigndXBkYXRlJywgKG5hbWUsIHZhbHVlKSA9PiB7XG4gKiAgIHN3aXRjaChuYW1lKSB7XG4gKiAgICAgY2FzZSAnc3ludGg6Z2Fpbic6XG4gKiAgICAgICBjb25zb2xlLmxvZyhgVXBkYXRlIHRoZSBzeW50aCBnYWluIHRvIHZhbHVlICN7dmFsdWV9LmApO1xuICogICAgICAgYnJlYWs7XG4gKiAgICAgY2FzZSAncmVsb2FkJzpcbiAqICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XG4gKiAgICAgICBicmVhaztcbiAqICAgfVxuICogfSk7XG4gKlxuICogLy8gR2V0IGN1cnJlbnQgdmFsdWUgb2YgYSBwYXJhbWV0ZXIgb3IgaW5mb1xuICogY29uc3QgY3VycmVudFN5bnRoR2FpblZhbHVlID0gY29udHJvbC5ldmVudFsnc3ludGg6Z2FpbiddLnZhbHVlO1xuICogY29uc3QgY3VycmVudE51bVBsYXllcnNWYWx1ZSA9IGNvbnRyb2wuZXZlbnRbJ251bVBsYXllcnMnXS52YWx1ZTtcbiAqL1xuY2xhc3MgQ2xpZW50Q29udHJvbCBleHRlbmRzIFNlcnZpY2Uge1xuICAvKipcbiAgICogQGVtaXRzIHsndXBkYXRlJ30gd2hlbiB0aGUgc2VydmVyIHNlbmRzIGFuIHVwZGF0ZS4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRha2VzIGBuYW1lOlN0cmluZ2AgYW5kIGB2YWx1ZToqYCBhcyBhcmd1bWVudHMsIHdoZXJlIGBuYW1lYCBpcyB0aGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyIC8gaW5mbyAvIGNvbW1hbmQsIGFuZCBgdmFsdWVgIGl0cyBuZXcgdmFsdWUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmhhc0d1aT10cnVlXSAtIEluZGljYXRlcyB3aGV0aGVyIHRvIGNyZWF0ZSB0aGUgZ3JhcGhpY2FsIHVzZXIgaW50ZXJmYWNlIHRvIGNvbnRyb2wgdGhlIHBhcmFtZXRlcnMgb3Igbm90LlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0geyBoYXNHdWk6IGZhbHNlIH07XG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgdGhpcy5fZ3VpT3B0aW9ucyA9IHt9O1xuXG4gICAgdGhpcy5fb25Jbml0UmVzcG9uc2UgPSB0aGlzLl9vbkluaXRSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uVXBkYXRlUmVzcG9uc2UgPSB0aGlzLl9vblVwZGF0ZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIC8qKlxuICAgICAqIERpY3Rpb25hcnkgb2YgYWxsIHRoZSBwYXJhbWV0ZXJzIGFuZCBjb21tYW5kcy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMudW5pdHMgPSB7fTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaGFzR3VpKVxuICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnaW5pdCcsIHRoaXMuX29uSW5pdFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3VwZGF0ZScsIHRoaXMuX29uVXBkYXRlUmVzcG9uc2UpO1xuXG4gICAgLy8gdGhpcy5zaG93KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgLy8gZG9uJ3QgcmVtb3ZlICd1cGRhdGUnIGxpc3RlbmVyLCBhcyB0aGUgY29udHJvbCBpcyBydW5uaWcgYXMgYSBiYWNrZ3JvdW5kIHByb2Nlc3NcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdpbml0JywgdGhpcy5fb25Jbml0UmVzcG9uc2UpO1xuICB9XG5cbiAgX29uSW5pdFJlc3BvbnNlKGNvbmZpZykge1xuICAgIHRoaXMuc2hvdygpO1xuXG4gICAgY29uZmlnLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBjb25zdCB1bml0ID0gdGhpcy5fY3JlYXRlQ29udHJvbFVuaXQoZW50cnkpO1xuICAgICAgdGhpcy51bml0c1t1bml0Lm5hbWVdID0gdW5pdDtcblxuICAgICAgaWYgKHRoaXMudmlldylcbiAgICAgICAgdGhpcy5fY3JlYXRlR3VpKHRoaXMudmlldywgdW5pdCk7XG4gICAgfSk7XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5oYXNHdWkpXG4gICAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICBfb25VcGRhdGVSZXNwb25zZShuYW1lLCB2YWwpIHtcbiAgICAvLyB1cGRhdGUsIGJ1dCBkb24ndCBzZW5kIGJhY2sgdG8gc2VydmVyXG4gICAgdGhpcy51cGRhdGUobmFtZSwgdmFsLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGxpc3RlbmVyIHRvIGEgc3BlY2lmaWMgZXZlbnQgKGkuZS4gcGFyYW1ldGVyLCBpbmZvIG9yIGNvbW1hbmQpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTGlzdGVuZXIgY2FsbGJhY2suXG4gICAqL1xuICBhZGRVbml0TGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCB1bml0ID0gdGhpcy51bml0c1tuYW1lXTtcblxuICAgIGlmICh1bml0KSB7XG4gICAgICB1bml0LmFkZExpc3RlbmVyKCd1cGRhdGUnLCBsaXN0ZW5lcik7XG5cbiAgICAgIGlmICh1bml0LnR5cGUgIT09ICdjb21tYW5kJylcbiAgICAgICAgbGlzdGVuZXIodW5pdC52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHVuaXQgXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnJvbSBhIHNwZWNpZmljIGV2ZW50IChpLmUuIHBhcmFtZXRlciwgaW5mbyBvciBjb21tYW5kKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIExpc3RlbmVyIGNhbGxiYWNrLlxuICAgKi9cbiAgcmVtb3ZlVW5pdExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgdW5pdCA9IHRoaXMudW5pdHNbbmFtZV07XG5cbiAgICBpZiAodW5pdCkge1xuICAgICAgdW5pdC5yZW1vdmVMaXN0ZW5lcigndXBkYXRlJywgbGlzdGVuZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biB1bml0IFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSB2YWx1ZSBvZiBhIGdpdmVuIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcmV0dXJucyB7TWl4ZWR9IC0gVGhlIHJlbGF0ZWQgdmFsdWUuXG4gICAqL1xuICBnZXRWYWx1ZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMudW5pdHNbbmFtZV0udmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgYSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHsoU3RyaW5nfE51bWJlcnxCb29sZWFuKX0gdmFsIC0gTmV3IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3NlbmRUb1NlcnZlcj10cnVlXSAtIEZsYWcgd2hldGhlciB0aGUgdmFsdWUgaXMgc2VudCB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbCwgc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgIGNvbnN0IHVuaXQgPSB0aGlzLnVuaXRzW25hbWVdO1xuXG4gICAgaWYgKHVuaXQpIHtcbiAgICAgIHVuaXQudXBkYXRlKHZhbCwgc2VuZFRvU2VydmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gY29udHJvbCB1bml0IFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICBfY3JlYXRlQ29udHJvbFVuaXQoaW5pdCkge1xuICAgIGNvbnNvbGUubG9nKGluaXQpO1xuICAgIGxldCB1bml0ID0gbnVsbDtcblxuICAgIHN3aXRjaCAoaW5pdC50eXBlKSB7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgdW5pdCA9IG5ldyBfQm9vbGVhblVuaXQodGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2VudW0nOlxuICAgICAgICB1bml0ID0gbmV3IF9FbnVtVW5pdCh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQub3B0aW9ucywgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICB1bml0ID0gbmV3IF9OdW1iZXJVbml0KHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC5taW4sIGluaXQubWF4LCBpbml0LnN0ZXAsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgIHVuaXQgPSBuZXcgX1RleHRVbml0KHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd0cmlnZ2VyJzpcbiAgICAgICAgdW5pdCA9IG5ldyBfVHJpZ2dlclVuaXQodGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuaXQ7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlIHRoZSBHVUkgZm9yIGEgc3BlY2lmaWMgY29udHJvbCB1bml0IChlLmcuIGlmIGl0IHNob3VsZCBhcHBlYXIgb3Igbm90LFxuICAgKiB3aGljaCB0eXBlIG9mIEdVSSB0byB1c2UpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBgdW5pdGAgdG8gY29uZmlndXJlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGFwcGx5IHRvIGNvbmZpZ3VyZSB0aGUgZ2l2ZW4gYHVuaXRgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy50eXBlIC0gVGhlIHR5cGUgb2YgR1VJIHRvIHVzZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93PXRydWVdIC0gU2hvdyB0aGUgR1VJIGZvciB0aGlzIGB1bml0YCBvciBub3QuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuY29uZmlybT1mYWxzZV0gLSBBc2sgZm9yIGNvbmZpcm1hdGlvbiB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgKi9cbiAgc2V0R3VpT3B0aW9ucyhuYW1lLCBvcHRpb25zKSB7XG4gICAgdGhpcy5fZ3VpT3B0aW9uc1tuYW1lXSA9IG9wdGlvbnM7XG4gIH1cblxuICBfY3JlYXRlR3VpKHZpZXcsIHVuaXQpIHtcbiAgICBjb25zdCBjb25maWcgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBjb25maXJtOiBmYWxzZSxcbiAgICB9LCB0aGlzLl9ndWlPcHRpb25zW3VuaXQubmFtZV0pO1xuXG4gICAgaWYgKGNvbmZpZy5zaG93ID09PSBmYWxzZSkgcmV0dXJuIG51bGw7XG5cbiAgICBsZXQgZ3VpID0gbnVsbDtcbiAgICBjb25zdCAkY29udGFpbmVyID0gdGhpcy52aWV3LiRlbDtcblxuICAgIHN3aXRjaCAodW5pdC50eXBlKSB7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgZ3VpID0gbmV3IF9Cb29sZWFuR3VpKCRjb250YWluZXIsIHVuaXQsIGNvbmZpZyk7IC8vIGBUb2dnbGVgXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZW51bSc6XG4gICAgICAgIGd1aSA9IG5ldyBfRW51bUd1aSgkY29udGFpbmVyLCB1bml0LCBjb25maWcpOyAvLyBgU2VsZWN0TGlzdGAgb3IgYFNlbGVjdEJ1dHRvbnNgXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgZ3VpID0gbmV3IF9OdW1iZXJHdWkoJGNvbnRhaW5lciwgdW5pdCwgY29uZmlnKTsgLy8gYE51bWJlckJveGAgb3IgYFNsaWRlcmBcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgZ3VpID0gbmV3IF9UZXh0R3VpKCRjb250YWluZXIsIHVuaXQsIGNvbmZpZyk7IC8vIGBUZXh0YFxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RyaWdnZXInOlxuICAgICAgICBndWkgPSBuZXcgX1RyaWdnZXJHdWkoJGNvbnRhaW5lciwgdW5pdCwgY29uZmlnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdW5pdC5hZGRMaXN0ZW5lcigndXBkYXRlJywgKHZhbCkgPT4gZ3VpLnNldCh2YWwpKTtcblxuICAgIHJldHVybiBndWk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2xpZW50Q29udHJvbCk7XG5cbmV4cG9ydCBkZWZhdWx0IENsaWVudENvbnRyb2w7XG4iXX0=