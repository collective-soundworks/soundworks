'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.generateMatrix = generateMatrix;

var _helpers = require('./helpers');

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
  var relColMargin = (0, _helpers.getOpt)(params.relColMargin, 0.5, 0);
  var relRowMargin = (0, _helpers.getOpt)(params.relRowMargin, 0.5, 0);
  var absColMargin = (0, _helpers.getOpt)(params.colMargin, 0, 0);
  var absRowMargin = (0, _helpers.getOpt)(params.rowMargin, 0, 0);
  var colSpacing = (width - 2 * absColMargin) / (cols - 1 + 2 * relColMargin);
  var rowSpacing = (height - 2 * absRowMargin) / (rows - 1 + 2 * relRowMargin);
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
      var x = colMargin + i * colSpacing;
      var y = rowMargin + j * rowSpacing;

      labels.push(label);
      coordinates.push([x, y]);
    }
  }

  setup.labels = labels;
  setup.coordinates = coordinates;

  setup.topology = {
    type: 'matrix',
    cols: cols,
    rows: rows
  };

  return setup;
}
//# sourceMappingURL=data:application/json;base64,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Q2QsUUFBSSxFQUFFLElBQUk7QUFDVixRQUFJLEVBQUUsSUFBSTtHQUNYLENBQUM7O0FBRUYsU0FBTyxLQUFLLENBQUM7Q0FDZCIsImZpbGUiOiJzcmMvdXRpbHMvc2V0dXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge8KgZ2V0T3B0IH0gZnJvbSAnLi9oZWxwZXJzJztcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBtYXRyaXggc2V0dXAgYWNjb3JkaW5nIHRvIGEgc2V0IG9mIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXM9e31dIE1hdHJpeCBwYXJhbWV0ZXJzOlxuICogICAtIGB3aWR0aDpOdW1iZXJgLCBudW1iZXIgb2YgY29sdW1ucyAoZGVmYXVsdHMgdG8gYDEwYCk7XG4gKiAgIC0gYGhlaWdodDpOdW1iZXJgLCBudW1iZXIgb2Ygcm93cyAoZGVmYXVsdHMgdG8gYDEwYCk7XG4gKiAgIC0gYGNvbHM6TnVtYmVyYCwgbnVtYmVyIG9mIGNvbHVtbnMgKGRlZmF1bHRzIHRvIGAzYCk7XG4gKiAgIC0gYHJvd3M6TnVtYmVyYCwgbnVtYmVyIG9mIHJvd3MgKGRlZmF1bHRzIHRvIGA0YCk7XG4gKiAgIC0gYGNvbE1hcmdpbjpOdW1iZXJgLCAoaG9yaXpvbnRhbCkgbWFyZ2lucyBiZXR3ZWVuIHRoZSBib3JkZXJzIG9mIHRoZSBzcGFjZSBhbmQgdGhlIGZpcnN0IG9yIGxhc3QgY29sdW1uIGluIG1ldGVycyAoZGVmYXVsdHMgdG8gYDBgKTtcbiAqICAgLSBgcm93TWFyZ2luOk51bWJlcmAsICh2ZXJ0aWNhbCkgbWFyZ2lucyBiZXR3ZWVuIHRoZSBib3JkZXJzIG9mIHRoZSBzcGFjZSBhbmQgdGhlIGZpcnN0IG9yIGxhc3Qgcm93IChuIG1ldGVycyAoZGVmYXVsdHMgdG8gYDBgKTtcbiAqICAgLSBgcmVsQ29sTWFyZ2luOk51bWJlcmAsIChob3Jpem9udGFsKSBtYXJnaW5zIGJldHdlZW4gdGhlIGJvcmRlcnMgb2YgdGhlIHNwYWNlIGFuZCB0aGUgZmlyc3Qgb3IgbGFzdCBjb2x1bW4gcmVsYXRpdmUgdG8gdGhlIHNwYWNlIGJldHdlZW4gdHdvIGNvbHVtbnMgKGRlZmF1bHRzIHRvIGAwLjVgKTtcbiAqICAgLSBgcmVsUm93TWFyZ2luOk51bWJlcmAsICh2ZXJ0aWNhbCkgbWFyZ2lucyBiZXR3ZWVuIHRoZSBib3JkZXJzIG9mIHRoZSBzcGFjZSBhbmQgdGhlIGZpcnN0IG9yIGxhc3Qgcm93IHJlbGF0aXZlIHRvIHRoZSBzcGFjZSBiZXR3ZWVuIHR3byByb3dzIChkZWZhdWx0cyB0byBgMC41YCk7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU1hdHJpeChwYXJhbXMgPSB7fSkge1xuICBsZXQgc2V0dXAgPSB7fTtcbiAgY29uc3Qgd2lkdGggPSBnZXRPcHQocGFyYW1zLndpZHRoLCAxMCwgMCk7XG4gIGNvbnN0IGhlaWdodCA9IGdldE9wdChwYXJhbXMuaGVpZ2h0LCAxMCwgMCk7XG4gIGNvbnN0IGNvbHMgPSBnZXRPcHQocGFyYW1zLmNvbHMsIDMsIDEpO1xuICBjb25zdCByb3dzID0gZ2V0T3B0KHBhcmFtcy5yb3dzLCA0LCAxKTtcbiAgY29uc3QgcmVsQ29sTWFyZ2luID0gZ2V0T3B0KHBhcmFtcy5yZWxDb2xNYXJnaW4sIDAuNSwgMCk7XG4gIGNvbnN0IHJlbFJvd01hcmdpbiA9IGdldE9wdChwYXJhbXMucmVsUm93TWFyZ2luLCAwLjUsIDApO1xuICBjb25zdCBhYnNDb2xNYXJnaW4gPSBnZXRPcHQocGFyYW1zLmNvbE1hcmdpbiwgMCwgMCk7XG4gIGNvbnN0IGFic1Jvd01hcmdpbiA9IGdldE9wdChwYXJhbXMucm93TWFyZ2luLCAwLCAwKTtcbiAgY29uc3QgY29sU3BhY2luZyA9ICh3aWR0aCAtIDIgKiBhYnNDb2xNYXJnaW4pIC8gKGNvbHMgLSAxICsgMiAqIHJlbENvbE1hcmdpbik7XG4gIGNvbnN0IHJvd1NwYWNpbmcgPSAoaGVpZ2h0IC0gMiAqIGFic1Jvd01hcmdpbikgLyAocm93cyAtIDEgKyAyICogcmVsUm93TWFyZ2luKTtcbiAgY29uc3QgY29sTWFyZ2luID0gYWJzQ29sTWFyZ2luICsgY29sU3BhY2luZyAqIHJlbENvbE1hcmdpbjtcbiAgY29uc3Qgcm93TWFyZ2luID0gYWJzUm93TWFyZ2luICsgcm93U3BhY2luZyAqIHJlbFJvd01hcmdpbjtcblxuICBzZXR1cC53aWR0aCA9IHdpZHRoO1xuICBzZXR1cC5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgY29uc3QgbGFiZWxzID0gW107XG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gW107XG4gIGxldCBjb3VudCA9IDA7XG5cbiAgZm9yIChsZXQgaiA9IDA7IGogPCByb3dzOyBqKyspIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHM7IGkrKykge1xuICAgICAgY291bnQrKztcblxuICAgICAgY29uc3QgbGFiZWwgPSBjb3VudC50b1N0cmluZygpO1xuICAgICAgY29uc3QgeCA9IChjb2xNYXJnaW4gKyBpICogY29sU3BhY2luZyk7XG4gICAgICBjb25zdCB5ID0gKHJvd01hcmdpbiArIGogKiByb3dTcGFjaW5nKTtcblxuICAgICAgbGFiZWxzLnB1c2gobGFiZWwpO1xuICAgICAgY29vcmRpbmF0ZXMucHVzaChbeCwgeV0pO1xuICAgIH1cbiAgfVxuXG4gIHNldHVwLmxhYmVscyA9IGxhYmVscztcbiAgc2V0dXAuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICBzZXR1cC50b3BvbG9neSA9IHtcbiAgICB0eXBlOiAnbWF0cml4JyxcbiAgICBjb2xzOiBjb2xzLFxuICAgIHJvd3M6IHJvd3NcbiAgfTtcblxuICByZXR1cm4gc2V0dXA7XG59XG4iXX0=