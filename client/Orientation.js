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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3FCQUFrQixTQUFTOzs7OzZCQUNGLGdCQUFnQjs7Ozs7Ozs7Ozs7OztJQVdwQixXQUFXO1lBQVgsV0FBVzs7Ozs7Ozs7OztBQVFuQixXQVJRLFdBQVcsR0FRSjs7O1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFSTCxXQUFXOztBQVM1QiwrQkFUaUIsV0FBVyw2Q0FTdEIsT0FBTyxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Ozs7Ozs7QUFPMUQsUUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7O0FBRXhCLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxnRUFBZ0UsQ0FBQzs7O0FBRzlGLHVCQUFNLHVCQUF1QixFQUFFLENBQUM7QUFDaEMsdUJBQU0sRUFBRSxDQUFDLG1CQUFtQixFQUFFLFVBQUMsZUFBZSxFQUFLO0FBQ2pELFlBQUssTUFBTSxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUM7S0FDckMsQ0FBQyxDQUFDO0dBQ0o7Ozs7OztlQTFCa0IsV0FBVzs7V0ErQnpCLGlCQUFHOzs7QUFDTixpQ0FoQ2lCLFdBQVcsdUNBZ0NkO0FBQ2QsVUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDOztBQUV6RCxVQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQ3hDLGVBQUssY0FBYyxHQUFHLE9BQUssTUFBTSxDQUFDO0FBQ2xDLGVBQUssSUFBSSxFQUFFLENBQUM7T0FDYixDQUFDLENBQUM7S0FDSjs7O1NBdkNrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudENoZWNraW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW5wdXQgZnJvbSAnLi9pbnB1dCc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcblxuXG4vKipcbiAqIFtjbGllbnRdIENhbGlicmF0ZSB0aGUgY29tcGFzcyBieSBzZXR0aW5nIGFuIGFuZ2xlIHJlZmVyZW5jZS5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBkaXNwbGF5cyBhIHZpZXcgd2l0aCBhbiBpbnN0cnVjdGlvbiB0ZXh0OiB0aGUgdXNlciBpcyBhc2tlZCB0byB0YXAgdGhlIHNjcmVlbiB3aGVuIHRoZSBwaG9uZSBwb2ludHMgYXQgdGhlIGRlc2lyZWQgZGlyZWN0aW9uIGZvciB0aGUgY2FsaWJyYXRpb24uXG4gKiBXaGVuIHRoZSB1c2VyIHRhcHMgdGhlIHNjcmVlbiwgdGhlIGN1cnJlbnQgY29tcGFzcyB2YWx1ZSBpcyBzZXQgYXMgdGhlIGFuZ2xlIHJlZmVyZW5jZS5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIHRoZSBwYXJ0aWNpcGFudCB0YXBzIHRoZSBzY3JlZW4gKGFuZCB0aGUgcmVmZXJhbmNlIGFuZ2xlIGlzIHNhdmVkKS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3JpZW50YXRpb24gZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nZGlhbG9nJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMudGV4dD0nUG9pbnQgdGhlIHBob25lIGV4YWN0bHkgaW4gZnJvbnQgb2YgeW91LCBhbmQgdG91Y2ggdGhlIHNjcmVlbi4nXSBUZXh0IHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgYHZpZXdgLlxuICAgKiBAdG9kbyBTb2x2ZSB0aGUgc3BhY2UgaW4gZGVmYXVsdCBwYXJhbWV0ZXIgcHJvYmxlbS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnb3JpZW50YXRpb24nLCB0cnVlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIC8qKlxuICAgICAqIFZhbHVlIG9mIHRoZSBgYWxwaGFgIGFuZ2xlIChhcyBpbiB0aGUgW2BkZXZpY2VPcmllbnRhdGlvbmAgSFRNTDUgQVBJXShodHRwOi8vd3d3LnczLm9yZy9UUi9vcmllbnRhdGlvbi1ldmVudC8pKSB3aGVuIHRoZSB1c2VyIHRvdWNoZXMgdGhlIHNjcmVlbi5cbiAgICAgKiBJdCBzZXJ2ZXMgYXMgYSBjYWxpYnJhdGlvbiAvIHJlZmVyZW5jZSBvZiB0aGUgY29tcGFzcy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuYW5nbGVSZWZlcmVuY2UgPSAwO1xuXG4gICAgdGhpcy5fYW5nbGUgPSAwO1xuICAgIHRoaXMuX3RleHQgPSBvcHRpb25zLnRleHQgfHwgXCJQb2ludCB0aGUgcGhvbmUgZXhhY3RseSBpbiBmcm9udCBvZiB5b3UsIGFuZCB0b3VjaCB0aGUgc2NyZWVuLlwiO1xuXG4gICAgLy9UT0RPOiB1c2UgbmV3IGlucHV0IG1vZHVsZVxuICAgIGlucHV0LmVuYWJsZURldmljZU9yaWVudGF0aW9uKCk7XG4gICAgaW5wdXQub24oJ2RldmljZW9yaWVudGF0aW9uJywgKG9yaWVudGF0aW9uRGF0YSkgPT4ge1xuICAgICAgdGhpcy5fYW5nbGUgPSBvcmllbnRhdGlvbkRhdGEuYWxwaGE7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KCc8cD4nICsgdGhpcy5fdGV4dCArICc8L3A+Jyk7XG5cbiAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLmFuZ2xlUmVmZXJlbmNlID0gdGhpcy5fYW5nbGU7XG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9KTtcbiAgfVxufVxuIl19