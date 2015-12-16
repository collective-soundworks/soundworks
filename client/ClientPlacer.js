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
       * =Index of the position selected by the user.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50UGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQW1CLFVBQVU7Ozs7NkJBQ0osZ0JBQWdCOzs7OzRCQUNoQixnQkFBZ0I7Ozs7Z0NBQ25CLHFCQUFxQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFvRnRCLFlBQVk7WUFBWixZQUFZOzs7Ozs7Ozs7Ozs7OztBQVlwQixXQVpRLFlBQVksR0FZTDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBWkwsWUFBWTs7QUFhN0IsK0JBYmlCLFlBQVksNkNBYXZCLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFLE9BQU8sRUFBRTs7QUFFekMsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFTLENBQUM7QUFDdEMsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQztBQUN4QyxRQUFJLENBQUMsY0FBYyxHQUFHLGlCQUFpQixDQUFDOztBQUV4QyxRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9DLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDNUM7O2VBeEJrQixZQUFZOztXQTBCM0IsZ0JBQUc7Ozs7O0FBS0wsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Ozs7OztBQU1sQixVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFbEIsMEJBQU8sV0FBVyxHQUFHLElB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MUI7V0FDRixDQUFDLENBQUM7O0FBRUgsY0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLGdCQUFNO0FBQUEsQUFDUixhQUFLLE1BQU07O0FBRVQsZ0JBQU07QUFBQSxPQUNUO0tBQ0Y7OztXQUVRLG1CQUFDLFFBQVEsRUFBRTs7QUFFbEIsVUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUNqQzs7OztBQUlELFVBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0IsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztXQUVZLHlCQUFrQjtVQUFqQixRQUFRLHlEQUFHLElBQUk7O0FBQzNCLFVBQUksUUFBUSxLQUFLLElBQUksRUFBRTtBQUNyQixZQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDNUIsWUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQzVCLDRCQUFPLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO09BQzNDOztBQUVELFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxvQkFBTyxXQUFXLENBQUMsQ0FBQztLQUNuRTs7O1NBbEtrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudFBsYWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgbG9jYWxTdG9yYWdlIGZyb20gJy4vbG9jYWxTdG9yYWdlJztcbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi9kaXNwbGF5L1NwYWNlVmlldyc7XG5cbi8qKlxuICogRGlzcGxheSBzdHJhdGVnaWVzIGZvciBwbGFjZXJcbiAqIEBwcml2YXRlXG4gKi9cblxuLy8gZXhwb3J0IGNsYXNzIExpc3RTZWxlY3RvciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4vLyAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbi8vICAgICBzdXBlcigpO1xuLy8gICAgIHRoaXMubGFiZWxzID0gW107XG4vLyAgICAgdGhpcy5jb29yZGluYXRlcyA9IFtdO1xuLy8gICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbi8vICAgfVxuXG4vLyAgIF9vblNlbGVjdChlKSB7XG4vLyAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuc2VsZWN0Lm9wdGlvbnM7XG4vLyAgICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IHRoaXMuc2VsZWN0LnNlbGVjdGVkSW5kZXg7XG4vLyAgICAgY29uc3QgaW5kZXggPSBwYXJzZUludChvcHRpb25zW3NlbGVjdGVkSW5kZXhdLnZhbHVlLCAxMCk7XG4vLyAgICAgdGhpcy5lbWl0KCdzZWxlY3QnLCBpbmRleCk7XG4vLyAgIH1cblxuLy8gICByZXNpemUoKSB7XG4vLyAgICAgaWYgKHRoaXMuY29udGFpbmVyKSB7XG4vLyAgICAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IHRoaXMuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuLy8gICAgICAgY29uc3QgY29udGFpbmVySGVpZ2h0ID0gdGhpcy5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuXG4vLyAgICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbi8vICAgICAgIGNvbnN0IHdpZHRoID0gY29udGFpbmVyV2lkdGggKiAyIC8gMztcbi8vICAgICAgIGNvbnN0IGxlZnQgPSBjb250YWluZXJXaWR0aCAvIDMgLyAyO1xuLy8gICAgICAgY29uc3QgdG9wID0gKGNvbnRhaW5lckhlaWdodCAtIGhlaWdodCkgLyAyO1xuXG4vLyAgICAgICB0aGlzLmVsLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbi8vICAgICAgIHRoaXMuZWwuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4vLyAgICAgICB0aGlzLmVsLnN0eWxlLnRvcCA9IHRvcCArICdweCc7XG4vLyAgICAgICB0aGlzLmVsLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcblxuLy8gICAgICAgdGhpcy5zZWxlY3Quc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4vLyAgICAgICB0aGlzLmJ1dHRvbi5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4Jztcbi8vICAgICB9XG4vLyAgIH1cblxuLy8gICBkaXNwbGF5KGNvbnRhaW5lcikge1xuLy8gICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuLy8gICAgIHRoaXMuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuLy8gICAgIHRoaXMuc2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4vLyAgICAgdGhpcy5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbi8vICAgICB0aGlzLmJ1dHRvbi50ZXh0Q29udGVudCA9ICdPSyc7XG4vLyAgICAgdGhpcy5idXR0b24uY2xhc3NMaXN0LmFkZCgnYnRuJyk7XG5cbi8vICAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHRoaXMuc2VsZWN0KTtcbi8vICAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uKTtcbi8vICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcblxuLy8gICAgIHRoaXMuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vblNlbGVjdCwgZmFsc2UpO1xuLy8gICAgIHRoaXMucmVzaXplKCk7XG4vLyAgIH1cblxuLy8gICBkaXNwbGF5UG9zaXRpb25zKGxhYmVscywgY29vcmRpbmF0ZXMsIGNhcGFjaXR5KSB7XG4vLyAgICAgdGhpcy5sYWJlbHMgPSBsYWJlbHM7XG4vLyAgICAgdGhpcy5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4vLyAgICAgZm9yKGxldCBpID0gMDsgaSA8IHBvc2l0aW9ucy5sZW5ndGg7IGkrKykge1xuLy8gICAgICAgY29uc3QgcG9zaXRpb24gPSBwb3NpdGlvbnNbaV07XG4vLyAgICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcblxuLy8gICAgICAgb3B0aW9uLnZhbHVlID0gaTtcbi8vICAgICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IHBvc2l0aW9uLmxhYmVsIHx8IChpICsgMSkudG9TdHJpbmcoKTtcblxuLy8gICAgICAgdGhpcy5zZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbi8vICAgICB9XG4vLyAgIH1cbi8vIH1cblxuXG4vKipcbiAqIFtjbGllbnRdIEFsbG93IHRvIHNlbGVjdCBhIHBsYWNlIHdpdGhpbiBhIHNldCBvZiBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoaS5lLiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyUGxhY2VyLmpzflNlcnZlclBsYWNlcn0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgcGxhY2VyID0gbmV3IENsaWVudFBsYWNlcih7IGNhcGFjaXR5OiAxMDAgfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudFBsYWNlciBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdwZXJmb3JtYW5jZSddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm1vZGU9J2xpc3QnXSBTZWxlY3Rpb24gbW9kZS4gQ2FuIGJlOlxuICAgKiAtIGAnbGlzdCdgIHRvIHNlbGVjdCBhIHBsYWNlIGFtb25nIGEgbGlzdCBvZiBwbGFjZXMuXG4gICAqIC0gYCdncmFwaGljJ2AgdG8gc2VsZWN0IGEgcGxhY2Ugb24gYSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGF2YWlsYWJsZSBwb3NpdGlvbnMuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucGVyc2lzdD1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHNlbGVjdGVkIHBsYWNlIHNob3VsZCBiZSBzdG9yZWQgaW4gdGhlIGBMb2NhbFN0b3JhZ2VgIGZvciBmdXR1cmUgcmV0cmlldmFsIG9yIG5vdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtsb2NhbFN0b3JhZ2VJZD0nc291bmR3b3JrcyddIFByZWZpeCBvZiB0aGUgYExvY2FsU3RvcmFnZWAgSUQuXG4gICAqIEB0b2RvIHRoaXMuc2VsZWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fMKgJ3BsYWNlcicsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5pbmRleCA9IG51bGw7XG4gICAgdGhpcy5sYWJlbCA9IG51bGw7XG5cbiAgICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHzCoCdncmFwaGljJztcbiAgICB0aGlzLnBlcnNpc3QgPSBvcHRpb25zLnBlcnNpc3QgfHzCoGZhbHNlO1xuICAgIHRoaXMubG9jYWxTdG9yYWdlTlMgPSAncGxhY2VyOnBvc2l0aW9uJztcblxuICAgIHRoaXMuX2NyZWF0ZVZpZXcgPSB0aGlzLl9jcmVhdGVWaWV3LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25TZWxlY3QgPSB0aGlzLl9vblNlbGVjdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiA9SW5kZXggb2YgdGhlIHBvc2l0aW9uIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5pbmRleCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICAvLyBjaGVjayBmb3IgaW5mb3JtYXRpb25zIGluIGxvY2FsIHN0b3JhZ2VcbiAgICBpZiAodGhpcy5wZXJzaXN0KSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IGxvY2FsU3RvcmFnZS5nZXQodGhpcy5sb2NhbFN0b3JhZ2VOUyk7XG5cbiAgICAgIGlmIChwb3NpdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9zZW5kUG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgICByZXR1cm4gdGhpcy5kb25lKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmVxdWVzdCBwb3NpdGlvbnMgb3IgbGFiZWxzXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0JywgdGhpcy5tb2RlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3NldHVwJywgdGhpcy5fY3JlYXRlVmlldyk7XG5cbiAgICAvLyBhbGxvdyB0byByZXNldCBsb2NhbFN0b3JhZ2VcbiAgICB0aGlzLnJlY2VpdmUoJ3Jlc2V0JywgKCkgPT4gbG9jYWxTdG9yYWdlLmRlbGV0ZSh0aGlzLmxvY2FsU3RvcmFnZU5TKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydCB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5fc2VuZFBvc2l0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIG1vZHVsZSB0byBpbml0aWFsIHN0YXRlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb25lIG1ldGhvZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRvbmUoKSB7XG4gICAgc3VwZXIuZG9uZSgpO1xuICB9XG5cbiAgX2NyZWF0ZVZpZXcoY2FwYWNpdHksIGxhYmVscywgY29vcmRpbmF0ZXMsIGFyZWEpIHtcbiAgICBjb25zdCBudW1MYWJlbHMgPSBsYWJlbHMgPyBsYWJlbHMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgY29uc3QgbnVtQ29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcyA/IGNvb3JkaW5hdGVzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgIGxldCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcblxuICAgIGlmIChudW1Qb3NpdGlvbnMgPiBjYXBhY2l0eSkge1xuICAgICAgbnVtUG9zaXRpb25zID0gY2FwYWNpdHk7XG4gICAgfVxuXG4gICAgY29uc3QgcG9zaXRpb25zID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVBvc2l0aW9uczsgaSsrKSB7XG4gICAgICBjb25zdCBsYWJlbCA9IGxhYmVsc1tpXSB8fCAoaSArIDEpLnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBjb29yZHMgPSBjb29yZGluYXRlc1tpXTtcblxuICAgICAgLy8gQHRvZG8gLSBkZWZpbmUgaWYgY29vcmRzIHNob3VsZCBiZSBhbiBhcnJheVxuICAgICAgLy8gb3IgYW4gb2JqZWN0IGFuZCBoYXJtb25pemUgd2l0aCBTcGFjZVZpZXcsIExvY2F0b3IsIGV0Yy4uLlxuICAgICAgY29uc3QgcG9zaXRpb24gPSB7XG4gICAgICAgIGlkOiBpLFxuICAgICAgICBpbmRleDogaSxcbiAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICB4OiBjb29yZHNbMF0sXG4gICAgICAgIHk6IGNvb3Jkc1sxXSxcbiAgICAgIH07XG5cbiAgICAgIHBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICAvLyBAdG9kbyAtIHNob3VsZCBoYW5kbGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgb3RoZXIgcGxheWVycyBpbiByZWFsIHRpbWUuXG4gICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgIGNhc2UgJ2dyYXBoaWMnOlxuICAgICAgICAvLyBAdG9kbyBoYW5kbGUgaW5zdHJ1Y3Rpb24gYW5kIGVycm9yIG1lc3NhZ2VzXG4gICAgICAgIHRoaXMudmlldyA9IG5ldyBTcGFjZVZpZXcoYXJlYSk7XG4gICAgICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICAgICAgdGhpcy52aWV3LnNldFBvc2l0aW9ucyhwb3NpdGlvbnMpO1xuICAgICAgICB0aGlzLnZpZXcuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAgICAgJ2NsaWNrIC5wb3NpdGlvbic6IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMudmlldy5zaGFwZVBvc2l0aW9uTWFwLmdldChlLnRhcmdldCk7XG4gICAgICAgICAgICB0aGlzLl9vblNlbGVjdChwb3NpdGlvbik7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy52aWV3LmFwcGVuZFRvKHRoaXMuJGNvbnRhaW5lcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGlzdCc6XG5cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgX29uU2VsZWN0KHBvc2l0aW9uKSB7XG4gICAgLy8gb3B0aW9uYWxseSBzdG9yZSBpbiBsb2NhbCBzdG9yYWdlXG4gICAgaWYgKHRoaXMucGVyc2lzdCkge1xuICAgICAgdGhpcy5fc2V0TG9jYWxTdG9yYWdlKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICAvLyBAdG9kbyBzaG91bGQgaGFuZGxlIHJlamVjdGlvbiBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgLy8gc2VuZCB0byBzZXJ2ZXJcbiAgICB0aGlzLl9zZW5kUG9zaXRpb24ocG9zaXRpb24pO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgX3NlbmRQb3NpdGlvbihwb3NpdGlvbiA9IG51bGwpIHtcbiAgICBpZiAocG9zaXRpb24gIT09IG51bGwpIHtcbiAgICAgIHRoaXMuaW5kZXggPSBwb3NpdGlvbi5pbmRleDtcbiAgICAgIHRoaXMubGFiZWwgPSBwb3NpdGlvbi5sYWJlbDtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IHBvc2l0aW9uLmNvb3JkaW5hdGVzO1xuICAgIH1cblxuICAgIHRoaXMuc2VuZCgncG9zaXRpb24nLCB0aGlzLmluZGV4LCB0aGlzLmxhYmVsLCBjbGllbnQuY29vcmRpbmF0ZXMpO1xuICB9XG59XG4iXX0=