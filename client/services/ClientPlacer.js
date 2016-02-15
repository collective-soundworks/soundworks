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
          if (position) {
            _this._onSelect(position);
          }
        }
      });
    }
  }, {
    key: 'displayPositions',
    value: function displayPositions(positions) {
      this.selector = new _displaySelectView2['default']({
        instructions: this.content.instructions,
        entries: positions
      });

      this.setViewComponent('.section-square', this.selector);
      this.render('.section-square');

      this.selector.installEvents({
        'change': this._onSelectionChange()
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
    value: function reject() {
      // @todo - must be tested
      this.setViewComponent('.section-square');
      this.content.rejected = true;
      this.render();
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

      if (disabledIndex === -1) this._onSelect(position);
    }
  }, {
    key: 'setArea',
    value: function setArea(area) {
      this._area = area;
    }
  }, {
    key: 'displayPositions',
    value: function displayPositions(positions) {
      this.positions = positions;

      this.selector = new _displaySpaceView2['default']();
      this.selector.setArea(this._area);
      this.setViewComponent('.section-square', this.selector);
      this.render('.section-square');

      this.selector.setPoints(positions);

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
    value: function reject() {
      // @todo - must be tested
      this.setViewComponent('.section-square');
      this.content.rejected = true;
      this.render();
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

  /** */

  function ClientPlacer() {
    _classCallCheck(this, ClientPlacer);

    _get(Object.getPrototypeOf(ClientPlacer.prototype), 'constructor', this).call(this, SERVICE_ID, true);

    /**
     * @param {String} [options.mode='graphic'] - Selection mode. Can be:
     * - `'graphic'` to select a place on a graphical representation of the available positions.
     * - `'list'` to select a place among a list of places.
     * @param {String} [options.persist=false] - Defines if the location should be stored in `localStorage`.
     */
    var defaults = {
      mode: 'list',
      persist: false,
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

      _coreClient2['default'].coordinates = null;
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

    /** @private */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientPlacer.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

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
  }, {
    key: '_onSetupResponse',
    value: function _onSetupResponse(capacity, labels, coordinates, area, disabledPositions) {
      var numLabels = labels ? labels.length : Infinity;
      var numCoordinates = coordinates ? coordinates.length : Infinity;
      var numPositions = Math.min(numLabels, numCoordinates);

      if (numPositions > capacity) {
        numPositions = capacity;
      }

      this.positions = [];

      for (var i = 0; i < numPositions; i++) {
        var label = labels !== null ? labels[i] : (i + 1).toString();
        var position = { id: i, index: i, label: label };

        if (coordinates) {
          var coords = coordinates[i];
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
  }, {
    key: '_onEnableIndex',
    value: function _onEnableIndex(index) {
      this.view.enablePosition(index);
    }
  }, {
    key: '_onDisableIndex',
    value: function _onDisableIndex(index) {
      this.view.disablePosition(index);
    }
  }, {
    key: '_onSelect',
    value: function _onSelect(position) {
      _coreClient2['default'].index = this.index = position.index;
      _coreClient2['default'].label = this.label = position.label;
      _coreClient2['default'].coordinates = position.coordinates;

      this.send('position', _coreClient2['default'].index, _coreClient2['default'].label, _coreClient2['default'].coordinates);
    }
  }, {
    key: '_onConfirmResponse',
    value: function _onConfirmResponse() {
      this.ready();
    }
  }, {
    key: '_onRejectResponse',
    value: function _onRejectResponse(disabledPositions) {
      if (disabledPositions.length === this.positions.length) this.view.reject();else this.view.render();
      this.view.disablePositions(disabledPositions);
    }
  }]);

  return ClientPlacer;
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, ClientPlacer);

exports['default'] = ClientPlacer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50UGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBQW1CLGdCQUFnQjs7OzsyQkFDZixpQkFBaUI7Ozs7a0NBQ1Ysd0JBQXdCOzs7Ozs7aUNBRzVCLHVCQUF1Qjs7OztnQ0FDeEIsc0JBQXNCOzs7O2tDQUNwQix3QkFBd0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBdUMxQyxTQUFTO1lBQVQsU0FBUzs7QUFDRixXQURQLFNBQVMsQ0FDRCxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7MEJBRDVDLFNBQVM7O0FBRVgsK0JBRkUsU0FBUyw2Q0FFTCxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7O0FBRTFDLFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzlEOztlQUxHLFNBQVM7O1dBT0ssNEJBQUMsQ0FBQyxFQUFFOzs7QUFDcEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQzVCLFVBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QixVQUFJLENBQUMsYUFBYSxDQUFDO0FBQ2pCLG9CQUFZLEVBQUUsa0JBQUMsQ0FBQyxFQUFLO0FBQ25CLGNBQU0sUUFBUSxHQUFHLE1BQUssUUFBUSxDQUFDLEtBQUssQ0FBQztBQUNyQyxjQUFJLFFBQVEsRUFBRTtBQUFFLGtCQUFLLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztXQUFFO1NBQzVDO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7OztXQUVlLDBCQUFDLFNBQVMsRUFBRTtBQUMxQixVQUFJLENBQUMsUUFBUSxHQUFHLG1DQUFlO0FBQzdCLG9CQUFZLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZO0FBQ3ZD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O0FBQ3JCLFVBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2xDOzs7V0FFUSxtQkFBQyxRQUFRLEVBQUU7QUFDbEIsOEJBQU8sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUMzQyw4QkFBTyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQzNDLDhCQUFPLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDOztBQUUxQyxVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSx3QkFBTyxLQUFLLEVBQUUsd0JBQU8sS0FBSyxFQUFFLHdCQUFPLFdBQVcsQ0FBQyxDQUFDO0tBQ3ZFOzs7V0FFaUIsOEJBQUc7QUFDbkIsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2Q7OztXQUVnQiwyQkFBQyxpQkFBaUIsRUFBRTtBQUNuQyxVQUFJLGlCQUFpQixDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFDcEQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUVuQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ25CLFVBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUNqRDs7O1NBeEpHLFlBQVk7OztBQTJKbEIsZ0NBQWUsUUFBUSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQzs7cUJBRW5DLFlBQVkiLCJmaWxlIjoic3JjL2NsaWVudC9zZXJ2aWNlcy9DbGllbnRQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG4vLyBpbXBvcnQgbG9jYWxTdG9yYWdlIGZyb20gJy4vbG9jYWxTdG9yYWdlJztcblxuaW1wb3J0IFNlbGVjdFZpZXcgZnJvbSAnLi4vZGlzcGxheS9TZWxlY3RWaWV3JztcbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi4vZGlzcGxheS9TcGFjZVZpZXcnO1xuaW1wb3J0IFNxdWFyZWRWaWV3IGZyb20gJy4uL2Rpc3BsYXkvU3F1YXJlZFZpZXcnO1xuXG4vLyAgLy8gdmlldyBBUElcbi8vICBjbGFzcyBBYnN0YWN0UGxhY2VyVmlldyBleHRlbmRzIHNvdW5kd29ya3MuZGlzcGxheS5WaWV3IHtcbi8vICAgIC8qKlxuLy8gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBwb3NpdGlvbnMgLSBBcnJheSBvZiBwb3NpdGlvbnMgKGluZGV4LCBpZCwgbGFiZWwsIGNvb3Jkcylcbi8vICAgICAqL1xuLy8gICAgZGlzcGxheVBvc2l0aW9ucyhwb3NpdGlvbnMpIHt9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBAcGFyYW0ge0FycmF5PE51bWJlcj59IHBvc2l0aW9ucyAtIEFycmF5IG9mIGluZGV4ZXMgb2YgdGhlIHBvc2l0aW9ucyB0byBkaXNhYmxlLlxuLy8gICAgICovXG4vLyAgICBkaXNhYmxlUG9zaXRpb25zKGluZGV4ZXMpIHt9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb25zIC0gSW5kZXggb2YgdGhlIHBvc2l0aW9uIHRvIGRpc2FibGVkLlxuLy8gICAgICovXG4vLyAgICBkaXNhYmxlUG9zaXRpb24oaW5kZXgpIHt9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb25zIC0gSW5kZXggb2YgdGhlIHBvc2l0aW9uIHRvIGVuYWJsZS5cbi8vICAgICAqL1xuLy8gICAgZW5hYmxlUG9zaXRpb24oaW5kZXgpIHt9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGJlIGFwcGxpZWQgd2hlbiBhIHBvc2l0aW9uIGlzIHNlbGVjdGVkLlxuLy8gICAgICovXG4vLyAgICBvblNlbGVjdChjYWxsYmFjaykge1xuLy8gICAgICB0aGlzLl9vblNlbGVjdCA9IGNhbGxiYWNrO1xuLy8gICAgfVxuLy9cbi8vICAgIHNldEFyZWEoYXJlYSkge31cbi8vXG4vLyAgICAvKipcbi8vICAgICAqIENhbGxlZCB3aGVuIG5vIGF2YWlibGUgcG9zaXRpb24uXG4vLyAgICAgKi9cbi8vICAgIHJlamVjdCgpIHt9XG4vLyAgfVxuXG5jbGFzcyBfTGlzdFZpZXcgZXh0ZW5kcyBTcXVhcmVkVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpIHtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlID0gdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIF9vblNlbGVjdGlvbkNoYW5nZShlKSB7XG4gICAgdGhpcy5jb250ZW50LnNob3dCdG4gPSB0cnVlO1xuICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1mbG9hdCcpO1xuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAnY2xpY2sgLmJ0bic6IChlKSA9PiB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5zZWxlY3Rvci52YWx1ZTtcbiAgICAgICAgaWYgKHBvc2l0aW9uKSB7IHRoaXMuX29uU2VsZWN0KHBvc2l0aW9uKTsgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZGlzcGxheVBvc2l0aW9ucyhwb3NpdGlvbnMpIHtcbiAgICB0aGlzLnNlbGVjdG9yID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgaW5zdHJ1Y3Rpb25zOiB0aGlzLmNvbnRlbnQuaW5zdHJ1Y3Rpb25zLFxuICAgICAgZW50cmllczogcG9zaXRpb25zLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnLCB0aGlzLnNlbGVjdG9yKTtcbiAgICB0aGlzLnJlbmRlcignLnNlY3Rpb24tc3F1YXJlJyk7XG5cbiAgICB0aGlzLnNlbGVjdG9yLmluc3RhbGxFdmVudHMoe1xuICAgICAgJ2NoYW5nZSc6IHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlKCksXG4gICAgfSk7XG4gIH1cblxuICBkaXNhYmxlUG9zaXRpb25zKGluZGV4ZXMpIHtcbiAgICBpbmRleGVzLmZvckVhY2goKGluZGV4KSA9PiB0aGlzLnNlbGVjdG9yLmRpc2FibGVJbmRleChpbmRleCkpO1xuICB9XG5cbiAgZGlzYWJsZVBvc2l0aW9uKGluZGV4KSB7XG4gICAgdGhpcy5zZWxlY3Rvci5kaXNhYmxlSW5kZXgoaW5kZXgpO1xuICB9XG5cbiAgZW5hYmxlUG9zaXRpb24oaW5kZXgpIHtcbiAgICB0aGlzLnNlbGVjdG9yLmVuYWJsZUluZGV4KGluZGV4KTtcbiAgfVxuXG4gIG9uU2VsZWN0KGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fb25TZWxlY3QgPSBjYWxsYmFjaztcbiAgfVxuXG4gIHJlamVjdCgpIHtcbiAgICAvLyBAdG9kbyAtIG11c3QgYmUgdGVzdGVkXG4gICAgdGhpcy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnKTtcbiAgICB0aGlzLmNvbnRlbnQucmVqZWN0ZWQgPSB0cnVlO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cbn1cblxuY2xhc3MgX0dyYXBoaWNWaWV3IGV4dGVuZHMgU3F1YXJlZFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9hcmVhID0gbnVsbDtcbiAgICB0aGlzLl9kaXNhYmxlZFBvc2l0aW9ucyA9IFtdO1xuICAgIHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlID0gdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIF9vblNlbGVjdGlvbkNoYW5nZShlKSB7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNlbGVjdG9yLnNoYXBlUG9pbnRNYXAuZ2V0KGUudGFyZ2V0KTtcbiAgICBjb25zdCBkaXNhYmxlZEluZGV4ID0gdGhpcy5fZGlzYWJsZWRQb3NpdGlvbnMuaW5kZXhPZihwb3NpdGlvbi5pbmRleCk7XG5cbiAgICBpZiAoZGlzYWJsZWRJbmRleCA9PT0gLTEpXG4gICAgICB0aGlzLl9vblNlbGVjdChwb3NpdGlvbik7XG4gIH1cblxuICBzZXRBcmVhKGFyZWEpIHtcbiAgICB0aGlzLl9hcmVhID0gYXJlYTtcbiAgfVxuXG4gIGRpc3BsYXlQb3NpdGlvbnMocG9zaXRpb25zKSB7XG4gICAgdGhpcy5wb3NpdGlvbnMgPSBwb3NpdGlvbnM7XG5cbiAgICB0aGlzLnNlbGVjdG9yID0gbmV3IFNwYWNlVmlldygpO1xuICAgIHRoaXMuc2VsZWN0b3Iuc2V0QXJlYSh0aGlzLl9hcmVhKTtcbiAgICB0aGlzLnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc2VsZWN0b3IpO1xuICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcblxuICAgIHRoaXMuc2VsZWN0b3Iuc2V0UG9pbnRzKHBvc2l0aW9ucyk7XG5cbiAgICB0aGlzLnNlbGVjdG9yLmluc3RhbGxFdmVudHMoe1xuICAgICAgJ2NsaWNrIC5wb2ludCc6IHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlXG4gICAgfSk7XG4gIH1cblxuICBkaXNhYmxlUG9zaXRpb25zKGluZGV4ZXMpIHtcbiAgICB0aGlzLl9kaXNhYmxlZFBvc2l0aW9ucyA9IHRoaXMuX2Rpc2FibGVkUG9zaXRpb25zLmNvbmNhdChpbmRleGVzKTtcbiAgICBpbmRleGVzLmZvckVhY2goKGluZGV4KSA9PiB0aGlzLmRpc2FibGVQb3NpdGlvbihpbmRleCkpO1xuICB9XG5cbiAgZGlzYWJsZVBvc2l0aW9uKGluZGV4KSB7XG4gICAgdGhpcy5fZGlzYWJsZWRQb3NpdGlvbnMucHVzaChpbmRleCk7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uc1tpbmRleF07XG5cbiAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgIHBvc2l0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuc2VsZWN0b3IudXBkYXRlUG9pbnQocG9zaXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIGVuYWJsZVBvc2l0aW9uKGluZGV4KSB7XG4gICAgY29uc3QgZGlzYWJsZWRJbmRleCA9IHRoaXMuX2Rpc2FibGVkUG9zaXRpb25zLmluZGV4T2YoaW5kZXgpO1xuICAgIGlmIChkaXNhYmxlZEluZGV4ICE9PSAtMSlcbiAgICAgIHRoaXMuX2Rpc2FibGVkUG9zaXRpb25zLnNwbGljZShkaXNhYmxlZEluZGV4LCAxKTtcblxuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbnNbaW5kZXhdO1xuXG4gICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICBwb3NpdGlvbi5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5zZWxlY3Rvci51cGRhdGVQb2ludChwb3NpdGlvbik7XG4gICAgfVxuICB9XG5cbiAgb25TZWxlY3QoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9vblNlbGVjdCA9IGNhbGxiYWNrO1xuICB9XG5cbiAgcmVqZWN0KCkge1xuICAgIC8vIEB0b2RvIC0gbXVzdCBiZSB0ZXN0ZWRcbiAgICB0aGlzLnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScpO1xuICAgIHRoaXMuY29udGVudC5yZWplY3RlZCA9IHRydWU7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxufVxuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpwbGFjZXInO1xuXG4vKipcbiAqIFtjbGllbnRdIEFsbG93IHRvIHNlbGVjdCBhIHBsYWNlIHdpdGhpbiBhIHNldCBvZiBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoaS5lLiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyUGxhY2VyLmpzflNlcnZlclBsYWNlcn0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgcGxhY2VyID0gc291bmR3b3Jrcy5jbGllbnQucmVxdWlyZSgncGxhY2UnLCB7IGNhcGFjaXR5OiAxMDAgfSk7XG4gKi9cbmNsYXNzIENsaWVudFBsYWNlciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubW9kZT0nZ3JhcGhpYyddIC0gU2VsZWN0aW9uIG1vZGUuIENhbiBiZTpcbiAgICAgKiAtIGAnZ3JhcGhpYydgIHRvIHNlbGVjdCBhIHBsYWNlIG9uIGEgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhdmFpbGFibGUgcG9zaXRpb25zLlxuICAgICAqIC0gYCdsaXN0J2AgdG8gc2VsZWN0IGEgcGxhY2UgYW1vbmcgYSBsaXN0IG9mIHBsYWNlcy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMucGVyc2lzdD1mYWxzZV0gLSBEZWZpbmVzIGlmIHRoZSBsb2NhdGlvbiBzaG91bGQgYmUgc3RvcmVkIGluIGBsb2NhbFN0b3JhZ2VgLlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgbW9kZTogJ2xpc3QnLFxuICAgICAgcGVyc2lzdDogZmFsc2UsXG4gICAgICB2aWV3OiBudWxsLFxuICAgICAgdmlld0N0b3I6IG51bGwsXG4gICAgICB2aWV3UHJpb3JpdHk6IDYsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX29uU2V0dXBSZXNwb25zZSA9IHRoaXMuX29uU2V0dXBSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uRW5hYmxlSW5kZXggPSB0aGlzLl9vbkVuYWJsZUluZGV4LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25EaXNhYmxlSW5kZXggPSB0aGlzLl9vbkRpc2FibGVJbmRleC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNvbmZpcm1SZXNwb25zZSA9IHRoaXMuX29uQ29uZmlybVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25SZWplY3RSZXNwb25zZSA9IHRoaXMuX29uUmVqZWN0UmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgLyoqXG4gICAgICogSW5kZXggb2YgdGhlIHBvc2l0aW9uIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5pbmRleCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IG51bGw7XG4gICAgLy8gYWxsb3cgdG8gcGFzcyBhbnkgdmlld1xuICAgIGlmICh0aGlzLm9wdGlvbnMudmlldyAhPT0gbnVsbCkge1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudmlld0N0b3IgIT09IG51bGwpXG4gICAgICAgIHRoaXMudmlld0N0b3IgPSB0aGlzLm9wdGlvbnMudmlld0N0b3I7XG4gICAgICBlbHNlIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLm9wdGlvbnMubW9kZSkge1xuICAgICAgICAgIGNhc2UgJ2dyYXBoaWMnOlxuICAgICAgICAgICAgdGhpcy52aWV3Q3RvciA9IF9HcmFwaGljVmlldztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aGlzLnZpZXdDdG9yID0gX0xpc3RWaWV3O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5jb250ZW50Lm1vZGUgPSB0aGlzLm9wdGlvbnMubW9kZTtcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2hvdygpO1xuICAgIC8vIHJlcXVlc3QgcG9zaXRpb25zIG9yIGxhYmVsc1xuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdzZXR1cCcsIHRoaXMuX29uU2V0dXBSZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdjb25maXJtJywgdGhpcy5fb25Db25maXJtUmVzcG9uc2UpO1xuICAgIHRoaXMucmVjZWl2ZSgncmVqZWN0JywgdGhpcy5fb25SZWplY3RSZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdlbmFibGUtaW5kZXgnLCB0aGlzLl9vbkVuYWJsZUluZGV4KTtcbiAgICB0aGlzLnJlY2VpdmUoJ2Rpc2FibGUtaW5kZXgnLCB0aGlzLl9vbkRpc2FibGVJbmRleCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdzZXR1cCcsIHRoaXMuX29uU2V0dXBSZXNwb25zZSk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY29uZmlybScsIHRoaXMuX29uQ29uZmlybVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdyZWplY3QnLCB0aGlzLl9vblJlamVjdFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdlbmFibGUtaW5kZXgnLCB0aGlzLl9vbkVuYWJsZUluZGV4KTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdkaXNhYmxlLWluZGV4JywgdGhpcy5fb25EaXNhYmxlSW5kZXgpO1xuXG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cblxuICBfb25TZXR1cFJlc3BvbnNlKGNhcGFjaXR5LCBsYWJlbHMsIGNvb3JkaW5hdGVzLCBhcmVhLCBkaXNhYmxlZFBvc2l0aW9ucykge1xuICAgIGNvbnN0IG51bUxhYmVscyA9IGxhYmVscyA/IGxhYmVscy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICBjb25zdCBudW1Db29yZGluYXRlcyA9IGNvb3JkaW5hdGVzID8gY29vcmRpbmF0ZXMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgbGV0IG51bVBvc2l0aW9ucyA9IE1hdGgubWluKG51bUxhYmVscywgbnVtQ29vcmRpbmF0ZXMpO1xuXG4gICAgaWYgKG51bVBvc2l0aW9ucyA+IGNhcGFjaXR5KSB7IG51bVBvc2l0aW9ucyA9IGNhcGFjaXR5OyB9XG5cbiAgICB0aGlzLnBvc2l0aW9ucyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Qb3NpdGlvbnM7IGkrKykge1xuICAgICAgY29uc3QgbGFiZWwgPSBsYWJlbHMgIT09IG51bGwgPyBsYWJlbHNbaV0gOiAoaSArIDEpLnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHsgaWQ6IGksIGluZGV4OiBpLCBsYWJlbDogbGFiZWwgfTtcblxuICAgICAgaWYgKGNvb3JkaW5hdGVzKSB7XG4gICAgICAgIGNvbnN0IGNvb3JkcyA9IGNvb3JkaW5hdGVzW2ldO1xuICAgICAgICBwb3NpdGlvbi54ID0gY29vcmRzWzBdO1xuICAgICAgICBwb3NpdGlvbi55ID0gY29vcmRzWzFdO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBpZiAoYXJlYSkge1xuICAgICAgdGhpcy52aWV3LnNldEFyZWEoYXJlYSk7XG4gICAgfVxuXG4gICAgdGhpcy52aWV3LmRpc3BsYXlQb3NpdGlvbnModGhpcy5wb3NpdGlvbnMpO1xuICAgIHRoaXMudmlldy5kaXNhYmxlUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgICB0aGlzLnZpZXcub25TZWxlY3QodGhpcy5fb25TZWxlY3QpO1xuICB9XG5cbiAgX29uRW5hYmxlSW5kZXgoaW5kZXgpIHtcbiAgICB0aGlzLnZpZXcuZW5hYmxlUG9zaXRpb24oaW5kZXgpO1xuICB9XG5cbiAgX29uRGlzYWJsZUluZGV4KGluZGV4KSB7XG4gICAgdGhpcy52aWV3LmRpc2FibGVQb3NpdGlvbihpbmRleCk7XG4gIH1cblxuICBfb25TZWxlY3QocG9zaXRpb24pIHtcbiAgICBjbGllbnQuaW5kZXggPSB0aGlzLmluZGV4ID0gcG9zaXRpb24uaW5kZXg7XG4gICAgY2xpZW50LmxhYmVsID0gdGhpcy5sYWJlbCA9IHBvc2l0aW9uLmxhYmVsO1xuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IHBvc2l0aW9uLmNvb3JkaW5hdGVzO1xuXG4gICAgdGhpcy5zZW5kKCdwb3NpdGlvbicsIGNsaWVudC5pbmRleCwgY2xpZW50LmxhYmVsLCBjbGllbnQuY29vcmRpbmF0ZXMpO1xuICB9XG5cbiAgX29uQ29uZmlybVJlc3BvbnNlKCkge1xuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIF9vblJlamVjdFJlc3BvbnNlKGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgaWYgKGRpc2FibGVkUG9zaXRpb25zLmxlbmd0aCA9PT0gdGhpcy5wb3NpdGlvbnMubGVuZ3RoKVxuICAgICAgdGhpcy52aWV3LnJlamVjdCgpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICAgIHRoaXMudmlldy5kaXNhYmxlUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBDbGllbnRQbGFjZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBDbGllbnRQbGFjZXI7XG4iXX0=