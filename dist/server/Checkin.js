'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Number$MAX_SAFE_INTEGER = require('babel-runtime/core-js/number/max-safe-integer')['default'];

var ServerModule = require('./ServerModule');
// import ServerModule from './ServerModule.es6.js';

var maxRandomClients = 9999;

/**
 * The {@link ServerCheckin} takes care of the check-in on the server side.
 */

var ServerCheckin = (function (_ServerModule) {
  _inherits(ServerCheckin, _ServerModule);

  // export default class ServerCheckin extends ServerModule {
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

  function ServerCheckin() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerCheckin);

    _get(Object.getPrototypeOf(ServerCheckin.prototype), 'constructor', this).call(this, options.name || 'checkin');

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

  _createClass(ServerCheckin, [{
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

      _get(Object.getPrototypeOf(ServerCheckin.prototype), 'connect', this).call(this, client);

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
      _get(Object.getPrototypeOf(ServerCheckin.prototype), 'disconnect', this).call(this, client);

      var index = client.modules[this.name].index;

      if (index >= 0) this._releaseIndex(index);
    }
  }]);

  return ServerCheckin;
})(ServerModule);

module.exports = ServerCheckin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvQ2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7OztBQUViLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7QUFHL0MsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7Ozs7OztJQUt4QixhQUFhO1lBQWIsYUFBYTs7Ozs7Ozs7Ozs7Ozs7QUFZTixXQVpQLGFBQWEsR0FZUztRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBWnBCLGFBQWE7O0FBYWYsK0JBYkUsYUFBYSw2Q0FhVCxPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRTs7QUFFakMsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztBQUNuQyxRQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksUUFBUSxDQUFDO0FBQ2pELFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxXQUFXLENBQUM7O0FBRTFDLFFBQUksSUFBSSxDQUFDLFVBQVUsMkJBQTBCLEVBQzNDLElBQUksQ0FBQyxVQUFVLDJCQUEwQixDQUFDOztBQUU1QyxRQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDZCxVQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUU3QyxVQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQzlDLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0tBQy9COztBQUVELFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFDNUIsUUFBSSxDQUFDLG1CQUFtQixHQUFHLENBQUMsQ0FBQzs7QUFFN0IsUUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLGdCQUFnQixFQUNwQyxJQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxL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Q2pCLGlDQXZJRSxhQUFhLDRDQXVJRSxNQUFNLEVBQUU7O0FBRXpCLFVBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQzs7QUFFNUMsVUFBSSxLQUFLLElBQUksQ0FBQyxFQUNaLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDN0I7OztTQTdJRyxhQUFhO0dBQVMsWUFBWTs7QUFnSnhDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDIiwiZmlsZSI6InNyYy9zZXJ2ZXIvQ2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY29uc3QgU2VydmVyTW9kdWxlID0gcmVxdWlyZSgnLi9TZXJ2ZXJNb2R1bGUnKTtcbi8vIGltcG9ydCBTZXJ2ZXJNb2R1bGUgZnJvbSAnLi9TZXJ2ZXJNb2R1bGUuZXM2LmpzJztcblxuY29uc3QgbWF4UmFuZG9tQ2xpZW50cyA9IDk5OTk7XG5cbi8qKlxuICogVGhlIHtAbGluayBTZXJ2ZXJDaGVja2lufSB0YWtlcyBjYXJlIG9mIHRoZSBjaGVjay1pbiBvbiB0aGUgc2VydmVyIHNpZGUuXG4gKi9cbmNsYXNzIFNlcnZlckNoZWNraW4gZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuLy8gZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyQ2hlY2tpbiBleHRlbmRzIFNlcnZlck1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubmFtZT0nY2hlY2tpbiddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnNldHVwXSBTZXR1cCB1c2VkIGluIHRoZSBzY2VuYXJpbywgaWYgYW55IChjZi4ge0BsaW5rIFNlcnZlclNldHVwfSkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5tYXhDbGllbnRzPUluZmluaXR5XSBtYXhpbXVtIG51bWJlciBvZiBjbGllbnRzIHN1cHBvcnRlZCBieSB0aGUgc2NlbmFyaW8gdGhyb3VnaCB0aGlzIGNoZWNraW4gbW9kdWxlIChpZiBhIGBvcHRpb25zLnNldHVwYCBpcyBwcm92aWRlZCwgdGhlIG1heGltdW0gbnVtYmVyIG9mIGNsaWVudHMgdGhlIG51bWJlciBvZiBwcmVkZWZpbmVkIHBvc2l0aW9ucyBvZiB0aGF0IGBzZXR1cGApLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMub3JkZXI9J2FzY2VuZGluZyddIE9yZGVyIGluIHdoaWNoIGluZGljZXMgYXJlIGFzc2lnbmVkLiBDdXJyZW50bHkgc3Bwb3J0ZWQgdmFsdWVzIGFyZTpcbiAgICogLSBgJ2FzY2VuZGluZydgOiBpbmRpY2VzIGFyZSBhc3NpZ25lZCBpbiBhc2NlbmRpbmcgb3JkZXI7XG4gICAqIC0gYCdyYW5kb20nYDogaW5kaWNlcyBhcmUgYXNzaWduZWQgaW4gcmFuZG9tIG9yZGVyLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdjaGVja2luJyk7XG5cbiAgICB0aGlzLnNldHVwID0gb3B0aW9ucy5zZXR1cCB8fCBudWxsO1xuICAgIHRoaXMubWF4Q2xpZW50cyA9IG9wdGlvbnMubWF4Q2xpZW50cyB8fCBJbmZpbml0eTtcbiAgICB0aGlzLm9yZGVyID0gb3B0aW9ucy5vcmRlciB8fCAnYXNjZW5kaW5nJzsgLy8gJ2FzY2VuZGluZycgfCAncmFuZG9tJ1xuXG4gICAgaWYgKHRoaXMubWF4Q2xpZW50cyA+IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKVxuICAgICAgdGhpcy5tYXhDbGllbnRzID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG5cbiAgICBpZiAodGhpcy5zZXR1cCkge1xuICAgICAgdmFyIG51bVBsYWNlcyA9IHRoaXMuc2V0dXAuZ2V0TnVtUG9zaXRpb25zKCk7XG5cbiAgICAgIGlmICh0aGlzLm1heENsaWVudHMgPiBudW1QbGFjZXMgJiYgbnVtUGxhY2VzID4gMClcbiAgICAgICAgdGhpcy5tYXhDbGllbnRzID0gbnVtUGxhY2VzO1xuICAgIH1cblxuICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMgPSBbXTtcbiAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPSAwO1xuXG4gICAgaWYgKHRoaXMubWF4Q2xpZW50cyA+IG1heFJhbmRvbUNsaWVudHMpXG4gICAgICB0aGlzLm9yZGVyID0gJ2FzY2VuZGluZyc7XG4gICAgZWxzZSBpZiAodGhpcy5vcmRlciA9PT0gJ3JhbmRvbScpIHtcbiAgICAgIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCA9IHRoaXMubWF4Q2xpZW50cztcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1heENsaWVudHM7IGkrKylcbiAgICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGkpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRSYW5kb21JbmRleCgpIHtcbiAgICB2YXIgbnVtQXZhaWxhYmxlID0gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5sZW5ndGg7XG5cbiAgICBpZiAobnVtQXZhaWxhYmxlID4gMCkge1xuICAgICAgbGV0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bUF2YWlsYWJsZSk7XG4gICAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UocmFuZG9tLCAxKVswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBfZ2V0QXNjZW5kaW5nSW5kZXgoKSB7XG4gICAgaWYgKHRoaXMuX2F2YWlsYWJsZUluZGljZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnNwbGljZSgwLCAxKVswXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCA8IHRoaXMubWF4Q2xpZW50cykge1xuICAgICAgcmV0dXJuIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCsrO1xuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIF9yZWxlYXNlSW5kZXgoaW5kZXgpIHtcbiAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnB1c2goaW5kZXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIGNsaWVudC5yZWNlaXZlKHRoaXMubmFtZSArICc6cmVxdWVzdCcsICgpID0+IHtcbiAgICAgIHZhciBpbmRleCA9IC0xO1xuICAgICAgdmFyIG9yZGVyID0gdGhpcy5vcmRlcjtcblxuICAgICAgaWYgKHRoaXMub3JkZXIgPT09ICdyYW5kb20nKVxuICAgICAgICBpbmRleCA9IHRoaXMuX2dldFJhbmRvbUluZGV4KCk7XG4gICAgICBlbHNlIC8vIGlmIChvcmRlciA9PT0gJ2Fjc2VuZGluZycpXG4gICAgICAgIGluZGV4ID0gdGhpcy5fZ2V0QXNjZW5kaW5nSW5kZXgoKTtcblxuICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5pbmRleCA9IGluZGV4O1xuXG4gICAgICAgIHZhciBsYWJlbCA9IG51bGw7XG4gICAgICAgIHZhciBjb29yZGluYXRlcyA9IG51bGw7XG5cbiAgICAgICAgaWYgKHRoaXMuc2V0dXApIHtcbiAgICAgICAgICBsYWJlbCA9IHRoaXMuc2V0dXAuZ2V0TGFiZWwoaW5kZXgpO1xuICAgICAgICAgIGNvb3JkaW5hdGVzID0gdGhpcy5zZXR1cC5nZXRDb29yZGluYXRlcyhpbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmxhYmVsID0gbGFiZWw7XG4gICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgICAgIGNsaWVudC5zZW5kKHRoaXMubmFtZSArICc6YWNrbm93bGVkZ2UnLCBpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNsaWVudC5zZW5kKHRoaXMubmFtZSArICc6dW5hdmFpbGFibGUnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNsaWVudC5yZWNlaXZlKHRoaXMubmFtZSArICc6cmVzdGFydCcsIChpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgICAvLyBUT0RPOiBjaGVjayBpZiB0aGF0J3Mgb2sgb24gcmFuZG9tIG1vZGVcbiAgICAgIGlmIChpbmRleCA+IHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCkge1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4OyBpIDwgaW5kZXg7IGkrKylcbiAgICAgICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnB1c2goaSk7XG5cbiAgICAgICAgdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4ID0gaW5kZXggKyAxO1xuICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4KSB7XG4gICAgICAgIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGkgPSB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmluZGV4T2YoaW5kZXgpO1xuXG4gICAgICAgIGlmIChpID4gLTEpXG4gICAgICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG5cbiAgICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0uaW5kZXggPSBpbmRleDtcblxuICAgICAgaWYgKHRoaXMuc2V0dXApIHtcbiAgICAgICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5sYWJlbCA9IGxhYmVsO1xuICAgICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIHZhciBpbmRleCA9IGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0uaW5kZXg7XG5cbiAgICBpZiAoaW5kZXggPj0gMClcbiAgICAgIHRoaXMuX3JlbGVhc2VJbmRleChpbmRleCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXJ2ZXJDaGVja2luO1xuIl19