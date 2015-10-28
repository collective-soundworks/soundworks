# Presentation

*Soundworks* is a Javascript framework that enables artists and developers to create collaborative music performances where a group of participants distributed in space use their mobile devices to generate sound and light through touch and motion.

The framework is based on a client/server architecture supported by `Node.js` (`v0.12.0` or later) and WebSockets, and uses a modular design to make it easy to implement different performance scenarios: the [`soundworks-template`](https://github.com/collective-soundworks/soundworks-template) allows anyone to bootstrap a scenario based on *Soundworks* and focus on its audiovisual and interaction design instead of the infrastructure.

# Quick, I want to get started!

If you want to hack in right away, your best best is to go straight to the [`soundworks-template`](https://github.com/collective-soundworks/soundworks-template) repository. Additionally, you'll find a few scenario examples in the [Collective Soundworks](https://github.com/collective-soundworks) organization, such as [*Beats*](https://github.com/collective-soundworks/soundworks-beats), [*Drops*](https://github.com/collective-soundworks/soundworks-drops), [*Paths*](https://github.com/collective-soundworks/soundworks-paths) or [*Wandering Sound*](https://github.com/collective-soundworks/soundworks-wanderingsound). Don't hesitate to have a look at them!

# Modules provided by the library

The *Soundworks* library provides a set of modules that are used in many scenarios:  
- [`dialog`](#clientdialog), displays a dialog and waits for the participant to touch the screen (client side only);
- [`loader`](#clientloader), pre-loads a set of audio files required by the application (client side only);
- [`orientation`](#clientorientation), calibrates the compass in interaction with the participant (client side only);
- [`platform`](#clientplatform), checks whether the client device and browser are capable to run the application properly, and displays a blocking dialog if not (client side only);
- [`checkin`](#checkin), obtains a client index and, optionally, a set of spatial coordinates in a static setup;
- [`control`](#control), allows to control some parameters of the performance in real time;
- [`setup`](#setup), loads or generates the setup of a performance space including a surface (*i.e.* dimensions and outlines) and predefined positions (*i.e.* coordinates and labels);
- [`sync`](#sync), synchronizes the client clock to the server.
