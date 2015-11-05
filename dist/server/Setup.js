'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var ServerModule = require('./ServerModule');
// import ServerModule from "./ServerModule.es6.js";

/**
 * The `Setup` module contains the information about the setup of the performance space in terms of its surface (*i.e.* dimensions and outlines) and predefined positions (*e.g.* seats or labels on the floor).
 *
 * For instance, say that the scenario requires 12 participants sitting on the floor on a grid of 3 ⨉ 4 positions, the `Setup` module would contain the information about the grid, including the positions' coordinates in space and their labels.
 * Similarly, if the scenario takes place in a theater where seats are numbered, the `Setup` module would contain the seating plan.
 *
 * If the topography of the performance space does not matter for a given scenario, the `Setup` module is not needed.
 *
 * The {@link ServerSetup} takes care of the setup on the server side.
 * In particular, the module provides helper functions that can generate a setup automatically from some parameters.
 */

var ServerSetup = (function (_ServerModule) {
  _inherits(ServerSetup, _ServerModule);

  // export default class ServerSetup extends ServerModule {
  /**
   * Creates and instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='setup'] Name of the module.
   */

  function ServerSetup() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerSetup);

    _get(Object.getPrototypeOf(ServerSetup.prototype), 'constructor', this).call(this, options.name || 'setup');

    this.width = 1;
    this.height = 1;
    this.spacing = 1;
    this.labels = [];
    this.coordinates = [];
    this.background = null;

    this.specific = {};

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

      client.receive(this.name + ':request', function () {
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

  return ServerSetup;
})(ServerModule);

module.exports = ServerSetup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2V0dXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7O0FBRWIsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7OztJQWN6QyxXQUFXO1lBQVgsV0FBVzs7Ozs7Ozs7O0FBT0osV0FQUCxXQUFXLEdBT1c7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVBwQixXQUFXOztBQVFiLCtCQVJFLFdBQVcsNkNBUVAsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLEVBQUU7O0FBRS9CLFFBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsUUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDaEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDakIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDdEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7O0FBRXZCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOztBQUVuQixRQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztHQUN2Qjs7Ozs7O2VBcEJHLFdBQVc7O1dBeUJSLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBMUJFLFdBQVcseUNBMEJDLE1BQU0sRUFBRTs7QUFFdEIsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsRUFBRSxZQUFNO0FBQzNDLGNBQU0sQ0FBQyxJQUFJLENBQUMsTUFBSyxJQUFJLEdBQUcsT0FBTyxFQUFFO0FBQy9CLGlCQUFPLEVBQUUsTUFBSyxLQUFLO0FBQ25CLGtCQUFRLEVBQUUsTUFBSyxNQUFNO0FBQ3JCLHNCQUFZLEVBQUUsTUFBSyxVQUFVO0FBQzdCLG1CQUFTLEVBQUUsTUFBSyxPQUFPO0FBQ3ZCLGtCQUFRLEVBQUUs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WyIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFNlcnZlck1vZHVsZSA9IHJlcXVpcmUoJy4vU2VydmVyTW9kdWxlJyk7XG4vLyBpbXBvcnQgU2VydmVyTW9kdWxlIGZyb20gXCIuL1NlcnZlck1vZHVsZS5lczYuanNcIjtcblxuLyoqXG4gKiBUaGUgYFNldHVwYCBtb2R1bGUgY29udGFpbnMgdGhlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBzZXR1cCBvZiB0aGUgcGVyZm9ybWFuY2Ugc3BhY2UgaW4gdGVybXMgb2YgaXRzIHN1cmZhY2UgKCppLmUuKiBkaW1lbnNpb25zIGFuZCBvdXRsaW5lcykgYW5kIHByZWRlZmluZWQgcG9zaXRpb25zICgqZS5nLiogc2VhdHMgb3IgbGFiZWxzIG9uIHRoZSBmbG9vcikuXG4gKlxuICogRm9yIGluc3RhbmNlLCBzYXkgdGhhdCB0aGUgc2NlbmFyaW8gcmVxdWlyZXMgMTIgcGFydGljaXBhbnRzIHNpdHRpbmcgb24gdGhlIGZsb29yIG9uIGEgZ3JpZCBvZiAzIOKoiSA0IHBvc2l0aW9ucywgdGhlIGBTZXR1cGAgbW9kdWxlIHdvdWxkIGNvbnRhaW4gdGhlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBncmlkLCBpbmNsdWRpbmcgdGhlIHBvc2l0aW9ucycgY29vcmRpbmF0ZXMgaW4gc3BhY2UgYW5kIHRoZWlyIGxhYmVscy5cbiAqIFNpbWlsYXJseSwgaWYgdGhlIHNjZW5hcmlvIHRha2VzIHBsYWNlIGluIGEgdGhlYXRlciB3aGVyZSBzZWF0cyBhcmUgbnVtYmVyZWQsIHRoZSBgU2V0dXBgIG1vZHVsZSB3b3VsZCBjb250YWluIHRoZSBzZWF0aW5nIHBsYW4uXG4gKlxuICogSWYgdGhlIHRvcG9ncmFwaHkgb2YgdGhlIHBlcmZvcm1hbmNlIHNwYWNlIGRvZXMgbm90IG1hdHRlciBmb3IgYSBnaXZlbiBzY2VuYXJpbywgdGhlIGBTZXR1cGAgbW9kdWxlIGlzIG5vdCBuZWVkZWQuXG4gKlxuICogVGhlIHtAbGluayBTZXJ2ZXJTZXR1cH0gdGFrZXMgY2FyZSBvZiB0aGUgc2V0dXAgb24gdGhlIHNlcnZlciBzaWRlLlxuICogSW4gcGFydGljdWxhciwgdGhlIG1vZHVsZSBwcm92aWRlcyBoZWxwZXIgZnVuY3Rpb25zIHRoYXQgY2FuIGdlbmVyYXRlIGEgc2V0dXAgYXV0b21hdGljYWxseSBmcm9tIHNvbWUgcGFyYW1ldGVycy5cbiAqL1xuY2xhc3MgU2VydmVyU2V0dXAgZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuLy8gZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyU2V0dXAgZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbmQgaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5uYW1lPSdzZXR1cCddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnc2V0dXAnKTtcblxuICAgIHRoaXMud2lkdGggPSAxO1xuICAgIHRoaXMuaGVpZ2h0ID0gMTtcbiAgICB0aGlzLnNwYWNpbmcgPSAxO1xuICAgIHRoaXMubGFiZWxzID0gW107XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IFtdO1xuICAgIHRoaXMuYmFja2dyb3VuZCA9IG51bGw7XG5cbiAgICB0aGlzLnNwZWNpZmljID0ge307XG5cbiAgICB0aGlzLnR5cGUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgY2xpZW50LnJlY2VpdmUodGhpcy5uYW1lICsgJzpyZXF1ZXN0JywgKCkgPT4ge1xuICAgICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzppbml0Jywge1xuICAgICAgICBcIndpZHRoXCI6IHRoaXMud2lkdGgsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRoaXMuaGVpZ2h0LFxuICAgICAgICBcImJhY2tncm91bmRcIjogdGhpcy5iYWNrZ3JvdW5kLFxuICAgICAgICBcInNwYWNpbmdcIjogdGhpcy5zcGFjaW5nLFxuICAgICAgICBcImxhYmVsc1wiOiB0aGlzLmxhYmVscyxcbiAgICAgICAgXCJjb29yZGluYXRlc1wiOiB0aGlzLmNvb3JkaW5hdGVzLFxuICAgICAgICBcInR5cGVcIjogdGhpcy50eXBlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IHdpdGggdGhlIGNvb3JkaW5hdGVzIG9mIGEgcHJlZGVmaW5lZCBwb3NpdGlvbiBvZiB0aGUgc2V0dXAuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBQb3NpdGlvbiBpbmRleCBhYm91dCB3aGljaCB3ZSB3YW50IHRoZSBjb29yZGluYXRlcy5cbiAgICogQHJldHVybiB7TnVtYmVyW119IENvb3JkaW5hdGVzIG9mIHRoZSBwb3NpdGlvbiAoYFt4LCB5XWApLlxuICAgKi9cbiAgZ2V0Q29vcmRpbmF0ZXMoaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggPCB0aGlzLmNvb3JkaW5hdGVzLmxlbmd0aClcbiAgICAgIHJldHVybiB0aGlzLmNvb3JkaW5hdGVzW2luZGV4XTtcblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxhYmVsIG9mIGEgcHJlZGVmaW5lZCBwb3NpdGlvbiBvZiB0aGUgc2V0dXAuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBQb3NpdGlvbiBpbmRleCBhYm91dCB3aGljaCB3ZSB3YW50IHRoZSBjb29yZGluYXRlcy5cbiAgICogQHJldHVybiB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgcG9zaXRpb24uXG4gICAqL1xuICBnZXRMYWJlbChpbmRleCkge1xuICAgIGlmIChpbmRleCA8IHRoaXMubGFiZWxzLmxlbmd0aClcbiAgICAgIHJldHVybiB0aGlzLmxhYmVsc1tpbmRleF07XG5cbiAgICByZXR1cm4gKGluZGV4ICsgMSkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0b3RhbCBudW1iZXIgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGFuZCAvIG9yIGxhYmVscykgb2YgdGhlIHNldHVwLlxuICAgKlxuICAgKiBGb3IgaW5zdGFuY2UsIGlmIHRoZSBzZXR1cCBpcyBhIDQg4qiJIDUgbWF0cml4IHRoZSBtZXRob2Qgd291bGQgcmV0dXJuIDIwLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IE51bWJlciBvZiBwcmVkZWZpbmVkIHBvc2l0aW9ucyBvZiB0aGUgc2V0dXAuXG4gICAqL1xuICBnZXROdW1Qb3NpdGlvbnMoKSB7XG4gICAgaWYodGhpcy5sYWJlbHMubGVuZ3RoIHx8IHRoaXMuY29vcmRpbmF0ZXMubGVuZ3RoKSB7XG4gICAgICB2YXIgbnVtTGFiZWxzID0gdGhpcy5sYWJlbHMubGVuZ3RoIHx8IEluZmluaXR5O1xuICAgICAgdmFyIG51bUNvb3JkaW5hdGVzID0gdGhpcy5jb29yZGluYXRlcy5sZW5ndGggfHwgSW5maW5pdHk7XG5cbiAgICAgIHJldHVybiBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgc2V0dXAuXG4gICAqIEByZXR1cm4ge09iamVjdH0gRGVzY3JpcHRpb24gb2YgdGhlIHNldHVwLlxuICAgKiBAcHJvcGVydHkge051bWJlcn0gaGVpZ2h0IEhlaWdodCBvZiB0aGUgc2V0dXAuXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB3aWR0aCBXaWR0aCBvZiB0aGUgc2V0dXAuXG4gICAqL1xuICBnZXRTdXJmYWNlKCkge1xuICAgIGxldCBzdXJmYWNlID0ge1xuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoXG4gICAgICAvLyBUT0RPOiBhbGxvdyBvdGhlciBzaGFwZXNcbiAgICB9XG5cbiAgICByZXR1cm4gc3VyZmFjZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBzdXJmYWNlIGFuZCAvIG9yIHByZWRlZmluZWQgcG9zaXRpb25zIGFjY29yZGluZyB0byBhIGdpdmVuIHR5cGUgb2YgZ2VvbWV0cnkgKGB0eXBlYCkgYW5kIHRoZSBjb3JyZXNwb25kaW5nIHBhcmFtZXRlcnMgKGBwYXJhbXNgKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVHlwZSBvZiBnZW9tZXRyeSB0byBnZW5lcmF0ZS4gQWNjZXB0cyB0aGUgZm9sbG93aW5nIHZhbHVlczpcbiAgICogLSBgJ21hdHJpeCdgOiBhIHJlZ3VsYXIgbWF0cml4IGNvbXBvc2VkIG9mICpuKiBsaW5lcyBhbmQgKm0qIGNvbHVtbnMgYXMgZGVmaW5lZCBpbiB0aGUgYHBhcmFtc2A7XG4gICAqIC0gYCdzdXJmYWNlJ2A6IGEgcmVjdGFuZ3VsYXIgc3VyZmFjZSwgdGhhdCBtaWdodCBiZSByZXByZXNlbnRlZCBvbiBhIGJhY2tncm91bmQgaW1hZ2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zPXt9XSBQYXJhbWV0ZXJzIG9mIHRoZSBzZXR1cCB0byBnZW5lcmF0ZS4gQWNjZXB0cyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXMsIGRlcGVuZGluZyBvbiB0aGUgYHR5cGVgOlxuICAgKiAtIHR5cGUgYCdtYXRyaXgnYDpcbiAgICogICAtIGBjb2xzOk51bWJlcmAsIG51bWJlciBvZiBjb2x1bW5zIChkZWZhdWx0cyB0byAzKTtcbiAgICogICAtIGByb3dzOk51bWJlcmAsIG51bWJlciBvZiByb3dzIChkZWZhdWx0cyB0byA0KTtcbiAgICogICAtIGBjb2xTcGFjaW5nOk51bWJlcmAsIHNwYWNpbmcgYmV0d2VlbiBjb2x1bW5zIChpbiBtZXRlcnMpIChkZWZhdWx0cyB0byAxKTtcbiAgICogICAtIGByb3dTcGFjaW5nOk51bWJlcmAsIHNwYWNpbmcgYmV0d2VlbiByb3dzIChpbiBtZXRlcnMpIChkZWZhdWx0cyB0byAxKTtcbiAgICogICAtIGBjb2xNYXJnaW5gLCAoaG9yaXpvbnRhbCkgbWFyZ2lucyBiZXR3ZWVuIHRoZSBib3JkZXJzIG9mIHRoZSBwZXJmb3JtYW5jZSBzcGFjZSBhbmQgdGhlIGZpcnN0IG9yIGxhc3QgY29sdW1uIChpbiBtZXRlcnMpIChkZWZhdWx0cyB0byBgY29sU3BhY2luZyAvIDJgKTtcbiAgICogICAtIGByb3dNYXJnaW5gLCAodmVydGljYWwpIG1hcmdpbnMgYmV0d2VlbiB0aGUgYm9yZGVycyBvZiB0aGUgcGVyZm9ybWFuY2Ugc3BhY2UgYW5kIHRoZSBmaXJzdCBvciBsYXN0IHJvdyAoaW4gbWV0ZXJzKSAoZGVmYXVsdHMgdG8gYHJvd1NwYWNpbmcgLyAyYCk7XG4gICAqIC0gdHlwZSBgJ3N1cmZhY2UnYDpcbiAgICogICAtIGBoZWlnaHQ6TnVtYmVyYDogaGVpZ2h0IG9mIHRoZSBzdXJmYWNlIChpbiBtZXRlcnMpO1xuICAgKiAgIC0gYHdpZHRoOk51bWJlcmA6IHdpZHRoIG9mIHRoZSBzdXJmYWNlIChpbiBtZXRlcnMpO1xuICAgKiAgIC0gYGJhY2tncm91bmQ6U3RyaW5nYDogVVJMIG9mIHRoZSBiYWNrZ3JvdW5kIGltYWdlLlxuICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGdlbmVyYXRlKHR5cGUsIHBhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnbWF0cml4JzpcbiAgICAgICAgbGV0IGNvbHMgPSBwYXJhbXMuY29scyB8fCAzO1xuICAgICAgICBsZXQgcm93cyA9IHBhcmFtcy5yb3dzIHx8IDQ7XG4gICAgICAgIGxldCBjb2xTcGFjaW5nID0gcGFyYW1zLmNvbFNwYWNpbmcgfHwgMTtcbiAgICAgICAgbGV0IHJvd1NwYWNpbmcgPSBwYXJhbXMucm93U3BhY2luZyB8fCAxO1xuICAgICAgICBsZXQgY29sTWFyZ2luID0gcGFyYW1zLmNvbE1hcmdpbiB8fCBjb2xTcGFjaW5nIC8gMjtcbiAgICAgICAgbGV0IHJvd01hcmdpbiA9IHBhcmFtcy5yb3dNYXJnaW4gfHwgcm93U3BhY2luZyAvIDI7XG5cbiAgICAgICAgdGhpcy5zcGVjaWZpYy5tYXRyaXggPSB7fTtcbiAgICAgICAgdGhpcy5zcGVjaWZpYy5tYXRyaXguY29scyA9IGNvbHM7XG4gICAgICAgIHRoaXMuc3BlY2lmaWMubWF0cml4LnJvd3MgPSByb3dzO1xuXG4gICAgICAgIHRoaXMud2lkdGggPSBjb2xTcGFjaW5nICogKGNvbHMgLSAxKSArIDIgKiBjb2xNYXJnaW47XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gcm93U3BhY2luZyAqIChyb3dzIC0gMSkgKyAyICogcm93TWFyZ2luO1xuICAgICAgICB0aGlzLnNwYWNpbmcgPSBNYXRoLm1pbihjb2xTcGFjaW5nLCByb3dTcGFjaW5nKTtcblxuICAgICAgICBsZXQgY291bnQgPSAwO1xuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcm93czsgaisrKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2xzOyBpKyspIHtcbiAgICAgICAgICAgIGNvdW50Kys7XG5cbiAgICAgICAgICAgIGxldCBsYWJlbCA9IGNvdW50LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBsZXQgY29vcmRpbmF0ZXMgPSBbKGNvbE1hcmdpbiArIGkgKiBjb2xTcGFjaW5nKSAvIHRoaXMud2lkdGgsIChyb3dNYXJnaW4gKyBqICogcm93U3BhY2luZykgLyB0aGlzLmhlaWdodF07XG5cbiAgICAgICAgICAgIHRoaXMubGFiZWxzLnB1c2gobGFiZWwpO1xuICAgICAgICAgICAgdGhpcy5jb29yZGluYXRlcy5wdXNoKGNvb3JkaW5hdGVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnc3VyZmFjZSc6XG4gICAgICAgIGxldCBoZWlnaHQgPSBwYXJhbXMuaGVpZ2h0IHx8IDQ7XG4gICAgICAgIGxldCB3aWR0aCA9IHBhcmFtcy53aWR0aCB8fCA2O1xuICAgICAgICBsZXQgYmFja2dyb3VuZCA9IHBhcmFtcy5iYWNrZ3JvdW5kIHx8wqBudWxsO1xuXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IGJhY2tncm91bmQ7XG5cbiAgICAgICAgLy8gVE9ETzogYWxsb3cgb3RoZXIgc2hhcGVzXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXJ2ZXJTZXR1cDtcbiJdfQ==