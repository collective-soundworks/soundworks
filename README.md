# Soundworks

***Soundworks*** is a framework to create collaborative/collective audiovisual experiences where users interact through their mobile devices.
The framework is entirely based on web APIs with a *Node.js* server and provides a set of services to easily setup the infrastructure and the most basic functionalities of an application.

The fundamental motivation behind all design choices of the framework is to allow developers to focus on the implementation of audiovisual rendering and interaction design based on web standards.

A *Soundworks* application is typically organized in a client part (i.e. running in the web browser of the client devices) and an optional server part (i.e. running in Node.js).
The server part of an application allows the connected clients to exchange data and to influence each other's audiovisual rendering.
*Client-only* applications created with the frameworks can be deployed through a simple HTTP server instead of Node.js.

## Getting Started

### Requirements

Developing *Soundworks* applications requires [*Node.js*](https://nodejs.org/) (>= 0.12).

The framework heavily relies on the [*Web Audio API*](https://www.w3.org/TR/webaudio/) as well as on other upcoming standards, which may limit the compatible platforms (i.e. browsers) on the client side of the applications.

### Template

The recommended way of developing a *Soundworks* application is to start from the ***template*** at [https://github.com/collective-soundworks/soundworks-template/](https://github.com/collective-soundworks/soundworks-template/).

The template includes comprehensive comments in the code.
Please refer to the repository's README file for further instructions and documentation.

## Basic Concepts

The framework is implemented in ES2015 using the *Babel* JavaScript compiler.
It provides scripts to support the development of applications based on ES2015 functions and abstraction such `class`, `import` and `export`.

### Different Client Types

A *Soundworks* application can implement one or multiple *types* of clients. Generally, different ***client types*** correspond to different roles participants or connected objects (e.g. audiovisual rendering devices) take in an application scenario.
Technically, a *client type* corresponds to an URL that allows to connect to the application server - and, ultimately, a *Socket.IO namespace*.

By default, the `player` *client type* is associated to the base URL of the application (e.g. http://my.soudworks-app.mobi/).
An additional client type `referee` of the same application would, for example, use the same URL extended by "referee/" (i.e. http://my.soudworks-app.mobi/referee/).

Apart from `player`, different client types occurring in applications that we have developed with *Soundworks* include, for example:
 * `soloist` - a participant with a soloist role in a musical application
 * `conductor`- a web client for controlling the global parameters of an application
 * `shared-env` - a graphical representation or audio rendering projected into the environment of the application (i.e. by a video projector and/or public sound system)

Generally, each client type is mapped to an *experience* implemented on both sides of the application, the client and, optionally, the server.

### The Experience

The actual scenario of a *Soundworks* application, the ***experience***, is implemented as extensions of the `ClientExperience` and `ServerExperience` classes.

The implementation of the client side of an application essentially consists of a `ClientExperience` that generally defines the interactions and the audiovisual rendering on the users' mobile devices.
The corresponding `ServerExperience` determines the interactions between the connected clients by implementing how the server reacts on the connection of web clients of given types and on messages received from these clients.

The experiences can require and configure a set of services provided by the *Soundworks* framework (see below).

On the client side, the `ClientExperience` of a given client type is started when the required services are ready.
On the server side, the methods `enter` and `exit` of `ServerExperience` are called when a client of the corresponding client type connects to or disconnects from the applications - after having announced the connection or disconnection to concerned services.

### A set of Services

Apart from the abstractions mentioned above, the most important aspect of the framework is to provide a set of ***services*** to an application.
The services currently provided include, for example:
 * `welcome` - shows a welcome screen and checks for the compatibility of the application with the user's device, OS, and browser
 * `checkin` - automatically assigns a ticket or predefined position (i.e. number or label with optional coordinates) to the user
 * `placer` - lets the user chose an available ticket or predefined position
 * `locator` - lets the user indicate an approximate position on a map
 * `loader` - preloads audio and other content files
 * `sync` - provides a synchronized clock to all clients
 * `scheduler` - differs function calls and schedules recurrent events in reference to the synchronized clock or a local audio clock
 * `motion-input` - provides unified access to the mobile device's motion sensors (based on the `DeviceMotion` and `DeviceOrientation` APIs)
 * `shared-params` - global variables and commands shared by the clients of defined types

 The framework provides an API for extending the set of available services.

### Views and View Templates

The graphical rendering and interaction on a client screen is managed through ***views*** with ***view templates*** (strongly inspired by the *backbone* view API).
The framework provides the possibility to define the HTML content of a view through view templates based on the *lowdash*/*underscore* syntax.
In addition, the views and view templates allow for defining callbacks for user input events (e.g. *touch* and *click* events) and for reacting on device orientation changes.

The views of an experience as well as of the provided services can be customized through CSS/SASS styles and by changing the content fitting the associated view templates.
Different configurations of an application may include customized view content to generate different variants and localizations of the same screens.

The content fitting a view template can be changed dynamically (e.g. depending on a user interaction) whereby the view can be updated partially (i.e. only a specific HTML tag).
Default CSS/SASS styles for the provided templates (used by the services and experiences) are part of the *Soundworks* application template.

An advanced way of creating customized views consists in choosing alternative view templates and/or views among a set of provided templates and view classes.
The `CanvasView` class, for example, implements a formalism that facilitates the implementation of canvas-based rendering through a `Renderer` abstraction.

Ultimately, developers can create customized views extending the `View` base class or one of the provided view classes.

## Further Examples

Apart from the template, the [*collective-soundworks*](https://github.com/collective-soundworks) GitHub project includes the following example applications with comprehensively commented code:
 * Soundfield - [https://github.com/collective-soundworks/soundworks-soundfield/](https://github.com/collective-soundworks/soundworks-soundfield/)
 * Drops - [https://github.com/collective-soundworks/soundworks-drops/](https://github.com/collective-soundworks/soundworks-drops/)

Please refer to the repositories' README file for further instructions and documentation.

## License and Credits

The *Soundworks* framework is released under the [BSD 3-Clause](https://opensource.org/licenses/BSD-3-Clause) license.

*Soundworks* has been initiated by [Norbert Schnell](mailto:Nobert.Schnell@ircam.fr), [Sebastien Robaszkiewicz](mailto:Sebastien Robaszkiewicz@gmail.com), and [Benjamin Matuszewski](mailto:Benjamin.Matuszewski@ircam.fr) at the [ISMM](http://ismm.ircam.fr/) team at [Ircam - Centre Pompidou](http://www.ircam.fr/) in the framework of the [*CoSiMa*](http://cosima.ircam.fr/) research project supported by the [French National Research Agency (ANR)](http://www.agence-nationale-recherche.fr/en/).

The framework integrates parts of the [WaveJS library](https://github.com/wavesjs).
