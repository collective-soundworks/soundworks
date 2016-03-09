'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _motionInput = require('motion-input');

var _motionInput2 = _interopRequireDefault(_motionInput);

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

var _SegmentedView = require('./display/SegmentedView');

var _SegmentedView2 = _interopRequireDefault(_SegmentedView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins

/**
 * [client] Calibrate the compass by setting an angle reference.
 *
 * The module always displays a view with an instruction text: the user is asked to tap the screen when the phone points at the desired direction for the calibration.
 * When the user taps the screen, the current compass value is set as the angle reference.
 *
 * The module finishes its initialization when the participant taps the screen (and the referance angle is saved).
 */

var Orientation = function (_ClientModule) {
  (0, _inherits3.default)(Orientation, _ClientModule);

  /**
   * @param {Object} [options={}] - Options.
   * @param {String} [options.name='orientation'] - Name of the module.
   */

  function Orientation() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, Orientation);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Orientation).call(this, options.name || 'orientation', options));

    _this.options = (0, _assign2.default)({
      bypass: false,
      viewCtor: _SegmentedView2.default
    }, options);

    _this.bypass = options.bypass || false;
    // bind methods
    _this._onOrientationChange = _this._onOrientationChange.bind(_this);
    _this._onOrientationSelected = _this._onOrientationSelected.bind(_this);
    // configure view
    _this.viewCtor = _this.options.viewCtor;
    _this.events = { 'click': _this._onOrientationSelected };

    _this.init();
    return _this;
  }

  (0, _createClass3.default)(Orientation, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

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

      _motionInput2.default.init('orientation').then(function (modules) {
        var _modules = (0, _slicedToArray3.default)(modules, 1);

        var orientation = _modules[0];


        if (!orientation.isValid) {
          _this2.content.error = true;
        }

        // @todo - this should have a waiting state before `motionInput` is ready
        _this2.view = _this2.createView();
      });
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Orientation.prototype), 'start', this).call(this);

      if (!this.content.error) _motionInput2.default.addListener('orientation', this._onOrientationChange);
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      _motionInput2.default.removeListener('orientation', this._onOrientationChange);
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
}(_ClientModule3.default);

