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
 * display strategies for placer
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
   * The {@link ClientPlacer} module allows to select a place in a list of predefined places.
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

  // export default class ClientPlacer extends Module {
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
     * The setup in which to select a place.
     * @type {ClientSetup}
     */
    this.setup = options.setup;

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
    // allow to reset localStorage
    _client2['default'].receive(this.name + ':reset', this._deleteInformation);

    // DEBUG
    // this._deleteInformation();
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

      _client2['default'].send(this.name + ':information', this.index, this.label, _client2['default'].coordinates);
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
      this.positions = this.setup.coordinates.map(function (coord, index) {
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
        _this2._selector.displayPositions(_this2.positions, 20);
      }, 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvUGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQTZCLFFBQVE7O3NCQUNsQixVQUFVOzs7O3VCQUNWLFVBQVU7Ozs7cUJBQ1gsU0FBUzs7Ozs7Ozs7O0lBT2QsWUFBWTtZQUFaLFlBQVk7O0FBQ1osV0FEQSxZQUFZLENBQ1gsT0FBTyxFQUFFOzBCQURWLFlBQVk7O0FBRXJCLCtCQUZTLFlBQVksNkNBRWI7QUFDUixRQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDNUM7Ozs7OztlQUxVLFlBQVk7O1dBT2QsbUJBQUMsQ0FBQyxFQUFFO0FBQ1gsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDckMsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7QUFDakQsVUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekQsVUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9DLFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQy9COzs7V0FFTSxpQkFBQyxLQUFLLEVBQUUsU0FBUyxFQUFnQjtVQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDcEMsVUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDM0IsVUFBSSxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV4QyxVQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFD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QUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLDBCQUFPLFdBQVcsR0FBRyxJQUFJLENBQUM7O0FBRTFCLFVBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDN0M7Ozs7Ozs7O1dBTUcsZ0JBQUc7QUFDTCxpQ0FyS0UsWUFBWSxzQ0FxS0Q7QUFDYixZQUFNLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEUsVUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUM3Qzs7O1NBeEtHLFlBQVkiLCJmaWxlIjoic3JjL2NsaWVudC9QbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcbmltcG9ydCBTcGFjZSBmcm9tICcuL1NwYWNlJztcblxuXG4vKipcbiAqIGRpc3BsYXkgc3RyYXRlZ2llcyBmb3IgcGxhY2VyXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgTGlzdFNlbGVjdG9yIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5faW5kZXhQb3NpdGlvbk1hcCA9IHt9O1xuICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbiAgfVxuXG4gIF9vblNlbGVjdChlKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX3NlbGVjdC5vcHRpb25zO1xuICAgIGNvbnN0IHNlbGVjdGVkSW5kZXggPSB0aGlzLl9zZWxlY3Quc2VsZWN0ZWRJbmRleDtcbiAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KG9wdGlvbnNbc2VsZWN0ZWRJbmRleF0udmFsdWUsIDEwKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuX2luZGV4UG9zaXRpb25NYXBbaW5kZXhdO1xuICAgIHRoaXMuZW1pdCgnc2VsZWN0JywgcG9zaXRpb24pO1xuICB9XG5cbiAgZGlzcGxheShzZXR1cCwgY29udGFpbmVyLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICB0aGlzLl9zZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICB0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHRoaXMuYnV0dG9uLnRleHRDb250ZW50ID0gJ09LJztcbiAgICB0aGlzLmJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKTtcblxuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5fc2VsZWN0KTtcbiAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcblxuICAgIHRoaXMuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vblNlbGVjdCwgZmFsc2UpO1xuICAgIHRoaXMucmVzaXplKCk7XG4gIH1cblxuICByZXNpemUoKSB7XG4gICAgaWYgKCF0aGlzLmNvbnRhaW5lcikgeyByZXR1cm47IH0gLy8gaWYgY2FsbGVkIGJlZm9yZSBgZGlzcGxheWBcblxuICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gdGhpcy5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgY29uc3QgY29udGFpbmVySGVpZ2h0ID0gdGhpcy5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuXG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgY29uc3Qgd2lkdGggPSBjb250YWluZXJXaWR0aCAqIDIgLyAzO1xuICAgIGNvbnN0IGxlZnQgPSBjb250YWluZXJXaWR0aCAvIDMgLyAyO1xuICAgIGNvbnN0IHRvcCA9IChjb250YWluZXJIZWlnaHQgLSBoZWlnaHQpIC8gMjtcblxuICAgIHRoaXMuZWwuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIHRoaXMuZWwuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gICAgdGhpcy5lbC5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICAgIHRoaXMuZWwuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuXG4gICAgdGhpcy5fc2VsZWN0LnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICAgIHRoaXMuYnV0dG9uLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICB9XG5cbiAgZGlzcGxheVBvc2l0aW9ucyhwb3NpdGlvbnMpIHtcbiAgICBwb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgb3B0aW9uLnZhbHVlID0gcG9zaXRpb24uaW5kZXg7XG4gICAgICBvcHRpb24udGV4dENvbnRlbnQgPSBwb3NpdGlvbi5sYWJlbDtcblxuICAgICAgdGhpcy5zZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICAgIHRoaXMuX2luZGV4UG9zaXRpb25NYXBbcG9zaXRpb24uaW5kZXhdID0gcG9zaXRpb247XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUge0BsaW5rIENsaWVudFBsYWNlcn0gbW9kdWxlIGFsbG93cyB0byBzZWxlY3QgYSBwbGFjZSBpbiBhIGxpc3Qgb2YgcHJlZGVmaW5lZCBwbGFjZXMuXG4gKi9cbmNsYXNzIENsaWVudFBsYWNlciBleHRlbmRzIE1vZHVsZSB7XG4vLyBleHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRQbGFjZXIgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3BlcmZvcm1hbmNlJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKiBAcGFyYW0ge0NsaWVudFNldHVwfSBbb3B0aW9ucy5zZXR1cF0gVGhlIHNldHVwIGluIHdoaWNoIHRvIHNlbGVjdCB0aGUgcGxhY2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5tb2RlPSdsaXN0J10gU2VsZWN0aW9uIG1vZGUuIENhbiBiZTpcbiAgICogLSBgJ2xpc3QnYCB0byBzZWxlY3QgYSBwbGFjZSBhbW9uZyBhIGxpc3Qgb2YgcGxhY2VzLlxuICAgKiAtIGAnZ3JhcGhpY2AnIHRvIHNlbGVjdCBhIHBsYWNlIG9uIGEgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBzZXR1cC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5wZXJzaXN0PWZhbHNlXSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc2VsZWN0ZWQgcGxhY2Ugc2hvdWxkIGJlIHN0b3JlZCBpbiB0aGUgYExvY2FsU3RvcmFnZWAgZm9yIGZ1dHVyZSByZXRyaWV2YWwgb3Igbm90LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2xvY2FsU3RvcmFnZUlkPSdzb3VuZHdvcmtzJ10gUHJlZml4IG9mIHRoZSBgTG9jYWxTdG9yYWdlYCBJRC5cbiAgICogQHRvZG8gdGhpcy5fc2VsZWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fMKgJ3BsYWNlcicsIHRydWUsIG9wdGlvbnMuY29sb3IgfHwgJ2JsYWNrJyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc2V0dXAgaW4gd2hpY2ggdG8gc2VsZWN0IGEgcGxhY2UuXG4gICAgICogQHR5cGUge0NsaWVudFNldHVwfVxuICAgICAqL1xuICAgIHRoaXMuc2V0dXAgPSBvcHRpb25zLnNldHVwO1xuXG4gICAgdGhpcy5fbW9kZSA9IG9wdGlvbnMubW9kZSB8fMKgJ2xpc3QnO1xuICAgIHRoaXMuX3BlcnNpc3QgPSBvcHRpb25zLnBlcnNpc3QgfHzCoGZhbHNlO1xuICAgIHRoaXMuX2xvY2FsU3RvcmFnZUlkID0gb3B0aW9ucy5sb2NhbFN0b3JhZ2VJZCB8fMKgJ3NvdW5kd29ya3MnO1xuXG4gICAgc3dpdGNoICh0aGlzLl9tb2RlKSB7XG4gICAgICBjYXNlICdncmFwaGljJzpcbiAgICAgICAgdGhpcy5fc2VsZWN0b3IgPSBuZXcgU3BhY2Uoe1xuICAgICAgICAgIGZpdENvbnRhaW5lcjogdHJ1ZSxcbiAgICAgICAgICBsaXN0ZW5Ub3VjaEV2ZW50OiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsaXN0JzpcbiAgICAgICAgdGhpcy5fc2VsZWN0b3IgPSBuZXcgTGlzdFNlbGVjdG9yKHt9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVzaXplU2VsZWN0b3IgPSB0aGlzLl9yZXNpemVTZWxlY3Rvci5iaW5kKHRoaXMpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVTZWxlY3RvciwgZmFsc2UpO1xuICAgIC8vIGFsbG93IHRvIHJlc2V0IGxvY2FsU3RvcmFnZVxuICAgIGNsaWVudC5yZWNlaXZlKGAke3RoaXMubmFtZX06cmVzZXRgLCB0aGlzLl9kZWxldGVJbmZvcm1hdGlvbik7XG5cbiAgICAvLyBERUJVR1xuICAgIC8vIHRoaXMuX2RlbGV0ZUluZm9ybWF0aW9uKCk7XG4gIH1cblxuICBfcmVzaXplU2VsZWN0b3IoKSB7XG4gICAgdGhpcy5fc2VsZWN0b3IucmVzaXplKCk7XG4gIH1cblxuICBfZ2V0U3RvcmFnZUtleSgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5fbG9jYWxTdG9yYWdlSWR9OiR7dGhpcy5uYW1lfWA7XG4gIH1cblxuICBfcGVyc2lzdEluZm9ybWF0aW9uKHBvc2l0aW9uKSB7XG4gICAgLy8gaWYgb3B0aW9ucy5leHBpcmUgYWRkIHRoIHRpbWVzdGFtcCB0byB0aGUgcG9zaXRpb24gb2JqZWN0XG4gICAgY29uc3Qga2V5ID0gdGhpcy5fZ2V0U3RvcmFnZUtleSgpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHBvc2l0aW9uKSk7XG4gIH1cblxuICBfcmV0cmlldmVJbmZvcm1hdGlvbigpIHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLl9nZXRTdG9yYWdlS2V5KCk7XG4gICAgY29uc3QgcG9zaXRpb24gPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcblxuICAgIC8vIGNoZWNrIGZvciBleHBpcmVzIGVudHJ5XG4gICAgLy8gZGVsZXRlIGlmIG5vdyA+IGV4cGlyZXNcbiAgICByZXR1cm4gSlNPTi5wYXJzZShwb3NpdGlvbik7XG4gIH1cblxuICBfZGVsZXRlSW5mb3JtYXRpb24oKSB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5fZ2V0U3RvcmFnZUtleSgpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgIC8vIHdpbmRvdy5sb2NhbFN0b3JhZ2UuY2xlYXIoKTsgLy8gcmVtb3ZlIGV2ZXJ5dGhpbmcgZm9yIHRoZSBkb21haW5cbiAgfVxuXG4gIF9zZW5kSW5mb3JtYXRpb24ocG9zaXRpb24gPSBudWxsKSB7XG4gICAgaWYgKHBvc2l0aW9uICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmluZGV4ID0gcG9zaXRpb24uaW5kZXg7XG4gICAgICB0aGlzLmxhYmVsID0gcG9zaXRpb24ubGFiZWw7XG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBwb3NpdGlvbi5jb29yZGluYXRlcztcbiAgICB9XG5cbiAgICBjbGllbnQuc2VuZChcbiAgICAgIGAke3RoaXMubmFtZX06aW5mb3JtYXRpb25gLFxuICAgICAgdGhpcy5pbmRleCxcbiAgICAgIHRoaXMubGFiZWwsXG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXNcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIC8vIHByZXBhcmUgcG9zaXRpb25zXG4gICAgdGhpcy5wb3NpdGlvbnMgPSB0aGlzLnNldHVwLmNvb3JkaW5hdGVzLm1hcCgoY29vcmQsIGluZGV4KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIGxhYmVsOiB0aGlzLnNldHVwLmxhYmVsc1tpbmRleF0sXG4gICAgICAgIGNvb3JkaW5hdGVzOiBjb29yZCxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvLyBjaGVjayBmb3IgaW5mb3JtYXRpb25zIGluIGxvY2FsIHN0b3JhZ2VcbiAgICBpZiAodGhpcy5fcGVyc2lzdCkge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLl9yZXRyaWV2ZUluZm9ybWF0aW9uKCk7XG5cbiAgICAgIGlmIChwb3NpdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9zZW5kSW5mb3JtYXRpb24ocG9zaXRpb24pO1xuICAgICAgICByZXR1cm4gdGhpcy5kb25lKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gbGlzdGVuIGZvciBzZWxlY3Rpb25cbiAgICB0aGlzLl9zZWxlY3Rvci5vbignc2VsZWN0JywgKHBvc2l0aW9uKSA9PiB7XG4gICAgICAvLyBvcHRpb25hbGx5IHN0b3JlIGluIGxvY2FsIHN0b3JhZ2VcbiAgICAgIGlmICh0aGlzLl9wZXJzaXN0KSB7XG4gICAgICAgIHRoaXMuX3BlcnNpc3RJbmZvcm1hdGlvbihwb3NpdGlvbik7XG4gICAgICB9XG4gICAgICAvLyBzZW5kIHRvIHNlcnZlclxuICAgICAgdGhpcy5fc2VuZEluZm9ybWF0aW9uKHBvc2l0aW9uKTtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fc2VsZWN0b3IuZGlzcGxheSh0aGlzLnNldHVwLCB0aGlzLnZpZXcsIHt9KTtcbiAgICAvLyBtYWtlIHN1cmUgdGhlIERPTSBpcyByZWFkeSAobmVlZGVkIG9uIGlwb2RzKVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fc2VsZWN0b3IuZGlzcGxheVBvc2l0aW9ucyh0aGlzLnBvc2l0aW9ucywgMjApO1xuICAgIH0sIDApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICB0aGlzLl9zZW5kSW5mb3JtYXRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIG1vZHVsZSB0byBpbml0aWFsIHN0YXRlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgICAvLyByZXNldCBjbGllbnRcbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcbiAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBudWxsO1xuICAgIC8vIHJlbW92ZSBsaXN0ZW5lclxuICAgIHRoaXMuX3NlbGVjdG9yLnJlbW92ZUFsbExpc3RlbmVycygnc2VsZWN0Jyk7XG4gIH1cblxuICAvKipcbiAgICogRG9uZSBtZXRob2QuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkb25lKCkge1xuICAgIHN1cGVyLmRvbmUoKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplU2VsZWN0b3IsIGZhbHNlKTtcbiAgICB0aGlzLl9zZWxlY3Rvci5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3NlbGVjdCcpO1xuICB9XG59XG4iXX0=