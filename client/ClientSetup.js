'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

/**
 * [client] Define the physical setup in which the scenario takes place.
 *
 * The module contains information about the dimensions and outlines of the space, and optionally about the coordinates and labels of predefined positions (*e.g.* seats in a theater).
 *
 * The module retrieves the setup information from the server.
 * It never has a view.
 *
 * The module finishes its initialization when it receives the setup information from the server.
 *
 * **Note:** to render the setup graphically, see {@link Space}.
 *
 * (See also {@link src/server/ServerSetup.js~ServerSetup} on the server side.)
 */

var ClientSetup = (function (_ClientModule) {
  _inherits(ClientSetup, _ClientModule);

  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='setup'] Name of the module.
   */

  function ClientSetup() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientSetup);

    _get(Object.getPrototypeOf(ClientSetup.prototype), 'constructor', this).call(this, options.name || 'setup', false);

    /**
     * Width of the setup (in meters).
     * @type {Number}
     */
    this.width = 1;

    /**
     * Height of the setup (in meters).
     * @type {Number}
     */
    this.height = 1;

    /**
     * Default spacing between positions (in meters).
     * @type {Number}
     */
    this.spacing = 1;

    /**
     * Array of the positions' labels.
     * @type {String[]}
     */
    this.labels = [];

    /**
     * Array of the positions' coordinates (in the format `[x:Number, y:Number]`).
     * @type {Array[]}
     */
    this.coordinates = [];

    /**
     * Type of the setup (values currently supported: `'matrix'`, `'surface'`).
     * @type {String}
     * @todo Remove?
     */
    this.type = undefined;

    /**
     * Background image URL.
     * @type {String}
     */
    this.background = undefined;

    this._xFactor = 1;
    this._yFactor = 1;

    this._init = this._init.bind(this);
  }

  _createClass(ClientSetup, [{
    key: '_init',
    value: function _init(setup) {
      this.width = setup.width;
      this.height = setup.height;
      this.spacing = setup.spacing;
      this.labels = setup.labels;
      this.coordinates = setup.coordinates;
      this.type = setup.type;
      this.background = setup.background;

      this.done();
    }

    /**
     * Starts the module.
     * @private
     */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientSetup.prototype), 'start', this).call(this);

      this.receive('init', this._init);
      this.send('request');
    }

    /**
     * Restarts the module.
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(ClientSetup.prototype), 'restart', this).call(this);
      this.done();
    }

    /**
     * Resets the module.
     * @private
     */
  }, {
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(ClientSetup.prototype), 'reset', this).call(this);
      this.removeListener('init', this._init);
    }

    /**
     * Returns the number of positions in the setup.
     * @return {Number} Number of positions in the setup.
     */
  }, {
    key: 'getNumPositions',
    value: function getNumPositions() {
      if (this.labels.length || this.coordinates.length) {
        var numLabels = this.labels.length || Infinity;
        var numCoordinates = this.coordinates.length || Infinity;

        return Math.min(numLabels, numCoordinates);
      }

      return 0;
    }
  }]);

  return ClientSetup;
})(_ClientModule3['default']);

