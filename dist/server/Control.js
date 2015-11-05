'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var server = require('./server');
var ServerModule = require('./ServerModule');
// import server from './server.es6.js';
// import ServerModule from './ServerModule.es6.js';

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

var ServerControl = (function (_ServerModule) {
  _inherits(ServerControl, _ServerModule);

  // export default class ServerControl extends ServerModule {
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
      var clientTypes = event.clientTypes || this._clientTypes;

      // propagate parameter to clients
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(clientTypes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var clientType = _step.value;

          server.broadcast(clientType, 'control:event', event.name, event.value);
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

      this.emit('control:event', event.name, event.value);
    }

    /**
     * Sends an event to the clients.
     * @param {String} name Name of the event to send.
     * @emits 'control:event'
     */
  }, {
    key: 'send',
    value: function send(name) {
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
  }, {
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(ServerControl.prototype), 'connect', this).call(this, client);

      var clientType = client.type;

      if (this._clientTypes.indexOf(clientType) < 0) this._clientTypes.push(clientType);

      // init control parameters, infos, and commands at client
      client.receive('control:request', function () {
        client.send('control:init', _this.events);
      });

      // listen to control parameters
      client.receive('control:event', function (name, value) {
        _this.update(name, value);
      });
    }
  }]);

  return ServerControl;
})(ServerModule);

