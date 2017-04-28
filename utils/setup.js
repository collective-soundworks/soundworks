'use strict';

Object.defineProperty(exports, "__esModule", {
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
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIl0sIm5hbWVzIjpbImdlbmVyYXRlTWF0cml4IiwicGFyYW1zIiwic2V0dXAiLCJ3aWR0aCIsImhlaWdodCIsImNvbHMiLCJyb3dzIiwicmVsQ29sTWFyZ2luIiwicmVsUm93TWFyZ2luIiwiYWJzQ29sTWFyZ2luIiwiY29sTWFyZ2luIiwiYWJzUm93TWFyZ2luIiwicm93TWFyZ2luIiwiY29sU3BhY2luZyIsInJvd1NwYWNpbmciLCJsYWJlbHMiLCJjb29yZGluYXRlcyIsImNvdW50IiwiaiIsImkiLCJsYWJlbCIsInRvU3RyaW5nIiwieCIsInkiLCJwdXNoIiwidG9wb2xvZ3kiLCJ0eXBlIl0sIm1hcHBpbmdzIjoiOzs7OztRQWdCZ0JBLGMsR0FBQUEsYzs7QUFoQmhCOztBQUdBOzs7Ozs7Ozs7Ozs7O0FBYU8sU0FBU0EsY0FBVCxHQUFxQztBQUFBLE1BQWJDLE1BQWEsdUVBQUosRUFBSTs7QUFDMUMsTUFBSUMsUUFBUSxFQUFaO0FBQ0EsTUFBTUMsUUFBUSxxQkFBT0YsT0FBT0UsS0FBZCxFQUFxQixFQUFyQixFQUF5QixDQUF6QixDQUFkO0FBQ0EsTUFBTUMsU0FBUyxxQkFBT0gsT0FBT0csTUFBZCxFQUFzQixFQUF0QixFQUEwQixDQUExQixDQUFmO0FBQ0EsTUFBTUMsT0FBTyxxQkFBT0osT0FBT0ksSUFBZCxFQUFvQixDQUFwQixFQUF1QixDQUF2QixDQUFiO0FBQ0EsTUFBTUMsT0FBTyxxQkFBT0wsT0FBT0ssSUFBZCxFQUFvQixDQUFwQixFQUF1QixDQUF2QixDQUFiO0FBQ0EsTUFBTUMsZUFBZSxxQkFBT04sT0FBT00sWUFBZCxFQUE0QixHQUE1QixFQUFpQyxDQUFqQyxDQUFyQjtBQUNBLE1BQU1DLGVBQWUscUJBQU9QLE9BQU9PLFlBQWQsRUFBNEIsR0FBNUIsRUFBaUMsQ0FBakMsQ0FBckI7QUFDQSxNQUFNQyxlQUFlLHFCQUFPUixPQUFPUyxTQUFkLEVBQXlCLENBQXpCLEVBQTRCLENBQTVCLENBQXJCO0FBQ0EsTUFBTUMsZUFBZSxxQkFBT1YsT0FBT1csU0FBZCxFQUF5QixDQUF6QixFQUE0QixDQUE1QixDQUFyQjtBQUNBLE1BQU1DLGFBQWEsQ0FBQ1YsUUFBUSxJQUFJTSxZQUFiLEtBQThCSixPQUFPLENBQVAsR0FBVyxJQUFJRSxZQUE3QyxDQUFuQjtBQUNBLE1BQU1PLGFBQWEsQ0FBQ1YsU0FBUyxJQUFJTyxZQUFkLEtBQStCTCxPQUFPLENBQVAsR0FBVyxJQUFJRSxZQUE5QyxDQUFuQjtBQUNBLE1BQU1FLFlBQVlELGVBQWVJLGFBQWFOLFlBQTlDO0FBQ0EsTUFBTUssWUFBWUQsZUFBZUcsYUFBYU4sWUFBOUM7O0FBRUFOLFFBQU1DLEtBQU4sR0FBY0EsS0FBZDtBQUNBRCxRQUFNRSxNQUFOLEdBQWVBLE1BQWY7O0FBRUEsTUFBTVcsU0FBUyxFQUFmO0FBQ0EsTUFBTUMsY0FBYyxFQUFwQjtBQUNBLE1BQUlDLFFBQVEsQ0FBWjs7QUFFQSxPQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSVosSUFBcEIsRUFBMEJZLEdBQTFCLEVBQStCO0FBQzdCLFNBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJZCxJQUFwQixFQUEwQmMsR0FBMUIsRUFBK0I7QUFDN0JGOztBQUVBLFVBQU1HLFFBQVFILE1BQU1JLFFBQU4sRUFBZDtBQUNBLFVBQU1DLElBQUtaLFlBQVlTLElBQUlOLFVBQTNCO0FBQ0EsVUFBTVUsSUFBS1gsWUFBWU0sSUFBSUosVUFBM0I7O0FBRUFDLGFBQU9TLElBQVAsQ0FBWUosS0FBWjtBQUNBSixrQkFBWVEsSUFBWixDQUFpQixDQUFDRixDQUFELEVBQUlDLENBQUosQ0FBakI7QUFDRDtBQUNGOztBQUVEckIsUUFBTWEsTUFBTixHQUFlQSxNQUFmO0FBQ0FiLFFBQU1jLFdBQU4sR0FBb0JBLFdBQXBCOztBQUVBZCxRQUFNdUIsUUFBTixHQUFpQjtBQUNmQyxVQUFNLFFBRFM7QUFFZnJCLFVBQU1BLElBRlM7QUFHZkMsVUFBTUE7QUFIUyxHQUFqQjs7QUFNQSxTQUFPSixLQUFQO0FBQ0QiLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge8KgZ2V0T3B0IH0gZnJvbSAnLi9oZWxwZXJzJztcblxuXG4vKipcbiAqIEdlbmVyYXRlcyBhIG1hdHJpeCBzZXR1cCBhY2NvcmRpbmcgdG8gYSBzZXQgb2YgcGFyYW1ldGVycy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcz17fV0gTWF0cml4IHBhcmFtZXRlcnM6XG4gKiAgIC0gYHdpZHRoOk51bWJlcmAsIG51bWJlciBvZiBjb2x1bW5zIChkZWZhdWx0cyB0byBgMTBgKTtcbiAqICAgLSBgaGVpZ2h0Ok51bWJlcmAsIG51bWJlciBvZiByb3dzIChkZWZhdWx0cyB0byBgMTBgKTtcbiAqICAgLSBgY29sczpOdW1iZXJgLCBudW1iZXIgb2YgY29sdW1ucyAoZGVmYXVsdHMgdG8gYDNgKTtcbiAqICAgLSBgcm93czpOdW1iZXJgLCBudW1iZXIgb2Ygcm93cyAoZGVmYXVsdHMgdG8gYDRgKTtcbiAqICAgLSBgY29sTWFyZ2luOk51bWJlcmAsIChob3Jpem9udGFsKSBtYXJnaW5zIGJldHdlZW4gdGhlIGJvcmRlcnMgb2YgdGhlIHNwYWNlIGFuZCB0aGUgZmlyc3Qgb3IgbGFzdCBjb2x1bW4gaW4gbWV0ZXJzIChkZWZhdWx0cyB0byBgMGApO1xuICogICAtIGByb3dNYXJnaW46TnVtYmVyYCwgKHZlcnRpY2FsKSBtYXJnaW5zIGJldHdlZW4gdGhlIGJvcmRlcnMgb2YgdGhlIHNwYWNlIGFuZCB0aGUgZmlyc3Qgb3IgbGFzdCByb3cgKG4gbWV0ZXJzIChkZWZhdWx0cyB0byBgMGApO1xuICogICAtIGByZWxDb2xNYXJnaW46TnVtYmVyYCwgKGhvcml6b250YWwpIG1hcmdpbnMgYmV0d2VlbiB0aGUgYm9yZGVycyBvZiB0aGUgc3BhY2UgYW5kIHRoZSBmaXJzdCBvciBsYXN0IGNvbHVtbiByZWxhdGl2ZSB0byB0aGUgc3BhY2UgYmV0d2VlbiB0d28gY29sdW1ucyAoZGVmYXVsdHMgdG8gYDAuNWApO1xuICogICAtIGByZWxSb3dNYXJnaW46TnVtYmVyYCwgKHZlcnRpY2FsKSBtYXJnaW5zIGJldHdlZW4gdGhlIGJvcmRlcnMgb2YgdGhlIHNwYWNlIGFuZCB0aGUgZmlyc3Qgb3IgbGFzdCByb3cgcmVsYXRpdmUgdG8gdGhlIHNwYWNlIGJldHdlZW4gdHdvIHJvd3MgKGRlZmF1bHRzIHRvIGAwLjVgKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlTWF0cml4KHBhcmFtcyA9IHt9KSB7XG4gIGxldCBzZXR1cCA9IHt9O1xuICBjb25zdCB3aWR0aCA9IGdldE9wdChwYXJhbXMud2lkdGgsIDEwLCAwKTtcbiAgY29uc3QgaGVpZ2h0ID0gZ2V0T3B0KHBhcmFtcy5oZWlnaHQsIDEwLCAwKTtcbiAgY29uc3QgY29scyA9IGdldE9wdChwYXJhbXMuY29scywgMywgMSk7XG4gIGNvbnN0IHJvd3MgPSBnZXRPcHQocGFyYW1zLnJvd3MsIDQsIDEpO1xuICBjb25zdCByZWxDb2xNYXJnaW4gPSBnZXRPcHQocGFyYW1zLnJlbENvbE1hcmdpbiwgMC41LCAwKTtcbiAgY29uc3QgcmVsUm93TWFyZ2luID0gZ2V0T3B0KHBhcmFtcy5yZWxSb3dNYXJnaW4sIDAuNSwgMCk7XG4gIGNvbnN0IGFic0NvbE1hcmdpbiA9IGdldE9wdChwYXJhbXMuY29sTWFyZ2luLCAwLCAwKTtcbiAgY29uc3QgYWJzUm93TWFyZ2luID0gZ2V0T3B0KHBhcmFtcy5yb3dNYXJnaW4sIDAsIDApO1xuICBjb25zdCBjb2xTcGFjaW5nID0gKHdpZHRoIC0gMiAqIGFic0NvbE1hcmdpbikgLyAoY29scyAtIDEgKyAyICogcmVsQ29sTWFyZ2luKTtcbiAgY29uc3Qgcm93U3BhY2luZyA9IChoZWlnaHQgLSAyICogYWJzUm93TWFyZ2luKSAvIChyb3dzIC0gMSArIDIgKiByZWxSb3dNYXJnaW4pO1xuICBjb25zdCBjb2xNYXJnaW4gPSBhYnNDb2xNYXJnaW4gKyBjb2xTcGFjaW5nICogcmVsQ29sTWFyZ2luO1xuICBjb25zdCByb3dNYXJnaW4gPSBhYnNSb3dNYXJnaW4gKyByb3dTcGFjaW5nICogcmVsUm93TWFyZ2luO1xuXG4gIHNldHVwLndpZHRoID0gd2lkdGg7XG4gIHNldHVwLmhlaWdodCA9IGhlaWdodDtcblxuICBjb25zdCBsYWJlbHMgPSBbXTtcbiAgY29uc3QgY29vcmRpbmF0ZXMgPSBbXTtcbiAgbGV0IGNvdW50ID0gMDtcblxuICBmb3IgKGxldCBqID0gMDsgaiA8IHJvd3M7IGorKykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sczsgaSsrKSB7XG4gICAgICBjb3VudCsrO1xuXG4gICAgICBjb25zdCBsYWJlbCA9IGNvdW50LnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCB4ID0gKGNvbE1hcmdpbiArIGkgKiBjb2xTcGFjaW5nKTtcbiAgICAgIGNvbnN0IHkgPSAocm93TWFyZ2luICsgaiAqIHJvd1NwYWNpbmcpO1xuXG4gICAgICBsYWJlbHMucHVzaChsYWJlbCk7XG4gICAgICBjb29yZGluYXRlcy5wdXNoKFt4LCB5XSk7XG4gICAgfVxuICB9XG5cbiAgc2V0dXAubGFiZWxzID0gbGFiZWxzO1xuICBzZXR1cC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gIHNldHVwLnRvcG9sb2d5ID0ge1xuICAgIHR5cGU6ICdtYXRyaXgnLFxuICAgIGNvbHM6IGNvbHMsXG4gICAgcm93czogcm93c1xuICB9O1xuXG4gIHJldHVybiBzZXR1cDtcbn1cbiJdfQ==