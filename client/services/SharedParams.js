'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _wavesBasicControllers = require('waves-basic-controllers');

var _wavesBasicControllers2 = _interopRequireDefault(_wavesBasicControllers);

var _events = require('events');

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_wavesBasicControllers2.default.disableStyles();

/* --------------------------------------------------------- */
/* CONTROL UNITS
/* --------------------------------------------------------- */

/** @private */

var _ControlItem = function (_EventEmitter) {
  (0, _inherits3.default)(_ControlItem, _EventEmitter);

  function _ControlItem(control, type, name, label) {
    (0, _classCallCheck3.default)(this, _ControlItem);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_ControlItem).call(this));

    _this.control = control;
    _this.type = type;
    _this.name = name;
    _this.label = label;
    _this.value = undefined;
    return _this;
  }

  (0, _createClass3.default)(_ControlItem, [{
    key: 'set',
    value: function set(val) {
      this.value = value;
    }
  }, {
    key: '_propagate',
    value: function _propagate() {
      var sendToServer = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this.emit('update', this.value); // call event listeners

      if (sendToServer) this.control.send('update', this.name, this.value); // send to server

      this.control.emit('update', this.name, this.value); // call control listeners
    }
  }, {
    key: 'update',
    value: function update(val) {
      var sendToServer = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      this.set(val);
      this._propagate(sendToServer);
    }
  }]);
  return _ControlItem;
}(_events.EventEmitter);

/** @private */


var _BooleanItem = function (_ControlItem2) {
  (0, _inherits3.default)(_BooleanItem, _ControlItem2);

  function _BooleanItem(control, name, label, init) {
    (0, _classCallCheck3.default)(this, _BooleanItem);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_BooleanItem).call(this, control, 'boolean', name, label));

    _this2.set(init);
    return _this2;
  }

  (0, _createClass3.default)(_BooleanItem, [{
    key: 'set',
    value: function set(val) {
      this.value = val;
    }
  }]);
  return _BooleanItem;
}(_ControlItem);

/** @private */


var _EnumItem = function (_ControlItem3) {
  (0, _inherits3.default)(_EnumItem, _ControlItem3);

  function _EnumItem(control, name, label, options, init) {
    (0, _classCallCheck3.default)(this, _EnumItem);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_EnumItem).call(this, control, 'enum', name, label));

    _this3.options = options;
    _this3.set(init);
    return _this3;
  }

  (0, _createClass3.default)(_EnumItem, [{
    key: 'set',
    value: function set(val) {
      var index = this.options.indexOf(val);

      if (index >= 0) {
        this.index = index;
        this.value = val;
      }
    }
  }]);
  return _EnumItem;
}(_ControlItem);

/** @private */


var _NumberItem = function (_ControlItem4) {
  (0, _inherits3.default)(_NumberItem, _ControlItem4);

  function _NumberItem(control, name, label, min, max, step, init) {
    (0, _classCallCheck3.default)(this, _NumberItem);

    var _this4 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_NumberItem).call(this, control, 'number', name, label));

    _this4.min = min;
    _this4.max = max;
    _this4.step = step;
    _this4.set(init);
    return _this4;
  }

  (0, _createClass3.default)(_NumberItem, [{
    key: 'set',
    value: function set(val) {
      this.value = Math.min(this.max, Math.max(this.min, val));
    }
  }]);
  return _NumberItem;
}(_ControlItem);

/** @private */


var _TextItem = function (_ControlItem5) {
  (0, _inherits3.default)(_TextItem, _ControlItem5);

  function _TextItem(control, name, label, init) {
    (0, _classCallCheck3.default)(this, _TextItem);

    var _this5 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_TextItem).call(this, control, 'text', name, label));

    _this5.set(init);
    return _this5;
  }

  (0, _createClass3.default)(_TextItem, [{
    key: 'set',
    value: function set(val) {
      this.value = val;
    }
  }]);
  return _TextItem;
}(_ControlItem);

/** @private */


var _TriggerItem = function (_ControlItem6) {
  (0, _inherits3.default)(_TriggerItem, _ControlItem6);

  function _TriggerItem(control, name, label) {
    (0, _classCallCheck3.default)(this, _TriggerItem);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_TriggerItem).call(this, control, 'trigger', name, label));
  }

  (0, _createClass3.default)(_TriggerItem, [{
    key: 'set',
    value: function set(val) {/* nothing to set here */}
  }]);
  return _TriggerItem;
}(_ControlItem);

/* --------------------------------------------------------- */
/* GUIs
/* --------------------------------------------------------- */

/** @private */


var _BooleanGui = function () {
  function _BooleanGui($container, item, guiOptions) {
    (0, _classCallCheck3.default)(this, _BooleanGui);
    var label = item.label;
    var value = item.value;


    this.controller = new _wavesBasicControllers2.default.Toggle(label, value);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', function (value) {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + item.name + ':' + value + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      item.update(value);
    });
  }

  (0, _createClass3.default)(_BooleanGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);
  return _BooleanGui;
}();

/** @private */


var _EnumGui = function () {
  function _EnumGui($container, item, guiOptions) {
    (0, _classCallCheck3.default)(this, _EnumGui);
    var label = item.label;
    var options = item.options;
    var value = item.value;


    var ctor = guiOptions.type === 'buttons' ? _wavesBasicControllers2.default.SelectButtons : _wavesBasicControllers2.default.SelectList;

    this.controller = new ctor(label, options, value);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', function (value) {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + item.name + ':' + value + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      item.update(value);
    });
  }

  (0, _createClass3.default)(_EnumGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);
  return _EnumGui;
}();

/** @private */


var _NumberGui = function () {
  function _NumberGui($container, item, guiOptions) {
    (0, _classCallCheck3.default)(this, _NumberGui);
    var label = item.label;
    var min = item.min;
    var max = item.max;
    var step = item.step;
    var value = item.value;


    if (guiOptions.type === 'slider') this.controller = new _wavesBasicControllers2.default.Slider(label, min, max, step, value, guiOptions.item, guiOptions.size);else this.controller = new _wavesBasicControllers2.default.NumberBox(label, min, max, step, value);

    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', function (value) {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + item.name + ':' + value + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      item.update(value);
    });
  }

  (0, _createClass3.default)(_NumberGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);
  return _NumberGui;
}();

/** @private */


var _TextGui = function () {
  function _TextGui($container, item, guiOptions) {
    (0, _classCallCheck3.default)(this, _TextGui);
    var label = item.label;
    var value = item.value;


    this.controller = new _wavesBasicControllers2.default.Text(label, value, guiOptions.readOnly);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    if (!guiOptions.readOnly) {
      this.controller.on('change', function () {
        if (guiOptions.confirm) {
          var msg = 'Are you sure you want to propagate "' + item.name + '"';
          if (!window.confirm(msg)) {
            return;
          }
        }

        item.update();
      });
    }
  }

  (0, _createClass3.default)(_TextGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);
  return _TextGui;
}();

/** @private */


var _TriggerGui = function () {
  function _TriggerGui($container, item, guiOptions) {
    (0, _classCallCheck3.default)(this, _TriggerGui);
    var label = item.label;


    this.controller = new _wavesBasicControllers2.default.Buttons('', [label]);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', function () {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + item.name + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      item.update();
    });
  }

  (0, _createClass3.default)(_TriggerGui, [{
    key: 'set',
    value: function set(val) {/* nothing to set here */}
  }]);
  return _TriggerGui;
}();

var SERVICE_ID = 'service:shared-params';

