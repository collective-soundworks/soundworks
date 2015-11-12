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

var _platform = require('platform');

var _platform2 = _interopRequireDefault(_platform);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

/**
 * Messages written in the view when the device can't pass the platform check.
 * @type {Object}
 * @property {string} iosVersion
 * @property {string} androidVersion
 * @property {string} wrongOS
 */
var defaultMessages = {
  iosVersion: "This application requires at least iOS 7 with Safari or Chrome.",
  androidVersion: "This application requires at least Android 4.2 with Chrome.",
  wrongOS: "This application is designed for iOS and Android mobile devices."
};

/**
 * The {@link ClientPlatform} checks whether the device is compatible with the technologies used in the *Soundworks* library.
 * (Compatible devices are running on iOS 7 or above, or on Android 4.2 or above with the Chrome browser in version 35 or above.)
 * If that is not the case, the module displays a blocking view and prevents the participant to go any further in the scenario.
 * The {@link ClientPlatform} module calls its `done` method immediately if the device passes the platform test, and never otherwise.
 */

var Platform = (function (_Module) {
  _inherits(Platform, _Module);

  /**
   * Creates an instance of the class. Always has a view.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='platform-check'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String} [options.prefix=''] Additional content displayed before the error message (*e.g.* `'Welcome to My Scenario!'`).
   * @param {String} [options.postfix=''] Additional content displayed after the error message (*e.g.* `'You can still enjoy the performance with others!'`).
   * @param {String} [options.messages=defaultMessages] Error messages displayed when the device doesn't pass the platform check.
   * @param {Boolean} [options.bypass=false] When set to `true`, the module is bypassed (calls the `done`method immediately).
   */

  function Platform() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Platform);

    _get(Object.getPrototypeOf(Platform.prototype), 'constructor', this).call(this, options.name || 'platform-check', true, options.color);

    this._prefix = options.prefix || '';
    this._postfix = options.postfix || '';
    this._messages = options.messages || defaultMessages;
    this._bypass = options.bypass || false;
  }

  _createClass(Platform, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Platform.prototype), 'start', this).call(this);

      var msg = null;
      var os = _client2['default'].platform.os;
      var isMobile = _client2['default'].platform.isMobile;

      if (this._bypass) return this.done();

      if (!_wavesAudio.audioContext) {
        if (os === 'ios') {
          msg = this._messages.iosVersion;
        } else if (os === 'android') {
          msg = this._messages.androidVersion;
        } else {
          msg = this._messages.wrongOS;
        }
      } else if (!isMobile || _client2['default'].platform.os === 'other') {
        msg = this._messages.wrongOS;
      } else if (_client2['default'].platform.os === 'ios' && _platform2['default'].os.version < '7') {
        msg = this._messages.iosVersion;
      } else if (_client2['default'].platform.os === 'android' && _platform2['default'].os.version < '4.2') {
        msg = this._messages.androidVersion;
      }

      if (msg !== null) {
        this.setCenteredViewContent(this._prefix + '<p>' + msg + '</p>' + this._postfix);
      } else {
        this.done();
      }
    }
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(Platform.prototype), 'restart', this).call(this);
      this.done();
    }
  }]);

  return Platform;
})(_Module3['default']);

