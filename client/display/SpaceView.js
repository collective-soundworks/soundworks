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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TcGFjZVZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFBaUIsUUFBUTs7OztBQUV6QixJQUFNLFFBQVEsMkJBQTJCLENBQUM7QUFDMUMsSUFBTSxFQUFFLEdBQUcsNEJBQTRCLENBQUM7O0lBRW5CLFNBQVM7WUFBVCxTQUFTOztBQUNqQixXQURRLFNBQVMsQ0FDaEIsSUFBSSxFQUE2QjtRQUEzQixNQUFNLHlEQUFHLEVBQUU7UUFBRSxPQUFPLHlEQUFHLEVBQUU7OzBCQUR4QixTQUFTOztBQUUxQixXQUFPLEdBQUcsZUFBYyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6RCwrQkFIaUIsU0FBUyw2Q0FHcEIsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFOztBQUVyQyxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsa0JBQWtCLEdBQUcsVUFBUyxDQUFDO0dBQ3JDOztlQVBrQixTQUFTOztXQVNwQixvQkFBRztBQUNULFVBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7QUFDOUIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFL0IsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUM5Qzs7O1dBRUssa0JBQUc7QUFDUCxVQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDaEI7OztXQUVPLGtCQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ25DLFVBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNoQjs7Ozs7V0FHYSx3QkFBQyxHQUFHLEVBQUU7QUFDbEIsVUFBTSxNQUFNLEdBQUcsUUFBUSxD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c0NvbnRlbnQiOlsiaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3JztcblxuY29uc3QgdGVtcGxhdGUgPSBgPHN2ZyBpZD1cInNjZW5lXCI+PC9zdmc+YDtcbmNvbnN0IG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BhY2VWaWV3IGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKGFyZWEsIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGNsYXNzTmFtZTogJ3NwYWNlJyB9LCBvcHRpb25zKTtcbiAgICBzdXBlcih0ZW1wbGF0ZSwge30sIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmFyZWEgPSBhcmVhO1xuICAgIHRoaXMuX3JlbmRlcmVkUG9zaXRpb25zID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy4kZWwuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgdGhpcy4kZWwuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuXG4gICAgdGhpcy4kc3ZnID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignI3NjZW5lJyk7XG4gIH1cblxuICBvblNob3coKSB7XG4gICAgdGhpcy5zZXRBcmVhKCk7XG4gIH1cblxuICBvblJlc2l6ZShvcmllbnRhdGlvbiwgd2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMuc2V0QXJlYSgpO1xuICB9XG5cbiAgLy8gb3ZlcnJpZGUgdG8gY2hhbmdlIHRoZSByZW5kZXJpbmcgc2hhcGVcbiAgcmVuZGVyUG9zaXRpb24ocG9zKSB7XG4gICAgY29uc3QgJHNoYXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnY2lyY2xlJyk7XG4gICAgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ3Bvc2l0aW9uJyk7XG5cbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeCcsIGAke3Bvcy54fWApO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N5JywgYCR7cG9zLnl9YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncicsIHBvcy5yYWRpdXMgfHzCoDAuMyk7IC8vIHJhZGl1cyBpcyByZWxhdGl2ZSB0byBhcmVhIHNpemVcbiAgICBpZiAocG9zLnNlbGVjdGVkKSB7ICRzaGFwZS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpOyB9XG5cbiAgICByZXR1cm4gJHNoYXBlO1xuICB9XG5cbiAgc2V0QXJlYSgpIHtcbiAgICBpZiAoIXRoaXMuJHBhcmVudCkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGFyZWEgPSB0aGlzLmFyZWE7XG4gICAgLy8gdXNlIGB0aGlzLmVsYCBzaXplIGluc3RlYWQgb2YgYHRoaXMuJHBhcmVudGAgc2l6ZVxuICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IGJvdW5kaW5nUmVjdC5oZWlnaHQ7XG5cbiAgICBjb25zdCByYXRpbyA9ICgoKSA9PiB7XG4gICAgICByZXR1cm4gKGFyZWEud2lkdGggPiBhcmVhLmhlaWdodCkgP1xuICAgICAgICBjb250YWluZXJXaWR0aCAvIGFyZWEud2lkdGggOlxuICAgICAgICBjb250YWluZXJIZWlnaHQgLyBhcmVhLmhlaWdodDtcbiAgICB9KSgpO1xuXG4gICAgY29uc3Qgc3ZnV2lkdGggPSBhcmVhLndpZHRoICogcmF0aW87XG4gICAgY29uc3Qgc3ZnSGVpZ2h0ID0gYXJlYS5oZWlnaHQgKiByYXRpbztcblxuICAgIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgc3ZnV2lkdGgpO1xuICAgIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHN2Z0hlaWdodCk7XG4gICAgdGhpcy4kc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAwIDAgJHthcmVhLndpZHRofSAke2FyZWEuaGVpZ2h0fWApO1xuICAgIC8vIGNlbnRlciB0aGUgc3ZnIGludG8gdGhlIHBhcmVudFxuICAgIHRoaXMuJHN2Zy5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG5cbiAgICAvLyBiZSBjb25zaXN0YW50IHdpdGggbW9kdWxlIGZsZXggY3NzXG4gICAgY29uc3QgdGVzdCA9IHRoaXMuJHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIGlmICh0ZXN0LmxlZnQgPT09IDApIHtcbiAgICAgIHRoaXMuJHN2Zy5zdHlsZS5sZWZ0ID0gYCR7KGNvbnRhaW5lcldpZHRoIC0gc3ZnV2lkdGgpIC8gMn1weGA7XG4gICAgfVxuXG4gICAgaWYgKHRlc3QudG9wID09PSAwKSB7XG4gICAgICB0aGlzLiRzdmcuc3R5bGUudG9wID0gYCR7KGNvbnRhaW5lckhlaWdodCAtIHN2Z0hlaWdodCkgLyAyfXB4YDtcbiAgICB9XG5cbiAgICAvLyBkaXNwbGF5IGJhY2tncm91bmQgaWYgYW55XG4gICAgLy8gdGhpcy4kc3ZnLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZWQnO1xuICB9XG5cbiAgc2V0UG9zaXRpb25zKHBvc2l0aW9ucykge1xuICAgIHRoaXMuY2xlYXJQb3NpdGlvbnMoKVxuICAgIHRoaXMuYWRkUG9zaXRpb25zKHBvc2l0aW9ucyk7XG4gIH1cblxuICBjbGVhclBvc2l0aW9ucygpIHtcbiAgICBjb25zdCBrZXlzID0gdGhpcy5fcmVuZGVyZWRQb3NpdGlvbnMua2V5cygpO1xuICAgIGZvciAobGV0IGlkIG9mIGtleXMpIHtcbiAgICAgIHRoaXMuZGVsZXRlUG9zaXRpb24oaWQpO1xuICAgIH1cbiAgfVxuXG4gIGFkZFBvc2l0aW9ucyhwb3NpdGlvbnMpIHtcbiAgICBwb3NpdGlvbnMuZm9yRWFjaChwb3MgPT4gdGhpcy5hZGRQb3NpdGlvbihwb3MpKTtcbiAgfVxuXG4gIGFkZFBvc2l0aW9uKHBvcykge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMucmVuZGVyUG9zaXRpb24ocG9zKVxuICAgIHRoaXMuJHN2Zy5hcHBlbmRDaGlsZCgkc2hhcGUpO1xuICAgIHRoaXMuX3JlbmRlcmVkUG9zaXRpb25zLnNldChwb3MuaWQsICRzaGFwZSk7XG4gIH1cblxuICB1cGRhdGVQb3NpdGlvbihwb3MpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZFBvc2l0aW9ucy5nZXQocG9zLmlkKTtcblxuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N4JywgYCR7cG9zLnh9YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnY3knLCBgJHtwb3MueX1gKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdyJywgcG9zLnJhZGl1cyB8fMKgMC4zKTtcbiAgfVxuXG4gIGRlbGV0ZVBvc2l0aW9uKGlkKSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRQb3NpdGlvbnMuZ2V0KGlkKTtcbiAgICB0aGlzLiRzdmcucmVtb3ZlY2hpbGQoJHNoYXBlKTtcbiAgICB0aGlzLl9yZW5kZXJlZFBvc2l0aW9ucy5kZWxldGUoaWQpO1xuICB9XG59Il19