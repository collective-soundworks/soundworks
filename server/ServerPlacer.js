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

var maxCapacity = 9999;

/**
 * [server] Allow to select a place within a set of predefined positions (i.e. labels and/or coordinates).
 *
 * (See also {@link src/client/ClientPlacer.js~ClientPlacer} on the client side.)
 */

var ServerPlacer = (function (_ServerModule) {
  _inherits(ServerPlacer, _ServerModule);

  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='placer'] Name of the module.
   * @param {Object} [options.setup] Setup defining dimensions and predefined positions (labels and/or coordinates).
   * @param {String[]} [options.setup.width] Width of the setup.
   * @param {String[]} [options.setup.height] Height of the setup.
   * @param {String[]} [options.setup.background] Background (image) of the setup.
   * @param {String[]} [options.setup.labels] List of predefined labels.
   * @param {Array[]} [options.setup.coordinates] List of predefined coordinates given as an array `[x:Number, y:Number]`.
   * @param {Number} [options.capacity=Infinity] Maximum number of places (may limit or be limited by the number of labels and/or coordinates defined by the setup).
   */

  function ServerPlacer(options) {
    _classCallCheck(this, ServerPlacer);

    _get(Object.getPrototypeOf(ServerPlacer.prototype), 'constructor', this).call(this, options.name || 'placer');

    /**
     * Setup defining dimensions and predefined positions (labels and/or coordinates).
     * @type {Object}
     */
    this.setup = options.setup;

    /**
     * Maximum number of places.
     * @type {Number}
     */
    this.capacity = getOpt(options.capacity, Infinity, 1);

    var setup = options.setup;

    if (setup) {
      var numLabels = setup.labels ? setup.labels.length : Infinity;
      var numCoordinates = setup.coordinates ? setup.coordinates.length : Infinity;
      var numPositions = Math.min(numLabels, numCoordinates);

      if (this.capacity > numPositions) this.capacity = numPositions;
    }

    if (this.capacity > maxCapacity) this.capacity = maxCapacity;

    /**
     * List of clients checked in with corresponing indices.
     * @type {Client[]}
     */
    this.clients = [];
  }

  /**
   * @private
   */

  _createClass(ServerPlacer, [{
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(ServerPlacer.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', function (mode) {
        var surface = undefined;
        var labels = undefined;
        var coordinates = null;
        var capacity = _this.capacity;
        var setup = _this.setup;

        if (setup) {
          labels = setup.labels;

          if (mode === 'graphic') {
            coordinates = setup.coordinates;

            surface = {
              width: setup.width,
              height: setup.height,
              background: setup.background
            };
          }
        }

        _this.send(client, 'setup', capacity, labels, coordinates, surface);
      });

      this.receive(client, 'position', function (index, label, coords) {
        client.modules[_this.name].index = index;
        client.modules[_this.name].label = label;
        client.coordinates = coords;

        _this.clients[index] = client;
      });
    }

    /**
     * @private
     */
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      _get(Object.getPrototypeOf(ServerPlacer.prototype), 'disconnect', this).call(this, client);

      var index = client.modules[this.name].index;

      if (index >= 0) delete this.clients[index];
    }
  }]);

  return ServerPlacer;
})(_ServerModule3['default']);

