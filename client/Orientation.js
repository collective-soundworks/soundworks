// import input from './input';
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

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
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='orientation'] Name of the module.
   * @todo Solve the space in default parameter problem. (??)
   */

  function Orientation() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Orientation);

    _get(Object.getPrototypeOf(Orientation.prototype), 'constructor', this).call(this, options.name || 'orientation', options);

    this.bypass = options.bypass || false;
    // @todo - use new input module
    // input.enableDeviceOrientation();
    // bind methods
    this._onOrientationChange = this._onOrientationChange.bind(this);
    this._onClick = this._onClick.bind(this);
    // configure view
    this.viewCtor = options.viewCtor || _displaySegmentedView2['default'];
    this.events = { 'click': this._onClick };

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
      this.angleReference = 0; // @todo - where is this value saved ?
      this._angle = 0; // @todo - is this really needed ?

      _motionInput2['default'].init('orientation').then(function (modules) {
        var _modules = _slicedToArray(modules, 1);

        var orientation = _modules[0];

        if (!orientation.isValid) {
          _this.content.error = true;
        }

        _this.view = _this.createView();
      });
    }

    /**
     * @private
     */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Orientation.prototype), 'start', this).call(this);
      // input.on('deviceorientation', this._onOrientationChange);
      if (!this.content.error) {
        _motionInput2['default'].addListener('orientation', this._onOrientationChange);
      }
    }
  }, {
    key: '_onOrientationChange',
    value: function _onOrientationChange(orientationData) {
      this._angle = orientationData.alpha;
    }
  }, {
    key: '_onClick',
    value: function _onClick() {
      this.angleReference = this._angle;
      console.log(this.angleReference);
      // stop listening for device orientation when done
      _motionInput2['default'].removeListener('orientation', this._onOrientationChange);
      this.done();
    }
  }]);

  return Orientation;
})(_ClientModule3['default']);

