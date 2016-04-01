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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZFBhcmFtcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7SUFHTTs7O0FBQ0osV0FESSxZQUNKLENBQVksT0FBWixFQUFxQixJQUFyQixFQUEyQixJQUEzQixFQUFpQyxLQUFqQyxFQUE4RTtRQUF0Qyw2REFBTyx5QkFBK0I7UUFBcEIsb0VBQWMsb0JBQU07d0NBRDFFLGNBQzBFOzs2RkFEMUUsMEJBQzBFOztBQUc1RSxVQUFLLE9BQUwsR0FBZSxPQUFmLENBSDRFO0FBSTVFLFVBQUssV0FBTCxHQUFtQixXQUFuQixDQUo0RTs7QUFNNUUsVUFBSyxJQUFMLEdBQVk7QUFDVixZQUFNLElBQU47QUFDQSxZQUFNLElBQU47QUFDQSxhQUFPLEtBQVA7QUFDQSxhQUFPLElBQVA7S0FKRixDQU40RTs7QUFhNUUsWUFBUSxNQUFSLENBQWUsSUFBZixVQWI0RTtBQWM1RSxZQUFRLFVBQVIsQ0FBbUIsSUFBbkIsQ0FBd0IsTUFBSyxJQUFMLENBQXhCLENBZDRFOztHQUE5RTs7NkJBREk7O3dCQWtCQSxLQUFLO0FBQ1AsV0FBSyxJQUFMLENBQVUsS0FBVixHQUFrQixHQUFsQixDQURPOzs7OzZCQUlxQztVQUF2Qyw0REFBTSx5QkFBaUM7VUFBdEIsc0VBQWdCLG9CQUFNOztBQUM1QyxVQUFJLFVBQVUsS0FBSyxPQUFMLENBRDhCO0FBRTVDLFVBQUksT0FBTyxLQUFLLElBQUwsQ0FGaUM7O0FBSTVDLFdBQUssR0FBTCxDQUFTLEdBQVQ7QUFKNEMsVUFLNUMsQ0FBSyxJQUFMLENBQVUsS0FBSyxJQUFMLEVBQVcsS0FBSyxLQUFMLENBQXJCO0FBTDRDLGFBTTVDLENBQVEsU0FBUixDQUFrQixLQUFLLFdBQUwsRUFBa0IsYUFBcEMsRUFBbUQsUUFBbkQsRUFBNkQsS0FBSyxJQUFMLEVBQVcsS0FBSyxLQUFMLENBQXhFO0FBTjRDLGFBTzVDLENBQVEsSUFBUixDQUFhLFFBQWIsRUFBdUIsS0FBSyxJQUFMLEVBQVcsS0FBSyxLQUFMLENBQWxDO0FBUDRDOztTQXRCMUM7Ozs7OztJQWtDQTs7O0FBQ0osV0FESSxZQUNKLENBQVksT0FBWixFQUFxQixJQUFyQixFQUEyQixLQUEzQixFQUFrQyxJQUFsQyxFQUE0RDtRQUFwQixvRUFBYyxvQkFBTTt3Q0FEeEQsY0FDd0Q7d0ZBRHhELHlCQUVJLFNBQVMsV0FBVyxNQUFNLE9BQU8sTUFBTSxhQURhO0dBQTVEOzs2QkFESTs7d0JBS0EsS0FBSztBQUNQLFdBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsR0FBbEIsQ0FETzs7O1NBTEw7RUFBcUI7Ozs7O0lBV3JCOzs7QUFDSixXQURJLFNBQ0osQ0FBWSxPQUFaLEVBQXFCLElBQXJCLEVBQTJCLEtBQTNCLEVBQWtDLE9BQWxDLEVBQTJDLElBQTNDLEVBQXFFO1FBQXBCLG9FQUFjLG9CQUFNO3dDQURqRSxXQUNpRTs7OEZBRGpFLHNCQUVJLFNBQVMsUUFBUSxNQUFNLE9BQU8sTUFBTSxjQUR5Qjs7QUFHbkUsV0FBSyxJQUFMLENBQVUsT0FBVixHQUFvQixPQUFwQixDQUhtRTs7R0FBckU7OzZCQURJOzt3QkFPQSxLQUFLO0FBQ1AsVUFBSSxPQUFPLEtBQUssSUFBTCxDQURKO0FBRVAsVUFBSSxRQUFRLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsR0FBckIsQ0FBUixDQUZHOztBQUlQLFVBQUksU0FBUyxDQUFULEVBQVk7QUFDZCxhQUFLLEtBQUwsR0FBYSxHQUFiLENBRGM7QUFFZCxhQUFLLEtBQUwsR0FBYSxLQUFiLENBRmM7T0FBaEI7OztTQVhFO0VBQWtCOzs7OztJQW1CbEI7OztBQUNKLFdBREksV0FDSixDQUFZLE9BQVosRUFBcUIsSUFBckIsRUFBMkIsS0FBM0IsRUFBa0MsR0FBbEMsRUFBdUMsR0FBdkMsRUFBNEMsSUFBNUMsRUFBa0QsSUFBbEQsRUFBNEU7UUFBcEIsb0VBQWMsb0JBQU07d0NBRHhFLGFBQ3dFOzs4RkFEeEUsd0JBRUksU0FBUyxVQUFVLE1BQU0sT0FBTyxNQUFNLGNBRDhCOztBQUcxRSxRQUFJLE9BQU8sT0FBSyxJQUFMLENBSCtEO0FBSTFFLFNBQUssR0FBTCxHQUFXLEdBQVgsQ0FKMEU7QUFLMUUsU0FBSyxHQUFMLEdBQVcsR0FBWCxDQUwwRTtBQU0xRSxTQUFLLElBQUwsR0FBWSxJQUFaLENBTjBFOztHQUE1RTs7NkJBREk7O3dCQVVBLEtBQUs7QUFDUCxXQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLEtBQUssR0FBTCxDQUFTLEtBQUssSUFBTCxDQUFVLEdBQVYsRUFBZSxLQUFLLEdBQUwsQ0FBUyxLQUFLLElBQUwsQ0FBVSxHQUFWLEVBQWUsR0FBeEIsQ0FBeEIsQ0FBbEIsQ0FETzs7O1NBVkw7RUFBb0I7Ozs7O0lBZ0JwQjs7O0FBQ0osV0FESSxTQUNKLENBQVksT0FBWixFQUFxQixJQUFyQixFQUEyQixLQUEzQixFQUFrQyxJQUFsQyxFQUE0RDtRQUFwQixvRUFBYyxvQkFBTTt3Q0FEeEQsV0FDd0Q7d0ZBRHhELHNCQUVJLFNBQVMsUUFBUSxNQUFNLE9BQU8sTUFBTSxjQURnQjtHQUE1RDs7NkJBREk7O3dCQUtBLEtBQUs7QUFDUCxXQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLEdBQWxCLENBRE87OztTQUxMO0VBQWtCOzs7OztJQVdsQjs7O0FBQ0osV0FESSxZQUNKLENBQVksT0FBWixFQUFxQixJQUFyQixFQUEyQixLQUEzQixFQUFzRDtRQUFwQixvRUFBYyxvQkFBTTt3Q0FEbEQsY0FDa0Q7d0ZBRGxELHlCQUVJLFNBQVMsV0FBVyxNQUFNLE9BQU8sV0FBVyxjQURFO0dBQXREOztTQURJO0VBQXFCOztBQU8zQixJQUFNLGFBQWEsdUJBQWI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBeUJBOzs7OztBQUVKLFdBRkksWUFFSixHQUEwQjtRQUFkLGdFQUFVLGtCQUFJO3dDQUZ0QixjQUVzQjs7Ozs7Ozs7OzhGQUZ0Qix5QkFHSSxhQURrQjs7QUFReEIsV0FBSyxNQUFMLEdBQWMsRUFBZDs7Ozs7O0FBUndCLFVBY3hCLENBQUssVUFBTCxHQUFrQixFQUFsQixDQWR3Qjs7R0FBMUI7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBRkk7O3dCQStCQSxhQUFhOzs7Ozs7QUFDZix3REFBZ0IsbUJBQWhCLG9HQUE2QjtjQUFwQixrQkFBb0I7O0FBQzNCLGNBQUksT0FBTyxJQUFJLElBQUosSUFBWSxNQUFaLENBRGdCOztBQUczQixrQkFBTyxJQUFQO0FBQ0UsaUJBQUssU0FBTDtBQUNFLG1CQUFLLFVBQUwsQ0FBZ0IsSUFBSSxJQUFKLEVBQVUsSUFBSSxLQUFKLEVBQVcsSUFBSSxLQUFKLEVBQVcsSUFBSSxXQUFKLENBQWhELENBREY7QUFFRSxvQkFGRjtBQURGLGlCQUlPLE1BQUw7QUFDRSxtQkFBSyxPQUFMLENBQWEsSUFBSSxJQUFKLEVBQVUsSUFBSSxLQUFKLEVBQVcsSUFBSSxPQUFKLEVBQWEsSUFBSSxLQUFKLEVBQVcsSUFBSSxXQUFKLENBQTFELENBREY7QUFFRSxvQkFGRjtBQUpGLGlCQU9PLFFBQUw7QUFDRSxtQkFBSyxTQUFMLENBQWUsSUFBSSxJQUFKLEVBQVUsSUFBSSxLQUFKLEVBQVcsSUFBSSxHQUFKLEVBQVMsSUFBSSxHQUFKLEVBQVMsSUFBSSxJQUFKLEVBQVUsSUFBSSxLQUFKLEVBQVcsSUFBSSxXQUFKLENBQTNFLENBREY7QUFFRSxvQkFGRjtBQVBGLGlCQVVPLE1BQUw7QUFDRSxtQkFBSyxPQUFMLENBQWEsSUFBSSxJQUFKLEVBQVUsSUFBSSxLQUFKLEVBQVcsSUFBSSxLQUFKLEVBQVcsSUFBSSxXQUFKLENBQTdDLENBREY7QUFFRSxvQkFGRjtBQVZGLGlCQWFPLFNBQUw7QUFDRSxtQkFBSyxVQUFMLENBQWdCLElBQUksSUFBSixFQUFVLElBQUksS0FBSixFQUFXLElBQUksV0FBSixDQUFyQyxDQURGO0FBRUUsb0JBRkY7QUFiRixXQUgyQjtTQUE3Qjs7Ozs7Ozs7Ozs7Ozs7T0FEZTs7Ozs7Ozs7Ozs7Ozs7OytCQWlDTixNQUFNLE9BQU8sT0FBMkI7VUFBcEIsb0VBQWMsb0JBQU07O0FBQ2pELGFBQU8sSUFBSSxZQUFKLENBQWlCLElBQWpCLEVBQXVCLElBQXZCLEVBQTZCLEtBQTdCLEVBQW9DLEtBQXBDLEVBQTJDLFdBQTNDLENBQVAsQ0FEaUQ7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBYzNDLE1BQU0sT0FBTyxTQUFTLE9BQTJCO1VBQXBCLG9FQUFjLG9CQUFNOztBQUN2RCxhQUFPLElBQUksU0FBSixDQUFjLElBQWQsRUFBb0IsSUFBcEIsRUFBMEIsS0FBMUIsRUFBaUMsT0FBakMsRUFBMEMsS0FBMUMsRUFBaUQsV0FBakQsQ0FBUCxDQUR1RDs7Ozs7Ozs7Ozs7Ozs7Ozs7OzhCQWdCL0MsTUFBTSxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQTJCO1VBQXBCLG9FQUFjLG9CQUFNOztBQUNoRSxhQUFPLElBQUksV0FBSixDQUFnQixJQUFoQixFQUFzQixJQUF0QixFQUE0QixLQUE1QixFQUFtQyxHQUFuQyxFQUF3QyxHQUF4QyxFQUE2QyxJQUE3QyxFQUFtRCxLQUFuRCxFQUEwRCxXQUExRCxDQUFQLENBRGdFOzs7Ozs7Ozs7Ozs7Ozs7NEJBYTFELE1BQU0sT0FBTyxPQUEyQjtVQUFwQixvRUFBYyxvQkFBTTs7QUFDOUMsYUFBTyxJQUFJLFNBQUosQ0FBYyxJQUFkLEVBQW9CLElBQXBCLEVBQTBCLEtBQTFCLEVBQWlDLEtBQWpDLEVBQXdDLFdBQXhDLENBQVAsQ0FEOEM7Ozs7Ozs7Ozs7Ozs7OytCQVlyQyxNQUFNLE9BQTJCO1VBQXBCLG9FQUFjLG9CQUFNOztBQUMxQyxhQUFPLElBQUksWUFBSixDQUFpQixJQUFqQixFQUF1QixJQUF2QixFQUE2QixLQUE3QixFQUFvQyxTQUFwQyxFQUErQyxXQUEvQyxDQUFQLENBRDBDOzs7Ozs7Ozs7Ozs7Ozs7OztxQ0FlM0IsTUFBTSxVQUFVO0FBQy9CLFVBQU0sUUFBUSxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQVIsQ0FEeUI7O0FBRy9CLFVBQUksS0FBSixFQUFXO0FBQ1QsY0FBTSxXQUFOLENBQWtCLE1BQU0sSUFBTixDQUFXLElBQVgsRUFBaUIsUUFBbkMsRUFEUztBQUVULGlCQUFTLE1BQU0sSUFBTixDQUFXLEtBQVgsQ0FBVCxDQUZTO09BQVgsTUFHTztBQUNMLGdCQUFRLEdBQVIsQ0FBWSwrQkFBK0IsSUFBL0IsR0FBc0MsR0FBdEMsQ0FBWixDQURLO09BSFA7Ozs7Ozs7Ozs7Ozt3Q0Fja0IsTUFBTSxVQUFVO0FBQ2xDLFVBQU0sUUFBUSxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQVIsQ0FENEI7O0FBR2xDLFVBQUksS0FBSixFQUNFLE1BQU0sY0FBTixDQUFxQixNQUFNLElBQU4sQ0FBVyxJQUFYLEVBQWlCLFFBQXRDLEVBREYsS0FHRSxRQUFRLEdBQVIsQ0FBWSwrQkFBK0IsSUFBL0IsR0FBc0MsR0FBdEMsQ0FBWixDQUhGOzs7Ozs7Ozs7Ozs7OzsyQkFjSyxNQUFNLE9BQTZCO1VBQXRCLHNFQUFnQixvQkFBTTs7QUFDeEMsVUFBTSxRQUFRLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBUixDQURrQzs7QUFHeEMsVUFBSSxLQUFKLEVBQ0UsTUFBTSxNQUFOLENBQWEsS0FBYixFQUFvQixhQUFwQixFQURGLEtBR0UsUUFBUSxHQUFSLENBQVksZ0NBQWdDLElBQWhDLEdBQXVDLEdBQXZDLENBQVosQ0FIRjs7Ozs7Ozs0QkFPTSxRQUFRO0FBQ2QsdURBbkxFLHFEQW1MWSxPQUFkLENBRGM7O0FBR2QsV0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixTQUFyQixFQUFnQyxLQUFLLFVBQUwsQ0FBZ0IsTUFBaEIsQ0FBaEMsRUFIYztBQUlkLFdBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsUUFBckIsRUFBK0IsS0FBSyxTQUFMLENBQWUsTUFBZixDQUEvQixFQUpjOzs7Ozs7OytCQVFMLFFBQVE7OztBQUNqQixhQUFPO2VBQU0sT0FBSyxJQUFMLENBQVUsTUFBVixFQUFrQixNQUFsQixFQUEwQixPQUFLLFVBQUw7T0FBaEMsQ0FEVTs7Ozs7Ozs4QkFLVCxRQUFROzs7O0FBRWhCLGFBQU8sVUFBQyxJQUFELEVBQU8sS0FBUDtlQUFpQixPQUFLLE1BQUwsQ0FBWSxJQUFaLEVBQWtCLEtBQWxCLEVBQXlCLE1BQXpCO09BQWpCLENBRlM7OztTQS9MZDs7O0FBcU1OLHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsWUFBcEM7O2tCQUVlIiwiZmlsZSI6IlNoYXJlZFBhcmFtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuLi9jb3JlL0FjdGl2aXR5JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0NvbnRyb2xJdGVtIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgdHlwZSwgbmFtZSwgbGFiZWwsIGluaXQgPSB1bmRlZmluZWQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2wgPSBjb250cm9sO1xuICAgIHRoaXMuY2xpZW50VHlwZXMgPSBjbGllbnRUeXBlcztcblxuICAgIHRoaXMuZGF0YSA9IHtcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgdmFsdWU6IGluaXQsXG4gICAgfTtcblxuICAgIGNvbnRyb2wucGFyYW1zW25hbWVdID0gdGhpcztcbiAgICBjb250cm9sLl9wYXJhbURhdGEucHVzaCh0aGlzLmRhdGEpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IHZhbDtcbiAgfVxuXG4gIHVwZGF0ZSh2YWwgPSB1bmRlZmluZWQsIGV4Y2x1ZGVDbGllbnQgPSBudWxsKSB7XG4gICAgbGV0IGNvbnRyb2wgPSB0aGlzLmNvbnRyb2w7XG4gICAgbGV0IGRhdGEgPSB0aGlzLmRhdGE7XG5cbiAgICB0aGlzLnNldCh2YWwpOyAvLyBzZXQgdmFsdWVcbiAgICB0aGlzLmVtaXQoZGF0YS5uYW1lLCBkYXRhLnZhbHVlKTsgLy8gY2FsbCBwYXJhbSBsaXN0ZW5lcnNcbiAgICBjb250cm9sLmJyb2FkY2FzdCh0aGlzLmNsaWVudFR5cGVzLCBleGNsdWRlQ2xpZW50LCAndXBkYXRlJywgZGF0YS5uYW1lLCBkYXRhLnZhbHVlKTsgLy8gc2VuZCB0byBjbGllbnRzXG4gICAgY29udHJvbC5lbWl0KCd1cGRhdGUnLCBkYXRhLm5hbWUsIGRhdGEudmFsdWUpOyAvLyBjYWxsIGNvbnRyb2wgbGlzdGVuZXJzXG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQm9vbGVhbkl0ZW0gZXh0ZW5kcyBfQ29udHJvbEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2Jvb2xlYW4nLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5kYXRhLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0VudW1JdGVtIGV4dGVuZHMgX0NvbnRyb2xJdGVtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIG9wdGlvbnMsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdlbnVtJywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcblxuICAgIHRoaXMuZGF0YS5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICBsZXQgaW5kZXggPSBkYXRhLm9wdGlvbnMuaW5kZXhPZih2YWwpO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIGRhdGEudmFsdWUgPSB2YWw7XG4gICAgICBkYXRhLmluZGV4ID0gaW5kZXg7XG4gICAgfVxuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX051bWJlckl0ZW0gZXh0ZW5kcyBfQ29udHJvbEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdudW1iZXInLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuXG4gICAgbGV0IGRhdGEgPSB0aGlzLmRhdGE7XG4gICAgZGF0YS5taW4gPSBtaW47XG4gICAgZGF0YS5tYXggPSBtYXg7XG4gICAgZGF0YS5zdGVwID0gc3RlcDtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmRhdGEudmFsdWUgPSBNYXRoLm1pbih0aGlzLmRhdGEubWF4LCBNYXRoLm1heCh0aGlzLmRhdGEubWluLCB2YWwpKTtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UZXh0SXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcihjb250cm9sLCAndGV4dCcsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5kYXRhLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RyaWdnZXJJdGVtIGV4dGVuZHMgX0NvbnRyb2xJdGVtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICd0cmlnZ2VyJywgbmFtZSwgbGFiZWwsIHVuZGVmaW5lZCwgY2xpZW50VHlwZXMpO1xuICB9XG59XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnNoYXJlZC1wYXJhbXMnO1xuXG4vKipcbiAqIEludGVyZmFjZSBvZiB0aGUgc2VydmVyIGAnc2hhcmVkLXBhcmFtcydgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93IHRvIGNyZWF0ZSBzaGFyZWQgcGFyYW1ldGVycyBhbW9uZyB0byBkaXN0cmlidXRlZFxuICogYXBwbGljYXRpb24uIEVhY2ggc2hhcmVkIHBhcmFtZXRlciBjYW4gYmUgb2YgdGhlIGZvbGxvd2luZ1xuICogZGF0YSB0eXBlczpcbiAqIC0gYm9vbGVhblxuICogLSBlbnVtXG4gKiAtIG51bWJlclxuICogLSB0ZXh0XG4gKiAtIHRyaWdnZXIsXG4gKlxuICogY29uZmlndXJlZCB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMsIGFuZCBib3VuZGVkIHRvIHNwZWNpZmljIHR5cGUgb2YgY2xpZW50cy5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkUGFyYW1zfSpfX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBjcmVhdGUgYSBib29sZWFuIHNoYXJlZCBwYXJhbWV0ZXIgd2l0aCBkZWZhdWx0IHZhbHVlIHRvIGBmYWxzZWAsXG4gKiAvLyBpbnNpZGUgdGhlIHNlcnZlciBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnNoYXJlZFBhcmFtcyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLXBhcmFtcycpO1xuICogdGhpcy5zaGFyZWRQYXJhbXMuYWRkQm9vbGVhbignbXk6Ym9vbGVhbicsICdNeUJvb2xlYW4nLCBmYWxzZSk7XG4gKi9cbmNsYXNzIFNoYXJlZFBhcmFtcyBleHRlbmRzIEFjdGl2aXR5IHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIC8qKlxuICAgICAqIERpY3Rpb25hcnkgb2YgYWxsIGNvbnRyb2wgcGFyYW1ldGVycy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5wYXJhbXMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIHBhcmFtZXRlciBkYXRhIGNlbGxzLlxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICB0aGlzLl9wYXJhbURhdGEgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmljIG1ldGhvZCB0byBjcmVhdGUgc2hhcmVkIHBhcmFtZXRlcnMgZnJvbSBhbiBhcnJheSBvZiBkZWZpbml0aW9ucy5cbiAgICogQSBkZWZpbml0aW9uIGlzIGFuIG9iamVjdCB3aXRoIGEgJ3R5cGUnIHByb3BlcnR5XG4gICAqICgnYm9vbGVhbicgfMKgJ2VudW0nIHzCoCdudW1iZXInIHzCoCd0ZXh0JyB8wqAndHJpZ2dlcicpIGEgc2V0IG9mIHByb3BlcnRpZXNcbiAgICogY29ycmVzcG9uZGluZyB0byB0aGUgYXJndW1lbnQgb2YgdGhlIGNvcnJlc3BvbmRpbmcgYWRkPFR5cGU+IG1ldGhvZC5cbiAgICogQHNlZSB7QGxpbmsgU2hhcmVkUGFyYW1zI2FkZEJvb2xlYW59XG4gICAqIEBzZWUge0BsaW5rIFNoYXJlZFBhcmFtcyNhZGRFbnVtfVxuICAgKiBAc2VlIHtAbGluayBTaGFyZWRQYXJhbXMjYWRkTnVtYmVyfVxuICAgKiBAc2VlIHtAbGluayBTaGFyZWRQYXJhbXMjYWRkVGV4dH1cbiAgICogQHNlZSB7QGxpbmsgU2hhcmVkUGFyYW1zI2FkZFRyaWdnZXJ9XG4gICAqIEBwYXJhbSB7QXJyYXl9IGRlZmluaXRpb25zIC0gQW4gYXJyYXkgb2YgcGFyYW1ldGVyIGRlZmluaXRpb25zLlxuICAgKi9cbiAgYWRkKGRlZmluaXRpb25zKSB7XG4gICAgZm9yIChsZXQgZGVmIG9mIGRlZmluaXRpb25zKSB7XG4gICAgICBsZXQgdHlwZSA9IGRlZi50eXBlIHx8ICd0ZXh0JztcblxuICAgICAgc3dpdGNoKHR5cGUpIHtcbiAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgdGhpcy5hZGRCb29sZWFuKGRlZi5uYW1lLCBkZWYubGFiZWwsIGRlZi52YWx1ZSwgZGVmLmNsaWVudFR5cGVzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZW51bSc6XG4gICAgICAgICAgdGhpcy5hZGRFbnVtKGRlZi5uYW1lLCBkZWYubGFiZWwsIGRlZi5vcHRpb25zLCBkZWYudmFsdWUsIGRlZi5jbGllbnRUeXBlcyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgdGhpcy5hZGROdW1iZXIoZGVmLm5hbWUsIGRlZi5sYWJlbCwgZGVmLm1pbiwgZGVmLm1heCwgZGVmLnN0ZXAsIGRlZi52YWx1ZSwgZGVmLmNsaWVudFR5cGVzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgdGhpcy5hZGRUZXh0KGRlZi5uYW1lLCBkZWYubGFiZWwsIGRlZi52YWx1ZSwgZGVmLmNsaWVudFR5cGVzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndHJpZ2dlcic6XG4gICAgICAgICAgdGhpcy5hZGRUcmlnZ2VyKGRlZi5uYW1lLCBkZWYubGFiZWwsIGRlZi5jbGllbnRUeXBlcyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGBib29sZWFuYCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2xcbiAgICogIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciAoYHRydWVgIG9yIGBmYWxzZWApLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gLSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmRcbiAgICogIHRoZSBwYXJhbWV0ZXIgdmFsdWUgdG8uIElmIG5vdCBzZXQsIHRoZSB2YWx1ZSBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkQm9vbGVhbihuYW1lLCBsYWJlbCwgdmFsdWUsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX0Jvb2xlYW5JdGVtKHRoaXMsIG5hbWUsIGxhYmVsLCB2YWx1ZSwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBgZW51bWAgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sXG4gICAqICBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gb3B0aW9ucyAtIERpZmZlcmVudCBwb3NzaWJsZSB2YWx1ZXMgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIC0gSW5pdGlhbCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyIChtdXN0IGJlIGRlZmluZWQgaW4gYG9wdGlvbnNgKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kXG4gICAqICB0aGUgcGFyYW1ldGVyIHZhbHVlIHRvLiBJZiBub3Qgc2V0LCB0aGUgdmFsdWUgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZEVudW0obmFtZSwgbGFiZWwsIG9wdGlvbnMsIHZhbHVlLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IF9FbnVtSXRlbSh0aGlzLCBuYW1lLCBsYWJlbCwgb3B0aW9ucywgdmFsdWUsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBgbnVtYmVyYCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2xcbiAgICogIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbWluIC0gTWluaW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbWF4IC0gTWF4aW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc3RlcCAtIFN0ZXAgYnkgd2hpY2ggdGhlIHBhcmFtZXRlciB2YWx1ZSBpcyBpbmNyZWFzZWQgb3IgZGVjcmVhc2VkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgLSBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSAtIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZFxuICAgKiAgdGhlIHBhcmFtZXRlciB2YWx1ZSB0by4gSWYgbm90IHNldCwgdGhlIHZhbHVlIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGROdW1iZXIobmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCB2YWx1ZSwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBfTnVtYmVySXRlbSh0aGlzLCBuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIHZhbHVlLCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgYHRleHRgIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbFxuICAgKiAgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kXG4gICAqICB0aGUgcGFyYW1ldGVyIHZhbHVlIHRvLiBJZiBub3Qgc2V0LCB0aGUgdmFsdWUgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZFRleHQobmFtZSwgbGFiZWwsIHZhbHVlLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IF9UZXh0SXRlbSh0aGlzLCBuYW1lLCBsYWJlbCwgdmFsdWUsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSB0cmlnZ2VyIChub3QgcmVhbGx5IGEgcGFyYW1ldGVyKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0cmlnZ2VyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBMYWJlbCBvZiB0aGUgdHJpZ2dlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sXG4gICAqICBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kXG4gICAqICB0aGUgdHJpZ2dlciB0by4gSWYgbm90IHNldCwgdGhlIHZhbHVlIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGRUcmlnZ2VyKG5hbWUsIGxhYmVsLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IF9UcmlnZ2VySXRlbSh0aGlzLCBuYW1lLCBsYWJlbCwgdW5kZWZpbmVkLCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5TaGFyZWRQYXJhbXN+cGFyYW1DYWxsYmFja1xuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAtIFVwZGF0ZWQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIC8qKlxuICAgKiBBZGQgYSBsaXN0ZW5lciB0byBsaXN0ZW4gYSBzcGVjaWZpYyBwYXJhbWV0ZXIgY2hhbmdlcy4gVGhlIGxpc3RlbmVyIGlzIGNhbGxlZCBhIGZpcnN0XG4gICAqIHRpbWUgd2hlbiBhZGRlZCB0byByZXRyaWV2ZSB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuU2hhcmVkUGFyYW1zfnBhcmFtQ2FsbGJhY2t9IGxpc3RlbmVyIC0gQ2FsbGJhY2tcbiAgICogIHRoYXQgaGFuZGxlIHRoZSBldmVudC5cbiAgICovXG4gIGFkZFBhcmFtTGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBwYXJhbSA9IHRoaXMucGFyYW1zW25hbWVdO1xuXG4gICAgaWYgKHBhcmFtKSB7XG4gICAgICBwYXJhbS5hZGRMaXN0ZW5lcihwYXJhbS5kYXRhLm5hbWUsIGxpc3RlbmVyKTtcbiAgICAgIGxpc3RlbmVyKHBhcmFtLmRhdGEudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBzaGFyZWQgcGFyYW1ldGVyIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGlzdGVuZXIgZnJvbSBsaXN0ZW5pbmcgYSBzcGVjaWZpYyBwYXJhbWV0ZXIgY2hhbmdlcy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkUGFyYW1zfnBhcmFtQ2FsbGJhY2t9IGxpc3RlbmVyIC0gVGhlXG4gICAqICBjYWxsYmFjayB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVQYXJhbUxpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgcGFyYW0gPSB0aGlzLnBhcmFtc1tuYW1lXTtcblxuICAgIGlmIChwYXJhbSlcbiAgICAgIHBhcmFtLnJlbW92ZUxpc3RlbmVyKHBhcmFtLmRhdGEubmFtZSwgbGlzdGVuZXIpO1xuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHNoYXJlZCBwYXJhbWV0ZXIgXCInICsgbmFtZSArICdcIicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHZhbHVlIG9mIGEgcGFyYW1ldGVyIGFuZCBzZW5kcyBpdCB0byB0aGUgY2xpZW50cy5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAtIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2V4Y2x1ZGVDbGllbnQ9bnVsbF0gLSBFeGNsdWRlIHRoZSBnaXZlbiBjbGllbnQgZnJvbSB0aGVcbiAgICogIGNsaWVudHMgdG8gc2VuZCB0aGUgdXBkYXRlIHRvIChnZW5lcmFsbHkgdGhlIHNvdXJjZSBvZiB0aGUgdXBkYXRlKS5cbiAgICovXG4gIHVwZGF0ZShuYW1lLCB2YWx1ZSwgZXhjbHVkZUNsaWVudCA9IG51bGwpIHtcbiAgICBjb25zdCBwYXJhbSA9IHRoaXMucGFyYW1zW25hbWVdO1xuXG4gICAgaWYgKHBhcmFtKVxuICAgICAgcGFyYW0udXBkYXRlKHZhbHVlLCBleGNsdWRlQ2xpZW50KTtcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBzaGFyZWQgcGFyYW1ldGVyICBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAndXBkYXRlJywgdGhpcy5fb25VcGRhdGUoY2xpZW50KSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKCkgPT4gdGhpcy5zZW5kKGNsaWVudCwgJ2luaXQnLCB0aGlzLl9wYXJhbURhdGEpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblVwZGF0ZShjbGllbnQpIHtcbiAgICAvLyB1cGRhdGUsIGJ1dCBleGNsdWRlIGNsaWVudCBmcm9tIGJyb2FkY2FzdGluZyB0byBvdGhlciBjbGllbnRzXG4gICAgcmV0dXJuIChuYW1lLCB2YWx1ZSkgPT4gdGhpcy51cGRhdGUobmFtZSwgdmFsdWUsIGNsaWVudCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2hhcmVkUGFyYW1zKTtcblxuZXhwb3J0IGRlZmF1bHQgU2hhcmVkUGFyYW1zO1xuIl19