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

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

var _localStorage = require('./localStorage');

var _localStorage2 = _interopRequireDefault(_localStorage);

var _displaySpaceView = require('./display/SpaceView');

var _displaySpaceView2 = _interopRequireDefault(_displaySpaceView);

/**
 * Display strategies for placer
 * @private
 */
// export class ListSelector extends EventEmitter {
//   constructor(options) {
//     super();
//     this.labels = [];
//     this.coordinates = [];
//     this._onSelect = this._onSelect.bind(this);
//   }

//   _onSelect(e) {
//     const options = this.select.options;
//     const selectedIndex = this.select.selectedIndex;
//     const index = parseInt(options[selectedIndex].value, 10);
//     this.emit('select', index);
//   }

//   resize() {
//     if (this.container) {
//       const containerWidth = this.container.getBoundingClientRect().width;
//       const containerHeight = this.container.getBoundingClientRect().height;

//       const height = this.el.getBoundingClientRect().height;
//       const width = containerWidth * 2 / 3;
//       const left = containerWidth / 3 / 2;
//       const top = (containerHeight - height) / 2;

//       this.el.style.position = 'absolute';
//       this.el.style.width = width + 'px';
//       this.el.style.top = top + 'px';
//       this.el.style.left = left + 'px';

//       this.select.style.width = width + 'px';
//       this.button.style.width = width + 'px';
//     }
//   }

//   display(container) {
//     this.container = container;
//     this.el = document.createElement('div');

//     this.select = document.createElement('select');
//     this.button = document.createElement('button');
//     this.button.textContent = 'OK';
//     this.button.classList.add('btn');

//     this.el.appendChild(this.select);
//     this.el.appendChild(this.button);
//     this.container.appendChild(this.el);

//     this.button.addEventListener('touchstart', this._onSelect, false);
//     this.resize();
//   }

//   displayPositions(labels, coordinates, capacity) {
//     this.labels = labels;
//     this.coordinates = coordinates;

//     for(let i = 0; i < positions.length; i++) {
//       const position = positions[i];
//       const option = document.createElement('option');

//       option.value = i;
//       option.textContent = position.label || (i + 1).toString();

//       this.select.appendChild(option);
//     }
//   }
// }

/**
 * [client] Allow to select a place within a set of predefined positions (i.e. labels and/or coordinates).
 *
 * (See also {@link src/server/ServerPlacer.js~ServerPlacer} on the server side.)
 *
 * @example
 * const placer = new ClientPlacer({ capacity: 100 });
 */

