'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ServerModule2 = require('./ServerModule');

var _ServerModule3 = _interopRequireDefault(_ServerModule2);

var _comm = require('./comm');

var _comm2 = _interopRequireDefault(_comm);

var _events = require('events');

/**
 * @private
 */

var _ControlEvent = (function (_EventEmitter) {
  _inherits(_ControlEvent, _EventEmitter);

  function _ControlEvent(control, type, name, label) {
    var init = arguments.length <= 4 || arguments[4] === undefined ? undefined : arguments[4];
    var clientTypes = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

    _classCallCheck(this, _ControlEvent);

    _get(Object.getPrototypeOf(_ControlEvent.prototype), 'constructor', this).call(this);

    this.control = control;
    this.clientTypes = clientTypes;

    this.data = {
      type: type,
      name: name,
      label: label,
      value: init
    };
  }

  /**
   * @private
   */

  _createClass(_ControlEvent, [{
    key: 'set',
    value: function set(val) {
      this.data.value = value;
    }
  }, {
    key: 'update',
    value: function update() {
      var val = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
      var excludeClient = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      var control = this.control;
      var data = this.data;

      if (val === undefined) this.set(val); // set value

      this.emit(data.name, data.value); // call event listeners
      control.broadcast(this.clientTypes, excludeClient, 'update', data.name, data.value); // send to clients
      control.emit('update', data.name, data.value); // call control listeners
    }
  }]);

  return _ControlEvent;
})(_events.EventEmitter);

var _ControlNumber = (function (_ControlEvent2) {
  _inherits(_ControlNumber, _ControlEvent2);

  function _ControlNumber(control, name, label, min, max, step, init) {
    var clientTypes = arguments.length <= 7 || arguments[7] === undefined ? null : arguments[7];

    _classCallCheck(this, _ControlNumber);

    _get(Object.getPrototypeOf(_ControlNumber.prototype), 'constructor', this).call(this, control, 'number', name, label, init, clientTypes);

    this.data.min = min;
    this.data.max = max;
    this.data.step = step;
  }

  /**
   * @private
   */

  _createClass(_ControlNumber, [{
    key: 'set',
    value: function set(val) {
      this.value = Math.min(this.max, Math.max(this.min, val));
    }
  }]);

  return _ControlNumber;
})(_ControlEvent);

var _ControlSelect = (function (_ControlEvent3) {
  _inherits(_ControlSelect, _ControlEvent3);

  function _ControlSelect(control, name, label, options, init) {
    var clientTypes = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

    _classCallCheck(this, _ControlSelect);

    _get(Object.getPrototypeOf(_ControlSelect.prototype), 'constructor', this).call(this, control, 'select', name, label, init, clientTypes);

    this.data.options = options;
  }

  /**
   * @private
   */

  _createClass(_ControlSelect, [{
    key: 'set',
    value: function set(val) {
      var index = this.options.indexOf(val);

      if (index >= 0) {
        this.data.value = val;
        this.data.index = index;
      }
    }
  }]);

  return _ControlSelect;
})(_ControlEvent);

var _ControlInfo = (function (_ControlEvent4) {
  _inherits(_ControlInfo, _ControlEvent4);

  function _ControlInfo(control, name, label, init) {
    var clientTypes = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

    _classCallCheck(this, _ControlInfo);

    _get(Object.getPrototypeOf(_ControlInfo.prototype), 'constructor', this).call(this, control, 'info', name, label, init, clientTypes);
  }

  /**
   * @private
   */

  _createClass(_ControlInfo, [{
    key: 'set',
    value: function set(val) {
      this.data.value = val;
    }
  }]);

  return _ControlInfo;
})(_ControlEvent);

