'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Scene2 = require('../core/Scene');

var _Scene3 = _interopRequireDefault(_Scene2);

var _View2 = require('../views/View');

var _View3 = _interopRequireDefault(_View2);

var _SegmentedView2 = require('../views/SegmentedView');

var _SegmentedView3 = _interopRequireDefault(_SegmentedView2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Renderers
 */

var BaseRenderer = function (_View) {
  (0, _inherits3.default)(BaseRenderer, _View);

  function BaseRenderer(parent, template, question) {
    (0, _classCallCheck3.default)(this, BaseRenderer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(BaseRenderer).call(this, template, question, {}, { className: 'question' }));

    _this.parent = parent;
    _this.question = question;
    _this.id = question.id;
    return _this;
  }

  (0, _createClass3.default)(BaseRenderer, [{
    key: 'onResize',
    value: function onResize(width, height, orientation) {}
  }]);
  return BaseRenderer;
}(_View3.default);

var radioTemplate = '\n  <p class="label"><%= label %></p>\n  <% for (var key in options) { %>\n    <p class="answer radio" data-key="<%= key %>"><%= options[key] %></p>\n  <% } %>\n';

var RadioRenderer = function (_BaseRenderer) {
  (0, _inherits3.default)(RadioRenderer, _BaseRenderer);

  function RadioRenderer(parent, question) {
    (0, _classCallCheck3.default)(this, RadioRenderer);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(RadioRenderer).call(this, parent, radioTemplate, question));

    _this2.answer = null;
    _this2._onSelect = _this2._onSelect.bind(_this2);
    return _this2;
  }

  (0, _createClass3.default)(RadioRenderer, [{
    key: 'onRender',
    value: function onRender() {
      this.installEvents({ 'click .answer': this._onSelect });
      this.$options = (0, _from2.default)(this.$el.querySelectorAll('.answer'));
    }
  }, {
    key: '_onSelect',
    value: function _onSelect(e) {
      var target = e.target;

      this.$options.forEach(function (el) {
        el.classList.remove('selected');
      });
      target.classList.add('selected');

      this.answer = target.getAttribute('data-key');

      this.parent.enableBtn();
    }
  }, {
    key: 'getAnswer',
    value: function getAnswer() {
      return this.answer;
    }
  }]);
  return RadioRenderer;
}(BaseRenderer);

var checkboxTemplate = '\n  <p class="label"><%= label %></p>\n  <% for (var key in options) { %>\n    <p class="answer checkbox" data-key="<%= key %>"><%= options[key] %></p>\n  <% } %>\n';

var CheckboxRenderer = function (_BaseRenderer2) {
  (0, _inherits3.default)(CheckboxRenderer, _BaseRenderer2);

  function CheckboxRenderer(parent, question) {
    (0, _classCallCheck3.default)(this, CheckboxRenderer);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(CheckboxRenderer).call(this, parent, checkboxTemplate, question));

    _this3.answers = [];
    _this3._onSelect = _this3._onSelect.bind(_this3);
    return _this3;
  }

  (0, _createClass3.default)(CheckboxRenderer, [{
    key: 'onRender',
    value: function onRender() {
      this.installEvents({ 'click .answer': this._onSelect });
    }
  }, {
    key: '_onSelect',
    value: function _onSelect(e) {
      var target = e.target;
      var key = target.getAttribute('data-key');
      var method = target.classList.contains('selected') ? 'remove' : 'add';

      if (method === 'add') {
        this.answers.push(key);
      } else if (method === 'remove') {
        this.answers.splice(this.answers.indexOf(key), 1);
      }

      target.classList[method]('selected');

      if (this.answers.length > 0) {
        this.parent.enableBtn();
      } else {
        this.parent.disableBtn();
      }
    }
  }, {
    key: 'getAnswer',
    value: function getAnswer() {
      return this.answers.length === 0 ? null : this.answers;
    }
  }]);
  return CheckboxRenderer;
}(BaseRenderer);

var rangeTemplate = '\n  <p class="label"><%= label %></p>\n  <input class="slider answer"\n    type="range"\n    min="<%= options.min %>"\n    max="<%= options.max %>"\n    step="<%= options.step %>"\n    value="<%= options.default %>" />\n  <span class="feedback"><%= options.default %></span>\n';

var RangeRenderer = function (_BaseRenderer3) {
  (0, _inherits3.default)(RangeRenderer, _BaseRenderer3);

  function RangeRenderer(parent, question) {
    (0, _classCallCheck3.default)(this, RangeRenderer);

    var _this4 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(RangeRenderer).call(this, parent, rangeTemplate, question));

    _this4.answer = null;
    _this4._onInput = _this4._onInput.bind(_this4);
    return _this4;
  }

  (0, _createClass3.default)(RangeRenderer, [{
    key: 'onRender',
    value: function onRender() {
      this.installEvents({ 'input .answer': this._onInput });
      this.$slider = this.$el.querySelector('.slider');
      this.$feedback = this.$el.querySelector('.feedback');
    }
  }, {
    key: '_onInput',
    value: function _onInput(e) {
      this.$feedback.textContent = this.$slider.value;
      this.answer = parseFloat(this.$slider.value);
      this.parent.enableBtn();
    }
  }, {
    key: 'getAnswer',
    value: function getAnswer() {
      return this.answer;
    }
  }]);
  return RangeRenderer;
}(BaseRenderer);

var textareaTemplate = '\n  <p class="label"><%= label %></p>\n  <textarea class="answer textarea"></textarea>\n';

