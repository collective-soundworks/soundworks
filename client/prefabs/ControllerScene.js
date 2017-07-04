'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _basicControllers = require('basic-controllers');

var controllers = _interopRequireWildcard(_basicControllers);

var _View = require('../views/View');

var _View2 = _interopRequireDefault(_View);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

controllers.setTheme('dark');

/* --------------------------------------------------------- */
/* GUIs
/* --------------------------------------------------------- */

/** @private */

var _BooleanGui = function () {
  function _BooleanGui($container, param, guiOptions) {
    (0, _classCallCheck3.default)(this, _BooleanGui);
    var label = param.label,
        value = param.value;


    this.controller = new controllers.Toggle({
      label: label,
      default: value,
      container: $container,
      callback: function callback(value) {
        if (guiOptions.confirm) {
          var msg = 'Are you sure you want to propagate "' + param.name + ':' + value + '"';
          if (!window.confirm(msg)) {
            return;
          }
        }

        param.update(value);
      }
    });
  }

  (0, _createClass3.default)(_BooleanGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);
  return _BooleanGui;
}();

/** @private */


var _EnumGui = function () {
  function _EnumGui($container, param, guiOptions) {
    (0, _classCallCheck3.default)(this, _EnumGui);
    var label = param.label,
        options = param.options,
        value = param.value;


    var ctor = guiOptions.type === 'buttons' ? controllers.SelectButtons : controllers.SelectList;

    this.controller = new ctor({
      label: label,
      options: options,
      default: value,
      container: $container,
      callback: function callback(value) {
        if (guiOptions.confirm) {
          var msg = 'Are you sure you want to propagate "' + param.name + ':' + value + '"';
          if (!window.confirm(msg)) {
            return;
          }
        }

        param.update(value);
      }
    });
  }

  (0, _createClass3.default)(_EnumGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);
  return _EnumGui;
}();

/** @private */


var _NumberGui = function () {
  function _NumberGui($container, param, guiOptions) {
    (0, _classCallCheck3.default)(this, _NumberGui);
    var label = param.label,
        min = param.min,
        max = param.max,
        step = param.step,
        value = param.value;


    if (guiOptions.type === 'slider') {
      this.controller = new controllers.Slider({
        label: label,
        min: min,
        max: max,
        step: step,
        default: value,
        unit: guiOptions.param ? guiOptions.param : '',
        size: guiOptions.size,
        container: $container
      });
    } else {
      this.controller = new controllers.NumberBox({
        label: label,
        min: min,
        max: max,
        step: step,
        default: value,
        container: $container
      });
    }

    this.controller.addListener(function (value) {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + param.name + ':' + value + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      param.update(value);
    });
  }

  (0, _createClass3.default)(_NumberGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);
  return _NumberGui;
}();

/** @private */


var _TextGui = function () {
  function _TextGui($container, param, guiOptions) {
    (0, _classCallCheck3.default)(this, _TextGui);
    var label = param.label,
        value = param.value;


    this.controller = new controllers.Text({
      label: label,
      default: value,
      readonly: guiOptions.readonly,
      container: $container
    });

    if (!guiOptions.readonly) {
      this.controller.addListener(function (value) {
        if (guiOptions.confirm) {
          var msg = 'Are you sure you want to propagate "' + param.name + '"';
          if (!window.confirm(msg)) {
            return;
          }
        }

        param.update(value);
      });
    }
  }

  (0, _createClass3.default)(_TextGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);
  return _TextGui;
}();

/** @private */


var _TriggerGui = function () {
  function _TriggerGui($container, param, guiOptions) {
    (0, _classCallCheck3.default)(this, _TriggerGui);
    var label = param.label;


    this.controller = new controllers.TriggerButtons({
      options: [label],
      container: $container,
      callback: function callback() {
        if (guiOptions.confirm) {
          var msg = 'Are you sure you want to propagate "' + param.name + '"';
          if (!window.confirm(msg)) {
            return;
          }
        }

        param.update();
      }
    });
  }

  (0, _createClass3.default)(_TriggerGui, [{
    key: 'set',
    value: function set(val) {/* nothing to set here */}
  }]);
  return _TriggerGui;
}();

