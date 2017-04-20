import client from '../core/client';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import SegmentedView from '../views/SegmentedView';

const SERVICE_ID = 'service:language';

const defaultViewTemplate = `
 <div class="section-top"></div>
 <div class="section-center">
   <% Object.keys(options).forEach(function(key,index) { %>
     <button class="btn" data-id="<%= key %>"><%= options[key] %></button>
   <% }); %>
 </div>
 <div class="section-bottom"></div>
`;

/**
 * Interface for the view of the `language` service.
 *
 * Allow to select the experience language at startup. Selected language tag will 
 * then be available in client.language.
 *
 * @memberof module:soundworks/client
 *
 * @example
 * // inside the experience constructor
 * this.language = this.require('language', {options: {en: 'English', fr:'Français'} })
 * console.log(client.language);
 */

class Language extends Service {
  constructor() {
    super(SERVICE_ID, false);

    const defaults = {
      // viewCtor: SegmentedView, // @fixme
      viewPriority: 9,
      options: {},
      contents: {},
    }

    this.configure(defaults);

    this._defaultViewTemplate = defaultViewTemplate;

    this._onClick = this._onClick.bind(this);
  }

  /** @private */
  init() {
    this.viewContent = { options: this.options.options };
    this.viewCtor = SegmentedView;
    this.viewTemplate = this._defaultViewTemplate;
    this.viewEvents = {
      'click .btn': this._onClick,
    }

    this.view = this.createView();
  }

  /** @private */
  start() {
    super.start();

    if (!this._hasStarted)
      this.init();


    this.show();
  }

  /** @private */
  stop() {
    super.stop();
    // this.removeListener('acknowledge', this._onAknowledgeResponse);

    this.hide();
  }

  _onClick(e) {
    const $btn = e.target;
    const id = $btn.getAttribute('data-id');
    const content = this.options[id];

    client.setViewContentDefinitions(content || {});
    client.language = id;
    this.ready();
  }
}

serviceManager.register(SERVICE_ID, Language);

export default Language;