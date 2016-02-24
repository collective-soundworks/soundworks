'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

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
   * @param {Object} [options={}] - Options.
   * @param {String} [options.name='orientation'] - Name of the module.
   */

  function Orientation() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Orientation);

    _get(Object.getPrototypeOf(Orientation.prototype), 'constructor', this).call(this, options.name || 'orientation', options);

    this.options = _Object$assign({
      bypass: false,
      viewCtor: _displaySegmentedView2['default']
    }, options);

    this.bypass = options.bypass || false;
    // bind methods
    this._onOrientationChange = this._onOrientationChange.bind(this);
    this._onOrientationSelected = this._onOrientationSelected.bind(this);
    // configure view
    this.viewCtor = this.options.viewCtor;
    this.events = { 'click': this._onOrientationSelected };

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
      this.angleReference = 0;

      _motionInput2['default'].init('orientation').then(function (modules) {
        var _modules = _slicedToArray(modules, 1);

        var orientation = _modules[0];

        if (!orientation.isValid) {
          _this.content.error = true;
        }

        // @todo - this should have a waiting state before `motionInput` is ready
        _this.view = _this.createView();
      });
    }

    /** @private */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Orientation.prototype), 'start', this).call(this);

      if (!this.content.error) _motionInput2['default'].addListener('orientation', this._onOrientationChange);
    }

    /** @private */
  }, {
    key: 'stop',
    value: function stop() {
      _motionInput2['default'].removeListener('orientation', this._onOrientationChange);
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
})(_ClientModule3['default']);

