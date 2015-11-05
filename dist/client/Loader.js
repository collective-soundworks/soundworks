'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var SuperLoader = require('waves-loaders').SuperLoader;
var client = require('./client');
var ClientModule = require('./ClientModule');
// import client from './client.es6.js';
// import ClientModule from './ClientModule.es6.js';

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

var ClientLoader = (function (_ClientModule) {
  _inherits(ClientLoader, _ClientModule);

  // export default class ClientLoader extends ClientModule {
  /**
   * Creates an instance of the class. Always has a view.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='dialog'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String[]} [options.files=null] The audio files to load.
   * @param {Boolean} [options.asynchronous=false] Indicates whether to load the files asynchronously or not.
   */

  function ClientLoader() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientLoader);

    _get(Object.getPrototypeOf(ClientLoader.prototype), 'constructor', this).call(this, options.name || 'loader', true, options.color);

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

  _createClass(ClientLoader, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientLoader.prototype), 'start', this).call(this);
      this._load(this._files);
    }
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(ClientLoader.prototype), 'restart', this).call(this);
      this.done();
    }
  }, {
    key: '_loadFile',
    value: function _loadFile(index, file) {
      var _this = this;

      var loader = new SuperLoader();

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
        var loader = new SuperLoader();

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

  return ClientLoader;
})(ClientModule);

