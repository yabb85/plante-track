const path = require('path')

module.exports = {
	mode: 'production',
	entry: {
		'app': path.join(__dirname, 'js/app.js')
	},
	output: {
		path: path.join(__dirname, 'ueki/static/'),
		filename: 'app.js'
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
				use: [ 'style-loader', 'css-loader']
			},
		]
	},
	plugins: [
	]
}
