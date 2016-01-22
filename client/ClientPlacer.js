'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

var _localStorage = require('./localStorage');

var _localStorage2 = _interopRequireDefault(_localStorage);

var _displaySelectView = require('./display/SelectView');

var _displaySelectView2 = _interopRequireDefault(_displaySelectView);

var _displaySpaceView = require('./display/SpaceView');

var _displaySpaceView2 = _interopRequireDefault(_displaySpaceView);

var _displaySquaredView = require('./display/SquaredView');

var _displaySquaredView2 = _interopRequireDefault(_displaySquaredView);

/**
 * [client] Allow to select a place within a set of predefined positions (i.e. labels and/or coordinates).
 *
 * (See also {@link src/server/ServerPlacer.js~ServerPlacer} on the server side.)
 *
 * @example
 * const placer = new ClientPlacer({ capacity: 100 });
 */

var ClientPlacer = (function (_ClientModule) {
  _inherits(ClientPlacer, _ClientModule);

  /**
   * @param {Object} [options={}] - Options.
   * @param {String} [options.name='placer'] - Name of the module.
   * @param {String} [options.mode='graphic'] - Selection mode. Can be:
   * - `'graphic'` to select a place on a graphical representation of the available positions.
   * - `'list'` to select a place among a list of places.
   * @param {String} [options.persist=false] - Defines if the location should be stored in `localStorage`.
   */

  function ClientPlacer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientPlacer);

    _get(Object.getPrototypeOf(ClientPlacer.prototype), 'constructor', this).call(this, options.name || 'placer', options);

    this.options = _Object$assign({
      mode: 'graphic',
      persist: false
    }, options);

    this.localStorageNS = 'placer:position';

    this._onSetupResponse = this._onSetupResponse.bind(this);
    this._onSelect = this._onSelect.bind(this);
    this._deleteLocalStorage = this._deleteLocalStorage.bind(this);

    this.init();
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

      _client2['default'].coordinates = null;

      this.viewCtor = _displaySquaredView2['default'];
      this.content.mode = this.options.mode;
      this.view = this.createView();
    }

    /** @private */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientPlacer.prototype), 'start', this).call(this);
      // check for informations in local storage
      if (this.options.persist) {
        var position = this._retrieveLocalStorage();

        if (position !== null) {
          this._sendPosition(position);
          return this.done();
        }
      }

      // request positions or labels
      this.send('request', this.options.mode);

      this.receive('setup', this._onSetupResponse);
      this.receive('reset', this._deleteLocalStorage);
    }

    /** @private */
  }, {
    key: 'stop',
    value: function stop() {
      this.removeListener('setup', this._onSetupResponse);
      this.removeListener('reset', this._deleteLocalStorage);
    }

    /** @private */
  }, {
    key: 'restart',
    value: function restart() {
      // super.restart(); // @todo - prepare next gen server side db
      this._sendPosition();
    }
  }, {
    key: '_setLocalStorage',
    value: function _setLocalStorage(position) {
      _localStorage2['default'].set(this.localStorageNS, position);
    }
  }, {
    key: '_retrieveLocalStorage',
    value: function _retrieveLocalStorage() {
      return _localStorage2['default'].get(this.localStorageNS);
    }
  }, {
    key: '_deleteLocalStorage',
    value: function _deleteLocalStorage() {
      _localStorage2['default']['delete'](this.localStorageNS);
    }
  }, {
    key: '_onSetupResponse',
    value: function _onSetupResponse(capacity, labels, coordinates, area) {
      var _this = this;

      var numLabels = labels ? labels.length : Infinity;
      var numCoordinates = coordinates ? coordinates.length : Infinity;
      var numPositions = Math.min(numLabels, numCoordinates);

      if (numPositions > capacity) {
        numPositions = capacity;
      }

      var positions = [];

      for (var i = 0; i < numPositions; i++) {
        var label = labels[i] || (i + 1).toString();

        // @todo - define if coords should be an array
        // or an object and harmonize with SpaceView, Locator, etc...
        var position = { id: i, index: i, label: label };

        if (coordinates) {
          var coords = coordinates[i];
          position.x = coords[0];
          position.y = coords[1];
        }

        positions.push(position);
      }

      var selector = undefined;
      // @todo - disable positions selected by other players in real time
      // @todo - handle error messages
      switch (this.options.mode) {
        case 'graphic':
          selector = new _displaySpaceView2['default'](area);
          this.view.setViewComponent('.section-square', selector);
          this.view.render('.section-square');

          selector.setPositions(positions);
          selector.installEvents({
            'click .position': function clickPosition(e) {
              var position = selector.shapePositionMap.get(e.target);
              _this._onSelect(position);
            }
          });
          break;
        case 'list':
          selector = new _displaySelectView2['default']({
            instructions: this.content.instructions,
            entries: positions
          });
          this.view.setViewComponent('.section-square', selector);
          this.view.render('.section-square');

          selector.installEvents({
            'change': function change(e) {
              _this.content.showBtn = true;
              _this.view.render('.section-float');
              _this.view.installEvents({
                'click .btn': function clickBtn(e) {
                  var position = selector.value;
                  if (position) {
                    _this._onSelect(position);
                  }
                }
              });
            }
          });
          break;
      }
    }
  }, {
    key: '_onSelect',
    value: function _onSelect(position) {
      // optionally store in local storage
      if (this.options.persist) this._setLocalStorage(position);

      // send to server
      this._sendPosition(position);
      // @todo - should handle rejection from the server (`done` should be called only on server confirmation/aknowledgement).
      this.done();
    }
  }, {
    key: '_sendPosition',
    value: function _sendPosition() {
      var position = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (position !== null) {
        this.index = position.index;
        this.label = position.label;
        _client2['default'].coordinates = position.coordinates;
      }

      this.send('position', this.index, this.label, _client2['default'].coordinates);
    }
  }]);

  return ClientPlacer;
})(_ClientModule3['default']);

