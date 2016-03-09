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
 * A module to create surveys.
 */

var ClientSurvey = function (_Scene) {
  (0, _inherits3.default)(ClientSurvey, _Scene);

  function ClientSurvey() {
    (0, _classCallCheck3.default)(this, ClientSurvey);


    /**
     * Object used to store the answers of the survey.
     * @type {Object}
     */

    var _this7 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ClientSurvey).call(this, SCENE_ID, true));

    _this7.answers = {};

    _this7._onConfigResponse = _this7._onConfigResponse.bind(_this7);
    _this7._displayNextQuestion = _this7._displayNextQuestion.bind(_this7);
    return _this7;
  }

  /** @private */


  (0, _createClass3.default)(ClientSurvey, [{
    key: 'init',
    value: function init() {
      this.content.counter = 0;
      this.events = { 'click .btn': this._displayNextQuestion };
      this.viewCtor = SurveyView;

      this.view = this.createView();
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientSurvey.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.show();

      this.send('request');
      this.receive('config', this._onConfigResponse);
    }
  }, {
    key: '_onConfigResponse',
    value: function _onConfigResponse(surveyConfig) {
      // set length of the survey for the view
      this.content.length = surveyConfig.length;
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
      this.content.counter += 1;

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
  return ClientSurvey;
}(_Scene3.default);

exports.default = ClientSurvey;
//# sourceMappingURL=data:application/json;base64,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eEIsWUFBSSxLQUFLLGVBQUwsQ0FBcUIsUUFBckIsQ0FBOEIsUUFBOUIsRUFDRixLQUFLLElBQUwsQ0FBVSxVQUFWLEdBREY7T0FKRixNQU1PO0FBQ0wsYUFBSyxJQUFMLENBQVUsZ0JBQVYsQ0FBMkIsaUJBQTNCLEVBQThDLElBQTlDLEVBREs7QUFFTCxhQUFLLElBQUwsQ0FBVSxNQUFWOztBQUZLLFlBSUMsT0FBTztBQUNYLHFCQUFXLElBQUksSUFBSixHQUFXLE9BQVgsRUFBWDtBQUNBLHFCQUFXLFVBQVUsU0FBVjtBQUNYLG1CQUFTLEtBQUssT0FBTDtTQUhMLENBSkQ7O0FBVUwsYUFBSyxJQUFMLENBQVUsU0FBVixFQUFxQixJQUFyQixFQVZLO09BTlA7OztTQXBGaUIiLCJmaWxlIjoiQ2xpZW50U3VydmV5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNjZW5lIGZyb20gJy4uL2NvcmUvU2NlbmUnO1xuaW1wb3J0IFZpZXcgZnJvbSAnLi4vdmlld3MvVmlldyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcblxuLyoqXG4gKiBSZW5kZXJlcnNcbiAqL1xuY2xhc3MgQmFzZVJlbmRlcmVyIGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgdGVtcGxhdGUsIHF1ZXN0aW9uKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIHF1ZXN0aW9uLCB7fSwgeyBjbGFzc05hbWU6ICdxdWVzdGlvbicgfSk7XG5cbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLnF1ZXN0aW9uID0gcXVlc3Rpb247XG4gICAgdGhpcy5pZCA9IHF1ZXN0aW9uLmlkO1xuICB9XG5cbiAgb25SZXNpemUod2lkdGgsIGhlaWdodCwgb3JpZW50YXRpb24pIHt9XG59XG5cbmNvbnN0IHJhZGlvVGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDwlIGZvciAodmFyIGtleSBpbiBvcHRpb25zKSB7ICU+XG4gICAgPHAgY2xhc3M9XCJhbnN3ZXIgcmFkaW9cIiBkYXRhLWtleT1cIjwlPSBrZXkgJT5cIj48JT0gb3B0aW9uc1trZXldICU+PC9wPlxuICA8JSB9ICU+XG5gO1xuXG5jbGFzcyBSYWRpb1JlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHBhcmVudCwgcmFkaW9UZW1wbGF0ZSwgcXVlc3Rpb24pO1xuXG4gICAgdGhpcy5hbnN3ZXIgPSBudWxsO1xuICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7ICdjbGljayAuYW5zd2VyJzogdGhpcy5fb25TZWxlY3QgfSk7XG4gICAgdGhpcy4kb3B0aW9ucyA9IEFycmF5LmZyb20odGhpcy4kZWwucXVlcnlTZWxlY3RvckFsbCgnLmFuc3dlcicpKTtcbiAgfVxuXG4gIF9vblNlbGVjdChlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICB0aGlzLiRvcHRpb25zLmZvckVhY2goKGVsKSA9PiB7IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7IH0pO1xuICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuXG4gICAgdGhpcy5hbnN3ZXIgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWtleScpO1xuXG4gICAgdGhpcy5wYXJlbnQuZW5hYmxlQnRuKCk7XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5zd2VyO1xuICB9XG59XG5cbmNvbnN0IGNoZWNrYm94VGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDwlIGZvciAodmFyIGtleSBpbiBvcHRpb25zKSB7ICU+XG4gICAgPHAgY2xhc3M9XCJhbnN3ZXIgY2hlY2tib3hcIiBkYXRhLWtleT1cIjwlPSBrZXkgJT5cIj48JT0gb3B0aW9uc1trZXldICU+PC9wPlxuICA8JSB9ICU+XG5gO1xuXG5jbGFzcyBDaGVja2JveFJlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHBhcmVudCwgY2hlY2tib3hUZW1wbGF0ZSwgcXVlc3Rpb24pO1xuXG4gICAgdGhpcy5hbnN3ZXJzID0gW107XG4gICAgdGhpcy5fb25TZWxlY3QgPSB0aGlzLl9vblNlbGVjdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy5pbnN0YWxsRXZlbnRzKHsgJ2NsaWNrIC5hbnN3ZXInOiB0aGlzLl9vblNlbGVjdCB9KTtcbiAgfVxuXG4gIF9vblNlbGVjdChlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgY29uc3Qga2V5ID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1rZXknKTtcbiAgICBjb25zdCBtZXRob2QgPSB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpID8gJ3JlbW92ZScgOiAnYWRkJztcblxuICAgIGlmIChtZXRob2QgPT09ICdhZGQnKSB7XG4gICAgICB0aGlzLmFuc3dlcnMucHVzaChrZXkpO1xuICAgIH0gZWxzZSBpZiAoKG1ldGhvZCA9PT0gJ3JlbW92ZScpKSB7XG4gICAgICB0aGlzLmFuc3dlcnMuc3BsaWNlKHRoaXMuYW5zd2Vycy5pbmRleE9mKGtleSksIDEpO1xuICAgIH1cblxuICAgIHRhcmdldC5jbGFzc0xpc3RbbWV0aG9kXSgnc2VsZWN0ZWQnKTtcblxuICAgIGlmICh0aGlzLmFuc3dlcnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5wYXJlbnQuZW5hYmxlQnRuKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFyZW50LmRpc2FibGVCdG4oKTtcbiAgICB9XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5zd2Vycy5sZW5ndGggPT09IDAgPyBudWxsIDogdGhpcy5hbnN3ZXJzO1xuICB9XG59XG5cbmNvbnN0IHJhbmdlVGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDxpbnB1dCBjbGFzcz1cInNsaWRlciBhbnN3ZXJcIlxuICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgbWluPVwiPCU9IG9wdGlvbnMubWluICU+XCJcbiAgICBtYXg9XCI8JT0gb3B0aW9ucy5tYXggJT5cIlxuICAgIHN0ZXA9XCI8JT0gb3B0aW9ucy5zdGVwICU+XCJcbiAgICB2YWx1ZT1cIjwlPSBvcHRpb25zLmRlZmF1bHQgJT5cIiAvPlxuICA8c3BhbiBjbGFzcz1cImZlZWRiYWNrXCI+PCU9IG9wdGlvbnMuZGVmYXVsdCAlPjwvc3Bhbj5cbmA7XG5cbmNsYXNzIFJhbmdlUmVuZGVyZXIgZXh0ZW5kcyBCYXNlUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHF1ZXN0aW9uKSB7XG4gICAgc3VwZXIocGFyZW50LCByYW5nZVRlbXBsYXRlLCBxdWVzdGlvbik7XG5cbiAgICB0aGlzLmFuc3dlciA9IG51bGw7XG4gICAgdGhpcy5fb25JbnB1dCA9IHRoaXMuX29uSW5wdXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7ICdpbnB1dCAuYW5zd2VyJzogdGhpcy5fb25JbnB1dCB9KTtcbiAgICB0aGlzLiRzbGlkZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyJylcbiAgICB0aGlzLiRmZWVkYmFjayA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5mZWVkYmFjaycpO1xuICB9XG5cbiAgX29uSW5wdXQoZSkge1xuICAgIHRoaXMuJGZlZWRiYWNrLnRleHRDb250ZW50ID0gdGhpcy4kc2xpZGVyLnZhbHVlO1xuICAgIHRoaXMuYW5zd2VyID0gcGFyc2VGbG9hdCh0aGlzLiRzbGlkZXIudmFsdWUpXG4gICAgdGhpcy5wYXJlbnQuZW5hYmxlQnRuKCk7XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5zd2VyO1xuICB9XG59XG5cbmNvbnN0IHRleHRhcmVhVGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDx0ZXh0YXJlYSBjbGFzcz1cImFuc3dlciB0ZXh0YXJlYVwiPjwvdGV4dGFyZWE+XG5gO1xuXG5jbGFzcyBUZXh0QXJlYVJlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHBhcmVudCwgdGV4dGFyZWFUZW1wbGF0ZSwgcXVlc3Rpb24pO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy4kbGFiZWwgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcubGFiZWwnKTtcbiAgICB0aGlzLiR0ZXh0YXJlYSA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5hbnN3ZXInKTtcbiAgfVxuXG4gIG9uUmVzaXplKHZpZXdwb3J0VmlkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIGlmICghdGhpcy4kcGFyZW50KSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGhpcy4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qgd2lkdGggPSBib3VuZGluZ1JlY3Qud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gYm91bmRpbmdSZWN0LmhlaWdodDtcblxuICAgIGNvbnN0IGxhYmVsSGVpZ2h0ID0gdGhpcy4kbGFiZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuXG4gICAgdGhpcy4kdGV4dGFyZWEuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgdGhpcy4kdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0IC0gbGFiZWxIZWlnaHR9cHhgO1xuICB9XG5cbiAgZ2V0QW5zd2VyKCkge1xuICAgIHJldHVybiB0aGlzLiR0ZXh0YXJlYS52YWx1ZTtcbiAgfVxufVxuXG4vKipcbiAqIFN1cnZleSBtYWluIHZ1ZVxuICovXG5jbGFzcyBTdXJ2ZXlWaWV3IGV4dGVuZHMgU2VnbWVudGVkVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpIHtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIHRoaXMucmF0aW9zID0ge1xuICAgICAgJy5zZWN0aW9uLXRvcCc6IDAuMTUsXG4gICAgICAnLnNlY3Rpb24tY2VudGVyJzogMC42NSxcbiAgICAgICcuc2VjdGlvbi1ib3R0b20nOiAwLjIsXG4gICAgfTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHN1cGVyLm9uUmVuZGVyKCk7XG4gICAgdGhpcy4kbmV4dEJ0biA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5idG4nKTtcbiAgfVxuXG4gIGRpc2FibGVCdG4oKSB7XG4gICAgdGhpcy4kbmV4dEJ0bi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gIH1cblxuICBlbmFibGVCdG4oKSB7XG4gICAgdGhpcy4kbmV4dEJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gIH1cbn1cblxuY29uc3QgU0NFTkVfSUQgPSAnc3VydmV5JztcblxuLyoqXG4gKiBBIG1vZHVsZSB0byBjcmVhdGUgc3VydmV5cy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50U3VydmV5IGV4dGVuZHMgU2NlbmUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTQ0VORV9JRCwgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBPYmplY3QgdXNlZCB0byBzdG9yZSB0aGUgYW5zd2VycyBvZiB0aGUgc3VydmV5LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5hbnN3ZXJzID0ge307XG5cbiAgICB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlID0gdGhpcy5fb25Db25maWdSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24gPSB0aGlzLl9kaXNwbGF5TmV4dFF1ZXN0aW9uLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmNvbnRlbnQuY291bnRlciA9IDA7XG4gICAgdGhpcy5ldmVudHMgPSB7ICdjbGljayAuYnRuJzogdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbiB9O1xuICAgIHRoaXMudmlld0N0b3IgPSBTdXJ2ZXlWaWV3O1xuXG4gICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNob3coKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuICAgIHRoaXMucmVjZWl2ZSgnY29uZmlnJywgdGhpcy5fb25Db25maWdSZXNwb25zZSk7XG4gIH1cblxuICBfb25Db25maWdSZXNwb25zZShzdXJ2ZXlDb25maWcpIHtcbiAgICAvLyBzZXQgbGVuZ3RoIG9mIHRoZSBzdXJ2ZXkgZm9yIHRoZSB2aWV3XG4gICAgdGhpcy5jb250ZW50Lmxlbmd0aCA9IHN1cnZleUNvbmZpZy5sZW5ndGg7XG4gICAgdGhpcy5fY3JlYXRlUmVuZGVyZXJzKHN1cnZleUNvbmZpZyk7XG4gICAgdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbigpO1xuICB9XG5cbiAgX2NyZWF0ZVJlbmRlcmVycyhzdXJ2ZXlDb25maWcpIHtcbiAgICB0aGlzLnJlbmRlcmVycyA9IHN1cnZleUNvbmZpZy5tYXAoKHF1ZXN0aW9uLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IGN0b3I7XG5cbiAgICAgIHN3aXRjaCAocXVlc3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlICdyYWRpbyc6XG4gICAgICAgICAgY3RvciA9IFJhZGlvUmVuZGVyZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2NoZWNrYm94JzpcbiAgICAgICAgICBjdG9yID0gQ2hlY2tib3hSZW5kZXJlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmFuZ2UnOlxuICAgICAgICAgIGN0b3IgPSBSYW5nZVJlbmRlcmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICAgICAgcXVlc3Rpb24ucmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICBjdG9yID0gVGV4dEFyZWFSZW5kZXJlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBjdG9yKHRoaXMudmlldywgcXVlc3Rpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgX2Rpc3BsYXlOZXh0UXVlc3Rpb24oKSB7XG4gICAgLy8gcmV0cml2ZSBhbmQgc3RvcmUgY3VycmVudCBhbnN3ZXIgaWYgYW55XG4gICAgaWYgKHRoaXMuY3VycmVudFJlbmRlcmVyKSB7XG4gICAgICBjb25zdCBhbnN3ZXIgPSB0aGlzLmN1cnJlbnRSZW5kZXJlci5nZXRBbnN3ZXIoKTtcbiAgICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5jdXJyZW50UmVuZGVyZXIucXVlc3Rpb24ucmVxdWlyZWQ7XG5cbiAgICAgIC8vIHJldHVybiBpZiBubyBhbnN3ZXIgYW5kIHJlcXVpcmVkIHF1ZXN0aW9uXG4gICAgICBpZiAoYW5zd2VyID09PSBudWxsICYmIHJlcXVpcmVkKSByZXR1cm47XG5cbiAgICAgIHRoaXMuYW5zd2Vyc1t0aGlzLmN1cnJlbnRSZW5kZXJlci5pZF0gPSBhbnN3ZXI7XG4gICAgfVxuXG4gICAgLy8gcmV0cmlldmUgdGhlIG5leHQgcmVuZGVyZXJcbiAgICB0aGlzLmN1cnJlbnRSZW5kZXJlciA9IHRoaXMucmVuZGVyZXJzLnNoaWZ0KCk7XG4gICAgLy8gdXBkYXRlIGNvdW50ZXJcbiAgICB0aGlzLmNvbnRlbnQuY291bnRlciArPSAxO1xuXG4gICAgaWYgKHRoaXMuY3VycmVudFJlbmRlcmVyKSB7XG4gICAgICB0aGlzLnZpZXcuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tY2VudGVyJywgdGhpcy5jdXJyZW50UmVuZGVyZXIpO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcigpO1xuXG4gICAgICBpZiAodGhpcy5jdXJyZW50UmVuZGVyZXIucXVlc3Rpb24ucmVxdWlyZWQpXG4gICAgICAgIHRoaXMudmlldy5kaXNhYmxlQnRuKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlldy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1jZW50ZXInLCBudWxsKTtcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICAgIC8vIHNlbmQgaW5mb3JtYXRpb25zIHRvIHNlcnZlclxuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgICAgdXNlckFnZW50OiBuYXZpZ2F0b3IudXNlckFnZW50LFxuICAgICAgICBhbnN3ZXJzOiB0aGlzLmFuc3dlcnMsXG4gICAgICB9O1xuXG4gICAgICB0aGlzLnNlbmQoJ2Fuc3dlcnMnLCBkYXRhKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==