var _ControlCommand = (function (_ControlEvent5) {
  _inherits(_ControlCommand, _ControlEvent5);

  function _ControlCommand(control, name, label) {
    var clientTypes = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

    _classCallCheck(this, _ControlCommand);

    _get(Object.getPrototypeOf(_ControlCommand.prototype), 'constructor', this).call(this, control, 'command', name, label, undefined, clientTypes);
  }

  /**
   * [server] Manage the global `parameters`, `infos`, and `commands` across the whole scenario.
   *
   * The module keeps track of:
   * - `parameters`: values that can be updated by the actions of the clients (*e.g.* the gain of a synth);
   * - `infos`: information about the state of the scenario (*e.g.* number of clients in the performance);
   * - `commands`: can trigger an action (*e.g.* reload the page),
   * and propagates these to different client types.
   *
   * To set up controls in a scenario, you should extend this class on the server side and declare the controls specific to that scenario with the appropriate methods.
   *
   * (See also {@link src/client/ClientControl.js~ClientControl} on the client side.)
   *
   * @example // Example 1: make a `'conductor'` client to manage the controls
   * class MyControl extends ServerControl {
   *   constructor() {
   *     super();
   *
   *     // Parameter shared by all the client types
   *     this.addNumber('synth:gain', 'Synth gain', 0, 1, 0.1, 1);
   *     // Command propagated only to the `'player'` clients
   *     this.addCommand('reload', 'Reload the page', ['player']);
   *   }
   * }
   *
   * @example // Example 2: keep track of the number of `'player'` clients
   * class MyControl extends Control {
   *   constructor() {
   *     super();
   *     this.addInfo('numPlayers', 'Number of players', 0);
   *   }
   * }
   *
   * class MyPerformance extends Performance {
   *   constructor(control) {
   *     this._control = control;
   *   }
   *
   *   enter(client) {
   *     super.enter(client);
   *
   *     this._control.update('numPlayers', this.clients.length);
   *   }
   * }
   *
   * const control = new MyControl();
   * const performance = new MyPerformance(control);
   */
  return _ControlCommand;
})(_ControlEvent);

var ServerControl = (function (_ServerModule) {
  _inherits(ServerControl, _ServerModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='control'] Name of the module.
   */

  function ServerControl() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerControl);

    _get(Object.getPrototypeOf(ServerControl.prototype), 'constructor', this).call(this, options.name || 'control');

    /**
     * Dictionary of all control events.
     * @type {Object}
     */
    this.events = {};

    /**
     * Array of event data cells.
     * @type {Array}
     */
    this.data = [];
  }

  /**
   * Adds a number parameter.
   * @param {String} name Name of the parameter.
   * @param {String} label Label of the parameter (displayed on the control GUI on the client side).
   * @param {Number} min Minimum value of the parameter.
   * @param {Number} max Maximum value of the parameter.
   * @param {Number} step Step to increase or decrease the parameter value.
   * @param {Number} init Initial value of the parameter.
   * @param {String[]} [clientTypes=null] Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
   */

  _createClass(ServerControl, [{
    key: 'addNumber',
    value: function addNumber(name, label, min, max, step, init) {
      var clientTypes = arguments.length <= 6 || arguments[6] === undefined ? null : arguments[6];

      var event = new _ControlNumber(this, name, label, min, max, step, init, clientTypes);
      this.events[name] = event;
      this.data.push(event.data);
    }

    /**
     * Adds a select parameter.
     * @param {String} name Name of the parameter.
     * @param {String} label Label of the parameter (displayed on the control GUI on the client side).
     * @param {String[]} options Array of the different values the parameter can take.
     * @param {Number} init Initial value of the parameter (has to be in the `options` array).
     * @param {String[]} [clientTypes=null] Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addSelect',
    value: function addSelect(name, label, options, init) {
      var clientTypes = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

      console.log('addSelect', name, label, options, init, clientTypes);
      var event = new _ControlSelect(this, name, label, options, init, clientTypes);
      this.events[name] = event;
      this.data.push(event.data);
    }

    /**
     * Adds an info parameter.
     * @param {String} name Name of the parameter.
     * @param {String} label Label of the parameter (displayed on the control GUI on the client side).
     * @param {Number} init Initial value of the parameter (has to be in the `options` array).
     * @param {String[]} [clientTypes=null] Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addInfo',
    value: function addInfo(name, label, init) {
      var clientTypes = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      console.log('addInfo', name, label, init, clientTypes);
      var event = new _ControlInfo(this, name, label, init, clientTypes);
      this.events[name] = event;
      this.data.push(event.data);
    }

    /**
     * Adds a command.
     * @param {String} name Name of the command.
     * @param {String} label Label of the command (displayed on the control GUI on the client side).
     * @param {String[]} [clientTypes=null] Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addCommand',
    value: function addCommand(name, label) {
      var clientTypes = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      var event = new _ControlCommand(this, name, label, undefined, clientTypes);
      this.events[name] = event;
      this.data.push(event.data);
    }

    /**
     * Add listener to an event (i.e. parameter, info or command).
     * @param {String} name Name of the event.
     * @param {Function} listener Listener callback.
     */
  }, {
    key: 'addEventListener',
    value: function addEventListener(name, listener) {
      var event = this.events[name];

      if (event) event.addListener(listener);else console.log('unknown control event "' + name + '"');
    }

    /**
     * Remove listener from an event (i.e. parameter, info or command).
     * @param {String} name Name of the event.
     * @param {Function} listener Listener callback.
     */
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(name, listener) {
      var event = this.events[name];

      if (event) event.removeListener(listener);else console.log('unknown control event "' + name + '"');
    }

    /**
     * Updates the value of a parameter and sends it to the clients.
     * @param {String} name Name of the parameter to update.
     * @param {(String|Number|Boolean)} value New value of the parameter.
     */
  }, {
    key: 'update',
    value: function update(name, value) {
      var excludeClient = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      var event = this.events[name];

      if (event) event.update(value, excludeClient);else console.log('unknown control event "' + name + '"');
    }

    /**
     * @private
     */
  }, {
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(ServerControl.prototype), 'connect', this).call(this, client);

      // init control parameters, infos, and commands at client
      this.receive(client, 'request', function () {
        _this.send(client, 'init', _this.data);
      });

      // listen to control parameters
      this.receive(client, 'update', function (name, value) {
        _this.update(name, value, client); // update, but exclude client from broadcasting to clients
      });
    }
  }]);

  return ServerControl;
})(_ServerModule3['default']);

