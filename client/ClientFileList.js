'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

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

    this.options = _Object$assign({
      folder: '',
      extensions: undefined
    }, options);

    /**
     * Array of file paths sent by the server.
     * @type {String[]}
     */
    this.files = null; // @todo - make sure this doesn't need to be reinit.

    this._onFileResponse = this._onFileResponse.bind(this);
  }

  /** @private */

  _createClass(ClientFileList, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientFileList.prototype), 'start', this).call(this);

      this.send('request', this.options.folder, this.options.extensions);
      this.receive('files', this._onFileResponse);
    }

    /** @private */
  }, {
    key: 'stop',
    value: function stop() {
      _get(Object.getPrototypeOf(ClientFileList.prototype), 'stop', this).call(this);
      this.removeListener('files', this._onFileResponse);
    }
  }, {
    key: '_onFileResponse',
    value: function _onFileResponse(files) {
      this.files = files;
      // this.emit('files', files); // @todo - remove ?
      this.done();
    }
  }]);

  return ClientFileList;
})(_ClientModule3['default']);

exports['default'] = ClientFileList;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L0NsaWVudEZpbGVMaXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFBeUIsZ0JBQWdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCcEIsY0FBYztZQUFkLGNBQWM7Ozs7Ozs7OztBQU90QixXQVBRLGNBQWMsR0FPUDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUEwsY0FBYzs7QUFRL0IsK0JBUmlCLGNBQWMsNkNBUXpCLE9BQU8sQ0FBQyxJQUFJLElBQUksVUFBVSxFQUFFLEtBQUssRUFBRTs7QUFFekMsUUFBSSxDQUFDLE9BQU8sR0FBRyxlQUFjO0FBQzNCLFlBQU0sRUFBRSxFQUFFO0FBQ1YsZ0JBQVUsRUFBRSxTQUFTO0tBQ3RCLEVBQUUsT0FBTyxDQUFDLENBQUE7Ozs7OztBQU1YLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVsQixRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3hEOzs7O2VBdEJrQixjQUFjOztXQXlCNUIsaUJBQUc7QUFDTixpQ0ExQmlCLGNBQWMsdUNBMEJqQjs7QUFFZCxVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ25FLFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUM3Qzs7Ozs7V0FHRyxnQkFBRztBQUNMLGlDQWxDaUIsY0FBYyxzQ0FrQ2xCO0FBQ2IsVUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ3BEOzs7V0FFYyx5QkFBQyxLQUFLLEVBQUU7QUFDckIsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7O0FBRW5CLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7U0ExQ2tCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L0NsaWVudEZpbGVMaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5cblxuLyoqXG4gKiBbY2xpZW50XSBSZXRyaWV2ZSBhIGxpc3Qgb2YgZmlsZXMgb24gdGhlIHNlcnZlciBpbiB0aGUgYC9wdWJsaWNgIGZvbGRlciB1cG9uIHJlcXVlc3Qgb2YgdGhlIGNsaWVudC5cbiAqXG4gKiBUaGUgbW9kdWxlIGNhbiBmaWx0ZXIgdGhlIGZpbGUgbGlzdCBieSBleHRlbnNpb25zLiBJdCBuZXZlciBoYXMgYSB2aWV3LlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gaXQgcmVjZWl2ZXMgdGhlIGZpbGUgbGlzdCBmcm9tIHRoZSBzZXJ2ZXIuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlckZpbGVMaXN0LmpzflNlcnZlckZpbGVMaXN0fSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlIC8vIFJldHJpZXZlIHRoZSBtcDMgZmlsZSBsaXN0IGluIHRoZSBmb2xkZXIgYC9yZWNvcmRpbmdzYFxuICogY29uc3QgZmlsZWxpc3QgPSBuZXcgQ2xpZW50RmlsZUxpc3Qoe1xuICogICBmb2xkZXI6ICcvcmVjb3JkaW5ncycsXG4gKiAgIGV4dGVuc2lvbnM6IFsnLm1wMyddXG4gKiB9KTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50RmlsZUxpc3QgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubmFtZT0nZmlsZWxpc3QnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5mb2xkZXI9JyddIFN1YmZvbGRlciBvZiBgL3B1YmxpY2AgaW4gd2hpY2ggdG8gcmV0cmlldmUgdGhlIGZpbGUgbGlzdC5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW29wdGlvbnMuZXh0ZW50aW9ucz11bmRlZmluZWRdIEV4dGVuc2lvbnMgb2YgdGhlIGZpbGVzIHRvIHJldHJpZXZlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdmaWxlbGlzdCcsIGZhbHNlKTtcblxuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZm9sZGVyOiAnJyxcbiAgICAgIGV4dGVuc2lvbnM6IHVuZGVmaW5lZCxcbiAgICB9LCBvcHRpb25zKVxuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgZmlsZSBwYXRocyBzZW50IGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICogQHR5cGUge1N0cmluZ1tdfVxuICAgICAqL1xuICAgIHRoaXMuZmlsZXMgPSBudWxsOyAvLyBAdG9kbyAtIG1ha2Ugc3VyZSB0aGlzIGRvZXNuJ3QgbmVlZCB0byBiZSByZWluaXQuXG5cbiAgICB0aGlzLl9vbkZpbGVSZXNwb25zZSA9IHRoaXMuX29uRmlsZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcsIHRoaXMub3B0aW9ucy5mb2xkZXIsIHRoaXMub3B0aW9ucy5leHRlbnNpb25zKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2ZpbGVzJywgdGhpcy5fb25GaWxlUmVzcG9uc2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2ZpbGVzJywgdGhpcy5fb25GaWxlUmVzcG9uc2UpO1xuICB9XG5cbiAgX29uRmlsZVJlc3BvbnNlKGZpbGVzKSB7XG4gICAgdGhpcy5maWxlcyA9IGZpbGVzO1xuICAgIC8vIHRoaXMuZW1pdCgnZmlsZXMnLCBmaWxlcyk7IC8vIEB0b2RvIC0gcmVtb3ZlID9cbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxufVxuIl19