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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvQ29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQW1CLFVBQVU7Ozs7dUJBQ1YsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0NSLE9BQU87WUFBUCxPQUFPOzs7Ozs7OztBQU1mLFdBTlEsT0FBTyxHQU1BO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFOTCxPQUFPOztBQU94QiwrQkFQaUIsT0FBTyw2Q0FPbEIsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUU7Ozs7OztBQU1qQyxRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzs7QUFFakIsUUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7R0FDeEI7Ozs7Ozs7Ozs7Ozs7ZUFoQmtCLE9BQU87O1dBNEJqQixtQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBc0I7VUFBcEIsV0FBVyx5REFBRyxJQUFJOztBQUM3RCxVQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHO0FBQ2xCLFlBQUksRUFBRSxRQUFRO0FBQ2QsWUFBSSxFQUFFLElBQUk7QUFDVixhQUFLLEVBQUUsS0FBSztBQUNaLFdBQUcsRUFBRSxHQUFHO0FBQ1IsV0FBRyxFQUFFLEdBQUc7QUFDUixZQUFJLEVBQUUsSUFBSTtBQUNWLGFBQUssRUFBRSxJQUFJO0FBQ1gsbUJBQVcsRUFBRSxXQUFXO09BQ3pCLENBQUM7S0FDSDs7Ozs7Ozs7Ozs7O1dBVVEsbUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFzQjtVQUFwQixXQUFXLHlEQUFHLElBQUk7O0FBQ3RELFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUc7QUFDbEIsWUFBSSxFQUFFLFFBQVE7QUFDZCxZQUFJLEVBQUUsSUFBSTtBQUNWLGFBQUssRUFBRSxLQUFLO0FBQ1osZUFBTyxFQUFFLE9BQU87QUFDaEIsYUFBSyxFQUFFLElBQUk7QUFDWCxtQkFBVyxFQUFFLFdBQVc7T0FDekIsQ0FBQztLQUNIOzs7Ozs7Ozs7OztXQVNNLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFzQjtVQUFwQixXQUFXLHlEQUFHLElBQUk7O0FBQzNDLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUc7QUFDbEIsWUFBSSxFQUFFLE1BQU07QUFDWixZQUFJLEVBQUUsSUFBSTtBQUNWLGFBQUssRUFBRSxLQUFLO0FBQ1osYUFBSyxFQUFFLElBQUk7QUFDWCxtQkFBVyxFQUFFLFdBQVc7T0FDekIsQ0FBQztLQUNIOzs7Ozs7Ozs7O1dBUVMsb0JBQUMsSUFBSSxFQUFFLEtBQUssRUFBc0I7VUFBcEIsV0FBVyx5REFBRyxJQUFJOztBQUN4QyxVQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHO0FBQ2xCLFlBQUksRUFBRSxTQUFTO0FBQ2YsWUFBSSxFQUFFLElBQUk7QUFDVixhQUFLLEVBQUUsS0FBSztBQUNaLGFBQUssRUFBRSxTQUFTO0FBQ2hCLG1CQUFXLEVBQUUsV0FBVztPQUN6QixDQUFDO0tBQ0g7OztXQUVjLHlCQUFDLEtBQUssRUFBRTtBQUNyQixVQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUM7Ozs7Ozs7O0FBR3pELDBDQUF1QixXQUFXO2NBQXpCLFVBQVU7O0FBQ2pCLDhCQUFPLFNBQVMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFekUsVUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDckQ7Ozs7Ozs7OztXQU9HLGNBQUMsSUFBSSxFQUFFO0FBQ1QsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFOUIsVUFBSSxLQUFLLEVBQUU7QUFDVCxZQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQzdCLE1BQU07QUFDTCxlQUFPLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztPQUNsRTtLQUNGOzs7Ozs7Ozs7V0FPSyxnQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ2xCLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTlCLFVBQUksS0FBSyxFQUFFO0FBQ1QsYUFBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDcEIsWUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUM3QixNQUFNO0FBQ0wsZUFBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7T0FDcEU7S0FDRjs7O1dBRU0saUJBQUMsTUFBTSxFQUFFOzs7QUFDZCxpQ0F2SWlCLE9BQU8seUNBdUlWLE1BQU0sRUFBRTs7QUFFdEIsVUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQzs7QUFFN0IsVUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQzNDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDOzs7QUFHckMsWUFBTSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxZQUFNO0FBQ3RDLGNBQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLE1BQUssTUFBTSxDQUFDLENBQUM7T0FDMUMsQ0FBQyxDQUFDOzs7QUFHSCxZQUFNLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUs7QUFDL0MsY0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQzFCLENBQUMsQ0FBQztLQUNKOzs7U0F2SmtCLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6InNyYy9zZXJ2ZXIvQ29udHJvbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXInO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuLyoqXG4gKiBUaGUgYENvbnRyb2xgIG1vZHVsZSBpcyB1c2VkIHRvIGNvbnRyb2wgYW4gYXBwbGljYXRpb24gdGhyb3VnaCBhIGRlZGljYXRlZCBjbGllbnQgKHRoYXQgd2UgdXN1YWxseSBjYWxsIGBjb25kdWN0b3JgKS5cbiAqIFRoZSBtb2R1bGUgYWxsb3dzIGZvciBkZWNsYXJpbmcgYHBhcmFtZXRlcnNgLCBgaW5mb3NgLCBhbmQgYGNvbW1hbmRzYCwgdGhyb3VnaCB3aGljaCB0aGUgYGNvbmR1Y3RvcmAgY2FuIGNvbnRyb2wgYW5kIG1vbml0b3IgdGhlIHN0YXRlIG9mIHRoZSBhcHBsaWNhdGlvbjpcbiAqIC0gYHBhcmFtZXRlcnNgIGFyZSB2YWx1ZXMgdGhhdCBhcmUgY2hhbmdlZCBieSBhIGNsaWVudCwgc2VudCB0byB0aGUgc2VydmVyLCBhbmQgcHJvcGFnYXRlZCB0byB0aGUgb3RoZXIgY29ubmVjdGVkIGNsaWVudHMgKCplLmcuKiB0aGUgdGVtcG8gb2YgYSBtdXNpY2FsIGFwcGxpY2F0aW9uKTtcbiAqIC0gYGluZm9zYCBhcmUgdmFsdWVzIHRoYXQgYXJlIGNoYW5nZWQgYnkgdGhlIHNlcnZlciBhbmQgcHJvcGFnYXRlZCB0byB0aGUgY29ubmVjdGVkIGNsaWVudHMsIHRvIGluZm9ybSBhYm91dCB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgYXBwbGljYXRpb24gKCplLmcuKiB0aGUgbnVtYmVyIG9mIGNvbm5lY3RlZCBgcGxheWVyYCBjbGllbnRzKTtcbiAqIC0gYGNvbW1hbmRzYCBhcmUgbWVzc2FnZXMgKHdpdGhvdXQgYXJndW1lbnRzKSB0aGF0IGFyZSBzZW5kIGZyb20gdGhlIGNsaWVudCB0byB0aGUgc2VydmVyICgqZS5nLiogYHN0YXJ0YCwgYHN0b3BgIG9yIGBjbGVhcmAg4oCUIHdoYXRldmVyIHRoZXkgd291bGQgbWVhbiBmb3IgYSBnaXZlbiBhcHBsaWNhdGlvbikgd2hpY2ggZG9lcyB0aGUgbmVjZXNzYXJ5IHVwb24gcmVjZXB0aW9uLlxuICpcbiAqIE9wdGlvbmFsbHksIHRoZSB7QGxpbmsgQ2xpZW50Q29udHJvbH0gbW9kdWxlIGNhbiBhdXRvbWF0aWNhbGx5IGNvbnN0cnVjdCBhIHNpbXBsZSBpbnRlcmZhY2UgZnJvbSB0aGUgbGlzdCBvZiBkZWNsYXJlZCBjb250cm9scyB0aGF0IGFsbG93cyB0byBjaGFuZ2UgYHBhcmFtZXRlcnNgLCBkaXNwbGF5IGBpbmZvc2AsIGFuZCBzZW5kIGBjb21tYW5kc2AgdG8gdGhlIHNlcnZlci5cbiAqXG4gKiBUaGUgY29udHJvbHMgb2YgZGlmZmVyZW50IHR5cGVzIGFyZSBkZWNsYXJlZCBvbiB0aGUgc2VydmVyIHNpZGUgYW5kIHByb3BhZ2F0ZWQgdG8gdGhlIGNsaWVudCBzaWRlIHdoZW4gYSBjbGllbnQgaXMgc2V0IHVwLlxuICpcbiAqIFRoZSB7QGxpbmsgQ29udHJvbH0gdGFrZXMgY2FyZSBvZiB0aGUgcGFyYW1ldGVycyBhbmQgY29tbWFuZHMgb24gdGhlIHNlcnZlciBzaWRlLlxuICogVG8gc2V0IHVwIGNvbnRyb2xzIGluIGEgc2NlbmFyaW8sIHlvdSBzaG91bGQgZXh0ZW5kIHRoaXMgY2xhc3Mgb24gdGhlIHNlcnZlciBzaWRlIGFuZCBkZWNsYXJlIHRoZSBjb250cm9scyBzcGVjaWZpYyB0byB0aGF0IHNjZW5hcmlvIHdpdGggdGhlIGFwcHJvcHJpYXRlIG1ldGhvZHMuXG4gKiBAZXhhbXBsZVxuICogY2xhc3MgQ29udHJvbCBleHRlbmRzIENvbnRyb2wge1xuICogICBjb25zdHJ1Y3RvcihuYW1lQXJyYXkpIHtcbiAqICAgICBzdXBlcigpO1xuICpcbiAqICAgICAvLyBJbmZvIGNvcnJlc3BvbmRpbmcgdG8gdGhlIG51bWJlciBvZiBwbGF5ZXJzXG4gKiAgICAgdGhpcy5hZGRJbmZvKCdudW1QbGF5ZXJzJywgJ051bWJlciBvZiBwbGF5ZXJzJywgMCk7XG4gKiAgICAgLy8gTnVtYmVyIHBhcmFtZXRlciBjb3JyZXNwb25kaW5nIHRvIHRoZSBvdXRwdXQgZ2FpbiBvZiB0aGUgcGxheWVyc1xuICogICAgIHRoaXMuYWRkTnVtYmVyKCdnYWluJywgJ0dsb2JhbCBnYWluJywgMCwgMSwgMC4xLCAxKTtcbiAqICAgICAvLyBTZWxlY3QgcGFyYW1ldGVyIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHN0YXRlIG9mIHRoZSBwZXJmb3JtYW5jZVxuICogICAgIHRoaXMuYWRkU2VsZWN0KCdzdGF0ZScsICdTdGF0ZScsIFsnaWRsZScsICdwbGF5aW5nJ10sICdpZGxlJyk7XG4gKiAgICAgLy8gQ29tbWFuZCB0byByZWxvYWQgdGhlIHBhZ2Ugb24gYWxsIHRoZSBjbGllbnRzXG4gKiAgICAgdGhpcy5hZGRDb21tYW5kKCdyZWxvYWQnLCAnUmVsb2FkIHRoZSBwYWdlIG9mIGFsbCB0aGUgY2xpZW50cycpO1xuICogICB9XG4gKiB9XG4gKlxuICogY29uc3QgY29udHJvbCA9IG5ldyBDb250cm9sKGd1aXJvTmFtZXMsIHNvdW5kZmllbGROYW1lcyk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2wgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J2NvbnRyb2wnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2NvbnRyb2wnKTtcblxuICAgIC8qKlxuICAgICAqIERpY3Rpb25hcnkgb2YgYWxsIHRoZSBldmVudHMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuXG4gICAgdGhpcy5fY2xpZW50VHlwZXMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbnVtYmVyIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgTGFiZWwgb2YgdGhlIHBhcmFtZXRlciAoZGlzcGxheWVkIG9uIHRoZSBjb250cm9sIEdVSSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbWluIE1pbmltdW0gdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG1heCBNYXhpbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdGVwIFN0ZXAgdG8gaW5jcmVhc2Ugb3IgZGVjcmVhc2UgdGhlIHBhcmFtZXRlciB2YWx1ZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluaXQgSW5pdGlhbCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZE51bWJlcihuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHRoaXMuZXZlbnRzW25hbWVdID0ge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgbWluOiBtaW4sXG4gICAgICBtYXg6IG1heCxcbiAgICAgIHN0ZXA6IHN0ZXAsXG4gICAgICB2YWx1ZTogaW5pdCxcbiAgICAgIGNsaWVudFR5cGVzOiBjbGllbnRUeXBlc1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHNlbGVjdCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gb3B0aW9ucyBBcnJheSBvZiB0aGUgZGlmZmVyZW50IHZhbHVlcyB0aGUgcGFyYW1ldGVyIGNhbiB0YWtlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5pdCBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgKGhhcyB0byBiZSBpbiB0aGUgYG9wdGlvbnNgIGFycmF5KS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGRTZWxlY3QobmFtZSwgbGFiZWwsIG9wdGlvbnMsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHRoaXMuZXZlbnRzW25hbWVdID0ge1xuICAgICAgdHlwZTogJ3NlbGVjdCcsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICAgIHZhbHVlOiBpbml0LFxuICAgICAgY2xpZW50VHlwZXM6IGNsaWVudFR5cGVzXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGluZm8gcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbml0IEluaXRpYWwgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciAoaGFzIHRvIGJlIGluIHRoZSBgb3B0aW9uc2AgYXJyYXkpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZEluZm8obmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHRoaXMuZXZlbnRzW25hbWVdID0ge1xuICAgICAgdHlwZTogJ2luZm8nLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgIHZhbHVlOiBpbml0LFxuICAgICAgY2xpZW50VHlwZXM6IGNsaWVudFR5cGVzXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgY29tbWFuZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgY29tbWFuZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIExhYmVsIG9mIHRoZSBjb21tYW5kIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkQ29tbWFuZChuYW1lLCBsYWJlbCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgdGhpcy5ldmVudHNbbmFtZV0gPSB7XG4gICAgICB0eXBlOiAnY29tbWFuZCcsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgIGNsaWVudFR5cGVzOiBjbGllbnRUeXBlc1xuICAgIH07XG4gIH1cblxuICBfYnJvYWRjYXN0RXZlbnQoZXZlbnQpIHtcbiAgICBsZXQgY2xpZW50VHlwZXMgPSBldmVudC5jbGllbnRUeXBlcyB8fCB0aGlzLl9jbGllbnRUeXBlcztcblxuICAgIC8vIHByb3BhZ2F0ZSBwYXJhbWV0ZXIgdG8gY2xpZW50c1xuICAgIGZvciAobGV0IGNsaWVudFR5cGUgb2YgY2xpZW50VHlwZXMpXG4gICAgICBzZXJ2ZXIuYnJvYWRjYXN0KGNsaWVudFR5cGUsICdjb250cm9sOmV2ZW50JywgZXZlbnQubmFtZSwgZXZlbnQudmFsdWUpO1xuXG4gICAgdGhpcy5lbWl0KCdjb250cm9sOmV2ZW50JywgZXZlbnQubmFtZSwgZXZlbnQudmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGFuIGV2ZW50IHRvIHRoZSBjbGllbnRzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudCB0byBzZW5kLlxuICAgKiBAZW1pdHMgJ2NvbnRyb2w6ZXZlbnQnXG4gICAqL1xuICBzZW5kKG5hbWUpIHtcbiAgICBsZXQgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgIGlmIChldmVudCkge1xuICAgICAgdGhpcy5fYnJvYWRjYXN0RXZlbnQoZXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnc2VydmVyIGNvbnRyb2w6IHNlbmQgdW5rbm93biBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHZhbHVlIG9mIGEgcGFyYW1ldGVyIGFuZCBzZW5kcyBpdCB0byB0aGUgY2xpZW50cy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHsoU3RyaW5nfE51bWJlcnxCb29sZWFuKX0gdmFsdWUgTmV3IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICB1cGRhdGUobmFtZSwgdmFsdWUpIHtcbiAgICBsZXQgZXZlbnQgPSB0aGlzLmV2ZW50c1tuYW1lXTtcblxuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX2Jyb2FkY2FzdEV2ZW50KGV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3NlcnZlciBjb250cm9sOiB1cGRhdGUgdW5rbm93biBldmVudCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICBsZXQgY2xpZW50VHlwZSA9IGNsaWVudC50eXBlO1xuXG4gICAgaWYgKHRoaXMuX2NsaWVudFR5cGVzLmluZGV4T2YoY2xpZW50VHlwZSkgPCAwKVxuICAgICAgdGhpcy5fY2xpZW50VHlwZXMucHVzaChjbGllbnRUeXBlKTtcblxuICAgIC8vIGluaXQgY29udHJvbCBwYXJhbWV0ZXJzLCBpbmZvcywgYW5kIGNvbW1hbmRzIGF0IGNsaWVudFxuICAgIGNsaWVudC5yZWNlaXZlKCdjb250cm9sOnJlcXVlc3QnLCAoKSA9PiB7XG4gICAgICBjbGllbnQuc2VuZCgnY29udHJvbDppbml0JywgdGhpcy5ldmVudHMpO1xuICAgIH0pO1xuXG4gICAgLy8gbGlzdGVuIHRvIGNvbnRyb2wgcGFyYW1ldGVyc1xuICAgIGNsaWVudC5yZWNlaXZlKCdjb250cm9sOmV2ZW50JywgKG5hbWUsIHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZShuYW1lLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuIl19