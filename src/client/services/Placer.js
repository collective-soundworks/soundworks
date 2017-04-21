import client from '../core/client';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import SelectView from '../views/SelectView';
import SpaceView from '../views/SpaceView';
import SquaredView from '../views/SquaredView';

/**
 * API of a compliant view for the `placer` service.
 *
 * @memberof module:soundworks/client
 * @interface AbstractPlacerView
 * @extends module:soundworks/client.AbstractView
 * @abstract
 */
/**
 * Set and display the `area` definition (as defined in server configuration).
 *
 * @name setReadyCallback
 * @memberof module:soundworks/client.AbstractPlacerView
 * @function
 * @abstract
 * @instance
 *
 * @param {Object} area - Definition of the area.
 * @param {Number} area.width - With of the area.
 * @param {Number} area.height - Height of the area.
 * @param {Number} [area.labels=[]] - Labels of the position.
 * @param {Number} [area.coordinates=[]] - Coordinates of the area.
 */
/**
 * Register the callback to be executed when the user select a position.
 *
 * @name setSelectCallback
 * @memberof module:soundworks/client.AbstractPlacerView
 * @function
 * @abstract
 * @instance
 *
 * @param {String} callback - Callback to execute when the user select a position.
 *  This callback should be called with the `index`, `label` and `coordinates` of
 *  the requested position.
 */
/**
 * Display the available positions.
 *
 * @name displayPosition
 * @memberof module:soundworks/client.AbstractPlacerView
 * @function
 * @abstract
 * @instance
 *
 * @param {Number} capacity - The maximum number of clients allowed.
 * @param {Array<String>} [labels=null] - An array of the labels for the positions
 * @param {Array<Array<Number>>} [coordinates=null] - An array of the coordinates of the positions
 * @param {Number} [maxClientsPerPosition=1] - Number of clients allowed for each position.
 */
/**
 * Update the view accroding to the disabled positions.
 *
 * @name updateDisabledPositions
 * @memberof module:soundworks/client.AbstractPlacerView
 * @function
 * @abstract
 * @instance
 *
 * @param {Array<Number>} disabledPositions - Array containing the indexes of
 *  the disabled positions.
 */
/**
 * Update the view when the position selected by the user is no longer available.
 *
 * @name reject
 * @memberof module:soundworks/client.AbstractPlacerView
 * @function
 * @abstract
 * @instance
 *
 * @param {Array<Number>} disabledPositions - Array containing the indexes of
 *  the disabled positions.
 */

/**
 * Callback to execute when the user select a position.
 *
 * @callback
 * @name selectCallback
 * @memberof module:soundworks/client.AbstractPlacerView
 * @param {Number} index - Index of the selected location.
 * @param {String} label - Label of the selected location if any.
 * @param {Array<Number>} coordinates - Coordinates (`[x, y]`) of the selected
 *  location if any.
 */


const SERVICE_ID = 'service:placer';

/**
 * Interface for the `'placer'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'locator'`]{@link module:soundworks/client.Locator}
 * and [`'checkin'`]{@link module:soundworks/client.Checkin} services.
 *
 * The `'placer'` service allows a client to choose its location among a set of
 * positions defined in the server's `setup` configuration entry.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Placer}*__
 *
 * @see {@link module:soundworks/client.Locator}
 * @see {@link module:soundworks/client.Checkin}
 *
 * @param {Object} options
 * @param {String} [options.mode='list'] - Sets the interaction mode for the
 *  client to choose its position, the `'list'` mode proposes a drop-down menu
 *  while the `'graphic'` mode (which requires located positions) proposes an
 *  interface representing the area and dots for each available location.
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.placer = this.require('placer', { mode: 'graphic' });
 */
class Placer extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID, true);

    const defaults = {
      mode: 'list',
      viewPriority: 6,
    };

    this.configure(defaults);

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

    this._onAknowledgeResponse = this._onAknowledgeResponse.bind(this);
    this._onClientJoined = this._onClientJoined.bind(this);
    this._onClientLeaved = this._onClientLeaved.bind(this);
    this._onSelect = this._onSelect.bind(this);
    this._onConfirmResponse = this._onConfirmResponse.bind(this);
    this._onRejectResponse = this._onRejectResponse.bind(this);

    this._sharedConfigService = this.require('shared-config');
  }

  /** @private */
  start() {
    super.start();
    this.show();

    this.send('request');

    this.receive('aknowlegde', this._onAknowledgeResponse);
    this.receive('confirm', this._onConfirmResponse);
    this.receive('reject', this._onRejectResponse);
    this.receive('client-joined', this._onClientJoined);
    this.receive('client-leaved', this._onClientLeaved);
  }

  /** @private */
  stop() {
    this.removeListener('aknowlegde', this._onAknowledgeResponse);
    this.removeListener('confirm', this._onConfirmResponse);
    this.removeListener('reject', this._onRejectResponse);
    this.removeListener('client-joined', this._onClientJoined);
    this.removeListener('client-leaved', this._onClientLeaved);

    this.hide();
  }

  /** @private */
  _onAknowledgeResponse(setupConfigItem, disabledPositions) {
    const setup = this._sharedConfigService.get(setupConfigItem);
    const area = setup.area;
    const capacity = setup.capacity;
    const labels = setup.labels;
    const coordinates = setup.coordinates;
    const maxClientsPerPosition = setup.maxClientsPerPosition;

    this.nbrPositions = capacity / maxClientsPerPosition;

    if (area)
      this.view.setArea(area);

    this.view.displayPositions(capacity, labels, coordinates, maxClientsPerPosition);
    this.view.updateDisabledPositions(disabledPositions);
    this.view.setSelectCallack(this._onSelect);
  }

  /** @private */
  _onSelect(index, label, coordinates) {
    this.send('position', index, label, coordinates);
  }

  /** @private */
  _onConfirmResponse(index, label, coordinates) {
    client.index = this.index = index;
    client.label = this.label = label;
    client.coordinates = coordinates;

    this.ready();
  }

  /** @private */
  _onClientJoined(disabledPositions) {
    if (disabledPositions.length >= this.nbrPositions)
      this.view.reject(disabledPositions);
    else
      this.view.updateDisabledPositions(disabledPositions);
  }

  /** @private */
  _onClientLeaved(disabledPositions) {
    this.view.updateDisabledPositions(disabledPositions);
  }

  /** @private */
  _onRejectResponse(disabledPositions) {
    if (disabledPositions.length >= this.nbrPositions)
      this.view.reject(disabledPositions);
    else
      this.view.updateDisabledPositions(disabledPositions);
  }
}

serviceManager.register(SERVICE_ID, Placer);

export default Placer;