/**
 * Manage the global control `parameters`, `infos`, and `commands` across the whole scenario.
 *
 * The service keeps track of:
 * - `parameters`: values that can be updated by the actions of the clients (*e.g.* the gain of a synth);
 * - `infos`: information about the state of the scenario (*e.g.* number of clients in the performance);
 * - `commands`: can trigger an action (*e.g.* reload the page).
 *
 * If the service is instantiated with the `gui` option set to `true`, it constructs a graphical interface to modify the parameters, view the infos, and trigger the commands.
 * Otherwise (`gui` option set to `false`) the service emits an event when it receives updated values from the server.
 *
 * When the GUI is disabled, the service finishes its initialization immediately after having set up the controls.
 * Otherwise (GUI enabled), the service remains in its state and never finishes its initialization.
 *
 * When the service a view (`gui` option set to `true`), it requires the SASS partial `_77-checkin.scss`.
 *
 * @example // Example 1: make a client that displays the control GUI
 * const control = new SharedParams();
 *
 * // Initialize the client (indicate the client type)
 * client.init('conductor'); // accessible at the URL /conductor
 *
 * // Start the scenario
 * // For this client type (`'conductor'`), there is only one service
 * client.start(control);
 *
 * @example // Example 2: listen for parameter, infos & commands updates
 * const control = new SharedParams({ gui: false });
 *
 * // Listen for parameter, infos or command updates
 * control.on('update', (name, value) => {
 *   switch(name) {
 *     case 'synth:gain':
 *       console.log(`Update the synth gain to value #{value}.`);
 *       break;
 *     case 'reload':
 *       window.location.reload(true);
 *       break;
 *   }
 * });
 *
 * // Get current value of a parameter or info
 * const currentSynthGainValue = control.event['synth:gain'].value;
 * const currentNumPlayersValue = control.event['numPlayers'].value;
 */

var SharedParams = function (_Service) {
  (0, _inherits3.default)(SharedParams, _Service);

  /**
   * @emits {'update'} when the server sends an update. The callback function takes `name:String` and `value:*` as arguments, where `name` is the name of the parameter / info / command, and `value` its new value.
   */

  function SharedParams() {
    (0, _classCallCheck3.default)(this, SharedParams);


    /**
     * @param {Object} [options={}] Options.
     * @param {Boolean} [options.hasGui=true] - Indicates whether to create the graphical user interface to control the parameters or not.
     */

    var _this7 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SharedParams).call(this, SERVICE_ID, true));

    var defaults = { hasGui: false };
    _this7.configure(defaults);

    /** @private */
    _this7._guiOptions = {};

    _this7._onInitResponse = _this7._onInitResponse.bind(_this7);
    _this7._onUpdateResponse = _this7._onUpdateResponse.bind(_this7);
    return _this7;
  }

  (0, _createClass3.default)(SharedParams, [{
    key: 'init',
    value: function init() {
      /**
       * Dictionary of all the parameters and commands.
       * @type {Object}
       */
      this.items = {};

      if (this.options.hasGui) this.view = this.createView();
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(SharedParams.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.send('request');

      this.receive('init', this._onInitResponse);
      this.receive('update', this._onUpdateResponse);

      // this.show();
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(SharedParams.prototype), 'stop', this).call(this);
      // don't remove 'update' listener, as the control is runnig as a background process
      this.removeListener('init', this._onInitResponse);
    }
  }, {
    key: '_onInitResponse',
    value: function _onInitResponse(config) {
      var _this8 = this;

      this.show();

      config.forEach(function (entry) {
        var item = _this8._createControlItem(entry);
        _this8.items[item.name] = item;

        if (_this8.view) _this8._createGui(_this8.view, item);
      });

      if (!this.options.hasGui) this.ready();
    }
  }, {
    key: '_onUpdateResponse',
    value: function _onUpdateResponse(name, val) {
      // update, but don't send back to server
      this.update(name, val, false);
    }

    /**
     * Adds a listener to a specific event (i.e. parameter, info or command).
     * @param {String} name Name of the event.
     * @param {Function} listener Listener callback.
     */

  }, {
    key: 'addItemListener',
    value: function addItemListener(name, listener) {
      var item = this.items[name];

      if (item) {
        item.addListener('update', listener);

        if (item.type !== 'command') listener(item.value);
      } else {
        console.log('unknown item "' + name + '"');
      }
    }

    /**
     * Removes a listener from a specific event (i.e. parameter, info or command).
     * @param {String} name Name of the event.
     * @param {Function} listener Listener callback.
     */

  }, {
    key: 'removeItemListener',
    value: function removeItemListener(name, listener) {
      var item = this.items[name];

      if (item) {
        item.removeListener('update', listener);
      } else {
        console.log('unknown item "' + name + '"');
      }
    }

    /**
     * Get the value of a given parameter.
     * @param {String} name - The name of the parameter.
     * @returns {Mixed} - The related value.
     */

  }, {
    key: 'getValue',
    value: function getValue(name) {
      return this.items[name].value;
    }

    /**
     * Updates the value of a parameter.
     * @param {String} name - Name of the parameter to update.
     * @param {(String|Number|Boolean)} val - New value of the parameter.
     * @param {Boolean} [sendToServer=true] - Flag whether the value is sent to the server.
     */

  }, {
    key: 'update',
    value: function update(name, val) {
      var sendToServer = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      var item = this.items[name];

      if (item) {
        item.update(val, sendToServer);
      } else {
        console.log('unknown control item "' + name + '"');
      }
    }
  }, {
    key: '_createControlItem',
    value: function _createControlItem(init) {
      var item = null;

      switch (init.type) {
        case 'boolean':
          item = new _BooleanItem(this, init.name, init.label, init.value);
          break;

        case 'enum':
          item = new _EnumItem(this, init.name, init.label, init.options, init.value);
          break;

        case 'number':
          item = new _NumberItem(this, init.name, init.label, init.min, init.max, init.step, init.value);
          break;

        case 'text':
          item = new _TextItem(this, init.name, init.label, init.value);
          break;

        case 'trigger':
          item = new _TriggerItem(this, init.name, init.label);
          break;
      }

      return item;
    }

    /**
     * Configure the GUI for a specific control item (e.g. if it should appear or not,
     * which type of GUI to use).
     * @param {String} name - The name of the `item` to configure.
     * @param {Object} options - The options to apply to configure the given `item`.
     * @param {String} options.type - The type of GUI to use.
     * @param {Boolean} [options.show=true] - Show the GUI for this `item` or not.
     * @param {Boolean} [options.confirm=false] - Ask for confirmation when the value changes.
     */

  }, {
    key: 'setGuiOptions',
    value: function setGuiOptions(name, options) {
      this._guiOptions[name] = options;
    }
  }, {
    key: '_createGui',
    value: function _createGui(view, item) {
      var config = (0, _assign2.default)({
        show: true,
        confirm: false
      }, this._guiOptions[item.name]);

      if (config.show === false) return null;

      var gui = null;
      var $container = this.view.$el;

      switch (item.type) {
        case 'boolean':
          gui = new _BooleanGui($container, item, config); // `Toggle`
          break;
        case 'enum':
          gui = new _EnumGui($container, item, config); // `SelectList` or `SelectButtons`
          break;
        case 'number':
          gui = new _NumberGui($container, item, config); // `NumberBox` or `Slider`
          break;
        case 'text':
          gui = new _TextGui($container, item, config); // `Text`
          break;
        case 'trigger':
          gui = new _TriggerGui($container, item, config);
          break;
      }

      item.addListener('update', function (val) {
        return gui.set(val);
      });

      return gui;
    }
  }]);
  return SharedParams;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, SharedParams);

