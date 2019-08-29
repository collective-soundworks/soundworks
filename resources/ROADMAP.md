# ROADMAP

## Boring !!

- email npm support because of that: https://www.npmjs.com/org/soundworks (ok - wait for answer...)

## 1. Merge `things` into `develop` (done)

- merge soundworks/things (ok)
- review how to handle `thing` clients (should be in `src/client`) (ok)
- sketch a `soundworks-cli` for updates (ok)

## 2. Misc / Updates - v2.2.1 (done)

> should be compatible with `soundworks-template#master`
 
- on start log more precise informations 
  + ip of server (both local and on network) - ok
  + existing routes - ok
  + used services and initialization status - ok

- platform - create a `fullscreen` alias for `full-screen` (ok)
- remove all logic dedicated to client only apps (has never been used) (ok)
- remove bunyan logs (too noisy). (ok) 
- fix `uws` with `ws` (ok)
- better ErrorReporter 
  + find infos from es6 source (ok)
  + log server errors (ok)
- [build] fix build scripts  (ok)

## 3. View and Services - breaking (on-going)

Good documentation should consist of:
- A high level overview of the whole module and how it works
- Javadocs, Heredocs, Rdocs or whatever of its public methods and protocols
- Sample code showing how to use it


### done

- [sockets] binarySocket by default in sockets (ok)
- [sockets] tag rawSocket as deprecated (ok)
- [sockets] replace socket.io (ok)
- [sockets] socket allow to remove all callback from a channel at once. (ok)
- [server] replace express w/ by polka (ok)
- [build] update build scripts w/ modern tool (ok, still wip...)
- [platform] - add a definition for public-browsing (localStorage) (ok)
- [AudioStreamManager] check if lame is installed when requesting AudioStreamManager (ok, probably not windows compliant...)

### on-going

- [core]
  + move everything to Class so that we can instanciate several client in one window
```
const soundworks = new Soundworks();
```

  **done**
  + merge Process and Activity (aka remove Activity, `Process`es and thus services should have nothing to do with views and network, only with states and `client.socket`) (ok)
  + decouple / explicit `Experience.start()` from `serviceManager.ready()` (ok)
  + use dependency injection more systematically / decouple everything (cf. serviceManager) (ok)

- [StateManager] 
  + define if we want to dipatch if value didn't change (maybe option?)
  + when stable, import to core and generalize its usage to all services?
  + abstract from soundworks clients 
  probably something like:
```
new StateMnager(id, { send, addListener, removeListener }
```
  + put in its own package
  
  **done**
  + handle attach twice (ignore or throw, just do something)
  + stabilize API (v1) - see w/ Ricardo and Diemo (ok)
  + wrap in a `StateManageer` service (nop - belongs to core)
  + start to write tests as we can now test most of the things using a node client

- [services]
  **done**
  + decouples existing services from the ones that will be removed (ok)
  + all services MUST a server-side (even no-op) (ok)
  + remove all services from core (ok)
  
- [sockets] 
  + review binaryBuffer encoding / decoding with new `fast-text-encoding`,i.e. see if we still need to copy buffers or if the `Buffer.offset` is properly taken in account
  + add the client-side heartbeat stuff: https://www.npmjs.com/package/ws#other-examples
  + install that and see if problems still occur: https://github.com/plantain-00/ws-heartbeat

  **done**
  + remove `send`, `addListener`, etc from `server.sockets` (only keep `broadcast` methods there) (ok)
  + fix not sent errors messages (check `socket.OPENED` / `socket.CLOSED` ?)
  + configure path in sockets (ok)
  + update [thing.sockets] see if can share code w/ browsers clients (ok)
  + use isomorphic-ws for code sharing w/ thing clients (ok)

- [views] 
  + create a `servicesState` in serviceManager: should allow for proper display of informations without making assumptions on the view system.
  => _sketched, confirm API_
  
  **done**
  + remove (prefabs, views, etc.) from core (ok)
  + explore `lit-html` and `lit-elements` as a possible replacements (ok)
  + remove viewManager, (ok)

- [services] 
  + define a proper model for external services / plugins (monorepo)
    * cf. https://github.com/lerna/lerna 
  => _sketched, confirm API_
  + adapt remaining existing services to new plugin system
  + start to write tests as we can now test most of the things using a node client

  **done**
  + define which services we keep in `core` (validate w/ Norbert) - (ok, finally none) (ok)
  + remove `service:` from service's ids, just add noise for nothing
    * or maybe not, allow to not collapse w/ with user field
    * might be simply fixed by using states...
  + share code betwenn `things` and `browsers` clients (ok)

