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

var _localStorage = require('./localStorage');

var _localStorage2 = _interopRequireDefault(_localStorage);

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

var _displaySquaredView = require('./display/SquaredView');

var _displaySquaredView2 = _interopRequireDefault(_displaySquaredView);

var _displaySpaceView = require('./display/SpaceView');

var _displaySpaceView2 = _interopRequireDefault(_displaySpaceView);

var _displayTouchSurface = require('./display/TouchSurface');

var _displayTouchSurface2 = _interopRequireDefault(_displayTouchSurface);

/**
 * [client] Allow to indicate the approximate location of the client on a map.
 *
 * The module always has a view that displays the map and a button to validate the location.
 *
 * The module finishes its initialization after the user confirms his / her approximate location by clicking on the “Validate” button. For development purposes it can be configured to send random coordinates or retrieving previously stored location (see `options.random` and `options.persist`.
 *
 * (See also {@link src/server/ServerLocator.js~ServerLocator} on the server side.)
 *
 * @example
 * const locator = new ClientLocator();
 */

var ClientLocator = (function (_ClientModule) {
  _inherits(ClientLocator, _ClientModule);

  /**
   * @param {Object} [options={}] - Options.
   * @param {String} [options.name='locator'] - The name of the module.
   * @param {Boolean} [options.random=false] - Send random position to the server and call `this.done()` (for development purpose)
   * @param {Boolean} [options.persist=false] - If set to `true`, store the normalized coordinates in `localStorage` and retrieve them in subsequent calls. Delete the stored position when set to `false`. (for development purpose)
   */

  function ClientLocator() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientLocator);

    _get(Object.getPrototypeOf(ClientLocator.prototype), 'constructor', this).call(this, options.name || 'locator', options);

    this.options = _Object$assign({
      random: false,
      persist: false,
      positionRadius: 0.3, // relative to the area unit
      spaceCtor: _displaySpaceView2['default'],
      viewCtor: _displaySquaredView2['default']
    }, options);

    // The namespace where coordinates are stored when `options.persist = true`.
    this._localStorageNamespace = 'soundworks:' + this.name;

    this._onAreaTouchStart = this._onAreaTouchStart.bind(this);
    this._onAreaTouchMove = this._onAreaTouchMove.bind(this);
    this._onAreaResponse = this._onAreaResponse.bind(this);

    this.init();
  }

  /** @private */

  _createClass(ClientLocator, [{
    key: 'init',
    value: function init() {
      this.viewCtor = this.options.viewCtor;
      this.view = this.createView();
    }

    /** @private */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'start', this).call(this);

      this.send('request');

      if (!this.options.persist) _localStorage2['default']['delete'](this._localStorageNamespace);

      this.receive('area', this._onAreaResponse);
    }

    /** @private */
  }, {
    key: 'stop',
    value: function stop() {
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'stop', this).call(this);
      this.removeListener('area', this._onAreaResponse);
    }

    /**
     * Bypass the locator according to module configuration options.
     * If `options.random` is set to true, use random coordinates.
     * If `options.persist` is set to true use coordinates stored in local storage,
     * do nothing when no coordinates are stored yet.
     * @param {Object} area - The area as defined in server configuration.
     */
  }, {
    key: '_onAreaResponse',
    value: function _onAreaResponse(area) {
      this._attachArea(area);

      if (this.options.random || this.options.persist) {
        var coords = undefined;

        if (this.options.random) {
          coords = { normX: Math.random(), normY: Math.random() };
        } else if (this.options.persist) {
          coords = JSON.parse(_localStorage2['default'].get(this._localStorageNamespace));
        }

        if (coords !== null) {
          this._createPosition(coords.normX, coords.normY);
          this._sendCoordinates();
        }
      }
    }

    /**
     * Store the current coordinates in `localStorage`.
     */
  }, {
    key: 'storeCoordinates',
    value: function storeCoordinates() {
      var normX = this.position.x / this.area.width;
      var normY = this.position.y / this.area.height;
      _localStorage2['default'].set(this._localStorageNamespace, JSON.stringify({ normX: normX, normY: normY }));
    }
  }, {
    key: 'retrieveCoordinates',
    value: function retrieveCoordinates() {}
  }, {
    key: 'deleteCoordinates',
    value: function deleteCoordinates() {}

    /**
     * Create a `SpaceView` and display it in the square section of the view
     */
  }, {
    key: '_attachArea',
    value: function _attachArea(area) {
      this.area = area;
      this.space = new this.options.spaceCtor(area, {}, { isSubView: true });
      // @todo - find a way to remove these hardcoded selectors
      this.view.setViewComponent('.section-square', this.space);
      this.view.render('.section-square');
      // touchSurface on $svg
      this.surface = new _displayTouchSurface2['default'](this.space.$svg);
      this.surface.addListener('touchstart', this._onAreaTouchStart);
      this.surface.addListener('touchmove', this._onAreaTouchMove);
    }
  }, {
    key: '_onAreaTouchStart',
    value: function _onAreaTouchStart(id, normX, normY) {
      var _this = this;

      if (!this.position) {
        this._createPosition(normX, normY);

        this.content.showBtn = true;
        this.view.render('.section-float');
        this.view.installEvents({
          'click .btn': function clickBtn(e) {
            e.target.setAttribute('disabled', true);
            _this._sendCoordinates();
          }
        });
      } else {
        this._updatePosition(normX, normY);
      }
    }
  }, {
    key: '_onAreaTouchMove',
    value: function _onAreaTouchMove(id, normX, normY) {
      this._updatePosition(normX, normY);
    }

    /**
     * Creates the position object according to normalized coordinates.
     * @param {Number} normX - The normalized coordinate in the x axis.
     * @param {Number} normY - The normalized coordinate in the y axis.
     */
  }, {
    key: '_createPosition',
    value: function _createPosition(normX, normY) {
      this.position = {
        id: 'locator',
        x: normX * this.area.width,
        y: normY * this.area.height,
        radius: this.options.positionRadius
      };

      this.space.addPoint(this.position);
    }

    /**
     * Updates the position object according to normalized coordinates.
     * @param {Number} normX - The normalized coordinate in the x axis.
     * @param {Number} normY - The normalized coordinate in the y axis.
     */
  }, {
    key: '_updatePosition',
    value: function _updatePosition(normX, normY) {
      this.position.x = normX * this.area.width;
      this.position.y = normY * this.area.height;

      this.space.updatePoint(this.position);
    }

    /**
     * Send coordinates to the server.
     */
  }, {
    key: '_sendCoordinates',
    value: function _sendCoordinates() {
      if (this.options.persist) {
        // store normalized coordinates
        this.storeCoordinates();
      }

      _client2['default'].coordinates = this.position;
      this.send('coordinates', _client2['default'].coordinates);
      this.done();
    }
  }]);

  return ClientLocator;
})(_ClientModule3['default']);

