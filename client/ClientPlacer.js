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
    key: 'display',
    value: function display(container) {
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
    value: function _display(positions, surface) {
      var _this = this;

      // listen for selection
      this.selector.on('select', function (position) {
        // optionally store in local storage
        if (_this.persist) _this._setLocalStorage(position);

        // send to server
        _this._sendPosition(position);
        _this.done();
      });

      this.selector.display(this.view, surface);
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

      this.receive('setup', function (capacity, labels, coordinates, surface) {
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

        _this2._display(positions, surface);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50UGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQTZCLFFBQVE7O3NCQUNsQixVQUFVOzs7OzZCQUNKLGdCQUFnQjs7OztxQkFDdkIsU0FBUzs7Ozs7Ozs7O0lBTWQsWUFBWTtZQUFaLFlBQVk7O0FBQ1osV0FEQSxZQUFZLENBQ1gsT0FBTyxFQUFFOzBCQURWLFlBQVk7O0FBRXJCLCtCQUZTLFlBQVksNkNBRWI7QUFDUixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNqQixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUN0QixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzVDOzs7Ozs7Ozs7OztlQU5VLFlBQVk7O1dBUWQsbUJBQUMsQ0FBQyxFQUFFO0FBQ1gsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDcEMsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7QUFDaEQsVUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekQsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDNUI7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2xCLFlBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDcEUsWUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLE1BQU0sQ0FBQzs7QUFFdEUsWUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIs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QyxDQUFDO0FBQ2xFLFVBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDNUM7OztTQXRMa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBTcGFjZSBmcm9tICcuL1NwYWNlJztcblxuLyoqXG4gKiBEaXNwbGF5IHN0cmF0ZWdpZXMgZm9yIHBsYWNlclxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIExpc3RTZWxlY3RvciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubGFiZWxzID0gW107XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IFtdO1xuICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbiAgfVxuXG4gIF9vblNlbGVjdChlKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuc2VsZWN0Lm9wdGlvbnM7XG4gICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IHRoaXMuc2VsZWN0LnNlbGVjdGVkSW5kZXg7XG4gICAgY29uc3QgaW5kZXggPSBwYXJzZUludChvcHRpb25zW3NlbGVjdGVkSW5kZXhdLnZhbHVlLCAxMCk7XG4gICAgdGhpcy5lbWl0KCdzZWxlY3QnLCBpbmRleCk7XG4gIH1cblxuICByZXNpemUoKSB7XG4gICAgaWYgKHRoaXMuY29udGFpbmVyKSB7XG4gICAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IHRoaXMuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgY29uc3QgY29udGFpbmVySGVpZ2h0ID0gdGhpcy5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuXG4gICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICAgIGNvbnN0IHdpZHRoID0gY29udGFpbmVyV2lkdGggKiAyIC8gMztcbiAgICAgIGNvbnN0IGxlZnQgPSBjb250YWluZXJXaWR0aCAvIDMgLyAyO1xuICAgICAgY29uc3QgdG9wID0gKGNvbnRhaW5lckhlaWdodCAtIGhlaWdodCkgLyAyO1xuXG4gICAgICB0aGlzLmVsLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgIHRoaXMuZWwuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gICAgICB0aGlzLmVsLnN0eWxlLnRvcCA9IHRvcCArICdweCc7XG4gICAgICB0aGlzLmVsLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcblxuICAgICAgdGhpcy5zZWxlY3Quc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gICAgICB0aGlzLmJ1dHRvbi5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICB9XG4gIH1cblxuICBkaXNwbGF5KGNvbnRhaW5lcikge1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIHRoaXMuc2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgdGhpcy5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICB0aGlzLmJ1dHRvbi50ZXh0Q29udGVudCA9ICdPSyc7XG4gICAgdGhpcy5idXR0b24uY2xhc3NMaXN0LmFkZCgnYnRuJyk7XG5cbiAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHRoaXMuc2VsZWN0KTtcbiAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcblxuICAgIHRoaXMuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vblNlbGVjdCwgZmFsc2UpO1xuICAgIHRoaXMucmVzaXplKCk7XG4gIH1cblxuICBkaXNwbGF5UG9zaXRpb25zKGxhYmVscywgY29vcmRpbmF0ZXMsIGNhcGFjaXR5KSB7XG4gICAgdGhpcy5sYWJlbHMgPSBsYWJlbHM7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHBvc2l0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSBwb3NpdGlvbnNbaV07XG4gICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcblxuICAgICAgb3B0aW9uLnZhbHVlID0gaTtcbiAgICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IHBvc2l0aW9uLmxhYmVsIHx8IChpICsgMSkudG9TdHJpbmcoKTtcblxuICAgICAgdGhpcy5zZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBbY2xpZW50XSBBbGxvdyB0byBzZWxlY3QgYSBwbGFjZSB3aXRoaW4gYSBzZXQgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGkuZS4gbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlclBsYWNlci5qc35TZXJ2ZXJQbGFjZXJ9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHBsYWNlciA9IG5ldyBDbGllbnRQbGFjZXIoeyBjYXBhY2l0eTogMTAwIH0pO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRQbGFjZXIgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0ncGVyZm9ybWFuY2UnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5tb2RlPSdsaXN0J10gU2VsZWN0aW9uIG1vZGUuIENhbiBiZTpcbiAgICogLSBgJ2xpc3QnYCB0byBzZWxlY3QgYSBwbGFjZSBhbW9uZyBhIGxpc3Qgb2YgcGxhY2VzLlxuICAgKiAtIGAnZ3JhcGhpY2AnIHRvIHNlbGVjdCBhIHBsYWNlIG9uIGEgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhdmFpbGFibGUgcG9zaXRpb25zLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnBlcnNpc3Q9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzZWxlY3RlZCBwbGFjZSBzaG91bGQgYmUgc3RvcmVkIGluIHRoZSBgTG9jYWxTdG9yYWdlYCBmb3IgZnV0dXJlIHJldHJpZXZhbCBvciBub3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbbG9jYWxTdG9yYWdlSWQ9J3NvdW5kd29ya3MnXSBQcmVmaXggb2YgdGhlIGBMb2NhbFN0b3JhZ2VgIElELlxuICAgKiBAdG9kbyB0aGlzLnNlbGVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHzCoCdwbGFjZXInLCB0cnVlLCBvcHRpb25zLmNvbG9yIHx8ICdibGFjaycpO1xuXG4gICAgLyoqXG4gICAgICogSW5kZXggb2YgdGhlIHBvc2l0aW9uIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5pbmRleCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuICAgIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fMKgJ2xpc3QnO1xuICAgIHRoaXMucGVyc2lzdCA9IG9wdGlvbnMucGVyc2lzdCB8fMKgZmFsc2U7XG4gICAgdGhpcy5sb2NhbFN0b3JhZ2VJZCA9IG9wdGlvbnMubG9jYWxTdG9yYWdlSWQgfHzCoCdzb3VuZHdvcmtzJztcblxuICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICBjYXNlICdncmFwaGljJzpcbiAgICAgICAgdGhpcy5zZWxlY3RvciA9IG5ldyBTcGFjZSh7XG4gICAgICAgICAgZml0Q29udGFpbmVyOiB0cnVlLFxuICAgICAgICAgIGxpc3RlblRvdWNoRXZlbnQ6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICB0aGlzLnNlbGVjdG9yID0gbmV3IExpc3RTZWxlY3Rvcih7fSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMuX3Jlc2l6ZVNlbGVjdG9yID0gdGhpcy5fcmVzaXplU2VsZWN0b3IuYmluZCh0aGlzKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplU2VsZWN0b3IsIGZhbHNlKTtcbiAgfVxuXG4gIF9yZXNpemVTZWxlY3RvcigpIHtcbiAgICB0aGlzLnNlbGVjdG9yLnJlc2l6ZSgpO1xuICB9XG5cbiAgX2dldFN0b3JhZ2VLZXkoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMubG9jYWxTdG9yYWdlSWR9OiR7dGhpcy5uYW1lfWA7XG4gIH1cblxuICBfc2V0TG9jYWxTdG9yYWdlKHBvc2l0aW9uKSB7XG4gICAgLy8gaWYgb3B0aW9ucy5leHBpcmUgYWRkIHRoIHRpbWVzdGFtcCB0byB0aGUgcG9zaXRpb24gb2JqZWN0XG4gICAgY29uc3Qga2V5ID0gdGhpcy5fZ2V0U3RvcmFnZUtleSgpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHBvc2l0aW9uKSk7XG4gIH1cblxuICBfZ2V0TG9jYWxTdG9yYWdlKCkge1xuICAgIGNvbnN0IGtleSA9IHRoaXMuX2dldFN0b3JhZ2VLZXkoKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuXG4gICAgLy8gY2hlY2sgZm9yIGV4cGlyZXMgZW50cnlcbiAgICAvLyBkZWxldGUgaWYgbm93ID4gZXhwaXJlc1xuICAgIHJldHVybiBKU09OLnBhcnNlKHBvc2l0aW9uKTtcbiAgfVxuXG4gIF9kZWxldGVMb2NhbFN0b3JhZ2UoKSB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5fZ2V0U3RvcmFnZUtleSgpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgIC8vIHdpbmRvdy5sb2NhbFN0b3JhZ2UuY2xlYXIoKTsgLy8gcmVtb3ZlIGV2ZXJ5dGhpbmcgZm9yIHRoZSBkb21haW5cbiAgfVxuXG4gIF9zZW5kUG9zaXRpb24ocG9zaXRpb24gPSBudWxsKSB7XG4gICAgaWYgKHBvc2l0aW9uICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmluZGV4ID0gcG9zaXRpb24uaW5kZXg7XG4gICAgICB0aGlzLmxhYmVsID0gcG9zaXRpb24ubGFiZWw7XG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBwb3NpdGlvbi5jb29yZGluYXRlcztcbiAgICB9XG5cbiAgICB0aGlzLnNlbmQoJ3Bvc2l0aW9uJywgdGhpcy5pbmRleCwgdGhpcy5sYWJlbCwgY2xpZW50LmNvb3JkaW5hdGVzKTtcbiAgfVxuXG4gIF9kaXNwbGF5KHBvc2l0aW9ucywgc3VyZmFjZSkge1xuICAgIC8vIGxpc3RlbiBmb3Igc2VsZWN0aW9uXG4gICAgdGhpcy5zZWxlY3Rvci5vbignc2VsZWN0JywgKHBvc2l0aW9uKSA9PiB7XG4gICAgICAvLyBvcHRpb25hbGx5IHN0b3JlIGluIGxvY2FsIHN0b3JhZ2VcbiAgICAgIGlmICh0aGlzLnBlcnNpc3QpXG4gICAgICAgIHRoaXMuX3NldExvY2FsU3RvcmFnZShwb3NpdGlvbik7XG5cbiAgICAgIC8vIHNlbmQgdG8gc2VydmVyXG4gICAgICB0aGlzLl9zZW5kUG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnNlbGVjdG9yLmRpc3BsYXkodGhpcy52aWV3LCBzdXJmYWNlKTtcbiAgICB0aGlzLnNlbGVjdG9yLmRpc3BsYXlQb3NpdGlvbnMocG9zaXRpb25zLCAyMCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICAvLyBjaGVjayBmb3IgaW5mb3JtYXRpb25zIGluIGxvY2FsIHN0b3JhZ2VcbiAgICBpZiAodGhpcy5wZXJzaXN0KSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuX2dldExvY2FsU3RvcmFnZSgpO1xuXG4gICAgICBpZiAocG9zaXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fc2VuZFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9uZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlcXVlc3QgcG9zaXRpb25zIG9yIGxhYmVsc1xuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcsIHRoaXMubW9kZSk7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ3NldHVwJywgKGNhcGFjaXR5LCBsYWJlbHMsIGNvb3JkaW5hdGVzLCBzdXJmYWNlKSA9PiB7XG4gICAgICBsZXQgbnVtTGFiZWxzID0gbGFiZWxzPyBsYWJlbHMubGVuZ3RoOiBJbmZpbml0eTtcbiAgICAgIGxldCBudW1Db29yZGluYXRlcyA9IGNvb3JkaW5hdGVzPyBjb29yZGluYXRlcy5sZW5ndGg6IEluZmluaXR5O1xuICAgICAgbGV0IG51bVBvc2l0aW9ucyA9IE1hdGgubWluKG51bUxhYmVscywgbnVtQ29vcmRpbmF0ZXMpO1xuXG4gICAgICBpZihudW1Qb3NpdGlvbnMgPiBjYXBhY2l0eSlcbiAgICAgICAgbnVtUG9zaXRpb25zID0gY2FwYWNpdHk7XG5cbiAgICAgIGxldCBwb3NpdGlvbnMgPSBbXTtcblxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG51bVBvc2l0aW9uczsgaSsrKSB7XG4gICAgICAgIGxldCBsYWJlbCA9IGxhYmVsc1tpXSB8fCAoaSArIDEpLnRvU3RyaW5nKCk7XG4gICAgICAgIGxldCBjb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzW2ldO1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB7XG4gICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBjb29yZGluYXRlcyxcbiAgICAgICAgfTtcbiAgICAgICAgcG9zaXRpb25zLnB1c2gocG9zaXRpb24pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9kaXNwbGF5KHBvc2l0aW9ucywgc3VyZmFjZSk7XG4gICAgfSk7XG5cbiAgICAvLyBhbGxvdyB0byByZXNldCBsb2NhbFN0b3JhZ2VcbiAgICB0aGlzLnJlY2VpdmUoJ3Jlc2V0JywgdGhpcy5fZGVsZXRlTG9jYWxTdG9yYWdlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICB0aGlzLl9zZW5kUG9zaXRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgbW9kdWxlIHRvIGluaXRpYWwgc3RhdGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuICAgIC8vIHJlc2V0IGNsaWVudFxuICAgIHRoaXMuaW5kZXggPSBudWxsO1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IG51bGw7XG5cbiAgICAvLyByZW1vdmUgbGlzdGVuZXJcbiAgICB0aGlzLnNlbGVjdG9yLnJlbW92ZUFsbExpc3RlbmVycygnc2VsZWN0Jyk7XG4gIH1cblxuICAvKipcbiAgICogRG9uZSBtZXRob2QuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkb25lKCkge1xuICAgIHN1cGVyLmRvbmUoKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplU2VsZWN0b3IsIGZhbHNlKTtcbiAgICB0aGlzLnNlbGVjdG9yLnJlbW92ZUFsbExpc3RlbmVycygnc2VsZWN0Jyk7XG4gIH1cbn1cbiJdfQ==