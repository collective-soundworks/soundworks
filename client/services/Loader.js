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
     * @type {String[]} [default.files=[]] - The audio files to load.
     * @type {Boolean} [default.showProgress=true] - Defines if the progress bar is rendered. If set to true, the view should implement an `onProgress(percent)` method.
     * @type {String} [default.viewCtor=LoaderView] - Constructor for the module's view.
     */
    var defaults = {
      showProgress: true,
      files: [],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NlcnZpY2VzL0xvYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzRCQUE0QixlQUFlOztvQ0FDakIsMEJBQTBCOzs7OzJCQUNoQyxpQkFBaUI7Ozs7a0NBQ1Ysd0JBQXdCOzs7Ozs7OztJQU03QyxVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzBCQUFWLFVBQVU7OytCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBQ04sb0JBQUc7QUFDVCxpQ0FGRSxVQUFVLDBDQUVLO0FBQ2pCLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDN0Q7OztXQUVTLG9CQUFDLE9BQU8sRUFBRTtBQUNsQixVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7QUFBRSxlQUFPO09BQUU7QUFDM0MsVUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFNLE9BQU8sTUFBRyxDQUFDO0tBQy9DOzs7U0FURyxVQUFVOzs7QUFhaEIsSUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWlCOUIsTUFBTTtZQUFOLE1BQU07O0FBQ0MsV0FEUCxNQUFNLEdBQ0k7MEJBRFYsTUFBTTs7QUFFUiwrQkFGRSxNQUFNLDZDQUVGLFVBQVUsRUFBRSxLQUFLLEVBQUU7Ozs7Ozs7O0FBUXpCLFFBQU0sUUFBUSxHQUFHO0FBQ2Ysa0JBQVksRUFBRSxJQUFJO0FBQ2xCLFdBQUssRUFBRSxFQUFFO0FBQ1QsY0FBUSxFQUFFLFVBQVU7QUFDcEIsa0JBQVksRUFBRSxDQUFDO0tBQ2hCLENBQUM7O0FBRUYsUUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUMxQjs7OztlQWxCRyxNQUFNOztXQXFCTixnQkFBRzs7Ozs7OztBQUtMLFVBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVsQixVQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNwQixVQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSztlQUFLLE1BQUssU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7T0FBQSxDQUFDLENBQUM7OztBQUd2RSxVQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztBQUN0RCxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQ3RDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQy9COzs7V0FFSSxpQkFBRztBQUNOLGlDQXRDRSxNQUFNLHVDQXNDTTs7QUFFZCxVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFDbEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVkLFVBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixpQ0FqREUsTUFBTSxzQ0FpREs7S0FDZDs7O1dBRUksZUFBQyxRQUFRLEVBQUU7OztBQUNkLFVBQU0sTUFBTSxHQUFHLCtCQUFpQixDQUFDOztBQUVqQyxZQUFNLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEQsWUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDbEIsSUFBSSxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQ2pCLGVBQUssT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixlQUFLLEtBQUssRUFBRSxDQUFDO09BQ2QsRUFBRSxVQUFDLEtBQUssRUFBSztBQUNaLGVBQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDdEIsQ0FBQyxDQUFDO0tBQ047OztXQUVVLHFCQUFDLENBQUMsRUFBRTtBQUNiLFVBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7O0FBRWxDLFVBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLE9BQU87ZUFBSyxJQUFJLEdBQUcsT0FBTztPQUFBLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDM0UsY0FBUSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDOztBQUVsQyxVQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsQ0FBQztLQUN4Qzs7O1NBekVHLE1BQU07OztBQTRFWixnQ0FBZSxRQUFRLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztxQkFFN0IsTUFBTSIsImZpbGUiOiIvVXNlcnMvc2NobmVsbC9EZXZlbG9wbWVudC93ZWIvY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3NvdW5kd29ya3Mvc3JjL2NsaWVudC9zZXJ2aWNlcy9Mb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdXBlckxvYWRlciB9IGZyb20gJ3dhdmVzLWxvYWRlcnMnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cblxuLyoqXG4gKiBEZWZhdWx0IGxvYWRlciB2aWV3XG4gKi9cbmNsYXNzIExvYWRlclZpZXcgZXh0ZW5kcyBTZWdtZW50ZWRWaWV3IHtcbiAgb25SZW5kZXIoKSB7XG4gICAgc3VwZXIub25SZW5kZXIoKTtcbiAgICB0aGlzLiRwcm9ncmVzc0JhciA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmVzcy1iYXInKTtcbiAgfVxuXG4gIG9uUHJvZ3Jlc3MocGVyY2VudCkge1xuICAgIGlmICghdGhpcy5jb250ZW50LnNob3dQcm9ncmVzcykgeyByZXR1cm47IH1cbiAgICB0aGlzLiRwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IGAke3BlcmNlbnR9JWA7XG4gIH1cbn1cblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bG9hZGVyJztcblxuLyoqXG4gKiBbY2xpZW50XSBMb2FkIGF1ZGlvIGZpbGVzIHRoYXQgY2FuIGJlIHVzZWQgYnkgb3RoZXIgbW9kdWxlcyAoKmUuZy4qLCB0aGUge0BsaW5rIFBlcmZvcm1hbmNlfSkuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgaGFzIGEgdmlldyAodGhhdCBkaXNwbGF5cyBhIHByb2dyZXNzIGJhcikgYW5kIHJlcXVpcmVzIHRoZSBTQVNTIHBhcnRpYWwgYF83Ny1sb2FkZXIuc2Nzc2AuXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gd2hlbiBhbGwgdGhlIGZpbGVzIGFyZSBsb2FkZWQuXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEluc3RhbnRpYXRlIHRoZSBtb2R1bGUgd2l0aCB0aGUgZmlsZXMgdG8gbG9hZFxuICogY29uc3QgbG9hZGVyID0gbmV3IExvYWRlcih7IGZpbGVzOiBbJ3NvdW5kcy9raWNrLm1wMycsICdzb3VuZHMvc25hcmUubXAzJ10gfSk7XG4gKlxuICogLy8gR2V0IHRoZSBjb3JyZXNwb25kaW5nIGF1ZGlvIGJ1ZmZlcnNcbiAqIGNvbnN0IGtpY2tCdWZmZXIgPSBsb2FkZXIuYXVkaW9CdWZmZXJzWzBdO1xuICogY29uc3Qgc25hcmVCdWZmZXIgPSBsb2FkZXIuYXVkaW9CdWZmZXJzWzFdO1xuICovXG5jbGFzcyBMb2FkZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgZmFsc2UpO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH0gZGVmYXVsdCAtIERlZmF1bHQgb3B0aW9ucyBvZiB0aGUgc2VydmljZS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nW119IFtkZWZhdWx0LmZpbGVzPVtdXSAtIFRoZSBhdWRpbyBmaWxlcyB0byBsb2FkLlxuICAgICAqIEB0eXBlIHtCb29sZWFufSBbZGVmYXVsdC5zaG93UHJvZ3Jlc3M9dHJ1ZV0gLSBEZWZpbmVzIGlmIHRoZSBwcm9ncmVzcyBiYXIgaXMgcmVuZGVyZWQuIElmIHNldCB0byB0cnVlLCB0aGUgdmlldyBzaG91bGQgaW1wbGVtZW50IGFuIGBvblByb2dyZXNzKHBlcmNlbnQpYCBtZXRob2QuXG4gICAgICogQHR5cGUge1N0cmluZ30gW2RlZmF1bHQudmlld0N0b3I9TG9hZGVyVmlld10gLSBDb25zdHJ1Y3RvciBmb3IgdGhlIG1vZHVsZSdzIHZpZXcuXG4gICAgICovXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBzaG93UHJvZ3Jlc3M6IHRydWUsXG4gICAgICBmaWxlczogW10sXG4gICAgICB2aWV3Q3RvcjogTG9hZGVyVmlldyxcbiAgICAgIHZpZXdQcmlvcml0eTogNCxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGluaXQoKSB7XG4gICAgLyoqXG4gICAgICogQXVkaW8gYnVmZmVycyBjcmVhdGVkIGZyb20gdGhlIGF1ZGlvIGZpbGVzIHBhc3NlZCBpbiB0aGUge0BsaW5rIExvYWRlciNjb25zdHJ1Y3Rvcn0uXG4gICAgICogQHR5cGUge0FycmF5PEF1ZGlvQnVmZmVyPn1cbiAgICAgKi9cbiAgICB0aGlzLmJ1ZmZlcnMgPSBbXTtcbiAgICAvLyB0byB0cmFjayBmaWxlcyBsb2FkaW5nIHByb2dyZXNzXG4gICAgdGhpcy5fcHJvZ3Jlc3MgPSBbXTtcbiAgICB0aGlzLm9wdGlvbnMuZmlsZXMuZm9yRWFjaCgoZmlsZSwgaW5kZXgpID0+IHRoaXMuX3Byb2dyZXNzW2luZGV4XSA9IDApO1xuXG4gICAgLy8gcHJlcGFyZSB2aWV3XG4gICAgdGhpcy5jb250ZW50LnNob3dQcm9ncmVzcyA9IHRoaXMub3B0aW9ucy5zaG93UHJvZ3Jlc3M7XG4gICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5fbG9hZCh0aGlzLm9wdGlvbnMuZmlsZXMpO1xuICAgIHRoaXMuc2hvdygpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICBfbG9hZChmaWxlTGlzdCkge1xuICAgIGNvbnN0IGxvYWRlciA9IG5ldyBTdXBlckxvYWRlcigpO1xuXG4gICAgbG9hZGVyLnByb2dyZXNzQ2FsbGJhY2sgPSB0aGlzLl9vblByb2dyZXNzLmJpbmQodGhpcyk7XG4gICAgbG9hZGVyLmxvYWQoZmlsZUxpc3QpXG4gICAgICAudGhlbigoYnVmZmVycykgPT4ge1xuICAgICAgICB0aGlzLmJ1ZmZlcnMgPSBidWZmZXJzO1xuICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICB9KTtcbiAgfVxuXG4gIF9vblByb2dyZXNzKGUpIHtcbiAgICB0aGlzLl9wcm9ncmVzc1tlLmluZGV4XSA9IGUudmFsdWU7XG5cbiAgICBsZXQgcHJvZ3Jlc3MgPSB0aGlzLl9wcm9ncmVzcy5yZWR1Y2UoKHByZXYsIGN1cnJlbnQpID0+IHByZXYgKyBjdXJyZW50LCAwKTtcbiAgICBwcm9ncmVzcyAvPSB0aGlzLl9wcm9ncmVzcy5sZW5ndGg7XG5cbiAgICBpZiAodGhpcy52aWV3ICYmIHRoaXMudmlldy5vblByb2dyZXNzKVxuICAgICAgdGhpcy52aWV3Lm9uUHJvZ3Jlc3MocHJvZ3Jlc3MgKiAxMDApO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIExvYWRlcik7XG5cbmV4cG9ydCBkZWZhdWx0IExvYWRlcjtcbiJdfQ==