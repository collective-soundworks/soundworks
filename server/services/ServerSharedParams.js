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

var _ServerActivity2 = require('../core/ServerActivity');

var _ServerActivity3 = _interopRequireDefault(_ServerActivity2);

var _serverServiceManager = require('../core/serverServiceManager');

var _serverServiceManager2 = _interopRequireDefault(_serverServiceManager);

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
 * The module keeps track of:
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
 * class MyControl extends ServerSharedParams {
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

var ServerSharedParams = function (_ServerActivity) {
  (0, _inherits3.default)(ServerSharedParams, _ServerActivity);

  function ServerSharedParams() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, ServerSharedParams);


    /**
     * Dictionary of all control items.
     * @type {Object}
     */

    var _this7 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerSharedParams).call(this, SERVICE_ID));

    _this7.items = {};

    /**
     * Array of item data cells.
     * @type {Array}
     */
    _this7._itemData = [];
    return _this7;
  }

  (0, _createClass3.default)(ServerSharedParams, [{
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
      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerSharedParams.prototype), 'connect', this).call(this, client);

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
  return ServerSharedParams;
}(_ServerActivity3.default);

_serverServiceManager2.default.register(SERVICE_ID, ServerSharedParams);

exports.default = ServerSharedParams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlclNoYXJlZFBhcmFtcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0lBR007OztBQUNKLFdBREksWUFDSixDQUFZLE9BQVosRUFBcUIsSUFBckIsRUFBMkIsSUFBM0IsRUFBaUMsS0FBakMsRUFBOEU7UUFBdEMsNkRBQU8seUJBQStCO1FBQXBCLG9FQUFjLG9CQUFNO3dDQUQxRSxjQUMwRTs7NkZBRDFFLDBCQUMwRTs7QUFHNUUsVUFBSyxPQUFMLEdBQWUsT0FBZixDQUg0RTtBQUk1RSxVQUFLLFdBQUwsR0FBbUIsV0FBbkIsQ0FKNEU7O0FBTTVFLFVBQUssSUFBTCxHQUFZO0FBQ1YsWUFBTSxJQUFOO0FBQ0EsWUFBTSxJQUFOO0FBQ0EsYUFBTyxLQUFQO0FBQ0EsYUFBTyxJQUFQO0tBSkYsQ0FONEU7O0FBYTVFLFlBQVEsS0FBUixDQUFjLElBQWQsVUFiNEU7QUFjNUUsWUFBUSxTQUFSLENBQWtCLElBQWxCLENBQXVCLE1BQUssSUFBTCxDQUF2QixDQWQ0RTs7R0FBOUU7OzZCQURJOzt3QkFrQkEsS0FBSztBQUNQLFdBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsR0FBbEIsQ0FETzs7Ozs2QkFJcUM7VUFBdkMsNERBQU0seUJBQWlDO1VBQXRCLHNFQUFnQixvQkFBTTs7QUFDNUMsVUFBSSxVQUFVLEtBQUssT0FBTCxDQUQ4QjtBQUU1QyxVQUFJLE9BQU8sS0FBSyxJQUFMLENBRmlDOztBQUk1QyxXQUFLLEdBQUwsQ0FBUyxHQUFUO0FBSjRDLFVBSzVDLENBQUssSUFBTCxDQUFVLEtBQUssSUFBTCxFQUFXLEtBQUssS0FBTCxDQUFyQjtBQUw0QyxhQU01QyxDQUFRLFNBQVIsQ0FBa0IsS0FBSyxXQUFMLEVBQWtCLGFBQXBDLEVBQW1ELFFBQW5ELEVBQTZELEtBQUssSUFBTCxFQUFXLEtBQUssS0FBTCxDQUF4RTtBQU40QyxhQU81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QStCLElBQS9CLEdBQXNDLEdBQXRDLENBQVosQ0FIRjs7Ozs7Ozs7Ozs7MkJBV0ssTUFBTSxPQUE2QjtVQUF0QixzRUFBZ0Isb0JBQU07O0FBQ3hDLFVBQU0sT0FBTyxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQVAsQ0FEa0M7O0FBR3hDLFVBQUksSUFBSixFQUNFLEtBQUssTUFBTCxDQUFZLEtBQVosRUFBbUIsYUFBbkIsRUFERixLQUdFLFFBQVEsR0FBUixDQUFZLGdDQUFnQyxJQUFoQyxHQUF1QyxHQUF2QyxDQUFaLENBSEY7Ozs7Ozs7NEJBT00sUUFBUTtBQUNkLHVEQXBKRSwyREFvSlksT0FBZDs7O0FBRGMsVUFJZCxDQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLFNBQXJCLEVBQWdDLEtBQUssVUFBTCxDQUFnQixNQUFoQixDQUFoQyxFQUpjO0FBS2QsV0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixRQUFyQixFQUErQixLQUFLLFNBQUwsQ0FBZSxNQUFmLENBQS9CLEVBTGM7Ozs7K0JBUUwsUUFBUTs7O0FBQ2pCLGFBQU87ZUFBTSxPQUFLLElBQUwsQ0FBVSxNQUFWLEVBQWtCLE1BQWxCLEVBQTBCLE9BQUssU0FBTDtPQUFoQyxDQURVOzs7OzhCQUlULFFBQVE7Ozs7QUFFaEIsYUFBTyxVQUFDLElBQUQsRUFBTyxLQUFQO2VBQWlCLE9BQUssTUFBTCxDQUFZLElBQVosRUFBa0IsS0FBbEIsRUFBeUIsTUFBekI7T0FBakIsQ0FGUzs7O1NBL0pkOzs7QUFxS04sK0JBQXFCLFFBQXJCLENBQThCLFVBQTlCLEVBQTBDLGtCQUExQzs7a0JBRWUiLCJmaWxlIjoiU2VydmVyU2hhcmVkUGFyYW1zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQ29udHJvbEl0ZW0gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCB0eXBlLCBuYW1lLCBsYWJlbCwgaW5pdCA9IHVuZGVmaW5lZCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY29udHJvbCA9IGNvbnRyb2w7XG4gICAgdGhpcy5jbGllbnRUeXBlcyA9IGNsaWVudFR5cGVzO1xuXG4gICAgdGhpcy5kYXRhID0ge1xuICAgICAgdHlwZTogdHlwZSxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBsYWJlbDogbGFiZWwsXG4gICAgICB2YWx1ZTogaW5pdCxcbiAgICB9O1xuXG4gICAgY29udHJvbC5pdGVtc1tuYW1lXSA9IHRoaXM7XG4gICAgY29udHJvbC5faXRlbURhdGEucHVzaCh0aGlzLmRhdGEpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IHZhbDtcbiAgfVxuXG4gIHVwZGF0ZSh2YWwgPSB1bmRlZmluZWQsIGV4Y2x1ZGVDbGllbnQgPSBudWxsKSB7XG4gICAgbGV0IGNvbnRyb2wgPSB0aGlzLmNvbnRyb2w7XG4gICAgbGV0IGRhdGEgPSB0aGlzLmRhdGE7XG5cbiAgICB0aGlzLnNldCh2YWwpOyAvLyBzZXQgdmFsdWVcbiAgICB0aGlzLmVtaXQoZGF0YS5uYW1lLCBkYXRhLnZhbHVlKTsgLy8gY2FsbCBpdGVtIGxpc3RlbmVyc1xuICAgIGNvbnRyb2wuYnJvYWRjYXN0KHRoaXMuY2xpZW50VHlwZXMsIGV4Y2x1ZGVDbGllbnQsICd1cGRhdGUnLCBkYXRhLm5hbWUsIGRhdGEudmFsdWUpOyAvLyBzZW5kIHRvIGNsaWVudHNcbiAgICBjb250cm9sLmVtaXQoJ3VwZGF0ZScsIGRhdGEubmFtZSwgZGF0YS52YWx1ZSk7IC8vIGNhbGwgY29udHJvbCBsaXN0ZW5lcnNcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9Cb29sZWFuSXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcihjb250cm9sLCAnYm9vbGVhbicsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmRhdGEudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfRW51bUl0ZW0gZXh0ZW5kcyBfQ29udHJvbEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgb3B0aW9ucywgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2VudW0nLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuXG4gICAgdGhpcy5kYXRhLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5kYXRhO1xuICAgIGxldCBpbmRleCA9IGRhdGEub3B0aW9ucy5pbmRleE9mKHZhbCk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgZGF0YS52YWx1ZSA9IHZhbDtcbiAgICAgIGRhdGEuaW5kZXggPSBpbmRleDtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfTnVtYmVySXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ251bWJlcicsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyk7XG5cbiAgICBsZXQgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICBkYXRhLm1pbiA9IG1pbjtcbiAgICBkYXRhLm1heCA9IG1heDtcbiAgICBkYXRhLnN0ZXAgPSBzdGVwO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IE1hdGgubWluKHRoaXMuZGF0YS5tYXgsIE1hdGgubWF4KHRoaXMuZGF0YS5taW4sIHZhbCkpO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RleHRJdGVtIGV4dGVuZHMgX0NvbnRyb2xJdGVtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICd0ZXh0JywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmRhdGEudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfVHJpZ2dlckl0ZW0gZXh0ZW5kcyBfQ29udHJvbEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3RyaWdnZXInLCBuYW1lLCBsYWJlbCwgdW5kZWZpbmVkLCBjbGllbnRUeXBlcyk7XG4gIH1cbn1cblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLXBhcmFtcyc7XG5cbi8qKlxuICogW3NlcnZlcl0gTWFuYWdlIHRoZSBnbG9iYWwgYHBhcmFtZXRlcnNgLCBgaW5mb3NgLCBhbmQgYGNvbW1hbmRzYCBhY3Jvc3MgdGhlIHdob2xlIHNjZW5hcmlvLlxuICpcbiAqIFRoZSBtb2R1bGUga2VlcHMgdHJhY2sgb2Y6XG4gKiAtIGBwYXJhbWV0ZXJzYDogdmFsdWVzIHRoYXQgY2FuIGJlIHVwZGF0ZWQgYnkgdGhlIGFjdGlvbnMgb2YgdGhlIGNsaWVudHMgKCplLmcuKiB0aGUgZ2FpbiBvZiBhIHN5bnRoKTtcbiAqIC0gYGluZm9zYDogaW5mb3JtYXRpb24gYWJvdXQgdGhlIHN0YXRlIG9mIHRoZSBzY2VuYXJpbyAoKmUuZy4qIG51bWJlciBvZiBjbGllbnRzIGluIHRoZSBwZXJmb3JtYW5jZSk7XG4gKiAtIGBjb21tYW5kc2A6IGNhbiB0cmlnZ2VyIGFuIGFjdGlvbiAoKmUuZy4qIHJlbG9hZCB0aGUgcGFnZSksXG4gKiBhbmQgcHJvcGFnYXRlcyB0aGVzZSB0byBkaWZmZXJlbnQgY2xpZW50IHR5cGVzLlxuICpcbiAqIFRvIHNldCB1cCBjb250cm9scyBpbiBhIHNjZW5hcmlvLCB5b3Ugc2hvdWxkIGV4dGVuZCB0aGlzIGNsYXNzIG9uIHRoZSBzZXJ2ZXIgc2lkZSBhbmQgZGVjbGFyZSB0aGUgY29udHJvbHMgc3BlY2lmaWMgdG8gdGhhdCBzY2VuYXJpbyB3aXRoIHRoZSBhcHByb3ByaWF0ZSBtZXRob2RzLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9DbGllbnRTaGFyZWRQYXJhbXMuanN+Q2xpZW50U2hhcmVkUGFyYW1zfSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICpcbiAqIEBleGFtcGxlIC8vIEV4YW1wbGUgMTogbWFrZSBhIGAnY29uZHVjdG9yJ2AgY2xpZW50IHRvIG1hbmFnZSB0aGUgY29udHJvbHNcbiAqIGNsYXNzIE15Q29udHJvbCBleHRlbmRzIFNlcnZlclNoYXJlZFBhcmFtcyB7XG4gKiAgIGNvbnN0cnVjdG9yKCkge1xuICogICAgIHN1cGVyKCk7XG4gKlxuICogICAgIC8vIFBhcmFtZXRlciBzaGFyZWQgYnkgYWxsIHRoZSBjbGllbnQgdHlwZXNcbiAqICAgICB0aGlzLmFkZE51bWJlcignc3ludGg6Z2FpbicsICdTeW50aCBnYWluJywgMCwgMSwgMC4xLCAxKTtcbiAqICAgICAvLyBDb21tYW5kIHByb3BhZ2F0ZWQgb25seSB0byB0aGUgYCdwbGF5ZXInYCBjbGllbnRzXG4gKiAgICAgdGhpcy5hZGRDb21tYW5kKCdyZWxvYWQnLCAnUmVsb2FkIHRoZSBwYWdlJywgWydwbGF5ZXInXSk7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBAZXhhbXBsZSAvLyBFeGFtcGxlIDI6IGtlZXAgdHJhY2sgb2YgdGhlIG51bWJlciBvZiBgJ3BsYXllcidgIGNsaWVudHNcbiAqIGNsYXNzIE15Q29udHJvbCBleHRlbmRzIENvbnRyb2wge1xuICogICBjb25zdHJ1Y3RvcigpIHtcbiAqICAgICBzdXBlcigpO1xuICogICAgIHRoaXMuYWRkSW5mbygnbnVtUGxheWVycycsICdOdW1iZXIgb2YgcGxheWVycycsIDApO1xuICogICB9XG4gKiB9XG4gKlxuICogY2xhc3MgTXlQZXJmb3JtYW5jZSBleHRlbmRzIFBlcmZvcm1hbmNlIHtcbiAqICAgY29uc3RydWN0b3IoY29udHJvbCkge1xuICogICAgIHRoaXMuX2NvbnRyb2wgPSBjb250cm9sO1xuICogICB9XG4gKlxuICogICBlbnRlcihjbGllbnQpIHtcbiAqICAgICBzdXBlci5lbnRlcihjbGllbnQpO1xuICpcbiAqICAgICB0aGlzLl9jb250cm9sLnVwZGF0ZSgnbnVtUGxheWVycycsIHRoaXMuY2xpZW50cy5sZW5ndGgpO1xuICogICB9XG4gKiB9XG4gKlxuICogY29uc3QgY29udHJvbCA9IG5ldyBNeUNvbnRyb2woKTtcbiAqIGNvbnN0IHBlcmZvcm1hbmNlID0gbmV3IE15UGVyZm9ybWFuY2UoY29udHJvbCk7XG4gKi9cbmNsYXNzIFNlcnZlclNoYXJlZFBhcmFtcyBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICAvKipcbiAgICAgKiBEaWN0aW9uYXJ5IG9mIGFsbCBjb250cm9sIGl0ZW1zLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5pdGVtcyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgaXRlbSBkYXRhIGNlbGxzLlxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICB0aGlzLl9pdGVtRGF0YSA9IFtdO1xuICB9XG5cbiAgYWRkSXRlbSgpIHtcbiAgICBjb25zdCBhcmdzID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xuICAgIGNvbnN0IHR5cGUgPSBhcmdzLnNoaWZ0KCk7XG4gICAgbGV0IGl0ZW07XG5cbiAgICBzd2l0Y2godHlwZSkge1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIGl0ZW0gPSB0aGlzLmFkZEJvb2woLi4uYXJncyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZW51bSc6XG4gICAgICAgIGl0ZW0gPSB0aGlzLmFkZEVudW0oLi4uYXJncyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgaXRlbSA9IHRoaXMuYWRkTnVtYmVyKC4uLmFyZ3MpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICBpdGVtID0gdGhpcy5hZGRUZXh0KC4uLmFyZ3MpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RyaWdnZXInOlxuICAgICAgICBpdGVtID0gdGhpcy5hZGRUcmlnZ2VyKC4uLmFyZ3MpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgYGJvb2xlYW5gIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluaXQgLSBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgKGB0cnVlYCBvciBgZmFsc2VgKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZEJvb2xlYW4obmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX0Jvb2xlYW5JdGVtKHRoaXMsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBgZW51bWAgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBvcHRpb25zIC0gQXJyYXkgb2YgdGhlIGRpZmZlcmVudCB2YWx1ZXMgdGhlIHBhcmFtZXRlciBjYW4gdGFrZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluaXQgLSBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgKGhhcyB0byBiZSBpbiB0aGUgYG9wdGlvbnNgIGFycmF5KS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZEVudW0obmFtZSwgbGFiZWwsIG9wdGlvbnMsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX0VudW1JdGVtKHRoaXMsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0LCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGBudW1iZXJgIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbWluIC0gTWluaW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbWF4IC0gTWF4aW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc3RlcCAtIFN0ZXAgdG8gaW5jcmVhc2Ugb3IgZGVjcmVhc2UgdGhlIHBhcmFtZXRlciB2YWx1ZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluaXQgLSBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSAtIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGROdW1iZXIobmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IF9OdW1iZXJJdGVtKHRoaXMsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBgdGV4dGAgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5pdCAtIEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciAoaGFzIHRvIGJlIGluIHRoZSBgb3B0aW9uc2AgYXJyYXkpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gLSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkVGV4dChuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBfVGV4dEl0ZW0odGhpcywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdHJpZ2dlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBjb21tYW5kLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBMYWJlbCBvZiB0aGUgY29tbWFuZCAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gLSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkVHJpZ2dlcihuYW1lLCBsYWJlbCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBfVHJpZ2dlckl0ZW0odGhpcywgbmFtZSwgbGFiZWwsIHVuZGVmaW5lZCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBsaXN0ZW5lciB0byBhIGNvbnRyb2wgaXRlbSAoaS5lLiBwYXJhbWV0ZXIsIGluZm8gb3IgY29tbWFuZCkuXG4gICAqIFRoZSBnaXZlbiBsaXN0ZW5lciBpcyBmaXJlZCBpbW1lZGlhdGVseSB3aXRoIHRoZSBpdGVtIGN1cnJlbnQgdmFsdWUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgaXRlbS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgLSBMaXN0ZW5lciBjYWxsYmFjay5cbiAgICovXG4gIGFkZEl0ZW1MaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zW25hbWVdO1xuXG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIGl0ZW0uYWRkTGlzdGVuZXIoaXRlbS5kYXRhLm5hbWUsIGxpc3RlbmVyKTtcbiAgICAgIGxpc3RlbmVyKGl0ZW0uZGF0YS52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHNoYXJlZCBwYXJhbWV0ZXIgXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgbGlzdGVuZXIgZnJvbSBhIGNvbnRyb2wgaXRlbSAoaS5lLiBwYXJhbWV0ZXIsIGluZm8gb3IgY29tbWFuZCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgaXRlbS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgLSBMaXN0ZW5lciBjYWxsYmFjay5cbiAgICovXG4gIHJlbW92ZUl0ZW1MaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zW25hbWVdO1xuXG4gICAgaWYgKGl0ZW0pXG4gICAgICBpdGVtLnJlbW92ZUxpc3RlbmVyKGl0ZW0uZGF0YS5uYW1lLCBsaXN0ZW5lcik7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gc2hhcmVkIHBhcmFtZXRlciBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgYSBwYXJhbWV0ZXIgYW5kIHNlbmRzIGl0IHRvIHRoZSBjbGllbnRzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7KFN0cmluZ3xOdW1iZXJ8Qm9vbGVhbil9IHZhbHVlIC0gTmV3IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICB1cGRhdGUobmFtZSwgdmFsdWUsIGV4Y2x1ZGVDbGllbnQgPSBudWxsKSB7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuaXRlbXNbbmFtZV07XG5cbiAgICBpZiAoaXRlbSlcbiAgICAgIGl0ZW0udXBkYXRlKHZhbHVlLCBleGNsdWRlQ2xpZW50KTtcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBzaGFyZWQgcGFyYW1ldGVyICBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICAvLyBpbml0IGNvbnRyb2wgcGFyYW1ldGVycywgaW5mb3MsIGFuZCBjb21tYW5kcyBhdCBjbGllbnRcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAndXBkYXRlJywgdGhpcy5fb25VcGRhdGUoY2xpZW50KSk7XG4gIH1cblxuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB0aGlzLnNlbmQoY2xpZW50LCAnaW5pdCcsIHRoaXMuX2l0ZW1EYXRhKTtcbiAgfVxuXG4gIF9vblVwZGF0ZShjbGllbnQpIHtcbiAgICAvLyB1cGRhdGUsIGJ1dCBleGNsdWRlIGNsaWVudCBmcm9tIGJyb2FkY2FzdGluZyB0byBvdGhlciBjbGllbnRzXG4gICAgcmV0dXJuIChuYW1lLCB2YWx1ZSkgPT4gdGhpcy51cGRhdGUobmFtZSwgdmFsdWUsIGNsaWVudCk7XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyU2hhcmVkUGFyYW1zKTtcblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyU2hhcmVkUGFyYW1zO1xuIl19