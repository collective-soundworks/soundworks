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
 * Filter update object according to filter list.
 * Return identity is filter is null
 * @param {object} updates
 * @param {array|null} filter
 */
function filterUpdates(updates, filter) {
  if (filter === null) {
    return updates;
  }

  return filter.reduce((acc, key) => {
    if (key in updates) {
      acc[key] = updates[key];
    }
    return acc;
  }, {});
}

/**
 * The "real" state, this instance is kept private by the server.StateManager.
 * It can only be accessed through a SharedState proxy.
 *
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

  _attachClient(remoteId, client, isOwner, filter) {
    const clientInfos = { client, isOwner, filter };
    this._attachedClients.set(remoteId, clientInfos);

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
        let acknowledgedUpdates = {};
        let hasUpdates = false;

        for (let name in updates) {
          const [newValue, changed] = this._parameters.set(name, updates[name]);
          // if `filterChange` is set to `false` we don't check if the value
          // has been changed or not, it is always propagated to client states
          const { event, filterChange } = this._parameters.getSchema(name);

          // if event type reset internal value to null
          if (event) {
            this._parameters.set(name, null);
          }

          if ((filterChange && changed) || !filterChange) {
            acknowledgedUpdates[name] = newValue;
            hasUpdates = true;
          }
        }

        if (hasUpdates) {
          // Normal case
          //
          // We need to handle cases where:
          // - client state (client.id: 2) sends a request
          // - server attached state (client.id: -1) spot a problem and overrides the value
          // We want the remote client (id: 2) to receive in the right order:
          // * 1. the value it requested,
          // * 2. the value overriden by the server-side attached state (id: -1)
          //
          // such problem is now better solved with the the upateHook system, none
          // nonetheway we don't want to introduce inconsistencies here
          //
          // Then we propagate server-side last, because as the server transport
          // is synchronous it can break ordering if a subscription function makes
          // itself an update in reaction to an update. Propagating to server last
          // alllows to maintain network messages order consistent.
          //
          // @note - remoteId correspond to unique remote state id

          // propagate RESPONSE to the client that originates the request if not the server
          if (client.id !== -1) {
            // no need to filter updates on requested, is blocked on client-side
            client.transport.emit(
              `${UPDATE_RESPONSE}-${this.id}-${remoteId}`,
              reqId, acknowledgedUpdates, context,
            );
          }

          // propagate NOTIFICATION to all attached clients except server
          for (let [peerRemoteId, clientInfos] of this._attachedClients) {
            const peer = clientInfos.client;

            if (remoteId !== peerRemoteId && peer.id !== -1) {
              const filter = clientInfos.filter;
              const filteredUpdates = filterUpdates(acknowledgedUpdates, filter);

              // propagate only if there something left after applying the filter
              if (Object.keys(filteredUpdates).length > 0) {
                peer.transport.emit(
                  `${UPDATE_NOTIFICATION}-${this.id}-${peerRemoteId}`,
                  filteredUpdates, context,
                );
              }
            }
          }

          // propagate RESPONSE to server if it is the requester
          if (client.id === -1) {
            // no need to filter updates on requested, is blocked on client-side
            client.transport.emit(
              `${UPDATE_RESPONSE}-${this.id}-${remoteId}`,
              reqId, acknowledgedUpdates, context,
            );
          }

          // propagate NOTIFICATION to other state attached on the server
          for (let [peerRemoteId, clientInfos] of this._attachedClients) {
            const peer = clientInfos.client;

            if (remoteId !== peerRemoteId && peer.id === -1) {
              const filter = clientInfos.filter;
              const filteredUpdates = filterUpdates(acknowledgedUpdates, filter);

              if (Object.keys(filteredUpdates).length > 0) {
                peer.transport.emit(
                  `${UPDATE_NOTIFICATION}-${this.id}-${peerRemoteId}`,
                  filteredUpdates, context,
                );
              }
            }
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
        this._manager._sharedStatePrivateById.delete(this.id);
        // --------------------------------------------------------------------
        // WARNING - MAKE SURE WE DON'T HAVE PROBLEM W/ THAT
        // --------------------------------------------------------------------
        // @todo - propagate server-side last, because if a subscription function sends a
        // message to a client, network messages order are kept coherent
        // this._subscriptions.forEach(func => func(updated));
        for (let [remoteId, clientInfos] of this._attachedClients) {
          const attached = clientInfos.client;
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


