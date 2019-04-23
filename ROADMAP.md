# ROADMAP

## v3.0.0

update `Square` to assess / complete `AudioStreamManager` API

### 1. Merge `things` into `develop`

- merge soundworks/things (ok)
- review how to handle `thing` clients (should be in `src/client`) (ok)
- sketch a `soundworks-cli` for updates (ok)

### 2. Misc / Updates - non braking

> should be compatible with `soundworks-template#master`

- remove all logic dedicated to client only apps (has never been used)
- remove bunyan logs (too noisy). 
- replace socket.io
- fix build scripts
- fix uws
- replace express w/ something more simple / efficient?
  see:
  + fastify 
  + polka https://github.com/lukeed/polka (+1)
- on start log more precise informations
  + ip of server (both local and on network)
  + existing routes
- platform - create a `fullscreen` alias for `full-screen`
- platform - add a test to test the `audioContext` clock (iOS)

> release 2.3.0

### 3. View and Services - breaking 

> along w/ `soundworks-template`

- move `html/default.ejs` in `src/server` in template (ok)
- review how soundworks/server handle `html` entry point. 
- split `env-config` and `services-config`
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
- explore latency estimation / compensation in Android

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
- improve reconnection of client(s)
- review the way that services are configured
- checkin - indexes by client types

- create a cli to create app, new clients etc.
- create a cli-tool for updates

- formalize States, Stores and Flows.
- automagically overide config options using url params
