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

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

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
    this._indexPositionMap = {};
    this._onSelect = this._onSelect.bind(this);
  }

  /**
   * The {@link ClientPlacer} module allows to select a place within a
   * {@link ClientSetup}.
   *
   * @example
   * import { client, ClientPlacer, ClientSetup } from 'soundworks/client';
   *
   * const setup = new ClientSetup();
   * const placer = new ClientPlacer({ setup: setup });
   * // ... instantiate other modules
   *
   * // Initialize the client (indicate the client type)
   * client.init('clientType');
   *
   * // Start the scenario
   * client.start((serial, parallel) => {
   *   // Make sure that the `setup` is initialized before it is used by the
   *   // `placer` (=> we use the `serial` function).
   *   serial(
   *     setup,
   *     placer,
   *     // ... other modules
   *   )
   * });
   */

  _createClass(ListSelector, [{
    key: '_onSelect',
    value: function _onSelect(e) {
      var options = this._select.options;
      var selectedIndex = this._select.selectedIndex;
      var index = parseInt(options[selectedIndex].value, 10);
      var position = this._indexPositionMap[index];
      this.emit('select', position);
    }
  }, {
    key: 'display',
    value: function display(setup, container) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      this.container = container;
      this.el = document.createElement('div');

      this._select = document.createElement('select');
      this.button = document.createElement('button');
      this.button.textContent = 'OK';
      this.button.classList.add('btn');

      this.el.appendChild(this._select);
      this.el.appendChild(this.button);
      this.container.appendChild(this.el);

      this.button.addEventListener('touchstart', this._onSelect, false);
      this.resize();
    }
  }, {
    key: 'resize',
    value: function resize() {
      if (!this.container) {
        return;
      } // if called before `display`

      var containerWidth = this.container.getBoundingClientRect().width;
      var containerHeight = this.container.getBoundingClientRect().height;

      var height = this.el.getBoundingClientRect().height;
      var width = containerWidth * 2 / 3;
      var left = containerWidth / 3 / 2;
      var top = (containerHeight - height) / 2;

      this.el.style.position = 'absolute';
      this.el.style.width = width + 'px';
      this.el.style.top = top + 'px';
      this.el.style.left = left + 'px';

      this._select.style.width = width + 'px';
      this.button.style.width = width + 'px';
    }
  }, {
    key: 'displayPositions',
    value: function displayPositions(positions) {
      var _this = this;

      positions.forEach(function (position) {
        var option = document.createElement('option');
        option.value = position.index;
        option.textContent = position.label;

        _this.select.appendChild(option);
        _this._indexPositionMap[position.index] = position;
      });
    }
  }]);

  return ListSelector;
})(_events.EventEmitter);

exports.ListSelector = ListSelector;

