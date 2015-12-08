'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ServerModule2 = require('./ServerModule');

var _ServerModule3 = _interopRequireDefault(_ServerModule2);

/**
 * [server] Manage the global `parameters`, `infos`, and `commands` across the whole scenario.
 *
 * The module keeps track of:
 * - `parameters`: values that can be updated by the actions of the clients (*e.g.* the gain of a synth);
 * - `infos`: information about the state of the scenario (*e.g.* number of clients in the performance);
 * - `commands`: can trigger an action (*e.g.* reload the page),
 * and propagates these to different client types.
 *
 * To set up controls in a scenario, you should extend this class on the server side and declare the controls specific to that scenario with the appropriate methods.
 *
 * (See also {@link src/client/ClientControl.js~ClientControl} on the client side.)
 *
 * @example // Example 1: make a `'conductor'` client to manage the controls
 * class MyControl extends ServerControl {
 *   constructor() {
 *     super();
 *
 *     // Parameter shared by all the client types
 *     this.addNumber('synth:gain', 'Synth gain', 0, 1, 0.1, 1);
 *     // Command propagated only to the `'player'` clients
 *     this.addCommand('reload', 'Reload the page', ['player']);
 *   }
 * }
 *
 * @example // Example 2: keep track of the number of `'player'` clients
 * class MyControl extends Control {
 *   constructor() {
 *     super();
 *     this.addInfo('numPlayers', 'Number of players', 0);
 *   }
 * }
 *
 * class MyPerformance extends Performance {
 *   constructor(control) {
 *     this._control = control;
 *   }
 *
 *   enter(client) {
 *     super.enter(client);
 *
 *     this._control.update('numPlayers', this.clients.length);
 *   }
 * }
 *
 * const control = new MyControl();
 * const performance = new MyPerformance(control);
 */

