'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var client = require('./client');
var ClientModule = require('./ClientModule');
// import client from './client.es6.js';
// import ClientModule from './ClientModule.es6.js';

/**
 * The {@link Filelist} module requests the file list of a folder from the server. The results can be filtered by file extensions.
 */

var Filelist = (function (_ClientModule) {
  _inherits(Filelist, _ClientModule);

  // export default class Filelist extends ClientModule {
  /**
   * Creates an instance of the class. Never has a view.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='filelist'] Name of the module.
   * @param {Object} [options.folder=''] Folder in which to retrieve the file list.
   * @param {Object} [options.extentions=undefined] Extensions of the files to retrieve.
   */

  function Filelist() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Filelist);

    _get(Object.getPrototypeOf(Filelist.prototype), 'constructor', this).call(this, options.name || 'filelist', false);

    /**
     * Array of file paths sent by the server.
     * @type {String[]}
     */
    this.files = null;

    this._folder = options.folder || '';
    this._extensions = options.extensions || undefined;
  }

  /**
   * Starts the module.
   * Sends a request to the server and listens for the answer.
   * @emits {this.name + ':files'} The file path list when it is received from the server.
   */

  _createClass(Filelist, [{
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(Filelist.prototype), 'start', this).call(this);

      client.send(this.name + ':request', this._folder, this._extensions);

      client.receive(this.name + ':files', function (files) {
        _this.files = files;
        _this.emit(_this.name + ':files', files);
        _this.done();
      }, this);
    }
  }]);

  return Filelist;
})(ClientModule);

module.exports = Filelist;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvRmlsZWxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7O0FBRWIsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ25DLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7Ozs7OztJQU96QyxRQUFRO1lBQVIsUUFBUTs7Ozs7Ozs7Ozs7QUFTRCxXQVRQLFFBQVEsR0FTYztRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBVHBCLFFBQVE7O0FBVVYsK0JBVkUsUUFBUSw2Q0FVSixPQUFPLENBQUMsSUFBSSxJQUFJLFVBQVUsRUFBRSxLQUFLLEVBQUU7Ozs7OztBQU16QyxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNwQyxRQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksU0FBUyxDQUFDO0dBQ3BEOzs7Ozs7OztlQXBCRyxRQUFROztXQTJCUCxpQkFBRzs7O0FBQ04saUNBNUJFLFFBQVEsdUNBNEJJOztBQUVkLFlBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXBFLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDOUMsY0FBSyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLGNBQUssSUFBSSxDQUFDLE1BQUssSUFBSSxHQUFHLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN2QyxjQUFLLElBQUksRUFBRSxDQUFDO09BQ2IsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNWOzs7U0FyQ0csUUFBUTtHQUFTLFlBQVk7O0FBd0NuQyxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyIsImZpbGUiOiJzcmMvY2xpZW50L0ZpbGVsaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBjbGllbnQgPSByZXF1aXJlKCcuL2NsaWVudCcpO1xuY29uc3QgQ2xpZW50TW9kdWxlID0gcmVxdWlyZSgnLi9DbGllbnRNb2R1bGUnKTtcbi8vIGltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQuZXM2LmpzJztcbi8vIGltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUuZXM2LmpzJztcblxuLyoqXG4gKiBUaGUge0BsaW5rIEZpbGVsaXN0fSBtb2R1bGUgcmVxdWVzdHMgdGhlIGZpbGUgbGlzdCBvZiBhIGZvbGRlciBmcm9tIHRoZSBzZXJ2ZXIuIFRoZSByZXN1bHRzIGNhbiBiZSBmaWx0ZXJlZCBieSBmaWxlIGV4dGVuc2lvbnMuXG4gKi9cbmNsYXNzIEZpbGVsaXN0IGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbi8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbGVsaXN0IGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLiBOZXZlciBoYXMgYSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5uYW1lPSdmaWxlbGlzdCddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmZvbGRlcj0nJ10gRm9sZGVyIGluIHdoaWNoIHRvIHJldHJpZXZlIHRoZSBmaWxlIGxpc3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5leHRlbnRpb25zPXVuZGVmaW5lZF0gRXh0ZW5zaW9ucyBvZiB0aGUgZmlsZXMgdG8gcmV0cmlldmUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2ZpbGVsaXN0JywgZmFsc2UpO1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgZmlsZSBwYXRocyBzZW50IGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICogQHR5cGUge1N0cmluZ1tdfVxuICAgICAqL1xuICAgIHRoaXMuZmlsZXMgPSBudWxsO1xuXG4gICAgdGhpcy5fZm9sZGVyID0gb3B0aW9ucy5mb2xkZXIgfHwgJyc7XG4gICAgdGhpcy5fZXh0ZW5zaW9ucyA9IG9wdGlvbnMuZXh0ZW5zaW9ucyB8fCB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqIFNlbmRzIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIGFuZCBsaXN0ZW5zIGZvciB0aGUgYW5zd2VyLlxuICAgKiBAZW1pdHMge3RoaXMubmFtZSArICc6ZmlsZXMnfSBUaGUgZmlsZSBwYXRoIGxpc3Qgd2hlbiBpdCBpcyByZWNlaXZlZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpyZXF1ZXN0JywgdGhpcy5fZm9sZGVyLCB0aGlzLl9leHRlbnNpb25zKTtcblxuICAgIGNsaWVudC5yZWNlaXZlKHRoaXMubmFtZSArICc6ZmlsZXMnLCAoZmlsZXMpID0+IHtcbiAgICAgIHRoaXMuZmlsZXMgPSBmaWxlcztcbiAgICAgIHRoaXMuZW1pdCh0aGlzLm5hbWUgKyAnOmZpbGVzJywgZmlsZXMpO1xuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfSwgdGhpcyk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGaWxlbGlzdDtcbiJdfQ==