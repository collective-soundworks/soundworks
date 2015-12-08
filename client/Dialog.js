'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _wavesAudio = require('waves-audio');

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

// for testing purpose

var _displayView = require('./display/View');

var _displayView2 = _interopRequireDefault(_displayView);

/**
 * @private
 */
function _base64(format, base64) {
  return 'data:' + format + ';base64,' + base64;
}

/**
 * [client] Display a full screen dialog.
 *
 * The module requires the participant to tap the screen to make the view disappear.
 * The module is mainly used at the very beginning of a scenario to activate the Web Audio API on iOS devices (with the `activateAudio` option).
 *
 * The module always has a view.
 *
 * The module finishes its initialzation when the user taps the screen.
 *
 * @example
 * const welcomeDialog = new Dialog({
 *   name: 'welcome',
 *   activateAudio: true
 * });
 */

var Dialog = (function (_ClientModule) {
  _inherits(Dialog, _ClientModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='dialog'] Name of the module.
   * @param {Boolean} [options.activateAudio=false] Indicates whether the module activates the Web Audio API when the participant touches the screen (useful on iOS devices).
   * @param {Boolean} [options.wakeLock=false] Indicates whether the modules activates an ever-looping 1-pixel video to prevent the device from going idle.
   */

  function Dialog() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Dialog);

    _get(Object.getPrototypeOf(Dialog.prototype), 'constructor', this).call(this, options.name || 'dialog');

    // super(options.name || 'dialog', false, options.color);

    this._mustActivateAudio = !!options.activateAudio;
    this._mustWakeLock = !!options.wakeLock;

    this.events = {
      'click': this._clickHandler.bind(this)
    };

    if (options.view) {
      this.view = options.view;
    } else {
      this.view = this.createDefaultView();
    }
  }

  /**
   * @private
   */

  _createClass(Dialog, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Dialog.prototype), 'start', this).call(this);
      // Initialize video element for wakeLocking
      this._initWakeLock();
    }

    /**
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(Dialog.prototype), 'restart', this).call(this);
      this.done();
    }
  }, {
    key: '_activateAudio',
    value: function _activateAudio() {
      var o = _wavesAudio.audioContext.createOscillator();
      var g = _wavesAudio.audioContext.createGain();
      g.gain.value = 0;
      o.connect(g);
      g.connect(_wavesAudio.audioContext.destination);
      o.start(0);
      o.stop(_wavesAudio.audioContext.currentTime + 0.01);
    }
  }, {
    key: '_clickHandler',
    value: function _clickHandler() {
      if (this._mustActivateAudio) this._activateAudio();

      if (this._mustWakeLock) this._requestWakeLock();

      this.done();
    }

    // cf. https://github.com/borismus/webvr-boilerplate/blob/8abbc74cfa5976b9ab0c388cb0c51944008c6989/js/webvr-manager.js#L268-L289
  }, {
    key: '_initWakeLock',
    value: function _initWakeLock() {
      var _this = this;

      this._wakeLockVideo = document.createElement('video');

      this._wakeLockVideo.addEventListener('ended', function () {
        _this._wakeLockVideo.play();
      });
    }
  }, {
    key: '_requestWakeLock',
    value: function _requestWakeLock() {
      var os = _client2['default'].platform.os;
      this._releaseWakeClock();

      if (os === 'ios') {
        if (this._wakeLockTimer) return;

        this._wakeLockTimer = setInterval(function () {
          window.location = window.location;
          setTimeout(window.stop, 0);
        }, 30000);
      } else if (os === 'android') {
        if (this._wakeLockVideo.paused === false) return;

        this._wakeLockVideo.src = _base64('video/webm', 'GkXfowEAAAAAAAAfQoaBAUL3gQFC8oEEQvOBCEKChHdlYm1Ch4ECQoWBAhhTgGcBAAAAAAACWxFNm3RALE27i1OrhBVJqWZTrIHfTbuMU6uEFlSua1OsggEuTbuMU6uEHFO7a1OsggI+7AEAAAAAAACkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmAQAAAAAAAEMq17GDD0JATYCMTGF2ZjU2LjQuMTAxV0GMTGF2ZjU2LjQuMTAxc6SQ20Yv/Elws73A/+KfEjM11ESJiEBkwAAAAAAAFlSuawEAAAAAAABHrgEAAAAAAAA+14EBc8WBAZyBACK1nIN1bmSGhVZfVlA4g4EBI+ODhAT3kNXgAQAAAAAAABKwgRC6gRBTwIEBVLCBEFS6gRAfQ7Z1AQAAAAAAALHngQCgAQAAAAAAAFyho4EAAIAQAgCdASoQABAAAEcIhYWIhYSIAgIADA1gAP7/q1CAdaEBAAAAAAAALaYBAAAAAAAAJO6BAaWfEAIAnQEqEAAQAABHCIWFiIWEiAICAAwNYAD+/7r/QKABAAAAAAAAQKGVgQBTALEBAAEQEAAYABhYL/QACAAAdaEBAAAAAAAAH6YBAAAAAAAAFu6BAaWRsQEAARAQABgAGFgv9AAIAAAcU7trAQAAAAAAABG7j7OBALeK94EB8YIBgfCBAw==');
        this._wakeLockVideo.play();
      }
    }
  }, {
    key: '_releaseWakeClock',
    value: function _releaseWakeClock() {
      var os = _client2['default'].platform.os;

      if (os === 'ios') {
        if (this._wakeLockTimer) {
          clearInterval(this._wakeLockTimer);
          this._wakeLockTimer = null;
        }
      } else if (os === 'android') {
        this._wakeLockVideo.pause();
        this._wakeLockVideo.src = '';
      }
    }
  }]);

  return Dialog;
})(_ClientModule3['default']);

exports['default'] = Dialog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvRGlhbG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBQTZCLGFBQWE7O3NCQUN2QixVQUFVOzs7OzZCQUNKLGdCQUFnQjs7Ozs7OzJCQUl4QixnQkFBZ0I7Ozs7Ozs7QUFLakMsU0FBUyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtBQUMvQixtQkFBZSxNQUFNLGdCQUFXLE1BQU0sQ0FBRztDQUMxQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCb0IsTUFBTTtZQUFOLE1BQU07Ozs7Ozs7OztBQU9kLFdBUFEsTUFBTSxHQU9DO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFQTCxNQUFNOztBQVF2QiwrQkFSaUIsTUFBTSw2Q0FRakIsT0FBTyxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUU7Ozs7QUFJaEMsUUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO0FBQ2xELFFBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7O0FBRXhDLFFBQUksQ0FBQyxNQUFNLEdBQUc7QUFDWixhQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQ3ZDLENBQUM7O0FBRUYsUUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztLQUMxQixNQUFNO0FBQ0wsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztLQUN0QztHQUNGOzs7Ozs7ZUF4QmtCLE1BQU07O1dBNkJwQixpQkFBRztBQUNOLGlDQTlCaUIsTUFBTSx1Q0E4QlQ7O0FBRWQsVUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0tBQ3RCOzs7Ozs7O1dBS00sbUJBQUc7QUFDUixpQ0F2Q2lCLE1BQU0seUNBdUNQO0FBQ2hCLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7V0FFYSwwQkFBRztBQUNmLFVBQUksQ0FBQyxHQUFHLHlCQUFhLGdCQUFnQixFQUFFLENBQUM7QUFDeEMsVUFBSSxDQUFDLEdBQUcseUJBQWEsVUFBVSxFQUFFLENBQUM7QUFDbEMsT0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLE9BQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDYixPQUFDLENBQUMsT0FBTyxDQUFDLHlCQUFhLFdBQVcsQ0FBQyxDQUFDO0FBQ3BDLE9BQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDWCxPQUFDLENBQUMsSUFBSSxDQUFDLHlCQUFhLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQztLQUN6Qzs7O1dBRVkseUJBQUc7QUFDZCxVQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFDekIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDOztBQUV4QixVQUFJLElBQUksQ0FBQyxhQUFhLEVBQ3BCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOztBQUUxQixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7Ozs7V0FHWSx5QkFBRzs7O0FBQ2QsVUFBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUV0RCxVQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQ2xELGNBQUssY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO09BQzVCLENBQUMsQ0FBQztLQUNKOzs7V0FFZSw0QkFBRztBQUNqQixVQUFNLEVBQUUsR0FBRyxvQkFBTyxRQUFRLENBQUMsRUFBRSxDQUFDO0FBQzlCLFVBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDOztBQUV6QixVQUFJLEVBQUUsS0FBSyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLE9BQU87O0FBRWhDLFlBQUksQ0FBQyxjQUFjLEdBQUcsV0FBVyxDQUFDLFlBQU07QUFDdEMsZ0JBQU0sQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNsQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDNUIsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUNYLE1BQU0sSUFBSSxFQUFFLEtBQUssU0FBUyxFQUFFO0FBQzNCLFlBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEtBQUssS0FBSyxFQUFFLE9BQU87O0FBRWpELFlBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxZQUFZLEVBQUUsazNCQUFrM0IsQ0FBQyxDQUFDO0FBQ3A2QixZQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO09BQzVCO0tBQ0Y7OztXQUVnQiw2QkFBRztBQUNsQixVQUFNLEVBQUUsR0FBRyxvQkFBTyxRQUFRLENBQUMsRUFBRSxDQUFDOztBQUU5QixVQUFJLEVBQUUsS0FBSyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO0FBQ3ZCLHVCQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25DLGNBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1NBQzVCO09BQ0YsTUFBTSxJQUFJLEVBQUUsS0FBSyxTQUFTLEVBQUU7QUFDM0IsWUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QixZQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7T0FDOUI7S0FDRjs7O1NBdkdrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJzcmMvY2xpZW50L0RpYWxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5cblxuLy8gZm9yIHRlc3RpbmcgcHVycG9zZVxuaW1wb3J0IFZpZXcgZnJvbSAnLi9kaXNwbGF5L1ZpZXcnO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9iYXNlNjQoZm9ybWF0LCBiYXNlNjQpIHtcbiAgcmV0dXJuIGBkYXRhOiR7Zm9ybWF0fTtiYXNlNjQsJHtiYXNlNjR9YDtcbn1cblxuLyoqXG4gKiBbY2xpZW50XSBEaXNwbGF5IGEgZnVsbCBzY3JlZW4gZGlhbG9nLlxuICpcbiAqIFRoZSBtb2R1bGUgcmVxdWlyZXMgdGhlIHBhcnRpY2lwYW50IHRvIHRhcCB0aGUgc2NyZWVuIHRvIG1ha2UgdGhlIHZpZXcgZGlzYXBwZWFyLlxuICogVGhlIG1vZHVsZSBpcyBtYWlubHkgdXNlZCBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgb2YgYSBzY2VuYXJpbyB0byBhY3RpdmF0ZSB0aGUgV2ViIEF1ZGlvIEFQSSBvbiBpT1MgZGV2aWNlcyAod2l0aCB0aGUgYGFjdGl2YXRlQXVkaW9gIG9wdGlvbikuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgaGFzIGEgdmlldy5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsemF0aW9uIHdoZW4gdGhlIHVzZXIgdGFwcyB0aGUgc2NyZWVuLlxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCB3ZWxjb21lRGlhbG9nID0gbmV3IERpYWxvZyh7XG4gKiAgIG5hbWU6ICd3ZWxjb21lJyxcbiAqICAgYWN0aXZhdGVBdWRpbzogdHJ1ZVxuICogfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpYWxvZyBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdkaWFsb2cnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuYWN0aXZhdGVBdWRpbz1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1vZHVsZSBhY3RpdmF0ZXMgdGhlIFdlYiBBdWRpbyBBUEkgd2hlbiB0aGUgcGFydGljaXBhbnQgdG91Y2hlcyB0aGUgc2NyZWVuICh1c2VmdWwgb24gaU9TIGRldmljZXMpLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLndha2VMb2NrPWZhbHNlXSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgbW9kdWxlcyBhY3RpdmF0ZXMgYW4gZXZlci1sb29waW5nIDEtcGl4ZWwgdmlkZW8gdG8gcHJldmVudCB0aGUgZGV2aWNlIGZyb20gZ29pbmcgaWRsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnZGlhbG9nJyk7XG5cbiAgICAvLyBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2RpYWxvZycsIGZhbHNlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIHRoaXMuX211c3RBY3RpdmF0ZUF1ZGlvID0gISFvcHRpb25zLmFjdGl2YXRlQXVkaW87XG4gICAgdGhpcy5fbXVzdFdha2VMb2NrID0gISFvcHRpb25zLndha2VMb2NrO1xuXG4gICAgdGhpcy5ldmVudHMgPSB7XG4gICAgICAnY2xpY2snOiB0aGlzLl9jbGlja0hhbmRsZXIuYmluZCh0aGlzKVxuICAgIH07XG5cbiAgICBpZiAob3B0aW9ucy52aWV3KSB7XG4gICAgICB0aGlzLnZpZXcgPSBvcHRpb25zLnZpZXc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlRGVmYXVsdFZpZXcoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgLy8gSW5pdGlhbGl6ZSB2aWRlbyBlbGVtZW50IGZvciB3YWtlTG9ja2luZ1xuICAgIHRoaXMuX2luaXRXYWtlTG9jaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIF9hY3RpdmF0ZUF1ZGlvKCkge1xuICAgIHZhciBvID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgICB2YXIgZyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgZy5nYWluLnZhbHVlID0gMDtcbiAgICBvLmNvbm5lY3QoZyk7XG4gICAgZy5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgby5zdGFydCgwKTtcbiAgICBvLnN0b3AoYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgMC4wMSk7XG4gIH1cblxuICBfY2xpY2tIYW5kbGVyKCkge1xuICAgIGlmICh0aGlzLl9tdXN0QWN0aXZhdGVBdWRpbylcbiAgICAgIHRoaXMuX2FjdGl2YXRlQXVkaW8oKTtcblxuICAgIGlmICh0aGlzLl9tdXN0V2FrZUxvY2spXG4gICAgICB0aGlzLl9yZXF1ZXN0V2FrZUxvY2soKTtcblxuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgLy8gY2YuIGh0dHBzOi8vZ2l0aHViLmNvbS9ib3Jpc211cy93ZWJ2ci1ib2lsZXJwbGF0ZS9ibG9iLzhhYmJjNzRjZmE1OTc2YjlhYjBjMzg4Y2IwYzUxOTQ0MDA4YzY5ODkvanMvd2VidnItbWFuYWdlci5qcyNMMjY4LUwyODlcbiAgX2luaXRXYWtlTG9jaygpIHtcbiAgICB0aGlzLl93YWtlTG9ja1ZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcblxuICAgIHRoaXMuX3dha2VMb2NrVmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCAoKSA9PiB7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnBsYXkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9yZXF1ZXN0V2FrZUxvY2soKSB7XG4gICAgY29uc3Qgb3MgPSBjbGllbnQucGxhdGZvcm0ub3M7XG4gICAgdGhpcy5fcmVsZWFzZVdha2VDbG9jaygpO1xuXG4gICAgaWYgKG9zID09PSAnaW9zJykge1xuICAgICAgaWYgKHRoaXMuX3dha2VMb2NrVGltZXIpIHJldHVybjtcblxuICAgICAgdGhpcy5fd2FrZUxvY2tUaW1lciA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xuICAgICAgICBzZXRUaW1lb3V0KHdpbmRvdy5zdG9wLCAwKTtcbiAgICAgIH0sIDMwMDAwKTtcbiAgICB9IGVsc2UgaWYgKG9zID09PSAnYW5kcm9pZCcpIHtcbiAgICAgIGlmICh0aGlzLl93YWtlTG9ja1ZpZGVvLnBhdXNlZCA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5zcmMgPSBfYmFzZTY0KCd2aWRlby93ZWJtJywgJ0drWGZvd0VBQUFBQUFBQWZRb2FCQVVMM2dRRkM4b0VFUXZPQkNFS0NoSGRsWW0xQ2g0RUNRb1dCQWhoVGdHY0JBQUFBQUFBQ1d4Rk5tM1JBTEUyN2kxT3JoQlZKcVdaVHJJSGZUYnVNVTZ1RUZsU3VhMU9zZ2dFdVRidU1VNnVFSEZPN2ExT3NnZ0krN0FFQUFBQUFBQUNrQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBVlNhbG1BUUFBQUFBQUFFTXExN0dERDBKQVRZQ01UR0YyWmpVMkxqUXVNVEF4VjBHTVRHRjJaalUyTGpRdU1UQXhjNlNRMjBZdi9FbHdzNzNBLytLZkVqTTExRVNKaUVCa3dBQUFBQUFBRmxTdWF3RUFBQUFBQUFCSHJnRUFBQUFBQUFBKzE0RUJjOFdCQVp5QkFDSzFuSU4xYm1TR2hWWmZWbEE0ZzRFQkkrT0RoQVQza05YZ0FRQUFBQUFBQUJLd2dSQzZnUkJUd0lFQlZMQ0JFRlM2Z1JBZlE3WjFBUUFBQUFBQUFMSG5nUUNnQVFBQUFBQUFBRnlobzRFQUFJQVFBZ0NkQVNvUUFCQUFBRWNJaFlXSWhZU0lBZ0lBREExZ0FQNy9xMUNBZGFFQkFBQUFBQUFBTGFZQkFBQUFBQUFBSk82QkFhV2ZFQUlBblFFcUVBQVFBQUJIQ0lXRmlJV0VpQUlDQUF3TllBRCsvN3IvUUtBQkFBQUFBQUFBUUtHVmdRQlRBTEVCQUFFUUVBQVlBQmhZTC9RQUNBQUFkYUVCQUFBQUFBQUFINllCQUFBQUFBQUFGdTZCQWFXUnNRRUFBUkFRQUJnQUdGZ3Y5QUFJQUFBY1U3dHJBUUFBQUFBQUFCRzdqN09CQUxlSzk0RUI4WUlCZ2ZDQkF3PT0nKTtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8ucGxheSgpO1xuICAgIH1cbiAgfVxuXG4gIF9yZWxlYXNlV2FrZUNsb2NrKCkge1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuXG4gICAgaWYgKG9zID09PSAnaW9zJykge1xuICAgICAgaWYgKHRoaXMuX3dha2VMb2NrVGltZXIpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl93YWtlTG9ja1RpbWVyKTtcbiAgICAgICAgdGhpcy5fd2FrZUxvY2tUaW1lciA9IG51bGw7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnKSB7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnBhdXNlKCk7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnNyYyA9ICcnO1xuICAgIH1cbiAgfVxufVxuIl19