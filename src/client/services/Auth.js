import client from '../core/client';
import Service from '../core/Service';
import SegmentedView from '../views/SegmentedView';
import serviceManager from '../core/serviceManager';

/**
 * API of a compliant view for the `auth` service.
 *
 * @memberof module:soundworks/client
 * @interface AbstractAuthView
 * @extends module:soundworks/client.AbstractView
 * @abstract
 */
/**
 * Register the function that should be executed when the password is submitted
 * by the user.
 *
 * @name setSendPasswordCallback
 * @memberof module:soundworks/client.AbstractAuthView
 * @function
 * @abstract
 * @instance
 *
 * @param {sendPasswordCallback} callback - Callback to execute when the user
 *  submit the password
 */
/**
 * Register the function that should be executed when the password is reset
 * by the user.
 *
 * @name setResetPasswordCallback
 * @memberof module:soundworks/client.AbstractAuthView
 * @function
 * @abstract
 * @instance
 *
 * @param {setResetCallback} callback -
 *  Callback to execute when the user reset the password
 */
/**
 * Update the view according to the response to the submitted password.
 *
 * @name updateRejectedStatus
 * @memberof module:soundworks/client.AbstractAuthView
 * @function
 * @abstract
 * @instance
 *
 * @param {Boolean} value - `true` if the submitted password is rejected,
 *  `false` when the password is reset.
 */

/**
 * Callback to execute when the user submit the password.
 *
 * @callback
 * @name sendPasswordCallback
 * @memberof module:soundworks/client.AbstractAuthView
 *
 * @param {String} password - Password given by the user.
 */
/**
 * Callback to execute when the user reset the password.
 *
 * @callback
 * @name resetCallback
 * @memberof module:soundworks/client.AbstractAuthView
 */


const SERVICE_ID = 'service:auth';
const LOCAL_STORAGE_KEY = `soundworks:${SERVICE_ID}`;

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
  }

  /** @private */
  _onAccesGrantedResponse() {
    localStorage.setItem(LOCAL_STORAGE_KEY, this._password);
    this.ready();
  }

  /** @private */
  _onAccesRefusedResponse() {
    this.view.updateRejectedStatus(true);
  }
}

serviceManager.register(SERVICE_ID, Auth);

export default Auth;
