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

var SERVICE_ID = 'service:placer';

var defaultViewTemplate = '\n<div class="section-square<%= mode === \'list\' ? \' flex-middle\' : \'\' %>">\n  <% if (rejected) { %>\n  <div class="fit-container flex-middle">\n    <p><%= reject %></p>\n  </div>\n  <% } %>\n</div>\n<div class="section-float flex-middle">\n  <% if (!rejected) { %>\n    <% if (mode === \'graphic\') { %>\n      <p><%= instructions %></p>\n    <% } else if (mode === \'list\') { %>\n      <% if (showBtn) { %>\n        <button class="btn"><%= send %></button>\n      <% } %>\n    <% } %>\n  <% } %>\n</div>';

var defaultViewContent = {
  instructions: 'Select your position',
  send: 'Send',
  reject: 'Sorry, no place is available',
  showBtn: false,
  rejected: false
};

/**
 * Interface for the view of the `placer` service.
 *
 * @interface AbstractPlacerView
 * @extends module:soundworks/client.View
 */
/**
 * Register the `area` definition to the view.
 *
 * @function
 * @name AbstractPlacerView.setArea
 * @param {Object} area - Definition of the area.
 * @property {Number} area.width - With of the area.
 * @property {Number} area.height - Height of the area.
 * @property {Number} [area.labels=[]] - Labels of the position.
 * @property {Number} [area.coordinates=[]] - Coordinates of the area.
 */
/**
 * Display the available positions.
 *
 * @function
 * @name AbstractPlacerView.onSend
 * @param {Number} capacity - The maximum number of clients allowed.
 * @param {Array<String>} [labels=null] - An array of the labels for the positions
 * @param {Array<Array<Number>>} [coordinates=null] - An array of the coordinates of the positions
 * @param {Number} [maxClientsPerPosition=1] - Number of clients allowed for each position.
 */
/**
 * Disable the given positions.
 *
 * @function
 * @name AbstractPlacerView.updateDisabledPositions
 * @param {Array<Number>} disabledIndexes - Array of indexes of the disabled positions.
 */
/**
 * Define the behavior of the view when the position requested by the user is
 * no longer available
 *
 * @function
 * @name AbstractPlacerView.reject
 * @param {Array<Number>} disabledIndexes - Array of indexes of the disabled positions.
 */
