/** @private */
export default class PromiseStore {
    constructor(name: any);
    name: any;
    store: Map<any, any>;
    generateRequestId: any;
    add(resolve: any, reject: any, type: any, localParams: any): any;
    resolve(reqId: any, data: any): void;
    reject(reqId: any, msg: any): void;
    flush(): void;
}
