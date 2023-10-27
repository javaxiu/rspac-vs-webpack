/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs-extra');
const path = require('path');
const childProcess = require('child_process');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { getWebpackConfig } = require('build-scripts-config');
const Analyze = require('webpack-bundle-analyzer');
const os = require('os');

const PUBLIC_PATH = process.env.CDN_URL || '/';
const isWin = os.platform() === 'win32';

module.exports = (api) => {
  const { onGetWebpackConfig, registerTask, context: { webpack, command }, registerCliOption, onHook } = api;
  registerTask('components', getWebpackConfig());

  onGetWebpackConfig('components', (chain) => {
    chain.entryPoints.clear();
    chain.externals({
      react: 'var window.React',
      'react-dom': 'var window.ReactDOM',
    });
    chain.module.rule('tsx').use('ts-loader')
      .tap(options => ({ ...options, configFile: path.resolve(__dirname, './tsconfig.json') }));
    chain.module.rule('tsx').exclude.clear();
    chain.resolve.plugin('tsconfigpaths').use(TsconfigPathsPlugin, [
      {
        configFile: path.resolve(__dirname, './tsconfig.json'),
      },
    ]);
    chain.stats('errors-only');
    chain.mode('production');
    chain.devtool(false);
    chain.optimization.minimizer('terser').use(TerserPlugin, [{
      extractComments: false,
    }]);
    chain.optimization.set('usedExports', true);
    chain.plugin('analyze').use(Analyze.BundleAnalyzerPlugin, [])
    chain.resolve.alias.set('react/jsx-runtime', 'react/jsx-runtime.js');
    chain.resolve.alias.set('react/jsx-dev-runtime', 'react/jsx-dev-runtime.js');

    chain.merge({
      entry: {
        app: './src/app.tsx'
      },
      output: {
        library: '[name]',
        libraryTarget: 'umd',
        filename: 'webpack_output.js',
      },
    });
  });
};
