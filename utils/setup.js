'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.setupMatrix = setupMatrix;

var _helpers = require('helpers');

var _helpers2 = _interopRequireDefault(_helpers);

/**
 * Generates a matrix setup according to the given parameters.
 *
 * @param {Object} [params={}] Matrix parameters:
 *   - `width:Number`, number of columns (defaults to `10`);
 *   - `height:Number`, number of rows (defaults to `10`);
 *   - `cols:Number`, number of columns (defaults to `3`);
 *   - `rows:Number`, number of rows (defaults to `4`);
 *   - `colMargin:Number`, (horizontal) margins between the borders of the space and the first or last column in meters (defaults to `0`);
 *   - `rowMargin:Number`, (vertical) margins between the borders of the space and the first or last row (n meters (defaults to `0`);
 *   - `relColMargin:Number`, (horizontal) margins between the borders of the space and the first or last column relative to the space between two columns (defaults to `0.5`);
 *   - `relRowMargin:Number`, (vertical) margins between the borders of the space and the first or last row relative to the space between two rows (defaults to `0.5`);
 */

function setupMatrix() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var config = {};
  var width = (0, _helpers2['default'])(params.width, 10, 0);
  var height = (0, _helpers2['default'])(params.height, 10, 0);
  var cols = (0, _helpers2['default'])(params.cols, 3, 1);
  var rows = (0, _helpers2['default'])(params.rows, 4, 1);
  var relColMargin = (0, _helpers2['default'])(params.colMargin, 0.5, 0);
  var relRowMargin = (0, _helpers2['default'])(params.rowMargin, 0.5, 0);
  var absColMargin = (0, _helpers2['default'])(params.colMargin, 0, 0);
  var absRowMargin = (0, _helpers2['default'])(params.rowMargin, 0, 0);
  var colSpacing = (width - 2 * colMargin) / (cols - 1 + 2 * relColMargin);
  var rowSpacing = (height - 2 * rowMargin) / (rows - 1 + 2 * relRowMargin);
  var colMargin = absColMargin + colSpacing * relColMargin;
  var rowMargin = absRowMargin + rowSpacing * relRowMargin;

  config.spacing = Math.min(colSpacing, rowSpacing);

  config.topology = {
    type: 'matrix',
    cols: cols,
    rows: rows
  };

  var count = 0;

  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      count++;

      var label = count.toString();
      var x = (colMargin + i * colSpacing) / width;
      var y = (rowMargin + j * rowSpacing) / height;
      var coordinates = [x, y];

      this.labels.push(label);
      this.coordinates.push(coordinates);
    }
  }
}

