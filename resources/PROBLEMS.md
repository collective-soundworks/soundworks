# PROBLEMS.md


## StateManager

- make it smarter and more dynamic
- problem of collections
- problem of attaching server-side on a state created by the server
- create / update / delete schema dynamically
- how to handle Collections
- modifying several schemas at once to minimize network bandwodth (prepare -> commit)
- passing modifier that are called before propagating the set / or before the subscribers are called (use-case: keep to variables synchronized : gain + volume)


## ServiceManager.client

Problem of forwarding service init state is not clean, rely on `instance.state`
cf. line 152
