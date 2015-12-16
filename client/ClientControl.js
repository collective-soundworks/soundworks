'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

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

    _get(Object.getPrototypeOf(ClientControl.prototype), 'constructor', this).call(this, options.name || 'control', options.gui === true, options.color);

    /**
     * Dictionary of all the parameters and commands.
     * @type {Object}
     */
    this.events = {};
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

      var view = this._ownsView ? this.view : null;

      this.receive('init', function (initEvents) {
        if (view) {
          var title = document.createElement('h1');
          title.innerHTML = 'Conductor';
          view.appendChild(title);
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _getIterator(_Object$keys(initEvents)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var key = _step2.value;

            var init = initEvents[key];

            var _event = _this4._createEvent(init);
            _this4.events[key] = _event;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFBeUIsZ0JBQWdCOzs7O3NCQUNaLFFBQVE7Ozs7OztJQUsvQixhQUFhO1lBQWIsYUFBYTs7QUFDTixXQURQLGFBQWEsQ0FDTCxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7MEJBRHBDLGFBQWE7O0FBRWYsK0JBRkUsYUFBYSw2Q0FFUDtBQUNSLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFFBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO0dBQ3hCOzs7Ozs7ZUFSRyxhQUFhOztXQVVkLGFBQUMsR0FBRyxFQUFFO0FBQ1AsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDcEI7OztXQUVLLGtCQUF1QztVQUF0QyxHQUFHLHlEQUFHLFNBQVM7VUFBRSxZQUFZLHlEQUFHLElBQUk7O0FBQ3pDLFVBQUcsR0FBRyxLQUFLLFNBQVMsRUFDbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFaEIsVUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFakMsVUFBRyxZQUFZLEVBQ2IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVyRCxVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFD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MkpkO0FBQ2hCLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDdEI7OztTQTdKa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRDb250cm9sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIF9Db250cm9sRXZlbnQgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCB0eXBlLCBuYW1lLCBsYWJlbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb250cm9sID0gY29udHJvbDtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMudmFsdWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgdXBkYXRlKHZhbCA9IHVuZGVmaW5lZCwgc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgIGlmKHZhbCA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy5zZXQodmFsKTsgLy8gc2V0IHZhbHVlXG5cbiAgICB0aGlzLmVtaXQodGhpcy5uYW1lLCB0aGlzLnZhbHVlKTsgLy8gY2FsbCBldmVudCBsaXN0ZW5lcnNcblxuICAgIGlmKHNlbmRUb1NlcnZlcilcbiAgICAgIHRoaXMuY29udHJvbC5zZW5kKCd1cGRhdGUnLCB0aGlzLm5hbWUsIHRoaXMudmFsdWUpOyAvLyBzZW5kIHRvIHNlcnZlclxuXG4gICAgdGhpcy5jb250cm9sLmVtaXQoJ3VwZGF0ZScsIHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7IC8vIGNhbGwgY29udHJvbCBsaXN0ZW5lcnNcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIF9Db250cm9sTnVtYmVyIGV4dGVuZHMgX0NvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdudW1iZXInLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5taW4gPSBtaW47XG4gICAgdGhpcy5tYXggPSBtYXg7XG4gICAgdGhpcy5zdGVwID0gc3RlcDtcbiAgICB0aGlzLnNldChpbml0KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gTWF0aC5taW4odGhpcy5tYXgsIE1hdGgubWF4KHRoaXMubWluLCB2YWwpKTtcbiAgfVxuXG4gIGluY3IoKSB7XG4gICAgbGV0IHN0ZXBzID0gTWF0aC5mbG9vcih0aGlzLnZhbHVlIC8gdGhpcy5zdGVwICsgMC41KTtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5zdGVwICogKHN0ZXBzICsgMSk7XG4gIH1cblxuICBkZWNyKCkge1xuICAgIGxldCBzdGVwcyA9IE1hdGguZmxvb3IodGhpcy52YWx1ZSAvIHRoaXMuc3RlcCArIDAuNSk7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuc3RlcCAqIChzdGVwcyAtIDEpO1xuICB9XG59XG5cbmNsYXNzIF9Db250cm9sU2VsZWN0IGV4dGVuZHMgX0NvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0KSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ3NlbGVjdCcsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIGxldCBpbmRleCA9IHRoaXMub3B0aW9ucy5pbmRleE9mKHZhbCk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBpbmNyKCkge1xuICAgIHRoaXMuaW5kZXggPSAodGhpcy5pbmRleCArIDEpICUgdGhpcy5vcHRpb25zLmxlbmd0aDtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5vcHRpb25zW3RoaXMuaW5kZXhdO1xuICB9XG5cbiAgZGVjcigpIHtcbiAgICB0aGlzLmluZGV4ID0gKHRoaXMuaW5kZXggKyB0aGlzLm9wdGlvbnMubGVuZ3RoIC0gMSkgJSB0aGlzLm9wdGlvbnMubGVuZ3RoO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLm9wdGlvbnNbdGhpcy5pbmRleF07XG4gIH1cbn1cblxuY2xhc3MgX0NvbnRyb2xJbmZvIGV4dGVuZHMgX0NvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBpbml0KSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2luZm8nLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG5jbGFzcyBfQ29udHJvbENvbW1hbmQgZXh0ZW5kcyBfQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwpIHtcbiAgICBzdXBlcihjb250cm9sLCAnY29tbWFuZCcsIG5hbWUsIGxhYmVsKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICAvLyBub3RoaW5nIHRvIHNldCBoZXJlXG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfTnVtYmVyR3VpIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IodmlldywgZXZlbnQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZXZlbnQgPSBldmVudDtcblxuICAgIGxldCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIGJveC5zZXRBdHRyaWJ1dGUoJ2lkJywgZXZlbnQubmFtZSArICctYm94Jyk7XG4gICAgYm94LnNldEF0dHJpYnV0ZSgndHlwZScsICdudW1iZXInKTtcbiAgICBib3guc2V0QXR0cmlidXRlKCdtaW4nLCBldmVudC5taW4pO1xuICAgIGJveC5zZXRBdHRyaWJ1dGUoJ21heCcsIGV2ZW50Lm1heCk7XG4gICAgYm94LnNldEF0dHJpYnV0ZSgnc3RlcCcsIGV2ZW50LnN0ZXApO1xuICAgIGJveC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgZXZlbnQudmFsdWUpO1xuICAgIGJveC5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAxNik7XG5cbiAgICBib3gub25jaGFuZ2UgPSAoKCkgPT4ge1xuICAgICAgbGV0IHZhbCA9IE51bWJlcihib3gudmFsdWUpO1xuICAgICAgdGhpcy5ldmVudC51cGRhdGUodmFsKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYm94ID0gYm94O1xuXG4gICAgbGV0IGluY3JCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBpbmNyQnV0dG9uLnNldEF0dHJpYnV0ZSgnaWQnLCBldmVudC5uYW1lICsgJy1pbmNyJyk7XG4gICAgaW5jckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzAuNWVtJyk7XG4gICAgaW5jckJ1dHRvbi5pbm5lckhUTUwgPSAnPic7XG4gICAgaW5jckJ1dHRvbi5vbmNsaWNrID0gKCgpID0+IHtcbiAgICAgIHRoaXMuZXZlbnQuaW5jcigpO1xuICAgICAgdGhpcy5ldmVudC51cGRhdGUoKTtcbiAgICB9KTtcblxuICAgIGxldCBkZWNyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgZGVjckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgZXZlbnQubmFtZSArICctZGVjcicpO1xuICAgIGRlY3JCdXR0b24uc3R5bGUud2lkdGggPSAnMC41ZW0nO1xuICAgIGRlY3JCdXR0b24uaW5uZXJIVE1MID0gJzwnO1xuICAgIGRlY3JCdXR0b24ub25jbGljayA9ICgoKSA9PiB7XG4gICAgICB0aGlzLmV2ZW50LmRlY3IoKTtcbiAgICAgIHRoaXMuZXZlbnQudXBkYXRlKCk7XG4gICAgfSk7XG5cbiAgICBsZXQgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgbGFiZWwuaW5uZXJIVE1MID0gZXZlbnQubGFiZWwgKyAnOiAnO1xuXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGRlY3JCdXR0b24pO1xuICAgIGRpdi5hcHBlbmRDaGlsZChib3gpO1xuICAgIGRpdi5hcHBlbmRDaGlsZChpbmNyQnV0dG9uKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG5cbiAgICB2aWV3LmFwcGVuZENoaWxkKGRpdik7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5ib3gudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfU2VsZWN0R3VpIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IodmlldywgZXZlbnQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZXZlbnQgPSBldmVudDtcblxuICAgIGxldCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICBib3guc2V0QXR0cmlidXRlKCdpZCcsIGV2ZW50Lm5hbWUgKyAnLWJveCcpO1xuXG4gICAgZm9yIChsZXQgb3B0aW9uIG9mIGV2ZW50Lm9wdGlvbnMpIHtcbiAgICAgIGxldCBvcHRFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgIG9wdEVsZW0udmFsdWUgPSBvcHRpb247XG4gICAgICBvcHRFbGVtLnRleHQgPSBvcHRpb247XG4gICAgICBib3guYXBwZW5kQ2hpbGQob3B0RWxlbSk7XG4gICAgfVxuXG4gICAgYm94Lm9uY2hhbmdlID0gKCgpID0+IHtcbiAgICAgIHRoaXMuZXZlbnQudXBkYXRlKGJveC52YWx1ZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmJveCA9IGJveDtcblxuICAgIGxldCBpbmNyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgaW5jckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgZXZlbnQubmFtZSArICctaW5jcicpO1xuICAgIGluY3JCdXR0b24uc2V0QXR0cmlidXRlKCd3aWR0aCcsICcwLjVlbScpO1xuICAgIGluY3JCdXR0b24uaW5uZXJIVE1MID0gJz4nO1xuICAgIGluY3JCdXR0b24ub25jbGljayA9ICgoKSA9PiB7XG4gICAgICB0aGlzLmV2ZW50LmluY3IoKTtcbiAgICAgIHRoaXMuZXZlbnQudXBkYXRlKCk7XG4gICAgfSk7XG5cbiAgICBsZXQgZGVjckJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGRlY3JCdXR0b24uc2V0QXR0cmlidXRlKCdpZCcsIGV2ZW50Lm5hbWUgKyAnLWRlY3InKTtcbiAgICBkZWNyQnV0dG9uLnN0eWxlLndpZHRoID0gJzAuNWVtJztcbiAgICBkZWNyQnV0dG9uLmlubmVySFRNTCA9ICc8JztcbiAgICBkZWNyQnV0dG9uLm9uY2xpY2sgPSAoKCkgPT4ge1xuICAgICAgdGhpcy5ldmVudC5kZWNyKCk7XG4gICAgICB0aGlzLmV2ZW50LnVwZGF0ZSgpO1xuICAgIH0pO1xuXG4gICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGxhYmVsLmlubmVySFRNTCA9IGV2ZW50LmxhYmVsICsgJzogJztcblxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgIGRpdi5hcHBlbmRDaGlsZChkZWNyQnV0dG9uKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoYm94KTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoaW5jckJ1dHRvbik7XG4gICAgZGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuXG4gICAgdmlldy5hcHBlbmRDaGlsZChkaXYpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuYm94LnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgX0luZm9HdWkgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3Rvcih2aWV3LCBldmVudCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5ldmVudCA9IGV2ZW50O1xuXG4gICAgbGV0IGJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBib3guc2V0QXR0cmlidXRlKCdpZCcsIGV2ZW50Lm5hbWUgKyAnLWJveCcpO1xuXG4gICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGxhYmVsLmlubmVySFRNTCA9IGV2ZW50LmxhYmVsICsgJzogJztcblxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgIGRpdi5hcHBlbmRDaGlsZChib3gpO1xuICAgIGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcblxuICAgIHZpZXcuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgIHRoaXMuYm94ID0gYm94O1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuYm94LmlubmVySFRNTCA9IHZhbDtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIF9Db21tYW5kR3VpIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3Iodmlldykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5ldmVudCA9IGV2ZW50O1xuXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5uYW1lICsgJy1idG4nKTtcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgnY29tbWFuZCcpO1xuICAgIGRpdi5pbm5lckhUTUwgPSB0aGlzLmxhYmVsO1xuXG4gICAgZGl2Lm9uY2xpY2sgPSAoKCkgPT4ge1xuICAgICAgdGhpcy5ldmVudC51cGRhdGUoKTtcbiAgICB9KTtcblxuICAgIHZpZXcuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICB2aWV3LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIC8vIG5vdGhpbmcgdG8gc2V0IGhlcmVcbiAgfVxufVxuXG4vKipcbiAqIE1hbmFnZSB0aGUgZ2xvYmFsIGNvbnRyb2wgYHBhcmFtZXRlcnNgLCBgaW5mb3NgLCBhbmQgYGNvbW1hbmRzYCBhY3Jvc3MgdGhlIHdob2xlIHNjZW5hcmlvLlxuICpcbiAqIFRoZSBtb2R1bGUga2VlcHMgdHJhY2sgb2Y6XG4gKiAtIGBwYXJhbWV0ZXJzYDogdmFsdWVzIHRoYXQgY2FuIGJlIHVwZGF0ZWQgYnkgdGhlIGFjdGlvbnMgb2YgdGhlIGNsaWVudHMgKCplLmcuKiB0aGUgZ2FpbiBvZiBhIHN5bnRoKTtcbiAqIC0gYGluZm9zYDogaW5mb3JtYXRpb24gYWJvdXQgdGhlIHN0YXRlIG9mIHRoZSBzY2VuYXJpbyAoKmUuZy4qIG51bWJlciBvZiBjbGllbnRzIGluIHRoZSBwZXJmb3JtYW5jZSk7XG4gKiAtIGBjb21tYW5kc2A6IGNhbiB0cmlnZ2VyIGFuIGFjdGlvbiAoKmUuZy4qIHJlbG9hZCB0aGUgcGFnZSkuXG4gKlxuICogSWYgdGhlIG1vZHVsZSBpcyBpbnN0YW50aWF0ZWQgd2l0aCB0aGUgYGd1aWAgb3B0aW9uIHNldCB0byBgdHJ1ZWAsIGl0IGNvbnN0cnVjdHMgYSBncmFwaGljYWwgaW50ZXJmYWNlIHRvIG1vZGlmeSB0aGUgcGFyYW1ldGVycywgdmlldyB0aGUgaW5mb3MsIGFuZCB0cmlnZ2VyIHRoZSBjb21tYW5kcy5cbiAqIE90aGVyd2lzZSAoYGd1aWAgb3B0aW9uIHNldCB0byBgZmFsc2VgKSB0aGUgbW9kdWxlIGVtaXRzIGFuIGV2ZW50IHdoZW4gaXQgcmVjZWl2ZXMgdXBkYXRlZCB2YWx1ZXMgZnJvbSB0aGUgc2VydmVyLlxuICpcbiAqIFdoZW4gdGhlIEdVSSBpcyBkaXNhYmxlZCwgdGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gaW1tZWRpYXRlbHkgYWZ0ZXIgaGF2aW5nIHNldCB1cCB0aGUgY29udHJvbHMuXG4gKiBPdGhlcndpc2UgKEdVSSBlbmFibGVkKSwgdGhlIG1vZHVsZXMgcmVtYWlucyBpbiBpdHMgc3RhdGUgYW5kIG5ldmVyIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbi5cbiAqXG4gKiBXaGVuIHRoZSBtb2R1bGUgYSB2aWV3IChgZ3VpYCBvcHRpb24gc2V0IHRvIGB0cnVlYCksIGl0IHJlcXVpcmVzIHRoZSBTQVNTIHBhcnRpYWwgYF83Ny1jaGVja2luLnNjc3NgLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJDb250cm9sLmpzflNlcnZlckNvbnRyb2x9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGUgLy8gRXhhbXBsZSAxOiBtYWtlIGEgY2xpZW50IHRoYXQgZGlzcGxheXMgdGhlIGNvbnRyb2wgR1VJXG4gKiBjb25zdCBjb250cm9sID0gbmV3IENsaWVudENvbnRyb2woKTtcbiAqXG4gKiAvLyBJbml0aWFsaXplIHRoZSBjbGllbnQgKGluZGljYXRlIHRoZSBjbGllbnQgdHlwZSlcbiAqIGNsaWVudC5pbml0KCdjb25kdWN0b3InKTsgLy8gYWNjZXNzaWJsZSBhdCB0aGUgVVJMIC9jb25kdWN0b3JcbiAqXG4gKiAvLyBTdGFydCB0aGUgc2NlbmFyaW9cbiAqIC8vIEZvciB0aGlzIGNsaWVudCB0eXBlIChgJ2NvbmR1Y3RvcidgKSwgdGhlcmUgaXMgb25seSBvbmUgbW9kdWxlXG4gKiBjbGllbnQuc3RhcnQoY29udHJvbCk7XG4gKlxuICogQGV4YW1wbGUgLy8gRXhhbXBsZSAyOiBsaXN0ZW4gZm9yIHBhcmFtZXRlciwgaW5mb3MgJiBjb21tYW5kcyB1cGRhdGVzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IENsaWVudENvbnRyb2woeyBndWk6IGZhbHNlIH0pO1xuICpcbiAqIC8vIExpc3RlbiBmb3IgcGFyYW1ldGVyLCBpbmZvcyBvciBjb21tYW5kIHVwZGF0ZXNcbiAqIGNvbnRyb2wub24oJ3VwZGF0ZScsIChuYW1lLCB2YWx1ZSkgPT4ge1xuICogICBzd2l0Y2gobmFtZSkge1xuICogICAgIGNhc2UgJ3N5bnRoOmdhaW4nOlxuICogICAgICAgY29uc29sZS5sb2coYFVwZGF0ZSB0aGUgc3ludGggZ2FpbiB0byB2YWx1ZSAje3ZhbHVlfS5gKTtcbiAqICAgICAgIGJyZWFrO1xuICogICAgIGNhc2UgJ3JlbG9hZCc6XG4gKiAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpO1xuICogICAgICAgYnJlYWs7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIC8vIEdldCBjdXJyZW50IHZhbHVlIG9mIGEgcGFyYW1ldGVyIG9yIGluZm9cbiAqIGNvbnN0IGN1cnJlbnRTeW50aEdhaW5WYWx1ZSA9IGNvbnRyb2wuZXZlbnRbJ3N5bnRoOmdhaW4nXS52YWx1ZTtcbiAqIGNvbnN0IGN1cnJlbnROdW1QbGF5ZXJzVmFsdWUgPSBjb250cm9sLmV2ZW50WydudW1QbGF5ZXJzJ10udmFsdWU7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudENvbnRyb2wgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nc3luYyddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5ndWk9dHJ1ZV0gSW5kaWNhdGVzIHdoZXRoZXIgdG8gY3JlYXRlIHRoZSBncmFwaGljYWwgdXNlciBpbnRlcmZhY2UgdG8gY29udHJvbCB0aGUgcGFyYW1ldGVycyBvciBub3QuXG4gICAqIEBlbWl0cyB7J3VwZGF0ZSd9IHdoZW4gdGhlIHNlcnZlciBzZW5kcyBhbiB1cGRhdGUuIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0YWtlcyBgbmFtZTpTdHJpbmdgIGFuZCBgdmFsdWU6KmAgYXMgYXJndW1lbnRzLCB3aGVyZSBgbmFtZWAgaXMgdGhlIG5hbWUgb2YgdGhlIHBhcmFtZXRlciAvIGluZm8gLyBjb21tYW5kLCBhbmQgYHZhbHVlYCBpdHMgbmV3IHZhbHVlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdjb250cm9sJywgKG9wdGlvbnMuZ3VpID09PSB0cnVlKSwgb3B0aW9ucy5jb2xvcik7XG5cbiAgICAvKipcbiAgICAgKiBEaWN0aW9uYXJ5IG9mIGFsbCB0aGUgcGFyYW1ldGVycyBhbmQgY29tbWFuZHMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBsaXN0ZW5lciB0byBhIHNwZWNpZmljIGV2ZW50IChpLmUuIHBhcmFtZXRlciwgaW5mbyBvciBjb21tYW5kKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIExpc3RlbmVyIGNhbGxiYWNrLlxuICAgKi9cbiAgYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudHNbbmFtZV07XG5cbiAgICBpZiAoZXZlbnQpXG4gICAgICBldmVudC5hZGRMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gY29udHJvbCBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZyb20gYSBzcGVjaWZpYyBldmVudCAoaS5lLiBwYXJhbWV0ZXIsIGluZm8gb3IgY29tbWFuZCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBMaXN0ZW5lciBjYWxsYmFjay5cbiAgICovXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBldmVudCA9IHRoaXMuZXZlbnRzW25hbWVdO1xuXG4gICAgaWYgKGV2ZW50KVxuICAgICAgZXZlbnQucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIGNvbnRyb2wgZXZlbnQgXCInICsgbmFtZSArICdcIicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHZhbHVlIG9mIGEgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0geyhTdHJpbmd8TnVtYmVyfEJvb2xlYW4pfSB2YWwgTmV3IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICB1cGRhdGUobmFtZSwgdmFsLCBzZW5kVG9TZXJ2ZXIgPSB0cnVlKSB7XG4gICAgY29uc3QgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQudXBkYXRlKHZhbCwgc2VuZFRvU2VydmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gY29udHJvbCBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgX2NyZWF0ZUV2ZW50KGluaXQpIHtcbiAgICBsZXQgZXZlbnQgPSBudWxsO1xuXG4gICAgc3dpdGNoIChpbml0LnR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGV2ZW50ID0gbmV3IF9Db250cm9sTnVtYmVyKHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC5taW4sIGluaXQubWF4LCBpbml0LnN0ZXAsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgZXZlbnQgPSBuZXcgX0NvbnRyb2xTZWxlY3QodGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0Lm9wdGlvbnMsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnaW5mbyc6XG4gICAgICAgIGV2ZW50ID0gbmV3IF9Db250cm9sSW5mbyh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnY29tbWFuZCc6XG4gICAgICAgIGV2ZW50ID0gbmV3IF9Db250cm9sQ29tbWFuZCh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICBfY3JlYXRlR3VpKHZpZXcsIGV2ZW50KSB7XG4gICAgbGV0IGd1aSA9IG51bGw7XG5cbiAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGd1aSA9IG5ldyBfTnVtYmVyR3VpKHZpZXcsIGV2ZW50KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgIGd1aSA9IG5ldyBfU2VsZWN0R3VpKHZpZXcsIGV2ZW50KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2luZm8nOlxuICAgICAgICBndWkgPSBuZXcgX0luZm9HdWkodmlldywgZXZlbnQpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnY29tbWFuZCc6XG4gICAgICAgIGd1aSA9IG5ldyBfQ29tbWFuZEd1aSh2aWV3LCBldmVudCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBndWk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBtb2R1bGUgYW5kIHJlcXVlc3RzIHRoZSBwYXJhbWV0ZXJzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG5cbiAgICBsZXQgdmlldyA9IHRoaXMuX293bnNWaWV3ID8gdGhpcy52aWV3IDogbnVsbDtcblxuICAgIHRoaXMucmVjZWl2ZSgnaW5pdCcsIChpbml0RXZlbnRzKSA9PiB7XG4gICAgICBpZiAodmlldykge1xuICAgICAgICBsZXQgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuICAgICAgICB0aXRsZS5pbm5lckhUTUwgPSAnQ29uZHVjdG9yJztcbiAgICAgICAgdmlldy5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhpbml0RXZlbnRzKSkge1xuICAgICAgICBsZXQgaW5pdCA9IGluaXRFdmVudHNba2V5XTtcblxuICAgICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudChpbml0KTtcbiAgICAgICAgdGhpcy5ldmVudHNba2V5XSA9IGV2ZW50O1xuXG4gICAgICAgIGlmKHZpZXcpXG4gICAgICAgICAgdGhpcy5fY3JlYXRlR3VpKHZpZXcsIGV2ZW50KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF2aWV3KVxuICAgICAgICB0aGlzLmRvbmUoKTtcbiAgICB9KTtcblxuICAgIC8vIGxpc3RlbiB0byBldmVudHNcbiAgICB0aGlzLnJlY2VpdmUoJ3VwZGF0ZScsIChuYW1lLCB2YWwpID0+IHtcbiAgICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudHNbbmFtZV07XG5cbiAgICAgIGlmIChldmVudClcbiAgICAgICAgdGhpcy51cGRhdGUobmFtZSwgdmFsLCBmYWxzZSk7IC8vIHVwZGF0ZSwgYnV0IGRvbid0IHNlbmQgdG8gc2VydmVyXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUubG9nKCdjbGllbnQgY29udHJvbDogcmVjZWl2ZWQgdW5rbm93biBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZSBhbmQgcmVxdWVzdHMgdGhlIHBhcmFtZXRlcnMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuICB9XG59XG4iXX0=