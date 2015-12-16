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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TcGFjZVZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFBaUIsUUFBUTs7OztBQUV6QixJQUFNLFFBQVEsMkJBQTJCLENBQUM7QUFDMUMsSUFBTSxFQUFFLEdBQUcsNEJBQTRCLENBQUM7O0lBR25CLFNBQVM7WUFBVCxTQUFTOzs7Ozs7Ozs7OztBQVNqQixXQVRRLFNBQVMsQ0FTaEIsSUFBSSxFQUE2QjtRQUEzQixNQUFNLHlEQUFHLEVBQUU7UUFBRSxPQUFPLHlEQUFHLEVBQUU7OzBCQVR4QixTQUFTOztBQVUxQixXQUFPLEdBQUcsZUFBYyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6RCwrQkFYaUIsU0FBUyw2Q0FXcEIsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFOzs7Ozs7QUFNckMsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Ozs7OztBQU1qQixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsVUFBUyxDQUFDOztBQUVsQyxRQUFJLENBQUMsa0JBQWtCLEdBQUcsVUFBUyxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFNBQVMsSUFBSSxLQUFLLENBQUM7R0FDOUM7Ozs7Ozs7ZUEzQmtCLFNBQVM7O1dBaUNwQixvQkFBRztBQUNULFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDOUM7Ozs7Ozs7O1dBTUssa0JBQUc7QUFDUCxVQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDakI7Ozs7Ozs7O1dBTU8sa0JBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDbkMsaUNBbERpQixTQUFTLDBDQWtEWCxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUMzQyxVQUFJLENBQUMs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QU1hLHdCQUFDLEVBQUUsRUFBRTtBQUNqQixVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQy9DLFVBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlCLFVBQUksQ0FBQyxrQkFBa0IsVUFBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVuQyxVQUFJLENBQUMsZ0JBQWdCLFVBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN0Qzs7O1NBakxrQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiJzcmMvY2xpZW50L2Rpc3BsYXkvU3BhY2VWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3JztcblxuY29uc3QgdGVtcGxhdGUgPSBgPHN2ZyBpZD1cInNjZW5lXCI+PC9zdmc+YDtcbmNvbnN0IG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcGFjZVZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgLyoqXG4gICAqIFJldHVybnMgYSBuZXcgc3BhY2UgaW5zdGFuY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhIC0gVGhlIGFyZWEgdG8gcmVwcmVzZW50LCBzaG91bGQgYmUgZGVmaW5lZCBieSBhIGB3aWR0aGAsIGFuIGBoZWlnaHRgIGFuZCBhbiBvcHRpb25uYWwgYmFja2dyb3VuZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50cyAtIFRoZSBldmVudHMgdG8gYXR0YWNoIHRvIHRoZSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEB0b2RvXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5pc1N1YlZpZXc9ZmFsc2VdIC0gRG9uJ3QgYXV0b21hdGljYWxseSBwb3NpdGlvbiB0aGUgdmlldyBpbnNpZGUgaXQncyBjb250YWluZXIgKGlzIG5lZWRlZCB3aGVuIGluc2VydGVkIGluIGEgbW9kdWxlIHdpdGggY3NzIGZsZXggYmVoYXZpb3IpLlxuICAgKiBAdG9kbyAtIGBvcHRpb25zLmlzU3ViVmlld2Agc2hvdWxkIGJlIHJlbW92ZWQgYW5kIGhhbmRsZWQgdGhyb3VnaCBjc3MgZmxleC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGFyZWEsIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGNsYXNzTmFtZTogJ3NwYWNlJyB9LCBvcHRpb25zKTtcbiAgICBzdXBlcih0ZW1wbGF0ZSwge30sIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYXJlYSB0byBkaXNwbGF5LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5hcmVhID0gYXJlYTtcblxuICAgIC8qKlxuICAgICAqIEV4cG9zZSBhIE1hcCBvZiB0aGUgJHNoYXBlcyBhbmQgdGhlaXIgcmVsYXRpdmUgcG9zaXRpb24gb2JqZWN0LlxuICAgICAqIEB0eXBlIHtNYXB9XG4gICAgICovXG4gICAgdGhpcy5zaGFwZVBvc2l0aW9uTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5fcmVuZGVyZWRQb3NpdGlvbnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5faXNTdWJWaWV3ID0gb3B0aW9ucy5pc1N1YlZpZXcgfHzCoGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IHN0eWxlIGFuZCBjYWNoZSBlbGVtZW50cyB3aGVuIHJlbmRlcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy4kc3ZnID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignI3NjZW5lJyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBhcmVhIHdoZW4gaW5zZXJ0ZWQgaW4gdGhlIERPTS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uU2hvdygpIHtcbiAgICB0aGlzLl9zZXRBcmVhKCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBhcmVhIHdoZW4gaW5zZXJ0ZWQgaW4gdGhlIERPTS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uUmVzaXplKG9yaWVudGF0aW9uLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgc3VwZXIub25SZXNpemUob3JpZW50YXRpb24sIHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMuJGVsLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIHRoaXMuJGVsLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcblxuICAgIHRoaXMuX3NldEFyZWEoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbWV0aG9kIHVzZWQgdG8gcmVuZGVyIGEgc3BlY2lmaWMgcG9zaXRpb24uIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBvdmVycmlkZW4gdG8gZGlzcGxheSBhIHBvc2l0aW9uIHdpdGggYSB1c2VyIGRlZmluZWQgc2hhcGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb3MgLSBUaGUgcG9zaXRpb24gdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHBvcy5pZCAtIEFuIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgcG9zaXRpb24uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3MueCAtIFRoZSBwb3NpdGlvbiBpbiB0aGUgeCBheGlzIGluIHRoZSBhcmVhIGNvcmRpbmF0ZSBzeXN0ZW0uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3MueSAtIFRoZSBwb3NpdGlvbiBpbiB0aGUgeSBheGlzIGluIHRoZSBhcmVhIGNvcmRpbmF0ZSBzeXN0ZW0uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbcG9zLnJhZGl1cz0wLjNdIC0gVGhlIHJhZGl1cyBvZiB0aGUgcG9zaXRpb24gKHJlbGF0aXZlIHRvIHRoZSBhcmVhIHdpZHRoIGFuZCBoZWlnaHQpLlxuICAgKi9cbiAgcmVuZGVyUG9zaXRpb24ocG9zKSB7XG4gICAgY29uc3QgJHNoYXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnY2lyY2xlJyk7XG4gICAgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ3Bvc2l0aW9uJyk7XG5cbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgcG9zLmlkKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeCcsIGAke3Bvcy54fWApO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N5JywgYCR7cG9zLnl9YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncicsIHBvcy5yYWRpdXMgfHzCoDAuMyk7IC8vIHJhZGl1cyBpcyByZWxhdGl2ZSB0byBhcmVhIHNpemVcbiAgICBpZiAocG9zLnNlbGVjdGVkKSB7ICRzaGFwZS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpOyB9XG5cbiAgICByZXR1cm4gJHNoYXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgYXJlYS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zZXRBcmVhKCkge1xuICAgIGlmICghdGhpcy4kcGFyZW50KSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgYXJlYSA9IHRoaXMuYXJlYTtcbiAgICAvLyB1c2UgYHRoaXMuJGVsYCBzaXplIGluc3RlYWQgb2YgYHRoaXMuJHBhcmVudGAgc2l6ZSB0byBpZ25vcmUgcGFyZW50IHBhZGRpbmdcbiAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IGJvdW5kaW5nUmVjdC53aWR0aDtcbiAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSBib3VuZGluZ1JlY3QuaGVpZ2h0O1xuXG5cbiAgICBjb25zdCByYXRpbyA9ICgoKSA9PiB7XG4gICAgICByZXR1cm4gKGNvbnRhaW5lcldpZHRoIDwgY29udGFpbmVySGVpZ2h0KSA/XG4gICAgICAgIGNvbnRhaW5lcldpZHRoIC8gYXJlYS53aWR0aCA6XG4gICAgICAgIGNvbnRhaW5lckhlaWdodCAvIGFyZWEuaGVpZ2h0O1xuICAgIH0pKCk7XG5cbiAgICBjb25zdCBzdmdXaWR0aCA9IGFyZWEud2lkdGggKiByYXRpbztcbiAgICBjb25zdCBzdmdIZWlnaHQgPSBhcmVhLmhlaWdodCAqIHJhdGlvO1xuXG4gICAgdGhpcy4kc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBzdmdXaWR0aCk7XG4gICAgdGhpcy4kc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0Jywgc3ZnSGVpZ2h0KTtcbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgYDAgMCAke2FyZWEud2lkdGh9ICR7YXJlYS5oZWlnaHR9YCk7XG4gICAgLy8gY2VudGVyIHRoZSBzdmcgaW50byB0aGUgcGFyZW50XG4gICAgdGhpcy4kc3ZnLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcblxuICAgIC8vIGRpc3BsYXkgYmFja2dyb3VuZCBpZiBhbnlcbiAgICBpZiAoYXJlYS5iYWNrZ3JvdW5kKSB7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBhcmVhLmJhY2tncm91bmQ7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSAnNTAlIDUwJSc7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gJ25vLXJlcGVhdCc7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9ICdjb3Zlcic7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYWxsIHRoZSBleGlzdGluZyBwb3NpdGlvbnMgd2l0aCB0aGUgZ2l2ZW4gYXJyYXkgb2YgcG9zaXRpb24uXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gcG9zaXRpb25zIC0gVGhlIG5ldyBwb3NpdGlvbnMgdG8gcmVuZGVyLlxuICAgKi9cbiAgc2V0UG9zaXRpb25zKHBvc2l0aW9ucykge1xuICAgIHRoaXMuY2xlYXJQb3NpdGlvbnMoKVxuICAgIHRoaXMuYWRkUG9zaXRpb25zKHBvc2l0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgYWxsIHRoZSBkaXNwbGF5ZWQgcG9zaXRpb25zLlxuICAgKi9cbiAgY2xlYXJQb3NpdGlvbnMoKSB7XG4gICAgY29uc3Qga2V5cyA9IHRoaXMuX3JlbmRlcmVkUG9zaXRpb25zLmtleXMoKTtcbiAgICBmb3IgKGxldCBpZCBvZiBrZXlzKSB7XG4gICAgICB0aGlzLmRlbGV0ZVBvc2l0aW9uKGlkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIG5ldyBwb3NpdGlvbnMgdG8gdGhlIGFyZWEuXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gcG9zaXRpb25zIC0gVGhlIG5ldyBwb3NpdGlvbnMgdG8gcmVuZGVyLlxuICAgKi9cbiAgYWRkUG9zaXRpb25zKHBvc2l0aW9ucykge1xuICAgIHBvc2l0aW9ucy5mb3JFYWNoKHBvcyA9PiB0aGlzLmFkZFBvc2l0aW9uKHBvcykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBwb3NpdGlvbiB0byB0aGUgYXJlYS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBvcyAtIFRoZSBuZXcgcG9zaXRpb24gdG8gcmVuZGVyLlxuICAgKi9cbiAgYWRkUG9zaXRpb24ocG9zKSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5yZW5kZXJQb3NpdGlvbihwb3MpO1xuICAgIHRoaXMuJHN2Zy5hcHBlbmRDaGlsZCgkc2hhcGUpO1xuICAgIHRoaXMuX3JlbmRlcmVkUG9zaXRpb25zLnNldChwb3MuaWQsICRzaGFwZSk7XG4gICAgLy8gbWFwIGZvciBlYXNpZXIgcmV0cmlldmluZyBvZiB0aGUgcG9zaXRpb25cbiAgICB0aGlzLnNoYXBlUG9zaXRpb25NYXAuc2V0KCRzaGFwZSwgcG9zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYSByZW5kZXJlZCBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBvcyAtIFRoZSBwb3NpdGlvbiB0byB1cGRhdGUuXG4gICAqL1xuICB1cGRhdGVQb3NpdGlvbihwb3MpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZFBvc2l0aW9ucy5nZXQocG9zLmlkKTtcblxuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N4JywgYCR7cG9zLnh9YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnY3knLCBgJHtwb3MueX1gKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdyJywgcG9zLnJhZGl1cyB8fMKgMC4zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSByZW5kZXJlZCBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBpZCAtIFRoZSBwb3NpdGlvbiB0byBkZWxldGUuXG4gICAqL1xuICBkZWxldGVQb3NpdGlvbihpZCkge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkUG9zaXRpb25zLmdldChpZCk7XG4gICAgdGhpcy4kc3ZnLnJlbW92ZWNoaWxkKCRzaGFwZSk7XG4gICAgdGhpcy5fcmVuZGVyZWRQb3NpdGlvbnMuZGVsZXRlKGlkKTtcbiAgICAvLyBtYXAgZm9yIGVhc2llciByZXRyaWV2aW5nIG9mIHRoZSBwb3NpdGlvblxuICAgIHRoaXMuc2hhcGVQb3NpdGlvbk1hcC5kZWxldGUoJHNoYXBlKTtcbiAgfVxufVxuIl19