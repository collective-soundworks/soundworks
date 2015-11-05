'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var input = require('./input');
var ClientModule = require('./ClientModule');
// import ClientModule from './ClientModule.es6.js';

/**
 * The {@link ClientOrientation} module allows for calibrating the compass by getting an angle reference.
 * It displays a view with an instruction text: the user is asked to tap the screen when the phone points at the desired direction for the calibration.
 * When that happens, the current compass value is set as the angle reference.
 * The {@link ClientOrientation} module calls its `done` method when the participant taps the screen.
 */

var ClientOrientation = (function (_ClientModule) {
  _inherits(ClientOrientation, _ClientModule);

  // export default class ClientOrientation extends ClientModule {
  /**
   * Creates an instance of the class. Always has a view.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='dialog'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String} [options.text='Point the phone exactly in front of you, and touch the screen.'] Text to be displayed in the `view`.
   * @todo Solve the space in default parameter problem.
   */

  function ClientOrientation() {
    var _this = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientOrientation);

    _get(Object.getPrototypeOf(ClientOrientation.prototype), 'constructor', this).call(this, options.name || 'orientation', true, options.color);

    /**
     * Value of the `alpha` angle (as in the [`deviceOrientation` HTML5 API](http://www.w3.org/TR/orientation-event/)) when the user touches the screen while the `ClientOrientation` module is displayed.
     * It serves as a calibration / reference of the compass.
     * @type {Number}
     */
    this.angleReference = 0;

    this._angle = 0;
    this._text = options.text || "Point the phone exactly in front of you, and touch the screen.";

    //TODO: use new input module
    input.enableDeviceOrientation();
    input.on('deviceorientation', function (orientationData) {
      _this._angle = orientationData.alpha;
    });
  }

  _createClass(ClientOrientation, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      _get(Object.getPrototypeOf(ClientOrientation.prototype), 'start', this).call(this);
      this.setCenteredViewContent('<p>' + this._text + '</p>');

      this.view.addEventListener('click', function () {
        _this2.angleReference = _this2._angle;
        _this2.done();
      });
    }
  }]);

  return ClientOrientation;
})(ClientModule);

