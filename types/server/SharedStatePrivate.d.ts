export const kSharedStatePrivateAttachClient: unique symbol;
export const kSharedStatePrivateDetachClient: unique symbol;
export const kSharedStatePrivateGetValues: unique symbol;
export default SharedStatePrivate;
/**
 * The "real" state, this instance is kept private by the server.StateManager.
 * It can only be accessed through a SharedState proxy.
 *
 * @private
 */
declare class SharedStatePrivate {
    constructor(manager: any, className: any, classDefinition: any, id: any, initValues?: {});
    get id(): any;
    get className(): any;
    get creatorId(): any;
    get creatorInstanceId(): any;
    get attachedClients(): Map<any, any>;
    get parameters(): any;
    [kSharedStatePrivateGetValues](): any;
    [kSharedStatePrivateAttachClient](instanceId: any, client: any, isOwner: any, filter: any): void;
    [kSharedStatePrivateDetachClient](instanceId: any, client: any): void;
    #private;
}