exports['default'] = Platform;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvUGxhdGZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzswQkFBNkIsYUFBYTs7d0JBQ3JCLFVBQVU7Ozs7c0JBQ1osVUFBVTs7Ozt1QkFDVixVQUFVOzs7Ozs7Ozs7OztBQVU3QixJQUFNLGVBQWUsR0FBRztBQUN0QixZQUFVLEVBQUUsaUVBQWlFO0FBQzdFLGdCQUFjLEVBQUUsNkRBQTZEO0FBQzdFLFNBQU8sRUFBRSxrRUFBa0U7Q0FDNUUsQ0FBQzs7Ozs7Ozs7O0lBUW1CLFFBQVE7WUFBUixRQUFROzs7Ozs7Ozs7Ozs7O0FBV2hCLFdBWFEsUUFBUSxHQVdEO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFYTCxRQUFROztBQVl6QiwrQkFaaUIsUUFBUSw2Q0FZbkIsT0FBTyxDQUFDLElBQUksSUFBSSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRTs7QUFFN0QsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNwQyxRQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO0FBQ3RDLFFBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxlQUFlLENBQUM7QUFDckQsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQztHQUN4Qzs7ZUFsQmtCLFFBQVE7O1dBb0J0QixpQkFBRztBQUNOLGlDQXJCaUIsUUFBUSx1Q0FxQlg7O0FBRWQsVUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2YsVUFBTSxFQUFFLEdBQUcsb0JBQU8sUUFBUSxDQUFDLEVBQUUsQ0FBQztBQUM5QixVQUFNLFFBQVEsR0FBRyxvQkFBTyxRQUFRLENBQUMsUUFBUSxDQUFDOztBQUUxQyxVQUFJLElBQUksQ0FBQyxPQUFPLEVBQ2QsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRXJCLFVBQUkseUJBQWEsRUFBRTtBQUNqQixZQUFJLEVBQUUsS0FBSyxLQUFLLEVBQUU7QUFDaEIsYUFBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO1NBQ2pDLE1BQU0sSUFBSSxFQUFFLEtBQUssU0FBUyxFQUFFO0FBQzNCLGFBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztTQUNyQyxNQUFNO0FBQ0wsYUFBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO1NBQzlCO09BQ0YsTUFBTSxJQUFJLENBQUMsUUFBUSxJQUFJLG9CQUFPLFFBQVEsQ0FBQyxFQUFFLEtBQUssT0FBTyxFQUFFO0FBQ3RELFdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztPQUM5QixNQUFNLElBQUksb0JBQU8sUUFBUSxDQUFDLEVBQUUsS0FBSyxLQUFLLElBQUksc0JBQVMsRUFBRSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUU7QUFDcEUsV0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO09BQ2pDLE1BQU0sSUFBSSxvQkFBTyxRQUFRLENBQUMsRUFBRSxLQUFLLFNBQVMsSUFBSSxzQkFBUyxFQUFFLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRTtBQUMxRSxXQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7T0FDckM7O0FBRUQsVUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUNsRixNQUFNO0FBQ0wsWUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2I7S0FDRjs7O1dBRU0sbUJBQUc7QUFDUixpQ0F0RGlCLFFBQVEseUNBc0RUO0FBQ2hCLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7U0F4RGtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6InNyYy9jbGllbnQvUGxhdGZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAncGxhdGZvcm0nO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG4vKipcbiAqIE1lc3NhZ2VzIHdyaXR0ZW4gaW4gdGhlIHZpZXcgd2hlbiB0aGUgZGV2aWNlIGNhbid0IHBhc3MgdGhlIHBsYXRmb3JtIGNoZWNrLlxuICogQHR5cGUge09iamVjdH1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpb3NWZXJzaW9uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYW5kcm9pZFZlcnNpb25cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB3cm9uZ09TXG4gKi9cbmNvbnN0IGRlZmF1bHRNZXNzYWdlcyA9IHtcbiAgaW9zVmVyc2lvbjogXCJUaGlzIGFwcGxpY2F0aW9uIHJlcXVpcmVzIGF0IGxlYXN0IGlPUyA3IHdpdGggU2FmYXJpIG9yIENocm9tZS5cIixcbiAgYW5kcm9pZFZlcnNpb246IFwiVGhpcyBhcHBsaWNhdGlvbiByZXF1aXJlcyBhdCBsZWFzdCBBbmRyb2lkIDQuMiB3aXRoIENocm9tZS5cIixcbiAgd3JvbmdPUzogXCJUaGlzIGFwcGxpY2F0aW9uIGlzIGRlc2lnbmVkIGZvciBpT1MgYW5kIEFuZHJvaWQgbW9iaWxlIGRldmljZXMuXCJcbn07XG5cbi8qKlxuICogVGhlIHtAbGluayBDbGllbnRQbGF0Zm9ybX0gY2hlY2tzIHdoZXRoZXIgdGhlIGRldmljZSBpcyBjb21wYXRpYmxlIHdpdGggdGhlIHRlY2hub2xvZ2llcyB1c2VkIGluIHRoZSAqU291bmR3b3JrcyogbGlicmFyeS5cbiAqIChDb21wYXRpYmxlIGRldmljZXMgYXJlIHJ1bm5pbmcgb24gaU9TIDcgb3IgYWJvdmUsIG9yIG9uIEFuZHJvaWQgNC4yIG9yIGFib3ZlIHdpdGggdGhlIENocm9tZSBicm93c2VyIGluIHZlcnNpb24gMzUgb3IgYWJvdmUuKVxuICogSWYgdGhhdCBpcyBub3QgdGhlIGNhc2UsIHRoZSBtb2R1bGUgZGlzcGxheXMgYSBibG9ja2luZyB2aWV3IGFuZCBwcmV2ZW50cyB0aGUgcGFydGljaXBhbnQgdG8gZ28gYW55IGZ1cnRoZXIgaW4gdGhlIHNjZW5hcmlvLlxuICogVGhlIHtAbGluayBDbGllbnRQbGF0Zm9ybX0gbW9kdWxlIGNhbGxzIGl0cyBgZG9uZWAgbWV0aG9kIGltbWVkaWF0ZWx5IGlmIHRoZSBkZXZpY2UgcGFzc2VzIHRoZSBwbGF0Zm9ybSB0ZXN0LCBhbmQgbmV2ZXIgb3RoZXJ3aXNlLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF0Zm9ybSBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy4gQWx3YXlzIGhhcyBhIHZpZXcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3BsYXRmb3JtLWNoZWNrJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMucHJlZml4PScnXSBBZGRpdGlvbmFsIGNvbnRlbnQgZGlzcGxheWVkIGJlZm9yZSB0aGUgZXJyb3IgbWVzc2FnZSAoKmUuZy4qIGAnV2VsY29tZSB0byBNeSBTY2VuYXJpbyEnYCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5wb3N0Zml4PScnXSBBZGRpdGlvbmFsIGNvbnRlbnQgZGlzcGxheWVkIGFmdGVyIHRoZSBlcnJvciBtZXNzYWdlICgqZS5nLiogYCdZb3UgY2FuIHN0aWxsIGVuam95IHRoZSBwZXJmb3JtYW5jZSB3aXRoIG90aGVycyEnYCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5tZXNzYWdlcz1kZWZhdWx0TWVzc2FnZXNdIEVycm9yIG1lc3NhZ2VzIGRpc3BsYXllZCB3aGVuIHRoZSBkZXZpY2UgZG9lc24ndCBwYXNzIHRoZSBwbGF0Zm9ybSBjaGVjay5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5ieXBhc3M9ZmFsc2VdIFdoZW4gc2V0IHRvIGB0cnVlYCwgdGhlIG1vZHVsZSBpcyBieXBhc3NlZCAoY2FsbHMgdGhlIGBkb25lYG1ldGhvZCBpbW1lZGlhdGVseSkuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3BsYXRmb3JtLWNoZWNrJywgdHJ1ZSwgb3B0aW9ucy5jb2xvcik7XG5cbiAgICB0aGlzLl9wcmVmaXggPSBvcHRpb25zLnByZWZpeCB8fCAnJztcbiAgICB0aGlzLl9wb3N0Zml4ID0gb3B0aW9ucy5wb3N0Zml4IHx8wqAnJztcbiAgICB0aGlzLl9tZXNzYWdlcyA9IG9wdGlvbnMubWVzc2FnZXMgfHwgZGVmYXVsdE1lc3NhZ2VzO1xuICAgIHRoaXMuX2J5cGFzcyA9IG9wdGlvbnMuYnlwYXNzIHx8wqBmYWxzZTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBsZXQgbXNnID0gbnVsbDtcbiAgICBjb25zdCBvcyA9IGNsaWVudC5wbGF0Zm9ybS5vcztcbiAgICBjb25zdCBpc01vYmlsZSA9IGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZTtcblxuICAgIGlmICh0aGlzLl9ieXBhc3MpXG4gICAgICByZXR1cm4gdGhpcy5kb25lKCk7XG5cbiAgICBpZiAoIWF1ZGlvQ29udGV4dCkge1xuICAgICAgaWYgKG9zID09PSAnaW9zJykge1xuICAgICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy5pb3NWZXJzaW9uO1xuICAgICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnKSB7XG4gICAgICAgIG1zZyA9IHRoaXMuX21lc3NhZ2VzLmFuZHJvaWRWZXJzaW9uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbXNnID0gdGhpcy5fbWVzc2FnZXMud3JvbmdPUztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFpc01vYmlsZSB8fCBjbGllbnQucGxhdGZvcm0ub3MgPT09ICdvdGhlcicpIHtcbiAgICAgIG1zZyA9IHRoaXMuX21lc3NhZ2VzLndyb25nT1M7XG4gICAgfSBlbHNlIGlmIChjbGllbnQucGxhdGZvcm0ub3MgPT09ICdpb3MnICYmIHBsYXRmb3JtLm9zLnZlcnNpb24gPCAnNycpIHtcbiAgICAgIG1zZyA9IHRoaXMuX21lc3NhZ2VzLmlvc1ZlcnNpb247XG4gICAgfSBlbHNlIGlmIChjbGllbnQucGxhdGZvcm0ub3MgPT09ICdhbmRyb2lkJyAmJiBwbGF0Zm9ybS5vcy52ZXJzaW9uIDwgJzQuMicpIHtcbiAgICAgIG1zZyA9IHRoaXMuX21lc3NhZ2VzLmFuZHJvaWRWZXJzaW9uO1xuICAgIH1cblxuICAgIGlmIChtc2cgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuc2V0Q2VudGVyZWRWaWV3Q29udGVudCh0aGlzLl9wcmVmaXggKyAnPHA+JyArIG1zZyArICc8L3A+JyArIHRoaXMuX3Bvc3RmaXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9XG4gIH1cblxuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxufVxuIl19