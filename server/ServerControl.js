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
      this.data.value = val;
    }
  }, {
    key: 'update',
    value: function update() {
      var val = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
      var excludeClient = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      var control = this.control;
      var data = this.data;

      this.set(val); // set value
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

    var data = this.data;
    data.min = min;
    data.max = max;
    data.step = step;
  }

  /**
   * @private
   */

  _createClass(_ControlNumber, [{
    key: 'set',
    value: function set(val) {
      this.data.value = Math.min(this.data.max, Math.max(this.data.min, val));
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
      var data = this.data;
      var index = data.options.indexOf(val);

      if (index >= 0) {
        data.value = val;
        data.index = index;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyQ29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzZCQUF5QixnQkFBZ0I7Ozs7b0JBQ3hCLFFBQVE7Ozs7c0JBQ0ksUUFBUTs7Ozs7O0lBSy9CLGFBQWE7WUFBYixhQUFhOztBQUNOLFdBRFAsYUFBYSxDQUNMLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBd0M7UUFBdEMsSUFBSSx5REFBRyxTQUFTO1FBQUUsV0FBVyx5REFBRyxJQUFJOzswQkFEeEUsYUFBYTs7QUFFZiwrQkFGRSxhQUFhLDZDQUVQOztBQUVSLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDOztBQUUvQixRQUFJLENBQUMsSUFBSSxHQUFHO0FBQ1YsVUFBSSxFQUFFLElBQUk7QUFDVixVQUFJLEVBQUUsSUFBSTtBQUNWLFdBQUssRUFBRSxLQUFLO0FBQ1osV0FBSyxFQUFFLElBQUk7S0FDWixDQUFDO0dBQ0g7Ozs7OztlQWJHLGFBQWE7O1dBZWQsYUFBQyxHQUFHLEVBQUU7QUFDUCxVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7S0FDdkI7OztXQUVLLGtCQUF3QztVQUF2QyxHQUFHLHlEQUFHLFNBQVM7VUFBRSxhQUFhLHlEQUFHLElBQUk7O0FBQzFDLFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDM0IsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzs7QUFFckIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNkLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakMsYUFBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVB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bEMsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFaEMsVUFBSSxLQUFLLEVBQ1AsS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUUvQixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztLQUN2RDs7Ozs7Ozs7O1dBT0ssZ0JBQUMsSUFBSSxFQUFFLEtBQUssRUFBd0I7VUFBdEIsYUFBYSx5REFBRyxJQUFJOztBQUN0QyxVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUU5QixVQUFJLEtBQUssRUFDUCxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQyxLQUVuQyxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztLQUN2RDs7Ozs7OztXQUtNLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBMUhpQixhQUFhLHlDQTBIaEIsTUFBTSxFQUFFOzs7QUFHdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFlBQU07QUFDcEMsY0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFLLElBQUksQ0FBQyxDQUFDO09BQ3RDLENBQUMsQ0FBQzs7O0FBR0gsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBSztBQUM5QyxjQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ2xDLENBQUMsQ0FBQztLQUNKOzs7U0FySWtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU2VydmVyQ29udHJvbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJNb2R1bGUgZnJvbSAnLi9TZXJ2ZXJNb2R1bGUnO1xuaW1wb3J0IGNvbW0gZnJvbSAnLi9jb21tJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgX0NvbnRyb2xFdmVudCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIHR5cGUsIG5hbWUsIGxhYmVsLCBpbml0ID0gdW5kZWZpbmVkLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5jb250cm9sID0gY29udHJvbDtcbiAgICB0aGlzLmNsaWVudFR5cGVzID0gY2xpZW50VHlwZXM7XG5cbiAgICB0aGlzLmRhdGEgPSB7XG4gICAgICB0eXBlOiB0eXBlLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgIHZhbHVlOiBpbml0LFxuICAgIH07XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5kYXRhLnZhbHVlID0gdmFsO1xuICB9XG5cbiAgdXBkYXRlKHZhbCA9IHVuZGVmaW5lZCwgZXhjbHVkZUNsaWVudCA9IG51bGwpIHtcbiAgICBsZXQgY29udHJvbCA9IHRoaXMuY29udHJvbDtcbiAgICBsZXQgZGF0YSA9IHRoaXMuZGF0YTtcblxuICAgIHRoaXMuc2V0KHZhbCk7IC8vIHNldCB2YWx1ZVxuICAgIHRoaXMuZW1pdChkYXRhLm5hbWUsIGRhdGEudmFsdWUpOyAvLyBjYWxsIGV2ZW50IGxpc3RlbmVyc1xuICAgIGNvbnRyb2wuYnJvYWRjYXN0KHRoaXMuY2xpZW50VHlwZXMsIGV4Y2x1ZGVDbGllbnQsICd1cGRhdGUnLCBkYXRhLm5hbWUsIGRhdGEudmFsdWUpOyAvLyBzZW5kIHRvIGNsaWVudHNcbiAgICBjb250cm9sLmVtaXQoJ3VwZGF0ZScsIGRhdGEubmFtZSwgZGF0YS52YWx1ZSk7IC8vIGNhbGwgY29udHJvbCBsaXN0ZW5lcnNcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIF9Db250cm9sTnVtYmVyIGV4dGVuZHMgX0NvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ251bWJlcicsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyk7XG5cbiAgICBsZXQgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICBkYXRhLm1pbiA9IG1pbjtcbiAgICBkYXRhLm1heCA9IG1heDtcbiAgICBkYXRhLnN0ZXAgPSBzdGVwO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IE1hdGgubWluKHRoaXMuZGF0YS5tYXgsIE1hdGgubWF4KHRoaXMuZGF0YS5taW4sIHZhbCkpO1xuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgX0NvbnRyb2xTZWxlY3QgZXh0ZW5kcyBfQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIG9wdGlvbnMsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdzZWxlY3QnLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuXG4gICAgdGhpcy5kYXRhLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5kYXRhO1xuICAgIGxldCBpbmRleCA9IGRhdGEub3B0aW9ucy5pbmRleE9mKHZhbCk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgZGF0YS52YWx1ZSA9IHZhbDtcbiAgICAgIGRhdGEuaW5kZXggPSBpbmRleDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfQ29udHJvbEluZm8gZXh0ZW5kcyBfQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdpbmZvJywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmRhdGEudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfQ29udHJvbENvbW1hbmQgZXh0ZW5kcyBfQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdjb21tYW5kJywgbmFtZSwgbGFiZWwsIHVuZGVmaW5lZCwgY2xpZW50VHlwZXMpO1xuICB9XG59XG5cbi8qKlxuICogW3NlcnZlcl0gTWFuYWdlIHRoZSBnbG9iYWwgYHBhcmFtZXRlcnNgLCBgaW5mb3NgLCBhbmQgYGNvbW1hbmRzYCBhY3Jvc3MgdGhlIHdob2xlIHNjZW5hcmlvLlxuICpcbiAqIFRoZSBtb2R1bGUga2VlcHMgdHJhY2sgb2Y6XG4gKiAtIGBwYXJhbWV0ZXJzYDogdmFsdWVzIHRoYXQgY2FuIGJlIHVwZGF0ZWQgYnkgdGhlIGFjdGlvbnMgb2YgdGhlIGNsaWVudHMgKCplLmcuKiB0aGUgZ2FpbiBvZiBhIHN5bnRoKTtcbiAqIC0gYGluZm9zYDogaW5mb3JtYXRpb24gYWJvdXQgdGhlIHN0YXRlIG9mIHRoZSBzY2VuYXJpbyAoKmUuZy4qIG51bWJlciBvZiBjbGllbnRzIGluIHRoZSBwZXJmb3JtYW5jZSk7XG4gKiAtIGBjb21tYW5kc2A6IGNhbiB0cmlnZ2VyIGFuIGFjdGlvbiAoKmUuZy4qIHJlbG9hZCB0aGUgcGFnZSksXG4gKiBhbmQgcHJvcGFnYXRlcyB0aGVzZSB0byBkaWZmZXJlbnQgY2xpZW50IHR5cGVzLlxuICpcbiAqIFRvIHNldCB1cCBjb250cm9scyBpbiBhIHNjZW5hcmlvLCB5b3Ugc2hvdWxkIGV4dGVuZCB0aGlzIGNsYXNzIG9uIHRoZSBzZXJ2ZXIgc2lkZSBhbmQgZGVjbGFyZSB0aGUgY29udHJvbHMgc3BlY2lmaWMgdG8gdGhhdCBzY2VuYXJpbyB3aXRoIHRoZSBhcHByb3ByaWF0ZSBtZXRob2RzLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9DbGllbnRDb250cm9sLmpzfkNsaWVudENvbnRyb2x9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKlxuICogQGV4YW1wbGUgLy8gRXhhbXBsZSAxOiBtYWtlIGEgYCdjb25kdWN0b3InYCBjbGllbnQgdG8gbWFuYWdlIHRoZSBjb250cm9sc1xuICogY2xhc3MgTXlDb250cm9sIGV4dGVuZHMgU2VydmVyQ29udHJvbCB7XG4gKiAgIGNvbnN0cnVjdG9yKCkge1xuICogICAgIHN1cGVyKCk7XG4gKlxuICogICAgIC8vIFBhcmFtZXRlciBzaGFyZWQgYnkgYWxsIHRoZSBjbGllbnQgdHlwZXNcbiAqICAgICB0aGlzLmFkZE51bWJlcignc3ludGg6Z2FpbicsICdTeW50aCBnYWluJywgMCwgMSwgMC4xLCAxKTtcbiAqICAgICAvLyBDb21tYW5kIHByb3BhZ2F0ZWQgb25seSB0byB0aGUgYCdwbGF5ZXInYCBjbGllbnRzXG4gKiAgICAgdGhpcy5hZGRDb21tYW5kKCdyZWxvYWQnLCAnUmVsb2FkIHRoZSBwYWdlJywgWydwbGF5ZXInXSk7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBAZXhhbXBsZSAvLyBFeGFtcGxlIDI6IGtlZXAgdHJhY2sgb2YgdGhlIG51bWJlciBvZiBgJ3BsYXllcidgIGNsaWVudHNcbiAqIGNsYXNzIE15Q29udHJvbCBleHRlbmRzIENvbnRyb2wge1xuICogICBjb25zdHJ1Y3RvcigpIHtcbiAqICAgICBzdXBlcigpO1xuICogICAgIHRoaXMuYWRkSW5mbygnbnVtUGxheWVycycsICdOdW1iZXIgb2YgcGxheWVycycsIDApO1xuICogICB9XG4gKiB9XG4gKlxuICogY2xhc3MgTXlQZXJmb3JtYW5jZSBleHRlbmRzIFBlcmZvcm1hbmNlIHtcbiAqICAgY29uc3RydWN0b3IoY29udHJvbCkge1xuICogICAgIHRoaXMuX2NvbnRyb2wgPSBjb250cm9sO1xuICogICB9XG4gKlxuICogICBlbnRlcihjbGllbnQpIHtcbiAqICAgICBzdXBlci5lbnRlcihjbGllbnQpO1xuICpcbiAqICAgICB0aGlzLl9jb250cm9sLnVwZGF0ZSgnbnVtUGxheWVycycsIHRoaXMuY2xpZW50cy5sZW5ndGgpO1xuICogICB9XG4gKiB9XG4gKlxuICogY29uc3QgY29udHJvbCA9IG5ldyBNeUNvbnRyb2woKTtcbiAqIGNvbnN0IHBlcmZvcm1hbmNlID0gbmV3IE15UGVyZm9ybWFuY2UoY29udHJvbCk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckNvbnRyb2wgZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nY29udHJvbCddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY29udHJvbCcpO1xuXG4gICAgLyoqXG4gICAgICogRGljdGlvbmFyeSBvZiBhbGwgY29udHJvbCBldmVudHMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgZXZlbnQgZGF0YSBjZWxscy5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5kYXRhID0gW107XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG51bWJlciBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG1pbiBNaW5pbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtYXggTWF4aW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc3RlcCBTdGVwIHRvIGluY3JlYXNlIG9yIGRlY3JlYXNlIHRoZSBwYXJhbWV0ZXIgdmFsdWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbml0IEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGROdW1iZXIobmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBsZXQgZXZlbnQgPSBuZXcgX0NvbnRyb2xOdW1iZXIodGhpcywgbmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0LCBjbGllbnRUeXBlcyk7XG4gICAgdGhpcy5ldmVudHNbbmFtZV0gPSBldmVudDtcbiAgICB0aGlzLmRhdGEucHVzaChldmVudC5kYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgc2VsZWN0IHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBvcHRpb25zIEFycmF5IG9mIHRoZSBkaWZmZXJlbnQgdmFsdWVzIHRoZSBwYXJhbWV0ZXIgY2FuIHRha2UuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbml0IEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciAoaGFzIHRvIGJlIGluIHRoZSBgb3B0aW9uc2AgYXJyYXkpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZFNlbGVjdChuYW1lLCBsYWJlbCwgb3B0aW9ucywgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgbGV0IGV2ZW50ID0gbmV3IF9Db250cm9sU2VsZWN0KHRoaXMsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0LCBjbGllbnRUeXBlcyk7XG4gICAgdGhpcy5ldmVudHNbbmFtZV0gPSBldmVudDtcbiAgICB0aGlzLmRhdGEucHVzaChldmVudC5kYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGluZm8gcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbml0IEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciAoaGFzIHRvIGJlIGluIHRoZSBgb3B0aW9uc2AgYXJyYXkpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZEluZm8obmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIGxldCBldmVudCA9IG5ldyBfQ29udHJvbEluZm8odGhpcywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcbiAgICB0aGlzLmV2ZW50c1tuYW1lXSA9IGV2ZW50O1xuICAgIHRoaXMuZGF0YS5wdXNoKGV2ZW50LmRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBjb21tYW5kLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBjb21tYW5kLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgTGFiZWwgb2YgdGhlIGNvbW1hbmQgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGRDb21tYW5kKG5hbWUsIGxhYmVsLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBsZXQgZXZlbnQgPSBuZXcgX0NvbnRyb2xDb21tYW5kKHRoaXMsIG5hbWUsIGxhYmVsLCB1bmRlZmluZWQsIGNsaWVudFR5cGVzKTtcbiAgICB0aGlzLmV2ZW50c1tuYW1lXSA9IGV2ZW50O1xuICAgIHRoaXMuZGF0YS5wdXNoKGV2ZW50LmRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBsaXN0ZW5lciB0byBhbiBldmVudCAoaS5lLiBwYXJhbWV0ZXIsIGluZm8gb3IgY29tbWFuZCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBMaXN0ZW5lciBjYWxsYmFjay5cbiAgICovXG4gIGFkZEV2ZW50TGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBldmVudCA9IHRoaXMuZXZlbnRzW25hbWVdO1xuXG4gICAgaWYgKGV2ZW50KVxuICAgICAgZXZlbnQuYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIGNvbnRyb2wgZXZlbnQgXCInICsgbmFtZSArICdcIicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBsaXN0ZW5lciBmcm9tIGFuIGV2ZW50IChpLmUuIHBhcmFtZXRlciwgaW5mbyBvciBjb21tYW5kKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIExpc3RlbmVyIGNhbGxiYWNrLlxuICAgKi9cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudHNbbmFtZV07XG5cbiAgICBpZiAoZXZlbnQpXG4gICAgICBldmVudC5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gY29udHJvbCBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgYSBwYXJhbWV0ZXIgYW5kIHNlbmRzIGl0IHRvIHRoZSBjbGllbnRzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0geyhTdHJpbmd8TnVtYmVyfEJvb2xlYW4pfSB2YWx1ZSBOZXcgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIHVwZGF0ZShuYW1lLCB2YWx1ZSwgZXhjbHVkZUNsaWVudCA9IG51bGwpIHtcbiAgICBsZXQgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgIGlmIChldmVudClcbiAgICAgIGV2ZW50LnVwZGF0ZSh2YWx1ZSwgZXhjbHVkZUNsaWVudCk7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gY29udHJvbCBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgLy8gaW5pdCBjb250cm9sIHBhcmFtZXRlcnMsIGluZm9zLCBhbmQgY29tbWFuZHMgYXQgY2xpZW50XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCAoKSA9PiB7XG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCAnaW5pdCcsIHRoaXMuZGF0YSk7XG4gICAgfSk7XG5cbiAgICAvLyBsaXN0ZW4gdG8gY29udHJvbCBwYXJhbWV0ZXJzXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3VwZGF0ZScsIChuYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGUobmFtZSwgdmFsdWUsIGNsaWVudCk7IC8vIHVwZGF0ZSwgYnV0IGV4Y2x1ZGUgY2xpZW50IGZyb20gYnJvYWRjYXN0aW5nIHRvIGNsaWVudHNcbiAgICB9KTtcbiAgfVxufVxuIl19