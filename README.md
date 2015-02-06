## [Note on 2015/01/28: The documentation will be ready within the next few days]

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

The `ServerManager` module manages the whole scenario on the server side for all connections coming from a particular namespace.

##### Attributes
 * `topology {ServerTopology}`: the `ServerTopology` from the `constructor`.
 * `setup {ServerSetup}`: the `ServerSetup` from the `constructor`.
 * `performance {ServerPerformance}`: the `ServerPerformance` from the `constructor`.

##### Methods
 * `constructor(namespace {String}, setup {ServerSetup}, performance {ServerPerformance}, topology {ServerTopology})`:
   * `namespace` represents the namespace from which the connections are coming from (*e.g.* `player`, `admin`, `env`).
   * `setup` is the global `ServerSetup` of the scenario.
   * `performance` is the global `ServerPerformance` of the scenario.
   * `topology` is the `Topology` of the scenario.
 * `connect(socket {Socket})`:  method invoked when the socket `socket` connects to the server. It creates the corresponding `Client` object.
 * `ready(socket {Socket}, client {Client})`: method invoked when the client `client` (corresponding to the socket `socket`) finishes its *setup* process.
 * `disconnect(socket {Socket}, client {Client})`: method invoked when the client `client` (corresponding to the socket `socket`) disconnects from the server.

#### ServerManagerPlayers

Extends `ServerManager`. Manages the whole scenario for all the `players`.

#### ServerPerformance

The `ServerPerformance` module manages the all of the *performance* on the server side. This is a base class meant to be extended for each scenario. Each scenario should have a specific `ServerPerformance` module.

##### Attributes
 * `managers {Object}`: contains all the managers of the scenario.

##### Methods
 * `constructor()`: contains everything needed for the creation of the *performance*.
 * `connect(socket {Socket}, player {Player})`: handles the connection of the player `player` in the `performance`.
 * `disconnect(socket {Socket}, player {Player})`: handles the disconnection of the player `player` in the `performance`.

#### ServerSetup

The `ServerSetup`module is a base classe meant to be extended for each setup process that happens in the general `setup` part of the scenario, before the `performance` can start. See `ServerSetupPlacement` or `ServerSetupSync`for examples. See also `ClientSetup` for a complete overview of how setup modules work.

##### Methods
 * `constructor()`: contains everything needed for the initialization of this particular setup process.
 * `connect(socket {Socket}, client {Client})`: does what is needed when the client `client` connects to the server.
 * `disconnect(socket {Socket}, client {Client})`: handles the disconnection of the client `client` from the server.

#### ServerSetupMulti

[TBD]

#### ServerSetupPlacement

[TBD]

#### ServerSetupPlacementAssigned

Extends `ServerSetupPlacement`. The `ServerSetupPlacementAssigned` assigns a place to every incoming `player` connection. Two modes are available: `random` where positions available in the topology are chose at random, and `ascending` where positions in the topology are chosen in ascending order.

##### Attributes
 * `topology {Topology}`: the topology of the scenario, as passed in by the `params` in the `constructor`.
 * `order = 'random|ascending'`: the way of assigning the places, as passed in by the `params` in the `constructor`.
 * `availablePlaces`: array of places available, based on the `topology`.

##### Methods
 * `constructor(params {Object})`:
   * `params {Object}`:
      * `topology {Topology}`: the topology used in the scenario.
      * `order = 'random'|'ascending'`: determines the way the places are assigned.
 * `connect(socket {Socket}, player {Player})`: does what is needed when the client `client` connects to the server.
 * `disconnect(socket {Socket}, player {Player})`: handles the disconnection of the player `player`, *i.e.* releases

#### ServerSetupSync

Extends `ServerSetup`. Manages the synchronization of any connected client with the server.

##### Methods

Inherited. [to complete]

#### ServerTopology

The `ServerTopology` contains all the information about the topology of a scenario. A topology contains a certain number of places that may or may not be associated to a physical location in the venue where the scenario takes place. Places are also labelled, so that the players can find their places.

##### Attributes

 * `labels {Array}`: array of `label {String}]`. Labels allow the players to find their place in the venue (for instance, a label could be the seat number `'C36'`). `labels[i]` corresponds to the label of place `i`.
 * `positions {Array}`: array of `[x {Number}, y {Number}]` normalized between 0 and 1. `positions[i]` corresponds to the position of place `i`.
 * `width {Number}`: total width of the topology (not normalized).
 * `height {Number}`: total height of the topology (not normalized).

