'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _SelectView = require('../views/SelectView');

var _SelectView2 = _interopRequireDefault(_SelectView);

var _SpaceView = require('../views/SpaceView');

var _SpaceView2 = _interopRequireDefault(_SpaceView);

var _SquaredView3 = require('../views/SquaredView');

var _SquaredView4 = _interopRequireDefault(_SquaredView3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var _ListView = function (_SquaredView) {
  (0, _inherits3.default)(_ListView, _SquaredView);

  function _ListView(template, content, events, options) {
    (0, _classCallCheck3.default)(this, _ListView);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_ListView).call(this, template, content, events, options));

    _this._onSelectionChange = _this._onSelectionChange.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(_ListView, [{
    key: '_onSelectionChange',
    value: function _onSelectionChange(e) {
      var _this2 = this;

      this.content.showBtn = true;
      this.render('.section-float');
      this.installEvents({
        'click .btn': function clickBtn(e) {
          var position = _this2.selector.value;

          if (position) _this2._onSelect(position.index, position.label, position.coordinates);
        }
      });
    }
  }, {
    key: 'setArea',
    value: function setArea(area) {/* no need for area */}
  }, {
    key: 'displayPositions',
    value: function displayPositions(capacity) {
      var labels = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var coordinates = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
      var maxClientsPerPosition = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

      this.positions = [];
      this.numberPositions = capacity / maxClientsPerPosition;

      for (var index = 0; index < this.numberPositions; index++) {
        var label = labels !== null ? labels[index] : (index + 1).toString();
        var position = { index: index, label: label };

        if (coordinates) position.coordinates = coordinates[index];

        this.positions.push(position);
      }

      this.selector = new _SelectView2.default({
        instructions: this.content.instructions,
        entries: this.positions
      });

      this.setViewComponent('.section-square', this.selector);
      this.render('.section-square');

      this.selector.installEvents({
        'change': this._onSelectionChange
      });
    }
  }, {
    key: 'updateDisabledPositions',
    value: function updateDisabledPositions(indexes) {
      for (var index = 0; index < this.numberPositions; index++) {
        if (indexes.indexOf(index) === -1) this.selector.enableIndex(index);else this.selector.disableIndex(index);
      }
    }
  }, {
    key: 'onSelect',
    value: function onSelect(callback) {
      this._onSelect = callback;
    }
  }, {
    key: 'reject',
    value: function reject(disabledPositions) {
      if (disabledPositions.length >= this.numberPositions) {
        this.setViewComponent('.section-square');
        this.content.rejected = true;
        this.render();
      } else {
        this.disablePositions(disabledPositions);
      }
    }
  }]);
  return _ListView;
}(_SquaredView4.default);
// import localStorage from './localStorage';


var _GraphicView = function (_SquaredView2) {
  (0, _inherits3.default)(_GraphicView, _SquaredView2);

  function _GraphicView(template, content, events, options) {
    (0, _classCallCheck3.default)(this, _GraphicView);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_GraphicView).call(this, template, content, events, options));

    _this3._area = null;
    _this3._disabledPositions = [];
    _this3._onSelectionChange = _this3._onSelectionChange.bind(_this3);
    return _this3;
  }

  (0, _createClass3.default)(_GraphicView, [{
    key: '_onSelectionChange',
    value: function _onSelectionChange(e) {
      var position = this.selector.shapePointMap.get(e.target);
      var disabledIndex = this._disabledPositions.indexOf(position.index);

      if (disabledIndex === -1) this._onSelect(position.id, position.label, [position.x, position.y]);
    }
  }, {
    key: 'setArea',
    value: function setArea(area) {
      this._area = area;
    }
  }, {
    key: 'displayPositions',
    value: function displayPositions(capacity) {
      var labels = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var coordinates = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
      var maxClientsPerPosition = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

      this.numberPositions = capacity / maxClientsPerPosition;
      this.positions = [];

      for (var i = 0; i < this.numberPositions; i++) {
        var label = labels !== null ? labels[i] : (i + 1).toString();
        var position = { id: i, label: label };
        var coords = coordinates[i];
        position.x = coords[0];
        position.y = coords[1];

        this.positions.push(position);
      }

      this.selector = new _SpaceView2.default();
      this.selector.setArea(this._area);
      this.setViewComponent('.section-square', this.selector);
      this.render('.section-square');

      this.selector.setPoints(this.positions);

      this.selector.installEvents({
        'click .point': this._onSelectionChange
      });
    }
  }, {
    key: 'updateDisabledPositions',
    value: function updateDisabledPositions(indexes) {
      this._disabledPositions = indexes;

      for (var index = 0; index < this.numberPositions; index++) {
        var position = this.positions[index];
        var isDisabled = indexes.indexOf(index) !== -1;
        position.selected = isDisabled ? true : false;
        this.selector.updatePoint(position);
      }
    }
  }, {
    key: 'onSelect',
    value: function onSelect(callback) {
      this._onSelect = callback;
    }
  }, {
    key: 'reject',
    value: function reject(disabledPositions) {
      if (disabledPositions.length >= this.numberPositions) {
        this.setViewComponent('.section-square');
        this.content.rejected = true;
        this.render();
      } else {
        this.view.updateDisabledPositions(disabledPositions);
      }
    }
  }]);
  return _GraphicView;
}(_SquaredView4.default);

