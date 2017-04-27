/**
 * Server-side entry point of the *soundworks* framework.
 *
 * @module soundworks/server
 * @example
 * import * as soundworks from 'soundworks/server';
 */

export const version = '%version%';

/* core */
export { default as Client } from './core/Client';
export { default as Activity } from './core/Activity';
export { default as Experience } from './core/Experience';
export { default as server } from './core/server';
export { default as Service } from './core/Service';

/* services */
export { default as AudioBufferManager } from './services/AudioBufferManager';
export { default as Auth } from './services/Auth';
export { default as Osc } from './services/Osc';
export { default as Checkin } from './services/Checkin';
export { default as ErrorReporter } from './services/ErrorReporter';
export { default as FileSystem } from './services/FileSystem';
export { default as Geolocation } from './services/Geolocation';
export { default as Locator } from './services/Locator';
export { default as MetricScheduler } from './services/MetricScheduler';
export { default as Network } from './services/Network';
export { default as Placer } from './services/Placer';
export { default as RawSocket } from './services/RawSocket';
export { default as SharedConfig } from './services/SharedConfig';
export { default as SharedParams } from './services/SharedParams';
export { default as SharedRecorder } from './services/SharedRecorder';
export { default as Sync } from './services/Sync';
export { default as SyncScheduler } from './services/SyncScheduler';

/* prefabs */
export { default as ControllerExperience } from './prefabs/ControllerExperience';