exports['default'] = ClientPlacer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50UGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7NEJBQ2hCLGdCQUFnQjs7OztpQ0FFbEIsc0JBQXNCOzs7O2dDQUN2QixxQkFBcUI7Ozs7a0NBQ25CLHVCQUF1Qjs7Ozs7Ozs7Ozs7OztJQVcxQixZQUFZO1lBQVosWUFBWTs7Ozs7Ozs7Ozs7QUFTcEIsV0FUUSxZQUFZLEdBU0w7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVRMLFlBQVk7O0FBVTdCLCtCQVZpQixZQUFZLDZDQVV2QixPQUFPLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRSxPQUFPLEVBQUU7O0FBRXpDLFFBQUksQ0FBQyxPQUFPLEdBQUcsZUFBYztBQUMzQixVQUFJLEVBQUUsU0FBUztBQUNmLGFBQU8sRUFBRSxLQUFLO0tBQ2YsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFWixRQUFJLENBQUMsY0FBYyxHQUFHLGlCQUFpQixDQUFDOztBQUV4QyxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6RCxRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNDLFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUUvRCxRQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDYjs7ZUF4QmtCLFlBQVk7O1dBMEIzQixnQkFBRzs7Ozs7QUFLTCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTWxCLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVsQiwwQkFBTyxXQUFXLEdBQUcsSUFBSSxDQUFDOztBQUUxQixVQUFJ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QUFnQixDQUFDLENBQUM7QUFDbkMsb0JBQUssSUFBSSxDQUFDLGFBQWEsQ0FBQztBQUN0Qiw0QkFBWSxFQUFFLGtCQUFDLENBQUMsRUFBSztBQUNuQixzQkFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUNoQyxzQkFBSSxRQUFRLEVBQUU7QUFBRSwwQkFBSyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7bUJBQUU7aUJBQzVDO2VBQ0YsQ0FBQyxDQUFDO2FBQ0o7V0FDRixDQUFDLENBQUM7QUFDSCxnQkFBTTtBQUFBLE9BQ1Q7S0FDRjs7O1dBRVEsbUJBQUMsUUFBUSxFQUFFOztBQUVsQixVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUN0QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7OztBQUdsQyxVQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUU3QixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1dBRVkseUJBQWtCO1VBQWpCLFFBQVEseURBQUcsSUFBSTs7QUFDM0IsVUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO0FBQ3JCLFlBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUM1QixZQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDNUIsNEJBQU8sV0FBVyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUM7T0FDM0M7O0FBRUQsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLG9CQUFPLFdBQVcsQ0FBQyxDQUFDO0tBQ25FOzs7U0EvS2tCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50UGxhY2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBsb2NhbFN0b3JhZ2UgZnJvbSAnLi9sb2NhbFN0b3JhZ2UnO1xuXG5pbXBvcnQgU2VsZWN0VmlldyBmcm9tICcuL2Rpc3BsYXkvU2VsZWN0Vmlldyc7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4vZGlzcGxheS9TcGFjZVZpZXcnO1xuaW1wb3J0IFNxdWFyZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TcXVhcmVkVmlldyc7XG5cblxuLyoqXG4gKiBbY2xpZW50XSBBbGxvdyB0byBzZWxlY3QgYSBwbGFjZSB3aXRoaW4gYSBzZXQgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGkuZS4gbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlclBsYWNlci5qc35TZXJ2ZXJQbGFjZXJ9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHBsYWNlciA9IG5ldyBDbGllbnRQbGFjZXIoeyBjYXBhY2l0eTogMTAwIH0pO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRQbGFjZXIgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSAtIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdwbGFjZXInXSAtIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm1vZGU9J2dyYXBoaWMnXSAtIFNlbGVjdGlvbiBtb2RlLiBDYW4gYmU6XG4gICAqIC0gYCdncmFwaGljJ2AgdG8gc2VsZWN0IGEgcGxhY2Ugb24gYSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGF2YWlsYWJsZSBwb3NpdGlvbnMuXG4gICAqIC0gYCdsaXN0J2AgdG8gc2VsZWN0IGEgcGxhY2UgYW1vbmcgYSBsaXN0IG9mIHBsYWNlcy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnBlcnNpc3Q9ZmFsc2VdIC0gRGVmaW5lcyBpZiB0aGUgbG9jYXRpb24gc2hvdWxkIGJlIHN0b3JlZCBpbiBgbG9jYWxTdG9yYWdlYC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fMKgJ3BsYWNlcicsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBtb2RlOiAnZ3JhcGhpYycsXG4gICAgICBwZXJzaXN0OiBmYWxzZSxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHRoaXMubG9jYWxTdG9yYWdlTlMgPSAncGxhY2VyOnBvc2l0aW9uJztcblxuICAgIHRoaXMuX29uU2V0dXBSZXNwb25zZSA9IHRoaXMuX29uU2V0dXBSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9kZWxldGVMb2NhbFN0b3JhZ2UgPSB0aGlzLl9kZWxldGVMb2NhbFN0b3JhZ2UuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBJbmRleCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIExhYmVsIG9mIHRoZSBwb3NpdGlvbiBzZWxlY3RlZCBieSB0aGUgdXNlci5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gbnVsbDtcblxuICAgIHRoaXMudmlld0N0b3IgPSBTcXVhcmVkVmlldztcbiAgICB0aGlzLmNvbnRlbnQubW9kZSA9IHRoaXMub3B0aW9ucy5tb2RlO1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgLy8gY2hlY2sgZm9yIGluZm9ybWF0aW9ucyBpbiBsb2NhbCBzdG9yYWdlXG4gICAgaWYgKHRoaXMub3B0aW9ucy5wZXJzaXN0KSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuX3JldHJpZXZlTG9jYWxTdG9yYWdlKCk7XG5cbiAgICAgIGlmIChwb3NpdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9zZW5kUG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgICByZXR1cm4gdGhpcy5kb25lKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmVxdWVzdCBwb3NpdGlvbnMgb3IgbGFiZWxzXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0JywgdGhpcy5vcHRpb25zLm1vZGUpO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdzZXR1cCcsIHRoaXMuX29uU2V0dXBSZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdyZXNldCcsIHRoaXMuX2RlbGV0ZUxvY2FsU3RvcmFnZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdzZXR1cCcsIHRoaXMuX29uU2V0dXBSZXNwb25zZSk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigncmVzZXQnLCB0aGlzLl9kZWxldGVMb2NhbFN0b3JhZ2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlc3RhcnQoKSB7XG4gICAgLy8gc3VwZXIucmVzdGFydCgpOyAvLyBAdG9kbyAtIHByZXBhcmUgbmV4dCBnZW4gc2VydmVyIHNpZGUgZGJcbiAgICB0aGlzLl9zZW5kUG9zaXRpb24oKTtcbiAgfVxuXG4gIF9zZXRMb2NhbFN0b3JhZ2UocG9zaXRpb24pIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0KHRoaXMubG9jYWxTdG9yYWdlTlMsIHBvc2l0aW9uKTtcbiAgfVxuXG4gIF9yZXRyaWV2ZUxvY2FsU3RvcmFnZSgpIHtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldCh0aGlzLmxvY2FsU3RvcmFnZU5TKTtcbiAgfVxuXG4gIF9kZWxldGVMb2NhbFN0b3JhZ2UoKSB7XG4gICAgbG9jYWxTdG9yYWdlLmRlbGV0ZSh0aGlzLmxvY2FsU3RvcmFnZU5TKTtcbiAgfVxuXG4gIF9vblNldHVwUmVzcG9uc2UoY2FwYWNpdHksIGxhYmVscywgY29vcmRpbmF0ZXMsIGFyZWEpIHtcbiAgICBjb25zdCBudW1MYWJlbHMgPSBsYWJlbHMgPyBsYWJlbHMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgY29uc3QgbnVtQ29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcyA/IGNvb3JkaW5hdGVzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgIGxldCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcblxuICAgIGlmIChudW1Qb3NpdGlvbnMgPiBjYXBhY2l0eSkgeyBudW1Qb3NpdGlvbnMgPSBjYXBhY2l0eTsgfVxuXG4gICAgY29uc3QgcG9zaXRpb25zID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVBvc2l0aW9uczsgaSsrKSB7XG4gICAgICBjb25zdCBsYWJlbCA9IGxhYmVsc1tpXSB8fCAoaSArIDEpLnRvU3RyaW5nKCk7XG5cbiAgICAgIC8vIEB0b2RvIC0gZGVmaW5lIGlmIGNvb3JkcyBzaG91bGQgYmUgYW4gYXJyYXlcbiAgICAgIC8vIG9yIGFuIG9iamVjdCBhbmQgaGFybW9uaXplIHdpdGggU3BhY2VWaWV3LCBMb2NhdG9yLCBldGMuLi5cbiAgICAgIGNvbnN0IHBvc2l0aW9uID0geyBpZDogaSwgaW5kZXg6IGksIGxhYmVsOiBsYWJlbCB9O1xuXG4gICAgICBpZiAoY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgY29uc3QgY29vcmRzID0gY29vcmRpbmF0ZXNbaV07XG4gICAgICAgIHBvc2l0aW9uLnggPSBjb29yZHNbMF07XG4gICAgICAgIHBvc2l0aW9uLnkgPSBjb29yZHNbMV07XG4gICAgICB9XG5cbiAgICAgIHBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBsZXQgc2VsZWN0b3I7XG4gICAgLy8gQHRvZG8gLSBkaXNhYmxlIHBvc2l0aW9ucyBzZWxlY3RlZCBieSBvdGhlciBwbGF5ZXJzIGluIHJlYWwgdGltZVxuICAgIC8vIEB0b2RvIC0gaGFuZGxlIGVycm9yIG1lc3NhZ2VzXG4gICAgc3dpdGNoICh0aGlzLm9wdGlvbnMubW9kZSkge1xuICAgICAgY2FzZSAnZ3JhcGhpYyc6XG4gICAgICAgIHNlbGVjdG9yID0gbmV3IFNwYWNlVmlldyhhcmVhKTtcbiAgICAgICAgdGhpcy52aWV3LnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHNlbGVjdG9yKTtcbiAgICAgICAgdGhpcy52aWV3LnJlbmRlcignLnNlY3Rpb24tc3F1YXJlJyk7XG5cbiAgICAgICAgc2VsZWN0b3Iuc2V0UG9zaXRpb25zKHBvc2l0aW9ucyk7XG4gICAgICAgIHNlbGVjdG9yLmluc3RhbGxFdmVudHMoe1xuICAgICAgICAgICdjbGljayAucG9zaXRpb24nOiAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBzZWxlY3Rvci5zaGFwZVBvc2l0aW9uTWFwLmdldChlLnRhcmdldCk7XG4gICAgICAgICAgICB0aGlzLl9vblNlbGVjdChwb3NpdGlvbik7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGlzdCc6XG4gICAgICAgIHNlbGVjdG9yID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgICAgIGluc3RydWN0aW9uczogdGhpcy5jb250ZW50Lmluc3RydWN0aW9ucyxcbiAgICAgICAgICBlbnRyaWVzOiBwb3NpdGlvbnMsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnZpZXcuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tc3F1YXJlJywgc2VsZWN0b3IpO1xuICAgICAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcblxuICAgICAgICBzZWxlY3Rvci5pbnN0YWxsRXZlbnRzKHtcbiAgICAgICAgICAnY2hhbmdlJzogKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5zaG93QnRuID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMudmlldy5yZW5kZXIoJy5zZWN0aW9uLWZsb2F0Jyk7XG4gICAgICAgICAgICB0aGlzLnZpZXcuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAgICAgICAgICdjbGljayAuYnRuJzogKGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHNlbGVjdG9yLnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChwb3NpdGlvbikgeyB0aGlzLl9vblNlbGVjdChwb3NpdGlvbik7IH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIF9vblNlbGVjdChwb3NpdGlvbikge1xuICAgIC8vIG9wdGlvbmFsbHkgc3RvcmUgaW4gbG9jYWwgc3RvcmFnZVxuICAgIGlmICh0aGlzLm9wdGlvbnMucGVyc2lzdClcbiAgICAgIHRoaXMuX3NldExvY2FsU3RvcmFnZShwb3NpdGlvbik7XG5cbiAgICAvLyBzZW5kIHRvIHNlcnZlclxuICAgIHRoaXMuX3NlbmRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgLy8gQHRvZG8gLSBzaG91bGQgaGFuZGxlIHJlamVjdGlvbiBmcm9tIHRoZSBzZXJ2ZXIgKGBkb25lYCBzaG91bGQgYmUgY2FsbGVkIG9ubHkgb24gc2VydmVyIGNvbmZpcm1hdGlvbi9ha25vd2xlZGdlbWVudCkuXG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICBfc2VuZFBvc2l0aW9uKHBvc2l0aW9uID0gbnVsbCkge1xuICAgIGlmIChwb3NpdGlvbiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5pbmRleCA9IHBvc2l0aW9uLmluZGV4O1xuICAgICAgdGhpcy5sYWJlbCA9IHBvc2l0aW9uLmxhYmVsO1xuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gcG9zaXRpb24uY29vcmRpbmF0ZXM7XG4gICAgfVxuXG4gICAgdGhpcy5zZW5kKCdwb3NpdGlvbicsIHRoaXMuaW5kZXgsIHRoaXMubGFiZWwsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gIH1cbn1cbiJdfQ==