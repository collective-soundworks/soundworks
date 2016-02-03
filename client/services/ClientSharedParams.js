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

  _createClass(_TriggerGui, [{
    key: 'set',
    value: function set(val) {/* nothing to set here */}
  }]);

  return _TriggerGui;
})();

var SERVICE_ID = 'service:shared-params';

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
 * const control = new ClientSharedParams();
 *
 * // Initialize the client (indicate the client type)
 * client.init('conductor'); // accessible at the URL /conductor
 *
 * // Start the scenario
 * // For this client type (`'conductor'`), there is only one module
 * client.start(control);
 *
 * @example // Example 2: listen for parameter, infos & commands updates
 * const control = new ClientSharedParams({ gui: false });
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

var ClientSharedParams = (function (_Service) {
  _inherits(ClientSharedParams, _Service);

  /**
   * @emits {'update'} when the server sends an update. The callback function takes `name:String` and `value:*` as arguments, where `name` is the name of the parameter / info / command, and `value` its new value.
   */

  function ClientSharedParams() {
    _classCallCheck(this, ClientSharedParams);

    _get(Object.getPrototypeOf(ClientSharedParams.prototype), 'constructor', this).call(this, SERVICE_ID, true);

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

  _createClass(ClientSharedParams, [{
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
      _get(Object.getPrototypeOf(ClientSharedParams.prototype), 'start', this).call(this);

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
      _get(Object.getPrototypeOf(ClientSharedParams.prototype), 'stop', this).call(this);
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

  return ClientSharedParams;
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, ClientSharedParams);

exports['default'] = ClientSharedParams;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50U2hhcmVkUGFyYW1zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQ0FBNkIseUJBQXlCOzs7O3NCQUN6QixRQUFROzsyQkFDakIsaUJBQWlCOzs7O2tDQUNWLHdCQUF3Qjs7OztBQUVuRCxtQ0FBaUIsYUFBYSxFQUFFLENBQUM7Ozs7Ozs7O0lBTzNCLFlBQVk7WUFBWixZQUFZOztBQUNMLFdBRFAsWUFBWSxDQUNKLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTswQkFEcEMsWUFBWTs7QUFFZCwrQkFGRSxZQUFZLDZDQUVOO0FBQ1IsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsUUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7R0FDeEI7Ozs7ZUFSRyxZQUFZOztXQVViLGFBQUMsR0FBRyxFQUFFO0FBQ1AsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDcEI7OztXQUVTLHNCQUFzQjtVQUFyQixZQUFZLHlEQUFHLElBQUk7O0FBQzVCLFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFaEMsVUFBSSxZQUFZLEVBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVyRCxVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDcEQ7OztXQUVLLGdCQUFD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QU07QUFDVCxhQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM3QyxnQkFBTTtBQUFBLEFBQ1IsYUFBSyxTQUFTO0FBQ1osYUFBRyxHQUFHLElBQUksV0FBVyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDaEQsZ0JBQU07QUFBQSxPQUNUOztBQUVELFVBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFVBQUMsR0FBRztlQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO09BQUEsQ0FBQyxDQUFDOztBQUVsRCxhQUFPLEdBQUcsQ0FBQztLQUNaOzs7U0E3TUcsa0JBQWtCOzs7QUFnTnhCLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzs7cUJBRXpDLGtCQUFrQiIsImZpbGUiOiJzcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudFNoYXJlZFBhcmFtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiYXNpY0NvbnRyb2xsZXJzIGZyb20gJ3dhdmVzLWJhc2ljLWNvbnRyb2xsZXJzJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5iYXNpY0NvbnRyb2xsZXJzLmRpc2FibGVTdHlsZXMoKTtcblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vKiBDT05UUk9MIFVOSVRTXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQ29udHJvbFVuaXQgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCB0eXBlLCBuYW1lLCBsYWJlbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb250cm9sID0gY29udHJvbDtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMudmFsdWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgX3Byb3BhZ2F0ZShzZW5kVG9TZXJ2ZXIgPSB0cnVlKSB7XG4gICAgdGhpcy5lbWl0KCd1cGRhdGUnLCB0aGlzLnZhbHVlKTsgLy8gY2FsbCBldmVudCBsaXN0ZW5lcnNcblxuICAgIGlmIChzZW5kVG9TZXJ2ZXIpXG4gICAgICB0aGlzLmNvbnRyb2wuc2VuZCgndXBkYXRlJywgdGhpcy5uYW1lLCB0aGlzLnZhbHVlKTsgLy8gc2VuZCB0byBzZXJ2ZXJcblxuICAgIHRoaXMuY29udHJvbC5lbWl0KCd1cGRhdGUnLCB0aGlzLm5hbWUsIHRoaXMudmFsdWUpOyAvLyBjYWxsIGNvbnRyb2wgbGlzdGVuZXJzXG4gIH1cblxuICB1cGRhdGUodmFsLCBzZW5kVG9TZXJ2ZXIgPSB0cnVlKSB7XG4gICAgdGhpcy5zZXQodmFsKTtcbiAgICB0aGlzLl9wcm9wYWdhdGUoc2VuZFRvU2VydmVyKTtcbiAgfVxufVxuXG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0Jvb2xlYW5Vbml0IGV4dGVuZHMgX0NvbnRyb2xVbml0IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAnYm9vbGVhbicsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0VudW1Vbml0IGV4dGVuZHMgX0NvbnRyb2xVbml0IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIG9wdGlvbnMsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAnZW51bScsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIGxldCBpbmRleCA9IHRoaXMub3B0aW9ucy5pbmRleE9mKHZhbCk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfTnVtYmVyVW5pdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdudW1iZXInLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5taW4gPSBtaW47XG4gICAgdGhpcy5tYXggPSBtYXg7XG4gICAgdGhpcy5zdGVwID0gc3RlcDtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gTWF0aC5taW4odGhpcy5tYXgsIE1hdGgubWF4KHRoaXMubWluLCB2YWwpKTtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UZXh0VW5pdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBpbml0KSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3RleHQnLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UcmlnZ2VyVW5pdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3RyaWdnZXInLCBuYW1lLCBsYWJlbCk7XG4gIH1cblxuICBzZXQodmFsKSB7IC8qIG5vdGhpbmcgdG8gc2V0IGhlcmUgKi8gfVxufVxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8qIEdVSXNcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9Cb29sZWFuR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgdW5pdCwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIHZhbHVlIH0gPSB1bml0O1xuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuVG9nZ2xlKGxhYmVsLCB2YWx1ZSk7XG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAodmFsdWUpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3VuaXQubmFtZX06JHt2YWx1ZX1cImA7XG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgIH1cblxuICAgICAgdW5pdC51cGRhdGUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9FbnVtR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgdW5pdCwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIG9wdGlvbnMsIHZhbHVlIH0gPSB1bml0O1xuXG4gICAgY29uc3QgY3RvciA9IGd1aU9wdGlvbnMudHlwZSA9PT0gJ2J1dHRvbnMnID9cbiAgICAgIGJhc2ljQ29udHJvbGxlcnMuU2VsZWN0QnV0dG9ucyA6IGJhc2ljQ29udHJvbGxlcnMuU2VsZWN0TGlzdFxuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGN0b3IobGFiZWwsIG9wdGlvbnMsIHZhbHVlKTtcbiAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5yZW5kZXIoKSk7XG4gICAgdGhpcy5jb250cm9sbGVyLm9uUmVuZGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIub24oJ2NoYW5nZScsICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7dW5pdC5uYW1lfToke3ZhbHVlfVwiYDtcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtc2cpKSB7IHJldHVybjsgfVxuICAgICAgfVxuXG4gICAgICB1bml0LnVwZGF0ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX051bWJlckd1aSB7XG4gIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIHVuaXQsIGd1aU9wdGlvbnMpIHtcbiAgICBjb25zdCB7IGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdmFsdWUgfSA9IHVuaXQ7XG5cbiAgICBpZiAoZ3VpT3B0aW9ucy50eXBlID09PSAnc2xpZGVyJylcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBiYXNpY0NvbnRyb2xsZXJzLlNsaWRlcihsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIHZhbHVlLCBndWlPcHRpb25zLnVuaXQsIGd1aU9wdGlvbnMuc2l6ZSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuTnVtYmVyQm94KGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdmFsdWUpO1xuXG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAodmFsdWUpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3VuaXQubmFtZX06JHt2YWx1ZX1cImA7XG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgIH1cblxuICAgICAgdW5pdC51cGRhdGUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UZXh0R3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgdW5pdCwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIHZhbHVlIH0gPSB1bml0O1xuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuVGV4dChsYWJlbCwgdmFsdWUsIGd1aU9wdGlvbnMucmVhZE9ubHkpO1xuICAgICRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLnJlbmRlcigpKTtcbiAgICB0aGlzLmNvbnRyb2xsZXIub25SZW5kZXIoKTtcblxuICAgIGlmICghZ3VpT3B0aW9ucy5yZWFkT25seSkge1xuICAgICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7dW5pdC5uYW1lfVwiYDtcbiAgICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICAgIH1cblxuICAgICAgICB1bml0LnVwZGF0ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UcmlnZ2VyR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgdW5pdCwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwgfSA9IHVuaXQ7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgYmFzaWNDb250cm9sbGVycy5CdXR0b25zKCcnLCBbbGFiZWxdKTtcbiAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5yZW5kZXIoKSk7XG4gICAgdGhpcy5jb250cm9sbGVyLm9uUmVuZGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3VuaXQubmFtZX1cImA7XG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgIH1cblxuICAgICAgdW5pdC51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldCh2YWwpIHsgLyogbm90aGluZyB0byBzZXQgaGVyZSAqLyB9XG59XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnNoYXJlZC1wYXJhbXMnO1xuXG4vKipcbiAqIE1hbmFnZSB0aGUgZ2xvYmFsIGNvbnRyb2wgYHBhcmFtZXRlcnNgLCBgaW5mb3NgLCBhbmQgYGNvbW1hbmRzYCBhY3Jvc3MgdGhlIHdob2xlIHNjZW5hcmlvLlxuICpcbiAqIFRoZSBtb2R1bGUga2VlcHMgdHJhY2sgb2Y6XG4gKiAtIGBwYXJhbWV0ZXJzYDogdmFsdWVzIHRoYXQgY2FuIGJlIHVwZGF0ZWQgYnkgdGhlIGFjdGlvbnMgb2YgdGhlIGNsaWVudHMgKCplLmcuKiB0aGUgZ2FpbiBvZiBhIHN5bnRoKTtcbiAqIC0gYGluZm9zYDogaW5mb3JtYXRpb24gYWJvdXQgdGhlIHN0YXRlIG9mIHRoZSBzY2VuYXJpbyAoKmUuZy4qIG51bWJlciBvZiBjbGllbnRzIGluIHRoZSBwZXJmb3JtYW5jZSk7XG4gKiAtIGBjb21tYW5kc2A6IGNhbiB0cmlnZ2VyIGFuIGFjdGlvbiAoKmUuZy4qIHJlbG9hZCB0aGUgcGFnZSkuXG4gKlxuICogSWYgdGhlIG1vZHVsZSBpcyBpbnN0YW50aWF0ZWQgd2l0aCB0aGUgYGd1aWAgb3B0aW9uIHNldCB0byBgdHJ1ZWAsIGl0IGNvbnN0cnVjdHMgYSBncmFwaGljYWwgaW50ZXJmYWNlIHRvIG1vZGlmeSB0aGUgcGFyYW1ldGVycywgdmlldyB0aGUgaW5mb3MsIGFuZCB0cmlnZ2VyIHRoZSBjb21tYW5kcy5cbiAqIE90aGVyd2lzZSAoYGd1aWAgb3B0aW9uIHNldCB0byBgZmFsc2VgKSB0aGUgbW9kdWxlIGVtaXRzIGFuIGV2ZW50IHdoZW4gaXQgcmVjZWl2ZXMgdXBkYXRlZCB2YWx1ZXMgZnJvbSB0aGUgc2VydmVyLlxuICpcbiAqIFdoZW4gdGhlIEdVSSBpcyBkaXNhYmxlZCwgdGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gaW1tZWRpYXRlbHkgYWZ0ZXIgaGF2aW5nIHNldCB1cCB0aGUgY29udHJvbHMuXG4gKiBPdGhlcndpc2UgKEdVSSBlbmFibGVkKSwgdGhlIG1vZHVsZXMgcmVtYWlucyBpbiBpdHMgc3RhdGUgYW5kIG5ldmVyIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbi5cbiAqXG4gKiBXaGVuIHRoZSBtb2R1bGUgYSB2aWV3IChgZ3VpYCBvcHRpb24gc2V0IHRvIGB0cnVlYCksIGl0IHJlcXVpcmVzIHRoZSBTQVNTIHBhcnRpYWwgYF83Ny1jaGVja2luLnNjc3NgLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJDb250cm9sLmpzflNlcnZlckNvbnRyb2x9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGUgLy8gRXhhbXBsZSAxOiBtYWtlIGEgY2xpZW50IHRoYXQgZGlzcGxheXMgdGhlIGNvbnRyb2wgR1VJXG4gKiBjb25zdCBjb250cm9sID0gbmV3IENsaWVudFNoYXJlZFBhcmFtcygpO1xuICpcbiAqIC8vIEluaXRpYWxpemUgdGhlIGNsaWVudCAoaW5kaWNhdGUgdGhlIGNsaWVudCB0eXBlKVxuICogY2xpZW50LmluaXQoJ2NvbmR1Y3RvcicpOyAvLyBhY2Nlc3NpYmxlIGF0IHRoZSBVUkwgL2NvbmR1Y3RvclxuICpcbiAqIC8vIFN0YXJ0IHRoZSBzY2VuYXJpb1xuICogLy8gRm9yIHRoaXMgY2xpZW50IHR5cGUgKGAnY29uZHVjdG9yJ2ApLCB0aGVyZSBpcyBvbmx5IG9uZSBtb2R1bGVcbiAqIGNsaWVudC5zdGFydChjb250cm9sKTtcbiAqXG4gKiBAZXhhbXBsZSAvLyBFeGFtcGxlIDI6IGxpc3RlbiBmb3IgcGFyYW1ldGVyLCBpbmZvcyAmIGNvbW1hbmRzIHVwZGF0ZXNcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgQ2xpZW50U2hhcmVkUGFyYW1zKHsgZ3VpOiBmYWxzZSB9KTtcbiAqXG4gKiAvLyBMaXN0ZW4gZm9yIHBhcmFtZXRlciwgaW5mb3Mgb3IgY29tbWFuZCB1cGRhdGVzXG4gKiBjb250cm9sLm9uKCd1cGRhdGUnLCAobmFtZSwgdmFsdWUpID0+IHtcbiAqICAgc3dpdGNoKG5hbWUpIHtcbiAqICAgICBjYXNlICdzeW50aDpnYWluJzpcbiAqICAgICAgIGNvbnNvbGUubG9nKGBVcGRhdGUgdGhlIHN5bnRoIGdhaW4gdG8gdmFsdWUgI3t2YWx1ZX0uYCk7XG4gKiAgICAgICBicmVhaztcbiAqICAgICBjYXNlICdyZWxvYWQnOlxuICogICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcbiAqICAgICAgIGJyZWFrO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiAvLyBHZXQgY3VycmVudCB2YWx1ZSBvZiBhIHBhcmFtZXRlciBvciBpbmZvXG4gKiBjb25zdCBjdXJyZW50U3ludGhHYWluVmFsdWUgPSBjb250cm9sLmV2ZW50WydzeW50aDpnYWluJ10udmFsdWU7XG4gKiBjb25zdCBjdXJyZW50TnVtUGxheWVyc1ZhbHVlID0gY29udHJvbC5ldmVudFsnbnVtUGxheWVycyddLnZhbHVlO1xuICovXG5jbGFzcyBDbGllbnRTaGFyZWRQYXJhbXMgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqXG4gICAqIEBlbWl0cyB7J3VwZGF0ZSd9IHdoZW4gdGhlIHNlcnZlciBzZW5kcyBhbiB1cGRhdGUuIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0YWtlcyBgbmFtZTpTdHJpbmdgIGFuZCBgdmFsdWU6KmAgYXMgYXJndW1lbnRzLCB3aGVyZSBgbmFtZWAgaXMgdGhlIG5hbWUgb2YgdGhlIHBhcmFtZXRlciAvIGluZm8gLyBjb21tYW5kLCBhbmQgYHZhbHVlYCBpdHMgbmV3IHZhbHVlLlxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5oYXNHdWk9dHJ1ZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB0byBjcmVhdGUgdGhlIGdyYXBoaWNhbCB1c2VyIGludGVyZmFjZSB0byBjb250cm9sIHRoZSBwYXJhbWV0ZXJzIG9yIG5vdC5cbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHsgaGFzR3VpOiBmYWxzZSB9O1xuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIC8qKiBAcHJpdmF0ZSAqL1xuICAgIHRoaXMuX2d1aU9wdGlvbnMgPSB7fTtcblxuICAgIHRoaXMuX29uSW5pdFJlc3BvbnNlID0gdGhpcy5fb25Jbml0UmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblVwZGF0ZVJlc3BvbnNlID0gdGhpcy5fb25VcGRhdGVSZXNwb25zZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBEaWN0aW9uYXJ5IG9mIGFsbCB0aGUgcGFyYW1ldGVycyBhbmQgY29tbWFuZHMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnVuaXRzID0ge307XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmhhc0d1aSlcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ2luaXQnLCB0aGlzLl9vbkluaXRSZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCd1cGRhdGUnLCB0aGlzLl9vblVwZGF0ZVJlc3BvbnNlKTtcblxuICAgIC8vIHRoaXMuc2hvdygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICAgIC8vIGRvbid0IHJlbW92ZSAndXBkYXRlJyBsaXN0ZW5lciwgYXMgdGhlIGNvbnRyb2wgaXMgcnVubmlnIGFzIGEgYmFja2dyb3VuZCBwcm9jZXNzXG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignaW5pdCcsIHRoaXMuX29uSW5pdFJlc3BvbnNlKTtcbiAgfVxuXG4gIF9vbkluaXRSZXNwb25zZShjb25maWcpIHtcbiAgICB0aGlzLnNob3coKTtcblxuICAgIGNvbmZpZy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgY29uc3QgdW5pdCA9IHRoaXMuX2NyZWF0ZUNvbnRyb2xVbml0KGVudHJ5KTtcbiAgICAgIHRoaXMudW5pdHNbdW5pdC5uYW1lXSA9IHVuaXQ7XG5cbiAgICAgIGlmICh0aGlzLnZpZXcpXG4gICAgICAgIHRoaXMuX2NyZWF0ZUd1aSh0aGlzLnZpZXcsIHVuaXQpO1xuICAgIH0pO1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuaGFzR3VpKVxuICAgICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgX29uVXBkYXRlUmVzcG9uc2UobmFtZSwgdmFsKSB7XG4gICAgLy8gdXBkYXRlLCBidXQgZG9uJ3Qgc2VuZCBiYWNrIHRvIHNlcnZlclxuICAgIHRoaXMudXBkYXRlKG5hbWUsIHZhbCwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBsaXN0ZW5lciB0byBhIHNwZWNpZmljIGV2ZW50IChpLmUuIHBhcmFtZXRlciwgaW5mbyBvciBjb21tYW5kKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIExpc3RlbmVyIGNhbGxiYWNrLlxuICAgKi9cbiAgYWRkVW5pdExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgdW5pdCA9IHRoaXMudW5pdHNbbmFtZV07XG5cbiAgICBpZiAodW5pdCkge1xuICAgICAgdW5pdC5hZGRMaXN0ZW5lcigndXBkYXRlJywgbGlzdGVuZXIpO1xuXG4gICAgICBpZiAodW5pdC50eXBlICE9PSAnY29tbWFuZCcpXG4gICAgICAgIGxpc3RlbmVyKHVuaXQudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biB1bml0IFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZyb20gYSBzcGVjaWZpYyBldmVudCAoaS5lLiBwYXJhbWV0ZXIsIGluZm8gb3IgY29tbWFuZCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBMaXN0ZW5lciBjYWxsYmFjay5cbiAgICovXG4gIHJlbW92ZVVuaXRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IHVuaXQgPSB0aGlzLnVuaXRzW25hbWVdO1xuXG4gICAgaWYgKHVuaXQpIHtcbiAgICAgIHVuaXQucmVtb3ZlTGlzdGVuZXIoJ3VwZGF0ZScsIGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gdW5pdCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgdmFsdWUgb2YgYSBnaXZlbiBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHJldHVybnMge01peGVkfSAtIFRoZSByZWxhdGVkIHZhbHVlLlxuICAgKi9cbiAgZ2V0VmFsdWUobmFtZSkge1xuICAgIHJldHVybiB0aGlzLnVuaXRzW25hbWVdLnZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHZhbHVlIG9mIGEgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7KFN0cmluZ3xOdW1iZXJ8Qm9vbGVhbil9IHZhbCAtIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtzZW5kVG9TZXJ2ZXI9dHJ1ZV0gLSBGbGFnIHdoZXRoZXIgdGhlIHZhbHVlIGlzIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHVwZGF0ZShuYW1lLCB2YWwsIHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICBjb25zdCB1bml0ID0gdGhpcy51bml0c1tuYW1lXTtcblxuICAgIGlmICh1bml0KSB7XG4gICAgICB1bml0LnVwZGF0ZSh2YWwsIHNlbmRUb1NlcnZlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIGNvbnRyb2wgdW5pdCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgX2NyZWF0ZUNvbnRyb2xVbml0KGluaXQpIHtcbiAgICBsZXQgdW5pdCA9IG51bGw7XG5cbiAgICBzd2l0Y2ggKGluaXQudHlwZSkge1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIHVuaXQgPSBuZXcgX0Jvb2xlYW5Vbml0KHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdlbnVtJzpcbiAgICAgICAgdW5pdCA9IG5ldyBfRW51bVVuaXQodGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0Lm9wdGlvbnMsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgdW5pdCA9IG5ldyBfTnVtYmVyVW5pdCh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQubWluLCBpbml0Lm1heCwgaW5pdC5zdGVwLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICB1bml0ID0gbmV3IF9UZXh0VW5pdCh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAndHJpZ2dlcic6XG4gICAgICAgIHVuaXQgPSBuZXcgX1RyaWdnZXJVbml0KHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiB1bml0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSB0aGUgR1VJIGZvciBhIHNwZWNpZmljIGNvbnRyb2wgdW5pdCAoZS5nLiBpZiBpdCBzaG91bGQgYXBwZWFyIG9yIG5vdCxcbiAgICogd2hpY2ggdHlwZSBvZiBHVUkgdG8gdXNlKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgYHVuaXRgIHRvIGNvbmZpZ3VyZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBhcHBseSB0byBjb25maWd1cmUgdGhlIGdpdmVuIGB1bml0YC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMudHlwZSAtIFRoZSB0eXBlIG9mIEdVSSB0byB1c2UuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvdz10cnVlXSAtIFNob3cgdGhlIEdVSSBmb3IgdGhpcyBgdW5pdGAgb3Igbm90LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmNvbmZpcm09ZmFsc2VdIC0gQXNrIGZvciBjb25maXJtYXRpb24gd2hlbiB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICovXG4gIHNldEd1aU9wdGlvbnMobmFtZSwgb3B0aW9ucykge1xuICAgIHRoaXMuX2d1aU9wdGlvbnNbbmFtZV0gPSBvcHRpb25zO1xuICB9XG5cbiAgX2NyZWF0ZUd1aSh2aWV3LCB1bml0KSB7XG4gICAgY29uc3QgY29uZmlnID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgY29uZmlybTogZmFsc2UsXG4gICAgfSwgdGhpcy5fZ3VpT3B0aW9uc1t1bml0Lm5hbWVdKTtcblxuICAgIGlmIChjb25maWcuc2hvdyA9PT0gZmFsc2UpIHJldHVybiBudWxsO1xuXG4gICAgbGV0IGd1aSA9IG51bGw7XG4gICAgY29uc3QgJGNvbnRhaW5lciA9IHRoaXMudmlldy4kZWw7XG5cbiAgICBzd2l0Y2ggKHVuaXQudHlwZSkge1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIGd1aSA9IG5ldyBfQm9vbGVhbkd1aSgkY29udGFpbmVyLCB1bml0LCBjb25maWcpOyAvLyBgVG9nZ2xlYFxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2VudW0nOlxuICAgICAgICBndWkgPSBuZXcgX0VudW1HdWkoJGNvbnRhaW5lciwgdW5pdCwgY29uZmlnKTsgLy8gYFNlbGVjdExpc3RgIG9yIGBTZWxlY3RCdXR0b25zYFxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGd1aSA9IG5ldyBfTnVtYmVyR3VpKCRjb250YWluZXIsIHVuaXQsIGNvbmZpZyk7IC8vIGBOdW1iZXJCb3hgIG9yIGBTbGlkZXJgXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgIGd1aSA9IG5ldyBfVGV4dEd1aSgkY29udGFpbmVyLCB1bml0LCBjb25maWcpOyAvLyBgVGV4dGBcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0cmlnZ2VyJzpcbiAgICAgICAgZ3VpID0gbmV3IF9UcmlnZ2VyR3VpKCRjb250YWluZXIsIHVuaXQsIGNvbmZpZyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHVuaXQuYWRkTGlzdGVuZXIoJ3VwZGF0ZScsICh2YWwpID0+IGd1aS5zZXQodmFsKSk7XG5cbiAgICByZXR1cm4gZ3VpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIENsaWVudFNoYXJlZFBhcmFtcyk7XG5cbmV4cG9ydCBkZWZhdWx0IENsaWVudFNoYXJlZFBhcmFtcztcbiJdfQ==