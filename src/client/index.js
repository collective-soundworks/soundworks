/**
 * Client-side entry point of the *soundworks* framework.
 *
 * @module soundworks/client
 * @example
 * import * as soundworks from 'soundworks/client';
 */

// export * as audio from 'waves-audio';
import * as _audio from 'waves-audio';
export const audio = _audio;
export { audioContext } from 'waves-audio';

// core
export { default as client } from './core/client';
export { default as Process } from './core/Process';
export { default as Service } from './core/Service';
export { default as serviceManager } from './core/serviceManager';
export { default as Signal } from './core/Signal';
export { default as SignalAll } from './core/SignalAll';

// scenes
export { default as Experience } from './scenes/Experience';
export { default as Survey } from './scenes/Survey';

// services
export { default as Checkin } from './services/Checkin';
export { default as ErrorReporter } from './services/ErrorReporter';
export { default as Locator } from './services/Locator';
export { default as Network } from './services/Network';
export { default as Placer } from './services/Placer';
export { default as Platform } from './services/Platform';
export { default as SharedConfig } from './services/SharedConfig';
export { default as SharedParams } from './services/SharedParams';
export { default as Sync } from './services/Sync';
export { default as Loader } from './services/Loader';
export { default as MotionInput } from './services/MotionInput';
export { default as Scheduler } from './services/Scheduler';
export { default as Welcome } from './services/Welcome';

// config
export { default as defaultViewTemplates } from './config/defaultViewTemplates';
export { default as defaultViewContent } from './config/defaultViewContent';
// views
export { default as ButtonView } from './views/ButtonView';
export { default as CanvasView } from './views/CanvasView';
export { default as Renderer } from './views/Renderer';
export { default as RenderingGroup } from './views/RenderingGroup';
export { default as SegmentedView } from './views/SegmentedView';
export { default as SelectView } from './views/SelectView';
export { default as SpaceView } from './views/SpaceView';
export { default as SquaredView } from './views/SquaredView';
export { default as TouchSurface } from './views/TouchSurface';
export { default as View } from './views/View';
export { default as viewport } from './views/viewport';
