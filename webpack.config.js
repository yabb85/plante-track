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
		extractCSS
	]
}
