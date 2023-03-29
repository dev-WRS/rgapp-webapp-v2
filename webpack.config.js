const path = require('path')

module.exports = (env = process.env.NODE_ENV, args) => {
	const isProduction = (env === 'production')

	let plugins = []

	return {
		mode: isProduction ? 'production' : 'development',
		entry: ['@babel/polyfill', './src/csr.js'],
		output: {
			path: path.resolve(process.cwd(), 'src', 'build'),
			filename: 'bundle.js'
		},
		module: {
			rules: [
				{ test: /\.css$/, use: ['style-loader', 'css-loader'] },
				{ test: /\.(png|svg|jpg|jpeg|gif)$/, type: 'asset/resource' },
				{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
			]
		},
		plugins
	}
}