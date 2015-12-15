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

// import Space from './Space';

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
        this.selector = new Space({
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
    value: function _display(positions, area) {
      var _this = this;

      // listen for selection
      this.selector.on('select', function (position) {
        // optionally store in local storage
        if (_this.persist) _this._setLocalStorage(position);

        // send to server
        _this._sendPosition(position);
        _this.done();
      });

      this.selector.display(this.view, area);
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

      this.receive('setup', function (capacity, labels, coordinates, area) {
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

        _this2._display(positions, area);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUE2QixRQUFROztzQkFDbEIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7Ozs7Ozs7O0lBTzVCLFlBQVk7WUFBWixZQUFZOztBQUNaLFdBREEsWUFBWSxDQUNYLE9BQU8sRUFBRTswQkFEVixZQUFZOztBQUVyQiwrQkFGUyxZQUFZLDZDQUViO0FBQ1IsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDdEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM1Qzs7Ozs7Ozs7Ozs7ZUFOVSxZQUFZOztXQVFkLG1CQUFDLENBQUMsRUFBRTtBQUNYLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQ3BDLFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDO0FBQ2hELFVBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3pELFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzVCOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNsQixZQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFxQixFQUFFLENBQUMsS0FBSyxDQUFDO0FBQ3BFLFlBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxNQUFNLENBQUM7O0FBRXRFLFlBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxN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Q0FBQztBQUNsRSxVQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzVDOzs7U0F0TGtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuLy8gaW1wb3J0IFNwYWNlIGZyb20gJy4vU3BhY2UnO1xuXG4vKipcbiAqIERpc3BsYXkgc3RyYXRlZ2llcyBmb3IgcGxhY2VyXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgTGlzdFNlbGVjdG9yIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5sYWJlbHMgPSBbXTtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gW107XG4gICAgdGhpcy5fb25TZWxlY3QgPSB0aGlzLl9vblNlbGVjdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgX29uU2VsZWN0KGUpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5zZWxlY3Qub3B0aW9ucztcbiAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gdGhpcy5zZWxlY3Quc2VsZWN0ZWRJbmRleDtcbiAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KG9wdGlvbnNbc2VsZWN0ZWRJbmRleF0udmFsdWUsIDEwKTtcbiAgICB0aGlzLmVtaXQoJ3NlbGVjdCcsIGluZGV4KTtcbiAgfVxuXG4gIHJlc2l6ZSgpIHtcbiAgICBpZiAodGhpcy5jb250YWluZXIpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gdGhpcy5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSB0aGlzLmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG5cbiAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgY29uc3Qgd2lkdGggPSBjb250YWluZXJXaWR0aCAqIDIgLyAzO1xuICAgICAgY29uc3QgbGVmdCA9IGNvbnRhaW5lcldpZHRoIC8gMyAvIDI7XG4gICAgICBjb25zdCB0b3AgPSAoY29udGFpbmVySGVpZ2h0IC0gaGVpZ2h0KSAvIDI7XG5cbiAgICAgIHRoaXMuZWwuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgdGhpcy5lbC5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICAgIHRoaXMuZWwuc3R5bGUudG9wID0gdG9wICsgJ3B4JztcbiAgICAgIHRoaXMuZWwuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuXG4gICAgICB0aGlzLnNlbGVjdC5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICAgIHRoaXMuYnV0dG9uLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXkoY29udGFpbmVyKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgdGhpcy5zZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICB0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHRoaXMuYnV0dG9uLnRleHRDb250ZW50ID0gJ09LJztcbiAgICB0aGlzLmJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKTtcblxuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5zZWxlY3QpO1xuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5idXR0b24pO1xuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuXG4gICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX29uU2VsZWN0LCBmYWxzZSk7XG4gICAgdGhpcy5yZXNpemUoKTtcbiAgfVxuXG4gIGRpc3BsYXlQb3NpdGlvbnMobGFiZWxzLCBjb29yZGluYXRlcywgY2FwYWNpdHkpIHtcbiAgICB0aGlzLmxhYmVscyA9IGxhYmVscztcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc2l0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSBwb3NpdGlvbnNbaV07XG4gICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcblxuICAgICAgb3B0aW9uLnZhbHVlID0gaTtcbiAgICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IHBvc2l0aW9uLmxhYmVsIHx8IChpICsgMSkudG9TdHJpbmcoKTtcblxuICAgICAgdGhpcy5zZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBbY2xpZW50XSBBbGxvdyB0byBzZWxlY3QgYSBwbGFjZSB3aXRoaW4gYSBzZXQgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGkuZS4gbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlclBsYWNlci5qc35TZXJ2ZXJQbGFjZXJ9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHBsYWNlciA9IG5ldyBDbGllbnRQbGFjZXIoeyBjYXBhY2l0eTogMTAwIH0pO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRQbGFjZXIgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0ncGVyZm9ybWFuY2UnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5tb2RlPSdsaXN0J10gU2VsZWN0aW9uIG1vZGUuIENhbiBiZTpcbiAgICogLSBgJ2xpc3QnYCB0byBzZWxlY3QgYSBwbGFjZSBhbW9uZyBhIGxpc3Qgb2YgcGxhY2VzLlxuICAgKiAtIGAnZ3JhcGhpY2AnIHRvIHNlbGVjdCBhIHBsYWNlIG9uIGEgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhdmFpbGFibGUgcG9zaXRpb25zLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnBlcnNpc3Q9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzZWxlY3RlZCBwbGFjZSBzaG91bGQgYmUgc3RvcmVkIGluIHRoZSBgTG9jYWxTdG9yYWdlYCBmb3IgZnV0dXJlIHJldHJpZXZhbCBvciBub3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbbG9jYWxTdG9yYWdlSWQ9J3NvdW5kd29ya3MnXSBQcmVmaXggb2YgdGhlIGBMb2NhbFN0b3JhZ2VgIElELlxuICAgKiBAdG9kbyB0aGlzLnNlbGVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHzCoCdwbGFjZXInLCB0cnVlLCBvcHRpb25zLmNvbG9yIHx8ICdibGFjaycpO1xuXG4gICAgLyoqXG4gICAgICogSW5kZXggb2YgdGhlIHBvc2l0aW9uIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5pbmRleCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuICAgIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fMKgJ2xpc3QnO1xuICAgIHRoaXMucGVyc2lzdCA9IG9wdGlvbnMucGVyc2lzdCB8fMKgZmFsc2U7XG4gICAgdGhpcy5sb2NhbFN0b3JhZ2VJZCA9IG9wdGlvbnMubG9jYWxTdG9yYWdlSWQgfHzCoCdzb3VuZHdvcmtzJztcblxuICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICBjYXNlICdncmFwaGljJzpcbiAgICAgICAgdGhpcy5zZWxlY3RvciA9IG5ldyBTcGFjZSh7XG4gICAgICAgICAgZml0Q29udGFpbmVyOiB0cnVlLFxuICAgICAgICAgIGxpc3RlblRvdWNoRXZlbnQ6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICB0aGlzLnNlbGVjdG9yID0gbmV3IExpc3RTZWxlY3Rvcih7fSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMuX3Jlc2l6ZVNlbGVjdG9yID0gdGhpcy5fcmVzaXplU2VsZWN0b3IuYmluZCh0aGlzKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplU2VsZWN0b3IsIGZhbHNlKTtcbiAgfVxuXG4gIF9yZXNpemVTZWxlY3RvcigpIHtcbiAgICB0aGlzLnNlbGVjdG9yLnJlc2l6ZSgpO1xuICB9XG5cbiAgX2dldFN0b3JhZ2VLZXkoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMubG9jYWxTdG9yYWdlSWR9OiR7dGhpcy5uYW1lfWA7XG4gIH1cblxuICBfc2V0TG9jYWxTdG9yYWdlKHBvc2l0aW9uKSB7XG4gICAgLy8gaWYgb3B0aW9ucy5leHBpcmUgYWRkIHRoIHRpbWVzdGFtcCB0byB0aGUgcG9zaXRpb24gb2JqZWN0XG4gICAgY29uc3Qga2V5ID0gdGhpcy5fZ2V0U3RvcmFnZUtleSgpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHBvc2l0aW9uKSk7XG4gIH1cblxuICBfZ2V0TG9jYWxTdG9yYWdlKCkge1xuICAgIGNvbnN0IGtleSA9IHRoaXMuX2dldFN0b3JhZ2VLZXkoKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuXG4gICAgLy8gY2hlY2sgZm9yIGV4cGlyZXMgZW50cnlcbiAgICAvLyBkZWxldGUgaWYgbm93ID4gZXhwaXJlc1xuICAgIHJldHVybiBKU09OLnBhcnNlKHBvc2l0aW9uKTtcbiAgfVxuXG4gIF9kZWxldGVMb2NhbFN0b3JhZ2UoKSB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5fZ2V0U3RvcmFnZUtleSgpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgIC8vIHdpbmRvdy5sb2NhbFN0b3JhZ2UuY2xlYXIoKTsgLy8gcmVtb3ZlIGV2ZXJ5dGhpbmcgZm9yIHRoZSBkb21haW5cbiAgfVxuXG4gIF9zZW5kUG9zaXRpb24ocG9zaXRpb24gPSBudWxsKSB7XG4gICAgaWYgKHBvc2l0aW9uICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmluZGV4ID0gcG9zaXRpb24uaW5kZXg7XG4gICAgICB0aGlzLmxhYmVsID0gcG9zaXRpb24ubGFiZWw7XG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBwb3NpdGlvbi5jb29yZGluYXRlcztcbiAgICB9XG5cbiAgICB0aGlzLnNlbmQoJ3Bvc2l0aW9uJywgdGhpcy5pbmRleCwgdGhpcy5sYWJlbCwgY2xpZW50LmNvb3JkaW5hdGVzKTtcbiAgfVxuXG4gIF9kaXNwbGF5KHBvc2l0aW9ucywgYXJlYSkge1xuICAgIC8vIGxpc3RlbiBmb3Igc2VsZWN0aW9uXG4gICAgdGhpcy5zZWxlY3Rvci5vbignc2VsZWN0JywgKHBvc2l0aW9uKSA9PiB7XG4gICAgICAvLyBvcHRpb25hbGx5IHN0b3JlIGluIGxvY2FsIHN0b3JhZ2VcbiAgICAgIGlmICh0aGlzLnBlcnNpc3QpXG4gICAgICAgIHRoaXMuX3NldExvY2FsU3RvcmFnZShwb3NpdGlvbik7XG5cbiAgICAgIC8vIHNlbmQgdG8gc2VydmVyXG4gICAgICB0aGlzLl9zZW5kUG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnNlbGVjdG9yLmRpc3BsYXkodGhpcy52aWV3LCBhcmVhKTtcbiAgICB0aGlzLnNlbGVjdG9yLmRpc3BsYXlQb3NpdGlvbnMocG9zaXRpb25zLCAyMCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICAvLyBjaGVjayBmb3IgaW5mb3JtYXRpb25zIGluIGxvY2FsIHN0b3JhZ2VcbiAgICBpZiAodGhpcy5wZXJzaXN0KSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuX2dldExvY2FsU3RvcmFnZSgpO1xuXG4gICAgICBpZiAocG9zaXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fc2VuZFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9uZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlcXVlc3QgcG9zaXRpb25zIG9yIGxhYmVsc1xuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcsIHRoaXMubW9kZSk7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ3NldHVwJywgKGNhcGFjaXR5LCBsYWJlbHMsIGNvb3JkaW5hdGVzLCBhcmVhKSA9PiB7XG4gICAgICBsZXQgbnVtTGFiZWxzID0gbGFiZWxzID8gbGFiZWxzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgICAgbGV0IG51bUNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXMgPyBjb29yZGluYXRlcy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGxldCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcblxuICAgICAgaWYobnVtUG9zaXRpb25zID4gY2FwYWNpdHkpXG4gICAgICAgIG51bVBvc2l0aW9ucyA9IGNhcGFjaXR5O1xuXG4gICAgICBsZXQgcG9zaXRpb25zID0gW107XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtUG9zaXRpb25zOyBpKyspIHtcbiAgICAgICAgbGV0IGxhYmVsID0gbGFiZWxzW2ldIHx8IChpICsgMSkudG9TdHJpbmcoKTtcbiAgICAgICAgbGV0IGNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXNbaV07XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHtcbiAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IGNvb3JkaW5hdGVzLFxuICAgICAgICB9O1xuICAgICAgICBwb3NpdGlvbnMucHVzaChwb3NpdGlvbik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2Rpc3BsYXkocG9zaXRpb25zLCBhcmVhKTtcbiAgICB9KTtcblxuICAgIC8vIGFsbG93IHRvIHJlc2V0IGxvY2FsU3RvcmFnZVxuICAgIHRoaXMucmVjZWl2ZSgncmVzZXQnLCB0aGlzLl9kZWxldGVMb2NhbFN0b3JhZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnQgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuX3NlbmRQb3NpdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBtb2R1bGUgdG8gaW5pdGlhbCBzdGF0ZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIHN1cGVyLnJlc2V0KCk7XG4gICAgLy8gcmVzZXQgY2xpZW50XG4gICAgdGhpcy5pbmRleCA9IG51bGw7XG4gICAgdGhpcy5sYWJlbCA9IG51bGw7XG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gbnVsbDtcblxuICAgIC8vIHJlbW92ZSBsaXN0ZW5lclxuICAgIHRoaXMuc2VsZWN0b3IucmVtb3ZlQWxsTGlzdGVuZXJzKCdzZWxlY3QnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb25lIG1ldGhvZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRvbmUoKSB7XG4gICAgc3VwZXIuZG9uZSgpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVTZWxlY3RvciwgZmFsc2UpO1xuICAgIHRoaXMuc2VsZWN0b3IucmVtb3ZlQWxsTGlzdGVuZXJzKCdzZWxlY3QnKTtcbiAgfVxufVxuIl19