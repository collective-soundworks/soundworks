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
 * The module keeps track of:
 * - `parameters`: values that can be updated by the actions of the clients (*e.g.* the gain of a synth);
 * - `infos`: information about the state of the scenario (*e.g.* number of clients in the performance);
 * - `commands`: can trigger an action (*e.g.* reload the page).
 *
 * If the module is instantiated with the `gui` option set to `true`, it constructs a graphical interface to modify the parameters, view the infos, and trigger the commands.
 * Otherwise (`gui` option set to `false`) the module emits an event when it receives updated values from the server.
 *
 * When the GUI is disabled, the module finishes its initialization immediately after having set up the controls.
 * Otherwise (GUI enabled), the modules remains in its state and never finishes its initialization.
 *
 * When the module a view (`gui` option set to `true`), it requires the SASS partial `_77-checkin.scss`.
 *
 * (See also {@link src/server/ServerControl.js~ServerControl} on the server side.)
 *
 * @example // Example 1: make a client that displays the control GUI
 * const control = new ClientSharedParams();
 *
 * // Initialize the client (indicate the client type)
 * client.init('conductor'); // accessible at the URL /conductor
 *
 * // Start the scenario
 * // For this client type (`'conductor'`), there is only one module
 * client.start(control);
 *
 * @example // Example 2: listen for parameter, infos & commands updates
 * const control = new ClientSharedParams({ gui: false });
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

var ClientSharedParams = function (_Service) {
  (0, _inherits3.default)(ClientSharedParams, _Service);

  /**
   * @emits {'update'} when the server sends an update. The callback function takes `name:String` and `value:*` as arguments, where `name` is the name of the parameter / info / command, and `value` its new value.
   */

  function ClientSharedParams() {
    (0, _classCallCheck3.default)(this, ClientSharedParams);


    /**
     * @param {Object} [options={}] Options.
     * @param {Boolean} [options.hasGui=true] - Indicates whether to create the graphical user interface to control the parameters or not.
     */

    var _this7 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ClientSharedParams).call(this, SERVICE_ID, true));

    var defaults = { hasGui: false };
    _this7.configure(defaults);

    /** @private */
    _this7._guiOptions = {};

    _this7._onInitResponse = _this7._onInitResponse.bind(_this7);
    _this7._onUpdateResponse = _this7._onUpdateResponse.bind(_this7);
    return _this7;
  }

  (0, _createClass3.default)(ClientSharedParams, [{
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
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientSharedParams.prototype), 'start', this).call(this);

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
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientSharedParams.prototype), 'stop', this).call(this);
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
  return ClientSharedParams;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, ClientSharedParams);

