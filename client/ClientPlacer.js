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

// import localStorage from './localStorage';

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

    // this.localStorageNS = 'placer:position';

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
      // if (this.options.persist) {
      //   const position = this._retrieveLocalStorage();

      //   if (position !== null) {
      //     this._sendPosition(position);
      //     return this.done();
      //   }
      // }

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

    // /** @private */
    // restart() {
    //   // super.restart(); // @todo - prepare next gen server side db
    //   this._sendPosition();
    // }

    // _setLocalStorage(position) {
    //   localStorage.set(this.localStorageNS, position);
    // }

    // _retrieveLocalStorage() {
    //   return localStorage.get(this.localStorageNS);
    // }

    // _deleteLocalStorage() {
    //   localStorage.delete(this.localStorageNS);
    // }

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
      if (this.options.persist)
        // this._setLocalStorage(position);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50UGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7OztpQ0FHbEIsc0JBQXNCOzs7O2dDQUN2QixxQkFBcUI7Ozs7a0NBQ25CLHVCQUF1Qjs7Ozs7Ozs7Ozs7OztJQVcxQixZQUFZO1lBQVosWUFBWTs7Ozs7Ozs7Ozs7QUFTcEIsV0FUUSxZQUFZLEdBU0w7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVRMLFlBQVk7O0FBVTdCLCtCQVZpQixZQUFZLDZDQVV2QixPQUFPLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRSxPQUFPLEVBQUU7O0FBRXpDLFFBQUksQ0FBQyxPQUFPLEdBQUcsZUFBYztBQUMzQixVQUFJLEVBQUUsU0FBUztBQUNmLGFBQU8sRUFBRSxLQUFLO0tBQ2YsRUFBRSxPQUFPLENBQUMsQ0FBQzs7OztBQUlaLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pELFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0MsUUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRS9ELFFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNiOztlQXhCa0IsWUFBWTs7V0EwQjNCLGdCQUFHOzs7OztBQUtMLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOzs7Ozs7QUFNbEIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLDBCQUFPLFdBQVcsR0FBRyxJQUFJLENBQUM7O0FBRTFCLFVBQUksQ0FBQyxRQUFRLGtDQUFjLENBQUM7QUFDNUIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJ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QUM7QUFDNUIsWUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQzVCLDRCQUFPLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO09BQzNDOztBQUVELFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxvQkFBTyxXQUFXLENBQUMsQ0FBQztLQUNuRTs7O1NBL0trQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudFBsYWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG4vLyBpbXBvcnQgbG9jYWxTdG9yYWdlIGZyb20gJy4vbG9jYWxTdG9yYWdlJztcblxuaW1wb3J0IFNlbGVjdFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NlbGVjdFZpZXcnO1xuaW1wb3J0IFNwYWNlVmlldyBmcm9tICcuL2Rpc3BsYXkvU3BhY2VWaWV3JztcbmltcG9ydCBTcXVhcmVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU3F1YXJlZFZpZXcnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gQWxsb3cgdG8gc2VsZWN0IGEgcGxhY2Ugd2l0aGluIGEgc2V0IG9mIHByZWRlZmluZWQgcG9zaXRpb25zIChpLmUuIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJQbGFjZXIuanN+U2VydmVyUGxhY2VyfSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBwbGFjZXIgPSBuZXcgQ2xpZW50UGxhY2VyKHsgY2FwYWNpdHk6IDEwMCB9KTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50UGxhY2VyIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0ncGxhY2VyJ10gLSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5tb2RlPSdncmFwaGljJ10gLSBTZWxlY3Rpb24gbW9kZS4gQ2FuIGJlOlxuICAgKiAtIGAnZ3JhcGhpYydgIHRvIHNlbGVjdCBhIHBsYWNlIG9uIGEgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhdmFpbGFibGUgcG9zaXRpb25zLlxuICAgKiAtIGAnbGlzdCdgIHRvIHNlbGVjdCBhIHBsYWNlIGFtb25nIGEgbGlzdCBvZiBwbGFjZXMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5wZXJzaXN0PWZhbHNlXSAtIERlZmluZXMgaWYgdGhlIGxvY2F0aW9uIHNob3VsZCBiZSBzdG9yZWQgaW4gYGxvY2FsU3RvcmFnZWAuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHzCoCdwbGFjZXInLCBvcHRpb25zKTtcblxuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgbW9kZTogJ2dyYXBoaWMnLFxuICAgICAgcGVyc2lzdDogZmFsc2UsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICAvLyB0aGlzLmxvY2FsU3RvcmFnZU5TID0gJ3BsYWNlcjpwb3NpdGlvbic7XG5cbiAgICB0aGlzLl9vblNldHVwUmVzcG9uc2UgPSB0aGlzLl9vblNldHVwUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblNlbGVjdCA9IHRoaXMuX29uU2VsZWN0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZGVsZXRlTG9jYWxTdG9yYWdlID0gdGhpcy5fZGVsZXRlTG9jYWxTdG9yYWdlLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgLyoqXG4gICAgICogSW5kZXggb2YgdGhlIHBvc2l0aW9uIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5pbmRleCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IG51bGw7XG5cbiAgICB0aGlzLnZpZXdDdG9yID0gU3F1YXJlZFZpZXc7XG4gICAgdGhpcy5jb250ZW50Lm1vZGUgPSB0aGlzLm9wdGlvbnMubW9kZTtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIC8vIGNoZWNrIGZvciBpbmZvcm1hdGlvbnMgaW4gbG9jYWwgc3RvcmFnZVxuICAgIC8vIGlmICh0aGlzLm9wdGlvbnMucGVyc2lzdCkge1xuICAgIC8vICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLl9yZXRyaWV2ZUxvY2FsU3RvcmFnZSgpO1xuXG4gICAgLy8gICBpZiAocG9zaXRpb24gIT09IG51bGwpIHtcbiAgICAvLyAgICAgdGhpcy5fc2VuZFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMuZG9uZSgpO1xuICAgIC8vICAgfVxuICAgIC8vIH1cblxuICAgIC8vIHJlcXVlc3QgcG9zaXRpb25zIG9yIGxhYmVsc1xuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcsIHRoaXMub3B0aW9ucy5tb2RlKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnc2V0dXAnLCB0aGlzLl9vblNldHVwUmVzcG9uc2UpO1xuICAgIHRoaXMucmVjZWl2ZSgncmVzZXQnLCB0aGlzLl9kZWxldGVMb2NhbFN0b3JhZ2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignc2V0dXAnLCB0aGlzLl9vblNldHVwUmVzcG9uc2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3Jlc2V0JywgdGhpcy5fZGVsZXRlTG9jYWxTdG9yYWdlKTtcbiAgfVxuXG4gIC8vIC8qKiBAcHJpdmF0ZSAqL1xuICAvLyByZXN0YXJ0KCkge1xuICAvLyAgIC8vIHN1cGVyLnJlc3RhcnQoKTsgLy8gQHRvZG8gLSBwcmVwYXJlIG5leHQgZ2VuIHNlcnZlciBzaWRlIGRiXG4gIC8vICAgdGhpcy5fc2VuZFBvc2l0aW9uKCk7XG4gIC8vIH1cblxuICAvLyBfc2V0TG9jYWxTdG9yYWdlKHBvc2l0aW9uKSB7XG4gIC8vICAgbG9jYWxTdG9yYWdlLnNldCh0aGlzLmxvY2FsU3RvcmFnZU5TLCBwb3NpdGlvbik7XG4gIC8vIH1cblxuICAvLyBfcmV0cmlldmVMb2NhbFN0b3JhZ2UoKSB7XG4gIC8vICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXQodGhpcy5sb2NhbFN0b3JhZ2VOUyk7XG4gIC8vIH1cblxuICAvLyBfZGVsZXRlTG9jYWxTdG9yYWdlKCkge1xuICAvLyAgIGxvY2FsU3RvcmFnZS5kZWxldGUodGhpcy5sb2NhbFN0b3JhZ2VOUyk7XG4gIC8vIH1cblxuICBfb25TZXR1cFJlc3BvbnNlKGNhcGFjaXR5LCBsYWJlbHMsIGNvb3JkaW5hdGVzLCBhcmVhKSB7XG4gICAgY29uc3QgbnVtTGFiZWxzID0gbGFiZWxzID8gbGFiZWxzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgIGNvbnN0IG51bUNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXMgPyBjb29yZGluYXRlcy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICBsZXQgbnVtUG9zaXRpb25zID0gTWF0aC5taW4obnVtTGFiZWxzLCBudW1Db29yZGluYXRlcyk7XG5cbiAgICBpZiAobnVtUG9zaXRpb25zID4gY2FwYWNpdHkpIHsgbnVtUG9zaXRpb25zID0gY2FwYWNpdHk7IH1cblxuICAgIGNvbnN0IHBvc2l0aW9ucyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Qb3NpdGlvbnM7IGkrKykge1xuICAgICAgY29uc3QgbGFiZWwgPSBsYWJlbHNbaV0gfHwgKGkgKyAxKS50b1N0cmluZygpO1xuXG4gICAgICAvLyBAdG9kbyAtIGRlZmluZSBpZiBjb29yZHMgc2hvdWxkIGJlIGFuIGFycmF5XG4gICAgICAvLyBvciBhbiBvYmplY3QgYW5kIGhhcm1vbml6ZSB3aXRoIFNwYWNlVmlldywgTG9jYXRvciwgZXRjLi4uXG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHsgaWQ6IGksIGluZGV4OiBpLCBsYWJlbDogbGFiZWwgfTtcblxuICAgICAgaWYgKGNvb3JkaW5hdGVzKSB7XG4gICAgICAgIGNvbnN0IGNvb3JkcyA9IGNvb3JkaW5hdGVzW2ldO1xuICAgICAgICBwb3NpdGlvbi54ID0gY29vcmRzWzBdO1xuICAgICAgICBwb3NpdGlvbi55ID0gY29vcmRzWzFdO1xuICAgICAgfVxuXG4gICAgICBwb3NpdGlvbnMucHVzaChwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgbGV0IHNlbGVjdG9yO1xuICAgIC8vIEB0b2RvIC0gZGlzYWJsZSBwb3NpdGlvbnMgc2VsZWN0ZWQgYnkgb3RoZXIgcGxheWVycyBpbiByZWFsIHRpbWVcbiAgICAvLyBAdG9kbyAtIGhhbmRsZSBlcnJvciBtZXNzYWdlc1xuICAgIHN3aXRjaCAodGhpcy5vcHRpb25zLm1vZGUpIHtcbiAgICAgIGNhc2UgJ2dyYXBoaWMnOlxuICAgICAgICBzZWxlY3RvciA9IG5ldyBTcGFjZVZpZXcoYXJlYSk7XG4gICAgICAgIHRoaXMudmlldy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnLCBzZWxlY3Rvcik7XG4gICAgICAgIHRoaXMudmlldy5yZW5kZXIoJy5zZWN0aW9uLXNxdWFyZScpO1xuXG4gICAgICAgIHNlbGVjdG9yLnNldFBvc2l0aW9ucyhwb3NpdGlvbnMpO1xuICAgICAgICBzZWxlY3Rvci5pbnN0YWxsRXZlbnRzKHtcbiAgICAgICAgICAnY2xpY2sgLnBvc2l0aW9uJzogKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gc2VsZWN0b3Iuc2hhcGVQb3NpdGlvbk1hcC5nZXQoZS50YXJnZXQpO1xuICAgICAgICAgICAgdGhpcy5fb25TZWxlY3QocG9zaXRpb24pO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICBzZWxlY3RvciA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgICAgICBpbnN0cnVjdGlvbnM6IHRoaXMuY29udGVudC5pbnN0cnVjdGlvbnMsXG4gICAgICAgICAgZW50cmllczogcG9zaXRpb25zLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy52aWV3LnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHNlbGVjdG9yKTtcbiAgICAgICAgdGhpcy52aWV3LnJlbmRlcignLnNlY3Rpb24tc3F1YXJlJyk7XG5cbiAgICAgICAgc2VsZWN0b3IuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAgICAgJ2NoYW5nZSc6IChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuc2hvd0J0biA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2VjdGlvbi1mbG9hdCcpO1xuICAgICAgICAgICAgdGhpcy52aWV3Lmluc3RhbGxFdmVudHMoe1xuICAgICAgICAgICAgICAnY2xpY2sgLmJ0bic6IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBzZWxlY3Rvci52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAocG9zaXRpb24pIHsgdGhpcy5fb25TZWxlY3QocG9zaXRpb24pOyB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBfb25TZWxlY3QocG9zaXRpb24pIHtcbiAgICAvLyBvcHRpb25hbGx5IHN0b3JlIGluIGxvY2FsIHN0b3JhZ2VcbiAgICBpZiAodGhpcy5vcHRpb25zLnBlcnNpc3QpXG4gICAgICAvLyB0aGlzLl9zZXRMb2NhbFN0b3JhZ2UocG9zaXRpb24pO1xuXG4gICAgLy8gc2VuZCB0byBzZXJ2ZXJcbiAgICB0aGlzLl9zZW5kUG9zaXRpb24ocG9zaXRpb24pO1xuICAgIC8vIEB0b2RvIC0gc2hvdWxkIGhhbmRsZSByZWplY3Rpb24gZnJvbSB0aGUgc2VydmVyIChgZG9uZWAgc2hvdWxkIGJlIGNhbGxlZCBvbmx5IG9uIHNlcnZlciBjb25maXJtYXRpb24vYWtub3dsZWRnZW1lbnQpLlxuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgX3NlbmRQb3NpdGlvbihwb3NpdGlvbiA9IG51bGwpIHtcbiAgICBpZiAocG9zaXRpb24gIT09IG51bGwpIHtcbiAgICAgIHRoaXMuaW5kZXggPSBwb3NpdGlvbi5pbmRleDtcbiAgICAgIHRoaXMubGFiZWwgPSBwb3NpdGlvbi5sYWJlbDtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IHBvc2l0aW9uLmNvb3JkaW5hdGVzO1xuICAgIH1cblxuICAgIHRoaXMuc2VuZCgncG9zaXRpb24nLCB0aGlzLmluZGV4LCB0aGlzLmxhYmVsLCBjbGllbnQuY29vcmRpbmF0ZXMpO1xuICB9XG59XG4iXX0=