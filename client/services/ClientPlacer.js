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

var _SelectView = require('../display/SelectView');

var _SelectView2 = _interopRequireDefault(_SelectView);

var _SpaceView = require('../display/SpaceView');

var _SpaceView2 = _interopRequireDefault(_SpaceView);

var _SquaredView3 = require('../display/SquaredView');

var _SquaredView4 = _interopRequireDefault(_SquaredView3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  /**
//   * Interface of the view of the placer.
//   */
//  class AbstactPlacerView extends soundworks.display.View {
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
 * (See also {@link src/server/ServerPlacer.js~ServerPlacer} on the server side.)
 *
 * @example
 * const placer = soundworks.client.require('place', { capacity: 100 });
 */

var ClientPlacer = function (_Service) {
  (0, _inherits3.default)(ClientPlacer, _Service);

  function ClientPlacer() {
    (0, _classCallCheck3.default)(this, ClientPlacer);


    /**
     * @type {Object} defaults - The defaults options of the service.
     * @attribute {String} [options.mode='list'] - Selection mode. Can be:
     * - `'graphic'` to select a place on a graphical representation of the available positions.
     * - `'list'` to select a place among a list of places.
     * @attribute {View} [options.view='null'] - The view of the service to be used (@todo)
     * @attribute {View} [options.view='null'] - The view constructor of the service to be used. Must implement the `PlacerView` interface.
     * @attribute {Number} [options.priority=6] - The priority of the view.
     */

    var _this4 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ClientPlacer).call(this, SERVICE_ID, true));

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

  (0, _createClass3.default)(ClientPlacer, [{
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

          this.content.mode = this.options.mode;
          this.view = this.createView();
        }
      }
    }

    /** @inheritdoc */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientPlacer.prototype), 'start', this).call(this);

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
  return ClientPlacer;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, ClientPlacer);