exports['default'] = ServerControl;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyQ29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzZCQUF5QixnQkFBZ0I7Ozs7b0JBQ3hCLFFBQVE7Ozs7c0JBQ0ksUUFBUTs7Ozs7O0lBSy9CLGFBQWE7WUFBYixhQUFhOztBQUNOLFdBRFAsYUFBYSxDQUNMLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBd0M7UUFBdEMsSUFBSSx5REFBRyxTQUFTO1FBQUUsV0FBVyx5REFBRyxJQUFJOzswQkFEeEUsYUFBYTs7QUFFZiwrQkFGRSxhQUFhLDZDQUVQOztBQUVSLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDOztBQUUvQixRQUFJLENBQUMsSUFBSSxHQUFHO0FBQ1YsVUFBSSxFQUFFLElBQUk7QUFDVixVQUFJLEVBQUUsSUFBSTtBQUNWLFdBQUssRUFBRSxLQUFLO0FBQ1osV0FBSyxFQUFFLElBQUk7S0FDWixDQUFDO0dBQ0g7Ozs7OztlQWJHLGFBQWE7O1dBZWQsYUFBQyxHQUFHLEVBQUU7QUFDUCxVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDekI7OztXQUVLLGtCQUF3QztVQUF2QyxHQUFHLHlEQUFHLFNBQVM7VUFBRSxhQUFhLHlEQUFHLElBQUk7O0FBQzFDLFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDM0IsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzs7QUFFckIsVUFBRyxHQUFHLEtBQUssU0FBUyxFQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVoQixVQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pDLGFBQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFD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bEMsQ0FBQyxDQUFDO0tBQ0o7OztTQXZJa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoic3JjL3NlcnZlci9TZXJ2ZXJDb250cm9sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlck1vZHVsZSBmcm9tICcuL1NlcnZlck1vZHVsZSc7XG5pbXBvcnQgY29tbSBmcm9tICcuL2NvbW0nO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfQ29udHJvbEV2ZW50IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgdHlwZSwgbmFtZSwgbGFiZWwsIGluaXQgPSB1bmRlZmluZWQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2wgPSBjb250cm9sO1xuICAgIHRoaXMuY2xpZW50VHlwZXMgPSBjbGllbnRUeXBlcztcblxuICAgIHRoaXMuZGF0YSA9IHtcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgdmFsdWU6IGluaXQsXG4gICAgfTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmRhdGEudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIHVwZGF0ZSh2YWwgPSB1bmRlZmluZWQsIGV4Y2x1ZGVDbGllbnQgPSBudWxsKSB7XG4gICAgbGV0IGNvbnRyb2wgPSB0aGlzLmNvbnRyb2w7XG4gICAgbGV0IGRhdGEgPSB0aGlzLmRhdGE7XG5cbiAgICBpZih2YWwgPT09IHVuZGVmaW5lZClcbiAgICAgIHRoaXMuc2V0KHZhbCk7IC8vIHNldCB2YWx1ZVxuXG4gICAgdGhpcy5lbWl0KGRhdGEubmFtZSwgZGF0YS52YWx1ZSk7IC8vIGNhbGwgZXZlbnQgbGlzdGVuZXJzXG4gICAgY29udHJvbC5icm9hZGNhc3QodGhpcy5jbGllbnRUeXBlcywgZXhjbHVkZUNsaWVudCwgJ3VwZGF0ZScsIGRhdGEubmFtZSwgZGF0YS52YWx1ZSk7IC8vIHNlbmQgdG8gY2xpZW50c1xuICAgIGNvbnRyb2wuZW1pdCgndXBkYXRlJywgZGF0YS5uYW1lLCBkYXRhLnZhbHVlKTsgLy8gY2FsbCBjb250cm9sIGxpc3RlbmVyc1xuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgX0NvbnRyb2xOdW1iZXIgZXh0ZW5kcyBfQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcihjb250cm9sLCAnbnVtYmVyJywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcblxuICAgIHRoaXMuZGF0YS5taW4gPSBtaW47XG4gICAgdGhpcy5kYXRhLm1heCA9IG1heDtcbiAgICB0aGlzLmRhdGEuc3RlcCA9IHN0ZXA7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IE1hdGgubWluKHRoaXMubWF4LCBNYXRoLm1heCh0aGlzLm1pbiwgdmFsKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfQ29udHJvbFNlbGVjdCBleHRlbmRzIF9Db250cm9sRXZlbnQge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgb3B0aW9ucywgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3NlbGVjdCcsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyk7XG5cbiAgICB0aGlzLmRhdGEub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5vcHRpb25zLmluZGV4T2YodmFsKTtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB0aGlzLmRhdGEudmFsdWUgPSB2YWw7XG4gICAgICB0aGlzLmRhdGEuaW5kZXggPSBpbmRleDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfQ29udHJvbEluZm8gZXh0ZW5kcyBfQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdpbmZvJywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmRhdGEudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfQ29udHJvbENvbW1hbmQgZXh0ZW5kcyBfQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdjb21tYW5kJywgbmFtZSwgbGFiZWwsIHVuZGVmaW5lZCwgY2xpZW50VHlwZXMpO1xuICB9XG59XG5cbi8qKlxuICogW3NlcnZlcl0gTWFuYWdlIHRoZSBnbG9iYWwgYHBhcmFtZXRlcnNgLCBgaW5mb3NgLCBhbmQgYGNvbW1hbmRzYCBhY3Jvc3MgdGhlIHdob2xlIHNjZW5hcmlvLlxuICpcbiAqIFRoZSBtb2R1bGUga2VlcHMgdHJhY2sgb2Y6XG4gKiAtIGBwYXJhbWV0ZXJzYDogdmFsdWVzIHRoYXQgY2FuIGJlIHVwZGF0ZWQgYnkgdGhlIGFjdGlvbnMgb2YgdGhlIGNsaWVudHMgKCplLmcuKiB0aGUgZ2FpbiBvZiBhIHN5bnRoKTtcbiAqIC0gYGluZm9zYDogaW5mb3JtYXRpb24gYWJvdXQgdGhlIHN0YXRlIG9mIHRoZSBzY2VuYXJpbyAoKmUuZy4qIG51bWJlciBvZiBjbGllbnRzIGluIHRoZSBwZXJmb3JtYW5jZSk7XG4gKiAtIGBjb21tYW5kc2A6IGNhbiB0cmlnZ2VyIGFuIGFjdGlvbiAoKmUuZy4qIHJlbG9hZCB0aGUgcGFnZSksXG4gKiBhbmQgcHJvcGFnYXRlcyB0aGVzZSB0byBkaWZmZXJlbnQgY2xpZW50IHR5cGVzLlxuICpcbiAqIFRvIHNldCB1cCBjb250cm9scyBpbiBhIHNjZW5hcmlvLCB5b3Ugc2hvdWxkIGV4dGVuZCB0aGlzIGNsYXNzIG9uIHRoZSBzZXJ2ZXIgc2lkZSBhbmQgZGVjbGFyZSB0aGUgY29udHJvbHMgc3BlY2lmaWMgdG8gdGhhdCBzY2VuYXJpbyB3aXRoIHRoZSBhcHByb3ByaWF0ZSBtZXRob2RzLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9DbGllbnRDb250cm9sLmpzfkNsaWVudENvbnRyb2x9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKlxuICogQGV4YW1wbGUgLy8gRXhhbXBsZSAxOiBtYWtlIGEgYCdjb25kdWN0b3InYCBjbGllbnQgdG8gbWFuYWdlIHRoZSBjb250cm9sc1xuICogY2xhc3MgTXlDb250cm9sIGV4dGVuZHMgU2VydmVyQ29udHJvbCB7XG4gKiAgIGNvbnN0cnVjdG9yKCkge1xuICogICAgIHN1cGVyKCk7XG4gKlxuICogICAgIC8vIFBhcmFtZXRlciBzaGFyZWQgYnkgYWxsIHRoZSBjbGllbnQgdHlwZXNcbiAqICAgICB0aGlzLmFkZE51bWJlcignc3ludGg6Z2FpbicsICdTeW50aCBnYWluJywgMCwgMSwgMC4xLCAxKTtcbiAqICAgICAvLyBDb21tYW5kIHByb3BhZ2F0ZWQgb25seSB0byB0aGUgYCdwbGF5ZXInYCBjbGllbnRzXG4gKiAgICAgdGhpcy5hZGRDb21tYW5kKCdyZWxvYWQnLCAnUmVsb2FkIHRoZSBwYWdlJywgWydwbGF5ZXInXSk7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBAZXhhbXBsZSAvLyBFeGFtcGxlIDI6IGtlZXAgdHJhY2sgb2YgdGhlIG51bWJlciBvZiBgJ3BsYXllcidgIGNsaWVudHNcbiAqIGNsYXNzIE15Q29udHJvbCBleHRlbmRzIENvbnRyb2wge1xuICogICBjb25zdHJ1Y3RvcigpIHtcbiAqICAgICBzdXBlcigpO1xuICogICAgIHRoaXMuYWRkSW5mbygnbnVtUGxheWVycycsICdOdW1iZXIgb2YgcGxheWVycycsIDApO1xuICogICB9XG4gKiB9XG4gKlxuICogY2xhc3MgTXlQZXJmb3JtYW5jZSBleHRlbmRzIFBlcmZvcm1hbmNlIHtcbiAqICAgY29uc3RydWN0b3IoY29udHJvbCkge1xuICogICAgIHRoaXMuX2NvbnRyb2wgPSBjb250cm9sO1xuICogICB9XG4gKlxuICogICBlbnRlcihjbGllbnQpIHtcbiAqICAgICBzdXBlci5lbnRlcihjbGllbnQpO1xuICpcbiAqICAgICB0aGlzLl9jb250cm9sLnVwZGF0ZSgnbnVtUGxheWVycycsIHRoaXMuY2xpZW50cy5sZW5ndGgpO1xuICogICB9XG4gKiB9XG4gKlxuICogY29uc3QgY29udHJvbCA9IG5ldyBNeUNvbnRyb2woKTtcbiAqIGNvbnN0IHBlcmZvcm1hbmNlID0gbmV3IE15UGVyZm9ybWFuY2UoY29udHJvbCk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckNvbnRyb2wgZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nY29udHJvbCddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY29udHJvbCcpO1xuXG4gICAgLyoqXG4gICAgICogRGljdGlvbmFyeSBvZiBhbGwgY29udHJvbCBldmVudHMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgZXZlbnQgZGF0YSBjZWxscy5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5kYXRhID0gW107XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG51bWJlciBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG1pbiBNaW5pbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtYXggTWF4aW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc3RlcCBTdGVwIHRvIGluY3JlYXNlIG9yIGRlY3JlYXNlIHRoZSBwYXJhbWV0ZXIgdmFsdWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbml0IEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGROdW1iZXIobmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBsZXQgZXZlbnQgPSBuZXcgX0NvbnRyb2xOdW1iZXIodGhpcywgbmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0LCBjbGllbnRUeXBlcyk7XG4gICAgdGhpcy5ldmVudHNbbmFtZV0gPSBldmVudDtcbiAgICB0aGlzLmRhdGEucHVzaChldmVudC5kYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgc2VsZWN0IHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBvcHRpb25zIEFycmF5IG9mIHRoZSBkaWZmZXJlbnQgdmFsdWVzIHRoZSBwYXJhbWV0ZXIgY2FuIHRha2UuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbml0IEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciAoaGFzIHRvIGJlIGluIHRoZSBgb3B0aW9uc2AgYXJyYXkpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZFNlbGVjdChuYW1lLCBsYWJlbCwgb3B0aW9ucywgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgY29uc29sZS5sb2coJ2FkZFNlbGVjdCcsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0LCBjbGllbnRUeXBlcyk7XG4gICAgbGV0IGV2ZW50ID0gbmV3IF9Db250cm9sU2VsZWN0KHRoaXMsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0LCBjbGllbnRUeXBlcyk7XG4gICAgdGhpcy5ldmVudHNbbmFtZV0gPSBldmVudDtcbiAgICB0aGlzLmRhdGEucHVzaChldmVudC5kYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGluZm8gcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbml0IEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciAoaGFzIHRvIGJlIGluIHRoZSBgb3B0aW9uc2AgYXJyYXkpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZEluZm8obmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIGNvbnNvbGUubG9nKCdhZGRJbmZvJywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzICk7XG4gICAgbGV0IGV2ZW50ID0gbmV3IF9Db250cm9sSW5mbyh0aGlzLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuICAgIHRoaXMuZXZlbnRzW25hbWVdID0gZXZlbnQ7XG4gICAgdGhpcy5kYXRhLnB1c2goZXZlbnQuZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGNvbW1hbmQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGNvbW1hbmQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBMYWJlbCBvZiB0aGUgY29tbWFuZCAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZENvbW1hbmQobmFtZSwgbGFiZWwsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIGxldCBldmVudCA9IG5ldyBfQ29udHJvbENvbW1hbmQodGhpcywgbmFtZSwgbGFiZWwsIHVuZGVmaW5lZCwgY2xpZW50VHlwZXMpO1xuICAgIHRoaXMuZXZlbnRzW25hbWVdID0gZXZlbnQ7XG4gICAgdGhpcy5kYXRhLnB1c2goZXZlbnQuZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGxpc3RlbmVyIHRvIGFuIGV2ZW50IChpLmUuIHBhcmFtZXRlciwgaW5mbyBvciBjb21tYW5kKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIExpc3RlbmVyIGNhbGxiYWNrLlxuICAgKi9cbiAgYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudHNbbmFtZV07XG5cbiAgICBpZiAoZXZlbnQpXG4gICAgICBldmVudC5hZGRMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gY29udHJvbCBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGxpc3RlbmVyIGZyb20gYW4gZXZlbnQgKGkuZS4gcGFyYW1ldGVyLCBpbmZvIG9yIGNvbW1hbmQpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTGlzdGVuZXIgY2FsbGJhY2suXG4gICAqL1xuICByZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgIGlmIChldmVudClcbiAgICAgIGV2ZW50LnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBjb250cm9sIGV2ZW50IFwiJyArIG5hbWUgKyAnXCInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB2YWx1ZSBvZiBhIHBhcmFtZXRlciBhbmQgc2VuZHMgaXQgdG8gdGhlIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7KFN0cmluZ3xOdW1iZXJ8Qm9vbGVhbil9IHZhbHVlIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbHVlLCBleGNsdWRlQ2xpZW50ID0gbnVsbCkge1xuICAgIGxldCBldmVudCA9IHRoaXMuZXZlbnRzW25hbWVdO1xuXG4gICAgaWYgKGV2ZW50KVxuICAgICAgZXZlbnQudXBkYXRlKHZhbHVlLCBleGNsdWRlQ2xpZW50KTtcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBjb250cm9sIGV2ZW50IFwiJyArIG5hbWUgKyAnXCInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICAvLyBpbml0IGNvbnRyb2wgcGFyYW1ldGVycywgaW5mb3MsIGFuZCBjb21tYW5kcyBhdCBjbGllbnRcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsICgpID0+IHtcbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdpbml0JywgdGhpcy5kYXRhKTtcbiAgICB9KTtcblxuICAgIC8vIGxpc3RlbiB0byBjb250cm9sIHBhcmFtZXRlcnNcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAndXBkYXRlJywgKG5hbWUsIHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZShuYW1lLCB2YWx1ZSwgY2xpZW50KTsgLy8gdXBkYXRlLCBidXQgZXhjbHVkZSBjbGllbnQgZnJvbSBicm9hZGNhc3RpbmcgdG8gY2xpZW50c1xuICAgIH0pO1xuICB9XG59XG4iXX0=