exports['default'] = ClientSetup;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50U2V0dXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQnBCLFdBQVc7WUFBWCxXQUFXOzs7Ozs7OztBQU1uQixXQU5RLFdBQVcsR0FNSjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTkwsV0FBVzs7QUFPNUIsK0JBUGlCLFdBQVcsNkNBT3RCLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxFQUFFLEtBQUssRUFBRTs7Ozs7O0FBTXRDLFFBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7QUFNZixRQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzs7Ozs7O0FBTWhCLFFBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7QUFNakIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7Ozs7OztBQU1qQixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7Ozs7OztBQU90QixRQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQzs7Ozs7O0FBTXRCLFFBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDOztBQUU1QixRQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNwQzs7ZUF4RGtCLFdBQVc7O1dBMER6QixlQUFDLEtBQUssRUFBRTtBQUNYLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztBQUN6QixVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDM0IsVUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQzdCLFVBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUMzQixVQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7QUFDckMsVUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQzs7QUFFbkMsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7Ozs7Ozs7O1dBTUksaUJBQUc7QUFDTixpQ0EzRWlCLFdBQVcsdUNBMkVkOztBQUVkLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqQyxVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3RCOzs7Ozs7OztXQU1NLG1CQUFHO0FBQ1IsaUNBdEZpQixXQUFXLHlDQXNGWjtBQUNoQixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7Ozs7Ozs7V0FNSSxpQkFBRztBQUNOLGlDQS9GaUIsV0FBVyx1Q0ErRmQ7QUFDZCxVQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDekM7Ozs7Ozs7O1dBTWMsMkJBQUc7QUFDaEIsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRTtBQUNqRCxZQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUM7QUFDL0MsWUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDOztBQUV6RCxlQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO09BQzVDOztBQUVELGFBQU8sQ0FBQyxDQUFDO0tBQ1Y7OztTQWhIa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRTZXR1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5cblxuLyoqXG4gKiBbY2xpZW50XSBEZWZpbmUgdGhlIHBoeXNpY2FsIHNldHVwIGluIHdoaWNoIHRoZSBzY2VuYXJpbyB0YWtlcyBwbGFjZS5cbiAqXG4gKiBUaGUgbW9kdWxlIGNvbnRhaW5zIGluZm9ybWF0aW9uIGFib3V0IHRoZSBkaW1lbnNpb25zIGFuZCBvdXRsaW5lcyBvZiB0aGUgc3BhY2UsIGFuZCBvcHRpb25hbGx5IGFib3V0IHRoZSBjb29yZGluYXRlcyBhbmQgbGFiZWxzIG9mIHByZWRlZmluZWQgcG9zaXRpb25zICgqZS5nLiogc2VhdHMgaW4gYSB0aGVhdGVyKS5cbiAqXG4gKiBUaGUgbW9kdWxlIHJldHJpZXZlcyB0aGUgc2V0dXAgaW5mb3JtYXRpb24gZnJvbSB0aGUgc2VydmVyLlxuICogSXQgbmV2ZXIgaGFzIGEgdmlldy5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIGl0IHJlY2VpdmVzIHRoZSBzZXR1cCBpbmZvcm1hdGlvbiBmcm9tIHRoZSBzZXJ2ZXIuXG4gKlxuICogKipOb3RlOioqIHRvIHJlbmRlciB0aGUgc2V0dXAgZ3JhcGhpY2FsbHksIHNlZSB7QGxpbmsgU3BhY2V9LlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJTZXR1cC5qc35TZXJ2ZXJTZXR1cH0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50U2V0dXAgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3NldHVwJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdzZXR1cCcsIGZhbHNlKTtcblxuICAgIC8qKlxuICAgICAqIFdpZHRoIG9mIHRoZSBzZXR1cCAoaW4gbWV0ZXJzKS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMud2lkdGggPSAxO1xuXG4gICAgLyoqXG4gICAgICogSGVpZ2h0IG9mIHRoZSBzZXR1cCAoaW4gbWV0ZXJzKS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaGVpZ2h0ID0gMTtcblxuICAgIC8qKlxuICAgICAqIERlZmF1bHQgc3BhY2luZyBiZXR3ZWVuIHBvc2l0aW9ucyAoaW4gbWV0ZXJzKS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuc3BhY2luZyA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiB0aGUgcG9zaXRpb25zJyBsYWJlbHMuXG4gICAgICogQHR5cGUge1N0cmluZ1tdfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWxzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiB0aGUgcG9zaXRpb25zJyBjb29yZGluYXRlcyAoaW4gdGhlIGZvcm1hdCBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gKS5cbiAgICAgKiBAdHlwZSB7QXJyYXlbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBUeXBlIG9mIHRoZSBzZXR1cCAodmFsdWVzIGN1cnJlbnRseSBzdXBwb3J0ZWQ6IGAnbWF0cml4J2AsIGAnc3VyZmFjZSdgKS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEB0b2RvIFJlbW92ZT9cbiAgICAgKi9cbiAgICB0aGlzLnR5cGUgPSB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBCYWNrZ3JvdW5kIGltYWdlIFVSTC5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuYmFja2dyb3VuZCA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuX3hGYWN0b3IgPSAxO1xuICAgIHRoaXMuX3lGYWN0b3IgPSAxO1xuXG4gICAgdGhpcy5faW5pdCA9IHRoaXMuX2luaXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIF9pbml0KHNldHVwKSB7XG4gICAgdGhpcy53aWR0aCA9IHNldHVwLndpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gc2V0dXAuaGVpZ2h0O1xuICAgIHRoaXMuc3BhY2luZyA9IHNldHVwLnNwYWNpbmc7XG4gICAgdGhpcy5sYWJlbHMgPSBzZXR1cC5sYWJlbHM7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzO1xuICAgIHRoaXMudHlwZSA9IHNldHVwLnR5cGU7XG4gICAgdGhpcy5iYWNrZ3JvdW5kID0gc2V0dXAuYmFja2dyb3VuZDtcblxuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnaW5pdCcsIHRoaXMuX2luaXQpO1xuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIHN1cGVyLnJlc2V0KCk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignaW5pdCcsIHRoaXMuX2luaXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBwb3NpdGlvbnMgaW4gdGhlIHNldHVwLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IE51bWJlciBvZiBwb3NpdGlvbnMgaW4gdGhlIHNldHVwLlxuICAgKi9cbiAgZ2V0TnVtUG9zaXRpb25zKCkge1xuICAgIGlmICh0aGlzLmxhYmVscy5sZW5ndGggfHwgdGhpcy5jb29yZGluYXRlcy5sZW5ndGgpIHtcbiAgICAgIHZhciBudW1MYWJlbHMgPSB0aGlzLmxhYmVscy5sZW5ndGggfHwgSW5maW5pdHk7XG4gICAgICB2YXIgbnVtQ29vcmRpbmF0ZXMgPSB0aGlzLmNvb3JkaW5hdGVzLmxlbmd0aCB8fCBJbmZpbml0eTtcblxuICAgICAgcmV0dXJuIE1hdGgubWluKG51bUxhYmVscywgbnVtQ29vcmRpbmF0ZXMpO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG59XG4iXX0=