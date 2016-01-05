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

var _displaySegmentedView = require('./display/SegmentedView');

var _displaySegmentedView2 = _interopRequireDefault(_displaySegmentedView);

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
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Orientation);

    _get(Object.getPrototypeOf(Orientation.prototype), 'constructor', this).call(this, options.name || 'orientation', options);

    // @todo - use new input module
    _input2['default'].enableDeviceOrientation();
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
      /**
       * Value of the `alpha` angle (as in the [`deviceOrientation` HTML5 API](http://www.w3.org/TR/orientation-event/)) when the user touches the screen.
       * It serves as a calibration / reference of the compass.
       * @type {Number}
       */
      this.angleReference = 0; // @todo - where is this value saved ?
      this._angle = 0; // @todo - is this really needed ?

      this.view = this.createView();
      console.log(this.view);
    }

    /**
     * @private
     */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Orientation.prototype), 'start', this).call(this);
      _input2['default'].on('deviceorientation', this._onOrientationChange);
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
      // stop listening for device orientation when done
      _input2['default'].removeListener('deviceorientation', this._onOrientationChange);
      this.done();
    }
  }]);

  return Orientation;
})(_ClientModule3['default']);

exports['default'] = Orientation;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvT3JpZW50YXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztxQkFBa0IsU0FBUzs7Ozs2QkFDRixnQkFBZ0I7Ozs7b0NBQ2YseUJBQXlCOzs7Ozs7Ozs7Ozs7O0lBVzlCLFdBQVc7WUFBWCxXQUFXOzs7Ozs7Ozs7O0FBUW5CLFdBUlEsV0FBVyxHQVFKO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFSTCxXQUFXOztBQVM1QiwrQkFUaUIsV0FBVyw2Q0FTdEIsT0FBTyxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUUsT0FBTyxFQUFFOzs7QUFHOUMsdUJBQU0sdUJBQXVCLEVBQUUsQ0FBQzs7QUFFaEMsUUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakUsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFekMsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxxQ0FBaUIsQ0FBQztBQUNsRCxRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7QUFFekMsUUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ2I7O2VBckJrQixXQUFXOztXQXVCMUIsZ0JBQUc7Ozs7OztBQU1MLFVBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLFVBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUVoQixVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUM5QixhQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4Qjs7Ozs7OztXQUtJLGlCQUFHO0FBQ04saUNBeENpQixXQUFXLHVDQXdDZDtBQUNkLHlCQUFNLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztLQUMxRDs7O1dBRW1CLDhCQUFDLGVBQWUsRUFBRTtBQUNwQyxVQUFJLENBQUMsTUFBTSxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUM7S0FDckM7OztXQUVPLG9CQUFHO0FBQ1QsVUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUVsQyx5QkFBTSxjQUFjLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDckUsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztTQXJEa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoic3JjL2NsaWVudC9PcmllbnRhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpbnB1dCBmcm9tICcuL2lucHV0JztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NlZ21lbnRlZFZpZXcnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gQ2FsaWJyYXRlIHRoZSBjb21wYXNzIGJ5IHNldHRpbmcgYW4gYW5nbGUgcmVmZXJlbmNlLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGRpc3BsYXlzIGEgdmlldyB3aXRoIGFuIGluc3RydWN0aW9uIHRleHQ6IHRoZSB1c2VyIGlzIGFza2VkIHRvIHRhcCB0aGUgc2NyZWVuIHdoZW4gdGhlIHBob25lIHBvaW50cyBhdCB0aGUgZGVzaXJlZCBkaXJlY3Rpb24gZm9yIHRoZSBjYWxpYnJhdGlvbi5cbiAqIFdoZW4gdGhlIHVzZXIgdGFwcyB0aGUgc2NyZWVuLCB0aGUgY3VycmVudCBjb21wYXNzIHZhbHVlIGlzIHNldCBhcyB0aGUgYW5nbGUgcmVmZXJlbmNlLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gdGhlIHBhcnRpY2lwYW50IHRhcHMgdGhlIHNjcmVlbiAoYW5kIHRoZSByZWZlcmFuY2UgYW5nbGUgaXMgc2F2ZWQpLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPcmllbnRhdGlvbiBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdkaWFsb2cnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy50ZXh0PSdQb2ludCB0aGUgcGhvbmUgZXhhY3RseSBpbiBmcm9udCBvZiB5b3UsIGFuZCB0b3VjaCB0aGUgc2NyZWVuLiddIFRleHQgdG8gYmUgZGlzcGxheWVkIGluIHRoZSBgdmlld2AuXG4gICAqIEB0b2RvIFNvbHZlIHRoZSBzcGFjZSBpbiBkZWZhdWx0IHBhcmFtZXRlciBwcm9ibGVtLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdvcmllbnRhdGlvbicsIG9wdGlvbnMpO1xuXG4gICAgLy8gQHRvZG8gLSB1c2UgbmV3IGlucHV0IG1vZHVsZVxuICAgIGlucHV0LmVuYWJsZURldmljZU9yaWVudGF0aW9uKCk7XG4gICAgLy8gYmluZCBtZXRob2RzXG4gICAgdGhpcy5fb25PcmllbnRhdGlvbkNoYW5nZSA9IHRoaXMuX29uT3JpZW50YXRpb25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNsaWNrID0gdGhpcy5fb25DbGljay5iaW5kKHRoaXMpO1xuICAgIC8vIGNvbmZpZ3VyZSB2aWV3XG4gICAgdGhpcy52aWV3Q3RvciA9IG9wdGlvbnMudmlld0N0b3IgfHzCoFNlZ21lbnRlZFZpZXc7XG4gICAgdGhpcy5ldmVudHMgPSB7ICdjbGljayc6IHRoaXMuX29uQ2xpY2sgfTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBWYWx1ZSBvZiB0aGUgYGFscGhhYCBhbmdsZSAoYXMgaW4gdGhlIFtgZGV2aWNlT3JpZW50YXRpb25gIEhUTUw1IEFQSV0oaHR0cDovL3d3dy53My5vcmcvVFIvb3JpZW50YXRpb24tZXZlbnQvKSkgd2hlbiB0aGUgdXNlciB0b3VjaGVzIHRoZSBzY3JlZW4uXG4gICAgICogSXQgc2VydmVzIGFzIGEgY2FsaWJyYXRpb24gLyByZWZlcmVuY2Ugb2YgdGhlIGNvbXBhc3MuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmFuZ2xlUmVmZXJlbmNlID0gMDsgLy8gQHRvZG8gLSB3aGVyZSBpcyB0aGlzIHZhbHVlIHNhdmVkID9cbiAgICB0aGlzLl9hbmdsZSA9IDA7IC8vIEB0b2RvIC0gaXMgdGhpcyByZWFsbHkgbmVlZGVkID9cblxuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMudmlldyk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgaW5wdXQub24oJ2RldmljZW9yaWVudGF0aW9uJywgdGhpcy5fb25PcmllbnRhdGlvbkNoYW5nZSk7XG4gIH1cblxuICBfb25PcmllbnRhdGlvbkNoYW5nZShvcmllbnRhdGlvbkRhdGEpIHtcbiAgICB0aGlzLl9hbmdsZSA9IG9yaWVudGF0aW9uRGF0YS5hbHBoYTtcbiAgfVxuXG4gIF9vbkNsaWNrKCkge1xuICAgIHRoaXMuYW5nbGVSZWZlcmVuY2UgPSB0aGlzLl9hbmdsZTtcbiAgICAvLyBzdG9wIGxpc3RlbmluZyBmb3IgZGV2aWNlIG9yaWVudGF0aW9uIHdoZW4gZG9uZVxuICAgIGlucHV0LnJlbW92ZUxpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIHRoaXMuX29uT3JpZW50YXRpb25DaGFuZ2UpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG59XG4iXX0=