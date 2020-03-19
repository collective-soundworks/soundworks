# `shared-state` example

This example show basic usage of the shared state component (the `stateManager`).

This component is dedicated at simplifying development of application by abstracting a large part of network code and routing, and simplify the implement of remote control and monitoring.

## Declaring schemas

The shared-state component makes use of schemas that declare a set of attributes and their properties (you can think of it has the schema of a database table). The schema syntax follows the format described in [https://github.com/ircam-jstools/parameters](https://github.com/ircam-jstools/parameters).

In this application two schemas are declared (cf. `src/server/schemas/`, note that the `schema` directory is not mandatory but looks like a good practice to keep thing clean).

- the `globals` schema (cf. `src/server/schemas/globals.js`) is ment at declaring a state that will be created by the server, and will thus be unique across the whole application. Every client will be able to attach to the created state, but we garantee that this state will be kept indentical accross all of the clients.
Here, the schema declare a global `master` volume and a `mute` flag.

```js
// `src/server/schemas/globals.js`
export default {
  // master volume in dB [-60, 6]
  master: {
    type: 'integer',
    min: -60,
    max: 6,
    step: 1,
    default: 0,
  },
  // mute [true, false]
  mute: {
    type: 'boolean',
    default: false,
  },
};
```

- the `player` schema is dedicated at describing the state of a single player client, maening that each player will instanciate its own instance of the schema. Other clients (typically a controller) can attach to the player's state to monitor and remotely control the client.
Here the schema declares two (dummy) parameters: `param1` and `param2`

```js
// `src/server/schemas/player.js`
export default {
  // dummy params
  param1: {
    type: 'integer',
    min: -60,
    max: 6,
    step: 1,
    default: 0,
  },
  param2: {
    type: 'float',
    min: -1,
    max: 1,
    step: 0.001,
    default: 0.3,
  }
}
```

## Registering schemas

Once the schemas have been declared, we must register them server-side into the soundworks' `stateManager`. Indeed, the server kepts a local instance of every state created in the application and acts as the only source of ground truth.

A good practice is to do that after the server initialization (`await server.init(...)`, so that the state manager is ready to be used, but before the server start (`await server.start()`), so that we accept client connections when everything is properly configured.

In order to register the schemas, you have to follow the two following steps:

1. import the files where the schemas are declared:
```js
// src/server/index.js (line 15-16)
import globalsSchema from './schemas/globals';
import playerSchema from './schemas/player';
```

2. register the schema to the `stateManager`:

`server.stateManager.registerState(name, schema)`
  - @param {String} name - Name for the schema in the application (while it doesn't have to match the filename where the schema is declared, it's probably a good practice to keep things clean).
  - @param {Object} schema - Schema declaration

```js
// src/server/index.js (line 59-60)
server.stateManager.registerSchema('globals', globalsSchema);
server.stateManager.registerSchema('player', playerSchema);
```

## Registering schemas
 params





