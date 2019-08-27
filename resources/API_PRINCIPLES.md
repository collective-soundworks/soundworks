# API PRINCIPLES

Process [client] 

requiredProcesses => Promise
ready => Promise (Service only)

// when requiredProcesses resolve
start() {}

// require another Process to be ready before start 
require() {}


// lifetime of a client
initSocket -> init communication (sockets)
serviceManager -> start
  a -> start (requiredStartPromises)
  c -> start
  a -> ready
  b -> start
  c -> ready
  b -> ready
serviceManager -> ready (requiredReadyPromises)
experience -> start

### client init lifecycle

```
await soundworks.init(config); 
  // init client (sockets)

const player = new PlayerExperience(soundworks, config));
soundworks.start().then(() => {;
  // run serviceManager
  // when services ready, resolve Promise
  () => player.start()
});
```

### server init lifecycle

```
await soundworks.init(config, () => {
  // config to sent to the clients
});

// do things
const player = new PlayerExperience();
const controller = new ControllerExperience();

soundworks.start().then(() => {
  player.start();
  controller.start();
});
  // instanciate http-server
  // open routes
  // instanciate web-socket server
  // run serviceManager
  // when services ready, http-server.listen()
  // trigger soundworks.ready()
```

### Misc

```
const soundworks = { 
  (client|server), 
  serviceManager, 
  stateManager, 

  Experience,
  Service,

  await init() {}
  await start() {} // return `ready` Promise
} 
```

```
class MyExperience extends soundworks.Experience {
  constructor() {
    super();

    // client
    this.client = soudnworks.client;
    // server
    this.server = soundworks.server;
    // both
    this.serviceManager = soudnworks.serviceManager;
    this.stateManager = soudnworks.stateManager;
  }

  // called when serviceManager.ready()
  start() {
    // if client-side call connect server-side
  }

  // server only
  async connect(client) {
    // ... 
    // async is needed because `connect` has to be slaved to the 
    // initialization process of the `client`
  }

  async disconnect(client) {
    // ...
  }
}
```


## Services API

```
export default platform(soundworks) {
  this.id = 'platform';

  class Platform extends soundworks.Service {
    constructor(id, client) {
      super(id);
    }

    start() {
      
    }
  }

  return Platform;
}
```




## Idea for mulitple instance (would be very usefull for clients)

```
// client-side
import { Client } from '@soundworks/core/client';

const client = new Client(config);
// > client = { id, uuid, socket, serviceManager, stateManager, clientType };
// connect sockets
await client.init();

const playerExperience = new PlayerExperience(client);
// init required services 
await client.start();

playerExperience.start();
```

```
// server-side
import { Server } from 'soundworks/server';

const server = new Server(config);
// > server = { sockets, serviceManager, stateManager };
// do things
await server.init();

const playerExperience = new PlayerExperience(server, 'player');

await server.start();

playerExperience.start();
```













