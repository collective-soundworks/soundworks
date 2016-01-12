'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _wavesAudio = require('waves-audio');

var _wavesAudio2 = _interopRequireDefault(_wavesAudio);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _ClientModule = require('./ClientModule');

var _ClientModule2 = _interopRequireDefault(_ClientModule);

var _ClientCalibration = require('./ClientCalibration');

var _ClientCalibration2 = _interopRequireDefault(_ClientCalibration);

var _ClientCheckin = require('./ClientCheckin');

var _ClientCheckin2 = _interopRequireDefault(_ClientCheckin);

var _ClientControl = require('./ClientControl');

var _ClientControl2 = _interopRequireDefault(_ClientControl);

var _ClientFileList = require('./ClientFileList');

var _ClientFileList2 = _interopRequireDefault(_ClientFileList);

var _ClientLocator = require('./ClientLocator');

var _ClientLocator2 = _interopRequireDefault(_ClientLocator);

var _ClientPerformance = require('./ClientPerformance');

var _ClientPerformance2 = _interopRequireDefault(_ClientPerformance);

var _ClientPlacer = require('./ClientPlacer');

var _ClientPlacer2 = _interopRequireDefault(_ClientPlacer);

var _ClientSurvey = require('./ClientSurvey');

var _ClientSurvey2 = _interopRequireDefault(_ClientSurvey);

var _ClientSync = require('./ClientSync');

var _ClientSync2 = _interopRequireDefault(_ClientSync);

var _Loader = require('./Loader');

var _Loader2 = _interopRequireDefault(_Loader);

var _motionInput = require('motion-input');

var _motionInput2 = _interopRequireDefault(_motionInput);

var _Orientation = require('./Orientation');

var _Orientation2 = _interopRequireDefault(_Orientation);

var _Welcome = require('./Welcome');

var _Welcome2 = _interopRequireDefault(_Welcome);

// views

var _displayView = require('./display/View');

var _displayView2 = _interopRequireDefault(_displayView);

var _displayButtonView = require('./display/ButtonView');

var _displayButtonView2 = _interopRequireDefault(_displayButtonView);

var _displayCanvasView = require('./display/CanvasView');

var _displayCanvasView2 = _interopRequireDefault(_displayCanvasView);

var _displaySegmentedView = require('./display/SegmentedView');

var _displaySegmentedView2 = _interopRequireDefault(_displaySegmentedView);

var _displaySelectView = require('./display/SelectView');

var _displaySelectView2 = _interopRequireDefault(_displaySelectView);

var _displaySpaceView = require('./display/SpaceView');

var _displaySpaceView2 = _interopRequireDefault(_displaySpaceView);

var _displaySquaredView = require('./display/SquaredView');

var _displaySquaredView2 = _interopRequireDefault(_displaySquaredView);

var _displayTouchSurface = require('./display/TouchSurface');

var _displayTouchSurface2 = _interopRequireDefault(_displayTouchSurface);

var _displayDefaultTemplates = require('./display/defaultTemplates');

var _displayDefaultTemplates2 = _interopRequireDefault(_displayDefaultTemplates);

var _displayDefaultTextContents = require('./display/defaultTextContents');

var _displayDefaultTextContents2 = _interopRequireDefault(_displayDefaultTextContents);

// drawing

var _displayRenderer = require('./display/Renderer');

var _displayRenderer2 = _interopRequireDefault(_displayRenderer);

var _displayRenderingGroup = require('./display/RenderingGroup');

var _displayRenderingGroup2 = _interopRequireDefault(_displayRenderingGroup);

// utils

var _utilsHelpers = require('../utils/helpers');

var helpers = _interopRequireWildcard(_utilsHelpers);

var _utilsMath = require('../utils/math');

var math = _interopRequireWildcard(_utilsMath);

var _utilsSetup = require('../utils/setup');

var setup = _interopRequireWildcard(_utilsSetup);

