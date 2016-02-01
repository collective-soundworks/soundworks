'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _corePier = require('../core/Pier');

var _corePier2 = _interopRequireDefault(_corePier);

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
   * @private
   */
  return _CommandUnit;
})(_ControlUnit);

var _LabelUnit = (function (_ControlUnit6) {
  _inherits(_LabelUnit, _ControlUnit6);

  function _LabelUnit(control, name, label) {
    _classCallCheck(this, _LabelUnit);

    _get(Object.getPrototypeOf(_LabelUnit.prototype), 'constructor', this).call(this, control, 'label', name, label);
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

  _createClass(_LabelUnit, [{
    key: 'set',
    value: function set(val) {/* noop */}
  }]);

  return _LabelUnit;
})(_ControlUnit);

var ServerControl = (function (_Pier) {
  _inherits(ServerControl, _Pier);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='control'] - Name of the module.
   */

  function ServerControl() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerControl);

    _get(Object.getPrototypeOf(ServerControl.prototype), 'constructor', this).call(this, 'service:control');

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
   * @param {Number} min - Minimum value of the parameter.
   * @param {Number} max - Maximum value of the parameter.
   * @param {Number} step - Step to increase or decrease the parameter value.
   * @param {Number} init - Initial value of the parameter.
   * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
   */

  _createClass(ServerControl, [{
    key: 'addNumber',
    value: function addNumber(name, label, min, max, step, init) {
      var clientTypes = arguments.length <= 6 || arguments[6] === undefined ? null : arguments[6];

      return new _NumberUnit(this, name, label, min, max, step, init, clientTypes);
    }

    /**
     * Adds a enum parameter.
     * @param {String} name - Name of the parameter.
     * @param {String} label - Label of the parameter (displayed on the control GUI on the client side).
     * @param {String[]} options - Array of the different values the parameter can take.
     * @param {Number} init - Initial value of the parameter (has to be in the `options` array).
     * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addEnum',
    value: function addEnum(name, label, options, init) {
      var clientTypes = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

      return new _EnumUnit(this, name, label, options, init, clientTypes);
    }

    /**
     * Adds an info parameter.
     * @param {String} name - Name of the parameter.
     * @param {String} label - Label of the parameter (displayed on the control GUI on the client side).
     * @param {Number} init - Initial value of the parameter (has to be in the `options` array).
     * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addInfo',
    value: function addInfo(name, label, init) {
      var clientTypes = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      return new _InfoUnit(this, name, label, init, clientTypes);
    }

    /**
     * Adds a command.
     * @param {String} name - Name of the command.
     * @param {String} label - Label of the command (displayed on the control GUI on the client side).
     * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addCommand',
    value: function addCommand(name, label) {
      var clientTypes = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      return new _CommandUnit(this, name, label, undefined, clientTypes);
    }

    /**
     * Adds a label.
     * @param {String} name - Name of the label.
     * @param {String} label - Label of the label (displayed on the control GUI on the client side).
     */
  }, {
    key: 'addLabel',
    value: function addLabel(name, label) {
      return new _LabelUnit(this, name, label);
    }

    /**
     * Add listener to a control item (i.e. parameter, info or command).
     * The given listener is fired immediately with the unit current value.
     * @param {String} name - Name of the item.
     * @param {Function} listener - Listener callback.
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
     * @param {String} name - Name of the item.
     * @param {Function} listener - Listener callback.
     */
  }, {
    key: 'removeUnitListener',
    value: function removeUnitListener(name, listener) {
      var unit = this.units[name];

      if (unit) unit.removeListener(unit.data.name, listener);else console.log('unknown control item "' + name + '"');
    }

    /**
     * Updates the value of a parameter and sends it to the clients.
     * @param {String} name - Name of the parameter to update.
     * @param {(String|Number|Boolean)} value - New value of the parameter.
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
      _get(Object.getPrototypeOf(ServerControl.prototype), 'connect', this).call(this, client);

      // init control parameters, infos, and commands at client
      this.receive(client, 'request', this._onRequest(client));
      this.receive(client, 'update', this._onUpdate(client));
    }
  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this = this;

      return function () {
        return _this.send(client, 'init', _this._unitData);
      };
    }
  }, {
    key: '_onUpdate',
    value: function _onUpdate(client) {
      var _this2 = this;

      // update, but exclude client from broadcasting to other clients
      return function (name, value) {
        return _this2.update(name, value, client);
      };
    }
  }]);

  return ServerControl;
})(_corePier2['default']);

exports['default'] = ServerControl;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyQ29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3dCQUFpQixjQUFjOzs7O3NCQUNGLFFBQVE7Ozs7OztJQUsvQixZQUFZO1lBQVosWUFBWTs7QUFDTCxXQURQLFlBQVksQ0FDSixPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQXdDO1FBQXRDLElBQUkseURBQUcsU0FBUztRQUFFLFdBQVcseURBQUcsSUFBSTs7MEJBRHhFLFlBQVk7O0FBRWQsK0JBRkUsWUFBWSw2Q0FFTjs7QUFFUixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLElBQUksR0FBRztBQUNWLFVBQUksRUFBRSxJQUFJO0FBQ1YsVUFBSSxFQUFFLElBQUk7QUFDVixXQUFLLEVBQUUsS0FBSztBQUNaLFdBQUssRUFBRSxJQUFJO0tBQ1osQ0FBQzs7QUFFRixXQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztBQUMzQixXQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDbkM7Ozs7OztlQWhCRyxZQUFZOztXQWtCYixhQUFDLEdBQUcsRUFBRTtBQUNQLFVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztLQUN2Qjs7O1dBRUssa0JBQXdDO1VBQXZDLEdBQUcseURBQUcsU0FBUztVQUFFLGFBQWEseURBQUcsSUFBSTs7QUFDMUMsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUMzQixVQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDOztBQUVyQixVQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsVUFBSSxDQUFDLElBQUksQ0FBQyxJ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LE9BQUssTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDO09BQUEsQ0FBQztLQUMxRDs7O1NBN0lrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJzcmMvc2VydmVyL3NlcnZpY2VzL1NlcnZlckNvbnRyb2wuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGllciBmcm9tICcuLi9jb3JlL1BpZXInO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfQ29udHJvbFVuaXQgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCB0eXBlLCBuYW1lLCBsYWJlbCwgaW5pdCA9IHVuZGVmaW5lZCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY29udHJvbCA9IGNvbnRyb2w7XG4gICAgdGhpcy5jbGllbnRUeXBlcyA9IGNsaWVudFR5cGVzO1xuXG4gICAgdGhpcy5kYXRhID0ge1xuICAgICAgdHlwZTogdHlwZSxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBsYWJlbDogbGFiZWwsXG4gICAgICB2YWx1ZTogaW5pdCxcbiAgICB9O1xuXG4gICAgY29udHJvbC51bml0c1tuYW1lXSA9IHRoaXM7XG4gICAgY29udHJvbC5fdW5pdERhdGEucHVzaCh0aGlzLmRhdGEpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IHZhbDtcbiAgfVxuXG4gIHVwZGF0ZSh2YWwgPSB1bmRlZmluZWQsIGV4Y2x1ZGVDbGllbnQgPSBudWxsKSB7XG4gICAgbGV0IGNvbnRyb2wgPSB0aGlzLmNvbnRyb2w7XG4gICAgbGV0IGRhdGEgPSB0aGlzLmRhdGE7XG5cbiAgICB0aGlzLnNldCh2YWwpOyAvLyBzZXQgdmFsdWVcbiAgICB0aGlzLmVtaXQoZGF0YS5uYW1lLCBkYXRhLnZhbHVlKTsgLy8gY2FsbCBpdGVtIGxpc3RlbmVyc1xuICAgIGNvbnRyb2wuYnJvYWRjYXN0KHRoaXMuY2xpZW50VHlwZXMsIGV4Y2x1ZGVDbGllbnQsICd1cGRhdGUnLCBkYXRhLm5hbWUsIGRhdGEudmFsdWUpOyAvLyBzZW5kIHRvIGNsaWVudHNcbiAgICBjb250cm9sLmVtaXQoJ3VwZGF0ZScsIGRhdGEubmFtZSwgZGF0YS52YWx1ZSk7IC8vIGNhbGwgY29udHJvbCBsaXN0ZW5lcnNcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIF9OdW1iZXJVbml0IGV4dGVuZHMgX0NvbnRyb2xVbml0IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcihjb250cm9sLCAnbnVtYmVyJywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcblxuICAgIGxldCBkYXRhID0gdGhpcy5kYXRhO1xuICAgIGRhdGEubWluID0gbWluO1xuICAgIGRhdGEubWF4ID0gbWF4O1xuICAgIGRhdGEuc3RlcCA9IHN0ZXA7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5kYXRhLnZhbHVlID0gTWF0aC5taW4odGhpcy5kYXRhLm1heCwgTWF0aC5tYXgodGhpcy5kYXRhLm1pbiwgdmFsKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfRW51bVVuaXQgZXh0ZW5kcyBfQ29udHJvbFVuaXQge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgb3B0aW9ucywgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2VudW0nLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuXG4gICAgdGhpcy5kYXRhLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5kYXRhO1xuICAgIGxldCBpbmRleCA9IGRhdGEub3B0aW9ucy5pbmRleE9mKHZhbCk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgZGF0YS52YWx1ZSA9IHZhbDtcbiAgICAgIGRhdGEuaW5kZXggPSBpbmRleDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfSW5mb1VuaXQgZXh0ZW5kcyBfQ29udHJvbFVuaXQge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2luZm8nLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIF9Db21tYW5kVW5pdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcihjb250cm9sLCAnY29tbWFuZCcsIG5hbWUsIGxhYmVsLCB1bmRlZmluZWQsIGNsaWVudFR5cGVzKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIF9MYWJlbFVuaXQgZXh0ZW5kcyBfQ29udHJvbFVuaXQge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdsYWJlbCcsIG5hbWUsIGxhYmVsKTtcbiAgfVxuXG4gIHNldCh2YWwpIHsgLyogbm9vcCAqLyB9XG59XG5cblxuXG4vKipcbiAqIFtzZXJ2ZXJdIE1hbmFnZSB0aGUgZ2xvYmFsIGBwYXJhbWV0ZXJzYCwgYGluZm9zYCwgYW5kIGBjb21tYW5kc2AgYWNyb3NzIHRoZSB3aG9sZSBzY2VuYXJpby5cbiAqXG4gKiBUaGUgbW9kdWxlIGtlZXBzIHRyYWNrIG9mOlxuICogLSBgcGFyYW1ldGVyc2A6IHZhbHVlcyB0aGF0IGNhbiBiZSB1cGRhdGVkIGJ5IHRoZSBhY3Rpb25zIG9mIHRoZSBjbGllbnRzICgqZS5nLiogdGhlIGdhaW4gb2YgYSBzeW50aCk7XG4gKiAtIGBpbmZvc2A6IGluZm9ybWF0aW9uIGFib3V0IHRoZSBzdGF0ZSBvZiB0aGUgc2NlbmFyaW8gKCplLmcuKiBudW1iZXIgb2YgY2xpZW50cyBpbiB0aGUgcGVyZm9ybWFuY2UpO1xuICogLSBgY29tbWFuZHNgOiBjYW4gdHJpZ2dlciBhbiBhY3Rpb24gKCplLmcuKiByZWxvYWQgdGhlIHBhZ2UpLFxuICogYW5kIHByb3BhZ2F0ZXMgdGhlc2UgdG8gZGlmZmVyZW50IGNsaWVudCB0eXBlcy5cbiAqXG4gKiBUbyBzZXQgdXAgY29udHJvbHMgaW4gYSBzY2VuYXJpbywgeW91IHNob3VsZCBleHRlbmQgdGhpcyBjbGFzcyBvbiB0aGUgc2VydmVyIHNpZGUgYW5kIGRlY2xhcmUgdGhlIGNvbnRyb2xzIHNwZWNpZmljIHRvIHRoYXQgc2NlbmFyaW8gd2l0aCB0aGUgYXBwcm9wcmlhdGUgbWV0aG9kcy5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50Q29udHJvbC5qc35DbGllbnRDb250cm9sfSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICpcbiAqIEBleGFtcGxlIC8vIEV4YW1wbGUgMTogbWFrZSBhIGAnY29uZHVjdG9yJ2AgY2xpZW50IHRvIG1hbmFnZSB0aGUgY29udHJvbHNcbiAqIGNsYXNzIE15Q29udHJvbCBleHRlbmRzIFNlcnZlckNvbnRyb2wge1xuICogICBjb25zdHJ1Y3RvcigpIHtcbiAqICAgICBzdXBlcigpO1xuICpcbiAqICAgICAvLyBQYXJhbWV0ZXIgc2hhcmVkIGJ5IGFsbCB0aGUgY2xpZW50IHR5cGVzXG4gKiAgICAgdGhpcy5hZGROdW1iZXIoJ3N5bnRoOmdhaW4nLCAnU3ludGggZ2FpbicsIDAsIDEsIDAuMSwgMSk7XG4gKiAgICAgLy8gQ29tbWFuZCBwcm9wYWdhdGVkIG9ubHkgdG8gdGhlIGAncGxheWVyJ2AgY2xpZW50c1xuICogICAgIHRoaXMuYWRkQ29tbWFuZCgncmVsb2FkJywgJ1JlbG9hZCB0aGUgcGFnZScsIFsncGxheWVyJ10pO1xuICogICB9XG4gKiB9XG4gKlxuICogQGV4YW1wbGUgLy8gRXhhbXBsZSAyOiBrZWVwIHRyYWNrIG9mIHRoZSBudW1iZXIgb2YgYCdwbGF5ZXInYCBjbGllbnRzXG4gKiBjbGFzcyBNeUNvbnRyb2wgZXh0ZW5kcyBDb250cm9sIHtcbiAqICAgY29uc3RydWN0b3IoKSB7XG4gKiAgICAgc3VwZXIoKTtcbiAqICAgICB0aGlzLmFkZEluZm8oJ251bVBsYXllcnMnLCAnTnVtYmVyIG9mIHBsYXllcnMnLCAwKTtcbiAqICAgfVxuICogfVxuICpcbiAqIGNsYXNzIE15UGVyZm9ybWFuY2UgZXh0ZW5kcyBQZXJmb3JtYW5jZSB7XG4gKiAgIGNvbnN0cnVjdG9yKGNvbnRyb2wpIHtcbiAqICAgICB0aGlzLl9jb250cm9sID0gY29udHJvbDtcbiAqICAgfVxuICpcbiAqICAgZW50ZXIoY2xpZW50KSB7XG4gKiAgICAgc3VwZXIuZW50ZXIoY2xpZW50KTtcbiAqXG4gKiAgICAgdGhpcy5fY29udHJvbC51cGRhdGUoJ251bVBsYXllcnMnLCB0aGlzLmNsaWVudHMubGVuZ3RoKTtcbiAqICAgfVxuICogfVxuICpcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgTXlDb250cm9sKCk7XG4gKiBjb25zdCBwZXJmb3JtYW5jZSA9IG5ldyBNeVBlcmZvcm1hbmNlKGNvbnRyb2wpO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJDb250cm9sIGV4dGVuZHMgUGllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdjb250cm9sJ10gLSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcignc2VydmljZTpjb250cm9sJyk7XG5cbiAgICAvKipcbiAgICAgKiBEaWN0aW9uYXJ5IG9mIGFsbCBjb250cm9sIGl0ZW1zLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy51bml0cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgaXRlbSBkYXRhIGNlbGxzLlxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICB0aGlzLl91bml0RGF0YSA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBudW1iZXIgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtaW4gLSBNaW5pbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtYXggLSBNYXhpbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdGVwIC0gU3RlcCB0byBpbmNyZWFzZSBvciBkZWNyZWFzZSB0aGUgcGFyYW1ldGVyIHZhbHVlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5pdCAtIEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZE51bWJlcihuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX051bWJlclVuaXQodGhpcywgbmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0LCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGVudW0gcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBvcHRpb25zIC0gQXJyYXkgb2YgdGhlIGRpZmZlcmVudCB2YWx1ZXMgdGhlIHBhcmFtZXRlciBjYW4gdGFrZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluaXQgLSBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgKGhhcyB0byBiZSBpbiB0aGUgYG9wdGlvbnNgIGFycmF5KS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZEVudW0obmFtZSwgbGFiZWwsIG9wdGlvbnMsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX0VudW1Vbml0KHRoaXMsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0LCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBpbmZvIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluaXQgLSBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgKGhhcyB0byBiZSBpbiB0aGUgYG9wdGlvbnNgIGFycmF5KS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZEluZm8obmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX0luZm9Vbml0KHRoaXMsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGNvbW1hbmQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgY29tbWFuZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgb2YgdGhlIGNvbW1hbmQgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZENvbW1hbmQobmFtZSwgbGFiZWwsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX0NvbW1hbmRVbml0KHRoaXMsIG5hbWUsIGxhYmVsLCB1bmRlZmluZWQsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGFiZWwuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgbGFiZWwuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIExhYmVsIG9mIHRoZSBsYWJlbCAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKi9cbiAgYWRkTGFiZWwobmFtZSwgbGFiZWwpIHtcbiAgICByZXR1cm4gbmV3IF9MYWJlbFVuaXQodGhpcywgbmFtZSwgbGFiZWwpO1xuICB9XG5cblxuICAvKipcbiAgICogQWRkIGxpc3RlbmVyIHRvIGEgY29udHJvbCBpdGVtIChpLmUuIHBhcmFtZXRlciwgaW5mbyBvciBjb21tYW5kKS5cbiAgICogVGhlIGdpdmVuIGxpc3RlbmVyIGlzIGZpcmVkIGltbWVkaWF0ZWx5IHdpdGggdGhlIHVuaXQgY3VycmVudCB2YWx1ZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBpdGVtLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIGNhbGxiYWNrLlxuICAgKi9cbiAgYWRkVW5pdExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgdW5pdCA9IHRoaXMudW5pdHNbbmFtZV07XG5cbiAgICBpZiAodW5pdCkge1xuICAgICAgdW5pdC5hZGRMaXN0ZW5lcih1bml0LmRhdGEubmFtZSwgbGlzdGVuZXIpO1xuICAgICAgbGlzdGVuZXIodW5pdC5kYXRhLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gY29udHJvbCBpdGVtIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGxpc3RlbmVyIGZyb20gYSBjb250cm9sIGl0ZW0gKGkuZS4gcGFyYW1ldGVyLCBpbmZvIG9yIGNvbW1hbmQpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGl0ZW0uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIC0gTGlzdGVuZXIgY2FsbGJhY2suXG4gICAqL1xuICByZW1vdmVVbml0TGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCB1bml0ID0gdGhpcy51bml0c1tuYW1lXTtcblxuICAgIGlmICh1bml0KVxuICAgICAgdW5pdC5yZW1vdmVMaXN0ZW5lcih1bml0LmRhdGEubmFtZSwgbGlzdGVuZXIpO1xuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIGNvbnRyb2wgaXRlbSBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgYSBwYXJhbWV0ZXIgYW5kIHNlbmRzIGl0IHRvIHRoZSBjbGllbnRzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7KFN0cmluZ3xOdW1iZXJ8Qm9vbGVhbil9IHZhbHVlIC0gTmV3IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICB1cGRhdGUobmFtZSwgdmFsdWUsIGV4Y2x1ZGVDbGllbnQgPSBudWxsKSB7XG4gICAgY29uc3QgdW5pdCA9IHRoaXMudW5pdHNbbmFtZV07XG5cbiAgICBpZiAodW5pdClcbiAgICAgIHVuaXQudXBkYXRlKHZhbHVlLCBleGNsdWRlQ2xpZW50KTtcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBjb250cm9sIGl0ZW0gXCInICsgbmFtZSArICdcIicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIC8vIGluaXQgY29udHJvbCBwYXJhbWV0ZXJzLCBpbmZvcywgYW5kIGNvbW1hbmRzIGF0IGNsaWVudFxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICd1cGRhdGUnLCB0aGlzLl9vblVwZGF0ZShjbGllbnQpKTtcbiAgfVxuXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICgpID0+IHRoaXMuc2VuZChjbGllbnQsICdpbml0JywgdGhpcy5fdW5pdERhdGEpO1xuICB9XG5cbiAgX29uVXBkYXRlKGNsaWVudCkge1xuICAgIC8vIHVwZGF0ZSwgYnV0IGV4Y2x1ZGUgY2xpZW50IGZyb20gYnJvYWRjYXN0aW5nIHRvIG90aGVyIGNsaWVudHNcbiAgICByZXR1cm4gKG5hbWUsIHZhbHVlKSA9PiB0aGlzLnVwZGF0ZShuYW1lLCB2YWx1ZSwgY2xpZW50KTtcbiAgfVxufVxuIl19