var SERVICE_ID = 'service:placer';

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

var Placer = function (_Service) {
  (0, _inherits3.default)(Placer, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Placer() {
    (0, _classCallCheck3.default)(this, Placer);

    var _this4 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Placer).call(this, SERVICE_ID, true));

    var defaults = {
      mode: 'list',
      view: null,
      viewCtor: null,
      viewPriority: 6
    };

    _this4.configure(defaults);

    _this4._onAknowledgeResponse = _this4._onAknowledgeResponse.bind(_this4);
    _this4._onClientJoined = _this4._onClientJoined.bind(_this4);
    _this4._onClientLeaved = _this4._onClientLeaved.bind(_this4);
    _this4._onSelect = _this4._onSelect.bind(_this4);
    _this4._onConfirmResponse = _this4._onConfirmResponse.bind(_this4);
    _this4._onRejectResponse = _this4._onRejectResponse.bind(_this4);

    _this4._sharedConfigService = _this4.require('shared-config');
    return _this4;
  }

  /** @private */


  (0, _createClass3.default)(Placer, [{
    key: 'init',
    value: function init() {
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
        if (this.options.viewCtor !== null) {} else {
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

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Placer.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.show();
      this.send('request');

      this.receive('aknowlegde', this._onAknowledgeResponse);
      this.receive('confirm', this._onConfirmResponse);
      this.receive('reject', this._onRejectResponse);
      this.receive('client-joined', this._onClientJoined);
      this.receive('client-leaved', this._onClientLeaved);
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      this.removeListener('aknowlegde', this._onAknowledgeResponse);
      this.removeListener('confirm', this._onConfirmResponse);
      this.removeListener('reject', this._onRejectResponse);
      this.removeListener('client-joined', this._onClientJoined);
      this.removeListener('client-leaved', this._onClientLeaved);

      this.hide();
    }

    /** @private */

  }, {
    key: '_onAknowledgeResponse',
    value: function _onAknowledgeResponse(setupConfigItem, disabledPositions) {
      var setup = this._sharedConfigService.get(setupConfigItem);
      var area = setup.area;
      var capacity = setup.capacity;
      var labels = setup.labels;
      var coordinates = setup.coordinates;
      var maxClientsPerPosition = setup.maxClientsPerPosition;

      if (area) this.view.setArea(area);

      this.view.displayPositions(capacity, labels, coordinates, maxClientsPerPosition);
      this.view.updateDisabledPositions(disabledPositions);
      this.view.onSelect(this._onSelect);
    }

    /** @private */

  }, {
    key: '_onSelect',
    value: function _onSelect(index, label, coordinates) {
      this.send('position', index, label, coordinates);
    }

    /** @private */

  }, {
    key: '_onConfirmResponse',
    value: function _onConfirmResponse(index, label, coordinates) {
      _client2.default.index = this.index = index;
      _client2.default.label = this.label = label;
      _client2.default.coordinates = coordinates;

      this.ready();
    }

    /** @private */

  }, {
    key: '_onClientJoined',
    value: function _onClientJoined(disabledPositions) {
      this.view.updateDisabledPositions(disabledPositions);
    }

    /** @private */

  }, {
    key: '_onClientLeaved',
    value: function _onClientLeaved(disabledPositions) {
      this.view.updateDisabledPositions(disabledPositions);
    }

    /** @private */

  }, {
    key: '_onRejectResponse',
    value: function _onRejectResponse(disabledPositions) {
      this.view.reject(disabledPositions);
    }
  }]);
  return Placer;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Placer);

