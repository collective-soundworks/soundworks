'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

var _Space = require('./Space');

var _Space2 = _interopRequireDefault(_Space);

/**
 * Display strategies for placer
 * @private
 */

var ListSelector = (function (_EventEmitter) {
  _inherits(ListSelector, _EventEmitter);

  function ListSelector(options) {
    _classCallCheck(this, ListSelector);

    _get(Object.getPrototypeOf(ListSelector.prototype), 'constructor', this).call(this);
    this.labels = [];
    this.coordinates = [];
    this._onSelect = this._onSelect.bind(this);
  }

  /**
   * [client] Allow to select a place within a set of predefined positions (i.e. labels and/or coordinates).
   *
   * (See also {@link src/server/ServerPlacer.js~ServerPlacer} on the server side.)
   *
   * @example
   * const placer = new ClientPlacer({ capacity: 100 });
   */

  _createClass(ListSelector, [{
    key: '_onSelect',
    value: function _onSelect(e) {
      var options = this.select.options;
      var selectedIndex = this.select.selectedIndex;
      var index = parseInt(options[selectedIndex].value, 10);
      this.emit('select', index);
    }
  }, {
    key: 'display',
    value: function display(container) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      this.container = container;
      this.el = document.createElement('div');

      this.select = document.createElement('select');
      this.button = document.createElement('button');
      this.button.textContent = 'OK';
      this.button.classList.add('btn');

      this.el.appendChild(this.select);
      this.el.appendChild(this.button);
      this.container.appendChild(this.el);

      this.button.addEventListener('touchstart', this._onSelect, false);
      this.resize();
    }
  }, {
    key: 'resize',
    value: function resize() {
      if (this.container) {
        var containerWidth = this.container.getBoundingClientRect().width;
        var containerHeight = this.container.getBoundingClientRect().height;

        var height = this.el.getBoundingClientRect().height;
        var width = containerWidth * 2 / 3;
        var left = containerWidth / 3 / 2;
        var _top = (containerHeight - height) / 2;

        this.el.style.position = 'absolute';
        this.el.style.width = width + 'px';
        this.el.style.top = _top + 'px';
        this.el.style.left = left + 'px';

        this.select.style.width = width + 'px';
        this.button.style.width = width + 'px';
      }
    }
  }, {
    key: 'displayPositions',
    value: function displayPositions(labels, coordinates, capacity) {
      this.labels = labels;
      this.coordinates = coordinates;

      for (var i = 0; i < positions.length; i++) {
        var position = positions[i];
        var option = document.createElement('option');

        option.value = i;
        option.textContent = position.label || (i + 1).toString();

        this.select.appendChild(option);
      }
    }
  }]);

  return ListSelector;
})(_events.EventEmitter);

exports.ListSelector = ListSelector;

