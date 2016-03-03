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

var _LocatorView = (function (_SquaredView) {
  _inherits(_LocatorView, _SquaredView);

  function _LocatorView(template, content, events, options) {
    _classCallCheck(this, _LocatorView);

    _get(Object.getPrototypeOf(_LocatorView.prototype), 'constructor', this).call(this, template, content, events, options);

    this.area = null;

    this._onAreaTouchStart = this._onAreaTouchStart.bind(this);
    this._onAreaTouchMove = this._onAreaTouchMove.bind(this);
  }

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

  /**
   * Sets the `area` definition.
   * @param {Object} area - Object containing the area definition.
   */

  _createClass(_LocatorView, [{
    key: 'setArea',
    value: function setArea(area) {
      this._area = area;
      this._renderArea();
    }

    /**
     * Register the function to be called when the location is choosen.
     * @param {Function} callback
     */
  }, {
    key: 'onSelect',
    value: function onSelect(callback) {
      this._onSelect = callback;
    }

    /** @inheritdoc */
  }, {
    key: 'remove',
    value: function remove() {
      _get(Object.getPrototypeOf(_LocatorView.prototype), 'remove', this).call(this);

      this.surface.removeListener('touchstart', this._onAreaTouchStart);
      this.surface.removeListener('touchmove', this._onAreaTouchMove);
    }
  }, {
    key: '_renderArea',
    value: function _renderArea() {
      this.selector = new _displaySpaceView2['default']();
      this.selector.setArea(this._area);
      this.setViewComponent('.section-square', this.selector);
      this.render('.section-square');

      this.surface = new _displayTouchSurface2['default'](this.selector.$svg);
      this.surface.addListener('touchstart', this._onAreaTouchStart);
      this.surface.addListener('touchmove', this._onAreaTouchMove);
    }

    /**
     * Callback of the `touchstart` event.
     */
  }, {
    key: '_onAreaTouchStart',
    value: function _onAreaTouchStart(id, normX, normY) {
      var _this = this;

      if (!this.position) {
        this._createPosition(normX, normY);

        this.content.showBtn = true;
        this.render('.section-float');
        this.installEvents({
          'click .btn': function clickBtn(e) {
            return _this._onSelect(_this.position.x, _this.position.y);
          }
        });
      } else {
        this._updatePosition(normX, normY);
      }
    }

    /**
     * Callback of the `touchmove` event.
     */
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
        x: normX * this._area.width,
        y: normY * this._area.height
      };

      this.selector.addPoint(this.position);
    }

    /**
     * Updates the position object according to normalized coordinates.
     * @param {Number} normX - The normalized coordinate in the x axis.
     * @param {Number} normY - The normalized coordinate in the y axis.
     */
  }, {
    key: '_updatePosition',
    value: function _updatePosition(normX, normY) {
      this.position.x = normX * this._area.width;
      this.position.y = normY * this._area.height;

      this.selector.updatePoint(this.position);
    }
  }]);

  return _LocatorView;
})(_displaySquaredView2['default']);

var ClientLocator = (function (_Service) {
  _inherits(ClientLocator, _Service);

  function ClientLocator() {
    _classCallCheck(this, ClientLocator);

    _get(Object.getPrototypeOf(ClientLocator.prototype), 'constructor', this).call(this, SERVICE_ID, true);

    /**
     * @param {Object} [defaults={}] - Defaults configuration of the service.
     * @param {Boolean} [defaults.random=false] - Send random position to the server
     *  and call `this.done()` (for development purpose)
     * @param {View} [defaults.viewCtor=_LocatorView] - The contructor of the view to be used.
     *  The view must implement the `AbstractLocatorView` interface
     */
    var defaults = {
      random: false,
      // persist: false, // @todo - re-think this with db
      viewCtor: _LocatorView
    };

    this.configure(defaults);
    this._onAknowledgeResponse = this._onAknowledgeResponse.bind(this);
    this._sendCoordinates = this._sendCoordinates.bind(this);
  }

  /** @inheritdoc */

  _createClass(ClientLocator, [{
    key: 'init',
    value: function init() {
      this.viewCtor = this.options.viewCtor;
      // this.viewOptions
      this.view = this.createView();
    }

    /** @inheritdoc */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.show();

      this.send('request');
      this.receive('aknowledge', this._onAknowledgeResponse);
    }

    /** @inheritdoc */
  }, {
    key: 'stop',
    value: function stop() {
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'stop', this).call(this);
      this.removeListener('aknowledge', this._onAknowledgeResponse);

      this.hide();
    }

    /**
     * Bypass the locator according to module configuration options.
     * If `options.random` is set to true, create random coordinates and send it
     *  to the server (mainly for development purposes).
     * @private
     * @param {Object} area - The area as defined in server configuration.
     */
  }, {
    key: '_onAknowledgeResponse',
    value: function _onAknowledgeResponse(area) {
      this.view.setArea(area);
      this.view.onSelect(this._sendCoordinates);

      if (this.options.random) {
        var x = Math.random() * area.width;
        var y = Math.random() * area.height;
        this._sendCoordinates(x, y);
      }
    }

    /**
     * Send coordinates to the server.
     * @private
     * @param {Number} x - The `x` coordinate of the client.
     * @param {Number} y - The `y` coordinate of the client.
     */
  }, {
    key: '_sendCoordinates',
    value: function _sendCoordinates(x, y) {
      _coreClient2['default'].coordinates = [x, y];

      this.send('coordinates', _coreClient2['default'].coordinates);
      this.ready();
    }
  }]);

  return ClientLocator;
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, ClientLocator);

