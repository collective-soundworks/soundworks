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

var _utilsHelpers = require('../utils/helpers');

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

  function ServerPlacer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
    this.capacity = (0, _utilsHelpers.getOpt)(options.capacity, Infinity, 1);

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
        var capacity = _this.capacity;
        var setup = _this.setup;
        var area = undefined;
        var labels = undefined;
        var coordinates = undefined;

        if (setup) {
          labels = setup.labels;

          if (mode === 'graphic') {
            coordinates = setup.coordinates;

            area = {
              width: setup.width,
              height: setup.height,
              background: setup.background
            };
          }
        }

        _this.send(client, 'setup', capacity, labels, coordinates, area);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyUGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBQXlCLGdCQUFnQjs7Ozs0QkFDbEIsa0JBQWtCOztBQUV6QyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUM7Ozs7Ozs7O0lBT0osWUFBWTtZQUFaLFlBQVk7Ozs7Ozs7Ozs7Ozs7OztBQWFwQixXQWJRLFlBQVksR0FhTDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBYkwsWUFBWTs7QUFjN0IsK0JBZGlCLFlBQVksNkNBY3ZCLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFOzs7Ozs7QUFNaEMsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDOzs7Ozs7QUFNM0IsUUFBSSxDQUFDLFFBQVEsR0FBRywwQkFBTyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFdEQsUUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQzs7QUFFNUIsUUFBRyxLQUFLLEVBQUU7QUFDUixVQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztBQUNoRSxVQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztBQUMvRSxVQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQzs7QUFFekQsVUFBRyxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksRUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUM7S0FDaEM7O0FBRUQsUUFBRyxJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsRUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUM7Ozs7OztBQU05QixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztHQUNuQjs7Ozs7O2VBL0NrQixZQUFZOztXQW9EeEIsaUJBQUMsTUFBTSxFQUFFOzs7QUFDZCxpQ0FyRGlCLFlBQVkseUNBcURmLE1BQU0sRUFBRTs7QUFFdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFVBQUMsSUFBSSxFQUFLO0FBQ3hDLFlBQU0sUUFBUSxHQUFHLE1BQUssUUFBUSxDQUFDO0FBQy9CLFlBQU0sS0FBSyxHQUFHLE1BQUssS0FBSyxDQUFDO0FBQ3pCLFlBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUNyQixZQUFJLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDdkIsWUFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDOztBQUU1QixZQUFJLEtBQUssRUFBRTtBQUNULGdCQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQzs7QUFFdEIsY0FBSSxJQUFJLEtBQUssU0FBUyxFQUFFO0FBQ3RCLHVCQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7QUFFaEMsZ0JBQUksR0FBRztBQUNMLG1CQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7QUFDbEIsb0JBQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtBQUNwQix3QkFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO2FBQzdCLENBQUE7V0FDRjtTQUNGOztBQUVELGNBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDakUsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFLO0FBQ3pELGNBQU0sQ0FBQyxPQUFPLENBQUMsTUFBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3hDLGNBQU0sQ0FBQyxPQUFPLENBQUMsTUFBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3hDLGNBQU0sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDOztBQUU1QixjQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUM7T0FDOUIsQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7V0FLUyxvQkFBQyxNQUFNLEVBQUU7QUFDakIsaUNBNUZpQixZQUFZLDRDQTRGWixNQUFNLEVBQUU7O0FBRXpCLFVBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQzs7QUFFOUMsVUFBSSxLQUFLLElBQUksQ0FBQyxFQUNaLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUM5Qjs7O1NBbEdrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiJzcmMvc2VydmVyL1NlcnZlclBsYWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJNb2R1bGUgZnJvbSAnLi9TZXJ2ZXJNb2R1bGUnO1xuaW1wb3J0IHsgZ2V0T3B0IH0gZnJvbSAnLi4vdXRpbHMvaGVscGVycyc7XG5cbmNvbnN0IG1heENhcGFjaXR5ID0gOTk5OTtcblxuLyoqXG4gKiBbc2VydmVyXSBBbGxvdyB0byBzZWxlY3QgYSBwbGFjZSB3aXRoaW4gYSBzZXQgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGkuZS4gbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudFBsYWNlci5qc35DbGllbnRQbGFjZXJ9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlclBsYWNlciBleHRlbmRzIFNlcnZlck1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubmFtZT0ncGxhY2VyJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuc2V0dXBdIFNldHVwIGRlZmluaW5nIGRpbWVuc2lvbnMgYW5kIHByZWRlZmluZWQgcG9zaXRpb25zIChsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW29wdGlvbnMuc2V0dXAud2lkdGhdIFdpZHRoIG9mIHRoZSBzZXR1cC5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW29wdGlvbnMuc2V0dXAuaGVpZ2h0XSBIZWlnaHQgb2YgdGhlIHNldHVwLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbb3B0aW9ucy5zZXR1cC5iYWNrZ3JvdW5kXSBCYWNrZ3JvdW5kIChpbWFnZSkgb2YgdGhlIHNldHVwLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbb3B0aW9ucy5zZXR1cC5sYWJlbHNdIExpc3Qgb2YgcHJlZGVmaW5lZCBsYWJlbHMuXG4gICAqIEBwYXJhbSB7QXJyYXlbXX0gW29wdGlvbnMuc2V0dXAuY29vcmRpbmF0ZXNdIExpc3Qgb2YgcHJlZGVmaW5lZCBjb29yZGluYXRlcyBnaXZlbiBhcyBhbiBhcnJheSBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY2FwYWNpdHk9SW5maW5pdHldIE1heGltdW0gbnVtYmVyIG9mIHBsYWNlcyAobWF5IGxpbWl0IG9yIGJlIGxpbWl0ZWQgYnkgdGhlIG51bWJlciBvZiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzIGRlZmluZWQgYnkgdGhlIHNldHVwKS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAncGxhY2VyJyk7XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCBkZWZpbmluZyBkaW1lbnNpb25zIGFuZCBwcmVkZWZpbmVkIHBvc2l0aW9ucyAobGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnNldHVwID0gb3B0aW9ucy5zZXR1cDtcblxuICAgIC8qKlxuICAgICAqIE1heGltdW0gbnVtYmVyIG9mIHBsYWNlcy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuY2FwYWNpdHkgPSBnZXRPcHQob3B0aW9ucy5jYXBhY2l0eSwgSW5maW5pdHksIDEpO1xuXG4gICAgY29uc3Qgc2V0dXAgPSBvcHRpb25zLnNldHVwO1xuXG4gICAgaWYoc2V0dXApIHtcbiAgICAgIGNvbnN0IG51bUxhYmVscyA9IHNldHVwLmxhYmVscyA/IHNldHVwLmxhYmVscy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bUNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXMgPyBzZXR1cC5jb29yZGluYXRlcy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bVBvc2l0aW9ucyA9IE1hdGgubWluKG51bUxhYmVscywgbnVtQ29vcmRpbmF0ZXMpO1xuXG4gICAgICBpZih0aGlzLmNhcGFjaXR5ID4gbnVtUG9zaXRpb25zKVxuICAgICAgICB0aGlzLmNhcGFjaXR5ID0gbnVtUG9zaXRpb25zO1xuICAgIH1cblxuICAgIGlmKHRoaXMuY2FwYWNpdHkgPiBtYXhDYXBhY2l0eSlcbiAgICAgIHRoaXMuY2FwYWNpdHkgPSBtYXhDYXBhY2l0eTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgY2xpZW50cyBjaGVja2VkIGluIHdpdGggY29ycmVzcG9uaW5nIGluZGljZXMuXG4gICAgICogQHR5cGUge0NsaWVudFtdfVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgKG1vZGUpID0+IHtcbiAgICAgIGNvbnN0IGNhcGFjaXR5ID0gdGhpcy5jYXBhY2l0eTtcbiAgICAgIGNvbnN0IHNldHVwID0gdGhpcy5zZXR1cDtcbiAgICAgIGxldCBhcmVhID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IGxhYmVscyA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCBjb29yZGluYXRlcyA9IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHNldHVwKSB7XG4gICAgICAgIGxhYmVscyA9IHNldHVwLmxhYmVscztcblxuICAgICAgICBpZiAobW9kZSA9PT0gJ2dyYXBoaWMnKSB7XG4gICAgICAgICAgY29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcztcblxuICAgICAgICAgIGFyZWEgPSB7XG4gICAgICAgICAgICB3aWR0aDogc2V0dXAud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHNldHVwLmhlaWdodCxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHNldHVwLmJhY2tncm91bmQsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdzZXR1cCcsIGNhcGFjaXR5LCBsYWJlbHMsIGNvb3JkaW5hdGVzLCBhcmVhKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdwb3NpdGlvbicsIChpbmRleCwgbGFiZWwsIGNvb3JkcykgPT4ge1xuICAgICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5pbmRleCA9IGluZGV4O1xuICAgICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5sYWJlbCA9IGxhYmVsO1xuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRzO1xuXG4gICAgICB0aGlzLmNsaWVudHNbaW5kZXhdID0gY2xpZW50O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIGNvbnN0IGluZGV4ID0gY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5pbmRleDtcblxuICAgIGlmIChpbmRleCA+PSAwKVxuICAgICAgZGVsZXRlIHRoaXMuY2xpZW50c1tpbmRleF07XG4gIH1cbn1cbiJdfQ==