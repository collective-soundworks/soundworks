'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var client = require('./client');
var ClientModule = require('./ClientModule');
// import client from './client.es6.js';
// import ClientModule from './ClientModule.es6.js';

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
      client.send('control:event', this.name, this.value);
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

var ClientControl = (function (_ClientModule) {
  _inherits(ClientControl, _ClientModule);

  // export default class ClientControl extends ClientModule {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='sync'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {Boolean} [options.gui=true] Indicates whether to create the graphical user interface to control the parameters or not.
   * @emits {'control:event'} when the server sends an update.
   */

  function ClientControl() {
    var _this4 = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientControl);

    _get(Object.getPrototypeOf(ClientControl.prototype), 'constructor', this).call(this, options.name || 'control', options.gui === true, options.color);

    /**
     * Dictionary of all the parameters and commands.
     * @type {Object}
     */
    this.events = {};

    var view = hasGui ? this.view : null;

    client.receive('control:init', function (events) {
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
    client.receive('control:event', function (name, val) {
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

  _createClass(ClientControl, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientControl.prototype), 'start', this).call(this);
      client.send('control:request');
    }

    /**
     * Restarts the module and requests the parameters to the server.
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(ClientControl.prototype), 'restart', this).call(this);
      client.send('control:request');
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

  return ClientControl;
})(ClientModule);

module.exports = ClientControl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBRWIsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ25DLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7O0lBSXpDLFlBQVk7QUFDTCxXQURQLFlBQVksQ0FDSixJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTswQkFEM0IsWUFBWTs7QUFFZCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixRQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztHQUN4Qjs7ZUFORyxZQUFZOztXQVFiLGFBQUMsR0FBRyxFQUFFLEVBRVI7OztXQUVHLGdCQUFHO0FBQ0wsWUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDckQ7OztTQWRHLFlBQVk7OztJQWlCWixhQUFhO1lBQWIsYUFBYTs7QUFDTixXQURQLGFBQWEsQ0FDTCxJQUFJLEVBQWU7OztRQUFiLElBQUkseURBQUcsSUFBSTs7MEJBRHpCLGFBQWE7O0FBRWYsK0JBRkUsYUFBYSw2Q0FFVCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ3ZDLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNwQixRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDcEIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxD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QUFhOztXQXNFWixpQkFBRztBQUNOLGlDQXZFRSxhQUFhLHVDQXVFRDtBQUNkLFlBQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUNoQzs7Ozs7OztXQUtNLG1CQUFHO0FBQ1IsaUNBL0VFLGFBQWEseUNBK0VDO0FBQ2hCLFlBQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUNoQzs7Ozs7Ozs7O1dBT0csY0FBQyxJQUFJLEVBQUU7QUFDVCxVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVoQyxVQUFJLEtBQUssRUFBRTtBQUNULGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNkO0tBQ0Y7Ozs7Ozs7OztXQU9LLGdCQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDaEIsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFaEMsVUFBSSxLQUFLLEVBQUU7QUFDVCxhQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2Q7S0FDRjs7O1NBNUdHLGFBQWE7R0FBUyxZQUFZOztBQStHeEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMiLCJmaWxlIjoic3JjL2NsaWVudC9Db250cm9sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBjbGllbnQgPSByZXF1aXJlKCcuL2NsaWVudCcpO1xuY29uc3QgQ2xpZW50TW9kdWxlID0gcmVxdWlyZSgnLi9DbGllbnRNb2R1bGUnKTtcbi8vIGltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQuZXM2LmpzJztcbi8vIGltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUuZXM2LmpzJztcblxuY2xhc3MgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IodHlwZSwgbmFtZSwgbGFiZWwpIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMudmFsdWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBzZXQodmFsKSB7XG5cbiAgfVxuXG4gIHNlbmQoKSB7XG4gICAgY2xpZW50LnNlbmQoJ2NvbnRyb2w6ZXZlbnQnLCB0aGlzLm5hbWUsIHRoaXMudmFsdWUpO1xuICB9XG59XG5cbmNsYXNzIENvbnRyb2xOdW1iZXIgZXh0ZW5kcyBDb250cm9sRXZlbnQge1xuICBjb25zdHJ1Y3Rvcihpbml0LCB2aWV3ID0gbnVsbCkge1xuICAgIHN1cGVyKCdudW1iZXInLCBpbml0Lm5hbWUsIGluaXQubGFiZWwpO1xuICAgIHRoaXMubWluID0gaW5pdC5taW47XG4gICAgdGhpcy5tYXggPSBpbml0Lm1heDtcbiAgICB0aGlzLnN0ZXAgPSBpbml0LnN0ZXA7XG4gICAgdGhpcy5ib3ggPSBudWxsO1xuXG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIGxldCBib3ggPSB0aGlzLmJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctYm94Jyk7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCd0eXBlJywgJ251bWJlcicpO1xuICAgICAgYm94LnNldEF0dHJpYnV0ZSgnbWluJywgdGhpcy5taW4pO1xuICAgICAgYm94LnNldEF0dHJpYnV0ZSgnbWF4JywgdGhpcy5tYXgpO1xuICAgICAgYm94LnNldEF0dHJpYnV0ZSgnc3RlcCcsIHRoaXMuc3RlcCk7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCdzaXplJywgMTYpO1xuXG4gICAgICBib3gub25jaGFuZ2UgPSAoKCkgPT4ge1xuICAgICAgICBsZXQgdmFsID0gTnVtYmVyKGJveC52YWx1ZSk7XG4gICAgICAgIHRoaXMuc2V0KHZhbCk7XG4gICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGxldCBpbmNyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBpbmNyQnV0dG9uLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLm5hbWUgKyAnLWluY3InKTtcbiAgICAgIGluY3JCdXR0b24uc2V0QXR0cmlidXRlKCd3aWR0aCcsICcwLjVlbScpO1xuICAgICAgaW5jckJ1dHRvbi5pbm5lckhUTUwgPSAnPic7XG4gICAgICBpbmNyQnV0dG9uLm9uY2xpY2sgPSAoKCkgPT4ge1xuICAgICAgICB0aGlzLmluY3IoKTtcbiAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGRlY3JCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGRlY3JCdXR0b24uc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctZGVzY3InKTtcbiAgICAgIGRlY3JCdXR0b24uc3R5bGUud2lkdGggPSAnMC41ZW0nO1xuICAgICAgZGVjckJ1dHRvbi5pbm5lckhUTUwgPSAnPCc7XG4gICAgICBkZWNyQnV0dG9uLm9uY2xpY2sgPSAoKCkgPT4ge1xuICAgICAgICB0aGlzLmRlY3IoKTtcbiAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGFiZWwuaW5uZXJIVE1MID0gdGhpcy5sYWJlbCArICc6ICc7XG5cbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoZGVjckJ1dHRvbik7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoYm94KTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChpbmNyQnV0dG9uKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcblxuICAgICAgdmlldy5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0KGluaXQudmFsdWUpO1xuICB9XG5cbiAgc2V0KHZhbCwgc2VuZCA9IGZhbHNlKSB7XG4gICAgdGhpcy52YWx1ZSA9IE1hdGgubWluKHRoaXMubWF4LCBNYXRoLm1heCh0aGlzLm1pbiwgdmFsKSk7XG5cbiAgICBpZiAodGhpcy5ib3gpXG4gICAgICB0aGlzLmJveC52YWx1ZSA9IHZhbDtcbiAgfVxuXG4gIGluY3IoKSB7XG4gICAgbGV0IHN0ZXBzID0gTWF0aC5mbG9vcih0aGlzLnZhbHVlIC8gdGhpcy5zdGVwICsgMC41KTtcbiAgICB0aGlzLnNldCh0aGlzLnN0ZXAgKiAoc3RlcHMgKyAxKSk7XG4gIH1cblxuICBkZWNyKCkge1xuICAgIGxldCBzdGVwcyA9IE1hdGguZmxvb3IodGhpcy52YWx1ZSAvIHRoaXMuc3RlcCArIDAuNSk7XG4gICAgdGhpcy5zZXQodGhpcy5zdGVwICogKHN0ZXBzIC0gMSkpO1xuICB9XG59XG5cbmNsYXNzIENvbnRyb2xTZWxlY3QgZXh0ZW5kcyBDb250cm9sRXZlbnQge1xuICBjb25zdHJ1Y3Rvcihpbml0LCB2aWV3ID0gbnVsbCkge1xuICAgIHN1cGVyKCdzZWxlY3QnLCBpbml0Lm5hbWUsIGluaXQubGFiZWwpO1xuICAgIHRoaXMub3B0aW9ucyA9IGluaXQub3B0aW9ucztcbiAgICB0aGlzLmJveCA9IG51bGw7XG5cbiAgICBpZiAodmlldykge1xuICAgICAgbGV0IGJveCA9IHRoaXMuYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctYm94Jyk7XG5cbiAgICAgIGZvciAobGV0IG9wdGlvbiBvZiB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgbGV0IG9wdEVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgICAgICBvcHRFbGVtLnZhbHVlID0gb3B0aW9uO1xuICAgICAgICBvcHRFbGVtLnRleHQgPSBvcHRpb247XG4gICAgICAgIGJveC5hcHBlbmRDaGlsZChvcHRFbGVtKTtcbiAgICAgIH1cblxuICAgICAgYm94Lm9uY2hhbmdlID0gKCgpID0+IHtcbiAgICAgICAgdGhpcy5zZXQoYm94LnZhbHVlKTtcbiAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGluY3JCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGluY3JCdXR0b24uc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctaW5jcicpO1xuICAgICAgaW5jckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzAuNWVtJyk7XG4gICAgICBpbmNyQnV0dG9uLmlubmVySFRNTCA9ICc+JztcbiAgICAgIGluY3JCdXR0b24ub25jbGljayA9ICgoKSA9PiB7XG4gICAgICAgIHRoaXMuaW5jcigpO1xuICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgZGVjckJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgZGVjckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5uYW1lICsgJy1kZXNjcicpO1xuICAgICAgZGVjckJ1dHRvbi5zdHlsZS53aWR0aCA9ICcwLjVlbSc7XG4gICAgICBkZWNyQnV0dG9uLmlubmVySFRNTCA9ICc8JztcbiAgICAgIGRlY3JCdXR0b24ub25jbGljayA9ICgoKSA9PiB7XG4gICAgICAgIHRoaXMuZGVjcigpO1xuICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBsYWJlbC5pbm5lckhUTUwgPSB0aGlzLmxhYmVsICsgJzogJztcblxuICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChkZWNyQnV0dG9uKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChib3gpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGluY3JCdXR0b24pO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuXG4gICAgICB2aWV3LmFwcGVuZENoaWxkKGRpdik7XG4gICAgfVxuXG4gICAgdGhpcy5zZXQoaW5pdC52YWx1ZSk7XG4gIH1cblxuICBzZXQodmFsLCBzZW5kID0gZmFsc2UpIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLm9wdGlvbnMuaW5kZXhPZih2YWwpO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG5cbiAgICAgIGlmICh0aGlzLmJveClcbiAgICAgICAgdGhpcy5ib3gudmFsdWUgPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgaW5jcigpIHtcbiAgICB0aGlzLmluZGV4ID0gKHRoaXMuaW5kZXggKyAxKSAlIHRoaXMub3B0aW9ucy5sZW5ndGg7XG4gICAgdGhpcy5zZXQodGhpcy5vcHRpb25zW3RoaXMuaW5kZXhdKTtcbiAgfVxuXG4gIGRlY3IoKSB7XG4gICAgdGhpcy5pbmRleCA9ICh0aGlzLmluZGV4ICsgdGhpcy5vcHRpb25zLmxlbmd0aCAtIDEpICUgdGhpcy5vcHRpb25zLmxlbmd0aDtcbiAgICB0aGlzLnNldCh0aGlzLm9wdGlvbnNbdGhpcy5pbmRleF0pO1xuICB9XG59XG5cbmNsYXNzIENvbnRyb2xJbmZvIGV4dGVuZHMgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoaW5pdCwgdmlldyA9IG51bGwpIHtcbiAgICBzdXBlcignaW5mbycsIGluaXQubmFtZSwgaW5pdC5sYWJlbCk7XG4gICAgdGhpcy5ib3ggPSBudWxsO1xuXG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIGxldCBib3ggPSB0aGlzLmJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGJveC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5uYW1lICsgJy1ib3gnKTtcblxuICAgICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGFiZWwuaW5uZXJIVE1MID0gdGhpcy5sYWJlbCArICc6ICc7XG5cbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoYm94KTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcblxuICAgICAgdmlldy5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0KGluaXQudmFsdWUpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWw7XG5cbiAgICBpZiAodGhpcy5ib3gpXG4gICAgICB0aGlzLmJveC5pbm5lckhUTUwgPSB2YWw7XG4gIH1cbn1cblxuY2xhc3MgQ29udHJvbENvbW1hbmQgZXh0ZW5kcyBDb250cm9sRXZlbnQge1xuICBjb25zdHJ1Y3Rvcihpbml0LCB2aWV3ID0gbnVsbCkge1xuICAgIHN1cGVyKCdjb21tYW5kJywgaW5pdC5uYW1lLCBpbml0LmxhYmVsKTtcblxuICAgIGlmICh2aWV3KSB7XG4gICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctYnRuJyk7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnY29tbWFuZCcpO1xuICAgICAgZGl2LmlubmVySFRNTCA9IHRoaXMubGFiZWw7XG5cbiAgICAgIGRpdi5vbmNsaWNrID0gKCgpID0+IHtcbiAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICB9KTtcblxuICAgICAgdmlldy5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgdmlldy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUge0BsaW5rIENsaWVudENvbnRyb2x9IG1vZHVsZSB0YWtlcyBjYXJlIG9mIHRoZSBnbG9iYWwgYHBhcmFtZXRlcnNgLCBgaW5mb3NgLCBhbmQgYGNvbW1hbmRzYCBvbiB0aGUgY2xpZW50IHNpZGUuXG4gKiBJZiB0aGUgbW9kdWxlIGlzIGluc3RhbnRpYXRlZCB3aXRoIHRoZSBgZ3VpYCBvcHRpb24gc2V0IHRvIGB0cnVlYCwgaXQgY29uc3RydWN0cyB0aGUgZ3JhcGhpY2FsIGNvbnRyb2wgaW50ZXJmYWNlLlxuICogT3RoZXJ3aXNlIGl0IHNpbXBseSByZWNlaXZlcyB0aGUgdmFsdWVzIHRoYXQgYXJlIGVtaXR0ZWQgYnkgdGhlIHNlcnZlciAodXN1YWxseSBieSB0aHJvdWdoIHRoZSBgcGVyZm9ybWFuY2VgIG1vZHVsZSkuXG4gKlxuICogVGhlIHtAbGluayBDbGllbnRDb250cm9sfSBjYWxscyBpdHMgYGRvbmVgIG1ldGhvZDpcbiAqIC0gSW1tZWRpYXRlbHkgYWZ0ZXIgaGF2aW5nIHNldCB1cCB0aGUgY29udHJvbHMgaWYgdGhlIEdVSSBpcyBkaXNhYmxlZDtcbiAqIC0gTmV2ZXIgaWYgdGhlIEdVSSBpcyBlbmFibGVkLlxuICovXG5jbGFzcyBDbGllbnRDb250cm9sIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbi8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudENvbnRyb2wgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3N5bmMnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZ3VpPXRydWVdIEluZGljYXRlcyB3aGV0aGVyIHRvIGNyZWF0ZSB0aGUgZ3JhcGhpY2FsIHVzZXIgaW50ZXJmYWNlIHRvIGNvbnRyb2wgdGhlIHBhcmFtZXRlcnMgb3Igbm90LlxuICAgKiBAZW1pdHMgeydjb250cm9sOmV2ZW50J30gd2hlbiB0aGUgc2VydmVyIHNlbmRzIGFuIHVwZGF0ZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY29udHJvbCcsIChvcHRpb25zLmd1aSA9PT0gdHJ1ZSksIG9wdGlvbnMuY29sb3IpO1xuXG4gICAgLyoqXG4gICAgICogRGljdGlvbmFyeSBvZiBhbGwgdGhlIHBhcmFtZXRlcnMgYW5kIGNvbW1hbmRzLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcblxuICAgIGxldCB2aWV3ID0gaGFzR3VpID8gdGhpcy52aWV3IDogbnVsbDtcblxuICAgIGNsaWVudC5yZWNlaXZlKCdjb250cm9sOmluaXQnLCAoZXZlbnRzKSA9PiB7XG4gICAgICBpZiAodmlldykge1xuICAgICAgICBsZXQgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuICAgICAgICB0aXRsZS5pbm5lckhUTUwgPSAnQ29uZHVjdG9yJztcbiAgICAgICAgdmlldy5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhldmVudHMpKSB7XG4gICAgICAgIGxldCBldmVudCA9IGV2ZW50c1trZXldO1xuXG4gICAgICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xuICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldID0gbmV3IENvbnRyb2xOdW1iZXIoZXZlbnQsIHZpZXcpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICAgICAgdGhpcy5ldmVudHNba2V5XSA9IG5ldyBDb250cm9sU2VsZWN0KGV2ZW50LCB2aWV3KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnaW5mbyc6XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldID0gbmV3IENvbnRyb2xJbmZvKGV2ZW50LCB2aWV3KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnY29tbWFuZCc6XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldID0gbmV3IENvbnRyb2xDb21tYW5kKGV2ZW50LCB2aWV3KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghdmlldylcbiAgICAgICAgdGhpcy5kb25lKCk7XG4gICAgfSk7XG5cbiAgICAvLyBsaXN0ZW4gdG8gZXZlbnRzXG4gICAgY2xpZW50LnJlY2VpdmUoJ2NvbnRyb2w6ZXZlbnQnLCAobmFtZSwgdmFsKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnNldCh2YWwpO1xuICAgICAgICB0aGlzLmVtaXQoJ2NvbnRyb2w6ZXZlbnQnLCBuYW1lLCB2YWwpO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZygnY2xpZW50IGNvbnRyb2w6IHJlY2VpdmVkIHVua25vd24gZXZlbnQgXCInICsgbmFtZSArICdcIicpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlIGFuZCByZXF1ZXN0cyB0aGUgcGFyYW1ldGVycyB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICBjbGllbnQuc2VuZCgnY29udHJvbDpyZXF1ZXN0Jyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZSBhbmQgcmVxdWVzdHMgdGhlIHBhcmFtZXRlcnMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIGNsaWVudC5zZW5kKCdjb250cm9sOnJlcXVlc3QnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIHZhbHVlIG9yIGNvbW1hbmQgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyIG9yIGNvbW1hbmQgdG8gc2VuZC5cbiAgICogQHRvZG8gaXMgdGhpcyBtZXRob2QgdXNlZnVsP1xuICAgKi9cbiAgc2VuZChuYW1lKSB7XG4gICAgY29uc3QgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQuc2VuZCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB2YWx1ZSBvZiBhIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHsoU3RyaW5nfE51bWJlcnxCb29sZWFuKX0gdmFsIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbCkge1xuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudHNbbmFtZV07XG5cbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnNldCh2YWwpO1xuICAgICAgZXZlbnQuc2VuZCgpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENsaWVudENvbnRyb2w7XG4iXX0=