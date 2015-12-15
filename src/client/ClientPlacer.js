import { EventEmitter } from 'events';
import client from './client';
import ClientModule from './ClientModule';
// import Space from './Space';

/**
 * Display strategies for placer
 * @private
 */
export class ListSelector extends EventEmitter {
  constructor(options) {
    super();
    this.labels = [];
    this.coordinates = [];
    this._onSelect = this._onSelect.bind(this);
  }

  _onSelect(e) {
    const options = this.select.options;
    const selectedIndex = this.select.selectedIndex;
    const index = parseInt(options[selectedIndex].value, 10);
    this.emit('select', index);
  }

  resize() {
    if (this.container) {
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

      this.select.style.width = width + 'px';
      this.button.style.width = width + 'px';
    }
  }

  display(container) {
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

  displayPositions(labels, coordinates, capacity) {
    this.labels = labels;
    this.coordinates = coordinates;

    for(let i = 0; i < positions.length; i++) {
      const position = positions[i];
      const option = document.createElement('option');

      option.value = i;
      option.textContent = position.label || (i + 1).toString();

      this.select.appendChild(option);
    }
  }
}

/**
 * [client] Allow to select a place within a set of predefined positions (i.e. labels and/or coordinates).
 *
 * (See also {@link src/server/ServerPlacer.js~ServerPlacer} on the server side.)
 *
 * @example
 * const placer = new ClientPlacer({ capacity: 100 });
 */
export default class ClientPlacer extends ClientModule {
  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='performance'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String} [options.mode='list'] Selection mode. Can be:
   * - `'list'` to select a place among a list of places.
   * - `'graphic`' to select a place on a graphical representation of the available positions.
   * @param {Boolean} [options.persist=false] Indicates whether the selected place should be stored in the `LocalStorage` for future retrieval or not.
   * @param {String} [localStorageId='soundworks'] Prefix of the `LocalStorage` ID.
   * @todo this.selector
   */
  constructor(options = {}) {
    super(options.name || 'placer', true, options.color || 'black');

    /**
     * Index of the position selected by the user.
     * @type {Number}
     */
    this.index = null;

    /**
     * Label of the position selected by the user.
     * @type {String}
     */
    this.label = null;

    this.mode = options.mode || 'list';
    this.persist = options.persist || false;
    this.localStorageId = options.localStorageId || 'soundworks';

    switch (this.mode) {
      case 'graphic':
        this.selector = new Space({
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
  }

  _resizeSelector() {
    this.selector.resize();
  }

  _getStorageKey() {
    return `${this.localStorageId}:${this.name}`;
  }

  _setLocalStorage(position) {
    // if options.expire add th timestamp to the position object
    const key = this._getStorageKey();
    window.localStorage.setItem(key, JSON.stringify(position));
  }

  _getLocalStorage() {
    const key = this._getStorageKey();
    const position = window.localStorage.getItem(key);

    // check for expires entry
    // delete if now > expires
    return JSON.parse(position);
  }

  _deleteLocalStorage() {
    const key = this._getStorageKey();
    window.localStorage.removeItem(key);
    // window.localStorage.clear(); // remove everything for the domain
  }

  _sendPosition(position = null) {
    if (position !== null) {
      this.index = position.index;
      this.label = position.label;
      client.coordinates = position.coordinates;
    }

    this.send('position', this.index, this.label, client.coordinates);
  }

  _display(positions, area) {
    // listen for selection
    this.selector.on('select', (position) => {
      // optionally store in local storage
      if (this.persist)
        this._setLocalStorage(position);

      // send to server
      this._sendPosition(position);
      this.done();
    });

    this.selector.display(this.view, area);
    this.selector.displayPositions(positions, 20);
  }

  /**
   * Start the module.
   * @private
   */
  start() {
    super.start();

    // check for informations in local storage
    if (this.persist) {
      const position = this._getLocalStorage();

      if (position !== null) {
        this._sendPosition(position);
        return this.done();
      }
    }

    // request positions or labels
    this.send('request', this.mode);

    this.receive('setup', (capacity, labels, coordinates, area) => {
      let numLabels = labels ? labels.length : Infinity;
      let numCoordinates = coordinates ? coordinates.length : Infinity;
      let numPositions = Math.min(numLabels, numCoordinates);

      if(numPositions > capacity)
        numPositions = capacity;

      let positions = [];

      for(let i = 0; i < numPositions; i++) {
        let label = labels[i] || (i + 1).toString();
        let coordinates = coordinates[i];
        let position = {
          index: i,
          label: label,
          coordinates: coordinates,
        };
        positions.push(position);
      }

      this._display(positions, area);
    });

    // allow to reset localStorage
    this.receive('reset', this._deleteLocalStorage);
  }

  /**
   * Restart the module.
   * @private
   */
  restart() {
    super.restart();
    this._sendPosition();
  }

  /**
   * Reset the module to initial state.
   * @private
   */
  reset() {
    super.reset();
    // reset client
    this.index = null;
    this.label = null;
    client.coordinates = null;

    // remove listener
    this.selector.removeAllListeners('select');
  }

  /**
   * Done method.
   * @private
   */
  done() {
    super.done();
    window.removeEventListener('resize', this._resizeSelector, false);
    this.selector.removeAllListeners('select');
  }
}
