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

      this.view = this.createDefaultView();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvT3JpZW50YXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztxQkFBa0IsU0FBUzs7Ozs2QkFDRixnQkFBZ0I7Ozs7b0NBQ2YseUJBQXlCOzs7Ozs7Ozs7Ozs7O0lBVzlCLFdBQVc7WUFBWCxXQUFXOzs7Ozs7Ozs7O0FBUW5CLFdBUlEsV0FBVyxHQVFKO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFSTCxXQUFXOztBQVM1QiwrQkFUaUIsV0FBVyw2Q0FTdEIsT0FBTyxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUUsT0FBTyxFQUFFOzs7QUFHOUMsdUJBQU0sdUJBQXVCLEVBQUUsQ0FBQzs7QUFFaEMsUUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakUsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFekMsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxxQ0FBaUIsQ0FBQztBQUNsRCxRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7QUFFekMsUUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ2I7O2VBckJrQixXQUFXOztXQXVCMUIsZ0JBQUc7Ozs7OztBQU1MLFVBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLFVBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUVoQixVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQ3JDLGFBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3hCOzs7Ozs7O1dBS0ksaUJBQUc7QUFDTixpQ0F4Q2lCLFdBQVcsdUNBd0NkO0FBQ2QseUJBQU0sRUFBRSxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0tBQzFEOzs7V0FFbUIsOEJBQUMsZUFBZSxFQUFFO0FBQ3BDLFVBQUksQ0FBQyxNQUFNLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQztLQUNyQzs7O1dBRU8sb0JBQUc7QUFDVCxVQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7O0FBRWxDLHlCQUFNLGNBQWMsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNyRSxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1NBckRrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiJzcmMvY2xpZW50L09yaWVudGF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGlucHV0IGZyb20gJy4vaW5wdXQnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5cblxuLyoqXG4gKiBbY2xpZW50XSBDYWxpYnJhdGUgdGhlIGNvbXBhc3MgYnkgc2V0dGluZyBhbiBhbmdsZSByZWZlcmVuY2UuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgZGlzcGxheXMgYSB2aWV3IHdpdGggYW4gaW5zdHJ1Y3Rpb24gdGV4dDogdGhlIHVzZXIgaXMgYXNrZWQgdG8gdGFwIHRoZSBzY3JlZW4gd2hlbiB0aGUgcGhvbmUgcG9pbnRzIGF0IHRoZSBkZXNpcmVkIGRpcmVjdGlvbiBmb3IgdGhlIGNhbGlicmF0aW9uLlxuICogV2hlbiB0aGUgdXNlciB0YXBzIHRoZSBzY3JlZW4sIHRoZSBjdXJyZW50IGNvbXBhc3MgdmFsdWUgaXMgc2V0IGFzIHRoZSBhbmdsZSByZWZlcmVuY2UuXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gd2hlbiB0aGUgcGFydGljaXBhbnQgdGFwcyB0aGUgc2NyZWVuIChhbmQgdGhlIHJlZmVyYW5jZSBhbmdsZSBpcyBzYXZlZCkuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9yaWVudGF0aW9uIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J2RpYWxvZyddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnRleHQ9J1BvaW50IHRoZSBwaG9uZSBleGFjdGx5IGluIGZyb250IG9mIHlvdSwgYW5kIHRvdWNoIHRoZSBzY3JlZW4uJ10gVGV4dCB0byBiZSBkaXNwbGF5ZWQgaW4gdGhlIGB2aWV3YC5cbiAgICogQHRvZG8gU29sdmUgdGhlIHNwYWNlIGluIGRlZmF1bHQgcGFyYW1ldGVyIHByb2JsZW0uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ29yaWVudGF0aW9uJywgb3B0aW9ucyk7XG5cbiAgICAvLyBAdG9kbyAtIHVzZSBuZXcgaW5wdXQgbW9kdWxlXG4gICAgaW5wdXQuZW5hYmxlRGV2aWNlT3JpZW50YXRpb24oKTtcbiAgICAvLyBiaW5kIG1ldGhvZHNcbiAgICB0aGlzLl9vbk9yaWVudGF0aW9uQ2hhbmdlID0gdGhpcy5fb25PcmllbnRhdGlvbkNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQ2xpY2sgPSB0aGlzLl9vbkNsaWNrLmJpbmQodGhpcyk7XG4gICAgLy8gY29uZmlndXJlIHZpZXdcbiAgICB0aGlzLnZpZXdDdG9yID0gb3B0aW9ucy52aWV3Q3RvciB8fMKgU2VnbWVudGVkVmlldztcbiAgICB0aGlzLmV2ZW50cyA9IHsgJ2NsaWNrJzogdGhpcy5fb25DbGljayB9O1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIC8qKlxuICAgICAqIFZhbHVlIG9mIHRoZSBgYWxwaGFgIGFuZ2xlIChhcyBpbiB0aGUgW2BkZXZpY2VPcmllbnRhdGlvbmAgSFRNTDUgQVBJXShodHRwOi8vd3d3LnczLm9yZy9UUi9vcmllbnRhdGlvbi1ldmVudC8pKSB3aGVuIHRoZSB1c2VyIHRvdWNoZXMgdGhlIHNjcmVlbi5cbiAgICAgKiBJdCBzZXJ2ZXMgYXMgYSBjYWxpYnJhdGlvbiAvIHJlZmVyZW5jZSBvZiB0aGUgY29tcGFzcy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuYW5nbGVSZWZlcmVuY2UgPSAwOyAvLyBAdG9kbyAtIHdoZXJlIGlzIHRoaXMgdmFsdWUgc2F2ZWQgP1xuICAgIHRoaXMuX2FuZ2xlID0gMDsgLy8gQHRvZG8gLSBpcyB0aGlzIHJlYWxseSBuZWVkZWQgP1xuXG4gICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVEZWZhdWx0VmlldygpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMudmlldyk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgaW5wdXQub24oJ2RldmljZW9yaWVudGF0aW9uJywgdGhpcy5fb25PcmllbnRhdGlvbkNoYW5nZSk7XG4gIH1cblxuICBfb25PcmllbnRhdGlvbkNoYW5nZShvcmllbnRhdGlvbkRhdGEpIHtcbiAgICB0aGlzLl9hbmdsZSA9IG9yaWVudGF0aW9uRGF0YS5hbHBoYTtcbiAgfVxuXG4gIF9vbkNsaWNrKCkge1xuICAgIHRoaXMuYW5nbGVSZWZlcmVuY2UgPSB0aGlzLl9hbmdsZTtcbiAgICAvLyBzdG9wIGxpc3RlbmluZyBmb3IgZGV2aWNlIG9yaWVudGF0aW9uIHdoZW4gZG9uZVxuICAgIGlucHV0LnJlbW92ZUxpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIHRoaXMuX29uT3JpZW50YXRpb25DaGFuZ2UpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG59XG4iXX0=