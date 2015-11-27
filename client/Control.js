'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

/**
 * @private
 */

var ControlEvent = (function () {
  function ControlEvent(type, name, label) {
    _classCallCheck(this, ControlEvent);

    this.type = type;
    this.name = name;
    this.label = label;
    this.value = undefined;
  }

  /**
   * @private
   */

  _createClass(ControlEvent, [{
    key: 'set',
    value: function set(val) {}
  }, {
    key: 'send',
    value: function send() {
      _client2['default'].send('control:event', this.name, this.value);
    }
  }]);

  return ControlEvent;
})();

var ControlNumber = (function (_ControlEvent) {
  _inherits(ControlNumber, _ControlEvent);

  function ControlNumber(init) {
    var _this = this;

    var view = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, ControlNumber);

    _get(Object.getPrototypeOf(ControlNumber.prototype), 'constructor', this).call(this, 'number', init.name, init.label);
    this.min = init.min;
    this.max = init.max;
    this.step = init.step;
    this.box = null;

    if (view) {
      (function () {
        var box = _this.box = document.createElement('input');
        box.setAttribute('id', _this.name + '-box');
        box.setAttribute('type', 'number');
        box.setAttribute('min', _this.min);
        box.setAttribute('max', _this.max);
        box.setAttribute('step', _this.step);
        box.setAttribute('size', 16);

        box.onchange = function () {
          var val = Number(box.value);
          _this.set(val);
          _this.send();
        };

        var incrButton = document.createElement('button');
        incrButton.setAttribute('id', _this.name + '-incr');
        incrButton.setAttribute('width', '0.5em');
        incrButton.innerHTML = '>';
        incrButton.onclick = function () {
          _this.incr();
          _this.send();
        };

        var decrButton = document.createElement('button');
        decrButton.setAttribute('id', _this.name + '-descr');
        decrButton.style.width = '0.5em';
        decrButton.innerHTML = '<';
        decrButton.onclick = function () {
          _this.decr();
          _this.send();
        };

        var label = document.createElement('span');
        label.innerHTML = _this.label + ': ';

        var div = document.createElement('div');
        div.appendChild(label);
        div.appendChild(decrButton);
        div.appendChild(box);
        div.appendChild(incrButton);
        div.appendChild(document.createElement('br'));

        view.appendChild(div);
      })();
    }

    this.set(init.value);
  }

  _createClass(ControlNumber, [{
    key: 'set',
    value: function set(val) {
      var send = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      this.value = Math.min(this.max, Math.max(this.min, val));

      if (this.box) this.box.value = val;
    }
  }, {
    key: 'incr',
    value: function incr() {
      var steps = Math.floor(this.value / this.step + 0.5);
      this.set(this.step * (steps + 1));
    }
  }, {
    key: 'decr',
    value: function decr() {
      var steps = Math.floor(this.value / this.step + 0.5);
      this.set(this.step * (steps - 1));
    }
  }]);

  return ControlNumber;
})(ControlEvent);

