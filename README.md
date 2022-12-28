# `soundworks`

[![npm version](https://badge.fury.io/js/@soundworks%2Fcore.svg)](https://badge.fury.io/js/@soundworks%2Fcore)

![soundworks-logo](./assets/logo-200x200.png)

Open-source creative coding framework for distributed applications based on Web technologies.

Primarily focused on music, `soundworks` aims at supporting rapid development of real-time distributed applications using _JavaScript_. It provides abstractions to hide the complexity of the network and to foster very rapid-prototyping and trial-and-error workflows that are typical in artistic practices.

*__WARNING: The version 4 of `@soundworks/core` is under heavy development.__*

## Getting Started

The best and most simple way to start using `soundworks` is to use the `@soundworks/create` wizard. 

```sh
npx init @soundworks
```

See [https://soundworks.dev/guides/getting-started.html](https://soundworks.dev/guides/getting-started.html) for more informations on the wizard and how to start with `soundworks`.

<!--
## Documentation

- Guides and Tutorials: [https://soundworks.dev](https://soundworks.dev)
- API: [https://soundworks.dev/api](https://soundworks.dev/api)
-->

## API

The API is not publicly published for now. To access the API documentation locally, just clone this repository, go to the v4 branch and launch some http server in the docs directory. For example, using the [serve](https://www.npmjs.com/package/serve) package:

```sh
git clone https://github.com/collective-soundworks/soundworks.git
cd soundworks
git checkout v4
serve docs
```

## TypeScript Support

Basic TypeScript support will be proposed in a (hopefully) near future. 

However, as we aim to follow the TC39 and W3C specifications as close as possible, we will wait for the https://github.com/tc39/proposal-type-annotations proposal to reach stage 3 to update the source code in a more integrated manner.

## Install

Note that the `@soundworks/core` package is automatically installed when creating an application using the `@soundworks/create` wizard, so most of the time you should not have to install this package manually. See [https://soundworks.dev/guides/getting-started.html](https://soundworks.dev/guides/getting-started.html) for more informations on the `soundworks` wizard.

```
npm install @soundworks/core
```

## Share with Us

If you made an application using `soundworks` please let us know here: https://github.com/collective-soundworks/soundworks/discussions/61

## Academic Papers

- Benjamin Matuszewski. A Web-Based Framework for Distributed Music System Research and Creation. AES - Journal of the Audio Engineering Society Audio-Accoustics-Application, Audio Engineering Society Inc, 2020. <[hal-03033143](https://hal.archives-ouvertes.fr/hal-03033143)>
- Benjamin Matuszewski. Soundworks - A Framework for Networked Music Systems on the Web - State of Affairs and New Developments. Proceedings of the Web Audio Conference (WAC) 2019, Dec 2019, Trondheim, Norway. <[hal-02387783](https://hal.archives-ouvertes.fr/hal-02387783)>
- Benjamin Matuszewski, Norbert Schnell, Frédéric Bevilacqua. Interaction Topologies in Mobile-Based Situated Networked Music Systems. Wireless Communications and Mobile Computing, Hindawi Publishing Corporation, 2019, 2019, pp.9142490. ⟨10.1155/2019/9142490⟩. <[hal-02086673](https://hal.archives-ouvertes.fr/hal-02086673)>
- Norbert Schnell, Sébastien Robaszkiewicz. Soundworks – A playground for artists and developers to create collaborative mobile web performances. `Proceedings of the Web Audio Conference (WAC'15), 2015, Paris, France. <[hal-01580797](https://hal.archives-ouvertes.fr/hal-01580797)>

## Credits

`soundworks` has been initiated by [Norbert Schnell](https://github.com/NorbertSchnell), [Sébastien Robaszkiewicz](https://github.com/i-Robi), and [Benjamin Matuszewski](https://github.com/b-ma) at the [ISMM](http://ismm.ircam.fr/) team at [Ircam - Centre Pompidou](http://www.ircam.fr/) in the framework of the [*CoSiMa*](http://cosima.ircam.fr/) research project supported by the [French National Research Agency (ANR)](http://www.agence-nationale-recherche.fr/en/).

Futher developments has been supported in the framework of:
- The [RAPID-MIX project](http://rapidmix.goldsmithsdigital.com/), funded by the European Union’s Horizon 2020 research and innovation program
- The Ircam projects _BeCoMe_ and _SO(a)P_
- The _Constella(c)tions_ residency of the STARTS program of the European Commission.

Development is pursued, led by Benjamin Matuszewski, in the [Interaction Music Movement Team](https://www.stms-lab.fr/team/interaction-son-musique-mouvement/) from the Ircam's STMS-LAB.

## License

[BSD-3-Clause](https://github.com/collective-soundworks/soundworks/blob/master/LICENSE)

