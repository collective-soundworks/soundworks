import client from '../core/client';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
// import localStorage from './localStorage';

import SelectView from '../display/SelectView';
import SpaceView from '../display/SpaceView';
import SquaredView from '../display/SquaredView';

//  // view API
//  class AbstactPlacerView extends soundworks.display.View {
//    /**
//     * @param {Array<Object>} positions - Array of positions (index, id, label, coords)
//     */
//    displayPositions(positions) {}
//
//    /**
//     * @param {Array<Number>} positions - Array of indexes of the positions to disable.
//     */
//    disablePositions(indexes) {}
//
//    /**
//     * @param {Number} positions - Index of the position to disabled.
//     */
//    disablePosition(index) {}
//
//    /**
//     * @param {Number} positions - Index of the position to enable.
//     */
//    enablePosition(index) {}
//
//    /**
//     * @param {Function} callback - Callback to be applied when a position is selected.
//     */
//    onSelect(callback) {
//      this._onSelect = callback;
//    }
//
//    setArea(area) {}
//
//    /**
//     * Called when no avaible position.
//     */
//    reject() {}
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
        if (position) { this._onSelect(position); }
      }
    });
  }

  displayPositions(positions) {
    this.selector = new SelectView({
      instructions: this.content.instructions,
      entries: positions,
    });

    this.setViewComponent('.section-square', this.selector);
    this.render('.section-square');

    this.selector.installEvents({
      'change': this._onSelectionChange(),
    });
  }

  disablePositions(indexes) {
    indexes.forEach((index) => this.selector.disableIndex(index));
  }

  disablePosition(index) {
    this.selector.disableIndex(index);
  }

  enablePosition(index) {
    this.selector.enableIndex(index);
  }

  onSelect(callback) {
    this._onSelect = callback;
  }

  reject() {
    // @todo - must be tested
    this.setViewComponent('.section-square');
    this.content.rejected = true;
    this.render();
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
      this._onSelect(position);
  }

  setArea(area) {
    this._area = area;
  }

  displayPositions(positions) {
    this.positions = positions;

    this.selector = new SpaceView();
    this.selector.setArea(this._area);
    this.setViewComponent('.section-square', this.selector);
    this.render('.section-square');

    this.selector.setPoints(positions);

    this.selector.installEvents({
      'click .point': this._onSelectionChange
    });
  }

  disablePositions(indexes) {
    this._disabledPositions = this._disabledPositions.concat(indexes);
    indexes.forEach((index) => this.disablePosition(index));
  }

  disablePosition(index) {
    this._disabledPositions.push(index);
    const position = this.positions[index];

    if (position) {
      position.selected = true;
      this.selector.updatePoint(position);
    }
  }

  enablePosition(index) {
    const disabledIndex = this._disabledPositions.indexOf(index);
    if (disabledIndex !== -1)
      this._disabledPositions.splice(disabledIndex, 1);

    const position = this.positions[index];

    if (position) {
      position.selected = false;
      this.selector.updatePoint(position);
    }
  }

  onSelect(callback) {
    this._onSelect = callback;
  }

  reject() {
    // @todo - must be tested
    this.setViewComponent('.section-square');
    this.content.rejected = true;
    this.render();
  }
}


const SERVICE_ID = 'service:placer';

/**
 * [client] Allow to select a place within a set of predefined positions (i.e. labels and/or coordinates).
 *
 * (See also {@link src/server/ServerPlacer.js~ServerPlacer} on the server side.)
 *
 * @example
 * const placer = soundworks.client.require('place', { capacity: 100 });
 */
class ClientPlacer extends Service {
  /** */
  constructor() {
    super(SERVICE_ID, true);

    /**
     * @param {String} [options.mode='graphic'] - Selection mode. Can be:
     * - `'graphic'` to select a place on a graphical representation of the available positions.
     * - `'list'` to select a place among a list of places.
     * @param {String} [options.persist=false] - Defines if the location should be stored in `localStorage`.
     */
    const defaults = {
      mode: 'list',
      persist: false,
      view: null,
      viewCtor: null,
      viewPriority: 6,
    };

    this.configure(defaults);

    this._onSetupResponse = this._onSetupResponse.bind(this);
    this._onEnableIndex = this._onEnableIndex.bind(this);
    this._onDisableIndex = this._onDisableIndex.bind(this);
    this._onSelect = this._onSelect.bind(this);
    this._onConfirmResponse = this._onConfirmResponse.bind(this);
    this._onRejectResponse = this._onRejectResponse.bind(this);
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
    // allow to pass any view
    if (this.options.view !== null) {

    } else {
      if (this.options.viewCtor !== null)
        this.viewCtor = this.options.viewCtor;
      else {
        switch (this.options.mode) {
          case 'graphic':
            this.viewCtor = _GraphicView;
            break;
          case 'list':
          default:
            this.viewCtor = _ListView;
            break;
        }
      }

      this.content.mode = this.options.mode;
      this.view = this.createView();
    }
  }

  /** @private */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.show();
    // request positions or labels
    this.send('request');

    this.receive('setup', this._onSetupResponse);
    this.receive('confirm', this._onConfirmResponse);
    this.receive('reject', this._onRejectResponse);
    this.receive('enable-index', this._onEnableIndex);
    this.receive('disable-index', this._onDisableIndex);
  }

  /** @private */
  stop() {
    this.removeListener('setup', this._onSetupResponse);
    this.removeListener('confirm', this._onConfirmResponse);
    this.removeListener('reject', this._onRejectResponse);
    this.removeListener('enable-index', this._onEnableIndex);
    this.removeListener('disable-index', this._onDisableIndex);

    this.hide();
  }

  _onSetupResponse(capacity, labels, coordinates, area, disabledPositions) {
    const numLabels = labels ? labels.length : Infinity;
    const numCoordinates = coordinates ? coordinates.length : Infinity;
    let numPositions = Math.min(numLabels, numCoordinates);

    if (numPositions > capacity) { numPositions = capacity; }

    this.positions = [];

    for (let i = 0; i < numPositions; i++) {
      const label = labels !== null ? labels[i] : (i + 1).toString();
      const position = { id: i, index: i, label: label };

      if (coordinates) {
        const coords = coordinates[i];
        position.x = coords[0];
        position.y = coords[1];
      }

      this.positions.push(position);
    }

    if (area) {
      this.view.setArea(area);
    }

    this.view.displayPositions(this.positions);
    this.view.disablePositions(disabledPositions);
    this.view.onSelect(this._onSelect);
  }

  _onEnableIndex(index) {
    this.view.enablePosition(index);
  }

  _onDisableIndex(index) {
    this.view.disablePosition(index);
  }

  _onSelect(position) {
    client.index = this.index = position.index;
    client.label = this.label = position.label;
    client.coordinates = position.coordinates;

    this.send('position', client.index, client.label, client.coordinates);
  }

  _onConfirmResponse() {
    this.ready();
  }

  _onRejectResponse(disabledPositions) {
    if (disabledPositions.length === this.positions.length)
      this.view.reject();
    else
      this.view.render();
      this.view.disablePositions(disabledPositions);
  }
}

serviceManager.register(SERVICE_ID, ClientPlacer);

export default ClientPlacer;
