const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) =>
  context.resolveRequest(
    context,
    moduleName === 'tslib' ? require.resolve('tslib/tslib.es6.js') : moduleName,
    platform,
  );

module.exports = config;
