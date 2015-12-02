// import server from './server';
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

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

/**
 * The `Control` module is used to control an application through a dedicated client (that we usually call `conductor`).
 * The module allows for declaring `parameters`, `infos`, and `commands`, through which the `conductor` can control and monitor the state of the application:
 * - `parameters` are values that are changed by a client, sent to the server, and propagated to the other connected clients (*e.g.* the tempo of a musical application);
 * - `infos` are values that are changed by the server and propagated to the connected clients, to inform about the current state of the application (*e.g.* the number of connected `player` clients);
 * - `commands` are messages (without arguments) that are send from the client to the server (*e.g.* `start`, `stop` or `clear` — whatever they would mean for a given application) which does the necessary upon reception.
 *
 * Optionally, the {@link ClientControl} module can automatically construct a simple interface from the list of declared controls that allows to change `parameters`, display `infos`, and send `commands` to the server.
 *
 * The controls of different types are declared on the server side and propagated to the client side when a client is set up.
 *
 * The {@link Control} takes care of the parameters and commands on the server side.
 * To set up controls in a scenario, you should extend this class on the server side and declare the controls specific to that scenario with the appropriate methods.
 * @example
 * class Control extends Control {
 *   constructor(nameArray) {
 *     super();
 *
 *     // Info corresponding to the number of players
 *     this.addInfo('numPlayers', 'Number of players', 0);
 *     // Number parameter corresponding to the output gain of the players
 *     this.addNumber('gain', 'Global gain', 0, 1, 0.1, 1);
 *     // Select parameter corresponding to the state of the performance
 *     this.addSelect('state', 'State', ['idle', 'playing'], 'idle');
 *     // Command to reload the page on all the clients
 *     this.addCommand('reload', 'Reload the page of all the clients');
 *   }
 * }
 *
 * const control = new Control(guiroNames, soundfieldNames);
 */

var Control = (function (_Module) {
  _inherits(Control, _Module);

  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='control'] Name of the module.
   */

  function Control() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Control);

    _get(Object.getPrototypeOf(Control.prototype), 'constructor', this).call(this, options.name || 'control');

    /**
     * Dictionary of all the events.
     * @type {Object}
     */
    this.events = {};

    this._clientTypes = [];
  }

  /**
   * Adds a number parameter.
   * @param {String} name Name of the parameter.
   * @param {String} label Label of the parameter (displayed on the control GUI on the client side).
   * @param {Number} min Minimum value of the parameter.
   * @param {Number} max Maximum value of the parameter.
   * @param {Number} step Step to increase or decrease the parameter value.
   * @param {Number} init Initial value of the parameter.
   * @param {String[]} [clientTypes=null] Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
   */

  _createClass(Control, [{
    key: 'addNumber',
    value: function addNumber(name, label, min, max, step, init) {
      var clientTypes = arguments.length <= 6 || arguments[6] === undefined ? null : arguments[6];

      this.events[name] = {
        type: 'number',
        name: name,
        label: label,
        min: min,
        max: max,
        step: step,
        value: init,
        clientTypes: clientTypes
      };
    }

    /**
     * Adds a select parameter.
     * @param {String} name Name of the parameter.
     * @param {String} label Label of the parameter (displayed on the control GUI on the client side).
     * @param {String[]} options Array of the different values the parameter can take.
     * @param {Number} init Initial value of the parameter (has to be in the `options` array).
     * @param {String[]} [clientTypes=null] Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addSelect',
    value: function addSelect(name, label, options, init) {
      var clientTypes = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

      this.events[name] = {
        type: 'select',
        name: name,
        label: label,
        options: options,
        value: init,
        clientTypes: clientTypes
      };
    }

    /**
     * Adds an info parameter.
     * @param {String} name Name of the parameter.
     * @param {String} label Label of the parameter (displayed on the control GUI on the client side).
     * @param {Number} init Initial value of the parameter (has to be in the `options` array).
     * @param {String[]} [clientTypes=null] Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addInfo',
    value: function addInfo(name, label, init) {
      var clientTypes = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      this.events[name] = {
        type: 'info',
        name: name,
        label: label,
        value: init,
        clientTypes: clientTypes
      };
    }

    /**
     * Adds a command.
     * @param {String} name Name of the command.
     * @param {String} label Label of the command (displayed on the control GUI on the client side).
     * @param {String[]} [clientTypes=null] Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addCommand',
    value: function addCommand(name, label) {
      var clientTypes = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      this.events[name] = {
        type: 'command',
        name: name,
        label: label,
        value: undefined,
        clientTypes: clientTypes
      };
    }
  }, {
    key: '_broadcastEvent',
    value: function _broadcastEvent(event) {
      var clientTypes = event.clientTypes || this._clientTypes;

      // propagate parameter to clients
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(clientTypes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var clientType = _step.value;

          this.broadcast(clientType, 'event', event.name, event.value);
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

      this.emit(this.name + ':event', event.name, event.value);
    }

    /**
     * Sends an event to the clients.
     * @param {String} name Name of the event to send.
     * @emits 'control:event'
     */
  }, {
    key: 'send',
    value: function send(name) {
      console.dir(name);
      var event = this.events[name];

      if (event) {
        this._broadcastEvent(event);
      } else {
        console.log('server control: send unknown event "' + name + '"');
      }
    }

    /**
     * Updates the value of a parameter and sends it to the clients.
     * @param {String} name Name of the parameter to update.
     * @param {(String|Number|Boolean)} value New value of the parameter.
     */
  }, {
    key: 'update',
    value: function update(name, value) {
      var event = this.events[name];

      if (event) {
        event.value = value;
        this._broadcastEvent(event);
      } else {
        console.log('server control: update unknown event "' + name + '"');
      }
    }

    /**
     * @private
     */
  }, {
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(Control.prototype), 'connect', this).call(this, client);

      var clientType = client.type;

      if (this._clientTypes.indexOf(clientType) < 0) this._clientTypes.push(clientType);

      // init control parameters, infos, and commands at client
      this.receive(client, 'request', function () {
        _get(Object.getPrototypeOf(Control.prototype), 'send', _this).call(_this, client, 'init', _this.events);
      });

      // listen to control parameters
      this.receive(client, 'event', function (name, value) {
        console.log(name, value);
        _this.update(name, value);
      });
    }
  }]);

  return Control;
})(_Module3['default']);

