# SOUNDWORKS

## Table of contents

- [**Overview & getting started**](#overview--getting-started)
  - [Client/server architecture](#clientserver-architecture)
  - [Express app structure](#express-app-structure)
  - [Composing a scenario from modules](#composing-a-scenario-from-modules)
  - [Modules provided by the library](#modules-provided-by-the-library)
  - [Implementing a module](#implementing-a-module)
  - [The performance module](#the-performance-module)
  - [Styling with SASS](#styling-with-sass)
- [**API**](#api)
  - [Core objects](#core-objects)
    - [Client side: the `client` object](#client-side-the-client-object)
    - [Server side: the `server` object](#server-side-the-server-object)
  - [Basic/base classes](#basicbase-classes)
    - [The `ServerClient` class](#serverclient)
    - [The `Module` base class](#the-module-base-class)
    - [The `Performance` base class](#the-performance-base-class)
  - [Client only modules](#client-only-modules)
    - [`ClientDialog`](#clientdialog)
    - [`ClientLoader`](#clientloader)
    - [`ClientOrientation`](#clientorientation)
    - [`ClientPlatform`](#clientplatform)
  - [Client/server modules](#clientserver-modules)
    - [`Checkin`](#checkin)
    - [`Control`](#control)
    - [`Setup`](#setup)
    - [`Sync`](#sync)
- [**Example**](#example)

## Overview & getting started

*Soundworks* is a Javascript framework that enables artists and developers to create collaborative music performances where a group of players distributed in space use their mobile devices to generate sound and light through touch and motion.

The framework is based on a client/server architecture supported by `Node.js` (`v0.12.0` or later) and WebSockets, and uses a modular design to make it easy to implement different performance scenarios: the [*Soundworks* template](https://github.com/collective-soundworks/soundworks-template) allows anyone to bootstrap a *Soundworks*-based scenario and focus on its audiovisual and interaction design instead of the infrastructure.

### Client/server architecture 

In order to connect the mobile devices with each other, *Soundworks* implements a client/server architecture using a `Node.js` server and WebSockets to pass messages between the server and the clients (currently with the `socket.io` library).

In general, a *Soundworks* scenario allows different types of clients to connect to the server through different URLs. The most important kind clients are the mobile devices of the players who take part in the performance (we refer to this type of client as `player`). For convenience, a player connects to the server through the root URL of the application, `http://my.server.address:port/`.

In addition to the players, a scenario can include other kinds of clients such as:
- A device that provides an interface to control some parameters of the performance in real time. We would refer to this type of client as `conductor`. These clients would connect to the server through the URL `http://my.server.address:port/conductor`.
- A device that generates "environmental" sound and/or light effects projected into the performance in sync with the players’ performance, such as lasers, a global visualization or ambient sounds on external loudspeakers. We would refer to this type of client as `env`. These clients would connect to the server through the URL `http://my.server.address:port/env`.

Clients that connect through the root URL (*e.g* `http://my.server.address:port/`) are considered as `player` clients. All other types of clients access the server through a URL that concatenates the root URL of the application and the name of the client type (*e.g* `http://my.server.address:port/conductor or `http://my.server.address:port/env``).

### Express app structure

Since *Soundworks* is built on Express, any scenario you write using *Soundworks* should follow the organization of an Express app (using the EJS rendering engine), as shown in the example below.

```
my-scenario/
├── public/
│   ├── fonts/
│   ├── sounds/
│   └── ...
├── src/
│   ├── player/
│   ├── conductor/
│   ├── env/
│   ├── ...
│   ├── sass/
│   └── server/
├── views/
│   ├── player.ejs
│   ├── conductor.ejs
│   ├── env.ejs
│   └── ...
├── gulpfile.js
├── package.json
└── README.md
```

For instance:
- The `public/` folder should contain any resources the clients may need to load such as sounds, images, fonts, etc.  
  **Note:** the Javascript and CSS files will be automatically generated with the `gulp` file from the `src/` folder, so there shouldn’t be any `javascript/` or `stylesheets/` folder here (they will be deleted by `gulp` anyway).
- The `src/` folder contains the source code for the server and the different types of clients. Each subfolder (`server/`, `player/`, and any other type of client) should contain an `index.es6.js` file, with the code to be executed for that entity. The `src/` folder also contains the SASS files to generate the CSS in the `sass/` subfolder.
- The `views/` folder contains a `*.ejs` file for each client type. In other words, all the subfolders in `src/` — except `server/` and `sass/` — should have their corresponding EJS file.

To compile the files, just run the command `gulp` in the Terminal: it will generate the `*.css` files from the SASS files, convert the Javascript files from ES6 to ES5, browserify the files on the client side, and launch a `Node.js` server to start the scenario.

A scenario should contain at least the `src/server/`, `src/player/` and `src/sass/` folders:
- The `src/server/` folder contains all Javascript files that compose the server.
- The `src/player/` folder contains all the files that compose the `player` clients.
- Finally, the `src/sass/` folder contains the SASS files to generate the CSS.

To add an additional client type you have to create a subfolder (*e.g.* `src/env/` or `src/conductor/`) that contains a file `index.es6.js`. The command `client.init('env');` (respectively 'conductor') declares the client type and associates it to the URL `http://my.server.address:port/env` (respectively `http://my.server.address:port/conductor`).

To each client type corresponds an JS view file in `my-scenario/views’. The view file of the `player` clients (`my-scenario/views/player.ejs`) would look as follows:

```html
<!doctype html5>
<html>
  <head>
    <!-- settings -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <!-- title -->
    <title>My Scenario – Player</title>

    <!-- stylesheets -->
    <link rel="stylesheet" href="stylesheets/player.css">
  </head>

  <body>
    <div id="container" class="container"></div>
    <script src="javascripts/player.js"></script>
  </body>
</html>
```

The most important things here are:
- loading the `stylesheets/player.css` stylesheet that will be generated by the SASS file we’ll write later,
- having a `div` element in the `body` that has the ID `#container` and a class `.container`, and
- loading load the `javascripts/player.js` Javascript file.
- setting the title of the page

### Composing a scenario from modules

A scenario built with *Soundworks* consists in a succession and combination of modules, each of them corresponding to a step of the scenario. 
#### Client side

On the client side, modules can be executed in a particular order according to a given application scenario and the involved interactions with the user. As an example, a scenario could provide the following interactions when a participant connects as `player` client to the application’s root URL:
- The mobile devices displays a *welcome* message (*e.g.* "Welcome to the performance!"). When the participant clicks on the screen…
- the client goes through a *check-in* procedure to register as player and the device may display some instructions. In the meantime, …
- the client *synchronizes* its clock with the server. Finally, when these are done… 
- the client joins the *performance*.

Each of these steps corresponds to a module. While most of the modules are provided by the library, generally, you will have to implement a module that implements the most important part of your application – the `performance`. 

The client side code corresponding to the above example of a `player` client (in `src/player/index.es6.js`) would look like this:

```javascript
// Client side (require the Soundworks library and client object)
var clientSide = require('soundworks/client');
var client = clientSide.client;

// Initialize client with a given client type and associate it to the corresponding URL ('player' clients connect via the root URL)
client.init('player');

// Write the performance module
class MyPerformance extends clientSide.Performance {
  ...
}

// Scenario
window.addEventListener('load', () => {
  // Initialize the modules
  var welcome = new clientSide.Dialog(...);
  var sync = new clientSide.Sync(...);
  var checkin = new clientSide.Checkin(...);
  var performance = new MyPerformance(...);
  
  // Launch the modules in a particular order
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
});
```

To run a sequence of modules in series, we use `client.serial(module1, module2, ...)`. On the other hand, if some modules need to be run in parallel, we use `client.parallel(module1, module2, ...)`. (see [`client` object module logic](#module-logic)).

For any other type of client such as `env` or `conductor`, the file would look very similar except that the client would be initialized with the corresponding client type and the included modules might be different. The `env` clients, for example, may require a `sync` and `performance` module, but do not need a `welcome` screen nor a player `checkin`.

Some of the modules on the client side need to communicate with the server. The `sync` process, for example, requires a dialog between the client and the server to synchronize the clocks.

#### Server side

The server side of the application has to provide the server modules responding to the client side modules. The server side code (in `src/server/index.es6.js`) corresponding to this example would look like this:

```javascript
// Server side (require the Soundworks library and server object)
var serverSide = require('soundworks/server');
var server = serverSide.server;

// Setup the Express app
var express = require('express');
var app = express();

// Start the server with a given public directory and port
var path = require('path');
var dir = path.join(__dirname, '../../public');
server.start(app, dir, 3000);

// Implement the player and env performance modules
class MyPlayerPerformance extends serverSide.Performance {
  ...
}

class MyEnvPerformance extends serverSide.Performance {
  ...
}

// Create the modules
var checkin = new serverSide.Checkin(...);
var sync = new serverSide.Sync(...);
var playerPerformance = new MyPlayerPerformance(...);
var envPerformance = new MyEnvPerformance(...);

// Map the server modules to the 'player' client type (and root URL)
server.map('player', sync, checkin, playerPerformance);

// Map the server modules to the 'env' client type (and /env URL)
server.map('env', sync, envPerformance);
```

After having set up the Express app and started the server, this code sequence creates the server side modules `checkin`, `sync`, and `performance` that respond client side modules of the example above. All three modules are mapped to the `player` (default) client type and consequently respond to the `player` clients connected via the root URL of the application. In addition, the `sync` module is mapped to the `env` client type together with a `performance` module for the `env` client(s).

While all modules in this code sequence have a client and a server component, some modules might occur only on the client side. This is, for instance, the case for the `dialog` module in the player client setup above. The module only displays a welcome dialog to the participant that does not involve any interaction between the client and server.

### Modules provided by the library

The *Soundworks* library provides a set of modules that are used in many scenarios:  
- [`dialog`](#clientdialog), display a dialog and wait for the participant touching the screen (client side only)
- [`loader`](#clientloader), pre-load a set of audio files required by the application (client side only)
- [`orientation`](#clientorientation), compass calibration in interaction with the participant (client side only)
- [`platform`](#clientplatform), check whether the client device and browser is capable to properly run the application and display a blocking dialog if not (client side only)
- [`checkin`](#checkin), obtain a client index and, optionally, a position in a static setup
- [`control`](#control), synchronize the client clock to the server
- [`setup`](#setup), load or generate the setup of a performance space including a surface (*i.e.* dimensions and outlines) and predefined positions (*e.g.* seats or labels on the floor)
- [`sync`](#sync), synchronize the client clock to the server

### Implementing a module

As mentioned above, a scenario implemented with the *Soundworks* library is essentially composed of a set of modules. Generally – even if not always –, a module consists of a client and a server part that exchange messages.
Below we will take a simplified version of the `checkin` module as an example for the different ingredients of a module on the client and server.

Please refer to the API section below for the complete documentation of the [`ClientModule`](#clientmodule) and [`ServerModule`](#servermodule) base classes.

#### Client side

On the client side, a module extends the `ClientModule` base class. The module has to implement a `start` method and has to call its `done` method to hand over the control to the next module.

Most modules would call their `done` method when their process is complete. For instance, if the purpose of a module is to load files, the module would call its `done` method when the files are loaded. However, some modules continue processing in the background even after calling that method. This is for example the case of the `sync` module. The module calls its `done` method after the client clock is synchronized with the sync clock for the the very first time, and keeps running in the background afterwards to re-synchronize the clocks regularly during the rest of the scenario.

The `start` method is called to start the module. It should handle the logic and the steps that lead to the completion of the module.

The `done` method implemented by the `ClientModule` base class is called by the derived client module to hand over control to the next module. As an exception, the last module of the scenario (usually the `performance` module) may not call that method and keep the control until the client disconnects from the server. A derived client module must not override the `done` method provided by the base class.

The purpose of the `ClientCheckin` module in the code example below is to assign an available client identifier (*i.e.* an index) each time a client connects to the server. When the module is configured with a `setup` that includes predefined positions and labels, it can automatically request an available positions and display the associated `label` to the player (in other configurations, the players alternatively could select their seat, or indicate their approximate position on a map).

In detail, the `start` method of the module sends a request to the `ServerCheckin` module via WebSockets, asking the server to send an available index and, optionally, a label of the corresponding seat. When it receives the response from the server, it either displays the label on the screen (*e.g.* "Please go to seat C5 and touch the screen.") and waits for the participant’s acknowledgement or immediately calls the method `done` to hand over the control to a subsequent module (generally the `performance`). The server may send an `unavailable` message in case that no more clients can be admitted to the performance, for example when all seats are taken. In this case, the applications ends on a blocking dialog ("Sorry, we cannot accept more players at the moment, ...") without calling the `done` method.

```javascript
// Client side (get client object)
var client = require('./client');

class ClientCheckin extends ClientModule {
  constructor() {
    // call base class constructor declaring a name, a view and a backgroud color
    super(‘checkin’, true, ‘black’);
  }

  start() {
    super.start(); // call base class start method (don’t forget!)

    // request an available player index from the server
    client.send('checkin:request');

    // receive acknowledgement with player index and optional label
    client.receive('checkin:acknowledge', (index, label) => {
      client.index = index;
      
      if(label) {
        // display the label in a dialog
        this.setCenteredViewContent("<p>Please go to seat " + label + " and touch the screen.<p>");

        // call done when the participant acknowledges the dialog
        this.view.addEventListener('click', () => this.done());
      } else {
        this.done();
      }
    }

    // no player index available
    client.receive('checkin:unavailable', () => {
      this.setCenteredViewContent("<p>Sorry, we cannot accept more players at the moment, please try again later.</p>");
    });
  }

  ... // the rest of the module

}
```

As shown in this code sequence, the `ClientModule` base class may provide a `view` (*i.e.* an HTML `div`) that is added to the window (actually to a `container` element) when the module is started and removed when the module calls `done`. The boolean that is passed as second argument to the constructor of the base class determines whether the module actually creates a view.
The method `setCenteredViewContent` allows for adding an arbitrary centered content (*e.g.* a paragraph of text) to the view.

#### Server side

On the server side, a module extends the `ServerModule` base class and has to implement a `connect` and a `disconnect` method.
While the sequence of user interactions and exchanges between client and server is determined on the client side, the server side modules are ready to receive requests from the corresponding client side modules as soon as a client is connected to the server.

When a client `client` of a particular type connects to the server via the corresponding URL, the server calls the `connect` method of all modules that are mapped to that client type. In the `connect` method, the module should set up WebSocket listeners, in order to serve incoming requests from the corresponding client side module.

Similarly, the `disconnect` method is called whenever the client `client` disconnects from the server. It handles all the actions that are necessary in that case.

In our simplified `ServerCheckin` module example, the `connect` method has to install a listener that – on the request of the client – would obtain an available player index and send it back to the client. If the module has been configured with a setup predefining a number of seats, the server additionally sends the label of the seat corresponding to the index. In this case, the maximum number of players is determined by the number of seas defined by the setup. 

The `disconnect` method has to release the player index so that it can be reused by another client that connects to the server.

```javascript
// Server side (require the Soundworks library server side)
var serverSide = require('soundworks/server');

class ServerCheckin extends serverSide.Module {
  constructor(options = {}) {
    super();
    
    // store setup
    this.setup = options.setup || null;
    this.maxPlayers = options.maxPlayers || Infinity;

    // clip max number of players 
    if(setup) {
      var numPlaces = setup.numPlaces;

      if(this.maxPlayers > numPlaces)
        this.maxPlayers = numPlaces;
    }
  }

  connect(client) {
    // listen for incoming WebSocket messages from the client side
    client.receive('checkin:request', () => {
      // get an available index
      let index = this._getIndex();

      if (index >= 0) {
        client.index = index;

        var label = undefined;

        if(this.setup) {
          // get a seat label
          let label = this.setup.getLabel(index);

          // get player position according to the setup
          client.position = this.setup.getPosition(index);
        }

        // acknowledge check-in to client
        client.send('checkin:acknowledge', index, label);
      } else {
        // no player indices available
        client.send('checkin:unavailable');
      }

    disconnect(client) {
      // release player index
      this._releaseIndex(client.index);
    });
  }

  ... // the rest of the module

}
```

### The *performance* module

In many applications, the only module you will have to implement yourself is the performance module. As in the example above, a `player` client usually enters the performance through a `checkin` module that assigns it an index and, optionally, a position. If no further setup is required after the `checkin` the client side control is usually handed over to the `performance` module.

The *Soundworks* library provides the base classes `ClientPerformance` and `ServerPerformance` that you would extend to implement the `performance` of your application.

On the client side, the `start` method of the `performance` module derived from `ClientPerformance` is called when the client enters the performance. On the server side, the `ServerPerformance` class provides the methods `enter` and `exit` that are called when a client enters or exits the performance. The `exit` method is called when the client side module of a given client calls the `done` method or if a client disconnects from the application. In addition, `ServerPerformance` maintains an array of clients that entered the performance as the `clients` attribute.

In the following example of a *very* simple performance module. In this scenario, the player's device plays a welcome sound when it joins the performance and another sound when another player joins.

```javascript
class MyPerformance extends clientSide.Performance {
  constructor(loader, options = {}) {
    super(options); // same behavior as the base class

    this.loader = loader; // the loader module
  }

  start() {
    super.start(); // call base class constructor (don't forget this)

    // Play welcome sound (first sound loaded)
    let src = audioContext.createBufferSource();
    src.buffer = this.loader.audioBuffers[0]; 
    src.connect(audioContext.destination);
    src.start(audioContext.currentTime);

    this.setCenteredViewContent('Let’s go!'); // display some feedback text in the view

    // Play sound when receiving the play message (second sound loaded)
    client.receive('performance:play', () => {
      let src = audioContext.createBufferSource();
      src.buffer = this.loader.audioBuffers[1];
      src.connect(audioContext.destination);
      src.start(audioContext.currentTime);

      // Since the performance does not end before the player disconnects,
         this module does not call the .done() method.
    });
  }
}
```

```javascript
class MyPerformance extends serverSide.Performance {
  constructor() {
    super();
  }
  
  // when the client enters the performance...
  enter(client) {
    super.enter(client); // don't forget this

    // send a play message to all other player clients
    client.broadcast('performance:play'); 
  }
}

```
### Styling with SASS

Finally, the `src/sass/` folder would contain all the SASS partials we need for the modules from the library, and include them all in a `env.scss` file, where `env` can be `player`, `conductor`, `env`, or any other type of client you create. Since the `player` is the default client in any *Soundworks*-based scenario, the `src/sass/` should at least contain the `player.scss` file.

For instance, in our previous example where the client has a `welcome`, `sync`, `checkin` and `performance` module, the `player.scss` file could look like this.

```sass
// General styling: these partials should be included in every env.scss file
@import '01-reset';
@import '02-fonts';
@import '03-colors';
@import '04-general';

// Module specific partials: check in the documentation which modules have an associated SASS file
@import '77-checkin';

// Your own partials for the modules you wrote
@import 'performance'
```
## API

This section explains how to use the objects and classes of the library. In particular, we list here all the methods and attributes you may need to use at some point.

We start with the core elements on the client side ([`client` object](#client-side-the-client-object)) and on the server side ([`server` object](#server-side-the-server-object)) before focusing on the classes that form the modules.

Some classes are only present on the [client side](#client-only-modules):
- [`Dialog`](#clientdialog)
- [`Platform`](#clientplatform)
- [`Loader`](#clientloader)
- [`Orientation`](#clientorientation)

Others are only present on the [server side](#server-only-modules):
- [`Client`](#serverclient)

The rest of the classes require both the [client **and** server sides](#client-and-server-modules):
- [`Checkin`](#checkin)
- [`Control`](#control)
- [`Module`](#module)
- [`Performance`](#performance)
- [`Sync`](#sync)

Some modules on the client side are associated with dedicated styling information. When that is the case, we added in the library’s `sass/` folder a `_77-moduleName.scss` SASS partial. You should not forget to include them in your `*.scss` files when you write your scenario. We indicate in the sections below which modules require their corresponding SASS partials.

### Core objects

The core objects on the client side and the server side are singletons that contain the methods and state used to set up a scenario and to exchange messages between the client and the server.

#### Client side: the `client` object

The `client` object contains the basic state and methods of the client. For instance, the object initializes the client with a given type and to establish WebSocket communications with the server through to the methods `send` and `receive`. It starts the scenario and sequences the modules using the methods `start`, `serial` and `parallel`.

For the sake of clarity, the methods of the `client` object are split into two groups.

##### Initialization and WebSocket communication

- `init(clientType:String)`  
  The `init` method sets the client type and initializes a WebSocket connection associated with the given type.
- `send(msg:Object, ...args:Any)`  
  The `send` method  sends the message `msg` and any number of values `...args` (of any type) to the server through WebSockets.  
  **Note:** on the server side, the server receives the message with the command `ServerClient.receive(msg:String, callback:Function)` (see the [`ServerClient` module methods](#serverclient) below).
- `receive(msg:Object, callback:Function)`  
  The `receive` method executes the callback function `callback` when it receives the message `msg` sent by the server.  
  **Note:** on the server side, the server sends the message with the command `server.send(msg:String, ...args:Any)` (see the [`server` object WebSocket communication](#websocket-communication) section below).
##### Module logic

- `start(module:ClientModule)` 
  The `start` method starts the client’s module logic with the module `module`. The argument `module` can either be:
    - a module from the library or a module you wrote (in case that your scenario has only one module)
    - a `serial` sequence of modules
    - a `parallel` combination of modules
- `serial(...modules:ClientModule) : ClientModule`  
  The `serial` method returns a `ClientModule` that starts the given `...modules` in series. After having started the first module, the next module in the series is started when the last module called its `done` method. When the last module calls `done`, the returned serial module calls its own `done` method.
- `parallel(...modules:ClientModule) : ClientModule`
  The `ClientModule` returned by the `parallel` method starts the given `...modules` in parallel, and calls its `done` method after all modules are  `done`.
  **Note:** The view of a module is always full screen, so in the case of modules run in parallel, the view of all the modules are added to the DOM when the parallel module starts, and they are stacked on top of each other in the order of the arguments using the `z-index` CSS property.
  You can compound parallel module combinations with serial module sequences (*e.g.* `client.parallel(module1, client.serial(module2, module3), module4)`);  

#### Server side: the `server` object

The `server` object contains the basic state and methods of the server. For instance, this object allows setting up, configure and start the server with the method `start`. The method `map`, allows for managing the mapping between different types of clients and their required server modules.

For the sake of clarity, the methods of `server` are split into two groups.

##### Initialization and module logic

- `start(app:Object, publicPath:String, port:Number)`  
  The `start` method starts the server with the Express application `app` that uses `publicPath` as the public static directory, and listens to the port `port`.
- `map(clientType:String, ...modules:ServerModule)`  
  The `map` method is used to indicate that the clients of this type require the given server modules `...modules` and routes the connections from the corresponding URL the corresponding view (except for the `player` clients that are mapped to the root URL `/` instead of `/player`). More specifically:
  - a client connecting to the server through the root URL `http://my.server.address:port/` is considered as a `player` client and displays the view `player.ejs`
  - a client connecting to the server through the URL `http://my.server.address:port/env` would be considered as an `env` client display the view `env.ejs`.

##### WebSocket communication

- `broadcast(clientType:String, msg:String, ...args:Any)`  
  The `broadcast` method sends the message `msg` and any number of values `...args` (of any type) to all the clients of the given type through WebSockets.  
  **Note:** on the client side, the clients receive the message with the command `client.receive(msg:String, callback:Function)`, where the `callback` function would take `...args` as arguments (see the [`client` object WebSocket communication](#initialization-and-websocket-communication) section above).

### Basic/base classes

#### The ServerClient class

The `ServerClient` module is used to keep track of the connected clients and to communicate with the corresponding client via WebSockets (see the [`client` object WebSocket communication](#initialization-and-websocket-communication) section above). Each time a client connects to the server, *Soundworks* creates an instance of `ServerClient`. 

###### Methods

- `send(msg:String, ...args:Any)`  
  The `send` method sends the message `msg` and any number of values `...args` (of any type) to that client through WebSockets.  
- `receive(msg:String, callback:Function)`  
  The `receive` method executes the callback function `callback` when it receives the message `msg` sent by that instantiated client.  
- `broadcast(msg:String, ...args:Any)`  
  The `broadcast` method sends the message `msg` and a list of arbitrary arguments `...args` to all other clients of the same type (*i.e.* excluding the given client itself) through WebSockets.

###### Attributes

- `type:String`  
  The `type` attribute stores the type of the client. This is the client type that is specified when initializing the `client` object  on the client side with `client.init(clientType);` (generally at the very beginning of the Javascript file your write).
- `index:Number = 0`
  The `index` attribute stores the index of the client as set by the `ServerCheckin` module (see [`ServerCheckin` module](#servercheckin)).
- `position:Array = null`
  The `position` attribute stores the position of the client as an [x, y] array (see [`ServerCheckin` module](#servercheckin)).
- `modules:Object = {}`  
  The `modules` property is used by any module to associate data to a particular client. Each module prefixes the properties that it associates to a client by the module's name (the prefix is created by the 'ServerModule' base class – see [`ServerModule`](#servermodule)). For instance, if the `sync` module keeps track of the time offset between the client’s and the server's clock, it would store the information in `this.modules.sync.timeOffset`. Similarly, if the `performance` module needs some kind of flag for each client, it would store this information in `this.modules.performance.flag`.

#### The `Module` base class

The `Module` server and client classes are the base classes that any *Soundworks* module should extend. The base classes define interfaces to be implemented by the derived modules as well as they provide a set of attributes and methods that facilitate the implementation of modules.

##### ClientModule

The `ClientModule` extends the `EventEmitter` class. Each module should have a `start` and a `done` method, as explained in the [Implementing a module](#implementing-a-module) section. The `done` method must be called when the module can hand over the control to the subsequent modules (*i.e.* when the module has done its duty, or when it has to run in the background for the rest of the scenario after it finished its initialization process). The base class optionally creates a view – a fullscreen DOM element (*i.e.* a `div`) accessible through the `view` attribute – that is added to the DOM when the module is started and removed when the module calls done.

Any module that extends the `ClientModule` class requires the SASS partial `sass/general.scss`.

###### Methods

- `constructor(name:String, hasView:Boolean = true, viewColor:String = 'black')`  
  The `constructor` accepts up to three arguments:
  - `name:String`, name of the module that is also the identifier and class of the module's `view` DOM element. (<div id='name' class='module name'></div>`)
  - `hasView:Boolean = true`, determines whether the module creates the `view` DOM element
  - `viewColor`, background color of the module's view (class name defined in the library’s `sass/_03-colors.scss` file)
- `start()`  
  The `start` method is called to start the module, and should handle the logic of the module on the client side. For instance, it takes care of the communication with the module on the server side by sending WebSocket messages and setting up WebSocket message listeners. If the module has a view, the `start` method creates the corresponding HTML element and appends it to the DOM’s main container `div`.
- `done()`  
  The `done` method should be called when the module has done its duty (for instance at the end of the `start` method you write). You should not have to modify this method, but if you do, don’t forget to include `super.done()` at the beginning of the method. If the module has a view, the `done` method removes it from the DOM.
- `setCenteredViewContent(htmlContent:String)`  
  The `setCenteredViewContent` set an arbitrary centered HTM content to the module's view. The method should be called only if the module has a view.
- `removeCenteredViewContent()`  
  The `removeCenteredViewContent` method removes the centered HTML content set by `setCenteredViewContent` from the DOM.

###### Attributes

- `view = null`  
  The `view` attribute of the module is the DOM element (a full screen `div`) in which the content of the module is displayed. This element is a child of the main container (`<div id='container' class='container'></div>`), which is the only child of the `body` element. A module may or may not have a view, as indicated by the argument `hasView:Boolean` of the `constructor`. When that is the case, the view is created and added to the DOM when the `start` method is called, and is removed from the DOM when the `done` method is called.

In practice, here is an example of how you would extend this class to create a module on the client side.

```javascript
// Client side (require the Soundworks library client side)
var clientSide = require('soundworks/client');

class MyModule extends clientSide.Module {
  constructor(options = {}) {
    // Here, MyModule would always have a view, with the id and class 'my-module',
    // and possibly the background color defined by the argument 'options'.
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

The `ServerModule` extends the `EventEmitter` class. Each module should have a `.connect(client:ServerClient)` and a `.disconnect(client:ServerClient)` method, as explained in the [Implementing a module](#implementing-a-module) section.
The connect method of the module creates a 

###### Methods

- `constructor()`  
  The `constructor` does not accept any arguments or options.
- `connect(client:ServerClient)`  
  The `connect` method is called when the client `client` connects to the server, and should handle the logic of the module on the server side. For instance, it can take care of the communication with the client side module by setting up WebSocket message listeners and sending WebSocket messages, or it can add the client to a list to keep track of all the connected clients.
- `disconnect(client:ServerClient)`  
  The `disconnect` method is called when the client `client` disconnects from the server, and should do the necessary when that happens. For instance, it can remove the client from a list of connected clients.

In practice, here is how you would extend this class to create a module on the server side.

```javascript
// Server side (require the Soundworks library server side)
var serverSide = require('soundworks/server');

class MyModule extends serverSide.Module {
  constructor() {
    ... // anything the constructor needs
  }

  connect(client) {
    ... // what the module has to do when a client connects to the server
  }

  disconnect(client) {
    ... // what the module has to do when a client disconnects from the server
  }
}
```

#### The `Performance` base class

The `Performance` module is a base class meant to be extended when you write the performance code of your scenario. It is a regular `Module`, and its particularity is to keep track of the clients who are currently in the performance by maintaining an array `this.clients` on the server side.

**Note:** this base class is provided for convenience only. You can also write your performance by extending a regular `Module` rather than extending this class.

##### ClientPerformance

The `ClientPerformance` module extends the `ClientModule` base class and constitutes a basis on which to build a performance on the client side. It always has the `view` attribute.

###### Methods

- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `name:String = 'performance'`, the name of the module
  - `color:String = 'black'`, the `viewColor` of the module
- `start()`  
  The `start` method extends the `ClientModule`’s `start` method and is automatically called to start the performance on the client side.
- `done()`  
  The `done` method extends the `ClientModule`’s `done` method and can be called if ever the performance terminates before the client disconnects.

##### ServerPerformance

The `ServerPerformance` module extends the `ServerModule` base class and constitutes a basis on which to build a performance on the client side.

###### Methods

- `constructor()`  
  The `constructor` does not accept any arguments or options.
- `connect(client:ServerClient)`  
  The `connect` method extends the `ServerModule`’s `connect` method. It adds the client `client` to the array `this.clients` when it receives the WebSocket message `'performance:start'`, and removes it from that array when it receives the WebSocket message `'performance:done'`.
- `disconnect(client:ServerClient)`
   The `disconnect` method extends the `ServerModule`’s `disconnect` method. It removes the client `client` from the array `this.clients`.
- `enter(client:ServerClient)`  
  The `enter` method is called when the client `client` starts the performance.
- `exit(client:ServerClient)`  
  The `exit` method is called when the client `client` leaves the performance (*i.e. when the `ClientPerformance` calls its `done` method, or if the client disconnects from the server).  

**Note:** in practice, you will mostly override the `enter` and `exit` methods when you write your performance.

###### Attributes

- `clients:Array = []`  
  The `clients` attribute is an array that contains the list of the clients who currently joined the performance.

### Client only modules

#### ClientDialog

The `ClientDialog` displays a full screen dialog. It requires the participant to tap the screen to make the view disappear. The module is also used at the very beginning of a scenario to activate the Web Audio API on iOS devices (option `activateWebAudio). The `ClientDialog` module calls its `done` method when the participant taps on the screen.

###### Methods

- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `name:String = dialog`, `name` of the module
  - `color:String = 'black'`, `viewColor` of the module
  - `text:String` = "Hello!", text to be displayed in the dialog.
  - `activateAudio:Boolean = false`, whether the module activates the Web Audio API when the participant touches the screen (useful on iOS devices)

For instance, the following code would generate the HTML content shown below in the module's view when the module starts:

```javascript
var welcomeDialog = new ClientDialog({
  name: 'welcome',
  text: 'Welcome to this awesome scenario!'
});
```


```html
<div id='welcome' class='module welcome'>
  <p>Welcome to this awesome scenario!</p>
</div>
```

#### ClientLoader

The `ClientLoader` module allows for loading audio files that can be used in the scenario (for instance, by the `performance` module). The `Loader` module has a view that displays a loading bar indicating the progress of the loading. The `ClientLoader` module calls its `done` method when all the files are loaded.

The `ClientLoader` module requires the SASS partial `sass/_07-loader.scss`.

###### Methods

- `constructor(audioFiles:Array, options:Object = {})`  
  The `constructor` accepts one mandatory argument:
  - `audioFiles:Array`  
     The `audiofiles` array contains the links (`String`) to the audio files to be loaded. (The audio files should be in the `/public` folder of your project, or one of its subfolders.)
  In addition, it accepts the following options:
  - `name:String = loader`, `name` of the module
  - `color:String = 'black'`, `viewColor` of the module

For instance, the following code would allow to access the kick and snare audio buffers created from the mp3 files as shown below:

```javascript
var loader = ClientLoader('sounds/kick.mp3', 'sounds/snare.mp3');
```

```javascript
var kickBuffer = loader.audioBuffers[0];
var snareBuffer = loader.audioBuffers[1];
```

###### Attributes

- `audioBuffers:Array = []`  
  The `audioBuffers` array contains the audio buffers created from the audio files passed in the `constructor`.

#### ClientOrientation

The `ClientOrientation` module extends the `ClientModule` base class and allows for calibrating the compass and get an angle reference. It displays a view with an instruction text. When the user points at the right direction for the calibration, touching the screen of the phone (*i.e.* on the view) would set the current compass value as the angle reference. The `ClientOrientation` module calls its `done` method when the participant touches the screen.

###### Methods

- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `name:String = orientation`, `name` of the module
  - `color:String = 'black'`, `viewColor` of the module
  - `text:String = 'Point the phone exactly in front of you, and touch the screen.'`, instruction text to be displayed

###### Attributes

- `angleReference:Number`  
  The `angleReference` attribute is the value of the `alpha` angle (as in the `deviceOrientation` HTML5 API) when the user clicks on the screen while the `ClientOrientation` module is displayed. It serves as a calibration / reference of the compass.

#### ClientPlatform

The `ClientPlatform` module checks whether the device is compatible with the technologies used in the *Soundworks* library. Such devices are running on iOS 7 or above, or on Android 4.2 or above with the Chrome browser in version 35 or above. In all other cases, this module displays a blocking screen and prevents the participant to go any further in the scenario. The `ClientPlatform` module calls its `done` method immediately if the phone passes the platform test, or never otherwise.

###### Methods

- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `name:String = platform`, `name` of the module
  - `color:String = 'black'`, `viewColor` of the module


### Client/server modules

#### Checkin

The `Checkin` module is responsible for keeping track of the connected clients by assigning them indices within the range of the available places in the scenario and, optionally, a position in the performance space. In case that the scenario is based on predefined positions (*i.e.* a `setup`), the indices correspond to the indices of seats that are either automatically assigned or selected by the participants.

For instance, say that the scenario requires 12 players who sit on a grid of 3 ⨉ 4 predefined positions. When a client connects to the server, the `Checkin` module could assign the client a position on the grid that is not occupied yet. The application can indicate the participant a label that is associated with the assigned position. Similarly, if the scenario takes place in a theater with labeled seats, the `Checkin` module would allow the participants to indicate their seat by its label (*e.g.* a row and a number). If the scenario does not require the players to sit at particular locations, the `Checkin` module would just assign them arbitrary indices within the range of total number of users this scenario supports.

Alternatively, when configuring the module adequately, the module can assign arbitrary indices to the the participants and request that they indicate their approximate positions in the performance space on a map.

The `ClientCheckin` module requires the SASS partial `sass/_05-checkin.scss`.

##### ClientCheckin

The `ClientCheckin` module extends the `ClientModule` base class and takes care of the check in on the client side. The `ClientCheckin` module calls its `done` method when the user is checked in.

###### Methods

- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `name:String = 'checkin'`, the name of the module
  - `color:String = 'black'`, the `viewColor` of the module
  - `select:String = 'automatic'`, mode of index and position selection, the following values are accepted:
    - 'automatic', the index is selected automatically, no position is attributed, in case that the index is associated with a label (requires a predefined `setup` on the server side), the label is indicated to the participant via a dialog
    - 'label', the participant can select a label associated with an index and a position via a dialog (requires a predefined `setup` on the server side)
    - 'position', the index is attributed automatically, the participant can indicate an approximate position on a map via a dialog
  - `order:String = 'ascending'`, order of automatic index selection
    - 'ascending', available indices are selected in ascending order
    - 'random', available indices are selected in random order (not available when the maximum number of clients exceeds 1000)

Below is an example of an instantiation of the `ClientCheckin` module that displays the dialog on the client side.

```javascript
// Client side (require the Soundworks library client side)
var clientSide = require('soundworks/client');

var checkin = new clientSide.Checkin({ select: 'automatic', order: random });
```

##### ServerCheckin

The `ServerCheckin` extends the `ServerModule` base class and takes care of the checkin on the server side.

- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `setup:ServerSetup = null`, predefined setup of the performance space (see [`ServerSetup` class])
  - `maxPlayers:Number = Infinity`, maximum number of players supported by the scenario (the acutal maximum number of players might be limited to the number of predefined positions or labels of a given `setup`)

Below is an example of the instantiation of the `ServerCheckin` module on the server side.

```javascript
// Server side (require the Soundworks library server side)
var serverSide = require('soundworks/server');

// Case 1: the scenario has a predefined setup
var setup = new serverSide.Setup();
setup.generate('matrix', { cols: 3, rows: 4 }).
var checkin = new serverSide.Checkin({ setup: setup });

// Case 2: the scenario does not have a predefined setup, but specifies a maximum number of players
var checkin = new serverSide.Checkin({ numPlaces: 500 });
```

#### Control

The `Control` module is used to control an application through a dedicated client that we usually call `conductor`. The module allows for declaring `parameters`, `infos`, and `commands`, through which the `conductor` can control and monitor the state of the application:
- `parameters` are values that are changed by a client, send to the server, and propagated to the other connected clients (*e.g.* the tempo of a musical application)
- `infos` are values that are changed by the server and propagated to the connected clients,to inform about the current state of the application (*e.g.* the number of connected players)
- `commands` are messages (without arguments) that are send from the client to the server (*e.g.* `start`, `stop` or `clear` – whatever they would mean for a given application)

A `ClientControl` module, optionally, can automatically construct a simple interface from the list of declared controls that permits to change `parameters`, display `infos`, and to send `commands` to the server:
The controls of different types are declared on the server side and propagated to the client side when a client is set up.

##### ClientControl

The `ClientControl` module extends the `ClientModule` base class and takes care of the `parameters`, `info` values, and `commands` on the client side. If the module is instantiated with the option `gui` set to `true`, it constructs the graphical control interface, otherwise it simply receives the values that are propagated through or emitted by the server (usually by the `performance` module). The `ClientModule` calls `done` immediately after having set up the controls and, optionally, the graphical user interface.

###### Methods

- `constructor(options:Object = {})`    
  The `constructor` accepts the following `options`:
  - `name:String = 'control'`, the name of the module
  - `color:String = 'black'`, the `viewColor` of the module
  - `gui:Boolean = false`  
    When set to `true` , the `gui` property makes the `ClientControl` to create a view with a graphical control interface that is automatically built from a list of controls sent by the client.

###### Attributes

- `parameters:Object = {}`  
   The `parameters` object contains the global parameters of the scenario. To each key of the object is associated a parameter object. You can access the value of the parameter `'myparam'` as `parameters.myparam.value`.
- `infos:Object = {}`  
   The `infos` attribute contains info values that inform the client about the state of scenario on the server side. You can access the value of the info `'myinfo'` as `this.infos.myinfo.value`.
- `commands:Object = {}`  
   The `commands` attribute contains the declared commands.

###### Events

- `'control:parameter' : name:String, val:Any`  
  Each time a parameter is updated, the `ClientControl` module emits the `'control:parameter'` event with two arguments:
  - `name:String`, name of the parameter that changed
  - `val:Any`, new parameter value
- `'control:info' : name:String, val:Number|String`  
  Each time a parameter is updated, the `ClientControl` module emits the `'control:info'` event with two arguments:
  - `name:String`, name of the info value that changed
  - `val:Any`, new info value

##### ServerControl

The `ServerControl` module extends the `ServerModule` base class and takes care of the `parameters`, `infos`, and `commands` on the server side. To set up controls in a scenario, you should extend this class on the server side and declare the controls specific to that scenario with the `addParameterNumber`, `addParameterSelect`, `addCommand`, and `addDisplay methods.

###### Methods

- `constructor()`  
  The `constructor` does not accept any arguments or options.
- `addParameterNumber(name:String, label:String, min:Number, max:Number, step:Number, init:Number)`  
  The `addParameterNumber` method is used to add a number control parameter. Its arguments are:
  - `name:String`, name of the parameter
  - `label:String`, label of the parameter in the GUI on the client side
  - `min:Number`, minimum value of the parameter
  - `max:Number`, maximum value of the parameter
  - `step:Number`, step to increment or decrement the value of the parameter
  - `init:Number`, initial value of the parameter
- `addParameterSelect(name:String, label:String, options:Array, init:String)`  
  The `addParameterSelect` method is used to add a select control parameter. In the GUI on the client side, the select parameter displays a select form with the options `options`. Its arguments are:
  - `name:String`, name of the parameter
  - `label:String`, label of the parameter in the GUI on the client side
  - `options:Array`, options of the select parameter the user can choose from in the GUI on the client side (of `String`)
  - `init:String`, initial value of the parameter (present in the `options` array)
- `addCommand(name:String, label:String, fun:Function)`  
  The `addCommand` method allows for adding a command. Its arguments are:
  - `name:String`, name of the command
  - `label:String`, label of the command in the GUI on the client side
  - `fun:Function`, function to be executed when the command is called
- `addInfo(name:String, label:String, init:Number|String)`  
   The `addInfo` method allows for adding an info to be displayed on the client side. Its arguments are:
  - `name:String`, name of the info to display
  - `label:String`, label of the info in the GUI on the client side
  - `init:Number|String`, initial value of the info to display
- `setParameter(name:String, value:Number|String)`  
  The `setParameter` method allows set the value of the parameter `name` to `value`. The argument `value` is either of `Number` or `String` depending on whether you update a number or select parameter.
- `setInfo(name:String, value:Number|String)`  
  The `setInfo` method allows set the value of the info `name` to `value`.

#### Setup

The `Setup` module contains the information about the setup of the performance space in terms of it surface (*i.e.* dimensions and outlines) and predefined positions (*e.g.* seats or labels on the floor) where the scenario takes place.

For instance, say that the scenario requires 12 players who sitting on teh floor on a grid of 3 ⨉ 4 pillows, the `Setup` module would contain the information about the grid, including the pillows' locations in space and labels. Similarly, if the scenario takes place in a theater where seats are numbered, the `Setup` module would contain the seating plan.

If the topography of the performance space does not matter for a given scenario, the `Setup` module is not needed.

##### ClientSetup

The `ClientSetup` modules extends the `ClientModule` base class and takes care of receiving the setup on the client side, and provides helper functions to display the setup on screen. The `ClientSetup` calls its `done` method when it receives the setup from the server.

The `ClientSetup` module requires the SASS partial `sass/_08-setup.scss`.

###### Methods

- `constructor()`  
  The `constructor` accepts the following `options`:
  - `name:String = setup`, the name of the module
- `display(div:Element)`  
  The `display` method displays a graphical representation of the setup in the `div` DOM element provided as an argument.
- `addClassToPosition(setupDisplay:Element, index: Number, className:String = 'player')`  
  In the `Setup` graphical representation that lies in the `setupDisplay` DOM element (which had to be created by the `.displaySetup(div)` method), this method adds the class `className` to the position corresponding to the index `index` in the setup.
- `removeClassFromPosition(setupDisplay:Element, index: Number, className:String = 'player')`  
  In the `Setup` graphical representation that lies in the `setupDisplay` DOM element (which had to be created by the `.displaySetup(div)` method), this method removes the class `className` from the position corresponding to the index `index` in the setup.

Below is an example of the `ClientSetup` module in use.

```javascript
// Client side (require the Soundworks library)
var clientSide = require('soundworks/client');

// Create Setup module
var setup = new clientSide.Setup();

// Display a graphical representation of the setup in a `div` of the DOM
var setupGUI = document.getElementById('setup-container');
setup.displaySetup(setupGUI);

// Add the class 'red-highlight' to position #3 in this graphical representation
setup.addClassToPosition(setupGUI, 3, 'red-highlight');
```

##### ServerSetup

The `ServerSetup` extends the `ServerModule` base class and takes care of the setup on the server side.
###### Methods

- `constructor()`  
  The `constructor` does not accept any argument or options.
- `generate(type:String = 'matrix', params = {}) : Number`  
  The `generate` method generates a surface and/or predefined positions according to a given type of geometry and corresponding options. The following geometries are available: 
    - 'matrix', a matrix setup with the following parameters:
      - cols = 3, number of columns
      - rows = 4, number of row
      - colSpacing = 1, spacing between columns
      - rowSpacing = 1, spacing between rows
      - colMargin = colSpacing / 2, (*horizontal*) margins between the borders of the performance space and the first or last column
      - rowMargin = rowSpacing / 2, (*vertical*) margins between the borders of the performance space and the first or last row
- `getNumPositions() : Number`  
  The `getNumPositions` method returns the total number of predefined positions and/or labels of the setup. For instance, if the setup is a 4 ⨉ 5 matrix the method would return *20*
- `getLabel(index:Number) : String`  
  The `getLabel` method returns a `String` corresponding to the label associated with the predefined position at the given index in the setup.
- `getPosition(index:Number) : Array`  
  The `getPosition` returns an array with the coordinates of the predefined predefined position at the given index in the setup.

Below is an example of the instantiation of the `ServerSetup` module on the server side.

```javascript
// Server side (require the Soundworks library server side)
var serverSide = require('soundworks/server');

// Creating a matrix setup with 4 columns and 5 rows
var setup = new serverSide.Setup();
setup.generate('matrix', { cols: 4, rows: 5 });
```

#### Sync

The `Sync` module is based on [`sync`](https://github.com/collective-soundworks/sync) and is responsible for synchronizing the clients’ clocks and the server clock on a common clock called "sync clock". Both, the clients and the server, can use this shared clock as a common time reference.

For instance, this allows all the clients to do something exactly at the same time, such as blinking the screen or playing a sound in a synchronized manner.

The `Sync` module does a first synchronization process after which the `ClientSync` calls its `done` method. Afterwards, the `Sync` module keeps running in the background for the rest of the scenario to resynchronize the client and server clocks regularly, to compensate for clock drifts.

On the client side, `ClientSync` uses the `audioContext` clock. On the server side, `ServerSync` uses the `process.hrtime()` clock. All times are in seconds (method arguments and returned values). **All time calculations and exchanges should be expressed in the sync clock time.**

##### ClientSync

The `ClientSync` module extends the `ClientModule` base class and takes care of the synchronization process on the client side. It displays a view that indicates "Clock syncing, stand by…" until the very first synchronization process is done. The `ClientSync` module calls its `done` method as soon as the client clock is in sync with the sync clock. Then, the synchronization process keeps running in the background to resynchronize the clocks from times to times. When such a resynchronization happens, the `ClientSync` module emits a `'sync:stats'` event associated with information about the synchronization.

###### Methods

- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `name:String = 'sync'`, the name of the module
  - `color:String = 'black'`, the `viewColor` of the module
- `getLocalTime(syncTime:Number) : Number`  
  The `getLocalTime` method returns the time of the local (client) clock (in seconds) corresponding to the given sync time. If no arguments are provided, the method returns the current local (client) time (*i.e.* using `audioContext.currentTime`).
- `getSyncTime(localTime:Number = audioContext.currentTime) : Number`  
  The `getSyncTime` method returns the time of the sync clock (in seconds) corresponding to the given local (client) time. If no arguments are provided, the method returns the current sync time.

Below is an example of an instantiation of the `Sync` module.

```javascript
// Client side (require the Soundworks library client side)
var clientSide = require('soundworks/client');

// create Sync module
var sync = new clientSide.Sync();

var nowClient = sync.getLocalTime(); // current time in client clock time
var nowSync = sync.getSyncTime(); // current time in sync clock time
```

###### Events

- `'sync:stats' : stats:Object`  
  The `ClientSync` module emits the `'sync:stats'` event each time it resynchronizes the local clock on the sync clock. In particular, the first time this event is fired indicates that the clock has been synchronized with the sync clock (*i.e.* we have a first estimation of the clock synchronization) and the `done` method is called. The `'sync:stats'` event has a single object argument with the following properties:
  - `timeOffset`, current estimation of the time offset between the client clock and the sync clock
  - `travelTime`, current estimation of the travel time for a message to go from the client to the server and back
  - `travelTimeMax`, current estimation of the maximum travel time for a message to go from the client to the server and back

##### ServerSync

The `ServerSync` module extends the `ServerModule` base class and takes care of the synchronization process on the client side.

###### Methods

- `constructor()`  
  The `constructor` does not accept any arguments or options.
- `getSyncTime() : Number`  
  The `getSyncTime` method returns the current sync time (in seconds, derived from process.hrtime).

**Note:** in practice, the sync clock used by [`sync`](https://github.com/collective-soundworks/sync) is the server clock. In *Soundworks*’ `Sync` module, it is the the `` server clock.

Below is an example of the instantiation of the `Sync` module on the server side.

```javascript
// Server side (require the Soundworks library server side)
var serverSide = require('soundworks/server');

// create Syn module
var sync = new serverSide.Sync();

// get sync time
var nowSync = sync.getSyncTime(); // current time in the sync clock time
```

