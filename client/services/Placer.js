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
 * [client] Allow to select a place within a set of predefined positions (i.e. labels and/or coordinates).
 *
 * @example
 * const placer = soundworks.client.require('place', { capacity: 100 });
 */

var Placer = function (_Service) {
  (0, _inherits3.default)(Placer, _Service);

  function Placer() {
    (0, _classCallCheck3.default)(this, Placer);


    /**
     * @type {Object} defaults - The defaults options of the service.
     * @attribute {String} [options.mode='list'] - Selection mode. Can be:
     * - `'graphic'` to select a place on a graphical representation of the available positions.
     * - `'list'` to select a place among a list of places.
     * @attribute {View} [options.view='null'] - The view of the service to be used (@todo)
     * @attribute {View} [options.view='null'] - The view constructor of the service to be used. Must implement the `PlacerView` interface.
     * @attribute {Number} [options.priority=6] - The priority of the view.
     */

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

    /** @inheritdoc */

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

    /** @inheritdoc */

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
//# sourceMappingURL=data:application/json;base64,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Ozs4QkFpQmhELE9BQU8sT0FBTyxhQUFhO0FBQ25DLFdBQUssSUFBTCxDQUFVLFVBQVYsRUFBc0IsS0FBdEIsRUFBNkIsS0FBN0IsRUFBb0MsV0FBcEMsRUFEbUM7Ozs7Ozs7dUNBS2xCLE9BQU8sT0FBTyxhQUFhO0FBQzVDLHVCQUFPLEtBQVAsR0FBZSxLQUFLLEtBQUwsR0FBYSxLQUFiLENBRDZCO0FBRTVDLHVCQUFPLEtBQVAsR0FBZSxLQUFLLEtBQUwsR0FBYSxLQUFiLENBRjZCO0FBRzVDLHVCQUFPLFdBQVAsR0FBcUIsV0FBckIsQ0FINEM7O0FBSzVDLFdBQUssS0FBTCxHQUw0Qzs7Ozs7OztvQ0FTOUIsbUJBQW1CO0FBQ2pDLFdBQUssSUFBTCxDQUFVLHVCQUFWLENBQWtDLGlCQUFsQyxFQURpQzs7Ozs7OztvQ0FLbkIsbUJBQW1CO0FBQ2pDLFdBQUssSUFBTCxDQUFVLHVCQUFWLENBQWtDLGlCQUFsQyxFQURpQzs7Ozs7OztzQ0FLakIsbUJBQW1CO0FBQ25DLFdBQUssSUFBTCxDQUFVLE1BQVYsQ0FBaUIsaUJBQWpCLEVBRG1DOzs7U0ExSWpDOzs7QUErSU4seUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxNQUFwQzs7a0JBRWUiLCJmaWxlIjoiUGxhY2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuLy8gaW1wb3J0IGxvY2FsU3RvcmFnZSBmcm9tICcuL2xvY2FsU3RvcmFnZSc7XG5pbXBvcnQgU2VsZWN0VmlldyBmcm9tICcuLi92aWV3cy9TZWxlY3RWaWV3JztcbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi4vdmlld3MvU3BhY2VWaWV3JztcbmltcG9ydCBTcXVhcmVkVmlldyBmcm9tICcuLi92aWV3cy9TcXVhcmVkVmlldyc7XG5cbi8vICAvKipcbi8vICAgKiBJbnRlcmZhY2Ugb2YgdGhlIHZpZXcgb2YgdGhlIHBsYWNlci5cbi8vICAgKi9cbi8vICBjbGFzcyBBYnN0YWN0UGxhY2VyVmlldyBleHRlbmRzIHNvdW5kd29ya3MuVmlldyB7XG4vLyAgICAvKipcbi8vICAgICAqIEBwYXJhbSB7TnVtYmVyfSBjYXBhY2l0eSAtIFRoZSBtYXhpbXVtIG51bWJlciBvZiBjbGllbnRzIGFsbG93ZWQuXG4vLyAgICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IFtsYWJlbHM9bnVsbF0gLSBBbiBhcnJheSBvZiB0aGUgbGFiZWxzIGZvciB0aGUgcG9zaXRpb25zXG4vLyAgICAgKiBAcGFyYW0ge0FycmF5PEFycmF5PE51bWJlcj4+fSBbY29vcmRpbmF0ZXM9bnVsbF0gLSBBbiBhcnJheSBvZiB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHBvc2l0aW9uc1xuLy8gICAgICogQHBhcmFtIHtOdW1iZXJ9IFttYXhDbGllbnRzUGVyUG9zaXRpb249MV0gLSBUaGUgbnVtYmVyIG9mIGNsaWVudCBhbGxvd2VkIGZvciBlYWNoIHBvc2l0aW9uLlxuLy8gICAgICovXG4vLyAgICBkaXNwbGF5UG9zaXRpb25zKGNhcGFjaXR5LCBsYWJlbHMgPSBudWxsLCBjb29yZGluYXRlcyA9IG51bGwsIG1heENsaWVudHNQZXJQb3NpdGlvbiA9IDEpIHt9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBAcGFyYW0ge0FycmF5PE51bWJlcj59IGRpc2FibGVkSW5kZXhlcyAtIEFycmF5IG9mIGluZGV4ZXMgb2YgdGhlIGRpc2FibGVkIHBvc2l0aW9ucy5cbi8vICAgICAqL1xuLy8gICAgdXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoZGlzYWJsZWRJbmRleGVzKSB7fVxuLy9cbi8vICAgIC8qKlxuLy8gICAgICogQ2FsbGVkIHdoZW4gbm8gcGxhY2UgbGVmdCBvciB3aGVuIHRoZSBjaG9pY2Ugb2YgdGhlIHVzZXIgYXMgYmVlbiByZWplY3RlZCBieVxuLy8gICAgICogdGhlIHNlcnZlci4gVGhlIHZpZXcgc2hvdWxkIGJlIHNob3VsZCB1cGRhdGUgYWNjb3JkaW5nbHkuXG4vLyAgICAgKiBAcGFyYW0ge0FycmF5PE51bWJlcj59IGRpc2FibGVkSW5kZXhlcyAtIEFycmF5IG9mIGluZGV4ZXMgb2YgdGhlIGRpc2FibGVkIHBvc2l0aW9ucy5cbi8vICAgICAqL1xuLy8gICAgcmVqZWN0KGRpc2FibGVkSW5kZXhlcykge31cbi8vXG4vLyAgICAgLyoqXG4vLyAgICAgKiBSZWdpc3RlciB0aGUgYXJlYSBkZWZpbml0aW9uIHRvIHRoZSB2aWV3LlxuLy8gICAgICogQHBhcmFtIHtPYmplY3R9IGFyZWEgLSBUaGUgZGVmaW5pdGlvbiBvZiB0aGUgYXJlYS5cbi8vICAgICAqL1xuLy8gICAgc2V0QXJlYShhcmVhKSB7XG4vLyAgICAgIHRoaXMuX2FyZWEgPSBhcmVhO1xuLy8gICAgfVxuLy9cbi8vICAgIC8qKlxuLy8gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBiZSBhcHBsaWVkIHdoZW4gYSBwb3NpdGlvbiBpcyBzZWxlY3RlZC5cbi8vICAgICAqL1xuLy8gICAgb25TZWxlY3QoY2FsbGJhY2spIHtcbi8vICAgICAgdGhpcy5fb25TZWxlY3QgPSBjYWxsYmFjaztcbi8vICAgIH1cbi8vICB9XG5cbmNsYXNzIF9MaXN0VmlldyBleHRlbmRzIFNxdWFyZWRWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucykge1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UgPSB0aGlzLl9vblNlbGVjdGlvbkNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgX29uU2VsZWN0aW9uQ2hhbmdlKGUpIHtcbiAgICB0aGlzLmNvbnRlbnQuc2hvd0J0biA9IHRydWU7XG4gICAgdGhpcy5yZW5kZXIoJy5zZWN0aW9uLWZsb2F0Jyk7XG4gICAgdGhpcy5pbnN0YWxsRXZlbnRzKHtcbiAgICAgICdjbGljayAuYnRuJzogKGUpID0+IHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNlbGVjdG9yLnZhbHVlO1xuXG4gICAgICAgIGlmIChwb3NpdGlvbilcbiAgICAgICAgICB0aGlzLl9vblNlbGVjdChwb3NpdGlvbi5pbmRleCwgcG9zaXRpb24ubGFiZWwsIHBvc2l0aW9uLmNvb3JkaW5hdGVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldEFyZWEoYXJlYSkgeyAvKiBubyBuZWVkIGZvciBhcmVhICovIH1cblxuICBkaXNwbGF5UG9zaXRpb25zKGNhcGFjaXR5LCBsYWJlbHMgPSBudWxsLCBjb29yZGluYXRlcyA9IG51bGwsIG1heENsaWVudHNQZXJQb3NpdGlvbiA9IDEpIHtcbiAgICB0aGlzLnBvc2l0aW9ucyA9IFtdO1xuICAgIHRoaXMubnVtYmVyUG9zaXRpb25zID0gY2FwYWNpdHkgLyBtYXhDbGllbnRzUGVyUG9zaXRpb247XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5udW1iZXJQb3NpdGlvbnM7IGluZGV4KyspIHtcbiAgICAgIGNvbnN0IGxhYmVsID0gbGFiZWxzICE9PSBudWxsID8gbGFiZWxzW2luZGV4XSA6IChpbmRleCArIDEpLnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHsgaW5kZXg6IGluZGV4LCBsYWJlbDogbGFiZWwgfTtcblxuICAgICAgaWYgKGNvb3JkaW5hdGVzKVxuICAgICAgICBwb3NpdGlvbi5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzW2luZGV4XTtcblxuICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaChwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3RvciA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGluc3RydWN0aW9uczogdGhpcy5jb250ZW50Lmluc3RydWN0aW9ucyxcbiAgICAgIGVudHJpZXM6IHRoaXMucG9zaXRpb25zLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnLCB0aGlzLnNlbGVjdG9yKTtcbiAgICB0aGlzLnJlbmRlcignLnNlY3Rpb24tc3F1YXJlJyk7XG5cbiAgICB0aGlzLnNlbGVjdG9yLmluc3RhbGxFdmVudHMoe1xuICAgICAgJ2NoYW5nZSc6IHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlLFxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoaW5kZXhlcykge1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm51bWJlclBvc2l0aW9uczsgaW5kZXgrKykge1xuICAgICAgaWYgKGluZGV4ZXMuaW5kZXhPZihpbmRleCkgPT09IC0xKVxuICAgICAgICB0aGlzLnNlbGVjdG9yLmVuYWJsZUluZGV4KGluZGV4KTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5zZWxlY3Rvci5kaXNhYmxlSW5kZXgoaW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIG9uU2VsZWN0KGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fb25TZWxlY3QgPSBjYWxsYmFjaztcbiAgfVxuXG4gIHJlamVjdChkaXNhYmxlZFBvc2l0aW9ucykge1xuICAgIGlmIChkaXNhYmxlZFBvc2l0aW9ucy5sZW5ndGggPj0gdGhpcy5udW1iZXJQb3NpdGlvbnMpIHtcbiAgICAgIHRoaXMuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tc3F1YXJlJyk7XG4gICAgICB0aGlzLmNvbnRlbnQucmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXNhYmxlUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgX0dyYXBoaWNWaWV3IGV4dGVuZHMgU3F1YXJlZFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9hcmVhID0gbnVsbDtcbiAgICB0aGlzLl9kaXNhYmxlZFBvc2l0aW9ucyA9IFtdO1xuICAgIHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlID0gdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIF9vblNlbGVjdGlvbkNoYW5nZShlKSB7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNlbGVjdG9yLnNoYXBlUG9pbnRNYXAuZ2V0KGUudGFyZ2V0KTtcbiAgICBjb25zdCBkaXNhYmxlZEluZGV4ID0gdGhpcy5fZGlzYWJsZWRQb3NpdGlvbnMuaW5kZXhPZihwb3NpdGlvbi5pbmRleCk7XG5cbiAgICBpZiAoZGlzYWJsZWRJbmRleCA9PT0gLTEpXG4gICAgICB0aGlzLl9vblNlbGVjdChwb3NpdGlvbi5pZCwgcG9zaXRpb24ubGFiZWwsIFtwb3NpdGlvbi54LCBwb3NpdGlvbi55XSk7XG4gIH1cblxuICBzZXRBcmVhKGFyZWEpIHtcbiAgICB0aGlzLl9hcmVhID0gYXJlYTtcbiAgfVxuXG4gIGRpc3BsYXlQb3NpdGlvbnMoY2FwYWNpdHksIGxhYmVscyA9IG51bGwsIGNvb3JkaW5hdGVzID0gbnVsbCwgbWF4Q2xpZW50c1BlclBvc2l0aW9uID0gMSkge1xuICAgIHRoaXMubnVtYmVyUG9zaXRpb25zID0gY2FwYWNpdHkgLyBtYXhDbGllbnRzUGVyUG9zaXRpb247XG4gICAgdGhpcy5wb3NpdGlvbnMgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1iZXJQb3NpdGlvbnM7IGkrKykge1xuICAgICAgY29uc3QgbGFiZWwgPSBsYWJlbHMgIT09IG51bGwgPyBsYWJlbHNbaV0gOiAoaSArIDEpLnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHsgaWQ6IGksIGxhYmVsOiBsYWJlbCB9O1xuICAgICAgY29uc3QgY29vcmRzID0gY29vcmRpbmF0ZXNbaV07XG4gICAgICBwb3NpdGlvbi54ID0gY29vcmRzWzBdO1xuICAgICAgcG9zaXRpb24ueSA9IGNvb3Jkc1sxXTtcblxuICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaChwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3RvciA9IG5ldyBTcGFjZVZpZXcoKTtcbiAgICB0aGlzLnNlbGVjdG9yLnNldEFyZWEodGhpcy5fYXJlYSk7XG4gICAgdGhpcy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnLCB0aGlzLnNlbGVjdG9yKTtcbiAgICB0aGlzLnJlbmRlcignLnNlY3Rpb24tc3F1YXJlJyk7XG5cbiAgICB0aGlzLnNlbGVjdG9yLnNldFBvaW50cyh0aGlzLnBvc2l0aW9ucyk7XG5cbiAgICB0aGlzLnNlbGVjdG9yLmluc3RhbGxFdmVudHMoe1xuICAgICAgJ2NsaWNrIC5wb2ludCc6IHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlXG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhpbmRleGVzKSB7XG4gICAgdGhpcy5fZGlzYWJsZWRQb3NpdGlvbnMgPSBpbmRleGVzO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubnVtYmVyUG9zaXRpb25zOyBpbmRleCsrKSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb25zW2luZGV4XTtcbiAgICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBpbmRleGVzLmluZGV4T2YoaW5kZXgpICE9PSAtMTtcbiAgICAgIHBvc2l0aW9uLnNlbGVjdGVkID0gaXNEaXNhYmxlZCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIHRoaXMuc2VsZWN0b3IudXBkYXRlUG9pbnQocG9zaXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIG9uU2VsZWN0KGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fb25TZWxlY3QgPSBjYWxsYmFjaztcbiAgfVxuXG4gIHJlamVjdChkaXNhYmxlZFBvc2l0aW9ucykge1xuICAgIGlmIChkaXNhYmxlZFBvc2l0aW9ucy5sZW5ndGggPj0gdGhpcy5udW1iZXJQb3NpdGlvbnMpIHtcbiAgICAgIHRoaXMuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tc3F1YXJlJyk7XG4gICAgICB0aGlzLmNvbnRlbnQucmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWV3LnVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgICB9XG4gIH1cbn1cblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6cGxhY2VyJztcblxuLyoqXG4gKiBbY2xpZW50XSBBbGxvdyB0byBzZWxlY3QgYSBwbGFjZSB3aXRoaW4gYSBzZXQgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGkuZS4gbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHBsYWNlciA9IHNvdW5kd29ya3MuY2xpZW50LnJlcXVpcmUoJ3BsYWNlJywgeyBjYXBhY2l0eTogMTAwIH0pO1xuICovXG5jbGFzcyBQbGFjZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fSBkZWZhdWx0cyAtIFRoZSBkZWZhdWx0cyBvcHRpb25zIG9mIHRoZSBzZXJ2aWNlLlxuICAgICAqIEBhdHRyaWJ1dGUge1N0cmluZ30gW29wdGlvbnMubW9kZT0nbGlzdCddIC0gU2VsZWN0aW9uIG1vZGUuIENhbiBiZTpcbiAgICAgKiAtIGAnZ3JhcGhpYydgIHRvIHNlbGVjdCBhIHBsYWNlIG9uIGEgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhdmFpbGFibGUgcG9zaXRpb25zLlxuICAgICAqIC0gYCdsaXN0J2AgdG8gc2VsZWN0IGEgcGxhY2UgYW1vbmcgYSBsaXN0IG9mIHBsYWNlcy5cbiAgICAgKiBAYXR0cmlidXRlIHtWaWV3fSBbb3B0aW9ucy52aWV3PSdudWxsJ10gLSBUaGUgdmlldyBvZiB0aGUgc2VydmljZSB0byBiZSB1c2VkIChAdG9kbylcbiAgICAgKiBAYXR0cmlidXRlIHtWaWV3fSBbb3B0aW9ucy52aWV3PSdudWxsJ10gLSBUaGUgdmlldyBjb25zdHJ1Y3RvciBvZiB0aGUgc2VydmljZSB0byBiZSB1c2VkLiBNdXN0IGltcGxlbWVudCB0aGUgYFBsYWNlclZpZXdgIGludGVyZmFjZS5cbiAgICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IFtvcHRpb25zLnByaW9yaXR5PTZdIC0gVGhlIHByaW9yaXR5IG9mIHRoZSB2aWV3LlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgbW9kZTogJ2xpc3QnLFxuICAgICAgdmlldzogbnVsbCxcbiAgICAgIHZpZXdDdG9yOiBudWxsLFxuICAgICAgdmlld1ByaW9yaXR5OiA2LFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSA9IHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25DbGllbnRKb2luZWQgPSB0aGlzLl9vbkNsaWVudEpvaW5lZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQ2xpZW50TGVhdmVkID0gdGhpcy5fb25DbGllbnRMZWF2ZWQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblNlbGVjdCA9IHRoaXMuX29uU2VsZWN0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Db25maXJtUmVzcG9uc2UgPSB0aGlzLl9vbkNvbmZpcm1SZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uUmVqZWN0UmVzcG9uc2UgPSB0aGlzLl9vblJlamVjdFJlc3BvbnNlLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIC8qKlxuICAgICAqIEluZGV4IG9mIHRoZSBwb3NpdGlvbiBzZWxlY3RlZCBieSB0aGUgdXNlci5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaW5kZXggPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTGFiZWwgb2YgdGhlIHBvc2l0aW9uIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5sYWJlbCA9IG51bGw7XG5cbiAgICAvLyBhbGxvdyB0byBwYXNzIGFueSB2aWV3XG4gICAgaWYgKHRoaXMub3B0aW9ucy52aWV3ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnZpZXcgPSB0aGlzLm9wdGlvbnMudmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy52aWV3Q3RvciAhPT0gbnVsbCkge1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzd2l0Y2ggKHRoaXMub3B0aW9ucy5tb2RlKSB7XG4gICAgICAgICAgY2FzZSAnZ3JhcGhpYyc6XG4gICAgICAgICAgICB0aGlzLnZpZXdDdG9yID0gX0dyYXBoaWNWaWV3O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbGlzdCc6XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRoaXMudmlld0N0b3IgPSBfTGlzdFZpZXc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmlld0NvbnRlbnQubW9kZSA9IHRoaXMub3B0aW9ucy5tb2RlO1xuICAgICAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNob3coKTtcbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnYWtub3dsZWdkZScsIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2NvbmZpcm0nLCB0aGlzLl9vbkNvbmZpcm1SZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdyZWplY3QnLCB0aGlzLl9vblJlamVjdFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2NsaWVudC1qb2luZWQnLCB0aGlzLl9vbkNsaWVudEpvaW5lZCk7XG4gICAgdGhpcy5yZWNlaXZlKCdjbGllbnQtbGVhdmVkJywgdGhpcy5fb25DbGllbnRMZWF2ZWQpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignYWtub3dsZWdkZScsIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjb25maXJtJywgdGhpcy5fb25Db25maXJtUmVzcG9uc2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3JlamVjdCcsIHRoaXMuX29uUmVqZWN0UmVzcG9uc2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NsaWVudC1qb2luZWQnLCB0aGlzLl9vbkNsaWVudEpvaW5lZCk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY2xpZW50LWxlYXZlZCcsIHRoaXMuX29uQ2xpZW50TGVhdmVkKTtcblxuICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkFrbm93bGVkZ2VSZXNwb25zZShzZXR1cENvbmZpZ0l0ZW0sIGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgY29uc3Qgc2V0dXAgPSB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlLmdldChzZXR1cENvbmZpZ0l0ZW0pO1xuICAgIGNvbnN0IGFyZWEgPSBzZXR1cC5hcmVhO1xuICAgIGNvbnN0IGNhcGFjaXR5ID0gc2V0dXAuY2FwYWNpdHk7XG4gICAgY29uc3QgbGFiZWxzID0gc2V0dXAubGFiZWxzO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXM7XG4gICAgY29uc3QgbWF4Q2xpZW50c1BlclBvc2l0aW9uID0gc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uO1xuXG4gICAgaWYgKGFyZWEpXG4gICAgICB0aGlzLnZpZXcuc2V0QXJlYShhcmVhKTtcblxuICAgIHRoaXMudmlldy5kaXNwbGF5UG9zaXRpb25zKGNhcGFjaXR5LCBsYWJlbHMsIGNvb3JkaW5hdGVzLCBtYXhDbGllbnRzUGVyUG9zaXRpb24pO1xuICAgIHRoaXMudmlldy51cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgdGhpcy52aWV3Lm9uU2VsZWN0KHRoaXMuX29uU2VsZWN0KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25TZWxlY3QoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykge1xuICAgIHRoaXMuc2VuZCgncG9zaXRpb24nLCBpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Db25maXJtUmVzcG9uc2UoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykge1xuICAgIGNsaWVudC5pbmRleCA9IHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICBjbGllbnQubGFiZWwgPSB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQ2xpZW50Sm9pbmVkKGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgdGhpcy52aWV3LnVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25DbGllbnRMZWF2ZWQoZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICB0aGlzLnZpZXcudXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlamVjdFJlc3BvbnNlKGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgdGhpcy52aWV3LnJlamVjdChkaXNhYmxlZFBvc2l0aW9ucyk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgUGxhY2VyKTtcblxuZXhwb3J0IGRlZmF1bHQgUGxhY2VyO1xuIl19