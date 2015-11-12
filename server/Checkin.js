'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Number$MAX_SAFE_INTEGER = require('babel-runtime/core-js/number/max-safe-integer')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

var maxRandomClients = 9999;

/**
 * The {@link Checkin} takes care of the check-in on the server side.
 */

var Checkin = (function (_Module) {
  _inherits(Checkin, _Module);

  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='checkin'] Name of the module.
   * @param {Object} [options.setup] Setup used in the scenario, if any (cf. {@link ServerSetup}).
   * @param {Object} [options.maxClients=Infinity] maximum number of clients supported by the scenario through this checkin module (if a `options.setup` is provided, the maximum number of clients the number of predefined positions of that `setup`).
   * @param {Object} [options.order='ascending'] Order in which indices are assigned. Currently spported values are:
   * - `'ascending'`: indices are assigned in ascending order;
   * - `'random'`: indices are assigned in random order.
   */

  function Checkin() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Checkin);

    _get(Object.getPrototypeOf(Checkin.prototype), 'constructor', this).call(this, options.name || 'checkin');

    this.setup = options.setup || null;
    this.maxClients = options.maxClients || Infinity;
    this.order = options.order || 'ascending'; // 'ascending' | 'random'

    if (this.maxClients > _Number$MAX_SAFE_INTEGER) this.maxClients = _Number$MAX_SAFE_INTEGER;

    if (this.setup) {
      var numPlaces = this.setup.getNumPositions();

      if (this.maxClients > numPlaces && numPlaces > 0) this.maxClients = numPlaces;
    }

    this._availableIndices = [];
    this._nextAscendingIndex = 0;

    if (this.maxClients > maxRandomClients) this.order = 'ascending';else if (this.order === 'random') {
      this._nextAscendingIndex = this.maxClients;

      for (var i = 0; i < this.maxClients; i++) {
        this._availableIndices.push(i);
      }
    }
  }

  _createClass(Checkin, [{
    key: '_getRandomIndex',
    value: function _getRandomIndex() {
      var numAvailable = this._availableIndices.length;

      if (numAvailable > 0) {
        var random = Math.floor(Math.random() * numAvailable);
        return this._availableIndices.splice(random, 1)[0];
      }

      return -1;
    }
  }, {
    key: '_getAscendingIndex',
    value: function _getAscendingIndex() {
      if (this._availableIndices.length > 0) {
        this._availableIndices.sort(function (a, b) {
          return a - b;
        });

        return this._availableIndices.splice(0, 1)[0];
      } else if (this._nextAscendingIndex < this.maxClients) {
        return this._nextAscendingIndex++;
      }

      return -1;
    }
  }, {
    key: '_releaseIndex',
    value: function _releaseIndex(index) {
      this._availableIndices.push(index);
    }

    /**
     * @private
     */
  }, {
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(Checkin.prototype), 'connect', this).call(this, client);

      client.receive(this.name + ':request', function () {
        var index = -1;
        var order = _this.order;

        if (_this.order === 'random') index = _this._getRandomIndex();else // if (order === 'acsending')
          index = _this._getAscendingIndex();

        if (index >= 0) {
          client.modules[_this.name].index = index;

          var label = null;
          var coordinates = null;

          if (_this.setup) {
            label = _this.setup.getLabel(index);
            coordinates = _this.setup.getCoordinates(index);
          }

          client.modules[_this.name].label = label;
          client.coordinates = coordinates;

          client.send(_this.name + ':acknowledge', index, label, coordinates);
        } else {
          client.send(_this.name + ':unavailable');
        }
      });

      client.receive(this.name + ':restart', function (index, label, coordinates) {
        // TODO: check if that's ok on random mode
        if (index > _this._nextAscendingIndex) {
          for (var i = _this._nextAscendingIndex; i < index; i++) {
            _this._availableIndices.push(i);
          }_this._nextAscendingIndex = index + 1;
        } else if (index === _this._nextAscendingIndex) {
          _this._nextAscendingIndex++;
        } else {
          var i = _this._availableIndices.indexOf(index);

          if (i > -1) _this._availableIndices.splice(i, 1);
        }

        client.modules[_this.name].index = index;

        if (_this.setup) {
          client.modules[_this.name].label = label;
          client.coordinates = coordinates;
        }
      });
    }

    /**
     * @private
     */
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      _get(Object.getPrototypeOf(Checkin.prototype), 'disconnect', this).call(this, client);

      var index = client.modules[this.name].index;

      if (index >= 0) this._releaseIndex(index);
    }
  }]);

  return Checkin;
})(_Module3['default']);

