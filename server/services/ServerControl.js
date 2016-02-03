'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreServerActivity = require('../core/ServerActivity');

var _coreServerActivity2 = _interopRequireDefault(_coreServerActivity);

var _coreServerServiceManager = require('../core/serverServiceManager');

var _coreServerServiceManager2 = _interopRequireDefault(_coreServerServiceManager);

var _events = require('events');

/** @private */

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

  /** @private */

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

var _BooleanUnit = (function (_ControlUnit2) {
  _inherits(_BooleanUnit, _ControlUnit2);

  function _BooleanUnit(control, name, label, init) {
    var clientTypes = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

    _classCallCheck(this, _BooleanUnit);

    _get(Object.getPrototypeOf(_BooleanUnit.prototype), 'constructor', this).call(this, control, 'boolean', name, label, init, clientType);
  }

  /** @private */

  _createClass(_BooleanUnit, [{
    key: 'set',
    value: function set(val) {
      this.data.value = val;
    }
  }]);

  return _BooleanUnit;
})(_ControlUnit);

var _EnumUnit = (function (_ControlUnit3) {
  _inherits(_EnumUnit, _ControlUnit3);

  function _EnumUnit(control, name, label, options, init) {
    var clientTypes = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

    _classCallCheck(this, _EnumUnit);

    _get(Object.getPrototypeOf(_EnumUnit.prototype), 'constructor', this).call(this, control, 'enum', name, label, init, clientTypes);

    this.data.options = options;
  }

  /** @private */

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

var _NumberUnit = (function (_ControlUnit4) {
  _inherits(_NumberUnit, _ControlUnit4);

  function _NumberUnit(control, name, label, min, max, step, init) {
    var clientTypes = arguments.length <= 7 || arguments[7] === undefined ? null : arguments[7];

    _classCallCheck(this, _NumberUnit);

    _get(Object.getPrototypeOf(_NumberUnit.prototype), 'constructor', this).call(this, control, 'number', name, label, init, clientTypes);

    var data = this.data;
    data.min = min;
    data.max = max;
    data.step = step;
  }

  /** @private */

  _createClass(_NumberUnit, [{
    key: 'set',
    value: function set(val) {
      this.data.value = Math.min(this.data.max, Math.max(this.data.min, val));
    }
  }]);

  return _NumberUnit;
})(_ControlUnit);

var _TextUnit = (function (_ControlUnit5) {
  _inherits(_TextUnit, _ControlUnit5);

  function _TextUnit(control, name, label, init) {
    var clientTypes = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

    _classCallCheck(this, _TextUnit);

    _get(Object.getPrototypeOf(_TextUnit.prototype), 'constructor', this).call(this, control, 'text', name, label, init, clientTypes);
  }

  /** @private */

  _createClass(_TextUnit, [{
    key: 'set',
    value: function set(val) {
      this.data.value = val;
    }
  }]);

  return _TextUnit;
})(_ControlUnit);

var _TriggerUnit = (function (_ControlUnit6) {
  _inherits(_TriggerUnit, _ControlUnit6);

  function _TriggerUnit(control, name, label) {
    var clientTypes = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

    _classCallCheck(this, _TriggerUnit);

    _get(Object.getPrototypeOf(_TriggerUnit.prototype), 'constructor', this).call(this, control, 'trigger', name, label, undefined, clientTypes);
  }

  return _TriggerUnit;
})(_ControlUnit);

var SERVICE_ID = 'service:control';

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

var ServerControl = (function (_ServerActivity) {
  _inherits(ServerControl, _ServerActivity);

  function ServerControl() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerControl);

    _get(Object.getPrototypeOf(ServerControl.prototype), 'constructor', this).call(this, SERVICE_ID);

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

  _createClass(ServerControl, [{
    key: 'addItem',
    value: function addItem() {
      var args = _Array$from(arguments);
      var type = args.shift();
      var unit = undefined;

      switch (type) {
        case 'boolean':
          unit = this.addBool.apply(this, args);
          break;
        case 'enum':
          unit = this.addEnum.apply(this, args);
          break;
        case 'number':
          unit = this.addNumber.apply(this, args);
          break;
        case 'text':
          unit = this.addText.apply(this, args);
          break;
        case 'trigger':
          unit = this.addTrigger.apply(this, args);
          break;
      }

      return unit;
    }

    /**
     * Adds a `boolean` parameter.
     * @param {String} name - Name of the parameter.
     * @param {String} label - Label of the parameter (displayed on the control GUI on the client side).
     * @param {Number} init - Initial value of the parameter (`true` or `false`).
     * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addBoolean',
    value: function addBoolean(name, label, init) {
      var clientTypes = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      return new _BooleanUnit(this, name, label, init, clientTypes);
    }

    /**
     * Adds an `enum` parameter.
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
     * Adds a `number` parameter.
     * @param {String} name Name of the parameter.
     * @param {String} label Label of the parameter (displayed on the control GUI on the client side).
     * @param {Number} min - Minimum value of the parameter.
     * @param {Number} max - Maximum value of the parameter.
     * @param {Number} step - Step to increase or decrease the parameter value.
     * @param {Number} init - Initial value of the parameter.
     * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addNumber',
    value: function addNumber(name, label, min, max, step, init) {
      var clientTypes = arguments.length <= 6 || arguments[6] === undefined ? null : arguments[6];

      return new _NumberUnit(this, name, label, min, max, step, init, clientTypes);
    }

    /**
     * Adds a `text` parameter.
     * @param {String} name - Name of the parameter.
     * @param {String} label - Label of the parameter (displayed on the control GUI on the client side).
     * @param {Number} init - Initial value of the parameter (has to be in the `options` array).
     * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addText',
    value: function addText(name, label, init) {
      var clientTypes = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      return new _TextUnit(this, name, label, init, clientTypes);
    }

    /**
     * Adds a trigger.
     * @param {String} name - Name of the command.
     * @param {String} label - Label of the command (displayed on the control GUI on the client side).
     * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addTrigger',
    value: function addTrigger(name, label) {
      var clientTypes = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      return new _TriggerUnit(this, name, label, undefined, clientTypes);
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

    /** @private */
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
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, ServerControl);

exports['default'] = ServerControl;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyQ29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBQTJCLHdCQUF3Qjs7Ozt3Q0FDbEIsOEJBQThCOzs7O3NCQUNsQyxRQUFROzs7O0lBRy9CLFlBQVk7WUFBWixZQUFZOztBQUNMLFdBRFAsWUFBWSxDQUNKLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBd0M7UUFBdEMsSUFBSSx5REFBRyxTQUFTO1FBQUUsV0FBVyx5REFBRyxJQUFJOzswQkFEeEUsWUFBWTs7QUFFZCwrQkFGRSxZQUFZLDZDQUVOOztBQUVSLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDOztBQUUvQixRQUFJLENBQUMsSUFBSSxHQUFHO0FBQ1YsVUFBSSxFQUFFLElBQUk7QUFDVixVQUFJLEVBQUUsSUFBSTtBQUNWLFdBQUssRUFBRSxLQUFLO0FBQ1osV0FBSyxFQUFFLElBQUk7S0FDWixDQUFDOztBQUVGLFdBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzNCLFdBQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNuQzs7OztlQWhCRyxZQUFZOztXQWtCYixhQUFDLEdBQUcsRUFBRTtBQUNQLFVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztLQUN2Qjs7O1dBRUssa0JBQXdDO1VBQXZDLEdBQUcseURBQUcsU0FBUztVQUFFLGFBQWEseURBQUcsSUFBSTs7QUFDMUMsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUMzQixVQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDOztBQUVyQixVQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsVUFB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LE1BQU0sQ0FBQztPQUFBLENBQUM7S0FDMUQ7OztTQWxLRyxhQUFhOzs7QUFxS25CLHNDQUFxQixRQUFRLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDOztxQkFFMUMsYUFBYSIsImZpbGUiOiJzcmMvc2VydmVyL3NlcnZpY2VzL1NlcnZlckNvbnRyb2wuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9Db250cm9sVW5pdCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIHR5cGUsIG5hbWUsIGxhYmVsLCBpbml0ID0gdW5kZWZpbmVkLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5jb250cm9sID0gY29udHJvbDtcbiAgICB0aGlzLmNsaWVudFR5cGVzID0gY2xpZW50VHlwZXM7XG5cbiAgICB0aGlzLmRhdGEgPSB7XG4gICAgICB0eXBlOiB0eXBlLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgIHZhbHVlOiBpbml0LFxuICAgIH07XG5cbiAgICBjb250cm9sLnVuaXRzW25hbWVdID0gdGhpcztcbiAgICBjb250cm9sLl91bml0RGF0YS5wdXNoKHRoaXMuZGF0YSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5kYXRhLnZhbHVlID0gdmFsO1xuICB9XG5cbiAgdXBkYXRlKHZhbCA9IHVuZGVmaW5lZCwgZXhjbHVkZUNsaWVudCA9IG51bGwpIHtcbiAgICBsZXQgY29udHJvbCA9IHRoaXMuY29udHJvbDtcbiAgICBsZXQgZGF0YSA9IHRoaXMuZGF0YTtcblxuICAgIHRoaXMuc2V0KHZhbCk7IC8vIHNldCB2YWx1ZVxuICAgIHRoaXMuZW1pdChkYXRhLm5hbWUsIGRhdGEudmFsdWUpOyAvLyBjYWxsIGl0ZW0gbGlzdGVuZXJzXG4gICAgY29udHJvbC5icm9hZGNhc3QodGhpcy5jbGllbnRUeXBlcywgZXhjbHVkZUNsaWVudCwgJ3VwZGF0ZScsIGRhdGEubmFtZSwgZGF0YS52YWx1ZSk7IC8vIHNlbmQgdG8gY2xpZW50c1xuICAgIGNvbnRyb2wuZW1pdCgndXBkYXRlJywgZGF0YS5uYW1lLCBkYXRhLnZhbHVlKTsgLy8gY2FsbCBjb250cm9sIGxpc3RlbmVyc1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0Jvb2xlYW5Vbml0IGV4dGVuZHMgX0NvbnRyb2xVbml0IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdib29sZWFuJywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGUpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9FbnVtVW5pdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcihjb250cm9sLCAnZW51bScsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyk7XG5cbiAgICB0aGlzLmRhdGEub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgbGV0IGRhdGEgPSB0aGlzLmRhdGE7XG4gICAgbGV0IGluZGV4ID0gZGF0YS5vcHRpb25zLmluZGV4T2YodmFsKTtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBkYXRhLnZhbHVlID0gdmFsO1xuICAgICAgZGF0YS5pbmRleCA9IGluZGV4O1xuICAgIH1cbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9OdW1iZXJVbml0IGV4dGVuZHMgX0NvbnRyb2xVbml0IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcihjb250cm9sLCAnbnVtYmVyJywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcblxuICAgIGxldCBkYXRhID0gdGhpcy5kYXRhO1xuICAgIGRhdGEubWluID0gbWluO1xuICAgIGRhdGEubWF4ID0gbWF4O1xuICAgIGRhdGEuc3RlcCA9IHN0ZXA7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5kYXRhLnZhbHVlID0gTWF0aC5taW4odGhpcy5kYXRhLm1heCwgTWF0aC5tYXgodGhpcy5kYXRhLm1pbiwgdmFsKSk7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfVGV4dFVuaXQgZXh0ZW5kcyBfQ29udHJvbFVuaXQge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3RleHQnLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UcmlnZ2VyVW5pdCBleHRlbmRzIF9Db250cm9sVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcihjb250cm9sLCAndHJpZ2dlcicsIG5hbWUsIGxhYmVsLCB1bmRlZmluZWQsIGNsaWVudFR5cGVzKTtcbiAgfVxufVxuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpjb250cm9sJztcblxuLyoqXG4gKiBbc2VydmVyXSBNYW5hZ2UgdGhlIGdsb2JhbCBgcGFyYW1ldGVyc2AsIGBpbmZvc2AsIGFuZCBgY29tbWFuZHNgIGFjcm9zcyB0aGUgd2hvbGUgc2NlbmFyaW8uXG4gKlxuICogVGhlIG1vZHVsZSBrZWVwcyB0cmFjayBvZjpcbiAqIC0gYHBhcmFtZXRlcnNgOiB2YWx1ZXMgdGhhdCBjYW4gYmUgdXBkYXRlZCBieSB0aGUgYWN0aW9ucyBvZiB0aGUgY2xpZW50cyAoKmUuZy4qIHRoZSBnYWluIG9mIGEgc3ludGgpO1xuICogLSBgaW5mb3NgOiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc3RhdGUgb2YgdGhlIHNjZW5hcmlvICgqZS5nLiogbnVtYmVyIG9mIGNsaWVudHMgaW4gdGhlIHBlcmZvcm1hbmNlKTtcbiAqIC0gYGNvbW1hbmRzYDogY2FuIHRyaWdnZXIgYW4gYWN0aW9uICgqZS5nLiogcmVsb2FkIHRoZSBwYWdlKSxcbiAqIGFuZCBwcm9wYWdhdGVzIHRoZXNlIHRvIGRpZmZlcmVudCBjbGllbnQgdHlwZXMuXG4gKlxuICogVG8gc2V0IHVwIGNvbnRyb2xzIGluIGEgc2NlbmFyaW8sIHlvdSBzaG91bGQgZXh0ZW5kIHRoaXMgY2xhc3Mgb24gdGhlIHNlcnZlciBzaWRlIGFuZCBkZWNsYXJlIHRoZSBjb250cm9scyBzcGVjaWZpYyB0byB0aGF0IHNjZW5hcmlvIHdpdGggdGhlIGFwcHJvcHJpYXRlIG1ldGhvZHMuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudENvbnRyb2wuanN+Q2xpZW50Q29udHJvbH0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSAvLyBFeGFtcGxlIDE6IG1ha2UgYSBgJ2NvbmR1Y3RvcidgIGNsaWVudCB0byBtYW5hZ2UgdGhlIGNvbnRyb2xzXG4gKiBjbGFzcyBNeUNvbnRyb2wgZXh0ZW5kcyBTZXJ2ZXJDb250cm9sIHtcbiAqICAgY29uc3RydWN0b3IoKSB7XG4gKiAgICAgc3VwZXIoKTtcbiAqXG4gKiAgICAgLy8gUGFyYW1ldGVyIHNoYXJlZCBieSBhbGwgdGhlIGNsaWVudCB0eXBlc1xuICogICAgIHRoaXMuYWRkTnVtYmVyKCdzeW50aDpnYWluJywgJ1N5bnRoIGdhaW4nLCAwLCAxLCAwLjEsIDEpO1xuICogICAgIC8vIENvbW1hbmQgcHJvcGFnYXRlZCBvbmx5IHRvIHRoZSBgJ3BsYXllcidgIGNsaWVudHNcbiAqICAgICB0aGlzLmFkZENvbW1hbmQoJ3JlbG9hZCcsICdSZWxvYWQgdGhlIHBhZ2UnLCBbJ3BsYXllciddKTtcbiAqICAgfVxuICogfVxuICpcbiAqIEBleGFtcGxlIC8vIEV4YW1wbGUgMjoga2VlcCB0cmFjayBvZiB0aGUgbnVtYmVyIG9mIGAncGxheWVyJ2AgY2xpZW50c1xuICogY2xhc3MgTXlDb250cm9sIGV4dGVuZHMgQ29udHJvbCB7XG4gKiAgIGNvbnN0cnVjdG9yKCkge1xuICogICAgIHN1cGVyKCk7XG4gKiAgICAgdGhpcy5hZGRJbmZvKCdudW1QbGF5ZXJzJywgJ051bWJlciBvZiBwbGF5ZXJzJywgMCk7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBjbGFzcyBNeVBlcmZvcm1hbmNlIGV4dGVuZHMgUGVyZm9ybWFuY2Uge1xuICogICBjb25zdHJ1Y3Rvcihjb250cm9sKSB7XG4gKiAgICAgdGhpcy5fY29udHJvbCA9IGNvbnRyb2w7XG4gKiAgIH1cbiAqXG4gKiAgIGVudGVyKGNsaWVudCkge1xuICogICAgIHN1cGVyLmVudGVyKGNsaWVudCk7XG4gKlxuICogICAgIHRoaXMuX2NvbnRyb2wudXBkYXRlKCdudW1QbGF5ZXJzJywgdGhpcy5jbGllbnRzLmxlbmd0aCk7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBjb25zdCBjb250cm9sID0gbmV3IE15Q29udHJvbCgpO1xuICogY29uc3QgcGVyZm9ybWFuY2UgPSBuZXcgTXlQZXJmb3JtYW5jZShjb250cm9sKTtcbiAqL1xuY2xhc3MgU2VydmVyQ29udHJvbCBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICAvKipcbiAgICAgKiBEaWN0aW9uYXJ5IG9mIGFsbCBjb250cm9sIGl0ZW1zLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy51bml0cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgaXRlbSBkYXRhIGNlbGxzLlxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICB0aGlzLl91bml0RGF0YSA9IFtdO1xuICB9XG5cbiAgYWRkSXRlbSgpIHtcbiAgICBjb25zdCBhcmdzID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xuICAgIGNvbnN0IHR5cGUgPSBhcmdzLnNoaWZ0KCk7XG4gICAgbGV0IHVuaXQ7XG5cbiAgICBzd2l0Y2godHlwZSkge1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIHVuaXQgPSB0aGlzLmFkZEJvb2wuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZW51bSc6XG4gICAgICAgIHVuaXQgPSB0aGlzLmFkZEVudW0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgdW5pdCA9IHRoaXMuYWRkTnVtYmVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICB1bml0ID0gdGhpcy5hZGRUZXh0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RyaWdnZXInOlxuICAgICAgICB1bml0ID0gdGhpcy5hZGRUcmlnZ2VyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gdW5pdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgYGJvb2xlYW5gIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluaXQgLSBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgKGB0cnVlYCBvciBgZmFsc2VgKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZEJvb2xlYW4obmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX0Jvb2xlYW5Vbml0KHRoaXMsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBgZW51bWAgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBvcHRpb25zIC0gQXJyYXkgb2YgdGhlIGRpZmZlcmVudCB2YWx1ZXMgdGhlIHBhcmFtZXRlciBjYW4gdGFrZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluaXQgLSBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgKGhhcyB0byBiZSBpbiB0aGUgYG9wdGlvbnNgIGFycmF5KS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZEVudW0obmFtZSwgbGFiZWwsIG9wdGlvbnMsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX0VudW1Vbml0KHRoaXMsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0LCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGBudW1iZXJgIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbWluIC0gTWluaW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbWF4IC0gTWF4aW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc3RlcCAtIFN0ZXAgdG8gaW5jcmVhc2Ugb3IgZGVjcmVhc2UgdGhlIHBhcmFtZXRlciB2YWx1ZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluaXQgLSBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSAtIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGROdW1iZXIobmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IF9OdW1iZXJVbml0KHRoaXMsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBgdGV4dGAgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5pdCAtIEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciAoaGFzIHRvIGJlIGluIHRoZSBgb3B0aW9uc2AgYXJyYXkpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gLSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkVGV4dChuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBfVGV4dFVuaXQodGhpcywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdHJpZ2dlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBjb21tYW5kLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBMYWJlbCBvZiB0aGUgY29tbWFuZCAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gLSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkVHJpZ2dlcihuYW1lLCBsYWJlbCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBfVHJpZ2dlclVuaXQodGhpcywgbmFtZSwgbGFiZWwsIHVuZGVmaW5lZCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBsaXN0ZW5lciB0byBhIGNvbnRyb2wgaXRlbSAoaS5lLiBwYXJhbWV0ZXIsIGluZm8gb3IgY29tbWFuZCkuXG4gICAqIFRoZSBnaXZlbiBsaXN0ZW5lciBpcyBmaXJlZCBpbW1lZGlhdGVseSB3aXRoIHRoZSB1bml0IGN1cnJlbnQgdmFsdWUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgaXRlbS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgLSBMaXN0ZW5lciBjYWxsYmFjay5cbiAgICovXG4gIGFkZFVuaXRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IHVuaXQgPSB0aGlzLnVuaXRzW25hbWVdO1xuXG4gICAgaWYgKHVuaXQpIHtcbiAgICAgIHVuaXQuYWRkTGlzdGVuZXIodW5pdC5kYXRhLm5hbWUsIGxpc3RlbmVyKTtcbiAgICAgIGxpc3RlbmVyKHVuaXQuZGF0YS52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIGNvbnRyb2wgaXRlbSBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBsaXN0ZW5lciBmcm9tIGEgY29udHJvbCBpdGVtIChpLmUuIHBhcmFtZXRlciwgaW5mbyBvciBjb21tYW5kKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBpdGVtLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIGNhbGxiYWNrLlxuICAgKi9cbiAgcmVtb3ZlVW5pdExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgdW5pdCA9IHRoaXMudW5pdHNbbmFtZV07XG5cbiAgICBpZiAodW5pdClcbiAgICAgIHVuaXQucmVtb3ZlTGlzdGVuZXIodW5pdC5kYXRhLm5hbWUsIGxpc3RlbmVyKTtcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBjb250cm9sIGl0ZW0gXCInICsgbmFtZSArICdcIicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHZhbHVlIG9mIGEgcGFyYW1ldGVyIGFuZCBzZW5kcyBpdCB0byB0aGUgY2xpZW50cy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0geyhTdHJpbmd8TnVtYmVyfEJvb2xlYW4pfSB2YWx1ZSAtIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbHVlLCBleGNsdWRlQ2xpZW50ID0gbnVsbCkge1xuICAgIGNvbnN0IHVuaXQgPSB0aGlzLnVuaXRzW25hbWVdO1xuXG4gICAgaWYgKHVuaXQpXG4gICAgICB1bml0LnVwZGF0ZSh2YWx1ZSwgZXhjbHVkZUNsaWVudCk7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gY29udHJvbCBpdGVtIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIC8vIGluaXQgY29udHJvbCBwYXJhbWV0ZXJzLCBpbmZvcywgYW5kIGNvbW1hbmRzIGF0IGNsaWVudFxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICd1cGRhdGUnLCB0aGlzLl9vblVwZGF0ZShjbGllbnQpKTtcbiAgfVxuXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICgpID0+IHRoaXMuc2VuZChjbGllbnQsICdpbml0JywgdGhpcy5fdW5pdERhdGEpO1xuICB9XG5cbiAgX29uVXBkYXRlKGNsaWVudCkge1xuICAgIC8vIHVwZGF0ZSwgYnV0IGV4Y2x1ZGUgY2xpZW50IGZyb20gYnJvYWRjYXN0aW5nIHRvIG90aGVyIGNsaWVudHNcbiAgICByZXR1cm4gKG5hbWUsIHZhbHVlKSA9PiB0aGlzLnVwZGF0ZShuYW1lLCB2YWx1ZSwgY2xpZW50KTtcbiAgfVxufVxuXG5zZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTZXJ2ZXJDb250cm9sKTtcblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyQ29udHJvbDtcbiJdfQ==