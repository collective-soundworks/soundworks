# ROADMAP

## v3.0.0

update `Square` to assess / complete `AudioStreamManager` API

### 1. Merge `things` into `develop`

- merge soundworks/things (ok)
- review how to handle `thing` clients (should be in `src/client`) (ok)
- sketch `soundworks-cli` for updates (ok)

### 2. Misc / Updates - non braking

- move `html/default.ejs` in `src/server` in template (ok)
- review how soundworks/server handle `html` entry point. 
- replace socket.io
- replace express ? see fastify
- fix uws
- remove all logic dedicated to client only (has never been used)
- replace express w/ something more simple?
- merge Process and Activity (aka remove Activity)
- decouple / explicit Experience from serviceManager.ready();
- remove bunyan logs (too noisy). explore ways to create a nice shell gui that could give important informations (kind of controller...)
  + should logs number of connected clients by type
  + existing routes
  + to create advanced cli views: https://github.com/vadimdemedes/ink#building-layouts

> release 2.3.0

### 3. View and Services - breaking 

- decouple views and services by relying on events
- move all views into a new package @soundworks/legacy-views
  + should work out of the box by only improting the package
  + remove prefabs and views from code base
  + rethink viewManager
- improve services
  + more intuitive sharedParams API
  + add OSC logic out of the box
  + ...
  + transport?
  + see (and fix?) bottlenecks for sharing code betwenn things and clients
- explore `lit-html` and `lit-elements` as a possible replacements.
- use dependency injection more systematically (cf. serviceManager)

> release 3.0.0

### 4. Update apps

- Future Perfect
- Biotope
- Square
- Agneau Mystique
- All examples

### 5. Deploy

- clean old branches
- deploy v3.0.0


## v.Next - new features

- make services more dynamic (ex. audioStreamManager: add a new stream while app is running, etc.)
- improve workflow (ex. more audioStreamManager robust audioStream caching system)
- improve reconnection of client(s)
- review the way that services are configured

- create a cli to create app, new clients etc.
- formalize States, Stores and Flows.