exports['default'] = ServerPlacer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyUGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBQXlCLGdCQUFnQjs7OztBQUV6QyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUM7Ozs7Ozs7O0lBT0osWUFBWTtZQUFaLFlBQVk7Ozs7Ozs7Ozs7Ozs7OztBQWFwQixXQWJRLFlBQVksQ0FhbkIsT0FBTyxFQUFFOzBCQWJGLFlBQVk7O0FBYzdCLCtCQWRpQixZQUFZLDZDQWN2QixPQUFPLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRTs7Ozs7O0FBTWhDLFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQzs7Ozs7O0FBTTNCLFFBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUV0RCxRQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDOztBQUU1QixRQUFHLEtBQUssRUFBRTtBQUNSLFVBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBQ2hFLFVBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBQy9FLFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDOztBQUV6RCxVQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxFQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQztLQUNoQzs7QUFFRCxRQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxFQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQzs7Ozs7O0FBTTlCLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0dBQ25COzs7Ozs7ZUEvQ2tCLFlBQVk7O1dBb0R4QixpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQXJEaUIsWUFBWSx5Q0FxRGYsTUFBTSxFQUFFOztBQUV0QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsVUFBQyxJQUFJLEVBQUs7QUFDeEMsWUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQ3hCLFlBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN2QixZQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDdkIsWUFBSSxRQUFRLEdBQUcsTUFBSyxRQUFRLENBQUM7QUFDN0IsWUFBSSxLQUFLLEdBQUcsTUFBSyxLQUFLLENBQUM7O0FBRXZCLFlBQUcsS0FBSyxFQUFFO0FBQ1IsZ0JBQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDOztBQUV0QixjQUFHLElBQUksS0FBSyxTQUFTLEVBQUU7QUFDckIsdUJBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOztBQUVoQyxtQkFBTyxHQUFHO0FBQ1IsbUJBQUssRUFBRSxLQUFLLENBQUMsS0FBSztBQUNsQixvQkFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO0FBQ3BCLHdCQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7YUFDN0IsQ0FBQTtXQUNGO1NBQ0Y7O0FBRUQsY0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztPQUNwRSxDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUs7QUFDekQsY0FBTSxDQUFDLE9BQU8sQ0FBQyxNQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDeEMsY0FBTSxDQUFDLE9BQU8sQ0FBQyxNQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDeEMsY0FBTSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7O0FBRTVCLGNBQUssT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQztPQUM5QixDQUFDLENBQUM7S0FDSjs7Ozs7OztXQUtTLG9CQUFDLE1BQU0sRUFBRTtBQUNqQixpQ0E1RmlCLFlBQVksNENBNEZaLE1BQU0sRUFBRTs7QUFFekIsVUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDOztBQUU5QyxVQUFJLEtBQUssSUFBSSxDQUFDLEVBQ1osT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzlCOzs7U0FsR2tCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU2VydmVyUGxhY2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlck1vZHVsZSBmcm9tICcuL1NlcnZlck1vZHVsZSc7XG5cbmNvbnN0IG1heENhcGFjaXR5ID0gOTk5OTtcblxuLyoqXG4gKiBbc2VydmVyXSBBbGxvdyB0byBzZWxlY3QgYSBwbGFjZSB3aXRoaW4gYSBzZXQgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGkuZS4gbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudFBsYWNlci5qc35DbGllbnRQbGFjZXJ9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlclBsYWNlciBleHRlbmRzIFNlcnZlck1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubmFtZT0ncGxhY2VyJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuc2V0dXBdIFNldHVwIGRlZmluaW5nIGRpbWVuc2lvbnMgYW5kIHByZWRlZmluZWQgcG9zaXRpb25zIChsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW29wdGlvbnMuc2V0dXAud2lkdGhdIFdpZHRoIG9mIHRoZSBzZXR1cC5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW29wdGlvbnMuc2V0dXAuaGVpZ2h0XSBIZWlnaHQgb2YgdGhlIHNldHVwLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbb3B0aW9ucy5zZXR1cC5iYWNrZ3JvdW5kXSBCYWNrZ3JvdW5kIChpbWFnZSkgb2YgdGhlIHNldHVwLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbb3B0aW9ucy5zZXR1cC5sYWJlbHNdIExpc3Qgb2YgcHJlZGVmaW5lZCBsYWJlbHMuXG4gICAqIEBwYXJhbSB7QXJyYXlbXX0gW29wdGlvbnMuc2V0dXAuY29vcmRpbmF0ZXNdIExpc3Qgb2YgcHJlZGVmaW5lZCBjb29yZGluYXRlcyBnaXZlbiBhcyBhbiBhcnJheSBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY2FwYWNpdHk9SW5maW5pdHldIE1heGltdW0gbnVtYmVyIG9mIHBsYWNlcyAobWF5IGxpbWl0IG9yIGJlIGxpbWl0ZWQgYnkgdGhlIG51bWJlciBvZiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzIGRlZmluZWQgYnkgdGhlIHNldHVwKS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3BsYWNlcicpO1xuXG4gICAgLyoqXG4gICAgICogU2V0dXAgZGVmaW5pbmcgZGltZW5zaW9ucyBhbmQgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5zZXR1cCA9IG9wdGlvbnMuc2V0dXA7XG5cbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIG51bWJlciBvZiBwbGFjZXMuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmNhcGFjaXR5ID0gZ2V0T3B0KG9wdGlvbnMuY2FwYWNpdHksIEluZmluaXR5LCAxKTtcblxuICAgIGNvbnN0IHNldHVwID0gb3B0aW9ucy5zZXR1cDtcblxuICAgIGlmKHNldHVwKSB7XG4gICAgICBjb25zdCBudW1MYWJlbHMgPSBzZXR1cC5sYWJlbHMgPyBzZXR1cC5sYWJlbHMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Db29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzID8gc2V0dXAuY29vcmRpbmF0ZXMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcblxuICAgICAgaWYodGhpcy5jYXBhY2l0eSA+IG51bVBvc2l0aW9ucylcbiAgICAgICAgdGhpcy5jYXBhY2l0eSA9IG51bVBvc2l0aW9ucztcbiAgICB9XG5cbiAgICBpZih0aGlzLmNhcGFjaXR5ID4gbWF4Q2FwYWNpdHkpXG4gICAgICB0aGlzLmNhcGFjaXR5ID0gbWF4Q2FwYWNpdHk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIGNsaWVudHMgY2hlY2tlZCBpbiB3aXRoIGNvcnJlc3BvbmluZyBpbmRpY2VzLlxuICAgICAqIEB0eXBlIHtDbGllbnRbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIChtb2RlKSA9PiB7XG4gICAgICBsZXQgc3VyZmFjZSA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCBsYWJlbHMgPSB1bmRlZmluZWQ7XG4gICAgICBsZXQgY29vcmRpbmF0ZXMgPSBudWxsO1xuICAgICAgbGV0IGNhcGFjaXR5ID0gdGhpcy5jYXBhY2l0eTtcbiAgICAgIGxldCBzZXR1cCA9IHRoaXMuc2V0dXA7XG5cbiAgICAgIGlmKHNldHVwKSB7XG4gICAgICAgIGxhYmVscyA9IHNldHVwLmxhYmVscztcblxuICAgICAgICBpZihtb2RlID09PSAnZ3JhcGhpYycpIHtcbiAgICAgICAgICBjb29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzO1xuXG4gICAgICAgICAgc3VyZmFjZSA9IHtcbiAgICAgICAgICAgIHdpZHRoOiBzZXR1cC53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogc2V0dXAuaGVpZ2h0LFxuICAgICAgICAgICAgYmFja2dyb3VuZDogc2V0dXAuYmFja2dyb3VuZCxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3NldHVwJywgY2FwYWNpdHksIGxhYmVscywgY29vcmRpbmF0ZXMsIHN1cmZhY2UpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3Bvc2l0aW9uJywgKGluZGV4LCBsYWJlbCwgY29vcmRzKSA9PiB7XG4gICAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmluZGV4ID0gaW5kZXg7XG4gICAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmxhYmVsID0gbGFiZWw7XG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZHM7XG5cbiAgICAgIHRoaXMuY2xpZW50c1tpbmRleF0gPSBjbGllbnQ7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuXG4gICAgY29uc3QgaW5kZXggPSBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmluZGV4O1xuXG4gICAgaWYgKGluZGV4ID49IDApXG4gICAgICBkZWxldGUgdGhpcy5jbGllbnRzW2luZGV4XTtcbiAgfVxufVxuIl19