'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

var _events = require('events');

/**
 * @private
 */

var _ControlEvent = (function (_EventEmitter) {
  _inherits(_ControlEvent, _EventEmitter);

  function _ControlEvent(control, type, name, label) {
    _classCallCheck(this, _ControlEvent);

    _get(Object.getPrototypeOf(_ControlEvent.prototype), 'constructor', this).call(this);
    this.control = control;
    this.type = type;
    this.name = name;
    this.label = label;
    this.value = undefined;
  }

  /**
   * @private
   */

  _createClass(_ControlEvent, [{
    key: 'set',
    value: function set(val) {
      this.value = value;
    }
  }, {
    key: 'update',
    value: function update() {
      var val = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
      var sendToServer = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      if (val === undefined) this.set(val); // set value

      this.emit(this.name, this.value); // call event listeners

      if (sendToServer) this.control.send('update', this.name, this.value); // send to server

      this.control.emit('update', this.name, this.value); // call control listeners
    }
  }]);

  return _ControlEvent;
})(_events.EventEmitter);

var _ControlNumber = (function (_ControlEvent2) {
  _inherits(_ControlNumber, _ControlEvent2);

  function _ControlNumber(control, name, label, min, max, step, init) {
    _classCallCheck(this, _ControlNumber);

    _get(Object.getPrototypeOf(_ControlNumber.prototype), 'constructor', this).call(this, control, 'number', name, label);
    this.min = min;
    this.max = max;
    this.step = step;
    this.set(init);
  }

  _createClass(_ControlNumber, [{
    key: 'set',
    value: function set(val) {
      this.value = Math.min(this.max, Math.max(this.min, val));
    }
  }, {
    key: 'incr',
    value: function incr() {
      var steps = Math.floor(this.value / this.step + 0.5);
      this.value = this.step * (steps + 1);
    }
  }, {
    key: 'decr',
    value: function decr() {
      var steps = Math.floor(this.value / this.step + 0.5);
      this.value = this.step * (steps - 1);
    }
  }]);

  return _ControlNumber;
})(_ControlEvent);

var _ControlSelect = (function (_ControlEvent3) {
  _inherits(_ControlSelect, _ControlEvent3);

  function _ControlSelect(control, name, label, options, init) {
    _classCallCheck(this, _ControlSelect);

    _get(Object.getPrototypeOf(_ControlSelect.prototype), 'constructor', this).call(this, control, 'select', name, label);
    this.options = options;
    this.set(init);
  }

  _createClass(_ControlSelect, [{
    key: 'set',
    value: function set(val) {
      var index = this.options.indexOf(val);

      if (index >= 0) {
        this.index = index;
        this.value = val;
      }
    }
  }, {
    key: 'incr',
    value: function incr() {
      this.index = (this.index + 1) % this.options.length;
      this.value = this.options[this.index];
    }
  }, {
    key: 'decr',
    value: function decr() {
      this.index = (this.index + this.options.length - 1) % this.options.length;
      this.value = this.options[this.index];
    }
  }]);

  return _ControlSelect;
})(_ControlEvent);

var _ControlInfo = (function (_ControlEvent4) {
  _inherits(_ControlInfo, _ControlEvent4);

  function _ControlInfo(control, name, label, init) {
    _classCallCheck(this, _ControlInfo);

    _get(Object.getPrototypeOf(_ControlInfo.prototype), 'constructor', this).call(this, control, 'info', name, label);
    this.set(init);
  }

  _createClass(_ControlInfo, [{
    key: 'set',
    value: function set(val) {
      this.value = val;
    }
  }]);

  return _ControlInfo;
})(_ControlEvent);

var _ControlCommand = (function (_ControlEvent5) {
  _inherits(_ControlCommand, _ControlEvent5);

  function _ControlCommand(control, name, label) {
    _classCallCheck(this, _ControlCommand);

    _get(Object.getPrototypeOf(_ControlCommand.prototype), 'constructor', this).call(this, control, 'command', name, label);
  }

  /**
   * @private
   */

  _createClass(_ControlCommand, [{
    key: 'set',
    value: function set(val) {
      // nothing to set here
    }
  }]);

  return _ControlCommand;
})(_ControlEvent);

var _NumberGui = (function (_EventEmitter2) {
  _inherits(_NumberGui, _EventEmitter2);

  function _NumberGui(view, event) {
    var _this = this;

    _classCallCheck(this, _NumberGui);

    _get(Object.getPrototypeOf(_NumberGui.prototype), 'constructor', this).call(this);
    this.event = event;

    var box = document.createElement('input');
    box.setAttribute('id', event.name + '-box');
    box.setAttribute('type', 'number');
    box.setAttribute('min', event.min);
    box.setAttribute('max', event.max);
    box.setAttribute('step', event.step);
    box.setAttribute('value', event.value);
    box.setAttribute('size', 16);

    box.onchange = function () {
      var val = Number(box.value);
      _this.event.update(val);
    };

    this.box = box;

    var incrButton = document.createElement('button');
    incrButton.setAttribute('id', event.name + '-incr');
    incrButton.setAttribute('width', '0.5em');
    incrButton.innerHTML = '>';
    incrButton.onclick = function () {
      _this.event.incr();
      _this.event.update();
    };

    var decrButton = document.createElement('button');
    decrButton.setAttribute('id', event.name + '-decr');
    decrButton.style.width = '0.5em';
    decrButton.innerHTML = '<';
    decrButton.onclick = function () {
      _this.event.decr();
      _this.event.update();
    };

    var label = document.createElement('span');
    label.innerHTML = event.label + ': ';

    var div = document.createElement('div');
    div.appendChild(label);
    div.appendChild(decrButton);
    div.appendChild(box);
    div.appendChild(incrButton);
    div.appendChild(document.createElement('br'));

    view.appendChild(div);
  }

  /**
   * @private
   */

  _createClass(_NumberGui, [{
    key: 'set',
    value: function set(val) {
      this.box.value = val;
    }
  }]);

  return _NumberGui;
})(_events.EventEmitter);

