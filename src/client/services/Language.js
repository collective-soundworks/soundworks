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
 * API of a compliant view for the `language` service.
 *
 * @memberof module:soundworks/client
 * @interface AbstractLanguageView
 * @extends module:soundworks/client.AbstractView
 * @abstract
 */
/**
 * Register the function that should be executed when the password is submitted
 * by the user.
 *
 * @name setSelectionCallback
 * @memberof module:soundworks/client.AbstractLanguageView
 * @function
 * @abstract
 * @instance
 *
 * @param {selectionCallback} callback - Callback to execute when the user
 *  choose its language
 */

/**
 * Callback to execute when the user choose its language.
 *
 * @callback
 * @name selectionCallback
 * @memberof module:soundworks/client.AbstractLanguageView
 *
 * @param {String} id - id of the language.
 */


/**
 * Interface for the client `language` service.
 *
 * This service present a view that allows to define a langage for the client.
 * Using this service implies that the application should handle itself this
 * information in the views of the the services as well as in the experience.
 *
 * @memberof module:soundworks/client
 * @example
 * this.language = this.require('language', { options: { en: 'English', fr:'Français' }});
 */
class Language extends Service {
  constructor() {
    super(SERVICE_ID, false);

    const defaults = {
      viewPriority: 9,
      options: {},
    }

    this.configure(defaults);

    this._onSelection = this._onSelection.bind(this);
  }

  /** @private */
  start() {
    super.start();

    this.view.model.options = this.options.options;
    this.view.setSelectionCallback(this._onSelection);

    this.show();
  }

  /** @private */
  stop() {
    super.stop();
    this.hide();
  }

  _onSelection(id) {
    client.language = id;
    this.ready();
  }
}

serviceManager.register(SERVICE_ID, Language);

export default Language;
