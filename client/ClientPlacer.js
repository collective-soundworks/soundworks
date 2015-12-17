'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

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
   * @param {Boolean} [options.persist=false] - Indicates whether the selected place should be stored in the `LocalStorage` for future retrieval or not.
   */

  function ClientPlacer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientPlacer);

    _get(Object.getPrototypeOf(ClientPlacer.prototype), 'constructor', this).call(this, options.name || 'placer', options);

    this.index = null;
    this.label = null;

    this.mode = options.mode || 'graphic';
    this.persist = options.persist || false;
    this.localStorageNS = 'placer:position';

    this._createView = this._createView.bind(this);
    this._onSelect = this._onSelect.bind(this);

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
      this.content.mode = this.mode;
      this.content.showBtn = false;
      this.view = this.createDefaultView();
    }

    /**
     * Start the module.
     * @private
     */
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(ClientPlacer.prototype), 'start', this).call(this);
      // check for informations in local storage
      if (this.persist) {
        var position = _localStorage2['default'].get(this.localStorageNS);

        if (position !== null) {
          this._sendPosition(position);
          return this.done();
        }
      }

      // request positions or labels
      this.send('request', this.mode);
      this.receive('setup', this._createView);

      // reset position stored in local storage
      this.receive('reset', function () {
        return _localStorage2['default']['delete'](_this.localStorageNS);
      });
    }

    /**
     * Restart the module.
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(ClientPlacer.prototype), 'restart', this).call(this);
      this._sendPosition();
    }

    /**
     * Reset the module to initial state.
     * @private
     */
  }, {
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(ClientPlacer.prototype), 'reset', this).call(this);
    }

    /**
     * Done method.
     * @private
     */
  }, {
    key: 'done',
    value: function done() {
      _get(Object.getPrototypeOf(ClientPlacer.prototype), 'done', this).call(this);
    }
  }, {
    key: '_createView',
    value: function _createView(capacity, labels, coordinates, area) {
      var _this2 = this;

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
        var position = {
          id: i,
          index: i,
          label: label
        };

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
      switch (this.mode) {
        case 'graphic':
          selector = new _displaySpaceView2['default'](area);
          this.view.setViewComponent('.section-square', selector);
          this.view.render('.section-square');

          selector.setPositions(positions);
          selector.installEvents({
            'click .position': function clickPosition(e) {
              var position = selector.shapePositionMap.get(e.target);
              _this2._onSelect(position);
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
              _this2.content.showBtn = true;
              _this2.view.render('.section-float');
              _this2.view.installEvents({
                'click .btn': function clickBtn(e) {
                  var position = selector.value;
                  if (position) {
                    _this2._onSelect(position);
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
      if (this.persist) {
        this._setLocalStorage(position);
      }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50UGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQW1CLFVBQVU7Ozs7NkJBQ0osZ0JBQWdCOzs7OzRCQUNoQixnQkFBZ0I7Ozs7aUNBRWxCLHNCQUFzQjs7OztnQ0FDdkIscUJBQXFCOzs7O2tDQUNuQix1QkFBdUI7Ozs7Ozs7Ozs7Ozs7SUFXMUIsWUFBWTtZQUFaLFlBQVk7Ozs7Ozs7Ozs7O0FBU3BCLFdBVFEsWUFBWSxHQVNMO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFUTCxZQUFZOztBQVU3QiwrQkFWaUIsWUFBWSw2Q0FVdkIsT0FBTyxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUUsT0FBTyxFQUFFOztBQUV6QyxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQztBQUN0QyxRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDO0FBQ3hDLFFBQUksQ0FBQyxjQUFjLEdBQUcsaUJBQWlCLENBQUM7O0FBRXhDLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0MsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFM0MsUUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ2I7O2VBdkJrQixZQUFZOztXQXlCM0IsZ0JBQUc7Ozs7O0FBS0wsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Ozs7OztBQU1sQixVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFbEIsMEJBQU8sV0FBVyxHQUFHLElBQUksQ0FBQzs7QUFF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QztlQUNGLENBQUMsQ0FBQzthQUNKO1dBQ0YsQ0FBQyxDQUFDO0FBQ0gsZ0JBQU07QUFBQSxPQUNUO0tBQ0Y7OztXQUVRLG1CQUFDLFFBQVEsRUFBRTs7QUFFbEIsVUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUNqQzs7O0FBR0QsVUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFN0IsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztXQUVZLHlCQUFrQjtVQUFqQixRQUFRLHlEQUFHLElBQUk7O0FBQzNCLFVBQUksUUFBUSxLQUFLLElBQUksRUFBRTtBQUNyQixZQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDNUIsWUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQzVCLDRCQUFPLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO09BQzNDOztBQUVELFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxvQkFBTyxXQUFXLENBQUMsQ0FBQztLQUNuRTs7O1NBekxrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudFBsYWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgbG9jYWxTdG9yYWdlIGZyb20gJy4vbG9jYWxTdG9yYWdlJztcblxuaW1wb3J0IFNlbGVjdFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NlbGVjdFZpZXcnO1xuaW1wb3J0IFNwYWNlVmlldyBmcm9tICcuL2Rpc3BsYXkvU3BhY2VWaWV3JztcbmltcG9ydCBTcXVhcmVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU3F1YXJlZFZpZXcnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gQWxsb3cgdG8gc2VsZWN0IGEgcGxhY2Ugd2l0aGluIGEgc2V0IG9mIHByZWRlZmluZWQgcG9zaXRpb25zIChpLmUuIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJQbGFjZXIuanN+U2VydmVyUGxhY2VyfSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBwbGFjZXIgPSBuZXcgQ2xpZW50UGxhY2VyKHsgY2FwYWNpdHk6IDEwMCB9KTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50UGxhY2VyIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0ncGxhY2VyJ10gLSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5tb2RlPSdncmFwaGljJ10gLSBTZWxlY3Rpb24gbW9kZS4gQ2FuIGJlOlxuICAgKiAtIGAnZ3JhcGhpYydgIHRvIHNlbGVjdCBhIHBsYWNlIG9uIGEgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhdmFpbGFibGUgcG9zaXRpb25zLlxuICAgKiAtIGAnbGlzdCdgIHRvIHNlbGVjdCBhIHBsYWNlIGFtb25nIGEgbGlzdCBvZiBwbGFjZXMuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucGVyc2lzdD1mYWxzZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc2VsZWN0ZWQgcGxhY2Ugc2hvdWxkIGJlIHN0b3JlZCBpbiB0aGUgYExvY2FsU3RvcmFnZWAgZm9yIGZ1dHVyZSByZXRyaWV2YWwgb3Igbm90LlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8wqAncGxhY2VyJywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuICAgIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fMKgJ2dyYXBoaWMnO1xuICAgIHRoaXMucGVyc2lzdCA9IG9wdGlvbnMucGVyc2lzdCB8fMKgZmFsc2U7XG4gICAgdGhpcy5sb2NhbFN0b3JhZ2VOUyA9ICdwbGFjZXI6cG9zaXRpb24nO1xuXG4gICAgdGhpcy5fY3JlYXRlVmlldyA9IHRoaXMuX2NyZWF0ZVZpZXcuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblNlbGVjdCA9IHRoaXMuX29uU2VsZWN0LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgLyoqXG4gICAgICogSW5kZXggb2YgdGhlIHBvc2l0aW9uIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5pbmRleCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IG51bGw7XG5cbiAgICB0aGlzLnZpZXdDdG9yID0gU3F1YXJlZFZpZXc7XG4gICAgdGhpcy5jb250ZW50Lm1vZGUgPSB0aGlzLm1vZGU7XG4gICAgdGhpcy5jb250ZW50LnNob3dCdG4gPSBmYWxzZTtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZURlZmF1bHRWaWV3KCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgLy8gY2hlY2sgZm9yIGluZm9ybWF0aW9ucyBpbiBsb2NhbCBzdG9yYWdlXG4gICAgaWYgKHRoaXMucGVyc2lzdCkge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSBsb2NhbFN0b3JhZ2UuZ2V0KHRoaXMubG9jYWxTdG9yYWdlTlMpO1xuXG4gICAgICBpZiAocG9zaXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fc2VuZFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9uZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlcXVlc3QgcG9zaXRpb25zIG9yIGxhYmVsc1xuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcsIHRoaXMubW9kZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdzZXR1cCcsIHRoaXMuX2NyZWF0ZVZpZXcpO1xuXG4gICAgLy8gcmVzZXQgcG9zaXRpb24gc3RvcmVkIGluIGxvY2FsIHN0b3JhZ2VcbiAgICB0aGlzLnJlY2VpdmUoJ3Jlc2V0JywgKCkgPT4gbG9jYWxTdG9yYWdlLmRlbGV0ZSh0aGlzLmxvY2FsU3RvcmFnZU5TKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydCB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5fc2VuZFBvc2l0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIG1vZHVsZSB0byBpbml0aWFsIHN0YXRlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb25lIG1ldGhvZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRvbmUoKSB7XG4gICAgc3VwZXIuZG9uZSgpO1xuICB9XG5cbiAgX2NyZWF0ZVZpZXcoY2FwYWNpdHksIGxhYmVscywgY29vcmRpbmF0ZXMsIGFyZWEpIHtcbiAgICBjb25zdCBudW1MYWJlbHMgPSBsYWJlbHMgPyBsYWJlbHMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgY29uc3QgbnVtQ29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcyA/IGNvb3JkaW5hdGVzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgIGxldCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcblxuICAgIGlmIChudW1Qb3NpdGlvbnMgPiBjYXBhY2l0eSkgeyBudW1Qb3NpdGlvbnMgPSBjYXBhY2l0eTsgfVxuXG4gICAgY29uc3QgcG9zaXRpb25zID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVBvc2l0aW9uczsgaSsrKSB7XG4gICAgICBjb25zdCBsYWJlbCA9IGxhYmVsc1tpXSB8fCAoaSArIDEpLnRvU3RyaW5nKCk7XG5cbiAgICAgIC8vIEB0b2RvIC0gZGVmaW5lIGlmIGNvb3JkcyBzaG91bGQgYmUgYW4gYXJyYXlcbiAgICAgIC8vIG9yIGFuIG9iamVjdCBhbmQgaGFybW9uaXplIHdpdGggU3BhY2VWaWV3LCBMb2NhdG9yLCBldGMuLi5cbiAgICAgIGNvbnN0IHBvc2l0aW9uID0ge1xuICAgICAgICBpZDogaSxcbiAgICAgICAgaW5kZXg6IGksXG4gICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgIH07XG5cbiAgICAgIGlmIChjb29yZGluYXRlcykge1xuICAgICAgICBjb25zdCBjb29yZHMgPSBjb29yZGluYXRlc1tpXTtcbiAgICAgICAgcG9zaXRpb24ueCA9IGNvb3Jkc1swXTtcbiAgICAgICAgcG9zaXRpb24ueSA9IGNvb3Jkc1sxXTtcbiAgICAgIH1cblxuICAgICAgcG9zaXRpb25zLnB1c2gocG9zaXRpb24pO1xuICAgIH1cblxuICAgIGxldCBzZWxlY3RvcjtcbiAgICAvLyBAdG9kbyAtIGRpc2FibGUgcG9zaXRpb25zIHNlbGVjdGVkIGJ5IG90aGVyIHBsYXllcnMgaW4gcmVhbCB0aW1lXG4gICAgLy8gQHRvZG8gLSBoYW5kbGUgZXJyb3IgbWVzc2FnZXNcbiAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgICAgY2FzZSAnZ3JhcGhpYyc6XG4gICAgICAgIHNlbGVjdG9yID0gbmV3IFNwYWNlVmlldyhhcmVhKTtcbiAgICAgICAgdGhpcy52aWV3LnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHNlbGVjdG9yKTtcbiAgICAgICAgdGhpcy52aWV3LnJlbmRlcignLnNlY3Rpb24tc3F1YXJlJyk7XG5cbiAgICAgICAgc2VsZWN0b3Iuc2V0UG9zaXRpb25zKHBvc2l0aW9ucyk7XG4gICAgICAgIHNlbGVjdG9yLmluc3RhbGxFdmVudHMoe1xuICAgICAgICAgICdjbGljayAucG9zaXRpb24nOiAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBzZWxlY3Rvci5zaGFwZVBvc2l0aW9uTWFwLmdldChlLnRhcmdldCk7XG4gICAgICAgICAgICB0aGlzLl9vblNlbGVjdChwb3NpdGlvbik7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGlzdCc6XG4gICAgICAgIHNlbGVjdG9yID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgICAgIGluc3RydWN0aW9uczogdGhpcy5jb250ZW50Lmluc3RydWN0aW9ucyxcbiAgICAgICAgICBlbnRyaWVzOiBwb3NpdGlvbnMsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnZpZXcuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tc3F1YXJlJywgc2VsZWN0b3IpO1xuICAgICAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcblxuICAgICAgICBzZWxlY3Rvci5pbnN0YWxsRXZlbnRzKHtcbiAgICAgICAgICAnY2hhbmdlJzogKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5zaG93QnRuID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMudmlldy5yZW5kZXIoJy5zZWN0aW9uLWZsb2F0Jyk7XG4gICAgICAgICAgICB0aGlzLnZpZXcuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAgICAgICAgICdjbGljayAuYnRuJzogKGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHNlbGVjdG9yLnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChwb3NpdGlvbikgeyB0aGlzLl9vblNlbGVjdChwb3NpdGlvbik7IH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIF9vblNlbGVjdChwb3NpdGlvbikge1xuICAgIC8vIG9wdGlvbmFsbHkgc3RvcmUgaW4gbG9jYWwgc3RvcmFnZVxuICAgIGlmICh0aGlzLnBlcnNpc3QpIHtcbiAgICAgIHRoaXMuX3NldExvY2FsU3RvcmFnZShwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgLy8gc2VuZCB0byBzZXJ2ZXJcbiAgICB0aGlzLl9zZW5kUG9zaXRpb24ocG9zaXRpb24pO1xuICAgIC8vIEB0b2RvIC0gc2hvdWxkIGhhbmRsZSByZWplY3Rpb24gZnJvbSB0aGUgc2VydmVyIChgZG9uZWAgc2hvdWxkIGJlIGNhbGxlZCBvbmx5IG9uIHNlcnZlciBjb25maXJtYXRpb24vYWtub3dsZWRnZW1lbnQpLlxuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgX3NlbmRQb3NpdGlvbihwb3NpdGlvbiA9IG51bGwpIHtcbiAgICBpZiAocG9zaXRpb24gIT09IG51bGwpIHtcbiAgICAgIHRoaXMuaW5kZXggPSBwb3NpdGlvbi5pbmRleDtcbiAgICAgIHRoaXMubGFiZWwgPSBwb3NpdGlvbi5sYWJlbDtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IHBvc2l0aW9uLmNvb3JkaW5hdGVzO1xuICAgIH1cblxuICAgIHRoaXMuc2VuZCgncG9zaXRpb24nLCB0aGlzLmluZGV4LCB0aGlzLmxhYmVsLCBjbGllbnQuY29vcmRpbmF0ZXMpO1xuICB9XG59XG4iXX0=