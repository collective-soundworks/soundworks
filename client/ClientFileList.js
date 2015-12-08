'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

/**
 * [client] Retrieve a list of files on the server in the `/public` folder upon request of the client.
 *
 * The module can filter the file list by extensions. It never has a view.
 *
 * The module finishes its initialization when it receives the file list from the server.
 *
 * (See also {@link src/server/ServerFileList.js~ServerFileList} on the server side.)
 *
 * @example // Retrieve the mp3 file list in the folder `/recordings`
 * const filelist = new ClientFileList({
 *   folder: '/recordings',
 *   extensions: ['.mp3']
 * });
 */

var ClientFileList = (function (_ClientModule) {
  _inherits(ClientFileList, _ClientModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='filelist'] Name of the module.
   * @param {String} [options.folder=''] Subfolder of `/public` in which to retrieve the file list.
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

      this.send('request', this._folder, this._extensions);

      this.receive('files', function (files) {
        _this.files = files;
        _this.emit(_this.name + ':files', files);
        _this.done();
      }, this);
    }
  }]);

  return ClientFileList;
})(_ClientModule3['default']);

exports['default'] = ClientFileList;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzZCQUF5QixnQkFBZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0JwQixjQUFjO1lBQWQsY0FBYzs7Ozs7Ozs7O0FBT3RCLFdBUFEsY0FBYyxHQU9QO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFQTCxjQUFjOztBQVEvQiwrQkFSaUIsY0FBYyw2Q0FRekIsT0FBTyxDQUFDLElBQUksSUFBSSxVQUFVLEVBQUUsS0FBSyxFQUFFOzs7Ozs7QUFNekMsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDcEMsUUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLFNBQVMsQ0FBQztHQUNwRDs7Ozs7Ozs7ZUFsQmtCLGNBQWM7O1dBeUI1QixpQkFBRzs7O0FBQ04saUNBMUJpQixjQUFjLHVDQTBCakI7O0FBRWQsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXJELFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQy9CLGNBQUssS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixjQUFLLElBQUksQ0FBSSxNQUFLLElBQUksYUFBVSxLQUFLLENBQUMsQ0FBQztBQUN2QyxjQUFLLElBQUksRUFBRSxDQUFDO09BQ2IsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNWOzs7U0FuQ2tCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gUmV0cmlldmUgYSBsaXN0IG9mIGZpbGVzIG9uIHRoZSBzZXJ2ZXIgaW4gdGhlIGAvcHVibGljYCBmb2xkZXIgdXBvbiByZXF1ZXN0IG9mIHRoZSBjbGllbnQuXG4gKlxuICogVGhlIG1vZHVsZSBjYW4gZmlsdGVyIHRoZSBmaWxlIGxpc3QgYnkgZXh0ZW5zaW9ucy4gSXQgbmV2ZXIgaGFzIGEgdmlldy5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIGl0IHJlY2VpdmVzIHRoZSBmaWxlIGxpc3QgZnJvbSB0aGUgc2VydmVyLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJGaWxlTGlzdC5qc35TZXJ2ZXJGaWxlTGlzdH0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSAvLyBSZXRyaWV2ZSB0aGUgbXAzIGZpbGUgbGlzdCBpbiB0aGUgZm9sZGVyIGAvcmVjb3JkaW5nc2BcbiAqIGNvbnN0IGZpbGVsaXN0ID0gbmV3IENsaWVudEZpbGVMaXN0KHtcbiAqICAgZm9sZGVyOiAnL3JlY29yZGluZ3MnLFxuICogICBleHRlbnNpb25zOiBbJy5tcDMnXVxuICogfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudEZpbGVMaXN0IGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm5hbWU9J2ZpbGVsaXN0J10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZm9sZGVyPScnXSBTdWJmb2xkZXIgb2YgYC9wdWJsaWNgIGluIHdoaWNoIHRvIHJldHJpZXZlIHRoZSBmaWxlIGxpc3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtvcHRpb25zLmV4dGVudGlvbnM9dW5kZWZpbmVkXSBFeHRlbnNpb25zIG9mIHRoZSBmaWxlcyB0byByZXRyaWV2ZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnZmlsZWxpc3QnLCBmYWxzZSk7XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBmaWxlIHBhdGhzIHNlbnQgYnkgdGhlIHNlcnZlci5cbiAgICAgKiBAdHlwZSB7U3RyaW5nW119XG4gICAgICovXG4gICAgdGhpcy5maWxlcyA9IG51bGw7XG5cbiAgICB0aGlzLl9mb2xkZXIgPSBvcHRpb25zLmZvbGRlciB8fCAnJztcbiAgICB0aGlzLl9leHRlbnNpb25zID0gb3B0aW9ucy5leHRlbnNpb25zIHx8IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIG1vZHVsZS5cbiAgICogU2VuZHMgYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgYW5kIGxpc3RlbnMgZm9yIHRoZSBhbnN3ZXIuXG4gICAqIEBlbWl0cyB7dGhpcy5uYW1lICsgJzpmaWxlcyd9IFRoZSBmaWxlIHBhdGggbGlzdCB3aGVuIGl0IGlzIHJlY2VpdmVkIGZyb20gdGhlIHNlcnZlci5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnLCB0aGlzLl9mb2xkZXIsIHRoaXMuX2V4dGVuc2lvbnMpO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdmaWxlcycsIChmaWxlcykgPT4ge1xuICAgICAgdGhpcy5maWxlcyA9IGZpbGVzO1xuICAgICAgdGhpcy5lbWl0KGAke3RoaXMubmFtZX06ZmlsZXNgLCBmaWxlcyk7XG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9LCB0aGlzKTtcbiAgfVxufVxuIl19