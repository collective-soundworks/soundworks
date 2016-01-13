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

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

var _events = require('events');

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

  /* --------------------------------------------------------- */
  /* GUIs
  /* --------------------------------------------------------- */

  /** @private */

  _createClass(_CommandUnit, [{
    key: 'set',
    value: function set(val) {
      // nothing to set here
    }
  }]);

  return _CommandUnit;
})(_ControlUnit);

var _NumberGui = (function () {
  function _NumberGui($container, unit, guiOptions) {
    _classCallCheck(this, _NumberGui);

    var label = unit.label;
    var min = unit.min;
    var max = unit.max;
    var step = unit.step;
    var value = unit.value;

    if (guiOptions.type === 'slider') {
      this.controller = new _wavesBasicControllers2['default'].Slider(label, min, max, step, value, guiOptions.unit, guiOptions.size);
    } else {
      this.controller = new _wavesBasicControllers2['default'].NumberBox(label, min, max, step, value);
    }

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

  _createClass(_InfoGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);

  return _InfoGui;
})();

var ClientControl = (function (_ClientModule) {
  _inherits(ClientControl, _ClientModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='sync'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {Boolean} [options.gui=true] Indicates whether to create the graphical user interface to control the parameters or not.
   * @emits {'update'} when the server sends an update. The callback function takes `name:String` and `value:*` as arguments, where `name` is the name of the parameter / info / command, and `value` its new value.
   */

  function ClientControl() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientControl);

    _get(Object.getPrototypeOf(ClientControl.prototype), 'constructor', this).call(this, options.name || 'control', options);

    /**
     * Dictionary of all the parameters and commands.
     * @type {Object}
     */
    this.units = {};

    /**
     * Flag whether client has control GUI.
     * @type {Boolean}
     */
    this.hasGui = options.hasGui;

    this._guiOptions = {};

    this.init();
  }

  _createClass(ClientControl, [{
    key: 'init',
    value: function init() {
      if (this.hasGui) {
        this.view = this.createView();
      }
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
        listener(unit.value);
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

      if (config.show === false) {
        return null;
      }

      var gui = null;
      var $container = this.view.$el;

      switch (unit.type) {
        case 'number':
          // `NumberBox` or `Slider`
          gui = new _NumberGui($container, unit, config);
          break;

        case 'enum':
          // `SelectList` or `SelectButtons`
          gui = new _EnumGui($container, unit, config);
          break;

        case 'command':
          // `Button`
          gui = new _CommandGui($container, unit, config);
          break;

        case 'info':
          // `Info`
          gui = new _InfoGui($container, unit, config);
          break;

        // case 'toggle'
      }

      unit.addListener('update', function (val) {
        return gui.set(val);
      });

      return gui;
    }

    /**
     * Starts the module and requests the parameters to the server.
     */
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(ClientControl.prototype), 'start', this).call(this);
      this.send('request');

      var view = this.hasGui ? this.view : null;

      this.receive('init', function (config) {
        config.forEach(function (entry) {
          var unit = _this._createControlUnit(entry);
          _this.units[unit.name] = unit;

          if (view) {
            _this._createGui(view, unit);
          }
        });

        if (!view) {
          _this.done();
        }
      });

      // listen to events
      this.receive('update', function (name, val) {
        _this.update(name, val, false); // update, but don't send to server
      });
    }

    /**
     * Restarts the module and requests the parameters to the server.
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(ClientControl.prototype), 'restart', this).call(this);
      this.send('request');
    }
  }]);

  return ClientControl;
})(_ClientModule3['default']);

exports['default'] = ClientControl;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7cUNBQTZCLHlCQUF5Qjs7Ozs2QkFDN0IsZ0JBQWdCOzs7O3NCQUNaLFFBQVE7O0FBRXJDLG1DQUFpQixhQUFhLEVBQUUsQ0FBQzs7Ozs7Ozs7SUFPM0IsWUFBWTtZQUFaLFlBQVk7O0FBQ0wsV0FEUCxZQUFZLENBQ0osT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFOzBCQURwQyxZQUFZOztBQUVkLCtCQUZFLFlBQVksNkNBRU47QUFDUixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixRQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztHQUN4Qjs7OztlQVJHLFlBQVk7O1dBVWIsYUFBQyxHQUFHLEVBQUU7QUFDUCxVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjs7O1dBRVMsc0JBQXNCO1VBQXJCLFlBQVkseURBQUcsSUFBSTs7QUFDNUIsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVoQyxVQUFJLFlBQVksRUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXJELFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwRDs7O1dBRUssZ0JBQUMsR0FBRyxFQUF1QjtVQUFyQixZQUFZLHlEQUFHLElB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QUFDO1NBQUU7T0FDNUIsQ0FBQyxDQUFDOzs7QUFHSCxVQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFDLElBQUksRUFBRSxHQUFHLEVBQUs7QUFDcEMsY0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUMvQixDQUFDLENBQUM7S0FDSjs7Ozs7OztXQUtNLG1CQUFHO0FBQ1IsaUNBbE1pQixhQUFhLHlDQWtNZDtBQUNoQixVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3RCOzs7U0FwTWtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q29udHJvbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiYXNpY0NvbnRyb2xsZXJzIGZyb20gJ3dhdmVzLWJhc2ljLWNvbnRyb2xsZXJzJztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuYmFzaWNDb250cm9sbGVycy5kaXNhYmxlU3R5bGVzKCk7XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLyogQ09OVFJPTCBVTklUU1xuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0NvbnRyb2xVbml0IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgdHlwZSwgbmFtZSwgbGFiZWwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY29udHJvbCA9IGNvbnRyb2w7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIF9wcm9wYWdhdGUoc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgIHRoaXMuZW1pdCgndXBkYXRlJywgdGhpcy52YWx1ZSk7IC8vIGNhbGwgZXZlbnQgbGlzdGVuZXJzXG5cbiAgICBpZiAoc2VuZFRvU2VydmVyKVxuICAgICAgdGhpcy5jb250cm9sLnNlbmQoJ3VwZGF0ZScsIHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7IC8vIHNlbmQgdG8gc2VydmVyXG5cbiAgICB0aGlzLmNvbnRyb2wuZW1pdCgndXBkYXRlJywgdGhpcy5uYW1lLCB0aGlzLnZhbHVlKTsgLy8gY2FsbCBjb250cm9sIGxpc3RlbmVyc1xuICB9XG5cbiAgdXBkYXRlKHZhbCwgc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgIHRoaXMuc2V0KHZhbCk7XG4gICAgdGhpcy5fcHJvcGFnYXRlKHNlbmRUb1NlcnZlcik7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfTnVtYmVyVW5pdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdudW1iZXInLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5taW4gPSBtaW47XG4gICAgdGhpcy5tYXggPSBtYXg7XG4gICAgdGhpcy5zdGVwID0gc3RlcDtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gTWF0aC5taW4odGhpcy5tYXgsIE1hdGgubWF4KHRoaXMubWluLCB2YWwpKTtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9FbnVtVW5pdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0KSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2VudW0nLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLm9wdGlvbnMuaW5kZXhPZih2YWwpO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gICAgfVxuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0luZm9Vbml0IGV4dGVuZHMgX0NvbnRyb2xVbml0IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAnaW5mbycsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0NvbW1hbmRVbml0IGV4dGVuZHMgX0NvbnRyb2xVbml0IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwpIHtcbiAgICBzdXBlcihjb250cm9sLCAnY29tbWFuZCcsIG5hbWUsIGxhYmVsKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICAvLyBub3RoaW5nIHRvIHNldCBoZXJlXG4gIH1cbn1cblxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8qIEdVSXNcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9OdW1iZXJHdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCB1bml0LCBndWlPcHRpb25zKSB7XG4gICAgY29uc3QgeyBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIHZhbHVlIH0gPSB1bml0O1xuXG4gICAgaWYgKGd1aU9wdGlvbnMudHlwZSA9PT0gJ3NsaWRlcicpIHtcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBiYXNpY0NvbnRyb2xsZXJzLlNsaWRlcihsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIHZhbHVlLCBndWlPcHRpb25zLnVuaXQsIGd1aU9wdGlvbnMuc2l6ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBiYXNpY0NvbnRyb2xsZXJzLk51bWJlckJveChsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIHZhbHVlKTtcbiAgICB9XG5cbiAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5yZW5kZXIoKSk7XG4gICAgdGhpcy5jb250cm9sbGVyLm9uUmVuZGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIub24oJ2NoYW5nZScsICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7dW5pdC5uYW1lfToke3ZhbHVlfVwiYDtcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtc2cpKSB7IHJldHVybjsgfVxuICAgICAgfVxuXG4gICAgICB1bml0LnVwZGF0ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0VudW1HdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCB1bml0LCBndWlPcHRpb25zKSB7XG4gICAgY29uc3QgeyBsYWJlbCwgb3B0aW9ucywgdmFsdWUgfSA9IHVuaXQ7XG5cbiAgICBjb25zdCBjdG9yID0gZ3VpT3B0aW9ucy50eXBlID09PSAnYnV0dG9ucycgP1xuICAgICAgYmFzaWNDb250cm9sbGVycy5TZWxlY3RCdXR0b25zIDogYmFzaWNDb250cm9sbGVycy5TZWxlY3RMaXN0XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgY3RvcihsYWJlbCwgb3B0aW9ucywgdmFsdWUpO1xuICAgICRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLnJlbmRlcigpKTtcbiAgICB0aGlzLmNvbnRyb2xsZXIub25SZW5kZXIoKTtcblxuICAgIHRoaXMuY29udHJvbGxlci5vbignY2hhbmdlJywgKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoZ3VpT3B0aW9ucy5jb25maXJtKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIFwiJHt1bml0Lm5hbWV9OiR7dmFsdWV9XCJgO1xuICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICB9XG5cbiAgICAgIHVuaXQudXBkYXRlKHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQ29tbWFuZEd1aSB7XG4gIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIHVuaXQsIGd1aU9wdGlvbnMpIHtcbiAgICBjb25zdCB7IGxhYmVsIH0gPSB1bml0O1xuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuQnV0dG9ucygnJywgW2xhYmVsXSk7XG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBpZiAoZ3VpT3B0aW9ucy5jb25maXJtKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIFwiJHt1bml0Lm5hbWV9XCJgO1xuICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICB9XG5cbiAgICAgIHVuaXQudXBkYXRlKCk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsKSB7IC8qIG5vdGhpbmcgdG8gc2V0IGhlcmUgKi8gfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9JbmZvR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgdW5pdCwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIHZhbHVlIH0gPSB1bml0O1xuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuSW5mbyhsYWJlbCwgdmFsdWUpO1xuICAgICRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLnJlbmRlcigpKTtcbiAgICB0aGlzLmNvbnRyb2xsZXIub25SZW5kZXIoKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqXG4gKiBNYW5hZ2UgdGhlIGdsb2JhbCBjb250cm9sIGBwYXJhbWV0ZXJzYCwgYGluZm9zYCwgYW5kIGBjb21tYW5kc2AgYWNyb3NzIHRoZSB3aG9sZSBzY2VuYXJpby5cbiAqXG4gKiBUaGUgbW9kdWxlIGtlZXBzIHRyYWNrIG9mOlxuICogLSBgcGFyYW1ldGVyc2A6IHZhbHVlcyB0aGF0IGNhbiBiZSB1cGRhdGVkIGJ5IHRoZSBhY3Rpb25zIG9mIHRoZSBjbGllbnRzICgqZS5nLiogdGhlIGdhaW4gb2YgYSBzeW50aCk7XG4gKiAtIGBpbmZvc2A6IGluZm9ybWF0aW9uIGFib3V0IHRoZSBzdGF0ZSBvZiB0aGUgc2NlbmFyaW8gKCplLmcuKiBudW1iZXIgb2YgY2xpZW50cyBpbiB0aGUgcGVyZm9ybWFuY2UpO1xuICogLSBgY29tbWFuZHNgOiBjYW4gdHJpZ2dlciBhbiBhY3Rpb24gKCplLmcuKiByZWxvYWQgdGhlIHBhZ2UpLlxuICpcbiAqIElmIHRoZSBtb2R1bGUgaXMgaW5zdGFudGlhdGVkIHdpdGggdGhlIGBndWlgIG9wdGlvbiBzZXQgdG8gYHRydWVgLCBpdCBjb25zdHJ1Y3RzIGEgZ3JhcGhpY2FsIGludGVyZmFjZSB0byBtb2RpZnkgdGhlIHBhcmFtZXRlcnMsIHZpZXcgdGhlIGluZm9zLCBhbmQgdHJpZ2dlciB0aGUgY29tbWFuZHMuXG4gKiBPdGhlcndpc2UgKGBndWlgIG9wdGlvbiBzZXQgdG8gYGZhbHNlYCkgdGhlIG1vZHVsZSBlbWl0cyBhbiBldmVudCB3aGVuIGl0IHJlY2VpdmVzIHVwZGF0ZWQgdmFsdWVzIGZyb20gdGhlIHNlcnZlci5cbiAqXG4gKiBXaGVuIHRoZSBHVUkgaXMgZGlzYWJsZWQsIHRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIGltbWVkaWF0ZWx5IGFmdGVyIGhhdmluZyBzZXQgdXAgdGhlIGNvbnRyb2xzLlxuICogT3RoZXJ3aXNlIChHVUkgZW5hYmxlZCksIHRoZSBtb2R1bGVzIHJlbWFpbnMgaW4gaXRzIHN0YXRlIGFuZCBuZXZlciBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24uXG4gKlxuICogV2hlbiB0aGUgbW9kdWxlIGEgdmlldyAoYGd1aWAgb3B0aW9uIHNldCB0byBgdHJ1ZWApLCBpdCByZXF1aXJlcyB0aGUgU0FTUyBwYXJ0aWFsIGBfNzctY2hlY2tpbi5zY3NzYC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyQ29udHJvbC5qc35TZXJ2ZXJDb250cm9sfSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlIC8vIEV4YW1wbGUgMTogbWFrZSBhIGNsaWVudCB0aGF0IGRpc3BsYXlzIHRoZSBjb250cm9sIEdVSVxuICogY29uc3QgY29udHJvbCA9IG5ldyBDbGllbnRDb250cm9sKCk7XG4gKlxuICogLy8gSW5pdGlhbGl6ZSB0aGUgY2xpZW50IChpbmRpY2F0ZSB0aGUgY2xpZW50IHR5cGUpXG4gKiBjbGllbnQuaW5pdCgnY29uZHVjdG9yJyk7IC8vIGFjY2Vzc2libGUgYXQgdGhlIFVSTCAvY29uZHVjdG9yXG4gKlxuICogLy8gU3RhcnQgdGhlIHNjZW5hcmlvXG4gKiAvLyBGb3IgdGhpcyBjbGllbnQgdHlwZSAoYCdjb25kdWN0b3InYCksIHRoZXJlIGlzIG9ubHkgb25lIG1vZHVsZVxuICogY2xpZW50LnN0YXJ0KGNvbnRyb2wpO1xuICpcbiAqIEBleGFtcGxlIC8vIEV4YW1wbGUgMjogbGlzdGVuIGZvciBwYXJhbWV0ZXIsIGluZm9zICYgY29tbWFuZHMgdXBkYXRlc1xuICogY29uc3QgY29udHJvbCA9IG5ldyBDbGllbnRDb250cm9sKHsgZ3VpOiBmYWxzZSB9KTtcbiAqXG4gKiAvLyBMaXN0ZW4gZm9yIHBhcmFtZXRlciwgaW5mb3Mgb3IgY29tbWFuZCB1cGRhdGVzXG4gKiBjb250cm9sLm9uKCd1cGRhdGUnLCAobmFtZSwgdmFsdWUpID0+IHtcbiAqICAgc3dpdGNoKG5hbWUpIHtcbiAqICAgICBjYXNlICdzeW50aDpnYWluJzpcbiAqICAgICAgIGNvbnNvbGUubG9nKGBVcGRhdGUgdGhlIHN5bnRoIGdhaW4gdG8gdmFsdWUgI3t2YWx1ZX0uYCk7XG4gKiAgICAgICBicmVhaztcbiAqICAgICBjYXNlICdyZWxvYWQnOlxuICogICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcbiAqICAgICAgIGJyZWFrO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiAvLyBHZXQgY3VycmVudCB2YWx1ZSBvZiBhIHBhcmFtZXRlciBvciBpbmZvXG4gKiBjb25zdCBjdXJyZW50U3ludGhHYWluVmFsdWUgPSBjb250cm9sLmV2ZW50WydzeW50aDpnYWluJ10udmFsdWU7XG4gKiBjb25zdCBjdXJyZW50TnVtUGxheWVyc1ZhbHVlID0gY29udHJvbC5ldmVudFsnbnVtUGxheWVycyddLnZhbHVlO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRDb250cm9sIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3N5bmMnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZ3VpPXRydWVdIEluZGljYXRlcyB3aGV0aGVyIHRvIGNyZWF0ZSB0aGUgZ3JhcGhpY2FsIHVzZXIgaW50ZXJmYWNlIHRvIGNvbnRyb2wgdGhlIHBhcmFtZXRlcnMgb3Igbm90LlxuICAgKiBAZW1pdHMgeyd1cGRhdGUnfSB3aGVuIHRoZSBzZXJ2ZXIgc2VuZHMgYW4gdXBkYXRlLiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGFrZXMgYG5hbWU6U3RyaW5nYCBhbmQgYHZhbHVlOipgIGFzIGFyZ3VtZW50cywgd2hlcmUgYG5hbWVgIGlzIHRoZSBuYW1lIG9mIHRoZSBwYXJhbWV0ZXIgLyBpbmZvIC8gY29tbWFuZCwgYW5kIGB2YWx1ZWAgaXRzIG5ldyB2YWx1ZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY29udHJvbCcsIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogRGljdGlvbmFyeSBvZiBhbGwgdGhlIHBhcmFtZXRlcnMgYW5kIGNvbW1hbmRzLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy51bml0cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogRmxhZyB3aGV0aGVyIGNsaWVudCBoYXMgY29udHJvbCBHVUkuXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5oYXNHdWkgPSBvcHRpb25zLmhhc0d1aTtcblxuICAgIHRoaXMuX2d1aU9wdGlvbnMgPSB7fTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAodGhpcy5oYXNHdWkpIHtcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGlzdGVuZXIgdG8gYSBzcGVjaWZpYyBldmVudCAoaS5lLiBwYXJhbWV0ZXIsIGluZm8gb3IgY29tbWFuZCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBMaXN0ZW5lciBjYWxsYmFjay5cbiAgICovXG4gIGFkZFVuaXRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IHVuaXQgPSB0aGlzLnVuaXRzW25hbWVdO1xuXG4gICAgaWYgKHVuaXQpIHtcbiAgICAgIHVuaXQuYWRkTGlzdGVuZXIoJ3VwZGF0ZScsIGxpc3RlbmVyKTtcbiAgICAgIGxpc3RlbmVyKHVuaXQudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biB1bml0IFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZyb20gYSBzcGVjaWZpYyBldmVudCAoaS5lLiBwYXJhbWV0ZXIsIGluZm8gb3IgY29tbWFuZCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBMaXN0ZW5lciBjYWxsYmFjay5cbiAgICovXG4gIHJlbW92ZVVuaXRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IHVuaXQgPSB0aGlzLnVuaXRzW25hbWVdO1xuXG4gICAgaWYgKHVuaXQpIHtcbiAgICAgIHVuaXQucmVtb3ZlTGlzdGVuZXIoJ3VwZGF0ZScsIGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gdW5pdCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0VmFsdWUobmFtZSkge1xuICAgIHJldHVybiB0aGlzLnVuaXRzW25hbWVdLnZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHZhbHVlIG9mIGEgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7KFN0cmluZ3xOdW1iZXJ8Qm9vbGVhbil9IHZhbCAtIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtzZW5kVG9TZXJ2ZXI9dHJ1ZV0gLSBGbGFnIHdoZXRoZXIgdGhlIHZhbHVlIGlzIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHVwZGF0ZShuYW1lLCB2YWwsIHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICBjb25zdCB1bml0ID0gdGhpcy51bml0c1tuYW1lXTtcblxuICAgIGlmICh1bml0KSB7XG4gICAgICB1bml0LnVwZGF0ZSh2YWwsIHNlbmRUb1NlcnZlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIGNvbnRyb2wgdW5pdCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgX2NyZWF0ZUNvbnRyb2xVbml0KGluaXQpIHtcbiAgICBsZXQgdW5pdCA9IG51bGw7XG5cbiAgICBzd2l0Y2ggKGluaXQudHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgdW5pdCA9IG5ldyBfTnVtYmVyVW5pdCh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQubWluLCBpbml0Lm1heCwgaW5pdC5zdGVwLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2VudW0nOlxuICAgICAgICB1bml0ID0gbmV3IF9FbnVtVW5pdCh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQub3B0aW9ucywgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdpbmZvJzpcbiAgICAgICAgdW5pdCA9IG5ldyBfSW5mb1VuaXQodGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2NvbW1hbmQnOlxuICAgICAgICB1bml0ID0gbmV3IF9Db21tYW5kVW5pdCh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gdW5pdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgdGhlIEdVSSBmb3IgYSBzcGVjaWZpYyBjb250cm9sIHVuaXQgKGUuZy4gaWYgaXQgc2hvdWxkIGFwcGVhciBvciBub3QsXG4gICAqIHdoaWNoIHR5cGUgb2YgR1VJIHRvIHVzZSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGB1bml0YCB0byBjb25maWd1cmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gYXBwbHkgdG8gY29uZmlndXJlIHRoZSBnaXZlbiBgdW5pdGAuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnR5cGUgLSBUaGUgdHlwZSBvZiBHVUkgdG8gdXNlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNob3c9dHJ1ZV0gLSBTaG93IHRoZSBHVUkgZm9yIHRoaXMgYHVuaXRgIG9yIG5vdC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5jb25maXJtPWZhbHNlXSAtIEFzayBmb3IgY29uZmlybWF0aW9uIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAqL1xuICBzZXRHdWlPcHRpb25zKG5hbWUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLl9ndWlPcHRpb25zW25hbWVdID0gb3B0aW9ucztcbiAgfVxuXG4gIF9jcmVhdGVHdWkodmlldywgdW5pdCkge1xuICAgIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIGNvbmZpcm06IGZhbHNlLFxuICAgIH0sIHRoaXMuX2d1aU9wdGlvbnNbdW5pdC5uYW1lXSk7XG5cbiAgICBpZiAoY29uZmlnLnNob3cgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgZ3VpID0gbnVsbDtcbiAgICBjb25zdCAkY29udGFpbmVyID0gdGhpcy52aWV3LiRlbDtcblxuICAgIHN3aXRjaCAodW5pdC50eXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAvLyBgTnVtYmVyQm94YCBvciBgU2xpZGVyYFxuICAgICAgICBndWkgPSBuZXcgX051bWJlckd1aSgkY29udGFpbmVyLCB1bml0LCBjb25maWcpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZW51bSc6XG4gICAgICAgIC8vIGBTZWxlY3RMaXN0YCBvciBgU2VsZWN0QnV0dG9uc2BcbiAgICAgICAgZ3VpID0gbmV3IF9FbnVtR3VpKCRjb250YWluZXIsIHVuaXQsIGNvbmZpZyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdjb21tYW5kJzpcbiAgICAgICAgLy8gYEJ1dHRvbmBcbiAgICAgICAgZ3VpID0gbmV3IF9Db21tYW5kR3VpKCRjb250YWluZXIsIHVuaXQsIGNvbmZpZyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdpbmZvJzpcbiAgICAgICAgLy8gYEluZm9gXG4gICAgICAgIGd1aSA9IG5ldyBfSW5mb0d1aSgkY29udGFpbmVyLCB1bml0LCBjb25maWcpO1xuICAgICAgICBicmVhaztcblxuICAgICAgLy8gY2FzZSAndG9nZ2xlJ1xuICAgIH1cblxuICAgIHVuaXQuYWRkTGlzdGVuZXIoJ3VwZGF0ZScsICh2YWwpID0+IGd1aS5zZXQodmFsKSk7XG5cbiAgICByZXR1cm4gZ3VpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlIGFuZCByZXF1ZXN0cyB0aGUgcGFyYW1ldGVycyB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcblxuICAgIGNvbnN0IHZpZXcgPSAodGhpcy5oYXNHdWkpID8gdGhpcy52aWV3IDogbnVsbDtcblxuICAgIHRoaXMucmVjZWl2ZSgnaW5pdCcsIChjb25maWcpID0+IHtcbiAgICAgIGNvbmZpZy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgICBjb25zdCB1bml0ID0gdGhpcy5fY3JlYXRlQ29udHJvbFVuaXQoZW50cnkpO1xuICAgICAgICB0aGlzLnVuaXRzW3VuaXQubmFtZV0gPSB1bml0O1xuXG4gICAgICAgIGlmICh2aWV3KSB7IHRoaXMuX2NyZWF0ZUd1aSh2aWV3LCB1bml0KTsgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghdmlldykgeyB0aGlzLmRvbmUoKTsgfVxuICAgIH0pO1xuXG4gICAgLy8gbGlzdGVuIHRvIGV2ZW50c1xuICAgIHRoaXMucmVjZWl2ZSgndXBkYXRlJywgKG5hbWUsIHZhbCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGUobmFtZSwgdmFsLCBmYWxzZSk7IC8vIHVwZGF0ZSwgYnV0IGRvbid0IHNlbmQgdG8gc2VydmVyXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZSBhbmQgcmVxdWVzdHMgdGhlIHBhcmFtZXRlcnMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuICB9XG59XG4iXX0=