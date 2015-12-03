'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

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
   * @param {String} [options.name='dialog'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String} [options.text='Point the phone exactly in front of you, and touch the screen.'] Text to be displayed in the `view`.
   * @todo Solve the space in default parameter problem.
   */

  function Orientation() {
    var _this = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Orientation);

    _get(Object.getPrototypeOf(Orientation.prototype), 'constructor', this).call(this, options.name || 'orientation', true, options.color);

    /**
     * Value of the `alpha` angle (as in the [`deviceOrientation` HTML5 API](http://www.w3.org/TR/orientation-event/)) when the user touches the screen.
     * It serves as a calibration / reference of the compass.
     * @type {Number}
     */
    this.angleReference = 0;

    this._angle = 0;
    this._text = options.text || "Point the phone exactly in front of you, and touch the screen.";

    //TODO: use new input module
    _input2['default'].enableDeviceOrientation();
    _input2['default'].on('deviceorientation', function (orientationData) {
      _this._angle = orientationData.alpha;
    });
  }

  /**
   * @private
   */

  _createClass(Orientation, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      _get(Object.getPrototypeOf(Orientation.prototype), 'start', this).call(this);
      this.setCenteredViewContent('<p>' + this._text + '</p>');

      this.view.addEventListener('click', function () {
        _this2.angleReference = _this2._angle;
        _this2.done();
      });
    }
  }]);

  return Orientation;
})(_ClientModule3['default']);

exports['default'] = Orientation;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvT3JpZW50YXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztxQkFBa0IsU0FBUzs7Ozs2QkFDRixnQkFBZ0I7Ozs7Ozs7Ozs7Ozs7SUFXcEIsV0FBVztZQUFYLFdBQVc7Ozs7Ozs7Ozs7QUFRbkIsV0FSUSxXQUFXLEdBUUo7OztRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUkwsV0FBVzs7QUFTNUIsK0JBVGlCLFdBQVcsNkNBU3RCLE9BQU8sQ0FBQyxJQUFJLElBQUksYUFBYSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFOzs7Ozs7O0FBTzFELFFBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDOztBQUV4QixRQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQixRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLElBQUksZ0VBQWdFLENBQUM7OztBQUc5Rix1QkFBTSx1QkFBdUIsRUFBRSxDQUFDO0FBQ2hDLHVCQUFNLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxVQUFDLGVBQWUsRUFBSztBQUNqRCxZQUFLLE1BQU0sR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDO0tBQ3JDLENBQUMsQ0FBQztHQUNKOzs7Ozs7ZUExQmtCLFdBQVc7O1dBK0J6QixpQkFBRzs7O0FBQ04saUNBaENpQixXQUFXLHVDQWdDZDtBQUNkLFVBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQzs7QUFFekQsVUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBTTtBQUN4QyxlQUFLLGNBQWMsR0FBRyxPQUFLLE1BQU0sQ0FBQztBQUNsQyxlQUFLLElBQUksRUFBRSxDQUFDO09BQ2IsQ0FBQyxDQUFDO0tBQ0o7OztTQXZDa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoic3JjL2NsaWVudC9PcmllbnRhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpbnB1dCBmcm9tICcuL2lucHV0JztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gQ2FsaWJyYXRlIHRoZSBjb21wYXNzIGJ5IHNldHRpbmcgYW4gYW5nbGUgcmVmZXJlbmNlLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGRpc3BsYXlzIGEgdmlldyB3aXRoIGFuIGluc3RydWN0aW9uIHRleHQ6IHRoZSB1c2VyIGlzIGFza2VkIHRvIHRhcCB0aGUgc2NyZWVuIHdoZW4gdGhlIHBob25lIHBvaW50cyBhdCB0aGUgZGVzaXJlZCBkaXJlY3Rpb24gZm9yIHRoZSBjYWxpYnJhdGlvbi5cbiAqIFdoZW4gdGhlIHVzZXIgdGFwcyB0aGUgc2NyZWVuLCB0aGUgY3VycmVudCBjb21wYXNzIHZhbHVlIGlzIHNldCBhcyB0aGUgYW5nbGUgcmVmZXJlbmNlLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gdGhlIHBhcnRpY2lwYW50IHRhcHMgdGhlIHNjcmVlbiAoYW5kIHRoZSByZWZlcmFuY2UgYW5nbGUgaXMgc2F2ZWQpLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPcmllbnRhdGlvbiBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdkaWFsb2cnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy50ZXh0PSdQb2ludCB0aGUgcGhvbmUgZXhhY3RseSBpbiBmcm9udCBvZiB5b3UsIGFuZCB0b3VjaCB0aGUgc2NyZWVuLiddIFRleHQgdG8gYmUgZGlzcGxheWVkIGluIHRoZSBgdmlld2AuXG4gICAqIEB0b2RvIFNvbHZlIHRoZSBzcGFjZSBpbiBkZWZhdWx0IHBhcmFtZXRlciBwcm9ibGVtLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdvcmllbnRhdGlvbicsIHRydWUsIG9wdGlvbnMuY29sb3IpO1xuXG4gICAgLyoqXG4gICAgICogVmFsdWUgb2YgdGhlIGBhbHBoYWAgYW5nbGUgKGFzIGluIHRoZSBbYGRldmljZU9yaWVudGF0aW9uYCBIVE1MNSBBUEldKGh0dHA6Ly93d3cudzMub3JnL1RSL29yaWVudGF0aW9uLWV2ZW50LykpIHdoZW4gdGhlIHVzZXIgdG91Y2hlcyB0aGUgc2NyZWVuLlxuICAgICAqIEl0IHNlcnZlcyBhcyBhIGNhbGlicmF0aW9uIC8gcmVmZXJlbmNlIG9mIHRoZSBjb21wYXNzLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5hbmdsZVJlZmVyZW5jZSA9IDA7XG5cbiAgICB0aGlzLl9hbmdsZSA9IDA7XG4gICAgdGhpcy5fdGV4dCA9IG9wdGlvbnMudGV4dCB8fCBcIlBvaW50IHRoZSBwaG9uZSBleGFjdGx5IGluIGZyb250IG9mIHlvdSwgYW5kIHRvdWNoIHRoZSBzY3JlZW4uXCI7XG5cbiAgICAvL1RPRE86IHVzZSBuZXcgaW5wdXQgbW9kdWxlXG4gICAgaW5wdXQuZW5hYmxlRGV2aWNlT3JpZW50YXRpb24oKTtcbiAgICBpbnB1dC5vbignZGV2aWNlb3JpZW50YXRpb24nLCAob3JpZW50YXRpb25EYXRhKSA9PiB7XG4gICAgICB0aGlzLl9hbmdsZSA9IG9yaWVudGF0aW9uRGF0YS5hbHBoYTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLnNldENlbnRlcmVkVmlld0NvbnRlbnQoJzxwPicgKyB0aGlzLl90ZXh0ICsgJzwvcD4nKTtcblxuICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMuYW5nbGVSZWZlcmVuY2UgPSB0aGlzLl9hbmdsZTtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=