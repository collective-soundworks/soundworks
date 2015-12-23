'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _wavesBasicControllers = require('waves-basic-controllers');

var _wavesBasicControllers2 = _interopRequireDefault(_wavesBasicControllers);

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

var _events = require('events');

_wavesBasicControllers2['default'].setTheme('dark');

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
    key: 'propagate',
    value: function propagate() {
      var sendToServer = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this.emit('update', this.value); // call event listeners

      if (sendToServer) this.control.send('update', this.name, this.value); // send to server

      this.control.emit('update', this.name, this.value); // call control listeners
    }
  }, {
    key: 'update',
    value: function update(val) {
      this.set(val);
      this.propagate();
    }
  }]);

  return _ControlUnit;
})(_events.EventEmitter);

var _ControlNumber = (function (_ControlUnit2) {
  _inherits(_ControlNumber, _ControlUnit2);

  function _ControlNumber(control, name, label, min, max, step, init) {
    _classCallCheck(this, _ControlNumber);

    _get(Object.getPrototypeOf(_ControlNumber.prototype), 'constructor', this).call(this, control, 'number', name, label);
    this.min = min;
    this.max = max;
    this.step = step;
    this.set(init);
  }

  /** @private */

  _createClass(_ControlNumber, [{
    key: 'set',
    value: function set(val) {
      this.value = Math.min(this.max, Math.max(this.min, val));
    }

    // is now handled from the GUI
  }, {
    key: 'incr',
    value: function incr() {
      var steps = Math.floor(this.value / this.step + 0.5);
      this.value = this.step * (steps + 1);
    }
  }, {
    key: 'decr',
    value: function decr() {
      var steps = Math.floor(this.value / this.step + 0.5);
      this.value = this.step * (steps - 1);
    }
  }]);

  return _ControlNumber;
})(_ControlUnit);

var _ControlSelect = (function (_ControlUnit3) {
  _inherits(_ControlSelect, _ControlUnit3);

  function _ControlSelect(control, name, label, options, init) {
    _classCallCheck(this, _ControlSelect);

    _get(Object.getPrototypeOf(_ControlSelect.prototype), 'constructor', this).call(this, control, 'select', name, label);
    this.options = options;
    this.set(init);
  }

  /** @private */

  _createClass(_ControlSelect, [{
    key: 'set',
    value: function set(val) {
      var index = this.options.indexOf(val);

      if (index >= 0) {
        this.index = index;
        this.value = val;
      }
    }

    // is now handled from the GUI
  }, {
    key: 'incr',
    value: function incr() {
      this.index = (this.index + 1) % this.options.length;
      this.value = this.options[this.index];
    }
  }, {
    key: 'decr',
    value: function decr() {
      this.index = (this.index + this.options.length - 1) % this.options.length;
      this.value = this.options[this.index];
    }
  }]);

  return _ControlSelect;
})(_ControlUnit);

var _ControlInfo = (function (_ControlUnit4) {
  _inherits(_ControlInfo, _ControlUnit4);

  function _ControlInfo(control, name, label, init) {
    _classCallCheck(this, _ControlInfo);

    _get(Object.getPrototypeOf(_ControlInfo.prototype), 'constructor', this).call(this, control, 'info', name, label);
    this.set(init);
  }

  /** @private */

  _createClass(_ControlInfo, [{
    key: 'set',
    value: function set(val) {
      this.value = val;
    }
  }]);

  return _ControlInfo;
})(_ControlUnit);

var _ControlCommand = (function (_ControlUnit5) {
  _inherits(_ControlCommand, _ControlUnit5);

  function _ControlCommand(control, name, label) {
    _classCallCheck(this, _ControlCommand);

    _get(Object.getPrototypeOf(_ControlCommand.prototype), 'constructor', this).call(this, control, 'command', name, label);
  }

  /* --------------------------------------------------------- */
  /* GUIs
  /* --------------------------------------------------------- */

  /** @private */

  _createClass(_ControlCommand, [{
    key: 'set',
    value: function set(val) {
      // nothing to set here
    }
  }]);

  return _ControlCommand;
})(_ControlUnit);

