'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _wavesLoaders = require('waves-loaders');

var _SegmentedView2 = require('../views/SegmentedView');

var _SegmentedView3 = _interopRequireDefault(_SegmentedView2);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Default loader view
 */

var LoaderView = function (_SegmentedView) {
  (0, _inherits3.default)(LoaderView, _SegmentedView);

  function LoaderView() {
    (0, _classCallCheck3.default)(this, LoaderView);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(LoaderView).apply(this, arguments));
  }

  (0, _createClass3.default)(LoaderView, [{
    key: 'onRender',
    value: function onRender() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(LoaderView.prototype), 'onRender', this).call(this);
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
}(_SegmentedView3.default);

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

var Loader = function (_Service) {
  (0, _inherits3.default)(Loader, _Service);

  function Loader() {
    (0, _classCallCheck3.default)(this, Loader);


    /**
     * @type {Object} default - Default options of the service.
     * @type {String[]} [default.files=[]] - The audio files to load.
     * @type {Boolean} [default.showProgress=true] - Defines if the progress bar is rendered. If set to true, the view should implement an `onProgress(percent)` method.
     * @type {String} [default.viewCtor=LoaderView] - Constructor for the module's view.
     */

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Loader).call(this, SERVICE_ID, false));

    var defaults = {
      showProgress: true,
      files: [],
      viewCtor: LoaderView,
      viewPriority: 4
    };

    _this2.configure(defaults);
    return _this2;
  }

  /** @private */


  (0, _createClass3.default)(Loader, [{
    key: 'init',
    value: function init() {
      var _this3 = this;

      /**
       * Audio buffers created from the audio files passed in the {@link Loader#constructor}.
       * @type {Array<AudioBuffer>}
       */
      this.buffers = [];
      // to track files loading progress
      this._progress = [];
      this.options.files.forEach(function (file, index) {
        return _this3._progress[index] = 0;
      });

      // prepare view
      this.content.showProgress = this.options.showProgress;
      this.viewCtor = this.options.viewCtor;
      this.view = this.createView();
    }
  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Loader.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this._load(this.options.files);
      this.show();
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.hide();
      (0, _get3.default)((0, _getPrototypeOf2.default)(Loader.prototype), 'stop', this).call(this);
    }
  }, {
    key: '_load',
    value: function _load(fileList) {
      var _this4 = this;

      var loader = new _wavesLoaders.SuperLoader();

      loader.progressCallback = this._onProgress.bind(this);
      loader.load(fileList).then(function (buffers) {
        _this4.buffers = buffers;
        _this4.ready();
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
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Loader);

exports.default = Loader;
//# sourceMappingURL=data:application/json;base64,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RUFBb0MsTUFBcEM7O2tCQUVlIiwiZmlsZSI6IkxvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN1cGVyTG9hZGVyIH0gZnJvbSAnd2F2ZXMtbG9hZGVycyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cblxuLyoqXG4gKiBEZWZhdWx0IGxvYWRlciB2aWV3XG4gKi9cbmNsYXNzIExvYWRlclZpZXcgZXh0ZW5kcyBTZWdtZW50ZWRWaWV3IHtcbiAgb25SZW5kZXIoKSB7XG4gICAgc3VwZXIub25SZW5kZXIoKTtcbiAgICB0aGlzLiRwcm9ncmVzc0JhciA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmVzcy1iYXInKTtcbiAgfVxuXG4gIG9uUHJvZ3Jlc3MocGVyY2VudCkge1xuICAgIGlmICghdGhpcy5jb250ZW50LnNob3dQcm9ncmVzcykgeyByZXR1cm47IH1cbiAgICB0aGlzLiRwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IGAke3BlcmNlbnR9JWA7XG4gIH1cbn1cblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bG9hZGVyJztcblxuLyoqXG4gKiBbY2xpZW50XSBMb2FkIGF1ZGlvIGZpbGVzIHRoYXQgY2FuIGJlIHVzZWQgYnkgb3RoZXIgbW9kdWxlcyAoKmUuZy4qLCB0aGUge0BsaW5rIFBlcmZvcm1hbmNlfSkuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgaGFzIGEgdmlldyAodGhhdCBkaXNwbGF5cyBhIHByb2dyZXNzIGJhcikgYW5kIHJlcXVpcmVzIHRoZSBTQVNTIHBhcnRpYWwgYF83Ny1sb2FkZXIuc2Nzc2AuXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gd2hlbiBhbGwgdGhlIGZpbGVzIGFyZSBsb2FkZWQuXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEluc3RhbnRpYXRlIHRoZSBtb2R1bGUgd2l0aCB0aGUgZmlsZXMgdG8gbG9hZFxuICogY29uc3QgbG9hZGVyID0gbmV3IExvYWRlcih7IGZpbGVzOiBbJ3NvdW5kcy9raWNrLm1wMycsICdzb3VuZHMvc25hcmUubXAzJ10gfSk7XG4gKlxuICogLy8gR2V0IHRoZSBjb3JyZXNwb25kaW5nIGF1ZGlvIGJ1ZmZlcnNcbiAqIGNvbnN0IGtpY2tCdWZmZXIgPSBsb2FkZXIuYXVkaW9CdWZmZXJzWzBdO1xuICogY29uc3Qgc25hcmVCdWZmZXIgPSBsb2FkZXIuYXVkaW9CdWZmZXJzWzFdO1xuICovXG5jbGFzcyBMb2FkZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgZmFsc2UpO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH0gZGVmYXVsdCAtIERlZmF1bHQgb3B0aW9ucyBvZiB0aGUgc2VydmljZS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nW119IFtkZWZhdWx0LmZpbGVzPVtdXSAtIFRoZSBhdWRpbyBmaWxlcyB0byBsb2FkLlxuICAgICAqIEB0eXBlIHtCb29sZWFufSBbZGVmYXVsdC5zaG93UHJvZ3Jlc3M9dHJ1ZV0gLSBEZWZpbmVzIGlmIHRoZSBwcm9ncmVzcyBiYXIgaXMgcmVuZGVyZWQuIElmIHNldCB0byB0cnVlLCB0aGUgdmlldyBzaG91bGQgaW1wbGVtZW50IGFuIGBvblByb2dyZXNzKHBlcmNlbnQpYCBtZXRob2QuXG4gICAgICogQHR5cGUge1N0cmluZ30gW2RlZmF1bHQudmlld0N0b3I9TG9hZGVyVmlld10gLSBDb25zdHJ1Y3RvciBmb3IgdGhlIG1vZHVsZSdzIHZpZXcuXG4gICAgICovXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBzaG93UHJvZ3Jlc3M6IHRydWUsXG4gICAgICBmaWxlczogW10sXG4gICAgICB2aWV3Q3RvcjogTG9hZGVyVmlldyxcbiAgICAgIHZpZXdQcmlvcml0eTogNCxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGluaXQoKSB7XG4gICAgLyoqXG4gICAgICogQXVkaW8gYnVmZmVycyBjcmVhdGVkIGZyb20gdGhlIGF1ZGlvIGZpbGVzIHBhc3NlZCBpbiB0aGUge0BsaW5rIExvYWRlciNjb25zdHJ1Y3Rvcn0uXG4gICAgICogQHR5cGUge0FycmF5PEF1ZGlvQnVmZmVyPn1cbiAgICAgKi9cbiAgICB0aGlzLmJ1ZmZlcnMgPSBbXTtcbiAgICAvLyB0byB0cmFjayBmaWxlcyBsb2FkaW5nIHByb2dyZXNzXG4gICAgdGhpcy5fcHJvZ3Jlc3MgPSBbXTtcbiAgICB0aGlzLm9wdGlvbnMuZmlsZXMuZm9yRWFjaCgoZmlsZSwgaW5kZXgpID0+IHRoaXMuX3Byb2dyZXNzW2luZGV4XSA9IDApO1xuXG4gICAgLy8gcHJlcGFyZSB2aWV3XG4gICAgdGhpcy5jb250ZW50LnNob3dQcm9ncmVzcyA9IHRoaXMub3B0aW9ucy5zaG93UHJvZ3Jlc3M7XG4gICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5fbG9hZCh0aGlzLm9wdGlvbnMuZmlsZXMpO1xuICAgIHRoaXMuc2hvdygpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICBfbG9hZChmaWxlTGlzdCkge1xuICAgIGNvbnN0IGxvYWRlciA9IG5ldyBTdXBlckxvYWRlcigpO1xuXG4gICAgbG9hZGVyLnByb2dyZXNzQ2FsbGJhY2sgPSB0aGlzLl9vblByb2dyZXNzLmJpbmQodGhpcyk7XG4gICAgbG9hZGVyLmxvYWQoZmlsZUxpc3QpXG4gICAgICAudGhlbigoYnVmZmVycykgPT4ge1xuICAgICAgICB0aGlzLmJ1ZmZlcnMgPSBidWZmZXJzO1xuICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICB9KTtcbiAgfVxuXG4gIF9vblByb2dyZXNzKGUpIHtcbiAgICB0aGlzLl9wcm9ncmVzc1tlLmluZGV4XSA9IGUudmFsdWU7XG5cbiAgICBsZXQgcHJvZ3Jlc3MgPSB0aGlzLl9wcm9ncmVzcy5yZWR1Y2UoKHByZXYsIGN1cnJlbnQpID0+IHByZXYgKyBjdXJyZW50LCAwKTtcbiAgICBwcm9ncmVzcyAvPSB0aGlzLl9wcm9ncmVzcy5sZW5ndGg7XG5cbiAgICBpZiAodGhpcy52aWV3ICYmIHRoaXMudmlldy5vblByb2dyZXNzKVxuICAgICAgdGhpcy52aWV3Lm9uUHJvZ3Jlc3MocHJvZ3Jlc3MgKiAxMDApO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIExvYWRlcik7XG5cbmV4cG9ydCBkZWZhdWx0IExvYWRlcjtcbiJdfQ==