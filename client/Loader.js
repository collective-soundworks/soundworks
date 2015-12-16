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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvTG9hZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBQTRCLGVBQWU7OzZCQUNsQixnQkFBZ0I7Ozs7b0NBQ2YseUJBQXlCOzs7Ozs7OztJQU03QyxVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzBCQUFWLFVBQVU7OytCQUFWLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUFBVixVQUFVOztXQUNOLG9CQUFHO0FBQ1QsaUNBRkUsVUFBVSwwQ0FFSztBQUNqQixVQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQzdEOzs7V0FFUyxvQkFBQyxPQUFPLEVBQUU7QUFDbEIsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO0FBQUUsZUFBTztPQUFFO0FBQzNDLFVBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBTSxPQUFPLE1BQUcsQ0FBQztLQUMvQzs7O1NBVEcsVUFBVTs7O0lBNEJLLE1BQU07WUFBTixNQUFNOzs7Ozs7Ozs7O0FBUWQsV0FSUSxNQUFNLEdBUUM7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVJMLE1BQU07O0FBU3ZCLCtCQVRpQixNQUFNLDZDQVNqQixPQUFPLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRTs7Ozs7O0FBTWhDLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7QUFDcEMsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7OztBQUcxQixRQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDaEIsVUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0tBQzFCLE1BQU07QUFDTCxVQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxBQUFDLE9BQU8sQ0FBQyxZQUFZLEtBQUssU0FBUyxHQUM3RCxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7O0FBRWhDLFVBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxVQUFVLENBQUM7QUFDL0MsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztLQUN0QztHQUNGOzs7Ozs7ZUE3QmtCLE1BQU07O1dBa0NwQixpQkFBRztBQUNOLGlDQW5DaUIsTUFBTSx1Q0FtQ1Q7QUFDZCxVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN6Qjs7Ozs7OztXQUtNLG1CQUFHO0FBQ1IsaUNBM0NpQixNQUFNLHlDQTJDUDtBQUNoQixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1dBRUksZUFBQyxRQUFRLEVBQUU7OztBQUNkLFVBQU0sTUFBTSxHQUFHLCtCQUFpQixDQUFDO0FBQ2pDLFVBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDOztBQUV4QixXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4QyxZQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUMzQjs7QUFFRCxZQUFNLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1RCxZQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUNsQixJQUFJLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDakIsY0FBSyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLGNBQUssSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ3RCLGNBQUssSUFBSSxFQUFFLENBQUM7T0FDYixFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ1osZUFBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUNwQixDQUFDLENBQUM7S0FDTjs7O1dBRWdCLDJCQUFDLEdBQUcsRUFBRTtBQUNyQixVQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQzVCLFVBQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDL0IsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7QUFDekMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxZQUFZLENBQUM7O0FBRTdDLFVBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBSztBQUMxRCxlQUFPLElBQUksR0FBRyxPQUFPLENBQUM7T0FDdkIsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFTixjQUFRLElBQUksTUFBTSxDQUFDOztBQUVuQixVQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDckMsWUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDO09BQ3RDO0tBQ0Y7OztTQWpGa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoic3JjL2NsaWVudC9Mb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdXBlckxvYWRlciB9IGZyb20gJ3dhdmVzLWxvYWRlcnMnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5cblxuLyoqXG4gKiBEZWZhdWx0IGxvYWRlciB2aWV3XG4gKi9cbmNsYXNzIExvYWRlclZpZXcgZXh0ZW5kcyBTZWdtZW50ZWRWaWV3IHtcbiAgb25SZW5kZXIoKSB7XG4gICAgc3VwZXIub25SZW5kZXIoKTtcbiAgICB0aGlzLiRwcm9ncmVzc0JhciA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJyNwcm9ncmVzcy1iYXInKTtcbiAgfVxuXG4gIG9uUHJvZ3Jlc3MocGVyY2VudCkge1xuICAgIGlmICghdGhpcy5jb250ZW50LnNob3dQcm9ncmVzcykgeyByZXR1cm47IH1cbiAgICB0aGlzLiRwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IGAke3BlcmNlbnR9JWA7XG4gIH1cbn1cblxuXG4vKipcbiAqIFtjbGllbnRdIExvYWQgYXVkaW8gZmlsZXMgdGhhdCBjYW4gYmUgdXNlZCBieSBvdGhlciBtb2R1bGVzICgqZS5nLiosIHRoZSB7QGxpbmsgUGVyZm9ybWFuY2V9KS5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3ICh0aGF0IGRpc3BsYXlzIGEgcHJvZ3Jlc3MgYmFyKSBhbmQgcmVxdWlyZXMgdGhlIFNBU1MgcGFydGlhbCBgXzc3LWxvYWRlci5zY3NzYC5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIGFsbCB0aGUgZmlsZXMgYXJlIGxvYWRlZC5cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gSW5zdGFudGlhdGUgdGhlIG1vZHVsZSB3aXRoIHRoZSBmaWxlcyB0byBsb2FkXG4gKiBjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKHsgZmlsZXM6IFsnc291bmRzL2tpY2subXAzJywgJ3NvdW5kcy9zbmFyZS5tcDMnXSB9KTtcbiAqXG4gKiAvLyBHZXQgdGhlIGNvcnJlc3BvbmRpbmcgYXVkaW8gYnVmZmVyc1xuICogY29uc3Qga2lja0J1ZmZlciA9IGxvYWRlci5hdWRpb0J1ZmZlcnNbMF07XG4gKiBjb25zdCBzbmFyZUJ1ZmZlciA9IGxvYWRlci5hdWRpb0J1ZmZlcnNbMV07XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRlciBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdkaWFsb2cnXSAtIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW29wdGlvbnMuZmlsZXM9bnVsbF0gLSBUaGUgYXVkaW8gZmlsZXMgdG8gbG9hZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnZpZXc9dW5kZWZpbmVkXSAtIElmIGRlZmluZWQsIHRoZSB2aWV3IHRvIGJlIHVzZWQuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvd1Byb2dyZXNzPXRydWVdIC0gRGVmaW5lcyBpZiB0aGUgcHJvZ3Jlc3MgYmFyIHNob3VsZCBiZSByZW5kZXJlZC4gSWYgc2V0IHRvIHRydWUsIHRoZSB2aWV3IHNob3VsZCBpbXBsZW1lbnQgYW4gYG9uUHJvZ3Jlc3MocGVyY2VudClgIG1ldGhvZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnbG9hZGVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBBdWRpbyBidWZmZXJzIGNyZWF0ZWQgZnJvbSB0aGUgYXVkaW8gZmlsZXMgcGFzc2VkIGluIHRoZSB7QGxpbmsgTG9hZGVyI2NvbnN0cnVjdG9yfS5cbiAgICAgKiBAdHlwZSB7QXVkaW9CdWZmZXJbXX1cbiAgICAgKi9cbiAgICB0aGlzLmJ1ZmZlcnMgPSBbXTtcbiAgICB0aGlzLl9maWxlcyA9IG9wdGlvbnMuZmlsZXMgfHwgbnVsbDtcbiAgICB0aGlzLl9maWxlUHJvZ3Jlc3MgPSBudWxsOyAvLyB1c2VkIHRvIHRyYWNrIGZpbGVzIGxvYWRpbmcgcHJvZ3Jlc3NcbiAgICAvLyB0aGlzLl9udW1GaWxlc0xvYWRlZCA9IDA7XG5cbiAgICBpZiAob3B0aW9ucy52aWV3KSB7XG4gICAgICB0aGlzLnZpZXcgPSBvcHRpb25zLnZpZXc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29udGVudC5zaG93UHJvZ3Jlc3MgPSAob3B0aW9ucy5zaG93UHJvZ3Jlc3MgIT09IHVuZGVmaW5lZCkgP1xuICAgICAgICAhIW9wdGlvbnMuc2hvd1Byb2dyZXNzIDogdHJ1ZTtcblxuICAgICAgdGhpcy52aWV3Q3RvciA9IG9wdGlvbnMudmlld0N0b3IgfHwgTG9hZGVyVmlldztcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlRGVmYXVsdFZpZXcoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5fbG9hZCh0aGlzLl9maWxlcyk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgX2xvYWQoZmlsZUxpc3QpIHtcbiAgICBjb25zdCBsb2FkZXIgPSBuZXcgU3VwZXJMb2FkZXIoKTtcbiAgICB0aGlzLl9maWxlUHJvZ3Jlc3MgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuX2ZpbGVQcm9ncmVzc1tpXSA9IDA7XG4gICAgfVxuXG4gICAgbG9hZGVyLnByb2dyZXNzQ2FsbGJhY2sgPSB0aGlzLl9wcm9ncmVzc0NhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgbG9hZGVyLmxvYWQoZmlsZUxpc3QpXG4gICAgICAudGhlbigoYnVmZmVycykgPT4ge1xuICAgICAgICB0aGlzLmJ1ZmZlcnMgPSBidWZmZXJzO1xuICAgICAgICB0aGlzLmVtaXQoJ2NvbXBsZXRlZCcpXG4gICAgICAgIHRoaXMuZG9uZSgpO1xuICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgX3Byb2dyZXNzQ2FsbGJhY2sob2JqKSB7XG4gICAgY29uc3QgZmlsZUluZGV4ID0gb2JqLmluZGV4O1xuICAgIGNvbnN0IGZpbGVQcm9ncmVzcyA9IG9iai52YWx1ZTtcbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLl9maWxlUHJvZ3Jlc3MubGVuZ3RoO1xuICAgIHRoaXMuX2ZpbGVQcm9ncmVzc1tmaWxlSW5kZXhdID0gZmlsZVByb2dyZXNzO1xuXG4gICAgbGV0IHByb2dyZXNzID0gdGhpcy5fZmlsZVByb2dyZXNzLnJlZHVjZSgocHJldiwgY3VycmVudCkgPT4ge1xuICAgICAgcmV0dXJuIHByZXYgKyBjdXJyZW50O1xuICAgIH0sIDApO1xuXG4gICAgcHJvZ3Jlc3MgLz0gbGVuZ3RoO1xuXG4gICAgaWYgKHRoaXMudmlldyAmJiB0aGlzLnZpZXcub25Qcm9ncmVzcykge1xuICAgICAgdGhpcy52aWV3Lm9uUHJvZ3Jlc3MocHJvZ3Jlc3MgKiAxMDApO1xuICAgIH1cbiAgfVxufVxuIl19