# `soundworks`

![soundworks-logo](./assets/logo-200x200.png)

> Full-stack JavaScript framework for distributed WebAudio and multimedia applications.

## Documentation

[http://collective-soundworks.github.io/soundworks/](http://collective-soundworks.github.io/soundworks/)

## Overview

`soundworks` follows a client / server architecture where the server is written using [Node.js](https://nodejs.org/) and clients can be either regular browser clients or Node.js clients running for example on a Raspberry Pi.

![high-level-architecture](./assets/high-level-architecture.png)

The core of the framework is very minimal and dedicated at handling:
  - Http(s) server and basic routing
  - WebSockets initialization
  - Processes initialization
  - Distributed state management

`soundworks` can be extended with services to reuse common logic such as audio file loading, clock synchronisation, etc. Each service leaves in a separate repo for better modularity and to simplify version management.

## Installation

```
npm install @soundworks/core
```

## Getting Started

[@link to tutorial]()

## Application Template

The simplest way to start a new `soundworks` application is using the application template: 
[https://github.com/collective-soundworks/soundworks-template](https://github.com/collective-soundworks/soundworks-template).

## List of Available Services

@todo

## Academic Papers

- Benjamin Matuszewski. Soundworks - A Framework for Networked Music Systems on the Web - State of Affairs and New Developments. Proceedings of the Web Audio Conference (WAC) 2019, Dec 2019, Trondheim, Norway. <[hal-02387783](https://hal.archives-ouvertes.fr/hal-02387783)>
- Benjamin Matuszewski, Norbert Schnell, Frédéric Bevilacqua. Interaction Topologies in Mobile-Based Situated Networked Music Systems. Wireless Communications and Mobile Computing, Hindawi Publishing Corporation, 2019, 2019, pp.9142490. ⟨10.1155/2019/9142490⟩. <[hal-02086673](https://hal.archives-ouvertes.fr/hal-02086673)>
- Norbert Schnell, Sébastien Robaszkiewicz. Soundworks – A playground for artists and developers to create collaborative mobile web performances. `Proceedings of the Web Audio Conference (WAC'15), 2015, Paris, France. <[hal-01580797](https://hal.archives-ouvertes.fr/hal-01580797)>

## Credits

`soundworks` has been initiated by [Norbert Schnell](https://github.com/NorbertSchnell), [Sébastien Robaszkiewicz](https://github.com/i-Robi), and [Benjamin Matuszewski](https://github.com/b-ma) at the [ISMM](http://ismm.ircam.fr/) team at [Ircam - Centre Pompidou](http://www.ircam.fr/) in the framework of the [*CoSiMa*](http://cosima.ircam.fr/) research project supported by the [French National Research Agency (ANR)](http://www.agence-nationale-recherche.fr/en/).

Futher developments has been supported in the framework of:
- The [RAPID-MIX project](http://rapidmix.goldsmithsdigital.com/), funded by the European Union’s Horizon 2020 research and innovation program
- The Ircam project _BeCoMe_
- The _Constella(c)tions_ residency of the STARTS program of the European Commission.

Development is pursued, led by Benjamin Matuszewski, in the [Interaction Music Movement Team](https://www.stms-lab.fr/team/interaction-son-musique-mouvement/) from the Ircam's STMS-LAB.

## License

[BSD-3-Clause](https://github.com/collective-soundworks/soundworks/blob/master/LICENSE)

