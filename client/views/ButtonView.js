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
//# sourceMappingURL=data:application/json;base64,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QixZQUF6QjtBQUNBLGNBQVEsU0FBUixDQUFrQixHQUFsQixDQUFzQixVQUF0QjtBQUNBLGNBQVEsWUFBUixDQUFxQixVQUFyQixFQUFpQyxJQUFqQztBQUNEOzs7OztrQkEvR2tCLFUiLCJmaWxlIjoiQnV0dG9uVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XG5cbmZ1bmN0aW9uIHRvVGl0bGVDYXNlKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcd1xcUyovZywgZnVuY3Rpb24odHh0KSB7XG4gICAgcmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnROYW1lKG5hbWUpIHtcbiAgdmFyIGEgPSBuYW1lLnNwbGl0KCdfJyk7XG4gIHZhciBuID0gJyc7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpID09PSAwKVxuICAgICAgbiArPSB0b1RpdGxlQ2FzZShhW2ldKTtcbiAgICBlbHNlXG4gICAgICBuICs9ICcgJyArIGFbaV07XG4gIH1cbiAgcmV0dXJuIG47XG59XG5cbmNvbnN0IGRlZmF1bHRUZW1wbGF0ZSA9IGBcbiAgPCUgZGVmaW5pdGlvbnMuZm9yRWFjaCgoZGVmLCBpbmRleCkgPT4geyAlPlxuICAgIDxidXR0b24gY2xhc3M9XCJidG4gPCU9IGRlZi5zdGF0ZSAlPlwiXG4gICAgICAgICAgICBkYXRhLWluZGV4PVwiPCU9IGluZGV4ICU+XCJcbiAgICAgICAgICAgIDwlPSBkZWYuc3RhdGUgPT09ICdkaXNhYmxlZCcgPyAnZGlzYWJsZWQnIDogJycgJT5cbiAgICA+XG4gICAgICA8JT0gY29udmVydE5hbWUoZGVmLmxhYmVsKSAlPlxuICAgIDwvYnV0dG9uPlxuICA8JSB9KTsgJT5cbmA7XG5cblxuLyoqXG4gKiBWaWV3IHRvIGRpc3BsYXkgYSBsaXN0IG9mIGJ1dHRvbnMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1dHRvblZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gZGVmaW5pdGlvbnMgLSBBbiBhcnJheSBvZiBkZWZpbml0aW9ucyBmb3IgdGhlIGJ1dHRvbnMuIEVhY2ggZGVmaW5pdGlvbnMgc2hvdWxkIGNvbnRhaW4gYSBgbGFiZWxgIGFuZCBhbiBvcHRpb25uYWwgYHN0YXRlYCBlbnRyeSAodmFsaWQgdmFsdWVzIGZvciBgc3RhdGVzYCBhcmUgYCdzZWxlY3RlZCdgLCBgJ3Vuc2VsZWN0ZWQnYCBvciBgJ2Rpc2FibGVkJ2ApLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvblNlbGVjdCAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBidXR0b24gaXMgc2VsZWN0ZWQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uVW5zZWxlY3QgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgYnV0dG9uIGlzIHVuc2VsZWN0ZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5tYXhTZWxlY3RlZD0xXSAtIFRoZSBtYXhpbXVtIHBvc3NpYmxlIHNlbGVjdGVkIGJ1dHRvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5kZWZhdWx0U3RhdGU9J3Vuc2VsZWN0ZWQnXSAtIFRoZSBzdGF0ZSB0byBhcHBseSB3aGVuIG5vdCBkZWZpbmVkIGluIHRoZSBidXR0b25zIGRlZmluaXRpb25zLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGVmaW5pdGlvbnMsIG9uU2VsZWN0LCBvblVuc2VsZWN0LCBvcHRpb25zKSB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBvcHRpb25zLnRlbXBsYXRlIHx8wqBkZWZhdWx0VGVtcGxhdGU7XG4gICAgc3VwZXIodGVtcGxhdGUsIHsgZGVmaW5pdGlvbnMsIGNvbnZlcnROYW1lIH0sIHt9LCB7IGNsYXNzTmFtZTogJ2J1dHRvbnMnIH0pO1xuXG4gICAgdGhpcy5fZGVmaW5pdGlvbnMgPSBkZWZpbml0aW9ucztcbiAgICB0aGlzLl9tYXhTZWxlY3RlZCA9IG9wdGlvbnMubWF4U2VsZWN0ZWQgfHzCoDE7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSBbXTtcblxuICAgIHRoaXMub25TZWxlY3QgPSBvblNlbGVjdDtcbiAgICB0aGlzLm9uVW5zZWxlY3QgPSBvblVuc2VsZWN0O1xuXG4gICAgY29uc3QgZGVmYXVsdFN0YXRlID0gb3B0aW9ucy5kZWZhdWx0U3RhdGUgfHzCoCd1bnNlbGVjdGVkJztcbiAgICAvLyBwb3B1bGF0ZSBgdGhpcy5fc2VsZWN0ZWRgXG4gICAgdGhpcy5fZGVmaW5pdGlvbnMuZm9yRWFjaCgoZGVmLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGRlZi5zdGF0ZSA9PT0gdW5kZWZpbmVkKSB7IGRlZi5zdGF0ZSA9PT0gZGVmYXVsdFN0YXRlOyB9XG4gICAgICBpZiAoZGVmLnN0YXRlID09PSAnc2VsZWN0ZWQnKSB7IHRoaXMuX3NlbGVjdGVkLnB1c2goaW5kZXgpOyB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnRvZ2dsZSA9IHRoaXMudG9nZ2xlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5ldmVudHMgPSB7ICdjbGljayAuYnRuJzogdGhpcy50b2dnbGUgfVxuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy4kZWwuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgdGhpcy4kZWwuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSBkZWZpbml0aW9uIGFuZCBpdHMgcmVsYXRlZCBidXR0b24gdG8gYHNlbGVjdGVkYC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIGRlZmluaXRpb25zIGluIHRoZSBsaXN0IG9mIGRlZmluaXRpb25zLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRidG4gLSBUaGUgRE9NIGVsZW1lbnQgcmVsYXRlZCB0byB0aGlzIGRlZmluaXRpb24uXG4gICAqL1xuICBfc2VsZWN0KGluZGV4LCAkYnRuKSB7XG4gICAgY29uc3QgZGVmID0gdGhpcy5fZGVmaW5pdGlvbnNbaW5kZXhdO1xuICAgICRidG4uY2xhc3NMaXN0LnJlbW92ZSgndW5zZWxlY3RlZCcsICdkaXNhYmxlZCcpO1xuICAgICRidG4uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcbiAgICBkZWYuc3RhdGUgPSAnc2VsZWN0ZWQnO1xuXG4gICAgdGhpcy5fc2VsZWN0ZWQucHVzaChpbmRleCk7XG4gICAgdGhpcy5vblNlbGVjdChpbmRleCwgZGVmKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgZGVmaW5pdGlvbiBhbmQgaXRzIHJlbGF0ZWQgYnV0dG9uIHRvIGB1bnNlbGVjdGVkYC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIGRlZmluaXRpb25zIGluIHRoZSBsaXN0IG9mIGRlZmluaXRpb25zLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRidG4gLSBUaGUgRE9NIGVsZW1lbnQgcmVsYXRlZCB0byB0aGlzIGRlZmluaXRpb24uXG4gICAqL1xuICBfdW5zZWxlY3QoaW5kZXgsICRidG4pIHtcbiAgICBjb25zdCBkZWYgPSB0aGlzLl9kZWZpbml0aW9uc1tpbmRleF07XG4gICAgJGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcsICdkaXNhYmxlZCcpO1xuICAgICRidG4uY2xhc3NMaXN0LmFkZCgndW5zZWxlY3RlZCcpO1xuICAgIGRlZi5zdGF0ZSA9ICd1bnNlbGVjdGVkJztcblxuICAgIGNvbnN0IHNlbGVjdGVkSW5kZXggPSB0aGlzLl9zZWxlY3RlZC5pbmRleE9mKGluZGV4KTtcblxuICAgIGlmIChzZWxlY3RlZEluZGV4ICE9PSAtMSkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQuc3BsaWNlKHNlbGVjdGVkSW5kZXgsIDEpO1xuICAgICAgdGhpcy5vblVuc2VsZWN0KGluZGV4LCBkZWYpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgdGhlIHN0YXRlIG9mIGEgZGVmaW5pdGlvbnMgYW5kIGl0cyByZWxhdGVkIGJ1dHRvbi5cbiAgICogQHBhcmFtIHtFdmVudH0gZSAtIFRoZSBldmVudCB0cmlnZ2VyZWQgYnkgdGhlIHVzZXIgYWN0aW9uIChgY2xpY2tgKS5cbiAgICovXG4gIHRvZ2dsZShlKSB7XG4gICAgY29uc3QgJHRhcmdldCA9IGUudGFyZ2V0O1xuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKSk7XG4gICAgY29uc3QgZGVmID0gdGhpcy5fZGVmaW5pdGlvbnNbaW5kZXhdO1xuICAgIGNvbnN0IGN1cnJlbnRTdGF0ZSA9IGRlZi5zdGF0ZTtcbiAgICBjb25zdCBleGVjdXRlTWV0aG9kID0gY3VycmVudFN0YXRlID09PSAnc2VsZWN0ZWQnID8gJ191bnNlbGVjdCcgOiAnX3NlbGVjdCc7XG5cbiAgICBpZiAodGhpcy5fc2VsZWN0ZWQubGVuZ3RoID49IHRoaXMuX21heFNlbGVjdGVkICYmIGV4ZWN1dGVNZXRob2QgPT09ICdzZWxlY3QnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpc1tleGVjdXRlTWV0aG9kXShpbmRleCwgJHRhcmdldCk7XG4gIH1cblxuICAvKipcbiAgICogVW5hYmxlIHRoZSBpbnRlcmFjdGlvbiB3aXRoIGEgZGVmaW5pdGlvbiBhbmQgaXRzIHJlbGF0ZWQgYnV0dG9uLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgZGVmaW5pdGlvbnMgaW4gdGhlIGxpc3Qgb2YgZGVmaW5pdGlvbnMuXG4gICAqL1xuICBlbmFibGUoaW5kZXgpIHtcbiAgICAvLyBzZXQgc3RhdGUgJ3Vuc2VsZWN0ZWQnXG4gICAgY29uc3QgJHRhcmdldCA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWluZGV4PVwiJHtpbmRleH1cIl1gKTtcbiAgICB0aGlzLl91bnNlbGVjdChpbmRleCwgJHRhcmdldCk7XG5cbiAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlIHRoZSBpbnRlcmFjdGlvbiB3aXRoIGEgZGVmaW5pdGlvbiBhbmQgaXRzIHJlbGF0ZWQgYnV0dG9uLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgZGVmaW5pdGlvbnMgaW4gdGhlIGxpc3Qgb2YgZGVmaW5pdGlvbnMuXG4gICAqL1xuICBkaXNhYmxlKGluZGV4KSB7XG4gICAgY29uc3QgJHRhcmdldCA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWluZGV4PVwiJHtpbmRleH1cIl1gKTtcbiAgICB0aGlzLl91bnNlbGVjdChpbmRleCwgJHRhcmdldCk7XG5cbiAgICAkdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Vuc2VsZWN0ZWQnKTtcbiAgICAkdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gIH1cbn1cbiJdfQ==