var ServerControl = (function (_ServerModule) {
  _inherits(ServerControl, _ServerModule);

  /**
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
})(_ServerModule3['default']);

exports['default'] = ServerControl;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzZCQUF5QixnQkFBZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBbURwQixhQUFhO1lBQWIsYUFBYTs7Ozs7OztBQUtyQixXQUxRLGFBQWEsR0FLTjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTEwsYUFBYTs7QUFNOUIsK0JBTmlCLGFBQWEsNkNBTXhCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFOzs7Ozs7QUFNakMsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7R0FDbEI7Ozs7Ozs7Ozs7Ozs7ZUFia0IsYUFBYTs7V0F5QnZCLG1CQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFzQjtVQUFwQixXQUFXLHlEQUFHLElBQUk7O0FBQzdELFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUc7QUFDbEIsWUFBSSxFQUFFLFFBQVE7QUFDZCxZQUFJLEVBQUUsSUFBSTtBQUNWLGFBQUssRUFBRSxLQUFLO0FBQ1osV0FBRyxFQUFFLEdBQUc7QUFDUixXQUFHLEVBQUUsR0FBRztBQUNSLFlBQUksRUFBRSxJQUFJO0FBQ1YsYUFBSyxFQUFFLElBQUk7QUFDWCxtQkFBVyxFQUFFLFdBQVc7T0FDekIsQ0FBQztLQUNIOzs7Ozs7Ozs7Ozs7V0FVUSxtQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQXNCO1VBQXBCLFdBQVcseURBQUcsSUFBSTs7QUFDdEQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRztBQUNsQixZQUFJLEVBQUUsUUFBUTtBQUNkLFlBQUksRUFBRSxJQUFJO0FBQ1YsYUFBSyxFQUFFLEtBQUs7QUFDWixlQUFPLEVBQUUsT0FBTztBQUNoQixhQUFLLEVBQUUsSUFBSTtBQUNYLG1CQUFXLEVBQUUsV0FBVztPQUN6QixDQUFDO0tBQ0g7Ozs7Ozs7Ozs7O1dBU00saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQXNCO1VBQXBCLFdBQVcseURBQUcsSUFBSTs7QUFDM0MsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRztBQUNsQixZQUFJLEVBQUUsTUFBTTtBQUNaLFlBQUksRUFBRSxJQUFJO0FBQ1YsYUFBSyxFQUFFLEtBQUs7QUFDWixhQUFLLEVBQUUsSUFBSTtBQUNYLG1CQUFXLEVBQUUsV0FBVztPQUN6QixDQUFDO0tBQ0g7Ozs7Ozs7Ozs7V0FRUyxvQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFzQjtVQUFwQixXQUFXLHlEQUFHLElBQUk7O0FBQ3hDLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUc7QUFDbEIsWUFBSSxFQUFFLFNBQVM7QUFDZixZQUFJLEVBQUUsSUFBSTtBQUNWLGFBQUssRUFBRSxLQUFLO0FBQ1osYUFBSyxFQUFFLFNBQVM7QUFDaEIsbUJBQVcsRUFBRSxXQUFXO09BQ3pCLENBQUM7S0FDSDs7O1dBRWMseUJBQUMsS0FBSyxFQUFFO0FBQ3JCLFVBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDOzs7QUFHNUMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlELFVBQUksQ0FBQyxJQUFJLENBQUksSUFBSSxDQUFDLElBQUksYUFBVSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMxRDs7Ozs7Ozs7O1dBT0csY0FBQyxJQUFJLEVBQUU7QUFDVCxhQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xCLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTlCLFVBQUksS0FBSyxFQUFFO0FBQ1QsWUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUM3QixNQUFNO0FBQ0wsZUFBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7T0FDbEU7S0FDRjs7Ozs7Ozs7O1dBT0ssZ0JBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNsQixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUU5QixVQUFJLEtBQUssRUFBRTtBQUNULGFBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLFlBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDN0IsTUFBTTtBQUNMLGVBQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO09BQ3BFO0tBQ0Y7Ozs7Ozs7V0FLTSxpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQXRJaUIsYUFBYSx5Q0FzSWhCLE1BQU0sRUFBRTs7O0FBR3RCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxZQUFNO0FBQ3BDLG1DQTFJZSxhQUFhLHdDQTBJakIsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFLLE1BQU0sRUFBRTtPQUN6QyxDQUFDLENBQUM7OztBQUdILFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUs7QUFDN0MsY0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQzFCLENBQUMsQ0FBQztLQUNKOzs7U0FqSmtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJNb2R1bGUgZnJvbSAnLi9TZXJ2ZXJNb2R1bGUnO1xuXG5cbi8qKlxuICogW3NlcnZlcl0gTWFuYWdlIHRoZSBnbG9iYWwgYHBhcmFtZXRlcnNgLCBgaW5mb3NgLCBhbmQgYGNvbW1hbmRzYCBhY3Jvc3MgdGhlIHdob2xlIHNjZW5hcmlvLlxuICpcbiAqIFRoZSBtb2R1bGUga2VlcHMgdHJhY2sgb2Y6XG4gKiAtIGBwYXJhbWV0ZXJzYDogdmFsdWVzIHRoYXQgY2FuIGJlIHVwZGF0ZWQgYnkgdGhlIGFjdGlvbnMgb2YgdGhlIGNsaWVudHMgKCplLmcuKiB0aGUgZ2FpbiBvZiBhIHN5bnRoKTtcbiAqIC0gYGluZm9zYDogaW5mb3JtYXRpb24gYWJvdXQgdGhlIHN0YXRlIG9mIHRoZSBzY2VuYXJpbyAoKmUuZy4qIG51bWJlciBvZiBjbGllbnRzIGluIHRoZSBwZXJmb3JtYW5jZSk7XG4gKiAtIGBjb21tYW5kc2A6IGNhbiB0cmlnZ2VyIGFuIGFjdGlvbiAoKmUuZy4qIHJlbG9hZCB0aGUgcGFnZSksXG4gKiBhbmQgcHJvcGFnYXRlcyB0aGVzZSB0byBkaWZmZXJlbnQgY2xpZW50IHR5cGVzLlxuICpcbiAqIFRvIHNldCB1cCBjb250cm9scyBpbiBhIHNjZW5hcmlvLCB5b3Ugc2hvdWxkIGV4dGVuZCB0aGlzIGNsYXNzIG9uIHRoZSBzZXJ2ZXIgc2lkZSBhbmQgZGVjbGFyZSB0aGUgY29udHJvbHMgc3BlY2lmaWMgdG8gdGhhdCBzY2VuYXJpbyB3aXRoIHRoZSBhcHByb3ByaWF0ZSBtZXRob2RzLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9DbGllbnRDb250cm9sLmpzfkNsaWVudENvbnRyb2x9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKlxuICogQGV4YW1wbGUgLy8gRXhhbXBsZSAxOiBtYWtlIGEgYCdjb25kdWN0b3InYCBjbGllbnQgdG8gbWFuYWdlIHRoZSBjb250cm9sc1xuICogY2xhc3MgTXlDb250cm9sIGV4dGVuZHMgU2VydmVyQ29udHJvbCB7XG4gKiAgIGNvbnN0cnVjdG9yKCkge1xuICogICAgIHN1cGVyKCk7XG4gKlxuICogICAgIC8vIFBhcmFtZXRlciBzaGFyZWQgYnkgYWxsIHRoZSBjbGllbnQgdHlwZXNcbiAqICAgICB0aGlzLmFkZE51bWJlcignc3ludGg6Z2FpbicsICdTeW50aCBnYWluJywgMCwgMSwgMC4xLCAxKTtcbiAqICAgICAvLyBDb21tYW5kIHByb3BhZ2F0ZWQgb25seSB0byB0aGUgYCdwbGF5ZXInYCBjbGllbnRzXG4gKiAgICAgdGhpcy5hZGRDb21tYW5kKCdyZWxvYWQnLCAnUmVsb2FkIHRoZSBwYWdlJywgWydwbGF5ZXInXSk7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBAZXhhbXBsZSAvLyBFeGFtcGxlIDI6IGtlZXAgdHJhY2sgb2YgdGhlIG51bWJlciBvZiBgJ3BsYXllcidgIGNsaWVudHNcbiAqIGNsYXNzIE15Q29udHJvbCBleHRlbmRzIENvbnRyb2wge1xuICogICBjb25zdHJ1Y3RvcigpIHtcbiAqICAgICBzdXBlcigpO1xuICogICAgIHRoaXMuYWRkSW5mbygnbnVtUGxheWVycycsICdOdW1iZXIgb2YgcGxheWVycycsIDApO1xuICogICB9XG4gKiB9XG4gKlxuICogY2xhc3MgTXlQZXJmb3JtYW5jZSBleHRlbmRzIFBlcmZvcm1hbmNlIHtcbiAqICAgY29uc3RydWN0b3IoY29udHJvbCkge1xuICogICAgIHRoaXMuX2NvbnRyb2wgPSBjb250cm9sO1xuICogICB9XG4gKlxuICogICBlbnRlcihjbGllbnQpIHtcbiAqICAgICBzdXBlci5lbnRlcihjbGllbnQpO1xuICpcbiAqICAgICB0aGlzLl9jb250cm9sLnVwZGF0ZSgnbnVtUGxheWVycycsIHRoaXMuY2xpZW50cy5sZW5ndGgpO1xuICogICB9XG4gKiB9XG4gKlxuICogY29uc3QgY29udHJvbCA9IG5ldyBNeUNvbnRyb2woKTtcbiAqIGNvbnN0IHBlcmZvcm1hbmNlID0gbmV3IE15UGVyZm9ybWFuY2UoY29udHJvbCk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckNvbnRyb2wgZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nY29udHJvbCddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY29udHJvbCcpO1xuXG4gICAgLyoqXG4gICAgICogRGljdGlvbmFyeSBvZiBhbGwgdGhlIGV2ZW50cy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnRzID0ge307XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG51bWJlciBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG1pbiBNaW5pbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtYXggTWF4aW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc3RlcCBTdGVwIHRvIGluY3JlYXNlIG9yIGRlY3JlYXNlIHRoZSBwYXJhbWV0ZXIgdmFsdWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbml0IEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGROdW1iZXIobmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICB0aGlzLmV2ZW50c1tuYW1lXSA9IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgIG1pbjogbWluLFxuICAgICAgbWF4OiBtYXgsXG4gICAgICBzdGVwOiBzdGVwLFxuICAgICAgdmFsdWU6IGluaXQsXG4gICAgICBjbGllbnRUeXBlczogY2xpZW50VHlwZXNcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBzZWxlY3QgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IG9wdGlvbnMgQXJyYXkgb2YgdGhlIGRpZmZlcmVudCB2YWx1ZXMgdGhlIHBhcmFtZXRlciBjYW4gdGFrZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluaXQgSW5pdGlhbCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyIChoYXMgdG8gYmUgaW4gdGhlIGBvcHRpb25zYCBhcnJheSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkU2VsZWN0KG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICB0aGlzLmV2ZW50c1tuYW1lXSA9IHtcbiAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICB2YWx1ZTogaW5pdCxcbiAgICAgIGNsaWVudFR5cGVzOiBjbGllbnRUeXBlc1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBpbmZvIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5pdCBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgKGhhcyB0byBiZSBpbiB0aGUgYG9wdGlvbnNgIGFycmF5KS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGRJbmZvKG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICB0aGlzLmV2ZW50c1tuYW1lXSA9IHtcbiAgICAgIHR5cGU6ICdpbmZvJyxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBsYWJlbDogbGFiZWwsXG4gICAgICB2YWx1ZTogaW5pdCxcbiAgICAgIGNsaWVudFR5cGVzOiBjbGllbnRUeXBlc1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGNvbW1hbmQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGNvbW1hbmQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBMYWJlbCBvZiB0aGUgY29tbWFuZCAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZENvbW1hbmQobmFtZSwgbGFiZWwsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHRoaXMuZXZlbnRzW25hbWVdID0ge1xuICAgICAgdHlwZTogJ2NvbW1hbmQnLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICBjbGllbnRUeXBlczogY2xpZW50VHlwZXNcbiAgICB9O1xuICB9XG5cbiAgX2Jyb2FkY2FzdEV2ZW50KGV2ZW50KSB7XG4gICAgbGV0IGNsaWVudFR5cGVzID0gZXZlbnQuY2xpZW50VHlwZXMgfHwgbnVsbDtcblxuICAgIC8vIHByb3BhZ2F0ZSBwYXJhbWV0ZXIgdG8gY2xpZW50c1xuICAgIHRoaXMuYnJvYWRjYXN0KGNsaWVudFR5cGVzLCAnZXZlbnQnLCBldmVudC5uYW1lLCBldmVudC52YWx1ZSk7XG4gICAgdGhpcy5lbWl0KGAke3RoaXMubmFtZX06ZXZlbnRgLCBldmVudC5uYW1lLCBldmVudC52YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYW4gZXZlbnQgdG8gdGhlIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50IHRvIHNlbmQuXG4gICAqIEBlbWl0cyAnY29udHJvbDpldmVudCdcbiAgICovXG4gIHNlbmQobmFtZSkge1xuICAgIGNvbnNvbGUuZGlyKG5hbWUpO1xuICAgIGxldCBldmVudCA9IHRoaXMuZXZlbnRzW25hbWVdO1xuXG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICB0aGlzLl9icm9hZGNhc3RFdmVudChldmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdzZXJ2ZXIgY29udHJvbDogc2VuZCB1bmtub3duIGV2ZW50IFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgYSBwYXJhbWV0ZXIgYW5kIHNlbmRzIGl0IHRvIHRoZSBjbGllbnRzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0geyhTdHJpbmd8TnVtYmVyfEJvb2xlYW4pfSB2YWx1ZSBOZXcgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIHVwZGF0ZShuYW1lLCB2YWx1ZSkge1xuICAgIGxldCBldmVudCA9IHRoaXMuZXZlbnRzW25hbWVdO1xuXG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICBldmVudC52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5fYnJvYWRjYXN0RXZlbnQoZXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnc2VydmVyIGNvbnRyb2w6IHVwZGF0ZSB1bmtub3duIGV2ZW50IFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgLy8gaW5pdCBjb250cm9sIHBhcmFtZXRlcnMsIGluZm9zLCBhbmQgY29tbWFuZHMgYXQgY2xpZW50XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCAoKSA9PiB7XG4gICAgICBzdXBlci5zZW5kKGNsaWVudCwgJ2luaXQnLCB0aGlzLmV2ZW50cyk7XG4gICAgfSk7XG5cbiAgICAvLyBsaXN0ZW4gdG8gY29udHJvbCBwYXJhbWV0ZXJzXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2V2ZW50JywgKG5hbWUsIHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZShuYW1lLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==