##### Methods
 * `constructor()`.
 * `init()`: creates the topology algorithmically.
 * `connect(socket {Socket}, player {Player} = {})`: handles a connection (of the socket `socket` or the player `player`) to the server.
 * `disconnect(socket {Socket}, player {Player} = {})`: handles a disconnection (of the socket `socket` or the player `player`) from the server.
 * `getInfo()`: returns an object with the information about the topology [to be completed].
 * `getMaxPlaces()`: returns the number of places in the topology.
 * `getLabel(place {Number})`: returns the label of the place `place`.

#### ServerTopologyMatrix

[TBD]

#### SocketIoServer

##### Attributes

 * `.server`: the `Node.js` server.
 * `.io`: the `socket.io` server.

##### Methods

 * `.init(app)`: creates the server of the Express application `app`, launches that server, and creates the corresponding `socket.io` server.

### Client side

#### ClientManager

The `ClientManager` module manages the whole scenario on the client side.

##### Attributes
 * `topology = null {ClientTopology}`: the topology of the scenario, as passed in by the `constructor`.
 * `setup {ClientSetup|ClientSetupMulti}`: the *setup* manager of the scenario, as passed in by the `constructor`.
 * `performance {ClientPerformance}`: the performance logic of the scenario, as passed in by the `constructor`.
 * `params = {} {Object}`: the parameters, as passed in by the `constructor`.
   * `display {Boolean}`: if set to `true`, display the `params.welcome` message before anything else starts.
   * `welcome {String}`: welcome message to be displayed.
 * `displayDiv {Element}`: `div`in which the welcome mesage is displayed.

##### Methods
 * `constructor(setup {ClientSetup|ClientSetupMulti}, performance {ClientPerformance}, topology = null {ClientTopology}, params = {} {Object})`: creates an instance of the `ClientManager`(singleton)
 * `start()`: starts the scenario.

#### ClientPerformance

##### Attributes
 * `displayDiv {Element}`: `div`in which the performance gra^hics are displayed

##### Methods
 * `constructor(params = {} {Object})`: sets up the performance, and listens for incoming server messages.
 * `initPlayers(playerList {Array})`: initializes that client with the players already in the performance.
 * `addPlayer(player {Object})`: actions to take when the player `player` connects to the server and joins the performance.
 * `removePlayer(player {Object})`: actions to take when the player `player` disconnects from the server and leaves the performance.
 * `start()`: method called to start the performance.
 * `done()`: method called when the performance is over.

#### ClientPerformanceSoloists
TBD

#### ClientSetup

##### Attributes
 * `displayDiv {Element}`: the `div` in which the information about this setup process are displayed to the user.
 * `ok {Boolean}`: set to `true` when this setup process is done.

##### Methods
 * `constructor(params = {} {Object})`: `params.display = true` would display the `displayDiv`.
 * `start()`: method invoked to start this setup process.
 * `done()`: method invoked to indicate that this setup process is finished.

#### ClientSetupMulti

##### Attributes
 * `setupArray {Array}`: array of all the setups parts involved.
 * `doneCount {Number}`: counter for the number of finished setup components.
 
##### Methods
 * `start()`: starts the global setup process.

#### ClientSetupPlacement

Extends `ClientSetup`.

##### Attributes
 * `super(params)`.
 * `place {Number}`: the place of the player.
 * `label {String}`: the label of the place of the player.

##### Methods
 * Inherited methods.
 * `getPlaceInfo()`: returns an object with the information about the place.

#### ClientSetupPlacementAssigned

Extends `ClientSetupPlacement`.
TODO: explain what it does, when to use it, …

##### Attributes
 * Inherited.

##### Methods
 * Inherited.

#### SyncProcess

##### Attributes
 * `id {Number}`:
 * `interval {Number}`:
 * `count {Number}`:
 * `timeOffsets {Array}`:
 * `travelTimes {Array}`:
 * `avgTimeOffset {Number}`:
 * `avgTimeOffset {Number}`:
 * `avgTimeOffset {Number}`:

##### Methods

#### ClientSetupSync

##### Attributes
 * `super(params)`.
 * `minTravelTimes {Array}`: stores the minimal travel time of each `SyncProcess`.
 * `maxTravelTimes {Array}`: stores the maximal travel time of each `SyncProcess`.
 * `avgTravelTimes {Array}`: stores the average travel time of each `SyncProcess`.
 * `avgTimeOffsets {Array}`: stores the average time offset of each `SyncProcess`.
 * `timeOffset {Number}`: average time offset of the latest `SyncProcess`.

##### Methods
 * Inherited methods.
 * `getLocalTime(serverTime {Number})`: 
 * `getServerTime(localTime = audioContext.currentTime {Number})`: 

#### ClientTopology

##### Attributes
 * 

##### Methods
 * 

#### ClientTopologyGeneric

##### Attributes
 * 

##### Methods
 * 

#### InputModule

##### Attributes
 * 

##### Methods
 * 

#### SocketIoClient

##### Attributes
 * 

##### Methods
 * 

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
