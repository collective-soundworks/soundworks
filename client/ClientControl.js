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

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

// @todo refactor

/**
 * @private
 */

var ControlEvent = (function () {
  function ControlEvent(type, parent, name, label) {
    _classCallCheck(this, ControlEvent);

    this.type = type;
    this.name = name;
    this.label = label;
    this.parent = parent;
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
      this.parent.send('event', this.name, this.value);
    }
  }]);

  return ControlEvent;
})();

var ControlNumber = (function (_ControlEvent) {
  _inherits(ControlNumber, _ControlEvent);

  function ControlNumber(parent, init) {
    var _this = this;

    var view = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, ControlNumber);

    _get(Object.getPrototypeOf(ControlNumber.prototype), 'constructor', this).call(this, 'number', parent, init.name, init.label);
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

  function ControlSelect(parent, init) {
    var _this2 = this;

    var view = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, ControlSelect);

    _get(Object.getPrototypeOf(ControlSelect.prototype), 'constructor', this).call(this, 'select', parent, init.name, init.label);
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

  function ControlInfo(parent, init) {
    var view = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, ControlInfo);

    _get(Object.getPrototypeOf(ControlInfo.prototype), 'constructor', this).call(this, 'info', parent, init.name, init.label);
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

  function ControlCommand(parent, init) {
    var _this3 = this;

    var view = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, ControlCommand);

    _get(Object.getPrototypeOf(ControlCommand.prototype), 'constructor', this).call(this, 'command', parent, init.name, init.label);

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
   * (See also {@link src/server/ServerControl.js~ServerControl} on the server side.)
   *
   * @example // Example 1: make a client that displays the control GUI
   *
   * import { client, ClientControl } from 'soundworks/client';
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

var ClientControl = (function (_Module) {
  _inherits(ClientControl, _Module);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='sync'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {Boolean} [options.gui=true] Indicates whether to create the graphical user interface to control the parameters or not.
   * @emits {'control:event'} when the server sends an update.
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
   * Starts the module and requests the parameters to the server.
   */

  _createClass(ClientControl, [{
    key: 'start',
    value: function start() {
      var _this4 = this;

      _get(Object.getPrototypeOf(ClientControl.prototype), 'start', this).call(this);

      var view = this._ownsView ? this.view : null;

      this.receive('init', function (events) {
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
                _this4.events[key] = new ControlNumber(_this4, _event, view);
                break;

              case 'select':
                _this4.events[key] = new ControlSelect(_this4, _event, view);
                break;

              case 'info':
                _this4.events[key] = new ControlInfo(_this4, _event, view);
                break;

              case 'command':
                _this4.events[key] = new ControlCommand(_this4, _event, view);
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
      this.receive('event', function (name, val) {
        console.log(name, val);
        var event = _this4.events[name];

        if (event) {
          event.set(val);
          _this4.emit(_this4.name + ':event', name, val);
        } else console.log('client control: received unknown event "' + name + '"');
      });

      _get(Object.getPrototypeOf(ClientControl.prototype), 'send', this).call(this, 'request');
    }

    /**
     * Restarts the module and requests the parameters to the server.
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(ClientControl.prototype), 'restart', this).call(this);
      _get(Object.getPrototypeOf(ClientControl.prototype), 'send', this).call(this, 'request');
    }

    /**
     * Sends a value or command to the server.
     * @param {String} name Name of the parameter or command to send.
     * @todo is this method useful?
     */
    // send(name) {
    //   const event = this.events[name];

    //   if (event) {
    //     event.send();
    //   }
    // }

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
})(_Module3['default']);

exports['default'] = ClientControl;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBbUIsVUFBVTs7Ozs7Ozs7OztJQU92QixZQUFZO0FBQ0wsV0FEUCxZQUFZLENBQ0osSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFOzBCQURuQyxZQUFZOztBQUVkLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO0dBQ3hCOzs7Ozs7ZUFQRyxZQUFZOztXQVNiLGFBQUMsR0FBRyxFQUFFLEVBRVI7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2xEOzs7U0FmRyxZQUFZOzs7SUFxQlosYUFBYTtZQUFiLGFBQWE7O0FBQ04sV0FEUCxhQUFhLENBQ0wsTUFBTSxFQUFFLElBQUksRUFBZTs7O1FBQWIsSUFBSSx5REFBRyxJQUFJOzswQkFEakMsYUFBYTs7QUFFZiwrQkFGRSxhQUFhLDZDQUVULFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQy9DLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNwQixRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDcEIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFB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O0FBRTlCLFlBQUksS0FBSyxFQUFFO0FBQ1QsZUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNmLGlCQUFLLElBQUksQ0FBSSxPQUFLLElBQUksYUFBVSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDNUMsTUFFQyxPQUFPLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztPQUN4RSxDQUFDLENBQUM7O0FBRUgsaUNBeEVpQixhQUFhLHNDQXdFbkIsU0FBUyxFQUFFO0tBQ3ZCOzs7Ozs7O1dBS00sbUJBQUc7QUFDUixpQ0EvRWlCLGFBQWEseUNBK0VkO0FBQ2hCLGlDQWhGaUIsYUFBYSxzQ0FnRm5CLFNBQVMsRUFBRTtLQUN2Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQW9CSyxnQkFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0FBQ2hCLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWhDLFVBQUksS0FBSyxFQUFFO0FBQ1QsYUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNmLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNkO0tBQ0Y7OztTQTVHa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRDb250cm9sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cbi8vIEB0b2RvIHJlZmFjdG9yXG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IodHlwZSwgcGFyZW50LCBuYW1lLCBsYWJlbCkge1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHNldCh2YWwpIHtcblxuICB9XG5cbiAgc2VuZCgpIHtcbiAgICB0aGlzLnBhcmVudC5zZW5kKCdldmVudCcsIHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBDb250cm9sTnVtYmVyIGV4dGVuZHMgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBpbml0LCB2aWV3ID0gbnVsbCkge1xuICAgIHN1cGVyKCdudW1iZXInLCBwYXJlbnQsIGluaXQubmFtZSwgaW5pdC5sYWJlbCk7XG4gICAgdGhpcy5taW4gPSBpbml0Lm1pbjtcbiAgICB0aGlzLm1heCA9IGluaXQubWF4O1xuICAgIHRoaXMuc3RlcCA9IGluaXQuc3RlcDtcbiAgICB0aGlzLmJveCA9IG51bGw7XG5cbiAgICBpZiAodmlldykge1xuICAgICAgbGV0IGJveCA9IHRoaXMuYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgIGJveC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5uYW1lICsgJy1ib3gnKTtcbiAgICAgIGJveC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnbnVtYmVyJyk7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCdtaW4nLCB0aGlzLm1pbik7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCdtYXgnLCB0aGlzLm1heCk7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCdzdGVwJywgdGhpcy5zdGVwKTtcbiAgICAgIGJveC5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAxNik7XG5cbiAgICAgIGJveC5vbmNoYW5nZSA9ICgoKSA9PiB7XG4gICAgICAgIGxldCB2YWwgPSBOdW1iZXIoYm94LnZhbHVlKTtcbiAgICAgICAgdGhpcy5zZXQodmFsKTtcbiAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGluY3JCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGluY3JCdXR0b24uc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctaW5jcicpO1xuICAgICAgaW5jckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzAuNWVtJyk7XG4gICAgICBpbmNyQnV0dG9uLmlubmVySFRNTCA9ICc+JztcbiAgICAgIGluY3JCdXR0b24ub25jbGljayA9ICgoKSA9PiB7XG4gICAgICAgIHRoaXMuaW5jcigpO1xuICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgZGVjckJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgZGVjckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5uYW1lICsgJy1kZXNjcicpO1xuICAgICAgZGVjckJ1dHRvbi5zdHlsZS53aWR0aCA9ICcwLjVlbSc7XG4gICAgICBkZWNyQnV0dG9uLmlubmVySFRNTCA9ICc8JztcbiAgICAgIGRlY3JCdXR0b24ub25jbGljayA9ICgoKSA9PiB7XG4gICAgICAgIHRoaXMuZGVjcigpO1xuICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBsYWJlbC5pbm5lckhUTUwgPSB0aGlzLmxhYmVsICsgJzogJztcblxuICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChkZWNyQnV0dG9uKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChib3gpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGluY3JCdXR0b24pO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuXG4gICAgICB2aWV3LmFwcGVuZENoaWxkKGRpdik7XG4gICAgfVxuXG4gICAgdGhpcy5zZXQoaW5pdC52YWx1ZSk7XG4gIH1cblxuICBzZXQodmFsLCBzZW5kID0gZmFsc2UpIHtcbiAgICB0aGlzLnZhbHVlID0gTWF0aC5taW4odGhpcy5tYXgsIE1hdGgubWF4KHRoaXMubWluLCB2YWwpKTtcblxuICAgIGlmICh0aGlzLmJveClcbiAgICAgIHRoaXMuYm94LnZhbHVlID0gdmFsO1xuICB9XG5cbiAgaW5jcigpIHtcbiAgICBsZXQgc3RlcHMgPSBNYXRoLmZsb29yKHRoaXMudmFsdWUgLyB0aGlzLnN0ZXAgKyAwLjUpO1xuICAgIHRoaXMuc2V0KHRoaXMuc3RlcCAqIChzdGVwcyArIDEpKTtcbiAgfVxuXG4gIGRlY3IoKSB7XG4gICAgbGV0IHN0ZXBzID0gTWF0aC5mbG9vcih0aGlzLnZhbHVlIC8gdGhpcy5zdGVwICsgMC41KTtcbiAgICB0aGlzLnNldCh0aGlzLnN0ZXAgKiAoc3RlcHMgLSAxKSk7XG4gIH1cbn1cblxuY2xhc3MgQ29udHJvbFNlbGVjdCBleHRlbmRzIENvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgaW5pdCwgdmlldyA9IG51bGwpIHtcbiAgICBzdXBlcignc2VsZWN0JywgcGFyZW50LCBpbml0Lm5hbWUsIGluaXQubGFiZWwpO1xuICAgIHRoaXMub3B0aW9ucyA9IGluaXQub3B0aW9ucztcbiAgICB0aGlzLmJveCA9IG51bGw7XG5cbiAgICBpZiAodmlldykge1xuICAgICAgbGV0IGJveCA9IHRoaXMuYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctYm94Jyk7XG5cbiAgICAgIGZvciAobGV0IG9wdGlvbiBvZiB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgbGV0IG9wdEVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgICAgICBvcHRFbGVtLnZhbHVlID0gb3B0aW9uO1xuICAgICAgICBvcHRFbGVtLnRleHQgPSBvcHRpb247XG4gICAgICAgIGJveC5hcHBlbmRDaGlsZChvcHRFbGVtKTtcbiAgICAgIH1cblxuICAgICAgYm94Lm9uY2hhbmdlID0gKCgpID0+IHtcbiAgICAgICAgdGhpcy5zZXQoYm94LnZhbHVlKTtcbiAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGluY3JCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGluY3JCdXR0b24uc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctaW5jcicpO1xuICAgICAgaW5jckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzAuNWVtJyk7XG4gICAgICBpbmNyQnV0dG9uLmlubmVySFRNTCA9ICc+JztcbiAgICAgIGluY3JCdXR0b24ub25jbGljayA9ICgoKSA9PiB7XG4gICAgICAgIHRoaXMuaW5jcigpO1xuICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgZGVjckJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgZGVjckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5uYW1lICsgJy1kZXNjcicpO1xuICAgICAgZGVjckJ1dHRvbi5zdHlsZS53aWR0aCA9ICcwLjVlbSc7XG4gICAgICBkZWNyQnV0dG9uLmlubmVySFRNTCA9ICc8JztcbiAgICAgIGRlY3JCdXR0b24ub25jbGljayA9ICgoKSA9PiB7XG4gICAgICAgIHRoaXMuZGVjcigpO1xuICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBsYWJlbC5pbm5lckhUTUwgPSB0aGlzLmxhYmVsICsgJzogJztcblxuICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChkZWNyQnV0dG9uKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChib3gpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGluY3JCdXR0b24pO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuXG4gICAgICB2aWV3LmFwcGVuZENoaWxkKGRpdik7XG4gICAgfVxuXG4gICAgdGhpcy5zZXQoaW5pdC52YWx1ZSk7XG4gIH1cblxuICBzZXQodmFsLCBzZW5kID0gZmFsc2UpIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLm9wdGlvbnMuaW5kZXhPZih2YWwpO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG5cbiAgICAgIGlmICh0aGlzLmJveClcbiAgICAgICAgdGhpcy5ib3gudmFsdWUgPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgaW5jcigpIHtcbiAgICB0aGlzLmluZGV4ID0gKHRoaXMuaW5kZXggKyAxKSAlIHRoaXMub3B0aW9ucy5sZW5ndGg7XG4gICAgdGhpcy5zZXQodGhpcy5vcHRpb25zW3RoaXMuaW5kZXhdKTtcbiAgfVxuXG4gIGRlY3IoKSB7XG4gICAgdGhpcy5pbmRleCA9ICh0aGlzLmluZGV4ICsgdGhpcy5vcHRpb25zLmxlbmd0aCAtIDEpICUgdGhpcy5vcHRpb25zLmxlbmd0aDtcbiAgICB0aGlzLnNldCh0aGlzLm9wdGlvbnNbdGhpcy5pbmRleF0pO1xuICB9XG59XG5cbmNsYXNzIENvbnRyb2xJbmZvIGV4dGVuZHMgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBpbml0LCB2aWV3ID0gbnVsbCkge1xuICAgIHN1cGVyKCdpbmZvJywgcGFyZW50LCBpbml0Lm5hbWUsIGluaXQubGFiZWwpO1xuICAgIHRoaXMuYm94ID0gbnVsbDtcblxuICAgIGlmICh2aWV3KSB7XG4gICAgICBsZXQgYm94ID0gdGhpcy5ib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBib3guc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMubmFtZSArICctYm94Jyk7XG5cbiAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGxhYmVsLmlubmVySFRNTCA9IHRoaXMubGFiZWwgKyAnOiAnO1xuXG4gICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGJveCk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG5cbiAgICAgIHZpZXcuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldChpbml0LnZhbHVlKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsO1xuXG4gICAgaWYgKHRoaXMuYm94KVxuICAgICAgdGhpcy5ib3guaW5uZXJIVE1MID0gdmFsO1xuICB9XG59XG5cbmNsYXNzIENvbnRyb2xDb21tYW5kIGV4dGVuZHMgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBpbml0LCB2aWV3ID0gbnVsbCkge1xuICAgIHN1cGVyKCdjb21tYW5kJywgcGFyZW50LCBpbml0Lm5hbWUsIGluaXQubGFiZWwpO1xuXG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5uYW1lICsgJy1idG4nKTtcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdjb21tYW5kJyk7XG4gICAgICBkaXYuaW5uZXJIVE1MID0gdGhpcy5sYWJlbDtcblxuICAgICAgZGl2Lm9uY2xpY2sgPSAoKCkgPT4ge1xuICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgIH0pO1xuXG4gICAgICB2aWV3LmFwcGVuZENoaWxkKGRpdik7XG4gICAgICB2aWV3LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFtjbGllbnRdIE1hbmFnZSB0aGUgZ2xvYmFsIGBwYXJhbWV0ZXJzYCwgYGluZm9zYCwgYW5kIGBjb21tYW5kc2AgYWNyb3NzIHRoZSB3aG9sZSBzY2VuYXJpby5cbiAqXG4gKiBJZiB0aGUgbW9kdWxlIGlzIGluc3RhbnRpYXRlZCB3aXRoIHRoZSBgZ3VpYCBvcHRpb24gc2V0IHRvIGB0cnVlYCwgaXQgY29uc3RydWN0cyBhIGdyYXBoaWNhbCBpbnRlcmZhY2UgdG8gbW9kaWZ5IHRoZSBwYXJhbWV0ZXJzLCB2aWV3IHRoZSBpbmZvcywgYW5kIHRyaWdnZXIgdGhlIGNvbW1hbmRzLlxuICogT3RoZXJ3aXNlIChgZ3VpYCBvcHRpb24gc2V0IHRvIGBmYWxzZWApIHRoZSBtb2R1bGUgcmVjZWl2ZXMgdGhlIHZhbHVlcyBlbWl0dGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gKiBUaGUgbW9kdWxlIGZvcndhcmRzIHRoZSBzZXJ2ZXIgdmFsdWVzIGJ5IGVtaXR0aW5nIHRoZW0uXG4gKlxuICogV2hlbiB0aGUgR1VJIGlzIGRpc2FibGVkLCB0aGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBpbW1lZGlhdGVseSBhZnRlciBoYXZpbmcgc2V0IHVwIHRoZSBjb250cm9scy5cbiAqIE90aGVyd2lzZSAoR1VJIGVuYWJsZWQpLCB0aGUgbW9kdWxlcyByZW1haW5zIGluIGl0cyBzdGF0ZS5cbiAqXG4gKiBXaGVuIHRoZSBtb2R1bGUgYSB2aWV3IChgZ3VpYCBvcHRpb24gc2V0IHRvIGB0cnVlYCksIGl0IHJlcXVpcmVzIHRoZSBTQVNTIHBhcnRpYWwgYF83Ny1jaGVja2luLnNjc3NgLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJDb250cm9sLmpzflNlcnZlckNvbnRyb2x9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGUgLy8gRXhhbXBsZSAxOiBtYWtlIGEgY2xpZW50IHRoYXQgZGlzcGxheXMgdGhlIGNvbnRyb2wgR1VJXG4gKlxuICogaW1wb3J0IHsgY2xpZW50LCBDbGllbnRDb250cm9sIH0gZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuICogY29uc3QgY29udHJvbCA9IG5ldyBDbGllbnRDb250cm9sKCk7XG4gKlxuICogLy8gSW5pdGlhbGl6ZSB0aGUgY2xpZW50IChpbmRpY2F0ZSB0aGUgY2xpZW50IHR5cGUpXG4gKiBjbGllbnQuaW5pdCgnY29uZHVjdG9yJyk7IC8vIGFjY2Vzc2libGUgYXQgdGhlIFVSTCAvY29uZHVjdG9yXG4gKlxuICogLy8gU3RhcnQgdGhlIHNjZW5hcmlvXG4gKiAvLyBGb3IgdGhpcyBjbGllbnQgdHlwZSAoYCdjb25kdWN0b3InYCksIHRoZXJlIGlzIG9ubHkgb25lIG1vZHVsZVxuICogY2xpZW50LnN0YXJ0KGNvbnRyb2wpO1xuICpcbiAqIEBleGFtcGxlIC8vIEV4YW1wbGUgMjogbGlzdGVuIGZvciBwYXJhbWV0ZXIsIGluZm9zICYgY29tbWFuZHMgdXBkYXRlc1xuICogY29uc3QgY29udHJvbCA9IG5ldyBDbGllbnRDb250cm9sKHsgZ3VpOiBmYWxzZSB9KTtcbiAqXG4gKiAvLyBMaXN0ZW4gZm9yIHBhcmFtZXRlciwgaW5mb3Mgb3IgY29tbWFuZCB1cGRhdGVzXG4gKiBjb250cm9sLm9uKCdjb250cm9sOmV2ZW50JywgKG5hbWUsIHZhbHVlKSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKGBUaGUgcGFyYW1ldGVyICN7bmFtZX0gaGFzIGJlZW4gdXBkYXRlZCB0byB2YWx1ZSAje3ZhbHVlfWApO1xuICogfSk7XG4gKlxuICogLy8gR2V0IGN1cnJlbnQgdmFsdWUgb2YgYSBwYXJhbWV0ZXIgb3IgaW5mb1xuICogY29uc3QgY3VycmVudFBhcmFtVmFsdWUgPSBjb250cm9sLmV2ZW50WydwYXJhbWV0ZXJOYW1lJ10udmFsdWU7XG4gKiBjb25zdCBjdXJyZW50SW5mb1ZhbHVlID0gY29udHJvbC5ldmVudFsnaW5mb05hbWUnXS52YWx1ZTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50Q29udHJvbCBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdzeW5jJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmd1aT10cnVlXSBJbmRpY2F0ZXMgd2hldGhlciB0byBjcmVhdGUgdGhlIGdyYXBoaWNhbCB1c2VyIGludGVyZmFjZSB0byBjb250cm9sIHRoZSBwYXJhbWV0ZXJzIG9yIG5vdC5cbiAgICogQGVtaXRzIHsnY29udHJvbDpldmVudCd9IHdoZW4gdGhlIHNlcnZlciBzZW5kcyBhbiB1cGRhdGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2NvbnRyb2wnLCAob3B0aW9ucy5ndWkgPT09IHRydWUpLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIC8qKlxuICAgICAqIERpY3Rpb25hcnkgb2YgYWxsIHRoZSBwYXJhbWV0ZXJzIGFuZCBjb21tYW5kcy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnRzID0ge307XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBtb2R1bGUgYW5kIHJlcXVlc3RzIHRoZSBwYXJhbWV0ZXJzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgbGV0IHZpZXcgPSB0aGlzLl9vd25zVmlldyA/IHRoaXMudmlldyA6IG51bGw7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ2luaXQnLCAoZXZlbnRzKSA9PiB7XG4gICAgICBpZiAodmlldykge1xuICAgICAgICBsZXQgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuICAgICAgICB0aXRsZS5pbm5lckhUTUwgPSAnQ29uZHVjdG9yJztcbiAgICAgICAgdmlldy5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhldmVudHMpKSB7XG4gICAgICAgIGxldCBldmVudCA9IGV2ZW50c1trZXldO1xuXG4gICAgICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xuICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldID0gbmV3IENvbnRyb2xOdW1iZXIodGhpcywgZXZlbnQsIHZpZXcpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICAgICAgdGhpcy5ldmVudHNba2V5XSA9IG5ldyBDb250cm9sU2VsZWN0KHRoaXMsIGV2ZW50LCB2aWV3KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnaW5mbyc6XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldID0gbmV3IENvbnRyb2xJbmZvKHRoaXMsIGV2ZW50LCB2aWV3KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnY29tbWFuZCc6XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldID0gbmV3IENvbnRyb2xDb21tYW5kKHRoaXMsIGV2ZW50LCB2aWV3KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghdmlldylcbiAgICAgICAgdGhpcy5kb25lKCk7XG4gICAgfSk7XG5cbiAgICAvLyBsaXN0ZW4gdG8gZXZlbnRzXG4gICAgdGhpcy5yZWNlaXZlKCdldmVudCcsIChuYW1lLCB2YWwpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKG5hbWUsIHZhbCk7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnNldCh2YWwpO1xuICAgICAgICB0aGlzLmVtaXQoYCR7dGhpcy5uYW1lfTpldmVudGAsIG5hbWUsIHZhbCk7XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUubG9nKCdjbGllbnQgY29udHJvbDogcmVjZWl2ZWQgdW5rbm93biBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfSk7XG5cbiAgICBzdXBlci5zZW5kKCdyZXF1ZXN0Jyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZSBhbmQgcmVxdWVzdHMgdGhlIHBhcmFtZXRlcnMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHN1cGVyLnNlbmQoJ3JlcXVlc3QnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIHZhbHVlIG9yIGNvbW1hbmQgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyIG9yIGNvbW1hbmQgdG8gc2VuZC5cbiAgICogQHRvZG8gaXMgdGhpcyBtZXRob2QgdXNlZnVsP1xuICAgKi9cbiAgLy8gc2VuZChuYW1lKSB7XG4gIC8vICAgY29uc3QgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAvLyAgIGlmIChldmVudCkge1xuICAvLyAgICAgZXZlbnQuc2VuZCgpO1xuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB2YWx1ZSBvZiBhIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHsoU3RyaW5nfE51bWJlcnxCb29sZWFuKX0gdmFsIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbCkge1xuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudHNbbmFtZV07XG5cbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnNldCh2YWwpO1xuICAgICAgZXZlbnQuc2VuZCgpO1xuICAgIH1cbiAgfVxufVxuIl19