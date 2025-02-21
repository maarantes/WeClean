const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  transformer: {
    ...defaultConfig.transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  },
  resolver: {
    ...defaultConfig.resolver,
    assetExts: defaultConfig.resolver.assetExts
      .filter(ext => ext !== "svg")
      .concat(["ttf", "png", "jpg", "jpeg", "gif", "mp4", "wav", "mp3"]),
    sourceExts: [...defaultConfig.resolver.sourceExts, "svg"],
  },
};