var _SelectGui = (function (_EventEmitter3) {
  _inherits(_SelectGui, _EventEmitter3);

  function _SelectGui(view, event) {
    var _this2 = this;

    _classCallCheck(this, _SelectGui);

    _get(Object.getPrototypeOf(_SelectGui.prototype), 'constructor', this).call(this);
    this.event = event;

    var box = document.createElement('select');
    box.setAttribute('id', event.name + '-box');

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(event.options), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var option = _step.value;

        var optElem = document.createElement("option");
        optElem.value = option;
        optElem.text = option;
        box.appendChild(optElem);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    box.onchange = function () {
      _this2.event.update(box.value);
    };

    this.box = box;

    var incrButton = document.createElement('button');
    incrButton.setAttribute('id', event.name + '-incr');
    incrButton.setAttribute('width', '0.5em');
    incrButton.innerHTML = '>';
    incrButton.onclick = function () {
      _this2.event.incr();
      _this2.event.update();
    };

    var decrButton = document.createElement('button');
    decrButton.setAttribute('id', event.name + '-decr');
    decrButton.style.width = '0.5em';
    decrButton.innerHTML = '<';
    decrButton.onclick = function () {
      _this2.event.decr();
      _this2.event.update();
    };

    var label = document.createElement('span');
    label.innerHTML = event.label + ': ';

    var div = document.createElement('div');
    div.appendChild(label);
    div.appendChild(decrButton);
    div.appendChild(box);
    div.appendChild(incrButton);
    div.appendChild(document.createElement('br'));

    view.appendChild(div);
  }

  /**
   * @private
   */

  _createClass(_SelectGui, [{
    key: 'set',
    value: function set(val) {
      this.box.value = val;
    }
  }]);

  return _SelectGui;
})(_events.EventEmitter);

var _InfoGui = (function (_EventEmitter4) {
  _inherits(_InfoGui, _EventEmitter4);

  function _InfoGui(view, event) {
    _classCallCheck(this, _InfoGui);

    _get(Object.getPrototypeOf(_InfoGui.prototype), 'constructor', this).call(this);
    this.event = event;

    var box = document.createElement('span');
    box.setAttribute('id', event.name + '-box');

    var label = document.createElement('span');
    label.innerHTML = event.label + ': ';

    var div = document.createElement('div');
    div.appendChild(label);
    div.appendChild(box);
    div.appendChild(document.createElement('br'));

    view.appendChild(div);

    this.box = box;
  }

  /**
   * @private
   */

  _createClass(_InfoGui, [{
    key: 'set',
    value: function set(val) {
      this.box.innerHTML = val;
    }
  }]);

  return _InfoGui;
})(_events.EventEmitter);

var _CommandGui = (function (_EventEmitter5) {
  _inherits(_CommandGui, _EventEmitter5);

  function _CommandGui(view) {
    var _this3 = this;

    _classCallCheck(this, _CommandGui);

    _get(Object.getPrototypeOf(_CommandGui.prototype), 'constructor', this).call(this);
    this.event = event;

    var div = document.createElement('div');
    div.setAttribute('id', this.name + '-btn');
    div.classList.add('command');
    div.innerHTML = this.label;

    div.onclick = function () {
      _this3.event.update();
    };

    view.appendChild(div);
    view.appendChild(document.createElement('br'));
  }

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
   * const control = new ClientControl();
   *
   * // Initialize the client (indicate the client type)
   * client.init('conductor'); // accessible at the URL /conductor
   *
   * // Start the scenario
   * // For this client type (`'conductor'`), there is only one module
   * client.start(control);
   *
   * @example // Example 2: listen for parameter, infos & commands updates
   * const control = new ClientControl({ gui: false });
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

  _createClass(_CommandGui, [{
    key: 'set',
    value: function set(val) {
      // nothing to set here
    }
  }]);

  return _CommandGui;
})(_events.EventEmitter);

