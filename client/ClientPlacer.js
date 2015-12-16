'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

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

var _displaySquaredView = require('./display/SquaredView');

var _displaySquaredView2 = _interopRequireDefault(_displaySquaredView);

var _displayView = require('./display/View');

var _displayView2 = _interopRequireDefault(_displayView);

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

var defaultTemplate = '\n  <option class="small"><%= instructions %></option>\n  <% entries.forEach((entry) => { %>\n    <option value="<%= entry.id %>">\n      <%= entry.label %>\n    </option>\n  <% }) %>\n';

var SelectView = (function (_View) {
  _inherits(SelectView, _View);

  function SelectView(content) {
    var events = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, SelectView);

    options = _Object$assign({ el: 'select', className: 'select' }, options);
    _get(Object.getPrototypeOf(SelectView.prototype), 'constructor', this).call(this, defaultTemplate, content, events, options);
  }

  /**
   * [client] Allow to select a place within a set of predefined positions (i.e. labels and/or coordinates).
   *
   * (See also {@link src/server/ServerPlacer.js~ServerPlacer} on the server side.)
   *
   * @example
   * const placer = new ClientPlacer({ capacity: 100 });
   */

  _createClass(SelectView, [{
    key: 'onResize',
    value: function onResize() {}
  }]);

  return SelectView;
})(_displayView2['default']);

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

    this.init();
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

      this.viewCtor = _displaySquaredView2['default'];
      this.content = {
        mode: this.mode,
        showBtn: false
      };
      this.view = this.createDefaultView();
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

      // reset position stored in local storage
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

        // @todo - define if coords should be an array
        // or an object and harmonize with SpaceView, Locator, etc...
        var position = {
          id: i,
          index: i,
          label: label
        };

        if (coordinates) {
          var coords = coordinates[i];
          position.x = coords[0];
          position.y = coords[1];
        }

        positions.push(position);
      }

      // @todo - should handle position selected by other players in real time.
      switch (this.mode) {
        case 'graphic':
          // @todo handle instruction and error messages
          this.selector = new _displaySpaceView2['default'](area, {}, { isSubView: true });
          this.view.setViewComponent('.section-square', this.selector);
          this.view.render('.section-square');

          this.selector.setPositions(positions);
          this.selector.installEvents({
            'click .position': function clickPosition(e) {
              var position = _this2.selector.shapePositionMap.get(e.target);
              _this2._onSelect(position);
            }
          });
          break;
        case 'list':
          this.selector = new SelectView({
            instructions: this.content.instructions,
            entries: positions
          });
          this.view.setViewComponent('.section-square', this.selector);
          this.view.render('.section-square');

          this.selector.installEvents({
            'click .position': function clickPosition(e) {
              var position = _this2.selector.shapePositionMap.get(e.target);
              _this2._onSelect(position);
            }
          });
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

      // send to server
      this._sendPosition(position);
      // @todo - should handle rejection from the server.
      // `done()` should be called only on server confirmation / aknowledgement.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50UGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7NEJBQ2hCLGdCQUFnQjs7OztnQ0FFbkIscUJBQXFCOzs7O2tDQUNuQix1QkFBdUI7Ozs7MkJBQzlCLGdCQUFnQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyRWpDLElBQU0sZUFBZSw4TEFPcEIsQ0FBQzs7SUFFSSxVQUFVO1lBQVYsVUFBVTs7QUFDSCxXQURQLFVBQVUsQ0FDRixPQUFPLEVBQTZCO1FBQTNCLE1BQU0seURBQUcsRUFBRTtRQUFFLE9BQU8seURBQUcsRUFBRTs7MEJBRDFDLFVBQVU7O0FBRVosV0FBTyxHQUFHLGVBQWMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN4RSwrQkFIRSxVQUFVLDZDQUdOLGVBQWUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtHQUNsRDs7Ozs7Ozs7Ozs7ZUFKRyxVQUFVOztXQU1OLG9CQUFHLEVBQUU7OztTQU5ULFVBQVU7OztJQWlCSyxZQUFZO1lBQVosWUFBWTs7Ozs7Ozs7Ozs7Ozs7QUFZcEIsV0FaUSxZQUFZLEdBWUw7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVpMLFlBQVk7O0FBYTdCLCtCQWJpQixZQUFZLDZDQWF2QixPQUFPLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRSxPQUFPLEVBQUU7O0FBRXpDLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVsQixRQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFDO0FBQ3RD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WTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuaW1wb3J0IGxvY2FsU3RvcmFnZSBmcm9tICcuL2xvY2FsU3RvcmFnZSc7XG5cbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi9kaXNwbGF5L1NwYWNlVmlldyc7XG5pbXBvcnQgU3F1YXJlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NxdWFyZWRWaWV3JztcbmltcG9ydCBWaWV3IGZyb20gJy4vZGlzcGxheS9WaWV3JztcblxuLyoqXG4gKiBEaXNwbGF5IHN0cmF0ZWdpZXMgZm9yIHBsYWNlclxuICogQHByaXZhdGVcbiAqL1xuXG4vLyBleHBvcnQgY2xhc3MgTGlzdFNlbGVjdG9yIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbi8vICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuLy8gICAgIHN1cGVyKCk7XG4vLyAgICAgdGhpcy5sYWJlbHMgPSBbXTtcbi8vICAgICB0aGlzLmNvb3JkaW5hdGVzID0gW107XG4vLyAgICAgdGhpcy5fb25TZWxlY3QgPSB0aGlzLl9vblNlbGVjdC5iaW5kKHRoaXMpO1xuLy8gICB9XG5cbi8vICAgX29uU2VsZWN0KGUpIHtcbi8vICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5zZWxlY3Qub3B0aW9ucztcbi8vICAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gdGhpcy5zZWxlY3Quc2VsZWN0ZWRJbmRleDtcbi8vICAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KG9wdGlvbnNbc2VsZWN0ZWRJbmRleF0udmFsdWUsIDEwKTtcbi8vICAgICB0aGlzLmVtaXQoJ3NlbGVjdCcsIGluZGV4KTtcbi8vICAgfVxuXG4vLyAgIHJlc2l6ZSgpIHtcbi8vICAgICBpZiAodGhpcy5jb250YWluZXIpIHtcbi8vICAgICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gdGhpcy5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4vLyAgICAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSB0aGlzLmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG5cbi8vICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuLy8gICAgICAgY29uc3Qgd2lkdGggPSBjb250YWluZXJXaWR0aCAqIDIgLyAzO1xuLy8gICAgICAgY29uc3QgbGVmdCA9IGNvbnRhaW5lcldpZHRoIC8gMyAvIDI7XG4vLyAgICAgICBjb25zdCB0b3AgPSAoY29udGFpbmVySGVpZ2h0IC0gaGVpZ2h0KSAvIDI7XG5cbi8vICAgICAgIHRoaXMuZWwuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuLy8gICAgICAgdGhpcy5lbC5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4Jztcbi8vICAgICAgIHRoaXMuZWwuc3R5bGUudG9wID0gdG9wICsgJ3B4Jztcbi8vICAgICAgIHRoaXMuZWwuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuXG4vLyAgICAgICB0aGlzLnNlbGVjdC5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4Jztcbi8vICAgICAgIHRoaXMuYnV0dG9uLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuLy8gICAgIH1cbi8vICAgfVxuXG4vLyAgIGRpc3BsYXkoY29udGFpbmVyKSB7XG4vLyAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4vLyAgICAgdGhpcy5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4vLyAgICAgdGhpcy5zZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbi8vICAgICB0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuLy8gICAgIHRoaXMuYnV0dG9uLnRleHRDb250ZW50ID0gJ09LJztcbi8vICAgICB0aGlzLmJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKTtcblxuLy8gICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5zZWxlY3QpO1xuLy8gICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5idXR0b24pO1xuLy8gICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuXG4vLyAgICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX29uU2VsZWN0LCBmYWxzZSk7XG4vLyAgICAgdGhpcy5yZXNpemUoKTtcbi8vICAgfVxuXG4vLyAgIGRpc3BsYXlQb3NpdGlvbnMobGFiZWxzLCBjb29yZGluYXRlcywgY2FwYWNpdHkpIHtcbi8vICAgICB0aGlzLmxhYmVscyA9IGxhYmVscztcbi8vICAgICB0aGlzLmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbi8vICAgICBmb3IobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zLmxlbmd0aDsgaSsrKSB7XG4vLyAgICAgICBjb25zdCBwb3NpdGlvbiA9IHBvc2l0aW9uc1tpXTtcbi8vICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuXG4vLyAgICAgICBvcHRpb24udmFsdWUgPSBpO1xuLy8gICAgICAgb3B0aW9uLnRleHRDb250ZW50ID0gcG9zaXRpb24ubGFiZWwgfHwgKGkgKyAxKS50b1N0cmluZygpO1xuXG4vLyAgICAgICB0aGlzLnNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xuLy8gICAgIH1cbi8vICAgfVxuLy8gfVxuXG5jb25zdCBkZWZhdWx0VGVtcGxhdGUgPSBgXG4gIDxvcHRpb24gY2xhc3M9XCJzbWFsbFwiPjwlPSBpbnN0cnVjdGlvbnMgJT48L29wdGlvbj5cbiAgPCUgZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4geyAlPlxuICAgIDxvcHRpb24gdmFsdWU9XCI8JT0gZW50cnkuaWQgJT5cIj5cbiAgICAgIDwlPSBlbnRyeS5sYWJlbCAlPlxuICAgIDwvb3B0aW9uPlxuICA8JSB9KSAlPlxuYDtcblxuY2xhc3MgU2VsZWN0VmlldyBleHRlbmRzIFZpZXcge1xuICBjb25zdHJ1Y3Rvcihjb250ZW50LCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBlbDogJ3NlbGVjdCcsIGNsYXNzTmFtZTogJ3NlbGVjdCcgfSwgb3B0aW9ucyk7XG4gICAgc3VwZXIoZGVmYXVsdFRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuICB9XG5cbiAgb25SZXNpemUoKSB7fVxufVxuXG4vKipcbiAqIFtjbGllbnRdIEFsbG93IHRvIHNlbGVjdCBhIHBsYWNlIHdpdGhpbiBhIHNldCBvZiBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoaS5lLiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyUGxhY2VyLmpzflNlcnZlclBsYWNlcn0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgcGxhY2VyID0gbmV3IENsaWVudFBsYWNlcih7IGNhcGFjaXR5OiAxMDAgfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudFBsYWNlciBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdwZXJmb3JtYW5jZSddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm1vZGU9J2xpc3QnXSBTZWxlY3Rpb24gbW9kZS4gQ2FuIGJlOlxuICAgKiAtIGAnbGlzdCdgIHRvIHNlbGVjdCBhIHBsYWNlIGFtb25nIGEgbGlzdCBvZiBwbGFjZXMuXG4gICAqIC0gYCdncmFwaGljJ2AgdG8gc2VsZWN0IGEgcGxhY2Ugb24gYSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGF2YWlsYWJsZSBwb3NpdGlvbnMuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucGVyc2lzdD1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHNlbGVjdGVkIHBsYWNlIHNob3VsZCBiZSBzdG9yZWQgaW4gdGhlIGBMb2NhbFN0b3JhZ2VgIGZvciBmdXR1cmUgcmV0cmlldmFsIG9yIG5vdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtsb2NhbFN0b3JhZ2VJZD0nc291bmR3b3JrcyddIFByZWZpeCBvZiB0aGUgYExvY2FsU3RvcmFnZWAgSUQuXG4gICAqIEB0b2RvIHRoaXMuc2VsZWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fMKgJ3BsYWNlcicsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5pbmRleCA9IG51bGw7XG4gICAgdGhpcy5sYWJlbCA9IG51bGw7XG5cbiAgICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHzCoCdncmFwaGljJztcbiAgICB0aGlzLnBlcnNpc3QgPSBvcHRpb25zLnBlcnNpc3QgfHzCoGZhbHNlO1xuICAgIHRoaXMubG9jYWxTdG9yYWdlTlMgPSAncGxhY2VyOnBvc2l0aW9uJztcblxuICAgIHRoaXMuX2NyZWF0ZVZpZXcgPSB0aGlzLl9jcmVhdGVWaWV3LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25TZWxlY3QgPSB0aGlzLl9vblNlbGVjdC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIC8qKlxuICAgICAqIEluZGV4IG9mIHRoZSBwb3NpdGlvbiBzZWxlY3RlZCBieSB0aGUgdXNlci5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaW5kZXggPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTGFiZWwgb2YgdGhlIHBvc2l0aW9uIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5sYWJlbCA9IG51bGw7XG5cbiAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBudWxsO1xuXG4gICAgdGhpcy52aWV3Q3RvciA9IFNxdWFyZWRWaWV3O1xuICAgIHRoaXMuY29udGVudCA9IHtcbiAgICAgIG1vZGU6IHRoaXMubW9kZSxcbiAgICAgIHNob3dCdG46IGZhbHNlLFxuICAgIH07XG4gICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVEZWZhdWx0VmlldygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIC8vIGNoZWNrIGZvciBpbmZvcm1hdGlvbnMgaW4gbG9jYWwgc3RvcmFnZVxuICAgIGlmICh0aGlzLnBlcnNpc3QpIHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gbG9jYWxTdG9yYWdlLmdldCh0aGlzLmxvY2FsU3RvcmFnZU5TKTtcblxuICAgICAgaWYgKHBvc2l0aW9uICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3NlbmRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICAgIHJldHVybiB0aGlzLmRvbmUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXF1ZXN0IHBvc2l0aW9ucyBvciBsYWJlbHNcbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnLCB0aGlzLm1vZGUpO1xuICAgIHRoaXMucmVjZWl2ZSgnc2V0dXAnLCB0aGlzLl9jcmVhdGVWaWV3KTtcblxuICAgIC8vIHJlc2V0IHBvc2l0aW9uIHN0b3JlZCBpbiBsb2NhbCBzdG9yYWdlXG4gICAgdGhpcy5yZWNlaXZlKCdyZXNldCcsICgpID0+IGxvY2FsU3RvcmFnZS5kZWxldGUodGhpcy5sb2NhbFN0b3JhZ2VOUykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnQgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuX3NlbmRQb3NpdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBtb2R1bGUgdG8gaW5pdGlhbCBzdGF0ZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIHN1cGVyLnJlc2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogRG9uZSBtZXRob2QuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkb25lKCkge1xuICAgIHN1cGVyLmRvbmUoKTtcbiAgfVxuXG4gIF9jcmVhdGVWaWV3KGNhcGFjaXR5LCBsYWJlbHMsIGNvb3JkaW5hdGVzLCBhcmVhKSB7XG4gICAgY29uc3QgbnVtTGFiZWxzID0gbGFiZWxzID8gbGFiZWxzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgIGNvbnN0IG51bUNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXMgPyBjb29yZGluYXRlcy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICBsZXQgbnVtUG9zaXRpb25zID0gTWF0aC5taW4obnVtTGFiZWxzLCBudW1Db29yZGluYXRlcyk7XG5cbiAgICBpZiAobnVtUG9zaXRpb25zID4gY2FwYWNpdHkpIHsgbnVtUG9zaXRpb25zID0gY2FwYWNpdHk7IH1cblxuICAgIGNvbnN0IHBvc2l0aW9ucyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Qb3NpdGlvbnM7IGkrKykge1xuICAgICAgY29uc3QgbGFiZWwgPSBsYWJlbHNbaV0gfHwgKGkgKyAxKS50b1N0cmluZygpO1xuXG4gICAgICAvLyBAdG9kbyAtIGRlZmluZSBpZiBjb29yZHMgc2hvdWxkIGJlIGFuIGFycmF5XG4gICAgICAvLyBvciBhbiBvYmplY3QgYW5kIGhhcm1vbml6ZSB3aXRoIFNwYWNlVmlldywgTG9jYXRvciwgZXRjLi4uXG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHtcbiAgICAgICAgaWQ6IGksXG4gICAgICAgIGluZGV4OiBpLFxuICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICB9O1xuXG4gICAgICBpZiAoY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgY29uc3QgY29vcmRzID0gY29vcmRpbmF0ZXNbaV07XG4gICAgICAgIHBvc2l0aW9uLnggPSBjb29yZHNbMF07XG4gICAgICAgIHBvc2l0aW9uLnkgPSBjb29yZHNbMV07XG4gICAgICB9XG5cbiAgICAgIHBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICAvLyBAdG9kbyAtIHNob3VsZCBoYW5kbGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgb3RoZXIgcGxheWVycyBpbiByZWFsIHRpbWUuXG4gICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgIGNhc2UgJ2dyYXBoaWMnOlxuICAgICAgICAvLyBAdG9kbyBoYW5kbGUgaW5zdHJ1Y3Rpb24gYW5kIGVycm9yIG1lc3NhZ2VzXG4gICAgICAgIHRoaXMuc2VsZWN0b3IgPSBuZXcgU3BhY2VWaWV3KGFyZWEsIHt9LCB7IGlzU3ViVmlldzogdHJ1ZSB9KTtcbiAgICAgICAgdGhpcy52aWV3LnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc2VsZWN0b3IpO1xuICAgICAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcblxuICAgICAgICB0aGlzLnNlbGVjdG9yLnNldFBvc2l0aW9ucyhwb3NpdGlvbnMpO1xuICAgICAgICB0aGlzLnNlbGVjdG9yLmluc3RhbGxFdmVudHMoe1xuICAgICAgICAgICdjbGljayAucG9zaXRpb24nOiAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNlbGVjdG9yLnNoYXBlUG9zaXRpb25NYXAuZ2V0KGUudGFyZ2V0KTtcbiAgICAgICAgICAgIHRoaXMuX29uU2VsZWN0KHBvc2l0aW9uKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsaXN0JzpcbiAgICAgICAgdGhpcy5zZWxlY3RvciA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgICAgICBpbnN0cnVjdGlvbnM6IHRoaXMuY29udGVudC5pbnN0cnVjdGlvbnMsXG4gICAgICAgICAgZW50cmllczogcG9zaXRpb25zLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy52aWV3LnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc2VsZWN0b3IpO1xuICAgICAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcblxuICAgICAgICB0aGlzLnNlbGVjdG9yLmluc3RhbGxFdmVudHMoe1xuICAgICAgICAgICdjbGljayAucG9zaXRpb24nOiAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNlbGVjdG9yLnNoYXBlUG9zaXRpb25NYXAuZ2V0KGUudGFyZ2V0KTtcbiAgICAgICAgICAgIHRoaXMuX29uU2VsZWN0KHBvc2l0aW9uKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgX29uU2VsZWN0KHBvc2l0aW9uKSB7XG4gICAgLy8gb3B0aW9uYWxseSBzdG9yZSBpbiBsb2NhbCBzdG9yYWdlXG4gICAgaWYgKHRoaXMucGVyc2lzdCkge1xuICAgICAgdGhpcy5fc2V0TG9jYWxTdG9yYWdlKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICAvLyBzZW5kIHRvIHNlcnZlclxuICAgIHRoaXMuX3NlbmRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgLy8gQHRvZG8gLSBzaG91bGQgaGFuZGxlIHJlamVjdGlvbiBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgLy8gYGRvbmUoKWAgc2hvdWxkIGJlIGNhbGxlZCBvbmx5IG9uIHNlcnZlciBjb25maXJtYXRpb24gLyBha25vd2xlZGdlbWVudC5cbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIF9zZW5kUG9zaXRpb24ocG9zaXRpb24gPSBudWxsKSB7XG4gICAgaWYgKHBvc2l0aW9uICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmluZGV4ID0gcG9zaXRpb24uaW5kZXg7XG4gICAgICB0aGlzLmxhYmVsID0gcG9zaXRpb24ubGFiZWw7XG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBwb3NpdGlvbi5jb29yZGluYXRlcztcbiAgICB9XG5cbiAgICB0aGlzLnNlbmQoJ3Bvc2l0aW9uJywgdGhpcy5pbmRleCwgdGhpcy5sYWJlbCwgY2xpZW50LmNvb3JkaW5hdGVzKTtcbiAgfVxufVxuIl19