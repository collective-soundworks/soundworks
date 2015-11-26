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

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

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

var Survey = (function (_Module) {
  _inherits(Survey, _Module);

  function Survey(surveyConfig) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Survey);

    _get(Object.getPrototypeOf(Survey.prototype), 'constructor', this).call(this, options.name || 'survey', true, options.color);

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

  _createClass(Survey, [{
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
        _client2['default'].send(this.name + ':answers', JSON.stringify(this.answers));
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

  return Survey;
})(_Module3['default']);

exports['default'] = Survey;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvU3VydmV5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7O0lBR3ZCLFlBQVk7QUFDTCxXQURQLFlBQVksQ0FDSixNQUFNLEVBQUUsUUFBUSxFQUFFOzBCQUQxQixZQUFZOztBQUVkLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUM1QixRQUFJLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUM7R0FDdkI7Ozs7ZUFORyxZQUFZOztXQVFWLGtCQUFHO0FBQUcsYUFBTyxFQUFFLENBQUM7S0FBRTs7O1dBRWpCLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0tBQ3RCOzs7V0FFUyxzQkFBRyxFQUFFOzs7V0FDRix5QkFBRyxFQUFFOzs7V0FFVCxxQkFBRyxFQUFFOzs7U0FqQlYsWUFBWTs7O0lBcUJaLHdCQUF3QjtZQUF4Qix3QkFBd0I7O0FBQ2pCLFdBRFAsd0JBQXdCLENBQ2hCLE1BQU0sRUFBRSxRQUFRLEVBQUU7MEJBRDFCLHdCQUF3Qjs7QUFFMUIsK0JBRkUsd0JBQXdCLDZDQUVwQixNQUFNLEVBQUUsUUFBUSxFQUFFO0FBQ3hCLFFBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQzs7QUFFaEMsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM1Qzs7ZUFORyx3QkFBd0I7O1dBUXRCLGdCQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUU7QUFDdEIsVUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7O0FBRTNCLFVBQUksS0FBSyx5QkFBdUIsSUFBSSxDQUFDLEtBQUssU0FB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L0IsY0FBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7U0FDMUQ7T0FDRixNQUFNOztBQUVMLFlBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyQyxZQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXJDLFlBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUV4RCxZQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzlDLFlBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUM7QUFDN0MsNEJBQU8sSUFBSSxDQUFJLElBQUksQ0FBQyxJQUFJLGVBQVksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztPQUNuRTtLQUNGOzs7V0FFUyxzQkFBRztBQUNYLFVBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUN6Qzs7O1dBRVEscUJBQUc7QUFDVixVQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDNUM7OztTQWhJa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoic3JjL2NsaWVudC9TdXJ2ZXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbmNsYXNzIEJhc2VSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHN1cnZleSwgcXVlc3Rpb24pIHtcbiAgICB0aGlzLnN1cnZleSA9IHN1cnZleTtcbiAgICB0aGlzLnF1ZXN0aW9uID0gcXVlc3Rpb247XG4gICAgdGhpcy5sYWJlbCA9IHF1ZXN0aW9uLmxhYmVsO1xuICAgIHRoaXMuaWQgPSBxdWVzdGlvbi5pZDtcbiAgfVxuXG4gIHJlbmRlcigpIHsgIHJldHVybiAnJzsgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5fdW5iaW5kRXZlbnRzKCk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge31cbiAgX3VuYmluZEV2ZW50cygpIHt9XG5cbiAgZ2V0QW5zd2VyKCkge31cbn1cblxuLy8gcmVuZGVyZXJzXG5jbGFzcyBBYnN0cmFjdFNlbGVjdG9yUmVuZGVyZXIgZXh0ZW5kcyBCYXNlUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihzdXJ2ZXksIHF1ZXN0aW9uKSB7XG4gICAgc3VwZXIoc3VydmV5LCBxdWVzdGlvbik7XG4gICAgdGhpcy5hbnN3ZXJzID0gcXVlc3Rpb24uYW5zd2VycztcblxuICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHJlbmRlcihjb250YWluZXIsIHR5cGUpIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcblxuICAgIGxldCB0aXRsZSA9IGA8cCBjbGFzcz1cImxhYmVsXCI+JHt0aGlzLmxhYmVsfTwvcD5gO1xuICAgIGxldCBhbnN3ZXJzID0gJyc7XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5hbnN3ZXJzKSB7XG4gICAgICBsZXQgdmFsdWUgPSB0aGlzLmFuc3dlcnNba2V5XTtcbiAgICAgIGFuc3dlcnMgKz0gYDxwIGNsYXNzPVwiYW5zd2VyICR7dHlwZX1cIiBkYXRhLWtleT1cIiR7a2V5fVwiPiR7dmFsdWV9PC9wPmA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGA8ZGl2PiR7dGl0bGV9JHthbnN3ZXJzfTwvZGl2PmA7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuYW5zd2Vyc0VsID0gQXJyYXkuZnJvbSh0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuYW5zd2VyJykpO1xuICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25TZWxlY3QsIGZhbHNlKTtcbiAgfVxuXG4gIF91bmJpbmRFdmVudHMoKSB7XG4gICAgdGhpcy5jb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vblNlbGVjdCwgZmFsc2UpO1xuICB9XG59XG5cbmNsYXNzIFJhZGlvUmVuZGVyZXIgZXh0ZW5kcyBBYnN0cmFjdFNlbGVjdG9yUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihzdXJ2ZXksIHF1ZXN0aW9uKSB7XG4gICAgc3VwZXIoc3VydmV5LCBxdWVzdGlvbik7XG4gIH1cblxuICByZW5kZXIoY29udGFpbmVyKSB7XG4gICAgcmV0dXJuIHN1cGVyLnJlbmRlcihjb250YWluZXIsICdyYWRpbycpO1xuICB9XG5cbiAgX29uU2VsZWN0KGUpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICBpZiAoIXRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2Fuc3dlcicpKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5hbnN3ZXJzRWwuZm9yRWFjaCgoZWwpID0+IHsgZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTsgfSk7XG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XG5cbiAgICB0aGlzLnN1cnZleS5lbmFibGVCdG4oKTtcbiAgfVxuXG4gIGdldEFuc3dlcigpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYW5zd2Vyc0VsLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZWwgPSB0aGlzLmFuc3dlcnNFbFtpXTtcbiAgICAgIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJykpIHtcbiAgICAgICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1rZXknKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuY2xhc3MgQ2hlY2tib3hSZW5kZXJlciBleHRlbmRzIEFic3RyYWN0U2VsZWN0b3JSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHN1cnZleSwgcXVlc3Rpb24pIHtcbiAgICBzdXBlcihzdXJ2ZXksIHF1ZXN0aW9uKTtcbiAgfVxuXG4gIHJlbmRlcihjb250YWluZXIpIHtcbiAgICByZXR1cm4gc3VwZXIucmVuZGVyKGNvbnRhaW5lciwgJ2NoZWNrYm94Jyk7XG4gIH1cblxuICBfb25TZWxlY3QoZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xuICAgIGlmICghdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYW5zd2VyJykpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBtZXRob2QgPSB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpID8gJ3JlbW92ZScgOiAnYWRkJztcbiAgICB0YXJnZXQuY2xhc3NMaXN0W21ldGhvZF0oJ3NlbGVjdGVkJyk7XG5cbiAgICB0aGlzLnN1cnZleS5lbmFibGVCdG4oKTtcbiAgfVxuXG4gIGdldEFuc3dlcigpIHtcbiAgICBjb25zdCBhbnN3ZXJzID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYW5zd2Vyc0VsLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZWwgPSB0aGlzLmFuc3dlcnNFbFtpXTtcbiAgICAgIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJykpIHtcbiAgICAgICAgYW5zd2Vycy5wdXNoKGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1rZXknKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBhbnN3ZXJzLmxlbmd0aCA9PT0gMCA/IG51bGwgOiBhbnN3ZXJzO1xuICB9XG59XG5cbmNsYXNzIFJhbmdlUmVuZGVyZXIgZXh0ZW5kcyBCYXNlUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihzdXJ2ZXksIHF1ZXN0aW9uKSB7XG4gICAgc3VwZXIoc3VydmV5LCBxdWVzdGlvbik7XG4gICAgdGhpcy5sYWJlbCA9IHF1ZXN0aW9uLmxhYmVsO1xuICAgIHRoaXMubWluID0gcXVlc3Rpb24ubWluID09PSB1bmRlZmluZWQgPyAwIDogcXVlc3Rpb24ubWluO1xuICAgIHRoaXMubWF4ID0gcXVlc3Rpb24ubWF4ID09PSB1bmRlZmluZWQgPyAxMCA6IHF1ZXN0aW9uLm1heDtcbiAgICB0aGlzLnN0ZXAgPSBxdWVzdGlvbi5zdGVwID09PSB1bmRlZmluZWQgPyAxIDogcXVlc3Rpb24uc3RlcDtcbiAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IHF1ZXN0aW9uLmRlZmF1bHRWYWx1ZSA9PT0gdW5kZWZpbmVkID8gNSA6IHF1ZXN0aW9uLmRlZmF1bHRWYWx1ZTtcblxuICAgIHRoaXMuX29uSW5wdXQgPSB0aGlzLl9vbklucHV0LmJpbmQodGhpcyk7XG4gIH1cblxuICByZW5kZXIoY29udGFpbmVyKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG5cbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBsYWJlbC5jbGFzc0xpc3QuYWRkKCdsYWJlbCcpO1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gdGhpcy5sYWJlbDtcblxuICAgIHRoaXMuX3JhbmdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLl9yYW5nZS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAncmFuZ2UnKTtcbiAgICB0aGlzLl9yYW5nZS5zZXRBdHRyaWJ1dGUoJ21pbicsIHRoaXMubWluKTtcbiAgICB0aGlzLl9yYW5nZS5zZXRBdHRyaWJ1dGUoJ21heCcsIHRoaXMubWF4KTtcbiAgICB0aGlzLl9yYW5nZS5zZXRBdHRyaWJ1dGUoJ3N0ZXAnLCB0aGlzLnN0ZXApO1xuICAgIHRoaXMuX3JhbmdlLnNldEF0dHJpYnV0ZSgndmFsdWUnLCB0aGlzLmRlZmF1bHRWYWx1ZSk7XG4gICAgdGhpcy5fcmFuZ2UuY2xhc3NMaXN0LmFkZCgnc2xpZGVyJywgJ2Fuc3dlcicpO1xuXG4gICAgdGhpcy5fbnVtYmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHRoaXMuX251bWJlci5jbGFzc0xpc3QuYWRkKCdyYW5nZS1mZWVkYmFjaycpO1xuICAgIHRoaXMuX251bWJlci50ZXh0Q29udGVudCA9IHRoaXMuZGVmYXVsdFZhbHVlO1xuXG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQodGhpcy5fcmFuZ2UpO1xuICAgIGRpdi5hcHBlbmRDaGlsZCh0aGlzLl9udW1iZXIpO1xuXG4gICAgcmV0dXJuIGRpdjtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgdGhpcy5fcmFuZ2UuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLl9vbklucHV0LCBmYWxzZSk7XG4gIH1cblxuICBfdW5iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuX3JhbmdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5fb25JbnB1dCwgZmFsc2UpO1xuICB9XG5cbiAgX29uSW5wdXQoZSkge1xuICAgIHRoaXMuX251bWJlci50ZXh0Q29udGVudCA9IHRoaXMuX3JhbmdlLnZhbHVlO1xuXG4gICAgdGhpcy5zdXJ2ZXkuZW5hYmxlQnRuKCk7XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQodGhpcy5fcmFuZ2UudmFsdWUpO1xuICB9XG59XG5cbi8vIGlzIG5ldmVyIHJlcXVpcmVkIGZvciBub3dcbmNsYXNzIFRleHRBcmVhUmVuZGVyZXIgZXh0ZW5kcyBCYXNlUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihzdXJ2ZXksIHF1ZXN0aW9uKSB7XG4gICAgc3VwZXIoc3VydmV5LCBxdWVzdGlvbik7XG4gICAgdGhpcy5sYWJlbCA9IHF1ZXN0aW9uLmxhYmVsO1xuICB9XG5cbiAgcmVuZGVyKGNvbnRhaW5lcikge1xuICAgIHRoaXMuX2NvbnRhaW5lciA9IGNvbnRhaW5lcjtcblxuICAgIHJldHVybiBgXG4gICAgICA8cCBjbGFzcz1cImxhYmVsXCI+JHt0aGlzLmxhYmVsfTwvcD5cbiAgICAgIDx0ZXh0YXJlYSBjbGFzcz1cImFuc3dlciB0ZXh0YXJlYVwiPjwvdGV4dGFyZWE+XG4gICAgYDtcbiAgfVxuXG4gIGdldEFuc3dlcigpIHtcbiAgICBjb25zdCB0ZXh0YXJlYSA9IHRoaXMuX2NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYW5zd2VyJyk7XG4gICAgcmV0dXJuIHRleHRhcmVhLnZhbHVlO1xuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3VydmV5IGV4dGVuZHMgTW9kdWxlIHtcbiAgY29uc3RydWN0b3Ioc3VydmV5Q29uZmlnLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3N1cnZleScsIHRydWUsIG9wdGlvbnMuY29sb3IpO1xuXG4gICAgaWYgKG9wdGlvbnMudGhhbmtzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdGlvbnMudGhhbmtzID0gJ1RoYW5rcyc7XG4gICAgfVxuXG4gICAgb3B0aW9ucy50aGFua3NDb250ZW50ID0gYDxwIGNsYXNzPVwidGhhbmtzXCI+JHtvcHRpb25zLnRoYW5rc308L3A+YDtcbiAgICBvcHRpb25zLmJ0bk5leHRUZXh0ID0gb3B0aW9ucy5idG5OZXh0VGV4dCB8fMKgJ25leHQnO1xuICAgIG9wdGlvbnMuYnRuVmFsaWRhdGVUZXh0ID0gb3B0aW9ucy5idG5WYWxpZGF0ZVRleHQgfHzCoCd2YWxpZGF0ZSc7XG5cbiAgICB0aGlzLnN1cnZleSA9IHN1cnZleUNvbmZpZztcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuY29udGVudHMgPSBbXTtcbiAgICB0aGlzLmFuc3dlcnMgPSB7fTtcbiAgICB0aGlzLnF1ZXN0aW9uQ291bnRlciA9IDA7XG5cbiAgICB0aGlzLl9jcmVhdGVSZW5kZXJlcnMoKTtcbiAgICB0aGlzLl9yZW5kZXIoKTtcblxuICAgIHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24gPSB0aGlzLl9kaXNwbGF5TmV4dFF1ZXN0aW9uLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9kaXNwbGF5TmV4dFF1ZXN0aW9uKCk7XG4gICAgdGhpcy5fYmluZEV2ZW50cygpO1xuICB9XG5cbiAgX3JlbmRlcigpIHtcbiAgICBjb25zdCBjb3VudGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY291bnRlci5jbGFzc0xpc3QuYWRkKCdjb3VudGVyJyk7XG4gICAgY291bnRlci5pbm5lckhUTUwgPSBgPHNwYW4+PC9zcGFuPiAvICR7dGhpcy5zdXJ2ZXkubGVuZ3RofWA7XG5cbiAgICBjb25zdCBuZXh0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgbmV4dEJ0bi5jbGFzc0xpc3QuYWRkKCduZXh0JywgJ2J0bicpO1xuICAgIG5leHRCdG4udGV4dENvbnRlbnQgPSB0aGlzLm9wdGlvbnMuYnRuTmV4dFRleHQ7IC8vIEBUT0RPIG9wdGlvblxuXG4gICAgdGhpcy52aWV3LmFwcGVuZENoaWxkKGNvdW50ZXIpO1xuICAgIHRoaXMudmlldy5hcHBlbmRDaGlsZChuZXh0QnRuKTtcblxuICAgIHRoaXMuX2NvdW50ZXIgPSBjb3VudGVyO1xuICAgIHRoaXMuX2N1cnJlbnRRdWVzdGlvbkNvdW50ZXIgPSBjb3VudGVyLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKTtcbiAgICB0aGlzLl9uZXh0QnRuID0gbmV4dEJ0bjtcbiAgfVxuXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuX25leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9kaXNwbGF5TmV4dFF1ZXN0aW9uLCBmYWxzZSk7XG4gIH1cblxuICBfdW5iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuX25leHRCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9kaXNwbGF5TmV4dFF1ZXN0aW9uLCBmYWxzZSk7XG4gIH1cblxuICBfY3JlYXRlUmVuZGVyZXJzKCkge1xuICAgIHRoaXMucmVuZGVyZXJzID0gdGhpcy5zdXJ2ZXkubWFwKChxdWVzdGlvbiwgaW5kZXgpID0+IHtcbiAgICAgIHF1ZXN0aW9uLnJlcXVpcmVkID0gcXVlc3Rpb24ucmVxdWlyZWQgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBxdWVzdGlvbi5yZXF1aXJlZDtcbiAgICAgIHF1ZXN0aW9uLmlkID0gcXVlc3Rpb24uaWQgfHwgYHF1ZXN0aW9uLSR7aW5kZXh9YDtcblxuICAgICAgbGV0IGN0b3I7XG5cbiAgICAgIHN3aXRjaCAocXVlc3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlICdyYWRpbyc6XG4gICAgICAgICAgY3RvciA9IFJhZGlvUmVuZGVyZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2NoZWNrYm94JzpcbiAgICAgICAgICBjdG9yID0gQ2hlY2tib3hSZW5kZXJlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmFuZ2UnOlxuICAgICAgICAgIGN0b3IgPSBSYW5nZVJlbmRlcmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICAgICAgcXVlc3Rpb24ucmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICBjdG9yID0gVGV4dEFyZWFSZW5kZXJlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBjdG9yKHRoaXMsIHF1ZXN0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9kaXNwbGF5TmV4dFF1ZXN0aW9uKCkge1xuICAgIC8vIGhhbmRsZSBjdXJyZW50IHF1ZXN0aW9uIGlmIGFueVxuICAgIGlmICh0aGlzLmN1cnJlbnRSZW5kZXJlcikge1xuICAgICAgY29uc3QgYW5zd2VyID0gdGhpcy5jdXJyZW50UmVuZGVyZXIuZ2V0QW5zd2VyKCk7XG4gICAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMuY3VycmVudFJlbmRlcmVyLnF1ZXN0aW9uLnJlcXVpcmVkO1xuXG4gICAgICBpZiAoYW5zd2VyID09PSBudWxsICYmIHJlcXVpcmVkKSB7IHJldHVybjsgfVxuXG4gICAgICB0aGlzLmN1cnJlbnRSZW5kZXJlci5kZXN0cm95KCk7XG4gICAgICB0aGlzLmFuc3dlcnNbdGhpcy5jdXJyZW50UmVuZGVyZXIuaWRdID0gYW5zd2VyO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudFJlbmRlcmVyID0gdGhpcy5yZW5kZXJlcnMuc2hpZnQoKTtcblxuICAgIGlmICh0aGlzLmN1cnJlbnRSZW5kZXJlcikge1xuICAgICAgLy8gdXBkYXRlIGNvdW50ZXJcbiAgICAgIHRoaXMucXVlc3Rpb25Db3VudGVyICs9IDE7XG4gICAgICB0aGlzLl9jdXJyZW50UXVlc3Rpb25Db3VudGVyLnRleHRDb250ZW50ID0gdGhpcy5xdWVzdGlvbkNvdW50ZXI7XG4gICAgICAvLyB1cGRhdGUgY29udGVudFxuICAgICAgY29uc3QgaHRtbENvbnRlbnQgPSB0aGlzLmN1cnJlbnRSZW5kZXJlci5yZW5kZXIodGhpcy52aWV3KTtcbiAgICAgIHRoaXMuc2V0Q2VudGVyZWRWaWV3Q29udGVudChodG1sQ29udGVudCk7XG4gICAgICB0aGlzLmN1cnJlbnRSZW5kZXJlci5iaW5kRXZlbnRzKCk7XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRSZW5kZXJlci5xdWVzdGlvbi5yZXF1aXJlZCkge1xuICAgICAgICB0aGlzLmRpc2FibGVCdG4oKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucmVuZGVyZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLl9uZXh0QnRuLnRleHRDb250ZW50ID0gdGhpcy5vcHRpb25zLmJ0blZhbGlkYXRlVGV4dDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcmVtb3ZlIGNvdW50ZXIgYW5kIG5leHQgYnV0dG9uc1xuICAgICAgdGhpcy52aWV3LnJlbW92ZUNoaWxkKHRoaXMuX2NvdW50ZXIpO1xuICAgICAgdGhpcy52aWV3LnJlbW92ZUNoaWxkKHRoaXMuX25leHRCdG4pO1xuICAgICAgLy8gZGlzcGxheSB0aGFua3NcbiAgICAgIHRoaXMuc2V0Q2VudGVyZWRWaWV3Q29udGVudCh0aGlzLm9wdGlvbnMudGhhbmtzQ29udGVudCk7XG4gICAgICAvLyBzZW5kIGluZm9ybWF0aW9ucyB0byBzZXJ2ZXJcbiAgICAgIHRoaXMuYW5zd2Vycy50aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHRoaXMuYW5zd2Vycy51c2VyQWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICAgICAgY2xpZW50LnNlbmQoYCR7dGhpcy5uYW1lfTphbnN3ZXJzYCwgSlNPTi5zdHJpbmdpZnkodGhpcy5hbnN3ZXJzKSk7XG4gICAgfVxuICB9XG5cbiAgZGlzYWJsZUJ0bigpIHtcbiAgICB0aGlzLl9uZXh0QnRuLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gIH1cblxuICBlbmFibGVCdG4oKSB7XG4gICAgdGhpcy5fbmV4dEJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpO1xuICB9XG59XG4iXX0=