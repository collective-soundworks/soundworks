export default SharedStatePrivate;
/**
 * The "real" state, this instance is kept private by the server.StateManager.
 * It cannot be accessed without a SharedState proxy
 * @private
 */
declare class SharedStatePrivate {
    constructor(id: any, schemaName: any, schema: any, manager: any, initValues?: {});
    id: any;
    schemaName: any;
    _manager: any;
    _parameters: ParameterBag;
    _attachedClients: Map<any, any>;
    _creatorRemoteId: any;
    _creatorId: any;
    _attachClient(remoteId: any, client: any, isOwner?: boolean): void;
    _detachClient(remoteId: any, client: any): void;
}
import ParameterBag from "../common/ParameterBag.js";
//# sourceMappingURL=SharedStatePrivate.d.ts.map