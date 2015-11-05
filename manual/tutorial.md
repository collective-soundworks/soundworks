# Composing a scenario from modules

A scenario built with *Soundworks* consists in a succession and combination of modules, each of them corresponding to a step of the scenario.

## Client side

On the client side, modules can be executed in a particular order according to a given scenario. As an example, a scenario could provide the following interactions when a participant connects to the application’s root URL (as a `player`):
- The mobile devices displays a **welcome** message (*e.g.* “Welcome to the performance!”). When the participant clicks on the screen…
- The client goes through a **check-in** procedure for which the device may display some instructions. In the meantime, …
- The client **synchronizes** its clock with the server. Finally, when these are done…
- The client joins the **performance**.

Each of these steps corresponds to a module. While most of the modules are provided by the library (cf. the [Modules provided by the library](#modules-provided-by-the-library) section), you will generally have to write the module that implements the most important part of your scenario: the `performance`.

In the example described above, the client side code corresponding to the `player` client (in `src/player/index.es6.js`) would look like this:

```javascript
/* Client side */

// Require the Soundworks library (client side) and the 'client' object
var clientSide = require('soundworks/client');
var client = clientSide.client;

// Initialize the type of client to associate it to the corresponding URL
// ('player' clients connect via the root URL)
client.init('player');

// Write the performance module
class MyPerformance extends clientSide.Performance {
  ...
}

// Scenario logic
window.addEventListener('load', () => {
  // Initialize the modules
  var welcome = new clientSide.Dialog(...);
  var checkin = new clientSide.Checkin(...);
  var sync = new clientSide.Sync(...);
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

To run a sequence of modules in series, we use `client.serial(module1, module2, ...)`. On the other hand, if some modules need to be run in parallel, we use `client.parallel(module1, module2, ...)`. (For more information about this, please refer to the [`client` object module logic](#module-logic) section.)

For any other type of client (*e.g.* `conductor` or `env`), the file would be very similar, except for:
- The initialization of the client, that would correspond to the type of client (*e.g.* `client.init('conductor');` or `client.init('env');`);
- The modules used by that type of client. For instance, the `env` clients may require a `sync` and `performance` module but may not need a `welcome` screen nor a `checkin`.

As some of the modules on the client side need to communicate with the server (for instance the `sync` process requires a dialog between the client and the server to synchronize the clocks), let's now have a look at the server side.

## Server side

The server side of the application must provide the server modules that respond to the client side modules. The server side code (in `src/server/index.es6.js`) corresponding to the example above would look like this:

```javascript
/* Server side */

// Require the Soundworks library (server side) and the 'server' object
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

// Initialize the modules (needed by the client side for some dialog)
var checkin = new serverSide.Checkin(...);
var sync = new serverSide.Sync(...);
var playerPerformance = new MyPlayerPerformance(...);
var envPerformance = new MyEnvPerformance(...);

// Map the server modules to the 'player' client type (and root URL)
server.map('player', sync, checkin, playerPerformance);

// Map the server modules to the 'env' client type (and /env URL)
server.map('env', sync, envPerformance);
```

Among the modules used by the `player` clients, three of them need to communicate with the server: `checkin`, `sync` and `performance`. (The `dialog` module only displays a welcome message to the participant and does not involve any interaction between the client and server. For more information about the modules that have a both a client and a server side, please refer to the [Client/server modules](#clientserver-modules) section in the API.) Hence, after setting up the Express app and starting the server, we instantiate the `checkin`, `sync`, and `playerPerformance` server side modules and map them to the `'player'` client type. Consequently, these modules can dialog with the corresponding client side modules, and respond to the `player` clients connected via the root URL of the application.

Similarly, we map the `sync` module and the `envPerformance` module to the `'env'` client type, provided that these are the modules the `env` clients need to dialog with.

# Implementing a module

As mentioned above, a scenario implemented with the *Soundworks* library is essentially composed of a set of modules. In general, a module consists of a client and a server part that exchange messages (however, some modules may only have a client side, for example).

Let's now review the specificities of implementing a module on the client and server sides, as well as the example of a simplified version of the `checkin` module for code excerpts. (For the complete documentation about the module base classes, please refer to [`ClientModule`](#clientmodule) and [`ServerModule`](#servermodule) sections in the API section below.)

## Client side

On the client side, a module extends the `ClientModule` base class. The module must implement a `start` method and has to call its `done` method to hand over the control to the next module.

### The `start` method

The `start` method is called to start the module. It should handle the logic and the steps that lead to the completion of the module.

### The `done` method

The `done` method (implemented by the `ClientModule` base class) is called by the client module to hand over control to the next module. Most modules would call their `done` method when their process is complete. For instance, if the purpose of a module is to load files, the module would call its `done` method when the files are loaded.

However, some modules continue processing in the background even after calling that method. This is for example the case of the `sync` module. The module calls its `done` method after the client clock is synchronized with the sync clock for the first time, and keeps running in the background afterwards to re-synchronize the clocks regularly during the rest of the scenario.

As an exception, the last module of the scenario (usually the `performance` module) may not call its `done` method and keep the control until the client disconnects from the server.

A derived client module **must not** override the `done` method provided by the base class.

## Server side

On the server side, a module extends the `ServerModule` base class and has to implement a `connect` and a `disconnect` method.
While the sequence of user interactions and exchanges between client and server is determined on the client side, the server side modules are ready to receive requests from the corresponding client side modules as soon as a client is connected to the server (*i.e.* when the module's `.connect(client)` is called).

### The `connect` method

When a client of a particular type connects to the server via the corresponding URL (*e.g.* a `player` through the root URL, or an `env` client through the `/env` URL), the server calls the `connect` method of all the modules that are mapped to that client type. In particular, the module should take advantage of the `connect` method to set up WebSocket listeners in order to serve incoming requests from the corresponding client side module.

### The `disconnect` method

Similarly, the `disconnect` method is called whenever the client disconnects from the server. It handles all the actions that are necessary in that case.

# Writing the `Performance` module

In most applications, the only module you will have to implement is the `performance` module. The *Soundworks* library provides the `ClientPerformance` and `ServerPerformance` base classes that you would extend to implement the `performance` of your application.

The `ClientPerformance` and `ServerPerformance` modules respectively extend the `ClientModule` and `ServerModule` base classes, so they provide the `start`, `connect` and `disconnect` methods seen above. On the client side, the `start` method is called when the client enters the performance. On the server side, the `connect` method is called when a client connects to the server, and the `disconnect` method is called when a client disconnects from the server.

Additionally, the `ServerPerformance` class provides the `enter` and `exit` methods, that are called when a client enters or exits the performance. In other words, the `ServerPerformance`'s `enter` method is called when a particular client calls the `ClientPerformance`'s `start` method. On the other hand, the `exit` method is called either when a client calls the `ClientPerformance`'s `done` method, or if a client disconnects from the server. In order to keep track of the clients who participate in the performance (*i.e.* who entered the performance and have not exited yet), `ServerPerformance` module  maintains an array of performing clients in its `clients` attribute.

The following example shows a simple performance module. In this scenario, the participant's device plays a welcome sound when it joins the performance, and it also play another sound when another participant joins the performance.

```javascript
/* Client side */

// Require the 'client' object
var client = require('./client');

// Write the performance module
class MyPerformance extends clientSide.Performance {
  constructor(loader, options = {}) {
    super(options); // same behavior as the base class

    this.loader = loader; // the loader module
  }

  start() {
    super.start(); // call base class constructor (don't forget this)

    // Play the welcome sound immediately
    let src = audioContext.createBufferSource();
    src.buffer = this.loader.audioBuffers[0];
    src.connect(audioContext.destination);
    src.start(audioContext.currentTime);

    this.setCenteredViewContent('Let’s go!'); // display some feedback text in the view

    // Play another sound when we receive the 'play' message from the server
    client.receive('performance:play', () => {
      let src = audioContext.createBufferSource();
      src.buffer = this.loader.audioBuffers[1];
      src.connect(audioContext.destination);
      src.start(audioContext.currentTime);
    });

    // Since the performance does not end unless the client disconnects,
    // this module does not call its 'done' method.
  }
}
```

```javascript
/* Server side */

// Require the Soundworks library (server side)
var serverSide = require('soundworks/server');

// Write the performance module
class MyPerformance extends serverSide.Performance {
  constructor() {
    super();
  }

  // When the client enters the performance...
  enter(client) {
    super.enter(client); // call base class constructor (don't forget this)

    // Send a 'play' message to all other clients
    client.broadcast('performance:play');
  }

  // In this scenario, when a client connects to the server,
  // disconnects from the server, or exits the performance in this scenario,
  // there is nothing more we have to do than what the base class already does,
  // so we don't even have to implement these methods here.
}
```

# Styling with SASS

The *Soundworks* library uses SASS to generate the CSS files. You will find the SASS files associated with the Soundworks library in [the `soundworks-template` repository](https://github.com/collective-soundworks/soundworks-template) (in the [`src/sass/`](https://github.com/collective-soundworks/soundworks-template/tree/master/src/sass) subfolder).

When you write a scenario, the `src/sass/` folder should contain:

- The four generic SASS partials from the library (`_01-reset.scss`, `_02-fonts.scss`, `_03-colors.scss`, `_04-general.scss`);
- All the SASS partials required by any module of the library you use (*e.g.* `_77-checkin.scss`, `_77-loader.scss`, etc.) — the client side modules that need a custom SASS partial are indicated in [the API section](#api);
- Your own SASS partials for the modules you wrote (in particular, for the `performance`);
- One file for each type of client `clientType.scss` (*e.g.* `player.scss`, `conductor.scss`, `env.scss`, etc.) that includes all the partials needed by that type of client. Since the `player` is the default client in any *Soundworks*-based scenario, the `src/sass/` should at least contain the `player.scss` file.

For instance, in the scenario example shown in the [Composing a scenario from modules](#composing-a-scenario-from-modules) section, the `player` client uses the `dialog`, `sync` and `checkin` modules from the library, among which only the `checkin` module requires a custom SASS partial. Hence, the `player.scss` file would look like the following:

```sass
// General styling: these partials should be included in every clientType.scss file
@import '01-reset';
@import '02-fonts';
@import '03-colors';
@import '04-general';

// Module specific partials: check in the documentation which modules have an associated SASS file
@import '77-checkin';

// Your own partials for the modules you wrote
@import 'performance'
```
