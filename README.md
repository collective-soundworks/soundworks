# SOUNDWORKS

## Table of contents

- [**Overview**](#overview)
  - [Server / client architecture](#server--client-architecture)
  - [A *Soundworks* scenario is made of a succession of modules](#a-soundworks-scenario-is-made-of-a-succession-of-modules)
  - [How to write a module?](#how-to-write-a-module)
  - [How to write a scenario?](#how-to-write-a-scenario)
- [**API**](#api)
  - [Client (server side)](#client-server-side)
  - [Dialog (client side)](#dialog-client-side)
  - [Placement](#placement)
  - [Sync](#sync)
  - [Topology](#topology)
- [**Examples**](#examples)

## Overview

*Soundworks* is a Javascript framework that enables artists and developers to create collaborative music performances where a group of participants distributed in space use their smartphones to generate sound and light through touch and motion.

The framework is modular to make it easy to implement different performance scenarios, using a server / client architecture supported by `Node.js` and `socket.io`: the boilerplate provided allows anyone to bootstrap a scenario for *Soundworks* and focus on its audiovisual and interaction design instead of the infrastructure.

### Server / client architecture 

In order to connect the smartphones with each other, *Soundworks* implements a server / client architecture using a `Node.js` server and the `socket.io` library to pass messages between the server and the clients.

The word “client” represents any entity that connects to the server. For instance, this can be:

- The smartphone of a player who takes part in the collaborative performance (we would refer to this type of client as a `player`);

- A laptop that provides an interface for the artist to control some parameters of the performance in real time (we would refer to this type of client as `conductor`);

- A computer that controls the sound and light effects in the room in sync with the players' performance, such as lasers, a global visualization or ambient sounds on external loudspeakers (we would refer to this type of client as `env`, standing for “environment”).

### A *Soundworks* scenario is made of a succession of modules

A scenario built with *Soundworks* consists in a succession of modules, each of them corresponding to one step of the scenario. Each module has a `.start()` and a `.done()` method: we launch the process corresponding to that module by calling the method `.start()`, and we call the method `.done()` when the duty of the module is done.

As an example, let's say that a scenario works as follows when a `player` connects to the server:

- The player gets a `welcome` message (*e.g.* “Welcome to the performance!”). When the player clicks on the screen…

- … the player receives some `placement` instructions while in the meantime, the smartphone has to `sync` its clock with the server. Finally, when these are done…

- … the player joins the `performance`.

Each of these steps corresponds to a module. Thus, on the client side, this scenario would be implemented as follows.

```javascript
/* Client side */

// Load the library
var clientSide = require('soundworks/client');

// Initialize the modules (the methods' arguments are explained in the documentation)
var welcome = new clientSide.Dialog(...);
var sync = new clientSide.Sync(...);
var placement = new clientSide.Placement(...);
var performance = new Performance(...); // This class has te bo written by you

// Launch the scenario!
client.start(
  client.serial(
    welcome,
    client.parallel(
      placement,
      sync
    ),
    performance
  )
);
```

To run a sequence of modules in serial, we use `client.serial(module1, module2, ...)`. A module would `.start()` only after the previous one is `.done()`. On the other hand, if some modules need to be run in parallel, we use `client.parallel(module1, module2, ...)`. This triggers a `.done()` method when all of these modules run in parallel are `.done()`.

Some of these modules need an interaction with the server (for instance, the `sync` process requires a dialog between the server and the client to synchronize the clocks). Thus, we activate all the modules that each `player` will need to talk to: on the server side, we would write the following code.

```javascript
/* Server side */

// Load the libraries and setup the Express app
var serverSide = require('soundworks/server');
var server = serverSide.server;
var express = require('express');
var app = express();

// Initialize the modules (the methods' arguments are explained in the documentation)
var sync = new serverSide.Sync(...);
var placement = new serverSide.Placement(...);
var performance = new Performance(...); // This class has te bo written by you

// Launch the server and the scenario!
server.start(app);
server.map('/player', 'My Scenario', sync, placement, performance);
```

That way, the `sync`, `placement` and `performance` modules of a `player` (who connects to the server via the namespace `'/player') would be able to dialog with the corresponding modules on the server side.

### How to write a module?

#### Client side

On the client side, a module extends the `ClientModule` base class and must have a method `.start()` and a method `.done()`.

##### .start()

The `.start()` method is called to start the module. I should handle the logic and the steps that lead to the completion of the module. **The module should call the method `this.done()` when the whole process of the module is completed.**

For instance, the purpose of the `ClientTopology` module is to get the topology from the server. Therefore, the `.start()` method of the `ClientTopology` module does the following:

- It sends a request to the `ServerTopology` module via `socket.io`, asking the server to send the `topology` object.

- When it receives the response from the server with the `topology` object, it stores the `topology` as an attribute, and finally calls the method `.done()`: the module has done its duty.

In Javascript, it looks like the following.

```javascript
class ClientTopology extends ClientModule {
  ...

  start() {
    super.start();

    socket.emit('topology_request');
    
    socket.on('topology_init', (topology) => {
      this.topology = topology;
      this.done();
    });
  }

  ...
}
```

##### .done()

The `.done()` method should rarely change from the method inherited from the base class. If you have to rewrite it though, **the one important thing this method has to do is to emit a `'done'` event associated with the module**. Put differently, this method **must** include the following line.

```javascript
this.emit('done', this);
```

#### Server side

On the server side, a module extends the `ServerModule` base class and must have a method `.connect(client:ServerClient)` and `.disconnect(client:ServerClient)`.

... TODO

### How to write a scenario?

Since *Soundworks* is built on Express, any scenario you write using *Soundworks* should roughly follow the organization of an Express app, as shown in the example below.

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
│   ├── conductor.jade
│   ├── env.jade
│   ├── player.jade
│   └── ...
├── gulpfile.js
├── package.json
└── README.md
```

For instance:

- The `public/` folder should contain any resource your clients may need to load (except the javascripts, that will be generated with our `gulp` file from the `src/` folder).
- The `src/` folder contains your source code for the different clients and the server. Each subfolder should contain and `index.es6.js` file, with the code to be exectued for that entity.
  - The default client is called `player` and the code to be exectuted for that type of client is in `src/player/index.es6.js`. This is the code that is executed when a user connects to the root URL. (`http://root-url:port/`)
  - You can add as many other types of clients as you want. The source code should lie in a folder with that name (*e.g.* `conductor/`), and have a the corresponding file in the `views/` folder (see below). Any new type of client you create will be accessible from the URL `http://root-url:port/client-type` (*e.g.* `http://root-url:port/conductor` in the case of the `conductor`). Any client that accesses the server through that URL will join the namespace `'/client-type'` in `socket.io` (*e.g.* `'/conductor'`).
  - Finally, the `src/` folder should also contain the source code of your server in the `server/` subfolder, in an `index.es6.js` file.
- The `views/` folder contains a `*.jade` file for each client type. In other words, all the subfolders in `src/` — except `server/` — should have their corresponding Jade file.

To compile the files, just run the command `gulp` in the Terminal: it will convert the files from es6 to es5, browserify the files on the client side, and launch the scenario with a `Node.js` server.

#### Client side

On the client side, the `src/player/index.es6.js` in a should look like this.

```javascript
// Require the library
var clientSide = require('soundworks/client');
var client = clientSide.client;

// Initialize the socket.io namespace depending on the client type
client.init('/player');

// Write the performance module
class MyPerformance extends clientSide.module {
  ...
}

// Scenario
window.addEventListener('load', () => {
  // Initialize the modules
  var welcome = new clientSide.Dialog(...);
  var topology = new clientSide.Topology(...);
  var placement = new clientSide.Placement(...);
  var performance = new MyPerformance(...);
  

  // Scenario logic
  client.start(
    client.serial(
      client.parallel(
        welcome,
        topology
      ),
      placement,
      performance
    )
  );
});
```

For a `env` client, the file would look the same except that the socket.io namespace initialization would be `client.init('/env')`, and the modules might be different (for instance, one could imagine that the `env` clients only require a `topology` and a `performance` module).

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
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, '../../public')));

// Write the player and env performance modules
class MyPlayerPerformance extends serverSide.Module {
  ...
}
class MyEnvPerformance extends serverSide.Module {
  ...
}

// Initialize the modules
var topology = new serverSide.Topology(...);
var placement = new serverSide.Placement(...);
var playerPerformance = new MyPlayerPerformance(...);
var envPerformance = new MyEnvPerformance(...);

// Start the scenario
server.start(app);
// Set up the module servers for the 'player' clients
server.map('/player', 'My scenario', topology, placement, playerPerformance);
// Set up the module servers for the 'env' clients
server.map('/env', 'My Scenario — Environment', topology, envPerformance);
```

Indeed, on the client side, the `player` clients initialized the modules `welcome` (that does not require a communication with the server), `topology`, `placement` and `performance`, so we set up the servers corresponding to these modules on the namespace `/player`. Similarly, the `/env` clients initialized the modules `topology` and `performance` (which both require communication with the server), so we set up the servers corresponding to these modules on the namespace `/env`.

## API

This sections explains how to use the classes of the library: how to initialize them, what arguments to pass in to the constructors, how to use the public methods, etc.

Most of the classes have a module on the server **and** client sides:

- [`Module`](#api-module)
- [`Placement`](#api-placement)
- [`Sync`](#api-sync)
- [`Topology`](#api-topology)

However, some classes only have a server side:

- [`Client`](#api-client)

And some of them are only present on the client side:

- [`Dialog`](#api-dialog)

### Client (server side)

The `Client` module is used to keep track of the connected clients.

#### Attributes

{% assign attribute = 'publicState' %}
{% assign type = 'Object' %}
{% assign default = '{}' %}
{% include includes/attribute.md %}

This object can be used by any module to store any useful information that might have to be sent to the clients at some point.

{% assign attribute = 'privateState' %}
{% assign type = 'Object' %}
{% assign default = '{}' %}
{% include includes/attribute.md %}

This object can be used by any module to store any useful information that has to be reused afterwards on the server side.

#### Methods

{% assign method = 'getInfo' %}
{% assign argument = '' %}
{% assign type = '' %}
{% assign return = 'Object' %}
{% include includes/method.md %}

Returns information about the client in an object having the following properties:

- `socketID:String`     
  The ID of the client's socket.

- `index:Number`    
  The index of the client's index (as set by the `Placement` module).

- `state:Object`    
  The public state of the client (`this.publicState`).

### Dialog (client side)

The `Dialog` module displays a dialog on the screen, and requires the user to click the screen to make the module disappear.

{% assign method = 'constructor' %}
{% assign argument = 'params' %}
{% assign type = 'Object' %}
{% assign default = '{}' %}
{% include includes/method.md %}

The constructor method takes the `params` object as an argument, whose properties are:

- `id:String = 'dialog'`  
  The ID of the dialog, that will be used as the `id` HTML attribute of the corresponding `div`.

- `text:String`  
  The text to be displayed on the dialog.

- `activateAudio:Boolean = false`  
  If set to `true`, the module with activate the Web Audio API when the user clicks the screen (useful on iOS, where sound is muted until a user action triggers some audio commands).

{% assign method = 'getInfo' %}
{% assign argument = '' %}
{% assign type = '' %}
{% assign return = 'Object' %}
{% include includes/method.md %}

Returns information about the client in an object having the following properties:

- `socketID:String`     
  The ID of the client's socket.

- `index:Number`    
  The index of the client's index (as set by the `Placement` module).

- `state:Object`    
  The public state of the client (`this.publicState`).

### Placement

The `Placement` module is responsible for keeping track of the connected clients by assigning them indices within the range of the available places in the scenario.

For instance, say that the scenario requires 12 players who sit on a grid of 3 ⨉ 4 seats: when a client connects to the server, the `Placement` module will assign a seat whithin the remaining places of this grid.

Similarly, if the scenario takes place in a theater where seats are numbered, the `Placement` module would allow the users to indicate what their seats are.

Or, if the scenario doesn't require the players to sit at particular locations, the `Placement` module would just assign them indices within the range of total number of users this scenario supports.

#### Client side

{% assign method = 'constuctor' %}
{% assign argument = 'params' %}
{% assign default = '{}' %}  
{% assign type = 'Object' %}
{% include includes/method.md %}

The constructor method takes the `params` object as an argument. The only currently supported property is:

- `display:Boolean = false`     
  When set to `true`, the module displays a dialog with the placement information for the user. The user has to click on the dialog to indicate that the placement process is `"done"`.

Below is an example of an instantiation of the `placement` module that displays the dialog.

```javascript
var clientSide = require('soundworks/client');

var placement = new clientSide.Placement({ display: true });
```

{% assign method = 'getPlaceInfo' %}
{% assign argument = '' %}
{% assign type = '' %}
{% assign return = 'Object' %}
{% include includes/method.md %}

This method returns an object with the placement information. The object returned has two properties:

- `index:Number`    
  The index of the client.

- `label:String`    
  The label of the place corresponding to that index.

#### Server side

{% assign method = 'constuctor' %}
{% assign argument = 'params' %}
{% assign type = 'Object' %}
{% include includes/method.md %}

The constructor method takes the `params` object as an argument, **that must have either a `topology` or a `numPlaces` property**. The properties supported by `params` are:

- `topology:ServerTopology = null`  
  The topology associated with the scenario. If a topology is provided (for instance because the venue where the scenario is taking place provides seats with predetermined locations), this module assigns places among the places available in the `topology`. Otherwise (no topology provided), the user must indicate the maximum number of players allowed in this scenario with the property `numPlaces`.

- `numPlaces:Number = 9999`     
  If `params` has no `topology` attribute, it must have a `numPlaces` attribute that indicates the maximum number of players allowed in the performance. In that case, the module allocates indices to each client that connects, until the total number of connected clients reaches `numPlaces`.

- `order:String = 'random'`    
  Order in which places indices are assigned. Currently supports two values:

  - `'random'`  
    Places are chosen randomly among the available indices.

  - `'ascending'`   
    Places are chosen in ascending order among the available indices.

Below is an example of the instantiation of the `placement` module on the server side.

```javascript
var serverSide = require('soundworks/server');

// Case 1: the scenario has a topology
var toplogy = new serverSide.Topology({ cols: 3, rows: 4 });
var placement = new serverSide.Placement({ topology: toplogy });

// Case 2: the scenario does not have a topology
var placement = new serverSide.Placement({ numPlaces: 500, order: 'ascending' });
```

### Sync

The `Sync` module is responsible for synchronizing the clients' clocks on the server clock, so that the server and all the clients share a common clock.

For instance, this allows all (or part of) the clients to trigger an event at the same time, such as displaying a color on the screen or playing a drum kick in a synchronized manner.

#### Client side

{% assign method = 'constuctor' %}
{% assign argument = 'params' %}
{% assign default = '{}' %}  
{% assign type = 'Object' %}
{% include includes/method.md %}

The constructor method takes the `params` object as an argument. It doesn't currently support any option.

Below is an example of an instantiation of the `placement` module that displays the dialog.

```javascript
var clientSide = require('soundworks/client');

var sync = new clientSide.Sync();
```

{% assign method = 'getLocalTime' %}
{% assign argument = 'serverTime' %}
{% assign default = 'null' %}
{% assign type = 'Number' %}
{% assign return = 'Number' %}
{% include includes/method.md %}

This method returns the time in the client clock (`audioContext` clock) when the server clock reaches `serverTime`. If no arguments are provided, the method returns `audioContext.currentTime`. The time returned is in seconds.

{% assign method = 'getServerTime' %}
{% assign argument = 'localTime' %}
{% assign default = 'audioContext.currentTime' %}
{% assign type = 'Number' %}
{% assign return = 'Number' %}
{% include includes/method.md %}

This method returns the time on the server when the client clock reaches `localTime`. If no arguments are provided, the method returns the time on the server when the method is called. The time returned is in seconds.

#### Server side

{% assign method = 'constuctor' %}
{% assign argument = '' %}
{% assign type = '' %}
{% include includes/method.md %}

The constructor method takes instantiates the `Sync` module on the server side.

Below is an example of the instantiation of the `Sync` module on the server side.

```javascript
var serverSide = require('soundworks/server');

var sync = new serverSide.Sync();
```

### Topology

The `Topology` module contains the information about the physical locations of the available places in the scenario. The location is fixed and determined in advances.

For instance, say that the scenario requires 12 players who sit on a grid of 3 ⨉ 4 seats: the `Topology` module would contain the information about that grid of seats, including their physical location and their name (`label`).

Similarly, if the scenario takes place in a theater where seats are numbered, the `Topology` module would contain information about where the seats are physically, and what their numbers (`label`) are.

I the placement of the users in the scenario doesn't matter, the `Topology`module is not needed.

#### Client side

{% assign method = 'constuctor' %}
{% assign argument = 'params' %}
{% assign default = '{}' %}  
{% assign type = 'Object' %}
{% include includes/method.md %}

The constructor method takes the `params` object as an argument. The only currently supported property is:

- `display:Boolean = false`     
  When set to `true`, the module displays a dialog with the topology.

{% assign method = 'displayTopology' %}
{% assign argument = 'div' %}
{% assign type = 'Element' %}
{% include includes/method.md %}

This method displays a graphical representation of the topology in the `div` element provided as an argument.

{% assign method = 'addClassToTile' %}
{% assign argument = 'topologyDisplay,index,className' %}
{% assign default = ',,"player"' %}
{% assign type = 'Element,Number,String' %}
{% include includes/method.md %}

In the `Topology` graphical representation that lies in the `topologyDisplay` DOM element (which had to be created by the `.displayTopology(div)` method), this method adds the class `className` to the tile corresponding to the index `index` in the topology.

{% assign method = 'removeClassFromTile' %}
{% assign argument = 'topologyDisplay,index,className' %}
{% assign default = ',,"player"' %}
{% assign type = 'Element,Number,String' %}
{% include includes/method.md %}

In the `Topology` graphical representation that lies in the `topologyDisplay` DOM element (which had to be created by the `.displayTopology(div)` method), this method removes the class `className` from the tile corresponding to the index `index` in the topology.

Below is an example of the `Topology` module in use.

```javascript
// 1. Require the Soundworks library
var clientSide = require('soundworks/client');

// 2. Instantiate the class
var topology = new clientSide.Topology();

// 3. Display a graphical representation of the topology in a div of the DOM
var topologyGUI = document.getElementById('topology-container');
topology.displayTopology(topologyGUI);

// 4. Add the class 'red-highlight' of tile #3 in this graphical representation
topology.addClassToTile(topologyGUI, 3, 'red-highlight');
```

#### Server side

{% assign method = 'constuctor' %}
{% assign argument = 'params' %}
{% assign type = 'Object' %}
{% include includes/method.md %}

The constructor method takes the `params` object as an argument with the following properties:

- `type:String = 'matrix'`  
  This parameter indicates the type of topology to generate. The currently supported values are:
  - `'matrix'`: creates a grid of `params.cols` columns and `params.rows` rows.
  - (will probably add `'csv'` soon)

- `cols:Number = 3`  
  In the case where the topology type is a `'matrix'`, this parameter indicates the number of columns the matrix has.

- `rows:Number = 4`  
  In the case where the topology type is a `'matrix'`, this parameter indicates the number of rows the matrix has.

- `colSpacing:Number = 2`  
  In the case where the topology type is a `'matrix'`, this parameter indicates the physical distance between 2 columns of the matrix, in meters.

- `rowSpacing:Number = 2`  
  In the case where the topology type is a `'matrix'`, this parameter indicates the physical distance between 2 rows of the matrix, in meters.

- `colMargin:Number = colSpacing / 2`  
  In the case where the topology type is a `'matrix'`, this parameter indicates the physical distance between the venue space and the edge of the matrix (horizontally).

- `rowMargin:Number = rowSpacing / 2`  
  In the case where the topology type is a `'matrix'`, this parameter indicates the physical distance between the venue space and the edge of the matrix (vertically).

Below is an example of the instantiation of the `Topology` module on the server side.

```javascript
var serverSide = require('soundworks/server');

// Creating a matrix topology with 4 columns and 5 rows
var toplogy = new serverSide.Topology({ cols: 4, rows: 5 });
```

{% assign method = 'getNumPlaces' %}
{% assign argument = '' %}
{% assign type = '' %}
{% include includes/method.md %}

This method returns the number (type `:Number`) of places of the topology. For instance, if the topology is a 4 ⨉ 5 matrix, this would return the number `20` (which is the result of 4 ⨉ 5).

{% assign method = 'getLabel' %}
{% assign argument = 'index' %}
{% assign type = 'Number' %}
{% include includes/method.md %}

This method returns the label of the place associated with the index `index` in the topology.

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
│   └── player.jade
├── gulpfile.js
├── package.json
└── README.md
```

### 2. Client side

On the client side, there are two things we need to do: write the Javascript code, and set up the Jade file that will generate the HTML.

#### Setting up the Jade file

Let's start with the easy part, the Jade file located in `beats/views/player.jade`.

```jade
doctype
html
  head
    meta(charset="utf-8")
    meta(name="viewport",
         content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no")
    title #{title}
    script(src="/socket.io/socket.io.js")
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
    #container.container
    script(src="/javascripts/player.js")
```

The most important things here are:

- To load the `socket.io` library with `script(src="/socket.io/socket.io.js")`,
- To have a `<div>` element in the `body` that has the ID `#container` and a class `.container`,
- And to load the Javascript file `/javascripts/player.js`.

#### Writing our scenario in Javascript

Now let's write the core of our scenario in the `src/player/index.es6.js` file.

Step by step, this is how the scenario will look like when a user connects to the server:

- The screen displays a welcome message that the user has to click on to enter the scenario,
- There is a synchronization process so that the client and the server shares a common clock,
- Finally, the user enters the performance where the smartphone emits a sound a regular invervals, synced with the other smartphones of the performance.

First of all, let's load the library and initialize our `socket.io` namespace.

```javascript
// Loading the libraries
var clientSide = require('soundworks/client');
var client = clientSide.client;

// Initiliazing the socket.io namespace
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
app.set('view engine', 'jade');
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


