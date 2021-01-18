# TODO.md

## Possible concurrency problem

observed w/ with multiple node clients running on the same computer as the server

> cf. notes in @soundworks/plugin-checkin (server)
> cf. also soundworks `SharedState` line 81 (UPDATE_NOTIFICATION), maybe this needs to be async (`Promise.resolve().then(() => this._commit(updates)`)

### client-side

```js
const state = await client.stateManager.create('some-state');

// this is sometime not called, somehow the notification  
// arrives before the `create` promise is resolved
state.subscribe(updates => {
  console.log(updates); 
});
```

### server-side

```js
stateManager.observe(async (schemaName, stateId, nodeId) => {
  const state = await stateManager.attach(schemaName, stateId, nodeId);
  // this does not always trigger the client-side subscribe
  state.set({ a: true });
});
```


