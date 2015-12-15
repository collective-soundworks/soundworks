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
   */

  function SpaceView(area) {
    var events = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, SpaceView);

    options = _Object$assign({ className: 'space' }, options);
    _get(Object.getPrototypeOf(SpaceView.prototype), 'constructor', this).call(this, template, {}, events, options);

    this.area = area;
    this._renderedPositions = new _Map();
  }

  /**
   * Apply style and cache elements when rendered.
   * @private
   */

  _createClass(SpaceView, [{
    key: 'onRender',
    value: function onRender() {
      this.$el.style.width = '100%';
      this.$el.style.height = '100%';

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
      // use `this.el` size instead of `this.$parent` size
      var boundingRect = this.$el.getBoundingClientRect();
      var containerWidth = boundingRect.width;
      var containerHeight = boundingRect.height;

      var ratio = (function () {
        return area.width > area.height ? containerWidth / area.width : containerHeight / area.height;
      })();

      var svgWidth = area.width * ratio;
      var svgHeight = area.height * ratio;

      this.$svg.setAttribute('width', svgWidth);
      this.$svg.setAttribute('height', svgHeight);
      this.$svg.setAttribute('viewBox', '0 0 ' + area.width + ' ' + area.height);
      // center the svg into the parent
      this.$svg.style.position = 'relative';

      // be consistant with module flex css
      var test = this.$svg.getBoundingClientRect();

      if (test.left === 0) {
        this.$svg.style.left = (containerWidth - svgWidth) / 2 + 'px';
      }

      if (test.top === 0) {
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
    }
  }]);

  return SpaceView;
})(_View3['default']);

