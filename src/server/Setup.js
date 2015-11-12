import Module from './Module';


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
export default class Setup extends Module {
  /**
   * Creates and instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='setup'] Name of the module.
   */
  constructor(options = {}) {
    super(options.name || 'setup');

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
  connect(client) {
    super.connect(client);

    console.log('connect setup', this.name, ':request??');
    client.receive(this.name + ':request', () => {
      console.log('got it');
      client.send(this.name + ':init', {
        "width": this.width,
        "height": this.height,
        "background": this.background,
        "spacing": this.spacing,
        "labels": this.labels,
        "coordinates": this.coordinates,
        "type": this.type
      });
    });
  }

  /**
   * Returns an array with the coordinates of a predefined position of the setup.
   * @param {Number} index Position index about which we want the coordinates.
   * @return {Number[]} Coordinates of the position (`[x, y]`).
   */
  getCoordinates(index) {
    if (index < this.coordinates.length)
      return this.coordinates[index];

    return null;
  }

  /**
   * Returns the label of a predefined position of the setup.
   * @param {Number} index Position index about which we want the coordinates.
   * @return {String} Label of the position.
   */
  getLabel(index) {
    if (index < this.labels.length)
      return this.labels[index];

    return (index + 1).toString();
  }

  /**
   * Returns the total number of predefined positions (and / or labels) of the setup.
   *
   * For instance, if the setup is a 4 ⨉ 5 matrix the method would return 20.
   * @return {Number} Number of predefined positions of the setup.
   */
  getNumPositions() {
    if(this.labels.length || this.coordinates.length) {
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
  getSurface() {
    let surface = {
      height: this.height,
      width: this.width
      // TODO: allow other shapes
    }

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
  generate(type, params = {}) {
    this.type = type;

    switch (type) {
      case 'matrix':
        let cols = params.cols || 3;
        let rows = params.rows || 4;
        let colSpacing = params.colSpacing || 1;
        let rowSpacing = params.rowSpacing || 1;
        let colMargin = params.colMargin || colSpacing / 2;
        let rowMargin = params.rowMargin || rowSpacing / 2;

        this.specific.matrix = {};
        this.specific.matrix.cols = cols;
        this.specific.matrix.rows = rows;

        this.width = colSpacing * (cols - 1) + 2 * colMargin;
        this.height = rowSpacing * (rows - 1) + 2 * rowMargin;
        this.spacing = Math.min(colSpacing, rowSpacing);

        let count = 0;

        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            count++;

            let label = count.toString();
            let coordinates = [(colMargin + i * colSpacing) / this.width, (rowMargin + j * rowSpacing) / this.height];

            this.labels.push(label);
            this.coordinates.push(coordinates);
          }
        }

        break;

      case 'surface':
        let height = params.height || 4;
        let width = params.width || 6;
        let background = params.background || null;

        this.height = height;
        this.width = width;
        this.background = background;

        // TODO: allow other shapes
        break;

      default:
        break;
    }
  }
}
