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

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

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
 * The {@link ClientSelector} module allows to select one or several options among a list.
 */

var Selector = (function (_Module) {
  _inherits(Selector, _Module);

  /**
   * Creates an instance of the class.
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
})(_Module3['default']);

exports['default'] = Selector;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvU2VsZWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7O0FBRzdCLFNBQVMsV0FBVyxDQUFDLEdBQUcsRUFBRTtBQUN4QixTQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFVBQVMsR0FBRyxFQUFFO0FBQ3pDLFdBQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0dBQ2xFLENBQUMsQ0FBQztDQUNKOztBQUVELFNBQVMsV0FBVyxDQUFDLElBQUksRUFBRTtBQUN6QixNQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLE1BQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNYLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2pDLFFBQUksQ0FBQyxLQUFLLENBQUMsRUFDVCxDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBRXZCLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ25CO0FBQ0QsU0FBTyxDQUFDLENBQUM7Q0FDVjs7Ozs7O0lBS29CLFFBQVE7WUFBUixRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJoQixXQWpCUSxRQUFRLEdBaUJEO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFqQkwsUUFBUTs7QUFrQnpCLCtCQWxCaUIsUUFBUSw2Q0FrQm5CLE9BQU8sQ0FBQyxJQUFJLElBQUksVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sRUFBRTs7Ozs7O0FBTTNFLFFBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7Ozs7OztBQU1uQyxRQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDOzs7Ozs7QUFNbkMsUUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1yQixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQzs7QUFFbkIsUUFBSSxPQUFPLE9BQU8sQ0FBQyxXQUFXLEtBQUssV0FBVyxFQUM1QyxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7O0FBRXpDLFFBQUcsT0FBTyxDQUFDLElBQUksRUFBRTs7Ozs7QUFLZixVQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7Ozs7O0FBS3pCLFVBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0tBQ3pCOztBQUVELFFBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLFlBQVksSUFBSSxZQUFZLENBQUM7QUFDMUQsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7R0FDdEI7O2VBL0RrQixRQUFROztXQWlFZixzQkFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNoQyxVQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNDLFlBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVCLFlBQU0sQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RDLFVBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDOztBQUU5QixjQUFRLEtBQUs7QUFDWCxhQUFLLFVBQVU7QUFDYixnQkFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakMsZ0JBQU07O0FBQUEsQUFFUixhQUFLLFlBQVk7QUFDZixjQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25CLGdCQUFNOztBQUFBLEFBRVIsYUFBSyxVQUFVO0FBQ2IsY0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQixjQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25CLGdCQUFNO0FBQUEsT0FDVDs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMvQjs7Ozs7Ozs7V0FNSSxpQkFBRztBQUNOLGlDQTlGaUIsUUFBUSx1Q0E4Rlg7O0FBRWQsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVDLFlBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUIsWUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQzs7QUFFL0IsWUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQ3hCLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV6QixZQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztBQUM1QixZQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUMxQixZQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDcEM7S0FDRjs7Ozs7Ozs7V0FNSSxpQkFBRztBQUNOLFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakQsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO0FBQ3JDLFlBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQUEsQUFFcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbkIsVUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbkIsVUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7S0FDdEI7Ozs7Ozs7O1dBTU0sbUJBQUcsRUFFVDs7Ozs7Ozs7O0FBQUE7OztXQVFLLGdCQUFDLEtBQUssRUFBRTtBQUNaLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRS9CLFVBQUksS0FBSyxLQUFLLFlBQVksRUFBRTs7QUFFMUIsWUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsV0FBVyxFQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFbEMsWUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFbEMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUM7OztBQUdoQyxZQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFMUIsWUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQixZQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFM0MsWUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsV0FBVyxFQUMzQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRWQsZUFBTyxJQUFJLENBQUM7T0FDYjs7QUFFRCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7Ozs7Ozs7O1dBUU8sa0JBQUMsS0FBSyxFQUFFO0FBQ2QsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFL0IsVUFBSSxLQUFLLEtBQUssVUFBVSxFQUFFO0FBQ3hCLFlBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWxDLGNBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsWUFBWSxDQUFDOzs7QUFHbEMsWUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakQsWUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUV2QyxZQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLFlBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUU3QyxlQUFPLEtBQUssQ0FBQztPQUNkOztBQUVELGFBQU8sSUFBSSxDQUFDO0tBQ2I7Ozs7Ozs7OztXQU9LLGdCQUFDLEtBQUssRUFBRTtBQUNaLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ25EOzs7Ozs7OztXQU1LLGdCQUFDLEtBQUssRUFBRTs7O0FBQ1osVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFL0IsVUFBSSxLQUFLLEtBQUssVUFBVSxFQUFFO0FBQ3hCLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsWUFBWSxDQUFDOztBQUVsQyxZQUFJLFFBQVEsR0FBSSxTQUFaLFFBQVE7aUJBQVUsTUFBSyxNQUFNLENBQUMsS0FBSyxDQUFDO1NBQUEsQUFBQyxDQUFDO0FBQzFDLFlBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDOztBQUVsQyxZQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xDLGNBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLFlBQUksb0JBQU8sUUFBUSxDQUFDLFFBQVEsRUFDMUIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsS0FFdkQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDckQ7S0FDRjs7Ozs7Ozs7V0FNTSxpQkFBQyxLQUFLLEVBQUU7QUFDYixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUvQixVQUFJLEtBQUssS0FBSyxVQUFVLEVBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXZCLFVBQUksS0FBSyxLQUFLLFlBQVksRUFBRTtBQUMxQixZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLFVBQVUsQ0FBQzs7QUFFaEMsWUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxZQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RDLGNBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2pDLFlBQUksb0JBQU8sUUFBUSxDQUFDLFFBQVEsRUFDMUIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUMsS0FFOUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7T0FDNUM7S0FDRjs7Ozs7Ozs7U0FNUyxhQUFDLElBQUksRUFBRTtBQUNmLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0tBQ3JCOzs7Ozs7U0FNUyxlQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQ3JCOzs7U0FyUWtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6InNyYy9jbGllbnQvU2VsZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbmZ1bmN0aW9uIHRvVGl0bGVDYXNlKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcd1xcUyovZywgZnVuY3Rpb24odHh0KSB7XG4gICAgcmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnROYW1lKG5hbWUpIHtcbiAgdmFyIGEgPSBuYW1lLnNwbGl0KFwiX1wiKTtcbiAgdmFyIG4gPSBcIlwiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoaSA9PT0gMClcbiAgICAgIG4gKz0gdG9UaXRsZUNhc2UoYVtpXSk7XG4gICAgZWxzZVxuICAgICAgbiArPSBcIiBcIiArIGFbaV07XG4gIH1cbiAgcmV0dXJuIG47XG59XG5cbi8qKlxuICogVGhlIHtAbGluayBDbGllbnRTZWxlY3Rvcn0gbW9kdWxlIGFsbG93cyB0byBzZWxlY3Qgb25lIG9yIHNldmVyYWwgb3B0aW9ucyBhbW9uZyBhIGxpc3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdG9yIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdzZWxlY3RvciddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtET01FbGVtZW50fSBbb3B0aW9ucy52aWV3XSBUaGUgdmlldyBpbiB3aGljaCB0byBkaXNwbGF5IHRoZSBsaXN0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbb3B0aW9ucy5sYWJlbHM9W11dIExhYmVscyBvZiB0aGUgbGlzdCBvcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbb3B0aW9ucy5zdGF0ZXM9W11dIFN0YXRlcyBvZiBlYWNoIGxpc3Qgb3B0aW9uLiBBdXRob3JpemVkIHZhbHVlcyBhcmU6XG4gICAqIC0gJ2BkaXNhYmxlZGAnOiB0aGUgb3B0aW9uIGlzIGRpc2FibGVkICh1bnNlbGVjdGFibGUpXG4gICAqIC0gJ2B1bnNlbGVjdGVkYCc6IHRoZSBvcHRpb24gaXMgdW5zZWxlY3RlZC5cbiAgICogLSBgJ3NlbGVjdGVkJ2A6IHRoZSBvcHRpb25zIGlzIHNlbGVjdGVkLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZGVmYXVsdFN0YXRlPSd1bnNlbGVjdGVkJ10gRGVmYXVsdCBzdGF0ZSBvZiB0aGUgbGlzdCBvcHRpb25zLiBBdXRob3JpemVkIHZhbHVlcyBhcmU6XG4gICAqIC0gJ2BkaXNhYmxlZGAnOiB0aGUgb3B0aW9uIGlzIGRpc2FibGVkICh1bnNlbGVjdGFibGUpXG4gICAqIC0gJ2B1bnNlbGVjdGVkYCc6IHRoZSBvcHRpb24gaXMgdW5zZWxlY3RlZC5cbiAgICogLSBgJ3NlbGVjdGVkJ2A6IHRoZSBvcHRpb25zIGlzIHNlbGVjdGVkLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdzZWxlY3RvcicsICFvcHRpb25zLnZpZXcsIG9wdGlvbnMuY29sb3IgfHwgJ2JsYWNrJyk7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbHMgb2YgdGhlIG9wdGlvbnMuXG4gICAgICogQHR5cGUge1N0cmluZ1tdfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWxzID0gb3B0aW9ucy5sYWJlbHMgfHwgW107XG5cbiAgICAvKipcbiAgICAgKiBDdXJyZW50IHN0YXRlcyBvZiB0aGUgb3B0aW9ucy5cbiAgICAgKiBAdHlwZSB7U3RyaW5nW119XG4gICAgICovXG4gICAgdGhpcy5zdGF0ZXMgPSBvcHRpb25zLnN0YXRlcyB8fCBbXTtcblxuICAgIC8qKlxuICAgICAqIE1heGltdW0gbnVtYmVyIG9mIHNpbXVsdGFuZW91c2x5IHNlbGVjdGVkIG9wdGlvbnMuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLm1heFNlbGVjdGVkID0gMTtcblxuICAgIC8qKlxuICAgICAqIEN1cnJlbnRseSBzZWxlY3RlZCBvcHRpb25zLlxuICAgICAqIEB0eXBlIHtTdHJpbmdbXX1cbiAgICAgKi9cbiAgICB0aGlzLnNlbGVjdGVkID0gW107XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMubWF4U2VsZWN0ZWQgIT09ICd1bmRlZmluZWQnKVxuICAgICAgdGhpcy5tYXhTZWxlY3RlZCA9IG9wdGlvbnMubWF4U2VsZWN0ZWQ7XG5cbiAgICBpZihvcHRpb25zLnZpZXcpIHtcbiAgICAgIC8qKlxuICAgICAgICogVmlldyBvZiB0aGUgcGFyZW50IG1vZHVsZVxuICAgICAgICogQHR5cGUge0RPTUVsZW1lbnR9XG4gICAgICAgKi9cbiAgICAgIHRoaXMudmlldyA9IG9wdGlvbnMudmlldztcblxuICAgICAgLyoqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICB0aGlzLmlzRG9uZSA9IHVuZGVmaW5lZDsgLy8gc2tpcCBzdXBlci5kb25lKClcbiAgICB9XG5cbiAgICB0aGlzLl9kZWZhdWx0U3RhdGUgPSBvcHRpb25zLmRlZmF1bHRTdGF0ZSB8fCAndW5zZWxlY3RlZCc7XG4gICAgdGhpcy5fYnV0dG9ucyA9IFtdO1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICB9XG5cbiAgX3NldHVwQnV0dG9uKGluZGV4LCBsYWJlbCwgc3RhdGUpIHtcbiAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bicpO1xuICAgIGJ1dHRvbi5pbm5lckhUTUwgPSBjb252ZXJ0TmFtZShsYWJlbCk7XG4gICAgdGhpcy5fYnV0dG9uc1tpbmRleF0gPSBidXR0b247XG5cbiAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICBjYXNlICdkaXNhYmxlZCc6XG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAndW5zZWxlY3RlZCc6XG4gICAgICAgIHRoaXMuZW5hYmxlKGluZGV4KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3NlbGVjdGVkJzpcbiAgICAgICAgdGhpcy5lbmFibGUoaW5kZXgpO1xuICAgICAgICB0aGlzLnNlbGVjdChpbmRleCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMudmlldy5hcHBlbmRDaGlsZChidXR0b24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbGFiZWwgPSB0aGlzLl9sYWJlbHNbaV07XG4gICAgICBsZXQgc3RhdGUgPSB0aGlzLl9kZWZhdWx0U3RhdGU7XG5cbiAgICAgIGlmIChpIDwgdGhpcy5zdGF0ZXMubGVuZ3RoKVxuICAgICAgICBzdGF0ZSA9IHRoaXMuc3RhdGVzW2ldO1xuXG4gICAgICB0aGlzLnN0YXRlc1tpXSA9ICdkaXNhYmxlZCc7XG4gICAgICB0aGlzLl9saXN0ZW5lcnNbaV0gPSBudWxsO1xuICAgICAgdGhpcy5fc2V0dXBCdXR0b24oaSwgbGFiZWwsIHN0YXRlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpIHtcbiAgICBsZXQgYnV0dG9ucyA9IHRoaXMudmlldy5xdWVyeVNlbGVjdG9yQWxsKCcuYnRuJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidXR0b25zLmxlbmd0aDsgaSsrKVxuICAgICAgdGhpcy52aWV3LnJlbW92ZUNoaWxkKGJ1dHRvbnNbaV0pO1xuXG4gICAgdGhpcy5zZWxlY3RlZCA9IFtdO1xuICAgIHRoaXMuX2J1dHRvbnMgPSBbXTtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICAvLyBUT0RPXG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0cyBhbiBvcHRpb24uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBUaGUgb3B0aW9uIGluZGV4IHRvIHNlbGVjdC5cbiAgICogQGVtaXRzIHsnc2VsZWN0b3I6c2VsZWN0JywgaW5kZXg6TnVtYmVyLCBsYWJlbDpTdHJpbmd9IFRoZSBpbmRleCBhbmQgbGFiZWwgb2YgdGhlIHNlbGVjdGVkIG9wdGlvbi5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG9wdGlvbiB3YXMgc3VjY2Vzc2Z1bGx5IHNlbGVjdGVkIG9yIG5vdC5cbiAgICovXG4gIHNlbGVjdChpbmRleCkge1xuICAgIGxldCBzdGF0ZSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcblxuICAgIGlmIChzdGF0ZSA9PT0gJ3Vuc2VsZWN0ZWQnKSB7XG4gICAgICAvLyBzdGVhbCBvbGRlc3Qgc2VsZWN0ZWRcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkLmxlbmd0aCA9PT0gdGhpcy5tYXhTZWxlY3RlZClcbiAgICAgICAgdGhpcy51bnNlbGVjdCh0aGlzLnNlbGVjdGVkWzBdKTtcblxuICAgICAgbGV0IGJ1dHRvbiA9IHRoaXMuX2J1dHRvbnNbaW5kZXhdO1xuXG4gICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XSA9ICdzZWxlY3RlZCc7XG5cbiAgICAgIC8vIGFkZCB0byBsaXN0IG9mIHNlbGVjdGVkIGJ1dHRvbnNcbiAgICAgIHRoaXMuc2VsZWN0ZWQucHVzaChpbmRleCk7XG5cbiAgICAgIGxldCBsYWJlbCA9IHRoaXMubGFiZWxzW2luZGV4XTtcbiAgICAgIHRoaXMuZW1pdCgnc2VsZWN0b3I6c2VsZWN0JywgaW5kZXgsIGxhYmVsKTtcblxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQubGVuZ3RoID09PSB0aGlzLm1heFNlbGVjdGVkKVxuICAgICAgICB0aGlzLmRvbmUoKTsgLy8gVE9ETzogYmV3YXJlLCBtaWdodCBjYXVzZSBwcm9ibGVtcyB3aXRoIHRoZSBsYXVuY2ggdGhpbmdcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFVuc2VsZWN0cyBhbiBvcHRpb24uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBUaGUgb3B0aW9uIGluZGV4IHRvIHVuc2VsZWN0LlxuICAgKiBAZW1pdHMgeydzZWxlY3Rvcjp1bnNlbGVjdCcsIGluZGV4Ok51bWJlciwgbGFiZWw6U3RyaW5nfSBUaGUgaW5kZXggYW5kIGxhYmVsIG9mIHRoZSB1bnNlbGVjdGVkIG9wdGlvbi5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG9wdGlvbiB3YXMgc3VjY2Vzc2Z1bGx5IHVuc2VsZWN0ZWQgb3Igbm90LlxuICAgKi9cbiAgdW5zZWxlY3QoaW5kZXgpIHtcbiAgICBsZXQgc3RhdGUgPSB0aGlzLnN0YXRlc1tpbmRleF07XG5cbiAgICBpZiAoc3RhdGUgPT09ICdzZWxlY3RlZCcpIHtcbiAgICAgIGxldCBidXR0b24gPSB0aGlzLl9idXR0b25zW2luZGV4XTtcblxuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF0gPSAndW5zZWxlY3RlZCc7XG5cbiAgICAgIC8vIHVuc2VsZWN0IG9sZGVzdCBzZWxlY3RlZCBidXR0b25cbiAgICAgIGxldCBzZWxlY3RlZEluZGV4ID0gdGhpcy5zZWxlY3RlZC5pbmRleE9mKGluZGV4KTtcbiAgICAgIHRoaXMuc2VsZWN0ZWQuc3BsaWNlKHNlbGVjdGVkSW5kZXgsIDEpO1xuXG4gICAgICBsZXQgbGFiZWwgPSB0aGlzLmxhYmVsc1tpbmRleF07XG4gICAgICB0aGlzLmVtaXQoJ3NlbGVjdG9yOnVuc2VsZWN0JywgaW5kZXgsIGxhYmVsKTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgYW4gb3B0aW9uLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBvcHRpb24gdG8gdG9nZ2xlLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgb3B0aW9uIHdhcyBzdWNjZXNzZnVsbHkgdG9nZ2xlZCBvciBub3QuXG4gICAqL1xuICB0b2dnbGUoaW5kZXgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3QoaW5kZXgpIHx8IHRoaXMudW5zZWxlY3QoaW5kZXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuYWJsZXMgYW4gb3B0aW9uIChhbmQgc2V0cyBpdCB0byBgJ3Vuc2VsZWN0ZWQnYCkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBUaGUgb3B0aW9uIGluZGV4IHRvIGVuYWJsZS5cbiAgICovXG4gIGVuYWJsZShpbmRleCkge1xuICAgIGxldCBzdGF0ZSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcblxuICAgIGlmIChzdGF0ZSA9PT0gJ2Rpc2FibGVkJykge1xuICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdID0gJ3Vuc2VsZWN0ZWQnO1xuXG4gICAgICBsZXQgbGlzdGVuZXIgPSAoKCkgPT4gdGhpcy50b2dnbGUoaW5kZXgpKTtcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tpbmRleF0gPSBsaXN0ZW5lcjtcblxuICAgICAgbGV0IGJ1dHRvbiA9IHRoaXMuX2J1dHRvbnNbaW5kZXhdO1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gICAgICBpZiAoY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlKVxuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGxpc3RlbmVyLCBmYWxzZSk7XG4gICAgICBlbHNlXG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGxpc3RlbmVyLCBmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERpc2FibGVzIGFuIG9wdGlvbiAoYW5kIHVuc2VsZWN0cyBpdCBiZWZvcmUgaWYgbmVlZGVkKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IFRoZSBvcHRpb24gaW5kZXggdG8gZGlzYWJsZS5cbiAgICovXG4gIGRpc2FibGUoaW5kZXgpIHtcbiAgICBsZXQgc3RhdGUgPSB0aGlzLnN0YXRlc1tpbmRleF07XG5cbiAgICBpZiAoc3RhdGUgPT09ICdzZWxlY3RlZCcpXG4gICAgICB0aGlzLnVuc2VsZWN0KGluZGV4KTtcblxuICAgIGlmIChzdGF0ZSA9PT0gJ3Vuc2VsZWN0ZWQnKSB7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF0gPSAnZGlzYWJsZWQnO1xuXG4gICAgICBsZXQgYnV0dG9uID0gdGhpcy5fYnV0dG9uc1tpbmRleF07XG4gICAgICBsZXQgbGlzdGVuZXIgPSB0aGlzLl9saXN0ZW5lcnNbaW5kZXhdO1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgICBpZiAoY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlKVxuICAgICAgICBidXR0b24ucmVtb3ZlTGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBsaXN0ZW5lcik7XG4gICAgICBlbHNlXG4gICAgICAgIGJ1dHRvbi5yZW1vdmVMaXN0ZW5lcignY2xpY2snLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGxhYmVscyBvZiB0aGUgb3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gbGlzdCBUaGUgbGlzdCBvZiBvcHRpb25zLlxuICAgKi9cbiAgc2V0IGxhYmVscyhsaXN0KSB7XG4gICAgdGhpcy5fbGFiZWxzID0gbGlzdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBsYWJlbHMgb2YgdGhlIG9wdGlvbnMuXG4gICAqIEB0eXBlIHtTdHJpbmdbXX1cbiAgICovXG4gIGdldCBsYWJlbHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhYmVscztcbiAgfVxufVxuIl19