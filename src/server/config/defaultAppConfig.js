/**
 * Set of configuration parameters for a particular application.
 * These parameters typically inclusd a `setup` entry defining the place where
 * the experience take place.
 *
 * Other entries can be added (as long as their name doesn't conflict with
 * existing ones) to define global parameters of the application (for example:
 * BPM, synth parameters, etc.) that can then be shared easily among all clients
 * using the [`shared-config`]{@link module:soundworks/server.SharedConfig}
 * service.
 *
 * @memberof module:soundworks/server
 * @namespace
 *
 * @see {@link module:soundworks/server.defaultEnvConfig}
 * @see {@link module:soundworks/server.defaultFwConfig}
 * @see {@link module:soundworks/server.SharedConfig}
 * @see {@link https://github.com/collective-soundworks/soundworks-template}
 */
const defaultAppConfig = {
  /**
   * Title of the application, by default this value is used by the
   * [`welcome`]{@link module:soundworks/client.Welcome} service to populate
   * its view.
   * @type {String}
   */
  appName: 'Soundworks',
  /**
   * Version of the application. This value is used in the
   * [`application template`]{@link https://github.com/collective-soundworks/soundworks-template}
   * to change js and css files URLs and bypass browsers' cache.
   * @type {String}
   * @private
   */
  version: '0.0.1',
  /**
   * This entry is aimed to descibe the location where the experience takes
   * places. All values can be overriden to match the existing location and
   * experience setup but the structure of the object should be kept in order to
   * be consummed properly by services like
   * [`checkin`]{@link module:soundworks/client.Checkin},
   * [`locator`]{@link module:soundworks/client.Locator},
   * or [`placer`]{@link module:soundworks/client.Placer}.
   *
   * @type {Object}
   * @property {Object} [setup.area=null] - Dimensions of the area.
   * @property {Number} [setup.area.height=10] - Height of the area.
   * @property {Number} [setup.area.width=10] - Width of the area.
   * @property {Array<String>} [setup.labels] - List of predefined labels.
   * @property {Array<Array>} [setup.coordinates] - List of predefined coordinates
   *  given as an array of `[x:Number, y:Number]`.
   * @property {Number} [setup.capacity=Infinity] - Maximum number of places
   *  (may limit or be limited by the number of labels and/or coordinates).
   * @property {Number} [setup.maxClientsPerPosition=1] - The maximum number of
   *  clients allowed in a position.
   *
   * @see {@link module:soundworks/client.Checkin}
   * @see {@link module:soundworks/client.Locator}
   * @see {@link module:soundworks/client.Placer}
   */
  setup: {
    area: {
      width: 10,
      height: 10,
      background: undefined,
    },
    labels: undefined,
    coordinates: undefined,
    maxClientsPerPosition: 1,
    capacity: Infinity,
  },
  /** @private */
  controlParameters: {
    tempo: 120, // tempo in BPM
    volume: 0, // master volume in dB
  },
};

export default defaultAppConfig;
