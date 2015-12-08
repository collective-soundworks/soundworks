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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvU2VsZWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7QUFHekMsU0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFO0FBQ3hCLFNBQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsVUFBUyxHQUFHLEVBQUU7QUFDekMsV0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7R0FDbEUsQ0FBQyxDQUFDO0NBQ0o7O0FBRUQsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFO0FBQ3pCLE1BQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEIsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ1gsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDakMsUUFBSSxDQUFDLEtBQUssQ0FBQyxFQUNULENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FFdkIsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDbkI7QUFDRCxTQUFPLENBQUMsQ0FBQztDQUNWOzs7Ozs7SUFLb0IsUUFBUTtZQUFSLFFBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdCaEIsV0FoQlEsUUFBUSxHQWdCRDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBaEJMLFFBQVE7O0FBaUJ6QiwrQkFqQmlCLFFBQVEsNkNBaUJuQixPQUFPLENBQUMsSUFBSSxJQUFJLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUss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QUFZLEVBQUUsUUFBUSxDQUFDLENBQUMsS0FFOUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7T0FDNUM7S0FDRjs7Ozs7Ozs7U0FNUyxhQUFDLElBQUksRUFBRTtBQUNmLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0tBQ3JCOzs7Ozs7U0FNUyxlQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQ3JCOzs7U0F0UWtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6InNyYy9jbGllbnQvU2VsZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuXG5cbmZ1bmN0aW9uIHRvVGl0bGVDYXNlKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcd1xcUyovZywgZnVuY3Rpb24odHh0KSB7XG4gICAgcmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnROYW1lKG5hbWUpIHtcbiAgdmFyIGEgPSBuYW1lLnNwbGl0KFwiX1wiKTtcbiAgdmFyIG4gPSBcIlwiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoaSA9PT0gMClcbiAgICAgIG4gKz0gdG9UaXRsZUNhc2UoYVtpXSk7XG4gICAgZWxzZVxuICAgICAgbiArPSBcIiBcIiArIGFbaV07XG4gIH1cbiAgcmV0dXJuIG47XG59XG5cbi8qKlxuICogW2NsaWVudF0gQWxsb3cgdG8gc2VsZWN0IG9uZSBvciBzZXZlcmFsIG9wdGlvbnMgYW1vbmcgYSBsaXN0LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3RvciBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdzZWxlY3RvciddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtET01FbGVtZW50fSBbb3B0aW9ucy52aWV3XSBUaGUgdmlldyBpbiB3aGljaCB0byBkaXNwbGF5IHRoZSBsaXN0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbb3B0aW9ucy5sYWJlbHM9W11dIExhYmVscyBvZiB0aGUgbGlzdCBvcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbb3B0aW9ucy5zdGF0ZXM9W11dIFN0YXRlcyBvZiBlYWNoIGxpc3Qgb3B0aW9uLiBBdXRob3JpemVkIHZhbHVlcyBhcmU6XG4gICAqIC0gJ2BkaXNhYmxlZGAnOiB0aGUgb3B0aW9uIGlzIGRpc2FibGVkICh1bnNlbGVjdGFibGUpXG4gICAqIC0gJ2B1bnNlbGVjdGVkYCc6IHRoZSBvcHRpb24gaXMgdW5zZWxlY3RlZC5cbiAgICogLSBgJ3NlbGVjdGVkJ2A6IHRoZSBvcHRpb25zIGlzIHNlbGVjdGVkLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZGVmYXVsdFN0YXRlPSd1bnNlbGVjdGVkJ10gRGVmYXVsdCBzdGF0ZSBvZiB0aGUgbGlzdCBvcHRpb25zLiBBdXRob3JpemVkIHZhbHVlcyBhcmU6XG4gICAqIC0gJ2BkaXNhYmxlZGAnOiB0aGUgb3B0aW9uIGlzIGRpc2FibGVkICh1bnNlbGVjdGFibGUpXG4gICAqIC0gJ2B1bnNlbGVjdGVkYCc6IHRoZSBvcHRpb24gaXMgdW5zZWxlY3RlZC5cbiAgICogLSBgJ3NlbGVjdGVkJ2A6IHRoZSBvcHRpb25zIGlzIHNlbGVjdGVkLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdzZWxlY3RvcicsICFvcHRpb25zLnZpZXcsIG9wdGlvbnMuY29sb3IgfHwgJ2JsYWNrJyk7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbHMgb2YgdGhlIG9wdGlvbnMuXG4gICAgICogQHR5cGUge1N0cmluZ1tdfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWxzID0gb3B0aW9ucy5sYWJlbHMgfHwgW107XG5cbiAgICAvKipcbiAgICAgKiBDdXJyZW50IHN0YXRlcyBvZiB0aGUgb3B0aW9ucy5cbiAgICAgKiBAdHlwZSB7U3RyaW5nW119XG4gICAgICovXG4gICAgdGhpcy5zdGF0ZXMgPSBvcHRpb25zLnN0YXRlcyB8fCBbXTtcblxuICAgIC8qKlxuICAgICAqIE1heGltdW0gbnVtYmVyIG9mIHNpbXVsdGFuZW91c2x5IHNlbGVjdGVkIG9wdGlvbnMuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLm1heFNlbGVjdGVkID0gMTtcblxuICAgIC8qKlxuICAgICAqIEN1cnJlbnRseSBzZWxlY3RlZCBvcHRpb25zLlxuICAgICAqIEB0eXBlIHtTdHJpbmdbXX1cbiAgICAgKi9cbiAgICB0aGlzLnNlbGVjdGVkID0gW107XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMubWF4U2VsZWN0ZWQgIT09ICd1bmRlZmluZWQnKVxuICAgICAgdGhpcy5tYXhTZWxlY3RlZCA9IG9wdGlvbnMubWF4U2VsZWN0ZWQ7XG5cbiAgICBpZihvcHRpb25zLnZpZXcpIHtcbiAgICAgIC8qKlxuICAgICAgICogVmlldyBvZiB0aGUgcGFyZW50IG1vZHVsZVxuICAgICAgICogQHR5cGUge0RPTUVsZW1lbnR9XG4gICAgICAgKi9cbiAgICAgIHRoaXMudmlldyA9IG9wdGlvbnMudmlldztcblxuICAgICAgLyoqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICB0aGlzLmlzRG9uZSA9IHVuZGVmaW5lZDsgLy8gc2tpcCBzdXBlci5kb25lKClcbiAgICB9XG5cbiAgICB0aGlzLl9kZWZhdWx0U3RhdGUgPSBvcHRpb25zLmRlZmF1bHRTdGF0ZSB8fCAndW5zZWxlY3RlZCc7XG4gICAgdGhpcy5fYnV0dG9ucyA9IFtdO1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICB9XG5cbiAgX3NldHVwQnV0dG9uKGluZGV4LCBsYWJlbCwgc3RhdGUpIHtcbiAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bicpO1xuICAgIGJ1dHRvbi5pbm5lckhUTUwgPSBjb252ZXJ0TmFtZShsYWJlbCk7XG4gICAgdGhpcy5fYnV0dG9uc1tpbmRleF0gPSBidXR0b247XG5cbiAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICBjYXNlICdkaXNhYmxlZCc6XG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAndW5zZWxlY3RlZCc6XG4gICAgICAgIHRoaXMuZW5hYmxlKGluZGV4KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3NlbGVjdGVkJzpcbiAgICAgICAgdGhpcy5lbmFibGUoaW5kZXgpO1xuICAgICAgICB0aGlzLnNlbGVjdChpbmRleCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMudmlldy5hcHBlbmRDaGlsZChidXR0b24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbGFiZWwgPSB0aGlzLl9sYWJlbHNbaV07XG4gICAgICBsZXQgc3RhdGUgPSB0aGlzLl9kZWZhdWx0U3RhdGU7XG5cbiAgICAgIGlmIChpIDwgdGhpcy5zdGF0ZXMubGVuZ3RoKVxuICAgICAgICBzdGF0ZSA9IHRoaXMuc3RhdGVzW2ldO1xuXG4gICAgICB0aGlzLnN0YXRlc1tpXSA9ICdkaXNhYmxlZCc7XG4gICAgICB0aGlzLl9saXN0ZW5lcnNbaV0gPSBudWxsO1xuICAgICAgdGhpcy5fc2V0dXBCdXR0b24oaSwgbGFiZWwsIHN0YXRlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpIHtcbiAgICBsZXQgYnV0dG9ucyA9IHRoaXMudmlldy5xdWVyeVNlbGVjdG9yQWxsKCcuYnRuJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidXR0b25zLmxlbmd0aDsgaSsrKVxuICAgICAgdGhpcy52aWV3LnJlbW92ZUNoaWxkKGJ1dHRvbnNbaV0pO1xuXG4gICAgdGhpcy5zZWxlY3RlZCA9IFtdO1xuICAgIHRoaXMuX2J1dHRvbnMgPSBbXTtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICAvLyBUT0RPXG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0cyBhbiBvcHRpb24uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBUaGUgb3B0aW9uIGluZGV4IHRvIHNlbGVjdC5cbiAgICogQGVtaXRzIHsnc2VsZWN0b3I6c2VsZWN0JywgaW5kZXg6TnVtYmVyLCBsYWJlbDpTdHJpbmd9IFRoZSBpbmRleCBhbmQgbGFiZWwgb2YgdGhlIHNlbGVjdGVkIG9wdGlvbi5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG9wdGlvbiB3YXMgc3VjY2Vzc2Z1bGx5IHNlbGVjdGVkIG9yIG5vdC5cbiAgICovXG4gIHNlbGVjdChpbmRleCkge1xuICAgIGxldCBzdGF0ZSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcblxuICAgIGlmIChzdGF0ZSA9PT0gJ3Vuc2VsZWN0ZWQnKSB7XG4gICAgICAvLyBzdGVhbCBvbGRlc3Qgc2VsZWN0ZWRcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkLmxlbmd0aCA9PT0gdGhpcy5tYXhTZWxlY3RlZClcbiAgICAgICAgdGhpcy51bnNlbGVjdCh0aGlzLnNlbGVjdGVkWzBdKTtcblxuICAgICAgbGV0IGJ1dHRvbiA9IHRoaXMuX2J1dHRvbnNbaW5kZXhdO1xuXG4gICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XSA9ICdzZWxlY3RlZCc7XG5cbiAgICAgIC8vIGFkZCB0byBsaXN0IG9mIHNlbGVjdGVkIGJ1dHRvbnNcbiAgICAgIHRoaXMuc2VsZWN0ZWQucHVzaChpbmRleCk7XG5cbiAgICAgIGxldCBsYWJlbCA9IHRoaXMubGFiZWxzW2luZGV4XTtcbiAgICAgIHRoaXMuZW1pdCgnc2VsZWN0b3I6c2VsZWN0JywgaW5kZXgsIGxhYmVsKTtcblxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQubGVuZ3RoID09PSB0aGlzLm1heFNlbGVjdGVkKVxuICAgICAgICB0aGlzLmRvbmUoKTsgLy8gVE9ETzogYmV3YXJlLCBtaWdodCBjYXVzZSBwcm9ibGVtcyB3aXRoIHRoZSBsYXVuY2ggdGhpbmdcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFVuc2VsZWN0cyBhbiBvcHRpb24uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBUaGUgb3B0aW9uIGluZGV4IHRvIHVuc2VsZWN0LlxuICAgKiBAZW1pdHMgeydzZWxlY3Rvcjp1bnNlbGVjdCcsIGluZGV4Ok51bWJlciwgbGFiZWw6U3RyaW5nfSBUaGUgaW5kZXggYW5kIGxhYmVsIG9mIHRoZSB1bnNlbGVjdGVkIG9wdGlvbi5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG9wdGlvbiB3YXMgc3VjY2Vzc2Z1bGx5IHVuc2VsZWN0ZWQgb3Igbm90LlxuICAgKi9cbiAgdW5zZWxlY3QoaW5kZXgpIHtcbiAgICBsZXQgc3RhdGUgPSB0aGlzLnN0YXRlc1tpbmRleF07XG5cbiAgICBpZiAoc3RhdGUgPT09ICdzZWxlY3RlZCcpIHtcbiAgICAgIGxldCBidXR0b24gPSB0aGlzLl9idXR0b25zW2luZGV4XTtcblxuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF0gPSAndW5zZWxlY3RlZCc7XG5cbiAgICAgIC8vIHVuc2VsZWN0IG9sZGVzdCBzZWxlY3RlZCBidXR0b25cbiAgICAgIGxldCBzZWxlY3RlZEluZGV4ID0gdGhpcy5zZWxlY3RlZC5pbmRleE9mKGluZGV4KTtcbiAgICAgIHRoaXMuc2VsZWN0ZWQuc3BsaWNlKHNlbGVjdGVkSW5kZXgsIDEpO1xuXG4gICAgICBsZXQgbGFiZWwgPSB0aGlzLmxhYmVsc1tpbmRleF07XG4gICAgICB0aGlzLmVtaXQoJ3NlbGVjdG9yOnVuc2VsZWN0JywgaW5kZXgsIGxhYmVsKTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgYW4gb3B0aW9uLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBvcHRpb24gdG8gdG9nZ2xlLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgb3B0aW9uIHdhcyBzdWNjZXNzZnVsbHkgdG9nZ2xlZCBvciBub3QuXG4gICAqL1xuICB0b2dnbGUoaW5kZXgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3QoaW5kZXgpIHx8IHRoaXMudW5zZWxlY3QoaW5kZXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuYWJsZXMgYW4gb3B0aW9uIChhbmQgc2V0cyBpdCB0byBgJ3Vuc2VsZWN0ZWQnYCkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBUaGUgb3B0aW9uIGluZGV4IHRvIGVuYWJsZS5cbiAgICovXG4gIGVuYWJsZShpbmRleCkge1xuICAgIGxldCBzdGF0ZSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcblxuICAgIGlmIChzdGF0ZSA9PT0gJ2Rpc2FibGVkJykge1xuICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdID0gJ3Vuc2VsZWN0ZWQnO1xuXG4gICAgICBsZXQgbGlzdGVuZXIgPSAoKCkgPT4gdGhpcy50b2dnbGUoaW5kZXgpKTtcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tpbmRleF0gPSBsaXN0ZW5lcjtcblxuICAgICAgbGV0IGJ1dHRvbiA9IHRoaXMuX2J1dHRvbnNbaW5kZXhdO1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG5cbiAgICAgIGlmIChjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUpXG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgICAgIGVsc2VcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZXMgYW4gb3B0aW9uIChhbmQgdW5zZWxlY3RzIGl0IGJlZm9yZSBpZiBuZWVkZWQpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggVGhlIG9wdGlvbiBpbmRleCB0byBkaXNhYmxlLlxuICAgKi9cbiAgZGlzYWJsZShpbmRleCkge1xuICAgIGxldCBzdGF0ZSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcblxuICAgIGlmIChzdGF0ZSA9PT0gJ3NlbGVjdGVkJylcbiAgICAgIHRoaXMudW5zZWxlY3QoaW5kZXgpO1xuXG4gICAgaWYgKHN0YXRlID09PSAndW5zZWxlY3RlZCcpIHtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XSA9ICdkaXNhYmxlZCc7XG5cbiAgICAgIGxldCBidXR0b24gPSB0aGlzLl9idXR0b25zW2luZGV4XTtcbiAgICAgIGxldCBsaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVyc1tpbmRleF07XG4gICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcblxuICAgICAgaWYgKGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSlcbiAgICAgICAgYnV0dG9uLnJlbW92ZUxpc3RlbmVyKCd0b3VjaHN0YXJ0JywgbGlzdGVuZXIpO1xuICAgICAgZWxzZVxuICAgICAgICBidXR0b24ucmVtb3ZlTGlzdGVuZXIoJ2NsaWNrJywgbGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBsYWJlbHMgb2YgdGhlIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IGxpc3QgVGhlIGxpc3Qgb2Ygb3B0aW9ucy5cbiAgICovXG4gIHNldCBsYWJlbHMobGlzdCkge1xuICAgIHRoaXMuX2xhYmVscyA9IGxpc3Q7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbGFiZWxzIG9mIHRoZSBvcHRpb25zLlxuICAgKiBAdHlwZSB7U3RyaW5nW119XG4gICAqL1xuICBnZXQgbGFiZWxzKCkge1xuICAgIHJldHVybiB0aGlzLl9sYWJlbHM7XG4gIH1cbn1cbiJdfQ==