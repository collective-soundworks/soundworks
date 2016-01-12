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

var _ControlUnit = (function (_EventEmitter) {
  _inherits(_ControlUnit, _EventEmitter);

  function _ControlUnit(control, type, name, label) {
    var init = arguments.length <= 4 || arguments[4] === undefined ? undefined : arguments[4];
    var clientTypes = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

    _classCallCheck(this, _ControlUnit);

    _get(Object.getPrototypeOf(_ControlUnit.prototype), 'constructor', this).call(this);

    this.control = control;
    this.clientTypes = clientTypes;

    this.data = {
      type: type,
      name: name,
      label: label,
      value: init
    };

    control.units[name] = this;
    control._unitData.push(this.data);
  }

  /**
   * @private
   */

  _createClass(_ControlUnit, [{
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
      this.emit(data.name, data.value); // call item listeners
      control.broadcast(this.clientTypes, excludeClient, 'update', data.name, data.value); // send to clients
      control.emit('update', data.name, data.value); // call control listeners
    }
  }]);

  return _ControlUnit;
})(_events.EventEmitter);

var _NumberUnit = (function (_ControlUnit2) {
  _inherits(_NumberUnit, _ControlUnit2);

  function _NumberUnit(control, name, label, min, max, step, init) {
    var clientTypes = arguments.length <= 7 || arguments[7] === undefined ? null : arguments[7];

    _classCallCheck(this, _NumberUnit);

    _get(Object.getPrototypeOf(_NumberUnit.prototype), 'constructor', this).call(this, control, 'number', name, label, init, clientTypes);

    var data = this.data;
    data.min = min;
    data.max = max;
    data.step = step;
  }

  /**
   * @private
   */

  _createClass(_NumberUnit, [{
    key: 'set',
    value: function set(val) {
      this.data.value = Math.min(this.data.max, Math.max(this.data.min, val));
    }
  }]);

  return _NumberUnit;
})(_ControlUnit);

