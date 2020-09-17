import parameters from '@ircam/parameters';
import clonedeep from 'lodash.clonedeep';
import {
  // constants
  SERVER_ID,
  CREATE_REQUEST,
  CREATE_RESPONSE,
  CREATE_ERROR,
  DELETE_REQUEST,
  DELETE_RESPONSE,
  DELETE_ERROR,
  DELETE_NOTIFICATION,
  ATTACH_REQUEST,
  ATTACH_RESPONSE,
  ATTACH_ERROR,
  DETACH_REQUEST,
  DETACH_RESPONSE,
  DETACH_ERROR,
  OBSERVE_REQUEST,
  OBSERVE_RESPONSE,
  OBSERVE_NOTIFICATION,
  UPDATE_REQUEST,
  UPDATE_RESPONSE,
  UPDATE_ABORT,
  UPDATE_NOTIFICATION,
} from './shared-state-utils';

/**
 * The "real" state, this instance is kept private by the SharedStateServerManager.
 * It cannot be accessed without a SharedState proxy
 * @private
 */
class SharedStatePrivate {
  constructor(id, schemaName, schema, manager, initValues = {}) {
    this.id = id;
    this.schemaName = schemaName;

    this._schema = clonedeep(schema);
    this._manager = manager;
    this._parameters = parameters(schema, initValues);
    this._attachedClients = new Map(); // other peers interested in watching / controlling the state

    this._creatorRemoteId = null;
    this._creatorId = null;
  }

  _attachClient(remoteId, client, isCreator = false) {
    this._attachedClients.set(remoteId, client);

    if (isCreator) {
      this._creatorRemoteId = remoteId;
      this._creatorId = client.id;
    }

    // attach client listeners
    client.transport.addListener(`${UPDATE_REQUEST}-${this.id}-${remoteId}`, (reqId, updates) => {
      const updated = {};
      let dirty = false;

      for (let name in updates) {
        const currentValue = this._parameters.get(name);
        // get new value this way to store events return values
        const newValue = this._parameters.set(name, updates[name]);

        // we check the `schema[name].type === 'any'`, to always consider
        // objects as dirty, because if the state is attached locally, we
        // compare the Object instances instead of their values.
        // @todo - this should be made more robust but how?
        if (newValue !== currentValue || this._schema[name].type === 'any') {
          updated[name] = newValue;
          dirty = true;
        }
      }

      if (dirty) {
        // send response to requester
        // client.transport.emit(`${UPDATE_RESPONSE}-${this.id}-${remoteId}`, reqId, updated);

        // @note: we propagate server-side last, because as the server transport
        // is synchronous it can break ordering if a subscription function makes
        // itself an update in reaction to an update, therefore network messages
        // order would be broken,
        for (let [peerRemoteId, peer] of this._attachedClients.entries()) {
          // propagate notification to all other attached clients except server
          if (remoteId !== peerRemoteId && peer.id !== -1) {
            peer.transport.emit(`${UPDATE_NOTIFICATION}-${this.id}-${peerRemoteId}`, updated);
          }
        }

        // handle case where:
        // client state (client.id: 2) sends a request
        // server attached state (client.id: -1) spot a problem and overrides the value
        // we want the remote client (id: 2) to receive in the right order:
        // * 1. the value it requested,
        // * 2. the value overriden by the server-side attached state (id: -1)
        if (client.id !== -1) {
          client.transport.emit(`${UPDATE_RESPONSE}-${this.id}-${remoteId}`, reqId, updated);
        }

        for (let [peerRemoteId, peer] of this._attachedClients.entries()) {
          // propagate notification to server
          if (remoteId !== peerRemoteId && peer.id === -1) {
            peer.transport.emit(`${UPDATE_NOTIFICATION}-${this.id}-${peerRemoteId}`, updated);
          }
        }

        if (client.id === -1) {
          client.transport.emit(`${UPDATE_RESPONSE}-${this.id}-${remoteId}`, reqId, updated);
        }
      } else {
        // propagate back to the requester that the update has been aborted
        // ignore all other attached clients.
        client.transport.emit(`${UPDATE_ABORT}-${this.id}-${remoteId}`, reqId, updates);
      }
    });

    if (isCreator) {
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
