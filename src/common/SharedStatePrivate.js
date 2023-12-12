import ParameterBag from '../common/ParameterBag.js';
import {
  DELETE_REQUEST,
  DELETE_RESPONSE,
  DELETE_NOTIFICATION,
  DETACH_REQUEST,
  DETACH_RESPONSE,
  UPDATE_REQUEST,
  UPDATE_RESPONSE,
  UPDATE_ABORT,
  UPDATE_NOTIFICATION,
} from '../common/constants.js';

/**
 * The "real" state, this instance is kept private by the server.StateManager.
 * It cannot be accessed without a SharedState proxy
 * @private
 */
class SharedStatePrivate {
  constructor(id, schemaName, schema, manager, initValues = {}) {
    this.id = id;
    this.schemaName = schemaName;

    this._manager = manager;
    this._parameters = new ParameterBag(schema, initValues);
    this._attachedClients = new Map(); // other peers interested in watching / controlling the state

    this._creatorRemoteId = null;
    this._creatorId = null;
  }

  _attachClient(remoteId, client, isOwner = false) {
    this._attachedClients.set(remoteId, client);

    if (isOwner) {
      this._creatorRemoteId = remoteId;
      this._creatorId = client.id;
    }

    // attach client listeners
    client.transport.addListener(`${UPDATE_REQUEST}-${this.id}-${remoteId}`, async (reqId, updates, context) => {
      // apply registered hooks
      const hooks = this._manager._hooksBySchemaName.get(this.schemaName);
      const values = this._parameters.getValues();
      let hookAborted = false;

      // cf. https://github.com/collective-soundworks/soundworks/issues/45
      for (let hook of hooks.values()) {
        const result = await hook(updates, values, context);

        if (result === null) { // explicit abort if hook returns null
          hookAborted = true;
          break;
        } else if (result === undefined) { // implicit continue if hook returns undefined
          continue;
        } else { // the hook returned an updates object
          updates = result;
        }
      }

      if (hookAborted === false) {
        const filteredUpdates = {};
        let hasUpdates = false;

        for (let name in updates) {
          // from v3.1.0 - the `filteredUpdates` check is made using 'fast-deep-equal'
          //    cf. https://github.com/epoberezkin/fast-deep-equal
          //    therefore unchanged objects are not considered changed
          //    nor propagated anymore.
          // until v3.0.4 - we checked the `schema[name].type === 'any'`, to always consider
          //    objects as dirty, because if the state is attached locally, we
          //    compare the Object instances instead of their values.
          //    @note - this should be made more robust but how?
          const [newValue, changed] = this._parameters.set(name, updates[name]);

          // if `filterChange` is set to `false` we don't check if the value
          // has been changed or not, it is always propagated to client states
          const { event, filterChange } = this._parameters.getSchema(name);

          // if event type reset internal value to null
          if (event) {
            this._parameters.set(name, null);
          }

          if ((filterChange && changed) || !filterChange) {
            filteredUpdates[name] = newValue;
            hasUpdates = true;
          }
        }

        if (hasUpdates) {
          // send response to requester
          // client.transport.emit(`${UPDATE_RESPONSE}-${this.id}-${remoteId}`, reqId, filteredUpdates);

          // @note: we propagate server-side last, because as the server transport
          // is synchronous it can break ordering if a subscription function makes
          // itself an update in reaction to an update, therefore network messages
          // order would be broken,

          // we need to handle cases where:
          // client state (client.id: 2) sends a request
          // server attached state (client.id: -1) spot a problem and overrides the value
          // we want the remote client (id: 2) to receive in the right order:
          // * 1. the value it requested,
          // * 2. the value overriden by the server-side attached state (id: -1)

          // this problem could be solved properly with a reducer system:
          // if (dirty) {
          //   -> call (async) reducer
          //   -> get values from reducer
          //.  -> dispatch to everybody
          // }

          for (let [peerRemoteId, peer] of this._attachedClients.entries()) {
            // propagate notification to all other attached clients except server
            if (remoteId !== peerRemoteId && peer.id !== -1) {
              peer.transport.emit(`${UPDATE_NOTIFICATION}-${this.id}-${peerRemoteId}`, filteredUpdates, context);
            }
          }

          if (client.id !== -1) {
            client.transport.emit(`${UPDATE_RESPONSE}-${this.id}-${remoteId}`, reqId, filteredUpdates, context);
          }

          for (let [peerRemoteId, peer] of this._attachedClients.entries()) {
            // propagate notification to server
            if (remoteId !== peerRemoteId && peer.id === -1) {
              peer.transport.emit(`${UPDATE_NOTIFICATION}-${this.id}-${peerRemoteId}`, filteredUpdates, context);
            }
          }

          if (client.id === -1) {
            client.transport.emit(`${UPDATE_RESPONSE}-${this.id}-${remoteId}`, reqId, filteredUpdates, context);
          }
        } else {
          // propagate back to the requester that the update has been aborted
          // ignore all other attached clients.
          client.transport.emit(`${UPDATE_ABORT}-${this.id}-${remoteId}`, reqId, updates, context);
        }
      } else {
        // retrieve values from inner state (also handle immediate approriately)
        const oldValues = {};

        for (let name in updates) {
          oldValues[name] = this._parameters.get(name);
        }
        // aborted by hook (updates have been overriden to {})
        client.transport.emit(`${UPDATE_ABORT}-${this.id}-${remoteId}`, reqId, oldValues, context);
      }
    });

    if (isOwner) {
      // delete only if creator
      client.transport.addListener(`${DELETE_REQUEST}-${this.id}-${remoteId}`, (reqId) => {
        this._manager._serverStatesById.delete(this.id);
        // --------------------------------------------------------------------
        // WARNING - MAKE SURE WE DON'T HAVE PROBLEM W/ THAT
        // --------------------------------------------------------------------
        // @todo - propagate server-side last, because if a subscription function sends a
        // message to a client, network messages order are kept coherent
        // this._subscriptions.forEach(func => func(updated));
        for (let [remoteId, attached] of this._attachedClients.entries()) {
          this._detachClient(remoteId, attached);

          if (remoteId === this._creatorRemoteId) {
            attached.transport.emit(`${DELETE_RESPONSE}-${this.id}-${remoteId}`, reqId);
          } else {
            attached.transport.emit(`${DELETE_NOTIFICATION}-${this.id}-${remoteId}`);
          }
        }
      });
    } else {
      // detach only if not creator
      client.transport.addListener(`${DETACH_REQUEST}-${this.id}-${remoteId}`, (reqId) => {
        this._detachClient(remoteId, client);
        client.transport.emit(`${DETACH_RESPONSE}-${this.id}-${remoteId}`, reqId);
      });
    }
  }

  _detachClient(remoteId, client) {
    this._attachedClients.delete(remoteId);
    // delete listeners
    client.transport.removeAllListeners(`${UPDATE_REQUEST}-${this.id}-${remoteId}`);
    client.transport.removeAllListeners(`${DELETE_REQUEST}-${this.id}-${remoteId}`);
    client.transport.removeAllListeners(`${DETACH_REQUEST}-${this.id}-${remoteId}`);
  }
}

export default SharedStatePrivate;


