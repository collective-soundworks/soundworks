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
 * The {@link ClientLoader} module allows for loading audio files that can be used in the scenario (for instance, by the `performance` module).
 * The {@link ClientLoader} module has a view that displays a loading bar indicating the progress of the loading.
 * The {@link ClientLoader} module calls its `done` method when all the files are loaded.
 *
 * The {@link ClientLoader} module requires the SASS partial `_77-loader.scss`.
 * @example
 * // Instantiate the module with the files to load
 * const loader = new ClientLoader(['sounds/kick.mp3', 'sounds/snare.mp3']);
 *
 * // Get the corresponding audio buffers
 * const kickBuffer = loader.audioBuffers[0];
 * const snareBuffer = loader.audioBuffers[1];
 */

var Loader = (function (_Module) {
  _inherits(Loader, _Module);

  /**
   * Creates an instance of the class. Always has a view.
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
     * Audio buffers created from the audio files passed in the {@link ClientLoader#constructor}.
     * @type {Array}
     */
    this.buffers = [];

    this._files = options.files || null;
    this._asynchronous = !!options.asynchronous;
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

  _createClass(Loader, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Loader.prototype), 'start', this).call(this);
      this._load(this._files);
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvTG9hZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBQTRCLGVBQWU7O3NCQUN4QixVQUFVOzs7O3VCQUNWLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQlIsTUFBTTtZQUFOLE1BQU07Ozs7Ozs7Ozs7O0FBU2QsV0FUUSxNQUFNLEdBU0M7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVRMLE1BQU07O0FBVXZCLCtCQVZpQixNQUFNLDZDQVVqQixPQUFPLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRTs7Ozs7O0FBTXJELFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVsQixRQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7QUFDNUMsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDekIsUUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUM7QUFDekIsUUFBSSxDQUFDLGFBQWEsR0FBRyxBQUFDLE9BQU8sQ0FBQyxZQUFZLEtBQUssU0FBUyxHQUN0RCxPQUFPLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzs7QUFFOUIsUUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUM3QyxVQUFJLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hELGlCQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzlDLGlCQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN4QyxVQUFJLENB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Q2pCLGlCQUFLLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsaUJBQUssSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDbkMsaUJBQUssSUFBSSxFQUFFLENBQUM7U0FDYixFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ1osaUJBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEIsQ0FBQyxDQUFDO09BQ047S0FDRjs7O1dBRWdCLDJCQUFDLEdBQUcsRUFBRTtBQUNyQixVQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQzVCLFVBQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDL0IsVUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDOztBQUVqQixVQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFlBQVksQ0FBQzs7QUFFN0MsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2xELGdCQUFRLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztPQUMvRDs7QUFFRCxVQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDckIsZ0JBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNyQyxZQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsUUFBUSxHQUFHLEdBQUcsQ0FBQztPQUNoRDtLQUNGOzs7U0F0SGtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6InNyYy9jbGllbnQvTG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3VwZXJMb2FkZXIgfSBmcm9tICd3YXZlcy1sb2FkZXJzJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuLyoqXG4gKiBUaGUge0BsaW5rIENsaWVudExvYWRlcn0gbW9kdWxlIGFsbG93cyBmb3IgbG9hZGluZyBhdWRpbyBmaWxlcyB0aGF0IGNhbiBiZSB1c2VkIGluIHRoZSBzY2VuYXJpbyAoZm9yIGluc3RhbmNlLCBieSB0aGUgYHBlcmZvcm1hbmNlYCBtb2R1bGUpLlxuICogVGhlIHtAbGluayBDbGllbnRMb2FkZXJ9IG1vZHVsZSBoYXMgYSB2aWV3IHRoYXQgZGlzcGxheXMgYSBsb2FkaW5nIGJhciBpbmRpY2F0aW5nIHRoZSBwcm9ncmVzcyBvZiB0aGUgbG9hZGluZy5cbiAqIFRoZSB7QGxpbmsgQ2xpZW50TG9hZGVyfSBtb2R1bGUgY2FsbHMgaXRzIGBkb25lYCBtZXRob2Qgd2hlbiBhbGwgdGhlIGZpbGVzIGFyZSBsb2FkZWQuXG4gKlxuICogVGhlIHtAbGluayBDbGllbnRMb2FkZXJ9IG1vZHVsZSByZXF1aXJlcyB0aGUgU0FTUyBwYXJ0aWFsIGBfNzctbG9hZGVyLnNjc3NgLlxuICogQGV4YW1wbGVcbiAqIC8vIEluc3RhbnRpYXRlIHRoZSBtb2R1bGUgd2l0aCB0aGUgZmlsZXMgdG8gbG9hZFxuICogY29uc3QgbG9hZGVyID0gbmV3IENsaWVudExvYWRlcihbJ3NvdW5kcy9raWNrLm1wMycsICdzb3VuZHMvc25hcmUubXAzJ10pO1xuICpcbiAqIC8vIEdldCB0aGUgY29ycmVzcG9uZGluZyBhdWRpbyBidWZmZXJzXG4gKiBjb25zdCBraWNrQnVmZmVyID0gbG9hZGVyLmF1ZGlvQnVmZmVyc1swXTtcbiAqIGNvbnN0IHNuYXJlQnVmZmVyID0gbG9hZGVyLmF1ZGlvQnVmZmVyc1sxXTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9hZGVyIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLiBBbHdheXMgaGFzIGEgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nZGlhbG9nJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbb3B0aW9ucy5maWxlcz1udWxsXSBUaGUgYXVkaW8gZmlsZXMgdG8gbG9hZC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5hc3luY2hyb25vdXM9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRvIGxvYWQgdGhlIGZpbGVzIGFzeW5jaHJvbm91c2x5IG9yIG5vdC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnbG9hZGVyJywgdHJ1ZSwgb3B0aW9ucy5jb2xvcik7XG5cbiAgICAvKipcbiAgICAgKiBBdWRpbyBidWZmZXJzIGNyZWF0ZWQgZnJvbSB0aGUgYXVkaW8gZmlsZXMgcGFzc2VkIGluIHRoZSB7QGxpbmsgQ2xpZW50TG9hZGVyI2NvbnN0cnVjdG9yfS5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5idWZmZXJzID0gW107XG5cbiAgICB0aGlzLl9maWxlcyA9IG9wdGlvbnMuZmlsZXMgfHwgbnVsbDtcbiAgICB0aGlzLl9hc3luY2hyb25vdXMgPSAhIW9wdGlvbnMuYXN5bmNocm9ub3VzO1xuICAgIHRoaXMuX2ZpbGVQcm9ncmVzcyA9IG51bGw7XG4gICAgdGhpcy5fcHJvZ3Jlc3NCYXIgPSBudWxsO1xuICAgIHRoaXMuX251bUZpbGVzTG9hZGVkID0gMDtcbiAgICB0aGlzLl9zaG93UHJvZ3Jlc3MgPSAob3B0aW9ucy5zaG93UHJvZ3Jlc3MgIT09IHVuZGVmaW5lZCkgP1xuICAgICAgb3B0aW9ucy5zaG93UHJvZ3Jlc3MgOiB0cnVlO1xuXG4gICAgaWYgKCF0aGlzLl9hc3luY2hyb25vdXMgJiYgdGhpcy5fc2hvd1Byb2dyZXNzKSB7XG4gICAgICBsZXQgdmlld0NvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHZpZXdDb250ZW50LmNsYXNzTGlzdC5hZGQoJ2NlbnRlcmVkLWNvbnRlbnQnKTtcbiAgICAgIHZpZXdDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3NvZnQtYmxpbmsnKTtcbiAgICAgIHRoaXMudmlldy5hcHBlbmRDaGlsZCh2aWV3Q29udGVudCk7XG5cbiAgICAgIGxldCBsb2FkaW5nVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgIGxvYWRpbmdUZXh0LmlubmVySFRNTCA9IFwiTG9hZGluZyBzb3VuZHPigKZcIjtcbiAgICAgIHZpZXdDb250ZW50LmFwcGVuZENoaWxkKGxvYWRpbmdUZXh0KTtcblxuICAgICAgbGV0IHByb2dyZXNzV3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgcHJvZ3Jlc3NXcmFwLmNsYXNzTGlzdC5hZGQoJ3Byb2dyZXNzLXdyYXAnKTtcbiAgICAgIHZpZXdDb250ZW50LmFwcGVuZENoaWxkKHByb2dyZXNzV3JhcCk7XG5cbiAgICAgIGxldCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmFkZCgncHJvZ3Jlc3MtYmFyJyk7XG4gICAgICBwcm9ncmVzc1dyYXAuYXBwZW5kQ2hpbGQocHJvZ3Jlc3NCYXIpO1xuXG4gICAgICB0aGlzLl9wcm9ncmVzc0JhciA9IHByb2dyZXNzQmFyO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5fbG9hZCh0aGlzLl9maWxlcyk7XG4gIH1cblxuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIF9sb2FkRmlsZShpbmRleCwgZmlsZSkge1xuICAgIGNvbnN0IGxvYWRlciA9IG5ldyBTdXBlckxvYWRlcigpO1xuXG4gICAgbG9hZGVyXG4gICAgICAubG9hZChbZmlsZV0pXG4gICAgICAudGhlbigoYnVmZmVycykgPT4ge1xuICAgICAgICBsZXQgYnVmZmVyID0gYnVmZmVyc1swXTtcblxuICAgICAgICB0aGlzLmJ1ZmZlcnNbaW5kZXhdID0gYnVmZmVyO1xuICAgICAgICB0aGlzLmVtaXQoJ2xvYWRlcjpmaWxlTG9hZGVkJywgaW5kZXgsIGZpbGUsIGJ1ZmZlcik7XG5cbiAgICAgICAgdGhpcy5fbnVtRmlsZXNMb2FkZWQrKztcbiAgICAgICAgaWYgKHRoaXMuX251bUZpbGVzTG9hZGVkID49IHRoaXMuYnVmZmVycy5sZW5ndGgpXG4gICAgICAgICAgdGhpcy5lbWl0KCdsb2FkZXI6YWxsRmlsZXNMb2FkZWQnKTtcbiAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgfVxuXG4gIF9sb2FkKGZpbGVMaXN0KSB7XG4gICAgaWYgKHRoaXMuX2FzeW5jaHJvbm91cykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlTGlzdC5sZW5ndGg7IGkrKylcbiAgICAgICAgdGhpcy5fbG9hZEZpbGUoaSwgZmlsZUxpc3RbaV0pO1xuXG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbG9hZGVyID0gbmV3IFN1cGVyTG9hZGVyKCk7XG5cbiAgICAgIHRoaXMuX2ZpbGVQcm9ncmVzcyA9IFtdO1xuXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgZmlsZUxpc3QubGVuZ3RoOyBpKyspXG4gICAgICAgIHRoaXMuX2ZpbGVQcm9ncmVzc1tpXSA9IDA7XG5cbiAgICAgIGxvYWRlci5wcm9ncmVzc0NhbGxiYWNrID0gdGhpcy5fcHJvZ3Jlc3NDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgbG9hZGVyLmxvYWQoZmlsZUxpc3QpXG4gICAgICAgIC50aGVuKChidWZmZXJzKSA9PiB7XG4gICAgICAgICAgdGhpcy5idWZmZXJzID0gYnVmZmVycztcbiAgICAgICAgICB0aGlzLmVtaXQoJ2xvYWRlcjphbGxGaWxlc0xvYWRlZCcpO1xuICAgICAgICAgIHRoaXMuZG9uZSgpO1xuICAgICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIF9wcm9ncmVzc0NhbGxiYWNrKG9iaikge1xuICAgIGNvbnN0IGZpbGVJbmRleCA9IG9iai5pbmRleDtcbiAgICBjb25zdCBmaWxlUHJvZ3Jlc3MgPSBvYmoudmFsdWU7XG4gICAgbGV0IHByb2dyZXNzID0gMDtcblxuICAgIHRoaXMuX2ZpbGVQcm9ncmVzc1tmaWxlSW5kZXhdID0gZmlsZVByb2dyZXNzO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9maWxlUHJvZ3Jlc3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHByb2dyZXNzICs9IHRoaXMuX2ZpbGVQcm9ncmVzc1tpXSAvIHRoaXMuX2ZpbGVQcm9ncmVzcy5sZW5ndGg7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3Byb2dyZXNzQmFyKSB7XG4gICAgICBwcm9ncmVzcyA9IE1hdGguY2VpbChwcm9ncmVzcyAqIDEwMCk7XG4gICAgICB0aGlzLl9wcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IHByb2dyZXNzICsgJyUnO1xuICAgIH1cbiAgfVxufVxuXG4iXX0=