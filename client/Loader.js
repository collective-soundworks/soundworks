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

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

var _displayView = require('./display/View');

var _displayView2 = _interopRequireDefault(_displayView);

/**
 * Default loader view
 */

var LoaderView = (function (_View) {
  _inherits(LoaderView, _View);

  function LoaderView() {
    _classCallCheck(this, LoaderView);

    _get(Object.getPrototypeOf(LoaderView.prototype), 'constructor', this).apply(this, arguments);
  }

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

  _createClass(LoaderView, [{
    key: 'onRender',
    value: function onRender() {
      this.$progressBar = this.$el.querySelector('#progress-bar');
    }
  }, {
    key: 'onProgress',
    value: function onProgress(percent) {
      if (!this.model.showProgress) {
        return;
      }
      this.$progressBar.style.width = percent + '%';
    }
  }]);

  return LoaderView;
})(_displayView2['default']);

var Loader = (function (_ClientModule) {
  _inherits(Loader, _ClientModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='dialog'] - Name of the module.
   * @param {String[]} [options.files=null] - The audio files to load.
   * @param {String} [options.view=undefined] - If defined, the view to be used.
   * @param {Boolean} [options.showProgress=true] - Defines if the progress bar should be rendered. If set to true, the view should implement an `onProgress(percent)` method.
   */

  function Loader() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Loader);

    _get(Object.getPrototypeOf(Loader.prototype), 'constructor', this).call(this, options.name || 'loader');

    /**
     * Audio buffers created from the audio files passed in the {@link Loader#constructor}.
     * @type {AudioBuffer[]}
     */
    this.buffers = [];
    this._files = options.files || null;
    this._fileProgress = null; // used to track files loading progress
    // this._numFilesLoaded = 0;

    if (options.view instanceof _displayView2['default']) {
      this.view = options.view;
    } else {
      this.content.showProgress = options.showProgress !== undefined ? !!options.showProgress : true;

      this.view = this.createDefaultView();
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

    // _loadFile(index, file) {
    //   const loader = new SuperLoader();

    //   loader
    //     .load([file])
    //     .then((buffers) => {
    //       let buffer = buffers[0];

    //       this.buffers[index] = buffer;
    //       this.emit('loader:fileLoaded', index, file, buffer);

    //       this._numFilesLoaded++;

    //       if (this._numFilesLoaded >= this.buffers.length) {
    //         this.emit('loader:allFilesLoaded');
    //       }
    //     }, (error) => {
    //       console.log(error);
    //     });
    // }

  }, {
    key: '_load',
    value: function _load(fileList) {
      var _this = this;

      var loader = new _wavesLoaders.SuperLoader();
      this._fileProgress = [];

      for (var i = 0; i < fileList.length; i++) {
        this._fileProgress[i] = 0;
      }

      loader.progressCallback = this._progressCallback.bind(this);
      loader.load(fileList).then(function (buffers) {
        _this.buffers = buffers;
        // this.emit('loader:allFilesLoaded');
        _this.emit('loader:completed');
        _this.done();
      }, function (error) {
        console.log(error);
      });
    }
  }, {
    key: '_progressCallback',
    value: function _progressCallback(obj) {
      var fileIndex = obj.index;
      var fileProgress = obj.value;
      var length = this._fileProgress.length;
      this._fileProgress[fileIndex] = fileProgress;

      var progress = this._fileProgress.reduce(function (prev, current) {
        return prev + current;
      }, 0);

      progress /= length;

      if (this.view && this.view.onProgress) {
        this.view.onProgress(progress * 100);
      }
    }
  }]);

  return Loader;
})(_ClientModule3['default']);

