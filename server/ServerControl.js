// import server from './server';
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

/**
 * The `ServerControl` module is used to control an application through a dedicated client (that we usually call `conductor`).
 * The module allows for declaring `parameters`, `infos`, and `commands`, through which the `conductor` can control and monitor the state of the application:
 * - `parameters` are values that are changed by a client, sent to the server, and propagated to the other connected clients (*e.g.* the tempo of a musical application);
 * - `infos` are values that are changed by the server and propagated to the connected clients, to inform about the current state of the application (*e.g.* the number of connected `player` clients);
 * - `commands` are messages (without arguments) that are send from the client to the server (*e.g.* `start`, `stop` or `clear` — whatever they would mean for a given application) which does the necessary upon reception.
 *
 * Optionally, the {@link ClientControl} module can automatically construct a simple interface from the list of declared controls that allows to change `parameters`, display `infos`, and send `commands` to the server.
 *
 * The controls of different types are declared on the server side and propagated to the client side when a client is set up.
 *
 * The {@link ServerControl} takes care of the parameters and commands on the server side.
 * To set up controls in a scenario, you should extend this class on the server side and declare the controls specific to that scenario with the appropriate methods.
 * @example
 * class Control extends ServerControl {
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

var ServerControl = (function (_Module) {
  _inherits(ServerControl, _Module);

  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='control'] Name of the module.
   */

  function ServerControl() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerControl);

    _get(Object.getPrototypeOf(ServerControl.prototype), 'constructor', this).call(this, options.name || 'control');

    /**
     * Dictionary of all the events.
     * @type {Object}
     */
    this.events = {};
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

  _createClass(ServerControl, [{
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
      var clientTypes = event.clientTypes || null;

      // propagate parameter to clients
      this.broadcast(clientTypes, 'event', event.name, event.value);
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

      _get(Object.getPrototypeOf(ServerControl.prototype), 'connect', this).call(this, client);

      // init control parameters, infos, and commands at client
      this.receive(client, 'request', function () {
        _get(Object.getPrototypeOf(ServerControl.prototype), 'send', _this).call(_this, client, 'init', _this.events);
      });

      // listen to control parameters
      this.receive(client, 'event', function (name, value) {
        _this.update(name, value);
      });
    }
  }]);

  return ServerControl;
})(_Module3['default']);

