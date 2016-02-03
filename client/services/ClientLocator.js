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

// import localStorage from './localStorage'; // @todo - rethink this with db

var _coreService = require('../core/Service');

var _coreService2 = _interopRequireDefault(_coreService);

var _coreServiceManager = require('../core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

var _displaySpaceView = require('../display/SpaceView');

var _displaySpaceView2 = _interopRequireDefault(_displaySpaceView);

var _displaySquaredView = require('../display/SquaredView');

var _displaySquaredView2 = _interopRequireDefault(_displaySquaredView);

var _displayTouchSurface = require('../display/TouchSurface');

var _displayTouchSurface2 = _interopRequireDefault(_displayTouchSurface);

var SERVICE_ID = 'service:locator';

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

var ClientLocator = (function (_Service) {
  _inherits(ClientLocator, _Service);

  /**
   * @param {Object} [options={}] - Options.
   * @param {String} [options.name='locator'] - The name of the module.
   * @param {Boolean} [options.random=false] - Send random position to the server and call `this.done()` (for development purpose)
   * @param {Boolean} [options.persist=false] - If set to `true`, store the normalized coordinates in `localStorage` and retrieve them in subsequent calls. Delete the stored position when set to `false`. (for development purpose)
   */

  function ClientLocator() {
    _classCallCheck(this, ClientLocator);

    _get(Object.getPrototypeOf(ClientLocator.prototype), 'constructor', this).call(this, SERVICE_ID);

    var defaults = {
      // @todo - re-think this with db
      // random: false,
      // persist: false,
      positionRadius: 0.3, // relative to the area unit
      spaceCtor: _displaySpaceView2['default'],
      viewCtor: _displaySquaredView2['default']
    };

    this.configure(defaults);

    // The namespace where coordinates are stored when `options.persist = true`.
    // this._localStorageNamespace = `soundworks:${this.name}`;

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

      if (!this.hasStarted) this.init();

      this.show();

      this.send('request');

      // if (!this.options.persist)
      //   localStorage.delete(this._localStorageNamespace);

      this.receive('area', this._onAreaResponse);
    }

    /** @private */
  }, {
    key: 'stop',
    value: function stop() {
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'stop', this).call(this);

      this.hide();
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

      // if (this.options.random || this.options.persist) {
      //   let coords;

      //   if (this.options.random) {
      //     coords = { normX: Math.random(), normY: Math.random() };
      //   } else if (this.options.persist) {
      //     coords = JSON.parse(localStorage.get(this._localStorageNamespace));
      //   }

      //   if (coords !== null) {
      //     this._createPosition(coords.normX, coords.normY);
      //     this._sendCoordinates();
      //   }
      // }
    }

    /**
     * Store the current coordinates in `localStorage`.
     */
    // storeCoordinates() {
    //   const normX = this.position.x / this.area.width;
    //   const normY = this.position.y / this.area.height;
    //   localStorage.set(this._localStorageNamespace, JSON.stringify({ normX, normY }));
    // }

    // retrieveCoordinates() {}
    // deleteCoordinates() {}

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
      // if (this.options.persist) { // store normalized coordinates
      //   this.storeCoordinates();
      // }

      _coreClient2['default'].coordinates = this.position;
      this.send('coordinates', _coreClient2['default'].coordinates);
      this.ready();
    }
  }]);

  return ClientLocator;
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, ClientLocator);

