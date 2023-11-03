import path from 'path';
import { Compiler, Configuration, WebpackPluginInstance } from 'webpack';

export const ROOT = path.resolve(__dirname, '.');

interface CommonConfig extends Configuration {
  plugins: (((this: Compiler, compiler: Compiler) => void) | WebpackPluginInstance)[];
}

export const commonConfig: CommonConfig = {
  entry: [path.resolve(__dirname, 'src/ApexTree.ts')],
  output: {
    clean: true,
    filename: 'ApexTree.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ApexTree',
    libraryTarget: 'umd',
    libraryExport: 'ApexTree',
  },
  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)?$/,
        include: [ROOT],
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              // Rely on babel loading it's `babel.config.js` file. If we need to edit it for
              // Hot Module Reloading support so be it.
              // https://gist.github.com/rmoorman/94eeed830942758e218d92f15ce58d88
              presets: [['@babel/preset-env', {targets: 'defaults'}]],
              plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime'],
            },
          },
        ],
      },
      {
        test: /\.ts?$/,
        include: [ROOT],
        exclude: [/node_modules/],
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
      },
      { test: /\.(less)$/, loader: "asset/resource" }
    ],
  },
  resolve: {
    modules: [__dirname, 'src', 'node_modules'],
    extensions: ['.ts', '.js'],
  },
  plugins: [],
};
