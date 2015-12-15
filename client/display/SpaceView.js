'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

var template = '<svg id="scene"></svg>';
var ns = 'http://www.w3.org/2000/svg';

var SpaceView = (function (_View) {
  _inherits(SpaceView, _View);

  /**
   * Returns a new space instance.
   * @param {Object} area - The area to represent, should be defined by a `width`, an `height` and an optionnal background.
   * @param {Object} events - The events to attach to the view.
   * @param {Object} options - @todo
   * @param {Object} [options.isSubView=false] - Don't automatically position the view inside it's container (is needed when inserted in a module with css flex behavior).
   * @todo - `options.isSubView` should be removed and handled through css flex.
   */

  function SpaceView(area) {
    var events = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, SpaceView);

    options = _Object$assign({ className: 'space' }, options);
    _get(Object.getPrototypeOf(SpaceView.prototype), 'constructor', this).call(this, template, {}, events, options);

    /**
     * The area to display.
     * @type {Object}
     */
    this.area = area;

    /**
     * Expose a Map of the $shapes and their relative position object.
     * @type {Map}
     */
    this.shapePositionMap = new _Map();

    this._renderedPositions = new _Map();
    this._isSubView = options.isSubView || false;
  }

  /**
   * Apply style and cache elements when rendered.
   * @private
   */

  _createClass(SpaceView, [{
    key: 'onRender',
    value: function onRender() {
      this.$svg = this.$el.querySelector('#scene');
    }

    /**
     * Update the area when inserted in the DOM.
     * @private
     */
  }, {
    key: 'onShow',
    value: function onShow() {
      this._setArea();
    }

    /**
     * Update the area when inserted in the DOM.
     * @private
     */
  }, {
    key: 'onResize',
    value: function onResize(orientation, width, height) {
      _get(Object.getPrototypeOf(SpaceView.prototype), 'onResize', this).call(this, orientation, width, height);
      // this.$el.style.width = '100%';
      // this.$el.style.height = '100%';

      this._setArea();
    }

    /**
     * The method used to render a specific position. This method should be overriden to display a position with a user defined shape.
     * @param {Object} pos - The position to render.
     * @param {String|Number} pos.id - An unique identifier for the position.
     * @param {Number} pos.x - The position in the x axis in the area cordinate system.
     * @param {Number} pos.y - The position in the y axis in the area cordinate system.
     * @param {Number} [pos.radius=0.3] - The radius of the position (relative to the area width and height).
     */
  }, {
    key: 'renderPosition',
    value: function renderPosition(pos) {
      var $shape = document.createElementNS(ns, 'circle');
      $shape.classList.add('position');

      $shape.setAttribute('data-id', pos.id);
      $shape.setAttribute('cx', '' + pos.x);
      $shape.setAttribute('cy', '' + pos.y);
      $shape.setAttribute('r', pos.radius || 0.3); // radius is relative to area size
      if (pos.selected) {
        $shape.classList.add('selected');
      }

      return $shape;
    }

    /**
     * Render the area.
     * @private
     */
  }, {
    key: '_setArea',
    value: function _setArea() {
      if (!this.$parent) {
        return;
      }

      var area = this.area;
      // use `this.$el` size instead of `this.$parent` size to ignore parent padding
      var boundingRect = this.$el.getBoundingClientRect();
      var containerWidth = boundingRect.width;
      var containerHeight = boundingRect.height;

      var ratio = (function () {
        return containerWidth < containerHeight ? containerWidth / area.width : containerHeight / area.height;
      })();

      var svgWidth = area.width * ratio;
      var svgHeight = area.height * ratio;

      this.$svg.setAttribute('width', svgWidth);
      this.$svg.setAttribute('height', svgHeight);
      this.$svg.setAttribute('viewBox', '0 0 ' + area.width + ' ' + area.height);
      // center the svg into the parent
      this.$svg.style.position = 'relative';

      // be consistant with module flex css
      // const test = this.$svg.getBoundingClientRect();
      if (!this._isSubView) {
        this.$svg.style.left = (containerWidth - svgWidth) / 2 + 'px';
        this.$svg.style.top = (containerHeight - svgHeight) / 2 + 'px';
      }

      // display background if any
      if (area.background) {
        this.$el.style.backgroundImage = area.background;
        this.$el.style.backgroundPosition = '50% 50%';
        this.$el.style.backgroundRepeat = 'no-repeat';
        this.$el.style.backgroundSize = 'cover';
      }
    }

    /**
     * Replace all the existing positions with the given array of position.
     * @param {Array<Object>} positions - The new positions to render.
     */
  }, {
    key: 'setPositions',
    value: function setPositions(positions) {
      this.clearPositions();
      this.addPositions(positions);
    }

    /**
     * Clear all the displayed positions.
     */
  }, {
    key: 'clearPositions',
    value: function clearPositions() {
      var keys = this._renderedPositions.keys();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(keys), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var id = _step.value;

          this.deletePosition(id);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * Add new positions to the area.
     * @param {Array<Object>} positions - The new positions to render.
     */
  }, {
    key: 'addPositions',
    value: function addPositions(positions) {
      var _this = this;

      positions.forEach(function (pos) {
        return _this.addPosition(pos);
      });
    }

    /**
     * Add a new position to the area.
     * @param {Object} pos - The new position to render.
     */
  }, {
    key: 'addPosition',
    value: function addPosition(pos) {
      var $shape = this.renderPosition(pos);
      this.$svg.appendChild($shape);
      this._renderedPositions.set(pos.id, $shape);
      // map for easier retrieving of the position
      this.shapePositionMap.set($shape, pos);
    }

    /**
     * Update a rendered position.
     * @param {Object} pos - The position to update.
     */
  }, {
    key: 'updatePosition',
    value: function updatePosition(pos) {
      var $shape = this._renderedPositions.get(pos.id);

      $shape.setAttribute('cx', '' + pos.x);
      $shape.setAttribute('cy', '' + pos.y);
      $shape.setAttribute('r', pos.radius || 0.3);
    }

    /**
     * Remove a rendered position.
     * @param {String|Number} id - The position to delete.
     */
  }, {
    key: 'deletePosition',
    value: function deletePosition(id) {
      var $shape = this._renderedPositions.get(id);
      this.$svg.removechild($shape);
      this._renderedPositions['delete'](id);
      // map for easier retrieving of the position
      this.shapePositionMap['delete']($shape);
    }
  }]);

  return SpaceView;
})(_View3['default']);