exports['default'] = ClientLocator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50TG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUFtQixnQkFBZ0I7Ozs7OzsyQkFFZixpQkFBaUI7Ozs7a0NBQ1Ysd0JBQXdCOzs7O2dDQUM3QixzQkFBc0I7Ozs7a0NBQ3BCLHdCQUF3Qjs7OzttQ0FDdkIseUJBQXlCOzs7O0FBRWxELElBQU0sVUFBVSxHQUFHLGlCQUFpQixDQUFDOztJQUUvQixZQUFZO1lBQVosWUFBWTs7QUFDTCxXQURQLFlBQVksQ0FDSixRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7MEJBRDVDLFlBQVk7O0FBRWQsK0JBRkUsWUFBWSw2Q0FFUixRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7O0FBRTFDLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVqQixRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzRCxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUMxRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUFSRyxZQUFZOztXQWNULGlCQUFDLElBQUksRUFBRTtBQUNaLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUNwQjs7Ozs7Ozs7V0FNTyxrQkFBQyxRQUFRLEVBQUU7QUFDakIsVUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7S0FDM0I7Ozs7O1dBR0ssa0JBQUc7QUFDUCxpQ0E3QkUsWUFBWSx3Q0E2QkM7O0FBRWYsVUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENB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LENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUN2QixZQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUNyQyxZQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN0QyxZQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQzdCO0tBQ0Y7Ozs7Ozs7Ozs7V0FRZSwwQkFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3JCLDhCQUFPLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFNUIsVUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsd0JBQU8sV0FBVyxDQUFDLENBQUM7QUFDN0MsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2Q7OztTQS9FRyxhQUFhOzs7QUFrRm5CLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7O3FCQUVwQyxhQUFhIiwiZmlsZSI6Ii9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50TG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuLy8gaW1wb3J0IGxvY2FsU3RvcmFnZSBmcm9tICcuL2xvY2FsU3RvcmFnZSc7IC8vIEB0b2RvIC0gcmV0aGluayB0aGlzIHdpdGggZGJcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4uL2Rpc3BsYXkvU3BhY2VWaWV3JztcbmltcG9ydCBTcXVhcmVkVmlldyBmcm9tICcuLi9kaXNwbGF5L1NxdWFyZWRWaWV3JztcbmltcG9ydCBUb3VjaFN1cmZhY2UgZnJvbSAnLi4vZGlzcGxheS9Ub3VjaFN1cmZhY2UnO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bG9jYXRvcic7XG5cbmNsYXNzIF9Mb2NhdG9yVmlldyBleHRlbmRzIFNxdWFyZWRWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucykge1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5hcmVhID0gbnVsbDtcblxuICAgIHRoaXMuX29uQXJlYVRvdWNoU3RhcnQgPSB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25BcmVhVG91Y2hNb3ZlID0gdGhpcy5fb25BcmVhVG91Y2hNb3ZlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYGFyZWFgIGRlZmluaXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhIC0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIGFyZWEgZGVmaW5pdGlvbi5cbiAgICovXG4gIHNldEFyZWEoYXJlYSkge1xuICAgIHRoaXMuX2FyZWEgPSBhcmVhO1xuICAgIHRoaXMuX3JlbmRlckFyZWEoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGxvY2F0aW9uIGlzIGNob29zZW4uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvblNlbGVjdChjYWxsYmFjaykge1xuICAgIHRoaXMuX29uU2VsZWN0ID0gY2FsbGJhY2s7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgcmVtb3ZlKCkge1xuICAgIHN1cGVyLnJlbW92ZSgpO1xuXG4gICAgdGhpcy5zdXJmYWNlLnJlbW92ZUxpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fb25BcmVhVG91Y2hTdGFydCk7XG4gICAgdGhpcy5zdXJmYWNlLnJlbW92ZUxpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9vbkFyZWFUb3VjaE1vdmUpO1xuICB9XG5cbiAgX3JlbmRlckFyZWEoKSB7XG4gICAgdGhpcy5zZWxlY3RvciA9IG5ldyBTcGFjZVZpZXcoKTtcbiAgICB0aGlzLnNlbGVjdG9yLnNldEFyZWEodGhpcy5fYXJlYSk7XG4gICAgdGhpcy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnLCB0aGlzLnNlbGVjdG9yKTtcbiAgICB0aGlzLnJlbmRlcignLnNlY3Rpb24tc3F1YXJlJyk7XG5cbiAgICB0aGlzLnN1cmZhY2UgPSBuZXcgVG91Y2hTdXJmYWNlKHRoaXMuc2VsZWN0b3IuJHN2Zyk7XG4gICAgdGhpcy5zdXJmYWNlLmFkZExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fb25BcmVhVG91Y2hTdGFydCk7XG4gICAgdGhpcy5zdXJmYWNlLmFkZExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9vbkFyZWFUb3VjaE1vdmUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIG9mIHRoZSBgdG91Y2hzdGFydGAgZXZlbnQuXG4gICAqL1xuICBfb25BcmVhVG91Y2hTdGFydChpZCwgbm9ybVgsIG5vcm1ZKSB7XG4gICAgaWYgKCF0aGlzLnBvc2l0aW9uKSB7XG4gICAgICB0aGlzLl9jcmVhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpO1xuXG4gICAgICB0aGlzLmNvbnRlbnQuc2hvd0J0biA9IHRydWU7XG4gICAgICB0aGlzLnJlbmRlcignLnNlY3Rpb24tZmxvYXQnKTtcbiAgICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAgICdjbGljayAuYnRuJzogKGUpID0+IHRoaXMuX29uU2VsZWN0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBvZiB0aGUgYHRvdWNobW92ZWAgZXZlbnQuXG4gICAqL1xuICBfb25BcmVhVG91Y2hNb3ZlKGlkLCBub3JtWCwgbm9ybVkpIHtcbiAgICB0aGlzLl91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIHBvc2l0aW9uIG9iamVjdCBhY2NvcmRpbmcgdG8gbm9ybWFsaXplZCBjb29yZGluYXRlcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5vcm1YIC0gVGhlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZSBpbiB0aGUgeCBheGlzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbm9ybVkgLSBUaGUgbm9ybWFsaXplZCBjb29yZGluYXRlIGluIHRoZSB5IGF4aXMuXG4gICAqL1xuICBfY3JlYXRlUG9zaXRpb24obm9ybVgsIG5vcm1ZKSB7XG4gICAgdGhpcy5wb3NpdGlvbiA9IHtcbiAgICAgIGlkOiAnbG9jYXRvcicsXG4gICAgICB4OiBub3JtWCAqIHRoaXMuX2FyZWEud2lkdGgsXG4gICAgICB5OiBub3JtWSAqIHRoaXMuX2FyZWEuaGVpZ2h0LFxuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0b3IuYWRkUG9pbnQodGhpcy5wb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcG9zaXRpb24gb2JqZWN0IGFjY29yZGluZyB0byBub3JtYWxpemVkIGNvb3JkaW5hdGVzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbm9ybVggLSBUaGUgbm9ybWFsaXplZCBjb29yZGluYXRlIGluIHRoZSB4IGF4aXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBub3JtWSAtIFRoZSBub3JtYWxpemVkIGNvb3JkaW5hdGUgaW4gdGhlIHkgYXhpcy5cbiAgICovXG4gIF91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnggPSBub3JtWCAqIHRoaXMuX2FyZWEud2lkdGg7XG4gICAgdGhpcy5wb3NpdGlvbi55ID0gbm9ybVkgKiB0aGlzLl9hcmVhLmhlaWdodDtcblxuICAgIHRoaXMuc2VsZWN0b3IudXBkYXRlUG9pbnQodGhpcy5wb3NpdGlvbik7XG4gIH1cbn1cblxuLyoqXG4gKiBbY2xpZW50XSBBbGxvdyB0byBpbmRpY2F0ZSB0aGUgYXBwcm94aW1hdGUgbG9jYXRpb24gb2YgdGhlIGNsaWVudCBvbiBhIG1hcC5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3IHRoYXQgZGlzcGxheXMgdGhlIG1hcCBhbmQgYSBidXR0b24gdG8gdmFsaWRhdGUgdGhlIGxvY2F0aW9uLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIGFmdGVyIHRoZSB1c2VyIGNvbmZpcm1zIGhpcyAvIGhlciBhcHByb3hpbWF0ZSBsb2NhdGlvbiBieSBjbGlja2luZyBvbiB0aGUg4oCcVmFsaWRhdGXigJ0gYnV0dG9uLiBGb3IgZGV2ZWxvcG1lbnQgcHVycG9zZXMgaXQgY2FuIGJlIGNvbmZpZ3VyZWQgdG8gc2VuZCByYW5kb20gY29vcmRpbmF0ZXMgb3IgcmV0cmlldmluZyBwcmV2aW91c2x5IHN0b3JlZCBsb2NhdGlvbiAoc2VlIGBvcHRpb25zLnJhbmRvbWAgYW5kIGBvcHRpb25zLnBlcnNpc3RgLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJMb2NhdG9yLmpzflNlcnZlckxvY2F0b3J9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGxvY2F0b3IgPSBuZXcgQ2xpZW50TG9jYXRvcigpO1xuICovXG5jbGFzcyBDbGllbnRMb2NhdG9yIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtkZWZhdWx0cz17fV0gLSBEZWZhdWx0cyBjb25maWd1cmF0aW9uIG9mIHRoZSBzZXJ2aWNlLlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2RlZmF1bHRzLnJhbmRvbT1mYWxzZV0gLSBTZW5kIHJhbmRvbSBwb3NpdGlvbiB0byB0aGUgc2VydmVyXG4gICAgICogIGFuZCBjYWxsIGB0aGlzLmRvbmUoKWAgKGZvciBkZXZlbG9wbWVudCBwdXJwb3NlKVxuICAgICAqIEBwYXJhbSB7Vmlld30gW2RlZmF1bHRzLnZpZXdDdG9yPV9Mb2NhdG9yVmlld10gLSBUaGUgY29udHJ1Y3RvciBvZiB0aGUgdmlldyB0byBiZSB1c2VkLlxuICAgICAqICBUaGUgdmlldyBtdXN0IGltcGxlbWVudCB0aGUgYEFic3RyYWN0TG9jYXRvclZpZXdgIGludGVyZmFjZVxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgcmFuZG9tOiBmYWxzZSxcbiAgICAgIC8vIHBlcnNpc3Q6IGZhbHNlLCAvLyBAdG9kbyAtIHJlLXRoaW5rIHRoaXMgd2l0aCBkYlxuICAgICAgdmlld0N0b3I6IF9Mb2NhdG9yVmlldyxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICAgIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlID0gdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMgPSB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBpbml0KCkge1xuICAgIHRoaXMudmlld0N0b3IgPSB0aGlzLm9wdGlvbnMudmlld0N0b3I7XG4gICAgLy8gdGhpcy52aWV3T3B0aW9uc1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zaG93KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2Frbm93bGVkZ2UnLCB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignYWtub3dsZWRnZScsIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlKTtcblxuICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJ5cGFzcyB0aGUgbG9jYXRvciBhY2NvcmRpbmcgdG8gbW9kdWxlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogSWYgYG9wdGlvbnMucmFuZG9tYCBpcyBzZXQgdG8gdHJ1ZSwgY3JlYXRlIHJhbmRvbSBjb29yZGluYXRlcyBhbmQgc2VuZCBpdFxuICAgKiAgdG8gdGhlIHNlcnZlciAobWFpbmx5IGZvciBkZXZlbG9wbWVudCBwdXJwb3NlcykuXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhIC0gVGhlIGFyZWEgYXMgZGVmaW5lZCBpbiBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIF9vbkFrbm93bGVkZ2VSZXNwb25zZShhcmVhKSB7XG4gICAgdGhpcy52aWV3LnNldEFyZWEoYXJlYSk7XG4gICAgdGhpcy52aWV3Lm9uU2VsZWN0KHRoaXMuX3NlbmRDb29yZGluYXRlcyk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnJhbmRvbSkge1xuICAgICAgY29uc3QgeCA9IE1hdGgucmFuZG9tKCkgKiBhcmVhLndpZHRoO1xuICAgICAgY29uc3QgeSA9IE1hdGgucmFuZG9tKCkgKiBhcmVhLmhlaWdodDtcbiAgICAgIHRoaXMuX3NlbmRDb29yZGluYXRlcyh4LCB5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBjb29yZGluYXRlcyB0byB0aGUgc2VydmVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSBgeGAgY29vcmRpbmF0ZSBvZiB0aGUgY2xpZW50LlxuICAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSBgeWAgY29vcmRpbmF0ZSBvZiB0aGUgY2xpZW50LlxuICAgKi9cbiAgX3NlbmRDb29yZGluYXRlcyh4LCB5KSB7XG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gW3gsIHldO1xuXG4gICAgdGhpcy5zZW5kKCdjb29yZGluYXRlcycsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIENsaWVudExvY2F0b3IpO1xuXG5leHBvcnQgZGVmYXVsdCBDbGllbnRMb2NhdG9yO1xuIl19