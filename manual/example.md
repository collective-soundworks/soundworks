# Example: a simplified version of the `checkin` module

The purpose of that simplified version of the `checkin` module is the following: each time a new client connects to the server, the `checkin` module assigns an available index to it. On the server side, the module can be configured with a `setup` object that lists predefined positions (*i.e.* coordinates and labels): in that case, the module on the client side can automatically request an available position from the `setup` and display the associated `label` to the participant. (In other configurations which we won't review in this example, the participants could alternatively select a label, or indicate their approximate location on a map). When no indices are available anymore, the `checkin` module informs the participant with a message on the screen (on the client side).

## Client side: the `ClientCheckin` module

In detail, the `start` method of the module sends a request to the `ServerCheckin` module via WebSockets, asking the server to send an available client index and, optionally, the label of a corresponding predefined position. When it receives the response from the server, it either displays the label on the screen (*e.g.* “Please go to C5 and touch the screen.”) and waits for the participant’s acknowledgement, or immediately calls the `done` method to hand over the control to a subsequent module (generally the `performance`). The server may send an `unavailable` message in the case where no more clients can be admitted to the performance (for example when all predefined positions are occupied). In this case, the applications ends on a blocking dialog (“Sorry, we cannot accept more players at the moment, please try again later”) without calling the `done` method.

```javascript
/* Client side */

// Require the Soundworks library (client side) and the 'client' object
var clientSide = require('soundworks/client');
var client = clientSide.client;

// Write the module
class ClientCheckin extends ClientModule {
  constructor() {
    // Call base class constructor declaring a name, a view and a background color
    super('checkin', true, 'black');
  }

  start() {
    // Call base class start method (don’t forget this!)
    super.start();

    // Request an available client index from the server
    client.send('checkin:request');

    // Receive acknowledgement from the server with client index and optional label
    client.receive('checkin:acknowledge', (index, label) => {
      client.index = index;

      if(label) {
        // Display the label in a dialog
        this.setCenteredViewContent("<p>Please go to " + label + " and touch the screen.<p>");

        // Call 'done' when the participant acknowledges the dialog
        this.view.addEventListener('click', () => this.done());
      } else {
        this.done();
      }
    }

    // If there are no more indices available, display a message on screen
    // and DO NOT call the 'done' method
    client.receive('checkin:unavailable', () => {
      this.setCenteredViewContent("<p>Sorry, we cannot accept more connections at the moment, please try again later.</p>");
    });
  }

  ... // the rest of the module

}
```

As shown in this code example, the `ClientModule` base class may provide a `view` (*i.e.* an HTML `div`) that is added to the DOM (specifically to the `#container` element) when the module starts, and removed from the DOM when the module calls its `done` method. The boolean that is passed as second argument to the `constructor` of the base class determines whether the module actually creates its `view` or not.
The method `setCenteredViewContent` allows for adding an arbitrary centered content (*e.g.* a paragraph of text) to the view.

## Server side: the `ServerCheckin` module

In our simplified `ServerCheckin` module example, the `connect` method has to install a listener that — upon request of the client — obtains an available client `index` and sends it back to the client. If the module has been configured with a `setup` (that predefines a certain number of spatial positions, associated with a `label`), the server additionally sends the `label` of the position corresponding to the client `index`. In this case, the maximum number of clients is determined by the number of seats defined by the `setup`.

The `disconnect` method has to release the client index so that it can be reused by another client that connects to the server.

```javascript
/* Server side */

// Require the Soundworks library (server side)
var serverSide = require('soundworks/server');

// Write the module
class ServerCheckin extends serverSide.Module {
  constructor(options = {}) {
    super();

    // Store setup
    this.setup = options.setup || null;
    this.maxClients = options.maxClients || Infinity;

    // Clip max number of clients
    if (setup) {
      var numPositions = setup.getNumPositions();

      if (this.maxClients > numPositions)
        this.maxClients = numPositions;
    }
  }

  connect(client) {
    // Listen for incoming WebSocket messages from the client side
    client.receive('checkin:request', () => {
      // Get an available client index
      let index = this._getIndex();

      if (index >= 0) {
        client.index = index;

        var label = undefined;

        if (this.setup) {
          // Get a label
          let label = this.setup.getLabel(index);

          // Get client coordinates according to the setup
          client.coordinates = this.setup.getCoordinates(index);
        }

        // Acknowledge check-in to client
        client.send('checkin:acknowledge', index, label);
      } else {
        // No client indices available
        client.send('checkin:unavailable');
      }

    disconnect(client) {
      // Release client index
      this._releaseIndex(client.index);
    });
  }

  ... // the rest of the module

}
```
