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
   * The {@link ClientControl} module takes care of the global `parameters`, `infos`, and `commands` on the client side.
   * If the module is instantiated with the `gui` option set to `true`, it constructs the graphical control interface.
   * Otherwise it simply receives the values that are emitted by the server (usually by through the `performance` module).
   *
   * The {@link ClientControl} calls its `done` method:
   * - Immediately after having set up the controls if the GUI is disabled;
   * - Never if the GUI is enabled.
   */
  return ControlCommand;
})(ControlEvent);

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
    var _this4 = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Control);

    _get(Object.getPrototypeOf(Control.prototype), 'constructor', this).call(this, options.name || 'control', options.gui === true, options.color);

    /**
     * Dictionary of all the parameters and commands.
     * @type {Object}
     */
    this.events = {};

    var view = hasGui ? this.view : null;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7O0lBRXZCLFlBQVk7QUFDTCxXQURQLFlBQVksQ0FDSixJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTswQkFEM0IsWUFBWTs7QUFFZCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixRQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztHQUN4Qjs7ZUFORyxZQUFZOztXQVFiLGFBQUMsR0FBRyxFQUFFLEVBRVI7OztXQUVHLGdCQUFHO0FBQ0wsMEJBQU8sSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNyRDs7O1NBZEcsWUFBWTs7O0lBaUJaLGFBQWE7WUFBYixhQUFhOztBQUNOLFdBRFAsYUFBYSxDQUNMLElBQUksRUFBZTs7O1FBQWIsSUFBSSx5REFBRyxJQUFJOzswQkFEekIsYUFBYTs7QUFFZiwrQkFGRSxhQUFhLDZDQUVULFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDdkMsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNwQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdEIsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7O0FBRWhCLFFBQUksSUFBSSxFQUFFOztBQUNSLFlBQUksR0FBRyxHQUFHLE1BQUssR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENB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Qzs7Ozs7OztXQUtNLG1CQUFHO0FBQ1IsaUNBOUVpQixPQUFPLHlDQThFUjtBQUNoQiwwQkFBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUNoQzs7Ozs7Ozs7O1dBT0csY0FBQyxJQUFJLEVBQUU7QUFDVCxVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVoQyxVQUFJLEtBQUssRUFBRTtBQUNULGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNkO0tBQ0Y7Ozs7Ozs7OztXQU9LLGdCQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDaEIsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFaEMsVUFBSSxLQUFLLEVBQUU7QUFDVCxhQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2Q7S0FDRjs7O1NBM0drQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiJzcmMvY2xpZW50L0NvbnRyb2wuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5jbGFzcyBDb250cm9sRXZlbnQge1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBuYW1lLCBsYWJlbCkge1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgdGhpcy52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHNldCh2YWwpIHtcblxuICB9XG5cbiAgc2VuZCgpIHtcbiAgICBjbGllbnQuc2VuZCgnY29udHJvbDpldmVudCcsIHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7XG4gIH1cbn1cblxuY2xhc3MgQ29udHJvbE51bWJlciBleHRlbmRzIENvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKGluaXQsIHZpZXcgPSBudWxsKSB7XG4gICAgc3VwZXIoJ251bWJlcicsIGluaXQubmFtZSwgaW5pdC5sYWJlbCk7XG4gICAgdGhpcy5taW4gPSBpbml0Lm1pbjtcbiAgICB0aGlzLm1heCA9IGluaXQubWF4O1xuICAgIHRoaXMuc3RlcCA9IGluaXQuc3RlcDtcbiAgICB0aGlzLmJveCA9IG51bGw7XG5cbiAgICBpZiAodmlldykge1xuICAgICAgbGV0IGJveCA9IHRoaXMuYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgIGJveC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5uYW1lICsgJy1ib3gnKTtcbiAgICAgIGJveC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnbnVtYmVyJyk7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCdtaW4nLCB0aGlzLm1pbik7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCdtYXgnLCB0aGlzLm1heCk7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCdzdGVwJywgdGhpcy5zdGVwKTtcbiAgICAgIGJveC5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAxNik7XG5cbiAgICAgIGJveC5vbmNoYW5nZSA9ICgoKSA9PiB7XG4gICAgICAgIGxldCB2YWwgPSBOdW1iZXIoYm94LnZhbHVlKTtcbiAgICAgICAgdGhpcy5zZXQodmFsKTtcbiAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGluY3JCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGluY3JCdXR0b24uc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctaW5jcicpO1xuICAgICAgaW5jckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzAuNWVtJyk7XG4gICAgICBpbmNyQnV0dG9uLmlubmVySFRNTCA9ICc+JztcbiAgICAgIGluY3JCdXR0b24ub25jbGljayA9ICgoKSA9PiB7XG4gICAgICAgIHRoaXMuaW5jcigpO1xuICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgZGVjckJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgZGVjckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5uYW1lICsgJy1kZXNjcicpO1xuICAgICAgZGVjckJ1dHRvbi5zdHlsZS53aWR0aCA9ICcwLjVlbSc7XG4gICAgICBkZWNyQnV0dG9uLmlubmVySFRNTCA9ICc8JztcbiAgICAgIGRlY3JCdXR0b24ub25jbGljayA9ICgoKSA9PiB7XG4gICAgICAgIHRoaXMuZGVjcigpO1xuICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBsYWJlbC5pbm5lckhUTUwgPSB0aGlzLmxhYmVsICsgJzogJztcblxuICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChkZWNyQnV0dG9uKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChib3gpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGluY3JCdXR0b24pO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuXG4gICAgICB2aWV3LmFwcGVuZENoaWxkKGRpdik7XG4gICAgfVxuXG4gICAgdGhpcy5zZXQoaW5pdC52YWx1ZSk7XG4gIH1cblxuICBzZXQodmFsLCBzZW5kID0gZmFsc2UpIHtcbiAgICB0aGlzLnZhbHVlID0gTWF0aC5taW4odGhpcy5tYXgsIE1hdGgubWF4KHRoaXMubWluLCB2YWwpKTtcblxuICAgIGlmICh0aGlzLmJveClcbiAgICAgIHRoaXMuYm94LnZhbHVlID0gdmFsO1xuICB9XG5cbiAgaW5jcigpIHtcbiAgICBsZXQgc3RlcHMgPSBNYXRoLmZsb29yKHRoaXMudmFsdWUgLyB0aGlzLnN0ZXAgKyAwLjUpO1xuICAgIHRoaXMuc2V0KHRoaXMuc3RlcCAqIChzdGVwcyArIDEpKTtcbiAgfVxuXG4gIGRlY3IoKSB7XG4gICAgbGV0IHN0ZXBzID0gTWF0aC5mbG9vcih0aGlzLnZhbHVlIC8gdGhpcy5zdGVwICsgMC41KTtcbiAgICB0aGlzLnNldCh0aGlzLnN0ZXAgKiAoc3RlcHMgLSAxKSk7XG4gIH1cbn1cblxuY2xhc3MgQ29udHJvbFNlbGVjdCBleHRlbmRzIENvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKGluaXQsIHZpZXcgPSBudWxsKSB7XG4gICAgc3VwZXIoJ3NlbGVjdCcsIGluaXQubmFtZSwgaW5pdC5sYWJlbCk7XG4gICAgdGhpcy5vcHRpb25zID0gaW5pdC5vcHRpb25zO1xuICAgIHRoaXMuYm94ID0gbnVsbDtcblxuICAgIGlmICh2aWV3KSB7XG4gICAgICBsZXQgYm94ID0gdGhpcy5ib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICAgIGJveC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5uYW1lICsgJy1ib3gnKTtcblxuICAgICAgZm9yIChsZXQgb3B0aW9uIG9mIHRoaXMub3B0aW9ucykge1xuICAgICAgICBsZXQgb3B0RWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgICAgIG9wdEVsZW0udmFsdWUgPSBvcHRpb247XG4gICAgICAgIG9wdEVsZW0udGV4dCA9IG9wdGlvbjtcbiAgICAgICAgYm94LmFwcGVuZENoaWxkKG9wdEVsZW0pO1xuICAgICAgfVxuXG4gICAgICBib3gub25jaGFuZ2UgPSAoKCkgPT4ge1xuICAgICAgICB0aGlzLnNldChib3gudmFsdWUpO1xuICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgaW5jckJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgaW5jckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5uYW1lICsgJy1pbmNyJyk7XG4gICAgICBpbmNyQnV0dG9uLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnMC41ZW0nKTtcbiAgICAgIGluY3JCdXR0b24uaW5uZXJIVE1MID0gJz4nO1xuICAgICAgaW5jckJ1dHRvbi5vbmNsaWNrID0gKCgpID0+IHtcbiAgICAgICAgdGhpcy5pbmNyKCk7XG4gICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGxldCBkZWNyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBkZWNyQnV0dG9uLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLm5hbWUgKyAnLWRlc2NyJyk7XG4gICAgICBkZWNyQnV0dG9uLnN0eWxlLndpZHRoID0gJzAuNWVtJztcbiAgICAgIGRlY3JCdXR0b24uaW5uZXJIVE1MID0gJzwnO1xuICAgICAgZGVjckJ1dHRvbi5vbmNsaWNrID0gKCgpID0+IHtcbiAgICAgICAgdGhpcy5kZWNyKCk7XG4gICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGxhYmVsLmlubmVySFRNTCA9IHRoaXMubGFiZWwgKyAnOiAnO1xuXG4gICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGRlY3JCdXR0b24pO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGJveCk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoaW5jckJ1dHRvbik7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG5cbiAgICAgIHZpZXcuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldChpbml0LnZhbHVlKTtcbiAgfVxuXG4gIHNldCh2YWwsIHNlbmQgPSBmYWxzZSkge1xuICAgIGxldCBpbmRleCA9IHRoaXMub3B0aW9ucy5pbmRleE9mKHZhbCk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcblxuICAgICAgaWYgKHRoaXMuYm94KVxuICAgICAgICB0aGlzLmJveC52YWx1ZSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBpbmNyKCkge1xuICAgIHRoaXMuaW5kZXggPSAodGhpcy5pbmRleCArIDEpICUgdGhpcy5vcHRpb25zLmxlbmd0aDtcbiAgICB0aGlzLnNldCh0aGlzLm9wdGlvbnNbdGhpcy5pbmRleF0pO1xuICB9XG5cbiAgZGVjcigpIHtcbiAgICB0aGlzLmluZGV4ID0gKHRoaXMuaW5kZXggKyB0aGlzLm9wdGlvbnMubGVuZ3RoIC0gMSkgJSB0aGlzLm9wdGlvbnMubGVuZ3RoO1xuICAgIHRoaXMuc2V0KHRoaXMub3B0aW9uc1t0aGlzLmluZGV4XSk7XG4gIH1cbn1cblxuY2xhc3MgQ29udHJvbEluZm8gZXh0ZW5kcyBDb250cm9sRXZlbnQge1xuICBjb25zdHJ1Y3Rvcihpbml0LCB2aWV3ID0gbnVsbCkge1xuICAgIHN1cGVyKCdpbmZvJywgaW5pdC5uYW1lLCBpbml0LmxhYmVsKTtcbiAgICB0aGlzLmJveCA9IG51bGw7XG5cbiAgICBpZiAodmlldykge1xuICAgICAgbGV0IGJveCA9IHRoaXMuYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgYm94LnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLm5hbWUgKyAnLWJveCcpO1xuXG4gICAgICBsZXQgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBsYWJlbC5pbm5lckhUTUwgPSB0aGlzLmxhYmVsICsgJzogJztcblxuICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChib3gpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuXG4gICAgICB2aWV3LmFwcGVuZENoaWxkKGRpdik7XG4gICAgfVxuXG4gICAgdGhpcy5zZXQoaW5pdC52YWx1ZSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbDtcblxuICAgIGlmICh0aGlzLmJveClcbiAgICAgIHRoaXMuYm94LmlubmVySFRNTCA9IHZhbDtcbiAgfVxufVxuXG5jbGFzcyBDb250cm9sQ29tbWFuZCBleHRlbmRzIENvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKGluaXQsIHZpZXcgPSBudWxsKSB7XG4gICAgc3VwZXIoJ2NvbW1hbmQnLCBpbml0Lm5hbWUsIGluaXQubGFiZWwpO1xuXG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5uYW1lICsgJy1idG4nKTtcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdjb21tYW5kJyk7XG4gICAgICBkaXYuaW5uZXJIVE1MID0gdGhpcy5sYWJlbDtcblxuICAgICAgZGl2Lm9uY2xpY2sgPSAoKCkgPT4ge1xuICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgIH0pO1xuXG4gICAgICB2aWV3LmFwcGVuZENoaWxkKGRpdik7XG4gICAgICB2aWV3LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRoZSB7QGxpbmsgQ2xpZW50Q29udHJvbH0gbW9kdWxlIHRha2VzIGNhcmUgb2YgdGhlIGdsb2JhbCBgcGFyYW1ldGVyc2AsIGBpbmZvc2AsIGFuZCBgY29tbWFuZHNgIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAqIElmIHRoZSBtb2R1bGUgaXMgaW5zdGFudGlhdGVkIHdpdGggdGhlIGBndWlgIG9wdGlvbiBzZXQgdG8gYHRydWVgLCBpdCBjb25zdHJ1Y3RzIHRoZSBncmFwaGljYWwgY29udHJvbCBpbnRlcmZhY2UuXG4gKiBPdGhlcndpc2UgaXQgc2ltcGx5IHJlY2VpdmVzIHRoZSB2YWx1ZXMgdGhhdCBhcmUgZW1pdHRlZCBieSB0aGUgc2VydmVyICh1c3VhbGx5IGJ5IHRocm91Z2ggdGhlIGBwZXJmb3JtYW5jZWAgbW9kdWxlKS5cbiAqXG4gKiBUaGUge0BsaW5rIENsaWVudENvbnRyb2x9IGNhbGxzIGl0cyBgZG9uZWAgbWV0aG9kOlxuICogLSBJbW1lZGlhdGVseSBhZnRlciBoYXZpbmcgc2V0IHVwIHRoZSBjb250cm9scyBpZiB0aGUgR1VJIGlzIGRpc2FibGVkO1xuICogLSBOZXZlciBpZiB0aGUgR1VJIGlzIGVuYWJsZWQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2wgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3N5bmMnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZ3VpPXRydWVdIEluZGljYXRlcyB3aGV0aGVyIHRvIGNyZWF0ZSB0aGUgZ3JhcGhpY2FsIHVzZXIgaW50ZXJmYWNlIHRvIGNvbnRyb2wgdGhlIHBhcmFtZXRlcnMgb3Igbm90LlxuICAgKiBAZW1pdHMgeydjb250cm9sOmV2ZW50J30gd2hlbiB0aGUgc2VydmVyIHNlbmRzIGFuIHVwZGF0ZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY29udHJvbCcsIChvcHRpb25zLmd1aSA9PT0gdHJ1ZSksIG9wdGlvbnMuY29sb3IpO1xuXG4gICAgLyoqXG4gICAgICogRGljdGlvbmFyeSBvZiBhbGwgdGhlIHBhcmFtZXRlcnMgYW5kIGNvbW1hbmRzLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcblxuICAgIGxldCB2aWV3ID0gaGFzR3VpID8gdGhpcy52aWV3IDogbnVsbDtcblxuICAgIGNsaWVudC5yZWNlaXZlKCdjb250cm9sOmluaXQnLCAoZXZlbnRzKSA9PiB7XG4gICAgICBpZiAodmlldykge1xuICAgICAgICBsZXQgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuICAgICAgICB0aXRsZS5pbm5lckhUTUwgPSAnQ29uZHVjdG9yJztcbiAgICAgICAgdmlldy5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhldmVudHMpKSB7XG4gICAgICAgIGxldCBldmVudCA9IGV2ZW50c1trZXldO1xuXG4gICAgICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xuICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldID0gbmV3IENvbnRyb2xOdW1iZXIoZXZlbnQsIHZpZXcpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICAgICAgdGhpcy5ldmVudHNba2V5XSA9IG5ldyBDb250cm9sU2VsZWN0KGV2ZW50LCB2aWV3KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnaW5mbyc6XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldID0gbmV3IENvbnRyb2xJbmZvKGV2ZW50LCB2aWV3KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnY29tbWFuZCc6XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldID0gbmV3IENvbnRyb2xDb21tYW5kKGV2ZW50LCB2aWV3KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghdmlldylcbiAgICAgICAgdGhpcy5kb25lKCk7XG4gICAgfSk7XG5cbiAgICAvLyBsaXN0ZW4gdG8gZXZlbnRzXG4gICAgY2xpZW50LnJlY2VpdmUoJ2NvbnRyb2w6ZXZlbnQnLCAobmFtZSwgdmFsKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnNldCh2YWwpO1xuICAgICAgICB0aGlzLmVtaXQoJ2NvbnRyb2w6ZXZlbnQnLCBuYW1lLCB2YWwpO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZygnY2xpZW50IGNvbnRyb2w6IHJlY2VpdmVkIHVua25vd24gZXZlbnQgXCInICsgbmFtZSArICdcIicpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlIGFuZCByZXF1ZXN0cyB0aGUgcGFyYW1ldGVycyB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICBjbGllbnQuc2VuZCgnY29udHJvbDpyZXF1ZXN0Jyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZSBhbmQgcmVxdWVzdHMgdGhlIHBhcmFtZXRlcnMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIGNsaWVudC5zZW5kKCdjb250cm9sOnJlcXVlc3QnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIHZhbHVlIG9yIGNvbW1hbmQgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyIG9yIGNvbW1hbmQgdG8gc2VuZC5cbiAgICogQHRvZG8gaXMgdGhpcyBtZXRob2QgdXNlZnVsP1xuICAgKi9cbiAgc2VuZChuYW1lKSB7XG4gICAgY29uc3QgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQuc2VuZCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB2YWx1ZSBvZiBhIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHsoU3RyaW5nfE51bWJlcnxCb29sZWFuKX0gdmFsIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbCkge1xuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudHNbbmFtZV07XG5cbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnNldCh2YWwpO1xuICAgICAgZXZlbnQuc2VuZCgpO1xuICAgIH1cbiAgfVxufVxuIl19