exports.default = SharedParams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZFBhcmFtcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxnQ0FBaUIsYUFBakI7Ozs7Ozs7O0lBT007OztBQUNKLFdBREksWUFDSixDQUFZLE9BQVosRUFBcUIsSUFBckIsRUFBMkIsSUFBM0IsRUFBaUMsS0FBakMsRUFBd0M7d0NBRHBDLGNBQ29DOzs2RkFEcEMsMEJBQ29DOztBQUV0QyxVQUFLLE9BQUwsR0FBZSxPQUFmLENBRnNDO0FBR3RDLFVBQUssSUFBTCxHQUFZLElBQVosQ0FIc0M7QUFJdEMsVUFBSyxJQUFMLEdBQVksSUFBWixDQUpzQztBQUt0QyxVQUFLLEtBQUwsR0FBYSxLQUFiLENBTHNDO0FBTXRDLFVBQUssS0FBTCxHQUFhLFNBQWIsQ0FOc0M7O0dBQXhDOzs2QkFESTs7d0JBVUEsS0FBSztBQUNQLFdBQUssS0FBTCxHQUFhLEtBQWIsQ0FETzs7OztpQ0FJdUI7VUFBckIscUVBQWUsb0JBQU07O0FBQzlCLFdBQUssSUFBTCxDQUFVLFFBQVYsRUFBb0IsS0FBSyxLQUFMLENBQXBCOztBQUQ4QixVQUcxQixZQUFKLEVBQ0UsS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixRQUFsQixFQUE0QixLQUFLLElBQUwsRUFBVyxLQUFLLEtBQUwsQ0FBdkMsQ0FERjs7QUFIOEIsVUFNOUIsQ0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixRQUFsQixFQUE0QixLQUFLLElBQUwsRUFBVyxLQUFLLEtBQUwsQ0FBdkM7QUFOOEI7OzsyQkFTekIsS0FBMEI7VUFBckIscUVBQWUsb0JBQU07O0FBQy9CLFdBQUssR0FBTCxDQUFTLEdBQVQsRUFEK0I7QUFFL0IsV0FBSyxVQUFMLENBQWdCLFlBQWhCLEVBRitCOzs7U0F2QjdCOzs7Ozs7SUErQkE7OztBQUNKLFdBREksWUFDSixDQUFZLE9BQVosRUFBcUIsSUFBckIsRUFBMkIsS0FBM0IsRUFBa0MsSUFBbEMsRUFBd0M7d0NBRHBDLGNBQ29DOzs4RkFEcEMseUJBRUksU0FBUyxXQUFXLE1BQU0sUUFETTs7QUFFdEMsV0FBSyxHQUFMLENBQVMsSUFBVCxFQUZzQzs7R0FBeEM7OzZCQURJOzt3QkFNQSxLQUFLO0FBQ1AsV0FBSyxLQUFMLEdBQWEsR0FBYixDQURPOzs7U0FOTDtFQUFxQjs7Ozs7SUFZckI7OztBQUNKLFdBREksU0FDSixDQUFZLE9BQVosRUFBcUIsSUFBckIsRUFBMkIsS0FBM0IsRUFBa0MsT0FBbEMsRUFBMkMsSUFBM0MsRUFBaUQ7d0NBRDdDLFdBQzZDOzs4RkFEN0Msc0JBRUksU0FBUyxRQUFRLE1BQU0sUUFEa0I7O0FBRS9DLFdBQUssT0FBTCxHQUFlLE9BQWYsQ0FGK0M7QUFHL0MsV0FBSyxHQUFMLENBQVMsSUFBVCxFQUgrQzs7R0FBakQ7OzZCQURJOzt3QkFPQSxLQUFLO0FBQ1AsVUFBSSxRQUFRLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsR0FBckIsQ0FBUixDQURHOztBQUdQLFVBQUksU0FBUyxDQUFULEVBQVk7QUFDZCxhQUFLLEtBQUwsR0FBYSxLQUFiLENBRGM7QUFFZCxhQUFLLEtBQUwsR0FBYSxHQUFiLENBRmM7T0FBaEI7OztTQVZFO0VBQWtCOzs7OztJQWtCbEI7OztBQUNKLFdBREksV0FDSixDQUFZLE9BQVosRUFBcUIsSUFBckIsRUFBMkIsS0FBM0IsRUFBa0MsR0FBbEMsRUFBdUMsR0FBdkMsRUFBNEMsSUFBNUMsRUFBa0QsSUFBbEQsRUFBd0Q7d0NBRHBELGFBQ29EOzs4RkFEcEQsd0JBRUksU0FBUyxVQUFVLE1BQU0sUUFEdUI7O0FBRXRELFdBQUssR0FBTCxHQUFXLEdBQVgsQ0FGc0Q7QUFHdEQsV0FBSyxHQUFMLEdBQVcsR0FBWCxDQUhzRDtBQUl0RCxXQUFLLElBQUwsR0FBWSxJQUFaLENBSnNEO0FBS3RELFdBQUssR0FBTCxDQUFTLElBQVQsRUFMc0Q7O0dBQXhEOzs2QkFESTs7d0JBU0EsS0FBSztBQUNQLFdBQUssS0FBTCxHQUFhLEtBQUssR0FBTCxDQUFTLEtBQUssR0FBTCxFQUFVLEtBQUssR0FBTCxDQUFTLEtBQUssR0FBTCxFQUFVLEdBQW5CLENBQW5CLENBQWIsQ0FETzs7O1NBVEw7RUFBb0I7Ozs7O0lBZXBCOzs7QUFDSixXQURJLFNBQ0osQ0FBWSxPQUFaLEVBQXFCLElBQXJCLEVBQTJCLEtBQTNCLEVBQWtDLElBQWxDLEVBQXdDO3dDQURwQyxXQUNvQzs7OEZBRHBDLHNCQUVJLFNBQVMsUUFBUSxNQUFNLFFBRFM7O0FBRXRDLFdBQUssR0FBTCxDQUFTLElBQVQsRUFGc0M7O0dBQXhDOzs2QkFESTs7d0JBTUEsS0FBSztBQUNQLFdBQUssS0FBTCxHQUFhLEdBQWIsQ0FETzs7O1NBTkw7RUFBa0I7Ozs7O0lBWWxCOzs7QUFDSixXQURJLFlBQ0osQ0FBWSxPQUFaLEVBQXFCLElBQXJCLEVBQTJCLEtBQTNCLEVBQWtDO3dDQUQ5QixjQUM4Qjt3RkFEOUIseUJBRUksU0FBUyxXQUFXLE1BQU0sUUFEQTtHQUFsQzs7NkJBREk7O3dCQUtBLEtBQUs7O1NBTEw7RUFBcUI7Ozs7Ozs7OztJQWFyQjtBQUNKLFdBREksV0FDSixDQUFZLFVBQVosRUFBd0IsSUFBeEIsRUFBOEIsVUFBOUIsRUFBMEM7d0NBRHRDLGFBQ3NDO1FBQ2hDLFFBQWlCLEtBQWpCLE1BRGdDO1FBQ3pCLFFBQVUsS0FBVixNQUR5Qjs7O0FBR3hDLFNBQUssVUFBTCxHQUFrQixJQUFJLGdDQUFpQixNQUFqQixDQUF3QixLQUE1QixFQUFtQyxLQUFuQyxDQUFsQixDQUh3QztBQUl4QyxlQUFXLFdBQVgsQ0FBdUIsS0FBSyxVQUFMLENBQWdCLE1BQWhCLEVBQXZCLEVBSndDO0FBS3hDLFNBQUssVUFBTCxDQUFnQixRQUFoQixHQUx3Qzs7QUFPeEMsU0FBSyxVQUFMLENBQWdCLEVBQWhCLENBQW1CLFFBQW5CLEVBQTZCLFVBQUMsS0FBRCxFQUFXO0FBQ3RDLFVBQUksV0FBVyxPQUFYLEVBQW9CO0FBQ3RCLFlBQU0sK0NBQTZDLEtBQUssSUFBTCxTQUFhLFdBQTFELENBRGdCO0FBRXRCLFlBQUksQ0FBQyxPQUFPLE9BQVAsQ0FBZSxHQUFmLENBQUQsRUFBc0I7QUFBRSxpQkFBRjtTQUExQjtPQUZGOztBQUtBLFdBQUssTUFBTCxDQUFZLEtBQVosRUFOc0M7S0FBWCxDQUE3QixDQVB3QztHQUExQzs7NkJBREk7O3dCQWtCQSxLQUFLO0FBQ1AsV0FBSyxVQUFMLENBQWdCLEtBQWhCLEdBQXdCLEdBQXhCLENBRE87OztTQWxCTDs7Ozs7O0lBd0JBO0FBQ0osV0FESSxRQUNKLENBQVksVUFBWixFQUF3QixJQUF4QixFQUE4QixVQUE5QixFQUEwQzt3Q0FEdEMsVUFDc0M7UUFDaEMsUUFBMEIsS0FBMUIsTUFEZ0M7UUFDekIsVUFBbUIsS0FBbkIsUUFEeUI7UUFDaEIsUUFBVSxLQUFWLE1BRGdCOzs7QUFHeEMsUUFBTSxPQUFPLFdBQVcsSUFBWCxLQUFvQixTQUFwQixHQUNYLGdDQUFpQixhQUFqQixHQUFpQyxnQ0FBaUIsVUFBakIsQ0FKSzs7QUFNeEMsU0FBSyxVQUFMLEdBQWtCLElBQUksSUFBSixDQUFTLEtBQVQsRUFBZ0IsT0FBaEIsRUFBeUIsS0FBekIsQ0FBbEIsQ0FOd0M7QUFPeEMsZUFBVyxXQUFYLENBQXVCLEtBQUssVUFBTCxDQUFnQixNQUFoQixFQUF2QixFQVB3QztBQVF4QyxTQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsR0FSd0M7O0FBVXhDLFNBQUssVUFBTCxDQUFnQixFQUFoQixDQUFtQixRQUFuQixFQUE2QixVQUFDLEtBQUQsRUFBVztBQUN0QyxVQUFJLFdBQVcsT0FBWCxFQUFvQjtBQUN0QixZQUFNLCtDQUE2QyxLQUFLLElBQUwsU0FBYSxXQUExRCxDQURnQjtBQUV0QixZQUFJLENBQUMsT0FBTyxPQUFQLENBQWUsR0FBZixDQUFELEVBQXNCO0FBQUUsaUJBQUY7U0FBMUI7T0FGRjs7QUFLQSxXQUFLLE1BQUwsQ0FBWSxLQUFaLEVBTnNDO0tBQVgsQ0FBN0IsQ0FWd0M7R0FBMUM7OzZCQURJOzt3QkFxQkEsS0FBSztBQUNQLFdBQUssVUFBTCxDQUFnQixLQUFoQixHQUF3QixHQUF4QixDQURPOzs7U0FyQkw7Ozs7OztJQTJCQTtBQUNKLFdBREksVUFDSixDQUFZLFVBQVosRUFBd0IsSUFBeEIsRUFBOEIsVUFBOUIsRUFBMEM7d0NBRHRDLFlBQ3NDO1FBQ2hDLFFBQWlDLEtBQWpDLE1BRGdDO1FBQ3pCLE1BQTBCLEtBQTFCLElBRHlCO1FBQ3BCLE1BQXFCLEtBQXJCLElBRG9CO1FBQ2YsT0FBZ0IsS0FBaEIsS0FEZTtRQUNULFFBQVUsS0FBVixNQURTOzs7QUFHeEMsUUFBSSxXQUFXLElBQVgsS0FBb0IsUUFBcEIsRUFDRixLQUFLLFVBQUwsR0FBa0IsSUFBSSxnQ0FBaUIsTUFBakIsQ0FBd0IsS0FBNUIsRUFBbUMsR0FBbkMsRUFBd0MsR0FBeEMsRUFBNkMsSUFBN0MsRUFBbUQsS0FBbkQsRUFBMEQsV0FBVyxJQUFYLEVBQWlCLFdBQVcsSUFBWCxDQUE3RixDQURGLEtBR0UsS0FBSyxVQUFMLEdBQWtCLElBQUksZ0NBQWlCLFNBQWpCLENBQTJCLEtBQS9CLEVBQXNDLEdBQXRDLEVBQTJDLEdBQTNDLEVBQWdELElBQWhELEVBQXNELEtBQXRELENBQWxCLENBSEY7O0FBS0EsZUFBVyxXQUFYLENBQXVCLEtBQUssVUFBTCxDQUFnQixNQUFoQixFQUF2QixFQVJ3QztBQVN4QyxTQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsR0FUd0M7O0FBV3hDLFNBQUssVUFBTCxDQUFnQixFQUFoQixDQUFtQixRQUFuQixFQUE2QixVQUFDLEtBQUQsRUFBVztBQUN0QyxVQUFJLFdBQVcsT0FBWCxFQUFvQjtBQUN0QixZQUFNLCtDQUE2QyxLQUFLLElBQUwsU0FBYSxXQUExRCxDQURnQjtBQUV0QixZQUFJLENBQUMsT0FBTyxPQUFQLENBQWUsR0FBZixDQUFELEVBQXNCO0FBQUUsaUJBQUY7U0FBMUI7T0FGRjs7QUFLQSxXQUFLLE1BQUwsQ0FBWSxLQUFaLEVBTnNDO0tBQVgsQ0FBN0IsQ0FYd0M7R0FBMUM7OzZCQURJOzt3QkFzQkEsS0FBSztBQUNQLFdBQUssVUFBTCxDQUFnQixLQUFoQixHQUF3QixHQUF4QixDQURPOzs7U0F0Qkw7Ozs7OztJQTRCQTtBQUNKLFdBREksUUFDSixDQUFZLFVBQVosRUFBd0IsSUFBeEIsRUFBOEIsVUFBOUIsRUFBMEM7d0NBRHRDLFVBQ3NDO1FBQ2hDLFFBQWlCLEtBQWpCLE1BRGdDO1FBQ3pCLFFBQVUsS0FBVixNQUR5Qjs7O0FBR3hDLFNBQUssVUFBTCxHQUFrQixJQUFJLGdDQUFpQixJQUFqQixDQUFzQixLQUExQixFQUFpQyxLQUFqQyxFQUF3QyxXQUFXLFFBQVgsQ0FBMUQsQ0FId0M7QUFJeEMsZUFBVyxXQUFYLENBQXVCLEtBQUssVUFBTCxDQUFnQixNQUFoQixFQUF2QixFQUp3QztBQUt4QyxTQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsR0FMd0M7O0FBT3hDLFFBQUksQ0FBQyxXQUFXLFFBQVgsRUFBcUI7QUFDeEIsV0FBSyxVQUFMLENBQWdCLEVBQWhCLENBQW1CLFFBQW5CLEVBQTZCLFlBQU07QUFDakMsWUFBSSxXQUFXLE9BQVgsRUFBb0I7QUFDdEIsY0FBTSwrQ0FBNkMsS0FBSyxJQUFMLE1BQTdDLENBRGdCO0FBRXRCLGNBQUksQ0FBQyxPQUFPLE9BQVAsQ0FBZSxHQUFmLENBQUQsRUFBc0I7QUFBRSxtQkFBRjtXQUExQjtTQUZGOztBQUtBLGFBQUssTUFBTCxHQU5pQztPQUFOLENBQTdCLENBRHdCO0tBQTFCO0dBUEY7OzZCQURJOzt3QkFvQkEsS0FBSztBQUNQLFdBQUssVUFBTCxDQUFnQixLQUFoQixHQUF3QixHQUF4QixDQURPOzs7U0FwQkw7Ozs7OztJQTBCQTtBQUNKLFdBREksV0FDSixDQUFZLFVBQVosRUFBd0IsSUFBeEIsRUFBOEIsVUFBOUIsRUFBMEM7d0NBRHRDLGFBQ3NDO1FBQ2hDLFFBQVUsS0FBVixNQURnQzs7O0FBR3hDLFNBQUssVUFBTCxHQUFrQixJQUFJLGdDQUFpQixPQUFqQixDQUF5QixFQUE3QixFQUFpQyxDQUFDLEtBQUQsQ0FBakMsQ0FBbEIsQ0FId0M7QUFJeEMsZUFBVyxXQUFYLENBQXVCLEtBQUssVUFBTCxDQUFnQixNQUFoQixFQUF2QixFQUp3QztBQUt4QyxTQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsR0FMd0M7O0FBT3hDLFNBQUssVUFBTCxDQUFnQixFQUFoQixDQUFtQixRQUFuQixFQUE2QixZQUFNO0FBQ2pDLFVBQUksV0FBVyxPQUFYLEVBQW9CO0FBQ3RCLFlBQU0sK0NBQTZDLEtBQUssSUFBTCxNQUE3QyxDQURnQjtBQUV0QixZQUFJLENBQUMsT0FBTyxPQUFQLENBQWUsR0FBZixDQUFELEVBQXNCO0FBQUUsaUJBQUY7U0FBMUI7T0FGRjs7QUFLQSxXQUFLLE1BQUwsR0FOaUM7S0FBTixDQUE3QixDQVB3QztHQUExQzs7NkJBREk7O3dCQWtCQSxLQUFLOztTQWxCTDs7O0FBc0JOLElBQU0sYUFBYSx1QkFBYjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBK0NBOzs7Ozs7O0FBSUosV0FKSSxZQUlKLEdBQWM7d0NBSlYsY0FJVTs7Ozs7Ozs7OEZBSlYseUJBS0ksWUFBWSxPQUROOztBQU9aLFFBQU0sV0FBVyxFQUFFLFFBQVEsS0FBUixFQUFiLENBUE07QUFRWixXQUFLLFNBQUwsQ0FBZSxRQUFmOzs7QUFSWSxVQVdaLENBQUssV0FBTCxHQUFtQixFQUFuQixDQVhZOztBQWFaLFdBQUssZUFBTCxHQUF1QixPQUFLLGVBQUwsQ0FBcUIsSUFBckIsUUFBdkIsQ0FiWTtBQWNaLFdBQUssaUJBQUwsR0FBeUIsT0FBSyxpQkFBTCxDQUF1QixJQUF2QixRQUF6QixDQWRZOztHQUFkOzs2QkFKSTs7MkJBcUJHOzs7OztBQUtMLFdBQUssS0FBTCxHQUFhLEVBQWIsQ0FMSzs7QUFPTCxVQUFJLEtBQUssT0FBTCxDQUFhLE1BQWIsRUFDRixLQUFLLElBQUwsR0FBWSxLQUFLLFVBQUwsRUFBWixDQURGOzs7Ozs7OzRCQUtNO0FBQ04sdURBbENFLGtEQWtDRixDQURNOztBQUdOLFVBQUksQ0FBQyxLQUFLLFVBQUwsRUFDSCxLQUFLLElBQUwsR0FERjs7QUFHQSxXQUFLLElBQUwsQ0FBVSxTQUFWLEVBTk07O0FBUU4sV0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixLQUFLLGVBQUwsQ0FBckIsQ0FSTTtBQVNOLFdBQUssT0FBTCxDQUFhLFFBQWIsRUFBdUIsS0FBSyxpQkFBTCxDQUF2Qjs7O0FBVE07Ozs7OzsyQkFlRDtBQUNMLHVEQWpERSxpREFpREY7O0FBREssVUFHTCxDQUFLLGNBQUwsQ0FBb0IsTUFBcEIsRUFBNEIsS0FBSyxlQUFMLENBQTVCLENBSEs7Ozs7b0NBTVMsUUFBUTs7O0FBQ3RCLFdBQUssSUFBTCxHQURzQjs7QUFHdEIsYUFBTyxPQUFQLENBQWUsVUFBQyxLQUFELEVBQVc7QUFDeEIsWUFBTSxPQUFPLE9BQUssa0JBQUwsQ0FBd0IsS0FBeEIsQ0FBUCxDQURrQjtBQUV4QixlQUFLLEtBQUwsQ0FBVyxLQUFLLElBQUwsQ0FBWCxHQUF3QixJQUF4QixDQUZ3Qjs7QUFJeEIsWUFBSSxPQUFLLElBQUwsRUFDRixPQUFLLFVBQUwsQ0FBZ0IsT0FBSyxJQUFMLEVBQVcsSUFBM0IsRUFERjtPQUphLENBQWYsQ0FIc0I7O0FBV3RCLFVBQUksQ0FBQyxLQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQ0gsS0FBSyxLQUFMLEdBREY7Ozs7c0NBSWdCLE1BQU0sS0FBSzs7QUFFM0IsV0FBSyxNQUFMLENBQVksSUFBWixFQUFrQixHQUFsQixFQUF1QixLQUF2QixFQUYyQjs7Ozs7Ozs7Ozs7b0NBVWIsTUFBTSxVQUFVO0FBQzlCLFVBQU0sT0FBTyxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQVAsQ0FEd0I7O0FBRzlCLFVBQUksSUFBSixFQUFVO0FBQ1IsYUFBSyxXQUFMLENBQWlCLFFBQWpCLEVBQTJCLFFBQTNCLEVBRFE7O0FBR1IsWUFBSSxLQUFLLElBQUwsS0FBYyxTQUFkLEVBQ0YsU0FBUyxLQUFLLEtBQUwsQ0FBVCxDQURGO09BSEYsTUFLTztBQUNMLGdCQUFRLEdBQVIsQ0FBWSxtQkFBbUIsSUFBbkIsR0FBMEIsR0FBMUIsQ0FBWixDQURLO09BTFA7Ozs7Ozs7Ozs7O3VDQWVpQixNQUFNLFVBQVU7QUFDakMsVUFBTSxPQUFPLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBUCxDQUQyQjs7QUFHakMsVUFBSSxJQUFKLEVBQVU7QUFDUixhQUFLLGNBQUwsQ0FBb0IsUUFBcEIsRUFBOEIsUUFBOUIsRUFEUTtPQUFWLE1BRU87QUFDTCxnQkFBUSxHQUFSLENBQVksbUJBQW1CLElBQW5CLEdBQTBCLEdBQTFCLENBQVosQ0FESztPQUZQOzs7Ozs7Ozs7Ozs2QkFZTyxNQUFNO0FBQ2IsYUFBTyxLQUFLLEtBQUwsQ0FBVyxJQUFYLEVBQWlCLEtBQWpCLENBRE07Ozs7Ozs7Ozs7OzsyQkFVUixNQUFNLEtBQTBCO1VBQXJCLHFFQUFlLG9CQUFNOztBQUNyQyxVQUFNLE9BQU8sS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFQLENBRCtCOztBQUdyQyxVQUFJLElBQUosRUFBVTtBQUNSLGFBQUssTUFBTCxDQUFZLEdBQVosRUFBaUIsWUFBakIsRUFEUTtPQUFWLE1BRU87QUFDTCxnQkFBUSxHQUFSLENBQVksMkJBQTJCLElBQTNCLEdBQWtDLEdBQWxDLENBQVosQ0FESztPQUZQOzs7O3VDQU9pQixNQUFNO0FBQ3ZCLFVBQUksT0FBTyxJQUFQLENBRG1COztBQUd2QixjQUFRLEtBQUssSUFBTDtBQUNOLGFBQUssU0FBTDtBQUNFLGlCQUFPLElBQUksWUFBSixDQUFpQixJQUFqQixFQUF1QixLQUFLLElBQUwsRUFBVyxLQUFLLEtBQUwsRUFBWSxLQUFLLEtBQUwsQ0FBckQsQ0FERjtBQUVFLGdCQUZGOztBQURGLGFBS08sTUFBTDtBQUNFLGlCQUFPLElBQUksU0FBSixDQUFjLElBQWQsRUFBb0IsS0FBSyxJQUFMLEVBQVcsS0FBSyxLQUFMLEVBQVksS0FBSyxPQUFMLEVBQWMsS0FBSyxLQUFMLENBQWhFLENBREY7QUFFRSxnQkFGRjs7QUFMRixhQVNPLFFBQUw7QUFDRSxpQkFBTyxJQUFJLFdBQUosQ0FBZ0IsSUFBaEIsRUFBc0IsS0FBSyxJQUFMLEVBQVcsS0FBSyxLQUFMLEVBQVksS0FBSyxHQUFMLEVBQVUsS0FBSyxHQUFMLEVBQVUsS0FBSyxJQUFMLEVBQVcsS0FBSyxLQUFMLENBQW5GLENBREY7QUFFRSxnQkFGRjs7QUFURixhQWFPLE1BQUw7QUFDRSxpQkFBTyxJQUFJLFNBQUosQ0FBYyxJQUFkLEVBQW9CLEtBQUssSUFBTCxFQUFXLEtBQUssS0FBTCxFQUFZLEtBQUssS0FBTCxDQUFsRCxDQURGO0FBRUUsZ0JBRkY7O0FBYkYsYUFpQk8sU0FBTDtBQUNFLGlCQUFPLElBQUksWUFBSixDQUFpQixJQUFqQixFQUF1QixLQUFLLElBQUwsRUFBVyxLQUFLLEtBQUwsQ0FBekMsQ0FERjtBQUVFLGdCQUZGO0FBakJGLE9BSHVCOztBQXlCdkIsYUFBTyxJQUFQLENBekJ1Qjs7Ozs7Ozs7Ozs7Ozs7O2tDQXFDWCxNQUFNLFNBQVM7QUFDM0IsV0FBSyxXQUFMLENBQWlCLElBQWpCLElBQXlCLE9BQXpCLENBRDJCOzs7OytCQUlsQixNQUFNLE1BQU07QUFDckIsVUFBTSxTQUFTLHNCQUFjO0FBQzNCLGNBQU0sSUFBTjtBQUNBLGlCQUFTLEtBQVQ7T0FGYSxFQUdaLEtBQUssV0FBTCxDQUFpQixLQUFLLElBQUwsQ0FITCxDQUFULENBRGU7O0FBTXJCLFVBQUksT0FBTyxJQUFQLEtBQWdCLEtBQWhCLEVBQXVCLE9BQU8sSUFBUCxDQUEzQjs7QUFFQSxVQUFJLE1BQU0sSUFBTixDQVJpQjtBQVNyQixVQUFNLGFBQWEsS0FBSyxJQUFMLENBQVUsR0FBVixDQVRFOztBQVdyQixjQUFRLEtBQUssSUFBTDtBQUNOLGFBQUssU0FBTDtBQUNFLGdCQUFNLElBQUksV0FBSixDQUFnQixVQUFoQixFQUE0QixJQUE1QixFQUFrQyxNQUFsQyxDQUFOO0FBREY7QUFERixhQUlPLE1BQUw7QUFDRSxnQkFBTSxJQUFJLFFBQUosQ0FBYSxVQUFiLEVBQXlCLElBQXpCLEVBQStCLE1BQS9CLENBQU47QUFERjtBQUpGLGFBT08sUUFBTDtBQUNFLGdCQUFNLElBQUksVUFBSixDQUFlLFVBQWYsRUFBMkIsSUFBM0IsRUFBaUMsTUFBakMsQ0FBTjtBQURGO0FBUEYsYUFVTyxNQUFMO0FBQ0UsZ0JBQU0sSUFBSSxRQUFKLENBQWEsVUFBYixFQUF5QixJQUF6QixFQUErQixNQUEvQixDQUFOO0FBREY7QUFWRixhQWFPLFNBQUw7QUFDRSxnQkFBTSxJQUFJLFdBQUosQ0FBZ0IsVUFBaEIsRUFBNEIsSUFBNUIsRUFBa0MsTUFBbEMsQ0FBTixDQURGO0FBRUUsZ0JBRkY7QUFiRixPQVhxQjs7QUE2QnJCLFdBQUssV0FBTCxDQUFpQixRQUFqQixFQUEyQixVQUFDLEdBQUQ7ZUFBUyxJQUFJLEdBQUosQ0FBUSxHQUFSO09BQVQsQ0FBM0IsQ0E3QnFCOztBQStCckIsYUFBTyxHQUFQLENBL0JxQjs7O1NBN0tuQjs7O0FBZ05OLHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsWUFBcEM7O2tCQUVlIiwiZmlsZSI6IlNoYXJlZFBhcmFtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiYXNpY0NvbnRyb2xsZXJzIGZyb20gJ3dhdmVzLWJhc2ljLWNvbnRyb2xsZXJzJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5iYXNpY0NvbnRyb2xsZXJzLmRpc2FibGVTdHlsZXMoKTtcblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vKiBDT05UUk9MIFVOSVRTXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQ29udHJvbEl0ZW0gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCB0eXBlLCBuYW1lLCBsYWJlbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb250cm9sID0gY29udHJvbDtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMudmFsdWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgX3Byb3BhZ2F0ZShzZW5kVG9TZXJ2ZXIgPSB0cnVlKSB7XG4gICAgdGhpcy5lbWl0KCd1cGRhdGUnLCB0aGlzLnZhbHVlKTsgLy8gY2FsbCBldmVudCBsaXN0ZW5lcnNcblxuICAgIGlmIChzZW5kVG9TZXJ2ZXIpXG4gICAgICB0aGlzLmNvbnRyb2wuc2VuZCgndXBkYXRlJywgdGhpcy5uYW1lLCB0aGlzLnZhbHVlKTsgLy8gc2VuZCB0byBzZXJ2ZXJcblxuICAgIHRoaXMuY29udHJvbC5lbWl0KCd1cGRhdGUnLCB0aGlzLm5hbWUsIHRoaXMudmFsdWUpOyAvLyBjYWxsIGNvbnRyb2wgbGlzdGVuZXJzXG4gIH1cblxuICB1cGRhdGUodmFsLCBzZW5kVG9TZXJ2ZXIgPSB0cnVlKSB7XG4gICAgdGhpcy5zZXQodmFsKTtcbiAgICB0aGlzLl9wcm9wYWdhdGUoc2VuZFRvU2VydmVyKTtcbiAgfVxufVxuXG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0Jvb2xlYW5JdGVtIGV4dGVuZHMgX0NvbnRyb2xJdGVtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAnYm9vbGVhbicsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0VudW1JdGVtIGV4dGVuZHMgX0NvbnRyb2xJdGVtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIG9wdGlvbnMsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAnZW51bScsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIGxldCBpbmRleCA9IHRoaXMub3B0aW9ucy5pbmRleE9mKHZhbCk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfTnVtYmVySXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdudW1iZXInLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5taW4gPSBtaW47XG4gICAgdGhpcy5tYXggPSBtYXg7XG4gICAgdGhpcy5zdGVwID0gc3RlcDtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gTWF0aC5taW4odGhpcy5tYXgsIE1hdGgubWF4KHRoaXMubWluLCB2YWwpKTtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UZXh0SXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBpbml0KSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3RleHQnLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UcmlnZ2VySXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3RyaWdnZXInLCBuYW1lLCBsYWJlbCk7XG4gIH1cblxuICBzZXQodmFsKSB7IC8qIG5vdGhpbmcgdG8gc2V0IGhlcmUgKi8gfVxufVxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8qIEdVSXNcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9Cb29sZWFuR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgaXRlbSwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIHZhbHVlIH0gPSBpdGVtO1xuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuVG9nZ2xlKGxhYmVsLCB2YWx1ZSk7XG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAodmFsdWUpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke2l0ZW0ubmFtZX06JHt2YWx1ZX1cImA7XG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgIH1cblxuICAgICAgaXRlbS51cGRhdGUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9FbnVtR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgaXRlbSwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIG9wdGlvbnMsIHZhbHVlIH0gPSBpdGVtO1xuXG4gICAgY29uc3QgY3RvciA9IGd1aU9wdGlvbnMudHlwZSA9PT0gJ2J1dHRvbnMnID9cbiAgICAgIGJhc2ljQ29udHJvbGxlcnMuU2VsZWN0QnV0dG9ucyA6IGJhc2ljQ29udHJvbGxlcnMuU2VsZWN0TGlzdFxuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGN0b3IobGFiZWwsIG9wdGlvbnMsIHZhbHVlKTtcbiAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5yZW5kZXIoKSk7XG4gICAgdGhpcy5jb250cm9sbGVyLm9uUmVuZGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIub24oJ2NoYW5nZScsICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7aXRlbS5uYW1lfToke3ZhbHVlfVwiYDtcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtc2cpKSB7IHJldHVybjsgfVxuICAgICAgfVxuXG4gICAgICBpdGVtLnVwZGF0ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX051bWJlckd1aSB7XG4gIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIGl0ZW0sIGd1aU9wdGlvbnMpIHtcbiAgICBjb25zdCB7IGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdmFsdWUgfSA9IGl0ZW07XG5cbiAgICBpZiAoZ3VpT3B0aW9ucy50eXBlID09PSAnc2xpZGVyJylcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBiYXNpY0NvbnRyb2xsZXJzLlNsaWRlcihsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIHZhbHVlLCBndWlPcHRpb25zLml0ZW0sIGd1aU9wdGlvbnMuc2l6ZSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuTnVtYmVyQm94KGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdmFsdWUpO1xuXG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAodmFsdWUpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke2l0ZW0ubmFtZX06JHt2YWx1ZX1cImA7XG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgIH1cblxuICAgICAgaXRlbS51cGRhdGUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UZXh0R3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgaXRlbSwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIHZhbHVlIH0gPSBpdGVtO1xuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuVGV4dChsYWJlbCwgdmFsdWUsIGd1aU9wdGlvbnMucmVhZE9ubHkpO1xuICAgICRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLnJlbmRlcigpKTtcbiAgICB0aGlzLmNvbnRyb2xsZXIub25SZW5kZXIoKTtcblxuICAgIGlmICghZ3VpT3B0aW9ucy5yZWFkT25seSkge1xuICAgICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7aXRlbS5uYW1lfVwiYDtcbiAgICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICAgIH1cblxuICAgICAgICBpdGVtLnVwZGF0ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UcmlnZ2VyR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgaXRlbSwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwgfSA9IGl0ZW07XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgYmFzaWNDb250cm9sbGVycy5CdXR0b25zKCcnLCBbbGFiZWxdKTtcbiAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5yZW5kZXIoKSk7XG4gICAgdGhpcy5jb250cm9sbGVyLm9uUmVuZGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke2l0ZW0ubmFtZX1cImA7XG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgIH1cblxuICAgICAgaXRlbS51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldCh2YWwpIHsgLyogbm90aGluZyB0byBzZXQgaGVyZSAqLyB9XG59XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnNoYXJlZC1wYXJhbXMnO1xuXG4vKipcbiAqIE1hbmFnZSB0aGUgZ2xvYmFsIGNvbnRyb2wgYHBhcmFtZXRlcnNgLCBgaW5mb3NgLCBhbmQgYGNvbW1hbmRzYCBhY3Jvc3MgdGhlIHdob2xlIHNjZW5hcmlvLlxuICpcbiAqIFRoZSBzZXJ2aWNlIGtlZXBzIHRyYWNrIG9mOlxuICogLSBgcGFyYW1ldGVyc2A6IHZhbHVlcyB0aGF0IGNhbiBiZSB1cGRhdGVkIGJ5IHRoZSBhY3Rpb25zIG9mIHRoZSBjbGllbnRzICgqZS5nLiogdGhlIGdhaW4gb2YgYSBzeW50aCk7XG4gKiAtIGBpbmZvc2A6IGluZm9ybWF0aW9uIGFib3V0IHRoZSBzdGF0ZSBvZiB0aGUgc2NlbmFyaW8gKCplLmcuKiBudW1iZXIgb2YgY2xpZW50cyBpbiB0aGUgcGVyZm9ybWFuY2UpO1xuICogLSBgY29tbWFuZHNgOiBjYW4gdHJpZ2dlciBhbiBhY3Rpb24gKCplLmcuKiByZWxvYWQgdGhlIHBhZ2UpLlxuICpcbiAqIElmIHRoZSBzZXJ2aWNlIGlzIGluc3RhbnRpYXRlZCB3aXRoIHRoZSBgZ3VpYCBvcHRpb24gc2V0IHRvIGB0cnVlYCwgaXQgY29uc3RydWN0cyBhIGdyYXBoaWNhbCBpbnRlcmZhY2UgdG8gbW9kaWZ5IHRoZSBwYXJhbWV0ZXJzLCB2aWV3IHRoZSBpbmZvcywgYW5kIHRyaWdnZXIgdGhlIGNvbW1hbmRzLlxuICogT3RoZXJ3aXNlIChgZ3VpYCBvcHRpb24gc2V0IHRvIGBmYWxzZWApIHRoZSBzZXJ2aWNlIGVtaXRzIGFuIGV2ZW50IHdoZW4gaXQgcmVjZWl2ZXMgdXBkYXRlZCB2YWx1ZXMgZnJvbSB0aGUgc2VydmVyLlxuICpcbiAqIFdoZW4gdGhlIEdVSSBpcyBkaXNhYmxlZCwgdGhlIHNlcnZpY2UgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIGltbWVkaWF0ZWx5IGFmdGVyIGhhdmluZyBzZXQgdXAgdGhlIGNvbnRyb2xzLlxuICogT3RoZXJ3aXNlIChHVUkgZW5hYmxlZCksIHRoZSBzZXJ2aWNlIHJlbWFpbnMgaW4gaXRzIHN0YXRlIGFuZCBuZXZlciBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24uXG4gKlxuICogV2hlbiB0aGUgc2VydmljZSBhIHZpZXcgKGBndWlgIG9wdGlvbiBzZXQgdG8gYHRydWVgKSwgaXQgcmVxdWlyZXMgdGhlIFNBU1MgcGFydGlhbCBgXzc3LWNoZWNraW4uc2Nzc2AuXG4gKlxuICogQGV4YW1wbGUgLy8gRXhhbXBsZSAxOiBtYWtlIGEgY2xpZW50IHRoYXQgZGlzcGxheXMgdGhlIGNvbnRyb2wgR1VJXG4gKiBjb25zdCBjb250cm9sID0gbmV3IFNoYXJlZFBhcmFtcygpO1xuICpcbiAqIC8vIEluaXRpYWxpemUgdGhlIGNsaWVudCAoaW5kaWNhdGUgdGhlIGNsaWVudCB0eXBlKVxuICogY2xpZW50LmluaXQoJ2NvbmR1Y3RvcicpOyAvLyBhY2Nlc3NpYmxlIGF0IHRoZSBVUkwgL2NvbmR1Y3RvclxuICpcbiAqIC8vIFN0YXJ0IHRoZSBzY2VuYXJpb1xuICogLy8gRm9yIHRoaXMgY2xpZW50IHR5cGUgKGAnY29uZHVjdG9yJ2ApLCB0aGVyZSBpcyBvbmx5IG9uZSBzZXJ2aWNlXG4gKiBjbGllbnQuc3RhcnQoY29udHJvbCk7XG4gKlxuICogQGV4YW1wbGUgLy8gRXhhbXBsZSAyOiBsaXN0ZW4gZm9yIHBhcmFtZXRlciwgaW5mb3MgJiBjb21tYW5kcyB1cGRhdGVzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IFNoYXJlZFBhcmFtcyh7IGd1aTogZmFsc2UgfSk7XG4gKlxuICogLy8gTGlzdGVuIGZvciBwYXJhbWV0ZXIsIGluZm9zIG9yIGNvbW1hbmQgdXBkYXRlc1xuICogY29udHJvbC5vbigndXBkYXRlJywgKG5hbWUsIHZhbHVlKSA9PiB7XG4gKiAgIHN3aXRjaChuYW1lKSB7XG4gKiAgICAgY2FzZSAnc3ludGg6Z2Fpbic6XG4gKiAgICAgICBjb25zb2xlLmxvZyhgVXBkYXRlIHRoZSBzeW50aCBnYWluIHRvIHZhbHVlICN7dmFsdWV9LmApO1xuICogICAgICAgYnJlYWs7XG4gKiAgICAgY2FzZSAncmVsb2FkJzpcbiAqICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XG4gKiAgICAgICBicmVhaztcbiAqICAgfVxuICogfSk7XG4gKlxuICogLy8gR2V0IGN1cnJlbnQgdmFsdWUgb2YgYSBwYXJhbWV0ZXIgb3IgaW5mb1xuICogY29uc3QgY3VycmVudFN5bnRoR2FpblZhbHVlID0gY29udHJvbC5ldmVudFsnc3ludGg6Z2FpbiddLnZhbHVlO1xuICogY29uc3QgY3VycmVudE51bVBsYXllcnNWYWx1ZSA9IGNvbnRyb2wuZXZlbnRbJ251bVBsYXllcnMnXS52YWx1ZTtcbiAqL1xuY2xhc3MgU2hhcmVkUGFyYW1zIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKlxuICAgKiBAZW1pdHMgeyd1cGRhdGUnfSB3aGVuIHRoZSBzZXJ2ZXIgc2VuZHMgYW4gdXBkYXRlLiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGFrZXMgYG5hbWU6U3RyaW5nYCBhbmQgYHZhbHVlOipgIGFzIGFyZ3VtZW50cywgd2hlcmUgYG5hbWVgIGlzIHRoZSBuYW1lIG9mIHRoZSBwYXJhbWV0ZXIgLyBpbmZvIC8gY29tbWFuZCwgYW5kIGB2YWx1ZWAgaXRzIG5ldyB2YWx1ZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuaGFzR3VpPXRydWVdIC0gSW5kaWNhdGVzIHdoZXRoZXIgdG8gY3JlYXRlIHRoZSBncmFwaGljYWwgdXNlciBpbnRlcmZhY2UgdG8gY29udHJvbCB0aGUgcGFyYW1ldGVycyBvciBub3QuXG4gICAgICovXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7IGhhc0d1aTogZmFsc2UgfTtcbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICAvKiogQHByaXZhdGUgKi9cbiAgICB0aGlzLl9ndWlPcHRpb25zID0ge307XG5cbiAgICB0aGlzLl9vbkluaXRSZXNwb25zZSA9IHRoaXMuX29uSW5pdFJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25VcGRhdGVSZXNwb25zZSA9IHRoaXMuX29uVXBkYXRlUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgLyoqXG4gICAgICogRGljdGlvbmFyeSBvZiBhbGwgdGhlIHBhcmFtZXRlcnMgYW5kIGNvbW1hbmRzLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5pdGVtcyA9IHt9O1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5oYXNHdWkpXG4gICAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdpbml0JywgdGhpcy5fb25Jbml0UmVzcG9uc2UpO1xuICAgIHRoaXMucmVjZWl2ZSgndXBkYXRlJywgdGhpcy5fb25VcGRhdGVSZXNwb25zZSk7XG5cbiAgICAvLyB0aGlzLnNob3coKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgICAvLyBkb24ndCByZW1vdmUgJ3VwZGF0ZScgbGlzdGVuZXIsIGFzIHRoZSBjb250cm9sIGlzIHJ1bm5pZyBhcyBhIGJhY2tncm91bmQgcHJvY2Vzc1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2luaXQnLCB0aGlzLl9vbkluaXRSZXNwb25zZSk7XG4gIH1cblxuICBfb25Jbml0UmVzcG9uc2UoY29uZmlnKSB7XG4gICAgdGhpcy5zaG93KCk7XG5cbiAgICBjb25maWcuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl9jcmVhdGVDb250cm9sSXRlbShlbnRyeSk7XG4gICAgICB0aGlzLml0ZW1zW2l0ZW0ubmFtZV0gPSBpdGVtO1xuXG4gICAgICBpZiAodGhpcy52aWV3KVxuICAgICAgICB0aGlzLl9jcmVhdGVHdWkodGhpcy52aWV3LCBpdGVtKTtcbiAgICB9KTtcblxuICAgIGlmICghdGhpcy5vcHRpb25zLmhhc0d1aSlcbiAgICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIF9vblVwZGF0ZVJlc3BvbnNlKG5hbWUsIHZhbCkge1xuICAgIC8vIHVwZGF0ZSwgYnV0IGRvbid0IHNlbmQgYmFjayB0byBzZXJ2ZXJcbiAgICB0aGlzLnVwZGF0ZShuYW1lLCB2YWwsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGlzdGVuZXIgdG8gYSBzcGVjaWZpYyBldmVudCAoaS5lLiBwYXJhbWV0ZXIsIGluZm8gb3IgY29tbWFuZCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBMaXN0ZW5lciBjYWxsYmFjay5cbiAgICovXG4gIGFkZEl0ZW1MaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zW25hbWVdO1xuXG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIGl0ZW0uYWRkTGlzdGVuZXIoJ3VwZGF0ZScsIGxpc3RlbmVyKTtcblxuICAgICAgaWYgKGl0ZW0udHlwZSAhPT0gJ2NvbW1hbmQnKVxuICAgICAgICBsaXN0ZW5lcihpdGVtLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gaXRlbSBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBsaXN0ZW5lciBmcm9tIGEgc3BlY2lmaWMgZXZlbnQgKGkuZS4gcGFyYW1ldGVyLCBpbmZvIG9yIGNvbW1hbmQpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTGlzdGVuZXIgY2FsbGJhY2suXG4gICAqL1xuICByZW1vdmVJdGVtTGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBpdGVtID0gdGhpcy5pdGVtc1tuYW1lXTtcblxuICAgIGlmIChpdGVtKSB7XG4gICAgICBpdGVtLnJlbW92ZUxpc3RlbmVyKCd1cGRhdGUnLCBsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIGl0ZW0gXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHZhbHVlIG9mIGEgZ2l2ZW4gcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEByZXR1cm5zIHtNaXhlZH0gLSBUaGUgcmVsYXRlZCB2YWx1ZS5cbiAgICovXG4gIGdldFZhbHVlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtc1tuYW1lXS52YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB2YWx1ZSBvZiBhIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0geyhTdHJpbmd8TnVtYmVyfEJvb2xlYW4pfSB2YWwgLSBOZXcgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbc2VuZFRvU2VydmVyPXRydWVdIC0gRmxhZyB3aGV0aGVyIHRoZSB2YWx1ZSBpcyBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICB1cGRhdGUobmFtZSwgdmFsLCBzZW5kVG9TZXJ2ZXIgPSB0cnVlKSB7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuaXRlbXNbbmFtZV07XG5cbiAgICBpZiAoaXRlbSkge1xuICAgICAgaXRlbS51cGRhdGUodmFsLCBzZW5kVG9TZXJ2ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBjb250cm9sIGl0ZW0gXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIF9jcmVhdGVDb250cm9sSXRlbShpbml0KSB7XG4gICAgbGV0IGl0ZW0gPSBudWxsO1xuXG4gICAgc3dpdGNoIChpbml0LnR5cGUpIHtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICBpdGVtID0gbmV3IF9Cb29sZWFuSXRlbSh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZW51bSc6XG4gICAgICAgIGl0ZW0gPSBuZXcgX0VudW1JdGVtKHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC5vcHRpb25zLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGl0ZW0gPSBuZXcgX051bWJlckl0ZW0odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0Lm1pbiwgaW5pdC5tYXgsIGluaXQuc3RlcCwgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgaXRlbSA9IG5ldyBfVGV4dEl0ZW0odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3RyaWdnZXInOlxuICAgICAgICBpdGVtID0gbmV3IF9UcmlnZ2VySXRlbSh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgdGhlIEdVSSBmb3IgYSBzcGVjaWZpYyBjb250cm9sIGl0ZW0gKGUuZy4gaWYgaXQgc2hvdWxkIGFwcGVhciBvciBub3QsXG4gICAqIHdoaWNoIHR5cGUgb2YgR1VJIHRvIHVzZSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGBpdGVtYCB0byBjb25maWd1cmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gYXBwbHkgdG8gY29uZmlndXJlIHRoZSBnaXZlbiBgaXRlbWAuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnR5cGUgLSBUaGUgdHlwZSBvZiBHVUkgdG8gdXNlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNob3c9dHJ1ZV0gLSBTaG93IHRoZSBHVUkgZm9yIHRoaXMgYGl0ZW1gIG9yIG5vdC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5jb25maXJtPWZhbHNlXSAtIEFzayBmb3IgY29uZmlybWF0aW9uIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAqL1xuICBzZXRHdWlPcHRpb25zKG5hbWUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLl9ndWlPcHRpb25zW25hbWVdID0gb3B0aW9ucztcbiAgfVxuXG4gIF9jcmVhdGVHdWkodmlldywgaXRlbSkge1xuICAgIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIGNvbmZpcm06IGZhbHNlLFxuICAgIH0sIHRoaXMuX2d1aU9wdGlvbnNbaXRlbS5uYW1lXSk7XG5cbiAgICBpZiAoY29uZmlnLnNob3cgPT09IGZhbHNlKSByZXR1cm4gbnVsbDtcblxuICAgIGxldCBndWkgPSBudWxsO1xuICAgIGNvbnN0ICRjb250YWluZXIgPSB0aGlzLnZpZXcuJGVsO1xuXG4gICAgc3dpdGNoIChpdGVtLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICBndWkgPSBuZXcgX0Jvb2xlYW5HdWkoJGNvbnRhaW5lciwgaXRlbSwgY29uZmlnKTsgLy8gYFRvZ2dsZWBcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlbnVtJzpcbiAgICAgICAgZ3VpID0gbmV3IF9FbnVtR3VpKCRjb250YWluZXIsIGl0ZW0sIGNvbmZpZyk7IC8vIGBTZWxlY3RMaXN0YCBvciBgU2VsZWN0QnV0dG9uc2BcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBndWkgPSBuZXcgX051bWJlckd1aSgkY29udGFpbmVyLCBpdGVtLCBjb25maWcpOyAvLyBgTnVtYmVyQm94YCBvciBgU2xpZGVyYFxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICBndWkgPSBuZXcgX1RleHRHdWkoJGNvbnRhaW5lciwgaXRlbSwgY29uZmlnKTsgLy8gYFRleHRgXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndHJpZ2dlcic6XG4gICAgICAgIGd1aSA9IG5ldyBfVHJpZ2dlckd1aSgkY29udGFpbmVyLCBpdGVtLCBjb25maWcpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpdGVtLmFkZExpc3RlbmVyKCd1cGRhdGUnLCAodmFsKSA9PiBndWkuc2V0KHZhbCkpO1xuXG4gICAgcmV0dXJuIGd1aTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTaGFyZWRQYXJhbXMpO1xuXG5leHBvcnQgZGVmYXVsdCBTaGFyZWRQYXJhbXM7XG4iXX0=