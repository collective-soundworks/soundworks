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

### Scenario = setup + performance

Both on the client and server sides, a scenario is divided into two major parts: the *setup* and the *performance*.

For each client, the *setup* part consists in exchanging any information between the server and that client required to enter the performance. For instance:
 * A `player` may have to send its physical location to the server (so that the server knows where this `player`is located compared to the other `players`), and to calibrate its compass;
 * If the scenario is based on a common beat shared across the devices, all the clients (`player`, `admin`, `env`) would have to synchronize their clocks.



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
