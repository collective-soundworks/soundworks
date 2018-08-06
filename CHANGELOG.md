
## **v2.2.0**

- deprecated AudioStreamManager API
- deprecated ControllerExperience
- updated SyncScheduler using waves-masters

- improved event declaration in views

## **v2.1.0**

require >= 6.4.x on windows (µws requirement)

- views - renamed `view.content` to `view.model`
- **[client]** `platform` - updated algorithm (update template and content in apps)
- **[client]** `BasicSharedController` 
  * text params: renamed gui option `readOnly` to `readonly`
- **[client]** `CanvasView#preRender` callback now receive `canvasWidth` and `canvasHeight` as arguments: `preRender(ctx, dt, canvasWidth, canvasHeight)`
- **[server]** `server.init` now accept only one argument
- **[client]** `auth`: Added `logout` method
- **[client]** `audio-buffer-manager`: Added possiblity of loading a whole directory
- **[client]** `audio-buffer-manager`: Fixed prepending `assetsDomain` on absolute urls
- **[client]** Added `file-system` service
- **[client]** _breaking change_ `serviceManager` now throws an error if a not instanciated service is required after start 
- **[client]** _breaking change_ Renamed `loader` service to `audio-buffer-manager` 
- **[server]** _breaking change_ `config`: Renamed `socketIO` to `websockets` 

### Migrating

```js
// src/server/index.js
soundworks.server.setClientConfigDefinition((clientType, config, httpRequest) => {
  return {
    clientType: clientType,
    env: config.env,
    appName: config.appName,
    // socketIO: config.socketIO,
    websockets: config.websockets,
    version: config.version,
    defaultType: config.defaultClient,
    assetsDomain: config.assetsDomain,
  };
});
```

## **v1.1.1**

- Moved configuration, templates and default contents from soundworks to application template

### Migrating from v1.1.0 to v1.1.1

_**build**_
- replace `bin/runner` file

_**client**_
- copy `src/client/shared/` folder
- update `src/client/**/index.js`

```js
// src/client/*/index.js
import viewTemplates from '../shared/viewTemplates';
import viewContent from '../shared/viewContent';

// ...
const config = window.soundworksConfig;
soundworks.client.init(config.clientType, config);
soundworks.client.setViewContentDefinitions(viewContent);
soundworks.client.setViewTemplateDefinitions(viewTemplates);
```

- Renderer.js

`CanvasContext.width` and `CanvasContext.height` don't exists anymore, replace with `Renderer.canvasWidth` and `Renderer.canvasHeight`

- sass

replace  `_04-controller.scss` with `_04-basic-shared-controller.scss` 
replace `main.scss`

_**server**_
- copy config file `src/server/config/default.js`
- update with application configuration
- delete old `./config` folder
- update `src/server/index.js`

```js
// src/server/index.js
import defaultConfig from './config/default';

let config = null;

switch(process.env.ENV) {
  default:
    config = defaultConfig;
    break;
}

// configure express environment ('production' enables cache systems)
process.env.NODE_ENV = config.env;
```

## **v1.1.0**

- Added `server.setClientConfigDefinition` method to pass arbitrary configuration items to the `ejs` template

### Migrating to v1.1.0

```js
// src/server/index.js
// define the configuration object to be passed to the `.ejs` template
soundworks.server.setClientConfigDefinition((clientType, config, httpRequest) => {
  return {
    clientType: clientType,
    env: config.env,
    appName: config.appName,
    socketIO: config.socketIO,
    version: config.version,
    defaultType: config.defaultClient,
    assetsDomain: config.assetsDomain,
  };
});

```
