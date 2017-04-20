import client from '../core/client';
import Service from '../core/Service';
import SegmentedView from '../views/SegmentedView';
import serviceManager from '../core/serviceManager';


const SERVICE_ID = 'service:auth';
const LOCAL_STORAGE_KEY = `soundworks:${SERVICE_ID}`;

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
/**
 * Set the callback that should be executed when the reset action is executed
 * on the view.
 *
 * @function
 * @name AbstractAuthView.onReset
 * @param {Function} callback - The callback given by the `auth` service.
 */



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
  constructor() {
    super(SERVICE_ID, true);

    const defaults = {
      viewPriority: 100,
    };

    this.configure(defaults);

    this._password = null;

    this._onAccesGrantedResponse = this._onAccesGrantedResponse.bind(this);
    this._onAccesRefusedResponse = this._onAccesRefusedResponse.bind(this);
    this._sendPassword = this._sendPassword.bind(this);
    this._resetPassword = this._resetPassword.bind(this);
  }

  /** @private */
  start() {
    super.start();

    this.view.setSendPasswordCallback(this._sendPassword);
    this.view.setResetCallback(this._resetPassword);

    this.receive('granted', this._onAccesGrantedResponse);
    this.receive('refused', this._onAccesRefusedResponse);

    const storedPassword = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (storedPassword !== null)
      this._sendPassword(storedPassword);

    this.show();
  }

  /** @private */
  stop() {
    super.stop();

    this.removeListener('granted', this._onAccesGrantedResponse);
    this.removeListener('refused', this._onAccesRefusedResponse);

    this.hide();
  }

  /**
   * Remove the stored password from local storage. This method is aimed at
   * being called from inside an experience / controller. Any UI update
   * resulting from the call of this method should then be handled from the
   * experience.
   */
  logout() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  /** @private */
  _sendPassword(password) {
    this._password = password;
    this.send('password', password);
  }

  /** @private */
  _resetPassword() {
    this._password = null;
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    this.view.updateRejectedStatus(false);
    this.view.render();
  }

  /** @private */
  _onAccesGrantedResponse() {
    localStorage.setItem(LOCAL_STORAGE_KEY, this._password);
    this.ready();
  }

  /** @private */
  _onAccesRefusedResponse() {
    this.view.updateRejectedStatus(true);
    this.view.render();
  }
}

serviceManager.register(SERVICE_ID, Auth);

export default Auth;
