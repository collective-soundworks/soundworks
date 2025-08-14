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
import {
  kServerStateManagerDeletePrivateState,
  kServerStateManagerGetUpdateHooks,
} from '../server/ServerStateManager.js';

/**
 * Filter update object according to a given white list.
 * Return identity is filter is null
 * @param {object} updates
 * @param {array|null} whiteList
 * @private
 */
function whiteListFilterUpdates(updates, whiteList) {
  if (whiteList === null) {
    return updates;
  }

  return whiteList.reduce((acc, key) => {
    if (key in updates) {
      acc[key] = updates[key];
    }
    return acc;
  }, {});
}

/**
 * Filter update object according to a given black list.
 * Return identity is filter is null
 * @param {object} updates
 * @param {array|null} filter
 * @private
 */
function blackListFilterUpdates(updates, blackList) {
  if (blackList === null) {
    return updates;
  }
  // create a shallow copy so we can have multiple filters applied on same source
  const filtered = Object.assign({}, updates);

  blackList.forEach(key => {
    if (key in updates) {
      delete filtered[key];
    }
  });

  return filtered;
}

export const kSharedStatePrivateAttachClient = Symbol('soundworks:shared-state-private-attach-client');
export const kSharedStatePrivateDetachClient = Symbol('soundworks:shared-state-private-detach-client');
export const kSharedStatePrivateGetValues = Symbol('soundworks:shared-state-private-get-values');

/**
 * The "real" state, this instance is kept private by the server.StateManager.
 * It can only be accessed through a SharedState proxy.
 *
 * @private
 */
class SharedStatePrivate {
  #id = null;
  #className = null;
  #manager = null;
  #parameters = null;
  #creatorId = null;
  #creatorInstanceId = null;
  #attachedClients = new Map();

  constructor(manager, className, classDefinition, id, initValues = {}) {
    this.#manager = manager;
    this.#className = className;
    this.#id = id;
    // This can throw but will be catch in ServerStateManager CREATE_REQUEST handler
    this.#parameters = new ParameterBag(classDefinition, initValues);
  }

  get id() {
    return this.#id;
  }

  get className() {
    return this.#className;
  }

  get creatorId() {
    return this.#creatorId;
  }

  get creatorInstanceId() {
    return this.#creatorInstanceId;
  }

  get attachedClients() {
    return this.#attachedClients;
  }

  get parameters() {
    return this.#parameters;
  }

  [kSharedStatePrivateGetValues]() {
    return this.#parameters.getValues();
  }

