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

var ButtonView = (function (_View) {
  _inherits(ButtonView, _View);

  /**
   * @param {Array<Object>} definitions - An array of definitions for the buttons. Each definitions should contain a `label` and an optionnal `state` entry (valid values for `states` are `'selected'`, `'unselected'` or `'disabled'`).
   * @param {Function} onSelect - The callback to execute when a button is selected.
   * @param {Function} onUnselect - The callback to execute when a button is unselected.
   * @param {Object} options
   * @param {Object} [options.maxSelected=1] - The maximum possible selected buttons.
   * @param {Object} [options.defaultState='unselected'] - The state to apply when not defined in the buttons definitions.
   */

  function ButtonView(definitions, onSelect, onUnselect, options) {
    var _this = this;

    _classCallCheck(this, ButtonView);

    var template = options.template || defaultTemplate;
    _get(Object.getPrototypeOf(ButtonView.prototype), 'constructor', this).call(this, template, { definitions: definitions, convertName: convertName }, {}, { className: 'buttons' });

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

  _createClass(ButtonView, [{
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
})(_View3['default']);

exports['default'] = ButtonView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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ZSI6InNyYy9zZXJ2ZXIvY29tbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XG5cbmZ1bmN0aW9uIHRvVGl0bGVDYXNlKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcd1xcUyovZywgZnVuY3Rpb24odHh0KSB7XG4gICAgcmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnROYW1lKG5hbWUpIHtcbiAgdmFyIGEgPSBuYW1lLnNwbGl0KCdfJyk7XG4gIHZhciBuID0gJyc7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpID09PSAwKVxuICAgICAgbiArPSB0b1RpdGxlQ2FzZShhW2ldKTtcbiAgICBlbHNlXG4gICAgICBuICs9ICcgJyArIGFbaV07XG4gIH1cbiAgcmV0dXJuIG47XG59XG5cbmNvbnN0IGRlZmF1bHRUZW1wbGF0ZSA9IGBcbiAgPCUgZGVmaW5pdGlvbnMuZm9yRWFjaCgoZGVmLCBpbmRleCkgPT4geyAlPlxuICAgIDxidXR0b24gY2xhc3M9XCJidG4gPCU9IGRlZi5zdGF0ZSAlPlwiXG4gICAgICAgICAgICBkYXRhLWluZGV4PVwiPCU9IGluZGV4ICU+XCJcbiAgICAgICAgICAgIDwlPSBkZWYuc3RhdGUgPT09ICdkaXNhYmxlZCcgPyAnZGlzYWJsZWQnIDogJycgJT5cbiAgICA+XG4gICAgICA8JT0gY29udmVydE5hbWUoZGVmLmxhYmVsKSAlPlxuICAgIDwvYnV0dG9uPlxuICA8JSB9KTsgJT5cbmA7XG5cblxuLyoqXG4gKiBWaWV3IHRvIGRpc3BsYXkgYSBsaXN0IG9mIGJ1dHRvbnMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1dHRvblZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gZGVmaW5pdGlvbnMgLSBBbiBhcnJheSBvZiBkZWZpbml0aW9ucyBmb3IgdGhlIGJ1dHRvbnMuIEVhY2ggZGVmaW5pdGlvbnMgc2hvdWxkIGNvbnRhaW4gYSBgbGFiZWxgIGFuZCBhbiBvcHRpb25uYWwgYHN0YXRlYCBlbnRyeSAodmFsaWQgdmFsdWVzIGZvciBgc3RhdGVzYCBhcmUgYCdzZWxlY3RlZCdgLCBgJ3Vuc2VsZWN0ZWQnYCBvciBgJ2Rpc2FibGVkJ2ApLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvblNlbGVjdCAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBidXR0b24gaXMgc2VsZWN0ZWQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uVW5zZWxlY3QgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgYnV0dG9uIGlzIHVuc2VsZWN0ZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5tYXhTZWxlY3RlZD0xXSAtIFRoZSBtYXhpbXVtIHBvc3NpYmxlIHNlbGVjdGVkIGJ1dHRvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5kZWZhdWx0U3RhdGU9J3Vuc2VsZWN0ZWQnXSAtIFRoZSBzdGF0ZSB0byBhcHBseSB3aGVuIG5vdCBkZWZpbmVkIGluIHRoZSBidXR0b25zIGRlZmluaXRpb25zLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGVmaW5pdGlvbnMsIG9uU2VsZWN0LCBvblVuc2VsZWN0LCBvcHRpb25zKSB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBvcHRpb25zLnRlbXBsYXRlIHx8wqBkZWZhdWx0VGVtcGxhdGU7XG4gICAgc3VwZXIodGVtcGxhdGUsIHsgZGVmaW5pdGlvbnMsIGNvbnZlcnROYW1lIH0sIHt9LCB7IGNsYXNzTmFtZTogJ2J1dHRvbnMnIH0pO1xuXG4gICAgdGhpcy5fZGVmaW5pdGlvbnMgPSBkZWZpbml0aW9ucztcbiAgICB0aGlzLl9tYXhTZWxlY3RlZCA9IG9wdGlvbnMubWF4U2VsZWN0ZWQgfHzCoDE7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSBbXTtcblxuICAgIHRoaXMub25TZWxlY3QgPSBvblNlbGVjdDtcbiAgICB0aGlzLm9uVW5zZWxlY3QgPSBvblVuc2VsZWN0O1xuXG4gICAgY29uc3QgZGVmYXVsdFN0YXRlID0gb3B0aW9ucy5kZWZhdWx0U3RhdGUgfHzCoCd1bnNlbGVjdGVkJztcbiAgICAvLyBwb3B1bGF0ZSBgdGhpcy5fc2VsZWN0ZWRgXG4gICAgdGhpcy5fZGVmaW5pdGlvbnMuZm9yRWFjaCgoZGVmLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGRlZi5zdGF0ZSA9PT0gdW5kZWZpbmVkKSB7IGRlZi5zdGF0ZSA9PT0gZGVmYXVsdFN0YXRlOyB9XG4gICAgICBpZiAoZGVmLnN0YXRlID09PSAnc2VsZWN0ZWQnKSB7IHRoaXMuX3NlbGVjdGVkLnB1c2goaW5kZXgpOyB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnRvZ2dsZSA9IHRoaXMudG9nZ2xlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5ldmVudHMgPSB7ICdjbGljayAuYnRuJzogdGhpcy50b2dnbGUgfVxuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy4kZWwuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgdGhpcy4kZWwuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSBkZWZpbml0aW9uIGFuZCBpdHMgcmVsYXRlZCBidXR0b24gdG8gYHNlbGVjdGVkYC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIGRlZmluaXRpb25zIGluIHRoZSBsaXN0IG9mIGRlZmluaXRpb25zLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRidG4gLSBUaGUgRE9NIGVsZW1lbnQgcmVsYXRlZCB0byB0aGlzIGRlZmluaXRpb24uXG4gICAqL1xuICBfc2VsZWN0KGluZGV4LCAkYnRuKSB7XG4gICAgY29uc3QgZGVmID0gdGhpcy5fZGVmaW5pdGlvbnNbaW5kZXhdO1xuICAgICRidG4uY2xhc3NMaXN0LnJlbW92ZSgndW5zZWxlY3RlZCcsICdkaXNhYmxlZCcpO1xuICAgICRidG4uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcbiAgICBkZWYuc3RhdGUgPSAnc2VsZWN0ZWQnO1xuXG4gICAgdGhpcy5fc2VsZWN0ZWQucHVzaChpbmRleCk7XG4gICAgdGhpcy5vblNlbGVjdChpbmRleCwgZGVmKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgZGVmaW5pdGlvbiBhbmQgaXRzIHJlbGF0ZWQgYnV0dG9uIHRvIGB1bnNlbGVjdGVkYC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIGRlZmluaXRpb25zIGluIHRoZSBsaXN0IG9mIGRlZmluaXRpb25zLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRidG4gLSBUaGUgRE9NIGVsZW1lbnQgcmVsYXRlZCB0byB0aGlzIGRlZmluaXRpb24uXG4gICAqL1xuICBfdW5zZWxlY3QoaW5kZXgsICRidG4pIHtcbiAgICBjb25zdCBkZWYgPSB0aGlzLl9kZWZpbml0aW9uc1tpbmRleF07XG4gICAgJGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcsICdkaXNhYmxlZCcpO1xuICAgICRidG4uY2xhc3NMaXN0LmFkZCgndW5zZWxlY3RlZCcpO1xuICAgIGRlZi5zdGF0ZSA9ICd1bnNlbGVjdGVkJztcblxuICAgIGNvbnN0IHNlbGVjdGVkSW5kZXggPSB0aGlzLl9zZWxlY3RlZC5pbmRleE9mKGluZGV4KTtcblxuICAgIGlmIChzZWxlY3RlZEluZGV4ICE9PSAtMSkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQuc3BsaWNlKHNlbGVjdGVkSW5kZXgsIDEpO1xuICAgICAgdGhpcy5vblVuc2VsZWN0KGluZGV4LCBkZWYpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgdGhlIHN0YXRlIG9mIGEgZGVmaW5pdGlvbnMgYW5kIGl0cyByZWxhdGVkIGJ1dHRvbi5cbiAgICogQHBhcmFtIHtFdmVudH0gZSAtIFRoZSBldmVudCB0cmlnZ2VyZWQgYnkgdGhlIHVzZXIgYWN0aW9uIChgY2xpY2tgKS5cbiAgICovXG4gIHRvZ2dsZShlKSB7XG4gICAgY29uc3QgJHRhcmdldCA9IGUudGFyZ2V0O1xuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKSk7XG4gICAgY29uc3QgZGVmID0gdGhpcy5fZGVmaW5pdGlvbnNbaW5kZXhdO1xuICAgIGNvbnN0IGN1cnJlbnRTdGF0ZSA9IGRlZi5zdGF0ZTtcbiAgICBjb25zdCBleGVjdXRlTWV0aG9kID0gY3VycmVudFN0YXRlID09PSAnc2VsZWN0ZWQnID8gJ191bnNlbGVjdCcgOiAnX3NlbGVjdCc7XG5cbiAgICBpZiAodGhpcy5fc2VsZWN0ZWQubGVuZ3RoID49IHRoaXMuX21heFNlbGVjdGVkICYmIGV4ZWN1dGVNZXRob2QgPT09ICdzZWxlY3QnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpc1tleGVjdXRlTWV0aG9kXShpbmRleCwgJHRhcmdldCk7XG4gIH1cblxuICAvKipcbiAgICogVW5hYmxlIHRoZSBpbnRlcmFjdGlvbiB3aXRoIGEgZGVmaW5pdGlvbiBhbmQgaXRzIHJlbGF0ZWQgYnV0dG9uLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgZGVmaW5pdGlvbnMgaW4gdGhlIGxpc3Qgb2YgZGVmaW5pdGlvbnMuXG4gICAqL1xuICBlbmFibGUoaW5kZXgpIHtcbiAgICAvLyBzZXQgc3RhdGUgJ3Vuc2VsZWN0ZWQnXG4gICAgY29uc3QgJHRhcmdldCA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWluZGV4PVwiJHtpbmRleH1cIl1gKTtcbiAgICB0aGlzLl91bnNlbGVjdChpbmRleCwgJHRhcmdldCk7XG5cbiAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlIHRoZSBpbnRlcmFjdGlvbiB3aXRoIGEgZGVmaW5pdGlvbiBhbmQgaXRzIHJlbGF0ZWQgYnV0dG9uLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgZGVmaW5pdGlvbnMgaW4gdGhlIGxpc3Qgb2YgZGVmaW5pdGlvbnMuXG4gICAqL1xuICBkaXNhYmxlKGluZGV4KSB7XG4gICAgY29uc3QgJHRhcmdldCA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWluZGV4PVwiJHtpbmRleH1cIl1gKTtcbiAgICB0aGlzLl91bnNlbGVjdChpbmRleCwgJHRhcmdldCk7XG5cbiAgICAkdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Vuc2VsZWN0ZWQnKTtcbiAgICAkdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gIH1cbn1cblxuIl19