module.exports = ClientOrientation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvT3JpZW50YXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7O0FBRWIsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pDLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7Ozs7Ozs7O0lBU3pDLGlCQUFpQjtZQUFqQixpQkFBaUI7Ozs7Ozs7Ozs7OztBQVVWLFdBVlAsaUJBQWlCLEdBVUs7OztRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBVnBCLGlCQUFpQjs7QUFXbkIsK0JBWEUsaUJBQWlCLDZDQVdiLE9BQU8sQ0FBQyxJQUFJLElBQUksYUFBYSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFOzs7Ozs7O0FBTzFELFFBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDOztBQUV4QixRQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQixRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLElBQUksZ0VBQWdFLENBQUM7OztBQUc5RixTQUFLLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztBQUNoQyxTQUFLLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLFVBQUMsZUFBZSxFQUFLO0FBQ2pELFlBQUssTUFBTSxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUM7S0FDckMsQ0FBQyxDQUFDO0dBQ0o7O2VBNUJHLGlCQUFpQjs7V0E4QmhCLGlCQUFHOzs7QUFDTixpQ0EvQkUsaUJBQWlCLHVDQStCTDtBQUNkLFVBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQzs7QUFFekQsVUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBTTtBQUN4QyxlQUFLLGNBQWMsR0FBRyxPQUFLLE1BQU0sQ0FBQztBQUNsQyxlQUFLLElBQUksRUFBRSxDQUFDO09BQ2IsQ0FBQyxDQUFDO0tBQ0o7OztTQXRDRyxpQkFBaUI7R0FBUyxZQUFZOztBQXlDNUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyIsImZpbGUiOiJzcmMvY2xpZW50L09yaWVudGF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBpbnB1dCA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbmNvbnN0IENsaWVudE1vZHVsZSA9IHJlcXVpcmUoJy4vQ2xpZW50TW9kdWxlJyk7XG4vLyBpbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlLmVzNi5qcyc7XG5cbi8qKlxuICogVGhlIHtAbGluayBDbGllbnRPcmllbnRhdGlvbn0gbW9kdWxlIGFsbG93cyBmb3IgY2FsaWJyYXRpbmcgdGhlIGNvbXBhc3MgYnkgZ2V0dGluZyBhbiBhbmdsZSByZWZlcmVuY2UuXG4gKiBJdCBkaXNwbGF5cyBhIHZpZXcgd2l0aCBhbiBpbnN0cnVjdGlvbiB0ZXh0OiB0aGUgdXNlciBpcyBhc2tlZCB0byB0YXAgdGhlIHNjcmVlbiB3aGVuIHRoZSBwaG9uZSBwb2ludHMgYXQgdGhlIGRlc2lyZWQgZGlyZWN0aW9uIGZvciB0aGUgY2FsaWJyYXRpb24uXG4gKiBXaGVuIHRoYXQgaGFwcGVucywgdGhlIGN1cnJlbnQgY29tcGFzcyB2YWx1ZSBpcyBzZXQgYXMgdGhlIGFuZ2xlIHJlZmVyZW5jZS5cbiAqIFRoZSB7QGxpbmsgQ2xpZW50T3JpZW50YXRpb259IG1vZHVsZSBjYWxscyBpdHMgYGRvbmVgIG1ldGhvZCB3aGVuIHRoZSBwYXJ0aWNpcGFudCB0YXBzIHRoZSBzY3JlZW4uXG4gKi9cbmNsYXNzIENsaWVudE9yaWVudGF0aW9uIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbi8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudE9yaWVudGF0aW9uIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLiBBbHdheXMgaGFzIGEgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nZGlhbG9nJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMudGV4dD0nUG9pbnQgdGhlIHBob25lIGV4YWN0bHkgaW4gZnJvbnQgb2YgeW91LCBhbmQgdG91Y2ggdGhlIHNjcmVlbi4nXSBUZXh0IHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgYHZpZXdgLlxuICAgKiBAdG9kbyBTb2x2ZSB0aGUgc3BhY2UgaW4gZGVmYXVsdCBwYXJhbWV0ZXIgcHJvYmxlbS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnb3JpZW50YXRpb24nLCB0cnVlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIC8qKlxuICAgICAqIFZhbHVlIG9mIHRoZSBgYWxwaGFgIGFuZ2xlIChhcyBpbiB0aGUgW2BkZXZpY2VPcmllbnRhdGlvbmAgSFRNTDUgQVBJXShodHRwOi8vd3d3LnczLm9yZy9UUi9vcmllbnRhdGlvbi1ldmVudC8pKSB3aGVuIHRoZSB1c2VyIHRvdWNoZXMgdGhlIHNjcmVlbiB3aGlsZSB0aGUgYENsaWVudE9yaWVudGF0aW9uYCBtb2R1bGUgaXMgZGlzcGxheWVkLlxuICAgICAqIEl0IHNlcnZlcyBhcyBhIGNhbGlicmF0aW9uIC8gcmVmZXJlbmNlIG9mIHRoZSBjb21wYXNzLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5hbmdsZVJlZmVyZW5jZSA9IDA7XG5cbiAgICB0aGlzLl9hbmdsZSA9IDA7XG4gICAgdGhpcy5fdGV4dCA9IG9wdGlvbnMudGV4dCB8fCBcIlBvaW50IHRoZSBwaG9uZSBleGFjdGx5IGluIGZyb250IG9mIHlvdSwgYW5kIHRvdWNoIHRoZSBzY3JlZW4uXCI7XG5cbiAgICAvL1RPRE86IHVzZSBuZXcgaW5wdXQgbW9kdWxlXG4gICAgaW5wdXQuZW5hYmxlRGV2aWNlT3JpZW50YXRpb24oKTtcbiAgICBpbnB1dC5vbignZGV2aWNlb3JpZW50YXRpb24nLCAob3JpZW50YXRpb25EYXRhKSA9PiB7XG4gICAgICB0aGlzLl9hbmdsZSA9IG9yaWVudGF0aW9uRGF0YS5hbHBoYTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KCc8cD4nICsgdGhpcy5fdGV4dCArICc8L3A+Jyk7XG5cbiAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLmFuZ2xlUmVmZXJlbmNlID0gdGhpcy5fYW5nbGU7XG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENsaWVudE9yaWVudGF0aW9uO1xuIl19