var ClientPlacer = (function (_Module) {
  _inherits(ClientPlacer, _Module);

  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='performance'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {ClientSetup} [options.setup] The setup in which to select the place.
   * @param {String} [options.mode='list'] Selection mode. Can be:
   * - `'list'` to select a place among a list of places.
   * - `'graphic`' to select a place on a graphical representation of the setup.
   * @param {Boolean} [options.persist=false] Indicates whether the selected place should be stored in the `LocalStorage` for future retrieval or not.
   * @param {String} [localStorageId='soundworks'] Prefix of the `LocalStorage` ID.
   * @todo this._selector
   */

  function ClientPlacer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientPlacer);

    _get(Object.getPrototypeOf(ClientPlacer.prototype), 'constructor', this).call(this, options.name || 'placer', true, options.color || 'black');

    /**
     * The setup in which to select a place. (Mandatory.)
     * @type {ClientSetup}
     */
    this.setup = options.setup;

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

    this._mode = options.mode || 'list';
    this._persist = options.persist || false;
    this._localStorageId = options.localStorageId || 'soundworks';

    switch (this._mode) {
      case 'graphic':
        this._selector = new _Space2['default']({
          fitContainer: true,
          listenTouchEvent: true
        });
        break;
      case 'list':
        this._selector = new ListSelector({});
        break;
    }

    this._resizeSelector = this._resizeSelector.bind(this);
    window.addEventListener('resize', this._resizeSelector, false);
  }

  _createClass(ClientPlacer, [{
    key: '_resizeSelector',
    value: function _resizeSelector() {
      this._selector.resize();
    }
  }, {
    key: '_getStorageKey',
    value: function _getStorageKey() {
      return this._localStorageId + ':' + this.name;
    }
  }, {
    key: '_persistInformation',
    value: function _persistInformation(position) {
      // if options.expire add th timestamp to the position object
      var key = this._getStorageKey();
      window.localStorage.setItem(key, JSON.stringify(position));
    }
  }, {
    key: '_retrieveInformation',
    value: function _retrieveInformation() {
      var key = this._getStorageKey();
      var position = window.localStorage.getItem(key);

      // check for expires entry
      // delete if now > expires
      return JSON.parse(position);
    }
  }, {
    key: '_deleteInformation',
    value: function _deleteInformation() {
      var key = this._getStorageKey();
      window.localStorage.removeItem(key);
      // window.localStorage.clear(); // remove everything for the domain
    }
  }, {
    key: '_sendInformation',
    value: function _sendInformation() {
      var position = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (position !== null) {
        this.index = position.index;
        this.label = position.label;
        _client2['default'].coordinates = position.coordinates;
      }

      this.send('information', this.index, this.label, _client2['default'].coordinates);
    }

    /**
     * Starts the module.
     * @private
     */
  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      _get(Object.getPrototypeOf(ClientPlacer.prototype), 'start', this).call(this);

      // prepare positions
      this._positions = this.setup.coordinates.map(function (coord, index) {
        return {
          index: index,
          label: _this2.setup.labels[index],
          coordinates: coord
        };
      });

      // check for informations in local storage
      if (this._persist) {
        var position = this._retrieveInformation();

        if (position !== null) {
          this._sendInformation(position);
          return this.done();
        }
      }

      // listen for selection
      this._selector.on('select', function (position) {
        // optionally store in local storage
        if (_this2._persist) {
          _this2._persistInformation(position);
        }
        // send to server
        _this2._sendInformation(position);
        _this2.done();
      });

      this._selector.display(this.setup, this.view, {});
      // make sure the DOM is ready (needed on ipods)
      setTimeout(function () {
        _this2._selector.displayPositions(_this2._positions, 20);
      }, 0);

      // allow to reset localStorage
      this.receive('reset', this._deleteInformation);
    }

    /**
     * Restarts the module.
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(ClientPlacer.prototype), 'restart', this).call(this);
      this._sendInformation();
    }

    /**
     * Resets the module to initial state.
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
      this._selector.removeAllListeners('select');
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
      this._selector.removeAllListeners('select');
    }
  }]);

  return ClientPlacer;
})(_Module3['default']);

exports['default'] = ClientPlacer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50UGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQTZCLFFBQVE7O3NCQUNsQixVQUFVOzs7O3VCQUNWLFVBQVU7Ozs7cUJBQ1gsU0FBUzs7Ozs7Ozs7O0lBT2QsWUFBWTtZQUFaLFlBQVk7O0FBQ1osV0FEQSxZQUFZLENBQ1gsT0FBTyxFQUFFOzBCQURWLFlBQVk7O0FBRXJCLCtCQUZTLFlBQVksNkNBRWI7QUFDUixRQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDNUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUFMVSxZQUFZOztXQU9kLG1CQUFDLENBQUMsRUFBRTtBQUNYLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQ3JDLFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO0FBQ2pELFVBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3pELFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQyxVQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUMvQjs7O1dBRU0saUJBQUMsS0FBSyxFQUFFLFNBQVMsRUFBZ0I7VUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQ3BDLFVBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFVBQUksQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFeEMsVUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMs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Q0FBQztLQUN6Qjs7Ozs7Ozs7V0FNSSxpQkFBRztBQUNOLGlDQTNKaUIsWUFBWSx1Q0EySmY7O0FBRWQsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsMEJBQU8sV0FBVyxHQUFHLElBQUksQ0FBQzs7QUFFMUIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUM3Qzs7Ozs7Ozs7V0FNRyxnQkFBRztBQUNMLGlDQXpLaUIsWUFBWSxzQ0F5S2hCO0FBQ2IsWUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2xFLFVBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDN0M7OztTQTVLa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcbmltcG9ydCBTcGFjZSBmcm9tICcuL1NwYWNlJztcblxuXG4vKipcbiAqIERpc3BsYXkgc3RyYXRlZ2llcyBmb3IgcGxhY2VyXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgTGlzdFNlbGVjdG9yIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5faW5kZXhQb3NpdGlvbk1hcCA9IHt9O1xuICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbiAgfVxuXG4gIF9vblNlbGVjdChlKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX3NlbGVjdC5vcHRpb25zO1xuICAgIGNvbnN0IHNlbGVjdGVkSW5kZXggPSB0aGlzLl9zZWxlY3Quc2VsZWN0ZWRJbmRleDtcbiAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KG9wdGlvbnNbc2VsZWN0ZWRJbmRleF0udmFsdWUsIDEwKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuX2luZGV4UG9zaXRpb25NYXBbaW5kZXhdO1xuICAgIHRoaXMuZW1pdCgnc2VsZWN0JywgcG9zaXRpb24pO1xuICB9XG5cbiAgZGlzcGxheShzZXR1cCwgY29udGFpbmVyLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICB0aGlzLl9zZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICB0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHRoaXMuYnV0dG9uLnRleHRDb250ZW50ID0gJ09LJztcbiAgICB0aGlzLmJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKTtcblxuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5fc2VsZWN0KTtcbiAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcblxuICAgIHRoaXMuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vblNlbGVjdCwgZmFsc2UpO1xuICAgIHRoaXMucmVzaXplKCk7XG4gIH1cblxuICByZXNpemUoKSB7XG4gICAgaWYgKCF0aGlzLmNvbnRhaW5lcikgeyByZXR1cm47IH0gLy8gaWYgY2FsbGVkIGJlZm9yZSBgZGlzcGxheWBcblxuICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gdGhpcy5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgY29uc3QgY29udGFpbmVySGVpZ2h0ID0gdGhpcy5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuXG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgY29uc3Qgd2lkdGggPSBjb250YWluZXJXaWR0aCAqIDIgLyAzO1xuICAgIGNvbnN0IGxlZnQgPSBjb250YWluZXJXaWR0aCAvIDMgLyAyO1xuICAgIGNvbnN0IHRvcCA9IChjb250YWluZXJIZWlnaHQgLSBoZWlnaHQpIC8gMjtcblxuICAgIHRoaXMuZWwuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIHRoaXMuZWwuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gICAgdGhpcy5lbC5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICAgIHRoaXMuZWwuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuXG4gICAgdGhpcy5fc2VsZWN0LnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICAgIHRoaXMuYnV0dG9uLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICB9XG5cbiAgZGlzcGxheVBvc2l0aW9ucyhwb3NpdGlvbnMpIHtcbiAgICBwb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgb3B0aW9uLnZhbHVlID0gcG9zaXRpb24uaW5kZXg7XG4gICAgICBvcHRpb24udGV4dENvbnRlbnQgPSBwb3NpdGlvbi5sYWJlbDtcblxuICAgICAgdGhpcy5zZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICAgIHRoaXMuX2luZGV4UG9zaXRpb25NYXBbcG9zaXRpb24uaW5kZXhdID0gcG9zaXRpb247XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUge0BsaW5rIENsaWVudFBsYWNlcn0gbW9kdWxlIGFsbG93cyB0byBzZWxlY3QgYSBwbGFjZSB3aXRoaW4gYVxuICoge0BsaW5rIENsaWVudFNldHVwfS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgY2xpZW50LCBDbGllbnRQbGFjZXIsIENsaWVudFNldHVwIH0gZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuICpcbiAqIGNvbnN0IHNldHVwID0gbmV3IENsaWVudFNldHVwKCk7XG4gKiBjb25zdCBwbGFjZXIgPSBuZXcgQ2xpZW50UGxhY2VyKHsgc2V0dXA6IHNldHVwIH0pO1xuICogLy8gLi4uIGluc3RhbnRpYXRlIG90aGVyIG1vZHVsZXNcbiAqXG4gKiAvLyBJbml0aWFsaXplIHRoZSBjbGllbnQgKGluZGljYXRlIHRoZSBjbGllbnQgdHlwZSlcbiAqIGNsaWVudC5pbml0KCdjbGllbnRUeXBlJyk7XG4gKlxuICogLy8gU3RhcnQgdGhlIHNjZW5hcmlvXG4gKiBjbGllbnQuc3RhcnQoKHNlcmlhbCwgcGFyYWxsZWwpID0+IHtcbiAqICAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlIGBzZXR1cGAgaXMgaW5pdGlhbGl6ZWQgYmVmb3JlIGl0IGlzIHVzZWQgYnkgdGhlXG4gKiAgIC8vIGBwbGFjZXJgICg9PiB3ZSB1c2UgdGhlIGBzZXJpYWxgIGZ1bmN0aW9uKS5cbiAqICAgc2VyaWFsKFxuICogICAgIHNldHVwLFxuICogICAgIHBsYWNlcixcbiAqICAgICAvLyAuLi4gb3RoZXIgbW9kdWxlc1xuICogICApXG4gKiB9KTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50UGxhY2VyIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdwZXJmb3JtYW5jZSddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtDbGllbnRTZXR1cH0gW29wdGlvbnMuc2V0dXBdIFRoZSBzZXR1cCBpbiB3aGljaCB0byBzZWxlY3QgdGhlIHBsYWNlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubW9kZT0nbGlzdCddIFNlbGVjdGlvbiBtb2RlLiBDYW4gYmU6XG4gICAqIC0gYCdsaXN0J2AgdG8gc2VsZWN0IGEgcGxhY2UgYW1vbmcgYSBsaXN0IG9mIHBsYWNlcy5cbiAgICogLSBgJ2dyYXBoaWNgJyB0byBzZWxlY3QgYSBwbGFjZSBvbiBhIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgc2V0dXAuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucGVyc2lzdD1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHNlbGVjdGVkIHBsYWNlIHNob3VsZCBiZSBzdG9yZWQgaW4gdGhlIGBMb2NhbFN0b3JhZ2VgIGZvciBmdXR1cmUgcmV0cmlldmFsIG9yIG5vdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtsb2NhbFN0b3JhZ2VJZD0nc291bmR3b3JrcyddIFByZWZpeCBvZiB0aGUgYExvY2FsU3RvcmFnZWAgSUQuXG4gICAqIEB0b2RvIHRoaXMuX3NlbGVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHzCoCdwbGFjZXInLCB0cnVlLCBvcHRpb25zLmNvbG9yIHx8ICdibGFjaycpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHNldHVwIGluIHdoaWNoIHRvIHNlbGVjdCBhIHBsYWNlLiAoTWFuZGF0b3J5LilcbiAgICAgKiBAdHlwZSB7Q2xpZW50U2V0dXB9XG4gICAgICovXG4gICAgdGhpcy5zZXR1cCA9IG9wdGlvbnMuc2V0dXA7XG5cbiAgICAvKipcbiAgICAgKiBJbmRleCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIExhYmVsIG9mIHRoZSBwb3NpdGlvbiBzZWxlY3RlZCBieSB0aGUgdXNlci5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgdGhpcy5fbW9kZSA9IG9wdGlvbnMubW9kZSB8fMKgJ2xpc3QnO1xuICAgIHRoaXMuX3BlcnNpc3QgPSBvcHRpb25zLnBlcnNpc3QgfHzCoGZhbHNlO1xuICAgIHRoaXMuX2xvY2FsU3RvcmFnZUlkID0gb3B0aW9ucy5sb2NhbFN0b3JhZ2VJZCB8fMKgJ3NvdW5kd29ya3MnO1xuXG4gICAgc3dpdGNoICh0aGlzLl9tb2RlKSB7XG4gICAgICBjYXNlICdncmFwaGljJzpcbiAgICAgICAgdGhpcy5fc2VsZWN0b3IgPSBuZXcgU3BhY2Uoe1xuICAgICAgICAgIGZpdENvbnRhaW5lcjogdHJ1ZSxcbiAgICAgICAgICBsaXN0ZW5Ub3VjaEV2ZW50OiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsaXN0JzpcbiAgICAgICAgdGhpcy5fc2VsZWN0b3IgPSBuZXcgTGlzdFNlbGVjdG9yKHt9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVzaXplU2VsZWN0b3IgPSB0aGlzLl9yZXNpemVTZWxlY3Rvci5iaW5kKHRoaXMpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVTZWxlY3RvciwgZmFsc2UpO1xuICB9XG5cbiAgX3Jlc2l6ZVNlbGVjdG9yKCkge1xuICAgIHRoaXMuX3NlbGVjdG9yLnJlc2l6ZSgpO1xuICB9XG5cbiAgX2dldFN0b3JhZ2VLZXkoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuX2xvY2FsU3RvcmFnZUlkfToke3RoaXMubmFtZX1gO1xuICB9XG5cbiAgX3BlcnNpc3RJbmZvcm1hdGlvbihwb3NpdGlvbikge1xuICAgIC8vIGlmIG9wdGlvbnMuZXhwaXJlIGFkZCB0aCB0aW1lc3RhbXAgdG8gdGhlIHBvc2l0aW9uIG9iamVjdFxuICAgIGNvbnN0IGtleSA9IHRoaXMuX2dldFN0b3JhZ2VLZXkoKTtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShwb3NpdGlvbikpO1xuICB9XG5cbiAgX3JldHJpZXZlSW5mb3JtYXRpb24oKSB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5fZ2V0U3RvcmFnZUtleSgpO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG5cbiAgICAvLyBjaGVjayBmb3IgZXhwaXJlcyBlbnRyeVxuICAgIC8vIGRlbGV0ZSBpZiBub3cgPiBleHBpcmVzXG4gICAgcmV0dXJuIEpTT04ucGFyc2UocG9zaXRpb24pO1xuICB9XG5cbiAgX2RlbGV0ZUluZm9ybWF0aW9uKCkge1xuICAgIGNvbnN0IGtleSA9IHRoaXMuX2dldFN0b3JhZ2VLZXkoKTtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAvLyB3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7IC8vIHJlbW92ZSBldmVyeXRoaW5nIGZvciB0aGUgZG9tYWluXG4gIH1cblxuICBfc2VuZEluZm9ybWF0aW9uKHBvc2l0aW9uID0gbnVsbCkge1xuICAgIGlmIChwb3NpdGlvbiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5pbmRleCA9IHBvc2l0aW9uLmluZGV4O1xuICAgICAgdGhpcy5sYWJlbCA9IHBvc2l0aW9uLmxhYmVsO1xuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gcG9zaXRpb24uY29vcmRpbmF0ZXM7XG4gICAgfVxuXG4gICAgdGhpcy5zZW5kKCdpbmZvcm1hdGlvbicsIHRoaXMuaW5kZXgsIHRoaXMubGFiZWwsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgLy8gcHJlcGFyZSBwb3NpdGlvbnNcbiAgICB0aGlzLl9wb3NpdGlvbnMgPSB0aGlzLnNldHVwLmNvb3JkaW5hdGVzLm1hcCgoY29vcmQsIGluZGV4KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIGxhYmVsOiB0aGlzLnNldHVwLmxhYmVsc1tpbmRleF0sXG4gICAgICAgIGNvb3JkaW5hdGVzOiBjb29yZCxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvLyBjaGVjayBmb3IgaW5mb3JtYXRpb25zIGluIGxvY2FsIHN0b3JhZ2VcbiAgICBpZiAodGhpcy5fcGVyc2lzdCkge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLl9yZXRyaWV2ZUluZm9ybWF0aW9uKCk7XG5cbiAgICAgIGlmIChwb3NpdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9zZW5kSW5mb3JtYXRpb24ocG9zaXRpb24pO1xuICAgICAgICByZXR1cm4gdGhpcy5kb25lKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gbGlzdGVuIGZvciBzZWxlY3Rpb25cbiAgICB0aGlzLl9zZWxlY3Rvci5vbignc2VsZWN0JywgKHBvc2l0aW9uKSA9PiB7XG4gICAgICAvLyBvcHRpb25hbGx5IHN0b3JlIGluIGxvY2FsIHN0b3JhZ2VcbiAgICAgIGlmICh0aGlzLl9wZXJzaXN0KSB7XG4gICAgICAgIHRoaXMuX3BlcnNpc3RJbmZvcm1hdGlvbihwb3NpdGlvbik7XG4gICAgICB9XG4gICAgICAvLyBzZW5kIHRvIHNlcnZlclxuICAgICAgdGhpcy5fc2VuZEluZm9ybWF0aW9uKHBvc2l0aW9uKTtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fc2VsZWN0b3IuZGlzcGxheSh0aGlzLnNldHVwLCB0aGlzLnZpZXcsIHt9KTtcbiAgICAvLyBtYWtlIHN1cmUgdGhlIERPTSBpcyByZWFkeSAobmVlZGVkIG9uIGlwb2RzKVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fc2VsZWN0b3IuZGlzcGxheVBvc2l0aW9ucyh0aGlzLl9wb3NpdGlvbnMsIDIwKTtcbiAgICB9LCAwKTtcblxuICAgIC8vIGFsbG93IHRvIHJlc2V0IGxvY2FsU3RvcmFnZVxuICAgIHRoaXMucmVjZWl2ZSgncmVzZXQnLCB0aGlzLl9kZWxldGVJbmZvcm1hdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuX3NlbmRJbmZvcm1hdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgbW9kdWxlIHRvIGluaXRpYWwgc3RhdGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuICAgIC8vIHJlc2V0IGNsaWVudFxuICAgIHRoaXMuaW5kZXggPSBudWxsO1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IG51bGw7XG4gICAgLy8gcmVtb3ZlIGxpc3RlbmVyXG4gICAgdGhpcy5fc2VsZWN0b3IucmVtb3ZlQWxsTGlzdGVuZXJzKCdzZWxlY3QnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb25lIG1ldGhvZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRvbmUoKSB7XG4gICAgc3VwZXIuZG9uZSgpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVTZWxlY3RvciwgZmFsc2UpO1xuICAgIHRoaXMuX3NlbGVjdG9yLnJlbW92ZUFsbExpc3RlbmVycygnc2VsZWN0Jyk7XG4gIH1cbn1cbiJdfQ==