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
Here the schema declares two oscillator parameters: `type` and `frequency`

```js
// `src/server/schemas/player.js`
export default {
  // dummy oscillator params
  type: {
    type: 'enum',
    list: ['sine', 'square', 'sawtooth', 'triangle'],
    default: 'sine',
  },
  frequency: {
    type: 'integer',
    min: 50,
    max: 1000,
    default: 440,
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

## Creating states

Once schemas are register, they can instanciated by any server or clients `stateManager` (_note: internally the `server.stateManager` is a itself client of the shared state system, except for `registerState` method, its API is thus the same as the client side API_).

Typically, creating a state server-side will allow to share a common state to all the clients of the application. While creating a state client side will create a novel instance of the state for every client, simplifying remote control and monitoring.

```js
// or client-side
const state = await server.stateManager.create(schemaName, [defaultValues]);
// or client-side
const state = await client.stateManager.create(schemaName, [defaultValues]);
```
- @param {String} schemaName - name of the schema as given in `registerState`.
- @param {Object} [defaultValues] - optionnal default values to be applied to the created schema.

In the example application the `globals` state is created by the server:
```js
// src/server/index.js (line 62)
const globalsState = await server.stateManager.create('globals');
console.log('globalsState:', globalsState.getValues());
// > globalsState: { master: 0, mute: false }
```

While each player creates its own instance of the `player` schema:
```js
// src/clients/player/PlayerExperience.js (line 22-24)
const playerState = await this.client.stateManager.create('player', {
  frequency: Math.round(50 + Math.random() * 950),
});
console.log('playerState:', playerState.getValues());
// > playerState: {type: "sine", frequency: 513}
```
As we want every client connecting to play a different frequency, we initialize the state with a random value.

## Attaching to states

Any node of the network (client or server) can attach to a state created by another node. 

```js
// or client-side
const state = await server.stateManager.attach(schemaName, [stateId]);
// or client-side
const state = await client.stateManager.attach(schemaName, [stateId]);
```
- @param {String} schemaName - name of the schema as given in `registerState`.
- @param {Object} [stateId] - optionnal id of the state (more on that in the _Observing states_ section).

In our example, we want every player be informed of the current values of the `globalsState` created by the server, the player clients must thus `attach` to this state.

```js
// src/clients/player/PlayerExperience.js (line 22-24)
const globalsState = await this.client.stateManager.attach('globals');
console.log('globalsState:', globalsState.getValues());
// > globalsState: { master: 0, mute: false }
```

Every player client is now attached to the `globals` state created by the server and will be notified if any update occur (more on that in _Subscribing to updates and updating states_).

## Observing states and network

As states can be dynamically created by any node, we need a way to monitor the newly created state in the application (e.g. when a `player` client connect to the application, the `controller` client wants to be notified so it can attach to the newly created state and monitor or control it).

This can be achived using the `observe` method :
```js
// or client-side
server.stateManager.observe(observeCallback);
// or client-side
client.stateManager.observe(observeCallback);
```
- @param {Function} observeCallback - function that will be called for every state already created and everytime a new state is created on the network. It is called with 3 arguments:
  + @param {String} schemaName - name of the registered schema.
  + @param {Integer} stateId - unique id the state on the network.
  + @param {Integer} nodeId - unique id of the node which created the state. (by convention the server's noteId is -1).

In our example, the controller wants to track every `player` states created by `player` clients, to be able to monitor and control them remotely, it thus `observe` and attach to the state when notified:

```js
// src/clients/controller/ControllerExperience (line 23)

// create a list to store the player states
this.playerStates = new Set();

this.client.stateManager.observe(async (schemaName, stateId, nodeId) => {
  console.log('arguments:', schemaName, stateId, nodeId);
  // the callback is called twice, for the global and player states
  // > arguments: 'globals' 0 -1
  // > arguments: 'player' 2 1
  switch(schemaName) {
    case 'player':
      const playerState = await this.client.stateManager.attach(schemaName, stateId);
      console.log('playerState:', playerState.getValues());
      // > playerState: {type: "sine", frequency: 513}

      // logic to do when the state is deleted 
      // (e.g. when the player disconnects)
      playerState.onDetach(() => {
        // clean things
        this.playerStates.delete(playerState);
      });
      // stoare the player state into a list
      this.playerStates.add(playerState);
      break;
  }
});
```

## Updating states and subscribing to updates

Once we have a local instance of state (through `create` or `attach`), we need to be notified of any change that may occur and to be able to change its values.

The `set` method allows for updating the values of a state
```js
state.set(updates);
```
- @param {Object} updates - a key / value object of the paramters to update

In our example, the controller, once attached to a player state will update the `frequency` to a new random value every second (ok that probably does not make a lot of sens...):

```js
// src/clients/controller/ControllerExperience (line 33)
const intervalId = setInterval(() => {
  const frequency = Math.round(50 + Math.random() * 950);
  await playerState.set({ frequency });
});
```

The `subscribe` method allows to be notified when an update occur on the state:
```js
state.subscribe(callback);
```
- @param {Function} callback - Function called when a change occur into the state. It is called with 1 argument:
  + @param {Object} updates - key / value object containing the updated entries of the state.

In our example, the player can `subscribe` to the updates triggered by the controller and react accordingly. The callback is thus called every second (if we ignore the network latency):

```js
// src/clients/controller/ControllerExperience (line 30)
playerState.subscribe(async updates => {
  console.log('updates:', updates);
  // updates: { frequency: 288 }
  // updates: { frequency: 965 }
  // updates: { frequency: 540 }
  // updates: { frequency: 120 }
  // updates: { frequency: 678 }
  // ...
});
```

The same logic could be done with the `globals` state, at the difference that every player client would be notified of the update.








