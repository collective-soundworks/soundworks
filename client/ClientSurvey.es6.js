const ClientModule = require('./ClientModule');
const client = require('./client');

// renderers
class AbstractSelectorQuestion {
    constructor(label, answers) {
    this.label = label;
    this.answers = answers;

    this._onSelect = this._onSelect.bind(this);
  }

  render(container) {
    this.container = container;

    let title = `<p class="label">${this.label}</p>`;
    let answers = '';

    for (let key in this.answers) {
      let value = this.answers[key];
      answers += `<p class="answer ${this.type}" data-key="${key}">${value}</p>`;
    }

    return `<div>${title}${answers}</div>`;
  }

  destroy() {
    this.unbindEvents();
  }

  bindEvents() {
    this.answersEl = Array.from(this.container.querySelectorAll('.answer'));
    this.container.addEventListener('click', this._onSelect, false);
  }

  unbindEvents() {
    this.container.removeEventListener('click', this._onSelect, false);
  }
}

class RadioQuestion extends AbstractSelectorQuestion {
  constructor(label, answers) {
    super(label, answers);
    this.type = 'radio'
  }

  _onSelect(e) {
    const target = e.target;
    if (!target.classList.contains('answer')) { return; }

    this.answersEl.forEach((el) => { el.classList.remove('selected'); });
    target.classList.add('selected');
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

class CheckboxQuestion extends AbstractSelectorQuestion {
  constructor(label, answers) {
    super(label, answers);
    this.type = 'checkbox'
  }

  _onSelect(e) {
    const target = e.target;
    if (!target.classList.contains('answer')) { return; }

    const method = target.classList.contains('selected') ? 'remove' : 'add';
    target.classList[method]('selected');
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

class RangeQuestion {
  constructor(label, min = 0, max = 10, step = 1, defaultValue = 5) {
    this.label = label;
    this.min = min;
    this.max = max;
    this.step = step;
    this.defaultValue = defaultValue;

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
    this._number.classList.add('feedback');
    this._number.textContent = this.defaultValue;

    const div = document.createElement('div');
    div.appendChild(label);
    div.appendChild(this._range);
    div.appendChild(this._number);

    return div;
  }

  destroy() {
    this.unbindEvents();
  }

  bindEvents() {
    this._range.addEventListener('input', this._onInput, false);
  }

  unbindEvents() {
    this._range.removeEventListener('input', this._onInput, false);
  }

  _onInput(e) {
    this._number.textContent = this._range.value;
  }

  getAnswer() {
    return parseFloat(this._range.value);
  }
}

// module
class ClientSurvey extends ClientModule {
  constructor(surveyConfig, options = {}) {
    super(options.name || 'survey', true, options.color);

    if (surveyConfig.thanksContent === undefined) {
      surveyConfig.thanksContent = '<p class="thanks">Thanks</p>';
    }

    this.survey = surveyConfig;
    this.contents = [];
    this.answers = {};

    this.createRenderers();
    this.currentQuestionIndex = 0;
    this.render();

    this.displayNextQuestion = this.displayNextQuestion.bind(this);

    this.displayNextQuestion();
    this.bindEvents();
  }

  render() {
    const counter = document.createElement('div');
    counter.classList.add('counter');
    counter.innerHTML = `<span></span> / ${this.survey.length}`;

    const nextBtn = document.createElement('button');
    nextBtn.classList.add('next', 'btn');
    nextBtn.textContent = 'next';

    this.view.appendChild(counter);
    this.view.appendChild(nextBtn);

    this._counter = counter;
    this._currentQuestionCounter = counter.querySelector('span');
    this._nextBtn = nextBtn;
  }

  bindEvents() {
    this._nextBtn.addEventListener('click', this.displayNextQuestion, false);
  }

  createRenderers() {
    this.renderers = this.survey.map((q, index) => {
      let renderer;

      switch (q.type) {
        case 'radio':
          renderer = new RadioQuestion(q.label, q.answers);
          break;
        case 'checkbox':
          renderer = new CheckboxQuestion(q.label, q.answers);
          break;
        case 'range':
          renderer = new RangeQuestion(q.label, q.min, q.max, q.step, q.defaultValue);
          break;
      }

      renderer.id = q.id || `question-${index}`;
      return renderer;
    });
  }

  displayNextQuestion() {
    if (this.currentRenderer) {
      const answer = this.currentRenderer.getAnswer();
      if (answer === null) { return; }

      this.answers[this.currentRenderer.id] = answer;
      this.currentRenderer.destroy();
    }

    this.currentRenderer = this.renderers[this.currentQuestionIndex];
    if (this.currentRenderer) {
      // update counter
      this._currentQuestionCounter.textContent = this.currentQuestionIndex + 1;
      const htmlContent = this.currentRenderer.render(this.view);
      this.setCenteredViewContent(htmlContent);
      this.currentRenderer.bindEvents();

      this.currentQuestionIndex += 1;
    } else {
      // remove counter and next buttons
      this.view.removeChild(this._counter);
      this.view.removeChild(this._nextBtn);
      // display thanks
      this.setCenteredViewContent(this.survey.thanksContent);
      // send informations to server
      this.answers.timestamp = new Date().getTime();
      client.send(`${this.name}:answers`, JSON.stringify(this.answers));
      // this.done(); // when should we call this ?
    }
  }

  start() {
    super.start();
  }

  restart() {
    super.restart();
  }

  reset() {
    super.reset();
  }


}

module.exports = ClientSurvey;
