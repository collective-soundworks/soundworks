'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

var BaseRenderer = (function () {
  function BaseRenderer(survey, question) {
    _classCallCheck(this, BaseRenderer);

    this.survey = survey;
    this.question = question;
    this.label = question.label;
    this.id = question.id;
  }

  // renderers

  _createClass(BaseRenderer, [{
    key: 'render',
    value: function render() {
      return '';
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this._unbindEvents();
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {}
  }, {
    key: '_unbindEvents',
    value: function _unbindEvents() {}
  }, {
    key: 'getAnswer',
    value: function getAnswer() {}
  }]);

  return BaseRenderer;
})();

var AbstractSelectorRenderer = (function (_BaseRenderer) {
  _inherits(AbstractSelectorRenderer, _BaseRenderer);

  function AbstractSelectorRenderer(survey, question) {
    _classCallCheck(this, AbstractSelectorRenderer);

    _get(Object.getPrototypeOf(AbstractSelectorRenderer.prototype), 'constructor', this).call(this, survey, question);
    this.answers = question.answers;

    this._onSelect = this._onSelect.bind(this);
  }

  _createClass(AbstractSelectorRenderer, [{
    key: 'render',
    value: function render(container, type) {
      this.container = container;

      var title = '<p class="label">' + this.label + '</p>';
      var answers = '';

      for (var key in this.answers) {
        var value = this.answers[key];
        answers += '<p class="answer ' + type + '" data-key="' + key + '">' + value + '</p>';
      }

      return '<div>' + title + answers + '</div>';
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      this.answersEl = _Array$from(this.container.querySelectorAll('.answer'));
      this.container.addEventListener('click', this._onSelect, false);
    }
  }, {
    key: '_unbindEvents',
    value: function _unbindEvents() {
      this.container.removeEventListener('click', this._onSelect, false);
    }
  }]);

  return AbstractSelectorRenderer;
})(BaseRenderer);

var RadioRenderer = (function (_AbstractSelectorRenderer) {
  _inherits(RadioRenderer, _AbstractSelectorRenderer);

  function RadioRenderer(survey, question) {
    _classCallCheck(this, RadioRenderer);

    _get(Object.getPrototypeOf(RadioRenderer.prototype), 'constructor', this).call(this, survey, question);
  }

  _createClass(RadioRenderer, [{
    key: 'render',
    value: function render(container) {
      return _get(Object.getPrototypeOf(RadioRenderer.prototype), 'render', this).call(this, container, 'radio');
    }
  }, {
    key: '_onSelect',
    value: function _onSelect(e) {
      var target = e.target;
      if (!target.classList.contains('answer')) {
        return;
      }

      this.answersEl.forEach(function (el) {
        el.classList.remove('selected');
      });
      target.classList.add('selected');

      this.survey.enableBtn();
    }
  }, {
    key: 'getAnswer',
    value: function getAnswer() {
      for (var i = 0; i < this.answersEl.length; i++) {
        var el = this.answersEl[i];
        if (el.classList.contains('selected')) {
          return el.getAttribute('data-key');
        }
      };

      return null;
    }
  }]);

  return RadioRenderer;
})(AbstractSelectorRenderer);

var CheckboxRenderer = (function (_AbstractSelectorRenderer2) {
  _inherits(CheckboxRenderer, _AbstractSelectorRenderer2);

  function CheckboxRenderer(survey, question) {
    _classCallCheck(this, CheckboxRenderer);

    _get(Object.getPrototypeOf(CheckboxRenderer.prototype), 'constructor', this).call(this, survey, question);
  }

  _createClass(CheckboxRenderer, [{
    key: 'render',
    value: function render(container) {
      return _get(Object.getPrototypeOf(CheckboxRenderer.prototype), 'render', this).call(this, container, 'checkbox');
    }
  }, {
    key: '_onSelect',
    value: function _onSelect(e) {
      var target = e.target;
      if (!target.classList.contains('answer')) {
        return;
      }

      var method = target.classList.contains('selected') ? 'remove' : 'add';
      target.classList[method]('selected');

      this.survey.enableBtn();
    }
  }, {
    key: 'getAnswer',
    value: function getAnswer() {
      var answers = [];

      for (var i = 0; i < this.answersEl.length; i++) {
        var el = this.answersEl[i];
        if (el.classList.contains('selected')) {
          answers.push(el.getAttribute('data-key'));
        }
      };

      return answers.length === 0 ? null : answers;
    }
  }]);

  return CheckboxRenderer;
})(AbstractSelectorRenderer);

var RangeRenderer = (function (_BaseRenderer2) {
  _inherits(RangeRenderer, _BaseRenderer2);

  function RangeRenderer(survey, question) {
    _classCallCheck(this, RangeRenderer);

    _get(Object.getPrototypeOf(RangeRenderer.prototype), 'constructor', this).call(this, survey, question);
    this.label = question.label;
    this.min = question.min === undefined ? 0 : question.min;
    this.max = question.max === undefined ? 10 : question.max;
    this.step = question.step === undefined ? 1 : question.step;
    this.defaultValue = question.defaultValue === undefined ? 5 : question.defaultValue;

    this._onInput = this._onInput.bind(this);
  }

  // is never required for now

  _createClass(RangeRenderer, [{
    key: 'render',
    value: function render(container) {
      this.container = container;

      var label = document.createElement('p');
      label.classList.add('label');
      label.textContent = this.label;

      this._range = document.createElement('input');
      this._range.setAttribute('type', 'range');
      this._range.setAttribute('min', this.min);
      this._range.setAttribute('max', this.max);
      this._range.setAttribute('step', this.step);
      this._range.setAttribute('value', this.defaultValue);
      this._range.classList.add('slider', 'answer');

      this._number = document.createElement('span');
      this._number.classList.add('range-feedback');
      this._number.textContent = this.defaultValue;

      var div = document.createElement('div');
      div.appendChild(label);
      div.appendChild(this._range);
      div.appendChild(this._number);

      return div;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      this._range.addEventListener('input', this._onInput, false);
    }
  }, {
    key: '_unbindEvents',
    value: function _unbindEvents() {
      this._range.removeEventListener('input', this._onInput, false);
    }
  }, {
    key: '_onInput',
    value: function _onInput(e) {
      this._number.textContent = this._range.value;

      this.survey.enableBtn();
    }
  }, {
    key: 'getAnswer',
    value: function getAnswer() {
      return parseFloat(this._range.value);
    }
  }]);

  return RangeRenderer;
})(BaseRenderer);

var TextAreaRenderer = (function (_BaseRenderer3) {
  _inherits(TextAreaRenderer, _BaseRenderer3);

  function TextAreaRenderer(survey, question) {
    _classCallCheck(this, TextAreaRenderer);

    _get(Object.getPrototypeOf(TextAreaRenderer.prototype), 'constructor', this).call(this, survey, question);
    this.label = question.label;
  }

  /**
   * @private
   */

  _createClass(TextAreaRenderer, [{
    key: 'render',
    value: function render(container) {
      this._container = container;

      return '\n      <p class="label">' + this.label + '</p>\n      <textarea class="answer textarea"></textarea>\n    ';
    }
  }, {
    key: 'getAnswer',
    value: function getAnswer() {
      var textarea = this._container.querySelector('.answer');
      return textarea.value;
    }
  }]);

  return TextAreaRenderer;
})(BaseRenderer);

var ClientSurvey = (function (_Module) {
  _inherits(ClientSurvey, _Module);

  function ClientSurvey(surveyConfig) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, ClientSurvey);

    _get(Object.getPrototypeOf(ClientSurvey.prototype), 'constructor', this).call(this, options.name || 'survey', true, options.color);

    if (options.thanks === undefined) {
      options.thanks = 'Thanks';
    }

    options.thanksContent = '<p class="thanks">' + options.thanks + '</p>';
    options.btnNextText = options.btnNextText || 'next';
    options.btnValidateText = options.btnValidateText || 'validate';

    this.survey = surveyConfig;
    this.options = options;
    this.contents = [];
    this.answers = {};
    this.questionCounter = 0;

    this._createRenderers();
    this._render();

    this._displayNextQuestion = this._displayNextQuestion.bind(this);

    this._displayNextQuestion();
    this._bindEvents();
  }

  _createClass(ClientSurvey, [{
    key: '_render',
    value: function _render() {
      var counter = document.createElement('div');
      counter.classList.add('counter');
      counter.innerHTML = '<span></span> / ' + this.survey.length;

      var nextBtn = document.createElement('button');
      nextBtn.classList.add('next', 'btn');
      nextBtn.textContent = this.options.btnNextText; // @TODO option

      this.view.appendChild(counter);
      this.view.appendChild(nextBtn);

      this._counter = counter;
      this._currentQuestionCounter = counter.querySelector('span');
      this._nextBtn = nextBtn;
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      this._nextBtn.addEventListener('click', this._displayNextQuestion, false);
    }
  }, {
    key: '_unbindEvents',
    value: function _unbindEvents() {
      this._nextBtn.removeEventListener('click', this._displayNextQuestion, false);
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

        return new ctor(_this, question);
      });
    }
  }, {
    key: '_displayNextQuestion',
    value: function _displayNextQuestion() {
      // handle current question if any
      if (this.currentRenderer) {
        var answer = this.currentRenderer.getAnswer();
        var required = this.currentRenderer.question.required;

        if (answer === null && required) {
          return;
        }

        this.currentRenderer.destroy();
        this.answers[this.currentRenderer.id] = answer;
      }

      this.currentRenderer = this.renderers.shift();

      if (this.currentRenderer) {
        // update counter
        this.questionCounter += 1;
        this._currentQuestionCounter.textContent = this.questionCounter;
        // update content
        var htmlContent = this.currentRenderer.render(this.view);
        this.setCenteredViewContent(htmlContent);
        this.currentRenderer.bindEvents();

        if (this.currentRenderer.question.required) {
          this.disableBtn();
        }

        if (this.renderers.length === 0) {
          this._nextBtn.textContent = this.options.btnValidateText;
        }
      } else {
        // remove counter and next buttons
        this.view.removeChild(this._counter);
        this.view.removeChild(this._nextBtn);
        // display thanks
        this.setCenteredViewContent(this.options.thanksContent);
        // send informations to server
        this.answers.timestamp = new Date().getTime();
        this.answers.userAgent = navigator.userAgent;
        this.send('answers', JSON.stringify(this.answers));
      }
    }
  }, {
    key: 'disableBtn',
    value: function disableBtn() {
      this._nextBtn.classList.add('disabled');
    }
  }, {
    key: 'enableBtn',
    value: function enableBtn() {
      this._nextBtn.classList.remove('disabled');
    }
  }]);

  return ClientSurvey;
})(_Module3['default']);

