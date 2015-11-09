import client from './client';
import Module from './Module';

const ns = 'http://www.w3.org/2000/svg';


/**
 * The {@link Space} displays the setup upon request.
 */
export default class Space extends Module {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='space'] Name of the module.
   * @param {Boolean} [options.fitContainer=false] Indicates whether the graphical representation fits the container size or not.
   * @param {Boolean} [options.listenTouchEvent=false] Indicates whether to setup a listener on the space graphical representation or not.
   */
  constructor(options = {}) {
    super(options.name || 'space');

    /**
     * Relative width of the setup.
     * @type {Number}
     */
    this.width = 1;

    /**
     * Relative heigth of the setup.
     * @type {Number}
     */
    this.height = 1;

    this._fitContainer = (options.fitContainer || false);
    this._listenTouchEvent = (options.listenTouchEvent || false);

    // this.spacing = 1;
    // this.labels = [];
    // this.coordinates = [];
    this.type = undefined;

    this._xFactor = 1;
    this._yFactor = 1;

    // map between shapes and their related positions
    this.shapePositionMap = [];
    this.positionIndexShapeMap = {};
  }

  // TODO note -> modfiy here
  initSetup(setup) {
    this.width = setup.width;
    this.height = setup.height;
    // this.spacing = setup.spacing;
    // this.labels = setup.labels;
    // this.coordinates = setup.coordinates;
    this.type = setup.type;
    this.background = setup.background;

    this.done();
  }

  /**
   * Starts the module.
   * @private
   */
  start() {
    super.start();
    this.done();
    // client.receive('setup:init', this._onSetupInit);
    // client.send('setup:request');
  }

  /**
   * Restarts the module.
   * @private
   */
  restart() {
    super.restart();
    this.done();
  }

  /**
   * Resets the module.
   * @private
   */
  reset() {
    this.shapePositionMap = [];
    this.positionIndexShapeMap = {};
    // client.removeListener('setup:init', this._onSetupInit);
    this.container.innerHTML = '';
  }

  /**
   * The `display` method displays a graphical representation of the setup.
   * @param {ClientSetup} setup Setup to display.
   * @param {DOMElement} container Container to append the setup representation to.
   * @param {Object} [options={}] Options.
   * @param {String} [options.transform] Indicates which transformation to aply to the representation. Possible values are:
   * - `'rotate180'`: rotates the representation by 180 degrees.
   */
  display(setup, container, options = {}) {
    this.initSetup(setup);
    this.container = container;
    this.container.classList.add('space');
    this.renderingOptions = options;

    if (options.showBackground) {
      this.container.style.backgroundImage = `url(${this.background})`;
      this.container.style.backgroundPosition = '50% 50%';
      this.container.style.backgroundRepeat = 'no-repeat';
      this.container.style.backgroundSize = 'contain';
    }

    const svg = document.createElementNS(ns, 'svg');
    const group = document.createElementNS(ns, 'g');

    svg.appendChild(group);
    this.container.appendChild(svg);

    this.svg = svg;
    this.group = group;

    this._resize(this.container);
  }

  _resize() {
    const boundingRect = this.container.getBoundingClientRect();
    const containerWidth = boundingRect.width;
    const containerHeight = boundingRect.height;
    // force adaptation to container size

    const ratio = (() => {
      return (this.width > this.height) ?
        containerWidth / this.width :
        containerHeight / this.height;
    })();

    let svgWidth = this.width * ratio;
    let svgHeight = this.height * ratio;

    if (this._fitContainer) {
      svgWidth = containerWidth;
      svgHeight = containerHeight;
    }

    const offsetLeft = (containerWidth - svgWidth) / 2;
    const offsetTop = (containerHeight - svgHeight) / 2;

    this.svg.setAttributeNS(null, 'width', svgWidth);
    this.svg.setAttributeNS(null, 'height', svgHeight);
     // use setup coordinates
    this.svg.setAttributeNS(null, 'viewBox', `0 0 ${this.width} ${this.height}`);
    // center svg in container
    this.svg.style.position = 'absolute';
    this.svg.style.left = `${offsetLeft}px`;
    this.svg.style.top = `${offsetTop}px`;

    // apply rotations
    if (this.renderingOptions.transform) {
      switch (this.renderingOptions.transform) {
        case 'rotate180':
          this.container.setAttribute('data-xfactor', -1);
          this.container.setAttribute('data-yfactor', -1);
          const transform = `rotate(180, ${svgWidth / 2}, ${svgHeight / 2})`;
          this.group.setAttributeNS(null, 'transform', transform);
          break;
      }
    }

    this.svgOffsetLeft = offsetLeft;
    this.svgOffsetTop = offsetTop;
    this.svgWidth = svgWidth;
    this.svgHeight = svgHeight;

    this.ratio = ratio;
  }

  /**
   * Display an array of positions.
   * @param {Object[]} positions Positions to display.
   * @param {Number} size Size of the positions to display.
   */
  displayPositions(positions, size) {
    // clean surface
    this.removeAllPositions();

    positions.forEach((position) => {
      this.addPosition(position, size);
    });

    // add listeners
    if (this._listenTouchEvent) {
      this.container.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const dots = this.shapePositionMap.map((entry) => { return entry.dot });
        let target = e.target;

        // Could probably be simplified...
        while (target !== this.container) {
          if (dots.indexOf(target) !== -1) {
            for (let i = 0; i < this.shapePositionMap; i++) {
              const entry = this.shapePositionMap[i];
              if (target === entry.dot) {
                const position = entry.position;
                this.emit('select', position);
              }
            }
          }

          target = target.parentNode;
        }
      });
    }
  }

  /**
   * Adds a position to the display.
   * @param {Object} position Position to add.
   * @param {Number} size Size of the position to draw.
   */
  addPosition(position, size) {
    const radius = size / 2;
    const coordinates = position.coordinates;
    const index = position.index;

    const dot = document.createElementNS(ns, 'circle');
    dot.setAttributeNS(null, 'r', radius / this.ratio);
    dot.setAttributeNS(null, 'cx', coordinates[0] * this.width);
    dot.setAttributeNS(null, 'cy', coordinates[1] * this.height);
    dot.style.fill = 'steelblue';

    this.group.appendChild(dot);
    this.shapePositionMap.push({ dot, position });
    this.positionIndexShapeMap[index] = dot;
  }

  /**
   * Removes a position from the display.
   * @param {Object} position Position to remove.
   */
  removePosition(position) {
    const el = this. positionIndexShapeMap[position.index];
    this.group.removeChild(el);
  }

  /**
   * Remove all the positions displayed.
   */
  removeAllPositions() {
    while (this.group.firstChild) {
      this.group.removeChild(this.group.firstChild);
    }
  }
}