exports['default'] = ClientLocator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50TG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUFtQixnQkFBZ0I7Ozs7OzsyQkFFZixpQkFBaUI7Ozs7a0NBQ1Ysd0JBQXdCOzs7O2dDQUM3QixzQkFBc0I7Ozs7a0NBQ3BCLHdCQUF3Qjs7OzttQ0FDdkIseUJBQXlCOzs7O0FBRWxELElBQU0sVUFBVSxHQUFHLGlCQUFpQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7SUFjL0IsYUFBYTtZQUFiLGFBQWE7Ozs7Ozs7OztBQU9OLFdBUFAsYUFBYSxHQU9IOzBCQVBWLGFBQWE7O0FBUWYsK0JBUkUsYUFBYSw2Q0FRVCxVQUFVLEVBQUU7O0FBRWxCLFFBQU0sUUFBUSxHQUFHOzs7O0FBSWYsb0JBQWMsRUFBRSxHQUFHO0FBQ25CLGVBQVMsK0JBQVc7QUFDcEIsY0FBUSxpQ0FBYTtLQUN0QixDQUFDOztBQUVGLFFBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7O0FBS3pCLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNELFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pELFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXZELFFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNiOzs7O2VBN0JHLGFBQWE7O1dBZ0NiLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUN0QyxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztLQUMvQjs7Ozs7V0FHSSxpQkFBRztBQUNOLGlDQXZDRSxhQUFhLHVDQXVDRDs7QUFFZCxVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFDbEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVkLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFWixVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7OztBQUtyQixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDNUM7Ozs7O1dBR0csZ0JBQUc7QUFDTCxpQ0F4REUsYUFBYSxzQ0F3REY7O0FBRWIsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1osVUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ25EOzs7Ozs7Ozs7OztXQVNjLHlCQUFDLElBQUksRUFBRTtBQUNwQixVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0tBZ0J4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQWlCVSxxQkFBQyxJQUFJLEVBQUU7QUFDaEIsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQzs7QUFFdkUsVUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUQsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7QUFFcEMsVUFBSSxDQUFDLE9BQU8sR0FBRyxxQ0FBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRCxVQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDL0QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBQzlEOzs7V0FFZ0IsMkJBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7OztBQUNsQyxVQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNsQixZQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFbkMsWUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQzVCLFlBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDbkMsWUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7QUFDdEIsc0JBQVksRUFBRSxrQkFBQyxDQUFDLEVBQUs7QUFDbkIsYUFBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3hDLGtCQUFLLGdCQUFnQixFQUFFLENBQUM7V0FDekI7U0FDRixDQUFDLENBQUM7T0FDSixNQUFNO0FBQ0wsWUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDcEM7S0FDRjs7O1dBRWUsMEJBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDakMsVUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDcEM7Ozs7Ozs7OztXQU9jLHlCQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDNUIsVUFBSSxDQUFDLFFBQVEsR0FBRztBQUNkLFVBQUUsRUFBRSxTQUFTO0FBQ2IsU0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7QUFDMUIsU0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07QUFDM0IsY0FBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYztPQUNwQyxDQUFBOztBQUVELFVBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNwQzs7Ozs7Ozs7O1dBT2MseUJBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUM1QixVQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDMUMsVUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUUzQyxVQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDdkM7Ozs7Ozs7V0FLZSw0QkFBRzs7Ozs7QUFLakIsOEJBQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDbkMsVUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsd0JBQU8sV0FBVyxDQUFDLENBQUM7QUFDN0MsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2Q7OztTQS9LRyxhQUFhOzs7QUFrTG5CLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7O3FCQUVwQyxhQUFhIiwiZmlsZSI6InNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50TG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuLy8gaW1wb3J0IGxvY2FsU3RvcmFnZSBmcm9tICcuL2xvY2FsU3RvcmFnZSc7IC8vIEB0b2RvIC0gcmV0aGluayB0aGlzIHdpdGggZGJcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4uL2Rpc3BsYXkvU3BhY2VWaWV3JztcbmltcG9ydCBTcXVhcmVkVmlldyBmcm9tICcuLi9kaXNwbGF5L1NxdWFyZWRWaWV3JztcbmltcG9ydCBUb3VjaFN1cmZhY2UgZnJvbSAnLi4vZGlzcGxheS9Ub3VjaFN1cmZhY2UnO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bG9jYXRvcic7XG5cbi8qKlxuICogW2NsaWVudF0gQWxsb3cgdG8gaW5kaWNhdGUgdGhlIGFwcHJveGltYXRlIGxvY2F0aW9uIG9mIHRoZSBjbGllbnQgb24gYSBtYXAuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgaGFzIGEgdmlldyB0aGF0IGRpc3BsYXlzIHRoZSBtYXAgYW5kIGEgYnV0dG9uIHRvIHZhbGlkYXRlIHRoZSBsb2NhdGlvbi5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBhZnRlciB0aGUgdXNlciBjb25maXJtcyBoaXMgLyBoZXIgYXBwcm94aW1hdGUgbG9jYXRpb24gYnkgY2xpY2tpbmcgb24gdGhlIOKAnFZhbGlkYXRl4oCdIGJ1dHRvbi4gRm9yIGRldmVsb3BtZW50IHB1cnBvc2VzIGl0IGNhbiBiZSBjb25maWd1cmVkIHRvIHNlbmQgcmFuZG9tIGNvb3JkaW5hdGVzIG9yIHJldHJpZXZpbmcgcHJldmlvdXNseSBzdG9yZWQgbG9jYXRpb24gKHNlZSBgb3B0aW9ucy5yYW5kb21gIGFuZCBgb3B0aW9ucy5wZXJzaXN0YC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyTG9jYXRvci5qc35TZXJ2ZXJMb2NhdG9yfSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBsb2NhdG9yID0gbmV3IENsaWVudExvY2F0b3IoKTtcbiAqL1xuY2xhc3MgQ2xpZW50TG9jYXRvciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSAtIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdsb2NhdG9yJ10gLSBUaGUgbmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnJhbmRvbT1mYWxzZV0gLSBTZW5kIHJhbmRvbSBwb3NpdGlvbiB0byB0aGUgc2VydmVyIGFuZCBjYWxsIGB0aGlzLmRvbmUoKWAgKGZvciBkZXZlbG9wbWVudCBwdXJwb3NlKVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnBlcnNpc3Q9ZmFsc2VdIC0gSWYgc2V0IHRvIGB0cnVlYCwgc3RvcmUgdGhlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZXMgaW4gYGxvY2FsU3RvcmFnZWAgYW5kIHJldHJpZXZlIHRoZW0gaW4gc3Vic2VxdWVudCBjYWxscy4gRGVsZXRlIHRoZSBzdG9yZWQgcG9zaXRpb24gd2hlbiBzZXQgdG8gYGZhbHNlYC4gKGZvciBkZXZlbG9wbWVudCBwdXJwb3NlKVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIC8vIEB0b2RvIC0gcmUtdGhpbmsgdGhpcyB3aXRoIGRiXG4gICAgICAvLyByYW5kb206IGZhbHNlLFxuICAgICAgLy8gcGVyc2lzdDogZmFsc2UsXG4gICAgICBwb3NpdGlvblJhZGl1czogMC4zLCAvLyByZWxhdGl2ZSB0byB0aGUgYXJlYSB1bml0XG4gICAgICBzcGFjZUN0b3I6IFNwYWNlVmlldyxcbiAgICAgIHZpZXdDdG9yOiBTcXVhcmVkVmlldyxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgLy8gVGhlIG5hbWVzcGFjZSB3aGVyZSBjb29yZGluYXRlcyBhcmUgc3RvcmVkIHdoZW4gYG9wdGlvbnMucGVyc2lzdCA9IHRydWVgLlxuICAgIC8vIHRoaXMuX2xvY2FsU3RvcmFnZU5hbWVzcGFjZSA9IGBzb3VuZHdvcmtzOiR7dGhpcy5uYW1lfWA7XG5cbiAgICB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0ID0gdGhpcy5fb25BcmVhVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQXJlYVRvdWNoTW92ZSA9IHRoaXMuX29uQXJlYVRvdWNoTW92ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQXJlYVJlc3BvbnNlID0gdGhpcy5fb25BcmVhUmVzcG9uc2UuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGluaXQoKSB7XG4gICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2hvdygpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG5cbiAgICAvLyBpZiAoIXRoaXMub3B0aW9ucy5wZXJzaXN0KVxuICAgIC8vICAgbG9jYWxTdG9yYWdlLmRlbGV0ZSh0aGlzLl9sb2NhbFN0b3JhZ2VOYW1lc3BhY2UpO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdhcmVhJywgdGhpcy5fb25BcmVhUmVzcG9uc2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuXG4gICAgdGhpcy5oaWRlKCk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignYXJlYScsIHRoaXMuX29uQXJlYVJlc3BvbnNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCeXBhc3MgdGhlIGxvY2F0b3IgYWNjb3JkaW5nIHRvIG1vZHVsZSBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIElmIGBvcHRpb25zLnJhbmRvbWAgaXMgc2V0IHRvIHRydWUsIHVzZSByYW5kb20gY29vcmRpbmF0ZXMuXG4gICAqIElmIGBvcHRpb25zLnBlcnNpc3RgIGlzIHNldCB0byB0cnVlIHVzZSBjb29yZGluYXRlcyBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZSxcbiAgICogZG8gbm90aGluZyB3aGVuIG5vIGNvb3JkaW5hdGVzIGFyZSBzdG9yZWQgeWV0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIFRoZSBhcmVhIGFzIGRlZmluZWQgaW4gc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBfb25BcmVhUmVzcG9uc2UoYXJlYSkge1xuICAgIHRoaXMuX2F0dGFjaEFyZWEoYXJlYSk7XG5cbiAgICAvLyBpZiAodGhpcy5vcHRpb25zLnJhbmRvbSB8fMKgdGhpcy5vcHRpb25zLnBlcnNpc3QpIHtcbiAgICAvLyAgIGxldCBjb29yZHM7XG5cbiAgICAvLyAgIGlmICh0aGlzLm9wdGlvbnMucmFuZG9tKSB7XG4gICAgLy8gICAgIGNvb3JkcyA9IHsgbm9ybVg6IE1hdGgucmFuZG9tKCksIG5vcm1ZOiBNYXRoLnJhbmRvbSgpIH07XG4gICAgLy8gICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5wZXJzaXN0KSB7XG4gICAgLy8gICAgIGNvb3JkcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldCh0aGlzLl9sb2NhbFN0b3JhZ2VOYW1lc3BhY2UpKTtcbiAgICAvLyAgIH1cblxuICAgIC8vICAgaWYgKGNvb3JkcyAhPT0gbnVsbCkge1xuICAgIC8vICAgICB0aGlzLl9jcmVhdGVQb3NpdGlvbihjb29yZHMubm9ybVgsIGNvb3Jkcy5ub3JtWSk7XG4gICAgLy8gICAgIHRoaXMuX3NlbmRDb29yZGluYXRlcygpO1xuICAgIC8vICAgfVxuICAgIC8vIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9yZSB0aGUgY3VycmVudCBjb29yZGluYXRlcyBpbiBgbG9jYWxTdG9yYWdlYC5cbiAgICovXG4gIC8vIHN0b3JlQ29vcmRpbmF0ZXMoKSB7XG4gIC8vICAgY29uc3Qgbm9ybVggPSB0aGlzLnBvc2l0aW9uLnggLyB0aGlzLmFyZWEud2lkdGg7XG4gIC8vICAgY29uc3Qgbm9ybVkgPSB0aGlzLnBvc2l0aW9uLnkgLyB0aGlzLmFyZWEuaGVpZ2h0O1xuICAvLyAgIGxvY2FsU3RvcmFnZS5zZXQodGhpcy5fbG9jYWxTdG9yYWdlTmFtZXNwYWNlLCBKU09OLnN0cmluZ2lmeSh7IG5vcm1YLCBub3JtWSB9KSk7XG4gIC8vIH1cblxuICAvLyByZXRyaWV2ZUNvb3JkaW5hdGVzKCkge31cbiAgLy8gZGVsZXRlQ29vcmRpbmF0ZXMoKSB7fVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBgU3BhY2VWaWV3YCBhbmQgZGlzcGxheSBpdCBpbiB0aGUgc3F1YXJlIHNlY3Rpb24gb2YgdGhlIHZpZXdcbiAgICovXG4gIF9hdHRhY2hBcmVhKGFyZWEpIHtcbiAgICB0aGlzLmFyZWEgPSBhcmVhO1xuICAgIHRoaXMuc3BhY2UgPSBuZXcgdGhpcy5vcHRpb25zLnNwYWNlQ3RvcihhcmVhLCB7fSwgeyBpc1N1YlZpZXc6IHRydWUgfSk7XG4gICAgLy8gQHRvZG8gLSBmaW5kIGEgd2F5IHRvIHJlbW92ZSB0aGVzZSBoYXJkY29kZWQgc2VsZWN0b3JzXG4gICAgdGhpcy52aWV3LnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc3BhY2UpO1xuICAgIHRoaXMudmlldy5yZW5kZXIoJy5zZWN0aW9uLXNxdWFyZScpO1xuICAgIC8vIHRvdWNoU3VyZmFjZSBvbiAkc3ZnXG4gICAgdGhpcy5zdXJmYWNlID0gbmV3IFRvdWNoU3VyZmFjZSh0aGlzLnNwYWNlLiRzdmcpO1xuICAgIHRoaXMuc3VyZmFjZS5hZGRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX29uQXJlYVRvdWNoU3RhcnQpO1xuICAgIHRoaXMuc3VyZmFjZS5hZGRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5fb25BcmVhVG91Y2hNb3ZlKTtcbiAgfVxuXG4gIF9vbkFyZWFUb3VjaFN0YXJ0KGlkLCBub3JtWCwgbm9ybVkpIHtcbiAgICBpZiAoIXRoaXMucG9zaXRpb24pIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG5cbiAgICAgIHRoaXMuY29udGVudC5zaG93QnRuID0gdHJ1ZTtcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoJy5zZWN0aW9uLWZsb2F0Jyk7XG4gICAgICB0aGlzLnZpZXcuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAgICdjbGljayAuYnRuJzogKGUpID0+IHtcbiAgICAgICAgICBlLnRhcmdldC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgdGhpcy5fc2VuZENvb3JkaW5hdGVzKCk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24obm9ybVgsIG5vcm1ZKTtcbiAgICB9XG4gIH1cblxuICBfb25BcmVhVG91Y2hNb3ZlKGlkLCBub3JtWCwgbm9ybVkpIHtcbiAgICB0aGlzLl91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIHBvc2l0aW9uIG9iamVjdCBhY2NvcmRpbmcgdG8gbm9ybWFsaXplZCBjb29yZGluYXRlcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5vcm1YIC0gVGhlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZSBpbiB0aGUgeCBheGlzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbm9ybVkgLSBUaGUgbm9ybWFsaXplZCBjb29yZGluYXRlIGluIHRoZSB5IGF4aXMuXG4gICAqL1xuICBfY3JlYXRlUG9zaXRpb24obm9ybVgsIG5vcm1ZKSB7XG4gICAgdGhpcy5wb3NpdGlvbiA9IHtcbiAgICAgIGlkOiAnbG9jYXRvcicsXG4gICAgICB4OiBub3JtWCAqIHRoaXMuYXJlYS53aWR0aCxcbiAgICAgIHk6IG5vcm1ZICogdGhpcy5hcmVhLmhlaWdodCxcbiAgICAgIHJhZGl1czogdGhpcy5vcHRpb25zLnBvc2l0aW9uUmFkaXVzLFxuICAgIH1cblxuICAgIHRoaXMuc3BhY2UuYWRkUG9pbnQodGhpcy5wb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcG9zaXRpb24gb2JqZWN0IGFjY29yZGluZyB0byBub3JtYWxpemVkIGNvb3JkaW5hdGVzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbm9ybVggLSBUaGUgbm9ybWFsaXplZCBjb29yZGluYXRlIGluIHRoZSB4IGF4aXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBub3JtWSAtIFRoZSBub3JtYWxpemVkIGNvb3JkaW5hdGUgaW4gdGhlIHkgYXhpcy5cbiAgICovXG4gIF91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnggPSBub3JtWCAqIHRoaXMuYXJlYS53aWR0aDtcbiAgICB0aGlzLnBvc2l0aW9uLnkgPSBub3JtWSAqIHRoaXMuYXJlYS5oZWlnaHQ7XG5cbiAgICB0aGlzLnNwYWNlLnVwZGF0ZVBvaW50KHRoaXMucG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgY29vcmRpbmF0ZXMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIF9zZW5kQ29vcmRpbmF0ZXMoKSB7XG4gICAgLy8gaWYgKHRoaXMub3B0aW9ucy5wZXJzaXN0KSB7IC8vIHN0b3JlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZXNcbiAgICAvLyAgIHRoaXMuc3RvcmVDb29yZGluYXRlcygpO1xuICAgIC8vIH1cblxuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IHRoaXMucG9zaXRpb247XG4gICAgdGhpcy5zZW5kKCdjb29yZGluYXRlcycsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIENsaWVudExvY2F0b3IpO1xuXG5leHBvcnQgZGVmYXVsdCBDbGllbnRMb2NhdG9yO1xuIl19