exports['default'] = SpaceView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TcGFjZVZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFBaUIsUUFBUTs7OztBQUV6QixJQUFNLFFBQVEsMkJBQTJCLENBQUM7QUFDMUMsSUFBTSxFQUFFLEdBQUcsNEJBQTRCLENBQUM7O0lBR25CLFNBQVM7WUFBVCxTQUFTOzs7Ozs7Ozs7QUFPakIsV0FQUSxTQUFTLENBT2hCLElBQUksRUFBNkI7UUFBM0IsTUFBTSx5REFBRyxFQUFFO1FBQUUsT0FBTyx5REFBRyxFQUFFOzswQkFQeEIsU0FBUzs7QUFRMUIsV0FBTyxHQUFHLGVBQWMsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekQsK0JBVGlCLFNBQVMsNkNBU3BCLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTs7QUFFckMsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLGtCQUFrQixHQUFHLFVBQVMsQ0FBQztHQUNyQzs7Ozs7OztlQWJrQixTQUFTOztXQW1CcEIsb0JBQUc7QUFDVCxVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO0FBQzlCLFVBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBRS9CLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDOUM7Ozs7Ozs7O1dBTUssa0JBQUc7QUFDUCxVQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDakI7Ozs7Ozs7O1dBTU8sa0JBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDbkMsVUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ2pCOzs7Ozs7Ozs7Ozs7V0FVYSx3QkFBQyxHQUFHLEVB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QUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUM7S0FDN0M7Ozs7Ozs7O1dBTWEsd0JBQUMsRUFBRSxFQUFFO0FBQ2pCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDL0MsVUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsVUFBSSxDQUFDLGtCQUFrQixVQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDcEM7OztTQXZLa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoic3JjL2NsaWVudC9kaXNwbGF5L1NwYWNlVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XG5cbmNvbnN0IHRlbXBsYXRlID0gYDxzdmcgaWQ9XCJzY2VuZVwiPjwvc3ZnPmA7XG5jb25zdCBucyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BhY2VWaWV3IGV4dGVuZHMgVmlldyB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbmV3IHNwYWNlIGluc3RhbmNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIFRoZSBhcmVhIHRvIHJlcHJlc2VudCwgc2hvdWxkIGJlIGRlZmluZWQgYnkgYSBgd2lkdGhgLCBhbiBgaGVpZ2h0YCBhbmQgYW4gb3B0aW9ubmFsIGJhY2tncm91bmQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBUaGUgZXZlbnRzIHRvIGF0dGFjaCB0byB0aGUgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBAdG9kb1xuICAgKi9cbiAgY29uc3RydWN0b3IoYXJlYSwgZXZlbnRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgY2xhc3NOYW1lOiAnc3BhY2UnIH0sIG9wdGlvbnMpO1xuICAgIHN1cGVyKHRlbXBsYXRlLCB7fSwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIHRoaXMuYXJlYSA9IGFyZWE7XG4gICAgdGhpcy5fcmVuZGVyZWRQb3NpdGlvbnMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgc3R5bGUgYW5kIGNhY2hlIGVsZW1lbnRzIHdoZW4gcmVuZGVyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvblJlbmRlcigpIHtcbiAgICB0aGlzLiRlbC5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICB0aGlzLiRlbC5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG5cbiAgICB0aGlzLiRzdmcgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcjc2NlbmUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGFyZWEgd2hlbiBpbnNlcnRlZCBpbiB0aGUgRE9NLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25TaG93KCkge1xuICAgIHRoaXMuX3NldEFyZWEoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGFyZWEgd2hlbiBpbnNlcnRlZCBpbiB0aGUgRE9NLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25SZXNpemUob3JpZW50YXRpb24sIHdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aGlzLl9zZXRBcmVhKCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG1ldGhvZCB1c2VkIHRvIHJlbmRlciBhIHNwZWNpZmljIHBvc2l0aW9uLiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgb3ZlcnJpZGVuIHRvIGRpc3BsYXkgYSBwb3NpdGlvbiB3aXRoIGEgdXNlciBkZWZpbmVkIHNoYXBlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9zIC0gVGhlIHBvc2l0aW9uIHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBwb3MuaWQgLSBBbiB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIHBvc2l0aW9uLlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zLnggLSBUaGUgcG9zaXRpb24gaW4gdGhlIHggYXhpcyBpbiB0aGUgYXJlYSBjb3JkaW5hdGUgc3lzdGVtLlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zLnkgLSBUaGUgcG9zaXRpb24gaW4gdGhlIHkgYXhpcyBpbiB0aGUgYXJlYSBjb3JkaW5hdGUgc3lzdGVtLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3Bvcy5yYWRpdXM9MC4zXSAtIFRoZSByYWRpdXMgb2YgdGhlIHBvc2l0aW9uIChyZWxhdGl2ZSB0byB0aGUgYXJlYSB3aWR0aCBhbmQgaGVpZ2h0KS5cbiAgICovXG4gIHJlbmRlclBvc2l0aW9uKHBvcykge1xuICAgIGNvbnN0ICRzaGFwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2NpcmNsZScpO1xuICAgICRzaGFwZS5jbGFzc0xpc3QuYWRkKCdwb3NpdGlvbicpO1xuXG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnY3gnLCBgJHtwb3MueH1gKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeScsIGAke3Bvcy55fWApO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ3InLCBwb3MucmFkaXVzIHx8wqAwLjMpOyAvLyByYWRpdXMgaXMgcmVsYXRpdmUgdG8gYXJlYSBzaXplXG4gICAgaWYgKHBvcy5zZWxlY3RlZCkgeyAkc2hhcGUuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTsgfVxuXG4gICAgcmV0dXJuICRzaGFwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGFyZWEuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc2V0QXJlYSgpIHtcbiAgICBpZiAoIXRoaXMuJHBhcmVudCkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGFyZWEgPSB0aGlzLmFyZWE7XG4gICAgLy8gdXNlIGB0aGlzLmVsYCBzaXplIGluc3RlYWQgb2YgYHRoaXMuJHBhcmVudGAgc2l6ZVxuICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IGJvdW5kaW5nUmVjdC5oZWlnaHQ7XG5cbiAgICBjb25zdCByYXRpbyA9ICgoKSA9PiB7XG4gICAgICByZXR1cm4gKGFyZWEud2lkdGggPiBhcmVhLmhlaWdodCkgP1xuICAgICAgICBjb250YWluZXJXaWR0aCAvIGFyZWEud2lkdGggOlxuICAgICAgICBjb250YWluZXJIZWlnaHQgLyBhcmVhLmhlaWdodDtcbiAgICB9KSgpO1xuXG4gICAgY29uc3Qgc3ZnV2lkdGggPSBhcmVhLndpZHRoICogcmF0aW87XG4gICAgY29uc3Qgc3ZnSGVpZ2h0ID0gYXJlYS5oZWlnaHQgKiByYXRpbztcblxuICAgIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgc3ZnV2lkdGgpO1xuICAgIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHN2Z0hlaWdodCk7XG4gICAgdGhpcy4kc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAwIDAgJHthcmVhLndpZHRofSAke2FyZWEuaGVpZ2h0fWApO1xuICAgIC8vIGNlbnRlciB0aGUgc3ZnIGludG8gdGhlIHBhcmVudFxuICAgIHRoaXMuJHN2Zy5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG5cbiAgICAvLyBiZSBjb25zaXN0YW50IHdpdGggbW9kdWxlIGZsZXggY3NzXG4gICAgY29uc3QgdGVzdCA9IHRoaXMuJHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIGlmICh0ZXN0LmxlZnQgPT09IDApIHtcbiAgICAgIHRoaXMuJHN2Zy5zdHlsZS5sZWZ0ID0gYCR7KGNvbnRhaW5lcldpZHRoIC0gc3ZnV2lkdGgpIC8gMn1weGA7XG4gICAgfVxuXG4gICAgaWYgKHRlc3QudG9wID09PSAwKSB7XG4gICAgICB0aGlzLiRzdmcuc3R5bGUudG9wID0gYCR7KGNvbnRhaW5lckhlaWdodCAtIHN2Z0hlaWdodCkgLyAyfXB4YDtcbiAgICB9XG5cbiAgICAvLyBkaXNwbGF5IGJhY2tncm91bmQgaWYgYW55XG4gICAgaWYgKGFyZWEuYmFja2dyb3VuZCkge1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYXJlYS5iYWNrZ3JvdW5kO1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gJzUwJSA1MCUnO1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZFJlcGVhdCA9ICduby1yZXBlYXQnO1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZFNpemUgPSAnY292ZXInO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGFsbCB0aGUgZXhpc3RpbmcgcG9zaXRpb25zIHdpdGggdGhlIGdpdmVuIGFycmF5IG9mIHBvc2l0aW9uLlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHBvc2l0aW9ucyAtIFRoZSBuZXcgcG9zaXRpb25zIHRvIHJlbmRlci5cbiAgICovXG4gIHNldFBvc2l0aW9ucyhwb3NpdGlvbnMpIHtcbiAgICB0aGlzLmNsZWFyUG9zaXRpb25zKClcbiAgICB0aGlzLmFkZFBvc2l0aW9ucyhwb3NpdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIGFsbCB0aGUgZGlzcGxheWVkIHBvc2l0aW9ucy5cbiAgICovXG4gIGNsZWFyUG9zaXRpb25zKCkge1xuICAgIGNvbnN0IGtleXMgPSB0aGlzLl9yZW5kZXJlZFBvc2l0aW9ucy5rZXlzKCk7XG4gICAgZm9yIChsZXQgaWQgb2Yga2V5cykge1xuICAgICAgdGhpcy5kZWxldGVQb3NpdGlvbihpZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBuZXcgcG9zaXRpb25zIHRvIHRoZSBhcmVhLlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHBvc2l0aW9ucyAtIFRoZSBuZXcgcG9zaXRpb25zIHRvIHJlbmRlci5cbiAgICovXG4gIGFkZFBvc2l0aW9ucyhwb3NpdGlvbnMpIHtcbiAgICBwb3NpdGlvbnMuZm9yRWFjaChwb3MgPT4gdGhpcy5hZGRQb3NpdGlvbihwb3MpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgcG9zaXRpb24gdG8gdGhlIGFyZWEuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb3MgLSBUaGUgbmV3IHBvc2l0aW9uIHRvIHJlbmRlci5cbiAgICovXG4gIGFkZFBvc2l0aW9uKHBvcykge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMucmVuZGVyUG9zaXRpb24ocG9zKVxuICAgIHRoaXMuJHN2Zy5hcHBlbmRDaGlsZCgkc2hhcGUpO1xuICAgIHRoaXMuX3JlbmRlcmVkUG9zaXRpb25zLnNldChwb3MuaWQsICRzaGFwZSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGEgcmVuZGVyZWQgcG9zaXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb3MgLSBUaGUgcG9zaXRpb24gdG8gdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlUG9zaXRpb24ocG9zKSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRQb3NpdGlvbnMuZ2V0KHBvcy5pZCk7XG5cbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeCcsIGAke3Bvcy54fWApO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N5JywgYCR7cG9zLnl9YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncicsIHBvcy5yYWRpdXMgfHzCoDAuMyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgcmVuZGVyZWQgcG9zaXRpb24uXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gaWQgLSBUaGUgcG9zaXRpb24gdG8gZGVsZXRlLlxuICAgKi9cbiAgZGVsZXRlUG9zaXRpb24oaWQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZFBvc2l0aW9ucy5nZXQoaWQpO1xuICAgIHRoaXMuJHN2Zy5yZW1vdmVjaGlsZCgkc2hhcGUpO1xuICAgIHRoaXMuX3JlbmRlcmVkUG9zaXRpb25zLmRlbGV0ZShpZCk7XG4gIH1cbn1cbiJdfQ==