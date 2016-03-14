'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Activity2 = require('../core/Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @private */

var _ControlItem = function (_EventEmitter) {
  (0, _inherits3.default)(_ControlItem, _EventEmitter);

  function _ControlItem(control, type, name, label) {
    var init = arguments.length <= 4 || arguments[4] === undefined ? undefined : arguments[4];
    var clientTypes = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];
    (0, _classCallCheck3.default)(this, _ControlItem);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_ControlItem).call(this));

    _this.control = control;
    _this.clientTypes = clientTypes;

    _this.data = {
      type: type,
      name: name,
      label: label,
      value: init
    };

    control.items[name] = _this;
    control._itemData.push(_this.data);
    return _this;
  }

  (0, _createClass3.default)(_ControlItem, [{
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
  return _ControlItem;
}(_events.EventEmitter);

/** @private */


var _BooleanItem = function (_ControlItem2) {
  (0, _inherits3.default)(_BooleanItem, _ControlItem2);

  function _BooleanItem(control, name, label, init) {
    var clientTypes = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
    (0, _classCallCheck3.default)(this, _BooleanItem);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_BooleanItem).call(this, control, 'boolean', name, label, init, clientType));
  }

  (0, _createClass3.default)(_BooleanItem, [{
    key: 'set',
    value: function set(val) {
      this.data.value = val;
    }
  }]);
  return _BooleanItem;
}(_ControlItem);

/** @private */


var _EnumItem = function (_ControlItem3) {
  (0, _inherits3.default)(_EnumItem, _ControlItem3);

  function _EnumItem(control, name, label, options, init) {
    var clientTypes = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];
    (0, _classCallCheck3.default)(this, _EnumItem);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_EnumItem).call(this, control, 'enum', name, label, init, clientTypes));

    _this3.data.options = options;
    return _this3;
  }

  (0, _createClass3.default)(_EnumItem, [{
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
  return _EnumItem;
}(_ControlItem);

/** @private */


var _NumberItem = function (_ControlItem4) {
  (0, _inherits3.default)(_NumberItem, _ControlItem4);

  function _NumberItem(control, name, label, min, max, step, init) {
    var clientTypes = arguments.length <= 7 || arguments[7] === undefined ? null : arguments[7];
    (0, _classCallCheck3.default)(this, _NumberItem);

    var _this4 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_NumberItem).call(this, control, 'number', name, label, init, clientTypes));

    var data = _this4.data;
    data.min = min;
    data.max = max;
    data.step = step;
    return _this4;
  }

  (0, _createClass3.default)(_NumberItem, [{
    key: 'set',
    value: function set(val) {
      this.data.value = Math.min(this.data.max, Math.max(this.data.min, val));
    }
  }]);
  return _NumberItem;
}(_ControlItem);

/** @private */


var _TextItem = function (_ControlItem5) {
  (0, _inherits3.default)(_TextItem, _ControlItem5);

  function _TextItem(control, name, label, init) {
    var clientTypes = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
    (0, _classCallCheck3.default)(this, _TextItem);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_TextItem).call(this, control, 'text', name, label, init, clientTypes));
  }

  (0, _createClass3.default)(_TextItem, [{
    key: 'set',
    value: function set(val) {
      this.data.value = val;
    }
  }]);
  return _TextItem;
}(_ControlItem);

/** @private */


var _TriggerItem = function (_ControlItem6) {
  (0, _inherits3.default)(_TriggerItem, _ControlItem6);

  function _TriggerItem(control, name, label) {
    var clientTypes = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
    (0, _classCallCheck3.default)(this, _TriggerItem);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_TriggerItem).call(this, control, 'trigger', name, label, undefined, clientTypes));
  }

  return _TriggerItem;
}(_ControlItem);

var SERVICE_ID = 'service:shared-params';

