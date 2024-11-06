export { default as Server } from "./Server.js";
export { default as ServerContext } from "./ServerContext.js";
/**
 * The role of the client in the application.
 *
 * For browser client, this infomation is used to create the URL endpoint.
 */
export type ClientRole = string;
export type ClientDescription = {
    /**
     * - Runtime on which the client is aimed at running
     */
    runtime: "browser" | "node";
    /**
     * - For browser client, define is the client should be
     * accessible at the default / root HTTP endpoint
     */
    default?: boolean;
};
/**
 * Configuration object for the server.
 */
export type ServerConfig = {
    /**
     * - Application configuration object.
     */
    app?: object;
    /**
     * <ClientRole, ClientDescription>} app.clients - Definition of the application clients.
     */
    "": object;
    /**
     * - Name of the application.
     */
    name?: string;
    /**
     * - Name of the author.
     */
    author?: string;
    /**
     * - Environment configuration object.
     */
    env?: {
        useHttps: boolean;
        serverAddress: string;
        port: number;
        httpsInfos?: obj;
        subpath?: string;
    };
};
