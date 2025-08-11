/** @private */
export default class PromiseStore {
    constructor(name: any);
    name: any;
    store: Map<any, any>;
    generateId: any;
    createPromise(): {
        id: any;
        promise: any;
    };
    associateResolveData(id: any, associatedData: any): void;
    resolve(id: any, data: any): void;
    reject(id: any, msg: any): void;
    flush(): void;
}
