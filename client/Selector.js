'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function convertName(name) {
  var a = name.split("_");
  var n = "";
  for (var i = 0; i < a.length; i++) {
    if (i === 0) n += toTitleCase(a[i]);else n += " " + a[i];
  }
  return n;
}

/**
 * [client] Allow to select one or several options among a list.
 */

var Selector = (function (_ClientModule) {
  _inherits(Selector, _ClientModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='selector'] Name of the module.
   * @param {DOMElement} [options.view] The view in which to display the list.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String[]} [options.labels=[]] Labels of the list options.
   * @param {String[]} [options.states=[]] States of each list option. Authorized values are:
   * - '`disabled`': the option is disabled (unselectable)
   * - '`unselected`': the option is unselected.
   * - `'selected'`: the options is selected.
   * @param {String} [options.defaultState='unselected'] Default state of the list options. Authorized values are:
   * - '`disabled`': the option is disabled (unselectable)
   * - '`unselected`': the option is unselected.
   * - `'selected'`: the options is selected.
   */

  function Selector() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Selector);

    _get(Object.getPrototypeOf(Selector.prototype), 'constructor', this).call(this, options.name || 'selector', !options.view, options.color || 'black');

    /**
     * Labels of the options.
     * @type {String[]}
     */
    this.labels = options.labels || [];

    /**
     * Current states of the options.
     * @type {String[]}
     */
    this.states = options.states || [];

    /**
     * Maximum number of simultaneously selected options.
     * @type {Number}
     */
    this.maxSelected = 1;

    /**
     * Currently selected options.
     * @type {String[]}
     */
    this.selected = [];

    if (typeof options.maxSelected !== 'undefined') this.maxSelected = options.maxSelected;

    if (options.view) {
      /**
       * View of the parent module
       * @type {DOMElement}
       */
      this.view = options.view;

      /**
       * @private
       */
      this.isDone = undefined; // skip super.done()
    }

    this._defaultState = options.defaultState || 'unselected';
    this._buttons = [];
    this._listeners = [];
  }

  _createClass(Selector, [{
    key: '_setupButton',
    value: function _setupButton(index, label, state) {
      var button = document.createElement('div');
      button.classList.add('btn');
      button.innerHTML = convertName(label);
      this._buttons[index] = button;

      switch (state) {
        case 'disabled':
          button.classList.add('disabled');
          break;

        case 'unselected':
          this.enable(index);
          break;

        case 'selected':
          this.enable(index);
          this.select(index);
          break;
      }

      this.view.appendChild(button);
    }

    /**
     * Starts the module.
     * @private
     */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Selector.prototype), 'start', this).call(this);

      for (var i = 0; i < this._labels.length; i++) {
        var label = this._labels[i];
        var state = this._defaultState;

        if (i < this.states.length) state = this.states[i];

        this.states[i] = 'disabled';
        this._listeners[i] = null;
        this._setupButton(i, label, state);
      }
    }

    /**
     * Resets the module.
     * @private
     */
  }, {
    key: 'reset',
    value: function reset() {
      var buttons = this.view.querySelectorAll('.btn');
      for (var i = 0; i < buttons.length; i++) {
        this.view.removeChild(buttons[i]);
      }this.selected = [];
      this._buttons = [];
      this._listeners = [];
    }

    /**
     * Restarts the module.
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {}
    // TODO

    /**
     * Selects an option.
     * @param {Number} index The option index to select.
     * @emits {'selector:select', index:Number, label:String} The index and label of the selected option.
     * @return {Boolean} Indicates whether the option was successfully selected or not.
     */

  }, {
    key: 'select',
    value: function select(index) {
      var state = this.states[index];

      if (state === 'unselected') {
        // steal oldest selected
        if (this.selected.length === this.maxSelected) this.unselect(this.selected[0]);

        var button = this._buttons[index];

        button.classList.add('selected');
        this.states[index] = 'selected';

        // add to list of selected buttons
        this.selected.push(index);

        var label = this.labels[index];
        this.emit('selector:select', index, label);

        if (this.selected.length === this.maxSelected) this.done(); // TODO: beware, might cause problems with the launch thing

        return true;
      }

      return false;
    }

    /**
     * Unselects an option.
     * @param {Number} index The option index to unselect.
     * @emits {'selector:unselect', index:Number, label:String} The index and label of the unselected option.
     * @return {Boolean} Indicates whether the option was successfully unselected or not.
     */
  }, {
    key: 'unselect',
    value: function unselect(index) {
      var state = this.states[index];

      if (state === 'selected') {
        var button = this._buttons[index];

        button.classList.remove('selected');
        this.states[index] = 'unselected';

        // unselect oldest selected button
        var selectedIndex = this.selected.indexOf(index);
        this.selected.splice(selectedIndex, 1);

        var label = this.labels[index];
        this.emit('selector:unselect', index, label);

        return false;
      }

      return true;
    }

    /**
     * Toggles an option.
     * @param {Number} index The index of the option to toggle.
     * @return {Boolean} Indicates whether the option was successfully toggled or not.
     */
  }, {
    key: 'toggle',
    value: function toggle(index) {
      return this.select(index) || this.unselect(index);
    }

    /**
     * Enables an option (and sets it to `'unselected'`).
     * @param {Number} index The option index to enable.
     */
  }, {
    key: 'enable',
    value: function enable(index) {
      var _this = this;

      var state = this.states[index];

      if (state === 'disabled') {
        this.states[index] = 'unselected';

        var listener = function listener() {
          return _this.toggle(index);
        };
        this._listeners[index] = listener;

        var button = this._buttons[index];
        button.classList.remove('disabled');
        if (_client2['default'].platform.isMobile) button.addEventListener('touchstart', listener, false);else button.addEventListener('click', listener, false);
      }
    }

    /**
     * Disables an option (and unselects it before if needed).
     * @param {Number} index The option index to disable.
     */
  }, {
    key: 'disable',
    value: function disable(index) {
      var state = this.states[index];

      if (state === 'selected') this.unselect(index);

      if (state === 'unselected') {
        this.states[index] = 'disabled';

        var button = this._buttons[index];
        var listener = this._listeners[index];
        button.classList.add('disabled');
        if (_client2['default'].platform.isMobile) button.removeListener('touchstart', listener);else button.removeListener('click', listener);
      }
    }

    /**
     * Sets the labels of the options.
     * @param {String[]} list The list of options.
     */
  }, {
    key: 'labels',
    set: function set(list) {
      this._labels = list;
    },

    /**
     * Gets the labels of the options.
     * @type {String[]}
     */
    get: function get() {
      return this._labels;
    }
  }]);

  return Selector;
})(_ClientModule3['default']);

