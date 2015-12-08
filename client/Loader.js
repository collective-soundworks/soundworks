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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzRCQUE0QixlQUFlOztzQkFDeEIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0JwQixNQUFNO1lBQU4sTUFBTTs7Ozs7Ozs7OztBQVFkLFdBUlEsTUFBTSxHQVFDO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFSTCxNQUFNOztBQVN2QiwrQkFUaUIsTUFBTSw2Q0FTakIsT0FBTyxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Ozs7OztBQU1yRCxRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztBQUNwQyxRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO0FBQzVDLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxhQUFhLEdBQUcsQUFBQyxPQUFPLENBQUMsWUFBWSxLQUFLLFNBQVMsR0FDdEQsT0FBTyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7O0FBRTlCLFFBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDN0MsVUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRCxpQkFBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM5QyxpQkFBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7QUFD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LFVBQUMsT0FBTyxFQUFLO0FBQ2pCLGlCQUFLLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsaUJBQUssSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDbkMsaUJBQUssSUFBSSxFQUFFLENBQUM7U0FDYixFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ1osaUJBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEIsQ0FBQyxDQUFDO09BQ047S0FDRjs7O1dBRWdCLDJCQUFDLEdBQUcsRUFBRTtBQUNyQixVQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQzVCLFVBQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDL0IsVUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDOztBQUVqQixVQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFlBQVksQ0FBQzs7QUFFN0MsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2xELGdCQUFRLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztPQUMvRDs7QUFFRCxVQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDckIsZ0JBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNyQyxZQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsUUFBUSxHQUFHLEdBQUcsQ0FBQztPQUNoRDtLQUNGOzs7U0EzSGtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN1cGVyTG9hZGVyIH0gZnJvbSAnd2F2ZXMtbG9hZGVycyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gTG9hZCBhdWRpbyBmaWxlcyB0aGF0IGNhbiBiZSB1c2VkIGJ5IG90aGVyIG1vZHVsZXMgKCplLmcuKiwgdGhlIHtAbGluayBQZXJmb3JtYW5jZX0pLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcgKHRoYXQgZGlzcGxheXMgYSBwcm9ncmVzcyBiYXIpIGFuZCByZXF1aXJlcyB0aGUgU0FTUyBwYXJ0aWFsIGBfNzctbG9hZGVyLnNjc3NgLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gYWxsIHRoZSBmaWxlcyBhcmUgbG9hZGVkLlxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBJbnN0YW50aWF0ZSB0aGUgbW9kdWxlIHdpdGggdGhlIGZpbGVzIHRvIGxvYWRcbiAqIGNvbnN0IGxvYWRlciA9IG5ldyBMb2FkZXIoWydzb3VuZHMva2ljay5tcDMnLCAnc291bmRzL3NuYXJlLm1wMyddKTtcbiAqXG4gKiAvLyBHZXQgdGhlIGNvcnJlc3BvbmRpbmcgYXVkaW8gYnVmZmVyc1xuICogY29uc3Qga2lja0J1ZmZlciA9IGxvYWRlci5hdWRpb0J1ZmZlcnNbMF07XG4gKiBjb25zdCBzbmFyZUJ1ZmZlciA9IGxvYWRlci5hdWRpb0J1ZmZlcnNbMV07XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRlciBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdkaWFsb2cnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtvcHRpb25zLmZpbGVzPW51bGxdIFRoZSBhdWRpbyBmaWxlcyB0byBsb2FkLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmFzeW5jaHJvbm91cz1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdG8gbG9hZCB0aGUgZmlsZXMgYXN5bmNocm9ub3VzbHkgb3Igbm90LlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdsb2FkZXInLCB0cnVlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIC8qKlxuICAgICAqIEF1ZGlvIGJ1ZmZlcnMgY3JlYXRlZCBmcm9tIHRoZSBhdWRpbyBmaWxlcyBwYXNzZWQgaW4gdGhlIHtAbGluayBMb2FkZXIjY29uc3RydWN0b3J9LlxuICAgICAqIEB0eXBlIHtBdWRpb0J1ZmZlcltdfVxuICAgICAqL1xuICAgIHRoaXMuYnVmZmVycyA9IFtdO1xuXG4gICAgdGhpcy5fZmlsZXMgPSBvcHRpb25zLmZpbGVzIHx8IG51bGw7XG4gICAgdGhpcy5fYXN5bmNocm9ub3VzID0gISFvcHRpb25zLmFzeW5jaHJvbm91czsgLy8gQG5vdGUgYmFkIG5hbWUgbG9hZGluZyBpcyBhbHdheXMgYXN5bmNocm9ub3VzIGFzIGl0IGlzIGFqYXhcbiAgICB0aGlzLl9maWxlUHJvZ3Jlc3MgPSBudWxsO1xuICAgIHRoaXMuX3Byb2dyZXNzQmFyID0gbnVsbDtcbiAgICB0aGlzLl9udW1GaWxlc0xvYWRlZCA9IDA7XG4gICAgdGhpcy5fc2hvd1Byb2dyZXNzID0gKG9wdGlvbnMuc2hvd1Byb2dyZXNzICE9PSB1bmRlZmluZWQpID9cbiAgICAgIG9wdGlvbnMuc2hvd1Byb2dyZXNzIDogdHJ1ZTtcblxuICAgIGlmICghdGhpcy5fYXN5bmNocm9ub3VzICYmIHRoaXMuX3Nob3dQcm9ncmVzcykge1xuICAgICAgbGV0IHZpZXdDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB2aWV3Q29udGVudC5jbGFzc0xpc3QuYWRkKCdjZW50ZXJlZC1jb250ZW50Jyk7XG4gICAgICB2aWV3Q29udGVudC5jbGFzc0xpc3QuYWRkKCdzb2Z0LWJsaW5rJyk7XG4gICAgICB0aGlzLnZpZXcuYXBwZW5kQ2hpbGQodmlld0NvbnRlbnQpO1xuXG4gICAgICBsZXQgbG9hZGluZ1RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICBsb2FkaW5nVGV4dC5pbm5lckhUTUwgPSBcIkxvYWRpbmcgc291bmRz4oCmXCI7XG4gICAgICB2aWV3Q29udGVudC5hcHBlbmRDaGlsZChsb2FkaW5nVGV4dCk7XG5cbiAgICAgIGxldCBwcm9ncmVzc1dyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHByb2dyZXNzV3JhcC5jbGFzc0xpc3QuYWRkKCdwcm9ncmVzcy13cmFwJyk7XG4gICAgICB2aWV3Q29udGVudC5hcHBlbmRDaGlsZChwcm9ncmVzc1dyYXApO1xuXG4gICAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5hZGQoJ3Byb2dyZXNzLWJhcicpO1xuICAgICAgcHJvZ3Jlc3NXcmFwLmFwcGVuZENoaWxkKHByb2dyZXNzQmFyKTtcblxuICAgICAgdGhpcy5fcHJvZ3Jlc3NCYXIgPSBwcm9ncmVzc0JhcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5fbG9hZCh0aGlzLl9maWxlcyk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgX2xvYWRGaWxlKGluZGV4LCBmaWxlKSB7XG4gICAgY29uc3QgbG9hZGVyID0gbmV3IFN1cGVyTG9hZGVyKCk7XG5cbiAgICBsb2FkZXJcbiAgICAgIC5sb2FkKFtmaWxlXSlcbiAgICAgIC50aGVuKChidWZmZXJzKSA9PiB7XG4gICAgICAgIGxldCBidWZmZXIgPSBidWZmZXJzWzBdO1xuXG4gICAgICAgIHRoaXMuYnVmZmVyc1tpbmRleF0gPSBidWZmZXI7XG4gICAgICAgIHRoaXMuZW1pdCgnbG9hZGVyOmZpbGVMb2FkZWQnLCBpbmRleCwgZmlsZSwgYnVmZmVyKTtcblxuICAgICAgICB0aGlzLl9udW1GaWxlc0xvYWRlZCsrO1xuICAgICAgICBpZiAodGhpcy5fbnVtRmlsZXNMb2FkZWQgPj0gdGhpcy5idWZmZXJzLmxlbmd0aClcbiAgICAgICAgICB0aGlzLmVtaXQoJ2xvYWRlcjphbGxGaWxlc0xvYWRlZCcpO1xuICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgX2xvYWQoZmlsZUxpc3QpIHtcbiAgICBpZiAodGhpcy5fYXN5bmNocm9ub3VzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVMaXN0Lmxlbmd0aDsgaSsrKVxuICAgICAgICB0aGlzLl9sb2FkRmlsZShpLCBmaWxlTGlzdFtpXSk7XG5cbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBsb2FkZXIgPSBuZXcgU3VwZXJMb2FkZXIoKTtcblxuICAgICAgdGhpcy5fZmlsZVByb2dyZXNzID0gW107XG5cbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBmaWxlTGlzdC5sZW5ndGg7IGkrKylcbiAgICAgICAgdGhpcy5fZmlsZVByb2dyZXNzW2ldID0gMDtcblxuICAgICAgbG9hZGVyLnByb2dyZXNzQ2FsbGJhY2sgPSB0aGlzLl9wcm9ncmVzc0NhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICBsb2FkZXIubG9hZChmaWxlTGlzdClcbiAgICAgICAgLnRoZW4oKGJ1ZmZlcnMpID0+IHtcbiAgICAgICAgICB0aGlzLmJ1ZmZlcnMgPSBidWZmZXJzO1xuICAgICAgICAgIHRoaXMuZW1pdCgnbG9hZGVyOmFsbEZpbGVzTG9hZGVkJyk7XG4gICAgICAgICAgdGhpcy5kb25lKCk7XG4gICAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX3Byb2dyZXNzQ2FsbGJhY2sob2JqKSB7XG4gICAgY29uc3QgZmlsZUluZGV4ID0gb2JqLmluZGV4O1xuICAgIGNvbnN0IGZpbGVQcm9ncmVzcyA9IG9iai52YWx1ZTtcbiAgICBsZXQgcHJvZ3Jlc3MgPSAwO1xuXG4gICAgdGhpcy5fZmlsZVByb2dyZXNzW2ZpbGVJbmRleF0gPSBmaWxlUHJvZ3Jlc3M7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2ZpbGVQcm9ncmVzcy5sZW5ndGg7IGkrKykge1xuICAgICAgcHJvZ3Jlc3MgKz0gdGhpcy5fZmlsZVByb2dyZXNzW2ldIC8gdGhpcy5fZmlsZVByb2dyZXNzLmxlbmd0aDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcHJvZ3Jlc3NCYXIpIHtcbiAgICAgIHByb2dyZXNzID0gTWF0aC5jZWlsKHByb2dyZXNzICogMTAwKTtcbiAgICAgIHRoaXMuX3Byb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gcHJvZ3Jlc3MgKyAnJSc7XG4gICAgfVxuICB9XG59XG4iXX0=