exports.default = ClientSharedParams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudFNoYXJlZFBhcmFtcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxnQ0FBaUIsYUFBakI7Ozs7Ozs7O0lBT007OztBQUNKLFdBREksWUFDSixDQUFZLE9BQVosRUFBcUIsSUFBckIsRUFBMkIsSUFBM0IsRUFBaUMsS0FBakMsRUFBd0M7d0NBRHBDLGNBQ29DOzs2RkFEcEMsMEJBQ29DOztBQUV0QyxVQUFLLE9BQUwsR0FBZSxPQUFmLENBRnNDO0FBR3RDLFVBQUssSUFBTCxHQUFZLElBQVosQ0FIc0M7QUFJdEMsVUFBSyxJQUFMLEdBQVksSUFBWixDQUpzQztBQUt0QyxVQUFLLEtBQUwsR0FBYSxLQUFiLENBTHNDO0FBTXRDLFVBQUssS0FBTCxHQUFhLFNBQWIsQ0FOc0M7O0dBQXhDOzs2QkFESTs7d0JBVUEsS0FBSztBQUNQLFdBQUssS0FBTCxHQUFhLEtBQWIsQ0FETzs7OztpQ0FJdUI7VUFBckIscUVBQWUsb0JBQU07O0FBQzlCLFdBQUssSUFBTCxDQUFVLFFBQVYsRUFBb0IsS0FBSyxLQUFMLENBQXBCOztBQUQ4QixVQUcxQixZQUFKLEVBQ0UsS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixRQUFsQixFQUE0QixLQUFLLElBQUwsRUFBVyxLQUFLLEtBQUwsQ0FBdkMsQ0FERjs7QUFIOEIsVUFNOUIsQ0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixRQUFsQixFQUE0QixLQUFLLElBQUwsRUFBVyxLQUFLLEtBQUwsQ0FBdkM7QUFOOEI7OzsyQkFTekIsS0FBMEI7VUFBckIscUVBQWUsb0JBQU07O0FBQy9CLFdBQUssR0FBTCxDQUFTLEdBQVQsRUFEK0I7QUFFL0IsV0FBSyxVQUFMLENBQWdCLFlBQWhCLEVBRitCOzs7U0F2QjdCOzs7Ozs7SUErQkE7OztBQUNKLFdBREksWUFDSixDQUFZLE9BQVosRUFBcUIsSUFB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QTNCLEVBQWlDLE1BQWpDLENBQU47QUFERjtBQVBGLGFBVU8sTUFBTDtBQUNFLGdCQUFNLElBQUksUUFBSixDQUFhLFVBQWIsRUFBeUIsSUFBekIsRUFBK0IsTUFBL0IsQ0FBTjtBQURGO0FBVkYsYUFhTyxTQUFMO0FBQ0UsZ0JBQU0sSUFBSSxXQUFKLENBQWdCLFVBQWhCLEVBQTRCLElBQTVCLEVBQWtDLE1BQWxDLENBQU4sQ0FERjtBQUVFLGdCQUZGO0FBYkYsT0FYcUI7O0FBNkJyQixXQUFLLFdBQUwsQ0FBaUIsUUFBakIsRUFBMkIsVUFBQyxHQUFEO2VBQVMsSUFBSSxHQUFKLENBQVEsR0FBUjtPQUFULENBQTNCLENBN0JxQjs7QUErQnJCLGFBQU8sR0FBUCxDQS9CcUI7OztTQTdLbkI7OztBQWdOTix5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLGtCQUFwQzs7a0JBRWUiLCJmaWxlIjoiQ2xpZW50U2hhcmVkUGFyYW1zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJhc2ljQ29udHJvbGxlcnMgZnJvbSAnd2F2ZXMtYmFzaWMtY29udHJvbGxlcnMnO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmJhc2ljQ29udHJvbGxlcnMuZGlzYWJsZVN0eWxlcygpO1xuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8qIENPTlRST0wgVU5JVFNcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9Db250cm9sSXRlbSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIHR5cGUsIG5hbWUsIGxhYmVsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmNvbnRyb2wgPSBjb250cm9sO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgdGhpcy52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICBfcHJvcGFnYXRlKHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICB0aGlzLmVtaXQoJ3VwZGF0ZScsIHRoaXMudmFsdWUpOyAvLyBjYWxsIGV2ZW50IGxpc3RlbmVyc1xuXG4gICAgaWYgKHNlbmRUb1NlcnZlcilcbiAgICAgIHRoaXMuY29udHJvbC5zZW5kKCd1cGRhdGUnLCB0aGlzLm5hbWUsIHRoaXMudmFsdWUpOyAvLyBzZW5kIHRvIHNlcnZlclxuXG4gICAgdGhpcy5jb250cm9sLmVtaXQoJ3VwZGF0ZScsIHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7IC8vIGNhbGwgY29udHJvbCBsaXN0ZW5lcnNcbiAgfVxuXG4gIHVwZGF0ZSh2YWwsIHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICB0aGlzLnNldCh2YWwpO1xuICAgIHRoaXMuX3Byb3BhZ2F0ZShzZW5kVG9TZXJ2ZXIpO1xuICB9XG59XG5cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQm9vbGVhbkl0ZW0gZXh0ZW5kcyBfQ29udHJvbEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgaW5pdCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdib29sZWFuJywgbmFtZSwgbGFiZWwpO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfRW51bUl0ZW0gZXh0ZW5kcyBfQ29udHJvbEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgb3B0aW9ucywgaW5pdCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdlbnVtJywgbmFtZSwgbGFiZWwpO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5vcHRpb25zLmluZGV4T2YodmFsKTtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsO1xuICAgIH1cbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9OdW1iZXJJdGVtIGV4dGVuZHMgX0NvbnRyb2xJdGVtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0KSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ251bWJlcicsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLm1pbiA9IG1pbjtcbiAgICB0aGlzLm1heCA9IG1heDtcbiAgICB0aGlzLnN0ZXAgPSBzdGVwO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSBNYXRoLm1pbih0aGlzLm1heCwgTWF0aC5tYXgodGhpcy5taW4sIHZhbCkpO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RleHRJdGVtIGV4dGVuZHMgX0NvbnRyb2xJdGVtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAndGV4dCcsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RyaWdnZXJJdGVtIGV4dGVuZHMgX0NvbnRyb2xJdGVtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwpIHtcbiAgICBzdXBlcihjb250cm9sLCAndHJpZ2dlcicsIG5hbWUsIGxhYmVsKTtcbiAgfVxuXG4gIHNldCh2YWwpIHsgLyogbm90aGluZyB0byBzZXQgaGVyZSAqLyB9XG59XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLyogR1VJc1xuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0Jvb2xlYW5HdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCBpdGVtLCBndWlPcHRpb25zKSB7XG4gICAgY29uc3QgeyBsYWJlbCwgdmFsdWUgfSA9IGl0ZW07XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgYmFzaWNDb250cm9sbGVycy5Ub2dnbGUobGFiZWwsIHZhbHVlKTtcbiAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5yZW5kZXIoKSk7XG4gICAgdGhpcy5jb250cm9sbGVyLm9uUmVuZGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIub24oJ2NoYW5nZScsICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7aXRlbS5uYW1lfToke3ZhbHVlfVwiYDtcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtc2cpKSB7IHJldHVybjsgfVxuICAgICAgfVxuXG4gICAgICBpdGVtLnVwZGF0ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0VudW1HdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCBpdGVtLCBndWlPcHRpb25zKSB7XG4gICAgY29uc3QgeyBsYWJlbCwgb3B0aW9ucywgdmFsdWUgfSA9IGl0ZW07XG5cbiAgICBjb25zdCBjdG9yID0gZ3VpT3B0aW9ucy50eXBlID09PSAnYnV0dG9ucycgP1xuICAgICAgYmFzaWNDb250cm9sbGVycy5TZWxlY3RCdXR0b25zIDogYmFzaWNDb250cm9sbGVycy5TZWxlY3RMaXN0XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgY3RvcihsYWJlbCwgb3B0aW9ucywgdmFsdWUpO1xuICAgICRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLnJlbmRlcigpKTtcbiAgICB0aGlzLmNvbnRyb2xsZXIub25SZW5kZXIoKTtcblxuICAgIHRoaXMuY29udHJvbGxlci5vbignY2hhbmdlJywgKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoZ3VpT3B0aW9ucy5jb25maXJtKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIFwiJHtpdGVtLm5hbWV9OiR7dmFsdWV9XCJgO1xuICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICB9XG5cbiAgICAgIGl0ZW0udXBkYXRlKHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfTnVtYmVyR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgaXRlbSwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCB2YWx1ZSB9ID0gaXRlbTtcblxuICAgIGlmIChndWlPcHRpb25zLnR5cGUgPT09ICdzbGlkZXInKVxuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuU2xpZGVyKGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdmFsdWUsIGd1aU9wdGlvbnMuaXRlbSwgZ3VpT3B0aW9ucy5zaXplKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgYmFzaWNDb250cm9sbGVycy5OdW1iZXJCb3gobGFiZWwsIG1pbiwgbWF4LCBzdGVwLCB2YWx1ZSk7XG5cbiAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5yZW5kZXIoKSk7XG4gICAgdGhpcy5jb250cm9sbGVyLm9uUmVuZGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIub24oJ2NoYW5nZScsICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7aXRlbS5uYW1lfToke3ZhbHVlfVwiYDtcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtc2cpKSB7IHJldHVybjsgfVxuICAgICAgfVxuXG4gICAgICBpdGVtLnVwZGF0ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RleHRHdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCBpdGVtLCBndWlPcHRpb25zKSB7XG4gICAgY29uc3QgeyBsYWJlbCwgdmFsdWUgfSA9IGl0ZW07XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgYmFzaWNDb250cm9sbGVycy5UZXh0KGxhYmVsLCB2YWx1ZSwgZ3VpT3B0aW9ucy5yZWFkT25seSk7XG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgaWYgKCFndWlPcHRpb25zLnJlYWRPbmx5KSB7XG4gICAgICB0aGlzLmNvbnRyb2xsZXIub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICAgIGNvbnN0IG1zZyA9IGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIFwiJHtpdGVtLm5hbWV9XCJgO1xuICAgICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgICAgfVxuXG4gICAgICAgIGl0ZW0udXBkYXRlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RyaWdnZXJHdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCBpdGVtLCBndWlPcHRpb25zKSB7XG4gICAgY29uc3QgeyBsYWJlbCB9ID0gaXRlbTtcblxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBiYXNpY0NvbnRyb2xsZXJzLkJ1dHRvbnMoJycsIFtsYWJlbF0pO1xuICAgICRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLnJlbmRlcigpKTtcbiAgICB0aGlzLmNvbnRyb2xsZXIub25SZW5kZXIoKTtcblxuICAgIHRoaXMuY29udHJvbGxlci5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7aXRlbS5uYW1lfVwiYDtcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtc2cpKSB7IHJldHVybjsgfVxuICAgICAgfVxuXG4gICAgICBpdGVtLnVwZGF0ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkgeyAvKiBub3RoaW5nIHRvIHNldCBoZXJlICovIH1cbn1cblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLXBhcmFtcyc7XG5cbi8qKlxuICogTWFuYWdlIHRoZSBnbG9iYWwgY29udHJvbCBgcGFyYW1ldGVyc2AsIGBpbmZvc2AsIGFuZCBgY29tbWFuZHNgIGFjcm9zcyB0aGUgd2hvbGUgc2NlbmFyaW8uXG4gKlxuICogVGhlIG1vZHVsZSBrZWVwcyB0cmFjayBvZjpcbiAqIC0gYHBhcmFtZXRlcnNgOiB2YWx1ZXMgdGhhdCBjYW4gYmUgdXBkYXRlZCBieSB0aGUgYWN0aW9ucyBvZiB0aGUgY2xpZW50cyAoKmUuZy4qIHRoZSBnYWluIG9mIGEgc3ludGgpO1xuICogLSBgaW5mb3NgOiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc3RhdGUgb2YgdGhlIHNjZW5hcmlvICgqZS5nLiogbnVtYmVyIG9mIGNsaWVudHMgaW4gdGhlIHBlcmZvcm1hbmNlKTtcbiAqIC0gYGNvbW1hbmRzYDogY2FuIHRyaWdnZXIgYW4gYWN0aW9uICgqZS5nLiogcmVsb2FkIHRoZSBwYWdlKS5cbiAqXG4gKiBJZiB0aGUgbW9kdWxlIGlzIGluc3RhbnRpYXRlZCB3aXRoIHRoZSBgZ3VpYCBvcHRpb24gc2V0IHRvIGB0cnVlYCwgaXQgY29uc3RydWN0cyBhIGdyYXBoaWNhbCBpbnRlcmZhY2UgdG8gbW9kaWZ5IHRoZSBwYXJhbWV0ZXJzLCB2aWV3IHRoZSBpbmZvcywgYW5kIHRyaWdnZXIgdGhlIGNvbW1hbmRzLlxuICogT3RoZXJ3aXNlIChgZ3VpYCBvcHRpb24gc2V0IHRvIGBmYWxzZWApIHRoZSBtb2R1bGUgZW1pdHMgYW4gZXZlbnQgd2hlbiBpdCByZWNlaXZlcyB1cGRhdGVkIHZhbHVlcyBmcm9tIHRoZSBzZXJ2ZXIuXG4gKlxuICogV2hlbiB0aGUgR1VJIGlzIGRpc2FibGVkLCB0aGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBpbW1lZGlhdGVseSBhZnRlciBoYXZpbmcgc2V0IHVwIHRoZSBjb250cm9scy5cbiAqIE90aGVyd2lzZSAoR1VJIGVuYWJsZWQpLCB0aGUgbW9kdWxlcyByZW1haW5zIGluIGl0cyBzdGF0ZSBhbmQgbmV2ZXIgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uLlxuICpcbiAqIFdoZW4gdGhlIG1vZHVsZSBhIHZpZXcgKGBndWlgIG9wdGlvbiBzZXQgdG8gYHRydWVgKSwgaXQgcmVxdWlyZXMgdGhlIFNBU1MgcGFydGlhbCBgXzc3LWNoZWNraW4uc2Nzc2AuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlckNvbnRyb2wuanN+U2VydmVyQ29udHJvbH0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSAvLyBFeGFtcGxlIDE6IG1ha2UgYSBjbGllbnQgdGhhdCBkaXNwbGF5cyB0aGUgY29udHJvbCBHVUlcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgQ2xpZW50U2hhcmVkUGFyYW1zKCk7XG4gKlxuICogLy8gSW5pdGlhbGl6ZSB0aGUgY2xpZW50IChpbmRpY2F0ZSB0aGUgY2xpZW50IHR5cGUpXG4gKiBjbGllbnQuaW5pdCgnY29uZHVjdG9yJyk7IC8vIGFjY2Vzc2libGUgYXQgdGhlIFVSTCAvY29uZHVjdG9yXG4gKlxuICogLy8gU3RhcnQgdGhlIHNjZW5hcmlvXG4gKiAvLyBGb3IgdGhpcyBjbGllbnQgdHlwZSAoYCdjb25kdWN0b3InYCksIHRoZXJlIGlzIG9ubHkgb25lIG1vZHVsZVxuICogY2xpZW50LnN0YXJ0KGNvbnRyb2wpO1xuICpcbiAqIEBleGFtcGxlIC8vIEV4YW1wbGUgMjogbGlzdGVuIGZvciBwYXJhbWV0ZXIsIGluZm9zICYgY29tbWFuZHMgdXBkYXRlc1xuICogY29uc3QgY29udHJvbCA9IG5ldyBDbGllbnRTaGFyZWRQYXJhbXMoeyBndWk6IGZhbHNlIH0pO1xuICpcbiAqIC8vIExpc3RlbiBmb3IgcGFyYW1ldGVyLCBpbmZvcyBvciBjb21tYW5kIHVwZGF0ZXNcbiAqIGNvbnRyb2wub24oJ3VwZGF0ZScsIChuYW1lLCB2YWx1ZSkgPT4ge1xuICogICBzd2l0Y2gobmFtZSkge1xuICogICAgIGNhc2UgJ3N5bnRoOmdhaW4nOlxuICogICAgICAgY29uc29sZS5sb2coYFVwZGF0ZSB0aGUgc3ludGggZ2FpbiB0byB2YWx1ZSAje3ZhbHVlfS5gKTtcbiAqICAgICAgIGJyZWFrO1xuICogICAgIGNhc2UgJ3JlbG9hZCc6XG4gKiAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpO1xuICogICAgICAgYnJlYWs7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIC8vIEdldCBjdXJyZW50IHZhbHVlIG9mIGEgcGFyYW1ldGVyIG9yIGluZm9cbiAqIGNvbnN0IGN1cnJlbnRTeW50aEdhaW5WYWx1ZSA9IGNvbnRyb2wuZXZlbnRbJ3N5bnRoOmdhaW4nXS52YWx1ZTtcbiAqIGNvbnN0IGN1cnJlbnROdW1QbGF5ZXJzVmFsdWUgPSBjb250cm9sLmV2ZW50WydudW1QbGF5ZXJzJ10udmFsdWU7XG4gKi9cbmNsYXNzIENsaWVudFNoYXJlZFBhcmFtcyBleHRlbmRzIFNlcnZpY2Uge1xuICAvKipcbiAgICogQGVtaXRzIHsndXBkYXRlJ30gd2hlbiB0aGUgc2VydmVyIHNlbmRzIGFuIHVwZGF0ZS4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRha2VzIGBuYW1lOlN0cmluZ2AgYW5kIGB2YWx1ZToqYCBhcyBhcmd1bWVudHMsIHdoZXJlIGBuYW1lYCBpcyB0aGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyIC8gaW5mbyAvIGNvbW1hbmQsIGFuZCBgdmFsdWVgIGl0cyBuZXcgdmFsdWUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmhhc0d1aT10cnVlXSAtIEluZGljYXRlcyB3aGV0aGVyIHRvIGNyZWF0ZSB0aGUgZ3JhcGhpY2FsIHVzZXIgaW50ZXJmYWNlIHRvIGNvbnRyb2wgdGhlIHBhcmFtZXRlcnMgb3Igbm90LlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0geyBoYXNHdWk6IGZhbHNlIH07XG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgdGhpcy5fZ3VpT3B0aW9ucyA9IHt9O1xuXG4gICAgdGhpcy5fb25Jbml0UmVzcG9uc2UgPSB0aGlzLl9vbkluaXRSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uVXBkYXRlUmVzcG9uc2UgPSB0aGlzLl9vblVwZGF0ZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIC8qKlxuICAgICAqIERpY3Rpb25hcnkgb2YgYWxsIHRoZSBwYXJhbWV0ZXJzIGFuZCBjb21tYW5kcy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuaXRlbXMgPSB7fTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaGFzR3VpKVxuICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnaW5pdCcsIHRoaXMuX29uSW5pdFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3VwZGF0ZScsIHRoaXMuX29uVXBkYXRlUmVzcG9uc2UpO1xuXG4gICAgLy8gdGhpcy5zaG93KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgLy8gZG9uJ3QgcmVtb3ZlICd1cGRhdGUnIGxpc3RlbmVyLCBhcyB0aGUgY29udHJvbCBpcyBydW5uaWcgYXMgYSBiYWNrZ3JvdW5kIHByb2Nlc3NcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdpbml0JywgdGhpcy5fb25Jbml0UmVzcG9uc2UpO1xuICB9XG5cbiAgX29uSW5pdFJlc3BvbnNlKGNvbmZpZykge1xuICAgIHRoaXMuc2hvdygpO1xuXG4gICAgY29uZmlnLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBjb25zdCBpdGVtID0gdGhpcy5fY3JlYXRlQ29udHJvbEl0ZW0oZW50cnkpO1xuICAgICAgdGhpcy5pdGVtc1tpdGVtLm5hbWVdID0gaXRlbTtcblxuICAgICAgaWYgKHRoaXMudmlldylcbiAgICAgICAgdGhpcy5fY3JlYXRlR3VpKHRoaXMudmlldywgaXRlbSk7XG4gICAgfSk7XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5oYXNHdWkpXG4gICAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICBfb25VcGRhdGVSZXNwb25zZShuYW1lLCB2YWwpIHtcbiAgICAvLyB1cGRhdGUsIGJ1dCBkb24ndCBzZW5kIGJhY2sgdG8gc2VydmVyXG4gICAgdGhpcy51cGRhdGUobmFtZSwgdmFsLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGxpc3RlbmVyIHRvIGEgc3BlY2lmaWMgZXZlbnQgKGkuZS4gcGFyYW1ldGVyLCBpbmZvIG9yIGNvbW1hbmQpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTGlzdGVuZXIgY2FsbGJhY2suXG4gICAqL1xuICBhZGRJdGVtTGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBpdGVtID0gdGhpcy5pdGVtc1tuYW1lXTtcblxuICAgIGlmIChpdGVtKSB7XG4gICAgICBpdGVtLmFkZExpc3RlbmVyKCd1cGRhdGUnLCBsaXN0ZW5lcik7XG5cbiAgICAgIGlmIChpdGVtLnR5cGUgIT09ICdjb21tYW5kJylcbiAgICAgICAgbGlzdGVuZXIoaXRlbS52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIGl0ZW0gXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnJvbSBhIHNwZWNpZmljIGV2ZW50IChpLmUuIHBhcmFtZXRlciwgaW5mbyBvciBjb21tYW5kKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIExpc3RlbmVyIGNhbGxiYWNrLlxuICAgKi9cbiAgcmVtb3ZlSXRlbUxpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuaXRlbXNbbmFtZV07XG5cbiAgICBpZiAoaXRlbSkge1xuICAgICAgaXRlbS5yZW1vdmVMaXN0ZW5lcigndXBkYXRlJywgbGlzdGVuZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBpdGVtIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSB2YWx1ZSBvZiBhIGdpdmVuIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcmV0dXJucyB7TWl4ZWR9IC0gVGhlIHJlbGF0ZWQgdmFsdWUuXG4gICAqL1xuICBnZXRWYWx1ZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXNbbmFtZV0udmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgYSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHsoU3RyaW5nfE51bWJlcnxCb29sZWFuKX0gdmFsIC0gTmV3IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3NlbmRUb1NlcnZlcj10cnVlXSAtIEZsYWcgd2hldGhlciB0aGUgdmFsdWUgaXMgc2VudCB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbCwgc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zW25hbWVdO1xuXG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIGl0ZW0udXBkYXRlKHZhbCwgc2VuZFRvU2VydmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gY29udHJvbCBpdGVtIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICBfY3JlYXRlQ29udHJvbEl0ZW0oaW5pdCkge1xuICAgIGxldCBpdGVtID0gbnVsbDtcblxuICAgIHN3aXRjaCAoaW5pdC50eXBlKSB7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgaXRlbSA9IG5ldyBfQm9vbGVhbkl0ZW0odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2VudW0nOlxuICAgICAgICBpdGVtID0gbmV3IF9FbnVtSXRlbSh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQub3B0aW9ucywgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBpdGVtID0gbmV3IF9OdW1iZXJJdGVtKHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC5taW4sIGluaXQubWF4LCBpbml0LnN0ZXAsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgIGl0ZW0gPSBuZXcgX1RleHRJdGVtKHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd0cmlnZ2VyJzpcbiAgICAgICAgaXRlbSA9IG5ldyBfVHJpZ2dlckl0ZW0odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlIHRoZSBHVUkgZm9yIGEgc3BlY2lmaWMgY29udHJvbCBpdGVtIChlLmcuIGlmIGl0IHNob3VsZCBhcHBlYXIgb3Igbm90LFxuICAgKiB3aGljaCB0eXBlIG9mIEdVSSB0byB1c2UpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBgaXRlbWAgdG8gY29uZmlndXJlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGFwcGx5IHRvIGNvbmZpZ3VyZSB0aGUgZ2l2ZW4gYGl0ZW1gLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy50eXBlIC0gVGhlIHR5cGUgb2YgR1VJIHRvIHVzZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93PXRydWVdIC0gU2hvdyB0aGUgR1VJIGZvciB0aGlzIGBpdGVtYCBvciBub3QuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuY29uZmlybT1mYWxzZV0gLSBBc2sgZm9yIGNvbmZpcm1hdGlvbiB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgKi9cbiAgc2V0R3VpT3B0aW9ucyhuYW1lLCBvcHRpb25zKSB7XG4gICAgdGhpcy5fZ3VpT3B0aW9uc1tuYW1lXSA9IG9wdGlvbnM7XG4gIH1cblxuICBfY3JlYXRlR3VpKHZpZXcsIGl0ZW0pIHtcbiAgICBjb25zdCBjb25maWcgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBjb25maXJtOiBmYWxzZSxcbiAgICB9LCB0aGlzLl9ndWlPcHRpb25zW2l0ZW0ubmFtZV0pO1xuXG4gICAgaWYgKGNvbmZpZy5zaG93ID09PSBmYWxzZSkgcmV0dXJuIG51bGw7XG5cbiAgICBsZXQgZ3VpID0gbnVsbDtcbiAgICBjb25zdCAkY29udGFpbmVyID0gdGhpcy52aWV3LiRlbDtcblxuICAgIHN3aXRjaCAoaXRlbS50eXBlKSB7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgZ3VpID0gbmV3IF9Cb29sZWFuR3VpKCRjb250YWluZXIsIGl0ZW0sIGNvbmZpZyk7IC8vIGBUb2dnbGVgXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZW51bSc6XG4gICAgICAgIGd1aSA9IG5ldyBfRW51bUd1aSgkY29udGFpbmVyLCBpdGVtLCBjb25maWcpOyAvLyBgU2VsZWN0TGlzdGAgb3IgYFNlbGVjdEJ1dHRvbnNgXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgZ3VpID0gbmV3IF9OdW1iZXJHdWkoJGNvbnRhaW5lciwgaXRlbSwgY29uZmlnKTsgLy8gYE51bWJlckJveGAgb3IgYFNsaWRlcmBcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgZ3VpID0gbmV3IF9UZXh0R3VpKCRjb250YWluZXIsIGl0ZW0sIGNvbmZpZyk7IC8vIGBUZXh0YFxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RyaWdnZXInOlxuICAgICAgICBndWkgPSBuZXcgX1RyaWdnZXJHdWkoJGNvbnRhaW5lciwgaXRlbSwgY29uZmlnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaXRlbS5hZGRMaXN0ZW5lcigndXBkYXRlJywgKHZhbCkgPT4gZ3VpLnNldCh2YWwpKTtcblxuICAgIHJldHVybiBndWk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2xpZW50U2hhcmVkUGFyYW1zKTtcblxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50U2hhcmVkUGFyYW1zO1xuIl19