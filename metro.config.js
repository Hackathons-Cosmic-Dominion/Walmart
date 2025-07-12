const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Block the components directory from being resolved as a route
config.resolver.blockList = [
  ...Array.isArray(config.resolver.blockList) ? config.resolver.blockList : [],
  new RegExp(path.join(__dirname, 'app', 'components').replace(/\\/g, '\\\\')),
];

// Add SVG support
config.resolver.assetExts.push('svg');
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

module.exports = config;