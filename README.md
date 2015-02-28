# SOUNDWORKS

## Table of contents

- [**Overview & how to get started**](#overview--how-to-get-started)
  - [Server / client architecture](#server--client-architecture)
  - [A *Soundworks* scenario is exclusively made of modules](#a-soundworks-scenario-is-exclusively-made-of-modules)
  - [How to write a module?](#how-to-write-a-module)
  - [How to write a scenario?](#how-to-write-a-scenario)
- [**API**](#api)
  - [Client only modules](#client-only-modules)
    - [ClientDialog](#clientdialog)
    - [ClientLoader](#clientloader)
    - [ClientOrientation](#clientorientation)
  - [Server only modules](#slient-only-modules)
    - [ServerClient](#serverclient)
  - [Client and server modules](#client-and-server-modules)
    - [Checkin](#checkin)
    - [Sync](#sync)
    - [Seatmap](#seatmap)
- [**Examples**](#examples)

## Overview & how to get started

*Soundworks* is a Javascript framework that enables artists and developers to create collaborative music performances where a group of participants distributed in space use their smartphones to generate sound and light through touch and motion.

The framework is based on a server / client architecture supported by `Node.js` and WebSockets, and uses modules to make it easy to implement different performance scenarios: the provided template allows anyone to bootstrap a *Soundworks*-based scenario and focus on its audiovisual and interaction design instead of the infrastructure.

### Server / client architecture 

In order to connect the smartphones with each other, *Soundworks* implements a server / client architecture using a `Node.js` server and WebSockets to pass messages between the server and the clients (currently with the `socket.io` library).

The word “client” represents any entity that connects to the server. For instance, this can be:

- The smartphone of a player who takes part in the collaborative performance (we would refer to this type of client as a `player`: these clients connect to the server through the root URL `http://your-url:port/`);
- A laptop that provides an interface for the artist to control some parameters of the performance in real time (we would refer to this type of client as `conductor`; these clients would connect to the server through the URL `http://your-url:port/conductor`);
- A computer that controls the sound and light effects in the room in sync with the players' performance, such as lasers, a global visualization or ambient sounds on external loudspeakers (we would refer to this type of client as `env`, standing for “environment”; these clients would connect to the server through the URL `http://your-url:port/env`);
- And so on…

### A *Soundworks* scenario is exclusively made of modules

A scenario built with *Soundworks* consists in a succession and combination of modules, each of them corresponding to one step of the scenario. Each module has a `.start()` and a `.done()` method: we launch the process corresponding to that module by calling the method `.start()`, and we call the method `.done()` when the duty of the module is done.

As an example, let's say that a scenario works as follows when a `player` connects to the server (through the URL `http://your-url:port/`):

- The player gets a `welcome` message (*e.g.* “Welcome to the performance!”). When the player clicks on the screen…
- … the player receives some `checkin` instructions while in the meantime, the smartphone has to `sync` its clock with the server. Finally, when these are done…
- … the player joins the `performance`.

Each of these steps corresponds to a module. Thus, on the client side, this scenario would be implemented as follows.

```javascript
/* Client side */

// Load the library
var clientSide = require('soundworks/client');

// Initialize the modules (the methods' arguments are explained in the documentation)
var welcome = new clientSide.Dialog(...);
var sync = new clientSide.Sync(...);
var checkin = new clientSide.Checkin(...);
var performance = new Performance(...); // This class has to be written by you

// Launch the scenario!
client.start(
  client.serial(
    welcome,
    client.parallel(
      checkin,
      sync
    ),
    performance
  )
);
```

To run a sequence of modules in serial, we use `client.serial(module1, module2, ...)`. A module would `.start()` only after the previous one is `.done()`.

On the other hand, if some modules need to be run in parallel, we use `client.parallel(module1, module2, ...)`. The parallel process triggers a global `.done()` method when all of its modules are `.done()`. If the modules have a `view` (*i.e.* if they display some information on the screen), the `view` of a module is created in the DOM when the `.start()` method is called, and is removed from the DOM when the `.done()` method is called. The `view` of a module is always full screen, so in the case of modules run in parallel, the views are stacked on top of each other (using the `z-index` CSS property) in the order of the modules (`module1` is on top of `module2` which is on top of `module3`, etc.). For instance, say `module3` triggers its `.done()` method before `module2`: its `view` would be removed before the one of `module2`, so the user would never see the `view` of `module3` (the full screen views would directly pass from `module2` to `module4`).

Some of these modules need an interaction with the server (for instance, the `sync` process requires a dialog between the server and the client to synchronize the clocks). Thus, we activate all the modules that each `player` will need to talk to thanks to the `server.map()` method: on the server side, we would write the following code.

```javascript
/* Server side */

// Load the libraries and setup the Express app
var serverSide = require('soundworks/server');
var server = serverSide.server;
var express = require('express');
var app = express();

// Initialize the modules (the methods' arguments are explained in the documentation)
var sync = new serverSide.Sync(...);
var checkin = new serverSide.Checkin(...);
var performance = new Performance(...); // This class has to be written by you

// Launch the server
server.start(app);
// Map the `/player` namespace with the modules needed by the client side
server.map('/player', 'My Scenario', sync, checkin, performance);
```

That way, the `sync`, `checkin` and `performance` modules of a `player` (who connects to the server via the URL `http://your-url:port/` which maps to the namespace `'/player'`, more information on that below) would be able to dialog with the corresponding modules on the server side.

### How to write a module?

#### Client side

On the client side, a module extends the `ClientModule` base class and must have a method `.start()` and a method `.done()`. **A module should call the method `.done()` when the whole process of the module is completed.**

For instance, if the purpose of the module is to load files, the module should call the method `.done()` when the files are loaded. Similarly, if the purpose of the module is to synchronize the clocks, the module should call the method `.done()` when the clocks are synced.

##### .start()

The `.start()` method is called to start the module. It should handle the logic and the steps that lead to the completion of the module.

For instance, the purpose of the `ClientSeatmap` module is to get the seatmap from the server. Therefore, the `.start()` method of the `ClientSeatmap` module does the following:

- It sends a request to the `ServerSeatmap` module via WebSockets, asking the server to send the `seatmap` object.
- When it receives the response from the server with the `seatmap` object, it stores the `seatmap` as an attribute.
- Finally, since the module has done its duty, it calls the method `.done()`.

In Javascript, it looks like the following.

```javascript
class ClientSeatmap extends ClientModule {
  ...

  start() {
    super.start(); // Don't forget this line!

    socket.emit('seatmap_request'); // Request the seatmap to the server
    
    socket.on('seatmap_init', (seatmap) => {
      this.seatmap = seatmap; // Stores the response in an attribute
      this.done(); // Call the method .done(), since the purpose of the module is met
    });
  }

  ...
}
```

This method must include the inherited method from the base class before any code you write (`super.start()`).

##### .done()

The `.done()` method should rarely change from the method inherited from the base class. If you have to rewrite it though, **don't forget to include the inherited method of the base class**. (Its purpose is to emit a `'done'` event associated with the module, which makes the whole module logic work.)

Put differently, if you customize the `.done()` method, it must look like the following template.

```javascript
clientSide = require(soundworks/client);

class MyModule extends clientSide.Module {
...

  done() {
    ... // any code you want

    super.done(); // Don't forget this line!
  }

...
}
```

#### Server side

On the server side, a module extends the `ServerModule` base class and must have a method `.connect(client:ServerClient)` and `.disconnect(client:ServerClient)`.

##### .connect(client:ServerClient)

The `.connect(client)` is called whenever the client `client` connects to the server. I should set up the listeners of the WebSocket messages sent after the `.start()` method on the client side is started, and handle the logic of the module.

For instance, say that the module you are writing needs to keep track of all the connected clients. Then you could write the following.

```javascript
connect(client) {
  this.clients.push(clients);

  ... // the rest of the method
}
```

##### .disconnect(client:ServerClient)

Similarly, the `.disconnect(client)` is called whenever the client `client` disconnects from the server. It handles all the actions that are necessary in that case.

In our previous example, where the module keeps track of the connected clients, we would then write the following, where the function `removeFromArray(a, el)` removes the element `el` from the array `a`.

```javascript
disconnect(client) {
  removeFromArray(this.clients, client);

  ... // the rest of the method
}
```

### How to write a scenario?

Since *Soundworks* is built on Express, any scenario you write using *Soundworks* should follow the organization of an Express app (using the EJS rendering engine), as shown in the example below.

```
my-scenario/
├── public/
│   ├── fonts/
│   ├── javascripts/
│   ├── sounds/
│   ├── stylesheets/
│   └── ...
├── src/
│   ├── conductor/
│   ├── env/
│   ├── player/
│   ├── ...
│   └── server/
├── views/
│   ├── conductor.ejs
│   ├── env.ejs
│   ├── player.ejs
│   └── ...
├── gulpfile.js
├── package.json
└── README.md
```

For instance:

- The `public/` folder should contain any resource your clients may need to load (for instance, the stylesheets, the sounds, the images, etc. — note: the javascripts will be automatically generated with our `gulp` file from the `src/` folder).
- The `src/` folder contains your source code for the different type of clients and for the server. Each subfolder (`server/`, `/player`, and any other type of client) should contain and `index.es6.js` file, with the code to be executed for that entity.
- The `views/` folder contains a `*.ejs` file for each client type. In other words, all the subfolders in `src/` — except `server/` — should have their corresponding EJS file.

To compile the files, just run the command `gulp` in the Terminal: it will convert the files from es6 to es5, browserify the files on the client side, and launch the scenario with a `Node.js` server.

A scenario should contain at least a `src/server/` and a `src/player/` folder. The `src/server/` folder contains all the files that constitute the server. The `src/player/` folder contains all the files of the default client, which we name `player`. Any client connecting to the server through the root url (`http://your-url:port`) would be a `player`, and belong to the namespace `'/player'`.

You can add any other type of client (`clientType`). For that, you should create a subfolder `src/clientType/` folder with the name of that other type of client (for instance `src/conductor/` or `src/env/`) and put and `index.es6.js` inside. This type of client would join the corresponding namespace `'/clientType`' (*e.g.* `'/conductor'` or `'/env'`), and be accessed through the URL `http://your-url:port/clientType` (*e.g.* `http://your-url:port/conductor` or `http://your-url:port/env`).

#### Client side

On the client side, the `src/player/index.es6.js` file (or any other type of client's index file) should look like this.

```javascript
// Require the library
var clientSide = require('soundworks/client');
var client = clientSide.client;

// Initialize the WebSocket namespace depending on the client type
client.init('/player');

// Write the performance module
class MyPerformance extends clientSide.Module {
  ...
}

// Scenario
window.addEventListener('load', () => {
  // Initialize the modules
  var welcome = new clientSide.Dialog(...);
  var seatmap = new clientSide.Seatmap(...);
  var checkin = new clientSide.Checkin(...);
  var performance = new MyPerformance(...);
  

  // Scenario logic
  client.start(
    client.serial(
      client.parallel(
        welcome,
        seatmap
      ),
      checkin,
      performance
    )
  );
});
```

For a `env` (or a `conductor`) client, the file would look the same except that the WebSocket namespace initialization would be `client.init('/env');` (or `client.init('/env');`), and the modules might be different. For instance, one could imagine that the `env` clients only require a `seatmap` and a `performance` module).

#### Server side

On the server side, the `src/server/index.es6.js` would look like this.

```javascript
// Require the libraries and setup the Express app
var serverSide = require('soundworks/server');
var server = serverSide.server;
var path = require('path');
var express = require('express');
var app = express();

// Configuration of the Express app
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../../public')));

// Write the player and env performance modules
class MyPlayerPerformance extends serverSide.Module {
  ...
}
class MyEnvPerformance extends serverSide.Module {
  ...
}

// Initialize the modules
var seatmap = new serverSide.Seatmap(...);
var checkin = new serverSide.Checkin(...);
var playerPerformance = new MyPlayerPerformance(...);
var envPerformance = new MyEnvPerformance(...);

// Start the scenario
server.start(app);
// Set up the module servers for the 'player' clients
server.map('/player', 'My Scenario', seatmap, checkin, playerPerformance);
// Set up the module servers for the 'env' clients
server.map('/env', 'My Scenario — Environment', seatmap, envPerformance);
```

Indeed, on the client side, the `player` clients initialized the modules `welcome` (that does not require a communication with the server), `seatmap`, `checkin` and `performance`, so we set up the servers corresponding to these modules on the namespace `/player`. Similarly, the `/env` clients initialized the modules `seatmap` and `performance` (which both require communication with the server), so we set up the servers corresponding to these modules on the namespace `/env`.

## API

This sections explains how to use the classes of the library. In particular, we list here all the methods and attributes you may need to use at some point.

Some classes are only present on the [client side](#client-only-modules):

- [`Dialog`](#dialog)
- [`Loader`](#loader)
- [`Orientation`](#orientation)

Others are only present on the [server side](#server-only-modules):

- [`Client`](#client)

The rest of the classes require both the [client **and** server sides](#client-and-server-modules):

- [`Checkin`](#checkin)
- [`Module`](#module)
- [`Seatmap`](#seatmap)
- [`Sync`](#sync)

### Client only modules

#### ClientDialog

The `ClientDialog` module displays a dialog on the screen, and requires the user to click the screen to make the module disappear.

###### Attributes

- `view:Element`  
  The view is the div in which the content of the module is displayed.

###### Methods

- `constructor(options:Object = {})`  
  The constructor method instantiates the `ClientDialog` module on the client side. It takes the `options` object as an argument, whose properties are:
  - `id:String = 'dialog'`  
    The ID of the dialog, that will be used as the `id` HTML attribute of the `this.view`.
  - `text:String`  
    The text to be displayed in the dialog.
  - `activateAudio:Boolean = false`  
    If set to `true`, the module with activate the Web Audio API when the user clicks the screen (useful on iOS, where sound is muted until a user action triggers some audio commands).

#### ClientLoader

The `ClientLoader` module allows to load audio files that can be used in other modules (for instance, the performance module). The `Loader` module displays a loading bar that indicates the progress of the loading.

###### Attributes

- `audioBuffers:Array = []`  
  The `audioBuffers` array contains the audio buffers created from the audio files passed in the `constructor`.

###### Methods

- `constructor(audioFiles:Array)`  
  The constructor method instantiates the `ClientLoader` module on the client side. It takes the `audiofiles` array as an argument. The `audiofiles` array contains the links (`String`) to the audio files to be loaded.

#### ClientOrientation

The `ClientOrientation` module allows to calibrate the compass and get and angle reference. It displays the view, that the user clicks on when he / she points at the right direction for the calibration.

###### Attributes

- `angleReference:Number`  
  The `angleReference` attribute is the value of the alpha angle (as in `deviceOrientation`) when the user clicks on the screen while the Orientation module is displayed. It serves as a calibration / reference of the compass.
- `view:Element`  
  The view is the div in which the content of the module is displayed.

###### Methods

- `constructor(options:Object = {})`  
  The constructor method instantiates the `ClientOrientation` module on the client side. It takes the `options` object as an argument, whose optional property is:
  - `text:String = "Point the phone exactly in front of you, and touch the screen."`
    The text to be displayed on the dialog.

### Server only modules

#### ServerClient

The `ServerClient` module is used to keep track of the connected clients. Each time a client connects to the server, *Soundworks* creates an instance of `ServerClient`.

###### Attributes

- `data:Object = {}`  
  The `data` attribute can be used by any module to store any useful information that any module might need at some point, or that might need to be sent to the clients. The convention is to create a property for each module that writes into this attribute. For instance, if the `sync` module keeps track of the time offset between this client's clock and the server clock, it would store the information in `this.data.sync.timeOffset`. Similarly, if the `performance` module needs some kind of flag for each client, it would store this information in `this.data.performance.flag`.
- `index:Number`  
  The `index` attribute stores the index of the client as set by the `ServerCheckin` module. See `ServerCheckin` for more information.
- `socket:Socket`  
  The `socket` attribute stores the socket that sets the communication channel between the server and this client, as passed in by the `constructor`.

### Client and server modules

#### Checkin

The `Checkin` module is responsible for keeping track of the connected clients by assigning them indices within the range of the available places in the scenario.

For instance, say that the scenario requires 12 players who sit on a grid of 3 ⨉ 4 seats: when a client connects to the server, the `Checkin` module will assign a seat within the remaining places of this grid.

Similarly, if the scenario takes place in a theater where seats are numbered, the `Checkin` module would allow the users to indicate what their seats are.

Or, if the scenario doesn't require the players to sit at particular locations, the `Checkin` module would just assign them indices within the range of total number of users this scenario supports.

##### ClientCheckin

The `ClientCheckin` takes care of the checkin on the client side.

###### Methods

- `constructor(options:Object = {})`  
  The `constructor` method instantiates the `ClientCheckin` module on the client side. It takes the `options` object as an argument, whose optional property is:
  - `display:Boolean = false`  
    When set to `true`, the module displays a dialog with the checkin information for the user. The user has to click on the dialog to indicate that the checkin process is `"done"`.
- `getPlaceInfo() : Object`  
  The `getPlaceInfo` method returns an object with the checkin information. The returned object returned has two properties:
  - `index:Number`
    The index of the client.
  - `label:String`  
    The label of the place corresponding to that index.

Below is an example of an instantiation of the `ClientCheckin` module that displays the dialog on the client side.

```javascript
/* Client side */

var clientSide = require('soundworks/client');
var checkin = new clientSide.Checkin({ display: true });
```

##### ServerCheckin

The `ServerCheckin` takes care of the checkin on the server side.

- `constructor(options:Object = {})`  
  The `constructor` method instantiates the `ServerCheckin` module on the server side. It takes the `options` object as an argument, **that must have either a `seatmap` or a `numPlaces` property: these options are mutually exclusive, but one of them is required**. The properties supported by `options` are:
  - `seatmap:ServerSeatmap = null`  
    The seatmap associated with the scenario. If a seatmap is provided (for instance because the venue where the scenario is taking place provides seats with predetermined locations), this module assigns places among the places available in the `seatmap`. Otherwise (no seatmap provided), the user must indicate the maximum number of players allowed in this scenario with the property `numPlaces`.
  - `numPlaces:Number = 9999`  
    If `options` has no `seatmap` attribute, it must have a `numPlaces` attribute that indicates the maximum number of players allowed in the performance. In that case, the module allocates indices to each client that connects, until the total number of connected clients reaches `numPlaces`.
  - `order:String = 'random'`  
    Order in which places indices are assigned. Currently supports two values:
    - `'random'`  
      Places are chosen randomly among the available indices.
    - `'ascending'`   
      Places are chosen in ascending order among the available indices.

Below is an example of the instantiation of the `ServerCheckin` module on the server side.

```javascript
/* Server side */

var serverSide = require('soundworks/server');

// Case 1: the scenario has a seatmap
var seatmap = new serverSide.Seatmap({ cols: 3, rows: 4 });
var checkin = new serverSide.Checkin({ seatmap: toplogy });

// Case 2: the scenario does not have a seatmap
var checkin = new serverSide.Checkin({ numPlaces: 500, order: 'ascending' });
```

#### Module

The `Module` server and client classes are the base classes that any *Soundworks* module is based on.

##### ClientModule

The `ClientModule` extends the `EventEmitter` class. Each module should have a `.start()` and a `.done()` method, as explained in [How to write a module](#how-to-write-a-module). The `.done()` method must be called when the module has done its duty.

###### Attributes

- `view`  
  The `view` attribute of the module is the DOM element (a full screen `div`) in which the content is displayed. A module may or may not have a `view`, as indicated by the argument `hasDisplay:Boolean` of the `constructor`.

###### Methods

- `constructor(id:String, hasDisplay:Boolean = true)`  
  The `constructor` method instantiates the `ClientModule` module on the client side. It takes two arguments:
  - `id:String`  
    The `id` of the the `this.view` DOM element.
  - `hasDisplay:Boolean = true`  
    When set to `true`, the module creates the `this.view` DOM element with the id `id`.  
- `start()`  
  The `.start()` method is automatically called to start the module, and should handle the logic of the module on the client side. For instance, it takes care of the communication with the module on the server side by sending WebSocket messages and setting up WebSocket message listeners.
- `done()`  
  The `.done()` method should be called when the module has done its duty (for instance at the end of the `.start()` method you write). You should not have to modify this method, but if you do, don't forget to include `super.done()` at the end.

In practice, here is how you would extend this class to create a module on the client side.

```javascript
/* Client side */

var clientSide = require('soundworks/client');

class MyModule extends clientSide.Module {
  constructor() {
    super('my-module', true); // here, MyModule would always have a view, with the id 'my-module'

    ... // anything the constructor needs
  }

  start() {
    super.start();

    ... // what the module has to do (communication with the server, etc.)
    this.done(); // call this method when the duty of the module is done
  }
}
```

##### ServerModule

The `ServerModule` extends the `EventEmitter` class.

###### Methods

- `constructor()`  
  The `constructor` method instantiates the `ServerModule` module on the server side.
- `connect(client:ServerClient)`  
  The `connect` method is automatically called when the client `client` connects to the server, and should handle the logic of the module on the server side. For instance, it takes care of the communication with the module on the client side by setting up WebSocket message listeners and sending WebSocket messages, or adds the client to a client's list to keep track of all the connected clients.
- `disconnect(client:ServerClient)`  
  The `disconnect` method is automatically called when the client `client` disconnects from the server, and should do the necessary when that happens. For instance, it removes the client from the client's list of the connected clients.

```javascript
/* Server side */

var serverSide = require('soundworks/server);

class MyModule extends serverSide.Module {
  constructor() {
    ... // anything the constructor needs
  }

  connect() {
    ... // what the module has to do when a client connects to the server
  }

  disconnect() {
    ... // what the module has to do when a client disconnects from the server
  }
}
```

#### Seatmap

The `Seatmap` module contains the information about the physical locations of the available places in the scenario. The location is fixed and determined in advance.

For instance, say that the scenario requires 12 players who sit on a grid of 3 ⨉ 4 seats: the `Seatmap` module would contain the information about that grid of seats, including their physical location and their name (`label`).

Similarly, if the scenario takes place in a theater where seats are numbered, the `Seatmap` module would contain information about where the seats are physically, and what their references (`label`) are.

If the placement of the users in the scenario doesn't matter, the `Seatmap` module is not needed.

##### ClientSeatmap

The `ClientSeatmap` modules takes care of the seatmap on the client side.

###### Methods

- `constructor()`  
  The `constructor` method instantiates the `ClientSeatmap` module on the client side.
- `displaySeatmap(div:Element)`  
  The `displaySeatmap` method displays a graphical representation of the seatmap in the `div` DOM element provided as an argument.
- `addClassToTile(seatmapDisplay:Element, index: Number, className:String = 'player')`  
  In the `Seatmap` graphical representation that lies in the `seatmapDisplay` DOM element (which had to be created by the `.displaySeatmap(div)` method), this method adds the class `className` to the tile corresponding to the index `index` in the seatmap.
- `removeClassFromTile(seatmapDisplay:Element, index: Number, className:String = 'player')`  
  In the `Seatmap` graphical representation that lies in the `seatmapDisplay` DOM element (which had to be created by the `.displaySeatmap(div)` method), this method removes the class `className` from the tile corresponding to the index `index` in the seatmap.

Below is an example of the `ClientSeatmap` module in use.

```javascript
/* Client side */

// 1. Require the Soundworks library
var clientSide = require('soundworks/client');

// 2. Instantiate the class
var seatmap = new clientSide.Seatmap();

// 3. Display a graphical representation of the seatmap in a div of the DOM
var seatmapGUI = document.getElementById('seatmap-container');
seatmap.displaySeatmap(seatmapGUI);

// 4. Add the class 'red-highlight' to tile #3 in this graphical representation
seatmap.addClassToTile(seatmapGUI, 3, 'red-highlight');
```

##### ServerSeatmap

###### Methods

The `ServerSeatmap` modules takes care of the seatmap on the server side.

- `constructor(options:Object)`  
  The `constructor` method instantiates the `ServerSeatmap` module on the client side. It takes the `options` object as a mandatory argument, whose properties are:
  - `type:String = 'matrix'`  
    This parameter indicates the type of seatmap to generate. The currently supported values are:
    - `'matrix'`: creates a grid of `params.cols` columns and `params.rows` rows.
    - (will probably add `'csv'` soon)
  - `cols:Number = 3`  
    In the case where the seatmap type is a `'matrix'`, this parameter indicates the number of columns the matrix has.
  - `rows:Number = 4`  
    In the case where the seatmap type is a `'matrix'`, this parameter indicates the number of rows the matrix has.
  - `colSpacing:Number = 2`  
    In the case where the seatmap type is a `'matrix'`, this parameter indicates the physical distance between 2 columns of the matrix, in meters.
  - `rowSpacing:Number = 2`  
    In the case where the seatmap type is a `'matrix'`, this parameter indicates the physical distance between 2 rows of the matrix, in meters.
  - `colMargin:Number = colSpacing / 2`  
    In the case where the seatmap type is a `'matrix'`, this parameter indicates the physical distance between the venue space and the edge of the matrix (horizontally).
  - `rowMargin:Number = rowSpacing / 2`  
    In the case where the seatmap type is a `'matrix'`, this parameter indicates the physical distance between the venue space and the edge of the matrix (vertically).
- `getNumPlaces() : Number`  
  The `getNumPlaces` method returns a `Number` corresponding to the number of places of the seatmap. For instance, if the seatmap is a 4 ⨉ 5 matrix, this would return the number `20` (which is the result of 4 ⨉ 5). It doesn't get any argument.
- `getLabel(index:Number) : String`  
  The `getLabel` returns a `String` corresponding to the label of the place associated with the index `index` in the seatmap.

Below is an example of the instantiation of the `ServerSeatmap` module on the server side.

```javascript
/* Server side */

var serverSide = require('soundworks/server');

// Creating a matrix seatmap with 4 columns and 5 rows
var toplogy = new serverSide.Seatmap({ type: 'matrix', cols: 4, rows: 5 });
```

#### Sync

The `Sync` module is based on [`sync`](https://github.com/collective-soundworks/sync) and is responsible for synchronizing the clients' clocks on the server clock, so that the server and all the clients share a common clock.

For instance, this allows all the clients to do something exactly at the same time, such as displaying a color on the screen or playing a snare sound in a synchronized manner.

The `Sync` module does a first synchronization process after which the `ClientSync` emits the `"done"` event. Later on, the `Sync` module keeps resynchronizing the client and server clocks at random intervals to compensate the clock drift.

On the client side, `ClientSync` uses the `audioContext` clock. On the server side, `ServerSync` uses the `process.hrtime()` clock. All times are in seconds (method arguments and returned values). **All time calculations and exchanges should be expressed in the server clock time.** The client clock time should be used only at the very end on the client, with the `audioContext`.

##### ClientSync

The `ClientSync` modules takes care of the synchronization process on the client side. It displays a `view` that indicates “Clock syncing, stand by…” until the very first synchronization process is `"done"`.

###### Methods

- `constructor()`  
  The `constructor` method instantiates the `ClientSync` modules on the client side.
- `getLocalTime(serverTime:Number = undefined) : Number`  
  The `getLocalTime` method returns the time in the client clock when the server clock reaches `serverTime`. If no arguments are provided, the method returns the time is is when the method is called, in the client clock (*i.e.* `audioContext.currentTime`). The returned time is a `Number`, in seconds.
- `getServerTime(localTime:Number = audioContext.currentTime) : Number`  
  The `getServerTime` method returns the time in the server clock when the client clock reaches `clientTime`. If no arguments are provided, the method returns the time is is when the method is called, in the server clock. The returned time is a `Number`, in seconds.

Below is an example of an instantiation of the `Sync` module.

```javascript
/* Client side */

var clientSide = require('soundworks/client');
var sync = new clientSide.Sync();

var nowClient = sync.getLocalTime(); // current time in client clock time
var nowServer = sync.getServerTime(); // current time in server clock time
```
##### ServerSync

###### Methods

- `constructor()`  
  The `constructor` method instantiates the `ServerSync` module on the server side.
- `getLocalTime()`  
  The `getLocalTime` method returns the current time in the server clock (*i.e.* a conversion of `process.hrtime()` in seconds). The returned time is a `Number`, in seconds.  

Below is an example of the instantiation of the `Sync` module on the server side.

```javascript
/* Server side */

var serverSide = require('soundworks/server');
var sync = new serverSide.Sync();

var now = sync.getLocalTime() // current time in the server clock time
```

## Examples

Let's build a simple scenario using *Soundworks*, that we'll call *Beats*. In *Beats*, all the players regularly emit a (high pitched) sound at the same time.

### 1. Create a new *Soundworks* project

Let's create a new *Soundworks* project. It should have the basic structure of an Express app, as shown below.

```
beats/
├── public/
│   ├── javascripts/
│   └── stylesheets/
│       └── style.css
├── src/
│   ├── player/
│   │   └── index.es6.js
│   └── server/
│       └── index.es6.js
├── views/
│   └── player.ejs
├── gulpfile.js
├── package.json
└── README.md
```

### 2. Client side

On the client side, there are two things we need to do: write the Javascript code, and set up the EJS file that will generate the HTML.

#### Setting up the EJS file

Let's start with the easy part, the EJS file located in `beats/views/player.ejs`.

```ejs
<!doctype html5>
<html>
  <head>
    <!-- settings -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <!-- title -->
    <title><% title %></title>

    <!-- stylesheets -->
    <link rel="stylesheet" href="stylesheets/boilerplate.css">
    <link rel="stylesheet" href="stylesheets/normalize.css">
    <link rel="stylesheet" href="stylesheets/style.css">
    
    <!-- scripts -->
    <script src="/socket.io/socket.io.js"></script>
  </head>

  <body>
    <div id="container" class="container"></div>
    <script src="javascripts/player.js"></script>
  </body>
</html>

```

The most important things here are:

- To load the `socket.io` library with `script(src="/socket.io/socket.io.js")`, since this is what we currently use to handle the WebSockets,
- To have a `<div>` element in the `body` that has the ID `#container` and a class `.container`,
- And to load the Javascript file `/javascripts/player.js`.

#### Writing our scenario in Javascript

Now let's write the core of our scenario in the `src/player/index.es6.js` file.

Step by step, this is how the scenario will look like when a user connects to the server:

- The screen displays a welcome message that the user has to click on to enter the scenario,
- There is a synchronization process so that the client and the server shares a common clock,
- Finally, the user enters the performance where the smartphone emits a sound a regular invervals, synced with the other smartphones of the performance.

First of all, let's load the library and initialize our WebSockets namespace (currently with `socket.io`).

```javascript
// Loading the libraries
var clientSide = require('soundworks/client');
var client = clientSide.client;

// Initiliazing the WebSocket namespace
client.init('/player');
```

The namespace here is set to `'/player'` because we are editing the Javascript file for the `player` clients.

Then, all the scenario will happen when the HTML document is ready, so let's wrap all the scenario logic in a callback function.

```javascript
window.addEventListener('load', () => {
   // Scenario logic
   ...
});
```

We can now initialize all the modules in this callback function. Let's review the modules one by one.

##### Welcome module

The `welcome` module displays a text to welcome the users who connect to the server. We also ask the users to click on the screen to hide this screen and start the scenario. Under the hood, we use this click to activate the Web Audio API on iOS devices (on iOS, sound is muted until a user action triggers some audio commands). This is exactly what the `Dialog` module does.

```javascript
var welcome = new clientSide.Dialog({
  id: 'welcome',
  text: "<p>Welcome to <b>Wandering Sound</b>.</p> <p>Touch the screen to join!</p>",
  activateAudio: true
});
```

Here:

- The `id` parameter corresponds to the `id` attribute of the HTML element in which the content of the module is displayed.
- The `text` parameter contains the text to display on the screen when the module is displayed.
- Finally, we set the property `activateAudio` to `true` to enable the sound on iOS devices as well as to start the Web Audio clock (that will be required for the synchronization process).

***This step is required in almost any scenario you could imagine, at least to activate the Web Audio.***

##### Sync module

The `sync` module synchronizes the client's clock on a clock shared by the server and all the other clients.

```javascript
var sync = new clientSide.Sync();
```

Here too, there is nothing to configure.

##### Performance module

To create the performance, we will have to write our own module. Say we created a `Synth` class that has a method `.play(startTime, period)`: calling this method would trigger a sound when the Web Audio time (AudioContext.currentTime) reaches startTime, and call that method again So here we go.

```javascript
class BeatsPerformance extends clientSide.Module {
  constructor(sync) {
    this.sync = sync; // the sync module
    this.beatPeriod = 0.5 // in seconds
    this.synth = new Synth(); // a Web Audio synth that makes sound

    // When the server sends the beat loop start time
    client.on('beatStart', (startTime) => {
      // Calculate the next beat trigger time in local time
      var startTimeLocal = this.sync.getLocalTime(startTime);
      var now = audioContext.currentTime;
      var elapsedBeats = Math.floor((now - startTimeLocal) / this.beatPeriod);
      var nextBeatTime = startTimeLocal + this.beatPeriod * elapsedBeats;

      // Launch the synth at that time
      this.synth.play(nextBeatTime, this.beatPeriod);
    })
  }

  start() {
    super.start();

    // Send a message to the server indicating that the user entered the performance
    client.socket.emit('perf_start'); // 
  }
}

class Synth {
  constructor() {}

  play(startTime, period) {
    this.triggerSound(startTime);
    this.play(startTime + period, period);
  }

  triggerSound(startTime) {
    // plays a sound when the Web Audio clock reaches startTime
  }
}
```

Now let's glue everything together.

```javascript
// Instantiate the performance module
var performance = new BeatsPerformance();

// Start the scenario and link the modules
client.start(
  client.serial(
    welcome,
    sync,
    performance
  )
);
```

#### 3. Server side

On the server side, we now edit the file `src/serv/index.es6.js`. First, we require the libraries and set up the Express app.

```javascript
// Require the libraries and setup the Express app
var serverSide = require('soundworks/server');
var server = serverSide.server;
var path = require('path');
var express = require('express');
var app = express();

// Configuration of the Express app
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../../public')));
```

Then, we setup the modules that the client needs to communicate with. In this example, there is only the `Sync` module.

```javascript
var sync = new serverSide.Sync();
```

Finally, we have to write the performance module. There we go.

```javascript
class BeatsPerformance extends serverSide.Module {
  constructor() {
    var now = process.hrtime();
    this.startTime =  now[0] + now[1] * 0.000000001; // in seconds
  }

  connect(client) {
    var socket = client.socket;

    socket.on('perf_start', () => {
      socket.emit('beat_start', this.startTime);
    });
  }

  disconnect(client) {}
}
```

When the server get the client message indicating that the client is starting the performance, the server send back the beat loop start time.

Finally, we instantiate the module, and start the server and map the `/player`namespace to the module we just set up.

```javascript
var performance = new BeatsPerformance()

server.start(app);
server.map('/player', 'Beats', sync, performance);
```


