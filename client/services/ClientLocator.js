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

    _get(Object.getPrototypeOf(ClientLocator.prototype), 'constructor', this).call(this, SERVICE_ID, true);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50TG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUFtQixnQkFBZ0I7Ozs7OzsyQkFFZixpQkFBaUI7Ozs7a0NBQ1Ysd0JBQXdCOzs7O2dDQUM3QixzQkFBc0I7Ozs7a0NBQ3BCLHdCQUF3Qjs7OzttQ0FDdkIseUJBQXlCOzs7O0FBRWxELElBQU0sVUFBVSxHQUFHLGlCQUFpQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7SUFjL0IsYUFBYTtZQUFiLGFBQWE7Ozs7Ozs7OztBQU9OLFdBUFAsYUFBYSxHQU9IOzBCQVBWLGFBQWE7O0FBUWYsK0JBUkUsYUFBYSw2Q0FRVCxVQUFVLEVBQUUsSUFBSSxFQUFFOztBQUV4QixRQUFNLFFBQVEsR0FBRzs7OztBQUlmLG9CQUFjLEVBQUUsR0FBRztBQUNuQixlQUFTLCtCQUFXO0FBQ3BCLGNBQVEsaUNBQWE7S0FDdEIsQ0FBQzs7QUFFRixRQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7OztBQUt6QixRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzRCxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6RCxRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV2RCxRQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDYjs7OztlQTdCRyxhQUFhOztXQWdDYixnQkFBRztBQUNMLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFDdEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDL0I7Ozs7O1dBR0ksaUJB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T0FBTyxDQUFDLGNBQWM7T0FDcEMsQ0FBQTs7QUFFRCxVQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDcEM7Ozs7Ozs7OztXQU9jLHlCQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDNUIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQzFDLFVBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7QUFFM0MsVUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3ZDOzs7Ozs7O1dBS2UsNEJBQUc7Ozs7O0FBS2pCLDhCQUFPLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ25DLFVBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLHdCQUFPLFdBQVcsQ0FBQyxDQUFDO0FBQzdDLFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNkOzs7U0EvS0csYUFBYTs7O0FBa0xuQixnQ0FBZSxRQUFRLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDOztxQkFFcEMsYUFBYSIsImZpbGUiOiJzcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudExvY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50Jztcbi8vIGltcG9ydCBsb2NhbFN0b3JhZ2UgZnJvbSAnLi9sb2NhbFN0b3JhZ2UnOyAvLyBAdG9kbyAtIHJldGhpbmsgdGhpcyB3aXRoIGRiXG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNwYWNlVmlldyBmcm9tICcuLi9kaXNwbGF5L1NwYWNlVmlldyc7XG5pbXBvcnQgU3F1YXJlZFZpZXcgZnJvbSAnLi4vZGlzcGxheS9TcXVhcmVkVmlldyc7XG5pbXBvcnQgVG91Y2hTdXJmYWNlIGZyb20gJy4uL2Rpc3BsYXkvVG91Y2hTdXJmYWNlJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmxvY2F0b3InO1xuXG4vKipcbiAqIFtjbGllbnRdIEFsbG93IHRvIGluZGljYXRlIHRoZSBhcHByb3hpbWF0ZSBsb2NhdGlvbiBvZiB0aGUgY2xpZW50IG9uIGEgbWFwLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcgdGhhdCBkaXNwbGF5cyB0aGUgbWFwIGFuZCBhIGJ1dHRvbiB0byB2YWxpZGF0ZSB0aGUgbG9jYXRpb24uXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gYWZ0ZXIgdGhlIHVzZXIgY29uZmlybXMgaGlzIC8gaGVyIGFwcHJveGltYXRlIGxvY2F0aW9uIGJ5IGNsaWNraW5nIG9uIHRoZSDigJxWYWxpZGF0ZeKAnSBidXR0b24uIEZvciBkZXZlbG9wbWVudCBwdXJwb3NlcyBpdCBjYW4gYmUgY29uZmlndXJlZCB0byBzZW5kIHJhbmRvbSBjb29yZGluYXRlcyBvciByZXRyaWV2aW5nIHByZXZpb3VzbHkgc3RvcmVkIGxvY2F0aW9uIChzZWUgYG9wdGlvbnMucmFuZG9tYCBhbmQgYG9wdGlvbnMucGVyc2lzdGAuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlckxvY2F0b3IuanN+U2VydmVyTG9jYXRvcn0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgbG9jYXRvciA9IG5ldyBDbGllbnRMb2NhdG9yKCk7XG4gKi9cbmNsYXNzIENsaWVudExvY2F0b3IgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nbG9jYXRvciddIC0gVGhlIG5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5yYW5kb209ZmFsc2VdIC0gU2VuZCByYW5kb20gcG9zaXRpb24gdG8gdGhlIHNlcnZlciBhbmQgY2FsbCBgdGhpcy5kb25lKClgIChmb3IgZGV2ZWxvcG1lbnQgcHVycG9zZSlcbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5wZXJzaXN0PWZhbHNlXSAtIElmIHNldCB0byBgdHJ1ZWAsIHN0b3JlIHRoZSBub3JtYWxpemVkIGNvb3JkaW5hdGVzIGluIGBsb2NhbFN0b3JhZ2VgIGFuZCByZXRyaWV2ZSB0aGVtIGluIHN1YnNlcXVlbnQgY2FsbHMuIERlbGV0ZSB0aGUgc3RvcmVkIHBvc2l0aW9uIHdoZW4gc2V0IHRvIGBmYWxzZWAuIChmb3IgZGV2ZWxvcG1lbnQgcHVycG9zZSlcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICAvLyBAdG9kbyAtIHJlLXRoaW5rIHRoaXMgd2l0aCBkYlxuICAgICAgLy8gcmFuZG9tOiBmYWxzZSxcbiAgICAgIC8vIHBlcnNpc3Q6IGZhbHNlLFxuICAgICAgcG9zaXRpb25SYWRpdXM6IDAuMywgLy8gcmVsYXRpdmUgdG8gdGhlIGFyZWEgdW5pdFxuICAgICAgc3BhY2VDdG9yOiBTcGFjZVZpZXcsXG4gICAgICB2aWV3Q3RvcjogU3F1YXJlZFZpZXcsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIC8vIFRoZSBuYW1lc3BhY2Ugd2hlcmUgY29vcmRpbmF0ZXMgYXJlIHN0b3JlZCB3aGVuIGBvcHRpb25zLnBlcnNpc3QgPSB0cnVlYC5cbiAgICAvLyB0aGlzLl9sb2NhbFN0b3JhZ2VOYW1lc3BhY2UgPSBgc291bmR3b3Jrczoke3RoaXMubmFtZX1gO1xuXG4gICAgdGhpcy5fb25BcmVhVG91Y2hTdGFydCA9IHRoaXMuX29uQXJlYVRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkFyZWFUb3VjaE1vdmUgPSB0aGlzLl9vbkFyZWFUb3VjaE1vdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkFyZWFSZXNwb25zZSA9IHRoaXMuX29uQXJlYVJlc3BvbnNlLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbml0KCkge1xuICAgIHRoaXMudmlld0N0b3IgPSB0aGlzLm9wdGlvbnMudmlld0N0b3I7XG4gICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNob3coKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuXG4gICAgLy8gaWYgKCF0aGlzLm9wdGlvbnMucGVyc2lzdClcbiAgICAvLyAgIGxvY2FsU3RvcmFnZS5kZWxldGUodGhpcy5fbG9jYWxTdG9yYWdlTmFtZXNwYWNlKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnYXJlYScsIHRoaXMuX29uQXJlYVJlc3BvbnNlKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcblxuICAgIHRoaXMuaGlkZSgpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2FyZWEnLCB0aGlzLl9vbkFyZWFSZXNwb25zZSk7XG4gIH1cblxuICAvKipcbiAgICogQnlwYXNzIHRoZSBsb2NhdG9yIGFjY29yZGluZyB0byBtb2R1bGUgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKiBJZiBgb3B0aW9ucy5yYW5kb21gIGlzIHNldCB0byB0cnVlLCB1c2UgcmFuZG9tIGNvb3JkaW5hdGVzLlxuICAgKiBJZiBgb3B0aW9ucy5wZXJzaXN0YCBpcyBzZXQgdG8gdHJ1ZSB1c2UgY29vcmRpbmF0ZXMgc3RvcmVkIGluIGxvY2FsIHN0b3JhZ2UsXG4gICAqIGRvIG5vdGhpbmcgd2hlbiBubyBjb29yZGluYXRlcyBhcmUgc3RvcmVkIHlldC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFyZWEgLSBUaGUgYXJlYSBhcyBkZWZpbmVkIGluIHNlcnZlciBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgX29uQXJlYVJlc3BvbnNlKGFyZWEpIHtcbiAgICB0aGlzLl9hdHRhY2hBcmVhKGFyZWEpO1xuXG4gICAgLy8gaWYgKHRoaXMub3B0aW9ucy5yYW5kb20gfHzCoHRoaXMub3B0aW9ucy5wZXJzaXN0KSB7XG4gICAgLy8gICBsZXQgY29vcmRzO1xuXG4gICAgLy8gICBpZiAodGhpcy5vcHRpb25zLnJhbmRvbSkge1xuICAgIC8vICAgICBjb29yZHMgPSB7IG5vcm1YOiBNYXRoLnJhbmRvbSgpLCBub3JtWTogTWF0aC5yYW5kb20oKSB9O1xuICAgIC8vICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMucGVyc2lzdCkge1xuICAgIC8vICAgICBjb29yZHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXQodGhpcy5fbG9jYWxTdG9yYWdlTmFtZXNwYWNlKSk7XG4gICAgLy8gICB9XG5cbiAgICAvLyAgIGlmIChjb29yZHMgIT09IG51bGwpIHtcbiAgICAvLyAgICAgdGhpcy5fY3JlYXRlUG9zaXRpb24oY29vcmRzLm5vcm1YLCBjb29yZHMubm9ybVkpO1xuICAgIC8vICAgICB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMoKTtcbiAgICAvLyAgIH1cbiAgICAvLyB9XG4gIH1cblxuICAvKipcbiAgICogU3RvcmUgdGhlIGN1cnJlbnQgY29vcmRpbmF0ZXMgaW4gYGxvY2FsU3RvcmFnZWAuXG4gICAqL1xuICAvLyBzdG9yZUNvb3JkaW5hdGVzKCkge1xuICAvLyAgIGNvbnN0IG5vcm1YID0gdGhpcy5wb3NpdGlvbi54IC8gdGhpcy5hcmVhLndpZHRoO1xuICAvLyAgIGNvbnN0IG5vcm1ZID0gdGhpcy5wb3NpdGlvbi55IC8gdGhpcy5hcmVhLmhlaWdodDtcbiAgLy8gICBsb2NhbFN0b3JhZ2Uuc2V0KHRoaXMuX2xvY2FsU3RvcmFnZU5hbWVzcGFjZSwgSlNPTi5zdHJpbmdpZnkoeyBub3JtWCwgbm9ybVkgfSkpO1xuICAvLyB9XG5cbiAgLy8gcmV0cmlldmVDb29yZGluYXRlcygpIHt9XG4gIC8vIGRlbGV0ZUNvb3JkaW5hdGVzKCkge31cblxuICAvKipcbiAgICogQ3JlYXRlIGEgYFNwYWNlVmlld2AgYW5kIGRpc3BsYXkgaXQgaW4gdGhlIHNxdWFyZSBzZWN0aW9uIG9mIHRoZSB2aWV3XG4gICAqL1xuICBfYXR0YWNoQXJlYShhcmVhKSB7XG4gICAgdGhpcy5hcmVhID0gYXJlYTtcbiAgICB0aGlzLnNwYWNlID0gbmV3IHRoaXMub3B0aW9ucy5zcGFjZUN0b3IoYXJlYSwge30sIHsgaXNTdWJWaWV3OiB0cnVlIH0pO1xuICAgIC8vIEB0b2RvIC0gZmluZCBhIHdheSB0byByZW1vdmUgdGhlc2UgaGFyZGNvZGVkIHNlbGVjdG9yc1xuICAgIHRoaXMudmlldy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnLCB0aGlzLnNwYWNlKTtcbiAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcbiAgICAvLyB0b3VjaFN1cmZhY2Ugb24gJHN2Z1xuICAgIHRoaXMuc3VyZmFjZSA9IG5ldyBUb3VjaFN1cmZhY2UodGhpcy5zcGFjZS4kc3ZnKTtcbiAgICB0aGlzLnN1cmZhY2UuYWRkTGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0KTtcbiAgICB0aGlzLnN1cmZhY2UuYWRkTGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX29uQXJlYVRvdWNoTW92ZSk7XG4gIH1cblxuICBfb25BcmVhVG91Y2hTdGFydChpZCwgbm9ybVgsIG5vcm1ZKSB7XG4gICAgaWYgKCF0aGlzLnBvc2l0aW9uKSB7XG4gICAgICB0aGlzLl9jcmVhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpO1xuXG4gICAgICB0aGlzLmNvbnRlbnQuc2hvd0J0biA9IHRydWU7XG4gICAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2VjdGlvbi1mbG9hdCcpO1xuICAgICAgdGhpcy52aWV3Lmluc3RhbGxFdmVudHMoe1xuICAgICAgICAnY2xpY2sgLmJ0bic6IChlKSA9PiB7XG4gICAgICAgICAgZS50YXJnZXQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgIHRoaXMuX3NlbmRDb29yZGluYXRlcygpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG4gICAgfVxuICB9XG5cbiAgX29uQXJlYVRvdWNoTW92ZShpZCwgbm9ybVgsIG5vcm1ZKSB7XG4gICAgdGhpcy5fdXBkYXRlUG9zaXRpb24obm9ybVgsIG5vcm1ZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBwb3NpdGlvbiBvYmplY3QgYWNjb3JkaW5nIHRvIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBub3JtWCAtIFRoZSBub3JtYWxpemVkIGNvb3JkaW5hdGUgaW4gdGhlIHggYXhpcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5vcm1ZIC0gVGhlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZSBpbiB0aGUgeSBheGlzLlxuICAgKi9cbiAgX2NyZWF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSkge1xuICAgIHRoaXMucG9zaXRpb24gPSB7XG4gICAgICBpZDogJ2xvY2F0b3InLFxuICAgICAgeDogbm9ybVggKiB0aGlzLmFyZWEud2lkdGgsXG4gICAgICB5OiBub3JtWSAqIHRoaXMuYXJlYS5oZWlnaHQsXG4gICAgICByYWRpdXM6IHRoaXMub3B0aW9ucy5wb3NpdGlvblJhZGl1cyxcbiAgICB9XG5cbiAgICB0aGlzLnNwYWNlLmFkZFBvaW50KHRoaXMucG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9iamVjdCBhY2NvcmRpbmcgdG8gbm9ybWFsaXplZCBjb29yZGluYXRlcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5vcm1YIC0gVGhlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZSBpbiB0aGUgeCBheGlzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbm9ybVkgLSBUaGUgbm9ybWFsaXplZCBjb29yZGluYXRlIGluIHRoZSB5IGF4aXMuXG4gICAqL1xuICBfdXBkYXRlUG9zaXRpb24obm9ybVgsIG5vcm1ZKSB7XG4gICAgdGhpcy5wb3NpdGlvbi54ID0gbm9ybVggKiB0aGlzLmFyZWEud2lkdGg7XG4gICAgdGhpcy5wb3NpdGlvbi55ID0gbm9ybVkgKiB0aGlzLmFyZWEuaGVpZ2h0O1xuXG4gICAgdGhpcy5zcGFjZS51cGRhdGVQb2ludCh0aGlzLnBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGNvb3JkaW5hdGVzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBfc2VuZENvb3JkaW5hdGVzKCkge1xuICAgIC8vIGlmICh0aGlzLm9wdGlvbnMucGVyc2lzdCkgeyAvLyBzdG9yZSBub3JtYWxpemVkIGNvb3JkaW5hdGVzXG4gICAgLy8gICB0aGlzLnN0b3JlQ29vcmRpbmF0ZXMoKTtcbiAgICAvLyB9XG5cbiAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSB0aGlzLnBvc2l0aW9uO1xuICAgIHRoaXMuc2VuZCgnY29vcmRpbmF0ZXMnLCBjbGllbnQuY29vcmRpbmF0ZXMpO1xuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBDbGllbnRMb2NhdG9yKTtcblxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50TG9jYXRvcjtcbiJdfQ==