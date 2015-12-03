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
 * [server] Define the physical setup in which the scenario takes place.
 *
 * The module contains information about the dimensions and outlines of the space, and optionally about the coordinates and labels of predefined positions (*e.g.* seats in a theater).
 *
 * For instance, say that the scenario requires 12 participants sitting on the floor on a grid of 3 ⨉ 4 positions, the module would contain the information about the grid, including the positions' coordinates in space and their labels.
 * Similarly, if the scenario takes place in a theater where seats are numbered, the module would contain the seating plan.
 *
 * The setup information is stored on the server and is sent to the client when it connects to the server.
 * The module provides a helper function that can generate a setup automatically from some parameters (see {@link ServerSetup#generate}).
 *
 * (See also {@link src/client/ClientSetup.js~ClientSetup} on the client side.)
 *
 * @example // Generate a 3 ⨉ 4 matrix
 * const setup = new ServerSetup();
 * setup.generate('matrix', { rows: 3, cols: 4 });
 *
 * // Generate a surface of 6 ⨉ 10 meters with a background image
 * const setup = new ServerSetup();
 * setup.generate('surface', {
 *   height: 6,
 *   width: 10
 *   background: 'img/bg.png'
 * });
 */

var ServerSetup = (function (_Module) {
  _inherits(ServerSetup, _Module);

  /**
   * Creates and instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='setup'] Name of the module.
   */

  function ServerSetup() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerSetup);

    _get(Object.getPrototypeOf(ServerSetup.prototype), 'constructor', this).call(this, options.name || 'setup');

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

  _createClass(ServerSetup, [{
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(ServerSetup.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', function () {
        _this.send(client, 'init', {
          width: _this.width,
          height: _this.height,
          background: _this.background,
          spacing: _this.spacing,
          labels: _this.labels,
          coordinates: _this.coordinates,
          type: _this.type
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
      // @todo - allow other shapes
      var surface = {
        height: this.height,
        width: this.width
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
     *   - `colMargin:Number`, (horizontal) margins between the borders of the performance space and the first or last column (in meters) (defaults to `colSpacing / 2`);
     *   - `rowMargin:Number`, (vertical) margins between the borders of the performance space and the first or last row (in meters) (defaults to `rowSpacing / 2`);
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
              var x = (colMargin + i * colSpacing) / this.width;
              var y = (rowMargin + j * rowSpacing) / this.height;
              var coordinates = [x, y];

              this.labels.push(label);
              this.coordinates.push(coordinates);
            }
          }

          break;

        case 'surface':
          // @todo - allow other shape
          var height = params.height || 4;
          var width = params.width || 6;
          var background = params.background || null;

          this.height = height;
          this.width = width;
          this.background = background;
          break;

        default:
          break;
      }
    }
  }]);

  return ServerSetup;
})(_Module3['default']);

exports['default'] = ServerSetup;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyU2V0dXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBbUIsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBMkJSLFdBQVc7WUFBWCxXQUFXOzs7Ozs7OztBQU1uQixXQU5RLFdBQVcsR0FNSjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTkwsV0FBVzs7QUFPNUIsK0JBUGlCLFdBQVcsNkNBT3RCLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxFQUFFOzs7Ozs7QUFNL0IsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1mLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7QUFNaEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1qQixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBTWpCLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNdEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Ozs7OztBQU12QixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7QUFRbkIsUUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7R0FDdkI7Ozs7OztlQTFEa0IsV0FBVzs7V0ErRHZCLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBaEVpQixXQUFXLHlDQWdFZCxNQUFNLEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxZQUFNO0FBQ3BDLGNBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDeEIsZUFBSyxFQUFFLE1BQUssS0FBSztBQUNqQixnQkFBTSxFQUFFLE1BQUssTUFBTTtBQUNuQixvQkFBVSxFQUFFLE1BQUssVUFBVTtBQUMzQixpQkFBTyxFQUFFLE1BQUssT0FBTztBQUNyQixnQkFBTSxFQUFF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ci9TZXJ2ZXJTZXR1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG4vKipcbiAqIFtzZXJ2ZXJdIERlZmluZSB0aGUgcGh5c2ljYWwgc2V0dXAgaW4gd2hpY2ggdGhlIHNjZW5hcmlvIHRha2VzIHBsYWNlLlxuICpcbiAqIFRoZSBtb2R1bGUgY29udGFpbnMgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGRpbWVuc2lvbnMgYW5kIG91dGxpbmVzIG9mIHRoZSBzcGFjZSwgYW5kIG9wdGlvbmFsbHkgYWJvdXQgdGhlIGNvb3JkaW5hdGVzIGFuZCBsYWJlbHMgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKCplLmcuKiBzZWF0cyBpbiBhIHRoZWF0ZXIpLlxuICpcbiAqIEZvciBpbnN0YW5jZSwgc2F5IHRoYXQgdGhlIHNjZW5hcmlvIHJlcXVpcmVzIDEyIHBhcnRpY2lwYW50cyBzaXR0aW5nIG9uIHRoZSBmbG9vciBvbiBhIGdyaWQgb2YgMyDiqIkgNCBwb3NpdGlvbnMsIHRoZSBtb2R1bGUgd291bGQgY29udGFpbiB0aGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGdyaWQsIGluY2x1ZGluZyB0aGUgcG9zaXRpb25zJyBjb29yZGluYXRlcyBpbiBzcGFjZSBhbmQgdGhlaXIgbGFiZWxzLlxuICogU2ltaWxhcmx5LCBpZiB0aGUgc2NlbmFyaW8gdGFrZXMgcGxhY2UgaW4gYSB0aGVhdGVyIHdoZXJlIHNlYXRzIGFyZSBudW1iZXJlZCwgdGhlIG1vZHVsZSB3b3VsZCBjb250YWluIHRoZSBzZWF0aW5nIHBsYW4uXG4gKlxuICogVGhlIHNldHVwIGluZm9ybWF0aW9uIGlzIHN0b3JlZCBvbiB0aGUgc2VydmVyIGFuZCBpcyBzZW50IHRvIHRoZSBjbGllbnQgd2hlbiBpdCBjb25uZWN0cyB0byB0aGUgc2VydmVyLlxuICogVGhlIG1vZHVsZSBwcm92aWRlcyBhIGhlbHBlciBmdW5jdGlvbiB0aGF0IGNhbiBnZW5lcmF0ZSBhIHNldHVwIGF1dG9tYXRpY2FsbHkgZnJvbSBzb21lIHBhcmFtZXRlcnMgKHNlZSB7QGxpbmsgU2VydmVyU2V0dXAjZ2VuZXJhdGV9KS5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50U2V0dXAuanN+Q2xpZW50U2V0dXB9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKlxuICogQGV4YW1wbGUgLy8gR2VuZXJhdGUgYSAzIOKoiSA0IG1hdHJpeFxuICogY29uc3Qgc2V0dXAgPSBuZXcgU2VydmVyU2V0dXAoKTtcbiAqIHNldHVwLmdlbmVyYXRlKCdtYXRyaXgnLCB7IHJvd3M6IDMsIGNvbHM6IDQgfSk7XG4gKlxuICogLy8gR2VuZXJhdGUgYSBzdXJmYWNlIG9mIDYg4qiJIDEwIG1ldGVycyB3aXRoIGEgYmFja2dyb3VuZCBpbWFnZVxuICogY29uc3Qgc2V0dXAgPSBuZXcgU2VydmVyU2V0dXAoKTtcbiAqIHNldHVwLmdlbmVyYXRlKCdzdXJmYWNlJywge1xuICogICBoZWlnaHQ6IDYsXG4gKiAgIHdpZHRoOiAxMFxuICogICBiYWNrZ3JvdW5kOiAnaW1nL2JnLnBuZydcbiAqIH0pO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJTZXR1cCBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuZCBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm5hbWU9J3NldHVwJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdzZXR1cCcpO1xuXG4gICAgLyoqXG4gICAgICogV2lkdGggb2YgdGhlIHNldHVwIChpbiBtZXRlcnMpLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy53aWR0aCA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBIZWlnaHQgb2YgdGhlIHNldHVwIChpbiBtZXRlcnMpLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5oZWlnaHQgPSAxO1xuXG4gICAgLyoqXG4gICAgICogTWluaW11bSBzcGFjaW5nIGJldHdlZW4gcG9zaXRpb25zIG9mIHRoZSBzZXR1cCAoaW4gbWV0ZXJzKS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuc3BhY2luZyA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiB0aGUgcG9zaXRpb25zJyBsYWJlbHMuXG4gICAgICogQHR5cGUge1N0cmluZ1tdfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWxzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiB0aGUgcG9zaXRpb25zJyBjb29yZGluYXRlcyAoaW4gdGhlIGZvcm1hdCBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gKS5cbiAgICAgKiBAdHlwZSB7QXJyYXlbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBVUkwgb2YgdGhlIGJhY2tncm91bmQgaW1hZ2UgKGlmIGFueSkuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmJhY2tncm91bmQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogU2V0dXAgcGFyYW1ldGVycyBzcGVjaWZpYyB0byBhIGNlcnRhaW4gdHlwZSBvZiBzZXR1cCAoKmUuZy4qIGEgJ21hdHJpeCdgKS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuc3BlY2lmaWMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFR5cGUgb2YgdGhlIHNldHVwLiBDdXJyZW50bHkgc3VwcG9ydGVkIHR5cGVzIGFyZTpcbiAgICAgKiAtIGAnbWF0cml4J2A7XG4gICAgICogLSBgJ3N1cmZhY2UnYC5cbiAgICAgKiBAdHlwZSB7W3R5cGVdfVxuICAgICAqL1xuICAgIHRoaXMudHlwZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsICgpID0+IHtcbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdpbml0Jywge1xuICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgICAgYmFja2dyb3VuZDogdGhpcy5iYWNrZ3JvdW5kLFxuICAgICAgICBzcGFjaW5nOiB0aGlzLnNwYWNpbmcsXG4gICAgICAgIGxhYmVsczogdGhpcy5sYWJlbHMsXG4gICAgICAgIGNvb3JkaW5hdGVzOiB0aGlzLmNvb3JkaW5hdGVzLFxuICAgICAgICB0eXBlOiB0aGlzLnR5cGVcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgd2l0aCB0aGUgY29vcmRpbmF0ZXMgb2YgYSBwcmVkZWZpbmVkIHBvc2l0aW9uIG9mIHRoZSBzZXR1cC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IFBvc2l0aW9uIGluZGV4IGFib3V0IHdoaWNoIHdlIHdhbnQgdGhlIGNvb3JkaW5hdGVzLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJbXX0gQ29vcmRpbmF0ZXMgb2YgdGhlIHBvc2l0aW9uIChgW3gsIHldYCkuXG4gICAqL1xuICBnZXRDb29yZGluYXRlcyhpbmRleCkge1xuICAgIGlmIChpbmRleCA8IHRoaXMuY29vcmRpbmF0ZXMubGVuZ3RoKVxuICAgICAgcmV0dXJuIHRoaXMuY29vcmRpbmF0ZXNbaW5kZXhdO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbGFiZWwgb2YgYSBwcmVkZWZpbmVkIHBvc2l0aW9uIG9mIHRoZSBzZXR1cC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IFBvc2l0aW9uIGluZGV4IGFib3V0IHdoaWNoIHdlIHdhbnQgdGhlIGNvb3JkaW5hdGVzLlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IExhYmVsIG9mIHRoZSBwb3NpdGlvbi5cbiAgICovXG4gIGdldExhYmVsKGluZGV4KSB7XG4gICAgaWYgKGluZGV4IDwgdGhpcy5sYWJlbHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIHRoaXMubGFiZWxzW2luZGV4XTtcblxuICAgIHJldHVybiAoaW5kZXggKyAxKS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRvdGFsIG51bWJlciBvZiBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoYW5kIC8gb3IgbGFiZWxzKSBvZiB0aGUgc2V0dXAuXG4gICAqXG4gICAqIEZvciBpbnN0YW5jZSwgaWYgdGhlIHNldHVwIGlzIGEgNCDiqIkgNSBtYXRyaXggdGhlIG1ldGhvZCB3b3VsZCByZXR1cm4gMjAuXG4gICAqIEByZXR1cm4ge051bWJlcn0gTnVtYmVyIG9mIHByZWRlZmluZWQgcG9zaXRpb25zIG9mIHRoZSBzZXR1cC5cbiAgICovXG4gIGdldE51bVBvc2l0aW9ucygpIHtcbiAgICBpZih0aGlzLmxhYmVscy5sZW5ndGggfHwgdGhpcy5jb29yZGluYXRlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG51bUxhYmVscyA9IHRoaXMubGFiZWxzLmxlbmd0aCB8fCBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bUNvb3JkaW5hdGVzID0gdGhpcy5jb29yZGluYXRlcy5sZW5ndGggfHwgSW5maW5pdHk7XG5cbiAgICAgIHJldHVybiBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgc2V0dXAuXG4gICAqIEByZXR1cm4ge09iamVjdH0gRGVzY3JpcHRpb24gb2YgdGhlIHNldHVwLlxuICAgKiBAcHJvcGVydHkge051bWJlcn0gaGVpZ2h0IEhlaWdodCBvZiB0aGUgc2V0dXAuXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB3aWR0aCBXaWR0aCBvZiB0aGUgc2V0dXAuXG4gICAqL1xuICBnZXRTdXJmYWNlKCkge1xuICAgIC8vIEB0b2RvIC0gYWxsb3cgb3RoZXIgc2hhcGVzXG4gICAgY29uc3Qgc3VyZmFjZSA9IHtcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICB3aWR0aDogdGhpcy53aWR0aFxuICAgIH1cblxuICAgIHJldHVybiBzdXJmYWNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIHN1cmZhY2UgYW5kIC8gb3IgcHJlZGVmaW5lZCBwb3NpdGlvbnMgYWNjb3JkaW5nIHRvIGEgZ2l2ZW4gdHlwZSBvZiBnZW9tZXRyeSAoYHR5cGVgKSBhbmQgdGhlIGNvcnJlc3BvbmRpbmcgcGFyYW1ldGVycyAoYHBhcmFtc2ApLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUeXBlIG9mIGdlb21ldHJ5IHRvIGdlbmVyYXRlLiBBY2NlcHRzIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuICAgKiAtIGAnbWF0cml4J2A6IGEgcmVndWxhciBtYXRyaXggY29tcG9zZWQgb2YgKm4qIGxpbmVzIGFuZCAqbSogY29sdW1ucyBhcyBkZWZpbmVkIGluIHRoZSBgcGFyYW1zYDtcbiAgICogLSBgJ3N1cmZhY2UnYDogYSByZWN0YW5ndWxhciBzdXJmYWNlLCB0aGF0IG1pZ2h0IGJlIHJlcHJlc2VudGVkIG9uIGEgYmFja2dyb3VuZCBpbWFnZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXM9e31dIFBhcmFtZXRlcnMgb2YgdGhlIHNldHVwIHRvIGdlbmVyYXRlLiBBY2NlcHRzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllcywgZGVwZW5kaW5nIG9uIHRoZSBgdHlwZWA6XG4gICAqIC0gdHlwZSBgJ21hdHJpeCdgOlxuICAgKiAgIC0gYGNvbHM6TnVtYmVyYCwgbnVtYmVyIG9mIGNvbHVtbnMgKGRlZmF1bHRzIHRvIDMpO1xuICAgKiAgIC0gYHJvd3M6TnVtYmVyYCwgbnVtYmVyIG9mIHJvd3MgKGRlZmF1bHRzIHRvIDQpO1xuICAgKiAgIC0gYGNvbFNwYWNpbmc6TnVtYmVyYCwgc3BhY2luZyBiZXR3ZWVuIGNvbHVtbnMgKGluIG1ldGVycykgKGRlZmF1bHRzIHRvIDEpO1xuICAgKiAgIC0gYHJvd1NwYWNpbmc6TnVtYmVyYCwgc3BhY2luZyBiZXR3ZWVuIHJvd3MgKGluIG1ldGVycykgKGRlZmF1bHRzIHRvIDEpO1xuICAgKiAgIC0gYGNvbE1hcmdpbjpOdW1iZXJgLCAoaG9yaXpvbnRhbCkgbWFyZ2lucyBiZXR3ZWVuIHRoZSBib3JkZXJzIG9mIHRoZSBwZXJmb3JtYW5jZSBzcGFjZSBhbmQgdGhlIGZpcnN0IG9yIGxhc3QgY29sdW1uIChpbiBtZXRlcnMpIChkZWZhdWx0cyB0byBgY29sU3BhY2luZyAvIDJgKTtcbiAgICogICAtIGByb3dNYXJnaW46TnVtYmVyYCwgKHZlcnRpY2FsKSBtYXJnaW5zIGJldHdlZW4gdGhlIGJvcmRlcnMgb2YgdGhlIHBlcmZvcm1hbmNlIHNwYWNlIGFuZCB0aGUgZmlyc3Qgb3IgbGFzdCByb3cgKGluIG1ldGVycykgKGRlZmF1bHRzIHRvIGByb3dTcGFjaW5nIC8gMmApO1xuICAgKiAtIHR5cGUgYCdzdXJmYWNlJ2A6XG4gICAqICAgLSBgaGVpZ2h0Ok51bWJlcmA6IGhlaWdodCBvZiB0aGUgc3VyZmFjZSAoaW4gbWV0ZXJzKTtcbiAgICogICAtIGB3aWR0aDpOdW1iZXJgOiB3aWR0aCBvZiB0aGUgc3VyZmFjZSAoaW4gbWV0ZXJzKTtcbiAgICogICAtIGBiYWNrZ3JvdW5kOlN0cmluZ2A6IFVSTCBvZiB0aGUgYmFja2dyb3VuZCBpbWFnZS5cbiAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBnZW5lcmF0ZSh0eXBlLCBwYXJhbXMgPSB7fSkge1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ21hdHJpeCc6XG4gICAgICAgIGNvbnN0IGNvbHMgPSBwYXJhbXMuY29scyB8fCAzO1xuICAgICAgICBjb25zdCByb3dzID0gcGFyYW1zLnJvd3MgfHwgNDtcbiAgICAgICAgY29uc3QgY29sU3BhY2luZyA9IHBhcmFtcy5jb2xTcGFjaW5nIHx8IDE7XG4gICAgICAgIGNvbnN0IHJvd1NwYWNpbmcgPSBwYXJhbXMucm93U3BhY2luZyB8fCAxO1xuICAgICAgICBjb25zdCBjb2xNYXJnaW4gPSBwYXJhbXMuY29sTWFyZ2luIHx8IGNvbFNwYWNpbmcgLyAyO1xuICAgICAgICBjb25zdCByb3dNYXJnaW4gPSBwYXJhbXMucm93TWFyZ2luIHx8IHJvd1NwYWNpbmcgLyAyO1xuXG4gICAgICAgIHRoaXMuc3BlY2lmaWMubWF0cml4ID0ge307XG4gICAgICAgIHRoaXMuc3BlY2lmaWMubWF0cml4LmNvbHMgPSBjb2xzO1xuICAgICAgICB0aGlzLnNwZWNpZmljLm1hdHJpeC5yb3dzID0gcm93cztcblxuICAgICAgICB0aGlzLndpZHRoID0gY29sU3BhY2luZyAqIChjb2xzIC0gMSkgKyAyICogY29sTWFyZ2luO1xuICAgICAgICB0aGlzLmhlaWdodCA9IHJvd1NwYWNpbmcgKiAocm93cyAtIDEpICsgMiAqIHJvd01hcmdpbjtcbiAgICAgICAgdGhpcy5zcGFjaW5nID0gTWF0aC5taW4oY29sU3BhY2luZywgcm93U3BhY2luZyk7XG5cbiAgICAgICAgbGV0IGNvdW50ID0gMDtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHJvd3M7IGorKykge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sczsgaSsrKSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuXG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IGNvdW50LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBjb25zdCB4ID0gKGNvbE1hcmdpbiArIGkgKiBjb2xTcGFjaW5nKSAvIHRoaXMud2lkdGg7XG4gICAgICAgICAgICBjb25zdCB5ID0gKHJvd01hcmdpbiArIGogKiByb3dTcGFjaW5nKSAvIHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSBbeCwgeV07XG5cbiAgICAgICAgICAgIHRoaXMubGFiZWxzLnB1c2gobGFiZWwpO1xuICAgICAgICAgICAgdGhpcy5jb29yZGluYXRlcy5wdXNoKGNvb3JkaW5hdGVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnc3VyZmFjZSc6XG4gICAgICAgIC8vIEB0b2RvIC0gYWxsb3cgb3RoZXIgc2hhcGVcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gcGFyYW1zLmhlaWdodCB8fCA0O1xuICAgICAgICBjb25zdCB3aWR0aCA9IHBhcmFtcy53aWR0aCB8fCA2O1xuICAgICAgICBjb25zdCBiYWNrZ3JvdW5kID0gcGFyYW1zLmJhY2tncm91bmQgfHzCoG51bGw7XG5cbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gYmFja2dyb3VuZDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuIl19