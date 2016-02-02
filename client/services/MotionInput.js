'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _motionInput = require('motion-input');

var _motionInput2 = _interopRequireDefault(_motionInput);

var _coreService = require('../core/Service');

var _coreService2 = _interopRequireDefault(_coreService);

var _coreServiceManager = require('../core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

var SERVICE_ID = 'service:motion-input';

/*
... dans le constructor (ou la méthode init ?) :
  this.motionInput = this.require(‘motioninput', { descriptors: [‘accelerationIncludingGravity'] });

… dans le start/enter de l'experience:
  if (motionInput.isValid(‘accelerationIncludingGravity')) {
    motionInput.addListener('accelerationIncludingGravity', (data) => {
      // digest motion data
    });
  } else {
    // handle error
  }
*/

var MotionInput = (function (_Service) {
  _inherits(MotionInput, _Service);

  function MotionInput() {
    _classCallCheck(this, MotionInput);

    _get(Object.getPrototypeOf(MotionInput.prototype), 'constructor', this).call(this, SERVICE_ID, false);

    var defaults = {
      descriptors: []
    };

    // showError: false, // @todo - how to handle if several descriptors are asked but only some passed ? showAnyError / showAllError
    this.configure(defaults);
    // @todo - handle directly inside the motionInput
    this._descriptorsValidity = {};
  }

  // init() { /* nothing to do here... */ }

  _createClass(MotionInput, [{
    key: 'configure',
    value: function configure(options) {
      if (this.options.descriptors) options.descriptors = this.options.descriptors.concat(options.descriptors);

      _get(Object.getPrototypeOf(MotionInput.prototype), 'configure', this).call(this, options);
    }
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(MotionInput.prototype), 'start', this).call(this);

      _motionInput2['default'].init.apply(_motionInput2['default'], _toConsumableArray(this.options.descriptors)).then(function (modules) {
        _this.options.descriptors.forEach(function (name, index) {
          _this._descriptorsValidity[name] = modules[index].isValid;
        });

        // @tbd - maybe handle errors here...
        _this.ready();
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      _get(Object.getPrototypeOf(MotionInput.prototype), 'stop', this).call(this);
    }
  }, {
    key: 'isValid',
    value: function isValid(name) {
      return this._descriptorsValidity[name];
    }
  }, {
    key: 'addListener',
    value: function addListener(name, callback) {
      if (this._descriptorsValidity[name]) _motionInput2['default'].addListener(name, callback);
    }
  }, {
    key: 'removeListener',
    value: function removeListener(name, callback) {
      if (this._descriptorsValidity[name]) _motionInput2['default'].removeListener(name, callback);
    }
  }]);

  return MotionInput;
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, MotionInput);

exports['default'] = MotionInput;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvTW90aW9uSW5wdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OzJCQUF3QixjQUFjOzs7OzJCQUNsQixpQkFBaUI7Ozs7a0NBQ1Ysd0JBQXdCOzs7O0FBRW5ELElBQU0sVUFBVSxHQUFHLHNCQUFzQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0lBZ0JwQyxXQUFXO1lBQVgsV0FBVzs7QUFDSixXQURQLFdBQVcsR0FDRDswQkFEVixXQUFXOztBQUViLCtCQUZFLFdBQVcsNkNBRVAsVUFBVSxFQUFFLEtBQUssRUFBRTs7QUFFekIsUUFBTSxRQUFRLEdBQUc7QUFDZixpQkFBVyxFQUFFLEVBQUU7S0FFaEIsQ0FBQzs7O0FBRUYsUUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFekIsUUFBSSxDQUFDLG9CQUFvQixHQUFHLEVBQUUsQ0FBQTtHQUMvQjs7OztlQVpHLFdBQVc7O1dBZ0JOLG1CQUFDLE9BQU8sRUFBRTtBQUNqQixVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUMxQixPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRTdFLGlDQXBCRSxXQUFXLDJDQW9CRyxPQUFPLEVBQUU7S0FDMUI7OztXQUVJLGlCQUFHOzs7QUFDTixpQ0F4QkUsV0FBVyx1Q0F3QkM7O0FBRWQsK0JBQ0csSUFBSSxNQUFBLDhDQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFDLENBQ2pDLElBQUksQ0FBQyxVQUFDLE9BQU8sRUFBSztBQUNqQixjQUFLLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBSztBQUNoRCxnQkFBSyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDO1NBQzFELENBQUMsQ0FBQzs7O0FBR0gsY0FBSyxLQUFLLEVBQUUsQ0FBQztPQUNkLENBQUMsQ0FBQztLQUNOOzs7V0FFRyxnQkFBRztBQUNMLGlDQXZDRSxXQUFXLHNDQXVDQTtLQUNkOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUU7QUFDWixhQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4Qzs7O1dBRVUscUJBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUMxQixVQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFDakMseUJBQVksV0FBVyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztLQUMzQzs7O1dBRWEsd0JBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFDakMseUJBQVksY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztLQUM5Qzs7O1NBdERHLFdBQVc7OztBQXlEakIsZ0NBQWUsUUFBUSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQzs7cUJBRWxDLFdBQVciLCJmaWxlIjoic3JjL2NsaWVudC9zZXJ2aWNlcy9Nb3Rpb25JbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb3Rpb25JbnB1dCBmcm9tICdtb3Rpb24taW5wdXQnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOm1vdGlvbi1pbnB1dCc7XG5cbi8qXG4uLi4gZGFucyBsZSBjb25zdHJ1Y3RvciAob3UgbGEgbcOpdGhvZGUgaW5pdCA/KSA6XG4gIHRoaXMubW90aW9uSW5wdXQgPSB0aGlzLnJlcXVpcmUo4oCYbW90aW9uaW5wdXQnLCB7IGRlc2NyaXB0b3JzOiBb4oCYYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSddIH0pO1xuXG7igKYgZGFucyBsZSBzdGFydC9lbnRlciBkZSBsJ2V4cGVyaWVuY2U6XG4gIGlmIChtb3Rpb25JbnB1dC5pc1ZhbGlkKOKAmGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknKSkge1xuICAgIG1vdGlvbklucHV0LmFkZExpc3RlbmVyKCdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JywgKGRhdGEpID0+IHtcbiAgICAgIC8vIGRpZ2VzdCBtb3Rpb24gZGF0YVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIC8vIGhhbmRsZSBlcnJvclxuICB9XG4qL1xuXG5jbGFzcyBNb3Rpb25JbnB1dCBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGRlc2NyaXB0b3JzOiBbXSxcbiAgICAgIC8vIHNob3dFcnJvcjogZmFsc2UsIC8vIEB0b2RvIC0gaG93IHRvIGhhbmRsZSBpZiBzZXZlcmFsIGRlc2NyaXB0b3JzIGFyZSBhc2tlZCBidXQgb25seSBzb21lIHBhc3NlZCA/IHNob3dBbnlFcnJvciAvIHNob3dBbGxFcnJvclxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gICAgLy8gQHRvZG8gLSBoYW5kbGUgZGlyZWN0bHkgaW5zaWRlIHRoZSBtb3Rpb25JbnB1dFxuICAgIHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHkgPSB7fVxuICB9XG5cbiAgLy8gaW5pdCgpIHsgLyogbm90aGluZyB0byBkbyBoZXJlLi4uICovIH1cblxuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZGVzY3JpcHRvcnMpXG4gICAgICBvcHRpb25zLmRlc2NyaXB0b3JzID0gdGhpcy5vcHRpb25zLmRlc2NyaXB0b3JzLmNvbmNhdChvcHRpb25zLmRlc2NyaXB0b3JzKTtcblxuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBtb3Rpb25JbnB1dFxuICAgICAgLmluaXQoLi4udGhpcy5vcHRpb25zLmRlc2NyaXB0b3JzKVxuICAgICAgLnRoZW4oKG1vZHVsZXMpID0+IHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmRlc2NyaXB0b3JzLmZvckVhY2goKG5hbWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgdGhpcy5fZGVzY3JpcHRvcnNWYWxpZGl0eVtuYW1lXSA9IG1vZHVsZXNbaW5kZXhdLmlzVmFsaWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEB0YmQgLSBtYXliZSBoYW5kbGUgZXJyb3JzIGhlcmUuLi5cbiAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgfSk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIGlzVmFsaWQobmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5W25hbWVdO1xuICB9XG5cbiAgYWRkTGlzdGVuZXIobmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZiAodGhpcy5fZGVzY3JpcHRvcnNWYWxpZGl0eVtuYW1lXSlcbiAgICAgIG1vdGlvbklucHV0LmFkZExpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJlbW92ZUxpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHlbbmFtZV0pXG4gICAgICBtb3Rpb25JbnB1dC5yZW1vdmVMaXN0ZW5lcihuYW1lLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgTW90aW9uSW5wdXQpO1xuXG5leHBvcnQgZGVmYXVsdCBNb3Rpb25JbnB1dDtcbiJdfQ==