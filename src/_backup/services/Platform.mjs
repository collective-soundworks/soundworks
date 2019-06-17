
import client from '../core/client';
import MobileDetect from 'mobile-detect';
import NoSleep from 'nosleep.js';
import screenfull from 'screenfull';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import isPrivateMode from '../utils/is-private-mode';
import parameters from '@ircam/parameters';

/**
 * Structure of the definition for the test of a feature.
 *
 * @typedef {Object} module:soundworks/client.Platform~definition
 *
 * @property {String} id - Id of the definition.
 * @property {Function} check - A function that should return `true` if the
 *  feature is available on the platform, `false` otherwise.
 * @property {Function} [startHook] - A function returning a `Promise` to be
 *  executed on start (for example to ask access to microphone or geolocation).
 *  The returned promise should be resolved on `true` is the process succeded or
 *  `false` is the precess failed (e.g. permission not granted).
 * @property {Function} [interactionHook] - A function returning a Promiseto be
 *  executed on the first interaction (i.e. `click` or `touchstart`) of the user
 *  with application (for example, to initialize AudioContext on iOS devices).
 *  The returned promise should be resolved on `true` is the process succeded or
 *  `false` is the precess failed (e.g. permission not granted).
 */
const defaultDefinitions = [
  {
    id: 'web-audio',
    check: function(audioContext) {
      return Promise.resolve(!!audioContext);
    },
    interactionHook: async function() {
      // @todo - put also in wawves-audio
      if (!('resume' in audioContext)) {
        audioContext.resume = () => {
          return Promise.resolve();
        }
      }

      await audioContext.resume();

      if (!client.platform.isMobile) {
        return Promise.resolve(true);
      }

      const g = audioContext.createGain();
      g.connect(audioContext.destination);
      g.gain.value = 0.000000001; // -180dB

      const o = audioContext.createOscillator();
      o.connect(g);
      o.frequency.value = 20;
      o.start(0);

      // prevent android to stop audio by keeping the oscillator active
      if (client.platform.os !== 'android') {
        o.stop(audioContext.currentTime + 0.01);
      }

      return Promise.resolve(true);
    }
  },
  {
    id: 'check-ios-samplerate',
    check: function() {
      return Promise.resolve(true);
    },
    interactionHook: function() {
      if (client.platform.os === 'ios') {
        // in ipod, when the problem occurs, sampleRate has been observed
        // to be set at 16000Hz, as no exhaustive testing has been done
        // assume < 40000 is a bad value.
        const localStorageKey = 'soundworks:check-ios-samplerate';

        if (audioContext.sampleRate < 40000) {
          window.localStorage.setItem(localStorageKey, true);
          window.location.reload(true);
          return;
        }

        const hasReloaded = !!window.localStorage.getItem(localStorageKey);

        if (hasReloaded) {
          window.localStorage.removeItem(localStorageKey);
          client.platform.hasReloaded = true;
        }
      }

      return Promise.resolve(true);
    },
  },
  {
    id: 'public-browsing',
    check: function() {
      return isPrivateMode().then(isPrivate => Promise.resolve(!isPrivate));
    },
  // },
  // {
  //   id: 'wake-lock',
  //   check: function() {
  //     console.warn('[soundworks:platform] `wake-lock` is now enabled by default, consider removing it from your required features');
  //     return Promise.resolve(true);
  //   },
  // },
  // {
  //   // @note: `touch` feature workaround (remove?)
  //   // cf. http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
  //   id: 'mobile-device',
  //   check: function() {
  //     return Promise.resolve(client.platform.isMobile);
  //   }
  // },
  {
    id: 'audio-input',
    check: function() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return Promise.resolve(true);
      } else {
        navigator.getUserMedia = (
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia
        );

        return Promise.resolve(!!navigator.getUserMedia);
      }
    },
    startHook: function() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            stream.getAudioTracks()[0].stop();
            return Promise.resolve(true);
        })
        .catch(err => {
          console.log(err);
          return Promise.resolve(false);
        });
      } else {
        return new Promise(function(resolve, reject) {
          navigator.mediaDevices.getUserMedia({ audio: true }, (stream) => {
            stream.getAudioTracks()[0].stop();
            resolve(true);
          }, (err) => {
            resolve(false);
            throw err;
          });
        });
      }
    }
  },
  {
    id: 'fullscreen',
    alias: 'full-screen', // for backward compatibility (until v2.2.1)
    check: function() {
      // functionnality that cannot brake the application
      return Promise.resolve(true);
    },
    interactionHook() {
      if (screenfull.enabled)
        screenfull.request();

      return Promise.resolve(true);
    }
  },
  // alias full screen
  {

    check: function() {
      // functionnality that cannot brake the application
      return Promise.resolve(true);
    },
    interactionHook() {
      if (screenfull.enabled)
        screenfull.request();

      return Promise.resolve(true);
    }
  },
  // @todo move to geolocation service
  {
    id: 'geolocation',
    check: function() {
      return Promise.resolve(!!navigator.geolocation.getCurrentPosition);
    },
    startHook: function() {
      return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition((position) => {
          // populate client with first value
          const coords = position.coords;
          client.coordinates = [coords.latitude, coords.longitude];
          client.geoposition = position;

          resolve(true);
        }, (err) => {
          resolve(false);
          throw err;
        }, {});
      });
    }
  },
  {
    id: 'geolocation-mock',
    check: function() {
      return Promise.resolve(true);
    },
    startHook: function() {
      const lat = Math.random() * 360 - 180;
      const lng = Math.random() * 180 - 90;
      client.coordinates = [lat, lng];

      return Promise.resolve(true);
    }
  },
];

