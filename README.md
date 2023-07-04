# soundworks

[![npm version](https://badge.fury.io/js/@soundworks%2Fcore.svg)](https://badge.fury.io/js/@soundworks%2Fcore)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

![soundworks-logo](./assets/logo-200x200.png)

Open-source creative coding framework for distributed applications based on Web technologies.

Primarily focused on music, **soundworks** aims at supporting rapid development of real-time distributed applications using _JavaScript_. It provides abstractions to hide the complexity of the network and to foster very rapid-prototyping and trial-and-error workflows that are typical in artistic practices.

*__WARNING: The version 4 of `@soundworks/core` is under heavy development.__*

## Getting Started

The best and most simple way to start using **soundworks** is to use the `@soundworks/create` wizard. 

```sh
npx @soundworks/create@latest
```

![./assets/soundworks-create-min.gif](./assets/soundworks-create-min.gif)

See [https://soundworks.dev/tutorials/getting-started.html](https://soundworks.dev/tutorials/getting-started.html) for more informations on the wizard and how to start with **soundworks**.

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

Feel welcome to open an [issue](https://github.com/collective-soundworks/soundworks/issues) or a PR if you find any inconsistency, error or missing information in the documentation.

## Share with Us

If you made an application using **soundworks** please let us know here: https://github.com/collective-soundworks/soundworks/discussions/61

## TypeScript Support

Basic TypeScript support will be proposed in a (hopefully) near future. 

However, for maintenance reasons, we aim at following the TC39 and W3C specifications as close as possible. Therefore, we will wait for the https://github.com/tc39/proposal-type-annotations proposal to reach stage 3 to update the source code in a more integrated manner.

## Install

Note that the `@soundworks/core` package is automatically installed when creating an application using the `@soundworks/create` wizard, so most of the time you should not have to install this package manually. See [https://soundworks.dev/guides/getting-started.html](https://soundworks.dev/guides/getting-started.html) for more informations on the **soundworks** wizard.

```
npm install @soundworks/core
```

## Credits

[https://soundworks.dev/credits.html](https://soundworks.dev/credits.html)

## License

[BSD-3-Clause](./LICENSE)

