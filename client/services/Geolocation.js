'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:geolocation';
var geolocation = navigator.geolocation;

function geopositionToJson(geoposition) {
  return {
    timestamp: geoposition.timestamp,
    coords: {
      accuracy: geoposition.coords.accuracy,
      altitude: geoposition.coords.altitude,
      altitudeAccuracy: geoposition.coords.altitudeAccuracy,
      heading: geoposition.coords.heading,
      latitude: geoposition.coords.latitude,
      longitude: geoposition.coords.longitude,
      speed: geoposition.coords.speed
    }
  };
}

function getRandomGeoposition() {
  return {
    timestamp: new Date().getTime(),
    coords: {
      accuracy: 10,
      altitude: 10,
      altitudeAccuracy: 10,
      heading: 0,
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180,
      speed: 1
    }
  };
}

// this is quite a large update...
function updateRandomGeoposition(geoposition) {
  geoposition.timestamp = new Date().getTime();
  geoposition.coords.latitude += Math.random() * 1e-4 - 1e-4 / 2;
  geoposition.coords.longitude += Math.random() * 1e-4 - 1e-4 / 2;
}

/**
 * Interface for the client `'geolocation'` service.
 *
 * The `'geolocation'` service allows to retrieve the latitude and longitude
 * of the client using `gps`. The current values are store into the
 * `client.coordinates` member.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Geolocation}*__
 *
 * @param {Object} options - Override default options.
 * @param {'start'|'stop'} [options.state='start'] - Default state when the
 *  service is launched.
 * @param {Boolean} [options.enableHighAccuracy=true] - Define if the application
 *  would like to receive the best possible results (cf. [https://dev.w3.org/geo/api/spec-source.html#high-accuracy](https://dev.w3.org/geo/api/spec-source.html#high-accuracy)).
 *
 * @memberof module:soundworks/client
 */

var Geolocation = function (_Service) {
  (0, _inherits3.default)(Geolocation, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function Geolocation() {
    (0, _classCallCheck3.default)(this, Geolocation);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Geolocation.__proto__ || (0, _getPrototypeOf2.default)(Geolocation)).call(this, SERVICE_ID, true));

    var defaults = {
      state: 'start',
      enableHighAccuracy: true
      // bypass: false,
    };

    _this.platform = _this.require('platform');

    _this._onSuccess = _this._onSuccess.bind(_this);
    _this._onError = _this._onError.bind(_this);
    _this._watchId = null;
    _this.state = null;
    return _this;
  }

  (0, _createClass3.default)(Geolocation, [{
    key: 'configure',
    value: function configure(options) {
      var _options = (0, _assign2.default)({}, this.defaults, options);

      if (!this.options.feature) {
        var feature = 'geolocation';

        if (options.bypass !== undefined && options.bypass === true) feature = 'geolocation-mock';

        this.options.feature = feature;
        this.platform.requireFeature(feature);
      }

      (0, _get3.default)(Geolocation.prototype.__proto__ || (0, _getPrototypeOf2.default)(Geolocation.prototype), 'configure', this).call(this, options);
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)(Geolocation.prototype.__proto__ || (0, _getPrototypeOf2.default)(Geolocation.prototype), 'start', this).call(this);

      if (this.options.feature === 'geolocation-mock') {
        var geoposition = getRandomGeoposition();
        this._updateClient(geoposition);
      }

      // only sync values retrieved from `platform` with server before getting ready
      this.emit('geoposition', _client2.default.geoposition);
      this.send('geoposition', geopositionToJson(_client2.default.geoposition));
      this.ready();

      this.setState(this.options.state);
    }

    /**
     * Set the state of the service.
     *
     * @param {'start'|'stop'} String - New state of the service.
     */

  }, {
    key: 'setState',
    value: function setState(state) {
      if (this.state !== state) {
        this.state = state;

        if (this.state === 'start') this._startWatch();else this._stopWatch();
      }
    }

    /**
     * Resume the refresh of the position.
     * @private
     */

  }, {
    key: '_startWatch',
    value: function _startWatch() {
      var _this2 = this;

      if (this.options.debug === false) {
        this._watchId = geolocation.watchPosition(this._onSuccess, this._onError, this.options);
      } else {
        this._watchId = setInterval(function () {
          updateRandomGeoposition(_client2.default.geoposition);
          _this2._onSuccess(_client2.default.geoposition);
        }, 3000);
      }
    }

    /**
     * Pause the refresh of the position.
     * @private
     */

  }, {
    key: '_stopWatch',
    value: function _stopWatch() {
      if (this.options.debug === false) navigator.geolocation.clearWatch(this._watchId);else clearInterval(this._watchId);
    }

    /** @private */

  }, {
    key: '_onSuccess',
    value: function _onSuccess(geoposition) {
      this._updateClient(geoposition);
      this.emit('geoposition', geoposition);
      this.send('geoposition', geopositionToJson(geoposition));
    }

    /** @private */

  }, {
    key: '_updateClient',
    value: function _updateClient(geoposition) {
      var coords = geoposition.coords;
      _client2.default.coordinates = [coords.latitude, coords.longitude];
      _client2.default.geoposition = geoposition;
    }

    /** @private */

  }, {
    key: '_onError',
    value: function _onError(err) {
      console.error(err.stack);
    }
  }]);
  return Geolocation;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Geolocation);

