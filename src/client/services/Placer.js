import client from '../core/client';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
// import localStorage from './localStorage';
import SelectView from '../views/SelectView';
import SpaceView from '../views/SpaceView';
import SquaredView from '../views/SquaredView';

//  /**
//   * Interface of the view of the placer.
//   */
//  class AbstactPlacerView extends soundworks.View {
//    /**
//     * @param {Number} capacity - The maximum number of clients allowed.
//     * @param {Array<String>} [labels=null] - An array of the labels for the positions
//     * @param {Array<Array<Number>>} [coordinates=null] - An array of the coordinates of the positions
//     * @param {Number} [maxClientsPerPosition=1] - The number of client allowed for each position.
//     */
//    displayPositions(capacity, labels = null, coordinates = null, maxClientsPerPosition = 1) {}
//
//    /**
//     * @param {Array<Number>} disabledIndexes - Array of indexes of the disabled positions.
//     */
//    updateDisabledPositions(disabledIndexes) {}
//
//    /**
//     * Called when no place left or when the choice of the user as been rejected by
//     * the server. The view should be should update accordingly.
//     * @param {Array<Number>} disabledIndexes - Array of indexes of the disabled positions.
//     */
//    reject(disabledIndexes) {}
//
//     /**
//     * Register the area definition to the view.
//     * @param {Object} area - The definition of the area.
//     */
//    setArea(area) {
//      this._area = area;
//    }
//
//    /**
//     * @param {Function} callback - Callback to be applied when a position is selected.
//     */
//    onSelect(callback) {
//      this._onSelect = callback;
//    }
//  }

class _ListView extends SquaredView {
  constructor(template, content, events, options) {
    super(template, content, events, options);

    this._onSelectionChange = this._onSelectionChange.bind(this);
  }

  _onSelectionChange(e) {
    this.content.showBtn = true;
    this.render('.section-float');
    this.installEvents({
      'click .btn': (e) => {
        const position = this.selector.value;

        if (position)
          this._onSelect(position.index, position.label, position.coordinates);
      }
    });
  }

  setArea(area) { /* no need for area */ }

  displayPositions(capacity, labels = null, coordinates = null, maxClientsPerPosition = 1) {
    this.positions = [];
    this.numberPositions = capacity / maxClientsPerPosition;

    for (let index = 0; index < this.numberPositions; index++) {
      const label = labels !== null ? labels[index] : (index + 1).toString();
      const position = { index: index, label: label };

      if (coordinates)
        position.coordinates = coordinates[index];

      this.positions.push(position);
    }

    this.selector = new SelectView({
      instructions: this.content.instructions,
      entries: this.positions,
    });

    this.setViewComponent('.section-square', this.selector);
    this.render('.section-square');

    this.selector.installEvents({
      'change': this._onSelectionChange,
    });
  }

  updateDisabledPositions(indexes) {
    for (let index = 0; index < this.numberPositions; index++) {
      if (indexes.indexOf(index) === -1)
        this.selector.enableIndex(index);
      else
        this.selector.disableIndex(index);
    }
  }

  onSelect(callback) {
    this._onSelect = callback;
  }

  reject(disabledPositions) {
    if (disabledPositions.length >= this.numberPositions) {
      this.setViewComponent('.section-square');
      this.content.rejected = true;
      this.render();
    } else {
      this.disablePositions(disabledPositions);
    }
  }
}

class _GraphicView extends SquaredView {
  constructor(template, content, events, options) {
    super(template, content, events, options);

    this._area = null;
    this._disabledPositions = [];
    this._onSelectionChange = this._onSelectionChange.bind(this);
  }

  _onSelectionChange(e) {
    const position = this.selector.shapePointMap.get(e.target);
    const disabledIndex = this._disabledPositions.indexOf(position.index);

    if (disabledIndex === -1)
      this._onSelect(position.id, position.label, [position.x, position.y]);
  }

  setArea(area) {
    this._area = area;
  }

  displayPositions(capacity, labels = null, coordinates = null, maxClientsPerPosition = 1) {
    this.numberPositions = capacity / maxClientsPerPosition;
    this.positions = [];

    for (let i = 0; i < this.numberPositions; i++) {
      const label = labels !== null ? labels[i] : (i + 1).toString();
      const position = { id: i, label: label };
      const coords = coordinates[i];
      position.x = coords[0];
      position.y = coords[1];

      this.positions.push(position);
    }

    this.selector = new SpaceView();
    this.selector.setArea(this._area);
    this.setViewComponent('.section-square', this.selector);
    this.render('.section-square');

    this.selector.setPoints(this.positions);

    this.selector.installEvents({
      'click .point': this._onSelectionChange
    });
  }

  updateDisabledPositions(indexes) {
    this._disabledPositions = indexes;

    for (let index = 0; index < this.numberPositions; index++) {
      const position = this.positions[index];
      const isDisabled = indexes.indexOf(index) !== -1;
      position.selected = isDisabled ? true : false;
      this.selector.updatePoint(position);
    }
  }

  onSelect(callback) {
    this._onSelect = callback;
  }

  reject(disabledPositions) {
    if (disabledPositions.length >= this.numberPositions) {
      this.setViewComponent('.section-square');
      this.content.rejected = true;
      this.render();
    } else {
      this.view.updateDisabledPositions(disabledPositions);
    }
  }
}


const SERVICE_ID = 'service:placer';

/**
 * Interface of the `'placer'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'locator'`]{@link module:soundworks/client.Locator}
 * and [`'checkin'`]{@link module:soundworks/client.Checkin} services.
 *
 * The `'placer'` service allows a client to choose its place among a set of
 * positions defined in the server's `setup` configuration entry.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Placer}*__
 *
 * @see {@link module:soundworks/client.Locator}
 * @see {@link module:soundworks/client.Checkin}
 *
 * @param {Object} options
 * @param {String} [options.mode='list'] - Sets the interaction mode for the
 *  client to choose its position, the `'list'` mode propose a drop-down menu
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
      view: null,
      viewCtor: null,
      viewPriority: 6,
    };

    this.configure(defaults);

    this._onAknowledgeResponse = this._onAknowledgeResponse.bind(this);
    this._onClientJoined = this._onClientJoined.bind(this);
    this._onClientLeaved = this._onClientLeaved.bind(this);
    this._onSelect = this._onSelect.bind(this);
    this._onConfirmResponse = this._onConfirmResponse.bind(this);
    this._onRejectResponse = this._onRejectResponse.bind(this);

    this._sharedConfigService = this.require('shared-config');
  }

  /** @private */
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

    // allow to pass any view
    if (this.options.view !== null) {
      this.view = this.options.view;
    } else {
      if (this.options.viewCtor !== null) {

      } else {
        switch (this.options.mode) {
          case 'graphic':
            this.viewCtor = _GraphicView;
            break;
          case 'list':
          default:
            this.viewCtor = _ListView;
            break;
        }

        this.viewContent.mode = this.options.mode;
        this.view = this.createView();
      }
    }
  }

  /** @private */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

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

    if (area)
      this.view.setArea(area);

    this.view.displayPositions(capacity, labels, coordinates, maxClientsPerPosition);
    this.view.updateDisabledPositions(disabledPositions);
    this.view.onSelect(this._onSelect);
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
    this.view.updateDisabledPositions(disabledPositions);
  }

  /** @private */
  _onClientLeaved(disabledPositions) {
    this.view.updateDisabledPositions(disabledPositions);
  }

  /** @private */
  _onRejectResponse(disabledPositions) {
    this.view.reject(disabledPositions);
  }
}

serviceManager.register(SERVICE_ID, Placer);

export default Placer;
