/**
 * Client-side entry point of the *soundworks* framework.
 *
 * @module soundworks/client
 * @example
 * import * as soundworks from 'soundworks/client';
 */

console.warn('[warning] this feature is experimental and subject to heavy changes');
// version (cf. bin/javascripts)
export const version = '%version%';

// core
export { default as Activity } from './core/Activity';
export { default as client } from './core/client';
export { default as Experience } from '../../client/core/Experience';  // from client
export { default as Process } from '../../client/core/Process';  // from client
export { default as Service } from '../../client/core/Service';  // from client
export { default as serviceManager } from '../../client/core/serviceManager';  // from client

// services
export { default as Checkin } from './services/Checkin';
export { default as ErrorReporter } from './services/ErrorReporter';
export { default as SharedParams } from '../../client/services/SharedParams'; // from client
export { default as Sync } from './services/Sync';
// export { default as SyncScheduler } from './services/SyncScheduler';

