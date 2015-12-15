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

  function SpaceView(area) {
    var events = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, SpaceView);

    options = _Object$assign({ className: 'space' }, options);
    _get(Object.getPrototypeOf(SpaceView.prototype), 'constructor', this).call(this, template, {}, events, options);

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
      // this.$svg.style.backgroundColor = 'red';
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
      var $shape = this._renderedPositions.get(pos.id);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQUFpQixRQUFROzs7O0FBRXpCLElBQU0sUUFBUSwyQkFBMkIsQ0FBQztBQUMxQyxJQUFNLEVBQUUsR0FBRyw0QkFBNEIsQ0FBQzs7SUFFbkIsU0FBUztZQUFULFNBQVM7O0FBQ2pCLFdBRFEsU0FBUyxDQUNoQixJQUFJLEVBQTZCO1FBQTNCLE1BQU0seURBQUcsRUFBRTtRQUFFLE9BQU8seURBQUcsRUFBRTs7MEJBRHhCLFNBQVM7O0FBRTFCLFdBQU8sR0FBRyxlQUFjLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELCtCQUhpQixTQUFTLDZDQUdwQixRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7O0FBRXJDLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxVQUFTLENBQUM7R0FDckM7O2VBUGtCLFNBQVM7O1dBU3BCLG9CQUFHO0FBQ1QsVUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztBQUM5QixVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUUvQixVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzlDOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNoQjs7O1dBRU8sa0JBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDbkMsVUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2hCOzs7OztXQUdhLHdCQUFDLEdBQUcsRUFBRTtBQUNsQixVQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMs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IjpbImltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XG5cbmNvbnN0IHRlbXBsYXRlID0gYDxzdmcgaWQ9XCJzY2VuZVwiPjwvc3ZnPmA7XG5jb25zdCBucyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwYWNlVmlldyBleHRlbmRzIFZpZXcge1xuICBjb25zdHJ1Y3RvcihhcmVhLCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBjbGFzc05hbWU6ICdzcGFjZScgfSwgb3B0aW9ucyk7XG4gICAgc3VwZXIodGVtcGxhdGUsIHt9LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5hcmVhID0gYXJlYTtcbiAgICB0aGlzLl9yZW5kZXJlZFBvc2l0aW9ucyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuJGVsLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIHRoaXMuJGVsLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcblxuICAgIHRoaXMuJHN2ZyA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJyNzY2VuZScpO1xuICB9XG5cbiAgb25TaG93KCkge1xuICAgIHRoaXMuc2V0QXJlYSgpO1xuICB9XG5cbiAgb25SZXNpemUob3JpZW50YXRpb24sIHdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aGlzLnNldEFyZWEoKTtcbiAgfVxuXG4gIC8vIG92ZXJyaWRlIHRvIGNoYW5nZSB0aGUgcmVuZGVyaW5nIHNoYXBlXG4gIHJlbmRlclBvc2l0aW9uKHBvcykge1xuICAgIGNvbnN0ICRzaGFwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2NpcmNsZScpO1xuICAgICRzaGFwZS5jbGFzc0xpc3QuYWRkKCdwb3NpdGlvbicpO1xuXG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnY3gnLCBgJHtwb3MueH1gKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeScsIGAke3Bvcy55fWApO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ3InLCBwb3MucmFkaXVzIHx8wqAwLjMpOyAvLyByYWRpdXMgaXMgcmVsYXRpdmUgdG8gYXJlYSBzaXplXG4gICAgaWYgKHBvcy5zZWxlY3RlZCkgeyAkc2hhcGUuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTsgfVxuXG4gICAgcmV0dXJuICRzaGFwZTtcbiAgfVxuXG4gIHNldEFyZWEoKSB7XG4gICAgaWYgKCF0aGlzLiRwYXJlbnQpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBhcmVhID0gdGhpcy5hcmVhO1xuICAgIC8vIHVzZSBgdGhpcy5lbGAgc2l6ZSBpbnN0ZWFkIG9mIGB0aGlzLiRwYXJlbnRgIHNpemVcbiAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IGJvdW5kaW5nUmVjdC53aWR0aDtcbiAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSBib3VuZGluZ1JlY3QuaGVpZ2h0O1xuXG4gICAgY29uc3QgcmF0aW8gPSAoKCkgPT4ge1xuICAgICAgcmV0dXJuIChhcmVhLndpZHRoID4gYXJlYS5oZWlnaHQpID9cbiAgICAgICAgY29udGFpbmVyV2lkdGggLyBhcmVhLndpZHRoIDpcbiAgICAgICAgY29udGFpbmVySGVpZ2h0IC8gYXJlYS5oZWlnaHQ7XG4gICAgfSkoKTtcblxuICAgIGNvbnN0IHN2Z1dpZHRoID0gYXJlYS53aWR0aCAqIHJhdGlvO1xuICAgIGNvbnN0IHN2Z0hlaWdodCA9IGFyZWEuaGVpZ2h0ICogcmF0aW87XG5cbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHN2Z1dpZHRoKTtcbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBzdmdIZWlnaHQpO1xuICAgIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBgMCAwICR7YXJlYS53aWR0aH0gJHthcmVhLmhlaWdodH1gKTtcbiAgICAvLyBjZW50ZXIgdGhlIHN2ZyBpbnRvIHRoZSBwYXJlbnRcbiAgICB0aGlzLiRzdmcuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuXG4gICAgLy8gYmUgY29uc2lzdGFudCB3aXRoIG1vZHVsZSBmbGV4IGNzc1xuICAgIGNvbnN0IHRlc3QgPSB0aGlzLiRzdmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICBpZiAodGVzdC5sZWZ0ID09PSAwKSB7XG4gICAgICB0aGlzLiRzdmcuc3R5bGUubGVmdCA9IGAkeyhjb250YWluZXJXaWR0aCAtIHN2Z1dpZHRoKSAvIDJ9cHhgO1xuICAgIH1cblxuICAgIGlmICh0ZXN0LnRvcCA9PT0gMCkge1xuICAgICAgdGhpcy4kc3ZnLnN0eWxlLnRvcCA9IGAkeyhjb250YWluZXJIZWlnaHQgLSBzdmdIZWlnaHQpIC8gMn1weGA7XG4gICAgfVxuXG4gICAgLy8gZGlzcGxheSBiYWNrZ3JvdW5kIGlmIGFueVxuICAgIC8vIHRoaXMuJHN2Zy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmVkJztcbiAgfVxuXG4gIHNldFBvc2l0aW9ucyhwb3NpdGlvbnMpIHtcbiAgICB0aGlzLmNsZWFyUG9zaXRpb25zKClcbiAgICB0aGlzLmFkZFBvc2l0aW9ucyhwb3NpdGlvbnMpO1xuICB9XG5cbiAgY2xlYXJQb3NpdGlvbnMoKSB7XG4gICAgY29uc3Qga2V5cyA9IHRoaXMuX3JlbmRlcmVkUG9zaXRpb25zLmtleXMoKTtcbiAgICBmb3IgKGxldCBpZCBvZiBrZXlzKSB7XG4gICAgICB0aGlzLmRlbGV0ZVBvc2l0aW9uKGlkKTtcbiAgICB9XG4gIH1cblxuICBhZGRQb3NpdGlvbnMocG9zaXRpb25zKSB7XG4gICAgcG9zaXRpb25zLmZvckVhY2gocG9zID0+IHRoaXMuYWRkUG9zaXRpb24ocG9zKSk7XG4gIH1cblxuICBhZGRQb3NpdGlvbihwb3MpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLnJlbmRlclBvc2l0aW9uKHBvcylcbiAgICB0aGlzLiRzdmcuYXBwZW5kQ2hpbGQoJHNoYXBlKTtcbiAgICB0aGlzLl9yZW5kZXJlZFBvc2l0aW9ucy5zZXQocG9zLmlkLCAkc2hhcGUpO1xuICB9XG5cbiAgdXBkYXRlUG9zaXRpb24ocG9zKSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRQb3NpdGlvbnMuZ2V0KHBvcy5pZCk7XG5cbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeCcsIGAke3Bvcy54fWApO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N5JywgYCR7cG9zLnl9YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncicsIHBvcy5yYWRpdXMgfHzCoDAuMyk7XG4gIH1cblxuICBkZWxldGVQb3NpdGlvbihpZCkge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkUG9zaXRpb25zLmdldChpZCk7XG4gICAgdGhpcy4kc3ZnLnJlbW92ZWNoaWxkKCRzaGFwZSk7XG4gICAgdGhpcy5fcmVuZGVyZWRQb3NpdGlvbnMuZGVsZXRlKGlkKTtcbiAgfVxufSJdfQ==