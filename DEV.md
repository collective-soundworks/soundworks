# Consideration regarding development *(draft, to be completed, corrected, ...)*

3 main branches can be maintained:

 * `master`: for hosting releases only
 * `develop`: for day to day development purposes, inherently unstable
 * `gh-pages`: for hosting the documentation.


## Releases process

### Create a new Release

In `develop` branch, transpiled files are ignored in order to keep a cleaner git history. For releases however, this files must be part of the commit in order to be consumed by the final application.

 * go to `release|master` branch
 * comment `/client`, `/server` and `/utils` in . to track them
 * run `npm run transpile` to transpile lastest modifications
 * commit changes, `/client`, `/server` and `/utils` should be part of the commit
 * update version: `npm version major|minor|patch|...`, *note:* this command "create a version commit and tag".
 * push to origin: `git push --tags`

### Update Documentation

```
$ git checkout gh-pages
$ esdoc -c esdoc.json
$ git commit -am 'updated doc'
$ git push origin gh-pages
```