exports['default'] = Loader;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvTG9hZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBQTRCLGVBQWU7OzZCQUNsQixnQkFBZ0I7Ozs7MkJBQ3hCLGdCQUFnQjs7Ozs7Ozs7SUFNM0IsVUFBVTtZQUFWLFVBQVU7O1dBQVYsVUFBVTswQkFBVixVQUFVOzsrQkFBVixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O2VBQVYsVUFBVTs7V0FDTixvQkFBRztBQUNULFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDN0Q7OztXQUVTLG9CQUFDLE9BQU8sRUFBRTtBQUNsQixVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUU7QUFBRSxlQUFPO09BQUU7QUFDekMsVUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFNLE9BQU8sTUFBRyxDQUFDO0tBQy9DOzs7U0FSRyxVQUFVOzs7SUEyQkssTUFBTTtZQUFOLE1BQU07Ozs7Ozs7Ozs7QUFRZCxXQVJRLE1BQU0sR0FRQztRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUkwsTUFBTTs7QUFTdkIsK0JBVGlCLE1BQU0sNkNBU2pCLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFOzs7Ozs7QUFNaEMsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztBQUNwQyxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzs7O0FBRzFCLFFBQUksT0FBTyxDQUFDLElBQUksb0NBQWdCLEVBQUU7QUFDaEMsVUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0tBQzFCLE1BQU07QUFDTCxVQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxBQUFDLE9BQU8sQ0FBQyxZQUFZLEtBQUssU0FBUyxHQUM3RCxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7O0FBRWhDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7S0FDdEM7R0FDRjs7Ozs7O2VBNUJrQixNQUFNOztXQWlDcEIsaUJBQUc7QUFDTixpQ0FsQ2lCLE1BQU0sdUNBa0NUO0FBQ2QsVUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDekI7Ozs7Ozs7V0FLTSxtQkFBRztBQUNSLGlDQTFDaUIsTUFBTSx5Q0EwQ1A7QUFDaEIsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7V0F1QkksZUFBQyxRQUFRLEVBQUU7OztBQUNkLFVBQU0sTUFBTSxHQUFHLCtCQUFpQixDQUFDO0FBQ2pDLFVBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDOztBQUV4QixXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4QyxZQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUMzQjs7QUFFRCxZQUFNLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1RCxZQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUNsQixJQUFJLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDakIsY0FBSyxPQUFPLEdBQUcsT0FBTyxDQUFDOztBQUV2QixjQUFLLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0FBQzdCLGNBQUssSUFBSSxFQUFFLENBQUM7T0FDYixFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ1osZUFBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUNwQixDQUFDLENBQUM7S0FDTjs7O1dBRWdCLDJCQUFDLEdBQUcsRUFBRTtBQUNyQixVQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQzVCLFVBQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDL0IsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7QUFDekMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxZQUFZLENBQUM7O0FBRTdDLFVBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBSztBQUMxRCxlQUFPLElBQUksR0FBRyxPQUFPLENBQUM7T0FDdkIsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFTixjQUFRLElBQUksTUFBTSxDQUFDOztBQUVuQixVQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDckMsWUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDO09BQ3RDO0tBQ0Y7OztTQXRHa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoic3JjL2NsaWVudC9Mb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdXBlckxvYWRlciB9IGZyb20gJ3dhdmVzLWxvYWRlcnMnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgVmlldyBmcm9tICcuL2Rpc3BsYXkvVmlldyc7XG5cblxuLyoqXG4gKiBEZWZhdWx0IGxvYWRlciB2aWV3XG4gKi9cbmNsYXNzIExvYWRlclZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy4kcHJvZ3Jlc3NCYXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcjcHJvZ3Jlc3MtYmFyJyk7XG4gIH1cblxuICBvblByb2dyZXNzKHBlcmNlbnQpIHtcbiAgICBpZiAoIXRoaXMubW9kZWwuc2hvd1Byb2dyZXNzKSB7IHJldHVybjsgfVxuICAgIHRoaXMuJHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gYCR7cGVyY2VudH0lYDtcbiAgfVxufVxuXG5cbi8qKlxuICogW2NsaWVudF0gTG9hZCBhdWRpbyBmaWxlcyB0aGF0IGNhbiBiZSB1c2VkIGJ5IG90aGVyIG1vZHVsZXMgKCplLmcuKiwgdGhlIHtAbGluayBQZXJmb3JtYW5jZX0pLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcgKHRoYXQgZGlzcGxheXMgYSBwcm9ncmVzcyBiYXIpIGFuZCByZXF1aXJlcyB0aGUgU0FTUyBwYXJ0aWFsIGBfNzctbG9hZGVyLnNjc3NgLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gYWxsIHRoZSBmaWxlcyBhcmUgbG9hZGVkLlxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBJbnN0YW50aWF0ZSB0aGUgbW9kdWxlIHdpdGggdGhlIGZpbGVzIHRvIGxvYWRcbiAqIGNvbnN0IGxvYWRlciA9IG5ldyBMb2FkZXIoeyBmaWxlczogWydzb3VuZHMva2ljay5tcDMnLCAnc291bmRzL3NuYXJlLm1wMyddIH0pO1xuICpcbiAqIC8vIEdldCB0aGUgY29ycmVzcG9uZGluZyBhdWRpbyBidWZmZXJzXG4gKiBjb25zdCBraWNrQnVmZmVyID0gbG9hZGVyLmF1ZGlvQnVmZmVyc1swXTtcbiAqIGNvbnN0IHNuYXJlQnVmZmVyID0gbG9hZGVyLmF1ZGlvQnVmZmVyc1sxXTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9hZGVyIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J2RpYWxvZyddIC0gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbb3B0aW9ucy5maWxlcz1udWxsXSAtIFRoZSBhdWRpbyBmaWxlcyB0byBsb2FkLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMudmlldz11bmRlZmluZWRdIC0gSWYgZGVmaW5lZCwgdGhlIHZpZXcgdG8gYmUgdXNlZC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93UHJvZ3Jlc3M9dHJ1ZV0gLSBEZWZpbmVzIGlmIHRoZSBwcm9ncmVzcyBiYXIgc2hvdWxkIGJlIHJlbmRlcmVkLiBJZiBzZXQgdG8gdHJ1ZSwgdGhlIHZpZXcgc2hvdWxkIGltcGxlbWVudCBhbiBgb25Qcm9ncmVzcyhwZXJjZW50KWAgbWV0aG9kLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdsb2FkZXInKTtcblxuICAgIC8qKlxuICAgICAqIEF1ZGlvIGJ1ZmZlcnMgY3JlYXRlZCBmcm9tIHRoZSBhdWRpbyBmaWxlcyBwYXNzZWQgaW4gdGhlIHtAbGluayBMb2FkZXIjY29uc3RydWN0b3J9LlxuICAgICAqIEB0eXBlIHtBdWRpb0J1ZmZlcltdfVxuICAgICAqL1xuICAgIHRoaXMuYnVmZmVycyA9IFtdO1xuICAgIHRoaXMuX2ZpbGVzID0gb3B0aW9ucy5maWxlcyB8fCBudWxsO1xuICAgIHRoaXMuX2ZpbGVQcm9ncmVzcyA9IG51bGw7IC8vIHVzZWQgdG8gdHJhY2sgZmlsZXMgbG9hZGluZyBwcm9ncmVzc1xuICAgIC8vIHRoaXMuX251bUZpbGVzTG9hZGVkID0gMDtcblxuICAgIGlmIChvcHRpb25zLnZpZXcgaW5zdGFuY2VvZiBWaWV3KSB7XG4gICAgICB0aGlzLnZpZXcgPSBvcHRpb25zLnZpZXc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29udGVudC5zaG93UHJvZ3Jlc3MgPSAob3B0aW9ucy5zaG93UHJvZ3Jlc3MgIT09IHVuZGVmaW5lZCkgP1xuICAgICAgICAhIW9wdGlvbnMuc2hvd1Byb2dyZXNzIDogdHJ1ZTtcblxuICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVEZWZhdWx0VmlldygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLl9sb2FkKHRoaXMuX2ZpbGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICAvLyBfbG9hZEZpbGUoaW5kZXgsIGZpbGUpIHtcbiAgLy8gICBjb25zdCBsb2FkZXIgPSBuZXcgU3VwZXJMb2FkZXIoKTtcblxuICAvLyAgIGxvYWRlclxuICAvLyAgICAgLmxvYWQoW2ZpbGVdKVxuICAvLyAgICAgLnRoZW4oKGJ1ZmZlcnMpID0+IHtcbiAgLy8gICAgICAgbGV0IGJ1ZmZlciA9IGJ1ZmZlcnNbMF07XG5cbiAgLy8gICAgICAgdGhpcy5idWZmZXJzW2luZGV4XSA9IGJ1ZmZlcjtcbiAgLy8gICAgICAgdGhpcy5lbWl0KCdsb2FkZXI6ZmlsZUxvYWRlZCcsIGluZGV4LCBmaWxlLCBidWZmZXIpO1xuXG4gIC8vICAgICAgIHRoaXMuX251bUZpbGVzTG9hZGVkKys7XG5cbiAgLy8gICAgICAgaWYgKHRoaXMuX251bUZpbGVzTG9hZGVkID49IHRoaXMuYnVmZmVycy5sZW5ndGgpIHtcbiAgLy8gICAgICAgICB0aGlzLmVtaXQoJ2xvYWRlcjphbGxGaWxlc0xvYWRlZCcpO1xuICAvLyAgICAgICB9XG4gIC8vICAgICB9LCAoZXJyb3IpID0+IHtcbiAgLy8gICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAvLyAgICAgfSk7XG4gIC8vIH1cblxuICBfbG9hZChmaWxlTGlzdCkge1xuICAgIGNvbnN0IGxvYWRlciA9IG5ldyBTdXBlckxvYWRlcigpO1xuICAgIHRoaXMuX2ZpbGVQcm9ncmVzcyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5fZmlsZVByb2dyZXNzW2ldID0gMDtcbiAgICB9XG5cbiAgICBsb2FkZXIucHJvZ3Jlc3NDYWxsYmFjayA9IHRoaXMuX3Byb2dyZXNzQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICBsb2FkZXIubG9hZChmaWxlTGlzdClcbiAgICAgIC50aGVuKChidWZmZXJzKSA9PiB7XG4gICAgICAgIHRoaXMuYnVmZmVycyA9IGJ1ZmZlcnM7XG4gICAgICAgIC8vIHRoaXMuZW1pdCgnbG9hZGVyOmFsbEZpbGVzTG9hZGVkJyk7XG4gICAgICAgIHRoaXMuZW1pdCgnbG9hZGVyOmNvbXBsZXRlZCcpXG4gICAgICAgIHRoaXMuZG9uZSgpO1xuICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgX3Byb2dyZXNzQ2FsbGJhY2sob2JqKSB7XG4gICAgY29uc3QgZmlsZUluZGV4ID0gb2JqLmluZGV4O1xuICAgIGNvbnN0IGZpbGVQcm9ncmVzcyA9IG9iai52YWx1ZTtcbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLl9maWxlUHJvZ3Jlc3MubGVuZ3RoO1xuICAgIHRoaXMuX2ZpbGVQcm9ncmVzc1tmaWxlSW5kZXhdID0gZmlsZVByb2dyZXNzO1xuXG4gICAgbGV0IHByb2dyZXNzID0gdGhpcy5fZmlsZVByb2dyZXNzLnJlZHVjZSgocHJldiwgY3VycmVudCkgPT4ge1xuICAgICAgcmV0dXJuIHByZXYgKyBjdXJyZW50O1xuICAgIH0sIDApO1xuXG4gICAgcHJvZ3Jlc3MgLz0gbGVuZ3RoO1xuXG4gICAgaWYgKHRoaXMudmlldyAmJiB0aGlzLnZpZXcub25Qcm9ncmVzcykge1xuICAgICAgdGhpcy52aWV3Lm9uUHJvZ3Jlc3MocHJvZ3Jlc3MgKiAxMDApO1xuICAgIH1cbiAgfVxufVxuIl19