import { audioContext } from 'waves-audio';
import client from '../core/client';
import MobileDetect from 'mobile-detect';
import screenfull from 'screenfull';
import SegmentedView from '../views/SegmentedView';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

/**
 * Structure of the definition of a feature to be tested.
 *
 * @typedef {Object} module:soundworks/client.Platform~definition
 * @property {String} id - Id of the definition.
 * @property {Function} check - A function that should return `true` if the
 *  feature is available on the platform, `false` otherwise.
 * @property {Function} [interactionHook] - A function to be executed on the
 *  first interaction (i.e. `click` or `touchstart`) of the user with application
 *  (for example, to initialize AudioContext on iOS devices).
 * @property {Function} [interactionHook] - A function to be executed on start
 *  (for example to ask access to microphone or geolocation).
 */
const defaultDefinitions = [
  {
    id: 'web-audio',
    check: function() {
      return !!audioContext;
    },
    interactionHook: function() {
      if (!client.platform.isMobile)
        return;

      const g = audioContext.createGain();
      g.connect(audioContext.destination);
      g.gain.value = 0.000000001; // -180dB ?

      const o = audioContext.createOscillator();
      o.connect(g);
      o.frequency.value = 20;
      o.start(0);

      // prevent android to stop audio by keping the oscillator active
      if (client.platform.os !== 'android')
        o.stop(audioContext.currentTime + 0.01);
    }
  },
  {
    // @note: `touch` feature workaround
    // cf. http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
    id: 'mobile-device',
    check: function() {
      return client.platform.isMobile;
    }
  },
  {
    id: 'audio-input',
    check: function() {
      navigator.getUserMedia = (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
      );

      return !!navigator.getUserMedia;
    },
    startHook: function() {
      navigator.getUserMedia({ audio: true }, function(stream) {
        stream.getAudioTracks()[0].stop();
      }, function (err) {
        throw err;
      });
    }
  },
  {
    id: 'full-screen',
    check: function() {
      // functionnality that cannot brake the application
      return true;
    },
    interactionHook() {
      if (screenfull.enabled)
        screenfull.request();
    }
  },
  {
    // adapted from https://github.com/richtr/NoSleep.js/blob/master/NoSleep.js
    id: 'wake-lock',
    check: function() {
      // functionnality that cannot brake the application
      return true;
    },
    interactionHook: function() {
      if (client.platform.os === 'ios') {
        setInterval(() => {
          window.location = window.location;
          setTimeout(window.stop, 0);
        }, 30000)
      } else {
        var medias = {
          webm: "data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA=",
          mp4: "data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAG21kYXQAAAGzABAHAAABthADAowdbb9/AAAC6W1vb3YAAABsbXZoZAAAAAB8JbCAfCWwgAAAA+gAAAAAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIVdHJhawAAAFx0a2hkAAAAD3wlsIB8JbCAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAABsW1kaWEAAAAgbWRoZAAAAAB8JbCAfCWwgAAAA+gAAAAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAVxtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAEcc3RibAAAALhzdHNkAAAAAAAAAAEAAACobXA0dgAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAIAAgASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAAFJlc2RzAAAAAANEAAEABDwgEQAAAAADDUAAAAAABS0AAAGwAQAAAbWJEwAAAQAAAAEgAMSNiB9FAEQBFGMAAAGyTGF2YzUyLjg3LjQGAQIAAAAYc3R0cwAAAAAAAAABAAAAAQAAAAAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAAEwAAAAEAAAAUc3RjbwAAAAAAAAABAAAALAAAAGB1ZHRhAAAAWG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAK2lsc3QAAAAjqXRvbwAAABtkYXRhAAAAAQAAAABMYXZmNTIuNzguMw=="
        };

        const $video = document.createElement('video');
        $video.setAttribute('loop', '');

        for (let type in medias) {
          const dataURI = medias[type];
          const $source = document.createElement('source');
          $source.src = dataURI;
          $source.type = `video/${type}`;

          $video.appendChild($source);
        }

        $video.play();
      }
    }
  }
];


const defaultViewTemplate = `
<% if (!isCompatible) { %>
  <div class="section-top"></div>
  <div class="section-center flex-center">
    <p><%= errorMessage %></p>
  </div>
  <div class="section-bottom"></div>
<% } else { %>
  <div class="section-top flex-middle"></div>
  <div class="section-center flex-center">
      <p class="big">
        <%= intro %>
        <br />
        <b><%= globals.appName %></b>
      </p>
  </div>
  <div class="section-bottom flex-middle">
    <p class="small soft-blink"><%= instructions %></p>
  </div>
<% } %>`;

const defaultViewContent = {
  isCompatible: null,
  errorMessage: 'Sorry,<br />Your device is not compatible with the application.',
  intro: 'Welcome to',
  instructions: 'Touch the screen to join!',
};

const SERVICE_ID = 'service:platform';

