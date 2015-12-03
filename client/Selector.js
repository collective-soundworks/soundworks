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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvU2VsZWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7QUFHekMsU0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFO0FBQ3hCLFNBQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsVUFBUyxHQUFHLEVBQUU7QUFDekMsV0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7R0FDbEUsQ0FBQyxDQUFDO0NBQ0o7O0FBRUQsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFO0FBQ3pCLE1BQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEIsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ1gsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDakMsUUFBSSxDQUFDLEtBQUssQ0FBQyxFQUNULENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FFdkIsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDbkI7QUFDRCxTQUFPLENBQUMsQ0FBQztDQUNWOzs7Ozs7SUFLb0IsUUFBUTtZQUFSLFFBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdCaEIsV0FoQlEsUUFBUSxHQWdCRDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBaEJMLFFBQVE7O0FBaUJ6QiwrQkFqQmlCLFFBQVEsNkNBaUJuQixPQUFPLENBQUMsSUFBSSxJQUFJLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUss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WSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEtBRTlDLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO09BQzVDO0tBQ0Y7Ozs7Ozs7O1NBTVMsYUFBQyxJQUFJLEVBQUU7QUFDZixVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztLQUNyQjs7Ozs7O1NBTVMsZUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNyQjs7O1NBcFFrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiJzcmMvY2xpZW50L1NlbGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcblxuXG5mdW5jdGlvbiB0b1RpdGxlQ2FzZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHdcXFMqL2csIGZ1bmN0aW9uKHR4dCkge1xuICAgIHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0TmFtZShuYW1lKSB7XG4gIHZhciBhID0gbmFtZS5zcGxpdChcIl9cIik7XG4gIHZhciBuID0gXCJcIjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGkgPT09IDApXG4gICAgICBuICs9IHRvVGl0bGVDYXNlKGFbaV0pO1xuICAgIGVsc2VcbiAgICAgIG4gKz0gXCIgXCIgKyBhW2ldO1xuICB9XG4gIHJldHVybiBuO1xufVxuXG4vKipcbiAqIFtjbGllbnRdIEFsbG93IHRvIHNlbGVjdCBvbmUgb3Igc2V2ZXJhbCBvcHRpb25zIGFtb25nIGEgbGlzdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0b3IgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nc2VsZWN0b3InXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gW29wdGlvbnMudmlld10gVGhlIHZpZXcgaW4gd2hpY2ggdG8gZGlzcGxheSB0aGUgbGlzdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW29wdGlvbnMubGFiZWxzPVtdXSBMYWJlbHMgb2YgdGhlIGxpc3Qgb3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW29wdGlvbnMuc3RhdGVzPVtdXSBTdGF0ZXMgb2YgZWFjaCBsaXN0IG9wdGlvbi4gQXV0aG9yaXplZCB2YWx1ZXMgYXJlOlxuICAgKiAtICdgZGlzYWJsZWRgJzogdGhlIG9wdGlvbiBpcyBkaXNhYmxlZCAodW5zZWxlY3RhYmxlKVxuICAgKiAtICdgdW5zZWxlY3RlZGAnOiB0aGUgb3B0aW9uIGlzIHVuc2VsZWN0ZWQuXG4gICAqIC0gYCdzZWxlY3RlZCdgOiB0aGUgb3B0aW9ucyBpcyBzZWxlY3RlZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmRlZmF1bHRTdGF0ZT0ndW5zZWxlY3RlZCddIERlZmF1bHQgc3RhdGUgb2YgdGhlIGxpc3Qgb3B0aW9ucy4gQXV0aG9yaXplZCB2YWx1ZXMgYXJlOlxuICAgKiAtICdgZGlzYWJsZWRgJzogdGhlIG9wdGlvbiBpcyBkaXNhYmxlZCAodW5zZWxlY3RhYmxlKVxuICAgKiAtICdgdW5zZWxlY3RlZGAnOiB0aGUgb3B0aW9uIGlzIHVuc2VsZWN0ZWQuXG4gICAqIC0gYCdzZWxlY3RlZCdgOiB0aGUgb3B0aW9ucyBpcyBzZWxlY3RlZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnc2VsZWN0b3InLCAhb3B0aW9ucy52aWV3LCBvcHRpb25zLmNvbG9yIHx8ICdibGFjaycpO1xuXG4gICAgLyoqXG4gICAgICogTGFiZWxzIG9mIHRoZSBvcHRpb25zLlxuICAgICAqIEB0eXBlIHtTdHJpbmdbXX1cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVscyA9IG9wdGlvbnMubGFiZWxzIHx8IFtdO1xuXG4gICAgLyoqXG4gICAgICogQ3VycmVudCBzdGF0ZXMgb2YgdGhlIG9wdGlvbnMuXG4gICAgICogQHR5cGUge1N0cmluZ1tdfVxuICAgICAqL1xuICAgIHRoaXMuc3RhdGVzID0gb3B0aW9ucy5zdGF0ZXMgfHwgW107XG5cbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIG51bWJlciBvZiBzaW11bHRhbmVvdXNseSBzZWxlY3RlZCBvcHRpb25zLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5tYXhTZWxlY3RlZCA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBDdXJyZW50bHkgc2VsZWN0ZWQgb3B0aW9ucy5cbiAgICAgKiBAdHlwZSB7U3RyaW5nW119XG4gICAgICovXG4gICAgdGhpcy5zZWxlY3RlZCA9IFtdO1xuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLm1heFNlbGVjdGVkICE9PSAndW5kZWZpbmVkJylcbiAgICAgIHRoaXMubWF4U2VsZWN0ZWQgPSBvcHRpb25zLm1heFNlbGVjdGVkO1xuXG4gICAgaWYob3B0aW9ucy52aWV3KSB7XG4gICAgICAvKipcbiAgICAgICAqIFZpZXcgb2YgdGhlIHBhcmVudCBtb2R1bGVcbiAgICAgICAqIEB0eXBlIHtET01FbGVtZW50fVxuICAgICAgICovXG4gICAgICB0aGlzLnZpZXcgPSBvcHRpb25zLnZpZXc7XG5cbiAgICAgIC8qKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgdGhpcy5pc0RvbmUgPSB1bmRlZmluZWQ7IC8vIHNraXAgc3VwZXIuZG9uZSgpXG4gICAgfVxuXG4gICAgdGhpcy5fZGVmYXVsdFN0YXRlID0gb3B0aW9ucy5kZWZhdWx0U3RhdGUgfHwgJ3Vuc2VsZWN0ZWQnO1xuICAgIHRoaXMuX2J1dHRvbnMgPSBbXTtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcbiAgfVxuXG4gIF9zZXR1cEJ1dHRvbihpbmRleCwgbGFiZWwsIHN0YXRlKSB7XG4gICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKTtcbiAgICBidXR0b24uaW5uZXJIVE1MID0gY29udmVydE5hbWUobGFiZWwpO1xuICAgIHRoaXMuX2J1dHRvbnNbaW5kZXhdID0gYnV0dG9uO1xuXG4gICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgY2FzZSAnZGlzYWJsZWQnOlxuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3Vuc2VsZWN0ZWQnOlxuICAgICAgICB0aGlzLmVuYWJsZShpbmRleCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdzZWxlY3RlZCc6XG4gICAgICAgIHRoaXMuZW5hYmxlKGluZGV4KTtcbiAgICAgICAgdGhpcy5zZWxlY3QoaW5kZXgpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICB0aGlzLnZpZXcuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xhYmVscy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGxhYmVsID0gdGhpcy5fbGFiZWxzW2ldO1xuICAgICAgbGV0IHN0YXRlID0gdGhpcy5fZGVmYXVsdFN0YXRlO1xuXG4gICAgICBpZiAoaSA8IHRoaXMuc3RhdGVzLmxlbmd0aClcbiAgICAgICAgc3RhdGUgPSB0aGlzLnN0YXRlc1tpXTtcblxuICAgICAgdGhpcy5zdGF0ZXNbaV0gPSAnZGlzYWJsZWQnO1xuICAgICAgdGhpcy5fbGlzdGVuZXJzW2ldID0gbnVsbDtcbiAgICAgIHRoaXMuX3NldHVwQnV0dG9uKGksIGxhYmVsLCBzdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgbGV0IGJ1dHRvbnMgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvckFsbCgnLmJ0bicpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnV0dG9ucy5sZW5ndGg7IGkrKylcbiAgICAgIHRoaXMudmlldy5yZW1vdmVDaGlsZChidXR0b25zW2ldKTtcblxuICAgIHRoaXMuc2VsZWN0ZWQgPSBbXTtcbiAgICB0aGlzLl9idXR0b25zID0gW107XG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW107XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgLy8gVE9ET1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgYW4gb3B0aW9uLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggVGhlIG9wdGlvbiBpbmRleCB0byBzZWxlY3QuXG4gICAqIEBlbWl0cyB7J3NlbGVjdG9yOnNlbGVjdCcsIGluZGV4Ok51bWJlciwgbGFiZWw6U3RyaW5nfSBUaGUgaW5kZXggYW5kIGxhYmVsIG9mIHRoZSBzZWxlY3RlZCBvcHRpb24uXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IEluZGljYXRlcyB3aGV0aGVyIHRoZSBvcHRpb24gd2FzIHN1Y2Nlc3NmdWxseSBzZWxlY3RlZCBvciBub3QuXG4gICAqL1xuICBzZWxlY3QoaW5kZXgpIHtcbiAgICBsZXQgc3RhdGUgPSB0aGlzLnN0YXRlc1tpbmRleF07XG5cbiAgICBpZiAoc3RhdGUgPT09ICd1bnNlbGVjdGVkJykge1xuICAgICAgLy8gc3RlYWwgb2xkZXN0IHNlbGVjdGVkXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZC5sZW5ndGggPT09IHRoaXMubWF4U2VsZWN0ZWQpXG4gICAgICAgIHRoaXMudW5zZWxlY3QodGhpcy5zZWxlY3RlZFswXSk7XG5cbiAgICAgIGxldCBidXR0b24gPSB0aGlzLl9idXR0b25zW2luZGV4XTtcblxuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF0gPSAnc2VsZWN0ZWQnO1xuXG4gICAgICAvLyBhZGQgdG8gbGlzdCBvZiBzZWxlY3RlZCBidXR0b25zXG4gICAgICB0aGlzLnNlbGVjdGVkLnB1c2goaW5kZXgpO1xuXG4gICAgICBsZXQgbGFiZWwgPSB0aGlzLmxhYmVsc1tpbmRleF07XG4gICAgICB0aGlzLmVtaXQoJ3NlbGVjdG9yOnNlbGVjdCcsIGluZGV4LCBsYWJlbCk7XG5cbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkLmxlbmd0aCA9PT0gdGhpcy5tYXhTZWxlY3RlZClcbiAgICAgICAgdGhpcy5kb25lKCk7IC8vIFRPRE86IGJld2FyZSwgbWlnaHQgY2F1c2UgcHJvYmxlbXMgd2l0aCB0aGUgbGF1bmNoIHRoaW5nXG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnNlbGVjdHMgYW4gb3B0aW9uLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggVGhlIG9wdGlvbiBpbmRleCB0byB1bnNlbGVjdC5cbiAgICogQGVtaXRzIHsnc2VsZWN0b3I6dW5zZWxlY3QnLCBpbmRleDpOdW1iZXIsIGxhYmVsOlN0cmluZ30gVGhlIGluZGV4IGFuZCBsYWJlbCBvZiB0aGUgdW5zZWxlY3RlZCBvcHRpb24uXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IEluZGljYXRlcyB3aGV0aGVyIHRoZSBvcHRpb24gd2FzIHN1Y2Nlc3NmdWxseSB1bnNlbGVjdGVkIG9yIG5vdC5cbiAgICovXG4gIHVuc2VsZWN0KGluZGV4KSB7XG4gICAgbGV0IHN0YXRlID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuXG4gICAgaWYgKHN0YXRlID09PSAnc2VsZWN0ZWQnKSB7XG4gICAgICBsZXQgYnV0dG9uID0gdGhpcy5fYnV0dG9uc1tpbmRleF07XG5cbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xuICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdID0gJ3Vuc2VsZWN0ZWQnO1xuXG4gICAgICAvLyB1bnNlbGVjdCBvbGRlc3Qgc2VsZWN0ZWQgYnV0dG9uXG4gICAgICBsZXQgc2VsZWN0ZWRJbmRleCA9IHRoaXMuc2VsZWN0ZWQuaW5kZXhPZihpbmRleCk7XG4gICAgICB0aGlzLnNlbGVjdGVkLnNwbGljZShzZWxlY3RlZEluZGV4LCAxKTtcblxuICAgICAgbGV0IGxhYmVsID0gdGhpcy5sYWJlbHNbaW5kZXhdO1xuICAgICAgdGhpcy5lbWl0KCdzZWxlY3Rvcjp1bnNlbGVjdCcsIGluZGV4LCBsYWJlbCk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIGFuIG9wdGlvbi5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IFRoZSBpbmRleCBvZiB0aGUgb3B0aW9uIHRvIHRvZ2dsZS5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG9wdGlvbiB3YXMgc3VjY2Vzc2Z1bGx5IHRvZ2dsZWQgb3Igbm90LlxuICAgKi9cbiAgdG9nZ2xlKGluZGV4KSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0KGluZGV4KSB8fCB0aGlzLnVuc2VsZWN0KGluZGV4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbmFibGVzIGFuIG9wdGlvbiAoYW5kIHNldHMgaXQgdG8gYCd1bnNlbGVjdGVkJ2ApLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggVGhlIG9wdGlvbiBpbmRleCB0byBlbmFibGUuXG4gICAqL1xuICBlbmFibGUoaW5kZXgpIHtcbiAgICBsZXQgc3RhdGUgPSB0aGlzLnN0YXRlc1tpbmRleF07XG5cbiAgICBpZiAoc3RhdGUgPT09ICdkaXNhYmxlZCcpIHtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XSA9ICd1bnNlbGVjdGVkJztcblxuICAgICAgbGV0IGxpc3RlbmVyID0gKCgpID0+IHRoaXMudG9nZ2xlKGluZGV4KSk7XG4gICAgICB0aGlzLl9saXN0ZW5lcnNbaW5kZXhdID0gbGlzdGVuZXI7XG5cbiAgICAgIGxldCBidXR0b24gPSB0aGlzLl9idXR0b25zW2luZGV4XTtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpO1xuICAgICAgaWYgKGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSlcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAgICAgZWxzZVxuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlcyBhbiBvcHRpb24gKGFuZCB1bnNlbGVjdHMgaXQgYmVmb3JlIGlmIG5lZWRlZCkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBUaGUgb3B0aW9uIGluZGV4IHRvIGRpc2FibGUuXG4gICAqL1xuICBkaXNhYmxlKGluZGV4KSB7XG4gICAgbGV0IHN0YXRlID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuXG4gICAgaWYgKHN0YXRlID09PSAnc2VsZWN0ZWQnKVxuICAgICAgdGhpcy51bnNlbGVjdChpbmRleCk7XG5cbiAgICBpZiAoc3RhdGUgPT09ICd1bnNlbGVjdGVkJykge1xuICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdID0gJ2Rpc2FibGVkJztcblxuICAgICAgbGV0IGJ1dHRvbiA9IHRoaXMuX2J1dHRvbnNbaW5kZXhdO1xuICAgICAgbGV0IGxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2luZGV4XTtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgICAgaWYgKGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSlcbiAgICAgICAgYnV0dG9uLnJlbW92ZUxpc3RlbmVyKCd0b3VjaHN0YXJ0JywgbGlzdGVuZXIpO1xuICAgICAgZWxzZVxuICAgICAgICBidXR0b24ucmVtb3ZlTGlzdGVuZXIoJ2NsaWNrJywgbGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBsYWJlbHMgb2YgdGhlIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IGxpc3QgVGhlIGxpc3Qgb2Ygb3B0aW9ucy5cbiAgICovXG4gIHNldCBsYWJlbHMobGlzdCkge1xuICAgIHRoaXMuX2xhYmVscyA9IGxpc3Q7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbGFiZWxzIG9mIHRoZSBvcHRpb25zLlxuICAgKiBAdHlwZSB7U3RyaW5nW119XG4gICAqL1xuICBnZXQgbGFiZWxzKCkge1xuICAgIHJldHVybiB0aGlzLl9sYWJlbHM7XG4gIH1cbn1cbiJdfQ==