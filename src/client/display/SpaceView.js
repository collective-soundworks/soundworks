import View from './View';

const template = `<svg id="scene"></svg>`;
const ns = 'http://www.w3.org/2000/svg';

export default class SpaceView extends View {
  constructor(area, options) {
    super(template, {}, {}, { className: 'space' });

    this.area = area;
    this._renderedPositions = new Map();
  }

  onRender() {
    this.$el.style.width = '100%';
    this.$el.style.height = '100%';

    this.$svg = this.$el.querySelector('#scene');
  }

  onShow() {
    this.setArea();
  }

  onResize(orientation, width, height) {
    this.setArea();
  }

  // override to change the rendering shape
  renderPosition(pos) {
    const $shape = document.createElementNS(ns, 'circle');
    $shape.classList.add('position');

    $shape.setAttribute('cx', `${pos.x}`);
    $shape.setAttribute('cy', `${pos.y}`);
    $shape.setAttribute('r', pos.radius || 0.3); // radius is relative to area size
    if (pos.selected) { $shape.classList.add('selected'); }

    return $shape;
  }

  setArea() {
    if (!this.$parent) { return; }

    const area = this.area;
    // use `this.el` size instead of `this.$parent` size
    const boundingRect = this.$el.getBoundingClientRect();
    const containerWidth = boundingRect.width;
    const containerHeight = boundingRect.height;

    const ratio = (() => {
      return (area.width > area.height) ?
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
    const test = this.$svg.getBoundingClientRect();

    if (test.left === 0) {
      this.$svg.style.left = `${(containerWidth - svgWidth) / 2}px`;
    }

    if (test.top === 0) {
      this.$svg.style.top = `${(containerHeight - svgHeight) / 2}px`;
    }

    // display background if any
    this.$svg.style.backgroundColor = 'red';
  }

  setPositions(positions) {
    this.clearPositions()
    this.addPositions(positions);
  }

  clearPositions() {
    const keys = this._renderedPositions.keys();
    for (let id of keys) {
      this.deletePosition(id);
    }
  }

  addPositions(positions) {
    positions.forEach(pos => this.addPosition(pos));
  }

  addPosition(pos) {
    const $shape = this.renderPosition(pos)
    this.$svg.appendChild($shape);
    this._renderedPositions.set(pos.id, $shape);
  }

  updatePosition(pos) {
    const $shape = this._renderedPositions.get(id);

    $shape.setAttribute('cx', `${pos.x}`);
    $shape.setAttribute('cy', `${pos.y}`);
    $shape.setAttribute('r', pos.radius || 0.3);
  }

  deletePosition(id) {
    const $shape = this._renderedPositions.get(id);
    this.$svg.removechild($shape);
    this._renderedPositions.delete(id);
  }
}