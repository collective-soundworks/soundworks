'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _helpers = require('../../utils/helpers');

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:metric-scheduler';

/**
 * Interface for the server `'metric-scheduler'` service.
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.metricScheduler = this.require('metric-scheduler');
 */

var MetricScheduler = function (_Service) {
  (0, _inherits3.default)(MetricScheduler, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function MetricScheduler() {
    (0, _classCallCheck3.default)(this, MetricScheduler);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MetricScheduler.__proto__ || (0, _getPrototypeOf2.default)(MetricScheduler)).call(this, SERVICE_ID));

    _this._syncTime = 0;
    _this._metricPosition = 0;
    _this._tempo = 60; // tempo in beats per minute (BPM)
    _this._tempoUnit = 0.25; // tempo unit expressed in fractions of a whole note

    _this._nextSyncEvent = null;
    _this._nextSyncTime = Infinity;

    _this._syncScheduler = _this.require('sync-scheduler');

    _this._onRequest = _this._onRequest.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(MetricScheduler, [{
    key: 'configure',
    value: function configure(options) {
      if (options.tempo !== undefined) this._tempo = options.tempo;

      if (options.tempoUnit !== undefined) this._tempoUnit = options.tempoUnit;

      (0, _get3.default)(MetricScheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(MetricScheduler.prototype), 'configure', this).call(this, options);
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)(MetricScheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(MetricScheduler.prototype), 'start', this).call(this);

      this.ready();
    }

    /** @private */

  }, {
    key: '_resetSync',
    value: function _resetSync() {
      this._nextSyncEvent = null;
      this._nextSyncTime = Infinity;
    }

    /** @private */

  }, {
    key: '_setSync',
    value: function _setSync(syncTime, metricPosition, tempo, tempoUnit, event) {
      this._resetSync();

      if (syncTime <= this.syncTime) {
        this._syncTime = syncTime;
        this._metricPosition = metricPosition;
        this._tempo = tempo;
        this._tempoUnit = tempoUnit;
        this._metricSpeed = tempo * tempoUnit / 60;
      } else {
        this._nextSyncEvent = { syncTime: syncTime, metricPosition: metricPosition, tempo: tempo, tempoUnit: tempoUnit, event: event };
        this._nextSyncTime = syncTime;
      }

      this.broadcast(null, null, 'sync', syncTime, metricPosition, tempo, tempoUnit, event);
    }

    /** @private */

  }, {
    key: '_updateSync',
    value: function _updateSync() {
      if (this.syncTime >= this._nextSyncTime) {
        var _nextSyncEvent = this._nextSyncEvent,
            syncTime = _nextSyncEvent.syncTime,
            metricPosition = _nextSyncEvent.metricPosition,
            tempo = _nextSyncEvent.tempo,
            tempoUnit = _nextSyncEvent.tempoUnit;

        this._syncTime = syncTime;
        this._metricPosition = metricPosition;
        this._tempo = tempo;
        this._tempoUnit = tempoUnit;
        this._metricSpeed = tempo * tempoUnit / 60;
        this._nextSyncTime = Infinity;
      }
    }

    /** @private */

  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this2 = this;

      return function () {
        _this2._updateSync();
        _this2.send(client, 'init', _this2._syncTime, _this2._metricPosition, _this2._tempo, _this2._tempoUnit);

        if (_this2._nextSyncTime < Infinity) {
          var _nextSyncEvent2 = _this2._nextSyncEvent,
              syncTime = _nextSyncEvent2.syncTime,
              metricPosition = _nextSyncEvent2.metricPosition,
              tempo = _nextSyncEvent2.tempo,
              tempoUnit = _nextSyncEvent2.tempoUnit,
              event = _nextSyncEvent2.event;

          _this2.send(client, 'sync', syncTime, metricPosition, tempo, tempoUnit, event);
        }
      };
    }
  }, {
    key: 'sync',
    value: function sync(syncTime, metricPosition, tempo, tempoUnit) {
      var event = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

      this._setSync(syncTime, metricPosition, tempo, tempoUnit, event);
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.broadcast(null, null, 'clear');
    }
  }, {
    key: 'getMetricPositionAtSyncTime',


    /**
     * Get metric position corrsponding to a given sync time (regarding the current tempo).
     * @param  {Number} time - time
     * @return {Number} - metric position
     */
    value: function getMetricPositionAtSyncTime(syncTime) {
      this._updateSync();

      if (this._tempo > 0) return this._metricPosition + (syncTime - this._syncTime) * this._metricSpeed;

      return this._metricPosition;
    }

    /**
     * Get sync time corrsponding to a given metric position (regarding the current tempo).
     * @param  {Number} position - metric position
     * @return {Number} - time
     */

  }, {
    key: 'getSyncTimeAtMetricPosition',
    value: function getSyncTimeAtMetricPosition(metricPosition) {
      this._updateSync();

      var metricSpeed = this._metricSpeed;

      if (metricPosition < Infinity && metricSpeed > 0) return this._syncTime + (metricPosition - this._metricPosition) / metricSpeed;

      return Infinity;
    }

    /** @private */

  }, {
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)(MetricScheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(MetricScheduler.prototype), 'connect', this).call(this, client);
      this.receive(client, 'request', this._onRequest(client));
    }

    /** @private */

  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      (0, _get3.default)(MetricScheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(MetricScheduler.prototype), 'disconnect', this).call(this, client);
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return this._syncScheduler.currentTime;
    }
  }, {
    key: 'syncTime',
    get: function get() {
      return this._syncScheduler.currentTime;
    }
  }, {
    key: 'metricPosition',
    get: function get() {
      this._updateSync();

      if (this._tempo > 0) return this._metricPosition + (this.syncTime - this._syncTime) * this._metricSpeed;

      return this._metricPosition;
    }
  }, {
    key: 'currentPosition',
    get: function get() {
      return this.metricPosition;
    }

    /**
     * Current tempo.
     * @return {Number} - Tempo in BPM.
     */

  }, {
    key: 'tempo',
    get: function get() {
      this._updateSync();
      return this._tempo;
    }

    /**
     * Current tempo unit.
     * @return {Number} - Tempo unit in respect to whole note.
     */

  }, {
    key: 'tempoUnit',
    get: function get() {
      this._updateSync();
      return this._tempoUnit;
    }
  }]);
  return MetricScheduler;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, MetricScheduler);