var ClientPlacer = (function (_ClientModule) {
  _inherits(ClientPlacer, _ClientModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='performance'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String} [options.mode='list'] Selection mode. Can be:
   * - `'list'` to select a place among a list of places.
   * - `'graphic`' to select a place on a graphical representation of the available positions.
   * @param {Boolean} [options.persist=false] Indicates whether the selected place should be stored in the `LocalStorage` for future retrieval or not.
   * @param {String} [localStorageId='soundworks'] Prefix of the `LocalStorage` ID.
   * @todo this.selector
   */

  function ClientPlacer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientPlacer);

    _get(Object.getPrototypeOf(ClientPlacer.prototype), 'constructor', this).call(this, options.name || 'placer', true, options.color || 'black');

    /**
     * Index of the position selected by the user.
     * @type {Number}
     */
    this.index = null;

    /**
     * Label of the position selected by the user.
     * @type {String}
     */
    this.label = null;

    this.mode = options.mode || 'list';
    this.persist = options.persist || false;
    this.localStorageId = options.localStorageId || 'soundworks';

    switch (this.mode) {
      case 'graphic':
        this.selector = new _Space2['default']({
          fitContainer: true,
          listenTouchEvent: true
        });
        break;
      case 'list':
        this.selector = new ListSelector({});
        break;
    }

    this._resizeSelector = this._resizeSelector.bind(this);
    window.addEventListener('resize', this._resizeSelector, false);
  }

  _createClass(ClientPlacer, [{
    key: '_resizeSelector',
    value: function _resizeSelector() {
      this.selector.resize();
    }
  }, {
    key: '_getStorageKey',
    value: function _getStorageKey() {
      return this.localStorageId + ':' + this.name;
    }
  }, {
    key: '_setLocalStorage',
    value: function _setLocalStorage(position) {
      // if options.expire add th timestamp to the position object
      var key = this._getStorageKey();
      window.localStorage.setItem(key, JSON.stringify(position));
    }
  }, {
    key: '_getLocalStorage',
    value: function _getLocalStorage() {
      var key = this._getStorageKey();
      var position = window.localStorage.getItem(key);

      // check for expires entry
      // delete if now > expires
      return JSON.parse(position);
    }
  }, {
    key: '_deleteLocalStorage',
    value: function _deleteLocalStorage() {
      var key = this._getStorageKey();
      window.localStorage.removeItem(key);
      // window.localStorage.clear(); // remove everything for the domain
    }
  }, {
    key: '_sendPosition',
    value: function _sendPosition() {
      var position = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (position !== null) {
        this.index = position.index;
        this.label = position.label;
        _client2['default'].coordinates = position.coordinates;
      }

      this.send('position', this.index, this.label, _client2['default'].coordinates);
    }
  }, {
    key: '_display',
    value: function _display(positions) {
      var _this = this;

      // listen for selection
      this.selector.on('select', function (position) {
        // optionally store in local storage
        if (_this.persist) _this._setLocalStorage(position);

        // send to server
        _this._sendPosition(position);
        _this.done();
      });

      this.selector.display(this.view);
      this.selector.displayPositions(positions, 20);
    }

    /**
     * Start the module.
     * @private
     */
  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      _get(Object.getPrototypeOf(ClientPlacer.prototype), 'start', this).call(this);

      // check for informations in local storage
      if (this.persist) {
        var position = this._getLocalStorage();

        if (position !== null) {
          this._sendPosition(position);
          return this.done();
        }
      }

      // request positions or labels
      this.send('request', this.mode);

      this.receive('acknowledge', function (labels, coordinates) {
        var capacity = arguments.length <= 2 || arguments[2] === undefined ? Infinity : arguments[2];

        var numLabels = labels ? labels.length : Infinity;
        var numCoordinates = coordinates ? coordinates.length : Infinity;
        var numPositions = Math.min(numLabels, numCoordinates);

        if (numPositions > capacity) numPositions = capacity;

        var positions = [];

        for (var i = 0; i < numPositions; i++) {
          var label = labels[i] || (i + 1).toString();
          var _coordinates = _coordinates[i];
          var position = {
            index: i,
            label: label,
            coordinates: _coordinates
          };
          positions.push(position);
        }

        _this2._display(positions);
      });

      // allow to reset localStorage
      this.receive('reset', this._deleteLocalStorage);
    }

    /**
     * Restart the module.
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(ClientPlacer.prototype), 'restart', this).call(this);
      this._sendPosition();
    }

    /**
     * Reset the module to initial state.
     * @private
     */
  }, {
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(ClientPlacer.prototype), 'reset', this).call(this);
      // reset client
      this.index = null;
      this.label = null;
      _client2['default'].coordinates = null;

      // remove listener
      this.selector.removeAllListeners('select');
    }

    /**
     * Done method.
     * @private
     */
  }, {
    key: 'done',
    value: function done() {
      _get(Object.getPrototypeOf(ClientPlacer.prototype), 'done', this).call(this);
      window.removeEventListener('resize', this._resizeSelector, false);
      this.selector.removeAllListeners('select');
    }
  }]);

  return ClientPlacer;
})(_ClientModule3['default']);

