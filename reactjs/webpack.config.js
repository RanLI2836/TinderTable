module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    // noParse: [
    //   /aws\-sdk/,
    // ],
    // target: 'web'
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        cacheDirectory: true,
        presets: ['react', 'es2015', 'stage-1']
      }
    },{
      test: /\.json$/,
      loaders: ['json']
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      querystring: 'querystring-browser'
    }
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};