var _EnumUnit = (function (_ControlUnit3) {
  _inherits(_EnumUnit, _ControlUnit3);

  function _EnumUnit(control, name, label, options, init) {
    var clientTypes = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

    _classCallCheck(this, _EnumUnit);

    _get(Object.getPrototypeOf(_EnumUnit.prototype), 'constructor', this).call(this, control, 'enum', name, label, init, clientTypes);

    this.data.options = options;
  }

  /**
   * @private
   */

  _createClass(_EnumUnit, [{
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

  return _EnumUnit;
})(_ControlUnit);

var _InfoUnit = (function (_ControlUnit4) {
  _inherits(_InfoUnit, _ControlUnit4);

  function _InfoUnit(control, name, label, init) {
    var clientTypes = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

    _classCallCheck(this, _InfoUnit);

    _get(Object.getPrototypeOf(_InfoUnit.prototype), 'constructor', this).call(this, control, 'info', name, label, init, clientTypes);
  }

  /**
   * @private
   */

  _createClass(_InfoUnit, [{
    key: 'set',
    value: function set(val) {
      this.data.value = val;
    }
  }]);

  return _InfoUnit;
})(_ControlUnit);

var _CommandUnit = (function (_ControlUnit5) {
  _inherits(_CommandUnit, _ControlUnit5);

  function _CommandUnit(control, name, label) {
    var clientTypes = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

    _classCallCheck(this, _CommandUnit);

    _get(Object.getPrototypeOf(_CommandUnit.prototype), 'constructor', this).call(this, control, 'command', name, label, undefined, clientTypes);
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
  return _CommandUnit;
})(_ControlUnit);

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
     * Dictionary of all control items.
     * @type {Object}
     */
    this.units = {};

    /**
     * Array of item data cells.
     * @type {Array}
     */
    this._unitData = [];
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

      return new _NumberUnit(this, name, label, min, max, step, init, clientTypes);
    }

    /**
     * Adds a enum parameter.
     * @param {String} name Name of the parameter.
     * @param {String} label Label of the parameter (displayed on the control GUI on the client side).
     * @param {String[]} options Array of the different values the parameter can take.
     * @param {Number} init Initial value of the parameter (has to be in the `options` array).
     * @param {String[]} [clientTypes=null] Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addEnum',
    value: function addEnum(name, label, options, init) {
      var clientTypes = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

      return new _EnumUnit(this, name, label, options, init, clientTypes);
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

      return new _InfoUnit(this, name, label, init, clientTypes);
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

      return new _CommandUnit(this, name, label, undefined, clientTypes);
    }

    /**
     * Add listener to a control item (i.e. parameter, info or command).
     * The given listener is fired immediately with the unit current value.
     * @param {String} name Name of the item.
     * @param {Function} listener Listener callback.
     */
  }, {
    key: 'addUnitListener',
    value: function addUnitListener(name, listener) {
      var unit = this.units[name];

      if (unit) {
        unit.addListener(unit.data.name, listener);
        listener(unit.data.value);
      } else {
        console.log('unknown control item "' + name + '"');
      }
    }

    /**
     * Remove listener from a control item (i.e. parameter, info or command).
     * @param {String} name Name of the item.
     * @param {Function} listener Listener callback.
     */
  }, {
    key: 'removeUnitListener',
    value: function removeUnitListener(name, listener) {
      var unit = this.units[name];

      if (unit) unit.removeListener(unit.data.name, listener);else console.log('unknown control item "' + name + '"');
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

      var unit = this.units[name];

      if (unit) unit.update(value, excludeClient);else console.log('unknown control item "' + name + '"');
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
        _this.send(client, 'init', _this._unitData);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyQ29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzZCQUF5QixnQkFBZ0I7Ozs7b0JBQ3hCLFFBQVE7Ozs7c0JBQ0ksUUFBUTs7Ozs7O0lBSy9CLFlBQVk7WUFBWixZQUFZOztBQUNMLFdBRFAsWUFBWSxDQUNKLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBd0M7UUFBdEMsSUFBSSx5REFBRyxTQUFTO1FBQUUsV0FBVyx5REFBRyxJQUFJOzswQkFEeEUsWUFBWTs7QUFFZCwrQkFGRSxZQUFZLDZDQUVOOztBQUVSLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDOztBQUUvQixRQUFJLENBQUMsSUFBSSxHQUFHO0FBQ1YsVUFBSSxFQUFFLElBQUk7QUFDVixVQUFJLEVBQUUsSUFBSTtBQUNWLFdBQUssRUFBRSxLQUFLO0FBQ1osV0FBSyxFQUFFLElBQUk7S0FDWixDQUFDOztBQUVGLFdBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzNCLFdBQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNuQzs7Ozs7O2VBaEJHLFlBQVk7O1dBa0JiLGFBQUMsR0FBRyxFQUFFO0FBQ1AsVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0tBQ3ZCOzs7V0FFSyxrQkFBd0M7VUFBdkMsR0FBRyx5REFBRyxTQUFTO1VBQUUsYUFBYSx5REFBRyxJQUFJOztBQUMxQyxVQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzNCLFVBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7O0FBRXJCLFVBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDZCxVQUFJLENBQUMsSUFB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QUN0QyxVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUU5QixVQUFJLElBQUksRUFDTixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQyxLQUVsQyxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztLQUN0RDs7Ozs7OztXQUtNLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBckhpQixhQUFhLHlDQXFIaEIsTUFBTSxFQUFFOzs7QUFHdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFlBQU07QUFDcEMsY0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFLLFNBQVMsQ0FBQyxDQUFDO09BQzNDLENBQUMsQ0FBQzs7O0FBR0gsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBSztBQUM5QyxjQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ2xDLENBQUMsQ0FBQztLQUNKOzs7U0FoSWtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU2VydmVyQ29udHJvbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJNb2R1bGUgZnJvbSAnLi9TZXJ2ZXJNb2R1bGUnO1xuaW1wb3J0IGNvbW0gZnJvbSAnLi9jb21tJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgX0NvbnRyb2xVbml0IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgdHlwZSwgbmFtZSwgbGFiZWwsIGluaXQgPSB1bmRlZmluZWQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2wgPSBjb250cm9sO1xuICAgIHRoaXMuY2xpZW50VHlwZXMgPSBjbGllbnRUeXBlcztcblxuICAgIHRoaXMuZGF0YSA9IHtcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgdmFsdWU6IGluaXQsXG4gICAgfTtcblxuICAgIGNvbnRyb2wudW5pdHNbbmFtZV0gPSB0aGlzO1xuICAgIGNvbnRyb2wuX3VuaXREYXRhLnB1c2godGhpcy5kYXRhKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmRhdGEudmFsdWUgPSB2YWw7XG4gIH1cblxuICB1cGRhdGUodmFsID0gdW5kZWZpbmVkLCBleGNsdWRlQ2xpZW50ID0gbnVsbCkge1xuICAgIGxldCBjb250cm9sID0gdGhpcy5jb250cm9sO1xuICAgIGxldCBkYXRhID0gdGhpcy5kYXRhO1xuXG4gICAgdGhpcy5zZXQodmFsKTsgLy8gc2V0IHZhbHVlXG4gICAgdGhpcy5lbWl0KGRhdGEubmFtZSwgZGF0YS52YWx1ZSk7IC8vIGNhbGwgaXRlbSBsaXN0ZW5lcnNcbiAgICBjb250cm9sLmJyb2FkY2FzdCh0aGlzLmNsaWVudFR5cGVzLCBleGNsdWRlQ2xpZW50LCAndXBkYXRlJywgZGF0YS5uYW1lLCBkYXRhLnZhbHVlKTsgLy8gc2VuZCB0byBjbGllbnRzXG4gICAgY29udHJvbC5lbWl0KCd1cGRhdGUnLCBkYXRhLm5hbWUsIGRhdGEudmFsdWUpOyAvLyBjYWxsIGNvbnRyb2wgbGlzdGVuZXJzXG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfTnVtYmVyVW5pdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ251bWJlcicsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyk7XG5cbiAgICBsZXQgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICBkYXRhLm1pbiA9IG1pbjtcbiAgICBkYXRhLm1heCA9IG1heDtcbiAgICBkYXRhLnN0ZXAgPSBzdGVwO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IE1hdGgubWluKHRoaXMuZGF0YS5tYXgsIE1hdGgubWF4KHRoaXMuZGF0YS5taW4sIHZhbCkpO1xuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgX0VudW1Vbml0IGV4dGVuZHMgX0NvbnRyb2xVbml0IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIG9wdGlvbnMsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdlbnVtJywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcblxuICAgIHRoaXMuZGF0YS5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICBsZXQgaW5kZXggPSBkYXRhLm9wdGlvbnMuaW5kZXhPZih2YWwpO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIGRhdGEudmFsdWUgPSB2YWw7XG4gICAgICBkYXRhLmluZGV4ID0gaW5kZXg7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgX0luZm9Vbml0IGV4dGVuZHMgX0NvbnRyb2xVbml0IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdpbmZvJywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmRhdGEudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfQ29tbWFuZFVuaXQgZXh0ZW5kcyBfQ29udHJvbFVuaXQge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2NvbW1hbmQnLCBuYW1lLCBsYWJlbCwgdW5kZWZpbmVkLCBjbGllbnRUeXBlcyk7XG4gIH1cbn1cblxuLyoqXG4gKiBbc2VydmVyXSBNYW5hZ2UgdGhlIGdsb2JhbCBgcGFyYW1ldGVyc2AsIGBpbmZvc2AsIGFuZCBgY29tbWFuZHNgIGFjcm9zcyB0aGUgd2hvbGUgc2NlbmFyaW8uXG4gKlxuICogVGhlIG1vZHVsZSBrZWVwcyB0cmFjayBvZjpcbiAqIC0gYHBhcmFtZXRlcnNgOiB2YWx1ZXMgdGhhdCBjYW4gYmUgdXBkYXRlZCBieSB0aGUgYWN0aW9ucyBvZiB0aGUgY2xpZW50cyAoKmUuZy4qIHRoZSBnYWluIG9mIGEgc3ludGgpO1xuICogLSBgaW5mb3NgOiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc3RhdGUgb2YgdGhlIHNjZW5hcmlvICgqZS5nLiogbnVtYmVyIG9mIGNsaWVudHMgaW4gdGhlIHBlcmZvcm1hbmNlKTtcbiAqIC0gYGNvbW1hbmRzYDogY2FuIHRyaWdnZXIgYW4gYWN0aW9uICgqZS5nLiogcmVsb2FkIHRoZSBwYWdlKSxcbiAqIGFuZCBwcm9wYWdhdGVzIHRoZXNlIHRvIGRpZmZlcmVudCBjbGllbnQgdHlwZXMuXG4gKlxuICogVG8gc2V0IHVwIGNvbnRyb2xzIGluIGEgc2NlbmFyaW8sIHlvdSBzaG91bGQgZXh0ZW5kIHRoaXMgY2xhc3Mgb24gdGhlIHNlcnZlciBzaWRlIGFuZCBkZWNsYXJlIHRoZSBjb250cm9scyBzcGVjaWZpYyB0byB0aGF0IHNjZW5hcmlvIHdpdGggdGhlIGFwcHJvcHJpYXRlIG1ldGhvZHMuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudENvbnRyb2wuanN+Q2xpZW50Q29udHJvbH0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSAvLyBFeGFtcGxlIDE6IG1ha2UgYSBgJ2NvbmR1Y3RvcidgIGNsaWVudCB0byBtYW5hZ2UgdGhlIGNvbnRyb2xzXG4gKiBjbGFzcyBNeUNvbnRyb2wgZXh0ZW5kcyBTZXJ2ZXJDb250cm9sIHtcbiAqICAgY29uc3RydWN0b3IoKSB7XG4gKiAgICAgc3VwZXIoKTtcbiAqXG4gKiAgICAgLy8gUGFyYW1ldGVyIHNoYXJlZCBieSBhbGwgdGhlIGNsaWVudCB0eXBlc1xuICogICAgIHRoaXMuYWRkTnVtYmVyKCdzeW50aDpnYWluJywgJ1N5bnRoIGdhaW4nLCAwLCAxLCAwLjEsIDEpO1xuICogICAgIC8vIENvbW1hbmQgcHJvcGFnYXRlZCBvbmx5IHRvIHRoZSBgJ3BsYXllcidgIGNsaWVudHNcbiAqICAgICB0aGlzLmFkZENvbW1hbmQoJ3JlbG9hZCcsICdSZWxvYWQgdGhlIHBhZ2UnLCBbJ3BsYXllciddKTtcbiAqICAgfVxuICogfVxuICpcbiAqIEBleGFtcGxlIC8vIEV4YW1wbGUgMjoga2VlcCB0cmFjayBvZiB0aGUgbnVtYmVyIG9mIGAncGxheWVyJ2AgY2xpZW50c1xuICogY2xhc3MgTXlDb250cm9sIGV4dGVuZHMgQ29udHJvbCB7XG4gKiAgIGNvbnN0cnVjdG9yKCkge1xuICogICAgIHN1cGVyKCk7XG4gKiAgICAgdGhpcy5hZGRJbmZvKCdudW1QbGF5ZXJzJywgJ051bWJlciBvZiBwbGF5ZXJzJywgMCk7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBjbGFzcyBNeVBlcmZvcm1hbmNlIGV4dGVuZHMgUGVyZm9ybWFuY2Uge1xuICogICBjb25zdHJ1Y3Rvcihjb250cm9sKSB7XG4gKiAgICAgdGhpcy5fY29udHJvbCA9IGNvbnRyb2w7XG4gKiAgIH1cbiAqXG4gKiAgIGVudGVyKGNsaWVudCkge1xuICogICAgIHN1cGVyLmVudGVyKGNsaWVudCk7XG4gKlxuICogICAgIHRoaXMuX2NvbnRyb2wudXBkYXRlKCdudW1QbGF5ZXJzJywgdGhpcy5jbGllbnRzLmxlbmd0aCk7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBjb25zdCBjb250cm9sID0gbmV3IE15Q29udHJvbCgpO1xuICogY29uc3QgcGVyZm9ybWFuY2UgPSBuZXcgTXlQZXJmb3JtYW5jZShjb250cm9sKTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyQ29udHJvbCBleHRlbmRzIFNlcnZlck1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdjb250cm9sJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdjb250cm9sJyk7XG5cbiAgICAvKipcbiAgICAgKiBEaWN0aW9uYXJ5IG9mIGFsbCBjb250cm9sIGl0ZW1zLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy51bml0cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgaXRlbSBkYXRhIGNlbGxzLlxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICB0aGlzLl91bml0RGF0YSA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBudW1iZXIgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtaW4gTWluaW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbWF4IE1heGltdW0gdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0ZXAgU3RlcCB0byBpbmNyZWFzZSBvciBkZWNyZWFzZSB0aGUgcGFyYW1ldGVyIHZhbHVlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5pdCBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkTnVtYmVyKG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBfTnVtYmVyVW5pdCh0aGlzLCBuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIGluaXQsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgZW51bSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gb3B0aW9ucyBBcnJheSBvZiB0aGUgZGlmZmVyZW50IHZhbHVlcyB0aGUgcGFyYW1ldGVyIGNhbiB0YWtlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5pdCBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgKGhhcyB0byBiZSBpbiB0aGUgYG9wdGlvbnNgIGFycmF5KS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGRFbnVtKG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IF9FbnVtVW5pdCh0aGlzLCBuYW1lLCBsYWJlbCwgb3B0aW9ucywgaW5pdCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gaW5mbyBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluaXQgSW5pdGlhbCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyIChoYXMgdG8gYmUgaW4gdGhlIGBvcHRpb25zYCBhcnJheSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkSW5mbyhuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBfSW5mb1VuaXQodGhpcywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgY29tbWFuZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgY29tbWFuZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIExhYmVsIG9mIHRoZSBjb21tYW5kIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkQ29tbWFuZChuYW1lLCBsYWJlbCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBfQ29tbWFuZFVuaXQodGhpcywgbmFtZSwgbGFiZWwsIHVuZGVmaW5lZCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBsaXN0ZW5lciB0byBhIGNvbnRyb2wgaXRlbSAoaS5lLiBwYXJhbWV0ZXIsIGluZm8gb3IgY29tbWFuZCkuXG4gICAqIFRoZSBnaXZlbiBsaXN0ZW5lciBpcyBmaXJlZCBpbW1lZGlhdGVseSB3aXRoIHRoZSB1bml0IGN1cnJlbnQgdmFsdWUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGl0ZW0uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIExpc3RlbmVyIGNhbGxiYWNrLlxuICAgKi9cbiAgYWRkVW5pdExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgdW5pdCA9IHRoaXMudW5pdHNbbmFtZV07XG5cbiAgICBpZiAodW5pdCkge1xuICAgICAgdW5pdC5hZGRMaXN0ZW5lcih1bml0LmRhdGEubmFtZSwgbGlzdGVuZXIpO1xuICAgICAgbGlzdGVuZXIodW5pdC5kYXRhLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gY29udHJvbCBpdGVtIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGxpc3RlbmVyIGZyb20gYSBjb250cm9sIGl0ZW0gKGkuZS4gcGFyYW1ldGVyLCBpbmZvIG9yIGNvbW1hbmQpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBpdGVtLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBMaXN0ZW5lciBjYWxsYmFjay5cbiAgICovXG4gIHJlbW92ZVVuaXRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IHVuaXQgPSB0aGlzLnVuaXRzW25hbWVdO1xuXG4gICAgaWYgKHVuaXQpXG4gICAgICB1bml0LnJlbW92ZUxpc3RlbmVyKHVuaXQuZGF0YS5uYW1lLCBsaXN0ZW5lcik7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gY29udHJvbCBpdGVtIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB2YWx1ZSBvZiBhIHBhcmFtZXRlciBhbmQgc2VuZHMgaXQgdG8gdGhlIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7KFN0cmluZ3xOdW1iZXJ8Qm9vbGVhbil9IHZhbHVlIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbHVlLCBleGNsdWRlQ2xpZW50ID0gbnVsbCkge1xuICAgIGNvbnN0IHVuaXQgPSB0aGlzLnVuaXRzW25hbWVdO1xuXG4gICAgaWYgKHVuaXQpXG4gICAgICB1bml0LnVwZGF0ZSh2YWx1ZSwgZXhjbHVkZUNsaWVudCk7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gY29udHJvbCBpdGVtIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICAvLyBpbml0IGNvbnRyb2wgcGFyYW1ldGVycywgaW5mb3MsIGFuZCBjb21tYW5kcyBhdCBjbGllbnRcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsICgpID0+IHtcbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdpbml0JywgdGhpcy5fdW5pdERhdGEpO1xuICAgIH0pO1xuXG4gICAgLy8gbGlzdGVuIHRvIGNvbnRyb2wgcGFyYW1ldGVyc1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICd1cGRhdGUnLCAobmFtZSwgdmFsdWUpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlKG5hbWUsIHZhbHVlLCBjbGllbnQpOyAvLyB1cGRhdGUsIGJ1dCBleGNsdWRlIGNsaWVudCBmcm9tIGJyb2FkY2FzdGluZyB0byBjbGllbnRzXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==