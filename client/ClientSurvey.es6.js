const ClientModule = require('./ClientModule');
const client = require('./client');

class RadioQuestion {
  constructor(label, answers) {
    this.label = label;
    this.answers = answers;

    this._onSelect = this._onSelect.bind(this);
  }

  render() {
    let title = `<p class="question">${this.label}</p>`;
    let answers = '';

    for (let key in this.answers) {
      let value = this.answers[key];
      answers += `<p class="answer" data-key="${key}">${value}</p>`;
    }

    return `<div>${title}${answers}</div>`;
  }

  destroy() {
    // unbind events
    this.unbindEvents();
  }

  bindEvents(container) {
    this.answersEl = Array.from(container.querySelectorAll('.answer'));
    container.addEventListener('click', this._onSelect, false);
  }

  unbindEvents() {
    container.removeEventListener('click', this._onSelect, false);
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

class ClientSurvey extends ClientModule {
  constructor(surveyConfig, options = {}) {
    super(options.name || 'survey', true, options.color);

    if (surveyConfig.thanksContent === undefined) {
      surveyConfig.thanksContent = '<p class="thanks">Thanks</p>';
    }

    this.survey = surveyConfig;
    this.contents = [];
    this.answers = [];

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
    this.renderers = this.survey.map((question) => {
      let renderer;

      switch (question.type) {
        case 'radio':
          renderer = new RadioQuestion(question.label, question.answers);
          break;
        case 'checkbox':

          break;
        case 'slider':

          break;
      }

      return renderer;
    });
  }

  displayNextQuestion() {
    if (this.currentRenderer) {
      const answer = this.currentRenderer.getAnswer();
      if (answer === null) { return; }

      this.answers.push(answer);
      console.log(this.answers);
      this.currentRenderer.destroy();
    }

    this.currentRenderer = this.renderers[this.currentQuestionIndex];
    if (this.currentRenderer) {
      // update counter
      this._currentQuestionCounter.textContent = this.currentQuestionIndex + 1;
      const htmlContent = this.currentRenderer.render();
      this.setCenteredViewContent(htmlContent);
      this.currentRenderer.bindEvents(this.view);

      this.currentQuestionIndex += 1;
    } else {
      // remove counter and next buttons
      this.view.removeChild(this._counter);
      this.view.removeChild(this._nextBtn);
      // display thanks
      this.setCenteredViewContent(this.survey.thanksContent);
      // send informations to server
      console.log('send', this.answers, 'to server');
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
