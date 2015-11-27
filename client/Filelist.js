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
 * [client] Retrieve a list of files on the server in the `/public` folder.
 *
 * The module can filter the file list by extensions. It never has a view.
 *
 * The module finishes its initialization when it receives the file list from the server.
 *
 * @example // Retrieve the mp3 file list in the folder `/recordings`
 * const filelist = new Filelist({
 *   folder: '/recordings',
 *   extensions: ['.mp3']
 * });
 */

var Filelist = (function (_Module) {
  _inherits(Filelist, _Module);

  /**
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='filelist'] Name of the module.
   * @param {String} [options.folder=''] Subfolder of `/public` in which to retrieve the file list.
   * @param {String[]} [options.extentions=undefined] Extensions of the files to retrieve.
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

      _client2['default'].send(this.name + ':request', this._folder, this._extensions);

      _client2['default'].receive(this.name + ':files', function (files) {
        _this.files = files;
        _this.emit(_this.name + ':files', files);
        _this.done();
      }, this);
    }
  }]);

  return Filelist;
})(_Module3['default']);

exports['default'] = Filelist;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvRmlsZWxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFlUixRQUFRO1lBQVIsUUFBUTs7Ozs7Ozs7O0FBT2hCLFdBUFEsUUFBUSxHQU9EO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFQTCxRQUFROztBQVF6QiwrQkFSaUIsUUFBUSw2Q0FRbkIsT0FBTyxDQUFDLElBQUksSUFBSSxVQUFVLEVBQUUsS0FBSyxFQUFFOzs7Ozs7QUFNekMsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDcEMsUUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLFNBQVMsQ0FBQztHQUNwRDs7Ozs7Ozs7ZUFsQmtCLFFBQVE7O1dBeUJ0QixpQkFBRzs7O0FBQ04saUNBMUJpQixRQUFRLHVDQTBCWDs7QUFFZCwwQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXBFLDBCQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsRUFBRSxVQUFDLEtBQUssRUFBSztBQUM5QyxjQUFLLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsY0FBSyxJQUFJLENBQUMsTUFBSyxJQUFJLEdBQUcsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3ZDLGNBQUssSUFBSSxFQUFFLENBQUM7T0FDYixFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ1Y7OztTQW5Da0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoic3JjL2NsaWVudC9GaWxlbGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cbi8qKlxuICogW2NsaWVudF0gUmV0cmlldmUgYSBsaXN0IG9mIGZpbGVzIG9uIHRoZSBzZXJ2ZXIgaW4gdGhlIGAvcHVibGljYCBmb2xkZXIuXG4gKlxuICogVGhlIG1vZHVsZSBjYW4gZmlsdGVyIHRoZSBmaWxlIGxpc3QgYnkgZXh0ZW5zaW9ucy4gSXQgbmV2ZXIgaGFzIGEgdmlldy5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIGl0IHJlY2VpdmVzIHRoZSBmaWxlIGxpc3QgZnJvbSB0aGUgc2VydmVyLlxuICpcbiAqIEBleGFtcGxlIC8vIFJldHJpZXZlIHRoZSBtcDMgZmlsZSBsaXN0IGluIHRoZSBmb2xkZXIgYC9yZWNvcmRpbmdzYFxuICogY29uc3QgZmlsZWxpc3QgPSBuZXcgRmlsZWxpc3Qoe1xuICogICBmb2xkZXI6ICcvcmVjb3JkaW5ncycsXG4gKiAgIGV4dGVuc2lvbnM6IFsnLm1wMyddXG4gKiB9KTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsZWxpc3QgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubmFtZT0nZmlsZWxpc3QnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5mb2xkZXI9JyddIFN1YmZvbGRlciBvZiBgL3B1YmxpY2AgaW4gd2hpY2ggdG8gcmV0cmlldmUgdGhlIGZpbGUgbGlzdC5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW29wdGlvbnMuZXh0ZW50aW9ucz11bmRlZmluZWRdIEV4dGVuc2lvbnMgb2YgdGhlIGZpbGVzIHRvIHJldHJpZXZlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdmaWxlbGlzdCcsIGZhbHNlKTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIGZpbGUgcGF0aHMgc2VudCBieSB0aGUgc2VydmVyLlxuICAgICAqIEB0eXBlIHtTdHJpbmdbXX1cbiAgICAgKi9cbiAgICB0aGlzLmZpbGVzID0gbnVsbDtcblxuICAgIHRoaXMuX2ZvbGRlciA9IG9wdGlvbnMuZm9sZGVyIHx8ICcnO1xuICAgIHRoaXMuX2V4dGVuc2lvbnMgPSBvcHRpb25zLmV4dGVuc2lvbnMgfHwgdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBTZW5kcyBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciBhbmQgbGlzdGVucyBmb3IgdGhlIGFuc3dlci5cbiAgICogQGVtaXRzIHt0aGlzLm5hbWUgKyAnOmZpbGVzJ30gVGhlIGZpbGUgcGF0aCBsaXN0IHdoZW4gaXQgaXMgcmVjZWl2ZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGNsaWVudC5zZW5kKHRoaXMubmFtZSArICc6cmVxdWVzdCcsIHRoaXMuX2ZvbGRlciwgdGhpcy5fZXh0ZW5zaW9ucyk7XG5cbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOmZpbGVzJywgKGZpbGVzKSA9PiB7XG4gICAgICB0aGlzLmZpbGVzID0gZmlsZXM7XG4gICAgICB0aGlzLmVtaXQodGhpcy5uYW1lICsgJzpmaWxlcycsIGZpbGVzKTtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH0sIHRoaXMpO1xuICB9XG59XG4iXX0=