const SERVICE_ID = 'platform';

/**
 * Interface for the client `'platform'` service.
 *
 * The `platform` services is responsible for giving general informations
 * about the user's device as well as checking availability and providing hooks
 * in order to initialize the features required by the application (audio,
 * microphone, etc.).
 * If one of the required definitions is not available, a view is created with
 * an error message and `client.compatible` is set to `false`.
 *
 * Available built-in definitions are:
 * - 'web-audio'
 * - 'mobile-device': only-accept mobile devices in the application (based on
 *   User-Agent sniffing)
 * - 'audio-input': Android Only
 * - 'full-screen': Android Only, this feature won't block the application if
 *   not available.
 * - 'geolocation': check if the navigator supports geolocation. The `coordinates`
 *   and `geoposition` of the `client` are populated when the plaform service
 *   resolves. (if no update of the coordinates are needed in the application,
 *   requiring geolocation feature without using the Geolocation service should
 *   suffice).
 * - 'wake-lock': use with caution, has been observed consumming
 *   150% cpu in chrome desktop.
 *
 *
 * _<span class="warning">__WARNING__</span> This class should never be
 * instanciated manually_
 *
 * @param {Object} options
 * @param {Array<String>|String} options.features - Id(s) of the feature(s)
 *  required by the application. Available build-in features are:
 *  - 'web-audio'
 *  - 'mobile-device': only accept mobile devices (recognition based User-Agent)
 *  - 'audio-input': Android only
 *  - 'full-screen': Android only
 *  - 'geolocation': accept geolocalized devices. Populate the client with
 *     current position
 *  - 'wake-lock': this feature should be used with caution as
 *     it has been observed to use 150% of cpu in chrome desktop.
 * @param {Boolean} [options.showDialog=true] - If set to `false`, the service
 *  execute all hooks without waiting for a user interaction and doesn't show
 *  the service's view. This option should only be used on controlled
 *  environnements where the target platform is known for working without
 *  this need (e.g. is not iOS).
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.platform = this.require('platform', { features: 'web-audio' });
 *
 * @see {@link module:soundworks/client.client#platform}
 */
class Platform extends Service {
  constructor() {
    super(SERVICE_ID);

    const defaults = {
      // @todo - review for better handling of thing and desktop clients
      showDialog: true,
    };

    this.configure(defaults);

    this.params = parameters({
      checkingStatus: {
        type: 'boolean',
        default: false,
      },
      hasAuthorizations: {
        type: 'boolean',
        default: null,
        nullable: true,
      },
      compatible: {
        type: 'boolean',
        default: null,
        nullable: true,
      },
      interactionType: {
        type: 'enum',
        list: ['touch', 'mouse'],
        nullable: true,
        default: null,
      },
      audioFileExtension: {
        type: 'string',
        default: null,
        nullable: true,
      },
      mobile: {
        type: 'boolean',
        default: null,
        nullable: true,
      },
      os: {
        type: 'string',
        default: null,
        nullable: true,
      },
    });

    this._requiredFeatures = new Set();
    this._featureDefinitions = {};

    defaultDefinitions.forEach((def) => this.addFeatureDefinition(def));
  }

  /** @private */
  configure(options) {
    if (options.features) {
      let features = options.features;

      if (typeof features === 'string') {
        features = [features];
      }

      if (features.indexOf('web-audio') !== -1) {
        features.push('check-ios-samplerate');
      }

      this._requireFeature(...features);

      delete options.features;
    }

    super.configure(options);
  }

