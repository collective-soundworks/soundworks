/**
 * Server-side part of the *soundworks* framework.
 *
 * @namespace server
 *
 * @example
 * import soundworks from '@soundworks/core/server';
 *
 * const server = new soundworks.Server();
 *
 * server.registerService('delay-1', delayServiceFactory, { delayTime: 1 }, []);
 * server.registerService('delay-2', delayServiceFactory, { delayTime: 2 }, ['delay-1']);
 *
 * await server.init(envConfig, (clientType, config, httpRequest) => {
 *   return { ...clientConfig };
 * });
 *
 * // serve static files
 * await server.router.use(serveStatic('public'));
 * await server.router.use('build', serveStatic('.build/public'));
 *
 * const playerExperience = new PlayerExperience(server, 'player');
 *
 * await server.start();
 * playerExperience.start();
 *
 */
import _Server from './Server.js';
import _AbstractExperience from './AbstractExperience.js';

export const AbstractExperience = _AbstractExperience;
export const Server = _Server;

export default {
  AbstractExperience: _AbstractExperience,
  Server: _Server,
};
