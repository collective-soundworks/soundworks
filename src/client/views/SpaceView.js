import View from './View';

const svgTemplate = `<svg></svg>`;
const ns = 'http://www.w3.org/2000/svg';


export default class SpaceView extends View {
  /**
   * Returns a new space instance.
   * @param {Object} area - The area to represent, should be defined by a `width`, an `height` and an optionnal background.
   * @param {Object} events - The events to attach to the view.
   * @param {Object} options - @todo
   */
  constructor(template = svgTemplate, content = {}, events = {}, options = {}) {
    options = Object.assign({ className: 'space' }, options);
    super(template, content, events, options);

    /**
     * The area to display.
     * @type {Object}
     */
    this.area = null;

    /**
     * The with of the rendered area in pixels.
     * @type {Number}
     */
    this.areaWidth = null;

    /**
     * The height of the rendered area in pixels.
     * @type {Number}
     */
    this.areaHeight = null;

    /**
     * Expose a Map of the $shapes and their relative point object.
     * @type {Map}
     */
    this.shapePointMap = new Map();

    /**
     * Expose a Map of the $shapes and their relative line object.
     * @type {Map}
     */
    this.shapeLineMap = new Map();

    this._renderedPoints = new Map();
    this._renderedLines = new Map();
  }

  /**
   * Define the area to be renderer.
   * @type {Object} area - On object describing the area to render, generally
   *  defined in server configuration.
   * @attribute {Number} area.width - The width of the area.
   * @attribute {Number} area.height - The height of the area.
   */
  setArea(area) {
    this.area = area;
  }

  /** @inheritdoc */
  onRender() {
    this.$svg = this.$el.querySelector('svg');
    this.addDefinitions();
    this._renderArea();
  }

  /** @inheritdoc */
  onResize(viewportWidth, viewportHeight, orientation) {
    super.onResize(viewportWidth, viewportHeight, orientation);
    // override size to match parent size if component of another view
    if (this.parentView) {
      this.$el.style.width = '100%';
      this.$el.style.height = '100%';
    }

    this._renderArea();
  }

  /**
   * @private
   * @note - don't expose for now.
   */
  addDefinitions() {
    this.$defs = document.createElementNS(ns, 'defs');

    // const markerCircle = `
    //   <marker id="marker-circle" markerWidth="7" markerHeight="7" refX="4" refY="4" >
    //       <circle cx="4" cy="4" r="3" class="marker-circle" />
    //   </marker>
    // `;

    const markerArrow = `
      <marker id="marker-arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <path d="M0,0 L0,10 L10,5 L0,0" class="marker-arrow" />
      </marker>
    `;

    this.$defs.innerHTML = markerArrow;
    this.$svg.insertBefore(this.$defs, this.$svg.firstChild);
  }


  /** @private */
  _renderArea() {
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

    this.$svg.setAttribute('width', svgWidth);
    this.$svg.setAttribute('height', svgHeight);
    // this.$svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
    // center the svg into the parent
    this.$svg.style.position = 'relative';
    this.$svg.style.top = `${top}px`;
    this.$svg.style.left = `${left}px`;

    // display background if any
    if (area.background) {
      this.$el.style.backgroundImage = area.background;
      this.$el.style.backgroundPosition = '50% 50%';
      this.$el.style.backgroundRepeat = 'no-repeat';
      this.$el.style.backgroundSize = 'cover';
    }

    // update existing points position
    for (let [$shape, point] of this.shapePointMap) {
      this.updatePoint(point)
    }

    // expose the size of the area in pixel
    this.areaWidth = svgWidth;
    this.areaHeight = svgHeight;

    // update area for markers
    // const markers = Array.from(this.$defs.querySelectorAll('marker'));
    // markers.forEach((marker) => {
    //   marker.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
    // });
  }


  /**
   * The method used to render a specific point. This method should be
   * overriden to display a point with a user defined shape. These shapes
   * are appended to the `svg` element.
   *
   * @param {Object} point - The point to render.
   * @param {String|Number} point.id - An unique identifier for the point.
   * @param {Number} point.x - The point in the x axis in the area cordinate system.
   * @param {Number} point.y - The point in the y axis in the area cordinate system.
   * @param {Number} [point.radius=0.3] - The radius of the point (relative to the
   *  area width and height).
   * @param {String} [point.color=undefined] - If specified, the color of the point.
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
   * Replace all the existing points with the given array of point.
   * @param {Array<Object>} points - The new points to render.
   */
  setPoints(points) {
    this.clearPoints()
    this.addPoints(points);
  }

