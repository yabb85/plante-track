var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS = new ExtractTextPlugin('app.css');
var CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
	entry: {
		app: [
			'./css/app.css',
			'./js/app.js'
		]
	},
	output: {
		path: './ueki/static/',
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
			},
			{
				test: /\.json$/,
				loader: 'json'
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
			},
			minimize: true,
			output:{
				comments: false
			}
		}),
		new webpack.optimize.AggressiveMergingPlugin(),
		new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio: 0.8
		})
	]
}
