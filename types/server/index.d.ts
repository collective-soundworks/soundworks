export { default as Server } from "./Server.js";
export { default as ServerPlugin } from "./ServerPlugin.js";
export { default as ServerContext } from "./ServerContext.js";
export { default as version } from "../common/version.js";
/**
 * The role of the client in the application.
 *
 * For browser client, this information is used to create the URL endpoint.
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
 * Application configuration object.
 */
export type ServerAppConfig = {
    /**
     * <ClientRole, ClientDescription>} clients - Definition of the application clients.
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
};
/**
 * Environment configuration object.
 */
export type ServerEnvConfig = objecy;
/**
 * Configuration object for the server.
 */
export type ServerConfig = {
    /**
     * - Application configuration object.
     */
    app: AppConfig;
    /**
     * - Environment configuration object.
     */
    env: ServerEnvConfig;
};
//# sourceMappingURL=index.d.ts.map