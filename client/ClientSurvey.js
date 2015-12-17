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
      // // handle current question if any
      if (this.currentRenderer) {
        var answer = this.currentRenderer.getAnswer();
        var required = this.currentRenderer.question.required;

        if (answer === null && required) {
          return;
        }
        this.answers[this.currentRenderer.id] = answer;
        console.log(this.answers);
      }

      this.currentRenderer = this.renderers.shift();

      // update counter
      this.content.counter += 1;

      if (this.currentRenderer) {
        // update content
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
//# sourceMappingURL=data:application/json;base64,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QixZQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzlDLFlBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUM7QUFDN0MsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztPQUNwRDtLQUNGOzs7U0F4RmtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6InNyYy9zZXJ2ZXIvY29tbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuaW1wb3J0IFZpZXcgZnJvbSAnLi9kaXNwbGF5L1ZpZXcnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NlZ21lbnRlZFZpZXcnO1xuXG4vKipcbiAqIFJlbmRlcmVyc1xuICovXG5jbGFzcyBCYXNlUmVuZGVyZXIgZXh0ZW5kcyBWaWV3IHtcbiAgY29uc3RydWN0b3IocGFyZW50LCB0ZW1wbGF0ZSwgcXVlc3Rpb24pIHtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgcXVlc3Rpb24sIHt9LCB7IGNsYXNzTmFtZTogJ3F1ZXN0aW9uJyB9KTtcblxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMucXVlc3Rpb24gPSBxdWVzdGlvbjtcbiAgICB0aGlzLmlkID0gcXVlc3Rpb24uaWQ7XG4gIH1cblxuICBvblJlc2l6ZShvcmllbnRhdGlvbiwgd2lkdGgsIGhlaWdodCkge31cbn1cblxuY29uc3QgcmFkaW9UZW1wbGF0ZSA9IGBcbiAgPHAgY2xhc3M9XCJsYWJlbFwiPjwlPSBsYWJlbCAlPjwvcD5cbiAgPCUgZm9yICh2YXIga2V5IGluIGFuc3dlcnMpIHsgJT5cbiAgICA8cCBjbGFzcz1cImFuc3dlciByYWRpb1wiIGRhdGEta2V5PVwiPCU9IGtleSAlPlwiPjwlPSBhbnN3ZXJzW2tleV0gJT48L3A+XG4gIDwlIH0gJT5cbmA7XG5cbmNsYXNzIFJhZGlvUmVuZGVyZXIgZXh0ZW5kcyBCYXNlUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHF1ZXN0aW9uKSB7XG4gICAgc3VwZXIocGFyZW50LCByYWRpb1RlbXBsYXRlLCBxdWVzdGlvbik7XG5cbiAgICB0aGlzLmFuc3dlciA9IG51bGw7XG4gICAgdGhpcy5fb25TZWxlY3QgPSB0aGlzLl9vblNlbGVjdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy5pbnN0YWxsRXZlbnRzKHsgJ2NsaWNrIC5hbnN3ZXInOiB0aGlzLl9vblNlbGVjdCB9KTtcbiAgICB0aGlzLiRhbnN3ZXJzID0gQXJyYXkuZnJvbSh0aGlzLiRlbC5xdWVyeVNlbGVjdG9yQWxsKCcuYW5zd2VyJykpO1xuICB9XG5cbiAgX29uU2VsZWN0KGUpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcblxuICAgIHRoaXMuJGFuc3dlcnMuZm9yRWFjaCgoZWwpID0+IHsgZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTsgfSk7XG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XG5cbiAgICB0aGlzLmFuc3dlciA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEta2V5Jyk7XG5cbiAgICB0aGlzLnBhcmVudC5lbmFibGVCdG4oKTtcbiAgfVxuXG4gIGdldEFuc3dlcigpIHtcbiAgICByZXR1cm4gdGhpcy5hbnN3ZXI7XG4gIH1cbn1cblxuY29uc3QgY2hlY2tib3hUZW1wbGF0ZSA9IGBcbiAgPHAgY2xhc3M9XCJsYWJlbFwiPjwlPSBsYWJlbCAlPjwvcD5cbiAgPCUgZm9yICh2YXIga2V5IGluIGFuc3dlcnMpIHsgJT5cbiAgICA8cCBjbGFzcz1cImFuc3dlciBjaGVja2JveFwiIGRhdGEta2V5PVwiPCU9IGtleSAlPlwiPjwlPSBhbnN3ZXJzW2tleV0gJT48L3A+XG4gIDwlIH0gJT5cbmA7XG5cbmNsYXNzIENoZWNrYm94UmVuZGVyZXIgZXh0ZW5kcyBCYXNlUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHF1ZXN0aW9uKSB7XG4gICAgc3VwZXIocGFyZW50LCBjaGVja2JveFRlbXBsYXRlLCBxdWVzdGlvbik7XG5cbiAgICB0aGlzLmFuc3dlcnMgPSBbXTtcbiAgICB0aGlzLl9vblNlbGVjdCA9IHRoaXMuX29uU2VsZWN0LmJpbmQodGhpcyk7XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICB0aGlzLmluc3RhbGxFdmVudHMoeyAnY2xpY2sgLmFuc3dlcic6IHRoaXMuX29uU2VsZWN0IH0pO1xuICB9XG5cbiAgX29uU2VsZWN0KGUpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICBjb25zdCBrZXkgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWtleScpO1xuICAgIGNvbnN0IG1ldGhvZCA9IHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJykgPyAncmVtb3ZlJyA6ICdhZGQnO1xuXG4gICAgaWYgKG1ldGhvZCA9PT0gJ2FkZCcpIHtcbiAgICAgIHRoaXMuYW5zd2Vycy5wdXNoKGtleSk7XG4gICAgfSBlbHNlIGlmICgobWV0aG9kID09PSAncmVtb3ZlJykpIHtcbiAgICAgIHRoaXMuYW5zd2Vycy5zcGxpY2UodGhpcy5hbnN3ZXJzLmluZGV4T2Yoa2V5KSwgMSk7XG4gICAgfVxuXG4gICAgdGFyZ2V0LmNsYXNzTGlzdFttZXRob2RdKCdzZWxlY3RlZCcpO1xuXG4gICAgaWYgKHRoaXMuYW5zd2Vycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnBhcmVudC5lbmFibGVCdG4oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJlbnQuZGlzYWJsZUJ0bigpO1xuICAgIH1cbiAgfVxuXG4gIGdldEFuc3dlcigpIHtcbiAgICByZXR1cm4gdGhpcy5hbnN3ZXJzLmxlbmd0aCA9PT0gMCA/IG51bGwgOiB0aGlzLmFuc3dlcnM7XG4gIH1cbn1cblxuY29uc3QgcmFuZ2VUZW1wbGF0ZSA9IGBcbiAgPHAgY2xhc3M9XCJsYWJlbFwiPjwlPSBsYWJlbCAlPjwvcD5cbiAgPGlucHV0IGNsYXNzPVwic2xpZGVyIGFuc3dlclwiXG4gICAgdHlwZT1cInJhbmdlXCJcbiAgICBtaW49XCI8JT0gbWluICU+XCJcbiAgICBtYXg9XCI8JT0gbWF4ICU+XCJcbiAgICBzdGVwPVwiPCU9IHN0ZXAgJT5cIlxuICAgIHZhbHVlPVwiPCU9IGRlZmF1bHRWYWx1ZSAlPlwiIC8+XG4gIDxzcGFuIGNsYXNzPVwiZmVlZGJhY2tcIj48JT0gZGVmYXVsdFZhbHVlICU+PC9zcGFuPlxuYDtcblxuY2xhc3MgUmFuZ2VSZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgcXVlc3Rpb24pIHtcbiAgICBxdWVzdGlvbiA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgbWluOiAwLFxuICAgICAgbWF4OiAxMCxcbiAgICAgIHN0ZXA6IDEsXG4gICAgICBkZWZhdWx0VmFsdWU6IDUsXG4gICAgfSwgcXVlc3Rpb24pO1xuXG4gICAgc3VwZXIocGFyZW50LCByYW5nZVRlbXBsYXRlLCBxdWVzdGlvbik7XG5cbiAgICB0aGlzLmFuc3dlciA9IG51bGw7XG4gICAgdGhpcy5fb25JbnB1dCA9IHRoaXMuX29uSW5wdXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7ICdpbnB1dCAuYW5zd2VyJzogdGhpcy5fb25JbnB1dCB9KTtcbiAgICB0aGlzLiRzbGlkZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyJylcbiAgICB0aGlzLiRmZWVkYmFjayA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5mZWVkYmFjaycpO1xuICB9XG5cbiAgX29uSW5wdXQoZSkge1xuICAgIHRoaXMuJGZlZWRiYWNrLnRleHRDb250ZW50ID0gdGhpcy4kc2xpZGVyLnZhbHVlO1xuICAgIHRoaXMuYW5zd2VyID0gcGFyc2VGbG9hdCh0aGlzLiRzbGlkZXIudmFsdWUpXG4gICAgdGhpcy5wYXJlbnQuZW5hYmxlQnRuKCk7XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5zd2VyO1xuICB9XG59XG5cbmNvbnN0IHRleHRhcmVhVGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDx0ZXh0YXJlYSBjbGFzcz1cImFuc3dlciB0ZXh0YXJlYVwiPjwvdGV4dGFyZWE+XG5gO1xuXG4vLyBpcyBuZXZlciByZXF1aXJlZCBmb3Igbm93XG5jbGFzcyBUZXh0QXJlYVJlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHBhcmVudCwgdGV4dGFyZWFUZW1wbGF0ZSwgcXVlc3Rpb24pO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy4kbGFiZWwgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcubGFiZWwnKTtcbiAgICB0aGlzLiR0ZXh0YXJlYSA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5hbnN3ZXInKTtcbiAgfVxuXG4gIG9uU2hvdygpIHtcbiAgICB0aGlzLm9uUmVzaXplKCk7XG4gIH1cblxuICBvblJlc2l6ZShvcmllbnRhdGlvbiwgdmlld3BvcnRWaWR0aCwgdmlld3BvcnRIZWlnaHQpIHtcbiAgICBpZiAoIXRoaXMuJHBhcmVudCkgeyByZXR1cm47IH1cbiAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB3aWR0aCA9IGJvdW5kaW5nUmVjdC53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSBib3VuZGluZ1JlY3QuaGVpZ2h0O1xuXG4gICAgY29uc3QgbGFiZWxIZWlnaHQgPSB0aGlzLiRsYWJlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG5cbiAgICB0aGlzLiR0ZXh0YXJlYS5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICB0aGlzLiR0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHQgLSBsYWJlbEhlaWdodH1weGA7XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuJHRleHRhcmVhLnZhbHVlO1xuICB9XG59XG5cbi8qKlxuICogU3VydmV5IG1haW4gdnVlXG4gKi9cbmNsYXNzIFN1cnZleVZpZXcgZXh0ZW5kcyBTZWdtZW50ZWRWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucykge1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5yYXRpb3MgPSB7XG4gICAgICAnLnNlY3Rpb24tdG9wJzogMC4xNSxcbiAgICAgICcuc2VjdGlvbi1jZW50ZXInOiAwLjY1LFxuICAgICAgJy5zZWN0aW9uLWJvdHRvbSc6IDAuMixcbiAgICB9O1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgc3VwZXIub25SZW5kZXIoKTtcbiAgICB0aGlzLiRuZXh0QnRuID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLmJ0bicpO1xuICB9XG5cbiAgZGlzYWJsZUJ0bigpIHtcbiAgICB0aGlzLiRuZXh0QnRuLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgfVxuXG4gIGVuYWJsZUJ0bigpIHtcbiAgICB0aGlzLiRuZXh0QnRuLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgbW9kdWxlIHRvIGNyZWF0ZSBzdXJ2ZXlzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRTdXJ2ZXkgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihzdXJ2ZXlDb25maWcsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnc3VydmV5Jywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnN1cnZleSA9IHN1cnZleUNvbmZpZztcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuYW5zd2VycyA9IHt9O1xuXG4gICAgdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbiA9IHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24uYmluZCh0aGlzKTtcblxuICAgIHRoaXMudmlld0N0b3IgPSBTdXJ2ZXlWaWV3O1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmNvbnRlbnQuY291bnRlciA9IDA7XG4gICAgdGhpcy5jb250ZW50Lmxlbmd0aCA9IHRoaXMuc3VydmV5Lmxlbmd0aDtcbiAgICB0aGlzLmV2ZW50cyA9IHsgJ2NsaWNrIC5idG4nOiB0aGlzLl9kaXNwbGF5TmV4dFF1ZXN0aW9uIH07XG5cbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZURlZmF1bHRWaWV3KCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5fY3JlYXRlUmVuZGVyZXJzKCk7XG4gICAgdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbigpO1xuICB9XG5cbiAgX2NyZWF0ZVJlbmRlcmVycygpIHtcbiAgICB0aGlzLnJlbmRlcmVycyA9IHRoaXMuc3VydmV5Lm1hcCgocXVlc3Rpb24sIGluZGV4KSA9PiB7XG4gICAgICBxdWVzdGlvbi5yZXF1aXJlZCA9IHF1ZXN0aW9uLnJlcXVpcmVkID09PSB1bmRlZmluZWQgPyB0cnVlIDogcXVlc3Rpb24ucmVxdWlyZWQ7XG4gICAgICBxdWVzdGlvbi5pZCA9IHF1ZXN0aW9uLmlkIHx8IGBxdWVzdGlvbi0ke2luZGV4fWA7XG5cbiAgICAgIGxldCBjdG9yO1xuXG4gICAgICBzd2l0Y2ggKHF1ZXN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSAncmFkaW8nOlxuICAgICAgICAgIGN0b3IgPSBSYWRpb1JlbmRlcmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjaGVja2JveCc6XG4gICAgICAgICAgY3RvciA9IENoZWNrYm94UmVuZGVyZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JhbmdlJzpcbiAgICAgICAgICBjdG9yID0gUmFuZ2VSZW5kZXJlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgICAgIHF1ZXN0aW9uLnJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgICAgY3RvciA9IFRleHRBcmVhUmVuZGVyZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgY3Rvcih0aGlzLnZpZXcsIHF1ZXN0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9kaXNwbGF5TmV4dFF1ZXN0aW9uKCkge1xuICAgIC8vIC8vIGhhbmRsZSBjdXJyZW50IHF1ZXN0aW9uIGlmIGFueVxuICAgIGlmICh0aGlzLmN1cnJlbnRSZW5kZXJlcikge1xuICAgICAgY29uc3QgYW5zd2VyID0gdGhpcy5jdXJyZW50UmVuZGVyZXIuZ2V0QW5zd2VyKCk7XG4gICAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMuY3VycmVudFJlbmRlcmVyLnF1ZXN0aW9uLnJlcXVpcmVkO1xuXG4gICAgICBpZiAoYW5zd2VyID09PSBudWxsICYmIHJlcXVpcmVkKSB7IHJldHVybjsgfVxuICAgICAgdGhpcy5hbnN3ZXJzW3RoaXMuY3VycmVudFJlbmRlcmVyLmlkXSA9IGFuc3dlcjtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuYW5zd2Vycyk7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50UmVuZGVyZXIgPSB0aGlzLnJlbmRlcmVycy5zaGlmdCgpO1xuXG4gICAgLy8gdXBkYXRlIGNvdW50ZXJcbiAgICB0aGlzLmNvbnRlbnQuY291bnRlciArPSAxO1xuXG4gICAgaWYgKHRoaXMuY3VycmVudFJlbmRlcmVyKSB7XG4gICAgICAvLyB1cGRhdGUgY29udGVudFxuICAgICAgdGhpcy52aWV3LnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLWNlbnRlcicsIHRoaXMuY3VycmVudFJlbmRlcmVyKTtcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoKTtcblxuICAgICAgaWYgKHRoaXMuY3VycmVudFJlbmRlcmVyLnF1ZXN0aW9uLnJlcXVpcmVkKSB7XG4gICAgICAgIHRoaXMudmlldy5kaXNhYmxlQnRuKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlldy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1jZW50ZXInLCBudWxsKTtcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICAgIC8vIHNlbmQgaW5mb3JtYXRpb25zIHRvIHNlcnZlclxuICAgICAgdGhpcy5hbnN3ZXJzLnRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgdGhpcy5hbnN3ZXJzLnVzZXJBZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgICB0aGlzLnNlbmQoJ2Fuc3dlcnMnLCBKU09OLnN0cmluZ2lmeSh0aGlzLmFuc3dlcnMpKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==