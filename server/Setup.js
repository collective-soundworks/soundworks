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
 * The `Setup` module contains the information about the setup of the performance space in terms of its surface (*i.e.* dimensions and outlines) and predefined positions (*e.g.* seats or labels on the floor).
 *
 * For instance, say that the scenario requires 12 participants sitting on the floor on a grid of 3 ⨉ 4 positions, the `Setup` module would contain the information about the grid, including the positions' coordinates in space and their labels.
 * Similarly, if the scenario takes place in a theater where seats are numbered, the `Setup` module would contain the seating plan.
 *
 * If the topography of the performance space does not matter for a given scenario, the `Setup` module is not needed.
 *
 * The {@link Setup} takes care of the setup on the server side.
 * In particular, the module provides helper functions that can generate a setup automatically from some parameters.
 */

var Setup = (function (_Module) {
  _inherits(Setup, _Module);

  /**
   * Creates and instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='setup'] Name of the module.
   */

  function Setup() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Setup);

    _get(Object.getPrototypeOf(Setup.prototype), 'constructor', this).call(this, options.name || 'setup');

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
     * Minimum spacing between positions of the setup (in meters).
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
     * URL of the background image (if any).
     * @type {String}
     */
    this.background = null;

    /**
     * Setup parameters specific to a certain type of setup (*e.g.* a 'matrix'`).
     * @type {Object}
     */
    this.specific = {};

    /**
     * Type of the setup. Currently supported types are:
     * - `'matrix'`;
     * - `'surface'`.
     * @type {[type]}
     */
    this.type = undefined;
  }

  /**
   * @private
   */

  _createClass(Setup, [{
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(Setup.prototype), 'connect', this).call(this, client);

      console.log('connect setup', this.name, ':request??');
      client.receive(this.name + ':request', function () {
        console.log('got it');
        client.send(_this.name + ':init', {
          "width": _this.width,
          "height": _this.height,
          "background": _this.background,
          "spacing": _this.spacing,
          "labels": _this.labels,
          "coordinates": _this.coordinates,
          "type": _this.type
        });
      });
    }

    /**
     * Returns an array with the coordinates of a predefined position of the setup.
     * @param {Number} index Position index about which we want the coordinates.
     * @return {Number[]} Coordinates of the position (`[x, y]`).
     */
  }, {
    key: 'getCoordinates',
    value: function getCoordinates(index) {
      if (index < this.coordinates.length) return this.coordinates[index];

      return null;
    }

    /**
     * Returns the label of a predefined position of the setup.
     * @param {Number} index Position index about which we want the coordinates.
     * @return {String} Label of the position.
     */
  }, {
    key: 'getLabel',
    value: function getLabel(index) {
      if (index < this.labels.length) return this.labels[index];

      return (index + 1).toString();
    }

    /**
     * Returns the total number of predefined positions (and / or labels) of the setup.
     *
     * For instance, if the setup is a 4 ⨉ 5 matrix the method would return 20.
     * @return {Number} Number of predefined positions of the setup.
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

    /**
     * Returns an object with the description of the setup.
     * @return {Object} Description of the setup.
     * @property {Number} height Height of the setup.
     * @property {Number} width Width of the setup.
     */
  }, {
    key: 'getSurface',
    value: function getSurface() {
      var surface = {
        height: this.height,
        width: this.width
        // TODO: allow other shapes
      };

      return surface;
    }

    /**
     * Generates a surface and / or predefined positions according to a given type of geometry (`type`) and the corresponding parameters (`params`).
     * @param {String} type Type of geometry to generate. Accepts the following values:
     * - `'matrix'`: a regular matrix composed of *n* lines and *m* columns as defined in the `params`;
     * - `'surface'`: a rectangular surface, that might be represented on a background image.
     * @param {Object} [params={}] Parameters of the setup to generate. Accepts the following properties, depending on the `type`:
     * - type `'matrix'`:
     *   - `cols:Number`, number of columns (defaults to 3);
     *   - `rows:Number`, number of rows (defaults to 4);
     *   - `colSpacing:Number`, spacing between columns (in meters) (defaults to 1);
     *   - `rowSpacing:Number`, spacing between rows (in meters) (defaults to 1);
     *   - `colMargin`, (horizontal) margins between the borders of the performance space and the first or last column (in meters) (defaults to `colSpacing / 2`);
     *   - `rowMargin`, (vertical) margins between the borders of the performance space and the first or last row (in meters) (defaults to `rowSpacing / 2`);
     * - type `'surface'`:
     *   - `height:Number`: height of the surface (in meters);
     *   - `width:Number`: width of the surface (in meters);
     *   - `background:String`: URL of the background image.
     * @return {[type]} [description]
     */
  }, {
    key: 'generate',
    value: function generate(type) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      this.type = type;

      switch (type) {
        case 'matrix':
          var cols = params.cols || 3;
          var rows = params.rows || 4;
          var colSpacing = params.colSpacing || 1;
          var rowSpacing = params.rowSpacing || 1;
          var colMargin = params.colMargin || colSpacing / 2;
          var rowMargin = params.rowMargin || rowSpacing / 2;

          this.specific.matrix = {};
          this.specific.matrix.cols = cols;
          this.specific.matrix.rows = rows;

          this.width = colSpacing * (cols - 1) + 2 * colMargin;
          this.height = rowSpacing * (rows - 1) + 2 * rowMargin;
          this.spacing = Math.min(colSpacing, rowSpacing);

          var count = 0;

          for (var j = 0; j < rows; j++) {
            for (var i = 0; i < cols; i++) {
              count++;

              var label = count.toString();
              var coordinates = [(colMargin + i * colSpacing) / this.width, (rowMargin + j * rowSpacing) / this.height];

              this.labels.push(label);
              this.coordinates.push(coordinates);
            }
          }

          break;

        case 'surface':
          var height = params.height || 4;
          var width = params.width || 6;
          var background = params.background || null;

          this.height = height;
          this.width = width;
          this.background = background;

          // TODO: allow other shapes
          break;

        default:
          break;
      }
    }
  }]);

  return Setup;
})(_Module3['default']);

