'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreClient = require('../core/client');

var _coreClient2 = _interopRequireDefault(_coreClient);

var _coreService = require('../core/Service');

var _coreService2 = _interopRequireDefault(_coreService);

var _coreServiceManager = require('../core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

// import localStorage from './localStorage';

var _displaySelectView = require('../display/SelectView');

var _displaySelectView2 = _interopRequireDefault(_displaySelectView);

var _displaySpaceView = require('../display/SpaceView');

var _displaySpaceView2 = _interopRequireDefault(_displaySpaceView);

var _displaySquaredView = require('../display/SquaredView');

var _displaySquaredView2 = _interopRequireDefault(_displaySquaredView);

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

var _ListView = (function (_SquaredView) {
  _inherits(_ListView, _SquaredView);

  function _ListView(template, content, events, options) {
    _classCallCheck(this, _ListView);

    _get(Object.getPrototypeOf(_ListView.prototype), 'constructor', this).call(this, template, content, events, options);

    this._onSelectionChange = this._onSelectionChange.bind(this);
  }

  _createClass(_ListView, [{
    key: '_onSelectionChange',
    value: function _onSelectionChange(e) {
      var _this = this;

      this.content.showBtn = true;
      this.render('.section-float');
      this.installEvents({
        'click .btn': function clickBtn(e) {
          var position = _this.selector.value;

          if (position) _this._onSelect(position.index, position.label, position.coordinates);
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

      this.selector = new _displaySelectView2['default']({
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
})(_displaySquaredView2['default']);

var _GraphicView = (function (_SquaredView2) {
  _inherits(_GraphicView, _SquaredView2);

  function _GraphicView(template, content, events, options) {
    _classCallCheck(this, _GraphicView);

    _get(Object.getPrototypeOf(_GraphicView.prototype), 'constructor', this).call(this, template, content, events, options);

    this._area = null;
    this._disabledPositions = [];
    this._onSelectionChange = this._onSelectionChange.bind(this);
  }

  _createClass(_GraphicView, [{
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

      this.selector = new _displaySpaceView2['default']();
      this.selector.setArea(this._area);
      this.setViewComponent('.section-square', this.selector);
      this.render('.section-square');

      this.selector.setPoints(this.positions);

      this.selector.installEvents({
        'click .point': this._onSelectionChange
      });
    }

    // disablePositions(indexes) {
    //   this._disabledPositions = indexes;
    //   indexes.forEach((index) => this.disablePosition(index));
    // }

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

    // disablePosition(index) {
    //   this._disabledPositions.push(index);
    //   const position = this.positions[index];

    //   if (position) {
    //     position.selected = true;
    //     this.selector.updatePoint(position);
    //   }
    // }

    // enablePosition(index) {
    //   const disabledIndex = this._disabledPositions.indexOf(index);
    //   if (disabledIndex !== -1)
    //     this._disabledPositions.splice(disabledIndex, 1);

    //   const position = this.positions[index];

    //   if (position) {
    //     position.selected = false;
    //     this.selector.updatePoint(position);
    //   }
    // }

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
})(_displaySquaredView2['default']);

var SERVICE_ID = 'service:placer';

/**
 * [client] Allow to select a place within a set of predefined positions (i.e. labels and/or coordinates).
 *
 * (See also {@link src/server/ServerPlacer.js~ServerPlacer} on the server side.)
 *
 * @example
 * const placer = soundworks.client.require('place', { capacity: 100 });
 */

var ClientPlacer = (function (_Service) {
  _inherits(ClientPlacer, _Service);

  function ClientPlacer() {
    _classCallCheck(this, ClientPlacer);

    _get(Object.getPrototypeOf(ClientPlacer.prototype), 'constructor', this).call(this, SERVICE_ID, true);

    /**
     * @type {Object} defaults - The defaults options of the service.
     * @attribute {String} [options.mode='list'] - Selection mode. Can be:
     * - `'graphic'` to select a place on a graphical representation of the available positions.
     * - `'list'` to select a place among a list of places.
     * @attribute {View} [options.view='null'] - The view of the service to be used (@todo)
     * @attribute {View} [options.view='null'] - The view constructor of the service to be used. Must implement the `PlacerView` interface.
     * @attribute {Number} [options.priority=6] - The priority of the view.
     */
    var defaults = {
      mode: 'list',
      view: null,
      viewCtor: null,
      viewPriority: 6
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

  _createClass(ClientPlacer, [{
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
      if (this.options.view !== null) {} else {
        if (this.options.viewCtor !== null) this.viewCtor = this.options.viewCtor;else {
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

    /** @inheritdoc */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientPlacer.prototype), 'start', this).call(this);

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
      _coreClient2['default'].index = this.index = index;
      _coreClient2['default'].label = this.label = label;
      _coreClient2['default'].coordinates = coordinates;

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
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, ClientPlacer);

exports['default'] = ClientPlacer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudFBsYWNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUFtQixnQkFBZ0I7Ozs7MkJBQ2YsaUJBQWlCOzs7O2tDQUNWLHdCQUF3Qjs7Ozs7O2lDQUU1Qix1QkFBdUI7Ozs7Z0NBQ3hCLHNCQUFzQjs7OztrQ0FDcEIsd0JBQXdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTBDMUMsU0FBUztZQUFULFNBQVM7O0FBQ0YsV0FEUCxTQUFTLENBQ0QsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFOzBCQUQ1QyxTQUFTOztBQUVYLCtCQUZFLFNBQVMsNkNBRUwsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFOztBQUUxQyxRQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM5RDs7ZUFMRyxTQUFTOztXQU9LLDRCQUFDLENBQUMsRUFBRTs7O0FBQ3BCLFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUM1QixVQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDOUIsVUFBSSxDQUFDLGFBQWEsQ0FBQztBQUNqQixvQkFBWSxFQUFFLGtCQUFDLENBQUMsRUFBSztBQUNuQixjQUFNLFFBQVEsR0FBRyxNQUFLLFFBQVEsQ0FBQyxLQUFLLENBQUM7O0FBRXJDLGNBQUksUUFBUSxFQUNWLE1BQUssU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDeEU7T0FDRixDQUFDLENBQUM7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QUFHLFdBQVcsQ0FBQzs7QUFFakMsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2Q7Ozs7O1dBR2MseUJBQUMsaUJBQWlCLEVBQUU7QUFDakMsVUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ3REOzs7OztXQUdjLHlCQUFDLGlCQUFpQixFQUFFO0FBQ2pDLFVBQUksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUN0RDs7Ozs7V0FHZ0IsMkJBQUMsaUJBQWlCLEVBQUU7QUFDbkMsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUNyQzs7O1NBNUlHLFlBQVk7OztBQStJbEIsZ0NBQWUsUUFBUSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQzs7cUJBRW5DLFlBQVkiLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50UGxhY2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuLy8gaW1wb3J0IGxvY2FsU3RvcmFnZSBmcm9tICcuL2xvY2FsU3RvcmFnZSc7XG5pbXBvcnQgU2VsZWN0VmlldyBmcm9tICcuLi9kaXNwbGF5L1NlbGVjdFZpZXcnO1xuaW1wb3J0IFNwYWNlVmlldyBmcm9tICcuLi9kaXNwbGF5L1NwYWNlVmlldyc7XG5pbXBvcnQgU3F1YXJlZFZpZXcgZnJvbSAnLi4vZGlzcGxheS9TcXVhcmVkVmlldyc7XG5cbi8vICAvKipcbi8vICAgKiBJbnRlcmZhY2Ugb2YgdGhlIHZpZXcgb2YgdGhlIHBsYWNlci5cbi8vICAgKi9cbi8vICBjbGFzcyBBYnN0YWN0UGxhY2VyVmlldyBleHRlbmRzIHNvdW5kd29ya3MuZGlzcGxheS5WaWV3IHtcbi8vICAgIC8qKlxuLy8gICAgICogQHBhcmFtIHtOdW1iZXJ9IGNhcGFjaXR5IC0gVGhlIG1heGltdW0gbnVtYmVyIG9mIGNsaWVudHMgYWxsb3dlZC5cbi8vICAgICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gW2xhYmVscz1udWxsXSAtIEFuIGFycmF5IG9mIHRoZSBsYWJlbHMgZm9yIHRoZSBwb3NpdGlvbnNcbi8vICAgICAqIEBwYXJhbSB7QXJyYXk8QXJyYXk8TnVtYmVyPj59IFtjb29yZGluYXRlcz1udWxsXSAtIEFuIGFycmF5IG9mIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgcG9zaXRpb25zXG4vLyAgICAgKiBAcGFyYW0ge051bWJlcn0gW21heENsaWVudHNQZXJQb3NpdGlvbj0xXSAtIFRoZSBudW1iZXIgb2YgY2xpZW50IGFsbG93ZWQgZm9yIGVhY2ggcG9zaXRpb24uXG4vLyAgICAgKi9cbi8vICAgIGRpc3BsYXlQb3NpdGlvbnMoY2FwYWNpdHksIGxhYmVscyA9IG51bGwsIGNvb3JkaW5hdGVzID0gbnVsbCwgbWF4Q2xpZW50c1BlclBvc2l0aW9uID0gMSkge31cbi8vXG4vLyAgICAvKipcbi8vICAgICAqIEBwYXJhbSB7QXJyYXk8TnVtYmVyPn0gZGlzYWJsZWRJbmRleGVzIC0gQXJyYXkgb2YgaW5kZXhlcyBvZiB0aGUgZGlzYWJsZWQgcG9zaXRpb25zLlxuLy8gICAgICovXG4vLyAgICB1cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhkaXNhYmxlZEluZGV4ZXMpIHt9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBDYWxsZWQgd2hlbiBubyBwbGFjZSBsZWZ0IG9yIHdoZW4gdGhlIGNob2ljZSBvZiB0aGUgdXNlciBhcyBiZWVuIHJlamVjdGVkIGJ5XG4vLyAgICAgKiB0aGUgc2VydmVyLiBUaGUgdmlldyBzaG91bGQgYmUgc2hvdWxkIHVwZGF0ZSBhY2NvcmRpbmdseS5cbi8vICAgICAqIEBwYXJhbSB7QXJyYXk8TnVtYmVyPn0gZGlzYWJsZWRJbmRleGVzIC0gQXJyYXkgb2YgaW5kZXhlcyBvZiB0aGUgZGlzYWJsZWQgcG9zaXRpb25zLlxuLy8gICAgICovXG4vLyAgICByZWplY3QoZGlzYWJsZWRJbmRleGVzKSB7fVxuLy9cbi8vICAgICAvKipcbi8vICAgICAqIFJlZ2lzdGVyIHRoZSBhcmVhIGRlZmluaXRpb24gdG8gdGhlIHZpZXcuXG4vLyAgICAgKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIFRoZSBkZWZpbml0aW9uIG9mIHRoZSBhcmVhLlxuLy8gICAgICovXG4vLyAgICBzZXRBcmVhKGFyZWEpIHtcbi8vICAgICAgdGhpcy5fYXJlYSA9IGFyZWE7XG4vLyAgICB9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGJlIGFwcGxpZWQgd2hlbiBhIHBvc2l0aW9uIGlzIHNlbGVjdGVkLlxuLy8gICAgICovXG4vLyAgICBvblNlbGVjdChjYWxsYmFjaykge1xuLy8gICAgICB0aGlzLl9vblNlbGVjdCA9IGNhbGxiYWNrO1xuLy8gICAgfVxuLy8gIH1cblxuY2xhc3MgX0xpc3RWaWV3IGV4dGVuZHMgU3F1YXJlZFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9vblNlbGVjdGlvbkNoYW5nZSA9IHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBfb25TZWxlY3Rpb25DaGFuZ2UoZSkge1xuICAgIHRoaXMuY29udGVudC5zaG93QnRuID0gdHJ1ZTtcbiAgICB0aGlzLnJlbmRlcignLnNlY3Rpb24tZmxvYXQnKTtcbiAgICB0aGlzLmluc3RhbGxFdmVudHMoe1xuICAgICAgJ2NsaWNrIC5idG4nOiAoZSkgPT4ge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuc2VsZWN0b3IudmFsdWU7XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uKVxuICAgICAgICAgIHRoaXMuX29uU2VsZWN0KHBvc2l0aW9uLmluZGV4LCBwb3NpdGlvbi5sYWJlbCwgcG9zaXRpb24uY29vcmRpbmF0ZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0QXJlYShhcmVhKSB7IC8qIG5vIG5lZWQgZm9yIGFyZWEgKi8gfVxuXG4gIGRpc3BsYXlQb3NpdGlvbnMoY2FwYWNpdHksIGxhYmVscyA9IG51bGwsIGNvb3JkaW5hdGVzID0gbnVsbCwgbWF4Q2xpZW50c1BlclBvc2l0aW9uID0gMSkge1xuICAgIHRoaXMucG9zaXRpb25zID0gW107XG4gICAgdGhpcy5udW1iZXJQb3NpdGlvbnMgPSBjYXBhY2l0eSAvIG1heENsaWVudHNQZXJQb3NpdGlvbjtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm51bWJlclBvc2l0aW9uczsgaW5kZXgrKykge1xuICAgICAgY29uc3QgbGFiZWwgPSBsYWJlbHMgIT09IG51bGwgPyBsYWJlbHNbaW5kZXhdIDogKGluZGV4ICsgMSkudG9TdHJpbmcoKTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0geyBpbmRleDogaW5kZXgsIGxhYmVsOiBsYWJlbCB9O1xuXG4gICAgICBpZiAoY29vcmRpbmF0ZXMpXG4gICAgICAgIHBvc2l0aW9uLmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXNbaW5kZXhdO1xuXG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdG9yID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgaW5zdHJ1Y3Rpb25zOiB0aGlzLmNvbnRlbnQuaW5zdHJ1Y3Rpb25zLFxuICAgICAgZW50cmllczogdGhpcy5wb3NpdGlvbnMsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc2VsZWN0b3IpO1xuICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcblxuICAgIHRoaXMuc2VsZWN0b3IuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAnY2hhbmdlJzogdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UsXG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhpbmRleGVzKSB7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubnVtYmVyUG9zaXRpb25zOyBpbmRleCsrKSB7XG4gICAgICBpZiAoaW5kZXhlcy5pbmRleE9mKGluZGV4KSA9PT0gLTEpXG4gICAgICAgIHRoaXMuc2VsZWN0b3IuZW5hYmxlSW5kZXgoaW5kZXgpO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLnNlbGVjdG9yLmRpc2FibGVJbmRleChpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgb25TZWxlY3QoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9vblNlbGVjdCA9IGNhbGxiYWNrO1xuICB9XG5cbiAgcmVqZWN0KGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgaWYgKGRpc2FibGVkUG9zaXRpb25zLmxlbmd0aCA+PSB0aGlzLm51bWJlclBvc2l0aW9ucykge1xuICAgICAgdGhpcy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnKTtcbiAgICAgIHRoaXMuY29udGVudC5yZWplY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRpc2FibGVQb3NpdGlvbnMoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBfR3JhcGhpY1ZpZXcgZXh0ZW5kcyBTcXVhcmVkVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpIHtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2FyZWEgPSBudWxsO1xuICAgIHRoaXMuX2Rpc2FibGVkUG9zaXRpb25zID0gW107XG4gICAgdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UgPSB0aGlzLl9vblNlbGVjdGlvbkNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgX29uU2VsZWN0aW9uQ2hhbmdlKGUpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuc2VsZWN0b3Iuc2hhcGVQb2ludE1hcC5nZXQoZS50YXJnZXQpO1xuICAgIGNvbnN0IGRpc2FibGVkSW5kZXggPSB0aGlzLl9kaXNhYmxlZFBvc2l0aW9ucy5pbmRleE9mKHBvc2l0aW9uLmluZGV4KTtcblxuICAgIGlmIChkaXNhYmxlZEluZGV4ID09PSAtMSlcbiAgICAgIHRoaXMuX29uU2VsZWN0KHBvc2l0aW9uLmlkLCBwb3NpdGlvbi5sYWJlbCwgW3Bvc2l0aW9uLngsIHBvc2l0aW9uLnldKTtcbiAgfVxuXG4gIHNldEFyZWEoYXJlYSkge1xuICAgIHRoaXMuX2FyZWEgPSBhcmVhO1xuICB9XG5cbiAgZGlzcGxheVBvc2l0aW9ucyhjYXBhY2l0eSwgbGFiZWxzID0gbnVsbCwgY29vcmRpbmF0ZXMgPSBudWxsLCBtYXhDbGllbnRzUGVyUG9zaXRpb24gPSAxKSB7XG4gICAgdGhpcy5udW1iZXJQb3NpdGlvbnMgPSBjYXBhY2l0eSAvIG1heENsaWVudHNQZXJQb3NpdGlvbjtcbiAgICB0aGlzLnBvc2l0aW9ucyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bWJlclBvc2l0aW9uczsgaSsrKSB7XG4gICAgICBjb25zdCBsYWJlbCA9IGxhYmVscyAhPT0gbnVsbCA/IGxhYmVsc1tpXSA6IChpICsgMSkudG9TdHJpbmcoKTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0geyBpZDogaSwgbGFiZWw6IGxhYmVsIH07XG4gICAgICBjb25zdCBjb29yZHMgPSBjb29yZGluYXRlc1tpXTtcbiAgICAgIHBvc2l0aW9uLnggPSBjb29yZHNbMF07XG4gICAgICBwb3NpdGlvbi55ID0gY29vcmRzWzFdO1xuXG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdG9yID0gbmV3IFNwYWNlVmlldygpO1xuICAgIHRoaXMuc2VsZWN0b3Iuc2V0QXJlYSh0aGlzLl9hcmVhKTtcbiAgICB0aGlzLnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc2VsZWN0b3IpO1xuICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcblxuICAgIHRoaXMuc2VsZWN0b3Iuc2V0UG9pbnRzKHRoaXMucG9zaXRpb25zKTtcblxuICAgIHRoaXMuc2VsZWN0b3IuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAnY2xpY2sgLnBvaW50JzogdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2VcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGRpc2FibGVQb3NpdGlvbnMoaW5kZXhlcykge1xuICAvLyAgIHRoaXMuX2Rpc2FibGVkUG9zaXRpb25zID0gaW5kZXhlcztcbiAgLy8gICBpbmRleGVzLmZvckVhY2goKGluZGV4KSA9PiB0aGlzLmRpc2FibGVQb3NpdGlvbihpbmRleCkpO1xuICAvLyB9XG5cbiAgdXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoaW5kZXhlcykge1xuICAgIHRoaXMuX2Rpc2FibGVkUG9zaXRpb25zID0gaW5kZXhlcztcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm51bWJlclBvc2l0aW9uczsgaW5kZXgrKykge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uc1tpbmRleF07XG4gICAgICBjb25zdCBpc0Rpc2FibGVkID0gaW5kZXhlcy5pbmRleE9mKGluZGV4KSAhPT0gLTE7XG4gICAgICBwb3NpdGlvbi5zZWxlY3RlZCA9IGlzRGlzYWJsZWQgPyB0cnVlIDogZmFsc2U7XG4gICAgICB0aGlzLnNlbGVjdG9yLnVwZGF0ZVBvaW50KHBvc2l0aW9uKTtcbiAgICB9XG4gIH1cblxuICAvLyBkaXNhYmxlUG9zaXRpb24oaW5kZXgpIHtcbiAgLy8gICB0aGlzLl9kaXNhYmxlZFBvc2l0aW9ucy5wdXNoKGluZGV4KTtcbiAgLy8gICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb25zW2luZGV4XTtcblxuICAvLyAgIGlmIChwb3NpdGlvbikge1xuICAvLyAgICAgcG9zaXRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAvLyAgICAgdGhpcy5zZWxlY3Rvci51cGRhdGVQb2ludChwb3NpdGlvbik7XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy8gZW5hYmxlUG9zaXRpb24oaW5kZXgpIHtcbiAgLy8gICBjb25zdCBkaXNhYmxlZEluZGV4ID0gdGhpcy5fZGlzYWJsZWRQb3NpdGlvbnMuaW5kZXhPZihpbmRleCk7XG4gIC8vICAgaWYgKGRpc2FibGVkSW5kZXggIT09IC0xKVxuICAvLyAgICAgdGhpcy5fZGlzYWJsZWRQb3NpdGlvbnMuc3BsaWNlKGRpc2FibGVkSW5kZXgsIDEpO1xuXG4gIC8vICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uc1tpbmRleF07XG5cbiAgLy8gICBpZiAocG9zaXRpb24pIHtcbiAgLy8gICAgIHBvc2l0aW9uLnNlbGVjdGVkID0gZmFsc2U7XG4gIC8vICAgICB0aGlzLnNlbGVjdG9yLnVwZGF0ZVBvaW50KHBvc2l0aW9uKTtcbiAgLy8gICB9XG4gIC8vIH1cblxuICBvblNlbGVjdChjYWxsYmFjaykge1xuICAgIHRoaXMuX29uU2VsZWN0ID0gY2FsbGJhY2s7XG4gIH1cblxuICByZWplY3QoZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICBpZiAoZGlzYWJsZWRQb3NpdGlvbnMubGVuZ3RoID49IHRoaXMubnVtYmVyUG9zaXRpb25zKSB7XG4gICAgICB0aGlzLnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScpO1xuICAgICAgdGhpcy5jb250ZW50LnJlamVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlldy51cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgfVxuICB9XG59XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnBsYWNlcic7XG5cbi8qKlxuICogW2NsaWVudF0gQWxsb3cgdG8gc2VsZWN0IGEgcGxhY2Ugd2l0aGluIGEgc2V0IG9mIHByZWRlZmluZWQgcG9zaXRpb25zIChpLmUuIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJQbGFjZXIuanN+U2VydmVyUGxhY2VyfSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBwbGFjZXIgPSBzb3VuZHdvcmtzLmNsaWVudC5yZXF1aXJlKCdwbGFjZScsIHsgY2FwYWNpdHk6IDEwMCB9KTtcbiAqL1xuY2xhc3MgQ2xpZW50UGxhY2VyIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH0gZGVmYXVsdHMgLSBUaGUgZGVmYXVsdHMgb3B0aW9ucyBvZiB0aGUgc2VydmljZS5cbiAgICAgKiBAYXR0cmlidXRlIHtTdHJpbmd9IFtvcHRpb25zLm1vZGU9J2xpc3QnXSAtIFNlbGVjdGlvbiBtb2RlLiBDYW4gYmU6XG4gICAgICogLSBgJ2dyYXBoaWMnYCB0byBzZWxlY3QgYSBwbGFjZSBvbiBhIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYXZhaWxhYmxlIHBvc2l0aW9ucy5cbiAgICAgKiAtIGAnbGlzdCdgIHRvIHNlbGVjdCBhIHBsYWNlIGFtb25nIGEgbGlzdCBvZiBwbGFjZXMuXG4gICAgICogQGF0dHJpYnV0ZSB7Vmlld30gW29wdGlvbnMudmlldz0nbnVsbCddIC0gVGhlIHZpZXcgb2YgdGhlIHNlcnZpY2UgdG8gYmUgdXNlZCAoQHRvZG8pXG4gICAgICogQGF0dHJpYnV0ZSB7Vmlld30gW29wdGlvbnMudmlldz0nbnVsbCddIC0gVGhlIHZpZXcgY29uc3RydWN0b3Igb2YgdGhlIHNlcnZpY2UgdG8gYmUgdXNlZC4gTXVzdCBpbXBsZW1lbnQgdGhlIGBQbGFjZXJWaWV3YCBpbnRlcmZhY2UuXG4gICAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBbb3B0aW9ucy5wcmlvcml0eT02XSAtIFRoZSBwcmlvcml0eSBvZiB0aGUgdmlldy5cbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG1vZGU6ICdsaXN0JyxcbiAgICAgIHZpZXc6IG51bGwsXG4gICAgICB2aWV3Q3RvcjogbnVsbCxcbiAgICAgIHZpZXdQcmlvcml0eTogNixcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UgPSB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQ2xpZW50Sm9pbmVkID0gdGhpcy5fb25DbGllbnRKb2luZWQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNsaWVudExlYXZlZCA9IHRoaXMuX29uQ2xpZW50TGVhdmVkLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25TZWxlY3QgPSB0aGlzLl9vblNlbGVjdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQ29uZmlybVJlc3BvbnNlID0gdGhpcy5fb25Db25maXJtUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblJlamVjdFJlc3BvbnNlID0gdGhpcy5fb25SZWplY3RSZXNwb25zZS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZSA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBJbmRleCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIExhYmVsIG9mIHRoZSBwb3NpdGlvbiBzZWxlY3RlZCBieSB0aGUgdXNlci5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgLy8gYWxsb3cgdG8gcGFzcyBhbnkgdmlld1xuICAgIGlmICh0aGlzLm9wdGlvbnMudmlldyAhPT0gbnVsbCkge1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudmlld0N0b3IgIT09IG51bGwpXG4gICAgICAgIHRoaXMudmlld0N0b3IgPSB0aGlzLm9wdGlvbnMudmlld0N0b3I7XG4gICAgICBlbHNlIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLm9wdGlvbnMubW9kZSkge1xuICAgICAgICAgIGNhc2UgJ2dyYXBoaWMnOlxuICAgICAgICAgICAgdGhpcy52aWV3Q3RvciA9IF9HcmFwaGljVmlldztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aGlzLnZpZXdDdG9yID0gX0xpc3RWaWV3O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5jb250ZW50Lm1vZGUgPSB0aGlzLm9wdGlvbnMubW9kZTtcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2hvdygpO1xuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdha25vd2xlZ2RlJywgdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UpO1xuICAgIHRoaXMucmVjZWl2ZSgnY29uZmlybScsIHRoaXMuX29uQ29uZmlybVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3JlamVjdCcsIHRoaXMuX29uUmVqZWN0UmVzcG9uc2UpO1xuICAgIHRoaXMucmVjZWl2ZSgnY2xpZW50LWpvaW5lZCcsIHRoaXMuX29uQ2xpZW50Sm9pbmVkKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2NsaWVudC1sZWF2ZWQnLCB0aGlzLl9vbkNsaWVudExlYXZlZCk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdha25vd2xlZ2RlJywgdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NvbmZpcm0nLCB0aGlzLl9vbkNvbmZpcm1SZXNwb25zZSk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigncmVqZWN0JywgdGhpcy5fb25SZWplY3RSZXNwb25zZSk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY2xpZW50LWpvaW5lZCcsIHRoaXMuX29uQ2xpZW50Sm9pbmVkKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjbGllbnQtbGVhdmVkJywgdGhpcy5fb25DbGllbnRMZWF2ZWQpO1xuXG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQWtub3dsZWRnZVJlc3BvbnNlKHNldHVwQ29uZmlnSXRlbSwgZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICBjb25zdCBzZXR1cCA9IHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UuZ2V0KHNldHVwQ29uZmlnSXRlbSk7XG4gICAgY29uc3QgYXJlYSA9IHNldHVwLmFyZWE7XG4gICAgY29uc3QgY2FwYWNpdHkgPSBzZXR1cC5jYXBhY2l0eTtcbiAgICBjb25zdCBsYWJlbHMgPSBzZXR1cC5sYWJlbHM7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcztcbiAgICBjb25zdCBtYXhDbGllbnRzUGVyUG9zaXRpb24gPSBzZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb247XG5cbiAgICBpZiAoYXJlYSlcbiAgICAgIHRoaXMudmlldy5zZXRBcmVhKGFyZWEpO1xuXG4gICAgdGhpcy52aWV3LmRpc3BsYXlQb3NpdGlvbnMoY2FwYWNpdHksIGxhYmVscywgY29vcmRpbmF0ZXMsIG1heENsaWVudHNQZXJQb3NpdGlvbik7XG4gICAgdGhpcy52aWV3LnVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgICB0aGlzLnZpZXcub25TZWxlY3QodGhpcy5fb25TZWxlY3QpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblNlbGVjdChpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSB7XG4gICAgdGhpcy5zZW5kKCdwb3NpdGlvbicsIGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkNvbmZpcm1SZXNwb25zZShpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSB7XG4gICAgY2xpZW50LmluZGV4ID0gdGhpcy5pbmRleCA9IGluZGV4O1xuICAgIGNsaWVudC5sYWJlbCA9IHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25DbGllbnRKb2luZWQoZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICB0aGlzLnZpZXcudXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkNsaWVudExlYXZlZChkaXNhYmxlZFBvc2l0aW9ucykge1xuICAgIHRoaXMudmlldy51cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhkaXNhYmxlZFBvc2l0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uUmVqZWN0UmVzcG9uc2UoZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICB0aGlzLnZpZXcucmVqZWN0KGRpc2FibGVkUG9zaXRpb25zKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBDbGllbnRQbGFjZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBDbGllbnRQbGFjZXI7XG4iXX0=