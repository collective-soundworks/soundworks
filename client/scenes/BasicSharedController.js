'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _wavesBasicControllers = require('waves-basic-controllers');

var basicControllers = _interopRequireWildcard(_wavesBasicControllers);

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

var _Scene2 = require('../core/Scene');

var _Scene3 = _interopRequireDefault(_Scene2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

basicControllers.disableStyles();

/* --------------------------------------------------------- */
/* GUIs
/* --------------------------------------------------------- */

/** @private */

var _BooleanGui = function () {
  function _BooleanGui($container, param, guiOptions) {
    (0, _classCallCheck3.default)(this, _BooleanGui);
    var label = param.label;
    var value = param.value;


    this.controller = new basicControllers.Toggle(label, value);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', function (value) {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + param.name + ':' + value + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      param.update(value);
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
    var label = param.label;
    var options = param.options;
    var value = param.value;


    var ctor = guiOptions.type === 'buttons' ? basicControllers.SelectButtons : basicControllers.SelectList;

    this.controller = new ctor(label, options, value);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', function (value) {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + param.name + ':' + value + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      param.update(value);
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
    var label = param.label;
    var min = param.min;
    var max = param.max;
    var step = param.step;
    var value = param.value;


    if (guiOptions.type === 'slider') this.controller = new basicControllers.Slider(label, min, max, step, value, guiOptions.param, guiOptions.size);else this.controller = new basicControllers.NumberBox(label, min, max, step, value);

    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', function (value) {
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
    var label = param.label;
    var value = param.value;


    this.controller = new basicControllers.Text(label, value, guiOptions.readOnly);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    if (!guiOptions.readOnly) {
      this.controller.on('change', function (value) {
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


    this.controller = new basicControllers.Buttons('', [label]);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', function () {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + param.name + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      param.update();
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
 * The `BasicSharedController` scene propose a simple / default way to create
 * a client controller for the `shared-params` service.
 *
 * Each controller comes with a set of options that can be passed to the
 * constructor.
 *
 * @memberof module:soundworks/client
 * @see [`shared-params` service]{@link module:soundworks/client.SharedParams}
 */

var BasicSharedController = function (_Scene) {
  (0, _inherits3.default)(BasicSharedController, _Scene);

  /**
   * _<span class="warning">__WARNING__</span> This API is unstable, and
   * subject to change in further versions.
   */
  function BasicSharedController() {
    var guiOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, BasicSharedController);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BasicSharedController.__proto__ || (0, _getPrototypeOf2.default)(BasicSharedController)).call(this, SCENE_ID, true));

    _this._guiOptions = guiOptions;

    _this._errorReporter = _this.require('error-reporter');

    /**
     * Instance of the client-side `shared-params` service.
     * @type {module:soundworks/client.SharedParams}
     * @name sharedParams
     * @instance
     * @memberof module:soundworks/client.SharedParams
     */
    _this.sharedParams = _this.require('shared-params');
    return _this;
  }

  (0, _createClass3.default)(BasicSharedController, [{
    key: 'init',
    value: function init() {
      this.view = this.createView();
    }
  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)(BasicSharedController.prototype.__proto__ || (0, _getPrototypeOf2.default)(BasicSharedController.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.show();

      for (var name in this.sharedParams.params) {
        this.createGui(this.sharedParams.params[name]);
      }
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
    key: 'createGui',
    value: function createGui(param) {
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

      param.addListener('update', function (val) {
        return gui.set(val);
      });
    }
  }]);
  return BasicSharedController;
}(_Scene3.default);

exports.default = BasicSharedController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2ljU2hhcmVkQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJiYXNpY0NvbnRyb2xsZXJzIiwiZGlzYWJsZVN0eWxlcyIsIl9Cb29sZWFuR3VpIiwiJGNvbnRhaW5lciIsInBhcmFtIiwiZ3VpT3B0aW9ucyIsImxhYmVsIiwidmFsdWUiLCJjb250cm9sbGVyIiwiVG9nZ2xlIiwiYXBwZW5kQ2hpbGQiLCJyZW5kZXIiLCJvblJlbmRlciIsIm9uIiwiY29uZmlybSIsIm1zZyIsIm5hbWUiLCJ3aW5kb3ciLCJ1cGRhdGUiLCJ2YWwiLCJfRW51bUd1aSIsIm9wdGlvbnMiLCJjdG9yIiwidHlwZSIsIlNlbGVjdEJ1dHRvbnMiLCJTZWxlY3RMaXN0IiwiX051bWJlckd1aSIsIm1pbiIsIm1heCIsInN0ZXAiLCJTbGlkZXIiLCJzaXplIiwiTnVtYmVyQm94IiwiX1RleHRHdWkiLCJUZXh0IiwicmVhZE9ubHkiLCJfVHJpZ2dlckd1aSIsIkJ1dHRvbnMiLCJTQ0VORV9JRCIsIkJhc2ljU2hhcmVkQ29udHJvbGxlciIsIl9ndWlPcHRpb25zIiwiX2Vycm9yUmVwb3J0ZXIiLCJyZXF1aXJlIiwic2hhcmVkUGFyYW1zIiwidmlldyIsImNyZWF0ZVZpZXciLCJoYXNTdGFydGVkIiwiaW5pdCIsInNob3ciLCJwYXJhbXMiLCJjcmVhdGVHdWkiLCJjb25maWciLCJndWkiLCIkZWwiLCJhZGRMaXN0ZW5lciIsInNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxnQjs7QUFDWjs7OztBQUNBOzs7Ozs7OztBQUVBQSxpQkFBaUJDLGFBQWpCOztBQUVBO0FBQ0E7OztBQUdBOztJQUNNQyxXO0FBQ0osdUJBQVlDLFVBQVosRUFBd0JDLEtBQXhCLEVBQStCQyxVQUEvQixFQUEyQztBQUFBO0FBQUEsUUFDakNDLEtBRGlDLEdBQ2hCRixLQURnQixDQUNqQ0UsS0FEaUM7QUFBQSxRQUMxQkMsS0FEMEIsR0FDaEJILEtB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Q0FDb0Q7QUFDbEQ7QUFDRixhQUFLLE1BQUw7QUFDRUMsZ0JBQU0sSUFBSWhDLFFBQUosQ0FBYWpCLFVBQWIsRUFBeUJDLEtBQXpCLEVBQWdDK0MsTUFBaEMsQ0FBTixDQURGLENBQ2lEO0FBQy9DO0FBQ0YsYUFBSyxRQUFMO0FBQ0VDLGdCQUFNLElBQUkxQixVQUFKLENBQWV2QixVQUFmLEVBQTJCQyxLQUEzQixFQUFrQytDLE1BQWxDLENBQU4sQ0FERixDQUNtRDtBQUNqRDtBQUNGLGFBQUssTUFBTDtBQUNFQyxnQkFBTSxJQUFJbkIsUUFBSixDQUFhOUIsVUFBYixFQUF5QkMsS0FBekIsRUFBZ0MrQyxNQUFoQyxDQUFOLENBREYsQ0FDaUQ7QUFDL0M7QUFDRixhQUFLLFNBQUw7QUFDRUMsZ0JBQU0sSUFBSWhCLFdBQUosQ0FBZ0JqQyxVQUFoQixFQUE0QkMsS0FBNUIsRUFBbUMrQyxNQUFuQyxDQUFOO0FBQ0E7QUFmSjs7QUFrQkEvQyxZQUFNa0QsV0FBTixDQUFrQixRQUFsQixFQUE0QixVQUFDbkMsR0FBRDtBQUFBLGVBQVNpQyxJQUFJRyxHQUFKLENBQVFwQyxHQUFSLENBQVQ7QUFBQSxPQUE1QjtBQUNEOzs7OztrQkFwRmtCb0IscUIiLCJmaWxlIjoiQmFzaWNTaGFyZWRDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYmFzaWNDb250cm9sbGVycyBmcm9tICd3YXZlcy1iYXNpYy1jb250cm9sbGVycyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBTY2VuZSBmcm9tICcuLi9jb3JlL1NjZW5lJztcblxuYmFzaWNDb250cm9sbGVycy5kaXNhYmxlU3R5bGVzKCk7XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLyogR1VJc1xuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0Jvb2xlYW5HdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCBwYXJhbSwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIHZhbHVlIH0gPSBwYXJhbTtcblxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBiYXNpY0NvbnRyb2xsZXJzLlRvZ2dsZShsYWJlbCwgdmFsdWUpO1xuICAgICRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLnJlbmRlcigpKTtcbiAgICB0aGlzLmNvbnRyb2xsZXIub25SZW5kZXIoKTtcblxuICAgIHRoaXMuY29udHJvbGxlci5vbignY2hhbmdlJywgKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoZ3VpT3B0aW9ucy5jb25maXJtKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIFwiJHtwYXJhbS5uYW1lfToke3ZhbHVlfVwiYDtcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtc2cpKSB7IHJldHVybjsgfVxuICAgICAgfVxuXG4gICAgICBwYXJhbS51cGRhdGUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9FbnVtR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgcGFyYW0sIGd1aU9wdGlvbnMpIHtcbiAgICBjb25zdCB7IGxhYmVsLCBvcHRpb25zLCB2YWx1ZSB9ID0gcGFyYW07XG5cbiAgICBjb25zdCBjdG9yID0gZ3VpT3B0aW9ucy50eXBlID09PSAnYnV0dG9ucycgP1xuICAgICAgYmFzaWNDb250cm9sbGVycy5TZWxlY3RCdXR0b25zIDogYmFzaWNDb250cm9sbGVycy5TZWxlY3RMaXN0XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgY3RvcihsYWJlbCwgb3B0aW9ucywgdmFsdWUpO1xuICAgICRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLnJlbmRlcigpKTtcbiAgICB0aGlzLmNvbnRyb2xsZXIub25SZW5kZXIoKTtcblxuICAgIHRoaXMuY29udHJvbGxlci5vbignY2hhbmdlJywgKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoZ3VpT3B0aW9ucy5jb25maXJtKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIFwiJHtwYXJhbS5uYW1lfToke3ZhbHVlfVwiYDtcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtc2cpKSB7IHJldHVybjsgfVxuICAgICAgfVxuXG4gICAgICBwYXJhbS51cGRhdGUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9OdW1iZXJHdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCBwYXJhbSwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIG1pbiwgbWF4LCBzdGVwLCB2YWx1ZSB9ID0gcGFyYW07XG5cbiAgICBpZiAoZ3VpT3B0aW9ucy50eXBlID09PSAnc2xpZGVyJylcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBiYXNpY0NvbnRyb2xsZXJzLlNsaWRlcihsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIHZhbHVlLCBndWlPcHRpb25zLnBhcmFtLCBndWlPcHRpb25zLnNpemUpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBiYXNpY0NvbnRyb2xsZXJzLk51bWJlckJveChsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIHZhbHVlKTtcblxuICAgICRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLnJlbmRlcigpKTtcbiAgICB0aGlzLmNvbnRyb2xsZXIub25SZW5kZXIoKTtcblxuICAgIHRoaXMuY29udHJvbGxlci5vbignY2hhbmdlJywgKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoZ3VpT3B0aW9ucy5jb25maXJtKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIFwiJHtwYXJhbS5uYW1lfToke3ZhbHVlfVwiYDtcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtc2cpKSB7IHJldHVybjsgfVxuICAgICAgfVxuXG4gICAgICBwYXJhbS51cGRhdGUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UZXh0R3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgcGFyYW0sIGd1aU9wdGlvbnMpIHtcbiAgICBjb25zdCB7IGxhYmVsLCB2YWx1ZSB9ID0gcGFyYW07XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgYmFzaWNDb250cm9sbGVycy5UZXh0KGxhYmVsLCB2YWx1ZSwgZ3VpT3B0aW9ucy5yZWFkT25seSk7XG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgaWYgKCFndWlPcHRpb25zLnJlYWRPbmx5KSB7XG4gICAgICB0aGlzLmNvbnRyb2xsZXIub24oJ2NoYW5nZScsICh2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAoZ3VpT3B0aW9ucy5jb25maXJtKSB7XG4gICAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3BhcmFtLm5hbWV9XCJgO1xuICAgICAgICAgIGlmICghd2luZG93LmNvbmZpcm0obXNnKSkgeyByZXR1cm47IH1cbiAgICAgICAgfVxuXG4gICAgICAgIHBhcmFtLnVwZGF0ZSh2YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RyaWdnZXJHdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCBwYXJhbSwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwgfSA9IHBhcmFtO1xuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuQnV0dG9ucygnJywgW2xhYmVsXSk7XG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBpZiAoZ3VpT3B0aW9ucy5jb25maXJtKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIFwiJHtwYXJhbS5uYW1lfVwiYDtcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtc2cpKSB7IHJldHVybjsgfVxuICAgICAgfVxuXG4gICAgICBwYXJhbS51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldCh2YWwpIHsgLyogbm90aGluZyB0byBzZXQgaGVyZSAqLyB9XG59XG5cbmNvbnN0IFNDRU5FX0lEID0gJ2Jhc2ljLXNoYXJlZC1jb250cm9sbGVyJztcblxuLyoqXG4gKiBUaGUgYEJhc2ljU2hhcmVkQ29udHJvbGxlcmAgc2NlbmUgcHJvcG9zZSBhIHNpbXBsZSAvIGRlZmF1bHQgd2F5IHRvIGNyZWF0ZVxuICogYSBjbGllbnQgY29udHJvbGxlciBmb3IgdGhlIGBzaGFyZWQtcGFyYW1zYCBzZXJ2aWNlLlxuICpcbiAqIEVhY2ggY29udHJvbGxlciBjb21lcyB3aXRoIGEgc2V0IG9mIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkIHRvIHRoZVxuICogY29uc3RydWN0b3IuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQHNlZSBbYHNoYXJlZC1wYXJhbXNgIHNlcnZpY2Vde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRQYXJhbXN9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljU2hhcmVkQ29udHJvbGxlciBleHRlbmRzIFNjZW5lIHtcbiAgLyoqXG4gICAqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBBUEkgaXMgdW5zdGFibGUsIGFuZFxuICAgKiBzdWJqZWN0IHRvIGNoYW5nZSBpbiBmdXJ0aGVyIHZlcnNpb25zLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZ3VpT3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoU0NFTkVfSUQsIHRydWUpO1xuXG4gICAgdGhpcy5fZ3VpT3B0aW9ucyA9IGd1aU9wdGlvbnM7XG5cbiAgICB0aGlzLl9lcnJvclJlcG9ydGVyID0gdGhpcy5yZXF1aXJlKCdlcnJvci1yZXBvcnRlcicpO1xuXG4gICAgLyoqXG4gICAgICogSW5zdGFuY2Ugb2YgdGhlIGNsaWVudC1zaWRlIGBzaGFyZWQtcGFyYW1zYCBzZXJ2aWNlLlxuICAgICAqIEB0eXBlIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkUGFyYW1zfVxuICAgICAqIEBuYW1lIHNoYXJlZFBhcmFtc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkUGFyYW1zXG4gICAgICovXG4gICAgdGhpcy5zaGFyZWRQYXJhbXMgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2hvdygpO1xuXG4gICAgZm9yIChsZXQgbmFtZSBpbiB0aGlzLnNoYXJlZFBhcmFtcy5wYXJhbXMpXG4gICAgICB0aGlzLmNyZWF0ZUd1aSh0aGlzLnNoYXJlZFBhcmFtcy5wYXJhbXNbbmFtZV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSB0aGUgR1VJIGZvciBhIGdpdmVuIHBhcmFtZXRlciwgdGhpcyBtZXRob2Qgb25seSBtYWtlcyBzZW5zIGlmXG4gICAqIGBvcHRpb25zLmhhc0dVST10cnVlYC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIgdG8gY29uZmlndXJlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBwYXJhbWV0ZXIgR1VJLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy50eXBlIC0gVHlwZSBvZiBHVUkgdG8gdXNlLiBFYWNoIHR5cGUgb2YgcGFyYW1ldGVyIGNhblxuICAgKiAgdXNlZCB3aXRoIGRpZmZlcmVudCBHVUkgYWNjb3JkaW5nIHRvIHRoZWlyIHR5cGUgYW5kIGNvbWVzIHdpdGggYWNjZXB0YWJsZVxuICAgKiAgZGVmYXVsdCB2YWx1ZXMuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvdz10cnVlXSAtIERpc3BsYXkgb3Igbm90IHRoZSBHVUkgZm9yIHRoaXMgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmNvbmZpcm09ZmFsc2VdIC0gQXNrIGZvciBjb25maXJtYXRpb24gd2hlbiB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICovXG4gIHNldEd1aU9wdGlvbnMobmFtZSwgb3B0aW9ucykge1xuICAgIHRoaXMuX2d1aU9wdGlvbnNbbmFtZV0gPSBvcHRpb25zO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNyZWF0ZUd1aShwYXJhbSkge1xuICAgIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIGNvbmZpcm06IGZhbHNlLFxuICAgIH0sIHRoaXMuX2d1aU9wdGlvbnNbcGFyYW0ubmFtZV0pO1xuXG4gICAgaWYgKGNvbmZpZy5zaG93ID09PSBmYWxzZSkgcmV0dXJuIG51bGw7XG5cbiAgICBsZXQgZ3VpID0gbnVsbDtcbiAgICBjb25zdCAkY29udGFpbmVyID0gdGhpcy52aWV3LiRlbDtcblxuICAgIHN3aXRjaCAocGFyYW0udHlwZSkge1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIGd1aSA9IG5ldyBfQm9vbGVhbkd1aSgkY29udGFpbmVyLCBwYXJhbSwgY29uZmlnKTsgLy8gYFRvZ2dsZWBcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlbnVtJzpcbiAgICAgICAgZ3VpID0gbmV3IF9FbnVtR3VpKCRjb250YWluZXIsIHBhcmFtLCBjb25maWcpOyAvLyBgU2VsZWN0TGlzdGAgb3IgYFNlbGVjdEJ1dHRvbnNgXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgZ3VpID0gbmV3IF9OdW1iZXJHdWkoJGNvbnRhaW5lciwgcGFyYW0sIGNvbmZpZyk7IC8vIGBOdW1iZXJCb3hgIG9yIGBTbGlkZXJgXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgIGd1aSA9IG5ldyBfVGV4dEd1aSgkY29udGFpbmVyLCBwYXJhbSwgY29uZmlnKTsgLy8gYFRleHRgXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndHJpZ2dlcic6XG4gICAgICAgIGd1aSA9IG5ldyBfVHJpZ2dlckd1aSgkY29udGFpbmVyLCBwYXJhbSwgY29uZmlnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcGFyYW0uYWRkTGlzdGVuZXIoJ3VwZGF0ZScsICh2YWwpID0+IGd1aS5zZXQodmFsKSk7XG4gIH1cbn1cbiJdfQ==