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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50RmlsZUxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OzZCQUF5QixnQkFBZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0JwQixjQUFjO1lBQWQsY0FBYzs7Ozs7Ozs7O0FBT3RCLFdBUFEsY0FBYyxHQU9QO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFQTCxjQUFjOztBQVEvQiwrQkFSaUIsY0FBYyw2Q0FRekIsT0FBTyxDQUFDLElBQUksSUFBSSxVQUFVLEVBQUUsS0FBSyxFQUFFOztBQUV6QyxRQUFJLENBQUMsT0FBTyxHQUFHLGVBQWM7QUFDM0IsWUFBTSxFQUFFLEVBQUU7QUFDVixnQkFBVSxFQUFFLFNBQVM7S0FDdEIsRUFBRSxPQUFPLENBQUMsQ0FBQTs7Ozs7O0FBTVgsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDeEQ7Ozs7ZUF0QmtCLGNBQWM7O1dBeUI1QixpQkFBRztBQUNOLGlDQTFCaUIsY0FBYyx1Q0EwQmpCOztBQUVkLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkUsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQzdDOzs7OztXQUdHLGdCQUFHO0FBQ0wsaUNBbENpQixjQUFjLHNDQWtDbEI7QUFDYixVQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDcEQ7OztXQUVjLHlCQUFDLEtBQUssRUFBRTtBQUNyQixVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7QUFFbkIsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztTQTFDa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRGaWxlTGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gUmV0cmlldmUgYSBsaXN0IG9mIGZpbGVzIG9uIHRoZSBzZXJ2ZXIgaW4gdGhlIGAvcHVibGljYCBmb2xkZXIgdXBvbiByZXF1ZXN0IG9mIHRoZSBjbGllbnQuXG4gKlxuICogVGhlIG1vZHVsZSBjYW4gZmlsdGVyIHRoZSBmaWxlIGxpc3QgYnkgZXh0ZW5zaW9ucy4gSXQgbmV2ZXIgaGFzIGEgdmlldy5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIGl0IHJlY2VpdmVzIHRoZSBmaWxlIGxpc3QgZnJvbSB0aGUgc2VydmVyLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJGaWxlTGlzdC5qc35TZXJ2ZXJGaWxlTGlzdH0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSAvLyBSZXRyaWV2ZSB0aGUgbXAzIGZpbGUgbGlzdCBpbiB0aGUgZm9sZGVyIGAvcmVjb3JkaW5nc2BcbiAqIGNvbnN0IGZpbGVsaXN0ID0gbmV3IENsaWVudEZpbGVMaXN0KHtcbiAqICAgZm9sZGVyOiAnL3JlY29yZGluZ3MnLFxuICogICBleHRlbnNpb25zOiBbJy5tcDMnXVxuICogfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudEZpbGVMaXN0IGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm5hbWU9J2ZpbGVsaXN0J10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZm9sZGVyPScnXSBTdWJmb2xkZXIgb2YgYC9wdWJsaWNgIGluIHdoaWNoIHRvIHJldHJpZXZlIHRoZSBmaWxlIGxpc3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtvcHRpb25zLmV4dGVudGlvbnM9dW5kZWZpbmVkXSBFeHRlbnNpb25zIG9mIHRoZSBmaWxlcyB0byByZXRyaWV2ZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnZmlsZWxpc3QnLCBmYWxzZSk7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGZvbGRlcjogJycsXG4gICAgICBleHRlbnNpb25zOiB1bmRlZmluZWQsXG4gICAgfSwgb3B0aW9ucylcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIGZpbGUgcGF0aHMgc2VudCBieSB0aGUgc2VydmVyLlxuICAgICAqIEB0eXBlIHtTdHJpbmdbXX1cbiAgICAgKi9cbiAgICB0aGlzLmZpbGVzID0gbnVsbDsgLy8gQHRvZG8gLSBtYWtlIHN1cmUgdGhpcyBkb2Vzbid0IG5lZWQgdG8gYmUgcmVpbml0LlxuXG4gICAgdGhpcy5fb25GaWxlUmVzcG9uc2UgPSB0aGlzLl9vbkZpbGVSZXNwb25zZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnLCB0aGlzLm9wdGlvbnMuZm9sZGVyLCB0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucyk7XG4gICAgdGhpcy5yZWNlaXZlKCdmaWxlcycsIHRoaXMuX29uRmlsZVJlc3BvbnNlKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdmaWxlcycsIHRoaXMuX29uRmlsZVJlc3BvbnNlKTtcbiAgfVxuXG4gIF9vbkZpbGVSZXNwb25zZShmaWxlcykge1xuICAgIHRoaXMuZmlsZXMgPSBmaWxlcztcbiAgICAvLyB0aGlzLmVtaXQoJ2ZpbGVzJywgZmlsZXMpOyAvLyBAdG9kbyAtIHJlbW92ZSA/XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cbn1cbiJdfQ==