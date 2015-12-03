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

  return ClientSurvey;
})(_Module3['default']);

exports['default'] = ClientSurvey;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50U3VydmV5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7O0lBR3ZCLFlBQVk7QUFDTCxXQURQLFlBQVksQ0FDSixNQUFNLEVBQUUsUUFBUSxFQUFFOzBCQUQxQixZQUFZOztBQUVkLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUM1QixRQUFJLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUM7R0FDdkI7Ozs7ZUFORyxZQUFZOztXQVFWLGtCQUFHO0FBQUcsYUFBTyxFQUFFLENBQUM7S0FBRTs7O1dBRWpCLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0tBQ3RCOzs7V0FFUyxzQkFBRyxFQUFFOzs7V0FDRix5QkFBRyxFQUFFOzs7V0FFVCxxQkFBRyxFQUFFOzs7U0FqQlYsWUFBWTs7O0lBcUJaLHdCQUF3QjtZQUF4Qix3QkFBd0I7O0FBQ2pCLFdBRFAsd0JBQXdCLENBQ2hCLE1BQU0sRUFBRSxRQUFRLEVBQUU7MEJBRDFCLHdCQUF3Qjs7QUFFMUIsK0JBRkUsd0JBQXdCLDZDQUVwQixNQUFNLEVBQUUsUUFBUSxFQUFFO0FBQ3hCLFFBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQzs7QUFFaEMsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM1Qzs7ZUFORyx3QkFBd0I7O1dBUXRCLGdCQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUU7QUFDdEIsVUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7O0FBRTNCLFVBQUksS0FBSyx5QkFBdUIsSUFBSSxDQUFDLEtB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RUFBRTtBQUMvQixjQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQztTQUMxRDtPQUNGLE1BQU07O0FBRUwsWUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3JDLFlBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFckMsWUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRXhELFlBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDOUMsWUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQztBQUM3Qyw0QkFBTyxJQUFJLENBQUksSUFBSSxDQUFDLElBQUksZUFBWSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO09BQ25FO0tBQ0Y7OztXQUVTLHNCQUFHO0FBQ1gsVUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ3pDOzs7V0FFUSxxQkFBRztBQUNWLFVBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM1Qzs7O1NBaElrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudFN1cnZleS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuY2xhc3MgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3Ioc3VydmV5LCBxdWVzdGlvbikge1xuICAgIHRoaXMuc3VydmV5ID0gc3VydmV5O1xuICAgIHRoaXMucXVlc3Rpb24gPSBxdWVzdGlvbjtcbiAgICB0aGlzLmxhYmVsID0gcXVlc3Rpb24ubGFiZWw7XG4gICAgdGhpcy5pZCA9IHF1ZXN0aW9uLmlkO1xuICB9XG5cbiAgcmVuZGVyKCkgeyAgcmV0dXJuICcnOyB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl91bmJpbmRFdmVudHMoKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7fVxuICBfdW5iaW5kRXZlbnRzKCkge31cblxuICBnZXRBbnN3ZXIoKSB7fVxufVxuXG4vLyByZW5kZXJlcnNcbmNsYXNzIEFic3RyYWN0U2VsZWN0b3JSZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHN1cnZleSwgcXVlc3Rpb24pIHtcbiAgICBzdXBlcihzdXJ2ZXksIHF1ZXN0aW9uKTtcbiAgICB0aGlzLmFuc3dlcnMgPSBxdWVzdGlvbi5hbnN3ZXJzO1xuXG4gICAgdGhpcy5fb25TZWxlY3QgPSB0aGlzLl9vblNlbGVjdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgcmVuZGVyKGNvbnRhaW5lciwgdHlwZSkge1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuXG4gICAgbGV0IHRpdGxlID0gYDxwIGNsYXNzPVwibGFiZWxcIj4ke3RoaXMubGFiZWx9PC9wPmA7XG4gICAgbGV0IGFuc3dlcnMgPSAnJztcblxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmFuc3dlcnMpIHtcbiAgICAgIGxldCB2YWx1ZSA9IHRoaXMuYW5zd2Vyc1trZXldO1xuICAgICAgYW5zd2VycyArPSBgPHAgY2xhc3M9XCJhbnN3ZXIgJHt0eXBlfVwiIGRhdGEta2V5PVwiJHtrZXl9XCI+JHt2YWx1ZX08L3A+YDtcbiAgICB9XG5cbiAgICByZXR1cm4gYDxkaXY+JHt0aXRsZX0ke2Fuc3dlcnN9PC9kaXY+YDtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgdGhpcy5hbnN3ZXJzRWwgPSBBcnJheS5mcm9tKHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbnN3ZXInKSk7XG4gICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vblNlbGVjdCwgZmFsc2UpO1xuICB9XG5cbiAgX3VuYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uU2VsZWN0LCBmYWxzZSk7XG4gIH1cbn1cblxuY2xhc3MgUmFkaW9SZW5kZXJlciBleHRlbmRzIEFic3RyYWN0U2VsZWN0b3JSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHN1cnZleSwgcXVlc3Rpb24pIHtcbiAgICBzdXBlcihzdXJ2ZXksIHF1ZXN0aW9uKTtcbiAgfVxuXG4gIHJlbmRlcihjb250YWluZXIpIHtcbiAgICByZXR1cm4gc3VwZXIucmVuZGVyKGNvbnRhaW5lciwgJ3JhZGlvJyk7XG4gIH1cblxuICBfb25TZWxlY3QoZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xuICAgIGlmICghdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYW5zd2VyJykpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLmFuc3dlcnNFbC5mb3JFYWNoKChlbCkgPT4geyBlbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpOyB9KTtcbiAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcblxuICAgIHRoaXMuc3VydmV5LmVuYWJsZUJ0bigpO1xuICB9XG5cbiAgZ2V0QW5zd2VyKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hbnN3ZXJzRWwubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbCA9IHRoaXMuYW5zd2Vyc0VsW2ldO1xuICAgICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKSkge1xuICAgICAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWtleScpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5jbGFzcyBDaGVja2JveFJlbmRlcmVyIGV4dGVuZHMgQWJzdHJhY3RTZWxlY3RvclJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3Ioc3VydmV5LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHN1cnZleSwgcXVlc3Rpb24pO1xuICB9XG5cbiAgcmVuZGVyKGNvbnRhaW5lcikge1xuICAgIHJldHVybiBzdXBlci5yZW5kZXIoY29udGFpbmVyLCAnY2hlY2tib3gnKTtcbiAgfVxuXG4gIF9vblNlbGVjdChlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgaWYgKCF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhbnN3ZXInKSkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IG1ldGhvZCA9IHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJykgPyAncmVtb3ZlJyA6ICdhZGQnO1xuICAgIHRhcmdldC5jbGFzc0xpc3RbbWV0aG9kXSgnc2VsZWN0ZWQnKTtcblxuICAgIHRoaXMuc3VydmV5LmVuYWJsZUJ0bigpO1xuICB9XG5cbiAgZ2V0QW5zd2VyKCkge1xuICAgIGNvbnN0IGFuc3dlcnMgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hbnN3ZXJzRWwubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbCA9IHRoaXMuYW5zd2Vyc0VsW2ldO1xuICAgICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKSkge1xuICAgICAgICBhbnN3ZXJzLnB1c2goZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWtleScpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGFuc3dlcnMubGVuZ3RoID09PSAwID8gbnVsbCA6IGFuc3dlcnM7XG4gIH1cbn1cblxuY2xhc3MgUmFuZ2VSZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHN1cnZleSwgcXVlc3Rpb24pIHtcbiAgICBzdXBlcihzdXJ2ZXksIHF1ZXN0aW9uKTtcbiAgICB0aGlzLmxhYmVsID0gcXVlc3Rpb24ubGFiZWw7XG4gICAgdGhpcy5taW4gPSBxdWVzdGlvbi5taW4gPT09IHVuZGVmaW5lZCA/IDAgOiBxdWVzdGlvbi5taW47XG4gICAgdGhpcy5tYXggPSBxdWVzdGlvbi5tYXggPT09IHVuZGVmaW5lZCA/IDEwIDogcXVlc3Rpb24ubWF4O1xuICAgIHRoaXMuc3RlcCA9IHF1ZXN0aW9uLnN0ZXAgPT09IHVuZGVmaW5lZCA/IDEgOiBxdWVzdGlvbi5zdGVwO1xuICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gcXVlc3Rpb24uZGVmYXVsdFZhbHVlID09PSB1bmRlZmluZWQgPyA1IDogcXVlc3Rpb24uZGVmYXVsdFZhbHVlO1xuXG4gICAgdGhpcy5fb25JbnB1dCA9IHRoaXMuX29uSW5wdXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHJlbmRlcihjb250YWluZXIpIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcblxuICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGxhYmVsLmNsYXNzTGlzdC5hZGQoJ2xhYmVsJyk7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSB0aGlzLmxhYmVsO1xuXG4gICAgdGhpcy5fcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuX3JhbmdlLnNldEF0dHJpYnV0ZSgndHlwZScsICdyYW5nZScpO1xuICAgIHRoaXMuX3JhbmdlLnNldEF0dHJpYnV0ZSgnbWluJywgdGhpcy5taW4pO1xuICAgIHRoaXMuX3JhbmdlLnNldEF0dHJpYnV0ZSgnbWF4JywgdGhpcy5tYXgpO1xuICAgIHRoaXMuX3JhbmdlLnNldEF0dHJpYnV0ZSgnc3RlcCcsIHRoaXMuc3RlcCk7XG4gICAgdGhpcy5fcmFuZ2Uuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHRoaXMuZGVmYXVsdFZhbHVlKTtcbiAgICB0aGlzLl9yYW5nZS5jbGFzc0xpc3QuYWRkKCdzbGlkZXInLCAnYW5zd2VyJyk7XG5cbiAgICB0aGlzLl9udW1iZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdGhpcy5fbnVtYmVyLmNsYXNzTGlzdC5hZGQoJ3JhbmdlLWZlZWRiYWNrJyk7XG4gICAgdGhpcy5fbnVtYmVyLnRleHRDb250ZW50ID0gdGhpcy5kZWZhdWx0VmFsdWU7XG5cbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgIGRpdi5hcHBlbmRDaGlsZCh0aGlzLl9yYW5nZSk7XG4gICAgZGl2LmFwcGVuZENoaWxkKHRoaXMuX251bWJlcik7XG5cbiAgICByZXR1cm4gZGl2O1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLl9yYW5nZS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHRoaXMuX29uSW5wdXQsIGZhbHNlKTtcbiAgfVxuXG4gIF91bmJpbmRFdmVudHMoKSB7XG4gICAgdGhpcy5fcmFuZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLl9vbklucHV0LCBmYWxzZSk7XG4gIH1cblxuICBfb25JbnB1dChlKSB7XG4gICAgdGhpcy5fbnVtYmVyLnRleHRDb250ZW50ID0gdGhpcy5fcmFuZ2UudmFsdWU7XG5cbiAgICB0aGlzLnN1cnZleS5lbmFibGVCdG4oKTtcbiAgfVxuXG4gIGdldEFuc3dlcigpIHtcbiAgICByZXR1cm4gcGFyc2VGbG9hdCh0aGlzLl9yYW5nZS52YWx1ZSk7XG4gIH1cbn1cblxuLy8gaXMgbmV2ZXIgcmVxdWlyZWQgZm9yIG5vd1xuY2xhc3MgVGV4dEFyZWFSZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHN1cnZleSwgcXVlc3Rpb24pIHtcbiAgICBzdXBlcihzdXJ2ZXksIHF1ZXN0aW9uKTtcbiAgICB0aGlzLmxhYmVsID0gcXVlc3Rpb24ubGFiZWw7XG4gIH1cblxuICByZW5kZXIoY29udGFpbmVyKSB7XG4gICAgdGhpcy5fY29udGFpbmVyID0gY29udGFpbmVyO1xuXG4gICAgcmV0dXJuIGBcbiAgICAgIDxwIGNsYXNzPVwibGFiZWxcIj4ke3RoaXMubGFiZWx9PC9wPlxuICAgICAgPHRleHRhcmVhIGNsYXNzPVwiYW5zd2VyIHRleHRhcmVhXCI+PC90ZXh0YXJlYT5cbiAgICBgO1xuICB9XG5cbiAgZ2V0QW5zd2VyKCkge1xuICAgIGNvbnN0IHRleHRhcmVhID0gdGhpcy5fY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5hbnN3ZXInKTtcbiAgICByZXR1cm4gdGV4dGFyZWEudmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRTdXJ2ZXkgZXh0ZW5kcyBNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihzdXJ2ZXlDb25maWcsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnc3VydmV5JywgdHJ1ZSwgb3B0aW9ucy5jb2xvcik7XG5cbiAgICBpZiAob3B0aW9ucy50aGFua3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3B0aW9ucy50aGFua3MgPSAnVGhhbmtzJztcbiAgICB9XG5cbiAgICBvcHRpb25zLnRoYW5rc0NvbnRlbnQgPSBgPHAgY2xhc3M9XCJ0aGFua3NcIj4ke29wdGlvbnMudGhhbmtzfTwvcD5gO1xuICAgIG9wdGlvbnMuYnRuTmV4dFRleHQgPSBvcHRpb25zLmJ0bk5leHRUZXh0IHx8wqAnbmV4dCc7XG4gICAgb3B0aW9ucy5idG5WYWxpZGF0ZVRleHQgPSBvcHRpb25zLmJ0blZhbGlkYXRlVGV4dCB8fMKgJ3ZhbGlkYXRlJztcblxuICAgIHRoaXMuc3VydmV5ID0gc3VydmV5Q29uZmlnO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5jb250ZW50cyA9IFtdO1xuICAgIHRoaXMuYW5zd2VycyA9IHt9O1xuICAgIHRoaXMucXVlc3Rpb25Db3VudGVyID0gMDtcblxuICAgIHRoaXMuX2NyZWF0ZVJlbmRlcmVycygpO1xuICAgIHRoaXMuX3JlbmRlcigpO1xuXG4gICAgdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbiA9IHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24uYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24oKTtcbiAgICB0aGlzLl9iaW5kRXZlbnRzKCk7XG4gIH1cblxuICBfcmVuZGVyKCkge1xuICAgIGNvbnN0IGNvdW50ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb3VudGVyLmNsYXNzTGlzdC5hZGQoJ2NvdW50ZXInKTtcbiAgICBjb3VudGVyLmlubmVySFRNTCA9IGA8c3Bhbj48L3NwYW4+IC8gJHt0aGlzLnN1cnZleS5sZW5ndGh9YDtcblxuICAgIGNvbnN0IG5leHRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBuZXh0QnRuLmNsYXNzTGlzdC5hZGQoJ25leHQnLCAnYnRuJyk7XG4gICAgbmV4dEJ0bi50ZXh0Q29udGVudCA9IHRoaXMub3B0aW9ucy5idG5OZXh0VGV4dDsgLy8gQFRPRE8gb3B0aW9uXG5cbiAgICB0aGlzLnZpZXcuYXBwZW5kQ2hpbGQoY291bnRlcik7XG4gICAgdGhpcy52aWV3LmFwcGVuZENoaWxkKG5leHRCdG4pO1xuXG4gICAgdGhpcy5fY291bnRlciA9IGNvdW50ZXI7XG4gICAgdGhpcy5fY3VycmVudFF1ZXN0aW9uQ291bnRlciA9IGNvdW50ZXIucXVlcnlTZWxlY3Rvcignc3BhbicpO1xuICAgIHRoaXMuX25leHRCdG4gPSBuZXh0QnRuO1xuICB9XG5cbiAgX2JpbmRFdmVudHMoKSB7XG4gICAgdGhpcy5fbmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24sIGZhbHNlKTtcbiAgfVxuXG4gIF91bmJpbmRFdmVudHMoKSB7XG4gICAgdGhpcy5fbmV4dEJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24sIGZhbHNlKTtcbiAgfVxuXG4gIF9jcmVhdGVSZW5kZXJlcnMoKSB7XG4gICAgdGhpcy5yZW5kZXJlcnMgPSB0aGlzLnN1cnZleS5tYXAoKHF1ZXN0aW9uLCBpbmRleCkgPT4ge1xuICAgICAgcXVlc3Rpb24ucmVxdWlyZWQgPSBxdWVzdGlvbi5yZXF1aXJlZCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHF1ZXN0aW9uLnJlcXVpcmVkO1xuICAgICAgcXVlc3Rpb24uaWQgPSBxdWVzdGlvbi5pZCB8fCBgcXVlc3Rpb24tJHtpbmRleH1gO1xuXG4gICAgICBsZXQgY3RvcjtcblxuICAgICAgc3dpdGNoIChxdWVzdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgJ3JhZGlvJzpcbiAgICAgICAgICBjdG9yID0gUmFkaW9SZW5kZXJlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICAgIGN0b3IgPSBDaGVja2JveFJlbmRlcmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyYW5nZSc6XG4gICAgICAgICAgY3RvciA9IFJhbmdlUmVuZGVyZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgICAgICBxdWVzdGlvbi5yZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICAgIGN0b3IgPSBUZXh0QXJlYVJlbmRlcmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IGN0b3IodGhpcywgcXVlc3Rpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgX2Rpc3BsYXlOZXh0UXVlc3Rpb24oKSB7XG4gICAgLy8gaGFuZGxlIGN1cnJlbnQgcXVlc3Rpb24gaWYgYW55XG4gICAgaWYgKHRoaXMuY3VycmVudFJlbmRlcmVyKSB7XG4gICAgICBjb25zdCBhbnN3ZXIgPSB0aGlzLmN1cnJlbnRSZW5kZXJlci5nZXRBbnN3ZXIoKTtcbiAgICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5jdXJyZW50UmVuZGVyZXIucXVlc3Rpb24ucmVxdWlyZWQ7XG5cbiAgICAgIGlmIChhbnN3ZXIgPT09IG51bGwgJiYgcmVxdWlyZWQpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHRoaXMuY3VycmVudFJlbmRlcmVyLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuYW5zd2Vyc1t0aGlzLmN1cnJlbnRSZW5kZXJlci5pZF0gPSBhbnN3ZXI7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50UmVuZGVyZXIgPSB0aGlzLnJlbmRlcmVycy5zaGlmdCgpO1xuXG4gICAgaWYgKHRoaXMuY3VycmVudFJlbmRlcmVyKSB7XG4gICAgICAvLyB1cGRhdGUgY291bnRlclxuICAgICAgdGhpcy5xdWVzdGlvbkNvdW50ZXIgKz0gMTtcbiAgICAgIHRoaXMuX2N1cnJlbnRRdWVzdGlvbkNvdW50ZXIudGV4dENvbnRlbnQgPSB0aGlzLnF1ZXN0aW9uQ291bnRlcjtcbiAgICAgIC8vIHVwZGF0ZSBjb250ZW50XG4gICAgICBjb25zdCBodG1sQ29udGVudCA9IHRoaXMuY3VycmVudFJlbmRlcmVyLnJlbmRlcih0aGlzLnZpZXcpO1xuICAgICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KGh0bWxDb250ZW50KTtcbiAgICAgIHRoaXMuY3VycmVudFJlbmRlcmVyLmJpbmRFdmVudHMoKTtcblxuICAgICAgaWYgKHRoaXMuY3VycmVudFJlbmRlcmVyLnF1ZXN0aW9uLnJlcXVpcmVkKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZUJ0bigpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5yZW5kZXJlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuX25leHRCdG4udGV4dENvbnRlbnQgPSB0aGlzLm9wdGlvbnMuYnRuVmFsaWRhdGVUZXh0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyByZW1vdmUgY291bnRlciBhbmQgbmV4dCBidXR0b25zXG4gICAgICB0aGlzLnZpZXcucmVtb3ZlQ2hpbGQodGhpcy5fY291bnRlcik7XG4gICAgICB0aGlzLnZpZXcucmVtb3ZlQ2hpbGQodGhpcy5fbmV4dEJ0bik7XG4gICAgICAvLyBkaXNwbGF5IHRoYW5rc1xuICAgICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KHRoaXMub3B0aW9ucy50aGFua3NDb250ZW50KTtcbiAgICAgIC8vIHNlbmQgaW5mb3JtYXRpb25zIHRvIHNlcnZlclxuICAgICAgdGhpcy5hbnN3ZXJzLnRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgdGhpcy5hbnN3ZXJzLnVzZXJBZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgICBjbGllbnQuc2VuZChgJHt0aGlzLm5hbWV9OmFuc3dlcnNgLCBKU09OLnN0cmluZ2lmeSh0aGlzLmFuc3dlcnMpKTtcbiAgICB9XG4gIH1cblxuICBkaXNhYmxlQnRuKCkge1xuICAgIHRoaXMuX25leHRCdG4uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgfVxuXG4gIGVuYWJsZUJ0bigpIHtcbiAgICB0aGlzLl9uZXh0QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gIH1cbn1cbiJdfQ==