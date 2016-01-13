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
            coords = { normX: Math.random(), normY: Math.random() };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50TG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7OzRCQUNKLGdCQUFnQjs7Ozs2QkFDaEIsZ0JBQWdCOzs7O2tDQUNqQix1QkFBdUI7Ozs7Z0NBQ3pCLHFCQUFxQjs7OzttQ0FDbEIsd0JBQXdCOzs7Ozs7Ozs7Ozs7Ozs7OztJQWU1QixhQUFhO1lBQWIsYUFBYTs7Ozs7Ozs7O0FBT3JCLFdBUFEsYUFBYSxHQU9OO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFQTCxhQUFhOztBQVE5QiwrQkFSaUIsYUFBYSw2Q0FReEIsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUUsT0FBTyxFQUFFOztBQUUxQyxRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDO0FBQ3ZDLFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUM7QUFDekMsUUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsY0FBYyxJQUFJLEdBQUcsQ0FBQztBQUNyRCxRQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLGlDQUFhLENBQUM7QUFDaEQsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxtQ0FBZSxDQUFDOzs7QUFHaEQsUUFBSSxDQUFDLHNCQUFzQixtQkFBaUIsSUFBSSxDQUFDLElBQUksQUFBRSxDQUFDOztBQUV4RCxRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzRCxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFekQsUUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ2I7O2VBdkJrQixhQUFhOztXQXlCNUIsZ0JBQUc7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QUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztPQUNqRjs7QUFFRCwwQkFBTyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNuQyxVQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxvQkFBTyxXQUFXLENBQUMsQ0FBQztBQUM3QyxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1NBL0lrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudExvY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBsb2NhbFN0b3JhZ2UgZnJvbSAnLi9sb2NhbFN0b3JhZ2UnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgU3F1YXJlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NxdWFyZWRWaWV3JztcbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi9kaXNwbGF5L1NwYWNlVmlldyc7XG5pbXBvcnQgVG91Y2hTdXJmYWNlIGZyb20gJy4vZGlzcGxheS9Ub3VjaFN1cmZhY2UnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gQWxsb3cgdG8gaW5kaWNhdGUgdGhlIGFwcHJveGltYXRlIGxvY2F0aW9uIG9mIHRoZSBjbGllbnQgb24gYSBtYXAuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgaGFzIGEgdmlldyB0aGF0IGRpc3BsYXlzIHRoZSBtYXAgYW5kIGEgYnV0dG9uIHRvIHZhbGlkYXRlIHRoZSBsb2NhdGlvbi5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBhZnRlciB0aGUgdXNlciBjb25maXJtcyBoaXMgLyBoZXIgYXBwcm94aW1hdGUgbG9jYXRpb24gYnkgY2xpY2tpbmcgb24gdGhlIOKAnFZhbGlkYXRl4oCdIGJ1dHRvbi4gRm9yIGRldmVsb3BtZW50IHB1cnBvc2VzIGl0IGNhbiBiZSBjb25maWd1cmVkIHRvIHNlbmQgcmFuZG9tIGNvb3JkaW5hdGVzIG9yIHJldHJpZXZpbmcgcHJldmlvdXNseSBzdG9yZWQgbG9jYXRpb24gKHNlZSBgb3B0aW9ucy5yYW5kb21gIGFuZCBgb3B0aW9ucy5wZXJzaXN0YC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyTG9jYXRvci5qc35TZXJ2ZXJMb2NhdG9yfSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBsb2NhdG9yID0gbmV3IENsaWVudExvY2F0b3IoKTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50TG9jYXRvciBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIC0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J2xvY2F0b3InXSAtIFRoZSBuYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucmFuZG9tPWZhbHNlXSAtIFNlbmQgcmFuZG9tIHBvc2l0aW9uIHRvIHRoZSBzZXJ2ZXIgYW5kIGNhbGwgYHRoaXMuZG9uZSgpYCAoZm9yIGRldmVsb3BtZW50IHB1cnBvc2UpXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucGVyc2lzdD1mYWxzZV0gLSBJZiBzZXQgdG8gYHRydWVgLCBzdG9yZSB0aGUgbm9ybWFsaXplZCBjb29yZGluYXRlcyBpbiBgbG9jYWxTdG9yYWdlYCBhbmQgcmV0cmlldmUgdGhlbSBpbiBzdWJzZXF1ZW50IGNhbGxzLiBEZWxldGUgdGhlIHN0b3JlZCBwb3NpdGlvbiB3aGVuIHNldCB0byBgZmFsc2VgLiAoZm9yIGRldmVsb3BtZW50IHB1cnBvc2UpXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2xvY2F0b3InLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX3JhbmRvbSA9IG9wdGlvbnMucmFuZG9tIHx8wqBmYWxzZTtcbiAgICB0aGlzLl9wZXJzaXN0ID0gb3B0aW9ucy5wZXJzaXN0IHx8wqBmYWxzZTtcbiAgICB0aGlzLl9wb3NpdGlvblJhZGl1cyA9IG9wdGlvbnMucG9zaXRpb25SYWRpdXMgfHzCoDAuMztcbiAgICB0aGlzLnNwYWNlQ3RvciA9IG9wdGlvbnMuc3BhY2VDdG9yIHx8wqBTcGFjZVZpZXc7XG4gICAgdGhpcy52aWV3Q3RvciA9IG9wdGlvbnMudmlld0N0b3IgfHzCoFNxdWFyZWRWaWV3O1xuXG4gICAgLy8gVGhlIG5hbWVzcGFjZSB3aGVyZSBjb29yZGluYXRlcyBhcmUgc3RvcmVkIHdoZW4gYG9wdGlvbnMucGVyc2lzdCA9IHRydWVgLlxuICAgIHRoaXMuX2xvY2FsU3RvcmFnZU5hbWVzcGFjZSA9IGBzb3VuZHdvcmtzOiR7dGhpcy5uYW1lfWA7XG5cbiAgICB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0ID0gdGhpcy5fb25BcmVhVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQXJlYVRvdWNoTW92ZSA9IHRoaXMuX29uQXJlYVRvdWNoTW92ZS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuY29udGVudC5hY3RpdmF0ZUJ0biA9IGZhbHNlO1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG5cbiAgICBpZiAoIXRoaXMuX3BlcnNpc3QpXG4gICAgICBsb2NhbFN0b3JhZ2UuZGVsZXRlKHRoaXMuX2xvY2FsU3RvcmFnZU5hbWVzcGFjZSk7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ2FyZWEnLCAoYXJlYSkgPT4ge1xuICAgICAgdGhpcy5fYXR0YWNoQXJlYShhcmVhKTtcblxuICAgICAgLy8gQnlwYXNzIHRoZSBsb2NhdG9yIGFjY29yZGluZyB0byBtb2R1bGUgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgICAgLy8gSWYgYG9wdGlvbnMucmFuZG9tYCBpcyBzZXQgdG8gdHJ1ZSwgdXNlIHJhbmRvbSBjb29yZGluYXRlcy5cbiAgICAgIC8vIElmIGBvcHRpb25zLnBlcnNpc3RgIGlzIHNldCB0byB0cnVlIHVzZSBjb29yZGluYXRlcyBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZSxcbiAgICAgIC8vIGRvIG5vdGhpbmcgd2hlbiBubyBjb29yZGluYXRlcyBhcmUgc3RvcmVkIHlldC5cbiAgICAgIGlmICh0aGlzLl9yYW5kb20gfHzCoHRoaXMuX3BlcnNpc3QpIHtcbiAgICAgICAgbGV0IGNvb3JkcztcblxuICAgICAgICBpZiAodGhpcy5fcmFuZG9tKSB7XG4gICAgICAgICAgY29vcmRzID0geyBub3JtWDogTWF0aC5yYW5kb20oKSwgbm9ybVk6IE1hdGgucmFuZG9tKCkgfTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9wZXJzaXN0KSB7XG4gICAgICAgICAgY29vcmRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0KHRoaXMuX2xvY2FsU3RvcmFnZU5hbWVzcGFjZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvb3JkcyAhPT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuX2NyZWF0ZVBvc2l0aW9uKGNvb3Jkcy5ub3JtWCwgY29vcmRzLm5vcm1ZKTtcbiAgICAgICAgICB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGBTcGFjZVZpZXdgIGFuZCBkaXNwbGF5IGl0IGluIHRoZSBzcXVhcmUgc2VjdGlvbiBvZiB0aGUgdmlld1xuICAgKi9cbiAgX2F0dGFjaEFyZWEoYXJlYSkge1xuICAgIHRoaXMuYXJlYSA9IGFyZWE7XG4gICAgdGhpcy5zcGFjZSA9IG5ldyB0aGlzLnNwYWNlQ3RvcihhcmVhLCB7fSwgeyBpc1N1YlZpZXc6IHRydWUgfSk7XG4gICAgLy8gQHRvZG8gLSBmaW5kIGEgd2F5IHRvIHJlbW92ZSB0aGVzZSBoYXJkY29kZWQgc2VsZWN0b3JzXG4gICAgdGhpcy52aWV3LnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc3BhY2UpO1xuICAgIHRoaXMudmlldy5yZW5kZXIoJy5zZWN0aW9uLXNxdWFyZScpO1xuICAgIC8vIHRvdWNoU3VyZmFjZSBvbiAkc3ZnXG4gICAgdGhpcy5zdXJmYWNlID0gbmV3IFRvdWNoU3VyZmFjZSh0aGlzLnNwYWNlLiRzdmcpO1xuICAgIHRoaXMuc3VyZmFjZS5hZGRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX29uQXJlYVRvdWNoU3RhcnQpO1xuICAgIHRoaXMuc3VyZmFjZS5hZGRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5fb25BcmVhVG91Y2hNb3ZlKTtcbiAgfVxuXG4gIF9vbkFyZWFUb3VjaFN0YXJ0KGlkLCBub3JtWCwgbm9ybVkpIHtcbiAgICBpZiAoIXRoaXMucG9zaXRpb24pIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG5cbiAgICAgIHRoaXMuY29udGVudC5hY3RpdmF0ZUJ0biA9IHRydWU7XG4gICAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2VjdGlvbi1mbG9hdCcpO1xuICAgICAgdGhpcy52aWV3Lmluc3RhbGxFdmVudHMoe1xuICAgICAgICAnY2xpY2sgLmJ0bic6IChlKSA9PiB7XG4gICAgICAgICAgZS50YXJnZXQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgIHRoaXMuX3NlbmRDb29yZGluYXRlcygpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG4gICAgfVxuICB9XG5cbiAgX29uQXJlYVRvdWNoTW92ZShpZCwgbm9ybVgsIG5vcm1ZKSB7XG4gICAgdGhpcy5fdXBkYXRlUG9zaXRpb24obm9ybVgsIG5vcm1ZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBwb3NpdGlvbiBvYmplY3QgYWNjb3JkaW5nIHRvIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBub3JtWCAtIFRoZSBub3JtYWxpemVkIGNvb3JkaW5hdGUgaW4gdGhlIHggYXhpcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5vcm1ZIC0gVGhlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZSBpbiB0aGUgeSBheGlzLlxuICAgKi9cbiAgX2NyZWF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSkge1xuICAgIHRoaXMucG9zaXRpb24gPSB7XG4gICAgICBpZDogJ2xvY2F0b3InLFxuICAgICAgeDogbm9ybVggKiB0aGlzLmFyZWEud2lkdGgsXG4gICAgICB5OiBub3JtWSAqIHRoaXMuYXJlYS5oZWlnaHQsXG4gICAgICByYWRpdXM6IHRoaXMuX3Bvc2l0aW9uUmFkaXVzLFxuICAgIH1cblxuICAgIHRoaXMuc3BhY2UuYWRkUG9pbnQodGhpcy5wb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcG9zaXRpb24gb2JqZWN0IGFjY29yZGluZyB0byBub3JtYWxpemVkIGNvb3JkaW5hdGVzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbm9ybVggLSBUaGUgbm9ybWFsaXplZCBjb29yZGluYXRlIGluIHRoZSB4IGF4aXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBub3JtWSAtIFRoZSBub3JtYWxpemVkIGNvb3JkaW5hdGUgaW4gdGhlIHkgYXhpcy5cbiAgICovXG4gIF91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnggPSBub3JtWCAqIHRoaXMuYXJlYS53aWR0aDtcbiAgICB0aGlzLnBvc2l0aW9uLnkgPSBub3JtWSAqIHRoaXMuYXJlYS5oZWlnaHQ7XG5cbiAgICB0aGlzLnNwYWNlLnVwZGF0ZVBvaW50KHRoaXMucG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgY29vcmRpbmF0ZXMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIF9zZW5kQ29vcmRpbmF0ZXMoKSB7XG4gICAgaWYgKHRoaXMuX3BlcnNpc3QpIHsgLy8gc3RvcmUgbm9ybWFsaXplZCBjb29yZGluYXRlc1xuICAgICAgY29uc3Qgbm9ybVggPSB0aGlzLnBvc2l0aW9uLnggLyB0aGlzLmFyZWEud2lkdGg7XG4gICAgICBjb25zdCBub3JtWSA9IHRoaXMucG9zaXRpb24ueSAvIHRoaXMuYXJlYS5oZWlnaHQ7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0KHRoaXMuX2xvY2FsU3RvcmFnZU5hbWVzcGFjZSwgSlNPTi5zdHJpbmdpZnkoeyBub3JtWCwgbm9ybVkgfSkpO1xuICAgIH1cblxuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IHRoaXMucG9zaXRpb247XG4gICAgdGhpcy5zZW5kKCdjb29yZGluYXRlcycsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cbn1cbiJdfQ==