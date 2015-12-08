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
   * @param {String[]} [options.labels=null] List of predefined labels).
   * @param {Array[]} [options.coordinates=null] List of predefined coordinates given as [x:Number, y:Number].
   * @param {Number} [options.capacity=Infinity] Maximum number of places allowed (may be limited by the number of predefined labels and/or coordinates).
   */

  function ServerPlacer(options) {
    _classCallCheck(this, ServerPlacer);

    _get(Object.getPrototypeOf(ServerPlacer.prototype), 'constructor', this).call(this, options.name || 'placer');

    /**
     * List of predefined labels.
     * @type {String[]}
     */
    this.labels = options.labels;

    /**
     * List of predefined coordinates.
     * @type {Array[]}
     */
    this.coordinates = options.coordinates;

    /**
     * Maximum number of clients supported.
     * @type {Number}
     */
    this.capacity = options.capacity || maxCapacity;

    if (this.capacity > maxCapacity) this.capacity = maxCapacity;

    /**
     * List of the clients checked in with corresponing indices.
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
        var labels = _this.labels;
        var coordinates = mode === 'graphic' ? _this.coordinates : undefined;
        var capacity = _this.capacity;
        _this.send(client, 'acknowledge', labels, coordinates, capacity);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyUGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBQXlCLGdCQUFnQjs7OztBQUV6QyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUM7Ozs7Ozs7O0lBT0osWUFBWTtZQUFaLFlBQVk7Ozs7Ozs7Ozs7O0FBU3BCLFdBVFEsWUFBWSxDQVNuQixPQUFPLEVBQUU7MEJBVEYsWUFBWTs7QUFVN0IsK0JBVmlCLFlBQVksNkNBVXZCLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFOzs7Ozs7QUFNaEMsUUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDOzs7Ozs7QUFNN0IsUUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDOzs7Ozs7QUFNdkMsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLFdBQVcsQ0FBQzs7QUFFaEQsUUFBRyxJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsRUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUM7Ozs7OztBQU05QixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztHQUNuQjs7Ozs7O2VBdENrQixZQUFZOztXQTJDeEIsaUJBQUMsTUFBTSxFQUFFOzs7QUFDZCxpQ0E1Q2lCLFlBQVkseUNBNENmLE1BQU0sRUFBRTs7QUFFdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFVBQUMsSUFBSSxFQUFLO0FBQ3hDLFlBQUksTUFBTSxHQUFHLE1BQUssTUFBTSxDQUFDO0FBQ3pCLFlBQUksV0FBVyxHQUFHLEFBQUMsSUFBSSxLQUFLLFNBQVMsR0FBRyxNQUFLLFdBQVcsR0FBRSxTQUFTLENBQUM7QUFDcEUsWUFBSSxRQUFRLEdBQUcsTUFBSyxRQUFRLENBQUM7QUFDN0IsY0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO09BQ2pFLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBSztBQUN6RCxjQUFNLENBQUMsT0FBTyxDQUFDLE1BQUssSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUN4QyxjQUFNLENBQUMsT0FBTyxDQUFDLE1BQUssSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUN4QyxjQUFNLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQzs7QUFFNUIsY0FBSyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDO09BQzlCLENBQUMsQ0FBQztLQUNKOzs7Ozs7O1dBS1Msb0JBQUMsTUFBTSxFQUFFO0FBQ2pCLGlDQWxFaUIsWUFBWSw0Q0FrRVosTUFBTSxFQUFFOztBQUV6QixVQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7O0FBRTlDLFVBQUksS0FBSyxJQUFJLENBQUMsRUFDWixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDOUI7OztTQXhFa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoic3JjL3NlcnZlci9TZXJ2ZXJQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyTW9kdWxlIGZyb20gJy4vU2VydmVyTW9kdWxlJztcblxuY29uc3QgbWF4Q2FwYWNpdHkgPSA5OTk5O1xuXG4vKipcbiAqIFtzZXJ2ZXJdIEFsbG93IHRvIHNlbGVjdCBhIHBsYWNlIHdpdGhpbiBhIHNldCBvZiBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoaS5lLiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50UGxhY2VyLmpzfkNsaWVudFBsYWNlcn0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyUGxhY2VyIGV4dGVuZHMgU2VydmVyTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5uYW1lPSdwbGFjZXInXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtvcHRpb25zLmxhYmVscz1udWxsXSBMaXN0IG9mIHByZWRlZmluZWQgbGFiZWxzKS5cbiAgICogQHBhcmFtIHtBcnJheVtdfSBbb3B0aW9ucy5jb29yZGluYXRlcz1udWxsXSBMaXN0IG9mIHByZWRlZmluZWQgY29vcmRpbmF0ZXMgZ2l2ZW4gYXMgW3g6TnVtYmVyLCB5Ok51bWJlcl0uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5jYXBhY2l0eT1JbmZpbml0eV0gTWF4aW11bSBudW1iZXIgb2YgcGxhY2VzIGFsbG93ZWQgKG1heSBiZSBsaW1pdGVkIGJ5IHRoZSBudW1iZXIgb2YgcHJlZGVmaW5lZCBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3BsYWNlcicpO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBwcmVkZWZpbmVkIGxhYmVscy5cbiAgICAgKiBAdHlwZSB7U3RyaW5nW119XG4gICAgICovXG4gICAgdGhpcy5sYWJlbHMgPSBvcHRpb25zLmxhYmVscztcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgcHJlZGVmaW5lZCBjb29yZGluYXRlcy5cbiAgICAgKiBAdHlwZSB7QXJyYXlbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gb3B0aW9ucy5jb29yZGluYXRlcztcblxuICAgIC8qKlxuICAgICAqIE1heGltdW0gbnVtYmVyIG9mIGNsaWVudHMgc3VwcG9ydGVkLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5jYXBhY2l0eSA9IG9wdGlvbnMuY2FwYWNpdHkgfHwgbWF4Q2FwYWNpdHk7XG5cbiAgICBpZih0aGlzLmNhcGFjaXR5ID4gbWF4Q2FwYWNpdHkpXG4gICAgICB0aGlzLmNhcGFjaXR5ID0gbWF4Q2FwYWNpdHk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBjbGllbnRzIGNoZWNrZWQgaW4gd2l0aCBjb3JyZXNwb25pbmcgaW5kaWNlcy5cbiAgICAgKiBAdHlwZSB7Q2xpZW50W119XG4gICAgICovXG4gICAgdGhpcy5jbGllbnRzID0gW107XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCAobW9kZSkgPT4ge1xuICAgICAgbGV0IGxhYmVscyA9IHRoaXMubGFiZWxzO1xuICAgICAgbGV0IGNvb3JkaW5hdGVzID0gKG1vZGUgPT09ICdncmFwaGljJyk/IHRoaXMuY29vcmRpbmF0ZXM6IHVuZGVmaW5lZDtcbiAgICAgIGxldCBjYXBhY2l0eSA9IHRoaXMuY2FwYWNpdHk7XG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCAnYWNrbm93bGVkZ2UnLCBsYWJlbHMsIGNvb3JkaW5hdGVzLCBjYXBhY2l0eSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncG9zaXRpb24nLCAoaW5kZXgsIGxhYmVsLCBjb29yZHMpID0+IHtcbiAgICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0uaW5kZXggPSBpbmRleDtcbiAgICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0ubGFiZWwgPSBsYWJlbDtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkcztcblxuICAgICAgdGhpcy5jbGllbnRzW2luZGV4XSA9IGNsaWVudDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG5cbiAgICBjb25zdCBpbmRleCA9IGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0uaW5kZXg7XG5cbiAgICBpZiAoaW5kZXggPj0gMClcbiAgICAgIGRlbGV0ZSB0aGlzLmNsaWVudHNbaW5kZXhdO1xuICB9XG59XG4iXX0=