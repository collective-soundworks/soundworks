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
    key: 'propagate',
    value: function propagate() {
      var sendToServer = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this.emit('update', this.value); // call event listeners

      if (sendToServer) this.control.send('update', this.name, this.value); // send to server

      this.control.emit('update', this.name, this.value); // call control listeners
    }
  }, {
    key: 'update',
    value: function update(val) {
      this.set(val);
      this.propagate();
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

var _NumberGui = (function () {
  function _NumberGui(view, event) {
    _classCallCheck(this, _NumberGui);

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
      event.set(val);
      event.propagate();
    };

    this.box = box;

    var incrButton = document.createElement('button');
    incrButton.setAttribute('id', event.name + '-incr');
    incrButton.setAttribute('width', '0.5em');
    incrButton.innerHTML = '>';
    incrButton.onclick = function () {
      event.incr();
      event.propagate();
    };

    var decrButton = document.createElement('button');
    decrButton.setAttribute('id', event.name + '-decr');
    decrButton.style.width = '0.5em';
    decrButton.innerHTML = '<';
    decrButton.onclick = function () {
      event.decr();
      event.propagate();
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
})();

var _SelectGui = (function () {
  function _SelectGui(view, event) {
    _classCallCheck(this, _SelectGui);

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
      event.set(box.value);
      event.propagate();
    };

    this.box = box;

    var incrButton = document.createElement('button');
    incrButton.setAttribute('id', event.name + '-incr');
    incrButton.setAttribute('width', '0.5em');
    incrButton.innerHTML = '>';
    incrButton.onclick = function () {
      event.incr();
      event.propagate();
    };

    var decrButton = document.createElement('button');
    decrButton.setAttribute('id', event.name + '-decr');
    decrButton.style.width = '0.5em';
    decrButton.innerHTML = '<';
    decrButton.onclick = function () {
      event.decr();
      event.propagate();
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
})();

var _InfoGui = (function () {
  function _InfoGui(view, event) {
    _classCallCheck(this, _InfoGui);

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
})();

var _CommandGui = (function () {
  function _CommandGui(view, event) {
    _classCallCheck(this, _CommandGui);

    var div = document.createElement('div');
    div.setAttribute('id', event.name + '-btn');
    div.classList.add('command');
    div.innerHTML = event.label;

    div.onclick = function () {
      event.propagate();
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
})();

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
     * @param {Boolean} [sendToServer=true] Flag whether the value is sent to the server.
     */
  }, {
    key: 'update',
    value: function update(name, val) {
      var sendToServer = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      var event = this.events[name];

      if (event) {
        event.set(val);
        event.propagate(sendToServer);
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

      event.addListener('update', function (val) {
        return gui.set(val);
      });

      return gui;
    }

    /**
     * Starts the module and requests the parameters to the server.
     */
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

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

            var _event = _this._createEvent(d);
            _this.events[_event.name] = _event;

            if (view) _this._createGui(view, _event);
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

        if (!view) _this.done();
      });

      // listen to events
      this.receive('update', function (name, val) {
        _this.update(name, val, false); // update, but don't send to server
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBQXlCLGdCQUFnQjs7OztzQkFDWixRQUFROzs7Ozs7SUFLL0IsYUFBYTtZQUFiLGFBQWE7O0FBQ04sV0FEUCxhQUFhLENBQ0wsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFOzBCQURwQyxhQUFhOztBQUVmLCtCQUZFLGFBQWEsNkNBRVA7QUFDUixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixRQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztHQUN4Qjs7Ozs7O2VBUkcsYUFBYTs7V0FVZCxhQUFDLEdBQUcsRUFBRTtBQUNQLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQ3BCOzs7V0FFUSxxQkFBc0I7VUFBckIsWUFBWSx5REFBRyxJQUFJOztBQUMzQixVQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWhDLFVBQUcsWUFBWSxFQUNiLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFckQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3BEOzs7V0FFSyxnQkFBQyxHQUFHLEVBQUU7QUFDVixVQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsVUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0tBQ2xCOzs7U0ExQkcsYUFBYTs7O0lBZ0NiLGNBQWM7WUFBZCxjQUFjOztBQUNQLFdBRFAsY0FBYyxDQUNOLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTswQkFEcEQsY0FBYzs7QUFFaEIsK0JBRkUsY0FBYyw2Q0FFVixPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDdEMsUUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixRQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDaEI7O2VBUEcsY0FBYzs7V0FTZixhQUFDLEdBQUcsRUFBRTtBQUNQLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQzFEOzs7V0FFRyxnQkFBRztBQUNMLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ3JELFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQztLQUN0Qzs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNyRCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUM7S0FDdEM7OztTQXJCRyxjQUFjO0dBQVMsYUFBYTs7SUF3QnBDLGNBQWM7WUFBZCxjQUFjOztBQUNQLFdBRFAsY0FBYyxDQUNOLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUU7MEJBRDdDLGNBQWM7O0FBRWhCLCtCQUZFLGNBQWMsNkNBRVYsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3RDLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDaEI7O2VBTEcsY0FBYzs7V0FPZixhQUFDLEdBQUcsRUFBRTtBQUNQLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUV0QyxVQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7QUFDZCxZQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixZQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztPQUNsQjtLQUNGOzs7V0FFRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQSxHQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQ3BELFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDdkM7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBLEdBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDMUUsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN2Qzs7O1NBeEJHLGNBQWM7R0FBUyxhQUFhOztJQTJCcEMsWUFBWTtZQUFaLFlBQVk7O0FBQ0wsV0FEUCxZQUFZLENBQ0osT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFOzBCQURwQyxZQUFZOztBQUVkLCtCQUZFLFlBQVksNkNBRVIsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3BDLFFBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDaEI7O2VBSkcsWUFBWTs7V0FNYixhQUFDLEdBQUcsRUFBRTtBQUNQLFVBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0tBQ2xCOzs7U0FSRyxZQUFZO0dBQVMsYUFBYTs7SUFXbEMsZUFBZTtZQUFmLGVBQWU7O0FBQ1IsV0FEUCxlQUFlLENBQ1AsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7MEJBRDlCLGVBQWU7O0FBRWpCLCtCQUZFLGVBQWUsNkNBRVgsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFO0dBQ3hDOzs7Ozs7ZUFIRyxlQUFlOztXQUtoQixhQUFDLEdBQUcsRUFBRTs7S0FFUjs7O1NBUEcsZUFBZTtHQUFTLGFBQWE7O0lBYXJDLFVBQVU7QUFDSCxXQURQLFVBQVUsQ0FDRixJQUFJLEVBQUUsS0FBSyxFQUFFOzBCQURyQixVQUFVOztBQUVaLFFBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDMUMsT0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQztBQUM1QyxPQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuQyxPQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkMsT0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25DLE9BQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxPQUFHLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkMsT0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRTdCLE9BQUcsQ0FBQyxRQUFRLEdBQUksWUFBTTtBQUNwQixVQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVCLFdBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDZixXQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDbkIsQUFBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDOztBQUVmLFFBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbEQsY0FBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQztBQUNwRCxjQUFVLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMxQyxjQUFVLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUMzQixjQUFVLENBQUMsT0FBTyxHQUFJLFlBQU07QUFDMUIsV0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2IsV0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO0tBQ25CLEFBQUMsQ0FBQzs7QUFFSCxRQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELGNBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUM7QUFDcEQsY0FBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ2pDLGNBQVUsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBQzNCLGNBQVUsQ0FBQyxPQUFPLEdBQUksWUFBTTtBQUMxQixXQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDYixXQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDbkIsQUFBQyxDQUFDOztBQUVILFFBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0MsU0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFckMsUUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxPQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZCLE9BQUcsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUIsT0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixPQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzVCLE9BQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUU5QyxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ3ZCOzs7Ozs7ZUFoREcsVUFBVTs7V0FrRFgsYUFBQyxHQUFHLEVBQUU7QUFDUCxVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7S0FDdEI7OztTQXBERyxVQUFVOzs7SUEwRFYsVUFBVTtBQUNILFdBRFAsVUFBVSxDQUNGLElBQUksRUFBRSxLQUFLLEVBQUU7MEJBRHJCLFVBQVU7O0FBRVosUUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzQyxPQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDOzs7Ozs7O0FBRTVDLHdDQUFtQixLQUFLLENBQUMsT0FBTyw0R0FBRTtZQUF6QixNQUFNOztBQUNiLFlBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0MsZUFBTyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7QUFDdkIsZUFBTyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7QUFDdEIsV0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUMxQjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELE9BQUcsQ0FBQyxRQUFRLEdBQUksWUFBTTtBQUNwQixXQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQixXQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDbkIsQUFBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDOztBQUVmLFFBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbEQsY0FBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQztBQUNwRCxjQUFVLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMxQyxjQUFVLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUMzQixjQUFVLENBQUMsT0FBTyxHQUFJLFlBQU07QUFDMUIsV0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2IsV0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO0tBQ25CLEFBQUMsQ0FBQzs7QUFFSCxRQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELGNBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUM7QUFDcEQsY0FBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ2pDLGNBQVUsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBQzNCLGNBQVUsQ0FBQyxPQUFPLEdBQUksWUFBTTtBQUMxQixXQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDYixXQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDbkIsQUFBQyxDQUFDOztBQUVILFFBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0MsU0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFckMsUUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxPQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZCLE9BQUcsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUIsT0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixPQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzVCLE9BQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUU5QyxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ3ZCOzs7Ozs7ZUFoREcsVUFBVTs7V0FrRFgsYUFBQyxHQUFHLEVBQUU7QUFDUCxVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7S0FDdEI7OztTQXBERyxVQUFVOzs7SUEwRFYsUUFBUTtBQUNELFdBRFAsUUFBUSxDQUNBLElBQUksRUFBRSxLQUFLLEVBQUU7MEJBRHJCLFFBQVE7O0FBRVYsUUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QyxPQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDOztBQUU1QyxRQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDLFNBQUssQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRXJDLFFBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEMsT0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QixPQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLE9BQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUU5QyxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUV0QixRQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztHQUNoQjs7Ozs7O2VBaEJHLFFBQVE7O1dBa0JULGFBQUMsR0FBRyxFQUFFO0FBQ1AsVUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0tBQzFCOzs7U0FwQkcsUUFBUTs7O0lBMEJSLFdBQVc7QUFDSixXQURQLFdBQVcsQ0FDSCxJQUFJLEVBQUUsS0FBSyxFQUFFOzBCQURyQixXQUFXOztBQUViLFFBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEMsT0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQztBQUM1QyxPQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixPQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7O0FBRTVCLE9BQUcsQ0FBQyxPQUFPLEdBQUksWUFBTTtBQUNuQixXQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDbkIsQUFBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEIsUUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDaEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2VBYkcsV0FBVzs7V0FlWixhQUFDLEdBQUcsRUFBRTs7S0FFUjs7O1NBakJHLFdBQVc7OztJQW1FSSxhQUFhO1lBQWIsYUFBYTs7Ozs7Ozs7OztBQVFyQixXQVJRLGFBQWEsR0FRTjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUkwsYUFBYTs7QUFTOUIsK0JBVGlCLGFBQWEsNkNBU3hCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFHLE9BQU8sQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Ozs7OztBQU0zRSxRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBTWpCLFFBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztHQUM5Qjs7Ozs7Ozs7ZUF0QmtCLGFBQWE7O1dBNkJoQiwwQkFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQy9CLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWhDLFVBQUksS0FBSyxFQUNQLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsS0FFNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7S0FDdkQ7Ozs7Ozs7OztXQU9rQiw2QkFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQ2xDLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWhDLFVBQUksS0FBSyxFQUNQLEtBQUssQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsS0FFL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7S0FDdkQ7Ozs7Ozs7Ozs7V0FRSyxnQkFBQyxJQUFJLEVBQUUsR0FBRyxFQUF1QjtVQUFyQixZQUFZLHlEQUFHLElBQUk7O0FBQ25DLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWhDLFVBQUksS0FBSyxFQUFFO0FBQ1QsYUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNmLGFBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7T0FDL0IsTUFBTTtBQUNMLGVBQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO09BQ3JEO0tBQ0Y7OztXQUVXLHNCQUFDLElBQUksRUFBRTtBQUNqQixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWpCLGNBQVEsSUFBSSxDQUFDLElBQUk7QUFDZixhQUFLLFFBQVE7QUFDWCxlQUFLLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkcsZ0JBQU07O0FBQUEsQUFFUixhQUFLLFFBQVE7QUFDWCxlQUFLLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsRixnQkFBTTs7QUFBQSxBQUVSLGFBQUssTUFBTTtBQUNULGVBQUssR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsRSxnQkFBTTs7QUFBQSxBQUVSLGFBQUssU0FBUztBQUNaLGVBQUssR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekQsZ0JBQU07QUFBQSxPQUNUOztBQUVELGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztXQUVTLG9CQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDdEIsVUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDOztBQUVmLGNBQVEsS0FBSyxDQUFDLElBQUk7QUFDaEIsYUFBSyxRQUFRO0FBQ1gsYUFBRyxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNsQyxnQkFBTTs7QUFBQSxBQUVSLGFBQUssUUFBUTtBQUNYLGFBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEMsZ0JBQU07O0FBQUEsQUFFUixhQUFLLE1BQU07QUFDVCxhQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLGdCQUFNOztBQUFBLEFBRVIsYUFBSyxTQUFTO0FBQ1osYUFBRyxHQUFHLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNuQyxnQkFBTTtBQUFBLE9BQ1Q7O0FBRUQsV0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsVUFBQyxHQUFHO2VBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7T0FBQSxDQUFDLENBQUM7O0FBRW5ELGFBQU8sR0FBRyxDQUFDO0tBQ1o7Ozs7Ozs7V0FLSSxpQkFBRzs7O0FBQ04saUNBM0hpQixhQUFhLHVDQTJIaEI7O0FBRWQsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFckIsVUFBSSxJQUFJLEdBQUcsQUFBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUUsSUFBSSxDQUFDOztBQUVoRCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxVQUFDLElBQUksRUFBSztBQUM3QixZQUFJLElBQUksRUFBRTtBQUNSLGNBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekMsZUFBSyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUM7QUFDOUIsY0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN6Qjs7Ozs7OztBQUVELDZDQUFjLElBQUksaUhBQUU7Z0JBQVgsQ0FBQzs7QUFDUixnQkFBSSxNQUFLLEdBQUcsTUFBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakMsa0JBQUssTUFBTSxDQUFDLE1BQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFLLENBQUM7O0FBRWhDLGdCQUFHLElBQUksRUFDTCxNQUFLLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBSyxDQUFDLENBQUM7V0FDaEM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxZQUFJLENBQUMsSUFBSSxFQUNQLE1BQUssSUFBSSxFQUFFLENBQUM7T0FDZixDQUFDLENBQUM7OztBQUdILFVBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBSztBQUNwQyxjQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQy9CLENBQUMsQ0FBQztLQUNKOzs7Ozs7O1dBS00sbUJBQUc7QUFDUixpQ0E5SmlCLGFBQWEseUNBOEpkO0FBQ2hCLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDdEI7OztTQWhLa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRDb250cm9sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIF9Db250cm9sRXZlbnQgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCB0eXBlLCBuYW1lLCBsYWJlbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb250cm9sID0gY29udHJvbDtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMudmFsdWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgcHJvcGFnYXRlKHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICB0aGlzLmVtaXQoJ3VwZGF0ZScsIHRoaXMudmFsdWUpOyAvLyBjYWxsIGV2ZW50IGxpc3RlbmVyc1xuXG4gICAgaWYoc2VuZFRvU2VydmVyKVxuICAgICAgdGhpcy5jb250cm9sLnNlbmQoJ3VwZGF0ZScsIHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7IC8vIHNlbmQgdG8gc2VydmVyXG5cbiAgICB0aGlzLmNvbnRyb2wuZW1pdCgndXBkYXRlJywgdGhpcy5uYW1lLCB0aGlzLnZhbHVlKTsgLy8gY2FsbCBjb250cm9sIGxpc3RlbmVyc1xuICB9XG5cbiAgdXBkYXRlKHZhbCkge1xuICAgIHRoaXMuc2V0KHZhbCk7XG4gICAgdGhpcy5wcm9wYWdhdGUoKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIF9Db250cm9sTnVtYmVyIGV4dGVuZHMgX0NvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdudW1iZXInLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5taW4gPSBtaW47XG4gICAgdGhpcy5tYXggPSBtYXg7XG4gICAgdGhpcy5zdGVwID0gc3RlcDtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gTWF0aC5taW4odGhpcy5tYXgsIE1hdGgubWF4KHRoaXMubWluLCB2YWwpKTtcbiAgfVxuXG4gIGluY3IoKSB7XG4gICAgbGV0IHN0ZXBzID0gTWF0aC5mbG9vcih0aGlzLnZhbHVlIC8gdGhpcy5zdGVwICsgMC41KTtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5zdGVwICogKHN0ZXBzICsgMSk7XG4gIH1cblxuICBkZWNyKCkge1xuICAgIGxldCBzdGVwcyA9IE1hdGguZmxvb3IodGhpcy52YWx1ZSAvIHRoaXMuc3RlcCArIDAuNSk7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuc3RlcCAqIChzdGVwcyAtIDEpO1xuICB9XG59XG5cbmNsYXNzIF9Db250cm9sU2VsZWN0IGV4dGVuZHMgX0NvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0KSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3NlbGVjdCcsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIGxldCBpbmRleCA9IHRoaXMub3B0aW9ucy5pbmRleE9mKHZhbCk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBpbmNyKCkge1xuICAgIHRoaXMuaW5kZXggPSAodGhpcy5pbmRleCArIDEpICUgdGhpcy5vcHRpb25zLmxlbmd0aDtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5vcHRpb25zW3RoaXMuaW5kZXhdO1xuICB9XG5cbiAgZGVjcigpIHtcbiAgICB0aGlzLmluZGV4ID0gKHRoaXMuaW5kZXggKyB0aGlzLm9wdGlvbnMubGVuZ3RoIC0gMSkgJSB0aGlzLm9wdGlvbnMubGVuZ3RoO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLm9wdGlvbnNbdGhpcy5pbmRleF07XG4gIH1cbn1cblxuY2xhc3MgX0NvbnRyb2xJbmZvIGV4dGVuZHMgX0NvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBpbml0KSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2luZm8nLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG5jbGFzcyBfQ29udHJvbENvbW1hbmQgZXh0ZW5kcyBfQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwpIHtcbiAgICBzdXBlcihjb250cm9sLCAnY29tbWFuZCcsIG5hbWUsIGxhYmVsKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICAvLyBub3RoaW5nIHRvIHNldCBoZXJlXG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfTnVtYmVyR3VpIHtcbiAgY29uc3RydWN0b3IodmlldywgZXZlbnQpIHtcbiAgICBsZXQgYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBib3guc2V0QXR0cmlidXRlKCdpZCcsIGV2ZW50Lm5hbWUgKyAnLWJveCcpO1xuICAgIGJveC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnbnVtYmVyJyk7XG4gICAgYm94LnNldEF0dHJpYnV0ZSgnbWluJywgZXZlbnQubWluKTtcbiAgICBib3guc2V0QXR0cmlidXRlKCdtYXgnLCBldmVudC5tYXgpO1xuICAgIGJveC5zZXRBdHRyaWJ1dGUoJ3N0ZXAnLCBldmVudC5zdGVwKTtcbiAgICBib3guc2V0QXR0cmlidXRlKCd2YWx1ZScsIGV2ZW50LnZhbHVlKTtcbiAgICBib3guc2V0QXR0cmlidXRlKCdzaXplJywgMTYpO1xuXG4gICAgYm94Lm9uY2hhbmdlID0gKCgpID0+IHtcbiAgICAgIGxldCB2YWwgPSBOdW1iZXIoYm94LnZhbHVlKTtcbiAgICAgIGV2ZW50LnNldCh2YWwpO1xuICAgICAgZXZlbnQucHJvcGFnYXRlKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmJveCA9IGJveDtcblxuICAgIGxldCBpbmNyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgaW5jckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgZXZlbnQubmFtZSArICctaW5jcicpO1xuICAgIGluY3JCdXR0b24uc2V0QXR0cmlidXRlKCd3aWR0aCcsICcwLjVlbScpO1xuICAgIGluY3JCdXR0b24uaW5uZXJIVE1MID0gJz4nO1xuICAgIGluY3JCdXR0b24ub25jbGljayA9ICgoKSA9PiB7XG4gICAgICBldmVudC5pbmNyKCk7XG4gICAgICBldmVudC5wcm9wYWdhdGUoKTtcbiAgICB9KTtcblxuICAgIGxldCBkZWNyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgZGVjckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgZXZlbnQubmFtZSArICctZGVjcicpO1xuICAgIGRlY3JCdXR0b24uc3R5bGUud2lkdGggPSAnMC41ZW0nO1xuICAgIGRlY3JCdXR0b24uaW5uZXJIVE1MID0gJzwnO1xuICAgIGRlY3JCdXR0b24ub25jbGljayA9ICgoKSA9PiB7XG4gICAgICBldmVudC5kZWNyKCk7XG4gICAgICBldmVudC5wcm9wYWdhdGUoKTtcbiAgICB9KTtcblxuICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBsYWJlbC5pbm5lckhUTUwgPSBldmVudC5sYWJlbCArICc6ICc7XG5cbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZGVjckJ1dHRvbik7XG4gICAgZGl2LmFwcGVuZENoaWxkKGJveCk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGluY3JCdXR0b24pO1xuICAgIGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcblxuICAgIHZpZXcuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmJveC52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIF9TZWxlY3RHdWkge1xuICBjb25zdHJ1Y3Rvcih2aWV3LCBldmVudCkge1xuICAgIGxldCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICBib3guc2V0QXR0cmlidXRlKCdpZCcsIGV2ZW50Lm5hbWUgKyAnLWJveCcpO1xuXG4gICAgZm9yIChsZXQgb3B0aW9uIG9mIGV2ZW50Lm9wdGlvbnMpIHtcbiAgICAgIGxldCBvcHRFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgIG9wdEVsZW0udmFsdWUgPSBvcHRpb247XG4gICAgICBvcHRFbGVtLnRleHQgPSBvcHRpb247XG4gICAgICBib3guYXBwZW5kQ2hpbGQob3B0RWxlbSk7XG4gICAgfVxuXG4gICAgYm94Lm9uY2hhbmdlID0gKCgpID0+IHtcbiAgICAgIGV2ZW50LnNldChib3gudmFsdWUpO1xuICAgICAgZXZlbnQucHJvcGFnYXRlKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmJveCA9IGJveDtcblxuICAgIGxldCBpbmNyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgaW5jckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgZXZlbnQubmFtZSArICctaW5jcicpO1xuICAgIGluY3JCdXR0b24uc2V0QXR0cmlidXRlKCd3aWR0aCcsICcwLjVlbScpO1xuICAgIGluY3JCdXR0b24uaW5uZXJIVE1MID0gJz4nO1xuICAgIGluY3JCdXR0b24ub25jbGljayA9ICgoKSA9PiB7XG4gICAgICBldmVudC5pbmNyKCk7XG4gICAgICBldmVudC5wcm9wYWdhdGUoKTtcbiAgICB9KTtcblxuICAgIGxldCBkZWNyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgZGVjckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgZXZlbnQubmFtZSArICctZGVjcicpO1xuICAgIGRlY3JCdXR0b24uc3R5bGUud2lkdGggPSAnMC41ZW0nO1xuICAgIGRlY3JCdXR0b24uaW5uZXJIVE1MID0gJzwnO1xuICAgIGRlY3JCdXR0b24ub25jbGljayA9ICgoKSA9PiB7XG4gICAgICBldmVudC5kZWNyKCk7XG4gICAgICBldmVudC5wcm9wYWdhdGUoKTtcbiAgICB9KTtcblxuICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBsYWJlbC5pbm5lckhUTUwgPSBldmVudC5sYWJlbCArICc6ICc7XG5cbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZGVjckJ1dHRvbik7XG4gICAgZGl2LmFwcGVuZENoaWxkKGJveCk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGluY3JCdXR0b24pO1xuICAgIGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcblxuICAgIHZpZXcuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmJveC52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIF9JbmZvR3VpIHtcbiAgY29uc3RydWN0b3IodmlldywgZXZlbnQpIHtcbiAgICBsZXQgYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGJveC5zZXRBdHRyaWJ1dGUoJ2lkJywgZXZlbnQubmFtZSArICctYm94Jyk7XG5cbiAgICBsZXQgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgbGFiZWwuaW5uZXJIVE1MID0gZXZlbnQubGFiZWwgKyAnOiAnO1xuXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGJveCk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuXG4gICAgdmlldy5hcHBlbmRDaGlsZChkaXYpO1xuXG4gICAgdGhpcy5ib3ggPSBib3g7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5ib3guaW5uZXJIVE1MID0gdmFsO1xuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgX0NvbW1hbmRHdWkge1xuICBjb25zdHJ1Y3Rvcih2aWV3LCBldmVudCkge1xuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuc2V0QXR0cmlidXRlKCdpZCcsIGV2ZW50Lm5hbWUgKyAnLWJ0bicpO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdjb21tYW5kJyk7XG4gICAgZGl2LmlubmVySFRNTCA9IGV2ZW50LmxhYmVsO1xuXG4gICAgZGl2Lm9uY2xpY2sgPSAoKCkgPT4ge1xuICAgICAgZXZlbnQucHJvcGFnYXRlKCk7XG4gICAgfSk7XG5cbiAgICB2aWV3LmFwcGVuZENoaWxkKGRpdik7XG4gICAgdmlldy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICAvLyBub3RoaW5nIHRvIHNldCBoZXJlXG4gIH1cbn1cblxuLyoqXG4gKiBNYW5hZ2UgdGhlIGdsb2JhbCBjb250cm9sIGBwYXJhbWV0ZXJzYCwgYGluZm9zYCwgYW5kIGBjb21tYW5kc2AgYWNyb3NzIHRoZSB3aG9sZSBzY2VuYXJpby5cbiAqXG4gKiBUaGUgbW9kdWxlIGtlZXBzIHRyYWNrIG9mOlxuICogLSBgcGFyYW1ldGVyc2A6IHZhbHVlcyB0aGF0IGNhbiBiZSB1cGRhdGVkIGJ5IHRoZSBhY3Rpb25zIG9mIHRoZSBjbGllbnRzICgqZS5nLiogdGhlIGdhaW4gb2YgYSBzeW50aCk7XG4gKiAtIGBpbmZvc2A6IGluZm9ybWF0aW9uIGFib3V0IHRoZSBzdGF0ZSBvZiB0aGUgc2NlbmFyaW8gKCplLmcuKiBudW1iZXIgb2YgY2xpZW50cyBpbiB0aGUgcGVyZm9ybWFuY2UpO1xuICogLSBgY29tbWFuZHNgOiBjYW4gdHJpZ2dlciBhbiBhY3Rpb24gKCplLmcuKiByZWxvYWQgdGhlIHBhZ2UpLlxuICpcbiAqIElmIHRoZSBtb2R1bGUgaXMgaW5zdGFudGlhdGVkIHdpdGggdGhlIGBndWlgIG9wdGlvbiBzZXQgdG8gYHRydWVgLCBpdCBjb25zdHJ1Y3RzIGEgZ3JhcGhpY2FsIGludGVyZmFjZSB0byBtb2RpZnkgdGhlIHBhcmFtZXRlcnMsIHZpZXcgdGhlIGluZm9zLCBhbmQgdHJpZ2dlciB0aGUgY29tbWFuZHMuXG4gKiBPdGhlcndpc2UgKGBndWlgIG9wdGlvbiBzZXQgdG8gYGZhbHNlYCkgdGhlIG1vZHVsZSBlbWl0cyBhbiBldmVudCB3aGVuIGl0IHJlY2VpdmVzIHVwZGF0ZWQgdmFsdWVzIGZyb20gdGhlIHNlcnZlci5cbiAqXG4gKiBXaGVuIHRoZSBHVUkgaXMgZGlzYWJsZWQsIHRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIGltbWVkaWF0ZWx5IGFmdGVyIGhhdmluZyBzZXQgdXAgdGhlIGNvbnRyb2xzLlxuICogT3RoZXJ3aXNlIChHVUkgZW5hYmxlZCksIHRoZSBtb2R1bGVzIHJlbWFpbnMgaW4gaXRzIHN0YXRlIGFuZCBuZXZlciBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24uXG4gKlxuICogV2hlbiB0aGUgbW9kdWxlIGEgdmlldyAoYGd1aWAgb3B0aW9uIHNldCB0byBgdHJ1ZWApLCBpdCByZXF1aXJlcyB0aGUgU0FTUyBwYXJ0aWFsIGBfNzctY2hlY2tpbi5zY3NzYC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyQ29udHJvbC5qc35TZXJ2ZXJDb250cm9sfSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlIC8vIEV4YW1wbGUgMTogbWFrZSBhIGNsaWVudCB0aGF0IGRpc3BsYXlzIHRoZSBjb250cm9sIEdVSVxuICogY29uc3QgY29udHJvbCA9IG5ldyBDbGllbnRDb250cm9sKCk7XG4gKlxuICogLy8gSW5pdGlhbGl6ZSB0aGUgY2xpZW50IChpbmRpY2F0ZSB0aGUgY2xpZW50IHR5cGUpXG4gKiBjbGllbnQuaW5pdCgnY29uZHVjdG9yJyk7IC8vIGFjY2Vzc2libGUgYXQgdGhlIFVSTCAvY29uZHVjdG9yXG4gKlxuICogLy8gU3RhcnQgdGhlIHNjZW5hcmlvXG4gKiAvLyBGb3IgdGhpcyBjbGllbnQgdHlwZSAoYCdjb25kdWN0b3InYCksIHRoZXJlIGlzIG9ubHkgb25lIG1vZHVsZVxuICogY2xpZW50LnN0YXJ0KGNvbnRyb2wpO1xuICpcbiAqIEBleGFtcGxlIC8vIEV4YW1wbGUgMjogbGlzdGVuIGZvciBwYXJhbWV0ZXIsIGluZm9zICYgY29tbWFuZHMgdXBkYXRlc1xuICogY29uc3QgY29udHJvbCA9IG5ldyBDbGllbnRDb250cm9sKHsgZ3VpOiBmYWxzZSB9KTtcbiAqXG4gKiAvLyBMaXN0ZW4gZm9yIHBhcmFtZXRlciwgaW5mb3Mgb3IgY29tbWFuZCB1cGRhdGVzXG4gKiBjb250cm9sLm9uKCd1cGRhdGUnLCAobmFtZSwgdmFsdWUpID0+IHtcbiAqICAgc3dpdGNoKG5hbWUpIHtcbiAqICAgICBjYXNlICdzeW50aDpnYWluJzpcbiAqICAgICAgIGNvbnNvbGUubG9nKGBVcGRhdGUgdGhlIHN5bnRoIGdhaW4gdG8gdmFsdWUgI3t2YWx1ZX0uYCk7XG4gKiAgICAgICBicmVhaztcbiAqICAgICBjYXNlICdyZWxvYWQnOlxuICogICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcbiAqICAgICAgIGJyZWFrO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiAvLyBHZXQgY3VycmVudCB2YWx1ZSBvZiBhIHBhcmFtZXRlciBvciBpbmZvXG4gKiBjb25zdCBjdXJyZW50U3ludGhHYWluVmFsdWUgPSBjb250cm9sLmV2ZW50WydzeW50aDpnYWluJ10udmFsdWU7XG4gKiBjb25zdCBjdXJyZW50TnVtUGxheWVyc1ZhbHVlID0gY29udHJvbC5ldmVudFsnbnVtUGxheWVycyddLnZhbHVlO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRDb250cm9sIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3N5bmMnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZ3VpPXRydWVdIEluZGljYXRlcyB3aGV0aGVyIHRvIGNyZWF0ZSB0aGUgZ3JhcGhpY2FsIHVzZXIgaW50ZXJmYWNlIHRvIGNvbnRyb2wgdGhlIHBhcmFtZXRlcnMgb3Igbm90LlxuICAgKiBAZW1pdHMgeyd1cGRhdGUnfSB3aGVuIHRoZSBzZXJ2ZXIgc2VuZHMgYW4gdXBkYXRlLiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGFrZXMgYG5hbWU6U3RyaW5nYCBhbmQgYHZhbHVlOipgIGFzIGFyZ3VtZW50cywgd2hlcmUgYG5hbWVgIGlzIHRoZSBuYW1lIG9mIHRoZSBwYXJhbWV0ZXIgLyBpbmZvIC8gY29tbWFuZCwgYW5kIGB2YWx1ZWAgaXRzIG5ldyB2YWx1ZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY29udHJvbCcsIChvcHRpb25zLmhhc0d1aSA9PT0gdHJ1ZSksIG9wdGlvbnMuY29sb3IpO1xuXG4gICAgLyoqXG4gICAgICogRGljdGlvbmFyeSBvZiBhbGwgdGhlIHBhcmFtZXRlcnMgYW5kIGNvbW1hbmRzLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEZsYWcgd2hldGhlciBjbGllbnQgaGFzIGNvbnRyb2wgR1VJLlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuaGFzR3VpID0gb3B0aW9ucy5oYXNHdWk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGxpc3RlbmVyIHRvIGEgc3BlY2lmaWMgZXZlbnQgKGkuZS4gcGFyYW1ldGVyLCBpbmZvIG9yIGNvbW1hbmQpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTGlzdGVuZXIgY2FsbGJhY2suXG4gICAqL1xuICBhZGRFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgIGlmIChldmVudClcbiAgICAgIGV2ZW50LmFkZExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBjb250cm9sIGV2ZW50IFwiJyArIG5hbWUgKyAnXCInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnJvbSBhIHNwZWNpZmljIGV2ZW50IChpLmUuIHBhcmFtZXRlciwgaW5mbyBvciBjb21tYW5kKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIExpc3RlbmVyIGNhbGxiYWNrLlxuICAgKi9cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudHNbbmFtZV07XG5cbiAgICBpZiAoZXZlbnQpXG4gICAgICBldmVudC5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gY29udHJvbCBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgYSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7KFN0cmluZ3xOdW1iZXJ8Qm9vbGVhbil9IHZhbCBOZXcgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbc2VuZFRvU2VydmVyPXRydWVdIEZsYWcgd2hldGhlciB0aGUgdmFsdWUgaXMgc2VudCB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbCwgc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudHNbbmFtZV07XG5cbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnNldCh2YWwpO1xuICAgICAgZXZlbnQucHJvcGFnYXRlKHNlbmRUb1NlcnZlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIGNvbnRyb2wgZXZlbnQgXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIF9jcmVhdGVFdmVudChpbml0KSB7XG4gICAgbGV0IGV2ZW50ID0gbnVsbDtcblxuICAgIHN3aXRjaCAoaW5pdC50eXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBldmVudCA9IG5ldyBfQ29udHJvbE51bWJlcih0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQubWluLCBpbml0Lm1heCwgaW5pdC5zdGVwLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgIGV2ZW50ID0gbmV3IF9Db250cm9sU2VsZWN0KHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC5vcHRpb25zLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2luZm8nOlxuICAgICAgICBldmVudCA9IG5ldyBfQ29udHJvbEluZm8odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2NvbW1hbmQnOlxuICAgICAgICBldmVudCA9IG5ldyBfQ29udHJvbENvbW1hbmQodGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgX2NyZWF0ZUd1aSh2aWV3LCBldmVudCkge1xuICAgIGxldCBndWkgPSBudWxsO1xuXG4gICAgc3dpdGNoIChldmVudC50eXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBndWkgPSBuZXcgX051bWJlckd1aSh2aWV3LCBldmVudCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICBndWkgPSBuZXcgX1NlbGVjdEd1aSh2aWV3LCBldmVudCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdpbmZvJzpcbiAgICAgICAgZ3VpID0gbmV3IF9JbmZvR3VpKHZpZXcsIGV2ZW50KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2NvbW1hbmQnOlxuICAgICAgICBndWkgPSBuZXcgX0NvbW1hbmRHdWkodmlldywgZXZlbnQpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBldmVudC5hZGRMaXN0ZW5lcigndXBkYXRlJywgKHZhbCkgPT4gZ3VpLnNldCh2YWwpKTtcblxuICAgIHJldHVybiBndWk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBtb2R1bGUgYW5kIHJlcXVlc3RzIHRoZSBwYXJhbWV0ZXJzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG5cbiAgICBsZXQgdmlldyA9ICh0aGlzLmhhc0d1aSk/IHRoaXMuJGNvbnRhaW5lcjogbnVsbDtcblxuICAgIHRoaXMucmVjZWl2ZSgnaW5pdCcsIChkYXRhKSA9PiB7XG4gICAgICBpZiAodmlldykge1xuICAgICAgICBsZXQgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuICAgICAgICB0aXRsZS5pbm5lckhUTUwgPSAnQ29uZHVjdG9yJztcbiAgICAgICAgdmlldy5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGQgb2YgZGF0YSkge1xuICAgICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudChkKTtcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnQubmFtZV0gPSBldmVudDtcblxuICAgICAgICBpZih2aWV3KVxuICAgICAgICAgIHRoaXMuX2NyZWF0ZUd1aSh2aWV3LCBldmVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdmlldylcbiAgICAgICAgdGhpcy5kb25lKCk7XG4gICAgfSk7XG5cbiAgICAvLyBsaXN0ZW4gdG8gZXZlbnRzXG4gICAgdGhpcy5yZWNlaXZlKCd1cGRhdGUnLCAobmFtZSwgdmFsKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZShuYW1lLCB2YWwsIGZhbHNlKTsgLy8gdXBkYXRlLCBidXQgZG9uJ3Qgc2VuZCB0byBzZXJ2ZXJcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0cyB0aGUgbW9kdWxlIGFuZCByZXF1ZXN0cyB0aGUgcGFyYW1ldGVycyB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG4gIH1cbn1cbiJdfQ==