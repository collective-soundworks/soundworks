# Client/server architecture

In order to connect the mobile devices with each other, *Soundworks* implements a client/server architecture using a `Node.js` server and WebSockets to pass messages between the server and the clients (currently with the `socket.io` library).

*Soundworks*-based scenarios allow different types of clients to connect to the server through different URLs. The most common type of clients is constituted of the participant's mobile devices who take part in the performance. We refer to this type of client as a `player`. For convenience, a `player` client connects to the server through the root URL of the application `http://my.server.address:port/`.

In addition to the `player` clients, a scenario can include as many other types of clients as you want. For instance, one could imagine that:
- A device provides an interface to control some parameters of the performance in real time. We would refer to this type of client as `conductor` and these clients would connect to the server through the URL `http://my.server.address:port/conductor`.
- A device generates “environmental” sound and/or light effects projected into the performance in sync with the participants’ performance (*e.g.* lasers, a global visualization or ambient sounds on external loudspeakers). We would refer to this type of client as `env` and these clients would connect to the server through the URL `http://my.server.address:port/env`.

All types of clients (except `player`) access the server through a URL that concatenates the root URL of the application, and the name of the client type (*e.g* `http://my.server.address:port/conductor` or `http://my.server.address:port/env`).

# Express app structure

Since *Soundworks* uses Express, scenarios built on *Soundworks* should follow the organization of an Express app (using the EJS rendering engine), as shown in the following example.

```
my-scenario/
├── public/
│   ├── fonts/
│   ├── sounds/
│   └── ...
├── src/
│   ├── conductor/
│   │   └── index.es6.js
│   ├── env/
│   │   └── index.es6.js
│   ├── player/
│   │   └── index.es6.js
│   ├── ...
│   │   └── ...
│   ├── sass/
│   │   ├── conductor.scss
│   │   ├── env.scss
│   │   ├── player.scss
│   │   └── ...
│   └── server/
│       └── index.es6.js
├── views/
│   ├── conductor.ejs
│   ├── env.ejs
│   ├── player.ejs
│   └── ...
├── gulpfile.js
├── package.json
└── README.md
```

In particular:

- The `public/` folder contains all the resources the clients may need to load, such as sounds, images, fonts…  
  **Note:** the Javascript and CSS files will be automatically generated from the `src/` folder, so there shouldn’t be any `javascript/` or `stylesheets/` folder here (they will be deleted by `gulp` anyway).
- The `src/` folder contains:
  - The `server/` subfolder that contains at least an `index.es6.js` with the source code of the server;
  - The `player/` subfolder that contains at least an `index.es6.js` with the source code of the `player` clients;
  - A subfolder for each other type of client (*e.g.* `conductor/` or `env/`). Each of these subfolders should contain at least an `index.es6.js` file with the source code to be executed for that type of client;
  - The `sass/` subfolder, with the SASS partials used to generate the CSS. In particular, each type of client (including `player`) should have its corresponding SASS partial (*e.g.* `player.scss`, `conductor.scss` or `env.scss`).
- The `views/` folder contains a `*.ejs` file for each type of client. In other words, all the subfolders in `src/` (except `server/` and `sass/`) should have their corresponding EJS file (*e.g.* `player.ejs`, `conductor.ejs` or `env.ejs`).

To compile the files from the `src/` folder and launch the server, simply run the command `gulp` in a Terminal window: it will generate the `*.css` files from the SASS files, convert the Javascript files from ES6 to ES5, browserify the files on the client side, and launch a `Node.js` server to start the scenario.

To help you get started, you will find a *Soundworks* template in the [`soundworks-template`](https://github.com/collective-soundworks/soundworks-template) GitHub repository.
