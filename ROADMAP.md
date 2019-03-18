# ROADMAP

## v3.0.0

update Square to assess `AudioStreamManager` API

### 1. Merge `things` into `develop`

- merge soundworks/things
- review how to handle `thing` clients (should be in `src/client`)
- 

### 2. Misc

- replace socket.io
- fix uws
- remove all logic dedicated to client only (has never been used)
- replace express w/ something more simple?
- merge Process and Activity (aka remove Activity)
- decouple / explicit Experience from serviceManager.ready();

### 3. View and Services

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

### 4. Update apps

- Future Perfect
- Biotope
- Square
- Agneau Mystique
- All examples

### 5. Deploy

- clean old branches
- deploy v3.0.0
