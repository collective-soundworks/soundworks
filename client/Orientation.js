'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _motionInput = require('motion-input');

var _motionInput2 = _interopRequireDefault(_motionInput);

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

var _displaySegmentedView = require('./display/SegmentedView');

var _displaySegmentedView2 = _interopRequireDefault(_displaySegmentedView);

// https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins

/**
 * [client] Calibrate the compass by setting an angle reference.
 *
 * The module always displays a view with an instruction text: the user is asked to tap the screen when the phone points at the desired direction for the calibration.
 * When the user taps the screen, the current compass value is set as the angle reference.
 *
 * The module finishes its initialization when the participant taps the screen (and the referance angle is saved).
 */

var Orientation = (function (_ClientModule) {
  _inherits(Orientation, _ClientModule);

  /**
   * @param {Object} [options={}] - Options.
   * @param {String} [options.name='orientation'] - Name of the module.
   */

  function Orientation() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Orientation);

    _get(Object.getPrototypeOf(Orientation.prototype), 'constructor', this).call(this, options.name || 'orientation', options);

    this.options = _Object$assign({
      bypass: false,
      viewCtor: _displaySegmentedView2['default']
    }, options);

    this.bypass = options.bypass || false;
    // bind methods
    this._onOrientationChange = this._onOrientationChange.bind(this);
    this._onOrientationSelected = this._onOrientationSelected.bind(this);
    // configure view
    this.viewCtor = this.options.viewCtor;
    this.events = { 'click': this._onOrientationSelected };

    this.init();
  }

  _createClass(Orientation, [{
    key: 'init',
    value: function init() {
      var _this = this;

      if (this.bypass) {
        this.angleReference = 0;
        this.done();
      }

      /**
       * Value of the `alpha` angle (as in the [`deviceOrientation` HTML5 API](http://www.w3.org/TR/orientation-event/)) when the user touches the screen.
       * It serves as a calibration / reference of the compass.
       * @type {Number}
       */
      this.angleReference = 0;

      _motionInput2['default'].init('orientation').then(function (modules) {
        var _modules = _slicedToArray(modules, 1);

        var orientation = _modules[0];

        if (!orientation.isValid) {
          _this.content.error = true;
        }

        // @todo - this should have a waiting state before `motionInput` is ready
        _this.view = _this.createView();
      });
    }

    /** @private */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Orientation.prototype), 'start', this).call(this);

      if (!this.content.error) _motionInput2['default'].addListener('orientation', this._onOrientationChange);
    }

    /** @private */
  }, {
    key: 'stop',
    value: function stop() {
      _motionInput2['default'].removeListener('orientation', this._onOrientationChange);
    }

    /** @private */
  }, {
    key: 'restart',
    value: function restart() {
      // As this module is client side only, nothing has to be done when restarting.
      this.done();
    }
  }, {
    key: '_onOrientationChange',
    value: function _onOrientationChange(data) {
      this.angleReference = data[0];
    }
  }, {
    key: '_onOrientationSelected',
    value: function _onOrientationSelected() {
      this.done();
    }
  }]);

  return Orientation;
})(_ClientModule3['default']);

