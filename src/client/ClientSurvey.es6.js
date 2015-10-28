const ClientModule = require('./ClientModule');
const client = require('./client');


class BaseRenderer {
  constructor(survey, question) {
    this.survey = survey;
    this.question = question;
    this.label = question.label;
    this.id = question.id;
  }

  render() {  return ''; }

  destroy() {
    this._unbindEvents();
  }

  bindEvents() {}
  _unbindEvents() {}

  getAnswer() {}
}

// renderers
class AbstractSelectorRenderer extends BaseRenderer {
  constructor(survey, question) {
    super(survey, question);
    this.answers = question.answers;

    this._onSelect = this._onSelect.bind(this);
  }

  render(container, type) {
    this.container = container;

    let title = `<p class="label">${this.label}</p>`;
    let answers = '';

    for (let key in this.answers) {
      let value = this.answers[key];
      answers += `<p class="answer ${type}" data-key="${key}">${value}</p>`;
    }

    return `<div>${title}${answers}</div>`;
  }

  bindEvents() {
    this.answersEl = Array.from(this.container.querySelectorAll('.answer'));
    this.container.addEventListener('click', this._onSelect, false);
  }

  _unbindEvents() {
    this.container.removeEventListener('click', this._onSelect, false);
  }
}

class RadioRenderer extends AbstractSelectorRenderer {
  constructor(survey, question) {
    super(survey, question);
  }

  render(container) {
    return super.render(container, 'radio');
  }

  _onSelect(e) {
    const target = e.target;
    if (!target.classList.contains('answer')) { return; }

    this.answersEl.forEach((el) => { el.classList.remove('selected'); });
    target.classList.add('selected');

    this.survey.enableBtn();
  }

  getAnswer() {
    for (let i = 0; i < this.answersEl.length; i++) {
      let el = this.answersEl[i];
      if (el.classList.contains('selected')) {
        return el.getAttribute('data-key');
      }
    };

    return null;
  }
}

class CheckboxRenderer extends AbstractSelectorRenderer {
  constructor(survey, question) {
    super(survey, question);
  }

  render(container) {
    return super.render(container, 'checkbox');
  }

  _onSelect(e) {
    const target = e.target;
    if (!target.classList.contains('answer')) { return; }

    const method = target.classList.contains('selected') ? 'remove' : 'add';
    target.classList[method]('selected');

    this.survey.enableBtn();
  }

  getAnswer() {
    const answers = [];

    for (let i = 0; i < this.answersEl.length; i++) {
      let el = this.answersEl[i];
      if (el.classList.contains('selected')) {
        answers.push(el.getAttribute('data-key'));
      }
    };

    return answers.length === 0 ? null : answers;
  }
}

class RangeRenderer extends BaseRenderer {
  constructor(survey, question) {
    super(survey, question);
    this.label = question.label;
    this.min = question.min === undefined ? 0 : question.min;
    this.max = question.max === undefined ? 10 : question.max;
    this.step = question.step === undefined ? 1 : question.step;
    this.defaultValue = question.defaultValue === undefined ? 5 : question.defaultValue;

    this._onInput = this._onInput.bind(this);
  }

  render(container) {
    this.container = container;

    const label = document.createElement('p');
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

    const div = document.createElement('div');
    div.appendChild(label);
    div.appendChild(this._range);
    div.appendChild(this._number);

    return div;
  }

  bindEvents() {
    this._range.addEventListener('input', this._onInput, false);
  }

  _unbindEvents() {
    this._range.removeEventListener('input', this._onInput, false);
  }

  _onInput(e) {
    this._number.textContent = this._range.value;

    this.survey.enableBtn();
  }

  getAnswer() {
    return parseFloat(this._range.value);
  }
}

// is never required for now
class TextAreaRenderer extends BaseRenderer {
  constructor(survey, question) {
    super(survey, question);
    this.label = question.label;
  }

  render(container) {
    this._container = container;

    return `
      <p class="label">${this.label}</p>
      <textarea class="answer textarea"></textarea>
    `;
  }

  getAnswer() {
    const textarea = this._container.querySelector('.answer');
    return textarea.value;
  }
}

// module
class ClientSurvey extends ClientModule {
  constructor(surveyConfig, options = {}) {
    super(options.name || 'survey', true, options.color);

    if (options.thanks === undefined) {
      options.thanks = 'Thanks';
    }

    options.thanksContent = `<p class="thanks">${options.thanks}</p>`;
    options.btnNextText = options.btnNextText || 'next';
    options.btnValidateText = options.btnValidateText || 'validate';

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

  _render() {
    const counter = document.createElement('div');
    counter.classList.add('counter');
    counter.innerHTML = `<span></span> / ${this.survey.length}`;

    const nextBtn = document.createElement('button');
    nextBtn.classList.add('next', 'btn');
    nextBtn.textContent = this.options.btnNextText; // @TODO option

    this.view.appendChild(counter);
    this.view.appendChild(nextBtn);

    this._counter = counter;
    this._currentQuestionCounter = counter.querySelector('span');
    this._nextBtn = nextBtn;
  }

  _bindEvents() {
    this._nextBtn.addEventListener('click', this._displayNextQuestion, false);
  }

  _unbindEvents() {
    this._nextBtn.removeEventListener('click', this._displayNextQuestion, false);
  }

  _createRenderers() {
    this.renderers = this.survey.map((question, index) => {
      question.required = question.required === undefined ? true : question.required;
      question.id = question.id || `question-${index}`;

      let ctor;

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

      return new ctor(this, question);
    });
  }

  _displayNextQuestion() {
    // handle current question if any
    if (this.currentRenderer) {
      const answer = this.currentRenderer.getAnswer();
      const required = this.currentRenderer.question.required;

      if (answer === null && required) { return; }

      this.currentRenderer.destroy();
      this.answers[this.currentRenderer.id] = answer;
    }

    this.currentRenderer = this.renderers.shift();

    if (this.currentRenderer) {
      // update counter
      this.questionCounter += 1;
      this._currentQuestionCounter.textContent = this.questionCounter;
      // update content
      const htmlContent = this.currentRenderer.render(this.view);
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
      client.send(`${this.name}:answers`, JSON.stringify(this.answers));
    }
  }

  disableBtn() {
    this._nextBtn.classList.add('disabled');
  }

  enableBtn() {
    this._nextBtn.classList.remove('disabled');
  }
}

module.exports = ClientSurvey;
