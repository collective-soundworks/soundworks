import View from './View';

const template = `<svg id="scene"></svg>`;
const ns = 'http://www.w3.org/2000/svg';


export default class SpaceView extends View {
  /**
   * Returns a new space instance.
   * @param {Object} area - The area to represent, should be defined by a `width`, an `height` and an optionnal background.
   * @param {Object} events - The events to attach to the view.
   * @param {Object} options - @todo
   * @param {Object} [options.isSubView=false] - Don't automatically position the view inside it's container (is needed when inserted in a module with css flex behavior).
   * @todo - `options.isSubView` should be removed and handled through css flex.
   */
  constructor(area, events = {}, options = {}) {
    options = Object.assign({ className: 'space' }, options);
    super(template, {}, events, options);

    /**
     * The area to display.
     * @type {Object}
     */
    this.area = area;

    /**
     * Expose a Map of the $shapes and their relative position object.
     * @type {Map}
     */
    this.shapePositionMap = new Map();

    this._renderedPositions = new Map();
    this._isSubView = options.isSubView || false;
  }

  /**
   * Apply style and cache elements when rendered.
   * @private
   */
  onRender() {
    this.$svg = this.$el.querySelector('#scene');
  }

  /**
   * Update the area when inserted in the DOM.
   * @private
   */
  onShow() {
    this._setArea();
  }

  /**
   * Update the area when inserted in the DOM.
   * @private
   */
  onResize(orientation, width, height) {
    super.onResize(orientation, width, height);
    // this.$el.style.width = '100%';
    // this.$el.style.height = '100%';

    this._setArea();
  }

  /**
   * The method used to render a specific position. This method should be overriden to display a position with a user defined shape.
   * @param {Object} pos - The position to render.
   * @param {String|Number} pos.id - An unique identifier for the position.
   * @param {Number} pos.x - The position in the x axis in the area cordinate system.
   * @param {Number} pos.y - The position in the y axis in the area cordinate system.
   * @param {Number} [pos.radius=0.3] - The radius of the position (relative to the area width and height).
   */
  renderPosition(pos) {
    const $shape = document.createElementNS(ns, 'circle');
    $shape.classList.add('position');

    $shape.setAttribute('data-id', pos.id);
    $shape.setAttribute('cx', `${pos.x}`);
    $shape.setAttribute('cy', `${pos.y}`);
    $shape.setAttribute('r', pos.radius || 0.3); // radius is relative to area size
    if (pos.selected) { $shape.classList.add('selected'); }

    return $shape;
  }

  /**
   * Render the area.
   * @private
   */
  _setArea() {
    if (!this.$parent) { return; }

    const area = this.area;
    // use `this.$el` size instead of `this.$parent` size to ignore parent padding
    const boundingRect = this.$el.getBoundingClientRect();
    const containerWidth = boundingRect.width;
    const containerHeight = boundingRect.height;


    const ratio = (() => {
      return (containerWidth < containerHeight) ?
        containerWidth / area.width :
        containerHeight / area.height;
    })();

    const svgWidth = area.width * ratio;
    const svgHeight = area.height * ratio;

    this.$svg.setAttribute('width', svgWidth);
    this.$svg.setAttribute('height', svgHeight);
    this.$svg.setAttribute('viewBox', `0 0 ${area.width} ${area.height}`);
    // center the svg into the parent
    this.$svg.style.position = 'relative';

    // be consistant with module flex css
    // const test = this.$svg.getBoundingClientRect();
    if (!this._isSubView) {
      this.$svg.style.left = `${(containerWidth - svgWidth) / 2}px`;
      this.$svg.style.top = `${(containerHeight - svgHeight) / 2}px`;
    }

    // display background if any
    if (area.background) {
      this.$el.style.backgroundImage = area.background;
      this.$el.style.backgroundPosition = '50% 50%';
      this.$el.style.backgroundRepeat = 'no-repeat';
      this.$el.style.backgroundSize = 'cover';
    }
  }

  /**
   * Replace all the existing positions with the given array of position.
   * @param {Array<Object>} positions - The new positions to render.
   */
  setPositions(positions) {
    this.clearPositions()
    this.addPositions(positions);
  }

  /**
   * Clear all the displayed positions.
   */
  clearPositions() {
    const keys = this._renderedPositions.keys();
    for (let id of keys) {
      this.deletePosition(id);
    }
  }

  /**
   * Add new positions to the area.
   * @param {Array<Object>} positions - The new positions to render.
   */
  addPositions(positions) {
    positions.forEach(pos => this.addPosition(pos));
  }

  /**
   * Add a new position to the area.
   * @param {Object} pos - The new position to render.
   */
  addPosition(pos) {
    const $shape = this.renderPosition(pos);
    this.$svg.appendChild($shape);
    this._renderedPositions.set(pos.id, $shape);
    // map for easier retrieving of the position
    this.shapePositionMap.set($shape, pos);
  }

  /**
   * Update a rendered position.
   * @param {Object} pos - The position to update.
   */
  updatePosition(pos) {
    const $shape = this._renderedPositions.get(pos.id);

    $shape.setAttribute('cx', `${pos.x}`);
    $shape.setAttribute('cy', `${pos.y}`);
    $shape.setAttribute('r', pos.radius || 0.3);
  }

  /**
   * Remove a rendered position.
   * @param {String|Number} id - The position to delete.
   */
  deletePosition(id) {
    const $shape = this._renderedPositions.get(id);
    this.$svg.removechild($shape);
    this._renderedPositions.delete(id);
    // map for easier retrieving of the position
    this.shapePositionMap.delete($shape);
  }
}
