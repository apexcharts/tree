import {Configuration} from 'webpack';

export default (argv: any, env: any = {mode: 'production'}): Configuration => {
  const mode = argv?.mode || env.mode;
  const config: Configuration = require(`./webpack.${mode === 'development' ? 'dev' : 'prod'}`).default;
  return config;
};
