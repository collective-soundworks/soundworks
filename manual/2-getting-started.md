#Introduction

a scenario based on  and focus on its audiovisual and interaction design instead of the infrastructure.

## System Requirements

Before getting started with developing a *Soundworks* application, make sure having installed the following software :
- Node `0.12.7` (the [`n`](https://github.com/tj/n) library allows you to switch easily between node versions);
- npm `3.3.12^`

# Template

The recommended way of developing a *Soundworks* application is to start from a template.
The [`soundworks-template`](https://github.com/collective-soundworks/soundworks-template) allows for bootstrapping the development of a *Soundworks* application.
It includes comprehensive comments in the code.

# Client / server architecture, URLs and routes

In order to connect the mobile devices with each other, *Soundworks* implements a client/server architecture using a Node.js server and WebSockets to pass messages between the server and the clients.

*Soundworks*-based scenarios allow different types of clients to connect to the server through different URLs. The most common type of clients is constituted of the participant's mobile devices who take part in the performance. We refer to this type of client as a `'player'`. For convenience, a `'player'` client connects to the server through the root URL of the application `http://my.server.address:port/`.

In addition to the `'player'` clients, a scenario can include as many other types of clients as you want. For instance, one could imagine that:
- A device provides an interface to control some parameters of the performance in real time. We would refer to this type of client as `'conductor'` and these clients would connect to the server through the URL `http://my.server.address:port/conductor`.
- A device generates “environmental” sound and/or light effects projected into the performance in sync with the participants’ performance (*e.g.* lasers, a global visualization, or ambient sounds on external loudspeakers). We would refer to this type of client as `'env'` and these clients would connect to the server through the URL `http://my.server.address:port/env`.

All types of clients (except `'player'`) access the server through a URL that concatenates the root URL of the application, and the name of the client type (*e.g* `http://my.server.address:port/conductor` or `http://my.server.address:port/env`).

# Build

There are a few node scripts you can use to build files from the source files. In a Terminal window:
- `npm run start` starts the server
- `npm run transpile` builds all the necessary files from the source files
- `npm run watch` watches for changes in the source files and restarts the server when necessary

# Modules provided by the library

*Soundworks* provides a set of modules that can be used in many scenarios.
Please refer to the [Reference](../identifiers.html) page for an exhaustive list.

# Cheat sheet

In a nutshell, here is what you have to do to write your Javascript code (in `src/client/<client type>/index.js` and `src/server/index.js`).

## Client side

- Initialize the client and specify its client type with `client.init('<client type>')` (see section [Initialization](#initialization));
- Create a module for the performance with `class MyPerformance extends Performance { ... }` (see section [Performance module](#performance-module));
- Instantiate all the modules;
- Start the scenario and link the modules in the `client.start(...)` method (see section [Module logic](#module-logic)).

## Server side

- Create a module for the performance with `class MyPerformance extends Performance { ... }`.
- Instantiate all the modules that serve the client;
- Start the server with `server.start(app)` and map the modules to the types of clients that require them with `server.map(...)` (see section [Server side](#server-side)).

# Creating a scenario

In this section, we will go through the making of the [`soundworks-template`](https://github.com/collective-soundworks/soundworks-template) scenario step by step (let's call it *My Scenario*).

In *My Scenario*, any client that connects to the server through the root URL (`http://my.server.address:port/`) plays a sound when joining the performance, and plays another sound when other clients connect to the server.
Consequently, we will focus on *Soundworks*’ default client type (`'player'`), which is by default the type of all the clients that connect to the server through the root URL.

## 1. Create a new *Soundworks* project

Let’s create a new *Soundworks* project.
Don't forget to include the `bin/scripts` file, and the `'scripts'` property of `package.json` as found in the [`soundworks-template`](https://github.com/collective-soundworks/soundworks-template) repository.
The directory structure should be the following:

```
my-scenario/
├── bin/
│   └── scripts
├── public/
│   ├── css/
│   ├── fonts/
│   │   ├── Quicksand-Bold.ttf
│   │   ├── Quicksand-Light.ttf
│   │   └── Quicksand-Regular.ttf
│   ├── js/
│   └── sounds/
│       ├── sound-other.mp3
│       └── sound-welcome.mp3
├── sass/
│   └── player.scss
├── src/
│   ├── client/
│   │   └── player/
│   │       ├── index.js
│   │       └── PlayerPerformance.js
│   └── server/
│       ├── index.js
│       └── PlayerPerformance.js
├── views/
│   └── player.ejs
├── package.json
└── README.md
```

In particular:

- The `public/` folder contains the resources the clients may need to load, such as sounds, images, fonts…
  **Note:** the Javascript and CSS files will be automatically generated from the `src/` folder into the `public/js/` and `public/css/` subfolders.
- The `src/` folder contains:
  - The `client/` subfolder, that contains one subfolder for each client type (`player/` is a mandatory subfolder):
    - Each client type subfolder contains an `index.js` file, and any other Javascript files with the source code for that client type;
  - The `server/` subfolder, that contains an `index.js` file, and any other Javascript files with the source code for the server;
- The `sass/` subfolder, with the SASS partials used to generate the CSS. In particular, each type of client (including `'player'`) should have its corresponding SASS partial (*e.g.* `player.scss`, `conductor.scss` or `env.scss`).
- The `views/` folder contains a `*.ejs` file for each client type: all the subfolders in `src/client/` should have their corresponding EJS file (*e.g.* `player.ejs`, `conductor.ejs` or `env.ejs`).



## 2. Client side

On the client side, there are three things we need to do:

- Set up the EJS file that will generate the HTML;
- Write the Javascript code;
- And write the SASS files that will generate the CSS.

### 2.1 Setting up the EJS file

Let’s start with the easy part, the EJS file located in `my-scenario/views/player.ejs`.

```html
<!doctype html5>
<html>
  <head>
    <!-- settings -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <!-- title -->
    <title>My scenario</title>

    <!-- stylesheets -->
    <link rel="stylesheet" href="css/player.css">
  </head>

  <body>
    <div id="container" class="container"></div>
    <script src="js/player.js"></script>
  </body>
</html>
```

The most important things here are:

- To load the `stylesheets/player.css` stylesheet that will be generated by the SASS file we’ll write later;
- To load the `js/player.js` Javascript file;
- And to have a `div` element in the `body` that has the ID `#container` and a class `.container`.

### 2.2 Writing our scenario in Javascript using modules

Now let’s write the core of our scenario in the `src/client/player/index.js` file.
This is the file that is loaded by any client who connects to the server through the root URL `http://my.server.address:port/`.
Such a client is called `'player'`.

A scenario built with *Soundworks* consists in a succession of steps made of combinations of modules. Step by step, this is how the scenario will look like when a participant connects to the server through that URL:

- The screen displays a `welcome` screen that the user has to click to enter the scenario;
- In the background, the client goes through a `checkin` process with the server while a `loader` loads the audio files to play;
- Finally, when these initialization steps are finished, the user enters the `performance` in which the smartphone plays the welcome sound, and plays another sound when another client connect to the server.

#### Initialization

First of all, let’s load the library and initialize the client.

```javascript
// Import Soundworks library modules (client side)
import { client, Checkin, Dialog, Loader, Performance } from 'soundworks/client';

// Initialize the client type
client.init('player');
```

The client type here `'player'` because we are editing the Javascript file for the `'player'` clients who connect to the server through the root URL.

Then, all the scenario will happen when the HTML document is ready, so let’s wrap all the scenario logic in a callback function.

```javascript
window.addEventListener('load', () => {
  // Scenario logic
  ...
});
```

#### Welcome module

The `welcome` module displays a text to welcome the users who connect to the server.
We also ask the users to click on the screen to hide this screen and start the scenario.
Under the hood, we use this click to activate the Web Audio API on iOS devices (on iOS, sound is muted until a user action triggers some audio commands).
This is exactly what the [`Dialog`](../class/src/client/Dialog.js~Dialog.html) module is made for.

```javascript
window.addEventListener('load', () => {

  const welcome = new Dialog({
    name: 'welcome',
    text: "<p>Welcome to <b>My Scenario</b>.</p> <p>Touch the screen to join!</p>",
    activateAudio: true
  });

  ... // the rest of the scenario logic
});
```

Here:

- The `name` parameter corresponds to the `id` attribute and a class of the HTML element in which the content of the module is displayed (the `view`);
- The `text` parameter contains the text to display on the screen when the module is displayed;
- Finally, the property `activateAudio` is set to `true` to enable the sound on iOS devices as well as to start the Web Audio clock (that will be required for the synchronization process).

**Note:** this step is required in almost any scenario, to activate the Web Audio on iOS devices.

#### Checkin module

The [`Checkin`](../class/src/client/Checkin.js~Checkin.html) module allows the client to register on the server and to get an ID (*i.e.* an index) that we can refer to later.

```javascript
window.addEventListener('load', () => {
  ... // what we've done already

  const checkin = new Checkin();

  ... // the rest of the scenario logic
});
```

#### Loader module

The [`Loader`](../class/src/client/Loader.js~Loader.html) module allows the client to load audio files from the public folder.

```javascript
// Paths to the audio files in the public folder
const audioFiles = ['sounds/sound-welcome.mp3', 'sounds/sound-others.mp3'];

window.addEventListener('load', () => {
  ... // what we've done already

  const loader = new clientSide.Loader({ files: audioFiles });

  ... // the rest of the scenario logic
});
```

#### Performance module

To create the performance, we have to write our own module `PlayerPerformance` by extending the [`Performance`](../class/src/client/Performance.js~Performance.html) base class.

In the constructor, we keep the `options` argument from the base class, and we also pass in the `loader` module since we’ll have to access the `audioBuffers` attribute to play the files in the performance.

```javascript
class PlayerPerformance extends Performance {
  constructor(loader, options = {}) {
    super(options); // same behavior as the base class

    this._loader = loader; // the loader module
  }

  ... // the rest of the class
}
```

Then, we write the `start` method that is called when the performance starts.
We want that method to play a sound immediately, and when we receive a message from the server.

```javascript
class PlayerPerformance extends Performance {
  ... // the constructor

  start() {
    super.start(); // don't forget this

    // Play the welcome sound immediately
    let src = audioContext.createBufferSource();
    src.buffer = this._loader.buffers[0]; // get first buffer from loader
    src.connect(audioContext.destination);
    src.start(audioContext.currentTime);

    // Play another sound when we receive a message from the server (that
    // indicates that another client joined the performance)
    client.receive('performance:play', () => {
      let src = audioContext.createBufferSource();
      src.buffer = this._loader.buffers[1]; // get second buffer from loader
      src.connect(audioContext.destination);
      src.start(audioContext.currentTime);
    });
  }
}
```

**Note:** in theory, we would need to call the [`Module#done`](../class/src/client/Module.js~Module.html#done) method when the module has finished its initialization to be able to go on to the following steps of the scenario.
However, since the `performance` is the last step of *My Scenario*, we don’t need to do it here.

#### Module logic

Now let’s glue everything together: to run a sequence of modules in series, we use the `serial(module1, module2, ...)` function.
On the other hand, to run modules in parallel, we use the `parallel(module1, module2, ...)` function.
(For more information about this, please refer to the [`client`](../class/src/client/client.js~client.html) object documentation.)

Here we go:

```javascript
window.addEventListener('load', () => {
  // Instantiate the modules
  const welcome = new Dialog({
    name: 'welcome',
    text: `<p>Welcome to <b>My Scenario</b>.</p>
           <p>Touch the screen to join!</p>`,
    activateAudio: true
  });
  const checkin = new Checkin();
  const loader = new Loader({ files: audioFiles });
  const performance = new PlayerPerformance(loader);

  // Start the scenario and order the modules
  client.start((serial, parallel) =>
    serial(
      // Initialization step: we launch in parallel the welcome module,
      // the loading of the files, and the checkin
      parallel(welcome, loader, checkin),
      // When the initialization step is done, we launch the performance
      performance
    );
  );
});
```

### 2.3 Writing the SASS file(s) for styling

The last thing we have to do on the client side is to write the SASS file(s) that will generate the `public/css/player.css` file.

The template contains all the library's SASS files (in the `sass/` folder), including the general styling partials and the module specific partials.

Among them, there are four SASS partials that we’ll always need in any scenario (the generic partials):

- `_01-reset.scss`, that resets the CSS rules of several DOM elements;
- `_02-fonts.scss`, that sets up the Quicksand font;
- `_03-colors.scss`, that sets up some color SASS variables;
- `_04-general.scss`, that sets up the general CSS that is common to all the modules.

Then, we notice that in `player/index.js`, we used 3 different modules from the library: `Dialog` for the `welcome` module, `Checkin` for the `checkin` module, and `Loader` for the `loader` module. Among these, the `Checkin` and the `Loader` require a SASS partial.

So there we go, let’s write our `src/sass/player.css` file by requiring the partials we need.

```sass
// General styling
@import '01-reset';
@import '02-fonts';
@import '03-colors';
@import '04-general';

// Module specific partials
@import '77-checkin';
@import '77-loader';

// Your own partials if needed
// @import 'performance'

```

We could also add our own SASS code (that goes along the `PlayerPerformance` module, for example) if we had to customize some of the appearance.

**Note:** more generally, the `sass/` folder should contain one `clientType.scss` file for each client type involved in the scenario (*e.g.* `player.scss`, `conductor.scss`, `env.scss`, …).

## 3. Server side

As some of the modules on the client side need to communicate with the server (for instance the `performance` that needs to send the connection information to the clients), let's now have a look at the server side.

Basically, the server side of the application must provide the server modules that communicate with the client-side modules.

Let's edit the file `src/server/indexjs`: first, we import the libraries and set up the Express app.

```javascript
// Import external libraries
const express = require('express');
const path = require('path');

// Import Soundworks library modules (server side)
import { server, Checkin, Performance } from 'soundworks/server';
```

Then, we set up the modules that the client needs to communicate with.
In this example, there is the `Checkin` module, and the `PlayerPerformance` module we’ll need to write ourselves.

In the `Checkin` module, we indicate the maximum number of players this performance supports.

```javascript
const checkin = new serverSide.Checkin({ maxClients: 100 }); // we accept a maximum of 100 clients
```

Finally, we write the performance module by extending [`Performance`](../class/src/server/Performance.js~Performance.html) base class.
The [`enter`](../class/src/server/Performance.js~Performance.html#enter) method is called when the client `client` starts the performance (on the client side).
When that happens, we simply send a WebSocket message back to all the other clients to tell them to play a sound (`client.broadcast('performance:play');`).
In this example, nothing needs to be done when the client connects to the server, disconnects from the server, or exits the performance (apart from what the [`Performance`](../class/src/server/Performance.js~Performance.html) base class already does), so we don't have to override these methods.

```javascript
class PlayerPerformance extends Performance {
  constructor() {
    super(options);
  }

  // When the client enters the performance...
  enter(client) {
    super.enter(client);

    // Send a message to all the other clients
    client.broadcast('performance:play');
  }
}

```

We can now instantiate the performance module, and start the server and map the `'player'` client type to the modules we just set up.
This last command indicates that all clients connecting as a `'player'` (through the root URL) will need to communicate with the `checkin` and `performance` modules on the server side.

```javascript
const performance = new PlayerPerformance();

// Launch server
const app = express();
const dir = path.join(process.cwd(), 'public');
server.start(app, dir, process.env.PORT || 3000);

// Map modules to client types
server.map('player', checkin, performance);
```

**Note:** we also used the [`Dialog`](../class/src/client/Dialog.js~Dialog.html) and the [`Loader`](../class/src/client/Loader.js~Loader.html) modules on the client side, but they do not need to communicate with the server so we don't use them on the server side.

## 4. Run!

Congratulations, you just created your first scenario!
To build the files and launch the server, open a Terminal window in the project folder, run `npm install` to install all the dependencies and then `npm run bundle`.
You can also run `npm run watch` to watch the changes in your files and restart the server when necessary.

# How to write a module?

This section explains the example a simplified version of the `Checkin` module.

The simplified `Checkin` module assigns an available index to any client who connects to the server.
When no indices are available anymore, the `Checkin` module informs the participant with a message on the screen (on the client side).

## Client side

In detail, the `start` method of the module sends a request to the server side `Checkin` module via WebSockets, asking the server to send an available client index.

When it receives the response from the server, it displays the label on the screen (*e.g.* “Please go to position 3 and touch the screen.”) and waits for the participant’s acknowledgement.

The server may send an `unavailable` message in the case where no more clients can be admitted to the performance (for example when all predefined positions are occupied).
In this case, the applications ends on a blocking dialog (“Sorry, we cannot accept more players at the moment, please try again later”) without calling the `done` method.

```javascript
// Import Soundworks library (client side)
import { client, Module } from 'soundworks/client';

// Write the module
export default class Checkin extends Module {
  constructor() {
    // Call base class constructor declaring a name, a view and a background color
    super('checkin', true, 'black');

    // Method bindings
    this._acknowledgeHandler = this._acknowledgeHandler.bind(this);
    this._unavailableHandler = this._unavailableHandler.bind(this);
    this._clickHandler = this._clickHandler.bind(this);
  }

  // Start the module and go through the initialization
  start() {
    // Call base class start method
    super.start();

    // Request an available client index from the server
    client.send('checkin:request');

    // Setup listeners for server messages
    client.receive('checkin:acknowledge', this._acknowledgeHandler);
    client.receive('checkin:unavailable', this._unavailableHandler);
  }

  // In the case of a lost (and then recovered) connection with the server,
  // if the module didn't go through the whole initialization process (*i.e.* if
  // the module didn't call its `done` method), we reset the module to its
  // default state to be able to call the `start` method again
  reset() {
    super.reset();

    // Remove listeners for server messages
    client.removeListener('checkin:acknowledge', this._acknowledgeHandler);
    client.removeListener('checkin:unavailable', this._unavailableHandler);

    // Remove click listener
    this.view.removeEventListener('click', this._clickHandler, false);
  }

  // In the case of a lost (and then recovered) connection with the server,
  // if the module went through the whole initialization process (*i.e.* if the
  // module called its `done` method), we send to the server the index
  // originally assigned
  restart() {
    super.restart();

    // Send current checkin information to the server
    client.send('checkin:restart', this.index);

    this.done();
  }

  // Receive acknowledgement from the server with client index and optional
  // label
  _acknowledgeHandler(index) {
    client.index = index;

    const text = `<p>Please go to #{index} and touch the screen.<p>`;
    this.setCenteredViewContent(text);

    // Call 'done' when the participant clicks on the screen
    this.view.addEventListener('click', this._clickHandler, false);
  }

  // If there are no more indices available, display a message on screen
  // and DO NOT call the 'done' method
  _unavailableHandler() {
    const text = `<p>Sorry, we cannot accept more connections at the moment,
    please try again later.</p>`;

    this.setCenteredViewContent(text);
  }

  _clickHandler() {
    this.done();
  }
}
```

As shown in this code example, the `ClientModule` base class may provide a `view` (*i.e.* an HTML `<div>`) that is added to the DOM (specifically to the `#container` element) when the module starts, and removed from the DOM when the module calls its `done` method.

The boolean that is passed as second argument to the `constructor` of the base class determines whether the module actually creates its `view` or not.

The method `setCenteredViewContent` allows for adding an arbitrary centered content (*e.g.* a paragraph of text) to the view.

## Server side

In our simplified server side `Checkin` module example, the `connect` method must:
- Install a listener that — upon request of the client — obtains an available client `index` and sends it back to the client;
- Listen for client indices that might have been assigned earlier during the performance, in case the server restarted.

The `disconnect` method has to release the client index so that it can be reused by another client that connects to the server.

```javascript
// Import Soundworks library (server side)
import { Module } from 'soundworks/server';

// Write the module
class Checkin extends Module {
  constructor(maxClients, options = {}) {
    super();

    this._maxClients = maxClients;
    this._availableIndices = [];
    this._unavailableIndices = [];

    // Fill an array with all available indices
    for (let i = 1; i < maxClients - 1; i++)
      this._availableIndices.push(i);
  }

  connect(client) {
    // Listen for a checkin request from the client side
    client.receive('checkin:request', () => {
      // Get an available client index
      let index = this._getIndex();

      if (index >= 1) {
        client.index = index;
        // Acknowledge check-in to client
        client.send('checkin:acknowledge', index);
      } else {
        // No client indices available
        client.send('checkin:unavailable');
      }
    });

    // Listen for checkin information from the client side
    client.receive('checkin:restart', (index) => {
      client.index = index;

      this._makeIndexUnavailable(index);
    });
  }

  disconnect(client) {
    // Release client index
    this._releaseIndex(client.index);
  }

  // ... _getIndex, _releaseIndex, _makeIndexUnavailable methods
}
```
