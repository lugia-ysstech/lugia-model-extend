export default {
  disableCSSModules: true,
  cssModulesWithAffix: true,
  entry: './src/index.tsx',
  applyWebpack(webpackConfig) {
    return webpackConfig;
  }
};
