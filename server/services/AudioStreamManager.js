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

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _helpers = require('../../utils/helpers');

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Slicer = require('node-audio-slicer').Slicer;


var SERVICE_ID = 'service:audio-stream-manager';

/**
 * Interface for the server `'audio-stream-manager'` service.
 *
 * This service allows to stream audio buffers to the client during the experience
 * (not preloaded). Input audio files are segmented by the server upon startup and 
 * sent to the clients upon request. Service only accepts .wav files at the moment.
 * Service main objective is to 1) enable synced streaming between clients (not precise
 * if based on mediaElementSources), and 2) provide an equivalent to the mediaElementSource
 * object (streaming as a Web Audio API node) that could be plugged to any other node in Safari
 * (bypassing e.g. gain or analyzer nodes when plugged to mediaElementSource).
 *
 * __*The service should be used with its [client-side counterpart]{@link module:soundworks/client.AudioStreamManager}*__
 *
 * @param {Object} options
 * @param {Array<String>} options.audioFiles - list of paths towards would-be-streamable audio files.
 * @param {Bool} options.compress - Generate .mp3 stream chunks if set to true. Keep input file extension otherwise.
 * @param {Number} options.duration - Audio chunks duration (in sec).
 * @param {Number} options.overlap - Duration of additional audio samples added to head and tail of streamed audio 
 *  buffers. Paired with a fade-in fade-out mechanism on client's side, this allows to hide distortions induced by 
 *  mp3 encoding of audio chunks not starting / finishing with zeroed samples.
 *
 * @memberof module:soundworks/server
 * @example
 * // Require and configure `audio-stream-manager` service (inside experience constructor).
 * // define list of "streamable" audio files
 * let audioFiles = [
 *   './public/stream/my-audio-file.wav',
 *   './public/stream/another-audio-file.wav',
 * ];
 * // require service
 * this.audioStreamManager = this.require('audio-stream-manager', {audioFiles: audioFiles});
 */

var AudioStreamManager = function (_Service) {
  (0, _inherits3.default)(AudioStreamManager, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instantiated manually_ */
  function AudioStreamManager() {
    (0, _classCallCheck3.default)(this, AudioStreamManager);

    // services
    var _this = (0, _possibleConstructorReturn3.default)(this, (AudioStreamManager.__proto__ || (0, _getPrototypeOf2.default)(AudioStreamManager)).call(this, SERVICE_ID));

    _this._sync = _this.require('sync');

    // config
    var defaults = {
      audioFiles: '',
      compress: true,
      duration: 4,
      overlap: 0.1
    };
    _this.configure(defaults);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(AudioStreamManager, [{
    key: 'configure',
    value: function configure(options) {
      (0, _get3.default)(AudioStreamManager.prototype.__proto__ || (0, _getPrototypeOf2.default)(AudioStreamManager.prototype), 'configure', this).call(this, options);
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)(AudioStreamManager.prototype.__proto__ || (0, _getPrototypeOf2.default)(AudioStreamManager.prototype), 'start', this).call(this);

      // skip chunk creation if no audio file defined in input list
      if (this.options.audioFiles === '') {
        this.ready();
        return;
      }

      this.prepareStreamChunks(this.options.audioFiles, function (bufferInfos) {
        _this2.bufferInfos = bufferInfos;
        _this2.ready();
      });
    }

    /** @private */

  }, {
    key: 'connect',
    value: function connect(client) {
      this.receive(client, 'request', this._onRequest(client));
    }

    /** @private */

  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this3 = this;

      return function () {
        _this3.send(client, 'acknowlegde', _this3.bufferInfos);
      };
    }

    /*
     * Segment audio files listed into audioFiles into chunks for streaming.
     * @param {Array<String>} audioFiles - list of paths towards audio files to chunk.
     * @param {Object} callback - Function to call when slicing completed.
     */

  }, {
    key: 'prepareStreamChunks',
    value: function prepareStreamChunks(audioFiles, callback) {
      // output array
      var bufferInfos = [];

      // init slicer
      var slicer = new Slicer({
        compress: this.options.compress,
        duration: this.options.duration,
        overlap: this.options.overlap
      });

      // loop over input audio files
      audioFiles.forEach(function (item, id) {
        // slice current audio file
        slicer.slice(item, function (chunkList) {
          // feed local array
          bufferInfos.push(chunkList);
          // return local map when all file processed
          if (bufferInfos.length >= audioFiles.length) {
            callback(bufferInfos);
          }
        });
      });
    }
  }]);
  return AudioStreamManager;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, AudioStreamManager);

