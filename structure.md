
./display:
  ButtonView.js
  CanvasView.js
  Renderer.js
  RenderingGroup.js
  SegmentedView.js
  SelectView.js
  SpaceView.js
  SquaredView.js
  TouchSurface.js
  View.js
  defaultTemplates.js
  defaultTextContents.js
  viewport.js

./core:
  client.js // if(socket.required) socket.init(callback)
  socket.js // required = false
  viewManager.js //

  Process.js
  Activity.js // = CoreProcess with view
  ClientActivity.js // = client/server CoreProcess with view --> socket.required = true;
  Signal.js
  SignalAll.js
  [ LocalStorage.js ]

./activities
  Experience.js
  Survey.js

./services:
  factory.js
  Welcome.js
  Loader.js
  ClientCalibration.js
  ClientCheckin.js
  ClientControl.js
  ClientLocator.js
  ClientNetwork.js // broadcast to client of a certain type (cosima communications)
  ClientPlacer.js
  ClientSurvey.js
  ClientSync.js
  [ ClientFileList.js ]
  [ Orientation.js ]



// OO

Process
Activity extends Process
  -> constructor(hasView, hasNetwork);

Service extends Activity
Experience extends Activity
Coda extends Activity

(POI extends Process|Activity)