exports['default'] = ClientLocator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50TG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQW1CLFVBQVU7Ozs7NEJBQ0osZ0JBQWdCOzs7OzZCQUNoQixnQkFBZ0I7Ozs7a0NBQ2pCLHVCQUF1Qjs7OztnQ0FDekIscUJBQXFCOzs7O21DQUNsQix3QkFBd0I7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZTVCLGFBQWE7WUFBYixhQUFhOzs7Ozs7Ozs7QUFPckIsV0FQUSxhQUFhLEdBT047UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVBMLGFBQWE7O0FBUTlCLCtCQVJpQixhQUFhLDZDQVF4QixPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRSxPQUFPLEVBQUU7O0FBRTFDLFFBQUksQ0FBQyxPQUFPLEdBQUcsZUFBYztBQUMzQixZQUFNLEVBQUUsS0FBSztBQUNiLGFBQU8sRUFBRSxLQUFLO0FBQ2Qsb0JBQWMsRUFBRSxHQUFHO0FBQ25CLGVBQVMsK0JBQVc7QUFDcEIsY0FBUSxpQ0FBYTtLQUN0QixFQUFFLE9BQU8sQ0FBQyxDQUFDOzs7QUFHWixRQUFJLENBQUMsc0JBQXNCLG1CQUFpQixJQUFJLENBQUMsSUFBSSxBQUFFLENBQUM7O0FBRXhELFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNELFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pELFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXZELFFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNiOzs7O2VBMUJrQixhQUFhOztXQTZCNUIsZ0JBQUc7QUFDTCxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMs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QUFBOztBQUVELFVBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNwQzs7Ozs7Ozs7O1dBT2MseUJBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUM1QixVQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDMUMsVUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUUzQyxVQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDdkM7Ozs7Ozs7V0FLZSw0QkFBRztBQUNqQixVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFOztBQUN4QixZQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztPQUN6Qjs7QUFFRCwwQkFBTyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNuQyxVQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxvQkFBTyxXQUFXLENBQUMsQ0FBQztBQUM3QyxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1NBcktrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudExvY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBsb2NhbFN0b3JhZ2UgZnJvbSAnLi9sb2NhbFN0b3JhZ2UnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgU3F1YXJlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NxdWFyZWRWaWV3JztcbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi9kaXNwbGF5L1NwYWNlVmlldyc7XG5pbXBvcnQgVG91Y2hTdXJmYWNlIGZyb20gJy4vZGlzcGxheS9Ub3VjaFN1cmZhY2UnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gQWxsb3cgdG8gaW5kaWNhdGUgdGhlIGFwcHJveGltYXRlIGxvY2F0aW9uIG9mIHRoZSBjbGllbnQgb24gYSBtYXAuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgaGFzIGEgdmlldyB0aGF0IGRpc3BsYXlzIHRoZSBtYXAgYW5kIGEgYnV0dG9uIHRvIHZhbGlkYXRlIHRoZSBsb2NhdGlvbi5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBhZnRlciB0aGUgdXNlciBjb25maXJtcyBoaXMgLyBoZXIgYXBwcm94aW1hdGUgbG9jYXRpb24gYnkgY2xpY2tpbmcgb24gdGhlIOKAnFZhbGlkYXRl4oCdIGJ1dHRvbi4gRm9yIGRldmVsb3BtZW50IHB1cnBvc2VzIGl0IGNhbiBiZSBjb25maWd1cmVkIHRvIHNlbmQgcmFuZG9tIGNvb3JkaW5hdGVzIG9yIHJldHJpZXZpbmcgcHJldmlvdXNseSBzdG9yZWQgbG9jYXRpb24gKHNlZSBgb3B0aW9ucy5yYW5kb21gIGFuZCBgb3B0aW9ucy5wZXJzaXN0YC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyTG9jYXRvci5qc35TZXJ2ZXJMb2NhdG9yfSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBsb2NhdG9yID0gbmV3IENsaWVudExvY2F0b3IoKTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50TG9jYXRvciBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIC0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J2xvY2F0b3InXSAtIFRoZSBuYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucmFuZG9tPWZhbHNlXSAtIFNlbmQgcmFuZG9tIHBvc2l0aW9uIHRvIHRoZSBzZXJ2ZXIgYW5kIGNhbGwgYHRoaXMuZG9uZSgpYCAoZm9yIGRldmVsb3BtZW50IHB1cnBvc2UpXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucGVyc2lzdD1mYWxzZV0gLSBJZiBzZXQgdG8gYHRydWVgLCBzdG9yZSB0aGUgbm9ybWFsaXplZCBjb29yZGluYXRlcyBpbiBgbG9jYWxTdG9yYWdlYCBhbmQgcmV0cmlldmUgdGhlbSBpbiBzdWJzZXF1ZW50IGNhbGxzLiBEZWxldGUgdGhlIHN0b3JlZCBwb3NpdGlvbiB3aGVuIHNldCB0byBgZmFsc2VgLiAoZm9yIGRldmVsb3BtZW50IHB1cnBvc2UpXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2xvY2F0b3InLCBvcHRpb25zKTtcblxuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgcmFuZG9tOiBmYWxzZSxcbiAgICAgIHBlcnNpc3Q6IGZhbHNlLFxuICAgICAgcG9zaXRpb25SYWRpdXM6IDAuMywgLy8gcmVsYXRpdmUgdG8gdGhlIGFyZWEgdW5pdFxuICAgICAgc3BhY2VDdG9yOiBTcGFjZVZpZXcsXG4gICAgICB2aWV3Q3RvcjogU3F1YXJlZFZpZXcsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICAvLyBUaGUgbmFtZXNwYWNlIHdoZXJlIGNvb3JkaW5hdGVzIGFyZSBzdG9yZWQgd2hlbiBgb3B0aW9ucy5wZXJzaXN0ID0gdHJ1ZWAuXG4gICAgdGhpcy5fbG9jYWxTdG9yYWdlTmFtZXNwYWNlID0gYHNvdW5kd29ya3M6JHt0aGlzLm5hbWV9YDtcblxuICAgIHRoaXMuX29uQXJlYVRvdWNoU3RhcnQgPSB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25BcmVhVG91Y2hNb3ZlID0gdGhpcy5fb25BcmVhVG91Y2hNb3ZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25BcmVhUmVzcG9uc2UgPSB0aGlzLl9vbkFyZWFSZXNwb25zZS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcblxuICAgIGlmICghdGhpcy5vcHRpb25zLnBlcnNpc3QpXG4gICAgICBsb2NhbFN0b3JhZ2UuZGVsZXRlKHRoaXMuX2xvY2FsU3RvcmFnZU5hbWVzcGFjZSk7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ2FyZWEnLCB0aGlzLl9vbkFyZWFSZXNwb25zZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignYXJlYScsIHRoaXMuX29uQXJlYVJlc3BvbnNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCeXBhc3MgdGhlIGxvY2F0b3IgYWNjb3JkaW5nIHRvIG1vZHVsZSBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIElmIGBvcHRpb25zLnJhbmRvbWAgaXMgc2V0IHRvIHRydWUsIHVzZSByYW5kb20gY29vcmRpbmF0ZXMuXG4gICAqIElmIGBvcHRpb25zLnBlcnNpc3RgIGlzIHNldCB0byB0cnVlIHVzZSBjb29yZGluYXRlcyBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZSxcbiAgICogZG8gbm90aGluZyB3aGVuIG5vIGNvb3JkaW5hdGVzIGFyZSBzdG9yZWQgeWV0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIFRoZSBhcmVhIGFzIGRlZmluZWQgaW4gc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBfb25BcmVhUmVzcG9uc2UoYXJlYSkge1xuICAgIHRoaXMuX2F0dGFjaEFyZWEoYXJlYSk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnJhbmRvbSB8fMKgdGhpcy5vcHRpb25zLnBlcnNpc3QpIHtcbiAgICAgIGxldCBjb29yZHM7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucmFuZG9tKSB7XG4gICAgICAgIGNvb3JkcyA9IHsgbm9ybVg6IE1hdGgucmFuZG9tKCksIG5vcm1ZOiBNYXRoLnJhbmRvbSgpIH07XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5wZXJzaXN0KSB7XG4gICAgICAgIGNvb3JkcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldCh0aGlzLl9sb2NhbFN0b3JhZ2VOYW1lc3BhY2UpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvb3JkcyAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9jcmVhdGVQb3NpdGlvbihjb29yZHMubm9ybVgsIGNvb3Jkcy5ub3JtWSk7XG4gICAgICAgIHRoaXMuX3NlbmRDb29yZGluYXRlcygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9yZSB0aGUgY3VycmVudCBjb29yZGluYXRlcyBpbiBgbG9jYWxTdG9yYWdlYC5cbiAgICovXG4gIHN0b3JlQ29vcmRpbmF0ZXMoKSB7XG4gICAgY29uc3Qgbm9ybVggPSB0aGlzLnBvc2l0aW9uLnggLyB0aGlzLmFyZWEud2lkdGg7XG4gICAgY29uc3Qgbm9ybVkgPSB0aGlzLnBvc2l0aW9uLnkgLyB0aGlzLmFyZWEuaGVpZ2h0O1xuICAgIGxvY2FsU3RvcmFnZS5zZXQodGhpcy5fbG9jYWxTdG9yYWdlTmFtZXNwYWNlLCBKU09OLnN0cmluZ2lmeSh7IG5vcm1YLCBub3JtWSB9KSk7XG4gIH1cblxuICByZXRyaWV2ZUNvb3JkaW5hdGVzKCkge31cbiAgZGVsZXRlQ29vcmRpbmF0ZXMoKSB7fVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBgU3BhY2VWaWV3YCBhbmQgZGlzcGxheSBpdCBpbiB0aGUgc3F1YXJlIHNlY3Rpb24gb2YgdGhlIHZpZXdcbiAgICovXG4gIF9hdHRhY2hBcmVhKGFyZWEpIHtcbiAgICB0aGlzLmFyZWEgPSBhcmVhO1xuICAgIHRoaXMuc3BhY2UgPSBuZXcgdGhpcy5vcHRpb25zLnNwYWNlQ3RvcihhcmVhLCB7fSwgeyBpc1N1YlZpZXc6IHRydWUgfSk7XG4gICAgLy8gQHRvZG8gLSBmaW5kIGEgd2F5IHRvIHJlbW92ZSB0aGVzZSBoYXJkY29kZWQgc2VsZWN0b3JzXG4gICAgdGhpcy52aWV3LnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc3BhY2UpO1xuICAgIHRoaXMudmlldy5yZW5kZXIoJy5zZWN0aW9uLXNxdWFyZScpO1xuICAgIC8vIHRvdWNoU3VyZmFjZSBvbiAkc3ZnXG4gICAgdGhpcy5zdXJmYWNlID0gbmV3IFRvdWNoU3VyZmFjZSh0aGlzLnNwYWNlLiRzdmcpO1xuICAgIHRoaXMuc3VyZmFjZS5hZGRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX29uQXJlYVRvdWNoU3RhcnQpO1xuICAgIHRoaXMuc3VyZmFjZS5hZGRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5fb25BcmVhVG91Y2hNb3ZlKTtcbiAgfVxuXG4gIF9vbkFyZWFUb3VjaFN0YXJ0KGlkLCBub3JtWCwgbm9ybVkpIHtcbiAgICBpZiAoIXRoaXMucG9zaXRpb24pIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG5cbiAgICAgIHRoaXMuY29udGVudC5zaG93QnRuID0gdHJ1ZTtcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoJy5zZWN0aW9uLWZsb2F0Jyk7XG4gICAgICB0aGlzLnZpZXcuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAgICdjbGljayAuYnRuJzogKGUpID0+IHtcbiAgICAgICAgICBlLnRhcmdldC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgdGhpcy5fc2VuZENvb3JkaW5hdGVzKCk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24obm9ybVgsIG5vcm1ZKTtcbiAgICB9XG4gIH1cblxuICBfb25BcmVhVG91Y2hNb3ZlKGlkLCBub3JtWCwgbm9ybVkpIHtcbiAgICB0aGlzLl91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIHBvc2l0aW9uIG9iamVjdCBhY2NvcmRpbmcgdG8gbm9ybWFsaXplZCBjb29yZGluYXRlcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5vcm1YIC0gVGhlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZSBpbiB0aGUgeCBheGlzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbm9ybVkgLSBUaGUgbm9ybWFsaXplZCBjb29yZGluYXRlIGluIHRoZSB5IGF4aXMuXG4gICAqL1xuICBfY3JlYXRlUG9zaXRpb24obm9ybVgsIG5vcm1ZKSB7XG4gICAgdGhpcy5wb3NpdGlvbiA9IHtcbiAgICAgIGlkOiAnbG9jYXRvcicsXG4gICAgICB4OiBub3JtWCAqIHRoaXMuYXJlYS53aWR0aCxcbiAgICAgIHk6IG5vcm1ZICogdGhpcy5hcmVhLmhlaWdodCxcbiAgICAgIHJhZGl1czogdGhpcy5vcHRpb25zLnBvc2l0aW9uUmFkaXVzLFxuICAgIH1cblxuICAgIHRoaXMuc3BhY2UuYWRkUG9pbnQodGhpcy5wb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcG9zaXRpb24gb2JqZWN0IGFjY29yZGluZyB0byBub3JtYWxpemVkIGNvb3JkaW5hdGVzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbm9ybVggLSBUaGUgbm9ybWFsaXplZCBjb29yZGluYXRlIGluIHRoZSB4IGF4aXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBub3JtWSAtIFRoZSBub3JtYWxpemVkIGNvb3JkaW5hdGUgaW4gdGhlIHkgYXhpcy5cbiAgICovXG4gIF91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnggPSBub3JtWCAqIHRoaXMuYXJlYS53aWR0aDtcbiAgICB0aGlzLnBvc2l0aW9uLnkgPSBub3JtWSAqIHRoaXMuYXJlYS5oZWlnaHQ7XG5cbiAgICB0aGlzLnNwYWNlLnVwZGF0ZVBvaW50KHRoaXMucG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgY29vcmRpbmF0ZXMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIF9zZW5kQ29vcmRpbmF0ZXMoKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5wZXJzaXN0KSB7IC8vIHN0b3JlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZXNcbiAgICAgIHRoaXMuc3RvcmVDb29yZGluYXRlcygpO1xuICAgIH1cblxuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IHRoaXMucG9zaXRpb247XG4gICAgdGhpcy5zZW5kKCdjb29yZGluYXRlcycsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cbn1cbiJdfQ==