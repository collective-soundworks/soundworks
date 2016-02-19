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
    value: function onResize(width, height, orientation) {}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2NlbmVzL0NsaWVudFN1cnZleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQWtCLGVBQWU7Ozs7MkJBQ2hCLGlCQUFpQjs7OztvQ0FDUiwwQkFBMEI7Ozs7Ozs7O0lBSzlDLFlBQVk7WUFBWixZQUFZOztBQUNMLFdBRFAsWUFBWSxDQUNKLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFOzBCQURwQyxZQUFZOztBQUVkLCtCQUZFLFlBQVksNkNBRVIsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEVBQUU7O0FBRXpELFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQztHQUN2Qjs7ZUFQRyxZQUFZOztXQVNSLGtCQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUU7OztTQVRuQyxZQUFZOzs7QUFZbEIsSUFBTSxhQUFhLHNLQUtsQixDQUFDOztJQUVJLGFBQWE7WUFBYixhQUFhOztBQUNOLFdBRFAsYUFBYSxDQUNMLE1BQU0sRUFBRSxRQUFRLEVBQUU7MEJBRDFCLGFBQWE7O0FBRWYsK0JBRkUsYUFBYSw2Q0FFVCxNQUFNLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRTs7QUFFdkMsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM1Qzs7ZUFORyxhQUFhOztXQVFULG9CQUFHO0FBQ1QsVUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLGVBQWUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsUUFB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QixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiJzcmMvY2xpZW50L3NjZW5lcy9DbGllbnRTdXJ2ZXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2NlbmUgZnJvbSAnLi4vY29yZS9TY2VuZSc7XG5pbXBvcnQgVmlldyBmcm9tICcuLi9kaXNwbGF5L1ZpZXcnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcblxuLyoqXG4gKiBSZW5kZXJlcnNcbiAqL1xuY2xhc3MgQmFzZVJlbmRlcmVyIGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgdGVtcGxhdGUsIHF1ZXN0aW9uKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIHF1ZXN0aW9uLCB7fSwgeyBjbGFzc05hbWU6ICdxdWVzdGlvbicgfSk7XG5cbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLnF1ZXN0aW9uID0gcXVlc3Rpb247XG4gICAgdGhpcy5pZCA9IHF1ZXN0aW9uLmlkO1xuICB9XG5cbiAgb25SZXNpemUod2lkdGgsIGhlaWdodCwgb3JpZW50YXRpb24pIHt9XG59XG5cbmNvbnN0IHJhZGlvVGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDwlIGZvciAodmFyIGtleSBpbiBvcHRpb25zKSB7ICU+XG4gICAgPHAgY2xhc3M9XCJhbnN3ZXIgcmFkaW9cIiBkYXRhLWtleT1cIjwlPSBrZXkgJT5cIj48JT0gb3B0aW9uc1trZXldICU+PC9wPlxuICA8JSB9ICU+XG5gO1xuXG5jbGFzcyBSYWRpb1JlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHBhcmVudCwgcmFkaW9UZW1wbGF0ZSwgcXVlc3Rpb24pO1xuXG4gICAgdGhpcy5hbnN3ZXIgPSBudWxsO1xuICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7ICdjbGljayAuYW5zd2VyJzogdGhpcy5fb25TZWxlY3QgfSk7XG4gICAgdGhpcy4kb3B0aW9ucyA9IEFycmF5LmZyb20odGhpcy4kZWwucXVlcnlTZWxlY3RvckFsbCgnLmFuc3dlcicpKTtcbiAgfVxuXG4gIF9vblNlbGVjdChlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICB0aGlzLiRvcHRpb25zLmZvckVhY2goKGVsKSA9PiB7IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7IH0pO1xuICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuXG4gICAgdGhpcy5hbnN3ZXIgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWtleScpO1xuXG4gICAgdGhpcy5wYXJlbnQuZW5hYmxlQnRuKCk7XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5zd2VyO1xuICB9XG59XG5cbmNvbnN0IGNoZWNrYm94VGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDwlIGZvciAodmFyIGtleSBpbiBvcHRpb25zKSB7ICU+XG4gICAgPHAgY2xhc3M9XCJhbnN3ZXIgY2hlY2tib3hcIiBkYXRhLWtleT1cIjwlPSBrZXkgJT5cIj48JT0gb3B0aW9uc1trZXldICU+PC9wPlxuICA8JSB9ICU+XG5gO1xuXG5jbGFzcyBDaGVja2JveFJlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHBhcmVudCwgY2hlY2tib3hUZW1wbGF0ZSwgcXVlc3Rpb24pO1xuXG4gICAgdGhpcy5hbnN3ZXJzID0gW107XG4gICAgdGhpcy5fb25TZWxlY3QgPSB0aGlzLl9vblNlbGVjdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy5pbnN0YWxsRXZlbnRzKHsgJ2NsaWNrIC5hbnN3ZXInOiB0aGlzLl9vblNlbGVjdCB9KTtcbiAgfVxuXG4gIF9vblNlbGVjdChlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgY29uc3Qga2V5ID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1rZXknKTtcbiAgICBjb25zdCBtZXRob2QgPSB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpID8gJ3JlbW92ZScgOiAnYWRkJztcblxuICAgIGlmIChtZXRob2QgPT09ICdhZGQnKSB7XG4gICAgICB0aGlzLmFuc3dlcnMucHVzaChrZXkpO1xuICAgIH0gZWxzZSBpZiAoKG1ldGhvZCA9PT0gJ3JlbW92ZScpKSB7XG4gICAgICB0aGlzLmFuc3dlcnMuc3BsaWNlKHRoaXMuYW5zd2Vycy5pbmRleE9mKGtleSksIDEpO1xuICAgIH1cblxuICAgIHRhcmdldC5jbGFzc0xpc3RbbWV0aG9kXSgnc2VsZWN0ZWQnKTtcblxuICAgIGlmICh0aGlzLmFuc3dlcnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5wYXJlbnQuZW5hYmxlQnRuKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFyZW50LmRpc2FibGVCdG4oKTtcbiAgICB9XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5zd2Vycy5sZW5ndGggPT09IDAgPyBudWxsIDogdGhpcy5hbnN3ZXJzO1xuICB9XG59XG5cbmNvbnN0IHJhbmdlVGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDxpbnB1dCBjbGFzcz1cInNsaWRlciBhbnN3ZXJcIlxuICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgbWluPVwiPCU9IG9wdGlvbnMubWluICU+XCJcbiAgICBtYXg9XCI8JT0gb3B0aW9ucy5tYXggJT5cIlxuICAgIHN0ZXA9XCI8JT0gb3B0aW9ucy5zdGVwICU+XCJcbiAgICB2YWx1ZT1cIjwlPSBvcHRpb25zLmRlZmF1bHQgJT5cIiAvPlxuICA8c3BhbiBjbGFzcz1cImZlZWRiYWNrXCI+PCU9IG9wdGlvbnMuZGVmYXVsdCAlPjwvc3Bhbj5cbmA7XG5cbmNsYXNzIFJhbmdlUmVuZGVyZXIgZXh0ZW5kcyBCYXNlUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHF1ZXN0aW9uKSB7XG4gICAgc3VwZXIocGFyZW50LCByYW5nZVRlbXBsYXRlLCBxdWVzdGlvbik7XG5cbiAgICB0aGlzLmFuc3dlciA9IG51bGw7XG4gICAgdGhpcy5fb25JbnB1dCA9IHRoaXMuX29uSW5wdXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7ICdpbnB1dCAuYW5zd2VyJzogdGhpcy5fb25JbnB1dCB9KTtcbiAgICB0aGlzLiRzbGlkZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyJylcbiAgICB0aGlzLiRmZWVkYmFjayA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5mZWVkYmFjaycpO1xuICB9XG5cbiAgX29uSW5wdXQoZSkge1xuICAgIHRoaXMuJGZlZWRiYWNrLnRleHRDb250ZW50ID0gdGhpcy4kc2xpZGVyLnZhbHVlO1xuICAgIHRoaXMuYW5zd2VyID0gcGFyc2VGbG9hdCh0aGlzLiRzbGlkZXIudmFsdWUpXG4gICAgdGhpcy5wYXJlbnQuZW5hYmxlQnRuKCk7XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5zd2VyO1xuICB9XG59XG5cbmNvbnN0IHRleHRhcmVhVGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDx0ZXh0YXJlYSBjbGFzcz1cImFuc3dlciB0ZXh0YXJlYVwiPjwvdGV4dGFyZWE+XG5gO1xuXG5jbGFzcyBUZXh0QXJlYVJlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHBhcmVudCwgdGV4dGFyZWFUZW1wbGF0ZSwgcXVlc3Rpb24pO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy4kbGFiZWwgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcubGFiZWwnKTtcbiAgICB0aGlzLiR0ZXh0YXJlYSA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5hbnN3ZXInKTtcbiAgfVxuXG4gIG9uUmVzaXplKHZpZXdwb3J0VmlkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIGlmICghdGhpcy4kcGFyZW50KSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGhpcy4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qgd2lkdGggPSBib3VuZGluZ1JlY3Qud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gYm91bmRpbmdSZWN0LmhlaWdodDtcblxuICAgIGNvbnN0IGxhYmVsSGVpZ2h0ID0gdGhpcy4kbGFiZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuXG4gICAgdGhpcy4kdGV4dGFyZWEuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgdGhpcy4kdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0IC0gbGFiZWxIZWlnaHR9cHhgO1xuICB9XG5cbiAgZ2V0QW5zd2VyKCkge1xuICAgIHJldHVybiB0aGlzLiR0ZXh0YXJlYS52YWx1ZTtcbiAgfVxufVxuXG4vKipcbiAqIFN1cnZleSBtYWluIHZ1ZVxuICovXG5jbGFzcyBTdXJ2ZXlWaWV3IGV4dGVuZHMgU2VnbWVudGVkVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpIHtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIHRoaXMucmF0aW9zID0ge1xuICAgICAgJy5zZWN0aW9uLXRvcCc6IDAuMTUsXG4gICAgICAnLnNlY3Rpb24tY2VudGVyJzogMC42NSxcbiAgICAgICcuc2VjdGlvbi1ib3R0b20nOiAwLjIsXG4gICAgfTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHN1cGVyLm9uUmVuZGVyKCk7XG4gICAgdGhpcy4kbmV4dEJ0biA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5idG4nKTtcbiAgfVxuXG4gIGRpc2FibGVCdG4oKSB7XG4gICAgdGhpcy4kbmV4dEJ0bi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gIH1cblxuICBlbmFibGVCdG4oKSB7XG4gICAgdGhpcy4kbmV4dEJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gIH1cbn1cblxuY29uc3QgU0NFTkVfSUQgPSAnc3VydmV5JztcblxuLyoqXG4gKiBBIG1vZHVsZSB0byBjcmVhdGUgc3VydmV5cy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50U3VydmV5IGV4dGVuZHMgU2NlbmUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTQ0VORV9JRCwgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBPYmplY3QgdXNlZCB0byBzdG9yZSB0aGUgYW5zd2VycyBvZiB0aGUgc3VydmV5LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5hbnN3ZXJzID0ge307XG5cbiAgICB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlID0gdGhpcy5fb25Db25maWdSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24gPSB0aGlzLl9kaXNwbGF5TmV4dFF1ZXN0aW9uLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmNvbnRlbnQuY291bnRlciA9IDA7XG4gICAgdGhpcy5ldmVudHMgPSB7ICdjbGljayAuYnRuJzogdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbiB9O1xuICAgIHRoaXMudmlld0N0b3IgPSBTdXJ2ZXlWaWV3O1xuXG4gICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNob3coKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuICAgIHRoaXMucmVjZWl2ZSgnY29uZmlnJywgdGhpcy5fb25Db25maWdSZXNwb25zZSk7XG4gIH1cblxuICBfb25Db25maWdSZXNwb25zZShzdXJ2ZXlDb25maWcpIHtcbiAgICAvLyBzZXQgbGVuZ3RoIG9mIHRoZSBzdXJ2ZXkgZm9yIHRoZSB2aWV3XG4gICAgdGhpcy5jb250ZW50Lmxlbmd0aCA9IHN1cnZleUNvbmZpZy5sZW5ndGg7XG4gICAgdGhpcy5fY3JlYXRlUmVuZGVyZXJzKHN1cnZleUNvbmZpZyk7XG4gICAgdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbigpO1xuICB9XG5cbiAgX2NyZWF0ZVJlbmRlcmVycyhzdXJ2ZXlDb25maWcpIHtcbiAgICB0aGlzLnJlbmRlcmVycyA9IHN1cnZleUNvbmZpZy5tYXAoKHF1ZXN0aW9uLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IGN0b3I7XG5cbiAgICAgIHN3aXRjaCAocXVlc3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlICdyYWRpbyc6XG4gICAgICAgICAgY3RvciA9IFJhZGlvUmVuZGVyZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2NoZWNrYm94JzpcbiAgICAgICAgICBjdG9yID0gQ2hlY2tib3hSZW5kZXJlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmFuZ2UnOlxuICAgICAgICAgIGN0b3IgPSBSYW5nZVJlbmRlcmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICAgICAgcXVlc3Rpb24ucmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICBjdG9yID0gVGV4dEFyZWFSZW5kZXJlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBjdG9yKHRoaXMudmlldywgcXVlc3Rpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgX2Rpc3BsYXlOZXh0UXVlc3Rpb24oKSB7XG4gICAgLy8gcmV0cml2ZSBhbmQgc3RvcmUgY3VycmVudCBhbnN3ZXIgaWYgYW55XG4gICAgaWYgKHRoaXMuY3VycmVudFJlbmRlcmVyKSB7XG4gICAgICBjb25zdCBhbnN3ZXIgPSB0aGlzLmN1cnJlbnRSZW5kZXJlci5nZXRBbnN3ZXIoKTtcbiAgICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5jdXJyZW50UmVuZGVyZXIucXVlc3Rpb24ucmVxdWlyZWQ7XG5cbiAgICAgIC8vIHJldHVybiBpZiBubyBhbnN3ZXIgYW5kIHJlcXVpcmVkIHF1ZXN0aW9uXG4gICAgICBpZiAoYW5zd2VyID09PSBudWxsICYmIHJlcXVpcmVkKSByZXR1cm47XG5cbiAgICAgIHRoaXMuYW5zd2Vyc1t0aGlzLmN1cnJlbnRSZW5kZXJlci5pZF0gPSBhbnN3ZXI7XG4gICAgfVxuXG4gICAgLy8gcmV0cmlldmUgdGhlIG5leHQgcmVuZGVyZXJcbiAgICB0aGlzLmN1cnJlbnRSZW5kZXJlciA9IHRoaXMucmVuZGVyZXJzLnNoaWZ0KCk7XG4gICAgLy8gdXBkYXRlIGNvdW50ZXJcbiAgICB0aGlzLmNvbnRlbnQuY291bnRlciArPSAxO1xuXG4gICAgaWYgKHRoaXMuY3VycmVudFJlbmRlcmVyKSB7XG4gICAgICB0aGlzLnZpZXcuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tY2VudGVyJywgdGhpcy5jdXJyZW50UmVuZGVyZXIpO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcigpO1xuXG4gICAgICBpZiAodGhpcy5jdXJyZW50UmVuZGVyZXIucXVlc3Rpb24ucmVxdWlyZWQpXG4gICAgICAgIHRoaXMudmlldy5kaXNhYmxlQnRuKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlldy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1jZW50ZXInLCBudWxsKTtcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICAgIC8vIHNlbmQgaW5mb3JtYXRpb25zIHRvIHNlcnZlclxuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgICAgdXNlckFnZW50OiBuYXZpZ2F0b3IudXNlckFnZW50LFxuICAgICAgICBhbnN3ZXJzOiB0aGlzLmFuc3dlcnMsXG4gICAgICB9O1xuXG4gICAgICB0aGlzLnNlbmQoJ2Fuc3dlcnMnLCBkYXRhKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==