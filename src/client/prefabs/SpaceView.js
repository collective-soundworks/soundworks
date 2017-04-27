import View from '../views/View';

const svgTemplate = `
<div class="svg-container">
  <svg></svg>
</div>`;

const ns = 'http://www.w3.org/2000/svg';

/**
 * A view that render an `area` object (as defined in server configuration).
 *
 * @param {String} template - Template of the view.
 * @param {Object} content - Object containing the variables used to populate
 *  the template. {@link module:soundworks/client.View#content}.
 * @param {Object} events - Listeners to install in the view
 *  {@link module:soundworks/client.View#events}.
 * @param {Object} options - Options of the view.
 *  {@link module:soundworks/client.View#options}.
 *
 * @memberof module:soundworks/client
 */
class SpaceView extends View {
  constructor(template = svgTemplate, content = {}, events = {}, options = {}) {
    options = Object.assign({ className: 'space' }, options);
    super(template, content, events, options);

    /**
     * The area to display.
     *
     * @type {Object}
     * @property {Number} area.width - Width of the area.
     * @property {Number} area.height - Height of the area.
     * @property {String} area.background - Optionnal background image to
     *  display in background.
     * @name area
     * @instance
     * @memberof module:soundworks/client.SpaceView
     */
    this.area = null;

    /**
     * Width of the rendered area in pixels.
     *
     * @type {Number}
     * @name areaWidth
     * @instance
     * @memberof module:soundworks/client.SpaceView
     */
    this.areaWidth = null;

    /**
     * Height of the rendered area in pixels.
     *
     * @type {Number}
     * @name areaHeight
     * @instance
     * @memberof module:soundworks/client.SpaceView
     */
    this.areaHeight = null;

    /**
     * Map associating `$shapes` and their relative `point` object.
     *
     * @type {Map}
     * @name shapePointMap
     * @instance
     * @memberof module:soundworks/client.SpaceView
     */
    this.shapePointMap = new Map();

    /**
     * Expose a Map of the $shapes and their relative line object.
     * @type {Map}
     * @private
     */
    this.shapeLineMap = new Map();

    this._renderedPoints = new Map();
    this._renderedLines = new Map();
  }

  /**
   * Set the `area` to be renderered.
   *
   * @type {Object} area - Object describing the area, generally defined in
   *  server configuration.
   * @property {Number} area.width - Width of the area.
   * @property {Number} area.height - Height of the area.
   * @property {String} area.background - Optionnal background image to
     *  display in background.
   */
  setArea(area) {
    this.area = area;
  }

  /** @private */
  onRender() {
    this.$svgContainer = this.$el.querySelector('.svg-container');
    this.$svg = this.$el.querySelector('svg');
    this.addDefinitions();
    this.renderArea();
  }

  /** @private */
  onResize(viewportWidth, viewportHeight, orientation) {
    super.onResize(viewportWidth, viewportHeight, orientation);
    // override size to match parent size if component of another view
    this.$el.style.width = '100%';
    this.$el.style.height = '100%';

    this.renderArea();
  }

  /**
   * Add svg definitions.
   *
   * @private
   */
  addDefinitions() {
    this.$defs = document.createElementNS(ns, 'defs');

    const markerArrow = `
      <marker id="marker-arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <path d="M0,0 L0,10 L10,5 L0,0" class="marker-arrow" />
      </marker>
    `;

    this.$defs.innerHTML = markerArrow;
    this.$svg.insertBefore(this.$defs, this.$svg.firstChild);
  }

