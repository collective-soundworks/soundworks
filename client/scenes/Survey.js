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

var SCENE_ID = 'survey';

var defaultViewTemplate = '\n<div class="section-top">\n  <% if (counter <= length) { %>\n    <p class="counter"><%= counter %> / <%= length %></p>\n  <% } %>\n</div>\n<% if (counter > length) { %>\n  <div class="section-center flex-center">\n    <p class="big"><%= thanks %></p>\n  </div>\n<% } else { %>\n  <div class="section-center"></div>\n<% } %>\n<div class="section-bottom flex-middle">\n  <% if (counter < length) { %>\n    <button class="btn"><%= next %></button>\n  <% } else if (counter === length) { %>\n    <button class="btn"><%= validate %></button>\n  <% } %>\n</div>';

var defaultViewContent = {
  next: 'Next',
  validate: 'Validate',
  thanks: 'Thanks!',
  length: '-'
};

/**
 * Renderers
 */

var BaseRenderer = function (_View) {
  (0, _inherits3.default)(BaseRenderer, _View);

  function BaseRenderer(parent, template, question) {
    (0, _classCallCheck3.default)(this, BaseRenderer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BaseRenderer.__proto__ || (0, _getPrototypeOf2.default)(BaseRenderer)).call(this, template, question, {}, { className: 'question' }));

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

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (RadioRenderer.__proto__ || (0, _getPrototypeOf2.default)(RadioRenderer)).call(this, parent, radioTemplate, question));

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

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (CheckboxRenderer.__proto__ || (0, _getPrototypeOf2.default)(CheckboxRenderer)).call(this, parent, checkboxTemplate, question));

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

    var _this4 = (0, _possibleConstructorReturn3.default)(this, (RangeRenderer.__proto__ || (0, _getPrototypeOf2.default)(RangeRenderer)).call(this, parent, rangeTemplate, question));

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
    return (0, _possibleConstructorReturn3.default)(this, (TextAreaRenderer.__proto__ || (0, _getPrototypeOf2.default)(TextAreaRenderer)).call(this, parent, textareaTemplate, question));
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

    var _this6 = (0, _possibleConstructorReturn3.default)(this, (SurveyView.__proto__ || (0, _getPrototypeOf2.default)(SurveyView)).call(this, template, content, events, options));

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
      (0, _get3.default)(SurveyView.prototype.__proto__ || (0, _getPrototypeOf2.default)(SurveyView.prototype), 'onRender', this).call(this);
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

/**
 * A scene to create surveys.
 */


