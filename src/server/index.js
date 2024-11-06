/**
 * @license
 * Copyright (c) 2014-present IRCAM – Centre Pompidou (France, Paris)
 * SPDX-License-Identifier: BSD-3-Clause
 */

// these types must be defined here, so that they can be imported into the application

/**
 * The role of the client in the application.
 *
 * For browser client, this infomation is used to create the URL endpoint.
 *
 * @typedef ClientRole
 * @type {string}
 */
/**
 * @typedef ClientDescription
 * @type {object}
 * @property {'browser'|'node'} runtime - Runtime on which the client is aimed at running
 * @property {boolean} [default=false] - For browser client, define is the client should be
 *   accessible at the default / root HTTP endpoint
 */
/**
 * Configuration object for the server.
 *
 * @typedef ServerConfig
 * @type {object}
 * @property {object} [app] - Application configuration object.
 * @property {object<ClientRole, ClientDescription>} app.clients - Definition of the application clients.
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