exports.default = ClientPlacer;
//# sourceMappingURL=data:application/json;base64,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Ozs7Ozs7OzhCQWlCaEQsT0FBTyxPQUFPLGFBQWE7QUFDbkMsV0FBSyxJQUFMLENBQVUsVUFBVixFQUFzQixLQUF0QixFQUE2QixLQUE3QixFQUFvQyxXQUFwQyxFQURtQzs7Ozs7Ozt1Q0FLbEIsT0FBTyxPQUFPLGFBQWE7QUFDNUMsdUJBQU8sS0FBUCxHQUFlLEtBQUssS0FBTCxHQUFhLEtBQWIsQ0FENkI7QUFFNUMsdUJBQU8sS0FBUCxHQUFlLEtBQUssS0FBTCxHQUFhLEtBQWIsQ0FGNkI7QUFHNUMsdUJBQU8sV0FBUCxHQUFxQixXQUFyQixDQUg0Qzs7QUFLNUMsV0FBSyxLQUFMLEdBTDRDOzs7Ozs7O29DQVM5QixtQkFBbUI7QUFDakMsV0FBSyxJQUFMLENBQVUsdUJBQVYsQ0FBa0MsaUJBQWxDLEVBRGlDOzs7Ozs7O29DQUtuQixtQkFBbUI7QUFDakMsV0FBSyxJQUFMLENBQVUsdUJBQVYsQ0FBa0MsaUJBQWxDLEVBRGlDOzs7Ozs7O3NDQUtqQixtQkFBbUI7QUFDbkMsV0FBSyxJQUFMLENBQVUsTUFBVixDQUFpQixpQkFBakIsRUFEbUM7OztTQTFJakM7OztBQStJTix5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLFlBQXBDOztrQkFFZSIsImZpbGUiOiJDbGllbnRQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG4vLyBpbXBvcnQgbG9jYWxTdG9yYWdlIGZyb20gJy4vbG9jYWxTdG9yYWdlJztcbmltcG9ydCBTZWxlY3RWaWV3IGZyb20gJy4uL2Rpc3BsYXkvU2VsZWN0Vmlldyc7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4uL2Rpc3BsYXkvU3BhY2VWaWV3JztcbmltcG9ydCBTcXVhcmVkVmlldyBmcm9tICcuLi9kaXNwbGF5L1NxdWFyZWRWaWV3JztcblxuLy8gIC8qKlxuLy8gICAqIEludGVyZmFjZSBvZiB0aGUgdmlldyBvZiB0aGUgcGxhY2VyLlxuLy8gICAqL1xuLy8gIGNsYXNzIEFic3RhY3RQbGFjZXJWaWV3IGV4dGVuZHMgc291bmR3b3Jrcy5kaXNwbGF5LlZpZXcge1xuLy8gICAgLyoqXG4vLyAgICAgKiBAcGFyYW0ge051bWJlcn0gY2FwYWNpdHkgLSBUaGUgbWF4aW11bSBudW1iZXIgb2YgY2xpZW50cyBhbGxvd2VkLlxuLy8gICAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBbbGFiZWxzPW51bGxdIC0gQW4gYXJyYXkgb2YgdGhlIGxhYmVscyBmb3IgdGhlIHBvc2l0aW9uc1xuLy8gICAgICogQHBhcmFtIHtBcnJheTxBcnJheTxOdW1iZXI+Pn0gW2Nvb3JkaW5hdGVzPW51bGxdIC0gQW4gYXJyYXkgb2YgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBwb3NpdGlvbnNcbi8vICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbbWF4Q2xpZW50c1BlclBvc2l0aW9uPTFdIC0gVGhlIG51bWJlciBvZiBjbGllbnQgYWxsb3dlZCBmb3IgZWFjaCBwb3NpdGlvbi5cbi8vICAgICAqL1xuLy8gICAgZGlzcGxheVBvc2l0aW9ucyhjYXBhY2l0eSwgbGFiZWxzID0gbnVsbCwgY29vcmRpbmF0ZXMgPSBudWxsLCBtYXhDbGllbnRzUGVyUG9zaXRpb24gPSAxKSB7fVxuLy9cbi8vICAgIC8qKlxuLy8gICAgICogQHBhcmFtIHtBcnJheTxOdW1iZXI+fSBkaXNhYmxlZEluZGV4ZXMgLSBBcnJheSBvZiBpbmRleGVzIG9mIHRoZSBkaXNhYmxlZCBwb3NpdGlvbnMuXG4vLyAgICAgKi9cbi8vICAgIHVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGRpc2FibGVkSW5kZXhlcykge31cbi8vXG4vLyAgICAvKipcbi8vICAgICAqIENhbGxlZCB3aGVuIG5vIHBsYWNlIGxlZnQgb3Igd2hlbiB0aGUgY2hvaWNlIG9mIHRoZSB1c2VyIGFzIGJlZW4gcmVqZWN0ZWQgYnlcbi8vICAgICAqIHRoZSBzZXJ2ZXIuIFRoZSB2aWV3IHNob3VsZCBiZSBzaG91bGQgdXBkYXRlIGFjY29yZGluZ2x5LlxuLy8gICAgICogQHBhcmFtIHtBcnJheTxOdW1iZXI+fSBkaXNhYmxlZEluZGV4ZXMgLSBBcnJheSBvZiBpbmRleGVzIG9mIHRoZSBkaXNhYmxlZCBwb3NpdGlvbnMuXG4vLyAgICAgKi9cbi8vICAgIHJlamVjdChkaXNhYmxlZEluZGV4ZXMpIHt9XG4vL1xuLy8gICAgIC8qKlxuLy8gICAgICogUmVnaXN0ZXIgdGhlIGFyZWEgZGVmaW5pdGlvbiB0byB0aGUgdmlldy5cbi8vICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhIC0gVGhlIGRlZmluaXRpb24gb2YgdGhlIGFyZWEuXG4vLyAgICAgKi9cbi8vICAgIHNldEFyZWEoYXJlYSkge1xuLy8gICAgICB0aGlzLl9hcmVhID0gYXJlYTtcbi8vICAgIH1cbi8vXG4vLyAgICAvKipcbi8vICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gYmUgYXBwbGllZCB3aGVuIGEgcG9zaXRpb24gaXMgc2VsZWN0ZWQuXG4vLyAgICAgKi9cbi8vICAgIG9uU2VsZWN0KGNhbGxiYWNrKSB7XG4vLyAgICAgIHRoaXMuX29uU2VsZWN0ID0gY2FsbGJhY2s7XG4vLyAgICB9XG4vLyAgfVxuXG5jbGFzcyBfTGlzdFZpZXcgZXh0ZW5kcyBTcXVhcmVkVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpIHtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlID0gdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIF9vblNlbGVjdGlvbkNoYW5nZShlKSB7XG4gICAgdGhpcy5jb250ZW50LnNob3dCdG4gPSB0cnVlO1xuICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1mbG9hdCcpO1xuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAnY2xpY2sgLmJ0bic6IChlKSA9PiB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5zZWxlY3Rvci52YWx1ZTtcblxuICAgICAgICBpZiAocG9zaXRpb24pXG4gICAgICAgICAgdGhpcy5fb25TZWxlY3QocG9zaXRpb24uaW5kZXgsIHBvc2l0aW9uLmxhYmVsLCBwb3NpdGlvbi5jb29yZGluYXRlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXRBcmVhKGFyZWEpIHsgLyogbm8gbmVlZCBmb3IgYXJlYSAqLyB9XG5cbiAgZGlzcGxheVBvc2l0aW9ucyhjYXBhY2l0eSwgbGFiZWxzID0gbnVsbCwgY29vcmRpbmF0ZXMgPSBudWxsLCBtYXhDbGllbnRzUGVyUG9zaXRpb24gPSAxKSB7XG4gICAgdGhpcy5wb3NpdGlvbnMgPSBbXTtcbiAgICB0aGlzLm51bWJlclBvc2l0aW9ucyA9IGNhcGFjaXR5IC8gbWF4Q2xpZW50c1BlclBvc2l0aW9uO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubnVtYmVyUG9zaXRpb25zOyBpbmRleCsrKSB7XG4gICAgICBjb25zdCBsYWJlbCA9IGxhYmVscyAhPT0gbnVsbCA/IGxhYmVsc1tpbmRleF0gOiAoaW5kZXggKyAxKS50b1N0cmluZygpO1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB7IGluZGV4OiBpbmRleCwgbGFiZWw6IGxhYmVsIH07XG5cbiAgICAgIGlmIChjb29yZGluYXRlcylcbiAgICAgICAgcG9zaXRpb24uY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlc1tpbmRleF07XG5cbiAgICAgIHRoaXMucG9zaXRpb25zLnB1c2gocG9zaXRpb24pO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0b3IgPSBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICBpbnN0cnVjdGlvbnM6IHRoaXMuY29udGVudC5pbnN0cnVjdGlvbnMsXG4gICAgICBlbnRyaWVzOiB0aGlzLnBvc2l0aW9ucyxcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tc3F1YXJlJywgdGhpcy5zZWxlY3Rvcik7XG4gICAgdGhpcy5yZW5kZXIoJy5zZWN0aW9uLXNxdWFyZScpO1xuXG4gICAgdGhpcy5zZWxlY3Rvci5pbnN0YWxsRXZlbnRzKHtcbiAgICAgICdjaGFuZ2UnOiB0aGlzLl9vblNlbGVjdGlvbkNoYW5nZSxcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGluZGV4ZXMpIHtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5udW1iZXJQb3NpdGlvbnM7IGluZGV4KyspIHtcbiAgICAgIGlmIChpbmRleGVzLmluZGV4T2YoaW5kZXgpID09PSAtMSlcbiAgICAgICAgdGhpcy5zZWxlY3Rvci5lbmFibGVJbmRleChpbmRleCk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuc2VsZWN0b3IuZGlzYWJsZUluZGV4KGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBvblNlbGVjdChjYWxsYmFjaykge1xuICAgIHRoaXMuX29uU2VsZWN0ID0gY2FsbGJhY2s7XG4gIH1cblxuICByZWplY3QoZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICBpZiAoZGlzYWJsZWRQb3NpdGlvbnMubGVuZ3RoID49IHRoaXMubnVtYmVyUG9zaXRpb25zKSB7XG4gICAgICB0aGlzLnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScpO1xuICAgICAgdGhpcy5jb250ZW50LnJlamVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGlzYWJsZVBvc2l0aW9ucyhkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIF9HcmFwaGljVmlldyBleHRlbmRzIFNxdWFyZWRWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucykge1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fYXJlYSA9IG51bGw7XG4gICAgdGhpcy5fZGlzYWJsZWRQb3NpdGlvbnMgPSBbXTtcbiAgICB0aGlzLl9vblNlbGVjdGlvbkNoYW5nZSA9IHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBfb25TZWxlY3Rpb25DaGFuZ2UoZSkge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5zZWxlY3Rvci5zaGFwZVBvaW50TWFwLmdldChlLnRhcmdldCk7XG4gICAgY29uc3QgZGlzYWJsZWRJbmRleCA9IHRoaXMuX2Rpc2FibGVkUG9zaXRpb25zLmluZGV4T2YocG9zaXRpb24uaW5kZXgpO1xuXG4gICAgaWYgKGRpc2FibGVkSW5kZXggPT09IC0xKVxuICAgICAgdGhpcy5fb25TZWxlY3QocG9zaXRpb24uaWQsIHBvc2l0aW9uLmxhYmVsLCBbcG9zaXRpb24ueCwgcG9zaXRpb24ueV0pO1xuICB9XG5cbiAgc2V0QXJlYShhcmVhKSB7XG4gICAgdGhpcy5fYXJlYSA9IGFyZWE7XG4gIH1cblxuICBkaXNwbGF5UG9zaXRpb25zKGNhcGFjaXR5LCBsYWJlbHMgPSBudWxsLCBjb29yZGluYXRlcyA9IG51bGwsIG1heENsaWVudHNQZXJQb3NpdGlvbiA9IDEpIHtcbiAgICB0aGlzLm51bWJlclBvc2l0aW9ucyA9IGNhcGFjaXR5IC8gbWF4Q2xpZW50c1BlclBvc2l0aW9uO1xuICAgIHRoaXMucG9zaXRpb25zID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtYmVyUG9zaXRpb25zOyBpKyspIHtcbiAgICAgIGNvbnN0IGxhYmVsID0gbGFiZWxzICE9PSBudWxsID8gbGFiZWxzW2ldIDogKGkgKyAxKS50b1N0cmluZygpO1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB7IGlkOiBpLCBsYWJlbDogbGFiZWwgfTtcbiAgICAgIGNvbnN0IGNvb3JkcyA9IGNvb3JkaW5hdGVzW2ldO1xuICAgICAgcG9zaXRpb24ueCA9IGNvb3Jkc1swXTtcbiAgICAgIHBvc2l0aW9uLnkgPSBjb29yZHNbMV07XG5cbiAgICAgIHRoaXMucG9zaXRpb25zLnB1c2gocG9zaXRpb24pO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0b3IgPSBuZXcgU3BhY2VWaWV3KCk7XG4gICAgdGhpcy5zZWxlY3Rvci5zZXRBcmVhKHRoaXMuX2FyZWEpO1xuICAgIHRoaXMuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tc3F1YXJlJywgdGhpcy5zZWxlY3Rvcik7XG4gICAgdGhpcy5yZW5kZXIoJy5zZWN0aW9uLXNxdWFyZScpO1xuXG4gICAgdGhpcy5zZWxlY3Rvci5zZXRQb2ludHModGhpcy5wb3NpdGlvbnMpO1xuXG4gICAgdGhpcy5zZWxlY3Rvci5pbnN0YWxsRXZlbnRzKHtcbiAgICAgICdjbGljayAucG9pbnQnOiB0aGlzLl9vblNlbGVjdGlvbkNoYW5nZVxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoaW5kZXhlcykge1xuICAgIHRoaXMuX2Rpc2FibGVkUG9zaXRpb25zID0gaW5kZXhlcztcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm51bWJlclBvc2l0aW9uczsgaW5kZXgrKykge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uc1tpbmRleF07XG4gICAgICBjb25zdCBpc0Rpc2FibGVkID0gaW5kZXhlcy5pbmRleE9mKGluZGV4KSAhPT0gLTE7XG4gICAgICBwb3NpdGlvbi5zZWxlY3RlZCA9IGlzRGlzYWJsZWQgPyB0cnVlIDogZmFsc2U7XG4gICAgICB0aGlzLnNlbGVjdG9yLnVwZGF0ZVBvaW50KHBvc2l0aW9uKTtcbiAgICB9XG4gIH1cblxuICBvblNlbGVjdChjYWxsYmFjaykge1xuICAgIHRoaXMuX29uU2VsZWN0ID0gY2FsbGJhY2s7XG4gIH1cblxuICByZWplY3QoZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICBpZiAoZGlzYWJsZWRQb3NpdGlvbnMubGVuZ3RoID49IHRoaXMubnVtYmVyUG9zaXRpb25zKSB7XG4gICAgICB0aGlzLnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScpO1xuICAgICAgdGhpcy5jb250ZW50LnJlamVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlldy51cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgfVxuICB9XG59XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnBsYWNlcic7XG5cbi8qKlxuICogW2NsaWVudF0gQWxsb3cgdG8gc2VsZWN0IGEgcGxhY2Ugd2l0aGluIGEgc2V0IG9mIHByZWRlZmluZWQgcG9zaXRpb25zIChpLmUuIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJQbGFjZXIuanN+U2VydmVyUGxhY2VyfSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBwbGFjZXIgPSBzb3VuZHdvcmtzLmNsaWVudC5yZXF1aXJlKCdwbGFjZScsIHsgY2FwYWNpdHk6IDEwMCB9KTtcbiAqL1xuY2xhc3MgQ2xpZW50UGxhY2VyIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH0gZGVmYXVsdHMgLSBUaGUgZGVmYXVsdHMgb3B0aW9ucyBvZiB0aGUgc2VydmljZS5cbiAgICAgKiBAYXR0cmlidXRlIHtTdHJpbmd9IFtvcHRpb25zLm1vZGU9J2xpc3QnXSAtIFNlbGVjdGlvbiBtb2RlLiBDYW4gYmU6XG4gICAgICogLSBgJ2dyYXBoaWMnYCB0byBzZWxlY3QgYSBwbGFjZSBvbiBhIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYXZhaWxhYmxlIHBvc2l0aW9ucy5cbiAgICAgKiAtIGAnbGlzdCdgIHRvIHNlbGVjdCBhIHBsYWNlIGFtb25nIGEgbGlzdCBvZiBwbGFjZXMuXG4gICAgICogQGF0dHJpYnV0ZSB7Vmlld30gW29wdGlvbnMudmlldz0nbnVsbCddIC0gVGhlIHZpZXcgb2YgdGhlIHNlcnZpY2UgdG8gYmUgdXNlZCAoQHRvZG8pXG4gICAgICogQGF0dHJpYnV0ZSB7Vmlld30gW29wdGlvbnMudmlldz0nbnVsbCddIC0gVGhlIHZpZXcgY29uc3RydWN0b3Igb2YgdGhlIHNlcnZpY2UgdG8gYmUgdXNlZC4gTXVzdCBpbXBsZW1lbnQgdGhlIGBQbGFjZXJWaWV3YCBpbnRlcmZhY2UuXG4gICAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBbb3B0aW9ucy5wcmlvcml0eT02XSAtIFRoZSBwcmlvcml0eSBvZiB0aGUgdmlldy5cbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG1vZGU6ICdsaXN0JyxcbiAgICAgIHZpZXc6IG51bGwsXG4gICAgICB2aWV3Q3RvcjogbnVsbCxcbiAgICAgIHZpZXdQcmlvcml0eTogNixcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UgPSB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQ2xpZW50Sm9pbmVkID0gdGhpcy5fb25DbGllbnRKb2luZWQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNsaWVudExlYXZlZCA9IHRoaXMuX29uQ2xpZW50TGVhdmVkLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25TZWxlY3QgPSB0aGlzLl9vblNlbGVjdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQ29uZmlybVJlc3BvbnNlID0gdGhpcy5fb25Db25maXJtUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblJlamVjdFJlc3BvbnNlID0gdGhpcy5fb25SZWplY3RSZXNwb25zZS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZSA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBJbmRleCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIExhYmVsIG9mIHRoZSBwb3NpdGlvbiBzZWxlY3RlZCBieSB0aGUgdXNlci5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgLy8gYWxsb3cgdG8gcGFzcyBhbnkgdmlld1xuICAgIGlmICh0aGlzLm9wdGlvbnMudmlldyAhPT0gbnVsbCkge1xuICAgICAgdGhpcy52aWV3ID0gdGhpcy5vcHRpb25zLnZpZXc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudmlld0N0b3IgIT09IG51bGwpIHtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLm9wdGlvbnMubW9kZSkge1xuICAgICAgICAgIGNhc2UgJ2dyYXBoaWMnOlxuICAgICAgICAgICAgdGhpcy52aWV3Q3RvciA9IF9HcmFwaGljVmlldztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aGlzLnZpZXdDdG9yID0gX0xpc3RWaWV3O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRlbnQubW9kZSA9IHRoaXMub3B0aW9ucy5tb2RlO1xuICAgICAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNob3coKTtcbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnYWtub3dsZWdkZScsIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2NvbmZpcm0nLCB0aGlzLl9vbkNvbmZpcm1SZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdyZWplY3QnLCB0aGlzLl9vblJlamVjdFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2NsaWVudC1qb2luZWQnLCB0aGlzLl9vbkNsaWVudEpvaW5lZCk7XG4gICAgdGhpcy5yZWNlaXZlKCdjbGllbnQtbGVhdmVkJywgdGhpcy5fb25DbGllbnRMZWF2ZWQpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignYWtub3dsZWdkZScsIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjb25maXJtJywgdGhpcy5fb25Db25maXJtUmVzcG9uc2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3JlamVjdCcsIHRoaXMuX29uUmVqZWN0UmVzcG9uc2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NsaWVudC1qb2luZWQnLCB0aGlzLl9vbkNsaWVudEpvaW5lZCk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY2xpZW50LWxlYXZlZCcsIHRoaXMuX29uQ2xpZW50TGVhdmVkKTtcblxuICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkFrbm93bGVkZ2VSZXNwb25zZShzZXR1cENvbmZpZ0l0ZW0sIGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgY29uc3Qgc2V0dXAgPSB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlLmdldChzZXR1cENvbmZpZ0l0ZW0pO1xuICAgIGNvbnN0IGFyZWEgPSBzZXR1cC5hcmVhO1xuICAgIGNvbnN0IGNhcGFjaXR5ID0gc2V0dXAuY2FwYWNpdHk7XG4gICAgY29uc3QgbGFiZWxzID0gc2V0dXAubGFiZWxzO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXM7XG4gICAgY29uc3QgbWF4Q2xpZW50c1BlclBvc2l0aW9uID0gc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uO1xuXG4gICAgaWYgKGFyZWEpXG4gICAgICB0aGlzLnZpZXcuc2V0QXJlYShhcmVhKTtcblxuICAgIHRoaXMudmlldy5kaXNwbGF5UG9zaXRpb25zKGNhcGFjaXR5LCBsYWJlbHMsIGNvb3JkaW5hdGVzLCBtYXhDbGllbnRzUGVyUG9zaXRpb24pO1xuICAgIHRoaXMudmlldy51cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgdGhpcy52aWV3Lm9uU2VsZWN0KHRoaXMuX29uU2VsZWN0KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25TZWxlY3QoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykge1xuICAgIHRoaXMuc2VuZCgncG9zaXRpb24nLCBpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Db25maXJtUmVzcG9uc2UoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykge1xuICAgIGNsaWVudC5pbmRleCA9IHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICBjbGllbnQubGFiZWwgPSB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQ2xpZW50Sm9pbmVkKGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgdGhpcy52aWV3LnVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25DbGllbnRMZWF2ZWQoZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICB0aGlzLnZpZXcudXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlamVjdFJlc3BvbnNlKGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgdGhpcy52aWV3LnJlamVjdChkaXNhYmxlZFBvc2l0aW9ucyk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2xpZW50UGxhY2VyKTtcblxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50UGxhY2VyO1xuIl19