var ClientControl = (function (_ClientModule) {
  _inherits(ClientControl, _ClientModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='sync'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {Boolean} [options.gui=true] Indicates whether to create the graphical user interface to control the parameters or not.
   * @emits {'update'} when the server sends an update. The callback function takes `name:String` and `value:*` as arguments, where `name` is the name of the parameter / info / command, and `value` its new value.
   */

  function ClientControl() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientControl);

    _get(Object.getPrototypeOf(ClientControl.prototype), 'constructor', this).call(this, options.name || 'control', options.hasGui === true, options.color);

    /**
     * Dictionary of all the parameters and commands.
     * @type {Object}
     */
    this.events = {};

    /**
     * Flag whether client has control GUI.
     * @type {Boolean}
     */
    this.hasGui = options.hasGui;
  }

  /**
   * Adds a listener to a specific event (i.e. parameter, info or command).
   * @param {String} name Name of the event.
   * @param {Function} listener Listener callback.
   */

  _createClass(ClientControl, [{
    key: 'addEventListener',
    value: function addEventListener(name, listener) {
      var event = this.events[name];

      if (event) event.addListener(listener);else console.log('unknown control event "' + name + '"');
    }

    /**
     * Removes a listener from a specific event (i.e. parameter, info or command).
     * @param {String} name Name of the event.
     * @param {Function} listener Listener callback.
     */
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(name, listener) {
      var event = this.events[name];

      if (event) event.removeListener(listener);else console.log('unknown control event "' + name + '"');
    }

    /**
     * Updates the value of a parameter.
     * @param {String} name Name of the parameter to update.
     * @param {(String|Number|Boolean)} val New value of the parameter.
     */
  }, {
    key: 'update',
    value: function update(name, val) {
      var sendToServer = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      var event = this.events[name];

      if (event) {
        event.update(val, sendToServer);
      } else {
        console.log('unknown control event "' + name + '"');
      }
    }
  }, {
    key: '_createEvent',
    value: function _createEvent(init) {
      var event = null;

      switch (init.type) {
        case 'number':
          event = new _ControlNumber(this, init.name, init.label, init.min, init.max, init.step, init.value);
          break;

        case 'select':
          event = new _ControlSelect(this, init.name, init.label, init.options, init.value);
          break;

        case 'info':
          event = new _ControlInfo(this, init.name, init.label, init.value);
          break;

        case 'command':
          event = new _ControlCommand(this, init.name, init.label);
          break;
      }

      return event;
    }
  }, {
    key: '_createGui',
    value: function _createGui(view, event) {
      var gui = null;

      switch (event.type) {
        case 'number':
          gui = new _NumberGui(view, event);
          break;

        case 'select':
          gui = new _SelectGui(view, event);
          break;

        case 'info':
          gui = new _InfoGui(view, event);
          break;

        case 'command':
          gui = new _CommandGui(view, event);
          break;
      }

      return gui;
    }

    /**
     * Starts the module and requests the parameters to the server.
     */
  }, {
    key: 'start',
    value: function start() {
      var _this4 = this;

      _get(Object.getPrototypeOf(ClientControl.prototype), 'start', this).call(this);

      this.send('request');

      var view = this.hasGui ? this.$container : null;

      this.receive('init', function (data) {
        if (view) {
          var title = document.createElement('h1');
          title.innerHTML = 'Conductor';
          view.appendChild(title);
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _getIterator(data), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var d = _step2.value;

            var _event = _this4._createEvent(d);
            _this4.events[_event.name] = _event;

            if (view) _this4._createGui(view, _event);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
              _iterator2['return']();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        if (!view) _this4.done();
      });

      // listen to events
      this.receive('update', function (name, val) {
        var event = _this4.events[name];

        if (event) _this4.update(name, val, false); // update, but don't send to server
        else console.log('client control: received unknown event "' + name + '"');
      });
    }

    /**
     * Restarts the module and requests the parameters to the server.
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(ClientControl.prototype), 'restart', this).call(this);
      this.send('request');
    }
  }]);

  return ClientControl;
})(_ClientModule3['default']);

exports['default'] = ClientControl;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBQXlCLGdCQUFnQjs7OztzQkFDWixRQUFROzs7Ozs7SUFLL0IsYUFBYTtZQUFiLGFBQWE7O0FBQ04sV0FEUCxhQUFhLENBQ0wsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFOzBCQURwQyxhQUFhOztBQUVmLCtCQUZFLGFBQWEsNkNBRVA7QUFDUixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixRQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztHQUN4Qjs7Ozs7O2VBUkcsYUFBYTs7V0FVZCxhQUFDLEdBQUcsRUFBRTtBQUNQLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQ3BCOzs7V0FFSyxrQkFBdUM7VUFBdEMsR0FBRyx5REFBRyxTQUFTO1VBQUUsWUFBWSx5REFBRyxJQUFJOztBQUN6QyxVQUFHLEdBQUcsS0FBSyxTQUFTLEVBQ2xCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRWhCLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWpDLFVBQUcsWUFBWSxFQUNiLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFckQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3BEOzs7U0F4QkcsYUFBYTs7O0lBOEJiLGNBQWM7WUFBZCxjQUFjOztBQUNQLFdBRFAsY0FBYyxDQUNOLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTswQkFEcEQsY0FBYzs7QUFFaEIsK0JBRkUsY0FBYyw2Q0FFVixPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDdEMsUUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixRQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDaEI7O2VBUEcsY0FBYzs7V0FTZixhQUFDLEdBQUcsRUFBRTtBQUNQLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQzFEOzs7V0FFRyxnQkFBRztBQUNMLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ3JELFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQztLQUN0Qzs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNyRCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUM7S0FDdEM7OztTQXJCRyxjQUFjO0dBQVMsYUFBYTs7SUF3QnBDLGNBQWM7WUFBZCxjQUFjOztBQUNQLFdBRFAsY0FBYyxDQUNOLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUU7MEJBRDdDLGNBQWM7O0FBRWhCLCtCQUZFLGNBQWMsNkNBRVYsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3RDLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDaEI7O2VBTEcsY0FBYzs7V0FPZixhQUFDLEdBQUcsRUFBRTtBQUNQLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUV0QyxVQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7QUFDZCxZQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixZQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztPQUNsQjtLQUNGOzs7V0FFRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQSxHQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQ3BELFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDdkM7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBLEdBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDMUUsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN2Qzs7O1NBeEJHLGNBQWM7R0FBUyxhQUFhOztJQTJCcEMsWUFBWTtZQUFaLFlBQVk7O0FBQ0wsV0FEUCxZQUFZLENBQ0osT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFOzBCQURwQyxZQUFZOztBQUVkLCtCQUZFLFlBQVksNkNBRVIsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3BDLFFBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDaEI7O2VBSkcsWUFBWTs7V0FNYixhQUFDLEdBQUcsRUFBRTtBQUNQLFVBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0tBQ2xCOzs7U0FSRyxZQUFZO0dBQVMsYUFBYTs7SUFXbEMsZUFBZTtZQUFmLGVBQWU7O0FBQ1IsV0FEUCxlQUFlLENBQ1AsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7MEJBRDlCLGVBQWU7O0FBRWpCLCtCQUZFLGVBQWUsNkNBRVgsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFO0dBQ3hDOzs7Ozs7ZUFIRyxlQUFlOztXQUtoQixhQUFDLEdBQUcsRUFBRTs7S0FFUjs7O1NBUEcsZUFBZTtHQUFTLGFBQWE7O0lBYXJDLFVBQVU7WUFBVixVQUFVOztBQUNILFdBRFAsVUFBVSxDQUNGLElBQUksRUFBRSxLQUFLLEVBQUU7OzswQkFEckIsVUFBVTs7QUFFWiwrQkFGRSxVQUFVLDZDQUVKO0FBQ1IsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7O0FBRW5CLFFBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDMUMsT0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQztBQUM1QyxPQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuQyxPQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkMsT0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25DLE9BQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxPQUFHLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkMsT0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRTdCLE9BQUcsQ0FBQyxRQUFRLEdBQUksWUFBTTtBQUNwQixVQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVCLFlBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUN4QixBQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7O0FBRWYsUUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsRCxjQUFVLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQ3BELGNBQVUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzFDLGNBQVUsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBQzNCLGNBQVUsQ0FBQyxPQUFPLEdBQUksWUFBTTtBQUMxQixZQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNsQixZQUFLLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNyQixBQUFDLENBQUM7O0FBRUgsUUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsRCxjQUFVLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQ3BELGNBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztBQUNqQyxjQUFVLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUMzQixjQUFVLENBQUMsT0FBTyxHQUFJLFlBQU07QUFDMUIsWUFBSyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbEIsWUFBSyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDckIsQUFBQyxDQUFDOztBQUVILFFBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0MsU0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFckMsUUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxPQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZCLE9BQUcsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUIsT0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixPQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzVCLE9BQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUU5QyxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ3ZCOzs7Ozs7ZUFsREcsVUFBVTs7V0FvRFgsYUFBQyxHQUFHLEVBQUU7QUFDUCxVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7S0FDdEI7OztTQXRERyxVQUFVOzs7SUE0RFYsVUFBVTtZQUFWLFVBQVU7O0FBQ0gsV0FEUCxVQUFVLENBQ0YsSUFBSSxFQUFFLEtBQUssRUFBRTs7OzBCQURyQixVQUFVOztBQUVaLCtCQUZFLFVBQVUsNkNBRUo7QUFDUixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7QUFFbkIsUUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzQyxPQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDOzs7Ozs7O0FBRTVDLHdDQUFtQixLQUFLLENBQUMsT0FBTyw0R0FBRTtZQUF6QixNQUFNOztBQUNiLFlBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0MsZUFBTyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7QUFDdkIsZUFBTyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7QUFDdEIsV0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUMxQjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELE9BQUcsQ0FBQyxRQUFRLEdBQUksWUFBTTtBQUNwQixhQUFLLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzlCLEFBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQzs7QUFFZixRQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELGNBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUM7QUFDcEQsY0FBVSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDMUMsY0FBVSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFDM0IsY0FBVSxDQUFDLE9BQU8sR0FBSSxZQUFNO0FBQzFCLGFBQUssS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2xCLGFBQUssS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ3JCLEFBQUMsQ0FBQzs7QUFFSCxRQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELGNBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUM7QUFDcEQsY0FBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ2pDLGNBQVUsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBQzNCLGNBQVUsQ0FBQyxPQUFPLEdBQUksWUFBTTtBQUMxQixhQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNsQixhQUFLLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNyQixBQUFDLENBQUM7O0FBRUgsUUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQyxTQUFLLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVyQyxRQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLE9BQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkIsT0FBRyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM1QixPQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLE9BQUcsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUIsT0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRTlDLFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDdkI7Ozs7OztlQWxERyxVQUFVOztXQW9EWCxhQUFDLEdBQUcsRUFBRTtBQUNQLFVBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztLQUN0Qjs7O1NBdERHLFVBQVU7OztJQTREVixRQUFRO1lBQVIsUUFBUTs7QUFDRCxXQURQLFFBQVEsQ0FDQSxJQUFJLEVBQUUsS0FBSyxFQUFFOzBCQURyQixRQUFROztBQUVWLCtCQUZFLFFBQVEsNkNBRUY7QUFDUixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7QUFFbkIsUUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QyxPQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDOztBQUU1QyxRQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDLFNBQUssQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRXJDLFFBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEMsT0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QixPQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLE9BQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUU5QyxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUV0QixRQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztHQUNoQjs7Ozs7O2VBbkJHLFFBQVE7O1dBcUJULGFBQUMsR0FBRyxFQUFFO0FBQ1AsVUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0tBQzFCOzs7U0F2QkcsUUFBUTs7O0lBNkJSLFdBQVc7WUFBWCxXQUFXOztBQUNKLFdBRFAsV0FBVyxDQUNILElBQUksRUFBRTs7OzBCQURkLFdBQVc7O0FBRWIsK0JBRkUsV0FBVyw2Q0FFTDtBQUNSLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDOztBQUVuQixRQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLE9BQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFDM0MsT0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDN0IsT0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDOztBQUUzQixPQUFHLENBQUMsT0FBTyxHQUFJLFlBQU07QUFDbkIsYUFBSyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDckIsQUFBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEIsUUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDaEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2VBaEJHLFdBQVc7O1dBa0JaLGFBQUMsR0FBRyxFQUFFOztLQUVSOzs7U0FwQkcsV0FBVzs7O0lBc0VJLGFBQWE7WUFBYixhQUFhOzs7Ozs7Ozs7O0FBUXJCLFdBUlEsYUFBYSxHQVFOO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFSTCxhQUFhOztBQVM5QiwrQkFUaUIsYUFBYSw2Q0FTeEIsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUcsT0FBTyxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUcsT0FBTyxDQUFDLEtBQUssRUFBRTs7Ozs7O0FBTTNFLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNakIsUUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0dBQzlCOzs7Ozs7OztlQXRCa0IsYUFBYTs7V0E2QmhCLDBCQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDL0IsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFaEMsVUFBSSxLQUFLLEVBQ1AsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUU1QixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztLQUN2RDs7Ozs7Ozs7O1dBT2tCLDZCQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDbEMsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFaEMsVUFBSSxLQUFLLEVBQ1AsS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUUvQixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztLQUN2RDs7Ozs7Ozs7O1dBT0ssZ0JBQUMsSUFBSSxFQUFFLEdBQUcsRUFBdUI7VUFBckIsWUFBWSx5REFBRyxJQUFJOztBQUNuQyxVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVoQyxVQUFJLEtBQUssRUFBRTtBQUNULGFBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxDQUFDO09BQ2pDLE1BQU07QUFDTCxlQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztPQUNyRDtLQUNGOzs7V0FFVyxzQkFBQyxJQUFJLEVBQUU7QUFDakIsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVqQixjQUFRLElBQUksQ0FBQyxJQUFJO0FBQ2YsYUFBSyxRQUFRO0FBQ1gsZUFBSyxHQUFHLElBQUksY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25HLGdCQUFNOztBQUFBLEFBRVIsYUFBSyxRQUFRO0FBQ1gsZUFBSyxHQUFHLElBQUksY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEYsZ0JBQU07O0FBQUEsQUFFUixhQUFLLE1BQU07QUFDVCxlQUFLLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEUsZ0JBQU07O0FBQUEsQUFFUixhQUFLLFNBQVM7QUFDWixlQUFLLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pELGdCQUFNO0FBQUEsT0FDVDs7QUFFRCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7V0FFUyxvQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3RCLFVBQUksR0FBRyxHQUFHLElBQUksQ0FBQzs7QUFFZixjQUFRLEtBQUssQ0FBQyxJQUFJO0FBQ2hCLGFBQUssUUFBUTtBQUNYLGFBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEMsZ0JBQU07O0FBQUEsQUFFUixhQUFLLFFBQVE7QUFDWCxhQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2xDLGdCQUFNOztBQUFBLEFBRVIsYUFBSyxNQUFNO0FBQ1QsYUFBRyxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNoQyxnQkFBTTs7QUFBQSxBQUVSLGFBQUssU0FBUztBQUNaLGFBQUcsR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbkMsZ0JBQU07QUFBQSxPQUNUOztBQUVELGFBQU8sR0FBRyxDQUFDO0tBQ1o7Ozs7Ozs7V0FLSSxpQkFBRzs7O0FBQ04saUNBdkhpQixhQUFhLHVDQXVIaEI7O0FBRWQsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFckIsVUFBSSxJQUFJLEdBQUcsQUFBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUUsSUFBSSxDQUFDOztBQUVoRCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxVQUFDLElBQUksRUFBSztBQUM3QixZQUFJLElBQUksRUFBRTtBQUNSLGNBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekMsZUFBSyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUM7QUFDOUIsY0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN6Qjs7Ozs7OztBQUVELDZDQUFjLElBQUksaUhBQUU7Z0JBQVgsQ0FBQzs7QUFDUixnQkFBSSxNQUFLLEdBQUcsT0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakMsbUJBQUssTUFBTSxDQUFDLE1BQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFLLENBQUM7O0FBRWhDLGdCQUFHLElBQUksRUFDTCxPQUFLLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBSyxDQUFDLENBQUM7V0FDaEM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxZQUFJLENBQUMsSUFBSSxFQUNQLE9BQUssSUFBSSxFQUFFLENBQUM7T0FDZixDQUFDLENBQUM7OztBQUdILFVBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBSztBQUNwQyxZQUFNLEtBQUssR0FBRyxPQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFaEMsWUFBSSxLQUFLLEVBQ1AsT0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUU5QixPQUFPLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztPQUN4RSxDQUFDLENBQUM7S0FDSjs7Ozs7OztXQUtNLG1CQUFHO0FBQ1IsaUNBL0ppQixhQUFhLHlDQStKZDtBQUNoQixVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3RCOzs7U0FqS2tCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q29udHJvbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfQ29udHJvbEV2ZW50IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgdHlwZSwgbmFtZSwgbGFiZWwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY29udHJvbCA9IGNvbnRyb2w7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIHVwZGF0ZSh2YWwgPSB1bmRlZmluZWQsIHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICBpZih2YWwgPT09IHVuZGVmaW5lZClcbiAgICAgIHRoaXMuc2V0KHZhbCk7IC8vIHNldCB2YWx1ZVxuXG4gICAgdGhpcy5lbWl0KHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7IC8vIGNhbGwgZXZlbnQgbGlzdGVuZXJzXG5cbiAgICBpZihzZW5kVG9TZXJ2ZXIpXG4gICAgICB0aGlzLmNvbnRyb2wuc2VuZCgndXBkYXRlJywgdGhpcy5uYW1lLCB0aGlzLnZhbHVlKTsgLy8gc2VuZCB0byBzZXJ2ZXJcblxuICAgIHRoaXMuY29udHJvbC5lbWl0KCd1cGRhdGUnLCB0aGlzLm5hbWUsIHRoaXMudmFsdWUpOyAvLyBjYWxsIGNvbnRyb2wgbGlzdGVuZXJzXG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfQ29udHJvbE51bWJlciBleHRlbmRzIF9Db250cm9sRXZlbnQge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIGluaXQpIHtcbiAgICBzdXBlcihjb250cm9sLCAnbnVtYmVyJywgbmFtZSwgbGFiZWwpO1xuICAgIHRoaXMubWluID0gbWluO1xuICAgIHRoaXMubWF4ID0gbWF4O1xuICAgIHRoaXMuc3RlcCA9IHN0ZXA7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IE1hdGgubWluKHRoaXMubWF4LCBNYXRoLm1heCh0aGlzLm1pbiwgdmFsKSk7XG4gIH1cblxuICBpbmNyKCkge1xuICAgIGxldCBzdGVwcyA9IE1hdGguZmxvb3IodGhpcy52YWx1ZSAvIHRoaXMuc3RlcCArIDAuNSk7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuc3RlcCAqIChzdGVwcyArIDEpO1xuICB9XG5cbiAgZGVjcigpIHtcbiAgICBsZXQgc3RlcHMgPSBNYXRoLmZsb29yKHRoaXMudmFsdWUgLyB0aGlzLnN0ZXAgKyAwLjUpO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLnN0ZXAgKiAoc3RlcHMgLSAxKTtcbiAgfVxufVxuXG5jbGFzcyBfQ29udHJvbFNlbGVjdCBleHRlbmRzIF9Db250cm9sRXZlbnQge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgb3B0aW9ucywgaW5pdCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdzZWxlY3QnLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLm9wdGlvbnMuaW5kZXhPZih2YWwpO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgaW5jcigpIHtcbiAgICB0aGlzLmluZGV4ID0gKHRoaXMuaW5kZXggKyAxKSAlIHRoaXMub3B0aW9ucy5sZW5ndGg7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMub3B0aW9uc1t0aGlzLmluZGV4XTtcbiAgfVxuXG4gIGRlY3IoKSB7XG4gICAgdGhpcy5pbmRleCA9ICh0aGlzLmluZGV4ICsgdGhpcy5vcHRpb25zLmxlbmd0aCAtIDEpICUgdGhpcy5vcHRpb25zLmxlbmd0aDtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5vcHRpb25zW3RoaXMuaW5kZXhdO1xuICB9XG59XG5cbmNsYXNzIF9Db250cm9sSW5mbyBleHRlbmRzIF9Db250cm9sRXZlbnQge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgaW5pdCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdpbmZvJywgbmFtZSwgbGFiZWwpO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuY2xhc3MgX0NvbnRyb2xDb21tYW5kIGV4dGVuZHMgX0NvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2NvbW1hbmQnLCBuYW1lLCBsYWJlbCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgLy8gbm90aGluZyB0byBzZXQgaGVyZVxuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgX051bWJlckd1aSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKHZpZXcsIGV2ZW50KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmV2ZW50ID0gZXZlbnQ7XG5cbiAgICBsZXQgYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBib3guc2V0QXR0cmlidXRlKCdpZCcsIGV2ZW50Lm5hbWUgKyAnLWJveCcpO1xuICAgIGJveC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnbnVtYmVyJyk7XG4gICAgYm94LnNldEF0dHJpYnV0ZSgnbWluJywgZXZlbnQubWluKTtcbiAgICBib3guc2V0QXR0cmlidXRlKCdtYXgnLCBldmVudC5tYXgpO1xuICAgIGJveC5zZXRBdHRyaWJ1dGUoJ3N0ZXAnLCBldmVudC5zdGVwKTtcbiAgICBib3guc2V0QXR0cmlidXRlKCd2YWx1ZScsIGV2ZW50LnZhbHVlKTtcbiAgICBib3guc2V0QXR0cmlidXRlKCdzaXplJywgMTYpO1xuXG4gICAgYm94Lm9uY2hhbmdlID0gKCgpID0+IHtcbiAgICAgIGxldCB2YWwgPSBOdW1iZXIoYm94LnZhbHVlKTtcbiAgICAgIHRoaXMuZXZlbnQudXBkYXRlKHZhbCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmJveCA9IGJveDtcblxuICAgIGxldCBpbmNyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgaW5jckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgZXZlbnQubmFtZSArICctaW5jcicpO1xuICAgIGluY3JCdXR0b24uc2V0QXR0cmlidXRlKCd3aWR0aCcsICcwLjVlbScpO1xuICAgIGluY3JCdXR0b24uaW5uZXJIVE1MID0gJz4nO1xuICAgIGluY3JCdXR0b24ub25jbGljayA9ICgoKSA9PiB7XG4gICAgICB0aGlzLmV2ZW50LmluY3IoKTtcbiAgICAgIHRoaXMuZXZlbnQudXBkYXRlKCk7XG4gICAgfSk7XG5cbiAgICBsZXQgZGVjckJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGRlY3JCdXR0b24uc2V0QXR0cmlidXRlKCdpZCcsIGV2ZW50Lm5hbWUgKyAnLWRlY3InKTtcbiAgICBkZWNyQnV0dG9uLnN0eWxlLndpZHRoID0gJzAuNWVtJztcbiAgICBkZWNyQnV0dG9uLmlubmVySFRNTCA9ICc8JztcbiAgICBkZWNyQnV0dG9uLm9uY2xpY2sgPSAoKCkgPT4ge1xuICAgICAgdGhpcy5ldmVudC5kZWNyKCk7XG4gICAgICB0aGlzLmV2ZW50LnVwZGF0ZSgpO1xuICAgIH0pO1xuXG4gICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGxhYmVsLmlubmVySFRNTCA9IGV2ZW50LmxhYmVsICsgJzogJztcblxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgIGRpdi5hcHBlbmRDaGlsZChkZWNyQnV0dG9uKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoYm94KTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoaW5jckJ1dHRvbik7XG4gICAgZGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuXG4gICAgdmlldy5hcHBlbmRDaGlsZChkaXYpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuYm94LnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgX1NlbGVjdEd1aSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKHZpZXcsIGV2ZW50KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmV2ZW50ID0gZXZlbnQ7XG5cbiAgICBsZXQgYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgYm94LnNldEF0dHJpYnV0ZSgnaWQnLCBldmVudC5uYW1lICsgJy1ib3gnKTtcblxuICAgIGZvciAobGV0IG9wdGlvbiBvZiBldmVudC5vcHRpb25zKSB7XG4gICAgICBsZXQgb3B0RWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgICBvcHRFbGVtLnZhbHVlID0gb3B0aW9uO1xuICAgICAgb3B0RWxlbS50ZXh0ID0gb3B0aW9uO1xuICAgICAgYm94LmFwcGVuZENoaWxkKG9wdEVsZW0pO1xuICAgIH1cblxuICAgIGJveC5vbmNoYW5nZSA9ICgoKSA9PiB7XG4gICAgICB0aGlzLmV2ZW50LnVwZGF0ZShib3gudmFsdWUpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5ib3ggPSBib3g7XG5cbiAgICBsZXQgaW5jckJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGluY3JCdXR0b24uc2V0QXR0cmlidXRlKCdpZCcsIGV2ZW50Lm5hbWUgKyAnLWluY3InKTtcbiAgICBpbmNyQnV0dG9uLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnMC41ZW0nKTtcbiAgICBpbmNyQnV0dG9uLmlubmVySFRNTCA9ICc+JztcbiAgICBpbmNyQnV0dG9uLm9uY2xpY2sgPSAoKCkgPT4ge1xuICAgICAgdGhpcy5ldmVudC5pbmNyKCk7XG4gICAgICB0aGlzLmV2ZW50LnVwZGF0ZSgpO1xuICAgIH0pO1xuXG4gICAgbGV0IGRlY3JCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBkZWNyQnV0dG9uLnNldEF0dHJpYnV0ZSgnaWQnLCBldmVudC5uYW1lICsgJy1kZWNyJyk7XG4gICAgZGVjckJ1dHRvbi5zdHlsZS53aWR0aCA9ICcwLjVlbSc7XG4gICAgZGVjckJ1dHRvbi5pbm5lckhUTUwgPSAnPCc7XG4gICAgZGVjckJ1dHRvbi5vbmNsaWNrID0gKCgpID0+IHtcbiAgICAgIHRoaXMuZXZlbnQuZGVjcigpO1xuICAgICAgdGhpcy5ldmVudC51cGRhdGUoKTtcbiAgICB9KTtcblxuICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBsYWJlbC5pbm5lckhUTUwgPSBldmVudC5sYWJlbCArICc6ICc7XG5cbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZGVjckJ1dHRvbik7XG4gICAgZGl2LmFwcGVuZENoaWxkKGJveCk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGluY3JCdXR0b24pO1xuICAgIGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcblxuICAgIHZpZXcuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmJveC52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIF9JbmZvR3VpIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IodmlldywgZXZlbnQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZXZlbnQgPSBldmVudDtcblxuICAgIGxldCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgYm94LnNldEF0dHJpYnV0ZSgnaWQnLCBldmVudC5uYW1lICsgJy1ib3gnKTtcblxuICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBsYWJlbC5pbm5lckhUTUwgPSBldmVudC5sYWJlbCArICc6ICc7XG5cbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoYm94KTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG5cbiAgICB2aWV3LmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICB0aGlzLmJveCA9IGJveDtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmJveC5pbm5lckhUTUwgPSB2YWw7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfQ29tbWFuZEd1aSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKHZpZXcpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZXZlbnQgPSBldmVudDtcblxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctYnRuJyk7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2NvbW1hbmQnKTtcbiAgICBkaXYuaW5uZXJIVE1MID0gdGhpcy5sYWJlbDtcblxuICAgIGRpdi5vbmNsaWNrID0gKCgpID0+IHtcbiAgICAgIHRoaXMuZXZlbnQudXBkYXRlKCk7XG4gICAgfSk7XG5cbiAgICB2aWV3LmFwcGVuZENoaWxkKGRpdik7XG4gICAgdmlldy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICAvLyBub3RoaW5nIHRvIHNldCBoZXJlXG4gIH1cbn1cblxuLyoqXG4gKiBNYW5hZ2UgdGhlIGdsb2JhbCBjb250cm9sIGBwYXJhbWV0ZXJzYCwgYGluZm9zYCwgYW5kIGBjb21tYW5kc2AgYWNyb3NzIHRoZSB3aG9sZSBzY2VuYXJpby5cbiAqXG4gKiBUaGUgbW9kdWxlIGtlZXBzIHRyYWNrIG9mOlxuICogLSBgcGFyYW1ldGVyc2A6IHZhbHVlcyB0aGF0IGNhbiBiZSB1cGRhdGVkIGJ5IHRoZSBhY3Rpb25zIG9mIHRoZSBjbGllbnRzICgqZS5nLiogdGhlIGdhaW4gb2YgYSBzeW50aCk7XG4gKiAtIGBpbmZvc2A6IGluZm9ybWF0aW9uIGFib3V0IHRoZSBzdGF0ZSBvZiB0aGUgc2NlbmFyaW8gKCplLmcuKiBudW1iZXIgb2YgY2xpZW50cyBpbiB0aGUgcGVyZm9ybWFuY2UpO1xuICogLSBgY29tbWFuZHNgOiBjYW4gdHJpZ2dlciBhbiBhY3Rpb24gKCplLmcuKiByZWxvYWQgdGhlIHBhZ2UpLlxuICpcbiAqIElmIHRoZSBtb2R1bGUgaXMgaW5zdGFudGlhdGVkIHdpdGggdGhlIGBndWlgIG9wdGlvbiBzZXQgdG8gYHRydWVgLCBpdCBjb25zdHJ1Y3RzIGEgZ3JhcGhpY2FsIGludGVyZmFjZSB0byBtb2RpZnkgdGhlIHBhcmFtZXRlcnMsIHZpZXcgdGhlIGluZm9zLCBhbmQgdHJpZ2dlciB0aGUgY29tbWFuZHMuXG4gKiBPdGhlcndpc2UgKGBndWlgIG9wdGlvbiBzZXQgdG8gYGZhbHNlYCkgdGhlIG1vZHVsZSBlbWl0cyBhbiBldmVudCB3aGVuIGl0IHJlY2VpdmVzIHVwZGF0ZWQgdmFsdWVzIGZyb20gdGhlIHNlcnZlci5cbiAqXG4gKiBXaGVuIHRoZSBHVUkgaXMgZGlzYWJsZWQsIHRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIGltbWVkaWF0ZWx5IGFmdGVyIGhhdmluZyBzZXQgdXAgdGhlIGNvbnRyb2xzLlxuICogT3RoZXJ3aXNlIChHVUkgZW5hYmxlZCksIHRoZSBtb2R1bGVzIHJlbWFpbnMgaW4gaXRzIHN0YXRlIGFuZCBuZXZlciBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24uXG4gKlxuICogV2hlbiB0aGUgbW9kdWxlIGEgdmlldyAoYGd1aWAgb3B0aW9uIHNldCB0byBgdHJ1ZWApLCBpdCByZXF1aXJlcyB0aGUgU0FTUyBwYXJ0aWFsIGBfNzctY2hlY2tpbi5zY3NzYC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyQ29udHJvbC5qc35TZXJ2ZXJDb250cm9sfSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlIC8vIEV4YW1wbGUgMTogbWFrZSBhIGNsaWVudCB0aGF0IGRpc3BsYXlzIHRoZSBjb250cm9sIEdVSVxuICogY29uc3QgY29udHJvbCA9IG5ldyBDbGllbnRDb250cm9sKCk7XG4gKlxuICogLy8gSW5pdGlhbGl6ZSB0aGUgY2xpZW50IChpbmRpY2F0ZSB0aGUgY2xpZW50IHR5cGUpXG4gKiBjbGllbnQuaW5pdCgnY29uZHVjdG9yJyk7IC8vIGFjY2Vzc2libGUgYXQgdGhlIFVSTCAvY29uZHVjdG9yXG4gKlxuICogLy8gU3RhcnQgdGhlIHNjZW5hcmlvXG4gKiAvLyBGb3IgdGhpcyBjbGllbnQgdHlwZSAoYCdjb25kdWN0b3InYCksIHRoZXJlIGlzIG9ubHkgb25lIG1vZHVsZVxuICogY2xpZW50LnN0YXJ0KGNvbnRyb2wpO1xuICpcbiAqIEBleGFtcGxlIC8vIEV4YW1wbGUgMjogbGlzdGVuIGZvciBwYXJhbWV0ZXIsIGluZm9zICYgY29tbWFuZHMgdXBkYXRlc1xuICogY29uc3QgY29udHJvbCA9IG5ldyBDbGllbnRDb250cm9sKHsgZ3VpOiBmYWxzZSB9KTtcbiAqXG4gKiAvLyBMaXN0ZW4gZm9yIHBhcmFtZXRlciwgaW5mb3Mgb3IgY29tbWFuZCB1cGRhdGVzXG4gKiBjb250cm9sLm9uKCd1cGRhdGUnLCAobmFtZSwgdmFsdWUpID0+IHtcbiAqICAgc3dpdGNoKG5hbWUpIHtcbiAqICAgICBjYXNlICdzeW50aDpnYWluJzpcbiAqICAgICAgIGNvbnNvbGUubG9nKGBVcGRhdGUgdGhlIHN5bnRoIGdhaW4gdG8gdmFsdWUgI3t2YWx1ZX0uYCk7XG4gKiAgICAgICBicmVhaztcbiAqICAgICBjYXNlICdyZWxvYWQnOlxuICogICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcbiAqICAgICAgIGJyZWFrO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiAvLyBHZXQgY3VycmVudCB2YWx1ZSBvZiBhIHBhcmFtZXRlciBvciBpbmZvXG4gKiBjb25zdCBjdXJyZW50U3ludGhHYWluVmFsdWUgPSBjb250cm9sLmV2ZW50WydzeW50aDpnYWluJ10udmFsdWU7XG4gKiBjb25zdCBjdXJyZW50TnVtUGxheWVyc1ZhbHVlID0gY29udHJvbC5ldmVudFsnbnVtUGxheWVycyddLnZhbHVlO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRDb250cm9sIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3N5bmMnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZ3VpPXRydWVdIEluZGljYXRlcyB3aGV0aGVyIHRvIGNyZWF0ZSB0aGUgZ3JhcGhpY2FsIHVzZXIgaW50ZXJmYWNlIHRvIGNvbnRyb2wgdGhlIHBhcmFtZXRlcnMgb3Igbm90LlxuICAgKiBAZW1pdHMgeyd1cGRhdGUnfSB3aGVuIHRoZSBzZXJ2ZXIgc2VuZHMgYW4gdXBkYXRlLiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGFrZXMgYG5hbWU6U3RyaW5nYCBhbmQgYHZhbHVlOipgIGFzIGFyZ3VtZW50cywgd2hlcmUgYG5hbWVgIGlzIHRoZSBuYW1lIG9mIHRoZSBwYXJhbWV0ZXIgLyBpbmZvIC8gY29tbWFuZCwgYW5kIGB2YWx1ZWAgaXRzIG5ldyB2YWx1ZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY29udHJvbCcsIChvcHRpb25zLmhhc0d1aSA9PT0gdHJ1ZSksIG9wdGlvbnMuY29sb3IpO1xuXG4gICAgLyoqXG4gICAgICogRGljdGlvbmFyeSBvZiBhbGwgdGhlIHBhcmFtZXRlcnMgYW5kIGNvbW1hbmRzLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEZsYWcgd2hldGhlciBjbGllbnQgaGFzIGNvbnRyb2wgR1VJLlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuaGFzR3VpID0gb3B0aW9ucy5oYXNHdWk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGxpc3RlbmVyIHRvIGEgc3BlY2lmaWMgZXZlbnQgKGkuZS4gcGFyYW1ldGVyLCBpbmZvIG9yIGNvbW1hbmQpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTGlzdGVuZXIgY2FsbGJhY2suXG4gICAqL1xuICBhZGRFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgIGlmIChldmVudClcbiAgICAgIGV2ZW50LmFkZExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBjb250cm9sIGV2ZW50IFwiJyArIG5hbWUgKyAnXCInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnJvbSBhIHNwZWNpZmljIGV2ZW50IChpLmUuIHBhcmFtZXRlciwgaW5mbyBvciBjb21tYW5kKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIExpc3RlbmVyIGNhbGxiYWNrLlxuICAgKi9cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudHNbbmFtZV07XG5cbiAgICBpZiAoZXZlbnQpXG4gICAgICBldmVudC5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gY29udHJvbCBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgYSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7KFN0cmluZ3xOdW1iZXJ8Qm9vbGVhbil9IHZhbCBOZXcgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIHVwZGF0ZShuYW1lLCB2YWwsIHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICBjb25zdCBldmVudCA9IHRoaXMuZXZlbnRzW25hbWVdO1xuXG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICBldmVudC51cGRhdGUodmFsLCBzZW5kVG9TZXJ2ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBjb250cm9sIGV2ZW50IFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICBfY3JlYXRlRXZlbnQoaW5pdCkge1xuICAgIGxldCBldmVudCA9IG51bGw7XG5cbiAgICBzd2l0Y2ggKGluaXQudHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgZXZlbnQgPSBuZXcgX0NvbnRyb2xOdW1iZXIodGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0Lm1pbiwgaW5pdC5tYXgsIGluaXQuc3RlcCwgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICBldmVudCA9IG5ldyBfQ29udHJvbFNlbGVjdCh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQub3B0aW9ucywgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdpbmZvJzpcbiAgICAgICAgZXZlbnQgPSBuZXcgX0NvbnRyb2xJbmZvKHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdjb21tYW5kJzpcbiAgICAgICAgZXZlbnQgPSBuZXcgX0NvbnRyb2xDb21tYW5kKHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIF9jcmVhdGVHdWkodmlldywgZXZlbnQpIHtcbiAgICBsZXQgZ3VpID0gbnVsbDtcblxuICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgZ3VpID0gbmV3IF9OdW1iZXJHdWkodmlldywgZXZlbnQpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgZ3VpID0gbmV3IF9TZWxlY3RHdWkodmlldywgZXZlbnQpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnaW5mbyc6XG4gICAgICAgIGd1aSA9IG5ldyBfSW5mb0d1aSh2aWV3LCBldmVudCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdjb21tYW5kJzpcbiAgICAgICAgZ3VpID0gbmV3IF9Db21tYW5kR3VpKHZpZXcsIGV2ZW50KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGd1aTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIG1vZHVsZSBhbmQgcmVxdWVzdHMgdGhlIHBhcmFtZXRlcnMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcblxuICAgIGxldCB2aWV3ID0gKHRoaXMuaGFzR3VpKT8gdGhpcy4kY29udGFpbmVyOiBudWxsO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdpbml0JywgKGRhdGEpID0+IHtcbiAgICAgIGlmICh2aWV3KSB7XG4gICAgICAgIGxldCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJyk7XG4gICAgICAgIHRpdGxlLmlubmVySFRNTCA9ICdDb25kdWN0b3InO1xuICAgICAgICB2aWV3LmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgZCBvZiBkYXRhKSB7XG4gICAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KGQpO1xuICAgICAgICB0aGlzLmV2ZW50c1tldmVudC5uYW1lXSA9IGV2ZW50O1xuXG4gICAgICAgIGlmKHZpZXcpXG4gICAgICAgICAgdGhpcy5fY3JlYXRlR3VpKHZpZXcsIGV2ZW50KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF2aWV3KVxuICAgICAgICB0aGlzLmRvbmUoKTtcbiAgICB9KTtcblxuICAgIC8vIGxpc3RlbiB0byBldmVudHNcbiAgICB0aGlzLnJlY2VpdmUoJ3VwZGF0ZScsIChuYW1lLCB2YWwpID0+IHtcbiAgICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudHNbbmFtZV07XG5cbiAgICAgIGlmIChldmVudClcbiAgICAgICAgdGhpcy51cGRhdGUobmFtZSwgdmFsLCBmYWxzZSk7IC8vIHVwZGF0ZSwgYnV0IGRvbid0IHNlbmQgdG8gc2VydmVyXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUubG9nKCdjbGllbnQgY29udHJvbDogcmVjZWl2ZWQgdW5rbm93biBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZSBhbmQgcmVxdWVzdHMgdGhlIHBhcmFtZXRlcnMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuICB9XG59XG4iXX0=