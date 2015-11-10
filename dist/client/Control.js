'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ControlEvent = (function () {
  function ControlEvent(type, name, label) {
    _classCallCheck(this, ControlEvent);

    this.type = type;
    this.name = name;
    this.label = label;
    this.value = undefined;
  }

  _createClass(ControlEvent, [{
    key: 'set',
    value: function set(val) {}
  }, {
    key: 'send',
    value: function send() {
      _client2.default.send('control:event', this.name, this.value);
    }
  }]);

  return ControlEvent;
})();

var ControlNumber = (function (_ControlEvent) {
  _inherits(ControlNumber, _ControlEvent);

  function ControlNumber(init) {
    var view = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, ControlNumber);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ControlNumber).call(this, 'number', init.name, init.label));

    _this.min = init.min;
    _this.max = init.max;
    _this.step = init.step;
    _this.box = null;

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

    _this.set(init.value);
    return _this;
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
    var view = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, ControlSelect);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(ControlSelect).call(this, 'select', init.name, init.label));

    _this2.options = init.options;
    _this2.box = null;

    if (view) {
      (function () {
        var box = _this2.box = document.createElement('select');
        box.setAttribute('id', _this2.name + '-box');

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _this2.options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
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

    _this2.set(init.value);
    return _this2;
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

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(ControlInfo).call(this, 'info', init.name, init.label));

    _this3.box = null;

    if (view) {
      var box = _this3.box = document.createElement('span');
      box.setAttribute('id', _this3.name + '-box');

      var label = document.createElement('span');
      label.innerHTML = _this3.label + ': ';

      var div = document.createElement('div');
      div.appendChild(label);
      div.appendChild(box);
      div.appendChild(document.createElement('br'));

      view.appendChild(div);
    }

    _this3.set(init.value);
    return _this3;
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
    var view = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, ControlCommand);

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(ControlCommand).call(this, 'command', init.name, init.label));

    if (view) {
      var div = document.createElement('div');
      div.setAttribute('id', _this4.name + '-btn');
      div.classList.add('command');
      div.innerHTML = _this4.label;

      div.onclick = function () {
        _this4.send();
      };

      view.appendChild(div);
      view.appendChild(document.createElement('br'));
    }
    return _this4;
  }

  return ControlCommand;
})(ControlEvent);

/**
 * The {@link ClientControl} module takes care of the global `parameters`, `infos`, and `commands` on the client side.
 * If the module is instantiated with the `gui` option set to `true`, it constructs the graphical control interface.
 * Otherwise it simply receives the values that are emitted by the server (usually by through the `performance` module).
 *
 * The {@link ClientControl} calls its `done` method:
 * - Immediately after having set up the controls if the GUI is disabled;
 * - Never if the GUI is enabled.
 */

var Control = (function (_Module) {
  _inherits(Control, _Module);

  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='sync'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {Boolean} [options.gui=true] Indicates whether to create the graphical user interface to control the parameters or not.
   * @emits {'control:event'} when the server sends an update.
   */

  function Control() {
    _classCallCheck(this, Control);

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    /**
     * Dictionary of all the parameters and commands.
     * @type {Object}
     */

    var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(Control).call(this, options.name || 'control', options.gui === true, options.color));

    _this6.events = {};

    _this6._init();
    return _this6;
  }

  _createClass(Control, [{
    key: '_init',
    value: function _init() {
      var _this5 = this;

      var view = this._ownsView ? this.view : null;

      _client2.default.receive('control:init', function (events) {
        if (view) {
          var title = document.createElement('h1');
          title.innerHTML = 'Conductor';
          view.appendChild(title);
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Object.keys(events)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var key = _step2.value;

            var event = events[key];

            switch (event.type) {
              case 'number':
                _this5.events[key] = new ControlNumber(event, view);
                break;

              case 'select':
                _this5.events[key] = new ControlSelect(event, view);
                break;

              case 'info':
                _this5.events[key] = new ControlInfo(event, view);
                break;

              case 'command':
                _this5.events[key] = new ControlCommand(event, view);
                break;
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        if (!view) _this5.done();
      });

      // listen to events
      _client2.default.receive('control:event', function (name, val) {
        var event = _this5.events[name];

        if (event) {
          event.set(val);
          _this5.emit('control:event', name, val);
        } else console.log('client control: received unknown event "' + name + '"');
      });
    }

    /**
     * Starts the module and requests the parameters to the server.
     */

  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Control.prototype), 'start', this).call(this);
      _client2.default.send('control:request');
    }

    /**
     * Restarts the module and requests the parameters to the server.
     */

  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(Control.prototype), 'restart', this).call(this);
      _client2.default.send('control:request');
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
})(_Module3.default);

