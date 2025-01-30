export { default as Client } from "./Client.js";
export { default as ClientPlugin } from "./ClientPlugin.js";
export { default as ClientContext } from "./ClientContext.js";
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
export type ClientEnvConfig = objecy;
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
