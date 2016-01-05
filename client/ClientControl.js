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
    key: 'addEventListener',
    value: function addEventListener(name, listener) {
      var unit = this.units[name];

      if (unit) {
        unit.addListener('update', listener);
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
    key: 'removeEventListener',
    value: function removeEventListener(name, listener) {
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
          console.log(unit);
          _this.units[unit.name] = unit;

          if (view) _this._createGui(view, unit);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7cUNBQTZCLHlCQUF5Qjs7Ozs2QkFDN0IsZ0JBQWdCOzs7O3NCQUNaLFFBQVE7O0FBRXJDLG1DQUFpQixhQUFhLEVBQUUsQ0FBQzs7Ozs7Ozs7SUFPM0IsWUFBWTtZQUFaLFlBQVk7O0FBQ0wsV0FEUCxZQUFZLENBQ0osT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFOzBCQURwQyxZQUFZOztBQUVkLCtCQUZFLFlBQVksNkNBRU47QUFDUixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixRQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztHQUN4Qjs7OztlQVJHLFlBQVk7O1dBVWIsYUFBQyxHQUFHLEVBQUU7QUFDUCxVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjs7O1dBRVMsc0JBQXNCO1VBQXJCLFlBQVkseURBQUcsSUFBSTs7QUFDNUIsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVoQyxVQUFJLFlBQVksRUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXJELFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwRDs7O1dBRUssZ0JBQUMsR0FBRyxFQUF1QjtVQUFyQixZQUFZLHlEQUFHLElB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QzVCLENBQUMsQ0FBQzs7O0FBR0gsVUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsVUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFLO0FBQ3BDLGNBQUssTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDL0IsQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7V0FLTSxtQkFBRztBQUNSLGlDQW5NaUIsYUFBYSx5Q0FtTWQ7QUFDaEIsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUN0Qjs7O1NBck1rQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudENvbnRyb2wuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmFzaWNDb250cm9sbGVycyBmcm9tICd3YXZlcy1iYXNpYy1jb250cm9sbGVycyc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbmJhc2ljQ29udHJvbGxlcnMuZGlzYWJsZVN0eWxlcygpO1xuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8qIENPTlRST0wgVU5JVFNcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9Db250cm9sVW5pdCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIHR5cGUsIG5hbWUsIGxhYmVsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmNvbnRyb2wgPSBjb250cm9sO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgdGhpcy52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICBfcHJvcGFnYXRlKHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICB0aGlzLmVtaXQoJ3VwZGF0ZScsIHRoaXMudmFsdWUpOyAvLyBjYWxsIGV2ZW50IGxpc3RlbmVyc1xuXG4gICAgaWYgKHNlbmRUb1NlcnZlcilcbiAgICAgIHRoaXMuY29udHJvbC5zZW5kKCd1cGRhdGUnLCB0aGlzLm5hbWUsIHRoaXMudmFsdWUpOyAvLyBzZW5kIHRvIHNlcnZlclxuXG4gICAgdGhpcy5jb250cm9sLmVtaXQoJ3VwZGF0ZScsIHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7IC8vIGNhbGwgY29udHJvbCBsaXN0ZW5lcnNcbiAgfVxuXG4gIHVwZGF0ZSh2YWwsIHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICB0aGlzLnNldCh2YWwpO1xuICAgIHRoaXMuX3Byb3BhZ2F0ZShzZW5kVG9TZXJ2ZXIpO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX051bWJlclVuaXQgZXh0ZW5kcyBfQ29udHJvbFVuaXQge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAnbnVtYmVyJywgbmFtZSwgbGFiZWwpO1xuICAgIHRoaXMubWluID0gbWluO1xuICAgIHRoaXMubWF4ID0gbWF4O1xuICAgIHRoaXMuc3RlcCA9IHN0ZXA7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IE1hdGgubWluKHRoaXMubWF4LCBNYXRoLm1heCh0aGlzLm1pbiwgdmFsKSk7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfRW51bVVuaXQgZXh0ZW5kcyBfQ29udHJvbFVuaXQge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgb3B0aW9ucywgaW5pdCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdlbnVtJywgbmFtZSwgbGFiZWwpO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5vcHRpb25zLmluZGV4T2YodmFsKTtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsO1xuICAgIH1cbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9JbmZvVW5pdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBpbml0KSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2luZm8nLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9Db21tYW5kVW5pdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2NvbW1hbmQnLCBuYW1lLCBsYWJlbCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgLy8gbm90aGluZyB0byBzZXQgaGVyZVxuICB9XG59XG5cblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vKiBHVUlzXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfTnVtYmVyR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgdW5pdCwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCB2YWx1ZSB9ID0gdW5pdDtcblxuICAgIGlmIChndWlPcHRpb25zLnR5cGUgPT09ICdzbGlkZXInKSB7XG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgYmFzaWNDb250cm9sbGVycy5TbGlkZXIobGFiZWwsIG1pbiwgbWF4LCBzdGVwLCB2YWx1ZSwgZ3VpT3B0aW9ucy51bml0LCBndWlPcHRpb25zLnNpemUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgYmFzaWNDb250cm9sbGVycy5OdW1iZXJCb3gobGFiZWwsIG1pbiwgbWF4LCBzdGVwLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAodmFsdWUpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3VuaXQubmFtZX06JHt2YWx1ZX1cImA7XG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgIH1cblxuICAgICAgdW5pdC51cGRhdGUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9FbnVtR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgdW5pdCwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIG9wdGlvbnMsIHZhbHVlIH0gPSB1bml0O1xuXG4gICAgY29uc3QgY3RvciA9IGd1aU9wdGlvbnMudHlwZSA9PT0gJ2J1dHRvbnMnID9cbiAgICAgIGJhc2ljQ29udHJvbGxlcnMuU2VsZWN0QnV0dG9ucyA6IGJhc2ljQ29udHJvbGxlcnMuU2VsZWN0TGlzdFxuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGN0b3IobGFiZWwsIG9wdGlvbnMsIHZhbHVlKTtcbiAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5yZW5kZXIoKSk7XG4gICAgdGhpcy5jb250cm9sbGVyLm9uUmVuZGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIub24oJ2NoYW5nZScsICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7dW5pdC5uYW1lfToke3ZhbHVlfVwiYDtcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtc2cpKSB7IHJldHVybjsgfVxuICAgICAgfVxuXG4gICAgICB1bml0LnVwZGF0ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0NvbW1hbmRHdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCB1bml0LCBndWlPcHRpb25zKSB7XG4gICAgY29uc3QgeyBsYWJlbCB9ID0gdW5pdDtcblxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBiYXNpY0NvbnRyb2xsZXJzLkJ1dHRvbnMoJycsIFtsYWJlbF0pO1xuICAgICRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLnJlbmRlcigpKTtcbiAgICB0aGlzLmNvbnRyb2xsZXIub25SZW5kZXIoKTtcblxuICAgIHRoaXMuY29udHJvbGxlci5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7dW5pdC5uYW1lfVwiYDtcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtc2cpKSB7IHJldHVybjsgfVxuICAgICAgfVxuXG4gICAgICB1bml0LnVwZGF0ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkgeyAvKiBub3RoaW5nIHRvIHNldCBoZXJlICovIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfSW5mb0d1aSB7XG4gIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIHVuaXQsIGd1aU9wdGlvbnMpIHtcbiAgICBjb25zdCB7IGxhYmVsLCB2YWx1ZSB9ID0gdW5pdDtcblxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBiYXNpY0NvbnRyb2xsZXJzLkluZm8obGFiZWwsIHZhbHVlKTtcbiAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5yZW5kZXIoKSk7XG4gICAgdGhpcy5jb250cm9sbGVyLm9uUmVuZGVyKCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKlxuICogTWFuYWdlIHRoZSBnbG9iYWwgY29udHJvbCBgcGFyYW1ldGVyc2AsIGBpbmZvc2AsIGFuZCBgY29tbWFuZHNgIGFjcm9zcyB0aGUgd2hvbGUgc2NlbmFyaW8uXG4gKlxuICogVGhlIG1vZHVsZSBrZWVwcyB0cmFjayBvZjpcbiAqIC0gYHBhcmFtZXRlcnNgOiB2YWx1ZXMgdGhhdCBjYW4gYmUgdXBkYXRlZCBieSB0aGUgYWN0aW9ucyBvZiB0aGUgY2xpZW50cyAoKmUuZy4qIHRoZSBnYWluIG9mIGEgc3ludGgpO1xuICogLSBgaW5mb3NgOiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc3RhdGUgb2YgdGhlIHNjZW5hcmlvICgqZS5nLiogbnVtYmVyIG9mIGNsaWVudHMgaW4gdGhlIHBlcmZvcm1hbmNlKTtcbiAqIC0gYGNvbW1hbmRzYDogY2FuIHRyaWdnZXIgYW4gYWN0aW9uICgqZS5nLiogcmVsb2FkIHRoZSBwYWdlKS5cbiAqXG4gKiBJZiB0aGUgbW9kdWxlIGlzIGluc3RhbnRpYXRlZCB3aXRoIHRoZSBgZ3VpYCBvcHRpb24gc2V0IHRvIGB0cnVlYCwgaXQgY29uc3RydWN0cyBhIGdyYXBoaWNhbCBpbnRlcmZhY2UgdG8gbW9kaWZ5IHRoZSBwYXJhbWV0ZXJzLCB2aWV3IHRoZSBpbmZvcywgYW5kIHRyaWdnZXIgdGhlIGNvbW1hbmRzLlxuICogT3RoZXJ3aXNlIChgZ3VpYCBvcHRpb24gc2V0IHRvIGBmYWxzZWApIHRoZSBtb2R1bGUgZW1pdHMgYW4gZXZlbnQgd2hlbiBpdCByZWNlaXZlcyB1cGRhdGVkIHZhbHVlcyBmcm9tIHRoZSBzZXJ2ZXIuXG4gKlxuICogV2hlbiB0aGUgR1VJIGlzIGRpc2FibGVkLCB0aGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBpbW1lZGlhdGVseSBhZnRlciBoYXZpbmcgc2V0IHVwIHRoZSBjb250cm9scy5cbiAqIE90aGVyd2lzZSAoR1VJIGVuYWJsZWQpLCB0aGUgbW9kdWxlcyByZW1haW5zIGluIGl0cyBzdGF0ZSBhbmQgbmV2ZXIgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uLlxuICpcbiAqIFdoZW4gdGhlIG1vZHVsZSBhIHZpZXcgKGBndWlgIG9wdGlvbiBzZXQgdG8gYHRydWVgKSwgaXQgcmVxdWlyZXMgdGhlIFNBU1MgcGFydGlhbCBgXzc3LWNoZWNraW4uc2Nzc2AuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlckNvbnRyb2wuanN+U2VydmVyQ29udHJvbH0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSAvLyBFeGFtcGxlIDE6IG1ha2UgYSBjbGllbnQgdGhhdCBkaXNwbGF5cyB0aGUgY29udHJvbCBHVUlcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgQ2xpZW50Q29udHJvbCgpO1xuICpcbiAqIC8vIEluaXRpYWxpemUgdGhlIGNsaWVudCAoaW5kaWNhdGUgdGhlIGNsaWVudCB0eXBlKVxuICogY2xpZW50LmluaXQoJ2NvbmR1Y3RvcicpOyAvLyBhY2Nlc3NpYmxlIGF0IHRoZSBVUkwgL2NvbmR1Y3RvclxuICpcbiAqIC8vIFN0YXJ0IHRoZSBzY2VuYXJpb1xuICogLy8gRm9yIHRoaXMgY2xpZW50IHR5cGUgKGAnY29uZHVjdG9yJ2ApLCB0aGVyZSBpcyBvbmx5IG9uZSBtb2R1bGVcbiAqIGNsaWVudC5zdGFydChjb250cm9sKTtcbiAqXG4gKiBAZXhhbXBsZSAvLyBFeGFtcGxlIDI6IGxpc3RlbiBmb3IgcGFyYW1ldGVyLCBpbmZvcyAmIGNvbW1hbmRzIHVwZGF0ZXNcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgQ2xpZW50Q29udHJvbCh7IGd1aTogZmFsc2UgfSk7XG4gKlxuICogLy8gTGlzdGVuIGZvciBwYXJhbWV0ZXIsIGluZm9zIG9yIGNvbW1hbmQgdXBkYXRlc1xuICogY29udHJvbC5vbigndXBkYXRlJywgKG5hbWUsIHZhbHVlKSA9PiB7XG4gKiAgIHN3aXRjaChuYW1lKSB7XG4gKiAgICAgY2FzZSAnc3ludGg6Z2Fpbic6XG4gKiAgICAgICBjb25zb2xlLmxvZyhgVXBkYXRlIHRoZSBzeW50aCBnYWluIHRvIHZhbHVlICN7dmFsdWV9LmApO1xuICogICAgICAgYnJlYWs7XG4gKiAgICAgY2FzZSAncmVsb2FkJzpcbiAqICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XG4gKiAgICAgICBicmVhaztcbiAqICAgfVxuICogfSk7XG4gKlxuICogLy8gR2V0IGN1cnJlbnQgdmFsdWUgb2YgYSBwYXJhbWV0ZXIgb3IgaW5mb1xuICogY29uc3QgY3VycmVudFN5bnRoR2FpblZhbHVlID0gY29udHJvbC5ldmVudFsnc3ludGg6Z2FpbiddLnZhbHVlO1xuICogY29uc3QgY3VycmVudE51bVBsYXllcnNWYWx1ZSA9IGNvbnRyb2wuZXZlbnRbJ251bVBsYXllcnMnXS52YWx1ZTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50Q29udHJvbCBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdzeW5jJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmd1aT10cnVlXSBJbmRpY2F0ZXMgd2hldGhlciB0byBjcmVhdGUgdGhlIGdyYXBoaWNhbCB1c2VyIGludGVyZmFjZSB0byBjb250cm9sIHRoZSBwYXJhbWV0ZXJzIG9yIG5vdC5cbiAgICogQGVtaXRzIHsndXBkYXRlJ30gd2hlbiB0aGUgc2VydmVyIHNlbmRzIGFuIHVwZGF0ZS4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRha2VzIGBuYW1lOlN0cmluZ2AgYW5kIGB2YWx1ZToqYCBhcyBhcmd1bWVudHMsIHdoZXJlIGBuYW1lYCBpcyB0aGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyIC8gaW5mbyAvIGNvbW1hbmQsIGFuZCBgdmFsdWVgIGl0cyBuZXcgdmFsdWUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2NvbnRyb2wnLCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIERpY3Rpb25hcnkgb2YgYWxsIHRoZSBwYXJhbWV0ZXJzIGFuZCBjb21tYW5kcy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMudW5pdHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEZsYWcgd2hldGhlciBjbGllbnQgaGFzIGNvbnRyb2wgR1VJLlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuaGFzR3VpID0gb3B0aW9ucy5oYXNHdWk7XG5cbiAgICB0aGlzLl9ndWlPcHRpb25zID0ge307XG5cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKHRoaXMuaGFzR3VpKSB7XG4gICAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGxpc3RlbmVyIHRvIGEgc3BlY2lmaWMgZXZlbnQgKGkuZS4gcGFyYW1ldGVyLCBpbmZvIG9yIGNvbW1hbmQpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTGlzdGVuZXIgY2FsbGJhY2suXG4gICAqL1xuICBhZGRFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgdW5pdCA9IHRoaXMudW5pdHNbbmFtZV07XG5cbiAgICBpZiAodW5pdCkge1xuICAgICAgdW5pdC5hZGRMaXN0ZW5lcigndXBkYXRlJywgbGlzdGVuZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biB1bml0IFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZyb20gYSBzcGVjaWZpYyBldmVudCAoaS5lLiBwYXJhbWV0ZXIsIGluZm8gb3IgY29tbWFuZCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBMaXN0ZW5lciBjYWxsYmFjay5cbiAgICovXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCB1bml0ID0gdGhpcy51bml0c1tuYW1lXTtcblxuICAgIGlmICh1bml0KSB7XG4gICAgICB1bml0LnJlbW92ZUxpc3RlbmVyKCd1cGRhdGUnLCBsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHVuaXQgXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIGdldFZhbHVlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy51bml0c1tuYW1lXS52YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB2YWx1ZSBvZiBhIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0geyhTdHJpbmd8TnVtYmVyfEJvb2xlYW4pfSB2YWwgLSBOZXcgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbc2VuZFRvU2VydmVyPXRydWVdIC0gRmxhZyB3aGV0aGVyIHRoZSB2YWx1ZSBpcyBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICB1cGRhdGUobmFtZSwgdmFsLCBzZW5kVG9TZXJ2ZXIgPSB0cnVlKSB7XG4gICAgY29uc3QgdW5pdCA9IHRoaXMudW5pdHNbbmFtZV07XG5cbiAgICBpZiAodW5pdCkge1xuICAgICAgdW5pdC51cGRhdGUodmFsLCBzZW5kVG9TZXJ2ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBjb250cm9sIHVuaXQgXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIF9jcmVhdGVDb250cm9sVW5pdChpbml0KSB7XG4gICAgbGV0IHVuaXQgPSBudWxsO1xuXG4gICAgc3dpdGNoIChpbml0LnR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHVuaXQgPSBuZXcgX051bWJlclVuaXQodGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0Lm1pbiwgaW5pdC5tYXgsIGluaXQuc3RlcCwgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdlbnVtJzpcbiAgICAgICAgdW5pdCA9IG5ldyBfRW51bVVuaXQodGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0Lm9wdGlvbnMsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnaW5mbyc6XG4gICAgICAgIHVuaXQgPSBuZXcgX0luZm9Vbml0KHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdjb21tYW5kJzpcbiAgICAgICAgdW5pdCA9IG5ldyBfQ29tbWFuZFVuaXQodGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuaXQ7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlIHRoZSBHVUkgZm9yIGEgc3BlY2lmaWMgY29udHJvbCB1bml0IChlLmcuIGlmIGl0IHNob3VsZCBhcHBlYXIgb3Igbm90LFxuICAgKiB3aGljaCB0eXBlIG9mIEdVSSB0byB1c2UpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBgdW5pdGAgdG8gY29uZmlndXJlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGFwcGx5IHRvIGNvbmZpZ3VyZSB0aGUgZ2l2ZW4gYHVuaXRgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy50eXBlIC0gVGhlIHR5cGUgb2YgR1VJIHRvIHVzZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93PXRydWVdIC0gU2hvdyB0aGUgR1VJIGZvciB0aGlzIGB1bml0YCBvciBub3QuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuY29uZmlybT1mYWxzZV0gLSBBc2sgZm9yIGNvbmZpcm1hdGlvbiB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgKi9cbiAgc2V0R3VpT3B0aW9ucyhuYW1lLCBvcHRpb25zKSB7XG4gICAgdGhpcy5fZ3VpT3B0aW9uc1tuYW1lXSA9IG9wdGlvbnM7XG4gIH1cblxuICBfY3JlYXRlR3VpKHZpZXcsIHVuaXQpIHtcbiAgICBjb25zdCBjb25maWcgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBjb25maXJtOiBmYWxzZSxcbiAgICB9LCB0aGlzLl9ndWlPcHRpb25zW3VuaXQubmFtZV0pO1xuXG4gICAgaWYgKGNvbmZpZy5zaG93ID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGd1aSA9IG51bGw7XG4gICAgY29uc3QgJGNvbnRhaW5lciA9IHRoaXMudmlldy4kZWw7XG5cbiAgICBzd2l0Y2ggKHVuaXQudHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgLy8gYE51bWJlckJveGAgb3IgYFNsaWRlcmBcbiAgICAgICAgZ3VpID0gbmV3IF9OdW1iZXJHdWkoJGNvbnRhaW5lciwgdW5pdCwgY29uZmlnKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2VudW0nOlxuICAgICAgICAvLyBgU2VsZWN0TGlzdGAgb3IgYFNlbGVjdEJ1dHRvbnNgXG4gICAgICAgIGd1aSA9IG5ldyBfRW51bUd1aSgkY29udGFpbmVyLCB1bml0LCBjb25maWcpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnY29tbWFuZCc6XG4gICAgICAgIC8vIGBCdXR0b25gXG4gICAgICAgIGd1aSA9IG5ldyBfQ29tbWFuZEd1aSgkY29udGFpbmVyLCB1bml0LCBjb25maWcpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnaW5mbyc6XG4gICAgICAgIC8vIGBJbmZvYFxuICAgICAgICBndWkgPSBuZXcgX0luZm9HdWkoJGNvbnRhaW5lciwgdW5pdCwgY29uZmlnKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIGNhc2UgJ3RvZ2dsZSdcbiAgICB9XG5cbiAgICB1bml0LmFkZExpc3RlbmVyKCd1cGRhdGUnLCAodmFsKSA9PiBndWkuc2V0KHZhbCkpO1xuXG4gICAgcmV0dXJuIGd1aTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIG1vZHVsZSBhbmQgcmVxdWVzdHMgdGhlIHBhcmFtZXRlcnMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG5cbiAgICBjb25zdCB2aWV3ID0gKHRoaXMuaGFzR3VpKSA/IHRoaXMudmlldyA6IG51bGw7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ2luaXQnLCAoY29uZmlnKSA9PiB7XG4gICAgICBjb25maWcuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgICAgY29uc3QgdW5pdCA9IHRoaXMuX2NyZWF0ZUNvbnRyb2xVbml0KGVudHJ5KTtcbiAgICAgICAgY29uc29sZS5sb2codW5pdCk7XG4gICAgICAgIHRoaXMudW5pdHNbdW5pdC5uYW1lXSA9IHVuaXQ7XG5cbiAgICAgICAgaWYgKHZpZXcpXG4gICAgICAgICAgdGhpcy5fY3JlYXRlR3VpKHZpZXcsIHVuaXQpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICghdmlldykgeyB0aGlzLmRvbmUoKTsgfVxuICAgIH0pO1xuXG4gICAgLy8gbGlzdGVuIHRvIGV2ZW50c1xuICAgIHRoaXMucmVjZWl2ZSgndXBkYXRlJywgKG5hbWUsIHZhbCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGUobmFtZSwgdmFsLCBmYWxzZSk7IC8vIHVwZGF0ZSwgYnV0IGRvbid0IHNlbmQgdG8gc2VydmVyXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZSBhbmQgcmVxdWVzdHMgdGhlIHBhcmFtZXRlcnMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuICB9XG59XG4iXX0=