/**
 * Interface for the client `'platform'` service.
 *
 * This services is responsible for giving general informations about the user's
 * device (cf. [`client.device`]{@link module:soundworks/client.client.platform})
 * as well as checking availability and providing hooks in order to initialize
 * the features required by the application (audio, microphone, etc.).
 * If one of the required definitions is not available, a view is created with
 * an error message and the [`client.compatible`]{@link module:soundworks/client.client.compatible}
 * attribute is set to `false`.
 *
 * Available built-in definitions are:
 * - 'web-audio'
 * - 'mobile-device'
 * - 'audio-input'
 * - 'full-screen' (this feature won't block the application, just applied if available)
 * - 'wake-lock'
 *
 * Be carefull when setting `showDialog` option to `false` because most of these
 * features require an interaction or a confirmation from the user in order to
 * be initialized correctly,
 *
 * @see {@link module:soundworks/client.client}
 *
 * @param {Object} options
 * @param {Array<String>|String} options.features - Id(s) of the feature(s)
 *  required by the application.
 * @param {}
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.platform = this.require('platform', { features: 'web-audio' });
 */
class Platform extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID, false);

    const defaults = {
      // wakeLock: false, // @todo - fix and transform into a feature
      showDialog: true,
      viewCtor: SegmentedView,
      viewPriority: 10,
    };

    this.configure(defaults);

    this._defaultViewTemplate = defaultViewTemplate;
    this._defaultViewContent = defaultViewContent;

    this._requiredFeatures = new Set();
    this._featureDefinitions = {};

    defaultDefinitions.forEach((def) => this.addFeatureDefinition(def));
  }

  /** @private */
  configure(options) {
    if (options.features) {
      let features = options.features;

      if (typeof features === 'string')
        features = [features];

      this.requireFeature(...features);
      delete options.features;
    }

    super.configure(options);
  }

  /** @private */
  init() {
    this._defineAudioFileExtention();
    this._definePlatform();
    // resolve required features from the application
    client.compatible = this.resolveRequiredFeatures();
    this.viewContent.isCompatible = client.compatible;

    this.viewCtor = this.options.viewCtor;
    this.view = this.createView();
  }

  /** @private */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    // execute start hooks from the features definitions
    if (client.compatible) {
      const startHooks = this.getStartHooks();
      startHooks.forEach((hook) => hook());
    }

    // optionnaly skip the view if client is compatible
    if (client.compatible && !this.options.showDialog) {
      // bypass if features contains 'web-audio' and client.platform.os === 'ios'
      if (this._requiredFeatures.has('web-audio') && client.platform.os === 'ios')
        this.show();
      else
        this.ready();
    } else {
      this.show();
    }

    // install events for interaction hook
    if (client.compatible) {
      const event = client.platform.isMobile ? 'touchend' : 'click';
      this.view.installEvents({ [event]: this._onInteraction.bind(this) });
    }
  }

  /** @private */
  stop() {
    this.hide();
    super.stop();
  }

  /**
   * Add a new feature definition or override an existing one.
   * @param {module:soundworks/client.Platform~definition} obj - Definition of
   *  the feature to add to the existing ones.
   */
  addFeatureDefinition(obj) {
    this._featureDefinitions[obj.id] = obj;
  }

  /**
   * Require features avalability for the application.
   * @private
   * @param {...String} features - The id(s) of the feature(s) to be required.
   */
  requireFeature(...features) {
    features.forEach((id) => this._requiredFeatures.add(id));
  }

  /**
   * Execute all `check` functions from the definition of the required features.
   * @private
   * @return {Boolean} - true if all checks pass, false otherwise.
   *
   */
  resolveRequiredFeatures() {
    let result = true;

    this._requiredFeatures.forEach((feature) => {
      const checkFunction = this._featureDefinitions[feature].check;

      if (!(typeof checkFunction === 'function'))
        throw new Error(`No check function defined for ${feature} feature`);

      result = result && checkFunction();
    });

    return result;
  }

  /**
   * Returns the list of the functions to be executed on `start` lifecycle.
   * @private
   * @return {Array}
   */
  getStartHooks() {
    return this._getHooks('startHook');
  }

  /**
   * Returns the list of the functions to be executed when the user
   * interacts with the application for the first time.
   * @private
   * @return {Array}
   */
  getInteractionHooks() {
    return this._getHooks('interactionHook');
  }

  /** @private */
  _getHooks(type) {
    const hooks = [];

    this._requiredFeatures.forEach((feature) => {
      const hook = this._featureDefinitions[feature][type];

      if (hook)
        hooks.push(hook);
    });

    return hooks;
  }

  /**
   * Execute `interactions` hooks from the `platform` service.
   * Also activate the media according to the `options`.
   * @private
   */
  _onInteraction() {
    // execute interaction hooks from the platform
    const interactionHooks = this.getInteractionHooks();
    interactionHooks.forEach((hook) => hook());

    this.ready();
  }

  /**
   * Populate `client.platform` with the prefered audio file extention for the platform.
   * @private
   */
  _defineAudioFileExtention() {
    const a = document.createElement('audio');
    // http://diveintohtml5.info/everything.html
    if (!!(a.canPlayType && a.canPlayType('audio/mpeg;'))) {
      client.platform.audioFileExt = '.mp3';
    } else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"'))) {
      client.platform.audioFileExt = '.ogg';
    } else {
      client.platform.audioFileExt = '.wav';
    }
  }

  /**
   * Populate `client.platform` with the os name.
   * @private
   */
  _definePlatform() {
    const ua = window.navigator.userAgent
    const md = new MobileDetect(ua);

    client.platform.isMobile = (md.mobile() !== null); // true if phone or tablet
    client.platform.os = (function() {
      const os = md.os();

      if (os === 'AndroidOS')
        return 'android';
      else if (os === 'iOS')
        return 'ios';
      else
        return 'other';
    })();
  }
}

serviceManager.register(SERVICE_ID, Platform);

export default Platform;
