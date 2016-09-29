'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash.template');

var _lodash2 = _interopRequireDefault(_lodash);

var _viewport = require('./viewport');

var _viewport2 = _interopRequireDefault(_viewport);

var _domDelegate = require('dom-delegate');

var _domDelegate2 = _interopRequireDefault(_domDelegate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base class for the views.
 *
 * @memberof module:soundworks/client
 */
var View = function () {
  /**
   * _<span class="warning">__WARNING__</span> Views should preferably by
   * created using the [`Experience#createView`]{@link module:soundworks/client.Experience#createView}
   * method._
   *
   * @param {String} template - Template of the view.
   * @param {Object} content - Object containing the variables used to populate
   *  the template. {@link module:soundworks/client.View#content}.
   * @param {Object} events - Listeners to install in the view
   *  {@link module:soundworks/client.View#events}.
   * @param {Object} options - Options of the view.
   *  {@link module:soundworks/client.View#options}.
   */
  function View(template) {
    var content = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var events = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
    (0, _classCallCheck3.default)(this, View);

    /**
     * A function created from the given `template`, to be called with `content` object.
     * @type {Function}
     * @private
     */
    this.tmpl = (0, _lodash2.default)(template);

    /**
     * Data to be used in order to populate the variables of the template.
     * @type {Object}
     * @name content
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.content = content;

    /**
     * Events to attach to the view. Each entry must follow the convention:
     * `'eventName [cssSelector]': callbackFunction`
     * @type {Object}
     * @name events
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.events = events;

    /**
     * Options of the View.
     * @type {Object}
     * @property {String} [el='div'] - String to be used as argument of
     *  `document.createElement` to create the container of the view (`this.$el`).
     * @property {String} [id=null] - String to be used as the `id` of `this.$el`.
     * @property {Array<String>} [className=null] - Array of class to apply to
     *  `this.$el`.
     * @property {Array<String>} [priority=0] - Priority of the view, the view manager
     *  uses this value in order to decide which view should be displayed first.
     * @name options
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.options = (0, _assign2.default)({
      el: 'div',
      id: null,
      className: null,
      priority: 0
    }, options);

    /**
     * Priority of the view.
     * @type {Number}
     * @name priority
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.priority = this.options.priority;

    /**
     * Orientation of the view ('portrait'|'landscape')
     * @type {String}
     * @name orientation
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.orientation = null;

    /**
     * Indicates whether the view is currently visible or not.
     * @type {Boolean}
     * @name isVisible
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.isVisible = false;

    /**
     * If the view is a component, pointer to the parent view.
     * @type {module:soundworks/client.View}
     * @name parentView
     * @default null
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.parentView = null;

    /**
     * The container element of the view. Defaults to `<div>`.
     * @type {Element}
     * @name $el
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.$el = document.createElement(this.options.el);

    /**
     * Store the components (sub-views) of the view.
     * @private
     */
    this._components = {};

    this._delegate = new _domDelegate2.default(this.$el);
    this.onResize = this.onResize.bind(this);

    this.installEvents(this.events, false);
  }

  /**
   * Add or remove a compound view inside the current view.
   * @param {String} selector - Css selector matching an element of the template.
   * @param {View} [view=null] - View to insert inside the selector. If `null`
   *  destroy the component.
   */


  (0, _createClass3.default)(View, [{
    key: 'setViewComponent',
    value: function setViewComponent(selector) {
      var view = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      var prevView = this._components[selector];
      if (prevView instanceof View) {
        prevView.remove();
      }

      if (view === null) {
        delete this._components[selector];
      } else {
        this._components[selector] = view;
        view.setParentView(this);
      }
    }

    /**
     * Sets the parent when is a component view.
     * @param {View} view - Parent view.
     *
     */

  }, {
    key: 'setParentView',
    value: function setParentView(view) {
      this.parentView = view;
    }

    /**
     * Execute a method on all the `components` (sub-views).
     * @param {String} method - The name of the method to be executed.
     * @param {...Mixed} args - Arguments for the given method.
     * @private
     */

  }, {
    key: '_executeViewComponentMethod',
    value: function _executeViewComponentMethod(method) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      for (var selector in this._components) {
        var view = this._components[selector];
        view[method].apply(view, args);
      }
    }

    /**
     * Render partially the view according to the given selector. If the selector
     * is associated to a `component` (sub-views), the `component` is rendered.
     * @param {String} selector - Css selector matching an element of the view.
     * @private
     */

  }, {
    key: '_renderPartial',
    value: function _renderPartial(selector) {
      var $componentContainer = this.$el.querySelector(selector);

      if ($componentContainer === null) throw new Error('selector ' + selector + ' doesn\'t match any element');

      var component = this._components[selector];
      $componentContainer.innerHTML = '';

      if (component) {
        component.render();
        component.appendTo($componentContainer);
        component.onRender();

        if (this.isVisible) component.show();else component.hide();
      } else {
        var html = this.tmpl(this.content);
        var $tmp = document.createElement('div');
        $tmp.innerHTML = html;
        $componentContainer.innerHTML = $tmp.querySelector(selector).innerHTML;
        this.onRender();
      }
    }

    /**
     * Render the whole view and its component (sub-views).
     * @private
     */

  }, {
    key: '_renderAll',
    value: function _renderAll() {
      var options = this.options;
      // set id of the container id given
      if (options.id) this.$el.id = options.id;
      // set classes of the container if given
      if (options.className) {
        var _$el$classList;

        var className = options.className;
        var classes = typeof className === 'string' ? [className] : className;
        (_$el$classList = this.$el.classList).add.apply(_$el$classList, (0, _toConsumableArray3.default)(classes));
      }

      // render template and insert it in the main element
      var html = this.tmpl(this.content);
      this.$el.innerHTML = html;
      this.onRender();

      for (var selector in this._components) {
        this._renderPartial(selector);
      }
    }

    // LIFE CYCLE METHODS ----------------------------------

    /**
     * Render the view according to the given template and content.
     * @param {String} [selector=null] - If not `null`, renders only the part of
     *  the view inside the matched element. If this element contains a component
     *  (sub-view), the component is rendered. Renders all the view otherwise.
     */

  }, {
    key: 'render',
    value: function render() {
      var selector = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (selector !== null) this._renderPartial(selector);else this._renderAll();

      if (this.isVisible) this.onResize(_viewport2.default.width, _viewport2.default.height, _viewport2.default.orientation, true);
    }

    /**
     * Insert the view (`this.$el`) into the given element.
     * @param {Element} $parent - Element inside which the view must be inserted.
     * @private
     */

  }, {
    key: 'appendTo',
    value: function appendTo($parent) {
      this.$parent = $parent;
      $parent.appendChild(this.$el);
    }

    /**
     * Show the view. This method should only be used by the `viewManager`.
     * @private
     */

  }, {
    key: 'show',
    value: function show() {
      this.$el.style.display = 'block';
      this.isVisible = true;
      // must resize before child component
      this._delegateEvents();
      _viewport2.default.addResizeListener(this.onResize);

      this._executeViewComponentMethod('show');
    }

    /**
     * Hide the view and uninstall events. This method should only be used by
     * the `viewManager`.
     * @private
     */

  }, {
    key: 'hide',
    value: function hide() {
      this.$el.style.display = 'none';
      this.isVisible = false;

      this._undelegateEvents();
      _viewport2.default.removeResizeListener(this.onResize);

      this._executeViewComponentMethod('hide');
    }

    /**
     * Cleanly remove the view from it's container. This method should only be
     * used by the `viewManager`.
     * @private
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.hide();
      this.$el.remove();
      this._executeViewComponentMethod('remove');
    }

    /**
     * Entry point when the DOM is created, is mainly exposed to cache some DOM
     * elements.
     */

  }, {
    key: 'onRender',
    value: function onRender() {}

    /**
     * Callback for `viewport.resize` event, it maintains `this.$el` size
     * to fit the viewport size. The method is also called once when the
     * view is actually inserted into the DOM.
     *
     * @param {Number} viewportWidth - Width of the viewport _(in pixels)_.
     * @param {Number} viewportHeight - Height of the viewport _(in pixels)_.
     * @param {String} orientation - Orientation of the viewport.
     * @see {@link module:soundworks/client.viewport}
     */

  }, {
    key: 'onResize',
    value: function onResize(viewportWidth, viewportHeight, orientation) {
      var propagate = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      this.viewportWidth = viewportWidth;
      this.viewportHeight = viewportHeight;
      this.orientation = orientation;

      this.$el.style.width = viewportWidth + 'px';
      this.$el.style.height = viewportHeight + 'px';
      this.$el.classList.remove('portrait', 'landscape');
      this.$el.classList.add(orientation);

      if (propagate) this._executeViewComponentMethod('onResize', viewportWidth, viewportHeight, orientation);
    }

    // EVENTS ----------------------------------------

    /**
     * Install events on the view at any moment of its lifecycle.
     * @param {Object<String, Function>} events - An object of events.
     * @param {Boolean} [override=false] - Defines whether the previous events
     *  are replaced with the new ones.
     */

  }, {
    key: 'installEvents',
    value: function installEvents(events) {
      var override = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      if (this.isVisible) this._undelegateEvents();

      this.events = override ? events : (0, _assign2.default)(this.events, events);

      if (this.isVisible) this._delegateEvents();
    }

    /**
     * Add event listeners on the view.
     * @todo - remove delegation ?
     * @private
     */

  }, {
    key: '_delegateEvents',
    value: function _delegateEvents() {
      for (var key in this.events) {
        var _key$split = key.split(/ +/);

        var _key$split2 = (0, _slicedToArray3.default)(_key$split, 2);

        var event = _key$split2[0];
        var selector = _key$split2[1];

        var callback = this.events[key];

        this._delegate.on(event, selector || null, callback);
      }
    }

    /**
     * Remove event listeners from the view.
     * @todo - remove delegation ?
     * @private
     */

  }, {
    key: '_undelegateEvents',
    value: function _undelegateEvents() {
      this._delegate.off();
    }
  }]);
  return View;
}();

