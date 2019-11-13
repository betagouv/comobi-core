// You can't use import statements here
let webpack = require('webpack')
let path = require('path')
let common = require('../webpack.common.js')

let hotEntry =
	common.mode === 'development' ? ['webpack-hot-middleware/client'] : []

module.exports = {
	...common,
	entry: {
		corresplot: [
			...hotEntry,
			path.resolve(__dirname + '/Corresplot/', 'main.js')
		],
		demandes: [...hotEntry, path.resolve(__dirname + '/demandes/', 'main.js')]
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'build'),
		publicPath: '/build/'
	}
}
