## should throw clean Error

```
const server = new Server();
server.start();
> `server.start` cannot be called before `server.init`
```

```
const server = new Server();
server.stop();
> `server.stop` cannot be called before `server.init`
> or
> `server.stop` cannot be called before `server.start`
```
