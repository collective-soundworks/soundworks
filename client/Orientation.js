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

      if (!this.content.error) {
        _motionInput2['default'].addListener('orientation', this._onOrientationChange);
      }
    }
  }, {
    key: '_onOrientationChange',
    value: function _onOrientationChange(data) {
      this.angleReference = data[0];
    }
  }, {
    key: '_onClick',
    value: function _onClick() {
      // stop listening for device orientation when done
      _motionInput2['default'].removeListener('orientation', this._onOrientationChange);
      this.done();
    }
  }]);

  return Orientation;
})(_ClientModule3['default']);

exports['default'] = Orientation;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvT3JpZW50YXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQkFDd0IsY0FBYzs7Ozs2QkFDYixnQkFBZ0I7Ozs7b0NBQ2YseUJBQXlCOzs7Ozs7Ozs7Ozs7Ozs7SUFZOUIsV0FBVztZQUFYLFdBQVc7Ozs7Ozs7O0FBTW5CLFdBTlEsV0FBVyxHQU1KO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFOTCxXQUFXOztBQU81QiwrQkFQaUIsV0FBVyw2Q0FPdEIsT0FBTyxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUUsT0FBTyxFQUFFOztBQUU5QyxRQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDOzs7O0FBSXRDLFFBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pFLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXpDLFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEscUNBQWlCLENBQUM7QUFDbEQsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7O0FBRXpDLFFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNiOztlQXBCa0IsV0FBVzs7V0FzQjFCLGdCQUFHOzs7QUFDTCxVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixZQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQztBQUN4QixZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDYjs7Ozs7OztBQU9ELFVBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDOztBQUV4QiwrQkFDRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQ25CLElBQUksQ0FBQyxVQUFDLE9BQU8sRUFBSztzQ0FDSyxPQUFPOztZQUF0QixXQUFXOztBQUVsQixZQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRTtBQUN4QixnQkFBSyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUMzQjs7QUFFRCxjQUFLLElBQUksR0FBRyxNQUFLLFVBQVUsRUFBRSxDQUFDO09BQy9CLENBQUMsQ0FBQztLQUNOOzs7Ozs7O1dBS0ksaUJBQUc7QUFDTixpQ0FwRGlCLFdBQVcsdUNBb0RkOztBQUVkLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtBQUN2QixpQ0FBWSxXQUFXLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO09BQ25FO0tBQ0Y7OztXQUVtQiw4QkFBQyxJQUFJLEVBQUU7QUFDekIsVUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0I7OztXQUVPLG9CQUFHOztBQUVULCtCQUFZLGNBQWMsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDckUsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztTQW5Fa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoic3JjL2NsaWVudC9PcmllbnRhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBpbnB1dCBmcm9tICcuL2lucHV0JztcbmltcG9ydCBtb3Rpb25JbnB1dCBmcm9tICdtb3Rpb24taW5wdXQnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5cbi8vIGh0dHBzOi8vc2l0ZXMuZ29vZ2xlLmNvbS9hL2Nocm9taXVtLm9yZy9kZXYvSG9tZS9jaHJvbWl1bS1zZWN1cml0eS9kZXByZWNhdGluZy1wb3dlcmZ1bC1mZWF0dXJlcy1vbi1pbnNlY3VyZS1vcmlnaW5zXG5cbi8qKlxuICogW2NsaWVudF0gQ2FsaWJyYXRlIHRoZSBjb21wYXNzIGJ5IHNldHRpbmcgYW4gYW5nbGUgcmVmZXJlbmNlLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGRpc3BsYXlzIGEgdmlldyB3aXRoIGFuIGluc3RydWN0aW9uIHRleHQ6IHRoZSB1c2VyIGlzIGFza2VkIHRvIHRhcCB0aGUgc2NyZWVuIHdoZW4gdGhlIHBob25lIHBvaW50cyBhdCB0aGUgZGVzaXJlZCBkaXJlY3Rpb24gZm9yIHRoZSBjYWxpYnJhdGlvbi5cbiAqIFdoZW4gdGhlIHVzZXIgdGFwcyB0aGUgc2NyZWVuLCB0aGUgY3VycmVudCBjb21wYXNzIHZhbHVlIGlzIHNldCBhcyB0aGUgYW5nbGUgcmVmZXJlbmNlLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gdGhlIHBhcnRpY2lwYW50IHRhcHMgdGhlIHNjcmVlbiAoYW5kIHRoZSByZWZlcmFuY2UgYW5nbGUgaXMgc2F2ZWQpLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPcmllbnRhdGlvbiBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdvcmllbnRhdGlvbiddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHRvZG8gU29sdmUgdGhlIHNwYWNlIGluIGRlZmF1bHQgcGFyYW1ldGVyIHByb2JsZW0uICg/PylcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnb3JpZW50YXRpb24nLCBvcHRpb25zKTtcblxuICAgIHRoaXMuYnlwYXNzID0gb3B0aW9ucy5ieXBhc3MgfHzCoGZhbHNlO1xuICAgIC8vIEB0b2RvIC0gdXNlIG5ldyBpbnB1dCBtb2R1bGVcbiAgICAvLyBpbnB1dC5lbmFibGVEZXZpY2VPcmllbnRhdGlvbigpO1xuICAgIC8vIGJpbmQgbWV0aG9kc1xuICAgIHRoaXMuX29uT3JpZW50YXRpb25DaGFuZ2UgPSB0aGlzLl9vbk9yaWVudGF0aW9uQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25DbGljayA9IHRoaXMuX29uQ2xpY2suYmluZCh0aGlzKTtcbiAgICAvLyBjb25maWd1cmUgdmlld1xuICAgIHRoaXMudmlld0N0b3IgPSBvcHRpb25zLnZpZXdDdG9yIHx8wqBTZWdtZW50ZWRWaWV3O1xuICAgIHRoaXMuZXZlbnRzID0geyAnY2xpY2snOiB0aGlzLl9vbkNsaWNrIH07XG5cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKHRoaXMuYnlwYXNzKSB7XG4gICAgICB0aGlzLmFuZ2xlUmVmZXJlbmNlID0gMDtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZhbHVlIG9mIHRoZSBgYWxwaGFgIGFuZ2xlIChhcyBpbiB0aGUgW2BkZXZpY2VPcmllbnRhdGlvbmAgSFRNTDUgQVBJXShodHRwOi8vd3d3LnczLm9yZy9UUi9vcmllbnRhdGlvbi1ldmVudC8pKSB3aGVuIHRoZSB1c2VyIHRvdWNoZXMgdGhlIHNjcmVlbi5cbiAgICAgKiBJdCBzZXJ2ZXMgYXMgYSBjYWxpYnJhdGlvbiAvIHJlZmVyZW5jZSBvZiB0aGUgY29tcGFzcy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuYW5nbGVSZWZlcmVuY2UgPSAwOyAvLyBAdG9kbyAtIHdoZXJlIGlzIHRoaXMgdmFsdWUgc2F2ZWQgP1xuXG4gICAgbW90aW9uSW5wdXRcbiAgICAgIC5pbml0KCdvcmllbnRhdGlvbicpXG4gICAgICAudGhlbigobW9kdWxlcykgPT4ge1xuICAgICAgICBjb25zdCBbb3JpZW50YXRpb25dID0gbW9kdWxlcztcblxuICAgICAgICBpZiAoIW9yaWVudGF0aW9uLmlzVmFsaWQpIHtcbiAgICAgICAgICB0aGlzLmNvbnRlbnQuZXJyb3IgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5jb250ZW50LmVycm9yKSB7XG4gICAgICBtb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcignb3JpZW50YXRpb24nLCB0aGlzLl9vbk9yaWVudGF0aW9uQ2hhbmdlKTtcbiAgICB9XG4gIH1cblxuICBfb25PcmllbnRhdGlvbkNoYW5nZShkYXRhKSB7XG4gICAgdGhpcy5hbmdsZVJlZmVyZW5jZSA9IGRhdGFbMF07XG4gIH1cblxuICBfb25DbGljaygpIHtcbiAgICAvLyBzdG9wIGxpc3RlbmluZyBmb3IgZGV2aWNlIG9yaWVudGF0aW9uIHdoZW4gZG9uZVxuICAgIG1vdGlvbklucHV0LnJlbW92ZUxpc3RlbmVyKCdvcmllbnRhdGlvbicsIHRoaXMuX29uT3JpZW50YXRpb25DaGFuZ2UpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG59XG4iXX0=