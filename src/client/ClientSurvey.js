import ClientModule from './ClientModule';
import View from './display/View';
import SegmentedView from './display/SegmentedView';

/**
 * Renderers
 */
class BaseRenderer extends View {
  constructor(parent, template, question) {
    super(template, question, {}, { className: 'question' });

    this.parent = parent;
    this.question = question;
    this.id = question.id;
  }

  onResize(orientation, width, height) {}
}

const radioTemplate = `
  <p class="label"><%= label %></p>
  <% for (var key in answers) { %>
    <p class="answer radio" data-key="<%= key %>"><%= answers[key] %></p>
  <% } %>
`;

class RadioRenderer extends BaseRenderer {
  constructor(parent, question) {
    super(parent, radioTemplate, question);

    this.answer = null;
    this._onSelect = this._onSelect.bind(this);
  }

  onRender() {
    this.installEvents({ 'click .answer': this._onSelect });
    this.$answers = Array.from(this.$el.querySelectorAll('.answer'));
  }

  _onSelect(e) {
    const target = e.target;

    this.$answers.forEach((el) => { el.classList.remove('selected'); });
    target.classList.add('selected');

    this.answer = target.getAttribute('data-key');

    this.parent.enableBtn();
  }

  getAnswer() {
    return this.answer;
  }
}

const checkboxTemplate = `
  <p class="label"><%= label %></p>
  <% for (var key in answers) { %>
    <p class="answer checkbox" data-key="<%= key %>"><%= answers[key] %></p>
  <% } %>
`;

class CheckboxRenderer extends BaseRenderer {
  constructor(parent, question) {
    super(parent, checkboxTemplate, question);

    this.answers = [];
    this._onSelect = this._onSelect.bind(this);
  }

  onRender() {
    this.installEvents({ 'click .answer': this._onSelect });
  }

  _onSelect(e) {
    const target = e.target;
    const key = target.getAttribute('data-key');
    const method = target.classList.contains('selected') ? 'remove' : 'add';

    if (method === 'add') {
      this.answers.push(key);
    } else if ((method === 'remove')) {
      this.answers.splice(this.answers.indexOf(key), 1);
    }

    target.classList[method]('selected');

    if (this.answers.length > 0) {
      this.parent.enableBtn();
    } else {
      this.parent.disableBtn();
    }
  }

  getAnswer() {
    return this.answers.length === 0 ? null : this.answers;
  }
}

const rangeTemplate = `
  <p class="label"><%= label %></p>
  <input class="slider answer"
    type="range"
    min="<%= min %>"
    max="<%= max %>"
    step="<%= step %>"
    value="<%= defaultValue %>" />
  <span class="feedback"><%= defaultValue %></span>
`;

class RangeRenderer extends BaseRenderer {
  constructor(parent, question) {
    question = Object.assign({
      min: 0,
      max: 10,
      step: 1,
      defaultValue: 5,
    }, question);

    super(parent, rangeTemplate, question);

    this.answer = null;
    this._onInput = this._onInput.bind(this);
  }

  onRender() {
    this.installEvents({ 'input .answer': this._onInput });
    this.$slider = this.$el.querySelector('.slider')
    this.$feedback = this.$el.querySelector('.feedback');
  }

  _onInput(e) {
    this.$feedback.textContent = this.$slider.value;
    this.answer = parseFloat(this.$slider.value)
    this.parent.enableBtn();
  }

  getAnswer() {
    return this.answer;
  }
}

const textareaTemplate = `
  <p class="label"><%= label %></p>
  <textarea class="answer textarea"></textarea>
`;

// is never required for now
class TextAreaRenderer extends BaseRenderer {
  constructor(parent, question) {
    super(parent, textareaTemplate, question);
  }

  onRender() {
    this.$label = this.$el.querySelector('.label');
    this.$textarea = this.$el.querySelector('.answer');
  }

  onShow() {
    this.onResize();
  }

  onResize(orientation, viewportVidth, viewportHeight) {
    if (!this.$parent) { return; }
    const boundingRect = this.$el.getBoundingClientRect();
    const width = boundingRect.width;
    const height = boundingRect.height;

    const labelHeight = this.$label.getBoundingClientRect().height;

    this.$textarea.style.width = `${width}px`;
    this.$textarea.style.height = `${height - labelHeight}px`;
  }

  getAnswer() {
    return this.$textarea.value;
  }
}

/**
 * Survey main vue
 */
class SurveyView extends SegmentedView {
  constructor(template, content, events, options) {
    super(template, content, events, options);

    this.ratios = {
      '.section-top': 0.15,
      '.section-center': 0.65,
      '.section-bottom': 0.2,
    };
  }

  onRender() {
    super.onRender();
    this.$nextBtn = this.$el.querySelector('.btn');
  }

  disableBtn() {
    this.$nextBtn.setAttribute('disabled', true);
  }

  enableBtn() {
    this.$nextBtn.removeAttribute('disabled');
  }
}

/**
 * A module to create surveys.
 */
export default class ClientSurvey extends ClientModule {
  constructor(surveyConfig, options = {}) {
    super(options.name || 'survey', options);

    this.survey = surveyConfig;
    this.options = options;
    this.answers = {};

    this._displayNextQuestion = this._displayNextQuestion.bind(this);

    this.viewCtor = SurveyView;
    this.init();
  }

  init() {
    this.content.counter = 0;
    this.content.length = this.survey.length;
    this.events = { 'click .btn': this._displayNextQuestion };

    this.view = this.createView();
  }

  start() {
    super.start();

    this._createRenderers();
    this._displayNextQuestion();
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

      return new ctor(this.view, question);
    });
  }

  _displayNextQuestion() {
    // retrive and store current answer if any
    if (this.currentRenderer) {
      const answer = this.currentRenderer.getAnswer();
      const required = this.currentRenderer.question.required;

      if (answer === null && required) { return; }
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
}