exports['default'] = Orientation;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvT3JpZW50YXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQkFDd0IsY0FBYzs7Ozs2QkFDYixnQkFBZ0I7Ozs7b0NBQ2YseUJBQXlCOzs7Ozs7Ozs7Ozs7Ozs7SUFZOUIsV0FBVztZQUFYLFdBQVc7Ozs7Ozs7O0FBTW5CLFdBTlEsV0FBVyxHQU1KO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFOTCxXQUFXOztBQU81QiwrQkFQaUIsV0FBVyw2Q0FPdEIsT0FBTyxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUUsT0FBTyxFQUFFOztBQUU5QyxRQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDOzs7O0FBSXRDLFFBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pFLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXpDLFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEscUNBQWlCLENBQUM7QUFDbEQsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7O0FBRXpDLFFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNiOztlQXBCa0IsV0FBVzs7V0FzQjFCLGdCQUFHOzs7QUFDTCxVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixZQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQztBQUN4QixZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDYjs7Ozs7OztBQU9ELFVBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLFVBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUVoQiwrQkFDRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQ25CLElBQUksQ0FBQyxVQUFDLE9BQU8sRUFBSztzQ0FDSyxPQUFPOztZQUF0QixXQUFXOztBQUVsQixZQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRTtBQUN4QixnQkFBSyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUMzQjs7QUFFRCxjQUFLLElBQUksR0FBRyxNQUFLLFVBQVUsRUFBRSxDQUFDO09BQy9CLENBQUMsQ0FBQztLQUNOOzs7Ozs7O1dBS0ksaUJBQUc7QUFDTixpQ0FyRGlCLFdBQVcsdUNBcURkOztBQUVkLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtBQUN2QixpQ0FBWSxXQUFXLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO09BQ25FO0tBQ0Y7OztXQUVtQiw4QkFBQyxlQUFlLEVBQUU7QUFDcEMsVUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDO0tBQ3JDOzs7V0FFTyxvQkFBRztBQUNULFVBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNsQyxhQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFakMsK0JBQVksY0FBYyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNyRSxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1NBdEVrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiJzcmMvY2xpZW50L09yaWVudGF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IGlucHV0IGZyb20gJy4vaW5wdXQnO1xuaW1wb3J0IG1vdGlvbklucHV0IGZyb20gJ21vdGlvbi1pbnB1dCc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcblxuLy8gaHR0cHM6Ly9zaXRlcy5nb29nbGUuY29tL2EvY2hyb21pdW0ub3JnL2Rldi9Ib21lL2Nocm9taXVtLXNlY3VyaXR5L2RlcHJlY2F0aW5nLXBvd2VyZnVsLWZlYXR1cmVzLW9uLWluc2VjdXJlLW9yaWdpbnNcblxuLyoqXG4gKiBbY2xpZW50XSBDYWxpYnJhdGUgdGhlIGNvbXBhc3MgYnkgc2V0dGluZyBhbiBhbmdsZSByZWZlcmVuY2UuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgZGlzcGxheXMgYSB2aWV3IHdpdGggYW4gaW5zdHJ1Y3Rpb24gdGV4dDogdGhlIHVzZXIgaXMgYXNrZWQgdG8gdGFwIHRoZSBzY3JlZW4gd2hlbiB0aGUgcGhvbmUgcG9pbnRzIGF0IHRoZSBkZXNpcmVkIGRpcmVjdGlvbiBmb3IgdGhlIGNhbGlicmF0aW9uLlxuICogV2hlbiB0aGUgdXNlciB0YXBzIHRoZSBzY3JlZW4sIHRoZSBjdXJyZW50IGNvbXBhc3MgdmFsdWUgaXMgc2V0IGFzIHRoZSBhbmdsZSByZWZlcmVuY2UuXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gd2hlbiB0aGUgcGFydGljaXBhbnQgdGFwcyB0aGUgc2NyZWVuIChhbmQgdGhlIHJlZmVyYW5jZSBhbmdsZSBpcyBzYXZlZCkuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9yaWVudGF0aW9uIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J29yaWVudGF0aW9uJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAdG9kbyBTb2x2ZSB0aGUgc3BhY2UgaW4gZGVmYXVsdCBwYXJhbWV0ZXIgcHJvYmxlbS4gKD8/KVxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdvcmllbnRhdGlvbicsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5ieXBhc3MgPSBvcHRpb25zLmJ5cGFzcyB8fMKgZmFsc2U7XG4gICAgLy8gQHRvZG8gLSB1c2UgbmV3IGlucHV0IG1vZHVsZVxuICAgIC8vIGlucHV0LmVuYWJsZURldmljZU9yaWVudGF0aW9uKCk7XG4gICAgLy8gYmluZCBtZXRob2RzXG4gICAgdGhpcy5fb25PcmllbnRhdGlvbkNoYW5nZSA9IHRoaXMuX29uT3JpZW50YXRpb25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNsaWNrID0gdGhpcy5fb25DbGljay5iaW5kKHRoaXMpO1xuICAgIC8vIGNvbmZpZ3VyZSB2aWV3XG4gICAgdGhpcy52aWV3Q3RvciA9IG9wdGlvbnMudmlld0N0b3IgfHzCoFNlZ21lbnRlZFZpZXc7XG4gICAgdGhpcy5ldmVudHMgPSB7ICdjbGljayc6IHRoaXMuX29uQ2xpY2sgfTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAodGhpcy5ieXBhc3MpIHtcbiAgICAgIHRoaXMuYW5nbGVSZWZlcmVuY2UgPSAwO1xuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmFsdWUgb2YgdGhlIGBhbHBoYWAgYW5nbGUgKGFzIGluIHRoZSBbYGRldmljZU9yaWVudGF0aW9uYCBIVE1MNSBBUEldKGh0dHA6Ly93d3cudzMub3JnL1RSL29yaWVudGF0aW9uLWV2ZW50LykpIHdoZW4gdGhlIHVzZXIgdG91Y2hlcyB0aGUgc2NyZWVuLlxuICAgICAqIEl0IHNlcnZlcyBhcyBhIGNhbGlicmF0aW9uIC8gcmVmZXJlbmNlIG9mIHRoZSBjb21wYXNzLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5hbmdsZVJlZmVyZW5jZSA9IDA7IC8vIEB0b2RvIC0gd2hlcmUgaXMgdGhpcyB2YWx1ZSBzYXZlZCA/XG4gICAgdGhpcy5fYW5nbGUgPSAwOyAvLyBAdG9kbyAtIGlzIHRoaXMgcmVhbGx5IG5lZWRlZCA/XG5cbiAgICBtb3Rpb25JbnB1dFxuICAgICAgLmluaXQoJ29yaWVudGF0aW9uJylcbiAgICAgIC50aGVuKChtb2R1bGVzKSA9PiB7XG4gICAgICAgIGNvbnN0IFtvcmllbnRhdGlvbl0gPSBtb2R1bGVzO1xuXG4gICAgICAgIGlmICghb3JpZW50YXRpb24uaXNWYWxpZCkge1xuICAgICAgICAgIHRoaXMuY29udGVudC5lcnJvciA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIC8vIGlucHV0Lm9uKCdkZXZpY2VvcmllbnRhdGlvbicsIHRoaXMuX29uT3JpZW50YXRpb25DaGFuZ2UpO1xuICAgIGlmICghdGhpcy5jb250ZW50LmVycm9yKSB7XG4gICAgICBtb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcignb3JpZW50YXRpb24nLCB0aGlzLl9vbk9yaWVudGF0aW9uQ2hhbmdlKTtcbiAgICB9XG4gIH1cblxuICBfb25PcmllbnRhdGlvbkNoYW5nZShvcmllbnRhdGlvbkRhdGEpIHtcbiAgICB0aGlzLl9hbmdsZSA9IG9yaWVudGF0aW9uRGF0YS5hbHBoYTtcbiAgfVxuXG4gIF9vbkNsaWNrKCkge1xuICAgIHRoaXMuYW5nbGVSZWZlcmVuY2UgPSB0aGlzLl9hbmdsZTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmFuZ2xlUmVmZXJlbmNlKTtcbiAgICAvLyBzdG9wIGxpc3RlbmluZyBmb3IgZGV2aWNlIG9yaWVudGF0aW9uIHdoZW4gZG9uZVxuICAgIG1vdGlvbklucHV0LnJlbW92ZUxpc3RlbmVyKCdvcmllbnRhdGlvbicsIHRoaXMuX29uT3JpZW50YXRpb25DaGFuZ2UpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG59XG4iXX0=