/**
 * [server] Manage the global `parameters`, `infos`, and `commands` across the whole scenario.
 *
 * The service keeps track of:
 * - `parameters`: values that can be updated by the actions of the clients (*e.g.* the gain of a synth);
 * - `infos`: information about the state of the scenario (*e.g.* number of clients in the performance);
 * - `commands`: can trigger an action (*e.g.* reload the page),
 * and propagates these to different client types.
 *
 * To set up controls in a scenario, you should extend this class on the server side and declare the controls specific to that scenario with the appropriate methods.
 *
 * (See also {@link src/client/ClientSharedParams.js~ClientSharedParams} on the client side.)
 *
 * @example // Example 1: make a `'conductor'` client to manage the controls
 * class MyControl extends SharedParams {
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

var SharedParams = function (_Activity) {
  (0, _inherits3.default)(SharedParams, _Activity);

  function SharedParams() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, SharedParams);


    /**
     * Dictionary of all control items.
     * @type {Object}
     */

    var _this7 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SharedParams).call(this, SERVICE_ID));

    _this7.items = {};

    /**
     * Array of item data cells.
     * @type {Array}
     */
    _this7._itemData = [];
    return _this7;
  }

  (0, _createClass3.default)(SharedParams, [{
    key: 'addItem',
    value: function addItem() {
      var args = (0, _from2.default)(arguments);
      var type = args.shift();
      var item = void 0;

      switch (type) {
        case 'boolean':
          item = this.addBool.apply(this, (0, _toConsumableArray3.default)(args));
          break;
        case 'enum':
          item = this.addEnum.apply(this, (0, _toConsumableArray3.default)(args));
          break;
        case 'number':
          item = this.addNumber.apply(this, (0, _toConsumableArray3.default)(args));
          break;
        case 'text':
          item = this.addText.apply(this, (0, _toConsumableArray3.default)(args));
          break;
        case 'trigger':
          item = this.addTrigger.apply(this, (0, _toConsumableArray3.default)(args));
          break;
      }

      return item;
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

      return new _BooleanItem(this, name, label, init, clientTypes);
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

      return new _EnumItem(this, name, label, options, init, clientTypes);
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

      return new _NumberItem(this, name, label, min, max, step, init, clientTypes);
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

      return new _TextItem(this, name, label, init, clientTypes);
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

      return new _TriggerItem(this, name, label, undefined, clientTypes);
    }

    /**
     * Add listener to a control item (i.e. parameter, info or command).
     * The given listener is fired immediately with the item current value.
     * @param {String} name - Name of the item.
     * @param {Function} listener - Listener callback.
     */

  }, {
    key: 'addItemListener',
    value: function addItemListener(name, listener) {
      var item = this.items[name];

      if (item) {
        item.addListener(item.data.name, listener);
        listener(item.data.value);
      } else {
        console.log('unknown shared parameter "' + name + '"');
      }
    }

    /**
     * Remove listener from a control item (i.e. parameter, info or command).
     * @param {String} name - Name of the item.
     * @param {Function} listener - Listener callback.
     */

  }, {
    key: 'removeItemListener',
    value: function removeItemListener(name, listener) {
      var item = this.items[name];

      if (item) item.removeListener(item.data.name, listener);else console.log('unknown shared parameter "' + name + '"');
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

      var item = this.items[name];

      if (item) item.update(value, excludeClient);else console.log('unknown shared parameter  "' + name + '"');
    }

    /** @private */

  }, {
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(SharedParams.prototype), 'connect', this).call(this, client);

      // init control parameters, infos, and commands at client
      this.receive(client, 'request', this._onRequest(client));
      this.receive(client, 'update', this._onUpdate(client));
    }
  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this8 = this;

      return function () {
        return _this8.send(client, 'init', _this8._itemData);
      };
    }
  }, {
    key: '_onUpdate',
    value: function _onUpdate(client) {
      var _this9 = this;

      // update, but exclude client from broadcasting to other clients
      return function (name, value) {
        return _this9.update(name, value, client);
      };
    }
  }]);
  return SharedParams;
}(_Activity3.default);

_serviceManager2.default.register(SERVICE_ID, SharedParams);

