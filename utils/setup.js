'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.generateMatrix = generateMatrix;

var _helpers = require('helpers');

/**
 * Generates a matrix setup according to a set of parameters.
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

function generateMatrix() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var setup = {};
  var width = (0, _helpers.getOpt)(params.width, 10, 0);
  var height = (0, _helpers.getOpt)(params.height, 10, 0);
  var cols = (0, _helpers.getOpt)(params.cols, 3, 1);
  var rows = (0, _helpers.getOpt)(params.rows, 4, 1);
  var relColMargin = (0, _helpers.getOpt)(params.colMargin, 0.5, 0);
  var relRowMargin = (0, _helpers.getOpt)(params.rowMargin, 0.5, 0);
  var absColMargin = (0, _helpers.getOpt)(params.colMargin, 0, 0);
  var absRowMargin = (0, _helpers.getOpt)(params.rowMargin, 0, 0);
  var colSpacing = (width - 2 * colMargin) / (cols - 1 + 2 * relColMargin);
  var rowSpacing = (height - 2 * rowMargin) / (rows - 1 + 2 * relRowMargin);
  var colMargin = absColMargin + colSpacing * relColMargin;
  var rowMargin = absRowMargin + rowSpacing * relRowMargin;

  setup.width = width;
  setup.height = height;

  var labels = [];
  var coordinates = [];

  var count = 0;
  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      count++;

      var label = count.toString();
      var x = (colMargin + i * colSpacing) / width;
      var y = (rowMargin + j * rowSpacing) / height;

      setup.labels.push(label);
      setup.coordinates.push([x, y]);
    }
  }

  setup.labels = labels;
  setup.coordinates = coordinates;

  setup.topology = {
    type: 'matrix',
    cols: cols,
    rows: rows
  };
}

;
//# sourceMappingURL=data:application/json;base64,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O0FBRWhDLE9BQUssQ0FBQyxRQUFRLEdBQUc7QUFDZixRQUFJLEVBQUUsUUFBUTtBQUNkLFFBQUksRUFBRSxJQUFJO0FBQ1YsUUFBSSxFQUFFLElBQUk7R0FDWCxDQUFDO0NBQ0g7O0FBQUEsQ0FBQyIsImZpbGUiOiJzcmMvdXRpbHMvc2V0dXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRPcHQgfSBmcm9tICdoZWxwZXJzJztcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBtYXRyaXggc2V0dXAgYWNjb3JkaW5nIHRvIGEgc2V0IG9mIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXM9e31dIE1hdHJpeCBwYXJhbWV0ZXJzOlxuICogICAtIGB3aWR0aDpOdW1iZXJgLCBudW1iZXIgb2YgY29sdW1ucyAoZGVmYXVsdHMgdG8gYDEwYCk7XG4gKiAgIC0gYGhlaWdodDpOdW1iZXJgLCBudW1iZXIgb2Ygcm93cyAoZGVmYXVsdHMgdG8gYDEwYCk7XG4gKiAgIC0gYGNvbHM6TnVtYmVyYCwgbnVtYmVyIG9mIGNvbHVtbnMgKGRlZmF1bHRzIHRvIGAzYCk7XG4gKiAgIC0gYHJvd3M6TnVtYmVyYCwgbnVtYmVyIG9mIHJvd3MgKGRlZmF1bHRzIHRvIGA0YCk7XG4gKiAgIC0gYGNvbE1hcmdpbjpOdW1iZXJgLCAoaG9yaXpvbnRhbCkgbWFyZ2lucyBiZXR3ZWVuIHRoZSBib3JkZXJzIG9mIHRoZSBzcGFjZSBhbmQgdGhlIGZpcnN0IG9yIGxhc3QgY29sdW1uIGluIG1ldGVycyAoZGVmYXVsdHMgdG8gYDBgKTtcbiAqICAgLSBgcm93TWFyZ2luOk51bWJlcmAsICh2ZXJ0aWNhbCkgbWFyZ2lucyBiZXR3ZWVuIHRoZSBib3JkZXJzIG9mIHRoZSBzcGFjZSBhbmQgdGhlIGZpcnN0IG9yIGxhc3Qgcm93IChuIG1ldGVycyAoZGVmYXVsdHMgdG8gYDBgKTtcbiAqICAgLSBgcmVsQ29sTWFyZ2luOk51bWJlcmAsIChob3Jpem9udGFsKSBtYXJnaW5zIGJldHdlZW4gdGhlIGJvcmRlcnMgb2YgdGhlIHNwYWNlIGFuZCB0aGUgZmlyc3Qgb3IgbGFzdCBjb2x1bW4gcmVsYXRpdmUgdG8gdGhlIHNwYWNlIGJldHdlZW4gdHdvIGNvbHVtbnMgKGRlZmF1bHRzIHRvIGAwLjVgKTtcbiAqICAgLSBgcmVsUm93TWFyZ2luOk51bWJlcmAsICh2ZXJ0aWNhbCkgbWFyZ2lucyBiZXR3ZWVuIHRoZSBib3JkZXJzIG9mIHRoZSBzcGFjZSBhbmQgdGhlIGZpcnN0IG9yIGxhc3Qgcm93IHJlbGF0aXZlIHRvIHRoZSBzcGFjZSBiZXR3ZWVuIHR3byByb3dzIChkZWZhdWx0cyB0byBgMC41YCk7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU1hdHJpeChwYXJhbXMgPSB7fSkge1xuICBsZXQgc2V0dXAgPSB7fTtcbiAgY29uc3Qgd2lkdGggPSBnZXRPcHQocGFyYW1zLndpZHRoLCAxMCwgMCk7XG4gIGNvbnN0IGhlaWdodCA9IGdldE9wdChwYXJhbXMuaGVpZ2h0LCAxMCwgMCk7XG4gIGNvbnN0IGNvbHMgPSBnZXRPcHQocGFyYW1zLmNvbHMsIDMsIDEpO1xuICBjb25zdCByb3dzID0gZ2V0T3B0KHBhcmFtcy5yb3dzLCA0LCAxKTtcbiAgY29uc3QgcmVsQ29sTWFyZ2luID0gZ2V0T3B0KHBhcmFtcy5jb2xNYXJnaW4sIDAuNSwgMCk7XG4gIGNvbnN0IHJlbFJvd01hcmdpbiA9IGdldE9wdChwYXJhbXMucm93TWFyZ2luLCAwLjUsIDApO1xuICBjb25zdCBhYnNDb2xNYXJnaW4gPSBnZXRPcHQocGFyYW1zLmNvbE1hcmdpbiwgMCwgMCk7XG4gIGNvbnN0IGFic1Jvd01hcmdpbiA9IGdldE9wdChwYXJhbXMucm93TWFyZ2luLCAwLCAwKTtcbiAgY29uc3QgY29sU3BhY2luZyA9ICh3aWR0aCAtIDIgKiBjb2xNYXJnaW4pIC8gKGNvbHMgLSAxICsgMiAqIHJlbENvbE1hcmdpbik7XG4gIGNvbnN0IHJvd1NwYWNpbmcgPSAoaGVpZ2h0IC0gMiAqIHJvd01hcmdpbikgLyAocm93cyAtIDEgKyAyICogcmVsUm93TWFyZ2luKTtcbiAgY29uc3QgY29sTWFyZ2luID0gYWJzQ29sTWFyZ2luICsgY29sU3BhY2luZyAqIHJlbENvbE1hcmdpbjtcbiAgY29uc3Qgcm93TWFyZ2luID0gYWJzUm93TWFyZ2luICsgcm93U3BhY2luZyAqIHJlbFJvd01hcmdpbjtcblxuICBzZXR1cC53aWR0aCA9IHdpZHRoO1xuICBzZXR1cC5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgY29uc3QgbGFiZWxzID0gW107XG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gW107XG5cbiAgbGV0IGNvdW50ID0gMDtcbiAgZm9yIChsZXQgaiA9IDA7IGogPCByb3dzOyBqKyspIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHM7IGkrKykge1xuICAgICAgY291bnQrKztcblxuICAgICAgY29uc3QgbGFiZWwgPSBjb3VudC50b1N0cmluZygpO1xuICAgICAgY29uc3QgeCA9IChjb2xNYXJnaW4gKyBpICogY29sU3BhY2luZykgLyB3aWR0aDtcbiAgICAgIGNvbnN0IHkgPSAocm93TWFyZ2luICsgaiAqIHJvd1NwYWNpbmcpIC8gaGVpZ2h0O1xuXG4gICAgICBzZXR1cC5sYWJlbHMucHVzaChsYWJlbCk7XG4gICAgICBzZXR1cC5jb29yZGluYXRlcy5wdXNoKFt4LCB5XSk7XG4gICAgfVxuICB9XG5cbiAgc2V0dXAubGFiZWxzID0gbGFiZWxzO1xuICBzZXR1cC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gIHNldHVwLnRvcG9sb2d5ID0ge1xuICAgIHR5cGU6ICdtYXRyaXgnLFxuICAgIGNvbHM6IGNvbHMsXG4gICAgcm93czogcm93c1xuICB9O1xufTtcbiJdfQ==