exports['default'] = ClientPlacer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50UGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQTZCLFFBQVE7O3NCQUNsQixVQUFVOzs7OzZCQUNKLGdCQUFnQjs7OztxQkFDdkIsU0FBUzs7Ozs7Ozs7O0lBTWQsWUFBWTtZQUFaLFlBQVk7O0FBQ1osV0FEQSxZQUFZLENBQ1gsT0FBTyxFQUFFOzBCQURWLFlBQVk7O0FBRXJCLCtCQUZTLFlBQVksNkNBRWI7QUFDUixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNqQixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUN0QixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzVDOzs7Ozs7Ozs7OztlQU5VLFlBQVk7O1dBUWQsbUJBQUMsQ0FBQyxFQUFFO0FBQ1gsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDcEMsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7QUFDaEQsVUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekQsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDNUI7OztXQUVNLGlCQUFDLFNBQVMsRUFBZ0I7VUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQzdCLFVBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFVBQUksQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFeEMsVUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9DLFVBQUksQ0FBQyxNQUFNLEdB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QUFDO0FBQ2xFLFVBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDNUM7OztTQXRMa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBTcGFjZSBmcm9tICcuL1NwYWNlJztcblxuLyoqXG4gKiBEaXNwbGF5IHN0cmF0ZWdpZXMgZm9yIHBsYWNlclxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIExpc3RTZWxlY3RvciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubGFiZWxzID0gW107XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IFtdO1xuICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbiAgfVxuXG4gIF9vblNlbGVjdChlKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuc2VsZWN0Lm9wdGlvbnM7XG4gICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IHRoaXMuc2VsZWN0LnNlbGVjdGVkSW5kZXg7XG4gICAgY29uc3QgaW5kZXggPSBwYXJzZUludChvcHRpb25zW3NlbGVjdGVkSW5kZXhdLnZhbHVlLCAxMCk7XG4gICAgdGhpcy5lbWl0KCdzZWxlY3QnLCBpbmRleCk7XG4gIH1cblxuICBkaXNwbGF5KGNvbnRhaW5lciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgdGhpcy5zZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICB0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHRoaXMuYnV0dG9uLnRleHRDb250ZW50ID0gJ09LJztcbiAgICB0aGlzLmJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKTtcblxuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5zZWxlY3QpO1xuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5idXR0b24pO1xuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuXG4gICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX29uU2VsZWN0LCBmYWxzZSk7XG4gICAgdGhpcy5yZXNpemUoKTtcbiAgfVxuXG4gIHJlc2l6ZSgpIHtcbiAgICBpZiAodGhpcy5jb250YWluZXIpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gdGhpcy5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSB0aGlzLmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG5cbiAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgY29uc3Qgd2lkdGggPSBjb250YWluZXJXaWR0aCAqIDIgLyAzO1xuICAgICAgY29uc3QgbGVmdCA9IGNvbnRhaW5lcldpZHRoIC8gMyAvIDI7XG4gICAgICBjb25zdCB0b3AgPSAoY29udGFpbmVySGVpZ2h0IC0gaGVpZ2h0KSAvIDI7XG5cbiAgICAgIHRoaXMuZWwuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgdGhpcy5lbC5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICAgIHRoaXMuZWwuc3R5bGUudG9wID0gdG9wICsgJ3B4JztcbiAgICAgIHRoaXMuZWwuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuXG4gICAgICB0aGlzLnNlbGVjdC5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICAgIHRoaXMuYnV0dG9uLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXlQb3NpdGlvbnMobGFiZWxzLCBjb29yZGluYXRlcywgY2FwYWNpdHkpIHtcbiAgICB0aGlzLmxhYmVscyA9IGxhYmVscztcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHBvc2l0aW9uc1tpXTtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuXG4gICAgICBvcHRpb24udmFsdWUgPSBpO1xuICAgICAgb3B0aW9uLnRleHRDb250ZW50ID0gcG9zaXRpb24ubGFiZWwgfHwgKGkgKyAxKS50b1N0cmluZygpO1xuXG4gICAgICB0aGlzLnNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFtjbGllbnRdIEFsbG93IHRvIHNlbGVjdCBhIHBsYWNlIHdpdGhpbiBhIHNldCBvZiBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoaS5lLiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyUGxhY2VyLmpzflNlcnZlclBsYWNlcn0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgcGxhY2VyID0gbmV3IENsaWVudFBsYWNlcih7IGNhcGFjaXR5OiAxMDAgfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudFBsYWNlciBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdwZXJmb3JtYW5jZSddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm1vZGU9J2xpc3QnXSBTZWxlY3Rpb24gbW9kZS4gQ2FuIGJlOlxuICAgKiAtIGAnbGlzdCdgIHRvIHNlbGVjdCBhIHBsYWNlIGFtb25nIGEgbGlzdCBvZiBwbGFjZXMuXG4gICAqIC0gYCdncmFwaGljYCcgdG8gc2VsZWN0IGEgcGxhY2Ugb24gYSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGF2YWlsYWJsZSBwb3NpdGlvbnMuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucGVyc2lzdD1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHNlbGVjdGVkIHBsYWNlIHNob3VsZCBiZSBzdG9yZWQgaW4gdGhlIGBMb2NhbFN0b3JhZ2VgIGZvciBmdXR1cmUgcmV0cmlldmFsIG9yIG5vdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtsb2NhbFN0b3JhZ2VJZD0nc291bmR3b3JrcyddIFByZWZpeCBvZiB0aGUgYExvY2FsU3RvcmFnZWAgSUQuXG4gICAqIEB0b2RvIHRoaXMuc2VsZWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fMKgJ3BsYWNlcicsIHRydWUsIG9wdGlvbnMuY29sb3IgfHwgJ2JsYWNrJyk7XG5cbiAgICAvKipcbiAgICAgKiBJbmRleCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIExhYmVsIG9mIHRoZSBwb3NpdGlvbiBzZWxlY3RlZCBieSB0aGUgdXNlci5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8wqAnbGlzdCc7XG4gICAgdGhpcy5wZXJzaXN0ID0gb3B0aW9ucy5wZXJzaXN0IHx8wqBmYWxzZTtcbiAgICB0aGlzLmxvY2FsU3RvcmFnZUlkID0gb3B0aW9ucy5sb2NhbFN0b3JhZ2VJZCB8fMKgJ3NvdW5kd29ya3MnO1xuXG4gICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgIGNhc2UgJ2dyYXBoaWMnOlxuICAgICAgICB0aGlzLnNlbGVjdG9yID0gbmV3IFNwYWNlKHtcbiAgICAgICAgICBmaXRDb250YWluZXI6IHRydWUsXG4gICAgICAgICAgbGlzdGVuVG91Y2hFdmVudDogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGlzdCc6XG4gICAgICAgIHRoaXMuc2VsZWN0b3IgPSBuZXcgTGlzdFNlbGVjdG9yKHt9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVzaXplU2VsZWN0b3IgPSB0aGlzLl9yZXNpemVTZWxlY3Rvci5iaW5kKHRoaXMpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVTZWxlY3RvciwgZmFsc2UpO1xuICB9XG5cbiAgX3Jlc2l6ZVNlbGVjdG9yKCkge1xuICAgIHRoaXMuc2VsZWN0b3IucmVzaXplKCk7XG4gIH1cblxuICBfZ2V0U3RvcmFnZUtleSgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5sb2NhbFN0b3JhZ2VJZH06JHt0aGlzLm5hbWV9YDtcbiAgfVxuXG4gIF9zZXRMb2NhbFN0b3JhZ2UocG9zaXRpb24pIHtcbiAgICAvLyBpZiBvcHRpb25zLmV4cGlyZSBhZGQgdGggdGltZXN0YW1wIHRvIHRoZSBwb3NpdGlvbiBvYmplY3RcbiAgICBjb25zdCBrZXkgPSB0aGlzLl9nZXRTdG9yYWdlS2V5KCk7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkocG9zaXRpb24pKTtcbiAgfVxuXG4gIF9nZXRMb2NhbFN0b3JhZ2UoKSB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5fZ2V0U3RvcmFnZUtleSgpO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG5cbiAgICAvLyBjaGVjayBmb3IgZXhwaXJlcyBlbnRyeVxuICAgIC8vIGRlbGV0ZSBpZiBub3cgPiBleHBpcmVzXG4gICAgcmV0dXJuIEpTT04ucGFyc2UocG9zaXRpb24pO1xuICB9XG5cbiAgX2RlbGV0ZUxvY2FsU3RvcmFnZSgpIHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLl9nZXRTdG9yYWdlS2V5KCk7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgLy8gd2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpOyAvLyByZW1vdmUgZXZlcnl0aGluZyBmb3IgdGhlIGRvbWFpblxuICB9XG5cbiAgX3NlbmRQb3NpdGlvbihwb3NpdGlvbiA9IG51bGwpIHtcbiAgICBpZiAocG9zaXRpb24gIT09IG51bGwpIHtcbiAgICAgIHRoaXMuaW5kZXggPSBwb3NpdGlvbi5pbmRleDtcbiAgICAgIHRoaXMubGFiZWwgPSBwb3NpdGlvbi5sYWJlbDtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IHBvc2l0aW9uLmNvb3JkaW5hdGVzO1xuICAgIH1cblxuICAgIHRoaXMuc2VuZCgncG9zaXRpb24nLCB0aGlzLmluZGV4LCB0aGlzLmxhYmVsLCBjbGllbnQuY29vcmRpbmF0ZXMpO1xuICB9XG5cbiAgX2Rpc3BsYXkocG9zaXRpb25zKSB7XG4gICAgLy8gbGlzdGVuIGZvciBzZWxlY3Rpb25cbiAgICB0aGlzLnNlbGVjdG9yLm9uKCdzZWxlY3QnLCAocG9zaXRpb24pID0+IHtcbiAgICAgIC8vIG9wdGlvbmFsbHkgc3RvcmUgaW4gbG9jYWwgc3RvcmFnZVxuICAgICAgaWYgKHRoaXMucGVyc2lzdClcbiAgICAgICAgdGhpcy5fc2V0TG9jYWxTdG9yYWdlKHBvc2l0aW9uKTtcblxuICAgICAgLy8gc2VuZCB0byBzZXJ2ZXJcbiAgICAgIHRoaXMuX3NlbmRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc2VsZWN0b3IuZGlzcGxheSh0aGlzLnZpZXcpO1xuICAgIHRoaXMuc2VsZWN0b3IuZGlzcGxheVBvc2l0aW9ucyhwb3NpdGlvbnMsIDIwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIC8vIGNoZWNrIGZvciBpbmZvcm1hdGlvbnMgaW4gbG9jYWwgc3RvcmFnZVxuICAgIGlmICh0aGlzLnBlcnNpc3QpIHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5fZ2V0TG9jYWxTdG9yYWdlKCk7XG5cbiAgICAgIGlmIChwb3NpdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9zZW5kUG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgICByZXR1cm4gdGhpcy5kb25lKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmVxdWVzdCBwb3NpdGlvbnMgb3IgbGFiZWxzXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0JywgdGhpcy5tb2RlKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnYWNrbm93bGVkZ2UnLCAobGFiZWxzLCBjb29yZGluYXRlcywgY2FwYWNpdHkgPSBJbmZpbml0eSkgPT4ge1xuICAgICAgbGV0IG51bUxhYmVscyA9IGxhYmVscz8gbGFiZWxzLmxlbmd0aDogSW5maW5pdHk7XG4gICAgICBsZXQgbnVtQ29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcz8gY29vcmRpbmF0ZXMubGVuZ3RoOiBJbmZpbml0eTtcbiAgICAgIGxldCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcblxuICAgICAgaWYobnVtUG9zaXRpb25zID4gY2FwYWNpdHkpXG4gICAgICAgIG51bVBvc2l0aW9ucyA9IGNhcGFjaXR5O1xuXG4gICAgICBsZXQgcG9zaXRpb25zID0gW107XG5cbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBudW1Qb3NpdGlvbnM7IGkrKykge1xuICAgICAgICBsZXQgbGFiZWwgPSBsYWJlbHNbaV0gfHwgKGkgKyAxKS50b1N0cmluZygpO1xuICAgICAgICBsZXQgY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlc1tpXTtcbiAgICAgICAgbGV0IHBvc2l0aW9uID0ge1xuICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICBjb29yZGluYXRlczogY29vcmRpbmF0ZXMsXG4gICAgICAgIH07XG4gICAgICAgIHBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fZGlzcGxheShwb3NpdGlvbnMpO1xuICAgIH0pO1xuXG4gICAgLy8gYWxsb3cgdG8gcmVzZXQgbG9jYWxTdG9yYWdlXG4gICAgdGhpcy5yZWNlaXZlKCdyZXNldCcsIHRoaXMuX2RlbGV0ZUxvY2FsU3RvcmFnZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydCB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5fc2VuZFBvc2l0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIG1vZHVsZSB0byBpbml0aWFsIHN0YXRlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgICAvLyByZXNldCBjbGllbnRcbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcbiAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBudWxsO1xuXG4gICAgLy8gcmVtb3ZlIGxpc3RlbmVyXG4gICAgdGhpcy5zZWxlY3Rvci5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3NlbGVjdCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIERvbmUgbWV0aG9kLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZG9uZSgpIHtcbiAgICBzdXBlci5kb25lKCk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZVNlbGVjdG9yLCBmYWxzZSk7XG4gICAgdGhpcy5zZWxlY3Rvci5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3NlbGVjdCcpO1xuICB9XG59XG4iXX0=