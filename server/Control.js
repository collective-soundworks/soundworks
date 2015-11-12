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

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

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

          _server2['default'].broadcast(clientType, 'control:event', event.name, event.value);
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
      client.receive('control:request', function () {
        client.send('control:init', _this.events);
      });

      // listen to control parameters
      client.receive('control:event', function (name, value) {
        _this.update(name, value);
      });
    }
  }]);

  return Control;
})(_Module3['default']);

exports['default'] = Control;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvQ29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQW1CLFVBQVU7Ozs7dUJBQ1YsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0NSLE9BQU87WUFBUCxPQUFPOzs7Ozs7OztBQU1mLFdBTlEsT0FBTyxHQU1BO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFOTCxPQUFPOztBQU94QiwrQkFQaUIsT0FBTyw2Q0FPbEIsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUU7Ozs7OztBQU1qQyxRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzs7QUFFakIsUUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7R0FDeEI7Ozs7Ozs7Ozs7Ozs7ZUFoQmtCLE9BQU87O1dBNEJqQixtQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBc0I7VUFBcEIsV0FBVyx5REFBRyxJQUFJOztBQUM3RCxVQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHO0FBQ2xCLFlBQUksRUFBRSxRQUFRO0FBQ2QsWUFBSSxFQUFFLElBQUk7QUFDVixhQUFLLEVBQUUsS0FBSztBQUNaLFdBQUcsRUFBRSxHQUFHO0FBQ1IsV0FBRyxFQUFFLEdBQUc7QUFDUixZQUFJLEVBQUUsSUFBSTtBQUNWLGFBQUssRUFBRSxJQUFJO0FBQ1gsbUJBQVcsRUFBRSxXQUFXO09BQ3pCLENBQUM7S0FDSDs7Ozs7Ozs7Ozs7O1dBVVEsbUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFzQjtVQUFwQixXQUFXLHlEQUFHLElBQUk7O0FBQ3RELFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUc7QUFDbEIsWUFBSSxFQUFFLFFBQVE7QUFDZCxZQUFJLEVBQUUsSUFBSTtBQUNWLGFBQUssRUFBRSxLQUFL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QztPQUMxQixDQUFDLENBQUM7S0FDSjs7O1NBMUprQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiJzcmMvc2VydmVyL0NvbnRyb2wuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2VydmVyIGZyb20gJy4vc2VydmVyJztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbi8qKlxuICogVGhlIGBDb250cm9sYCBtb2R1bGUgaXMgdXNlZCB0byBjb250cm9sIGFuIGFwcGxpY2F0aW9uIHRocm91Z2ggYSBkZWRpY2F0ZWQgY2xpZW50ICh0aGF0IHdlIHVzdWFsbHkgY2FsbCBgY29uZHVjdG9yYCkuXG4gKiBUaGUgbW9kdWxlIGFsbG93cyBmb3IgZGVjbGFyaW5nIGBwYXJhbWV0ZXJzYCwgYGluZm9zYCwgYW5kIGBjb21tYW5kc2AsIHRocm91Z2ggd2hpY2ggdGhlIGBjb25kdWN0b3JgIGNhbiBjb250cm9sIGFuZCBtb25pdG9yIHRoZSBzdGF0ZSBvZiB0aGUgYXBwbGljYXRpb246XG4gKiAtIGBwYXJhbWV0ZXJzYCBhcmUgdmFsdWVzIHRoYXQgYXJlIGNoYW5nZWQgYnkgYSBjbGllbnQsIHNlbnQgdG8gdGhlIHNlcnZlciwgYW5kIHByb3BhZ2F0ZWQgdG8gdGhlIG90aGVyIGNvbm5lY3RlZCBjbGllbnRzICgqZS5nLiogdGhlIHRlbXBvIG9mIGEgbXVzaWNhbCBhcHBsaWNhdGlvbik7XG4gKiAtIGBpbmZvc2AgYXJlIHZhbHVlcyB0aGF0IGFyZSBjaGFuZ2VkIGJ5IHRoZSBzZXJ2ZXIgYW5kIHByb3BhZ2F0ZWQgdG8gdGhlIGNvbm5lY3RlZCBjbGllbnRzLCB0byBpbmZvcm0gYWJvdXQgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGFwcGxpY2F0aW9uICgqZS5nLiogdGhlIG51bWJlciBvZiBjb25uZWN0ZWQgYHBsYXllcmAgY2xpZW50cyk7XG4gKiAtIGBjb21tYW5kc2AgYXJlIG1lc3NhZ2VzICh3aXRob3V0IGFyZ3VtZW50cykgdGhhdCBhcmUgc2VuZCBmcm9tIHRoZSBjbGllbnQgdG8gdGhlIHNlcnZlciAoKmUuZy4qIGBzdGFydGAsIGBzdG9wYCBvciBgY2xlYXJgIOKAlCB3aGF0ZXZlciB0aGV5IHdvdWxkIG1lYW4gZm9yIGEgZ2l2ZW4gYXBwbGljYXRpb24pIHdoaWNoIGRvZXMgdGhlIG5lY2Vzc2FyeSB1cG9uIHJlY2VwdGlvbi5cbiAqXG4gKiBPcHRpb25hbGx5LCB0aGUge0BsaW5rIENsaWVudENvbnRyb2x9IG1vZHVsZSBjYW4gYXV0b21hdGljYWxseSBjb25zdHJ1Y3QgYSBzaW1wbGUgaW50ZXJmYWNlIGZyb20gdGhlIGxpc3Qgb2YgZGVjbGFyZWQgY29udHJvbHMgdGhhdCBhbGxvd3MgdG8gY2hhbmdlIGBwYXJhbWV0ZXJzYCwgZGlzcGxheSBgaW5mb3NgLCBhbmQgc2VuZCBgY29tbWFuZHNgIHRvIHRoZSBzZXJ2ZXIuXG4gKlxuICogVGhlIGNvbnRyb2xzIG9mIGRpZmZlcmVudCB0eXBlcyBhcmUgZGVjbGFyZWQgb24gdGhlIHNlcnZlciBzaWRlIGFuZCBwcm9wYWdhdGVkIHRvIHRoZSBjbGllbnQgc2lkZSB3aGVuIGEgY2xpZW50IGlzIHNldCB1cC5cbiAqXG4gKiBUaGUge0BsaW5rIENvbnRyb2x9IHRha2VzIGNhcmUgb2YgdGhlIHBhcmFtZXRlcnMgYW5kIGNvbW1hbmRzIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAqIFRvIHNldCB1cCBjb250cm9scyBpbiBhIHNjZW5hcmlvLCB5b3Ugc2hvdWxkIGV4dGVuZCB0aGlzIGNsYXNzIG9uIHRoZSBzZXJ2ZXIgc2lkZSBhbmQgZGVjbGFyZSB0aGUgY29udHJvbHMgc3BlY2lmaWMgdG8gdGhhdCBzY2VuYXJpbyB3aXRoIHRoZSBhcHByb3ByaWF0ZSBtZXRob2RzLlxuICogQGV4YW1wbGVcbiAqIGNsYXNzIENvbnRyb2wgZXh0ZW5kcyBDb250cm9sIHtcbiAqICAgY29uc3RydWN0b3IobmFtZUFycmF5KSB7XG4gKiAgICAgc3VwZXIoKTtcbiAqXG4gKiAgICAgLy8gSW5mbyBjb3JyZXNwb25kaW5nIHRvIHRoZSBudW1iZXIgb2YgcGxheWVyc1xuICogICAgIHRoaXMuYWRkSW5mbygnbnVtUGxheWVycycsICdOdW1iZXIgb2YgcGxheWVycycsIDApO1xuICogICAgIC8vIE51bWJlciBwYXJhbWV0ZXIgY29ycmVzcG9uZGluZyB0byB0aGUgb3V0cHV0IGdhaW4gb2YgdGhlIHBsYXllcnNcbiAqICAgICB0aGlzLmFkZE51bWJlcignZ2FpbicsICdHbG9iYWwgZ2FpbicsIDAsIDEsIDAuMSwgMSk7XG4gKiAgICAgLy8gU2VsZWN0IHBhcmFtZXRlciBjb3JyZXNwb25kaW5nIHRvIHRoZSBzdGF0ZSBvZiB0aGUgcGVyZm9ybWFuY2VcbiAqICAgICB0aGlzLmFkZFNlbGVjdCgnc3RhdGUnLCAnU3RhdGUnLCBbJ2lkbGUnLCAncGxheWluZyddLCAnaWRsZScpO1xuICogICAgIC8vIENvbW1hbmQgdG8gcmVsb2FkIHRoZSBwYWdlIG9uIGFsbCB0aGUgY2xpZW50c1xuICogICAgIHRoaXMuYWRkQ29tbWFuZCgncmVsb2FkJywgJ1JlbG9hZCB0aGUgcGFnZSBvZiBhbGwgdGhlIGNsaWVudHMnKTtcbiAqICAgfVxuICogfVxuICpcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgQ29udHJvbChndWlyb05hbWVzLCBzb3VuZGZpZWxkTmFtZXMpO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250cm9sIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdjb250cm9sJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdjb250cm9sJyk7XG5cbiAgICAvKipcbiAgICAgKiBEaWN0aW9uYXJ5IG9mIGFsbCB0aGUgZXZlbnRzLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcblxuICAgIHRoaXMuX2NsaWVudFR5cGVzID0gW107XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG51bWJlciBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG1pbiBNaW5pbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtYXggTWF4aW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc3RlcCBTdGVwIHRvIGluY3JlYXNlIG9yIGRlY3JlYXNlIHRoZSBwYXJhbWV0ZXIgdmFsdWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbml0IEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGROdW1iZXIobmFtZSwgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICB0aGlzLmV2ZW50c1tuYW1lXSA9IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgIG1pbjogbWluLFxuICAgICAgbWF4OiBtYXgsXG4gICAgICBzdGVwOiBzdGVwLFxuICAgICAgdmFsdWU6IGluaXQsXG4gICAgICBjbGllbnRUeXBlczogY2xpZW50VHlwZXNcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBzZWxlY3QgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IG9wdGlvbnMgQXJyYXkgb2YgdGhlIGRpZmZlcmVudCB2YWx1ZXMgdGhlIHBhcmFtZXRlciBjYW4gdGFrZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluaXQgSW5pdGlhbCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyIChoYXMgdG8gYmUgaW4gdGhlIGBvcHRpb25zYCBhcnJheSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkU2VsZWN0KG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICB0aGlzLmV2ZW50c1tuYW1lXSA9IHtcbiAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICB2YWx1ZTogaW5pdCxcbiAgICAgIGNsaWVudFR5cGVzOiBjbGllbnRUeXBlc1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBpbmZvIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5pdCBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgKGhhcyB0byBiZSBpbiB0aGUgYG9wdGlvbnNgIGFycmF5KS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGRJbmZvKG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICB0aGlzLmV2ZW50c1tuYW1lXSA9IHtcbiAgICAgIHR5cGU6ICdpbmZvJyxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBsYWJlbDogbGFiZWwsXG4gICAgICB2YWx1ZTogaW5pdCxcbiAgICAgIGNsaWVudFR5cGVzOiBjbGllbnRUeXBlc1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGNvbW1hbmQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGNvbW1hbmQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBMYWJlbCBvZiB0aGUgY29tbWFuZCAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZENvbW1hbmQobmFtZSwgbGFiZWwsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHRoaXMuZXZlbnRzW25hbWVdID0ge1xuICAgICAgdHlwZTogJ2NvbW1hbmQnLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICBjbGllbnRUeXBlczogY2xpZW50VHlwZXNcbiAgICB9O1xuICB9XG5cbiAgX2Jyb2FkY2FzdEV2ZW50KGV2ZW50KSB7XG4gICAgbGV0IGNsaWVudFR5cGVzID0gZXZlbnQuY2xpZW50VHlwZXMgfHwgdGhpcy5fY2xpZW50VHlwZXM7XG5cbiAgICAvLyBwcm9wYWdhdGUgcGFyYW1ldGVyIHRvIGNsaWVudHNcbiAgICBmb3IgKGxldCBjbGllbnRUeXBlIG9mIGNsaWVudFR5cGVzKVxuICAgICAgc2VydmVyLmJyb2FkY2FzdChjbGllbnRUeXBlLCAnY29udHJvbDpldmVudCcsIGV2ZW50Lm5hbWUsIGV2ZW50LnZhbHVlKTtcblxuICAgIHRoaXMuZW1pdCgnY29udHJvbDpldmVudCcsIGV2ZW50Lm5hbWUsIGV2ZW50LnZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhbiBldmVudCB0byB0aGUgY2xpZW50cy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnQgdG8gc2VuZC5cbiAgICogQGVtaXRzICdjb250cm9sOmV2ZW50J1xuICAgKi9cbiAgc2VuZChuYW1lKSB7XG4gICAgbGV0IGV2ZW50ID0gdGhpcy5ldmVudHNbbmFtZV07XG5cbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIHRoaXMuX2Jyb2FkY2FzdEV2ZW50KGV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3NlcnZlciBjb250cm9sOiBzZW5kIHVua25vd24gZXZlbnQgXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB2YWx1ZSBvZiBhIHBhcmFtZXRlciBhbmQgc2VuZHMgaXQgdG8gdGhlIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7KFN0cmluZ3xOdW1iZXJ8Qm9vbGVhbil9IHZhbHVlIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbHVlKSB7XG4gICAgbGV0IGV2ZW50ID0gdGhpcy5ldmVudHNbbmFtZV07XG5cbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLl9icm9hZGNhc3RFdmVudChldmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdzZXJ2ZXIgY29udHJvbDogdXBkYXRlIHVua25vd24gZXZlbnQgXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICBsZXQgY2xpZW50VHlwZSA9IGNsaWVudC50eXBlO1xuXG4gICAgaWYgKHRoaXMuX2NsaWVudFR5cGVzLmluZGV4T2YoY2xpZW50VHlwZSkgPCAwKVxuICAgICAgdGhpcy5fY2xpZW50VHlwZXMucHVzaChjbGllbnRUeXBlKTtcblxuICAgIC8vIGluaXQgY29udHJvbCBwYXJhbWV0ZXJzLCBpbmZvcywgYW5kIGNvbW1hbmRzIGF0IGNsaWVudFxuICAgIGNsaWVudC5yZWNlaXZlKCdjb250cm9sOnJlcXVlc3QnLCAoKSA9PiB7XG4gICAgICBjbGllbnQuc2VuZCgnY29udHJvbDppbml0JywgdGhpcy5ldmVudHMpO1xuICAgIH0pO1xuXG4gICAgLy8gbGlzdGVuIHRvIGNvbnRyb2wgcGFyYW1ldGVyc1xuICAgIGNsaWVudC5yZWNlaXZlKCdjb250cm9sOmV2ZW50JywgKG5hbWUsIHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZShuYW1lLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==