var ControlSelect = (function (_ControlEvent2) {
  _inherits(ControlSelect, _ControlEvent2);

  function ControlSelect(init) {
    var _this2 = this;

    var view = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, ControlSelect);

    _get(Object.getPrototypeOf(ControlSelect.prototype), 'constructor', this).call(this, 'select', init.name, init.label);
    this.options = init.options;
    this.box = null;

    if (view) {
      var _iteratorNormalCompletion;

      var _didIteratorError;

      var _iteratorError;

      var _iterator, _step;

      (function () {
        var box = _this2.box = document.createElement('select');
        box.setAttribute('id', _this2.name + '-box');

        _iteratorNormalCompletion = true;
        _didIteratorError = false;
        _iteratorError = undefined;

        try {
          for (_iterator = _getIterator(_this2.options); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
          _this2.set(box.value);
          _this2.send();
        };

        var incrButton = document.createElement('button');
        incrButton.setAttribute('id', _this2.name + '-incr');
        incrButton.setAttribute('width', '0.5em');
        incrButton.innerHTML = '>';
        incrButton.onclick = function () {
          _this2.incr();
          _this2.send();
        };

        var decrButton = document.createElement('button');
        decrButton.setAttribute('id', _this2.name + '-descr');
        decrButton.style.width = '0.5em';
        decrButton.innerHTML = '<';
        decrButton.onclick = function () {
          _this2.decr();
          _this2.send();
        };

        var label = document.createElement('span');
        label.innerHTML = _this2.label + ': ';

        var div = document.createElement('div');
        div.appendChild(label);
        div.appendChild(decrButton);
        div.appendChild(box);
        div.appendChild(incrButton);
        div.appendChild(document.createElement('br'));

        view.appendChild(div);
      })();
    }

    this.set(init.value);
  }

  _createClass(ControlSelect, [{
    key: 'set',
    value: function set(val) {
      var send = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var index = this.options.indexOf(val);

      if (index >= 0) {
        this.value = val;
        this.index = index;

        if (this.box) this.box.value = val;
      }
    }
  }, {
    key: 'incr',
    value: function incr() {
      this.index = (this.index + 1) % this.options.length;
      this.set(this.options[this.index]);
    }
  }, {
    key: 'decr',
    value: function decr() {
      this.index = (this.index + this.options.length - 1) % this.options.length;
      this.set(this.options[this.index]);
    }
  }]);

  return ControlSelect;
})(ControlEvent);

var ControlInfo = (function (_ControlEvent3) {
  _inherits(ControlInfo, _ControlEvent3);

  function ControlInfo(init) {
    var view = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, ControlInfo);

    _get(Object.getPrototypeOf(ControlInfo.prototype), 'constructor', this).call(this, 'info', init.name, init.label);
    this.box = null;

    if (view) {
      var box = this.box = document.createElement('span');
      box.setAttribute('id', this.name + '-box');

      var label = document.createElement('span');
      label.innerHTML = this.label + ': ';

      var div = document.createElement('div');
      div.appendChild(label);
      div.appendChild(box);
      div.appendChild(document.createElement('br'));

      view.appendChild(div);
    }

    this.set(init.value);
  }

  _createClass(ControlInfo, [{
    key: 'set',
    value: function set(val) {
      this.value = val;

      if (this.box) this.box.innerHTML = val;
    }
  }]);

  return ControlInfo;
})(ControlEvent);

var ControlCommand = (function (_ControlEvent4) {
  _inherits(ControlCommand, _ControlEvent4);

  function ControlCommand(init) {
    var _this3 = this;

    var view = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, ControlCommand);

    _get(Object.getPrototypeOf(ControlCommand.prototype), 'constructor', this).call(this, 'command', init.name, init.label);

    if (view) {
      var div = document.createElement('div');
      div.setAttribute('id', this.name + '-btn');
      div.classList.add('command');
      div.innerHTML = this.label;

      div.onclick = function () {
        _this3.send();
      };

      view.appendChild(div);
      view.appendChild(document.createElement('br'));
    }
  }

  /**
   * [client] Manage the global `parameters`, `infos`, and `commands` across the whole scenario.
   *
   * If the module is instantiated with the `gui` option set to `true`, it constructs a graphical interface to modify the parameters, view the infos, and trigger the commands.
   * Otherwise (`gui` option set to `false`) the module receives the values emitted by the server.
   * The module forwards the server values by emitting them.
   *
   * When the GUI is disabled, the module finishes its initialization immediately after having set up the controls.
   * Otherwise (GUI enabled), the modules remains in its state.
   *
   * When the module a view (`gui` option set to `true`), it requires the SASS partial `_77-checkin.scss`.
   *
   * (See also {@link src/server/Control.js~Control} on the server side.)
   *
   * @example // Example 1: make a client that displays the control GUI
   *
   * import { client, Control } from 'soundworks/client';
   * const control = new Control();
   *
   * // Initialize the client (indicate the client type)
   * client.init('conductor'); // accessible at the URL /conductor
   *
   * // Start the scenario
   * // For this client type (`'conductor'`), there is only one module
   * client.start(control);
   *
   * @example // Example 2: listen for parameter, infos & commands updates
   * const control = new Control({ gui: false });
   *
   * // Listen for parameter, infos or command updates
   * control.on('control:event', (name, value) => {
   *   console.log(`The parameter #{name} has been updated to value #{value}`);
   * });
   *
   * // Get current value of a parameter or info
   * const currentParamValue = control.event['parameterName'].value;
   * const currentInfoValue = control.event['infoName'].value;
   */
  return ControlCommand;
})(ControlEvent);

