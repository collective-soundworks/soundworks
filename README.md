# soundworks

[![npm version](https://badge.fury.io/js/@soundworks%2Fcore.svg)](https://badge.fury.io/js/@soundworks%2Fcore)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

![soundworks-logo](./misc/assets/logo-200x200.png)

Open-source creative coding framework for distributed applications based on Web technologies.

Primarily focused on music, **soundworks** aims at supporting rapid development of real-time distributed applications using _JavaScript_. It provides abstractions to hide the complexity of the network and to foster very rapid-prototyping and trial-and-error workflows that are typical in artistic practices.

## Documentation

- Guides and Tutorials: [https://soundworks.dev](https://soundworks.dev)
- API: [https://soundworks.dev/api](https://soundworks.dev/api)

## Getting started

The best and most simple way to start using **soundworks** is to use the `@soundworks/create` wizard. 

```sh
npx @soundworks/create@latest
```

![soundworks-create](./misc/assets/soundworks-create-min.gif)

See [https://soundworks.dev/tutorials/getting-started.html](https://soundworks.dev/tutorials/getting-started.html) for more information on the wizard and how to start using **soundworks**.

## Misc

### TypeScript support

Basic TypeScript support will be proposed in a (hopefully) near future. 

However, for maintenance reasons, we aim at following the TC39 and W3C specifications as close as possible. Therefore, we will wait for the https://github.com/tc39/proposal-type-annotations proposal to reach stage 3 to update the source code in a more integrated manner.

### Manual install

Note that the `@soundworks/core` package is automatically installed when creating an application using the `@soundworks/create` wizard, so most of the time you should not have to install this package manually. See [https://soundworks.dev/guides/getting-started.html](https://soundworks.dev/guides/getting-started.html) for more information on the **soundworks** wizard.

```
npm install @soundworks/core
```

## Share with Us

If you made an application using **soundworks** please let us know here: https://github.com/collective-soundworks/soundworks/discussions/61

## Credits

[https://soundworks.dev/credits.html](https://soundworks.dev/credits.html)

## License

[BSD-3-Clause](./LICENSE)

