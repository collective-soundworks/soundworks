
// server
const stateManager = new StateManager();

const schema = {
  master: {
    type: 'interger',
    min: -80,
    max: 6,
    metas: {
      label: 'dB'
    }
  },
}

/**
 * @param {String} schemaName
 */
stateManager.registerSchema('playerShared');
stateManager.registerSchema('playerLocal');
stateManager.registerSchema('global');

const clients = new Map();
// really ? need to implement something to be sure
const store = {
  init(stateManager) {
    const globals = stateManager.create('globals');

    globals.subscribe(updates => {
      for (let name in updates) {
        switch (name) {
          // ...
        }
      };

      // time travelling?...
      persists(globals.toJSON(), timetag);
    });

    stateManager.observe((schemaName, stateId) => {
      switch (client.type) {
        case 'player':
          state.subscribe(updates => {
            for (let name in updates) {
              switch (name) {
                // ...
              }
            }
          });
          break;

        case 'controller':
          state.subscribe(updates => {
            for (let name in updates) {
              switch (name) {
                // ...
              }
            }
          });
          break;
      }
    });

  },
};



// const clientShared = stateManager.get(client, 'clientShared')

// clientShared.subscribe(() => {
//   // ...
// });

// -----------------------------------------------
// client
// -----------------------------------------------
const stateManager = new StateManager(client);
// create self store
const sharedState = await stateManager.create('clientShared');
const localState = await stateManager.create('clientLocal', synced = false);

const globalState = await stateManager.attach(schemaName = 'global');
// attach store related to peer client

const peerStates = new Map();


const peerList = await stateManager.getPeers();

peerList.forEach(peerId => {
  const peerState = await stateManager.attach(schemaName = 'clientShared', peerId);

  peerState.subscribe(() => {
    // update
  });

  peerState.set({ /*  ... */ });
});

stateManager.onCreate((schemaName, peerId) => {
  const peerState = await stateManager.attach(schemaName = 'clientShared', peerId);
  peerState.set({ /*  ... */ });
});

stateManager.onDelete((schemaName, peerId) => {
  const peerState = await stateManager.attach(schemaName = 'clientShared', peerId);
  peerState.set({ /*  ... */ });
});

// synced store
store.getSchema([name=null]); // => return config object to generate stuff (reflection)

// updates
const updates = await store.set({ name: value });
// multiple updates at once
const updates = await store.set({
  param1: value,
  param2: value,
}); //

// if owner is server
  // request (server updates the values)  - name, value, storeId, requestId
  // response (value as updated by the server)
  // propagate to application

// if owner is client
  // commit
  // optionnaly propagate notification to the server (silent by default)
  // e.g. `store.set({ name, value }, notify = true);`

//
store.get(name); // retrieve a parameter by its name
store.getValues(); // retrieve all parameters

store.subscribe(...updates => {
  for (let name in updates) {
    switch (name) {
      case 'trigger':
        // trigger stuff
        break;
      // case ''
    }
  }

  // the view system will do the diffing itself
  updateView(store.getValues());
});

store.detach();



