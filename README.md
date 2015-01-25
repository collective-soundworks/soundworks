# Soundworks

*Soundworks* is a Javascript framework that enables artists and developers to create collaborative music performances where a group of participants distributed in space use their smartphones to generate sound and light through touch and motion.

We made the framework modular to make it easy to implement different performance scenarios, using a server / client architecture supported by `Node.js` and `socket.io`: the boilerplate we provide allows anyone to bootstrap a scenario for *Soundworks* and focus on its audiovisual and interaction design instead of the infrastructure.

## Architecture overview

### Server / client architecture 

In order to connect the smartphones with each other, we implemented a client-server architecture using a `Node.js` server and the `socket.io` library to pass messages between the server and the clients.

The word “client” represents any entity that connects to the server. For instance, this can be:

 * The smartphones of the players who takes part in the collaborative performance (we would refer to this type of client as a `player`);
 * A laptop that provides an interface for the artist to control some parameters of the performance in real time (we would refer to this type of client as `admin`);
 * A computer that controls the sound and light effects in the room in sync with the players' performance, such as lasers, a global visualization or ambient sounds on external loudspeakers (we would refer to this type of client as `env`, standing for “environment”).

### Scenario = (topology +) setup + performance

Both on the client and server sides, a scenario is associated with a topology (*i.e.* the physical location of available places for the players during the performance, if any) and is divided into two major parts: the *setup* and the *performance*.

For each client, the *setup* part consists in exchanging any information between the server and that client required to enter the performance. For instance:
 * A `player` may have to send its physical location to the server (so that the server knows where this `player`is located compared to the other `players`), and to calibrate its compass;
 * If the scenario is based on a common beat shared across the devices, all the clients (`player`, `admin`, `env`) would have to synchronize their clocks.

Once the client and the server have all the information they need to have that client participate to the actual performance, the client enters the *performance* part.

## Classes documentation

We present here the main classes used in the *Soundworks* library, with their most useful pulic methods and attributes.

### Server side

#### Client

Object used to keep track of any client that connects to the server.

##### Attributes

 * `socket {Object}`: socket of the client as assigned by `socket.io`.
 * `pingLatency {number}`: average time it takes for a `socket.io` message to travel between the server and the client, as calculated by the `syncProcess` in the `SetupSync` server and client modules.

##### Methods

 * `getInfo()`: returns an object with the attributes of the `client`.

#### Player

Extends `Client`. Object used to keep track of a `player` (and it's data) that connects to the server.

##### Attributes

 * `socket {Object}`: socket of the client as assigned by `socket.io`.
 * `pingLatency {Number}`: average time it takes for a `socket.io` message to travel between the server and the client, as calculated by the `syncProcess` in the `SetupSync` server and client modules.
 * `place {Number}`: the position of that `player` as defined in the `ServerTopology`
 * `privateState {Object}`: any information the server may need to know during the *setup* or the *performance*.
 * `publicState {Object}`: any information the clients may need to know during the *setup* or the *performance*.

##### Methods

 * `getInfo()`: returns an object with the following attributes of the `player`: `socketId`, `place`, `state` (public).

#### ServerManager

#### ServerPerformance

#### ServerPlayerManager

#### ServerSetup

#### ServerSetupMulti

#### ServerSetupPlacement

#### ServerSetupPlacementAssigned

#### ServerSetupSync

#### ServerTopology

#### ServerTopologyMatrix

#### SocketIoServer

##### Attributes

 * `.server`: the `Node.js` server.
 * `.io`: the `socket.io` server.

##### Methods

 * `.init(app)`: creates the server of the Express application `app`, launches that server, and creates the corresponding `socket.io` server.

### Client side

#### ClientManager

#### ClientPerformance

#### ClientPerformanceSoloists

#### ClientSetup

#### ClientSetupMulti

#### ClientSetupPlacement

#### ClientSetupPlacementAssigned

#### ClientSetupSync

#### ClientTopology

#### ClientTopologyGeneric

#### InputModule

#### SocketIoClient

## Example

```javascript
// init socket io server
serverSide.ioServer.init(app);

// start server side
var topology = new serverSide.TopologyMatrix({cols: 3, rows: 2});
var sync = new serverSide.SetupSync({iterations: 10});
var placement = new serverSide.SetupPlacementAssigned({topology: topology, order: 'random'});
var performance = new ServerPerformance(topology);
var manager = new serverSide.ManagerPlayers([sync, placement], performance, topology);

if (topology)
  topology.init();
```