module.exports = ClientLoader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvTG9hZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7OztBQUViLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFDekQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ25DLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0J6QyxZQUFZO1lBQVosWUFBWTs7Ozs7Ozs7Ozs7O0FBVUwsV0FWUCxZQUFZLEdBVVU7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVZwQixZQUFZOztBQVdkLCtCQVhFLFlBQVksNkNBV1IsT0FBTyxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Ozs7OztBQU1yRCxRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztBQUNwQyxRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO0FBQzVDLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxhQUFhLEdBQUcsQUFBQyxPQUFPLENBQUMsWUFBWSxLQUFLLFNBQVMsR0FDdEQsT0FBTyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7O0FBRTlCLFFBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDN0MsVUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRCxpQkFBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM5QyxpQkFBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDeEMsVUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRW5DLFVBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDOUMsaUJBQVcsQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQUM7QUFDMUMsaUJBQVcsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXJDLFVBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakQsa0JBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzVDLGlCQUFXLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUV0QyxVQUFJLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hELGlCQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMxQyxrQkFBWSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFdEMsVUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7S0FDakM7R0FDRjs7ZUEvQ0csWUFBWTs7V0FpRFgsaUJBQUc7QUFDTixpQ0FsREUsWUFBWSx1Q0FrREE7QUFDZCxVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN6Qjs7O1dBRU0sbUJBQUc7QUFDUixpQ0F2REUsWUFBWSx5Q0F1REU7QUFDaEIsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztXQUVRLG1CQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7OztBQUNyQixVQUFNLE1BQU0sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDOztBQUVqQyxZQUFNLENBQ0gsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FDWixJQUFJLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDakIsWUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV4QixjQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDN0IsY0FBSyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFcEQsY0FBSyxlQUFlLEVBQUUsQ0FBQztBQUN2QixZQUFJLE1BQUssZUFBZSxJQUFJLE1BQUssT0FBTyxDQUFDLE1BQU0sRUFDN0MsTUFBSyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztPQUN0QyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ1osZUFBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUNwQixDQUFDLENBQUM7S0FDTjs7O1dBRUksZUFBQyxRQUFRLEVBQUU7OztBQUNkLFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7QUFDdEMsY0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FBQSxBQUVqQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDYixNQUFNO0FBQ0wsWUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQzs7QUFFakMsWUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7O0FBRXhCLGFBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtBQUNyQyxjQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUFBLEFBRTVCLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVELGNBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQ2xCLElBQUksQ0FBQyxVQUFDLE9BQU8sRUFBSztBQUNqQixpQkFBSyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLGlCQUFLLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ25DLGlCQUFLLElBQUksRUFBRSxDQUFDO1NBQ2IsRUFBRSxVQUFDLEtBQUssRUFBSztBQUNaLGlCQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3BCLENBQUMsQ0FBQztPQUNOO0tBQ0Y7OztXQUVnQiwyQkFBQyxHQUFHLEVBQUU7QUFDckIsVUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUM1QixVQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQy9CLFVBQUksUUFBUSxHQUFHLENBQUMsQ0FBQzs7QUFFakIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxZQUFZLENBQUM7O0FBRTdDLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNsRCxnQkFBUSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7T0FDL0Q7O0FBRUQsVUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3JCLGdCQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDckMsWUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFFBQVEsR0FBRyxHQUFHLENBQUM7T0FDaEQ7S0FDRjs7O1NBdkhHLFlBQVk7R0FBUyxZQUFZOztBQTBIdkMsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMiLCJmaWxlIjoic3JjL2NsaWVudC9Mb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFN1cGVyTG9hZGVyID0gcmVxdWlyZSgnd2F2ZXMtbG9hZGVycycpLlN1cGVyTG9hZGVyO1xuY29uc3QgY2xpZW50ID0gcmVxdWlyZSgnLi9jbGllbnQnKTtcbmNvbnN0IENsaWVudE1vZHVsZSA9IHJlcXVpcmUoJy4vQ2xpZW50TW9kdWxlJyk7XG4vLyBpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50LmVzNi5qcyc7XG4vLyBpbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlLmVzNi5qcyc7XG5cbi8qKlxuICogVGhlIHtAbGluayBDbGllbnRMb2FkZXJ9IG1vZHVsZSBhbGxvd3MgZm9yIGxvYWRpbmcgYXVkaW8gZmlsZXMgdGhhdCBjYW4gYmUgdXNlZCBpbiB0aGUgc2NlbmFyaW8gKGZvciBpbnN0YW5jZSwgYnkgdGhlIGBwZXJmb3JtYW5jZWAgbW9kdWxlKS5cbiAqIFRoZSB7QGxpbmsgQ2xpZW50TG9hZGVyfSBtb2R1bGUgaGFzIGEgdmlldyB0aGF0IGRpc3BsYXlzIGEgbG9hZGluZyBiYXIgaW5kaWNhdGluZyB0aGUgcHJvZ3Jlc3Mgb2YgdGhlIGxvYWRpbmcuXG4gKiBUaGUge0BsaW5rIENsaWVudExvYWRlcn0gbW9kdWxlIGNhbGxzIGl0cyBgZG9uZWAgbWV0aG9kIHdoZW4gYWxsIHRoZSBmaWxlcyBhcmUgbG9hZGVkLlxuICpcbiAqIFRoZSB7QGxpbmsgQ2xpZW50TG9hZGVyfSBtb2R1bGUgcmVxdWlyZXMgdGhlIFNBU1MgcGFydGlhbCBgXzc3LWxvYWRlci5zY3NzYC5cbiAqIEBleGFtcGxlXG4gKiAvLyBJbnN0YW50aWF0ZSB0aGUgbW9kdWxlIHdpdGggdGhlIGZpbGVzIHRvIGxvYWRcbiAqIGNvbnN0IGxvYWRlciA9IG5ldyBDbGllbnRMb2FkZXIoWydzb3VuZHMva2ljay5tcDMnLCAnc291bmRzL3NuYXJlLm1wMyddKTtcbiAqXG4gKiAvLyBHZXQgdGhlIGNvcnJlc3BvbmRpbmcgYXVkaW8gYnVmZmVyc1xuICogY29uc3Qga2lja0J1ZmZlciA9IGxvYWRlci5hdWRpb0J1ZmZlcnNbMF07XG4gKiBjb25zdCBzbmFyZUJ1ZmZlciA9IGxvYWRlci5hdWRpb0J1ZmZlcnNbMV07XG4gKi9cbmNsYXNzIENsaWVudExvYWRlciBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4vLyBleHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRMb2FkZXIgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuIEFsd2F5cyBoYXMgYSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdkaWFsb2cnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtvcHRpb25zLmZpbGVzPW51bGxdIFRoZSBhdWRpbyBmaWxlcyB0byBsb2FkLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmFzeW5jaHJvbm91cz1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdG8gbG9hZCB0aGUgZmlsZXMgYXN5bmNocm9ub3VzbHkgb3Igbm90LlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdsb2FkZXInLCB0cnVlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIC8qKlxuICAgICAqIEF1ZGlvIGJ1ZmZlcnMgY3JlYXRlZCBmcm9tIHRoZSBhdWRpbyBmaWxlcyBwYXNzZWQgaW4gdGhlIHtAbGluayBDbGllbnRMb2FkZXIjY29uc3RydWN0b3J9LlxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICB0aGlzLmJ1ZmZlcnMgPSBbXTtcblxuICAgIHRoaXMuX2ZpbGVzID0gb3B0aW9ucy5maWxlcyB8fCBudWxsO1xuICAgIHRoaXMuX2FzeW5jaHJvbm91cyA9ICEhb3B0aW9ucy5hc3luY2hyb25vdXM7XG4gICAgdGhpcy5fZmlsZVByb2dyZXNzID0gbnVsbDtcbiAgICB0aGlzLl9wcm9ncmVzc0JhciA9IG51bGw7XG4gICAgdGhpcy5fbnVtRmlsZXNMb2FkZWQgPSAwO1xuICAgIHRoaXMuX3Nob3dQcm9ncmVzcyA9IChvcHRpb25zLnNob3dQcm9ncmVzcyAhPT0gdW5kZWZpbmVkKSA/XG4gICAgICBvcHRpb25zLnNob3dQcm9ncmVzcyA6IHRydWU7XG5cbiAgICBpZiAoIXRoaXMuX2FzeW5jaHJvbm91cyAmJiB0aGlzLl9zaG93UHJvZ3Jlc3MpIHtcbiAgICAgIGxldCB2aWV3Q29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdmlld0NvbnRlbnQuY2xhc3NMaXN0LmFkZCgnY2VudGVyZWQtY29udGVudCcpO1xuICAgICAgdmlld0NvbnRlbnQuY2xhc3NMaXN0LmFkZCgnc29mdC1ibGluaycpO1xuICAgICAgdGhpcy52aWV3LmFwcGVuZENoaWxkKHZpZXdDb250ZW50KTtcblxuICAgICAgbGV0IGxvYWRpbmdUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgbG9hZGluZ1RleHQuaW5uZXJIVE1MID0gXCJMb2FkaW5nIHNvdW5kc+KAplwiO1xuICAgICAgdmlld0NvbnRlbnQuYXBwZW5kQ2hpbGQobG9hZGluZ1RleHQpO1xuXG4gICAgICBsZXQgcHJvZ3Jlc3NXcmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBwcm9ncmVzc1dyYXAuY2xhc3NMaXN0LmFkZCgncHJvZ3Jlc3Mtd3JhcCcpO1xuICAgICAgdmlld0NvbnRlbnQuYXBwZW5kQ2hpbGQocHJvZ3Jlc3NXcmFwKTtcblxuICAgICAgbGV0IHByb2dyZXNzQmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QuYWRkKCdwcm9ncmVzcy1iYXInKTtcbiAgICAgIHByb2dyZXNzV3JhcC5hcHBlbmRDaGlsZChwcm9ncmVzc0Jhcik7XG5cbiAgICAgIHRoaXMuX3Byb2dyZXNzQmFyID0gcHJvZ3Jlc3NCYXI7XG4gICAgfVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLl9sb2FkKHRoaXMuX2ZpbGVzKTtcbiAgfVxuXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgX2xvYWRGaWxlKGluZGV4LCBmaWxlKSB7XG4gICAgY29uc3QgbG9hZGVyID0gbmV3IFN1cGVyTG9hZGVyKCk7XG5cbiAgICBsb2FkZXJcbiAgICAgIC5sb2FkKFtmaWxlXSlcbiAgICAgIC50aGVuKChidWZmZXJzKSA9PiB7XG4gICAgICAgIGxldCBidWZmZXIgPSBidWZmZXJzWzBdO1xuXG4gICAgICAgIHRoaXMuYnVmZmVyc1tpbmRleF0gPSBidWZmZXI7XG4gICAgICAgIHRoaXMuZW1pdCgnbG9hZGVyOmZpbGVMb2FkZWQnLCBpbmRleCwgZmlsZSwgYnVmZmVyKTtcblxuICAgICAgICB0aGlzLl9udW1GaWxlc0xvYWRlZCsrO1xuICAgICAgICBpZiAodGhpcy5fbnVtRmlsZXNMb2FkZWQgPj0gdGhpcy5idWZmZXJzLmxlbmd0aClcbiAgICAgICAgICB0aGlzLmVtaXQoJ2xvYWRlcjphbGxGaWxlc0xvYWRlZCcpO1xuICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgX2xvYWQoZmlsZUxpc3QpIHtcbiAgICBpZiAodGhpcy5fYXN5bmNocm9ub3VzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVMaXN0Lmxlbmd0aDsgaSsrKVxuICAgICAgICB0aGlzLl9sb2FkRmlsZShpLCBmaWxlTGlzdFtpXSk7XG5cbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBsb2FkZXIgPSBuZXcgU3VwZXJMb2FkZXIoKTtcblxuICAgICAgdGhpcy5fZmlsZVByb2dyZXNzID0gW107XG5cbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBmaWxlTGlzdC5sZW5ndGg7IGkrKylcbiAgICAgICAgdGhpcy5fZmlsZVByb2dyZXNzW2ldID0gMDtcblxuICAgICAgbG9hZGVyLnByb2dyZXNzQ2FsbGJhY2sgPSB0aGlzLl9wcm9ncmVzc0NhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICBsb2FkZXIubG9hZChmaWxlTGlzdClcbiAgICAgICAgLnRoZW4oKGJ1ZmZlcnMpID0+IHtcbiAgICAgICAgICB0aGlzLmJ1ZmZlcnMgPSBidWZmZXJzO1xuICAgICAgICAgIHRoaXMuZW1pdCgnbG9hZGVyOmFsbEZpbGVzTG9hZGVkJyk7XG4gICAgICAgICAgdGhpcy5kb25lKCk7XG4gICAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX3Byb2dyZXNzQ2FsbGJhY2sob2JqKSB7XG4gICAgY29uc3QgZmlsZUluZGV4ID0gb2JqLmluZGV4O1xuICAgIGNvbnN0IGZpbGVQcm9ncmVzcyA9IG9iai52YWx1ZTtcbiAgICBsZXQgcHJvZ3Jlc3MgPSAwO1xuXG4gICAgdGhpcy5fZmlsZVByb2dyZXNzW2ZpbGVJbmRleF0gPSBmaWxlUHJvZ3Jlc3M7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2ZpbGVQcm9ncmVzcy5sZW5ndGg7IGkrKykge1xuICAgICAgcHJvZ3Jlc3MgKz0gdGhpcy5fZmlsZVByb2dyZXNzW2ldIC8gdGhpcy5fZmlsZVByb2dyZXNzLmxlbmd0aDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcHJvZ3Jlc3NCYXIpIHtcbiAgICAgIHByb2dyZXNzID0gTWF0aC5jZWlsKHByb2dyZXNzICogMTAwKTtcbiAgICAgIHRoaXMuX3Byb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gcHJvZ3Jlc3MgKyAnJSc7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xpZW50TG9hZGVyO1xuIl19