exports['default'] = Orientation;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L09yaWVudGF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzJCQUF3QixjQUFjOzs7OzZCQUNiLGdCQUFnQjs7OztvQ0FDZix5QkFBeUI7Ozs7Ozs7Ozs7Ozs7OztJQVk5QixXQUFXO1lBQVgsV0FBVzs7Ozs7OztBQUtuQixXQUxRLFdBQVcsR0FLSjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTEwsV0FBVzs7QUFNNUIsK0JBTmlCLFdBQVcsNkNBTXRCLE9BQU8sQ0FBQyxJQUFJLElBQUksYUFBYSxFQUFFLE9BQU8sRUFBRTs7QUFFOUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxlQUFjO0FBQzNCLFlBQU0sRUFBRSxLQUFLO0FBQ2IsY0FBUSxtQ0FBZTtLQUN4QixFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUVaLFFBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUM7O0FBRXRDLFFBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pFLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVyRSxRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQ3RDLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7O0FBRXZELFFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNiOztlQXRCa0IsV0FBVzs7V0F3QjFCLGdCQUFHOzs7QUFDTCxVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixZQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQztBQUN4QixZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDYjs7Ozs7OztBQU9ELFVBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDOztBQUV4QiwrQkFDRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQ25CLElBQUksQ0FBQyxVQUFDLE9BQU8sRUFBSztzQ0FDSyxPQUFPOztZQUF0QixXQUFXOztBQUVsQixZQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRTtBQUN4QixnQkFBSyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUMzQjs7O0FBR0QsY0FBSyxJQUFJLEdBQUcsTUFBSyxVQUFVLEVBQUUsQ0FBQztPQUMvQixDQUFDLENBQUM7S0FDTjs7Ozs7V0FHSSxpQkFBRztBQUNOLGlDQXJEaUIsV0FBVyx1Q0FxRGQ7O0FBRWQsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUNyQix5QkFBWSxXQUFXLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0tBQ3JFOzs7OztXQUdHLGdCQUFHO0FBQ0wsK0JBQVksY0FBYyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztLQUN0RTs7Ozs7V0FHTSxtQkFBRzs7QUFFUixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1dBRW1CLDhCQUFDLElBQUksRUFBRTtBQUN6QixVQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvQjs7O1dBRXFCLGtDQUFHO0FBQ3ZCLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7U0E1RWtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L09yaWVudGF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vdGlvbklucHV0IGZyb20gJ21vdGlvbi1pbnB1dCc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcblxuLy8gaHR0cHM6Ly9zaXRlcy5nb29nbGUuY29tL2EvY2hyb21pdW0ub3JnL2Rldi9Ib21lL2Nocm9taXVtLXNlY3VyaXR5L2RlcHJlY2F0aW5nLXBvd2VyZnVsLWZlYXR1cmVzLW9uLWluc2VjdXJlLW9yaWdpbnNcblxuLyoqXG4gKiBbY2xpZW50XSBDYWxpYnJhdGUgdGhlIGNvbXBhc3MgYnkgc2V0dGluZyBhbiBhbmdsZSByZWZlcmVuY2UuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgZGlzcGxheXMgYSB2aWV3IHdpdGggYW4gaW5zdHJ1Y3Rpb24gdGV4dDogdGhlIHVzZXIgaXMgYXNrZWQgdG8gdGFwIHRoZSBzY3JlZW4gd2hlbiB0aGUgcGhvbmUgcG9pbnRzIGF0IHRoZSBkZXNpcmVkIGRpcmVjdGlvbiBmb3IgdGhlIGNhbGlicmF0aW9uLlxuICogV2hlbiB0aGUgdXNlciB0YXBzIHRoZSBzY3JlZW4sIHRoZSBjdXJyZW50IGNvbXBhc3MgdmFsdWUgaXMgc2V0IGFzIHRoZSBhbmdsZSByZWZlcmVuY2UuXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gd2hlbiB0aGUgcGFydGljaXBhbnQgdGFwcyB0aGUgc2NyZWVuIChhbmQgdGhlIHJlZmVyYW5jZSBhbmdsZSBpcyBzYXZlZCkuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9yaWVudGF0aW9uIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nb3JpZW50YXRpb24nXSAtIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnb3JpZW50YXRpb24nLCBvcHRpb25zKTtcblxuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgYnlwYXNzOiBmYWxzZSxcbiAgICAgIHZpZXdDdG9yOiBTZWdtZW50ZWRWaWV3LFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5ieXBhc3MgPSBvcHRpb25zLmJ5cGFzcyB8fMKgZmFsc2U7XG4gICAgLy8gYmluZCBtZXRob2RzXG4gICAgdGhpcy5fb25PcmllbnRhdGlvbkNoYW5nZSA9IHRoaXMuX29uT3JpZW50YXRpb25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbk9yaWVudGF0aW9uU2VsZWN0ZWQgPSB0aGlzLl9vbk9yaWVudGF0aW9uU2VsZWN0ZWQuYmluZCh0aGlzKTtcbiAgICAvLyBjb25maWd1cmUgdmlld1xuICAgIHRoaXMudmlld0N0b3IgPSB0aGlzLm9wdGlvbnMudmlld0N0b3I7XG4gICAgdGhpcy5ldmVudHMgPSB7ICdjbGljayc6IHRoaXMuX29uT3JpZW50YXRpb25TZWxlY3RlZCB9O1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICh0aGlzLmJ5cGFzcykge1xuICAgICAgdGhpcy5hbmdsZVJlZmVyZW5jZSA9IDA7XG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWYWx1ZSBvZiB0aGUgYGFscGhhYCBhbmdsZSAoYXMgaW4gdGhlIFtgZGV2aWNlT3JpZW50YXRpb25gIEhUTUw1IEFQSV0oaHR0cDovL3d3dy53My5vcmcvVFIvb3JpZW50YXRpb24tZXZlbnQvKSkgd2hlbiB0aGUgdXNlciB0b3VjaGVzIHRoZSBzY3JlZW4uXG4gICAgICogSXQgc2VydmVzIGFzIGEgY2FsaWJyYXRpb24gLyByZWZlcmVuY2Ugb2YgdGhlIGNvbXBhc3MuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmFuZ2xlUmVmZXJlbmNlID0gMDtcblxuICAgIG1vdGlvbklucHV0XG4gICAgICAuaW5pdCgnb3JpZW50YXRpb24nKVxuICAgICAgLnRoZW4oKG1vZHVsZXMpID0+IHtcbiAgICAgICAgY29uc3QgW29yaWVudGF0aW9uXSA9IG1vZHVsZXM7XG5cbiAgICAgICAgaWYgKCFvcmllbnRhdGlvbi5pc1ZhbGlkKSB7XG4gICAgICAgICAgdGhpcy5jb250ZW50LmVycm9yID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEB0b2RvIC0gdGhpcyBzaG91bGQgaGF2ZSBhIHdhaXRpbmcgc3RhdGUgYmVmb3JlIGBtb3Rpb25JbnB1dGAgaXMgcmVhZHlcbiAgICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmNvbnRlbnQuZXJyb3IpXG4gICAgICBtb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcignb3JpZW50YXRpb24nLCB0aGlzLl9vbk9yaWVudGF0aW9uQ2hhbmdlKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIG1vdGlvbklucHV0LnJlbW92ZUxpc3RlbmVyKCdvcmllbnRhdGlvbicsIHRoaXMuX29uT3JpZW50YXRpb25DaGFuZ2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlc3RhcnQoKSB7XG4gICAgLy8gQXMgdGhpcyBtb2R1bGUgaXMgY2xpZW50IHNpZGUgb25seSwgbm90aGluZyBoYXMgdG8gYmUgZG9uZSB3aGVuIHJlc3RhcnRpbmcuXG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICBfb25PcmllbnRhdGlvbkNoYW5nZShkYXRhKSB7XG4gICAgdGhpcy5hbmdsZVJlZmVyZW5jZSA9IGRhdGFbMF07XG4gIH1cblxuICBfb25PcmllbnRhdGlvblNlbGVjdGVkKCkge1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG59XG4iXX0=