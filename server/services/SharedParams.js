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
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_BooleanItem).call(this, control, 'boolean', name, label, init, clientTypes));
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
 * Interface of the server `'shared-params'` service.
 *
 * This service allow to create shared parameters among to distributed
 * application. Each shared parameter can be of the following
 * data types:
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

var SharedParams = function (_Activity) {
  (0, _inherits3.default)(SharedParams, _Activity);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function SharedParams() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, SharedParams);


    /**
     * Dictionary of all control parameters.
     * @type {Object}
     * @private
     */

    var _this7 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SharedParams).call(this, SERVICE_ID));

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
   * ('boolean' | 'enum' | 'number' | 'text' | 'trigger') a set of properties
   * corresponding to the argument of the corresponding add<Type> method.
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

      console.log(name, label, value, clientTypes = null);
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
     * Add a listener to listen a specific parameter changes. The listener is called a first
     * time when added to retrieve the current value of the parameter.
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
        listener(param.data.value);
      } else {
        console.log('unknown shared parameter "' + name + '"');
      }
    }

    /**
     * Remove a listener from listening a specific parameter changes.
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
      (0, _get3.default)((0, _getPrototypeOf2.default)(SharedParams.prototype), 'connect', this).call(this, client);

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
}(_Activity3.default);

_serviceManager2.default.register(SERVICE_ID, SharedParams);

exports.default = SharedParams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZFBhcmFtcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7SUFHTSxZOzs7QUFDSix3QkFBWSxPQUFaLEVBQXFCLElBQXJCLEVBQTJCLElBQTNCLEVBQWlDLEtBQWpDLEVBQThFO0FBQUEsUUFBdEMsSUFBc0MseURBQS9CLFNBQStCO0FBQUEsUUFBcEIsV0FBb0IseURBQU4sSUFBTTtBQUFBOztBQUFBOztBQUc1RSxVQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0EsVUFBSyxXQUFMLEdBQW1CLFdBQW5COztBQUVBLFVBQUssSUFBTCxHQUFZO0FBQ1YsWUFBTSxJQURJO0FBRVYsWUFBTSxJQUZJO0FBR1YsYUFBTyxLQUhHO0FBSVYsYUFBTztBQUpHLEtBQVo7O0FBT0EsWUFBUSxNQUFSLENBQWUsSUFBZjtBQUNBLFlBQVEsVUFBUixDQUFtQixJQUFuQixDQUF3QixNQUFLLElBQTdCO0FBZDRFO0FBZTdFOzs7O3dCQUVHLEcsRUFBSztBQUNQLFdBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsR0FBbEI7QUFDRDs7OzZCQUU2QztBQUFBLFVBQXZDLEdBQXVDLHlEQUFqQyxTQUFpQztBQUFBLFVBQXRCLGFBQXNCLHlEQUFOLElBQU07O0FBQzVDLFVBQUksVUFBVSxLQUFLLE9BQW5CO0FBQ0EsVUFBSSxPQUFPLEtBQUssSUFBaEI7O0FBRUEsV0FBSyxHQUFMLENBQVMsR0FBVCxFO0FBQ0EsV0FBSyxJQUFMLENBQVUsS0FBSyxJQUFmLEVBQXFCLEtBQUssS0FBMUIsRTtBQUNBLGNBQVEsU0FBUixDQUFrQixLQUFLLFdBQXZCLEVBQW9DLGFBQXBDLEVBQW1ELFFBQW5ELEVBQTZELEtBQUssSUFBbEUsRUFBd0UsS0FBSyxLQUE3RSxFO0FBQ0EsY0FBUSxJQUFSLENBQWEsUUFBYixFQUF1QixLQUFLLElBQTVCLEVBQWtDLEtBQUssS0FBdkMsRTtBQUNEOzs7Ozs7OztJQUlHLFk7OztBQUNKLHdCQUFZLE9BQVosRUFBcUIsSUFBckIsRUFBMkIsS0FBM0IsRUFBa0MsSUFBbEMsRUFBNEQ7QUFBQSxRQUFwQixXQUFvQix5REFBTixJQUFNO0FBQUE7QUFBQSxpSEFDcEQsT0FEb0QsRUFDM0MsU0FEMkMsRUFDaEMsSUFEZ0MsRUFDMUIsS0FEMEIsRUFDbkIsSUFEbUIsRUFDYixXQURhO0FBRTNEOzs7O3dCQUVHLEcsRUFBSztBQUNQLFdBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsR0FBbEI7QUFDRDs7O0VBUHdCLFk7Ozs7O0lBV3JCLFM7OztBQUNKLHFCQUFZLE9BQVosRUFBcUIsSUFBckIsRUFBMkIsS0FBM0IsRUFBa0MsT0FBbEMsRUFBMkMsSUFBM0MsRUFBcUU7QUFBQSxRQUFwQixXQUFvQix5REFBTixJQUFNO0FBQUE7O0FBQUEsb0hBQzdELE9BRDZELEVBQ3BELE1BRG9ELEVBQzVDLElBRDRDLEVBQ3RDLEtBRHNDLEVBQy9CLElBRCtCLEVBQ3pCLFdBRHlCOztBQUduRSxXQUFLLElBQUwsQ0FBVSxPQUFWLEdBQW9CLE9BQXBCO0FBSG1FO0FBSXBFOzs7O3dCQUVHLEcsRUFBSztBQUNQLFVBQUksT0FBTyxLQUFLLElBQWhCO0FBQ0EsVUFBSSxRQUFRLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsR0FBckIsQ0FBWjs7QUFFQSxVQUFJLFNBQVMsQ0FBYixFQUFnQjtBQUNkLGFBQUssS0FBTCxHQUFhLEdBQWI7QUFDQSxhQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0Q7QUFDRjs7O0VBZnFCLFk7Ozs7O0lBbUJsQixXOzs7QUFDSix1QkFBWSxPQUFaLEVBQXFCLElBQXJCLEVBQTJCLEtBQTNCLEVBQWtDLEdBQWxDLEVBQXVDLEdBQXZDLEVBQTRDLElBQTVDLEVBQWtELElBQWxELEVBQTRFO0FBQUEsUUFBcEIsV0FBb0IseURBQU4sSUFBTTtBQUFBOztBQUFBLHNIQUNwRSxPQURvRSxFQUMzRCxRQUQyRCxFQUNqRCxJQURpRCxFQUMzQyxLQUQyQyxFQUNwQyxJQURvQyxFQUM5QixXQUQ4Qjs7QUFHMUUsUUFBSSxPQUFPLE9BQUssSUFBaEI7QUFDQSxTQUFLLEdBQUwsR0FBVyxHQUFYO0FBQ0EsU0FBSyxHQUFMLEdBQVcsR0FBWDtBQUNBLFNBQUssSUFBTCxHQUFZLElBQVo7QUFOMEU7QUFPM0U7Ozs7d0JBRUcsRyxFQUFLO0FBQ1AsV0FBSyxJQUFMLENBQVUsS0FBVixHQUFrQixLQUFLLEdBQUwsQ0FBUyxLQUFLLElBQUwsQ0FBVSxHQUFuQixFQUF3QixLQUFLLEdBQUwsQ0FBUyxLQUFLLElBQUwsQ0FBVSxHQUFuQixFQUF3QixHQUF4QixDQUF4QixDQUFsQjtBQUNEOzs7RUFadUIsWTs7Ozs7SUFnQnBCLFM7OztBQUNKLHFCQUFZLE9BQVosRUFBcUIsSUFBckIsRUFBMkIsS0FBM0IsRUFBa0MsSUFBbEMsRUFBNEQ7QUFBQSxRQUFwQixXQUFvQix5REFBTixJQUFNO0FBQUE7QUFBQSw4R0FDcEQsT0FEb0QsRUFDM0MsTUFEMkMsRUFDbkMsSUFEbUMsRUFDN0IsS0FENkIsRUFDdEIsSUFEc0IsRUFDaEIsV0FEZ0I7QUFFM0Q7Ozs7d0JBRUcsRyxFQUFLO0FBQ1AsV0FBSyxJQUFMLENBQVUsS0FBVixHQUFrQixHQUFsQjtBQUNEOzs7RUFQcUIsWTs7Ozs7SUFXbEIsWTs7O0FBQ0osd0JBQVksT0FBWixFQUFxQixJQUFyQixFQUEyQixLQUEzQixFQUFzRDtBQUFBLFFBQXBCLFdBQW9CLHlEQUFOLElBQU07QUFBQTtBQUFBLGlIQUM5QyxPQUQ4QyxFQUNyQyxTQURxQyxFQUMxQixJQUQwQixFQUNwQixLQURvQixFQUNiLFNBRGEsRUFDRixXQURFO0FBRXJEOzs7RUFId0IsWTs7QUFPM0IsSUFBTSxhQUFhLHVCQUFuQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF5Qk0sWTs7Ozs7QUFFSiwwQkFBMEI7QUFBQSxRQUFkLE9BQWMseURBQUosRUFBSTtBQUFBOzs7Ozs7Ozs7QUFBQSx1SEFDbEIsVUFEa0I7O0FBUXhCLFdBQUssTUFBTCxHQUFjLEVBQWQ7Ozs7OztBQU1BLFdBQUssVUFBTCxHQUFrQixFQUFsQjtBQWR3QjtBQWV6Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7O3dCQWNHLFcsRUFBYTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNmLHdEQUFnQixXQUFoQiw0R0FBNkI7QUFBQSxjQUFwQixHQUFvQjs7QUFDM0IsY0FBSSxPQUFPLElBQUksSUFBSixJQUFZLE1BQXZCOztBQUVBLGtCQUFPLElBQVA7QUFDRSxpQkFBSyxTQUFMO0FBQ0UsbUJBQUssVUFBTCxDQUFnQixJQUFJLElBQXBCLEVBQTBCLElBQUksS0FBOUIsRUFBcUMsSUFBSSxLQUF6QyxFQUFnRCxJQUFJLFdBQXBEO0FBQ0E7QUFDRixpQkFBSyxNQUFMO0FBQ0UsbUJBQUssT0FBTCxDQUFhLElBQUksSUFBakIsRUFBdUIsSUFBSSxLQUEzQixFQUFrQyxJQUFJLE9BQXRDLEVBQStDLElBQUksS0FBbkQsRUFBMEQsSUFBSSxXQUE5RDtBQUNBO0FBQ0YsaUJBQUssUUFBTDtBQUNFLG1CQUFLLFNBQUwsQ0FBZSxJQUFJLElBQW5CLEVBQXlCLElBQUksS0FBN0IsRUFBb0MsSUFBSSxHQUF4QyxFQUE2QyxJQUFJLEdBQWpELEVBQXNELElBQUksSUFBMUQsRUFBZ0UsSUFBSSxLQUFwRSxFQUEyRSxJQUFJLFdBQS9FO0FBQ0E7QUFDRixpQkFBSyxNQUFMO0FBQ0UsbUJBQUssT0FBTCxDQUFhLElBQUksSUFBakIsRUFBdUIsSUFBSSxLQUEzQixFQUFrQyxJQUFJLEtBQXRDLEVBQTZDLElBQUksV0FBakQ7QUFDQTtBQUNGLGlCQUFLLFNBQUw7QUFDRSxtQkFBSyxVQUFMLENBQWdCLElBQUksSUFBcEIsRUFBMEIsSUFBSSxLQUE5QixFQUFxQyxJQUFJLFdBQXpDO0FBQ0E7QUFmSjtBQWlCRDtBQXJCYztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBc0JoQjs7Ozs7Ozs7Ozs7Ozs7K0JBV1UsSSxFQUFNLEssRUFBTyxLLEVBQTJCO0FBQUEsVUFBcEIsV0FBb0IseURBQU4sSUFBTTs7QUFDakQsY0FBUSxHQUFSLENBQVksSUFBWixFQUFrQixLQUFsQixFQUF5QixLQUF6QixFQUFnQyxjQUFjLElBQTlDO0FBQ0EsYUFBTyxJQUFJLFlBQUosQ0FBaUIsSUFBakIsRUFBdUIsSUFBdkIsRUFBNkIsS0FBN0IsRUFBb0MsS0FBcEMsRUFBMkMsV0FBM0MsQ0FBUDtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7NEJBWU8sSSxFQUFNLEssRUFBTyxPLEVBQVMsSyxFQUEyQjtBQUFBLFVBQXBCLFdBQW9CLHlEQUFOLElBQU07O0FBQ3ZELGFBQU8sSUFBSSxTQUFKLENBQWMsSUFBZCxFQUFvQixJQUFwQixFQUEwQixLQUExQixFQUFpQyxPQUFqQyxFQUEwQyxLQUExQyxFQUFpRCxXQUFqRCxDQUFQO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7OzhCQWNTLEksRUFBTSxLLEVBQU8sRyxFQUFLLEcsRUFBSyxJLEVBQU0sSyxFQUEyQjtBQUFBLFVBQXBCLFdBQW9CLHlEQUFOLElBQU07O0FBQ2hFLGFBQU8sSUFBSSxXQUFKLENBQWdCLElBQWhCLEVBQXNCLElBQXRCLEVBQTRCLEtBQTVCLEVBQW1DLEdBQW5DLEVBQXdDLEdBQXhDLEVBQTZDLElBQTdDLEVBQW1ELEtBQW5ELEVBQTBELFdBQTFELENBQVA7QUFDRDs7Ozs7Ozs7Ozs7Ozs7NEJBV08sSSxFQUFNLEssRUFBTyxLLEVBQTJCO0FBQUEsVUFBcEIsV0FBb0IseURBQU4sSUFBTTs7QUFDOUMsYUFBTyxJQUFJLFNBQUosQ0FBYyxJQUFkLEVBQW9CLElBQXBCLEVBQTBCLEtBQTFCLEVBQWlDLEtBQWpDLEVBQXdDLFdBQXhDLENBQVA7QUFDRDs7Ozs7Ozs7Ozs7OzsrQkFVVSxJLEVBQU0sSyxFQUEyQjtBQUFBLFVBQXBCLFdBQW9CLHlEQUFOLElBQU07O0FBQzFDLGFBQU8sSUFBSSxZQUFKLENBQWlCLElBQWpCLEVBQXVCLElBQXZCLEVBQTZCLEtBQTdCLEVBQW9DLFNBQXBDLEVBQStDLFdBQS9DLENBQVA7QUFDRDs7Ozs7Ozs7Ozs7Ozs7OztxQ0FhZ0IsSSxFQUFNLFEsRUFBVTtBQUMvQixVQUFNLFFBQVEsS0FBSyxNQUFMLENBQVksSUFBWixDQUFkOztBQUVBLFVBQUksS0FBSixFQUFXO0FBQ1QsY0FBTSxXQUFOLENBQWtCLE1BQU0sSUFBTixDQUFXLElBQTdCLEVBQW1DLFFBQW5DO0FBQ0EsaUJBQVMsTUFBTSxJQUFOLENBQVcsS0FBcEI7QUFDRCxPQUhELE1BR087QUFDTCxnQkFBUSxHQUFSLENBQVksK0JBQStCLElBQS9CLEdBQXNDLEdBQWxEO0FBQ0Q7QUFDRjs7Ozs7Ozs7Ozs7d0NBUW1CLEksRUFBTSxRLEVBQVU7QUFDbEMsVUFBTSxRQUFRLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBZDs7QUFFQSxVQUFJLEtBQUosRUFDRSxNQUFNLGNBQU4sQ0FBcUIsTUFBTSxJQUFOLENBQVcsSUFBaEMsRUFBc0MsUUFBdEMsRUFERixLQUdFLFFBQVEsR0FBUixDQUFZLCtCQUErQixJQUEvQixHQUFzQyxHQUFsRDtBQUNIOzs7Ozs7Ozs7Ozs7OzJCQVVNLEksRUFBTSxLLEVBQTZCO0FBQUEsVUFBdEIsYUFBc0IseURBQU4sSUFBTTs7QUFDeEMsVUFBTSxRQUFRLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBZDs7QUFFQSxVQUFJLEtBQUosRUFDRSxNQUFNLE1BQU4sQ0FBYSxLQUFiLEVBQW9CLGFBQXBCLEVBREYsS0FHRSxRQUFRLEdBQVIsQ0FBWSxnQ0FBZ0MsSUFBaEMsR0FBdUMsR0FBbkQ7QUFDSDs7Ozs7OzRCQUdPLE0sRUFBUTtBQUNkLDRHQUFjLE1BQWQ7O0FBRUEsV0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixTQUFyQixFQUFnQyxLQUFLLFVBQUwsQ0FBZ0IsTUFBaEIsQ0FBaEM7QUFDQSxXQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLFFBQXJCLEVBQStCLEtBQUssU0FBTCxDQUFlLE1BQWYsQ0FBL0I7QUFDRDs7Ozs7OytCQUdVLE0sRUFBUTtBQUFBOztBQUNqQixhQUFPO0FBQUEsZUFBTSxPQUFLLElBQUwsQ0FBVSxNQUFWLEVBQWtCLE1BQWxCLEVBQTBCLE9BQUssVUFBL0IsQ0FBTjtBQUFBLE9BQVA7QUFDRDs7Ozs7OzhCQUdTLE0sRUFBUTtBQUFBOzs7QUFFaEIsYUFBTyxVQUFDLElBQUQsRUFBTyxLQUFQO0FBQUEsZUFBaUIsT0FBSyxNQUFMLENBQVksSUFBWixFQUFrQixLQUFsQixFQUF5QixNQUF6QixDQUFqQjtBQUFBLE9BQVA7QUFDRDs7Ozs7QUFHSCx5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLFlBQXBDOztrQkFFZSxZIiwiZmlsZSI6IlNoYXJlZFBhcmFtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuLi9jb3JlL0FjdGl2aXR5JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0NvbnRyb2xJdGVtIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgdHlwZSwgbmFtZSwgbGFiZWwsIGluaXQgPSB1bmRlZmluZWQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2wgPSBjb250cm9sO1xuICAgIHRoaXMuY2xpZW50VHlwZXMgPSBjbGllbnRUeXBlcztcblxuICAgIHRoaXMuZGF0YSA9IHtcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgdmFsdWU6IGluaXQsXG4gICAgfTtcblxuICAgIGNvbnRyb2wucGFyYW1zW25hbWVdID0gdGhpcztcbiAgICBjb250cm9sLl9wYXJhbURhdGEucHVzaCh0aGlzLmRhdGEpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IHZhbDtcbiAgfVxuXG4gIHVwZGF0ZSh2YWwgPSB1bmRlZmluZWQsIGV4Y2x1ZGVDbGllbnQgPSBudWxsKSB7XG4gICAgbGV0IGNvbnRyb2wgPSB0aGlzLmNvbnRyb2w7XG4gICAgbGV0IGRhdGEgPSB0aGlzLmRhdGE7XG5cbiAgICB0aGlzLnNldCh2YWwpOyAvLyBzZXQgdmFsdWVcbiAgICB0aGlzLmVtaXQoZGF0YS5uYW1lLCBkYXRhLnZhbHVlKTsgLy8gY2FsbCBwYXJhbSBsaXN0ZW5lcnNcbiAgICBjb250cm9sLmJyb2FkY2FzdCh0aGlzLmNsaWVudFR5cGVzLCBleGNsdWRlQ2xpZW50LCAndXBkYXRlJywgZGF0YS5uYW1lLCBkYXRhLnZhbHVlKTsgLy8gc2VuZCB0byBjbGllbnRzXG4gICAgY29udHJvbC5lbWl0KCd1cGRhdGUnLCBkYXRhLm5hbWUsIGRhdGEudmFsdWUpOyAvLyBjYWxsIGNvbnRyb2wgbGlzdGVuZXJzXG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQm9vbGVhbkl0ZW0gZXh0ZW5kcyBfQ29udHJvbEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2Jvb2xlYW4nLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9FbnVtSXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcihjb250cm9sLCAnZW51bScsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyk7XG5cbiAgICB0aGlzLmRhdGEub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgbGV0IGRhdGEgPSB0aGlzLmRhdGE7XG4gICAgbGV0IGluZGV4ID0gZGF0YS5vcHRpb25zLmluZGV4T2YodmFsKTtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBkYXRhLnZhbHVlID0gdmFsO1xuICAgICAgZGF0YS5pbmRleCA9IGluZGV4O1xuICAgIH1cbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9OdW1iZXJJdGVtIGV4dGVuZHMgX0NvbnRyb2xJdGVtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcihjb250cm9sLCAnbnVtYmVyJywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcblxuICAgIGxldCBkYXRhID0gdGhpcy5kYXRhO1xuICAgIGRhdGEubWluID0gbWluO1xuICAgIGRhdGEubWF4ID0gbWF4O1xuICAgIGRhdGEuc3RlcCA9IHN0ZXA7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5kYXRhLnZhbHVlID0gTWF0aC5taW4odGhpcy5kYXRhLm1heCwgTWF0aC5tYXgodGhpcy5kYXRhLm1pbiwgdmFsKSk7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfVGV4dEl0ZW0gZXh0ZW5kcyBfQ29udHJvbEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3RleHQnLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UcmlnZ2VySXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcihjb250cm9sLCAndHJpZ2dlcicsIG5hbWUsIGxhYmVsLCB1bmRlZmluZWQsIGNsaWVudFR5cGVzKTtcbiAgfVxufVxuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzaGFyZWQtcGFyYW1zJztcblxuLyoqXG4gKiBJbnRlcmZhY2Ugb2YgdGhlIHNlcnZlciBgJ3NoYXJlZC1wYXJhbXMnYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvdyB0byBjcmVhdGUgc2hhcmVkIHBhcmFtZXRlcnMgYW1vbmcgdG8gZGlzdHJpYnV0ZWRcbiAqIGFwcGxpY2F0aW9uLiBFYWNoIHNoYXJlZCBwYXJhbWV0ZXIgY2FuIGJlIG9mIHRoZSBmb2xsb3dpbmdcbiAqIGRhdGEgdHlwZXM6XG4gKiAtIGJvb2xlYW5cbiAqIC0gZW51bVxuICogLSBudW1iZXJcbiAqIC0gdGV4dFxuICogLSB0cmlnZ2VyLFxuICpcbiAqIGNvbmZpZ3VyZWQgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLCBhbmQgYm91bmRlZCB0byBzcGVjaWZpYyB0eXBlIG9mIGNsaWVudHMuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtjbGllbnQtc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNoYXJlZFBhcmFtc30qX19cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogLy8gY3JlYXRlIGEgYm9vbGVhbiBzaGFyZWQgcGFyYW1ldGVyIHdpdGggZGVmYXVsdCB2YWx1ZSB0byBgZmFsc2VgLFxuICogLy8gaW5zaWRlIHRoZSBzZXJ2ZXIgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5zaGFyZWRQYXJhbXMgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAqIHRoaXMuc2hhcmVkUGFyYW1zLmFkZEJvb2xlYW4oJ215OmJvb2xlYW4nLCAnTXlCb29sZWFuJywgZmFsc2UpO1xuICovXG5jbGFzcyBTaGFyZWRQYXJhbXMgZXh0ZW5kcyBBY3Rpdml0eSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICAvKipcbiAgICAgKiBEaWN0aW9uYXJ5IG9mIGFsbCBjb250cm9sIHBhcmFtZXRlcnMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucGFyYW1zID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBwYXJhbWV0ZXIgZGF0YSBjZWxscy5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5fcGFyYW1EYXRhID0gW107XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJpYyBtZXRob2QgdG8gY3JlYXRlIHNoYXJlZCBwYXJhbWV0ZXJzIGZyb20gYW4gYXJyYXkgb2YgZGVmaW5pdGlvbnMuXG4gICAqIEEgZGVmaW5pdGlvbiBpcyBhbiBvYmplY3Qgd2l0aCBhICd0eXBlJyBwcm9wZXJ0eVxuICAgKiAoJ2Jvb2xlYW4nIHzCoCdlbnVtJyB8wqAnbnVtYmVyJyB8wqAndGV4dCcgfMKgJ3RyaWdnZXInKSBhIHNldCBvZiBwcm9wZXJ0aWVzXG4gICAqIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGFyZ3VtZW50IG9mIHRoZSBjb3JyZXNwb25kaW5nIGFkZDxUeXBlPiBtZXRob2QuXG4gICAqIEBzZWUge0BsaW5rIFNoYXJlZFBhcmFtcyNhZGRCb29sZWFufVxuICAgKiBAc2VlIHtAbGluayBTaGFyZWRQYXJhbXMjYWRkRW51bX1cbiAgICogQHNlZSB7QGxpbmsgU2hhcmVkUGFyYW1zI2FkZE51bWJlcn1cbiAgICogQHNlZSB7QGxpbmsgU2hhcmVkUGFyYW1zI2FkZFRleHR9XG4gICAqIEBzZWUge0BsaW5rIFNoYXJlZFBhcmFtcyNhZGRUcmlnZ2VyfVxuICAgKiBAcGFyYW0ge0FycmF5fSBkZWZpbml0aW9ucyAtIEFuIGFycmF5IG9mIHBhcmFtZXRlciBkZWZpbml0aW9ucy5cbiAgICovXG4gIGFkZChkZWZpbml0aW9ucykge1xuICAgIGZvciAobGV0IGRlZiBvZiBkZWZpbml0aW9ucykge1xuICAgICAgbGV0IHR5cGUgPSBkZWYudHlwZSB8fCAndGV4dCc7XG5cbiAgICAgIHN3aXRjaCh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgIHRoaXMuYWRkQm9vbGVhbihkZWYubmFtZSwgZGVmLmxhYmVsLCBkZWYudmFsdWUsIGRlZi5jbGllbnRUeXBlcyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2VudW0nOlxuICAgICAgICAgIHRoaXMuYWRkRW51bShkZWYubmFtZSwgZGVmLmxhYmVsLCBkZWYub3B0aW9ucywgZGVmLnZhbHVlLCBkZWYuY2xpZW50VHlwZXMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgIHRoaXMuYWRkTnVtYmVyKGRlZi5uYW1lLCBkZWYubGFiZWwsIGRlZi5taW4sIGRlZi5tYXgsIGRlZi5zdGVwLCBkZWYudmFsdWUsIGRlZi5jbGllbnRUeXBlcyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgIHRoaXMuYWRkVGV4dChkZWYubmFtZSwgZGVmLmxhYmVsLCBkZWYudmFsdWUsIGRlZi5jbGllbnRUeXBlcyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RyaWdnZXInOlxuICAgICAgICAgIHRoaXMuYWRkVHJpZ2dlcihkZWYubmFtZSwgZGVmLmxhYmVsLCBkZWYuY2xpZW50VHlwZXMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBgYm9vbGVhbmAgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sXG4gICAqICBHVUkgb24gdGhlIGNsaWVudCBzaWRlKVxuICAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgLSBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgKGB0cnVlYCBvciBgZmFsc2VgKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kXG4gICAqICB0aGUgcGFyYW1ldGVyIHZhbHVlIHRvLiBJZiBub3Qgc2V0LCB0aGUgdmFsdWUgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZEJvb2xlYW4obmFtZSwgbGFiZWwsIHZhbHVlLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBjb25zb2xlLmxvZyhuYW1lLCBsYWJlbCwgdmFsdWUsIGNsaWVudFR5cGVzID0gbnVsbCk7XG4gICAgcmV0dXJuIG5ldyBfQm9vbGVhbkl0ZW0odGhpcywgbmFtZSwgbGFiZWwsIHZhbHVlLCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIGBlbnVtYCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2xcbiAgICogIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBvcHRpb25zIC0gRGlmZmVyZW50IHBvc3NpYmxlIHZhbHVlcyBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgLSBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgKG11c3QgYmUgZGVmaW5lZCBpbiBgb3B0aW9uc2ApLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gLSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmRcbiAgICogIHRoZSBwYXJhbWV0ZXIgdmFsdWUgdG8uIElmIG5vdCBzZXQsIHRoZSB2YWx1ZSBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkRW51bShuYW1lLCBsYWJlbCwgb3B0aW9ucywgdmFsdWUsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX0VudW1JdGVtKHRoaXMsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCB2YWx1ZSwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGBudW1iZXJgIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbFxuICAgKiAgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtaW4gLSBNaW5pbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtYXggLSBNYXhpbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdGVwIC0gU3RlcCBieSB3aGljaCB0aGUgcGFyYW1ldGVyIHZhbHVlIGlzIGluY3JlYXNlZCBvciBkZWNyZWFzZWQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kXG4gICAqICB0aGUgcGFyYW1ldGVyIHZhbHVlIHRvLiBJZiBub3Qgc2V0LCB0aGUgdmFsdWUgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZE51bWJlcihuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIHZhbHVlLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IF9OdW1iZXJJdGVtKHRoaXMsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdmFsdWUsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBgdGV4dGAgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sXG4gICAqICBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIC0gSW5pdGlhbCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gLSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmRcbiAgICogIHRoZSBwYXJhbWV0ZXIgdmFsdWUgdG8uIElmIG5vdCBzZXQsIHRoZSB2YWx1ZSBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkVGV4dChuYW1lLCBsYWJlbCwgdmFsdWUsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX1RleHRJdGVtKHRoaXMsIG5hbWUsIGxhYmVsLCB2YWx1ZSwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHRyaWdnZXIgKG5vdCByZWFsbHkgYSBwYXJhbWV0ZXIpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRyaWdnZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIExhYmVsIG9mIHRoZSB0cmlnZ2VyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2xcbiAgICogIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gLSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmRcbiAgICogIHRoZSB0cmlnZ2VyIHRvLiBJZiBub3Qgc2V0LCB0aGUgdmFsdWUgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZFRyaWdnZXIobmFtZSwgbGFiZWwsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX1RyaWdnZXJJdGVtKHRoaXMsIG5hbWUsIGxhYmVsLCB1bmRlZmluZWQsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlNoYXJlZFBhcmFtc35wYXJhbUNhbGxiYWNrXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIC0gVXBkYXRlZCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgLyoqXG4gICAqIEFkZCBhIGxpc3RlbmVyIHRvIGxpc3RlbiBhIHNwZWNpZmljIHBhcmFtZXRlciBjaGFuZ2VzLiBUaGUgbGlzdGVuZXIgaXMgY2FsbGVkIGEgZmlyc3RcbiAgICogdGltZSB3aGVuIGFkZGVkIHRvIHJldHJpZXZlIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5TaGFyZWRQYXJhbXN+cGFyYW1DYWxsYmFja30gbGlzdGVuZXIgLSBDYWxsYmFja1xuICAgKiAgdGhhdCBoYW5kbGUgdGhlIGV2ZW50LlxuICAgKi9cbiAgYWRkUGFyYW1MaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IHBhcmFtID0gdGhpcy5wYXJhbXNbbmFtZV07XG5cbiAgICBpZiAocGFyYW0pIHtcbiAgICAgIHBhcmFtLmFkZExpc3RlbmVyKHBhcmFtLmRhdGEubmFtZSwgbGlzdGVuZXIpO1xuICAgICAgbGlzdGVuZXIocGFyYW0uZGF0YS52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHNoYXJlZCBwYXJhbWV0ZXIgXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBsaXN0ZW5lciBmcm9tIGxpc3RlbmluZyBhIHNwZWNpZmljIHBhcmFtZXRlciBjaGFuZ2VzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRQYXJhbXN+cGFyYW1DYWxsYmFja30gbGlzdGVuZXIgLSBUaGVcbiAgICogIGNhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZVBhcmFtTGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBwYXJhbSA9IHRoaXMucGFyYW1zW25hbWVdO1xuXG4gICAgaWYgKHBhcmFtKVxuICAgICAgcGFyYW0ucmVtb3ZlTGlzdGVuZXIocGFyYW0uZGF0YS5uYW1lLCBsaXN0ZW5lcik7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gc2hhcmVkIHBhcmFtZXRlciBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgYSBwYXJhbWV0ZXIgYW5kIHNlbmRzIGl0IHRvIHRoZSBjbGllbnRzLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIC0gTmV3IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbZXhjbHVkZUNsaWVudD1udWxsXSAtIEV4Y2x1ZGUgdGhlIGdpdmVuIGNsaWVudCBmcm9tIHRoZVxuICAgKiAgY2xpZW50cyB0byBzZW5kIHRoZSB1cGRhdGUgdG8gKGdlbmVyYWxseSB0aGUgc291cmNlIG9mIHRoZSB1cGRhdGUpLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbHVlLCBleGNsdWRlQ2xpZW50ID0gbnVsbCkge1xuICAgIGNvbnN0IHBhcmFtID0gdGhpcy5wYXJhbXNbbmFtZV07XG5cbiAgICBpZiAocGFyYW0pXG4gICAgICBwYXJhbS51cGRhdGUodmFsdWUsIGV4Y2x1ZGVDbGllbnQpO1xuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHNoYXJlZCBwYXJhbWV0ZXIgIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICd1cGRhdGUnLCB0aGlzLl9vblVwZGF0ZShjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB0aGlzLnNlbmQoY2xpZW50LCAnaW5pdCcsIHRoaXMuX3BhcmFtRGF0YSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uVXBkYXRlKGNsaWVudCkge1xuICAgIC8vIHVwZGF0ZSwgYnV0IGV4Y2x1ZGUgY2xpZW50IGZyb20gYnJvYWRjYXN0aW5nIHRvIG90aGVyIGNsaWVudHNcbiAgICByZXR1cm4gKG5hbWUsIHZhbHVlKSA9PiB0aGlzLnVwZGF0ZShuYW1lLCB2YWx1ZSwgY2xpZW50KTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTaGFyZWRQYXJhbXMpO1xuXG5leHBvcnQgZGVmYXVsdCBTaGFyZWRQYXJhbXM7XG4iXX0=