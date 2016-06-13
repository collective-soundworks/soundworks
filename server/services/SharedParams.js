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
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, SharedParams);

exports.default = SharedParams;
//# sourceMappingURL=data:application/json;base64,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O0FBQUEsT0FBUDtBQUNEOzs7Ozs7OEJBR1MsTSxFQUFRO0FBQUE7OztBQUVoQixhQUFPLFVBQUMsSUFBRCxFQUFPLEtBQVA7QUFBQSxlQUFpQixPQUFLLE1BQUwsQ0FBWSxJQUFaLEVBQWtCLEtBQWxCLEVBQXlCLE1BQXpCLENBQWpCO0FBQUEsT0FBUDtBQUNEOzs7OztBQUdILHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsWUFBcEM7O2tCQUVlLFkiLCJmaWxlIjoiU2hhcmVkUGFyYW1zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0NvbnRyb2xJdGVtIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgdHlwZSwgbmFtZSwgbGFiZWwsIGluaXQgPSB1bmRlZmluZWQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2wgPSBjb250cm9sO1xuICAgIHRoaXMuY2xpZW50VHlwZXMgPSBjbGllbnRUeXBlcztcblxuICAgIHRoaXMuZGF0YSA9IHtcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgdmFsdWU6IGluaXQsXG4gICAgfTtcblxuICAgIGNvbnRyb2wucGFyYW1zW25hbWVdID0gdGhpcztcbiAgICBjb250cm9sLl9wYXJhbURhdGEucHVzaCh0aGlzLmRhdGEpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IHZhbDtcbiAgfVxuXG4gIHVwZGF0ZSh2YWwgPSB1bmRlZmluZWQsIGV4Y2x1ZGVDbGllbnQgPSBudWxsKSB7XG4gICAgbGV0IGNvbnRyb2wgPSB0aGlzLmNvbnRyb2w7XG4gICAgbGV0IGRhdGEgPSB0aGlzLmRhdGE7XG5cbiAgICB0aGlzLnNldCh2YWwpOyAvLyBzZXQgdmFsdWVcbiAgICB0aGlzLmVtaXQoZGF0YS5uYW1lLCBkYXRhLnZhbHVlKTsgLy8gY2FsbCBwYXJhbSBsaXN0ZW5lcnNcbiAgICBjb250cm9sLmJyb2FkY2FzdCh0aGlzLmNsaWVudFR5cGVzLCBleGNsdWRlQ2xpZW50LCAndXBkYXRlJywgZGF0YS5uYW1lLCBkYXRhLnZhbHVlKTsgLy8gc2VuZCB0byBjbGllbnRzXG4gICAgY29udHJvbC5lbWl0KCd1cGRhdGUnLCBkYXRhLm5hbWUsIGRhdGEudmFsdWUpOyAvLyBjYWxsIGNvbnRyb2wgbGlzdGVuZXJzXG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQm9vbGVhbkl0ZW0gZXh0ZW5kcyBfQ29udHJvbEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2Jvb2xlYW4nLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9FbnVtSXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcihjb250cm9sLCAnZW51bScsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyk7XG5cbiAgICB0aGlzLmRhdGEub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgbGV0IGRhdGEgPSB0aGlzLmRhdGE7XG4gICAgbGV0IGluZGV4ID0gZGF0YS5vcHRpb25zLmluZGV4T2YodmFsKTtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBkYXRhLnZhbHVlID0gdmFsO1xuICAgICAgZGF0YS5pbmRleCA9IGluZGV4O1xuICAgIH1cbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9OdW1iZXJJdGVtIGV4dGVuZHMgX0NvbnRyb2xJdGVtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcihjb250cm9sLCAnbnVtYmVyJywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcblxuICAgIGxldCBkYXRhID0gdGhpcy5kYXRhO1xuICAgIGRhdGEubWluID0gbWluO1xuICAgIGRhdGEubWF4ID0gbWF4O1xuICAgIGRhdGEuc3RlcCA9IHN0ZXA7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5kYXRhLnZhbHVlID0gTWF0aC5taW4odGhpcy5kYXRhLm1heCwgTWF0aC5tYXgodGhpcy5kYXRhLm1pbiwgdmFsKSk7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfVGV4dEl0ZW0gZXh0ZW5kcyBfQ29udHJvbEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3RleHQnLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuZGF0YS52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UcmlnZ2VySXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcihjb250cm9sLCAndHJpZ2dlcicsIG5hbWUsIGxhYmVsLCB1bmRlZmluZWQsIGNsaWVudFR5cGVzKTtcbiAgfVxufVxuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzaGFyZWQtcGFyYW1zJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdzaGFyZWQtcGFyYW1zJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgYWxsb3dzIHRvIGNyZWF0ZSBzaGFyZWQgcGFyYW1ldGVycyBhbW9uZyBhIGRpc3RyaWJ1dGVkXG4gKiBhcHBsaWNhdGlvbi4gRWFjaCBzaGFyZWQgcGFyYW1ldGVyIGNhbiBiZSBvZiB0aGUgZm9sbG93aW5nIGRhdGEgdHlwZXM6XG4gKiAtIGJvb2xlYW5cbiAqIC0gZW51bVxuICogLSBudW1iZXJcbiAqIC0gdGV4dFxuICogLSB0cmlnZ2VyLFxuICpcbiAqIGNvbmZpZ3VyZWQgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLCBhbmQgYm91bmRlZCB0byBzcGVjaWZpYyB0eXBlIG9mIGNsaWVudHMuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtjbGllbnQtc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNoYXJlZFBhcmFtc30qX19cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogLy8gY3JlYXRlIGEgYm9vbGVhbiBzaGFyZWQgcGFyYW1ldGVyIHdpdGggZGVmYXVsdCB2YWx1ZSB0byBgZmFsc2VgLFxuICogLy8gaW5zaWRlIHRoZSBzZXJ2ZXIgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5zaGFyZWRQYXJhbXMgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAqIHRoaXMuc2hhcmVkUGFyYW1zLmFkZEJvb2xlYW4oJ215OmJvb2xlYW4nLCAnTXlCb29sZWFuJywgZmFsc2UpO1xuICovXG5jbGFzcyBTaGFyZWRQYXJhbXMgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIC8qKlxuICAgICAqIERpY3Rpb25hcnkgb2YgYWxsIGNvbnRyb2wgcGFyYW1ldGVycy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5wYXJhbXMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIHBhcmFtZXRlciBkYXRhIGNlbGxzLlxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICB0aGlzLl9wYXJhbURhdGEgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmljIG1ldGhvZCB0byBjcmVhdGUgc2hhcmVkIHBhcmFtZXRlcnMgZnJvbSBhbiBhcnJheSBvZiBkZWZpbml0aW9ucy5cbiAgICogQSBkZWZpbml0aW9uIGlzIGFuIG9iamVjdCB3aXRoIGEgJ3R5cGUnIHByb3BlcnR5XG4gICAqICgnYm9vbGVhbicgfMKgJ2VudW0nIHzCoCdudW1iZXInIHzCoCd0ZXh0JyB8wqAndHJpZ2dlcicpIGFuZCBhIHNldCBvZiBwcm9wZXJ0aWVzXG4gICAqIG1hdGNoaW5nIHRoZSBhcmd1bWVudHMgb2YgdGhlIGNvcnJlc3BvbmRpbmcgYGFkZCR7dHlwZX1gIG1ldGhvZC5cbiAgICogQHNlZSB7QGxpbmsgU2hhcmVkUGFyYW1zI2FkZEJvb2xlYW59XG4gICAqIEBzZWUge0BsaW5rIFNoYXJlZFBhcmFtcyNhZGRFbnVtfVxuICAgKiBAc2VlIHtAbGluayBTaGFyZWRQYXJhbXMjYWRkTnVtYmVyfVxuICAgKiBAc2VlIHtAbGluayBTaGFyZWRQYXJhbXMjYWRkVGV4dH1cbiAgICogQHNlZSB7QGxpbmsgU2hhcmVkUGFyYW1zI2FkZFRyaWdnZXJ9XG4gICAqIEBwYXJhbSB7QXJyYXl9IGRlZmluaXRpb25zIC0gQW4gYXJyYXkgb2YgcGFyYW1ldGVyIGRlZmluaXRpb25zLlxuICAgKi9cbiAgYWRkKGRlZmluaXRpb25zKSB7XG4gICAgZm9yIChsZXQgZGVmIG9mIGRlZmluaXRpb25zKSB7XG4gICAgICBsZXQgdHlwZSA9IGRlZi50eXBlIHx8ICd0ZXh0JztcblxuICAgICAgc3dpdGNoKHR5cGUpIHtcbiAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgdGhpcy5hZGRCb29sZWFuKGRlZi5uYW1lLCBkZWYubGFiZWwsIGRlZi52YWx1ZSwgZGVmLmNsaWVudFR5cGVzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZW51bSc6XG4gICAgICAgICAgdGhpcy5hZGRFbnVtKGRlZi5uYW1lLCBkZWYubGFiZWwsIGRlZi5vcHRpb25zLCBkZWYudmFsdWUsIGRlZi5jbGllbnRUeXBlcyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgdGhpcy5hZGROdW1iZXIoZGVmLm5hbWUsIGRlZi5sYWJlbCwgZGVmLm1pbiwgZGVmLm1heCwgZGVmLnN0ZXAsIGRlZi52YWx1ZSwgZGVmLmNsaWVudFR5cGVzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgdGhpcy5hZGRUZXh0KGRlZi5uYW1lLCBkZWYubGFiZWwsIGRlZi52YWx1ZSwgZGVmLmNsaWVudFR5cGVzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndHJpZ2dlcic6XG4gICAgICAgICAgdGhpcy5hZGRUcmlnZ2VyKGRlZi5uYW1lLCBkZWYubGFiZWwsIGRlZi5jbGllbnRUeXBlcyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGBib29sZWFuYCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2xcbiAgICogIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciAoYHRydWVgIG9yIGBmYWxzZWApLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gLSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmRcbiAgICogIHRoZSBwYXJhbWV0ZXIgdmFsdWUgdG8uIElmIG5vdCBzZXQsIHRoZSB2YWx1ZSBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkQm9vbGVhbihuYW1lLCBsYWJlbCwgdmFsdWUsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX0Jvb2xlYW5JdGVtKHRoaXMsIG5hbWUsIGxhYmVsLCB2YWx1ZSwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBgZW51bWAgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sXG4gICAqICBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gb3B0aW9ucyAtIERpZmZlcmVudCBwb3NzaWJsZSB2YWx1ZXMgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIC0gSW5pdGlhbCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyIChtdXN0IGJlIGRlZmluZWQgaW4gYG9wdGlvbnNgKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kXG4gICAqICB0aGUgcGFyYW1ldGVyIHZhbHVlIHRvLiBJZiBub3Qgc2V0LCB0aGUgdmFsdWUgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZEVudW0obmFtZSwgbGFiZWwsIG9wdGlvbnMsIHZhbHVlLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IF9FbnVtSXRlbSh0aGlzLCBuYW1lLCBsYWJlbCwgb3B0aW9ucywgdmFsdWUsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBgbnVtYmVyYCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2xcbiAgICogIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbWluIC0gTWluaW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbWF4IC0gTWF4aW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc3RlcCAtIFN0ZXAgYnkgd2hpY2ggdGhlIHBhcmFtZXRlciB2YWx1ZSBpcyBpbmNyZWFzZWQgb3IgZGVjcmVhc2VkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgLSBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSAtIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZFxuICAgKiAgdGhlIHBhcmFtZXRlciB2YWx1ZSB0by4gSWYgbm90IHNldCwgdGhlIHZhbHVlIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGROdW1iZXIobmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCB2YWx1ZSwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBfTnVtYmVySXRlbSh0aGlzLCBuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIHZhbHVlLCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgYHRleHRgIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbFxuICAgKiAgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kXG4gICAqICB0aGUgcGFyYW1ldGVyIHZhbHVlIHRvLiBJZiBub3Qgc2V0LCB0aGUgdmFsdWUgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZFRleHQobmFtZSwgbGFiZWwsIHZhbHVlLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IF9UZXh0SXRlbSh0aGlzLCBuYW1lLCBsYWJlbCwgdmFsdWUsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSB0cmlnZ2VyIChub3QgcmVhbGx5IGEgcGFyYW1ldGVyKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0cmlnZ2VyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBMYWJlbCBvZiB0aGUgdHJpZ2dlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sXG4gICAqICBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kXG4gICAqICB0aGUgdHJpZ2dlciB0by4gSWYgbm90IHNldCwgdGhlIHZhbHVlIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGRUcmlnZ2VyKG5hbWUsIGxhYmVsLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IF9UcmlnZ2VySXRlbSh0aGlzLCBuYW1lLCBsYWJlbCwgdW5kZWZpbmVkLCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5TaGFyZWRQYXJhbXN+cGFyYW1DYWxsYmFja1xuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAtIFVwZGF0ZWQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIC8qKlxuICAgKiBBZGQgYSBsaXN0ZW5lciB0byBsaXN0ZW4gdG8gYSBzcGVjaWZpYyBwYXJhbWV0ZXIgY2hhbmdlcy4gVGhlIGxpc3RlbmVyXG4gICAqIGlzIGNhbGxlZCBhIGZpcnN0IHRpbWUgd2hlbiBhZGRlZCB0byByZXRyaWV2ZSB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuU2hhcmVkUGFyYW1zfnBhcmFtQ2FsbGJhY2t9IGxpc3RlbmVyIC0gQ2FsbGJhY2tcbiAgICogIHRoYXQgaGFuZGxlIHRoZSBldmVudC5cbiAgICovXG4gIGFkZFBhcmFtTGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBwYXJhbSA9IHRoaXMucGFyYW1zW25hbWVdO1xuXG4gICAgaWYgKHBhcmFtKSB7XG4gICAgICBwYXJhbS5hZGRMaXN0ZW5lcihwYXJhbS5kYXRhLm5hbWUsIGxpc3RlbmVyKTtcblxuICAgICAgaWYgKHBhcmFtLmRhdGEudHlwZSAhPT0gJ3RyaWdnZXInKVxuICAgICAgICBsaXN0ZW5lcihwYXJhbS5kYXRhLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gc2hhcmVkIHBhcmFtZXRlciBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyIGZyb20gbGlzdGVuaW5nIHRvIGEgc3BlY2lmaWMgcGFyYW1ldGVyIGNoYW5nZXMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNoYXJlZFBhcmFtc35wYXJhbUNhbGxiYWNrfSBsaXN0ZW5lciAtIFRoZVxuICAgKiAgY2FsbGJhY2sgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlUGFyYW1MaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IHBhcmFtID0gdGhpcy5wYXJhbXNbbmFtZV07XG5cbiAgICBpZiAocGFyYW0pXG4gICAgICBwYXJhbS5yZW1vdmVMaXN0ZW5lcihwYXJhbS5kYXRhLm5hbWUsIGxpc3RlbmVyKTtcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBzaGFyZWQgcGFyYW1ldGVyIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB2YWx1ZSBvZiBhIHBhcmFtZXRlciBhbmQgc2VuZHMgaXQgdG8gdGhlIGNsaWVudHMuXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgLSBOZXcgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtleGNsdWRlQ2xpZW50PW51bGxdIC0gRXhjbHVkZSB0aGUgZ2l2ZW4gY2xpZW50IGZyb20gdGhlXG4gICAqICBjbGllbnRzIHRvIHNlbmQgdGhlIHVwZGF0ZSB0byAoZ2VuZXJhbGx5IHRoZSBzb3VyY2Ugb2YgdGhlIHVwZGF0ZSkuXG4gICAqL1xuICB1cGRhdGUobmFtZSwgdmFsdWUsIGV4Y2x1ZGVDbGllbnQgPSBudWxsKSB7XG4gICAgY29uc3QgcGFyYW0gPSB0aGlzLnBhcmFtc1tuYW1lXTtcblxuICAgIGlmIChwYXJhbSlcbiAgICAgIHBhcmFtLnVwZGF0ZSh2YWx1ZSwgZXhjbHVkZUNsaWVudCk7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gc2hhcmVkIHBhcmFtZXRlciAgXCInICsgbmFtZSArICdcIicpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3VwZGF0ZScsIHRoaXMuX29uVXBkYXRlKGNsaWVudCkpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICgpID0+IHRoaXMuc2VuZChjbGllbnQsICdpbml0JywgdGhpcy5fcGFyYW1EYXRhKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25VcGRhdGUoY2xpZW50KSB7XG4gICAgLy8gdXBkYXRlLCBidXQgZXhjbHVkZSBjbGllbnQgZnJvbSBicm9hZGNhc3RpbmcgdG8gb3RoZXIgY2xpZW50c1xuICAgIHJldHVybiAobmFtZSwgdmFsdWUpID0+IHRoaXMudXBkYXRlKG5hbWUsIHZhbHVlLCBjbGllbnQpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNoYXJlZFBhcmFtcyk7XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXJlZFBhcmFtcztcbiJdfQ==