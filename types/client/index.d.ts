export { default as Client } from "./Client.js";
export { default as ClientContext } from "./ClientContext.js";
/**
 * Configuration object for a client running in a browser runtime.
 */
export type ClientConfig = {
    /**
     * - Role of the client in the application (e.g. 'player', 'controller').
     */
    role: string;
    /**
     * - Application configuration object.
     */
    app?: {
        name?: string;
        author?: string;
    };
    /**
     * - Environment configuration object.
     */
    env: {
        useHttps: boolean;
        serverAddress: string;
        port: number;
        subpath?: string;
    };
};
