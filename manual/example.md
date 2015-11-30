# Example of the `Checkin` module (simplified version)

This section shows an example of how to write a module, with a simplified version of the `Checkin` module.

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

    const text = `<p>Please go to #{label} and touch the screen.<p>`;
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