  /**
   * Clear all the displayed points.
   */
  clearPoints() {
    for (let id of this._renderedPoints.keys()) {
      this.deletePoint(id);
    }
  }

  /**
   * Add new points to the area.
   * @param {Array<Object>} points - The new points to render.
   */
  addPoints(points) {
    points.forEach(point => this.addPoint(point));
  }

  /**
   * Add a new point to the area.
   * @param {Object} point - The new point to render.
   */
  addPoint(point) {
    const $shape = this.renderPoint(point);
    this.$svg.appendChild($shape);
    this._renderedPoints.set(point.id, $shape);
    // map for easier retrieving of the point
    this.shapePointMap.set($shape, point);
  }

  /**
   * Update a rendered point.
   * @param {Object} point - The point to update.
   */
  updatePoint(point) {
    const $shape = this._renderedPoints.get(point.id);
    this.renderPoint(point, $shape);
  }

  /**
   * Remove a rendered point.
   * @param {String|Number} id - The id of the point to delete.
   */
  deletePoint(id) {
    const $shape = this._renderedPoints.get(id);
    this.$svg.removeChild($shape);
    this._renderedPoints.delete(id);
    // map for easier retrieving of the point
    this.shapePointMap.delete($shape);
  }


// @todo - refactor with new viewbox
// @todo - remove code duplication in update

//  /**
//   * The method used to render a specific line. This method should be overriden to display a point with a user defined shape. These shapes are prepended to the `svg` element
//   * @param {Object} line - The line to render.
//   * @param {String|Number} line.id - An unique identifier for the line.
//   * @param {Object} line.tail - The point where the line should begin.
//   * @param {Object} line.head - The point where the line should end.
//   * @param {Boolean} [line.directed=false] - Defines whether the line should be directed or not.
//   * @param {String} [line.color=undefined] - If specified, the color of the line.
//   */
//  renderLine(line) {
//    const tail = line.tail;
//    const head = line.head;
//
//    const $shape = document.createElementNS(ns, 'polyline');
//    $shape.classList.add('line');
//    $shape.setAttribute('data-id', line.id);
//
//    const points = [
//      `${tail.x},${tail.y}`,
//      `${(tail.x + head.x) / 2},${(tail.y + head.y) / 2}`,
//      `${head.x},${head.y}`
//    ];
//
//    $shape.setAttribute('points', points.join(' '));
//    $shape.setAttribute('vector-effect', 'non-scaling-stroke');
//
//    if (line.color)
//      $shape.style.stroke = line.color;
//
//    if (line.directed)
//      $shape.classList.add('arrow');
//
//    return $shape;
//  }
//
//  /**
//   * Replace all the existing lines with the given array of line.
//   * @param {Array<Object>} lines - The new lines to render.
//   */
//  setLines(lines) {
//    this.clearLines();
//    this.addLines(lines);
//  }
//
//  /**
//   * Clear all the displayed lines.
//   */
//  clearLines() {
//    for (let id of this._renderedLines.keys()) {
//      this.deleteLine(id);
//    }
//  }
//
//  /**
//   * Add new lines to the area.
//   * @param {Array<Object>} lines - The new lines to render.
//   */
//  addLines(lines) {
//    lines.forEach(line => this.addLine(line));
//  }
//
//  /**
//   * Add a new line to the area.
//   * @param {Object} line - The new line to render.
//   */
//  addLine(line) {
//    const $shape = this.renderLine(line);
//    // insert just after the <defs> tag
//    // this.$svg.insertBefore($shape, this.$svg.firstChild.nextSibling);
//    this.$svg.appendChild($shape);
//
//    this._renderedLines.set(line.id, $shape);
//    this.shapeLineMap.set($shape, line);
//  }
//
//  /**
//   * Update a rendered line.
//   * @param {Object} line - The line to update.
//   */
//  updateLine(line) {
//    const $shape = this._renderedLines.get(line.id);
//    const tail = line.tail;
//    const head = line.head;
//
//    const points = [
//      `${tail.x},${tail.y}`,
//      `${(tail.x + head.x) / 2},${(tail.y + head.y) / 2}`,
//      `${head.x},${head.y}`
//    ];
//
//    $shape.setAttribute('points', points.join(' '));
//  }
//
//  /**
//   * Remove a rendered line.
//   * @param {String|Number} id - The id of the line to delete.
//   */
//  deleteLine(id) {
//    const $shape = this._renderedLines.get(id);
//    this.$svg.removeChild($shape);
//
//    this._renderedLines.delete(id);
//    this.shapeLineMap.delete($shape);
//  }
}
