'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function convertName(name) {
  var a = name.split('_');
  var n = '';
  for (var i = 0; i < a.length; i++) {
    if (i === 0) n += toTitleCase(a[i]);else n += ' ' + a[i];
  }
  return n;
}

var defaultTemplate = '\n  <% definitions.forEach((def, index) => { %>\n    <button class="btn <%= def.state %>"\n            data-index="<%= index %>"\n            <%= def.state === \'disabled\' ? \'disabled\' : \'\' %>\n    >\n      <%= convertName(def.label) %>\n    </button>\n  <% }); %>\n';

/**
 * View to display a list of buttons.
 */

var ButtonView = function (_View) {
  (0, _inherits3.default)(ButtonView, _View);

  /**
   * @param {Array<Object>} definitions - An array of definitions for the buttons. Each definitions should contain a `label` and an optionnal `state` entry (valid values for `states` are `'selected'`, `'unselected'` or `'disabled'`).
   * @param {Function} onSelect - The callback to execute when a button is selected.
   * @param {Function} onUnselect - The callback to execute when a button is unselected.
   * @param {Object} options
   * @param {Object} [options.maxSelected=1] - The maximum possible selected buttons.
   * @param {Object} [options.defaultState='unselected'] - The state to apply when not defined in the buttons definitions.
   */

  function ButtonView(definitions, onSelect, onUnselect, options) {
    (0, _classCallCheck3.default)(this, ButtonView);

    var template = options.template || defaultTemplate;

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ButtonView).call(this, template, { definitions: definitions, convertName: convertName }, {}, { className: 'buttons' }));

    _this._definitions = definitions;
    _this._maxSelected = options.maxSelected || 1;
    _this._selected = [];

    _this.onSelect = onSelect;
    _this.onUnselect = onUnselect;

    var defaultState = options.defaultState || 'unselected';
    // populate `this._selected`
    _this._definitions.forEach(function (def, index) {
      if (def.state === undefined) {
        def.state === defaultState;
      }
      if (def.state === 'selected') {
        _this._selected.push(index);
      }
    });

    _this.toggle = _this.toggle.bind(_this);
    _this.events = { 'click .btn': _this.toggle };
    return _this;
  }

  (0, _createClass3.default)(ButtonView, [{
    key: 'onRender',
    value: function onRender() {
      this.$el.style.width = '100%';
      this.$el.style.height = '100%';
    }

    /**
     * Sets a definition and its related button to `selected`.
     * @param {Number} index - Index of the definitions in the list of definitions.
     * @param {Element} $btn - The DOM element related to this definition.
     */

  }, {
    key: '_select',
    value: function _select(index, $btn) {
      var def = this._definitions[index];
      $btn.classList.remove('unselected', 'disabled');
      $btn.classList.add('selected');
      def.state = 'selected';

      this._selected.push(index);
      this.onSelect(index, def);
    }

    /**
     * Sets a definition and its related button to `unselected`.
     * @param {Number} index - Index of the definitions in the list of definitions.
     * @param {Element} $btn - The DOM element related to this definition.
     */

  }, {
    key: '_unselect',
    value: function _unselect(index, $btn) {
      var def = this._definitions[index];
      $btn.classList.remove('selected', 'disabled');
      $btn.classList.add('unselected');
      def.state = 'unselected';

      var selectedIndex = this._selected.indexOf(index);

      if (selectedIndex !== -1) {
        this._selected.splice(selectedIndex, 1);
        this.onUnselect(index, def);
      }
    }

    /**
     * Toggle the state of a definitions and its related button.
     * @param {Event} e - The event triggered by the user action (`click`).
     */

  }, {
    key: 'toggle',
    value: function toggle(e) {
      var $target = e.target;
      var index = parseInt($target.getAttribute('data-index'));
      var def = this._definitions[index];
      var currentState = def.state;
      var executeMethod = currentState === 'selected' ? '_unselect' : '_select';

      if (this._selected.length >= this._maxSelected && executeMethod === 'select') {
        return;
      }

      this[executeMethod](index, $target);
    }

    /**
     * Unable the interaction with a definition and its related button.
     * @param {Number} index - Index of the definitions in the list of definitions.
     */

  }, {
    key: 'enable',
    value: function enable(index) {
      // set state 'unselected'
      var $target = this.$el.querySelector('[data-index="' + index + '"]');
      this._unselect(index, $target);

      $target.removeAttribute('disabled');
    }

    /**
     * Disable the interaction with a definition and its related button.
     * @param {Number} index - Index of the definitions in the list of definitions.
     */

  }, {
    key: 'disable',
    value: function disable(index) {
      var $target = this.$el.querySelector('[data-index="' + index + '"]');
      this._unselect(index, $target);

      $target.classList.remove('unselected');
      $target.classList.add('disabled');
      $target.setAttribute('disabled', true);
    }
  }]);
  return ButtonView;
}(_View3.default);

