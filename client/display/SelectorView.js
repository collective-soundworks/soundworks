'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

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

var SelectorView = (function (_View) {
  _inherits(SelectorView, _View);

  /**
   * @param {Array<Object>} definitions - An array of definitions for the buttons. Each definitions should contain a `label` and an optionnal `state` entry (valid values for `states` are `'selected'`, `'unselected'` or `'disabled'`).
   * @param {Function} onSelect - The callback to execute when a button is selected.
   * @param {Function} onUnselect - The callback to execute when a button is unselected.
   * @param {Object} options
   * @param {Object} [options.maxSelected=1] - The maximum possible selected buttons.
   * @param {Object} [options.defaultState='unselected'] - The state to apply when not defined in the buttons definitions.
   */

  function SelectorView(definitions, onSelect, onUnselect, options) {
    var _this = this;

    _classCallCheck(this, SelectorView);

    var template = options.template || defaultTemplate;
    _get(Object.getPrototypeOf(SelectorView.prototype), 'constructor', this).call(this, template, { definitions: definitions, convertName: convertName }, {}, { className: 'selector' });

    this._definitions = definitions;
    this._maxSelected = options.maxSelected || 1;
    this._selected = [];

    this.onSelect = onSelect;
    this.onUnselect = onUnselect;

    var defaultState = options.defaultState || 'unselected';
    // populate `this._selected`
    this._definitions.forEach(function (def, index) {
      if (def.state === undefined) {
        def.state === defaultState;
      }
      if (def.state === 'selected') {
        _this._selected.push(index);
      }
    });

    this.toggle = this.toggle.bind(this);
    this.events = { 'click .btn': this.toggle };
  }

  _createClass(SelectorView, [{
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
      console.log(this._selected);
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

  return SelectorView;
})(_View3['default']);

exports['default'] = SelectorView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TZWxlY3RvclZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztxQkFBaUIsUUFBUTs7OztBQUV6QixTQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUU7QUFDeEIsU0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFTLEdBQUcsRUFBRTtBQUN6QyxXQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztHQUNsRSxDQUFDLENBQUM7Q0FDSjs7QUFFRCxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUU7QUFDekIsTUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QixNQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDWCxPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNqQyxRQUFJLENBQUMsS0FBSyxDQUFDLEVBQ1QsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUV2QixDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNuQjtBQUNELFNBQU8sQ0FBQyxDQUFDO0NBQ1Y7O0FBRUQsSUFBTSxlQUFlLG9SQVNwQixDQUFDOzs7Ozs7SUFNbUIsWUFBWTtZQUFaLFlBQVk7Ozs7Ozs7Ozs7O0FBU3BCLFdBVFEsWUFBWSxDQVNuQixXQUFXLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUU7OzswQkFUckMsWUFBWTs7QUFVN0IsUUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxlQUFlLENBQUM7QUFDckQsK0JBWGlC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QUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN4Qzs7O1NBaEhrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiJzcmMvY2xpZW50L2Rpc3BsYXkvU2VsZWN0b3JWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3JztcblxuZnVuY3Rpb24gdG9UaXRsZUNhc2Uoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXFx3XFxTKi9nLCBmdW5jdGlvbih0eHQpIHtcbiAgICByZXR1cm4gdHh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY29udmVydE5hbWUobmFtZSkge1xuICB2YXIgYSA9IG5hbWUuc3BsaXQoJ18nKTtcbiAgdmFyIG4gPSAnJztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGkgPT09IDApXG4gICAgICBuICs9IHRvVGl0bGVDYXNlKGFbaV0pO1xuICAgIGVsc2VcbiAgICAgIG4gKz0gJyAnICsgYVtpXTtcbiAgfVxuICByZXR1cm4gbjtcbn1cblxuY29uc3QgZGVmYXVsdFRlbXBsYXRlID0gYFxuICA8JSBkZWZpbml0aW9ucy5mb3JFYWNoKChkZWYsIGluZGV4KSA9PiB7ICU+XG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ0biA8JT0gZGVmLnN0YXRlICU+XCJcbiAgICAgICAgICAgIGRhdGEtaW5kZXg9XCI8JT0gaW5kZXggJT5cIlxuICAgICAgICAgICAgPCU9IGRlZi5zdGF0ZSA9PT0gJ2Rpc2FibGVkJyA/ICdkaXNhYmxlZCcgOiAnJyAlPlxuICAgID5cbiAgICAgIDwlPSBjb252ZXJ0TmFtZShkZWYubGFiZWwpICU+XG4gICAgPC9idXR0b24+XG4gIDwlIH0pOyAlPlxuYDtcblxuXG4vKipcbiAqIFZpZXcgdG8gZGlzcGxheSBhIGxpc3Qgb2YgYnV0dG9ucy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0b3JWaWV3IGV4dGVuZHMgVmlldyB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGRlZmluaXRpb25zIC0gQW4gYXJyYXkgb2YgZGVmaW5pdGlvbnMgZm9yIHRoZSBidXR0b25zLiBFYWNoIGRlZmluaXRpb25zIHNob3VsZCBjb250YWluIGEgYGxhYmVsYCBhbmQgYW4gb3B0aW9ubmFsIGBzdGF0ZWAgZW50cnkgKHZhbGlkIHZhbHVlcyBmb3IgYHN0YXRlc2AgYXJlIGAnc2VsZWN0ZWQnYCwgYCd1bnNlbGVjdGVkJ2Agb3IgYCdkaXNhYmxlZCdgKS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25TZWxlY3QgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgYnV0dG9uIGlzIHNlbGVjdGVkLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvblVuc2VsZWN0IC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIGJ1dHRvbiBpcyB1bnNlbGVjdGVkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubWF4U2VsZWN0ZWQ9MV0gLSBUaGUgbWF4aW11bSBwb3NzaWJsZSBzZWxlY3RlZCBidXR0b25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuZGVmYXVsdFN0YXRlPSd1bnNlbGVjdGVkJ10gLSBUaGUgc3RhdGUgdG8gYXBwbHkgd2hlbiBub3QgZGVmaW5lZCBpbiB0aGUgYnV0dG9ucyBkZWZpbml0aW9ucy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRlZmluaXRpb25zLCBvblNlbGVjdCwgb25VbnNlbGVjdCwgb3B0aW9ucykge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gb3B0aW9ucy50ZW1wbGF0ZSB8fMKgZGVmYXVsdFRlbXBsYXRlO1xuICAgIHN1cGVyKHRlbXBsYXRlLCB7IGRlZmluaXRpb25zLCBjb252ZXJ0TmFtZSB9LCB7fSwgeyBjbGFzc05hbWU6ICdzZWxlY3RvcicgfSk7XG5cbiAgICB0aGlzLl9kZWZpbml0aW9ucyA9IGRlZmluaXRpb25zO1xuICAgIHRoaXMuX21heFNlbGVjdGVkID0gb3B0aW9ucy5tYXhTZWxlY3RlZCB8fMKgMTtcbiAgICB0aGlzLl9zZWxlY3RlZCA9IFtdO1xuXG4gICAgdGhpcy5vblNlbGVjdCA9IG9uU2VsZWN0O1xuICAgIHRoaXMub25VbnNlbGVjdCA9IG9uVW5zZWxlY3Q7XG5cbiAgICBjb25zdCBkZWZhdWx0U3RhdGUgPSBvcHRpb25zLmRlZmF1bHRTdGF0ZSB8fMKgJ3Vuc2VsZWN0ZWQnO1xuICAgIC8vIHBvcHVsYXRlIGB0aGlzLl9zZWxlY3RlZGBcbiAgICB0aGlzLl9kZWZpbml0aW9ucy5mb3JFYWNoKChkZWYsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoZGVmLnN0YXRlID09PSB1bmRlZmluZWQpIHsgZGVmLnN0YXRlID09PSBkZWZhdWx0U3RhdGU7IH1cbiAgICAgIGlmIChkZWYuc3RhdGUgPT09ICdzZWxlY3RlZCcpIHsgdGhpcy5fc2VsZWN0ZWQucHVzaChpbmRleCk7IH1cbiAgICB9KTtcblxuICAgIHRoaXMudG9nZ2xlID0gdGhpcy50b2dnbGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmV2ZW50cyA9IHsgJ2NsaWNrIC5idG4nOiB0aGlzLnRvZ2dsZSB9XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICB0aGlzLiRlbC5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICB0aGlzLiRlbC5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIGRlZmluaXRpb24gYW5kIGl0cyByZWxhdGVkIGJ1dHRvbiB0byBgc2VsZWN0ZWRgLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgZGVmaW5pdGlvbnMgaW4gdGhlIGxpc3Qgb2YgZGVmaW5pdGlvbnMuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGJ0biAtIFRoZSBET00gZWxlbWVudCByZWxhdGVkIHRvIHRoaXMgZGVmaW5pdGlvbi5cbiAgICovXG4gIF9zZWxlY3QoaW5kZXgsICRidG4pIHtcbiAgICBjb25zdCBkZWYgPSB0aGlzLl9kZWZpbml0aW9uc1tpbmRleF07XG4gICAgJGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCd1bnNlbGVjdGVkJywgJ2Rpc2FibGVkJyk7XG4gICAgJGJ0bi5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuICAgIGRlZi5zdGF0ZSA9ICdzZWxlY3RlZCc7XG5cbiAgICB0aGlzLl9zZWxlY3RlZC5wdXNoKGluZGV4KTtcbiAgICB0aGlzLm9uU2VsZWN0KGluZGV4LCBkZWYpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSBkZWZpbml0aW9uIGFuZCBpdHMgcmVsYXRlZCBidXR0b24gdG8gYHVuc2VsZWN0ZWRgLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgZGVmaW5pdGlvbnMgaW4gdGhlIGxpc3Qgb2YgZGVmaW5pdGlvbnMuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGJ0biAtIFRoZSBET00gZWxlbWVudCByZWxhdGVkIHRvIHRoaXMgZGVmaW5pdGlvbi5cbiAgICovXG4gIF91bnNlbGVjdChpbmRleCwgJGJ0bikge1xuICAgIGNvbnN0IGRlZiA9IHRoaXMuX2RlZmluaXRpb25zW2luZGV4XTtcbiAgICAkYnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJywgJ2Rpc2FibGVkJyk7XG4gICAgJGJ0bi5jbGFzc0xpc3QuYWRkKCd1bnNlbGVjdGVkJyk7XG4gICAgZGVmLnN0YXRlID0gJ3Vuc2VsZWN0ZWQnO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IHRoaXMuX3NlbGVjdGVkLmluZGV4T2YoaW5kZXgpO1xuXG4gICAgaWYgKHNlbGVjdGVkSW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZC5zcGxpY2Uoc2VsZWN0ZWRJbmRleCwgMSk7XG4gICAgICB0aGlzLm9uVW5zZWxlY3QoaW5kZXgsIGRlZik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGUgc3RhdGUgb2YgYSBkZWZpbml0aW9ucyBhbmQgaXRzIHJlbGF0ZWQgYnV0dG9uLlxuICAgKiBAcGFyYW0ge0V2ZW50fSBlIC0gVGhlIGV2ZW50IHRyaWdnZXJlZCBieSB0aGUgdXNlciBhY3Rpb24gKGBjbGlja2ApLlxuICAgKi9cbiAgdG9nZ2xlKGUpIHtcbiAgICBjb25zdCAkdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgY29uc3QgaW5kZXggPSBwYXJzZUludCgkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcpKTtcbiAgICBjb25zdCBkZWYgPSB0aGlzLl9kZWZpbml0aW9uc1tpbmRleF07XG4gICAgY29uc3QgY3VycmVudFN0YXRlID0gZGVmLnN0YXRlO1xuICAgIGNvbnN0IGV4ZWN1dGVNZXRob2QgPSBjdXJyZW50U3RhdGUgPT09ICdzZWxlY3RlZCcgPyAnX3Vuc2VsZWN0JyA6ICdfc2VsZWN0JztcblxuICAgIGlmICh0aGlzLl9zZWxlY3RlZC5sZW5ndGggPj0gdGhpcy5fbWF4U2VsZWN0ZWQgJiYgZXhlY3V0ZU1ldGhvZCA9PT0gJ3NlbGVjdCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzW2V4ZWN1dGVNZXRob2RdKGluZGV4LCAkdGFyZ2V0KTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLl9zZWxlY3RlZCk7XG4gIH1cblxuICAvKipcbiAgICogVW5hYmxlIHRoZSBpbnRlcmFjdGlvbiB3aXRoIGEgZGVmaW5pdGlvbiBhbmQgaXRzIHJlbGF0ZWQgYnV0dG9uLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgZGVmaW5pdGlvbnMgaW4gdGhlIGxpc3Qgb2YgZGVmaW5pdGlvbnMuXG4gICAqL1xuICBlbmFibGUoaW5kZXgpIHtcbiAgICAvLyBzZXQgc3RhdGUgJ3Vuc2VsZWN0ZWQnXG4gICAgY29uc3QgJHRhcmdldCA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWluZGV4PVwiJHtpbmRleH1cIl1gKTtcbiAgICB0aGlzLl91bnNlbGVjdChpbmRleCwgJHRhcmdldCk7XG5cbiAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlIHRoZSBpbnRlcmFjdGlvbiB3aXRoIGEgZGVmaW5pdGlvbiBhbmQgaXRzIHJlbGF0ZWQgYnV0dG9uLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgZGVmaW5pdGlvbnMgaW4gdGhlIGxpc3Qgb2YgZGVmaW5pdGlvbnMuXG4gICAqL1xuICBkaXNhYmxlKGluZGV4KSB7XG4gICAgY29uc3QgJHRhcmdldCA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWluZGV4PVwiJHtpbmRleH1cIl1gKTtcbiAgICB0aGlzLl91bnNlbGVjdChpbmRleCwgJHRhcmdldCk7XG5cbiAgICAkdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Vuc2VsZWN0ZWQnKTtcbiAgICAkdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gIH1cbn1cblxuIl19