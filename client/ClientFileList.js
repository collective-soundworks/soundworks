'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var ClientFileList = function (_ClientModule) {
  (0, _inherits3.default)(ClientFileList, _ClientModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='filelist'] Name of the module.
   * @param {String} [options.folder=''] Subfolder of `/public` in which to retrieve the file list.
   * @param {String[]} [options.extentions=undefined] Extensions of the files to retrieve.
   */

  function ClientFileList() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, ClientFileList);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ClientFileList).call(this, options.name || 'filelist', false));

    _this.options = (0, _assign2.default)({
      folder: '',
      extensions: undefined
    }, options);

    /**
     * Array of file paths sent by the server.
     * @type {String[]}
     */
    _this.files = null; // @todo - make sure this doesn't need to be reinit.

    _this._onFileResponse = _this._onFileResponse.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(ClientFileList, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientFileList.prototype), 'start', this).call(this);

      this.send('request', this.options.folder, this.options.extensions);
      this.receive('files', this._onFileResponse);
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientFileList.prototype), 'stop', this).call(this);
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
}(_ClientModule3.default);

exports.default = ClientFileList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudEZpbGVMaXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCcUI7Ozs7Ozs7Ozs7QUFPbkIsV0FQbUIsY0FPbkIsR0FBMEI7UUFBZCxnRUFBVSxrQkFBSTt3Q0FQUCxnQkFPTzs7NkZBUFAsMkJBUVgsUUFBUSxJQUFSLElBQWdCLFVBQWhCLEVBQTRCLFFBRFY7O0FBR3hCLFVBQUssT0FBTCxHQUFlLHNCQUFjO0FBQzNCLGNBQVEsRUFBUjtBQUNBLGtCQUFZLFNBQVo7S0FGYSxFQUdaLE9BSFksQ0FBZjs7Ozs7O0FBSHdCLFNBWXhCLENBQUssS0FBTCxHQUFhLElBQWI7O0FBWndCLFNBY3hCLENBQUssZUFBTCxHQUF1QixNQUFLLGVBQUwsQ0FBcUIsSUFBckIsT0FBdkIsQ0Fkd0I7O0dBQTFCOzs7Ozs2QkFQbUI7OzRCQXlCWDtBQUNOLHVEQTFCaUIsb0RBMEJqQixDQURNOztBQUdOLFdBQUssSUFBTCxDQUFVLFNBQVYsRUFBcUIsS0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixLQUFLLE9BQUwsQ0FBYSxVQUFiLENBQTFDLENBSE07QUFJTixXQUFLLE9BQUwsQ0FBYSxPQUFiLEVBQXNCLEtBQUssZUFBTCxDQUF0QixDQUpNOzs7Ozs7OzJCQVFEO0FBQ0wsdURBbENpQixtREFrQ2pCLENBREs7QUFFTCxXQUFLLGNBQUwsQ0FBb0IsT0FBcEIsRUFBNkIsS0FBSyxlQUFMLENBQTdCLENBRks7Ozs7b0NBS1MsT0FBTztBQUNyQixXQUFLLEtBQUwsR0FBYSxLQUFiOztBQURxQixVQUdyQixDQUFLLElBQUwsR0FIcUI7OztTQXRDSiIsImZpbGUiOiJDbGllbnRGaWxlTGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gUmV0cmlldmUgYSBsaXN0IG9mIGZpbGVzIG9uIHRoZSBzZXJ2ZXIgaW4gdGhlIGAvcHVibGljYCBmb2xkZXIgdXBvbiByZXF1ZXN0IG9mIHRoZSBjbGllbnQuXG4gKlxuICogVGhlIG1vZHVsZSBjYW4gZmlsdGVyIHRoZSBmaWxlIGxpc3QgYnkgZXh0ZW5zaW9ucy4gSXQgbmV2ZXIgaGFzIGEgdmlldy5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIGl0IHJlY2VpdmVzIHRoZSBmaWxlIGxpc3QgZnJvbSB0aGUgc2VydmVyLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJGaWxlTGlzdC5qc35TZXJ2ZXJGaWxlTGlzdH0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSAvLyBSZXRyaWV2ZSB0aGUgbXAzIGZpbGUgbGlzdCBpbiB0aGUgZm9sZGVyIGAvcmVjb3JkaW5nc2BcbiAqIGNvbnN0IGZpbGVsaXN0ID0gbmV3IENsaWVudEZpbGVMaXN0KHtcbiAqICAgZm9sZGVyOiAnL3JlY29yZGluZ3MnLFxuICogICBleHRlbnNpb25zOiBbJy5tcDMnXVxuICogfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudEZpbGVMaXN0IGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm5hbWU9J2ZpbGVsaXN0J10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZm9sZGVyPScnXSBTdWJmb2xkZXIgb2YgYC9wdWJsaWNgIGluIHdoaWNoIHRvIHJldHJpZXZlIHRoZSBmaWxlIGxpc3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtvcHRpb25zLmV4dGVudGlvbnM9dW5kZWZpbmVkXSBFeHRlbnNpb25zIG9mIHRoZSBmaWxlcyB0byByZXRyaWV2ZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnZmlsZWxpc3QnLCBmYWxzZSk7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGZvbGRlcjogJycsXG4gICAgICBleHRlbnNpb25zOiB1bmRlZmluZWQsXG4gICAgfSwgb3B0aW9ucylcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIGZpbGUgcGF0aHMgc2VudCBieSB0aGUgc2VydmVyLlxuICAgICAqIEB0eXBlIHtTdHJpbmdbXX1cbiAgICAgKi9cbiAgICB0aGlzLmZpbGVzID0gbnVsbDsgLy8gQHRvZG8gLSBtYWtlIHN1cmUgdGhpcyBkb2Vzbid0IG5lZWQgdG8gYmUgcmVpbml0LlxuXG4gICAgdGhpcy5fb25GaWxlUmVzcG9uc2UgPSB0aGlzLl9vbkZpbGVSZXNwb25zZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnLCB0aGlzLm9wdGlvbnMuZm9sZGVyLCB0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucyk7XG4gICAgdGhpcy5yZWNlaXZlKCdmaWxlcycsIHRoaXMuX29uRmlsZVJlc3BvbnNlKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdmaWxlcycsIHRoaXMuX29uRmlsZVJlc3BvbnNlKTtcbiAgfVxuXG4gIF9vbkZpbGVSZXNwb25zZShmaWxlcykge1xuICAgIHRoaXMuZmlsZXMgPSBmaWxlcztcbiAgICAvLyB0aGlzLmVtaXQoJ2ZpbGVzJywgZmlsZXMpOyAvLyBAdG9kbyAtIHJlbW92ZSA/XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cbn1cbiJdfQ==