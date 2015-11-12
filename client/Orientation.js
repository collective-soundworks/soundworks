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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvT3JpZW50YXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztxQkFBa0IsU0FBUzs7Ozt1QkFDUixVQUFVOzs7Ozs7Ozs7OztJQVNSLFdBQVc7WUFBWCxXQUFXOzs7Ozs7Ozs7OztBQVNuQixXQVRRLFdBQVcsR0FTSjs7O1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFUTCxXQUFXOztBQVU1QiwrQkFWaUIsV0FBVyw2Q0FVdEIsT0FBTyxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Ozs7Ozs7QUFPMUQsUUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7O0FBRXhCLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxnRUFBZ0UsQ0FBQzs7O0FBRzlGLHVCQUFNLHVCQUF1QixFQUFFLENBQUM7QUFDaEMsdUJBQU0sRUFBRSxDQUFDLG1CQUFtQixFQUFFLFVBQUMsZUFBZSxFQUFLO0FBQ2pELFlBQUssTUFBTSxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUM7S0FDckMsQ0FBQyxDQUFDO0dBQ0o7O2VBM0JrQixXQUFXOztXQTZCekIsaUJBQUc7OztBQUNOLGlDQTlCaUIsV0FBVyx1Q0E4QmQ7QUFDZCxVQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUM7O0FBRXpELFVBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQU07QUFDeEMsZUFBSyxjQUFjLEdBQUcsT0FBSyxNQUFNLENBQUM7QUFDbEMsZUFBSyxJQUFJLEVBQUUsQ0FBQztPQUNiLENBQUMsQ0FBQztLQUNKOzs7U0FyQ2tCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6InNyYy9jbGllbnQvT3JpZW50YXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW5wdXQgZnJvbSAnLi9pbnB1dCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG4vKipcbiAqIFRoZSB7QGxpbmsgQ2xpZW50T3JpZW50YXRpb259IG1vZHVsZSBhbGxvd3MgZm9yIGNhbGlicmF0aW5nIHRoZSBjb21wYXNzIGJ5IGdldHRpbmcgYW4gYW5nbGUgcmVmZXJlbmNlLlxuICogSXQgZGlzcGxheXMgYSB2aWV3IHdpdGggYW4gaW5zdHJ1Y3Rpb24gdGV4dDogdGhlIHVzZXIgaXMgYXNrZWQgdG8gdGFwIHRoZSBzY3JlZW4gd2hlbiB0aGUgcGhvbmUgcG9pbnRzIGF0IHRoZSBkZXNpcmVkIGRpcmVjdGlvbiBmb3IgdGhlIGNhbGlicmF0aW9uLlxuICogV2hlbiB0aGF0IGhhcHBlbnMsIHRoZSBjdXJyZW50IGNvbXBhc3MgdmFsdWUgaXMgc2V0IGFzIHRoZSBhbmdsZSByZWZlcmVuY2UuXG4gKiBUaGUge0BsaW5rIENsaWVudE9yaWVudGF0aW9ufSBtb2R1bGUgY2FsbHMgaXRzIGBkb25lYCBtZXRob2Qgd2hlbiB0aGUgcGFydGljaXBhbnQgdGFwcyB0aGUgc2NyZWVuLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPcmllbnRhdGlvbiBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy4gQWx3YXlzIGhhcyBhIHZpZXcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J2RpYWxvZyddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnRleHQ9J1BvaW50IHRoZSBwaG9uZSBleGFjdGx5IGluIGZyb250IG9mIHlvdSwgYW5kIHRvdWNoIHRoZSBzY3JlZW4uJ10gVGV4dCB0byBiZSBkaXNwbGF5ZWQgaW4gdGhlIGB2aWV3YC5cbiAgICogQHRvZG8gU29sdmUgdGhlIHNwYWNlIGluIGRlZmF1bHQgcGFyYW1ldGVyIHByb2JsZW0uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ29yaWVudGF0aW9uJywgdHJ1ZSwgb3B0aW9ucy5jb2xvcik7XG5cbiAgICAvKipcbiAgICAgKiBWYWx1ZSBvZiB0aGUgYGFscGhhYCBhbmdsZSAoYXMgaW4gdGhlIFtgZGV2aWNlT3JpZW50YXRpb25gIEhUTUw1IEFQSV0oaHR0cDovL3d3dy53My5vcmcvVFIvb3JpZW50YXRpb24tZXZlbnQvKSkgd2hlbiB0aGUgdXNlciB0b3VjaGVzIHRoZSBzY3JlZW4gd2hpbGUgdGhlIGBDbGllbnRPcmllbnRhdGlvbmAgbW9kdWxlIGlzIGRpc3BsYXllZC5cbiAgICAgKiBJdCBzZXJ2ZXMgYXMgYSBjYWxpYnJhdGlvbiAvIHJlZmVyZW5jZSBvZiB0aGUgY29tcGFzcy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuYW5nbGVSZWZlcmVuY2UgPSAwO1xuXG4gICAgdGhpcy5fYW5nbGUgPSAwO1xuICAgIHRoaXMuX3RleHQgPSBvcHRpb25zLnRleHQgfHwgXCJQb2ludCB0aGUgcGhvbmUgZXhhY3RseSBpbiBmcm9udCBvZiB5b3UsIGFuZCB0b3VjaCB0aGUgc2NyZWVuLlwiO1xuXG4gICAgLy9UT0RPOiB1c2UgbmV3IGlucHV0IG1vZHVsZVxuICAgIGlucHV0LmVuYWJsZURldmljZU9yaWVudGF0aW9uKCk7XG4gICAgaW5wdXQub24oJ2RldmljZW9yaWVudGF0aW9uJywgKG9yaWVudGF0aW9uRGF0YSkgPT4ge1xuICAgICAgdGhpcy5fYW5nbGUgPSBvcmllbnRhdGlvbkRhdGEuYWxwaGE7XG4gICAgfSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIHRoaXMuc2V0Q2VudGVyZWRWaWV3Q29udGVudCgnPHA+JyArIHRoaXMuX3RleHQgKyAnPC9wPicpO1xuXG4gICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5hbmdsZVJlZmVyZW5jZSA9IHRoaXMuX2FuZ2xlO1xuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==