var Control = (function (_Module) {
  _inherits(Control, _Module);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='sync'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {Boolean} [options.gui=true] Indicates whether to create the graphical user interface to control the parameters or not.
   * @emits {'control:event'} when the server sends an update. The callback function takes `name:String` and `value:*` as arguments, where `name` is the name of the parameter / info / command, and `value` its new value.
   */

  function Control() {
    var _this4 = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Control);

    _get(Object.getPrototypeOf(Control.prototype), 'constructor', this).call(this, options.name || 'control', options.gui === true, options.color);

    /**
     * Dictionary of all the parameters and commands.
     * @type {Object}
     */
    this.events = {};

    var view = this._ownsView ? this.view : null;

    _client2['default'].receive('control:init', function (events) {
      if (view) {
        var title = document.createElement('h1');
        title.innerHTML = 'Conductor';
        view.appendChild(title);
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _getIterator(_Object$keys(events)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          var _event = events[key];

          switch (_event.type) {
            case 'number':
              _this4.events[key] = new ControlNumber(_event, view);
              break;

            case 'select':
              _this4.events[key] = new ControlSelect(_event, view);
              break;

            case 'info':
              _this4.events[key] = new ControlInfo(_event, view);
              break;

            case 'command':
              _this4.events[key] = new ControlCommand(_event, view);
              break;
          }
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
    _client2['default'].receive('control:event', function (name, val) {
      var event = _this4.events[name];

      if (event) {
        event.set(val);
        _this4.emit('control:event', name, val);
      } else console.log('client control: received unknown event "' + name + '"');
    });
  }

  /**
   * Starts the module and requests the parameters to the server.
   */

  _createClass(Control, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Control.prototype), 'start', this).call(this);
      _client2['default'].send('control:request');
    }

    /**
     * Restarts the module and requests the parameters to the server.
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(Control.prototype), 'restart', this).call(this);
      _client2['default'].send('control:request');
    }

    /**
     * Sends a value or command to the server.
     * @param {String} name Name of the parameter or command to send.
     * @todo is this method useful?
     */
  }, {
    key: 'send',
    value: function send(name) {
      var event = this.events[name];

      if (event) {
        event.send();
      }
    }

    /**
     * Updates the value of a parameter.
     * @param {String} name Name of the parameter to update.
     * @param {(String|Number|Boolean)} val New value of the parameter.
     */
  }, {
    key: 'update',
    value: function update(name, val) {
      var event = this.events[name];

      if (event) {
        event.set(val);
        event.send();
      }
    }
  }]);

  return Control;
})(_Module3['default']);

