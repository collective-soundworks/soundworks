## API

This section explains how to use the objects and classes of the library. In particular, we list here all the methods and attributes you may need to use at some point while implementing a scenario.

We start with the [core objects](#core-objects):
- [`client`](#client-side-the-client-object) (client side)
- [`server`](#server-side-the-server-object) (server side)

Then we review the [basic/base module classes](#basicbase-classes):
- [`ServerClient`](#the-serverclient-class)
- [`Module`](#the-module-base-class) (base class)
- [`Performance`](#the-performance-base-class) (base class)

Finally, we focus on the modules implemented in the library. Some modules are only present on the [client side](#client-only-modules):
- [`Dialog`](#clientdialog)
- [`Loader`](#clientloader)
- [`Orientation`](#clientorientation)
- [`Platform`](#clientplatform)

Others require both the [client **and** server sides](#client-and-server-modules):
- [`Checkin`](#checkin)
- [`Control`](#control)
- [`Setup`](#setup)
- [`Sync`](#sync)

Some modules on the client side are associated with dedicated styling information. When that is the case, we added in the [`soundworks-template`](https://github.com/collective-soundworks/soundworks-template)’s [`src/sass/`](https://github.com/collective-soundworks/soundworks-template/tree/master/src/sass) folder the corresponding `_77-moduleName.scss` SASS partial. Don't forget to include them in your `*.scss` files when you write your scenario (for more information, cf. the [Styling with SASS](#styling-with-sass) section). We indicate in the module descriptions below which of them require custom SASS partials.

### Core objects

The core objects on the client side and the server side are singletons that contain the methods used to set up a scenario and to exchange messages between the client and the server.

### Basic/base classes

#### The `Module` base class

The `Module` server and client classes are the base classes that any *Soundworks* module should extend. These base classes define interfaces to be implemented by the derived modules, and provide a set of attributes and methods that facilitate the implementation of modules.

### Client/server modules

#### Checkin

##### ClientCheckin

Below is an example of an instantiation of the `ClientCheckin` module that displays the dialog on the client side.

```javascript
/* Client side */

// Require the Soundworks library (client side)
var clientSide = require('soundworks/client');

// Instantiate the module
var checkin = new clientSide.Checkin({ select: 'automatic', order: 'random' });
```

##### ServerCheckin

Below is an example of the instantiation of the `ServerCheckin` module on the server side.

```javascript
/* Server side */

// Require the Soundworks library (server side)
var serverSide = require('soundworks/server');

// Case 1: the scenario has a predefined setup
var setup = new serverSide.Setup();
setup.generate('matrix', { cols: 3, rows: 4 }).
var checkin = new serverSide.Checkin({ setup: setup });

// Case 2: the scenario does not have a predefined setup, but specifies a maximum number of clients
var checkin = new serverSide.Checkin({ maxClients: 500 });
```

#### Setup

##### ClientSetup

###### Methods

- `addClassToPosition(setupDisplay:Element, index: Number, className:String = 'player')`  
  The `addClassToPosition` method adds the class `className` to the position `index` in the `setupDisplay` DOM element (this graphical representation of the setup had to be created with the `display` method).
- `removeClassFromPosition(setupDisplay:Element, index: Number, className:String = 'player')`  
  The `removeClassFromPosition` method removes the class `className` from the position `index` in the `setupDisplay` DOM element (this graphical representation of the setup had to be created with the `display` method).

Below is an example of the `ClientSetup` module in use.

```javascript
/* Client side */

// Require the Soundworks library (client side)
var clientSide = require('soundworks/client');

// Instantiate the module
var setup = new clientSide.Setup();

// Display a graphical representation of the setup in a `div` of the DOM
var setupGUI = document.getElementById('setup-container');
setup.display(setupGUI);

// Add the class 'red-highlight' to position #3 in this graphical representation
setup.addClassToPosition(setupGUI, 3, 'red-highlight');
```

##### ServerSetup

###### Methods

- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `name:String`, `name` of the module.
- `generate(type:String = 'matrix', params = {})`  
  The `generate` method generates a surface and/or predefined positions according to a given type of geometry `type` and the corresponding parameters `params`. The following geometries are available:
    - `'matrix'`, a matrix setup with the following parameters (in the `params` object):
      - `cols = 3`, number of columns;
      - `rows = 4`, number of rows;
      - `colSpacing = 1`, spacing between columns;
      - `rowSpacing = 1`, spacing between rows;
      - `colMargin = colSpacing / 2`, (horizontal) margins between the borders of the performance space and the first or last column;
      - `rowMargin = rowSpacing / 2`, (vertical) margins between the borders of the performance space and the first or last row.
- `getNumPositions() : Number`  
  The `getNumPositions` method returns the total number of predefined positions and/or labels of the setup. For instance, if the setup is a 4 ⨉ 5 matrix the method would return 20.
- `getLabel(index:Number) : String`  
  The `getLabel` method returns a `String` corresponding to the label associated with the predefined position of the setup whose index is `index`.
- `getCoordinates(index:Number) : Array`  
  The `getCoordinates` returns an array with the coordinates of the predefined position of the setup whose index is `index`.

Below is an example of the instantiation of the `ServerSetup` module on the server side.

```javascript
/* Server side */

// Require the Soundworks library (server side)
var serverSide = require('soundworks/server');

// Creating a matrix setup with 4 columns and 5 rows
var setup = new serverSide.Setup();
setup.generate('matrix', { cols: 4, rows: 5 });
```

#### Sync

The `Sync` module is based on [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync) and is responsible for synchronizing the clients’ clocks and the server clock on a common clock called *sync clock*. Both the clients and the server can use this shared clock as a common time reference. For instance, this allows all the clients to do something exactly at the same time, such as blinking the screen or playing a sound in a synchronized manner.

The `Sync` module does a first synchronization process after which the `ClientSync` calls its `done` method. Afterwards, the `Sync` module keeps running in the background for the rest of the scenario to resynchronize the client and server clocks regularly, to compensate for clock drifts.

On the client side, `ClientSync` uses the `audioContext` clock. On the server side, `ServerSync` uses the `process.hrtime()` clock. All times are in seconds (method arguments and returned values). **All time calculations and exchanges should be expressed in the sync clock time.**

##### ClientSync
++
The `ClientSync` module extends the `ClientModule` base class and takes care of the synchronization process on the client side. It displays a view that indicates "Clock syncing, stand by…" until the very first synchronization process is done. The `ClientSync` module calls its `done` method as soon as the client clock is in sync with the sync clock. Then, the synchronization process keeps running in the background to resynchronize the clocks from times to times. When such a resynchronization happens, the `ClientSync` module emits a `'sync:stats'` event associated with information about the synchronization.

###### Methods
++
- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `name:String = 'sync'`, `name` of the module;
  - `color:String = 'black'`, `viewColor` of the module.
- `getLocalTime(syncTime:Number) : Number`  
  The `getLocalTime` method returns the time of the local (client) clock (in seconds) corresponding to the given sync time. If no arguments are provided, the method returns the current local (client) time (*i.e.* using `audioContext.currentTime`).
- `getSyncTime(localTime:Number = audioContext.currentTime) : Number`  
  The `getSyncTime` method returns the time of the sync clock (in seconds) corresponding to the given local (client) time. If no arguments are provided, the method returns the current sync time.
++
Below is an example of an instantiation of the `Sync` module on the client side.
++
```javascript
/* Client side */

// Require the Soundworks library (client side)
var clientSide = require('soundworks/client');

// Create Sync module
var sync = new clientSide.Sync();

// Get times
var nowClient = sync.getLocalTime(); // current time in client clock time
var nowSync = sync.getSyncTime(); // current time in sync clock time
```

###### Events

- `'sync:stats' : stats:Object`  
  The `ClientSync` module emits the `'sync:stats'` event each time it resynchronizes the local clock on the sync clock. In particular, the first time this event is fired indicates that the clock has been synchronized with the sync clock (*i.e.* we have a first estimation of the clock synchronization) and the `done` method is called. The `'sync:stats'` event has a single object argument with the following properties:
  - `timeOffset`, current estimation of the time offset between the client clock and the sync clock;
  - `travelTime`, current estimation of the travel time for a message to go from the client to the server and back;
  - `travelTimeMax`, current estimation of the maximum travel time for a message to go from the client to the server and back.

##### ServerSync
++
The `ServerSync` module extends the `ServerModule` base class and takes care of the synchronization process on the server side.

###### Methods
++
- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `name:String`, `name` of the module.
- `getSyncTime() : Number`  
  The `getSyncTime` method returns the current sync time (in seconds, derived from `process.hrtime` method).
++
Below is an example of the instantiation of the `Sync` module on the server side.
++
```javascript
/* Server side */

// Require the Soundworks library (server side)
var serverSide = require('soundworks/server');

// Create Sync module
var sync = new serverSide.Sync();

// Get sync time
var nowSync = sync.getSyncTime(); // current time in the sync clock time
```
