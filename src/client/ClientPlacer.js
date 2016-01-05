import client from './client';
import ClientModule from './ClientModule';
import localStorage from './localStorage';

import SelectView from './display/SelectView';
import SpaceView from './display/SpaceView';
import SquaredView from './display/SquaredView';


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
   * @param {Object} [options={}] - Options.
   * @param {String} [options.name='placer'] - Name of the module.
   * @param {String} [options.mode='graphic'] - Selection mode. Can be:
   * - `'graphic'` to select a place on a graphical representation of the available positions.
   * - `'list'` to select a place among a list of places.
   * @param {Boolean} [options.persist=false] - Indicates whether the selected place should be stored in the `LocalStorage` for future retrieval or not.
   */
  constructor(options = {}) {
    super(options.name || 'placer', options);

    this.index = null;
    this.label = null;

    this.mode = options.mode || 'graphic';
    this.persist = options.persist || false;
    this.localStorageNS = 'placer:position';

    this._createView = this._createView.bind(this);
    this._onSelect = this._onSelect.bind(this);

    this.init();
  }

  init() {
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

    client.coordinates = null;

    this.viewCtor = SquaredView;
    this.content.mode = this.mode;
    this.content.showBtn = false;
    this.view = this.createView();
  }

  /**
   * Start the module.
   * @private
   */
  start() {
    super.start();
    // check for informations in local storage
    if (this.persist) {
      const position = localStorage.get(this.localStorageNS);

      if (position !== null) {
        this._sendPosition(position);
        return this.done();
      }
    }

    // request positions or labels
    this.send('request', this.mode);
    this.receive('setup', this._createView);

    // reset position stored in local storage
    this.receive('reset', () => localStorage.delete(this.localStorageNS));
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
  }

  /**
   * Done method.
   * @private
   */
  done() {
    super.done();
  }

  _createView(capacity, labels, coordinates, area) {
    const numLabels = labels ? labels.length : Infinity;
    const numCoordinates = coordinates ? coordinates.length : Infinity;
    let numPositions = Math.min(numLabels, numCoordinates);

    if (numPositions > capacity) { numPositions = capacity; }

    const positions = [];

    for (let i = 0; i < numPositions; i++) {
      const label = labels[i] || (i + 1).toString();

      // @todo - define if coords should be an array
      // or an object and harmonize with SpaceView, Locator, etc...
      const position = {
        id: i,
        index: i,
        label: label,
      };

      if (coordinates) {
        const coords = coordinates[i];
        position.x = coords[0];
        position.y = coords[1];
      }

      positions.push(position);
    }

    let selector;
    // @todo - disable positions selected by other players in real time
    // @todo - handle error messages
    switch (this.mode) {
      case 'graphic':
        selector = new SpaceView(area);
        this.view.setViewComponent('.section-square', selector);
        this.view.render('.section-square');

        selector.setPositions(positions);
        selector.installEvents({
          'click .position': (e) => {
            const position = selector.shapePositionMap.get(e.target);
            this._onSelect(position);
          },
        });
        break;
      case 'list':
        selector = new SelectView({
          instructions: this.content.instructions,
          entries: positions,
        });
        this.view.setViewComponent('.section-square', selector);
        this.view.render('.section-square');

        selector.installEvents({
          'change': (e) => {
            this.content.showBtn = true;
            this.view.render('.section-float');
            this.view.installEvents({
              'click .btn': (e) => {
                const position = selector.value;
                if (position) { this._onSelect(position); }
              }
            });
          },
        });
        break;
    }
  }

  _onSelect(position) {
    // optionally store in local storage
    if (this.persist) {
      this._setLocalStorage(position);
    }

    // send to server
    this._sendPosition(position);
    // @todo - should handle rejection from the server (`done` should be called only on server confirmation/aknowledgement).
    this.done();
  }

  _sendPosition(position = null) {
    if (position !== null) {
      this.index = position.index;
      this.label = position.label;
      client.coordinates = position.coordinates;
    }

    this.send('position', this.index, this.label, client.coordinates);
  }
}
