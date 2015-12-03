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

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

/**
 * [client] Load audio files that can be used by other modules (*e.g.*, the {@link Performance}).
 *
 * The module always has a view (that displays a progress bar) and requires the SASS partial `_77-loader.scss`.
 *
 * The module finishes its initialization when all the files are loaded.
 *
 * @example
 * // Instantiate the module with the files to load
 * const loader = new Loader(['sounds/kick.mp3', 'sounds/snare.mp3']);
 *
 * // Get the corresponding audio buffers
 * const kickBuffer = loader.audioBuffers[0];
 * const snareBuffer = loader.audioBuffers[1];
 */

var Loader = (function (_ClientModule) {
  _inherits(Loader, _ClientModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='dialog'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String[]} [options.files=null] The audio files to load.
   * @param {Boolean} [options.asynchronous=false] Indicates whether to load the files asynchronously or not.
   */

  function Loader() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Loader);

    _get(Object.getPrototypeOf(Loader.prototype), 'constructor', this).call(this, options.name || 'loader', true, options.color);

    /**
     * Audio buffers created from the audio files passed in the {@link Loader#constructor}.
     * @type {AudioBuffer[]}
     */
    this.buffers = [];

    this._files = options.files || null;
    this._asynchronous = !!options.asynchronous; // @note bad name loading is always asynchronous as it is ajax
    this._fileProgress = null;
    this._progressBar = null;
    this._numFilesLoaded = 0;
    this._showProgress = options.showProgress !== undefined ? options.showProgress : true;

    if (!this._asynchronous && this._showProgress) {
      var viewContent = document.createElement('div');
      viewContent.classList.add('centered-content');
      viewContent.classList.add('soft-blink');
      this.view.appendChild(viewContent);

      var loadingText = document.createElement('p');
      loadingText.innerHTML = "Loading sounds…";
      viewContent.appendChild(loadingText);

      var progressWrap = document.createElement('div');
      progressWrap.classList.add('progress-wrap');
      viewContent.appendChild(progressWrap);

      var progressBar = document.createElement('div');
      progressBar.classList.add('progress-bar');
      progressWrap.appendChild(progressBar);

      this._progressBar = progressBar;
    }
  }

  /**
   * @private
   */

  _createClass(Loader, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Loader.prototype), 'start', this).call(this);
      this._load(this._files);
    }

    /**
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(Loader.prototype), 'restart', this).call(this);
      this.done();
    }
  }, {
    key: '_loadFile',
    value: function _loadFile(index, file) {
      var _this = this;

      var loader = new _wavesLoaders.SuperLoader();

      loader.load([file]).then(function (buffers) {
        var buffer = buffers[0];

        _this.buffers[index] = buffer;
        _this.emit('loader:fileLoaded', index, file, buffer);

        _this._numFilesLoaded++;
        if (_this._numFilesLoaded >= _this.buffers.length) _this.emit('loader:allFilesLoaded');
      }, function (error) {
        console.log(error);
      });
    }
  }, {
    key: '_load',
    value: function _load(fileList) {
      var _this2 = this;

      if (this._asynchronous) {
        for (var i = 0; i < fileList.length; i++) {
          this._loadFile(i, fileList[i]);
        }this.done();
      } else {
        var loader = new _wavesLoaders.SuperLoader();

        this._fileProgress = [];

        for (var i = 0; i < fileList.length; i++) {
          this._fileProgress[i] = 0;
        }loader.progressCallback = this._progressCallback.bind(this);
        loader.load(fileList).then(function (buffers) {
          _this2.buffers = buffers;
          _this2.emit('loader:allFilesLoaded');
          _this2.done();
        }, function (error) {
          console.log(error);
        });
      }
    }
  }, {
    key: '_progressCallback',
    value: function _progressCallback(obj) {
      var fileIndex = obj.index;
      var fileProgress = obj.value;
      var progress = 0;

      this._fileProgress[fileIndex] = fileProgress;

      for (var i = 0; i < this._fileProgress.length; i++) {
        progress += this._fileProgress[i] / this._fileProgress.length;
      }

      if (this._progressBar) {
        progress = Math.ceil(progress * 100);
        this._progressBar.style.width = progress + '%';
      }
    }
  }]);

  return Loader;
})(_ClientModule3['default']);

exports['default'] = Loader;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUFPLEVBQUs7QUFDakIsaUJBQUssT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixpQkFBSyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUNuQyxpQkFBSyxJQUFJLEVBQUUsQ0FBQztTQUNiLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDWixpQkFBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNwQixDQUFDLENBQUM7T0FDTjtLQUNGOzs7V0FFZ0IsMkJBQUMsR0FBRyxFQUFFO0FBQ3JCLFVBQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDNUIsVUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUMvQixVQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7O0FBRWpCLFVBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsWUFBWSxDQUFDOztBQUU3QyxXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbEQsZ0JBQVEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO09BQy9EOztBQUVELFVBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtBQUNyQixnQkFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ3JDLFlBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDO09BQ2hEO0tBQ0Y7OztTQTNIa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoic3JjL2NsaWVudC9Mb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdXBlckxvYWRlciB9IGZyb20gJ3dhdmVzLWxvYWRlcnMnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcblxuXG4vKipcbiAqIFtjbGllbnRdIExvYWQgYXVkaW8gZmlsZXMgdGhhdCBjYW4gYmUgdXNlZCBieSBvdGhlciBtb2R1bGVzICgqZS5nLiosIHRoZSB7QGxpbmsgUGVyZm9ybWFuY2V9KS5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3ICh0aGF0IGRpc3BsYXlzIGEgcHJvZ3Jlc3MgYmFyKSBhbmQgcmVxdWlyZXMgdGhlIFNBU1MgcGFydGlhbCBgXzc3LWxvYWRlci5zY3NzYC5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIGFsbCB0aGUgZmlsZXMgYXJlIGxvYWRlZC5cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gSW5zdGFudGlhdGUgdGhlIG1vZHVsZSB3aXRoIHRoZSBmaWxlcyB0byBsb2FkXG4gKiBjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKFsnc291bmRzL2tpY2subXAzJywgJ3NvdW5kcy9zbmFyZS5tcDMnXSk7XG4gKlxuICogLy8gR2V0IHRoZSBjb3JyZXNwb25kaW5nIGF1ZGlvIGJ1ZmZlcnNcbiAqIGNvbnN0IGtpY2tCdWZmZXIgPSBsb2FkZXIuYXVkaW9CdWZmZXJzWzBdO1xuICogY29uc3Qgc25hcmVCdWZmZXIgPSBsb2FkZXIuYXVkaW9CdWZmZXJzWzFdO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkZXIgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nZGlhbG9nJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbb3B0aW9ucy5maWxlcz1udWxsXSBUaGUgYXVkaW8gZmlsZXMgdG8gbG9hZC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5hc3luY2hyb25vdXM9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRvIGxvYWQgdGhlIGZpbGVzIGFzeW5jaHJvbm91c2x5IG9yIG5vdC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnbG9hZGVyJywgdHJ1ZSwgb3B0aW9ucy5jb2xvcik7XG5cbiAgICAvKipcbiAgICAgKiBBdWRpbyBidWZmZXJzIGNyZWF0ZWQgZnJvbSB0aGUgYXVkaW8gZmlsZXMgcGFzc2VkIGluIHRoZSB7QGxpbmsgTG9hZGVyI2NvbnN0cnVjdG9yfS5cbiAgICAgKiBAdHlwZSB7QXVkaW9CdWZmZXJbXX1cbiAgICAgKi9cbiAgICB0aGlzLmJ1ZmZlcnMgPSBbXTtcblxuICAgIHRoaXMuX2ZpbGVzID0gb3B0aW9ucy5maWxlcyB8fCBudWxsO1xuICAgIHRoaXMuX2FzeW5jaHJvbm91cyA9ICEhb3B0aW9ucy5hc3luY2hyb25vdXM7IC8vIEBub3RlIGJhZCBuYW1lIGxvYWRpbmcgaXMgYWx3YXlzIGFzeW5jaHJvbm91cyBhcyBpdCBpcyBhamF4XG4gICAgdGhpcy5fZmlsZVByb2dyZXNzID0gbnVsbDtcbiAgICB0aGlzLl9wcm9ncmVzc0JhciA9IG51bGw7XG4gICAgdGhpcy5fbnVtRmlsZXNMb2FkZWQgPSAwO1xuICAgIHRoaXMuX3Nob3dQcm9ncmVzcyA9IChvcHRpb25zLnNob3dQcm9ncmVzcyAhPT0gdW5kZWZpbmVkKSA/XG4gICAgICBvcHRpb25zLnNob3dQcm9ncmVzcyA6IHRydWU7XG5cbiAgICBpZiAoIXRoaXMuX2FzeW5jaHJvbm91cyAmJiB0aGlzLl9zaG93UHJvZ3Jlc3MpIHtcbiAgICAgIGxldCB2aWV3Q29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdmlld0NvbnRlbnQuY2xhc3NMaXN0LmFkZCgnY2VudGVyZWQtY29udGVudCcpO1xuICAgICAgdmlld0NvbnRlbnQuY2xhc3NMaXN0LmFkZCgnc29mdC1ibGluaycpO1xuICAgICAgdGhpcy52aWV3LmFwcGVuZENoaWxkKHZpZXdDb250ZW50KTtcblxuICAgICAgbGV0IGxvYWRpbmdUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgbG9hZGluZ1RleHQuaW5uZXJIVE1MID0gXCJMb2FkaW5nIHNvdW5kc+KAplwiO1xuICAgICAgdmlld0NvbnRlbnQuYXBwZW5kQ2hpbGQobG9hZGluZ1RleHQpO1xuXG4gICAgICBsZXQgcHJvZ3Jlc3NXcmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBwcm9ncmVzc1dyYXAuY2xhc3NMaXN0LmFkZCgncHJvZ3Jlc3Mtd3JhcCcpO1xuICAgICAgdmlld0NvbnRlbnQuYXBwZW5kQ2hpbGQocHJvZ3Jlc3NXcmFwKTtcblxuICAgICAgbGV0IHByb2dyZXNzQmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QuYWRkKCdwcm9ncmVzcy1iYXInKTtcbiAgICAgIHByb2dyZXNzV3JhcC5hcHBlbmRDaGlsZChwcm9ncmVzc0Jhcik7XG5cbiAgICAgIHRoaXMuX3Byb2dyZXNzQmFyID0gcHJvZ3Jlc3NCYXI7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIHRoaXMuX2xvYWQodGhpcy5fZmlsZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIF9sb2FkRmlsZShpbmRleCwgZmlsZSkge1xuICAgIGNvbnN0IGxvYWRlciA9IG5ldyBTdXBlckxvYWRlcigpO1xuXG4gICAgbG9hZGVyXG4gICAgICAubG9hZChbZmlsZV0pXG4gICAgICAudGhlbigoYnVmZmVycykgPT4ge1xuICAgICAgICBsZXQgYnVmZmVyID0gYnVmZmVyc1swXTtcblxuICAgICAgICB0aGlzLmJ1ZmZlcnNbaW5kZXhdID0gYnVmZmVyO1xuICAgICAgICB0aGlzLmVtaXQoJ2xvYWRlcjpmaWxlTG9hZGVkJywgaW5kZXgsIGZpbGUsIGJ1ZmZlcik7XG5cbiAgICAgICAgdGhpcy5fbnVtRmlsZXNMb2FkZWQrKztcbiAgICAgICAgaWYgKHRoaXMuX251bUZpbGVzTG9hZGVkID49IHRoaXMuYnVmZmVycy5sZW5ndGgpXG4gICAgICAgICAgdGhpcy5lbWl0KCdsb2FkZXI6YWxsRmlsZXNMb2FkZWQnKTtcbiAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgfVxuXG4gIF9sb2FkKGZpbGVMaXN0KSB7XG4gICAgaWYgKHRoaXMuX2FzeW5jaHJvbm91cykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlTGlzdC5sZW5ndGg7IGkrKylcbiAgICAgICAgdGhpcy5fbG9hZEZpbGUoaSwgZmlsZUxpc3RbaV0pO1xuXG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbG9hZGVyID0gbmV3IFN1cGVyTG9hZGVyKCk7XG5cbiAgICAgIHRoaXMuX2ZpbGVQcm9ncmVzcyA9IFtdO1xuXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgZmlsZUxpc3QubGVuZ3RoOyBpKyspXG4gICAgICAgIHRoaXMuX2ZpbGVQcm9ncmVzc1tpXSA9IDA7XG5cbiAgICAgIGxvYWRlci5wcm9ncmVzc0NhbGxiYWNrID0gdGhpcy5fcHJvZ3Jlc3NDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgbG9hZGVyLmxvYWQoZmlsZUxpc3QpXG4gICAgICAgIC50aGVuKChidWZmZXJzKSA9PiB7XG4gICAgICAgICAgdGhpcy5idWZmZXJzID0gYnVmZmVycztcbiAgICAgICAgICB0aGlzLmVtaXQoJ2xvYWRlcjphbGxGaWxlc0xvYWRlZCcpO1xuICAgICAgICAgIHRoaXMuZG9uZSgpO1xuICAgICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIF9wcm9ncmVzc0NhbGxiYWNrKG9iaikge1xuICAgIGNvbnN0IGZpbGVJbmRleCA9IG9iai5pbmRleDtcbiAgICBjb25zdCBmaWxlUHJvZ3Jlc3MgPSBvYmoudmFsdWU7XG4gICAgbGV0IHByb2dyZXNzID0gMDtcblxuICAgIHRoaXMuX2ZpbGVQcm9ncmVzc1tmaWxlSW5kZXhdID0gZmlsZVByb2dyZXNzO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9maWxlUHJvZ3Jlc3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHByb2dyZXNzICs9IHRoaXMuX2ZpbGVQcm9ncmVzc1tpXSAvIHRoaXMuX2ZpbGVQcm9ncmVzcy5sZW5ndGg7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3Byb2dyZXNzQmFyKSB7XG4gICAgICBwcm9ncmVzcyA9IE1hdGguY2VpbChwcm9ncmVzcyAqIDEwMCk7XG4gICAgICB0aGlzLl9wcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IHByb2dyZXNzICsgJyUnO1xuICAgIH1cbiAgfVxufVxuIl19