var SCENE_ID = 'basic-shared-controller';

/**
 * The `ControllerScene` scene propose a simple / default way to create
 * a controller view for the `shared-params` service.
 *
 * Each controller comes with a set of options that can be passed to the
 * constructor.
 *
 * @memberof module:soundworks/client
 * @see [`shared-params` service]{@link module:soundworks/client.SharedParams}
 */

var ControllerScene = function () {
  /**
   * _<span class="warning">__WARNING__</span> This API is unstable, and
   * subject to change in further versions.
   */
  function ControllerScene(experience, sharedParams) {
    (0, _classCallCheck3.default)(this, ControllerScene);

    if (!sharedParams) throw new Error('This service requires the "shared params" service');

    this._guiOptions = {};

    this.experience = experience;
    this.sharedParams = sharedParams;
  }

  (0, _createClass3.default)(ControllerScene, [{
    key: 'enter',
    value: function enter() {
      var _this = this;

      this.view = new _View2.default();
      this.view.options.id = 'basic-shared-controller';

      this.view.render();
      this.view.appendTo(this.experience.container);

      var _loop = function _loop(name) {
        var param = _this.sharedParams.params[name];
        var gui = _this._createGui(param);

        param.addListener('update', function (val) {
          return gui.set(val);
        });
      };

      for (var name in this.sharedParams.params) {
        _loop(name);
      }
    }
  }, {
    key: 'exit',
    value: function exit() {
      for (var name in this.sharedParams.params) {
        var param = this.sharedParams.params[name];
        param.removeListener('update');
      }

      this.view.remove();
    }

    /**
     * Configure the GUI for a given parameter, this method only makes sens if
     * `options.hasGUI=true`.
     * @param {String} name - Name of the parameter to configure.
     * @param {Object} options - Options to configure the parameter GUI.
     * @param {String} options.type - Type of GUI to use. Each type of parameter can
     *  used with different GUI according to their type and comes with acceptable
     *  default values.
     * @param {Boolean} [options.show=true] - Display or not the GUI for this parameter.
     * @param {Boolean} [options.confirm=false] - Ask for confirmation when the value changes.
     */

  }, {
    key: 'setGuiOptions',
    value: function setGuiOptions(name, options) {
      this._guiOptions[name] = options;
    }

    /** @private */

  }, {
    key: '_createGui',
    value: function _createGui(param) {
      var config = (0, _assign2.default)({
        show: true,
        confirm: false
      }, this._guiOptions[param.name]);

      if (config.show === false) return null;

      var gui = null;
      var $container = this.view.$el;

      switch (param.type) {
        case 'boolean':
          gui = new _BooleanGui($container, param, config); // `Toggle`
          break;
        case 'enum':
          gui = new _EnumGui($container, param, config); // `SelectList` or `SelectButtons`
          break;
        case 'number':
          gui = new _NumberGui($container, param, config); // `NumberBox` or `Slider`
          break;
        case 'text':
          gui = new _TextGui($container, param, config); // `Text`
          break;
        case 'trigger':
          gui = new _TriggerGui($container, param, config);
          break;
      }

      return gui;
    }
  }]);
  return ControllerScene;
}();