var ClientPlacer = (function (_ClientModule) {
  _inherits(ClientPlacer, _ClientModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='performance'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String} [options.mode='list'] Selection mode. Can be:
   * - `'list'` to select a place among a list of places.
   * - `'graphic'` to select a place on a graphical representation of the available positions.
   * @param {Boolean} [options.persist=false] Indicates whether the selected place should be stored in the `LocalStorage` for future retrieval or not.
   * @param {String} [localStorageId='soundworks'] Prefix of the `LocalStorage` ID.
   * @todo this.selector
   */

  function ClientPlacer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientPlacer);

    _get(Object.getPrototypeOf(ClientPlacer.prototype), 'constructor', this).call(this, options.name || 'placer', options);

    this.index = null;
    this.label = null;

    this.mode = options.mode || 'graphic';
    this.persist = options.persist || false;
    this.localStorageNS = 'placer:position';

    this._createView = this._createView.bind(this);
    this._onSelect = this._onSelect.bind(this);
  }

  _createClass(ClientPlacer, [{
    key: 'init',
    value: function init() {
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

      _client2['default'].coordinates = null;
    }

    /**
     * Start the module.
     * @private
     */
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(ClientPlacer.prototype), 'start', this).call(this);

      // check for informations in local storage
      if (this.persist) {
        var position = _localStorage2['default'].get(this.localStorageNS);

        if (position !== null) {
          this._sendPosition(position);
          return this.done();
        }
      }

      // request positions or labels
      this.send('request', this.mode);
      this.receive('setup', this._createView);
      // allow to reset localStorage
      this.receive('reset', function () {
        return _localStorage2['default']['delete'](_this.localStorageNS);
      });
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
    }

    /**
     * Done method.
     * @private
     */
  }, {
    key: 'done',
    value: function done() {
      _get(Object.getPrototypeOf(ClientPlacer.prototype), 'done', this).call(this);
    }
  }, {
    key: '_createView',
    value: function _createView(capacity, labels, coordinates, area) {
      var _this2 = this;

      var numLabels = labels ? labels.length : Infinity;
      var numCoordinates = coordinates ? coordinates.length : Infinity;
      var numPositions = Math.min(numLabels, numCoordinates);

      if (numPositions > capacity) {
        numPositions = capacity;
      }

      var positions = [];

      for (var i = 0; i < numPositions; i++) {
        var label = labels[i] || (i + 1).toString();
        var coords = coordinates[i];

        // @todo - define if coords should be an array
        // or an object and harmonize with SpaceView, Locator, etc...
        var position = {
          id: i,
          index: i,
          label: label,
          x: coords[0],
          y: coords[1]
        };

        positions.push(position);
      }

      // @todo - should handle position selected by other players in real time.
      switch (this.mode) {
        case 'graphic':
          // @todo handle instruction and error messages
          this.view = new _displaySpaceView2['default'](area);
          this.view.render();
          this.view.setPositions(positions);
          this.view.installEvents({
            'click .position': function clickPosition(e) {
              var position = _this2.view.shapePositionMap.get(e.target);
              _this2._onSelect(position);
            }
          });

          this.view.appendTo(this.$container);
          break;
        case 'list':

          break;
      }
    }
  }, {
    key: '_onSelect',
    value: function _onSelect(position) {
      // optionally store in local storage
      if (this.persist) {
        this._setLocalStorage(position);
      }

      // @todo should handle rejection from the server.
      // send to server
      this._sendPosition(position);
      this.done();
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
  }]);

  return ClientPlacer;
})(_ClientModule3['default']);

