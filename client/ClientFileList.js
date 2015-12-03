'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

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

      this.send('request', this._folder, this._extensions);

      this.receive('files', function (files) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50RmlsZUxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBbUIsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZ0JSLGNBQWM7WUFBZCxjQUFjOzs7Ozs7Ozs7QUFPdEIsV0FQUSxjQUFjLEdBT1A7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVBMLGNBQWM7O0FBUS9CLCtCQVJpQixjQUFjLDZDQVF6QixPQUFPLENBQUMsSUFBSSxJQUFJLFVBQVUsRUFBRSxLQUFLLEVBQUU7Ozs7OztBQU16QyxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNwQyxRQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksU0FBUyxDQUFDO0dBQ3BEOzs7Ozs7OztlQWxCa0IsY0FBYzs7V0F5QjVCLGlCQUFHOzs7QUFDTixpQ0ExQmlCLGNBQWMsdUNBMEJqQjs7QUFFZCxVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFckQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDL0IsY0FBSyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLGNBQUssSUFBSSxDQUFJLE1BQUssSUFBSSxhQUFVLEtBQUssQ0FBQyxDQUFDO0FBQ3ZDLGNBQUssSUFBSSxFQUFFLENBQUM7T0FDYixFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ1Y7OztTQW5Da0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRGaWxlTGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gUmV0cmlldmUgYSBsaXN0IG9mIGZpbGVzIG9uIHRoZSBzZXJ2ZXIuXG4gKlxuICogVGhlIG1vZHVsZSBjYW4gZmlsdGVyIHRoZSBmaWxlIGxpc3QgYnkgZXh0ZW5zaW9ucy4gSXQgbmV2ZXIgaGFzIGEgdmlldy5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIGl0IHJlY2VpdmVzIHRoZSBmaWxlIGxpc3QgZnJvbSB0aGUgc2VydmVyLlxuICpcbiAqIEBleGFtcGxlIC8vIFJldHJpZXZlIHRoZSBtcDMgZmlsZSBsaXN0IGluIHRoZSBmb2xkZXIgYC9yZWNvcmRpbmdzYFxuICogY29uc3QgZmlsZWxpc3QgPSBuZXcgQ2xpZW50RmlsZUxpc3Qoe1xuICogICBmb2xkZXI6ICcvcmVjb3JkaW5ncycsXG4gKiAgIGV4dGVuc2lvbnM6IFsnLm1wMyddXG4gKiB9KTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50RmlsZUxpc3QgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubmFtZT0nZmlsZWxpc3QnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5mb2xkZXI9JyddIEZvbGRlciBpbiB3aGljaCB0byByZXRyaWV2ZSB0aGUgZmlsZSBsaXN0LlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbb3B0aW9ucy5leHRlbnRpb25zPXVuZGVmaW5lZF0gRXh0ZW5zaW9ucyBvZiB0aGUgZmlsZXMgdG8gcmV0cmlldmUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2ZpbGVsaXN0JywgZmFsc2UpO1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgZmlsZSBwYXRocyBzZW50IGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICogQHR5cGUge1N0cmluZ1tdfVxuICAgICAqL1xuICAgIHRoaXMuZmlsZXMgPSBudWxsO1xuXG4gICAgdGhpcy5fZm9sZGVyID0gb3B0aW9ucy5mb2xkZXIgfHwgJyc7XG4gICAgdGhpcy5fZXh0ZW5zaW9ucyA9IG9wdGlvbnMuZXh0ZW5zaW9ucyB8fCB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqIFNlbmRzIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIGFuZCBsaXN0ZW5zIGZvciB0aGUgYW5zd2VyLlxuICAgKiBAZW1pdHMge3RoaXMubmFtZSArICc6ZmlsZXMnfSBUaGUgZmlsZSBwYXRoIGxpc3Qgd2hlbiBpdCBpcyByZWNlaXZlZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0JywgdGhpcy5fZm9sZGVyLCB0aGlzLl9leHRlbnNpb25zKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnZmlsZXMnLCAoZmlsZXMpID0+IHtcbiAgICAgIHRoaXMuZmlsZXMgPSBmaWxlcztcbiAgICAgIHRoaXMuZW1pdChgJHt0aGlzLm5hbWV9OmZpbGVzYCwgZmlsZXMpO1xuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfSwgdGhpcyk7XG4gIH1cbn1cbiJdfQ==