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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdlb2xvY2F0aW9uLmpzIl0sIm5hbWVzIjpbIlNFUlZJQ0VfSUQiLCJnZW9sb2NhdGlvbiIsIm5hdmlnYXRvciIsImdlb3Bvc2l0aW9uVG9Kc29uIiwiZ2VvcG9zaXRpb24iLCJ0aW1lc3RhbXAiLCJjb29yZHMiLCJhY2N1cmFjeSIsImFsdGl0dWRlIiwiYWx0aXR1ZGVBY2N1cmFjeSIsImhlYWRpbmciLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsInNwZWVkIiwiZ2V0UmFuZG9tR2VvcG9zaXRpb24iLCJEYXRlIiwiZ2V0VGltZSIsIk1hdGgiLCJyYW5kb20iLCJ1cGRhdGVSYW5kb21HZW9wb3NpdGlvbiIsIkdlb2xvY2F0aW9uIiwiZGVmYXVsdHMiLCJzdGF0ZSIsImVuYWJsZUhpZ2hBY2N1cmFjeSIsInBsYXRmb3JtIiwicmVxdWlyZSIsIl9vblN1Y2Nlc3MiLCJiaW5kIiwiX29uRXJyb3IiLCJfd2F0Y2hJZCIsIm9wdGlvbnMiLCJfb3B0aW9ucyIsImZlYXR1cmUiLCJieXBhc3MiLCJ1bmRlZmluZWQiLCJyZXF1aXJlRmVhdHVyZSIsIl91cGRhdGVDbGllbnQiLCJlbWl0IiwiY2xpZW50Iiwic2VuZCIsInJlYWR5Iiwic2V0U3RhdGUiLCJfc3RhcnRXYXRjaCIsIl9zdG9wV2F0Y2giLCJkZWJ1ZyIsIndhdGNoUG9zaXRpb24iLCJzZXRJbnRlcnZhbCIsImNsZWFyV2F0Y2giLCJjbGVhckludGVydmFsIiwiY29vcmRpbmF0ZXMiLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJzdGFjayIsIlNlcnZpY2UiLCJzZXJ2aWNlTWFuYWdlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQSxJQUFNQSxhQUFhLHFCQUFuQjtBQUNBLElBQU1DLGNBQWNDLFVBQVVELFdBQTlCOztBQUVBLFNBQVNFLGlCQUFULENBQTJCQyxXQUEzQixFQUF3QztBQUN0QyxT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QWE7QUFDekIsVUFBTUUsU0FBU0YsWUFBWUUsTUFBM0I7QUFDQWdDLHVCQUFPVyxXQUFQLEdBQXFCLENBQUMzQyxPQUFPSyxRQUFSLEVBQWtCTCxPQUFPTSxTQUF6QixDQUFyQjtBQUNBMEIsdUJBQU9sQyxXQUFQLEdBQXFCQSxXQUFyQjtBQUNEOztBQUVEOzs7OzZCQUNTOEMsRyxFQUFLO0FBQ1pDLGNBQVFDLEtBQVIsQ0FBY0YsSUFBSUcsS0FBbEI7QUFDRDs7O0VBL0d1QkMsaUI7O0FBa0gxQkMseUJBQWVDLFFBQWYsQ0FBd0J4RCxVQUF4QixFQUFvQ29CLFdBQXBDOztrQkFFZUEsVyIsImZpbGUiOiJHZW9sb2NhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6Z2VvbG9jYXRpb24nO1xuY29uc3QgZ2VvbG9jYXRpb24gPSBuYXZpZ2F0b3IuZ2VvbG9jYXRpb247XG5cbmZ1bmN0aW9uIGdlb3Bvc2l0aW9uVG9Kc29uKGdlb3Bvc2l0aW9uKSB7XG4gIHJldHVybiB7XG4gICAgdGltZXN0YW1wOiBnZW9wb3NpdGlvbi50aW1lc3RhbXAsXG4gICAgY29vcmRzOiB7XG4gICAgICBhY2N1cmFjeTogZ2VvcG9zaXRpb24uY29vcmRzLmFjY3VyYWN5LFxuICAgICAgYWx0aXR1ZGU6IGdlb3Bvc2l0aW9uLmNvb3Jkcy5hbHRpdHVkZSxcbiAgICAgIGFsdGl0dWRlQWNjdXJhY3k6IGdlb3Bvc2l0aW9uLmNvb3Jkcy5hbHRpdHVkZUFjY3VyYWN5LFxuICAgICAgaGVhZGluZzogZ2VvcG9zaXRpb24uY29vcmRzLmhlYWRpbmcsXG4gICAgICBsYXRpdHVkZTogZ2VvcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLFxuICAgICAgbG9uZ2l0dWRlOiBnZW9wb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgc3BlZWQ6IGdlb3Bvc2l0aW9uLmNvb3Jkcy5zcGVlZFxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRSYW5kb21HZW9wb3NpdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgIGNvb3Jkczoge1xuICAgICAgYWNjdXJhY3k6IDEwLFxuICAgICAgYWx0aXR1ZGU6IDEwLFxuICAgICAgYWx0aXR1ZGVBY2N1cmFjeTogMTAsXG4gICAgICBoZWFkaW5nOiAwLFxuICAgICAgbGF0aXR1ZGU6IE1hdGgucmFuZG9tKCkgKiAxODAgLSA5MCxcbiAgICAgIGxvbmdpdHVkZTogTWF0aC5yYW5kb20oKSAqIDM2MCAtIDE4MCxcbiAgICAgIHNwZWVkOiAxLFxuICAgIH1cbiAgfTtcbn1cblxuLy8gdGhpcyBpcyBxdWl0ZSBhIGxhcmdlIHVwZGF0ZS4uLlxuZnVuY3Rpb24gdXBkYXRlUmFuZG9tR2VvcG9zaXRpb24oZ2VvcG9zaXRpb24pIHtcbiAgZ2VvcG9zaXRpb24udGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIGdlb3Bvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSArPSAoTWF0aC5yYW5kb20oKSAqIDFlLTQpIC0gKDFlLTQgLyAyKTtcbiAgZ2VvcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSArPSAoTWF0aC5yYW5kb20oKSAqIDFlLTQpIC0gKDFlLTQgLyAyKTtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdnZW9sb2NhdGlvbidgIHNlcnZpY2UuXG4gKlxuICogVGhlIGAnZ2VvbG9jYXRpb24nYCBzZXJ2aWNlIGFsbG93cyB0byByZXRyaWV2ZSB0aGUgbGF0aXR1ZGUgYW5kIGxvbmdpdHVkZVxuICogb2YgdGhlIGNsaWVudCB1c2luZyBgZ3BzYC4gVGhlIGN1cnJlbnQgdmFsdWVzIGFyZSBzdG9yZSBpbnRvIHRoZVxuICogYGNsaWVudC5jb29yZGluYXRlc2AgbWVtYmVyLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5HZW9sb2NhdGlvbn0qX19cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgb3B0aW9ucy5cbiAqIEBwYXJhbSB7J3N0YXJ0J3wnc3RvcCd9IFtvcHRpb25zLnN0YXRlPSdzdGFydCddIC0gRGVmYXVsdCBzdGF0ZSB3aGVuIHRoZVxuICogIHNlcnZpY2UgaXMgbGF1bmNoZWQuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmVuYWJsZUhpZ2hBY2N1cmFjeT10cnVlXSAtIERlZmluZSBpZiB0aGUgYXBwbGljYXRpb25cbiAqICB3b3VsZCBsaWtlIHRvIHJlY2VpdmUgdGhlIGJlc3QgcG9zc2libGUgcmVzdWx0cyAoY2YuIFtodHRwczovL2Rldi53My5vcmcvZ2VvL2FwaS9zcGVjLXNvdXJjZS5odG1sI2hpZ2gtYWNjdXJhY3ldKGh0dHBzOi8vZGV2LnczLm9yZy9nZW8vYXBpL3NwZWMtc291cmNlLmh0bWwjaGlnaC1hY2N1cmFjeSkpLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqL1xuY2xhc3MgR2VvbG9jYXRpb24gZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgc3RhdGU6ICdzdGFydCcsXG4gICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWUsXG4gICAgICAvLyBieXBhc3M6IGZhbHNlLFxuICAgIH07XG5cbiAgICB0aGlzLnBsYXRmb3JtID0gdGhpcy5yZXF1aXJlKCdwbGF0Zm9ybScpO1xuXG4gICAgdGhpcy5fb25TdWNjZXNzID0gdGhpcy5fb25TdWNjZXNzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25FcnJvciA9IHRoaXMuX29uRXJyb3IuYmluZCh0aGlzKTtcbiAgICB0aGlzLl93YXRjaElkID0gbnVsbDtcbiAgICB0aGlzLnN0YXRlID0gbnVsbDtcbiAgfVxuXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgY29uc3QgX29wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIGlmICghdGhpcy5vcHRpb25zLmZlYXR1cmUpIHtcbiAgICAgIGxldCBmZWF0dXJlID0gJ2dlb2xvY2F0aW9uJztcblxuICAgICAgaWYgKG9wdGlvbnMuYnlwYXNzICE9PSB1bmRlZmluZWQgJiYgb3B0aW9ucy5ieXBhc3MgPT09IHRydWUpXG4gICAgICAgIGZlYXR1cmUgPSAnZ2VvbG9jYXRpb24tbW9jayc7XG5cbiAgICAgIHRoaXMub3B0aW9ucy5mZWF0dXJlID0gZmVhdHVyZTtcbiAgICAgIHRoaXMucGxhdGZvcm0ucmVxdWlyZUZlYXR1cmUoZmVhdHVyZSk7XG4gICAgfVxuXG4gICAgc3VwZXIuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmZlYXR1cmUgPT09ICdnZW9sb2NhdGlvbi1tb2NrJykge1xuICAgICAgY29uc3QgZ2VvcG9zaXRpb24gPSBnZXRSYW5kb21HZW9wb3NpdGlvbigpO1xuICAgICAgdGhpcy5fdXBkYXRlQ2xpZW50KGdlb3Bvc2l0aW9uKTtcbiAgICB9XG5cbiAgICAvLyBvbmx5IHN5bmMgdmFsdWVzIHJldHJpZXZlZCBmcm9tIGBwbGF0Zm9ybWAgd2l0aCBzZXJ2ZXIgYmVmb3JlIGdldHRpbmcgcmVhZHlcbiAgICB0aGlzLmVtaXQoJ2dlb3Bvc2l0aW9uJywgY2xpZW50Lmdlb3Bvc2l0aW9uKTtcbiAgICB0aGlzLnNlbmQoJ2dlb3Bvc2l0aW9uJywgZ2VvcG9zaXRpb25Ub0pzb24oY2xpZW50Lmdlb3Bvc2l0aW9uKSk7XG4gICAgdGhpcy5yZWFkeSgpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLm9wdGlvbnMuc3RhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgc3RhdGUgb2YgdGhlIHNlcnZpY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7J3N0YXJ0J3wnc3RvcCd9IFN0cmluZyAtIE5ldyBzdGF0ZSBvZiB0aGUgc2VydmljZS5cbiAgICovXG4gIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUgIT09IHN0YXRlKSB7XG4gICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG5cbiAgICAgIGlmICh0aGlzLnN0YXRlID09PSAnc3RhcnQnKVxuICAgICAgICB0aGlzLl9zdGFydFdhdGNoKCk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuX3N0b3BXYXRjaCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN1bWUgdGhlIHJlZnJlc2ggb2YgdGhlIHBvc2l0aW9uLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3N0YXJ0V2F0Y2goKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZyA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuX3dhdGNoSWQgPSBnZW9sb2NhdGlvbi53YXRjaFBvc2l0aW9uKHRoaXMuX29uU3VjY2VzcywgdGhpcy5fb25FcnJvciwgdGhpcy5vcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fd2F0Y2hJZCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgdXBkYXRlUmFuZG9tR2VvcG9zaXRpb24oY2xpZW50Lmdlb3Bvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5fb25TdWNjZXNzKGNsaWVudC5nZW9wb3NpdGlvbik7XG4gICAgICB9LCAzMDAwKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUGF1c2UgdGhlIHJlZnJlc2ggb2YgdGhlIHBvc2l0aW9uLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3N0b3BXYXRjaCgpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnID09PSBmYWxzZSlcbiAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5jbGVhcldhdGNoKHRoaXMuX3dhdGNoSWQpO1xuICAgIGVsc2VcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fd2F0Y2hJZCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uU3VjY2VzcyhnZW9wb3NpdGlvbikge1xuICAgIHRoaXMuX3VwZGF0ZUNsaWVudChnZW9wb3NpdGlvbik7XG4gICAgdGhpcy5lbWl0KCdnZW9wb3NpdGlvbicsIGdlb3Bvc2l0aW9uKTtcbiAgICB0aGlzLnNlbmQoJ2dlb3Bvc2l0aW9uJywgZ2VvcG9zaXRpb25Ub0pzb24oZ2VvcG9zaXRpb24pKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfdXBkYXRlQ2xpZW50KGdlb3Bvc2l0aW9uKSB7XG4gICAgY29uc3QgY29vcmRzID0gZ2VvcG9zaXRpb24uY29vcmRzO1xuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IFtjb29yZHMubGF0aXR1ZGUsIGNvb3Jkcy5sb25naXR1ZGVdO1xuICAgIGNsaWVudC5nZW9wb3NpdGlvbiA9IGdlb3Bvc2l0aW9uO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkVycm9yKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBHZW9sb2NhdGlvbik7XG5cbmV4cG9ydCBkZWZhdWx0IEdlb2xvY2F0aW9uO1xuIl19