var _NumberGui = (function () {
  function _NumberGui(view, controlUnit, guiOptions) {
    _classCallCheck(this, _NumberGui);

    var label = controlUnit.label;
    var min = controlUnit.min;
    var max = controlUnit.max;
    var step = controlUnit.step;
    var value = controlUnit.value;

    if (guiOptions.type === 'slider') {
      this.controller = new _wavesBasicControllers2['default'].Slider(label, min, max, step, value, guiOptions.unit, guiOptions.size);
    } else {
      this.controller = new _wavesBasicControllers2['default'].NumberBox(label, min, max, step, value);
    }

    view.$el.appendChild(this.controller.render());

    this.controller.on('change', function (value) {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + controlUnit.name + ':' + value + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      controlUnit.set(value);
      controlUnit.propagate();
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

var _SelectGui = (function () {
  function _SelectGui(view, controlUnit, guiOptions) {
    _classCallCheck(this, _SelectGui);

    var label = controlUnit.label;
    var options = controlUnit.options;
    var value = controlUnit.value;

    var ctor = guiOptions.type === 'buttons' ? _wavesBasicControllers2['default'].SelectButtons : _wavesBasicControllers2['default'].SelectList;

    this.controller = new ctor(label, options, value);
    view.$el.appendChild(this.controller.render());

    this.controller.on('change', function (value) {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + controlUnit.name + ':' + value + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      controlUnit.set(value);
      controlUnit.propagate();
    });
  }

  /** @private */

  _createClass(_SelectGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);

  return _SelectGui;
})();

var _CommandGui = (function () {
  function _CommandGui(view, controlUnit, guiOptions) {
    _classCallCheck(this, _CommandGui);

    var label = controlUnit.label;

    this.controller = new _wavesBasicControllers2['default'].Buttons('', [label]);
    view.$el.appendChild(this.controller.render());

    this.controller.on('change', function () {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + controlUnit.name + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      controlUnit.propagate();
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
  function _InfoGui(view, controlUnit, guiOptions) {
    _classCallCheck(this, _InfoGui);

    var label = controlUnit.label;
    var value = controlUnit.value;

    this.controller = new _wavesBasicControllers2['default'].Info(label, value);
    view.$el.appendChild(this.controller.render());
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
    this.controlUnits = {};

    /**
     * Flag whether client has control GUI.
     * @type {Boolean}
     */
    this.hasGui = options.hasGui;

    this._guiConfig = {};

    this.init();
  }

  _createClass(ClientControl, [{
    key: 'init',
    value: function init() {
      if (this.hasGui) {
        this.view = this.createDefaultView();
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
      var controlUnit = this.controlUnits[name];

      if (controlUnit) {
        controlUnit.addListener('update', listener);
      } else {
        console.log('unknown controlUnit "' + name + '"');
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
      var controlUnit = this.controlUnits[name];

      if (controlUnit) {
        controlUnit.removeListener('update', listener);
      } else {
        console.log('unknown controlUnit "' + name + '"');
      }
    }
  }, {
    key: 'getValue',
    value: function getValue(name) {
      return this.controlUnits[name].value;
    }

    /**
     * Updates the value of a parameter.
     * @param {String} name Name of the parameter to update.
     * @param {(String|Number|Boolean)} val New value of the parameter.
     * @param {Boolean} [sendToServer=true] Flag whether the value is sent to the server.
     */
  }, {
    key: 'update',
    value: function update(name, val) {
      var sendToServer = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      var controlUnit = this.controlUnits[name];

      if (controlUnit) {
        controlUnit.set(val);
        controlUnit.propagate(sendToServer);
      } else {
        console.log('unknown control controlUnit "' + name + '"');
      }
    }
  }, {
    key: '_createControlUnit',
    value: function _createControlUnit(init) {
      var controlUnit = null;

      switch (init.type) {
        case 'number':
          controlUnit = new _ControlNumber(this, init.name, init.label, init.min, init.max, init.step, init.value);
          break;

        case 'select':
          controlUnit = new _ControlSelect(this, init.name, init.label, init.options, init.value);
          break;

        case 'info':
          controlUnit = new _ControlInfo(this, init.name, init.label, init.value);
          break;

        case 'command':
          controlUnit = new _ControlCommand(this, init.name, init.label);
          break;
      }

      return controlUnit;
    }
  }, {
    key: 'configureGui',
    value: function configureGui(name, options) {
      this._guiConfig[name] = options;
    }
  }, {
    key: '_createGui',
    value: function _createGui(view, controlUnit) {
      var gui = null;
      var config = _Object$assign({
        show: true,
        confirm: false
      }, this._guiConfig[controlUnit.name]);

      if (config.show === false) {
        return null;
      }

      switch (controlUnit.type) {
        case 'number':
          // can be `NumberBox` or `Slider`
          gui = new _NumberGui(view, controlUnit, config);
          break;

        case 'select':
          // can be `SelectList` or `SelectButtons`
          gui = new _SelectGui(view, controlUnit, config);
          break;

        case 'command':
          // can be `Button` (or `Bang` @todo)
          gui = new _CommandGui(view, controlUnit, config);
          break;

        case 'info':
          // can be
          gui = new _InfoGui(view, controlUnit, config);
          break;

        // case 'toggle' ?
      }

      controlUnit.addListener('update', function (val) {
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

      this.receive('init', function (data) {
        if (view) {
          // create a template
          var title = document.createElement('h1');
          title.innerHTML = 'Conductor';
          view.$el.appendChild(title);
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _getIterator(data), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var d = _step.value;

            var controlUnit = _this._createControlUnit(d);
            _this.controlUnits[controlUnit.name] = controlUnit;

            if (view) _this._createGui(view, controlUnit);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (!view) _this.done();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQ0FBNkIseUJBQXlCOzs7OzZCQUM3QixnQkFBZ0I7Ozs7c0JBQ1osUUFBUTs7QUFFckMsbUNBQWlCLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Ozs7Ozs7SUFRNUIsWUFBWTtZQUFaLFlBQVk7O0FBQ0wsV0FEUCxZQUFZLENBQ0osT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFOzBCQURwQyxZQUFZOztBQUVkLCtCQUZFLFlBQVksNkNBRU47QUFDUixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixRQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztHQUN4Qjs7OztlQVJHLFlBQVk7O1dBVWIsYUFBQyxHQUFHLEVBQUU7QUFDUCxVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjs7O1dBRVEscUJBQXNCO1VBQXJCLFlBQVkseURBQUcsSUFBSTs7QUFDM0IsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVoQyxVQUFJLFlBQVksRUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXJELFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwRDs7O1dBRUssZ0JBQUMsR0FBRyxFQUFFO0FBQ1YsVUFB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Y0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUMvQixDQUFDLENBQUM7S0FDSjs7Ozs7OztXQUtNLG1CQUFHO0FBQ1IsaUNBak1pQixhQUFhLHlDQWlNZDtBQUNoQixVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3RCOzs7U0FuTWtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q29udHJvbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiYXNpY0NvbnRyb2xsZXJzIGZyb20gJ3dhdmVzLWJhc2ljLWNvbnRyb2xsZXJzJztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuYmFzaWNDb250cm9sbGVycy5zZXRUaGVtZSgnZGFyaycpO1xuXG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLyogQ09OVFJPTCBVTklUU1xuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0NvbnRyb2xVbml0IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgdHlwZSwgbmFtZSwgbGFiZWwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY29udHJvbCA9IGNvbnRyb2w7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIHByb3BhZ2F0ZShzZW5kVG9TZXJ2ZXIgPSB0cnVlKSB7XG4gICAgdGhpcy5lbWl0KCd1cGRhdGUnLCB0aGlzLnZhbHVlKTsgLy8gY2FsbCBldmVudCBsaXN0ZW5lcnNcblxuICAgIGlmIChzZW5kVG9TZXJ2ZXIpXG4gICAgICB0aGlzLmNvbnRyb2wuc2VuZCgndXBkYXRlJywgdGhpcy5uYW1lLCB0aGlzLnZhbHVlKTsgLy8gc2VuZCB0byBzZXJ2ZXJcblxuICAgIHRoaXMuY29udHJvbC5lbWl0KCd1cGRhdGUnLCB0aGlzLm5hbWUsIHRoaXMudmFsdWUpOyAvLyBjYWxsIGNvbnRyb2wgbGlzdGVuZXJzXG4gIH1cblxuICB1cGRhdGUodmFsKSB7XG4gICAgdGhpcy5zZXQodmFsKTtcbiAgICB0aGlzLnByb3BhZ2F0ZSgpO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0NvbnRyb2xOdW1iZXIgZXh0ZW5kcyBfQ29udHJvbFVuaXQge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAnbnVtYmVyJywgbmFtZSwgbGFiZWwpO1xuICAgIHRoaXMubWluID0gbWluO1xuICAgIHRoaXMubWF4ID0gbWF4O1xuICAgIHRoaXMuc3RlcCA9IHN0ZXA7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IE1hdGgubWluKHRoaXMubWF4LCBNYXRoLm1heCh0aGlzLm1pbiwgdmFsKSk7XG4gIH1cblxuICAvLyBpcyBub3cgaGFuZGxlZCBmcm9tIHRoZSBHVUlcbiAgaW5jcigpIHtcbiAgICBsZXQgc3RlcHMgPSBNYXRoLmZsb29yKHRoaXMudmFsdWUgLyB0aGlzLnN0ZXAgKyAwLjUpO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLnN0ZXAgKiAoc3RlcHMgKyAxKTtcbiAgfVxuXG4gIGRlY3IoKSB7XG4gICAgbGV0IHN0ZXBzID0gTWF0aC5mbG9vcih0aGlzLnZhbHVlIC8gdGhpcy5zdGVwICsgMC41KTtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5zdGVwICogKHN0ZXBzIC0gMSk7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQ29udHJvbFNlbGVjdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0KSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3NlbGVjdCcsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIGxldCBpbmRleCA9IHRoaXMub3B0aW9ucy5pbmRleE9mKHZhbCk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICAvLyBpcyBub3cgaGFuZGxlZCBmcm9tIHRoZSBHVUlcbiAgaW5jcigpIHtcbiAgICB0aGlzLmluZGV4ID0gKHRoaXMuaW5kZXggKyAxKSAlIHRoaXMub3B0aW9ucy5sZW5ndGg7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMub3B0aW9uc1t0aGlzLmluZGV4XTtcbiAgfVxuXG4gIGRlY3IoKSB7XG4gICAgdGhpcy5pbmRleCA9ICh0aGlzLmluZGV4ICsgdGhpcy5vcHRpb25zLmxlbmd0aCAtIDEpICUgdGhpcy5vcHRpb25zLmxlbmd0aDtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5vcHRpb25zW3RoaXMuaW5kZXhdO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0NvbnRyb2xJbmZvIGV4dGVuZHMgX0NvbnRyb2xVbml0IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAnaW5mbycsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0NvbnRyb2xDb21tYW5kIGV4dGVuZHMgX0NvbnRyb2xVbml0IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwpIHtcbiAgICBzdXBlcihjb250cm9sLCAnY29tbWFuZCcsIG5hbWUsIGxhYmVsKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICAvLyBub3RoaW5nIHRvIHNldCBoZXJlXG4gIH1cbn1cblxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8qIEdVSXNcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9OdW1iZXJHdWkge1xuICBjb25zdHJ1Y3Rvcih2aWV3LCBjb250cm9sVW5pdCwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCB2YWx1ZSB9ID0gY29udHJvbFVuaXQ7XG5cbiAgICBpZiAoZ3VpT3B0aW9ucy50eXBlID09PSAnc2xpZGVyJykge1xuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuU2xpZGVyKGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdmFsdWUsIGd1aU9wdGlvbnMudW5pdCwgZ3VpT3B0aW9ucy5zaXplKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuTnVtYmVyQm94KGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdmFsdWUpO1xuICAgIH1cblxuICAgIHZpZXcuJGVsLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5yZW5kZXIoKSk7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIub24oJ2NoYW5nZScsICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7Y29udHJvbFVuaXQubmFtZX06JHt2YWx1ZX1cImA7XG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgIH1cblxuICAgICAgY29udHJvbFVuaXQuc2V0KHZhbHVlKTtcbiAgICAgIGNvbnRyb2xVbml0LnByb3BhZ2F0ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9TZWxlY3RHdWkge1xuICBjb25zdHJ1Y3Rvcih2aWV3LCBjb250cm9sVW5pdCwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIG9wdGlvbnMsIHZhbHVlIH0gPSBjb250cm9sVW5pdDtcblxuICAgIGNvbnN0IGN0b3IgPSBndWlPcHRpb25zLnR5cGUgPT09ICdidXR0b25zJyA/XG4gICAgICBiYXNpY0NvbnRyb2xsZXJzLlNlbGVjdEJ1dHRvbnMgOiBiYXNpY0NvbnRyb2xsZXJzLlNlbGVjdExpc3RcblxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBjdG9yKGxhYmVsLCBvcHRpb25zLCB2YWx1ZSk7XG4gICAgdmlldy4kZWwuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLnJlbmRlcigpKTtcblxuICAgIHRoaXMuY29udHJvbGxlci5vbignY2hhbmdlJywgKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoZ3VpT3B0aW9ucy5jb25maXJtKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIFwiJHtjb250cm9sVW5pdC5uYW1lfToke3ZhbHVlfVwiYDtcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtc2cpKSB7IHJldHVybjsgfVxuICAgICAgfVxuXG4gICAgICBjb250cm9sVW5pdC5zZXQodmFsdWUpO1xuICAgICAgY29udHJvbFVuaXQucHJvcGFnYXRlKCk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0NvbW1hbmRHdWkge1xuICBjb25zdHJ1Y3Rvcih2aWV3LCBjb250cm9sVW5pdCwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwgfSA9IGNvbnRyb2xVbml0O1xuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuQnV0dG9ucygnJywgW2xhYmVsXSk7XG4gICAgdmlldy4kZWwuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLnJlbmRlcigpKTtcblxuICAgIHRoaXMuY29udHJvbGxlci5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7Y29udHJvbFVuaXQubmFtZX1cImA7XG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgIH1cblxuICAgICAgY29udHJvbFVuaXQucHJvcGFnYXRlKClcbiAgICB9KTtcbiAgfVxuXG4gIHNldCh2YWwpIHsgLyogbm90aGluZyB0byBzZXQgaGVyZSAqLyB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0luZm9HdWkge1xuICBjb25zdHJ1Y3Rvcih2aWV3LCBjb250cm9sVW5pdCwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIHZhbHVlIH0gPSBjb250cm9sVW5pdDtcblxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBiYXNpY0NvbnRyb2xsZXJzLkluZm8obGFiZWwsIHZhbHVlKTtcbiAgICB2aWV3LiRlbC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKipcbiAqIE1hbmFnZSB0aGUgZ2xvYmFsIGNvbnRyb2wgYHBhcmFtZXRlcnNgLCBgaW5mb3NgLCBhbmQgYGNvbW1hbmRzYCBhY3Jvc3MgdGhlIHdob2xlIHNjZW5hcmlvLlxuICpcbiAqIFRoZSBtb2R1bGUga2VlcHMgdHJhY2sgb2Y6XG4gKiAtIGBwYXJhbWV0ZXJzYDogdmFsdWVzIHRoYXQgY2FuIGJlIHVwZGF0ZWQgYnkgdGhlIGFjdGlvbnMgb2YgdGhlIGNsaWVudHMgKCplLmcuKiB0aGUgZ2FpbiBvZiBhIHN5bnRoKTtcbiAqIC0gYGluZm9zYDogaW5mb3JtYXRpb24gYWJvdXQgdGhlIHN0YXRlIG9mIHRoZSBzY2VuYXJpbyAoKmUuZy4qIG51bWJlciBvZiBjbGllbnRzIGluIHRoZSBwZXJmb3JtYW5jZSk7XG4gKiAtIGBjb21tYW5kc2A6IGNhbiB0cmlnZ2VyIGFuIGFjdGlvbiAoKmUuZy4qIHJlbG9hZCB0aGUgcGFnZSkuXG4gKlxuICogSWYgdGhlIG1vZHVsZSBpcyBpbnN0YW50aWF0ZWQgd2l0aCB0aGUgYGd1aWAgb3B0aW9uIHNldCB0byBgdHJ1ZWAsIGl0IGNvbnN0cnVjdHMgYSBncmFwaGljYWwgaW50ZXJmYWNlIHRvIG1vZGlmeSB0aGUgcGFyYW1ldGVycywgdmlldyB0aGUgaW5mb3MsIGFuZCB0cmlnZ2VyIHRoZSBjb21tYW5kcy5cbiAqIE90aGVyd2lzZSAoYGd1aWAgb3B0aW9uIHNldCB0byBgZmFsc2VgKSB0aGUgbW9kdWxlIGVtaXRzIGFuIGV2ZW50IHdoZW4gaXQgcmVjZWl2ZXMgdXBkYXRlZCB2YWx1ZXMgZnJvbSB0aGUgc2VydmVyLlxuICpcbiAqIFdoZW4gdGhlIEdVSSBpcyBkaXNhYmxlZCwgdGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gaW1tZWRpYXRlbHkgYWZ0ZXIgaGF2aW5nIHNldCB1cCB0aGUgY29udHJvbHMuXG4gKiBPdGhlcndpc2UgKEdVSSBlbmFibGVkKSwgdGhlIG1vZHVsZXMgcmVtYWlucyBpbiBpdHMgc3RhdGUgYW5kIG5ldmVyIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbi5cbiAqXG4gKiBXaGVuIHRoZSBtb2R1bGUgYSB2aWV3IChgZ3VpYCBvcHRpb24gc2V0IHRvIGB0cnVlYCksIGl0IHJlcXVpcmVzIHRoZSBTQVNTIHBhcnRpYWwgYF83Ny1jaGVja2luLnNjc3NgLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJDb250cm9sLmpzflNlcnZlckNvbnRyb2x9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGUgLy8gRXhhbXBsZSAxOiBtYWtlIGEgY2xpZW50IHRoYXQgZGlzcGxheXMgdGhlIGNvbnRyb2wgR1VJXG4gKiBjb25zdCBjb250cm9sID0gbmV3IENsaWVudENvbnRyb2woKTtcbiAqXG4gKiAvLyBJbml0aWFsaXplIHRoZSBjbGllbnQgKGluZGljYXRlIHRoZSBjbGllbnQgdHlwZSlcbiAqIGNsaWVudC5pbml0KCdjb25kdWN0b3InKTsgLy8gYWNjZXNzaWJsZSBhdCB0aGUgVVJMIC9jb25kdWN0b3JcbiAqXG4gKiAvLyBTdGFydCB0aGUgc2NlbmFyaW9cbiAqIC8vIEZvciB0aGlzIGNsaWVudCB0eXBlIChgJ2NvbmR1Y3RvcidgKSwgdGhlcmUgaXMgb25seSBvbmUgbW9kdWxlXG4gKiBjbGllbnQuc3RhcnQoY29udHJvbCk7XG4gKlxuICogQGV4YW1wbGUgLy8gRXhhbXBsZSAyOiBsaXN0ZW4gZm9yIHBhcmFtZXRlciwgaW5mb3MgJiBjb21tYW5kcyB1cGRhdGVzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IENsaWVudENvbnRyb2woeyBndWk6IGZhbHNlIH0pO1xuICpcbiAqIC8vIExpc3RlbiBmb3IgcGFyYW1ldGVyLCBpbmZvcyBvciBjb21tYW5kIHVwZGF0ZXNcbiAqIGNvbnRyb2wub24oJ3VwZGF0ZScsIChuYW1lLCB2YWx1ZSkgPT4ge1xuICogICBzd2l0Y2gobmFtZSkge1xuICogICAgIGNhc2UgJ3N5bnRoOmdhaW4nOlxuICogICAgICAgY29uc29sZS5sb2coYFVwZGF0ZSB0aGUgc3ludGggZ2FpbiB0byB2YWx1ZSAje3ZhbHVlfS5gKTtcbiAqICAgICAgIGJyZWFrO1xuICogICAgIGNhc2UgJ3JlbG9hZCc6XG4gKiAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpO1xuICogICAgICAgYnJlYWs7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIC8vIEdldCBjdXJyZW50IHZhbHVlIG9mIGEgcGFyYW1ldGVyIG9yIGluZm9cbiAqIGNvbnN0IGN1cnJlbnRTeW50aEdhaW5WYWx1ZSA9IGNvbnRyb2wuZXZlbnRbJ3N5bnRoOmdhaW4nXS52YWx1ZTtcbiAqIGNvbnN0IGN1cnJlbnROdW1QbGF5ZXJzVmFsdWUgPSBjb250cm9sLmV2ZW50WydudW1QbGF5ZXJzJ10udmFsdWU7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudENvbnRyb2wgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nc3luYyddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5ndWk9dHJ1ZV0gSW5kaWNhdGVzIHdoZXRoZXIgdG8gY3JlYXRlIHRoZSBncmFwaGljYWwgdXNlciBpbnRlcmZhY2UgdG8gY29udHJvbCB0aGUgcGFyYW1ldGVycyBvciBub3QuXG4gICAqIEBlbWl0cyB7J3VwZGF0ZSd9IHdoZW4gdGhlIHNlcnZlciBzZW5kcyBhbiB1cGRhdGUuIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0YWtlcyBgbmFtZTpTdHJpbmdgIGFuZCBgdmFsdWU6KmAgYXMgYXJndW1lbnRzLCB3aGVyZSBgbmFtZWAgaXMgdGhlIG5hbWUgb2YgdGhlIHBhcmFtZXRlciAvIGluZm8gLyBjb21tYW5kLCBhbmQgYHZhbHVlYCBpdHMgbmV3IHZhbHVlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdjb250cm9sJywgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBEaWN0aW9uYXJ5IG9mIGFsbCB0aGUgcGFyYW1ldGVycyBhbmQgY29tbWFuZHMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmNvbnRyb2xVbml0cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogRmxhZyB3aGV0aGVyIGNsaWVudCBoYXMgY29udHJvbCBHVUkuXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5oYXNHdWkgPSBvcHRpb25zLmhhc0d1aTtcblxuICAgIHRoaXMuX2d1aUNvbmZpZyA9IHt9O1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICh0aGlzLmhhc0d1aSkge1xuICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVEZWZhdWx0VmlldygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGlzdGVuZXIgdG8gYSBzcGVjaWZpYyBldmVudCAoaS5lLiBwYXJhbWV0ZXIsIGluZm8gb3IgY29tbWFuZCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBMaXN0ZW5lciBjYWxsYmFjay5cbiAgICovXG4gIGFkZEV2ZW50TGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBjb250cm9sVW5pdCA9IHRoaXMuY29udHJvbFVuaXRzW25hbWVdO1xuXG4gICAgaWYgKGNvbnRyb2xVbml0KSB7XG4gICAgICBjb250cm9sVW5pdC5hZGRMaXN0ZW5lcigndXBkYXRlJywgbGlzdGVuZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBjb250cm9sVW5pdCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBsaXN0ZW5lciBmcm9tIGEgc3BlY2lmaWMgZXZlbnQgKGkuZS4gcGFyYW1ldGVyLCBpbmZvIG9yIGNvbW1hbmQpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTGlzdGVuZXIgY2FsbGJhY2suXG4gICAqL1xuICByZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgY29udHJvbFVuaXQgPSB0aGlzLmNvbnRyb2xVbml0c1tuYW1lXTtcblxuICAgIGlmIChjb250cm9sVW5pdCkge1xuICAgICAgY29udHJvbFVuaXQucmVtb3ZlTGlzdGVuZXIoJ3VwZGF0ZScsIGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gY29udHJvbFVuaXQgXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIGdldFZhbHVlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9sVW5pdHNbbmFtZV0udmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgYSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7KFN0cmluZ3xOdW1iZXJ8Qm9vbGVhbil9IHZhbCBOZXcgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbc2VuZFRvU2VydmVyPXRydWVdIEZsYWcgd2hldGhlciB0aGUgdmFsdWUgaXMgc2VudCB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbCwgc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgIGNvbnN0IGNvbnRyb2xVbml0ID0gdGhpcy5jb250cm9sVW5pdHNbbmFtZV07XG5cbiAgICBpZiAoY29udHJvbFVuaXQpIHtcbiAgICAgIGNvbnRyb2xVbml0LnNldCh2YWwpO1xuICAgICAgY29udHJvbFVuaXQucHJvcGFnYXRlKHNlbmRUb1NlcnZlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIGNvbnRyb2wgY29udHJvbFVuaXQgXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIF9jcmVhdGVDb250cm9sVW5pdChpbml0KSB7XG4gICAgbGV0IGNvbnRyb2xVbml0ID0gbnVsbDtcblxuICAgIHN3aXRjaCAoaW5pdC50eXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBjb250cm9sVW5pdCA9IG5ldyBfQ29udHJvbE51bWJlcih0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQubWluLCBpbml0Lm1heCwgaW5pdC5zdGVwLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgIGNvbnRyb2xVbml0ID0gbmV3IF9Db250cm9sU2VsZWN0KHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC5vcHRpb25zLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2luZm8nOlxuICAgICAgICBjb250cm9sVW5pdCA9IG5ldyBfQ29udHJvbEluZm8odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2NvbW1hbmQnOlxuICAgICAgICBjb250cm9sVW5pdCA9IG5ldyBfQ29udHJvbENvbW1hbmQodGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRyb2xVbml0O1xuICB9XG5cbiAgY29uZmlndXJlR3VpKG5hbWUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLl9ndWlDb25maWdbbmFtZV0gPSBvcHRpb25zO1xuICB9XG5cbiAgX2NyZWF0ZUd1aSh2aWV3LCBjb250cm9sVW5pdCkge1xuICAgIGxldCBndWkgPSBudWxsO1xuICAgIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIGNvbmZpcm06IGZhbHNlLFxuICAgIH0sIHRoaXMuX2d1aUNvbmZpZ1tjb250cm9sVW5pdC5uYW1lXSk7XG5cbiAgICBpZiAoY29uZmlnLnNob3cgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGNvbnRyb2xVbml0LnR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIC8vIGNhbiBiZSBgTnVtYmVyQm94YCBvciBgU2xpZGVyYFxuICAgICAgICBndWkgPSBuZXcgX051bWJlckd1aSh2aWV3LCBjb250cm9sVW5pdCwgY29uZmlnKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgIC8vIGNhbiBiZSBgU2VsZWN0TGlzdGAgb3IgYFNlbGVjdEJ1dHRvbnNgXG4gICAgICAgIGd1aSA9IG5ldyBfU2VsZWN0R3VpKHZpZXcsIGNvbnRyb2xVbml0LCBjb25maWcpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnY29tbWFuZCc6XG4gICAgICAgIC8vIGNhbiBiZSBgQnV0dG9uYCAob3IgYEJhbmdgIEB0b2RvKVxuICAgICAgICBndWkgPSBuZXcgX0NvbW1hbmRHdWkodmlldywgY29udHJvbFVuaXQsIGNvbmZpZyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdpbmZvJzpcbiAgICAgICAgLy8gY2FuIGJlXG4gICAgICAgIGd1aSA9IG5ldyBfSW5mb0d1aSh2aWV3LCBjb250cm9sVW5pdCwgY29uZmlnKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIGNhc2UgJ3RvZ2dsZScgP1xuICAgIH1cblxuICAgIGNvbnRyb2xVbml0LmFkZExpc3RlbmVyKCd1cGRhdGUnLCAodmFsKSA9PiBndWkuc2V0KHZhbCkpO1xuXG4gICAgcmV0dXJuIGd1aTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIG1vZHVsZSBhbmQgcmVxdWVzdHMgdGhlIHBhcmFtZXRlcnMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcblxuICAgIGxldCB2aWV3ID0gKHRoaXMuaGFzR3VpKSA/IHRoaXMudmlldyA6IG51bGw7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ2luaXQnLCAoZGF0YSkgPT4ge1xuICAgICAgaWYgKHZpZXcpIHtcbiAgICAgICAgLy8gY3JlYXRlIGEgdGVtcGxhdGVcbiAgICAgICAgbGV0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKTtcbiAgICAgICAgdGl0bGUuaW5uZXJIVE1MID0gJ0NvbmR1Y3Rvcic7XG4gICAgICAgIHZpZXcuJGVsLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgZCBvZiBkYXRhKSB7XG4gICAgICAgIGxldCBjb250cm9sVW5pdCA9IHRoaXMuX2NyZWF0ZUNvbnRyb2xVbml0KGQpO1xuICAgICAgICB0aGlzLmNvbnRyb2xVbml0c1tjb250cm9sVW5pdC5uYW1lXSA9IGNvbnRyb2xVbml0O1xuXG4gICAgICAgIGlmICh2aWV3KVxuICAgICAgICAgIHRoaXMuX2NyZWF0ZUd1aSh2aWV3LCBjb250cm9sVW5pdCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdmlldylcbiAgICAgICAgdGhpcy5kb25lKCk7XG4gICAgfSk7XG5cbiAgICAvLyBsaXN0ZW4gdG8gZXZlbnRzXG4gICAgdGhpcy5yZWNlaXZlKCd1cGRhdGUnLCAobmFtZSwgdmFsKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZShuYW1lLCB2YWwsIGZhbHNlKTsgLy8gdXBkYXRlLCBidXQgZG9uJ3Qgc2VuZCB0byBzZXJ2ZXJcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0cyB0aGUgbW9kdWxlIGFuZCByZXF1ZXN0cyB0aGUgcGFyYW1ldGVycyB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG4gIH1cbn1cbiJdfQ==