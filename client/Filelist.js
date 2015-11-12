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
 * The {@link Filelist} module requests the file list of a folder from the server. The results can be filtered by file extensions.
 */

var Filelist = (function (_Module) {
  _inherits(Filelist, _Module);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvRmlsZWxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7Ozs7OztJQUtSLFFBQVE7WUFBUixRQUFROzs7Ozs7Ozs7O0FBUWhCLFdBUlEsUUFBUSxHQVFEO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFSTCxRQUFROztBQVN6QiwrQkFUaUIsUUFBUSw2Q0FTbkIsT0FBTyxDQUFDLElBQUksSUFBSSxVQUFVLEVBQUUsS0FBSyxFQUFFOzs7Ozs7QUFNekMsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDcEMsUUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLFNBQVMsQ0FBQztHQUNwRDs7Ozs7Ozs7ZUFuQmtCLFFBQVE7O1dBMEJ0QixpQkFBRzs7O0FBQ04saUNBM0JpQixRQUFRLHVDQTJCWDs7QUFFZCwwQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXBFLDBCQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsRUFBRSxVQUFDLEtBQUssRUFBSztBQUM5QyxjQUFLLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsY0FBSyxJQUFJLENBQUMsTUFBSyxJQUFJLEdBQUcsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3ZDLGNBQUssSUFBSSxFQUFFLENBQUM7T0FDYixFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ1Y7OztTQXBDa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoic3JjL2NsaWVudC9GaWxlbGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cbi8qKlxuICogVGhlIHtAbGluayBGaWxlbGlzdH0gbW9kdWxlIHJlcXVlc3RzIHRoZSBmaWxlIGxpc3Qgb2YgYSBmb2xkZXIgZnJvbSB0aGUgc2VydmVyLiBUaGUgcmVzdWx0cyBjYW4gYmUgZmlsdGVyZWQgYnkgZmlsZSBleHRlbnNpb25zLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlbGlzdCBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy4gTmV2ZXIgaGFzIGEgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubmFtZT0nZmlsZWxpc3QnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5mb2xkZXI9JyddIEZvbGRlciBpbiB3aGljaCB0byByZXRyaWV2ZSB0aGUgZmlsZSBsaXN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuZXh0ZW50aW9ucz11bmRlZmluZWRdIEV4dGVuc2lvbnMgb2YgdGhlIGZpbGVzIHRvIHJldHJpZXZlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdmaWxlbGlzdCcsIGZhbHNlKTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIGZpbGUgcGF0aHMgc2VudCBieSB0aGUgc2VydmVyLlxuICAgICAqIEB0eXBlIHtTdHJpbmdbXX1cbiAgICAgKi9cbiAgICB0aGlzLmZpbGVzID0gbnVsbDtcblxuICAgIHRoaXMuX2ZvbGRlciA9IG9wdGlvbnMuZm9sZGVyIHx8ICcnO1xuICAgIHRoaXMuX2V4dGVuc2lvbnMgPSBvcHRpb25zLmV4dGVuc2lvbnMgfHwgdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBTZW5kcyBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciBhbmQgbGlzdGVucyBmb3IgdGhlIGFuc3dlci5cbiAgICogQGVtaXRzIHt0aGlzLm5hbWUgKyAnOmZpbGVzJ30gVGhlIGZpbGUgcGF0aCBsaXN0IHdoZW4gaXQgaXMgcmVjZWl2ZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGNsaWVudC5zZW5kKHRoaXMubmFtZSArICc6cmVxdWVzdCcsIHRoaXMuX2ZvbGRlciwgdGhpcy5fZXh0ZW5zaW9ucyk7XG5cbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOmZpbGVzJywgKGZpbGVzKSA9PiB7XG4gICAgICB0aGlzLmZpbGVzID0gZmlsZXM7XG4gICAgICB0aGlzLmVtaXQodGhpcy5uYW1lICsgJzpmaWxlcycsIGZpbGVzKTtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH0sIHRoaXMpO1xuICB9XG59XG5cbiJdfQ==