var TextAreaRenderer = function (_BaseRenderer4) {
  (0, _inherits3.default)(TextAreaRenderer, _BaseRenderer4);

  function TextAreaRenderer(parent, question) {
    (0, _classCallCheck3.default)(this, TextAreaRenderer);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TextAreaRenderer).call(this, parent, textareaTemplate, question));
  }

  (0, _createClass3.default)(TextAreaRenderer, [{
    key: 'onRender',
    value: function onRender() {
      this.$label = this.$el.querySelector('.label');
      this.$textarea = this.$el.querySelector('.answer');
    }
  }, {
    key: 'onResize',
    value: function onResize(viewportVidth, viewportHeight, orientation) {
      if (!this.$parent) {
        return;
      }

      var boundingRect = this.$el.getBoundingClientRect();
      var width = boundingRect.width;
      var height = boundingRect.height;

      var labelHeight = this.$label.getBoundingClientRect().height;

      this.$textarea.style.width = width + 'px';
      this.$textarea.style.height = height - labelHeight + 'px';
    }
  }, {
    key: 'getAnswer',
    value: function getAnswer() {
      return this.$textarea.value;
    }
  }]);
  return TextAreaRenderer;
}(BaseRenderer);

/**
 * Survey main vue
 */


var SurveyView = function (_SegmentedView) {
  (0, _inherits3.default)(SurveyView, _SegmentedView);

  function SurveyView(template, content, events, options) {
    (0, _classCallCheck3.default)(this, SurveyView);

    var _this6 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SurveyView).call(this, template, content, events, options));

    _this6.ratios = {
      '.section-top': 0.15,
      '.section-center': 0.65,
      '.section-bottom': 0.2
    };
    return _this6;
  }

  (0, _createClass3.default)(SurveyView, [{
    key: 'onRender',
    value: function onRender() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(SurveyView.prototype), 'onRender', this).call(this);
      this.$nextBtn = this.$el.querySelector('.btn');
    }
  }, {
    key: 'disableBtn',
    value: function disableBtn() {
      this.$nextBtn.setAttribute('disabled', true);
    }
  }, {
    key: 'enableBtn',
    value: function enableBtn() {
      this.$nextBtn.removeAttribute('disabled');
    }
  }]);
  return SurveyView;
}(_SegmentedView3.default);

var SCENE_ID = 'survey';

/**
 * A scene to create surveys.
 */

var Survey = function (_Scene) {
  (0, _inherits3.default)(Survey, _Scene);

  function Survey() {
    (0, _classCallCheck3.default)(this, Survey);


    /**
     * Object used to store the answers of the survey.
     * @type {Object}
     */

    var _this7 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Survey).call(this, SCENE_ID, true));

    _this7.answers = {};

    _this7._onConfigResponse = _this7._onConfigResponse.bind(_this7);
    _this7._displayNextQuestion = _this7._displayNextQuestion.bind(_this7);
    return _this7;
  }

  /** @private */


  (0, _createClass3.default)(Survey, [{
    key: 'init',
    value: function init() {
      this.viewContent.counter = 0;
      this.viewEvents = { 'click .btn': this._displayNextQuestion };
      this.viewCtor = SurveyView;

      this.view = this.createView();
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Survey.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.show();

      this.send('request');
      this.receive('config', this._onConfigResponse);
    }
  }, {
    key: '_onConfigResponse',
    value: function _onConfigResponse(surveyConfig) {
      // set length of the survey for the view
      this.viewContent.length = surveyConfig.length;
      this._createRenderers(surveyConfig);
      this._displayNextQuestion();
    }
  }, {
    key: '_createRenderers',
    value: function _createRenderers(surveyConfig) {
      var _this8 = this;

      this.renderers = surveyConfig.map(function (question, index) {
        var ctor = void 0;

        switch (question.type) {
          case 'radio':
            ctor = RadioRenderer;
            break;
          case 'checkbox':
            ctor = CheckboxRenderer;
            break;
          case 'range':
            ctor = RangeRenderer;
            break;
          case 'textarea':
            question.required = false;
            ctor = TextAreaRenderer;
            break;
        }

        return new ctor(_this8.view, question);
      });
    }
  }, {
    key: '_displayNextQuestion',
    value: function _displayNextQuestion() {
      // retrive and store current answer if any
      if (this.currentRenderer) {
        var answer = this.currentRenderer.getAnswer();
        var required = this.currentRenderer.question.required;

        // return if no answer and required question
        if (answer === null && required) return;

        this.answers[this.currentRenderer.id] = answer;
      }

      // retrieve the next renderer
      this.currentRenderer = this.renderers.shift();
      // update counter
      this.viewContent.counter += 1;

      if (this.currentRenderer) {
        this.view.setViewComponent('.section-center', this.currentRenderer);
        this.view.render();

        if (this.currentRenderer.question.required) this.view.disableBtn();
      } else {
        this.view.setViewComponent('.section-center', null);
        this.view.render();
        // send informations to server
        var data = {
          timestamp: new Date().getTime(),
          userAgent: navigator.userAgent,
          answers: this.answers
        };

        this.send('answers', data);
      }
    }
  }]);
  return Survey;
}(_Scene3.default);