exports['default'] = SpaceView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TcGFjZVZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFBaUIsUUFBUTs7OztBQUV6QixJQUFNLFFBQVEsMkJBQTJCLENBQUM7QUFDMUMsSUFBTSxFQUFFLEdBQUcsNEJBQTRCLENBQUM7O0lBR25CLFNBQVM7WUFBVCxTQUFTOzs7Ozs7Ozs7OztBQVNqQixXQVRRLFNBQVMsQ0FTaEIsSUFBSSxFQUE2QjtRQUEzQixNQUFNLHlEQUFHLEVBQUU7UUFBRSxPQUFPLHlEQUFHLEVBQUU7OzBCQVR4QixTQUFTOztBQVUxQixXQUFPLEdBQUcsZUFBYyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6RCwrQkFYaUIsU0FBUyw2Q0FXcEIsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFOzs7Ozs7QUFNckMsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Ozs7OztBQU1qQixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsVUFBUyxDQUFDOztBQUVsQyxRQUFJLENBQUMsa0JBQWtCLEdBQUcsVUFBUyxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFNBQVMsSUFBSSxLQUFLLENBQUM7R0FDOUM7Ozs7Ozs7ZUEzQmtCLFNBQVM7O1dBaUNwQixvQkFBRztBQUNULFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDOUM7Ozs7Ozs7O1dBTUssa0JBQUc7QUFDUCxVQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDakI7Ozs7Ozs7O1dBTU8sa0JBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDbkMsaUNBbERpQixTQUFTLDBDQWtEWCxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTs7OztBQUkzQyxVQUFJLENB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LE9BQUssR0FBRyxDQUFDLENBQUMsQ0FBRyxDQUFDO0FBQ3RDLFlBQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUM7S0FDN0M7Ozs7Ozs7O1dBTWEsd0JBQUMsRUFBRSxFQUFFO0FBQ2pCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDL0MsVUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsVUFBSSxDQUFDLGtCQUFrQixVQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRW5DLFVBQUksQ0FBQyxnQkFBZ0IsVUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3RDOzs7U0F4TGtCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6InNyYy9jbGllbnQvZGlzcGxheS9TcGFjZVZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcnO1xuXG5jb25zdCB0ZW1wbGF0ZSA9IGA8c3ZnIGlkPVwic2NlbmVcIj48L3N2Zz5gO1xuY29uc3QgbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwYWNlVmlldyBleHRlbmRzIFZpZXcge1xuICAvKipcbiAgICogUmV0dXJucyBhIG5ldyBzcGFjZSBpbnN0YW5jZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFyZWEgLSBUaGUgYXJlYSB0byByZXByZXNlbnQsIHNob3VsZCBiZSBkZWZpbmVkIGJ5IGEgYHdpZHRoYCwgYW4gYGhlaWdodGAgYW5kIGFuIG9wdGlvbm5hbCBiYWNrZ3JvdW5kLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnRzIC0gVGhlIGV2ZW50cyB0byBhdHRhY2ggdG8gdGhlIHZpZXcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQHRvZG9cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmlzU3ViVmlldz1mYWxzZV0gLSBEb24ndCBhdXRvbWF0aWNhbGx5IHBvc2l0aW9uIHRoZSB2aWV3IGluc2lkZSBpdCdzIGNvbnRhaW5lciAoaXMgbmVlZGVkIHdoZW4gaW5zZXJ0ZWQgaW4gYSBtb2R1bGUgd2l0aCBjc3MgZmxleCBiZWhhdmlvcikuXG4gICAqIEB0b2RvIC0gYG9wdGlvbnMuaXNTdWJWaWV3YCBzaG91bGQgYmUgcmVtb3ZlZCBhbmQgaGFuZGxlZCB0aHJvdWdoIGNzcyBmbGV4LlxuICAgKi9cbiAgY29uc3RydWN0b3IoYXJlYSwgZXZlbnRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgY2xhc3NOYW1lOiAnc3BhY2UnIH0sIG9wdGlvbnMpO1xuICAgIHN1cGVyKHRlbXBsYXRlLCB7fSwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhcmVhIHRvIGRpc3BsYXkuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmFyZWEgPSBhcmVhO1xuXG4gICAgLyoqXG4gICAgICogRXhwb3NlIGEgTWFwIG9mIHRoZSAkc2hhcGVzIGFuZCB0aGVpciByZWxhdGl2ZSBwb3NpdGlvbiBvYmplY3QuXG4gICAgICogQHR5cGUge01hcH1cbiAgICAgKi9cbiAgICB0aGlzLnNoYXBlUG9zaXRpb25NYXAgPSBuZXcgTWFwKCk7XG5cbiAgICB0aGlzLl9yZW5kZXJlZFBvc2l0aW9ucyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9pc1N1YlZpZXcgPSBvcHRpb25zLmlzU3ViVmlldyB8fMKgZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgc3R5bGUgYW5kIGNhY2hlIGVsZW1lbnRzIHdoZW4gcmVuZGVyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvblJlbmRlcigpIHtcbiAgICB0aGlzLiRzdmcgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcjc2NlbmUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGFyZWEgd2hlbiBpbnNlcnRlZCBpbiB0aGUgRE9NLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25TaG93KCkge1xuICAgIHRoaXMuX3NldEFyZWEoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGFyZWEgd2hlbiBpbnNlcnRlZCBpbiB0aGUgRE9NLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25SZXNpemUob3JpZW50YXRpb24sIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBzdXBlci5vblJlc2l6ZShvcmllbnRhdGlvbiwgd2lkdGgsIGhlaWdodCk7XG4gICAgLy8gdGhpcy4kZWwuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgLy8gdGhpcy4kZWwuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuXG4gICAgdGhpcy5fc2V0QXJlYSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgdXNlZCB0byByZW5kZXIgYSBzcGVjaWZpYyBwb3NpdGlvbi4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlIG92ZXJyaWRlbiB0byBkaXNwbGF5IGEgcG9zaXRpb24gd2l0aCBhIHVzZXIgZGVmaW5lZCBzaGFwZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBvcyAtIFRoZSBwb3NpdGlvbiB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gcG9zLmlkIC0gQW4gdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvcy54IC0gVGhlIHBvc2l0aW9uIGluIHRoZSB4IGF4aXMgaW4gdGhlIGFyZWEgY29yZGluYXRlIHN5c3RlbS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvcy55IC0gVGhlIHBvc2l0aW9uIGluIHRoZSB5IGF4aXMgaW4gdGhlIGFyZWEgY29yZGluYXRlIHN5c3RlbS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwb3MucmFkaXVzPTAuM10gLSBUaGUgcmFkaXVzIG9mIHRoZSBwb3NpdGlvbiAocmVsYXRpdmUgdG8gdGhlIGFyZWEgd2lkdGggYW5kIGhlaWdodCkuXG4gICAqL1xuICByZW5kZXJQb3NpdGlvbihwb3MpIHtcbiAgICBjb25zdCAkc2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdjaXJjbGUnKTtcbiAgICAkc2hhcGUuY2xhc3NMaXN0LmFkZCgncG9zaXRpb24nKTtcblxuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBwb3MuaWQpO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N4JywgYCR7cG9zLnh9YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnY3knLCBgJHtwb3MueX1gKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdyJywgcG9zLnJhZGl1cyB8fMKgMC4zKTsgLy8gcmFkaXVzIGlzIHJlbGF0aXZlIHRvIGFyZWEgc2l6ZVxuICAgIGlmIChwb3Muc2VsZWN0ZWQpIHsgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7IH1cblxuICAgIHJldHVybiAkc2hhcGU7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBhcmVhLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3NldEFyZWEoKSB7XG4gICAgaWYgKCF0aGlzLiRwYXJlbnQpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBhcmVhID0gdGhpcy5hcmVhO1xuICAgIC8vIHVzZSBgdGhpcy4kZWxgIHNpemUgaW5zdGVhZCBvZiBgdGhpcy4kcGFyZW50YCBzaXplIHRvIGlnbm9yZSBwYXJlbnQgcGFkZGluZ1xuICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IGJvdW5kaW5nUmVjdC5oZWlnaHQ7XG5cblxuICAgIGNvbnN0IHJhdGlvID0gKCgpID0+IHtcbiAgICAgIHJldHVybiAoY29udGFpbmVyV2lkdGggPCBjb250YWluZXJIZWlnaHQpID9cbiAgICAgICAgY29udGFpbmVyV2lkdGggLyBhcmVhLndpZHRoIDpcbiAgICAgICAgY29udGFpbmVySGVpZ2h0IC8gYXJlYS5oZWlnaHQ7XG4gICAgfSkoKTtcblxuICAgIGNvbnN0IHN2Z1dpZHRoID0gYXJlYS53aWR0aCAqIHJhdGlvO1xuICAgIGNvbnN0IHN2Z0hlaWdodCA9IGFyZWEuaGVpZ2h0ICogcmF0aW87XG5cbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHN2Z1dpZHRoKTtcbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBzdmdIZWlnaHQpO1xuICAgIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBgMCAwICR7YXJlYS53aWR0aH0gJHthcmVhLmhlaWdodH1gKTtcbiAgICAvLyBjZW50ZXIgdGhlIHN2ZyBpbnRvIHRoZSBwYXJlbnRcbiAgICB0aGlzLiRzdmcuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuXG4gICAgLy8gYmUgY29uc2lzdGFudCB3aXRoIG1vZHVsZSBmbGV4IGNzc1xuICAgIC8vIGNvbnN0IHRlc3QgPSB0aGlzLiRzdmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKCF0aGlzLl9pc1N1YlZpZXcpIHtcbiAgICAgIHRoaXMuJHN2Zy5zdHlsZS5sZWZ0ID0gYCR7KGNvbnRhaW5lcldpZHRoIC0gc3ZnV2lkdGgpIC8gMn1weGA7XG4gICAgICB0aGlzLiRzdmcuc3R5bGUudG9wID0gYCR7KGNvbnRhaW5lckhlaWdodCAtIHN2Z0hlaWdodCkgLyAyfXB4YDtcbiAgICB9XG5cbiAgICAvLyBkaXNwbGF5IGJhY2tncm91bmQgaWYgYW55XG4gICAgaWYgKGFyZWEuYmFja2dyb3VuZCkge1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYXJlYS5iYWNrZ3JvdW5kO1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gJzUwJSA1MCUnO1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZFJlcGVhdCA9ICduby1yZXBlYXQnO1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZFNpemUgPSAnY292ZXInO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGFsbCB0aGUgZXhpc3RpbmcgcG9zaXRpb25zIHdpdGggdGhlIGdpdmVuIGFycmF5IG9mIHBvc2l0aW9uLlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHBvc2l0aW9ucyAtIFRoZSBuZXcgcG9zaXRpb25zIHRvIHJlbmRlci5cbiAgICovXG4gIHNldFBvc2l0aW9ucyhwb3NpdGlvbnMpIHtcbiAgICB0aGlzLmNsZWFyUG9zaXRpb25zKClcbiAgICB0aGlzLmFkZFBvc2l0aW9ucyhwb3NpdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIGFsbCB0aGUgZGlzcGxheWVkIHBvc2l0aW9ucy5cbiAgICovXG4gIGNsZWFyUG9zaXRpb25zKCkge1xuICAgIGNvbnN0IGtleXMgPSB0aGlzLl9yZW5kZXJlZFBvc2l0aW9ucy5rZXlzKCk7XG4gICAgZm9yIChsZXQgaWQgb2Yga2V5cykge1xuICAgICAgdGhpcy5kZWxldGVQb3NpdGlvbihpZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBuZXcgcG9zaXRpb25zIHRvIHRoZSBhcmVhLlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHBvc2l0aW9ucyAtIFRoZSBuZXcgcG9zaXRpb25zIHRvIHJlbmRlci5cbiAgICovXG4gIGFkZFBvc2l0aW9ucyhwb3NpdGlvbnMpIHtcbiAgICBwb3NpdGlvbnMuZm9yRWFjaChwb3MgPT4gdGhpcy5hZGRQb3NpdGlvbihwb3MpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgcG9zaXRpb24gdG8gdGhlIGFyZWEuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb3MgLSBUaGUgbmV3IHBvc2l0aW9uIHRvIHJlbmRlci5cbiAgICovXG4gIGFkZFBvc2l0aW9uKHBvcykge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMucmVuZGVyUG9zaXRpb24ocG9zKTtcbiAgICB0aGlzLiRzdmcuYXBwZW5kQ2hpbGQoJHNoYXBlKTtcbiAgICB0aGlzLl9yZW5kZXJlZFBvc2l0aW9ucy5zZXQocG9zLmlkLCAkc2hhcGUpO1xuICAgIC8vIG1hcCBmb3IgZWFzaWVyIHJldHJpZXZpbmcgb2YgdGhlIHBvc2l0aW9uXG4gICAgdGhpcy5zaGFwZVBvc2l0aW9uTWFwLnNldCgkc2hhcGUsIHBvcyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGEgcmVuZGVyZWQgcG9zaXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb3MgLSBUaGUgcG9zaXRpb24gdG8gdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlUG9zaXRpb24ocG9zKSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRQb3NpdGlvbnMuZ2V0KHBvcy5pZCk7XG5cbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeCcsIGAke3Bvcy54fWApO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N5JywgYCR7cG9zLnl9YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncicsIHBvcy5yYWRpdXMgfHzCoDAuMyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgcmVuZGVyZWQgcG9zaXRpb24uXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gaWQgLSBUaGUgcG9zaXRpb24gdG8gZGVsZXRlLlxuICAgKi9cbiAgZGVsZXRlUG9zaXRpb24oaWQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZFBvc2l0aW9ucy5nZXQoaWQpO1xuICAgIHRoaXMuJHN2Zy5yZW1vdmVjaGlsZCgkc2hhcGUpO1xuICAgIHRoaXMuX3JlbmRlcmVkUG9zaXRpb25zLmRlbGV0ZShpZCk7XG4gICAgLy8gbWFwIGZvciBlYXNpZXIgcmV0cmlldmluZyBvZiB0aGUgcG9zaXRpb25cbiAgICB0aGlzLnNoYXBlUG9zaXRpb25NYXAuZGVsZXRlKCRzaGFwZSk7XG4gIH1cbn1cbiJdfQ==