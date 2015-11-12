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

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

/**
 * The {@link ClientOrientation} module allows for calibrating the compass by getting an angle reference.
 * It displays a view with an instruction text: the user is asked to tap the screen when the phone points at the desired direction for the calibration.
 * When that happens, the current compass value is set as the angle reference.
 * The {@link ClientOrientation} module calls its `done` method when the participant taps the screen.
 */

var Orientation = (function (_Module) {
  _inherits(Orientation, _Module);

  /**
   * Creates an instance of the class. Always has a view.
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
     * Value of the `alpha` angle (as in the [`deviceOrientation` HTML5 API](http://www.w3.org/TR/orientation-event/)) when the user touches the screen while the `ClientOrientation` module is displayed.
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
})(_Module3['default']);

exports['default'] = Orientation;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvT3JpZW50YXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztxQkFBa0IsU0FBUzs7Ozt1QkFDUixVQUFVOzs7Ozs7Ozs7OztJQVNSLFdBQVc7WUFBWCxXQUFXOzs7Ozs7Ozs7OztBQVNuQixXQVRRLFdBQVcsR0FTSjs7O1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFUTCxXQUFXOztBQVU1QiwrQkFWaUIsV0FBVyw2Q0FVdEIsT0FBTyxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Ozs7Ozs7QUFPMUQsUUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7O0FBRXhCLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxnRUFBZ0UsQ0FBQzs7O0FBRzlGLHVCQUFNLHVCQUF1QixFQUFFLENBQUM7QUFDaEMsdUJBQU0sRUFBRSxDQUFDLG1CQUFtQixFQUFFLFVBQUMsZUFBZSxFQUFLO0FBQ2pELFlBQUssTUFBTSxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUM7S0FDckMsQ0FBQyxDQUFDO0dBQ0o7Ozs7OztlQTNCa0IsV0FBVzs7V0FnQ3pCLGlCQUFHOzs7QUFDTixpQ0FqQ2lCLFdBQVcsdUNBaUNkO0FBQ2QsVUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDOztBQUV6RCxVQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQ3hDLGVBQUssY0FBYyxHQUFHLE9BQUssTUFBTSxDQUFDO0FBQ2xDLGVBQUssSUFBSSxFQUFFLENBQUM7T0FDYixDQUFDLENBQUM7S0FDSjs7O1NBeENrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiJzcmMvY2xpZW50L09yaWVudGF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGlucHV0IGZyb20gJy4vaW5wdXQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuLyoqXG4gKiBUaGUge0BsaW5rIENsaWVudE9yaWVudGF0aW9ufSBtb2R1bGUgYWxsb3dzIGZvciBjYWxpYnJhdGluZyB0aGUgY29tcGFzcyBieSBnZXR0aW5nIGFuIGFuZ2xlIHJlZmVyZW5jZS5cbiAqIEl0IGRpc3BsYXlzIGEgdmlldyB3aXRoIGFuIGluc3RydWN0aW9uIHRleHQ6IHRoZSB1c2VyIGlzIGFza2VkIHRvIHRhcCB0aGUgc2NyZWVuIHdoZW4gdGhlIHBob25lIHBvaW50cyBhdCB0aGUgZGVzaXJlZCBkaXJlY3Rpb24gZm9yIHRoZSBjYWxpYnJhdGlvbi5cbiAqIFdoZW4gdGhhdCBoYXBwZW5zLCB0aGUgY3VycmVudCBjb21wYXNzIHZhbHVlIGlzIHNldCBhcyB0aGUgYW5nbGUgcmVmZXJlbmNlLlxuICogVGhlIHtAbGluayBDbGllbnRPcmllbnRhdGlvbn0gbW9kdWxlIGNhbGxzIGl0cyBgZG9uZWAgbWV0aG9kIHdoZW4gdGhlIHBhcnRpY2lwYW50IHRhcHMgdGhlIHNjcmVlbi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3JpZW50YXRpb24gZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuIEFsd2F5cyBoYXMgYSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdkaWFsb2cnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy50ZXh0PSdQb2ludCB0aGUgcGhvbmUgZXhhY3RseSBpbiBmcm9udCBvZiB5b3UsIGFuZCB0b3VjaCB0aGUgc2NyZWVuLiddIFRleHQgdG8gYmUgZGlzcGxheWVkIGluIHRoZSBgdmlld2AuXG4gICAqIEB0b2RvIFNvbHZlIHRoZSBzcGFjZSBpbiBkZWZhdWx0IHBhcmFtZXRlciBwcm9ibGVtLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdvcmllbnRhdGlvbicsIHRydWUsIG9wdGlvbnMuY29sb3IpO1xuXG4gICAgLyoqXG4gICAgICogVmFsdWUgb2YgdGhlIGBhbHBoYWAgYW5nbGUgKGFzIGluIHRoZSBbYGRldmljZU9yaWVudGF0aW9uYCBIVE1MNSBBUEldKGh0dHA6Ly93d3cudzMub3JnL1RSL29yaWVudGF0aW9uLWV2ZW50LykpIHdoZW4gdGhlIHVzZXIgdG91Y2hlcyB0aGUgc2NyZWVuIHdoaWxlIHRoZSBgQ2xpZW50T3JpZW50YXRpb25gIG1vZHVsZSBpcyBkaXNwbGF5ZWQuXG4gICAgICogSXQgc2VydmVzIGFzIGEgY2FsaWJyYXRpb24gLyByZWZlcmVuY2Ugb2YgdGhlIGNvbXBhc3MuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmFuZ2xlUmVmZXJlbmNlID0gMDtcblxuICAgIHRoaXMuX2FuZ2xlID0gMDtcbiAgICB0aGlzLl90ZXh0ID0gb3B0aW9ucy50ZXh0IHx8IFwiUG9pbnQgdGhlIHBob25lIGV4YWN0bHkgaW4gZnJvbnQgb2YgeW91LCBhbmQgdG91Y2ggdGhlIHNjcmVlbi5cIjtcblxuICAgIC8vVE9ETzogdXNlIG5ldyBpbnB1dCBtb2R1bGVcbiAgICBpbnB1dC5lbmFibGVEZXZpY2VPcmllbnRhdGlvbigpO1xuICAgIGlucHV0Lm9uKCdkZXZpY2VvcmllbnRhdGlvbicsIChvcmllbnRhdGlvbkRhdGEpID0+IHtcbiAgICAgIHRoaXMuX2FuZ2xlID0gb3JpZW50YXRpb25EYXRhLmFscGhhO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIHRoaXMuc2V0Q2VudGVyZWRWaWV3Q29udGVudCgnPHA+JyArIHRoaXMuX3RleHQgKyAnPC9wPicpO1xuXG4gICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5hbmdsZVJlZmVyZW5jZSA9IHRoaXMuX2FuZ2xlO1xuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==