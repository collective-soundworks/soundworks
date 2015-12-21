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
    value: function onResize(orientation, viewportWidth, viewportHeight) {
      _get(Object.getPrototypeOf(SpaceView.prototype), 'onResize', this).call(this, orientation, viewportWidth, viewportHeight);
      // override size to match parent size
      this.$el.style.width = '100%';
      this.$el.style.height = '100%';

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TcGFjZVZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFBaUIsUUFBUTs7OztBQUV6QixJQUFNLFFBQVEsMkJBQTJCLENBQUM7QUFDMUMsSUFBTSxFQUFFLEdBQUcsNEJBQTRCLENBQUM7O0lBR25CLFNBQVM7WUFBVCxTQUFTOzs7Ozs7Ozs7OztBQVNqQixXQVRRLFNBQVMsQ0FTaEIsSUFBSSxFQUE2QjtRQUEzQixNQUFNLHlEQUFHLEVBQUU7UUFBRSxPQUFPLHlEQUFHLEVBQUU7OzBCQVR4QixTQUFTOztBQVUxQixXQUFPLEdBQUcsZUFBYyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6RCwrQkFYaUIsU0FBUyw2Q0FXcEIsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFOzs7Ozs7QUFNckMsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Ozs7OztBQU1qQixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsVUFBUyxDQUFDOztBQUVsQyxRQUFJLENBQUMsa0JBQWtCLEdBQUcsVUFBUyxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFNBQVMsSUFBSSxLQUFLLENBQUM7R0FDOUM7Ozs7Ozs7ZUEzQmtCLFNBQVM7O1dBaUNwQixvQkFBRztBQUNULFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDOUM7Ozs7Ozs7O1dBTUssa0JBQUc7QUFDUCxVQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDakI7Ozs7Ozs7O1dBTU8sa0JBQUMsV0FBVyxFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUU7QUFDbkQsaUNBbERpQixTQUFTLDBDQWtEWCxXQUFXLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRTs7QUFFM0QsVUFBSSxDQUFD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V0FNYSx3QkFBQyxFQUFFLEVBQUU7QUFDakIsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMvQyxVQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixVQUFJLENBQUMsa0JBQWtCLFVBQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFbkMsVUFBSSxDQUFDLGdCQUFnQixVQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDdEM7OztTQWxMa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoic3JjL2NsaWVudC9kaXNwbGF5L1NwYWNlVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XG5cbmNvbnN0IHRlbXBsYXRlID0gYDxzdmcgaWQ9XCJzY2VuZVwiPjwvc3ZnPmA7XG5jb25zdCBucyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BhY2VWaWV3IGV4dGVuZHMgVmlldyB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbmV3IHNwYWNlIGluc3RhbmNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIFRoZSBhcmVhIHRvIHJlcHJlc2VudCwgc2hvdWxkIGJlIGRlZmluZWQgYnkgYSBgd2lkdGhgLCBhbiBgaGVpZ2h0YCBhbmQgYW4gb3B0aW9ubmFsIGJhY2tncm91bmQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBUaGUgZXZlbnRzIHRvIGF0dGFjaCB0byB0aGUgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBAdG9kb1xuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuaXNTdWJWaWV3PWZhbHNlXSAtIERvbid0IGF1dG9tYXRpY2FsbHkgcG9zaXRpb24gdGhlIHZpZXcgaW5zaWRlIGl0J3MgY29udGFpbmVyIChpcyBuZWVkZWQgd2hlbiBpbnNlcnRlZCBpbiBhIG1vZHVsZSB3aXRoIGNzcyBmbGV4IGJlaGF2aW9yKS5cbiAgICogQHRvZG8gLSBgb3B0aW9ucy5pc1N1YlZpZXdgIHNob3VsZCBiZSByZW1vdmVkIGFuZCBoYW5kbGVkIHRocm91Z2ggY3NzIGZsZXguXG4gICAqL1xuICBjb25zdHJ1Y3RvcihhcmVhLCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBjbGFzc05hbWU6ICdzcGFjZScgfSwgb3B0aW9ucyk7XG4gICAgc3VwZXIodGVtcGxhdGUsIHt9LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFyZWEgdG8gZGlzcGxheS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuYXJlYSA9IGFyZWE7XG5cbiAgICAvKipcbiAgICAgKiBFeHBvc2UgYSBNYXAgb2YgdGhlICRzaGFwZXMgYW5kIHRoZWlyIHJlbGF0aXZlIHBvc2l0aW9uIG9iamVjdC5cbiAgICAgKiBAdHlwZSB7TWFwfVxuICAgICAqL1xuICAgIHRoaXMuc2hhcGVQb3NpdGlvbk1hcCA9IG5ldyBNYXAoKTtcblxuICAgIHRoaXMuX3JlbmRlcmVkUG9zaXRpb25zID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX2lzU3ViVmlldyA9IG9wdGlvbnMuaXNTdWJWaWV3IHx8wqBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBzdHlsZSBhbmQgY2FjaGUgZWxlbWVudHMgd2hlbiByZW5kZXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuJHN2ZyA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJyNzY2VuZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgYXJlYSB3aGVuIGluc2VydGVkIGluIHRoZSBET00uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvblNob3coKSB7XG4gICAgdGhpcy5fc2V0QXJlYSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgYXJlYSB3aGVuIGluc2VydGVkIGluIHRoZSBET00uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvblJlc2l6ZShvcmllbnRhdGlvbiwgdmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQpIHtcbiAgICBzdXBlci5vblJlc2l6ZShvcmllbnRhdGlvbiwgdmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQpO1xuICAgIC8vIG92ZXJyaWRlIHNpemUgdG8gbWF0Y2ggcGFyZW50IHNpemVcbiAgICB0aGlzLiRlbC5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICB0aGlzLiRlbC5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG5cbiAgICB0aGlzLl9zZXRBcmVhKCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG1ldGhvZCB1c2VkIHRvIHJlbmRlciBhIHNwZWNpZmljIHBvc2l0aW9uLiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgb3ZlcnJpZGVuIHRvIGRpc3BsYXkgYSBwb3NpdGlvbiB3aXRoIGEgdXNlciBkZWZpbmVkIHNoYXBlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9zIC0gVGhlIHBvc2l0aW9uIHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBwb3MuaWQgLSBBbiB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIHBvc2l0aW9uLlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zLnggLSBUaGUgcG9zaXRpb24gaW4gdGhlIHggYXhpcyBpbiB0aGUgYXJlYSBjb3JkaW5hdGUgc3lzdGVtLlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zLnkgLSBUaGUgcG9zaXRpb24gaW4gdGhlIHkgYXhpcyBpbiB0aGUgYXJlYSBjb3JkaW5hdGUgc3lzdGVtLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3Bvcy5yYWRpdXM9MC4zXSAtIFRoZSByYWRpdXMgb2YgdGhlIHBvc2l0aW9uIChyZWxhdGl2ZSB0byB0aGUgYXJlYSB3aWR0aCBhbmQgaGVpZ2h0KS5cbiAgICovXG4gIHJlbmRlclBvc2l0aW9uKHBvcykge1xuICAgIGNvbnN0ICRzaGFwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2NpcmNsZScpO1xuICAgICRzaGFwZS5jbGFzc0xpc3QuYWRkKCdwb3NpdGlvbicpO1xuXG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcsIHBvcy5pZCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnY3gnLCBgJHtwb3MueH1gKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeScsIGAke3Bvcy55fWApO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ3InLCBwb3MucmFkaXVzIHx8wqAwLjMpOyAvLyByYWRpdXMgaXMgcmVsYXRpdmUgdG8gYXJlYSBzaXplXG4gICAgaWYgKHBvcy5zZWxlY3RlZCkgeyAkc2hhcGUuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTsgfVxuXG4gICAgcmV0dXJuICRzaGFwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGFyZWEuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc2V0QXJlYSgpIHtcbiAgICBpZiAoIXRoaXMuJHBhcmVudCkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGFyZWEgPSB0aGlzLmFyZWE7XG4gICAgLy8gdXNlIGB0aGlzLiRlbGAgc2l6ZSBpbnN0ZWFkIG9mIGB0aGlzLiRwYXJlbnRgIHNpemUgdG8gaWdub3JlIHBhcmVudCBwYWRkaW5nXG4gICAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGhpcy4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY29udGFpbmVyV2lkdGggPSBib3VuZGluZ1JlY3Qud2lkdGg7XG4gICAgY29uc3QgY29udGFpbmVySGVpZ2h0ID0gYm91bmRpbmdSZWN0LmhlaWdodDtcblxuXG4gICAgY29uc3QgcmF0aW8gPSAoKCkgPT4ge1xuICAgICAgcmV0dXJuIChjb250YWluZXJXaWR0aCA8IGNvbnRhaW5lckhlaWdodCkgP1xuICAgICAgICBjb250YWluZXJXaWR0aCAvIGFyZWEud2lkdGggOlxuICAgICAgICBjb250YWluZXJIZWlnaHQgLyBhcmVhLmhlaWdodDtcbiAgICB9KSgpO1xuXG4gICAgY29uc3Qgc3ZnV2lkdGggPSBhcmVhLndpZHRoICogcmF0aW87XG4gICAgY29uc3Qgc3ZnSGVpZ2h0ID0gYXJlYS5oZWlnaHQgKiByYXRpbztcblxuICAgIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgc3ZnV2lkdGgpO1xuICAgIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHN2Z0hlaWdodCk7XG4gICAgdGhpcy4kc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAwIDAgJHthcmVhLndpZHRofSAke2FyZWEuaGVpZ2h0fWApO1xuICAgIC8vIGNlbnRlciB0aGUgc3ZnIGludG8gdGhlIHBhcmVudFxuICAgIHRoaXMuJHN2Zy5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG5cbiAgICAvLyBkaXNwbGF5IGJhY2tncm91bmQgaWYgYW55XG4gICAgaWYgKGFyZWEuYmFja2dyb3VuZCkge1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYXJlYS5iYWNrZ3JvdW5kO1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gJzUwJSA1MCUnO1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZFJlcGVhdCA9ICduby1yZXBlYXQnO1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZFNpemUgPSAnY292ZXInO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGFsbCB0aGUgZXhpc3RpbmcgcG9zaXRpb25zIHdpdGggdGhlIGdpdmVuIGFycmF5IG9mIHBvc2l0aW9uLlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHBvc2l0aW9ucyAtIFRoZSBuZXcgcG9zaXRpb25zIHRvIHJlbmRlci5cbiAgICovXG4gIHNldFBvc2l0aW9ucyhwb3NpdGlvbnMpIHtcbiAgICB0aGlzLmNsZWFyUG9zaXRpb25zKClcbiAgICB0aGlzLmFkZFBvc2l0aW9ucyhwb3NpdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIGFsbCB0aGUgZGlzcGxheWVkIHBvc2l0aW9ucy5cbiAgICovXG4gIGNsZWFyUG9zaXRpb25zKCkge1xuICAgIGNvbnN0IGtleXMgPSB0aGlzLl9yZW5kZXJlZFBvc2l0aW9ucy5rZXlzKCk7XG4gICAgZm9yIChsZXQgaWQgb2Yga2V5cykge1xuICAgICAgdGhpcy5kZWxldGVQb3NpdGlvbihpZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBuZXcgcG9zaXRpb25zIHRvIHRoZSBhcmVhLlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHBvc2l0aW9ucyAtIFRoZSBuZXcgcG9zaXRpb25zIHRvIHJlbmRlci5cbiAgICovXG4gIGFkZFBvc2l0aW9ucyhwb3NpdGlvbnMpIHtcbiAgICBwb3NpdGlvbnMuZm9yRWFjaChwb3MgPT4gdGhpcy5hZGRQb3NpdGlvbihwb3MpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgcG9zaXRpb24gdG8gdGhlIGFyZWEuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb3MgLSBUaGUgbmV3IHBvc2l0aW9uIHRvIHJlbmRlci5cbiAgICovXG4gIGFkZFBvc2l0aW9uKHBvcykge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMucmVuZGVyUG9zaXRpb24ocG9zKTtcbiAgICB0aGlzLiRzdmcuYXBwZW5kQ2hpbGQoJHNoYXBlKTtcbiAgICB0aGlzLl9yZW5kZXJlZFBvc2l0aW9ucy5zZXQocG9zLmlkLCAkc2hhcGUpO1xuICAgIC8vIG1hcCBmb3IgZWFzaWVyIHJldHJpZXZpbmcgb2YgdGhlIHBvc2l0aW9uXG4gICAgdGhpcy5zaGFwZVBvc2l0aW9uTWFwLnNldCgkc2hhcGUsIHBvcyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGEgcmVuZGVyZWQgcG9zaXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb3MgLSBUaGUgcG9zaXRpb24gdG8gdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlUG9zaXRpb24ocG9zKSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRQb3NpdGlvbnMuZ2V0KHBvcy5pZCk7XG5cbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeCcsIGAke3Bvcy54fWApO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N5JywgYCR7cG9zLnl9YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncicsIHBvcy5yYWRpdXMgfHzCoDAuMyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgcmVuZGVyZWQgcG9zaXRpb24uXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gaWQgLSBUaGUgcG9zaXRpb24gdG8gZGVsZXRlLlxuICAgKi9cbiAgZGVsZXRlUG9zaXRpb24oaWQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZFBvc2l0aW9ucy5nZXQoaWQpO1xuICAgIHRoaXMuJHN2Zy5yZW1vdmVjaGlsZCgkc2hhcGUpO1xuICAgIHRoaXMuX3JlbmRlcmVkUG9zaXRpb25zLmRlbGV0ZShpZCk7XG4gICAgLy8gbWFwIGZvciBlYXNpZXIgcmV0cmlldmluZyBvZiB0aGUgcG9zaXRpb25cbiAgICB0aGlzLnNoYXBlUG9zaXRpb25NYXAuZGVsZXRlKCRzaGFwZSk7XG4gIH1cbn1cbiJdfQ==