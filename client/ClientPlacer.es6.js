const ClientModule = require('./ClientModule');
const ClientSpace = require('./ClientSpace');
const client = require('./client');
const EventEmitter = require('events').EventEmitter;


// display strategies for placer
class ListSelector extends EventEmitter {
  constructor(options) {

    this._indexPositionMap = new Map();
    this._onSelect = this._onSelect.bind(this);
  }

  _onSelect(e) {
    const options = this.select.options;
    const selectedIndex = this.select.selectedIndex;
    const index = parseInt(options[selectedIndex].value, 10);
    const position = this._indexPositionMap.get(index);
    this.emit('select', position);
  }

  display(setup, container, options = {}) {
    this.container = container;
    this.el = document.createElement('div');

    this.select = document.createElement('select');
    this.button = document.createElement('button');
    this.button.textContent = 'OK';
    this.button.classList.add('btn');

    this.el.appendChild(this.select);
    this.el.appendChild(this.button);
    this.container.appendChild(this.el);

    this.button.addEventListener('click', this._onSelect, false);
    this.resize();
  }

  resize() {
    const containerWidth = this.container.getBoundingClientRect().width;
    const containerHeight = this.container.getBoundingClientRect().height;

    const height = this.el.getBoundingClientRect().height;
    const width = containerWidth * 2 / 3;
    const left = containerWidth / 3 / 2;
    const top = (containerHeight - height) / 2;

    this.el.style.position = 'absolute';
    this.el.style.width = width;
    this.el.style.top = top;
    this.el.style.left = left;

    this.select.style.width = width;
    this.button.style.width = width;
  }

  displayPositions(positions) {
    positions.forEach((position) => {
      const option = document.createElement('option');
      option.value = position.index;
      option.textContent = position.label;

      this.select.appendChild(option);
      this._indexPositionMap.set(position.index, position);
    });
  }
}

class ClientPlacer extends ClientModule {
  constructor(options = {}) {
    super(options.name || 'placer', true);
    this.setup = options.setup;
    this.type = options.type || 'list';

    switch (this.type) {
      case 'graphic':
        this.selector = new ClientSpace({
          fitContainer: true,
          listenTouchEvent: true,
        });
        break;
      case 'list':
        this.selector = new ListSelector({});
        break;
    }

    this._resizeSelector = this._resizeSelector.bind(this);
  }

  _resizeSelector() {
    this.selector.resize();
  }

  start() {
    super.start();

    this.selector.display(this.setup, this.view, {});
    // listen for selection
    this.selector.on('select', (position) => {
      console.log(position);
      // launch to server
      // store in local storage if options
      // this.done();
    });

    // prepare position to display
    const positions = this.setup.coordinates.map((coord, index) => {
      return {
        coordinates: coord,
        label: this.setup.labels[index],
        index: index,
      };
    });

    // make sure the DOM is ready
    setTimeout(() => {
      this.selector.displayPositions(positions, 20);
    }, 0);

    window.addEventListener('resize', this._resizeSelector, false);
  }

  // restart() {}
  // reset() {}

  done() {
    super.done();
    window.removeEventListener('resize', this._resizeSelector, false);
  }
}

module.exports = ClientPlacer;