exports.default = Survey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN1cnZleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0lBS007OztBQUNKLFdBREksWUFDSixDQUFZLE1BQVosRUFBb0IsUUFBcEIsRUFBOEIsUUFBOUIsRUFBd0M7d0NBRHBDLGNBQ29DOzs2RkFEcEMseUJBRUksVUFBVSxVQUFVLElBQUksRUFBRSxXQUFXLFVBQVgsS0FETTs7QUFHdEMsVUFBSyxNQUFMLEdBQWMsTUFBZCxDQUhzQztBQUl0QyxVQUFLLFFBQUwsR0FBZ0IsUUFBaEIsQ0FKc0M7QUFLdEMsVUFBSyxFQUFMLEdBQVUsU0FBUyxFQUFULENBTDRCOztHQUF4Qzs7NkJBREk7OzZCQVNLLE9BQU8sUUFBUSxhQUFhOztTQVRqQzs7O0FBWU4sSUFBTSxtTEFBTjs7SUFPTTs7O0FBQ0osV0FESSxhQUNKLENBQVksTUFBWixFQUFvQixRQUFwQixFQUE4Qjt3Q0FEMUIsZUFDMEI7OzhGQUQxQiwwQkFFSSxRQUFRLGVBQWUsV0FERDs7QUFHNUIsV0FBSyxNQUFMLEdBQWMsSUFBZCxDQUg0QjtBQUk1QixXQUFLLFNBQUwsR0FBaUIsT0FBSyxTQUFMLENBQWUsSUFBZixRQUFqQixDQUo0Qjs7R0FBOUI7OzZCQURJOzsrQkFRTztBQUNULFdBQUssYUFBTCxDQUFtQixFQUFFLGlCQUFpQixLQUFLLFNBQUwsRUFBdEMsRUFEUztBQUVULFdBQUssUUFBTCxHQUFnQixvQkFBVyxLQUFLLEdBQUwsQ0FBUyxnQkFBVCxDQUEwQixTQUExQixDQUFYLENBQWhCLENBRlM7Ozs7OEJBS0QsR0FBRztBQUNYLFVBQU0sU0FBUyxFQUFFLE1BQUYsQ0FESjs7QUFHWCxXQUFLLFFBQUwsQ0FBYyxPQUFkLENBQXNCLFVBQUMsRUFBRCxFQUFRO0FBQUUsV0FBRyxTQUFILENBQWEsTUFBYixDQUFvQixVQUFwQixFQUFGO09BQVIsQ0FBdEIsQ0FIVztBQUlYLGFBQU8sU0FBUCxDQUFpQixHQUFqQixDQUFxQixVQUFyQixFQUpXOztBQU1YLFdBQUssTUFBTCxHQUFjLE9BQU8sWUFBUCxDQUFvQixVQUFwQixDQUFkLENBTlc7O0FBUVgsV0FBSyxNQUFMLENBQVksU0FBWixHQVJXOzs7O2dDQVdEO0FBQ1YsYUFBTyxLQUFLLE1BQUwsQ0FERzs7O1NBeEJSO0VBQXNCOztBQTZCNUIsSUFBTSx5TEFBTjs7SUFPTTs7O0FBQ0osV0FESSxnQkFDSixDQUFZLE1BQVosRUFBb0IsUUFBcEIsRUFBOEI7d0NBRDFCLGtCQUMwQjs7OEZBRDFCLDZCQUVJLFFBQVEsa0JBQWtCLFdBREo7O0FBRzVCLFdBQUssT0FBTCxHQUFlLEVBQWYsQ0FINEI7QUFJNUIsV0FBSyxTQUFMLEdBQWlCLE9BQUssU0FBTCxDQUFlLElBQWYsUUFBakIsQ0FKNEI7O0dBQTlCOzs2QkFESTs7K0JBUU87QUFDVCxXQUFLLGFBQUwsQ0FBbUIsRUFBRSxpQkFBaUIsS0FBSyxTQUFMLEVBQXRDLEVBRFM7Ozs7OEJBSUQsR0FBRztBQUNYLFVBQU0sU0FBUyxFQUFFLE1BQUYsQ0FESjtBQUVYLFVBQU0sTUFBTSxPQUFPLFlBQVAsQ0FBb0IsVUFBcEIsQ0FBTixDQUZLO0FBR1gsVUFBTSxTQUFTLE9BQU8sU0FBUCxDQUFpQixRQUFqQixDQUEwQixVQUExQixJQUF3QyxRQUF4QyxHQUFtRCxLQUFuRCxDQUhKOztBQUtYLFVBQUksV0FBVyxLQUFYLEVBQWtCO0FBQ3BCLGFBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsR0FBbEIsRUFEb0I7T0FBdEIsTUFFTyxJQUFLLFdBQVcsUUFBWCxFQUFzQjtBQUNoQyxhQUFLLE9BQUwsQ0FBYSxNQUFiLENBQW9CLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsR0FBckIsQ0FBcEIsRUFBK0MsQ0FBL0MsRUFEZ0M7T0FBM0I7O0FBSVAsYUFBTyxTQUFQLENBQWlCLE1BQWpCLEVBQXlCLFVBQXpCLEVBWFc7O0FBYVgsVUFBSSxLQUFLLE9BQUwsQ0FBYSxNQUFiLEdBQXNCLENBQXRCLEVBQXlCO0FBQzNCLGFBQUssTUFBTCxDQUFZLFNBQVosR0FEMkI7T0FBN0IsTUFFTztBQUNMLGFBQUssTUFBTCxDQUFZLFVBQVosR0FESztPQUZQOzs7O2dDQU9VO0FBQ1YsYUFBTyxLQUFLLE9BQUwsQ0FBYSxNQUFiLEtBQXdCLENBQXhCLEdBQTRCLElBQTVCLEdBQW1DLEtBQUssT0FBTCxDQURoQzs7O1NBaENSO0VBQXlCOztBQXFDL0IsSUFBTSxzU0FBTjs7SUFXTTs7O0FBQ0osV0FESSxhQUNKLENBQVksTUFBWixFQUFvQixRQUFwQixFQUE4Qjt3Q0FEMUIsZUFDMEI7OzhGQUQxQiwwQkFFSSxRQUFRLGVBQWUsV0FERDs7QUFHNUIsV0FBSyxNQUFMLEdBQWMsSUFBZCxDQUg0QjtBQUk1QixXQUFLLFFBQUwsR0FBZ0IsT0FBSyxRQUFMLENBQWMsSUFBZCxRQUFoQixDQUo0Qjs7R0FBOUI7OzZCQURJOzsrQkFRTztBQUNULFdBQUssYUFBTCxDQUFtQixFQUFFLGlCQUFpQixLQUFLLFFBQUwsRUFBdEMsRUFEUztBQUVULFdBQUssT0FBTCxHQUFlLEtBQUssR0FBTCxDQUFTLGFBQVQsQ0FBdUIsU0FBdkIsQ0FBZixDQUZTO0FBR1QsV0FBSyxTQUFMLEdBQWlCLEtBQUssR0FBTCxDQUFTLGFBQVQsQ0FBdUIsV0FBdkIsQ0FBakIsQ0FIUzs7Ozs2QkFNRixHQUFHO0FBQ1YsV0FBSyxTQUFMLENBQWUsV0FBZixHQUE2QixLQUFLLE9BQUwsQ0FBYSxLQUFiLENBRG5CO0FBRVYsV0FBSyxNQUFMLEdBQWMsV0FBVyxLQUFLLE9BQUwsQ0FBYSxLQUFiLENBQXpCLENBRlU7QUFHVixXQUFLLE1BQUwsQ0FBWSxTQUFaLEdBSFU7Ozs7Z0NBTUE7QUFDVixhQUFPLEtBQUssTUFBTCxDQURHOzs7U0FwQlI7RUFBc0I7O0FBeUI1QixJQUFNLDZHQUFOOztJQUtNOzs7QUFDSixXQURJLGdCQUNKLENBQVksTUFBWixFQUFvQixRQUFwQixFQUE4Qjt3Q0FEMUIsa0JBQzBCO3dGQUQxQiw2QkFFSSxRQUFRLGtCQUFrQixXQURKO0dBQTlCOzs2QkFESTs7K0JBS087QUFDVCxXQUFLLE1BQUwsR0FBYyxLQUFLLEdBQUwsQ0FBUyxhQUFULENBQXVCLFFBQXZCLENBQWQsQ0FEUztBQUVULFdBQUssU0FBTCxHQUFpQixLQUFLLEdBQUwsQ0FBUyxhQUFULENBQXVCLFNBQXZCLENBQWpCLENBRlM7Ozs7NkJBS0YsZUFBZSxnQkFBZ0IsYUFBYTtBQUNuRCxVQUFJLENBQUMsS0FBSyxPQUFMLEVBQWM7QUFBRSxlQUFGO09BQW5COztBQUVBLFVBQU0sZUFBZSxLQUFLLEdBQUwsQ0FBUyxxQkFBVCxFQUFmLENBSDZDO0FBSW5ELFVBQU0sUUFBUSxhQUFhLEtBQWIsQ0FKcUM7QUFLbkQsVUFBTSxTQUFTLGFBQWEsTUFBYixDQUxvQzs7QUFPbkQsVUFBTSxjQUFjLEtBQUssTUFBTCxDQUFZLHFCQUFaLEdBQW9DLE1BQXBDLENBUCtCOztBQVNuRCxXQUFLLFNBQUwsQ0FBZSxLQUFmLENBQXFCLEtBQXJCLEdBQWdDLFlBQWhDLENBVG1EO0FBVW5ELFdBQUssU0FBTCxDQUFlLEtBQWYsQ0FBcUIsTUFBckIsR0FBaUMsU0FBUyxXQUFULE9BQWpDLENBVm1EOzs7O2dDQWF6QztBQUNWLGFBQU8sS0FBSyxTQUFMLENBQWUsS0FBZixDQURHOzs7U0F2QlI7RUFBeUI7Ozs7Ozs7SUErQnpCOzs7QUFDSixXQURJLFVBQ0osQ0FBWSxRQUFaLEVBQXNCLE9BQXRCLEVBQStCLE1BQS9CLEVBQXVDLE9BQXZDLEVBQWdEO3dDQUQ1QyxZQUM0Qzs7OEZBRDVDLHVCQUVJLFVBQVUsU0FBUyxRQUFRLFVBRGE7O0FBRzlDLFdBQUssTUFBTCxHQUFjO0FBQ1osc0JBQWdCLElBQWhCO0FBQ0EseUJBQW1CLElBQW5CO0FBQ0EseUJBQW1CLEdBQW5CO0tBSEYsQ0FIOEM7O0dBQWhEOzs2QkFESTs7K0JBV087QUFDVCx1REFaRSxtREFZRixDQURTO0FBRVQsV0FBSyxRQUFMLEdBQWdCLEtBQUssR0FBTCxDQUFTLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBaEIsQ0FGUzs7OztpQ0FLRTtBQUNYLFdBQUssUUFBTCxDQUFjLFlBQWQsQ0FBMkIsVUFBM0IsRUFBdUMsSUFBdkMsRUFEVzs7OztnQ0FJRDtBQUNWLFdBQUssUUFBTCxDQUFjLGVBQWQsQ0FBOEIsVUFBOUIsRUFEVTs7O1NBcEJSOzs7QUF5Qk4sSUFBTSxXQUFXLFFBQVg7Ozs7OztJQUtlOzs7QUFDbkIsV0FEbUIsTUFDbkIsR0FBYzt3Q0FESyxRQUNMOzs7Ozs7Ozs4RkFESyxtQkFFWCxVQUFVLE9BREo7O0FBT1osV0FBSyxPQUFMLEdBQWUsRUFBZixDQVBZOztBQVNaLFdBQUssaUJBQUwsR0FBeUIsT0FBSyxpQkFBTCxDQUF1QixJQUF2QixRQUF6QixDQVRZO0FBVVosV0FBSyxvQkFBTCxHQUE0QixPQUFLLG9CQUFMLENBQTBCLElBQTFCLFFBQTVCLENBVlk7O0dBQWQ7Ozs7OzZCQURtQjs7MkJBZVo7QUFDTCxXQUFLLFdBQUwsQ0FBaUIsT0FBakIsR0FBMkIsQ0FBM0IsQ0FESztBQUVMLFdBQUssVUFBTCxHQUFrQixFQUFFLGNBQWMsS0FBSyxvQkFBTCxFQUFsQyxDQUZLO0FBR0wsV0FBSyxRQUFMLEdBQWdCLFVBQWhCLENBSEs7O0FBS0wsV0FBSyxJQUFMLEdBQVksS0FBSyxVQUFMLEVBQVosQ0FMSzs7Ozs7Ozs0QkFTQztBQUNOLHVEQXpCaUIsNENBeUJqQixDQURNOztBQUdOLFVBQUksQ0FBQyxLQUFLLFVBQUwsRUFDSCxLQUFLLElBQUwsR0FERjs7QUFHQSxXQUFLLElBQUwsR0FOTTs7QUFRTixXQUFLLElBQUwsQ0FBVSxTQUFWLEVBUk07QUFTTixXQUFLLE9BQUwsQ0FBYSxRQUFiLEVBQXVCLEtBQUssaUJBQUwsQ0FBdkIsQ0FUTTs7OztzQ0FZVSxjQUFjOztBQUU5QixXQUFLLFdBQUwsQ0FBaUIsTUFBakIsR0FBMEIsYUFBYSxNQUFiLENBRkk7QUFHOUIsV0FBSyxnQkFBTCxDQUFzQixZQUF0QixFQUg4QjtBQUk5QixXQUFLLG9CQUFMLEdBSjhCOzs7O3FDQU9mLGNBQWM7OztBQUM3QixXQUFLLFNBQUwsR0FBaUIsYUFBYSxHQUFiLENBQWlCLFVBQUMsUUFBRCxFQUFXLEtBQVgsRUFBcUI7QUFDckQsWUFBSSxhQUFKLENBRHFEOztBQUdyRCxnQkFBUSxTQUFTLElBQVQ7QUFDTixlQUFLLE9BQUw7QUFDRSxtQkFBTyxhQUFQLENBREY7QUFFRSxrQkFGRjtBQURGLGVBSU8sVUFBTDtBQUNFLG1CQUFPLGdCQUFQLENBREY7QUFFRSxrQkFGRjtBQUpGLGVBT08sT0FBTDtBQUNFLG1CQUFPLGFBQVAsQ0FERjtBQUVFLGtCQUZGO0FBUEYsZUFVTyxVQUFMO0FBQ0UscUJBQVMsUUFBVCxHQUFvQixLQUFwQixDQURGO0FBRUUsbUJBQU8sZ0JBQVAsQ0FGRjtBQUdFLGtCQUhGO0FBVkYsU0FIcUQ7O0FBbUJyRCxlQUFPLElBQUksSUFBSixDQUFTLE9BQUssSUFBTCxFQUFXLFFBQXBCLENBQVAsQ0FuQnFEO09BQXJCLENBQWxDLENBRDZCOzs7OzJDQXdCUjs7QUFFckIsVUFBSSxLQUFLLGVBQUwsRUFBc0I7QUFDeEIsWUFBTSxTQUFTLEtBQUssZUFBTCxDQUFxQixTQUFyQixFQUFULENBRGtCO0FBRXhCLFlBQU0sV0FBVyxLQUFLLGVBQUwsQ0FBcUIsUUFBckIsQ0FBOEIsUUFBOUI7OztBQUZPLFlBS3BCLFdBQVcsSUFBWCxJQUFtQixRQUFuQixFQUE2QixPQUFqQzs7QUFFQSxhQUFLLE9BQUwsQ0FBYSxLQUFLLGVBQUwsQ0FBcUIsRUFBckIsQ0FBYixHQUF3QyxNQUF4QyxDQVB3QjtPQUExQjs7O0FBRnFCLFVBYXJCLENBQUssZUFBTCxHQUF1QixLQUFLLFNBQUwsQ0FBZSxLQUFmLEVBQXZCOztBQWJxQixVQWVyQixDQUFLLFdBQUwsQ0FBaUIsT0FBakIsSUFBNEIsQ0FBNUIsQ0FmcUI7O0FBaUJyQixVQUFJLEtBQUssZUFBTCxFQUFzQjtBQUN4QixhQUFLLElBQUwsQ0FBVSxnQkFBVixDQUEyQixpQkFBM0IsRUFBOEMsS0FBSyxlQUFMLENBQTlDLENBRHdCO0FBRXhCLGFBQUssSUFBTCxDQUFVLE1BQVYsR0FGd0I7O0FBSXhCLFlBQUksS0FBSyxlQUFMLENBQXFCLFFBQXJCLENBQThCLFFBQTlCLEVBQ0YsS0FBSyxJQUFMLENBQVUsVUFBVixHQURGO09BSkYsTUFNTztBQUNMLGFBQUssSUFBTCxDQUFVLGdCQUFWLENBQTJCLGlCQUEzQixFQUE4QyxJQUE5QyxFQURLO0FBRUwsYUFBSyxJQUFMLENBQVUsTUFBVjs7QUFGSyxZQUlDLE9BQU87QUFDWCxxQkFBVyxJQUFJLElBQUosR0FBVyxPQUFYLEVBQVg7QUFDQSxxQkFBVyxVQUFVLFNBQVY7QUFDWCxtQkFBUyxLQUFLLE9BQUw7U0FITCxDQUpEOztBQVVMLGFBQUssSUFBTCxDQUFVLFNBQVYsRUFBcUIsSUFBckIsRUFWSztPQU5QOzs7U0FwRmlCIiwiZmlsZSI6IlN1cnZleS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTY2VuZSBmcm9tICcuLi9jb3JlL1NjZW5lJztcbmltcG9ydCBWaWV3IGZyb20gJy4uL3ZpZXdzL1ZpZXcnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vdmlld3MvU2VnbWVudGVkVmlldyc7XG5cbi8qKlxuICogUmVuZGVyZXJzXG4gKi9cbmNsYXNzIEJhc2VSZW5kZXJlciBleHRlbmRzIFZpZXcge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHRlbXBsYXRlLCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHRlbXBsYXRlLCBxdWVzdGlvbiwge30sIHsgY2xhc3NOYW1lOiAncXVlc3Rpb24nIH0pO1xuXG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5xdWVzdGlvbiA9IHF1ZXN0aW9uO1xuICAgIHRoaXMuaWQgPSBxdWVzdGlvbi5pZDtcbiAgfVxuXG4gIG9uUmVzaXplKHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uKSB7fVxufVxuXG5jb25zdCByYWRpb1RlbXBsYXRlID0gYFxuICA8cCBjbGFzcz1cImxhYmVsXCI+PCU9IGxhYmVsICU+PC9wPlxuICA8JSBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucykgeyAlPlxuICAgIDxwIGNsYXNzPVwiYW5zd2VyIHJhZGlvXCIgZGF0YS1rZXk9XCI8JT0ga2V5ICU+XCI+PCU9IG9wdGlvbnNba2V5XSAlPjwvcD5cbiAgPCUgfSAlPlxuYDtcblxuY2xhc3MgUmFkaW9SZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgcXVlc3Rpb24pIHtcbiAgICBzdXBlcihwYXJlbnQsIHJhZGlvVGVtcGxhdGUsIHF1ZXN0aW9uKTtcblxuICAgIHRoaXMuYW5zd2VyID0gbnVsbDtcbiAgICB0aGlzLl9vblNlbGVjdCA9IHRoaXMuX29uU2VsZWN0LmJpbmQodGhpcyk7XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICB0aGlzLmluc3RhbGxFdmVudHMoeyAnY2xpY2sgLmFuc3dlcic6IHRoaXMuX29uU2VsZWN0IH0pO1xuICAgIHRoaXMuJG9wdGlvbnMgPSBBcnJheS5mcm9tKHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbnN3ZXInKSk7XG4gIH1cblxuICBfb25TZWxlY3QoZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xuXG4gICAgdGhpcy4kb3B0aW9ucy5mb3JFYWNoKChlbCkgPT4geyBlbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpOyB9KTtcbiAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcblxuICAgIHRoaXMuYW5zd2VyID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1rZXknKTtcblxuICAgIHRoaXMucGFyZW50LmVuYWJsZUJ0bigpO1xuICB9XG5cbiAgZ2V0QW5zd2VyKCkge1xuICAgIHJldHVybiB0aGlzLmFuc3dlcjtcbiAgfVxufVxuXG5jb25zdCBjaGVja2JveFRlbXBsYXRlID0gYFxuICA8cCBjbGFzcz1cImxhYmVsXCI+PCU9IGxhYmVsICU+PC9wPlxuICA8JSBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucykgeyAlPlxuICAgIDxwIGNsYXNzPVwiYW5zd2VyIGNoZWNrYm94XCIgZGF0YS1rZXk9XCI8JT0ga2V5ICU+XCI+PCU9IG9wdGlvbnNba2V5XSAlPjwvcD5cbiAgPCUgfSAlPlxuYDtcblxuY2xhc3MgQ2hlY2tib3hSZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgcXVlc3Rpb24pIHtcbiAgICBzdXBlcihwYXJlbnQsIGNoZWNrYm94VGVtcGxhdGUsIHF1ZXN0aW9uKTtcblxuICAgIHRoaXMuYW5zd2VycyA9IFtdO1xuICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7ICdjbGljayAuYW5zd2VyJzogdGhpcy5fb25TZWxlY3QgfSk7XG4gIH1cblxuICBfb25TZWxlY3QoZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xuICAgIGNvbnN0IGtleSA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEta2V5Jyk7XG4gICAgY29uc3QgbWV0aG9kID0gdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKSA/ICdyZW1vdmUnIDogJ2FkZCc7XG5cbiAgICBpZiAobWV0aG9kID09PSAnYWRkJykge1xuICAgICAgdGhpcy5hbnN3ZXJzLnB1c2goa2V5KTtcbiAgICB9IGVsc2UgaWYgKChtZXRob2QgPT09ICdyZW1vdmUnKSkge1xuICAgICAgdGhpcy5hbnN3ZXJzLnNwbGljZSh0aGlzLmFuc3dlcnMuaW5kZXhPZihrZXkpLCAxKTtcbiAgICB9XG5cbiAgICB0YXJnZXQuY2xhc3NMaXN0W21ldGhvZF0oJ3NlbGVjdGVkJyk7XG5cbiAgICBpZiAodGhpcy5hbnN3ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucGFyZW50LmVuYWJsZUJ0bigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhcmVudC5kaXNhYmxlQnRuKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0QW5zd2VyKCkge1xuICAgIHJldHVybiB0aGlzLmFuc3dlcnMubGVuZ3RoID09PSAwID8gbnVsbCA6IHRoaXMuYW5zd2VycztcbiAgfVxufVxuXG5jb25zdCByYW5nZVRlbXBsYXRlID0gYFxuICA8cCBjbGFzcz1cImxhYmVsXCI+PCU9IGxhYmVsICU+PC9wPlxuICA8aW5wdXQgY2xhc3M9XCJzbGlkZXIgYW5zd2VyXCJcbiAgICB0eXBlPVwicmFuZ2VcIlxuICAgIG1pbj1cIjwlPSBvcHRpb25zLm1pbiAlPlwiXG4gICAgbWF4PVwiPCU9IG9wdGlvbnMubWF4ICU+XCJcbiAgICBzdGVwPVwiPCU9IG9wdGlvbnMuc3RlcCAlPlwiXG4gICAgdmFsdWU9XCI8JT0gb3B0aW9ucy5kZWZhdWx0ICU+XCIgLz5cbiAgPHNwYW4gY2xhc3M9XCJmZWVkYmFja1wiPjwlPSBvcHRpb25zLmRlZmF1bHQgJT48L3NwYW4+XG5gO1xuXG5jbGFzcyBSYW5nZVJlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHBhcmVudCwgcmFuZ2VUZW1wbGF0ZSwgcXVlc3Rpb24pO1xuXG4gICAgdGhpcy5hbnN3ZXIgPSBudWxsO1xuICAgIHRoaXMuX29uSW5wdXQgPSB0aGlzLl9vbklucHV0LmJpbmQodGhpcyk7XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICB0aGlzLmluc3RhbGxFdmVudHMoeyAnaW5wdXQgLmFuc3dlcic6IHRoaXMuX29uSW5wdXQgfSk7XG4gICAgdGhpcy4kc2xpZGVyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLnNsaWRlcicpXG4gICAgdGhpcy4kZmVlZGJhY2sgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuZmVlZGJhY2snKTtcbiAgfVxuXG4gIF9vbklucHV0KGUpIHtcbiAgICB0aGlzLiRmZWVkYmFjay50ZXh0Q29udGVudCA9IHRoaXMuJHNsaWRlci52YWx1ZTtcbiAgICB0aGlzLmFuc3dlciA9IHBhcnNlRmxvYXQodGhpcy4kc2xpZGVyLnZhbHVlKVxuICAgIHRoaXMucGFyZW50LmVuYWJsZUJ0bigpO1xuICB9XG5cbiAgZ2V0QW5zd2VyKCkge1xuICAgIHJldHVybiB0aGlzLmFuc3dlcjtcbiAgfVxufVxuXG5jb25zdCB0ZXh0YXJlYVRlbXBsYXRlID0gYFxuICA8cCBjbGFzcz1cImxhYmVsXCI+PCU9IGxhYmVsICU+PC9wPlxuICA8dGV4dGFyZWEgY2xhc3M9XCJhbnN3ZXIgdGV4dGFyZWFcIj48L3RleHRhcmVhPlxuYDtcblxuY2xhc3MgVGV4dEFyZWFSZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgcXVlc3Rpb24pIHtcbiAgICBzdXBlcihwYXJlbnQsIHRleHRhcmVhVGVtcGxhdGUsIHF1ZXN0aW9uKTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuJGxhYmVsID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLmxhYmVsJyk7XG4gICAgdGhpcy4kdGV4dGFyZWEgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuYW5zd2VyJyk7XG4gIH1cblxuICBvblJlc2l6ZSh2aWV3cG9ydFZpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICBpZiAoIXRoaXMuJHBhcmVudCkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHdpZHRoID0gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IGJvdW5kaW5nUmVjdC5oZWlnaHQ7XG5cbiAgICBjb25zdCBsYWJlbEhlaWdodCA9IHRoaXMuJGxhYmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICAgIHRoaXMuJHRleHRhcmVhLnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgIHRoaXMuJHRleHRhcmVhLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodCAtIGxhYmVsSGVpZ2h0fXB4YDtcbiAgfVxuXG4gIGdldEFuc3dlcigpIHtcbiAgICByZXR1cm4gdGhpcy4kdGV4dGFyZWEudmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBTdXJ2ZXkgbWFpbiB2dWVcbiAqL1xuY2xhc3MgU3VydmV5VmlldyBleHRlbmRzIFNlZ21lbnRlZFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnJhdGlvcyA9IHtcbiAgICAgICcuc2VjdGlvbi10b3AnOiAwLjE1LFxuICAgICAgJy5zZWN0aW9uLWNlbnRlcic6IDAuNjUsXG4gICAgICAnLnNlY3Rpb24tYm90dG9tJzogMC4yLFxuICAgIH07XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICBzdXBlci5vblJlbmRlcigpO1xuICAgIHRoaXMuJG5leHRCdG4gPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuYnRuJyk7XG4gIH1cblxuICBkaXNhYmxlQnRuKCkge1xuICAgIHRoaXMuJG5leHRCdG4uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpO1xuICB9XG5cbiAgZW5hYmxlQnRuKCkge1xuICAgIHRoaXMuJG5leHRCdG4ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICB9XG59XG5cbmNvbnN0IFNDRU5FX0lEID0gJ3N1cnZleSc7XG5cbi8qKlxuICogQSBzY2VuZSB0byBjcmVhdGUgc3VydmV5cy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3VydmV5IGV4dGVuZHMgU2NlbmUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTQ0VORV9JRCwgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBPYmplY3QgdXNlZCB0byBzdG9yZSB0aGUgYW5zd2VycyBvZiB0aGUgc3VydmV5LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5hbnN3ZXJzID0ge307XG5cbiAgICB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlID0gdGhpcy5fb25Db25maWdSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24gPSB0aGlzLl9kaXNwbGF5TmV4dFF1ZXN0aW9uLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnZpZXdDb250ZW50LmNvdW50ZXIgPSAwO1xuICAgIHRoaXMudmlld0V2ZW50cyA9IHsgJ2NsaWNrIC5idG4nOiB0aGlzLl9kaXNwbGF5TmV4dFF1ZXN0aW9uIH07XG4gICAgdGhpcy52aWV3Q3RvciA9IFN1cnZleVZpZXc7XG5cbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2hvdygpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG4gICAgdGhpcy5yZWNlaXZlKCdjb25maWcnLCB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlKTtcbiAgfVxuXG4gIF9vbkNvbmZpZ1Jlc3BvbnNlKHN1cnZleUNvbmZpZykge1xuICAgIC8vIHNldCBsZW5ndGggb2YgdGhlIHN1cnZleSBmb3IgdGhlIHZpZXdcbiAgICB0aGlzLnZpZXdDb250ZW50Lmxlbmd0aCA9IHN1cnZleUNvbmZpZy5sZW5ndGg7XG4gICAgdGhpcy5fY3JlYXRlUmVuZGVyZXJzKHN1cnZleUNvbmZpZyk7XG4gICAgdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbigpO1xuICB9XG5cbiAgX2NyZWF0ZVJlbmRlcmVycyhzdXJ2ZXlDb25maWcpIHtcbiAgICB0aGlzLnJlbmRlcmVycyA9IHN1cnZleUNvbmZpZy5tYXAoKHF1ZXN0aW9uLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IGN0b3I7XG5cbiAgICAgIHN3aXRjaCAocXVlc3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlICdyYWRpbyc6XG4gICAgICAgICAgY3RvciA9IFJhZGlvUmVuZGVyZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2NoZWNrYm94JzpcbiAgICAgICAgICBjdG9yID0gQ2hlY2tib3hSZW5kZXJlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmFuZ2UnOlxuICAgICAgICAgIGN0b3IgPSBSYW5nZVJlbmRlcmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICAgICAgcXVlc3Rpb24ucmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICBjdG9yID0gVGV4dEFyZWFSZW5kZXJlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBjdG9yKHRoaXMudmlldywgcXVlc3Rpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgX2Rpc3BsYXlOZXh0UXVlc3Rpb24oKSB7XG4gICAgLy8gcmV0cml2ZSBhbmQgc3RvcmUgY3VycmVudCBhbnN3ZXIgaWYgYW55XG4gICAgaWYgKHRoaXMuY3VycmVudFJlbmRlcmVyKSB7XG4gICAgICBjb25zdCBhbnN3ZXIgPSB0aGlzLmN1cnJlbnRSZW5kZXJlci5nZXRBbnN3ZXIoKTtcbiAgICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5jdXJyZW50UmVuZGVyZXIucXVlc3Rpb24ucmVxdWlyZWQ7XG5cbiAgICAgIC8vIHJldHVybiBpZiBubyBhbnN3ZXIgYW5kIHJlcXVpcmVkIHF1ZXN0aW9uXG4gICAgICBpZiAoYW5zd2VyID09PSBudWxsICYmIHJlcXVpcmVkKSByZXR1cm47XG5cbiAgICAgIHRoaXMuYW5zd2Vyc1t0aGlzLmN1cnJlbnRSZW5kZXJlci5pZF0gPSBhbnN3ZXI7XG4gICAgfVxuXG4gICAgLy8gcmV0cmlldmUgdGhlIG5leHQgcmVuZGVyZXJcbiAgICB0aGlzLmN1cnJlbnRSZW5kZXJlciA9IHRoaXMucmVuZGVyZXJzLnNoaWZ0KCk7XG4gICAgLy8gdXBkYXRlIGNvdW50ZXJcbiAgICB0aGlzLnZpZXdDb250ZW50LmNvdW50ZXIgKz0gMTtcblxuICAgIGlmICh0aGlzLmN1cnJlbnRSZW5kZXJlcikge1xuICAgICAgdGhpcy52aWV3LnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLWNlbnRlcicsIHRoaXMuY3VycmVudFJlbmRlcmVyKTtcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoKTtcblxuICAgICAgaWYgKHRoaXMuY3VycmVudFJlbmRlcmVyLnF1ZXN0aW9uLnJlcXVpcmVkKVxuICAgICAgICB0aGlzLnZpZXcuZGlzYWJsZUJ0bigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZpZXcuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tY2VudGVyJywgbnVsbCk7XG4gICAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gICAgICAvLyBzZW5kIGluZm9ybWF0aW9ucyB0byBzZXJ2ZXJcbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAgICAgIHVzZXJBZ2VudDogbmF2aWdhdG9yLnVzZXJBZ2VudCxcbiAgICAgICAgYW5zd2VyczogdGhpcy5hbnN3ZXJzLFxuICAgICAgfTtcblxuICAgICAgdGhpcy5zZW5kKCdhbnN3ZXJzJywgZGF0YSk7XG4gICAgfVxuICB9XG59XG4iXX0=