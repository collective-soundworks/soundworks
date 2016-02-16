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
//    /**
//     * Optionnaly set the area if needed.
//     */
//    setArea(area) {}
//
//    /**
//     * Called when no avaible position.
//     */
//    reject() {}
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
    value: function displayPositions(capacity, labels, coordinates) {
      this.capacity = capacity;
      this.positions = [];

      for (var i = 0; i < capacity; i++) {
        var label = labels !== null ? labels[i] : (i + 1).toString();
        var position = { index: i, label: label };

        if (coordinates) position.coordinates = coordinates[i];

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
    key: 'disablePositions',
    value: function disablePositions(indexes) {
      var _this2 = this;

      indexes.forEach(function (index) {
        return _this2.selector.disableIndex(index);
      });
    }
  }, {
    key: 'disablePosition',
    value: function disablePosition(index) {
      this.selector.disableIndex(index);
    }
  }, {
    key: 'enablePosition',
    value: function enablePosition(index) {
      this.selector.enableIndex(index);
    }
  }, {
    key: 'onSelect',
    value: function onSelect(callback) {
      this._onSelect = callback;
    }
  }, {
    key: 'reject',
    value: function reject(disabledPositions) {
      if (disabledPositions.length >= this.capacity) {
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
    value: function displayPositions(capacity, labels, coordinates) {
      this.positions = [];

      for (var i = 0; i < capacity; i++) {
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
  }, {
    key: 'disablePositions',
    value: function disablePositions(indexes) {
      var _this3 = this;

      this._disabledPositions = this._disabledPositions.concat(indexes);
      indexes.forEach(function (index) {
        return _this3.disablePosition(index);
      });
    }
  }, {
    key: 'disablePosition',
    value: function disablePosition(index) {
      this._disabledPositions.push(index);
      var position = this.positions[index];

      if (position) {
        position.selected = true;
        this.selector.updatePoint(position);
      }
    }
  }, {
    key: 'enablePosition',
    value: function enablePosition(index) {
      var disabledIndex = this._disabledPositions.indexOf(index);
      if (disabledIndex !== -1) this._disabledPositions.splice(disabledIndex, 1);

      var position = this.positions[index];

      if (position) {
        position.selected = false;
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
      if (disabledPositions.length >= this.capacity) {
        this.setViewComponent('.section-square');
        this.content.rejected = true;
        this.render();
      } else {
        this.disablePositions(disabledPositions);
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

    this._onSetupResponse = this._onSetupResponse.bind(this);
    this._onEnableIndex = this._onEnableIndex.bind(this);
    this._onDisableIndex = this._onDisableIndex.bind(this);
    this._onSelect = this._onSelect.bind(this);
    this._onConfirmResponse = this._onConfirmResponse.bind(this);
    this._onRejectResponse = this._onRejectResponse.bind(this);
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
      // request informations about the setup.
      this.send('request');

      this.receive('setup', this._onSetupResponse);
      this.receive('confirm', this._onConfirmResponse);
      this.receive('reject', this._onRejectResponse);
      this.receive('enable-index', this._onEnableIndex);
      this.receive('disable-index', this._onDisableIndex);
    }

    /** @inheritdoc */
  }, {
    key: 'stop',
    value: function stop() {
      this.removeListener('setup', this._onSetupResponse);
      this.removeListener('confirm', this._onConfirmResponse);
      this.removeListener('reject', this._onRejectResponse);
      this.removeListener('enable-index', this._onEnableIndex);
      this.removeListener('disable-index', this._onDisableIndex);

      this.hide();
    }

    /** @private */
  }, {
    key: '_onSetupResponse',
    value: function _onSetupResponse(capacity, labels, coordinates, area, disabledPositions) {
      var numLabels = labels ? labels.length : Infinity;
      var numCoordinates = coordinates ? coordinates.length : Infinity;
      this.capacity = Math.min(numLabels, numCoordinates);

      if (this.capacity > capacity) this.capacity = capacity;

      if (area) this.view.setArea(area);

      this.view.displayPositions(this.capacity, labels, coordinates);
      this.view.disablePositions(disabledPositions);
      this.view.onSelect(this._onSelect);
    }

    /** @private */
  }, {
    key: '_onEnableIndex',
    value: function _onEnableIndex(index) {
      this.view.enablePosition(index);
    }

    /** @private */
  }, {
    key: '_onDisableIndex',
    value: function _onDisableIndex(index) {
      this.view.disablePosition(index);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50UGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBQW1CLGdCQUFnQjs7OzsyQkFDZixpQkFBaUI7Ozs7a0NBQ1Ysd0JBQXdCOzs7Ozs7aUNBRTVCLHVCQUF1Qjs7OztnQ0FDeEIsc0JBQXNCOzs7O2tDQUNwQix3QkFBd0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE0QzFDLFNBQVM7WUFBVCxTQUFTOztBQUNGLFdBRFAsU0FBUyxDQUNELFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTswQkFENUMsU0FBUzs7QUFFWCwrQkFGRSxTQUFTLDZDQUVMLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTs7QUFFMUMsUUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDOUQ7O2VBTEcsU0FBUzs7V0FPSyw0QkFBQyxDQUFDLEVBQUU7OztBQUNwQixVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDNUIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzlCLFVBQUksQ0FBQyxhQUFhLENBQUM7QUFDakIsb0JBQVksRUFBRSxrQkFBQyxDQUFDLEVBQUs7QUFDbkIsY0FBTSxRQUFRLEdBQUcsTUFBSyxRQUFRLENBQUMsS0FBSyxDQUFDOztBQUVyQyxjQUFJLFFBQVEsRUFDVixNQUFLLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3hFO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7OztXQUVNLGlCQUFDLElBQUksRUFBRSx3QkFBMEI7OztXQUV4QiwwQkFBQyxRQUFRLEVBQUUsTUFB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RSxXQUFXLEVBQUU7QUFDbkMsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztLQUNsRDs7Ozs7V0FHaUIsNEJBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7QUFDNUMsOEJBQU8sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ2xDLDhCQUFPLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNsQyw4QkFBTyxXQUFXLEdBQUcsV0FBVyxDQUFDOztBQUVqQyxVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDZDs7Ozs7V0FHZ0IsMkJBQUMsaUJBQWlCLEVBQUU7QUFDbkMsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUNyQzs7O1NBM0lHLFlBQVk7OztBQThJbEIsZ0NBQWUsUUFBUSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQzs7cUJBRW5DLFlBQVkiLCJmaWxlIjoic3JjL2NsaWVudC9zZXJ2aWNlcy9DbGllbnRQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG4vLyBpbXBvcnQgbG9jYWxTdG9yYWdlIGZyb20gJy4vbG9jYWxTdG9yYWdlJztcbmltcG9ydCBTZWxlY3RWaWV3IGZyb20gJy4uL2Rpc3BsYXkvU2VsZWN0Vmlldyc7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4uL2Rpc3BsYXkvU3BhY2VWaWV3JztcbmltcG9ydCBTcXVhcmVkVmlldyBmcm9tICcuLi9kaXNwbGF5L1NxdWFyZWRWaWV3JztcblxuLy8gIC8qKlxuLy8gICAqIEludGVyZmFjZSBvZiB0aGUgdmlldyBvZiB0aGUgcGxhY2VyLlxuLy8gICAqL1xuLy8gIGNsYXNzIEFic3RhY3RQbGFjZXJWaWV3IGV4dGVuZHMgc291bmR3b3Jrcy5kaXNwbGF5LlZpZXcge1xuLy8gICAgLyoqXG4vLyAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHBvc2l0aW9ucyAtIEFycmF5IG9mIHBvc2l0aW9ucyAoaW5kZXgsIGlkLCBsYWJlbCwgY29vcmRzKVxuLy8gICAgICovXG4vLyAgICBkaXNwbGF5UG9zaXRpb25zKHBvc2l0aW9ucykge31cbi8vXG4vLyAgICAvKipcbi8vICAgICAqIEBwYXJhbSB7QXJyYXk8TnVtYmVyPn0gcG9zaXRpb25zIC0gQXJyYXkgb2YgaW5kZXhlcyBvZiB0aGUgcG9zaXRpb25zIHRvIGRpc2FibGUuXG4vLyAgICAgKi9cbi8vICAgIGRpc2FibGVQb3NpdGlvbnMoaW5kZXhlcykge31cbi8vXG4vLyAgICAvKipcbi8vICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbnMgLSBJbmRleCBvZiB0aGUgcG9zaXRpb24gdG8gZGlzYWJsZWQuXG4vLyAgICAgKi9cbi8vICAgIGRpc2FibGVQb3NpdGlvbihpbmRleCkge31cbi8vXG4vLyAgICAvKipcbi8vICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbnMgLSBJbmRleCBvZiB0aGUgcG9zaXRpb24gdG8gZW5hYmxlLlxuLy8gICAgICovXG4vLyAgICBlbmFibGVQb3NpdGlvbihpbmRleCkge31cbi8vXG4vLyAgICAvKipcbi8vICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gYmUgYXBwbGllZCB3aGVuIGEgcG9zaXRpb24gaXMgc2VsZWN0ZWQuXG4vLyAgICAgKi9cbi8vICAgIG9uU2VsZWN0KGNhbGxiYWNrKSB7XG4vLyAgICAgIHRoaXMuX29uU2VsZWN0ID0gY2FsbGJhY2s7XG4vLyAgICB9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBPcHRpb25uYWx5IHNldCB0aGUgYXJlYSBpZiBuZWVkZWQuXG4vLyAgICAgKi9cbi8vICAgIHNldEFyZWEoYXJlYSkge31cbi8vXG4vLyAgICAvKipcbi8vICAgICAqIENhbGxlZCB3aGVuIG5vIGF2YWlibGUgcG9zaXRpb24uXG4vLyAgICAgKi9cbi8vICAgIHJlamVjdCgpIHt9XG4vLyAgfVxuXG5jbGFzcyBfTGlzdFZpZXcgZXh0ZW5kcyBTcXVhcmVkVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpIHtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlID0gdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIF9vblNlbGVjdGlvbkNoYW5nZShlKSB7XG4gICAgdGhpcy5jb250ZW50LnNob3dCdG4gPSB0cnVlO1xuICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1mbG9hdCcpO1xuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAnY2xpY2sgLmJ0bic6IChlKSA9PiB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5zZWxlY3Rvci52YWx1ZTtcblxuICAgICAgICBpZiAocG9zaXRpb24pXG4gICAgICAgICAgdGhpcy5fb25TZWxlY3QocG9zaXRpb24uaW5kZXgsIHBvc2l0aW9uLmxhYmVsLCBwb3NpdGlvbi5jb29yZGluYXRlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXRBcmVhKGFyZWEpIHsgLyogbm8gbmVlZCBmb3IgYXJlYSAqLyB9XG5cbiAgZGlzcGxheVBvc2l0aW9ucyhjYXBhY2l0eSwgbGFiZWxzLCBjb29yZGluYXRlcykge1xuICAgIHRoaXMuY2FwYWNpdHkgPSBjYXBhY2l0eTtcbiAgICB0aGlzLnBvc2l0aW9ucyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYXBhY2l0eTsgaSsrKSB7XG4gICAgICBjb25zdCBsYWJlbCA9IGxhYmVscyAhPT0gbnVsbCA/IGxhYmVsc1tpXSA6IChpICsgMSkudG9TdHJpbmcoKTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0geyBpbmRleDogaSwgbGFiZWw6IGxhYmVsIH07XG5cbiAgICAgIGlmIChjb29yZGluYXRlcylcbiAgICAgICAgcG9zaXRpb24uY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlc1tpXTtcblxuICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaChwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3RvciA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGluc3RydWN0aW9uczogdGhpcy5jb250ZW50Lmluc3RydWN0aW9ucyxcbiAgICAgIGVudHJpZXM6IHRoaXMucG9zaXRpb25zLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnLCB0aGlzLnNlbGVjdG9yKTtcbiAgICB0aGlzLnJlbmRlcignLnNlY3Rpb24tc3F1YXJlJyk7XG5cbiAgICB0aGlzLnNlbGVjdG9yLmluc3RhbGxFdmVudHMoe1xuICAgICAgJ2NoYW5nZSc6IHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlLFxuICAgIH0pO1xuICB9XG5cbiAgZGlzYWJsZVBvc2l0aW9ucyhpbmRleGVzKSB7XG4gICAgaW5kZXhlcy5mb3JFYWNoKChpbmRleCkgPT4gdGhpcy5zZWxlY3Rvci5kaXNhYmxlSW5kZXgoaW5kZXgpKTtcbiAgfVxuXG4gIGRpc2FibGVQb3NpdGlvbihpbmRleCkge1xuICAgIHRoaXMuc2VsZWN0b3IuZGlzYWJsZUluZGV4KGluZGV4KTtcbiAgfVxuXG4gIGVuYWJsZVBvc2l0aW9uKGluZGV4KSB7XG4gICAgdGhpcy5zZWxlY3Rvci5lbmFibGVJbmRleChpbmRleCk7XG4gIH1cblxuICBvblNlbGVjdChjYWxsYmFjaykge1xuICAgIHRoaXMuX29uU2VsZWN0ID0gY2FsbGJhY2s7XG4gIH1cblxuICByZWplY3QoZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICBpZiAoZGlzYWJsZWRQb3NpdGlvbnMubGVuZ3RoID49IHRoaXMuY2FwYWNpdHkpIHtcbiAgICAgIHRoaXMuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tc3F1YXJlJyk7XG4gICAgICB0aGlzLmNvbnRlbnQucmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXNhYmxlUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgX0dyYXBoaWNWaWV3IGV4dGVuZHMgU3F1YXJlZFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9hcmVhID0gbnVsbDtcbiAgICB0aGlzLl9kaXNhYmxlZFBvc2l0aW9ucyA9IFtdO1xuICAgIHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlID0gdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIF9vblNlbGVjdGlvbkNoYW5nZShlKSB7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNlbGVjdG9yLnNoYXBlUG9pbnRNYXAuZ2V0KGUudGFyZ2V0KTtcbiAgICBjb25zdCBkaXNhYmxlZEluZGV4ID0gdGhpcy5fZGlzYWJsZWRQb3NpdGlvbnMuaW5kZXhPZihwb3NpdGlvbi5pbmRleCk7XG5cbiAgICBpZiAoZGlzYWJsZWRJbmRleCA9PT0gLTEpXG4gICAgICB0aGlzLl9vblNlbGVjdChwb3NpdGlvbi5pZCwgcG9zaXRpb24ubGFiZWwsIFtwb3NpdGlvbi54LCBwb3NpdGlvbi55XSk7XG4gIH1cblxuICBzZXRBcmVhKGFyZWEpIHtcbiAgICB0aGlzLl9hcmVhID0gYXJlYTtcbiAgfVxuXG4gIGRpc3BsYXlQb3NpdGlvbnMoY2FwYWNpdHksIGxhYmVscywgY29vcmRpbmF0ZXMpIHtcbiAgICB0aGlzLnBvc2l0aW9ucyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYXBhY2l0eTsgaSsrKSB7XG4gICAgICBjb25zdCBsYWJlbCA9IGxhYmVscyAhPT0gbnVsbCA/IGxhYmVsc1tpXSA6IChpICsgMSkudG9TdHJpbmcoKTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0geyBpZDogaSwgbGFiZWw6IGxhYmVsIH07XG4gICAgICBjb25zdCBjb29yZHMgPSBjb29yZGluYXRlc1tpXTtcbiAgICAgIHBvc2l0aW9uLnggPSBjb29yZHNbMF07XG4gICAgICBwb3NpdGlvbi55ID0gY29vcmRzWzFdO1xuXG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdG9yID0gbmV3IFNwYWNlVmlldygpO1xuICAgIHRoaXMuc2VsZWN0b3Iuc2V0QXJlYSh0aGlzLl9hcmVhKTtcbiAgICB0aGlzLnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc2VsZWN0b3IpO1xuICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcblxuICAgIHRoaXMuc2VsZWN0b3Iuc2V0UG9pbnRzKHRoaXMucG9zaXRpb25zKTtcblxuICAgIHRoaXMuc2VsZWN0b3IuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAnY2xpY2sgLnBvaW50JzogdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2VcbiAgICB9KTtcbiAgfVxuXG4gIGRpc2FibGVQb3NpdGlvbnMoaW5kZXhlcykge1xuICAgIHRoaXMuX2Rpc2FibGVkUG9zaXRpb25zID0gdGhpcy5fZGlzYWJsZWRQb3NpdGlvbnMuY29uY2F0KGluZGV4ZXMpO1xuICAgIGluZGV4ZXMuZm9yRWFjaCgoaW5kZXgpID0+IHRoaXMuZGlzYWJsZVBvc2l0aW9uKGluZGV4KSk7XG4gIH1cblxuICBkaXNhYmxlUG9zaXRpb24oaW5kZXgpIHtcbiAgICB0aGlzLl9kaXNhYmxlZFBvc2l0aW9ucy5wdXNoKGluZGV4KTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb25zW2luZGV4XTtcblxuICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgcG9zaXRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5zZWxlY3Rvci51cGRhdGVQb2ludChwb3NpdGlvbik7XG4gICAgfVxuICB9XG5cbiAgZW5hYmxlUG9zaXRpb24oaW5kZXgpIHtcbiAgICBjb25zdCBkaXNhYmxlZEluZGV4ID0gdGhpcy5fZGlzYWJsZWRQb3NpdGlvbnMuaW5kZXhPZihpbmRleCk7XG4gICAgaWYgKGRpc2FibGVkSW5kZXggIT09IC0xKVxuICAgICAgdGhpcy5fZGlzYWJsZWRQb3NpdGlvbnMuc3BsaWNlKGRpc2FibGVkSW5kZXgsIDEpO1xuXG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uc1tpbmRleF07XG5cbiAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgIHBvc2l0aW9uLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLnNlbGVjdG9yLnVwZGF0ZVBvaW50KHBvc2l0aW9uKTtcbiAgICB9XG4gIH1cblxuICBvblNlbGVjdChjYWxsYmFjaykge1xuICAgIHRoaXMuX29uU2VsZWN0ID0gY2FsbGJhY2s7XG4gIH1cblxuICByZWplY3QoZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICBpZiAoZGlzYWJsZWRQb3NpdGlvbnMubGVuZ3RoID49IHRoaXMuY2FwYWNpdHkpIHtcbiAgICAgIHRoaXMuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tc3F1YXJlJyk7XG4gICAgICB0aGlzLmNvbnRlbnQucmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXNhYmxlUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgICB9XG4gIH1cbn1cblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6cGxhY2VyJztcblxuLyoqXG4gKiBbY2xpZW50XSBBbGxvdyB0byBzZWxlY3QgYSBwbGFjZSB3aXRoaW4gYSBzZXQgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGkuZS4gbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlclBsYWNlci5qc35TZXJ2ZXJQbGFjZXJ9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHBsYWNlciA9IHNvdW5kd29ya3MuY2xpZW50LnJlcXVpcmUoJ3BsYWNlJywgeyBjYXBhY2l0eTogMTAwIH0pO1xuICovXG5jbGFzcyBDbGllbnRQbGFjZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fSBkZWZhdWx0cyAtIFRoZSBkZWZhdWx0cyBvcHRpb25zIG9mIHRoZSBzZXJ2aWNlLlxuICAgICAqIEBhdHRyaWJ1dGUge1N0cmluZ30gW29wdGlvbnMubW9kZT0nbGlzdCddIC0gU2VsZWN0aW9uIG1vZGUuIENhbiBiZTpcbiAgICAgKiAtIGAnZ3JhcGhpYydgIHRvIHNlbGVjdCBhIHBsYWNlIG9uIGEgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhdmFpbGFibGUgcG9zaXRpb25zLlxuICAgICAqIC0gYCdsaXN0J2AgdG8gc2VsZWN0IGEgcGxhY2UgYW1vbmcgYSBsaXN0IG9mIHBsYWNlcy5cbiAgICAgKiBAYXR0cmlidXRlIHtWaWV3fSBbb3B0aW9ucy52aWV3PSdudWxsJ10gLSBUaGUgdmlldyBvZiB0aGUgc2VydmljZSB0byBiZSB1c2VkIChAdG9kbylcbiAgICAgKiBAYXR0cmlidXRlIHtWaWV3fSBbb3B0aW9ucy52aWV3PSdudWxsJ10gLSBUaGUgdmlldyBjb25zdHJ1Y3RvciBvZiB0aGUgc2VydmljZSB0byBiZSB1c2VkLiBNdXN0IGltcGxlbWVudCB0aGUgYFBsYWNlclZpZXdgIGludGVyZmFjZS5cbiAgICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IFtvcHRpb25zLnByaW9yaXR5PTZdIC0gVGhlIHByaW9yaXR5IG9mIHRoZSB2aWV3LlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgbW9kZTogJ2xpc3QnLFxuICAgICAgdmlldzogbnVsbCxcbiAgICAgIHZpZXdDdG9yOiBudWxsLFxuICAgICAgdmlld1ByaW9yaXR5OiA2LFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9vblNldHVwUmVzcG9uc2UgPSB0aGlzLl9vblNldHVwUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkVuYWJsZUluZGV4ID0gdGhpcy5fb25FbmFibGVJbmRleC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uRGlzYWJsZUluZGV4ID0gdGhpcy5fb25EaXNhYmxlSW5kZXguYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblNlbGVjdCA9IHRoaXMuX29uU2VsZWN0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Db25maXJtUmVzcG9uc2UgPSB0aGlzLl9vbkNvbmZpcm1SZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uUmVqZWN0UmVzcG9uc2UgPSB0aGlzLl9vblJlamVjdFJlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIC8qKlxuICAgICAqIEluZGV4IG9mIHRoZSBwb3NpdGlvbiBzZWxlY3RlZCBieSB0aGUgdXNlci5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaW5kZXggPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTGFiZWwgb2YgdGhlIHBvc2l0aW9uIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5sYWJlbCA9IG51bGw7XG5cbiAgICAvLyBhbGxvdyB0byBwYXNzIGFueSB2aWV3XG4gICAgaWYgKHRoaXMub3B0aW9ucy52aWV3ICE9PSBudWxsKSB7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy52aWV3Q3RvciAhPT0gbnVsbClcbiAgICAgICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICAgIGVsc2Uge1xuICAgICAgICBzd2l0Y2ggKHRoaXMub3B0aW9ucy5tb2RlKSB7XG4gICAgICAgICAgY2FzZSAnZ3JhcGhpYyc6XG4gICAgICAgICAgICB0aGlzLnZpZXdDdG9yID0gX0dyYXBoaWNWaWV3O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbGlzdCc6XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRoaXMudmlld0N0b3IgPSBfTGlzdFZpZXc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbnRlbnQubW9kZSA9IHRoaXMub3B0aW9ucy5tb2RlO1xuICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zaG93KCk7XG4gICAgLy8gcmVxdWVzdCBpbmZvcm1hdGlvbnMgYWJvdXQgdGhlIHNldHVwLlxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdzZXR1cCcsIHRoaXMuX29uU2V0dXBSZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdjb25maXJtJywgdGhpcy5fb25Db25maXJtUmVzcG9uc2UpO1xuICAgIHRoaXMucmVjZWl2ZSgncmVqZWN0JywgdGhpcy5fb25SZWplY3RSZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdlbmFibGUtaW5kZXgnLCB0aGlzLl9vbkVuYWJsZUluZGV4KTtcbiAgICB0aGlzLnJlY2VpdmUoJ2Rpc2FibGUtaW5kZXgnLCB0aGlzLl9vbkRpc2FibGVJbmRleCk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdzZXR1cCcsIHRoaXMuX29uU2V0dXBSZXNwb25zZSk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY29uZmlybScsIHRoaXMuX29uQ29uZmlybVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdyZWplY3QnLCB0aGlzLl9vblJlamVjdFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdlbmFibGUtaW5kZXgnLCB0aGlzLl9vbkVuYWJsZUluZGV4KTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdkaXNhYmxlLWluZGV4JywgdGhpcy5fb25EaXNhYmxlSW5kZXgpO1xuXG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uU2V0dXBSZXNwb25zZShjYXBhY2l0eSwgbGFiZWxzLCBjb29yZGluYXRlcywgYXJlYSwgZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICBjb25zdCBudW1MYWJlbHMgPSBsYWJlbHMgPyBsYWJlbHMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgY29uc3QgbnVtQ29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcyA/IGNvb3JkaW5hdGVzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgIHRoaXMuY2FwYWNpdHkgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcblxuICAgIGlmICh0aGlzLmNhcGFjaXR5ID4gY2FwYWNpdHkpXG4gICAgICB0aGlzLmNhcGFjaXR5ID0gY2FwYWNpdHk7XG5cbiAgICBpZiAoYXJlYSlcbiAgICAgIHRoaXMudmlldy5zZXRBcmVhKGFyZWEpO1xuXG4gICAgdGhpcy52aWV3LmRpc3BsYXlQb3NpdGlvbnModGhpcy5jYXBhY2l0eSwgbGFiZWxzLCBjb29yZGluYXRlcyk7XG4gICAgdGhpcy52aWV3LmRpc2FibGVQb3NpdGlvbnMoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgIHRoaXMudmlldy5vblNlbGVjdCh0aGlzLl9vblNlbGVjdCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uRW5hYmxlSW5kZXgoaW5kZXgpIHtcbiAgICB0aGlzLnZpZXcuZW5hYmxlUG9zaXRpb24oaW5kZXgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkRpc2FibGVJbmRleChpbmRleCkge1xuICAgIHRoaXMudmlldy5kaXNhYmxlUG9zaXRpb24oaW5kZXgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblNlbGVjdChpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSB7XG4gICAgdGhpcy5zZW5kKCdwb3NpdGlvbicsIGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkNvbmZpcm1SZXNwb25zZShpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSB7XG4gICAgY2xpZW50LmluZGV4ID0gdGhpcy5pbmRleCA9IGluZGV4O1xuICAgIGNsaWVudC5sYWJlbCA9IHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZWplY3RSZXNwb25zZShkaXNhYmxlZFBvc2l0aW9ucykge1xuICAgIHRoaXMudmlldy5yZWplY3QoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIENsaWVudFBsYWNlcik7XG5cbmV4cG9ydCBkZWZhdWx0IENsaWVudFBsYWNlcjtcbiJdfQ==