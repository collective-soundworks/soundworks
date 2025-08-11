export { default as Client } from "./Client.js";
export { default as ClientPlugin } from "./ClientPlugin.js";
export { default as ClientContext } from "./ClientContext.js";
export { default as version } from "../common/version.js";
/**
 * Application configuration object.
 */
export type ClientAppConfig = {
    /**
     * - Name of the application.
     */
    name?: string;
    /**
     * - Name of the author.
     */
    author?: string;
};
/**
 * Environment configuration object.
 */
export type ClientEnvConfig = {
    /**
     * - Port on which the server is listening.
     */
    port: number;
    /**
     * - Domain name or IP of the server.
     * Mandatory when node clients are declared
     */
    serverAddress: string;
    /**
     * - Define is the server run in http or in https.
     */
    useHttps: boolean;
    /**
     * - If running behind a proxy, base URL of the application.
     */
    baseUrl?: string;
};
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
    app: ClientAppConfig;
    /**
     * - Environment configuration object.
     */
    env: ClientEnvConfig;
};
