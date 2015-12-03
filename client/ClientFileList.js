'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

/**
 * [client] Retrieve a list of files on the server.
 *
 * The module can filter the file list by extensions. It never has a view.
 *
 * The module finishes its initialization when it receives the file list from the server.
 *
 * @example // Retrieve the mp3 file list in the folder `/recordings`
 * const filelist = new ClientFileList({
 *   folder: '/recordings',
 *   extensions: ['.mp3']
 * });
 */

var ClientFileList = (function (_Module) {
  _inherits(ClientFileList, _Module);

  /**
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='filelist'] Name of the module.
   * @param {String} [options.folder=''] Folder in which to retrieve the file list.
   * @param {String[]} [options.extentions=undefined] Extensions of the files to retrieve.
   */

  function ClientFileList() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientFileList);

    _get(Object.getPrototypeOf(ClientFileList.prototype), 'constructor', this).call(this, options.name || 'filelist', false);

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

  _createClass(ClientFileList, [{
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(ClientFileList.prototype), 'start', this).call(this);

      _client2['default'].send(this.name + ':request', this._folder, this._extensions);

      _client2['default'].receive(this.name + ':files', function (files) {
        _this.files = files;
        _this.emit(_this.name + ':files', files);
        _this.done();
      }, this);
    }
  }]);

  return ClientFileList;
})(_Module3['default']);

exports['default'] = ClientFileList;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50RmlsZUxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFlUixjQUFjO1lBQWQsY0FBYzs7Ozs7Ozs7O0FBT3RCLFdBUFEsY0FBYyxHQU9QO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFQTCxjQUFjOztBQVEvQiwrQkFSaUIsY0FBYyw2Q0FRekIsT0FBTyxDQUFDLElBQUksSUFBSSxVQUFVLEVBQUUsS0FBSyxFQUFFOzs7Ozs7QUFNekMsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDcEMsUUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLFNBQVMsQ0FBQztHQUNwRDs7Ozs7Ozs7ZUFsQmtCLGNBQWM7O1dBeUI1QixpQkFBRzs7O0FBQ04saUNBMUJpQixjQUFjLHVDQTBCakI7O0FBRWQsMEJBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUVwRSwwQkFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDOUMsY0FBSyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLGNBQUssSUFBSSxDQUFDLE1BQUssSUFBSSxHQUFHLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN2QyxjQUFLLElBQUksRUFBRSxDQUFDO09BQ2IsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNWOzs7U0FuQ2tCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50RmlsZUxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG4vKipcbiAqIFtjbGllbnRdIFJldHJpZXZlIGEgbGlzdCBvZiBmaWxlcyBvbiB0aGUgc2VydmVyLlxuICpcbiAqIFRoZSBtb2R1bGUgY2FuIGZpbHRlciB0aGUgZmlsZSBsaXN0IGJ5IGV4dGVuc2lvbnMuIEl0IG5ldmVyIGhhcyBhIHZpZXcuXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gd2hlbiBpdCByZWNlaXZlcyB0aGUgZmlsZSBsaXN0IGZyb20gdGhlIHNlcnZlci5cbiAqXG4gKiBAZXhhbXBsZSAvLyBSZXRyaWV2ZSB0aGUgbXAzIGZpbGUgbGlzdCBpbiB0aGUgZm9sZGVyIGAvcmVjb3JkaW5nc2BcbiAqIGNvbnN0IGZpbGVsaXN0ID0gbmV3IENsaWVudEZpbGVMaXN0KHtcbiAqICAgZm9sZGVyOiAnL3JlY29yZGluZ3MnLFxuICogICBleHRlbnNpb25zOiBbJy5tcDMnXVxuICogfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudEZpbGVMaXN0IGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm5hbWU9J2ZpbGVsaXN0J10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZm9sZGVyPScnXSBGb2xkZXIgaW4gd2hpY2ggdG8gcmV0cmlldmUgdGhlIGZpbGUgbGlzdC5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW29wdGlvbnMuZXh0ZW50aW9ucz11bmRlZmluZWRdIEV4dGVuc2lvbnMgb2YgdGhlIGZpbGVzIHRvIHJldHJpZXZlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdmaWxlbGlzdCcsIGZhbHNlKTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIGZpbGUgcGF0aHMgc2VudCBieSB0aGUgc2VydmVyLlxuICAgICAqIEB0eXBlIHtTdHJpbmdbXX1cbiAgICAgKi9cbiAgICB0aGlzLmZpbGVzID0gbnVsbDtcblxuICAgIHRoaXMuX2ZvbGRlciA9IG9wdGlvbnMuZm9sZGVyIHx8ICcnO1xuICAgIHRoaXMuX2V4dGVuc2lvbnMgPSBvcHRpb25zLmV4dGVuc2lvbnMgfHwgdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBTZW5kcyBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciBhbmQgbGlzdGVucyBmb3IgdGhlIGFuc3dlci5cbiAgICogQGVtaXRzIHt0aGlzLm5hbWUgKyAnOmZpbGVzJ30gVGhlIGZpbGUgcGF0aCBsaXN0IHdoZW4gaXQgaXMgcmVjZWl2ZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGNsaWVudC5zZW5kKHRoaXMubmFtZSArICc6cmVxdWVzdCcsIHRoaXMuX2ZvbGRlciwgdGhpcy5fZXh0ZW5zaW9ucyk7XG5cbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOmZpbGVzJywgKGZpbGVzKSA9PiB7XG4gICAgICB0aGlzLmZpbGVzID0gZmlsZXM7XG4gICAgICB0aGlzLmVtaXQodGhpcy5uYW1lICsgJzpmaWxlcycsIGZpbGVzKTtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH0sIHRoaXMpO1xuICB9XG59XG4iXX0=