# SERVICES_UPDATES - v3

## services to keep

- AudioBufferManager
- Auth
- Checkin -> add room abilities
- ErrorReporter
- Platform
- Sync -> add estimated latency informations
- @todo: Transport ?
- @todo: Master ?

## services to externalize (plugins)
`npm install soundworks-geolocation` 

=> maybe create an @soundworks organisation
(cf. https://stackoverflow.com/questions/46942043/npm-install-add-custom-warning-message)
`npm install @soundworks/core`
`npm install @soundworks/service-geolocation`

- AudioStreamManager -> rename to StreamEngineFactory ?
- Geolocation
- Language
- Locator
- MetricScheduler
- MotionInput -> probably more smart considering the need for https, and the fact that the API will probably change a lot to comply with https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs
- Placer
- SharedRecorder (too GrainField centered) -> simplify to a more generic Recorder and use the AudioBufferManager to handle the rest.
- Osc

## services to remove

- AudioScheduler (use `masters.Scheduler` instead)
- SyncScheduler (maybe remove, see what it means in term of lower-level code and examples, TBC)
- Network (only Orbe uses this... maybe just give them the code)
- RawSocket (replaced by `client.socket.sendBinary`)
- SharedConfig (should not be needed w/ a proper distributed model, not really used and often too long to initialize to be usefull…)
- SharedParams (should not be needed w/ proper distributed model, or move in plugins as a simple wrapper around the distributed state - TBC)
- FileSystem (hide into a smarter AudioBufferManager)
