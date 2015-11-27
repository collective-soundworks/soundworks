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
   * [client] Allow to select an available position within a predefined {@link Setup}.
   *
   * @example const setup = new Setup();
   * const placer = new Placer({ setup: setup });
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
     * Start the module.
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
     * Restart the module.
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(Placer.prototype), 'restart', this).call(this);
      this._sendInformation();
    }

    /**
     * Reset the module to initial state.
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
//# sourceMappingURL=data:application/json;base64,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Ozs7OztXQU1JLGlCQUFHO0FBQ04saUNBaktpQixNQUFNLHVDQWlLVDs7QUFFZCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQiwwQkFBTyxXQUFXLEdBQUcsSUFBSSxDQUFDOztBQUUxQixVQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzdDOzs7Ozs7OztXQU1HLGdCQUFHO0FBQ0wsaUNBL0tpQixNQUFNLHNDQStLVjtBQUNiLFlBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNsRSxVQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzdDOzs7U0FsTGtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6InNyYy9jbGllbnQvUGxhY2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5pbXBvcnQgU3BhY2UgZnJvbSAnLi9TcGFjZSc7XG5cblxuLyoqXG4gKiBEaXNwbGF5IHN0cmF0ZWdpZXMgZm9yIHBsYWNlclxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIExpc3RTZWxlY3RvciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2luZGV4UG9zaXRpb25NYXAgPSB7fTtcbiAgICB0aGlzLl9vblNlbGVjdCA9IHRoaXMuX29uU2VsZWN0LmJpbmQodGhpcyk7XG4gIH1cblxuICBfb25TZWxlY3QoZSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9zZWxlY3Qub3B0aW9ucztcbiAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gdGhpcy5fc2VsZWN0LnNlbGVjdGVkSW5kZXg7XG4gICAgY29uc3QgaW5kZXggPSBwYXJzZUludChvcHRpb25zW3NlbGVjdGVkSW5kZXhdLnZhbHVlLCAxMCk7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLl9pbmRleFBvc2l0aW9uTWFwW2luZGV4XTtcbiAgICB0aGlzLmVtaXQoJ3NlbGVjdCcsIHBvc2l0aW9uKTtcbiAgfVxuXG4gIGRpc3BsYXkoc2V0dXAsIGNvbnRhaW5lciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgdGhpcy5fc2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgdGhpcy5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICB0aGlzLmJ1dHRvbi50ZXh0Q29udGVudCA9ICdPSyc7XG4gICAgdGhpcy5idXR0b24uY2xhc3NMaXN0LmFkZCgnYnRuJyk7XG5cbiAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHRoaXMuX3NlbGVjdCk7XG4gICAgdGhpcy5lbC5hcHBlbmRDaGlsZCh0aGlzLmJ1dHRvbik7XG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG5cbiAgICB0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fb25TZWxlY3QsIGZhbHNlKTtcbiAgICB0aGlzLnJlc2l6ZSgpO1xuICB9XG5cbiAgcmVzaXplKCkge1xuICAgIGlmICghdGhpcy5jb250YWluZXIpIHsgcmV0dXJuOyB9IC8vIGlmIGNhbGxlZCBiZWZvcmUgYGRpc3BsYXlgXG5cbiAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IHRoaXMuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IHRoaXMuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgIGNvbnN0IHdpZHRoID0gY29udGFpbmVyV2lkdGggKiAyIC8gMztcbiAgICBjb25zdCBsZWZ0ID0gY29udGFpbmVyV2lkdGggLyAzIC8gMjtcbiAgICBjb25zdCB0b3AgPSAoY29udGFpbmVySGVpZ2h0IC0gaGVpZ2h0KSAvIDI7XG5cbiAgICB0aGlzLmVsLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICB0aGlzLmVsLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICAgIHRoaXMuZWwuc3R5bGUudG9wID0gdG9wICsgJ3B4JztcbiAgICB0aGlzLmVsLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcblxuICAgIHRoaXMuX3NlbGVjdC5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICB0aGlzLmJ1dHRvbi5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgfVxuXG4gIGRpc3BsYXlQb3NpdGlvbnMocG9zaXRpb25zKSB7XG4gICAgcG9zaXRpb25zLmZvckVhY2goKHBvc2l0aW9uKSA9PiB7XG4gICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIG9wdGlvbi52YWx1ZSA9IHBvc2l0aW9uLmluZGV4O1xuICAgICAgb3B0aW9uLnRleHRDb250ZW50ID0gcG9zaXRpb24ubGFiZWw7XG5cbiAgICAgIHRoaXMuc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XG4gICAgICB0aGlzLl9pbmRleFBvc2l0aW9uTWFwW3Bvc2l0aW9uLmluZGV4XSA9IHBvc2l0aW9uO1xuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogW2NsaWVudF0gQWxsb3cgdG8gc2VsZWN0IGFuIGF2YWlsYWJsZSBwb3NpdGlvbiB3aXRoaW4gYSBwcmVkZWZpbmVkIHtAbGluayBTZXR1cH0uXG4gKlxuICogQGV4YW1wbGUgY29uc3Qgc2V0dXAgPSBuZXcgU2V0dXAoKTtcbiAqIGNvbnN0IHBsYWNlciA9IG5ldyBQbGFjZXIoeyBzZXR1cDogc2V0dXAgfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYWNlciBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdwZXJmb3JtYW5jZSddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtDbGllbnRTZXR1cH0gW29wdGlvbnMuc2V0dXBdIFRoZSBzZXR1cCBpbiB3aGljaCB0byBzZWxlY3QgdGhlIHBsYWNlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubW9kZT0nbGlzdCddIFNlbGVjdGlvbiBtb2RlLiBDYW4gYmU6XG4gICAqIC0gYCdsaXN0J2AgdG8gc2VsZWN0IGEgcGxhY2UgYW1vbmcgYSBsaXN0IG9mIHBsYWNlcy5cbiAgICogLSBgJ2dyYXBoaWNgJyB0byBzZWxlY3QgYSBwbGFjZSBvbiBhIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgc2V0dXAuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucGVyc2lzdD1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHNlbGVjdGVkIHBsYWNlIHNob3VsZCBiZSBzdG9yZWQgaW4gdGhlIGBMb2NhbFN0b3JhZ2VgIGZvciBmdXR1cmUgcmV0cmlldmFsIG9yIG5vdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtsb2NhbFN0b3JhZ2VJZD0nc291bmR3b3JrcyddIFByZWZpeCBvZiB0aGUgYExvY2FsU3RvcmFnZWAgSUQuXG4gICAqIEB0b2RvIHRoaXMuX3NlbGVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHzCoCdwbGFjZXInLCB0cnVlLCBvcHRpb25zLmNvbG9yIHx8ICdibGFjaycpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHNldHVwIGluIHdoaWNoIHRvIHNlbGVjdCBhIHBsYWNlLiAoTWFuZGF0b3J5LilcbiAgICAgKiBAdHlwZSB7Q2xpZW50U2V0dXB9XG4gICAgICovXG4gICAgdGhpcy5zZXR1cCA9IG9wdGlvbnMuc2V0dXA7XG5cbiAgICAvKipcbiAgICAgKiBJbmRleCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIExhYmVsIG9mIHRoZSBwb3NpdGlvbiBzZWxlY3RlZCBieSB0aGUgdXNlci5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgdGhpcy5fbW9kZSA9IG9wdGlvbnMubW9kZSB8fMKgJ2xpc3QnO1xuICAgIHRoaXMuX3BlcnNpc3QgPSBvcHRpb25zLnBlcnNpc3QgfHzCoGZhbHNlO1xuICAgIHRoaXMuX2xvY2FsU3RvcmFnZUlkID0gb3B0aW9ucy5sb2NhbFN0b3JhZ2VJZCB8fMKgJ3NvdW5kd29ya3MnO1xuXG4gICAgc3dpdGNoICh0aGlzLl9tb2RlKSB7XG4gICAgICBjYXNlICdncmFwaGljJzpcbiAgICAgICAgdGhpcy5fc2VsZWN0b3IgPSBuZXcgU3BhY2Uoe1xuICAgICAgICAgIGZpdENvbnRhaW5lcjogdHJ1ZSxcbiAgICAgICAgICBsaXN0ZW5Ub3VjaEV2ZW50OiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsaXN0JzpcbiAgICAgICAgdGhpcy5fc2VsZWN0b3IgPSBuZXcgTGlzdFNlbGVjdG9yKHt9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVzaXplU2VsZWN0b3IgPSB0aGlzLl9yZXNpemVTZWxlY3Rvci5iaW5kKHRoaXMpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVTZWxlY3RvciwgZmFsc2UpO1xuICAgIC8vIGFsbG93IHRvIHJlc2V0IGxvY2FsU3RvcmFnZVxuICAgIGNsaWVudC5yZWNlaXZlKGAke3RoaXMubmFtZX06cmVzZXRgLCB0aGlzLl9kZWxldGVJbmZvcm1hdGlvbik7XG5cbiAgICAvLyBERUJVR1xuICAgIC8vIHRoaXMuX2RlbGV0ZUluZm9ybWF0aW9uKCk7XG4gIH1cblxuICBfcmVzaXplU2VsZWN0b3IoKSB7XG4gICAgdGhpcy5fc2VsZWN0b3IucmVzaXplKCk7XG4gIH1cblxuICBfZ2V0U3RvcmFnZUtleSgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5fbG9jYWxTdG9yYWdlSWR9OiR7dGhpcy5uYW1lfWA7XG4gIH1cblxuICBfcGVyc2lzdEluZm9ybWF0aW9uKHBvc2l0aW9uKSB7XG4gICAgLy8gaWYgb3B0aW9ucy5leHBpcmUgYWRkIHRoIHRpbWVzdGFtcCB0byB0aGUgcG9zaXRpb24gb2JqZWN0XG4gICAgY29uc3Qga2V5ID0gdGhpcy5fZ2V0U3RvcmFnZUtleSgpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHBvc2l0aW9uKSk7XG4gIH1cblxuICBfcmV0cmlldmVJbmZvcm1hdGlvbigpIHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLl9nZXRTdG9yYWdlS2V5KCk7XG4gICAgY29uc3QgcG9zaXRpb24gPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcblxuICAgIC8vIGNoZWNrIGZvciBleHBpcmVzIGVudHJ5XG4gICAgLy8gZGVsZXRlIGlmIG5vdyA+IGV4cGlyZXNcbiAgICByZXR1cm4gSlNPTi5wYXJzZShwb3NpdGlvbik7XG4gIH1cblxuICBfZGVsZXRlSW5mb3JtYXRpb24oKSB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5fZ2V0U3RvcmFnZUtleSgpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgIC8vIHdpbmRvdy5sb2NhbFN0b3JhZ2UuY2xlYXIoKTsgLy8gcmVtb3ZlIGV2ZXJ5dGhpbmcgZm9yIHRoZSBkb21haW5cbiAgfVxuXG4gIF9zZW5kSW5mb3JtYXRpb24ocG9zaXRpb24gPSBudWxsKSB7XG4gICAgaWYgKHBvc2l0aW9uICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmluZGV4ID0gcG9zaXRpb24uaW5kZXg7XG4gICAgICB0aGlzLmxhYmVsID0gcG9zaXRpb24ubGFiZWw7XG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBwb3NpdGlvbi5jb29yZGluYXRlcztcbiAgICB9XG5cbiAgICBjbGllbnQuc2VuZChcbiAgICAgIGAke3RoaXMubmFtZX06aW5mb3JtYXRpb25gLFxuICAgICAgdGhpcy5pbmRleCxcbiAgICAgIHRoaXMubGFiZWwsXG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXNcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgLy8gcHJlcGFyZSBwb3NpdGlvbnNcbiAgICB0aGlzLl9wb3NpdGlvbnMgPSB0aGlzLnNldHVwLmNvb3JkaW5hdGVzLm1hcCgoY29vcmQsIGluZGV4KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIGxhYmVsOiB0aGlzLnNldHVwLmxhYmVsc1tpbmRleF0sXG4gICAgICAgIGNvb3JkaW5hdGVzOiBjb29yZCxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvLyBjaGVjayBmb3IgaW5mb3JtYXRpb25zIGluIGxvY2FsIHN0b3JhZ2VcbiAgICBpZiAodGhpcy5fcGVyc2lzdCkge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLl9yZXRyaWV2ZUluZm9ybWF0aW9uKCk7XG5cbiAgICAgIGlmIChwb3NpdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9zZW5kSW5mb3JtYXRpb24ocG9zaXRpb24pO1xuICAgICAgICByZXR1cm4gdGhpcy5kb25lKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gbGlzdGVuIGZvciBzZWxlY3Rpb25cbiAgICB0aGlzLl9zZWxlY3Rvci5vbignc2VsZWN0JywgKHBvc2l0aW9uKSA9PiB7XG4gICAgICAvLyBvcHRpb25hbGx5IHN0b3JlIGluIGxvY2FsIHN0b3JhZ2VcbiAgICAgIGlmICh0aGlzLl9wZXJzaXN0KSB7XG4gICAgICAgIHRoaXMuX3BlcnNpc3RJbmZvcm1hdGlvbihwb3NpdGlvbik7XG4gICAgICB9XG4gICAgICAvLyBzZW5kIHRvIHNlcnZlclxuICAgICAgdGhpcy5fc2VuZEluZm9ybWF0aW9uKHBvc2l0aW9uKTtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fc2VsZWN0b3IuZGlzcGxheSh0aGlzLnNldHVwLCB0aGlzLnZpZXcsIHt9KTtcbiAgICAvLyBtYWtlIHN1cmUgdGhlIERPTSBpcyByZWFkeSAobmVlZGVkIG9uIGlwb2RzKVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fc2VsZWN0b3IuZGlzcGxheVBvc2l0aW9ucyh0aGlzLl9wb3NpdGlvbnMsIDIwKTtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICB0aGlzLl9zZW5kSW5mb3JtYXRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgbW9kdWxlIHRvIGluaXRpYWwgc3RhdGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuICAgIC8vIHJlc2V0IGNsaWVudFxuICAgIHRoaXMuaW5kZXggPSBudWxsO1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IG51bGw7XG4gICAgLy8gcmVtb3ZlIGxpc3RlbmVyXG4gICAgdGhpcy5fc2VsZWN0b3IucmVtb3ZlQWxsTGlzdGVuZXJzKCdzZWxlY3QnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb25lIG1ldGhvZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRvbmUoKSB7XG4gICAgc3VwZXIuZG9uZSgpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVTZWxlY3RvciwgZmFsc2UpO1xuICAgIHRoaXMuX3NlbGVjdG9yLnJlbW92ZUFsbExpc3RlbmVycygnc2VsZWN0Jyk7XG4gIH1cbn1cbiJdfQ==