  /**
   *  Algorithm:
   *  - check required features
   *  - if (false)
   *     show 'sorry' screen
   *  - else
   *     show 'welcome' screen
   *     execute start hook (promise)
   *     - if (promise === true)
   *        show touch to start
   *        bind events
   *     - else
   *        show 'sorry' screen
   *
   * @private
   */
  start() {
    super.start();

    this._defineAudioFileExtention();
    this._definePlatform();

    // check and initialize features required by the application
    this._checkRequiredFeatures().then(([compatible, details]) => {
      this.params.set('compatible', compatible);

      if (compatible) {
        if (this.options.showDialog === false) {
          if (compatible) {
            const startPromises = this._getHooks('startHook');
            const interactionPromises = this._getHooks('interactionHook');
            const promises = [].concat(startPromises, interactionPromises);

            Promise.all(promises).then(results => {
              let resolved = true;
              results.forEach(bool => resolved = resolved && bool);

              if (resolved)
                this.ready();
              else
                throw new Error(`service:platform - didn't obtain the necessary authorizations`);
            })
          }
        } else if (compatible) {
          this.params.set('checkingStatus', true);
          // execute start hook
          const startPromises = this._getHooks('startHook');

          Promise.all(startPromises).then(results => {
            // if one of the start hook failed
            let hasAuthorizations = true;
            results.forEach(success => hasAuthorizations = hasAuthorizations && success);

            this.params.set('checkingStatus', false);
            this.params.set('hasAuthorizations', hasAuthorizations);
            // @note - now the view should add the event listeners
          }).catch((err) => console.error(err.stack));
        }
      } else {
        throw new Error('service:platform - client not compatible');
      }
    }).catch((err) => console.error(err.stack));
  }

  /**
   * Structure of the definition for the test of a feature.
   *
   * @param {module:soundworks/client.Platform~definition} obj - Definition of
   *  the feature.
   */
  addFeatureDefinition(obj) {
    this._featureDefinitions[obj.id] = obj;

    if (obj.alias) {
      this._featureDefinitions[obj.alias] = obj;
    }
  }

  /**
   * Code to be executed on a user gesture
   *
   * @private
   */
  onUserGesture(type = null) {
    // we dont care to have that on desktop
    // @todo - find a way to match desktop emulating mobile
    if (type === 'touch') {
      const noSleep = new NoSleep();
      noSleep.enable();
    }

    this.params.set('interactionType', type);
    // execute interaction hooks from the platform
    const interactionPromises = this._getHooks('interactionHook');

    Promise.all(interactionPromises).then((results) => {
      const resolved = results.reduce((acc, value) => acc && value, true);

      if (resolved) {
        this.ready();
      } else {
        this.params.set('hasAuthorizations', false);
      }
    }).catch(err => console.error(err.stack));
  }

  /**
   * Require features for the application.
   *
   * @param {...String} features - Id(s) of the feature(s) to be required.
   * @private
   */
  _requireFeature(...features) {
    features.forEach(([id, ...args]) => {
      if (!this._featureDefinitions[id]) {
        throw new Error(`${SERVICE_ID} - Cannot require undefined feature: "${id}"`)
      }

      this._requiredFeatures.add({ id, args });
    });
  }

  /**
   * Execute all `check` functions defined in the required features.
   *
   * @return {Boolean} - `true` if all checks pass, `false` otherwise.
   * @private
   */
  _checkRequiredFeatures() {
    const promises = [];

    this._requiredFeatures.forEach(({ id, args }) => {
      const checkFunction = this._featureDefinitions[id].check;

      if (!(typeof checkFunction === 'function')) {
        throw new Error(`${SERVICE_ID} - No check function defined for feature: "${id}"`);
      }

      const featurePromise = checkFunction(...args);
      promises.push(featurePromise);
    });

    return Promise.all(promises).then(featureResults => {
      const isCompatible = featureResults.indexOf(false) !== -1 ? false : true;
      const details = {};

      this._requiredFeatures.forEach((infos, index) => {
        details[infos.id] = featureResults[index];
      });

      return Promise.resolve([isCompatible, details]);
    }).catch(err => console.error(err.stack));
  }

  /** @private */
  _getHooks(type) {
    const promises = [];

    this._requiredFeatures.forEach(({ id, args }) => {
      const hook = this._featureDefinitions[id][type];

      if (hook) {
        const promise = hook(...args);
        promises.push(promise);
      }
    });

    // return an array of Promises instead of function
    return promises;
  }

  /**
   * Populate `client.platform` with the prefered audio file extention
   * for the platform.
   *
   * @private
   */
  _defineAudioFileExtention() {
    const a = document.createElement('audio');
    // http://diveintohtml5.info/everything.html
    if (!!(a.canPlayType && a.canPlayType('audio/mpeg;')))
      this.params.set('audioFileExtension', '.mp3');
    else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"')))
      this.params.set('audioFileExtension', '.ogg');
    else
      this.params.set('audioFileExtension', '.wav');
  }

  /**
   * Populate `client.platform` with the os name.
   *
   * @private
   */
  _definePlatform() {
    const ua = window.navigator.userAgent
    const md = new MobileDetect(ua);

    // @note - `true`` for phone or tablet
    this.params.set('mobile', (md.mobile() !== null));

    const os = md.os();

    if (os === 'AndroidOS') {
      this.params.set('os', 'android');
    } else if (os === 'iOS') {
      this.params.set('os', 'ios');
    } else {
      this.params.set('os', 'other');
    }
  }
}

serviceManager.register(SERVICE_ID, Platform);

export default Platform;