module.exports = ServerControl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvQ29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7OztBQUViLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNuQyxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBbUN6QyxhQUFhO1lBQWIsYUFBYTs7Ozs7Ozs7O0FBT04sV0FQUCxhQUFhLEdBT1M7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVBwQixhQUFhOztBQVFmLCtCQVJFLGFBQWEsNkNBUVQsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUU7Ozs7OztBQU1qQyxRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzs7QUFFakIsUUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7R0FDeEI7Ozs7Ozs7Ozs7Ozs7ZUFqQkcsYUFBYTs7V0E2QlIsbUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQXNCO1VBQXBCLFdBQVcseURBQUcsSUFBSTs7QUFDN0QsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRztBQUNsQixZQUFJLEVBQUUsUUFBUTtBQUNkLFlBQUksRUFBRSxJQUFJO0FBQ1YsYUFBSyxFQUFFLEtBQUs7QUFDWixXQUFHLEVBQUUsR0FBRztBQUNSLFdBQUcsRUFBRSxHQUFHO0FBQ1IsWUFBSSxFQUFFLElBQUk7QUFDVixhQUFLLEVBQUUsSUFBSTtBQUNYLG1CQUFXLEVBQUUsV0FBVztPQUN6QixDQUFDO0tBQ0g7Ozs7Ozs7Ozs7OztXQVVRLG1CQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBc0I7VUFBcEIsV0FBVyx5REFBRyxJQUFJOztBQUN0RCxVQUFJLENBQUMsTUFBTSxDQUFDLElB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QUFFLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBSztBQUMvQyxjQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDMUIsQ0FBQyxDQUFDO0tBQ0o7OztTQXhKRyxhQUFhO0dBQVMsWUFBWTs7QUEySnhDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDIiwiZmlsZSI6InNyYy9zZXJ2ZXIvQ29udHJvbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc2VydmVyID0gcmVxdWlyZSgnLi9zZXJ2ZXInKTtcbmNvbnN0IFNlcnZlck1vZHVsZSA9IHJlcXVpcmUoJy4vU2VydmVyTW9kdWxlJyk7XG4vLyBpbXBvcnQgc2VydmVyIGZyb20gJy4vc2VydmVyLmVzNi5qcyc7XG4vLyBpbXBvcnQgU2VydmVyTW9kdWxlIGZyb20gJy4vU2VydmVyTW9kdWxlLmVzNi5qcyc7XG5cbi8qKlxuICogVGhlIGBDb250cm9sYCBtb2R1bGUgaXMgdXNlZCB0byBjb250cm9sIGFuIGFwcGxpY2F0aW9uIHRocm91Z2ggYSBkZWRpY2F0ZWQgY2xpZW50ICh0aGF0IHdlIHVzdWFsbHkgY2FsbCBgY29uZHVjdG9yYCkuXG4gKiBUaGUgbW9kdWxlIGFsbG93cyBmb3IgZGVjbGFyaW5nIGBwYXJhbWV0ZXJzYCwgYGluZm9zYCwgYW5kIGBjb21tYW5kc2AsIHRocm91Z2ggd2hpY2ggdGhlIGBjb25kdWN0b3JgIGNhbiBjb250cm9sIGFuZCBtb25pdG9yIHRoZSBzdGF0ZSBvZiB0aGUgYXBwbGljYXRpb246XG4gKiAtIGBwYXJhbWV0ZXJzYCBhcmUgdmFsdWVzIHRoYXQgYXJlIGNoYW5nZWQgYnkgYSBjbGllbnQsIHNlbnQgdG8gdGhlIHNlcnZlciwgYW5kIHByb3BhZ2F0ZWQgdG8gdGhlIG90aGVyIGNvbm5lY3RlZCBjbGllbnRzICgqZS5nLiogdGhlIHRlbXBvIG9mIGEgbXVzaWNhbCBhcHBsaWNhdGlvbik7XG4gKiAtIGBpbmZvc2AgYXJlIHZhbHVlcyB0aGF0IGFyZSBjaGFuZ2VkIGJ5IHRoZSBzZXJ2ZXIgYW5kIHByb3BhZ2F0ZWQgdG8gdGhlIGNvbm5lY3RlZCBjbGllbnRzLCB0byBpbmZvcm0gYWJvdXQgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGFwcGxpY2F0aW9uICgqZS5nLiogdGhlIG51bWJlciBvZiBjb25uZWN0ZWQgYHBsYXllcmAgY2xpZW50cyk7XG4gKiAtIGBjb21tYW5kc2AgYXJlIG1lc3NhZ2VzICh3aXRob3V0IGFyZ3VtZW50cykgdGhhdCBhcmUgc2VuZCBmcm9tIHRoZSBjbGllbnQgdG8gdGhlIHNlcnZlciAoKmUuZy4qIGBzdGFydGAsIGBzdG9wYCBvciBgY2xlYXJgIOKAlCB3aGF0ZXZlciB0aGV5IHdvdWxkIG1lYW4gZm9yIGEgZ2l2ZW4gYXBwbGljYXRpb24pIHdoaWNoIGRvZXMgdGhlIG5lY2Vzc2FyeSB1cG9uIHJlY2VwdGlvbi5cbiAqXG4gKiBPcHRpb25hbGx5LCB0aGUge0BsaW5rIENsaWVudENvbnRyb2x9IG1vZHVsZSBjYW4gYXV0b21hdGljYWxseSBjb25zdHJ1Y3QgYSBzaW1wbGUgaW50ZXJmYWNlIGZyb20gdGhlIGxpc3Qgb2YgZGVjbGFyZWQgY29udHJvbHMgdGhhdCBhbGxvd3MgdG8gY2hhbmdlIGBwYXJhbWV0ZXJzYCwgZGlzcGxheSBgaW5mb3NgLCBhbmQgc2VuZCBgY29tbWFuZHNgIHRvIHRoZSBzZXJ2ZXIuXG4gKlxuICogVGhlIGNvbnRyb2xzIG9mIGRpZmZlcmVudCB0eXBlcyBhcmUgZGVjbGFyZWQgb24gdGhlIHNlcnZlciBzaWRlIGFuZCBwcm9wYWdhdGVkIHRvIHRoZSBjbGllbnQgc2lkZSB3aGVuIGEgY2xpZW50IGlzIHNldCB1cC5cbiAqXG4gKiBUaGUge0BsaW5rIFNlcnZlckNvbnRyb2x9IHRha2VzIGNhcmUgb2YgdGhlIHBhcmFtZXRlcnMgYW5kIGNvbW1hbmRzIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAqIFRvIHNldCB1cCBjb250cm9scyBpbiBhIHNjZW5hcmlvLCB5b3Ugc2hvdWxkIGV4dGVuZCB0aGlzIGNsYXNzIG9uIHRoZSBzZXJ2ZXIgc2lkZSBhbmQgZGVjbGFyZSB0aGUgY29udHJvbHMgc3BlY2lmaWMgdG8gdGhhdCBzY2VuYXJpbyB3aXRoIHRoZSBhcHByb3ByaWF0ZSBtZXRob2RzLlxuICogQGV4YW1wbGVcbiAqIGNsYXNzIENvbnRyb2wgZXh0ZW5kcyBTZXJ2ZXJDb250cm9sIHtcbiAqICAgY29uc3RydWN0b3IobmFtZUFycmF5KSB7XG4gKiAgICAgc3VwZXIoKTtcbiAqXG4gKiAgICAgLy8gSW5mbyBjb3JyZXNwb25kaW5nIHRvIHRoZSBudW1iZXIgb2YgcGxheWVyc1xuICogICAgIHRoaXMuYWRkSW5mbygnbnVtUGxheWVycycsICdOdW1iZXIgb2YgcGxheWVycycsIDApO1xuICogICAgIC8vIE51bWJlciBwYXJhbWV0ZXIgY29ycmVzcG9uZGluZyB0byB0aGUgb3V0cHV0IGdhaW4gb2YgdGhlIHBsYXllcnNcbiAqICAgICB0aGlzLmFkZE51bWJlcignZ2FpbicsICdHbG9iYWwgZ2FpbicsIDAsIDEsIDAuMSwgMSk7XG4gKiAgICAgLy8gU2VsZWN0IHBhcmFtZXRlciBjb3JyZXNwb25kaW5nIHRvIHRoZSBzdGF0ZSBvZiB0aGUgcGVyZm9ybWFuY2VcbiAqICAgICB0aGlzLmFkZFNlbGVjdCgnc3RhdGUnLCAnU3RhdGUnLCBbJ2lkbGUnLCAncGxheWluZyddLCAnaWRsZScpO1xuICogICAgIC8vIENvbW1hbmQgdG8gcmVsb2FkIHRoZSBwYWdlIG9uIGFsbCB0aGUgY2xpZW50c1xuICogICAgIHRoaXMuYWRkQ29tbWFuZCgncmVsb2FkJywgJ1JlbG9hZCB0aGUgcGFnZSBvZiBhbGwgdGhlIGNsaWVudHMnKTtcbiAqICAgfVxuICogfVxuICpcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgQ29udHJvbChndWlyb05hbWVzLCBzb3VuZGZpZWxkTmFtZXMpO1xuICovXG5jbGFzcyBTZXJ2ZXJDb250cm9sIGV4dGVuZHMgU2VydmVyTW9kdWxlIHtcbi8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckNvbnRyb2wgZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J2NvbnRyb2wnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2NvbnRyb2wnKTtcblxuICAgIC8qKlxuICAgICAqIERpY3Rpb25hcnkgb2YgYWxsIHRoZSBldmVudHMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuXG4gICAgdGhpcy5fY2xpZW50VHlwZXMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbnVtYmVyIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbWluIE1pbmltdW0gdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG1heCBNYXhpbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdGVwIFN0ZXAgdG8gaW5jcmVhc2Ugb3IgZGVjcmVhc2UgdGhlIHBhcmFtZXRlciB2YWx1ZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluaXQgSW5pdGlhbCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZE51bWJlcihuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHRoaXMuZXZlbnRzW25hbWVdID0ge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgbWluOiBtaW4sXG4gICAgICBtYXg6IG1heCxcbiAgICAgIHN0ZXA6IHN0ZXAsXG4gICAgICB2YWx1ZTogaW5pdCxcbiAgICAgIGNsaWVudFR5cGVzOiBjbGllbnRUeXBlc1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHNlbGVjdCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gb3B0aW9ucyBBcnJheSBvZiB0aGUgZGlmZmVyZW50IHZhbHVlcyB0aGUgcGFyYW1ldGVyIGNhbiB0YWtlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5pdCBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgKGhhcyB0byBiZSBpbiB0aGUgYG9wdGlvbnNgIGFycmF5KS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGRTZWxlY3QobmFtZSwgbGFiZWwsIG9wdGlvbnMsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHRoaXMuZXZlbnRzW25hbWVdID0ge1xuICAgICAgdHlwZTogJ3NlbGVjdCcsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICAgIHZhbHVlOiBpbml0LFxuICAgICAgY2xpZW50VHlwZXM6IGNsaWVudFR5cGVzXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGluZm8gcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbml0IEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciAoaGFzIHRvIGJlIGluIHRoZSBgb3B0aW9uc2AgYXJyYXkpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZEluZm8obmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHRoaXMuZXZlbnRzW25hbWVdID0ge1xuICAgICAgdHlwZTogJ2luZm8nLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgIHZhbHVlOiBpbml0LFxuICAgICAgY2xpZW50VHlwZXM6IGNsaWVudFR5cGVzXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgY29tbWFuZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgY29tbWFuZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIExhYmVsIG9mIHRoZSBjb21tYW5kIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkQ29tbWFuZChuYW1lLCBsYWJlbCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgdGhpcy5ldmVudHNbbmFtZV0gPSB7XG4gICAgICB0eXBlOiAnY29tbWFuZCcsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgIGNsaWVudFR5cGVzOiBjbGllbnRUeXBlc1xuICAgIH07XG4gIH1cblxuICBfYnJvYWRjYXN0RXZlbnQoZXZlbnQpIHtcbiAgICBsZXQgY2xpZW50VHlwZXMgPSBldmVudC5jbGllbnRUeXBlcyB8fCB0aGlzLl9jbGllbnRUeXBlcztcblxuICAgIC8vIHByb3BhZ2F0ZSBwYXJhbWV0ZXIgdG8gY2xpZW50c1xuICAgIGZvciAobGV0IGNsaWVudFR5cGUgb2YgY2xpZW50VHlwZXMpXG4gICAgICBzZXJ2ZXIuYnJvYWRjYXN0KGNsaWVudFR5cGUsICdjb250cm9sOmV2ZW50JywgZXZlbnQubmFtZSwgZXZlbnQudmFsdWUpO1xuXG4gICAgdGhpcy5lbWl0KCdjb250cm9sOmV2ZW50JywgZXZlbnQubmFtZSwgZXZlbnQudmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGFuIGV2ZW50IHRvIHRoZSBjbGllbnRzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudCB0byBzZW5kLlxuICAgKiBAZW1pdHMgJ2NvbnRyb2w6ZXZlbnQnXG4gICAqL1xuICBzZW5kKG5hbWUpIHtcbiAgICBsZXQgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgIGlmIChldmVudCkge1xuICAgICAgdGhpcy5fYnJvYWRjYXN0RXZlbnQoZXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnc2VydmVyIGNvbnRyb2w6IHNlbmQgdW5rbm93biBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHZhbHVlIG9mIGEgcGFyYW1ldGVyIGFuZCBzZW5kcyBpdCB0byB0aGUgY2xpZW50cy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHsoU3RyaW5nfE51bWJlcnxCb29sZWFuKX0gdmFsdWUgTmV3IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICB1cGRhdGUobmFtZSwgdmFsdWUpIHtcbiAgICBsZXQgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX2Jyb2FkY2FzdEV2ZW50KGV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3NlcnZlciBjb250cm9sOiB1cGRhdGUgdW5rbm93biBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICBsZXQgY2xpZW50VHlwZSA9IGNsaWVudC50eXBlO1xuXG4gICAgaWYgKHRoaXMuX2NsaWVudFR5cGVzLmluZGV4T2YoY2xpZW50VHlwZSkgPCAwKVxuICAgICAgdGhpcy5fY2xpZW50VHlwZXMucHVzaChjbGllbnRUeXBlKTtcblxuICAgIC8vIGluaXQgY29udHJvbCBwYXJhbWV0ZXJzLCBpbmZvcywgYW5kIGNvbW1hbmRzIGF0IGNsaWVudFxuICAgIGNsaWVudC5yZWNlaXZlKCdjb250cm9sOnJlcXVlc3QnLCAoKSA9PiB7XG4gICAgICBjbGllbnQuc2VuZCgnY29udHJvbDppbml0JywgdGhpcy5ldmVudHMpO1xuICAgIH0pO1xuXG4gICAgLy8gbGlzdGVuIHRvIGNvbnRyb2wgcGFyYW1ldGVyc1xuICAgIGNsaWVudC5yZWNlaXZlKCdjb250cm9sOmV2ZW50JywgKG5hbWUsIHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZShuYW1lLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXJ2ZXJDb250cm9sO1xuIl19