  /**
   * Update the displayed area, according to changes in `area` definition or
   * if a `resize` event has been trigerred.
   */
  renderArea() {
    const area = this.area;
    // use `this.$el` size instead of `this.$parent` size to ignore parent padding
    const boundingRect = this.$el.getBoundingClientRect();
    const containerWidth = boundingRect.width;
    const containerHeight = boundingRect.height;

    this.ratio = Math.min(containerWidth / area.width, containerHeight / area.height);
    const svgWidth = area.width * this.ratio;
    const svgHeight = area.height * this.ratio;

    const top = (containerHeight - svgHeight) / 2;
    const left = (containerWidth - svgWidth) / 2;

    this.$svgContainer.style.width = svgWidth + 'px';
    this.$svgContainer.style.height = svgHeight + 'px';
    this.$svg.setAttribute('width', svgWidth);
    this.$svg.setAttribute('height', svgHeight);
    // center the svg into the parent
    this.$svgContainer.style.position = 'absolute';
    this.$svgContainer.style.top = `${top}px`;
    this.$svgContainer.style.left = `${left}px`;

    this.$svg.style.position = 'absolute';
    this.$svg.style.top = `0px`;
    this.$svg.style.left = `0px`;

    // display background if any
    if (area.background) {
      this.$el.style.backgroundImage = `url(${area.background})`;
      this.$el.style.backgroundPosition = '50% 50%';
      this.$el.style.backgroundRepeat = 'no-repeat';
      this.$el.style.backgroundSize = 'contain';
      // force $svg to be transparent
      this.$svg.style.backgroundColor = 'transparent';
    }

    // update existing points position
    for (let [$shape, point] of this.shapePointMap)
      this.updatePoint(point);

    // expose the size of the area in pixel
    this.areaWidth = svgWidth;
    this.areaHeight = svgHeight;
  }

  /**
   * Method used to render a specific point. Override this method to display
   * points with user defined shapes. The shape returned by this method is
   * inserted into the `svg` element.
   *
   * @param {Object} point - Point to render.
   * @param {String|Number} point.id - Unique identifier for the point.
   * @param {Number} point.x - Value in the x axis in the area coordinate system.
   * @param {Number} point.y - Value in the y axis in the area coordinate system.
   * @param {Number} [point.radius=0.3] - Radius of the point (relative to the
   *  area width and height).
   * @param {String} [point.color=undefined] - Optionnal color of the point.
   */
  renderPoint(point, $shape = null) {
    if ($shape === null) {
      $shape = document.createElementNS(ns, 'circle');
      $shape.classList.add('point');
    }

    $shape.setAttribute('data-id', point.id);
    $shape.setAttribute('cx', `${point.x * this.ratio}`);
    $shape.setAttribute('cy', `${point.y * this.ratio}`);
    $shape.setAttribute('r', point.radius || 8); // radius is relative to area size

    if (point.color)
      $shape.style.fill = point.color;

    const method = point.selected ? 'add' : 'remove';
    $shape.classList[method]('selected');

    return $shape;
  }

  /**
   * Replace all the existing points with the given array of points.
   *
   * @param {Array<Object>} points - Points to render.
   */
  setPoints(points) {
    this.clearPoints();
    this.addPoints(points);
  }

  /**
   * Delete all points.
   */
  clearPoints() {
    for (let id of this._renderedPoints.keys())
      this.deletePoint(id);
  }

  /**
   * Add new points to the area.
   *
   * @param {Array<Object>} points - New points to add to the view.
   */
  addPoints(points) {
    points.forEach(point => this.addPoint(point));
  }

  /**
   * Add a new point to the area.
   *
   * @param {Object} point - New point to add to the view.
   */
  addPoint(point) {
    const $shape = this.renderPoint(point);
    this.$svg.appendChild($shape);
    this._renderedPoints.set(point.id, $shape);
    // map for easier retrieving of the point
    this.shapePointMap.set($shape, point);
  }

  /**
   * Update a point.
   *
   * @param {Object} point - Point to update.
   */
  updatePoint(point) {
    const $shape = this._renderedPoints.get(point.id);
    this.renderPoint(point, $shape);
  }

  /**
   * Delete a point.
   *
   * @param {String|Number} id - Id of the point to delete.
   */
  deletePoint(id) {
    const $shape = this._renderedPoints.get(id);
    this.$svg.removeChild($shape);
    this._renderedPoints.delete(id);
    // map for easier retrieving of the point
    this.shapePointMap.delete($shape);
  }
}

export default SpaceView;
