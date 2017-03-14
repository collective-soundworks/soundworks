import { audioContext } from 'waves-audio';
import client from '../core/client';
import MobileDetect from 'mobile-detect';
import screenfull from 'screenfull';
import SegmentedView from '../views/SegmentedView';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

/**
 * Definition of a feature to test.
 *
 * @typedef {Object} module:soundworks/client.Platform~definition
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
    check: function() {
      return !!audioContext;
    },
    interactionHook: function() {
      if (!client.platform.isMobile)
        return Promise.resolve(true);

      const g = audioContext.createGain();
      g.connect(audioContext.destination);
      g.gain.value = 0.000000001; // -180dB ?

      const o = audioContext.createOscillator();
      o.connect(g);
      o.frequency.value = 20;
      o.start(0);

      // prevent android to stop audio by keeping the oscillator active
      if (client.platform.os !== 'android')
        o.stop(audioContext.currentTime + 0.01);

      return Promise.resolve(true);
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
      return new Promise(function(resolve, reject) {
        navigator.getUserMedia({ audio: true }, function(stream) {
          stream.getAudioTracks()[0].stop();
          resolve(true);
        }, function (err) {
          resolve(false);
          throw err;
        });
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

      return Promise.resolve(true);
    }
  },
  {
    id: 'geolocation',
    check: function() {
      return !!navigator.geolocation.getCurrentPosition;
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
      return true;
    },
    startHook: function() {
      const lat = Math.random() * 360 - 180;
      const lng = Math.random() * 180 - 90;
      client.coordinates = [lat, lng];
      return Promise.resolve(true);
    }
  },
  {
    // adapted from https://github.com/richtr/NoSleep.js/blob/master/NoSleep.js
    // warning: cause 150% cpu use in chrome desktop...
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

      return Promise.resolve(true);
    }
  }
];


const defaultViewTemplate = `
<% if (isCompatible === false) { %>
  <div class="section-top"></div>
  <div class="section-center flex-center">
    <p><%= errorCompatibleMessage %></p>
  </div>
  <div class="section-bottom"></div>
<% } else if (resolvedHooks === false) { %>
  <div class="section-top"></div>
  <div class="section-center flex-center">
    <p><%= errorHooksMessage %></p>
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
    <% if (checking === true) { %>
    <p class="small soft-blink"><%= checkingMessage %></p>
    <% } else if (resolvedHooks === true) { %>
    <p class="small soft-blink"><%= instructions %></p>
    <% } %>
  </div>
<% } %>`;

const defaultViewContent = {
  isCompatible: null,
  resolvedHooks: null,
  checking: false,
  intro: 'Welcome to',
  instructions: 'Touch the screen to join!',
  checkingMessage: 'Please wait while checking compatiblity',
  errorCompatibleMessage: 'Sorry,<br />Your device is not compatible with the application.',
  errorHooksMessage: `Sorry,<br />The application didn't obtain the necessary authorizations.`,
};

const SERVICE_ID = 'service:platform';

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
 * - 'wake-lock': deprecated, use with caution, has been observed consumming
 *   150% cpu in chrome desktop.
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
 *  - 'wake-lock': deprecated, this feature should be used with caution as
 *    it has been observed to use 150% of cpu in chrome desktop.
 *
 * <!--
 * Warning: when setting `showDialog` option to `false`, unexpected behaviors
 * might occur because most of the features require an interaction or a
 * confirmation from the user in order to be initialized correctly.
 * -->
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
    super(SERVICE_ID, false);

    const defaults = {
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

    this.viewCtor = this.options.viewCtor;
    this.view = this.createView();
  }

  /** @private */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    // ### algorithm
    // check required features
    // if (false)
    //   show 'sorry' screen
    // else
    //   show 'welcome' screen
    //   execute start hook (promise)
    //   if (promise === true)
    //     show touch to start
    //     bind events
    //   if (promise === false)
    //     show 'sorry' screen

    // resolve required features from the application
    client.compatible = this._checkRequiredFeatures();

    if (!client.compatible) {
      this.view.content.isCompatible = false;
      this.show();
    } else {
      this.view.content.isCompatible = true;
      this.view.content.checking = true;
      this.show();

      // execute start hook
      const startHooks = this._getHooks('startHook');
      const startPromises = startHooks.map(hook => hook());

      Promise.all(startPromises).then((results) => {
        // if one of the start hook failed
        let resolved = true;
        results.forEach((bool) => resolved = resolved && bool);

        this.view.content.resolvedHooks = resolved;
        this.view.content.checking = false;
        this.view.render();

        if (resolved) {
          this.view.installEvents({
            touchstart: this._onInteraction('touch'),
            mousedown: this._onInteraction('mouse'),
          });
        }
      }).catch((err) => console.error(err.stack));
    }
  }

  /** @private */
  stop() {
    this.hide();
    super.stop();
  }

  /**
   * Add a new feature definition or override an existing one.
   *
   * @param {module:soundworks/client.Platform~definition} obj - Definition of
   *  the feature.
   */
  addFeatureDefinition(obj) {
    this._featureDefinitions[obj.id] = obj;
  }

  /**
   * Require features for the application.
   *
   * @param {...String} features - Id(s) of the feature(s) to be required.
   * @private
   */
  requireFeature(...features) {
    features.forEach((id) => this._requiredFeatures.add(id));
  }


  /**
   * Execute `interactions` hooks from the `platform` service.
   * Also activate the media according to the `options`.
   *
   * @private
   */
  _onInteraction(type) {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();

      client.platform.interaction = type;
      // execute interaction hooks from the platform
      const interactionHooks = this._getHooks('interactionHook');
      const interactionPromises = interactionHooks.map((hook) => hook());

      Promise.all(interactionPromises).then((results) => {
        let resolved = true;
        results.forEach((bool) => resolved = resolved && bool);

        if (resolved) {
          this.ready();
        } else {
          this.view.content.resolvedHooks = resolved;
          this.view.render();
        }
      }).catch((err) => console.error(err.stack));
    }
  }

  /**
   * Execute all `check` functions defined in the required features.
   *
   * @return {Boolean} - `true` if all checks pass, `false` otherwise.
   * @private
   */
  _checkRequiredFeatures() {
    let result = true;

    this._requiredFeatures.forEach((feature) => {
      const checkFunction = this._featureDefinitions[feature].check;

      if (!(typeof checkFunction === 'function'))
        throw new Error(`No check function defined for ${feature} feature`);

      result = result && checkFunction();
    });

    return result;
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
   * Populate `client.platform` with the prefered audio file extention
   * for the platform.
   *
   * @private
   */
  _defineAudioFileExtention() {
    const a = document.createElement('audio');
    // http://diveintohtml5.info/everything.html
    if (!!(a.canPlayType && a.canPlayType('audio/mpeg;')))
      client.platform.audioFileExt = '.mp3';
    else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"')))
      client.platform.audioFileExt = '.ogg';
    else
      client.platform.audioFileExt = '.wav';
  }

  /**
   * Populate `client.platform` with the os name.
   *
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