exports['default'] = Orientation;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvT3JpZW50YXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQXdCLGNBQWM7Ozs7NkJBQ2IsZ0JBQWdCOzs7O29DQUNmLHlCQUF5Qjs7Ozs7Ozs7Ozs7Ozs7O0lBWTlCLFdBQVc7WUFBWCxXQUFXOzs7Ozs7O0FBS25CLFdBTFEsV0FBVyxHQUtKO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFMTCxXQUFXOztBQU01QiwrQkFOaUIsV0FBVyw2Q0FNdEIsT0FBTyxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUUsT0FBTyxFQUFFOztBQUU5QyxRQUFJLENBQUMsT0FBTyxHQUFHLGVBQWM7QUFDM0IsWUFBTSxFQUFFLEtBQUs7QUFDYixjQUFRLG1DQUFlO0tBQ3hCLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRVosUUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQzs7QUFFdEMsUUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakUsUUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXJFLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFDdEMsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQzs7QUFFdkQsUUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ2I7O2VBdEJrQixXQUFXOztXQXdCMUIsZ0JBQUc7OztBQUNMLFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLFlBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLFlBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNiOzs7Ozs7O0FBT0QsVUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7O0FBRXhCLCtCQUNHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FDbkIsSUFBSSxDQUFDLFVBQUMsT0FBTyxFQUFLO3NDQUNLLE9BQU87O1lBQXRCLFdBQVc7O0FBRWxCLFlBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO0FBQ3hCLGdCQUFLLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQzNCOzs7QUFHRCxjQUFLLElBQUksR0FBRyxNQUFLLFVBQVUsRUFBRSxDQUFDO09BQy9CLENBQUMsQ0FBQztLQUNOOzs7OztXQUdJLGlCQUFHO0FBQ04saUNBckRpQixXQUFXLHVDQXFEZDs7QUFFZCxVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQ3JCLHlCQUFZLFdBQVcsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7S0FDckU7Ozs7O1dBR0csZ0JBQUc7QUFDTCwrQkFBWSxjQUFjLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0tBQ3RFOzs7OztXQUdNLG1CQUFHOztBQUVSLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7V0FFbUIsOEJBQUMsSUFBSSxFQUFFO0FBQ3pCLFVBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9COzs7V0FFcUIsa0NBQUc7QUFDdkIsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztTQTVFa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL1VzZXJzL21hdHVzemV3c2tpL2Rldi9jb3NpbWEvbGliL3NvdW5kd29ya3Mvc3JjL2NsaWVudC9PcmllbnRhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb3Rpb25JbnB1dCBmcm9tICdtb3Rpb24taW5wdXQnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5cbi8vIGh0dHBzOi8vc2l0ZXMuZ29vZ2xlLmNvbS9hL2Nocm9taXVtLm9yZy9kZXYvSG9tZS9jaHJvbWl1bS1zZWN1cml0eS9kZXByZWNhdGluZy1wb3dlcmZ1bC1mZWF0dXJlcy1vbi1pbnNlY3VyZS1vcmlnaW5zXG5cbi8qKlxuICogW2NsaWVudF0gQ2FsaWJyYXRlIHRoZSBjb21wYXNzIGJ5IHNldHRpbmcgYW4gYW5nbGUgcmVmZXJlbmNlLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGRpc3BsYXlzIGEgdmlldyB3aXRoIGFuIGluc3RydWN0aW9uIHRleHQ6IHRoZSB1c2VyIGlzIGFza2VkIHRvIHRhcCB0aGUgc2NyZWVuIHdoZW4gdGhlIHBob25lIHBvaW50cyBhdCB0aGUgZGVzaXJlZCBkaXJlY3Rpb24gZm9yIHRoZSBjYWxpYnJhdGlvbi5cbiAqIFdoZW4gdGhlIHVzZXIgdGFwcyB0aGUgc2NyZWVuLCB0aGUgY3VycmVudCBjb21wYXNzIHZhbHVlIGlzIHNldCBhcyB0aGUgYW5nbGUgcmVmZXJlbmNlLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gdGhlIHBhcnRpY2lwYW50IHRhcHMgdGhlIHNjcmVlbiAoYW5kIHRoZSByZWZlcmFuY2UgYW5nbGUgaXMgc2F2ZWQpLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPcmllbnRhdGlvbiBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIC0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J29yaWVudGF0aW9uJ10gLSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ29yaWVudGF0aW9uJywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGJ5cGFzczogZmFsc2UsXG4gICAgICB2aWV3Q3RvcjogU2VnbWVudGVkVmlldyxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHRoaXMuYnlwYXNzID0gb3B0aW9ucy5ieXBhc3MgfHzCoGZhbHNlO1xuICAgIC8vIGJpbmQgbWV0aG9kc1xuICAgIHRoaXMuX29uT3JpZW50YXRpb25DaGFuZ2UgPSB0aGlzLl9vbk9yaWVudGF0aW9uQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25PcmllbnRhdGlvblNlbGVjdGVkID0gdGhpcy5fb25PcmllbnRhdGlvblNlbGVjdGVkLmJpbmQodGhpcyk7XG4gICAgLy8gY29uZmlndXJlIHZpZXdcbiAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgIHRoaXMuZXZlbnRzID0geyAnY2xpY2snOiB0aGlzLl9vbk9yaWVudGF0aW9uU2VsZWN0ZWQgfTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAodGhpcy5ieXBhc3MpIHtcbiAgICAgIHRoaXMuYW5nbGVSZWZlcmVuY2UgPSAwO1xuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmFsdWUgb2YgdGhlIGBhbHBoYWAgYW5nbGUgKGFzIGluIHRoZSBbYGRldmljZU9yaWVudGF0aW9uYCBIVE1MNSBBUEldKGh0dHA6Ly93d3cudzMub3JnL1RSL29yaWVudGF0aW9uLWV2ZW50LykpIHdoZW4gdGhlIHVzZXIgdG91Y2hlcyB0aGUgc2NyZWVuLlxuICAgICAqIEl0IHNlcnZlcyBhcyBhIGNhbGlicmF0aW9uIC8gcmVmZXJlbmNlIG9mIHRoZSBjb21wYXNzLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5hbmdsZVJlZmVyZW5jZSA9IDA7XG5cbiAgICBtb3Rpb25JbnB1dFxuICAgICAgLmluaXQoJ29yaWVudGF0aW9uJylcbiAgICAgIC50aGVuKChtb2R1bGVzKSA9PiB7XG4gICAgICAgIGNvbnN0IFtvcmllbnRhdGlvbl0gPSBtb2R1bGVzO1xuXG4gICAgICAgIGlmICghb3JpZW50YXRpb24uaXNWYWxpZCkge1xuICAgICAgICAgIHRoaXMuY29udGVudC5lcnJvciA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBAdG9kbyAtIHRoaXMgc2hvdWxkIGhhdmUgYSB3YWl0aW5nIHN0YXRlIGJlZm9yZSBgbW90aW9uSW5wdXRgIGlzIHJlYWR5XG4gICAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5jb250ZW50LmVycm9yKVxuICAgICAgbW90aW9uSW5wdXQuYWRkTGlzdGVuZXIoJ29yaWVudGF0aW9uJywgdGhpcy5fb25PcmllbnRhdGlvbkNoYW5nZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBtb3Rpb25JbnB1dC5yZW1vdmVMaXN0ZW5lcignb3JpZW50YXRpb24nLCB0aGlzLl9vbk9yaWVudGF0aW9uQ2hhbmdlKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICByZXN0YXJ0KCkge1xuICAgIC8vIEFzIHRoaXMgbW9kdWxlIGlzIGNsaWVudCBzaWRlIG9ubHksIG5vdGhpbmcgaGFzIHRvIGJlIGRvbmUgd2hlbiByZXN0YXJ0aW5nLlxuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgX29uT3JpZW50YXRpb25DaGFuZ2UoZGF0YSkge1xuICAgIHRoaXMuYW5nbGVSZWZlcmVuY2UgPSBkYXRhWzBdO1xuICB9XG5cbiAgX29uT3JpZW50YXRpb25TZWxlY3RlZCgpIHtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxufVxuIl19