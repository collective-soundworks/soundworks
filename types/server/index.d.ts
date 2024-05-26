export { default as Server } from "./Server.js";
export { default as ServerContext } from "./ServerContext.js";
/**
 * Configuration object for the server.
 */
export type ServerConfig = {
    /**
     * - Application configration object.
     */
    app?: {
        clients: object;
        name?: string;
        author?: string;
    };
    /**
     * - Environment configration object.
     */
    env?: {
        useHttps: boolean;
        serverAddress: string;
        port: number;
        httpsInfos?: obj;
        subpath?: string;
    };
};
