import {
  SegmentedView,
  // SelectView,
  // SpaceView,
  // SquaredView,
  // TouchSurface,
} from 'soundworks/client';

// --------------------------- example
/**
 * Interface for the view of the `audio-buffer-manager` service.
 *
 * @interface AbstractAudioBufferManagerView
 * @extends module:soundworks/client.View
 */
/**
 * Method called when a new information about the currently loaded assets
 * is received.
 *
 * @function
 * @name AbstractAudioBufferManagerView.onProgress
 * @param {Number} percent - The purcentage of loaded assets.
 */
// ------------------------------------

const noop = () => {};

const serviceViews = {
  // ------------------------------------------------
  // AudioBufferManager
  // ------------------------------------------------
  'service:audio-buffer-manager': class AudioBufferManagerView extends SegmentedView {
    constructor(...args) {
      super();

      this.template = `
        <div class="section-top flex-middle">
          <p><%= msg[status] %></p>
        </div>
        <div class="section-center flex-center">
          <% if (showProgress) { %>
          <div class="progress-wrap">
            <div class="progress-bar"></div>
          </div>
          <% } %>
        </div>
        <div class="section-bottom"></div>
      `;

      this.model = {
        status: 'loading',
        showProgress: true,
        msg: {
          loading: 'Loading sounds...',
          decoding: 'Decoding sounds...',
        }
      };
    }

    onRender() {
      super.onRender();
      this.$progressBar = this.$el.querySelector('.progress-bar');
    }

    onProgress(ratio) {
      const percent = Math.round(ratio * 100);

      if (percent === 100) {
        this.model.status = 'decoding';
        this.render('.section-top');
      }

      if (this.model.showProgress)
        this.$progressBar.style.width = `${percent}%`;
    }
  },

  // ------------------------------------------------
  // Auth
  // ------------------------------------------------
  'service:auth': class AuthView extends SegmentedView {
    constructor() {
      super();

      this.template = `
        <% if (!rejected) { %>
          <div class="section-top flex-middle">
            <p><%= instructions %></p>
          </div>
          <div class="section-center flex-center">
            <div>
              <input type="password" id="password" />
              <button class="btn" id="send"><%= send %></button>
            </div>
          </div>
          <div class="section-bottom flex-middle">
            <button id="reset" class="btn"><%= reset %></button>
          </div>
        <% } else { %>
          <div class="section-top"></div>
          <div class="section-center flex-center">
            <p><%= rejectMessage %></p>
          </div>
          <div class="section-bottom flex-middle">
            <button id="reset" class="btn"><%= reset %></button>
          </div>
        <% } %>
      `;

      this.model = {
        instructions: 'Login',
        send: 'Send',
        reset: 'Reset',
        rejectMessage: `Sorry, you don't have access to this client`,
        rejected: false,
      };

      this._sendPasswordCallback = noop;
      this._resetCallback = noop;
    }

    onRender() {
      super.onRender();

      this.installEvents({
        'click #send': () => {
          const password = this.$el.querySelector('#password').value;

          if (password !== '')
            this._sendPasswordCallback(password);
        },
        'click #reset': () => this._resetCallback(),
      });
    }

    setSendPasswordCallback(callback) {
      this._sendPasswordCallback = callback;
    }

    setResetCallback(callback) {
      this._resetCallback = callback;
    }

    updateRejectedStatus(value) {
      this.model.rejected = value;
      this.render();
    }
  },

  // ------------------------------------------------
  // Checkin
  // ------------------------------------------------
  'service:checkin': class CheckinView extends SegmentedView {
    constructor() {
      super();

      this.template = `
        <% if (label) { %>
          <div class="section-top flex-middle">
            <p class="big"><%= labelPrefix %></p>
          </div>
          <div class="section-center flex-center">
            <div class="checkin-label">
              <p class="huge bold"><%= label %></p>
            </div>
          </div>
          <div class="section-bottom flex-middle">
            <p class="small"><%= labelPostfix %></p>
          </div>
        <% } else { %>
          <div class="section-top"></div>
          <div class="section-center flex-center">
            <p><%= error ? errorMessage : wait %></p>
          </div>
          <div class="section-bottom"></div>
        <% } %>
      `;

      this.model = {
        labelPrefix: 'Go to',
        labelPostfix: 'Touch the screen<br class="portrait-only" />when you are ready.',
        error: false,
        errorMessage: 'Sorry,<br/>no place available',
        wait: 'Please wait...',
        label: '',
      };

      this._readyCallback = null;
    }

    onRender() {
      super.onRender();

      const eventName = this.options.interaction === 'mouse' ? 'click' : 'touchstart';

      this.installEvents({
        [eventName]: () => this._readyCallback(),
      });
    }

    setReadyCallback(callback) {
      this._readyCallback = callback;
    }

    updateLabel(value) {
      this.model.label = value;
      this.render();
    }

    updateErrorStatus(value) {
      this.model.error = value;
      this.render();
    }
  },

  'service:language': class LanguageView extends SegmentedView {
    constructor() {
      super();

      this.template = `
        <div class="section-top"></div>
        <div class="section-center">
          <% for (let key in options) { %>
            <button class="btn" data-id="<%= key %>"><%= options[key] %></button>
          <% } %>
        </div>
        <div class="section-bottom"></div>
      `;

      this.model = {};

      this._selectionCallback = noop;
    }

    onRender() {
      super.onRender();

      const eventName = this.options.interaction === 'mouse' ? 'click' : 'touchstart';
      this.installEvents({
        [`${eventName} .btn`]: (e) => {
          const target = e.target;
          const id = target.getAttribute('data-id');
          this._selectionCallback(id);
        },
      })
    }

    setSelectionCallback(callback) {
      this._selectionCallback = callback;
    }
  },

  // ------------------------------------------------
  // Locator
  // ------------------------------------------------
  'service:locator': class LocatorView extends SquaredView {
    constructor() {
      super();

      this.template = `
        <div class="section-square"></div>
        <div class="section-float flex-middle">
          <% if (!showBtn) { %>
            <p class="small"><%= instructions %></p>
          <% } else { %>
            <button class="btn"><%= send %></button>
          <% } %>
        </div>
      `;

      this.model = {
        instructions: 'Define your position in the area',
        send: 'Send',
        showBtn: false,
      };

      this.area = null;
      this._selectCallback = noop;

      this._onAreaTouchStart = this._onAreaTouchStart.bind(this);
      this._onAreaTouchMove = this._onAreaTouchMove.bind(this);
    }

    show() {
      super.show();
      this.selector.show();
    }

    onRender() {
      super.onRender();
      this.$areaContainer = this.$el.querySelector('.section-square');
    }

    setArea(area) {
      this._area = area;
      this._renderArea();
    }

    setSelectCallback(callback) {
      this._selectCallback = callback;
    }

    remove() {
      super.remove();

      this.surface.removeListener('touchstart', this._onAreaTouchStart);
      this.surface.removeListener('touchmove', this._onAreaTouchMove);
    }

    onResize(viewportWidth, viewportHeight, orientation) {
      super.onResize(viewportWidth, viewportHeight, orientation);

      if (this.selector)
        this.selector.onResize(viewportWidth, viewportHeight, orientation);
    }

    _renderArea() {
      this.selector = new SpaceView();
      this.selector.setArea(this._area);

      this.selector.render();
      this.selector.appendTo(this.$areaContainer);
      this.selector.onRender();

      this.surface = new TouchSurface(this.selector.$svgContainer);
      this.surface.addListener('touchstart', this._onAreaTouchStart);
      this.surface.addListener('touchmove', this._onAreaTouchMove);
    }

    _onAreaTouchStart(id, normX, normY) {
      if (!this.position) {
        this._createPosition(normX, normY);

        this.model.showBtn = true;
        this.render('.section-float');
        this.installEvents({
          'click .btn': (e) => this._selectCallback(this.position.x, this.position.y),
        });
      } else {
        this._updatePosition(normX, normY);
      }
    }

    _onAreaTouchMove(id, normX, normY) {
      this._updatePosition(normX, normY);
    }

    _createPosition(normX, normY) {
      this.position = {
        id: 'locator',
        x: normX * this._area.width,
        y: normY * this._area.height,
      };

      this.selector.addPoint(this.position);
    }

    _updatePosition(normX, normY) {
      this.position.x = normX * this._area.width;
      this.position.y = normY * this._area.height;

      this.selector.updatePoint(this.position);
    }
  },

  // ------------------------------------------------
  // Placer
  // ------------------------------------------------
  'service:placer': class PlacerViewList extends SquaredView {
    constructor() {
      super();

      this.template = `
        <div class="section-square flex-middle">
          <% if (rejected) { %>
          <div class="fit-container flex-middle">
            <p><%= reject %></p>
          </div>
          <% } %>
        </div>
        <div class="section-float flex-middle">
          <% if (!rejected) { %>
            <% if (showBtn) { %>
              <button class="btn"><%= send %></button>
            <% } %>
          <% } %>
        </div>
      `;

      this.model = {
        instructions: 'Select your position',
        send: 'Send',
        reject: 'Sorry, no place is available',
        showBtn: false,
        rejected: false,
      };

      this._onSelectionChange = this._onSelectionChange.bind(this);
    }

    show() {
      super.show();
      this.selector.show();
    }

    _onSelectionChange(e) {
      this.model.showBtn = true;
      this.render('.section-float');

      this.installEvents({
        'click .btn': (e) => {
          const position = this.selector.value;

          if (position)
            this._onSelect(position.index, position.label, position.coordinates);
        }
      });
    }

    setArea(area) { /* no need for area */ }

    onRender() {
      super.onRender();
      this.$selectorContainer = this.$el.querySelector('.section-square');
    }

    onResize(viewportWidth, viewportHeight, orientation) {
      super.onResize(viewportWidth, viewportHeight, orientation);

      if (this.selector)
        this.selector.onResize(viewportWidth, viewportHeight, orientation);
    }

    displayPositions(capacity, labels = null, coordinates = null, maxClientsPerPosition = 1) {
      this.positions = [];
      this.numberPositions = capacity / maxClientsPerPosition;

      for (let index = 0; index < this.numberPositions; index++) {
        const label = labels !== null ? labels[index] : (index + 1).toString();
        const position = { index: index, label: label };

        if (coordinates)
          position.coordinates = coordinates[index];

        this.positions.push(position);
      }

      this.selector = new SelectView({
        instructions: this.model.instructions,
        entries: this.positions,
      });

      this.selector.render();
      this.selector.appendTo(this.$selectorContainer);
      this.selector.onRender();

      this.selector.installEvents({
        'change': this._onSelectionChange,
      });
    }

    updateDisabledPositions(indexes) {
      for (let index = 0; index < this.numberPositions; index++) {
        if (indexes.indexOf(index) === -1)
          this.selector.enableIndex(index);
        else
          this.selector.disableIndex(index);
      }
    }

    setSelectCallack(callback) {
      this._onSelect = callback;
    }

    reject(disabledPositions) {
      this.model.rejected = true;
      this.render();
    }
  },

  // graphic placer flavor for predetermined coordinates
  // 'service:placer': class PlacerViewGraphic extends SquaredView {
  //   constructor() {
  //     super();

  //     this.template = `
  //       <div class="section-square flex-middle">
  //         <% if (rejected) { %>
  //         <div class="fit-container flex-middle">
  //           <p><%= reject %></p>
  //         </div>
  //         <% } %>
  //       </div>
  //       <div class="section-float flex-middle">
  //         <% if (!rejected) { %>
  //           <% if (showBtn) { %>
  //             <button class="btn"><%= send %></button>
  //           <% } %>
  //         <% } %>
  //       </div>
  //     `;

  //     this.model = {
  //       instructions: 'Select your position',
  //       send: 'Send',
  //       reject: 'Sorry, no place is available',
  //       showBtn: false,
  //       rejected: false,
  //     };

  //     this._area = null;
  //     this._disabledPositions = [];
  //     this._onSelectionChange = this._onSelectionChange.bind(this);
  //   }

  //   show() {
  //     super.show();
  //     this.selector.show();
  //   }

  //   onRender() {
  //     super.onRender();
  //     this.$selectorContainer = this.$el.querySelector('.section-square');
  //   }

  //   onResize(viewportWidth, viewportHeight, orientation) {
  //     super.onResize(viewportWidth, viewportHeight, orientation);

  //     if (this.selector)
  //       this.selector.onResize(viewportWidth, viewportHeight, orientation);
  //   }

  //   _onSelectionChange(e) {
  //     const position = this.selector.shapePointMap.get(e.target);
  //     const disabledIndex = this._disabledPositions.indexOf(position.index);

  //     if (disabledIndex === -1)
  //       this._onSelect(position.id, position.label, [position.x, position.y]);
  //   }

  //   setArea(area) {
  //     this._area = area;
  //   }

  //   displayPositions(capacity, labels = null, coordinates = null, maxClientsPerPosition = 1) {
  //     this.numberPositions = capacity / maxClientsPerPosition;
  //     this.positions = [];

  //     for (let i = 0; i < this.numberPositions; i++) {
  //       const label = labels !== null ? labels[i] : (i + 1).toString();
  //       const position = { id: i, label: label };
  //       const coords = coordinates[i];
  //       position.x = coords[0];
  //       position.y = coords[1];

  //       this.positions.push(position);
  //     }

  //     this.selector = new SpaceView();
  //     this.selector.setArea(this._area);
  //     this.selector.render();
  //     this.selector.appendTo(this.$selectorContainer);
  //     this.selector.onRender();
  //     this.selector.setPoints(this.positions);

  //     this.selector.installEvents({
  //       'click .point': this._onSelectionChange
  //     });
  //   }

  //   updateDisabledPositions(indexes) {
  //     this._disabledPositions = indexes;

  //     for (let index = 0; index < this.numberPositions; index++) {
  //       const position = this.positions[index];
  //       const isDisabled = indexes.indexOf(index) !== -1;
  //       position.selected = isDisabled ? true : false;
  //       this.selector.updatePoint(position);
  //     }
  //   }

  //   setSelectCallack(callback) {
  //     this._onSelect = callback;
  //   }

  //   reject(disabledPositions) {
  //     this.model.rejected = true;
  //     this.render();
  //   }
  // },

  // ------------------------------------------------
  // Platform
  // ------------------------------------------------
  'service:platform': class PlatformView extends SegmentedView {
    constructor() {
      super();

      this.template = `
        <% if (isCompatible === false) { %>
          <div class="section-top"></div>
          <div class="section-center flex-center">
            <p><%= errorCompatibleMessage %></p>
          </div>
          <div class="section-bottom"></div>
        <% } else if (hasAuthorizations === false) { %>
          <div class="section-top"></div>
          <div class="section-center flex-center">
            <p><%= errorHooksMessage %></p>
          </div>
          <div class="section-bottom"></div>
        <% } else { %>
          <div class="section-top flex-middle"></div>
          <div class="section-center flex-center">
              <p class="big">
                <b><%= globals.appName %></b>
              </p>
          </div>
          <div class="section-bottom flex-middle">
            <% if (checking === true) { %>
            <p class="small soft-blink"><%= checkingMessage %></p>
            <% } else if (hasAuthorizations === true) { %>
            <p class="small soft-blink"><%= instructions %></p>
            <% } %>
          </div>
        <% } %>
      `;

      this.model = {
        isCompatible: null,
        hasAuthorizations: null,
        checking: false,
        instructions: 'Touch the screen to join!',
        checkingMessage: 'Please wait while checking compatiblity',
        errorCompatibleMessage: 'Sorry,<br />Your device is not compatible with the application.',
        errorHooksMessage: `Sorry,<br />The application didn't obtain the necessary authorizations.`,
      };

      this._touchstartCallback = noop;
      this._mousedownCallback = noop;
    }

    onRender() {
      super.onRender();

      if (this.isCompatible) {
        this.installEvents({
          'mousedown': (e) => this._mousedownCallback(e),
          'touchstart': (e) => this._touchstartCallback(e),
        });
      }
    }

    setTouchStartCallback(callback) {
      this._touchstartCallback = callback;
    }

    setMouseDownCallback(callback) {
      this._mousedownCallback = callback;
    }

    updateCheckingStatus(value) {
      this.model.checking = value;
      this.render();
    }

    updateIsCompatibleStatus(value) {
      this.model.isCompatible = value;
      this.render();
    }

    updateHasAuthorizationsStatus(value) {
      this.model.hasAuthorizations = value;
      this.render();
    }
  },

  // ------------------------------------------------
  // Raw-Socket
  // ------------------------------------------------
  'service:raw-socket': class RawSocketView extends SegmentedView {
    constructor() {
      super();

      this.template = `
        <div class="section-top"></div>
        <div class="section-center flex-center">
          <p class="soft-blink"><%= wait %></p>
        </div>
        <div class="section-bottom"></div>
      `;

      this.model = {
        wait: `Opening socket,<br />stand by&hellip;`,
      };
    }
  },

  // ------------------------------------------------
  // Sync
  // ------------------------------------------------
  'service:sync': class RawSocketView extends SegmentedView {
    constructor() {
      super();

      this.template = `
        <div class="section-top"></div>
        <div class="section-center flex-center">
          <p class="soft-blink"><%= wait %></p>
        </div>
        <div class="section-bottom"></div>
      `;

      this.model = {
        wait: `Clock syncing,<br />stand by&hellip;`,
      };
    }
  },


  // public API
  has(id) {
    return !!this[id];
  },

  get(id, config) {
    const ctor = this[id];
    const view = new ctor();
    // additionnal configuration
    view.model.globals = Object.assign({}, config);
    view.options.id = id.replace(/\:/g, '-');

    return view;
  },
};

export default serviceViews;
