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
 * [client] Load audio files.
 *
 * The service always has a view (that displays a progress bar) and requires the SASS partial `_77-loader.scss`.
 *
 * The service finishes its initialization when all the files are loaded.
 *
 * @example
 * // Instantiate the service with the files to load
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
     * @type {String} [default.viewCtor=LoaderView] - Constructor for the service's view.
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
      this.viewContent.showProgress = this.options.showProgress;
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
//# sourceMappingURL=data:application/json;base64,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QixFQUFvQyxNQUFwQzs7a0JBRWUiLCJmaWxlIjoiTG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3VwZXJMb2FkZXIgfSBmcm9tICd3YXZlcy1sb2FkZXJzJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4uL3ZpZXdzL1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuXG4vKipcbiAqIERlZmF1bHQgbG9hZGVyIHZpZXdcbiAqL1xuY2xhc3MgTG9hZGVyVmlldyBleHRlbmRzIFNlZ21lbnRlZFZpZXcge1xuICBvblJlbmRlcigpIHtcbiAgICBzdXBlci5vblJlbmRlcigpO1xuICAgIHRoaXMuJHByb2dyZXNzQmFyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLnByb2dyZXNzLWJhcicpO1xuICB9XG5cbiAgb25Qcm9ncmVzcyhwZXJjZW50KSB7XG4gICAgaWYgKCF0aGlzLmNvbnRlbnQuc2hvd1Byb2dyZXNzKSB7IHJldHVybjsgfVxuICAgIHRoaXMuJHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gYCR7cGVyY2VudH0lYDtcbiAgfVxufVxuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpsb2FkZXInO1xuXG4vKipcbiAqIFtjbGllbnRdIExvYWQgYXVkaW8gZmlsZXMuXG4gKlxuICogVGhlIHNlcnZpY2UgYWx3YXlzIGhhcyBhIHZpZXcgKHRoYXQgZGlzcGxheXMgYSBwcm9ncmVzcyBiYXIpIGFuZCByZXF1aXJlcyB0aGUgU0FTUyBwYXJ0aWFsIGBfNzctbG9hZGVyLnNjc3NgLlxuICpcbiAqIFRoZSBzZXJ2aWNlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIGFsbCB0aGUgZmlsZXMgYXJlIGxvYWRlZC5cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gSW5zdGFudGlhdGUgdGhlIHNlcnZpY2Ugd2l0aCB0aGUgZmlsZXMgdG8gbG9hZFxuICogY29uc3QgbG9hZGVyID0gbmV3IExvYWRlcih7IGZpbGVzOiBbJ3NvdW5kcy9raWNrLm1wMycsICdzb3VuZHMvc25hcmUubXAzJ10gfSk7XG4gKlxuICogLy8gR2V0IHRoZSBjb3JyZXNwb25kaW5nIGF1ZGlvIGJ1ZmZlcnNcbiAqIGNvbnN0IGtpY2tCdWZmZXIgPSBsb2FkZXIuYXVkaW9CdWZmZXJzWzBdO1xuICogY29uc3Qgc25hcmVCdWZmZXIgPSBsb2FkZXIuYXVkaW9CdWZmZXJzWzFdO1xuICovXG5jbGFzcyBMb2FkZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgZmFsc2UpO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH0gZGVmYXVsdCAtIERlZmF1bHQgb3B0aW9ucyBvZiB0aGUgc2VydmljZS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nW119IFtkZWZhdWx0LmZpbGVzPVtdXSAtIFRoZSBhdWRpbyBmaWxlcyB0byBsb2FkLlxuICAgICAqIEB0eXBlIHtCb29sZWFufSBbZGVmYXVsdC5zaG93UHJvZ3Jlc3M9dHJ1ZV0gLSBEZWZpbmVzIGlmIHRoZSBwcm9ncmVzcyBiYXIgaXMgcmVuZGVyZWQuIElmIHNldCB0byB0cnVlLCB0aGUgdmlldyBzaG91bGQgaW1wbGVtZW50IGFuIGBvblByb2dyZXNzKHBlcmNlbnQpYCBtZXRob2QuXG4gICAgICogQHR5cGUge1N0cmluZ30gW2RlZmF1bHQudmlld0N0b3I9TG9hZGVyVmlld10gLSBDb25zdHJ1Y3RvciBmb3IgdGhlIHNlcnZpY2UncyB2aWV3LlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgc2hvd1Byb2dyZXNzOiB0cnVlLFxuICAgICAgZmlsZXM6IFtdLFxuICAgICAgdmlld0N0b3I6IExvYWRlclZpZXcsXG4gICAgICB2aWV3UHJpb3JpdHk6IDQsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbml0KCkge1xuICAgIC8qKlxuICAgICAqIEF1ZGlvIGJ1ZmZlcnMgY3JlYXRlZCBmcm9tIHRoZSBhdWRpbyBmaWxlcyBwYXNzZWQgaW4gdGhlIHtAbGluayBMb2FkZXIjY29uc3RydWN0b3J9LlxuICAgICAqIEB0eXBlIHtBcnJheTxBdWRpb0J1ZmZlcj59XG4gICAgICovXG4gICAgdGhpcy5idWZmZXJzID0gW107XG4gICAgLy8gdG8gdHJhY2sgZmlsZXMgbG9hZGluZyBwcm9ncmVzc1xuICAgIHRoaXMuX3Byb2dyZXNzID0gW107XG4gICAgdGhpcy5vcHRpb25zLmZpbGVzLmZvckVhY2goKGZpbGUsIGluZGV4KSA9PiB0aGlzLl9wcm9ncmVzc1tpbmRleF0gPSAwKTtcblxuICAgIC8vIHByZXBhcmUgdmlld1xuICAgIHRoaXMudmlld0NvbnRlbnQuc2hvd1Byb2dyZXNzID0gdGhpcy5vcHRpb25zLnNob3dQcm9ncmVzcztcbiAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLl9sb2FkKHRoaXMub3B0aW9ucy5maWxlcyk7XG4gICAgdGhpcy5zaG93KCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIF9sb2FkKGZpbGVMaXN0KSB7XG4gICAgY29uc3QgbG9hZGVyID0gbmV3IFN1cGVyTG9hZGVyKCk7XG5cbiAgICBsb2FkZXIucHJvZ3Jlc3NDYWxsYmFjayA9IHRoaXMuX29uUHJvZ3Jlc3MuYmluZCh0aGlzKTtcbiAgICBsb2FkZXIubG9hZChmaWxlTGlzdClcbiAgICAgIC50aGVuKChidWZmZXJzKSA9PiB7XG4gICAgICAgIHRoaXMuYnVmZmVycyA9IGJ1ZmZlcnM7XG4gICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgX29uUHJvZ3Jlc3MoZSkge1xuICAgIHRoaXMuX3Byb2dyZXNzW2UuaW5kZXhdID0gZS52YWx1ZTtcblxuICAgIGxldCBwcm9ncmVzcyA9IHRoaXMuX3Byb2dyZXNzLnJlZHVjZSgocHJldiwgY3VycmVudCkgPT4gcHJldiArIGN1cnJlbnQsIDApO1xuICAgIHByb2dyZXNzIC89IHRoaXMuX3Byb2dyZXNzLmxlbmd0aDtcblxuICAgIGlmICh0aGlzLnZpZXcgJiYgdGhpcy52aWV3Lm9uUHJvZ3Jlc3MpXG4gICAgICB0aGlzLnZpZXcub25Qcm9ncmVzcyhwcm9ncmVzcyAqIDEwMCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgTG9hZGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hZGVyO1xuIl19