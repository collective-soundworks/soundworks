/**
 * @license
 * Copyright (c) 2014-present IRCAM – Centre Pompidou (France, Paris)
 * SPDX-License-Identifier: BSD-3-Clause
 */

// these types must be defined here, so that they can be imported into the application

/**
 * Application configuration object.
 *
 * @typedef ClientAppConfig
 * @type {object}
 * @property {string} [name=''] - Name of the application.
 * @property {string} [author=''] - Name of the author.
 */
/**
 * Environement configuration object.
 *
 * @typedef ClientEnvConfig
 * @type {objecy}
 * @property {number} env.port - Port on which the server is listening.
 * @property {string} env.serverAddress - Domain name or IP of the server.
 *  Mandatory when node clients are declared
 * @property {boolean} env.useHttps - Define is the server run in http or in https.
 * @property {string} [env.baseUrl=''] - If running behind a proxy, base URL of the application.
 */
/**
 * Configuration object for a client running in a browser runtime.
 *
 * @typedef ClientConfig
 * @type {object}
 * @property {string} role - Role of the client in the application (e.g. 'player', 'controller').
 * @property {ClientAppConfig} app - Application configuration object.
 * @property {ClientEnvConfig} env - Environment configuration object.
 */

export { default as Client } from './Client.js';
export { default as ClientContext } from './ClientContext.js';
