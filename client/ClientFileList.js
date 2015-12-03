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

var ClientFileList = (function (_Module) {
  _inherits(ClientFileList, _Module);

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
})(_Module3['default']);

exports['default'] = ClientFileList;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50RmlsZUxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBbUIsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFrQlIsY0FBYztZQUFkLGNBQWM7Ozs7Ozs7OztBQU90QixXQVBRLGNBQWMsR0FPUDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUEwsY0FBYzs7QUFRL0IsK0JBUmlCLGNBQWMsNkNBUXpCLE9BQU8sQ0FBQyxJQUFJLElBQUksVUFBVSxFQUFFLEtBQUssRUFBRTs7Ozs7O0FBTXpDLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVsQixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxTQUFTLENBQUM7R0FDcEQ7Ozs7Ozs7O2VBbEJrQixjQUFjOztXQXlCNUIsaUJBQUc7OztBQUNOLGlDQTFCaUIsY0FBYyx1Q0EwQmpCOztBQUVkLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUVyRCxVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBSztBQUMvQixjQUFLLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsY0FBSyxJQUFJLENBQUksTUFBSyxJQUFJLGFBQVUsS0FBSyxDQUFDLENBQUM7QUFDdkMsY0FBSyxJQUFJLEVBQUUsQ0FBQztPQUNiLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDVjs7O1NBbkNrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudEZpbGVMaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuLyoqXG4gKiBbY2xpZW50XSBSZXRyaWV2ZSBhIGxpc3Qgb2YgZmlsZXMgb24gdGhlIHNlcnZlciBpbiB0aGUgYC9wdWJsaWNgIGZvbGRlciB1cG9uIHJlcXVlc3Qgb2YgdGhlIGNsaWVudC5cbiAqXG4gKiBUaGUgbW9kdWxlIGNhbiBmaWx0ZXIgdGhlIGZpbGUgbGlzdCBieSBleHRlbnNpb25zLiBJdCBuZXZlciBoYXMgYSB2aWV3LlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gaXQgcmVjZWl2ZXMgdGhlIGZpbGUgbGlzdCBmcm9tIHRoZSBzZXJ2ZXIuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlckZpbGVMaXN0LmpzflNlcnZlckZpbGVMaXN0fSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlIC8vIFJldHJpZXZlIHRoZSBtcDMgZmlsZSBsaXN0IGluIHRoZSBmb2xkZXIgYC9yZWNvcmRpbmdzYFxuICogY29uc3QgZmlsZWxpc3QgPSBuZXcgQ2xpZW50RmlsZUxpc3Qoe1xuICogICBmb2xkZXI6ICcvcmVjb3JkaW5ncycsXG4gKiAgIGV4dGVuc2lvbnM6IFsnLm1wMyddXG4gKiB9KTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50RmlsZUxpc3QgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubmFtZT0nZmlsZWxpc3QnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5mb2xkZXI9JyddIFN1YmZvbGRlciBvZiBgL3B1YmxpY2AgaW4gd2hpY2ggdG8gcmV0cmlldmUgdGhlIGZpbGUgbGlzdC5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW29wdGlvbnMuZXh0ZW50aW9ucz11bmRlZmluZWRdIEV4dGVuc2lvbnMgb2YgdGhlIGZpbGVzIHRvIHJldHJpZXZlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdmaWxlbGlzdCcsIGZhbHNlKTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIGZpbGUgcGF0aHMgc2VudCBieSB0aGUgc2VydmVyLlxuICAgICAqIEB0eXBlIHtTdHJpbmdbXX1cbiAgICAgKi9cbiAgICB0aGlzLmZpbGVzID0gbnVsbDtcblxuICAgIHRoaXMuX2ZvbGRlciA9IG9wdGlvbnMuZm9sZGVyIHx8ICcnO1xuICAgIHRoaXMuX2V4dGVuc2lvbnMgPSBvcHRpb25zLmV4dGVuc2lvbnMgfHwgdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBTZW5kcyBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciBhbmQgbGlzdGVucyBmb3IgdGhlIGFuc3dlci5cbiAgICogQGVtaXRzIHt0aGlzLm5hbWUgKyAnOmZpbGVzJ30gVGhlIGZpbGUgcGF0aCBsaXN0IHdoZW4gaXQgaXMgcmVjZWl2ZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcsIHRoaXMuX2ZvbGRlciwgdGhpcy5fZXh0ZW5zaW9ucyk7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ2ZpbGVzJywgKGZpbGVzKSA9PiB7XG4gICAgICB0aGlzLmZpbGVzID0gZmlsZXM7XG4gICAgICB0aGlzLmVtaXQoYCR7dGhpcy5uYW1lfTpmaWxlc2AsIGZpbGVzKTtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH0sIHRoaXMpO1xuICB9XG59XG4iXX0=