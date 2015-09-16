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

    this.button.addEventListener('touchstart', this._onSelect, false);
    this.resize();
  }

  resize() {
    if (!this.container) { return; } // if called before `display`
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
    this.mode = options.mode || 'list';
    this.persist = options.persist || false;
    this.localStorageId = options.localStorageId || 'soundworks';

    switch (this.mode) {
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
    window.addEventListener('resize', this._resizeSelector, false);
    // allow to reset localStorage
    client.receive(`${this.name}:reset`, this._deleteInformation);

    // DEBUG
    // this._deleteInformation();
  }

  _resizeSelector() {
    this.selector.resize();
  }

  _getStorageKey() {
    return `${this.localStorageId}:${this.name}`;
  }

  _persistInformation(position) {
    // if options.expire add th timestamp to the position object
    const key = this._getStorageKey();
    window.localStorage.setItem(key, JSON.stringify(position));
  }

  _retrieveInformation() {
    const key = this._getStorageKey();
    const position = window.localStorage.getItem(key);

    // check for expires entry
    // delete if now > expires
    return JSON.parse(position);
  }

  _deleteInformation() {
    const key = this._getStorageKey();
    window.localStorage.removeItem(key);
    // window.localStorage.clear(); // remove everything for the domain
  }

  _sendInformation(position = null) {
    if (position !== null) {
      this.index = position.index;
      this.label = position.label;
      client.coordinates = position.coordinates;
    }

    client.send(
      `${this.name}:information`,
      this.index,
      this.label,
      client.coordinates
    );
  }

  start() {
    super.start();

    // prepare positions
    this.positions = this.setup.coordinates.map((coord, index) => {
      return {
        index: index,
        label: this.setup.labels[index],
        coordinates: coord,
      };
    });

    // check for informations in local storage
    if (this.persist) {
      const position = this._retrieveInformation();

      if (position !== null) {
        this._sendInformation(position);
        return this.done();
      }
    }

    // listen for selection
    this.selector.on('select', (position) => {
      // optionally store in local storage
      if (this.persist) {
        this._persistInformation(position);
      }
      // send to server
      this._sendInformation(position);
      this.done();
    });

    this.selector.display(this.setup, this.view, {});
    // make sure the DOM is ready (needed on ipods)
    setTimeout(() => {
      this.selector.displayPositions(this.positions, 20);
    }, 0);
  }

  restart() {
    super.restart();
    this._sendInformation();
  }

  reset() {
    super.reset();
    // reset client
    this.index = null;
    this.label = null;
    client.coordinates = null;
    // remove listener
    this.selector.removeAllListener('select');
  }

  done() {
    super.done();
    window.removeEventListener('resize', this._resizeSelector, false);
    this.selector.removeAllListener('select');
  }
}

module.exports = ClientPlacer;
