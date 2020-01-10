# PROBLEMS.md


## StateManager

- make it smarter and more dynamic: allow to update schemas in real time, etc.
- problem of collections
- problem of being able to attach to a state server-side on a state created by the server (imply another transport strategy, i.e. EventEmitter)
- create / update / delete schema dynamically
- how to handle Collections
- modifying several schemas at once to minimize network bandwodth (prepare -> commit)
- passing modifier that are called before propagating the set / or before the subscribers are called (use-case: keep to variables synchronized : gain + volume)
- we need to differenciate if the state as been destroyed or if the client just detached from its own (cf. CoMo, if the session is deleted from file system, the client must know it to set it session to null), so we need a 
`onDelete` callback, that should be called after the `onDetach` if the state is destroyed by the owner. (ok - to be confirmed...)


## ServiceManager.client

Problem of forwarding service init state is not clean, rely on `instance.state`
cf. line 152
