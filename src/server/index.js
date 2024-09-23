/**
 * @license
 * Copyright (c) 2014-present IRCAM – Centre Pompidou (France, Paris)
 * SPDX-License-Identifier: BSD-3-Clause
 */

// this must be defined here so that we can import it into the application
/**
 * Configuration object for the server.
 *
 * @typedef ServerConfig
 * @type {object}
 * @property {object} [app] - Application configuration object.
 * @property {object} app.clients - Definition of the application clients.
 * @property {string} [app.name=''] - Name of the application.
 * @property {string} [app.author=''] - Name of the author.
 * @property {object} [env] - Environment configuration object.
 * @property {boolean} env.useHttps - Define is the server run in http or in https.
 * @property {string} env.serverAddress - Domain name or IP of the server.
 *  Mandatory when node clients are declared
 * @property {number} env.port - Port on which the server is listening.
 * @property {obj} [env.httpsInfos=null] - Path to cert files ( cert, key } for https.
 *  If not given and useHttps is true self certifified certificates will be created.
 * @property {string} [env.subpath=''] - If running behind a proxy, path to the application.
 */

export { default as Server } from './Server.js';
export { default as ServerContext } from './ServerContext.js';
