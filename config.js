var path = require('path')
var APP_NAME = 'Mapeo'
var APP_TEAM = 'Digital Democracy'
var buildConfig = require('./src/build-config')
var APP_VERSION = buildConfig.version
/**
 * This is very confusing due to the fact that this file is used across two different contexts, where one is bundled via webpack (renderer)
 * and the other is not (main). For context, we need this to work in the following situations:
 *
 * - The development environment (when you have a .env file)
 * - In CI (when you have an env variable exported in the shell),
 * - When the app is packaged via electron-builder (renderer code is bundled via webpack, main process code is essentially Node code that gets executed by an Electron executable)
 *
 * How this is implemented on a technical level:
 *
 * - In the renderer process, process.env.MAPBOX_ACCESS_TOKEN gets replaced inline by dotenv-webpack.
 * - In the main process, process.env.MAPBOX_ACCESS_TOKEN is not defined (unless you export an environment variable when running the app via the CLI).
 *   In order for the main process to get access to this value, we use electron-builder to read the env variable in the build environment and
 *   add a field called `mapboxAccessToken` to the packaged package.json file. This is read at runtime by the main process and eventually used in this variable.
 */
var MAPBOX_ACCESS_TOKEN =
  process.env.MAPBOX_ACCESS_TOKEN || buildConfig.mapboxAccessToken

function getResourcesDir (isDev) {
  // If running from Node, process.type is not defined
  const isElectron = typeof process.type === 'string'
  if (!isElectron || isDev) return path.join(__dirname, 'temp-resources')
  return process.resourcesPath
}

function getDefaultConfigDir (isDev) {
  // This is super confusing... due to hard-coded paths in @mapeo/settings
  // TODO: Clean all of this up in mapeo-server and @mapeo/settings
  return path.join(getResourcesDir(isDev), 'presets')
}

module.exports = {
  APP_NAME,
  APP_TEAM,
  APP_VERSION,
  MAPBOX_ACCESS_TOKEN,
  GITHUB_URL: 'https://github.com/digidem/mapeo-desktop',
  GITHUB_URL_RAW:
    'https://raw.githubusercontent.com/digidem/mapeo-desktop/master',
  getResourcesDir,
  getDefaultConfigDir
}
