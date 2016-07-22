import client from '../core/client';
import Service from '../core/Service';
import SegmentedView from '../views/SegmentedView';
import serviceManager from '../core/serviceManager';


const SERVICE_ID = 'service:auth';

/**
 * Interface for the view of the `auth` service.
 *
 * @interface AbstractAuthView
 * @extends module:soundworks/client.View
 */
/**
 * Set the callback that should be executed when the send action is executed
 * on the view.
 *
 * @function
 * @name AbstractAuthView.onSend
 * @param {Function} callback - The callback given by the `auth` service.
 */
class AuthView extends SegmentedView {
  onSend(callback) {
    this.installEvents({
      'click #send': () => {
        const password = this.$el.querySelector('#password').value;

        if (password !== '')
          callback(password);
      }
    });
  }
}

const defaultViewTemplate = `
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
  <div class="section-bottom"></div>
<% } else { %>
  <div class="section-top"></div>
  <div class="section-center flex-center">
    <p><%= rejectMessage %></p>
  </div>
  <div class="section-bottom"></div>
<% } %>`;

const defaultViewContent = {
  instructions: 'Login',
  send: 'Send',
  rejectMessage: `Sorry, you don't have access to this client`,
  rejected: false,
};

/**
 * Interface for the client `auth` service.
 *
 * This service allows to lock the application to specific users by adding a
 * simple logging page to the client.
 *
 * <span class="warning">__WARNING__</span>: This service shouldn't be considered
 * secure from a production prespective.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Auth}*__
 *
 * @memberof module:soundworks/client
 * @example
 * this.auth = this.require('auth');
 */
class Auth extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor(options) {
    super(SERVICE_ID, true);

    const defaults = {
      viewPriority: 100,
      viewCtor: AuthView,
    };

    this.configure(defaults);

    this._defaultViewTemplate = defaultViewTemplate;
    this._defaultViewContent = defaultViewContent;

    this._onAccesGrantedResponse = this._onAccesGrantedResponse.bind(this);
    this._onAccesRefusedResponse = this._onAccesRefusedResponse.bind(this);
    this._sendPassword = this._sendPassword.bind(this);
  }

  /** @private */
  init() {
    this._password = null;

    this.viewCtor = this.options.viewCtor;
    this.view = this.createView();
    this.view.onSend(this._sendPassword);
  }

  /** @private */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.receive('granted', this._onAccesGrantedResponse);
    this.receive('refused', this._onAccesRefusedResponse);

    const storedPassword = localStorage.getItem('soundworks:service:auth');

    if (storedPassword !== null) {
      this._sendPassword(storedPassword);
    } else {
      this.show();
    }
  }

  /** @private */
  stop() {
    super.stop();

    this.removeListener('granted', this._onAccesGrantedResponse);
    this.removeListener('refused', this._onAccesRefusedResponse);

    this.hide();
  }

  /** @private */
  _sendPassword(password) {
    this._password = password;
    this.send('password', password);
  }

  /** @private */
  _onAccesGrantedResponse() {
    localStorage.setItem('soundworks:service:auth', this._password);
    this.ready();
  }

  /** @private */
  _onAccesRefusedResponse() {
    this.view.content.rejected = true;
    this.view.render();
  }
}

serviceManager.register(SERVICE_ID, Auth);

export default Auth;
