# API PRINCIPLES

Process [client] 

requiredProcesses => Promise
ready => Promise (Service only)

// when requiredProcesses resolve
start() {}

// require another Process to be ready before start 
require() {}


// lifetime of a client
soundworks -> init
  - init sockets

soundworks -> start
serviceManager -> start
  a -> start
  c -> start
  a -> ready
  b -> start
  c -> ready
  b -> ready
serviceManager -> ready
experience -> start

### client init lifecycle

```
soundworks.registerService('my-service', MyServiceFactory, options = {});

// init soundworks client 
// mainly connect both web-sockets (string and binary))
await soundworks.init(config); 

// instanciate the experiences
const player = new PlayerExperience(soundworks, config));

// initialize all services
await soundworks.start();
// everything is ready, experience can start safely
player.start();
```

### server init lifecycle

```
// register services needed for the application
soundworks.registerService('my-service', MyServiceFactory, options = {});

await soundworks.init(config, () => {
  // config to sent to the clients
});

// instanciate the experiences
const player = new PlayerExperience(soundworks, 'player');
const controller = new ControllerExperience(soundworks, 'controller');

// instanciate http-server
// open routes
// instanciate web-socket server
// run serviceManager
// when services ready, http-server.listen()
await soundworks.start();
// everything is ready, we can start the clients
player.start();
controller.start();
```

### Misc


```
class MyExperience extends soundworks.Experience {
  constructor(soundworks) {
    super();

    // client
    this.client = soudnworks.client; // ?
    // server
    this.server = soundworks.server; // ?
    // both
    this.serviceManager = soudnworks.serviceManager;
    this.stateManager = soudnworks.stateManager;
  }

  // called when serviceManager.ready()
  start() {
    // if client-side call connect server-side
  }

  // server only
  enter(client) {
    // client enter the experience when it has gone through 
    // all services' initialization process (client-side and server-side)
  }

  exit(client) {
    // called when a user disconnect from the page, is called before 
    // services disconnect method
  }
}
```


## Services API

```
export default platform(soundworks) {
  <!-- this.id = 'platform'; -->

  class Platform extends soundworks.Service {
    constructor(name, soundworks) {
      super(soundworks);

      this.name = name;
    }

    async start() {
      await doStuff();

      // notify manager that the service is ready
      this.ready(); 
    }

    // server only
    connect(client) {

    }

    disconnect(client) {

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
import { Server } from 'soundworks/core/server';

const server = new Server(config);
// > server = { sockets, serviceManager, stateManager };
// do things
await server.init();

const playerExperience = new PlayerExperience(server, 'player');

await server.start();

playerExperience.start();
```


## Clean components API after instanciation

```
import { 
  SoundworksClient, 
  Experience, 
  Service 
} from '@soundworks/core/client';

client {SoundworksClient} {
  id {Number},
  uuid {String},
  clientType {String},
  socket {Socket},
  serviceManager {ServiceManager},
  stateManager {StateManagerClient},

  async init(config) {Function}
  async start() {Function}
  registerService(name, factory, options, dependencies);
}
```

```
import { 
  SoundworksServer, 
  Experience, 
  Service 
} from '@soundworks/core/server';

server {SoundworksServer} {
  // external dependencies
  router {Polka}
  httpServer {node http(s)Server}
  db {Cache}  
    // use keyv - Map API - front-end for multiple storage solutions
    // https://github.com/lukechilds/keyv ()
    // default storage: https://github.com/zaaack/keyv-file
  
  // sounworks specific
  config {Object}
  sockets {Sockets}
  serviceManager {ServiceManager}
  stateManager {StateManagerServer}
  
  async init(config) {Function}
  async start() {Function}
  registerService(name, factory, options, dependencies);
}
```