exports.default = AudioStreamManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvU3RyZWFtTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJTbGljZXIiLCJyZXF1aXJlIiwiU0VSVklDRV9JRCIsIkF1ZGlvU3RyZWFtTWFuYWdlciIsIl9zeW5jIiwiZGVmYXVsdHMiLCJhdWRpb0ZpbGVzIiwiY29tcHJlc3MiLCJkdXJhdGlvbiIsIm92ZXJsYXAiLCJjb25maWd1cmUiLCJvcHRpb25zIiwicmVhZHkiLCJwcmVwYXJlU3RyZWFtQ2h1bmtzIiwiYnVmZmVySW5mb3MiLCJjbGllbnQiLCJyZWNlaXZlIiwiX29uUmVxdWVzdCIsInNlbmQiLCJjYWxsYmFjayIsInNsaWNlciIsImZvckVhY2giLCJpdGVtIiwiaWQiLCJzbGljZSIsImNodW5rTGlzdCIsInB1c2giLCJsZW5ndGgiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBSEEsSUFBTUEsU0FBU0MsUUFBUSxtQkFBUixFQUE2QkQsTUFBNUM7OztBQUtBLElBQU1FLGFBQWEsOEJBQW5COztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQ01DLGtCOzs7QUFDSjtBQUNBLGdDQUFjO0FBQUE7O0FBR1o7QUFIWSw4SkFDTkQsVUFETTs7QUFJWixVQUFLRSxLQUFMLEdBQWEsTUFBS0gsT0FBTCxDQUFhLE1BQWIsQ0FBYjs7QUFFQTtBQUNBLFFBQU1JLFdBQVc7QUFDZkMsa0JBQVksRUFERztBQUVmQyxnQkFBVSxJQUZLO0FBR2ZDLGdCQUFVLENBSEs7QUFJZkMsZUFBUztBQUpNLEtBQWpCO0FBTUEsVUFBS0MsU0FBTCxDQUFlTCxRQUFmO0FBYlk7QUFjYjs7QUFFRDs7Ozs7OEJBQ1VNLE8sRUFBUztBQUNqQiw4SkFBZ0JBLE9BQWhCO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1E7QUFBQTs7QUFDTjs7QUFFQTtBQUNBLFVBQUksS0FBS0EsT0FBTCxDQUFhTCxVQUFiLEtBQTRCLEVBQWhDLEVBQW9DO0FBQ2xDLGFBQUtNLEtBQUw7QUFDQTtBQUNEOztBQUVELFdBQUtDLG1CQUFMLENBQXlCLEtBQUtGLE9BQUwsQ0FBYUwsVUFBdEMsRUFBa0QsVUFBQ1EsV0FBRCxFQUFpQjtBQUNqRSxlQUFLQSxXQUFMLEdBQW1CQSxXQUFuQjtBQUNBLGVBQUtGLEtBQUw7QUFDRCxPQUhEO0FBSUQ7O0FBRUQ7Ozs7NEJBQ1FHLE0sRUFBUTtBQUNkLFdBQUtDLE9BQUwsQ0FBYUQsTUFBYixFQUFxQixTQUFyQixFQUFnQyxLQUFLRSxVQUFMLENBQWdCRixNQUFoQixDQUFoQztBQUNEOztBQUVEOzs7OytCQUNXQSxNLEVBQVE7QUFBQTs7QUFDakIsYUFBTyxZQUFNO0FBQUUsZUFBS0csSUFBTCxDQUFVSCxNQUFWLEVBQWtCLGFBQWxCLEVBQWlDLE9BQUtELFdBQXRDO0FBQXFELE9BQXBFO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dDQUtvQlIsVSxFQUFZYSxRLEVBQVU7QUFDeEM7QUFDQSxVQUFJTCxjQUFjLEVBQWxCOztBQUVBO0FBQ0EsVUFBSU0sU0FBUyxJQUFJcEIsTUFBSixDQUFXO0FBQ3RCTyxrQkFBVSxLQUFLSSxPQUFMLENBQWFKLFFBREQ7QUFFdEJDLGtCQUFVLEtBQUtHLE9BQUwsQ0FBYUgsUUFGRDtBQUd0QkMsaUJBQVMsS0FBS0UsT0FBTCxDQUFhRjtBQUhBLE9BQVgsQ0FBYjs7QUFNQTtBQUNBSCxpQkFBV2UsT0FBWCxDQUFtQixVQUFDQyxJQUFELEVBQU9DLEVBQVAsRUFBYztBQUMvQjtBQUNBSCxlQUFPSSxLQUFQLENBQWFGLElBQWIsRUFBbUIsVUFBQ0csU0FBRCxFQUFlO0FBQ2hDO0FBQ0FYLHNCQUFZWSxJQUFaLENBQWlCRCxTQUFqQjtBQUNBO0FBQ0EsY0FBSVgsWUFBWWEsTUFBWixJQUFzQnJCLFdBQVdxQixNQUFyQyxFQUE2QztBQUMzQ1IscUJBQVNMLFdBQVQ7QUFDRDtBQUNGLFNBUEQ7QUFRRCxPQVZEO0FBV0Q7Ozs7O0FBSUgseUJBQWVjLFFBQWYsQ0FBd0IxQixVQUF4QixFQUFvQ0Msa0JBQXBDOztrQkFFZUEsa0IiLCJmaWxlIjoiQXVkaW9TdHJlYW1NYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgU2xpY2VyID0gcmVxdWlyZSgnbm9kZS1hdWRpby1zbGljZXInKS5TbGljZXI7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHsgZ2V0T3B0IH0gZnJvbSAnLi4vLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTphdWRpby1zdHJlYW0tbWFuYWdlcic7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgc2VydmVyIGAnYXVkaW8tc3RyZWFtLW1hbmFnZXInYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdG8gc3RyZWFtIGF1ZGlvIGJ1ZmZlcnMgdG8gdGhlIGNsaWVudCBkdXJpbmcgdGhlIGV4cGVyaWVuY2VcbiAqIChub3QgcHJlbG9hZGVkKS4gSW5wdXQgYXVkaW8gZmlsZXMgYXJlIHNlZ21lbnRlZCBieSB0aGUgc2VydmVyIHVwb24gc3RhcnR1cCBhbmQgXG4gKiBzZW50IHRvIHRoZSBjbGllbnRzIHVwb24gcmVxdWVzdC4gU2VydmljZSBvbmx5IGFjY2VwdHMgLndhdiBmaWxlcyBhdCB0aGUgbW9tZW50LlxuICogU2VydmljZSBtYWluIG9iamVjdGl2ZSBpcyB0byAxKSBlbmFibGUgc3luY2VkIHN0cmVhbWluZyBiZXR3ZWVuIGNsaWVudHMgKG5vdCBwcmVjaXNlXG4gKiBpZiBiYXNlZCBvbiBtZWRpYUVsZW1lbnRTb3VyY2VzKSwgYW5kIDIpIHByb3ZpZGUgYW4gZXF1aXZhbGVudCB0byB0aGUgbWVkaWFFbGVtZW50U291cmNlXG4gKiBvYmplY3QgKHN0cmVhbWluZyBhcyBhIFdlYiBBdWRpbyBBUEkgbm9kZSkgdGhhdCBjb3VsZCBiZSBwbHVnZ2VkIHRvIGFueSBvdGhlciBub2RlIGluIFNhZmFyaVxuICogKGJ5cGFzc2luZyBlLmcuIGdhaW4gb3IgYW5hbHl6ZXIgbm9kZXMgd2hlbiBwbHVnZ2VkIHRvIG1lZGlhRWxlbWVudFNvdXJjZSkuXG4gKlxuICogX18qVGhlIHNlcnZpY2Ugc2hvdWxkIGJlIHVzZWQgd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQXVkaW9TdHJlYW1NYW5hZ2VyfSpfX1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IG9wdGlvbnMuYXVkaW9GaWxlcyAtIGxpc3Qgb2YgcGF0aHMgdG93YXJkcyB3b3VsZC1iZS1zdHJlYW1hYmxlIGF1ZGlvIGZpbGVzLlxuICogQHBhcmFtIHtCb29sfSBvcHRpb25zLmNvbXByZXNzIC0gR2VuZXJhdGUgLm1wMyBzdHJlYW0gY2h1bmtzIGlmIHNldCB0byB0cnVlLiBLZWVwIGlucHV0IGZpbGUgZXh0ZW5zaW9uIG90aGVyd2lzZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLmR1cmF0aW9uIC0gQXVkaW8gY2h1bmtzIGR1cmF0aW9uIChpbiBzZWMpLlxuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMub3ZlcmxhcCAtIER1cmF0aW9uIG9mIGFkZGl0aW9uYWwgYXVkaW8gc2FtcGxlcyBhZGRlZCB0byBoZWFkIGFuZCB0YWlsIG9mIHN0cmVhbWVkIGF1ZGlvIFxuICogIGJ1ZmZlcnMuIFBhaXJlZCB3aXRoIGEgZmFkZS1pbiBmYWRlLW91dCBtZWNoYW5pc20gb24gY2xpZW50J3Mgc2lkZSwgdGhpcyBhbGxvd3MgdG8gaGlkZSBkaXN0b3J0aW9ucyBpbmR1Y2VkIGJ5IFxuICogIG1wMyBlbmNvZGluZyBvZiBhdWRpbyBjaHVua3Mgbm90IHN0YXJ0aW5nIC8gZmluaXNoaW5nIHdpdGggemVyb2VkIHNhbXBsZXMuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQGV4YW1wbGVcbiAqIC8vIFJlcXVpcmUgYW5kIGNvbmZpZ3VyZSBgYXVkaW8tc3RyZWFtLW1hbmFnZXJgIHNlcnZpY2UgKGluc2lkZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yKS5cbiAqIC8vIGRlZmluZSBsaXN0IG9mIFwic3RyZWFtYWJsZVwiIGF1ZGlvIGZpbGVzXG4gKiBsZXQgYXVkaW9GaWxlcyA9IFtcbiAqICAgJy4vcHVibGljL3N0cmVhbS9teS1hdWRpby1maWxlLndhdicsXG4gKiAgICcuL3B1YmxpYy9zdHJlYW0vYW5vdGhlci1hdWRpby1maWxlLndhdicsXG4gKiBdO1xuICogLy8gcmVxdWlyZSBzZXJ2aWNlXG4gKiB0aGlzLmF1ZGlvU3RyZWFtTWFuYWdlciA9IHRoaXMucmVxdWlyZSgnYXVkaW8tc3RyZWFtLW1hbmFnZXInLCB7YXVkaW9GaWxlczogYXVkaW9GaWxlc30pO1xuICovXG5cbmNsYXNzIEF1ZGlvU3RyZWFtTWFuYWdlciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW50aWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgLy8gc2VydmljZXNcbiAgICB0aGlzLl9zeW5jID0gdGhpcy5yZXF1aXJlKCdzeW5jJyk7XG5cbiAgICAvLyBjb25maWdcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGF1ZGlvRmlsZXM6ICcnLFxuICAgICAgY29tcHJlc3M6IHRydWUsXG4gICAgICBkdXJhdGlvbjogNCxcbiAgICAgIG92ZXJsYXA6IDAuMVxuICAgIH07XG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgc3VwZXIuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICAvLyBza2lwIGNodW5rIGNyZWF0aW9uIGlmIG5vIGF1ZGlvIGZpbGUgZGVmaW5lZCBpbiBpbnB1dCBsaXN0XG4gICAgaWYgKHRoaXMub3B0aW9ucy5hdWRpb0ZpbGVzID09PSAnJykge8KgXG4gICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtQ2h1bmtzKHRoaXMub3B0aW9ucy5hdWRpb0ZpbGVzLCAoYnVmZmVySW5mb3MpID0+IHtcbiAgICAgIHRoaXMuYnVmZmVySW5mb3MgPSBidWZmZXJJbmZvcztcbiAgICAgIHRoaXMucmVhZHkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICgpID0+IHsgdGhpcy5zZW5kKGNsaWVudCwgJ2Fja25vd2xlZ2RlJywgdGhpcy5idWZmZXJJbmZvcyk7IH07XG4gIH1cblxuICAvKlxuICAgKiBTZWdtZW50IGF1ZGlvIGZpbGVzIGxpc3RlZCBpbnRvIGF1ZGlvRmlsZXMgaW50byBjaHVua3MgZm9yIHN0cmVhbWluZy5cbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBhdWRpb0ZpbGVzIC0gbGlzdCBvZiBwYXRocyB0b3dhcmRzIGF1ZGlvIGZpbGVzIHRvIGNodW5rLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byBjYWxsIHdoZW4gc2xpY2luZyBjb21wbGV0ZWQuXG4gICAqL1xuICBwcmVwYXJlU3RyZWFtQ2h1bmtzKGF1ZGlvRmlsZXMsIGNhbGxiYWNrKSB7XG4gICAgLy8gb3V0cHV0IGFycmF5XG4gICAgbGV0IGJ1ZmZlckluZm9zID0gW107XG5cbiAgICAvLyBpbml0IHNsaWNlclxuICAgIGxldCBzbGljZXIgPSBuZXcgU2xpY2VyKHtcbiAgICAgIGNvbXByZXNzOiB0aGlzLm9wdGlvbnMuY29tcHJlc3MsXG4gICAgICBkdXJhdGlvbjogdGhpcy5vcHRpb25zLmR1cmF0aW9uLFxuICAgICAgb3ZlcmxhcDogdGhpcy5vcHRpb25zLm92ZXJsYXBcbiAgICB9KTtcblxuICAgIC8vIGxvb3Agb3ZlciBpbnB1dCBhdWRpbyBmaWxlc1xuICAgIGF1ZGlvRmlsZXMuZm9yRWFjaCgoaXRlbSwgaWQpID0+IHtcbiAgICAgIC8vIHNsaWNlIGN1cnJlbnQgYXVkaW8gZmlsZVxuICAgICAgc2xpY2VyLnNsaWNlKGl0ZW0sIChjaHVua0xpc3QpID0+IHtcbiAgICAgICAgLy8gZmVlZCBsb2NhbCBhcnJheVxuICAgICAgICBidWZmZXJJbmZvcy5wdXNoKGNodW5rTGlzdCk7XG4gICAgICAgIC8vIHJldHVybiBsb2NhbCBtYXAgd2hlbiBhbGwgZmlsZSBwcm9jZXNzZWRcbiAgICAgICAgaWYgKGJ1ZmZlckluZm9zLmxlbmd0aCA+PSBhdWRpb0ZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgIGNhbGxiYWNrKGJ1ZmZlckluZm9zKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBBdWRpb1N0cmVhbU1hbmFnZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBBdWRpb1N0cmVhbU1hbmFnZXI7Il19