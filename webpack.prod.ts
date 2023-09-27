import {Configuration} from 'webpack';
import {commonConfig} from './webpack.common';

const config: Configuration = {
  ...commonConfig,
  mode: 'production',
};

export default config;