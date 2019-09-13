# `StateManager` API

### stateManager.create(schemaName, synced = true) => Promise(State)

Create a synced `my-state` state where `owner` is the server and `creator` is the client

```
const state = await stateManager.create('my-schema');
```

Create a local `my-state` state where `owner` and `creator` are owner 
@important - the state is purely local then no other node can attach to it

```
const state = await stateManager.create('my-schema', false);
```

### stateManager.attach(schemaName, nodeId = SERVER_ID) => Promise(State) 

Attach to a state created by another client

```
const state = await stateManager.attach('my-schema', clientId);
```

_client-side only_: attach to a state created by the server

```
const state = await stateManager.attach('my-schema');
```

### stateManager.observe(listener: Function) => void

Observe the creation of new states, the callback is called a first time with a list of all already created states, and then each time a new state is created.

```
// @note - unroll first set in the stateManager itself
stateManager.observe((schemaName, nodeId) => {
    // the node is interested in 'whatever' schemaName
    if (schemaName === 'whatever') {
      const state = await stateManager.attach(schemaName, nodeId);
      // do things with `state`
    }
  }
});
```

## Client Only API

### StateManager.constructor(client);

## Server Only API

@note: by convention the server has the `nodeId === -1`

### StateManager.constructor();

### stateManager.registerSchema(schemaName, definitions);

### stateManager.addClient(nodeId);


<!--
@note: to make the abstraction completely generic and extract it from soundworks, the API should be `stateManager.addClient(clientId, transport = { send, addListener })`
-->

### stateManager.removeClient(nodeId)



<!--
@note: to make the abstraction completely generic and extract it from soundworks, the API should be `stateManager.removeClient(clientId)`
-->

# `State` API

A state cannot be instanciated manually, its always created using the `StateManager` factory methods `create` or `attach`.

### state.getSchema() => Object

Returns the schema of the state as registered in the server.

```
const schema = state.getSchema();
```

### async state.set(updates: Object) => Promise(newValues)

Update state with new values. Given values may be ignored or sanitized according to the definition of the parameter.

```
// given the schema
//  {
//    myInt: {
//      type: 'integer',
//      min: 0,
//      max: 10,
//    }
//  }
const updated = await state.set({ myInt: -4 })
// updated.myInt === 0
```

### state.get(name: String) => Mixed

Return the current value of the `name` state entry.

### state.getValues() => Object

Return the current values of the state as flat <key, value> object

### state.subscribe(listener: Function) => Function

Subscribe to modifications of the state. Return a function that allow to unsubscribe the listener.

```
const unsubscribe = state.subscribe(updates => {
  for (let key in updates) {
    switch (key) {
      // ...
    }
  }

  doSomethingWithAll(state.getValues());
});

// ...later
unsubscribe();
```

### state.detach() => Promise

Detach from the state:
- If the node is the creator of the state, then the state is destroyed and all other attached nodes will be detached. 
- If the node is not the creator of the state, the node stops receiving new updates about the state.

Calling detach immediatly removes all listeners subscribed to the state, then requests the server (owner of the state) for detaching. Calls the `onDetach` listeners when acknoledgement is received from the server.

```
state.detach();
```

### state.onDetach(callback: Function) => void

```
state.onDetach(() => {
  // clean everything related to the state
});
```

