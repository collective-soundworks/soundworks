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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBZ0JnQjs7QUFoQmhCOzs7Ozs7Ozs7Ozs7Ozs7QUFnQk8sU0FBUyxjQUFULEdBQXFDO01BQWIsK0RBQVMsa0JBQUk7O0FBQzFDLE1BQUksUUFBUSxFQUFSLENBRHNDO0FBRTFDLE1BQU0sUUFBUSxxQkFBTyxPQUFPLEtBQVAsRUFBYyxFQUFyQixFQUF5QixDQUF6QixDQUFSLENBRm9DO0FBRzFDLE1BQU0sU0FBUyxxQkFBTyxPQUFPLE1BQVAsRUFBZSxFQUF0QixFQUEwQixDQUExQixDQUFULENBSG9DO0FBSTFDLE1BQU0sT0FBTyxxQkFBTyxPQUFPLElBQVAsRUFBYSxDQUFwQixFQUF1QixDQUF2QixDQUFQLENBSm9DO0FBSzFDLE1BQU0sT0FBTyxxQkFBTyxPQUFPLElBQVAsRUFBYSxDQUFwQixFQUF1QixDQUF2QixDQUFQLENBTG9DO0FBTTFDLE1BQU0sZUFBZSxxQkFBTyxPQUFPLFlBQVAsRUFBcUIsR0FBNUIsRUFBaUMsQ0FBakMsQ0FBZixDQU5vQztBQU8xQyxNQUFNLGVBQWUscUJBQU8sT0FBTyxZQUFQLEVBQXFCLEdBQTVCLEVBQWlDLENBQWpDLENBQWYsQ0FQb0M7QUFRMUMsTUFBTSxlQUFlLHFCQUFPLE9BQU8sU0FBUCxFQUFrQixDQUF6QixFQUE0QixDQUE1QixDQUFmLENBUm9DO0FBUzFDLE1BQU0sZUFBZSxxQkFBTyxPQUFPLFNBQVAsRUFBa0IsQ0FBekIsRUFBNEIsQ0FBNUIsQ0FBZixDQVRvQztBQVUxQyxNQUFNLGFBQWEsQ0FBQyxRQUFRLElBQUksWUFBSixDQUFULElBQThCLE9BQU8sQ0FBUCxHQUFXLElBQUksWUFBSixDQUF6QyxDQVZ1QjtBQVcxQyxNQUFNLGFBQWEsQ0FBQyxTQUFTLElBQUksWUFBSixDQUFWLElBQStCLE9BQU8sQ0FBUCxHQUFXLElBQUksWUFBSixDQUExQyxDQVh1QjtBQVkxQyxNQUFNLFlBQVksZUFBZSxhQUFhLFlBQWIsQ0FaUztBQWExQyxNQUFNLFlBQVksZUFBZSxhQUFhLFlBQWIsQ0FiUzs7QUFlMUMsUUFBTSxLQUFOLEdBQWMsS0FBZCxDQWYwQztBQWdCMUMsUUFBTSxNQUFOLEdBQWUsTUFBZixDQWhCMEM7O0FBa0IxQyxNQUFNLFNBQVMsRUFBVCxDQWxCb0M7QUFtQjFDLE1BQU0sY0FBYyxFQUFkLENBbkJvQztBQW9CMUMsTUFBSSxRQUFRLENBQVIsQ0FwQnNDOztBQXNCMUMsT0FBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksSUFBSixFQUFVLEdBQTFCLEVBQStCO0FBQzdCLFNBQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLElBQUosRUFBVSxHQUExQixFQUErQjtBQUM3QixjQUQ2Qjs7QUFHN0IsVUFBTSxRQUFRLE1BQU0sUUFBTixFQUFSLENBSHVCO0FBSTdCLFVBQU0sSUFBSyxZQUFZLElBQUksVUFBSixDQUpNO0FBSzdCLFVBQU0sSUFBSyxZQUFZLElBQUksVUFBSixDQUxNOztBQU83QixhQUFPLElBQVAsQ0FBWSxLQUFaLEVBUDZCO0FBUTdCLGtCQUFZLElBQVosQ0FBaUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQixFQVI2QjtLQUEvQjtHQURGOztBQWFBLFFBQU0sTUFBTixHQUFlLE1BQWYsQ0FuQzBDO0FBb0MxQyxRQUFNLFdBQU4sR0FBb0IsV0FBcEIsQ0FwQzBDOztBQXNDMUMsUUFBTSxRQUFOLEdBQWlCO0FBQ2YsVUFBTSxRQUFOO0FBQ0EsVUFBTSxJQUFOO0FBQ0EsVUFBTSxJQUFOO0dBSEYsQ0F0QzBDOztBQTRDMUMsU0FBTyxLQUFQLENBNUMwQztDQUFyQyIsImZpbGUiOiJzZXR1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7wqBnZXRPcHQgfSBmcm9tICcuL2hlbHBlcnMnO1xuXG5cbi8qKlxuICogR2VuZXJhdGVzIGEgbWF0cml4IHNldHVwIGFjY29yZGluZyB0byBhIHNldCBvZiBwYXJhbWV0ZXJzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zPXt9XSBNYXRyaXggcGFyYW1ldGVyczpcbiAqICAgLSBgd2lkdGg6TnVtYmVyYCwgbnVtYmVyIG9mIGNvbHVtbnMgKGRlZmF1bHRzIHRvIGAxMGApO1xuICogICAtIGBoZWlnaHQ6TnVtYmVyYCwgbnVtYmVyIG9mIHJvd3MgKGRlZmF1bHRzIHRvIGAxMGApO1xuICogICAtIGBjb2xzOk51bWJlcmAsIG51bWJlciBvZiBjb2x1bW5zIChkZWZhdWx0cyB0byBgM2ApO1xuICogICAtIGByb3dzOk51bWJlcmAsIG51bWJlciBvZiByb3dzIChkZWZhdWx0cyB0byBgNGApO1xuICogICAtIGBjb2xNYXJnaW46TnVtYmVyYCwgKGhvcml6b250YWwpIG1hcmdpbnMgYmV0d2VlbiB0aGUgYm9yZGVycyBvZiB0aGUgc3BhY2UgYW5kIHRoZSBmaXJzdCBvciBsYXN0IGNvbHVtbiBpbiBtZXRlcnMgKGRlZmF1bHRzIHRvIGAwYCk7XG4gKiAgIC0gYHJvd01hcmdpbjpOdW1iZXJgLCAodmVydGljYWwpIG1hcmdpbnMgYmV0d2VlbiB0aGUgYm9yZGVycyBvZiB0aGUgc3BhY2UgYW5kIHRoZSBmaXJzdCBvciBsYXN0IHJvdyAobiBtZXRlcnMgKGRlZmF1bHRzIHRvIGAwYCk7XG4gKiAgIC0gYHJlbENvbE1hcmdpbjpOdW1iZXJgLCAoaG9yaXpvbnRhbCkgbWFyZ2lucyBiZXR3ZWVuIHRoZSBib3JkZXJzIG9mIHRoZSBzcGFjZSBhbmQgdGhlIGZpcnN0IG9yIGxhc3QgY29sdW1uIHJlbGF0aXZlIHRvIHRoZSBzcGFjZSBiZXR3ZWVuIHR3byBjb2x1bW5zIChkZWZhdWx0cyB0byBgMC41YCk7XG4gKiAgIC0gYHJlbFJvd01hcmdpbjpOdW1iZXJgLCAodmVydGljYWwpIG1hcmdpbnMgYmV0d2VlbiB0aGUgYm9yZGVycyBvZiB0aGUgc3BhY2UgYW5kIHRoZSBmaXJzdCBvciBsYXN0IHJvdyByZWxhdGl2ZSB0byB0aGUgc3BhY2UgYmV0d2VlbiB0d28gcm93cyAoZGVmYXVsdHMgdG8gYDAuNWApO1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVNYXRyaXgocGFyYW1zID0ge30pIHtcbiAgbGV0IHNldHVwID0ge307XG4gIGNvbnN0IHdpZHRoID0gZ2V0T3B0KHBhcmFtcy53aWR0aCwgMTAsIDApO1xuICBjb25zdCBoZWlnaHQgPSBnZXRPcHQocGFyYW1zLmhlaWdodCwgMTAsIDApO1xuICBjb25zdCBjb2xzID0gZ2V0T3B0KHBhcmFtcy5jb2xzLCAzLCAxKTtcbiAgY29uc3Qgcm93cyA9IGdldE9wdChwYXJhbXMucm93cywgNCwgMSk7XG4gIGNvbnN0IHJlbENvbE1hcmdpbiA9IGdldE9wdChwYXJhbXMucmVsQ29sTWFyZ2luLCAwLjUsIDApO1xuICBjb25zdCByZWxSb3dNYXJnaW4gPSBnZXRPcHQocGFyYW1zLnJlbFJvd01hcmdpbiwgMC41LCAwKTtcbiAgY29uc3QgYWJzQ29sTWFyZ2luID0gZ2V0T3B0KHBhcmFtcy5jb2xNYXJnaW4sIDAsIDApO1xuICBjb25zdCBhYnNSb3dNYXJnaW4gPSBnZXRPcHQocGFyYW1zLnJvd01hcmdpbiwgMCwgMCk7XG4gIGNvbnN0IGNvbFNwYWNpbmcgPSAod2lkdGggLSAyICogYWJzQ29sTWFyZ2luKSAvIChjb2xzIC0gMSArIDIgKiByZWxDb2xNYXJnaW4pO1xuICBjb25zdCByb3dTcGFjaW5nID0gKGhlaWdodCAtIDIgKiBhYnNSb3dNYXJnaW4pIC8gKHJvd3MgLSAxICsgMiAqIHJlbFJvd01hcmdpbik7XG4gIGNvbnN0IGNvbE1hcmdpbiA9IGFic0NvbE1hcmdpbiArIGNvbFNwYWNpbmcgKiByZWxDb2xNYXJnaW47XG4gIGNvbnN0IHJvd01hcmdpbiA9IGFic1Jvd01hcmdpbiArIHJvd1NwYWNpbmcgKiByZWxSb3dNYXJnaW47XG5cbiAgc2V0dXAud2lkdGggPSB3aWR0aDtcbiAgc2V0dXAuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gIGNvbnN0IGxhYmVscyA9IFtdO1xuICBjb25zdCBjb29yZGluYXRlcyA9IFtdO1xuICBsZXQgY291bnQgPSAwO1xuXG4gIGZvciAobGV0IGogPSAwOyBqIDwgcm93czsgaisrKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2xzOyBpKyspIHtcbiAgICAgIGNvdW50Kys7XG5cbiAgICAgIGNvbnN0IGxhYmVsID0gY291bnQudG9TdHJpbmcoKTtcbiAgICAgIGNvbnN0IHggPSAoY29sTWFyZ2luICsgaSAqIGNvbFNwYWNpbmcpO1xuICAgICAgY29uc3QgeSA9IChyb3dNYXJnaW4gKyBqICogcm93U3BhY2luZyk7XG5cbiAgICAgIGxhYmVscy5wdXNoKGxhYmVsKTtcbiAgICAgIGNvb3JkaW5hdGVzLnB1c2goW3gsIHldKTtcbiAgICB9XG4gIH1cblxuICBzZXR1cC5sYWJlbHMgPSBsYWJlbHM7XG4gIHNldHVwLmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgc2V0dXAudG9wb2xvZ3kgPSB7XG4gICAgdHlwZTogJ21hdHJpeCcsXG4gICAgY29sczogY29scyxcbiAgICByb3dzOiByb3dzXG4gIH07XG5cbiAgcmV0dXJuIHNldHVwO1xufVxuIl19