exports['default'] = Selector;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7OzZCQUNKLGdCQUFnQjs7OztBQUd6QyxTQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUU7QUFDeEIsU0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFTLEdBQUcsRUFBRTtBQUN6QyxXQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztHQUNsRSxDQUFDLENBQUM7Q0FDSjs7QUFFRCxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUU7QUFDekIsTUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QixNQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDWCxPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNqQyxRQUFJLENBQUMsS0FBSyxDQUFDLEVBQ1QsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUV2QixDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNuQjtBQUNELFNBQU8sQ0FBQyxDQUFDO0NBQ1Y7Ozs7OztJQUtvQixRQUFRO1lBQVIsUUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JoQixXQWhCUSxRQUFRLEdBZ0JEO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFoQkwsUUFBUTs7QUFpQnpCLCtCQWpCaUIsUUFBUSw2Q0FpQm5CLE9BQU8sQ0FBQyxJQUFJLElBQUksVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMs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QyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUMsS0FFOUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7T0FDNUM7S0FDRjs7Ozs7Ozs7U0FNUyxhQUFDLElBQUksRUFBRTtBQUNmLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0tBQ3JCOzs7Ozs7U0FNUyxlQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQ3JCOzs7U0FwUWtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5cblxuZnVuY3Rpb24gdG9UaXRsZUNhc2Uoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXFx3XFxTKi9nLCBmdW5jdGlvbih0eHQpIHtcbiAgICByZXR1cm4gdHh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY29udmVydE5hbWUobmFtZSkge1xuICB2YXIgYSA9IG5hbWUuc3BsaXQoXCJfXCIpO1xuICB2YXIgbiA9IFwiXCI7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpID09PSAwKVxuICAgICAgbiArPSB0b1RpdGxlQ2FzZShhW2ldKTtcbiAgICBlbHNlXG4gICAgICBuICs9IFwiIFwiICsgYVtpXTtcbiAgfVxuICByZXR1cm4gbjtcbn1cblxuLyoqXG4gKiBbY2xpZW50XSBBbGxvdyB0byBzZWxlY3Qgb25lIG9yIHNldmVyYWwgb3B0aW9ucyBhbW9uZyBhIGxpc3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdG9yIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3NlbGVjdG9yJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IFtvcHRpb25zLnZpZXddIFRoZSB2aWV3IGluIHdoaWNoIHRvIGRpc3BsYXkgdGhlIGxpc3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtvcHRpb25zLmxhYmVscz1bXV0gTGFiZWxzIG9mIHRoZSBsaXN0IG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtvcHRpb25zLnN0YXRlcz1bXV0gU3RhdGVzIG9mIGVhY2ggbGlzdCBvcHRpb24uIEF1dGhvcml6ZWQgdmFsdWVzIGFyZTpcbiAgICogLSAnYGRpc2FibGVkYCc6IHRoZSBvcHRpb24gaXMgZGlzYWJsZWQgKHVuc2VsZWN0YWJsZSlcbiAgICogLSAnYHVuc2VsZWN0ZWRgJzogdGhlIG9wdGlvbiBpcyB1bnNlbGVjdGVkLlxuICAgKiAtIGAnc2VsZWN0ZWQnYDogdGhlIG9wdGlvbnMgaXMgc2VsZWN0ZWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5kZWZhdWx0U3RhdGU9J3Vuc2VsZWN0ZWQnXSBEZWZhdWx0IHN0YXRlIG9mIHRoZSBsaXN0IG9wdGlvbnMuIEF1dGhvcml6ZWQgdmFsdWVzIGFyZTpcbiAgICogLSAnYGRpc2FibGVkYCc6IHRoZSBvcHRpb24gaXMgZGlzYWJsZWQgKHVuc2VsZWN0YWJsZSlcbiAgICogLSAnYHVuc2VsZWN0ZWRgJzogdGhlIG9wdGlvbiBpcyB1bnNlbGVjdGVkLlxuICAgKiAtIGAnc2VsZWN0ZWQnYDogdGhlIG9wdGlvbnMgaXMgc2VsZWN0ZWQuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3NlbGVjdG9yJywgIW9wdGlvbnMudmlldywgb3B0aW9ucy5jb2xvciB8fCAnYmxhY2snKTtcblxuICAgIC8qKlxuICAgICAqIExhYmVscyBvZiB0aGUgb3B0aW9ucy5cbiAgICAgKiBAdHlwZSB7U3RyaW5nW119XG4gICAgICovXG4gICAgdGhpcy5sYWJlbHMgPSBvcHRpb25zLmxhYmVscyB8fCBbXTtcblxuICAgIC8qKlxuICAgICAqIEN1cnJlbnQgc3RhdGVzIG9mIHRoZSBvcHRpb25zLlxuICAgICAqIEB0eXBlIHtTdHJpbmdbXX1cbiAgICAgKi9cbiAgICB0aGlzLnN0YXRlcyA9IG9wdGlvbnMuc3RhdGVzIHx8IFtdO1xuXG4gICAgLyoqXG4gICAgICogTWF4aW11bSBudW1iZXIgb2Ygc2ltdWx0YW5lb3VzbHkgc2VsZWN0ZWQgb3B0aW9ucy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMubWF4U2VsZWN0ZWQgPSAxO1xuXG4gICAgLyoqXG4gICAgICogQ3VycmVudGx5IHNlbGVjdGVkIG9wdGlvbnMuXG4gICAgICogQHR5cGUge1N0cmluZ1tdfVxuICAgICAqL1xuICAgIHRoaXMuc2VsZWN0ZWQgPSBbXTtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5tYXhTZWxlY3RlZCAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICB0aGlzLm1heFNlbGVjdGVkID0gb3B0aW9ucy5tYXhTZWxlY3RlZDtcblxuICAgIGlmKG9wdGlvbnMudmlldykge1xuICAgICAgLyoqXG4gICAgICAgKiBWaWV3IG9mIHRoZSBwYXJlbnQgbW9kdWxlXG4gICAgICAgKiBAdHlwZSB7RE9NRWxlbWVudH1cbiAgICAgICAqL1xuICAgICAgdGhpcy52aWV3ID0gb3B0aW9ucy52aWV3O1xuXG4gICAgICAvKipcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHRoaXMuaXNEb25lID0gdW5kZWZpbmVkOyAvLyBza2lwIHN1cGVyLmRvbmUoKVxuICAgIH1cblxuICAgIHRoaXMuX2RlZmF1bHRTdGF0ZSA9IG9wdGlvbnMuZGVmYXVsdFN0YXRlIHx8ICd1bnNlbGVjdGVkJztcbiAgICB0aGlzLl9idXR0b25zID0gW107XG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW107XG4gIH1cblxuICBfc2V0dXBCdXR0b24oaW5kZXgsIGxhYmVsLCBzdGF0ZSkge1xuICAgIGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnYnRuJyk7XG4gICAgYnV0dG9uLmlubmVySFRNTCA9IGNvbnZlcnROYW1lKGxhYmVsKTtcbiAgICB0aGlzLl9idXR0b25zW2luZGV4XSA9IGJ1dHRvbjtcblxuICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgIGNhc2UgJ2Rpc2FibGVkJzpcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd1bnNlbGVjdGVkJzpcbiAgICAgICAgdGhpcy5lbmFibGUoaW5kZXgpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnc2VsZWN0ZWQnOlxuICAgICAgICB0aGlzLmVuYWJsZShpbmRleCk7XG4gICAgICAgIHRoaXMuc2VsZWN0KGluZGV4KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy52aWV3LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBsYWJlbCA9IHRoaXMuX2xhYmVsc1tpXTtcbiAgICAgIGxldCBzdGF0ZSA9IHRoaXMuX2RlZmF1bHRTdGF0ZTtcblxuICAgICAgaWYgKGkgPCB0aGlzLnN0YXRlcy5sZW5ndGgpXG4gICAgICAgIHN0YXRlID0gdGhpcy5zdGF0ZXNbaV07XG5cbiAgICAgIHRoaXMuc3RhdGVzW2ldID0gJ2Rpc2FibGVkJztcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tpXSA9IG51bGw7XG4gICAgICB0aGlzLl9zZXR1cEJ1dHRvbihpLCBsYWJlbCwgc3RhdGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIGxldCBidXR0b25zID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idG4nKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1dHRvbnMubGVuZ3RoOyBpKyspXG4gICAgICB0aGlzLnZpZXcucmVtb3ZlQ2hpbGQoYnV0dG9uc1tpXSk7XG5cbiAgICB0aGlzLnNlbGVjdGVkID0gW107XG4gICAgdGhpcy5fYnV0dG9ucyA9IFtdO1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIC8vIFRPRE9cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIGFuIG9wdGlvbi5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IFRoZSBvcHRpb24gaW5kZXggdG8gc2VsZWN0LlxuICAgKiBAZW1pdHMgeydzZWxlY3RvcjpzZWxlY3QnLCBpbmRleDpOdW1iZXIsIGxhYmVsOlN0cmluZ30gVGhlIGluZGV4IGFuZCBsYWJlbCBvZiB0aGUgc2VsZWN0ZWQgb3B0aW9uLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgb3B0aW9uIHdhcyBzdWNjZXNzZnVsbHkgc2VsZWN0ZWQgb3Igbm90LlxuICAgKi9cbiAgc2VsZWN0KGluZGV4KSB7XG4gICAgbGV0IHN0YXRlID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuXG4gICAgaWYgKHN0YXRlID09PSAndW5zZWxlY3RlZCcpIHtcbiAgICAgIC8vIHN0ZWFsIG9sZGVzdCBzZWxlY3RlZFxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQubGVuZ3RoID09PSB0aGlzLm1heFNlbGVjdGVkKVxuICAgICAgICB0aGlzLnVuc2VsZWN0KHRoaXMuc2VsZWN0ZWRbMF0pO1xuXG4gICAgICBsZXQgYnV0dG9uID0gdGhpcy5fYnV0dG9uc1tpbmRleF07XG5cbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdID0gJ3NlbGVjdGVkJztcblxuICAgICAgLy8gYWRkIHRvIGxpc3Qgb2Ygc2VsZWN0ZWQgYnV0dG9uc1xuICAgICAgdGhpcy5zZWxlY3RlZC5wdXNoKGluZGV4KTtcblxuICAgICAgbGV0IGxhYmVsID0gdGhpcy5sYWJlbHNbaW5kZXhdO1xuICAgICAgdGhpcy5lbWl0KCdzZWxlY3RvcjpzZWxlY3QnLCBpbmRleCwgbGFiZWwpO1xuXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZC5sZW5ndGggPT09IHRoaXMubWF4U2VsZWN0ZWQpXG4gICAgICAgIHRoaXMuZG9uZSgpOyAvLyBUT0RPOiBiZXdhcmUsIG1pZ2h0IGNhdXNlIHByb2JsZW1zIHdpdGggdGhlIGxhdW5jaCB0aGluZ1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogVW5zZWxlY3RzIGFuIG9wdGlvbi5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IFRoZSBvcHRpb24gaW5kZXggdG8gdW5zZWxlY3QuXG4gICAqIEBlbWl0cyB7J3NlbGVjdG9yOnVuc2VsZWN0JywgaW5kZXg6TnVtYmVyLCBsYWJlbDpTdHJpbmd9IFRoZSBpbmRleCBhbmQgbGFiZWwgb2YgdGhlIHVuc2VsZWN0ZWQgb3B0aW9uLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgb3B0aW9uIHdhcyBzdWNjZXNzZnVsbHkgdW5zZWxlY3RlZCBvciBub3QuXG4gICAqL1xuICB1bnNlbGVjdChpbmRleCkge1xuICAgIGxldCBzdGF0ZSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcblxuICAgIGlmIChzdGF0ZSA9PT0gJ3NlbGVjdGVkJykge1xuICAgICAgbGV0IGJ1dHRvbiA9IHRoaXMuX2J1dHRvbnNbaW5kZXhdO1xuXG4gICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XSA9ICd1bnNlbGVjdGVkJztcblxuICAgICAgLy8gdW5zZWxlY3Qgb2xkZXN0IHNlbGVjdGVkIGJ1dHRvblxuICAgICAgbGV0IHNlbGVjdGVkSW5kZXggPSB0aGlzLnNlbGVjdGVkLmluZGV4T2YoaW5kZXgpO1xuICAgICAgdGhpcy5zZWxlY3RlZC5zcGxpY2Uoc2VsZWN0ZWRJbmRleCwgMSk7XG5cbiAgICAgIGxldCBsYWJlbCA9IHRoaXMubGFiZWxzW2luZGV4XTtcbiAgICAgIHRoaXMuZW1pdCgnc2VsZWN0b3I6dW5zZWxlY3QnLCBpbmRleCwgbGFiZWwpO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyBhbiBvcHRpb24uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIG9wdGlvbiB0byB0b2dnbGUuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IEluZGljYXRlcyB3aGV0aGVyIHRoZSBvcHRpb24gd2FzIHN1Y2Nlc3NmdWxseSB0b2dnbGVkIG9yIG5vdC5cbiAgICovXG4gIHRvZ2dsZShpbmRleCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdChpbmRleCkgfHwgdGhpcy51bnNlbGVjdChpbmRleCk7XG4gIH1cblxuICAvKipcbiAgICogRW5hYmxlcyBhbiBvcHRpb24gKGFuZCBzZXRzIGl0IHRvIGAndW5zZWxlY3RlZCdgKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IFRoZSBvcHRpb24gaW5kZXggdG8gZW5hYmxlLlxuICAgKi9cbiAgZW5hYmxlKGluZGV4KSB7XG4gICAgbGV0IHN0YXRlID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuXG4gICAgaWYgKHN0YXRlID09PSAnZGlzYWJsZWQnKSB7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF0gPSAndW5zZWxlY3RlZCc7XG5cbiAgICAgIGxldCBsaXN0ZW5lciA9ICgoKSA9PiB0aGlzLnRvZ2dsZShpbmRleCkpO1xuICAgICAgdGhpcy5fbGlzdGVuZXJzW2luZGV4XSA9IGxpc3RlbmVyO1xuXG4gICAgICBsZXQgYnV0dG9uID0gdGhpcy5fYnV0dG9uc1tpbmRleF07XG4gICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKTtcbiAgICAgIGlmIChjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUpXG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgICAgIGVsc2VcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZXMgYW4gb3B0aW9uIChhbmQgdW5zZWxlY3RzIGl0IGJlZm9yZSBpZiBuZWVkZWQpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggVGhlIG9wdGlvbiBpbmRleCB0byBkaXNhYmxlLlxuICAgKi9cbiAgZGlzYWJsZShpbmRleCkge1xuICAgIGxldCBzdGF0ZSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcblxuICAgIGlmIChzdGF0ZSA9PT0gJ3NlbGVjdGVkJylcbiAgICAgIHRoaXMudW5zZWxlY3QoaW5kZXgpO1xuXG4gICAgaWYgKHN0YXRlID09PSAndW5zZWxlY3RlZCcpIHtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XSA9ICdkaXNhYmxlZCc7XG5cbiAgICAgIGxldCBidXR0b24gPSB0aGlzLl9idXR0b25zW2luZGV4XTtcbiAgICAgIGxldCBsaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVyc1tpbmRleF07XG4gICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICAgIGlmIChjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUpXG4gICAgICAgIGJ1dHRvbi5yZW1vdmVMaXN0ZW5lcigndG91Y2hzdGFydCcsIGxpc3RlbmVyKTtcbiAgICAgIGVsc2VcbiAgICAgICAgYnV0dG9uLnJlbW92ZUxpc3RlbmVyKCdjbGljaycsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbGFiZWxzIG9mIHRoZSBvcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBsaXN0IFRoZSBsaXN0IG9mIG9wdGlvbnMuXG4gICAqL1xuICBzZXQgbGFiZWxzKGxpc3QpIHtcbiAgICB0aGlzLl9sYWJlbHMgPSBsaXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGxhYmVscyBvZiB0aGUgb3B0aW9ucy5cbiAgICogQHR5cGUge1N0cmluZ1tdfVxuICAgKi9cbiAgZ2V0IGxhYmVscygpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFiZWxzO1xuICB9XG59XG4iXX0=