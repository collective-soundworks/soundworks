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
//# sourceMappingURL=data:application/json;base64,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QWlCLENBQUMsQ0FBQztLQUNoQzs7Ozs7OztXQUtNLG1CQUFHO0FBQ1IsaUNBOUVpQixPQUFPLHlDQThFUjtBQUNoQiwwQkFBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUNoQzs7Ozs7Ozs7O1dBT0csY0FBQyxJQUFJLEVBQUU7QUFDVCxVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVoQyxVQUFJLEtBQUssRUFBRTtBQUNULGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNkO0tBQ0Y7Ozs7Ozs7OztXQU9LLGdCQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDaEIsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFaEMsVUFBSSxLQUFLLEVBQUU7QUFDVCxhQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2Q7S0FDRjs7O1NBM0drQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiJzcmMvY2xpZW50L0NvbnRyb2wuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIENvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKHR5cGUsIG5hbWUsIGxhYmVsKSB7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuXG4gIH1cblxuICBzZW5kKCkge1xuICAgIGNsaWVudC5zZW5kKCdjb250cm9sOmV2ZW50JywgdGhpcy5uYW1lLCB0aGlzLnZhbHVlKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIENvbnRyb2xOdW1iZXIgZXh0ZW5kcyBDb250cm9sRXZlbnQge1xuICBjb25zdHJ1Y3Rvcihpbml0LCB2aWV3ID0gbnVsbCkge1xuICAgIHN1cGVyKCdudW1iZXInLCBpbml0Lm5hbWUsIGluaXQubGFiZWwpO1xuICAgIHRoaXMubWluID0gaW5pdC5taW47XG4gICAgdGhpcy5tYXggPSBpbml0Lm1heDtcbiAgICB0aGlzLnN0ZXAgPSBpbml0LnN0ZXA7XG4gICAgdGhpcy5ib3ggPSBudWxsO1xuXG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIGxldCBib3ggPSB0aGlzLmJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctYm94Jyk7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCd0eXBlJywgJ251bWJlcicpO1xuICAgICAgYm94LnNldEF0dHJpYnV0ZSgnbWluJywgdGhpcy5taW4pO1xuICAgICAgYm94LnNldEF0dHJpYnV0ZSgnbWF4JywgdGhpcy5tYXgpO1xuICAgICAgYm94LnNldEF0dHJpYnV0ZSgnc3RlcCcsIHRoaXMuc3RlcCk7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCdzaXplJywgMTYpO1xuXG4gICAgICBib3gub25jaGFuZ2UgPSAoKCkgPT4ge1xuICAgICAgICBsZXQgdmFsID0gTnVtYmVyKGJveC52YWx1ZSk7XG4gICAgICAgIHRoaXMuc2V0KHZhbCk7XG4gICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGxldCBpbmNyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBpbmNyQnV0dG9uLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLm5hbWUgKyAnLWluY3InKTtcbiAgICAgIGluY3JCdXR0b24uc2V0QXR0cmlidXRlKCd3aWR0aCcsICcwLjVlbScpO1xuICAgICAgaW5jckJ1dHRvbi5pbm5lckhUTUwgPSAnPic7XG4gICAgICBpbmNyQnV0dG9uLm9uY2xpY2sgPSAoKCkgPT4ge1xuICAgICAgICB0aGlzLmluY3IoKTtcbiAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGRlY3JCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGRlY3JCdXR0b24uc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctZGVzY3InKTtcbiAgICAgIGRlY3JCdXR0b24uc3R5bGUud2lkdGggPSAnMC41ZW0nO1xuICAgICAgZGVjckJ1dHRvbi5pbm5lckhUTUwgPSAnPCc7XG4gICAgICBkZWNyQnV0dG9uLm9uY2xpY2sgPSAoKCkgPT4ge1xuICAgICAgICB0aGlzLmRlY3IoKTtcbiAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGFiZWwuaW5uZXJIVE1MID0gdGhpcy5sYWJlbCArICc6ICc7XG5cbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoZGVjckJ1dHRvbik7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoYm94KTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChpbmNyQnV0dG9uKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcblxuICAgICAgdmlldy5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0KGluaXQudmFsdWUpO1xuICB9XG5cbiAgc2V0KHZhbCwgc2VuZCA9IGZhbHNlKSB7XG4gICAgdGhpcy52YWx1ZSA9IE1hdGgubWluKHRoaXMubWF4LCBNYXRoLm1heCh0aGlzLm1pbiwgdmFsKSk7XG5cbiAgICBpZiAodGhpcy5ib3gpXG4gICAgICB0aGlzLmJveC52YWx1ZSA9IHZhbDtcbiAgfVxuXG4gIGluY3IoKSB7XG4gICAgbGV0IHN0ZXBzID0gTWF0aC5mbG9vcih0aGlzLnZhbHVlIC8gdGhpcy5zdGVwICsgMC41KTtcbiAgICB0aGlzLnNldCh0aGlzLnN0ZXAgKiAoc3RlcHMgKyAxKSk7XG4gIH1cblxuICBkZWNyKCkge1xuICAgIGxldCBzdGVwcyA9IE1hdGguZmxvb3IodGhpcy52YWx1ZSAvIHRoaXMuc3RlcCArIDAuNSk7XG4gICAgdGhpcy5zZXQodGhpcy5zdGVwICogKHN0ZXBzIC0gMSkpO1xuICB9XG59XG5cbmNsYXNzIENvbnRyb2xTZWxlY3QgZXh0ZW5kcyBDb250cm9sRXZlbnQge1xuICBjb25zdHJ1Y3Rvcihpbml0LCB2aWV3ID0gbnVsbCkge1xuICAgIHN1cGVyKCdzZWxlY3QnLCBpbml0Lm5hbWUsIGluaXQubGFiZWwpO1xuICAgIHRoaXMub3B0aW9ucyA9IGluaXQub3B0aW9ucztcbiAgICB0aGlzLmJveCA9IG51bGw7XG5cbiAgICBpZiAodmlldykge1xuICAgICAgbGV0IGJveCA9IHRoaXMuYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctYm94Jyk7XG5cbiAgICAgIGZvciAobGV0IG9wdGlvbiBvZiB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgbGV0IG9wdEVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgICAgICBvcHRFbGVtLnZhbHVlID0gb3B0aW9uO1xuICAgICAgICBvcHRFbGVtLnRleHQgPSBvcHRpb247XG4gICAgICAgIGJveC5hcHBlbmRDaGlsZChvcHRFbGVtKTtcbiAgICAgIH1cblxuICAgICAgYm94Lm9uY2hhbmdlID0gKCgpID0+IHtcbiAgICAgICAgdGhpcy5zZXQoYm94LnZhbHVlKTtcbiAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGluY3JCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGluY3JCdXR0b24uc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctaW5jcicpO1xuICAgICAgaW5jckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzAuNWVtJyk7XG4gICAgICBpbmNyQnV0dG9uLmlubmVySFRNTCA9ICc+JztcbiAgICAgIGluY3JCdXR0b24ub25jbGljayA9ICgoKSA9PiB7XG4gICAgICAgIHRoaXMuaW5jcigpO1xuICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgZGVjckJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgZGVjckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5uYW1lICsgJy1kZXNjcicpO1xuICAgICAgZGVjckJ1dHRvbi5zdHlsZS53aWR0aCA9ICcwLjVlbSc7XG4gICAgICBkZWNyQnV0dG9uLmlubmVySFRNTCA9ICc8JztcbiAgICAgIGRlY3JCdXR0b24ub25jbGljayA9ICgoKSA9PiB7XG4gICAgICAgIHRoaXMuZGVjcigpO1xuICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBsYWJlbC5pbm5lckhUTUwgPSB0aGlzLmxhYmVsICsgJzogJztcblxuICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChkZWNyQnV0dG9uKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChib3gpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGluY3JCdXR0b24pO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuXG4gICAgICB2aWV3LmFwcGVuZENoaWxkKGRpdik7XG4gICAgfVxuXG4gICAgdGhpcy5zZXQoaW5pdC52YWx1ZSk7XG4gIH1cblxuICBzZXQodmFsLCBzZW5kID0gZmFsc2UpIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLm9wdGlvbnMuaW5kZXhPZih2YWwpO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG5cbiAgICAgIGlmICh0aGlzLmJveClcbiAgICAgICAgdGhpcy5ib3gudmFsdWUgPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgaW5jcigpIHtcbiAgICB0aGlzLmluZGV4ID0gKHRoaXMuaW5kZXggKyAxKSAlIHRoaXMub3B0aW9ucy5sZW5ndGg7XG4gICAgdGhpcy5zZXQodGhpcy5vcHRpb25zW3RoaXMuaW5kZXhdKTtcbiAgfVxuXG4gIGRlY3IoKSB7XG4gICAgdGhpcy5pbmRleCA9ICh0aGlzLmluZGV4ICsgdGhpcy5vcHRpb25zLmxlbmd0aCAtIDEpICUgdGhpcy5vcHRpb25zLmxlbmd0aDtcbiAgICB0aGlzLnNldCh0aGlzLm9wdGlvbnNbdGhpcy5pbmRleF0pO1xuICB9XG59XG5cbmNsYXNzIENvbnRyb2xJbmZvIGV4dGVuZHMgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoaW5pdCwgdmlldyA9IG51bGwpIHtcbiAgICBzdXBlcignaW5mbycsIGluaXQubmFtZSwgaW5pdC5sYWJlbCk7XG4gICAgdGhpcy5ib3ggPSBudWxsO1xuXG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIGxldCBib3ggPSB0aGlzLmJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGJveC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5uYW1lICsgJy1ib3gnKTtcblxuICAgICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGFiZWwuaW5uZXJIVE1MID0gdGhpcy5sYWJlbCArICc6ICc7XG5cbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoYm94KTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcblxuICAgICAgdmlldy5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0KGluaXQudmFsdWUpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWw7XG5cbiAgICBpZiAodGhpcy5ib3gpXG4gICAgICB0aGlzLmJveC5pbm5lckhUTUwgPSB2YWw7XG4gIH1cbn1cblxuY2xhc3MgQ29udHJvbENvbW1hbmQgZXh0ZW5kcyBDb250cm9sRXZlbnQge1xuICBjb25zdHJ1Y3Rvcihpbml0LCB2aWV3ID0gbnVsbCkge1xuICAgIHN1cGVyKCdjb21tYW5kJywgaW5pdC5uYW1lLCBpbml0LmxhYmVsKTtcblxuICAgIGlmICh2aWV3KSB7XG4gICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctYnRuJyk7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnY29tbWFuZCcpO1xuICAgICAgZGl2LmlubmVySFRNTCA9IHRoaXMubGFiZWw7XG5cbiAgICAgIGRpdi5vbmNsaWNrID0gKCgpID0+IHtcbiAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICB9KTtcblxuICAgICAgdmlldy5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgdmlldy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUge0BsaW5rIENsaWVudENvbnRyb2x9IG1vZHVsZSB0YWtlcyBjYXJlIG9mIHRoZSBnbG9iYWwgYHBhcmFtZXRlcnNgLCBgaW5mb3NgLCBhbmQgYGNvbW1hbmRzYCBvbiB0aGUgY2xpZW50IHNpZGUuXG4gKiBJZiB0aGUgbW9kdWxlIGlzIGluc3RhbnRpYXRlZCB3aXRoIHRoZSBgZ3VpYCBvcHRpb24gc2V0IHRvIGB0cnVlYCwgaXQgY29uc3RydWN0cyB0aGUgZ3JhcGhpY2FsIGNvbnRyb2wgaW50ZXJmYWNlLlxuICogT3RoZXJ3aXNlIGl0IHNpbXBseSByZWNlaXZlcyB0aGUgdmFsdWVzIHRoYXQgYXJlIGVtaXR0ZWQgYnkgdGhlIHNlcnZlciAodXN1YWxseSBieSB0aHJvdWdoIHRoZSBgcGVyZm9ybWFuY2VgIG1vZHVsZSkuXG4gKlxuICogVGhlIHtAbGluayBDbGllbnRDb250cm9sfSBjYWxscyBpdHMgYGRvbmVgIG1ldGhvZDpcbiAqIC0gSW1tZWRpYXRlbHkgYWZ0ZXIgaGF2aW5nIHNldCB1cCB0aGUgY29udHJvbHMgaWYgdGhlIEdVSSBpcyBkaXNhYmxlZDtcbiAqIC0gTmV2ZXIgaWYgdGhlIEdVSSBpcyBlbmFibGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250cm9sIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdzeW5jJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmd1aT10cnVlXSBJbmRpY2F0ZXMgd2hldGhlciB0byBjcmVhdGUgdGhlIGdyYXBoaWNhbCB1c2VyIGludGVyZmFjZSB0byBjb250cm9sIHRoZSBwYXJhbWV0ZXJzIG9yIG5vdC5cbiAgICogQGVtaXRzIHsnY29udHJvbDpldmVudCd9IHdoZW4gdGhlIHNlcnZlciBzZW5kcyBhbiB1cGRhdGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2NvbnRyb2wnLCAob3B0aW9ucy5ndWkgPT09IHRydWUpLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIC8qKlxuICAgICAqIERpY3Rpb25hcnkgb2YgYWxsIHRoZSBwYXJhbWV0ZXJzIGFuZCBjb21tYW5kcy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnRzID0ge307XG5cbiAgICBsZXQgdmlldyA9IHRoaXMuX293bnNWaWV3ID8gdGhpcy52aWV3IDogbnVsbDtcblxuICAgIGNsaWVudC5yZWNlaXZlKCdjb250cm9sOmluaXQnLCAoZXZlbnRzKSA9PiB7XG4gICAgICBpZiAodmlldykge1xuICAgICAgICBsZXQgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuICAgICAgICB0aXRsZS5pbm5lckhUTUwgPSAnQ29uZHVjdG9yJztcbiAgICAgICAgdmlldy5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhldmVudHMpKSB7XG4gICAgICAgIGxldCBldmVudCA9IGV2ZW50c1trZXldO1xuXG4gICAgICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xuICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldID0gbmV3IENvbnRyb2xOdW1iZXIoZXZlbnQsIHZpZXcpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICAgICAgdGhpcy5ldmVudHNba2V5XSA9IG5ldyBDb250cm9sU2VsZWN0KGV2ZW50LCB2aWV3KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnaW5mbyc6XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldID0gbmV3IENvbnRyb2xJbmZvKGV2ZW50LCB2aWV3KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnY29tbWFuZCc6XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldID0gbmV3IENvbnRyb2xDb21tYW5kKGV2ZW50LCB2aWV3KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghdmlldylcbiAgICAgICAgdGhpcy5kb25lKCk7XG4gICAgfSk7XG5cbiAgICAvLyBsaXN0ZW4gdG8gZXZlbnRzXG4gICAgY2xpZW50LnJlY2VpdmUoJ2NvbnRyb2w6ZXZlbnQnLCAobmFtZSwgdmFsKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnNldCh2YWwpO1xuICAgICAgICB0aGlzLmVtaXQoJ2NvbnRyb2w6ZXZlbnQnLCBuYW1lLCB2YWwpO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZygnY2xpZW50IGNvbnRyb2w6IHJlY2VpdmVkIHVua25vd24gZXZlbnQgXCInICsgbmFtZSArICdcIicpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlIGFuZCByZXF1ZXN0cyB0aGUgcGFyYW1ldGVycyB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICBjbGllbnQuc2VuZCgnY29udHJvbDpyZXF1ZXN0Jyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZSBhbmQgcmVxdWVzdHMgdGhlIHBhcmFtZXRlcnMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIGNsaWVudC5zZW5kKCdjb250cm9sOnJlcXVlc3QnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIHZhbHVlIG9yIGNvbW1hbmQgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyIG9yIGNvbW1hbmQgdG8gc2VuZC5cbiAgICogQHRvZG8gaXMgdGhpcyBtZXRob2QgdXNlZnVsP1xuICAgKi9cbiAgc2VuZChuYW1lKSB7XG4gICAgY29uc3QgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQuc2VuZCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB2YWx1ZSBvZiBhIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHsoU3RyaW5nfE51bWJlcnxCb29sZWFuKX0gdmFsIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbCkge1xuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudHNbbmFtZV07XG5cbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnNldCh2YWwpO1xuICAgICAgZXZlbnQuc2VuZCgpO1xuICAgIH1cbiAgfVxufVxuIl19