exports['default'] = ClientSurvey;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50U3VydmV5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBbUIsVUFBVTs7OztJQUd2QixZQUFZO0FBQ0wsV0FEUCxZQUFZLENBQ0osTUFBTSxFQUFFLFFBQVEsRUFBRTswQkFEMUIsWUFBWTs7QUFFZCxRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QixRQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDNUIsUUFBSSxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO0dBQ3ZCOzs7O2VBTkcsWUFBWTs7V0FRVixrQkFBRztBQUFHLGFBQU8sRUFBRSxDQUFDO0tBQUU7OztXQUVqQixtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztLQUN0Qjs7O1dBRVMsc0JBQUcsRUFBRTs7O1dBQ0YseUJBQUcsRUFBRTs7O1dBRVQscUJBQUcsRUFBRTs7O1NBakJWLFlBQVk7OztJQXFCWix3QkFBd0I7WUFBeEIsd0JBQXdCOztBQUNqQixXQURQLHdCQUF3QixDQUNoQixNQUFNLEVBQUUsUUFBUSxFQUFFOzBCQUQxQix3QkFBd0I7O0FBRTFCLCtCQUZFLHdCQUF3Qiw2Q0FFcEIsTUFBTSxFQUFFLFFBQVEsRUFBRTtBQUN4QixRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7O0FBRWhDLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDNUM7O2VBTkcsd0JBQXdCOztXQVF0QixnQkFBQyxTQUFTLEVBQUUsSUFBSSxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDOztBQUUzQixVQUFJLEtBQUsseUJBQXVCLElBQUksQ0FBQyxLQUFLLFNBQU0sQ0FBQztB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SSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7U0FDMUQ7T0FDRixNQUFNOztBQUVMLFlBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyQyxZQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXJDLFlBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUV4RCxZQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzlDLFlBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUM7QUFDN0MsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztPQUNwRDtLQUNGOzs7V0FFUyxzQkFBRztBQUNYLFVBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUN6Qzs7O1dBRVEscUJBQUc7QUFDVixVQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDNUM7OztTQWhJa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRTdXJ2ZXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG5jbGFzcyBCYXNlUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihzdXJ2ZXksIHF1ZXN0aW9uKSB7XG4gICAgdGhpcy5zdXJ2ZXkgPSBzdXJ2ZXk7XG4gICAgdGhpcy5xdWVzdGlvbiA9IHF1ZXN0aW9uO1xuICAgIHRoaXMubGFiZWwgPSBxdWVzdGlvbi5sYWJlbDtcbiAgICB0aGlzLmlkID0gcXVlc3Rpb24uaWQ7XG4gIH1cblxuICByZW5kZXIoKSB7ICByZXR1cm4gJyc7IH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuX3VuYmluZEV2ZW50cygpO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHt9XG4gIF91bmJpbmRFdmVudHMoKSB7fVxuXG4gIGdldEFuc3dlcigpIHt9XG59XG5cbi8vIHJlbmRlcmVyc1xuY2xhc3MgQWJzdHJhY3RTZWxlY3RvclJlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3Ioc3VydmV5LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHN1cnZleSwgcXVlc3Rpb24pO1xuICAgIHRoaXMuYW5zd2VycyA9IHF1ZXN0aW9uLmFuc3dlcnM7XG5cbiAgICB0aGlzLl9vblNlbGVjdCA9IHRoaXMuX29uU2VsZWN0LmJpbmQodGhpcyk7XG4gIH1cblxuICByZW5kZXIoY29udGFpbmVyLCB0eXBlKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG5cbiAgICBsZXQgdGl0bGUgPSBgPHAgY2xhc3M9XCJsYWJlbFwiPiR7dGhpcy5sYWJlbH08L3A+YDtcbiAgICBsZXQgYW5zd2VycyA9ICcnO1xuXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuYW5zd2Vycykge1xuICAgICAgbGV0IHZhbHVlID0gdGhpcy5hbnN3ZXJzW2tleV07XG4gICAgICBhbnN3ZXJzICs9IGA8cCBjbGFzcz1cImFuc3dlciAke3R5cGV9XCIgZGF0YS1rZXk9XCIke2tleX1cIj4ke3ZhbHVlfTwvcD5gO1xuICAgIH1cblxuICAgIHJldHVybiBgPGRpdj4ke3RpdGxlfSR7YW5zd2Vyc308L2Rpdj5gO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLmFuc3dlcnNFbCA9IEFycmF5LmZyb20odGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmFuc3dlcicpKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uU2VsZWN0LCBmYWxzZSk7XG4gIH1cblxuICBfdW5iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25TZWxlY3QsIGZhbHNlKTtcbiAgfVxufVxuXG5jbGFzcyBSYWRpb1JlbmRlcmVyIGV4dGVuZHMgQWJzdHJhY3RTZWxlY3RvclJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3Ioc3VydmV5LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHN1cnZleSwgcXVlc3Rpb24pO1xuICB9XG5cbiAgcmVuZGVyKGNvbnRhaW5lcikge1xuICAgIHJldHVybiBzdXBlci5yZW5kZXIoY29udGFpbmVyLCAncmFkaW8nKTtcbiAgfVxuXG4gIF9vblNlbGVjdChlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgaWYgKCF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhbnN3ZXInKSkgeyByZXR1cm47IH1cblxuICAgIHRoaXMuYW5zd2Vyc0VsLmZvckVhY2goKGVsKSA9PiB7IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7IH0pO1xuICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuXG4gICAgdGhpcy5zdXJ2ZXkuZW5hYmxlQnRuKCk7XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFuc3dlcnNFbC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVsID0gdGhpcy5hbnN3ZXJzRWxbaV07XG4gICAgICBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpKSB7XG4gICAgICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEta2V5Jyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmNsYXNzIENoZWNrYm94UmVuZGVyZXIgZXh0ZW5kcyBBYnN0cmFjdFNlbGVjdG9yUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihzdXJ2ZXksIHF1ZXN0aW9uKSB7XG4gICAgc3VwZXIoc3VydmV5LCBxdWVzdGlvbik7XG4gIH1cblxuICByZW5kZXIoY29udGFpbmVyKSB7XG4gICAgcmV0dXJuIHN1cGVyLnJlbmRlcihjb250YWluZXIsICdjaGVja2JveCcpO1xuICB9XG5cbiAgX29uU2VsZWN0KGUpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICBpZiAoIXRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2Fuc3dlcicpKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgbWV0aG9kID0gdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKSA/ICdyZW1vdmUnIDogJ2FkZCc7XG4gICAgdGFyZ2V0LmNsYXNzTGlzdFttZXRob2RdKCdzZWxlY3RlZCcpO1xuXG4gICAgdGhpcy5zdXJ2ZXkuZW5hYmxlQnRuKCk7XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgY29uc3QgYW5zd2VycyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFuc3dlcnNFbC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVsID0gdGhpcy5hbnN3ZXJzRWxbaV07XG4gICAgICBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpKSB7XG4gICAgICAgIGFuc3dlcnMucHVzaChlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEta2V5JykpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gYW5zd2Vycy5sZW5ndGggPT09IDAgPyBudWxsIDogYW5zd2VycztcbiAgfVxufVxuXG5jbGFzcyBSYW5nZVJlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3Ioc3VydmV5LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHN1cnZleSwgcXVlc3Rpb24pO1xuICAgIHRoaXMubGFiZWwgPSBxdWVzdGlvbi5sYWJlbDtcbiAgICB0aGlzLm1pbiA9IHF1ZXN0aW9uLm1pbiA9PT0gdW5kZWZpbmVkID8gMCA6IHF1ZXN0aW9uLm1pbjtcbiAgICB0aGlzLm1heCA9IHF1ZXN0aW9uLm1heCA9PT0gdW5kZWZpbmVkID8gMTAgOiBxdWVzdGlvbi5tYXg7XG4gICAgdGhpcy5zdGVwID0gcXVlc3Rpb24uc3RlcCA9PT0gdW5kZWZpbmVkID8gMSA6IHF1ZXN0aW9uLnN0ZXA7XG4gICAgdGhpcy5kZWZhdWx0VmFsdWUgPSBxdWVzdGlvbi5kZWZhdWx0VmFsdWUgPT09IHVuZGVmaW5lZCA/IDUgOiBxdWVzdGlvbi5kZWZhdWx0VmFsdWU7XG5cbiAgICB0aGlzLl9vbklucHV0ID0gdGhpcy5fb25JbnB1dC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgcmVuZGVyKGNvbnRhaW5lcikge1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuXG4gICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgbGFiZWwuY2xhc3NMaXN0LmFkZCgnbGFiZWwnKTtcbiAgICBsYWJlbC50ZXh0Q29udGVudCA9IHRoaXMubGFiZWw7XG5cbiAgICB0aGlzLl9yYW5nZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5fcmFuZ2Uuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3JhbmdlJyk7XG4gICAgdGhpcy5fcmFuZ2Uuc2V0QXR0cmlidXRlKCdtaW4nLCB0aGlzLm1pbik7XG4gICAgdGhpcy5fcmFuZ2Uuc2V0QXR0cmlidXRlKCdtYXgnLCB0aGlzLm1heCk7XG4gICAgdGhpcy5fcmFuZ2Uuc2V0QXR0cmlidXRlKCdzdGVwJywgdGhpcy5zdGVwKTtcbiAgICB0aGlzLl9yYW5nZS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgdGhpcy5kZWZhdWx0VmFsdWUpO1xuICAgIHRoaXMuX3JhbmdlLmNsYXNzTGlzdC5hZGQoJ3NsaWRlcicsICdhbnN3ZXInKTtcblxuICAgIHRoaXMuX251bWJlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB0aGlzLl9udW1iZXIuY2xhc3NMaXN0LmFkZCgncmFuZ2UtZmVlZGJhY2snKTtcbiAgICB0aGlzLl9udW1iZXIudGV4dENvbnRlbnQgPSB0aGlzLmRlZmF1bHRWYWx1ZTtcblxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgZGl2LmFwcGVuZENoaWxkKHRoaXMuX3JhbmdlKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQodGhpcy5fbnVtYmVyKTtcblxuICAgIHJldHVybiBkaXY7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuX3JhbmdlLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5fb25JbnB1dCwgZmFsc2UpO1xuICB9XG5cbiAgX3VuYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLl9yYW5nZS5yZW1vdmVFdmVudExpc3RlbmVyKCdpbnB1dCcsIHRoaXMuX29uSW5wdXQsIGZhbHNlKTtcbiAgfVxuXG4gIF9vbklucHV0KGUpIHtcbiAgICB0aGlzLl9udW1iZXIudGV4dENvbnRlbnQgPSB0aGlzLl9yYW5nZS52YWx1ZTtcblxuICAgIHRoaXMuc3VydmV5LmVuYWJsZUJ0bigpO1xuICB9XG5cbiAgZ2V0QW5zd2VyKCkge1xuICAgIHJldHVybiBwYXJzZUZsb2F0KHRoaXMuX3JhbmdlLnZhbHVlKTtcbiAgfVxufVxuXG4vLyBpcyBuZXZlciByZXF1aXJlZCBmb3Igbm93XG5jbGFzcyBUZXh0QXJlYVJlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3Ioc3VydmV5LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHN1cnZleSwgcXVlc3Rpb24pO1xuICAgIHRoaXMubGFiZWwgPSBxdWVzdGlvbi5sYWJlbDtcbiAgfVxuXG4gIHJlbmRlcihjb250YWluZXIpIHtcbiAgICB0aGlzLl9jb250YWluZXIgPSBjb250YWluZXI7XG5cbiAgICByZXR1cm4gYFxuICAgICAgPHAgY2xhc3M9XCJsYWJlbFwiPiR7dGhpcy5sYWJlbH08L3A+XG4gICAgICA8dGV4dGFyZWEgY2xhc3M9XCJhbnN3ZXIgdGV4dGFyZWFcIj48L3RleHRhcmVhPlxuICAgIGA7XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgY29uc3QgdGV4dGFyZWEgPSB0aGlzLl9jb250YWluZXIucXVlcnlTZWxlY3RvcignLmFuc3dlcicpO1xuICAgIHJldHVybiB0ZXh0YXJlYS52YWx1ZTtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudFN1cnZleSBleHRlbmRzIE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKHN1cnZleUNvbmZpZywgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdzdXJ2ZXknLCB0cnVlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIGlmIChvcHRpb25zLnRoYW5rcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRpb25zLnRoYW5rcyA9ICdUaGFua3MnO1xuICAgIH1cblxuICAgIG9wdGlvbnMudGhhbmtzQ29udGVudCA9IGA8cCBjbGFzcz1cInRoYW5rc1wiPiR7b3B0aW9ucy50aGFua3N9PC9wPmA7XG4gICAgb3B0aW9ucy5idG5OZXh0VGV4dCA9IG9wdGlvbnMuYnRuTmV4dFRleHQgfHzCoCduZXh0JztcbiAgICBvcHRpb25zLmJ0blZhbGlkYXRlVGV4dCA9IG9wdGlvbnMuYnRuVmFsaWRhdGVUZXh0IHx8wqAndmFsaWRhdGUnO1xuXG4gICAgdGhpcy5zdXJ2ZXkgPSBzdXJ2ZXlDb25maWc7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmNvbnRlbnRzID0gW107XG4gICAgdGhpcy5hbnN3ZXJzID0ge307XG4gICAgdGhpcy5xdWVzdGlvbkNvdW50ZXIgPSAwO1xuXG4gICAgdGhpcy5fY3JlYXRlUmVuZGVyZXJzKCk7XG4gICAgdGhpcy5fcmVuZGVyKCk7XG5cbiAgICB0aGlzLl9kaXNwbGF5TmV4dFF1ZXN0aW9uID0gdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbi5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbigpO1xuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcbiAgfVxuXG4gIF9yZW5kZXIoKSB7XG4gICAgY29uc3QgY291bnRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvdW50ZXIuY2xhc3NMaXN0LmFkZCgnY291bnRlcicpO1xuICAgIGNvdW50ZXIuaW5uZXJIVE1MID0gYDxzcGFuPjwvc3Bhbj4gLyAke3RoaXMuc3VydmV5Lmxlbmd0aH1gO1xuXG4gICAgY29uc3QgbmV4dEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIG5leHRCdG4uY2xhc3NMaXN0LmFkZCgnbmV4dCcsICdidG4nKTtcbiAgICBuZXh0QnRuLnRleHRDb250ZW50ID0gdGhpcy5vcHRpb25zLmJ0bk5leHRUZXh0OyAvLyBAVE9ETyBvcHRpb25cblxuICAgIHRoaXMudmlldy5hcHBlbmRDaGlsZChjb3VudGVyKTtcbiAgICB0aGlzLnZpZXcuYXBwZW5kQ2hpbGQobmV4dEJ0bik7XG5cbiAgICB0aGlzLl9jb3VudGVyID0gY291bnRlcjtcbiAgICB0aGlzLl9jdXJyZW50UXVlc3Rpb25Db3VudGVyID0gY291bnRlci5xdWVyeVNlbGVjdG9yKCdzcGFuJyk7XG4gICAgdGhpcy5fbmV4dEJ0biA9IG5leHRCdG47XG4gIH1cblxuICBfYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLl9uZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbiwgZmFsc2UpO1xuICB9XG5cbiAgX3VuYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLl9uZXh0QnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbiwgZmFsc2UpO1xuICB9XG5cbiAgX2NyZWF0ZVJlbmRlcmVycygpIHtcbiAgICB0aGlzLnJlbmRlcmVycyA9IHRoaXMuc3VydmV5Lm1hcCgocXVlc3Rpb24sIGluZGV4KSA9PiB7XG4gICAgICBxdWVzdGlvbi5yZXF1aXJlZCA9IHF1ZXN0aW9uLnJlcXVpcmVkID09PSB1bmRlZmluZWQgPyB0cnVlIDogcXVlc3Rpb24ucmVxdWlyZWQ7XG4gICAgICBxdWVzdGlvbi5pZCA9IHF1ZXN0aW9uLmlkIHx8IGBxdWVzdGlvbi0ke2luZGV4fWA7XG5cbiAgICAgIGxldCBjdG9yO1xuXG4gICAgICBzd2l0Y2ggKHF1ZXN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSAncmFkaW8nOlxuICAgICAgICAgIGN0b3IgPSBSYWRpb1JlbmRlcmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjaGVja2JveCc6XG4gICAgICAgICAgY3RvciA9IENoZWNrYm94UmVuZGVyZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JhbmdlJzpcbiAgICAgICAgICBjdG9yID0gUmFuZ2VSZW5kZXJlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgICAgIHF1ZXN0aW9uLnJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgICAgY3RvciA9IFRleHRBcmVhUmVuZGVyZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgY3Rvcih0aGlzLCBxdWVzdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICBfZGlzcGxheU5leHRRdWVzdGlvbigpIHtcbiAgICAvLyBoYW5kbGUgY3VycmVudCBxdWVzdGlvbiBpZiBhbnlcbiAgICBpZiAodGhpcy5jdXJyZW50UmVuZGVyZXIpIHtcbiAgICAgIGNvbnN0IGFuc3dlciA9IHRoaXMuY3VycmVudFJlbmRlcmVyLmdldEFuc3dlcigpO1xuICAgICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLmN1cnJlbnRSZW5kZXJlci5xdWVzdGlvbi5yZXF1aXJlZDtcblxuICAgICAgaWYgKGFuc3dlciA9PT0gbnVsbCAmJiByZXF1aXJlZCkgeyByZXR1cm47IH1cblxuICAgICAgdGhpcy5jdXJyZW50UmVuZGVyZXIuZGVzdHJveSgpO1xuICAgICAgdGhpcy5hbnN3ZXJzW3RoaXMuY3VycmVudFJlbmRlcmVyLmlkXSA9IGFuc3dlcjtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRSZW5kZXJlciA9IHRoaXMucmVuZGVyZXJzLnNoaWZ0KCk7XG5cbiAgICBpZiAodGhpcy5jdXJyZW50UmVuZGVyZXIpIHtcbiAgICAgIC8vIHVwZGF0ZSBjb3VudGVyXG4gICAgICB0aGlzLnF1ZXN0aW9uQ291bnRlciArPSAxO1xuICAgICAgdGhpcy5fY3VycmVudFF1ZXN0aW9uQ291bnRlci50ZXh0Q29udGVudCA9IHRoaXMucXVlc3Rpb25Db3VudGVyO1xuICAgICAgLy8gdXBkYXRlIGNvbnRlbnRcbiAgICAgIGNvbnN0IGh0bWxDb250ZW50ID0gdGhpcy5jdXJyZW50UmVuZGVyZXIucmVuZGVyKHRoaXMudmlldyk7XG4gICAgICB0aGlzLnNldENlbnRlcmVkVmlld0NvbnRlbnQoaHRtbENvbnRlbnQpO1xuICAgICAgdGhpcy5jdXJyZW50UmVuZGVyZXIuYmluZEV2ZW50cygpO1xuXG4gICAgICBpZiAodGhpcy5jdXJyZW50UmVuZGVyZXIucXVlc3Rpb24ucmVxdWlyZWQpIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlQnRuKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnJlbmRlcmVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5fbmV4dEJ0bi50ZXh0Q29udGVudCA9IHRoaXMub3B0aW9ucy5idG5WYWxpZGF0ZVRleHQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJlbW92ZSBjb3VudGVyIGFuZCBuZXh0IGJ1dHRvbnNcbiAgICAgIHRoaXMudmlldy5yZW1vdmVDaGlsZCh0aGlzLl9jb3VudGVyKTtcbiAgICAgIHRoaXMudmlldy5yZW1vdmVDaGlsZCh0aGlzLl9uZXh0QnRuKTtcbiAgICAgIC8vIGRpc3BsYXkgdGhhbmtzXG4gICAgICB0aGlzLnNldENlbnRlcmVkVmlld0NvbnRlbnQodGhpcy5vcHRpb25zLnRoYW5rc0NvbnRlbnQpO1xuICAgICAgLy8gc2VuZCBpbmZvcm1hdGlvbnMgdG8gc2VydmVyXG4gICAgICB0aGlzLmFuc3dlcnMudGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICB0aGlzLmFuc3dlcnMudXNlckFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICAgIHRoaXMuc2VuZCgnYW5zd2VycycsIEpTT04uc3RyaW5naWZ5KHRoaXMuYW5zd2VycykpO1xuICAgIH1cbiAgfVxuXG4gIGRpc2FibGVCdG4oKSB7XG4gICAgdGhpcy5fbmV4dEJ0bi5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICB9XG5cbiAgZW5hYmxlQnRuKCkge1xuICAgIHRoaXMuX25leHRCdG4uY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKTtcbiAgfVxufVxuIl19