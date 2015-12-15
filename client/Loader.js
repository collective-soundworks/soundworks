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

var _displaySegmentedView = require('./display/SegmentedView');

var _displaySegmentedView2 = _interopRequireDefault(_displaySegmentedView);

/**
 * Default loader view
 */

var LoaderView = (function (_SegmentedView) {
  _inherits(LoaderView, _SegmentedView);

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
      _get(Object.getPrototypeOf(LoaderView.prototype), 'onRender', this).call(this);
      this.$progressBar = this.$el.querySelector('#progress-bar');
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

    if (options.view) {
      this.view = options.view;
    } else {
      this.content.showProgress = options.showProgress !== undefined ? !!options.showProgress : true;

      this.viewCtor = options.viewCtor || LoaderView;
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
        _this.emit('completed');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzRCQUE0QixlQUFlOzs2QkFDbEIsZ0JBQWdCOzs7O29DQUNmLHlCQUF5Qjs7Ozs7Ozs7SUFNN0MsVUFBVTtZQUFWLFVBQVU7O1dBQVYsVUFBVTswQkFBVixVQUFVOzsrQkFBVixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O2VBQVYsVUFBVTs7V0FDTixvQkFBRztBQUNULGlDQUZFLFVBQVUsMENBRUs7QUFDakIsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUM3RDs7O1dBRVMsb0JBQUMsT0FBTyxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtBQUFFLGVBQU87T0FBRTtBQUMzQyxVQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQU0sT0FBTyxNQUFHLENBQUM7S0FDL0M7OztTQVRHLFVBQVU7OztJQTRCSyxNQUFNO1lBQU4sTUFBTTs7Ozs7Ozs7OztBQVFkLFdBUlEsTUFBTSxHQVFDO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFSTCxNQUFNOztBQVN2QiwrQkFUaUIsTUFBTSw2Q0FTakIsT0FBTyxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUU7Ozs7OztBQU1oQyxRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDOzs7QUFHMUIsUUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztLQUMxQixNQUFNO0FBQ0wsVUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsQUFBQyxPQUFPLENBQUMsWUFBWSxLQUFLLFNBQVMsR0FDN0QsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDOztBQUVoQyxVQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksVUFBVSxDQUFDO0FBQy9DLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7S0FDdEM7R0FDRjs7Ozs7O2VBN0JrQixNQUFNOztXQWtDcEIsaUJBQUc7QUFDTixpQ0FuQ2lCLE1BQU0sdUNBbUNUO0FBQ2QsVUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDekI7Ozs7Ozs7V0FLTSxtQkFBRztBQUNSLGlDQTNDaUIsTUFBTSx5Q0EyQ1A7QUFDaEIsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztXQUVJLGVBQUMsUUFBUSxFQUFFOzs7QUFDZCxVQUFNLE1BQU0sR0FBRywrQkFBaUIsQ0FBQztBQUNqQyxVQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQzs7QUFFeEIsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDeEMsWUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDM0I7O0FBRUQsWUFBTSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUQsWUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDbEIsSUFBSSxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQ2pCLGNBQUssT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixjQUFLLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUN0QixjQUFLLElBQUksRUFBRSxDQUFDO09BQ2IsRUFBRSxVQUFDLEtBQUssRUFBSztBQUNaLGVBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDcEIsQ0FBQyxDQUFDO0tBQ047OztXQUVnQiwyQkFBQyxHQUFHLEVBQUU7QUFDckIsVUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUM1QixVQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQy9CLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO0FBQ3pDLFVBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsWUFBWSxDQUFDOztBQUU3QyxVQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUksRUFBRSxPQUFPLEVBQUs7QUFDMUQsZUFBTyxJQUFJLEdBQUcsT0FBTyxDQUFDO09BQ3ZCLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRU4sY0FBUSxJQUFJLE1BQU0sQ0FBQzs7QUFFbkIsVUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3JDLFlBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsQ0FBQztPQUN0QztLQUNGOzs7U0FqRmtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN1cGVyTG9hZGVyIH0gZnJvbSAnd2F2ZXMtbG9hZGVycyc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcblxuXG4vKipcbiAqIERlZmF1bHQgbG9hZGVyIHZpZXdcbiAqL1xuY2xhc3MgTG9hZGVyVmlldyBleHRlbmRzIFNlZ21lbnRlZFZpZXcge1xuICBvblJlbmRlcigpIHtcbiAgICBzdXBlci5vblJlbmRlcigpO1xuICAgIHRoaXMuJHByb2dyZXNzQmFyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLWJhcicpO1xuICB9XG5cbiAgb25Qcm9ncmVzcyhwZXJjZW50KSB7XG4gICAgaWYgKCF0aGlzLmNvbnRlbnQuc2hvd1Byb2dyZXNzKSB7IHJldHVybjsgfVxuICAgIHRoaXMuJHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gYCR7cGVyY2VudH0lYDtcbiAgfVxufVxuXG5cbi8qKlxuICogW2NsaWVudF0gTG9hZCBhdWRpbyBmaWxlcyB0aGF0IGNhbiBiZSB1c2VkIGJ5IG90aGVyIG1vZHVsZXMgKCplLmcuKiwgdGhlIHtAbGluayBQZXJmb3JtYW5jZX0pLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcgKHRoYXQgZGlzcGxheXMgYSBwcm9ncmVzcyBiYXIpIGFuZCByZXF1aXJlcyB0aGUgU0FTUyBwYXJ0aWFsIGBfNzctbG9hZGVyLnNjc3NgLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gYWxsIHRoZSBmaWxlcyBhcmUgbG9hZGVkLlxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBJbnN0YW50aWF0ZSB0aGUgbW9kdWxlIHdpdGggdGhlIGZpbGVzIHRvIGxvYWRcbiAqIGNvbnN0IGxvYWRlciA9IG5ldyBMb2FkZXIoeyBmaWxlczogWydzb3VuZHMva2ljay5tcDMnLCAnc291bmRzL3NuYXJlLm1wMyddIH0pO1xuICpcbiAqIC8vIEdldCB0aGUgY29ycmVzcG9uZGluZyBhdWRpbyBidWZmZXJzXG4gKiBjb25zdCBraWNrQnVmZmVyID0gbG9hZGVyLmF1ZGlvQnVmZmVyc1swXTtcbiAqIGNvbnN0IHNuYXJlQnVmZmVyID0gbG9hZGVyLmF1ZGlvQnVmZmVyc1sxXTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9hZGVyIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J2RpYWxvZyddIC0gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbb3B0aW9ucy5maWxlcz1udWxsXSAtIFRoZSBhdWRpbyBmaWxlcyB0byBsb2FkLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMudmlldz11bmRlZmluZWRdIC0gSWYgZGVmaW5lZCwgdGhlIHZpZXcgdG8gYmUgdXNlZC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93UHJvZ3Jlc3M9dHJ1ZV0gLSBEZWZpbmVzIGlmIHRoZSBwcm9ncmVzcyBiYXIgc2hvdWxkIGJlIHJlbmRlcmVkLiBJZiBzZXQgdG8gdHJ1ZSwgdGhlIHZpZXcgc2hvdWxkIGltcGxlbWVudCBhbiBgb25Qcm9ncmVzcyhwZXJjZW50KWAgbWV0aG9kLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdsb2FkZXInKTtcblxuICAgIC8qKlxuICAgICAqIEF1ZGlvIGJ1ZmZlcnMgY3JlYXRlZCBmcm9tIHRoZSBhdWRpbyBmaWxlcyBwYXNzZWQgaW4gdGhlIHtAbGluayBMb2FkZXIjY29uc3RydWN0b3J9LlxuICAgICAqIEB0eXBlIHtBdWRpb0J1ZmZlcltdfVxuICAgICAqL1xuICAgIHRoaXMuYnVmZmVycyA9IFtdO1xuICAgIHRoaXMuX2ZpbGVzID0gb3B0aW9ucy5maWxlcyB8fCBudWxsO1xuICAgIHRoaXMuX2ZpbGVQcm9ncmVzcyA9IG51bGw7IC8vIHVzZWQgdG8gdHJhY2sgZmlsZXMgbG9hZGluZyBwcm9ncmVzc1xuICAgIC8vIHRoaXMuX251bUZpbGVzTG9hZGVkID0gMDtcblxuICAgIGlmIChvcHRpb25zLnZpZXcpIHtcbiAgICAgIHRoaXMudmlldyA9IG9wdGlvbnMudmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb250ZW50LnNob3dQcm9ncmVzcyA9IChvcHRpb25zLnNob3dQcm9ncmVzcyAhPT0gdW5kZWZpbmVkKSA/XG4gICAgICAgICEhb3B0aW9ucy5zaG93UHJvZ3Jlc3MgOiB0cnVlO1xuXG4gICAgICB0aGlzLnZpZXdDdG9yID0gb3B0aW9ucy52aWV3Q3RvciB8fCBMb2FkZXJWaWV3O1xuICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVEZWZhdWx0VmlldygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLl9sb2FkKHRoaXMuX2ZpbGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICBfbG9hZChmaWxlTGlzdCkge1xuICAgIGNvbnN0IGxvYWRlciA9IG5ldyBTdXBlckxvYWRlcigpO1xuICAgIHRoaXMuX2ZpbGVQcm9ncmVzcyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5fZmlsZVByb2dyZXNzW2ldID0gMDtcbiAgICB9XG5cbiAgICBsb2FkZXIucHJvZ3Jlc3NDYWxsYmFjayA9IHRoaXMuX3Byb2dyZXNzQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICBsb2FkZXIubG9hZChmaWxlTGlzdClcbiAgICAgIC50aGVuKChidWZmZXJzKSA9PiB7XG4gICAgICAgIHRoaXMuYnVmZmVycyA9IGJ1ZmZlcnM7XG4gICAgICAgIHRoaXMuZW1pdCgnY29tcGxldGVkJylcbiAgICAgICAgdGhpcy5kb25lKCk7XG4gICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gIH1cblxuICBfcHJvZ3Jlc3NDYWxsYmFjayhvYmopIHtcbiAgICBjb25zdCBmaWxlSW5kZXggPSBvYmouaW5kZXg7XG4gICAgY29uc3QgZmlsZVByb2dyZXNzID0gb2JqLnZhbHVlO1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuX2ZpbGVQcm9ncmVzcy5sZW5ndGg7XG4gICAgdGhpcy5fZmlsZVByb2dyZXNzW2ZpbGVJbmRleF0gPSBmaWxlUHJvZ3Jlc3M7XG5cbiAgICBsZXQgcHJvZ3Jlc3MgPSB0aGlzLl9maWxlUHJvZ3Jlc3MucmVkdWNlKChwcmV2LCBjdXJyZW50KSA9PiB7XG4gICAgICByZXR1cm4gcHJldiArIGN1cnJlbnQ7XG4gICAgfSwgMCk7XG5cbiAgICBwcm9ncmVzcyAvPSBsZW5ndGg7XG5cbiAgICBpZiAodGhpcy52aWV3ICYmIHRoaXMudmlldy5vblByb2dyZXNzKSB7XG4gICAgICB0aGlzLnZpZXcub25Qcm9ncmVzcyhwcm9ncmVzcyAqIDEwMCk7XG4gICAgfVxuICB9XG59XG4iXX0=