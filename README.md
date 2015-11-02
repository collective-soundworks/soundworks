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


#### Server side: the `server` object

The `server` object contains the basic methods of the server. For instance, this object allows setting up, configuring and starting the server with the method `start` while the method `map` allows for managing the mapping between different types of clients and their required server modules. Additionally, the method `broadcast` allows to send messages to all connected clients.

For clarity, the methods of `server` are split into two groups.

##### Initialization and module logic

- `start(app:Object, publicPath:String, port:Number)`  
  The `start` method starts the server with the Express application `app` that uses `publicPath` as the public static directory, and listens to the port `port`.
- `map(clientType:String, ...modules:ServerModule)`  
  The `map` method is used to indicate that the clients of type `clientType` (as initialized by `client.init` on the client side) require the server modules `...modules`. Additionally, this method routes the connections from the corresponding URL to the corresponding view. More specifically:
  - A client connecting to the server through the root URL `http://my.server.address:port/` is considered as a `player` client and displays the view `player.ejs`;
  - A client connecting to the server through the URL `http://my.server.address:port/clientType` would be considered as a `clientType` client, and display the view `clientType.ejs`.

##### WebSocket communication
++
- `broadcast(clientType:String, msg:String, ...args:Any)`  
  The `broadcast` method sends the message `msg` and any number of values `...args` (of any type) to all the clients of type `clientType` (as initialized by `client.init` on the client side) through WebSockets.  
  **Note:** on the client side, the clients receive the message with the command `client.receive(msg:String, callback:Function)`, where the `callback` function would take `...args` as arguments (see the [`client` object WebSocket communication](#initialization-and-websocket-communication) section above).

### Basic/base classes

#### The ServerClient class

The `ServerClient` module is used to keep track of each connected client and to communicate with it via WebSockets (see the [`client` object WebSocket communication](#initialization-and-websocket-communication) section above). Each time a client of type `clientType` connects to the server, *Soundworks* creates an instance of `ServerClient`. An instance of the class is passed to the `connect` and `disconnect` methods of all the server side modules that are mapped to the `clientType` clients, as well as to the `enter` and `exit` methods of any `performance` class mapped to that same client type.

###### Methods

- `send(msg:String, ...args:Any)`  
  The `send` method sends the message `msg` and any number of values `...args` (of any type) to that client through WebSockets.  
- `receive(msg:String, callback:Function)`  
  The `receive` method executes the callback function `callback` when it receives the message `msg` sent by that instantiated client.  
- `broadcast(msg:String, ...args:Any)`  
  The `broadcast` method sends the message `msg` and a list of arbitrary arguments `...args` to all other clients of the same type (*i.e.* excluding the given client itself) through WebSockets.

###### Attributes
++
- `type:String`  
  The `type` attribute stores the type of the client. This is the client type that is specified when initializing the `client` object on the client side with `client.init(clientType);` (generally at the very beginning of the `index.es6.js` file your write).
- `index:Number = 0`  
  The `index` attribute stores the index of the client as set by the `ServerCheckin` module (for more information, see [`ServerCheckin` module](#servercheckin)).
- `coordinates:Array = null`  
  The `coordinates` attribute stores the coordinates of the client as an `[x, y]` array (for more information, see [`ServerCheckin` module](#servercheckin)).
- `modules:Object = {}`  
  The `modules` property is used by any module to associate data to a particular client. All the data associated with a module whose `name` is `moduleName` is accessible through the key `moduleName` (for more information, see [`ServerModule`](#servermodule)). For instance, the `sync` module keeps track of the time offset between the client and the sync clocks in `this.modules.sync.timeOffset`. Similarly, the `performance` module could keep track of each client's status in `this.modules.performance.status`.

#### The `Module` base class

The `Module` server and client classes are the base classes that any *Soundworks* module should extend. These base classes define interfaces to be implemented by the derived modules, and provide a set of attributes and methods that facilitate the implementation of modules.

##### ClientModule
++
The `ClientModule` extends the `EventEmitter` class. Each module should have a `start` and a `done` method, as explained in the [Implementing a module](#implementing-a-module) section. The `done` method must be called when the module can hand over the control to the subsequent modules (*i.e.* when the module has done its duty, or when it may run in the background for the rest of the scenario after it finished its initialization process). The base class optionally creates a view — a fullscreen `div` accessible through the `view` attribute — that is added to the DOM when the module is started and removed when the module calls done. (Specifically, the `view` element is added to the `#container` element.)

Any module that extends the `ClientModule` class requires the four generic SASS partials listed in [Styling with SASS](#styling-with-sass).

###### Methods
++
- `constructor(name:String, hasView:Boolean = true, viewColor:String = 'black')`  
  The `constructor` accepts up to three arguments:
  - `name:String`, name of the module that is also the identifier and class of the module's `view` DOM element (`<div id='name' class='module name'></div>`);
  - `hasView:Boolean = true`, determines whether the module creates the `view` DOM element or not;
  - `viewColor = 'black'`, background color of the module's view (the class names suitable for this option are defined in the library’s `sass/_03-colors.scss` file).
- `start()`  
  The `start` method is called to start the module, and should handle the logic of the module on the client side. For instance, it takes care of the communication with the module on the server side by sending WebSocket messages and setting up WebSocket message listeners. Additionally, if the module has a `view`, the `start` method creates the corresponding HTML element and appends it to the DOM’s main container element (`div#container`).
- `done()`  
  The `done` method should be called when the module can hand over the control to a subsequent module (for instance at the end of the `start` method you write). If the module has a `view`, the `done` method removes it from the DOM.  
  **Note:** you should not override this method.
- `setCenteredViewContent(htmlContent:String)`  
  The `setCenteredViewContent` method set an arbitrary centered HTML content `htmlContent` to the module's `view`. The method should be called only if the module has a `view`.
- `removeCenteredViewContent()`  
  The `removeCenteredViewContent` method removes the centered HTML content (set by `setCenteredViewContent`) from the `view`.

###### Attributes
++
- `view = null`  
  The `view` attribute of the module is the DOM element (a full screen `div`) in which the content of the module is displayed. This element is a child of the main container (`<div id='container' class='container'></div>`), which is the only child of the `body` element. A module may or may not have a view, as indicated by the argument `hasView:Boolean` of the `constructor`. When that is the case, the view is created and added to the DOM when the `start` method is called, and is removed from the DOM when the `done` method is called.
++
In practice, here is an example of how you would extend this class to create a module on the client side (for a more thorough example, please refer to the [Implementing a module](#implementing-a-module) section).
++
```javascript
/* Client side */

// Require the Soundworks library (client side)
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

    this.done(); // call this method when the module can hand over the control to a subsequent module
  }
}
```

##### ServerModule
++
The `ServerModule` extends the `EventEmitter` class. Each module should have a `connect` and a `disconnect` method, as explained in the [Implementing a module](#implementing-a-module) section.
Any module mapped to the type of client `clientType` (thanks to the `server.map` method, see the [`server` core object](#server-side-the-server-object) for more information) would call its `connect` method when such a client connects to the server, and its `disconnect` method when such a client disconnects from the server.

###### Methods
++
- `constructor(name = 'unnamed')`  
  The `constructor` accepts the following arguments:
  - `name:String`, name of the module.
- `connect(client:ServerClient)`  
  The `connect` method is called when the client `client` connects to the server, and should handle the logic of the module on the server side. For instance, it can take care of the communication with the client side module by setting up WebSocket message listeners and sending WebSocket messages, or it can add the client to a list to keep track of all the connected clients.
- `disconnect(client:ServerClient)`  
  The `disconnect` method is called when the client `client` disconnects from the server, and should do the necessary when that happens. For instance, if the module keeps track of the connected clients, it should remove the client from that list.



In practice, here is how you would extend this class to create a module on the server side (for a more thorough example, please refer to the [Implementing a module](#implementing-a-module) section).

```javascript
/* Server side */

// Require the Soundworks library (server side)
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
++
The `Performance` module is a base class meant to be extended when you write the performance code of your scenario. It is a regular `Module`, and its particularity is to keep track of the clients who are currently in the performance by maintaining the array `this.clients` on the server side, and to have the `enter` and `exit` methods on the server side that inform the module when the client entered the performance (*i.e.* when the `performance` on the client side called its `start` method) and left it (*i.e.* when the `performance` on the client side called its `done` method, or if the client disconnected from the server).
++
**Note:** this base class is provided for convenience only. You can also write your performance by extending a regular `Module` rather than extending this class.

##### ClientPerformance
++
The `ClientPerformance` module extends the `ClientModule` base class and constitutes a basis on which to build a performance on the client side. It always has the `view` attribute.

###### Methods
++
- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `name:String = 'performance'`, the name of the module;
  - `color:String = 'black'`, the `viewColor` of the module.
- `start()`  
  The `start` method extends the `ClientModule`’s `start` method and is automatically called to start the performance on the client side.
- `done()`  
  The `done` method extends the `ClientModule`’s `done` method and can be called if ever the performance terminates before the client disconnects.

##### ServerPerformance

The `ServerPerformance` module extends the `ServerModule` base class and constitutes a basis on which to build a performance on the server side.

###### Methods
++
- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `name:String`, name of the module.
- `connect(client:ServerClient)`  
  The `connect` method extends the `ServerModule`’s `connect` method. It adds the client `client` to the array `this.clients` when it receives the WebSocket message `'performance:start'`, and removes it from that array when it receives the WebSocket message `'performance:done'`.
- `disconnect(client:ServerClient)`
   The `disconnect` method extends the `ServerModule`’s `disconnect` method. It removes the client `client` from the array `this.clients`.
- `enter(client:ServerClient)`  
  The `enter` method is called when the client `client` starts the performance.
- `exit(client:ServerClient)`  
  The `exit` method is called when the client `client` leaves the performance (*i.e.* when the `ClientPerformance` calls its `done` method, or if the client disconnects from the server).  

**Note:** in practice, you will mostly override the `enter` and `exit` methods when you write your performance.

###### Attributes
++
- `clients:Array = []`  
  The `clients` attribute is an array that contains the list of the clients who are currently in the performance (*i.e* who started it and have not left it yet).

### Client only modules

#### ClientDialog
++
The `ClientDialog` extends the `ClientModule` base class and displays a full screen dialog. It requires the participant to tap the screen to make the view disappear. The module is also used at the very beginning of a scenario to activate the Web Audio API on iOS devices (with the option `activateWebAudio`). The `ClientDialog` module calls its `done` method when the participant taps on the screen.

###### Methods
++
- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `name:String = dialog`, `name` of the module;
  - `color:String = 'black'`, `viewColor` of the module;
  - `text:String = "Hello!"`, text to be displayed in the dialog;
  - `activateAudio:Boolean = false`, whether the module activates the Web Audio API when the participant touches the screen (useful on iOS devices).
++
For instance, the following code would generate the HTML content shown below and append it to the `div#container` when the module starts:
++
```javascript
var welcomeDialog = new ClientDialog({
  name: 'welcome',
  text: 'Welcome to this awesome scenario!',
  color: 'alizarin' // the list of available colors is in soundworks-template's 'src/sass/_03-colors.scss' folder
});
```
++
```html
<div id='welcome' class='module welcome alizarin'>
  <p>Welcome to this awesome scenario!</p>
</div>
```

#### ClientLoader
++
The `ClientLoader` module extends the `ClientModule` base class and allows for loading audio files that can be used in the scenario (for instance, by the `performance` module). The `Loader` module has a view that displays a loading bar indicating the progress of the loading. The `ClientLoader` module calls its `done` method when all the files are loaded.
++
The `ClientLoader` module requires the SASS partial `_77-loader.scss`.

###### Methods
++
- `constructor(audioFiles:Array, options:Object = {})`  
  The `constructor` accepts one mandatory argument:
  - `audioFiles:Array`  
     The `audiofiles` array contains the links (`String`) to the audio files to be loaded. (The audio files should be in the `public/` folder of your project, or one of its subfolders.)  
  In addition, it accepts the following `options`:
  - `name:String = loader`, `name` of the module;
  - `color:String = 'black'`, `viewColor` of the module.
++
For instance, the following code would allow to access the kick and snare audio buffers created from the mp3 files as shown below:
++
```javascript
// Instantiate the module with the files to load
var loader = ClientLoader(['sounds/kick.mp3', 'sounds/snare.mp3']);

// Get the corresponding audio buffers
var kickBuffer = loader.audioBuffers[0];
var snareBuffer = loader.audioBuffers[1];
```

###### Attributes
++
- `audioBuffers:Array = []`  
  The `audioBuffers` array contains the audio buffers created from the audio files passed in the `constructor`.

#### ClientOrientation
++
The `ClientOrientation` module extends the `ClientModule` base class and allows for calibrating the compass by getting an angle reference. It displays a view with an instruction text: the user is asked to tap the screen when the phone points at the desired direction for the calibration. WHen that happens, the current compass value is set as the angle reference. The `ClientOrientation` module calls its `done` method when the participant taps the screen.

###### Methods
++
- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `name:String = orientation`, `name` of the module;
  - `color:String = 'black'`, `viewColor` of the module;
  - `text:String = 'Point the phone exactly in front of you, and touch the screen.'`, instruction text to be displayed.

###### Attributes
++
- `angleReference:Number`  
  The `angleReference` attribute is the value of the `alpha` angle (as in the [`deviceOrientation` HTML5 API](http://www.w3.org/TR/orientation-event/)) when the user touches the screen while the `ClientOrientation` module is displayed. It serves as a calibration / reference of the compass.

#### ClientPlatform
++
The `ClientPlatform` module extends the `ClientModule` base class and checks whether the device is compatible with the technologies used in the *Soundworks* library. (Compatible devices are running on iOS 7 or above, or on Android 4.2 or above with the Chrome browser in version 35 or above.) If that is not the case, the module displays a blocking view and prevents the participant to go any further in the scenario. The `ClientPlatform` module calls its `done` method immediately if the phone passes the platform test, or never otherwise.

###### Methods
++
- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `name:String = platform`, `name` of the module;
  - `color:String = 'black'`, `viewColor` of the module.

### Client/server modules

#### Checkin
++
The `Checkin` module is responsible for keeping track of the connected clients by assigning them indices. In case that the scenario is based on predefined positions (*i.e.* a `setup`), the indices correspond to the indices of positions that can be either assigned automatically or selected by the participants.
++
For instance, say that the scenario requires 12 participants who sit on a grid of 3 ⨉ 4 predefined positions. When a client connects to the server, the `Checkin` module could assign the client to a position on the grid that is not occupied yet. The application can indicate the participant a label that is associated with the assigned position. Similarly, if the scenario takes place in a theater with labeled seats, the `Checkin` module would allow the participants to indicate their seat by its label (*e.g.* a row and a number). If the scenario does not require the participants to sit at particular locations, the `Checkin` module would just assign them arbitrary indices within the range of total number of users the scenario supports.
++
Alternatively, when configuring the module adequately, the module can assign arbitrary indices to the the participants and request that they indicate their approximate location in the performance space on a map.
++
The `ClientCheckin` module requires the SASS partial `_77-checkin.scss`.

##### ClientCheckin
++
The `ClientCheckin` module extends the `ClientModule` base class and takes care of the check-in on the client side. The `ClientCheckin` module calls its `done` method when the user is checked in.

###### Methods
++
- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `name:String = 'checkin'`, `name` of the module;
  - `color:String = 'black'`, `viewColor` of the module;
  - `select:String = 'automatic'`, mode of client index and position selection. The following values are accepted:
    - `'automatic'`, the client index is selected automatically, no positions are attributed. In case that the client index is associated with a label (requires a predefined `setup` on the server side), the label is indicated to the participant via a dialog;
    - `'label'`, the participant can select a label associated with a predefined position via a dialog (requires a predefined `setup` on the server side);
    - `'location'`, the client index is attributed automatically, the participant can indicate an approximate location on a map via a dialog;
  - `order:String = 'ascending'`, order of `'automatic'` client index selection
    - `'ascending'`, available indices are selected in ascending order;
    - `'random'`, available indices are selected in random order (not available when the maximum number of clients, as set on the server side, exceeds 1000);
  - `instructions:Function = defaultInstructions`, function defined as `instructions(label:String) : String` that generates the HTML code of the instructions displayed to the participant. The function is called when the `index` is selected automatically and the selection uses a `setup` with predefined positions (see [`ServerCheckin`](#servercheckin)). This function accepts the `label` associated to the selected position as an argument.

Below is an example of an instantiation of the `ClientCheckin` module that displays the dialog on the client side.

```javascript
/* Client side */

// Require the Soundworks library (client side)
var clientSide = require('soundworks/client');

// Instantiate the module
var checkin = new clientSide.Checkin({ select: 'automatic', order: 'random' });
```

##### ServerCheckin

The `ServerCheckin` extends the `ServerModule` base class and takes care of the check-in on the server side.

- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `name:String = checkin`, `name` of the module;
  - `setup:ServerSetup = null`, predefined setup of the performance space (see [`ServerSetup` class](#serversetup));
  - `maxClients:Number = Infinity`, maximum number of clients supported by the scenario (if a `setup` is provided, the maximum number of clients the number of predefined positions of that `setup`).

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

#### Control

The `Control` module is used to control an application through a dedicated client (that we usually call `conductor`). The module allows for declaring `parameters`, `infos`, and `commands`, through which the `conductor` can control and monitor the state of the application:
- `parameters` are values that are changed by a client, sent to the server, and propagated to the other connected clients (*e.g.* the tempo of a musical application);
- `infos` are values that are changed by the server and propagated to the connected clients, to inform about the current state of the application (*e.g.* the number of connected `player` clients);
- `commands` are messages (without arguments) that are send from the client to the server (*e.g.* `start`, `stop` or `clear` — whatever they would mean for a given application) which does the necessary upon reception.

Optionally, the `ClientControl` module can automatically construct a simple interface from the list of declared controls that allows to change `parameters`, display `infos`, and send `commands` to the server.

The controls of different types are declared on the server side and propagated to the client side when a client is set up.

##### ClientControl
++
The `ClientControl` module extends the `ClientModule` base class and takes care of the `parameters`, `infos`, and `commands` on the client side. If the module is instantiated with the `gui` option set to `true`, it constructs the graphical control interface. Otherwise it simply receives the values that are emitted by the server (usually by through the `performance` module). The `ClientModule` calls its `done` method immediately after having set up the controls and, optionally, the graphical user interface.

###### Methods
++
- `constructor(options:Object = {})`    
  The `constructor` accepts the following `options`:
  - `name:String = 'control'`, `name` of the module;
  - `color:String = 'black'`, `viewColor` of the module;
  - `gui:Boolean = false`, indicates whether the `ClientControl` creates a view with the graphical control interface (automatically built from a list of controls sent by the server).

###### Attributes
++
- `parameters:Object = {}`  
   The `parameters` object contains the global parameters of the scenario. Each key of the object is associated with a parameter object. You can access the value of the parameter `'myparam'` with `this.parameters.myparam.value`.
- `infos:Object = {}`  
   The `infos` attribute contains info values that inform the client about the state of scenario on the server side. You can access the value of the info `'myinfo'` with `this.infos.myinfo.value`.
- `commands:Object = {}`  
   The `commands` attribute contains the declared commands.

###### Events
++
- `'control:parameter' : name:String, val:Any`  
  Each time a parameter is updated, the `ClientControl` module emits the `'control:parameter'` event with two arguments:
  - `name:String`, name of the parameter that changed;
  - `val:Any`, new parameter value.
- `'control:info' : name:String, val:Number|String`  
  Each time a parameter is updated, the `ClientControl` module emits the `'control:info'` event with two arguments:
  - `name:String`, name of the info value that changed;
  - `val:Any`, new info value.

##### ServerControl
++
The `ServerControl` module extends the `ServerModule` base class and takes care of the `parameters`, `infos`, and `commands` on the server side. To set up controls in a scenario, you should extend this class on the server side and declare the controls specific to that scenario with the `addParameterNumber`, `addParameterSelect`, `addCommand`, and `addDisplay methods.

###### Methods
++
- `constructor(options:Object = {})`  
  The `constructor` accepts the following `options`:
  - `name:String`, `name` of the module.
- `addParameterNumber(name:String, label:String, min:Number, max:Number, step:Number, init:Number)`  
  The `addParameterNumber` method is used to add a number control parameter. Its arguments are:
  - `name:String`, name of the parameter;
  - `label:String`, label of the parameter in the GUI on the client side;
  - `min:Number`, minimum value of the parameter;
  - `max:Number`, maximum value of the parameter;
  - `step:Number`, step to increment or decrement the value of the parameter;
  - `init:Number`, initial value of the parameter.
- `addParameterSelect(name:String, label:String, options:Array, init:String)`  
  The `addParameterSelect` method is used to add a select control parameter. In the GUI on the client side, the select parameter displays a select form with the options `options`. Its arguments are:
  - `name:String`, name of the parameter;
  - `label:String`, label of the parameter in the GUI on the client side;
  - `options:Array`, options of the select parameter the user can choose from in the GUI on the client side (the array contains `String` elements);
  - `init:String`, initial value of the parameter (present in the `options` array).
- `addCommand(name:String, label:String, fun:Function)`  
  The `addCommand` method allows for adding a command. Its arguments are:
  - `name:String`, name of the command;
  - `label:String`, label of the command in the GUI on the client side;
  - `fun:Function`, function to be executed when the command is called.
- `addInfo(name:String, label:String, init:Number|String)`  
   The `addInfo` method allows for adding an info to be displayed on the client side. Its arguments are:
  - `name:String`, name of the info to display;
  - `label:String`, label of the info in the GUI on the client side;
  - `init:Number|String`, initial value of the info to display.
- `setParameter(name:String, value:Number|String)`  
  The `setParameter` method allows set the value of the parameter `name` to `value`. The argument `value` is either of `Number` or `String` depending on whether you update a number or select parameter.
- `setInfo(name:String, value:Number|String)`  
  The `setInfo` method allows set the value of the info `name` to `value`.

#### Setup

The `Setup` module contains the information about the setup of the performance space in terms of its surface (*i.e.* dimensions and outlines) and predefined positions (*e.g.* seats or labels on the floor).

For instance, say that the scenario requires 12 participants sitting on the floor on a grid of 3 ⨉ 4 positions, the `Setup` module would contain the information about the grid, including the positions' coordinates in space and their labels. Similarly, if the scenario takes place in a theater where seats are numbered, the `Setup` module would contain the seating plan.

If the topography of the performance space does not matter for a given scenario, the `Setup` module is not needed.

##### ClientSetup

The `ClientSetup` modules extends the `ClientModule` base class and takes care of receiving the setup on the client side, and provides helper functions to display the setup on screen. The `ClientSetup` calls its `done` method when it receives the setup from the server.

The `ClientSetup` module requires the SASS partial `sass/_77-setup.scss`.

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

The `ServerSetup` extends the `ServerModule` base class and takes care of the setup on the server side. In particular, the module provides helper functions that can generate a setup automatically from some parameters.
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
