## v4.0.0-alpha.20 - 19/02/2024

- Refactor heartbeat - #86
- Refactor state collection - #85
- Fix issue with self signed certs and config generated by wizard - #84

## v4.0.0-alpha.19 - 17/01/2024

- Hotfix for #85

## v4.0.0-alpha.18 - 15/01/2024

- Batch network message for SharedStates

## v4.0.0-alpha.17 - 16/12/2023

- Support bundling the server to cjs for Max externals

## v4.0.0-alpha.16 - 15/12/2023

- Improve StateCollection performances

## v4.0.0-alpha.15 - 13/12/2023

- Fix several issues with shared states
- **Breaking Change**: by default, `StateManager::observe` and `SharedStateCollection` now retrieve locally created states