exports.default = View;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlZpZXcuanMiXSwibmFtZXMiOlsiVmlldyIsInRlbXBsYXRlIiwiY29udGVudCIsImV2ZW50cyIsIm9wdGlvbnMiLCJ0bXBsIiwiZWwiLCJpZCIsImNsYXNzTmFtZSIsInByaW9yaXR5Iiwib3JpZW50YXRpb24iLCJpc1Zpc2libGUiLCJwYXJlbnRWaWV3IiwiJGVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiX2NvbXBvbmVudHMiLCJfZGVsZWdhdGUiLCJvblJlc2l6ZSIsImJpbmQiLCJpbnN0YWxsRXZlbnRzIiwic2VsZWN0b3IiLCJ2aWV3IiwicHJldlZpZXciLCJyZW1vdmUiLCJzZXRQYXJlbnRWaWV3IiwibWV0aG9kIiwiYXJncyIsIiRjb21wb25lbnRDb250YWluZXIiLCJxdWVyeVNlbGVjdG9yIiwiRXJyb3IiLCJjb21wb25lbnQiLCJpbm5lckhUTUwiLCJyZW5kZXIiLCJhcHBlbmRUbyIsIm9uUmVuZGVyIiwic2hvdyIsImhpZGUiLCJodG1sIiwiJHRtcCIsImNsYXNzZXMiLCJjbGFzc0xpc3QiLCJhZGQiLCJfcmVuZGVyUGFydGlhbCIsIl9yZW5kZXJBbGwiLCJ3aWR0aCIsImhlaWdodCIsIiRwYXJlbnQiLCJhcHBlbmRDaGlsZCIsInN0eWxlIiwiZGlzcGxheSIsIl9kZWxlZ2F0ZUV2ZW50cyIsImFkZFJlc2l6ZUxpc3RlbmVyIiwiX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kIiwiX3VuZGVsZWdhdGVFdmVudHMiLCJyZW1vdmVSZXNpemVMaXN0ZW5lciIsInZpZXdwb3J0V2lkdGgiLCJ2aWV3cG9ydEhlaWdodCIsInByb3BhZ2F0ZSIsIm92ZXJyaWRlIiwia2V5Iiwic3BsaXQiLCJldmVudCIsImNhbGxiYWNrIiwib24iLCJvZmYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7SUFLTUEsSTtBQUNKOzs7Ozs7Ozs7Ozs7O0FBYUEsZ0JBQVlDLFFBQVosRUFBK0Q7QUFBQSxRQUF6Q0MsT0FBeUMseURBQS9CLEVBQStCO0FBQUEsUUFBM0JDLE1BQTJCLHlEQUFsQixFQUFrQjtBQUFBLFFBQWRDLE9BQWMseURBQUosRUFBSTtBQUFBOztBQUM3RDs7Ozs7QUFLQSxTQUFLQyxJQUFMLEdBQVksc0JBQUtKLFFBQUwsQ0FBWjs7QUFFQTs7Ozs7OztBQU9BLFNBQUtDLE9BQUwsR0FBZUEsT0FBZjs7QUFFQTs7Ozs7Ozs7QUFRQSxTQUFLQyxNQUFMLEdBQWNBLE1BQWQ7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FBY0EsU0FBS0MsT0FBTCxHQUFlLHNCQUFjO0FBQzNCRSxVQUFJLEtBRHVCO0FBRTNCQyxVQUFJLElBRnVCO0FBRzNCQyxpQkFBVyxJQUhnQjtBQUkzQkMsZ0JBQVU7QUFKaUIsS0FBZCxFQUtaTCxPQUxZLENBQWY7O0FBT0E7Ozs7Ozs7QUFPQSxTQUFLSyxRQUFMLEdBQWdCLEtBQUtMLE9BQUwsQ0FBYUssUUFBN0I7O0FBRUE7Ozs7Ozs7QUFPQSxTQUFLQyxXQUFMLEdBQW1CLElBQW5COztBQUVBOzs7Ozs7O0FBT0EsU0FBS0MsU0FBTCxHQUFpQixLQUFqQjs7QUFFQTs7Ozs7Ozs7QUFRQSxTQUFLQyxVQUFMLEdBQWtCLElBQWxCOztBQUVBOzs7Ozs7O0FBT0EsU0FBS0MsR0FBTCxHQUFXQyxTQUFTQyxhQUFULENBQXVCLEtBQUtYLE9BQUwsQ0FBYUUsRUFBcEMsQ0FBWDs7QUFFQTs7OztBQUlBLFNBQUtVLFdBQUwsR0FBbUIsRUFBbkI7O0FBRUEsU0FBS0MsU0FBTCxHQUFpQiwwQkFBYSxLQUFLSixHQUFsQixDQUFqQjtBQUNBLFNBQUtLLFFBQUwsR0FBZ0IsS0FBS0EsUUFBTCxDQUFjQyxJQUFkLENBQW1CLElBQW5CLENBQWhCOztBQUVBLFNBQUtDLGFBQUwsQ0FBbUIsS0FBS2pCLE1BQXhCLEVBQWdDLEtBQWhDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7cUNBTWlCa0IsUSxFQUF1QjtBQUFBLFVBQWJDLElBQWEseURBQU4sSUFBTTs7QUFDdEMsVUFBTUMsV0FBVyxLQUFLUCxXQUFMLENBQWlCSyxRQUFqQixDQUFqQjtBQUNBLFVBQUlFLG9CQUFvQnZCLElBQXhCLEVBQThCO0FBQUV1QixpQkFBU0MsTUFBVDtBQUFvQjs7QUFFcEQsVUFBSUYsU0FBUyxJQUFiLEVBQW1CO0FBQ2pCLGVBQU8sS0FBS04sV0FBTCxDQUFpQkssUUFBakIsQ0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLGFBQUtMLFdBQUwsQ0FBaUJLLFFBQWpCLElBQTZCQyxJQUE3QjtBQUNBQSxhQUFLRyxhQUFMLENBQW1CLElBQW5CO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7a0NBS2NILEksRUFBTTtBQUNsQixXQUFLVixVQUFMLEdBQWtCVSxJQUFsQjtBQUNEOztBQUVEOzs7Ozs7Ozs7Z0RBTTRCSSxNLEVBQWlCO0FBQUEsd0NBQU5DLElBQU07QUFBTkEsWUFBTTtBQUFBOztBQUMzQyxXQUFLLElBQUlOLFFBQVQsSUFBcUIsS0FBS0wsV0FBMUIsRUFBdUM7QUFDckMsWUFBTU0sT0FBTyxLQUFLTixXQUFMLENBQWlCSyxRQUFqQixDQUFiO0FBQ0FDLGFBQUtJLE1BQUwsY0FBZ0JDLElBQWhCO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7O21DQU1lTixRLEVBQVU7QUFDdkIsVUFBTU8sc0JBQXNCLEtBQUtmLEdBQUwsQ0FBU2dCLGFBQVQsQ0FBdUJSLFFBQXZCLENBQTVCOztBQUVBLFVBQUlPLHdCQUF3QixJQUE1QixFQUNFLE1BQU0sSUFBSUUsS0FBSixlQUFzQlQsUUFBdEIsaUNBQU47O0FBRUYsVUFBTVUsWUFBWSxLQUFLZixXQUFMLENBQWlCSyxRQUFqQixDQUFsQjtBQUNBTywwQkFBb0JJLFNBQXBCLEdBQWdDLEVBQWhDOztBQUVBLFVBQUlELFNBQUosRUFBZTtBQUNiQSxrQkFBVUUsTUFBVjtBQUNBRixrQkFBVUcsUUFBVixDQUFtQk4sbUJBQW5CO0FBQ0FHLGtCQUFVSSxRQUFWOztBQUVBLFlBQUksS0FBS3hCLFNBQVQsRUFDRW9CLFVBQVVLLElBQVYsR0FERixLQUdFTCxVQUFVTSxJQUFWO0FBQ0gsT0FURCxNQVNPO0FBQ0wsWUFBTUMsT0FBTyxLQUFLakMsSUFBTCxDQUFVLEtBQUtILE9BQWYsQ0FBYjtBQUNBLFlBQU1xQyxPQUFPekIsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFiO0FBQ0F3QixhQUFLUCxTQUFMLEdBQWlCTSxJQUFqQjtBQUNBViw0QkFBb0JJLFNBQXBCLEdBQWdDTyxLQUFLVixhQUFMLENBQW1CUixRQUFuQixFQUE2QlcsU0FBN0Q7QUFDQSxhQUFLRyxRQUFMO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7OztpQ0FJYTtBQUNYLFVBQU0vQixVQUFVLEtBQUtBLE9BQXJCO0FBQ0E7QUFDQSxVQUFJQSxRQUFRRyxFQUFaLEVBQ0UsS0FBS00sR0FBTCxDQUFTTixFQUFULEdBQWNILFFBQVFHLEVBQXRCO0FBQ0Y7QUFDQSxVQUFJSCxRQUFRSSxTQUFaLEVBQXVCO0FBQUE7O0FBQ3JCLFlBQU1BLFlBQVlKLFFBQVFJLFNBQTFCO0FBQ0EsWUFBTWdDLFVBQVUsT0FBT2hDLFNBQVAsS0FBcUIsUUFBckIsR0FBZ0MsQ0FBQ0EsU0FBRCxDQUFoQyxHQUE4Q0EsU0FBOUQ7QUFDQSwrQkFBS0ssR0FBTCxDQUFTNEIsU0FBVCxFQUFtQkMsR0FBbkIsd0RBQTBCRixPQUExQjtBQUNEOztBQUVEO0FBQ0EsVUFBTUYsT0FBTyxLQUFLakMsSUFBTCxDQUFVLEtBQUtILE9BQWYsQ0FBYjtBQUNBLFdBQUtXLEdBQUwsQ0FBU21CLFNBQVQsR0FBcUJNLElBQXJCO0FBQ0EsV0FBS0gsUUFBTDs7QUFFQSxXQUFLLElBQUlkLFFBQVQsSUFBcUIsS0FBS0wsV0FBMUI7QUFDRSxhQUFLMkIsY0FBTCxDQUFvQnRCLFFBQXBCO0FBREY7QUFFRDs7QUFFRDs7QUFFQTs7Ozs7Ozs7OzZCQU13QjtBQUFBLFVBQWpCQSxRQUFpQix5REFBTixJQUFNOztBQUN0QixVQUFJQSxhQUFhLElBQWpCLEVBQ0UsS0FBS3NCLGNBQUwsQ0FBb0J0QixRQUFwQixFQURGLEtBR0UsS0FBS3VCLFVBQUw7O0FBRUYsVUFBSSxLQUFLakMsU0FBVCxFQUNFLEtBQUtPLFFBQUwsQ0FBYyxtQkFBUzJCLEtBQXZCLEVBQThCLG1CQUFTQyxNQUF2QyxFQUErQyxtQkFBU3BDLFdBQXhELEVBQXFFLElBQXJFO0FBQ0g7O0FBRUQ7Ozs7Ozs7OzZCQUtTcUMsTyxFQUFTO0FBQ2hCLFdBQUtBLE9BQUwsR0FBZUEsT0FBZjtBQUNBQSxjQUFRQyxXQUFSLENBQW9CLEtBQUtuQyxHQUF6QjtBQUNEOztBQUVEOzs7Ozs7OzJCQUlPO0FBQ0wsV0FBS0EsR0FBTCxDQUFTb0MsS0FBVCxDQUFlQyxPQUFmLEdBQXlCLE9BQXpCO0FBQ0EsV0FBS3ZDLFNBQUwsR0FBaUIsSUFBakI7QUFDQTtBQUNBLFdBQUt3QyxlQUFMO0FBQ0EseUJBQVNDLGlCQUFULENBQTJCLEtBQUtsQyxRQUFoQzs7QUFFQSxXQUFLbUMsMkJBQUwsQ0FBaUMsTUFBakM7QUFDRDs7QUFFRDs7Ozs7Ozs7MkJBS087QUFDTCxXQUFLeEMsR0FBTCxDQUFTb0MsS0FBVCxDQUFlQyxPQUFmLEdBQXlCLE1BQXpCO0FBQ0EsV0FBS3ZDLFNBQUwsR0FBaUIsS0FBakI7O0FBRUEsV0FBSzJDLGlCQUFMO0FBQ0EseUJBQVNDLG9CQUFULENBQThCLEtBQUtyQyxRQUFuQzs7QUFFQSxXQUFLbUMsMkJBQUwsQ0FBaUMsTUFBakM7QUFDRDs7QUFFRDs7Ozs7Ozs7NkJBS1M7QUFDUCxXQUFLaEIsSUFBTDtBQUNBLFdBQUt4QixHQUFMLENBQVNXLE1BQVQ7QUFDQSxXQUFLNkIsMkJBQUwsQ0FBaUMsUUFBakM7QUFDRDs7QUFFRDs7Ozs7OzsrQkFJVyxDQUFFOztBQUViOzs7Ozs7Ozs7Ozs7OzZCQVVTRyxhLEVBQWVDLGMsRUFBZ0IvQyxXLEVBQWdDO0FBQUEsVUFBbkJnRCxTQUFtQix5REFBUCxLQUFPOztBQUN0RSxXQUFLRixhQUFMLEdBQXFCQSxhQUFyQjtBQUNBLFdBQUtDLGNBQUwsR0FBc0JBLGNBQXRCO0FBQ0EsV0FBSy9DLFdBQUwsR0FBbUJBLFdBQW5COztBQUVBLFdBQUtHLEdBQUwsQ0FBU29DLEtBQVQsQ0FBZUosS0FBZixHQUEwQlcsYUFBMUI7QUFDQSxXQUFLM0MsR0FBTCxDQUFTb0MsS0FBVCxDQUFlSCxNQUFmLEdBQTJCVyxjQUEzQjtBQUNBLFdBQUs1QyxHQUFMLENBQVM0QixTQUFULENBQW1CakIsTUFBbkIsQ0FBMEIsVUFBMUIsRUFBc0MsV0FBdEM7QUFDQSxXQUFLWCxHQUFMLENBQVM0QixTQUFULENBQW1CQyxHQUFuQixDQUF1QmhDLFdBQXZCOztBQUVBLFVBQUlnRCxTQUFKLEVBQ0UsS0FBS0wsMkJBQUwsQ0FBaUMsVUFBakMsRUFBNkNHLGFBQTdDLEVBQTREQyxjQUE1RCxFQUE0RS9DLFdBQTVFO0FBQ0g7O0FBRUQ7O0FBRUE7Ozs7Ozs7OztrQ0FNY1AsTSxFQUEwQjtBQUFBLFVBQWxCd0QsUUFBa0IseURBQVAsS0FBTzs7QUFDdEMsVUFBSSxLQUFLaEQsU0FBVCxFQUNFLEtBQUsyQyxpQkFBTDs7QUFFRixXQUFLbkQsTUFBTCxHQUFjd0QsV0FBV3hELE1BQVgsR0FBb0Isc0JBQWMsS0FBS0EsTUFBbkIsRUFBMkJBLE1BQTNCLENBQWxDOztBQUVBLFVBQUksS0FBS1EsU0FBVCxFQUNFLEtBQUt3QyxlQUFMO0FBQ0g7O0FBRUQ7Ozs7Ozs7O3NDQUtrQjtBQUNoQixXQUFLLElBQUlTLEdBQVQsSUFBZ0IsS0FBS3pELE1BQXJCLEVBQTZCO0FBQUEseUJBQ0R5RCxJQUFJQyxLQUFKLENBQVUsSUFBVixDQURDOztBQUFBOztBQUFBLFlBQ3BCQyxLQURvQjtBQUFBLFlBQ2J6QyxRQURhOztBQUUzQixZQUFNMEMsV0FBVyxLQUFLNUQsTUFBTCxDQUFZeUQsR0FBWixDQUFqQjs7QUFFQSxhQUFLM0MsU0FBTCxDQUFlK0MsRUFBZixDQUFrQkYsS0FBbEIsRUFBeUJ6QyxZQUFZLElBQXJDLEVBQTJDMEMsUUFBM0M7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozt3Q0FLb0I7QUFDbEIsV0FBSzlDLFNBQUwsQ0FBZWdELEdBQWY7QUFDRDs7Ozs7a0JBR1lqRSxJIiwiZmlsZSI6IlZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdG1wbCBmcm9tICdsb2Rhc2gudGVtcGxhdGUnO1xuaW1wb3J0IHZpZXdwb3J0IGZyb20gJy4vdmlld3BvcnQnO1xuaW1wb3J0IERlbGVnYXRlIGZyb20gJ2RvbS1kZWxlZ2F0ZSc7XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgdGhlIHZpZXdzLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqL1xuY2xhc3MgVmlldyB7XG4gIC8qKlxuICAgKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFZpZXdzIHNob3VsZCBwcmVmZXJhYmx5IGJ5XG4gICAqIGNyZWF0ZWQgdXNpbmcgdGhlIFtgRXhwZXJpZW5jZSNjcmVhdGVWaWV3YF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkV4cGVyaWVuY2UjY3JlYXRlVmlld31cbiAgICogbWV0aG9kLl9cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRlbXBsYXRlIC0gVGVtcGxhdGUgb2YgdGhlIHZpZXcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHZhcmlhYmxlcyB1c2VkIHRvIHBvcHVsYXRlXG4gICAqICB0aGUgdGVtcGxhdGUuIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNjb250ZW50fS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50cyAtIExpc3RlbmVycyB0byBpbnN0YWxsIGluIHRoZSB2aWV3XG4gICAqICB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjZXZlbnRzfS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIG9mIHRoZSB2aWV3LlxuICAgKiAge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3I29wdGlvbnN9LlxuICAgKi9cbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQgPSB7fSwgZXZlbnRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIC8qKlxuICAgICAqIEEgZnVuY3Rpb24gY3JlYXRlZCBmcm9tIHRoZSBnaXZlbiBgdGVtcGxhdGVgLCB0byBiZSBjYWxsZWQgd2l0aCBgY29udGVudGAgb2JqZWN0LlxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMudG1wbCA9IHRtcGwodGVtcGxhdGUpO1xuXG4gICAgLyoqXG4gICAgICogRGF0YSB0byBiZSB1c2VkIGluIG9yZGVyIHRvIHBvcHVsYXRlIHRoZSB2YXJpYWJsZXMgb2YgdGhlIHRlbXBsYXRlLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgY29udGVudFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICAgICAqL1xuICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudHMgdG8gYXR0YWNoIHRvIHRoZSB2aWV3LiBFYWNoIGVudHJ5IG11c3QgZm9sbG93IHRoZSBjb252ZW50aW9uOlxuICAgICAqIGAnZXZlbnROYW1lIFtjc3NTZWxlY3Rvcl0nOiBjYWxsYmFja0Z1bmN0aW9uYFxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgZXZlbnRzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICovXG4gICAgdGhpcy5ldmVudHMgPSBldmVudHM7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25zIG9mIHRoZSBWaWV3LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IFtlbD0nZGl2J10gLSBTdHJpbmcgdG8gYmUgdXNlZCBhcyBhcmd1bWVudCBvZlxuICAgICAqICBgZG9jdW1lbnQuY3JlYXRlRWxlbWVudGAgdG8gY3JlYXRlIHRoZSBjb250YWluZXIgb2YgdGhlIHZpZXcgKGB0aGlzLiRlbGApLlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbaWQ9bnVsbF0gLSBTdHJpbmcgdG8gYmUgdXNlZCBhcyB0aGUgYGlkYCBvZiBgdGhpcy4kZWxgLlxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXk8U3RyaW5nPn0gW2NsYXNzTmFtZT1udWxsXSAtIEFycmF5IG9mIGNsYXNzIHRvIGFwcGx5IHRvXG4gICAgICogIGB0aGlzLiRlbGAuXG4gICAgICogQHByb3BlcnR5IHtBcnJheTxTdHJpbmc+fSBbcHJpb3JpdHk9MF0gLSBQcmlvcml0eSBvZiB0aGUgdmlldywgdGhlIHZpZXcgbWFuYWdlclxuICAgICAqICB1c2VzIHRoaXMgdmFsdWUgaW4gb3JkZXIgdG8gZGVjaWRlIHdoaWNoIHZpZXcgc2hvdWxkIGJlIGRpc3BsYXllZCBmaXJzdC5cbiAgICAgKiBAbmFtZSBvcHRpb25zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBlbDogJ2RpdicsXG4gICAgICBpZDogbnVsbCxcbiAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICAgIHByaW9yaXR5OiAwLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogUHJpb3JpdHkgb2YgdGhlIHZpZXcuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbmFtZSBwcmlvcml0eVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICAgICAqL1xuICAgIHRoaXMucHJpb3JpdHkgPSB0aGlzLm9wdGlvbnMucHJpb3JpdHk7XG5cbiAgICAvKipcbiAgICAgKiBPcmllbnRhdGlvbiBvZiB0aGUgdmlldyAoJ3BvcnRyYWl0J3wnbGFuZHNjYXBlJylcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBuYW1lIG9yaWVudGF0aW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICovXG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdmlldyBpcyBjdXJyZW50bHkgdmlzaWJsZSBvciBub3QuXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG5hbWUgaXNWaXNpYmxlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICovXG4gICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIElmIHRoZSB2aWV3IGlzIGEgY29tcG9uZW50LCBwb2ludGVyIHRvIHRoZSBwYXJlbnQgdmlldy5cbiAgICAgKiBAdHlwZSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXd9XG4gICAgICogQG5hbWUgcGFyZW50Vmlld1xuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAgICAgKi9cbiAgICB0aGlzLnBhcmVudFZpZXcgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNvbnRhaW5lciBlbGVtZW50IG9mIHRoZSB2aWV3LiBEZWZhdWx0cyB0byBgPGRpdj5gLlxuICAgICAqIEB0eXBlIHtFbGVtZW50fVxuICAgICAqIEBuYW1lICRlbFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICAgICAqL1xuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLm9wdGlvbnMuZWwpO1xuXG4gICAgLyoqXG4gICAgICogU3RvcmUgdGhlIGNvbXBvbmVudHMgKHN1Yi12aWV3cykgb2YgdGhlIHZpZXcuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9jb21wb25lbnRzID0ge307XG5cbiAgICB0aGlzLl9kZWxlZ2F0ZSA9IG5ldyBEZWxlZ2F0ZSh0aGlzLiRlbCk7XG4gICAgdGhpcy5vblJlc2l6ZSA9IHRoaXMub25SZXNpemUuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh0aGlzLmV2ZW50cywgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBvciByZW1vdmUgYSBjb21wb3VuZCB2aWV3IGluc2lkZSB0aGUgY3VycmVudCB2aWV3LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgLSBDc3Mgc2VsZWN0b3IgbWF0Y2hpbmcgYW4gZWxlbWVudCBvZiB0aGUgdGVtcGxhdGUuXG4gICAqIEBwYXJhbSB7Vmlld30gW3ZpZXc9bnVsbF0gLSBWaWV3IHRvIGluc2VydCBpbnNpZGUgdGhlIHNlbGVjdG9yLiBJZiBgbnVsbGBcbiAgICogIGRlc3Ryb3kgdGhlIGNvbXBvbmVudC5cbiAgICovXG4gIHNldFZpZXdDb21wb25lbnQoc2VsZWN0b3IsIHZpZXcgPSBudWxsKSB7XG4gICAgY29uc3QgcHJldlZpZXcgPSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICBpZiAocHJldlZpZXcgaW5zdGFuY2VvZiBWaWV3KSB7IHByZXZWaWV3LnJlbW92ZSgpOyB9XG5cbiAgICBpZiAodmlldyA9PT0gbnVsbCkge1xuICAgICAgZGVsZXRlIHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXSA9IHZpZXc7XG4gICAgICB2aWV3LnNldFBhcmVudFZpZXcodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHBhcmVudCB3aGVuIGlzIGEgY29tcG9uZW50IHZpZXcuXG4gICAqIEBwYXJhbSB7Vmlld30gdmlldyAtIFBhcmVudCB2aWV3LlxuICAgKlxuICAgKi9cbiAgc2V0UGFyZW50Vmlldyh2aWV3KSB7XG4gICAgdGhpcy5wYXJlbnRWaWV3ID0gdmlldztcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGEgbWV0aG9kIG9uIGFsbCB0aGUgYGNvbXBvbmVudHNgIChzdWItdmlld3MpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kIC0gVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCB0byBiZSBleGVjdXRlZC5cbiAgICogQHBhcmFtIHsuLi5NaXhlZH0gYXJncyAtIEFyZ3VtZW50cyBmb3IgdGhlIGdpdmVuIG1ldGhvZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZChtZXRob2QsIC4uLmFyZ3MpIHtcbiAgICBmb3IgKGxldCBzZWxlY3RvciBpbiB0aGlzLl9jb21wb25lbnRzKSB7XG4gICAgICBjb25zdCB2aWV3ID0gdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgICB2aWV3W21ldGhvZF0oLi4uYXJncyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBwYXJ0aWFsbHkgdGhlIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBzZWxlY3Rvci4gSWYgdGhlIHNlbGVjdG9yXG4gICAqIGlzIGFzc29jaWF0ZWQgdG8gYSBgY29tcG9uZW50YCAoc3ViLXZpZXdzKSwgdGhlIGBjb21wb25lbnRgIGlzIHJlbmRlcmVkLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgLSBDc3Mgc2VsZWN0b3IgbWF0Y2hpbmcgYW4gZWxlbWVudCBvZiB0aGUgdmlldy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9yZW5kZXJQYXJ0aWFsKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgJGNvbXBvbmVudENvbnRhaW5lciA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gICAgaWYgKCRjb21wb25lbnRDb250YWluZXIgPT09IG51bGwpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHNlbGVjdG9yICR7c2VsZWN0b3J9IGRvZXNuJ3QgbWF0Y2ggYW55IGVsZW1lbnRgKTtcblxuICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdO1xuICAgICRjb21wb25lbnRDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG5cbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICBjb21wb25lbnQucmVuZGVyKCk7XG4gICAgICBjb21wb25lbnQuYXBwZW5kVG8oJGNvbXBvbmVudENvbnRhaW5lcik7XG4gICAgICBjb21wb25lbnQub25SZW5kZXIoKTtcblxuICAgICAgaWYgKHRoaXMuaXNWaXNpYmxlKVxuICAgICAgICBjb21wb25lbnQuc2hvdygpO1xuICAgICAgZWxzZVxuICAgICAgICBjb21wb25lbnQuaGlkZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBodG1sID0gdGhpcy50bXBsKHRoaXMuY29udGVudCk7XG4gICAgICBjb25zdCAkdG1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAkdG1wLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAkY29tcG9uZW50Q29udGFpbmVyLmlubmVySFRNTCA9ICR0bXAucXVlcnlTZWxlY3RvcihzZWxlY3RvcikuaW5uZXJIVE1MO1xuICAgICAgdGhpcy5vblJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIHdob2xlIHZpZXcgYW5kIGl0cyBjb21wb25lbnQgKHN1Yi12aWV3cykuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcmVuZGVyQWxsKCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgLy8gc2V0IGlkIG9mIHRoZSBjb250YWluZXIgaWQgZ2l2ZW5cbiAgICBpZiAob3B0aW9ucy5pZClcbiAgICAgIHRoaXMuJGVsLmlkID0gb3B0aW9ucy5pZDtcbiAgICAvLyBzZXQgY2xhc3NlcyBvZiB0aGUgY29udGFpbmVyIGlmIGdpdmVuXG4gICAgaWYgKG9wdGlvbnMuY2xhc3NOYW1lKSB7XG4gICAgICBjb25zdCBjbGFzc05hbWUgPSBvcHRpb25zLmNsYXNzTmFtZTtcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSB0eXBlb2YgY2xhc3NOYW1lID09PSAnc3RyaW5nJyA/IFtjbGFzc05hbWVdIDogY2xhc3NOYW1lO1xuICAgICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKTtcbiAgICB9XG5cbiAgICAvLyByZW5kZXIgdGVtcGxhdGUgYW5kIGluc2VydCBpdCBpbiB0aGUgbWFpbiBlbGVtZW50XG4gICAgY29uc3QgaHRtbCA9IHRoaXMudG1wbCh0aGlzLmNvbnRlbnQpO1xuICAgIHRoaXMuJGVsLmlubmVySFRNTCA9IGh0bWw7XG4gICAgdGhpcy5vblJlbmRlcigpO1xuXG4gICAgZm9yIChsZXQgc2VsZWN0b3IgaW4gdGhpcy5fY29tcG9uZW50cylcbiAgICAgIHRoaXMuX3JlbmRlclBhcnRpYWwoc2VsZWN0b3IpO1xuICB9XG5cbiAgLy8gTElGRSBDWUNMRSBNRVRIT0RTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSB2aWV3IGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gdGVtcGxhdGUgYW5kIGNvbnRlbnQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbc2VsZWN0b3I9bnVsbF0gLSBJZiBub3QgYG51bGxgLCByZW5kZXJzIG9ubHkgdGhlIHBhcnQgb2ZcbiAgICogIHRoZSB2aWV3IGluc2lkZSB0aGUgbWF0Y2hlZCBlbGVtZW50LiBJZiB0aGlzIGVsZW1lbnQgY29udGFpbnMgYSBjb21wb25lbnRcbiAgICogIChzdWItdmlldyksIHRoZSBjb21wb25lbnQgaXMgcmVuZGVyZWQuIFJlbmRlcnMgYWxsIHRoZSB2aWV3IG90aGVyd2lzZS5cbiAgICovXG4gIHJlbmRlcihzZWxlY3RvciA9IG51bGwpIHtcbiAgICBpZiAoc2VsZWN0b3IgIT09IG51bGwpXG4gICAgICB0aGlzLl9yZW5kZXJQYXJ0aWFsKHNlbGVjdG9yKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLl9yZW5kZXJBbGwoKTtcblxuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMub25SZXNpemUodmlld3BvcnQud2lkdGgsIHZpZXdwb3J0LmhlaWdodCwgdmlld3BvcnQub3JpZW50YXRpb24sIHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydCB0aGUgdmlldyAoYHRoaXMuJGVsYCkgaW50byB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkcGFyZW50IC0gRWxlbWVudCBpbnNpZGUgd2hpY2ggdGhlIHZpZXcgbXVzdCBiZSBpbnNlcnRlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGFwcGVuZFRvKCRwYXJlbnQpIHtcbiAgICB0aGlzLiRwYXJlbnQgPSAkcGFyZW50O1xuICAgICRwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3cgdGhlIHZpZXcuIFRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIHVzZWQgYnkgdGhlIGB2aWV3TWFuYWdlcmAuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzaG93KCkge1xuICAgIHRoaXMuJGVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIHRoaXMuaXNWaXNpYmxlID0gdHJ1ZTtcbiAgICAvLyBtdXN0IHJlc2l6ZSBiZWZvcmUgY2hpbGQgY29tcG9uZW50XG4gICAgdGhpcy5fZGVsZWdhdGVFdmVudHMoKTtcbiAgICB2aWV3cG9ydC5hZGRSZXNpemVMaXN0ZW5lcih0aGlzLm9uUmVzaXplKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdzaG93Jyk7XG4gIH1cblxuICAvKipcbiAgICogSGlkZSB0aGUgdmlldyBhbmQgdW5pbnN0YWxsIGV2ZW50cy4gVGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgdXNlZCBieVxuICAgKiB0aGUgYHZpZXdNYW5hZ2VyYC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGhpZGUoKSB7XG4gICAgdGhpcy4kZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgdGhpcy5fdW5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgIHZpZXdwb3J0LnJlbW92ZVJlc2l6ZUxpc3RlbmVyKHRoaXMub25SZXNpemUpO1xuXG4gICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ2hpZGUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhbmx5IHJlbW92ZSB0aGUgdmlldyBmcm9tIGl0J3MgY29udGFpbmVyLiBUaGlzIG1ldGhvZCBzaG91bGQgb25seSBiZVxuICAgKiB1c2VkIGJ5IHRoZSBgdmlld01hbmFnZXJgLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVtb3ZlKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xuICAgIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdyZW1vdmUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnRyeSBwb2ludCB3aGVuIHRoZSBET00gaXMgY3JlYXRlZCwgaXMgbWFpbmx5IGV4cG9zZWQgdG8gY2FjaGUgc29tZSBET01cbiAgICogZWxlbWVudHMuXG4gICAqL1xuICBvblJlbmRlcigpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciBgdmlld3BvcnQucmVzaXplYCBldmVudCwgaXQgbWFpbnRhaW5zIGB0aGlzLiRlbGAgc2l6ZVxuICAgKiB0byBmaXQgdGhlIHZpZXdwb3J0IHNpemUuIFRoZSBtZXRob2QgaXMgYWxzbyBjYWxsZWQgb25jZSB3aGVuIHRoZVxuICAgKiB2aWV3IGlzIGFjdHVhbGx5IGluc2VydGVkIGludG8gdGhlIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZpZXdwb3J0V2lkdGggLSBXaWR0aCBvZiB0aGUgdmlld3BvcnQgXyhpbiBwaXhlbHMpXy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZpZXdwb3J0SGVpZ2h0IC0gSGVpZ2h0IG9mIHRoZSB2aWV3cG9ydCBfKGluIHBpeGVscylfLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3JpZW50YXRpb24gLSBPcmllbnRhdGlvbiBvZiB0aGUgdmlld3BvcnQuXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC52aWV3cG9ydH1cbiAgICovXG4gIG9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbiwgcHJvcGFnYXRlID0gZmFsc2UpIHtcbiAgICB0aGlzLnZpZXdwb3J0V2lkdGggPSB2aWV3cG9ydFdpZHRoO1xuICAgIHRoaXMudmlld3BvcnRIZWlnaHQgPSB2aWV3cG9ydEhlaWdodDtcbiAgICB0aGlzLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb247XG5cbiAgICB0aGlzLiRlbC5zdHlsZS53aWR0aCA9IGAke3ZpZXdwb3J0V2lkdGh9cHhgO1xuICAgIHRoaXMuJGVsLnN0eWxlLmhlaWdodCA9IGAke3ZpZXdwb3J0SGVpZ2h0fXB4YDtcbiAgICB0aGlzLiRlbC5jbGFzc0xpc3QucmVtb3ZlKCdwb3J0cmFpdCcsICdsYW5kc2NhcGUnKTtcbiAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKG9yaWVudGF0aW9uKTtcblxuICAgIGlmIChwcm9wYWdhdGUpXG4gICAgICB0aGlzLl9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZCgnb25SZXNpemUnLCB2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pO1xuICB9XG5cbiAgLy8gRVZFTlRTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogSW5zdGFsbCBldmVudHMgb24gdGhlIHZpZXcgYXQgYW55IG1vbWVudCBvZiBpdHMgbGlmZWN5Y2xlLlxuICAgKiBAcGFyYW0ge09iamVjdDxTdHJpbmcsIEZ1bmN0aW9uPn0gZXZlbnRzIC0gQW4gb2JqZWN0IG9mIGV2ZW50cy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3ZlcnJpZGU9ZmFsc2VdIC0gRGVmaW5lcyB3aGV0aGVyIHRoZSBwcmV2aW91cyBldmVudHNcbiAgICogIGFyZSByZXBsYWNlZCB3aXRoIHRoZSBuZXcgb25lcy5cbiAgICovXG4gIGluc3RhbGxFdmVudHMoZXZlbnRzLCBvdmVycmlkZSA9IGZhbHNlKSB7XG4gICAgaWYgKHRoaXMuaXNWaXNpYmxlKVxuICAgICAgdGhpcy5fdW5kZWxlZ2F0ZUV2ZW50cygpO1xuXG4gICAgdGhpcy5ldmVudHMgPSBvdmVycmlkZSA/IGV2ZW50cyA6IE9iamVjdC5hc3NpZ24odGhpcy5ldmVudHMsIGV2ZW50cyk7XG5cbiAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICB0aGlzLl9kZWxlZ2F0ZUV2ZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBldmVudCBsaXN0ZW5lcnMgb24gdGhlIHZpZXcuXG4gICAqIEB0b2RvIC0gcmVtb3ZlIGRlbGVnYXRpb24gP1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2RlbGVnYXRlRXZlbnRzKCkge1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmV2ZW50cykge1xuICAgICAgY29uc3QgW2V2ZW50LCBzZWxlY3Rvcl0gPSBrZXkuc3BsaXQoLyArLyk7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuZXZlbnRzW2tleV07XG5cbiAgICAgIHRoaXMuX2RlbGVnYXRlLm9uKGV2ZW50LCBzZWxlY3RvciB8fMKgbnVsbCwgY2FsbGJhY2spO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHZpZXcuXG4gICAqIEB0b2RvIC0gcmVtb3ZlIGRlbGVnYXRpb24gP1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3VuZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgdGhpcy5fZGVsZWdhdGUub2ZmKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVmlldztcbiJdfQ==