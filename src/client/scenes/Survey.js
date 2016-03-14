import Scene from '../core/Scene';
import View from '../views/View';
import SegmentedView from '../views/SegmentedView';

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

  onResize(width, height, orientation) {}
}

const radioTemplate = `
  <p class="label"><%= label %></p>
  <% for (var key in options) { %>
    <p class="answer radio" data-key="<%= key %>"><%= options[key] %></p>
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
    this.$options = Array.from(this.$el.querySelectorAll('.answer'));
  }

  _onSelect(e) {
    const target = e.target;

    this.$options.forEach((el) => { el.classList.remove('selected'); });
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
  <% for (var key in options) { %>
    <p class="answer checkbox" data-key="<%= key %>"><%= options[key] %></p>
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
    min="<%= options.min %>"
    max="<%= options.max %>"
    step="<%= options.step %>"
    value="<%= options.default %>" />
  <span class="feedback"><%= options.default %></span>
`;

class RangeRenderer extends BaseRenderer {
  constructor(parent, question) {
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

class TextAreaRenderer extends BaseRenderer {
  constructor(parent, question) {
    super(parent, textareaTemplate, question);
  }

  onRender() {
    this.$label = this.$el.querySelector('.label');
    this.$textarea = this.$el.querySelector('.answer');
  }

  onResize(viewportVidth, viewportHeight, orientation) {
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

const SCENE_ID = 'survey';

/**
 * A scene to create surveys.
 */
export default class Survey extends Scene {
  constructor() {
    super(SCENE_ID, true);

    /**
     * Object used to store the answers of the survey.
     * @type {Object}
     */
    this.answers = {};

    this._onConfigResponse = this._onConfigResponse.bind(this);
    this._displayNextQuestion = this._displayNextQuestion.bind(this);
  }

  /** @private */
  init() {
    this.viewContent.counter = 0;
    this.viewEvents = { 'click .btn': this._displayNextQuestion };
    this.viewCtor = SurveyView;

    this.view = this.createView();
  }

  /** @private */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.show();

    this.send('request');
    this.receive('config', this._onConfigResponse);
  }

  _onConfigResponse(surveyConfig) {
    // set length of the survey for the view
    this.viewContent.length = surveyConfig.length;
    this._createRenderers(surveyConfig);
    this._displayNextQuestion();
  }

  _createRenderers(surveyConfig) {
    this.renderers = surveyConfig.map((question, index) => {
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

      // return if no answer and required question
      if (answer === null && required) return;

      this.answers[this.currentRenderer.id] = answer;
    }

    // retrieve the next renderer
    this.currentRenderer = this.renderers.shift();
    // update counter
    this.viewContent.counter += 1;

    if (this.currentRenderer) {
      this.view.setViewComponent('.section-center', this.currentRenderer);
      this.view.render();

      if (this.currentRenderer.question.required)
        this.view.disableBtn();
    } else {
      this.view.setViewComponent('.section-center', null);
      this.view.render();
      // send informations to server
      const data = {
        timestamp: new Date().getTime(),
        userAgent: navigator.userAgent,
        answers: this.answers,
      };

      this.send('answers', data);
    }
  }
}