  [kSharedStatePrivateAttachClient](instanceId, client, isOwner, filter) {
    const clientInfos = { client, isOwner, filter };
    this.#attachedClients.set(instanceId, clientInfos);

    if (isOwner) {
      this.#creatorId = client.id;
      this.#creatorInstanceId = instanceId;
    }

    // attach client listeners
    client.transport.addListener(`${UPDATE_REQUEST}-${this.id}-${instanceId}`, async (reqId, updates) => {
      // apply registered hooks
      const hooks = this.#manager[kServerStateManagerGetUpdateHooks](this.className);
      const values = this.#parameters.getValues();
      let hookAborted = false;

      // cf. https://github.com/collective-soundworks/soundworks/issues/45
      for (let hook of hooks.values()) {
        const result = await hook(updates, values);

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
        let acknowledgeFilter = [];

        for (let name in updates) {
          const [newValue, changed] = this.#parameters.set(name, updates[name]);
          // if `filterChange` is set to `false` we don't check if the value
          // has been changed or not, it is always propagated to client states
          const { event, filterChange, acknowledge } = this.#parameters.getDescription(name);

          // if event type reset internal value to null
          if (event) {
            this.#parameters.set(name, null);
          }

          if ((filterChange && changed) || !filterChange) {
            acknowledgedUpdates[name] = newValue;

            if (acknowledge === false) {
              acknowledgeFilter.push(name);
            }
          }
        }

        if (Object.keys(acknowledgedUpdates).length > 0) {
          // Normal case
          //
          // We need to handle cases where:
          // - client state (client.id: 2) sends a request
          // - server attached state (client.id: -1) spot a problem and overrides the value
          // We want the remote client (id: 2) to receive in the right order:
          // * 1. the value it requested,
          // * 2. the value overridden by the server-side attached state (id: -1)
          //
          // This problem is now better solved with the the updateHook system,
          // nevertheless we don't want to introduce inconsistencies here
          //
          // Then we propagate server-side last, because as the server transport
          // is synchronous it can break ordering if a subscription function makes
          // itself an update in reaction to an update. Propagating to server last
          // allows to maintain network messages order consistent.
          //
          // @note - instanceId correspond to unique remote state id

          // - Apply acknowledge filter on `acknowledgedUpdates`
          // - We don't need to apply the regular filter on update request, they are blocked client-side
          const requesterFilteredUpdates = blackListFilterUpdates(acknowledgedUpdates, acknowledgeFilter);

          // propagate RESPONSE to the client that originates the request if not the server
          if (client.id !== -1) {
            // propagate only if there something left after applying the acknowledge filter
            if (Object.keys(requesterFilteredUpdates).length > 0) {
              client.transport.emit(
                `${UPDATE_RESPONSE}-${this.id}-${instanceId}`,
                reqId,
                requesterFilteredUpdates,
              );
            };
          }

          // propagate NOTIFICATION to all peer states except on server-side
          for (let [peerInstanceId, clientInfos] of this.#attachedClients) {
            const { client: peer, filter } = clientInfos;

            if (instanceId !== peerInstanceId && peer.id !== -1) {
              const filteredUpdates = whiteListFilterUpdates(acknowledgedUpdates, filter);
              // propagate only if there something left after applying the white list filter
              if (Object.keys(filteredUpdates).length > 0) {
                peer.transport.emit(
                  `${UPDATE_NOTIFICATION}-${this.id}-${peerInstanceId}`,
                  filteredUpdates,
                );
              }
            }
          }

          // propagate RESPONSE to server if it is the requester
          if (client.id === -1) {
            // propagate only if there something left after applying the acknowledge filter
            if (Object.keys(requesterFilteredUpdates).length > 0) {
              client.transport.emit(
                `${UPDATE_RESPONSE}-${this.id}-${instanceId}`,
                reqId,
                requesterFilteredUpdates,
              );
            }
          }

          // propagate NOTIFICATION to all peer states on the server-side
          for (let [peerInstanceId, clientInfos] of this.#attachedClients) {
            const { client: peer, filter } = clientInfos;

            if (instanceId !== peerInstanceId && peer.id === -1) {
              const filteredUpdates = whiteListFilterUpdates(acknowledgedUpdates, filter);
              // propagate only if there something left after applying the white list filter
              if (Object.keys(filteredUpdates).length > 0) {
                peer.transport.emit(
                  `${UPDATE_NOTIFICATION}-${this.id}-${peerInstanceId}`,
                  filteredUpdates,
                );
              }
            }
          }
        } else {
          // propagate back to the requester that the update has been aborted, ignore all peers
          client.transport.emit(`${UPDATE_ABORT}-${this.id}-${instanceId}`, reqId, updates);
        }
      } else {
        // retrieve values from inner state (also handle immediate appropriately)
        const oldValues = {};

        for (let name in updates) {
          oldValues[name] = this.#parameters.get(name);
        }
        // aborted by hook (updates have been overridden to {})
        client.transport.emit(`${UPDATE_ABORT}-${this.id}-${instanceId}`, reqId, oldValues);
      }
    });

    if (isOwner) {
      // delete only if creator
      client.transport.addListener(`${DELETE_REQUEST}-${this.id}-${instanceId}`, async reqId => {
        // make sure hooks have been called when `delete()` fulfills
        await this.#manager[kServerStateManagerDeletePrivateState](this);
        // --------------------------------------------------------------------
        // WARNING - MAKE SURE WE DON'T HAVE PROBLEM W/ THAT
        // --------------------------------------------------------------------
        // @todo - propagate server-side last, because if a subscription function sends a
        // message to a client, network messages order are kept coherent
        // this._subscriptions.forEach(func => func(updated));
        for (let [instanceId, clientInfos] of this.#attachedClients) {
          const attached = clientInfos.client;
          this[kSharedStatePrivateDetachClient](instanceId, attached);

          if (instanceId === this.#creatorInstanceId) {
            attached.transport.emit(`${DELETE_RESPONSE}-${this.id}-${instanceId}`, reqId);
          } else {
            attached.transport.emit(`${DELETE_NOTIFICATION}-${this.id}-${instanceId}`);
          }
        }
      });
    } else {
      // detach only if not creator
      client.transport.addListener(`${DETACH_REQUEST}-${this.id}-${instanceId}`, (reqId) => {
        this[kSharedStatePrivateDetachClient](instanceId, client);
        client.transport.emit(`${DETACH_RESPONSE}-${this.id}-${instanceId}`, reqId);
      });
    }
  }

  [kSharedStatePrivateDetachClient](instanceId, client) {
    this.#attachedClients.delete(instanceId);
    // delete listeners
    client.transport.removeAllListeners(`${UPDATE_REQUEST}-${this.id}-${instanceId}`);
    client.transport.removeAllListeners(`${DELETE_REQUEST}-${this.id}-${instanceId}`);
    client.transport.removeAllListeners(`${DETACH_REQUEST}-${this.id}-${instanceId}`);
  }
}

export default SharedStatePrivate;


