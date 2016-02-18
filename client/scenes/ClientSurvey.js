'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreScene = require('../core/Scene');

var _coreScene2 = _interopRequireDefault(_coreScene);

var _displayView = require('../display/View');

var _displayView2 = _interopRequireDefault(_displayView);

var _displaySegmentedView = require('../display/SegmentedView');

var _displaySegmentedView2 = _interopRequireDefault(_displaySegmentedView);

/**
 * Renderers
 */

var BaseRenderer = (function (_View) {
  _inherits(BaseRenderer, _View);

  function BaseRenderer(parent, template, question) {
    _classCallCheck(this, BaseRenderer);

    _get(Object.getPrototypeOf(BaseRenderer.prototype), 'constructor', this).call(this, template, question, {}, { className: 'question' });

    this.parent = parent;
    this.question = question;
    this.id = question.id;
  }

  _createClass(BaseRenderer, [{
    key: 'onResize',
    value: function onResize(orientation, width, height) {}
  }]);

  return BaseRenderer;
})(_displayView2['default']);

var radioTemplate = '\n  <p class="label"><%= label %></p>\n  <% for (var key in options) { %>\n    <p class="answer radio" data-key="<%= key %>"><%= options[key] %></p>\n  <% } %>\n';

var RadioRenderer = (function (_BaseRenderer) {
  _inherits(RadioRenderer, _BaseRenderer);

  function RadioRenderer(parent, question) {
    _classCallCheck(this, RadioRenderer);

    _get(Object.getPrototypeOf(RadioRenderer.prototype), 'constructor', this).call(this, parent, radioTemplate, question);

    this.answer = null;
    this._onSelect = this._onSelect.bind(this);
  }

  _createClass(RadioRenderer, [{
    key: 'onRender',
    value: function onRender() {
      this.installEvents({ 'click .answer': this._onSelect });
      this.$options = _Array$from(this.$el.querySelectorAll('.answer'));
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
})(BaseRenderer);

var checkboxTemplate = '\n  <p class="label"><%= label %></p>\n  <% for (var key in options) { %>\n    <p class="answer checkbox" data-key="<%= key %>"><%= options[key] %></p>\n  <% } %>\n';

var CheckboxRenderer = (function (_BaseRenderer2) {
  _inherits(CheckboxRenderer, _BaseRenderer2);

  function CheckboxRenderer(parent, question) {
    _classCallCheck(this, CheckboxRenderer);

    _get(Object.getPrototypeOf(CheckboxRenderer.prototype), 'constructor', this).call(this, parent, checkboxTemplate, question);

    this.answers = [];
    this._onSelect = this._onSelect.bind(this);
  }

  _createClass(CheckboxRenderer, [{
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
})(BaseRenderer);

var rangeTemplate = '\n  <p class="label"><%= label %></p>\n  <input class="slider answer"\n    type="range"\n    min="<%= options.min %>"\n    max="<%= options.max %>"\n    step="<%= options.step %>"\n    value="<%= options.default %>" />\n  <span class="feedback"><%= options.default %></span>\n';

var RangeRenderer = (function (_BaseRenderer3) {
  _inherits(RangeRenderer, _BaseRenderer3);

  function RangeRenderer(parent, question) {
    _classCallCheck(this, RangeRenderer);

    _get(Object.getPrototypeOf(RangeRenderer.prototype), 'constructor', this).call(this, parent, rangeTemplate, question);

    this.answer = null;
    this._onInput = this._onInput.bind(this);
  }

  _createClass(RangeRenderer, [{
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
})(BaseRenderer);

var textareaTemplate = '\n  <p class="label"><%= label %></p>\n  <textarea class="answer textarea"></textarea>\n';

var TextAreaRenderer = (function (_BaseRenderer4) {
  _inherits(TextAreaRenderer, _BaseRenderer4);

  function TextAreaRenderer(parent, question) {
    _classCallCheck(this, TextAreaRenderer);

    _get(Object.getPrototypeOf(TextAreaRenderer.prototype), 'constructor', this).call(this, parent, textareaTemplate, question);
  }

  /**
   * Survey main vue
   */

  _createClass(TextAreaRenderer, [{
    key: 'onRender',
    value: function onRender() {
      this.$label = this.$el.querySelector('.label');
      this.$textarea = this.$el.querySelector('.answer');
    }
  }, {
    key: 'onShow',
    value: function onShow() {
      this.onResize();
    }
  }, {
    key: 'onResize',
    value: function onResize(orientation, viewportVidth, viewportHeight) {
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
})(BaseRenderer);

var SurveyView = (function (_SegmentedView) {
  _inherits(SurveyView, _SegmentedView);

  function SurveyView(template, content, events, options) {
    _classCallCheck(this, SurveyView);

    _get(Object.getPrototypeOf(SurveyView.prototype), 'constructor', this).call(this, template, content, events, options);

    this.ratios = {
      '.section-top': 0.15,
      '.section-center': 0.65,
      '.section-bottom': 0.2
    };
  }

  _createClass(SurveyView, [{
    key: 'onRender',
    value: function onRender() {
      _get(Object.getPrototypeOf(SurveyView.prototype), 'onRender', this).call(this);
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
})(_displaySegmentedView2['default']);

var SCENE_ID = 'survey';

/**
 * A module to create surveys.
 */

var ClientSurvey = (function (_Scene) {
  _inherits(ClientSurvey, _Scene);

  function ClientSurvey() {
    _classCallCheck(this, ClientSurvey);

    _get(Object.getPrototypeOf(ClientSurvey.prototype), 'constructor', this).call(this, SCENE_ID, true);

    /**
     * Object used to store the answers of the survey.
     * @type {Object}
     */
    this.answers = {};

    this._onConfigResponse = this._onConfigResponse.bind(this);
    this._displayNextQuestion = this._displayNextQuestion.bind(this);
  }

  /** @private */

  _createClass(ClientSurvey, [{
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
      _get(Object.getPrototypeOf(ClientSurvey.prototype), 'start', this).call(this);

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
      var _this = this;

      this.renderers = surveyConfig.map(function (question, index) {
        var ctor = undefined;

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

        return new ctor(_this.view, question);
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
})(_coreScene2['default']);

exports['default'] = ClientSurvey;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2NlbmVzL0NsaWVudFN1cnZleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQWtCLGVBQWU7Ozs7MkJBQ2hCLGlCQUFpQjs7OztvQ0FDUiwwQkFBMEI7Ozs7Ozs7O0lBSzlDLFlBQVk7WUFBWixZQUFZOztBQUNMLFdBRFAsWUFBWSxDQUNKLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFOzBCQURwQyxZQUFZOztBQUVkLCtCQUZFLFlBQVksNkNBRVIsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEVBQUU7O0FBRXpELFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQztHQUN2Qjs7ZUFQRyxZQUFZOztXQVNSLGtCQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUU7OztTQVRuQyxZQUFZOzs7QUFZbEIsSUFBTSxhQUFhLHNLQUtsQixDQUFDOztJQUVJLGFBQWE7WUFBYixhQUFhOztBQUNOLFdBRFAsYUFBYSxDQUNMLE1BQU0sRUFBRSxRQUFRLEVBQUU7MEJBRDFCLGFBQWE7O0FBRWYsK0JBRkUsYUFBYSw2Q0FFVCxNQUFNLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRTs7QUFFdkMsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM1Qzs7ZUFORyxhQUFhOztXQVFULG9CQUFHO0FBQ1QsVUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLGVBQWUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsUUFB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Q0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDNUI7S0FDRjs7O1NBdEdrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiJzcmMvY2xpZW50L3NjZW5lcy9DbGllbnRTdXJ2ZXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2NlbmUgZnJvbSAnLi4vY29yZS9TY2VuZSc7XG5pbXBvcnQgVmlldyBmcm9tICcuLi9kaXNwbGF5L1ZpZXcnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcblxuLyoqXG4gKiBSZW5kZXJlcnNcbiAqL1xuY2xhc3MgQmFzZVJlbmRlcmVyIGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgdGVtcGxhdGUsIHF1ZXN0aW9uKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIHF1ZXN0aW9uLCB7fSwgeyBjbGFzc05hbWU6ICdxdWVzdGlvbicgfSk7XG5cbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLnF1ZXN0aW9uID0gcXVlc3Rpb247XG4gICAgdGhpcy5pZCA9IHF1ZXN0aW9uLmlkO1xuICB9XG5cbiAgb25SZXNpemUob3JpZW50YXRpb24sIHdpZHRoLCBoZWlnaHQpIHt9XG59XG5cbmNvbnN0IHJhZGlvVGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDwlIGZvciAodmFyIGtleSBpbiBvcHRpb25zKSB7ICU+XG4gICAgPHAgY2xhc3M9XCJhbnN3ZXIgcmFkaW9cIiBkYXRhLWtleT1cIjwlPSBrZXkgJT5cIj48JT0gb3B0aW9uc1trZXldICU+PC9wPlxuICA8JSB9ICU+XG5gO1xuXG5jbGFzcyBSYWRpb1JlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHBhcmVudCwgcmFkaW9UZW1wbGF0ZSwgcXVlc3Rpb24pO1xuXG4gICAgdGhpcy5hbnN3ZXIgPSBudWxsO1xuICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7ICdjbGljayAuYW5zd2VyJzogdGhpcy5fb25TZWxlY3QgfSk7XG4gICAgdGhpcy4kb3B0aW9ucyA9IEFycmF5LmZyb20odGhpcy4kZWwucXVlcnlTZWxlY3RvckFsbCgnLmFuc3dlcicpKTtcbiAgfVxuXG4gIF9vblNlbGVjdChlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICB0aGlzLiRvcHRpb25zLmZvckVhY2goKGVsKSA9PiB7IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7IH0pO1xuICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuXG4gICAgdGhpcy5hbnN3ZXIgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWtleScpO1xuXG4gICAgdGhpcy5wYXJlbnQuZW5hYmxlQnRuKCk7XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5zd2VyO1xuICB9XG59XG5cbmNvbnN0IGNoZWNrYm94VGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDwlIGZvciAodmFyIGtleSBpbiBvcHRpb25zKSB7ICU+XG4gICAgPHAgY2xhc3M9XCJhbnN3ZXIgY2hlY2tib3hcIiBkYXRhLWtleT1cIjwlPSBrZXkgJT5cIj48JT0gb3B0aW9uc1trZXldICU+PC9wPlxuICA8JSB9ICU+XG5gO1xuXG5jbGFzcyBDaGVja2JveFJlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHBhcmVudCwgY2hlY2tib3hUZW1wbGF0ZSwgcXVlc3Rpb24pO1xuXG4gICAgdGhpcy5hbnN3ZXJzID0gW107XG4gICAgdGhpcy5fb25TZWxlY3QgPSB0aGlzLl9vblNlbGVjdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy5pbnN0YWxsRXZlbnRzKHsgJ2NsaWNrIC5hbnN3ZXInOiB0aGlzLl9vblNlbGVjdCB9KTtcbiAgfVxuXG4gIF9vblNlbGVjdChlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgY29uc3Qga2V5ID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1rZXknKTtcbiAgICBjb25zdCBtZXRob2QgPSB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpID8gJ3JlbW92ZScgOiAnYWRkJztcblxuICAgIGlmIChtZXRob2QgPT09ICdhZGQnKSB7XG4gICAgICB0aGlzLmFuc3dlcnMucHVzaChrZXkpO1xuICAgIH0gZWxzZSBpZiAoKG1ldGhvZCA9PT0gJ3JlbW92ZScpKSB7XG4gICAgICB0aGlzLmFuc3dlcnMuc3BsaWNlKHRoaXMuYW5zd2Vycy5pbmRleE9mKGtleSksIDEpO1xuICAgIH1cblxuICAgIHRhcmdldC5jbGFzc0xpc3RbbWV0aG9kXSgnc2VsZWN0ZWQnKTtcblxuICAgIGlmICh0aGlzLmFuc3dlcnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5wYXJlbnQuZW5hYmxlQnRuKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFyZW50LmRpc2FibGVCdG4oKTtcbiAgICB9XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5zd2Vycy5sZW5ndGggPT09IDAgPyBudWxsIDogdGhpcy5hbnN3ZXJzO1xuICB9XG59XG5cbmNvbnN0IHJhbmdlVGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDxpbnB1dCBjbGFzcz1cInNsaWRlciBhbnN3ZXJcIlxuICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgbWluPVwiPCU9IG9wdGlvbnMubWluICU+XCJcbiAgICBtYXg9XCI8JT0gb3B0aW9ucy5tYXggJT5cIlxuICAgIHN0ZXA9XCI8JT0gb3B0aW9ucy5zdGVwICU+XCJcbiAgICB2YWx1ZT1cIjwlPSBvcHRpb25zLmRlZmF1bHQgJT5cIiAvPlxuICA8c3BhbiBjbGFzcz1cImZlZWRiYWNrXCI+PCU9IG9wdGlvbnMuZGVmYXVsdCAlPjwvc3Bhbj5cbmA7XG5cbmNsYXNzIFJhbmdlUmVuZGVyZXIgZXh0ZW5kcyBCYXNlUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHF1ZXN0aW9uKSB7XG4gICAgc3VwZXIocGFyZW50LCByYW5nZVRlbXBsYXRlLCBxdWVzdGlvbik7XG5cbiAgICB0aGlzLmFuc3dlciA9IG51bGw7XG4gICAgdGhpcy5fb25JbnB1dCA9IHRoaXMuX29uSW5wdXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7ICdpbnB1dCAuYW5zd2VyJzogdGhpcy5fb25JbnB1dCB9KTtcbiAgICB0aGlzLiRzbGlkZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyJylcbiAgICB0aGlzLiRmZWVkYmFjayA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5mZWVkYmFjaycpO1xuICB9XG5cbiAgX29uSW5wdXQoZSkge1xuICAgIHRoaXMuJGZlZWRiYWNrLnRleHRDb250ZW50ID0gdGhpcy4kc2xpZGVyLnZhbHVlO1xuICAgIHRoaXMuYW5zd2VyID0gcGFyc2VGbG9hdCh0aGlzLiRzbGlkZXIudmFsdWUpXG4gICAgdGhpcy5wYXJlbnQuZW5hYmxlQnRuKCk7XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5zd2VyO1xuICB9XG59XG5cbmNvbnN0IHRleHRhcmVhVGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDx0ZXh0YXJlYSBjbGFzcz1cImFuc3dlciB0ZXh0YXJlYVwiPjwvdGV4dGFyZWE+XG5gO1xuXG5jbGFzcyBUZXh0QXJlYVJlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHBhcmVudCwgdGV4dGFyZWFUZW1wbGF0ZSwgcXVlc3Rpb24pO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy4kbGFiZWwgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcubGFiZWwnKTtcbiAgICB0aGlzLiR0ZXh0YXJlYSA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5hbnN3ZXInKTtcbiAgfVxuXG4gIG9uU2hvdygpIHtcbiAgICB0aGlzLm9uUmVzaXplKCk7XG4gIH1cblxuICBvblJlc2l6ZShvcmllbnRhdGlvbiwgdmlld3BvcnRWaWR0aCwgdmlld3BvcnRIZWlnaHQpIHtcbiAgICBpZiAoIXRoaXMuJHBhcmVudCkgeyByZXR1cm47IH1cbiAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB3aWR0aCA9IGJvdW5kaW5nUmVjdC53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSBib3VuZGluZ1JlY3QuaGVpZ2h0O1xuXG4gICAgY29uc3QgbGFiZWxIZWlnaHQgPSB0aGlzLiRsYWJlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG5cbiAgICB0aGlzLiR0ZXh0YXJlYS5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICB0aGlzLiR0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHQgLSBsYWJlbEhlaWdodH1weGA7XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuJHRleHRhcmVhLnZhbHVlO1xuICB9XG59XG5cbi8qKlxuICogU3VydmV5IG1haW4gdnVlXG4gKi9cbmNsYXNzIFN1cnZleVZpZXcgZXh0ZW5kcyBTZWdtZW50ZWRWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucykge1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5yYXRpb3MgPSB7XG4gICAgICAnLnNlY3Rpb24tdG9wJzogMC4xNSxcbiAgICAgICcuc2VjdGlvbi1jZW50ZXInOiAwLjY1LFxuICAgICAgJy5zZWN0aW9uLWJvdHRvbSc6IDAuMixcbiAgICB9O1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgc3VwZXIub25SZW5kZXIoKTtcbiAgICB0aGlzLiRuZXh0QnRuID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLmJ0bicpO1xuICB9XG5cbiAgZGlzYWJsZUJ0bigpIHtcbiAgICB0aGlzLiRuZXh0QnRuLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgfVxuXG4gIGVuYWJsZUJ0bigpIHtcbiAgICB0aGlzLiRuZXh0QnRuLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgfVxufVxuXG5jb25zdCBTQ0VORV9JRCA9ICdzdXJ2ZXknO1xuXG4vKipcbiAqIEEgbW9kdWxlIHRvIGNyZWF0ZSBzdXJ2ZXlzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRTdXJ2ZXkgZXh0ZW5kcyBTY2VuZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNDRU5FX0lELCB0cnVlKTtcblxuICAgIC8qKlxuICAgICAqIE9iamVjdCB1c2VkIHRvIHN0b3JlIHRoZSBhbnN3ZXJzIG9mIHRoZSBzdXJ2ZXkuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmFuc3dlcnMgPSB7fTtcblxuICAgIHRoaXMuX29uQ29uZmlnUmVzcG9uc2UgPSB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbiA9IHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24uYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbml0KCkge1xuICAgIHRoaXMuY29udGVudC5jb3VudGVyID0gMDtcbiAgICB0aGlzLmV2ZW50cyA9IHsgJ2NsaWNrIC5idG4nOiB0aGlzLl9kaXNwbGF5TmV4dFF1ZXN0aW9uIH07XG4gICAgdGhpcy52aWV3Q3RvciA9IFN1cnZleVZpZXc7XG5cbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2hvdygpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG4gICAgdGhpcy5yZWNlaXZlKCdjb25maWcnLCB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlKTtcbiAgfVxuXG4gIF9vbkNvbmZpZ1Jlc3BvbnNlKHN1cnZleUNvbmZpZykge1xuICAgIC8vIHNldCBsZW5ndGggb2YgdGhlIHN1cnZleSBmb3IgdGhlIHZpZXdcbiAgICB0aGlzLmNvbnRlbnQubGVuZ3RoID0gc3VydmV5Q29uZmlnLmxlbmd0aDtcbiAgICB0aGlzLl9jcmVhdGVSZW5kZXJlcnMoc3VydmV5Q29uZmlnKTtcbiAgICB0aGlzLl9kaXNwbGF5TmV4dFF1ZXN0aW9uKCk7XG4gIH1cblxuICBfY3JlYXRlUmVuZGVyZXJzKHN1cnZleUNvbmZpZykge1xuICAgIHRoaXMucmVuZGVyZXJzID0gc3VydmV5Q29uZmlnLm1hcCgocXVlc3Rpb24sIGluZGV4KSA9PiB7XG4gICAgICBsZXQgY3RvcjtcblxuICAgICAgc3dpdGNoIChxdWVzdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgJ3JhZGlvJzpcbiAgICAgICAgICBjdG9yID0gUmFkaW9SZW5kZXJlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICAgIGN0b3IgPSBDaGVja2JveFJlbmRlcmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyYW5nZSc6XG4gICAgICAgICAgY3RvciA9IFJhbmdlUmVuZGVyZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgICAgICBxdWVzdGlvbi5yZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICAgIGN0b3IgPSBUZXh0QXJlYVJlbmRlcmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IGN0b3IodGhpcy52aWV3LCBxdWVzdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICBfZGlzcGxheU5leHRRdWVzdGlvbigpIHtcbiAgICAvLyByZXRyaXZlIGFuZCBzdG9yZSBjdXJyZW50IGFuc3dlciBpZiBhbnlcbiAgICBpZiAodGhpcy5jdXJyZW50UmVuZGVyZXIpIHtcbiAgICAgIGNvbnN0IGFuc3dlciA9IHRoaXMuY3VycmVudFJlbmRlcmVyLmdldEFuc3dlcigpO1xuICAgICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLmN1cnJlbnRSZW5kZXJlci5xdWVzdGlvbi5yZXF1aXJlZDtcblxuICAgICAgLy8gcmV0dXJuIGlmIG5vIGFuc3dlciBhbmQgcmVxdWlyZWQgcXVlc3Rpb25cbiAgICAgIGlmIChhbnN3ZXIgPT09IG51bGwgJiYgcmVxdWlyZWQpIHJldHVybjtcblxuICAgICAgdGhpcy5hbnN3ZXJzW3RoaXMuY3VycmVudFJlbmRlcmVyLmlkXSA9IGFuc3dlcjtcbiAgICB9XG5cbiAgICAvLyByZXRyaWV2ZSB0aGUgbmV4dCByZW5kZXJlclxuICAgIHRoaXMuY3VycmVudFJlbmRlcmVyID0gdGhpcy5yZW5kZXJlcnMuc2hpZnQoKTtcbiAgICAvLyB1cGRhdGUgY291bnRlclxuICAgIHRoaXMuY29udGVudC5jb3VudGVyICs9IDE7XG5cbiAgICBpZiAodGhpcy5jdXJyZW50UmVuZGVyZXIpIHtcbiAgICAgIHRoaXMudmlldy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1jZW50ZXInLCB0aGlzLmN1cnJlbnRSZW5kZXJlcik7XG4gICAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRSZW5kZXJlci5xdWVzdGlvbi5yZXF1aXJlZClcbiAgICAgICAgdGhpcy52aWV3LmRpc2FibGVCdG4oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWV3LnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLWNlbnRlcicsIG51bGwpO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICAgICAgLy8gc2VuZCBpbmZvcm1hdGlvbnMgdG8gc2VydmVyXG4gICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgICAgICB1c2VyQWdlbnQ6IG5hdmlnYXRvci51c2VyQWdlbnQsXG4gICAgICAgIGFuc3dlcnM6IHRoaXMuYW5zd2VycyxcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuc2VuZCgnYW5zd2VycycsIGRhdGEpO1xuICAgIH1cbiAgfVxufVxuIl19