exports['default'] = Control;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvQ29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VCQUNtQixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFrQ1IsT0FBTztZQUFQLE9BQU87Ozs7Ozs7O0FBTWYsV0FOUSxPQUFPLEdBTUE7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQU5MLE9BQU87O0FBT3hCLCtCQVBpQixPQUFPLDZDQU9sQixPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRTs7Ozs7O0FBTWpDLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDOztBQUVqQixRQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztHQUN4Qjs7Ozs7Ozs7Ozs7OztlQWhCa0IsT0FBTzs7V0E0QmpCLG1CQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFzQjtVQUFwQixXQUFXLHlEQUFHLElBQUk7O0FBQzdELFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUc7QUFDbEIsWUFBSSxFQUFFLFFBQVE7QUFDZCxZQUFJLEVBQUUsSUFBSTtBQUNWLGFBQUssRUFBRSxLQUFLO0FBQ1osV0FBRyxFQUFFLEdBQUc7QUFDUixXQUFHLEVBQUUsR0FBRztBQUNSLFlBQUksRUFBRSxJQUFJO0FBQ1YsYUFBSyxFQUFFLElBQUk7QUFDWCxtQkFBVyxFQUFFLFdBQVc7T0FDekIsQ0FBQztLQUNIOzs7Ozs7Ozs7Ozs7V0FVUSxtQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQXNCO1VBQXBCLFdBQVcseURBQUcsSUFBSTs7QUFDdEQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRztBQUNsQixZQUFJLEVBQUUsUUFBUTtBQUNkLFlBQUksRUFBRSxJQUFJO0FBQ1YsYUFBSyxFQUFFLEtBQUs7QUFDWixlQUFPLEVB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SUFBSSxFQUFFLEtBQUssRUFBSztBQUM3QyxlQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN6QixjQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDMUIsQ0FBQyxDQUFDO0tBQ0o7OztTQTVKa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoic3JjL3NlcnZlci9Db250cm9sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG4vKipcbiAqIFRoZSBgQ29udHJvbGAgbW9kdWxlIGlzIHVzZWQgdG8gY29udHJvbCBhbiBhcHBsaWNhdGlvbiB0aHJvdWdoIGEgZGVkaWNhdGVkIGNsaWVudCAodGhhdCB3ZSB1c3VhbGx5IGNhbGwgYGNvbmR1Y3RvcmApLlxuICogVGhlIG1vZHVsZSBhbGxvd3MgZm9yIGRlY2xhcmluZyBgcGFyYW1ldGVyc2AsIGBpbmZvc2AsIGFuZCBgY29tbWFuZHNgLCB0aHJvdWdoIHdoaWNoIHRoZSBgY29uZHVjdG9yYCBjYW4gY29udHJvbCBhbmQgbW9uaXRvciB0aGUgc3RhdGUgb2YgdGhlIGFwcGxpY2F0aW9uOlxuICogLSBgcGFyYW1ldGVyc2AgYXJlIHZhbHVlcyB0aGF0IGFyZSBjaGFuZ2VkIGJ5IGEgY2xpZW50LCBzZW50IHRvIHRoZSBzZXJ2ZXIsIGFuZCBwcm9wYWdhdGVkIHRvIHRoZSBvdGhlciBjb25uZWN0ZWQgY2xpZW50cyAoKmUuZy4qIHRoZSB0ZW1wbyBvZiBhIG11c2ljYWwgYXBwbGljYXRpb24pO1xuICogLSBgaW5mb3NgIGFyZSB2YWx1ZXMgdGhhdCBhcmUgY2hhbmdlZCBieSB0aGUgc2VydmVyIGFuZCBwcm9wYWdhdGVkIHRvIHRoZSBjb25uZWN0ZWQgY2xpZW50cywgdG8gaW5mb3JtIGFib3V0IHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBhcHBsaWNhdGlvbiAoKmUuZy4qIHRoZSBudW1iZXIgb2YgY29ubmVjdGVkIGBwbGF5ZXJgIGNsaWVudHMpO1xuICogLSBgY29tbWFuZHNgIGFyZSBtZXNzYWdlcyAod2l0aG91dCBhcmd1bWVudHMpIHRoYXQgYXJlIHNlbmQgZnJvbSB0aGUgY2xpZW50IHRvIHRoZSBzZXJ2ZXIgKCplLmcuKiBgc3RhcnRgLCBgc3RvcGAgb3IgYGNsZWFyYCDigJQgd2hhdGV2ZXIgdGhleSB3b3VsZCBtZWFuIGZvciBhIGdpdmVuIGFwcGxpY2F0aW9uKSB3aGljaCBkb2VzIHRoZSBuZWNlc3NhcnkgdXBvbiByZWNlcHRpb24uXG4gKlxuICogT3B0aW9uYWxseSwgdGhlIHtAbGluayBDbGllbnRDb250cm9sfSBtb2R1bGUgY2FuIGF1dG9tYXRpY2FsbHkgY29uc3RydWN0IGEgc2ltcGxlIGludGVyZmFjZSBmcm9tIHRoZSBsaXN0IG9mIGRlY2xhcmVkIGNvbnRyb2xzIHRoYXQgYWxsb3dzIHRvIGNoYW5nZSBgcGFyYW1ldGVyc2AsIGRpc3BsYXkgYGluZm9zYCwgYW5kIHNlbmQgYGNvbW1hbmRzYCB0byB0aGUgc2VydmVyLlxuICpcbiAqIFRoZSBjb250cm9scyBvZiBkaWZmZXJlbnQgdHlwZXMgYXJlIGRlY2xhcmVkIG9uIHRoZSBzZXJ2ZXIgc2lkZSBhbmQgcHJvcGFnYXRlZCB0byB0aGUgY2xpZW50IHNpZGUgd2hlbiBhIGNsaWVudCBpcyBzZXQgdXAuXG4gKlxuICogVGhlIHtAbGluayBDb250cm9sfSB0YWtlcyBjYXJlIG9mIHRoZSBwYXJhbWV0ZXJzIGFuZCBjb21tYW5kcyBvbiB0aGUgc2VydmVyIHNpZGUuXG4gKiBUbyBzZXQgdXAgY29udHJvbHMgaW4gYSBzY2VuYXJpbywgeW91IHNob3VsZCBleHRlbmQgdGhpcyBjbGFzcyBvbiB0aGUgc2VydmVyIHNpZGUgYW5kIGRlY2xhcmUgdGhlIGNvbnRyb2xzIHNwZWNpZmljIHRvIHRoYXQgc2NlbmFyaW8gd2l0aCB0aGUgYXBwcm9wcmlhdGUgbWV0aG9kcy5cbiAqIEBleGFtcGxlXG4gKiBjbGFzcyBDb250cm9sIGV4dGVuZHMgQ29udHJvbCB7XG4gKiAgIGNvbnN0cnVjdG9yKG5hbWVBcnJheSkge1xuICogICAgIHN1cGVyKCk7XG4gKlxuICogICAgIC8vIEluZm8gY29ycmVzcG9uZGluZyB0byB0aGUgbnVtYmVyIG9mIHBsYXllcnNcbiAqICAgICB0aGlzLmFkZEluZm8oJ251bVBsYXllcnMnLCAnTnVtYmVyIG9mIHBsYXllcnMnLCAwKTtcbiAqICAgICAvLyBOdW1iZXIgcGFyYW1ldGVyIGNvcnJlc3BvbmRpbmcgdG8gdGhlIG91dHB1dCBnYWluIG9mIHRoZSBwbGF5ZXJzXG4gKiAgICAgdGhpcy5hZGROdW1iZXIoJ2dhaW4nLCAnR2xvYmFsIGdhaW4nLCAwLCAxLCAwLjEsIDEpO1xuICogICAgIC8vIFNlbGVjdCBwYXJhbWV0ZXIgY29ycmVzcG9uZGluZyB0byB0aGUgc3RhdGUgb2YgdGhlIHBlcmZvcm1hbmNlXG4gKiAgICAgdGhpcy5hZGRTZWxlY3QoJ3N0YXRlJywgJ1N0YXRlJywgWydpZGxlJywgJ3BsYXlpbmcnXSwgJ2lkbGUnKTtcbiAqICAgICAvLyBDb21tYW5kIHRvIHJlbG9hZCB0aGUgcGFnZSBvbiBhbGwgdGhlIGNsaWVudHNcbiAqICAgICB0aGlzLmFkZENvbW1hbmQoJ3JlbG9hZCcsICdSZWxvYWQgdGhlIHBhZ2Ugb2YgYWxsIHRoZSBjbGllbnRzJyk7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBjb25zdCBjb250cm9sID0gbmV3IENvbnRyb2woZ3Vpcm9OYW1lcywgc291bmRmaWVsZE5hbWVzKTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbCBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nY29udHJvbCddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY29udHJvbCcpO1xuXG4gICAgLyoqXG4gICAgICogRGljdGlvbmFyeSBvZiBhbGwgdGhlIGV2ZW50cy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnRzID0ge307XG5cbiAgICB0aGlzLl9jbGllbnRUeXBlcyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBudW1iZXIgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtaW4gTWluaW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbWF4IE1heGltdW0gdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0ZXAgU3RlcCB0byBpbmNyZWFzZSBvciBkZWNyZWFzZSB0aGUgcGFyYW1ldGVyIHZhbHVlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5pdCBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkTnVtYmVyKG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgdGhpcy5ldmVudHNbbmFtZV0gPSB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBsYWJlbDogbGFiZWwsXG4gICAgICBtaW46IG1pbixcbiAgICAgIG1heDogbWF4LFxuICAgICAgc3RlcDogc3RlcCxcbiAgICAgIHZhbHVlOiBpbml0LFxuICAgICAgY2xpZW50VHlwZXM6IGNsaWVudFR5cGVzXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgc2VsZWN0IHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBvcHRpb25zIEFycmF5IG9mIHRoZSBkaWZmZXJlbnQgdmFsdWVzIHRoZSBwYXJhbWV0ZXIgY2FuIHRha2UuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbml0IEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciAoaGFzIHRvIGJlIGluIHRoZSBgb3B0aW9uc2AgYXJyYXkpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZFNlbGVjdChuYW1lLCBsYWJlbCwgb3B0aW9ucywgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgdGhpcy5ldmVudHNbbmFtZV0gPSB7XG4gICAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBsYWJlbDogbGFiZWwsXG4gICAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgICAgdmFsdWU6IGluaXQsXG4gICAgICBjbGllbnRUeXBlczogY2xpZW50VHlwZXNcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gaW5mbyBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluaXQgSW5pdGlhbCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyIChoYXMgdG8gYmUgaW4gdGhlIGBvcHRpb25zYCBhcnJheSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkSW5mbyhuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgdGhpcy5ldmVudHNbbmFtZV0gPSB7XG4gICAgICB0eXBlOiAnaW5mbycsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgdmFsdWU6IGluaXQsXG4gICAgICBjbGllbnRUeXBlczogY2xpZW50VHlwZXNcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBjb21tYW5kLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBjb21tYW5kLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgTGFiZWwgb2YgdGhlIGNvbW1hbmQgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGRDb21tYW5kKG5hbWUsIGxhYmVsLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICB0aGlzLmV2ZW50c1tuYW1lXSA9IHtcbiAgICAgIHR5cGU6ICdjb21tYW5kJyxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBsYWJlbDogbGFiZWwsXG4gICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgY2xpZW50VHlwZXM6IGNsaWVudFR5cGVzXG4gICAgfTtcbiAgfVxuXG4gIF9icm9hZGNhc3RFdmVudChldmVudCkge1xuICAgIGxldCBjbGllbnRUeXBlcyA9IGV2ZW50LmNsaWVudFR5cGVzIHx8IHRoaXMuX2NsaWVudFR5cGVzO1xuXG4gICAgLy8gcHJvcGFnYXRlIHBhcmFtZXRlciB0byBjbGllbnRzXG4gICAgZm9yIChsZXQgY2xpZW50VHlwZSBvZiBjbGllbnRUeXBlcylcbiAgICAgIHRoaXMuYnJvYWRjYXN0KGNsaWVudFR5cGUsICdldmVudCcsIGV2ZW50Lm5hbWUsIGV2ZW50LnZhbHVlKTtcblxuICAgIHRoaXMuZW1pdChgJHt0aGlzLm5hbWV9OmV2ZW50YCwgZXZlbnQubmFtZSwgZXZlbnQudmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGFuIGV2ZW50IHRvIHRoZSBjbGllbnRzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudCB0byBzZW5kLlxuICAgKiBAZW1pdHMgJ2NvbnRyb2w6ZXZlbnQnXG4gICAqL1xuICBzZW5kKG5hbWUpIHtcbiAgICBjb25zb2xlLmRpcihuYW1lKTtcbiAgICBsZXQgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgIGlmIChldmVudCkge1xuICAgICAgdGhpcy5fYnJvYWRjYXN0RXZlbnQoZXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnc2VydmVyIGNvbnRyb2w6IHNlbmQgdW5rbm93biBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHZhbHVlIG9mIGEgcGFyYW1ldGVyIGFuZCBzZW5kcyBpdCB0byB0aGUgY2xpZW50cy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHsoU3RyaW5nfE51bWJlcnxCb29sZWFuKX0gdmFsdWUgTmV3IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICB1cGRhdGUobmFtZSwgdmFsdWUpIHtcbiAgICBsZXQgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX2Jyb2FkY2FzdEV2ZW50KGV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3NlcnZlciBjb250cm9sOiB1cGRhdGUgdW5rbm93biBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIGxldCBjbGllbnRUeXBlID0gY2xpZW50LnR5cGU7XG5cbiAgICBpZiAodGhpcy5fY2xpZW50VHlwZXMuaW5kZXhPZihjbGllbnRUeXBlKSA8IDApXG4gICAgICB0aGlzLl9jbGllbnRUeXBlcy5wdXNoKGNsaWVudFR5cGUpO1xuXG4gICAgLy8gaW5pdCBjb250cm9sIHBhcmFtZXRlcnMsIGluZm9zLCBhbmQgY29tbWFuZHMgYXQgY2xpZW50XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCAoKSA9PiB7XG4gICAgICBzdXBlci5zZW5kKGNsaWVudCwgJ2luaXQnLCB0aGlzLmV2ZW50cyk7XG4gICAgfSk7XG5cbiAgICAvLyBsaXN0ZW4gdG8gY29udHJvbCBwYXJhbWV0ZXJzXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2V2ZW50JywgKG5hbWUsIHZhbHVlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhuYW1lLCB2YWx1ZSk7XG4gICAgICB0aGlzLnVwZGF0ZShuYW1lLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==