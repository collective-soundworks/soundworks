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

    this._random = options.random || false;
    this._persist = options.persist || false;
    this._positionRadius = options.positionRadius || 0.3;
    this.spaceCtor = options.spaceCtor || _displaySpaceView2['default'];
    this.viewCtor = options.viewCtor || _displaySquaredView2['default'];

    // The namespace where coordinates are stored when `options.persist = true`.
    this._localStorageNamespace = 'soundworks:' + this.name;

    this._onAreaTouchStart = this._onAreaTouchStart.bind(this);
    this._onAreaTouchMove = this._onAreaTouchMove.bind(this);

    this.init();
  }

  _createClass(ClientLocator, [{
    key: 'init',
    value: function init() {
      this.content.activateBtn = false;
      this.view = this.createView();
    }

    /**
     * Start the module.
     * @private
     */
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(ClientLocator.prototype), 'start', this).call(this);

      this.send('request');

      if (!this._persist) _localStorage2['default']['delete'](this._localStorageNamespace);

      this.receive('area', function (area) {
        _this._attachArea(area);

        // Bypass the locator according to module configuration options.
        // If `options.random` is set to true, use random coordinates.
        // If `options.persist` is set to true use coordinates stored in local storage,
        // do nothing when no coordinates are stored yet.
        if (_this._random || _this._persist) {
          var coords = undefined;

          if (_this._random) {
            coords.normX = Math.random();
            coords.normY = Math.random();
          } else if (_this._persist) {
            coords = JSON.parse(_localStorage2['default'].get(_this._localStorageNamespace));
          }

          if (coords !== null) {
            _this._createPosition(coords.normX, coords.normY);
            _this._sendCoordinates();
          }
        }
      });
    }

    /**
     * Create a `SpaceView` and display it in the square section of the view
     */
  }, {
    key: '_attachArea',
    value: function _attachArea(area) {
      this.area = area;
      this.space = new this.spaceCtor(area, {}, { isSubView: true });
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
      var _this2 = this;

      if (!this.position) {
        this._createPosition(normX, normY);

        this.content.activateBtn = true;
        this.view.render('.section-float');
        this.view.installEvents({
          'click .btn': function clickBtn(e) {
            e.target.setAttribute('disabled', true);
            _this2._sendCoordinates();
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
        radius: this._positionRadius
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
      if (this._persist) {
        // store normalized coordinates
        var normX = this.position.x / this.area.width;
        var normY = this.position.y / this.area.height;
        _localStorage2['default'].set(this._localStorageNamespace, JSON.stringify({ normX: normX, normY: normY }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50TG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7OzRCQUNKLGdCQUFnQjs7Ozs2QkFDaEIsZ0JBQWdCOzs7O2tDQUNqQix1QkFBdUI7Ozs7Z0NBQ3pCLHFCQUFxQjs7OzttQ0FDbEIsd0JBQXdCOzs7Ozs7Ozs7Ozs7Ozs7OztJQWU1QixhQUFhO1lBQWIsYUFBYTs7Ozs7Ozs7O0FBT3JCLFdBUFEsYUFBYSxHQU9OO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFQTCxhQUFhOztBQVE5QiwrQkFSaUIsYUFBYSw2Q0FReEIsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUUsT0FBTyxFQUFFOztBQUUxQyxRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDO0FBQ3ZDLFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUM7QUFDekMsUUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsY0FBYyxJQUFJLEdBQUcsQ0FBQztBQUNyRCxRQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLGlDQUFhLENBQUM7QUFDaEQsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxtQ0FBZSxDQUFDOzs7QUFHaEQsUUFBSSxDQUFDLHNCQUFzQixtQkFBaUIsSUFBSSxDQUFDLElBQUksQUFBRSxDQUFDOztBQUV4RCxRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzRCxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFekQsUUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ2I7O2VBdkJrQixhQUFhOztXQXlCNUIsZ0JBQUc7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QUNqRCxrQ0FBYSxHQUFHLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7T0FDakY7O0FBRUQsMEJBQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDbkMsVUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsb0JBQU8sV0FBVyxDQUFDLENBQUM7QUFDN0MsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztTQWhKa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRMb2NhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgbG9jYWxTdG9yYWdlIGZyb20gJy4vbG9jYWxTdG9yYWdlJztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuaW1wb3J0IFNxdWFyZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TcXVhcmVkVmlldyc7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4vZGlzcGxheS9TcGFjZVZpZXcnO1xuaW1wb3J0IFRvdWNoU3VyZmFjZSBmcm9tICcuL2Rpc3BsYXkvVG91Y2hTdXJmYWNlJztcblxuXG4vKipcbiAqIFtjbGllbnRdIEFsbG93IHRvIGluZGljYXRlIHRoZSBhcHByb3hpbWF0ZSBsb2NhdGlvbiBvZiB0aGUgY2xpZW50IG9uIGEgbWFwLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcgdGhhdCBkaXNwbGF5cyB0aGUgbWFwIGFuZCBhIGJ1dHRvbiB0byB2YWxpZGF0ZSB0aGUgbG9jYXRpb24uXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gYWZ0ZXIgdGhlIHVzZXIgY29uZmlybXMgaGlzIC8gaGVyIGFwcHJveGltYXRlIGxvY2F0aW9uIGJ5IGNsaWNraW5nIG9uIHRoZSDigJxWYWxpZGF0ZeKAnSBidXR0b24uIEZvciBkZXZlbG9wbWVudCBwdXJwb3NlcyBpdCBjYW4gYmUgY29uZmlndXJlZCB0byBzZW5kIHJhbmRvbSBjb29yZGluYXRlcyBvciByZXRyaWV2aW5nIHByZXZpb3VzbHkgc3RvcmVkIGxvY2F0aW9uIChzZWUgYG9wdGlvbnMucmFuZG9tYCBhbmQgYG9wdGlvbnMucGVyc2lzdGAuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlckxvY2F0b3IuanN+U2VydmVyTG9jYXRvcn0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgbG9jYXRvciA9IG5ldyBDbGllbnRMb2NhdG9yKCk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudExvY2F0b3IgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSAtIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdsb2NhdG9yJ10gLSBUaGUgbmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnJhbmRvbT1mYWxzZV0gLSBTZW5kIHJhbmRvbSBwb3NpdGlvbiB0byB0aGUgc2VydmVyIGFuZCBjYWxsIGB0aGlzLmRvbmUoKWAgKGZvciBkZXZlbG9wbWVudCBwdXJwb3NlKVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnBlcnNpc3Q9ZmFsc2VdIC0gSWYgc2V0IHRvIGB0cnVlYCwgc3RvcmUgdGhlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZXMgaW4gYGxvY2FsU3RvcmFnZWAgYW5kIHJldHJpZXZlIHRoZW0gaW4gc3Vic2VxdWVudCBjYWxscy4gRGVsZXRlIHRoZSBzdG9yZWQgcG9zaXRpb24gd2hlbiBzZXQgdG8gYGZhbHNlYC4gKGZvciBkZXZlbG9wbWVudCBwdXJwb3NlKVxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdsb2NhdG9yJywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9yYW5kb20gPSBvcHRpb25zLnJhbmRvbSB8fMKgZmFsc2U7XG4gICAgdGhpcy5fcGVyc2lzdCA9IG9wdGlvbnMucGVyc2lzdCB8fMKgZmFsc2U7XG4gICAgdGhpcy5fcG9zaXRpb25SYWRpdXMgPSBvcHRpb25zLnBvc2l0aW9uUmFkaXVzIHx8wqAwLjM7XG4gICAgdGhpcy5zcGFjZUN0b3IgPSBvcHRpb25zLnNwYWNlQ3RvciB8fMKgU3BhY2VWaWV3O1xuICAgIHRoaXMudmlld0N0b3IgPSBvcHRpb25zLnZpZXdDdG9yIHx8wqBTcXVhcmVkVmlldztcblxuICAgIC8vIFRoZSBuYW1lc3BhY2Ugd2hlcmUgY29vcmRpbmF0ZXMgYXJlIHN0b3JlZCB3aGVuIGBvcHRpb25zLnBlcnNpc3QgPSB0cnVlYC5cbiAgICB0aGlzLl9sb2NhbFN0b3JhZ2VOYW1lc3BhY2UgPSBgc291bmR3b3Jrczoke3RoaXMubmFtZX1gO1xuXG4gICAgdGhpcy5fb25BcmVhVG91Y2hTdGFydCA9IHRoaXMuX29uQXJlYVRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkFyZWFUb3VjaE1vdmUgPSB0aGlzLl9vbkFyZWFUb3VjaE1vdmUuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmNvbnRlbnQuYWN0aXZhdGVCdG4gPSBmYWxzZTtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuXG4gICAgaWYgKCF0aGlzLl9wZXJzaXN0KVxuICAgICAgbG9jYWxTdG9yYWdlLmRlbGV0ZSh0aGlzLl9sb2NhbFN0b3JhZ2VOYW1lc3BhY2UpO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdhcmVhJywgKGFyZWEpID0+IHtcbiAgICAgIHRoaXMuX2F0dGFjaEFyZWEoYXJlYSk7XG5cbiAgICAgIC8vIEJ5cGFzcyB0aGUgbG9jYXRvciBhY2NvcmRpbmcgdG8gbW9kdWxlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICAgIC8vIElmIGBvcHRpb25zLnJhbmRvbWAgaXMgc2V0IHRvIHRydWUsIHVzZSByYW5kb20gY29vcmRpbmF0ZXMuXG4gICAgICAvLyBJZiBgb3B0aW9ucy5wZXJzaXN0YCBpcyBzZXQgdG8gdHJ1ZSB1c2UgY29vcmRpbmF0ZXMgc3RvcmVkIGluIGxvY2FsIHN0b3JhZ2UsXG4gICAgICAvLyBkbyBub3RoaW5nIHdoZW4gbm8gY29vcmRpbmF0ZXMgYXJlIHN0b3JlZCB5ZXQuXG4gICAgICBpZiAodGhpcy5fcmFuZG9tIHx8wqB0aGlzLl9wZXJzaXN0KSB7XG4gICAgICAgIGxldCBjb29yZHM7XG5cbiAgICAgICAgaWYgKHRoaXMuX3JhbmRvbSkge1xuICAgICAgICAgIGNvb3Jkcy5ub3JtWCA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgY29vcmRzLm5vcm1ZID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9wZXJzaXN0KSB7XG4gICAgICAgICAgY29vcmRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0KHRoaXMuX2xvY2FsU3RvcmFnZU5hbWVzcGFjZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvb3JkcyAhPT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuX2NyZWF0ZVBvc2l0aW9uKGNvb3Jkcy5ub3JtWCwgY29vcmRzLm5vcm1ZKTtcbiAgICAgICAgICB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGBTcGFjZVZpZXdgIGFuZCBkaXNwbGF5IGl0IGluIHRoZSBzcXVhcmUgc2VjdGlvbiBvZiB0aGUgdmlld1xuICAgKi9cbiAgX2F0dGFjaEFyZWEoYXJlYSkge1xuICAgIHRoaXMuYXJlYSA9IGFyZWE7XG4gICAgdGhpcy5zcGFjZSA9IG5ldyB0aGlzLnNwYWNlQ3RvcihhcmVhLCB7fSwgeyBpc1N1YlZpZXc6IHRydWUgfSk7XG4gICAgLy8gQHRvZG8gLSBmaW5kIGEgd2F5IHRvIHJlbW92ZSB0aGVzZSBoYXJkY29kZWQgc2VsZWN0b3JzXG4gICAgdGhpcy52aWV3LnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc3BhY2UpO1xuICAgIHRoaXMudmlldy5yZW5kZXIoJy5zZWN0aW9uLXNxdWFyZScpO1xuICAgIC8vIHRvdWNoU3VyZmFjZSBvbiAkc3ZnXG4gICAgdGhpcy5zdXJmYWNlID0gbmV3IFRvdWNoU3VyZmFjZSh0aGlzLnNwYWNlLiRzdmcpO1xuICAgIHRoaXMuc3VyZmFjZS5hZGRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX29uQXJlYVRvdWNoU3RhcnQpO1xuICAgIHRoaXMuc3VyZmFjZS5hZGRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5fb25BcmVhVG91Y2hNb3ZlKTtcbiAgfVxuXG4gIF9vbkFyZWFUb3VjaFN0YXJ0KGlkLCBub3JtWCwgbm9ybVkpIHtcbiAgICBpZiAoIXRoaXMucG9zaXRpb24pIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG5cbiAgICAgIHRoaXMuY29udGVudC5hY3RpdmF0ZUJ0biA9IHRydWU7XG4gICAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2VjdGlvbi1mbG9hdCcpO1xuICAgICAgdGhpcy52aWV3Lmluc3RhbGxFdmVudHMoe1xuICAgICAgICAnY2xpY2sgLmJ0bic6IChlKSA9PiB7XG4gICAgICAgICAgZS50YXJnZXQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgIHRoaXMuX3NlbmRDb29yZGluYXRlcygpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG4gICAgfVxuICB9XG5cbiAgX29uQXJlYVRvdWNoTW92ZShpZCwgbm9ybVgsIG5vcm1ZKSB7XG4gICAgdGhpcy5fdXBkYXRlUG9zaXRpb24obm9ybVgsIG5vcm1ZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBwb3NpdGlvbiBvYmplY3QgYWNjb3JkaW5nIHRvIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBub3JtWCAtIFRoZSBub3JtYWxpemVkIGNvb3JkaW5hdGUgaW4gdGhlIHggYXhpcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5vcm1ZIC0gVGhlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZSBpbiB0aGUgeSBheGlzLlxuICAgKi9cbiAgX2NyZWF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSkge1xuICAgIHRoaXMucG9zaXRpb24gPSB7XG4gICAgICBpZDogJ2xvY2F0b3InLFxuICAgICAgeDogbm9ybVggKiB0aGlzLmFyZWEud2lkdGgsXG4gICAgICB5OiBub3JtWSAqIHRoaXMuYXJlYS5oZWlnaHQsXG4gICAgICByYWRpdXM6IHRoaXMuX3Bvc2l0aW9uUmFkaXVzLFxuICAgIH1cblxuICAgIHRoaXMuc3BhY2UuYWRkUG9pbnQodGhpcy5wb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcG9zaXRpb24gb2JqZWN0IGFjY29yZGluZyB0byBub3JtYWxpemVkIGNvb3JkaW5hdGVzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbm9ybVggLSBUaGUgbm9ybWFsaXplZCBjb29yZGluYXRlIGluIHRoZSB4IGF4aXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBub3JtWSAtIFRoZSBub3JtYWxpemVkIGNvb3JkaW5hdGUgaW4gdGhlIHkgYXhpcy5cbiAgICovXG4gIF91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnggPSBub3JtWCAqIHRoaXMuYXJlYS53aWR0aDtcbiAgICB0aGlzLnBvc2l0aW9uLnkgPSBub3JtWSAqIHRoaXMuYXJlYS5oZWlnaHQ7XG5cbiAgICB0aGlzLnNwYWNlLnVwZGF0ZVBvaW50KHRoaXMucG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgY29vcmRpbmF0ZXMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIF9zZW5kQ29vcmRpbmF0ZXMoKSB7XG4gICAgaWYgKHRoaXMuX3BlcnNpc3QpIHsgLy8gc3RvcmUgbm9ybWFsaXplZCBjb29yZGluYXRlc1xuICAgICAgY29uc3Qgbm9ybVggPSB0aGlzLnBvc2l0aW9uLnggLyB0aGlzLmFyZWEud2lkdGg7XG4gICAgICBjb25zdCBub3JtWSA9IHRoaXMucG9zaXRpb24ueSAvIHRoaXMuYXJlYS5oZWlnaHQ7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0KHRoaXMuX2xvY2FsU3RvcmFnZU5hbWVzcGFjZSwgSlNPTi5zdHJpbmdpZnkoeyBub3JtWCwgbm9ybVkgfSkpO1xuICAgIH1cblxuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IHRoaXMucG9zaXRpb247XG4gICAgdGhpcy5zZW5kKCdjb29yZGluYXRlcycsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cbn1cbiJdfQ==