exports.default = ButtonView;
//# sourceMappingURL=data:application/json;base64,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QUZNO0FBR1osV0FBSyxTQUFMLENBQWUsS0FBZixFQUFzQixPQUF0QixFQUhZOztBQUtaLGNBQVEsZUFBUixDQUF3QixVQUF4QixFQUxZOzs7Ozs7Ozs7OzRCQVlOLE9BQU87QUFDYixVQUFNLFVBQVUsS0FBSyxHQUFMLENBQVMsYUFBVCxtQkFBdUMsWUFBdkMsQ0FBVixDQURPO0FBRWIsV0FBSyxTQUFMLENBQWUsS0FBZixFQUFzQixPQUF0QixFQUZhOztBQUliLGNBQVEsU0FBUixDQUFrQixNQUFsQixDQUF5QixZQUF6QixFQUphO0FBS2IsY0FBUSxTQUFSLENBQWtCLEdBQWxCLENBQXNCLFVBQXRCLEVBTGE7QUFNYixjQUFRLFlBQVIsQ0FBcUIsVUFBckIsRUFBaUMsSUFBakMsRUFOYTs7O1NBeEdJIiwiZmlsZSI6IkJ1dHRvblZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcnO1xuXG5mdW5jdGlvbiB0b1RpdGxlQ2FzZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHdcXFMqL2csIGZ1bmN0aW9uKHR4dCkge1xuICAgIHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0TmFtZShuYW1lKSB7XG4gIHZhciBhID0gbmFtZS5zcGxpdCgnXycpO1xuICB2YXIgbiA9ICcnO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoaSA9PT0gMClcbiAgICAgIG4gKz0gdG9UaXRsZUNhc2UoYVtpXSk7XG4gICAgZWxzZVxuICAgICAgbiArPSAnICcgKyBhW2ldO1xuICB9XG4gIHJldHVybiBuO1xufVxuXG5jb25zdCBkZWZhdWx0VGVtcGxhdGUgPSBgXG4gIDwlIGRlZmluaXRpb25zLmZvckVhY2goKGRlZiwgaW5kZXgpID0+IHsgJT5cbiAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIDwlPSBkZWYuc3RhdGUgJT5cIlxuICAgICAgICAgICAgZGF0YS1pbmRleD1cIjwlPSBpbmRleCAlPlwiXG4gICAgICAgICAgICA8JT0gZGVmLnN0YXRlID09PSAnZGlzYWJsZWQnID8gJ2Rpc2FibGVkJyA6ICcnICU+XG4gICAgPlxuICAgICAgPCU9IGNvbnZlcnROYW1lKGRlZi5sYWJlbCkgJT5cbiAgICA8L2J1dHRvbj5cbiAgPCUgfSk7ICU+XG5gO1xuXG5cbi8qKlxuICogVmlldyB0byBkaXNwbGF5IGEgbGlzdCBvZiBidXR0b25zLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdXR0b25WaWV3IGV4dGVuZHMgVmlldyB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGRlZmluaXRpb25zIC0gQW4gYXJyYXkgb2YgZGVmaW5pdGlvbnMgZm9yIHRoZSBidXR0b25zLiBFYWNoIGRlZmluaXRpb25zIHNob3VsZCBjb250YWluIGEgYGxhYmVsYCBhbmQgYW4gb3B0aW9ubmFsIGBzdGF0ZWAgZW50cnkgKHZhbGlkIHZhbHVlcyBmb3IgYHN0YXRlc2AgYXJlIGAnc2VsZWN0ZWQnYCwgYCd1bnNlbGVjdGVkJ2Agb3IgYCdkaXNhYmxlZCdgKS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25TZWxlY3QgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgYnV0dG9uIGlzIHNlbGVjdGVkLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvblVuc2VsZWN0IC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIGJ1dHRvbiBpcyB1bnNlbGVjdGVkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubWF4U2VsZWN0ZWQ9MV0gLSBUaGUgbWF4aW11bSBwb3NzaWJsZSBzZWxlY3RlZCBidXR0b25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuZGVmYXVsdFN0YXRlPSd1bnNlbGVjdGVkJ10gLSBUaGUgc3RhdGUgdG8gYXBwbHkgd2hlbiBub3QgZGVmaW5lZCBpbiB0aGUgYnV0dG9ucyBkZWZpbml0aW9ucy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRlZmluaXRpb25zLCBvblNlbGVjdCwgb25VbnNlbGVjdCwgb3B0aW9ucykge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gb3B0aW9ucy50ZW1wbGF0ZSB8fMKgZGVmYXVsdFRlbXBsYXRlO1xuICAgIHN1cGVyKHRlbXBsYXRlLCB7IGRlZmluaXRpb25zLCBjb252ZXJ0TmFtZSB9LCB7fSwgeyBjbGFzc05hbWU6ICdidXR0b25zJyB9KTtcblxuICAgIHRoaXMuX2RlZmluaXRpb25zID0gZGVmaW5pdGlvbnM7XG4gICAgdGhpcy5fbWF4U2VsZWN0ZWQgPSBvcHRpb25zLm1heFNlbGVjdGVkIHx8wqAxO1xuICAgIHRoaXMuX3NlbGVjdGVkID0gW107XG5cbiAgICB0aGlzLm9uU2VsZWN0ID0gb25TZWxlY3Q7XG4gICAgdGhpcy5vblVuc2VsZWN0ID0gb25VbnNlbGVjdDtcblxuICAgIGNvbnN0IGRlZmF1bHRTdGF0ZSA9IG9wdGlvbnMuZGVmYXVsdFN0YXRlIHx8wqAndW5zZWxlY3RlZCc7XG4gICAgLy8gcG9wdWxhdGUgYHRoaXMuX3NlbGVjdGVkYFxuICAgIHRoaXMuX2RlZmluaXRpb25zLmZvckVhY2goKGRlZiwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChkZWYuc3RhdGUgPT09IHVuZGVmaW5lZCkgeyBkZWYuc3RhdGUgPT09IGRlZmF1bHRTdGF0ZTsgfVxuICAgICAgaWYgKGRlZi5zdGF0ZSA9PT0gJ3NlbGVjdGVkJykgeyB0aGlzLl9zZWxlY3RlZC5wdXNoKGluZGV4KTsgfVxuICAgIH0pO1xuXG4gICAgdGhpcy50b2dnbGUgPSB0aGlzLnRvZ2dsZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZXZlbnRzID0geyAnY2xpY2sgLmJ0bic6IHRoaXMudG9nZ2xlIH1cbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuJGVsLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIHRoaXMuJGVsLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgZGVmaW5pdGlvbiBhbmQgaXRzIHJlbGF0ZWQgYnV0dG9uIHRvIGBzZWxlY3RlZGAuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCAtIEluZGV4IG9mIHRoZSBkZWZpbml0aW9ucyBpbiB0aGUgbGlzdCBvZiBkZWZpbml0aW9ucy5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkYnRuIC0gVGhlIERPTSBlbGVtZW50IHJlbGF0ZWQgdG8gdGhpcyBkZWZpbml0aW9uLlxuICAgKi9cbiAgX3NlbGVjdChpbmRleCwgJGJ0bikge1xuICAgIGNvbnN0IGRlZiA9IHRoaXMuX2RlZmluaXRpb25zW2luZGV4XTtcbiAgICAkYnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3Vuc2VsZWN0ZWQnLCAnZGlzYWJsZWQnKTtcbiAgICAkYnRuLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XG4gICAgZGVmLnN0YXRlID0gJ3NlbGVjdGVkJztcblxuICAgIHRoaXMuX3NlbGVjdGVkLnB1c2goaW5kZXgpO1xuICAgIHRoaXMub25TZWxlY3QoaW5kZXgsIGRlZik7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIGRlZmluaXRpb24gYW5kIGl0cyByZWxhdGVkIGJ1dHRvbiB0byBgdW5zZWxlY3RlZGAuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCAtIEluZGV4IG9mIHRoZSBkZWZpbml0aW9ucyBpbiB0aGUgbGlzdCBvZiBkZWZpbml0aW9ucy5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkYnRuIC0gVGhlIERPTSBlbGVtZW50IHJlbGF0ZWQgdG8gdGhpcyBkZWZpbml0aW9uLlxuICAgKi9cbiAgX3Vuc2VsZWN0KGluZGV4LCAkYnRuKSB7XG4gICAgY29uc3QgZGVmID0gdGhpcy5fZGVmaW5pdGlvbnNbaW5kZXhdO1xuICAgICRidG4uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnLCAnZGlzYWJsZWQnKTtcbiAgICAkYnRuLmNsYXNzTGlzdC5hZGQoJ3Vuc2VsZWN0ZWQnKTtcbiAgICBkZWYuc3RhdGUgPSAndW5zZWxlY3RlZCc7XG5cbiAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gdGhpcy5fc2VsZWN0ZWQuaW5kZXhPZihpbmRleCk7XG5cbiAgICBpZiAoc2VsZWN0ZWRJbmRleCAhPT0gLTEpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkLnNwbGljZShzZWxlY3RlZEluZGV4LCAxKTtcbiAgICAgIHRoaXMub25VbnNlbGVjdChpbmRleCwgZGVmKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlIHRoZSBzdGF0ZSBvZiBhIGRlZmluaXRpb25zIGFuZCBpdHMgcmVsYXRlZCBidXR0b24uXG4gICAqIEBwYXJhbSB7RXZlbnR9IGUgLSBUaGUgZXZlbnQgdHJpZ2dlcmVkIGJ5IHRoZSB1c2VyIGFjdGlvbiAoYGNsaWNrYCkuXG4gICAqL1xuICB0b2dnbGUoZSkge1xuICAgIGNvbnN0ICR0YXJnZXQgPSBlLnRhcmdldDtcbiAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KCR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JykpO1xuICAgIGNvbnN0IGRlZiA9IHRoaXMuX2RlZmluaXRpb25zW2luZGV4XTtcbiAgICBjb25zdCBjdXJyZW50U3RhdGUgPSBkZWYuc3RhdGU7XG4gICAgY29uc3QgZXhlY3V0ZU1ldGhvZCA9IGN1cnJlbnRTdGF0ZSA9PT0gJ3NlbGVjdGVkJyA/ICdfdW5zZWxlY3QnIDogJ19zZWxlY3QnO1xuXG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkLmxlbmd0aCA+PSB0aGlzLl9tYXhTZWxlY3RlZCAmJiBleGVjdXRlTWV0aG9kID09PSAnc2VsZWN0Jykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXNbZXhlY3V0ZU1ldGhvZF0oaW5kZXgsICR0YXJnZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVuYWJsZSB0aGUgaW50ZXJhY3Rpb24gd2l0aCBhIGRlZmluaXRpb24gYW5kIGl0cyByZWxhdGVkIGJ1dHRvbi5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIGRlZmluaXRpb25zIGluIHRoZSBsaXN0IG9mIGRlZmluaXRpb25zLlxuICAgKi9cbiAgZW5hYmxlKGluZGV4KSB7XG4gICAgLy8gc2V0IHN0YXRlICd1bnNlbGVjdGVkJ1xuICAgIGNvbnN0ICR0YXJnZXQgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1pbmRleD1cIiR7aW5kZXh9XCJdYCk7XG4gICAgdGhpcy5fdW5zZWxlY3QoaW5kZXgsICR0YXJnZXQpO1xuXG4gICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZSB0aGUgaW50ZXJhY3Rpb24gd2l0aCBhIGRlZmluaXRpb24gYW5kIGl0cyByZWxhdGVkIGJ1dHRvbi5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIGRlZmluaXRpb25zIGluIHRoZSBsaXN0IG9mIGRlZmluaXRpb25zLlxuICAgKi9cbiAgZGlzYWJsZShpbmRleCkge1xuICAgIGNvbnN0ICR0YXJnZXQgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1pbmRleD1cIiR7aW5kZXh9XCJdYCk7XG4gICAgdGhpcy5fdW5zZWxlY3QoaW5kZXgsICR0YXJnZXQpO1xuXG4gICAgJHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCd1bnNlbGVjdGVkJyk7XG4gICAgJHRhcmdldC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpO1xuICB9XG59XG5cbiJdfQ==