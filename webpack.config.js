var path = require('path');

module.exports = {
	entry: './src/app.js',
	output: {
		path: path.resolve(__dirname, "dist"),
		filename:'app.bundle.js'
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: '/node_modules/',
			loader: 'babel-loader',
			query: {
				presets: ['es2015', 'stage-0'],
				plugins: ['transform-class-properties'],
			}
		},
		{
      test: /\.glsl$/,
      use: 'raw-loader'
    }]
	},
	devServer: {
	  contentBase: path.join(__dirname, "dist"),
	  compress: true,
	  port: 9000,
		open: true
	}
}
