# Client / server architecture, URLs and routes

In order to connect the mobile devices with each other, *Soundworks* implements a client/server architecture using a Node.js server and WebSockets to pass messages between the server and the clients.

*Soundworks*-based scenarios allow different types of clients to connect to the server through different URLs. The most common type of clients is constituted of the participant's mobile devices who take part in the performance. We refer to this type of client as a `'player'`. For convenience, a `'player'` client connects to the server through the root URL of the application `http://my.server.address:port/`.

In addition to the `'player'` clients, a scenario can include as many other types of clients as you want. For instance, one could imagine that:
- A device provides an interface to control some parameters of the performance in real time. We would refer to this type of client as `'conductor'` and these clients would connect to the server through the URL `http://my.server.address:port/conductor`.
- A device generates “environmental” sound and/or light effects projected into the performance in sync with the participants’ performance (*e.g.* lasers, a global visualization, or ambient sounds on external loudspeakers). We would refer to this type of client as `'env'` and these clients would connect to the server through the URL `http://my.server.address:port/env`.

All types of clients (except `'player'`) access the server through a URL that concatenates the root URL of the application, and the name of the client type (*e.g* `http://my.server.address:port/conductor` or `http://my.server.address:port/env`).

# Directory structure

Scenarios built on *Soundworks* should follow the following directory structure (in the following example, there are three types of clients: `'player'`, '`conductor'` and `'env'`). Start from the [`soundworks-template`](https://github.com/collective-soundworks/soundworks-template) repository to make sure you have all the necessary files to make everything work (such as `bin/scripts` and `package.json`).

```
my-scenario/
├── bin/
│   └── scripts
├── public/
│   ├── css/
│   ├── fonts/
│   ├── js/
│   ├── sounds/
│   └── ...
├── sass/
│   ├── conductor.scss
│   ├── env.scss
│   ├── player.scss
│   └── ...
├── src/
│   ├── client/
│   │   ├── conductor/
│   │   │   ├── index.js
│   │   │   └── ...
│   │   ├── env/
│   │   │   ├── index.js
│   │   │   └── ...
│   │   ├── player/
│   │   │   ├── index.js
│   │   │   └── ...
│   │   └── ...
│   └── server/
│       ├── index.js
│       └── ...
├── views/
│   ├── conductor.ejs
│   ├── env.ejs
│   ├── player.ejs
│   └── ...
├── package.json
└── README.md
```

In particular:

- The `public/` folder contains all the resources the clients may need to load, such as sounds, images, fonts…
  **Note:** the Javascript and CSS files will be automatically generated from the `src/` folder into the `public/js/` and `public/css/` subfolders.
- The `src/` folder contains:
  - The `client/` subfolder, that contains one subfolder for each client type (`player/` is a mandatory subfolder):
    - Each client type subfolder contains an `index.js` file, and any other Javascript files with the source code for that client type;
  - The `server/` subfolder, that contains an `index.js` file, and any other Javascript files with the source code for the server;
- The `sass/` subfolder, with the SASS partials used to generate the CSS. In particular, each type of client (including `'player'`) should have its corresponding SASS partial (*e.g.* `player.scss`, `conductor.scss` or `env.scss`).
- The `views/` folder contains a `*.ejs` file for each client type: all the subfolders in `src/client/` should have their corresponding EJS file (*e.g.* `player.ejs`, `conductor.ejs` or `env.ejs`).

# Build

There are a few node scripts you can use to build files from the source files. In a Terminal window:
- `npm run start` starts the server;
- `npm run bundle` builds all the necessary files from the source files;
- `npm run watch` watches for changes in the source files and restarts the server when necessary.

# Modules provided by the library

*Soundworks* provides a set of modules that can be used in many scenarios.
Please refer to the [Reference](../identifiers.html) page for an exhaustive list.