var Survey = function (_Scene) {
  (0, _inherits3.default)(Survey, _Scene);

  function Survey() {
    (0, _classCallCheck3.default)(this, Survey);

    var _this7 = (0, _possibleConstructorReturn3.default)(this, (Survey.__proto__ || (0, _getPrototypeOf2.default)(Survey)).call(this, SCENE_ID, true));

    _this7._defaultViewTemplate = defaultViewTemplate;
    _this7._defaultViewContent = defaultViewContent;

    /**
     * Object used to store the answers of the survey.
     * @type {Object}
     */
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
      (0, _get3.default)(Survey.prototype.__proto__ || (0, _getPrototypeOf2.default)(Survey.prototype), 'start', this).call(this);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN1cnZleS5qcyJdLCJuYW1lcyI6WyJTQ0VORV9JRCIsImRlZmF1bHRWaWV3VGVtcGxhdGUiLCJkZWZhdWx0Vmlld0NvbnRlbnQiLCJuZXh0IiwidmFsaWRhdGUiLCJ0aGFua3MiLCJsZW5ndGgiLCJCYXNlUmVuZGVyZXIiLCJwYXJlbnQiLCJ0ZW1wbGF0ZSIsInF1ZXN0aW9uIiwiY2xhc3NOYW1lIiwiaWQiLCJ3aWR0aCIsImhlaWdodCIsIm9yaWVudGF0aW9uIiwicmFkaW9UZW1wbGF0ZSIsIlJhZGlvUmVuZGVyZXIiLCJhbnN3ZXIiLCJfb25TZWxlY3QiLCJiaW5kIiwiaW5zdGFsbEV2ZW50cyIsIiRvcHRpb25zIiwiJGVsIiwicXVlcnlTZWxlY3RvckFsbCIsImUiLCJ0YXJnZXQiLCJmb3JFYWNoIiwiZWwiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJhZGQiLCJnZXRBdHRyaWJ1dGUiLCJlbmFibGVCdG4iLCJjaGVja2JveFRlbXBsYXRlIiwiQ2hlY2tib3hSZW5kZXJlciIsImFuc3dlcnMiLCJrZXkiLCJtZXRob2QiLCJjb250YWlucyIsInB1c2giLCJzcGxpY2UiLCJpbmRleE9mIiwiZGlzYWJsZUJ0biIsInJhbmdlVGVtcGxhdGUiLCJSYW5nZVJlbmRlcmVyIiwiX29uSW5wdXQiLCIkc2xpZGVyIiwicXVlcnlTZWxlY3RvciIsIiRmZWVkYmFjayIsInRleHRDb250ZW50IiwidmFsdWUiLCJwYXJzZUZsb2F0IiwidGV4dGFyZWFUZW1wbGF0ZSIsIlRleHRBcmVhUmVuZGVyZXIiLCIkbGFiZWwiLCIkdGV4dGFyZWEiLCJ2aWV3cG9ydFZpZHRoIiwidmlld3BvcnRIZWlnaHQiLCIkcGFyZW50IiwiYm91bmRpbmdSZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwibGFiZWxIZWlnaHQiLCJzdHlsZSIsIlN1cnZleVZpZXciLCJjb250ZW50IiwiZXZlbnRzIiwib3B0aW9ucyIsInJhdGlvcyIsIiRuZXh0QnRuIiwic2V0QXR0cmlidXRlIiwicmVtb3ZlQXR0cmlidXRlIiwiU3VydmV5IiwiX2RlZmF1bHRWaWV3VGVtcGxhdGUiLCJfZGVmYXVsdFZpZXdDb250ZW50IiwiX29uQ29uZmlnUmVzcG9uc2UiLCJfZGlzcGxheU5leHRRdWVzdGlvbiIsInZpZXdDb250ZW50IiwiY291bnRlciIsInZpZXdFdmVudHMiLCJ2aWV3Q3RvciIsInZpZXciLCJjcmVhdGVWaWV3IiwiaGFzU3RhcnRlZCIsImluaXQiLCJzaG93Iiwic2VuZCIsInJlY2VpdmUiLCJzdXJ2ZXlDb25maWciLCJfY3JlYXRlUmVuZGVyZXJzIiwicmVuZGVyZXJzIiwibWFwIiwiaW5kZXgiLCJjdG9yIiwidHlwZSIsInJlcXVpcmVkIiwiY3VycmVudFJlbmRlcmVyIiwiZ2V0QW5zd2VyIiwic2hpZnQiLCJzZXRWaWV3Q29tcG9uZW50IiwicmVuZGVyIiwiZGF0YSIsInRpbWVzdGFtcCIsIkRhdGUiLCJnZXRUaW1lIiwidXNlckFnZW50IiwibmF2aWdhdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxXQUFXLFFBQWpCOztBQUVBLElBQU1DLHFrQkFBTjs7QUFxQkEsSUFBTUMscUJBQXFCO0FBQ3pCQyxRQUFNLE1BRG1CO0FBRXpCQyxZQUFVLFVBRmU7QUFHekJDLFVBQVEsU0FIaUI7QUFJekJDLFVBQVE7QUFKaUIsQ0FBM0I7O0FBT0E7Ozs7SUFHTUMsWTs7O0FBQ0osd0JBQVlDLE1BQVosRUFBb0JDLFFBQXBCLEVBQThCQyxRQUE5QixFQUF3QztBQUFBOztBQUFBLGtKQUNoQ0QsUUFEZ0MsRUFDdEJDLFFBRHNCLEVBQ1osRUFEWSxFQUNSLEVBQUVDLFdBQVcsVUFBYixFQURROztBQUd0QyxVQUFLSCxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxVQUFLRSxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLFVBQUtFLEVBQUwsR0FBVUYsU0FBU0UsRUFBbkI7QUFMc0M7QUFNdkM7Ozs7NkJBRVFDLEssRUFBT0MsTSxFQUFRQyxXLEVBQWEsQ0FBRTs7Ozs7QUFHekMsSUFBTUMsbUxBQU47O0lBT01DLGE7OztBQUNKLHlCQUFZVCxNQUFaLEVBQW9CRSxRQUFwQixFQUE4QjtBQUFBOztBQUFBLHFKQUN0QkYsTUFEc0IsRUFDZFEsYUFEYyxFQUNDTixRQUREOztBQUc1QixXQUFLUSxNQUFMLEdBQWMsSUFBZDtBQUNBLFdBQUtDLFNBQUwsR0FBaUIsT0FBS0EsU0FBTCxDQUFlQyxJQUFmLFFBQWpCO0FBSjRCO0FBSzdCOzs7OytCQUVVO0FBQ1QsV0FBS0MsYUFBTCxDQUFtQixFQUFFLGlCQUFpQixLQUFLRixTQUF4QixFQUFuQjtBQUNBLFdBQUtHLFFBQUwsR0FBZ0Isb0JBQVcsS0FBS0MsR0FBTCxDQUFTQyxnQkFBVCxDQUEwQixTQUExQixDQUFYLENBQWhCO0FBQ0Q7Ozs4QkFFU0MsQyxFQUFHO0FBQ1gsVUFBTUMsU0FBU0QsRUFBRUMsTUFBakI7O0FBRUEsV0FBS0osUUFBTCxDQUFjSyxPQUFkLENBQXNCLFVBQUNDLEVBQUQsRUFBUTtBQUFFQSxXQUFHQyxTQUFILENBQWFDLE1BQWIsQ0FBb0IsVUFBcEI7QUFBa0MsT0FBbEU7QUFDQUosYUFBT0csU0FBUCxDQUFpQkUsR0FBakIsQ0FBcUIsVUFBckI7O0FBRUEsV0FBS2IsTUFBTCxHQUFjUSxPQUFPTSxZQUFQLENBQW9CLFVBQXBCLENBQWQ7O0FBRUEsV0FBS3hCLE1BQUwsQ0FBWXlCLFNBQVo7QUFDRDs7O2dDQUVXO0FBQ1YsYUFBTyxLQUFLZixNQUFaO0FBQ0Q7OztFQTFCeUJYLFk7O0FBNkI1QixJQUFNMkIseUxBQU47O0lBT01DLGdCOzs7QUFDSiw0QkFBWTNCLE1BQVosRUFBb0JFLFFBQXBCLEVBQThCO0FBQUE7O0FBQUEsMkpBQ3RCRixNQURzQixFQUNkMEIsZ0JBRGMsRUFDSXhCLFFBREo7O0FBRzVCLFdBQUswQixPQUFMLEdBQWUsRUFBZjtBQUNBLFdBQUtqQixTQUFMLEdBQWlCLE9BQUtBLFNBQUwsQ0FBZUMsSUFBZixRQUFqQjtBQUo0QjtBQUs3Qjs7OzsrQkFFVTtBQUNULFdBQUtDLGFBQUwsQ0FBbUIsRUFBRSxpQkFBaUIsS0FBS0YsU0FBeEIsRUFBbkI7QUFDRDs7OzhCQUVTTSxDLEVBQUc7QUFDWCxVQUFNQyxTQUFTRCxFQUFFQyxNQUFqQjtBQUNBLFVBQU1XLE1BQU1YLE9BQU9NLFlBQVAsQ0FBb0IsVUFBcEIsQ0FBWjtBQUNBLFVBQU1NLFNBQVNaLE9BQU9HLFNBQVAsQ0FBaUJVLFFBQWpCLENBQTBCLFVBQTFCLElBQXdDLFFBQXhDLEdBQW1ELEtBQWxFOztBQUVBLFVBQUlELFdBQVcsS0FBZixFQUFzQjtBQUNwQixhQUFLRixPQUFMLENBQWFJLElBQWIsQ0FBa0JILEdBQWxCO0FBQ0QsT0FGRCxNQUVPLElBQUtDLFdBQVcsUUFBaEIsRUFBMkI7QUFDaEMsYUFBS0YsT0FBTCxDQUFhSyxNQUFiLENBQW9CLEtBQUtMLE9BQUwsQ0FBYU0sT0FBYixDQUFxQkwsR0FBckIsQ0FBcEIsRUFBK0MsQ0FBL0M7QUFDRDs7QUFFRFgsYUFBT0csU0FBUCxDQUFpQlMsTUFBakIsRUFBeUIsVUFBekI7O0FBRUEsVUFBSSxLQUFLRixPQUFMLENBQWE5QixNQUFiLEdBQXNCLENBQTFCLEVBQTZCO0FBQzNCLGFBQUtFLE1BQUwsQ0FBWXlCLFNBQVo7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLekIsTUFBTCxDQUFZbUMsVUFBWjtBQUNEO0FBQ0Y7OztnQ0FFVztBQUNWLGFBQU8sS0FBS1AsT0FBTCxDQUFhOUIsTUFBYixLQUF3QixDQUF4QixHQUE0QixJQUE1QixHQUFtQyxLQUFLOEIsT0FBL0M7QUFDRDs7O0VBbEM0QjdCLFk7O0FBcUMvQixJQUFNcUMsc1NBQU47O0lBV01DLGE7OztBQUNKLHlCQUFZckMsTUFBWixFQUFvQkUsUUFBcEIsRUFBOEI7QUFBQTs7QUFBQSxxSkFDdEJGLE1BRHNCLEVBQ2RvQyxhQURjLEVBQ0NsQyxRQUREOztBQUc1QixXQUFLUSxNQUFMLEdBQWMsSUFBZDtBQUNBLFdBQUs0QixRQUFMLEdBQWdCLE9BQUtBLFFBQUwsQ0FBYzFCLElBQWQsUUFBaEI7QUFKNEI7QUFLN0I7Ozs7K0JBRVU7QUFDVCxXQUFLQyxhQUFMLENBQW1CLEVBQUUsaUJBQWlCLEtBQUt5QixRQUF4QixFQUFuQjtBQUNBLFdBQUtDLE9BQUwsR0FBZSxLQUFLeEIsR0FBTCxDQUFTeUIsYUFBVCxDQUF1QixTQUF2QixDQUFmO0FBQ0EsV0FBS0MsU0FBTCxHQUFpQixLQUFLMUIsR0FBTCxDQUFTeUIsYUFBVCxDQUF1QixXQUF2QixDQUFqQjtBQUNEOzs7NkJBRVF2QixDLEVBQUc7QUFDVixXQUFLd0IsU0FBTCxDQUFlQyxXQUFmLEdBQTZCLEtBQUtILE9BQUwsQ0FBYUksS0FBMUM7QUFDQSxXQUFLakMsTUFBTCxHQUFja0MsV0FBVyxLQUFLTCxPQUFMLENBQWFJLEtBQXhCLENBQWQ7QUFDQSxXQUFLM0MsTUFBTCxDQUFZeUIsU0FBWjtBQUNEOzs7Z0NBRVc7QUFDVixhQUFPLEtBQUtmLE1BQVo7QUFDRDs7O0VBdEJ5QlgsWTs7QUF5QjVCLElBQU04Qyw2R0FBTjs7SUFLTUMsZ0I7OztBQUNKLDRCQUFZOUMsTUFBWixFQUFvQkUsUUFBcEIsRUFBOEI7QUFBQTtBQUFBLHFKQUN0QkYsTUFEc0IsRUFDZDZDLGdCQURjLEVBQ0kzQyxRQURKO0FBRTdCOzs7OytCQUVVO0FBQ1QsV0FBSzZDLE1BQUwsR0FBYyxLQUFLaEMsR0FBTCxDQUFTeUIsYUFBVCxDQUF1QixRQUF2QixDQUFkO0FBQ0EsV0FBS1EsU0FBTCxHQUFpQixLQUFLakMsR0FBTCxDQUFTeUIsYUFBVCxDQUF1QixTQUF2QixDQUFqQjtBQUNEOzs7NkJBRVFTLGEsRUFBZUMsYyxFQUFnQjNDLFcsRUFBYTtBQUNuRCxVQUFJLENBQUMsS0FBSzRDLE9BQVYsRUFBbUI7QUFBRTtBQUFTOztBQUU5QixVQUFNQyxlQUFlLEtBQUtyQyxHQUFMLENBQVNzQyxxQkFBVCxFQUFyQjtBQUNBLFVBQU1oRCxRQUFRK0MsYUFBYS9DLEtBQTNCO0FBQ0EsVUFBTUMsU0FBUzhDLGFBQWE5QyxNQUE1Qjs7QUFFQSxVQUFNZ0QsY0FBYyxLQUFLUCxNQUFMLENBQVlNLHFCQUFaLEdBQW9DL0MsTUFBeEQ7O0FBRUEsV0FBSzBDLFNBQUwsQ0FBZU8sS0FBZixDQUFxQmxELEtBQXJCLEdBQWdDQSxLQUFoQztBQUNBLFdBQUsyQyxTQUFMLENBQWVPLEtBQWYsQ0FBcUJqRCxNQUFyQixHQUFpQ0EsU0FBU2dELFdBQTFDO0FBQ0Q7OztnQ0FFVztBQUNWLGFBQU8sS0FBS04sU0FBTCxDQUFlTCxLQUF0QjtBQUNEOzs7RUF6QjRCNUMsWTs7QUE0Qi9COzs7OztJQUdNeUQsVTs7O0FBQ0osc0JBQVl2RCxRQUFaLEVBQXNCd0QsT0FBdEIsRUFBK0JDLE1BQS9CLEVBQXVDQyxPQUF2QyxFQUFnRDtBQUFBOztBQUFBLCtJQUN4QzFELFFBRHdDLEVBQzlCd0QsT0FEOEIsRUFDckJDLE1BRHFCLEVBQ2JDLE9BRGE7O0FBRzlDLFdBQUtDLE1BQUwsR0FBYztBQUNaLHNCQUFnQixJQURKO0FBRVoseUJBQW1CLElBRlA7QUFHWix5QkFBbUI7QUFIUCxLQUFkO0FBSDhDO0FBUS9DOzs7OytCQUVVO0FBQ1Q7QUFDQSxXQUFLQyxRQUFMLEdBQWdCLEtBQUs5QyxHQUFMLENBQVN5QixhQUFULENBQXVCLE1BQXZCLENBQWhCO0FBQ0Q7OztpQ0FFWTtBQUNYLFdBQUtxQixRQUFMLENBQWNDLFlBQWQsQ0FBMkIsVUFBM0IsRUFBdUMsSUFBdkM7QUFDRDs7O2dDQUVXO0FBQ1YsV0FBS0QsUUFBTCxDQUFjRSxlQUFkLENBQThCLFVBQTlCO0FBQ0Q7Ozs7O0FBSUg7Ozs7O0lBR3FCQyxNOzs7QUFDbkIsb0JBQWM7QUFBQTs7QUFBQSx1SUFDTnhFLFFBRE0sRUFDSSxJQURKOztBQUdaLFdBQUt5RSxvQkFBTCxHQUE0QnhFLG1CQUE1QjtBQUNBLFdBQUt5RSxtQkFBTCxHQUEyQnhFLGtCQUEzQjs7QUFFQTs7OztBQUlBLFdBQUtrQyxPQUFMLEdBQWUsRUFBZjs7QUFFQSxXQUFLdUMsaUJBQUwsR0FBeUIsT0FBS0EsaUJBQUwsQ0FBdUJ2RCxJQUF2QixRQUF6QjtBQUNBLFdBQUt3RCxvQkFBTCxHQUE0QixPQUFLQSxvQkFBTCxDQUEwQnhELElBQTFCLFFBQTVCO0FBYlk7QUFjYjs7QUFFRDs7Ozs7MkJBQ087QUFDTCxXQUFLeUQsV0FBTCxDQUFpQkMsT0FBakIsR0FBMkIsQ0FBM0I7QUFDQSxXQUFLQyxVQUFMLEdBQWtCLEVBQUUsY0FBYyxLQUFLSCxvQkFBckIsRUFBbEI7QUFDQSxXQUFLSSxRQUFMLEdBQWdCaEIsVUFBaEI7O0FBRUEsV0FBS2lCLElBQUwsR0FBWSxLQUFLQyxVQUFMLEVBQVo7QUFDRDs7QUFFRDs7Ozs0QkFDUTtBQUNOOztBQUVBLFVBQUksQ0FBQyxLQUFLQyxVQUFWLEVBQ0UsS0FBS0MsSUFBTDs7QUFFRixXQUFLQyxJQUFMOztBQUVBLFdBQUtDLElBQUwsQ0FBVSxTQUFWO0FBQ0EsV0FBS0MsT0FBTCxDQUFhLFFBQWIsRUFBdUIsS0FBS1osaUJBQTVCO0FBQ0Q7OztzQ0FFaUJhLFksRUFBYztBQUM5QjtBQUNBLFdBQUtYLFdBQUwsQ0FBaUJ2RSxNQUFqQixHQUEwQmtGLGFBQWFsRixNQUF2QztBQUNBLFdBQUttRixnQkFBTCxDQUFzQkQsWUFBdEI7QUFDQSxXQUFLWixvQkFBTDtBQUNEOzs7cUNBRWdCWSxZLEVBQWM7QUFBQTs7QUFDN0IsV0FBS0UsU0FBTCxHQUFpQkYsYUFBYUcsR0FBYixDQUFpQixVQUFDakYsUUFBRCxFQUFXa0YsS0FBWCxFQUFxQjtBQUNyRCxZQUFJQyxhQUFKOztBQUVBLGdCQUFRbkYsU0FBU29GLElBQWpCO0FBQ0UsZUFBSyxPQUFMO0FBQ0VELG1CQUFPNUUsYUFBUDtBQUNBO0FBQ0YsZUFBSyxVQUFMO0FBQ0U0RSxtQkFBTzFELGdCQUFQO0FBQ0E7QUFDRixlQUFLLE9BQUw7QUFDRTBELG1CQUFPaEQsYUFBUDtBQUNBO0FBQ0YsZUFBSyxVQUFMO0FBQ0VuQyxxQkFBU3FGLFFBQVQsR0FBb0IsS0FBcEI7QUFDQUYsbUJBQU92QyxnQkFBUDtBQUNBO0FBYko7O0FBZ0JBLGVBQU8sSUFBSXVDLElBQUosQ0FBUyxPQUFLWixJQUFkLEVBQW9CdkUsUUFBcEIsQ0FBUDtBQUNELE9BcEJnQixDQUFqQjtBQXFCRDs7OzJDQUVzQjtBQUNyQjtBQUNBLFVBQUksS0FBS3NGLGVBQVQsRUFBMEI7QUFDeEIsWUFBTTlFLFNBQVMsS0FBSzhFLGVBQUwsQ0FBcUJDLFNBQXJCLEVBQWY7QUFDQSxZQUFNRixXQUFXLEtBQUtDLGVBQUwsQ0FBcUJ0RixRQUFyQixDQUE4QnFGLFFBQS9DOztBQUVBO0FBQ0EsWUFBSTdFLFdBQVcsSUFBWCxJQUFtQjZFLFFBQXZCLEVBQWlDOztBQUVqQyxhQUFLM0QsT0FBTCxDQUFhLEtBQUs0RCxlQUFMLENBQXFCcEYsRUFBbEMsSUFBd0NNLE1BQXhDO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFLOEUsZUFBTCxHQUF1QixLQUFLTixTQUFMLENBQWVRLEtBQWYsRUFBdkI7QUFDQTtBQUNBLFdBQUtyQixXQUFMLENBQWlCQyxPQUFqQixJQUE0QixDQUE1Qjs7QUFFQSxVQUFJLEtBQUtrQixlQUFULEVBQTBCO0FBQ3hCLGFBQUtmLElBQUwsQ0FBVWtCLGdCQUFWLENBQTJCLGlCQUEzQixFQUE4QyxLQUFLSCxlQUFuRDtBQUNBLGFBQUtmLElBQUwsQ0FBVW1CLE1BQVY7O0FBRUEsWUFBSSxLQUFLSixlQUFMLENBQXFCdEYsUUFBckIsQ0FBOEJxRixRQUFsQyxFQUNFLEtBQUtkLElBQUwsQ0FBVXRDLFVBQVY7QUFDSCxPQU5ELE1BTU87QUFDTCxhQUFLc0MsSUFBTCxDQUFVa0IsZ0JBQVYsQ0FBMkIsaUJBQTNCLEVBQThDLElBQTlDO0FBQ0EsYUFBS2xCLElBQUwsQ0FBVW1CLE1BQVY7QUFDQTtBQUNBLFlBQU1DLE9BQU87QUFDWEMscUJBQVcsSUFBSUMsSUFBSixHQUFXQyxPQUFYLEVBREE7QUFFWEMscUJBQVdDLFVBQVVELFNBRlY7QUFHWHJFLG1CQUFTLEtBQUtBO0FBSEgsU0FBYjs7QUFNQSxhQUFLa0QsSUFBTCxDQUFVLFNBQVYsRUFBcUJlLElBQXJCO0FBQ0Q7QUFDRjs7Ozs7a0JBekdrQjdCLE0iLCJmaWxlIjoiU3VydmV5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNjZW5lIGZyb20gJy4uL2NvcmUvU2NlbmUnO1xuaW1wb3J0IFZpZXcgZnJvbSAnLi4vdmlld3MvVmlldyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcblxuY29uc3QgU0NFTkVfSUQgPSAnc3VydmV5JztcblxuY29uc3QgZGVmYXVsdFZpZXdUZW1wbGF0ZSA9IGBcbjxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcFwiPlxuICA8JSBpZiAoY291bnRlciA8PSBsZW5ndGgpIHsgJT5cbiAgICA8cCBjbGFzcz1cImNvdW50ZXJcIj48JT0gY291bnRlciAlPiAvIDwlPSBsZW5ndGggJT48L3A+XG4gIDwlIH0gJT5cbjwvZGl2PlxuPCUgaWYgKGNvdW50ZXIgPiBsZW5ndGgpIHsgJT5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgPHAgY2xhc3M9XCJiaWdcIj48JT0gdGhhbmtzICU+PC9wPlxuICA8L2Rpdj5cbjwlIH0gZWxzZSB7ICU+XG4gIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlclwiPjwvZGl2PlxuPCUgfSAlPlxuPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+XG4gIDwlIGlmIChjb3VudGVyIDwgbGVuZ3RoKSB7ICU+XG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ0blwiPjwlPSBuZXh0ICU+PC9idXR0b24+XG4gIDwlIH0gZWxzZSBpZiAoY291bnRlciA9PT0gbGVuZ3RoKSB7ICU+XG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ0blwiPjwlPSB2YWxpZGF0ZSAlPjwvYnV0dG9uPlxuICA8JSB9ICU+XG48L2Rpdj5gO1xuXG5jb25zdCBkZWZhdWx0Vmlld0NvbnRlbnQgPSB7XG4gIG5leHQ6ICdOZXh0JyxcbiAgdmFsaWRhdGU6ICdWYWxpZGF0ZScsXG4gIHRoYW5rczogJ1RoYW5rcyEnLFxuICBsZW5ndGg6ICctJyxcbn07XG5cbi8qKlxuICogUmVuZGVyZXJzXG4gKi9cbmNsYXNzIEJhc2VSZW5kZXJlciBleHRlbmRzIFZpZXcge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHRlbXBsYXRlLCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHRlbXBsYXRlLCBxdWVzdGlvbiwge30sIHsgY2xhc3NOYW1lOiAncXVlc3Rpb24nIH0pO1xuXG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5xdWVzdGlvbiA9IHF1ZXN0aW9uO1xuICAgIHRoaXMuaWQgPSBxdWVzdGlvbi5pZDtcbiAgfVxuXG4gIG9uUmVzaXplKHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uKSB7fVxufVxuXG5jb25zdCByYWRpb1RlbXBsYXRlID0gYFxuICA8cCBjbGFzcz1cImxhYmVsXCI+PCU9IGxhYmVsICU+PC9wPlxuICA8JSBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucykgeyAlPlxuICAgIDxwIGNsYXNzPVwiYW5zd2VyIHJhZGlvXCIgZGF0YS1rZXk9XCI8JT0ga2V5ICU+XCI+PCU9IG9wdGlvbnNba2V5XSAlPjwvcD5cbiAgPCUgfSAlPlxuYDtcblxuY2xhc3MgUmFkaW9SZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgcXVlc3Rpb24pIHtcbiAgICBzdXBlcihwYXJlbnQsIHJhZGlvVGVtcGxhdGUsIHF1ZXN0aW9uKTtcblxuICAgIHRoaXMuYW5zd2VyID0gbnVsbDtcbiAgICB0aGlzLl9vblNlbGVjdCA9IHRoaXMuX29uU2VsZWN0LmJpbmQodGhpcyk7XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICB0aGlzLmluc3RhbGxFdmVudHMoeyAnY2xpY2sgLmFuc3dlcic6IHRoaXMuX29uU2VsZWN0IH0pO1xuICAgIHRoaXMuJG9wdGlvbnMgPSBBcnJheS5mcm9tKHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbnN3ZXInKSk7XG4gIH1cblxuICBfb25TZWxlY3QoZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xuXG4gICAgdGhpcy4kb3B0aW9ucy5mb3JFYWNoKChlbCkgPT4geyBlbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpOyB9KTtcbiAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcblxuICAgIHRoaXMuYW5zd2VyID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1rZXknKTtcblxuICAgIHRoaXMucGFyZW50LmVuYWJsZUJ0bigpO1xuICB9XG5cbiAgZ2V0QW5zd2VyKCkge1xuICAgIHJldHVybiB0aGlzLmFuc3dlcjtcbiAgfVxufVxuXG5jb25zdCBjaGVja2JveFRlbXBsYXRlID0gYFxuICA8cCBjbGFzcz1cImxhYmVsXCI+PCU9IGxhYmVsICU+PC9wPlxuICA8JSBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucykgeyAlPlxuICAgIDxwIGNsYXNzPVwiYW5zd2VyIGNoZWNrYm94XCIgZGF0YS1rZXk9XCI8JT0ga2V5ICU+XCI+PCU9IG9wdGlvbnNba2V5XSAlPjwvcD5cbiAgPCUgfSAlPlxuYDtcblxuY2xhc3MgQ2hlY2tib3hSZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgcXVlc3Rpb24pIHtcbiAgICBzdXBlcihwYXJlbnQsIGNoZWNrYm94VGVtcGxhdGUsIHF1ZXN0aW9uKTtcblxuICAgIHRoaXMuYW5zd2VycyA9IFtdO1xuICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7ICdjbGljayAuYW5zd2VyJzogdGhpcy5fb25TZWxlY3QgfSk7XG4gIH1cblxuICBfb25TZWxlY3QoZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xuICAgIGNvbnN0IGtleSA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEta2V5Jyk7XG4gICAgY29uc3QgbWV0aG9kID0gdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKSA/ICdyZW1vdmUnIDogJ2FkZCc7XG5cbiAgICBpZiAobWV0aG9kID09PSAnYWRkJykge1xuICAgICAgdGhpcy5hbnN3ZXJzLnB1c2goa2V5KTtcbiAgICB9IGVsc2UgaWYgKChtZXRob2QgPT09ICdyZW1vdmUnKSkge1xuICAgICAgdGhpcy5hbnN3ZXJzLnNwbGljZSh0aGlzLmFuc3dlcnMuaW5kZXhPZihrZXkpLCAxKTtcbiAgICB9XG5cbiAgICB0YXJnZXQuY2xhc3NMaXN0W21ldGhvZF0oJ3NlbGVjdGVkJyk7XG5cbiAgICBpZiAodGhpcy5hbnN3ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucGFyZW50LmVuYWJsZUJ0bigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhcmVudC5kaXNhYmxlQnRuKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0QW5zd2VyKCkge1xuICAgIHJldHVybiB0aGlzLmFuc3dlcnMubGVuZ3RoID09PSAwID8gbnVsbCA6IHRoaXMuYW5zd2VycztcbiAgfVxufVxuXG5jb25zdCByYW5nZVRlbXBsYXRlID0gYFxuICA8cCBjbGFzcz1cImxhYmVsXCI+PCU9IGxhYmVsICU+PC9wPlxuICA8aW5wdXQgY2xhc3M9XCJzbGlkZXIgYW5zd2VyXCJcbiAgICB0eXBlPVwicmFuZ2VcIlxuICAgIG1pbj1cIjwlPSBvcHRpb25zLm1pbiAlPlwiXG4gICAgbWF4PVwiPCU9IG9wdGlvbnMubWF4ICU+XCJcbiAgICBzdGVwPVwiPCU9IG9wdGlvbnMuc3RlcCAlPlwiXG4gICAgdmFsdWU9XCI8JT0gb3B0aW9ucy5kZWZhdWx0ICU+XCIgLz5cbiAgPHNwYW4gY2xhc3M9XCJmZWVkYmFja1wiPjwlPSBvcHRpb25zLmRlZmF1bHQgJT48L3NwYW4+XG5gO1xuXG5jbGFzcyBSYW5nZVJlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHBhcmVudCwgcmFuZ2VUZW1wbGF0ZSwgcXVlc3Rpb24pO1xuXG4gICAgdGhpcy5hbnN3ZXIgPSBudWxsO1xuICAgIHRoaXMuX29uSW5wdXQgPSB0aGlzLl9vbklucHV0LmJpbmQodGhpcyk7XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICB0aGlzLmluc3RhbGxFdmVudHMoeyAnaW5wdXQgLmFuc3dlcic6IHRoaXMuX29uSW5wdXQgfSk7XG4gICAgdGhpcy4kc2xpZGVyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLnNsaWRlcicpXG4gICAgdGhpcy4kZmVlZGJhY2sgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuZmVlZGJhY2snKTtcbiAgfVxuXG4gIF9vbklucHV0KGUpIHtcbiAgICB0aGlzLiRmZWVkYmFjay50ZXh0Q29udGVudCA9IHRoaXMuJHNsaWRlci52YWx1ZTtcbiAgICB0aGlzLmFuc3dlciA9IHBhcnNlRmxvYXQodGhpcy4kc2xpZGVyLnZhbHVlKVxuICAgIHRoaXMucGFyZW50LmVuYWJsZUJ0bigpO1xuICB9XG5cbiAgZ2V0QW5zd2VyKCkge1xuICAgIHJldHVybiB0aGlzLmFuc3dlcjtcbiAgfVxufVxuXG5jb25zdCB0ZXh0YXJlYVRlbXBsYXRlID0gYFxuICA8cCBjbGFzcz1cImxhYmVsXCI+PCU9IGxhYmVsICU+PC9wPlxuICA8dGV4dGFyZWEgY2xhc3M9XCJhbnN3ZXIgdGV4dGFyZWFcIj48L3RleHRhcmVhPlxuYDtcblxuY2xhc3MgVGV4dEFyZWFSZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgcXVlc3Rpb24pIHtcbiAgICBzdXBlcihwYXJlbnQsIHRleHRhcmVhVGVtcGxhdGUsIHF1ZXN0aW9uKTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuJGxhYmVsID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLmxhYmVsJyk7XG4gICAgdGhpcy4kdGV4dGFyZWEgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuYW5zd2VyJyk7XG4gIH1cblxuICBvblJlc2l6ZSh2aWV3cG9ydFZpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICBpZiAoIXRoaXMuJHBhcmVudCkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHdpZHRoID0gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IGJvdW5kaW5nUmVjdC5oZWlnaHQ7XG5cbiAgICBjb25zdCBsYWJlbEhlaWdodCA9IHRoaXMuJGxhYmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICAgIHRoaXMuJHRleHRhcmVhLnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgIHRoaXMuJHRleHRhcmVhLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodCAtIGxhYmVsSGVpZ2h0fXB4YDtcbiAgfVxuXG4gIGdldEFuc3dlcigpIHtcbiAgICByZXR1cm4gdGhpcy4kdGV4dGFyZWEudmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBTdXJ2ZXkgbWFpbiB2dWVcbiAqL1xuY2xhc3MgU3VydmV5VmlldyBleHRlbmRzIFNlZ21lbnRlZFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnJhdGlvcyA9IHtcbiAgICAgICcuc2VjdGlvbi10b3AnOiAwLjE1LFxuICAgICAgJy5zZWN0aW9uLWNlbnRlcic6IDAuNjUsXG4gICAgICAnLnNlY3Rpb24tYm90dG9tJzogMC4yLFxuICAgIH07XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICBzdXBlci5vblJlbmRlcigpO1xuICAgIHRoaXMuJG5leHRCdG4gPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuYnRuJyk7XG4gIH1cblxuICBkaXNhYmxlQnRuKCkge1xuICAgIHRoaXMuJG5leHRCdG4uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpO1xuICB9XG5cbiAgZW5hYmxlQnRuKCkge1xuICAgIHRoaXMuJG5leHRCdG4ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICB9XG59XG5cblxuLyoqXG4gKiBBIHNjZW5lIHRvIGNyZWF0ZSBzdXJ2ZXlzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdXJ2ZXkgZXh0ZW5kcyBTY2VuZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNDRU5FX0lELCB0cnVlKTtcblxuICAgIHRoaXMuX2RlZmF1bHRWaWV3VGVtcGxhdGUgPSBkZWZhdWx0Vmlld1RlbXBsYXRlO1xuICAgIHRoaXMuX2RlZmF1bHRWaWV3Q29udGVudCA9IGRlZmF1bHRWaWV3Q29udGVudDtcblxuICAgIC8qKlxuICAgICAqIE9iamVjdCB1c2VkIHRvIHN0b3JlIHRoZSBhbnN3ZXJzIG9mIHRoZSBzdXJ2ZXkuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmFuc3dlcnMgPSB7fTtcblxuICAgIHRoaXMuX29uQ29uZmlnUmVzcG9uc2UgPSB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbiA9IHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24uYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbml0KCkge1xuICAgIHRoaXMudmlld0NvbnRlbnQuY291bnRlciA9IDA7XG4gICAgdGhpcy52aWV3RXZlbnRzID0geyAnY2xpY2sgLmJ0bic6IHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24gfTtcbiAgICB0aGlzLnZpZXdDdG9yID0gU3VydmV5VmlldztcblxuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zaG93KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2NvbmZpZycsIHRoaXMuX29uQ29uZmlnUmVzcG9uc2UpO1xuICB9XG5cbiAgX29uQ29uZmlnUmVzcG9uc2Uoc3VydmV5Q29uZmlnKSB7XG4gICAgLy8gc2V0IGxlbmd0aCBvZiB0aGUgc3VydmV5IGZvciB0aGUgdmlld1xuICAgIHRoaXMudmlld0NvbnRlbnQubGVuZ3RoID0gc3VydmV5Q29uZmlnLmxlbmd0aDtcbiAgICB0aGlzLl9jcmVhdGVSZW5kZXJlcnMoc3VydmV5Q29uZmlnKTtcbiAgICB0aGlzLl9kaXNwbGF5TmV4dFF1ZXN0aW9uKCk7XG4gIH1cblxuICBfY3JlYXRlUmVuZGVyZXJzKHN1cnZleUNvbmZpZykge1xuICAgIHRoaXMucmVuZGVyZXJzID0gc3VydmV5Q29uZmlnLm1hcCgocXVlc3Rpb24sIGluZGV4KSA9PiB7XG4gICAgICBsZXQgY3RvcjtcblxuICAgICAgc3dpdGNoIChxdWVzdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgJ3JhZGlvJzpcbiAgICAgICAgICBjdG9yID0gUmFkaW9SZW5kZXJlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICAgIGN0b3IgPSBDaGVja2JveFJlbmRlcmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyYW5nZSc6XG4gICAgICAgICAgY3RvciA9IFJhbmdlUmVuZGVyZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgICAgICBxdWVzdGlvbi5yZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICAgIGN0b3IgPSBUZXh0QXJlYVJlbmRlcmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IGN0b3IodGhpcy52aWV3LCBxdWVzdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICBfZGlzcGxheU5leHRRdWVzdGlvbigpIHtcbiAgICAvLyByZXRyaXZlIGFuZCBzdG9yZSBjdXJyZW50IGFuc3dlciBpZiBhbnlcbiAgICBpZiAodGhpcy5jdXJyZW50UmVuZGVyZXIpIHtcbiAgICAgIGNvbnN0IGFuc3dlciA9IHRoaXMuY3VycmVudFJlbmRlcmVyLmdldEFuc3dlcigpO1xuICAgICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLmN1cnJlbnRSZW5kZXJlci5xdWVzdGlvbi5yZXF1aXJlZDtcblxuICAgICAgLy8gcmV0dXJuIGlmIG5vIGFuc3dlciBhbmQgcmVxdWlyZWQgcXVlc3Rpb25cbiAgICAgIGlmIChhbnN3ZXIgPT09IG51bGwgJiYgcmVxdWlyZWQpIHJldHVybjtcblxuICAgICAgdGhpcy5hbnN3ZXJzW3RoaXMuY3VycmVudFJlbmRlcmVyLmlkXSA9IGFuc3dlcjtcbiAgICB9XG5cbiAgICAvLyByZXRyaWV2ZSB0aGUgbmV4dCByZW5kZXJlclxuICAgIHRoaXMuY3VycmVudFJlbmRlcmVyID0gdGhpcy5yZW5kZXJlcnMuc2hpZnQoKTtcbiAgICAvLyB1cGRhdGUgY291bnRlclxuICAgIHRoaXMudmlld0NvbnRlbnQuY291bnRlciArPSAxO1xuXG4gICAgaWYgKHRoaXMuY3VycmVudFJlbmRlcmVyKSB7XG4gICAgICB0aGlzLnZpZXcuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tY2VudGVyJywgdGhpcy5jdXJyZW50UmVuZGVyZXIpO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcigpO1xuXG4gICAgICBpZiAodGhpcy5jdXJyZW50UmVuZGVyZXIucXVlc3Rpb24ucmVxdWlyZWQpXG4gICAgICAgIHRoaXMudmlldy5kaXNhYmxlQnRuKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlldy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1jZW50ZXInLCBudWxsKTtcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICAgIC8vIHNlbmQgaW5mb3JtYXRpb25zIHRvIHNlcnZlclxuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgICAgdXNlckFnZW50OiBuYXZpZ2F0b3IudXNlckFnZW50LFxuICAgICAgICBhbnN3ZXJzOiB0aGlzLmFuc3dlcnMsXG4gICAgICB9O1xuXG4gICAgICB0aGlzLnNlbmQoJ2Fuc3dlcnMnLCBkYXRhKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==