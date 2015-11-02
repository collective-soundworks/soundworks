const EventEmitter = require('events').EventEmitter;

import client from './client.es6.js';
import ClientModule from './ClientModule.es6.js';
import ClientSpace from './ClientSpace.es6.js';

/**
 * display strategies for placer
 * @private
 */
class ListSelector extends EventEmitter {
  constructor(options) {
    this._indexPositionMap = new Map();
    this._onSelect = this._onSelect.bind(this);
  }

  _onSelect(e) {
    const options = this._select.options;
    const selectedIndex = this._select.selectedIndex;
    const index = parseInt(options[selectedIndex].value, 10);
    const position = this._indexPositionMap.get(index);
    this.emit('select', position);
  }

  display(setup, container, options = {}) {
    this.container = container;
    this.el = document.createElement('div');

    this._select = document.createElement('select');
    this.button = document.createElement('button');
    this.button.textContent = 'OK';
    this.button.classList.add('btn');

    this.el.appendChild(this._select);
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
    this.el.style.width = width + 'px';
    this.el.style.top = top + 'px';
    this.el.style.left = left + 'px';

    this._select.style.width = width + 'px';
    this.button.style.width = width + 'px';
  }

  displayPositions(positions) {
    positions.forEach((position) => {
      const option = document.createElement('option');
      option.value = position.index;
      option.textContent = position.label;

      this._select.appendChild(option);
      this._indexPositionMap.set(position.index, position);
    });
  }
}

/**
 * The `ClientPlacer` module allows to select a place in a list of predefined places.
 */
export default class ClientPlacer extends ClientModule {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='performance'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {ClientSetup} [options.setup] The setup in which to select the place.
   * @param {String} [options.mode='list'] Selection mode. Can be:
   * - `'list'` to select a place among a list of places.
   * - `'graphic`' to select a place on a graphical representation of the setup.
   * @param {Boolean} [options.persist=false] Indicates whether the selected place should be stored in the `LocalStorage` for future retrieval or not.
   * @param {String} [localStorageId='soundworks'] Prefix of the `LocalStorage` ID.
   * @todo this._selector
   */
  constructor(options = {}) {
    super(options.name || 'placer', true, options.color || 'black');

    /**
     * The setup in which to select a place.
     * @type {ClientSetup}
     */
    this.setup = options.setup;

    this._mode = options.mode || 'list';
    this._persist = options.persist || false;
    this._localStorageId = options.localStorageId || 'soundworks';

    switch (this._mode) {
      case 'graphic':
        this._selector = new ClientSpace({
          fitContainer: true,
          listenTouchEvent: true,
        });
        break;
      case 'list':
        this._selector = new ListSelector({});
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
    this._selector.resize();
  }

  _getStorageKey() {
    return `${this._localStorageId}:${this.name}`;
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

  /**
   * Starts the module.
   * @private
   */
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
    if (this._persist) {
      const position = this._retrieveInformation();

      if (position !== null) {
        this._sendInformation(position);
        return this.done();
      }
    }

    // listen for selection
    this._selector.on('select', (position) => {
      // optionally store in local storage
      if (this._persist) {
        this._persistInformation(position);
      }
      // send to server
      this._sendInformation(position);
      this.done();
    });

    this._selector.display(this.setup, this.view, {});
    // make sure the DOM is ready (needed on ipods)
    setTimeout(() => {
      this._selector.displayPositions(this.positions, 20);
    }, 0);
  }

  /**
   * Restarts the module.
   * @private
   */
  restart() {
    super.restart();
    this._sendInformation();
  }

  /**
   * Resets the module to initial state.
   * @private
   */
  reset() {
    super.reset();
    // reset client
    this.index = null;
    this.label = null;
    client.coordinates = null;
    // remove listener
    this._selector.removeAllListeners('select');
  }

  /**
   * Done method.
   * @private
   */
  done() {
    super.done();
    window.removeEventListener('resize', this._resizeSelector, false);
    this._selector.removeAllListeners('select');
  }
}
