import {Configuration} from 'webpack';
import {commonConfig} from './webpack.common';

const config: Configuration = {
  ...commonConfig,
  mode: 'development',
  optimization: {
    minimize: false
  },
};

export default config;