/**
 * Register the callback to be applied when the user select a position.
 *
 * @function
 * @name AbstratPlacerView.onSelect
 * @param {Function} callback - Callback to be applied when a position is selected.
 *  This callback should be called with the `index`, `label` and `coordinates` of
 *  the requested position.
 */

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

    _this4._defaultViewTemplate = defaultViewTemplate;
    _this4._defaultViewContent = defaultViewContent;

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
//# sourceMappingURL=data:application/json;base64,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QUssSUFBTCxDQUFVLHVCQUFWLENBQWtDLGlCQUFsQztBQUNEOzs7Ozs7b0NBR2UsaUIsRUFBbUI7QUFDakMsV0FBSyxJQUFMLENBQVUsdUJBQVYsQ0FBa0MsaUJBQWxDO0FBQ0Q7Ozs7OztzQ0FHaUIsaUIsRUFBbUI7QUFDbkMsV0FBSyxJQUFMLENBQVUsTUFBVixDQUFpQixpQkFBakI7QUFDRDs7Ozs7QUFHSCx5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLE1BQXBDOztrQkFFZSxNIiwiZmlsZSI6IlBsYWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTZWxlY3RWaWV3IGZyb20gJy4uL3ZpZXdzL1NlbGVjdFZpZXcnO1xuaW1wb3J0IFNwYWNlVmlldyBmcm9tICcuLi92aWV3cy9TcGFjZVZpZXcnO1xuaW1wb3J0IFNxdWFyZWRWaWV3IGZyb20gJy4uL3ZpZXdzL1NxdWFyZWRWaWV3JztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnBsYWNlcic7XG5cbmNvbnN0IGRlZmF1bHRWaWV3VGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwic2VjdGlvbi1zcXVhcmU8JT0gbW9kZSA9PT0gJ2xpc3QnID8gJyBmbGV4LW1pZGRsZScgOiAnJyAlPlwiPlxuICA8JSBpZiAocmVqZWN0ZWQpIHsgJT5cbiAgPGRpdiBjbGFzcz1cImZpdC1jb250YWluZXIgZmxleC1taWRkbGVcIj5cbiAgICA8cD48JT0gcmVqZWN0ICU+PC9wPlxuICA8L2Rpdj5cbiAgPCUgfSAlPlxuPC9kaXY+XG48ZGl2IGNsYXNzPVwic2VjdGlvbi1mbG9hdCBmbGV4LW1pZGRsZVwiPlxuICA8JSBpZiAoIXJlamVjdGVkKSB7ICU+XG4gICAgPCUgaWYgKG1vZGUgPT09ICdncmFwaGljJykgeyAlPlxuICAgICAgPHA+PCU9IGluc3RydWN0aW9ucyAlPjwvcD5cbiAgICA8JSB9IGVsc2UgaWYgKG1vZGUgPT09ICdsaXN0JykgeyAlPlxuICAgICAgPCUgaWYgKHNob3dCdG4pIHsgJT5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0blwiPjwlPSBzZW5kICU+PC9idXR0b24+XG4gICAgICA8JSB9ICU+XG4gICAgPCUgfSAlPlxuICA8JSB9ICU+XG48L2Rpdj5gO1xuXG5jb25zdCBkZWZhdWx0Vmlld0NvbnRlbnQgPSB7XG4gIGluc3RydWN0aW9uczogJ1NlbGVjdCB5b3VyIHBvc2l0aW9uJyxcbiAgc2VuZDogJ1NlbmQnLFxuICByZWplY3Q6ICdTb3JyeSwgbm8gcGxhY2UgaXMgYXZhaWxhYmxlJyxcbiAgc2hvd0J0bjogZmFsc2UsXG4gIHJlamVjdGVkOiBmYWxzZSxcbn07XG5cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSB2aWV3IG9mIHRoZSBgcGxhY2VyYCBzZXJ2aWNlLlxuICpcbiAqIEBpbnRlcmZhY2UgQWJzdHJhY3RQbGFjZXJWaWV3XG4gKiBAZXh0ZW5kcyBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICovXG4vKipcbiAqIFJlZ2lzdGVyIHRoZSBgYXJlYWAgZGVmaW5pdGlvbiB0byB0aGUgdmlldy5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBuYW1lIEFic3RyYWN0UGxhY2VyVmlldy5zZXRBcmVhXG4gKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIERlZmluaXRpb24gb2YgdGhlIGFyZWEuXG4gKiBAcHJvcGVydHkge051bWJlcn0gYXJlYS53aWR0aCAtIFdpdGggb2YgdGhlIGFyZWEuXG4gKiBAcHJvcGVydHkge051bWJlcn0gYXJlYS5oZWlnaHQgLSBIZWlnaHQgb2YgdGhlIGFyZWEuXG4gKiBAcHJvcGVydHkge051bWJlcn0gW2FyZWEubGFiZWxzPVtdXSAtIExhYmVscyBvZiB0aGUgcG9zaXRpb24uXG4gKiBAcHJvcGVydHkge051bWJlcn0gW2FyZWEuY29vcmRpbmF0ZXM9W11dIC0gQ29vcmRpbmF0ZXMgb2YgdGhlIGFyZWEuXG4gKi9cbi8qKlxuICogRGlzcGxheSB0aGUgYXZhaWxhYmxlIHBvc2l0aW9ucy5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBuYW1lIEFic3RyYWN0UGxhY2VyVmlldy5vblNlbmRcbiAqIEBwYXJhbSB7TnVtYmVyfSBjYXBhY2l0eSAtIFRoZSBtYXhpbXVtIG51bWJlciBvZiBjbGllbnRzIGFsbG93ZWQuXG4gKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IFtsYWJlbHM9bnVsbF0gLSBBbiBhcnJheSBvZiB0aGUgbGFiZWxzIGZvciB0aGUgcG9zaXRpb25zXG4gKiBAcGFyYW0ge0FycmF5PEFycmF5PE51bWJlcj4+fSBbY29vcmRpbmF0ZXM9bnVsbF0gLSBBbiBhcnJheSBvZiB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHBvc2l0aW9uc1xuICogQHBhcmFtIHtOdW1iZXJ9IFttYXhDbGllbnRzUGVyUG9zaXRpb249MV0gLSBOdW1iZXIgb2YgY2xpZW50cyBhbGxvd2VkIGZvciBlYWNoIHBvc2l0aW9uLlxuICovXG4vKipcbiAqIERpc2FibGUgdGhlIGdpdmVuIHBvc2l0aW9ucy5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBuYW1lIEFic3RyYWN0UGxhY2VyVmlldy51cGRhdGVEaXNhYmxlZFBvc2l0aW9uc1xuICogQHBhcmFtIHtBcnJheTxOdW1iZXI+fSBkaXNhYmxlZEluZGV4ZXMgLSBBcnJheSBvZiBpbmRleGVzIG9mIHRoZSBkaXNhYmxlZCBwb3NpdGlvbnMuXG4gKi9cbi8qKlxuICogRGVmaW5lIHRoZSBiZWhhdmlvciBvZiB0aGUgdmlldyB3aGVuIHRoZSBwb3NpdGlvbiByZXF1ZXN0ZWQgYnkgdGhlIHVzZXIgaXNcbiAqIG5vIGxvbmdlciBhdmFpbGFibGVcbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBuYW1lIEFic3RyYWN0UGxhY2VyVmlldy5yZWplY3RcbiAqIEBwYXJhbSB7QXJyYXk8TnVtYmVyPn0gZGlzYWJsZWRJbmRleGVzIC0gQXJyYXkgb2YgaW5kZXhlcyBvZiB0aGUgZGlzYWJsZWQgcG9zaXRpb25zLlxuICovXG4vKipcbiAqIFJlZ2lzdGVyIHRoZSBjYWxsYmFjayB0byBiZSBhcHBsaWVkIHdoZW4gdGhlIHVzZXIgc2VsZWN0IGEgcG9zaXRpb24uXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbmFtZSBBYnN0cmF0UGxhY2VyVmlldy5vblNlbGVjdFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBiZSBhcHBsaWVkIHdoZW4gYSBwb3NpdGlvbiBpcyBzZWxlY3RlZC5cbiAqICBUaGlzIGNhbGxiYWNrIHNob3VsZCBiZSBjYWxsZWQgd2l0aCB0aGUgYGluZGV4YCwgYGxhYmVsYCBhbmQgYGNvb3JkaW5hdGVzYCBvZlxuICogIHRoZSByZXF1ZXN0ZWQgcG9zaXRpb24uXG4gKi9cblxuY2xhc3MgX0xpc3RWaWV3IGV4dGVuZHMgU3F1YXJlZFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9vblNlbGVjdGlvbkNoYW5nZSA9IHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBfb25TZWxlY3Rpb25DaGFuZ2UoZSkge1xuICAgIHRoaXMuY29udGVudC5zaG93QnRuID0gdHJ1ZTtcbiAgICB0aGlzLnJlbmRlcignLnNlY3Rpb24tZmxvYXQnKTtcbiAgICB0aGlzLmluc3RhbGxFdmVudHMoe1xuICAgICAgJ2NsaWNrIC5idG4nOiAoZSkgPT4ge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuc2VsZWN0b3IudmFsdWU7XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uKVxuICAgICAgICAgIHRoaXMuX29uU2VsZWN0KHBvc2l0aW9uLmluZGV4LCBwb3NpdGlvbi5sYWJlbCwgcG9zaXRpb24uY29vcmRpbmF0ZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0QXJlYShhcmVhKSB7IC8qIG5vIG5lZWQgZm9yIGFyZWEgKi8gfVxuXG4gIGRpc3BsYXlQb3NpdGlvbnMoY2FwYWNpdHksIGxhYmVscyA9IG51bGwsIGNvb3JkaW5hdGVzID0gbnVsbCwgbWF4Q2xpZW50c1BlclBvc2l0aW9uID0gMSkge1xuICAgIHRoaXMucG9zaXRpb25zID0gW107XG4gICAgdGhpcy5udW1iZXJQb3NpdGlvbnMgPSBjYXBhY2l0eSAvIG1heENsaWVudHNQZXJQb3NpdGlvbjtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm51bWJlclBvc2l0aW9uczsgaW5kZXgrKykge1xuICAgICAgY29uc3QgbGFiZWwgPSBsYWJlbHMgIT09IG51bGwgPyBsYWJlbHNbaW5kZXhdIDogKGluZGV4ICsgMSkudG9TdHJpbmcoKTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0geyBpbmRleDogaW5kZXgsIGxhYmVsOiBsYWJlbCB9O1xuXG4gICAgICBpZiAoY29vcmRpbmF0ZXMpXG4gICAgICAgIHBvc2l0aW9uLmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXNbaW5kZXhdO1xuXG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdG9yID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgaW5zdHJ1Y3Rpb25zOiB0aGlzLmNvbnRlbnQuaW5zdHJ1Y3Rpb25zLFxuICAgICAgZW50cmllczogdGhpcy5wb3NpdGlvbnMsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc2VsZWN0b3IpO1xuICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcblxuICAgIHRoaXMuc2VsZWN0b3IuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAnY2hhbmdlJzogdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UsXG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhpbmRleGVzKSB7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubnVtYmVyUG9zaXRpb25zOyBpbmRleCsrKSB7XG4gICAgICBpZiAoaW5kZXhlcy5pbmRleE9mKGluZGV4KSA9PT0gLTEpXG4gICAgICAgIHRoaXMuc2VsZWN0b3IuZW5hYmxlSW5kZXgoaW5kZXgpO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLnNlbGVjdG9yLmRpc2FibGVJbmRleChpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgb25TZWxlY3QoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9vblNlbGVjdCA9IGNhbGxiYWNrO1xuICB9XG5cbiAgcmVqZWN0KGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgaWYgKGRpc2FibGVkUG9zaXRpb25zLmxlbmd0aCA+PSB0aGlzLm51bWJlclBvc2l0aW9ucykge1xuICAgICAgdGhpcy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnKTtcbiAgICAgIHRoaXMuY29udGVudC5yZWplY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRpc2FibGVQb3NpdGlvbnMoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBfR3JhcGhpY1ZpZXcgZXh0ZW5kcyBTcXVhcmVkVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpIHtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2FyZWEgPSBudWxsO1xuICAgIHRoaXMuX2Rpc2FibGVkUG9zaXRpb25zID0gW107XG4gICAgdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UgPSB0aGlzLl9vblNlbGVjdGlvbkNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgX29uU2VsZWN0aW9uQ2hhbmdlKGUpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuc2VsZWN0b3Iuc2hhcGVQb2ludE1hcC5nZXQoZS50YXJnZXQpO1xuICAgIGNvbnN0IGRpc2FibGVkSW5kZXggPSB0aGlzLl9kaXNhYmxlZFBvc2l0aW9ucy5pbmRleE9mKHBvc2l0aW9uLmluZGV4KTtcblxuICAgIGlmIChkaXNhYmxlZEluZGV4ID09PSAtMSlcbiAgICAgIHRoaXMuX29uU2VsZWN0KHBvc2l0aW9uLmlkLCBwb3NpdGlvbi5sYWJlbCwgW3Bvc2l0aW9uLngsIHBvc2l0aW9uLnldKTtcbiAgfVxuXG4gIHNldEFyZWEoYXJlYSkge1xuICAgIHRoaXMuX2FyZWEgPSBhcmVhO1xuICB9XG5cbiAgZGlzcGxheVBvc2l0aW9ucyhjYXBhY2l0eSwgbGFiZWxzID0gbnVsbCwgY29vcmRpbmF0ZXMgPSBudWxsLCBtYXhDbGllbnRzUGVyUG9zaXRpb24gPSAxKSB7XG4gICAgdGhpcy5udW1iZXJQb3NpdGlvbnMgPSBjYXBhY2l0eSAvIG1heENsaWVudHNQZXJQb3NpdGlvbjtcbiAgICB0aGlzLnBvc2l0aW9ucyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bWJlclBvc2l0aW9uczsgaSsrKSB7XG4gICAgICBjb25zdCBsYWJlbCA9IGxhYmVscyAhPT0gbnVsbCA/IGxhYmVsc1tpXSA6IChpICsgMSkudG9TdHJpbmcoKTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0geyBpZDogaSwgbGFiZWw6IGxhYmVsIH07XG4gICAgICBjb25zdCBjb29yZHMgPSBjb29yZGluYXRlc1tpXTtcbiAgICAgIHBvc2l0aW9uLnggPSBjb29yZHNbMF07XG4gICAgICBwb3NpdGlvbi55ID0gY29vcmRzWzFdO1xuXG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdG9yID0gbmV3IFNwYWNlVmlldygpO1xuICAgIHRoaXMuc2VsZWN0b3Iuc2V0QXJlYSh0aGlzLl9hcmVhKTtcbiAgICB0aGlzLnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc2VsZWN0b3IpO1xuICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcblxuICAgIHRoaXMuc2VsZWN0b3Iuc2V0UG9pbnRzKHRoaXMucG9zaXRpb25zKTtcblxuICAgIHRoaXMuc2VsZWN0b3IuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAnY2xpY2sgLnBvaW50JzogdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2VcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGluZGV4ZXMpIHtcbiAgICB0aGlzLl9kaXNhYmxlZFBvc2l0aW9ucyA9IGluZGV4ZXM7XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5udW1iZXJQb3NpdGlvbnM7IGluZGV4KyspIHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbnNbaW5kZXhdO1xuICAgICAgY29uc3QgaXNEaXNhYmxlZCA9IGluZGV4ZXMuaW5kZXhPZihpbmRleCkgIT09IC0xO1xuICAgICAgcG9zaXRpb24uc2VsZWN0ZWQgPSBpc0Rpc2FibGVkID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgdGhpcy5zZWxlY3Rvci51cGRhdGVQb2ludChwb3NpdGlvbik7XG4gICAgfVxuICB9XG5cbiAgb25TZWxlY3QoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9vblNlbGVjdCA9IGNhbGxiYWNrO1xuICB9XG5cbiAgcmVqZWN0KGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgaWYgKGRpc2FibGVkUG9zaXRpb25zLmxlbmd0aCA+PSB0aGlzLm51bWJlclBvc2l0aW9ucykge1xuICAgICAgdGhpcy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnKTtcbiAgICAgIHRoaXMuY29udGVudC5yZWplY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZpZXcudXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgIH1cbiAgfVxufVxuXG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgYCdwbGFjZXInYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBpcyBvbmUgb2YgdGhlIHByb3ZpZGVkIHNlcnZpY2VzIGFpbWVkIGF0IGlkZW50aWZ5aW5nIGNsaWVudHMgaW5zaWRlXG4gKiB0aGUgZXhwZXJpZW5jZSBhbG9uZyB3aXRoIHRoZSBbYCdsb2NhdG9yJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Mb2NhdG9yfVxuICogYW5kIFtgJ2NoZWNraW4nYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59IHNlcnZpY2VzLlxuICpcbiAqIFRoZSBgJ3BsYWNlcidgIHNlcnZpY2UgYWxsb3dzIGEgY2xpZW50IHRvIGNob29zZSBpdHMgbG9jYXRpb24gYW1vbmcgYSBzZXQgb2ZcbiAqIHBvc2l0aW9ucyBkZWZpbmVkIGluIHRoZSBzZXJ2ZXIncyBgc2V0dXBgIGNvbmZpZ3VyYXRpb24gZW50cnkuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlBsYWNlcn0qX19cbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn1cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubW9kZT0nbGlzdCddIC0gU2V0cyB0aGUgaW50ZXJhY3Rpb24gbW9kZSBmb3IgdGhlXG4gKiAgY2xpZW50IHRvIGNob29zZSBpdHMgcG9zaXRpb24sIHRoZSBgJ2xpc3QnYCBtb2RlIHByb3Bvc2VzIGEgZHJvcC1kb3duIG1lbnVcbiAqICB3aGlsZSB0aGUgYCdncmFwaGljJ2AgbW9kZSAod2hpY2ggcmVxdWlyZXMgbG9jYXRlZCBwb3NpdGlvbnMpIHByb3Bvc2VzIGFuXG4gKiAgaW50ZXJmYWNlIHJlcHJlc2VudGluZyB0aGUgYXJlYSBhbmQgZG90cyBmb3IgZWFjaCBhdmFpbGFibGUgbG9jYXRpb24uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5wbGFjZXIgPSB0aGlzLnJlcXVpcmUoJ3BsYWNlcicsIHsgbW9kZTogJ2dyYXBoaWMnIH0pO1xuICovXG5jbGFzcyBQbGFjZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgbW9kZTogJ2xpc3QnLFxuICAgICAgdmlldzogbnVsbCxcbiAgICAgIHZpZXdDdG9yOiBudWxsLFxuICAgICAgdmlld1ByaW9yaXR5OiA2LFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9kZWZhdWx0Vmlld1RlbXBsYXRlID0gZGVmYXVsdFZpZXdUZW1wbGF0ZTtcbiAgICB0aGlzLl9kZWZhdWx0Vmlld0NvbnRlbnQgPSBkZWZhdWx0Vmlld0NvbnRlbnQ7XG5cbiAgICB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSA9IHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25DbGllbnRKb2luZWQgPSB0aGlzLl9vbkNsaWVudEpvaW5lZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQ2xpZW50TGVhdmVkID0gdGhpcy5fb25DbGllbnRMZWF2ZWQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblNlbGVjdCA9IHRoaXMuX29uU2VsZWN0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Db25maXJtUmVzcG9uc2UgPSB0aGlzLl9vbkNvbmZpcm1SZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uUmVqZWN0UmVzcG9uc2UgPSB0aGlzLl9vblJlamVjdFJlc3BvbnNlLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBJbmRleCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIExhYmVsIG9mIHRoZSBwb3NpdGlvbiBzZWxlY3RlZCBieSB0aGUgdXNlci5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgLy8gYWxsb3cgdG8gcGFzcyBhbnkgdmlld1xuICAgIGlmICh0aGlzLm9wdGlvbnMudmlldyAhPT0gbnVsbCkge1xuICAgICAgdGhpcy52aWV3ID0gdGhpcy5vcHRpb25zLnZpZXc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudmlld0N0b3IgIT09IG51bGwpIHtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLm9wdGlvbnMubW9kZSkge1xuICAgICAgICAgIGNhc2UgJ2dyYXBoaWMnOlxuICAgICAgICAgICAgdGhpcy52aWV3Q3RvciA9IF9HcmFwaGljVmlldztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aGlzLnZpZXdDdG9yID0gX0xpc3RWaWV3O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnZpZXdDb250ZW50Lm1vZGUgPSB0aGlzLm9wdGlvbnMubW9kZTtcbiAgICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zaG93KCk7XG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ2Frbm93bGVnZGUnLCB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdjb25maXJtJywgdGhpcy5fb25Db25maXJtUmVzcG9uc2UpO1xuICAgIHRoaXMucmVjZWl2ZSgncmVqZWN0JywgdGhpcy5fb25SZWplY3RSZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdjbGllbnQtam9pbmVkJywgdGhpcy5fb25DbGllbnRKb2luZWQpO1xuICAgIHRoaXMucmVjZWl2ZSgnY2xpZW50LWxlYXZlZCcsIHRoaXMuX29uQ2xpZW50TGVhdmVkKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2Frbm93bGVnZGUnLCB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY29uZmlybScsIHRoaXMuX29uQ29uZmlybVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdyZWplY3QnLCB0aGlzLl9vblJlamVjdFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjbGllbnQtam9pbmVkJywgdGhpcy5fb25DbGllbnRKb2luZWQpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NsaWVudC1sZWF2ZWQnLCB0aGlzLl9vbkNsaWVudExlYXZlZCk7XG5cbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Ba25vd2xlZGdlUmVzcG9uc2Uoc2V0dXBDb25maWdJdGVtLCBkaXNhYmxlZFBvc2l0aW9ucykge1xuICAgIGNvbnN0IHNldHVwID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5nZXQoc2V0dXBDb25maWdJdGVtKTtcbiAgICBjb25zdCBhcmVhID0gc2V0dXAuYXJlYTtcbiAgICBjb25zdCBjYXBhY2l0eSA9IHNldHVwLmNhcGFjaXR5O1xuICAgIGNvbnN0IGxhYmVscyA9IHNldHVwLmxhYmVscztcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzO1xuICAgIGNvbnN0IG1heENsaWVudHNQZXJQb3NpdGlvbiA9IHNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbjtcblxuICAgIGlmIChhcmVhKVxuICAgICAgdGhpcy52aWV3LnNldEFyZWEoYXJlYSk7XG5cbiAgICB0aGlzLnZpZXcuZGlzcGxheVBvc2l0aW9ucyhjYXBhY2l0eSwgbGFiZWxzLCBjb29yZGluYXRlcywgbWF4Q2xpZW50c1BlclBvc2l0aW9uKTtcbiAgICB0aGlzLnZpZXcudXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgIHRoaXMudmlldy5vblNlbGVjdCh0aGlzLl9vblNlbGVjdCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uU2VsZWN0KGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpIHtcbiAgICB0aGlzLnNlbmQoJ3Bvc2l0aW9uJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQ29uZmlybVJlc3BvbnNlKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpIHtcbiAgICBjbGllbnQuaW5kZXggPSB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgY2xpZW50LmxhYmVsID0gdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkNsaWVudEpvaW5lZChkaXNhYmxlZFBvc2l0aW9ucykge1xuICAgIHRoaXMudmlldy51cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhkaXNhYmxlZFBvc2l0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQ2xpZW50TGVhdmVkKGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgdGhpcy52aWV3LnVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZWplY3RSZXNwb25zZShkaXNhYmxlZFBvc2l0aW9ucykge1xuICAgIHRoaXMudmlldy5yZWplY3QoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFBsYWNlcik7XG5cbmV4cG9ydCBkZWZhdWx0IFBsYWNlcjtcbiJdfQ==