exports.default = Control;
//# sourceMappingURL=data:application/json;base64,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SUFBSSxDQUFDLENBQUM7O0FBRWhDLFVBQUksS0FBSyxFQUFFO0FBQ1QsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2Q7S0FDRjs7Ozs7Ozs7OzsyQkFPTSxJQUFJLEVBQUUsR0FBRyxFQUFFO0FBQ2hCLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWhDLFVBQUksS0FBSyxFQUFFO0FBQ1QsYUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNmLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNkO0tBQ0Y7OztTQS9Ha0IsT0FBTzs7O2tCQUFQLE9BQU8iLCJmaWxlIjoiQ29udHJvbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cbmNsYXNzIENvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKHR5cGUsIG5hbWUsIGxhYmVsKSB7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuXG4gIH1cblxuICBzZW5kKCkge1xuICAgIGNsaWVudC5zZW5kKCdjb250cm9sOmV2ZW50JywgdGhpcy5uYW1lLCB0aGlzLnZhbHVlKTtcbiAgfVxufVxuXG5jbGFzcyBDb250cm9sTnVtYmVyIGV4dGVuZHMgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoaW5pdCwgdmlldyA9IG51bGwpIHtcbiAgICBzdXBlcignbnVtYmVyJywgaW5pdC5uYW1lLCBpbml0LmxhYmVsKTtcbiAgICB0aGlzLm1pbiA9IGluaXQubWluO1xuICAgIHRoaXMubWF4ID0gaW5pdC5tYXg7XG4gICAgdGhpcy5zdGVwID0gaW5pdC5zdGVwO1xuICAgIHRoaXMuYm94ID0gbnVsbDtcblxuICAgIGlmICh2aWV3KSB7XG4gICAgICBsZXQgYm94ID0gdGhpcy5ib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgYm94LnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLm5hbWUgKyAnLWJveCcpO1xuICAgICAgYm94LnNldEF0dHJpYnV0ZSgndHlwZScsICdudW1iZXInKTtcbiAgICAgIGJveC5zZXRBdHRyaWJ1dGUoJ21pbicsIHRoaXMubWluKTtcbiAgICAgIGJveC5zZXRBdHRyaWJ1dGUoJ21heCcsIHRoaXMubWF4KTtcbiAgICAgIGJveC5zZXRBdHRyaWJ1dGUoJ3N0ZXAnLCB0aGlzLnN0ZXApO1xuICAgICAgYm94LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDE2KTtcblxuICAgICAgYm94Lm9uY2hhbmdlID0gKCgpID0+IHtcbiAgICAgICAgbGV0IHZhbCA9IE51bWJlcihib3gudmFsdWUpO1xuICAgICAgICB0aGlzLnNldCh2YWwpO1xuICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgaW5jckJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgaW5jckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5uYW1lICsgJy1pbmNyJyk7XG4gICAgICBpbmNyQnV0dG9uLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnMC41ZW0nKTtcbiAgICAgIGluY3JCdXR0b24uaW5uZXJIVE1MID0gJz4nO1xuICAgICAgaW5jckJ1dHRvbi5vbmNsaWNrID0gKCgpID0+IHtcbiAgICAgICAgdGhpcy5pbmNyKCk7XG4gICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGxldCBkZWNyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBkZWNyQnV0dG9uLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLm5hbWUgKyAnLWRlc2NyJyk7XG4gICAgICBkZWNyQnV0dG9uLnN0eWxlLndpZHRoID0gJzAuNWVtJztcbiAgICAgIGRlY3JCdXR0b24uaW5uZXJIVE1MID0gJzwnO1xuICAgICAgZGVjckJ1dHRvbi5vbmNsaWNrID0gKCgpID0+IHtcbiAgICAgICAgdGhpcy5kZWNyKCk7XG4gICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGxhYmVsLmlubmVySFRNTCA9IHRoaXMubGFiZWwgKyAnOiAnO1xuXG4gICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGRlY3JCdXR0b24pO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGJveCk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoaW5jckJ1dHRvbik7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG5cbiAgICAgIHZpZXcuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldChpbml0LnZhbHVlKTtcbiAgfVxuXG4gIHNldCh2YWwsIHNlbmQgPSBmYWxzZSkge1xuICAgIHRoaXMudmFsdWUgPSBNYXRoLm1pbih0aGlzLm1heCwgTWF0aC5tYXgodGhpcy5taW4sIHZhbCkpO1xuXG4gICAgaWYgKHRoaXMuYm94KVxuICAgICAgdGhpcy5ib3gudmFsdWUgPSB2YWw7XG4gIH1cblxuICBpbmNyKCkge1xuICAgIGxldCBzdGVwcyA9IE1hdGguZmxvb3IodGhpcy52YWx1ZSAvIHRoaXMuc3RlcCArIDAuNSk7XG4gICAgdGhpcy5zZXQodGhpcy5zdGVwICogKHN0ZXBzICsgMSkpO1xuICB9XG5cbiAgZGVjcigpIHtcbiAgICBsZXQgc3RlcHMgPSBNYXRoLmZsb29yKHRoaXMudmFsdWUgLyB0aGlzLnN0ZXAgKyAwLjUpO1xuICAgIHRoaXMuc2V0KHRoaXMuc3RlcCAqIChzdGVwcyAtIDEpKTtcbiAgfVxufVxuXG5jbGFzcyBDb250cm9sU2VsZWN0IGV4dGVuZHMgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoaW5pdCwgdmlldyA9IG51bGwpIHtcbiAgICBzdXBlcignc2VsZWN0JywgaW5pdC5uYW1lLCBpbml0LmxhYmVsKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBpbml0Lm9wdGlvbnM7XG4gICAgdGhpcy5ib3ggPSBudWxsO1xuXG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIGxldCBib3ggPSB0aGlzLmJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgICAgYm94LnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLm5hbWUgKyAnLWJveCcpO1xuXG4gICAgICBmb3IgKGxldCBvcHRpb24gb2YgdGhpcy5vcHRpb25zKSB7XG4gICAgICAgIGxldCBvcHRFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgICAgb3B0RWxlbS52YWx1ZSA9IG9wdGlvbjtcbiAgICAgICAgb3B0RWxlbS50ZXh0ID0gb3B0aW9uO1xuICAgICAgICBib3guYXBwZW5kQ2hpbGQob3B0RWxlbSk7XG4gICAgICB9XG5cbiAgICAgIGJveC5vbmNoYW5nZSA9ICgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0KGJveC52YWx1ZSk7XG4gICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGxldCBpbmNyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBpbmNyQnV0dG9uLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLm5hbWUgKyAnLWluY3InKTtcbiAgICAgIGluY3JCdXR0b24uc2V0QXR0cmlidXRlKCd3aWR0aCcsICcwLjVlbScpO1xuICAgICAgaW5jckJ1dHRvbi5pbm5lckhUTUwgPSAnPic7XG4gICAgICBpbmNyQnV0dG9uLm9uY2xpY2sgPSAoKCkgPT4ge1xuICAgICAgICB0aGlzLmluY3IoKTtcbiAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGRlY3JCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGRlY3JCdXR0b24uc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctZGVzY3InKTtcbiAgICAgIGRlY3JCdXR0b24uc3R5bGUud2lkdGggPSAnMC41ZW0nO1xuICAgICAgZGVjckJ1dHRvbi5pbm5lckhUTUwgPSAnPCc7XG4gICAgICBkZWNyQnV0dG9uLm9uY2xpY2sgPSAoKCkgPT4ge1xuICAgICAgICB0aGlzLmRlY3IoKTtcbiAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGFiZWwuaW5uZXJIVE1MID0gdGhpcy5sYWJlbCArICc6ICc7XG5cbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoZGVjckJ1dHRvbik7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoYm94KTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChpbmNyQnV0dG9uKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcblxuICAgICAgdmlldy5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0KGluaXQudmFsdWUpO1xuICB9XG5cbiAgc2V0KHZhbCwgc2VuZCA9IGZhbHNlKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5vcHRpb25zLmluZGV4T2YodmFsKTtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsO1xuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuXG4gICAgICBpZiAodGhpcy5ib3gpXG4gICAgICAgIHRoaXMuYm94LnZhbHVlID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGluY3IoKSB7XG4gICAgdGhpcy5pbmRleCA9ICh0aGlzLmluZGV4ICsgMSkgJSB0aGlzLm9wdGlvbnMubGVuZ3RoO1xuICAgIHRoaXMuc2V0KHRoaXMub3B0aW9uc1t0aGlzLmluZGV4XSk7XG4gIH1cblxuICBkZWNyKCkge1xuICAgIHRoaXMuaW5kZXggPSAodGhpcy5pbmRleCArIHRoaXMub3B0aW9ucy5sZW5ndGggLSAxKSAlIHRoaXMub3B0aW9ucy5sZW5ndGg7XG4gICAgdGhpcy5zZXQodGhpcy5vcHRpb25zW3RoaXMuaW5kZXhdKTtcbiAgfVxufVxuXG5jbGFzcyBDb250cm9sSW5mbyBleHRlbmRzIENvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKGluaXQsIHZpZXcgPSBudWxsKSB7XG4gICAgc3VwZXIoJ2luZm8nLCBpbml0Lm5hbWUsIGluaXQubGFiZWwpO1xuICAgIHRoaXMuYm94ID0gbnVsbDtcblxuICAgIGlmICh2aWV3KSB7XG4gICAgICBsZXQgYm94ID0gdGhpcy5ib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctYm94Jyk7XG5cbiAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGxhYmVsLmlubmVySFRNTCA9IHRoaXMubGFiZWwgKyAnOiAnO1xuXG4gICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGJveCk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG5cbiAgICAgIHZpZXcuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldChpbml0LnZhbHVlKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsO1xuXG4gICAgaWYgKHRoaXMuYm94KVxuICAgICAgdGhpcy5ib3guaW5uZXJIVE1MID0gdmFsO1xuICB9XG59XG5cbmNsYXNzIENvbnRyb2xDb21tYW5kIGV4dGVuZHMgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoaW5pdCwgdmlldyA9IG51bGwpIHtcbiAgICBzdXBlcignY29tbWFuZCcsIGluaXQubmFtZSwgaW5pdC5sYWJlbCk7XG5cbiAgICBpZiAodmlldykge1xuICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLm5hbWUgKyAnLWJ0bicpO1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2NvbW1hbmQnKTtcbiAgICAgIGRpdi5pbm5lckhUTUwgPSB0aGlzLmxhYmVsO1xuXG4gICAgICBkaXYub25jbGljayA9ICgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHZpZXcuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgIHZpZXcuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVGhlIHtAbGluayBDbGllbnRDb250cm9sfSBtb2R1bGUgdGFrZXMgY2FyZSBvZiB0aGUgZ2xvYmFsIGBwYXJhbWV0ZXJzYCwgYGluZm9zYCwgYW5kIGBjb21tYW5kc2Agb24gdGhlIGNsaWVudCBzaWRlLlxuICogSWYgdGhlIG1vZHVsZSBpcyBpbnN0YW50aWF0ZWQgd2l0aCB0aGUgYGd1aWAgb3B0aW9uIHNldCB0byBgdHJ1ZWAsIGl0IGNvbnN0cnVjdHMgdGhlIGdyYXBoaWNhbCBjb250cm9sIGludGVyZmFjZS5cbiAqIE90aGVyd2lzZSBpdCBzaW1wbHkgcmVjZWl2ZXMgdGhlIHZhbHVlcyB0aGF0IGFyZSBlbWl0dGVkIGJ5IHRoZSBzZXJ2ZXIgKHVzdWFsbHkgYnkgdGhyb3VnaCB0aGUgYHBlcmZvcm1hbmNlYCBtb2R1bGUpLlxuICpcbiAqIFRoZSB7QGxpbmsgQ2xpZW50Q29udHJvbH0gY2FsbHMgaXRzIGBkb25lYCBtZXRob2Q6XG4gKiAtIEltbWVkaWF0ZWx5IGFmdGVyIGhhdmluZyBzZXQgdXAgdGhlIGNvbnRyb2xzIGlmIHRoZSBHVUkgaXMgZGlzYWJsZWQ7XG4gKiAtIE5ldmVyIGlmIHRoZSBHVUkgaXMgZW5hYmxlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbCBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nc3luYyddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5ndWk9dHJ1ZV0gSW5kaWNhdGVzIHdoZXRoZXIgdG8gY3JlYXRlIHRoZSBncmFwaGljYWwgdXNlciBpbnRlcmZhY2UgdG8gY29udHJvbCB0aGUgcGFyYW1ldGVycyBvciBub3QuXG4gICAqIEBlbWl0cyB7J2NvbnRyb2w6ZXZlbnQnfSB3aGVuIHRoZSBzZXJ2ZXIgc2VuZHMgYW4gdXBkYXRlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdjb250cm9sJywgKG9wdGlvbnMuZ3VpID09PSB0cnVlKSwgb3B0aW9ucy5jb2xvcik7XG5cbiAgICAvKipcbiAgICAgKiBEaWN0aW9uYXJ5IG9mIGFsbCB0aGUgcGFyYW1ldGVycyBhbmQgY29tbWFuZHMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuXG4gICAgdGhpcy5faW5pdCgpO1xuICB9XG5cbiAgX2luaXQoKSB7XG4gICAgbGV0IHZpZXcgPSB0aGlzLl9vd25zVmlldyA/IHRoaXMudmlldyA6IG51bGw7XG5cbiAgICBjbGllbnQucmVjZWl2ZSgnY29udHJvbDppbml0JywgKGV2ZW50cykgPT4ge1xuICAgICAgaWYgKHZpZXcpIHtcbiAgICAgICAgbGV0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKTtcbiAgICAgICAgdGl0bGUuaW5uZXJIVE1MID0gJ0NvbmR1Y3Rvcic7XG4gICAgICAgIHZpZXcuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoZXZlbnRzKSkge1xuICAgICAgICBsZXQgZXZlbnQgPSBldmVudHNba2V5XTtcblxuICAgICAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgdGhpcy5ldmVudHNba2V5XSA9IG5ldyBDb250cm9sTnVtYmVyKGV2ZW50LCB2aWV3KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2tleV0gPSBuZXcgQ29udHJvbFNlbGVjdChldmVudCwgdmlldyk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ2luZm8nOlxuICAgICAgICAgICAgdGhpcy5ldmVudHNba2V5XSA9IG5ldyBDb250cm9sSW5mbyhldmVudCwgdmlldyk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ2NvbW1hbmQnOlxuICAgICAgICAgICAgdGhpcy5ldmVudHNba2V5XSA9IG5ldyBDb250cm9sQ29tbWFuZChldmVudCwgdmlldyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIXZpZXcpXG4gICAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gbGlzdGVuIHRvIGV2ZW50c1xuICAgIGNsaWVudC5yZWNlaXZlKCdjb250cm9sOmV2ZW50JywgKG5hbWUsIHZhbCkgPT4ge1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5ldmVudHNbbmFtZV07XG5cbiAgICAgIGlmIChldmVudCkge1xuICAgICAgICBldmVudC5zZXQodmFsKTtcbiAgICAgICAgdGhpcy5lbWl0KCdjb250cm9sOmV2ZW50JywgbmFtZSwgdmFsKTtcbiAgICAgIH1cbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2coJ2NsaWVudCBjb250cm9sOiByZWNlaXZlZCB1bmtub3duIGV2ZW50IFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIG1vZHVsZSBhbmQgcmVxdWVzdHMgdGhlIHBhcmFtZXRlcnMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgY2xpZW50LnNlbmQoJ2NvbnRyb2w6cmVxdWVzdCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnRzIHRoZSBtb2R1bGUgYW5kIHJlcXVlc3RzIHRoZSBwYXJhbWV0ZXJzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICBjbGllbnQuc2VuZCgnY29udHJvbDpyZXF1ZXN0Jyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSB2YWx1ZSBvciBjb21tYW5kIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlciBvciBjb21tYW5kIHRvIHNlbmQuXG4gICAqIEB0b2RvIGlzIHRoaXMgbWV0aG9kIHVzZWZ1bD9cbiAgICovXG4gIHNlbmQobmFtZSkge1xuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudHNbbmFtZV07XG5cbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnNlbmQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgYSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7KFN0cmluZ3xOdW1iZXJ8Qm9vbGVhbil9IHZhbCBOZXcgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIHVwZGF0ZShuYW1lLCB2YWwpIHtcbiAgICBjb25zdCBldmVudCA9IHRoaXMuZXZlbnRzW25hbWVdO1xuXG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICBldmVudC5zZXQodmFsKTtcbiAgICAgIGV2ZW50LnNlbmQoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==