exports.default = ControllerScene;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbnRyb2xsZXJTY2VuZS5qcyJdLCJuYW1lcyI6WyJjb250cm9sbGVycyIsInNldFRoZW1lIiwiX0Jvb2xlYW5HdWkiLCIkY29udGFpbmVyIiwicGFyYW0iLCJndWlPcHRpb25zIiwibGFiZWwiLCJ2YWx1ZSIsImNvbnRyb2xsZXIiLCJUb2dnbGUiLCJkZWZhdWx0IiwiY29udGFpbmVyIiwiY2FsbGJhY2siLCJjb25maXJtIiwibXNnIiwibmFtZSIsIndpbmRvdyIsInVwZGF0ZSIsInZhbCIsIl9FbnVtR3VpIiwib3B0aW9ucyIsImN0b3IiLCJ0eXBlIiwiU2VsZWN0QnV0dG9ucyIsIlNlbGVjdExpc3QiLCJfTnVtYmVyR3VpIiwibWluIiwibWF4Iiwic3RlcCIsIlNsaWRlciIsInVuaXQiLCJzaXplIiwiTnVtYmVyQm94IiwiYWRkTGlzdGVuZXIiLCJfVGV4dEd1aSIsIlRleHQiLCJyZWFkb25seSIsIl9UcmlnZ2VyR3VpIiwiVHJpZ2dlckJ1dHRvbnMiLCJTQ0VORV9JRCIsIkNvbnRyb2xsZXJTY2VuZSIsImV4cGVyaWVuY2UiLCJzaGFyZWRQYXJhbXMiLCJFcnJvciIsIl9ndWlPcHRpb25zIiwidmlldyIsImlkIiwicmVuZGVyIiwiYXBwZW5kVG8iLCJwYXJhbXMiLCJndWkiLCJfY3JlYXRlR3VpIiwic2V0IiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmUiLCJjb25maWciLCJzaG93IiwiJGVsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsVzs7QUFDWjs7Ozs7Ozs7QUFFQUEsWUFBWUMsUUFBWixDQUFxQixNQUFyQjs7QUFFQTtBQUNBOzs7QUFHQTs7SUFDTUMsVztBQUNKLHVCQUFZQyxVQUFaLEVBQXdCQyxLQUF4QixFQUErQkMsVUFBL0IsRUFBMkM7QUFBQTtBQUFBLFFBQ2pDQyxLQURpQyxHQUNoQkYsS0FEZ0IsQ0FDakNFLEtBRGlDO0FBQUEsUUFDMUJDLEtBRDBCLEdBQ2hCSCxLQURnQixDQUMxQkcsS0FEMEI7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QWdCLEtBQXBCLEVBQTJCLE9BQU8sSUFBUDs7QUFFM0IsVUFBSU4sTUFBTSxJQUFWO0FBQ0EsVUFBTS9DLGFBQWEsS0FBSzBDLElBQUwsQ0FBVVksR0FBN0I7O0FBRUEsY0FBUXJELE1BQU1rQixJQUFkO0FBQ0UsYUFBSyxTQUFMO0FBQ0U0QixnQkFBTSxJQUFJaEQsV0FBSixDQUFnQkMsVUFBaEIsRUFBNEJDLEtBQTVCLEVBQW1DbUQsTUFBbkMsQ0FBTixDQURGLENBQ29EO0FBQ2xEO0FBQ0YsYUFBSyxNQUFMO0FBQ0VMLGdCQUFNLElBQUkvQixRQUFKLENBQWFoQixVQUFiLEVBQXlCQyxLQUF6QixFQUFnQ21ELE1BQWhDLENBQU4sQ0FERixDQUNpRDtBQUMvQztBQUNGLGFBQUssUUFBTDtBQUNFTCxnQkFBTSxJQUFJekIsVUFBSixDQUFldEIsVUFBZixFQUEyQkMsS0FBM0IsRUFBa0NtRCxNQUFsQyxDQUFOLENBREYsQ0FDbUQ7QUFDakQ7QUFDRixhQUFLLE1BQUw7QUFDRUwsZ0JBQU0sSUFBSWhCLFFBQUosQ0FBYS9CLFVBQWIsRUFBeUJDLEtBQXpCLEVBQWdDbUQsTUFBaEMsQ0FBTixDQURGLENBQ2lEO0FBQy9DO0FBQ0YsYUFBSyxTQUFMO0FBQ0VMLGdCQUFNLElBQUliLFdBQUosQ0FBZ0JsQyxVQUFoQixFQUE0QkMsS0FBNUIsRUFBbUNtRCxNQUFuQyxDQUFOO0FBQ0E7QUFmSjs7QUFrQkEsYUFBT0wsR0FBUDtBQUNEOzs7OztrQkFHWVYsZSIsImZpbGUiOiJDb250cm9sbGVyU2NlbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb250cm9sbGVycyBmcm9tICdiYXNpYy1jb250cm9sbGVycyc7XG5pbXBvcnQgVmlldyBmcm9tICcuLi92aWV3cy9WaWV3JztcblxuY29udHJvbGxlcnMuc2V0VGhlbWUoJ2RhcmsnKTtcblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vKiBHVUlzXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQm9vbGVhbkd1aSB7XG4gIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIHBhcmFtLCBndWlPcHRpb25zKSB7XG4gICAgY29uc3QgeyBsYWJlbCwgdmFsdWUgfSA9IHBhcmFtO1xuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGNvbnRyb2xsZXJzLlRvZ2dsZSh7XG4gICAgICBsYWJlbDogbGFiZWwsXG4gICAgICBkZWZhdWx0OiB2YWx1ZSxcbiAgICAgIGNvbnRhaW5lcjogJGNvbnRhaW5lcixcbiAgICAgIGNhbGxiYWNrOiAodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICAgIGNvbnN0IG1zZyA9IGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIFwiJHtwYXJhbS5uYW1lfToke3ZhbHVlfVwiYDtcbiAgICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICAgIH1cblxuICAgICAgICBwYXJhbS51cGRhdGUodmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9FbnVtR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgcGFyYW0sIGd1aU9wdGlvbnMpIHtcbiAgICBjb25zdCB7IGxhYmVsLCBvcHRpb25zLCB2YWx1ZSB9ID0gcGFyYW07XG5cbiAgICBjb25zdCBjdG9yID0gZ3VpT3B0aW9ucy50eXBlID09PSAnYnV0dG9ucycgP1xuICAgICAgY29udHJvbGxlcnMuU2VsZWN0QnV0dG9ucyA6IGNvbnRyb2xsZXJzLlNlbGVjdExpc3RcblxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBjdG9yKHtcbiAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICBkZWZhdWx0OiB2YWx1ZSxcbiAgICAgIGNvbnRhaW5lcjogJGNvbnRhaW5lcixcbiAgICAgIGNhbGxiYWNrOiAodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICAgIGNvbnN0IG1zZyA9IGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIFwiJHtwYXJhbS5uYW1lfToke3ZhbHVlfVwiYDtcbiAgICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICAgIH1cblxuICAgICAgICBwYXJhbS51cGRhdGUodmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9OdW1iZXJHdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCBwYXJhbSwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCB2YWx1ZSB9ID0gcGFyYW07XG5cbiAgICBpZiAoZ3VpT3B0aW9ucy50eXBlID09PSAnc2xpZGVyJykge1xuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGNvbnRyb2xsZXJzLlNsaWRlcih7XG4gICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgbWluOiBtaW4sXG4gICAgICAgIG1heDogbWF4LFxuICAgICAgICBzdGVwOiBzdGVwLFxuICAgICAgICBkZWZhdWx0OiB2YWx1ZSxcbiAgICAgICAgdW5pdDogZ3VpT3B0aW9ucy5wYXJhbSA/IGd1aU9wdGlvbnMucGFyYW0gOiAnJyxcbiAgICAgICAgc2l6ZTogZ3VpT3B0aW9ucy5zaXplLFxuICAgICAgICBjb250YWluZXI6ICRjb250YWluZXIsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGNvbnRyb2xsZXJzLk51bWJlckJveCh7XG4gICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgbWluOiBtaW4sXG4gICAgICAgIG1heDogbWF4LFxuICAgICAgICBzdGVwOiBzdGVwLFxuICAgICAgICBkZWZhdWx0OiB2YWx1ZSxcbiAgICAgICAgY29udGFpbmVyOiAkY29udGFpbmVyLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5jb250cm9sbGVyLmFkZExpc3RlbmVyKCh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7cGFyYW0ubmFtZX06JHt2YWx1ZX1cImA7XG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgIH1cblxuICAgICAgcGFyYW0udXBkYXRlKHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfVGV4dEd1aSB7XG4gIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIHBhcmFtLCBndWlPcHRpb25zKSB7XG4gICAgY29uc3QgeyBsYWJlbCwgdmFsdWUgfSA9IHBhcmFtO1xuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGNvbnRyb2xsZXJzLlRleHQoe1xuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgZGVmYXVsdDogdmFsdWUsXG4gICAgICByZWFkb25seTogZ3VpT3B0aW9ucy5yZWFkb25seSxcbiAgICAgIGNvbnRhaW5lcjogJGNvbnRhaW5lcixcbiAgICB9KTtcblxuICAgIGlmICghZ3VpT3B0aW9ucy5yZWFkb25seSkge1xuICAgICAgdGhpcy5jb250cm9sbGVyLmFkZExpc3RlbmVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAoZ3VpT3B0aW9ucy5jb25maXJtKSB7XG4gICAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3BhcmFtLm5hbWV9XCJgO1xuICAgICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgICAgfVxuXG4gICAgICAgIHBhcmFtLnVwZGF0ZSh2YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RyaWdnZXJHdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCBwYXJhbSwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwgfSA9IHBhcmFtO1xuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGNvbnRyb2xsZXJzLlRyaWdnZXJCdXR0b25zKHtcbiAgICAgIG9wdGlvbnM6IFtsYWJlbF0sXG4gICAgICBjb250YWluZXI6ICRjb250YWluZXIsXG4gICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICBpZiAoZ3VpT3B0aW9ucy5jb25maXJtKSB7XG4gICAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3BhcmFtLm5hbWV9XCJgO1xuICAgICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgICAgfVxuXG4gICAgICAgIHBhcmFtLnVwZGF0ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkgeyAvKiBub3RoaW5nIHRvIHNldCBoZXJlICovIH1cbn1cblxuY29uc3QgU0NFTkVfSUQgPSAnYmFzaWMtc2hhcmVkLWNvbnRyb2xsZXInO1xuXG4vKipcbiAqIFRoZSBgQ29udHJvbGxlclNjZW5lYCBzY2VuZSBwcm9wb3NlIGEgc2ltcGxlIC8gZGVmYXVsdCB3YXkgdG8gY3JlYXRlXG4gKiBhIGNvbnRyb2xsZXIgdmlldyBmb3IgdGhlIGBzaGFyZWQtcGFyYW1zYCBzZXJ2aWNlLlxuICpcbiAqIEVhY2ggY29udHJvbGxlciBjb21lcyB3aXRoIGEgc2V0IG9mIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkIHRvIHRoZVxuICogY29uc3RydWN0b3IuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQHNlZSBbYHNoYXJlZC1wYXJhbXNgIHNlcnZpY2Vde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRQYXJhbXN9XG4gKi9cbmNsYXNzIENvbnRyb2xsZXJTY2VuZSB7XG4gIC8qKlxuICAgKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgQVBJIGlzIHVuc3RhYmxlLCBhbmRcbiAgICogc3ViamVjdCB0byBjaGFuZ2UgaW4gZnVydGhlciB2ZXJzaW9ucy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGV4cGVyaWVuY2UsIHNoYXJlZFBhcmFtcykge1xuICAgIGlmICghc2hhcmVkUGFyYW1zKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIHNlcnZpY2UgcmVxdWlyZXMgdGhlIFwic2hhcmVkIHBhcmFtc1wiIHNlcnZpY2UnKTtcblxuICAgIHRoaXMuX2d1aU9wdGlvbnMgPSB7fTtcblxuICAgIHRoaXMuZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2U7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMgPSBzaGFyZWRQYXJhbXM7XG4gIH1cblxuICBlbnRlcigpIHtcbiAgICB0aGlzLnZpZXcgPSBuZXcgVmlldygpO1xuICAgIHRoaXMudmlldy5vcHRpb25zLmlkID0gJ2Jhc2ljLXNoYXJlZC1jb250cm9sbGVyJztcblxuICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICB0aGlzLnZpZXcuYXBwZW5kVG8odGhpcy5leHBlcmllbmNlLmNvbnRhaW5lcik7XG5cbiAgICBmb3IgKGxldCBuYW1lIGluIHRoaXMuc2hhcmVkUGFyYW1zLnBhcmFtcykge1xuICAgICAgY29uc3QgcGFyYW0gPSB0aGlzLnNoYXJlZFBhcmFtcy5wYXJhbXNbbmFtZV07XG4gICAgICBjb25zdCBndWkgPSB0aGlzLl9jcmVhdGVHdWkocGFyYW0pO1xuXG4gICAgICBwYXJhbS5hZGRMaXN0ZW5lcigndXBkYXRlJywgKHZhbCkgPT4gZ3VpLnNldCh2YWwpKTtcbiAgICB9XG4gIH1cblxuICBleGl0KCkge1xuICAgIGZvciAobGV0IG5hbWUgaW4gdGhpcy5zaGFyZWRQYXJhbXMucGFyYW1zKSB7XG4gICAgICBjb25zdCBwYXJhbSA9IHRoaXMuc2hhcmVkUGFyYW1zLnBhcmFtc1tuYW1lXTtcbiAgICAgIHBhcmFtLnJlbW92ZUxpc3RlbmVyKCd1cGRhdGUnKTtcbiAgICB9XG5cbiAgICB0aGlzLnZpZXcucmVtb3ZlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlIHRoZSBHVUkgZm9yIGEgZ2l2ZW4gcGFyYW1ldGVyLCB0aGlzIG1ldGhvZCBvbmx5IG1ha2VzIHNlbnMgaWZcbiAgICogYG9wdGlvbnMuaGFzR1VJPXRydWVgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byBjb25maWd1cmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHBhcmFtZXRlciBHVUkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnR5cGUgLSBUeXBlIG9mIEdVSSB0byB1c2UuIEVhY2ggdHlwZSBvZiBwYXJhbWV0ZXIgY2FuXG4gICAqICB1c2VkIHdpdGggZGlmZmVyZW50IEdVSSBhY2NvcmRpbmcgdG8gdGhlaXIgdHlwZSBhbmQgY29tZXMgd2l0aCBhY2NlcHRhYmxlXG4gICAqICBkZWZhdWx0IHZhbHVlcy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93PXRydWVdIC0gRGlzcGxheSBvciBub3QgdGhlIEdVSSBmb3IgdGhpcyBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuY29uZmlybT1mYWxzZV0gLSBBc2sgZm9yIGNvbmZpcm1hdGlvbiB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgKi9cbiAgc2V0R3VpT3B0aW9ucyhuYW1lLCBvcHRpb25zKSB7XG4gICAgdGhpcy5fZ3VpT3B0aW9uc1tuYW1lXSA9IG9wdGlvbnM7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2NyZWF0ZUd1aShwYXJhbSkge1xuICAgIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIGNvbmZpcm06IGZhbHNlLFxuICAgIH0sIHRoaXMuX2d1aU9wdGlvbnNbcGFyYW0ubmFtZV0pO1xuXG4gICAgaWYgKGNvbmZpZy5zaG93ID09PSBmYWxzZSkgcmV0dXJuIG51bGw7XG5cbiAgICBsZXQgZ3VpID0gbnVsbDtcbiAgICBjb25zdCAkY29udGFpbmVyID0gdGhpcy52aWV3LiRlbDtcblxuICAgIHN3aXRjaCAocGFyYW0udHlwZSkge1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIGd1aSA9IG5ldyBfQm9vbGVhbkd1aSgkY29udGFpbmVyLCBwYXJhbSwgY29uZmlnKTsgLy8gYFRvZ2dsZWBcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlbnVtJzpcbiAgICAgICAgZ3VpID0gbmV3IF9FbnVtR3VpKCRjb250YWluZXIsIHBhcmFtLCBjb25maWcpOyAvLyBgU2VsZWN0TGlzdGAgb3IgYFNlbGVjdEJ1dHRvbnNgXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgZ3VpID0gbmV3IF9OdW1iZXJHdWkoJGNvbnRhaW5lciwgcGFyYW0sIGNvbmZpZyk7IC8vIGBOdW1iZXJCb3hgIG9yIGBTbGlkZXJgXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgIGd1aSA9IG5ldyBfVGV4dEd1aSgkY29udGFpbmVyLCBwYXJhbSwgY29uZmlnKTsgLy8gYFRleHRgXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndHJpZ2dlcic6XG4gICAgICAgIGd1aSA9IG5ldyBfVHJpZ2dlckd1aSgkY29udGFpbmVyLCBwYXJhbSwgY29uZmlnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGd1aTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyU2NlbmU7XG4iXX0=