const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CompressionPlugin = require("compression-webpack-plugin")

module.exports = {
	mode: 'production',
	entry: {
		'app': path.join(__dirname, 'js/app.js'),
		'style': path.join(__dirname, 'css/app.css')
	},
	output: {
		path: path.join(__dirname, 'ueki/static/'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015'],
					comments: false
				}
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			},
		]
	},
	plugins: [
		new CompressionPlugin({
			cache: true
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
		})
	]
}