;
//# sourceMappingURL=data:application/json;base64,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Q0Y7O0FBQUEsQ0FBQyIsImZpbGUiOiJzcmMvdXRpbHMvc2V0dXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ2V0T3B0IGZyb20gJ2hlbHBlcnMnO1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIG1hdHJpeCBzZXR1cCBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXM9e31dIE1hdHJpeCBwYXJhbWV0ZXJzOlxuICogICAtIGB3aWR0aDpOdW1iZXJgLCBudW1iZXIgb2YgY29sdW1ucyAoZGVmYXVsdHMgdG8gYDEwYCk7XG4gKiAgIC0gYGhlaWdodDpOdW1iZXJgLCBudW1iZXIgb2Ygcm93cyAoZGVmYXVsdHMgdG8gYDEwYCk7XG4gKiAgIC0gYGNvbHM6TnVtYmVyYCwgbnVtYmVyIG9mIGNvbHVtbnMgKGRlZmF1bHRzIHRvIGAzYCk7XG4gKiAgIC0gYHJvd3M6TnVtYmVyYCwgbnVtYmVyIG9mIHJvd3MgKGRlZmF1bHRzIHRvIGA0YCk7XG4gKiAgIC0gYGNvbE1hcmdpbjpOdW1iZXJgLCAoaG9yaXpvbnRhbCkgbWFyZ2lucyBiZXR3ZWVuIHRoZSBib3JkZXJzIG9mIHRoZSBzcGFjZSBhbmQgdGhlIGZpcnN0IG9yIGxhc3QgY29sdW1uIGluIG1ldGVycyAoZGVmYXVsdHMgdG8gYDBgKTtcbiAqICAgLSBgcm93TWFyZ2luOk51bWJlcmAsICh2ZXJ0aWNhbCkgbWFyZ2lucyBiZXR3ZWVuIHRoZSBib3JkZXJzIG9mIHRoZSBzcGFjZSBhbmQgdGhlIGZpcnN0IG9yIGxhc3Qgcm93IChuIG1ldGVycyAoZGVmYXVsdHMgdG8gYDBgKTtcbiAqICAgLSBgcmVsQ29sTWFyZ2luOk51bWJlcmAsIChob3Jpem9udGFsKSBtYXJnaW5zIGJldHdlZW4gdGhlIGJvcmRlcnMgb2YgdGhlIHNwYWNlIGFuZCB0aGUgZmlyc3Qgb3IgbGFzdCBjb2x1bW4gcmVsYXRpdmUgdG8gdGhlIHNwYWNlIGJldHdlZW4gdHdvIGNvbHVtbnMgKGRlZmF1bHRzIHRvIGAwLjVgKTtcbiAqICAgLSBgcmVsUm93TWFyZ2luOk51bWJlcmAsICh2ZXJ0aWNhbCkgbWFyZ2lucyBiZXR3ZWVuIHRoZSBib3JkZXJzIG9mIHRoZSBzcGFjZSBhbmQgdGhlIGZpcnN0IG9yIGxhc3Qgcm93IHJlbGF0aXZlIHRvIHRoZSBzcGFjZSBiZXR3ZWVuIHR3byByb3dzIChkZWZhdWx0cyB0byBgMC41YCk7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXR1cE1hdHJpeChwYXJhbXMgPSB7fSkge1xuICBsZXQgY29uZmlnID0ge307XG4gIGNvbnN0IHdpZHRoID0gZ2V0T3B0KHBhcmFtcy53aWR0aCwgMTAsIDApO1xuICBjb25zdCBoZWlnaHQgPSBnZXRPcHQocGFyYW1zLmhlaWdodCwgMTAsIDApO1xuICBjb25zdCBjb2xzID0gZ2V0T3B0KHBhcmFtcy5jb2xzLCAzLCAxKTtcbiAgY29uc3Qgcm93cyA9IGdldE9wdChwYXJhbXMucm93cywgNCwgMSk7XG4gIGNvbnN0IHJlbENvbE1hcmdpbiA9IGdldE9wdChwYXJhbXMuY29sTWFyZ2luLCAwLjUsIDApO1xuICBjb25zdCByZWxSb3dNYXJnaW4gPSBnZXRPcHQocGFyYW1zLnJvd01hcmdpbiwgMC41LCAwKTtcbiAgY29uc3QgYWJzQ29sTWFyZ2luID0gZ2V0T3B0KHBhcmFtcy5jb2xNYXJnaW4sIDAsIDApO1xuICBjb25zdCBhYnNSb3dNYXJnaW4gPSBnZXRPcHQocGFyYW1zLnJvd01hcmdpbiwgMCwgMCk7XG4gIGNvbnN0IGNvbFNwYWNpbmcgPSAod2lkdGggLSAyICogY29sTWFyZ2luKSAvIChjb2xzIC0gMSArIDIgKiByZWxDb2xNYXJnaW4pO1xuICBjb25zdCByb3dTcGFjaW5nID0gKGhlaWdodCAtIDIgKiByb3dNYXJnaW4pIC8gKHJvd3MgLSAxICsgMiAqIHJlbFJvd01hcmdpbik7XG4gIGNvbnN0IGNvbE1hcmdpbiA9IGFic0NvbE1hcmdpbiArIGNvbFNwYWNpbmcgKiByZWxDb2xNYXJnaW47XG4gIGNvbnN0IHJvd01hcmdpbiA9IGFic1Jvd01hcmdpbiArIHJvd1NwYWNpbmcgKiByZWxSb3dNYXJnaW47XG5cbiAgY29uZmlnLnNwYWNpbmcgPSBNYXRoLm1pbihjb2xTcGFjaW5nLCByb3dTcGFjaW5nKTtcblxuICBjb25maWcudG9wb2xvZ3kgPSB7XG4gICAgdHlwZTogJ21hdHJpeCcsXG4gICAgY29sczogY29scyxcbiAgICByb3dzOiByb3dzXG4gIH07XG5cbiAgbGV0IGNvdW50ID0gMDtcblxuICBmb3IgKGxldCBqID0gMDsgaiA8IHJvd3M7IGorKykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sczsgaSsrKSB7XG4gICAgICBjb3VudCsrO1xuXG4gICAgICBjb25zdCBsYWJlbCA9IGNvdW50LnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCB4ID0gKGNvbE1hcmdpbiArIGkgKiBjb2xTcGFjaW5nKSAvIHdpZHRoO1xuICAgICAgY29uc3QgeSA9IChyb3dNYXJnaW4gKyBqICogcm93U3BhY2luZykgLyBoZWlnaHQ7XG4gICAgICBjb25zdCBjb29yZGluYXRlcyA9IFt4LCB5XTtcblxuICAgICAgdGhpcy5sYWJlbHMucHVzaChsYWJlbCk7XG4gICAgICB0aGlzLmNvb3JkaW5hdGVzLnB1c2goY29vcmRpbmF0ZXMpO1xuICAgIH1cbiAgfVxufTtcbiJdfQ==