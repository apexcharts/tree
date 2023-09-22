const path = require('path');

module.exports = {
  entry: './src/OrgChart.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, 'src')],
        use: 'ts-loader',
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'eval-source-map',
  output: {
    publicPath: 'public',
    filename: 'OrgChart.js',
    path: path.resolve(__dirname, 'dist'),
  },
};