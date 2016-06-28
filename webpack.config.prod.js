var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS = new ExtractTextPlugin('app.css');

module.exports = {
	entry: {
		app: [
			'./css/app.css',
			'./js/app.js'
		]
	},
	output: {
		path: './app/static/',
		filename: 'app.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /(node_modules|bower_components)/,
				query: {
					presets: ['react', 'es2015'],
					comments: false
				}
			},
			{
				test: /\.css$/,
				loader: extractCSS.extract(['css'])
			}
		]
	},
	plugins: [
		extractCSS,
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress:{
				warnings: true
			}
		})
	]
}