exports.default = Orientation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9yaWVudGF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztJQVlxQjs7Ozs7Ozs7QUFLbkIsV0FMbUIsV0FLbkIsR0FBMEI7UUFBZCxnRUFBVSxrQkFBSTt3Q0FMUCxhQUtPOzs2RkFMUCx3QkFNWCxRQUFRLElBQVIsSUFBZ0IsYUFBaEIsRUFBK0IsVUFEYjs7QUFHeEIsVUFBSyxPQUFMLEdBQWUsc0JBQWM7QUFDM0IsY0FBUSxLQUFSO0FBQ0EsdUNBRjJCO0tBQWQsRUFHWixPQUhZLENBQWYsQ0FId0I7O0FBUXhCLFVBQUssTUFBTCxHQUFjLFFBQVEsTUFBUixJQUFrQixLQUFsQjs7QUFSVSxTQVV4QixDQUFLLG9CQUFMLEdBQTRCLE1BQUssb0JBQUwsQ0FBMEIsSUFBMUIsT0FBNUIsQ0FWd0I7QUFXeEIsVUFBSyxzQkFBTCxHQUE4QixNQUFLLHNCQUFMLENBQTRCLElBQTVCLE9BQTlCOztBQVh3QixTQWF4QixDQUFLLFFBQUwsR0FBZ0IsTUFBSyxPQUFMLENBQWEsUUFBYixDQWJRO0FBY3hCLFVBQUssTUFBTCxHQUFjLEVBQUUsU0FBUyxNQUFLLHNCQUFMLEVBQXpCLENBZHdCOztBQWdCeEIsVUFBSyxJQUFMLEdBaEJ3Qjs7R0FBMUI7OzZCQUxtQjs7MkJBd0JaOzs7QUFDTCxVQUFJLEtBQUssTUFBTCxFQUFhO0FBQ2YsYUFBSyxjQUFMLEdBQXNCLENBQXRCLENBRGU7QUFFZixhQUFLLElBQUwsR0FGZTtPQUFqQjs7Ozs7OztBQURLLFVBV0wsQ0FBSyxjQUFMLEdBQXNCLENBQXRCLENBWEs7O0FBYUwsNEJBQ0csSUFESCxDQUNRLGFBRFIsRUFFRyxJQUZILENBRVEsVUFBQyxPQUFELEVBQWE7b0RBQ0ssWUFETDs7WUFDViwwQkFEVTs7O0FBR2pCLFlBQUksQ0FBQyxZQUFZLE9BQVosRUFBcUI7QUFDeEIsaUJBQUssT0FBTCxDQUFhLEtBQWIsR0FBcUIsSUFBckIsQ0FEd0I7U0FBMUI7OztBQUhpQixjQVFqQixDQUFLLElBQUwsR0FBWSxPQUFLLFVBQUwsRUFBWixDQVJpQjtPQUFiLENBRlIsQ0FiSzs7Ozs7Ozs0QkE0QkM7QUFDTix1REFyRGlCLGlEQXFEakIsQ0FETTs7QUFHTixVQUFJLENBQUMsS0FBSyxPQUFMLENBQWEsS0FBYixFQUNILHNCQUFZLFdBQVosQ0FBd0IsYUFBeEIsRUFBdUMsS0FBSyxvQkFBTCxDQUF2QyxDQURGOzs7Ozs7OzJCQUtLO0FBQ0wsNEJBQVksY0FBWixDQUEyQixhQUEzQixFQUEwQyxLQUFLLG9CQUFMLENBQTFDLENBREs7Ozs7Ozs7OEJBS0c7O0FBRVIsV0FBSyxJQUFMLEdBRlE7Ozs7eUNBS1csTUFBTTtBQUN6QixXQUFLLGNBQUwsR0FBc0IsS0FBSyxDQUFMLENBQXRCLENBRHlCOzs7OzZDQUlGO0FBQ3ZCLFdBQUssSUFBTCxHQUR1Qjs7O1NBMUVOIiwiZmlsZSI6Ik9yaWVudGF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vdGlvbklucHV0IGZyb20gJ21vdGlvbi1pbnB1dCc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcblxuLy8gaHR0cHM6Ly9zaXRlcy5nb29nbGUuY29tL2EvY2hyb21pdW0ub3JnL2Rldi9Ib21lL2Nocm9taXVtLXNlY3VyaXR5L2RlcHJlY2F0aW5nLXBvd2VyZnVsLWZlYXR1cmVzLW9uLWluc2VjdXJlLW9yaWdpbnNcblxuLyoqXG4gKiBbY2xpZW50XSBDYWxpYnJhdGUgdGhlIGNvbXBhc3MgYnkgc2V0dGluZyBhbiBhbmdsZSByZWZlcmVuY2UuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgZGlzcGxheXMgYSB2aWV3IHdpdGggYW4gaW5zdHJ1Y3Rpb24gdGV4dDogdGhlIHVzZXIgaXMgYXNrZWQgdG8gdGFwIHRoZSBzY3JlZW4gd2hlbiB0aGUgcGhvbmUgcG9pbnRzIGF0IHRoZSBkZXNpcmVkIGRpcmVjdGlvbiBmb3IgdGhlIGNhbGlicmF0aW9uLlxuICogV2hlbiB0aGUgdXNlciB0YXBzIHRoZSBzY3JlZW4sIHRoZSBjdXJyZW50IGNvbXBhc3MgdmFsdWUgaXMgc2V0IGFzIHRoZSBhbmdsZSByZWZlcmVuY2UuXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gd2hlbiB0aGUgcGFydGljaXBhbnQgdGFwcyB0aGUgc2NyZWVuIChhbmQgdGhlIHJlZmVyYW5jZSBhbmdsZSBpcyBzYXZlZCkuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9yaWVudGF0aW9uIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nb3JpZW50YXRpb24nXSAtIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnb3JpZW50YXRpb24nLCBvcHRpb25zKTtcblxuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgYnlwYXNzOiBmYWxzZSxcbiAgICAgIHZpZXdDdG9yOiBTZWdtZW50ZWRWaWV3LFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5ieXBhc3MgPSBvcHRpb25zLmJ5cGFzcyB8fMKgZmFsc2U7XG4gICAgLy8gYmluZCBtZXRob2RzXG4gICAgdGhpcy5fb25PcmllbnRhdGlvbkNoYW5nZSA9IHRoaXMuX29uT3JpZW50YXRpb25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbk9yaWVudGF0aW9uU2VsZWN0ZWQgPSB0aGlzLl9vbk9yaWVudGF0aW9uU2VsZWN0ZWQuYmluZCh0aGlzKTtcbiAgICAvLyBjb25maWd1cmUgdmlld1xuICAgIHRoaXMudmlld0N0b3IgPSB0aGlzLm9wdGlvbnMudmlld0N0b3I7XG4gICAgdGhpcy5ldmVudHMgPSB7ICdjbGljayc6IHRoaXMuX29uT3JpZW50YXRpb25TZWxlY3RlZCB9O1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICh0aGlzLmJ5cGFzcykge1xuICAgICAgdGhpcy5hbmdsZVJlZmVyZW5jZSA9IDA7XG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWYWx1ZSBvZiB0aGUgYGFscGhhYCBhbmdsZSAoYXMgaW4gdGhlIFtgZGV2aWNlT3JpZW50YXRpb25gIEhUTUw1IEFQSV0oaHR0cDovL3d3dy53My5vcmcvVFIvb3JpZW50YXRpb24tZXZlbnQvKSkgd2hlbiB0aGUgdXNlciB0b3VjaGVzIHRoZSBzY3JlZW4uXG4gICAgICogSXQgc2VydmVzIGFzIGEgY2FsaWJyYXRpb24gLyByZWZlcmVuY2Ugb2YgdGhlIGNvbXBhc3MuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmFuZ2xlUmVmZXJlbmNlID0gMDtcblxuICAgIG1vdGlvbklucHV0XG4gICAgICAuaW5pdCgnb3JpZW50YXRpb24nKVxuICAgICAgLnRoZW4oKG1vZHVsZXMpID0+IHtcbiAgICAgICAgY29uc3QgW29yaWVudGF0aW9uXSA9IG1vZHVsZXM7XG5cbiAgICAgICAgaWYgKCFvcmllbnRhdGlvbi5pc1ZhbGlkKSB7XG4gICAgICAgICAgdGhpcy5jb250ZW50LmVycm9yID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEB0b2RvIC0gdGhpcyBzaG91bGQgaGF2ZSBhIHdhaXRpbmcgc3RhdGUgYmVmb3JlIGBtb3Rpb25JbnB1dGAgaXMgcmVhZHlcbiAgICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmNvbnRlbnQuZXJyb3IpXG4gICAgICBtb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcignb3JpZW50YXRpb24nLCB0aGlzLl9vbk9yaWVudGF0aW9uQ2hhbmdlKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIG1vdGlvbklucHV0LnJlbW92ZUxpc3RlbmVyKCdvcmllbnRhdGlvbicsIHRoaXMuX29uT3JpZW50YXRpb25DaGFuZ2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlc3RhcnQoKSB7XG4gICAgLy8gQXMgdGhpcyBtb2R1bGUgaXMgY2xpZW50IHNpZGUgb25seSwgbm90aGluZyBoYXMgdG8gYmUgZG9uZSB3aGVuIHJlc3RhcnRpbmcuXG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICBfb25PcmllbnRhdGlvbkNoYW5nZShkYXRhKSB7XG4gICAgdGhpcy5hbmdsZVJlZmVyZW5jZSA9IGRhdGFbMF07XG4gIH1cblxuICBfb25PcmllbnRhdGlvblNlbGVjdGVkKCkge1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG59XG4iXX0=