exports['default'] = ClientPlacer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50UGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQW1CLFVBQVU7Ozs7NkJBQ0osZ0JBQWdCOzs7OzRCQUNoQixnQkFBZ0I7Ozs7Z0NBQ25CLHFCQUFxQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtGdEIsWUFBWTtZQUFaLFlBQVk7Ozs7Ozs7Ozs7Ozs7O0FBWXBCLFdBWlEsWUFBWSxHQVlMO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFaTCxZQUFZOztBQWE3QiwrQkFiaUIsWUFBWSw2Q0FhdkIsT0FBTyxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUUsT0FBTyxFQUFFOztBQUV6QyxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQztBQUN0QyxRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDO0FBQ3hDLFFBQUksQ0FBQyxjQUFjLEdBQUcsaUJBQWlCLENBQUM7O0FBRXhDLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0MsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM1Qzs7ZUF4QmtCLFlBQVk7O1dBMEIzQixnQkFBRzs7Ozs7QUFLTCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTWxCLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVsQiwwQkFBTyxXQUFXLEdBQUcsSUFB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O1dBQ0YsQ0FBQyxDQUFDOztBQUVILGNBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxnQkFBTTtBQUFBLEFBQ1IsYUFBSyxNQUFNOztBQUVULGdCQUFNO0FBQUEsT0FDVDtLQUNGOzs7V0FFUSxtQkFBQyxRQUFRLEVBQUU7O0FBRWxCLFVBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixZQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDakM7Ozs7QUFJRCxVQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdCLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7V0FFWSx5QkFBa0I7VUFBakIsUUFBUSx5REFBRyxJQUFJOztBQUMzQixVQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7QUFDckIsWUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQzVCLFlBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUM1Qiw0QkFBTyxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztPQUMzQzs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsb0JBQU8sV0FBVyxDQUFDLENBQUM7S0FDbkU7OztTQWpLa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuaW1wb3J0IGxvY2FsU3RvcmFnZSBmcm9tICcuL2xvY2FsU3RvcmFnZSc7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4vZGlzcGxheS9TcGFjZVZpZXcnO1xuXG4vKipcbiAqIERpc3BsYXkgc3RyYXRlZ2llcyBmb3IgcGxhY2VyXG4gKiBAcHJpdmF0ZVxuICovXG4vLyBleHBvcnQgY2xhc3MgTGlzdFNlbGVjdG9yIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbi8vICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuLy8gICAgIHN1cGVyKCk7XG4vLyAgICAgdGhpcy5sYWJlbHMgPSBbXTtcbi8vICAgICB0aGlzLmNvb3JkaW5hdGVzID0gW107XG4vLyAgICAgdGhpcy5fb25TZWxlY3QgPSB0aGlzLl9vblNlbGVjdC5iaW5kKHRoaXMpO1xuLy8gICB9XG5cbi8vICAgX29uU2VsZWN0KGUpIHtcbi8vICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5zZWxlY3Qub3B0aW9ucztcbi8vICAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gdGhpcy5zZWxlY3Quc2VsZWN0ZWRJbmRleDtcbi8vICAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KG9wdGlvbnNbc2VsZWN0ZWRJbmRleF0udmFsdWUsIDEwKTtcbi8vICAgICB0aGlzLmVtaXQoJ3NlbGVjdCcsIGluZGV4KTtcbi8vICAgfVxuXG4vLyAgIHJlc2l6ZSgpIHtcbi8vICAgICBpZiAodGhpcy5jb250YWluZXIpIHtcbi8vICAgICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gdGhpcy5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4vLyAgICAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSB0aGlzLmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG5cbi8vICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuLy8gICAgICAgY29uc3Qgd2lkdGggPSBjb250YWluZXJXaWR0aCAqIDIgLyAzO1xuLy8gICAgICAgY29uc3QgbGVmdCA9IGNvbnRhaW5lcldpZHRoIC8gMyAvIDI7XG4vLyAgICAgICBjb25zdCB0b3AgPSAoY29udGFpbmVySGVpZ2h0IC0gaGVpZ2h0KSAvIDI7XG5cbi8vICAgICAgIHRoaXMuZWwuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuLy8gICAgICAgdGhpcy5lbC5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4Jztcbi8vICAgICAgIHRoaXMuZWwuc3R5bGUudG9wID0gdG9wICsgJ3B4Jztcbi8vICAgICAgIHRoaXMuZWwuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuXG4vLyAgICAgICB0aGlzLnNlbGVjdC5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4Jztcbi8vICAgICAgIHRoaXMuYnV0dG9uLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuLy8gICAgIH1cbi8vICAgfVxuXG4vLyAgIGRpc3BsYXkoY29udGFpbmVyKSB7XG4vLyAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4vLyAgICAgdGhpcy5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4vLyAgICAgdGhpcy5zZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbi8vICAgICB0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuLy8gICAgIHRoaXMuYnV0dG9uLnRleHRDb250ZW50ID0gJ09LJztcbi8vICAgICB0aGlzLmJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKTtcblxuLy8gICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5zZWxlY3QpO1xuLy8gICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5idXR0b24pO1xuLy8gICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuXG4vLyAgICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX29uU2VsZWN0LCBmYWxzZSk7XG4vLyAgICAgdGhpcy5yZXNpemUoKTtcbi8vICAgfVxuXG4vLyAgIGRpc3BsYXlQb3NpdGlvbnMobGFiZWxzLCBjb29yZGluYXRlcywgY2FwYWNpdHkpIHtcbi8vICAgICB0aGlzLmxhYmVscyA9IGxhYmVscztcbi8vICAgICB0aGlzLmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbi8vICAgICBmb3IobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zLmxlbmd0aDsgaSsrKSB7XG4vLyAgICAgICBjb25zdCBwb3NpdGlvbiA9IHBvc2l0aW9uc1tpXTtcbi8vICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuXG4vLyAgICAgICBvcHRpb24udmFsdWUgPSBpO1xuLy8gICAgICAgb3B0aW9uLnRleHRDb250ZW50ID0gcG9zaXRpb24ubGFiZWwgfHwgKGkgKyAxKS50b1N0cmluZygpO1xuXG4vLyAgICAgICB0aGlzLnNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xuLy8gICAgIH1cbi8vICAgfVxuLy8gfVxuXG4vKipcbiAqIFtjbGllbnRdIEFsbG93IHRvIHNlbGVjdCBhIHBsYWNlIHdpdGhpbiBhIHNldCBvZiBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoaS5lLiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyUGxhY2VyLmpzflNlcnZlclBsYWNlcn0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgcGxhY2VyID0gbmV3IENsaWVudFBsYWNlcih7IGNhcGFjaXR5OiAxMDAgfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudFBsYWNlciBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdwZXJmb3JtYW5jZSddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm1vZGU9J2xpc3QnXSBTZWxlY3Rpb24gbW9kZS4gQ2FuIGJlOlxuICAgKiAtIGAnbGlzdCdgIHRvIHNlbGVjdCBhIHBsYWNlIGFtb25nIGEgbGlzdCBvZiBwbGFjZXMuXG4gICAqIC0gYCdncmFwaGljJ2AgdG8gc2VsZWN0IGEgcGxhY2Ugb24gYSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGF2YWlsYWJsZSBwb3NpdGlvbnMuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucGVyc2lzdD1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHNlbGVjdGVkIHBsYWNlIHNob3VsZCBiZSBzdG9yZWQgaW4gdGhlIGBMb2NhbFN0b3JhZ2VgIGZvciBmdXR1cmUgcmV0cmlldmFsIG9yIG5vdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtsb2NhbFN0b3JhZ2VJZD0nc291bmR3b3JrcyddIFByZWZpeCBvZiB0aGUgYExvY2FsU3RvcmFnZWAgSUQuXG4gICAqIEB0b2RvIHRoaXMuc2VsZWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fMKgJ3BsYWNlcicsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5pbmRleCA9IG51bGw7XG4gICAgdGhpcy5sYWJlbCA9IG51bGw7XG5cbiAgICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHzCoCdncmFwaGljJztcbiAgICB0aGlzLnBlcnNpc3QgPSBvcHRpb25zLnBlcnNpc3QgfHzCoGZhbHNlO1xuICAgIHRoaXMubG9jYWxTdG9yYWdlTlMgPSAncGxhY2VyOnBvc2l0aW9uJztcblxuICAgIHRoaXMuX2NyZWF0ZVZpZXcgPSB0aGlzLl9jcmVhdGVWaWV3LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25TZWxlY3QgPSB0aGlzLl9vblNlbGVjdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBJbmRleCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIExhYmVsIG9mIHRoZSBwb3NpdGlvbiBzZWxlY3RlZCBieSB0aGUgdXNlci5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIC8vIGNoZWNrIGZvciBpbmZvcm1hdGlvbnMgaW4gbG9jYWwgc3RvcmFnZVxuICAgIGlmICh0aGlzLnBlcnNpc3QpIHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gbG9jYWxTdG9yYWdlLmdldCh0aGlzLmxvY2FsU3RvcmFnZU5TKTtcblxuICAgICAgaWYgKHBvc2l0aW9uICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3NlbmRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICAgIHJldHVybiB0aGlzLmRvbmUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXF1ZXN0IHBvc2l0aW9ucyBvciBsYWJlbHNcbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnLCB0aGlzLm1vZGUpO1xuICAgIHRoaXMucmVjZWl2ZSgnc2V0dXAnLCB0aGlzLl9jcmVhdGVWaWV3KTtcbiAgICAvLyBhbGxvdyB0byByZXNldCBsb2NhbFN0b3JhZ2VcbiAgICB0aGlzLnJlY2VpdmUoJ3Jlc2V0JywgKCkgPT4gbG9jYWxTdG9yYWdlLmRlbGV0ZSh0aGlzLmxvY2FsU3RvcmFnZU5TKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydCB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5fc2VuZFBvc2l0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIG1vZHVsZSB0byBpbml0aWFsIHN0YXRlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb25lIG1ldGhvZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRvbmUoKSB7XG4gICAgc3VwZXIuZG9uZSgpO1xuICB9XG5cbiAgX2NyZWF0ZVZpZXcoY2FwYWNpdHksIGxhYmVscywgY29vcmRpbmF0ZXMsIGFyZWEpIHtcbiAgICBjb25zdCBudW1MYWJlbHMgPSBsYWJlbHMgPyBsYWJlbHMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgY29uc3QgbnVtQ29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcyA/IGNvb3JkaW5hdGVzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgIGxldCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcblxuICAgIGlmIChudW1Qb3NpdGlvbnMgPiBjYXBhY2l0eSkge1xuICAgICAgbnVtUG9zaXRpb25zID0gY2FwYWNpdHk7XG4gICAgfVxuXG4gICAgY29uc3QgcG9zaXRpb25zID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVBvc2l0aW9uczsgaSsrKSB7XG4gICAgICBjb25zdCBsYWJlbCA9IGxhYmVsc1tpXSB8fCAoaSArIDEpLnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBjb29yZHMgPSBjb29yZGluYXRlc1tpXTtcblxuICAgICAgLy8gQHRvZG8gLSBkZWZpbmUgaWYgY29vcmRzIHNob3VsZCBiZSBhbiBhcnJheVxuICAgICAgLy8gb3IgYW4gb2JqZWN0IGFuZCBoYXJtb25pemUgd2l0aCBTcGFjZVZpZXcsIExvY2F0b3IsIGV0Yy4uLlxuICAgICAgY29uc3QgcG9zaXRpb24gPSB7XG4gICAgICAgIGlkOiBpLFxuICAgICAgICBpbmRleDogaSxcbiAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICB4OiBjb29yZHNbMF0sXG4gICAgICAgIHk6IGNvb3Jkc1sxXSxcbiAgICAgIH07XG5cbiAgICAgIHBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICAvLyBAdG9kbyAtIHNob3VsZCBoYW5kbGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgb3RoZXIgcGxheWVycyBpbiByZWFsIHRpbWUuXG4gICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgIGNhc2UgJ2dyYXBoaWMnOlxuICAgICAgICAvLyBAdG9kbyBoYW5kbGUgaW5zdHJ1Y3Rpb24gYW5kIGVycm9yIG1lc3NhZ2VzXG4gICAgICAgIHRoaXMudmlldyA9IG5ldyBTcGFjZVZpZXcoYXJlYSk7XG4gICAgICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICAgICAgdGhpcy52aWV3LnNldFBvc2l0aW9ucyhwb3NpdGlvbnMpO1xuICAgICAgICB0aGlzLnZpZXcuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAgICAgJ2NsaWNrIC5wb3NpdGlvbic6IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMudmlldy5zaGFwZVBvc2l0aW9uTWFwLmdldChlLnRhcmdldCk7XG4gICAgICAgICAgICB0aGlzLl9vblNlbGVjdChwb3NpdGlvbik7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy52aWV3LmFwcGVuZFRvKHRoaXMuJGNvbnRhaW5lcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGlzdCc6XG5cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgX29uU2VsZWN0KHBvc2l0aW9uKSB7XG4gICAgLy8gb3B0aW9uYWxseSBzdG9yZSBpbiBsb2NhbCBzdG9yYWdlXG4gICAgaWYgKHRoaXMucGVyc2lzdCkge1xuICAgICAgdGhpcy5fc2V0TG9jYWxTdG9yYWdlKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICAvLyBAdG9kbyBzaG91bGQgaGFuZGxlIHJlamVjdGlvbiBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgLy8gc2VuZCB0byBzZXJ2ZXJcbiAgICB0aGlzLl9zZW5kUG9zaXRpb24ocG9zaXRpb24pO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgX3NlbmRQb3NpdGlvbihwb3NpdGlvbiA9IG51bGwpIHtcbiAgICBpZiAocG9zaXRpb24gIT09IG51bGwpIHtcbiAgICAgIHRoaXMuaW5kZXggPSBwb3NpdGlvbi5pbmRleDtcbiAgICAgIHRoaXMubGFiZWwgPSBwb3NpdGlvbi5sYWJlbDtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IHBvc2l0aW9uLmNvb3JkaW5hdGVzO1xuICAgIH1cblxuICAgIHRoaXMuc2VuZCgncG9zaXRpb24nLCB0aGlzLmluZGV4LCB0aGlzLmxhYmVsLCBjbGllbnQuY29vcmRpbmF0ZXMpO1xuICB9XG59XG4iXX0=