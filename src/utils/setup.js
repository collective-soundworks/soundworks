import { getOpt } from './helpers';


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
export function generateMatrix(params = {}) {
  let setup = {};
  const width = getOpt(params.width, 10, 0);
  const height = getOpt(params.height, 10, 0);
  const cols = getOpt(params.cols, 3, 1);
  const rows = getOpt(params.rows, 4, 1);
  const relColMargin = getOpt(params.relColMargin, 0.5, 0);
  const relRowMargin = getOpt(params.relRowMargin, 0.5, 0);
  const absColMargin = getOpt(params.colMargin, 0, 0);
  const absRowMargin = getOpt(params.rowMargin, 0, 0);
  const colSpacing = (width - 2 * absColMargin) / (cols - 1 + 2 * relColMargin);
  const rowSpacing = (height - 2 * absRowMargin) / (rows - 1 + 2 * relRowMargin);
  const colMargin = absColMargin + colSpacing * relColMargin;
  const rowMargin = absRowMargin + rowSpacing * relRowMargin;

  setup.width = width;
  setup.height = height;

  const labels = [];
  const coordinates = [];
  let count = 0;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      count++;

      const label = count.toString();
      const x = (colMargin + i * colSpacing);
      const y = (rowMargin + j * rowSpacing);

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
