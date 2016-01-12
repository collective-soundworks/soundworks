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

var _displayView = require('./display/View');

var _displayView2 = _interopRequireDefault(_displayView);

var _displaySquaredView = require('./display/SquaredView');

var _displaySquaredView2 = _interopRequireDefault(_displaySquaredView);

var _displaySpaceView = require('./display/SpaceView');

var _displaySpaceView2 = _interopRequireDefault(_displaySpaceView);

var _displayTouchSurface = require('./display/TouchSurface');

var _displayTouchSurface2 = _interopRequireDefault(_displayTouchSurface);

/**
 * [client] Allow to indicate the approximate location of the client on a map.
 *
 * The module always has a view (that displays the map and a button to validate the location) and requires the SASS partial `_77-locator.scss`.
 *
 * The module finishes its initialization after the user confirms his / her approximate location by clicking on the “Validate” button.
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
   * @param {Boolean} [options.random=false] - Send random position to the server and call `this.done()` (for developpement purpose)
   * @param {Boolean} [options.persist=false] - If set to `true`, store the normalized coordinates in `localStorage` and retrieve them in subsequent calls. Delete the stored position when set to `false`. (for developpement purpose)
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

      // if (id !== 0) { return; } // does not work in Safari -> how to prevent multitouch ?
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
  }, {
    key: '_updatePosition',
    value: function _updatePosition(normX, normY) {
      this.position.x = normX * this.area.width;
      this.position.y = normY * this.area.height;

      this.space.updatePoint(this.position);
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50TG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7OzZCQUNKLGdCQUFnQjs7Ozs0QkFDaEIsZ0JBQWdCOzs7OzJCQUN4QixnQkFBZ0I7Ozs7a0NBQ1QsdUJBQXVCOzs7O2dDQUN6QixxQkFBcUI7Ozs7bUNBQ2xCLHdCQUF3Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFlNUIsYUFBYTtZQUFiLGFBQWE7Ozs7Ozs7OztBQU9yQixXQVBRLGFBQWEsR0FPTjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUEwsYUFBYTs7QUFROUIsK0JBUmlCLGFBQWEsNkNBUXhCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFLE9BQU8sRUFBRTs7QUFFMUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQztBQUN2QyxRQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDO0FBQ3pDLFFBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLGNBQWMsSUFBSSxHQUFHLENBQUM7QUFDckQsUUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxpQ0FBYSxDQUFDO0FBQ2hELFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsbUNBQWUsQ0FBQzs7O0FBR2hELFFBQUksQ0FBQyxzQkFBc0IsbUJBQWlCLElBQUksQ0FBQyxJQUFJLEFBQUUsQ0FBQzs7QUFFeEQsUUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0QsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXpELFFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNiOztlQXZCa0IsYUFB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QUFDakQsa0NBQWEsR0FBRyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQ2pGOztBQUVELDBCQUFPLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ25DLFVBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLG9CQUFPLFdBQVcsQ0FBQyxDQUFDO0FBQzdDLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7U0FwSWtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50TG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgbG9jYWxTdG9yYWdlIGZyb20gJy4vbG9jYWxTdG9yYWdlJztcbmltcG9ydCBWaWV3IGZyb20gJy4vZGlzcGxheS9WaWV3JztcbmltcG9ydCBTcXVhcmVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU3F1YXJlZFZpZXcnO1xuaW1wb3J0IFNwYWNlVmlldyBmcm9tICcuL2Rpc3BsYXkvU3BhY2VWaWV3JztcbmltcG9ydCBUb3VjaFN1cmZhY2UgZnJvbSAnLi9kaXNwbGF5L1RvdWNoU3VyZmFjZSc7XG5cblxuLyoqXG4gKiBbY2xpZW50XSBBbGxvdyB0byBpbmRpY2F0ZSB0aGUgYXBwcm94aW1hdGUgbG9jYXRpb24gb2YgdGhlIGNsaWVudCBvbiBhIG1hcC5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3ICh0aGF0IGRpc3BsYXlzIHRoZSBtYXAgYW5kIGEgYnV0dG9uIHRvIHZhbGlkYXRlIHRoZSBsb2NhdGlvbikgYW5kIHJlcXVpcmVzIHRoZSBTQVNTIHBhcnRpYWwgYF83Ny1sb2NhdG9yLnNjc3NgLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIGFmdGVyIHRoZSB1c2VyIGNvbmZpcm1zIGhpcyAvIGhlciBhcHByb3hpbWF0ZSBsb2NhdGlvbiBieSBjbGlja2luZyBvbiB0aGUg4oCcVmFsaWRhdGXigJ0gYnV0dG9uLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJMb2NhdG9yLmpzflNlcnZlckxvY2F0b3J9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGxvY2F0b3IgPSBuZXcgQ2xpZW50TG9jYXRvcigpO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRMb2NhdG9yIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nbG9jYXRvciddIC0gVGhlIG5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5yYW5kb209ZmFsc2VdIC0gU2VuZCByYW5kb20gcG9zaXRpb24gdG8gdGhlIHNlcnZlciBhbmQgY2FsbCBgdGhpcy5kb25lKClgIChmb3IgZGV2ZWxvcHBlbWVudCBwdXJwb3NlKVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnBlcnNpc3Q9ZmFsc2VdIC0gSWYgc2V0IHRvIGB0cnVlYCwgc3RvcmUgdGhlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZXMgaW4gYGxvY2FsU3RvcmFnZWAgYW5kIHJldHJpZXZlIHRoZW0gaW4gc3Vic2VxdWVudCBjYWxscy4gRGVsZXRlIHRoZSBzdG9yZWQgcG9zaXRpb24gd2hlbiBzZXQgdG8gYGZhbHNlYC4gKGZvciBkZXZlbG9wcGVtZW50IHB1cnBvc2UpXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2xvY2F0b3InLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX3JhbmRvbSA9IG9wdGlvbnMucmFuZG9tIHx8wqBmYWxzZTtcbiAgICB0aGlzLl9wZXJzaXN0ID0gb3B0aW9ucy5wZXJzaXN0IHx8wqBmYWxzZTtcbiAgICB0aGlzLl9wb3NpdGlvblJhZGl1cyA9IG9wdGlvbnMucG9zaXRpb25SYWRpdXMgfHzCoDAuMztcbiAgICB0aGlzLnNwYWNlQ3RvciA9IG9wdGlvbnMuc3BhY2VDdG9yIHx8wqBTcGFjZVZpZXc7XG4gICAgdGhpcy52aWV3Q3RvciA9IG9wdGlvbnMudmlld0N0b3IgfHzCoFNxdWFyZWRWaWV3O1xuXG4gICAgLy8gVGhlIG5hbWVzcGFjZSB3aGVyZSBjb29yZGluYXRlcyBhcmUgc3RvcmVkIHdoZW4gYG9wdGlvbnMucGVyc2lzdCA9IHRydWVgLlxuICAgIHRoaXMuX2xvY2FsU3RvcmFnZU5hbWVzcGFjZSA9IGBzb3VuZHdvcmtzOiR7dGhpcy5uYW1lfWA7XG5cbiAgICB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0ID0gdGhpcy5fb25BcmVhVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQXJlYVRvdWNoTW92ZSA9IHRoaXMuX29uQXJlYVRvdWNoTW92ZS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuY29udGVudC5hY3RpdmF0ZUJ0biA9IGZhbHNlO1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG5cbiAgICBpZiAoIXRoaXMuX3BlcnNpc3QpXG4gICAgICBsb2NhbFN0b3JhZ2UuZGVsZXRlKHRoaXMuX2xvY2FsU3RvcmFnZU5hbWVzcGFjZSk7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ2FyZWEnLCAoYXJlYSkgPT4ge1xuICAgICAgdGhpcy5fYXR0YWNoQXJlYShhcmVhKTtcblxuICAgICAgLy8gQnlwYXNzIHRoZSBsb2NhdG9yIGFjY29yZGluZyB0byBtb2R1bGUgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgICAgLy8gSWYgYG9wdGlvbnMucmFuZG9tYCBpcyBzZXQgdG8gdHJ1ZSwgdXNlIHJhbmRvbSBjb29yZGluYXRlcy5cbiAgICAgIC8vIElmIGBvcHRpb25zLnBlcnNpc3RgIGlzIHNldCB0byB0cnVlIHVzZSBjb29yZGluYXRlcyBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZSxcbiAgICAgIC8vIGRvIG5vdGhpbmcgd2hlbiBubyBjb29yZGluYXRlcyBhcmUgc3RvcmVkIHlldC5cbiAgICAgIGlmICh0aGlzLl9yYW5kb20gfHzCoHRoaXMuX3BlcnNpc3QpIHtcbiAgICAgICAgbGV0IGNvb3JkcztcblxuICAgICAgICBpZiAodGhpcy5fcmFuZG9tKSB7XG4gICAgICAgICAgY29vcmRzLm5vcm1YID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICBjb29yZHMubm9ybVkgPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3BlcnNpc3QpIHtcbiAgICAgICAgICBjb29yZHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXQodGhpcy5fbG9jYWxTdG9yYWdlTmFtZXNwYWNlKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29vcmRzICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5fY3JlYXRlUG9zaXRpb24oY29vcmRzLm5vcm1YLCBjb29yZHMubm9ybVkpO1xuICAgICAgICAgIHRoaXMuX3NlbmRDb29yZGluYXRlcygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgYFNwYWNlVmlld2AgYW5kIGRpc3BsYXkgaXQgaW4gdGhlIHNxdWFyZSBzZWN0aW9uIG9mIHRoZSB2aWV3XG4gICAqL1xuICBfYXR0YWNoQXJlYShhcmVhKSB7XG4gICAgdGhpcy5hcmVhID0gYXJlYTtcbiAgICB0aGlzLnNwYWNlID0gbmV3IHRoaXMuc3BhY2VDdG9yKGFyZWEsIHt9LCB7IGlzU3ViVmlldzogdHJ1ZSB9KTtcbiAgICAvLyBAdG9kbyAtIGZpbmQgYSB3YXkgdG8gcmVtb3ZlIHRoZXNlIGhhcmRjb2RlZCBzZWxlY3RvcnNcbiAgICB0aGlzLnZpZXcuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tc3F1YXJlJywgdGhpcy5zcGFjZSk7XG4gICAgdGhpcy52aWV3LnJlbmRlcignLnNlY3Rpb24tc3F1YXJlJyk7XG4gICAgLy8gdG91Y2hTdXJmYWNlIG9uICRzdmdcbiAgICB0aGlzLnN1cmZhY2UgPSBuZXcgVG91Y2hTdXJmYWNlKHRoaXMuc3BhY2UuJHN2Zyk7XG4gICAgdGhpcy5zdXJmYWNlLmFkZExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fb25BcmVhVG91Y2hTdGFydCk7XG4gICAgdGhpcy5zdXJmYWNlLmFkZExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9vbkFyZWFUb3VjaE1vdmUpO1xuICB9XG5cbiAgX29uQXJlYVRvdWNoU3RhcnQoaWQsIG5vcm1YLCBub3JtWSkge1xuICAgIC8vIGlmIChpZCAhPT0gMCkgeyByZXR1cm47IH0gLy8gZG9lcyBub3Qgd29yayBpbiBTYWZhcmkgLT4gaG93IHRvIHByZXZlbnQgbXVsdGl0b3VjaCA/XG4gICAgaWYgKCF0aGlzLnBvc2l0aW9uKSB7XG4gICAgICB0aGlzLl9jcmVhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpO1xuXG4gICAgICB0aGlzLmNvbnRlbnQuYWN0aXZhdGVCdG4gPSB0cnVlO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcignLnNlY3Rpb24tZmxvYXQnKTtcbiAgICAgIHRoaXMudmlldy5pbnN0YWxsRXZlbnRzKHtcbiAgICAgICAgJ2NsaWNrIC5idG4nOiAoZSkgPT4ge1xuICAgICAgICAgIGUudGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMoKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpO1xuICAgIH1cbiAgfVxuXG4gIF9vbkFyZWFUb3VjaE1vdmUoaWQsIG5vcm1YLCBub3JtWSkge1xuICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG4gIH1cblxuICBfY3JlYXRlUG9zaXRpb24obm9ybVgsIG5vcm1ZKSB7XG4gICAgdGhpcy5wb3NpdGlvbiA9IHtcbiAgICAgIGlkOiAnbG9jYXRvcicsXG4gICAgICB4OiBub3JtWCAqIHRoaXMuYXJlYS53aWR0aCxcbiAgICAgIHk6IG5vcm1ZICogdGhpcy5hcmVhLmhlaWdodCxcbiAgICAgIHJhZGl1czogdGhpcy5fcG9zaXRpb25SYWRpdXMsXG4gICAgfVxuXG4gICAgdGhpcy5zcGFjZS5hZGRQb2ludCh0aGlzLnBvc2l0aW9uKTtcbiAgfVxuXG4gIF91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnggPSBub3JtWCAqIHRoaXMuYXJlYS53aWR0aDtcbiAgICB0aGlzLnBvc2l0aW9uLnkgPSBub3JtWSAqIHRoaXMuYXJlYS5oZWlnaHQ7XG5cbiAgICB0aGlzLnNwYWNlLnVwZGF0ZVBvaW50KHRoaXMucG9zaXRpb24pO1xuICB9XG5cbiAgX3NlbmRDb29yZGluYXRlcygpIHtcbiAgICBpZiAodGhpcy5fcGVyc2lzdCkgeyAvLyBzdG9yZSBub3JtYWxpemVkIGNvb3JkaW5hdGVzXG4gICAgICBjb25zdCBub3JtWCA9IHRoaXMucG9zaXRpb24ueCAvIHRoaXMuYXJlYS53aWR0aDtcbiAgICAgIGNvbnN0IG5vcm1ZID0gdGhpcy5wb3NpdGlvbi55IC8gdGhpcy5hcmVhLmhlaWdodDtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXQodGhpcy5fbG9jYWxTdG9yYWdlTmFtZXNwYWNlLCBKU09OLnN0cmluZ2lmeSh7IG5vcm1YLCBub3JtWSB9KSk7XG4gICAgfVxuXG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gdGhpcy5wb3NpdGlvbjtcbiAgICB0aGlzLnNlbmQoJ2Nvb3JkaW5hdGVzJywgY2xpZW50LmNvb3JkaW5hdGVzKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxufVxuIl19