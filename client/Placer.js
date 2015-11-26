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
   * The {@link Placer} module allows to select a place within a
   * {@link Setup}.
   *
   * @example import { client, Placer, Setup } from 'soundworks/client';
   *
   * const setup = new Setup();
   * const placer = new Placer({ setup: setup });
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

var Placer = (function (_Module) {
  _inherits(Placer, _Module);

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

  function Placer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Placer);

    _get(Object.getPrototypeOf(Placer.prototype), 'constructor', this).call(this, options.name || 'placer', true, options.color || 'black');

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
    // allow to reset localStorage
    _client2['default'].receive(this.name + ':reset', this._deleteInformation);

    // DEBUG
    // this._deleteInformation();
  }

  _createClass(Placer, [{
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

      _get(Object.getPrototypeOf(Placer.prototype), 'start', this).call(this);

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
    }

    /**
     * Restarts the module.
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(Placer.prototype), 'restart', this).call(this);
      this._sendInformation();
    }

    /**
     * Resets the module to initial state.
     * @private
     */
  }, {
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(Placer.prototype), 'reset', this).call(this);
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
      _get(Object.getPrototypeOf(Placer.prototype), 'done', this).call(this);
      window.removeEventListener('resize', this._resizeSelector, false);
      this._selector.removeAllListeners('select');
    }
  }]);

  return Placer;
})(_Module3['default']);

