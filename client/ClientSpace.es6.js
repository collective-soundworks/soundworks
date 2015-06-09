const ClientModule = require('./ClientModule');
const client = require('./client');
const ns = 'http://www.w3.org/2000/svg';

class ClientSpace extends ClientModule {
  constructor(options = {}) {
    super(options.name || 'space');

    this.width = 1;
    this.height = 1;
    // this.spacing = 1;
    // this.labels = [];
    // this.coordinates = [];
    this.type = undefined;

    this._xFactor = 1;
    this._yFactor = 1;

    this._onSetupInit = this._onSetupInit.bind(this);
  }

  _onSetupInit(setup) {
    this.width = setup.width;
    this.height = setup.height;
    // this.spacing = setup.spacing;
    // this.labels = setup.labels;
    // this.coordinates = setup.coordinates;
    this.type = setup.type;
    this.background = setup.background;

    this.done();
  }

  start() {
    super.start();

    client.receive('setup:init', this._onSetupInit);

    client.send('setup:request');
  }

  restart() {
    super.restart();
    this.done();
  }

  reset() {
    client.removeListener('setup:init', this._onSetupInit);
    this.container.innerHTML = '';
  }

  display(container, options = {}) {
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

    this.resize(this.container);
    this.positionIndexElementMap = new Map();
  }

  resize() {
    const boundingRect = this.container.getBoundingClientRect();
    const containerWidth = boundingRect.width;
    const containerHeight = boundingRect.height;
    const ratio = (() => {
      return (this.width > this.height) ?
        containerWidth / this.width :
        containerHeight / this.height;
    })();
    const svgWidth = this.width * ratio;
    const svgHeight = this.height * ratio;
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
          const transform = `rotate(180, ${this.width / 2}, ${this.height / 2})`;
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

  displayPositions(positions, size) {
    // clean surface
    this.removeAllPositions();

    positions.forEach((position) => {
      this.addPosition(position, size);
    });
  }

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
    this.positionIndexElementMap.set(index, dot);
  }

  removePosition(position) {
    const el = this.positionIndexElementMap.get(position.index);
    this.group.removeChild(el);
  }

  removeAllPositions() {
    while (this.group.firstChild) {
      this.group.removeChild(this.group.firstChild);
    }
  }

}

module.exports = ClientSpace;


