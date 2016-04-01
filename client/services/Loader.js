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
      if (this.content.showProgress) this.$progressBar.style.width = percent + '%';
    }
  }]);
  return LoaderView;
}(_SegmentedView3.default);

var SERVICE_ID = 'service:loader';

/**
 * Interface of the client `'loader'` service.
 *
 * This service allow to preload audio files and convert them into audio buffers
 * before the start of the experience.
 *
 * @param {Object} options
 * @param {Array<String>} options.files - List of files to load.
 * @param {Boolean} [options.showProgress=true] - Display the progress bar in the view.
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.loader = this.require('loader', { files: ['kick.mp3', 'snare.mp3'] });
 * // get the corresponding audio buffers when experience has started
 * const kickBuffer = this.loader.audioBuffers[0];
 * const snareBuffer = this.loader.audioBuffers[1];
 */

var Loader = function (_Service) {
  (0, _inherits3.default)(Loader, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Loader() {
    (0, _classCallCheck3.default)(this, Loader);

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
      /**
       * List of the audio buffers created from the audio files.
       * @type {Array<AudioBuffer>}
       */
      this.buffers = [];

      // track files loading progress
      this._progress = this.options.files.map(function () {
        return 0;
      });
      // prepare view
      this.viewContent.showProgress = this.options.showProgress;
      this.viewCtor = this.options.viewCtor;
      this.view = this.createView();
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Loader.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this._load(this.options.files);
      this.show();
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      this.hide();
      (0, _get3.default)((0, _getPrototypeOf2.default)(Loader.prototype), 'stop', this).call(this);
    }

    /** @private */

  }, {
    key: '_load',
    value: function _load(fileList) {
      var _this3 = this;

      var loader = new _wavesLoaders.SuperLoader();

      loader.progressCallback = this._onProgress.bind(this);
      loader.load(fileList).then(function (buffers) {
        _this3.buffers = buffers;
        _this3.ready();
      }, function (error) {
        console.error(error);
      });
    }

    /** @private */

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
//# sourceMappingURL=data:application/json;base64,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ZXIgfSBmcm9tICd3YXZlcy1sb2FkZXJzJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4uL3ZpZXdzL1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuXG5jbGFzcyBMb2FkZXJWaWV3IGV4dGVuZHMgU2VnbWVudGVkVmlldyB7XG4gIG9uUmVuZGVyKCkge1xuICAgIHN1cGVyLm9uUmVuZGVyKCk7XG4gICAgdGhpcy4kcHJvZ3Jlc3NCYXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcucHJvZ3Jlc3MtYmFyJyk7XG4gIH1cblxuICBvblByb2dyZXNzKHBlcmNlbnQpIHtcbiAgICBpZiAodGhpcy5jb250ZW50LnNob3dQcm9ncmVzcylcbiAgICAgIHRoaXMuJHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gYCR7cGVyY2VudH0lYDtcbiAgfVxufVxuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpsb2FkZXInO1xuXG4vKipcbiAqIEludGVyZmFjZSBvZiB0aGUgY2xpZW50IGAnbG9hZGVyJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgYWxsb3cgdG8gcHJlbG9hZCBhdWRpbyBmaWxlcyBhbmQgY29udmVydCB0aGVtIGludG8gYXVkaW8gYnVmZmVyc1xuICogYmVmb3JlIHRoZSBzdGFydCBvZiB0aGUgZXhwZXJpZW5jZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBvcHRpb25zLmZpbGVzIC0gTGlzdCBvZiBmaWxlcyB0byBsb2FkLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93UHJvZ3Jlc3M9dHJ1ZV0gLSBEaXNwbGF5IHRoZSBwcm9ncmVzcyBiYXIgaW4gdGhlIHZpZXcuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5sb2FkZXIgPSB0aGlzLnJlcXVpcmUoJ2xvYWRlcicsIHsgZmlsZXM6IFsna2ljay5tcDMnLCAnc25hcmUubXAzJ10gfSk7XG4gKiAvLyBnZXQgdGhlIGNvcnJlc3BvbmRpbmcgYXVkaW8gYnVmZmVycyB3aGVuIGV4cGVyaWVuY2UgaGFzIHN0YXJ0ZWRcbiAqIGNvbnN0IGtpY2tCdWZmZXIgPSB0aGlzLmxvYWRlci5hdWRpb0J1ZmZlcnNbMF07XG4gKiBjb25zdCBzbmFyZUJ1ZmZlciA9IHRoaXMubG9hZGVyLmF1ZGlvQnVmZmVyc1sxXTtcbiAqL1xuY2xhc3MgTG9hZGVyIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgZmFsc2UpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBzaG93UHJvZ3Jlc3M6IHRydWUsXG4gICAgICBmaWxlczogW10sXG4gICAgICB2aWV3Q3RvcjogTG9hZGVyVmlldyxcbiAgICAgIHZpZXdQcmlvcml0eTogNCxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGluaXQoKSB7XG4gICAgLyoqXG4gICAgICogTGlzdCBvZiB0aGUgYXVkaW8gYnVmZmVycyBjcmVhdGVkIGZyb20gdGhlIGF1ZGlvIGZpbGVzLlxuICAgICAqIEB0eXBlIHtBcnJheTxBdWRpb0J1ZmZlcj59XG4gICAgICovXG4gICAgdGhpcy5idWZmZXJzID0gW107XG5cbiAgICAvLyB0cmFjayBmaWxlcyBsb2FkaW5nIHByb2dyZXNzXG4gICAgdGhpcy5fcHJvZ3Jlc3MgPSB0aGlzLm9wdGlvbnMuZmlsZXMubWFwKCgpID0+IHsgcmV0dXJuIDAgfSk7XG4gICAgLy8gcHJlcGFyZSB2aWV3XG4gICAgdGhpcy52aWV3Q29udGVudC5zaG93UHJvZ3Jlc3MgPSB0aGlzLm9wdGlvbnMuc2hvd1Byb2dyZXNzO1xuICAgIHRoaXMudmlld0N0b3IgPSB0aGlzLm9wdGlvbnMudmlld0N0b3I7XG4gICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLl9sb2FkKHRoaXMub3B0aW9ucy5maWxlcyk7XG4gICAgdGhpcy5zaG93KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2xvYWQoZmlsZUxpc3QpIHtcbiAgICBjb25zdCBsb2FkZXIgPSBuZXcgU3VwZXJMb2FkZXIoKTtcblxuICAgIGxvYWRlci5wcm9ncmVzc0NhbGxiYWNrID0gdGhpcy5fb25Qcm9ncmVzcy5iaW5kKHRoaXMpO1xuICAgIGxvYWRlci5sb2FkKGZpbGVMaXN0KVxuICAgICAgLnRoZW4oKGJ1ZmZlcnMpID0+IHtcbiAgICAgICAgdGhpcy5idWZmZXJzID0gYnVmZmVycztcbiAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uUHJvZ3Jlc3MoZSkge1xuICAgIHRoaXMuX3Byb2dyZXNzW2UuaW5kZXhdID0gZS52YWx1ZTtcblxuICAgIGxldCBwcm9ncmVzcyA9IHRoaXMuX3Byb2dyZXNzLnJlZHVjZSgocHJldiwgY3VycmVudCkgPT4gcHJldiArIGN1cnJlbnQsIDApO1xuICAgIHByb2dyZXNzIC89IHRoaXMuX3Byb2dyZXNzLmxlbmd0aDtcblxuICAgIGlmICh0aGlzLnZpZXcgJiYgdGhpcy52aWV3Lm9uUHJvZ3Jlc3MpXG4gICAgICB0aGlzLnZpZXcub25Qcm9ncmVzcyhwcm9ncmVzcyAqIDEwMCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgTG9hZGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hZGVyO1xuIl19