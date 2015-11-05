'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var client = require('./client');
var ClientModule = require('./ClientModule');
// import client from './client.es6.js';
// import ClientModule from './ClientModule.es6.js';

/**
 * The {@link ClientLocator} module allows to indicate the approximate physical location of the client on a map via a dialog.
 */

var ClientLocator = (function (_ClientModule) {
  _inherits(ClientLocator, _ClientModule);

  // export default class ClientLocator extends ClientModule {
  /**
   * Creates an instance of the class. Always has a view.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='locator'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {ClientSpace} [options.space=null] Space in which to indicate the approximate location.
   * @param {Boolean} [options.showBackground=false] Indicates whether to show the space background image or not.
   */

  function ClientLocator() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientLocator);

    _get(Object.getPrototypeOf(ClientLocator.prototype), 'constructor', this).call(this, options.name || 'locator', true, options.color);

    /**
     * The space in which to indicate the approximate location.
     * @type {ClientSpace}
     */
    this.space = options.space || null;
    this.instructions = options.instructions || '<small>Indiquez votre position dans la salle</small>';

    this._showBackground = options.showBackground || false;

    this._touchStartHandler = this._touchStartHandler.bind(this);
    this._touchMoveHandler = this._touchMoveHandler.bind(this);
    this._touchEndHandler = this._touchEndHandler.bind(this);
    this._sendCoordinates = this._sendCoordinates.bind(this);
    this._surfaceHandler = this._surfaceHandler.bind(this);

    this._currentCoordinates = null;
    this._positionRadius = 20;

    // Explanatory text
    var textDiv = document.createElement('div');
    textDiv.classList.add('message');
    var text = document.createElement('p');
    text.innerHTML = this.instructions;
    this._textDiv = textDiv;
    this._text = text;

    // Button
    var button = document.createElement('div');
    button.classList.add('btn');
    button.classList.add('hidden');
    button.innerHTML = "Valider";
    this._button = button;

    // Position circle
    var positionDiv = document.createElement('div');
    positionDiv.setAttribute('id', 'position');
    positionDiv.classList.add('position');
    positionDiv.classList.add('hidden');
    positionDiv.style.width = this._positionRadius * 2 + "px";
    positionDiv.style.height = this._positionRadius * 2 + "px";
    this._positionDiv = positionDiv;

    // Surface div
    var surfaceDiv = document.createElement('div');
    surfaceDiv.setAttribute('id', 'surface');
    surfaceDiv.classList.add('surface');
    this._surfaceDiv = surfaceDiv;

    this._textDiv.appendChild(this._text);
    this._textDiv.appendChild(this._button);
    this._surfaceDiv.appendChild(this._positionDiv);

    this._resize = this._resize.bind(this);
  }

  /**
   * Starts the module.
   */

  _createClass(ClientLocator, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'start', this).call(this);

      client.send(this.name + ':request');
      client.receive(this.name + ':surface', this._surfaceHandler, false);

      window.addEventListener('resize', this._resize);
    }

    /**
     * Done method.
     * Removes the `'resize'` listener on the `window`.
     */
  }, {
    key: 'done',
    value: function done() {
      window.removeEventListener('resize', this._resize);
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'done', this).call(this);
    }

    /**
     * Resets the module to initial state.
     */
  }, {
    key: 'reset',
    value: function reset() {
      client.coordinates = null;

      this._positionDiv.classList.add('hidden');
      this._text.classList.remove('hidden');
      this._button.classList.add('hidden');

      this._button.removeEventListener('click', this._sendCoordinates, false);
      this._surfaceDiv.removeEventListener('touchstart', this._touchStartHandler, false);
      this._surfaceDiv.removeEventListener('touchmove', this._touchMoveHandler, false);
      this._surfaceDiv.removeEventListener('touchend', this._touchEndHandler, false);

      // TODO: clean surface properly
      if (this.space) this.space.reset();
    }

    /**
     * Restarts the module.
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'restart', this).call(this);
      client.send(this.name + ':restart', client.coordinates);
      this._button.removeEventListener('click', this._sendCoordinates, false);
      this.done();
    }
  }, {
    key: '_surfaceHandler',
    value: function _surfaceHandler(surface) {
      var heightWidthRatio = surface.height / surface.width;
      var screenHeight = window.innerHeight;
      var screenWidth = window.innerWidth;
      var screenRatio = screenHeight / screenWidth;
      var heightPx = undefined,
          widthPx = undefined;

      if (screenRatio > heightWidthRatio) {
        // TODO: refine sizes, with container, etc.
        heightPx = screenWidth * heightWidthRatio;
        widthPx = screenWidth;
      } else {
        heightPx = screenHeight;
        widthPx = screenHeight / heightWidthRatio;
      }

      this.space.display(this._surfaceDiv, {
        showBackground: this._showBackground
      });

      // Let the participant select his or her location
      this._surfaceDiv.addEventListener('touchstart', this._touchStartHandler, false);
      this._surfaceDiv.addEventListener('touchmove', this._touchMoveHandler, false);
      this._surfaceDiv.addEventListener('touchend', this._touchEndHandler, false);

      // Build text & button interface after receiving and displaying the surface
      this.view.appendChild(this._surfaceDiv);
      this.view.appendChild(this._textDiv);

      this._resize();
      // Send the coordinates of the selected location to server
      this._button.addEventListener('click', this._sendCoordinates, false);
    }
  }, {
    key: '_resize',
    value: function _resize() {
      var width = window.innerWidth;
      var height = window.innerHeight;

      var orientation = width > height ? 'landscape' : 'portrait';
      this.view.classList.remove('landscape', 'portrait');
      this.view.classList.add(orientation);

      var min = Math.min(width, height);

      this._surfaceDiv.style.width = min + 'px';
      this._surfaceDiv.style.height = min + 'px';

      switch (orientation) {
        case 'landscape':
          this._textDiv.style.height = height + 'px';
          this._textDiv.style.width = width - height + 'px';
          break;
        case 'portrait':
          this._textDiv.style.height = height - width + 'px';
          this._textDiv.style.width = width + 'px';
          break;
      }
    }
  }, {
    key: '_sendCoordinates',
    value: function _sendCoordinates() {
      if (this._currentCoordinates !== null) {
        this._button.classList.add('selected');
        client.coordinates = this._currentCoordinates;
        client.send(this.name + ':coordinates', client.coordinates);
        this.done();
      }
    }
  }, {
    key: '_touchStartHandler',
    value: function _touchStartHandler(e) {
      e.preventDefault();

      if (this._positionDiv.classList.contains('hidden')) {
        this._positionDiv.classList.remove('hidden');
        this._button.classList.remove('hidden');
        this._text.classList.add('hidden');
      }

      // TODO: handle mirror
      this._positionDiv.style.left = e.changedTouches[0].clientX - this._positionRadius + "px";
      this._positionDiv.style.top = e.changedTouches[0].clientY - this._positionRadius + "px";
    }
  }, {
    key: '_touchMoveHandler',
    value: function _touchMoveHandler(e) {
      e.preventDefault();

      // TODO: handle mirror
      this._positionDiv.style.left = e.changedTouches[0].clientX - this._positionRadius + "px";
      this._positionDiv.style.top = e.changedTouches[0].clientY - this._positionRadius + "px";

      // TODO: handle out-of-bounds
    }
  }, {
    key: '_touchEndHandler',
    value: function _touchEndHandler(e) {
      e.preventDefault();

      // TODO: handle mirror
      this._positionDiv.style.left = e.changedTouches[0].clientX - this._positionRadius + "px";
      this._positionDiv.style.top = e.changedTouches[0].clientY - this._positionRadius + "px";

      var x = (e.changedTouches[0].clientX - this._surfaceDiv.offsetLeft) / this._surfaceDiv.offsetWidth;
      var y = (e.changedTouches[0].clientY - this._surfaceDiv.offsetTop) / this._surfaceDiv.offsetHeight;

      this._currentCoordinates = [x, y];

      // TODO: handle out-of-bounds
    }
  }]);

  return ClientLocator;
})(ClientModule);

module.exports = ClientLocator;
//# sourceMappingURL=data:application/json;base64,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V0FBVyxDQUFDLFlBQVksQ0FBQzs7QUFFbkcsVUFBSSxDQUFDLG1CQUFtQixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7S0FHbkM7OztTQS9ORyxhQUFhO0dBQVMsWUFBWTs7QUFrT3hDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFBIiwiZmlsZSI6InNyYy9jbGllbnQvTG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNsaWVudCA9IHJlcXVpcmUoJy4vY2xpZW50Jyk7XG5jb25zdCBDbGllbnRNb2R1bGUgPSByZXF1aXJlKCcuL0NsaWVudE1vZHVsZScpO1xuLy8gaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudC5lczYuanMnO1xuLy8gaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZS5lczYuanMnO1xuXG4vKipcbiAqIFRoZSB7QGxpbmsgQ2xpZW50TG9jYXRvcn0gbW9kdWxlIGFsbG93cyB0byBpbmRpY2F0ZSB0aGUgYXBwcm94aW1hdGUgcGh5c2ljYWwgbG9jYXRpb24gb2YgdGhlIGNsaWVudCBvbiBhIG1hcCB2aWEgYSBkaWFsb2cuXG4gKi9cbmNsYXNzIENsaWVudExvY2F0b3IgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuLy8gZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50TG9jYXRvciBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy4gQWx3YXlzIGhhcyBhIHZpZXcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J2xvY2F0b3InXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7Q2xpZW50U3BhY2V9IFtvcHRpb25zLnNwYWNlPW51bGxdIFNwYWNlIGluIHdoaWNoIHRvIGluZGljYXRlIHRoZSBhcHByb3hpbWF0ZSBsb2NhdGlvbi5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93QmFja2dyb3VuZD1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdG8gc2hvdyB0aGUgc3BhY2UgYmFja2dyb3VuZCBpbWFnZSBvciBub3QuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2xvY2F0b3InLCB0cnVlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBzcGFjZSBpbiB3aGljaCB0byBpbmRpY2F0ZSB0aGUgYXBwcm94aW1hdGUgbG9jYXRpb24uXG4gICAgICogQHR5cGUge0NsaWVudFNwYWNlfVxuICAgICAqL1xuICAgIHRoaXMuc3BhY2UgPSBvcHRpb25zLnNwYWNlIHx8IG51bGw7XG4gICAgdGhpcy5pbnN0cnVjdGlvbnMgPSBvcHRpb25zLmluc3RydWN0aW9ucyB8fCAnPHNtYWxsPkluZGlxdWV6IHZvdHJlIHBvc2l0aW9uIGRhbnMgbGEgc2FsbGU8L3NtYWxsPic7XG5cbiAgICB0aGlzLl9zaG93QmFja2dyb3VuZCA9IG9wdGlvbnMuc2hvd0JhY2tncm91bmQgfHwgZmFsc2U7XG5cbiAgICB0aGlzLl90b3VjaFN0YXJ0SGFuZGxlciA9IHRoaXMuX3RvdWNoU3RhcnRIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fdG91Y2hNb3ZlSGFuZGxlciA9IHRoaXMuX3RvdWNoTW92ZUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl90b3VjaEVuZEhhbmRsZXIgPSB0aGlzLl90b3VjaEVuZEhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMgPSB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9zdXJmYWNlSGFuZGxlciA9IHRoaXMuX3N1cmZhY2VIYW5kbGVyLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9jdXJyZW50Q29vcmRpbmF0ZXMgPSBudWxsO1xuICAgIHRoaXMuX3Bvc2l0aW9uUmFkaXVzID0gMjA7XG5cbiAgICAvLyBFeHBsYW5hdG9yeSB0ZXh0XG4gICAgbGV0IHRleHREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0ZXh0RGl2LmNsYXNzTGlzdC5hZGQoJ21lc3NhZ2UnKTtcbiAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICB0ZXh0LmlubmVySFRNTCA9IHRoaXMuaW5zdHJ1Y3Rpb25zO1xuICAgIHRoaXMuX3RleHREaXYgPSB0ZXh0RGl2O1xuICAgIHRoaXMuX3RleHQgPSB0ZXh0O1xuXG4gICAgLy8gQnV0dG9uXG4gICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKTtcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgYnV0dG9uLmlubmVySFRNTCA9IFwiVmFsaWRlclwiO1xuICAgIHRoaXMuX2J1dHRvbiA9IGJ1dHRvbjtcblxuICAgIC8vIFBvc2l0aW9uIGNpcmNsZVxuICAgIGxldCBwb3NpdGlvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBvc2l0aW9uRGl2LnNldEF0dHJpYnV0ZSgnaWQnLCAncG9zaXRpb24nKTtcbiAgICBwb3NpdGlvbkRpdi5jbGFzc0xpc3QuYWRkKCdwb3NpdGlvbicpO1xuICAgIHBvc2l0aW9uRGl2LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIHBvc2l0aW9uRGl2LnN0eWxlLndpZHRoID0gdGhpcy5fcG9zaXRpb25SYWRpdXMgKiAyICsgXCJweFwiO1xuICAgIHBvc2l0aW9uRGl2LnN0eWxlLmhlaWdodCA9IHRoaXMuX3Bvc2l0aW9uUmFkaXVzICogMiArIFwicHhcIjtcbiAgICB0aGlzLl9wb3NpdGlvbkRpdiA9IHBvc2l0aW9uRGl2O1xuXG4gICAgLy8gU3VyZmFjZSBkaXZcbiAgICBsZXQgc3VyZmFjZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHN1cmZhY2VEaXYuc2V0QXR0cmlidXRlKCdpZCcsICdzdXJmYWNlJyk7XG4gICAgc3VyZmFjZURpdi5jbGFzc0xpc3QuYWRkKCdzdXJmYWNlJyk7XG4gICAgdGhpcy5fc3VyZmFjZURpdiA9IHN1cmZhY2VEaXY7XG5cbiAgICB0aGlzLl90ZXh0RGl2LmFwcGVuZENoaWxkKHRoaXMuX3RleHQpO1xuICAgIHRoaXMuX3RleHREaXYuYXBwZW5kQ2hpbGQodGhpcy5fYnV0dG9uKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2LmFwcGVuZENoaWxkKHRoaXMuX3Bvc2l0aW9uRGl2KTtcblxuICAgIHRoaXMuX3Jlc2l6ZSA9IHRoaXMuX3Jlc2l6ZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGNsaWVudC5zZW5kKHRoaXMubmFtZSArICc6cmVxdWVzdCcpO1xuICAgIGNsaWVudC5yZWNlaXZlKHRoaXMubmFtZSArICc6c3VyZmFjZScsIHRoaXMuX3N1cmZhY2VIYW5kbGVyLCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb25lIG1ldGhvZC5cbiAgICogUmVtb3ZlcyB0aGUgYCdyZXNpemUnYCBsaXN0ZW5lciBvbiB0aGUgYHdpbmRvd2AuXG4gICAqL1xuICBkb25lKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemUpO1xuICAgIHN1cGVyLmRvbmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIG1vZHVsZSB0byBpbml0aWFsIHN0YXRlLlxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gbnVsbDtcblxuICAgIHRoaXMuX3Bvc2l0aW9uRGl2LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIHRoaXMuX3RleHQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgdGhpcy5fYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXG4gICAgdGhpcy5fYnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fc2VuZENvb3JkaW5hdGVzLCBmYWxzZSk7XG4gICAgdGhpcy5fc3VyZmFjZURpdi5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fdG91Y2hTdGFydEhhbmRsZXIsIGZhbHNlKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX3RvdWNoTW92ZUhhbmRsZXIsIGZhbHNlKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5fdG91Y2hFbmRIYW5kbGVyLCBmYWxzZSk7XG5cbiAgICAvLyBUT0RPOiBjbGVhbiBzdXJmYWNlIHByb3Blcmx5XG4gICAgaWYgKHRoaXMuc3BhY2UpXG4gICAgICB0aGlzLnNwYWNlLnJlc2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZS5cbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIGNsaWVudC5zZW5kKHRoaXMubmFtZSArICc6cmVzdGFydCcsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5fYnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fc2VuZENvb3JkaW5hdGVzLCBmYWxzZSk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICBfc3VyZmFjZUhhbmRsZXIoc3VyZmFjZSkge1xuICAgIGxldCBoZWlnaHRXaWR0aFJhdGlvID0gc3VyZmFjZS5oZWlnaHQgLyBzdXJmYWNlLndpZHRoO1xuICAgIGxldCBzY3JlZW5IZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgbGV0IHNjcmVlbldpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgbGV0IHNjcmVlblJhdGlvID0gc2NyZWVuSGVpZ2h0IC8gc2NyZWVuV2lkdGg7XG4gICAgbGV0IGhlaWdodFB4LCB3aWR0aFB4O1xuXG4gICAgaWYgKHNjcmVlblJhdGlvID4gaGVpZ2h0V2lkdGhSYXRpbykgeyAvLyBUT0RPOiByZWZpbmUgc2l6ZXMsIHdpdGggY29udGFpbmVyLCBldGMuXG4gICAgICBoZWlnaHRQeCA9IHNjcmVlbldpZHRoICogaGVpZ2h0V2lkdGhSYXRpbztcbiAgICAgIHdpZHRoUHggPSBzY3JlZW5XaWR0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVpZ2h0UHggPSBzY3JlZW5IZWlnaHQ7XG4gICAgICB3aWR0aFB4ID0gc2NyZWVuSGVpZ2h0IC8gaGVpZ2h0V2lkdGhSYXRpbztcbiAgICB9XG5cbiAgICB0aGlzLnNwYWNlLmRpc3BsYXkodGhpcy5fc3VyZmFjZURpdiwge1xuICAgICAgc2hvd0JhY2tncm91bmQ6IHRoaXMuX3Nob3dCYWNrZ3JvdW5kXG4gICAgfSk7XG5cbiAgICAvLyBMZXQgdGhlIHBhcnRpY2lwYW50IHNlbGVjdCBoaXMgb3IgaGVyIGxvY2F0aW9uXG4gICAgdGhpcy5fc3VyZmFjZURpdi5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fdG91Y2hTdGFydEhhbmRsZXIsIGZhbHNlKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX3RvdWNoTW92ZUhhbmRsZXIsIGZhbHNlKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5fdG91Y2hFbmRIYW5kbGVyLCBmYWxzZSk7XG5cbiAgICAvLyBCdWlsZCB0ZXh0ICYgYnV0dG9uIGludGVyZmFjZSBhZnRlciByZWNlaXZpbmcgYW5kIGRpc3BsYXlpbmcgdGhlIHN1cmZhY2VcbiAgICB0aGlzLnZpZXcuYXBwZW5kQ2hpbGQodGhpcy5fc3VyZmFjZURpdik7XG4gICAgdGhpcy52aWV3LmFwcGVuZENoaWxkKHRoaXMuX3RleHREaXYpO1xuXG4gICAgdGhpcy5fcmVzaXplKCk7XG4gICAgLy8gU2VuZCB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHNlbGVjdGVkIGxvY2F0aW9uIHRvIHNlcnZlclxuICAgIHRoaXMuX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX3NlbmRDb29yZGluYXRlcywgZmFsc2UpO1xuICB9XG5cbiAgX3Jlc2l6ZSgpIHtcbiAgICBjb25zdCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gd2lkdGggPiBoZWlnaHQgPyAnbGFuZHNjYXBlJyA6ICdwb3J0cmFpdCc7XG4gICAgdGhpcy52aWV3LmNsYXNzTGlzdC5yZW1vdmUoJ2xhbmRzY2FwZScsICdwb3J0cmFpdCcpO1xuICAgIHRoaXMudmlldy5jbGFzc0xpc3QuYWRkKG9yaWVudGF0aW9uKTtcblxuICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgdGhpcy5fc3VyZmFjZURpdi5zdHlsZS53aWR0aCA9IGAke21pbn1weGA7XG4gICAgdGhpcy5fc3VyZmFjZURpdi5zdHlsZS5oZWlnaHQgPSBgJHttaW59cHhgO1xuXG4gICAgc3dpdGNoIChvcmllbnRhdGlvbikge1xuICAgICAgY2FzZSAnbGFuZHNjYXBlJyA6XG4gICAgICAgIHRoaXMuX3RleHREaXYuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcbiAgICAgICAgdGhpcy5fdGV4dERpdi5zdHlsZS53aWR0aCA9IGAke3dpZHRoIC0gaGVpZ2h0fXB4YDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdwb3J0cmFpdCc6XG4gICAgICAgIHRoaXMuX3RleHREaXYuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0IC0gd2lkdGh9cHhgO1xuICAgICAgICB0aGlzLl90ZXh0RGl2LnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBfc2VuZENvb3JkaW5hdGVzKCkge1xuICAgIGlmICh0aGlzLl9jdXJyZW50Q29vcmRpbmF0ZXMgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX2J1dHRvbi5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gdGhpcy5fY3VycmVudENvb3JkaW5hdGVzO1xuICAgICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpjb29yZGluYXRlcycsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9XG4gIH1cblxuICBfdG91Y2hTdGFydEhhbmRsZXIoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmICh0aGlzLl9wb3NpdGlvbkRpdi5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGRlbicpKSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbkRpdi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgIHRoaXMuX2J1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgIHRoaXMuX3RleHQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogaGFuZGxlIG1pcnJvclxuICAgIHRoaXMuX3Bvc2l0aW9uRGl2LnN0eWxlLmxlZnQgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLl9wb3NpdGlvblJhZGl1cyArIFwicHhcIjtcbiAgICB0aGlzLl9wb3NpdGlvbkRpdi5zdHlsZS50b3AgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLl9wb3NpdGlvblJhZGl1cyArIFwicHhcIjtcbiAgfVxuXG4gIF90b3VjaE1vdmVIYW5kbGVyKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBUT0RPOiBoYW5kbGUgbWlycm9yXG4gICAgdGhpcy5fcG9zaXRpb25EaXYuc3R5bGUubGVmdCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMuX3Bvc2l0aW9uUmFkaXVzICsgXCJweFwiO1xuICAgIHRoaXMuX3Bvc2l0aW9uRGl2LnN0eWxlLnRvcCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMuX3Bvc2l0aW9uUmFkaXVzICsgXCJweFwiO1xuXG4gICAgLy8gVE9ETzogaGFuZGxlIG91dC1vZi1ib3VuZHNcbiAgfVxuXG4gIF90b3VjaEVuZEhhbmRsZXIoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIC8vIFRPRE86IGhhbmRsZSBtaXJyb3JcbiAgICB0aGlzLl9wb3NpdGlvbkRpdi5zdHlsZS5sZWZ0ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy5fcG9zaXRpb25SYWRpdXMgKyBcInB4XCI7XG4gICAgdGhpcy5fcG9zaXRpb25EaXYuc3R5bGUudG9wID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gdGhpcy5fcG9zaXRpb25SYWRpdXMgKyBcInB4XCI7XG5cbiAgICBsZXQgeCA9IChlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLl9zdXJmYWNlRGl2Lm9mZnNldExlZnQpIC8gdGhpcy5fc3VyZmFjZURpdi5vZmZzZXRXaWR0aDtcbiAgICBsZXQgeSA9IChlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLl9zdXJmYWNlRGl2Lm9mZnNldFRvcCkgLyB0aGlzLl9zdXJmYWNlRGl2Lm9mZnNldEhlaWdodDtcblxuICAgIHRoaXMuX2N1cnJlbnRDb29yZGluYXRlcyA9IFt4LCB5XTtcblxuICAgIC8vIFRPRE86IGhhbmRsZSBvdXQtb2YtYm91bmRzXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDbGllbnRMb2NhdG9yXG4iXX0=