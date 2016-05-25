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

var SCENE_ID = 'conductor';

/**
 * Scene definition
 */

var Conductor = function (_Scene) {
  (0, _inherits3.default)(Conductor, _Scene);

  /**
   * _<span class="warning">__WARNING__</span> This API is unstable, and
   * subject to change in further versions.
   */

  function Conductor() {
    (0, _classCallCheck3.default)(this, Conductor);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Conductor).call(this, SCENE_ID, true));

    _this._guiOptions = {};

    _this._errorReporter = _this.require('error-reporter');
    _this._sharedParams = _this.require('shared-params');
    return _this;
  }

  (0, _createClass3.default)(Conductor, [{
    key: 'init',
    value: function init() {
      this.view = this.createView();
    }
  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Conductor.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.show();

      for (var name in this._sharedParams.params) {
        this.createGui(this._sharedParams.params[name]);
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
  return Conductor;
}(_Scene3.default);

exports.default = Conductor;
//# sourceMappingURL=data:application/json;base64,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QixFQUFrQyxNQUFsQyxDQUFOLEM7QUFDQTtBQUNGLGFBQUssTUFBTDtBQUNFLGdCQUFNLElBQUksUUFBSixDQUFhLFVBQWIsRUFBeUIsS0FBekIsRUFBZ0MsTUFBaEMsQ0FBTixDO0FBQ0E7QUFDRixhQUFLLFNBQUw7QUFDRSxnQkFBTSxJQUFJLFdBQUosQ0FBZ0IsVUFBaEIsRUFBNEIsS0FBNUIsRUFBbUMsTUFBbkMsQ0FBTjtBQUNBO0FBZko7O0FBa0JBLFlBQU0sV0FBTixDQUFrQixRQUFsQixFQUE0QixVQUFDLEdBQUQ7QUFBQSxlQUFTLElBQUksR0FBSixDQUFRLEdBQVIsQ0FBVDtBQUFBLE9BQTVCO0FBQ0Q7Ozs7O2tCQTVFa0IsUyIsImZpbGUiOiJDb25kdWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBiYXNpY0NvbnRyb2xsZXJzIGZyb20gJ3dhdmVzLWJhc2ljLWNvbnRyb2xsZXJzJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IFNjZW5lIGZyb20gJy4uL2NvcmUvU2NlbmUnO1xuXG5iYXNpY0NvbnRyb2xsZXJzLmRpc2FibGVTdHlsZXMoKTtcblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vKiBHVUlzXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQm9vbGVhbkd1aSB7XG4gIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIHBhcmFtLCBndWlPcHRpb25zKSB7XG4gICAgY29uc3QgeyBsYWJlbCwgdmFsdWUgfSA9IHBhcmFtO1xuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuVG9nZ2xlKGxhYmVsLCB2YWx1ZSk7XG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAodmFsdWUpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3BhcmFtLm5hbWV9OiR7dmFsdWV9XCJgO1xuICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICB9XG5cbiAgICAgIHBhcmFtLnVwZGF0ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0VudW1HdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCBwYXJhbSwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIG9wdGlvbnMsIHZhbHVlIH0gPSBwYXJhbTtcblxuICAgIGNvbnN0IGN0b3IgPSBndWlPcHRpb25zLnR5cGUgPT09ICdidXR0b25zJyA/XG4gICAgICBiYXNpY0NvbnRyb2xsZXJzLlNlbGVjdEJ1dHRvbnMgOiBiYXNpY0NvbnRyb2xsZXJzLlNlbGVjdExpc3RcblxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBjdG9yKGxhYmVsLCBvcHRpb25zLCB2YWx1ZSk7XG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAodmFsdWUpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3BhcmFtLm5hbWV9OiR7dmFsdWV9XCJgO1xuICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICB9XG5cbiAgICAgIHBhcmFtLnVwZGF0ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX051bWJlckd1aSB7XG4gIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIHBhcmFtLCBndWlPcHRpb25zKSB7XG4gICAgY29uc3QgeyBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIHZhbHVlIH0gPSBwYXJhbTtcblxuICAgIGlmIChndWlPcHRpb25zLnR5cGUgPT09ICdzbGlkZXInKVxuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuU2xpZGVyKGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdmFsdWUsIGd1aU9wdGlvbnMucGFyYW0sIGd1aU9wdGlvbnMuc2l6ZSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IGJhc2ljQ29udHJvbGxlcnMuTnVtYmVyQm94KGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdmFsdWUpO1xuXG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIucmVuZGVyKCkpO1xuICAgIHRoaXMuY29udHJvbGxlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy5jb250cm9sbGVyLm9uKCdjaGFuZ2UnLCAodmFsdWUpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3BhcmFtLm5hbWV9OiR7dmFsdWV9XCJgO1xuICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICB9XG5cbiAgICAgIHBhcmFtLnVwZGF0ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RleHRHdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCBwYXJhbSwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIHZhbHVlIH0gPSBwYXJhbTtcblxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBiYXNpY0NvbnRyb2xsZXJzLlRleHQobGFiZWwsIHZhbHVlLCBndWlPcHRpb25zLnJlYWRPbmx5KTtcbiAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5yZW5kZXIoKSk7XG4gICAgdGhpcy5jb250cm9sbGVyLm9uUmVuZGVyKCk7XG5cbiAgICBpZiAoIWd1aU9wdGlvbnMucmVhZE9ubHkpIHtcbiAgICAgIHRoaXMuY29udHJvbGxlci5vbignY2hhbmdlJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7cGFyYW0ubmFtZX1cImA7XG4gICAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtc2cpKSB7IHJldHVybjsgfVxuICAgICAgICB9XG5cbiAgICAgICAgcGFyYW0udXBkYXRlKHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfVHJpZ2dlckd1aSB7XG4gIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIHBhcmFtLCBndWlPcHRpb25zKSB7XG4gICAgY29uc3QgeyBsYWJlbCB9ID0gcGFyYW07XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgYmFzaWNDb250cm9sbGVycy5CdXR0b25zKCcnLCBbbGFiZWxdKTtcbiAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5yZW5kZXIoKSk7XG4gICAgdGhpcy5jb250cm9sbGVyLm9uUmVuZGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3BhcmFtLm5hbWV9XCJgO1xuICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICB9XG5cbiAgICAgIHBhcmFtLnVwZGF0ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbCkgeyAvKiBub3RoaW5nIHRvIHNldCBoZXJlICovIH1cbn1cblxuY29uc3QgU0NFTkVfSUQgPSAnY29uZHVjdG9yJztcblxuLyoqXG4gKiBTY2VuZSBkZWZpbml0aW9uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbmR1Y3RvciBleHRlbmRzIFNjZW5lIHtcbiAgLyoqXG4gICAqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBBUEkgaXMgdW5zdGFibGUsIGFuZFxuICAgKiBzdWJqZWN0IHRvIGNoYW5nZSBpbiBmdXJ0aGVyIHZlcnNpb25zLlxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0NFTkVfSUQsIHRydWUpO1xuXG4gICAgdGhpcy5fZ3VpT3B0aW9ucyA9IHt9O1xuXG4gICAgdGhpcy5fZXJyb3JSZXBvcnRlciA9IHRoaXMucmVxdWlyZSgnZXJyb3ItcmVwb3J0ZXInKTtcbiAgICB0aGlzLl9zaGFyZWRQYXJhbXMgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2hvdygpO1xuXG4gICAgZm9yIChsZXQgbmFtZSBpbiB0aGlzLl9zaGFyZWRQYXJhbXMucGFyYW1zKVxuICAgICAgdGhpcy5jcmVhdGVHdWkodGhpcy5fc2hhcmVkUGFyYW1zLnBhcmFtc1tuYW1lXSk7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlIHRoZSBHVUkgZm9yIGEgZ2l2ZW4gcGFyYW1ldGVyLCB0aGlzIG1ldGhvZCBvbmx5IG1ha2VzIHNlbnMgaWZcbiAgICogYG9wdGlvbnMuaGFzR1VJPXRydWVgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byBjb25maWd1cmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHBhcmFtZXRlciBHVUkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnR5cGUgLSBUeXBlIG9mIEdVSSB0byB1c2UuIEVhY2ggdHlwZSBvZiBwYXJhbWV0ZXIgY2FuXG4gICAqICB1c2VkIHdpdGggZGlmZmVyZW50IEdVSSBhY2NvcmRpbmcgdG8gdGhlaXIgdHlwZSBhbmQgY29tZXMgd2l0aCBhY2NlcHRhYmxlXG4gICAqICBkZWZhdWx0IHZhbHVlcy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93PXRydWVdIC0gRGlzcGxheSBvciBub3QgdGhlIEdVSSBmb3IgdGhpcyBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuY29uZmlybT1mYWxzZV0gLSBBc2sgZm9yIGNvbmZpcm1hdGlvbiB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgKi9cbiAgc2V0R3VpT3B0aW9ucyhuYW1lLCBvcHRpb25zKSB7XG4gICAgdGhpcy5fZ3VpT3B0aW9uc1tuYW1lXSA9IG9wdGlvbnM7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY3JlYXRlR3VpKHBhcmFtKSB7XG4gICAgY29uc3QgY29uZmlnID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgY29uZmlybTogZmFsc2UsXG4gICAgfSwgdGhpcy5fZ3VpT3B0aW9uc1twYXJhbS5uYW1lXSk7XG5cbiAgICBpZiAoY29uZmlnLnNob3cgPT09IGZhbHNlKSByZXR1cm4gbnVsbDtcblxuICAgIGxldCBndWkgPSBudWxsO1xuICAgIGNvbnN0ICRjb250YWluZXIgPSB0aGlzLnZpZXcuJGVsO1xuXG4gICAgc3dpdGNoIChwYXJhbS50eXBlKSB7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgZ3VpID0gbmV3IF9Cb29sZWFuR3VpKCRjb250YWluZXIsIHBhcmFtLCBjb25maWcpOyAvLyBgVG9nZ2xlYFxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2VudW0nOlxuICAgICAgICBndWkgPSBuZXcgX0VudW1HdWkoJGNvbnRhaW5lciwgcGFyYW0sIGNvbmZpZyk7IC8vIGBTZWxlY3RMaXN0YCBvciBgU2VsZWN0QnV0dG9uc2BcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBndWkgPSBuZXcgX051bWJlckd1aSgkY29udGFpbmVyLCBwYXJhbSwgY29uZmlnKTsgLy8gYE51bWJlckJveGAgb3IgYFNsaWRlcmBcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgZ3VpID0gbmV3IF9UZXh0R3VpKCRjb250YWluZXIsIHBhcmFtLCBjb25maWcpOyAvLyBgVGV4dGBcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0cmlnZ2VyJzpcbiAgICAgICAgZ3VpID0gbmV3IF9UcmlnZ2VyR3VpKCRjb250YWluZXIsIHBhcmFtLCBjb25maWcpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBwYXJhbS5hZGRMaXN0ZW5lcigndXBkYXRlJywgKHZhbCkgPT4gZ3VpLnNldCh2YWwpKTtcbiAgfVxufVxuIl19