exports['default'] = Placer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvUGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQTZCLFFBQVE7O3NCQUNsQixVQUFVOzs7O3VCQUNWLFVBQVU7Ozs7cUJBQ1gsU0FBUzs7Ozs7Ozs7O0lBT2QsWUFBWTtZQUFaLFlBQVk7O0FBQ1osV0FEQSxZQUFZLENBQ1gsT0FBTyxFQUFFOzBCQURWLFlBQVk7O0FBRXJCLCtCQUZTLFlBQVksNkNBRWI7QUFDUixRQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDNUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztlQUxVLFlBQVk7O1dBT2QsbUJBQUMsQ0FBQyxFQUFFO0FBQ1gsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDckMsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7QUFDakQsVUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekQsVUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9DLFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQy9COzs7V0FFTSxpQkFBQyxLQUFLLEVBQUUsU0FBUyxFQUFnQjtVQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDcEMsVUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDM0IsVUFBSSxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV4QyxVQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENB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LEVBQUUsQ0FBQztLQUN6Qjs7Ozs7Ozs7V0FNSSxpQkFBRztBQUNOLGlDQWxLaUIsTUFBTSx1Q0FrS1Q7O0FBRWQsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsMEJBQU8sV0FBVyxHQUFHLElBQUksQ0FBQzs7QUFFMUIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUM3Qzs7Ozs7Ozs7V0FNRyxnQkFBRztBQUNMLGlDQWhMaUIsTUFBTSxzQ0FnTFY7QUFDYixZQUFNLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEUsVUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUM3Qzs7O1NBbkxrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJzcmMvY2xpZW50L1BsYWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuaW1wb3J0IFNwYWNlIGZyb20gJy4vU3BhY2UnO1xuXG5cbi8qKlxuICogRGlzcGxheSBzdHJhdGVnaWVzIGZvciBwbGFjZXJcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBMaXN0U2VsZWN0b3IgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9pbmRleFBvc2l0aW9uTWFwID0ge307XG4gICAgdGhpcy5fb25TZWxlY3QgPSB0aGlzLl9vblNlbGVjdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgX29uU2VsZWN0KGUpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fc2VsZWN0Lm9wdGlvbnM7XG4gICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IHRoaXMuX3NlbGVjdC5zZWxlY3RlZEluZGV4O1xuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQob3B0aW9uc1tzZWxlY3RlZEluZGV4XS52YWx1ZSwgMTApO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5faW5kZXhQb3NpdGlvbk1hcFtpbmRleF07XG4gICAgdGhpcy5lbWl0KCdzZWxlY3QnLCBwb3NpdGlvbik7XG4gIH1cblxuICBkaXNwbGF5KHNldHVwLCBjb250YWluZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIHRoaXMuX3NlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgIHRoaXMuYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgdGhpcy5idXR0b24udGV4dENvbnRlbnQgPSAnT0snO1xuICAgIHRoaXMuYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bicpO1xuXG4gICAgdGhpcy5lbC5hcHBlbmRDaGlsZCh0aGlzLl9zZWxlY3QpO1xuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5idXR0b24pO1xuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuXG4gICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX29uU2VsZWN0LCBmYWxzZSk7XG4gICAgdGhpcy5yZXNpemUoKTtcbiAgfVxuXG4gIHJlc2l6ZSgpIHtcbiAgICBpZiAoIXRoaXMuY29udGFpbmVyKSB7IHJldHVybjsgfSAvLyBpZiBjYWxsZWQgYmVmb3JlIGBkaXNwbGF5YFxuXG4gICAgY29uc3QgY29udGFpbmVyV2lkdGggPSB0aGlzLmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSB0aGlzLmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG5cbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICBjb25zdCB3aWR0aCA9IGNvbnRhaW5lcldpZHRoICogMiAvIDM7XG4gICAgY29uc3QgbGVmdCA9IGNvbnRhaW5lcldpZHRoIC8gMyAvIDI7XG4gICAgY29uc3QgdG9wID0gKGNvbnRhaW5lckhlaWdodCAtIGhlaWdodCkgLyAyO1xuXG4gICAgdGhpcy5lbC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgdGhpcy5lbC5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICB0aGlzLmVsLnN0eWxlLnRvcCA9IHRvcCArICdweCc7XG4gICAgdGhpcy5lbC5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XG5cbiAgICB0aGlzLl9zZWxlY3Quc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gICAgdGhpcy5idXR0b24uc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gIH1cblxuICBkaXNwbGF5UG9zaXRpb25zKHBvc2l0aW9ucykge1xuICAgIHBvc2l0aW9ucy5mb3JFYWNoKChwb3NpdGlvbikgPT4ge1xuICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBvcHRpb24udmFsdWUgPSBwb3NpdGlvbi5pbmRleDtcbiAgICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IHBvc2l0aW9uLmxhYmVsO1xuXG4gICAgICB0aGlzLnNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgICAgdGhpcy5faW5kZXhQb3NpdGlvbk1hcFtwb3NpdGlvbi5pbmRleF0gPSBwb3NpdGlvbjtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSB7QGxpbmsgUGxhY2VyfSBtb2R1bGUgYWxsb3dzIHRvIHNlbGVjdCBhIHBsYWNlIHdpdGhpbiBhXG4gKiB7QGxpbmsgU2V0dXB9LlxuICpcbiAqIEBleGFtcGxlIGltcG9ydCB7IGNsaWVudCwgUGxhY2VyLCBTZXR1cCB9IGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbiAqXG4gKiBjb25zdCBzZXR1cCA9IG5ldyBTZXR1cCgpO1xuICogY29uc3QgcGxhY2VyID0gbmV3IFBsYWNlcih7IHNldHVwOiBzZXR1cCB9KTtcbiAqIC8vIC4uLiBpbnN0YW50aWF0ZSBvdGhlciBtb2R1bGVzXG4gKlxuICogLy8gSW5pdGlhbGl6ZSB0aGUgY2xpZW50IChpbmRpY2F0ZSB0aGUgY2xpZW50IHR5cGUpXG4gKiBjbGllbnQuaW5pdCgnY2xpZW50VHlwZScpO1xuICpcbiAqIC8vIFN0YXJ0IHRoZSBzY2VuYXJpb1xuICogY2xpZW50LnN0YXJ0KChzZXJpYWwsIHBhcmFsbGVsKSA9PiB7XG4gKiAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBgc2V0dXBgIGlzIGluaXRpYWxpemVkIGJlZm9yZSBpdCBpcyB1c2VkIGJ5IHRoZVxuICogICAvLyBgcGxhY2VyYCAoPT4gd2UgdXNlIHRoZSBgc2VyaWFsYCBmdW5jdGlvbikuXG4gKiAgIHNlcmlhbChcbiAqICAgICBzZXR1cCxcbiAqICAgICBwbGFjZXIsXG4gKiAgICAgLy8gLi4uIG90aGVyIG1vZHVsZXNcbiAqICAgKVxuICogfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYWNlciBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0ncGVyZm9ybWFuY2UnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7Q2xpZW50U2V0dXB9IFtvcHRpb25zLnNldHVwXSBUaGUgc2V0dXAgaW4gd2hpY2ggdG8gc2VsZWN0IHRoZSBwbGFjZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm1vZGU9J2xpc3QnXSBTZWxlY3Rpb24gbW9kZS4gQ2FuIGJlOlxuICAgKiAtIGAnbGlzdCdgIHRvIHNlbGVjdCBhIHBsYWNlIGFtb25nIGEgbGlzdCBvZiBwbGFjZXMuXG4gICAqIC0gYCdncmFwaGljYCcgdG8gc2VsZWN0IGEgcGxhY2Ugb24gYSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIHNldHVwLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnBlcnNpc3Q9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzZWxlY3RlZCBwbGFjZSBzaG91bGQgYmUgc3RvcmVkIGluIHRoZSBgTG9jYWxTdG9yYWdlYCBmb3IgZnV0dXJlIHJldHJpZXZhbCBvciBub3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbbG9jYWxTdG9yYWdlSWQ9J3NvdW5kd29ya3MnXSBQcmVmaXggb2YgdGhlIGBMb2NhbFN0b3JhZ2VgIElELlxuICAgKiBAdG9kbyB0aGlzLl9zZWxlY3RvclxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8wqAncGxhY2VyJywgdHJ1ZSwgb3B0aW9ucy5jb2xvciB8fCAnYmxhY2snKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBzZXR1cCBpbiB3aGljaCB0byBzZWxlY3QgYSBwbGFjZS4gKE1hbmRhdG9yeS4pXG4gICAgICogQHR5cGUge0NsaWVudFNldHVwfVxuICAgICAqL1xuICAgIHRoaXMuc2V0dXAgPSBvcHRpb25zLnNldHVwO1xuXG4gICAgLyoqXG4gICAgICogSW5kZXggb2YgdGhlIHBvc2l0aW9uIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5pbmRleCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuICAgIHRoaXMuX21vZGUgPSBvcHRpb25zLm1vZGUgfHzCoCdsaXN0JztcbiAgICB0aGlzLl9wZXJzaXN0ID0gb3B0aW9ucy5wZXJzaXN0IHx8wqBmYWxzZTtcbiAgICB0aGlzLl9sb2NhbFN0b3JhZ2VJZCA9IG9wdGlvbnMubG9jYWxTdG9yYWdlSWQgfHzCoCdzb3VuZHdvcmtzJztcblxuICAgIHN3aXRjaCAodGhpcy5fbW9kZSkge1xuICAgICAgY2FzZSAnZ3JhcGhpYyc6XG4gICAgICAgIHRoaXMuX3NlbGVjdG9yID0gbmV3IFNwYWNlKHtcbiAgICAgICAgICBmaXRDb250YWluZXI6IHRydWUsXG4gICAgICAgICAgbGlzdGVuVG91Y2hFdmVudDogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGlzdCc6XG4gICAgICAgIHRoaXMuX3NlbGVjdG9yID0gbmV3IExpc3RTZWxlY3Rvcih7fSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMuX3Jlc2l6ZVNlbGVjdG9yID0gdGhpcy5fcmVzaXplU2VsZWN0b3IuYmluZCh0aGlzKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplU2VsZWN0b3IsIGZhbHNlKTtcbiAgICAvLyBhbGxvdyB0byByZXNldCBsb2NhbFN0b3JhZ2VcbiAgICBjbGllbnQucmVjZWl2ZShgJHt0aGlzLm5hbWV9OnJlc2V0YCwgdGhpcy5fZGVsZXRlSW5mb3JtYXRpb24pO1xuXG4gICAgLy8gREVCVUdcbiAgICAvLyB0aGlzLl9kZWxldGVJbmZvcm1hdGlvbigpO1xuICB9XG5cbiAgX3Jlc2l6ZVNlbGVjdG9yKCkge1xuICAgIHRoaXMuX3NlbGVjdG9yLnJlc2l6ZSgpO1xuICB9XG5cbiAgX2dldFN0b3JhZ2VLZXkoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuX2xvY2FsU3RvcmFnZUlkfToke3RoaXMubmFtZX1gO1xuICB9XG5cbiAgX3BlcnNpc3RJbmZvcm1hdGlvbihwb3NpdGlvbikge1xuICAgIC8vIGlmIG9wdGlvbnMuZXhwaXJlIGFkZCB0aCB0aW1lc3RhbXAgdG8gdGhlIHBvc2l0aW9uIG9iamVjdFxuICAgIGNvbnN0IGtleSA9IHRoaXMuX2dldFN0b3JhZ2VLZXkoKTtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShwb3NpdGlvbikpO1xuICB9XG5cbiAgX3JldHJpZXZlSW5mb3JtYXRpb24oKSB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5fZ2V0U3RvcmFnZUtleSgpO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG5cbiAgICAvLyBjaGVjayBmb3IgZXhwaXJlcyBlbnRyeVxuICAgIC8vIGRlbGV0ZSBpZiBub3cgPiBleHBpcmVzXG4gICAgcmV0dXJuIEpTT04ucGFyc2UocG9zaXRpb24pO1xuICB9XG5cbiAgX2RlbGV0ZUluZm9ybWF0aW9uKCkge1xuICAgIGNvbnN0IGtleSA9IHRoaXMuX2dldFN0b3JhZ2VLZXkoKTtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAvLyB3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7IC8vIHJlbW92ZSBldmVyeXRoaW5nIGZvciB0aGUgZG9tYWluXG4gIH1cblxuICBfc2VuZEluZm9ybWF0aW9uKHBvc2l0aW9uID0gbnVsbCkge1xuICAgIGlmIChwb3NpdGlvbiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5pbmRleCA9IHBvc2l0aW9uLmluZGV4O1xuICAgICAgdGhpcy5sYWJlbCA9IHBvc2l0aW9uLmxhYmVsO1xuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gcG9zaXRpb24uY29vcmRpbmF0ZXM7XG4gICAgfVxuXG4gICAgY2xpZW50LnNlbmQoXG4gICAgICBgJHt0aGlzLm5hbWV9OmluZm9ybWF0aW9uYCxcbiAgICAgIHRoaXMuaW5kZXgsXG4gICAgICB0aGlzLmxhYmVsLFxuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICAvLyBwcmVwYXJlIHBvc2l0aW9uc1xuICAgIHRoaXMuX3Bvc2l0aW9ucyA9IHRoaXMuc2V0dXAuY29vcmRpbmF0ZXMubWFwKChjb29yZCwgaW5kZXgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgbGFiZWw6IHRoaXMuc2V0dXAubGFiZWxzW2luZGV4XSxcbiAgICAgICAgY29vcmRpbmF0ZXM6IGNvb3JkLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8vIGNoZWNrIGZvciBpbmZvcm1hdGlvbnMgaW4gbG9jYWwgc3RvcmFnZVxuICAgIGlmICh0aGlzLl9wZXJzaXN0KSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuX3JldHJpZXZlSW5mb3JtYXRpb24oKTtcblxuICAgICAgaWYgKHBvc2l0aW9uICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3NlbmRJbmZvcm1hdGlvbihwb3NpdGlvbik7XG4gICAgICAgIHJldHVybiB0aGlzLmRvbmUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBsaXN0ZW4gZm9yIHNlbGVjdGlvblxuICAgIHRoaXMuX3NlbGVjdG9yLm9uKCdzZWxlY3QnLCAocG9zaXRpb24pID0+IHtcbiAgICAgIC8vIG9wdGlvbmFsbHkgc3RvcmUgaW4gbG9jYWwgc3RvcmFnZVxuICAgICAgaWYgKHRoaXMuX3BlcnNpc3QpIHtcbiAgICAgICAgdGhpcy5fcGVyc2lzdEluZm9ybWF0aW9uKHBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICAgIC8vIHNlbmQgdG8gc2VydmVyXG4gICAgICB0aGlzLl9zZW5kSW5mb3JtYXRpb24ocG9zaXRpb24pO1xuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9zZWxlY3Rvci5kaXNwbGF5KHRoaXMuc2V0dXAsIHRoaXMudmlldywge30pO1xuICAgIC8vIG1ha2Ugc3VyZSB0aGUgRE9NIGlzIHJlYWR5IChuZWVkZWQgb24gaXBvZHMpXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLl9zZWxlY3Rvci5kaXNwbGF5UG9zaXRpb25zKHRoaXMuX3Bvc2l0aW9ucywgMjApO1xuICAgIH0sIDApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICB0aGlzLl9zZW5kSW5mb3JtYXRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIG1vZHVsZSB0byBpbml0aWFsIHN0YXRlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgICAvLyByZXNldCBjbGllbnRcbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcbiAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBudWxsO1xuICAgIC8vIHJlbW92ZSBsaXN0ZW5lclxuICAgIHRoaXMuX3NlbGVjdG9yLnJlbW92ZUFsbExpc3RlbmVycygnc2VsZWN0Jyk7XG4gIH1cblxuICAvKipcbiAgICogRG9uZSBtZXRob2QuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkb25lKCkge1xuICAgIHN1cGVyLmRvbmUoKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplU2VsZWN0b3IsIGZhbHNlKTtcbiAgICB0aGlzLl9zZWxlY3Rvci5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3NlbGVjdCcpO1xuICB9XG59XG4iXX0=