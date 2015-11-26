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
 * The results can be filtered by file extensions.
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
   * Creates an instance of the class. Never has a view.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='filelist'] Name of the module.
   * @param {String} [options.folder=''] Folder in which to retrieve the file list.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvRmlsZWxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFlUixRQUFRO1lBQVIsUUFBUTs7Ozs7Ozs7OztBQVFoQixXQVJRLFFBQVEsR0FRRDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUkwsUUFBUTs7QUFTekIsK0JBVGlCLFFBQVEsNkNBU25CLE9BQU8sQ0FBQyxJQUFJLElBQUksVUFBVSxFQUFFLEtBQUssRUFBRTs7Ozs7O0FBTXpDLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVsQixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxTQUFTLENBQUM7R0FDcEQ7Ozs7Ozs7O2VBbkJrQixRQUFROztXQTBCdEIsaUJBQUc7OztBQUNOLGlDQTNCaUIsUUFBUSx1Q0EyQlg7O0FBRWQsMEJBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUVwRSwwQkFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDOUMsY0FBSyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLGNBQUssSUFBSSxDQUFDLE1BQUssSUFBSSxHQUFHLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN2QyxjQUFLLElBQUksRUFBRSxDQUFDO09BQ2IsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNWOzs7U0FwQ2tCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6InNyYy9jbGllbnQvRmlsZWxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG4vKipcbiAqIFtjbGllbnRdIFJldHJpZXZlIGEgbGlzdCBvZiBmaWxlcyBvbiB0aGUgc2VydmVyLlxuICpcbiAqIFRoZSByZXN1bHRzIGNhbiBiZSBmaWx0ZXJlZCBieSBmaWxlIGV4dGVuc2lvbnMuXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gd2hlbiBpdCByZWNlaXZlcyB0aGUgZmlsZSBsaXN0IGZyb20gdGhlIHNlcnZlci5cbiAqXG4gKiBAZXhhbXBsZSAvLyBSZXRyaWV2ZSB0aGUgbXAzIGZpbGUgbGlzdCBpbiB0aGUgZm9sZGVyIGAvcmVjb3JkaW5nc2BcbiAqIGNvbnN0IGZpbGVsaXN0ID0gbmV3IEZpbGVsaXN0KHtcbiAqICAgZm9sZGVyOiAnL3JlY29yZGluZ3MnLFxuICogICBleHRlbnNpb25zOiBbJy5tcDMnXVxuICogfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbGVsaXN0IGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLiBOZXZlciBoYXMgYSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5uYW1lPSdmaWxlbGlzdCddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmZvbGRlcj0nJ10gRm9sZGVyIGluIHdoaWNoIHRvIHJldHJpZXZlIHRoZSBmaWxlIGxpc3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtvcHRpb25zLmV4dGVudGlvbnM9dW5kZWZpbmVkXSBFeHRlbnNpb25zIG9mIHRoZSBmaWxlcyB0byByZXRyaWV2ZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnZmlsZWxpc3QnLCBmYWxzZSk7XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBmaWxlIHBhdGhzIHNlbnQgYnkgdGhlIHNlcnZlci5cbiAgICAgKiBAdHlwZSB7U3RyaW5nW119XG4gICAgICovXG4gICAgdGhpcy5maWxlcyA9IG51bGw7XG5cbiAgICB0aGlzLl9mb2xkZXIgPSBvcHRpb25zLmZvbGRlciB8fCAnJztcbiAgICB0aGlzLl9leHRlbnNpb25zID0gb3B0aW9ucy5leHRlbnNpb25zIHx8IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIG1vZHVsZS5cbiAgICogU2VuZHMgYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgYW5kIGxpc3RlbnMgZm9yIHRoZSBhbnN3ZXIuXG4gICAqIEBlbWl0cyB7dGhpcy5uYW1lICsgJzpmaWxlcyd9IFRoZSBmaWxlIHBhdGggbGlzdCB3aGVuIGl0IGlzIHJlY2VpdmVkIGZyb20gdGhlIHNlcnZlci5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOnJlcXVlc3QnLCB0aGlzLl9mb2xkZXIsIHRoaXMuX2V4dGVuc2lvbnMpO1xuXG4gICAgY2xpZW50LnJlY2VpdmUodGhpcy5uYW1lICsgJzpmaWxlcycsIChmaWxlcykgPT4ge1xuICAgICAgdGhpcy5maWxlcyA9IGZpbGVzO1xuICAgICAgdGhpcy5lbWl0KHRoaXMubmFtZSArICc6ZmlsZXMnLCBmaWxlcyk7XG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9LCB0aGlzKTtcbiAgfVxufVxuIl19