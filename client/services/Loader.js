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

var _SegmentedView2 = require('../display/SegmentedView');

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
//# sourceMappingURL=data:application/json;base64,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RUFBb0MsTUFBcEM7O2tCQUVlIiwiZmlsZSI6IkxvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN1cGVyTG9hZGVyIH0gZnJvbSAnd2F2ZXMtbG9hZGVycyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi9kaXNwbGF5L1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuXG4vKipcbiAqIERlZmF1bHQgbG9hZGVyIHZpZXdcbiAqL1xuY2xhc3MgTG9hZGVyVmlldyBleHRlbmRzIFNlZ21lbnRlZFZpZXcge1xuICBvblJlbmRlcigpIHtcbiAgICBzdXBlci5vblJlbmRlcigpO1xuICAgIHRoaXMuJHByb2dyZXNzQmFyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLnByb2dyZXNzLWJhcicpO1xuICB9XG5cbiAgb25Qcm9ncmVzcyhwZXJjZW50KSB7XG4gICAgaWYgKCF0aGlzLmNvbnRlbnQuc2hvd1Byb2dyZXNzKSB7IHJldHVybjsgfVxuICAgIHRoaXMuJHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gYCR7cGVyY2VudH0lYDtcbiAgfVxufVxuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpsb2FkZXInO1xuXG4vKipcbiAqIFtjbGllbnRdIExvYWQgYXVkaW8gZmlsZXMgdGhhdCBjYW4gYmUgdXNlZCBieSBvdGhlciBtb2R1bGVzICgqZS5nLiosIHRoZSB7QGxpbmsgUGVyZm9ybWFuY2V9KS5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3ICh0aGF0IGRpc3BsYXlzIGEgcHJvZ3Jlc3MgYmFyKSBhbmQgcmVxdWlyZXMgdGhlIFNBU1MgcGFydGlhbCBgXzc3LWxvYWRlci5zY3NzYC5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIGFsbCB0aGUgZmlsZXMgYXJlIGxvYWRlZC5cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gSW5zdGFudGlhdGUgdGhlIG1vZHVsZSB3aXRoIHRoZSBmaWxlcyB0byBsb2FkXG4gKiBjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKHsgZmlsZXM6IFsnc291bmRzL2tpY2subXAzJywgJ3NvdW5kcy9zbmFyZS5tcDMnXSB9KTtcbiAqXG4gKiAvLyBHZXQgdGhlIGNvcnJlc3BvbmRpbmcgYXVkaW8gYnVmZmVyc1xuICogY29uc3Qga2lja0J1ZmZlciA9IGxvYWRlci5hdWRpb0J1ZmZlcnNbMF07XG4gKiBjb25zdCBzbmFyZUJ1ZmZlciA9IGxvYWRlci5hdWRpb0J1ZmZlcnNbMV07XG4gKi9cbmNsYXNzIExvYWRlciBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fSBkZWZhdWx0IC0gRGVmYXVsdCBvcHRpb25zIG9mIHRoZSBzZXJ2aWNlLlxuICAgICAqIEB0eXBlIHtTdHJpbmdbXX0gW2RlZmF1bHQuZmlsZXM9W11dIC0gVGhlIGF1ZGlvIGZpbGVzIHRvIGxvYWQuXG4gICAgICogQHR5cGUge0Jvb2xlYW59IFtkZWZhdWx0LnNob3dQcm9ncmVzcz10cnVlXSAtIERlZmluZXMgaWYgdGhlIHByb2dyZXNzIGJhciBpcyByZW5kZXJlZC4gSWYgc2V0IHRvIHRydWUsIHRoZSB2aWV3IHNob3VsZCBpbXBsZW1lbnQgYW4gYG9uUHJvZ3Jlc3MocGVyY2VudClgIG1ldGhvZC5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfSBbZGVmYXVsdC52aWV3Q3Rvcj1Mb2FkZXJWaWV3XSAtIENvbnN0cnVjdG9yIGZvciB0aGUgbW9kdWxlJ3Mgdmlldy5cbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHNob3dQcm9ncmVzczogdHJ1ZSxcbiAgICAgIGZpbGVzOiBbXSxcbiAgICAgIHZpZXdDdG9yOiBMb2FkZXJWaWV3LFxuICAgICAgdmlld1ByaW9yaXR5OiA0LFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBBdWRpbyBidWZmZXJzIGNyZWF0ZWQgZnJvbSB0aGUgYXVkaW8gZmlsZXMgcGFzc2VkIGluIHRoZSB7QGxpbmsgTG9hZGVyI2NvbnN0cnVjdG9yfS5cbiAgICAgKiBAdHlwZSB7QXJyYXk8QXVkaW9CdWZmZXI+fVxuICAgICAqL1xuICAgIHRoaXMuYnVmZmVycyA9IFtdO1xuICAgIC8vIHRvIHRyYWNrIGZpbGVzIGxvYWRpbmcgcHJvZ3Jlc3NcbiAgICB0aGlzLl9wcm9ncmVzcyA9IFtdO1xuICAgIHRoaXMub3B0aW9ucy5maWxlcy5mb3JFYWNoKChmaWxlLCBpbmRleCkgPT4gdGhpcy5fcHJvZ3Jlc3NbaW5kZXhdID0gMCk7XG5cbiAgICAvLyBwcmVwYXJlIHZpZXdcbiAgICB0aGlzLmNvbnRlbnQuc2hvd1Byb2dyZXNzID0gdGhpcy5vcHRpb25zLnNob3dQcm9ncmVzcztcbiAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLl9sb2FkKHRoaXMub3B0aW9ucy5maWxlcyk7XG4gICAgdGhpcy5zaG93KCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIF9sb2FkKGZpbGVMaXN0KSB7XG4gICAgY29uc3QgbG9hZGVyID0gbmV3IFN1cGVyTG9hZGVyKCk7XG5cbiAgICBsb2FkZXIucHJvZ3Jlc3NDYWxsYmFjayA9IHRoaXMuX29uUHJvZ3Jlc3MuYmluZCh0aGlzKTtcbiAgICBsb2FkZXIubG9hZChmaWxlTGlzdClcbiAgICAgIC50aGVuKChidWZmZXJzKSA9PiB7XG4gICAgICAgIHRoaXMuYnVmZmVycyA9IGJ1ZmZlcnM7XG4gICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgX29uUHJvZ3Jlc3MoZSkge1xuICAgIHRoaXMuX3Byb2dyZXNzW2UuaW5kZXhdID0gZS52YWx1ZTtcblxuICAgIGxldCBwcm9ncmVzcyA9IHRoaXMuX3Byb2dyZXNzLnJlZHVjZSgocHJldiwgY3VycmVudCkgPT4gcHJldiArIGN1cnJlbnQsIDApO1xuICAgIHByb2dyZXNzIC89IHRoaXMuX3Byb2dyZXNzLmxlbmd0aDtcblxuICAgIGlmICh0aGlzLnZpZXcgJiYgdGhpcy52aWV3Lm9uUHJvZ3Jlc3MpXG4gICAgICB0aGlzLnZpZXcub25Qcm9ncmVzcyhwcm9ncmVzcyAqIDEwMCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgTG9hZGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hZGVyO1xuIl19