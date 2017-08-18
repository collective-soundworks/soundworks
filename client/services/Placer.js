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

    var _this = (0, _possibleConstructorReturn3.default)(this, (_ListView.__proto__ || (0, _getPrototypeOf2.default)(_ListView)).call(this, template, content, events, options));

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
      var labels = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var coordinates = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var maxClientsPerPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

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

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (_GraphicView.__proto__ || (0, _getPrototypeOf2.default)(_GraphicView)).call(this, template, content, events, options));

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
      var labels = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var coordinates = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var maxClientsPerPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

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

    var _this4 = (0, _possibleConstructorReturn3.default)(this, (Placer.__proto__ || (0, _getPrototypeOf2.default)(Placer)).call(this, SERVICE_ID, true));

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
      (0, _get3.default)(Placer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Placer.prototype), 'start', this).call(this);

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
      console.log(disabledPositions);
      this.view.reject(disabledPositions);
    }
  }]);
  return Placer;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Placer);

exports.default = Placer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYWNlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwiZGVmYXVsdFZpZXdUZW1wbGF0ZSIsImRlZmF1bHRWaWV3Q29udGVudCIsImluc3RydWN0aW9ucyIsInNlbmQiLCJyZWplY3QiLCJzaG93QnRuIiwicmVqZWN0ZWQiLCJfTGlzdFZpZXciLCJ0ZW1wbGF0ZSIsImNvbnRlbnQiLCJldmVudHMiLCJvcHRpb25zIiwiX29uU2VsZWN0aW9uQ2hhbmdlIiwiYmluZCIsImUiLCJyZW5kZXIiLCJpbnN0YWxsRXZlbnRzIiwicG9zaXRpb24iLCJzZWxlY3RvciIsInZhbHVlIiwiX29uU2VsZWN0IiwiaW5kZXgiLCJsYWJlbCIsImNvb3JkaW5hdGVzIiwiYXJlYSIsImNhcGFjaXR5IiwibGFiZWxzIiwibWF4Q2xpZW50c1BlclBvc2l0aW9uIiwicG9zaXRpb25zIiwibnVtYmVyUG9zaXRpb25zIiwidG9TdHJpbmciLCJwdXNoIiwiZW50cmllcyIsInNldFZpZXdDb21wb25lbnQiLCJpbmRleGVzIiwiaW5kZXhPZiIsImVuYWJsZUluZGV4IiwiZGlzYWJsZUluZGV4IiwiY2FsbGJhY2siLCJkaXNhYmxlZFBvc2l0aW9ucyIsImxlbmd0aCIsImRpc2FibGVQb3NpdGlvbnMiLCJfR3JhcGhpY1ZpZXciLCJfYXJlYSIsIl9kaXNhYmxlZFBvc2l0aW9ucyIsInNoYXBlUG9pbnRNYXAiLCJnZXQiLCJ0YXJnZXQiLCJkaXNhYmxlZEluZGV4IiwiaWQiLCJ4IiwieSIsImkiLCJjb29yZHMiLCJzZXRBcmVhIiwic2V0UG9pbnRzIiwiaXNEaXNhYmxlZCIsInNlbGVjdGVkIiwidXBkYXRlUG9pbnQiLCJ2aWV3IiwidXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMiLCJQbGFjZXIiLCJkZWZhdWx0cyIsIm1vZGUiLCJ2aWV3Q3RvciIsInZpZXdQcmlvcml0eSIsImNvbmZpZ3VyZSIsIl9kZWZhdWx0Vmlld1RlbXBsYXRlIiwiX2RlZmF1bHRWaWV3Q29udGVudCIsIl9vbkFrbm93bGVkZ2VSZXNwb25zZSIsIl9vbkNsaWVudEpvaW5lZCIsIl9vbkNsaWVudExlYXZlZCIsIl9vbkNvbmZpcm1SZXNwb25zZSIsIl9vblJlamVjdFJlc3BvbnNlIiwiX3NoYXJlZENvbmZpZ1NlcnZpY2UiLCJyZXF1aXJlIiwidmlld0NvbnRlbnQiLCJjcmVhdGVWaWV3IiwiaGFzU3RhcnRlZCIsImluaXQiLCJzaG93IiwicmVjZWl2ZSIsInJlbW92ZUxpc3RlbmVyIiwiaGlkZSIsInNldHVwQ29uZmlnSXRlbSIsInNldHVwIiwiZGlzcGxheVBvc2l0aW9ucyIsIm9uU2VsZWN0IiwicmVhZHkiLCJjb25zb2xlIiwibG9nIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxnQkFBbkI7O0FBRUEsSUFBTUMsdWhCQUFOOztBQW9CQSxJQUFNQyxxQkFBcUI7QUFDekJDLGdCQUFjLHNCQURXO0FBRXpCQyxRQUFNLE1BRm1CO0FBR3pCQyxVQUFRLDhCQUhpQjtBQUl6QkMsV0FBUyxLQUpnQjtBQUt6QkMsWUFBVTtBQUxlLENBQTNCOztBQVNBOzs7Ozs7QUFNQTs7Ozs7Ozs7Ozs7QUFXQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0E7Ozs7Ozs7O0FBUUE7Ozs7Ozs7Ozs7SUFVTUMsUzs7O0FBQ0oscUJBQVlDLFFBQVosRUFBc0JDLE9BQXRCLEVBQStCQyxNQUEvQixFQUF1Q0MsT0FBdkMsRUFBZ0Q7QUFBQTs7QUFBQSw0SUFDeENILFFBRHdDLEVBQzlCQyxPQUQ4QixFQUNyQkMsTUFEcUIsRUFDYkMsT0FEYTs7QUFHOUMsVUFBS0Msa0JBQUwsR0FBMEIsTUFBS0Esa0JBQUwsQ0FBd0JDLElBQXhCLE9BQTFCO0FBSDhDO0FBSS9DOzs7O3VDQUVrQkMsQyxFQUFHO0FBQUE7O0FBQ3BCLFdBQUtMLE9BQUwsQ0FBYUosT0FBYixHQUF1QixJQUF2QjtB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SUFBTCxDQUFVQyx1QkFBVixDQUFrQ3JCLGlCQUFsQztBQUNEOztBQUVEOzs7O3NDQUNrQkEsaUIsRUFBbUI7QUFDbkNrRCxjQUFRQyxHQUFSLENBQVluRCxpQkFBWjtBQUNBLFdBQUtvQixJQUFMLENBQVV2RCxNQUFWLENBQWlCbUMsaUJBQWpCO0FBQ0Q7Ozs7O0FBR0gseUJBQWVvRCxRQUFmLENBQXdCNUYsVUFBeEIsRUFBb0M4RCxNQUFwQzs7a0JBRWVBLE0iLCJmaWxlIjoiUGxhY2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNlbGVjdFZpZXcgZnJvbSAnLi4vdmlld3MvU2VsZWN0Vmlldyc7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4uL3ZpZXdzL1NwYWNlVmlldyc7XG5pbXBvcnQgU3F1YXJlZFZpZXcgZnJvbSAnLi4vdmlld3MvU3F1YXJlZFZpZXcnO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6cGxhY2VyJztcblxuY29uc3QgZGVmYXVsdFZpZXdUZW1wbGF0ZSA9IGBcbjxkaXYgY2xhc3M9XCJzZWN0aW9uLXNxdWFyZTwlPSBtb2RlID09PSAnbGlzdCcgPyAnIGZsZXgtbWlkZGxlJyA6ICcnICU+XCI+XG4gIDwlIGlmIChyZWplY3RlZCkgeyAlPlxuICA8ZGl2IGNsYXNzPVwiZml0LWNvbnRhaW5lciBmbGV4LW1pZGRsZVwiPlxuICAgIDxwPjwlPSByZWplY3QgJT48L3A+XG4gIDwvZGl2PlxuICA8JSB9ICU+XG48L2Rpdj5cbjxkaXYgY2xhc3M9XCJzZWN0aW9uLWZsb2F0IGZsZXgtbWlkZGxlXCI+XG4gIDwlIGlmICghcmVqZWN0ZWQpIHsgJT5cbiAgICA8JSBpZiAobW9kZSA9PT0gJ2dyYXBoaWMnKSB7ICU+XG4gICAgICA8cD48JT0gaW5zdHJ1Y3Rpb25zICU+PC9wPlxuICAgIDwlIH0gZWxzZSBpZiAobW9kZSA9PT0gJ2xpc3QnKSB7ICU+XG4gICAgICA8JSBpZiAoc2hvd0J0bikgeyAlPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuXCI+PCU9IHNlbmQgJT48L2J1dHRvbj5cbiAgICAgIDwlIH0gJT5cbiAgICA8JSB9ICU+XG4gIDwlIH0gJT5cbjwvZGl2PmA7XG5cbmNvbnN0IGRlZmF1bHRWaWV3Q29udGVudCA9IHtcbiAgaW5zdHJ1Y3Rpb25zOiAnU2VsZWN0IHlvdXIgcG9zaXRpb24nLFxuICBzZW5kOiAnU2VuZCcsXG4gIHJlamVjdDogJ1NvcnJ5LCBubyBwbGFjZSBpcyBhdmFpbGFibGUnLFxuICBzaG93QnRuOiBmYWxzZSxcbiAgcmVqZWN0ZWQ6IGZhbHNlLFxufTtcblxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIHZpZXcgb2YgdGhlIGBwbGFjZXJgIHNlcnZpY2UuXG4gKlxuICogQGludGVyZmFjZSBBYnN0cmFjdFBsYWNlclZpZXdcbiAqIEBleHRlbmRzIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gKi9cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGBhcmVhYCBkZWZpbml0aW9uIHRvIHRoZSB2aWV3LlxuICpcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgQWJzdHJhY3RQbGFjZXJWaWV3LnNldEFyZWFcbiAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhIC0gRGVmaW5pdGlvbiBvZiB0aGUgYXJlYS5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBhcmVhLndpZHRoIC0gV2l0aCBvZiB0aGUgYXJlYS5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBhcmVhLmhlaWdodCAtIEhlaWdodCBvZiB0aGUgYXJlYS5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBbYXJlYS5sYWJlbHM9W11dIC0gTGFiZWxzIG9mIHRoZSBwb3NpdGlvbi5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBbYXJlYS5jb29yZGluYXRlcz1bXV0gLSBDb29yZGluYXRlcyBvZiB0aGUgYXJlYS5cbiAqL1xuLyoqXG4gKiBEaXNwbGF5IHRoZSBhdmFpbGFibGUgcG9zaXRpb25zLlxuICpcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgQWJzdHJhY3RQbGFjZXJWaWV3Lm9uU2VuZFxuICogQHBhcmFtIHtOdW1iZXJ9IGNhcGFjaXR5IC0gVGhlIG1heGltdW0gbnVtYmVyIG9mIGNsaWVudHMgYWxsb3dlZC5cbiAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gW2xhYmVscz1udWxsXSAtIEFuIGFycmF5IG9mIHRoZSBsYWJlbHMgZm9yIHRoZSBwb3NpdGlvbnNcbiAqIEBwYXJhbSB7QXJyYXk8QXJyYXk8TnVtYmVyPj59IFtjb29yZGluYXRlcz1udWxsXSAtIEFuIGFycmF5IG9mIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgcG9zaXRpb25zXG4gKiBAcGFyYW0ge051bWJlcn0gW21heENsaWVudHNQZXJQb3NpdGlvbj0xXSAtIE51bWJlciBvZiBjbGllbnRzIGFsbG93ZWQgZm9yIGVhY2ggcG9zaXRpb24uXG4gKi9cbi8qKlxuICogRGlzYWJsZSB0aGUgZ2l2ZW4gcG9zaXRpb25zLlxuICpcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgQWJzdHJhY3RQbGFjZXJWaWV3LnVwZGF0ZURpc2FibGVkUG9zaXRpb25zXG4gKiBAcGFyYW0ge0FycmF5PE51bWJlcj59IGRpc2FibGVkSW5kZXhlcyAtIEFycmF5IG9mIGluZGV4ZXMgb2YgdGhlIGRpc2FibGVkIHBvc2l0aW9ucy5cbiAqL1xuLyoqXG4gKiBEZWZpbmUgdGhlIGJlaGF2aW9yIG9mIHRoZSB2aWV3IHdoZW4gdGhlIHBvc2l0aW9uIHJlcXVlc3RlZCBieSB0aGUgdXNlciBpc1xuICogbm8gbG9uZ2VyIGF2YWlsYWJsZVxuICpcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgQWJzdHJhY3RQbGFjZXJWaWV3LnJlamVjdFxuICogQHBhcmFtIHtBcnJheTxOdW1iZXI+fSBkaXNhYmxlZEluZGV4ZXMgLSBBcnJheSBvZiBpbmRleGVzIG9mIHRoZSBkaXNhYmxlZCBwb3NpdGlvbnMuXG4gKi9cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGNhbGxiYWNrIHRvIGJlIGFwcGxpZWQgd2hlbiB0aGUgdXNlciBzZWxlY3QgYSBwb3NpdGlvbi5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBuYW1lIEFic3RyYXRQbGFjZXJWaWV3Lm9uU2VsZWN0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGJlIGFwcGxpZWQgd2hlbiBhIHBvc2l0aW9uIGlzIHNlbGVjdGVkLlxuICogIFRoaXMgY2FsbGJhY2sgc2hvdWxkIGJlIGNhbGxlZCB3aXRoIHRoZSBgaW5kZXhgLCBgbGFiZWxgIGFuZCBgY29vcmRpbmF0ZXNgIG9mXG4gKiAgdGhlIHJlcXVlc3RlZCBwb3NpdGlvbi5cbiAqL1xuXG5jbGFzcyBfTGlzdFZpZXcgZXh0ZW5kcyBTcXVhcmVkVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpIHtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlID0gdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIF9vblNlbGVjdGlvbkNoYW5nZShlKSB7XG4gICAgdGhpcy5jb250ZW50LnNob3dCdG4gPSB0cnVlO1xuICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1mbG9hdCcpO1xuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAnY2xpY2sgLmJ0bic6IChlKSA9PiB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5zZWxlY3Rvci52YWx1ZTtcblxuICAgICAgICBpZiAocG9zaXRpb24pXG4gICAgICAgICAgdGhpcy5fb25TZWxlY3QocG9zaXRpb24uaW5kZXgsIHBvc2l0aW9uLmxhYmVsLCBwb3NpdGlvbi5jb29yZGluYXRlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXRBcmVhKGFyZWEpIHsgLyogbm8gbmVlZCBmb3IgYXJlYSAqLyB9XG5cbiAgZGlzcGxheVBvc2l0aW9ucyhjYXBhY2l0eSwgbGFiZWxzID0gbnVsbCwgY29vcmRpbmF0ZXMgPSBudWxsLCBtYXhDbGllbnRzUGVyUG9zaXRpb24gPSAxKSB7XG4gICAgdGhpcy5wb3NpdGlvbnMgPSBbXTtcbiAgICB0aGlzLm51bWJlclBvc2l0aW9ucyA9IGNhcGFjaXR5IC8gbWF4Q2xpZW50c1BlclBvc2l0aW9uO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubnVtYmVyUG9zaXRpb25zOyBpbmRleCsrKSB7XG4gICAgICBjb25zdCBsYWJlbCA9IGxhYmVscyAhPT0gbnVsbCA/IGxhYmVsc1tpbmRleF0gOiAoaW5kZXggKyAxKS50b1N0cmluZygpO1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB7IGluZGV4OiBpbmRleCwgbGFiZWw6IGxhYmVsIH07XG5cbiAgICAgIGlmIChjb29yZGluYXRlcylcbiAgICAgICAgcG9zaXRpb24uY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlc1tpbmRleF07XG5cbiAgICAgIHRoaXMucG9zaXRpb25zLnB1c2gocG9zaXRpb24pO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0b3IgPSBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICBpbnN0cnVjdGlvbnM6IHRoaXMuY29udGVudC5pbnN0cnVjdGlvbnMsXG4gICAgICBlbnRyaWVzOiB0aGlzLnBvc2l0aW9ucyxcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tc3F1YXJlJywgdGhpcy5zZWxlY3Rvcik7XG4gICAgdGhpcy5yZW5kZXIoJy5zZWN0aW9uLXNxdWFyZScpO1xuXG4gICAgdGhpcy5zZWxlY3Rvci5pbnN0YWxsRXZlbnRzKHtcbiAgICAgICdjaGFuZ2UnOiB0aGlzLl9vblNlbGVjdGlvbkNoYW5nZSxcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGluZGV4ZXMpIHtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5udW1iZXJQb3NpdGlvbnM7IGluZGV4KyspIHtcbiAgICAgIGlmIChpbmRleGVzLmluZGV4T2YoaW5kZXgpID09PSAtMSlcbiAgICAgICAgdGhpcy5zZWxlY3Rvci5lbmFibGVJbmRleChpbmRleCk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuc2VsZWN0b3IuZGlzYWJsZUluZGV4KGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBvblNlbGVjdChjYWxsYmFjaykge1xuICAgIHRoaXMuX29uU2VsZWN0ID0gY2FsbGJhY2s7XG4gIH1cblxuICByZWplY3QoZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICBpZiAoZGlzYWJsZWRQb3NpdGlvbnMubGVuZ3RoID49IHRoaXMubnVtYmVyUG9zaXRpb25zKSB7XG4gICAgICB0aGlzLnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScpO1xuICAgICAgdGhpcy5jb250ZW50LnJlamVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGlzYWJsZVBvc2l0aW9ucyhkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIF9HcmFwaGljVmlldyBleHRlbmRzIFNxdWFyZWRWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucykge1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fYXJlYSA9IG51bGw7XG4gICAgdGhpcy5fZGlzYWJsZWRQb3NpdGlvbnMgPSBbXTtcbiAgICB0aGlzLl9vblNlbGVjdGlvbkNoYW5nZSA9IHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBfb25TZWxlY3Rpb25DaGFuZ2UoZSkge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5zZWxlY3Rvci5zaGFwZVBvaW50TWFwLmdldChlLnRhcmdldCk7XG4gICAgY29uc3QgZGlzYWJsZWRJbmRleCA9IHRoaXMuX2Rpc2FibGVkUG9zaXRpb25zLmluZGV4T2YocG9zaXRpb24uaW5kZXgpO1xuXG4gICAgaWYgKGRpc2FibGVkSW5kZXggPT09IC0xKVxuICAgICAgdGhpcy5fb25TZWxlY3QocG9zaXRpb24uaWQsIHBvc2l0aW9uLmxhYmVsLCBbcG9zaXRpb24ueCwgcG9zaXRpb24ueV0pO1xuICB9XG5cbiAgc2V0QXJlYShhcmVhKSB7XG4gICAgdGhpcy5fYXJlYSA9IGFyZWE7XG4gIH1cblxuICBkaXNwbGF5UG9zaXRpb25zKGNhcGFjaXR5LCBsYWJlbHMgPSBudWxsLCBjb29yZGluYXRlcyA9IG51bGwsIG1heENsaWVudHNQZXJQb3NpdGlvbiA9IDEpIHtcbiAgICB0aGlzLm51bWJlclBvc2l0aW9ucyA9IGNhcGFjaXR5IC8gbWF4Q2xpZW50c1BlclBvc2l0aW9uO1xuICAgIHRoaXMucG9zaXRpb25zID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtYmVyUG9zaXRpb25zOyBpKyspIHtcbiAgICAgIGNvbnN0IGxhYmVsID0gbGFiZWxzICE9PSBudWxsID8gbGFiZWxzW2ldIDogKGkgKyAxKS50b1N0cmluZygpO1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB7IGlkOiBpLCBsYWJlbDogbGFiZWwgfTtcbiAgICAgIGNvbnN0IGNvb3JkcyA9IGNvb3JkaW5hdGVzW2ldO1xuICAgICAgcG9zaXRpb24ueCA9IGNvb3Jkc1swXTtcbiAgICAgIHBvc2l0aW9uLnkgPSBjb29yZHNbMV07XG5cbiAgICAgIHRoaXMucG9zaXRpb25zLnB1c2gocG9zaXRpb24pO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0b3IgPSBuZXcgU3BhY2VWaWV3KCk7XG4gICAgdGhpcy5zZWxlY3Rvci5zZXRBcmVhKHRoaXMuX2FyZWEpO1xuICAgIHRoaXMuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tc3F1YXJlJywgdGhpcy5zZWxlY3Rvcik7XG4gICAgdGhpcy5yZW5kZXIoJy5zZWN0aW9uLXNxdWFyZScpO1xuXG4gICAgdGhpcy5zZWxlY3Rvci5zZXRQb2ludHModGhpcy5wb3NpdGlvbnMpO1xuXG4gICAgdGhpcy5zZWxlY3Rvci5pbnN0YWxsRXZlbnRzKHtcbiAgICAgICdjbGljayAucG9pbnQnOiB0aGlzLl9vblNlbGVjdGlvbkNoYW5nZVxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoaW5kZXhlcykge1xuICAgIHRoaXMuX2Rpc2FibGVkUG9zaXRpb25zID0gaW5kZXhlcztcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm51bWJlclBvc2l0aW9uczsgaW5kZXgrKykge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uc1tpbmRleF07XG4gICAgICBjb25zdCBpc0Rpc2FibGVkID0gaW5kZXhlcy5pbmRleE9mKGluZGV4KSAhPT0gLTE7XG4gICAgICBwb3NpdGlvbi5zZWxlY3RlZCA9IGlzRGlzYWJsZWQgPyB0cnVlIDogZmFsc2U7XG4gICAgICB0aGlzLnNlbGVjdG9yLnVwZGF0ZVBvaW50KHBvc2l0aW9uKTtcbiAgICB9XG4gIH1cblxuICBvblNlbGVjdChjYWxsYmFjaykge1xuICAgIHRoaXMuX29uU2VsZWN0ID0gY2FsbGJhY2s7XG4gIH1cblxuICByZWplY3QoZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICBpZiAoZGlzYWJsZWRQb3NpdGlvbnMubGVuZ3RoID49IHRoaXMubnVtYmVyUG9zaXRpb25zKSB7XG4gICAgICB0aGlzLnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScpO1xuICAgICAgdGhpcy5jb250ZW50LnJlamVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlldy51cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgfVxuICB9XG59XG5cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBgJ3BsYWNlcidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGlzIG9uZSBvZiB0aGUgcHJvdmlkZWQgc2VydmljZXMgYWltZWQgYXQgaWRlbnRpZnlpbmcgY2xpZW50cyBpbnNpZGVcbiAqIHRoZSBleHBlcmllbmNlIGFsb25nIHdpdGggdGhlIFtgJ2xvY2F0b3InYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9XG4gKiBhbmQgW2AnY2hlY2tpbidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn0gc2VydmljZXMuXG4gKlxuICogVGhlIGAncGxhY2VyJ2Agc2VydmljZSBhbGxvd3MgYSBjbGllbnQgdG8gY2hvb3NlIGl0cyBsb2NhdGlvbiBhbW9uZyBhIHNldCBvZlxuICogcG9zaXRpb25zIGRlZmluZWQgaW4gdGhlIHNlcnZlcidzIGBzZXR1cGAgY29uZmlndXJhdGlvbiBlbnRyeS5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuUGxhY2VyfSpfX1xuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Mb2NhdG9yfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5tb2RlPSdsaXN0J10gLSBTZXRzIHRoZSBpbnRlcmFjdGlvbiBtb2RlIGZvciB0aGVcbiAqICBjbGllbnQgdG8gY2hvb3NlIGl0cyBwb3NpdGlvbiwgdGhlIGAnbGlzdCdgIG1vZGUgcHJvcG9zZXMgYSBkcm9wLWRvd24gbWVudVxuICogIHdoaWxlIHRoZSBgJ2dyYXBoaWMnYCBtb2RlICh3aGljaCByZXF1aXJlcyBsb2NhdGVkIHBvc2l0aW9ucykgcHJvcG9zZXMgYW5cbiAqICBpbnRlcmZhY2UgcmVwcmVzZW50aW5nIHRoZSBhcmVhIGFuZCBkb3RzIGZvciBlYWNoIGF2YWlsYWJsZSBsb2NhdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnBsYWNlciA9IHRoaXMucmVxdWlyZSgncGxhY2VyJywgeyBtb2RlOiAnZ3JhcGhpYycgfSk7XG4gKi9cbmNsYXNzIFBsYWNlciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBtb2RlOiAnbGlzdCcsXG4gICAgICB2aWV3OiBudWxsLFxuICAgICAgdmlld0N0b3I6IG51bGwsXG4gICAgICB2aWV3UHJpb3JpdHk6IDYsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX2RlZmF1bHRWaWV3VGVtcGxhdGUgPSBkZWZhdWx0Vmlld1RlbXBsYXRlO1xuICAgIHRoaXMuX2RlZmF1bHRWaWV3Q29udGVudCA9IGRlZmF1bHRWaWV3Q29udGVudDtcblxuICAgIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlID0gdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNsaWVudEpvaW5lZCA9IHRoaXMuX29uQ2xpZW50Sm9pbmVkLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25DbGllbnRMZWF2ZWQgPSB0aGlzLl9vbkNsaWVudExlYXZlZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNvbmZpcm1SZXNwb25zZSA9IHRoaXMuX29uQ29uZmlybVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25SZWplY3RSZXNwb25zZSA9IHRoaXMuX29uUmVqZWN0UmVzcG9uc2UuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbml0KCkge1xuICAgIC8qKlxuICAgICAqIEluZGV4IG9mIHRoZSBwb3NpdGlvbiBzZWxlY3RlZCBieSB0aGUgdXNlci5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaW5kZXggPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTGFiZWwgb2YgdGhlIHBvc2l0aW9uIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5sYWJlbCA9IG51bGw7XG5cbiAgICAvLyBhbGxvdyB0byBwYXNzIGFueSB2aWV3XG4gICAgaWYgKHRoaXMub3B0aW9ucy52aWV3ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnZpZXcgPSB0aGlzLm9wdGlvbnMudmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy52aWV3Q3RvciAhPT0gbnVsbCkge1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzd2l0Y2ggKHRoaXMub3B0aW9ucy5tb2RlKSB7XG4gICAgICAgICAgY2FzZSAnZ3JhcGhpYyc6XG4gICAgICAgICAgICB0aGlzLnZpZXdDdG9yID0gX0dyYXBoaWNWaWV3O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbGlzdCc6XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRoaXMudmlld0N0b3IgPSBfTGlzdFZpZXc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmlld0NvbnRlbnQubW9kZSA9IHRoaXMub3B0aW9ucy5tb2RlO1xuICAgICAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNob3coKTtcbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnYWtub3dsZWdkZScsIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2NvbmZpcm0nLCB0aGlzLl9vbkNvbmZpcm1SZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdyZWplY3QnLCB0aGlzLl9vblJlamVjdFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2NsaWVudC1qb2luZWQnLCB0aGlzLl9vbkNsaWVudEpvaW5lZCk7XG4gICAgdGhpcy5yZWNlaXZlKCdjbGllbnQtbGVhdmVkJywgdGhpcy5fb25DbGllbnRMZWF2ZWQpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignYWtub3dsZWdkZScsIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjb25maXJtJywgdGhpcy5fb25Db25maXJtUmVzcG9uc2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3JlamVjdCcsIHRoaXMuX29uUmVqZWN0UmVzcG9uc2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NsaWVudC1qb2luZWQnLCB0aGlzLl9vbkNsaWVudEpvaW5lZCk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY2xpZW50LWxlYXZlZCcsIHRoaXMuX29uQ2xpZW50TGVhdmVkKTtcblxuICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkFrbm93bGVkZ2VSZXNwb25zZShzZXR1cENvbmZpZ0l0ZW0sIGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgY29uc3Qgc2V0dXAgPSB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlLmdldChzZXR1cENvbmZpZ0l0ZW0pO1xuICAgIGNvbnN0IGFyZWEgPSBzZXR1cC5hcmVhO1xuICAgIGNvbnN0IGNhcGFjaXR5ID0gc2V0dXAuY2FwYWNpdHk7XG4gICAgY29uc3QgbGFiZWxzID0gc2V0dXAubGFiZWxzO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXM7XG4gICAgY29uc3QgbWF4Q2xpZW50c1BlclBvc2l0aW9uID0gc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uO1xuXG4gICAgaWYgKGFyZWEpXG4gICAgICB0aGlzLnZpZXcuc2V0QXJlYShhcmVhKTtcblxuICAgIHRoaXMudmlldy5kaXNwbGF5UG9zaXRpb25zKGNhcGFjaXR5LCBsYWJlbHMsIGNvb3JkaW5hdGVzLCBtYXhDbGllbnRzUGVyUG9zaXRpb24pO1xuICAgIHRoaXMudmlldy51cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgdGhpcy52aWV3Lm9uU2VsZWN0KHRoaXMuX29uU2VsZWN0KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25TZWxlY3QoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykge1xuICAgIHRoaXMuc2VuZCgncG9zaXRpb24nLCBpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Db25maXJtUmVzcG9uc2UoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykge1xuICAgIGNsaWVudC5pbmRleCA9IHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICBjbGllbnQubGFiZWwgPSB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQ2xpZW50Sm9pbmVkKGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgdGhpcy52aWV3LnVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25DbGllbnRMZWF2ZWQoZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICB0aGlzLnZpZXcudXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlamVjdFJlc3BvbnNlKGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgY29uc29sZS5sb2coZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgIHRoaXMudmlldy5yZWplY3QoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFBsYWNlcik7XG5cbmV4cG9ydCBkZWZhdWx0IFBsYWNlcjtcbiJdfQ==