# Presentation

*Soundworks* is a Javascript framework that enables artists and developers to create collaborative music performances where a group of participants distributed in space use their mobile devices to generate sound and light through touch and motion.

The framework is based on a client/server architecture supported by `Node.js` (`v0.12.0` or later) [TODO: ugrapde to v4] and WebSockets, and uses a modular design to make it easy to implement different performance scenarios: the [`soundworks-template`](https://github.com/collective-soundworks/soundworks-template) allows anyone to bootstrap a scenario based on *Soundworks* and focus on its audiovisual and interaction design instead of the infrastructure.

# Quick, I want to get started!

If you want to hack in right away, your best best is to go straight to the [`soundworks-template`](https://github.com/collective-soundworks/soundworks-template) repository. Additionally, you'll find a few scenario examples in the [Collective Soundworks](https://github.com/collective-soundworks) organization, such as [*Beats*](https://github.com/collective-soundworks/soundworks-beats), [*Drops*](https://github.com/collective-soundworks/soundworks-drops), [*Paths*](https://github.com/collective-soundworks/soundworks-paths) or [*Wandering Sound*](https://github.com/collective-soundworks/soundworks-wanderingsound). Don't hesitate to have a look at them!

# Modules provided by the library

The *Soundworks* library provides a set of modules that are used in many scenarios:  
- `Calibration`, used to compensate the audio latency (between the command to output a sound, and the moment the device's speaker actually outputs the sound);
- `Checkin`, obtains a client index and, optionally, a set of spatial coordinates in a static setup;
- `Control`, allows to control some parameters of the performance in real time;
- `Dialog` (client side only), displays a dialog and waits for the participant to touch the screen;
- `Filelist`,;
- `Loader`, pre-loads a set of audio files required by the application;
- `Locator`, ;
- `Orientation` (client side only), calibrates the compass in interaction with the participant;
- `Performance`, ;
- `Placer`, ;
- `Platform` (client side only), checks whether the client device and browser are capable to run the application properly, and displays a blocking dialog if not;
- `Selector` (client side only), ;
- `Setup`, loads or generates the setup of a performance space including a surface (*i.e.* dimensions and outlines) and predefined positions (*i.e.* coordinates and labels);
- `Space`, ;
- `Survey`, ;
- `Sync`, synchronizes the client clock to the server.

# Authors

- [Sébastien Robaszkiewicz](mailto:hello@robi.me)
- [Norbert Schnell](mailto:Nobert.Schnell@ircam.fr)
- [Benjamin Matuszewski](mailto:Benjamin.Matuszewski@ircam.fr)
- [Jean-Philippe Lambert](mailto:Jean-Philippe.Lambert@ircam.fr)

# License

BSD-3
