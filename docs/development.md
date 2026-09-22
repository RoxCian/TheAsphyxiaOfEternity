# Development Reference
## Getting Started
Since the project needs to be build, it will do nothing if you copy the project directory to plugins folder of Asphyxia CORE. You can follow these steps to build the project:
### Prerequisite
- node.js (^22.22.3 or ^24.15.0 or ^26.0.0)
- Asphyxia CORE (^1.50a)

If you have already installed Asphyxia CORE on your local machine with save data created, it is recommended to install another instance of Asphyxia CORE for development.
### Setup
You can setup the development environment by command line:
```bash
npm run restore
```
You need to specify the directory of Asphyxia CORE, debug name of plugin, and a REFID for webui debugging during setup.
### Debug
Run this command line to start debug session:
```bash
npm run debug
```
It will clone contents in `server/` to debugging plugin folder under Asphyxia CORE plugins directory, then start Asphyxia CORE in dev mode and Angular debugging server.

Default port of debug webui page is 57357. You can specify the port in ng serve configurations of `client/angular.json`.

If you modify source code of server during debugging, you can close the Asphxia CORE. The debug script will synchronize changes to debugging plugin folder and restart Asphyxia CORE.

Press Ctrl + C / Command + C to terminate the debug session.
### Build
Run this command line to build the project:
```bash
npm run build
```
Package will be generated under `dist/`.