exports['default'] = {
  audio: _wavesAudio2['default'],
  audioContext: _wavesAudio2['default'].audioContext,
  client: _client2['default'],
  input: _input2['default'],
  ClientCalibration: _ClientCalibration2['default'],
  ClientCheckin: _ClientCheckin2['default'],
  ClientControl: _ClientControl2['default'],
  ClientFileList: _ClientFileList2['default'],
  ClientModule: _ClientModule2['default'],
  ClientLocator: _ClientLocator2['default'],
  ClientPerformance: _ClientPerformance2['default'],
  ClientPlacer: _ClientPlacer2['default'],
  ClientSurvey: _ClientSurvey2['default'],
  ClientSync: _ClientSync2['default'],
  Loader: _Loader2['default'],
  motionInput: _motionInput2['default'],
  Orientation: _Orientation2['default'],
  Welcome: _Welcome2['default'],
  display: {
    View: _displayView2['default'],
    ButtonView: _displayButtonView2['default'],
    CanvasView: _displayCanvasView2['default'],
    SegmentedView: _displaySegmentedView2['default'],
    SelectView: _displaySelectView2['default'],
    SpaceView: _displaySpaceView2['default'],
    SquaredView: _displaySquaredView2['default'],
    TouchSurface: _displayTouchSurface2['default'],
    defaultTemplates: _displayDefaultTemplates2['default'],
    defaultTextContents: _displayDefaultTextContents2['default'],
    Renderer: _displayRenderer2['default'],
    RenderingGroup: _displayRenderingGroup2['default']
  },
  utils: {
    helpers: helpers,
    math: math,
    setup: setup
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzswQkFBa0IsYUFBYTs7OztzQkFDWixVQUFVOzs7O3FCQUNYLFNBQVM7Ozs7NEJBRUYsZ0JBQWdCOzs7O2lDQUNYLHFCQUFxQjs7Ozs2QkFDekIsaUJBQWlCOzs7OzZCQUNqQixpQkFBaUI7Ozs7OEJBQ2hCLGtCQUFrQjs7Ozs2QkFDbkIsaUJBQWlCOzs7O2lDQUNiLHFCQUFxQjs7Ozs0QkFDMUIsZ0JBQWdCOzs7OzRCQUNoQixnQkFBZ0I7Ozs7MEJBQ2xCLGNBQWM7Ozs7c0JBRWxCLFVBQVU7Ozs7MkJBQ0wsY0FBYzs7OzsyQkFDZCxlQUFlOzs7O3VCQUNuQixXQUFXOzs7Ozs7MkJBSWQsZ0JBQWdCOzs7O2lDQUNWLHNCQUFzQjs7OztpQ0FDdEIsc0JBQXNCOzs7O29DQUNuQix5QkFBeUI7Ozs7aUNBQzVCLHNCQUFzQjs7OztnQ0FDdkIscUJBQXFCOzs7O2tDQUNuQix1QkFBdUI7Ozs7bUNBQ3RCLHdCQUF3Qjs7Ozt1Q0FDcEIsNEJBQTRCOzs7OzBDQUN6QiwrQkFBK0I7Ozs7OzsrQkFHMUMsb0JBQW9COzs7O3FDQUNkLDBCQUEwQjs7Ozs7OzRCQUc1QixrQkFBa0I7O0lBQS9CLE9BQU87O3lCQUNHLGVBQWU7O0lBQXpCLElBQUk7OzBCQUNPLGdCQUFnQjs7SUFBM0IsS0FBSzs7cUJBRUY7QUFDYixPQUFLLHlCQUFBO0FBQ0wsY0FBWSxFQUFFLHdCQUFNLFlBQVk7QUFDaEMsUUFBTSxxQkFBQTtBQUNOLE9BQUssb0JBQUE7QUFDTCxtQkFBaUIsZ0NBQUE7QUFDakIsZUFBYSw0QkFBQTtBQUNiLGVBQWEsNEJBQUE7QUFDYixnQkFBYyw2QkFBQTtBQUNkLGNBQVksMkJBQUE7QUFDWixlQUFhLDRCQUFBO0FBQ2IsbUJBQWlCLGdDQUFBO0FBQ2pCLGNBQVksMkJBQUE7QUFDWixjQUFZLDJCQUFBO0FBQ1osWUFBVSx5QkFBQTtBQUNWLFFBQU0scUJBQUE7QUFDTixhQUFXLDBCQUFBO0FBQ1gsYUFBVywwQkFBQTtBQUNYLFNBQU8sc0JBQUE7QUFDUCxTQUFPLEVBQUU7QUFDUCxRQUFJLDBCQUFBO0FBQ0osY0FBVSxnQ0FBQTtBQUNWLGNBQVUsZ0NBQUE7QUFDVixpQkFBYSxtQ0FBQTtBQUNiLGNBQVUsZ0NBQUE7QUFDVixhQUFTLCtCQUFBO0FBQ1QsZUFBVyxpQ0FBQTtBQUNYLGdCQUFZLGtDQUFBO0FBQ1osb0JBQWdCLHNDQUFBO0FBQ2hCLHVCQUFtQix5Q0FBQTtBQUNuQixZQUFRLDhCQUFBO0FBQ1Isa0JBQWMsb0NBQUE7R0FDZjtBQUNELE9BQUssRUFBRTtBQUNMLFdBQU8sRUFBUCxPQUFPO0FBQ1AsUUFBSSxFQUFKLElBQUk7QUFDSixTQUFLLEVBQUwsS0FBSztHQUNOO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhdWRpbyBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBpbnB1dCBmcm9tICcuL2lucHV0JztcblxuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgQ2xpZW50Q2FsaWJyYXRpb24gZnJvbSAnLi9DbGllbnRDYWxpYnJhdGlvbic7XG5pbXBvcnQgQ2xpZW50Q2hlY2tpbiBmcm9tICcuL0NsaWVudENoZWNraW4nO1xuaW1wb3J0IENsaWVudENvbnRyb2wgZnJvbSAnLi9DbGllbnRDb250cm9sJztcbmltcG9ydCBDbGllbnRGaWxlTGlzdCBmcm9tICcuL0NsaWVudEZpbGVMaXN0JztcbmltcG9ydCBDbGllbnRMb2NhdG9yIGZyb20gJy4vQ2xpZW50TG9jYXRvcic7XG5pbXBvcnQgQ2xpZW50UGVyZm9ybWFuY2UgZnJvbSAnLi9DbGllbnRQZXJmb3JtYW5jZSc7XG5pbXBvcnQgQ2xpZW50UGxhY2VyIGZyb20gJy4vQ2xpZW50UGxhY2VyJztcbmltcG9ydCBDbGllbnRTdXJ2ZXkgZnJvbSAnLi9DbGllbnRTdXJ2ZXknO1xuaW1wb3J0IENsaWVudFN5bmMgZnJvbSAnLi9DbGllbnRTeW5jJztcblxuaW1wb3J0IExvYWRlciBmcm9tICcuL0xvYWRlcic7XG5pbXBvcnQgbW90aW9uSW5wdXQgZnJvbSAnbW90aW9uLWlucHV0JztcbmltcG9ydCBPcmllbnRhdGlvbiBmcm9tICcuL09yaWVudGF0aW9uJztcbmltcG9ydCBXZWxjb21lIGZyb20gJy4vV2VsY29tZSc7XG5cblxuLy8gdmlld3NcbmltcG9ydCBWaWV3IGZyb20gJy4vZGlzcGxheS9WaWV3JztcbmltcG9ydCBCdXR0b25WaWV3IGZyb20gJy4vZGlzcGxheS9CdXR0b25WaWV3JztcbmltcG9ydCBDYW52YXNWaWV3IGZyb20gJy4vZGlzcGxheS9DYW52YXNWaWV3JztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZWxlY3RWaWV3IGZyb20gJy4vZGlzcGxheS9TZWxlY3RWaWV3JztcbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi9kaXNwbGF5L1NwYWNlVmlldyc7XG5pbXBvcnQgU3F1YXJlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NxdWFyZWRWaWV3JztcbmltcG9ydCBUb3VjaFN1cmZhY2UgZnJvbSAnLi9kaXNwbGF5L1RvdWNoU3VyZmFjZSc7XG5pbXBvcnQgZGVmYXVsdFRlbXBsYXRlcyBmcm9tICcuL2Rpc3BsYXkvZGVmYXVsdFRlbXBsYXRlcyc7XG5pbXBvcnQgZGVmYXVsdFRleHRDb250ZW50cyBmcm9tICcuL2Rpc3BsYXkvZGVmYXVsdFRleHRDb250ZW50cyc7XG5cbi8vIGRyYXdpbmdcbmltcG9ydCBSZW5kZXJlciBmcm9tICcuL2Rpc3BsYXkvUmVuZGVyZXInO1xuaW1wb3J0IFJlbmRlcmluZ0dyb3VwIGZyb20gJy4vZGlzcGxheS9SZW5kZXJpbmdHcm91cCc7XG5cbi8vIHV0aWxzXG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4uL3V0aWxzL2hlbHBlcnMnO1xuaW1wb3J0ICogYXMgbWF0aCBmcm9tICcuLi91dGlscy9tYXRoJztcbmltcG9ydCAqIGFzIHNldHVwIGZyb20gJy4uL3V0aWxzL3NldHVwJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhdWRpbyxcbiAgYXVkaW9Db250ZXh0OiBhdWRpby5hdWRpb0NvbnRleHQsXG4gIGNsaWVudCxcbiAgaW5wdXQsXG4gIENsaWVudENhbGlicmF0aW9uLFxuICBDbGllbnRDaGVja2luLFxuICBDbGllbnRDb250cm9sLFxuICBDbGllbnRGaWxlTGlzdCxcbiAgQ2xpZW50TW9kdWxlLFxuICBDbGllbnRMb2NhdG9yLFxuICBDbGllbnRQZXJmb3JtYW5jZSxcbiAgQ2xpZW50UGxhY2VyLFxuICBDbGllbnRTdXJ2ZXksXG4gIENsaWVudFN5bmMsXG4gIExvYWRlcixcbiAgbW90aW9uSW5wdXQsXG4gIE9yaWVudGF0aW9uLFxuICBXZWxjb21lLFxuICBkaXNwbGF5OiB7XG4gICAgVmlldyxcbiAgICBCdXR0b25WaWV3LFxuICAgIENhbnZhc1ZpZXcsXG4gICAgU2VnbWVudGVkVmlldyxcbiAgICBTZWxlY3RWaWV3LFxuICAgIFNwYWNlVmlldyxcbiAgICBTcXVhcmVkVmlldyxcbiAgICBUb3VjaFN1cmZhY2UsXG4gICAgZGVmYXVsdFRlbXBsYXRlcyxcbiAgICBkZWZhdWx0VGV4dENvbnRlbnRzLFxuICAgIFJlbmRlcmVyLFxuICAgIFJlbmRlcmluZ0dyb3VwLFxuICB9LFxuICB1dGlsczoge1xuICAgIGhlbHBlcnMsXG4gICAgbWF0aCxcbiAgICBzZXR1cCxcbiAgfSxcbn07XG4iXX0=