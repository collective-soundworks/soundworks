export const kSharedStatePrivateAttachClient: unique symbol;
export const kSharedStatePrivateDetachClient: unique symbol;
export default SharedStatePrivate;
/**
 * The "real" state, this instance is kept private by the server.StateManager.
 * It can only be accessed through a SharedState proxy.
 *
 * @private
 */
declare class SharedStatePrivate {
    constructor(id: any, className: any, classDefinition: any, manager: any, initValues?: {});
    get id(): any;
    get className(): any;
    get creatorId(): any;
    get creatorRemoteId(): any;
    get attachedClients(): Map<any, any>;
    get parameters(): any;
    [kSharedStatePrivateAttachClient](remoteId: any, client: any, isOwner: any, filter: any): void;
    [kSharedStatePrivateDetachClient](remoteId: any, client: any): void;
    #private;
}