exports.default = Placer;
//# sourceMappingURL=data:application/json;base64,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RUFBb0MsTUFBcEM7O2tCQUVlLE0iLCJmaWxlIjoiUGxhY2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuLy8gaW1wb3J0IGxvY2FsU3RvcmFnZSBmcm9tICcuL2xvY2FsU3RvcmFnZSc7XG5pbXBvcnQgU2VsZWN0VmlldyBmcm9tICcuLi92aWV3cy9TZWxlY3RWaWV3JztcbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi4vdmlld3MvU3BhY2VWaWV3JztcbmltcG9ydCBTcXVhcmVkVmlldyBmcm9tICcuLi92aWV3cy9TcXVhcmVkVmlldyc7XG5cbi8vICAvKipcbi8vICAgKiBJbnRlcmZhY2Ugb2YgdGhlIHZpZXcgb2YgdGhlIHBsYWNlci5cbi8vICAgKi9cbi8vICBjbGFzcyBBYnN0YWN0UGxhY2VyVmlldyBleHRlbmRzIHNvdW5kd29ya3MuVmlldyB7XG4vLyAgICAvKipcbi8vICAgICAqIEBwYXJhbSB7TnVtYmVyfSBjYXBhY2l0eSAtIFRoZSBtYXhpbXVtIG51bWJlciBvZiBjbGllbnRzIGFsbG93ZWQuXG4vLyAgICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IFtsYWJlbHM9bnVsbF0gLSBBbiBhcnJheSBvZiB0aGUgbGFiZWxzIGZvciB0aGUgcG9zaXRpb25zXG4vLyAgICAgKiBAcGFyYW0ge0FycmF5PEFycmF5PE51bWJlcj4+fSBbY29vcmRpbmF0ZXM9bnVsbF0gLSBBbiBhcnJheSBvZiB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHBvc2l0aW9uc1xuLy8gICAgICogQHBhcmFtIHtOdW1iZXJ9IFttYXhDbGllbnRzUGVyUG9zaXRpb249MV0gLSBUaGUgbnVtYmVyIG9mIGNsaWVudCBhbGxvd2VkIGZvciBlYWNoIHBvc2l0aW9uLlxuLy8gICAgICovXG4vLyAgICBkaXNwbGF5UG9zaXRpb25zKGNhcGFjaXR5LCBsYWJlbHMgPSBudWxsLCBjb29yZGluYXRlcyA9IG51bGwsIG1heENsaWVudHNQZXJQb3NpdGlvbiA9IDEpIHt9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBAcGFyYW0ge0FycmF5PE51bWJlcj59IGRpc2FibGVkSW5kZXhlcyAtIEFycmF5IG9mIGluZGV4ZXMgb2YgdGhlIGRpc2FibGVkIHBvc2l0aW9ucy5cbi8vICAgICAqL1xuLy8gICAgdXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoZGlzYWJsZWRJbmRleGVzKSB7fVxuLy9cbi8vICAgIC8qKlxuLy8gICAgICogQ2FsbGVkIHdoZW4gbm8gcGxhY2UgbGVmdCBvciB3aGVuIHRoZSBjaG9pY2Ugb2YgdGhlIHVzZXIgYXMgYmVlbiByZWplY3RlZCBieVxuLy8gICAgICogdGhlIHNlcnZlci4gVGhlIHZpZXcgc2hvdWxkIGJlIHNob3VsZCB1cGRhdGUgYWNjb3JkaW5nbHkuXG4vLyAgICAgKiBAcGFyYW0ge0FycmF5PE51bWJlcj59IGRpc2FibGVkSW5kZXhlcyAtIEFycmF5IG9mIGluZGV4ZXMgb2YgdGhlIGRpc2FibGVkIHBvc2l0aW9ucy5cbi8vICAgICAqL1xuLy8gICAgcmVqZWN0KGRpc2FibGVkSW5kZXhlcykge31cbi8vXG4vLyAgICAgLyoqXG4vLyAgICAgKiBSZWdpc3RlciB0aGUgYXJlYSBkZWZpbml0aW9uIHRvIHRoZSB2aWV3LlxuLy8gICAgICogQHBhcmFtIHtPYmplY3R9IGFyZWEgLSBUaGUgZGVmaW5pdGlvbiBvZiB0aGUgYXJlYS5cbi8vICAgICAqL1xuLy8gICAgc2V0QXJlYShhcmVhKSB7XG4vLyAgICAgIHRoaXMuX2FyZWEgPSBhcmVhO1xuLy8gICAgfVxuLy9cbi8vICAgIC8qKlxuLy8gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBiZSBhcHBsaWVkIHdoZW4gYSBwb3NpdGlvbiBpcyBzZWxlY3RlZC5cbi8vICAgICAqL1xuLy8gICAgb25TZWxlY3QoY2FsbGJhY2spIHtcbi8vICAgICAgdGhpcy5fb25TZWxlY3QgPSBjYWxsYmFjaztcbi8vICAgIH1cbi8vICB9XG5cbmNsYXNzIF9MaXN0VmlldyBleHRlbmRzIFNxdWFyZWRWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucykge1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UgPSB0aGlzLl9vblNlbGVjdGlvbkNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgX29uU2VsZWN0aW9uQ2hhbmdlKGUpIHtcbiAgICB0aGlzLmNvbnRlbnQuc2hvd0J0biA9IHRydWU7XG4gICAgdGhpcy5yZW5kZXIoJy5zZWN0aW9uLWZsb2F0Jyk7XG4gICAgdGhpcy5pbnN0YWxsRXZlbnRzKHtcbiAgICAgICdjbGljayAuYnRuJzogKGUpID0+IHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNlbGVjdG9yLnZhbHVlO1xuXG4gICAgICAgIGlmIChwb3NpdGlvbilcbiAgICAgICAgICB0aGlzLl9vblNlbGVjdChwb3NpdGlvbi5pbmRleCwgcG9zaXRpb24ubGFiZWwsIHBvc2l0aW9uLmNvb3JkaW5hdGVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldEFyZWEoYXJlYSkgeyAvKiBubyBuZWVkIGZvciBhcmVhICovIH1cblxuICBkaXNwbGF5UG9zaXRpb25zKGNhcGFjaXR5LCBsYWJlbHMgPSBudWxsLCBjb29yZGluYXRlcyA9IG51bGwsIG1heENsaWVudHNQZXJQb3NpdGlvbiA9IDEpIHtcbiAgICB0aGlzLnBvc2l0aW9ucyA9IFtdO1xuICAgIHRoaXMubnVtYmVyUG9zaXRpb25zID0gY2FwYWNpdHkgLyBtYXhDbGllbnRzUGVyUG9zaXRpb247XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5udW1iZXJQb3NpdGlvbnM7IGluZGV4KyspIHtcbiAgICAgIGNvbnN0IGxhYmVsID0gbGFiZWxzICE9PSBudWxsID8gbGFiZWxzW2luZGV4XSA6IChpbmRleCArIDEpLnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHsgaW5kZXg6IGluZGV4LCBsYWJlbDogbGFiZWwgfTtcblxuICAgICAgaWYgKGNvb3JkaW5hdGVzKVxuICAgICAgICBwb3NpdGlvbi5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzW2luZGV4XTtcblxuICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaChwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3RvciA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGluc3RydWN0aW9uczogdGhpcy5jb250ZW50Lmluc3RydWN0aW9ucyxcbiAgICAgIGVudHJpZXM6IHRoaXMucG9zaXRpb25zLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnLCB0aGlzLnNlbGVjdG9yKTtcbiAgICB0aGlzLnJlbmRlcignLnNlY3Rpb24tc3F1YXJlJyk7XG5cbiAgICB0aGlzLnNlbGVjdG9yLmluc3RhbGxFdmVudHMoe1xuICAgICAgJ2NoYW5nZSc6IHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlLFxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoaW5kZXhlcykge1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm51bWJlclBvc2l0aW9uczsgaW5kZXgrKykge1xuICAgICAgaWYgKGluZGV4ZXMuaW5kZXhPZihpbmRleCkgPT09IC0xKVxuICAgICAgICB0aGlzLnNlbGVjdG9yLmVuYWJsZUluZGV4KGluZGV4KTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5zZWxlY3Rvci5kaXNhYmxlSW5kZXgoaW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIG9uU2VsZWN0KGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fb25TZWxlY3QgPSBjYWxsYmFjaztcbiAgfVxuXG4gIHJlamVjdChkaXNhYmxlZFBvc2l0aW9ucykge1xuICAgIGlmIChkaXNhYmxlZFBvc2l0aW9ucy5sZW5ndGggPj0gdGhpcy5udW1iZXJQb3NpdGlvbnMpIHtcbiAgICAgIHRoaXMuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tc3F1YXJlJyk7XG4gICAgICB0aGlzLmNvbnRlbnQucmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXNhYmxlUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgX0dyYXBoaWNWaWV3IGV4dGVuZHMgU3F1YXJlZFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9hcmVhID0gbnVsbDtcbiAgICB0aGlzLl9kaXNhYmxlZFBvc2l0aW9ucyA9IFtdO1xuICAgIHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlID0gdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIF9vblNlbGVjdGlvbkNoYW5nZShlKSB7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNlbGVjdG9yLnNoYXBlUG9pbnRNYXAuZ2V0KGUudGFyZ2V0KTtcbiAgICBjb25zdCBkaXNhYmxlZEluZGV4ID0gdGhpcy5fZGlzYWJsZWRQb3NpdGlvbnMuaW5kZXhPZihwb3NpdGlvbi5pbmRleCk7XG5cbiAgICBpZiAoZGlzYWJsZWRJbmRleCA9PT0gLTEpXG4gICAgICB0aGlzLl9vblNlbGVjdChwb3NpdGlvbi5pZCwgcG9zaXRpb24ubGFiZWwsIFtwb3NpdGlvbi54LCBwb3NpdGlvbi55XSk7XG4gIH1cblxuICBzZXRBcmVhKGFyZWEpIHtcbiAgICB0aGlzLl9hcmVhID0gYXJlYTtcbiAgfVxuXG4gIGRpc3BsYXlQb3NpdGlvbnMoY2FwYWNpdHksIGxhYmVscyA9IG51bGwsIGNvb3JkaW5hdGVzID0gbnVsbCwgbWF4Q2xpZW50c1BlclBvc2l0aW9uID0gMSkge1xuICAgIHRoaXMubnVtYmVyUG9zaXRpb25zID0gY2FwYWNpdHkgLyBtYXhDbGllbnRzUGVyUG9zaXRpb247XG4gICAgdGhpcy5wb3NpdGlvbnMgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1iZXJQb3NpdGlvbnM7IGkrKykge1xuICAgICAgY29uc3QgbGFiZWwgPSBsYWJlbHMgIT09IG51bGwgPyBsYWJlbHNbaV0gOiAoaSArIDEpLnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHsgaWQ6IGksIGxhYmVsOiBsYWJlbCB9O1xuICAgICAgY29uc3QgY29vcmRzID0gY29vcmRpbmF0ZXNbaV07XG4gICAgICBwb3NpdGlvbi54ID0gY29vcmRzWzBdO1xuICAgICAgcG9zaXRpb24ueSA9IGNvb3Jkc1sxXTtcblxuICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaChwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3RvciA9IG5ldyBTcGFjZVZpZXcoKTtcbiAgICB0aGlzLnNlbGVjdG9yLnNldEFyZWEodGhpcy5fYXJlYSk7XG4gICAgdGhpcy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnLCB0aGlzLnNlbGVjdG9yKTtcbiAgICB0aGlzLnJlbmRlcignLnNlY3Rpb24tc3F1YXJlJyk7XG5cbiAgICB0aGlzLnNlbGVjdG9yLnNldFBvaW50cyh0aGlzLnBvc2l0aW9ucyk7XG5cbiAgICB0aGlzLnNlbGVjdG9yLmluc3RhbGxFdmVudHMoe1xuICAgICAgJ2NsaWNrIC5wb2ludCc6IHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlXG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhpbmRleGVzKSB7XG4gICAgdGhpcy5fZGlzYWJsZWRQb3NpdGlvbnMgPSBpbmRleGVzO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubnVtYmVyUG9zaXRpb25zOyBpbmRleCsrKSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb25zW2luZGV4XTtcbiAgICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBpbmRleGVzLmluZGV4T2YoaW5kZXgpICE9PSAtMTtcbiAgICAgIHBvc2l0aW9uLnNlbGVjdGVkID0gaXNEaXNhYmxlZCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIHRoaXMuc2VsZWN0b3IudXBkYXRlUG9pbnQocG9zaXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIG9uU2VsZWN0KGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fb25TZWxlY3QgPSBjYWxsYmFjaztcbiAgfVxuXG4gIHJlamVjdChkaXNhYmxlZFBvc2l0aW9ucykge1xuICAgIGlmIChkaXNhYmxlZFBvc2l0aW9ucy5sZW5ndGggPj0gdGhpcy5udW1iZXJQb3NpdGlvbnMpIHtcbiAgICAgIHRoaXMuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tc3F1YXJlJyk7XG4gICAgICB0aGlzLmNvbnRlbnQucmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWV3LnVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgICB9XG4gIH1cbn1cblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6cGxhY2VyJztcblxuLyoqXG4gKiBJbnRlcmZhY2Ugb2YgdGhlIGAncGxhY2VyJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgaXMgb25lIG9mIHRoZSBwcm92aWRlZCBzZXJ2aWNlcyBhaW1lZCBhdCBpZGVudGlmeWluZyBjbGllbnRzIGluc2lkZVxuICogdGhlIGV4cGVyaWVuY2UgYWxvbmcgd2l0aCB0aGUgW2AnbG9jYXRvcidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn1cbiAqIGFuZCBbYCdjaGVja2luJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSBzZXJ2aWNlcy5cbiAqXG4gKiBUaGUgYCdwbGFjZXInYCBzZXJ2aWNlIGFsbG93cyBhIGNsaWVudCB0byBjaG9vc2UgaXRzIHBsYWNlIGFtb25nIGEgc2V0IG9mXG4gKiBwb3NpdGlvbnMgZGVmaW5lZCBpbiB0aGUgc2VydmVyJ3MgYHNldHVwYCBjb25maWd1cmF0aW9uIGVudHJ5LlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5QbGFjZXJ9Kl9fXG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9XG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm1vZGU9J2xpc3QnXSAtIFNldHMgdGhlIGludGVyYWN0aW9uIG1vZGUgZm9yIHRoZVxuICogIGNsaWVudCB0byBjaG9vc2UgaXRzIHBvc2l0aW9uLCB0aGUgYCdsaXN0J2AgbW9kZSBwcm9wb3NlIGEgZHJvcC1kb3duIG1lbnVcbiAqICB3aGlsZSB0aGUgYCdncmFwaGljJ2AgbW9kZSAod2hpY2ggcmVxdWlyZXMgbG9jYXRlZCBwb3NpdGlvbnMpIHByb3Bvc2VzIGFuXG4gKiAgaW50ZXJmYWNlIHJlcHJlc2VudGluZyB0aGUgYXJlYSBhbmQgZG90cyBmb3IgZWFjaCBhdmFpbGFibGUgbG9jYXRpb24uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5wbGFjZXIgPSB0aGlzLnJlcXVpcmUoJ3BsYWNlcicsIHsgbW9kZTogJ2dyYXBoaWMnIH0pO1xuICovXG5jbGFzcyBQbGFjZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgbW9kZTogJ2xpc3QnLFxuICAgICAgdmlldzogbnVsbCxcbiAgICAgIHZpZXdDdG9yOiBudWxsLFxuICAgICAgdmlld1ByaW9yaXR5OiA2LFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSA9IHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25DbGllbnRKb2luZWQgPSB0aGlzLl9vbkNsaWVudEpvaW5lZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQ2xpZW50TGVhdmVkID0gdGhpcy5fb25DbGllbnRMZWF2ZWQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblNlbGVjdCA9IHRoaXMuX29uU2VsZWN0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Db25maXJtUmVzcG9uc2UgPSB0aGlzLl9vbkNvbmZpcm1SZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uUmVqZWN0UmVzcG9uc2UgPSB0aGlzLl9vblJlamVjdFJlc3BvbnNlLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBJbmRleCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIExhYmVsIG9mIHRoZSBwb3NpdGlvbiBzZWxlY3RlZCBieSB0aGUgdXNlci5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgLy8gYWxsb3cgdG8gcGFzcyBhbnkgdmlld1xuICAgIGlmICh0aGlzLm9wdGlvbnMudmlldyAhPT0gbnVsbCkge1xuICAgICAgdGhpcy52aWV3ID0gdGhpcy5vcHRpb25zLnZpZXc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudmlld0N0b3IgIT09IG51bGwpIHtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLm9wdGlvbnMubW9kZSkge1xuICAgICAgICAgIGNhc2UgJ2dyYXBoaWMnOlxuICAgICAgICAgICAgdGhpcy52aWV3Q3RvciA9IF9HcmFwaGljVmlldztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aGlzLnZpZXdDdG9yID0gX0xpc3RWaWV3O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnZpZXdDb250ZW50Lm1vZGUgPSB0aGlzLm9wdGlvbnMubW9kZTtcbiAgICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zaG93KCk7XG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ2Frbm93bGVnZGUnLCB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdjb25maXJtJywgdGhpcy5fb25Db25maXJtUmVzcG9uc2UpO1xuICAgIHRoaXMucmVjZWl2ZSgncmVqZWN0JywgdGhpcy5fb25SZWplY3RSZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdjbGllbnQtam9pbmVkJywgdGhpcy5fb25DbGllbnRKb2luZWQpO1xuICAgIHRoaXMucmVjZWl2ZSgnY2xpZW50LWxlYXZlZCcsIHRoaXMuX29uQ2xpZW50TGVhdmVkKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2Frbm93bGVnZGUnLCB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY29uZmlybScsIHRoaXMuX29uQ29uZmlybVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdyZWplY3QnLCB0aGlzLl9vblJlamVjdFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjbGllbnQtam9pbmVkJywgdGhpcy5fb25DbGllbnRKb2luZWQpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NsaWVudC1sZWF2ZWQnLCB0aGlzLl9vbkNsaWVudExlYXZlZCk7XG5cbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Ba25vd2xlZGdlUmVzcG9uc2Uoc2V0dXBDb25maWdJdGVtLCBkaXNhYmxlZFBvc2l0aW9ucykge1xuICAgIGNvbnN0IHNldHVwID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5nZXQoc2V0dXBDb25maWdJdGVtKTtcbiAgICBjb25zdCBhcmVhID0gc2V0dXAuYXJlYTtcbiAgICBjb25zdCBjYXBhY2l0eSA9IHNldHVwLmNhcGFjaXR5O1xuICAgIGNvbnN0IGxhYmVscyA9IHNldHVwLmxhYmVscztcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzO1xuICAgIGNvbnN0IG1heENsaWVudHNQZXJQb3NpdGlvbiA9IHNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbjtcblxuICAgIGlmIChhcmVhKVxuICAgICAgdGhpcy52aWV3LnNldEFyZWEoYXJlYSk7XG5cbiAgICB0aGlzLnZpZXcuZGlzcGxheVBvc2l0aW9ucyhjYXBhY2l0eSwgbGFiZWxzLCBjb29yZGluYXRlcywgbWF4Q2xpZW50c1BlclBvc2l0aW9uKTtcbiAgICB0aGlzLnZpZXcudXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgIHRoaXMudmlldy5vblNlbGVjdCh0aGlzLl9vblNlbGVjdCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uU2VsZWN0KGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpIHtcbiAgICB0aGlzLnNlbmQoJ3Bvc2l0aW9uJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQ29uZmlybVJlc3BvbnNlKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpIHtcbiAgICBjbGllbnQuaW5kZXggPSB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgY2xpZW50LmxhYmVsID0gdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkNsaWVudEpvaW5lZChkaXNhYmxlZFBvc2l0aW9ucykge1xuICAgIHRoaXMudmlldy51cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhkaXNhYmxlZFBvc2l0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQ2xpZW50TGVhdmVkKGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgdGhpcy52aWV3LnVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZWplY3RSZXNwb25zZShkaXNhYmxlZFBvc2l0aW9ucykge1xuICAgIHRoaXMudmlldy5yZWplY3QoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFBsYWNlcik7XG5cbmV4cG9ydCBkZWZhdWx0IFBsYWNlcjtcbiJdfQ==