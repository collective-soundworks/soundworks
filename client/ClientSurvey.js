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

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

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

var ClientSurvey = (function (_ClientModule) {
  _inherits(ClientSurvey, _ClientModule);

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
})(_ClientModule3['default']);

exports['default'] = ClientSurvey;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBQXlCLGdCQUFnQjs7OztJQUduQyxZQUFZO0FBQ0wsV0FEUCxZQUFZLENBQ0osTUFBTSxFQUFFLFFBQVEsRUFBRTswQkFEMUIsWUFBWTs7QUFFZCxRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QixRQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDNUIsUUFBSSxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO0dBQ3ZCOzs7O2VBTkcsWUFBWTs7V0FRVixrQkFBRztBQUFHLGFBQU8sRUFBRSxDQUFDO0tBQUU7OztXQUVqQixtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztLQUN0Qjs7O1dBRVMsc0JBQUcsRUFBRTs7O1dBQ0YseUJBQUcsRUFBRTs7O1dBRVQscUJBQUcsRUFBRTs7O1NBakJWLFlBQVk7OztJQXFCWix3QkFBd0I7WUFBeEIsd0JBQXdCOztBQUNqQixXQURQLHdCQUF3QixDQUNoQixNQUFNLEVBQUUsUUFBUSxFQUFFOzBCQUQxQix3QkFBd0I7O0FBRTFCLCtCQUZFLHdCQUF3Qiw2Q0FFcEIsTUFBTSxFQUFFLFFBQVEsRUFBRTtBQUN4QixRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7O0FBRWhDLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDNUM7O2VBTkcsd0JBQXdCOztXQVF0QixnQkFBQyxTQUFTLEVBQUUsSUFBSSxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDOztBQUUzQixVQUFJLEtBQUsseUJBQXVCLElBQUksQ0FBQyxLQUFLLFNBQU0sQ0FB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Y0FBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7U0FDMUQ7T0FDRixNQUFNOztBQUVMLFlBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyQyxZQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXJDLFlBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUV4RCxZQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzlDLFlBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUM7QUFDN0MsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztPQUNwRDtLQUNGOzs7V0FFUyxzQkFBRztBQUNYLFVBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUN6Qzs7O1dBRVEscUJBQUc7QUFDVixVQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDNUM7OztTQWhJa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRDaGVja2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5cblxuY2xhc3MgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3Ioc3VydmV5LCBxdWVzdGlvbikge1xuICAgIHRoaXMuc3VydmV5ID0gc3VydmV5O1xuICAgIHRoaXMucXVlc3Rpb24gPSBxdWVzdGlvbjtcbiAgICB0aGlzLmxhYmVsID0gcXVlc3Rpb24ubGFiZWw7XG4gICAgdGhpcy5pZCA9IHF1ZXN0aW9uLmlkO1xuICB9XG5cbiAgcmVuZGVyKCkgeyAgcmV0dXJuICcnOyB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl91bmJpbmRFdmVudHMoKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7fVxuICBfdW5iaW5kRXZlbnRzKCkge31cblxuICBnZXRBbnN3ZXIoKSB7fVxufVxuXG4vLyByZW5kZXJlcnNcbmNsYXNzIEFic3RyYWN0U2VsZWN0b3JSZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHN1cnZleSwgcXVlc3Rpb24pIHtcbiAgICBzdXBlcihzdXJ2ZXksIHF1ZXN0aW9uKTtcbiAgICB0aGlzLmFuc3dlcnMgPSBxdWVzdGlvbi5hbnN3ZXJzO1xuXG4gICAgdGhpcy5fb25TZWxlY3QgPSB0aGlzLl9vblNlbGVjdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgcmVuZGVyKGNvbnRhaW5lciwgdHlwZSkge1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuXG4gICAgbGV0IHRpdGxlID0gYDxwIGNsYXNzPVwibGFiZWxcIj4ke3RoaXMubGFiZWx9PC9wPmA7XG4gICAgbGV0IGFuc3dlcnMgPSAnJztcblxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmFuc3dlcnMpIHtcbiAgICAgIGxldCB2YWx1ZSA9IHRoaXMuYW5zd2Vyc1trZXldO1xuICAgICAgYW5zd2VycyArPSBgPHAgY2xhc3M9XCJhbnN3ZXIgJHt0eXBlfVwiIGRhdGEta2V5PVwiJHtrZXl9XCI+JHt2YWx1ZX08L3A+YDtcbiAgICB9XG5cbiAgICByZXR1cm4gYDxkaXY+JHt0aXRsZX0ke2Fuc3dlcnN9PC9kaXY+YDtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgdGhpcy5hbnN3ZXJzRWwgPSBBcnJheS5mcm9tKHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbnN3ZXInKSk7XG4gICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vblNlbGVjdCwgZmFsc2UpO1xuICB9XG5cbiAgX3VuYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uU2VsZWN0LCBmYWxzZSk7XG4gIH1cbn1cblxuY2xhc3MgUmFkaW9SZW5kZXJlciBleHRlbmRzIEFic3RyYWN0U2VsZWN0b3JSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHN1cnZleSwgcXVlc3Rpb24pIHtcbiAgICBzdXBlcihzdXJ2ZXksIHF1ZXN0aW9uKTtcbiAgfVxuXG4gIHJlbmRlcihjb250YWluZXIpIHtcbiAgICByZXR1cm4gc3VwZXIucmVuZGVyKGNvbnRhaW5lciwgJ3JhZGlvJyk7XG4gIH1cblxuICBfb25TZWxlY3QoZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xuICAgIGlmICghdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYW5zd2VyJykpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLmFuc3dlcnNFbC5mb3JFYWNoKChlbCkgPT4geyBlbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpOyB9KTtcbiAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcblxuICAgIHRoaXMuc3VydmV5LmVuYWJsZUJ0bigpO1xuICB9XG5cbiAgZ2V0QW5zd2VyKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hbnN3ZXJzRWwubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbCA9IHRoaXMuYW5zd2Vyc0VsW2ldO1xuICAgICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKSkge1xuICAgICAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWtleScpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5jbGFzcyBDaGVja2JveFJlbmRlcmVyIGV4dGVuZHMgQWJzdHJhY3RTZWxlY3RvclJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3Ioc3VydmV5LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHN1cnZleSwgcXVlc3Rpb24pO1xuICB9XG5cbiAgcmVuZGVyKGNvbnRhaW5lcikge1xuICAgIHJldHVybiBzdXBlci5yZW5kZXIoY29udGFpbmVyLCAnY2hlY2tib3gnKTtcbiAgfVxuXG4gIF9vblNlbGVjdChlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgaWYgKCF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhbnN3ZXInKSkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IG1ldGhvZCA9IHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJykgPyAncmVtb3ZlJyA6ICdhZGQnO1xuICAgIHRhcmdldC5jbGFzc0xpc3RbbWV0aG9kXSgnc2VsZWN0ZWQnKTtcblxuICAgIHRoaXMuc3VydmV5LmVuYWJsZUJ0bigpO1xuICB9XG5cbiAgZ2V0QW5zd2VyKCkge1xuICAgIGNvbnN0IGFuc3dlcnMgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hbnN3ZXJzRWwubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbCA9IHRoaXMuYW5zd2Vyc0VsW2ldO1xuICAgICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKSkge1xuICAgICAgICBhbnN3ZXJzLnB1c2goZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWtleScpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGFuc3dlcnMubGVuZ3RoID09PSAwID8gbnVsbCA6IGFuc3dlcnM7XG4gIH1cbn1cblxuY2xhc3MgUmFuZ2VSZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHN1cnZleSwgcXVlc3Rpb24pIHtcbiAgICBzdXBlcihzdXJ2ZXksIHF1ZXN0aW9uKTtcbiAgICB0aGlzLmxhYmVsID0gcXVlc3Rpb24ubGFiZWw7XG4gICAgdGhpcy5taW4gPSBxdWVzdGlvbi5taW4gPT09IHVuZGVmaW5lZCA/IDAgOiBxdWVzdGlvbi5taW47XG4gICAgdGhpcy5tYXggPSBxdWVzdGlvbi5tYXggPT09IHVuZGVmaW5lZCA/IDEwIDogcXVlc3Rpb24ubWF4O1xuICAgIHRoaXMuc3RlcCA9IHF1ZXN0aW9uLnN0ZXAgPT09IHVuZGVmaW5lZCA/IDEgOiBxdWVzdGlvbi5zdGVwO1xuICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gcXVlc3Rpb24uZGVmYXVsdFZhbHVlID09PSB1bmRlZmluZWQgPyA1IDogcXVlc3Rpb24uZGVmYXVsdFZhbHVlO1xuXG4gICAgdGhpcy5fb25JbnB1dCA9IHRoaXMuX29uSW5wdXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHJlbmRlcihjb250YWluZXIpIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcblxuICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGxhYmVsLmNsYXNzTGlzdC5hZGQoJ2xhYmVsJyk7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSB0aGlzLmxhYmVsO1xuXG4gICAgdGhpcy5fcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuX3JhbmdlLnNldEF0dHJpYnV0ZSgndHlwZScsICdyYW5nZScpO1xuICAgIHRoaXMuX3JhbmdlLnNldEF0dHJpYnV0ZSgnbWluJywgdGhpcy5taW4pO1xuICAgIHRoaXMuX3JhbmdlLnNldEF0dHJpYnV0ZSgnbWF4JywgdGhpcy5tYXgpO1xuICAgIHRoaXMuX3JhbmdlLnNldEF0dHJpYnV0ZSgnc3RlcCcsIHRoaXMuc3RlcCk7XG4gICAgdGhpcy5fcmFuZ2Uuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHRoaXMuZGVmYXVsdFZhbHVlKTtcbiAgICB0aGlzLl9yYW5nZS5jbGFzc0xpc3QuYWRkKCdzbGlkZXInLCAnYW5zd2VyJyk7XG5cbiAgICB0aGlzLl9udW1iZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdGhpcy5fbnVtYmVyLmNsYXNzTGlzdC5hZGQoJ3JhbmdlLWZlZWRiYWNrJyk7XG4gICAgdGhpcy5fbnVtYmVyLnRleHRDb250ZW50ID0gdGhpcy5kZWZhdWx0VmFsdWU7XG5cbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgIGRpdi5hcHBlbmRDaGlsZCh0aGlzLl9yYW5nZSk7XG4gICAgZGl2LmFwcGVuZENoaWxkKHRoaXMuX251bWJlcik7XG5cbiAgICByZXR1cm4gZGl2O1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLl9yYW5nZS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHRoaXMuX29uSW5wdXQsIGZhbHNlKTtcbiAgfVxuXG4gIF91bmJpbmRFdmVudHMoKSB7XG4gICAgdGhpcy5fcmFuZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLl9vbklucHV0LCBmYWxzZSk7XG4gIH1cblxuICBfb25JbnB1dChlKSB7XG4gICAgdGhpcy5fbnVtYmVyLnRleHRDb250ZW50ID0gdGhpcy5fcmFuZ2UudmFsdWU7XG5cbiAgICB0aGlzLnN1cnZleS5lbmFibGVCdG4oKTtcbiAgfVxuXG4gIGdldEFuc3dlcigpIHtcbiAgICByZXR1cm4gcGFyc2VGbG9hdCh0aGlzLl9yYW5nZS52YWx1ZSk7XG4gIH1cbn1cblxuLy8gaXMgbmV2ZXIgcmVxdWlyZWQgZm9yIG5vd1xuY2xhc3MgVGV4dEFyZWFSZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHN1cnZleSwgcXVlc3Rpb24pIHtcbiAgICBzdXBlcihzdXJ2ZXksIHF1ZXN0aW9uKTtcbiAgICB0aGlzLmxhYmVsID0gcXVlc3Rpb24ubGFiZWw7XG4gIH1cblxuICByZW5kZXIoY29udGFpbmVyKSB7XG4gICAgdGhpcy5fY29udGFpbmVyID0gY29udGFpbmVyO1xuXG4gICAgcmV0dXJuIGBcbiAgICAgIDxwIGNsYXNzPVwibGFiZWxcIj4ke3RoaXMubGFiZWx9PC9wPlxuICAgICAgPHRleHRhcmVhIGNsYXNzPVwiYW5zd2VyIHRleHRhcmVhXCI+PC90ZXh0YXJlYT5cbiAgICBgO1xuICB9XG5cbiAgZ2V0QW5zd2VyKCkge1xuICAgIGNvbnN0IHRleHRhcmVhID0gdGhpcy5fY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5hbnN3ZXInKTtcbiAgICByZXR1cm4gdGV4dGFyZWEudmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRTdXJ2ZXkgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihzdXJ2ZXlDb25maWcsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnc3VydmV5JywgdHJ1ZSwgb3B0aW9ucy5jb2xvcik7XG5cbiAgICBpZiAob3B0aW9ucy50aGFua3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3B0aW9ucy50aGFua3MgPSAnVGhhbmtzJztcbiAgICB9XG5cbiAgICBvcHRpb25zLnRoYW5rc0NvbnRlbnQgPSBgPHAgY2xhc3M9XCJ0aGFua3NcIj4ke29wdGlvbnMudGhhbmtzfTwvcD5gO1xuICAgIG9wdGlvbnMuYnRuTmV4dFRleHQgPSBvcHRpb25zLmJ0bk5leHRUZXh0IHx8wqAnbmV4dCc7XG4gICAgb3B0aW9ucy5idG5WYWxpZGF0ZVRleHQgPSBvcHRpb25zLmJ0blZhbGlkYXRlVGV4dCB8fMKgJ3ZhbGlkYXRlJztcblxuICAgIHRoaXMuc3VydmV5ID0gc3VydmV5Q29uZmlnO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5jb250ZW50cyA9IFtdO1xuICAgIHRoaXMuYW5zd2VycyA9IHt9O1xuICAgIHRoaXMucXVlc3Rpb25Db3VudGVyID0gMDtcblxuICAgIHRoaXMuX2NyZWF0ZVJlbmRlcmVycygpO1xuICAgIHRoaXMuX3JlbmRlcigpO1xuXG4gICAgdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbiA9IHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24uYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24oKTtcbiAgICB0aGlzLl9iaW5kRXZlbnRzKCk7XG4gIH1cblxuICBfcmVuZGVyKCkge1xuICAgIGNvbnN0IGNvdW50ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb3VudGVyLmNsYXNzTGlzdC5hZGQoJ2NvdW50ZXInKTtcbiAgICBjb3VudGVyLmlubmVySFRNTCA9IGA8c3Bhbj48L3NwYW4+IC8gJHt0aGlzLnN1cnZleS5sZW5ndGh9YDtcblxuICAgIGNvbnN0IG5leHRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBuZXh0QnRuLmNsYXNzTGlzdC5hZGQoJ25leHQnLCAnYnRuJyk7XG4gICAgbmV4dEJ0bi50ZXh0Q29udGVudCA9IHRoaXMub3B0aW9ucy5idG5OZXh0VGV4dDsgLy8gQFRPRE8gb3B0aW9uXG5cbiAgICB0aGlzLnZpZXcuYXBwZW5kQ2hpbGQoY291bnRlcik7XG4gICAgdGhpcy52aWV3LmFwcGVuZENoaWxkKG5leHRCdG4pO1xuXG4gICAgdGhpcy5fY291bnRlciA9IGNvdW50ZXI7XG4gICAgdGhpcy5fY3VycmVudFF1ZXN0aW9uQ291bnRlciA9IGNvdW50ZXIucXVlcnlTZWxlY3Rvcignc3BhbicpO1xuICAgIHRoaXMuX25leHRCdG4gPSBuZXh0QnRuO1xuICB9XG5cbiAgX2JpbmRFdmVudHMoKSB7XG4gICAgdGhpcy5fbmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24sIGZhbHNlKTtcbiAgfVxuXG4gIF91bmJpbmRFdmVudHMoKSB7XG4gICAgdGhpcy5fbmV4dEJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24sIGZhbHNlKTtcbiAgfVxuXG4gIF9jcmVhdGVSZW5kZXJlcnMoKSB7XG4gICAgdGhpcy5yZW5kZXJlcnMgPSB0aGlzLnN1cnZleS5tYXAoKHF1ZXN0aW9uLCBpbmRleCkgPT4ge1xuICAgICAgcXVlc3Rpb24ucmVxdWlyZWQgPSBxdWVzdGlvbi5yZXF1aXJlZCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHF1ZXN0aW9uLnJlcXVpcmVkO1xuICAgICAgcXVlc3Rpb24uaWQgPSBxdWVzdGlvbi5pZCB8fCBgcXVlc3Rpb24tJHtpbmRleH1gO1xuXG4gICAgICBsZXQgY3RvcjtcblxuICAgICAgc3dpdGNoIChxdWVzdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgJ3JhZGlvJzpcbiAgICAgICAgICBjdG9yID0gUmFkaW9SZW5kZXJlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICAgIGN0b3IgPSBDaGVja2JveFJlbmRlcmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyYW5nZSc6XG4gICAgICAgICAgY3RvciA9IFJhbmdlUmVuZGVyZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgICAgICBxdWVzdGlvbi5yZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICAgIGN0b3IgPSBUZXh0QXJlYVJlbmRlcmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IGN0b3IodGhpcywgcXVlc3Rpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgX2Rpc3BsYXlOZXh0UXVlc3Rpb24oKSB7XG4gICAgLy8gaGFuZGxlIGN1cnJlbnQgcXVlc3Rpb24gaWYgYW55XG4gICAgaWYgKHRoaXMuY3VycmVudFJlbmRlcmVyKSB7XG4gICAgICBjb25zdCBhbnN3ZXIgPSB0aGlzLmN1cnJlbnRSZW5kZXJlci5nZXRBbnN3ZXIoKTtcbiAgICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5jdXJyZW50UmVuZGVyZXIucXVlc3Rpb24ucmVxdWlyZWQ7XG5cbiAgICAgIGlmIChhbnN3ZXIgPT09IG51bGwgJiYgcmVxdWlyZWQpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHRoaXMuY3VycmVudFJlbmRlcmVyLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuYW5zd2Vyc1t0aGlzLmN1cnJlbnRSZW5kZXJlci5pZF0gPSBhbnN3ZXI7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50UmVuZGVyZXIgPSB0aGlzLnJlbmRlcmVycy5zaGlmdCgpO1xuXG4gICAgaWYgKHRoaXMuY3VycmVudFJlbmRlcmVyKSB7XG4gICAgICAvLyB1cGRhdGUgY291bnRlclxuICAgICAgdGhpcy5xdWVzdGlvbkNvdW50ZXIgKz0gMTtcbiAgICAgIHRoaXMuX2N1cnJlbnRRdWVzdGlvbkNvdW50ZXIudGV4dENvbnRlbnQgPSB0aGlzLnF1ZXN0aW9uQ291bnRlcjtcbiAgICAgIC8vIHVwZGF0ZSBjb250ZW50XG4gICAgICBjb25zdCBodG1sQ29udGVudCA9IHRoaXMuY3VycmVudFJlbmRlcmVyLnJlbmRlcih0aGlzLnZpZXcpO1xuICAgICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KGh0bWxDb250ZW50KTtcbiAgICAgIHRoaXMuY3VycmVudFJlbmRlcmVyLmJpbmRFdmVudHMoKTtcblxuICAgICAgaWYgKHRoaXMuY3VycmVudFJlbmRlcmVyLnF1ZXN0aW9uLnJlcXVpcmVkKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZUJ0bigpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5yZW5kZXJlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuX25leHRCdG4udGV4dENvbnRlbnQgPSB0aGlzLm9wdGlvbnMuYnRuVmFsaWRhdGVUZXh0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyByZW1vdmUgY291bnRlciBhbmQgbmV4dCBidXR0b25zXG4gICAgICB0aGlzLnZpZXcucmVtb3ZlQ2hpbGQodGhpcy5fY291bnRlcik7XG4gICAgICB0aGlzLnZpZXcucmVtb3ZlQ2hpbGQodGhpcy5fbmV4dEJ0bik7XG4gICAgICAvLyBkaXNwbGF5IHRoYW5rc1xuICAgICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KHRoaXMub3B0aW9ucy50aGFua3NDb250ZW50KTtcbiAgICAgIC8vIHNlbmQgaW5mb3JtYXRpb25zIHRvIHNlcnZlclxuICAgICAgdGhpcy5hbnN3ZXJzLnRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgdGhpcy5hbnN3ZXJzLnVzZXJBZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgICB0aGlzLnNlbmQoJ2Fuc3dlcnMnLCBKU09OLnN0cmluZ2lmeSh0aGlzLmFuc3dlcnMpKTtcbiAgICB9XG4gIH1cblxuICBkaXNhYmxlQnRuKCkge1xuICAgIHRoaXMuX25leHRCdG4uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgfVxuXG4gIGVuYWJsZUJ0bigpIHtcbiAgICB0aGlzLl9uZXh0QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gIH1cbn1cbiJdfQ==