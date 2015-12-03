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
 * The `ServerSetup` module contains the information about the setup of the performance space in terms of its surface (*i.e.* dimensions and outlines) and predefined positions (*e.g.* seats or labels on the floor).
 *
 * For instance, say that the scenario requires 12 participants sitting on the floor on a grid of 3 ⨉ 4 positions, the `ServerSetup` module would contain the information about the grid, including the positions' coordinates in space and their labels.
 * Similarly, if the scenario takes place in a theater where seats are numbered, the `ServerSetup` module would contain the seating plan.
 *
 * If the topography of the performance space does not matter for a given scenario, the `ServerSetup` module is not needed.
 *
 * The {@link ServerSetup} takes care of the setup on the server side.
 * In particular, the module provides helper functions that can generate a setup automatically from some parameters.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyU2V0dXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBbUIsVUFBVTs7Ozs7Ozs7Ozs7Ozs7OztJQWFSLFdBQVc7WUFBWCxXQUFXOzs7Ozs7OztBQU1uQixXQU5RLFdBQVcsR0FNSjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTkwsV0FBVzs7QUFPNUIsK0JBUGlCLFdBQVcsNkNBT3RCLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxFQUFFOzs7Ozs7QUFNL0IsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1mLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7QUFNaEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1qQixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBTWpCLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNdEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Ozs7OztBQU12QixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7QUFRbkIsUUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7R0FDdkI7Ozs7OztlQTFEa0IsV0FBVzs7V0ErRHZCLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBaEVpQixXQUFXLHlDQWdFZCxNQUFNLEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxZQUFNO0FBQ3BDLGNBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDeEIsZUFBSyxFQUFFLE1BQUssS0FBSztBQUNqQixnQkFBTSxFQUFFLE1BQUssTUFBTTtBQUNuQixvQkFBVSxFQUFFLE1BQUssVUFBVTtBQUMzQixpQkFBTyxFQUFFLE1BQUssT0FBTztBQUNyQixnQkFBTSxFQUFFLE1BQUssTUFBTTtBQUNu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Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cbi8qKlxuICogVGhlIGBTZXJ2ZXJTZXR1cGAgbW9kdWxlIGNvbnRhaW5zIHRoZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc2V0dXAgb2YgdGhlIHBlcmZvcm1hbmNlIHNwYWNlIGluIHRlcm1zIG9mIGl0cyBzdXJmYWNlICgqaS5lLiogZGltZW5zaW9ucyBhbmQgb3V0bGluZXMpIGFuZCBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoKmUuZy4qIHNlYXRzIG9yIGxhYmVscyBvbiB0aGUgZmxvb3IpLlxuICpcbiAqIEZvciBpbnN0YW5jZSwgc2F5IHRoYXQgdGhlIHNjZW5hcmlvIHJlcXVpcmVzIDEyIHBhcnRpY2lwYW50cyBzaXR0aW5nIG9uIHRoZSBmbG9vciBvbiBhIGdyaWQgb2YgMyDiqIkgNCBwb3NpdGlvbnMsIHRoZSBgU2VydmVyU2V0dXBgIG1vZHVsZSB3b3VsZCBjb250YWluIHRoZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZ3JpZCwgaW5jbHVkaW5nIHRoZSBwb3NpdGlvbnMnIGNvb3JkaW5hdGVzIGluIHNwYWNlIGFuZCB0aGVpciBsYWJlbHMuXG4gKiBTaW1pbGFybHksIGlmIHRoZSBzY2VuYXJpbyB0YWtlcyBwbGFjZSBpbiBhIHRoZWF0ZXIgd2hlcmUgc2VhdHMgYXJlIG51bWJlcmVkLCB0aGUgYFNlcnZlclNldHVwYCBtb2R1bGUgd291bGQgY29udGFpbiB0aGUgc2VhdGluZyBwbGFuLlxuICpcbiAqIElmIHRoZSB0b3BvZ3JhcGh5IG9mIHRoZSBwZXJmb3JtYW5jZSBzcGFjZSBkb2VzIG5vdCBtYXR0ZXIgZm9yIGEgZ2l2ZW4gc2NlbmFyaW8sIHRoZSBgU2VydmVyU2V0dXBgIG1vZHVsZSBpcyBub3QgbmVlZGVkLlxuICpcbiAqIFRoZSB7QGxpbmsgU2VydmVyU2V0dXB9IHRha2VzIGNhcmUgb2YgdGhlIHNldHVwIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAqIEluIHBhcnRpY3VsYXIsIHRoZSBtb2R1bGUgcHJvdmlkZXMgaGVscGVyIGZ1bmN0aW9ucyB0aGF0IGNhbiBnZW5lcmF0ZSBhIHNldHVwIGF1dG9tYXRpY2FsbHkgZnJvbSBzb21lIHBhcmFtZXRlcnMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlclNldHVwIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW5kIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubmFtZT0nc2V0dXAnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3NldHVwJyk7XG5cbiAgICAvKipcbiAgICAgKiBXaWR0aCBvZiB0aGUgc2V0dXAgKGluIG1ldGVycykuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLndpZHRoID0gMTtcblxuICAgIC8qKlxuICAgICAqIEhlaWdodCBvZiB0aGUgc2V0dXAgKGluIG1ldGVycykuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmhlaWdodCA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBNaW5pbXVtIHNwYWNpbmcgYmV0d2VlbiBwb3NpdGlvbnMgb2YgdGhlIHNldHVwIChpbiBtZXRlcnMpLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5zcGFjaW5nID0gMTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIHRoZSBwb3NpdGlvbnMnIGxhYmVscy5cbiAgICAgKiBAdHlwZSB7U3RyaW5nW119XG4gICAgICovXG4gICAgdGhpcy5sYWJlbHMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIHRoZSBwb3NpdGlvbnMnIGNvb3JkaW5hdGVzIChpbiB0aGUgZm9ybWF0IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWApLlxuICAgICAqIEB0eXBlIHtBcnJheVtdfVxuICAgICAqL1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIFVSTCBvZiB0aGUgYmFja2dyb3VuZCBpbWFnZSAoaWYgYW55KS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuYmFja2dyb3VuZCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCBwYXJhbWV0ZXJzIHNwZWNpZmljIHRvIGEgY2VydGFpbiB0eXBlIG9mIHNldHVwICgqZS5nLiogYSAnbWF0cml4J2ApLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5zcGVjaWZpYyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogVHlwZSBvZiB0aGUgc2V0dXAuIEN1cnJlbnRseSBzdXBwb3J0ZWQgdHlwZXMgYXJlOlxuICAgICAqIC0gYCdtYXRyaXgnYDtcbiAgICAgKiAtIGAnc3VyZmFjZSdgLlxuICAgICAqIEB0eXBlIHtbdHlwZV19XG4gICAgICovXG4gICAgdGhpcy50eXBlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgKCkgPT4ge1xuICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ2luaXQnLCB7XG4gICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgICBiYWNrZ3JvdW5kOiB0aGlzLmJhY2tncm91bmQsXG4gICAgICAgIHNwYWNpbmc6IHRoaXMuc3BhY2luZyxcbiAgICAgICAgbGFiZWxzOiB0aGlzLmxhYmVscyxcbiAgICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuY29vcmRpbmF0ZXMsXG4gICAgICAgIHR5cGU6IHRoaXMudHlwZVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSB3aXRoIHRoZSBjb29yZGluYXRlcyBvZiBhIHByZWRlZmluZWQgcG9zaXRpb24gb2YgdGhlIHNldHVwLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggUG9zaXRpb24gaW5kZXggYWJvdXQgd2hpY2ggd2Ugd2FudCB0aGUgY29vcmRpbmF0ZXMuXG4gICAqIEByZXR1cm4ge051bWJlcltdfSBDb29yZGluYXRlcyBvZiB0aGUgcG9zaXRpb24gKGBbeCwgeV1gKS5cbiAgICovXG4gIGdldENvb3JkaW5hdGVzKGluZGV4KSB7XG4gICAgaWYgKGluZGV4IDwgdGhpcy5jb29yZGluYXRlcy5sZW5ndGgpXG4gICAgICByZXR1cm4gdGhpcy5jb29yZGluYXRlc1tpbmRleF07XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBsYWJlbCBvZiBhIHByZWRlZmluZWQgcG9zaXRpb24gb2YgdGhlIHNldHVwLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggUG9zaXRpb24gaW5kZXggYWJvdXQgd2hpY2ggd2Ugd2FudCB0aGUgY29vcmRpbmF0ZXMuXG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGFiZWwgb2YgdGhlIHBvc2l0aW9uLlxuICAgKi9cbiAgZ2V0TGFiZWwoaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggPCB0aGlzLmxhYmVscy5sZW5ndGgpXG4gICAgICByZXR1cm4gdGhpcy5sYWJlbHNbaW5kZXhdO1xuXG4gICAgcmV0dXJuIChpbmRleCArIDEpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdG90YWwgbnVtYmVyIG9mIHByZWRlZmluZWQgcG9zaXRpb25zIChhbmQgLyBvciBsYWJlbHMpIG9mIHRoZSBzZXR1cC5cbiAgICpcbiAgICogRm9yIGluc3RhbmNlLCBpZiB0aGUgc2V0dXAgaXMgYSA0IOKoiSA1IG1hdHJpeCB0aGUgbWV0aG9kIHdvdWxkIHJldHVybiAyMC5cbiAgICogQHJldHVybiB7TnVtYmVyfSBOdW1iZXIgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgb2YgdGhlIHNldHVwLlxuICAgKi9cbiAgZ2V0TnVtUG9zaXRpb25zKCkge1xuICAgIGlmKHRoaXMubGFiZWxzLmxlbmd0aCB8fCB0aGlzLmNvb3JkaW5hdGVzLmxlbmd0aCkge1xuICAgICAgY29uc3QgbnVtTGFiZWxzID0gdGhpcy5sYWJlbHMubGVuZ3RoIHx8IEluZmluaXR5O1xuICAgICAgY29uc3QgbnVtQ29vcmRpbmF0ZXMgPSB0aGlzLmNvb3JkaW5hdGVzLmxlbmd0aCB8fCBJbmZpbml0eTtcblxuICAgICAgcmV0dXJuIE1hdGgubWluKG51bUxhYmVscywgbnVtQ29vcmRpbmF0ZXMpO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBzZXR1cC5cbiAgICogQHJldHVybiB7T2JqZWN0fSBEZXNjcmlwdGlvbiBvZiB0aGUgc2V0dXAuXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBoZWlnaHQgSGVpZ2h0IG9mIHRoZSBzZXR1cC5cbiAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHdpZHRoIFdpZHRoIG9mIHRoZSBzZXR1cC5cbiAgICovXG4gIGdldFN1cmZhY2UoKSB7XG4gICAgLy8gQHRvZG8gLSBhbGxvdyBvdGhlciBzaGFwZXNcbiAgICBjb25zdCBzdXJmYWNlID0ge1xuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoXG4gICAgfVxuXG4gICAgcmV0dXJuIHN1cmZhY2U7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgc3VyZmFjZSBhbmQgLyBvciBwcmVkZWZpbmVkIHBvc2l0aW9ucyBhY2NvcmRpbmcgdG8gYSBnaXZlbiB0eXBlIG9mIGdlb21ldHJ5IChgdHlwZWApIGFuZCB0aGUgY29ycmVzcG9uZGluZyBwYXJhbWV0ZXJzIChgcGFyYW1zYCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFR5cGUgb2YgZ2VvbWV0cnkgdG8gZ2VuZXJhdGUuIEFjY2VwdHMgdGhlIGZvbGxvd2luZyB2YWx1ZXM6XG4gICAqIC0gYCdtYXRyaXgnYDogYSByZWd1bGFyIG1hdHJpeCBjb21wb3NlZCBvZiAqbiogbGluZXMgYW5kICptKiBjb2x1bW5zIGFzIGRlZmluZWQgaW4gdGhlIGBwYXJhbXNgO1xuICAgKiAtIGAnc3VyZmFjZSdgOiBhIHJlY3Rhbmd1bGFyIHN1cmZhY2UsIHRoYXQgbWlnaHQgYmUgcmVwcmVzZW50ZWQgb24gYSBiYWNrZ3JvdW5kIGltYWdlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcz17fV0gUGFyYW1ldGVycyBvZiB0aGUgc2V0dXAgdG8gZ2VuZXJhdGUuIEFjY2VwdHMgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzLCBkZXBlbmRpbmcgb24gdGhlIGB0eXBlYDpcbiAgICogLSB0eXBlIGAnbWF0cml4J2A6XG4gICAqICAgLSBgY29sczpOdW1iZXJgLCBudW1iZXIgb2YgY29sdW1ucyAoZGVmYXVsdHMgdG8gMyk7XG4gICAqICAgLSBgcm93czpOdW1iZXJgLCBudW1iZXIgb2Ygcm93cyAoZGVmYXVsdHMgdG8gNCk7XG4gICAqICAgLSBgY29sU3BhY2luZzpOdW1iZXJgLCBzcGFjaW5nIGJldHdlZW4gY29sdW1ucyAoaW4gbWV0ZXJzKSAoZGVmYXVsdHMgdG8gMSk7XG4gICAqICAgLSBgcm93U3BhY2luZzpOdW1iZXJgLCBzcGFjaW5nIGJldHdlZW4gcm93cyAoaW4gbWV0ZXJzKSAoZGVmYXVsdHMgdG8gMSk7XG4gICAqICAgLSBgY29sTWFyZ2luYCwgKGhvcml6b250YWwpIG1hcmdpbnMgYmV0d2VlbiB0aGUgYm9yZGVycyBvZiB0aGUgcGVyZm9ybWFuY2Ugc3BhY2UgYW5kIHRoZSBmaXJzdCBvciBsYXN0IGNvbHVtbiAoaW4gbWV0ZXJzKSAoZGVmYXVsdHMgdG8gYGNvbFNwYWNpbmcgLyAyYCk7XG4gICAqICAgLSBgcm93TWFyZ2luYCwgKHZlcnRpY2FsKSBtYXJnaW5zIGJldHdlZW4gdGhlIGJvcmRlcnMgb2YgdGhlIHBlcmZvcm1hbmNlIHNwYWNlIGFuZCB0aGUgZmlyc3Qgb3IgbGFzdCByb3cgKGluIG1ldGVycykgKGRlZmF1bHRzIHRvIGByb3dTcGFjaW5nIC8gMmApO1xuICAgKiAtIHR5cGUgYCdzdXJmYWNlJ2A6XG4gICAqICAgLSBgaGVpZ2h0Ok51bWJlcmA6IGhlaWdodCBvZiB0aGUgc3VyZmFjZSAoaW4gbWV0ZXJzKTtcbiAgICogICAtIGB3aWR0aDpOdW1iZXJgOiB3aWR0aCBvZiB0aGUgc3VyZmFjZSAoaW4gbWV0ZXJzKTtcbiAgICogICAtIGBiYWNrZ3JvdW5kOlN0cmluZ2A6IFVSTCBvZiB0aGUgYmFja2dyb3VuZCBpbWFnZS5cbiAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBnZW5lcmF0ZSh0eXBlLCBwYXJhbXMgPSB7fSkge1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ21hdHJpeCc6XG4gICAgICAgIGNvbnN0IGNvbHMgPSBwYXJhbXMuY29scyB8fCAzO1xuICAgICAgICBjb25zdCByb3dzID0gcGFyYW1zLnJvd3MgfHwgNDtcbiAgICAgICAgY29uc3QgY29sU3BhY2luZyA9IHBhcmFtcy5jb2xTcGFjaW5nIHx8IDE7XG4gICAgICAgIGNvbnN0IHJvd1NwYWNpbmcgPSBwYXJhbXMucm93U3BhY2luZyB8fCAxO1xuICAgICAgICBjb25zdCBjb2xNYXJnaW4gPSBwYXJhbXMuY29sTWFyZ2luIHx8IGNvbFNwYWNpbmcgLyAyO1xuICAgICAgICBjb25zdCByb3dNYXJnaW4gPSBwYXJhbXMucm93TWFyZ2luIHx8IHJvd1NwYWNpbmcgLyAyO1xuXG4gICAgICAgIHRoaXMuc3BlY2lmaWMubWF0cml4ID0ge307XG4gICAgICAgIHRoaXMuc3BlY2lmaWMubWF0cml4LmNvbHMgPSBjb2xzO1xuICAgICAgICB0aGlzLnNwZWNpZmljLm1hdHJpeC5yb3dzID0gcm93cztcblxuICAgICAgICB0aGlzLndpZHRoID0gY29sU3BhY2luZyAqIChjb2xzIC0gMSkgKyAyICogY29sTWFyZ2luO1xuICAgICAgICB0aGlzLmhlaWdodCA9IHJvd1NwYWNpbmcgKiAocm93cyAtIDEpICsgMiAqIHJvd01hcmdpbjtcbiAgICAgICAgdGhpcy5zcGFjaW5nID0gTWF0aC5taW4oY29sU3BhY2luZywgcm93U3BhY2luZyk7XG5cbiAgICAgICAgbGV0IGNvdW50ID0gMDtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHJvd3M7IGorKykge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sczsgaSsrKSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuXG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IGNvdW50LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBjb25zdCB4ID0gKGNvbE1hcmdpbiArIGkgKiBjb2xTcGFjaW5nKSAvIHRoaXMud2lkdGg7XG4gICAgICAgICAgICBjb25zdCB5ID0gKHJvd01hcmdpbiArIGogKiByb3dTcGFjaW5nKSAvIHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSBbeCwgeV07XG5cbiAgICAgICAgICAgIHRoaXMubGFiZWxzLnB1c2gobGFiZWwpO1xuICAgICAgICAgICAgdGhpcy5jb29yZGluYXRlcy5wdXNoKGNvb3JkaW5hdGVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N1cmZhY2UnOlxuICAgICAgICAvLyBAdG9kbyAtIGFsbG93IG90aGVyIHNoYXBlXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IHBhcmFtcy5oZWlnaHQgfHwgNDtcbiAgICAgICAgY29uc3Qgd2lkdGggPSBwYXJhbXMud2lkdGggfHwgNjtcbiAgICAgICAgY29uc3QgYmFja2dyb3VuZCA9IHBhcmFtcy5iYWNrZ3JvdW5kIHx8wqBudWxsO1xuXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IGJhY2tncm91bmQ7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn1cbiJdfQ==