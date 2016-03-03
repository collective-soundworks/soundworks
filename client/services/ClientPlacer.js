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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50UGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBQW1CLGdCQUFnQjs7OzsyQkFDZixpQkFBaUI7Ozs7a0NBQ1Ysd0JBQXdCOzs7Ozs7aUNBRTVCLHVCQUF1Qjs7OztnQ0FDeEIsc0JBQXNCOzs7O2tDQUNwQix3QkFBd0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBMEMxQyxTQUFTO1lBQVQsU0FBUzs7QUFDRixXQURQLFNBQVMsQ0FDRCxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7MEJBRDVDLFNBQVM7O0FBRVgsK0JBRkUsU0FBUyw2Q0FFTCxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7O0FBRTFDLFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzlEOztlQUxHLFNBQVM7O1dBT0ssNEJBQUMsQ0FBQyxFQUFFOzs7QUFDcEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQzVCLFVBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QixVQUFJLENBQUMsYUFBYSxDQUFDO0FBQ2pCLG9CQUFZLEVBQUUsa0JBQUMsQ0FBQyxFQUFLO0FBQ25CLGNBQU0sUUFBUSxHQUFHLE1BQUssUUFBUSxDQUFDLEtBQUssQ0FBQzs7QUFFckMsY0FBSSxRQUFRLEVBQ1YsTUFBSyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN4RTtPQUNGLENBQUMsQ0FBQztLQUNKOzs7V0FFTSxpQkFBQyxJ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QyxVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDZDs7Ozs7V0FHYyx5QkFBQyxpQkFBaUIsRUFBRTtBQUNqQyxVQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FDdEQ7Ozs7O1dBR2MseUJBQUMsaUJBQWlCLEVBQUU7QUFDakMsVUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ3REOzs7OztXQUdnQiwyQkFBQyxpQkFBaUIsRUFBRTtBQUNuQyxVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ3JDOzs7U0E1SUcsWUFBWTs7O0FBK0lsQixnQ0FBZSxRQUFRLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDOztxQkFFbkMsWUFBWSIsImZpbGUiOiIvVXNlcnMvbWF0dXN6ZXdza2kvZGV2L2Nvc2ltYS9saWIvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudFBsYWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbi8vIGltcG9ydCBsb2NhbFN0b3JhZ2UgZnJvbSAnLi9sb2NhbFN0b3JhZ2UnO1xuaW1wb3J0IFNlbGVjdFZpZXcgZnJvbSAnLi4vZGlzcGxheS9TZWxlY3RWaWV3JztcbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi4vZGlzcGxheS9TcGFjZVZpZXcnO1xuaW1wb3J0IFNxdWFyZWRWaWV3IGZyb20gJy4uL2Rpc3BsYXkvU3F1YXJlZFZpZXcnO1xuXG4vLyAgLyoqXG4vLyAgICogSW50ZXJmYWNlIG9mIHRoZSB2aWV3IG9mIHRoZSBwbGFjZXIuXG4vLyAgICovXG4vLyAgY2xhc3MgQWJzdGFjdFBsYWNlclZpZXcgZXh0ZW5kcyBzb3VuZHdvcmtzLmRpc3BsYXkuVmlldyB7XG4vLyAgICAvKipcbi8vICAgICAqIEBwYXJhbSB7TnVtYmVyfSBjYXBhY2l0eSAtIFRoZSBtYXhpbXVtIG51bWJlciBvZiBjbGllbnRzIGFsbG93ZWQuXG4vLyAgICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IFtsYWJlbHM9bnVsbF0gLSBBbiBhcnJheSBvZiB0aGUgbGFiZWxzIGZvciB0aGUgcG9zaXRpb25zXG4vLyAgICAgKiBAcGFyYW0ge0FycmF5PEFycmF5PE51bWJlcj4+fSBbY29vcmRpbmF0ZXM9bnVsbF0gLSBBbiBhcnJheSBvZiB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHBvc2l0aW9uc1xuLy8gICAgICogQHBhcmFtIHtOdW1iZXJ9IFttYXhDbGllbnRzUGVyUG9zaXRpb249MV0gLSBUaGUgbnVtYmVyIG9mIGNsaWVudCBhbGxvd2VkIGZvciBlYWNoIHBvc2l0aW9uLlxuLy8gICAgICovXG4vLyAgICBkaXNwbGF5UG9zaXRpb25zKGNhcGFjaXR5LCBsYWJlbHMgPSBudWxsLCBjb29yZGluYXRlcyA9IG51bGwsIG1heENsaWVudHNQZXJQb3NpdGlvbiA9IDEpIHt9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBAcGFyYW0ge0FycmF5PE51bWJlcj59IGRpc2FibGVkSW5kZXhlcyAtIEFycmF5IG9mIGluZGV4ZXMgb2YgdGhlIGRpc2FibGVkIHBvc2l0aW9ucy5cbi8vICAgICAqL1xuLy8gICAgdXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoZGlzYWJsZWRJbmRleGVzKSB7fVxuLy9cbi8vICAgIC8qKlxuLy8gICAgICogQ2FsbGVkIHdoZW4gbm8gcGxhY2UgbGVmdCBvciB3aGVuIHRoZSBjaG9pY2Ugb2YgdGhlIHVzZXIgYXMgYmVlbiByZWplY3RlZCBieVxuLy8gICAgICogdGhlIHNlcnZlci4gVGhlIHZpZXcgc2hvdWxkIGJlIHNob3VsZCB1cGRhdGUgYWNjb3JkaW5nbHkuXG4vLyAgICAgKiBAcGFyYW0ge0FycmF5PE51bWJlcj59IGRpc2FibGVkSW5kZXhlcyAtIEFycmF5IG9mIGluZGV4ZXMgb2YgdGhlIGRpc2FibGVkIHBvc2l0aW9ucy5cbi8vICAgICAqL1xuLy8gICAgcmVqZWN0KGRpc2FibGVkSW5kZXhlcykge31cbi8vXG4vLyAgICAgLyoqXG4vLyAgICAgKiBSZWdpc3RlciB0aGUgYXJlYSBkZWZpbml0aW9uIHRvIHRoZSB2aWV3LlxuLy8gICAgICogQHBhcmFtIHtPYmplY3R9IGFyZWEgLSBUaGUgZGVmaW5pdGlvbiBvZiB0aGUgYXJlYS5cbi8vICAgICAqL1xuLy8gICAgc2V0QXJlYShhcmVhKSB7XG4vLyAgICAgIHRoaXMuX2FyZWEgPSBhcmVhO1xuLy8gICAgfVxuLy9cbi8vICAgIC8qKlxuLy8gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBiZSBhcHBsaWVkIHdoZW4gYSBwb3NpdGlvbiBpcyBzZWxlY3RlZC5cbi8vICAgICAqL1xuLy8gICAgb25TZWxlY3QoY2FsbGJhY2spIHtcbi8vICAgICAgdGhpcy5fb25TZWxlY3QgPSBjYWxsYmFjaztcbi8vICAgIH1cbi8vICB9XG5cbmNsYXNzIF9MaXN0VmlldyBleHRlbmRzIFNxdWFyZWRWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucykge1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UgPSB0aGlzLl9vblNlbGVjdGlvbkNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgX29uU2VsZWN0aW9uQ2hhbmdlKGUpIHtcbiAgICB0aGlzLmNvbnRlbnQuc2hvd0J0biA9IHRydWU7XG4gICAgdGhpcy5yZW5kZXIoJy5zZWN0aW9uLWZsb2F0Jyk7XG4gICAgdGhpcy5pbnN0YWxsRXZlbnRzKHtcbiAgICAgICdjbGljayAuYnRuJzogKGUpID0+IHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNlbGVjdG9yLnZhbHVlO1xuXG4gICAgICAgIGlmIChwb3NpdGlvbilcbiAgICAgICAgICB0aGlzLl9vblNlbGVjdChwb3NpdGlvbi5pbmRleCwgcG9zaXRpb24ubGFiZWwsIHBvc2l0aW9uLmNvb3JkaW5hdGVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldEFyZWEoYXJlYSkgeyAvKiBubyBuZWVkIGZvciBhcmVhICovIH1cblxuICBkaXNwbGF5UG9zaXRpb25zKGNhcGFjaXR5LCBsYWJlbHMgPSBudWxsLCBjb29yZGluYXRlcyA9IG51bGwsIG1heENsaWVudHNQZXJQb3NpdGlvbiA9IDEpIHtcbiAgICB0aGlzLnBvc2l0aW9ucyA9IFtdO1xuICAgIHRoaXMubnVtYmVyUG9zaXRpb25zID0gY2FwYWNpdHkgLyBtYXhDbGllbnRzUGVyUG9zaXRpb247XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5udW1iZXJQb3NpdGlvbnM7IGluZGV4KyspIHtcbiAgICAgIGNvbnN0IGxhYmVsID0gbGFiZWxzICE9PSBudWxsID8gbGFiZWxzW2luZGV4XSA6IChpbmRleCArIDEpLnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHsgaW5kZXg6IGluZGV4LCBsYWJlbDogbGFiZWwgfTtcblxuICAgICAgaWYgKGNvb3JkaW5hdGVzKVxuICAgICAgICBwb3NpdGlvbi5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzW2luZGV4XTtcblxuICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaChwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3RvciA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGluc3RydWN0aW9uczogdGhpcy5jb250ZW50Lmluc3RydWN0aW9ucyxcbiAgICAgIGVudHJpZXM6IHRoaXMucG9zaXRpb25zLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnLCB0aGlzLnNlbGVjdG9yKTtcbiAgICB0aGlzLnJlbmRlcignLnNlY3Rpb24tc3F1YXJlJyk7XG5cbiAgICB0aGlzLnNlbGVjdG9yLmluc3RhbGxFdmVudHMoe1xuICAgICAgJ2NoYW5nZSc6IHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlLFxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoaW5kZXhlcykge1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm51bWJlclBvc2l0aW9uczsgaW5kZXgrKykge1xuICAgICAgaWYgKGluZGV4ZXMuaW5kZXhPZihpbmRleCkgPT09IC0xKVxuICAgICAgICB0aGlzLnNlbGVjdG9yLmVuYWJsZUluZGV4KGluZGV4KTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5zZWxlY3Rvci5kaXNhYmxlSW5kZXgoaW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIG9uU2VsZWN0KGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fb25TZWxlY3QgPSBjYWxsYmFjaztcbiAgfVxuXG4gIHJlamVjdChkaXNhYmxlZFBvc2l0aW9ucykge1xuICAgIGlmIChkaXNhYmxlZFBvc2l0aW9ucy5sZW5ndGggPj0gdGhpcy5udW1iZXJQb3NpdGlvbnMpIHtcbiAgICAgIHRoaXMuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tc3F1YXJlJyk7XG4gICAgICB0aGlzLmNvbnRlbnQucmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXNhYmxlUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgX0dyYXBoaWNWaWV3IGV4dGVuZHMgU3F1YXJlZFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9hcmVhID0gbnVsbDtcbiAgICB0aGlzLl9kaXNhYmxlZFBvc2l0aW9ucyA9IFtdO1xuICAgIHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlID0gdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIF9vblNlbGVjdGlvbkNoYW5nZShlKSB7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNlbGVjdG9yLnNoYXBlUG9pbnRNYXAuZ2V0KGUudGFyZ2V0KTtcbiAgICBjb25zdCBkaXNhYmxlZEluZGV4ID0gdGhpcy5fZGlzYWJsZWRQb3NpdGlvbnMuaW5kZXhPZihwb3NpdGlvbi5pbmRleCk7XG5cbiAgICBpZiAoZGlzYWJsZWRJbmRleCA9PT0gLTEpXG4gICAgICB0aGlzLl9vblNlbGVjdChwb3NpdGlvbi5pZCwgcG9zaXRpb24ubGFiZWwsIFtwb3NpdGlvbi54LCBwb3NpdGlvbi55XSk7XG4gIH1cblxuICBzZXRBcmVhKGFyZWEpIHtcbiAgICB0aGlzLl9hcmVhID0gYXJlYTtcbiAgfVxuXG4gIGRpc3BsYXlQb3NpdGlvbnMoY2FwYWNpdHksIGxhYmVscyA9IG51bGwsIGNvb3JkaW5hdGVzID0gbnVsbCwgbWF4Q2xpZW50c1BlclBvc2l0aW9uID0gMSkge1xuICAgIHRoaXMubnVtYmVyUG9zaXRpb25zID0gY2FwYWNpdHkgLyBtYXhDbGllbnRzUGVyUG9zaXRpb247XG4gICAgdGhpcy5wb3NpdGlvbnMgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1iZXJQb3NpdGlvbnM7IGkrKykge1xuICAgICAgY29uc3QgbGFiZWwgPSBsYWJlbHMgIT09IG51bGwgPyBsYWJlbHNbaV0gOiAoaSArIDEpLnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHsgaWQ6IGksIGxhYmVsOiBsYWJlbCB9O1xuICAgICAgY29uc3QgY29vcmRzID0gY29vcmRpbmF0ZXNbaV07XG4gICAgICBwb3NpdGlvbi54ID0gY29vcmRzWzBdO1xuICAgICAgcG9zaXRpb24ueSA9IGNvb3Jkc1sxXTtcblxuICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaChwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3RvciA9IG5ldyBTcGFjZVZpZXcoKTtcbiAgICB0aGlzLnNlbGVjdG9yLnNldEFyZWEodGhpcy5fYXJlYSk7XG4gICAgdGhpcy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnLCB0aGlzLnNlbGVjdG9yKTtcbiAgICB0aGlzLnJlbmRlcignLnNlY3Rpb24tc3F1YXJlJyk7XG5cbiAgICB0aGlzLnNlbGVjdG9yLnNldFBvaW50cyh0aGlzLnBvc2l0aW9ucyk7XG5cbiAgICB0aGlzLnNlbGVjdG9yLmluc3RhbGxFdmVudHMoe1xuICAgICAgJ2NsaWNrIC5wb2ludCc6IHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlXG4gICAgfSk7XG4gIH1cblxuICAvLyBkaXNhYmxlUG9zaXRpb25zKGluZGV4ZXMpIHtcbiAgLy8gICB0aGlzLl9kaXNhYmxlZFBvc2l0aW9ucyA9IGluZGV4ZXM7XG4gIC8vICAgaW5kZXhlcy5mb3JFYWNoKChpbmRleCkgPT4gdGhpcy5kaXNhYmxlUG9zaXRpb24oaW5kZXgpKTtcbiAgLy8gfVxuXG4gIHVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGluZGV4ZXMpIHtcbiAgICB0aGlzLl9kaXNhYmxlZFBvc2l0aW9ucyA9IGluZGV4ZXM7XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5udW1iZXJQb3NpdGlvbnM7IGluZGV4KyspIHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbnNbaW5kZXhdO1xuICAgICAgY29uc3QgaXNEaXNhYmxlZCA9IGluZGV4ZXMuaW5kZXhPZihpbmRleCkgIT09IC0xO1xuICAgICAgcG9zaXRpb24uc2VsZWN0ZWQgPSBpc0Rpc2FibGVkID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgdGhpcy5zZWxlY3Rvci51cGRhdGVQb2ludChwb3NpdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLy8gZGlzYWJsZVBvc2l0aW9uKGluZGV4KSB7XG4gIC8vICAgdGhpcy5fZGlzYWJsZWRQb3NpdGlvbnMucHVzaChpbmRleCk7XG4gIC8vICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uc1tpbmRleF07XG5cbiAgLy8gICBpZiAocG9zaXRpb24pIHtcbiAgLy8gICAgIHBvc2l0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgLy8gICAgIHRoaXMuc2VsZWN0b3IudXBkYXRlUG9pbnQocG9zaXRpb24pO1xuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8vIGVuYWJsZVBvc2l0aW9uKGluZGV4KSB7XG4gIC8vICAgY29uc3QgZGlzYWJsZWRJbmRleCA9IHRoaXMuX2Rpc2FibGVkUG9zaXRpb25zLmluZGV4T2YoaW5kZXgpO1xuICAvLyAgIGlmIChkaXNhYmxlZEluZGV4ICE9PSAtMSlcbiAgLy8gICAgIHRoaXMuX2Rpc2FibGVkUG9zaXRpb25zLnNwbGljZShkaXNhYmxlZEluZGV4LCAxKTtcblxuICAvLyAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbnNbaW5kZXhdO1xuXG4gIC8vICAgaWYgKHBvc2l0aW9uKSB7XG4gIC8vICAgICBwb3NpdGlvbi5zZWxlY3RlZCA9IGZhbHNlO1xuICAvLyAgICAgdGhpcy5zZWxlY3Rvci51cGRhdGVQb2ludChwb3NpdGlvbik7XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgb25TZWxlY3QoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9vblNlbGVjdCA9IGNhbGxiYWNrO1xuICB9XG5cbiAgcmVqZWN0KGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgaWYgKGRpc2FibGVkUG9zaXRpb25zLmxlbmd0aCA+PSB0aGlzLm51bWJlclBvc2l0aW9ucykge1xuICAgICAgdGhpcy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnKTtcbiAgICAgIHRoaXMuY29udGVudC5yZWplY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZpZXcudXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgIH1cbiAgfVxufVxuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpwbGFjZXInO1xuXG4vKipcbiAqIFtjbGllbnRdIEFsbG93IHRvIHNlbGVjdCBhIHBsYWNlIHdpdGhpbiBhIHNldCBvZiBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoaS5lLiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyUGxhY2VyLmpzflNlcnZlclBsYWNlcn0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgcGxhY2VyID0gc291bmR3b3Jrcy5jbGllbnQucmVxdWlyZSgncGxhY2UnLCB7IGNhcGFjaXR5OiAxMDAgfSk7XG4gKi9cbmNsYXNzIENsaWVudFBsYWNlciBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtPYmplY3R9IGRlZmF1bHRzIC0gVGhlIGRlZmF1bHRzIG9wdGlvbnMgb2YgdGhlIHNlcnZpY2UuXG4gICAgICogQGF0dHJpYnV0ZSB7U3RyaW5nfSBbb3B0aW9ucy5tb2RlPSdsaXN0J10gLSBTZWxlY3Rpb24gbW9kZS4gQ2FuIGJlOlxuICAgICAqIC0gYCdncmFwaGljJ2AgdG8gc2VsZWN0IGEgcGxhY2Ugb24gYSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGF2YWlsYWJsZSBwb3NpdGlvbnMuXG4gICAgICogLSBgJ2xpc3QnYCB0byBzZWxlY3QgYSBwbGFjZSBhbW9uZyBhIGxpc3Qgb2YgcGxhY2VzLlxuICAgICAqIEBhdHRyaWJ1dGUge1ZpZXd9IFtvcHRpb25zLnZpZXc9J251bGwnXSAtIFRoZSB2aWV3IG9mIHRoZSBzZXJ2aWNlIHRvIGJlIHVzZWQgKEB0b2RvKVxuICAgICAqIEBhdHRyaWJ1dGUge1ZpZXd9IFtvcHRpb25zLnZpZXc9J251bGwnXSAtIFRoZSB2aWV3IGNvbnN0cnVjdG9yIG9mIHRoZSBzZXJ2aWNlIHRvIGJlIHVzZWQuIE11c3QgaW1wbGVtZW50IHRoZSBgUGxhY2VyVmlld2AgaW50ZXJmYWNlLlxuICAgICAqIEBhdHRyaWJ1dGUge051bWJlcn0gW29wdGlvbnMucHJpb3JpdHk9Nl0gLSBUaGUgcHJpb3JpdHkgb2YgdGhlIHZpZXcuXG4gICAgICovXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBtb2RlOiAnbGlzdCcsXG4gICAgICB2aWV3OiBudWxsLFxuICAgICAgdmlld0N0b3I6IG51bGwsXG4gICAgICB2aWV3UHJpb3JpdHk6IDYsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlID0gdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNsaWVudEpvaW5lZCA9IHRoaXMuX29uQ2xpZW50Sm9pbmVkLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25DbGllbnRMZWF2ZWQgPSB0aGlzLl9vbkNsaWVudExlYXZlZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNvbmZpcm1SZXNwb25zZSA9IHRoaXMuX29uQ29uZmlybVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25SZWplY3RSZXNwb25zZSA9IHRoaXMuX29uUmVqZWN0UmVzcG9uc2UuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgLyoqXG4gICAgICogSW5kZXggb2YgdGhlIHBvc2l0aW9uIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5pbmRleCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuICAgIC8vIGFsbG93IHRvIHBhc3MgYW55IHZpZXdcbiAgICBpZiAodGhpcy5vcHRpb25zLnZpZXcgIT09IG51bGwpIHtcblxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnZpZXdDdG9yICE9PSBudWxsKVxuICAgICAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgICAgZWxzZSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5vcHRpb25zLm1vZGUpIHtcbiAgICAgICAgICBjYXNlICdncmFwaGljJzpcbiAgICAgICAgICAgIHRoaXMudmlld0N0b3IgPSBfR3JhcGhpY1ZpZXc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdsaXN0JzpcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhpcy52aWV3Q3RvciA9IF9MaXN0VmlldztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29udGVudC5tb2RlID0gdGhpcy5vcHRpb25zLm1vZGU7XG4gICAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNob3coKTtcbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnYWtub3dsZWdkZScsIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2NvbmZpcm0nLCB0aGlzLl9vbkNvbmZpcm1SZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdyZWplY3QnLCB0aGlzLl9vblJlamVjdFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2NsaWVudC1qb2luZWQnLCB0aGlzLl9vbkNsaWVudEpvaW5lZCk7XG4gICAgdGhpcy5yZWNlaXZlKCdjbGllbnQtbGVhdmVkJywgdGhpcy5fb25DbGllbnRMZWF2ZWQpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignYWtub3dsZWdkZScsIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjb25maXJtJywgdGhpcy5fb25Db25maXJtUmVzcG9uc2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3JlamVjdCcsIHRoaXMuX29uUmVqZWN0UmVzcG9uc2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NsaWVudC1qb2luZWQnLCB0aGlzLl9vbkNsaWVudEpvaW5lZCk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY2xpZW50LWxlYXZlZCcsIHRoaXMuX29uQ2xpZW50TGVhdmVkKTtcblxuICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkFrbm93bGVkZ2VSZXNwb25zZShzZXR1cENvbmZpZ0l0ZW0sIGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgY29uc3Qgc2V0dXAgPSB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlLmdldChzZXR1cENvbmZpZ0l0ZW0pO1xuICAgIGNvbnN0IGFyZWEgPSBzZXR1cC5hcmVhO1xuICAgIGNvbnN0IGNhcGFjaXR5ID0gc2V0dXAuY2FwYWNpdHk7XG4gICAgY29uc3QgbGFiZWxzID0gc2V0dXAubGFiZWxzO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXM7XG4gICAgY29uc3QgbWF4Q2xpZW50c1BlclBvc2l0aW9uID0gc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uO1xuXG4gICAgaWYgKGFyZWEpXG4gICAgICB0aGlzLnZpZXcuc2V0QXJlYShhcmVhKTtcblxuICAgIHRoaXMudmlldy5kaXNwbGF5UG9zaXRpb25zKGNhcGFjaXR5LCBsYWJlbHMsIGNvb3JkaW5hdGVzLCBtYXhDbGllbnRzUGVyUG9zaXRpb24pO1xuICAgIHRoaXMudmlldy51cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgdGhpcy52aWV3Lm9uU2VsZWN0KHRoaXMuX29uU2VsZWN0KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25TZWxlY3QoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykge1xuICAgIHRoaXMuc2VuZCgncG9zaXRpb24nLCBpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Db25maXJtUmVzcG9uc2UoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykge1xuICAgIGNsaWVudC5pbmRleCA9IHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICBjbGllbnQubGFiZWwgPSB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQ2xpZW50Sm9pbmVkKGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgdGhpcy52aWV3LnVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25DbGllbnRMZWF2ZWQoZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICB0aGlzLnZpZXcudXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlamVjdFJlc3BvbnNlKGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgdGhpcy52aWV3LnJlamVjdChkaXNhYmxlZFBvc2l0aW9ucyk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2xpZW50UGxhY2VyKTtcblxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50UGxhY2VyO1xuIl19