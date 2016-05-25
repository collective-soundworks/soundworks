'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Scene2 = require('../core/Scene');

var _Scene3 = _interopRequireDefault(_Scene2);

var _View2 = require('../views/View');

var _View3 = _interopRequireDefault(_View2);

var _SegmentedView2 = require('../views/SegmentedView');

var _SegmentedView3 = _interopRequireDefault(_SegmentedView2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Renderers
 */

var BaseRenderer = function (_View) {
  (0, _inherits3.default)(BaseRenderer, _View);

  function BaseRenderer(parent, template, question) {
    (0, _classCallCheck3.default)(this, BaseRenderer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(BaseRenderer).call(this, template, question, {}, { className: 'question' }));

    _this.parent = parent;
    _this.question = question;
    _this.id = question.id;
    return _this;
  }

  (0, _createClass3.default)(BaseRenderer, [{
    key: 'onResize',
    value: function onResize(width, height, orientation) {}
  }]);
  return BaseRenderer;
}(_View3.default);

var radioTemplate = '\n  <p class="label"><%= label %></p>\n  <% for (var key in options) { %>\n    <p class="answer radio" data-key="<%= key %>"><%= options[key] %></p>\n  <% } %>\n';

var RadioRenderer = function (_BaseRenderer) {
  (0, _inherits3.default)(RadioRenderer, _BaseRenderer);

  function RadioRenderer(parent, question) {
    (0, _classCallCheck3.default)(this, RadioRenderer);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(RadioRenderer).call(this, parent, radioTemplate, question));

    _this2.answer = null;
    _this2._onSelect = _this2._onSelect.bind(_this2);
    return _this2;
  }

  (0, _createClass3.default)(RadioRenderer, [{
    key: 'onRender',
    value: function onRender() {
      this.installEvents({ 'click .answer': this._onSelect });
      this.$options = (0, _from2.default)(this.$el.querySelectorAll('.answer'));
    }
  }, {
    key: '_onSelect',
    value: function _onSelect(e) {
      var target = e.target;

      this.$options.forEach(function (el) {
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
}(BaseRenderer);

var checkboxTemplate = '\n  <p class="label"><%= label %></p>\n  <% for (var key in options) { %>\n    <p class="answer checkbox" data-key="<%= key %>"><%= options[key] %></p>\n  <% } %>\n';

var CheckboxRenderer = function (_BaseRenderer2) {
  (0, _inherits3.default)(CheckboxRenderer, _BaseRenderer2);

  function CheckboxRenderer(parent, question) {
    (0, _classCallCheck3.default)(this, CheckboxRenderer);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(CheckboxRenderer).call(this, parent, checkboxTemplate, question));

    _this3.answers = [];
    _this3._onSelect = _this3._onSelect.bind(_this3);
    return _this3;
  }

  (0, _createClass3.default)(CheckboxRenderer, [{
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
}(BaseRenderer);

var rangeTemplate = '\n  <p class="label"><%= label %></p>\n  <input class="slider answer"\n    type="range"\n    min="<%= options.min %>"\n    max="<%= options.max %>"\n    step="<%= options.step %>"\n    value="<%= options.default %>" />\n  <span class="feedback"><%= options.default %></span>\n';

var RangeRenderer = function (_BaseRenderer3) {
  (0, _inherits3.default)(RangeRenderer, _BaseRenderer3);

  function RangeRenderer(parent, question) {
    (0, _classCallCheck3.default)(this, RangeRenderer);

    var _this4 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(RangeRenderer).call(this, parent, rangeTemplate, question));

    _this4.answer = null;
    _this4._onInput = _this4._onInput.bind(_this4);
    return _this4;
  }

  (0, _createClass3.default)(RangeRenderer, [{
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
}(BaseRenderer);

var textareaTemplate = '\n  <p class="label"><%= label %></p>\n  <textarea class="answer textarea"></textarea>\n';

var TextAreaRenderer = function (_BaseRenderer4) {
  (0, _inherits3.default)(TextAreaRenderer, _BaseRenderer4);

  function TextAreaRenderer(parent, question) {
    (0, _classCallCheck3.default)(this, TextAreaRenderer);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TextAreaRenderer).call(this, parent, textareaTemplate, question));
  }

  (0, _createClass3.default)(TextAreaRenderer, [{
    key: 'onRender',
    value: function onRender() {
      this.$label = this.$el.querySelector('.label');
      this.$textarea = this.$el.querySelector('.answer');
    }
  }, {
    key: 'onResize',
    value: function onResize(viewportVidth, viewportHeight, orientation) {
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
}(BaseRenderer);

/**
 * Survey main vue
 */


var SurveyView = function (_SegmentedView) {
  (0, _inherits3.default)(SurveyView, _SegmentedView);

  function SurveyView(template, content, events, options) {
    (0, _classCallCheck3.default)(this, SurveyView);

    var _this6 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SurveyView).call(this, template, content, events, options));

    _this6.ratios = {
      '.section-top': 0.15,
      '.section-center': 0.65,
      '.section-bottom': 0.2
    };
    return _this6;
  }

  (0, _createClass3.default)(SurveyView, [{
    key: 'onRender',
    value: function onRender() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(SurveyView.prototype), 'onRender', this).call(this);
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
}(_SegmentedView3.default);

var SCENE_ID = 'survey';

/**
 * A scene to create surveys.
 */

var Survey = function (_Scene) {
  (0, _inherits3.default)(Survey, _Scene);

  function Survey() {
    (0, _classCallCheck3.default)(this, Survey);


    /**
     * Object used to store the answers of the survey.
     * @type {Object}
     */

    var _this7 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Survey).call(this, SCENE_ID, true));

    _this7.answers = {};

    _this7._onConfigResponse = _this7._onConfigResponse.bind(_this7);
    _this7._displayNextQuestion = _this7._displayNextQuestion.bind(_this7);
    return _this7;
  }

  /** @private */


  (0, _createClass3.default)(Survey, [{
    key: 'init',
    value: function init() {
      this.viewContent.counter = 0;
      this.viewEvents = { 'click .btn': this._displayNextQuestion };
      this.viewCtor = SurveyView;

      this.view = this.createView();
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Survey.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.show();

      this.send('request');
      this.receive('config', this._onConfigResponse);
    }
  }, {
    key: '_onConfigResponse',
    value: function _onConfigResponse(surveyConfig) {
      // set length of the survey for the view
      this.viewContent.length = surveyConfig.length;
      this._createRenderers(surveyConfig);
      this._displayNextQuestion();
    }
  }, {
    key: '_createRenderers',
    value: function _createRenderers(surveyConfig) {
      var _this8 = this;

      this.renderers = surveyConfig.map(function (question, index) {
        var ctor = void 0;

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

        return new ctor(_this8.view, question);
      });
    }
  }, {
    key: '_displayNextQuestion',
    value: function _displayNextQuestion() {
      // retrive and store current answer if any
      if (this.currentRenderer) {
        var answer = this.currentRenderer.getAnswer();
        var required = this.currentRenderer.question.required;

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

        if (this.currentRenderer.question.required) this.view.disableBtn();
      } else {
        this.view.setViewComponent('.section-center', null);
        this.view.render();
        // send informations to server
        var data = {
          timestamp: new Date().getTime(),
          userAgent: navigator.userAgent,
          answers: this.answers
        };

        this.send('answers', data);
      }
    }
  }]);
  return Survey;
}(_Scene3.default);

exports.default = Survey;
//# sourceMappingURL=data:application/json;base64,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Z0IsQ0FBakI7QUFxQkQ7OzsyQ0FFc0I7O0FBRXJCLFVBQUksS0FBSyxlQUFULEVBQTBCO0FBQ3hCLFlBQU0sU0FBUyxLQUFLLGVBQUwsQ0FBcUIsU0FBckIsRUFBZjtBQUNBLFlBQU0sV0FBVyxLQUFLLGVBQUwsQ0FBcUIsUUFBckIsQ0FBOEIsUUFBL0M7OztBQUdBLFlBQUksV0FBVyxJQUFYLElBQW1CLFFBQXZCLEVBQWlDOztBQUVqQyxhQUFLLE9BQUwsQ0FBYSxLQUFLLGVBQUwsQ0FBcUIsRUFBbEMsSUFBd0MsTUFBeEM7QUFDRDs7O0FBR0QsV0FBSyxlQUFMLEdBQXVCLEtBQUssU0FBTCxDQUFlLEtBQWYsRUFBdkI7O0FBRUEsV0FBSyxXQUFMLENBQWlCLE9BQWpCLElBQTRCLENBQTVCOztBQUVBLFVBQUksS0FBSyxlQUFULEVBQTBCO0FBQ3hCLGFBQUssSUFBTCxDQUFVLGdCQUFWLENBQTJCLGlCQUEzQixFQUE4QyxLQUFLLGVBQW5EO0FBQ0EsYUFBSyxJQUFMLENBQVUsTUFBVjs7QUFFQSxZQUFJLEtBQUssZUFBTCxDQUFxQixRQUFyQixDQUE4QixRQUFsQyxFQUNFLEtBQUssSUFBTCxDQUFVLFVBQVY7QUFDSCxPQU5ELE1BTU87QUFDTCxhQUFLLElBQUwsQ0FBVSxnQkFBVixDQUEyQixpQkFBM0IsRUFBOEMsSUFBOUM7QUFDQSxhQUFLLElBQUwsQ0FBVSxNQUFWOztBQUVBLFlBQU0sT0FBTztBQUNYLHFCQUFXLElBQUksSUFBSixHQUFXLE9BQVgsRUFEQTtBQUVYLHFCQUFXLFVBQVUsU0FGVjtBQUdYLG1CQUFTLEtBQUs7QUFISCxTQUFiOztBQU1BLGFBQUssSUFBTCxDQUFVLFNBQVYsRUFBcUIsSUFBckI7QUFDRDtBQUNGOzs7OztrQkF0R2tCLE0iLCJmaWxlIjoiU3VydmV5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNjZW5lIGZyb20gJy4uL2NvcmUvU2NlbmUnO1xuaW1wb3J0IFZpZXcgZnJvbSAnLi4vdmlld3MvVmlldyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcblxuLyoqXG4gKiBSZW5kZXJlcnNcbiAqL1xuY2xhc3MgQmFzZVJlbmRlcmVyIGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgdGVtcGxhdGUsIHF1ZXN0aW9uKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIHF1ZXN0aW9uLCB7fSwgeyBjbGFzc05hbWU6ICdxdWVzdGlvbicgfSk7XG5cbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLnF1ZXN0aW9uID0gcXVlc3Rpb247XG4gICAgdGhpcy5pZCA9IHF1ZXN0aW9uLmlkO1xuICB9XG5cbiAgb25SZXNpemUod2lkdGgsIGhlaWdodCwgb3JpZW50YXRpb24pIHt9XG59XG5cbmNvbnN0IHJhZGlvVGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDwlIGZvciAodmFyIGtleSBpbiBvcHRpb25zKSB7ICU+XG4gICAgPHAgY2xhc3M9XCJhbnN3ZXIgcmFkaW9cIiBkYXRhLWtleT1cIjwlPSBrZXkgJT5cIj48JT0gb3B0aW9uc1trZXldICU+PC9wPlxuICA8JSB9ICU+XG5gO1xuXG5jbGFzcyBSYWRpb1JlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHBhcmVudCwgcmFkaW9UZW1wbGF0ZSwgcXVlc3Rpb24pO1xuXG4gICAgdGhpcy5hbnN3ZXIgPSBudWxsO1xuICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7ICdjbGljayAuYW5zd2VyJzogdGhpcy5fb25TZWxlY3QgfSk7XG4gICAgdGhpcy4kb3B0aW9ucyA9IEFycmF5LmZyb20odGhpcy4kZWwucXVlcnlTZWxlY3RvckFsbCgnLmFuc3dlcicpKTtcbiAgfVxuXG4gIF9vblNlbGVjdChlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICB0aGlzLiRvcHRpb25zLmZvckVhY2goKGVsKSA9PiB7IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7IH0pO1xuICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuXG4gICAgdGhpcy5hbnN3ZXIgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWtleScpO1xuXG4gICAgdGhpcy5wYXJlbnQuZW5hYmxlQnRuKCk7XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5zd2VyO1xuICB9XG59XG5cbmNvbnN0IGNoZWNrYm94VGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDwlIGZvciAodmFyIGtleSBpbiBvcHRpb25zKSB7ICU+XG4gICAgPHAgY2xhc3M9XCJhbnN3ZXIgY2hlY2tib3hcIiBkYXRhLWtleT1cIjwlPSBrZXkgJT5cIj48JT0gb3B0aW9uc1trZXldICU+PC9wPlxuICA8JSB9ICU+XG5gO1xuXG5jbGFzcyBDaGVja2JveFJlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHBhcmVudCwgY2hlY2tib3hUZW1wbGF0ZSwgcXVlc3Rpb24pO1xuXG4gICAgdGhpcy5hbnN3ZXJzID0gW107XG4gICAgdGhpcy5fb25TZWxlY3QgPSB0aGlzLl9vblNlbGVjdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy5pbnN0YWxsRXZlbnRzKHsgJ2NsaWNrIC5hbnN3ZXInOiB0aGlzLl9vblNlbGVjdCB9KTtcbiAgfVxuXG4gIF9vblNlbGVjdChlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgY29uc3Qga2V5ID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1rZXknKTtcbiAgICBjb25zdCBtZXRob2QgPSB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpID8gJ3JlbW92ZScgOiAnYWRkJztcblxuICAgIGlmIChtZXRob2QgPT09ICdhZGQnKSB7XG4gICAgICB0aGlzLmFuc3dlcnMucHVzaChrZXkpO1xuICAgIH0gZWxzZSBpZiAoKG1ldGhvZCA9PT0gJ3JlbW92ZScpKSB7XG4gICAgICB0aGlzLmFuc3dlcnMuc3BsaWNlKHRoaXMuYW5zd2Vycy5pbmRleE9mKGtleSksIDEpO1xuICAgIH1cblxuICAgIHRhcmdldC5jbGFzc0xpc3RbbWV0aG9kXSgnc2VsZWN0ZWQnKTtcblxuICAgIGlmICh0aGlzLmFuc3dlcnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5wYXJlbnQuZW5hYmxlQnRuKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFyZW50LmRpc2FibGVCdG4oKTtcbiAgICB9XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5zd2Vycy5sZW5ndGggPT09IDAgPyBudWxsIDogdGhpcy5hbnN3ZXJzO1xuICB9XG59XG5cbmNvbnN0IHJhbmdlVGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDxpbnB1dCBjbGFzcz1cInNsaWRlciBhbnN3ZXJcIlxuICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgbWluPVwiPCU9IG9wdGlvbnMubWluICU+XCJcbiAgICBtYXg9XCI8JT0gb3B0aW9ucy5tYXggJT5cIlxuICAgIHN0ZXA9XCI8JT0gb3B0aW9ucy5zdGVwICU+XCJcbiAgICB2YWx1ZT1cIjwlPSBvcHRpb25zLmRlZmF1bHQgJT5cIiAvPlxuICA8c3BhbiBjbGFzcz1cImZlZWRiYWNrXCI+PCU9IG9wdGlvbnMuZGVmYXVsdCAlPjwvc3Bhbj5cbmA7XG5cbmNsYXNzIFJhbmdlUmVuZGVyZXIgZXh0ZW5kcyBCYXNlUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHF1ZXN0aW9uKSB7XG4gICAgc3VwZXIocGFyZW50LCByYW5nZVRlbXBsYXRlLCBxdWVzdGlvbik7XG5cbiAgICB0aGlzLmFuc3dlciA9IG51bGw7XG4gICAgdGhpcy5fb25JbnB1dCA9IHRoaXMuX29uSW5wdXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7ICdpbnB1dCAuYW5zd2VyJzogdGhpcy5fb25JbnB1dCB9KTtcbiAgICB0aGlzLiRzbGlkZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyJylcbiAgICB0aGlzLiRmZWVkYmFjayA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5mZWVkYmFjaycpO1xuICB9XG5cbiAgX29uSW5wdXQoZSkge1xuICAgIHRoaXMuJGZlZWRiYWNrLnRleHRDb250ZW50ID0gdGhpcy4kc2xpZGVyLnZhbHVlO1xuICAgIHRoaXMuYW5zd2VyID0gcGFyc2VGbG9hdCh0aGlzLiRzbGlkZXIudmFsdWUpXG4gICAgdGhpcy5wYXJlbnQuZW5hYmxlQnRuKCk7XG4gIH1cblxuICBnZXRBbnN3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5zd2VyO1xuICB9XG59XG5cbmNvbnN0IHRleHRhcmVhVGVtcGxhdGUgPSBgXG4gIDxwIGNsYXNzPVwibGFiZWxcIj48JT0gbGFiZWwgJT48L3A+XG4gIDx0ZXh0YXJlYSBjbGFzcz1cImFuc3dlciB0ZXh0YXJlYVwiPjwvdGV4dGFyZWE+XG5gO1xuXG5jbGFzcyBUZXh0QXJlYVJlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBxdWVzdGlvbikge1xuICAgIHN1cGVyKHBhcmVudCwgdGV4dGFyZWFUZW1wbGF0ZSwgcXVlc3Rpb24pO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy4kbGFiZWwgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcubGFiZWwnKTtcbiAgICB0aGlzLiR0ZXh0YXJlYSA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5hbnN3ZXInKTtcbiAgfVxuXG4gIG9uUmVzaXplKHZpZXdwb3J0VmlkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIGlmICghdGhpcy4kcGFyZW50KSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGhpcy4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qgd2lkdGggPSBib3VuZGluZ1JlY3Qud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gYm91bmRpbmdSZWN0LmhlaWdodDtcblxuICAgIGNvbnN0IGxhYmVsSGVpZ2h0ID0gdGhpcy4kbGFiZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuXG4gICAgdGhpcy4kdGV4dGFyZWEuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgdGhpcy4kdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0IC0gbGFiZWxIZWlnaHR9cHhgO1xuICB9XG5cbiAgZ2V0QW5zd2VyKCkge1xuICAgIHJldHVybiB0aGlzLiR0ZXh0YXJlYS52YWx1ZTtcbiAgfVxufVxuXG4vKipcbiAqIFN1cnZleSBtYWluIHZ1ZVxuICovXG5jbGFzcyBTdXJ2ZXlWaWV3IGV4dGVuZHMgU2VnbWVudGVkVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpIHtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIHRoaXMucmF0aW9zID0ge1xuICAgICAgJy5zZWN0aW9uLXRvcCc6IDAuMTUsXG4gICAgICAnLnNlY3Rpb24tY2VudGVyJzogMC42NSxcbiAgICAgICcuc2VjdGlvbi1ib3R0b20nOiAwLjIsXG4gICAgfTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHN1cGVyLm9uUmVuZGVyKCk7XG4gICAgdGhpcy4kbmV4dEJ0biA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5idG4nKTtcbiAgfVxuXG4gIGRpc2FibGVCdG4oKSB7XG4gICAgdGhpcy4kbmV4dEJ0bi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gIH1cblxuICBlbmFibGVCdG4oKSB7XG4gICAgdGhpcy4kbmV4dEJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gIH1cbn1cblxuY29uc3QgU0NFTkVfSUQgPSAnc3VydmV5JztcblxuLyoqXG4gKiBBIHNjZW5lIHRvIGNyZWF0ZSBzdXJ2ZXlzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdXJ2ZXkgZXh0ZW5kcyBTY2VuZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNDRU5FX0lELCB0cnVlKTtcblxuICAgIC8qKlxuICAgICAqIE9iamVjdCB1c2VkIHRvIHN0b3JlIHRoZSBhbnN3ZXJzIG9mIHRoZSBzdXJ2ZXkuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmFuc3dlcnMgPSB7fTtcblxuICAgIHRoaXMuX29uQ29uZmlnUmVzcG9uc2UgPSB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZGlzcGxheU5leHRRdWVzdGlvbiA9IHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24uYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbml0KCkge1xuICAgIHRoaXMudmlld0NvbnRlbnQuY291bnRlciA9IDA7XG4gICAgdGhpcy52aWV3RXZlbnRzID0geyAnY2xpY2sgLmJ0bic6IHRoaXMuX2Rpc3BsYXlOZXh0UXVlc3Rpb24gfTtcbiAgICB0aGlzLnZpZXdDdG9yID0gU3VydmV5VmlldztcblxuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zaG93KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2NvbmZpZycsIHRoaXMuX29uQ29uZmlnUmVzcG9uc2UpO1xuICB9XG5cbiAgX29uQ29uZmlnUmVzcG9uc2Uoc3VydmV5Q29uZmlnKSB7XG4gICAgLy8gc2V0IGxlbmd0aCBvZiB0aGUgc3VydmV5IGZvciB0aGUgdmlld1xuICAgIHRoaXMudmlld0NvbnRlbnQubGVuZ3RoID0gc3VydmV5Q29uZmlnLmxlbmd0aDtcbiAgICB0aGlzLl9jcmVhdGVSZW5kZXJlcnMoc3VydmV5Q29uZmlnKTtcbiAgICB0aGlzLl9kaXNwbGF5TmV4dFF1ZXN0aW9uKCk7XG4gIH1cblxuICBfY3JlYXRlUmVuZGVyZXJzKHN1cnZleUNvbmZpZykge1xuICAgIHRoaXMucmVuZGVyZXJzID0gc3VydmV5Q29uZmlnLm1hcCgocXVlc3Rpb24sIGluZGV4KSA9PiB7XG4gICAgICBsZXQgY3RvcjtcblxuICAgICAgc3dpdGNoIChxdWVzdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgJ3JhZGlvJzpcbiAgICAgICAgICBjdG9yID0gUmFkaW9SZW5kZXJlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICAgIGN0b3IgPSBDaGVja2JveFJlbmRlcmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyYW5nZSc6XG4gICAgICAgICAgY3RvciA9IFJhbmdlUmVuZGVyZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgICAgICBxdWVzdGlvbi5yZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICAgIGN0b3IgPSBUZXh0QXJlYVJlbmRlcmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IGN0b3IodGhpcy52aWV3LCBxdWVzdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICBfZGlzcGxheU5leHRRdWVzdGlvbigpIHtcbiAgICAvLyByZXRyaXZlIGFuZCBzdG9yZSBjdXJyZW50IGFuc3dlciBpZiBhbnlcbiAgICBpZiAodGhpcy5jdXJyZW50UmVuZGVyZXIpIHtcbiAgICAgIGNvbnN0IGFuc3dlciA9IHRoaXMuY3VycmVudFJlbmRlcmVyLmdldEFuc3dlcigpO1xuICAgICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLmN1cnJlbnRSZW5kZXJlci5xdWVzdGlvbi5yZXF1aXJlZDtcblxuICAgICAgLy8gcmV0dXJuIGlmIG5vIGFuc3dlciBhbmQgcmVxdWlyZWQgcXVlc3Rpb25cbiAgICAgIGlmIChhbnN3ZXIgPT09IG51bGwgJiYgcmVxdWlyZWQpIHJldHVybjtcblxuICAgICAgdGhpcy5hbnN3ZXJzW3RoaXMuY3VycmVudFJlbmRlcmVyLmlkXSA9IGFuc3dlcjtcbiAgICB9XG5cbiAgICAvLyByZXRyaWV2ZSB0aGUgbmV4dCByZW5kZXJlclxuICAgIHRoaXMuY3VycmVudFJlbmRlcmVyID0gdGhpcy5yZW5kZXJlcnMuc2hpZnQoKTtcbiAgICAvLyB1cGRhdGUgY291bnRlclxuICAgIHRoaXMudmlld0NvbnRlbnQuY291bnRlciArPSAxO1xuXG4gICAgaWYgKHRoaXMuY3VycmVudFJlbmRlcmVyKSB7XG4gICAgICB0aGlzLnZpZXcuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tY2VudGVyJywgdGhpcy5jdXJyZW50UmVuZGVyZXIpO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcigpO1xuXG4gICAgICBpZiAodGhpcy5jdXJyZW50UmVuZGVyZXIucXVlc3Rpb24ucmVxdWlyZWQpXG4gICAgICAgIHRoaXMudmlldy5kaXNhYmxlQnRuKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlldy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1jZW50ZXInLCBudWxsKTtcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICAgIC8vIHNlbmQgaW5mb3JtYXRpb25zIHRvIHNlcnZlclxuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgICAgdXNlckFnZW50OiBuYXZpZ2F0b3IudXNlckFnZW50LFxuICAgICAgICBhbnN3ZXJzOiB0aGlzLmFuc3dlcnMsXG4gICAgICB9O1xuXG4gICAgICB0aGlzLnNlbmQoJ2Fuc3dlcnMnLCBkYXRhKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==