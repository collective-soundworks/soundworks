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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYWNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEwQ007OztBQUNKLFdBREksU0FDSixDQUFZLFFBQVosRUFBc0IsT0FBdEIsRUFBK0IsTUFBL0IsRUFBdUMsT0FBdkMsRUFBZ0Q7d0NBRDVDLFdBQzRDOzs2RkFENUMsc0JBRUksVUFBVSxTQUFTLFFBQVEsVUFEYTs7QUFHOUMsVUFBSyxrQkFBTCxHQUEwQixNQUFLLGtCQUFMLENBQXdCLElBQXhCLE9BQTFCLENBSDhDOztHQUFoRDs7NkJBREk7O3VDQU9lLEdBQUc7OztBQUNwQixXQUFLLE9BQUwsQ0FBYSxPQUFiLEdBQXVCLElBQXZCLENBRG9CO0FBRXBCLFdBQUssTUFBTCxDQUFZLGdCQUFaLEVBRm9CO0FBR3BCLFdBQUssYUFBTCxDQUFtQjtBQUNqQixzQkFBYyxrQkFBQyxDQUFELEVBQU87QUFDbkIsY0FBTSxXQUFXLE9BQUssUUFBTCxDQUFjLEtBQWQsQ0FERTs7QUFHbkIsY0FBSSxRQUFKLEVBQ0UsT0FBSyxTQUFMLENBQWUsU0FBUyxLQUFULEVBQWdCLFNBQVMsS0FBVCxFQUFnQixTQUFTLFdBQVQsQ0FBL0MsQ0FERjtTQUhZO09BRGhCLEVBSG9COzs7OzRCQWFkLE1BQU07OztxQ0FFRyxVQUF3RTtVQUE5RCwrREFBUyxvQkFBcUQ7VUFBL0Msb0VBQWMsb0JBQWlDO1VBQTNCLDhFQUF3QixpQkFBRzs7QUFDdkYsV0FBSyxTQUFMLEdBQWlCLEVBQWpCLENBRHVGO0FBRXZGLFdBQUssZUFBTCxHQUF1QixXQUFXLHFCQUFYLENBRmdFOztBQUl2RixXQUFLLElBQUksUUFBUSxDQUFSLEVBQVcsUUFBUSxLQUFLLGVBQUwsRUFBc0IsT0FBbEQsRUFBMkQ7QUFDekQsWUFBTSxRQUFRLFdBQVcsSUFBWCxHQUFrQixPQUFPLEtBQVAsQ0FBbEIsR0FBa0MsQ0FBQyxRQUFRLENBQVIsQ0FBRCxDQUFZLFFBQVosRUFBbEMsQ0FEMkM7QUFFekQsWUFBTSxXQUFXLEVBQUUsT0FBTyxLQUFQLEVBQWMsT0FBTyxLQUFQLEVBQTNCLENBRm1EOztBQUl6RCxZQUFJLFdBQUosRUFDRSxTQUFTLFdBQVQsR0FBdUIsWUFBWSxLQUFaLENBQXZCLENBREY7O0FBR0EsYUFBSyxTQUFMLENBQWUsSUFBZixDQUFvQixRQUFwQixFQVB5RDtPQUEzRDs7QUFVQSxXQUFLLFFBQUwsR0FBZ0IseUJBQWU7QUFDN0Isc0JBQWMsS0FBSyxPQUFMLENBQWEsWUFBYjtBQUNkLGlCQUFTLEtBQUssU0FBTDtPQUZLLENBQWhCLENBZHVGOztBQW1CdkYsV0FBSyxnQkFBTCxDQUFzQixpQkFBdEIsRUFBeUMsS0FBSyxRQUFMLENBQXpDLENBbkJ1RjtBQW9CdkYsV0FBSyxNQUFMLENBQVksaUJBQVosRUFwQnVGOztBQXNCdkYsV0FBSyxRQUFMLENBQWMsYUFBZCxDQUE0QjtBQUMxQixrQkFBVSxLQUFLLGtCQUFMO09BRFosRUF0QnVGOzs7OzRDQTJCakUsU0FBUztBQUMvQixXQUFLLElBQUksUUFBUSxDQUFSLEVBQVcsUUFBUSxLQUFLLGVBQUwsRUFBc0IsT0FBbEQsRUFBMkQ7QUFDekQsWUFBSSxRQUFRLE9BQVIsQ0FBZ0IsS0FBaEIsTUFBMkIsQ0FBQyxDQUFELEVBQzdCLEtBQUssUUFBTCxDQUFjLFdBQWQsQ0FBMEIsS0FBMUIsRUFERixLQUdFLEtBQUssUUFBTCxDQUFjLFlBQWQsQ0FBMkIsS0FBM0IsRUFIRjtPQURGOzs7OzZCQVFPLFVBQVU7QUFDakIsV0FBSyxTQUFMLEdBQWlCLFFBQWpCLENBRGlCOzs7OzJCQUlaLG1CQUFtQjtBQUN4QixVQUFJLGtCQUFrQixNQUFsQixJQUE0QixLQUFLLGVBQUwsRUFBc0I7QUFDcEQsYUFBSyxnQkFBTCxDQUFzQixpQkFBdEIsRUFEb0Q7QUFFcEQsYUFBSyxPQUFMLENBQWEsUUFBYixHQUF3QixJQUF4QixDQUZvRDtBQUdwRCxhQUFLLE1BQUwsR0FIb0Q7T0FBdEQsTUFJTztBQUNMLGFBQUssZ0JBQUwsQ0FBc0IsaUJBQXRCLEVBREs7T0FKUDs7O1NBL0RFOzs7OztJQXlFQTs7O0FBQ0osV0FESSxZQUNKLENBQVksUUFBWixFQUFzQixPQUF0QixFQUErQixNQUEvQixFQUF1QyxPQUF2QyxFQUFnRDt3Q0FENUMsY0FDNEM7OzhGQUQ1Qyx5QkFFSSxVQUFVLFNBQVMsUUFBUSxVQURhOztBQUc5QyxXQUFLLEtBQUwsR0FBYSxJQUFiLENBSDhDO0FBSTlDLFdBQUssa0JBQUwsR0FBMEIsRUFBMUIsQ0FKOEM7QUFLOUMsV0FBSyxrQkFBTCxHQUEwQixPQUFLLGtCQUFMLENBQXdCLElBQXhCLFFBQTFCLENBTDhDOztHQUFoRDs7NkJBREk7O3VDQVNlLEdBQUc7QUFDcEIsVUFBTSxXQUFXLEtBQUssUUFBTCxDQUFjLGFBQWQsQ0FBNEIsR0FBNUIsQ0FBZ0MsRUFBRSxNQUFGLENBQTNDLENBRGM7QUFFcEIsVUFBTSxnQkFBZ0IsS0FBSyxrQkFBTCxDQUF3QixPQUF4QixDQUFnQyxTQUFTLEtBQVQsQ0FBaEQsQ0FGYzs7QUFJcEIsVUFBSSxrQkFBa0IsQ0FBQyxDQUFELEVBQ3BCLEtBQUssU0FBTCxDQUFlLFNBQVMsRUFBVCxFQUFhLFNBQVMsS0FBVCxFQUFnQixDQUFDLFNBQVMsQ0FBVCxFQUFZLFNBQVMsQ0FBVCxDQUF6RCxFQURGOzs7OzRCQUlNLE1BQU07QUFDWixXQUFLLEtBQUwsR0FBYSxJQUFiLENBRFk7Ozs7cUNBSUcsVUFBd0U7VUFBOUQsK0RBQVMsb0JBQXFEO1VBQS9DLG9FQUFjLG9CQUFpQztVQUEzQiw4RUFBd0IsaUJBQUc7O0FBQ3ZGLFdBQUssZUFBTCxHQUF1QixXQUFXLHFCQUFYLENBRGdFO0FBRXZGLFdBQUssU0FBTCxHQUFpQixFQUFqQixDQUZ1Rjs7QUFJdkYsV0FBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksS0FBSyxlQUFMLEVBQXNCLEdBQTFDLEVBQStDO0FBQzdDLFlBQU0sUUFBUSxXQUFXLElBQVgsR0FBa0IsT0FBTyxDQUFQLENBQWxCLEdBQThCLENBQUMsSUFBSSxDQUFKLENBQUQsQ0FBUSxRQUFSLEVBQTlCLENBRCtCO0FBRTdDLFlBQU0sV0FBVyxFQUFFLElBQUksQ0FBSixFQUFPLE9BQU8sS0FBUCxFQUFwQixDQUZ1QztBQUc3QyxZQUFNLFNBQVMsWUFBWSxDQUFaLENBQVQsQ0FIdUM7QUFJN0MsaUJBQVMsQ0FBVCxHQUFhLE9BQU8sQ0FBUCxDQUFiLENBSjZDO0FBSzdDLGlCQUFTLENBQVQsR0FBYSxPQUFPLENBQVAsQ0FBYixDQUw2Qzs7QUFPN0MsYUFBSyxTQUFMLENBQWUsSUFBZixDQUFvQixRQUFwQixFQVA2QztPQUEvQzs7QUFVQSxXQUFLLFFBQUwsR0FBZ0IseUJBQWhCLENBZHVGO0FBZXZGLFdBQUssUUFBTCxDQUFjLE9BQWQsQ0FBc0IsS0FBSyxLQUFMLENBQXRCLENBZnVGO0FBZ0J2RixXQUFLLGdCQUFMLENBQXNCLGlCQUF0QixFQUF5QyxLQUFLLFFBQUwsQ0FBekMsQ0FoQnVGO0FBaUJ2RixXQUFLLE1BQUwsQ0FBWSxpQkFBWixFQWpCdUY7O0FBbUJ2RixXQUFLLFFBQUwsQ0FBYyxTQUFkLENBQXdCLEtBQUssU0FBTCxDQUF4QixDQW5CdUY7O0FBcUJ2RixXQUFLLFFBQUwsQ0FBYyxhQUFkLENBQTRCO0FBQzFCLHdCQUFnQixLQUFLLGtCQUFMO09BRGxCLEVBckJ1Rjs7Ozs0Q0EwQmpFLFNBQVM7QUFDL0IsV0FBSyxrQkFBTCxHQUEwQixPQUExQixDQUQrQjs7QUFHL0IsV0FBSyxJQUFJLFFBQVEsQ0FBUixFQUFXLFFBQVEsS0FBSyxlQUFMLEVBQXNCLE9BQWxELEVBQTJEO0FBQ3pELFlBQU0sV0FBVyxLQUFLLFNBQUwsQ0FBZSxLQUFmLENBQVgsQ0FEbUQ7QUFFekQsWUFBTSxhQUFhLFFBQVEsT0FBUixDQUFnQixLQUFoQixNQUEyQixDQUFDLENBQUQsQ0FGVztBQUd6RCxpQkFBUyxRQUFULEdBQW9CLGFBQWEsSUFBYixHQUFvQixLQUFwQixDQUhxQztBQUl6RCxhQUFLLFFBQUwsQ0FBYyxXQUFkLENBQTBCLFFBQTFCLEVBSnlEO09BQTNEOzs7OzZCQVFPLFVBQVU7QUFDakIsV0FBSyxTQUFMLEdBQWlCLFFBQWpCLENBRGlCOzs7OzJCQUlaLG1CQUFtQjtBQUN4QixVQUFJLGtCQUFrQixNQUFsQixJQUE0QixLQUFLLGVBQUwsRUFBc0I7QUFDcEQsYUFBSyxnQkFBTCxDQUFzQixpQkFBdEIsRUFEb0Q7QUFFcEQsYUFBSyxPQUFMLENBQWEsUUFBYixHQUF3QixJQUF4QixDQUZvRDtBQUdwRCxhQUFLLE1BQUwsR0FIb0Q7T0FBdEQsTUFJTztBQUNMLGFBQUssSUFBTCxDQUFVLHVCQUFWLENBQWtDLGlCQUFsQyxFQURLO09BSlA7OztTQS9ERTs7O0FBMEVOLElBQU0sYUFBYSxnQkFBYjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE0QkE7Ozs7O0FBRUosV0FGSSxNQUVKLEdBQWM7d0NBRlYsUUFFVTs7OEZBRlYsbUJBR0ksWUFBWSxPQUROOztBQUdaLFFBQU0sV0FBVztBQUNmLFlBQU0sTUFBTjtBQUNBLFlBQU0sSUFBTjtBQUNBLGdCQUFVLElBQVY7QUFDQSxvQkFBYyxDQUFkO0tBSkksQ0FITTs7QUFVWixXQUFLLFNBQUwsQ0FBZSxRQUFmLEVBVlk7O0FBWVosV0FBSyxxQkFBTCxHQUE2QixPQUFLLHFCQUFMLENBQTJCLElBQTNCLFFBQTdCLENBWlk7QUFhWixXQUFLLGVBQUwsR0FBdUIsT0FBSyxlQUFMLENBQXFCLElBQXJCLFFBQXZCLENBYlk7QUFjWixXQUFLLGVBQUwsR0FBdUIsT0FBSyxlQUFMLENBQXFCLElBQXJCLFFBQXZCLENBZFk7QUFlWixXQUFLLFNBQUwsR0FBaUIsT0FBSyxTQUFMLENBQWUsSUFBZixRQUFqQixDQWZZO0FBZ0JaLFdBQUssa0JBQUwsR0FBMEIsT0FBSyxrQkFBTCxDQUF3QixJQUF4QixRQUExQixDQWhCWTtBQWlCWixXQUFLLGlCQUFMLEdBQXlCLE9BQUssaUJBQUwsQ0FBdUIsSUFBdkIsUUFBekIsQ0FqQlk7O0FBbUJaLFdBQUssb0JBQUwsR0FBNEIsT0FBSyxPQUFMLENBQWEsZUFBYixDQUE1QixDQW5CWTs7R0FBZDs7Ozs7NkJBRkk7OzJCQXlCRzs7Ozs7QUFLTCxXQUFLLEtBQUwsR0FBYSxJQUFiOzs7Ozs7QUFMSyxVQVdMLENBQUssS0FBTCxHQUFhLElBQWI7OztBQVhLLFVBY0QsS0FBSyxPQUFMLENBQWEsSUFBYixLQUFzQixJQUF0QixFQUE0QjtBQUM5QixhQUFLLElBQUwsR0FBWSxLQUFLLE9BQUwsQ0FBYSxJQUFiLENBRGtCO09BQWhDLE1BRU87QUFDTCxZQUFJLEtBQUssT0FBTCxDQUFhLFFBQWIsS0FBMEIsSUFBMUIsRUFBZ0MsRUFBcEMsTUFFTztBQUNMLGtCQUFRLEtBQUssT0FBTCxDQUFhLElBQWI7QUFDTixpQkFBSyxTQUFMO0FBQ0UsbUJBQUssUUFBTCxHQUFnQixZQUFoQixDQURGO0FBRUUsb0JBRkY7QUFERixpQkFJTyxNQUFMLENBSkY7QUFLRTtBQUNFLG1CQUFLLFFBQUwsR0FBZ0IsU0FBaEIsQ0FERjtBQUVFLG9CQUZGO0FBTEYsV0FESzs7QUFXTCxlQUFLLFdBQUwsQ0FBaUIsSUFBakIsR0FBd0IsS0FBSyxPQUFMLENBQWEsSUFBYixDQVhuQjtBQVlMLGVBQUssSUFBTCxHQUFZLEtBQUssVUFBTCxFQUFaLENBWks7U0FGUDtPQUhGOzs7Ozs7OzRCQXVCTTtBQUNOLHVEQS9ERSw0Q0ErREYsQ0FETTs7QUFHTixVQUFJLENBQUMsS0FBSyxVQUFMLEVBQ0gsS0FBSyxJQUFMLEdBREY7O0FBR0EsV0FBSyxJQUFMLEdBTk07QUFPTixXQUFLLElBQUwsQ0FBVSxTQUFWLEVBUE07O0FBU04sV0FBSyxPQUFMLENBQWEsWUFBYixFQUEyQixLQUFLLHFCQUFMLENBQTNCLENBVE07QUFVTixXQUFLLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLEtBQUssa0JBQUwsQ0FBeEIsQ0FWTTtBQVdOLFdBQUssT0FBTCxDQUFhLFFBQWIsRUFBdUIsS0FBSyxpQkFBTCxDQUF2QixDQVhNO0FBWU4sV0FBSyxPQUFMLENBQWEsZUFBYixFQUE4QixLQUFLLGVBQUwsQ0FBOUIsQ0FaTTtBQWFOLFdBQUssT0FBTCxDQUFhLGVBQWIsRUFBOEIsS0FBSyxlQUFMLENBQTlCLENBYk07Ozs7Ozs7MkJBaUJEO0FBQ0wsV0FBSyxjQUFMLENBQW9CLFlBQXBCLEVBQWtDLEtBQUsscUJBQUwsQ0FBbEMsQ0FESztBQUVMLFdBQUssY0FBTCxDQUFvQixTQUFwQixFQUErQixLQUFLLGtCQUFMLENBQS9CLENBRks7QUFHTCxXQUFLLGNBQUwsQ0FBb0IsUUFBcEIsRUFBOEIsS0FBSyxpQkFBTCxDQUE5QixDQUhLO0FBSUwsV0FBSyxjQUFMLENBQW9CLGVBQXBCLEVBQXFDLEtBQUssZUFBTCxDQUFyQyxDQUpLO0FBS0wsV0FBSyxjQUFMLENBQW9CLGVBQXBCLEVBQXFDLEtBQUssZUFBTCxDQUFyQyxDQUxLOztBQU9MLFdBQUssSUFBTCxHQVBLOzs7Ozs7OzBDQVdlLGlCQUFpQixtQkFBbUI7QUFDeEQsVUFBTSxRQUFRLEtBQUssb0JBQUwsQ0FBMEIsR0FBMUIsQ0FBOEIsZUFBOUIsQ0FBUixDQURrRDtBQUV4RCxVQUFNLE9BQU8sTUFBTSxJQUFOLENBRjJDO0FBR3hELFVBQU0sV0FBVyxNQUFNLFFBQU4sQ0FIdUM7QUFJeEQsVUFBTSxTQUFTLE1BQU0sTUFBTixDQUp5QztBQUt4RCxVQUFNLGNBQWMsTUFBTSxXQUFOLENBTG9DO0FBTXhELFVBQU0sd0JBQXdCLE1BQU0scUJBQU4sQ0FOMEI7O0FBUXhELFVBQUksSUFBSixFQUNFLEtBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsSUFBbEIsRUFERjs7QUFHQSxXQUFLLElBQUwsQ0FBVSxnQkFBVixDQUEyQixRQUEzQixFQUFxQyxNQUFyQyxFQUE2QyxXQUE3QyxFQUEwRCxxQkFBMUQsRUFYd0Q7QUFZeEQsV0FBSyxJQUFMLENBQVUsdUJBQVYsQ0FBa0MsaUJBQWxDLEVBWndEO0FBYXhELFdBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsS0FBSyxTQUFMLENBQW5CLENBYndEOzs7Ozs7OzhCQWlCaEQsT0FBTyxPQUFPLGFBQWE7QUFDbkMsV0FBSyxJQUFMLENBQVUsVUFBVixFQUFzQixLQUF0QixFQUE2QixLQUE3QixFQUFvQyxXQUFwQyxFQURtQzs7Ozs7Ozt1Q0FLbEIsT0FBTyxPQUFPLGFBQWE7QUFDNUMsdUJBQU8sS0FBUCxHQUFlLEtBQUssS0FBTCxHQUFhLEtBQWIsQ0FENkI7QUFFNUMsdUJBQU8sS0FBUCxHQUFlLEtBQUssS0FBTCxHQUFhLEtBQWIsQ0FGNkI7QUFHNUMsdUJBQU8sV0FBUCxHQUFxQixXQUFyQixDQUg0Qzs7QUFLNUMsV0FBSyxLQUFMLEdBTDRDOzs7Ozs7O29DQVM5QixtQkFBbUI7QUFDakMsV0FBSyxJQUFMLENBQVUsdUJBQVYsQ0FBa0MsaUJBQWxDLEVBRGlDOzs7Ozs7O29DQUtuQixtQkFBbUI7QUFDakMsV0FBSyxJQUFMLENBQVUsdUJBQVYsQ0FBa0MsaUJBQWxDLEVBRGlDOzs7Ozs7O3NDQUtqQixtQkFBbUI7QUFDbkMsV0FBSyxJQUFMLENBQVUsTUFBVixDQUFpQixpQkFBakIsRUFEbUM7OztTQW5JakM7OztBQXdJTix5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLE1BQXBDOztrQkFFZSIsImZpbGUiOiJQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG4vLyBpbXBvcnQgbG9jYWxTdG9yYWdlIGZyb20gJy4vbG9jYWxTdG9yYWdlJztcbmltcG9ydCBTZWxlY3RWaWV3IGZyb20gJy4uL3ZpZXdzL1NlbGVjdFZpZXcnO1xuaW1wb3J0IFNwYWNlVmlldyBmcm9tICcuLi92aWV3cy9TcGFjZVZpZXcnO1xuaW1wb3J0IFNxdWFyZWRWaWV3IGZyb20gJy4uL3ZpZXdzL1NxdWFyZWRWaWV3JztcblxuLy8gIC8qKlxuLy8gICAqIEludGVyZmFjZSBvZiB0aGUgdmlldyBvZiB0aGUgcGxhY2VyLlxuLy8gICAqL1xuLy8gIGNsYXNzIEFic3RhY3RQbGFjZXJWaWV3IGV4dGVuZHMgc291bmR3b3Jrcy5WaWV3IHtcbi8vICAgIC8qKlxuLy8gICAgICogQHBhcmFtIHtOdW1iZXJ9IGNhcGFjaXR5IC0gVGhlIG1heGltdW0gbnVtYmVyIG9mIGNsaWVudHMgYWxsb3dlZC5cbi8vICAgICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gW2xhYmVscz1udWxsXSAtIEFuIGFycmF5IG9mIHRoZSBsYWJlbHMgZm9yIHRoZSBwb3NpdGlvbnNcbi8vICAgICAqIEBwYXJhbSB7QXJyYXk8QXJyYXk8TnVtYmVyPj59IFtjb29yZGluYXRlcz1udWxsXSAtIEFuIGFycmF5IG9mIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgcG9zaXRpb25zXG4vLyAgICAgKiBAcGFyYW0ge051bWJlcn0gW21heENsaWVudHNQZXJQb3NpdGlvbj0xXSAtIFRoZSBudW1iZXIgb2YgY2xpZW50IGFsbG93ZWQgZm9yIGVhY2ggcG9zaXRpb24uXG4vLyAgICAgKi9cbi8vICAgIGRpc3BsYXlQb3NpdGlvbnMoY2FwYWNpdHksIGxhYmVscyA9IG51bGwsIGNvb3JkaW5hdGVzID0gbnVsbCwgbWF4Q2xpZW50c1BlclBvc2l0aW9uID0gMSkge31cbi8vXG4vLyAgICAvKipcbi8vICAgICAqIEBwYXJhbSB7QXJyYXk8TnVtYmVyPn0gZGlzYWJsZWRJbmRleGVzIC0gQXJyYXkgb2YgaW5kZXhlcyBvZiB0aGUgZGlzYWJsZWQgcG9zaXRpb25zLlxuLy8gICAgICovXG4vLyAgICB1cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhkaXNhYmxlZEluZGV4ZXMpIHt9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBDYWxsZWQgd2hlbiBubyBwbGFjZSBsZWZ0IG9yIHdoZW4gdGhlIGNob2ljZSBvZiB0aGUgdXNlciBhcyBiZWVuIHJlamVjdGVkIGJ5XG4vLyAgICAgKiB0aGUgc2VydmVyLiBUaGUgdmlldyBzaG91bGQgYmUgc2hvdWxkIHVwZGF0ZSBhY2NvcmRpbmdseS5cbi8vICAgICAqIEBwYXJhbSB7QXJyYXk8TnVtYmVyPn0gZGlzYWJsZWRJbmRleGVzIC0gQXJyYXkgb2YgaW5kZXhlcyBvZiB0aGUgZGlzYWJsZWQgcG9zaXRpb25zLlxuLy8gICAgICovXG4vLyAgICByZWplY3QoZGlzYWJsZWRJbmRleGVzKSB7fVxuLy9cbi8vICAgICAvKipcbi8vICAgICAqIFJlZ2lzdGVyIHRoZSBhcmVhIGRlZmluaXRpb24gdG8gdGhlIHZpZXcuXG4vLyAgICAgKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIFRoZSBkZWZpbml0aW9uIG9mIHRoZSBhcmVhLlxuLy8gICAgICovXG4vLyAgICBzZXRBcmVhKGFyZWEpIHtcbi8vICAgICAgdGhpcy5fYXJlYSA9IGFyZWE7XG4vLyAgICB9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGJlIGFwcGxpZWQgd2hlbiBhIHBvc2l0aW9uIGlzIHNlbGVjdGVkLlxuLy8gICAgICovXG4vLyAgICBvblNlbGVjdChjYWxsYmFjaykge1xuLy8gICAgICB0aGlzLl9vblNlbGVjdCA9IGNhbGxiYWNrO1xuLy8gICAgfVxuLy8gIH1cblxuY2xhc3MgX0xpc3RWaWV3IGV4dGVuZHMgU3F1YXJlZFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9vblNlbGVjdGlvbkNoYW5nZSA9IHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBfb25TZWxlY3Rpb25DaGFuZ2UoZSkge1xuICAgIHRoaXMuY29udGVudC5zaG93QnRuID0gdHJ1ZTtcbiAgICB0aGlzLnJlbmRlcignLnNlY3Rpb24tZmxvYXQnKTtcbiAgICB0aGlzLmluc3RhbGxFdmVudHMoe1xuICAgICAgJ2NsaWNrIC5idG4nOiAoZSkgPT4ge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuc2VsZWN0b3IudmFsdWU7XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uKVxuICAgICAgICAgIHRoaXMuX29uU2VsZWN0KHBvc2l0aW9uLmluZGV4LCBwb3NpdGlvbi5sYWJlbCwgcG9zaXRpb24uY29vcmRpbmF0ZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0QXJlYShhcmVhKSB7IC8qIG5vIG5lZWQgZm9yIGFyZWEgKi8gfVxuXG4gIGRpc3BsYXlQb3NpdGlvbnMoY2FwYWNpdHksIGxhYmVscyA9IG51bGwsIGNvb3JkaW5hdGVzID0gbnVsbCwgbWF4Q2xpZW50c1BlclBvc2l0aW9uID0gMSkge1xuICAgIHRoaXMucG9zaXRpb25zID0gW107XG4gICAgdGhpcy5udW1iZXJQb3NpdGlvbnMgPSBjYXBhY2l0eSAvIG1heENsaWVudHNQZXJQb3NpdGlvbjtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm51bWJlclBvc2l0aW9uczsgaW5kZXgrKykge1xuICAgICAgY29uc3QgbGFiZWwgPSBsYWJlbHMgIT09IG51bGwgPyBsYWJlbHNbaW5kZXhdIDogKGluZGV4ICsgMSkudG9TdHJpbmcoKTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0geyBpbmRleDogaW5kZXgsIGxhYmVsOiBsYWJlbCB9O1xuXG4gICAgICBpZiAoY29vcmRpbmF0ZXMpXG4gICAgICAgIHBvc2l0aW9uLmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXNbaW5kZXhdO1xuXG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdG9yID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgaW5zdHJ1Y3Rpb25zOiB0aGlzLmNvbnRlbnQuaW5zdHJ1Y3Rpb25zLFxuICAgICAgZW50cmllczogdGhpcy5wb3NpdGlvbnMsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc2VsZWN0b3IpO1xuICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcblxuICAgIHRoaXMuc2VsZWN0b3IuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAnY2hhbmdlJzogdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UsXG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhpbmRleGVzKSB7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubnVtYmVyUG9zaXRpb25zOyBpbmRleCsrKSB7XG4gICAgICBpZiAoaW5kZXhlcy5pbmRleE9mKGluZGV4KSA9PT0gLTEpXG4gICAgICAgIHRoaXMuc2VsZWN0b3IuZW5hYmxlSW5kZXgoaW5kZXgpO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLnNlbGVjdG9yLmRpc2FibGVJbmRleChpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgb25TZWxlY3QoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9vblNlbGVjdCA9IGNhbGxiYWNrO1xuICB9XG5cbiAgcmVqZWN0KGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgaWYgKGRpc2FibGVkUG9zaXRpb25zLmxlbmd0aCA+PSB0aGlzLm51bWJlclBvc2l0aW9ucykge1xuICAgICAgdGhpcy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnKTtcbiAgICAgIHRoaXMuY29udGVudC5yZWplY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRpc2FibGVQb3NpdGlvbnMoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBfR3JhcGhpY1ZpZXcgZXh0ZW5kcyBTcXVhcmVkVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpIHtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2FyZWEgPSBudWxsO1xuICAgIHRoaXMuX2Rpc2FibGVkUG9zaXRpb25zID0gW107XG4gICAgdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UgPSB0aGlzLl9vblNlbGVjdGlvbkNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgX29uU2VsZWN0aW9uQ2hhbmdlKGUpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuc2VsZWN0b3Iuc2hhcGVQb2ludE1hcC5nZXQoZS50YXJnZXQpO1xuICAgIGNvbnN0IGRpc2FibGVkSW5kZXggPSB0aGlzLl9kaXNhYmxlZFBvc2l0aW9ucy5pbmRleE9mKHBvc2l0aW9uLmluZGV4KTtcblxuICAgIGlmIChkaXNhYmxlZEluZGV4ID09PSAtMSlcbiAgICAgIHRoaXMuX29uU2VsZWN0KHBvc2l0aW9uLmlkLCBwb3NpdGlvbi5sYWJlbCwgW3Bvc2l0aW9uLngsIHBvc2l0aW9uLnldKTtcbiAgfVxuXG4gIHNldEFyZWEoYXJlYSkge1xuICAgIHRoaXMuX2FyZWEgPSBhcmVhO1xuICB9XG5cbiAgZGlzcGxheVBvc2l0aW9ucyhjYXBhY2l0eSwgbGFiZWxzID0gbnVsbCwgY29vcmRpbmF0ZXMgPSBudWxsLCBtYXhDbGllbnRzUGVyUG9zaXRpb24gPSAxKSB7XG4gICAgdGhpcy5udW1iZXJQb3NpdGlvbnMgPSBjYXBhY2l0eSAvIG1heENsaWVudHNQZXJQb3NpdGlvbjtcbiAgICB0aGlzLnBvc2l0aW9ucyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bWJlclBvc2l0aW9uczsgaSsrKSB7XG4gICAgICBjb25zdCBsYWJlbCA9IGxhYmVscyAhPT0gbnVsbCA/IGxhYmVsc1tpXSA6IChpICsgMSkudG9TdHJpbmcoKTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0geyBpZDogaSwgbGFiZWw6IGxhYmVsIH07XG4gICAgICBjb25zdCBjb29yZHMgPSBjb29yZGluYXRlc1tpXTtcbiAgICAgIHBvc2l0aW9uLnggPSBjb29yZHNbMF07XG4gICAgICBwb3NpdGlvbi55ID0gY29vcmRzWzFdO1xuXG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdG9yID0gbmV3IFNwYWNlVmlldygpO1xuICAgIHRoaXMuc2VsZWN0b3Iuc2V0QXJlYSh0aGlzLl9hcmVhKTtcbiAgICB0aGlzLnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc2VsZWN0b3IpO1xuICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcblxuICAgIHRoaXMuc2VsZWN0b3Iuc2V0UG9pbnRzKHRoaXMucG9zaXRpb25zKTtcblxuICAgIHRoaXMuc2VsZWN0b3IuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAnY2xpY2sgLnBvaW50JzogdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2VcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGluZGV4ZXMpIHtcbiAgICB0aGlzLl9kaXNhYmxlZFBvc2l0aW9ucyA9IGluZGV4ZXM7XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5udW1iZXJQb3NpdGlvbnM7IGluZGV4KyspIHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbnNbaW5kZXhdO1xuICAgICAgY29uc3QgaXNEaXNhYmxlZCA9IGluZGV4ZXMuaW5kZXhPZihpbmRleCkgIT09IC0xO1xuICAgICAgcG9zaXRpb24uc2VsZWN0ZWQgPSBpc0Rpc2FibGVkID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgdGhpcy5zZWxlY3Rvci51cGRhdGVQb2ludChwb3NpdGlvbik7XG4gICAgfVxuICB9XG5cbiAgb25TZWxlY3QoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9vblNlbGVjdCA9IGNhbGxiYWNrO1xuICB9XG5cbiAgcmVqZWN0KGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgaWYgKGRpc2FibGVkUG9zaXRpb25zLmxlbmd0aCA+PSB0aGlzLm51bWJlclBvc2l0aW9ucykge1xuICAgICAgdGhpcy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnKTtcbiAgICAgIHRoaXMuY29udGVudC5yZWplY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZpZXcudXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgIH1cbiAgfVxufVxuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpwbGFjZXInO1xuXG4vKipcbiAqIEludGVyZmFjZSBvZiB0aGUgYCdwbGFjZXInYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBpcyBvbmUgb2YgdGhlIHByb3ZpZGVkIHNlcnZpY2VzIGFpbWVkIGF0IGlkZW50aWZ5aW5nIGNsaWVudHMgaW5zaWRlXG4gKiB0aGUgZXhwZXJpZW5jZSBhbG9uZyB3aXRoIHRoZSBbYCdsb2NhdG9yJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Mb2NhdG9yfVxuICogYW5kIFtgJ2NoZWNraW4nYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59IHNlcnZpY2VzLlxuICpcbiAqIFRoZSBgJ3BsYWNlcidgIHNlcnZpY2UgYWxsb3dzIGEgY2xpZW50IHRvIGNob29zZSBpdHMgcGxhY2UgYW1vbmcgYSBzZXQgb2ZcbiAqIHBvc2l0aW9ucyBkZWZpbmVkIGluIHRoZSBzZXJ2ZXIncyBgc2V0dXBgIGNvbmZpZ3VyYXRpb24gZW50cnkuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlBsYWNlcn0qX19cbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn1cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubW9kZT0nbGlzdCddIC0gU2V0cyB0aGUgaW50ZXJhY3Rpb24gbW9kZSBmb3IgdGhlXG4gKiAgY2xpZW50IHRvIGNob29zZSBpdHMgcG9zaXRpb24sIHRoZSBgJ2xpc3QnYCBtb2RlIHByb3Bvc2UgYSBkcm9wLWRvd24gbWVudVxuICogIHdoaWxlIHRoZSBgJ2dyYXBoaWMnYCBtb2RlICh3aGljaCByZXF1aXJlcyBsb2NhdGVkIHBvc2l0aW9ucykgcHJvcG9zZXMgYW5cbiAqICBpbnRlcmZhY2UgcmVwcmVzZW50aW5nIHRoZSBhcmVhIGFuZCBkb3RzIGZvciBlYWNoIGF2YWlsYWJsZSBsb2NhdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnBsYWNlciA9IHRoaXMucmVxdWlyZSgncGxhY2VyJywgeyBtb2RlOiAnZ3JhcGhpYycgfSk7XG4gKi9cbmNsYXNzIFBsYWNlciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBtb2RlOiAnbGlzdCcsXG4gICAgICB2aWV3OiBudWxsLFxuICAgICAgdmlld0N0b3I6IG51bGwsXG4gICAgICB2aWV3UHJpb3JpdHk6IDYsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlID0gdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNsaWVudEpvaW5lZCA9IHRoaXMuX29uQ2xpZW50Sm9pbmVkLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25DbGllbnRMZWF2ZWQgPSB0aGlzLl9vbkNsaWVudExlYXZlZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNvbmZpcm1SZXNwb25zZSA9IHRoaXMuX29uQ29uZmlybVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25SZWplY3RSZXNwb25zZSA9IHRoaXMuX29uUmVqZWN0UmVzcG9uc2UuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbml0KCkge1xuICAgIC8qKlxuICAgICAqIEluZGV4IG9mIHRoZSBwb3NpdGlvbiBzZWxlY3RlZCBieSB0aGUgdXNlci5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaW5kZXggPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTGFiZWwgb2YgdGhlIHBvc2l0aW9uIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5sYWJlbCA9IG51bGw7XG5cbiAgICAvLyBhbGxvdyB0byBwYXNzIGFueSB2aWV3XG4gICAgaWYgKHRoaXMub3B0aW9ucy52aWV3ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnZpZXcgPSB0aGlzLm9wdGlvbnMudmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy52aWV3Q3RvciAhPT0gbnVsbCkge1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzd2l0Y2ggKHRoaXMub3B0aW9ucy5tb2RlKSB7XG4gICAgICAgICAgY2FzZSAnZ3JhcGhpYyc6XG4gICAgICAgICAgICB0aGlzLnZpZXdDdG9yID0gX0dyYXBoaWNWaWV3O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbGlzdCc6XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRoaXMudmlld0N0b3IgPSBfTGlzdFZpZXc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmlld0NvbnRlbnQubW9kZSA9IHRoaXMub3B0aW9ucy5tb2RlO1xuICAgICAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNob3coKTtcbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnYWtub3dsZWdkZScsIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2NvbmZpcm0nLCB0aGlzLl9vbkNvbmZpcm1SZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdyZWplY3QnLCB0aGlzLl9vblJlamVjdFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2NsaWVudC1qb2luZWQnLCB0aGlzLl9vbkNsaWVudEpvaW5lZCk7XG4gICAgdGhpcy5yZWNlaXZlKCdjbGllbnQtbGVhdmVkJywgdGhpcy5fb25DbGllbnRMZWF2ZWQpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignYWtub3dsZWdkZScsIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjb25maXJtJywgdGhpcy5fb25Db25maXJtUmVzcG9uc2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3JlamVjdCcsIHRoaXMuX29uUmVqZWN0UmVzcG9uc2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NsaWVudC1qb2luZWQnLCB0aGlzLl9vbkNsaWVudEpvaW5lZCk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY2xpZW50LWxlYXZlZCcsIHRoaXMuX29uQ2xpZW50TGVhdmVkKTtcblxuICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkFrbm93bGVkZ2VSZXNwb25zZShzZXR1cENvbmZpZ0l0ZW0sIGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgY29uc3Qgc2V0dXAgPSB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlLmdldChzZXR1cENvbmZpZ0l0ZW0pO1xuICAgIGNvbnN0IGFyZWEgPSBzZXR1cC5hcmVhO1xuICAgIGNvbnN0IGNhcGFjaXR5ID0gc2V0dXAuY2FwYWNpdHk7XG4gICAgY29uc3QgbGFiZWxzID0gc2V0dXAubGFiZWxzO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXM7XG4gICAgY29uc3QgbWF4Q2xpZW50c1BlclBvc2l0aW9uID0gc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uO1xuXG4gICAgaWYgKGFyZWEpXG4gICAgICB0aGlzLnZpZXcuc2V0QXJlYShhcmVhKTtcblxuICAgIHRoaXMudmlldy5kaXNwbGF5UG9zaXRpb25zKGNhcGFjaXR5LCBsYWJlbHMsIGNvb3JkaW5hdGVzLCBtYXhDbGllbnRzUGVyUG9zaXRpb24pO1xuICAgIHRoaXMudmlldy51cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgdGhpcy52aWV3Lm9uU2VsZWN0KHRoaXMuX29uU2VsZWN0KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25TZWxlY3QoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykge1xuICAgIHRoaXMuc2VuZCgncG9zaXRpb24nLCBpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Db25maXJtUmVzcG9uc2UoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykge1xuICAgIGNsaWVudC5pbmRleCA9IHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICBjbGllbnQubGFiZWwgPSB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQ2xpZW50Sm9pbmVkKGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgdGhpcy52aWV3LnVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25DbGllbnRMZWF2ZWQoZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICB0aGlzLnZpZXcudXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlamVjdFJlc3BvbnNlKGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgdGhpcy52aWV3LnJlamVjdChkaXNhYmxlZFBvc2l0aW9ucyk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgUGxhY2VyKTtcblxuZXhwb3J0IGRlZmF1bHQgUGxhY2VyO1xuIl19