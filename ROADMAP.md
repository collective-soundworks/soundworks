# ROADMAP

## v3.0.0

update `Square` to assess / complete `AudioStreamManager` API

### 1. Merge `things` into `develop`

- merge soundworks/things (ok)
- review how to handle `thing` clients (should be in `src/client`) (ok)
- sketch a `soundworks-cli` for updates (ok)

### 2. Misc / Updates - non breaking

> should be compatible with `soundworks-template#master`
 
- on start log more precise informations 
  + ip of server (both local and on network) - ok
  + existing routes - ok
  + used services and initialization status - ok

- platform - create a `fullscreen` alias for `full-screen` (ok)
- remove all logic dedicated to client only apps (has never been used) (ok)
- remove bunyan logs (too noisy). (ok) 
- replace socket.io (ok)
- replace express w/ by polka (ok)
- fix `uws` with `ws` (ok)
- better ErrorReporter 
  + find infos from es6 source (ok)
  + log server errors (ok)
- binarySocket by default in sockets (ok)
- tag rawSocket as deprecated (ok)
- fix build scripts  (ok)

- platform 
  + add a definition for localStorage 
- check if lame is installed when requesting AudioStreamManager
  + log and exit gracefully
- 

> release 2.3.0

### 3. View and Services - breaking 

> along w/ `soundworks-template`

- decouple views and services by relying on events
- merge Process and Activity (aka remove Activity)
- decouple / explicit `Experience.start()` from `serviceManager.ready()`
- move all views into a new package @soundworks/legacy-views
  + should work out of the box by only improting the package
  + remove prefabs and views from code base
  + rethink viewManager
- explore `lit-html` and `lit-elements` as a possible replacements.
- improve services
  + define which services we keep in `core` (validate w/ Norbert)
  + more intuitive sharedParams API
  + add OSC logic out of the box
  + ...
  + transport?
  + see and fix bottlenecks for sharing code betwenn things and clients
  + add tests
- use dependency injection more systematically (cf. serviceManager)
- explore advanced shell controller
  + logs number of connected clients by type
  + to create advanced cli views: https://github.com/vadimdemedes/ink#building-layouts
  + - create an internal store for displaying soundworks internal state
  + check : cronvel/terminal-kit
- explore latency estimation / compensation in Android
- rename ErrorReporter to Logger
  + add the ability to log user defined messages (trace behavior)
- platform 
  + add a test for the `audioContext` clock (iOS)
  + define a way to display useful informations in case of error

misc:
- remove utils/setup/helper.js
- 

> soundworks-template

- move `html/default.ejs` in `src/server` in template (ok)
- review how soundworks/server handle `html` entry point. 
- split `env-config` and `services-config`

> release 3.0.0

### 4. Update apps

- Future Perfect
- Biotope
- Square
- Agneau Mystique
- Elements
- All examples

### 5. Deploy

- clean old branches
- deploy v3.0.0

## v.Next - new features

- make services more dynamic (ex. audioStreamManager: add a new stream while app is running, etc.)
- improve workflow (ex. more audioStreamManager robust audioStream caching system)
- improve audioBufferManager (dynamic add, remove, rename files)
- improve reconnection of client(s)
- review the way that services are configured
- checkin - indexes by client types / rooms
- `option.order` should be server-side

- create a cli to create app, new clients etc.
- create a cli-tool for updates

- formalize States, Stores and Flows.
- automagically overide config options using url params
