'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

var _displayView = require('./display/View');

var _displayView2 = _interopRequireDefault(_displayView);

var _displaySegmentedView = require('./display/SegmentedView');

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

var radioTemplate = '\n  <p class="label"><%= label %></p>\n  <% for (var key in answers) { %>\n    <p class="answer radio" data-key="<%= key %>"><%= answers[key] %></p>\n  <% } %>\n';

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
      this.$answers = _Array$from(this.$el.querySelectorAll('.answer'));
    }
  }, {
    key: '_onSelect',
    value: function _onSelect(e) {
      var target = e.target;

      this.$answers.forEach(function (el) {
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

var checkboxTemplate = '\n  <p class="label"><%= label %></p>\n  <% for (var key in answers) { %>\n    <p class="answer checkbox" data-key="<%= key %>"><%= answers[key] %></p>\n  <% } %>\n';

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

var rangeTemplate = '\n  <p class="label"><%= label %></p>\n  <input class="slider answer"\n    type="range"\n    min="<%= min %>"\n    max="<%= max %>"\n    step="<%= step %>"\n    value="<%= defaultValue %>" />\n  <span class="feedback"><%= defaultValue %></span>\n';

var RangeRenderer = (function (_BaseRenderer3) {
  _inherits(RangeRenderer, _BaseRenderer3);

  function RangeRenderer(parent, question) {
    _classCallCheck(this, RangeRenderer);

    question = _Object$assign({
      min: 0,
      max: 10,
      step: 1,
      defaultValue: 5
    }, question);

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

// is never required for now

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

  /**
   * A module to create surveys.
   */

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

var ClientSurvey = (function (_ClientModule) {
  _inherits(ClientSurvey, _ClientModule);

  function ClientSurvey(surveyConfig) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, ClientSurvey);

    _get(Object.getPrototypeOf(ClientSurvey.prototype), 'constructor', this).call(this, options.name || 'survey', options);

    this.survey = surveyConfig;
    this.options = options;
    this.answers = {};

    this._displayNextQuestion = this._displayNextQuestion.bind(this);

    this.viewCtor = SurveyView;
    this.init();
  }

  _createClass(ClientSurvey, [{
    key: 'init',
    value: function init() {
      this.content.counter = 0;
      this.content.length = this.survey.length;
      this.events = { 'click .btn': this._displayNextQuestion };

      this.view = this.createDefaultView();
    }
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientSurvey.prototype), 'start', this).call(this);

      this._createRenderers();
      this._displayNextQuestion();
    }
  }, {
    key: '_createRenderers',
    value: function _createRenderers() {
      var _this = this;

      this.renderers = this.survey.map(function (question, index) {
        question.required = question.required === undefined ? true : question.required;
        question.id = question.id || 'question-' + index;

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

        if (answer === null && required) {
          return;
        }
        this.answers[this.currentRenderer.id] = answer;
      }

      // retrieve the next renderer
      this.currentRenderer = this.renderers.shift();
      // update counter
      this.content.counter += 1;

      if (this.currentRenderer) {
        this.view.setViewComponent('.section-center', this.currentRenderer);
        this.view.render();

        if (this.currentRenderer.question.required) {
          this.view.disableBtn();
        }
      } else {
        this.view.setViewComponent('.section-center', null);
        this.view.render();
        // send informations to server
        this.answers.timestamp = new Date().getTime();
        this.answers.userAgent = navigator.userAgent;
        this.send('answers', JSON.stringify(this.answers));
      }
    }
  }]);

  return ClientSurvey;
})(_ClientModule3['default']);

exports['default'] = ClientSurvey;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50U3VydmV5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzZCQUF5QixnQkFBZ0I7Ozs7MkJBQ3hCLGdCQUFnQjs7OztvQ0FDUCx5QkFBeUI7Ozs7Ozs7O0lBSzdDLFlBQVk7WUFBWixZQUFZOztBQUNMLFdBRFAsWUFBWSxDQUNKLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFOzBCQURwQyxZQUFZOztBQUVkLCtCQUZFLFlBQVksNkNBRVIsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEVBQUU7O0FBRXpELFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQztHQUN2Qjs7ZUFQRyxZQUFZOztXQVNSLGtCQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUU7OztTQVRuQyxZQUFZOzs7QUFZbEIsSUFBTSxhQUFhLHNLQUtsQixDQUFDOztJQUVJLGFBQWE7WUFBYixhQUFhOztBQUNOLFdBRFAsYUFBYSxDQUNMLE1BQU0sRUFBRSxRQUFRLEVBQUU7MEJBRDFCLGFBQWE7O0FBRWYsK0JBRkUsYUFBYSw2Q0FFVCxNQUFNLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRTs7QUFFdkMsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM1Qzs7ZUFORyxhQUFhOztXQVFULG9CQUFHO0FBQ1QsVUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLGVBQWUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsUUFBUSxH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QUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM5QyxZQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDO0FBQzdDLFlBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7T0FDcEQ7S0FDRjs7O1NBdEZrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudFN1cnZleS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuaW1wb3J0IFZpZXcgZnJvbSAnLi9kaXNwbGF5L1ZpZXcnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NlZ21lbnRlZFZpZXcnO1xuXG4vKipcbiAqIFJlbmRlcmVyc1xuICovXG5jbGFzcyBCYXNlUmVuZGVyZXIgZXh0ZW5kcyBWaWV3IHtcbiAgY29uc3RydWN0b3IocGFyZW50LCB0ZW1wbGF0ZSwgcXVlc3Rpb24pIHtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgcXVlc3Rpb24sIHt9LCB7IGNsYXNzTmFtZTogJ3F1ZXN0aW9uJyB9KTtcblxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMucXVlc3Rpb24gPSBxdWVzdGlvbjtcbiAgICB0aGlzLmlkID0gcXVlc3Rpb24uaWQ7XG4gIH1cblxuICBvblJlc2l6ZShvcmllbnRhdGlvbiwgd2lkdGgsIGhlaWdodCkge31cbn1cblxuY29uc3QgcmFkaW9UZW1wbGF0ZSA9IGBcbiAgPHAgY2xhc3M9XCJsYWJlbFwiPjwlPSBsYWJlbCAlPjwvcD5cbiAgPCUgZm9yICh2YXIga2V5IGluIGFuc3dlcnMpIHsgJT5cbiAgICA8cCBjbGFzcz1cImFuc3dlciByYWRpb1wiIGRhdGEta2V5PVwiPCU9IGtleSAlPlwiPjwlPSBhbnN3ZXJzW2tleV0gJT48L3A+XG4gIDwlIH0gJT5cbmA7XG5cbmNsYXNzIFJhZGlvUmVuZGVyZXIgZXh0ZW5kcyBCYXNlUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHF1ZXN0aW9uKSB7XG4gICAgc3VwZXIocGFyZW50LCByYWRpb1RlbXBsYXRlLCBxdWVzdGlvbik7XG5cbiAgICB0aGlzLmFuc3dlciA9IG51bGw7XG4gICAgdGhpcy5fb25TZWxlY3QgPSB0aGlzLl9vblNlbGVjdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy5pbnN0YWxsRXZlbnRzKHsgJ2NsaWNrIC5hbnN3ZXInOiB0aGlzLl9vblNlbGVjdCB9KTtcbiAgICB0aGlzLiRhbnN3ZXJzID0gQXJyYXkuZnJvbSh0aGlzLiRlbC5xdWVyeVNlbGVjdG9yQWxsKCcuYW5zd2VyJykpO1xuICB9XG5cbiAgX29uU2VsZWN0KGUpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcblxuICAgIHRoaXMuJGFuc3dlcnMuZm9yRWFjaCgoZWwpID0+IHsgZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTsgfSk7XG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XG5cbiAgICB0aGlzLmFuc3dlciA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEta2V5Jyk7XG5cbiAgICB0aGlzLnBhcmVudC5lbmFibGVCdG4oKTtcbiAgfVxuXG4gIGdldEFuc3dlcigpIHtcbiAgICByZXR1cm4gdGhpcy5hbnN3ZXI7XG4gIH1cbn1cblxuY29uc3QgY2hlY2tib3hUZW1wbGF0ZSA9IGBcbiAgPHAgY2xhc3M9XCJsYWJlbFwiPjwlPSBsYWJlbCAlPjwvcD5cbiAgPCUgZm9yICh2YXIga2V5IGluIGFuc3dlcnMpIHsgJT5cbiAgICA8cCBjbGFzcz1cImFuc3dlciBjaGVja2JveFwiIGRhdGEta2V5PVwiPCU9IGtleSAlPlwiPjwlPSBhbnN3ZXJzW2tleV0gJT48L3A+XG4gIDwlIH0gJT5cbmA7XG5cbmNsYXNzIENoZWNrYm94UmVuZGVyZXIgZXh0ZW5kcyBCYXNlUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHF1ZXN0aW9uKSB7XG4gICAgc3VwZXIocGFyZW50LCBjaGVja2JveFRlbXBsYXRlLCBxdWVzdGlvbik7XG5cbiAgICB0aGlzLmFuc3dlcnMgPSBbXTtcbiAgICB0aGlzLl9vblNlbGVjdCA9IHRoaXMuX29uU2VsZWN0LmJpbmQodGhpcyk7XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICB0aGlzLmluc3RhbGxFdmVudHMoeyAnY2xpY2sgLmFuc3dlcic6IHRoaXMuX29uU2VsZWN0IH0pO1xuICB9XG5cbiAgX29uU2VsZWN0KGUpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICBjb25zdCBrZXkgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWtleScpO1xuICAgIGNvbnN0IG1ldGhvZCA9IHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJykgPyAncmVtb3ZlJyA6ICdhZGQnO1xuXG4gICAgaWYgKG1ldGhvZCA9PT0gJ2FkZCcpIHtcbiAgICAgIHRoaXMuYW5zd2Vycy5wdXNoKGtleSk7XG4gICAgfSBlbHNlIGlmICgobWV0aG9kID09PSAncmVtb3ZlJykpIHtcbiAgICAgIHRoaXMuYW5zd2Vycy5zcGxpY2UodGhpcy5hbnN3ZXJzLmluZGV4T2Yoa2V5KSwgMSk7XG4gICAgfVxuXG4gICAgdGFyZ2V0LmNsYXNzTGlzdFttZXRob2RdKCdzZWxlY3RlZCcpO1xuXG4gICAgaWYgKHRoaXMuYW5zd2Vycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnBhcmVudC5lbmFibGVCdG4oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJlbnQuZGlzYWJsZUJ0bigpO1xuICAgIH1cbiAgfVxuXG4gIGdldEFuc3dlcigpIHtcbiAgICByZXR1cm4gdGhpcy5hbnN3ZXJzLmxlbmd0aCA9PT0gMCA/IG51bGwgOiB0aGlzLmFuc3dlcnM7XG4gIH1cbn1cblxuY29uc3QgcmFuZ2VUZW1wbGF0ZSA9IGBcbiAgPHAgY2xhc3M9XCJsYWJlbFwiPjwlPSBsYWJlbCAlPjwvcD5cbiAgPGlucHV0IGNsYXNzPVwic2xpZGVyIGFuc3dlclwiXG4gICAgdHlwZT1cInJhbmdlXCJcbiAgICBtaW49XCI8JT0gbWluICU+XCJcbiAgICBtYXg9XCI8JT0gbWF4ICU+XCJcbiAgICBzdGVwPVwiPCU9IHN0ZXAgJT5cIlxuICAgIHZhbHVlPVwiPCU9IGRlZmF1bHRWYWx1ZSAlPlwiIC8+XG4gIDxzcGFuIGNsYXNzPVwiZmVlZGJhY2tcIj48JT0gZGVmYXVsdFZhbHVlICU+PC9zcGFuPlxuYDtcblxuY2xhc3MgUmFuZ2VSZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgcXVlc3Rpb24pIHtcbiAgICBxdWVzdGlvbiA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgbWluOiAwLFxuICAgICAgbWF4OiAxMCxcbiAgICAgIHN0ZXA6IDEsXG4gICAgICBkZWZhdWx0VmFsdWU6IDUsXG4gICAgfSwgcXVlc3Rpb24pO1xuXG4gICAgc3VwZXIocGFyZW50LCByYW5nZVRlbXBsYXRlLCBxdWVzdGlvbik7XG5cbiAgICB0aGlzLmFuc3dlciA9IG51bGw7XG4gICAgdGhpcy5fb25JbnB1dCA9IHRoaXMuX29uSW5wdXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7ICdpbnB1dCAuYW5zd2VyJzogdGhpcy5fb25JbnB1dCB9KTtcbiAgICB0aGlzLiRzbGlkZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyJylcbiAgICB0aGlzLiRmZWVkYmFjayA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5mZWVkYmFjaycpO1xuICB9XG5cbiAgX29uSW5wdXQoZSkge1xuICAgIHRoaXMuJGZlZWRiYWNrLnRleHRDb250ZW50ID0gdGhpcy4kc2xpZGVyLnZhbHVlO1xuICAgIHRoaXMuYW5zd2VyID0gcGFyc2VGbG9hdCh0aGlzLiRzbGlkZXIudmFsdWUpXG4gICAgdGhpcy5wYXJlbnQuZW5hYmxlQnRuKCk7XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5zd2VyO1xuICB9XG59XG5cbmNvbnN0IHRleHRhcmVhVGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDx0ZXh0YXJlYSBjbGFzcz1cImFuc3dlciB0ZXh0YXJlYVwiPjwvdGV4dGFyZWE+XG5gO1xuXG4vLyBpcyBuZXZlciByZXF1aXJlZCBmb3Igbm93XG5jbGFzcyBUZXh0QXJlYVJlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHBhcmVudCwgdGV4dGFyZWFUZW1wbGF0ZSwgcXVlc3Rpb24pO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy4kbGFiZWwgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcubGFiZWwnKTtcbiAgICB0aGlzLiR0ZXh0YXJlYSA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5hbnN3ZXInKTtcbiAgfVxuXG4gIG9uU2hvdygpIHtcbiAgICB0aGlzLm9uUmVzaXplKCk7XG4gIH1cblxuICBvblJlc2l6ZShvcmllbnRhdGlvbiwgdmlld3BvcnRWaWR0aCwgdmlld3BvcnRIZWlnaHQpIHtcbiAgICBpZiAoIXRoaXMuJHBhcmVudCkgeyByZXR1cm47IH1cbiAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB3aWR0aCA9IGJvdW5kaW5nUmVjdC53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSBib3VuZGluZ1JlY3QuaGVpZ2h0O1xuXG4gICAgY29uc3QgbGFiZWxIZWlnaHQgPSB0aGlzLiRsYWJlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG5cbiAgICB0aGlzLiR0ZXh0YXJlYS5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICB0aGlzLiR0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHQgLSBsYWJlbEhlaWdodH1weGA7XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuJHRleHRhcmVhLnZhbHVlO1xuICB9XG59XG5cbi8qKlxuICogU3VydmV5IG1haW4gdnVlXG4gKi9cbmNsYXNzIFN1cnZleVZpZXcgZXh0ZW5kcyBTZWdtZW50ZWRWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucykge1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5yYXRpb3MgPSB7XG4gICAgICAnLnNlY3Rpb24tdG9wJzogMC4xNSxcbiAgICAgICcuc2VjdGlvbi1jZW50ZXInOiAwLjY1LFxuICAgICAgJy5zZWN0aW9uLWJvdHRvbSc6IDAuMixcbiAgICB9O1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgc3VwZXIub25SZW5kZXIoKTtcbiAgICB0aGlzLiRuZXh0QnRuID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLmJ0bicpO1xuICB9XG5cbiAgZGlzYWJsZUJ0bigpIHtcbiAgICB0aGlzLiRuZXh0QnRuLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgfVxuXG4gIGVuYWJsZUJ0bigpIHtcbiAgICB0aGlzLiRuZXh0QnRuLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgbW9kdWxlIHRvIGNyZWF0ZSBzdXJ2ZXlzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRTdXJ2ZXkgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihzdXJ2ZXlDb25maWcsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnc3VydmV5Jywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnN1cnZleSA9IHN1cnZleUNvbmZpZztcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuYW5zd2VycyA9IHt9O1xuXG4gICAgdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbiA9IHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24uYmluZCh0aGlzKTtcblxuICAgIHRoaXMudmlld0N0b3IgPSBTdXJ2ZXlWaWV3O1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmNvbnRlbnQuY291bnRlciA9IDA7XG4gICAgdGhpcy5jb250ZW50Lmxlbmd0aCA9IHRoaXMuc3VydmV5Lmxlbmd0aDtcbiAgICB0aGlzLmV2ZW50cyA9IHsgJ2NsaWNrIC5idG4nOiB0aGlzLl9kaXNwbGF5TmV4dFF1ZXN0aW9uIH07XG5cbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZURlZmF1bHRWaWV3KCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5fY3JlYXRlUmVuZGVyZXJzKCk7XG4gICAgdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbigpO1xuICB9XG5cbiAgX2NyZWF0ZVJlbmRlcmVycygpIHtcbiAgICB0aGlzLnJlbmRlcmVycyA9IHRoaXMuc3VydmV5Lm1hcCgocXVlc3Rpb24sIGluZGV4KSA9PiB7XG4gICAgICBxdWVzdGlvbi5yZXF1aXJlZCA9IHF1ZXN0aW9uLnJlcXVpcmVkID09PSB1bmRlZmluZWQgPyB0cnVlIDogcXVlc3Rpb24ucmVxdWlyZWQ7XG4gICAgICBxdWVzdGlvbi5pZCA9IHF1ZXN0aW9uLmlkIHx8IGBxdWVzdGlvbi0ke2luZGV4fWA7XG5cbiAgICAgIGxldCBjdG9yO1xuXG4gICAgICBzd2l0Y2ggKHF1ZXN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSAncmFkaW8nOlxuICAgICAgICAgIGN0b3IgPSBSYWRpb1JlbmRlcmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjaGVja2JveCc6XG4gICAgICAgICAgY3RvciA9IENoZWNrYm94UmVuZGVyZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JhbmdlJzpcbiAgICAgICAgICBjdG9yID0gUmFuZ2VSZW5kZXJlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgICAgIHF1ZXN0aW9uLnJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgICAgY3RvciA9IFRleHRBcmVhUmVuZGVyZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgY3Rvcih0aGlzLnZpZXcsIHF1ZXN0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9kaXNwbGF5TmV4dFF1ZXN0aW9uKCkge1xuICAgIC8vIHJldHJpdmUgYW5kIHN0b3JlIGN1cnJlbnQgYW5zd2VyIGlmIGFueVxuICAgIGlmICh0aGlzLmN1cnJlbnRSZW5kZXJlcikge1xuICAgICAgY29uc3QgYW5zd2VyID0gdGhpcy5jdXJyZW50UmVuZGVyZXIuZ2V0QW5zd2VyKCk7XG4gICAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMuY3VycmVudFJlbmRlcmVyLnF1ZXN0aW9uLnJlcXVpcmVkO1xuXG4gICAgICBpZiAoYW5zd2VyID09PSBudWxsICYmIHJlcXVpcmVkKSB7IHJldHVybjsgfVxuICAgICAgdGhpcy5hbnN3ZXJzW3RoaXMuY3VycmVudFJlbmRlcmVyLmlkXSA9IGFuc3dlcjtcbiAgICB9XG5cbiAgICAvLyByZXRyaWV2ZSB0aGUgbmV4dCByZW5kZXJlclxuICAgIHRoaXMuY3VycmVudFJlbmRlcmVyID0gdGhpcy5yZW5kZXJlcnMuc2hpZnQoKTtcbiAgICAvLyB1cGRhdGUgY291bnRlclxuICAgIHRoaXMuY29udGVudC5jb3VudGVyICs9IDE7XG5cbiAgICBpZiAodGhpcy5jdXJyZW50UmVuZGVyZXIpIHtcbiAgICAgIHRoaXMudmlldy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1jZW50ZXInLCB0aGlzLmN1cnJlbnRSZW5kZXJlcik7XG4gICAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRSZW5kZXJlci5xdWVzdGlvbi5yZXF1aXJlZCkge1xuICAgICAgICB0aGlzLnZpZXcuZGlzYWJsZUJ0bigpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZpZXcuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tY2VudGVyJywgbnVsbCk7XG4gICAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gICAgICAvLyBzZW5kIGluZm9ybWF0aW9ucyB0byBzZXJ2ZXJcbiAgICAgIHRoaXMuYW5zd2Vycy50aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHRoaXMuYW5zd2Vycy51c2VyQWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICAgICAgdGhpcy5zZW5kKCdhbnN3ZXJzJywgSlNPTi5zdHJpbmdpZnkodGhpcy5hbnN3ZXJzKSk7XG4gICAgfVxuICB9XG59XG4iXX0=