exports['default'] = ServerControl;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyQ29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFDbUIsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0NSLGFBQWE7WUFBYixhQUFhOzs7Ozs7OztBQU1yQixXQU5RLGFBQWEsR0FNTjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTkwsYUFBYTs7QUFPOUIsK0JBUGlCLGFBQWEsNkNBT3hCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFOzs7Ozs7QUFNakMsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7R0FDbEI7Ozs7Ozs7Ozs7Ozs7ZUFka0IsYUFBYTs7V0EwQnZCLG1CQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFzQjtVQUFwQixXQUFXLHlEQUFHLElBQUk7O0FBQzdELFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUc7QUFDbEIsWUFBSSxFQUFFLFFBQVE7QUFDZCxZQUFJLEVBQUUsSUFBSTtBQUNWLGFBQUssRUFBRSxLQUFLO0FBQ1osV0FBRyxFQUFFLEdBQUc7QUFDUixXQUFHLEVBQUUsR0FBRztBQUNSLFlBQUksRUFBRSxJQUFJO0FBQ1YsYUFBSyxFQUFFLElBQUk7QUFDWCxtQkFBVyxFQUFFLFdBQVc7T0FDekIsQ0FBQztLQUNIOzs7Ozs7Ozs7Ozs7V0FVUSxtQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQXNCO1VBQXBCLFdBQVcseURBQUcsSUFBSTs7QUFDdEQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRztBQUNsQixZQUFJLEVBQUUsUUFBUTtBQUNkLFlBQUksRUFBRSxJQUFJO0FBQ1YsYUFBSyxFQUFFLEtBQUs7QUFDWixlQUFPLEVBQUUsT0FBTztBQUNoQixhQUFLLEVBQUUsSUFBSTtBQUNYLG1CQUFXLEVBQUUsV0FBVztPQUN6QixDQUFDO0tBQ0g7Ozs7Ozs7Ozs7O1dBU00saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQXNCO1VBQXBCLFdBQVcseURBQUcsSUFBSTs7QUFDM0MsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRztBQUNsQixZQUFJLEVBQUUsTUFBTTtBQUNaLFlBQUksRUFBRSxJQUFJO0FBQ1YsYUFBSyxFQUFFLEtBQUs7QUFDWixhQUFLLEVBQUUsSUFBSTtBQUNYLG1CQUFXLEVBQUUsV0FBVztPQUN6QixDQUFDO0tBQ0g7Ozs7Ozs7Ozs7V0FRUyxvQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFzQjtVQUFwQixXQUFXLHlEQUFHLElBQUk7O0FBQ3hDLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUc7QUFDbEIsWUFBSSxFQUFFLFNBQVM7QUFDZixZQUFJLEVBQUUsSUFBSTtBQUNWLGFBQUssRUFBRSxLQUFLO0FBQ1osYUFBSyxFQUFFLFNBQVM7QUFDaEIsbUJBQVcsRUFBRSxXQUFXO09BQ3pCLENBQUM7S0FDSDs7O1dBRWMseUJBQUMsS0FBSyxFQUFFO0FBQ3JCLFVBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDOzs7QUFHNUMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlELFVBQUksQ0FBQyxJQUFJLENBQUksSUFBSSxDQUFDLElBQUksYUFBVSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMxRDs7Ozs7Ozs7O1dBT0csY0FBQyxJQUFJLEVBQUU7QUFDVCxhQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xCLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTlCLFVBQUksS0FBSyxFQUFFO0FBQ1QsWUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUM3QixNQUFNO0FBQ0wsZUFBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7T0FDbEU7S0FDRjs7Ozs7Ozs7O1dBT0ssZ0JBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNsQixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUU5QixVQUFJLEtBQUssRUFBRTtBQUNULGFBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLFlBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDN0IsTUFBTTtBQUNMLGVBQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO09BQ3BFO0tBQ0Y7Ozs7Ozs7V0FLTSxpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQXZJaUIsYUFBYSx5Q0F1SWhCLE1BQU0sRUFBRTs7O0FBR3RCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxZQUFNO0FBQ3BDLG1DQTNJZSxhQUFhLHdDQTJJakIsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFLLE1BQU0sRUFBRTtPQUN6QyxDQUFDLENBQUM7OztBQUdILFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUs7QUFDN0MsY0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQzFCLENBQUMsQ0FBQztLQUNKOzs7U0FsSmtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU2VydmVyQ29udHJvbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXInO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuLyoqXG4gKiBUaGUgYFNlcnZlckNvbnRyb2xgIG1vZHVsZSBpcyB1c2VkIHRvIGNvbnRyb2wgYW4gYXBwbGljYXRpb24gdGhyb3VnaCBhIGRlZGljYXRlZCBjbGllbnQgKHRoYXQgd2UgdXN1YWxseSBjYWxsIGBjb25kdWN0b3JgKS5cbiAqIFRoZSBtb2R1bGUgYWxsb3dzIGZvciBkZWNsYXJpbmcgYHBhcmFtZXRlcnNgLCBgaW5mb3NgLCBhbmQgYGNvbW1hbmRzYCwgdGhyb3VnaCB3aGljaCB0aGUgYGNvbmR1Y3RvcmAgY2FuIGNvbnRyb2wgYW5kIG1vbml0b3IgdGhlIHN0YXRlIG9mIHRoZSBhcHBsaWNhdGlvbjpcbiAqIC0gYHBhcmFtZXRlcnNgIGFyZSB2YWx1ZXMgdGhhdCBhcmUgY2hhbmdlZCBieSBhIGNsaWVudCwgc2VudCB0byB0aGUgc2VydmVyLCBhbmQgcHJvcGFnYXRlZCB0byB0aGUgb3RoZXIgY29ubmVjdGVkIGNsaWVudHMgKCplLmcuKiB0aGUgdGVtcG8gb2YgYSBtdXNpY2FsIGFwcGxpY2F0aW9uKTtcbiAqIC0gYGluZm9zYCBhcmUgdmFsdWVzIHRoYXQgYXJlIGNoYW5nZWQgYnkgdGhlIHNlcnZlciBhbmQgcHJvcGFnYXRlZCB0byB0aGUgY29ubmVjdGVkIGNsaWVudHMsIHRvIGluZm9ybSBhYm91dCB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgYXBwbGljYXRpb24gKCplLmcuKiB0aGUgbnVtYmVyIG9mIGNvbm5lY3RlZCBgcGxheWVyYCBjbGllbnRzKTtcbiAqIC0gYGNvbW1hbmRzYCBhcmUgbWVzc2FnZXMgKHdpdGhvdXQgYXJndW1lbnRzKSB0aGF0IGFyZSBzZW5kIGZyb20gdGhlIGNsaWVudCB0byB0aGUgc2VydmVyICgqZS5nLiogYHN0YXJ0YCwgYHN0b3BgIG9yIGBjbGVhcmAg4oCUIHdoYXRldmVyIHRoZXkgd291bGQgbWVhbiBmb3IgYSBnaXZlbiBhcHBsaWNhdGlvbikgd2hpY2ggZG9lcyB0aGUgbmVjZXNzYXJ5IHVwb24gcmVjZXB0aW9uLlxuICpcbiAqIE9wdGlvbmFsbHksIHRoZSB7QGxpbmsgQ2xpZW50Q29udHJvbH0gbW9kdWxlIGNhbiBhdXRvbWF0aWNhbGx5IGNvbnN0cnVjdCBhIHNpbXBsZSBpbnRlcmZhY2UgZnJvbSB0aGUgbGlzdCBvZiBkZWNsYXJlZCBjb250cm9scyB0aGF0IGFsbG93cyB0byBjaGFuZ2UgYHBhcmFtZXRlcnNgLCBkaXNwbGF5IGBpbmZvc2AsIGFuZCBzZW5kIGBjb21tYW5kc2AgdG8gdGhlIHNlcnZlci5cbiAqXG4gKiBUaGUgY29udHJvbHMgb2YgZGlmZmVyZW50IHR5cGVzIGFyZSBkZWNsYXJlZCBvbiB0aGUgc2VydmVyIHNpZGUgYW5kIHByb3BhZ2F0ZWQgdG8gdGhlIGNsaWVudCBzaWRlIHdoZW4gYSBjbGllbnQgaXMgc2V0IHVwLlxuICpcbiAqIFRoZSB7QGxpbmsgU2VydmVyQ29udHJvbH0gdGFrZXMgY2FyZSBvZiB0aGUgcGFyYW1ldGVycyBhbmQgY29tbWFuZHMgb24gdGhlIHNlcnZlciBzaWRlLlxuICogVG8gc2V0IHVwIGNvbnRyb2xzIGluIGEgc2NlbmFyaW8sIHlvdSBzaG91bGQgZXh0ZW5kIHRoaXMgY2xhc3Mgb24gdGhlIHNlcnZlciBzaWRlIGFuZCBkZWNsYXJlIHRoZSBjb250cm9scyBzcGVjaWZpYyB0byB0aGF0IHNjZW5hcmlvIHdpdGggdGhlIGFwcHJvcHJpYXRlIG1ldGhvZHMuXG4gKiBAZXhhbXBsZVxuICogY2xhc3MgQ29udHJvbCBleHRlbmRzIFNlcnZlckNvbnRyb2wge1xuICogICBjb25zdHJ1Y3RvcihuYW1lQXJyYXkpIHtcbiAqICAgICBzdXBlcigpO1xuICpcbiAqICAgICAvLyBJbmZvIGNvcnJlc3BvbmRpbmcgdG8gdGhlIG51bWJlciBvZiBwbGF5ZXJzXG4gKiAgICAgdGhpcy5hZGRJbmZvKCdudW1QbGF5ZXJzJywgJ051bWJlciBvZiBwbGF5ZXJzJywgMCk7XG4gKiAgICAgLy8gTnVtYmVyIHBhcmFtZXRlciBjb3JyZXNwb25kaW5nIHRvIHRoZSBvdXRwdXQgZ2FpbiBvZiB0aGUgcGxheWVyc1xuICogICAgIHRoaXMuYWRkTnVtYmVyKCdnYWluJywgJ0dsb2JhbCBnYWluJywgMCwgMSwgMC4xLCAxKTtcbiAqICAgICAvLyBTZWxlY3QgcGFyYW1ldGVyIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHN0YXRlIG9mIHRoZSBwZXJmb3JtYW5jZVxuICogICAgIHRoaXMuYWRkU2VsZWN0KCdzdGF0ZScsICdTdGF0ZScsIFsnaWRsZScsICdwbGF5aW5nJ10sICdpZGxlJyk7XG4gKiAgICAgLy8gQ29tbWFuZCB0byByZWxvYWQgdGhlIHBhZ2Ugb24gYWxsIHRoZSBjbGllbnRzXG4gKiAgICAgdGhpcy5hZGRDb21tYW5kKCdyZWxvYWQnLCAnUmVsb2FkIHRoZSBwYWdlIG9mIGFsbCB0aGUgY2xpZW50cycpO1xuICogICB9XG4gKiB9XG4gKlxuICogY29uc3QgY29udHJvbCA9IG5ldyBDb250cm9sKGd1aXJvTmFtZXMsIHNvdW5kZmllbGROYW1lcyk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckNvbnRyb2wgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J2NvbnRyb2wnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2NvbnRyb2wnKTtcblxuICAgIC8qKlxuICAgICAqIERpY3Rpb25hcnkgb2YgYWxsIHRoZSBldmVudHMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBudW1iZXIgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtaW4gTWluaW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbWF4IE1heGltdW0gdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0ZXAgU3RlcCB0byBpbmNyZWFzZSBvciBkZWNyZWFzZSB0aGUgcGFyYW1ldGVyIHZhbHVlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5pdCBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkTnVtYmVyKG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgdGhpcy5ldmVudHNbbmFtZV0gPSB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBsYWJlbDogbGFiZWwsXG4gICAgICBtaW46IG1pbixcbiAgICAgIG1heDogbWF4LFxuICAgICAgc3RlcDogc3RlcCxcbiAgICAgIHZhbHVlOiBpbml0LFxuICAgICAgY2xpZW50VHlwZXM6IGNsaWVudFR5cGVzXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgc2VsZWN0IHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBvcHRpb25zIEFycmF5IG9mIHRoZSBkaWZmZXJlbnQgdmFsdWVzIHRoZSBwYXJhbWV0ZXIgY2FuIHRha2UuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbml0IEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciAoaGFzIHRvIGJlIGluIHRoZSBgb3B0aW9uc2AgYXJyYXkpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZFNlbGVjdChuYW1lLCBsYWJlbCwgb3B0aW9ucywgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgdGhpcy5ldmVudHNbbmFtZV0gPSB7XG4gICAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBsYWJlbDogbGFiZWwsXG4gICAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgICAgdmFsdWU6IGluaXQsXG4gICAgICBjbGllbnRUeXBlczogY2xpZW50VHlwZXNcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gaW5mbyBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluaXQgSW5pdGlhbCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyIChoYXMgdG8gYmUgaW4gdGhlIGBvcHRpb25zYCBhcnJheSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkSW5mbyhuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgdGhpcy5ldmVudHNbbmFtZV0gPSB7XG4gICAgICB0eXBlOiAnaW5mbycsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgdmFsdWU6IGluaXQsXG4gICAgICBjbGllbnRUeXBlczogY2xpZW50VHlwZXNcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBjb21tYW5kLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBjb21tYW5kLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgTGFiZWwgb2YgdGhlIGNvbW1hbmQgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGRDb21tYW5kKG5hbWUsIGxhYmVsLCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICB0aGlzLmV2ZW50c1tuYW1lXSA9IHtcbiAgICAgIHR5cGU6ICdjb21tYW5kJyxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBsYWJlbDogbGFiZWwsXG4gICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgY2xpZW50VHlwZXM6IGNsaWVudFR5cGVzXG4gICAgfTtcbiAgfVxuXG4gIF9icm9hZGNhc3RFdmVudChldmVudCkge1xuICAgIGxldCBjbGllbnRUeXBlcyA9IGV2ZW50LmNsaWVudFR5cGVzIHx8IG51bGw7XG5cbiAgICAvLyBwcm9wYWdhdGUgcGFyYW1ldGVyIHRvIGNsaWVudHNcbiAgICB0aGlzLmJyb2FkY2FzdChjbGllbnRUeXBlcywgJ2V2ZW50JywgZXZlbnQubmFtZSwgZXZlbnQudmFsdWUpO1xuICAgIHRoaXMuZW1pdChgJHt0aGlzLm5hbWV9OmV2ZW50YCwgZXZlbnQubmFtZSwgZXZlbnQudmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGFuIGV2ZW50IHRvIHRoZSBjbGllbnRzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudCB0byBzZW5kLlxuICAgKiBAZW1pdHMgJ2NvbnRyb2w6ZXZlbnQnXG4gICAqL1xuICBzZW5kKG5hbWUpIHtcbiAgICBjb25zb2xlLmRpcihuYW1lKTtcbiAgICBsZXQgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgIGlmIChldmVudCkge1xuICAgICAgdGhpcy5fYnJvYWRjYXN0RXZlbnQoZXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnc2VydmVyIGNvbnRyb2w6IHNlbmQgdW5rbm93biBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHZhbHVlIG9mIGEgcGFyYW1ldGVyIGFuZCBzZW5kcyBpdCB0byB0aGUgY2xpZW50cy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHsoU3RyaW5nfE51bWJlcnxCb29sZWFuKX0gdmFsdWUgTmV3IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICB1cGRhdGUobmFtZSwgdmFsdWUpIHtcbiAgICBsZXQgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX2Jyb2FkY2FzdEV2ZW50KGV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3NlcnZlciBjb250cm9sOiB1cGRhdGUgdW5rbm93biBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIC8vIGluaXQgY29udHJvbCBwYXJhbWV0ZXJzLCBpbmZvcywgYW5kIGNvbW1hbmRzIGF0IGNsaWVudFxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgKCkgPT4ge1xuICAgICAgc3VwZXIuc2VuZChjbGllbnQsICdpbml0JywgdGhpcy5ldmVudHMpO1xuICAgIH0pO1xuXG4gICAgLy8gbGlzdGVuIHRvIGNvbnRyb2wgcGFyYW1ldGVyc1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdldmVudCcsIChuYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGUobmFtZSwgdmFsdWUpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=