- [misc]

move utils/math into waves-audio

### fixes, upgrades, new services

- [ErrorReporter] 
  + errors are broadcasted to all clients... that's bad (may be a `socket.broadcast` issue)
  + server errors are displayed twice... that boring
  + rename to Logger
  + add the ability to log user defined messages (trace behavior)

- [SyncService] 
  + report latency from clients to server for auditing
  + explore latency estimation / compensation in Android (ok, make more measures) 
  + report network latency per client too
  + check if something weird can happen if we load a lot of sound

- [PlatformService] 
  + add a test for the `audioContext` clock (iOS) - with reporting for in the wild testing
  + display useful informations in case of error / incompatibility

- [Auth]
  + rename to simple
  + make more robust with `md5` or something

- [TransportService] sketch first version

- [LiveCodingService] sketch first version
```
# client
  const liveFilter = this.liveCodingService.attachScript('my-filter');
  const liveSynth = this.liveCodingService.attachScript('my-synth');
  // ... later
  const data = [...];
  const res = liveFilter({ data });
  // ...
  liveSynth({ audioContext });
```

```
# controller
this.liveCodingService.updateScript('my-filter', string);
```
  + persist current state in file (don't loose state between app restart)
  + dispatch and process with eval on change
  + inject file in source code when stabilized(?)

- [AudioStreamManager] 
  + assess new API w/ update of square

### soundworks-template

- move `html/default.ejs` in `src/server` in template (ok)
- review how soundworks/server handle `html` entry point. 
- split config files: `env-config` and `services-config` ?

### update apps

- Future Perfect
- Biotope (get back the soundworks code from prod server)
- Square (Bologne Fin Juillet - Turin Septembre 2020 - Quai de Branly)
- Elements
- All examples
- Agneau Mystique (not sure)

### clean repo

+ clean old branches
+ create npm organisation (@soundworks/core etc...)
+ clean documentation
+ create tutorials

> RELEASE 3.0.0 - target WAC2019

## DEPENDENCIES

- [ssh-key]
  + command-line tool for managing ssh-keys locally

- [dns / dhcp]
  + replacement of Server.app
  
- [parameters]
  + fix `
TypeError: Cannot read property 'setValue' of undefined
[PROCESS]     at ParameterBag.setValue [as set] (/Users/matuszewski/dev/js/ircam-jstools/lib/parameters/dist/parameters.js:176:27)
`
  + review `event` type, maybe make a proper type
  + remove `EventListener` abalities by default, create a decorator/mixin for that when needed
  + allow to instanciate params one by one ? and create parameter bag later ?
  ``` // example
  const volume = new FloatParam({ min: -80, max: 6, default: 0, step: 0.1 });
  // ...
  const parameters = new emitter(parameters)({
    params: { volume, ... }, 
    timetag: ()  => audioContext.currentTime,
  });
  ```
  + [later] define how to timetag everything
  
- [xmm-node]
  + fix in node 10 and later, rewrite using Napi

- [sc-elements]
  + create basic sc-elements (bang, slider, number, text, color-picker, matrix)
  + use monorepo
  + port basic controllers
  + define how to make them: resizable, movable, configurable 
    (Max model?, something else?)

##  v.Next - new features / ideas to explore

- [stateManager]
  + max patch example / abstraction to dynamically create controls from OSC 
  + explore what would it mean to have dynamic schemas

- [server-console] explore advanced shell controller
  + logs number of connected clients by type
  + explore how to create advanced cli views: https://github.com/vadimdemedes/ink#building-layouts
  + create an internal store for displaying soundworks internal state (`audit` store, created and owned by server, controllers can attach)
  + check : cronvel/terminal-kit

- [SshKeyService] sketch service for importing / managing ssh keys? (see w/ Remi) 
  + consume a command line utility that prompt user on server statup?
  + or too complicated?

[cli-tool]
  + create a cli to create app, new clients etc.
  + create a cli-tool for updates

[services]
  + make services more dynamic (ex. audioStreamManager: add a new stream while app is running, etc.)
  + improve workflow (ex. more audioStreamManager robust audioStream caching system)
  + improve audioBufferManager (dynamic add, remove, rename files)
  + review the way services are configured
  + checkin - indexes by client types / rooms
    * `option.order` should be server-side
  
[misc]
  + improve reconnection of client(s)
  + automagically overide config options using url params