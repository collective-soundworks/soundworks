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

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

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

    var _this = (0, _possibleConstructorReturn3.default)(this, (_ControlItem.__proto__ || (0, _getPrototypeOf2.default)(_ControlItem)).call(this));

    _this.control = control;
    _this.clientTypes = clientTypes;

    _this.data = {
      type: type,
      name: name,
      label: label,
      value: init
    };

    control.params[name] = _this;
    control._paramData.push(_this.data);
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
      this.emit(data.name, data.value); // call param listeners
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
    return (0, _possibleConstructorReturn3.default)(this, (_BooleanItem.__proto__ || (0, _getPrototypeOf2.default)(_BooleanItem)).call(this, control, 'boolean', name, label, init, clientTypes));
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

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (_EnumItem.__proto__ || (0, _getPrototypeOf2.default)(_EnumItem)).call(this, control, 'enum', name, label, init, clientTypes));

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

    var _this4 = (0, _possibleConstructorReturn3.default)(this, (_NumberItem.__proto__ || (0, _getPrototypeOf2.default)(_NumberItem)).call(this, control, 'number', name, label, init, clientTypes));

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
    return (0, _possibleConstructorReturn3.default)(this, (_TextItem.__proto__ || (0, _getPrototypeOf2.default)(_TextItem)).call(this, control, 'text', name, label, init, clientTypes));
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
    return (0, _possibleConstructorReturn3.default)(this, (_TriggerItem.__proto__ || (0, _getPrototypeOf2.default)(_TriggerItem)).call(this, control, 'trigger', name, label, undefined, clientTypes));
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
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
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


  (0, _createClass3.default)(SharedParams, [{
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
     * @param {String} label - Label of the parameter (displayed on the control
     *  GUI on the client side)
     * @param {Number} value - Initial value of the parameter (`true` or `false`).
     * @param {String[]} [clientTypes=null] - Array of the client types to send
     *  the parameter value to. If not set, the value is sent to all the client types.
     */

  }, {
    key: 'addBoolean',
    value: function addBoolean(name, label, value) {
      var clientTypes = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      return new _BooleanItem(this, name, label, value, clientTypes);
    }

    /**
     * Add an `enum` parameter.
     * @param {String} name - Name of the parameter.
     * @param {String} label - Label of the parameter (displayed on the control
     *  GUI on the client side).
     * @param {String[]} options - Different possible values of the parameter.
     * @param {Number} value - Initial value of the parameter (must be defined in `options`).
     * @param {String[]} [clientTypes=null] - Array of the client types to send
     *  the parameter value to. If not set, the value is sent to all the client types.
     */

  }, {
    key: 'addEnum',
    value: function addEnum(name, label, options, value) {
      var clientTypes = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

      return new _EnumItem(this, name, label, options, value, clientTypes);
    }

    /**
     * Add a `number` parameter.
     * @param {String} name - Name of the parameter.
     * @param {String} label - Label of the parameter (displayed on the control
     *  GUI on the client side).
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
      var clientTypes = arguments.length <= 6 || arguments[6] === undefined ? null : arguments[6];

      return new _NumberItem(this, name, label, min, max, step, value, clientTypes);
    }

    /**
     * Add a `text` parameter.
     * @param {String} name - Name of the parameter.
     * @param {String} label - Label of the parameter (displayed on the control
     *  GUI on the client side).
     * @param {Number} value - Initial value of the parameter.
     * @param {String[]} [clientTypes=null] - Array of the client types to send
     *  the parameter value to. If not set, the value is sent to all the client types.
     */

  }, {
    key: 'addText',
    value: function addText(name, label, value) {
      var clientTypes = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      return new _TextItem(this, name, label, value, clientTypes);
    }

    /**
     * Add a trigger (not really a parameter).
     * @param {String} name - Name of the trigger.
     * @param {String} label - Label of the trigger (displayed on the control
     *  GUI on the client side).
     * @param {String[]} [clientTypes=null] - Array of the client types to send
     *  the trigger to. If not set, the value is sent to all the client types.
     */

  }, {
    key: 'addTrigger',
    value: function addTrigger(name, label) {
      var clientTypes = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

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
      var excludeClient = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZFBhcmFtcy5qcyJdLCJuYW1lcyI6WyJfQ29udHJvbEl0ZW0iLCJjb250cm9sIiwidHlwZSIsIm5hbWUiLCJsYWJlbCIsImluaXQiLCJ1bmRlZmluZWQiLCJjbGllbnRUeXBlcyIsImRhdGEiLCJ2YWx1ZSIsInBhcmFtcyIsIl9wYXJhbURhdGEiLCJwdXNoIiwidmFsIiwiZXhjbHVkZUNsaWVudCIsInNldCIsImVtaXQiLCJicm9hZGNhc3QiLCJfQm9vbGVhbkl0ZW0iLCJfRW51bUl0ZW0iLCJvcHRpb25zIiwiaW5kZXgiLCJpbmRleE9mIiwiX051bWJlckl0ZW0iLCJtaW4iLCJtYXgiLCJzdGVwIiwiTWF0aCIsIl9UZXh0SXRlbSIsIl9UcmlnZ2VySXRlbSIsIlNFUlZJQ0VfSUQiLCJTaGFyZWRQYXJhbXMiLCJkZWZpbml0aW9ucyIsImRlZiIsImFkZEJvb2xlYW4iLCJhZGRFbnVtIiwiYWRkTnVtYmVyIiwiYWRkVGV4dCIsImFkZFRyaWdnZXIiLCJsaXN0ZW5lciIsInBhcmFtIiwiYWRkTGlzdGVuZXIiLCJjb25zb2xlIiwibG9nIiwicmVtb3ZlTGlzdGVuZXIiLCJ1cGRhdGUiLCJjbGllbnQiLCJyZWNlaXZlIiwiX29uUmVxdWVzdCIsIl9vblVwZGF0ZSIsInNlbmQiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBO0lBQ01BLFk7OztBQUNKLHdCQUFZQyxPQUFaLEVBQXFCQyxJQUFyQixFQUEyQkMsSUFBM0IsRUFBaUNDLEtBQWpDLEVBQThFO0FBQUEsUUFBdENDLElBQXNDLHlEQUEvQkMsU0FBK0I7QUFBQSxRQUFwQkMsV0FBb0IseURBQU4sSUFBTTtBQUFBOztBQUFBOztBQUc1RSxVQUFLTixPQUFMLEdBQWVBLE9BQWY7QUFDQSxVQUFLTSxXQUFMLEdBQW1CQSxXQUFuQjs7QUFFQSxVQUFLQyxJQUFMLEdBQVk7QUFDVk4sWUFBTUEs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QWdDLEtBQUtFLFVBQUwsQ0FBZ0JGLE1BQWhCLENBQWhDO0FBQ0EsV0FBS0MsT0FBTCxDQUFhRCxNQUFiLEVBQXFCLFFBQXJCLEVBQStCLEtBQUtHLFNBQUwsQ0FBZUgsTUFBZixDQUEvQjtBQUNEOztBQUVEOzs7OytCQUNXQSxNLEVBQVE7QUFBQTs7QUFDakIsYUFBTztBQUFBLGVBQU0sT0FBS0ksSUFBTCxDQUFVSixNQUFWLEVBQWtCLE1BQWxCLEVBQTBCLE9BQUtuQyxVQUEvQixDQUFOO0FBQUEsT0FBUDtBQUNEOztBQUVEOzs7OzhCQUNVbUMsTSxFQUFRO0FBQUE7O0FBQ2hCO0FBQ0EsYUFBTyxVQUFDM0MsSUFBRCxFQUFPTSxLQUFQO0FBQUEsZUFBaUIsT0FBS29DLE1BQUwsQ0FBWTFDLElBQVosRUFBa0JNLEtBQWxCLEVBQXlCcUMsTUFBekIsQ0FBakI7QUFBQSxPQUFQO0FBQ0Q7Ozs7O0FBR0gseUJBQWVLLFFBQWYsQ0FBd0JyQixVQUF4QixFQUFvQ0MsWUFBcEM7O2tCQUVlQSxZIiwiZmlsZSI6IlNoYXJlZFBhcmFtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9Db250cm9sSXRlbSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIHR5cGUsIG5hbWUsIGxhYmVsLCBpbml0ID0gdW5kZWZpbmVkLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5jb250cm9sID0gY29udHJvbDtcbiAgICB0aGlzLmNsaWVudFR5cGVzID0gY2xpZW50VHlwZXM7XG5cbiAgICB0aGlzLmRhdGEgPSB7XG4gICAgICB0eXBlOiB0eXBlLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgIHZhbHVlOiBpbml0LFxuICAgIH07XG5cbiAgICBjb250cm9sLnBhcmFtc1tuYW1lXSA9IHRoaXM7XG4gICAgY29udHJvbC5fcGFyYW1EYXRhLnB1c2godGhpcy5kYXRhKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmRhdGEudmFsdWUgPSB2YWw7XG4gIH1cblxuICB1cGRhdGUodmFsID0gdW5kZWZpbmVkLCBleGNsdWRlQ2xpZW50ID0gbnVsbCkge1xuICAgIGxldCBjb250cm9sID0gdGhpcy5jb250cm9sO1xuICAgIGxldCBkYXRhID0gdGhpcy5kYXRhO1xuXG4gICAgdGhpcy5zZXQodmFsKTsgLy8gc2V0IHZhbHVlXG4gICAgdGhpcy5lbWl0KGRhdGEubmFtZSwgZGF0YS52YWx1ZSk7IC8vIGNhbGwgcGFyYW0gbGlzdGVuZXJzXG4gICAgY29udHJvbC5icm9hZGNhc3QodGhpcy5jbGllbnRUeXBlcywgZXhjbHVkZUNsaWVudCwgJ3VwZGF0ZScsIGRhdGEubmFtZSwgZGF0YS52YWx1ZSk7IC8vIHNlbmQgdG8gY2xpZW50c1xuICAgIGNvbnRyb2wuZW1pdCgndXBkYXRlJywgZGF0YS5uYW1lLCBkYXRhLnZhbHVlKTsgLy8gY2FsbCBjb250cm9sIGxpc3RlbmVyc1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0Jvb2xlYW5JdGVtIGV4dGVuZHMgX0NvbnRyb2xJdGVtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdib29sZWFuJywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmRhdGEudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfRW51bUl0ZW0gZXh0ZW5kcyBfQ29udHJvbEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgb3B0aW9ucywgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2VudW0nLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuXG4gICAgdGhpcy5kYXRhLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5kYXRhO1xuICAgIGxldCBpbmRleCA9IGRhdGEub3B0aW9ucy5pbmRleE9mKHZhbCk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgZGF0YS52YWx1ZSA9IHZhbDtcbiAgICAgIGRhdGEuaW5kZXggPSBpbmRleDtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfTnVtYmVySXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ251bWJlcicsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyk7XG5cbiAgICBsZXQgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICBkYXRhLm1pbiA9IG1pbjtcbiAgICBkYXRhLm1heCA9IG1heDtcbiAgICBkYXRhLnN0ZXAgPSBzdGVwO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IE1hdGgubWluKHRoaXMuZGF0YS5tYXgsIE1hdGgubWF4KHRoaXMuZGF0YS5taW4sIHZhbCkpO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RleHRJdGVtIGV4dGVuZHMgX0NvbnRyb2xJdGVtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICd0ZXh0JywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmRhdGEudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfVHJpZ2dlckl0ZW0gZXh0ZW5kcyBfQ29udHJvbEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3RyaWdnZXInLCBuYW1lLCBsYWJlbCwgdW5kZWZpbmVkLCBjbGllbnRUeXBlcyk7XG4gIH1cbn1cblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLXBhcmFtcyc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgc2VydmVyIGAnc2hhcmVkLXBhcmFtcydgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB0byBjcmVhdGUgc2hhcmVkIHBhcmFtZXRlcnMgYW1vbmcgYSBkaXN0cmlidXRlZFxuICogYXBwbGljYXRpb24uIEVhY2ggc2hhcmVkIHBhcmFtZXRlciBjYW4gYmUgb2YgdGhlIGZvbGxvd2luZyBkYXRhIHR5cGVzOlxuICogLSBib29sZWFuXG4gKiAtIGVudW1cbiAqIC0gbnVtYmVyXG4gKiAtIHRleHRcbiAqIC0gdHJpZ2dlcixcbiAqXG4gKiBjb25maWd1cmVkIHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcywgYW5kIGJvdW5kZWQgdG8gc3BlY2lmaWMgdHlwZSBvZiBjbGllbnRzLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbY2xpZW50LXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRQYXJhbXN9Kl9fXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQGV4YW1wbGVcbiAqIC8vIGNyZWF0ZSBhIGJvb2xlYW4gc2hhcmVkIHBhcmFtZXRlciB3aXRoIGRlZmF1bHQgdmFsdWUgdG8gYGZhbHNlYCxcbiAqIC8vIGluc2lkZSB0aGUgc2VydmVyIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc2hhcmVkUGFyYW1zID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtcGFyYW1zJyk7XG4gKiB0aGlzLnNoYXJlZFBhcmFtcy5hZGRCb29sZWFuKCdteTpib29sZWFuJywgJ015Qm9vbGVhbicsIGZhbHNlKTtcbiAqL1xuY2xhc3MgU2hhcmVkUGFyYW1zIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICAvKipcbiAgICAgKiBEaWN0aW9uYXJ5IG9mIGFsbCBjb250cm9sIHBhcmFtZXRlcnMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucGFyYW1zID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBwYXJhbWV0ZXIgZGF0YSBjZWxscy5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5fcGFyYW1EYXRhID0gW107XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJpYyBtZXRob2QgdG8gY3JlYXRlIHNoYXJlZCBwYXJhbWV0ZXJzIGZyb20gYW4gYXJyYXkgb2YgZGVmaW5pdGlvbnMuXG4gICAqIEEgZGVmaW5pdGlvbiBpcyBhbiBvYmplY3Qgd2l0aCBhICd0eXBlJyBwcm9wZXJ0eVxuICAgKiAoJ2Jvb2xlYW4nIHzCoCdlbnVtJyB8wqAnbnVtYmVyJyB8wqAndGV4dCcgfMKgJ3RyaWdnZXInKSBhbmQgYSBzZXQgb2YgcHJvcGVydGllc1xuICAgKiBtYXRjaGluZyB0aGUgYXJndW1lbnRzIG9mIHRoZSBjb3JyZXNwb25kaW5nIGBhZGQke3R5cGV9YCBtZXRob2QuXG4gICAqIEBzZWUge0BsaW5rIFNoYXJlZFBhcmFtcyNhZGRCb29sZWFufVxuICAgKiBAc2VlIHtAbGluayBTaGFyZWRQYXJhbXMjYWRkRW51bX1cbiAgICogQHNlZSB7QGxpbmsgU2hhcmVkUGFyYW1zI2FkZE51bWJlcn1cbiAgICogQHNlZSB7QGxpbmsgU2hhcmVkUGFyYW1zI2FkZFRleHR9XG4gICAqIEBzZWUge0BsaW5rIFNoYXJlZFBhcmFtcyNhZGRUcmlnZ2VyfVxuICAgKiBAcGFyYW0ge0FycmF5fSBkZWZpbml0aW9ucyAtIEFuIGFycmF5IG9mIHBhcmFtZXRlciBkZWZpbml0aW9ucy5cbiAgICovXG4gIGFkZChkZWZpbml0aW9ucykge1xuICAgIGZvciAobGV0IGRlZiBvZiBkZWZpbml0aW9ucykge1xuICAgICAgbGV0IHR5cGUgPSBkZWYudHlwZSB8fCAndGV4dCc7XG5cbiAgICAgIHN3aXRjaCh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgIHRoaXMuYWRkQm9vbGVhbihkZWYubmFtZSwgZGVmLmxhYmVsLCBkZWYudmFsdWUsIGRlZi5jbGllbnRUeXBlcyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2VudW0nOlxuICAgICAgICAgIHRoaXMuYWRkRW51bShkZWYubmFtZSwgZGVmLmxhYmVsLCBkZWYub3B0aW9ucywgZGVmLnZhbHVlLCBkZWYuY2xpZW50VHlwZXMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgIHRoaXMuYWRkTnVtYmVyKGRlZi5uYW1lLCBkZWYubGFiZWwsIGRlZi5taW4sIGRlZi5tYXgsIGRlZi5zdGVwLCBkZWYudmFsdWUsIGRlZi5jbGllbnRUeXBlcyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgIHRoaXMuYWRkVGV4dChkZWYubmFtZSwgZGVmLmxhYmVsLCBkZWYudmFsdWUsIGRlZi5jbGllbnRUeXBlcyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RyaWdnZXInOlxuICAgICAgICAgIHRoaXMuYWRkVHJpZ2dlcihkZWYubmFtZSwgZGVmLmxhYmVsLCBkZWYuY2xpZW50VHlwZXMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBgYm9vbGVhbmAgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sXG4gICAqICBHVUkgb24gdGhlIGNsaWVudCBzaWRlKVxuICAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgLSBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgKGB0cnVlYCBvciBgZmFsc2VgKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kXG4gICAqICB0aGUgcGFyYW1ldGVyIHZhbHVlIHRvLiBJZiBub3Qgc2V0LCB0aGUgdmFsdWUgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZEJvb2xlYW4obmFtZSwgbGFiZWwsIHZhbHVlLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IF9Cb29sZWFuSXRlbSh0aGlzLCBuYW1lLCBsYWJlbCwgdmFsdWUsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW4gYGVudW1gIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbFxuICAgKiAgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IG9wdGlvbnMgLSBEaWZmZXJlbnQgcG9zc2libGUgdmFsdWVzIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciAobXVzdCBiZSBkZWZpbmVkIGluIGBvcHRpb25zYCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSAtIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZFxuICAgKiAgdGhlIHBhcmFtZXRlciB2YWx1ZSB0by4gSWYgbm90IHNldCwgdGhlIHZhbHVlIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGRFbnVtKG5hbWUsIGxhYmVsLCBvcHRpb25zLCB2YWx1ZSwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBfRW51bUl0ZW0odGhpcywgbmFtZSwgbGFiZWwsIG9wdGlvbnMsIHZhbHVlLCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgYG51bWJlcmAgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sXG4gICAqICBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG1pbiAtIE1pbmltdW0gdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG1heCAtIE1heGltdW0gdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0ZXAgLSBTdGVwIGJ5IHdoaWNoIHRoZSBwYXJhbWV0ZXIgdmFsdWUgaXMgaW5jcmVhc2VkIG9yIGRlY3JlYXNlZC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIC0gSW5pdGlhbCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gLSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmRcbiAgICogIHRoZSBwYXJhbWV0ZXIgdmFsdWUgdG8uIElmIG5vdCBzZXQsIHRoZSB2YWx1ZSBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkTnVtYmVyKG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdmFsdWUsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX051bWJlckl0ZW0odGhpcywgbmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCB2YWx1ZSwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGB0ZXh0YCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2xcbiAgICogIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgLSBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSAtIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZFxuICAgKiAgdGhlIHBhcmFtZXRlciB2YWx1ZSB0by4gSWYgbm90IHNldCwgdGhlIHZhbHVlIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGRUZXh0KG5hbWUsIGxhYmVsLCB2YWx1ZSwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBfVGV4dEl0ZW0odGhpcywgbmFtZSwgbGFiZWwsIHZhbHVlLCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgdHJpZ2dlciAobm90IHJlYWxseSBhIHBhcmFtZXRlcikuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdHJpZ2dlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgb2YgdGhlIHRyaWdnZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbFxuICAgKiAgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSAtIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZFxuICAgKiAgdGhlIHRyaWdnZXIgdG8uIElmIG5vdCBzZXQsIHRoZSB2YWx1ZSBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkVHJpZ2dlcihuYW1lLCBsYWJlbCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBfVHJpZ2dlckl0ZW0odGhpcywgbmFtZSwgbGFiZWwsIHVuZGVmaW5lZCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuU2hhcmVkUGFyYW1zfnBhcmFtQ2FsbGJhY2tcbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgLSBVcGRhdGVkIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdG8gbGlzdGVuIHRvIGEgc3BlY2lmaWMgcGFyYW1ldGVyIGNoYW5nZXMuIFRoZSBsaXN0ZW5lclxuICAgKiBpcyBjYWxsZWQgYSBmaXJzdCB0aW1lIHdoZW4gYWRkZWQgdG8gcmV0cmlldmUgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlNoYXJlZFBhcmFtc35wYXJhbUNhbGxiYWNrfSBsaXN0ZW5lciAtIENhbGxiYWNrXG4gICAqICB0aGF0IGhhbmRsZSB0aGUgZXZlbnQuXG4gICAqL1xuICBhZGRQYXJhbUxpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgcGFyYW0gPSB0aGlzLnBhcmFtc1tuYW1lXTtcblxuICAgIGlmIChwYXJhbSkge1xuICAgICAgcGFyYW0uYWRkTGlzdGVuZXIocGFyYW0uZGF0YS5uYW1lLCBsaXN0ZW5lcik7XG5cbiAgICAgIGlmIChwYXJhbS5kYXRhLnR5cGUgIT09ICd0cmlnZ2VyJylcbiAgICAgICAgbGlzdGVuZXIocGFyYW0uZGF0YS52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHNoYXJlZCBwYXJhbWV0ZXIgXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBsaXN0ZW5lciBmcm9tIGxpc3RlbmluZyB0byBhIHNwZWNpZmljIHBhcmFtZXRlciBjaGFuZ2VzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRQYXJhbXN+cGFyYW1DYWxsYmFja30gbGlzdGVuZXIgLSBUaGVcbiAgICogIGNhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZVBhcmFtTGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBwYXJhbSA9IHRoaXMucGFyYW1zW25hbWVdO1xuXG4gICAgaWYgKHBhcmFtKVxuICAgICAgcGFyYW0ucmVtb3ZlTGlzdGVuZXIocGFyYW0uZGF0YS5uYW1lLCBsaXN0ZW5lcik7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gc2hhcmVkIHBhcmFtZXRlciBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgYSBwYXJhbWV0ZXIgYW5kIHNlbmRzIGl0IHRvIHRoZSBjbGllbnRzLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIC0gTmV3IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbZXhjbHVkZUNsaWVudD1udWxsXSAtIEV4Y2x1ZGUgdGhlIGdpdmVuIGNsaWVudCBmcm9tIHRoZVxuICAgKiAgY2xpZW50cyB0byBzZW5kIHRoZSB1cGRhdGUgdG8gKGdlbmVyYWxseSB0aGUgc291cmNlIG9mIHRoZSB1cGRhdGUpLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbHVlLCBleGNsdWRlQ2xpZW50ID0gbnVsbCkge1xuICAgIGNvbnN0IHBhcmFtID0gdGhpcy5wYXJhbXNbbmFtZV07XG5cbiAgICBpZiAocGFyYW0pXG4gICAgICBwYXJhbS51cGRhdGUodmFsdWUsIGV4Y2x1ZGVDbGllbnQpO1xuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHNoYXJlZCBwYXJhbWV0ZXIgIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICd1cGRhdGUnLCB0aGlzLl9vblVwZGF0ZShjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB0aGlzLnNlbmQoY2xpZW50LCAnaW5pdCcsIHRoaXMuX3BhcmFtRGF0YSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uVXBkYXRlKGNsaWVudCkge1xuICAgIC8vIHVwZGF0ZSwgYnV0IGV4Y2x1ZGUgY2xpZW50IGZyb20gYnJvYWRjYXN0aW5nIHRvIG90aGVyIGNsaWVudHNcbiAgICByZXR1cm4gKG5hbWUsIHZhbHVlKSA9PiB0aGlzLnVwZGF0ZShuYW1lLCB2YWx1ZSwgY2xpZW50KTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTaGFyZWRQYXJhbXMpO1xuXG5leHBvcnQgZGVmYXVsdCBTaGFyZWRQYXJhbXM7XG4iXX0=