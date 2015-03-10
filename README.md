# SOUNDWORKS

## Table of contents

- [**Overview & how to get started**](#overview--how-to-get-started)
  - [Server / client architecture](#server--client-architecture)
  - [A *Soundworks* scenario is exclusively made of modules](#a-soundworks-scenario-is-exclusively-made-of-modules)
  - [How to write a module?](#how-to-write-a-module)
  - [How to write a scenario?](#how-to-write-a-scenario)
- [**API**](#api)
  - [Core objects](#core-objects)
    - [Client side: the `client` object](#client-side-the-client-object)
    - [Server side: the `server` object](#server-side-the-server-object)
  - [Client only modules](#client-only-modules)
    - [`ClientDialog`](#clientdialog)
    - [`ClientLoader`](#clientloader)
    - [`ClientOrientation`](#clientorientation)
  - [Server only modules](#server-only-modules)
    - [`ServerClient`](#serverclient)
  - [Client and server modules](#client-and-server-modules)
    - [`Checkin`](#checkin)
    - [`Control`](#control)
    - [`Module`](#module)
    - [`Seatmap`](#seatmap)
    - [`Sync`](#sync)
- [**Example**](#example)

## Overview & how to get started

*Soundworks* is a Javascript framework that enables artists and developers to create collaborative music performances where a group of participants distributed in space use their smartphones to generate sound and light through touch and motion.

The framework is based on a server / client architecture supported by `Node.js` (`v0.12.0` or later) and WebSockets, and uses a modular design to make it easy to implement different performance scenarios: the [*Soundworks* template](https://github.com/collective-soundworks/soundworks-template) allows anyone to bootstrap a *Soundworks*-based scenario and focus on its audiovisual and interaction design instead of the infrastructure.

### Server / client architecture 

In order to connect the smartphones with each other, *Soundworks* implements a server / client architecture using a `Node.js` server and WebSockets to pass messages between the server and the clients (currently with the `socket.io` library).

The word “client” represents any entity that connects to the server. For instance, this can be:

- The smartphone of a player who takes part in the collaborative performance (we would refer to this type of client as a `player`: these clients connect to the server through the root URL `http://my.domain.name:port/`);
- A laptop that provides an interface for the artist to control some parameters of the performance in real time (we would refer to this type of client as `conductor`; these clients would connect to the server through the URL `http://my.domain.name:port/conductor`);
- A computer that controls the sound and light effects in the room in sync with the players' performance, such as lasers, a global visualization or ambient sounds on external loudspeakers (we would refer to this type of client as `env`, standing for “environment”; these clients would connect to the server through the URL `http://my.domain.name:port/env`);
- And so on…

As you may have noticed, a client who connects to the root URL is called a `player`: this is the default client type. All the other types of client access the server through a URL that concatenates the domain name and the name of the client type.

### A *Soundworks* scenario is exclusively made of modules

A scenario built with *Soundworks* consists in a succession and combination of modules, each of them corresponding to one step of the scenario. Each module has a `.start()` and a `.done()` method: we launch the process corresponding to that module by calling the method `.start()`, and we call the method `.done()` when the duty of the module is done.

As an example, let's say that a scenario works as follows when a `player` connects to the server (through the URL `http://my.domain.name:port/`):

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

To run a sequence of modules in serial, we use `client.serial(module1, module2, ...)`. A module would `.start()` only after the previous one is `.done()`. On the other hand, if some modules need to be run in parallel, we use `client.parallel(module1, module2, ...)`. The parallel process triggers a global `.done()` method when all of its modules are `.done()`. For more information about the `serial` and `parallel` module processes, see the [`client` object modules logic](#modules-logic) in the API section.

Some of these modules need an interaction with the server (for instance, the `sync` process requires a dialog between the server and the client to synchronize the clocks). Thus, on the server side, we would write the following code that 1) instantiates the server side modules, and 2) maps them to the `'/player'` namespace.

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
// Map the '/player' namespace with the modules needed by the client side
server.map('/player', 'My Scenario', sync, checkin, performance);
```

That way, the `sync`, `checkin` and `performance` modules of a `player` (who belongs to the namespace `'/player'`, see below for more information) would be able to dialog with the corresponding modules on the server side.

### How to write a module?

#### Client side

On the client side, a module extends the `ClientModule` base class and must have a `.start()` method and a `.done()` method. **A module should call its `.done()` method when the whole process of the module is completed.**

For instance, if the purpose of the module is to load files, the module should call the method `.done()` when the files are loaded. Similarly, if the purpose of the module is to synchronize the clocks, the module should call the method `.done()` when the clocks are synced.

##### The `.start()` method

The `.start()` method is called to start the module. It should handle the logic and the steps that lead to the completion of the module.

For instance, the purpose of the `ClientSeatmap` module is to get the seatmap from the server. Therefore, the `.start()` method of the `ClientSeatmap` module does the following:

- It sends a request to the `ServerSeatmap` module via WebSockets, asking the server to send the `seatmap` object.
- When it receives the response from the server with the `seatmap` object, it stores the `seatmap` as an attribute.
- Finally, since the module has done its duty, it calls the method `.done()`.

In Javascript, it looks like the following.

```javascript
var client = require('./client');

class ClientSeatmap extends ClientModule {
  ...

  start() {
    super.start(); // don't forget this line!

    client.send('seatmap_request'); // request the seatmap to the server
    
    client.receive('seatmap_init', (seatmap) => {
      this.seatmap = seatmap; // store the response in an attribute
      this.done(); // call the method .done(), since the purpose of the module is done
    });
  }

  ...
}
```

This method must include the inherited method from the base class before any code you write (`super.start();`).

##### The `.done()` method

The `.done()` method should rarely change from the method inherited from the base class. If you have to rewrite it though, **don't forget to include the inherited method of the base class**. (Its purpose is to emit a `'done'` event associated with the module, which makes the whole module logic work.)

Put differently, if you customize the `.done()` method, it must follow this template.

```javascript
clientSide = require(soundworks/client);

class MyModule extends clientSide.Module {
...

  done() {
    ... // any code you want

    super.done(); // don't forget this line!
  }

...
}
```

You will find [more information on the `ClientModule` base class in the API section](#clientmodule).

#### Server side

On the server side, a module extends the `ServerModule` base class and must have a `.connect(client:ServerClient)` method and a `.disconnect(client:ServerClient)` method.

##### The `.connect(client:ServerClient)` method

The `.connect(client)` is called whenever the client `client` connects to the server. I should set up the listeners of the WebSocket messages sent after the `.start()` method on the client side is started, and handle the logic of the module.

For instance, say that the module you are writing needs to keep track of all the connected clients. Then you could write the following.

```javascript
connect(client) {
  this.clients.push(clients);

  ... // the rest of the method
}
```

##### The `.disconnect(client:ServerClient)` method

Similarly, the `.disconnect(client)` is called whenever the client `client` disconnects from the server. It handles all the actions that are necessary in that case.

In our previous example, where the module keeps track of the connected clients, we would then write the following, where the function `removeFromArray(a, el)` removes the element `el` from the array `a`.

```javascript
disconnect(client) {
  removeFromArray(this.clients, client);

  ... // the rest of the method
}
```

You will find [more information on the `ServerModule` base class in the API section](#servermodule).

### How to write a scenario?

Since *Soundworks* is built on Express, any scenario you write using *Soundworks* should follow the organization of an Express app (using the EJS rendering engine), as shown in the example below.

```
my-scenario/
├── public/
│   ├── fonts/
│   ├── sounds/
│   └── ...
├── src/
│   ├── conductor/
│   ├── env/
│   ├── player/
│   ├── ...
│   ├── sass/
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

- The `public/` folder should contain any resource your clients may need to load: for instance, the sounds, the images, the fonts, etc.  
  **Note:** the Javascript and CSS files will be automatically generated with our `gulp` file from the `src/` folder, so you shouldn't have any `javascript/` or `stylesheets/` folder here (they will be deleted by `gulp` anyway).
- The `src/` folder contains your source code for the server and the different types of clients. Each subfolder (`server/`, `/player`, and any other type of client) should contain and `index.es6.js` file, with the code to be executed for that entity. The `src/` folder also contains the SASS files to generate the CSS in the `sass/` subfolder.
- The `views/` folder contains a `*.ejs` file for each type of client. In other words, all the subfolders in `src/` — except `server/` and `sass/` — should have their corresponding EJS file.

To compile the files, just run the command `gulp` in the Terminal: it will generate the `*.css` files from the SASS files, convert the Javascript files from ES6 to ES5, browserify the files on the client side, and launch a `Node.js` server to start the scenario.

A scenario should contain at least a `src/server/`, `src/player/` and `src/sass/` folder.

- The `src/server/` folder contains all the files that constitute the server.
- The `src/player/` folder contains all the files of the default client, which we name `player`. (Any client connecting to the server through the root URL `http://my.domain.name:port` would be a `player`, and belongs to the namespace `'/player'`.)
- Finally, the `src/sass/` folder contains the SASS files to generate the CSS.

You can add any other type of client (let's name it generically `clientType`). For that, you should create a subfolder `src/clientType/` (for instance `src/conductor/` or `src/env/`) and write an `index.es6.js` file inside. This type of client would join the corresponding namespace `'/clientType`' (*e.g.* `'/conductor'` or `'/env'`), and be accessed through the URL `http://my.domain.name:port/clientType` (*e.g.* `http://my.domain.name:port/conductor` or `http://my.domain.name:port/env`).

#### Client side

On the client side, the `src/player/index.es6.js` file (or any other type of client's index file) should look like this.

```javascript
/* Client side */

// Require the library
var clientSide = require('soundworks/client');
var client = clientSide.client;

// Initialize the WebSocket namespace depending on the client type (here, '/player')
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

For another type of client (*e.g* `conductor` or `env`), the file would look the same except that the WebSocket namespace initialization correspond to that type of client (*e.g.* `client.init('/conductor);`, or `client.init('/env');`) and the modules might be different (for instance, one could imagine that the `env` clients only require a `seatmap` and a `performance` module).

#### Server side

On the server side, the `src/server/index.es6.js` would look like this.

```javascript
/* Server side */

// Require the libraries and setup the Express app
var serverSide = require('soundworks/server');
var server = serverSide.server;
var express = require('express');
var app = express();
var path = require('path');
var dir = path.join(__dirname, '../../public');

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
server.start(app, dir, 3000);
// Set up the server modules required by the 'player' clients
server.map('/player', 'My Scenario', seatmap, checkin, playerPerformance);
// Set up the server modules required by the 'env' clients
server.map('/env', 'My Scenario — Environment', seatmap, envPerformance);
```

Indeed, on the client side, the `player` clients use the modules `welcome` (that does not require a communication with the server), `seatmap`, `checkin` and `performance`, so we set up the corresponding server modules and map them to the namespace `/player`. Similarly, say the `/env` clients use the modules `seatmap` and `performance` (which both require communication with the server), so we set up the corresponding server modules and map them to the namespace `/env`.

#### Styling with SASS

Finally, the `src/sass/` folder would contain all the SASS partials we need for the modules from the library, and include them all in a `player.scss` file. If there are other types of clients in the scenario (*e.g.* `conductor` or `env`), we would add the corresponding `*.scss` files as well (*e.g.* `conductor.scss` or `env.scss`).

## API

This sections explains how to use the objects and classes of the library. In particular, we list here all the methods and attributes you may need to use at some point.

We start with the core elements on the client side ([`client` object](#client-side-the-client-object)) and on the server side ([`server` object](#server-side-the-server-object)) before focusing on the module classes.

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

Some modules on the client side are also associated with some styling information. When that is the case, we added in the library's `sass/` folder a `_xx-moduleName.scss` SASS partial: don't forget to include them in your `*.scss` files when you write your scenario. We indicate in the sections below which modules do require these SASS partials.

### Core objects

#### Client side: the `client` object

The `client` object has the following attributes, which we regroup by purpose for clarity.

##### Initialization and WebSocket communication

- `init:Function`  
  The `init` attribute contains the `init` function that is defined as `init(namespace:String)`. The `init` function initializes a WebSocket connection with the server in the namespace `namespace`.
- `socket:Object`  
  The `socket` attribute contains the `socket` object that communicates with the server through WebSockets, created in the `client.init(namespace:String)` method. The socket is associated with the namespace `namespace`. (Might change in the future.)
- `send:Function`  
  The `send` attribute contains the `send` function that is defined as `send(msg:Object, ...args:*)`. The `send` function  sends the message `msg` and any number of values `...args` (of any type) to the server through WebSockets. Note: on the server side, the server receives the message with the command `ServerClient.receive(msg:String, callback:Function)` where the `callback` function would take `...args` as arguments (for more information, see the [`ServerClient` module methods](#serverclient) below).
- `receive:Function`  
  The `receive` attribute contains the `receive` function that is defined as `receive(msg:Object, callback:Function)`. The `receive` function executes the callback function `callback` when it receives the message `msg` sent by the server. Note: on the server side, the server sends the message with the command `server.send(msg:String, ...args:*)` (for more information, see the [`server` object WebSocket communication](#websocket-communication) below). On the client side, the `callback` function takes `...args` as arguments.

##### Modules logic

- `start:Function`  
  The `start` attribute contains the `start` function that is defined as `start(module:ClientModule)`. The `start` function starts the client's module logic with the module `module`. The argument `module` can either be a module from the library or a module you wrote (if your scenario has only one module), or a `client.serial(...modules:ClientModule)` sequence of modules, or a `client.parallel(...modules:ClientModule)` combination of modules.
- `parallel:Function`  
  The `parallel` attribute contains the `parallel` function that is defined as `parallel(...modules:ClientModule):ClientModule`. The `parallel` function starts all the modules in `...module` in parallel, and triggers a `'done'` event when all the modules triggered their `.done()` function (*i.e.* emitted their own `'done'` event). The `parallel` function returns a `ClientModule` (namely, a `ParallelModule`). Because of this, you can combine parallel module combinations with serial module sequences (*e.g.* `client.parallel(module1, client.serial(module2, module3), module4);`).  The `view` of a module is always full screen, so in the case of modules run in parallel, the views are stacked on top of each other (using the `z-index` CSS property) in the order of the modules (`module1` is on top of `module2` which is on top of `module3`, etc.). For instance, say `module3` triggers its `.done()` method before `module2`: its `view` would be removed before the one of `module2`, so the user would never see the `view` of `module3` (the full screen views would directly pass from `module2` to `module4`).
- `serial:Function`  
  The `serial` attribute contains the `serial` function that is defined as `serial(...modules:ClientModule):ClientModule`. The `serial` function starts the modules in `...module` in serial: it starts the module *n*+1 (via its `.start()`) method only after the module *n* triggered a `'done'` event (via its *.done()* method). When the last module calls its `.done()` method, this function emits a global `'done'` event. The `serial` function returns a `ClientModule` (namely, a `SerialModule`). Because of this, you can combine parallel module combinations with serial module sequences (*e.g.* `client.serial(module1, client.parallel(module2, module3), module4);`).

#### Server side: the `server` object

The `server` object has the following attributes, which we regroup by purpose for clarity.

##### Initialization and module logic

- `start:Function`  
  The `start` attribute contains the `start` function that is defined as `start(app:Object, publicPath:String, port:Number)`. The `start` function starts the server with the Express application `app` that uses `publicPath` as the public static directory, and listens to the port `port`.
- `map:Function`  
  The `map` function is used to indicate that the clients who connect to the namespace `namespace` need the modules `...modules` to be activated (via their `.connect(client)` method) and listen for the WebSocket messages from the client side. Additionally, it sets the title of the page (used in the <title> tag in the HTML <head> element) to `title` and routes the connections from the URL path `namespace` to the corresponding view (except for the namespace `'/player'`, that uses the URL `/` instead of `/player`).

##### WebSocket communication

- `io:Object`  
  The `io` attribute contains the `socket.io` server, created in the `server.start(app:Object, publicPath:String, port:Number)` method. (Might change in the future.)
- `broadcast:Function`  
  The `broadcast` attribute contains the `broadcast` function that is defined as `broadcast(namespace:String, msg:String, ...args:*)`. The `broadcast` function sends the message `msg` and any number of values `...args` (of any type) to all the clients that belong to the namespace `namespace` through WebSockets. Note: on the client side, the clients receive the message with the command `client.receive(msg:String, callback:Function)`, where the `callback` function would takes `...args` as arguments (for more information, see the [`client` object WebSocket communication](#initialization-and-websocket-communication) above).

### Client only modules

#### ClientDialog

The `ClientDialog` module displays a dialog on the screen, and requires the user to click the screen to make the module disappear.

###### Attributes

- `view:Element`  
  The view is the div in which the content of the module is displayed.

###### Methods

- `constructor(options:Object = {})`  
  The `constructor` method instantiates the `ClientDialog` module on the client side. It takes the `options` object as an argument, whose properties are:
  - `activateAudio:Boolean = false`  
    If set to `true`, the module with activate the Web Audio API when the user clicks the screen (useful on iOS, where sound is muted until a user action triggers some audio commands).
  - `color:String = 'black'`  
    Sets the background color of the view to `color` thanks to a CSS class of the same name. `color` should be the name of a class as defined in the library's `sass/_03-colors.scss` file.
  - `name:String = 'dialog'`  
    The name of the dialog, that will be used as the `id` HTML attribute of the `this.view` and the associated class.
  - `text:String`  
    The text to be displayed in the dialog.

#### ClientLoader

The `ClientLoader` module allows to load audio files that can be used in other modules (for instance, the performance module). The `Loader` module displays a loading bar that indicates the progress of the loading.

The `ClientLoader` module requires the SASS partial `sass/_07-loader.scss`.

###### Attributes

- `audioBuffers:Array = []`  
  The `audioBuffers` array contains the audio buffers created from the audio files passed in the `constructor`.

###### Methods

- `constructor(audioFiles:Array, options = {})`  
  The `constructor` method instantiates the `ClientLoader` module on the client side. It takes up to two arguments:
  - `audioFiles:Array`  
     The `audiofiles` array contains the links (`String`) to the audio files to be loaded.
  - `options:Object = {}`  
    The optional `options` argument customizes the configuration of the module. Its properties can be:
    - `color:String = 'black'`  
      Sets the background color of the view to `color` thanks to a CSS class of the same name. `color` should be the name of a class as defined in the library's `sass/_03-colors.scss` file.

#### ClientOrientation

The `ClientOrientation` module allows to calibrate the compass and get and angle reference. It displays the view, that the user clicks on when he / she points at the right direction for the calibration.

###### Attributes

- `angleReference:Number`  
  The `angleReference` attribute is the value of the alpha angle (as in `deviceOrientation`) when the user clicks on the screen while the Orientation module is displayed. It serves as a calibration / reference of the compass.
- `view:Element`  
  The view is the div in which the content of the module is displayed.

###### Methods

- `constructor(options:Object = {})`  
  The `constructor` method instantiates the `ClientOrientation` module on the client side. It takes the `options` object as an argument, whose optional properties are:
  - `color:String = 'black'`  
    Sets the background color of the view to `color` thanks to a CSS class of the same name. `color` should be the name of a class as defined in the library's `sass/_03-colors.scss` file.
  - `text:String = "Point the phone exactly in front of you, and touch the screen."`
    The text to be displayed in the dialog.

### Server only modules

#### ServerClient

The `ServerClient` module is used to keep track of the connected clients. Each time a client connects to the server, *Soundworks* creates an instance of `ServerClient`.

###### Attributes

- `data:Object = {}`  
  The `data` attribute can be used by any module to store any useful information that any module might need at some point, or that might need to be sent to the clients. The convention is to create a property for each module that writes into this attribute. For instance, if the `sync` module keeps track of the time offset between this client's clock and the sync clock, it would store the information in `this.data.sync.timeOffset`. Similarly, if the `performance` module needs some kind of flag for each client, it would store this information in `this.data.performance.flag`.
- `index:Number`  
  The `index` attribute stores the index of the client as set by the `ServerCheckin` module. See the [`ServerCheckin` module](#servercheckin) for more information.
- `namespace:String`  
  The `namespace` attribute stores the namespace of the client (as defined in `socket.io` for now). This is the namespace that is specified on the client side, while initiating the `client` object with `client.init(namespace);` (generally at the very beginning of the file your write).
- `socket:Socket`  
  The `socket` attribute stores the socket that sets the communication channel between the server and this client, as passed in by the `constructor`.

###### Methods

- `send(msg:String, ...args:*)`  
  The `send` method sends the message `msg` and any number of values `...args` (of any type) to that client through WebSockets. Note: on the client side, the client receives the message with the command `client.receive(msg:String, callback:Function)` where the `callback` function would take `...args` as arguments (for more information, see the [`client` object WebSocket communication](#initialization-and-websocket-communication) above).
- `receive(msg:String, callback:Function)`  
  The `receive` method executes the callback function `callback` when it receives the message `msg` sent by that instantiated client. Note: on the client side, the client sends the message with the command `client.send(msg:String, ...args:*)` (for more information, see the [`client` object WebSocket communication](#initialization-and-websocket-communication) above). In the `ServerClient.receive(msg:String, callback:Function)` method, the `callback` function takes `...args` as arguments.
- `broadcast(msg:String, ...args:*)`  
  The `broadcast` method sends the message `msg` and any number of values `...args` (of any type) to all the clients of the client's namespace — except that client — through WebSockets. Note: on the client side, the clients receive the message with the command `client.receive(msg:String, callback:Function)` where the `callback` function would take `...args` as arguments (for more information, see ).

### Client and server modules

#### Checkin

The `Checkin` module is responsible for keeping track of the connected clients by assigning them indices within the range of the available places in the scenario.

For instance, say that the scenario requires 12 players who sit on a grid of 3 ⨉ 4 seats: when a client connects to the server, the `Checkin` module will assign a seat within the remaining places of this grid.

Similarly, if the scenario takes place in a theater where seats are numbered, the `Checkin` module would allow the users to indicate what their seats are.

Or, if the scenario doesn't require the players to sit at particular locations, the `Checkin` module would just assign them indices within the range of total number of users this scenario supports.

The `ClientCheckin` module requires the SASS partial `sass/_05-checkin.scss`.

##### ClientCheckin

The `ClientCheckin` takes care of the checkin on the client side.

###### Methods

- `constructor(options:Object = {})`  
  The `constructor` method instantiates the `ClientCheckin` module on the client side. It takes the `options` object as an argument, whose optional properties are:
  - `color:String = 'black'`  
    Sets the background color of the view to `color` thanks to a CSS class of the same name. `color` should be the name of a class as defined in the library's `sass/_03-colors.scss` file.
  - `dialog:Boolean = false`  
    When set to `true`, the module displays a dialog (`this.view`) with the checkin information for the user. The user has to click on the dialog to indicate that the checkin process is `"done"`.
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
var seatmap = new serverSide.Seatmap({ type: 'matrix', cols: 3, rows: 4 });
var checkin = new serverSide.Checkin({ seatmap: seatmap });

// Case 2: the scenario does not have a seatmap
var checkin = new serverSide.Checkin({ numPlaces: 500, order: 'ascending' });
```

#### Control

##### ClientControl

###### Methods

- `constructor(options:Object = {})`    
  The `constructor` method instantiates the `ClientControl` module on the client side. It takes the `options` object as an argument, whose supported property is:
  - `gui:Boolean = false`  
    When set to `true` , the `gui` property makes the ClientControl display the Graphical User Interface (GUI) on the screen of the client. The GUI allows to edit the controls.

##### ServerControl

###### Attributes

- 

###### Methods

- `constructor()`  
  
- `addParameterNumber(name:String, label:String, min:Number, max:Number, step:Number, init:Number)`  
  
- `addParameterSelect(name:String, label:String, options:Object, init:)`  
  
- `addCommand(name:, label:, fun:)`  
  
- `addDisplay(name:, label:, init:)`  
  
- `setParameter(name:, value:)`  
  
- `setDisplay(name:, value:)`  
  

#### Module

The `Module` server and client classes are the base classes that any *Soundworks* module is based on.

##### ClientModule

The `ClientModule` extends the `EventEmitter` class. Each module should have a `.start()` and a `.done()` method, as explained in [How to write a module](#how-to-write-a-module). The `.done()` method must be called when the module has done its duty.

Any module that extends the `ClientModule` class requires the SASS partial `sass/general.scss`.

###### Attributes

- `view = null`  
  The `view` attribute of the module is the DOM element (a full screen `div`) in which the content of the module is displayed. This element is a child of the main container (`<div id='container' class='container'></div>), which is the only child of the `body` element. A module may or may not have a `view`, as indicated by the argument `hasDisplay:Boolean` of the `constructor`. When that is the case, the `view` is created in the DOM when the `.start()` method is called, and is removed from the DOM when the `.done()` method is called.

###### Methods

- `constructor(name:String, hasDisplay:Boolean = true, viewColor:String = 'black')`  
  The `constructor` method instantiates the `ClientModule` module on the client side. It takes up to three arguments:
  - `name:String`  
    The `name` of the the `this.view` DOM element, that is used both as an the ID of that element and as a class. (`this.view` would look like `<div id='name' class='name'></div>`.)
  - `hasDisplay:Boolean = true`  
    When set to `true`, the module creates the `this.view` DOM element with the id `id`.
  - `viewColor`  
    The `viewColor` argument should be a class name as defined in the library's `sass/_03-colors.scss` file, and changes the background color of the view to that color.
- `start()`  
  The `start` method is automatically called to start the module, and should handle the logic of the module on the client side. For instance, it takes care of the communication with the module on the server side by sending WebSocket messages and setting up WebSocket message listeners. If the module has a `view`, the `.start()` method creates the corresponding HTML element and appends it to the DOM's main container.
- `done()`  
  The `done` method should be called when the module has done its duty (for instance at the end of the `.start()` method you write). You should not have to modify this method, but if you do, don't forget to include `super.done()` at the end. If the module has a `view`, the `.done()` method removes it from the DOM.
- `setViewText(text:String, ...cssClasses:String):Element`  
  When `this.view` exists, the `.setViewText` method creates a `<div class='centered-text'></div>` and appends it to `this.view`. If `text` is specified, the method adds a paragraph element `<p>` to the `div`, with the `text` inside. Finally, any `cssClasses` you would specify would be added to that paragraph element. The method returns the `div` with the `centered-text` class.

In practice, here is an example of how you would extend this class to create a module on the client side.

```javascript
/* Client side */

var clientSide = require('soundworks/client');

class MyModule extends clientSide.Module {
  constructor(options = {}) {
    // Here, MyModule would always have a view, with the id 'my-module',
    // and possibly the background color defined by the argument options.
    super('my-module', true, options.color || 'alizarin');

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

In practice, here is how you would extend this class to create a module on the server side.

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

The `ClientCheckin` module requires the SASS partial `sass/_08-seatmap.scss`.

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

The `Sync` module is based on [`sync`](https://github.com/collective-soundworks/sync) and is responsible for synchronizing the clients' clocks and the server clock on a common clock, that we call “sync clock”. That way, the clients and the server can both use this shared clock as their common time reference.

For instance, this allows all the clients to do something exactly at the same time, such as displaying a color on the screen or playing a snare sound in a synchronized manner.

The `Sync` module does a first synchronization process after which the `ClientSync` emits the `'done'` event. Later on, the `Sync` module keeps resynchronizing the client and server clocks on the sync clock at random intervals to compensate the clock drift.

On the client side, `ClientSync` uses the `audioContext` clock. On the server side, `ServerSync` uses the `process.hrtime()` clock. All times are in seconds (method arguments and returned values). **All time calculations and exchanges should be expressed in the sync clock time.**

##### ClientSync

The `ClientSync` modules takes care of the synchronization process on the client side. It displays a `view` that indicates “Clock syncing, stand by…” until the very first synchronization process is `"done"`.

###### Methods

- `constructor(options:Object = {})`  
  The `constructor` method instantiates the `ClientSync` modules on the client side, and takes one optional argument:
  - `options:Object = {}`  
    The optional `options` argument customizes the configuration of the module. Its properties can be:
    - `color:String = 'black'`  
      Sets the background color of the view to `color` thanks to a CSS class of the same name. `color` should be the name of a class as defined in the library's `sass/_03-colors.scss` file.
- `getLocalTime(syncTime:Number) : Number`  
  The `getLocalTime` method returns the time in the client clock when the sync clock reaches `syncTime`. If no arguments are provided, the method returns the time is when the method is called, in the client clock (*i.e.* `audioContext.currentTime`). The returned time is a `Number`, in seconds.
- `getSyncTime(localTime:Number = audioContext.currentTime) : Number`  
  The `getSyncTime` method returns the time in the sync clock when the client clock reaches `localTime`. If no arguments are provided, the method returns the time it is when the method is called, in the sync clock. The returned time is a `Number`, in seconds.

Below is an example of an instantiation of the `Sync` module.

```javascript
/* Client side */

var clientSide = require('soundworks/client');
var sync = new clientSide.Sync();

var nowClient = sync.getLocalTime(); // current time in client clock time
var nowSync = sync.getSyncTime(); // current time in sync clock time
```
##### ServerSync

###### Methods

- `constructor()`  
  The `constructor` method instantiates the `ServerSync` module on the server side.
- `getLocalTime(syncTime:Number) : Number`  
  The `getLocalTime` method returns the time in the server clock when the sync clock reaches `syncTime`. If no arguments are provided, the method returns the time is when the method is called, in the server clock (*i.e.* a conversion of `process.hrtime()` in seconds). The returned time is a `Number`, in seconds.
- `getSyncTime(localTime:Number) : Number`  
  The `getSyncTime` method returns the time in the sync clock when the server clock reaches `localTime`. If no arguments are provided, the method returns the time it is when the method is called, in the sync clock. The returned time is a `Number`, in seconds.

Note: in practice, the sync clock used by the [`sync` module](https://github.com/collective-soundworks/sync) is the `process.hrtime()` server clock.

Below is an example of the instantiation of the `Sync` module on the server side.

```javascript
/* Server side */

var serverSide = require('soundworks/server');
var sync = new serverSide.Sync();

var nowServer = sync.getLocalTime() // current time in the server clock time
var nowSync = sync.getSyncTime() // current time in the sync clock time
```

## Example

In this section, we will build a simple scenario using *Soundworks*, that we'll call *My Scenario*. In *My Scenario*, any client that connects to the server plays a sound when joining the performance.

### 1. Create a new *Soundworks* project

Let's create a new *Soundworks* project. It should have the basic structure of an Express app, as shown below.

```
beats/
├── public/
│   └── sounds/
│       └── sound.mp3
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

On the client side, there are three things we need to do: set up the EJS file that will generate the HTML, write the Javascript code, and write the SASS files for styling.

#### Setting up the EJS file

Let's start with the easy part, the EJS file located in `beats/views/player.ejs`.

```html
<!doctype html5>
<html>
  <head>
    <!-- settings -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <!-- title -->
    <title><% title %></title>

    <!-- stylesheets -->
    <link rel="stylesheet" href="stylesheets/player.css">
    
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

- To load the `stylesheets/player.css` stylesheet that will be generated by the SASS file we'll write later,
- To load the `socket.io` library with `script(src="/socket.io/socket.io.js")`, since this is what we currently use to handle the WebSockets,
- To have a `<div>` element in the `body` that has the ID `#container` and a class `.container`,
- And to load the Javascript file `/javascripts/player.js`.

#### Writing our scenario in Javascript

Now let's write the core of our scenario in the `src/player/index.es6.js` file. This is the file that is loaded by any client who connects to the server through the root URL `http://my.domain.name:port/` (for instance, `http://localhost:8000` during the development).

Step by step, this is how the scenario will look like when a user connects to the server through that URL:

- The screen displays a `welcome` message that the user has to click on to enter the scenario,
- The clients has a `checkin` process with the server while a `loader` process loads the audio file to play,
- Finally, the user enters the `performance` where the smartphone emits a recorded sound.

First of all, let's load the library and initialize our WebSockets namespace (currently, with `socket.io`).

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
window.addEventListener('load', () => {

  var welcome = new clientSide.Dialog({
    id: 'welcome',
    text: "<p>Welcome to <b>My Scenario</b>.</p> <p>Touch the screen to join!</p>",
    activateAudio: true
  });

  ... // the rest of the scenario logic
});
```

Here:

- The `id` parameter corresponds to the `id` attribute of the HTML element in which the content of the module is displayed.
- The `text` parameter contains the text to display on the screen when the module is displayed.
- Finally, we set the property `activateAudio` to `true` to enable the sound on iOS devices as well as to start the Web Audio clock (that will be required for the synchronization process).

*This step is required in almost any scenario you could imagine, at least to activate the Web Audio on iOS devices.*

##### Checkin module

The `Checkin` module allows the client to register on the server and to get an index that we can refer to later (like an ID). In some cases, the `Checkin` module could also assign a physical place to the client (for instance if the performance takes place in a theater and that the user has a precise seat), but this is not the case in this example. Thus, there are no informations to display, which is why we use the option `dialog: false`.

```javascript
window.addEventListener('load', () => {
  ... // what we've done already

  var checkin = new clientSide.Checkin({ dialog: false });

  ... // the rest of the scenario logic
});
```

##### Loader module

The `Loader` module allows the client to load audio files that are stored in a `audioBuffers` array.

```javascript
var file = ['sounds/sound.mp3']; // the path to the audio file in the public folder

window.addEventListener('load', () => {
  ... // what we've done already

  var loader = new clientSide.Loader(file);

  ... // the rest of the scenario logic
});
```

##### Performance module

To create the performance, we have to write our own module `MyPerformance`. Let's start with the constructor. Since we want the performance to display something on the screen, we call `super('performance', true)`: this indicates that we want to create the `view` DOM element in a `<div>` with the `id` attribute being `'performance'` (please refer to [*How to write a module*](#how-to-write-a-module) and [*Module*](#module) for more information).

```javascript
class MyPerformance extends clientSide.Module {
  constructor(loader) {
    super('performance', true);

    this.loader = loader; // the loader module
  }

  ... // the rest of the class
}
```

Then, we write the `.start()` method that is called when the performance starts. We want that method to tell the server that the client just started the performance (`client.send('perf_start');`), and to play a sound on the server's command (`client.receive('play_sound', callback)`). (Note: we could directly play the sound in the start method, but we show some client / server communication here for the the purpose of the tutorial.) In theory, we would also need to call the '.done()' method when the purpose of this module is done, but since the performance is the last thing that happens in *My Scenario*, we don't need to do it.

```javascript
class MyPerformance extends clientSide.Module {
  ... // the constructor

  start() {
    super.start(); // mandatory

    // Send a message to the server indicating that we started the performance
    client.send('perf_start');

    // Play a sound when we receive a message from the server
    client.receive('play_sound', () => {
      let bufferSource = audioContext.createBufferSource();
      bufferSource.buffer = this.loader.audioBuffers[0]; // get the audioBuffers from the loader
      bufferSource.connect(audioContext.destination);
      bufferSource.start(audioContext.currentTime);

      this.setViewText('Congratulations, you just played a sound!'); // display some feedback text in the view

      /* We would usually call the .done() method when the module has done its duty,
       * however since the performance is the last module to be called in this scenario,
       * we don't need it.
       */
      // this.done(); 
    });
  }
}
```

Now let's glue everything together.

```javascript
window.addEventListener('load', () => {
  // Instantiate the modules
  var welcome = new clientSide.Dialog({
    id: 'welcome',
    text: "<p>Welcome to <b>My Scenario</b>.</p> <p>Touch the screen to join!</p>",
    activateAudio: true
  });
  var checkin = new clientSide.Checkin({
    dialog: false
  });
  var loader = new clientSide.Loader(file);
  var performance = new MyPerformance(loader);

  // Start the scenario and link the modules
  client.start(
    client.serial(
      client.parallel( // we launch in parallel the welcome module, the loading of the files, and the checkin
        welcome,
        loader,
        checkin
      ),
      performance // when all of them are done, we launch the performance
    )
  );
}
```

#### Writing the SASS file(s) for styling

The last thing we have to do on the client side is to write the SASS file(s) that will generate the `public/player.css` file.

To do that, let's first copy all the library's SASS partials (that you'll find in `sass/` in the `src/sass/lib/` folder of our project.

Among them, there are four SASS partials that we'll always need in any scenario:
- `_01-reset.scss`, that resets the CSS rules of several DOM elements,
- `_02-fonts.scss`, that sets up the Quicksand font,
- `_03-colors.scss`, that sets up some color SASS variables,
- `_04-general.scss`, that sets up the general CSS that is common to all the modules.

Then, we notice that in `player/index.es6.js`, we used 3 different modules from the library: `ClientDialog` for the `welcome` module, `ClientCheckin` for the `checkin` module, and `ClientLoader` for the `loader` module. Among these, the `Loader` and the `Checkin` require a SASS partial (cf. the [API section](#api) above).

So there we go, let's write our `src/sass/player.css` file by requiring the partials we need.

```sass
@import '01-reset';
@import '02-fonts';
@import '03-colors';
@import '04-general';
@import '05-checkin';
@import '07-loader';
```

You could also add your own SASS code (that goes along the `MyPerformance` module, for example) if needed.

### 3. Server side

On the server side, we now edit the file `src/serv/index.es6.js`. First, we require the libraries and set up the Express app.

```javascript
// Soundworks library
var serverSide = require('soundworks/server');
var server = serverSide.server;

// Express application
var express = require('express');
var app = express();
var path = require('path');
var dir = path.join(__dirname, '../../public');
```

Then, we setup the modules that the client needs to communicate with. In this example, there is the `Checkin` module, and the performance module we'll need to write ourselves.

For the `Checkin` module, since we don't need a map of the seats or anything like that, we just indicate the maximum number of players this performance allows, and the order in which the module assigns the indices.

```javascript
var checkin = new serverSide.Checkin(
  numPlaces: 1000, // we accept a maximum of 1000 players
  order: 'ascending' // we assign the indices in ascending order
);
```

Finally, we have to write the performance module. The `.connect(client)` method is called when the client `client` connects to the server: when that happens, we simply send a WebSocket message back when the server receives a message from the client indicating that it started the performance. In this example, nothing needs to be done when the client disconnects from the server.

```javascript
class MyPerformance extends serverSide.Module {
  constructor() {}

  connect(client) {
    client.receive('perf_start', () => {
      client.send('play_sound');
    });
  }

  disconnect(client) {}
}

```

We can now instantiate the performance module, and start the server and map the `/player` namespace to the modules we just set up: this last command indicates that all clients connecting to the `/player` namespace (through the root URL) will need to communicate with the `checkin` and `performance` modules on the server side.

```javascript
var performance = new MyPerformance()

server.start(app, dir, 8000); // start the application app, with the public directory dir, on port 8000
server.map('/player', 'My Scenario', checkin, performance);
```

Congratulations, you just created your first scenario! You will find the source code in the [`soundworks-template` repository](https://github.com/collective-soundworks/soundworks-template). To compile the files, just run the `gulp` command in the project folder in the Terminal, and you can access the scenario by going to the URL `http://localhost:8000/`.