exports['default'] = Setup;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2V0dXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBbUIsVUFBVTs7Ozs7Ozs7Ozs7Ozs7OztJQWNSLEtBQUs7WUFBTCxLQUFLOzs7Ozs7OztBQU1iLFdBTlEsS0FBSyxHQU1FO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFOTCxLQUFLOztBQU90QiwrQkFQaUIsS0FBSyw2Q0FPaEIsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLEVBQUU7Ozs7OztBQU0vQixRQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQzs7Ozs7O0FBTWYsUUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1oQixRQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQzs7Ozs7O0FBTWpCLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNakIsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7Ozs7OztBQU10QixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTXZCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOzs7Ozs7OztBQVFuQixRQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztHQUN2Qjs7Ozs7O2VBMURrQixLQUFLOztXQStEakIsaUJBQUMsTUFBTSxFQUFFOzs7QUFDZCxpQ0FoRWlCLEtBQUsseUNBZ0VSLE1BQU0sRUFBRTs7QUFFdEIsYUFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztBQUN0RCxZQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxFQUFFLFlBQU07QUFDM0MsZUFBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0QixjQUFNLENBQUMsSUFBSSxDQUFDLE1BQUssSUFBSSxHQUFHLE9BQU8sRUFBRTtBQUMvQixpQkFBTyxF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QUNGOzs7U0FoTmtCLEtBQUs7OztxQkFBTCxLQUFLIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU2V0dXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG4vKipcbiAqIFRoZSBgU2V0dXBgIG1vZHVsZSBjb250YWlucyB0aGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHNldHVwIG9mIHRoZSBwZXJmb3JtYW5jZSBzcGFjZSBpbiB0ZXJtcyBvZiBpdHMgc3VyZmFjZSAoKmkuZS4qIGRpbWVuc2lvbnMgYW5kIG91dGxpbmVzKSBhbmQgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKCplLmcuKiBzZWF0cyBvciBsYWJlbHMgb24gdGhlIGZsb29yKS5cbiAqXG4gKiBGb3IgaW5zdGFuY2UsIHNheSB0aGF0IHRoZSBzY2VuYXJpbyByZXF1aXJlcyAxMiBwYXJ0aWNpcGFudHMgc2l0dGluZyBvbiB0aGUgZmxvb3Igb24gYSBncmlkIG9mIDMg4qiJIDQgcG9zaXRpb25zLCB0aGUgYFNldHVwYCBtb2R1bGUgd291bGQgY29udGFpbiB0aGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGdyaWQsIGluY2x1ZGluZyB0aGUgcG9zaXRpb25zJyBjb29yZGluYXRlcyBpbiBzcGFjZSBhbmQgdGhlaXIgbGFiZWxzLlxuICogU2ltaWxhcmx5LCBpZiB0aGUgc2NlbmFyaW8gdGFrZXMgcGxhY2UgaW4gYSB0aGVhdGVyIHdoZXJlIHNlYXRzIGFyZSBudW1iZXJlZCwgdGhlIGBTZXR1cGAgbW9kdWxlIHdvdWxkIGNvbnRhaW4gdGhlIHNlYXRpbmcgcGxhbi5cbiAqXG4gKiBJZiB0aGUgdG9wb2dyYXBoeSBvZiB0aGUgcGVyZm9ybWFuY2Ugc3BhY2UgZG9lcyBub3QgbWF0dGVyIGZvciBhIGdpdmVuIHNjZW5hcmlvLCB0aGUgYFNldHVwYCBtb2R1bGUgaXMgbm90IG5lZWRlZC5cbiAqXG4gKiBUaGUge0BsaW5rIFNldHVwfSB0YWtlcyBjYXJlIG9mIHRoZSBzZXR1cCBvbiB0aGUgc2VydmVyIHNpZGUuXG4gKiBJbiBwYXJ0aWN1bGFyLCB0aGUgbW9kdWxlIHByb3ZpZGVzIGhlbHBlciBmdW5jdGlvbnMgdGhhdCBjYW4gZ2VuZXJhdGUgYSBzZXR1cCBhdXRvbWF0aWNhbGx5IGZyb20gc29tZSBwYXJhbWV0ZXJzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXR1cCBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuZCBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm5hbWU9J3NldHVwJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdzZXR1cCcpO1xuXG4gICAgLyoqXG4gICAgICogV2lkdGggb2YgdGhlIHNldHVwIChpbiBtZXRlcnMpLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy53aWR0aCA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBIZWlnaHQgb2YgdGhlIHNldHVwIChpbiBtZXRlcnMpLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5oZWlnaHQgPSAxO1xuXG4gICAgLyoqXG4gICAgICogTWluaW11bSBzcGFjaW5nIGJldHdlZW4gcG9zaXRpb25zIG9mIHRoZSBzZXR1cCAoaW4gbWV0ZXJzKS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuc3BhY2luZyA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiB0aGUgcG9zaXRpb25zJyBsYWJlbHMuXG4gICAgICogQHR5cGUge1N0cmluZ1tdfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWxzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiB0aGUgcG9zaXRpb25zJyBjb29yZGluYXRlcyAoaW4gdGhlIGZvcm1hdCBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gKS5cbiAgICAgKiBAdHlwZSB7QXJyYXlbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBVUkwgb2YgdGhlIGJhY2tncm91bmQgaW1hZ2UgKGlmIGFueSkuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmJhY2tncm91bmQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogU2V0dXAgcGFyYW1ldGVycyBzcGVjaWZpYyB0byBhIGNlcnRhaW4gdHlwZSBvZiBzZXR1cCAoKmUuZy4qIGEgJ21hdHJpeCdgKS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuc3BlY2lmaWMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFR5cGUgb2YgdGhlIHNldHVwLiBDdXJyZW50bHkgc3VwcG9ydGVkIHR5cGVzIGFyZTpcbiAgICAgKiAtIGAnbWF0cml4J2A7XG4gICAgICogLSBgJ3N1cmZhY2UnYC5cbiAgICAgKiBAdHlwZSB7W3R5cGVdfVxuICAgICAqL1xuICAgIHRoaXMudHlwZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICBjb25zb2xlLmxvZygnY29ubmVjdCBzZXR1cCcsIHRoaXMubmFtZSwgJzpyZXF1ZXN0Pz8nKTtcbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOnJlcXVlc3QnLCAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnZ290IGl0Jyk7XG4gICAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOmluaXQnLCB7XG4gICAgICAgIFwid2lkdGhcIjogdGhpcy53aWR0aCxcbiAgICAgICAgXCJoZWlnaHRcIjogdGhpcy5oZWlnaHQsXG4gICAgICAgIFwiYmFja2dyb3VuZFwiOiB0aGlzLmJhY2tncm91bmQsXG4gICAgICAgIFwic3BhY2luZ1wiOiB0aGlzLnNwYWNpbmcsXG4gICAgICAgIFwibGFiZWxzXCI6IHRoaXMubGFiZWxzLFxuICAgICAgICBcImNvb3JkaW5hdGVzXCI6IHRoaXMuY29vcmRpbmF0ZXMsXG4gICAgICAgIFwidHlwZVwiOiB0aGlzLnR5cGVcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgd2l0aCB0aGUgY29vcmRpbmF0ZXMgb2YgYSBwcmVkZWZpbmVkIHBvc2l0aW9uIG9mIHRoZSBzZXR1cC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IFBvc2l0aW9uIGluZGV4IGFib3V0IHdoaWNoIHdlIHdhbnQgdGhlIGNvb3JkaW5hdGVzLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJbXX0gQ29vcmRpbmF0ZXMgb2YgdGhlIHBvc2l0aW9uIChgW3gsIHldYCkuXG4gICAqL1xuICBnZXRDb29yZGluYXRlcyhpbmRleCkge1xuICAgIGlmIChpbmRleCA8IHRoaXMuY29vcmRpbmF0ZXMubGVuZ3RoKVxuICAgICAgcmV0dXJuIHRoaXMuY29vcmRpbmF0ZXNbaW5kZXhdO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbGFiZWwgb2YgYSBwcmVkZWZpbmVkIHBvc2l0aW9uIG9mIHRoZSBzZXR1cC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IFBvc2l0aW9uIGluZGV4IGFib3V0IHdoaWNoIHdlIHdhbnQgdGhlIGNvb3JkaW5hdGVzLlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IExhYmVsIG9mIHRoZSBwb3NpdGlvbi5cbiAgICovXG4gIGdldExhYmVsKGluZGV4KSB7XG4gICAgaWYgKGluZGV4IDwgdGhpcy5sYWJlbHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIHRoaXMubGFiZWxzW2luZGV4XTtcblxuICAgIHJldHVybiAoaW5kZXggKyAxKS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRvdGFsIG51bWJlciBvZiBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoYW5kIC8gb3IgbGFiZWxzKSBvZiB0aGUgc2V0dXAuXG4gICAqXG4gICAqIEZvciBpbnN0YW5jZSwgaWYgdGhlIHNldHVwIGlzIGEgNCDiqIkgNSBtYXRyaXggdGhlIG1ldGhvZCB3b3VsZCByZXR1cm4gMjAuXG4gICAqIEByZXR1cm4ge051bWJlcn0gTnVtYmVyIG9mIHByZWRlZmluZWQgcG9zaXRpb25zIG9mIHRoZSBzZXR1cC5cbiAgICovXG4gIGdldE51bVBvc2l0aW9ucygpIHtcbiAgICBpZih0aGlzLmxhYmVscy5sZW5ndGggfHwgdGhpcy5jb29yZGluYXRlcy5sZW5ndGgpIHtcbiAgICAgIHZhciBudW1MYWJlbHMgPSB0aGlzLmxhYmVscy5sZW5ndGggfHwgSW5maW5pdHk7XG4gICAgICB2YXIgbnVtQ29vcmRpbmF0ZXMgPSB0aGlzLmNvb3JkaW5hdGVzLmxlbmd0aCB8fCBJbmZpbml0eTtcblxuICAgICAgcmV0dXJuIE1hdGgubWluKG51bUxhYmVscywgbnVtQ29vcmRpbmF0ZXMpO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBzZXR1cC5cbiAgICogQHJldHVybiB7T2JqZWN0fSBEZXNjcmlwdGlvbiBvZiB0aGUgc2V0dXAuXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBoZWlnaHQgSGVpZ2h0IG9mIHRoZSBzZXR1cC5cbiAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHdpZHRoIFdpZHRoIG9mIHRoZSBzZXR1cC5cbiAgICovXG4gIGdldFN1cmZhY2UoKSB7XG4gICAgbGV0IHN1cmZhY2UgPSB7XG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgd2lkdGg6IHRoaXMud2lkdGhcbiAgICAgIC8vIFRPRE86IGFsbG93IG90aGVyIHNoYXBlc1xuICAgIH1cblxuICAgIHJldHVybiBzdXJmYWNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIHN1cmZhY2UgYW5kIC8gb3IgcHJlZGVmaW5lZCBwb3NpdGlvbnMgYWNjb3JkaW5nIHRvIGEgZ2l2ZW4gdHlwZSBvZiBnZW9tZXRyeSAoYHR5cGVgKSBhbmQgdGhlIGNvcnJlc3BvbmRpbmcgcGFyYW1ldGVycyAoYHBhcmFtc2ApLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUeXBlIG9mIGdlb21ldHJ5IHRvIGdlbmVyYXRlLiBBY2NlcHRzIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuICAgKiAtIGAnbWF0cml4J2A6IGEgcmVndWxhciBtYXRyaXggY29tcG9zZWQgb2YgKm4qIGxpbmVzIGFuZCAqbSogY29sdW1ucyBhcyBkZWZpbmVkIGluIHRoZSBgcGFyYW1zYDtcbiAgICogLSBgJ3N1cmZhY2UnYDogYSByZWN0YW5ndWxhciBzdXJmYWNlLCB0aGF0IG1pZ2h0IGJlIHJlcHJlc2VudGVkIG9uIGEgYmFja2dyb3VuZCBpbWFnZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXM9e31dIFBhcmFtZXRlcnMgb2YgdGhlIHNldHVwIHRvIGdlbmVyYXRlLiBBY2NlcHRzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllcywgZGVwZW5kaW5nIG9uIHRoZSBgdHlwZWA6XG4gICAqIC0gdHlwZSBgJ21hdHJpeCdgOlxuICAgKiAgIC0gYGNvbHM6TnVtYmVyYCwgbnVtYmVyIG9mIGNvbHVtbnMgKGRlZmF1bHRzIHRvIDMpO1xuICAgKiAgIC0gYHJvd3M6TnVtYmVyYCwgbnVtYmVyIG9mIHJvd3MgKGRlZmF1bHRzIHRvIDQpO1xuICAgKiAgIC0gYGNvbFNwYWNpbmc6TnVtYmVyYCwgc3BhY2luZyBiZXR3ZWVuIGNvbHVtbnMgKGluIG1ldGVycykgKGRlZmF1bHRzIHRvIDEpO1xuICAgKiAgIC0gYHJvd1NwYWNpbmc6TnVtYmVyYCwgc3BhY2luZyBiZXR3ZWVuIHJvd3MgKGluIG1ldGVycykgKGRlZmF1bHRzIHRvIDEpO1xuICAgKiAgIC0gYGNvbE1hcmdpbmAsIChob3Jpem9udGFsKSBtYXJnaW5zIGJldHdlZW4gdGhlIGJvcmRlcnMgb2YgdGhlIHBlcmZvcm1hbmNlIHNwYWNlIGFuZCB0aGUgZmlyc3Qgb3IgbGFzdCBjb2x1bW4gKGluIG1ldGVycykgKGRlZmF1bHRzIHRvIGBjb2xTcGFjaW5nIC8gMmApO1xuICAgKiAgIC0gYHJvd01hcmdpbmAsICh2ZXJ0aWNhbCkgbWFyZ2lucyBiZXR3ZWVuIHRoZSBib3JkZXJzIG9mIHRoZSBwZXJmb3JtYW5jZSBzcGFjZSBhbmQgdGhlIGZpcnN0IG9yIGxhc3Qgcm93IChpbiBtZXRlcnMpIChkZWZhdWx0cyB0byBgcm93U3BhY2luZyAvIDJgKTtcbiAgICogLSB0eXBlIGAnc3VyZmFjZSdgOlxuICAgKiAgIC0gYGhlaWdodDpOdW1iZXJgOiBoZWlnaHQgb2YgdGhlIHN1cmZhY2UgKGluIG1ldGVycyk7XG4gICAqICAgLSBgd2lkdGg6TnVtYmVyYDogd2lkdGggb2YgdGhlIHN1cmZhY2UgKGluIG1ldGVycyk7XG4gICAqICAgLSBgYmFja2dyb3VuZDpTdHJpbmdgOiBVUkwgb2YgdGhlIGJhY2tncm91bmQgaW1hZ2UuXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgZ2VuZXJhdGUodHlwZSwgcGFyYW1zID0ge30pIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuXG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdtYXRyaXgnOlxuICAgICAgICBsZXQgY29scyA9IHBhcmFtcy5jb2xzIHx8IDM7XG4gICAgICAgIGxldCByb3dzID0gcGFyYW1zLnJvd3MgfHwgNDtcbiAgICAgICAgbGV0IGNvbFNwYWNpbmcgPSBwYXJhbXMuY29sU3BhY2luZyB8fCAxO1xuICAgICAgICBsZXQgcm93U3BhY2luZyA9IHBhcmFtcy5yb3dTcGFjaW5nIHx8IDE7XG4gICAgICAgIGxldCBjb2xNYXJnaW4gPSBwYXJhbXMuY29sTWFyZ2luIHx8IGNvbFNwYWNpbmcgLyAyO1xuICAgICAgICBsZXQgcm93TWFyZ2luID0gcGFyYW1zLnJvd01hcmdpbiB8fCByb3dTcGFjaW5nIC8gMjtcblxuICAgICAgICB0aGlzLnNwZWNpZmljLm1hdHJpeCA9IHt9O1xuICAgICAgICB0aGlzLnNwZWNpZmljLm1hdHJpeC5jb2xzID0gY29scztcbiAgICAgICAgdGhpcy5zcGVjaWZpYy5tYXRyaXgucm93cyA9IHJvd3M7XG5cbiAgICAgICAgdGhpcy53aWR0aCA9IGNvbFNwYWNpbmcgKiAoY29scyAtIDEpICsgMiAqIGNvbE1hcmdpbjtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSByb3dTcGFjaW5nICogKHJvd3MgLSAxKSArIDIgKiByb3dNYXJnaW47XG4gICAgICAgIHRoaXMuc3BhY2luZyA9IE1hdGgubWluKGNvbFNwYWNpbmcsIHJvd1NwYWNpbmcpO1xuXG4gICAgICAgIGxldCBjb3VudCA9IDA7XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByb3dzOyBqKyspIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHM7IGkrKykge1xuICAgICAgICAgICAgY291bnQrKztcblxuICAgICAgICAgICAgbGV0IGxhYmVsID0gY291bnQudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGxldCBjb29yZGluYXRlcyA9IFsoY29sTWFyZ2luICsgaSAqIGNvbFNwYWNpbmcpIC8gdGhpcy53aWR0aCwgKHJvd01hcmdpbiArIGogKiByb3dTcGFjaW5nKSAvIHRoaXMuaGVpZ2h0XTtcblxuICAgICAgICAgICAgdGhpcy5sYWJlbHMucHVzaChsYWJlbCk7XG4gICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzLnB1c2goY29vcmRpbmF0ZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdzdXJmYWNlJzpcbiAgICAgICAgbGV0IGhlaWdodCA9IHBhcmFtcy5oZWlnaHQgfHwgNDtcbiAgICAgICAgbGV0IHdpZHRoID0gcGFyYW1zLndpZHRoIHx8IDY7XG4gICAgICAgIGxldCBiYWNrZ3JvdW5kID0gcGFyYW1zLmJhY2tncm91bmQgfHzCoG51bGw7XG5cbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gYmFja2dyb3VuZDtcblxuICAgICAgICAvLyBUT0RPOiBhbGxvdyBvdGhlciBzaGFwZXNcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuIl19