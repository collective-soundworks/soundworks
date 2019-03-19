'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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

var _EventEmitter2 = require('../../utils/EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @private */
var _ControlItem = function (_EventEmitter) {
  (0, _inherits3.default)(_ControlItem, _EventEmitter);

  function _ControlItem(parent, type, name, label) {
    var init = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
    var clientTypes = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    (0, _classCallCheck3.default)(this, _ControlItem);

    var _this = (0, _possibleConstructorReturn3.default)(this, (_ControlItem.__proto__ || (0, _getPrototypeOf2.default)(_ControlItem)).call(this));

    _this.parent = parent;
    _this.clientTypes = clientTypes;

    _this.data = {
      type: type,
      name: name,
      label: label,
      value: init
    };

    parent.params[name] = _this;
    parent._paramData.push(_this.data);
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
      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
      var excludeClient = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var parent = this.parent;
      var data = this.data;

      this.set(val); // set value
      this.emit(data.name, data.value); // call param listeners
      parent.broadcast(this.clientTypes, excludeClient, 'update', data.name, data.value); // send to clients
      parent.emit('update', data.name, data.value); // call parent listeners
    }
  }]);
  return _ControlItem;
}(_EventEmitter3.default);

/** @private */


var _BooleanItem = function (_ControlItem2) {
  (0, _inherits3.default)(_BooleanItem, _ControlItem2);

  function _BooleanItem(parent, name, label, init) {
    var clientTypes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    (0, _classCallCheck3.default)(this, _BooleanItem);
    return (0, _possibleConstructorReturn3.default)(this, (_BooleanItem.__proto__ || (0, _getPrototypeOf2.default)(_BooleanItem)).call(this, parent, 'boolean', name, label, init, clientTypes));
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

  function _EnumItem(parent, name, label, options, init) {
    var clientTypes = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    (0, _classCallCheck3.default)(this, _EnumItem);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (_EnumItem.__proto__ || (0, _getPrototypeOf2.default)(_EnumItem)).call(this, parent, 'enum', name, label, init, clientTypes));

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

  function _NumberItem(parent, name, label, min, max, step, init) {
    var clientTypes = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;
    (0, _classCallCheck3.default)(this, _NumberItem);

    var _this4 = (0, _possibleConstructorReturn3.default)(this, (_NumberItem.__proto__ || (0, _getPrototypeOf2.default)(_NumberItem)).call(this, parent, 'number', name, label, init, clientTypes));

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

  function _TextItem(parent, name, label, init) {
    var clientTypes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    (0, _classCallCheck3.default)(this, _TextItem);
    return (0, _possibleConstructorReturn3.default)(this, (_TextItem.__proto__ || (0, _getPrototypeOf2.default)(_TextItem)).call(this, parent, 'text', name, label, init, clientTypes));
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

  function _TriggerItem(parent, name, label) {
    var clientTypes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    (0, _classCallCheck3.default)(this, _TriggerItem);
    return (0, _possibleConstructorReturn3.default)(this, (_TriggerItem.__proto__ || (0, _getPrototypeOf2.default)(_TriggerItem)).call(this, parent, 'trigger', name, label, undefined, clientTypes));
  }

  return _TriggerItem;
}(_ControlItem);

var SERVICE_ID = 'service:shared-params';

/**
 * Interface for the server `'shared-params'` service.
 *
 * This service allows to create shared parameters among a distributed
 * application. Each shared parameter can be of the following data types:
 * - boolean
 * - enum
 * - number
 * - text
 * - trigger,
 *
 * configured with specific attributes, and bounded to specific type of clients.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.SharedParams}*__
 *
 * @memberof module:soundworks/server
 * @example
 * // create a boolean shared parameter with default value to `false`,
 * // inside the server experience constructor
 * this.sharedParams = this.require('shared-params');
 * this.sharedParams.addBoolean('my:boolean', 'MyBoolean', false);
 */

var SharedParams = function (_Service) {
  (0, _inherits3.default)(SharedParams, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function SharedParams() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, SharedParams);

    /**
     * Dictionary of all control parameters.
     * @type {Object}
     * @private
     */
    var _this7 = (0, _possibleConstructorReturn3.default)(this, (SharedParams.__proto__ || (0, _getPrototypeOf2.default)(SharedParams)).call(this, SERVICE_ID));

    _this7.params = {};

    /**
     * Array of parameter data cells.
     * @type {Array}
     */
    _this7._paramData = [];
    return _this7;
  }

  (0, _createClass3.default)(SharedParams, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(SharedParams.prototype.__proto__ || (0, _getPrototypeOf2.default)(SharedParams.prototype), 'start', this).call(this);

      this.ready();
    }

    /**
     * Generic method to create shared parameters from an array of definitions.
     * A definition is an object with a 'type' property
     * ('boolean' | 'enum' | 'number' | 'text' | 'trigger') and a set of properties
     * matching the arguments of the corresponding `add${type}` method.
     * @see {@link SharedParams#addBoolean}
     * @see {@link SharedParams#addEnum}
     * @see {@link SharedParams#addNumber}
     * @see {@link SharedParams#addText}
     * @see {@link SharedParams#addTrigger}
     * @param {Array} definitions - An array of parameter definitions.
     */

  }, {
    key: 'add',
    value: function add(definitions) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(definitions), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var def = _step.value;

          var type = def.type || 'text';

          switch (type) {
            case 'boolean':
              this.addBoolean(def.name, def.label, def.value, def.clientTypes);
              break;
            case 'enum':
              this.addEnum(def.name, def.label, def.options, def.value, def.clientTypes);
              break;
            case 'number':
              this.addNumber(def.name, def.label, def.min, def.max, def.step, def.value, def.clientTypes);
              break;
            case 'text':
              this.addText(def.name, def.label, def.value, def.clientTypes);
              break;
            case 'trigger':
              this.addTrigger(def.name, def.label, def.clientTypes);
              break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * Add a `boolean` parameter.
     * @param {String} name - Name of the parameter.
     * @param {String} label - Label of the parameter (displayed on the GUI on the client side)
     * @param {Number} value - Initial value of the parameter (`true` or `false`).
     * @param {String[]} [clientTypes=null] - Array of the client types to send
     *  the parameter value to. If not set, the value is sent to all the client types.
     */

  }, {
    key: 'addBoolean',
    value: function addBoolean(name, label, value) {
      var clientTypes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      return new _BooleanItem(this, name, label, value, clientTypes);
    }

    /**
     * Add an `enum` parameter.
     * @param {String} name - Name of the parameter.
     * @param {String} label - Label of the parameter (displayed on the GUI on the client side).
     * @param {String[]} options - Different possible values of the parameter.
     * @param {Number} value - Initial value of the parameter (must be defined in `options`).
     * @param {String[]} [clientTypes=null] - Array of the client types to send
     *  the parameter value to. If not set, the value is sent to all the client types.
     */

  }, {
    key: 'addEnum',
    value: function addEnum(name, label, options, value) {
      var clientTypes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

      return new _EnumItem(this, name, label, options, value, clientTypes);
    }

    /**
     * Add a `number` parameter.
     * @param {String} name - Name of the parameter.
     * @param {String} label - Label of the parameter (displayed on the GUI on the client side).
     * @param {Number} min - Minimum value of the parameter.
     * @param {Number} max - Maximum value of the parameter.
     * @param {Number} step - Step by which the parameter value is increased or decreased.
     * @param {Number} value - Initial value of the parameter.
     * @param {String[]} [clientTypes=null] - Array of the client types to send
     *  the parameter value to. If not set, the value is sent to all the client types.
     */

  }, {
    key: 'addNumber',
    value: function addNumber(name, label, min, max, step, value) {
      var clientTypes = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;

      return new _NumberItem(this, name, label, min, max, step, value, clientTypes);
    }

    /**
     * Add a `text` parameter.
     * @param {String} name - Name of the parameter.
     * @param {String} label - Label of the parameter (displayed on the GUI on the client side).
     * @param {Number} value - Initial value of the parameter.
     * @param {String[]} [clientTypes=null] - Array of the client types to send
     *  the parameter value to. If not set, the value is sent to all the client types.
     */

  }, {
    key: 'addText',
    value: function addText(name, label, value) {
      var clientTypes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      return new _TextItem(this, name, label, value, clientTypes);
    }

    /**
     * Add a trigger (not really a parameter).
     * @param {String} name - Name of the trigger.
     * @param {String} label - Label of the trigger (displayed on the GUI on the client side).
     * @param {String[]} [clientTypes=null] - Array of the client types to send
     *  the trigger to. If not set, the value is sent to all the client types.
     */

  }, {
    key: 'addTrigger',
    value: function addTrigger(name, label) {
      var clientTypes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      return new _TriggerItem(this, name, label, undefined, clientTypes);
    }

    /**
     * @callback module:soundworks/server.SharedParams~paramCallback
     * @param {Mixed} value - Updated value of the parameter.
     */
    /**
     * Add a listener to listen to a specific parameter changes. The listener
     * is called a first time when added to retrieve the current value of the parameter.
     * @param {String} name - Name of the parameter.
     * @param {module:soundworks/server.SharedParams~paramCallback} listener - Callback
     *  that handle the event.
     */

  }, {
    key: 'addParamListener',
    value: function addParamListener(name, listener) {
      var param = this.params[name];

      if (param) {
        param.addListener(param.data.name, listener);

        if (param.data.type !== 'trigger') listener(param.data.value);
      } else {
        console.log('unknown shared parameter "' + name + '"');
      }
    }

    /**
     * Remove a listener from listening to a specific parameter changes.
     * @param {String} name - Name of the event.
     * @param {module:soundworks/client.SharedParams~paramCallback} listener - The
     *  callback to remove.
     */

  }, {
    key: 'removeParamListener',
    value: function removeParamListener(name, listener) {
      var param = this.params[name];

      if (param) param.removeListener(param.data.name, listener);else console.log('unknown shared parameter "' + name + '"');
    }

    /**
     * Updates the value of a parameter and sends it to the clients.
     * @private
     * @param {String} name - Name of the parameter to update.
     * @param {Mixed} value - New value of the parameter.
     * @param {String} [excludeClient=null] - Exclude the given client from the
     *  clients to send the update to (generally the source of the update).
     */

  }, {
    key: 'update',
    value: function update(name, value) {
      var excludeClient = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var param = this.params[name];

      if (param) param.update(value, excludeClient);else console.log('unknown shared parameter  "' + name + '"');
    }

    /** @private */

  }, {
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)(SharedParams.prototype.__proto__ || (0, _getPrototypeOf2.default)(SharedParams.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
      this.receive(client, 'update', this._onUpdate(client));
    }

    /** @private */

  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this8 = this;

      return function () {
        return _this8.send(client, 'init', _this8._paramData);
      };
    }

    /** @private */

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
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, SharedParams);

exports.default = SharedParams;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZFBhcmFtcy5qcyJdLCJuYW1lcyI6WyJfQ29udHJvbEl0ZW0iLCJwYXJlbnQiLCJ0eXBlIiwibmFtZSIsImxhYmVsIiwiaW5pdCIsInVuZGVmaW5lZCIsImNsaWVudFR5cGVzIiwiZGF0YSIsInZhbHVlIiwicGFyYW1zIiwiX3BhcmFtRGF0YSIsInB1c2giLCJ2YWwiLCJleGNsdWRlQ2xpZW50Iiwic2V0IiwiZW1pdCIsImJyb2FkY2FzdCIsIkV2ZW50RW1pdHRlciIsIl9Cb29sZWFuSXRlbSIsIl9FbnVtSXRlbSIsIm9wdGlvbnMiLCJpbmRleCIsImluZGV4T2YiLCJfTnVtYmVySXRlbSIsIm1pbiIsIm1heCIsInN0ZXAiLCJNYXRoIiwiX1RleHRJdGVtIiwiX1RyaWdnZXJJdGVtIiwiU0VSVklDRV9JRCIsIlNoYXJlZFBhcmFtcyIsInJlYWR5IiwiZGVmaW5pdGlvbnMiLCJkZWYiLCJhZGRCb29sZWFuIiwiYWRkRW51bSIsImFkZE51bWJlciIsImFkZFRleHQiLCJhZGRUcmlnZ2VyIiwibGlzdGVuZXIiLCJwYXJhbSIsImFkZExpc3RlbmVyIiwiY29uc29sZSIsImxvZyIsInJlbW92ZUxpc3RlbmVyIiwidXBkYXRlIiwiY2xpZW50IiwicmVjZWl2ZSIsIl9vblJlcXVlc3QiLCJfb25VcGRhdGUiLCJzZW5kIiwiU2VydmljZSIsInNlcnZpY2VNYW5hZ2VyIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBO0lBQ01BLFk7OztBQUNKLHdCQUFZQyxNQUFaLEVBQW9CQyxJQUFwQixFQUEwQkMsSUFBMUIsRUFBZ0NDLEtBQWhDLEVBQTZFO0FBQUEsUUFBdENDLElBQXNDLHVFQUEvQkMsU0FBK0I7QUFBQSxRQUFwQkMsV0FBb0IsdUVBQU4sSUFBTTtBQUFBOztBQUFBOztBQUczRSxVQUFLTixNQUFMLEdBQWNBLE1BQWQ7QUFDQSxVQUFLTSxX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LEdBQW5EO0FBQ0g7O0FBRUQ7Ozs7NEJBQ1E2QyxNLEVBQVE7QUFDZCxnSkFBY0EsTUFBZDs7QUFFQSxXQUFLQyxPQUFMLENBQWFELE1BQWIsRUFBcUIsU0FBckIsRUFBZ0MsS0FBS0UsVUFBTCxDQUFnQkYsTUFBaEIsQ0FBaEM7QUFDQSxXQUFLQyxPQUFMLENBQWFELE1BQWIsRUFBcUIsUUFBckIsRUFBK0IsS0FBS0csU0FBTCxDQUFlSCxNQUFmLENBQS9CO0FBQ0Q7O0FBRUQ7Ozs7K0JBQ1dBLE0sRUFBUTtBQUFBOztBQUNqQixhQUFPO0FBQUEsZUFBTSxPQUFLSSxJQUFMLENBQVVKLE1BQVYsRUFBa0IsTUFBbEIsRUFBMEIsT0FBS3JDLFVBQS9CLENBQU47QUFBQSxPQUFQO0FBQ0Q7O0FBRUQ7Ozs7OEJBQ1VxQyxNLEVBQVE7QUFBQTs7QUFDaEI7QUFDQSxhQUFPLFVBQUM3QyxJQUFELEVBQU9NLEtBQVA7QUFBQSxlQUFpQixPQUFLc0MsTUFBTCxDQUFZNUMsSUFBWixFQUFrQk0sS0FBbEIsRUFBeUJ1QyxNQUF6QixDQUFqQjtBQUFBLE9BQVA7QUFDRDs7O0VBck13QkssaUI7O0FBd00zQkMseUJBQWVDLFFBQWYsQ0FBd0J4QixVQUF4QixFQUFvQ0MsWUFBcEM7O2tCQUVlQSxZIiwiZmlsZSI6IlNoYXJlZFBhcmFtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnLi4vLi4vdXRpbHMvRXZlbnRFbWl0dGVyJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0NvbnRyb2xJdGVtIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCB0eXBlLCBuYW1lLCBsYWJlbCwgaW5pdCA9IHVuZGVmaW5lZCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuY2xpZW50VHlwZXMgPSBjbGllbnRUeXBlcztcblxuICAgIHRoaXMuZGF0YSA9IHtcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgdmFsdWU6IGluaXQsXG4gICAgfTtcblxuICAgIHBhcmVudC5wYXJhbXNbbmFtZV0gPSB0aGlzO1xuICAgIHBhcmVudC5fcGFyYW1EYXRhLnB1c2godGhpcy5kYXRhKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmRhdGEudmFsdWUgPSB2YWw7XG4gIH1cblxuICB1cGRhdGUodmFsID0gdW5kZWZpbmVkLCBleGNsdWRlQ2xpZW50ID0gbnVsbCkge1xuICAgIGxldCBwYXJlbnQgPSB0aGlzLnBhcmVudDtcbiAgICBsZXQgZGF0YSA9IHRoaXMuZGF0YTtcblxuICAgIHRoaXMuc2V0KHZhbCk7IC8vIHNldCB2YWx1ZVxuICAgIHRoaXMuZW1pdChkYXRhLm5hbWUsIGRhdGEudmFsdWUpOyAvLyBjYWxsIHBhcmFtIGxpc3RlbmVyc1xuICAgIHBhcmVudC5icm9hZGNhc3QodGhpcy5jbGllbnRUeXBlcywgZXhjbHVkZUNsaWVudCwgJ3VwZGF0ZScsIGRhdGEubmFtZSwgZGF0YS52YWx1ZSk7IC8vIHNlbmQgdG8gY2xpZW50c1xuICAgIHBhcmVudC5lbWl0KCd1cGRhdGUnLCBkYXRhLm5hbWUsIGRhdGEudmFsdWUpOyAvLyBjYWxsIHBhcmVudCBsaXN0ZW5lcnNcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9Cb29sZWFuSXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKHBhcmVudCwgJ2Jvb2xlYW4nLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9FbnVtSXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgbmFtZSwgbGFiZWwsIG9wdGlvbnMsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKHBhcmVudCwgJ2VudW0nLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuXG4gICAgdGhpcy5kYXRhLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5kYXRhO1xuICAgIGxldCBpbmRleCA9IGRhdGEub3B0aW9ucy5pbmRleE9mKHZhbCk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgZGF0YS52YWx1ZSA9IHZhbDtcbiAgICAgIGRhdGEuaW5kZXggPSBpbmRleDtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfTnVtYmVySXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgbmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcihwYXJlbnQsICdudW1iZXInLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuXG4gICAgbGV0IGRhdGEgPSB0aGlzLmRhdGE7XG4gICAgZGF0YS5taW4gPSBtaW47XG4gICAgZGF0YS5tYXggPSBtYXg7XG4gICAgZGF0YS5zdGVwID0gc3RlcDtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmRhdGEudmFsdWUgPSBNYXRoLm1pbih0aGlzLmRhdGEubWF4LCBNYXRoLm1heCh0aGlzLmRhdGEubWluLCB2YWwpKTtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UZXh0SXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKHBhcmVudCwgJ3RleHQnLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UcmlnZ2VySXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgbmFtZSwgbGFiZWwsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKHBhcmVudCwgJ3RyaWdnZXInLCBuYW1lLCBsYWJlbCwgdW5kZWZpbmVkLCBjbGllbnRUeXBlcyk7XG4gIH1cbn1cblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLXBhcmFtcyc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgc2VydmVyIGAnc2hhcmVkLXBhcmFtcydgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB0byBjcmVhdGUgc2hhcmVkIHBhcmFtZXRlcnMgYW1vbmcgYSBkaXN0cmlidXRlZFxuICogYXBwbGljYXRpb24uIEVhY2ggc2hhcmVkIHBhcmFtZXRlciBjYW4gYmUgb2YgdGhlIGZvbGxvd2luZyBkYXRhIHR5cGVzOlxuICogLSBib29sZWFuXG4gKiAtIGVudW1cbiAqIC0gbnVtYmVyXG4gKiAtIHRleHRcbiAqIC0gdHJpZ2dlcixcbiAqXG4gKiBjb25maWd1cmVkIHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcywgYW5kIGJvdW5kZWQgdG8gc3BlY2lmaWMgdHlwZSBvZiBjbGllbnRzLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbY2xpZW50LXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRQYXJhbXN9Kl9fXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQGV4YW1wbGVcbiAqIC8vIGNyZWF0ZSBhIGJvb2xlYW4gc2hhcmVkIHBhcmFtZXRlciB3aXRoIGRlZmF1bHQgdmFsdWUgdG8gYGZhbHNlYCxcbiAqIC8vIGluc2lkZSB0aGUgc2VydmVyIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc2hhcmVkUGFyYW1zID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtcGFyYW1zJyk7XG4gKiB0aGlzLnNoYXJlZFBhcmFtcy5hZGRCb29sZWFuKCdteTpib29sZWFuJywgJ015Qm9vbGVhbicsIGZhbHNlKTtcbiAqL1xuY2xhc3MgU2hhcmVkUGFyYW1zIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICAvKipcbiAgICAgKiBEaWN0aW9uYXJ5IG9mIGFsbCBjb250cm9sIHBhcmFtZXRlcnMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucGFyYW1zID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBwYXJhbWV0ZXIgZGF0YSBjZWxscy5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5fcGFyYW1EYXRhID0gW107XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyaWMgbWV0aG9kIHRvIGNyZWF0ZSBzaGFyZWQgcGFyYW1ldGVycyBmcm9tIGFuIGFycmF5IG9mIGRlZmluaXRpb25zLlxuICAgKiBBIGRlZmluaXRpb24gaXMgYW4gb2JqZWN0IHdpdGggYSAndHlwZScgcHJvcGVydHlcbiAgICogKCdib29sZWFuJyB8wqAnZW51bScgfMKgJ251bWJlcicgfMKgJ3RleHQnIHzCoCd0cmlnZ2VyJykgYW5kIGEgc2V0IG9mIHByb3BlcnRpZXNcbiAgICogbWF0Y2hpbmcgdGhlIGFyZ3VtZW50cyBvZiB0aGUgY29ycmVzcG9uZGluZyBgYWRkJHt0eXBlfWAgbWV0aG9kLlxuICAgKiBAc2VlIHtAbGluayBTaGFyZWRQYXJhbXMjYWRkQm9vbGVhbn1cbiAgICogQHNlZSB7QGxpbmsgU2hhcmVkUGFyYW1zI2FkZEVudW19XG4gICAqIEBzZWUge0BsaW5rIFNoYXJlZFBhcmFtcyNhZGROdW1iZXJ9XG4gICAqIEBzZWUge0BsaW5rIFNoYXJlZFBhcmFtcyNhZGRUZXh0fVxuICAgKiBAc2VlIHtAbGluayBTaGFyZWRQYXJhbXMjYWRkVHJpZ2dlcn1cbiAgICogQHBhcmFtIHtBcnJheX0gZGVmaW5pdGlvbnMgLSBBbiBhcnJheSBvZiBwYXJhbWV0ZXIgZGVmaW5pdGlvbnMuXG4gICAqL1xuICBhZGQoZGVmaW5pdGlvbnMpIHtcbiAgICBmb3IgKGxldCBkZWYgb2YgZGVmaW5pdGlvbnMpIHtcbiAgICAgIGxldCB0eXBlID0gZGVmLnR5cGUgfHwgJ3RleHQnO1xuXG4gICAgICBzd2l0Y2godHlwZSkge1xuICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICB0aGlzLmFkZEJvb2xlYW4oZGVmLm5hbWUsIGRlZi5sYWJlbCwgZGVmLnZhbHVlLCBkZWYuY2xpZW50VHlwZXMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdlbnVtJzpcbiAgICAgICAgICB0aGlzLmFkZEVudW0oZGVmLm5hbWUsIGRlZi5sYWJlbCwgZGVmLm9wdGlvbnMsIGRlZi52YWx1ZSwgZGVmLmNsaWVudFR5cGVzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICB0aGlzLmFkZE51bWJlcihkZWYubmFtZSwgZGVmLmxhYmVsLCBkZWYubWluLCBkZWYubWF4LCBkZWYuc3RlcCwgZGVmLnZhbHVlLCBkZWYuY2xpZW50VHlwZXMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICB0aGlzLmFkZFRleHQoZGVmLm5hbWUsIGRlZi5sYWJlbCwgZGVmLnZhbHVlLCBkZWYuY2xpZW50VHlwZXMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0cmlnZ2VyJzpcbiAgICAgICAgICB0aGlzLmFkZFRyaWdnZXIoZGVmLm5hbWUsIGRlZi5sYWJlbCwgZGVmLmNsaWVudFR5cGVzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgYGJvb2xlYW5gIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIC0gSW5pdGlhbCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyIChgdHJ1ZWAgb3IgYGZhbHNlYCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSAtIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZFxuICAgKiAgdGhlIHBhcmFtZXRlciB2YWx1ZSB0by4gSWYgbm90IHNldCwgdGhlIHZhbHVlIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGRCb29sZWFuKG5hbWUsIGxhYmVsLCB2YWx1ZSwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBfQm9vbGVhbkl0ZW0odGhpcywgbmFtZSwgbGFiZWwsIHZhbHVlLCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIGBlbnVtYCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBvcHRpb25zIC0gRGlmZmVyZW50IHBvc3NpYmxlIHZhbHVlcyBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgLSBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgKG11c3QgYmUgZGVmaW5lZCBpbiBgb3B0aW9uc2ApLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gLSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmRcbiAgICogIHRoZSBwYXJhbWV0ZXIgdmFsdWUgdG8uIElmIG5vdCBzZXQsIHRoZSB2YWx1ZSBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkRW51bShuYW1lLCBsYWJlbCwgb3B0aW9ucywgdmFsdWUsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX0VudW1JdGVtKHRoaXMsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCB2YWx1ZSwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGBudW1iZXJgIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtaW4gLSBNaW5pbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtYXggLSBNYXhpbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdGVwIC0gU3RlcCBieSB3aGljaCB0aGUgcGFyYW1ldGVyIHZhbHVlIGlzIGluY3JlYXNlZCBvciBkZWNyZWFzZWQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kXG4gICAqICB0aGUgcGFyYW1ldGVyIHZhbHVlIHRvLiBJZiBub3Qgc2V0LCB0aGUgdmFsdWUgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZE51bWJlcihuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIHZhbHVlLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IF9OdW1iZXJJdGVtKHRoaXMsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdmFsdWUsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBgdGV4dGAgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIC0gSW5pdGlhbCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gLSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmRcbiAgICogIHRoZSBwYXJhbWV0ZXIgdmFsdWUgdG8uIElmIG5vdCBzZXQsIHRoZSB2YWx1ZSBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkVGV4dChuYW1lLCBsYWJlbCwgdmFsdWUsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX1RleHRJdGVtKHRoaXMsIG5hbWUsIGxhYmVsLCB2YWx1ZSwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHRyaWdnZXIgKG5vdCByZWFsbHkgYSBwYXJhbWV0ZXIpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRyaWdnZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIExhYmVsIG9mIHRoZSB0cmlnZ2VyIChkaXNwbGF5ZWQgb24gdGhlIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gLSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmRcbiAgICogIHRoZSB0cmlnZ2VyIHRvLiBJZiBub3Qgc2V0LCB0aGUgdmFsdWUgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZFRyaWdnZXIobmFtZSwgbGFiZWwsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX1RyaWdnZXJJdGVtKHRoaXMsIG5hbWUsIGxhYmVsLCB1bmRlZmluZWQsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlNoYXJlZFBhcmFtc35wYXJhbUNhbGxiYWNrXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIC0gVXBkYXRlZCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgLyoqXG4gICAqIEFkZCBhIGxpc3RlbmVyIHRvIGxpc3RlbiB0byBhIHNwZWNpZmljIHBhcmFtZXRlciBjaGFuZ2VzLiBUaGUgbGlzdGVuZXJcbiAgICogaXMgY2FsbGVkIGEgZmlyc3QgdGltZSB3aGVuIGFkZGVkIHRvIHJldHJpZXZlIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5TaGFyZWRQYXJhbXN+cGFyYW1DYWxsYmFja30gbGlzdGVuZXIgLSBDYWxsYmFja1xuICAgKiAgdGhhdCBoYW5kbGUgdGhlIGV2ZW50LlxuICAgKi9cbiAgYWRkUGFyYW1MaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IHBhcmFtID0gdGhpcy5wYXJhbXNbbmFtZV07XG5cbiAgICBpZiAocGFyYW0pIHtcbiAgICAgIHBhcmFtLmFkZExpc3RlbmVyKHBhcmFtLmRhdGEubmFtZSwgbGlzdGVuZXIpO1xuXG4gICAgICBpZiAocGFyYW0uZGF0YS50eXBlICE9PSAndHJpZ2dlcicpXG4gICAgICAgIGxpc3RlbmVyKHBhcmFtLmRhdGEudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBzaGFyZWQgcGFyYW1ldGVyIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGlzdGVuZXIgZnJvbSBsaXN0ZW5pbmcgdG8gYSBzcGVjaWZpYyBwYXJhbWV0ZXIgY2hhbmdlcy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkUGFyYW1zfnBhcmFtQ2FsbGJhY2t9IGxpc3RlbmVyIC0gVGhlXG4gICAqICBjYWxsYmFjayB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVQYXJhbUxpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgcGFyYW0gPSB0aGlzLnBhcmFtc1tuYW1lXTtcblxuICAgIGlmIChwYXJhbSlcbiAgICAgIHBhcmFtLnJlbW92ZUxpc3RlbmVyKHBhcmFtLmRhdGEubmFtZSwgbGlzdGVuZXIpO1xuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHNoYXJlZCBwYXJhbWV0ZXIgXCInICsgbmFtZSArICdcIicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHZhbHVlIG9mIGEgcGFyYW1ldGVyIGFuZCBzZW5kcyBpdCB0byB0aGUgY2xpZW50cy5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAtIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2V4Y2x1ZGVDbGllbnQ9bnVsbF0gLSBFeGNsdWRlIHRoZSBnaXZlbiBjbGllbnQgZnJvbSB0aGVcbiAgICogIGNsaWVudHMgdG8gc2VuZCB0aGUgdXBkYXRlIHRvIChnZW5lcmFsbHkgdGhlIHNvdXJjZSBvZiB0aGUgdXBkYXRlKS5cbiAgICovXG4gIHVwZGF0ZShuYW1lLCB2YWx1ZSwgZXhjbHVkZUNsaWVudCA9IG51bGwpIHtcbiAgICBjb25zdCBwYXJhbSA9IHRoaXMucGFyYW1zW25hbWVdO1xuXG4gICAgaWYgKHBhcmFtKVxuICAgICAgcGFyYW0udXBkYXRlKHZhbHVlLCBleGNsdWRlQ2xpZW50KTtcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBzaGFyZWQgcGFyYW1ldGVyICBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAndXBkYXRlJywgdGhpcy5fb25VcGRhdGUoY2xpZW50KSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKCkgPT4gdGhpcy5zZW5kKGNsaWVudCwgJ2luaXQnLCB0aGlzLl9wYXJhbURhdGEpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblVwZGF0ZShjbGllbnQpIHtcbiAgICAvLyB1cGRhdGUsIGJ1dCBleGNsdWRlIGNsaWVudCBmcm9tIGJyb2FkY2FzdGluZyB0byBvdGhlciBjbGllbnRzXG4gICAgcmV0dXJuIChuYW1lLCB2YWx1ZSkgPT4gdGhpcy51cGRhdGUobmFtZSwgdmFsdWUsIGNsaWVudCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2hhcmVkUGFyYW1zKTtcblxuZXhwb3J0IGRlZmF1bHQgU2hhcmVkUGFyYW1zO1xuIl19