exports.default = Geolocation;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdlb2xvY2F0aW9uLmpzIl0sIm5hbWVzIjpbIlNFUlZJQ0VfSUQiLCJnZW9sb2NhdGlvbiIsIm5hdmlnYXRvciIsImdlb3Bvc2l0aW9uVG9Kc29uIiwiZ2VvcG9zaXRpb24iLCJ0aW1lc3RhbXAiLCJjb29yZHMiLCJhY2N1cmFjeSIsImFsdGl0dWRlIiwiYWx0aXR1ZGVBY2N1cmFjeSIsImhlYWRpbmciLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsInNwZWVkIiwiZ2V0UmFuZG9tR2VvcG9zaXRpb24iLCJEYXRlIiwiZ2V0VGltZSIsIk1hdGgiLCJyYW5kb20iLCJ1cGRhdGVSYW5kb21HZW9wb3NpdGlvbiIsIkdlb2xvY2F0aW9uIiwiZGVmYXVsdHMiLCJzdGF0ZSIsImVuYWJsZUhpZ2hBY2N1cmFjeSIsInBsYXRmb3JtIiwicmVxdWlyZSIsIl9vblN1Y2Nlc3MiLCJiaW5kIiwiX29uRXJyb3IiLCJfd2F0Y2hJZCIsIm9wdGlvbnMiLCJfb3B0aW9ucyIsImZlYXR1cmUiLCJieXBhc3MiLCJ1bmRlZmluZWQiLCJyZXF1aXJlRmVhdHVyZSIsIl91cGRhdGVDbGllbnQiLCJlbWl0Iiwic2VuZCIsInJlYWR5Iiwic2V0U3RhdGUiLCJfc3RhcnRXYXRjaCIsIl9zdG9wV2F0Y2giLCJkZWJ1ZyIsIndhdGNoUG9zaXRpb24iLCJzZXRJbnRlcnZhbCIsImNsZWFyV2F0Y2giLCJjbGVhckludGVydmFsIiwiY29vcmRpbmF0ZXMiLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJzdGFjayIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQSxJQUFNQSxhQUFhLHFCQUFuQjtBQUNBLElBQU1DLGNBQWNDLFVBQVVELFdBQTlCOztBQUVBLFNBQVNFLGlCQUFULENBQTJCQyxXQUEzQixFQUF3QztBQUN0QyxTQUFPO0FBQ0xDLGVBQVdELFlBQVlDLFNBRGxCO0FBRUxDLFlB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QyxXQUFQLEdBQXFCLENBQUMxQyxPQUFPSyxRQUFSLEVBQWtCTCxPQUFPTSxTQUF6QixDQUFyQjtBQUNBLHVCQUFPUixXQUFQLEdBQXFCQSxXQUFyQjtBQUNEOztBQUVEOzs7OzZCQUNTNkMsRyxFQUFLO0FBQ1pDLGNBQVFDLEtBQVIsQ0FBY0YsSUFBSUcsS0FBbEI7QUFDRDs7Ozs7QUFHSCx5QkFBZUMsUUFBZixDQUF3QnJELFVBQXhCLEVBQW9Db0IsV0FBcEM7O2tCQUVlQSxXIiwiZmlsZSI6Ikdlb2xvY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpnZW9sb2NhdGlvbic7XG5jb25zdCBnZW9sb2NhdGlvbiA9IG5hdmlnYXRvci5nZW9sb2NhdGlvbjtcblxuZnVuY3Rpb24gZ2VvcG9zaXRpb25Ub0pzb24oZ2VvcG9zaXRpb24pIHtcbiAgcmV0dXJuIHtcbiAgICB0aW1lc3RhbXA6IGdlb3Bvc2l0aW9uLnRpbWVzdGFtcCxcbiAgICBjb29yZHM6IHtcbiAgICAgIGFjY3VyYWN5OiBnZW9wb3NpdGlvbi5jb29yZHMuYWNjdXJhY3ksXG4gICAgICBhbHRpdHVkZTogZ2VvcG9zaXRpb24uY29vcmRzLmFsdGl0dWRlLFxuICAgICAgYWx0aXR1ZGVBY2N1cmFjeTogZ2VvcG9zaXRpb24uY29vcmRzLmFsdGl0dWRlQWNjdXJhY3ksXG4gICAgICBoZWFkaW5nOiBnZW9wb3NpdGlvbi5jb29yZHMuaGVhZGluZyxcbiAgICAgIGxhdGl0dWRlOiBnZW9wb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXG4gICAgICBsb25naXR1ZGU6IGdlb3Bvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICBzcGVlZDogZ2VvcG9zaXRpb24uY29vcmRzLnNwZWVkXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFJhbmRvbUdlb3Bvc2l0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAgY29vcmRzOiB7XG4gICAgICBhY2N1cmFjeTogMTAsXG4gICAgICBhbHRpdHVkZTogMTAsXG4gICAgICBhbHRpdHVkZUFjY3VyYWN5OiAxMCxcbiAgICAgIGhlYWRpbmc6IDAsXG4gICAgICBsYXRpdHVkZTogTWF0aC5yYW5kb20oKSAqIDE4MCAtIDkwLFxuICAgICAgbG9uZ2l0dWRlOiBNYXRoLnJhbmRvbSgpICogMzYwIC0gMTgwLFxuICAgICAgc3BlZWQ6IDEsXG4gICAgfVxuICB9O1xufVxuXG4vLyB0aGlzIGlzIHF1aXRlIGEgbGFyZ2UgdXBkYXRlLi4uXG5mdW5jdGlvbiB1cGRhdGVSYW5kb21HZW9wb3NpdGlvbihnZW9wb3NpdGlvbikge1xuICBnZW9wb3NpdGlvbi50aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgZ2VvcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlICs9IChNYXRoLnJhbmRvbSgpICogMWUtNCkgLSAoMWUtNCAvIDIpO1xuICBnZW9wb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlICs9IChNYXRoLnJhbmRvbSgpICogMWUtNCkgLSAoMWUtNCAvIDIpO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ2dlb2xvY2F0aW9uJ2Agc2VydmljZS5cbiAqXG4gKiBUaGUgYCdnZW9sb2NhdGlvbidgIHNlcnZpY2UgYWxsb3dzIHRvIHJldHJpZXZlIHRoZSBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlXG4gKiBvZiB0aGUgY2xpZW50IHVzaW5nIGBncHNgLiBUaGUgY3VycmVudCB2YWx1ZXMgYXJlIHN0b3JlIGludG8gdGhlXG4gKiBgY2xpZW50LmNvb3JkaW5hdGVzYCBtZW1iZXIuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkdlb2xvY2F0aW9ufSpfX1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBvcHRpb25zLlxuICogQHBhcmFtIHsnc3RhcnQnfCdzdG9wJ30gW29wdGlvbnMuc3RhdGU9J3N0YXJ0J10gLSBEZWZhdWx0IHN0YXRlIHdoZW4gdGhlXG4gKiAgc2VydmljZSBpcyBsYXVuY2hlZC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZW5hYmxlSGlnaEFjY3VyYWN5PXRydWVdIC0gRGVmaW5lIGlmIHRoZSBhcHBsaWNhdGlvblxuICogIHdvdWxkIGxpa2UgdG8gcmVjZWl2ZSB0aGUgYmVzdCBwb3NzaWJsZSByZXN1bHRzIChjZi4gW2h0dHBzOi8vZGV2LnczLm9yZy9nZW8vYXBpL3NwZWMtc291cmNlLmh0bWwjaGlnaC1hY2N1cmFjeV0oaHR0cHM6Ly9kZXYudzMub3JnL2dlby9hcGkvc3BlYy1zb3VyY2UuaHRtbCNoaWdoLWFjY3VyYWN5KSkuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICovXG5jbGFzcyBHZW9sb2NhdGlvbiBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBzdGF0ZTogJ3N0YXJ0JyxcbiAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZSxcbiAgICAgIC8vIGJ5cGFzczogZmFsc2UsXG4gICAgfTtcblxuICAgIHRoaXMucGxhdGZvcm0gPSB0aGlzLnJlcXVpcmUoJ3BsYXRmb3JtJyk7XG5cbiAgICB0aGlzLl9vblN1Y2Nlc3MgPSB0aGlzLl9vblN1Y2Nlc3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkVycm9yID0gdGhpcy5fb25FcnJvci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3dhdGNoSWQgPSBudWxsO1xuICAgIHRoaXMuc3RhdGUgPSBudWxsO1xuICB9XG5cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBjb25zdCBfb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuZmVhdHVyZSkge1xuICAgICAgbGV0IGZlYXR1cmUgPSAnZ2VvbG9jYXRpb24nO1xuXG4gICAgICBpZiAob3B0aW9ucy5ieXBhc3MgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLmJ5cGFzcyA9PT0gdHJ1ZSlcbiAgICAgICAgZmVhdHVyZSA9ICdnZW9sb2NhdGlvbi1tb2NrJztcblxuICAgICAgdGhpcy5vcHRpb25zLmZlYXR1cmUgPSBmZWF0dXJlO1xuICAgICAgdGhpcy5wbGF0Zm9ybS5yZXF1aXJlRmVhdHVyZShmZWF0dXJlKTtcbiAgICB9XG5cbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZmVhdHVyZSA9PT0gJ2dlb2xvY2F0aW9uLW1vY2snKSB7XG4gICAgICBjb25zdCBnZW9wb3NpdGlvbiA9IGdldFJhbmRvbUdlb3Bvc2l0aW9uKCk7XG4gICAgICB0aGlzLl91cGRhdGVDbGllbnQoZ2VvcG9zaXRpb24pO1xuICAgIH1cblxuICAgIC8vIG9ubHkgc3luYyB2YWx1ZXMgcmV0cmlldmVkIGZyb20gYHBsYXRmb3JtYCB3aXRoIHNlcnZlciBiZWZvcmUgZ2V0dGluZyByZWFkeVxuICAgIHRoaXMuZW1pdCgnZ2VvcG9zaXRpb24nLCBjbGllbnQuZ2VvcG9zaXRpb24pO1xuICAgIHRoaXMuc2VuZCgnZ2VvcG9zaXRpb24nLCBnZW9wb3NpdGlvblRvSnNvbihjbGllbnQuZ2VvcG9zaXRpb24pKTtcbiAgICB0aGlzLnJlYWR5KCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHRoaXMub3B0aW9ucy5zdGF0ZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBzdGF0ZSBvZiB0aGUgc2VydmljZS5cbiAgICpcbiAgICogQHBhcmFtIHsnc3RhcnQnfCdzdG9wJ30gU3RyaW5nIC0gTmV3IHN0YXRlIG9mIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICBpZiAodGhpcy5zdGF0ZSAhPT0gc3RhdGUpIHtcbiAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcblxuICAgICAgaWYgKHRoaXMuc3RhdGUgPT09ICdzdGFydCcpXG4gICAgICAgIHRoaXMuX3N0YXJ0V2F0Y2goKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5fc3RvcFdhdGNoKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc3VtZSB0aGUgcmVmcmVzaCBvZiB0aGUgcG9zaXRpb24uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc3RhcnRXYXRjaCgpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5fd2F0Y2hJZCA9IGdlb2xvY2F0aW9uLndhdGNoUG9zaXRpb24odGhpcy5fb25TdWNjZXNzLCB0aGlzLl9vbkVycm9yLCB0aGlzLm9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl93YXRjaElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICB1cGRhdGVSYW5kb21HZW9wb3NpdGlvbihjbGllbnQuZ2VvcG9zaXRpb24pO1xuICAgICAgICB0aGlzLl9vblN1Y2Nlc3MoY2xpZW50Lmdlb3Bvc2l0aW9uKTtcbiAgICAgIH0sIDMwMDApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQYXVzZSB0aGUgcmVmcmVzaCBvZiB0aGUgcG9zaXRpb24uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc3RvcFdhdGNoKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcgPT09IGZhbHNlKVxuICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmNsZWFyV2F0Y2godGhpcy5fd2F0Y2hJZCk7XG4gICAgZWxzZVxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl93YXRjaElkKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25TdWNjZXNzKGdlb3Bvc2l0aW9uKSB7XG4gICAgdGhpcy5fdXBkYXRlQ2xpZW50KGdlb3Bvc2l0aW9uKTtcbiAgICB0aGlzLmVtaXQoJ2dlb3Bvc2l0aW9uJywgZ2VvcG9zaXRpb24pO1xuICAgIHRoaXMuc2VuZCgnZ2VvcG9zaXRpb24nLCBnZW9wb3NpdGlvblRvSnNvbihnZW9wb3NpdGlvbikpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF91cGRhdGVDbGllbnQoZ2VvcG9zaXRpb24pIHtcbiAgICBjb25zdCBjb29yZHMgPSBnZW9wb3NpdGlvbi5jb29yZHM7XG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gW2Nvb3Jkcy5sYXRpdHVkZSwgY29vcmRzLmxvbmdpdHVkZV07XG4gICAgY2xpZW50Lmdlb3Bvc2l0aW9uID0gZ2VvcG9zaXRpb247XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uRXJyb3IoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnIuc3RhY2spO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIEdlb2xvY2F0aW9uKTtcblxuZXhwb3J0IGRlZmF1bHQgR2VvbG9jYXRpb247XG4iXX0=