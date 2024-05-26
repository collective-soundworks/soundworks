export { default as ClientContext } from "./ClientContext.js";
export { default as Client } from "./Client.js";
/**
 * Configuration object for a client running in a browser runtime.
 */
export type ClientConfig = {
    /**
     * - Role of the client in the application (e.g. 'player', 'controller').
     */
    role: string;
    /**
     * - Application configration object.
     */
    app?: {
        name?: string;
        author?: string;
    };
    /**
     * - Environment configration object.
     */
    env: {
        useHttps: boolean;
        serverAddress: string;
        port: number;
        subpath?: string;
    };
};
