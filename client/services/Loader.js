'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _wavesLoaders = require('waves-loaders');

var _displaySegmentedView = require('../display/SegmentedView');

var _displaySegmentedView2 = _interopRequireDefault(_displaySegmentedView);

var _coreService = require('../core/Service');

var _coreService2 = _interopRequireDefault(_coreService);

var _coreServiceManager = require('../core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

/**
 * Default loader view
 */

var LoaderView = (function (_SegmentedView) {
  _inherits(LoaderView, _SegmentedView);

  function LoaderView() {
    _classCallCheck(this, LoaderView);

    _get(Object.getPrototypeOf(LoaderView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(LoaderView, [{
    key: 'onRender',
    value: function onRender() {
      _get(Object.getPrototypeOf(LoaderView.prototype), 'onRender', this).call(this);
      this.$progressBar = this.$el.querySelector('.progress-bar');
    }
  }, {
    key: 'onProgress',
    value: function onProgress(percent) {
      if (!this.content.showProgress) {
        return;
      }
      this.$progressBar.style.width = percent + '%';
    }
  }]);

  return LoaderView;
})(_displaySegmentedView2['default']);

var SERVICE_ID = 'service:loader';

/**
 * [client] Load audio files that can be used by other modules (*e.g.*, the {@link Performance}).
 *
 * The module always has a view (that displays a progress bar) and requires the SASS partial `_77-loader.scss`.
 *
 * The module finishes its initialization when all the files are loaded.
 *
 * @example
 * // Instantiate the module with the files to load
 * const loader = new Loader({ files: ['sounds/kick.mp3', 'sounds/snare.mp3'] });
 *
 * // Get the corresponding audio buffers
 * const kickBuffer = loader.audioBuffers[0];
 * const snareBuffer = loader.audioBuffers[1];
 */

var Loader = (function (_Service) {
  _inherits(Loader, _Service);

  function Loader() {
    _classCallCheck(this, Loader);

    _get(Object.getPrototypeOf(Loader.prototype), 'constructor', this).call(this, SERVICE_ID, false);

    /**
     * @type {Object} default - Default options of the service.
     * @type {String[]} [default.files=null] - The audio files to load.
     * @type {Boolean} [default.showProgress=true] - Defines if the progress bar is rendered. If set to true, the view should implement an `onProgress(percent)` method.
     * @type {String} [default.viewCtor=LoaderView] - Constructor for the module's view.
     */
    var defaults = {
      showProgress: true,
      files: null,
      viewCtor: LoaderView,
      viewPriority: 4
    };

    this.configure(defaults);
  }

  /** @private */

  _createClass(Loader, [{
    key: 'init',
    value: function init() {
      var _this = this;

      /**
       * Audio buffers created from the audio files passed in the {@link Loader#constructor}.
       * @type {Array<AudioBuffer>}
       */
      this.buffers = [];
      // to track files loading progress
      this._progress = [];
      this.options.files.forEach(function (file, index) {
        return _this._progress[index] = 0;
      });

      // prepare view
      this.content.showProgress = this.options.showProgress;
      this.viewCtor = this.options.viewCtor;
      this.view = this.createView();
    }
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Loader.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this._load(this.options.files);
      this.show();
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.hide();
      _get(Object.getPrototypeOf(Loader.prototype), 'stop', this).call(this);
    }
  }, {
    key: '_load',
    value: function _load(fileList) {
      var _this2 = this;

      var loader = new _wavesLoaders.SuperLoader();

      loader.progressCallback = this._onProgress.bind(this);
      loader.load(fileList).then(function (buffers) {
        _this2.buffers = buffers;
        _this2.ready();
      }, function (error) {
        console.error(error);
      });
    }
  }, {
    key: '_onProgress',
    value: function _onProgress(e) {
      this._progress[e.index] = e.value;

      var progress = this._progress.reduce(function (prev, current) {
        return prev + current;
      }, 0);
      progress /= this._progress.length;

      if (this.view && this.view.onProgress) this.view.onProgress(progress * 100);
    }
  }]);

  return Loader;
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, Loader);

exports['default'] = Loader;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvTG9hZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBQTRCLGVBQWU7O29DQUNqQiwwQkFBMEI7Ozs7MkJBQ2hDLGlCQUFpQjs7OztrQ0FDVix3QkFBd0I7Ozs7Ozs7O0lBTTdDLFVBQVU7WUFBVixVQUFVOztXQUFWLFVBQVU7MEJBQVYsVUFBVTs7K0JBQVYsVUFBVTs7O2VBQVYsVUFBVTs7V0FDTixvQkFBRztBQUNULGlDQUZFLFVBQVUsMENBRUs7QUFDakIsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUM3RDs7O1dBRVMsb0JBQUMsT0FBTyxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtBQUFFLGVBQU87T0FBRTtBQUMzQyxVQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQU0sT0FBTyxNQUFHLENBQUM7S0FDL0M7OztTQVRHLFVBQVU7OztBQWFoQixJQUFNLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBaUI5QixNQUFNO1lBQU4sTUFBTTs7QUFDQyxXQURQLE1BQU0sR0FDSTswQkFEVixNQUFNOztBQUVSLCtCQUZFLE1BQU0sNkNBRUYsVUFBVSxFQUFFLEtBQUssRUFBRTs7Ozs7Ozs7QUFRekIsUUFBTSxRQUFRLEdBQUc7QUFDZixrQkFBWSxFQUFFLElBQUk7QUFDbEIsV0FBSyxFQUFFLElBQUk7QUFDWCxjQUFRLEVBQUUsVUFBVTtBQUNwQixrQkFBWSxFQUFFLENBQUM7S0FDaEIsQ0FBQzs7QUFFRixRQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQzFCOzs7O2VBbEJHLE1BQU07O1dBcUJOLGdCQUFHOzs7Ozs7O0FBS0wsVUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7O0FBRWxCLFVBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxLQUFLO2VBQUssTUFBSyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztPQUFBLENBQUMsQ0FBQzs7O0FBR3ZFLFVBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO0FBQ3RELFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFDdEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDL0I7OztXQUVJLGlCQUFHO0FBQ04saUNBdENFLE1BQU0sdUNBc0NNOztBQUVkLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUNsQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRWQsVUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7V0FFRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLGlDQWpERSxNQUFNLHNDQWlESztLQUNkOzs7V0FFSSxlQUFDLFFBQVEsRUFBRTs7O0FBQ2QsVUFBTSxNQUFNLEdBQUcsK0JBQWlCLENBQUM7O0FBRWpDLFlBQU0sQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0RCxZQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUNsQixJQUFJLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDakIsZUFBSyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLGVBQUssS0FBSyxFQUFFLENBQUM7T0FDZCxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ1osZUFBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUN0QixDQUFDLENBQUM7S0FDTjs7O1dBRVUscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsVUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7QUFFbEMsVUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJLEVBQUUsT0FBTztlQUFLLElBQUksR0FBRyxPQUFPO09BQUEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzRSxjQUFRLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7O0FBRWxDLFVBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0tBQ3hDOzs7U0F6RUcsTUFBTTs7O0FBNEVaLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7O3FCQUU3QixNQUFNIiwiZmlsZSI6InNyYy9jbGllbnQvc2VydmljZXMvTG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3VwZXJMb2FkZXIgfSBmcm9tICd3YXZlcy1sb2FkZXJzJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4uL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5cbi8qKlxuICogRGVmYXVsdCBsb2FkZXIgdmlld1xuICovXG5jbGFzcyBMb2FkZXJWaWV3IGV4dGVuZHMgU2VnbWVudGVkVmlldyB7XG4gIG9uUmVuZGVyKCkge1xuICAgIHN1cGVyLm9uUmVuZGVyKCk7XG4gICAgdGhpcy4kcHJvZ3Jlc3NCYXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcucHJvZ3Jlc3MtYmFyJyk7XG4gIH1cblxuICBvblByb2dyZXNzKHBlcmNlbnQpIHtcbiAgICBpZiAoIXRoaXMuY29udGVudC5zaG93UHJvZ3Jlc3MpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy4kcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBgJHtwZXJjZW50fSVgO1xuICB9XG59XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmxvYWRlcic7XG5cbi8qKlxuICogW2NsaWVudF0gTG9hZCBhdWRpbyBmaWxlcyB0aGF0IGNhbiBiZSB1c2VkIGJ5IG90aGVyIG1vZHVsZXMgKCplLmcuKiwgdGhlIHtAbGluayBQZXJmb3JtYW5jZX0pLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcgKHRoYXQgZGlzcGxheXMgYSBwcm9ncmVzcyBiYXIpIGFuZCByZXF1aXJlcyB0aGUgU0FTUyBwYXJ0aWFsIGBfNzctbG9hZGVyLnNjc3NgLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gYWxsIHRoZSBmaWxlcyBhcmUgbG9hZGVkLlxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBJbnN0YW50aWF0ZSB0aGUgbW9kdWxlIHdpdGggdGhlIGZpbGVzIHRvIGxvYWRcbiAqIGNvbnN0IGxvYWRlciA9IG5ldyBMb2FkZXIoeyBmaWxlczogWydzb3VuZHMva2ljay5tcDMnLCAnc291bmRzL3NuYXJlLm1wMyddIH0pO1xuICpcbiAqIC8vIEdldCB0aGUgY29ycmVzcG9uZGluZyBhdWRpbyBidWZmZXJzXG4gKiBjb25zdCBraWNrQnVmZmVyID0gbG9hZGVyLmF1ZGlvQnVmZmVyc1swXTtcbiAqIGNvbnN0IHNuYXJlQnVmZmVyID0gbG9hZGVyLmF1ZGlvQnVmZmVyc1sxXTtcbiAqL1xuY2xhc3MgTG9hZGVyIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIGZhbHNlKTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtPYmplY3R9IGRlZmF1bHQgLSBEZWZhdWx0IG9wdGlvbnMgb2YgdGhlIHNlcnZpY2UuXG4gICAgICogQHR5cGUge1N0cmluZ1tdfSBbZGVmYXVsdC5maWxlcz1udWxsXSAtIFRoZSBhdWRpbyBmaWxlcyB0byBsb2FkLlxuICAgICAqIEB0eXBlIHtCb29sZWFufSBbZGVmYXVsdC5zaG93UHJvZ3Jlc3M9dHJ1ZV0gLSBEZWZpbmVzIGlmIHRoZSBwcm9ncmVzcyBiYXIgaXMgcmVuZGVyZWQuIElmIHNldCB0byB0cnVlLCB0aGUgdmlldyBzaG91bGQgaW1wbGVtZW50IGFuIGBvblByb2dyZXNzKHBlcmNlbnQpYCBtZXRob2QuXG4gICAgICogQHR5cGUge1N0cmluZ30gW2RlZmF1bHQudmlld0N0b3I9TG9hZGVyVmlld10gLSBDb25zdHJ1Y3RvciBmb3IgdGhlIG1vZHVsZSdzIHZpZXcuXG4gICAgICovXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBzaG93UHJvZ3Jlc3M6IHRydWUsXG4gICAgICBmaWxlczogbnVsbCxcbiAgICAgIHZpZXdDdG9yOiBMb2FkZXJWaWV3LFxuICAgICAgdmlld1ByaW9yaXR5OiA0LFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBBdWRpbyBidWZmZXJzIGNyZWF0ZWQgZnJvbSB0aGUgYXVkaW8gZmlsZXMgcGFzc2VkIGluIHRoZSB7QGxpbmsgTG9hZGVyI2NvbnN0cnVjdG9yfS5cbiAgICAgKiBAdHlwZSB7QXJyYXk8QXVkaW9CdWZmZXI+fVxuICAgICAqL1xuICAgIHRoaXMuYnVmZmVycyA9IFtdO1xuICAgIC8vIHRvIHRyYWNrIGZpbGVzIGxvYWRpbmcgcHJvZ3Jlc3NcbiAgICB0aGlzLl9wcm9ncmVzcyA9IFtdO1xuICAgIHRoaXMub3B0aW9ucy5maWxlcy5mb3JFYWNoKChmaWxlLCBpbmRleCkgPT4gdGhpcy5fcHJvZ3Jlc3NbaW5kZXhdID0gMCk7XG5cbiAgICAvLyBwcmVwYXJlIHZpZXdcbiAgICB0aGlzLmNvbnRlbnQuc2hvd1Byb2dyZXNzID0gdGhpcy5vcHRpb25zLnNob3dQcm9ncmVzcztcbiAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLl9sb2FkKHRoaXMub3B0aW9ucy5maWxlcyk7XG4gICAgdGhpcy5zaG93KCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIF9sb2FkKGZpbGVMaXN0KSB7XG4gICAgY29uc3QgbG9hZGVyID0gbmV3IFN1cGVyTG9hZGVyKCk7XG5cbiAgICBsb2FkZXIucHJvZ3Jlc3NDYWxsYmFjayA9IHRoaXMuX29uUHJvZ3Jlc3MuYmluZCh0aGlzKTtcbiAgICBsb2FkZXIubG9hZChmaWxlTGlzdClcbiAgICAgIC50aGVuKChidWZmZXJzKSA9PiB7XG4gICAgICAgIHRoaXMuYnVmZmVycyA9IGJ1ZmZlcnM7XG4gICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgX29uUHJvZ3Jlc3MoZSkge1xuICAgIHRoaXMuX3Byb2dyZXNzW2UuaW5kZXhdID0gZS52YWx1ZTtcblxuICAgIGxldCBwcm9ncmVzcyA9IHRoaXMuX3Byb2dyZXNzLnJlZHVjZSgocHJldiwgY3VycmVudCkgPT4gcHJldiArIGN1cnJlbnQsIDApO1xuICAgIHByb2dyZXNzIC89IHRoaXMuX3Byb2dyZXNzLmxlbmd0aDtcblxuICAgIGlmICh0aGlzLnZpZXcgJiYgdGhpcy52aWV3Lm9uUHJvZ3Jlc3MpXG4gICAgICB0aGlzLnZpZXcub25Qcm9ncmVzcyhwcm9ncmVzcyAqIDEwMCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgTG9hZGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hZGVyO1xuIl19