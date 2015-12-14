'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

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

  function SpaceView(area, options) {
    _classCallCheck(this, SpaceView);

    _get(Object.getPrototypeOf(SpaceView.prototype), 'constructor', this).call(this, template, {}, {}, { className: 'space' });

    this.area = area;
    this._renderedPositions = new _Map();
  }

  _createClass(SpaceView, [{
    key: 'onRender',
    value: function onRender() {
      this.$el.style.width = '100%';
      this.$el.style.height = '100%';

      this.$svg = this.$el.querySelector('#scene');
    }
  }, {
    key: 'onShow',
    value: function onShow() {
      this.setArea();
    }
  }, {
    key: 'onResize',
    value: function onResize(orientation, width, height) {
      this.setArea();
    }

    // override to change the rendering shape
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
  }, {
    key: 'setArea',
    value: function setArea() {
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
      this.$svg.style.backgroundColor = 'red';
    }
  }, {
    key: 'setPositions',
    value: function setPositions(positions) {
      this.clearPositions();
      this.addPositions(positions);
    }
  }, {
    key: 'clearPositions',
    value: function clearPositions() {
      var keys = this._renderedPositions.keys();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(keys), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _id = _step.value;

          this.deletePosition(_id);
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
  }, {
    key: 'addPositions',
    value: function addPositions(positions) {
      var _this = this;

      positions.forEach(function (pos) {
        return _this.addPosition(pos);
      });
    }
  }, {
    key: 'addPosition',
    value: function addPosition(pos) {
      var $shape = this.renderPosition(pos);
      this.$svg.appendChild($shape);
      this._renderedPositions.set(pos.id, $shape);
    }
  }, {
    key: 'updatePosition',
    value: function updatePosition(pos) {
      var $shape = this._renderedPositions.get(id);

      $shape.setAttribute('cx', '' + pos.x);
      $shape.setAttribute('cy', '' + pos.y);
      $shape.setAttribute('r', pos.radius || 0.3);
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TcGFjZVZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBQWlCLFFBQVE7Ozs7QUFFekIsSUFBTSxRQUFRLDJCQUEyQixDQUFDO0FBQzFDLElBQU0sRUFBRSxHQUFHLDRCQUE0QixDQUFDOztJQUVuQixTQUFTO1lBQVQsU0FBUzs7QUFDakIsV0FEUSxTQUFTLENBQ2hCLElBQUksRUFBRSxPQUFPLEVBQUU7MEJBRFIsU0FBUzs7QUFFMUIsK0JBRmlCLFNBQVMsNkNBRXBCLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxFQUFFOztBQUVoRCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsa0JBQWtCLEdBQUcsVUFBUyxDQUFDO0dBQ3JDOztlQU5rQixTQUFTOztXQVFwQixvQkFBRztBQUNULFVBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7QUFDOUIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFL0IsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUM5Qzs7O1dBRUssa0JBQUc7QUFDUCxVQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDaEI7OztXQUVPLGtCQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ25DLFVBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNoQjs7Ozs7V0FHYSx3QkFBQyxHQUFHLEVBQUU7QUFDbEIsVUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDdEQsWUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFD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Ozs7QUFDdEIsZUFBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUc7ZUFBSSxNQUFLLFdBQVcsQ0FBQyxHQUFHLENBQUM7T0FBQSxDQUFDLENBQUM7S0FDakQ7OztXQUVVLHFCQUFDLEdBQUcsRUFBRTtBQUNmLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDdkMsVUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsVUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQzdDOzs7V0FFYSx3QkFBQyxHQUFHLEVBQUU7QUFDbEIsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFL0MsWUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLE9BQUssR0FBRyxDQUFDLENBQUMsQ0FBRyxDQUFDO0FBQ3RDLFlBQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxPQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUcsQ0FBQztBQUN0QyxZQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0tBQzdDOzs7V0FFYSx3QkFBQyxFQUFFLEVBQUU7QUFDakIsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMvQyxVQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixVQUFJLENBQUMsa0JBQWtCLFVBQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNwQzs7O1NBN0drQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiJzcmMvY2xpZW50L2Rpc3BsYXkvU3BhY2VWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3JztcblxuY29uc3QgdGVtcGxhdGUgPSBgPHN2ZyBpZD1cInNjZW5lXCI+PC9zdmc+YDtcbmNvbnN0IG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BhY2VWaWV3IGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKGFyZWEsIG9wdGlvbnMpIHtcbiAgICBzdXBlcih0ZW1wbGF0ZSwge30sIHt9LCB7IGNsYXNzTmFtZTogJ3NwYWNlJyB9KTtcblxuICAgIHRoaXMuYXJlYSA9IGFyZWE7XG4gICAgdGhpcy5fcmVuZGVyZWRQb3NpdGlvbnMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICB0aGlzLiRlbC5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICB0aGlzLiRlbC5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG5cbiAgICB0aGlzLiRzdmcgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcjc2NlbmUnKTtcbiAgfVxuXG4gIG9uU2hvdygpIHtcbiAgICB0aGlzLnNldEFyZWEoKTtcbiAgfVxuXG4gIG9uUmVzaXplKG9yaWVudGF0aW9uLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy5zZXRBcmVhKCk7XG4gIH1cblxuICAvLyBvdmVycmlkZSB0byBjaGFuZ2UgdGhlIHJlbmRlcmluZyBzaGFwZVxuICByZW5kZXJQb3NpdGlvbihwb3MpIHtcbiAgICBjb25zdCAkc2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdjaXJjbGUnKTtcbiAgICAkc2hhcGUuY2xhc3NMaXN0LmFkZCgncG9zaXRpb24nKTtcblxuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N4JywgYCR7cG9zLnh9YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnY3knLCBgJHtwb3MueX1gKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdyJywgcG9zLnJhZGl1cyB8fMKgMC4zKTsgLy8gcmFkaXVzIGlzIHJlbGF0aXZlIHRvIGFyZWEgc2l6ZVxuICAgIGlmIChwb3Muc2VsZWN0ZWQpIHsgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7IH1cblxuICAgIHJldHVybiAkc2hhcGU7XG4gIH1cblxuICBzZXRBcmVhKCkge1xuICAgIGlmICghdGhpcy4kcGFyZW50KSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgYXJlYSA9IHRoaXMuYXJlYTtcbiAgICAvLyB1c2UgYHRoaXMuZWxgIHNpemUgaW5zdGVhZCBvZiBgdGhpcy4kcGFyZW50YCBzaXplXG4gICAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGhpcy4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY29udGFpbmVyV2lkdGggPSBib3VuZGluZ1JlY3Qud2lkdGg7XG4gICAgY29uc3QgY29udGFpbmVySGVpZ2h0ID0gYm91bmRpbmdSZWN0LmhlaWdodDtcblxuICAgIGNvbnN0IHJhdGlvID0gKCgpID0+IHtcbiAgICAgIHJldHVybiAoYXJlYS53aWR0aCA+IGFyZWEuaGVpZ2h0KSA/XG4gICAgICAgIGNvbnRhaW5lcldpZHRoIC8gYXJlYS53aWR0aCA6XG4gICAgICAgIGNvbnRhaW5lckhlaWdodCAvIGFyZWEuaGVpZ2h0O1xuICAgIH0pKCk7XG5cbiAgICBjb25zdCBzdmdXaWR0aCA9IGFyZWEud2lkdGggKiByYXRpbztcbiAgICBjb25zdCBzdmdIZWlnaHQgPSBhcmVhLmhlaWdodCAqIHJhdGlvO1xuXG4gICAgdGhpcy4kc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBzdmdXaWR0aCk7XG4gICAgdGhpcy4kc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0Jywgc3ZnSGVpZ2h0KTtcbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgYDAgMCAke2FyZWEud2lkdGh9ICR7YXJlYS5oZWlnaHR9YCk7XG4gICAgLy8gY2VudGVyIHRoZSBzdmcgaW50byB0aGUgcGFyZW50XG4gICAgdGhpcy4kc3ZnLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcblxuICAgIC8vIGJlIGNvbnNpc3RhbnQgd2l0aCBtb2R1bGUgZmxleCBjc3NcbiAgICBjb25zdCB0ZXN0ID0gdGhpcy4kc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgaWYgKHRlc3QubGVmdCA9PT0gMCkge1xuICAgICAgdGhpcy4kc3ZnLnN0eWxlLmxlZnQgPSBgJHsoY29udGFpbmVyV2lkdGggLSBzdmdXaWR0aCkgLyAyfXB4YDtcbiAgICB9XG5cbiAgICBpZiAodGVzdC50b3AgPT09IDApIHtcbiAgICAgIHRoaXMuJHN2Zy5zdHlsZS50b3AgPSBgJHsoY29udGFpbmVySGVpZ2h0IC0gc3ZnSGVpZ2h0KSAvIDJ9cHhgO1xuICAgIH1cblxuICAgIC8vIGRpc3BsYXkgYmFja2dyb3VuZCBpZiBhbnlcbiAgICB0aGlzLiRzdmcuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JlZCc7XG4gIH1cblxuICBzZXRQb3NpdGlvbnMocG9zaXRpb25zKSB7XG4gICAgdGhpcy5jbGVhclBvc2l0aW9ucygpXG4gICAgdGhpcy5hZGRQb3NpdGlvbnMocG9zaXRpb25zKTtcbiAgfVxuXG4gIGNsZWFyUG9zaXRpb25zKCkge1xuICAgIGNvbnN0IGtleXMgPSB0aGlzLl9yZW5kZXJlZFBvc2l0aW9ucy5rZXlzKCk7XG4gICAgZm9yIChsZXQgaWQgb2Yga2V5cykge1xuICAgICAgdGhpcy5kZWxldGVQb3NpdGlvbihpZCk7XG4gICAgfVxuICB9XG5cbiAgYWRkUG9zaXRpb25zKHBvc2l0aW9ucykge1xuICAgIHBvc2l0aW9ucy5mb3JFYWNoKHBvcyA9PiB0aGlzLmFkZFBvc2l0aW9uKHBvcykpO1xuICB9XG5cbiAgYWRkUG9zaXRpb24ocG9zKSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5yZW5kZXJQb3NpdGlvbihwb3MpXG4gICAgdGhpcy4kc3ZnLmFwcGVuZENoaWxkKCRzaGFwZSk7XG4gICAgdGhpcy5fcmVuZGVyZWRQb3NpdGlvbnMuc2V0KHBvcy5pZCwgJHNoYXBlKTtcbiAgfVxuXG4gIHVwZGF0ZVBvc2l0aW9uKHBvcykge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkUG9zaXRpb25zLmdldChpZCk7XG5cbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeCcsIGAke3Bvcy54fWApO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N5JywgYCR7cG9zLnl9YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncicsIHBvcy5yYWRpdXMgfHzCoDAuMyk7XG4gIH1cblxuICBkZWxldGVQb3NpdGlvbihpZCkge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkUG9zaXRpb25zLmdldChpZCk7XG4gICAgdGhpcy4kc3ZnLnJlbW92ZWNoaWxkKCRzaGFwZSk7XG4gICAgdGhpcy5fcmVuZGVyZWRQb3NpdGlvbnMuZGVsZXRlKGlkKTtcbiAgfVxufSJdfQ==