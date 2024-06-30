/**
 * @license
 * Copyright (c) 2014-present IRCAM – Centre Pompidou (France, Paris)
 * SPDX-License-Identifier: BSD-3-Clause
 */

// this must be defined here so that we can import it into the application
/**
 * Configuration object for a client running in a browser runtime.
 *
 * @typedef ClientConfig
 * @type {object}
 * @property {string} role - Role of the client in the application (e.g. 'player', 'controller').
 * @property {object} [app] - Application configuration object.
 * @property {string} [app.name=''] - Name of the application.
 * @property {string} [app.author=''] - Name of the author.
 * @property {object} env - Environment configuration object.
 * @property {boolean} env.useHttps - Define if the websocket should use secure connection.
 * @property {string} env.serverAddress - Address the socket server. Mandatory for
 *  node clients. For browser clients, use `window.location.domain` as fallback if empty.
 * @property {number} env.port=8000 - Port of the socket server.
 * @property {string} [env.subpath=''] - If running behind a proxy, path to the application.
 */

export { default as Client } from './Client.js';
export { default as ClientContext } from './ClientContext.js';
