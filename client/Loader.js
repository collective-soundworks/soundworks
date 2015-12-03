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

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

/**
 * [client] Load audio files that can be used by other modules (*e.g.*, the {@link Performance}).
 *
 * The module finishes its initialization when all the files are loaded.
 *
 * The module always has a view (that displays a progress bar) and requires the SASS partial `_77-loader.scss`.
 *
 * @example
 * // Instantiate the module with the files to load
 * const loader = new Loader(['sounds/kick.mp3', 'sounds/snare.mp3']);
 *
 * // Get the corresponding audio buffers
 * const kickBuffer = loader.audioBuffers[0];
 * const snareBuffer = loader.audioBuffers[1];
 */

var Loader = (function (_Module) {
  _inherits(Loader, _Module);

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
     * @type {Array}
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
})(_Module3['default']);

exports['default'] = Loader;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvTG9hZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBQTRCLGVBQWU7O3NCQUN4QixVQUFVOzs7O3VCQUNWLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0JSLE1BQU07WUFBTixNQUFNOzs7Ozs7Ozs7O0FBUWQsV0FSUSxNQUFNLEdBUUM7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVJMLE1BQU07O0FBU3ZCLCtCQVRpQixNQUFNLDZDQVNqQixPQUFPLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRTs7Ozs7O0FBTXJELFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVsQixRQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7QUFDNUMsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDekIsUUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUM7QUFDekIsUUFBSSxDQUFDLGFBQWEsR0FBRyxBQUFDLE9BQU8sQ0FBQyxZQUFZLEtBQUssU0FBUyxHQUN0RCxPQUFPLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzs7QUFFOUIsUUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUM3QyxVQUFJLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hELGlCQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzlDLGlCQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN4QyxVQUFJLENB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LEVBQUs7QUFDakIsaUJBQUssT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixpQkFBSyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUNuQyxpQkFBSyxJQUFJLEVBQUUsQ0FBQztTQUNiLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDWixpQkFBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNwQixDQUFDLENBQUM7T0FDTjtLQUNGOzs7V0FFZ0IsMkJBQUMsR0FBRyxFQUFFO0FBQ3JCLFVBQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDNUIsVUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUMvQixVQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7O0FBRWpCLFVBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsWUFBWSxDQUFDOztBQUU3QyxXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbEQsZ0JBQVEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO09BQy9EOztBQUVELFVBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtBQUNyQixnQkFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ3JDLFlBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDO09BQ2hEO0tBQ0Y7OztTQTNIa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoic3JjL2NsaWVudC9Mb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdXBlckxvYWRlciB9IGZyb20gJ3dhdmVzLWxvYWRlcnMnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG4vKipcbiAqIFtjbGllbnRdIExvYWQgYXVkaW8gZmlsZXMgdGhhdCBjYW4gYmUgdXNlZCBieSBvdGhlciBtb2R1bGVzICgqZS5nLiosIHRoZSB7QGxpbmsgUGVyZm9ybWFuY2V9KS5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIGFsbCB0aGUgZmlsZXMgYXJlIGxvYWRlZC5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3ICh0aGF0IGRpc3BsYXlzIGEgcHJvZ3Jlc3MgYmFyKSBhbmQgcmVxdWlyZXMgdGhlIFNBU1MgcGFydGlhbCBgXzc3LWxvYWRlci5zY3NzYC5cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gSW5zdGFudGlhdGUgdGhlIG1vZHVsZSB3aXRoIHRoZSBmaWxlcyB0byBsb2FkXG4gKiBjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKFsnc291bmRzL2tpY2subXAzJywgJ3NvdW5kcy9zbmFyZS5tcDMnXSk7XG4gKlxuICogLy8gR2V0IHRoZSBjb3JyZXNwb25kaW5nIGF1ZGlvIGJ1ZmZlcnNcbiAqIGNvbnN0IGtpY2tCdWZmZXIgPSBsb2FkZXIuYXVkaW9CdWZmZXJzWzBdO1xuICogY29uc3Qgc25hcmVCdWZmZXIgPSBsb2FkZXIuYXVkaW9CdWZmZXJzWzFdO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkZXIgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nZGlhbG9nJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbb3B0aW9ucy5maWxlcz1udWxsXSBUaGUgYXVkaW8gZmlsZXMgdG8gbG9hZC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5hc3luY2hyb25vdXM9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRvIGxvYWQgdGhlIGZpbGVzIGFzeW5jaHJvbm91c2x5IG9yIG5vdC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnbG9hZGVyJywgdHJ1ZSwgb3B0aW9ucy5jb2xvcik7XG5cbiAgICAvKipcbiAgICAgKiBBdWRpbyBidWZmZXJzIGNyZWF0ZWQgZnJvbSB0aGUgYXVkaW8gZmlsZXMgcGFzc2VkIGluIHRoZSB7QGxpbmsgTG9hZGVyI2NvbnN0cnVjdG9yfS5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5idWZmZXJzID0gW107XG5cbiAgICB0aGlzLl9maWxlcyA9IG9wdGlvbnMuZmlsZXMgfHwgbnVsbDtcbiAgICB0aGlzLl9hc3luY2hyb25vdXMgPSAhIW9wdGlvbnMuYXN5bmNocm9ub3VzOyAvLyBAbm90ZSBiYWQgbmFtZSBsb2FkaW5nIGlzIGFsd2F5cyBhc3luY2hyb25vdXMgYXMgaXQgaXMgYWpheFxuICAgIHRoaXMuX2ZpbGVQcm9ncmVzcyA9IG51bGw7XG4gICAgdGhpcy5fcHJvZ3Jlc3NCYXIgPSBudWxsO1xuICAgIHRoaXMuX251bUZpbGVzTG9hZGVkID0gMDtcbiAgICB0aGlzLl9zaG93UHJvZ3Jlc3MgPSAob3B0aW9ucy5zaG93UHJvZ3Jlc3MgIT09IHVuZGVmaW5lZCkgP1xuICAgICAgb3B0aW9ucy5zaG93UHJvZ3Jlc3MgOiB0cnVlO1xuXG4gICAgaWYgKCF0aGlzLl9hc3luY2hyb25vdXMgJiYgdGhpcy5fc2hvd1Byb2dyZXNzKSB7XG4gICAgICBsZXQgdmlld0NvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHZpZXdDb250ZW50LmNsYXNzTGlzdC5hZGQoJ2NlbnRlcmVkLWNvbnRlbnQnKTtcbiAgICAgIHZpZXdDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3NvZnQtYmxpbmsnKTtcbiAgICAgIHRoaXMudmlldy5hcHBlbmRDaGlsZCh2aWV3Q29udGVudCk7XG5cbiAgICAgIGxldCBsb2FkaW5nVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgIGxvYWRpbmdUZXh0LmlubmVySFRNTCA9IFwiTG9hZGluZyBzb3VuZHPigKZcIjtcbiAgICAgIHZpZXdDb250ZW50LmFwcGVuZENoaWxkKGxvYWRpbmdUZXh0KTtcblxuICAgICAgbGV0IHByb2dyZXNzV3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgcHJvZ3Jlc3NXcmFwLmNsYXNzTGlzdC5hZGQoJ3Byb2dyZXNzLXdyYXAnKTtcbiAgICAgIHZpZXdDb250ZW50LmFwcGVuZENoaWxkKHByb2dyZXNzV3JhcCk7XG5cbiAgICAgIGxldCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmFkZCgncHJvZ3Jlc3MtYmFyJyk7XG4gICAgICBwcm9ncmVzc1dyYXAuYXBwZW5kQ2hpbGQocHJvZ3Jlc3NCYXIpO1xuXG4gICAgICB0aGlzLl9wcm9ncmVzc0JhciA9IHByb2dyZXNzQmFyO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLl9sb2FkKHRoaXMuX2ZpbGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICBfbG9hZEZpbGUoaW5kZXgsIGZpbGUpIHtcbiAgICBjb25zdCBsb2FkZXIgPSBuZXcgU3VwZXJMb2FkZXIoKTtcblxuICAgIGxvYWRlclxuICAgICAgLmxvYWQoW2ZpbGVdKVxuICAgICAgLnRoZW4oKGJ1ZmZlcnMpID0+IHtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IGJ1ZmZlcnNbMF07XG5cbiAgICAgICAgdGhpcy5idWZmZXJzW2luZGV4XSA9IGJ1ZmZlcjtcbiAgICAgICAgdGhpcy5lbWl0KCdsb2FkZXI6ZmlsZUxvYWRlZCcsIGluZGV4LCBmaWxlLCBidWZmZXIpO1xuXG4gICAgICAgIHRoaXMuX251bUZpbGVzTG9hZGVkKys7XG4gICAgICAgIGlmICh0aGlzLl9udW1GaWxlc0xvYWRlZCA+PSB0aGlzLmJ1ZmZlcnMubGVuZ3RoKVxuICAgICAgICAgIHRoaXMuZW1pdCgnbG9hZGVyOmFsbEZpbGVzTG9hZGVkJyk7XG4gICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gIH1cblxuICBfbG9hZChmaWxlTGlzdCkge1xuICAgIGlmICh0aGlzLl9hc3luY2hyb25vdXMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZUxpc3QubGVuZ3RoOyBpKyspXG4gICAgICAgIHRoaXMuX2xvYWRGaWxlKGksIGZpbGVMaXN0W2ldKTtcblxuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBTdXBlckxvYWRlcigpO1xuXG4gICAgICB0aGlzLl9maWxlUHJvZ3Jlc3MgPSBbXTtcblxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGZpbGVMaXN0Lmxlbmd0aDsgaSsrKVxuICAgICAgICB0aGlzLl9maWxlUHJvZ3Jlc3NbaV0gPSAwO1xuXG4gICAgICBsb2FkZXIucHJvZ3Jlc3NDYWxsYmFjayA9IHRoaXMuX3Byb2dyZXNzQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgIGxvYWRlci5sb2FkKGZpbGVMaXN0KVxuICAgICAgICAudGhlbigoYnVmZmVycykgPT4ge1xuICAgICAgICAgIHRoaXMuYnVmZmVycyA9IGJ1ZmZlcnM7XG4gICAgICAgICAgdGhpcy5lbWl0KCdsb2FkZXI6YWxsRmlsZXNMb2FkZWQnKTtcbiAgICAgICAgICB0aGlzLmRvbmUoKTtcbiAgICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBfcHJvZ3Jlc3NDYWxsYmFjayhvYmopIHtcbiAgICBjb25zdCBmaWxlSW5kZXggPSBvYmouaW5kZXg7XG4gICAgY29uc3QgZmlsZVByb2dyZXNzID0gb2JqLnZhbHVlO1xuICAgIGxldCBwcm9ncmVzcyA9IDA7XG5cbiAgICB0aGlzLl9maWxlUHJvZ3Jlc3NbZmlsZUluZGV4XSA9IGZpbGVQcm9ncmVzcztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZmlsZVByb2dyZXNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwcm9ncmVzcyArPSB0aGlzLl9maWxlUHJvZ3Jlc3NbaV0gLyB0aGlzLl9maWxlUHJvZ3Jlc3MubGVuZ3RoO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wcm9ncmVzc0Jhcikge1xuICAgICAgcHJvZ3Jlc3MgPSBNYXRoLmNlaWwocHJvZ3Jlc3MgKiAxMDApO1xuICAgICAgdGhpcy5fcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBwcm9ncmVzcyArICclJztcbiAgICB9XG4gIH1cbn1cbiJdfQ==