exports['default'] = Checkin;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvQ2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBQW1CLFVBQVU7Ozs7QUFFN0IsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7Ozs7OztJQU1ULE9BQU87WUFBUCxPQUFPOzs7Ozs7Ozs7Ozs7O0FBV2YsV0FYUSxPQUFPLEdBV0E7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVhMLE9BQU87O0FBWXhCLCtCQVppQixPQUFPLDZDQVlsQixPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRTs7QUFFakMsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztBQUNuQyxRQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksUUFBUSxDQUFDO0FBQ2pELFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxXQUFXLENBQUM7O0FBRTFDLFFBQUksSUFBSSxDQUFDLFVBQVUsMkJBQTBCLEVBQzNDLElBQUksQ0FBQyxVQUFVLDJCQUEwQixDQUFDOztBQUU1QyxRQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDZCxVQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUU3QyxVQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQzlDLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0tBQy9COztBQUVELFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFDNUIsUUFBSSxDQUFDLG1CQUFtQixHQUFHLENBQUMsQ0FBQzs7QUFFN0IsUUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLGdCQUFnQixFQUNwQyxJQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUN0QixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssUUFBUSxFQUFFO0FB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LFVBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQzs7QUFFNUMsVUFBSSxLQUFLLElBQUksQ0FBQyxFQUNaLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDN0I7OztTQTVJa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoic3JjL3NlcnZlci9DaGVja2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cbmNvbnN0IG1heFJhbmRvbUNsaWVudHMgPSA5OTk5O1xuXG5cbi8qKlxuICogVGhlIHtAbGluayBDaGVja2lufSB0YWtlcyBjYXJlIG9mIHRoZSBjaGVjay1pbiBvbiB0aGUgc2VydmVyIHNpZGUuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoZWNraW4gZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm5hbWU9J2NoZWNraW4nXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5zZXR1cF0gU2V0dXAgdXNlZCBpbiB0aGUgc2NlbmFyaW8sIGlmIGFueSAoY2YuIHtAbGluayBTZXJ2ZXJTZXR1cH0pLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubWF4Q2xpZW50cz1JbmZpbml0eV0gbWF4aW11bSBudW1iZXIgb2YgY2xpZW50cyBzdXBwb3J0ZWQgYnkgdGhlIHNjZW5hcmlvIHRocm91Z2ggdGhpcyBjaGVja2luIG1vZHVsZSAoaWYgYSBgb3B0aW9ucy5zZXR1cGAgaXMgcHJvdmlkZWQsIHRoZSBtYXhpbXVtIG51bWJlciBvZiBjbGllbnRzIHRoZSBudW1iZXIgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgb2YgdGhhdCBgc2V0dXBgKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm9yZGVyPSdhc2NlbmRpbmcnXSBPcmRlciBpbiB3aGljaCBpbmRpY2VzIGFyZSBhc3NpZ25lZC4gQ3VycmVudGx5IHNwcG9ydGVkIHZhbHVlcyBhcmU6XG4gICAqIC0gYCdhc2NlbmRpbmcnYDogaW5kaWNlcyBhcmUgYXNzaWduZWQgaW4gYXNjZW5kaW5nIG9yZGVyO1xuICAgKiAtIGAncmFuZG9tJ2A6IGluZGljZXMgYXJlIGFzc2lnbmVkIGluIHJhbmRvbSBvcmRlci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY2hlY2tpbicpO1xuXG4gICAgdGhpcy5zZXR1cCA9IG9wdGlvbnMuc2V0dXAgfHwgbnVsbDtcbiAgICB0aGlzLm1heENsaWVudHMgPSBvcHRpb25zLm1heENsaWVudHMgfHwgSW5maW5pdHk7XG4gICAgdGhpcy5vcmRlciA9IG9wdGlvbnMub3JkZXIgfHwgJ2FzY2VuZGluZyc7IC8vICdhc2NlbmRpbmcnIHwgJ3JhbmRvbSdcblxuICAgIGlmICh0aGlzLm1heENsaWVudHMgPiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUilcbiAgICAgIHRoaXMubWF4Q2xpZW50cyA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuXG4gICAgaWYgKHRoaXMuc2V0dXApIHtcbiAgICAgIHZhciBudW1QbGFjZXMgPSB0aGlzLnNldHVwLmdldE51bVBvc2l0aW9ucygpO1xuXG4gICAgICBpZiAodGhpcy5tYXhDbGllbnRzID4gbnVtUGxhY2VzICYmIG51bVBsYWNlcyA+IDApXG4gICAgICAgIHRoaXMubWF4Q2xpZW50cyA9IG51bVBsYWNlcztcbiAgICB9XG5cbiAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzID0gW107XG4gICAgdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4ID0gMDtcblxuICAgIGlmICh0aGlzLm1heENsaWVudHMgPiBtYXhSYW5kb21DbGllbnRzKVxuICAgICAgdGhpcy5vcmRlciA9ICdhc2NlbmRpbmcnO1xuICAgIGVsc2UgaWYgKHRoaXMub3JkZXIgPT09ICdyYW5kb20nKSB7XG4gICAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPSB0aGlzLm1heENsaWVudHM7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tYXhDbGllbnRzOyBpKyspXG4gICAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMucHVzaChpKTtcbiAgICB9XG4gIH1cblxuICBfZ2V0UmFuZG9tSW5kZXgoKSB7XG4gICAgdmFyIG51bUF2YWlsYWJsZSA9IHRoaXMuX2F2YWlsYWJsZUluZGljZXMubGVuZ3RoO1xuXG4gICAgaWYgKG51bUF2YWlsYWJsZSA+IDApIHtcbiAgICAgIGxldCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW1BdmFpbGFibGUpO1xuICAgICAgcmV0dXJuIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc3BsaWNlKHJhbmRvbSwgMSlbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgX2dldEFzY2VuZGluZ0luZGV4KCkge1xuICAgIGlmICh0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UoMCwgMSlbMF07XG4gICAgfSBlbHNlIGlmICh0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPCB0aGlzLm1heENsaWVudHMpIHtcbiAgICAgIHJldHVybiB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXgrKztcbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBfcmVsZWFzZUluZGV4KGluZGV4KSB7XG4gICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGluZGV4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOnJlcXVlc3QnLCAoKSA9PiB7XG4gICAgICB2YXIgaW5kZXggPSAtMTtcbiAgICAgIHZhciBvcmRlciA9IHRoaXMub3JkZXI7XG5cbiAgICAgIGlmICh0aGlzLm9yZGVyID09PSAncmFuZG9tJylcbiAgICAgICAgaW5kZXggPSB0aGlzLl9nZXRSYW5kb21JbmRleCgpO1xuICAgICAgZWxzZSAvLyBpZiAob3JkZXIgPT09ICdhY3NlbmRpbmcnKVxuICAgICAgICBpbmRleCA9IHRoaXMuX2dldEFzY2VuZGluZ0luZGV4KCk7XG5cbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0uaW5kZXggPSBpbmRleDtcblxuICAgICAgICB2YXIgbGFiZWwgPSBudWxsO1xuICAgICAgICB2YXIgY29vcmRpbmF0ZXMgPSBudWxsO1xuXG4gICAgICAgIGlmICh0aGlzLnNldHVwKSB7XG4gICAgICAgICAgbGFiZWwgPSB0aGlzLnNldHVwLmdldExhYmVsKGluZGV4KTtcbiAgICAgICAgICBjb29yZGluYXRlcyA9IHRoaXMuc2V0dXAuZ2V0Q29vcmRpbmF0ZXMoaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5sYWJlbCA9IGxhYmVsO1xuICAgICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgICAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOmFja25vd2xlZGdlJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOnVuYXZhaWxhYmxlJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOnJlc3RhcnQnLCAoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykgPT4ge1xuICAgICAgLy8gVE9ETzogY2hlY2sgaWYgdGhhdCdzIG9rIG9uIHJhbmRvbSBtb2RlXG4gICAgICBpZiAoaW5kZXggPiB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX25leHRBc2NlbmRpbmdJbmRleDsgaSA8IGluZGV4OyBpKyspXG4gICAgICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGkpO1xuXG4gICAgICAgIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCA9IGluZGV4ICsgMTtcbiAgICAgIH0gZWxzZSBpZiAoaW5kZXggPT09IHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCkge1xuICAgICAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXgrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBpID0gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5pbmRleE9mKGluZGV4KTtcblxuICAgICAgICBpZiAoaSA+IC0xKVxuICAgICAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuXG4gICAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmluZGV4ID0gaW5kZXg7XG5cbiAgICAgIGlmICh0aGlzLnNldHVwKSB7XG4gICAgICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0ubGFiZWwgPSBsYWJlbDtcbiAgICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG5cbiAgICB2YXIgaW5kZXggPSBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmluZGV4O1xuXG4gICAgaWYgKGluZGV4ID49IDApXG4gICAgICB0aGlzLl9yZWxlYXNlSW5kZXgoaW5kZXgpO1xuICB9XG59XG5cbiJdfQ==