exports.default = SharedParams;
//# sourceMappingURL=data:application/json;base64,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QixHQUFzQyxHQUF0QyxDQUFaLENBSEY7Ozs7Ozs7Ozs7OzJCQVdLLE1BQU0sT0FBNkI7VUFBdEIsc0VBQWdCLG9CQUFNOztBQUN4QyxVQUFNLE9BQU8sS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFQLENBRGtDOztBQUd4QyxVQUFJLElBQUosRUFDRSxLQUFLLE1BQUwsQ0FBWSxLQUFaLEVBQW1CLGFBQW5CLEVBREYsS0FHRSxRQUFRLEdBQVIsQ0FBWSxnQ0FBZ0MsSUFBaEMsR0FBdUMsR0FBdkMsQ0FBWixDQUhGOzs7Ozs7OzRCQU9NLFFBQVE7QUFDZCx1REFwSkUscURBb0pZLE9BQWQ7OztBQURjLFVBSWQsQ0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixTQUFyQixFQUFnQyxLQUFLLFVBQUwsQ0FBZ0IsTUFBaEIsQ0FBaEMsRUFKYztBQUtkLFdBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsUUFBckIsRUFBK0IsS0FBSyxTQUFMLENBQWUsTUFBZixDQUEvQixFQUxjOzs7OytCQVFMLFFBQVE7OztBQUNqQixhQUFPO2VBQU0sT0FBSyxJQUFMLENBQVUsTUFBVixFQUFrQixNQUFsQixFQUEwQixPQUFLLFNBQUw7T0FBaEMsQ0FEVTs7Ozs4QkFJVCxRQUFROzs7O0FBRWhCLGFBQU8sVUFBQyxJQUFELEVBQU8sS0FBUDtlQUFpQixPQUFLLE1BQUwsQ0FBWSxJQUFaLEVBQWtCLEtBQWxCLEVBQXlCLE1BQXpCO09BQWpCLENBRlM7OztTQS9KZDs7O0FBcUtOLHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsWUFBcEM7O2tCQUVlIiwiZmlsZSI6IlNoYXJlZFBhcmFtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuLi9jb3JlL0FjdGl2aXR5JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0NvbnRyb2xJdGVtIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgdHlwZSwgbmFtZSwgbGFiZWwsIGluaXQgPSB1bmRlZmluZWQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2wgPSBjb250cm9sO1xuICAgIHRoaXMuY2xpZW50VHlwZXMgPSBjbGllbnRUeXBlcztcblxuICAgIHRoaXMuZGF0YSA9IHtcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgdmFsdWU6IGluaXQsXG4gICAgfTtcblxuICAgIGNvbnRyb2wuaXRlbXNbbmFtZV0gPSB0aGlzO1xuICAgIGNvbnRyb2wuX2l0ZW1EYXRhLnB1c2godGhpcy5kYXRhKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmRhdGEudmFsdWUgPSB2YWw7XG4gIH1cblxuICB1cGRhdGUodmFsID0gdW5kZWZpbmVkLCBleGNsdWRlQ2xpZW50ID0gbnVsbCkge1xuICAgIGxldCBjb250cm9sID0gdGhpcy5jb250cm9sO1xuICAgIGxldCBkYXRhID0gdGhpcy5kYXRhO1xuXG4gICAgdGhpcy5zZXQodmFsKTsgLy8gc2V0IHZhbHVlXG4gICAgdGhpcy5lbWl0KGRhdGEubmFtZSwgZGF0YS52YWx1ZSk7IC8vIGNhbGwgaXRlbSBsaXN0ZW5lcnNcbiAgICBjb250cm9sLmJyb2FkY2FzdCh0aGlzLmNsaWVudFR5cGVzLCBleGNsdWRlQ2xpZW50LCAndXBkYXRlJywgZGF0YS5uYW1lLCBkYXRhLnZhbHVlKTsgLy8gc2VuZCB0byBjbGllbnRzXG4gICAgY29udHJvbC5lbWl0KCd1cGRhdGUnLCBkYXRhLm5hbWUsIGRhdGEudmFsdWUpOyAvLyBjYWxsIGNvbnRyb2wgbGlzdGVuZXJzXG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQm9vbGVhbkl0ZW0gZXh0ZW5kcyBfQ29udHJvbEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2Jvb2xlYW4nLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5kYXRhLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0VudW1JdGVtIGV4dGVuZHMgX0NvbnRyb2xJdGVtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIG9wdGlvbnMsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdlbnVtJywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcblxuICAgIHRoaXMuZGF0YS5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICBsZXQgaW5kZXggPSBkYXRhLm9wdGlvbnMuaW5kZXhPZih2YWwpO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIGRhdGEudmFsdWUgPSB2YWw7XG4gICAgICBkYXRhLmluZGV4ID0gaW5kZXg7XG4gICAgfVxuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX051bWJlckl0ZW0gZXh0ZW5kcyBfQ29udHJvbEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdudW1iZXInLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuXG4gICAgbGV0IGRhdGEgPSB0aGlzLmRhdGE7XG4gICAgZGF0YS5taW4gPSBtaW47XG4gICAgZGF0YS5tYXggPSBtYXg7XG4gICAgZGF0YS5zdGVwID0gc3RlcDtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmRhdGEudmFsdWUgPSBNYXRoLm1pbih0aGlzLmRhdGEubWF4LCBNYXRoLm1heCh0aGlzLmRhdGEubWluLCB2YWwpKTtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UZXh0SXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcihjb250cm9sLCAndGV4dCcsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5kYXRhLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RyaWdnZXJJdGVtIGV4dGVuZHMgX0NvbnRyb2xJdGVtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICd0cmlnZ2VyJywgbmFtZSwgbGFiZWwsIHVuZGVmaW5lZCwgY2xpZW50VHlwZXMpO1xuICB9XG59XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnNoYXJlZC1wYXJhbXMnO1xuXG4vKipcbiAqIFtzZXJ2ZXJdIE1hbmFnZSB0aGUgZ2xvYmFsIGBwYXJhbWV0ZXJzYCwgYGluZm9zYCwgYW5kIGBjb21tYW5kc2AgYWNyb3NzIHRoZSB3aG9sZSBzY2VuYXJpby5cbiAqXG4gKiBUaGUgc2VydmljZSBrZWVwcyB0cmFjayBvZjpcbiAqIC0gYHBhcmFtZXRlcnNgOiB2YWx1ZXMgdGhhdCBjYW4gYmUgdXBkYXRlZCBieSB0aGUgYWN0aW9ucyBvZiB0aGUgY2xpZW50cyAoKmUuZy4qIHRoZSBnYWluIG9mIGEgc3ludGgpO1xuICogLSBgaW5mb3NgOiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc3RhdGUgb2YgdGhlIHNjZW5hcmlvICgqZS5nLiogbnVtYmVyIG9mIGNsaWVudHMgaW4gdGhlIHBlcmZvcm1hbmNlKTtcbiAqIC0gYGNvbW1hbmRzYDogY2FuIHRyaWdnZXIgYW4gYWN0aW9uICgqZS5nLiogcmVsb2FkIHRoZSBwYWdlKSxcbiAqIGFuZCBwcm9wYWdhdGVzIHRoZXNlIHRvIGRpZmZlcmVudCBjbGllbnQgdHlwZXMuXG4gKlxuICogVG8gc2V0IHVwIGNvbnRyb2xzIGluIGEgc2NlbmFyaW8sIHlvdSBzaG91bGQgZXh0ZW5kIHRoaXMgY2xhc3Mgb24gdGhlIHNlcnZlciBzaWRlIGFuZCBkZWNsYXJlIHRoZSBjb250cm9scyBzcGVjaWZpYyB0byB0aGF0IHNjZW5hcmlvIHdpdGggdGhlIGFwcHJvcHJpYXRlIG1ldGhvZHMuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudFNoYXJlZFBhcmFtcy5qc35DbGllbnRTaGFyZWRQYXJhbXN9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKlxuICogQGV4YW1wbGUgLy8gRXhhbXBsZSAxOiBtYWtlIGEgYCdjb25kdWN0b3InYCBjbGllbnQgdG8gbWFuYWdlIHRoZSBjb250cm9sc1xuICogY2xhc3MgTXlDb250cm9sIGV4dGVuZHMgU2hhcmVkUGFyYW1zIHtcbiAqICAgY29uc3RydWN0b3IoKSB7XG4gKiAgICAgc3VwZXIoKTtcbiAqXG4gKiAgICAgLy8gUGFyYW1ldGVyIHNoYXJlZCBieSBhbGwgdGhlIGNsaWVudCB0eXBlc1xuICogICAgIHRoaXMuYWRkTnVtYmVyKCdzeW50aDpnYWluJywgJ1N5bnRoIGdhaW4nLCAwLCAxLCAwLjEsIDEpO1xuICogICAgIC8vIENvbW1hbmQgcHJvcGFnYXRlZCBvbmx5IHRvIHRoZSBgJ3BsYXllcidgIGNsaWVudHNcbiAqICAgICB0aGlzLmFkZENvbW1hbmQoJ3JlbG9hZCcsICdSZWxvYWQgdGhlIHBhZ2UnLCBbJ3BsYXllciddKTtcbiAqICAgfVxuICogfVxuICpcbiAqIEBleGFtcGxlIC8vIEV4YW1wbGUgMjoga2VlcCB0cmFjayBvZiB0aGUgbnVtYmVyIG9mIGAncGxheWVyJ2AgY2xpZW50c1xuICogY2xhc3MgTXlDb250cm9sIGV4dGVuZHMgQ29udHJvbCB7XG4gKiAgIGNvbnN0cnVjdG9yKCkge1xuICogICAgIHN1cGVyKCk7XG4gKiAgICAgdGhpcy5hZGRJbmZvKCdudW1QbGF5ZXJzJywgJ051bWJlciBvZiBwbGF5ZXJzJywgMCk7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBjbGFzcyBNeVBlcmZvcm1hbmNlIGV4dGVuZHMgUGVyZm9ybWFuY2Uge1xuICogICBjb25zdHJ1Y3Rvcihjb250cm9sKSB7XG4gKiAgICAgdGhpcy5fY29udHJvbCA9IGNvbnRyb2w7XG4gKiAgIH1cbiAqXG4gKiAgIGVudGVyKGNsaWVudCkge1xuICogICAgIHN1cGVyLmVudGVyKGNsaWVudCk7XG4gKlxuICogICAgIHRoaXMuX2NvbnRyb2wudXBkYXRlKCdudW1QbGF5ZXJzJywgdGhpcy5jbGllbnRzLmxlbmd0aCk7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBjb25zdCBjb250cm9sID0gbmV3IE15Q29udHJvbCgpO1xuICogY29uc3QgcGVyZm9ybWFuY2UgPSBuZXcgTXlQZXJmb3JtYW5jZShjb250cm9sKTtcbiAqL1xuY2xhc3MgU2hhcmVkUGFyYW1zIGV4dGVuZHMgQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIC8qKlxuICAgICAqIERpY3Rpb25hcnkgb2YgYWxsIGNvbnRyb2wgaXRlbXMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLml0ZW1zID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBpdGVtIGRhdGEgY2VsbHMuXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqL1xuICAgIHRoaXMuX2l0ZW1EYXRhID0gW107XG4gIH1cblxuICBhZGRJdGVtKCkge1xuICAgIGNvbnN0IGFyZ3MgPSBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XG4gICAgY29uc3QgdHlwZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICBsZXQgaXRlbTtcblxuICAgIHN3aXRjaCh0eXBlKSB7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgaXRlbSA9IHRoaXMuYWRkQm9vbCguLi5hcmdzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlbnVtJzpcbiAgICAgICAgaXRlbSA9IHRoaXMuYWRkRW51bSguLi5hcmdzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBpdGVtID0gdGhpcy5hZGROdW1iZXIoLi4uYXJncyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgIGl0ZW0gPSB0aGlzLmFkZFRleHQoLi4uYXJncyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndHJpZ2dlcic6XG4gICAgICAgIGl0ZW0gPSB0aGlzLmFkZFRyaWdnZXIoLi4uYXJncyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBgYm9vbGVhbmAgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5pdCAtIEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciAoYHRydWVgIG9yIGBmYWxzZWApLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gLSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkQm9vbGVhbihuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBfQm9vbGVhbkl0ZW0odGhpcywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGBlbnVtYCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IG9wdGlvbnMgLSBBcnJheSBvZiB0aGUgZGlmZmVyZW50IHZhbHVlcyB0aGUgcGFyYW1ldGVyIGNhbiB0YWtlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5pdCAtIEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciAoaGFzIHRvIGJlIGluIHRoZSBgb3B0aW9uc2AgYXJyYXkpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gLSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkRW51bShuYW1lLCBsYWJlbCwgb3B0aW9ucywgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBfRW51bUl0ZW0odGhpcywgbmFtZSwgbGFiZWwsIG9wdGlvbnMsIGluaXQsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgYG51bWJlcmAgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtaW4gLSBNaW5pbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtYXggLSBNYXhpbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdGVwIC0gU3RlcCB0byBpbmNyZWFzZSBvciBkZWNyZWFzZSB0aGUgcGFyYW1ldGVyIHZhbHVlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5pdCAtIEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZE51bWJlcihuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX051bWJlckl0ZW0odGhpcywgbmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0LCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGB0ZXh0YCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbml0IC0gSW5pdGlhbCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyIChoYXMgdG8gYmUgaW4gdGhlIGBvcHRpb25zYCBhcnJheSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSAtIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGRUZXh0KG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IF9UZXh0SXRlbSh0aGlzLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSB0cmlnZ2VyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbW1hbmQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIExhYmVsIG9mIHRoZSBjb21tYW5kIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSAtIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGRUcmlnZ2VyKG5hbWUsIGxhYmVsLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IF9UcmlnZ2VySXRlbSh0aGlzLCBuYW1lLCBsYWJlbCwgdW5kZWZpbmVkLCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGxpc3RlbmVyIHRvIGEgY29udHJvbCBpdGVtIChpLmUuIHBhcmFtZXRlciwgaW5mbyBvciBjb21tYW5kKS5cbiAgICogVGhlIGdpdmVuIGxpc3RlbmVyIGlzIGZpcmVkIGltbWVkaWF0ZWx5IHdpdGggdGhlIGl0ZW0gY3VycmVudCB2YWx1ZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBpdGVtLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIGNhbGxiYWNrLlxuICAgKi9cbiAgYWRkSXRlbUxpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuaXRlbXNbbmFtZV07XG5cbiAgICBpZiAoaXRlbSkge1xuICAgICAgaXRlbS5hZGRMaXN0ZW5lcihpdGVtLmRhdGEubmFtZSwgbGlzdGVuZXIpO1xuICAgICAgbGlzdGVuZXIoaXRlbS5kYXRhLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gc2hhcmVkIHBhcmFtZXRlciBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBsaXN0ZW5lciBmcm9tIGEgY29udHJvbCBpdGVtIChpLmUuIHBhcmFtZXRlciwgaW5mbyBvciBjb21tYW5kKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBpdGVtLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIGNhbGxiYWNrLlxuICAgKi9cbiAgcmVtb3ZlSXRlbUxpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuaXRlbXNbbmFtZV07XG5cbiAgICBpZiAoaXRlbSlcbiAgICAgIGl0ZW0ucmVtb3ZlTGlzdGVuZXIoaXRlbS5kYXRhLm5hbWUsIGxpc3RlbmVyKTtcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBzaGFyZWQgcGFyYW1ldGVyIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB2YWx1ZSBvZiBhIHBhcmFtZXRlciBhbmQgc2VuZHMgaXQgdG8gdGhlIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHsoU3RyaW5nfE51bWJlcnxCb29sZWFuKX0gdmFsdWUgLSBOZXcgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIHVwZGF0ZShuYW1lLCB2YWx1ZSwgZXhjbHVkZUNsaWVudCA9IG51bGwpIHtcbiAgICBjb25zdCBpdGVtID0gdGhpcy5pdGVtc1tuYW1lXTtcblxuICAgIGlmIChpdGVtKVxuICAgICAgaXRlbS51cGRhdGUodmFsdWUsIGV4Y2x1ZGVDbGllbnQpO1xuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHNoYXJlZCBwYXJhbWV0ZXIgIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIC8vIGluaXQgY29udHJvbCBwYXJhbWV0ZXJzLCBpbmZvcywgYW5kIGNvbW1hbmRzIGF0IGNsaWVudFxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICd1cGRhdGUnLCB0aGlzLl9vblVwZGF0ZShjbGllbnQpKTtcbiAgfVxuXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICgpID0+IHRoaXMuc2VuZChjbGllbnQsICdpbml0JywgdGhpcy5faXRlbURhdGEpO1xuICB9XG5cbiAgX29uVXBkYXRlKGNsaWVudCkge1xuICAgIC8vIHVwZGF0ZSwgYnV0IGV4Y2x1ZGUgY2xpZW50IGZyb20gYnJvYWRjYXN0aW5nIHRvIG90aGVyIGNsaWVudHNcbiAgICByZXR1cm4gKG5hbWUsIHZhbHVlKSA9PiB0aGlzLnVwZGF0ZShuYW1lLCB2YWx1ZSwgY2xpZW50KTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTaGFyZWRQYXJhbXMpO1xuXG5leHBvcnQgZGVmYXVsdCBTaGFyZWRQYXJhbXM7XG4iXX0=