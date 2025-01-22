const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

// Adjusting asset and source extensions for SVG support
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
defaultConfig.resolver.sourceExts.push("svg");

// Adding the SVG transformer
defaultConfig.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);

module.exports = mergeConfig(defaultConfig, {});