exports['default'] = Control;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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cUVWO0FBQ2QsMEJBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FDaEM7Ozs7Ozs7V0FLTSxtQkFBRztBQUNSLGlDQTdFaUIsT0FBTyx5Q0E2RVI7QUFDaEIsMEJBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FDaEM7Ozs7Ozs7OztXQU9HLGNBQUMsSUFBSSxFQUFFO0FBQ1QsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFaEMsVUFBSSxLQUFLLEVBQUU7QUFDVCxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDZDtLQUNGOzs7Ozs7Ozs7V0FPSyxnQkFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0FBQ2hCLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWhDLFVBQUksS0FBSyxFQUFFO0FBQ1QsYUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNmLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNkO0tBQ0Y7OztTQTFHa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoic3JjL2NsaWVudC9Db250cm9sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBDb250cm9sRXZlbnQge1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBuYW1lLCBsYWJlbCkge1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgdGhpcy52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHNldCh2YWwpIHtcblxuICB9XG5cbiAgc2VuZCgpIHtcbiAgICBjbGllbnQuc2VuZCgnY29udHJvbDpldmVudCcsIHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBDb250cm9sTnVtYmVyIGV4dGVuZHMgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoaW5pdCwgdmlldyA9IG51bGwpIHtcbiAgICBzdXBlcignbnVtYmVyJywgaW5pdC5uYW1lLCBpbml0LmxhYmVsKTtcbiAgICB0aGlzLm1pbiA9IGluaXQubWluO1xuICAgIHRoaXMubWF4ID0gaW5pdC5tYXg7XG4gICAgdGhpcy5zdGVwID0gaW5pdC5zdGVwO1xuICAgIHRoaXMuYm94ID0gbnVsbDtcblxuICAgIGlmICh2aWV3KSB7XG4gICAgICBsZXQgYm94ID0gdGhpcy5ib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgYm94LnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLm5hbWUgKyAnLWJveCcpO1xuICAgICAgYm94LnNldEF0dHJpYnV0ZSgndHlwZScsICdudW1iZXInKTtcbiAgICAgIGJveC5zZXRBdHRyaWJ1dGUoJ21pbicsIHRoaXMubWluKTtcbiAgICAgIGJveC5zZXRBdHRyaWJ1dGUoJ21heCcsIHRoaXMubWF4KTtcbiAgICAgIGJveC5zZXRBdHRyaWJ1dGUoJ3N0ZXAnLCB0aGlzLnN0ZXApO1xuICAgICAgYm94LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDE2KTtcblxuICAgICAgYm94Lm9uY2hhbmdlID0gKCgpID0+IHtcbiAgICAgICAgbGV0IHZhbCA9IE51bWJlcihib3gudmFsdWUpO1xuICAgICAgICB0aGlzLnNldCh2YWwpO1xuICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgaW5jckJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgaW5jckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5uYW1lICsgJy1pbmNyJyk7XG4gICAgICBpbmNyQnV0dG9uLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnMC41ZW0nKTtcbiAgICAgIGluY3JCdXR0b24uaW5uZXJIVE1MID0gJz4nO1xuICAgICAgaW5jckJ1dHRvbi5vbmNsaWNrID0gKCgpID0+IHtcbiAgICAgICAgdGhpcy5pbmNyKCk7XG4gICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGxldCBkZWNyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBkZWNyQnV0dG9uLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLm5hbWUgKyAnLWRlc2NyJyk7XG4gICAgICBkZWNyQnV0dG9uLnN0eWxlLndpZHRoID0gJzAuNWVtJztcbiAgICAgIGRlY3JCdXR0b24uaW5uZXJIVE1MID0gJzwnO1xuICAgICAgZGVjckJ1dHRvbi5vbmNsaWNrID0gKCgpID0+IHtcbiAgICAgICAgdGhpcy5kZWNyKCk7XG4gICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGxhYmVsLmlubmVySFRNTCA9IHRoaXMubGFiZWwgKyAnOiAnO1xuXG4gICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGRlY3JCdXR0b24pO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGJveCk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoaW5jckJ1dHRvbik7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG5cbiAgICAgIHZpZXcuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldChpbml0LnZhbHVlKTtcbiAgfVxuXG4gIHNldCh2YWwsIHNlbmQgPSBmYWxzZSkge1xuICAgIHRoaXMudmFsdWUgPSBNYXRoLm1pbih0aGlzLm1heCwgTWF0aC5tYXgodGhpcy5taW4sIHZhbCkpO1xuXG4gICAgaWYgKHRoaXMuYm94KVxuICAgICAgdGhpcy5ib3gudmFsdWUgPSB2YWw7XG4gIH1cblxuICBpbmNyKCkge1xuICAgIGxldCBzdGVwcyA9IE1hdGguZmxvb3IodGhpcy52YWx1ZSAvIHRoaXMuc3RlcCArIDAuNSk7XG4gICAgdGhpcy5zZXQodGhpcy5zdGVwICogKHN0ZXBzICsgMSkpO1xuICB9XG5cbiAgZGVjcigpIHtcbiAgICBsZXQgc3RlcHMgPSBNYXRoLmZsb29yKHRoaXMudmFsdWUgLyB0aGlzLnN0ZXAgKyAwLjUpO1xuICAgIHRoaXMuc2V0KHRoaXMuc3RlcCAqIChzdGVwcyAtIDEpKTtcbiAgfVxufVxuXG5jbGFzcyBDb250cm9sU2VsZWN0IGV4dGVuZHMgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoaW5pdCwgdmlldyA9IG51bGwpIHtcbiAgICBzdXBlcignc2VsZWN0JywgaW5pdC5uYW1lLCBpbml0LmxhYmVsKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBpbml0Lm9wdGlvbnM7XG4gICAgdGhpcy5ib3ggPSBudWxsO1xuXG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIGxldCBib3ggPSB0aGlzLmJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgICAgYm94LnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLm5hbWUgKyAnLWJveCcpO1xuXG4gICAgICBmb3IgKGxldCBvcHRpb24gb2YgdGhpcy5vcHRpb25zKSB7XG4gICAgICAgIGxldCBvcHRFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgICAgb3B0RWxlbS52YWx1ZSA9IG9wdGlvbjtcbiAgICAgICAgb3B0RWxlbS50ZXh0ID0gb3B0aW9uO1xuICAgICAgICBib3guYXBwZW5kQ2hpbGQob3B0RWxlbSk7XG4gICAgICB9XG5cbiAgICAgIGJveC5vbmNoYW5nZSA9ICgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0KGJveC52YWx1ZSk7XG4gICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGxldCBpbmNyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBpbmNyQnV0dG9uLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLm5hbWUgKyAnLWluY3InKTtcbiAgICAgIGluY3JCdXR0b24uc2V0QXR0cmlidXRlKCd3aWR0aCcsICcwLjVlbScpO1xuICAgICAgaW5jckJ1dHRvbi5pbm5lckhUTUwgPSAnPic7XG4gICAgICBpbmNyQnV0dG9uLm9uY2xpY2sgPSAoKCkgPT4ge1xuICAgICAgICB0aGlzLmluY3IoKTtcbiAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGRlY3JCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGRlY3JCdXR0b24uc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctZGVzY3InKTtcbiAgICAgIGRlY3JCdXR0b24uc3R5bGUud2lkdGggPSAnMC41ZW0nO1xuICAgICAgZGVjckJ1dHRvbi5pbm5lckhUTUwgPSAnPCc7XG4gICAgICBkZWNyQnV0dG9uLm9uY2xpY2sgPSAoKCkgPT4ge1xuICAgICAgICB0aGlzLmRlY3IoKTtcbiAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGFiZWwuaW5uZXJIVE1MID0gdGhpcy5sYWJlbCArICc6ICc7XG5cbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoZGVjckJ1dHRvbik7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoYm94KTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChpbmNyQnV0dG9uKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcblxuICAgICAgdmlldy5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0KGluaXQudmFsdWUpO1xuICB9XG5cbiAgc2V0KHZhbCwgc2VuZCA9IGZhbHNlKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5vcHRpb25zLmluZGV4T2YodmFsKTtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsO1xuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuXG4gICAgICBpZiAodGhpcy5ib3gpXG4gICAgICAgIHRoaXMuYm94LnZhbHVlID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGluY3IoKSB7XG4gICAgdGhpcy5pbmRleCA9ICh0aGlzLmluZGV4ICsgMSkgJSB0aGlzLm9wdGlvbnMubGVuZ3RoO1xuICAgIHRoaXMuc2V0KHRoaXMub3B0aW9uc1t0aGlzLmluZGV4XSk7XG4gIH1cblxuICBkZWNyKCkge1xuICAgIHRoaXMuaW5kZXggPSAodGhpcy5pbmRleCArIHRoaXMub3B0aW9ucy5sZW5ndGggLSAxKSAlIHRoaXMub3B0aW9ucy5sZW5ndGg7XG4gICAgdGhpcy5zZXQodGhpcy5vcHRpb25zW3RoaXMuaW5kZXhdKTtcbiAgfVxufVxuXG5jbGFzcyBDb250cm9sSW5mbyBleHRlbmRzIENvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKGluaXQsIHZpZXcgPSBudWxsKSB7XG4gICAgc3VwZXIoJ2luZm8nLCBpbml0Lm5hbWUsIGluaXQubGFiZWwpO1xuICAgIHRoaXMuYm94ID0gbnVsbDtcblxuICAgIGlmICh2aWV3KSB7XG4gICAgICBsZXQgYm94ID0gdGhpcy5ib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctYm94Jyk7XG5cbiAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGxhYmVsLmlubmVySFRNTCA9IHRoaXMubGFiZWwgKyAnOiAnO1xuXG4gICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGJveCk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG5cbiAgICAgIHZpZXcuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldChpbml0LnZhbHVlKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsO1xuXG4gICAgaWYgKHRoaXMuYm94KVxuICAgICAgdGhpcy5ib3guaW5uZXJIVE1MID0gdmFsO1xuICB9XG59XG5cbmNsYXNzIENvbnRyb2xDb21tYW5kIGV4dGVuZHMgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoaW5pdCwgdmlldyA9IG51bGwpIHtcbiAgICBzdXBlcignY29tbWFuZCcsIGluaXQubmFtZSwgaW5pdC5sYWJlbCk7XG5cbiAgICBpZiAodmlldykge1xuICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLm5hbWUgKyAnLWJ0bicpO1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2NvbW1hbmQnKTtcbiAgICAgIGRpdi5pbm5lckhUTUwgPSB0aGlzLmxhYmVsO1xuXG4gICAgICBkaXYub25jbGljayA9ICgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHZpZXcuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgIHZpZXcuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogW2NsaWVudF0gTWFuYWdlIHRoZSBnbG9iYWwgYHBhcmFtZXRlcnNgLCBgaW5mb3NgLCBhbmQgYGNvbW1hbmRzYCBhY3Jvc3MgdGhlIHdob2xlIHNjZW5hcmlvLlxuICpcbiAqIElmIHRoZSBtb2R1bGUgaXMgaW5zdGFudGlhdGVkIHdpdGggdGhlIGBndWlgIG9wdGlvbiBzZXQgdG8gYHRydWVgLCBpdCBjb25zdHJ1Y3RzIGEgZ3JhcGhpY2FsIGludGVyZmFjZSB0byBtb2RpZnkgdGhlIHBhcmFtZXRlcnMsIHZpZXcgdGhlIGluZm9zLCBhbmQgdHJpZ2dlciB0aGUgY29tbWFuZHMuXG4gKiBPdGhlcndpc2UgKGBndWlgIG9wdGlvbiBzZXQgdG8gYGZhbHNlYCkgdGhlIG1vZHVsZSByZWNlaXZlcyB0aGUgdmFsdWVzIGVtaXR0ZWQgYnkgdGhlIHNlcnZlci5cbiAqIFRoZSBtb2R1bGUgZm9yd2FyZHMgdGhlIHNlcnZlciB2YWx1ZXMgYnkgZW1pdHRpbmcgdGhlbS5cbiAqXG4gKiBXaGVuIHRoZSBHVUkgaXMgZGlzYWJsZWQsIHRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIGltbWVkaWF0ZWx5IGFmdGVyIGhhdmluZyBzZXQgdXAgdGhlIGNvbnRyb2xzLlxuICogT3RoZXJ3aXNlIChHVUkgZW5hYmxlZCksIHRoZSBtb2R1bGVzIHJlbWFpbnMgaW4gaXRzIHN0YXRlLlxuICpcbiAqIFdoZW4gdGhlIG1vZHVsZSBhIHZpZXcgKGBndWlgIG9wdGlvbiBzZXQgdG8gYHRydWVgKSwgaXQgcmVxdWlyZXMgdGhlIFNBU1MgcGFydGlhbCBgXzc3LWNoZWNraW4uc2Nzc2AuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL0NvbnRyb2wuanN+Q29udHJvbH0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSAvLyBFeGFtcGxlIDE6IG1ha2UgYSBjbGllbnQgdGhhdCBkaXNwbGF5cyB0aGUgY29udHJvbCBHVUlcbiAqXG4gKiBpbXBvcnQgeyBjbGllbnQsIENvbnRyb2wgfSBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG4gKiBjb25zdCBjb250cm9sID0gbmV3IENvbnRyb2woKTtcbiAqXG4gKiAvLyBJbml0aWFsaXplIHRoZSBjbGllbnQgKGluZGljYXRlIHRoZSBjbGllbnQgdHlwZSlcbiAqIGNsaWVudC5pbml0KCdjb25kdWN0b3InKTsgLy8gYWNjZXNzaWJsZSBhdCB0aGUgVVJMIC9jb25kdWN0b3JcbiAqXG4gKiAvLyBTdGFydCB0aGUgc2NlbmFyaW9cbiAqIC8vIEZvciB0aGlzIGNsaWVudCB0eXBlIChgJ2NvbmR1Y3RvcidgKSwgdGhlcmUgaXMgb25seSBvbmUgbW9kdWxlXG4gKiBjbGllbnQuc3RhcnQoY29udHJvbCk7XG4gKlxuICogQGV4YW1wbGUgLy8gRXhhbXBsZSAyOiBsaXN0ZW4gZm9yIHBhcmFtZXRlciwgaW5mb3MgJiBjb21tYW5kcyB1cGRhdGVzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IENvbnRyb2woeyBndWk6IGZhbHNlIH0pO1xuICpcbiAqIC8vIExpc3RlbiBmb3IgcGFyYW1ldGVyLCBpbmZvcyBvciBjb21tYW5kIHVwZGF0ZXNcbiAqIGNvbnRyb2wub24oJ2NvbnRyb2w6ZXZlbnQnLCAobmFtZSwgdmFsdWUpID0+IHtcbiAqICAgY29uc29sZS5sb2coYFRoZSBwYXJhbWV0ZXIgI3tuYW1lfSBoYXMgYmVlbiB1cGRhdGVkIHRvIHZhbHVlICN7dmFsdWV9YCk7XG4gKiB9KTtcbiAqXG4gKiAvLyBHZXQgY3VycmVudCB2YWx1ZSBvZiBhIHBhcmFtZXRlciBvciBpbmZvXG4gKiBjb25zdCBjdXJyZW50UGFyYW1WYWx1ZSA9IGNvbnRyb2wuZXZlbnRbJ3BhcmFtZXRlck5hbWUnXS52YWx1ZTtcbiAqIGNvbnN0IGN1cnJlbnRJbmZvVmFsdWUgPSBjb250cm9sLmV2ZW50WydpbmZvTmFtZSddLnZhbHVlO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250cm9sIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3N5bmMnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZ3VpPXRydWVdIEluZGljYXRlcyB3aGV0aGVyIHRvIGNyZWF0ZSB0aGUgZ3JhcGhpY2FsIHVzZXIgaW50ZXJmYWNlIHRvIGNvbnRyb2wgdGhlIHBhcmFtZXRlcnMgb3Igbm90LlxuICAgKiBAZW1pdHMgeydjb250cm9sOmV2ZW50J30gd2hlbiB0aGUgc2VydmVyIHNlbmRzIGFuIHVwZGF0ZS4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRha2VzIGBuYW1lOlN0cmluZ2AgYW5kIGB2YWx1ZToqYCBhcyBhcmd1bWVudHMsIHdoZXJlIGBuYW1lYCBpcyB0aGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyIC8gaW5mbyAvIGNvbW1hbmQsIGFuZCBgdmFsdWVgIGl0cyBuZXcgdmFsdWUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2NvbnRyb2wnLCAob3B0aW9ucy5ndWkgPT09IHRydWUpLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIC8qKlxuICAgICAqIERpY3Rpb25hcnkgb2YgYWxsIHRoZSBwYXJhbWV0ZXJzIGFuZCBjb21tYW5kcy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnRzID0ge307XG5cbiAgICBsZXQgdmlldyA9IHRoaXMuX293bnNWaWV3ID8gdGhpcy52aWV3IDogbnVsbDtcblxuICAgIGNsaWVudC5yZWNlaXZlKCdjb250cm9sOmluaXQnLCAoZXZlbnRzKSA9PiB7XG4gICAgICBpZiAodmlldykge1xuICAgICAgICBsZXQgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuICAgICAgICB0aXRsZS5pbm5lckhUTUwgPSAnQ29uZHVjdG9yJztcbiAgICAgICAgdmlldy5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhldmVudHMpKSB7XG4gICAgICAgIGxldCBldmVudCA9IGV2ZW50c1trZXldO1xuXG4gICAgICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xuICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldID0gbmV3IENvbnRyb2xOdW1iZXIoZXZlbnQsIHZpZXcpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICAgICAgdGhpcy5ldmVudHNba2V5XSA9IG5ldyBDb250cm9sU2VsZWN0KGV2ZW50LCB2aWV3KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnaW5mbyc6XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldID0gbmV3IENvbnRyb2xJbmZvKGV2ZW50LCB2aWV3KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnY29tbWFuZCc6XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldID0gbmV3IENvbnRyb2xDb21tYW5kKGV2ZW50LCB2aWV3KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghdmlldylcbiAgICAgICAgdGhpcy5kb25lKCk7XG4gICAgfSk7XG5cbiAgICAvLyBsaXN0ZW4gdG8gZXZlbnRzXG4gICAgY2xpZW50LnJlY2VpdmUoJ2NvbnRyb2w6ZXZlbnQnLCAobmFtZSwgdmFsKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnNldCh2YWwpO1xuICAgICAgICB0aGlzLmVtaXQoJ2NvbnRyb2w6ZXZlbnQnLCBuYW1lLCB2YWwpO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZygnY2xpZW50IGNvbnRyb2w6IHJlY2VpdmVkIHVua25vd24gZXZlbnQgXCInICsgbmFtZSArICdcIicpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlIGFuZCByZXF1ZXN0cyB0aGUgcGFyYW1ldGVycyB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICBjbGllbnQuc2VuZCgnY29udHJvbDpyZXF1ZXN0Jyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZSBhbmQgcmVxdWVzdHMgdGhlIHBhcmFtZXRlcnMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIGNsaWVudC5zZW5kKCdjb250cm9sOnJlcXVlc3QnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIHZhbHVlIG9yIGNvbW1hbmQgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyIG9yIGNvbW1hbmQgdG8gc2VuZC5cbiAgICogQHRvZG8gaXMgdGhpcyBtZXRob2QgdXNlZnVsP1xuICAgKi9cbiAgc2VuZChuYW1lKSB7XG4gICAgY29uc3QgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQuc2VuZCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB2YWx1ZSBvZiBhIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHsoU3RyaW5nfE51bWJlcnxCb29sZWFuKX0gdmFsIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbCkge1xuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudHNbbmFtZV07XG5cbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnNldCh2YWwpO1xuICAgICAgZXZlbnQuc2VuZCgpO1xuICAgIH1cbiAgfVxufVxuIl19