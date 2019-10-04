# Skywire Manager

Frontend application that allows to manage a group of Skywire nodes through a Hypervisor instance.

Note: The software is still under heavy development and the current version is intended for public testing purposes only.

## Prerequisites

The Skywire Manager requires Node 8.11.0 or higher, together with NPM 6.0.0 or higher.

## Initial configuration

Dependencies needed for this app are managed with NPM and are not included in the repository, so you must run the `npm install`
command on this folder before being able to tun the app.

## Hypervisor configuration

At this time the app can only be connected to a Hypervisor instance running with authentication disabled, so you will have to
set `enable_auth` to `false` in the Hypervisor configuration file or run it with `-m`.

Also, the Hypervisor instance must be running in `http://localhost:8080`. If it is running in another URL, you can change it in
[proxy.config.json](proxy.config.json) before running the app.

## Running the app

Run `npm run start` to start a dev server. After that, yo can access the app by navigating to `http://localhost:4200/#/nodes`
with a web browser. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.