exports.default = MetricScheduler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1ldHJpY1NjaGVkdWxlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwiTWV0cmljU2NoZWR1bGVyIiwiX3N5bmNUaW1lIiwiX21ldHJpY1Bvc2l0aW9uIiwiX3RlbXBvIiwiX3RlbXBvVW5pdCIsIl9uZXh0U3luY0V2ZW50IiwiX25leHRTeW5jVGltZSIsIkluZmluaXR5IiwiX3N5bmNTY2hlZHVsZXIiLCJyZXF1aXJlIiwiX29uUmVxdWVzdCIsImJpbmQiLCJvcHRpb25zIiwidGVtcG8iLCJ1bmRlZmluZWQiLCJ0ZW1wb1VuaXQiLCJyZWFkeSIsInN5bmNUaW1lIiwibWV0cmljUG9zaXRpb24iLCJldmVudCIsIl9yZXNldFN5bmMiLCJfbWV0cmljU3BlZWQiLCJicm9hZGNhc3QiLCJjbGllbnQiLCJfdXBkYXRlU3luYyIsInNlbmQiLCJfc2V0U3luYyIsIm1ldHJpY1NwZWVkIiwicmVjZWl2ZSIsImN1cnJlbnRUaW1lIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsMEJBQW5COztBQUVBOzs7Ozs7Ozs7SUFRTUMsZTs7O0FBQ0o7QUFDQSw2QkFBYztBQUFBOztBQUFBLHdKQUNORCxVQURNOztBQUdaLFVBQUtFLFNBQUwsR0FBaUIsQ0FBakI7QUFDQSxVQUFLQyxlQUFMLEdBQXVCLENBQXZCO0FBQ0EsVUFBS0MsTUFBTCxHQUFjLEVBQWQsQ0FMWSxDQUtNO0FBQ2xCLFVBQUtDLFVBQUwsR0FBa0IsSUFBbEIsQ0FOWSxDQU1ZOztBQUV4QixVQUFLQyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsVUFBS0MsYUFBTCxHQUFxQkMsUUFBckI7O0FBRUEsVUFBS0MsY0FBTCxHQUFzQixNQUFLQyxPQUFMLENBQWEsZ0JBQWIsQ0FBdEI7O0FBRUEsVUFBS0MsVUFBTCxHQUFrQixNQUFLQSxVQUFMLENBQWdCQyxJQUFoQixPQUFsQjtBQWJZO0FB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YyxDQUFsQixFQUNFLE9BQU8sS0FBS0QsZUFBTCxHQUF1QixDQUFDLEtBQUtlLFFBQUwsR0FBZ0IsS0FBS2hCLFNBQXRCLElBQW1DLEtBQUtvQixZQUF0RTs7QUFFRixhQUFPLEtBQUtuQixlQUFaO0FBQ0Q7Ozt3QkFFcUI7QUFDcEIsYUFBTyxLQUFLZ0IsY0FBWjtBQUNEOztBQUVEOzs7Ozs7O3dCQUlZO0FBQ1YsV0FBS00sV0FBTDtBQUNBLGFBQU8sS0FBS3JCLE1BQVo7QUFDRDs7QUFFRDs7Ozs7Ozt3QkFJZ0I7QUFDZCxXQUFLcUIsV0FBTDtBQUNBLGFBQU8sS0FBS3BCLFVBQVo7QUFDRDs7Ozs7QUE0Q0gseUJBQWUwQixRQUFmLENBQXdCL0IsVUFBeEIsRUFBb0NDLGVBQXBDOztrQkFFZUEsZSIsImZpbGUiOiJNZXRyaWNTY2hlZHVsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHsgZ2V0T3B0IH0gZnJvbSAnLi4vLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTptZXRyaWMtc2NoZWR1bGVyJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdtZXRyaWMtc2NoZWR1bGVyJ2Agc2VydmljZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLm1ldHJpY1NjaGVkdWxlciA9IHRoaXMucmVxdWlyZSgnbWV0cmljLXNjaGVkdWxlcicpO1xuICovXG5jbGFzcyBNZXRyaWNTY2hlZHVsZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIHRoaXMuX3N5bmNUaW1lID0gMDtcbiAgICB0aGlzLl9tZXRyaWNQb3NpdGlvbiA9IDA7XG4gICAgdGhpcy5fdGVtcG8gPSA2MDsgLy8gdGVtcG8gaW4gYmVhdHMgcGVyIG1pbnV0ZSAoQlBNKVxuICAgIHRoaXMuX3RlbXBvVW5pdCA9IDAuMjU7IC8vIHRlbXBvIHVuaXQgZXhwcmVzc2VkIGluIGZyYWN0aW9ucyBvZiBhIHdob2xlIG5vdGVcblxuICAgIHRoaXMuX25leHRTeW5jRXZlbnQgPSBudWxsO1xuICAgIHRoaXMuX25leHRTeW5jVGltZSA9IEluZmluaXR5O1xuXG4gICAgdGhpcy5fc3luY1NjaGVkdWxlciA9IHRoaXMucmVxdWlyZSgnc3luYy1zY2hlZHVsZXInKTtcblxuICAgIHRoaXMuX29uUmVxdWVzdCA9IHRoaXMuX29uUmVxdWVzdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMudGVtcG8gIT09IHVuZGVmaW5lZClcbiAgICAgIHRoaXMuX3RlbXBvID0gb3B0aW9ucy50ZW1wbztcblxuICAgIGlmIChvcHRpb25zLnRlbXBvVW5pdCAhPT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy5fdGVtcG9Vbml0ID0gb3B0aW9ucy50ZW1wb1VuaXQ7XG5cbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfcmVzZXRTeW5jKCkge1xuICAgIHRoaXMuX25leHRTeW5jRXZlbnQgPSBudWxsO1xuICAgIHRoaXMuX25leHRTeW5jVGltZSA9IEluZmluaXR5O1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9zZXRTeW5jKHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgdGVtcG8sIHRlbXBvVW5pdCwgZXZlbnQpIHtcbiAgICB0aGlzLl9yZXNldFN5bmMoKTtcblxuICAgIGlmIChzeW5jVGltZSA8PSB0aGlzLnN5bmNUaW1lKSB7XG4gICAgICB0aGlzLl9zeW5jVGltZSA9IHN5bmNUaW1lO1xuICAgICAgdGhpcy5fbWV0cmljUG9zaXRpb24gPSBtZXRyaWNQb3NpdGlvbjtcbiAgICAgIHRoaXMuX3RlbXBvID0gdGVtcG87XG4gICAgICB0aGlzLl90ZW1wb1VuaXQgPSB0ZW1wb1VuaXQ7XG4gICAgICB0aGlzLl9tZXRyaWNTcGVlZCA9IHRlbXBvICogdGVtcG9Vbml0IC8gNjA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX25leHRTeW5jRXZlbnQgPSB7IHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgdGVtcG8sIHRlbXBvVW5pdCwgZXZlbnQgfTtcbiAgICAgIHRoaXMuX25leHRTeW5jVGltZSA9IHN5bmNUaW1lO1xuICAgIH1cblxuICAgIHRoaXMuYnJvYWRjYXN0KG51bGwsIG51bGwsICdzeW5jJywgc3luY1RpbWUsIG1ldHJpY1Bvc2l0aW9uLCB0ZW1wbywgdGVtcG9Vbml0LCBldmVudCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX3VwZGF0ZVN5bmMoKSB7XG4gICAgaWYgKHRoaXMuc3luY1RpbWUgPj0gdGhpcy5fbmV4dFN5bmNUaW1lKSB7XG4gICAgICBjb25zdCB7IHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgdGVtcG8sIHRlbXBvVW5pdCB9ID0gdGhpcy5fbmV4dFN5bmNFdmVudDtcbiAgICAgIHRoaXMuX3N5bmNUaW1lID0gc3luY1RpbWU7XG4gICAgICB0aGlzLl9tZXRyaWNQb3NpdGlvbiA9IG1ldHJpY1Bvc2l0aW9uO1xuICAgICAgdGhpcy5fdGVtcG8gPSB0ZW1wbztcbiAgICAgIHRoaXMuX3RlbXBvVW5pdCA9IHRlbXBvVW5pdDtcbiAgICAgIHRoaXMuX21ldHJpY1NwZWVkID0gdGVtcG8gKiB0ZW1wb1VuaXQgLyA2MDtcbiAgICAgIHRoaXMuX25leHRTeW5jVGltZSA9IEluZmluaXR5O1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLl91cGRhdGVTeW5jKCk7XG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCAnaW5pdCcsIHRoaXMuX3N5bmNUaW1lLCB0aGlzLl9tZXRyaWNQb3NpdGlvbiwgdGhpcy5fdGVtcG8sIHRoaXMuX3RlbXBvVW5pdCk7XG5cbiAgICAgIGlmICh0aGlzLl9uZXh0U3luY1RpbWUgPCBJbmZpbml0eSkge1xuICAgICAgICBjb25zdCB7IHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgdGVtcG8sIHRlbXBvVW5pdCwgZXZlbnQgfSA9IHRoaXMuX25leHRTeW5jRXZlbnQ7XG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdzeW5jJywgc3luY1RpbWUsIG1ldHJpY1Bvc2l0aW9uLCB0ZW1wbywgdGVtcG9Vbml0LCBldmVudCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHN5bmMoc3luY1RpbWUsIG1ldHJpY1Bvc2l0aW9uLCB0ZW1wbywgdGVtcG9Vbml0LCBldmVudCA9IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX3NldFN5bmMoc3luY1RpbWUsIG1ldHJpY1Bvc2l0aW9uLCB0ZW1wbywgdGVtcG9Vbml0LCBldmVudCk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLmJyb2FkY2FzdChudWxsLCBudWxsLCAnY2xlYXInKTtcbiAgfVxuXG4gIGdldCBjdXJyZW50VGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luY1NjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgfVxuXG4gIGdldCBzeW5jVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luY1NjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgfVxuXG4gIGdldCBtZXRyaWNQb3NpdGlvbigpIHtcbiAgICB0aGlzLl91cGRhdGVTeW5jKCk7XG5cbiAgICBpZiAodGhpcy5fdGVtcG8gPiAwKVxuICAgICAgcmV0dXJuIHRoaXMuX21ldHJpY1Bvc2l0aW9uICsgKHRoaXMuc3luY1RpbWUgLSB0aGlzLl9zeW5jVGltZSkgKiB0aGlzLl9tZXRyaWNTcGVlZDtcblxuICAgIHJldHVybiB0aGlzLl9tZXRyaWNQb3NpdGlvbjtcbiAgfVxuXG4gIGdldCBjdXJyZW50UG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljUG9zaXRpb247XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudCB0ZW1wby5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIFRlbXBvIGluIEJQTS5cbiAgICovXG4gIGdldCB0ZW1wbygpIHtcbiAgICB0aGlzLl91cGRhdGVTeW5jKCk7XG4gICAgcmV0dXJuIHRoaXMuX3RlbXBvO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgdGVtcG8gdW5pdC5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIFRlbXBvIHVuaXQgaW4gcmVzcGVjdCB0byB3aG9sZSBub3RlLlxuICAgKi9cbiAgZ2V0IHRlbXBvVW5pdCgpIHtcbiAgICB0aGlzLl91cGRhdGVTeW5jKCk7XG4gICAgcmV0dXJuIHRoaXMuX3RlbXBvVW5pdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgbWV0cmljIHBvc2l0aW9uIGNvcnJzcG9uZGluZyB0byBhIGdpdmVuIHN5bmMgdGltZSAocmVnYXJkaW5nIHRoZSBjdXJyZW50IHRlbXBvKS5cbiAgICogQHBhcmFtICB7TnVtYmVyfSB0aW1lIC0gdGltZVxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gbWV0cmljIHBvc2l0aW9uXG4gICAqL1xuICBnZXRNZXRyaWNQb3NpdGlvbkF0U3luY1RpbWUoc3luY1RpbWUpIHtcbiAgICB0aGlzLl91cGRhdGVTeW5jKCk7XG5cbiAgICBpZiAodGhpcy5fdGVtcG8gPiAwKVxuICAgICAgcmV0dXJuIHRoaXMuX21ldHJpY1Bvc2l0aW9uICsgKHN5bmNUaW1lIC0gdGhpcy5fc3luY1RpbWUpICogdGhpcy5fbWV0cmljU3BlZWQ7XG5cbiAgICByZXR1cm4gdGhpcy5fbWV0cmljUG9zaXRpb247XG4gIH1cblxuICAvKipcbiAgICogR2V0IHN5bmMgdGltZSBjb3Jyc3BvbmRpbmcgdG8gYSBnaXZlbiBtZXRyaWMgcG9zaXRpb24gKHJlZ2FyZGluZyB0aGUgY3VycmVudCB0ZW1wbykuXG4gICAqIEBwYXJhbSAge051bWJlcn0gcG9zaXRpb24gLSBtZXRyaWMgcG9zaXRpb25cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIHRpbWVcbiAgICovXG4gIGdldFN5bmNUaW1lQXRNZXRyaWNQb3NpdGlvbihtZXRyaWNQb3NpdGlvbikge1xuICAgIHRoaXMuX3VwZGF0ZVN5bmMoKTtcblxuICAgIGNvbnN0IG1ldHJpY1NwZWVkID0gdGhpcy5fbWV0cmljU3BlZWQ7XG5cbiAgICBpZiAobWV0cmljUG9zaXRpb24gPCBJbmZpbml0eSAmJiBtZXRyaWNTcGVlZCA+IDApXG4gICAgICByZXR1cm4gdGhpcy5fc3luY1RpbWUgKyAobWV0cmljUG9zaXRpb24gLSB0aGlzLl9tZXRyaWNQb3NpdGlvbikgLyBtZXRyaWNTcGVlZDtcblxuICAgIHJldHVybiBJbmZpbml0eTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBNZXRyaWNTY2hlZHVsZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBNZXRyaWNTY2hlZHVsZXI7XG4iXX0=