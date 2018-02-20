const path = require('path')
process.traceDeprecation = true;

module.exports = {
	entry: {
		app: [
			path.join(__dirname, 'css/app.css'),
			path.join(__dirname, 'js/app.js')
		]
	},
	output: {
		path: path.join(__dirname, 'ueki/static/'),
		filename: 'app.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /(node_modules|bower_components)/,
				query: {
					presets: ['react', 'es2015'],
					comments: false
				}
			},
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader']
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			}
		]
	},
	plugins: [
	]
}
